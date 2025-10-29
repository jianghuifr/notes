---
title: 处理非字符串key的json数据
date: 2024-03-09 19:40:26
tags:
    - json
    - python
photos:
    - /images/python.png
---

```text
Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> d = {1: 2}
>>> 1 in d
True
>>>
>>> import json
>>>
>>> dd = json.loads(json.dumps(d))
>>> dd
{'1': 2}
>>>
>>> 1 in d
True
>>>
>>> 1 in dd
False
>>>
```
