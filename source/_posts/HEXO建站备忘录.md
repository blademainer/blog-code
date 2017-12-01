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


## 主题设置
[Make the theme more beautiful, recommended](http://www.arao.me/)

Plus: 我使用的是[Next](http://theme-next.iissnan.com/)主题


## 关于多说
多说已死，~~评论系统转到了Disqus，但是被墙的事实让人感觉不爽~~。几经周折，从多说转到Disqus，然后在gitment和gitalk之间徘徊，最后还是选择了[valine](https://valine.js.org/#/)，不过它只能在中国区进行评论，于是我还是保留了gitalk。于是我总结出来我属于爱折腾的那种人。

## 关于旋转头像

把侧边栏头像变成圆形&鼠标停留在上面出现旋转效果，具体修改文件的位置是`next\source\css\_common\components\sidebar\sidebar-author.styl`中的内容如下：

``` styl
.site-author-image {
  display: block;
  margin: 0 auto;
  max-width: 96px;
  height: auto;
  border: 2px solid #333;
  padding: 2px;

  /* start*/
  border-radius: 50%
  webkit-transition: 1.4s all;
  moz-transition: 1.4s all;
  ms-transition: 1.4s all;
  transition: 1.4s all;
  /* end */
}
/* start */
.site-author-image:hover {
  background-color: #55DAE1;
  webkit-transform: rotate(360deg) scale(1.1);
  moz-transform: rotate(360deg) scale(1.1);
  ms-transform: rotate(360deg) scale(1.1);
  transform: rotate(360deg) scale(1.1);
}
/* end */
```


## 背景动画设置

其实NEXT主题已经自带了几种动画了，我用的是three_waves；但是呢，存在一个问题就是因为Blog背景是透明的，这样文字和背景动画就有重叠效果了，很不方便阅读，这时把背景色设置为白色即可。添加**background: white**到如下路径`next\source\css\_schemes\Muse\_layout.styl`
```styl
.header-inner, .container .main-inner, .footer-inner {
  background: white;
  +mobile() { width: auto; }
}
```

重新编译即可。

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

## 设置主题远程仓库
这时你会发现`themes`这个文件夹并没有同时被上传到远程仓库，同上操作，将`theme/next`设置成本地仓库并部署。之所以将这个仓库单独上传，是为了方便切换主题，以及主题升级。

## 设置node_modules远程仓库
之所以将这个模块单独拎出来处理，是因为这个文件夹虽然容量不大，但是其中文件个数特别多。当和blog源文件一同被`git add`到暂存区之后，git shell的运行速度就会超慢。我的解决思路就是将其创建成一个仓库，这样git shell的速度就会快一些。具体步骤不再赘述，同上。

## 结语
经过建立以上的3个仓库，实现了blog源码级别的版本管理。当然，如果你不想暴露自己的源码，那么你只需要在coding申请一个私有仓库并部署就ok了。虽然看起来有些麻烦，但是一旦配置完毕之后，我们就只需要以下几个步骤就可以实现管理。
``` bash
hexo clean  # 不是必要步骤
hexo d -g   # 渲染+部署到github page以及coding page
git add .   # 添加到暂存区
git commit -m "your message" # push到本地仓库
git push    # 上传到远程仓库（站点目录、next主题目录、node_modules目录）   
```
Good luck:)




