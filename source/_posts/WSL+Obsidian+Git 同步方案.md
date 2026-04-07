---
title: WSL + Obsidian + Git 同步 Claude Code 会话
tags:
  - AI
  - solutions
---
# WSL + Obsidian + Git 同步 Claude Code 会话

## 整体架构

```
Claude Code (WSL)
    ↓ 总结会话，写入 markdown
Obsidian Vault (Windows 本地)
    ↓ obsidian-git 插件自动 commit + push
GitHub 私有仓库
```

全链路免费，不依赖 Obsidian Sync 付费服务。

## 环境信息

| 项目 | 值 |
|---|---|
| WSL vault 路径 | `/mnt/c/Users/zelos/Documents/Obsidian/obsidian-github/obsidian` |
| Windows vault 路径 | `C:\Users\zelos\Documents\Obsidian\obsidian-github\obsidian` |
| GitHub 仓库 | `git@github.com:jianghuifr/obsidian.git` |
| SSH Key | `C:\Users\zelos\.ssh\id_ed25519` |

## 搭建步骤

### 1. 安装前置依赖

- **Obsidian**：从 [obsidian.md](https://obsidian.md) 下载 Windows 版并安装
- **Git for Windows**：从 [git-scm.com](https://git-scm.com) 下载安装（obsidian-git 插件需要调用系统 git）

### 2. 创建 Obsidian Vault

打开 Obsidian → 选择 **新建仓库**（Create new vault）→ 填写名称和路径 → 创建

### 3. 初始化 Git 仓库（在 WSL 中操作）

```bash
cd /mnt/c/Users/zelos/Documents/Obsidian/obsidian-github/obsidian

git init
git remote add origin git@github.com:jianghuifr/obsidian.git
git add -A
git commit -m "init obsidian vault"
git branch -M main
git push -u origin main
```

> WSL 侧的 SSH key 和 git config 已配置好，直接用 WSL 执行 git 操作最方便。

### 4. 安装 obsidian-git 插件

1. Obsidian → 左下角 **⚙️ 齿轮** → **第三方插件**（Community plugins）
2. 关闭 **安全模式**（Restricted mode）→ 点击 **浏览**（Browse）
3. 搜索 **Obsidian Git**（作者 Vinzent03）→ **安装** → **启用**
4. 或直接在浏览器打开：`obsidian://show-plugin?id=obsidian-git`

### 5. 配置 obsidian-git

进入插件设置（设置 → 第三方插件 → Obsidian Git → ⚙️）：

| 配置项 | 建议值 | 说明 |
|---|---|---|
| Auto backup every X minutes | `10` | 每 10 分钟自动 commit + push |
| Auto pull every X minutes | `10` | 每 10 分钟自动拉取远端变更 |

其他保持默认即可。

### 6. Windows 侧 Git SSH 配置

obsidian-git 在 Windows 上调用的是 Windows 版 git，需要确保 Windows 侧 git 也能访问 GitHub：

```powershell
# 在 PowerShell 中验证
ssh -T git@github.com
# 应返回: Hi jianghuifr! You've been authenticated...
```

如果不通，检查 `C:\Users\zelos\.ssh\config` 是否配置了 GitHub 的 IdentityFile。

## 使用方式：同步 Claude Code 会话

在 Claude Code 中说：

> "把这个会话同步到 Obsidian"

Claude Code 会自动：
1. 通过 `claude-sessions` MCP 总结当前会话
2. 生成 markdown 文件写入 vault 的 `claude-sessions/` 目录
3. obsidian-git 插件在下一个周期自动 commit + push 到 GitHub

## 关键说明

- **为什么 vault 放 Windows 侧**：Obsidian 是 Windows 应用，读本地磁盘最快。如果 vault 放 WSL 侧，Obsidian 通过 `\\wsl$` 网络路径访问，性能差且索引不稳定
- **为什么用 WSL 执行 git init**：WSL 中 SSH key 和 git config 已配好，避免重复配置
- **obsidian-git vs Obsidian Sync**：obsidian-git 是免费社区插件，用你自己的 GitHub 仓库；Obsidian Sync 是官方付费服务（$4/月），两者完全独立
