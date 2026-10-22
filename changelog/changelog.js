// The authored HTML is the only content source. This file adds browsing controls.
(() => {
  const pageSize = 8;
  const root = document.querySelector('[data-changelog]');
  if (!root) return;

  const entries = [...root.querySelectorAll('.changelog-entry')].map((article) => ({
    article,
    date: article.querySelector('time[datetime]').dateTime,
  }));
  if (!entries.length || entries.some(({ date }) => !/^\d{4}-\d{2}-\d{2}$/.test(date))) return;

  const months = [...new Set(entries.map(({ date }) => date.slice(0, 7)))].sort().reverse();
  const years = [...new Set(months.map((month) => month.slice(0, 4)))];
  const counts = new Map();
  entries.forEach(({ date }) => counts.set(date, (counts.get(date) || 0) + 1));

  const monthSelect = root.querySelector('#changelog-month');
  const yearSelect = root.querySelector('#changelog-year');
  const calendars = root.querySelector('[data-calendars]');
  const resultHeading = root.querySelector('#updates');
  const resultCount = root.querySelector('[data-result-count]');
  const dayFilter = root.querySelector('[data-day-filter]');
  const pagers = [...root.querySelectorAll('[data-pagination]')];
  let state;
  let calendarYear;

  // Dates are authored Auckland calendar dates. UTC is used only for calendar arithmetic.
  function dateLabel(isoDate, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
    return new Intl.DateTimeFormat('en-NZ', { ...options, timeZone: 'UTC' }).format(
      new Date(`${isoDate}T00:00:00Z`),
    );
  }

  function monthLabel(month) {
    return dateLabel(`${month}-01`, { month: 'long', year: 'numeric' });
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function filteredEntries() {
    return entries.filter(
      ({ date }) =>
        (!state.month || date.startsWith(state.month)) && (!state.day || date === state.day),
    );
  }

  function hashTarget() {
    try {
      return document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      return null;
    }
  }

  function entryAtHash() {
    const article = hashTarget()?.closest('.changelog-entry');
    return entries.find((entry) => entry.article === article);
  }

  function readLocation() {
    const params = new URLSearchParams(location.search);
    const requestedMonth = params.get('month');
    const month =
      requestedMonth === 'all' ? '' : months.includes(requestedMonth) ? requestedMonth : months[0];
    const requestedDay = params.get('day');
    const day = counts.has(requestedDay) ? requestedDay : '';
    const requestedPage = Number(params.get('page') || 1);
    state = {
      month: day ? day.slice(0, 7) : month,
      day,
      page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    };

    // Old entry/title hashes take priority over filters, including on direct page loads.
    const entry = entryAtHash();
    if (entry) {
      if (!filteredEntries().includes(entry)) {
        state.month = entry.date.slice(0, 7);
        state.day = '';
      }
      state.page = Math.floor(filteredEntries().indexOf(entry) / pageSize) + 1;
    }
    render();
    const hash = hashTarget();
    const target = entry?.article || (hash === resultHeading ? resultHeading.parentElement : hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  function navigate(next, focusResults = false) {
    state = { ...state, ...next };
    const url = new URL(location.href);
    url.searchParams.set('month', state.month || 'all');
    if (state.day) url.searchParams.set('day', state.day);
    else url.searchParams.delete('day');
    if (state.page > 1) url.searchParams.set('page', state.page);
    else url.searchParams.delete('page');
    url.hash = 'updates';
    history.pushState(null, '', url);
    render();
    if (focusResults) {
      resultHeading.focus({ preventScroll: true });
      resultHeading.parentElement.scrollIntoView({ block: 'start' });
    }
  }

  function renderPagination(totalPages) {
    pagers.forEach((pager) => {
      pager.replaceChildren();
      pager.hidden = totalPages < 2;
      if (pager.hidden) return;

      function addButton(label, page, disabled = false) {
        const button = makeElement('button', '', label);
        button.type = 'button';
        button.disabled = disabled;
        button.addEventListener('click', () => navigate({ page }, true));
        pager.append(button);
        return button;
      }

      addButton('Previous', state.page - 1, state.page === 1);
      // Keep the control compact even when the archive grows to many pages.
      const visible = new Set([1, totalPages, state.page - 1, state.page, state.page + 1]);
      let previous = 0;
      [...visible]
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b)
        .forEach((page) => {
          if (previous && page > previous + 1) pager.append(makeElement('span', '', '…'));
          const button = addButton(String(page), page);
          button.setAttribute('aria-label', `Page ${page}`);
          if (page === state.page) button.setAttribute('aria-current', 'page');
          previous = page;
        });
      addButton('Next', state.page + 1, state.page === totalPages);
    });
  }

  function level(count) {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
  }

  function renderCalendar(year) {
    calendarYear = year;
    yearSelect.value = year;
    calendars.replaceChildren();
    const recordedMonths = months.filter((month) => month.startsWith(year)).sort();
    const firstMonth = Number(recordedMonths[0].slice(5));
    const lastMonth = Number(recordedMonths.at(-1).slice(5));
    for (let number = firstMonth; number <= lastMonth; number += 1) {
      const month = `${year}-${String(number).padStart(2, '0')}`;
      const section = makeElement('section', 'update-month');
      section.setAttribute('aria-label', monthLabel(month));
      section.append(makeElement('h3', '', monthLabel(month)));
      const days = makeElement('div', 'update-days');
      const offset = (new Date(Date.UTC(Number(year), number - 1, 1)).getUTCDay() + 6) % 7;
      const length = new Date(Date.UTC(Number(year), number, 0)).getUTCDate();
      for (let day = 1; day <= length; day += 1) {
        const date = `${month}-${String(day).padStart(2, '0')}`;
        const count = counts.get(date) || 0;
        const cell = makeElement(count ? 'button' : 'span', 'update-day');
        cell.dataset.level = String(level(count));
        if (day === 1) cell.style.gridColumnStart = String(offset + 1);
        const label = `${dateLabel(date)}: ${count} ${count === 1 ? 'update' : 'updates'}`;
        cell.title = label;
        if (count) {
          cell.type = 'button';
          cell.dataset.date = date;
          cell.setAttribute('aria-label', `${label}. Show this day.`);
          cell.addEventListener('click', () => navigate({ month, day: date, page: 1 }, true));
        } else {
          cell.setAttribute('aria-label', label);
        }
        days.append(cell);
      }
      section.append(days);
      calendars.append(section);
    }
  }

  function render() {
    const filtered = filteredEntries();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * pageSize;
    const visible = new Set(filtered.slice(start, start + pageSize));
    entries.forEach((entry) => {
      entry.article.hidden = !visible.has(entry);
    });
    monthSelect.value = state.month || 'all';
    resultHeading.textContent = state.day
      ? dateLabel(state.day)
      : state.month
        ? monthLabel(state.month)
        : 'All updates';
    const range = `${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} updates`;
    resultCount.textContent = state.day ? `${dateLabel(state.day)} · ${range}` : range;
    dayFilter.hidden = !state.day;
    renderPagination(totalPages);
    const year = state.month ? state.month.slice(0, 4) : years[0];
    if (calendarYear !== year) renderCalendar(year);
    calendars.querySelectorAll('[data-date]').forEach((cell) => {
      cell.setAttribute('aria-pressed', String(cell.dataset.date === state.day));
    });
  }

  monthSelect.add(new Option('All months', 'all'));
  months.forEach((month) => {
    monthSelect.add(new Option(monthLabel(month), month));
  });
  years.forEach((year) => yearSelect.add(new Option(year, year)));
  monthSelect.addEventListener('change', () =>
    navigate({
      month: monthSelect.value === 'all' ? '' : monthSelect.value,
      day: '',
      page: 1,
    }),
  );
  yearSelect.addEventListener('change', () =>
    navigate({
      month: months.find((month) => month.startsWith(yearSelect.value)),
      day: '',
      page: 1,
    }),
  );
  dayFilter.addEventListener('click', () => navigate({ day: '', page: 1 }));
  window.addEventListener('popstate', readLocation);
  window.addEventListener('hashchange', readLocation);

  readLocation();
  root.querySelectorAll('[data-enhanced-control]').forEach((control) => {
    control.hidden = false;
  });
})();
