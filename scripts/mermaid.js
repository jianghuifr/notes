// ============================================
// Warmpaper theme extensions
// ============================================

// --- ECharts: convert ```echarts fenced blocks to <div class="echarts"> ---
hexo.extend.filter.register('after_render:html', function (str, data) {
  return str.replace(/<figure class="highlight plaintext">\s*<table>\s*<tr>\s*<td class="gutter">[\s\S]*?<\/td>\s*<td class="code"><pre>(.*?)<\/pre><\/td>\s*<\/tr>\s*<\/table>\s*<\/figure>/g, function (match, code) {
    var raw = code
      .replace(/&#123;/g, '{').replace(/&#125;/g, '}')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '')
      .replace(/<br>/g, '\n')
      .trim();
    try {
      var obj = JSON.parse(raw);
      if (obj && (obj.series || obj.xAxis || obj.yAxis || obj.radar || obj.geo || obj.visualMap)) {
        return '<div class="sea-code-block" data-diagram="echarts">'
          + '<div class="sea-code-title"><span class="sea-code-lang">echarts</span></div>'
          + '<div class="sea-code-body">' + match
          + '<div class="echarts">' + raw.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</div>'
          + '</div></div>';
      }
    } catch(e) {}
    return match;
  });
}, 5);

// --- Mermaid: server-side wrap <pre class="mermaid"> ---
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (!data.page || !data.page.__post) return str;
  return str.replace(/<pre class="mermaid">([\s\S]*?)<\/pre>/g, function (match, code) {
    if (match.indexOf('sea-code-block') !== -1) return match;
    var lines = code.split('\n');
    var gutter = lines.map(function(_, i) { return '<span class="line">' + (i + 1) + '</span>'; }).join('<br>');
    var srcLines = lines.map(function(l) { return '<span class="line">' + l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>'; }).join('<br>');
    return '<div class="sea-code-block" data-diagram="mermaid">'
      + '<div class="sea-code-title"><span class="sea-code-lang">mermaid</span></div>'
      + '<div class="sea-code-body">'
      + '<figure class="highlight plaintext"><table><tr><td class="gutter"><pre>' + gutter + '</pre></td><td class="code"><pre>' + srcLines + '</pre></td></tr></table></figure>'
      + '<div class="sea-code-diagrams">'
      + '<pre class="mermaid" mode="dark">' + code + '</pre>'
      + '<pre class="mermaid" mode="light" style="display:none">' + code + '</pre>'
      + '</div>'
      + '</div></div>';
  });
}, 5);

// --- Mermaid CDN: lazy-loaded by code-block-unified.js ---

// --- ECharts themes: registered in code-block-unified.js after CDN loads ---

// --- Code block CSS (Warmpaper palette + Qianwen-style layout) ---
var codeBlockCSS = '\n<style id="code-block-style">\n/* Warmpaper-aligned code block colors.\n   Per-block night mode toggle switches between these two palettes. */\n.sea-code-block {\n  margin: 1.2em 0;\n  border: 1px solid #D5CEC2;\n  border-radius: 1em;\n  overflow: hidden;\n  background: #F0EBE3;\n}\n.sea-code-title {\n  display: flex; justify-content: space-between; align-items: center;\n  padding: 0 12px; height: 36px; font-size: 12px;\n  color: #5C554E; background: #E8E2D8;\n  border-bottom: 1px solid #D5CEC2;\n  user-select: none;\n}\n.sea-code-lang {\n  font-weight: 500; font-size: 12px;\n  text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\n  opacity: 0.85;\n}\n.sea-code-actions { display: flex; gap: 4px; align-items: center; }\n.sea-code-btn {\n  display: inline-flex; align-items: center; justify-content: center;\n  width: 24px; height: 24px; border: none; background: transparent;\n  color: currentColor; cursor: pointer; border-radius: 6px;\n  font-size: 14px; opacity: 0.7; padding: 0; position: relative;\n  transition: opacity 0.15s, background 0.15s;\n}\n.sea-code-btn:hover { background: rgba(128,128,128,0.12); opacity: 1; }\n.sea-code-btn svg { width: 16px; height: 16px; display: block; }\n.sea-code-btn.copied svg { opacity: 0; }\n.sea-code-btn.copied::after { content: "\\2713"; position: absolute; font-size: 14px; }\n.sea-code-body { overflow-x: auto; }\n.sea-code-body table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 0; }\n.sea-code-body td { padding: 0; border: none; }\n.sea-code-body .gutter {\n  width: 3em; vertical-align: top; user-select: none;\n  border-right: 1px solid #D5CEC2;\n}\n.sea-code-body .gutter pre {\n  padding: 14px 10px !important; margin: 0 !important;\n  text-align: right; color: #A09888; font-style: italic;\n  font-size: 13px; line-height: 1.6;\n  background: transparent !important; border: none !important; border-radius: 0 !important;\n}\n.sea-code-body .code { vertical-align: top; }\n.sea-code-body .code pre {\n  padding: 14px 16px !important; margin: 0 !important;\n  background: transparent !important; border: none !important; border-radius: 0 !important;\n  color: #2D2B28 !important; line-height: 1.6; font-size: 13px;\n}\n.sea-code-body code {\n  font-family: "SF Mono","Cascadia Code","Fira Code","JetBrains Mono",Menlo,Consolas,monospace !important;\n  font-size: 13px !important; line-height: 1.6 !important; tab-size: 4;\n}\n.sea-code-block.collapsed .sea-code-body { display: none; }\n\n/* Mermaid SVG + pre: transparent bg flows with code block theme */\n.sea-code-block[data-diagram="mermaid"] pre.mermaid,\n.sea-code-block[data-diagram="mermaid"] svg { background: transparent !important; }\n\n/* Dark mode palette */\n.sea-code-block.code-theme-dark {\n  border-color: #2F2924;\n  background: #15110E;\n}\n.sea-code-block.code-theme-dark .sea-code-title {\n  color: #A8A099;\n  background: #1C1814;\n  border-bottom-color: #2F2924;\n}\n.sea-code-block.code-theme-dark .sea-code-body .gutter {\n  border-right-color: #2F2924;\n}\n.sea-code-block.code-theme-dark .sea-code-body .gutter pre {\n  color: #5C554E !important;\n}\n.sea-code-block.code-theme-dark .sea-code-body .code pre {\n  background: transparent !important;\n  color: #D4C9BC !important;\n}\n\n/* Source/Diagram toggle */\n.sea-code-block[data-diagram] .sea-code-body > figure.highlight { display: none; }\n.sea-code-block[data-diagram].show-raw .sea-code-body > figure.highlight { display: block; }\n.sea-code-block[data-diagram].show-raw .sea-code-body > .mermaid,\n.sea-code-block[data-diagram].show-raw .sea-code-body > .echarts { display: none; }\n\n/* Neutralize Warmpaper figure.highlight */\nfigure.highlight {\n  background: transparent !important;\n  border: none !important;\n  border-radius: 0 !important;\n  margin: 0 !important;\n}\n</style>\n<style id="echarts-style">\n.echarts { width: 100%; min-height: 400px; margin: 1.5em 0; }\n</style>';

// --- Code block JS (Qianwen-style interaction) ---
var codeBlockJS = '\n<script>\n(function() {\n  var svgCopy = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>\';\n  var svgSun = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>\';\n  var svgMoon = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>\';\n  var svgChevronUp = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>\';\n  var svgChevronDown = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>\';\n\n  document.querySelectorAll("figure.highlight").forEach(function(fig) {\n    if (fig.closest(".sea-code-block")) return;\n    var lang = "";\n    fig.classList.forEach(function(c) { if (c !== "highlight") lang = c; });\n\n    var wrapper = document.createElement("div");\n    wrapper.className = "sea-code-block";\n    var title = document.createElement("div");\n    title.className = "sea-code-title";\n    var langSpan = document.createElement("span");\n    langSpan.className = "sea-code-lang";\n    langSpan.textContent = lang;\n    var actions = document.createElement("div");\n    actions.className = "sea-code-actions";\n\n    // Copy button\n    var copyBtn = document.createElement("button");\n    copyBtn.className = "sea-code-btn";\n    copyBtn.title = "\\u590d\\u5236";\n    copyBtn.innerHTML = svgCopy;\n    copyBtn.onclick = function() {\n      var codeEl = fig.querySelector(".code") || fig;\n      navigator.clipboard.writeText(codeEl.textContent).then(function() {\n        copyBtn.classList.add("copied");\n        setTimeout(function() { copyBtn.classList.remove("copied"); }, 1500);\n      });\n    };\n\n    // Night mode toggle (default dark, independent of site theme)\n    var darkBtn = document.createElement("button");\n    darkBtn.className = "sea-code-btn";\n    darkBtn.title = "\\u5207\\u6362\\u4e3b\\u9898";\n    var STORAGE_KEY = "code-block-theme";\n    var isCodeDark = true;\n    try {\n      var saved = localStorage.getItem(STORAGE_KEY);\n      if (saved === "light") isCodeDark = false;\n    } catch(e) {}\n    var updateIcon = function() { darkBtn.innerHTML = isCodeDark ? svgSun : svgMoon; };\n    updateIcon();\n    if (isCodeDark) wrapper.classList.add("code-theme-dark");\n    darkBtn.onclick = function() {\n      isCodeDark = !isCodeDark;\n      wrapper.classList.toggle("code-theme-dark", isCodeDark);\n      updateIcon();\n      try { localStorage.setItem(STORAGE_KEY, isCodeDark ? "dark" : "light"); } catch(e) {}\n    };\n\n    // Collapse button\n    var collapseBtn = document.createElement("button");\n    collapseBtn.className = "sea-code-btn";\n    collapseBtn.title = "\\u6298\\u53e0";\n    collapseBtn.innerHTML = svgChevronUp;\n    collapseBtn.onclick = function() {\n      wrapper.classList.toggle("collapsed");\n      collapseBtn.innerHTML = wrapper.classList.contains("collapsed") ? svgChevronDown : svgChevronUp;\n    };\n\n    actions.appendChild(copyBtn);\n    actions.appendChild(darkBtn);\n    actions.appendChild(collapseBtn);\n    title.appendChild(langSpan);\n    title.appendChild(actions);\n\n    var body = document.createElement("div");\n    body.className = "sea-code-body";\n    fig.parentNode.insertBefore(wrapper, fig);\n    body.appendChild(fig);\n    wrapper.appendChild(title);\n    wrapper.appendChild(body);\n  });\n})();\n</script>';

hexo.extend.filter.register('after_render:html', function (str, data) {
  var hasCode = str.includes('figure class="highlight');
  var hasEcharts = str.includes('class="echarts"');
  var hasMermaid = str.includes('data-diagram="mermaid"');
  if (!hasCode && !hasEcharts && !hasMermaid) return str;
  var out = str;
  if (hasCode || hasEcharts || hasMermaid) {
    out = out.replace('</head>', codeBlockCSS + '\n</head>');
  }
  if (hasCode) {
    out = out.replace('</body>', codeBlockJS + '\n</body>');
  }
  return out;
}, 8);