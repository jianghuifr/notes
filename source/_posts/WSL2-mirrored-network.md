---
title: WSL2 mirrored network
date: 2024-07-05 20:59:05
tags:
    - wsl
    - network
---

wsl设置host网络模式，与宿主机共用网络，[配置如下][1]

> %USERPROFILE%/.wslconfig

```
[wsl2]
networkingMode=mirrored
```

[1]: <https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#main-wsl-settings> "WSL 中的高级设置配置"
