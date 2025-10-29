---
title: nodejs-cheat-sheet
date: 2024-03-09 23:59:46
tags:
    - nodejs
    - npm
    - pnpm
---

## nvm

> https://nodejs.org/en/download/package-manager/current

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

## node

```bash
nvm install 20
```

## pnpm

```bash
npm install -g pnpm
```

### pnpm替换国内源

```bash
pnpm config set registry https://registry.npmmirror.com
# 还原
pnpm config set registry https://registry.npmjs.org
# 查看配置
pnpm get registry
```
