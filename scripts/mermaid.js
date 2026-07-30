// Inject mermaid.js into footer for Sea theme
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (!data.page || !data.page.__post) return str;
  if (!str.includes('class="mermaid"') && !str.includes('pre class="mermaid"')) return str;
  const mermaidScript = `
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
    securityLevel: 'loose'
  });
</script>`;
  return str.replace('</body>', mermaidScript + '\n</body>');
}, 9);

// Inject code block styling and behavior into all pages
const codeBlockCSS = `
<style id="code-block-style">
.sea-code-block {
  margin: 1.2em 0;
  border: 1px solid var(--code-border, #e1e4e8);
  border-radius: 6px;
  overflow: hidden;
  background: var(--code-bg, #f6f8fa);
}
.dark .sea-code-block {
  --code-border: #30363d;
  --code-bg: #0d1117;
}
.sea-code-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-size: 12px;
  color: var(--text-color);
  background: var(--code-title-bg, #eef0f3);
  border-bottom: 1px solid var(--code-border, #e1e4e8);
  user-select: none;
}
.dark .sea-code-title {
  --code-title-bg: #161b22;
}
.sea-code-lang {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 11px;
}
.sea-code-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.sea-code-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.15s;
  opacity: 0.7;
}
.sea-code-btn:hover {
  background: rgba(128,128,128,0.15);
  opacity: 1;
}
.sea-code-btn.copied {
  color: #33ac60;
}
.sea-code-body {
  overflow-x: auto;
}
.sea-code-body pre {
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 12px 16px !important;
}
.sea-code-body pre.line-numbers {
  padding-left: 3.8em !important;
}
.sea-code-body .line-numbers-rows {
  border-right: 1px solid var(--code-border, #e1e4e8) !important;
  left: -3.8em !important;
  width: 3em !important;
  pointer-events: none;
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
</style>`;

const codeBlockJS = `
<script>
(function() {
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
    copyBtn.innerHTML = '\\u2398';
    copyBtn.onclick = function() {
      var code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(function() {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '\\u2713';
        setTimeout(function() {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '\\u2398';
        }, 1500);
      });
    };
    // Dark mode toggle
    var darkBtn = document.createElement('button');
    darkBtn.className = 'sea-code-btn';
    darkBtn.title = '切换主题';
    darkBtn.innerHTML = '\\u263E';
    darkBtn.onclick = function() {
      pre.classList.toggle('dark-code');
      if (pre.classList.contains('dark-code')) {
        pre.style.background = '#0d1117';
        pre.style.color = '#c9d1d9';
      } else {
        pre.style.background = '';
        pre.style.color = '';
      }
    };
    // Collapse button
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'sea-code-btn';
    collapseBtn.title = '折叠';
    collapseBtn.innerHTML = '\\u25B2';
    collapseBtn.onclick = function() {
      wrapper.classList.toggle('collapsed');
      collapseBtn.innerHTML = wrapper.classList.contains('collapsed') ? '\\u25BC' : '\\u25B2';
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
