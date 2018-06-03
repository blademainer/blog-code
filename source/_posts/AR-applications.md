---
title: AR形势与应用
comments: true
categories: AR
tags:
  - AR
abbrlink: 35408
date: 2016-08-09 12:37:42
---

![](http://oofx6tpf6.bkt.clouddn.com/AR.jpg)

# 前言
<p ID="div-border-left-red">当前，微软、谷歌、苹果、Facebook 等 IT 巨头都在布局虚拟现实Virtual Reality简称 VR）虚拟现实也许是下一个颠覆人类生活的新技术之一。增强现实Augmented Reality简称 AR）是虚拟现实技术的延伸它可以用来模拟对象让学习者在现实环境背景中看到虚拟生成的模型对象 而且这一模型可以快速生成、操纵和旋转。</p>

<!-- more -->

## 1．增强现实公司分类
Augmented reality增强现实创业的公司大致可以分成如下几种公司类型[1]。（以下是翻译的国外网站的内容）

-	AR平台公司（AR platform companies）。
这些公司为开发者提供底层的开发工具，以便于开发者能够创造更多更加高级的AR解决方案。这样的公司有：Qualcomm Vuforia, METAIO’s SDK, TotalImmersion。
-   AR产品和游戏公司。
这些公司主营自己独家AR零售产品例如：书籍、游戏。包括如下公司：Sphero, POPAR, Sony, Microsoft 以及 Nintendo。
-	自助DIY AR公司以及通用AR查看器。
这些公司专为快速简单的AR体验或活动而设计，提供内容管理工具和基本AR效果菜单。借助自助AR工具，精通技术的个人可以创建简单的体验，例如发布单个视频或简单的动画。AR自助服务公司非常适合发布商，教育工作者，学生和其他想要测试或创建简单的增强现实体验的用户，而无需投资于完全定制的品牌应用体验。一些DIY公司还提供AR查看器，定制服务和白标签选项。这个领域的公司包括Layar，Aurasma，DAQRI和Zappar。
-	定制品牌应用开发公司。
这些公司直接与品牌营销人员和机构合作，主要为的广告活动、贸易展览和现场活动构建定制的增强现实解决方案。自定义品牌应用程序允许营销人员结合独一无二的定制增强现实体验与个性化服务和项目管理。自定义功能通常包括品牌规格，导航，用户界面，动画，复杂或大规模的AR效果等。服务可以包括3D建模，与其他软件服务或电子商务平台的集成，游戏开发，基于位置的安装，通知，复杂动画，微位置或其他高级AR效果。这个领域的公司包括Appshaker，GravityJack和Marxent。
-	行业特定的垂直AR解决方案（Industry-specific vertical AR solutions）。
最新出现的AR公司类别是那些提供AR解决方案的专业服务公司，专为服务于专业领域。如奢侈品零售，医疗服务，工业应用，制药公司和化妆品公司。这个领域的公司包括用于广告的Blippar，用于豪华珠宝零售的Holition，用于家具布置的Adornably以及用于消费零售，工业和企业销售工具的Marxent的VisualCommerce®。

做个不恰当的比喻，我觉得AR是VR的一个延伸，只是把VR的场景换成了现实场景，眼镜换成了透明的。

## 2．可行性分析
一个良好的AR体验，大致可以分成一下几个方面：
- 1．	3D眼镜；这应该是VR或者AR最为重要的一部分；
- 2．	手柄；可以代替人手去操纵，在一定程度上增加了使用的灵活性。（但我觉得未来手柄一定会被淘汰，因为这只是人手不能被充分利用的代替手段）。
- 3．	3D显示屏幕，它可以跟踪用户的头的转动和手的动作，实时调整所看到的3D图像，并允许用户操控一些虚拟物体，就好比他们真正存在。
- 4．	待补充

###	技术难点
VR得益于三维游戏的发展，而AR收益于影视领域的跟踪技术（video tracking）的发展。从技术门槛的角度来说，VR、AR和移动端重合的技术有：显示器、运动传感器、处理器、储存、记忆、无线连接等。在硬件上，这些都不是技术难点。
VR、AR的难点都在感知和显示，感知是一种映射，VR 映射的是一个lighthouse的空间或者PS camera mapping的一个交叉；在显示上，VR如何精准地匹配用户的头部产生相应的画面，AR则在这基础上算出光照、遮挡等情况并让图像通透不干扰现实中的视线。
而VR硬件的难点在于光学的镜片技术和位置追踪技术（SLAM），因为以前的移动端不涉及这些技术。AR的软件难点在于：1、定位相机；2、恢复场景的三维结构。通常情况下，这一技术被称作SLAM（Simultaneous Localization And Mapping）。当然还有一些其他的技术诸如：图像追踪、云端视觉搜索、人脸和表情追踪等。

目前国内外已经有多家技术公司提供了软件开发方面的AR解决方案和工具，使得全球众多开发者参与到AR应用开发中来。开发者不需要自己搭建系统架构，也不用理解底层SDK复杂的实现方式，只需要将AR模块嵌入到已有的业务逻辑中，就可以通过现成的开源代码或者平台工具，设计并开发属于自己的AR软件产品。就这个层面来讲技术是可以实现的，但就某一个特殊领域的实现方式可能有所差别。

###	技术支持
Metaio 是由德国大众的一个项目衍生出来的一家虚拟现实初创公司，现已被苹果公司收购。 专门从事增强现实和机器视觉解决方案，产品主要包括Metaio SDK 和 Metaio Creator。 Metaio SDK 支持移动设备的AR应用开发，它在内部提供增强现实显示组件ARView，该组件将摄像机层、3D 空间计算以及POI信息的叠加等功能全部封装在一起，用户在使用增强现实功能时，只需要关注用户操作的监听器即可，摄像机层、3D 空间计算、图形识别以及空间信息叠加等逻辑，完全由ARView组件自己处理 。Metaio Creator相对Metaio SDK 来说，使用门槛更低，用户无需掌握移动开发技术，就可以通过 Metaio Creator 用户图形接口中简单的点击、拖拽、拉伸等方式，控制软件中组件的功能，以构建出自己的增强现实结果。（但是被苹果收购了，目前不提供服务）

![图一Wikitude 官网界面](http://oofx6tpf6.bkt.clouddn.com/160405_WT_HomeSlider_Image_3D-Tracking.png)

Wikitude 是由美国 Mobilizy 公司于 2008 年秋推出的一款移动增强现实开发平台， 支持 Android、 iOS、Black Berry 以及 Windows Phone 多个手机智能操作系统Wikitude SDK 是一款优秀的增强现实开发工具包， 它能够帮助开发人员减小增强现实应用程序开发的复杂性。 目前，Wikitude SDK 支持载入真实的物理环境向 AR 环境中添加虚拟物体、支持用户与虚拟物体的交互、响应用户的位置变化、AR 环境中信息提示、从本地或网络加载资源等功能。

<img src="http://oofx6tpf6.bkt.clouddn.com/wakingapp.jpg" width=1000px>

ENTiTi Creator是由以色列一家创业公司 Waking App 开发的一款 AR 作品制作工具，易学易用是它的最大特色。用户可以使用ENTiTi平台上传图片和视频以及相应的动作指令， 并通过简单的逻辑串联，就可以轻松创建出包含3D图像、动画或者游戏的AR/VR 内容。该平台不需要任何编程、完全依靠鼠标拖放就能完成整个创建过程。EN-TiTi是基于云计算的平台，可以在线 3D 视角查看内容，并自动适配各种终端，比如，手机或平台电脑、三星 Gear VR 盒子、Vuzix 智能眼镜等。开发者通过它所发布出来的AR内容，只需要通过一个叫作 EN-TiTi View 软件的入口，就可以轻松访问。 这意味着全球所有开发者所开发出的成千上万的 AR 内容，只需要一个软件即可全部浏览。

<center><img src="http://oofx6tpf6.bkt.clouddn.com/realmax.jpg" width=1000px></center>

Realmax公司是一个国际化AR生态级企业，在上海、香港、纽约、慕尼黑都设立了分公司，并建立了5个全球实验室，完成了硬件量产、软件算法、应用开发和内容制作的AR技术储备，AR操作系统“Realcast”也有可观的用户量，在工业、幼教、电商、旅游等领域积累了大量客户，是AR领域唯一的一家完成“平台+内容+终端+应用”生态链布局的企业。


根据以上分析，如果想完成某一个特定的AR或者VR应用，可以使用上述公司提供的SDK，在一定程度上会加快开发速度。
***
## 参考文献
1．	增强现实公司类型：http://www.marxentlabs.com/augmented-reality-company-primer-5-types-augmented-reality-companies/
2．	Metaio公司主页：http://www.metaio.eu/
3．	AR技术举例以及现有公司介绍：http://www.marxentlabs.com/what-is-virtual-reality-definition-and-examples/。
4．	Layer公司AR开发SDK：https://www.layar.com/solutions/#sdk
5．	Wikitude官网：http://www.metaio.eu/index.html
6．	ENTiTi Creator 官网：http://www.wakingapp.com/
7．	Realmax公司官网：http://www.realmax.com/或者http://www.realmax.com.hk/






<!-- more -->




