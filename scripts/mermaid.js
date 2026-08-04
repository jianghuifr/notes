     1|// ============================================
     2|// Warmpaper theme extensions
     3|// ============================================
     4|
     5|// --- ECharts: convert ```echarts fenced blocks to <div class="echarts"> ---
     6|hexo.extend.filter.register('after_render:html', function (str, data) {
     7|  return str.replace(/<figure class="highlight plaintext">\s*<table>\s*<tr>\s*<td class="gutter">[\s\S]*?<\/td>\s*<td class="code"><pre>(.*?)<\/pre><\/td>\s*<\/tr>\s*<\/table>\s*<\/figure>/g, function (match, code) {
     8|    var raw = code
     9|      .replace(/&#123;/g, '{').replace(/&#125;/g, '}')
    10|      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    11|      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    12|      .replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '')
    13|      .replace(/<br>/g, '\n')
    14|      .trim();
    15|    try {
    16|      var obj = JSON.parse(raw);
    17|      if (obj && (obj.series || obj.xAxis || obj.yAxis || obj.radar || obj.geo || obj.visualMap)) {
    18|        return '<div class="sea-code-block" data-diagram="echarts">'
    19|          + '<div class="sea-code-title"><span class="sea-code-lang">echarts</span></div>'
    20|          + '<div class="sea-code-body">' + match
    21|          + '<div class="echarts">' + raw.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</div>'
    22|          + '</div></div>';
    23|      }
    24|    } catch(e) {}
    25|    return match;
    26|  });
    27|}, 5);
    28|
    29|// --- Mermaid: server-side wrap <pre class="mermaid"> ---
    30|hexo.extend.filter.register('after_render:html', function (str, data) {
    31|  if (!data.page || !data.page.__post) return str;
    32|  return str.replace(/<pre class="mermaid">([\s\S]*?)<\/pre>/g, function (match, code) {
    33|    if (match.indexOf('sea-code-block') !== -1) return match;
    34|    var lines = code.split('\n');
    35|    var gutter = lines.map(function(_, i) { return '<span class="line">' + (i + 1) + '</span>'; }).join('<br>');
    36|    var srcLines = lines.map(function(l) { return '<span class="line">' + l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>'; }).join('<br>');
    37|    return '<div class="sea-code-block" data-diagram="mermaid">'
    38|      + '<div class="sea-code-title"><span class="sea-code-lang">mermaid</span></div>'
    39|      + '<div class="sea-code-body">'
    40|      + '<figure class="highlight plaintext"><table><tr><td class="gutter"><pre>' + gutter + '</pre></td><td class="code"><pre>' + srcLines + '</pre></td></tr></table></figure>'
    41|      + '<div class="sea-code-diagrams">'
    42|      + '<pre class="mermaid" mode="dark">' + code + '</pre>'
    43|      + '<pre class="mermaid" mode="light" style="display:none">' + code + '</pre>'
    44|      + '</div>'
    45|      + '</div></div>';
    46|  });
    47|}, 5);
    48|
    49|// --- Mermaid CDN: lazy-loaded by code-block-unified.js ---
    50|
    51|// --- ECharts themes: registered in code-block-unified.js after CDN loads ---
    52|
    53|// --- Code block CSS (Warmpaper palette + Qianwen-style layout) ---
    54|var codeBlockCSS = '\n<style id="code-block-style">\n/* Warmpaper-aligned code block colors.\n   Per-block night mode toggle switches between these two palettes. */\n.sea-code-block {\n  margin: 1.2em 0;\n  border: 1px solid #E8E4DE;\n  border-radius: 1em;\n  overflow: hidden;\n  background: #FFFFFF;\n}\n.sea-code-title {\n  display: flex; justify-content: space-between; align-items: center;\n  padding: 0 12px; height: 36px; font-size: 12px;\n  color: #5C554E; background: #F8F6F2;\n  border-bottom: 1px solid #E8E4DE;\n  user-select: none;\n}\n.sea-code-lang {\n  font-weight: 500; font-size: 12px;\n  text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\n  opacity: 0.85;\n}\n.sea-code-actions { display: flex; gap: 4px; align-items: center; }\n.sea-code-btn {\n  display: inline-flex; align-items: center; justify-content: center;\n  width: 24px; height: 24px; border: none; background: transparent;\n  color: currentColor; cursor: pointer; border-radius: 6px;\n  font-size: 14px; opacity: 0.7; padding: 0; position: relative;\n  transition: opacity 0.15s, background 0.15s;\n}\n.sea-code-btn:hover { background: rgba(128,128,128,0.12); opacity: 1; }\n.sea-code-btn svg { width: 16px; height: 16px; display: block; }\n.sea-code-btn.copied svg { opacity: 0; }\n.sea-code-btn.copied::after { content: "\\2713"; position: absolute; font-size: 14px; }\n.sea-code-body { overflow-x: auto; }\n.sea-code-body table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 0; }\n.sea-code-body td { padding: 0; border: none; }\n.sea-code-body .gutter {\n  width: 3em; vertical-align: top; user-select: none;\n  border-right: 1px solid #E8E4DE;\n}\n.sea-code-body .gutter pre {\n  padding: 14px 10px !important; margin: 0 !important;\n  text-align: right; color: #A09888; font-style: italic;\n  font-size: 12px; line-height: 1.6;\n  background: transparent !important; border: none !important; border-radius: 0 !important;\n}\n.sea-code-body .code { vertical-align: top; }\n.se... [truncated]
    55|
    56|
    57|hexo.extend.filter.register('after_render:html', function (str, data) {
    58|  var hasCode = str.includes('figure class="highlight');
    59|  var hasEcharts = str.includes('class="echarts"');
    60|  var hasMermaid = str.includes('data-diagram="mermaid"');
    61|  if (!hasCode && !hasEcharts && !hasMermaid) return str;
    62|  var out = str;
    63|  out = out.replace('</head>', codeBlockCSS + '\n</head>');
    64|  return out;
    65|}, 8);