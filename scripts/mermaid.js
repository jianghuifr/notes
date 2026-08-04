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
var codeBlockCSS = '\n<style id="code-block-style">\n/* Warmpaper-aligned code block colors.\n   Per-block night mode toggle switches between these two palettes. */\n.sea-code-block {\n  margin: 1.2em 0;\n  border: 1px solid #E8E4DE;\n  border-radius: 1em;\n  overflow: hidden;\n  background: #FFFFFF;\n}\n.sea-code-title {\n  display: flex; justify-content: space-between; align-items: center;\n  padding: 0 12px; height: 36px; font-size: 6px;\n  color: #5C554E; background: #F8F6F2;\n  border-bottom: 1px solid #E8E4DE;\n  user-select: none;\n}\n.sea-code-lang {\n  font-weight: 500; font-size: 6px;\n  text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\n  opacity: 0.85;\n}\n.sea-code-actions { display: flex; gap: 4px; align-items: center; }\n.sea-code-btn {\n  display: inline-flex; align-items: center; justify-content: center;\n  width: 24px; height: 24px; border: none; background: transparent;\n  color: currentColor; cursor: pointer; border-radius: 6px;\n  font-size: 14px; opacity: 0.7; padding: 0; position: relative;\n  transition: opacity 0.15s, background 0.15s;\n}\n.sea-code-btn:hover { background: rgba(128,128,128,0.12); opacity: 1; }\n.sea-code-btn svg { width: 16px; height: 16px; display: block; }\n.sea-code-btn.copied svg { opacity: 0; }\n.sea-code-btn.copied::after { content: "\\2713"; position: absolute; font-size: 14px; }\n.sea-code-body { overflow-x: auto; }\n.sea-code-body table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 0; }\n.sea-code-body td { padding: 0; border: none; }\n.sea-code-body .gutter {\n  width: 3em; vertical-align: top; user-select: none;\n  border-right: 1px solid #E8E4DE;\n}\n.sea-code-body .gutter pre {\n  padding: 14px 10px !important; margin: 0 !important;\n  text-align: right; color: #A09888; font-style: italic;\n  font-size: 6px; line-height: 1.6;\n  background: transparent !important; border: none !important; border-radius: 0 !important;\n}\n.sea-code-body .code { vertical-align: top; }\n.sea-code-body .code pre {\n  padding: 14px 16px !important; margin: 0 !important;\n  background: transparent !important; border: none !important; border-radius: 0 !important;\n  color: #2D2B28 !important; line-height: 1.6; font-size: 6px;\n}\n.sea-code-body code {\n  font-family: "SF Mono","Cascadia Code","Fira Code","JetBrains Mono",Menlo,Consolas,monospace !important;\n  font-size: 6px !important; line-height: 1.6 !important; tab-size: 4;\n}\n.sea-code-block.collapsed .sea-code-body { display: none; }\n\n/* Mermaid SVG + pre: transparent bg flows with code block theme */\n.sea-code-block[data-diagram="mermaid"] pre.mermaid,\n.sea-code-block[data-diagram="mermaid"] svg { background: transparent !important; }\n\n/* Dark mode palette */\n.sea-code-block.code-theme-dark {\n  border-color: #4A443E;\n  background: #3D3732;\n}\n.sea-code-block.code-theme-dark .sea-code-title {\n  color: #A8A099;\n  background: #4A443E;\n  border-bottom-color: #4A443E;\n}\n.sea-code-block.code-theme-dark .sea-code-body .gutter {\n  border-right-color: #4A443E;\n}\n.sea-code-block.code-theme-dark .sea-code-body .gutter pre {\n  color: #5C554E !important;\n}\n.sea-code-block.code-theme-dark .sea-code-body .code pre {\n  background: transparent !important;\n  color: #D4C9BC !important;\n}\n\n/* Source/Diagram toggle */\n.sea-code-block[data-diagram] .sea-code-body > figure.highlight { display: none; }\n.sea-code-block[data-diagram].show-raw .sea-code-body > figure.highlight { display: block; }\n.sea-code-block[data-diagram].show-raw .sea-code-body > .mermaid,\n.sea-code-block[data-diagram].show-raw .sea-code-body > .echarts { display: none; }\n\n/* Neutralize Warmpaper figure.highlight */\nfigure.highlight {\n  background: transparent !important;\n  border: none !important;\n  border-radius: 0 !important;\n  margin: 0 !important;\n}\nfigure.highlight .line { font-size: inherit; }\n</style>\n<style id="echarts-style">\n.echarts { width: 100%; min-height: 400px; margin: 1.5em 0; }\n</style>';


hexo.extend.filter.register('after_render:html', function (str, data) {
  var hasCode = str.includes('figure class="highlight');
  var hasEcharts = str.includes('class="echarts"');
  var hasMermaid = str.includes('data-diagram="mermaid"');
  if (!hasCode && !hasEcharts && !hasMermaid) return str;
  var out = str;
  out = out.replace('</head>', codeBlockCSS + '\n</head>');
  return out;
}, 8);