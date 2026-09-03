// Local full-text search over hexo-generator-searchdb output (search.xml)
(function () {
  'use strict';

  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var empty = document.getElementById('search-empty');
  var closeBtn = document.getElementById('search-close');
  var toggles = document.querySelectorAll('.search-toggle');
  if (!overlay || !input || !results || !empty) return;

  var INDEX_URL = overlay.getAttribute('data-search-url');
  var indexPromise = null;   // fetch + parse 后缓存
  var currentItems = [];     // 当前过滤结果 [{title, url, snippet}]
  var activeIndex = -1;
  var query = '';

  // ---------- index loading ----------
  function loadIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = fetch(INDEX_URL).then(function (r) {
      if (!r.ok) throw new Error('search index fetch failed: ' + r.status);
      return r.text();
    }).then(function (text) {
      var doc = new DOMParser().parseFromString(text, 'text/xml');
      if (doc.querySelector('parsererror')) throw new Error('search index parse failed');
      var entries = doc.querySelectorAll('entry');
      var posts = [];
      entries.forEach(function (entry) {
        var titleEl = entry.querySelector('title');
        var urlEl = entry.querySelector('url');
        var contentEl = entry.querySelector('content');
        posts.push({
          title: titleEl ? titleEl.textContent : '',
          url: urlEl ? urlEl.textContent : '',
          text: htmlToText(contentEl ? contentEl.textContent : '')
        });
      });
      return posts;
    });
    return indexPromise;
  }

  function htmlToText(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // ---------- highlighting ----------
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(text, q) {
    var safe = escapeHtml(text);
    var escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(escaped, 'gi'), function (m) {
      return '<mark>' + m + '</mark>';
    });
  }

  function makeSnippet(text, q) {
    var idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text.slice(0, 120);
    var start = Math.max(0, idx - 40);
    var end = Math.min(text.length, idx + q.length + 60);
    var prefix = start > 0 ? '…' : '';
    var suffix = end < text.length ? '…' : '';
    return prefix + text.slice(start, end) + suffix;
  }

  // ---------- filtering ----------
  function search(posts, q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var out = [];
    posts.forEach(function (p) {
      var titleL = p.title.toLowerCase();
      var textL = p.text.toLowerCase();
      // 所有词都必须命中（标题或正文）
      if (terms.every(function (t) { return titleL.indexOf(t) >= 0 || textL.indexOf(t) >= 0; })) {
        out.push(p);
      }
    });
    return out;
  }

  function render(queryStr) {
    query = queryStr.trim();
    activeIndex = -1;
    if (!query) {
      currentItems = [];
      results.innerHTML = '';
      empty.hidden = true;
      return;
    }

    var items = currentItems;
    if (!items.length) {
      empty.hidden = false;
      empty.textContent = '没有找到与 “' + query + '” 相关的文章';
      results.innerHTML = '';
      return;
    }

    empty.hidden = true;
    var frag = document.createDocumentFragment();
    items.forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'search-result';
      a.href = p.url;

      var title = document.createElement('div');
      title.className = 'search-result-title';
      title.innerHTML = highlight(p.title, query);

      var snip = document.createElement('div');
      snip.className = 'search-result-snippet';
      var where = p.text.toLowerCase().indexOf(query.toLowerCase());
      snip.innerHTML = highlight(makeSnippet(p.text, query), query) + (where < 0 ? ' <span style="white-space:nowrap">…</span>' : '');

      a.appendChild(title);
      a.appendChild(snip);
      frag.appendChild(a);
    });
    results.innerHTML = '';
    results.appendChild(frag);
  }

  // debounce input
  var debounceTimer = null;
  input.addEventListener('input', function () {
    var q = input.value;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      if (indexLoading && q.trim()) {
        empty.hidden = false;
        empty.textContent = '索引加载中…';
        return;
      }
      currentItems = search(indexCache || [], q);
      render(q);
    }, 120);
  });

  var indexCache = [];
  var indexLoading = false;

  // ---------- open / close ----------
  function open() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); }, 20);
    // 预取索引（首次打开时开始下载，不阻塞打开）
    indexLoading = true;
    loadIndex().then(function (posts) {
      indexLoading = false;
      indexCache = posts;
      if (input.value.trim()) {
        currentItems = search(posts, input.value.trim());
        render(input.value);
      }
    }).catch(function () {
      indexLoading = false;
      empty.hidden = false;
      empty.textContent = '搜索索引加载失败，请稍后重试';
    });
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
    empty.hidden = true;
    currentItems = [];
  }

  function toggle() {
    overlay.classList.contains('open') ? close() : open();
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', toggle);
  });
  closeBtn.addEventListener('click', close);

  // 点击遮罩空白处关闭（面板内点击不关闭）
  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });

  // ---------- keyboard ----------
  document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd+K 全站开关
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggle();
      return;
    }

    var isOpen = overlay.classList.contains('open');
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      close();
      return;
    }
    if (!isOpen || input !== document.activeElement) return;

    var items = document.querySelectorAll('.search-result');
    if (!items.length) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = e.key === 'ArrowDown'
        ? Math.min(activeIndex + 1, items.length - 1)
        : Math.max(activeIndex - 1, 0);
      items.forEach(function (el, i) { el.classList.toggle('active', i === activeIndex); });
      if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      window.location.href = items[activeIndex].getAttribute('href');
    }
  });
})();
