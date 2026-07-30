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

// Remove categories and archives directories, and replace root with redirect to /posts/
const fs = require('fs');
const path = require('path');
hexo.on('exit', function () {
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
