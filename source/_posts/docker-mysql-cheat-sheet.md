---
title: docker-mysql-cheat-sheet
date: 2024-03-09 23:41:40
tags:
    - docker
    - mysql
---

1. 数据备份

```bash
docker exec some_mysql sh -c 'exec mysqldump {database} -uroot -p"$MYSQL_ROOT_PASSWORD"' > {database}-`date -I`.sql
```

2. 数据恢复

```bash
docker exec -i some_mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < {backup}.sql
```
