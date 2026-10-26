// Browser behaviour tests. All requests and timers are local test doubles.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');

const source = fs.readFileSync(path.join(__dirname, '../assets/homepage-traffic.js'), 'utf8');
const endpoint = 'https://counter.example.workers.dev';
const cacheKey = `portfolio-traffic:${endpoint}`;
const counts = (values = {}) => ({
  views: 1234,
  visitors: 56,
  since: '2026-10-26T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  ...values,
});
const flush = () => new Promise((resolve) => setImmediate(resolve));

function createPage(options = {}) {
  const views = { textContent: '—' };
  const visitors = { textContent: '—' };
  const status = { textContent: '' };
  const nodes = {
    '[data-traffic-views]': views,
    '[data-traffic-visitors]': visitors,
    '[data-traffic-status]': status,
  };
  const counter = {
    querySelector: (selector) => nodes[selector],
    dataset: { counterEndpoint: options.endpoint ?? endpoint },
    hasAttribute: () => Boolean(options.preview),
  };
  const storage = options.storage ?? new Map();
  const timers = new Map();
  const listeners = new Map();
  const requests = [];
  let nextTimer = 0;
  const url = new URL(options.url ?? 'https://jothep.github.io/');
  const document = {
    readyState: options.readyState ?? 'interactive',
    querySelector: () => (options.missingCounter ? null : counter),
  };
  vm.runInNewContext(source, {
    document,
    window: { addEventListener: (event, handler) => listeners.set(event, handler) },
    location: url,
    URL,
    Intl,
    AbortController,
    crypto: { randomUUID },
    localStorage: {
      getItem(key) {
        if (options.blockStorage) throw new Error('Blocked');
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        if (options.blockStorage) throw new Error('Blocked');
        storage.set(key, value);
      },
    },
    fetch(url, config) {
      return new Promise((resolve, reject) => requests.push({ url, config, resolve, reject }));
    },
    setTimeout(callback, delay) {
      timers.set(++nextTimer, { callback, delay });
      return nextTimer;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  function runTimer(delay) {
    const entry = [...timers].find(([, timer]) => timer.delay === delay);
    assert.ok(entry, `Expected a ${delay} ms timer`);
    timers.delete(entry[0]);
    entry[1].callback();
  }
  return {
    counter,
    views,
    visitors,
    status,
    storage,
    timers,
    requests,
    listeners,
    runTimer,
    load() {
      document.readyState = 'complete';
      listeners.get('load')?.();
      runTimer(0);
    },
    async respond(data, ok = true) {
      requests[0].resolve({ ok, json: async () => data });
      await flush();
    },
  };
}

test('counts only after load and a later task, without credentials or referrer', () => {
  const page = createPage();
  assert.equal(page.requests.length, 0);
  page.listeners.get('load')();
  assert.equal(page.requests.length, 0);
  page.runTimer(0);
  assert.equal(page.requests.length, 1);
  assert.equal(String(page.requests[0].url), `${endpoint}/visit`);
  assert.equal(page.requests[0].config.credentials, 'omit');
  assert.equal(page.requests[0].config.referrerPolicy, 'no-referrer');
});

test('already-loaded pages still defer the optional request', () => {
  const page = createPage({ readyState: 'complete' });
  assert.equal(page.requests.length, 0);
  page.runTimer(0);
  assert.equal(page.requests.length, 1);
});

test('local previews cannot accidentally contact production and other routes never count', () => {
  for (const options of [
    { url: 'file:///tmp/index.html' },
    { url: 'http://127.0.0.1:8776/', preview: true },
    { url: 'https://preview.example.com/' },
    { url: 'https://jothep.github.io/certifications/' },
    { endpoint: '' },
    { endpoint: 'http://insecure.example.com' },
    { missingCounter: true },
  ]) {
    const page = createPage(options);
    assert.equal(page.requests.length, 0);
    assert.equal(page.timers.size, 0);
    assert.equal(page.listeners.size, 0);
  }
});

test('explicit loopback preview shows local test counts', async () => {
  const page = createPage({
    url: 'http://127.0.0.1:8776/',
    endpoint: 'http://127.0.0.1:8787',
    preview: true,
  });
  page.load();
  await page.respond(counts());
  assert.equal(page.status.textContent, 'Local test data');
});

test('formats validated counts including zero and saves the actual response', async () => {
  const page = createPage({ url: 'https://jothep.github.io/index.html' });
  page.load();
  await page.respond(counts({ visitors: 0 }));
  assert.equal(page.views.textContent, '1,234');
  assert.equal(page.visitors.textContent, '0');
  assert.equal(page.status.textContent, '');
  assert.equal(JSON.parse(page.storage.get(cacheKey)).views, 1234);
  assert.equal(page.timers.size, 0);
});

test('refresh reuses the visitor identifier but creates a new visit request ID', () => {
  const storage = new Map();
  const first = createPage({ storage });
  const second = createPage({ storage });
  first.load();
  second.load();
  const a = JSON.parse(first.requests[0].config.body);
  const b = JSON.parse(second.requests[0].config.body);
  assert.equal(a.visitorId, b.visitorId);
  assert.notEqual(a.requestId, b.requestId);
});

test('blocked storage still allows views without fabricating unique visitors', async () => {
  const page = createPage({ blockStorage: true });
  page.load();
  assert.equal(JSON.parse(page.requests[0].config.body).visitorId, null);
  await page.respond(counts());
  assert.equal(page.visitors.textContent, '56');
});

test('invalid responses never turn into displayed numbers or cache entries', async () => {
  for (const data of [
    null,
    {},
    counts({ views: -1 }),
    counts({ views: '12' }),
    counts({ views: 1.2 }),
    counts({ visitors: 2000 }),
    counts({ updatedAt: 'bad' }),
    counts({ views: Number.MAX_SAFE_INTEGER + 1 }),
  ]) {
    const page = createPage();
    page.load();
    await page.respond(data);
    assert.equal(page.views.textContent, '—');
    assert.equal(page.status.textContent, 'Temporarily unavailable');
    assert.equal(page.storage.has(cacheKey), false);
  }
});

test('timeout aborts, ignores late success and never retries or reloads', async () => {
  const page = createPage();
  page.load();
  page.runTimer(4000);
  await flush();
  assert.equal(page.requests[0].config.signal.aborted, true);
  assert.equal(page.status.textContent, 'Temporarily unavailable');
  await page.respond(counts());
  assert.equal(page.views.textContent, '—');
  assert.equal(page.requests.length, 1);
  assert.equal(page.timers.size, 0);
});

test('the timeout includes a stalled JSON response body', async () => {
  const page = createPage();
  page.load();
  page.requests[0].resolve({ ok: true, json: () => new Promise(() => {}) });
  await flush();
  page.runTimer(4000);
  await flush();
  assert.equal(page.status.textContent, 'Temporarily unavailable');
  assert.equal(page.requests[0].config.signal.aborted, true);
});

test('an outage keeps the last real counts with an explicit timestamp', async () => {
  const storage = new Map([[cacheKey, JSON.stringify(counts())]]);
  const page = createPage({ storage });
  page.load();
  assert.equal(page.views.textContent, '1,234');
  assert.match(page.status.textContent, /^Last updated /);
  page.requests[0].reject(new Error('Offline'));
  await flush();
  assert.equal(page.views.textContent, '1,234');
  assert.match(page.status.textContent, /^Last updated /);
});

test('expired or malformed cache cannot masquerade as current statistics', async () => {
  for (const value of [
    '{broken',
    JSON.stringify(counts({ updatedAt: '2020-01-01T00:00:00.000Z' })),
  ]) {
    const page = createPage({ storage: new Map([[cacheKey, value]]) });
    page.load();
    await page.respond({}, false);
    assert.equal(page.views.textContent, '—');
    assert.equal(page.status.textContent, 'Temporarily unavailable');
  }
});
