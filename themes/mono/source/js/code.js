// Mono code rendering:
// 1. MicroLighter (<micro-lighter> element: copy button + line numbers on by default)
// 2. mermaid & echarts — lazy-loaded CDN, only when present on the page
(function () {
  'use strict';

  var ML_CDN = 'https://cdn.jsdelivr.net/npm/microlighter@2.1.0/dist/micro-lighter-element.min.js';
  var MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.min.js';
  var ECHARTS_CDN = 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js';
  var hasMermaid = document.querySelector('pre.mermaid');
  var hasEcharts = document.querySelector('.echarts');
  var hasCode = document.querySelector('pre > code');

  // ---------- MicroLighter ----------
  // <micro-lighter> wraps every pre>code. Its shadow DOM renders line numbers
  // ([line-numbers]) and Copy button (controls="copy") — both on by default.
  // Grammar modules load on demand from the same CDN path.
  // NOTE: it's an ES module — must load via <script type="module">.
  if (hasCode && window.CSS && CSS.highlights) {
    var s = document.createElement('script');
    s.type = 'module';
    s.src = ML_CDN;
    s.onload = function () {
      // module 内已自动 customElements.define('micro-lighter')，
      // 但以防先于 DOM 存在时未升级，这里直接包装
      document.querySelectorAll('pre > code').forEach(function (code) {
        var pre = code.parentElement;
        if (!pre || pre.closest('micro-lighter')) return;
        var ml = document.createElement('micro-lighter');
        ml.setAttribute('line-numbers', '');
        ml.setAttribute('controls', 'copy');
        pre.parentNode.insertBefore(ml, pre);
        ml.appendChild(pre);
      });
      // 触发一次高亮（组件 connectedCallback 里已调用 highlightAll）
    };
    s.onerror = function () {};
    document.head.appendChild(s);
  }

  // ---------- mermaid ----------
  if (hasMermaid) {
    loadScript(MERMAID_CDN, function () {
      if (typeof mermaid === 'undefined') return;
      var theme = currentCodeTheme();
      mermaid.initialize({ startOnLoad: false, theme: theme, securityLevel: 'loose', fontFamily: '"LXGW WenKai GB", sans-serif' });
      mermaid.run({ querySelector: 'pre.mermaid' }).catch(function (e) { console.warn('mermaid render failed:', e); });
    });
  }

  // ---------- echarts ----------
  if (hasEcharts) {
    loadScript(ECHARTS_CDN, function () {
      if (typeof echarts === 'undefined') return;
      echarts.registerTheme('mono', {
        'color': ['#333333', '#666666', '#999999', '#CCCCCC', '#0284C7', '#059669', '#8B5CF6', '#D97706'],
        'backgroundColor': 'transparent',
        'textStyle': { 'fontFamily': 'inherit' },
        'title': { 'textStyle': { 'color': '#111111' }, 'subtextStyle': { 'color': '#666666' } },
        'line': { 'itemStyle': { 'borderWidth': 2 }, 'lineStyle': { 'width': 2 }, 'symbolSize': 6, 'symbol': 'circle' },
        'bar': { 'itemStyle': { 'barBorderWidth': 0 } },
        'categoryAxis': { 'axisLine': { 'show': true, 'lineStyle': { 'color': '#CCCCCC' } }, 'axisTick': { 'show': false }, 'axisLabel': { 'color': '#555555' }, 'splitLine': { 'show': false } },
        'valueAxis': { 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'axisLabel': { 'color': '#666666' }, 'splitLine': { 'show': true, 'lineStyle': { 'color': '#E5E5E5', 'type': 'dashed', 'width': 1 } } },
        'tooltip': { 'backgroundColor': '#FFFFFF', 'borderColor': '#CCCCCC', 'borderWidth': 1, 'textStyle': { 'color': '#111111' } },
        'legend': { 'textStyle': { 'color': '#555555' } },
        'dataZoom': { 'backgroundColor': 'rgba(255,255,255,0)', 'borderColor': '#CCCCCC', 'textStyle': { 'color': '#555555' } }
      });
      echarts.registerTheme('mono-dark', {
        'color': ['#CCCCCC', '#999999', '#666666', '#444444', '#67C7F0', '#6EE7B7', '#A78BFA', '#F0B868'],
        'backgroundColor': 'transparent',
        'textStyle': { 'fontFamily': 'inherit' },
        'title': { 'textStyle': { 'color': '#EDEDED' }, 'subtextStyle': { 'color': '#999999' } },
        'line': { 'itemStyle': { 'borderWidth': 2 }, 'lineStyle': { 'width': 2 }, 'symbolSize': 6, 'symbol': 'circle' },
        'bar': { 'itemStyle': { 'barBorderWidth': 0 } },
        'categoryAxis': { 'axisLine': { 'show': true, 'lineStyle': { 'color': '#444444' } }, 'axisTick': { 'show': false }, 'axisLabel': { 'color': '#A0A0A0' }, 'splitLine': { 'show': false } },
        'valueAxis': { 'axisLine': { 'show': false }, 'axisTick': { 'show': false }, 'axisLabel': { 'color': '#999999' }, 'splitLine': { 'show': true, 'lineStyle': { 'color': '#333333', 'type': 'dashed', 'width': 1 } } },
        'tooltip': { 'backgroundColor': '#1B1B1B', 'borderColor': '#444444', 'borderWidth': 1, 'textStyle': { 'color': '#EDEDED' } },
        'legend': { 'textStyle': { 'color': '#A0A0A0' } },
        'dataZoom': { 'backgroundColor': 'rgba(17,17,17,0)', 'borderColor': '#444444', 'textStyle': { 'color': '#A0A0A0' } }
      });
      function render() {
        document.querySelectorAll('.echarts').forEach(function (el) {
          try {
            var cfg = JSON.parse(el.textContent.trim());
            var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'mono-dark' : 'mono';
            var chart = echarts.init(el, theme);
            chart.setOption(cfg);
            el._chart = chart;
            new ResizeObserver(function () { chart.resize(); }).observe(el);
          } catch (e) {}
        });
      }
      render();
      // 主题切换时重绘（simple 方案：销毁重建，mermaid 同理走 MutationObserver）
      new MutationObserver(function () {
        document.querySelectorAll('.echarts').forEach(function (el) {
          if (el._chart) { el._chart.dispose(); el._chart = null; }
        });
        render();
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    });
  }

  // ---------- helpers ----------
  function loadScript(url, cb) {
    var s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  function currentCodeTheme() {
    var t = document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    return t === 'dark' ? 'dark' : 'default';
  }
})();
