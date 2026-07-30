// Inject mermaid.js into footer for Sea theme
hexo.extend.filter.register('after_render:html', function (str, data) {
  // Only inject into post/page pages (skip index, archives, etc.)
  if (!data.page || !data.page.__post) return str;
  
  // Check if page has mermaid diagrams
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
