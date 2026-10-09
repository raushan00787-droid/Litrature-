(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        toggle.textContent = 'Menu';
      }
    });
  }
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(link => {
    if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
  const search = document.querySelector('[data-library-search]');
  const cards = [...document.querySelectorAll('[data-work-card]')];
  const empty = document.querySelector('[data-empty-state]');
  if (search && cards.length) {
    search.addEventListener('input', () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const match = card.textContent.toLowerCase().includes(query) ||
          (card.dataset.search || '').toLowerCase().includes(query);
        card.hidden = !match;
        if (match) visible++;
      });
      if (empty) empty.classList.toggle('visible', visible === 0);
    });
  }
})();