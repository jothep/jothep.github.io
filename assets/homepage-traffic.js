// The homepage is usable before this optional counter makes any request.
(() => {
  const counter = document.querySelector('[data-homepage-counter]');
  if (!counter) return;
  const views = counter.querySelector('[data-traffic-views]');
  const visitors = counter.querySelector('[data-traffic-visitors]');
  const status = counter.querySelector('[data-traffic-status]');
  if (!views || !visitors || !status) return;

  const isHomepage = ['/', '/index.html'].includes(location.pathname);
  const isPublic = location.origin === 'https://jothep.github.io' && isHomepage;
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  const isPreview = isLocal && isHomepage && counter.hasAttribute('data-counter-preview');
  const configuredEndpoint = counter.dataset.counterEndpoint;
  let endpoint;
  try {
    endpoint = new URL(configuredEndpoint);
    const safePublic = isPublic && endpoint.protocol === 'https:';
    const safePreview =
      isPreview && endpoint.protocol === 'http:' && endpoint.hostname === location.hostname;
    if (!safePublic && !safePreview) throw new Error('Inactive counter');
  } catch {
    status.textContent = isPublic ? 'Temporarily unavailable' : 'Local preview';
    return;
  }

  const storageKey = `portfolio-traffic:${endpoint.origin}`;
  const visitorKey = 'portfolio-visitor-v1';
  const format = new Intl.NumberFormat('en-NZ');
  const timeoutMs = 4000;
  const maxCacheAge = 7 * 86400000;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function validCounts(data) {
    return (
      data &&
      Number.isSafeInteger(data.views) &&
      data.views >= 0 &&
      Number.isSafeInteger(data.visitors) &&
      data.visitors >= 0 &&
      data.visitors <= data.views &&
      typeof data.updatedAt === 'string' &&
      Number.isFinite(Date.parse(data.updatedAt)) &&
      (data.since === null ||
        (typeof data.since === 'string' && Number.isFinite(Date.parse(data.since))))
    );
  }

  function readCache() {
    try {
      const data = JSON.parse(readStorage(storageKey));
      const age = Date.now() - Date.parse(data?.updatedAt);
      return validCounts(data) && age >= 0 && age <= maxCacheAge ? data : null;
    } catch {
      return null;
    }
  }

  function showCounts(data, cached = false) {
    views.textContent = format.format(data.views);
    visitors.textContent = format.format(data.visitors);
    const date = new Date(data.updatedAt).toLocaleString('en-NZ', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
    status.textContent = cached ? `Last updated ${date}` : isPreview ? 'Local test data' : '';
    const start = data.since ? new Date(data.since).toLocaleDateString('en-NZ') : 'the first visit';
    counter.title = `Homepage loads and distinct browsers since ${start}. Visitors use a browser identifier; clearing browser storage or using another browser counts separately.`;
    if (isPreview) counter.title = `Local test data only. ${counter.title}`;
  }

  function visitorId() {
    const existing = readStorage(visitorKey);
    if (existing && UUID.test(existing)) return existing;
    const id = crypto.randomUUID();
    // Without durable storage, count the view but do not invent a new unique
    // visitor on every refresh. No fingerprint or IP-based identity fallback.
    return writeStorage(visitorKey, id) ? id : null;
  }

  async function requestCounts() {
    const cached = readCache();
    if (cached) showCounts(cached, true);
    else status.textContent = isPreview ? 'Loading local test data…' : 'Loading…';

    const controller = new AbortController();
    let timeout;
    try {
      const deadline = new Promise((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
          reject(new Error('Counter timed out'));
        }, timeoutMs);
      });
      const response = fetch(new URL('/visit', endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        signal: controller.signal,
        body: JSON.stringify({
          requestId: crypto.randomUUID(),
          visitorId: visitorId(),
          path: location.pathname,
        }),
      }).then(async (response) => {
        if (!response.ok) throw new Error('Counter unavailable');
        const data = await response.json();
        if (!validCounts(data)) throw new Error('Invalid counts');
        return data;
      });
      const data = await Promise.race([response, deadline]);
      showCounts(data);
      writeStorage(storageKey, JSON.stringify(data));
    } catch {
      if (!cached) status.textContent = 'Temporarily unavailable';
      // A cached display keeps its timestamp. Never guess a count or retry.
    } finally {
      clearTimeout(timeout);
    }
  }

  // Starting in the next task after load keeps the counter off the critical path.
  const start = () => setTimeout(requestCounts, 0);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
