// Unified code block interactions — theme toggle + buttons for mermaid/echarts blocks
(function() {
  var STORAGE_KEY = "code-block-theme";

  // === Theme detection ===
  function detectSiteTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (!t) { try { t = localStorage.getItem("theme"); } catch(e) {} }
    if (!t) { t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
    return t;
  }

  function getIsDark() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (saved === "light") return false;
    if (saved === "dark") return true;
    return detectSiteTheme() === "dark";
  }

  var isDark = getIsDark();

  // === SVG icons ===
  var svgCopy = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>';
  var svgSun = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>';
  var svgMoon = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>';
  var svgChevronUp = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>';
  var svgChevronDown = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>';
  var svgDiagram = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

  // === Mermaid re-render ===
  function rerenderMermaid(dark) {
    if (typeof mermaid === "undefined") return;
    var sel = '.sea-code-block[data-diagram="mermaid"] pre.mermaid';
    var els = document.querySelectorAll(sel);
    if (!els.length) return;
    mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default", securityLevel: "loose" });
    els.forEach(function(el) {
      var src = el.getAttribute("data-source");
      if (!src) return;
      el.removeAttribute("data-processed");
      el.innerHTML = "";
      el.textContent = src;
    });
    mermaid.run({ querySelector: sel });
  }

  // === Sync all code blocks ===
  function syncAll(dark) {
    document.querySelectorAll(".sea-code-block").forEach(function(b) {
      b.classList.toggle("code-theme-dark", dark);
    });
    document.querySelectorAll(".sea-code-btn").forEach(function(b) {
      if (b.title === "\u5207\u6362\u4e3b\u9898") {
        b.innerHTML = dark ? svgSun : svgMoon;
      }
    });
    rerenderMermaid(dark);
  }

  // === Build action buttons ===
  function buildActions(diagramType) {
    var actions = document.createElement("div");
    actions.className = "sea-code-actions";

    // Copy
    var cb = document.createElement("button");
    cb.className = "sea-code-btn";
    cb.title = "\u590d\u5236";
    cb.innerHTML = svgCopy;
    cb.onclick = function() {
      var block = cb.closest(".sea-code-block");
      var src = block.querySelector(".sea-code-body pre") || block.querySelector(".sea-code-body .code") || block.querySelector(".sea-code-body figure");
      var text = src ? src.textContent : "";
      navigator.clipboard.writeText(text).then(function() {
        cb.classList.add("copied");
        setTimeout(function() { cb.classList.remove("copied"); }, 1500);
      });
    };
    actions.appendChild(cb);

    // Theme toggle
    var tb = document.createElement("button");
    tb.className = "sea-code-btn";
    tb.title = "\u5207\u6362\u4e3b\u9898";
    tb.innerHTML = isDark ? svgSun : svgMoon;
    tb.onclick = function() {
      isDark = !isDark;
      syncAll(isDark);
      try { localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light"); } catch(e) {}
    };
    actions.appendChild(tb);

    // Collapse
    var fb = document.createElement("button");
    fb.className = "sea-code-btn";
    fb.title = "\u6298\u53e0";
    fb.innerHTML = svgChevronUp;
    fb.onclick = function() {
      var block = fb.closest(".sea-code-block");
      block.classList.toggle("collapsed");
      fb.innerHTML = block.classList.contains("collapsed") ? svgChevronDown : svgChevronUp;
    };
    actions.appendChild(fb);

    // Source/Diagram toggle (mermaid + echarts)
    if (diagramType) {
      var db = document.createElement("button");
      db.className = "sea-code-btn diagram-toggle";
      db.title = "\u6e90\u7801/\u56fe\u8868";
      db.innerHTML = svgDiagram;
      db.onclick = function() {
        var block = db.closest(".sea-code-block");
        block.classList.toggle("show-raw");
        if (!block.classList.contains("show-raw")) {
          var ec = block.querySelector(".echarts");
          if (ec && ec._echarts_instance) ec._echarts_instance.resize();
        }
      };
      actions.appendChild(db);
    }

    return actions;
  }

  // === Init: inject buttons, set theme, watch changes ===
  function init() {
    // Add buttons to mermaid blocks
    document.querySelectorAll('.sea-code-block[data-diagram="mermaid"] .sea-code-title').forEach(function(title) {
      if (title.querySelector(".sea-code-actions")) return;
      title.appendChild(buildActions("mermaid"));
    });

    // Add buttons to echarts blocks
    document.querySelectorAll('.sea-code-block[data-diagram="echarts"] .sea-code-title').forEach(function(title) {
      var existing = title.querySelector(".sea-code-actions");
      if (existing && existing.children.length > 0) {
        // Replace the minimal echarts actions with full set
        existing.replaceWith(buildActions("echarts"));
      }
    });

  // Apply initial theme (CSS only — mermaid already rendered by inline script)
    document.querySelectorAll(".sea-code-block").forEach(function(b) {
      b.classList.toggle("code-theme-dark", isDark);
    });
    document.querySelectorAll(".sea-code-btn").forEach(function(b) {
      if (b.title === "\u5207\u6362\u4e3b\u9898") {
        b.innerHTML = isDark ? svgSun : svgMoon;
      }
    });

    // Watch for site theme changes (follow if user hasn't manually set code block preference)
    if (window.MutationObserver) {
      new MutationObserver(function() {
        try { if (localStorage.getItem(STORAGE_KEY)) return; } catch(e) {}
        var shouldDark = detectSiteTheme() === "dark";
        if (shouldDark !== isDark) {
          isDark = shouldDark;
          syncAll(isDark);
        }
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
  }

  // Run after mermaid.js loads (it's loaded before us in the HTML)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { setTimeout(init, 100); });
  } else {
    setTimeout(init, 100);
  }
})();
