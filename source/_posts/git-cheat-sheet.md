---
title: git-cheat-sheet
date: 2024-03-10 00:04:35
tags:
     - git
---

## Init

```bash
# generate ssh key
ssh-keygen -t rsa -C "**example@example.com[192.168.0.1]**"
# copy ssh public key to VSC
cat $HOME/.ssh/id_rsa.pub

git config --global user.email **example@example.com**
git config --global user.name **example**
```

## Proxy

```bash
git config --global http.https://github.com.proxy socks5://127.0.0.1:10808
git config --global https.https://github.com.proxy socks5://127.0.0.1:10808

git config --global --unset http.proxy
git config --global --unset https.proxy
```

## Reset commit author

https://www.cnblogs.com/651434092qq/p/11015901.html

```bash
git config user.name **example**
git config user.email **example@example.com**

git rebase -i HEAD~3
# modify 'pick' to 'edit' and then ':wq'

git commit --amend --reset-author

git log
# check commit author

git rebase --continue
```

## Transfer repository

```bash
git clone --bare https://gitee.com/mygit-demo/test.git
cd test.git
git push --mirror https://gitee.com/mygit-demo/git-demo.git
```

## Tag

```bash
# add tag
git tag **v0.1.0**

# rm local tag
git tag -d **v0.1.0**

# rm remote tag
git push origin :refs/tags/**v0.1.0**
Commit without git-hooks
git commit . -m "quick fix" --no-verify
```

## Rebase first commit

```bash
git rebase -i --root
```

## 推送本地到远程新分支

```bash
git push origin master:new_branch_name
```
