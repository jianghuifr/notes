---
title: cpython-compiling
date: 2024-03-06 13:44:49
tags:
    - cpython
    - python
photos:
    - /images/python.png
---

## ModuleNotFoundError: No Module named '_sqlite3'

> $ import sqlite3
> ModuleNotFoundError: No Module named '_sqlite3'

编译时带上参数`./configure --enable-loadable-sqlite-extensions`（参考）并且提前安装依赖（参考）

```bash
sudo apt-get install build-essential gdb lcov pkg-config \
      libbz2-dev libffi-dev libgdbm-dev libgdbm-compat-dev liblzma-dev \
      libncurses5-dev libreadline6-dev libsqlite3-dev libssl-dev \
      lzma lzma-dev tk-dev uuid-dev zlib1g-dev
```
