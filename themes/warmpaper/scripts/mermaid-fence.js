'use strict';

// Convert Markdown fenced ```mermaid blocks into the DOM shape that
// hexo-theme-next's mermaid runtime expects (`<pre><code class="mermaid">`).
// NexT's runtime selector is `pre > .mermaid`, so the class must be on the
// child element, not on <pre> itself.

const FENCE_RE = /(^|\n)([ \t]*)```mermaid[ \t]*\n([\s\S]*?)\n\2```(?=\n|$)/g;

const IGNORE_EXTS = new Set(['.js', '.css', '.html', '.htm']);

function shouldIgnore(data) {
  const source = data.source || '';
  const dot = source.lastIndexOf('.');
  if (dot === -1) return false;
  return IGNORE_EXTS.has(source.slice(dot).toLowerCase());
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!hexo.theme.config.mermaid || !hexo.theme.config.mermaid.enable) return;
  if (shouldIgnore(data)) return;
  data.content = data.content.replace(FENCE_RE, (_, lead, indent, body) => {
    return `${lead}${indent}<pre><code class="mermaid">${body}\n</code></pre>`;
  });
}, 9);
