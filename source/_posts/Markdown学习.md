---
title: Markdown 学习
comments: true
categories: 建站
tags:
  - Markdown
  - 资料
abbrlink: 11431
date: 2016-08-08 22:10:22
---

<center>{% asset_img i-love-markdown.png %}</center>

本文涉及学习Markdown文本标记语言的一些练习笔记。


<!-- more -->



# 插入不同颜色的字体

```js
<table><tr><td bgcolor=LimeGreen><font color=white size=3>我是白色的字体，背景是色的~</font></td></tr></table>
```

<table><tr><td bgcolor=LimeGreen><font color=white size=3>我是白色的字体，背景是色的~</font></td></tr></table>



<table><tr><td bgcolor=SpringGreen><font color=white size=3>我是白色的字体，背景是深灰色的~</font></td></tr></table>



<table><tr><td bgcolor=LightSeaGreen><font color=white size=3>我是白色的字体，背景是浅海绿的~</font></td></tr></table>



<table><tr><td bgcolor=#0099ff><font color=white size=3>我是白色的字体，背景是蓝色的~</font></td></tr></table>



<table><tr><td bgcolor=Silver><font color=white size=3>我是白色的字体，背景是银色的~</font></td></tr></table>



<table><tr><td bgcolor=DarkGray><font color=white size=3>我是白色的字体，背景是淡灰色的~</font></td></tr></table>



<table><tr><td bgcolor=DimGray><font color=white size=3>我是白色的字体，背景是深灰色的~</font></td></tr></table> 



Ref: [颜色](http://blog.csdn.net/testcs_dn/article/details/45719357/)



# 插入代码



这里是代码区域

```matlab

% The following is the Matlab Code

% I want to see the result

function demo()

temp=zeros(5,6);

for i=1:size(temp,1)

    for j=1:size(temp,2)

        temp(i,j)=rand(1);

        if temp(i,j)>0.5

            temp(i,j)=1;

        end

    end

end

return temp

```



## 插入标题




```js
# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题
```

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题



## 列表

```js
- 文本1

- 文本2

- 文本3



1. 文本一

2. 文本二

3. 文本三
```


- 文本1

- 文本2

- 文本3


1. 文本一

2. 文本二

3. 文本三



## 插入图像


```js
![](http://pic1.win4000.com/wallpaper/0/54cae8e69ac8b.jpg)
```

<center><img src="http://pic1.win4000.com/wallpaper/0/54cae8e69ac8b.jpg" width="100%"></center>


或者：
```js
<center><img src="http://i2.wp.com/posturemag.com/online/wp-content/uploads/2015/07/Kaz7.jpg" width="100%" ></center>
```

<center><img src="http://i2.wp.com/posturemag.com/online/wp-content/uploads/2015/07/Kaz7.jpg" width="100%" ></center>


# 插入链接

- segmentfault上的一个[Markdown学习手册](https://segmentfault.com/markdown)
- 有道云笔记的Markdown[学习指南-基础篇](http://note.youdao.com/iyoudao/?p=2411)
- [Git学习手册](http://iissnan.com/progit/)


# 插入公式

Hexo文档使用Markdown语言对文档进行编辑，Hexo自身对公式可以进行渲染但是效果不佳，我们采用的是mathjax对Markdown中的公式进行渲染。
首先[修复Hexo与mathjax之间的渲染冲突](http://2wildkids.com/2016/10/06/%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86Hexo%E5%92%8CMathJax%E7%9A%84%E5%85%BC%E5%AE%B9%E9%97%AE%E9%A2%98/#小结)，然后可以参考mathjax的[说明文档](http://mlworks.cn/posts/introduction-to-mathjax-and-latex-expression/)编辑公式。

[一个关于Latex不短的介绍](http://www.mohu.org/info/lshort-cn.pdf)
[Latex常用命令摘录](http://www.mohu.org/info/symbols/symbols.htm)




















































































































































































































































