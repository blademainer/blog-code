---
title: Linux指令学习笔记
comments: true
categories: Linux
tags:
  - Linux
  - Shell脚本
  - makefile
abbrlink: 29681
date: 2017-05-06 17:04:20
---


<center>{% asset_img ubuntu2.jpg Ubuntu%}</center>

今天看了基本的<span id="inline-purple">Linux</span>指令以及<span id="inline-red">makefile</span>的写法，大体总结了一下。
<!--more-->

## 常用指令及意义
- **root** 表示根目录
- **cd** path 切换到path目录， cd / 切换到根目录
- **cat** file.txt 查看file.txt中的内容
- **pwd**查看当前所在目录
- **rmdir**删除目录
- **rm** 删除文件
- **ls** 列出文件名字， ls -l 列出文件列表
- **cp** 复制文件 cp file1.txt file2.txt (复制file1并重命名为file2)
- **head** file.txt -n 7 查看file.txt的头7行
- **tail** file.txt -n 7 查看file.txt的末尾7行
- **wc** file.txt 统计file.txt文件中字符数，返回3个数字：row_size, word_number, character_number; 
> -l 统计行数。即 wc -l file.txt 
> -m 统计字符数。这个标志不能与 -c 标志一起使用。
> -w 统计字数。一个字被定义为由空白、跳格或换行字符分隔的字符串。
> -L 打印最长行的长度。
- **mv** 命令有2中功能
    - 移动文件夹：mv file.txt file
    - 修改文件名: mv file1.txt file2.txt

- **chmod** 修改用户权限，有3种用户，分别是：

解释 |u | g | o
---|---|---|---
用户|  user 作者  | group小组  | other其他 
读写运行  |r w x  | r w x  | r w x 
二进制 |1 0 0 | 1 0 0 | 1 0 0 
十进制 |4 | 4 | 4

假如取消作者的写的权限则：`chmod u-w file.txt`，其中减号表示“去除”
假如添加作者的写的权限则：`chmod u+w file.txt`，其中减号表示“添加”
假如除了作者以外的人都没有读写权限：`chmod go-r
file.txt`
同样可以用二进制设置权限 `chmod 444 file.txt`，表示：u,g,o都只有读的权限。


## 远程连接服务器

``` bash
ssh username@server_IP_address
```
之后会提示输入密码。

## 远程拷贝文件
和`cp`一样，我们改用`scp`。在本机键入如下命令，其中file是本地的文件，后面的一长串是目标主机的以及其相应目录。

``` bash
scp -f file username@serverIP:/yourfolder
```

## 监视GPU状态

``` bash
 watch -n 0.2 nvidia-smi
```

## 无法连接远程服务器

首先明确两点：
- make sure you have connected the internet.
- make sure you have installed `openssh-server`, if not, you can install it by using the following comands:

``` bash
sudo apt-get update
sudo apt-get install openssh-server
```



## 脚本语言
就是将Linux命令集中在一起，组成一个文件，例如有一个test.sh脚本文件
``` sh
ls
date
cal
```
- 后缀名 .sh
- 运行 sh test.sh
- 变量赋值不用加空格, b=1, a=$b
- 输出 echo
- 字符串写不写双引号一样效果，但是还是推荐写双引号
- 大于号 -gt
- 小于号 -lt
- 等于号 -eq
- 大于等于 -ge
- 小于等于 -le
- 不等于 -ne

### 判断语句
``` sh
if [ expr ]
then
...
else
...
fi

```
### 循环语句
``` sh
for x in 1 2 3 4 5 6
do
 echo $x
done

```

### 数组
例如：arr=(1 2 3 5 6 3 4)
注意在运行时候不能继续用sh (1979脚本)；应该改用bash (后期脚本，有数组的时候就用bash)。

``` sh
arr=(1 2 5 9 8 6 5 4 3 2)
max=${arr[0]}
for i = ${arr[@]}
do 
    if [ $i -gt $max ]
    then 
        max=$i
    fi
done
echo max= $max
```

## 全局变量
- $USER
- $HOME   可以用 ~ 代替
- 环境变量 $PATH,将一个路径加入这个全局变量:
`PATH=$PATH:/home/vincent/tutorial` (注意所有的路径都是用冒号间隔开的，)

## 常用指令

### 压缩
- 把几个文件打包成file.zip, `zip file.zip *` (星号的意思是打包所有的文档)
- 把全部的子文件夹都递归打包 `zip file.zip -r files/*`
- 利用tar命令： `tar -zcvf file.tar.gz files/`

### 解压
- 利用tar命令： `tar -zxvf file.tar.gz`


### 下载命令
- wget
- 下载后重命名 `wget web_address -O file.tar.gz ` 注意用`-O`


## makefile的写法

当编译代码的时候，如果有很多子文件，gcc 后面的语句非常长，我们可以选择使用makefile来对其进行处理以加速编译速度并加强可读性。基本的语句是如下所示的格式：
``` shell
Target: dependencies
(tab键) command
```

- 其中Target表示目标，例如最后想把所有的.c .o 文件们打包成main,那么Target就是main
- dependencies表示依赖项们，即所有的.c .h .o
- command为命令即如：gcc test.c -o test

**例如我们想把tool.c 和main.c 打包成main.o的目标文件**, 则makefile的写法为：
``` sh
main: main.c tool.o
    gcc main.c tool.o -o main
```
但是我们发现并没有tool.o文件所以，还要把tool.o怎么来的说明一下：
``` sh
tool.o: tool.c
    gcc -c tool.c
```
**注意**：`gcc -c`表示直接把tool.c编译成目标文件tool.o
最后呢，如果代码开源的话一般不需要保留.o文件以及main，所以最后还需要把所有的.o以及main文件删除，我们需要在makefile文件的最后添加如下代码：
``` sh
clean: 
    rm *.o main
```
最后这个makefile可以写成：
``` sh
main: main.c tool.o
    gcc main.c tool.o -o main
tool.o: tool.c
    gcc -c tool.c
clean: 
    rm *.o main
```
如果编译器不是gcc，而是其他的编译器，这时候我们有必要做一下代换来提高代码的可移植性。令：CC=gcc， 在引用的时候 $(CC)
``` sh
CC=gcc
main: main.c tool.o
    $(CC) main.c tool.o -o main
tool.o: tool.c
    $(CC) -c tool.c
clean: 
    rm *.o main
```

例如有test1.c，test2.c，它们分别实现了查找最大值和最小值的功能；然后我们把这两个函数的声明分别放在Max.h和Min.h里面，最后我们在主函数main.c里面包含这两个头文件，然后调用这个两个求最大最小值的函数。 

``` sh
CC=gcc
main: main.c Max.o Min.o
    $(CC) main.c Max.o Min.o -o main
Max.o: test1.c
    $(CC) test1.c -o Max
Min.o: test2.c
    $(CC) test2.c -o Min
clean: 
    rm *.o main
```

如果还有第三方的库文件，我们如何链接呢？
``` sh
CC=gcc
CFLAGS=-lm -Wall -g
main: main.c Max.o Min.o
    $(CC) $(CFLAGS) main.c Max.o Min.o -o main
Max.o: test1.c
    $(CC) $(CFLAGS) test1.c -o Max
Min.o: test2.c
    $(CC) $(CFLAGS) test2.c -o Min
clean: 
    rm *.o main
```

未完待续，需要学习的知识太多了，深深地感觉到了自己的无知:(