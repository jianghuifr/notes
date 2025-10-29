---
title: wsl2-port-forwarding
date: 2024-03-12 01:21:13
tags:
    - wsl
---

```bat
netsh interface portproxy show all
```

```bat
netsh interface portproxy add v4tov4 listenport=8765 listenaddress=0.0.0.0 connectport=8765 connectaddress=172.21.110.30
```

```bat
netsh interface portproxy delete v4tov4 listenport=8765 listenaddress=0.0.0.0
```
