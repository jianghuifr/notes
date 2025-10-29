---
title: go-cheat-sheet
date: 2024-04-22 19:13:54
tags:
    - go
photos:
    - /images/go.png
---

## install

> https://go.dev/doc/install

```bash
sudo -i
cd /usr/local
wget https://go.dev/dl/go1.22.2.linux-amd64.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.22.2.linux-amd64.tar.gz
```

## config

> /etc/profile
```bash
GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin
```

> ~/.profile
```bash
GOPATH="$HOME/go"
GOBIN="$GOPATH/bin"
export PATH=$PATH:$GOBIN
```

## proxy

```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```

## install package

```bash
go install github.com/go-nunu/nunu@latest
```

## cross compiler

```bash
go env GOOS GOARCH # see cross compiler conf

GOOS=windows GOARCH=amd64 go build cmd/server/main.go
GOOS=linux GOARCH=amd64 go build cmd/server/main.go
```
