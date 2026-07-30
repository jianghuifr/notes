// Diagram source/chart toggle for ECharts and Mermaid blocks
(function() {
  setTimeout(function() {
    var svgCode = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
    var svgChart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>';
    document.querySelectorAll('.diagram-toggle').forEach(function(btn) {
      var block = btn.closest('.sea-code-block');
      btn.onclick = function() {
        block.classList.toggle('show-raw');
        btn.innerHTML = block.classList.contains('show-raw') ? svgChart : svgCode;
        if (!block.classList.contains('show-raw')) {
          var ec = block.querySelector('.echarts');
          if (ec && ec._echarts_instance) ec._echarts_instance.resize();
        }
      };
    });
  }, 100);
})();
