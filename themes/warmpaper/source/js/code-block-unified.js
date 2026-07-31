// Unified code block interactions — pre-render mermaid dark+light, toggle visibility only
(function() {
  var STORAGE_KEY = "code-block-theme";
  var isDark = true;
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
  if (saved === "light") {
    isDark = false;
  } else if (saved === null) {
    var siteTheme = document.documentElement.getAttribute("data-theme");
    if (!siteTheme) { try { siteTheme = localStorage.getItem("theme"); } catch(e) {} }
    if (!siteTheme) { siteTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
    isDark = (siteTheme === "dark");
  }

  var svgCopy = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>';
  var svgSun = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>';
  var svgMoon = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>';
  var svgChevronUp = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>';
  var svgChevronDown = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>';
  var svgDiagram = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';

  // --- Show the correct diagram container based on current dark/light state ---
  function showMermaidMode(dark) {
    var mode = dark ? "dark" : "light";
    var alt = dark ? "light" : "dark";
    document.querySelectorAll('.sea-code-block[data-diagram="mermaid"] .sea-code-diagrams').forEach(function(diagrams) {
      var active = diagrams.querySelector('pre.mermaid[mode="' + mode + '"]');
      var hidden = diagrams.querySelector('pre.mermaid[mode="' + alt + '"]');
      if (active) active.style.display = "";
      if (hidden) hidden.style.display = "none";
    });
  }

  // --- Apply mode attribute for CSS theming (figure.highlight bg etc.) ---
  function setMode(dark) {
    var mode = dark ? "dark" : "light";
    document.querySelectorAll(".sea-code-block").forEach(function(b) {
      b.classList.toggle("code-theme-dark", dark);
      var fig = b.querySelector("figure.highlight");
      if (fig) fig.setAttribute("mode", mode);
    });
    showMermaidMode(dark);
    document.querySelectorAll(".sea-code-btn").forEach(function(b) {
      if (b.title === "\u5207\u6362\u4e3b\u9898") {
        b.innerHTML = dark ? svgSun : svgMoon;
      }
    });
  }

  function buildActions(diagramType) {
    var hasToggle = diagramType !== "";
    var actions = document.createElement("div");
    actions.className = "sea-code-actions";

    var cb = document.createElement("button");
    cb.className = "sea-code-btn";
    cb.title = "\u590d\u5236";
    cb.innerHTML = svgCopy;
    cb.onclick = function() {
      var block = cb.closest(".sea-code-block");
      var src = block.querySelector(".sea-code-body .code pre") || block.querySelector(".sea-code-body figure.highlight");
      var text = src ? (src.innerText || src.textContent) : "";
      navigator.clipboard.writeText(text).then(function() {
        cb.classList.add("copied");
        setTimeout(function() { cb.classList.remove("copied"); }, 1500);
      });
    };
    actions.appendChild(cb);

    var tb = document.createElement("button");
    tb.className = "sea-code-btn";
    tb.title = "\u5207\u6362\u4e3b\u9898";
    tb.innerHTML = isDark ? svgSun : svgMoon;
    actions.appendChild(tb);

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

  // --- Init: inject title bar buttons ---
  function initBlocks() {
    setMode(isDark);

    // Wrap regular code blocks (non-diagram) in .sea-code-block with title bar
    document.querySelectorAll("figure.highlight").forEach(function(fig) {
      if (fig.closest(".sea-code-block")) return;
      var lang = "";
      fig.classList.forEach(function(c) { if (c !== "highlight") lang = c; });

      var wrapper = document.createElement("div");
      wrapper.className = "sea-code-block";
      if (isDark) wrapper.classList.add("code-theme-dark");

      var title = document.createElement("div");
      title.className = "sea-code-title";
      var langSpan = document.createElement("span");
      langSpan.className = "sea-code-lang";
      langSpan.textContent = lang;
      title.appendChild(langSpan);
      title.appendChild(buildActions(""));

      var body = document.createElement("div");
      body.className = "sea-code-body";
      fig.parentNode.insertBefore(wrapper, fig);
      body.appendChild(fig);
      wrapper.appendChild(title);
      wrapper.appendChild(body);
    });

    document.querySelectorAll('.sea-code-block[data-diagram="mermaid"] .sea-code-title').forEach(function(title) {
      if (title.querySelector(".sea-code-actions")) return;
      title.appendChild(buildActions("mermaid"));
    });

    document.querySelectorAll('.sea-code-block[data-diagram="echarts"]').forEach(function(block) {
      var title = block.querySelector(".sea-code-title");
      if (!title) return;
      var actions = block.querySelector(".sea-code-actions");
      if (actions && actions.children.length > 1) return;
      if (actions) { title.replaceChild(buildActions("echarts"), actions); }
      else { title.appendChild(buildActions("echarts")); }
    });

    // Global theme toggle — only switch visibility, no re-render
    document.querySelectorAll(".sea-code-btn").forEach(function(btn) {
      if (btn.title === "\u5207\u6362\u4e3b\u9898") {
        btn.onclick = function() {
          isDark = !isDark;
          setMode(isDark);
          try { localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light"); } catch(e) {}
        };
      }
    });
  }

  // --- Lazy load a script ---
  function loadScript(url, cb) {
    var s = document.createElement("script");
    s.src = url;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  // --- Pre-render mermaid both themes once, then never again ---
  function initMermaid() {
    if (typeof mermaid === "undefined") return;
    var blocks = document.querySelectorAll('.sea-code-block[data-diagram="mermaid"]');
    if (!blocks.length) return;

    // Store source on each block via data attribute (object keys coerce DOM→"[object HTMLDivElement]")
    blocks.forEach(function(block) {
      var codePre = block.querySelector(".sea-code-body figure.highlight .code pre");
      var lines = codePre ? codePre.querySelectorAll(".line") : null;
      var src = "";
      if (lines) { lines.forEach(function(l) { src += l.textContent + "\n"; }); }
      block.setAttribute("data-mermaid-src", src);
    });

    function renderTheme(dark, cb) {
      var theme = dark ? "dark" : "default";
      var mode = dark ? "dark" : "light";
      blocks.forEach(function(block) {
        var src = block.getAttribute("data-mermaid-src");
        var el = block.querySelector('.sea-code-diagrams pre.mermaid[mode="' + mode + '"]');
        if (!el || !src) return;
        // Force visible during render — hidden elements break mermaid layout
        el.style.display = "";
        el.removeAttribute("data-processed");
        el.innerHTML = "";
        el.textContent = src;
      });
      mermaid.initialize({ startOnLoad: false, theme: theme, securityLevel: "loose" });
      var p = mermaid.run({ querySelector: '.sea-code-block[data-diagram="mermaid"] .sea-code-diagrams pre.mermaid[mode="' + mode + '"]' });
      if (p && p.then) {
        p.then(function() { if (cb) cb(); }).catch(function(e) {
          console.warn("mermaid render failed (" + mode + "):", e);
          if (cb) cb();
        });
      } else {
        if (cb) cb();
      }
    }

    // Render current theme first, then the other; finally restore correct visibility
    renderTheme(isDark, function() {
      document.querySelectorAll('.sea-code-block[data-diagram="mermaid"]').forEach(function(b) {
        b.classList.remove("show-raw");
        b.classList.add("mermaid-ready");
      });
      renderTheme(!isDark, function() {
        showMermaidMode(isDark);
      });
    });
  }

  // --- Render echarts diagrams ---
  function renderEcharts() {
    if (typeof echarts === "undefined") return;
    try {
      echarts.registerTheme("warmpaper", {"color":["#C4875D","#889B6E","#D4A76A","#7B9CB5","#C4827A","#B8A45C","#8B7E6E","#6E9B8B"],"backgroundColor":"transparent","title":{"textStyle":{"color":"#4A4540"},"subtextStyle":{"color":"#8A8278"}},"line":{"itemStyle":{"borderWidth":2},"lineStyle":{"width":2},"symbolSize":6,"symbol":"circle","smooth":false},"bar":{"itemStyle":{"barBorderWidth":0,"barBorderColor":"#D5CEC2"}},"pie":{"itemStyle":{"borderWidth":0,"borderColor":"#D5CEC2"}},"categoryAxis":{"axisLine":{"show":true,"lineStyle":{"color":"#D5CEC2"}},"axisTick":{"show":false},"axisLabel":{"color":"#6B645C"},"splitLine":{"show":false}},"valueAxis":{"axisLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"color":"#8A8278"},"splitLine":{"show":true,"lineStyle":{"color":"#EDE8E0","type":"dashed","width":1}}},"tooltip":{"backgroundColor":"#FFFBF5","borderColor":"#D5CEC2","borderWidth":1,"textStyle":{"color":"#4A4540"}},"legend":{"textStyle":{"color":"#5C554E"}},"dataZoom":{"backgroundColor":"rgba(240,235,227,0)","textStyle":{"color":"#5C554E"},"borderColor":"#D5CEC2"},"markPoint":{"label":{"color":"#FFFBF5"}}});
      echarts.registerTheme("warmpaper-dark", {"color":["#E0A87C","#A3B88A","#E8C48A","#99B5CC","#D99E96","#CFBE78","#A89888","#8AB5A7"],"backgroundColor":"transparent","title":{"textStyle":{"color":"#C8C0B8"},"subtextStyle":{"color":"#706860"}},"line":{"itemStyle":{"borderWidth":2},"lineStyle":{"width":2},"symbolSize":6,"symbol":"circle","smooth":false},"bar":{"itemStyle":{"barBorderWidth":0,"barBorderColor":"#2F2924"}},"pie":{"itemStyle":{"borderWidth":0,"borderColor":"#2F2924"}},"categoryAxis":{"axisLine":{"show":true,"lineStyle":{"color":"#2F2924"}},"axisTick":{"show":false},"axisLabel":{"color":"#8A8278"},"splitLine":{"show":false}},"valueAxis":{"axisLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"color":"#706860"},"splitLine":{"show":true,"lineStyle":{"color":"#2A241C","type":"dashed","width":1}}},"tooltip":{"backgroundColor":"#1C1814","borderColor":"#2F2924","borderWidth":1,"textStyle":{"color":"#D4C9BC"}},"legend":{"textStyle":{"color":"#A8A099"}},"dataZoom":{"backgroundColor":"rgba(21,17,14,0)","textStyle":{"color":"#A8A099"},"borderColor":"#2F2924"},"markPoint":{"label":{"color":"#1C1814"}}});
      function getTheme() {
        return document.documentElement.getAttribute("data-theme") === "dark" ? "warmpaper-dark" : "warmpaper";
      }
      document.querySelectorAll(".echarts").forEach(function(el) {
        try {
          var raw = el.textContent.trim();
          var config = JSON.parse(raw);
          var chart = echarts.init(el, getTheme());
          chart.setOption(config);
          el._echarts_instance = chart;
          var ro = new ResizeObserver(function() { chart.resize(); });
          ro.observe(el);
        } catch(e) {}
      });
      document.querySelectorAll('.sea-code-block[data-diagram="echarts"]').forEach(function(b) {
        b.classList.remove("show-raw");
      });
    } catch(e) {}
  }

  // --- Load diagrams lazily ---
  function loadDiagrams() {
    var hasMermaid = document.querySelector('.sea-code-block[data-diagram="mermaid"]');
    var hasEcharts = document.querySelector('.sea-code-block[data-diagram="echarts"]');

    if (hasMermaid) {
      loadScript("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js", function() {
        initMermaid();
      });
    }
    if (hasEcharts) {
      loadScript("https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js", function() {
        renderEcharts();
      });
    }
  }

  // --- Watch for site theme changes ---
  if (window.MutationObserver) {
    var observer = new MutationObserver(function() {
      var manual = null;
      try { manual = localStorage.getItem(STORAGE_KEY); } catch(e) {}
      if (manual) return;
      var t = document.documentElement.getAttribute("data-theme");
      if (!t) { try { t = localStorage.getItem("theme"); } catch(e) {} }
      if (!t) { t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
      var shouldDark = (t === "dark");
      if (shouldDark !== isDark) {
        isDark = shouldDark;
        setMode(isDark);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  // --- Start ---
  initBlocks();
  requestAnimationFrame(function() {
    requestAnimationFrame(loadDiagrams);
  });
})();
