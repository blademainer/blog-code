---
title: Deploy to both github and coding
tags:
  - github
  - coding
comments: true
abbrlink: 10313
date: 2017-10-31 15:34:40
---

![](http://oofx6tpf6.bkt.clouddn.com/17-10-31/23081159.jpg)

> 本文主要涉及到以hexo框架搭建博客的版本管理。

<!--more-->

## 同时部署

同时部署其实很简单，仅仅修改**站点配置文件**的`_config.yml`即可。在最后的deploy底下新增一项：

```git 
repo: 
github: https://github.com/Your_Github_ID/Github_ID.github.io.git 
coding: https://git.coding.net/Your_Coding_ID/Your_Repo_Name.coding.me.git
```
以后`hexo d`时，就会同时部署到github和coding。

## 版本管理

### 方案 1（推荐）

下载第三方插件，more information refers to this link [hexo-git-backup](https://github.com/coneycode/hexo-git-backup). When you are well configured, you can just run the following command.
```git
hexo backup		#或 hexo b
```

### 方案 2

这里涉及到`git`的部分知识。
> 目的：实现整个blog源码级别的代码管理，包括**站点配置**&**主题配置**。

首先明确一点，在每次`hexo d`时，都会自动产生一个名为`.deploy_git`的文件夹，这个文件夹下包含有`hexo g`渲染出的各种文件，这些文件就是构成github page或者coding page的重要源码；同时会自动的将这个`.deploy_git`设置成本地仓库，即产生一个`.git`的隐藏文件。我们做的事情和以上过程不尽一致，总结起来主要是以下几个命令。
首先建立一个名为`.gitignore`的文件，表示我们并不上传这些文件，原因后续介绍。其内容为：

```git
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
themes/
```
接下来就是把blog的源文件夹搞成一个本地仓库，如下命令。

```git 
# 创建仓库
git init    
# 为本地仓库添加文件
git add -A
# 提交到本地仓库
git commit -m "your message"
# 添加一个名为 origin 的远程，这个名字随便起
git remote add origin https://github.com/Your_Github_ID/Your_Repo_Name.git
# 为其添加 push 到 Github 的地址
git remote set-url --add --push origin https://github.com/Your_Github_ID/Your_Repo_Name.git
# 为其添加 push 到 Coding 的地址
git remote set-url --add --push origin https://git.coding.net/Your_Coding_ID/Your_Repo_Name.git
# push到远端的master分支
git push --set-upstream origin master
# 新建并切换分支
git checkout -b "another-branch"
# 各种更改文件......推送到远程
git push --set-upstream origin another-branch
# 以后可以直接 git push，不用set了。
```
通过以上命令，我们就可以同时部署在github仓库`https://github.com/Your_Github_ID/Your_Repo_Name.git`和coding仓库`https://git.coding.net/Your_Coding_ID/Your_Repo_Name.git`了。

## 设置主题远程仓库
这时你会发现`themes`这个文件夹并没有同时被上传到远程仓库，同上操作，将`theme/next`设置成本地仓库并部署。之所以将这个仓库单独上传，是为了方便切换主题，以及主题升级。

## 设置node_modules远程仓库
之所以将这个模块单独拎出来处理，是因为这个文件夹虽然容量不大，但是其中文件个数特别多。当和blog源文件一同被`git add`到暂存区之后，git shell的运行速度就会超慢。我的解决思路就是将其创建成一个仓库，这样git shell的速度就会快一些。具体步骤不再赘述，同上。

## 结语
经过建立以上的3个仓库，实现了blog源码级别的版本管理。当然，如果你不想暴露自己的源码，那么你只需要在coding申请一个私有仓库并部署就ok了。虽然看起来有些麻烦，但是一旦配置完毕之后，我们就只需要以下几个步骤就可以实现管理。
```git
hexo clean  # 不是必要步骤
hexo d -g   # 渲染+部署到github page以及coding page
git add .   # 添加到暂存区
git commit -m "your message" # push到本地仓库
git push    # 上传到远程仓库（站点目录、next主题目录、node_modules目录）   
```
Good luck:)
