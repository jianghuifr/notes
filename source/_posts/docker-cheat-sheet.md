---
title: docker-cheat-sheet
date: 2024-03-09 23:40:15
tags:
    - docker
---

1. 初始化配置

```bash
sudo apt install docker.io

# 添加docker用户组，这个用户组应该是已存在了
sudo groupadd docker
# 将当前用户加入到docker用户组中
sudo gpasswd -a $USER docker

# 更新用户组docker
newgrp docker
```

2. 自启动

```bash
docker update --restart=always <CONTAINER ID>
docker update --restart=no <CONTAINER ID>
```

3. 查看IP

```bash
docker inspect --format='{{.NetworkSettings.IPAddress}}'
```
