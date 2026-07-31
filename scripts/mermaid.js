// ============================================
// Warmpaper theme extensions
// ============================================

// --- ECharts: convert ```echarts fenced blocks to <div class="echarts"> ---
hexo.extend.filter.register('after_render:html', function (str, data) {
  var hasEcharts = str.includes('class="echarts"');
  var hasMermaid = str.includes('data-diagram="mermaid"');
  if (!hasEcharts && !hasMermaid) return str;
  var out = str;
  out = out.replace('</head>', codeBlockCSS + '\n</head>');
  return out;
}, 8);
