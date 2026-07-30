// Inject mermaid.js into footer for Sea theme
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (!data.page || !data.page.__post) return str;
  if (!str.includes('class="mermaid"') && !str.includes('pre class="mermaid"')) return str;
  const mermaidScript = `
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: document.documentElement.getAttribute('theme') === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose'
  });
</script>`;
  return str.replace('</body>', mermaidScript + '\n</body>');
}, 9);

// Inject code block styling and behavior into all pages
const codeBlockCSS = `
<style id="code-block-style">
:root {
  --code-border: #e1e4e8;
  --code-bg: #f6f8fa;
  --code-title-bg: #f0f0f2;
  --code-ln-color: #008000;
  --code-text: #393a34;
}
html[theme=dark] {
  --code-border: #30363d;
  --code-bg: #0d1117;
  --code-title-bg: #161b22;
  --code-ln-color: #6e7681;
  --code-text: #c9d1d9;
}
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
  color: var(--sea-color-text-1);
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
.sea-code-body pre {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--code-text) !important;
  padding: 14px 16px !important;
}
.sea-code-body pre.line-numbers {
  padding-left: 3.8em !important;
}
.sea-code-body .line-numbers-rows {
  border-right: 1px solid var(--code-border) !important;
  left: -3.8em !important;
  width: 3em !important;
}
.sea-code-body .line-numbers-rows > span:before {
  color: var(--code-ln-color) !important;
  font-style: italic;
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
/* Per-block dark theme (night mode button) */
.sea-code-block.code-theme-dark .sea-code-body pre {
  background: #0d1117 !important;
  color: #c9d1d9 !important;
}
.sea-code-block.code-theme-dark .sea-code-body .line-numbers-rows > span:before {
  color: #6e7681 !important;
}
</style>`;

const codeBlockJS = `
<script>
(function() {
  // SVG sprites
  var svgCopy = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>';
  var svgSun = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>';
  var svgMoon = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>';
  var svgChevronUp = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>';
  var svgChevronDown = '<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>';

  document.querySelectorAll('pre.line-numbers').forEach(function(pre) {
    if (pre.closest('.sea-code-block')) return;
    var lang = pre.getAttribute('data-language') || '';
    var wrapper = document.createElement('div');
    wrapper.className = 'sea-code-block';
    var title = document.createElement('div');
    title.className = 'sea-code-title';
    var langSpan = document.createElement('span');
    langSpan.className = 'sea-code-lang';
    langSpan.textContent = lang;
    var actions = document.createElement('div');
    actions.className = 'sea-code-actions';

    // Copy button
    var copyBtn = document.createElement('button');
    copyBtn.className = 'sea-code-btn';
    copyBtn.title = '复制';
    copyBtn.innerHTML = svgCopy;
    copyBtn.onclick = function() {
      var code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(function() {
        copyBtn.classList.add('copied');
        setTimeout(function() {
          copyBtn.classList.remove('copied');
        }, 1500);
      });
    };

    // Night mode toggle button
    var darkBtn = document.createElement('button');
    darkBtn.className = 'sea-code-btn';
    darkBtn.title = '切换主题';
    var isCodeDark = false;
    var updateDarkIcon = function() {
      darkBtn.innerHTML = isCodeDark ? svgSun : svgMoon;
    };
    updateDarkIcon();
    darkBtn.onclick = function() {
      isCodeDark = !isCodeDark;
      wrapper.classList.toggle('code-theme-dark', isCodeDark);
      updateDarkIcon();
    };

    // Collapse button
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
    pre.parentNode.insertBefore(wrapper, pre);
    body.appendChild(pre);
    wrapper.appendChild(title);
    wrapper.appendChild(body);
  });
})();
</script>`;

hexo.extend.filter.register('after_render:html', function (str, data) {
  // Inject code block CSS and JS into all post pages
  var hasCodeBlocks = str.includes('pre class="line-numbers');
  if (!hasCodeBlocks) return str;
  return str.replace('</head>', codeBlockCSS + '\n</head>').replace('</body>', codeBlockJS + '\n</body>');
}, 8);

// Remove categories and archives directories, and replace root with redirect to /posts/
const fs = require('fs');
const path = require('path');
hexo.on('exit', function () {
  if (!fs.existsSync(hexo.public_dir)) return;
  ['categories', 'archives'].forEach(function (dir) {
    const dirPath = path.join(hexo.public_dir, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  });
  // Create root index.html as redirect to /posts/
  const indexPath = path.join(hexo.public_dir, 'index.html');
  fs.writeFileSync(indexPath, `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=/notes/posts/">
  <script>location.replace('/notes/posts/');</script>
  <title>笔记</title>
</head>
<body></body>
</html>`);
});
