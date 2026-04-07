---
title: MCP 服务部署
date: 2026-04-07 00:00:00
tags:
  - deploy
  - mcp
  - docker
---

MCP 服务部署在 develop-volc-ecs (`/root/workspaces/mcp/`)，通过 Docker 容器运行。

## 服务列表

| 服务 | 仓库 | 端口 | 镜像 |
|---|---|---|---|
| mcp-sim-service | `ezone/zelos/mcp-sim-service` | 60001 | `harbor-volc.../sim/mcp-sim-service:latest` |
| lark-openapi-mcp | `ezone/simulation/mcp/lark-openapi-mcp` | 60002 | `harbor-volc.../sim/lark-openapi-mcp:latest` |

## mcp-sim-service

- **语言**: Python 3.13，使用 uv 管理依赖
- **功能**: SIM job API（查询/取消 job、创建 MR 等）
- **传输**: streamable-http，监听 0.0.0.0:60001
- **基础镜像**: `harbor-volc.zelostech.com.cn:5443/sim/python:3.13-slim`

### 环境变量

| 变量 | 用途 | 默认值 |
|---|---|---|
| `EZONE_ACCESS_TOKEN` | eZone GitLab API 鉴权 token | 无（必填，用于创建 MR） |
| `GIT_SERVER_URL` | GitLab 服务器地址 | `https://gitserver.zelostech.com.cn` |
| `GIT_PATH_PREFIX` | 远程 URL 路径前缀 | `ezone/` |

### 构建 & 运行

```bash
cd /root/workspaces/mcp/mcp-sim-service
make docker-build                    # 构建镜像
make docker-run                      # 运行容器（读取 .env）
make docker-build IMAGE=xxx:v1       # 自定义镜像名
```

## lark-openapi-mcp

- **语言**: Node.js 20（TypeScript），使用 yarn 管理依赖
- **功能**: 飞书 OpenAPI MCP 服务
- **传输**: streamable-http，容器内监听 3000，映射到宿主机 60002
- **基础镜像**: `harbor-volc.zelostech.com.cn:5443/sim/node:20-bookworm-slim`
- **Dockerfile**: 两阶段构建（builder + runtime）

### 环境变量

| 变量 | 用途 |
|---|---|
| `APP_ID` | 飞书应用 App ID |
| `APP_SECRET` | 飞书应用 App Secret |

### 构建 & 运行

```bash
cd /root/workspaces/mcp/lark-openapi-mcp
make docker-build                    # 构建镜像
make docker-run                      # 运行容器（读取 .env）
```

## 通用操作

```bash
# 查看日志
docker logs -f <container-name>

# 重启
docker restart <container-name>

# 停止并删除
docker stop <container-name> && docker rm <container-name>

# 重新部署
docker stop <name> && docker rm <name> && make docker-build && make docker-run
```

## 镜像仓库

所有镜像推送到 `harbor-volc.zelostech.com.cn:5443/sim/`。
