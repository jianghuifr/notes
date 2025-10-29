---
title: python-thread-sync
date: 2024-03-10 00:20:04
tags:
    - python
    - threading
photos:
    - /images/python.png
---

```python
import random
import threading
import time

semaphore = threading.Semaphore(0)


def consumer():
    print("consumer is waiting")
    semaphore.acquire()
    print("Consumer notify: consumerd item number {}".format(item))


def producer():
    global item
    time.sleep(10)
    item = random.randint(0, 1000)
    print("producer notify: produced item number {}".format(item))
    semaphore.release()


if __name__ == '__main__':
    for i in range(5):
        t1 = threading.Thread(target=producer)
        t2 = threading.Thread(target=consumer)
        t1.start()
        t2.start()
        t1.join()
        t2.join()
    print("program done")
```
