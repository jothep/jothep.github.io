// Shared local runtime for the preview and integration tests. No cloud account.
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { readFile } from 'node:fs/promises';

export async function createRuntime({ origin, port, persist = false, limit = 60 } = {}) {
  const runtime = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      scriptPath: new URL('./src/worker.js', import.meta.url).pathname,
      compatibilityDate: '2026-10-01',
      host: '127.0.0.1',
      port: port ?? 0,
      bindings: { ALLOWED_ORIGIN: origin ?? 'https://jothep.github.io' },
      d1Databases: { DB: 'homepage-counter-local' },
      d1Persist: persist,
      ratelimits: { RATE_LIMITER: { namespace_id: '1001', simple: { limit, period: 60 } } },
    }),
  );
  try {
    const db = await runtime.getD1Database('DB');
    const sql = await readFile(new URL('./migrations/0001_counter.sql', import.meta.url), 'utf8');
    // Explicit SQL boundaries preserve the multi-statement trigger body.
    for (const statement of sql.split(/^-- statement\s*$/m).slice(1)) {
      await db.prepare(statement.replace(/^--.*$/gm, '').trim()).run();
    }
    return { runtime, db };
  } catch (error) {
    await runtime.dispose();
    throw error;
  }
}
