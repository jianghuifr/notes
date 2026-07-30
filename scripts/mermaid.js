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
    18|        return '<div class="echarts">' + raw.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</div>';
    19|      }
    20|    } catch(e) {}
    21|    return match;
    22|  });
    23|}, 5);
    24|
    25|// --- Mermaid ---
    26|hexo.extend.filter.register('after_render:html', function (str, data) {
    27|  if (!data.page || !data.page.__post) return str;
    28|  if (!str.includes('class="mermaid"') && !str.includes('pre class="mermaid"')) return str;
    29|  var mermaidScript = '\n<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>\n<script>\n  mermaid.initialize({\n    startOnLoad: true,\n    theme: (document.documentElement.getAttribute("data-theme") === "dark") ? "dark" : "default",\n    securityLevel: "loose"\n  });\n</script>';
    30|  return str.replace('</body>', mermaidScript + '\n</body>');
    31|}, 9);
    32|
    33|// --- ECharts renderer ---
    34|hexo.extend.filter.register('after_render:html', function (str, data) {
    35|  if (!str.includes('class="echarts"')) return str;
    36|  var echartsScript = '\n<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>\n<script>\necharts.registerTheme("warmpaper", {"color":["#C4875D","#889B6E","#D4A76A","#7B9CB5","#C4827A","#B8A45C","#8B7E6E","#6E9B8B"],"backgroundColor":"transparent","title":{"textStyle":{"color":"#4A4540"},"subtextStyle":{"color":"#8A8278"}},"line":{"itemStyle":{"borderWidth":2},"lineStyle":{"width":2},"symbolSize":6,"symbol":"circle","smooth":false},"bar":{"itemStyle":{"barBorderWidth":0,"barBorderColor":"#D5CEC2"}},"pie":{"itemStyle":{"borderWidth":0,"borderColor":"#D5CEC2"}},"categoryAxis":{"axisLine":{"show":true,"lineStyle":{"color":"#D5CEC2"}},"axisTick":{"show":false},"axisLabel":{"color":"#6B645C"},"splitLine":{"show":false}},"valueAxis":{"axisLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"color":"#8A8278"},"splitLine":{"show":true,"lineStyle":{"color":"#EDE8E0","type":"dashed","width":1}}},"tooltip":{"backgroundColor":"#FFFBF5","borderColor":"#D5CEC2","borderWidth":1,"textStyle":{"color":"#4A4540"},"axisPointer":{"lineStyle":{"color":"#D5CEC2"},"crossStyle":{"color":"#D5CEC2"}}},"legend":{"textStyle":{"color":"#5C554E"},"pageTextStyle":{"color":"#8A8278"}},"toolbox":{"iconStyle":{"borderColor":"#5C554E"}},"dataZoom":{"backgroundColor":"rgba(240,235,227,0)","dataBackground":{"lineStyle":{"color":"#D4A76A"},"areaStyle":{"color":"rgba(212,167,106,0.15)"}},"selectedDataBackground":{"lineStyle":{"color":"#C4875D"},"areaStyle":{"color":"rgba(196,135,93,0.15)"}},"handleStyle":{"color":"#C4875D","borderColor":"#C4875D"},"textStyle":{"color":"#5C554E"},"fillerColor":"rgba(196,135,93,0.1)","borderColor":"#D5CEC2"},"markPoint":{"label":{"color":"#FFFBF5"}}});\necharts.registerTheme("warmpaper-dark", {"color":["#E0A87C","#A3B88A","#E8C48A","#99B5CC","#D99E96","#CFBE78","#A89888","#8AB5A7"],"backgroundColor":"transparent","title":{"textStyle":{"color":"#C8C0B8"},"subtextStyle":{"color":"#706860"}},"line":{"itemStyle":{"borderWidth":2},"lineStyle":{"width":2},"symbolSize":6,"symbol":"circle","smooth":false},"bar":{"itemStyle":{"barBorderWidth":0,"barBorderColor":"#2F2924"}},"pie":{"itemStyle":{"borderWidth":0,"borderColor":"#2F2924"}},"categoryAxis":{"axisLine":{"show":true,"lineStyle":{"color":"#2F2924"}},"axisTick":{"show":false},"axisLabel":{"color":"#8A8278"},"splitLine":{"show":false}},"valueAxis":{"axisLine":{"show":false},"axisTick":{"show":false},"axisLabel":{"color":"#706860"},"splitLine":{"show":true,"lineStyle":{"color":"#2A241C","type":"dashed","width":1}}},"tooltip":{"backgroundColor":"#1C1814","borderColor":"#2F2924","borderWidth":1,"textStyle":{"color":"#D4C9BC"},"axisPointer":{"lineStyle":{"color":"#2F2924"},"crossStyle":{"color":"#2F2924"}}},"legend":{"textStyle":{"color":"#A8A099"},"pageTextStyle":{"color":"#706860"}},"toolbox":{"iconStyle":{"borderColor":"#A8A099"}},"dataZoom":{"backgroundColor":"rgba(21,17,14,0)","dataBackground":{"lineStyle":{"color":"#E8C48A"},"areaStyle":{"color":"rgba(232,196,138,0.1)"}},"selectedDataBackground":{"lineStyle":{"color":"#E0A87C"},"areaStyle":{"color":"rgba(224,168,124,0.1)"}},"handleStyle":{"color":"#E0A87C","borderColor":"#E0A87C"},"textStyle":{"color":"#A8A099"},"fillerColor":"rgba(224,168,124,0.08)","borderColor":"#2F2924"},"markPoint":{"label":{"color":"#1C1814"}}});\n(function() {\n  function getTheme() { return document.documentElement.getAttribute("data-theme") === "dark" ? "warmpaper-dark" : "warmpaper"; }\n  document.querySelectorAll(".echarts").forEach(function(el) {\n    try {\n      var raw = el.textContent.trim();\n      var config = JSON.parse(raw);\n      var chart = echarts.init(el, getTheme());\n      chart.setOption(config);\n      var ro = new ResizeObserver(function() { chart.resize(); });\n      ro.observe(el);\n      var observer = new MutationObserver(function(muts) {\n        muts.forEach(function(m) {\n          if (m.attributeName === "data-theme") {\n            chart.dispose();\n            chart = echarts.init(el, getTheme());\n            chart.setOption(config);\n          }\n        });\n      });\n      observer.observe(document.documentElement, { attributes: true });\n    } catch(e) {}\n  });\n})();\n</script>';
    37|  return str.replace('</body>', echartsScript + '\n</body>');
    38|}, 9);
    39|
    40|// --- Code block CSS (Warmpaper palette + Qianwen-style layout) ---
    41|var codeBlockCSS = '\n<style id="code-block-style">\n/* Warmpaper-aligned code block colors.\n   Per-block night mode toggle switches between these two palettes. */\n.sea-code-block {\n  margin: 1.2em 0;\n  border: 1px solid #D5CEC2;\n  border-radius: 1em;\n  overflow: hidden;\n  background: #F0EBE3;\n}\n.sea-code-title {\n  display: flex; justify-content: space-between; align-items: center;\n  padding: 0 12px; height: 36px; font-size: 12px;\n  color: #5C554E; background: #E8E2D8;\n  border-bottom: 1px solid #D5CEC2;\n  user-select: none;\n}\n.sea-code-lang {\n  font-weight: 500; font-size: 12px;\n  text-overflow: ellipsis; white-space: nowrap; overflow: hidden;\n  opacity: 0.85;\n}\n.sea-code-actions { display: flex; gap: 4px; align-items: center; }\n.sea-code-btn {\n  display: inline-flex; align-items: center; justify-content: center;\n  width: 24px; height: 24px; border: none; background: transparent;\n  color: currentColor; cursor: pointer; border-radius: 6px;\n  font-size: 14px; opacity: 0.7; padding: 0; position: relative;\n  transition: opacity 0.15s, background 0.15s;\n}\n.sea-code-btn:hover { background: rgba(128,128,128,0.12); opacity: 1; }\n.sea-code-btn svg { width: 16px; height: 16px; display: block; }\n.sea-code-btn.copied svg { opacity: 0; }\n.sea-code-btn.copied::after { content: "\\2713"; position: absolute; font-size: 14px; }\n.sea-code-body { overflow-x: auto; }\n.sea-code-body table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 0; }\n.sea-code-body td { padding: 0; border: none; }\n.sea-code-body .gutter {\n  width: 3em; vertical-align: top; user-select: none;\n  border-right: 1px solid #D5CEC2;\n}\n.sea-code-body .gutter pre {\n  padding: 14px 10px !important; margin: 0 !important;\n  text-align: right; color: #A09888; font-style: italic;\n  font-size: 13px; line-height: 1.6;\n  background: transparent !important; border: none !important; border-radius: 0 !important;\n}\n.sea-code-body .code { vertical-align: top; }\n.se... [truncated]
    42|
    43|// --- Code block JS (Qianwen-style interaction) ---
    44|var codeBlockJS = '\n<script>\n(function() {\n  var svgCopy = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M832 64a96 96 0 0 1 96 96V640a96 96 0 0 1-96 96h-128v128A96 96 0 0 1 608 960H192a96 96 0 0 1-96-96V384A96 96 0 0 1 192 288h128v-128A96 96 0 0 1 416 64H832zM192 352a32 32 0 0 0-32 32v480a32 32 0 0 0 32 32h416a32 32 0 0 0 32-32V384a32 32 0 0 0-32-32H192zM416 128a32 32 0 0 0-32 32v128h224A96 96 0 0 1 704 384v288h128a32 32 0 0 0 32-32V160A32 32 0 0 0 832 128H416z"/></svg>\';\n  var svgSun = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 320c-106.048 0-192 85.952-192 192s85.952 192 192 192 192-85.952 192-192-85.952-192-192-192zM512 256c141.376 0 256 114.624 256 256s-114.624 256-256 256-256-114.624-256-256 114.624-256 256-256zM480 128V32h64v96h-64zM480 992v-96h64v96h-64zM928 480h96v64h-96v-64zM0 480h96v64H0v-64zM762.368 198.656l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM145.696 847.936l67.84-67.84 45.248 45.248-67.84 67.84-45.248-45.248zM758.304 829.76l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84zM149.76 171.616l45.248-45.248 67.84 67.84-45.248 45.248-67.84-67.84z"/></svg>\';\n  var svgMoon = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M517.568 128c-212.096 0-384 171.904-384 384s171.904 384 384 384c70.976 0 137.472-19.2 194.048-52.736C615.84 893.76 512 779.456 512 640c0-159.744 130.944-291.328 286.528-314.24C734.976 194.496 634.688 128 517.568 128z"/></svg>\';\n  var svgChevronUp = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 345.376L233.376 624l-45.248-45.248L512 254.88l323.872 323.872L790.624 624 512 345.376z"/></svg>\';\n  var svgChevronDown = \'<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 678.624L233.376 400l-45.248 45.248L512 769.12l323.872-323.872L790.624 400 512 678.624z"/></svg>\';\n\n  document.querySelectorAll("figure.highlight").forEach(function(fig) {\n    if (fig.closest(".sea-code-block")) return;\n    var lang = "";\n    fig.classList.forEach(functio... [truncated]
    45|
    46|hexo.extend.filter.register('after_render:html', function (str, data) {
    47|  var hasCode = str.includes('figure class="highlight');
    48|  var hasEcharts = str.includes('class="echarts"');
    49|  if (!hasCode && !hasEcharts) return str;
    50|  var out = str;
    51|  if (hasCode || hasEcharts) {
    52|    out = out.replace('</head>', codeBlockCSS + '\n</head>');
    53|  }
    54|  if (hasCode) {
    55|    out = out.replace('</body>', codeBlockJS + '\n</body>');
    56|  }
    57|  return out;
    58|}, 8);
    59|