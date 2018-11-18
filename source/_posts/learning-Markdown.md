---
title: Markdown 学习
comments: true
categories: 建站
mathjax: true
tags:
  - Markdown
  - 资料
abbrlink: 11431
date: 2016-08-08 22:10:22
---
![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/learning-Markdown/guide-to-markdown-writing.png)

<!--<a href="https://www.vincentqin.tech"><img border="0" src="i-love-markdown.png" /></a>-->

本文涉及学习Markdown文本标记语言的一些练习笔记。


<!-- more -->


## Note Tag 测试

``` html
/**
 * note.js | global hexo script.
 *
 * ATTENTION! No need to write this tag in 1 line if u don't want see probally bugs.
 *
 * Usage:
 *
 * {% note [class] %}
 * Any content (support inline tags too).
 * {% endnote %}
 *
 * [class] : default | primary | success | info | warning | danger.
 *           May be not defined.
 */
```

{% note default %}
### Test note default
昏鴉盡，小立恨因誰 ?急雪乍翻香閣絮，輕風吹到膽瓶梅，心字已成灰。
{% endnote %}

{% note primary %}
### Test note primary
昏鴉盡，小立恨因誰 ?急雪乍翻香閣絮，輕風吹到膽瓶梅，心字已成灰。
{% endnote %}

{% note success %}
### Test note success
昏鴉盡，小立恨因誰 ?急雪乍翻香閣絮，輕風吹到膽瓶梅，心字已成灰。
{% endnote %}

{% note info %}
### Test note info
昏鴉盡，小立恨因誰 ?急雪乍翻香閣絮，輕風吹到膽瓶梅，心字已成灰。
{% endnote %}


{% note warning %}
### Test note warning
昏鴉盡，小立恨因誰 ?急雪乍翻香閣絮，輕風吹到膽瓶梅，心字已成灰。
{% endnote %}

{% note danger %}
### Test note danger
昏鴉盡，小立恨因誰 ?急雪乍翻香閣絮，輕風吹到膽瓶梅，心字已成灰。
{% endnote %}


## Button 标签测试

```html
Usage: {% button /path/to/url/, text, icon [class], title %}
Alias: {% btn /path/to/url/, text, icon [class], title %}
```

### Button内嵌文字

``` html
{% button #, Text %}{% button #插入不同颜色的字体, 插入不同颜色的字体,heart %}
```
{% button #, Text %}{% button #插入不同颜色的字体, 插入不同颜色的字体,heart %}

### Button内嵌logo
``` html
<div class="text-center"><span>{% btn ##插入不同颜色的字体,, header %}{% btn #,, edge %}{% btn #,, times %}{% btn #,, circle-o %}</span>
<span>{% btn #,, italic %}{% btn #,, scribd %}</span>
<span>{% btn #,, google %}{% btn #,, chrome %}{% btn #,, opera %}{% btn #,, diamond fa-rotate-270 %}</span></div>
```

<div class="text-center"><span>{% btn #插入不同颜色的字体,插入不同颜色的字体, header %}{% btn #,, edge %}{% btn #,, times %}{% btn #,, circle-o %}</span>
<span>{% btn #,, italic %}{% btn #,, scribd %}</span>
<span>{% btn #,, google %}{% btn #,, chrome %}{% btn #,, opera %}{% btn #,, diamond fa-rotate-270 %}</span></div>


### Button Margin
``` html
<div class="text-center">{% btn #, Almost, adn fa-fw fa-lg %} {% btn #, Over, terminal fa-fw fa-lg %}</div>
```
<div class="text-center">{% btn #, Almost, adn fa-fw fa-lg %} {% btn #, Over, terminal fa-fw fa-lg %}</div>

``` html
<div class="text-right">
{% btn #, Test is finished., check fa-fw fa-lg, Button tag test is finished. %}
</div>
```
<div class="text-right">
{% btn #, Test is finished., check fa-fw fa-lg, Button tag test is finished. %}
</div>



## Label Tag测试文中字体颜色

``` html
From {% label @fairest creatures %} we desire increase,
That thereby {% label primary@beauty's rose %} might never die,
But as the {% label success@riper %} should by time decease,
His tender heir might {% label info@bear his memory %}:
But thou contracted to thine own bright eyes,
Feed'st thy light's flame with *{% label warning @self-substantial fuel%}*,
Making a famine where ~~{% label default @abundance lies %}~~,
Thy self thy foe, to thy <mark>sweet self too cruel</mark>:
Thou that art now the world's fresh ornament,
And only herald to the gaudy spring,
Within thine own bud buriest thy content,
And {% label danger@tender churl mak'st waste in niggarding %}:
Pity the world, or else this glutton be,
{% label warning@To eat the world's due, by the grave and thee %}.
```

From {% label @fairest creatures %} we desire increase,
That thereby {% label primary@beauty's rose %} might never die,
But as the {% label success@riper %} should by time decease,
His tender heir might {% label info@bear his memory %}:
But thou contracted to thine own bright eyes,
Feed'st thy light's flame with *{% label warning @self-substantial fuel%}*,
Making a famine where ~~{% label default @abundance lies %}~~,
Thy self thy foe, to thy <mark>sweet self too cruel</mark>:
Thou that art now the world's fresh ornament,
And only herald to the gaudy spring,
Within thine own bud buriest thy content,
And {% label danger@tender churl mak'st waste in niggarding %}:
Pity the world, or else this glutton be,
{% label warning@To eat the world's due, by the grave and thee %}.

## 表格Tag测试

``` html
{% tabs First unique name %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->
<!-- tab -->
**This is Tab 2.**
<!-- endtab -->
<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
```

{% tabs First unique name %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->
<!-- tab -->
**This is Tab 2.**
<!-- endtab -->
<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}



### 插入不同颜色的字体

```html
<table><tr><td bgcolor=LimeGreen><font color=white size=3>我是白色的字体，背景是色的~</font></td></tr></table>
```

<table><tr><td bgcolor=LimeGreen><font color=white size=3>我是白色的字体，背景是色的~</font></td></tr></table>



<table><tr><td bgcolor=SpringGreen><font color=white size=3>我是白色的字体，背景是深灰色的~</font></td></tr></table>



<table><tr><td bgcolor=LightSeaGreen><font color=white size=3>我是白色的字体，背景是浅海绿的~</font></td></tr></table>



<table><tr><td bgcolor=#0099ff><font color=white size=3>我是白色的字体，背景是蓝色的~</font></td></tr></table>



<table><tr><td bgcolor=Silver><font color=white size=3>我是白色的字体，背景是银色的~</font></td></tr></table>



<table><tr><td bgcolor=DarkGray><font color=white size=3>我是白色的字体，背景是淡灰色的~</font></td></tr></table>



<table><tr><td bgcolor=DimGray><font color=white size=3>我是白色的字体，背景是深灰色的~</font></td></tr></table> 



## 插入代码



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




``` markdown
# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题
```




## 列表

``` markdown
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


``` html
![](http://pic1.win4000.com/wallpaper/0/54cae8e69ac8b.jpg)
```

<center><img src="http://pic1.win4000.com/wallpaper/0/54cae8e69ac8b.jpg" width="100%"></center>


或者：
``` html
<center><img src="http://i2.wp.com/posturemag.com/online/wp-content/uploads/2015/07/Kaz7.jpg" width="100%" ></center>
```

<center><img src="http://i2.wp.com/posturemag.com/online/wp-content/uploads/2015/07/Kaz7.jpg" width="100%" ></center>


## 插入链接

- segmentfault上的一个[Markdown学习手册](https://segmentfault.com/markdown)
- 有道云笔记的Markdown[学习指南-基础篇](http://note.youdao.com/iyoudao/?p=2411)
- [Git学习手册](http://iissnan.com/progit/)


## 插入公式

``` math
$$E=mc^2$$
```
$$E=mc^2$$

Hexo文档使用Markdown语言对文档进行编辑，Hexo自身对公式可以进行渲染但是效果不佳，我们采用的是mathjax对Markdown中的公式进行渲染。
首先[修复Hexo与mathjax之间的渲染冲突](http://2wildkids.com/2016/10/06/%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86Hexo%E5%92%8CMathJax%E7%9A%84%E5%85%BC%E5%AE%B9%E9%97%AE%E9%A2%98/#小结)，然后可以参考mathjax的[说明文档](http://mlworks.cn/posts/introduction-to-mathjax-and-latex-expression/)编辑公式。

## 希腊字母对应表

|字母名称|	大写	|markdown原文|	小写	|markdown原文|
| :-: | :-: | :-: |:-:|:-:|
|alpha	|$A$	|A	|$\alpha$	|\alpha|
|beta	|$B$	|B	|$\beta$	|\beta|
|gamma	|$\Gamma$	|\Gamma	|$\gamma$	|\gamma|
|delta	|$\Delta$	|\Delta	|$\delta$  |\delta|
|epsilon	|$E$|	E|	$\epsilon$|	\epsilon|
|-|-|-|$\varepsilon$	|\varepsilon|
|zeta|	$Z$|	Z|	$\zeta$|	\zeta|
|eta|	$E$|	E|	$\eta$|	\eta|
|theta|	$\Theta$|	\Theta|	$\theta$|	\theta|
|iota|	$I$|	I|	$\iota$	|\iota|
|kappa|	$K$|	K|	$\kappa$	|\kappa|
|lambda|	$\Lambda$|	\Lambda	|$\lambda$|	\lambda|
|Mu	|$M$|   M	|$\mu$|	\mu|
|nu	|$N$|	N   |$\nu$|	\nu|
|xi	|$\Xi$|	\Xi|	$\xi$	|\xi|
|omicron|	$O$|	O	|$\omicron$|	\omicron|
|pi|	$\Pi$|	\Pi|	$\pi$|	\pi|
|rho	|$P$|	P|	$\rho$|	\rho|
|sigma	|$\Sigma$|	\Sigma|	$\sigma$|	\sigma|
|tau	|$T$|	T|	$\tau$|	\tau|
|upsilon|	$\Upsilon$	|\Upsilon|	$\upsilon$|	\upsilon|
|phi|	$\Phi$|	\Phi|	$\phi$|	\phi|
|-|-|-|$\varphi$	|\varphi|
|chi|	$X$	|X	|$\chi$	|\chi|
|psi	|$\Psi$|	\Psi|	$\psi$	|\psi|




## 参考

1. [Hexo Theme Next Test](https://almostover.ru/2016-01/hexo-theme-next-test/#)
2. [Color map](http://blog.csdn.net/testcs_dn/article/details/45719357/)
3. [一个关于Latex不短的介绍](http://www.mohu.org/info/lshort-cn.pdf)
4. [Latex常用命令摘录](http://www.mohu.org/info/symbols/symbols.htm)

















































































































































































































































