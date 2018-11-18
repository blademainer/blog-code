---
title: Ubuntu上使用Git以及GitHub
comments: true
categories: Git
tags:
  - Ubuntu
  - Linux
  - GitHub
  - Git
abbrlink: 58657
date: 2017-05-30 22:40:20
---

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/git-notebook/github-octocat.png)

<!--more-->

## 安装Git

在Ubuntu上安装Git的命令为:

``` git
sudo apt-get install git
```

## 配置GitHub
安装git结束之后就是配置github用户资料，如下：
将其中的 "user_name"替换成自己 GitHub的用户名并且将"email_id" 换成你创建GitHub账号所用的邮箱.
``` git
git config --global user.name "user_name"

git config --global user.email "email_id"
```
## 建立本地仓库（repository）

在自己的电脑上建立本地仓库，这个仓库将会在后续推送到GitHub上，语句如下：
```git
git init Mytest
```
如果初始化成功，你将会得到以下提示：

``` git
Initialized empty Git repository in /home/user_name/Mytest/.git/
```
其中的user_name为本地计算机用户名，因人而异。
Mytest是"init"创建的文件夹，然后进入该文件所在目录：
``` git
cd Mytest
```

## 创建README来描述这个仓库
该步骤可有可无，但是作为一个优秀的工程师还是写点东西比较好。

``` git 
gedit README
```

然后输入：
``` git 
This is a git repo
```
## 将仓库文件加入index（缓存）

这一步尤其重要，我们将需要上载到GitHub的文件们添加到index。这些文件可以是文本文档，m/c/c++/PDF/jpg...几乎任何类型文件，一般而言我们可以把需要上载的文件拷贝到这个文件夹内，然后再用一个语句来把需要上传到文件添加到index，如下：
``` git 
git add file1.txt
git add file2.c
git and file3.m
...

```

## 提交到本地仓库
当我们已经把文件添加／修改到index后，就可以进行提交了；利用如下语句：

``` git
git commit -m "some_message"
```
其中some_message可以是任何字符，例如："my first commit" 或者"edit in readme"等。上面代码的-m参数，就是用来指定这个mesage 的。

注意：git是分为三部分，一部分是文件，另外一个是缓存区，最后一个是本地库。当你修改了自己的文件后，你会git add xx将修改保存到缓存区，然后再用commit推送修改到本地库中。git push 将本地仓库修改推送到服务器上的仓库中commit是将本地修改保存到本地仓库中。



## 在GitHub创建仓库
这个仓库的名字要和本地的一致，该部分不做展开。然后连接到远程仓库

``` git 
git remote add origin https://github.com/user_name/Mytest.git
```
其中user_name就是自己的GitHub的用户名。


## 推送到远程仓库

最后的一步就是提交到远程仓库，用以下命令：
``` git
git push origin master
```

[原文地址](https://www.howtoforge.com/tutorial/install-git-and-github-on-ubuntu-14.04/)





