// Progressive enhancement: all architecture panels remain readable without JS.
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab, moveFocus = false) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
  if (moveFocus) tab.focus();
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
}
if (tabs.length) selectTab(tabs[0]);

// Only pages with this explicit marker receive the compact mobile contents menu.
const mobileNav = document.querySelector('.mobile-case-nav');
const navToggle = mobileNav?.querySelector('.case-nav-toggle');
const navCurrent = mobileNav?.querySelector('.case-nav-current');
const narrowScreen = window.matchMedia('(max-width: 760px)');

if (navToggle) {
  mobileNav.dataset.enhanced = 'true';

  function closeContents() {
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });

  mobileNav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && narrowScreen.matches) {
      closeContents();
      navToggle.focus();
    }
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!narrowScreen.matches) return;
      closeContents();
      // Move focus out of the closed menu; native hash navigation handles scrolling.
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  narrowScreen.addEventListener('change', closeContents);
}

// Keep the current section highlighted in desktop and compact navigation.
const sectionLinks = Array.from(document.querySelectorAll('.case-nav a'));
const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href')));
let scheduled = false;
function updateSection() {
  let current = 0;
  sections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= 150) current = index;
  });
  sectionLinks.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (navCurrent && sectionLinks[current]) {
    navCurrent.textContent = sectionLinks[current].textContent.replace(/^\s*\d+\s*/, '').trim();
  }
  scheduled = false;
}
window.addEventListener(
  'scroll',
  () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateSection);
    }
  },
  { passive: true },
);
updateSection();


// Native horizontal scrolling remains available when this enhancement is unavailable.
{
  const writing = document.getElementById('writing');
  const track = writing?.querySelector('#writing-track');
  const controls = writing?.querySelector('.writing-controls');
  const previous = controls?.querySelector('[data-writing-prev]');
  const next = controls?.querySelector('[data-writing-next]');
  const cards = track ? Array.from(track.querySelectorAll('.writing-card')) : [];

  if (track && controls && previous && next && cards.length) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const count = writing.querySelector('[data-writing-count]');
    const tolerance = 1;

    if (count) {
      count.textContent = `${String(cards.length).padStart(2, '0')} / Articles & reflections`;
    }

    function updateWritingControls() {
      const maximum = track.scrollWidth - track.clientWidth;
      controls.hidden = maximum <= tolerance;
      previous.disabled = track.scrollLeft <= tolerance;
      next.disabled = track.scrollLeft >= maximum - tolerance;
    }

    function scrollWriting(direction) {
      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      const current = Math.max(0, Math.min(track.scrollLeft, maximum));
      const firstLeft = cards[0].getBoundingClientRect().left;
      const positions = cards.map((card) =>
        Math.min(maximum, card.getBoundingClientRect().left - firstLeft),
      );
      let left;

      if (direction === 'start') left = 0;
      else if (direction === 'end') left = maximum;
      else if (direction === 'next') {
        left = positions.find((position) => position > current + tolerance) ?? maximum;
      } else {
        left = positions.reverse().find((position) => position < current - tolerance) ?? 0;
      }

      track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }

    previous.addEventListener('click', () => scrollWriting('previous'));
    next.addEventListener('click', () => scrollWriting('next'));
    track.addEventListener('keydown', (event) => {
      if (
        event.target !== track ||
        controls.hidden ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      const direction = {
        ArrowLeft: 'previous',
        ArrowRight: 'next',
        Home: 'start',
        End: 'end',
      }[event.key];
      if (!direction) return;
      event.preventDefault();
      scrollWriting(direction);
    });
    track.addEventListener('scroll', updateWritingControls, { passive: true });
    window.addEventListener('resize', updateWritingControls);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(updateWritingControls);
      observer.observe(track);
      cards.forEach((card) => observer.observe(card));
    }
    updateWritingControls();
  }
}
