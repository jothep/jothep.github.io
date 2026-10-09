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
