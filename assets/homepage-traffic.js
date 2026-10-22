// Only the public homepage records visits. Local previews never contact the counter service.
(() => {
  const counter = document.querySelector('[data-homepage-counter]');
  if (!counter) return;

  const isPublicHomepage =
    location.protocol === 'https:' &&
    location.hostname === 'jothep.github.io' &&
    ['/', '/index.html'].includes(location.pathname);

  if (!isPublicHomepage) {
    counter.hidden = false;
    counter.title = 'Local preview. Visit counting is disabled.';
    return;
  }

  const views = counter.querySelector('#busuanzi_value_site_pv');
  const visitors = counter.querySelector('#busuanzi_value_site_uv');
  const numberFormat = new Intl.NumberFormat('en-NZ');
  let complete = false;
  let timeout;

  function finish(success) {
    if (complete) return;
    complete = true;
    clearTimeout(timeout);
    observer.disconnect();
    if (success) {
      views.textContent = numberFormat.format(Number(views.textContent));
      visitors.textContent = numberFormat.format(Number(visitors.textContent));
    }
    counter.hidden = !success;
  }

  // The service fills both values after its separate counting request completes.
  // Wait for real numbers; do not invent a fallback total when it is unavailable.
  const observer = new MutationObserver(() => {
    const values = [views.textContent.trim(), visitors.textContent.trim()];
    if (values.every((value) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)))) {
      finish(true);
    }
  });
  observer.observe(counter, { childList: true, subtree: true, characterData: true });
  timeout = setTimeout(() => finish(false), 8000);

  const script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  script.addEventListener('error', () => finish(false), { once: true });
  document.head.append(script);
})();
