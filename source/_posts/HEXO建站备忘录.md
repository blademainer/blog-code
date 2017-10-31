---
title: HEXO建站备忘录
comments: true
categories: 建站
tags:
  - hexo
  - 博客
  - 多说
abbrlink: 47877
date: 2016-08-09 12:37:42
---


<center>{% asset_img hexo.png %}</center>


**Hexo**作为建立Blog利器，为我们没有JS基础的小白们提供了建立专属自己博客的机会！经常使用的语法很简单，我们完全可以在10min分钟之内建立自己的Blog，后期的优化才是最耗费时间的。好了，直接进入正文。

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
多说已死，评论系统转到了Disqus，但是被墙的事实让人感觉不爽。我觉得吧，这样也好。能够翻墙的人总会发现不一样的世界，可能我们属于爱折腾的人吧。

## 关于旋转头像

把侧边栏头像变成圆形，并且鼠标停留在上面发生旋转效果，参考这里，具体修改文件的位置是..\hexo\themes\next\source\css\_common\components\sidebar\sidebar-author.styl中的内容如下

``` js

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

其实NEXT主题已经自带了几种动画了，我用的是three_waves；但是呢，存在一个问题就是因为Blog背景是透明的，这样文字和背景动画就有重叠效果了，很不方便阅读，这时把背景色设置为白色即可。添加**background: white**到如下路径**E:\Blog-new\themes\next\source\css\_schemes\Muse\_layout.styl**

```js
.header-inner, .container .main-inner, .footer-inner {
  background: white;
  +mobile() { width: auto; }
}
```

重新编译即可。

## MarkDown编辑器

推荐**Haroopad**

<center>{% asset_img 100.png Haroopad%}</center>


## 插入图片以及PDF文档
1. 利用js嵌入图片
    ``` js
    <img src= image_path alt="Lytro相机" width="100%">
    <center>Lytro</center>
    ```
    注意以上的`image_path`既可以是图床中的路径，亦可以把图片放在`source/images/`文件下，然后`image_path=/images/logo.png`，当然也可以如下插入图片，更加方便。
    ``` js
    ![](/images/logo.png)
    ```
2. 利用插件，以下我在Github上找到的别人已经做好的一个小公举。

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






