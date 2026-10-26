// One service, one homepage. All mutations go through the atomic D1 insert.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 1024;
const RETENTION_DAYS = 7;
const TOTALS_QUERY = 'SELECT views, visitors, started_at AS since FROM totals WHERE id = 1';

function reply(origin, data, status = 200) {
  return new Response(data === null ? null : JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}

async function readVisit(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks = [];
  let size = 0;
  // Enforce the limit even when Content-Length is missing or untrustworthy.
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error('Body too large');
    }
    chunks.push(value);
  }
  const data = JSON.parse(await new Blob(chunks).text());
  if (
    !data ||
    typeof data.requestId !== 'string' ||
    !UUID.test(data.requestId) ||
    !(
      data.visitorId === null ||
      (typeof data.visitorId === 'string' && UUID.test(data.visitorId))
    ) ||
    !['/', '/index.html'].includes(data.path)
  ) {
    throw new Error('Invalid visit');
  }
  return data;
}

function snapshot(row) {
  return { ...row, updatedAt: new Date().toISOString() };
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN;
    if (request.headers.get('Origin') !== origin) {
      return reply(origin, { error: 'Origin not allowed' }, 403);
    }
    const path = new URL(request.url).pathname;
    if (!['/stats', '/visit'].includes(path)) {
      return reply(origin, { error: 'Not found' }, 404);
    }
    if (request.method === 'OPTIONS') return reply(origin, null, 204);
    if (
      (path === '/stats' && request.method !== 'GET') ||
      (path === '/visit' && request.method !== 'POST')
    ) {
      return reply(origin, { error: 'Method not allowed' }, 405);
    }

    try {
      // A small shared-IP limit protects database writes from repeated refreshes.
      // It is best-effort per Cloudflare location, not authentication or bot proof.
      const ip = request.headers.get('CF-Connecting-IP') || 'local';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) return reply(origin, { error: 'Too many requests' }, 429);

      if (path === '/stats') {
        const row = await env.DB.prepare(TOTALS_QUERY).first();
        return reply(origin, snapshot(row));
      }
      if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
        return reply(origin, { error: 'JSON required' }, 415);
      }
      let visit;
      try {
        visit = await readVisit(request);
      } catch {
        return reply(origin, { error: 'Invalid visit' }, 400);
      }
      const results = await env.DB.batch([
        env.DB.prepare(
          'INSERT OR IGNORE INTO visits (id, visitor_id, created_at) VALUES (?, ?, ?)',
        ).bind(
          visit.requestId.toLowerCase(),
          visit.visitorId?.toLowerCase() ?? null,
          new Date().toISOString(),
        ),
        env.DB.prepare(TOTALS_QUERY),
      ]);
      return reply(origin, snapshot(results[1].results[0]));
    } catch {
      // Do not expose database details, identifiers or raw request data.
      return reply(origin, { error: 'Counter temporarily unavailable' }, 503);
    }
  },

  async scheduled(_event, env) {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
    // Deleting old request IDs does not change lifetime totals or visitor identity.
    await env.DB.prepare('DELETE FROM visits WHERE created_at < ?').bind(cutoff).run();
  },
};
