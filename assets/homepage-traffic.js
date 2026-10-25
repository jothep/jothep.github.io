// Only the public homepage records visits. Local previews never contact the service.
(() => {
  const counter = document.querySelector('[data-homepage-counter]');
  if (!counter) return;

  const views = counter.querySelector('#busuanzi_value_site_pv');
  const visitors = counter.querySelector('#busuanzi_value_site_uv');
  const status = counter.querySelector('[data-traffic-status]');
  if (!views || !visitors || !status) return;

  counter.hidden = false;
  const isPublicHomepage =
    location.protocol === 'https:' &&
    location.hostname === 'jothep.github.io' &&
    ['/', '/index.html'].includes(location.pathname);

  if (!isPublicHomepage) {
    status.textContent = 'Local preview';
    counter.title = 'Local preview. Visit counting is disabled.';
    return;
  }

  const numberFormat = new Intl.NumberFormat('en-NZ');
  status.textContent = 'Loading…';

  function readCount(value) {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (!/^\d+$/.test(String(value))) return null;
    const count = Number(value);
    return Number.isSafeInteger(count) ? count : null;
  }

  function requestCounts() {
    // A unique callback also prevents a cached response from replacing a new visit.
    const callbackName = `BusuanziCallback_${Math.floor(1099511627776 * Math.random())}`;
    const request = document.createElement('script');
    let settled = false;
    let timeout;

    function finish(counts = null) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      request.remove();
      // A late JSONP response must not change the settled display or throw an error.
      window[callbackName] = () => {};

      if (counts) {
        views.textContent = numberFormat.format(counts.views);
        visitors.textContent = numberFormat.format(counts.visitors);
        status.textContent = '';
      } else {
        status.textContent = 'Temporarily unavailable';
      }
    }

    window[callbackName] = (data) => {
      const viewCount = readCount(data?.site_pv);
      const visitorCount = readCount(data?.site_uv);
      if (viewCount === null || visitorCount === null) {
        finish();
        return;
      }
      finish({ views: viewCount, visitors: visitorCount });
    };

    // Keep the existing provider, site identity and counting method.
    request.src = `https://busuanzi.ibruce.info/busuanzi?jsonpCallback=${callbackName}`;
    request.async = true;
    request.referrerPolicy = 'no-referrer-when-downgrade';
    request.addEventListener('error', () => finish(), { once: true });
    timeout = setTimeout(() => finish(), 10000);
    document.head.append(request);
  }

  // An async script inserted before window.load still delays that event. Start this
  // optional request in a later task, after the homepage has finished loading.
  function startAfterLoad() {
    setTimeout(requestCounts, 0);
  }
  if (document.readyState === 'complete') startAfterLoad();
  else window.addEventListener('load', startAfterLoad, { once: true });
})();
