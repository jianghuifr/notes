---
title: python-subprocess
date: 2024-03-10 00:20:53
tags:
    - python
    - subprocess
photos:
    - /images/python.png
---

```python
with subprocess.Popen(args=cmd, shell=True, universal_newlines=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as p:
    while p.poll() is None:
        out = p.stdout.readline().strip()
        logger.debug(out)
        time.sleep(0.1)
    logger.info('done.')
    err = p.stderr.read()
    if err:
        raise EnvironmentError(err)
```

以上可能出现问题

1. `PIPE`大小为65536，占满后会卡住子进程

2. `p.stderr`需要在进程停止后读取，否则会卡住

3. 如果用`tempfile`代替`PIPE`，会无法实时读取`p.stdout`
