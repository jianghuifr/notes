'use strict';

// ============================================
// Mono theme — Hexo extend registration
// ============================================

// Tags / Categories 索引页生成器（与 warmpaper/pages.js 同构）
hexo.extend.generator.register('tags_index', function (locals) {
  return {
    path: 'tags/index.html',
    data: { title: '标签' },
    layout: ['tags']
  };
});

hexo.extend.generator.register('categories_index', function (locals) {
  return {
    path: 'categories/index.html',
    data: { title: '分类' },
    layout: ['categories']
  };
});
