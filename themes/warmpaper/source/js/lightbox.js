// Image lightbox — click to zoom any image inside post content
(function () {
  'use strict';

  var overlay = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  if (!overlay || !img) return;

  var lastFocus = null;

  function open(src, alt, capText) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    caption.textContent = capText || '';
    caption.style.display = capText ? '' : 'none';
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;

    // 点遮罩空白处 / 图片本体 / 图注，关闭
    if (overlay.classList.contains('open')) {
      if (t === overlay || t === img || t === caption) {
        e.preventDefault();
        close();
      }
      return;
    }

    // 打开：正文里的普通图片，且不在链接内、不是 mermaid/echarts 产物
    if (t.tagName === 'IMG' && t.closest('.post-content')) {
      if (t.closest('a') || t.closest('.sea-code-block')) return;
      e.preventDefault();
      open(t.currentSrc || t.src, t.alt, t.alt);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.preventDefault();
      close();
    }
  });
})();
