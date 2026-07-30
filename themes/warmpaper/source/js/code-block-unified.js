// Unified code block interactions — global theme toggle + diagram block wrapping & buttons
(function() {
  var STORAGE_KEY = "code-block-theme";
  var isDark = true;
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
  if (saved === "light") {
    isDark = false;
  } else if (saved === null) {
    // No saved preference: follow site theme
    isDark = (document.documentElement.getAttribute("data-theme") === "dark");
  } else {
    isDark = (saved !== "light");
  }

  var svgCopy = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>';
  var svgSun = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>';
  var svgMoon = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>';
  var svgChevronUp = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>';
  var svgChevronDown = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>';
  var svgDiagram = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

  function syncAll(dark) {
    document.querySelectorAll(".sea-code-block").forEach(function(b) {
      b.classList.toggle("code-theme-dark", dark);
    });
    document.querySelectorAll(".sea-code-btn").forEach(function(b) {
      if (b.title === "\u5207\u6362\u4e3b\u9898") {
        b.innerHTML = dark ? svgSun : svgMoon;
      }
    });
    // Re-render mermaid diagrams with appropriate theme
    if (typeof mermaid !== "undefined") {
      try {
        document.querySelectorAll('.sea-code-block[data-diagram="mermaid"] pre.mermaid').forEach(function(el) {
          var src = el.getAttribute("data-source");
          if (src) {
            el.removeAttribute("data-processed");
            el.innerHTML = "";
            el.textContent = src;
          }
        });
        mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default", securityLevel: "loose" });
        mermaid.run({ querySelector: '.sea-code-block[data-diagram="mermaid"] pre.mermaid' });
        // Restore data-source after re-render
        setTimeout(function() {
          document.querySelectorAll('.sea-code-block[data-diagram="mermaid"] pre.mermaid').forEach(function(el) {
            var src = el.getAttribute("data-source");
            if (src && !el.textContent.trim()) {
              el.textContent = src;
            }
          });
        }, 500);
      } catch(e) {}
    }
  }

  function buildActions(diagramType) {
    // diagramType: "mermaid" or "echarts"
    var hasToggle = diagramType !== ""; // mermaid and echarts both need source toggle

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

    // Theme
    var tb = document.createElement("button");
    tb.className = "sea-code-btn";
    tb.title = "\u5207\u6362\u4e3b\u9898";
    tb.innerHTML = isDark ? svgSun : svgMoon;
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

    // Source/Diagram toggle (mermaid and echarts)
    if (hasToggle) {
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

  function wrapMermaid(el) {
    if (el.closest(".sea-code-block")) return;

    var wrap = document.createElement("div");
    wrap.className = "sea-code-block";
    wrap.setAttribute("data-diagram", "mermaid");

    var title = document.createElement("div");
    title.className = "sea-code-title";
    var langSpan = document.createElement("span");
    langSpan.className = "sea-code-lang";
    langSpan.textContent = "mermaid";
    title.appendChild(langSpan);
    title.appendChild(buildActions("mermaid"));

    var body = document.createElement("div");
    body.className = "sea-code-body";

    // Hidden pre for source
    var srcPre = document.createElement("pre");
    srcPre.style.cssText = "padding:14px 16px;margin:0;background:transparent;font-family:SF Mono,Cascadia Code,Fira Code,JetBrains Mono,Menlo,Consolas,monospace;font-size:13px;line-height:1.6;color:inherit;border:none;border-radius:0;overflow:auto";
    srcPre.textContent = el.getAttribute("data-source") || el.textContent;
    body.appendChild(srcPre);

    el.parentNode.insertBefore(wrap, el);
    body.appendChild(el);
    wrap.appendChild(title);
    wrap.appendChild(body);

    if (isDark) wrap.classList.add("code-theme-dark");
  }

  function wrapBareMermaids() {
    // Wrap bare .mermaid elements that aren't already inside .sea-code-block
    document.querySelectorAll(".mermaid").forEach(function(el) {
      if (!el.closest(".sea-code-block")) {
        wrapMermaid(el);
      }
    });

    // Trigger mermaid re-render for newly wrapped elements
    if (typeof mermaid !== "undefined" && document.querySelector(".mermaid:not(.sea-code-block .mermaid)") === null) {
      // All mermaid elements are now wrapped; run mermaid again if needed
      try { mermaid.run({ querySelector: ".sea-code-block .mermaid" }); } catch(e) {}
    }
  }

  setTimeout(function() {
    syncAll(isDark);

    // Wrap bare mermaid elements
    wrapBareMermaids();

    // Inject buttons into echarts blocks (already wrapped by hexo converter)
    document.querySelectorAll('.sea-code-block[data-diagram="echarts"]').forEach(function(block) {
      var actions = block.querySelector(".sea-code-actions");
      if (!actions || actions.children.length > 1) return; // already injected
      // Replace existing actions with full set
      var title = block.querySelector(".sea-code-title");
      if (title && actions) {
        title.replaceChild(buildActions("echarts"), actions);
      }
    });

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
  }, 200);
})();
