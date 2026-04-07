---
title: WSL + Obsidian + Git 同步方案
date: 2026-04-07 00:00:00
tags:
  - solutions
  - obsidian
---

## 架构

```
任意 WSL 程序（Claude Code 等）
    ↓ 写入 markdown 到 vault 目录
Obsidian Vault (Windows 本地磁盘)
    ↓ obsidian-git 插件自动 commit + push
GitHub 私有仓库
    ↓ 其他设备 pull / obsidian-git 自动 pull
多端同步
```

全链路免费，不依赖 Obsidian Sync 付费服务。

## 搭建步骤

### 1. 创建 Vault

1. 安装 [Obsidian](https://obsidian.md)（Windows 版）和 [Git for Windows](https://git-scm.com)
2. 打开 Obsidian → Create new vault → 选择 Windows 本地路径

> Vault 必须放 Windows 侧。Obsidian 通过 `\\wsl$` 访问 WSL 文件系统性能差且索引不稳定。

### 2. 初始化 Git 仓库

在 WSL 中操作（复用已有的 SSH key 和 git config）：

```bash
cd /mnt/c/Users/<user>/Documents/Obsidian/<vault-name>

git init
git remote add origin git@github.com:<user>/<repo>.git
git add -A && git commit -m "init obsidian vault"
git branch -M main
git push -u origin main
```

### 3. 安装 obsidian-git 插件

1. Obsidian → 设置 → 第三方插件 → 关闭安全模式 → 浏览
2. 搜索 **Obsidian Git**（作者 Vinzent03）→ 安装 → 启用

### 4. 配置插件

| 配置项 | 建议值 | 说明 |
|---|---|---|
| Auto backup every X minutes | `10` | 自动 commit + push |
| Auto pull every X minutes | `10` | 自动拉取远端变更 |

其他保持默认。

### 5. Windows 侧 SSH 验证

obsidian-git 调用的是 Windows 版 git，需确保 Windows 侧能 SSH 到 GitHub：

```powershell
ssh -T git@github.com
# 应返回: Hi <user>! You've been authenticated...
```

不通的话检查 `C:\Users\<user>\.ssh\config` 中 GitHub 的 IdentityFile 配置。

## WSL 写入示例

WSL 中任何程序都可以直接写入 vault 目录：

```bash
VAULT="/mnt/c/Users/<user>/Documents/Obsidian/<vault-name>"

# 写入一篇笔记
cat > "$VAULT/notes/example.md" << 'EOF'
---
title: Example
tags: [demo]
---
Hello from WSL.
EOF
```

写入后 obsidian-git 会在下一个周期自动同步到 GitHub。

## 要点

- **Vault 放 Windows 侧**：Obsidian 是 Windows 应用，读本地磁盘最快
- **Git 操作在 WSL**：复用 WSL 已有的 SSH key，避免重复配置
- **obsidian-git vs Obsidian Sync**：前者免费，用自己的 Git 仓库；后者官方付费服务（$4/月），两者独立
