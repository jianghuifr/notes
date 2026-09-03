// Reading progress bar + back-to-top + scroll reveal
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Reading progress bar ---
  var bar = document.getElementById('reading-progress-bar');
  if (bar) {
    var ticking = false;
    function updateProgress() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, (window.pageYOffset || doc.scrollTop) / max) : 0;
      bar.style.width = (ratio * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
    updateProgress();
  }

  // --- Back to top ---
  var topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    var btnTicking = false;
    function updateBtn() {
      btnTicking = false;
      var show = (window.pageYOffset || document.documentElement.scrollTop) > 480;
      topBtn.classList.toggle('is-visible', show);
    }
    window.addEventListener('scroll', function () {
      if (!btnTicking) {
        btnTicking = true;
        requestAnimationFrame(updateBtn);
      }
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    updateBtn();
  }

  // --- Scroll reveal ---
  // 不选 pre / figure.highlight：代码块会被 code-block-unified.js 重新包裹移动，
  // 外部动画与块内滚动、折叠状态交互容易出怪问题，保持静态更稳。
  var revealTargets = document.querySelectorAll(
    '.post-card, .post-title, .post-content h2, .post-content h3, ' +
    '.post-content img, .post-content table, .post-content blockquote, ' +
    '.post-footer, .archive-post, .page-content h1'
  );

  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      // 不支持或无偏好时保持静态
      revealTargets.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add('is-revealed');
          io.unobserve(el);
          // 动画结束后移除两个 class：.reveal.is-revealed 的 transform 会以相同
          // 特异性压掉 .post-card:hover 的上浮效果（后写胜出），必须清掉。
          el.addEventListener('transitionend', function h(e) {
            if (e.target !== el) return;
            el.classList.remove('reveal', 'is-revealed');
            el.removeEventListener('transitionend', h);
          });
        });
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05
      });
      revealTargets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    }
  }
})();
