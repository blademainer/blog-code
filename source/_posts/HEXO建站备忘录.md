---
title: HEXO建站备忘录
comments: true
categories: 建站
tags:
  - hexo
  - 博客
  - github
  - coding
abbrlink: 47877
date: 2016-08-09 12:37:42
---


<center>{% asset_img hexo.png %}</center>

{%note success%}
**Hexo**作为建立Blog利器，为我们没有JS基础的小白们提供了建立专属自己博客的机会！经常使用的语法很简单，我们完全可以在10min分钟之内建立自己的Blog，后期的优化才是最耗费时间的。好了，直接进入正文。
{%endnote%}

<!-- more -->


```js
hexo clean    # 清除缓存，简写 hexo c
hexo generate # 作用：建立静态页面， 简写 hexo g 
hexo deploy   # 部署自己的blog，本人部署在了Git上，简写 hexo d
hexo server   # 以启动本地服务， 可预览，简写 hexo s
hexo new blog_name #　新建以blog_name为名的blog
在.md文档中加入 <!-- more --> 可以显示“阅读全文”
```


## 显示文章阅读数量
另外：[显示文章阅读量](https://notes.wanghao.work/2015-10-21-%E4%B8%BANexT%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E9%87%8F%E7%BB%9F%E8%AE%A1%E5%8A%9F%E8%83%BD.html#%E9%85%8D%E7%BD%AELeanCloud)， 服务主要用了[LeanCloud](https://leancloud.cn/)服务提供商


## 官方主题设置

我使用的是[Next](http://theme-next.iissnan.com/)主题， [Make the theme more beautiful, recommended](http://www.arao.me/)

## 关于评论系统
多说已死，~~评论系统转到了Disqus，但是被墙的事实让人感觉不爽~~。几经周折，从多说转到Disqus，然后在gitment和gitalk之间徘徊，最后还是选择了[valine](https://valine.js.org/#/)，不过它只能在中国区进行评论，于是我还是保留了gitalk。然后，最后的最后我还是选择了**Hypercomment**。

## 关于旋转头像

把侧边栏头像变成圆形&鼠标停留在上面出现旋转效果，具体修改文件的位置是`next\source\css\_common\components\sidebar\sidebar-author.styl`。更为具体的修改过程见[Ehlxr](https://ehlxr.me/2016/08/30/%E4%BD%BF%E7%94%A8Hexo%E5%9F%BA%E4%BA%8EGitHub-Pages%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%EF%BC%88%E4%B8%89%EF%BC%89/)写的这篇博客。
``` css
.site-author-image {
  display: block;
  margin: 0 auto;
  padding: $site-author-image-padding;
  max-width: $site-author-image-width;
  height: $site-author-image-height;
  border: $site-author-image-border-width solid $site-author-image-border-color;

  /* 头像圆形 */
  border-radius: 80px;
  -webkit-border-radius: 80px;
  -moz-border-radius: 80px;
  box-shadow: inset 0 -1px 0 #333sf;
  /* 设置循环动画 [animation: (play)动画名称 (2s)动画播放时长单位秒或微秒 (ase-out)动画播放的速度曲线为以低速结束 
    (1s)等待1秒然后开始动画 (1)动画播放次数(infinite为循环播放) ]*/
  -webkit-animation: play 2s ease-out 1s 1;
  -moz-animation: play 2s ease-out 1s 1;
  animation: play 2s ease-out 1s 1; 

  /* 鼠标经过头像旋转360度 */
  -webkit-transition: -webkit-transform 1.5s ease-out;
  -moz-transition: -moz-transform 1.5s ease-out;
  transition: transform 1.5s ease-out;
}

img:hover {
  /* 鼠标经过头像旋转360度 */
  -webkit-transform: rotateZ(360deg);
  -moz-transform: rotateZ(360deg);
  transform: rotateZ(360deg);
}
```

## 背景颜色设置

其实NEXT主题已经自带了几种动画了，我用的是three_waves；但是呢，存在一个问题就是因为Blog背景是透明的，这样文字和背景动画就有重叠效果了，很不方便阅读，这时把背景色设置为白色即可。添加**background: white**到如下路径`next\source\css\_schemes\Muse\_layout.styl`
``` css
.header-inner, .container .main-inner, .footer-inner {
  background: white;
  +mobile() { width: auto; }
}
```

## 页面宽度设置

有时候我们可能会嫌弃博客的页面太小，留白过大。这时候可以对页面宽度进行设置，可以参考Hexo Next主题 [Issue #759](https://github.com/iissnan/hexo-theme-next/issues/759)。对于 Pisces Scheme，需要同时修改 `header` 的宽度、`.main-inner` 的宽度以及 `.content-wrap` 的宽度。例如，使用百分比（Pisces 的布局定义在 `source/css/_schemes/Picses/_layout.styl` 中）：

``` css
.header{ width: 80%; } /* 80% */
.container .main-inner { width: 80%; } /* 80% */
.content-wrap { width: calc(100% - 260px); }
```

## 优化友情链接

新建一个`Friends`页面：
``` bash
hexo new page Friends
```
新建样式，进入`themes\next\source\css\_custom\custom.styl`，在最后新加上几行代码:

``` css
$shadowColor	  = #333;
$themeColor       = #222;
$link-image-size  = 180px;

.link-body{
	ul{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		.link{
			max-width: $link-image-size;
			min-width: $link-image-size;
			max-height: $link-image-size;
			min-height: $link-image-size;

			position: relative;
			box-shadow: 0 0 1px $shadowColor;
			magin: 6px;
			width: 20%;
			list-style: none!important;
			overflow: hidden;
			border-radius: 6px;
			img{
				object-fit: cover;
				transition: transform .6s ease-out;
				vertical-align: middle;
				border-bottom: 4px solid #eee;//#e5642b;
				transition: 0.4s ;
				width: 100%;
				border-radius: 90px 90px 90px 90px;

				display: inline-block;
				float: none;
				vertical-align: middle;
			}
			.link-name{
				position: absolute;
				bottom: 0;
				width: 100%;
				color: #666;
				text-align: center;
				text-shadow: 0 0 1px rgba(0,0,0,.4);
				background: rgba(255,255,255,.7);
			}
			&:hover{
				img{
					overflow: hidden;
					//transition: 0.4s;
					border-radius: 0 0 0 0;
				}
				.link-name{
					color: $themeColor;
					text-shadow: 0 0 1px $themeColor;
				}
			}
		}
	}
}

```

然后编辑站点的`source\Friends`下的`index.md`文件，内容如下：

``` html
<div class="link-body">
	<ul>
	<!--your friend begin-->
	<li class="link"><a href="your_friends_link" title="balabala" target="_blank" >
        <img src= "image_path" alt="balabala"/>
        <span class="link-name"> balabala</span></a></li>
	<!--your friend end-->

	<!--your another friend begin-->
	<li class="link"><a href="your_friends_link" title="balabala" target="_blank" >
        <img src= "image_path" alt="balabala"/>
        <span class="link-name"> balabala</span></a></li>
	<!--your another friend end-->
	...
	</ul>
</div>
```

## 增加Gitter

参考[sidecar](https://sidecar.gitter.im)的示例，在`themes\next\layout\_layout.swig`的`</body>`前增加如下代码：
``` html
  <!-- add gitter on sidebar -->
  <script>
    ((window.gitter = {}).chat = {}).options = {
      room: 'vincentqin-blog-chat/Lobby'
    };
  </script>
  <script src="https://sidecar.gitter.im/dist/sidecar.v1.js" async defer></script>
```

然后在`themes\next\source\css\_custom\custom.styl`里增加如下设置：
``` css
// adjust the position of gitter
.gitter-open-chat-button {
      right: 20px;
	  padding: 10px;
	  background-color: #777;
}

@media (max-width: 600px) {
    .gitter-open-chat-button,
    .gitter-chat-embed {
        display: none;
    }
}
```


## 添加页面背景

将背景图片放在`themes\next\source\images`下，例如bg.jpg，然后`themes\next\source\css\_custom\custom.styl`里增加如下设置：
``` css
@media screen and (min-width:720px) {

    body {
	background:url(/images/bg.jpg);
    background-repeat: no-repeat;
    background-attachment:fixed; // 鼠标滚动背景不动
    background-position:50% 50%;
    }
    #footer {
        color:#c8c8c8;
    }
}
```

~~~这里是我[custom.styl](https://github.com/Vincentqyw/blog-code/blob/master/themes/next/source/css/_custom/custom.styl)所有配置，仅供参考。~~~

## 添加fork me on github

文件位置：`\themes\next\layout\_layout.swig`，在`<div class="headband"></div>`下一行添加如下代码。
``` js
<a href="https://www.github.com/Vincentqyw" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>

```
更多样式，参考[这里](http://tholman.com/github-corners/)。


## MarkDown编辑器

推荐**Haroopad**

<center>{% asset_img 100.png Haroopad%}</center>


## 插入PDF文档以及图片


1. 插入PDF文档：
将相应的PDF文档放在与博客标题同名的文件夹内，然后再按照如下方式进行插入。
``` js
[点我，这里是PDF文档](latex入门教程.pdf)
```
	[点我，这里是PDF文档](latex入门教程.pdf)

2. 利用js嵌入图片
``` js
<img src= image_path alt="Lytro相机" width="100%">
<center>Lytro</center>
```
    注意以上的`image_path`既可以是图床中的路径，亦可以把图片放在`source/images/`文件下，然后`image_path=/images/logo.png`，当然也可以如下插入图片，更加方便。
    ``` js
    ![](/images/logo.png)
    ```
3. 利用插件，以下我在Github上找到的别人已经做好的一个小工具。
- 安装 [hexo-tag-asset-res](https://github.com/timnew/hexo-tag-asset-res)

    打开Git Shell, 在Hexo根目录下, 输入如下代码

    ```javascript
    $ npm install hexo-tag-asset-res --save
    ```
- 修改Hexo根目录下_config.yml文件

    打开Hexo根目录, 找到_config.yml文件, 用任何一个文本编辑器打开, 找到如下代码

    ```javascript
    post_asset_folder: false
    ```
- 测试插入
<center>{% asset_img 1.jpg 林青霞%}</center>





## 配置个性化的字体

在`next\source\css\_variables\custom.styl`文件中添加如下内容。

``` styl
// 修改成你期望的字体族
$font-family-base	= "Monda","Microsoft YaHei", Verdana, sans-serif
// 标题，修改成你期望的字体族
$font-family-headings	= "Roboto Slab", Georgia, sans
// 代码字体
$code-font-family	= "PT Mono", "Input Mono", Consolas, Monaco, Menlo, monospace
// 博客字体
$font-family-posts	= "Monda"
// logo字体
$font-family-logo	= "Lobster Two"
```


## 在博客中插入网易云音乐

我们可以利用网易云提供的代码直接在markdown文档里面插入。

- 在网页上找到你想要播放的音乐，如下图：
{% asset_img wangyiMusic.png %}


- 点击**生成外链播放器**
{% asset_img wangyiMusicCode.png %}


注意自动播放，以及音乐播放器的大小可调。


- 在Markdown文档里插入如下代码

```js
<center><iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=500 height=86 src
="http://music.163.com/outchain/player?type=2&id=29722263&auto=0&height=66"></iframe></center>
```

<center><iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=500 height=86 src="http://music.163.com/outchain/player?type=2&id=29722263&auto=0&height=66"></iframe></center>




## 同时部署

接下来主要涉及到以hexo框架搭建博客的版本管理。同时部署其实很简单，仅仅修改**站点配置文件**的`_config.yml`即可。在最后的deploy底下新增一项：

``` yml
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

``` bash
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

#### 设置主题远程仓库
这时你会发现`themes`这个文件夹并没有同时被上传到远程仓库，同上操作，将`theme/next`设置成本地仓库并部署。之所以将这个仓库单独上传，是为了方便切换主题，以及主题升级。

#### 设置node_modules远程仓库
之所以将这个模块单独拎出来处理，是因为这个文件夹虽然容量不大，但是其中文件个数特别多。当和blog源文件一同被`git add`到暂存区之后，git shell的运行速度就会超慢。我的解决思路就是将其创建成一个仓库，这样git shell的速度就会快一些。具体步骤不再赘述，同上。


### 结语
经过建立以上的3个仓库，实现了blog源码级别的版本管理。当然，如果你不想暴露自己的源码，那么你只需要在coding申请一个私有仓库并部署就ok了。虽然看起来有些麻烦，但是一旦配置完毕之后，我们就只需要以下几个步骤就可以实现管理。
``` bash
hexo clean  # 不是必要步骤
hexo d -g   # 渲染+部署到github page以及coding page
git add .   # 添加到暂存区
git commit -m "your message" # push到本地仓库
git push    # 上传到远程仓库（站点目录、next主题目录、node_modules目录）   
```
Good luck:)

## 所有配置集锦

最后附上我的全部配置。文件位置：`themes\next\source\css\_custom\custom.styl`。
``` css
// Custom styles.

//修改文章内code样式
code {color:#c7254e;background:#f9f2f4;border:1px solid #d6d6d6;}

//修改文章中图片样式，改为居中
.posts-expand .post-body img {
	margin: 0 auto;
}

// 更改文中链接的颜色
.post-body p a {
  color: $orange;
  text-decoration: none;
  border-bottom: 1;
  &:hover {
    color: $blue;
    //text-decoration: underline;
  }
}

// 增大post之间的margin
.post {
    margin-bottom: 30px;
    //padding: 45px 36px 36px 36px;
    //box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    background-color: rgba(255, 255, 255,0.8);
}
// delete the border of image
.posts-expand .post-body img {
    border: none;
    padding: 0px;
}

// [Read More]按钮样式: 黑底绿字
.post-button .btn:hover {
    color: rgb(136, 255, 13) !important;
	background-color: rgba(0, 0, 0, 0.75); //black
}
// 页面底部页码
.pagination .page-number.current {
    border-radius: 100%;
    background-color: rgba(100, 100, 100, 0.75);
}
// 页面底部页码, 去除鼠标置于上方时，数字上方的线
.pagination .prev, .pagination .next, .pagination .page-number {
    margin-bottom: 10px;
    border: none;
	color: rgb(1, 1, 1);
}

// 页面底部页码，鼠标置于上方，黑底绿字
.page-number:hover,.page-number:active{
	color: rgb(136, 255, 13);
	border-radius: 100%;
    //background-color: rgba(255, 0, 100, 0.75); //品红
	background-color: rgba(0, 0, 0, 0.75); //black
}
.pagination .space {
    color: rgb(0, 0, 0);
}
.pagination {
    border: none;
    margin: 0px;
}

// 已运行时间
#days {
    display: block;
    color: rgba(0, 0, 0,0.75);
    font-size: 13px;
    margin-top: 15px;
}

// 自定义页脚跳动的心样式
@keyframes heartAnimate {
    0%,100%{transform:scale(1);}
    10%,30%{transform:scale(0.9);}
    20%,40%,60%,80%{transform:scale(1.1);}
    50%,70%{transform:scale(1.1);}
}
#heart {
    animation: heartAnimate 1.0s ease-in-out infinite;
}
.with-love {
    color: rgb(236, 25, 27);
}

// 自定义的文章置顶样式
.post-sticky-flag {
    font-size: inherit;
    float: right;
    color: rgb(0, 0, 0);
    cursor: help;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
}
.post-sticky-flag:hover {
    color: #07b39b;
}

// 右下角返回顶部按钮样式

.back-to-top:hover {
    color: rgb(136, 255, 13);
	background-color: rgba(0, 0, 0, 0.75); //black
}

// 下载样式
a#download {
	display: inline-block;
	padding: 0 10px;
	color: #000;
	background: transparent;
	border: 2px solid #000;
	border-radius: 2px;
	transition: all .5s ease;
	font-weight: bold;
	&:hover {
		background: #000;
		color: #fff;
	}
}

// 颜色块-黄
span#inline-yellow {
	display:inline;
//	padding:.2em .6em .3em;
	padding:.1em .4em .1em;
	font-size:90%;
	font-weight:bold;
	line-height:1;
	color:#fff;
	text-align:center;
	white-space:nowrap;
	vertical-align:baseline;
	border-radius:0;
	background-color: #f0ad4e;
}
// 颜色块-绿
span#inline-green {
	display:inline;
//	padding:.2em .6em .3em;
	padding:.1em .4em .1em;
	font-size:90%;
	font-weight:bold;
	line-height:1;
	color:#fff;
	text-align:center;
	white-space:nowrap;
	vertical-align:baseline;
	border-radius:0;
	background-color: #5cb85c;
}
// 颜色块-蓝
span#inline-blue {
	display:inline;
//	padding:.2em .6em .3em;
	padding:.1em .4em .1em;
	font-size:90%;
	font-weight:bold;
	line-height:1;
	color:#fff;
	text-align:center;
	white-space:nowrap;
	vertical-align:baseline;
	border-radius:0;
	background-color: #2780e3;
}
// 颜色块-紫
span#inline-purple {
	display:inline;
//	padding:.1em .2em .1em;
	padding:.1em .4em .1em;
	font-size:90%;
	font-weight:bold;
	line-height:1;
	color:#fff;
	text-align:center;
	white-space:nowrap;
	vertical-align:baseline;
	border-radius:0;
	background-color: #9954bb;
}
// 颜色块-红
span#inline-red {
	display:inline;
//	padding:.2em .6em .3em;
	padding:.1em .4em .1em;
	font-size:90%;
	font-weight:bold;
	line-height:1;
	color:#fff;
	text-align:center;
	white-space:nowrap;
	vertical-align:baseline;
	border-radius:0;
	background-color: #df3e3e;
}

// 左侧边框红色块级
p#div-border-left-red {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-left-width: 5px;
	border-radius: 3px;
	border-left-color: #df3e3e;
}
// 左侧边框黄色块级
p#div-border-left-yellow {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-left-width: 5px;
	border-radius: 3px;
	border-left-color: #f0ad4e;
}
// 左侧边框绿色块级
p#div-border-left-green {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-left-width: 5px;
	border-radius: 3px;
	border-left-color: #5cb85c;
}
// 左侧边框蓝色块级
p#div-border-left-blue {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-left-width: 5px;
	border-radius: 3px;
	border-left-color: #2780e3;
}
// 左侧边框紫色块级
p#div-border-left-purple {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-left-width: 5px;
	border-radius: 3px;
	border-left-color: #9954bb;
}
// 右侧边框红色块级
p#div-border-right-red {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-right-width: 5px;
	border-radius: 3px;
	border-right-color: #df3e3e;
}
// 右侧边框黄色块级
p#div-border-right-yellow {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-right-width: 5px;
	border-radius: 3px;
	border-right-color: #f0ad4e;
}
// 右侧边框绿色块级
p#div-border-right-green {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-right-width: 5px;
	border-radius: 3px;
	border-right-color: #5cb85c;
}
// 右侧边框蓝色块级
p#div-border-right-blue {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-right-width: 5px;
	border-radius: 3px;
	border-right-color: #2780e3;
}
// 右侧边框紫色块级
p#div-border-right-purple {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-right-width: 5px;
	border-radius: 3px;
	border-right-color: #9954bb;
}
// 上侧边框红色
p#div-border-top-red {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-top-width: 5px;
	border-radius: 3px;
	border-top-color: #df3e3e;
}
// 上侧边框黄色
p#div-border-top-yellow {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-top-width: 5px;
	border-radius: 3px;
	border-top-color: #f0ad4e;
}
// 上侧边框绿色
p#div-border-top-green {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-top-width: 5px;
	border-radius: 3px;
	border-top-color: #5cb85c;
}
// 上侧边框蓝色
p#div-border-top-blue {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-top-width: 5px;
	border-radius: 3px;
	border-top-color: #2780e3;
}
// 上侧边框紫色
p#div-border-top-purple {
	display: block;
	padding: 10px;
	margin: 10px 0;
	border: 1px solid #ccc;
	border-top-width: 5px;
	border-radius: 3px;
	border-top-color: #9954bb;
}

// gitalk config.
.gitalk_title {
    display: inline-block;
    padding: 0 15px;
    color: #0a9caf;
    border: 1px solid #0a9caf;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    // float: left;
}
.gitalk_title:hover {
    color: #fff;
    background: #0a9caf;
}
.gitalk_container {
    margin-bottom: 50px;
    border-bottom: 1px solid #e9e9e9;
}

$shadowColor	  = #333
$themeColor       = #222
$link-image-size-width   = 180px;
$link-image-size-height  = 230px;

.link-body{
	ul{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;

		.link{
			max-width: $link-image-size-width;
			min-width: $link-image-size-width;
			max-height: $link-image-size-height;
			min-height: $link-image-size-height;

			position: relative;
			box-shadow: 0 0 1px $shadowColor;
			magin: 6px;
			width: 20%;
			list-style: none!important;
			overflow: hidden;
			border-radius: 6px;
			img{
				object-fit: cover;
				transition: transform .6s ease-out;
				vertical-align: middle;
				border-bottom: 4px solid #eee;//#e5642b;
				transition: 0.4s ;
				width: 100%;
				border-radius: 90px 90px 90px 90px;
				display: inline-block;
				float: none;
				vertical-align: middle;
			}
			.link-name{
				position: absolute;
				bottom: 53px;
				width: 100%;
				color: #666;
				text-align: center;
				//text-shadow: 0 0 1px rgba(0,0,0,.4);
				background: rgba(255,255,255,.8);
			}
			.link-name-below{
				position: absolute;
				bottom: 0;
				font-size: 13px;
				font-weight: 300;
				margin: 0 0 15px;
				line-height: 13px;
				width: 100%;
				color: #666;
				text-align: center;
				//text-shadow: 0 0 1px rgba(0,0,0,.4);
				//background: rgba(255,255,255,.7);
			}
			&:hover{
				img{
					overflow: hidden;
					//transition: 0.4s;
					border-radius: 0 0 0 0;
				}
				.link-name{
					color: $themeColor;
					font-weight: bold;
					text-align: center;
					//text-shadow: 0 0 1px $themeColor;
				}
			}
		}
	}
}
// adjust the position of gitter
.gitter-open-chat-button {
      right: 20px;
	  padding: 10px;
	  background-color: rgba(45,45,45,0.80);
	  color: rgba(255,255,255,0.75)
}
@media (max-width: 600px) {
    .gitter-open-chat-button,
    .gitter-chat-embed {
        display: none;
    }
}
@media screen and (min-width:1200px) {

    body {
	background:url(/images/50.jpg);
    background-repeat: no-repeat;
    background-attachment:fixed;
    background-position:50% 50%;
    }

    #footer {
        color:#c8c8c8;
    }
}
#coding:link,#coding:visited{
	color: rgb(153,153,153);
	//font-weight: normal;
	text-decoration: none;
}

#coding:hover,#coding:active{
	color: rgb(153,153,153);
	text-decoration: none;
}
```

## 参考

[主题优化](https://reuixiy.github.io/technology/computer/computer-aided-art/2017/06/09/hexo-next-optimization.html)

