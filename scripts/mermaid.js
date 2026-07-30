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

// Remove categories and archives directories after all files are written
const fs = require('fs');
const path = require('path');
hexo.on('exit', function () {
  ['categories', 'archives'].forEach(function (dir) {
    const dirPath = path.join(hexo.public_dir, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  });
});
