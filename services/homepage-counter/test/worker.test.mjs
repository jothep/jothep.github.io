import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRuntime } from '../local-runtime.mjs';
import worker from '../src/worker.js';

const origin = 'https://jothep.github.io';
const freshVisit = (visitorId = randomUUID()) => ({
  requestId: randomUUID(),
  visitorId,
  path: '/',
});

async function fixture(t, options) {
  const { runtime, db } = await createRuntime(options);
  t.after(() => runtime.dispose());
  const request = (path, options = {}) =>
    runtime.dispatchFetch(`https://counter.test${path}`, {
      ...options,
      headers: { Origin: origin, 'Content-Type': 'application/json', ...options.headers },
    });
  const visit = (data = freshVisit()) =>
    request('/visit', { method: 'POST', body: JSON.stringify(data) });
  const stats = async () => (await request('/stats')).json();
  return { runtime, db, request, visit, stats };
}

test('views repeat, visitors deduplicate, and snapshots are uncached', async (t) => {
  const { visit, stats } = await fixture(t);
  assert.equal((await stats()).views, 0);
  const browser = randomUUID();
  await visit(freshVisit(browser));
  await visit(freshVisit(browser));
  const response = await visit();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  const counts = await response.json();
  assert.equal(counts.views, 3);
  assert.equal(counts.visitors, 2);
  assert.ok(Date.parse(counts.since));
  assert.ok(Date.parse(counts.updatedAt));
});

test('concurrent requests and duplicate event IDs keep exact totals', async (t) => {
  const { visit, stats } = await fixture(t);
  const browser = randomUUID();
  const event = freshVisit(browser);
  await Promise.all(Array.from({ length: 8 }, () => visit(event)));
  // Reusing a request ID with a changed browser must not create another visitor.
  await visit({ ...event, visitorId: randomUUID() });
  await Promise.all(Array.from({ length: 10 }, () => visit(freshVisit(browser))));
  await Promise.all(Array.from({ length: 10 }, () => visit()));
  const counts = await stats();
  assert.equal(counts.views, 21);
  assert.equal(counts.visitors, 11);
});

test('blocked browser storage counts views without inventing unique visitors', async (t) => {
  const { visit, stats } = await fixture(t);
  await visit(freshVisit(null));
  await visit(freshVisit(null));
  assert.equal((await stats()).views, 2);
  assert.equal((await stats()).visitors, 0);
});

test('foreign origins, wrong routes, methods and malformed data do not count', async (t) => {
  const { request, visit, stats } = await fixture(t);
  assert.equal(
    (
      await request('/visit', {
        method: 'POST',
        headers: { Origin: 'http://localhost:8776' },
        body: JSON.stringify(freshVisit()),
      })
    ).status,
    403,
  );
  assert.equal((await request('/visit', { method: 'POST', headers: { Origin: '' } })).status, 403);
  assert.equal((await request('/visit')).status, 405);
  assert.equal((await request('/other')).status, 404);
  assert.equal(
    (
      await request('/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: '{}',
      })
    ).status,
    415,
  );
  for (const bad of [
    null,
    {},
    { ...freshVisit(), visitorId: 'not-a-uuid' },
    { ...freshVisit(), path: '/experience/' },
  ]) {
    assert.equal((await visit(bad)).status, 400);
  }
  assert.equal((await request('/visit', { method: 'POST', body: 'x'.repeat(1025) })).status, 400);
  assert.equal((await stats()).views, 0);
});

test('CORS preflight does not count a visit', async (t) => {
  const { request, stats } = await fixture(t);
  const response = await request('/visit', { method: 'OPTIONS' });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
  assert.equal((await stats()).views, 0);
});

test('rate limiting stops writes before reaching the database', async (t) => {
  const { visit, db } = await fixture(t, { limit: 2 });
  assert.equal((await visit()).status, 200);
  assert.equal((await visit()).status, 200);
  assert.equal((await visit()).status, 429);
  assert.equal((await db.prepare('SELECT views FROM totals').first()).views, 2);
});

test('a database failure returns a bounded error without partial counting', async (t) => {
  const { visit, db } = await fixture(t);
  await db
    .prepare(
      `CREATE TRIGGER simulate_failure BEFORE INSERT ON visitors BEGIN SELECT RAISE(ABORT, 'test failure'); END`,
    )
    .run();
  const response = await visit();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'Counter temporarily unavailable' });
  assert.equal((await db.prepare('SELECT views FROM totals').first()).views, 0);
  assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM visits').first()).count, 0);
});

test('cleanup removes old request IDs while preserving lifetime totals and visitors', async (t) => {
  const { visit, db, stats } = await fixture(t);
  const browser = randomUUID();
  await visit(freshVisit(browser));
  await db.prepare("UPDATE visits SET created_at = '2020-01-01T00:00:00.000Z'").run();
  await worker.scheduled({}, { DB: db });
  assert.equal((await db.prepare('SELECT COUNT(*) AS count FROM visits').first()).count, 0);
  await visit(freshVisit(browser));
  const counts = await stats();
  assert.equal(counts.views, 2);
  assert.equal(counts.visitors, 1);
});
