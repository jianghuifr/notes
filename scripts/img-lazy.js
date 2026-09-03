// ============================================
// Warmpaper theme extensions
// ============================================

// --- Images: lazy load + smooth decoding for post/media content ---
// Render-stage rewrite so native loading=lazy applies before any paint
// (runtime JS would be too late — images may already be requested).
// The site header logo and other UI images are excluded via class.
hexo.extend.filter.register('after_render:html', function (str) {
  return str.replace(/<img(?![^>]*loading=)((?:[^>]*?))>/g, function (match, attrs) {
    // 跳过 UI 图标类图片（header logo、profile 头像是首屏关键资源）
    if (/class="[^"]*(?:site-logo|profile-avatar)[^"]*"/.test(attrs)) return match;
    // 跳过 SVG 图标（体积小且常内联在页面里被复用）
    if (/\.svg"/.test(attrs)) return match;
    return '<img loading="lazy" decoding="async"' + attrs + '>';
  });
});
