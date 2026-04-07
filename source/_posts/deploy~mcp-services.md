---
title: MCP 服务部署
date: 2026-04-07 00:00:00
tags:
  - deploy
  - mcp
  - docker
---

MCP 服务部署在开发机 (`/root/workspaces/mcp/`)，通过 Docker 容器运行。

## 服务列表

| 服务 | 端口 | 说明 |
|---|---|---|
| mcp-sim-service | 60001 | SIM job API |
| lark-openapi-mcp | 60002 | 飞书 OpenAPI MCP |

## mcp-sim-service

- **语言**: Python 3.13，使用 uv 管理依赖
- **功能**: SIM job API（查询/取消 job、创建 MR 等）
- **传输**: streamable-http，监听 0.0.0.0:60001
- **基础镜像**: `<harbor>/python:3.13-slim`

### Dockerfile 要点

```dockerfile
# 从 harbor 复制 uv 工具链
COPY --from=<harbor>/uv:python3.13-bookworm-slim \
    /usr/local/bin/uv /usr/local/bin/uvx /usr/local/bin

WORKDIR /app
# 先复制锁文件安装依赖（利用缓存），README.md 是 hatchling 构建必需
COPY uv.lock pyproject.toml README.md .
RUN uv sync --frozen --no-cache --no-dev
COPY . .

CMD ["uv", "run", "mcp-sim-service"]
```

### 环境变量

| 变量 | 用途 | 默认值 |
|---|---|---|
| `EZONE_ACCESS_TOKEN` | GitLab API 鉴权 token | 无（必填，用于创建 MR） |
| `GIT_SERVER_URL` | GitLab 服务器地址 | 有默认值 |
| `GIT_PATH_PREFIX` | 远程 URL 路径前缀 | `ezone/` |

### 构建 & 运行

```bash
make docker-build                    # 构建镜像
make docker-run                      # 运行容器（读取 .env）
make docker-build IMAGE=xxx:v1       # 自定义镜像名
```

## lark-openapi-mcp

- **语言**: Node.js 20（TypeScript），使用 yarn 管理依赖
- **功能**: 飞书 OpenAPI MCP 服务
- **传输**: streamable-http，容器内监听 3000，映射到宿主机 60002
- **基础镜像**: `<harbor>/node:20-bookworm-slim`
- **Dockerfile**: 两阶段构建（builder 编译 TS + runtime 仅保留 dist 和 production 依赖）

### 环境变量

| 变量 | 用途 |
|---|---|
| `APP_ID` | 飞书应用 App ID |
| `APP_SECRET` | 飞书应用 App Secret |

### 构建 & 运行

```bash
make docker-build                    # 构建镜像
make docker-run                      # 运行容器（读取 .env）
```

## Makefile 模板

两个服务的 Makefile 结构一致：

```makefile
IMAGE ?= <harbor>/<service-name>:latest

docker-build:  ## build docker image
	docker build -t $(IMAGE) .

docker-run:  ## run docker container
	docker run -d \
		--name <container-name> \
		-p <host-port>:<container-port> \
		--env-file .env \
		--restart unless-stopped \
		$(IMAGE)
```

- 环境变量统一通过 `.env` 文件注入（已在 `.gitignore` 中）
- `IMAGE` 变量可在命令行覆盖

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
