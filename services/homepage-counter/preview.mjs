// Serve the existing portfolio with a local-only counter endpoint injected into
// its HTML response. The checked-in homepage and production data are untouched.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { createRuntime } from './local-runtime.mjs';

const root = resolve(new URL('../..', import.meta.url).pathname);
const origin = 'http://127.0.0.1:8776';
const { runtime } = await createRuntime({ origin, port: 8787, persist: '.wrangler/preview-d1' });
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin);
    const parts = decodeURIComponent(url.pathname).split('/');
    if (
      parts.some(
        (part) => part.startsWith('.') || ['node_modules', 'services', 'tests'].includes(part),
      )
    ) {
      response.writeHead(404).end();
      return;
    }
    let path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!path.startsWith(root + sep) && path !== root) throw new Error('Outside site');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    let content = await readFile(path);
    if (path === resolve(root, 'index.html')) {
      content = Buffer.from(
        content
          .toString()
          .replace(
            'data-counter-endpoint=""',
            'data-counter-endpoint="http://127.0.0.1:8787" data-counter-preview',
          ),
      );
    }
    response.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(8776, '127.0.0.1', () =>
  console.log(`Local preview: ${origin}/#homepage-traffic (test counts only)`),
);
async function stop() {
  server.close();
  await runtime.dispose();
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
