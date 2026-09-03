// ============================================
// Mono theme — render-stage transforms
// ============================================

// Hexo 的 syntax_highlighter 是全局配置，产物是
//   <figure class="highlight lang"><table><tr><td class="gutter">…<td class="code"><pre>…token spans…</pre>
// mono 主题改用 MicroLighter（CSS ::highlight()，需要纯文本 pre>code），
// 且不希望行号 gutter 混进 DOM。此 filter 在页面渲染后立刻还原为：
//   <pre><code class="language-lang">纯文本源码</code></pre>
// warmpaper 主题不使用本 filter（用 hexo.config.theme 判断，稳定不依赖
// theme.config——后者在热重载时可能被 config processor 整体覆盖）。
function isMono() {
  return hexo.config.theme === 'mono';
}

hexo.extend.filter.register('after_render:html', function (str) {
  if (!isMono()) return str;

  return str.replace(
    /<figure class="highlight ([a-zA-Z0-9_+-]*)"><table><tr><td class="gutter">[\s\S]*?<\/td><td class="code"><pre>([\s\S]*?)<\/pre><\/td><\/tr><\/table><\/figure>/g,
    function (match, lang, code) {
      // 还原源码：去 token span、<br> 转 \n、HTML 实体反转义
      var text = code
        .replace(/<br>/g, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&#123;/g, '{').replace(/&#125;/g, '}')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\n$/, '');
      var cls = lang ? ' class="language-' + lang + '"' : '';
      return '<pre><code' + cls + '>' + text + '</code></pre>';
    }
  );
}, 1);

// --- Mermaid: hexo-filter-mermaid-diagrams 已把 ```mermaid 转成 <pre class="mermaid">，
// mono 直接保留（交由浏览器端 mermaid CDN 渲染），不需要 warmpaper 的双模式预渲染包装。 ---

// --- ECharts: 识别 ```echarts 代码块（还原后是 <pre><code class="language-echarts">），
// 转成用于 ECharts 初始化的 JSON 容器。 ---
hexo.extend.filter.register('after_render:html', function (str) {
  if (!isMono()) return str;

  return str.replace(
    /<pre><code class="language-echarts">([\s\S]*?)<\/code><\/pre>/g,
    function (match, raw) {
      try {
        var obj = JSON.parse(raw);
        if (obj && (obj.series || obj.xAxis || obj.yAxis || obj.radar || obj.geo || obj.visualMap)) {
          return '<div class="echarts">' + raw.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</div>';
        }
      } catch (e) {}
      return match;
    }
  );
}, 2);
