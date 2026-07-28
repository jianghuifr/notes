# CLAUDE.md — 项目协作说明

本仓库是一个 Hexo 博客（NexT 主题），部署到 https://jianghuifr.github.io/notes 。GitHub Actions (`.github/workflows/pages.yml`) 在 push 到 `main` 时自动构建发布——**push main 就等于上线**，任何 commit/push 操作都要先与用户确认。

## 目录约定

- `source/_posts/` — 已发布博客
- `source/_drafts/` — 原始对话缓存，已 gitignore，Hexo 不渲染
- `tools/` — 辅助脚本与规范文档（不要用 `scripts/`，Hexo 会把这个目录当扩展加载）

## DeepSeek 分享链接 → 博客工作流

详细规范见 **[`tools/deepseek-blog-workflow.md`](./tools/deepseek-blog-workflow.md)**——面向任意 AI agent（Claude Code、hermes、pi 等）的操作手册。触发条件、拉取脚本、写作风格、mermaid 强制、AI 味约束、commit 约定都在里面。

以下是 Claude Code 专属补充：

- 触发工作流时用 `TaskCreate` 建 3~4 个 task 跟踪（拉 draft / 写博客 / 本地验证 / 提交确认）
- 用 `Read` 工具打开 draft（可能有 100KB+，用 offset/limit 分块看）
- 用 `Write` 新建博客文件；如果需要小改用 `Edit`
- `pnpm run server` 已在跑就热更新即可；没跑就 `pnpm run build` 验证渲染无报错

## 其他约定

- 依赖用 `pnpm`（`pnpm-lock.yaml` 是权威）
- 不要在 `source/_posts/*.md` 里用 ASCII 字符画架构图，必须用 mermaid 围栏代码块（已装 `hexo-filter-mermaid-diagrams`，NexT `_config.next.yml` 已开 `mermaid.enable: true`）
