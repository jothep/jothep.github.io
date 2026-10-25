// Regression checks for the optional counter. No requests are sent to the provider.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/homepage-traffic.js'), 'utf8');

function createPage(options = {}) {
  const views = { textContent: '—' };
  const visitors = { textContent: '—' };
  const status = { textContent: 'Temporarily unavailable' };
  const nodes = {
    '#busuanzi_value_site_pv': views,
    '#busuanzi_value_site_uv': visitors,
    '[data-traffic-status]': status,
  };
  const counter = { hidden: true, querySelector: (selector) => nodes[selector] };
  const timers = new Map();
  const listeners = new Map();
  const requests = [];
  let nextTimer = 0;
  const document = {
    readyState: options.readyState ?? 'interactive',
    querySelector: () => (options.missingCounter ? null : counter),
    createElement: () => ({
      handlers: {},
      addEventListener(type, handler) {
        this.handlers[type] = handler;
      },
      remove() {
        this.removed = true;
      },
    }),
    head: { append: (request) => requests.push(request) },
  };
  const window = { addEventListener: (type, handler) => listeners.set(type, handler) };
  const location = {
    protocol: 'https:',
    hostname: 'jothep.github.io',
    pathname: '/',
    ...options.location,
  };
  vm.runInNewContext(source, {
    document,
    window,
    location,
    Intl,
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
    requests,
    timers,
    listeners,
    window,
    runTimer,
    load() {
      document.readyState = 'complete';
      listeners.get('load')?.();
      listeners.delete('load');
      runTimer(0);
    },
    respond(data) {
      const callbackName = new URL(requests[0].src).searchParams.get('jsonpCallback');
      window[callbackName](data);
    },
  };
}

test('waits until the page load event and the next task before requesting statistics', () => {
  const page = createPage();
  assert.equal(page.requests.length, 0);
  assert.equal(page.timers.size, 0);
  page.listeners.get('load')();
  assert.equal(page.requests.length, 0);
  page.runTimer(0);
  assert.equal(page.requests.length, 1);
  const requestUrl = new URL(page.requests[0].src);
  assert.equal(requestUrl.origin, 'https://busuanzi.ibruce.info');
  assert.equal(requestUrl.pathname, '/busuanzi');
  assert.match(requestUrl.searchParams.get('jsonpCallback'), /^BusuanziCallback_\d+$/);
  assert.equal(page.requests[0].referrerPolicy, 'no-referrer-when-downgrade');
});

test('also works when the script starts after the page has loaded', () => {
  const page = createPage({ readyState: 'complete' });
  assert.equal(page.requests.length, 0);
  page.runTimer(0);
  assert.equal(page.requests.length, 1);
});

test('local previews, other domains and non-homepage routes never record visits', () => {
  for (const location of [
    { protocol: 'file:' },
    { protocol: 'http:', hostname: '127.0.0.1' },
    { hostname: 'preview.example.com' },
    { pathname: '/certifications/' },
  ]) {
    const page = createPage({ location });
    assert.equal(page.requests.length, 0);
    assert.equal(page.timers.size, 0);
    assert.equal(page.listeners.size, 0);
    assert.equal(page.counter.hidden, false);
    assert.equal(page.status.textContent, 'Local preview');
  }
});

test('formats real responses, including zero, and removes the completed request', () => {
  const page = createPage({ location: { pathname: '/index.html' } });
  page.load();
  page.respond({ site_pv: 1234, site_uv: '0' });
  assert.equal(page.views.textContent, '1,234');
  assert.equal(page.visitors.textContent, '0');
  assert.equal(page.status.textContent, '');
  assert.equal(page.counter.hidden, false);
  assert.equal(page.requests[0].removed, true);
  assert.equal(page.timers.size, 0);
});

test('invalid or incomplete responses never appear as invented totals', () => {
  for (const data of [
    null,
    {},
    { site_pv: 12 },
    { site_pv: -1, site_uv: 2 },
    { site_pv: '', site_uv: 2 },
    { site_pv: true, site_uv: 2 },
    { site_pv: 1.5, site_uv: 2 },
    { site_pv: '9007199254740992', site_uv: 2 },
  ]) {
    const page = createPage();
    page.load();
    page.respond(data);
    assert.equal(page.views.textContent, '—');
    assert.equal(page.visitors.textContent, '—');
    assert.equal(page.status.textContent, 'Temporarily unavailable');
    assert.equal(page.counter.hidden, false);
    assert.equal(page.requests[0].removed, true);
  }
});

test('timeout keeps the labels visible, cleans up and ignores late replies without retrying', () => {
  const page = createPage();
  page.load();
  page.runTimer(10000);
  assert.equal(page.counter.hidden, false);
  assert.equal(page.status.textContent, 'Temporarily unavailable');
  assert.equal(page.requests[0].removed, true);
  page.respond({ site_pv: 1234, site_uv: 567 });
  assert.equal(page.views.textContent, '—');
  assert.equal(page.visitors.textContent, '—');
  assert.equal(page.timers.size, 0);
  assert.equal(page.requests.length, 1);
});

test('network errors settle the display and clear the deadline', () => {
  const page = createPage();
  page.load();
  page.requests[0].handlers.error();
  assert.equal(page.counter.hidden, false);
  assert.equal(page.status.textContent, 'Temporarily unavailable');
  assert.equal(page.requests[0].removed, true);
  assert.equal(page.timers.size, 0);
});

test('pages without the counter do not request anything', () => {
  const page = createPage({ missingCounter: true });
  assert.equal(page.requests.length, 0);
  assert.equal(page.timers.size, 0);
  assert.equal(page.listeners.size, 0);
});
