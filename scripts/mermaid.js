// ============================================
// Warmpaper theme extensions
// ============================================

// --- ECharts: convert ```echarts fenced blocks to <div class="echarts"> ---
hexo.extend.filter.register('before_post_render', function (data) {
  if (!data.content) return data;
  // Replace ```echarts ... ``` with <div class="echarts">...</div>
  data.content = data.content.replace(/```echarts\s*\n([\s\S]*?)```/g, function (match, code) {
    return '<div class="echarts">\n' + code.trim() + '\n</div>';
  });
  return data;
});

// --- Mermaid ---
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (!data.page || !data.page.__post) return str;
  if (!str.includes('class="mermaid"') && !str.includes('pre class="mermaid"')) return str;
  const mermaidScript = `
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: (document.documentElement.getAttribute('data-theme') === 'dark') ? 'dark' : 'default',
    securityLevel: 'loose'
  });
</script>`;
  return str.replace('</body>', mermaidScript + '\n</body>');
}, 9);

// --- ECharts ---
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (!str.includes('class="echarts"')) return str;
  const echartsScript = `
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<script>
(function() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.echarts').forEach(function(el) {
    try {
      var raw = el.textContent.trim();
      var config = JSON.parse(raw);
      var chart = echarts.init(el, isDark ? 'dark' : null);
      chart.setOption(config);
      // Responsive
      var ro = new ResizeObserver(function() { chart.resize(); });
      ro.observe(el);
      // Re-render on theme change
      var observer = new MutationObserver(function(muts) {
        muts.forEach(function(m) {
          if (m.attributeName === 'data-theme') {
            var d = document.documentElement.getAttribute('data-theme') === 'dark';
            chart.dispose();
            chart = echarts.init(el, d ? 'dark' : null);
            chart.setOption(config);
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true });
    } catch(e) {}
  });
})();
</script>`;
  return str.replace('</body>', echartsScript + '\n</body>');
}, 9);

// --- Code block enhancement (Qianwen-style) ---
const codeBlockCSS = `
<style id="code-block-style">
:root {
  --code-border: #e1e4e8;
  --code-bg: #f6f8fa;
  --code-title-bg: #f0f0f2;
  --code-ln-color: #8b949e;
  --code-text: #393a34;
}
html[data-theme="dark"] {
  --code-border: #30363d;
  --code-bg: #0d1117;
  --code-title-bg: #161b22;
  --code-ln-color: #484f58;
  --code-text: #c9d1d9;
}
/* Override Warmpaper figure.highlight styles */
figure.highlight {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
}
/* Qianwen-style wrapper */
.sea-code-block {
  margin: 1.2em 0;
  border: 1px solid var(--code-border);
  border-radius: 0;
  overflow: hidden;
  background: var(--code-bg);
}
.sea-code-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-size: 12px;
  color: var(--color-text);
  background: var(--code-title-bg);
  border-bottom: 1px solid var(--code-border);
  user-select: none;
}
.sea-code-lang {
  font-weight: 500;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0.85;
}
.sea-code-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.sea-code-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.15s, background 0.15s;
  padding: 0;
  position: relative;
}
.sea-code-btn:hover {
  background: rgba(128,128,128,0.12);
  opacity: 1;
}
.sea-code-btn svg {
  width: 16px;
  height: 16px;
  display: block;
}
.sea-code-btn.copied svg {
  opacity: 0;
}
.sea-code-btn.copied::after {
  content: '✓';
  position: absolute;
  font-size: 14px;
}
.sea-code-body {
  overflow-x: auto;
}
.sea-code-body table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0;
}
.sea-code-body td {
  padding: 0;
  border: none;
}
.sea-code-body .gutter {
  width: 3em;
  vertical-align: top;
  user-select: none;
  border-right: 1px solid var(--code-border);
}
.sea-code-body .gutter pre {
  padding: 14px 10px !important;
  margin: 0 !important;
  text-align: right;
  color: var(--code-ln-color);
  font-style: italic;
  font-size: 13px;
  line-height: 1.6;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
}
.sea-code-body .code {
  vertical-align: top;
}
.sea-code-body .code pre {
  padding: 14px 16px !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  color: var(--code-text) !important;
  line-height: 1.6;
  font-size: 13px;
}
.sea-code-body code {
  font-family: 'SF Mono','Cascadia Code','Fira Code','JetBrains Mono',Menlo,Consolas,monospace !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  tab-size: 4;
}
.sea-code-block.collapsed .sea-code-body {
  display: none;
}
/* Per-block dark theme */
.sea-code-block.code-theme-dark .sea-code-body .code pre {
  background: #0d1117 !important;
  color: #c9d1d9 !important;
}
.sea-code-block.code-theme-dark .sea-code-body .gutter pre {
  color: #6e7681;
}
</style>
<style id="echarts-style">
.echarts { width: 100%; min-height: 400px; margin: 1.5em 0; }
</style>`;

const codeBlockJS = `
<script>
(function() {
  // SVG icons
  var svgCopy = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>';
  var svgSun = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>';
  var svgMoon = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>';
  var svgChevronUp = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>';
  var svgChevronDown = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>';

  document.querySelectorAll('figure.highlight').forEach(function(fig) {
    if (fig.closest('.sea-code-block')) return;
    // Extract language from class: "highlight bash" -> "bash"
    var lang = '';
    fig.classList.forEach(function(c) {
      if (c !== 'highlight') lang = c;
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'sea-code-block';
    var title = document.createElement('div');
    title.className = 'sea-code-title';
    var langSpan = document.createElement('span');
    langSpan.className = 'sea-code-lang';
    langSpan.textContent = lang;
    var actions = document.createElement('div');
    actions.className = 'sea-code-actions';

    // Copy
    var copyBtn = document.createElement('button');
    copyBtn.className = 'sea-code-btn';
    copyBtn.title = '复制';
    copyBtn.innerHTML = svgCopy;
    copyBtn.onclick = function() {
      var codeEl = fig.querySelector('.code') || fig;
      navigator.clipboard.writeText(codeEl.textContent).then(function() {
        copyBtn.classList.add('copied');
        setTimeout(function() { copyBtn.classList.remove('copied'); }, 1500);
      });
    };

    // Night mode (default dark, remembered in localStorage)
    var darkBtn = document.createElement('button');
    darkBtn.className = 'sea-code-btn';
    darkBtn.title = '切换主题';
    var STORAGE_KEY = 'code-block-theme';
    var isCodeDark = true; // default dark
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light') isCodeDark = false;
    } catch(e) {}
    var updateDarkIcon = function() { darkBtn.innerHTML = isCodeDark ? svgSun : svgMoon; };
    updateDarkIcon();
    if (isCodeDark) wrapper.classList.add('code-theme-dark');
    darkBtn.onclick = function() {
      isCodeDark = !isCodeDark;
      wrapper.classList.toggle('code-theme-dark', isCodeDark);
      updateDarkIcon();
      try { localStorage.setItem(STORAGE_KEY, isCodeDark ? 'dark' : 'light'); } catch(e) {}
    };

    // Collapse
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'sea-code-btn';
    collapseBtn.title = '折叠';
    collapseBtn.innerHTML = svgChevronUp;
    collapseBtn.onclick = function() {
      wrapper.classList.toggle('collapsed');
      collapseBtn.innerHTML = wrapper.classList.contains('collapsed') ? svgChevronDown : svgChevronUp;
    };

    actions.appendChild(copyBtn);
    actions.appendChild(darkBtn);
    actions.appendChild(collapseBtn);
    title.appendChild(langSpan);
    title.appendChild(actions);

    var body = document.createElement('div');
    body.className = 'sea-code-body';
    fig.parentNode.insertBefore(wrapper, fig);
    body.appendChild(fig);
    wrapper.appendChild(title);
    wrapper.appendChild(body);
  });
})();
</script>`;

hexo.extend.filter.register('after_render:html', function (str, data) {
  var hasCode = str.includes('figure class="highlight');
  var hasEcharts = str.includes('class="echarts"');
  if (!hasCode && !hasEcharts) return str;
  var out = str;
  if (hasCode || hasEcharts) {
    out = out.replace('</head>', codeBlockCSS + '\n</head>');
  }
  if (hasCode) {
    out = out.replace('</body>', codeBlockJS + '\n</body>');
  }
  return out;
}, 8);
