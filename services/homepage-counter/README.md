# Homepage counter

Deployed on 26 October 2026 to the Workers Free plan, using a dedicated D1 database.
Public endpoint: https://portfolio-homepage-counter.shelldry325.workers.dev
The homepage's `data-counter-endpoint` points to this service. This directory does not add a
build step to the GitHub Pages website.

## What the numbers mean

- **Homepage views:** accepted loads of `/` or `/index.html`, including refreshes.
- **Visitors:** distinct random browser identifiers saved in first-party `localStorage`.
  This estimates browsers, not people. Different browsers or cleared storage count separately.
  When storage is blocked, the view is counted without adding a new unique visitor.
- Hash changes and other portfolio pages do not send events. A restored browser-history page
  does not send another event unless its scripts run again.
- New totals start from the first accepted production visit. Do not seed the database with
  unverified Busuanzi figures or local test data. The response includes this start date.

The Worker stores random identifiers and event timestamps. It does not store IP addresses,
user-agent strings, referrers or browsing histories. Cloudflare handles network metadata as
part of serving requests; an IP is used transiently for rate limiting. No third-party script,
tracking cookie, fingerprint, private API token or account credential is sent by the client.
The browser identifier and last successful statistics are local to the portfolio's origin.

## Files

| File | Purpose |
| --- | --- |
| `src/worker.js` | Validate requests, record visits, return counts, prune old request IDs |
| `migrations/0001_counter.sql` | Tables and an atomic trigger for totals and visitor deduplication |
| `wrangler.jsonc` | Local-only configuration; the database ID cannot target a real database |
| `wrangler.production.example.jsonc` | Production configuration template; no actual account or database |
| `local-runtime.mjs` | Miniflare with local D1, shared by tests and preview |
| `preview.mjs` | Local website preview with a loopback counter endpoint |
| `test/worker.test.mjs` | Integration tests against actual local Workers/D1 runtime |
| `../../assets/homepage-traffic.js` | Small, optional homepage client |
| `../../tests/homepage-traffic.test.cjs` | Loading, timeout, cache and identity behaviour tests |

## Run locally

Use Node.js 22 or later. From this directory:

```sh
npm ci
npm test
npm run preview
```

Open **http://127.0.0.1:8776/#homepage-traffic**. The API uses port 8787. Both listen only on
loopback. Refreshing increases views while the visitor count stays the same for that browser.
The footer explicitly says **Local test data**. Preview database files stay under ignored
`.wrangler/preview-d1`; they are separate from tests and the production database.
Stop the preview with Ctrl+C. No Cloudflare account or authentication is used.

To check the deployment tooling locally without the website preview:

```sh
npm run db:local
npm run dev
```

Do not run this together with the preview: both use port 8787. Wrangler's local database is
separate from the preview database. Neither command uses `--remote`.

## Request contract and failure behaviour

`POST /visit` accepts JSON with `requestId` (new UUID per page load), `visitorId` (saved UUID,
or null when browser storage is blocked) and `path` (`/` or `/index.html`). `GET /stats` returns
the totals without recording a view. Both require the configured exact Origin.

The D1 insert and snapshot query run in one transaction. Inserting a new event triggers both
total updates atomically. Repeating the same event ID does not increment either number,
even if the visitor ID changes. Event IDs are retained for seven days; the scheduled cleanup
removes them without reducing lifetime totals or the visitor-ID set.

The rate limiter allows up to 60 requests per minute per connecting IP at each Cloudflare
location. This is best-effort abuse reduction; shared networks may hit the limit, and CORS
is not authentication. A public counter cannot prove that each request comes from a human.
Only the aggregate counts are returned. JSON bodies are limited to 1 KiB.

The browser starts one request in a new task after `window.load`, with a four-second deadline
covering response headers and body. It never reloads, polls or retries automatically. If the
request fails, the most recent valid counts from the same endpoint remain visible with a
**Last updated** timestamp, for up to seven days. Without valid cached counts, it shows dashes
and **Temporarily unavailable**. It does not add an optimistic local increment.

A regular local or file preview never contacts a production counter. Only the provided local
preview server injects `data-counter-preview`, and the client requires a loopback endpoint
with the same hostname. Production requests require the exact public homepage origin.

## Deployment and maintenance

The account uses the Workers Free plan. Keep it on that plan; do not enable paid services as
part of counter maintenance. The original deployment used one new D1 database, with empty
counts verified before the public homepage connected. Local test figures were never imported.

The ignored `wrangler.production.jsonc` contains the account and database IDs. Use
`wrangler.production.example.jsonc` as its documented template. The rate-limit namespace
`1001` is reserved for this Worker in the account. Credentials stay in Wrangler's local
configuration, never in this directory or in frontend code.

To update the existing service after reviewing and testing changes:

```sh
npm ci
npm test
npx wrangler deploy --dry-run --config wrangler.production.jsonc
npx wrangler deploy --config wrangler.production.jsonc
```

For a new database migration, review the SQL first, then apply it explicitly:

```sh
npx wrangler d1 migrations apply portfolio-homepage-counter --remote --config wrangler.production.jsonc
```

`GET /stats` with `Origin: https://jothep.github.io` is a read-only production check. Do not
send synthetic visits to the live database or reset its totals. Verify counting through real
homepage visits: a refresh adds a view, while the same browser retains its visitor identity.
The daily trigger removes only expired request IDs; totals and visitor identities are retained.

Publish frontend changes from a clean release checkout containing only approved changes.
The homepage reading-path drafts present during this release remain unapproved. Check the
published footer, complete page loading and repeat-visitor behaviour after each counter update.

There is no automatic Worker deploy workflow. `undici` is overridden to 7.30.1 to include its
published security fixes in the local tooling; revisit this override when upstream updates.

## Moving to another computer

The Worker and D1 run on Cloudflare independently of any local computer. The repository
contains the service source, schema and pinned tooling. To maintain the existing service:

1. Clone the portfolio repository and run `npm ci` in this directory with Node.js 22 or later.
2. Sign in to the same Cloudflare account using Wrangler. The deployment scopes are
   `account:read`, `user:read`, `workers_scripts:write` and `d1:write`; Wrangler also requests
   background access to keep its login usable. Do not copy a token into source code.
3. Copy the production example to `wrangler.production.jsonc`. Get the existing database ID
   from the Cloudflare D1 dashboard or `npx wrangler d1 list`; do not create a replacement DB.
   Set `account_id` if the login has access to multiple accounts.
4. Run the tests and deployment commands above. Keep the existing database binding and
   migration history. Updating Worker code does not reset stored totals.

## Disabling or rolling back the counter

To stop counting, remove the value of the homepage's `data-counter-endpoint` and publish only
that edit. The page remains usable and does not contact the counter. This does not delete
stored counts. An existing Worker version can also be restored with Wrangler or the Cloudflare
dashboard; review any database schema changes separately before rolling code back.

A free service still has quotas and can be unavailable. The client displays cached figures
with their timestamp or an unavailable message, without delaying the page load event. Check
Cloudflare's usage dashboard periodically while evaluating the service. CORS and rate limiting
reduce accidental use and simple abuse; they do not make public counts tamper-proof.

## Official references

- [Workers request limits](https://developers.cloudflare.com/workers/platform/limits/)
- [D1 free quotas and pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 transactions with batch](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch)
- [Workers rate-limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Local D1 testing with Miniflare](https://developers.cloudflare.com/workers/testing/miniflare/storage/d1/)
