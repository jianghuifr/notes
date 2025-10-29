---
title: python-csv
date: 2024-03-10 00:19:00
tags:
    - python
    - csv
photos:
    - /images/python.png
---

```python
import csv
import random
from typing import Any, Dict, List, Optional


class DataFrame(object):
    def __init__(self) -> None:
        self._data = dict(
            k1=list(i for i in range(100)),
            k2=list(random.randint(0, i) for i in range(100)),
            k3=list(random.randint(0, i) for i in range(100)),
        )
        assert self._data.keys(), "DataFrame need keys"

    @property
    def fieldnames(self) -> List[Any]:
        return list(self._data.keys())

    @property
    def content(self) -> Optional[List[Dict[Any, Any]]]:
        return [{key: self._data[key][i] for key in self._data.keys()} for i in range(len(self))]

    def __len__(self) -> int:
        return len(list(self._data.values())[0])


data_frame = DataFrame()
with open(f"example.csv", mode="w", encoding="utf_8_sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=data_frame.fieldnames)
    writer.writeheader()
    writer.writerows(data_frame.content)
```

- `encoding="utf_8_sig"`：避免中文乱码
- `newline=""`：避免出现隔行空行
