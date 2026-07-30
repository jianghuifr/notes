// Unified code block interactions — global theme toggle + diagram block buttons
(function() {
  var STORAGE_KEY = "code-block-theme";
  var isDark = true;
  try { if (localStorage.getItem(STORAGE_KEY) === "light") isDark = false; } catch(e) {}

  var svgCopy = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>';
  var svgSun = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>';
  var svgMoon = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>';
  var svgChevronUp = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>';
  var svgChevronDown = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>';

  function syncAll(dark) {
    document.querySelectorAll(".sea-code-block").forEach(function(b) {
      b.classList.toggle("code-theme-dark", dark);
    });
    document.querySelectorAll(".sea-code-btn").forEach(function(b) {
      if (b.title === "\u5207\u6362\u4e3b\u9898") {
        b.innerHTML = dark ? svgSun : svgMoon;
      }
    });
  }

  function injectDiagramButtons(block) {
    var actions = block.querySelector(".sea-code-actions");
    if (!actions) return;

    // Copy button
    if (!actions.querySelector('[title="\u590d\u5236"]')) {
      var cb = document.createElement("button");
      cb.className = "sea-code-btn";
      cb.title = "\u590d\u5236";
      cb.innerHTML = svgCopy;
      cb.onclick = function() {
        var src = block.querySelector(".sea-code-body pre") || block.querySelector(".sea-code-body .code") || block.querySelector(".sea-code-body figure");
        var text = src ? src.textContent : "";
        navigator.clipboard.writeText(text).then(function() {
          cb.classList.add("copied");
          setTimeout(function() { cb.classList.remove("copied"); }, 1500);
        });
      };
      actions.insertBefore(cb, actions.firstChild);
    }

    // Theme toggle button
    if (!actions.querySelector('[title="\u5207\u6362\u4e3b\u9898"]')) {
      var tb = document.createElement("button");
      tb.className = "sea-code-btn";
      tb.title = "\u5207\u6362\u4e3b\u9898";
      tb.innerHTML = isDark ? svgSun : svgMoon;
      var diagBtn = actions.querySelector(".diagram-toggle");
      actions.insertBefore(tb, diagBtn || null);
    }

    // Collapse button
    if (!actions.querySelector('[title="\u6298\u53e0"]')) {
      var fb = document.createElement("button");
      fb.className = "sea-code-btn";
      fb.title = "\u6298\u53e0";
      fb.innerHTML = svgChevronUp;
      fb.onclick = function() {
        block.classList.toggle("collapsed");
        fb.innerHTML = block.classList.contains("collapsed") ? svgChevronDown : svgChevronUp;
      };
      var diagBtn = actions.querySelector(".diagram-toggle");
      actions.insertBefore(fb, diagBtn || null);
    }
  }

  setTimeout(function() {
    syncAll(isDark);

    // Inject copy/collapse/theme buttons into diagram blocks (mermaid, echarts)
    document.querySelectorAll(".sea-code-block[data-diagram]").forEach(injectDiagramButtons);

    // Hijack all theme toggle buttons — global toggle
    document.querySelectorAll(".sea-code-btn").forEach(function(btn) {
      if (btn.title === "\u5207\u6362\u4e3b\u9898") {
        btn.onclick = function() {
          isDark = !isDark;
          syncAll(isDark);
          try { localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light"); } catch(e) {}
        };
      }
    });
  }, 300);
})();
