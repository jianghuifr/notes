// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  // Create backdrop overlay
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    overlay.classList.remove('open');
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    overlay.classList.add('open');
  }

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a nav link is clicked
  nav.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      closeMenu();
    }
  });

  // Close on overlay tap/click
  overlay.addEventListener('click', closeMenu);
  overlay.addEventListener('touchend', function (e) {
    e.preventDefault();
    closeMenu();
  });

  // Close on scroll
  window.addEventListener('scroll', function () {
    if (nav.classList.contains('open')) closeMenu();
  }, { passive: true });
})();

(function () {
  // TOC scroll tracking
  var tocLinks = document.querySelectorAll('.toc a');
  if (!tocLinks.length) return;

  var headings = document.querySelectorAll(
    '.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id]'
  );
  if (!headings.length) return;

  function setActive(id) {
    tocLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active');
      }
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    },
    {
      rootMargin: '-80px 0px -75% 0px',
    }
  );

  headings.forEach(function (heading) {
    observer.observe(heading);
  });
})();

// Theme toggle
(function () {
  var STORAGE_KEY = 'warmpaper-theme';
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  var mql = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return mql.matches ? 'dark' : 'light';
  }

  function syncIcon() {
    btn.setAttribute('data-theme-state', currentTheme());
  }

  btn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    btn.setAttribute('data-theme-state', next);
  });

  mql.addEventListener('change', function () {
    var hasManual = false;
    try { hasManual = !!localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!hasManual) syncIcon();
  });

  syncIcon();
})();
