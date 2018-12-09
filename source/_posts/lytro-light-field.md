---
title: Lytro的光场AR之路：从巅峰到死亡
tags:
  - 光场
  - 计算成像
  - Light Field
comments: true
categories: 光场
copyright: false
abbrlink: 24433
date: 2018-03-23 09:57:02
---

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/lytro_cover.jpg" width =1000px>

{%note success%}

这篇文章将会介绍Lytro公司在光场以及VR领域的进展。我们知道NG博士在06年创办了这家公司，曾经被誉为硅谷最优潜力的公司之一。它曾经推出了世界上第一款商用的手持式光场相机，进而推出了第二代产品。但是低调的Lytro已经许久不出现大众的视野中，难道是盛名之下其实难副？
<span id="inline-red">声明</span>：<u>**一切理解都是本人观点，如有疑问，还望在**评论**中留言。如需转载请与本人联系，谢谢合作**</u>! 邮箱：[点我](/about)
{%endnote%}

<!-- more -->


其实不然，原来人家在搞大事情，Lytro公司在用光场技术搞AR！


## 6自由度
言归正传，提到AR首先讲下自由度的概念。人类在地球上的运动可以由6自由度来描述。6自由度描述了一个人在空间中的自然运动，6自由度会比3自由度提供两倍的自由度感受空间！具体而言，前三个自由度是大多数VR都支持的围着轴的旋转运动，后三个是沿着轴向的平移运动，这需要配套的位置跟踪设备的支持，如Oculus Rift, HTC Vive 或者Playstation VR。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/6DOF_Lytro_Color_Version-930x1024.jpg)

接下来，详细介绍一下这六个神奇的自由度到底包括哪些。你想或者不想，我们每天都在6个自由度（6DoF）里运动着。

### Yaw（平摇）

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Yaw.gif" width=1000px>

### Pitch（俯仰）

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Pitch.gif" width=1000px>

### Roll（翻滚）

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/roll.gif" width=1000px>

### Left/Right（左右）

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/left-right.gif" width=1000px>

### Up/Down（上下）

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/updown.gif" width=1000px>

### Forward/Backward（前后）

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Forward-Backward.gif" width=1000px>

## 光场与AR

我们生活在一个充满光明的世界，无论是自然光还是人造光，光无时无刻不照普照大地。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/LF_Volume_Video_ScreenGrab_900W-1-678x381.png" width=1000>

光的定向传播会照射在我们周围的物体表面，从而物体才能够显示出其纹理特征。即使是在虚拟的环境中，光场也可以通过计算机图形学(CG)的模拟光线通过在虚拟场景中反射3D对象来进行创建。在光场的所有无限光线中，我们只能看到那些照在我们眼睛上光线，这些光线穿过瞳孔打在视网膜上从而让我们感知光线的存在。对于这些光线，我们的眼睛会根据光的刺激产生某种神经信号，这些信号中包括光线的颜色，强度以及方向等信息。我们的大脑正是通过这些信号来感知大千世界。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Screen-Shot-2016-09-28-at-11.17.02-AM.png" width=1000px>

当我们在光场中移动时，不同的光线会通过我们的瞳孔，给我们的大脑提供额外的信息，使我们能够理解物体在空间中的位置，同时也会了解物体的其他信息例如：材质、反射、折射等等。

### 记录光线角度/方向

为了捕获和再现光场，需要记录**光线的颜色及其路径（方向/角度）**。确定光线的颜色和亮度很简单，那么问题在于如何记录光线的方向/角度。在一个光场内捕获的2D图像中的任何像素（实际动作或被渲染），可以提供与该像素所有相交光线的颜色和亮度信息。这通常被称为“光束”（所有的光线被一个像素捕获），但为了简单起见，我们将使用术语“光线”来描述由光线捕获的光线单个像素。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Light_Field_two_planes_FINAL-1024x802.png" width=1000px>

那么如何记录光线的角度和方向呢？目前已经有很多种记录光线的角度和方向路径的技术，但这些技术都需要至少两个点来确定实际的方向/角度。一种常见的方法是使用**双平面法**（2PP）来计算光线路径。光线穿过两个平面并相交于两点，利用这两个交点，可以确定射线的角度和方向。

### 视差

**视差也是记录光场的比较常用的技术**。通过计算两个或者多个相邻相机之间拍摄的2D图像的差异可以得到视差信息。这些2D图像是由场景中物体光的颜色亮度组成的彩色像素组成。通过对一系列图像的显著特征进行三角测量，同时比较图像之间像素间的视差，可以计算出各个物体在空间中的位置和距相机的距离（深度）。这种方式可以从2D数据恢复光场。对3D场景的计算机图形渲染，通常会提供对象与摄像机的距离（深度信息），并作为渲染过程的一部分。在以下场景中，我们使用三个相邻的相机对苹果和橘子进行记录。每个单独的相机从不同的位置记录该场景，这会产生图像之间的差异（视差）。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Disparity_Light_Field_A_FINAL-1024x896.png" width=1000px>

每个2D图像是一组彩色像素的集合，仅仅表示场景中苹果和橙色表面的颜色和亮度。视差必须通过分析这些2D图像之间的差异得到。
<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Disparity_Light_Field_B_FINAL-631x1024.png" width=1000px>

利用三个2D图像之间的视差，可以确定苹果和橘子在空间中的位置以及与三个视点之间的距离。随后经过处理的光线角度和颜色信息会记录在光场体（Light Field Volume）中。在VR中，光场体能够为我们提供沉浸式的高质量视觉体验。为了能够达到这个水平，光场体验需要囊括多种视觉效果。例如每个方向上的完美立体感，光场体的全视差和六个自由度，以及正确的场景流，以实现视觉相关效果（镜面反射和折射）。光场无论在实景动作还是计算机渲染，都可以产生最为优秀的VR电影体验。

## 光场VR设备

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Tracing-Explanation-Hero-678x381.png" width=1000px>

### Lytro VT

不安分的Lytro最近发布了名为“Lytro Volume Tracer”(Lytro VT)的产品，它作为一套强大的工具可以用于CG 3D场景的光场体的创建，同时能够为用户提供视觉高质量以及完全沉浸式的VR体验。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/vr1.jpg" width=1000px>

Lytro VT可以使用任何DCC和渲染引擎（例如Maya和VRay）来生成一组3D场景的2D采样。首先，Lytro VT将虚拟相机放置于CG场景中，虚拟相机包含场景中任何可能的视角，需要注意的是这些场景已经包含在定义好的光场体中，并且虚拟相机可以根据需要调整以最大限度地提高显示质量和性能。渲染引擎用于追踪场景中的虚拟光线，并从设备中每个摄像头捕获一定数量的2D图像样本。Lytro VT通过追踪从每个被渲染的像素到其相机的原点的光线(光积跟踪)来创建**视觉体**，通过以上神操作就可以感受到沉浸式的光场VR体验。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/10x10x10_Sequence_700px_copyright_2018.gif)

以上是由**1000个视点组成的视觉体**（图片加载慢，24.74M）。在该视觉体中，VR HMD中的观看者可以体验具有最高级别的光线追踪光学效果，每个方向上完美的视差以及六个自由度（6DOF）的重建虚拟场景。

光线跟踪的样本包括对**颜色和深度信息（RGBZ等数据）的跟踪**。摄像机的数量及其配置取决于场景的视觉复杂程度以及播放过程中所需视图的预定大小。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/devices.jpg" width=1000px>

Lytro VT处理来自于该2D样本的颜色以及深度信息，并通过Lytro Player创建用于在VR中展示的光场体。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Tracing-Explanation-1-copyright-2018-1024x697.png" width=1000px>

该3D场景中的视图体由白色立方体表示。单个相机由绿色球体表示，它具有自己单独的视点。虚拟的Lytro VT摄像机包含有成百上千个独立的摄像机。2D场景样本渲染使用虚拟装备中每个独立像机进行光线追踪。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Tracing-Explanation-Close-Up-2-copyright-2018-1024x697.png" width=1000px>

以上是一个相机跟踪的来自于场景中5个不同位置的光线的局部放大图，通过对每个独立相机进行光线跟踪就可以重建光场。

### 光线追迹

在将来，Lytro VT与渲染可以和并为一个无缝过程，允许光场直接进行光线跟踪，而不需要2D图像样本的中间步骤。然而这是需要代价的，这一过程需要很强的渲染器集成，并且要放弃这个如今如此灵活的Lytro VT。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/lytro_vt.jpg" width=1000px>

作为从虚拟3D场景创建真实2D图像的渲染技术，光线追踪能够产生极高质量的图像。用最简单的术语来说，基于模拟光线与3D场景中的物体表面的相互作用，反映在2D图像平面就是被渲染的彩色像素。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/vr_experience.jpg" width=1000px>

光线追踪适用于精确渲染某些光学效果，例如如反射，折射和散射（光度），但这些需要大量的计算时间。具有全光学效果的光线追踪对于实时帧率而言简直太慢。但是不得不说，光线追踪非常适合需要最高级别图像质量并可以脱机的应用，如电影视觉效果。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/Raytracing-copyright-2018-1024x729.png" width=1000px>

上图为光线跟踪的过程：**通过虚拟相机的视角可以看到，虚拟相机跟踪到了物体与物体之间的光线反复反射，并最终到达光源的位置**。如果有些物体遮挡了光线，那么就会产生被遮挡的光线。这种技术的计算效率很高，因为它只需追踪相机通过虚拟镜头看到的光线路径。Lytro VT和光线追踪是相辅相成的，然而在光线追踪的概念方向上形成对比。如上所示，光线跟踪通过跟踪从固定摄像机向外看光线的路径，从而呈现图像中的彩色像素。**相反，Lytro VT通过从一个视觉体内的每个视点向内朝着观察者，去追踪来自每个渲染像素的光线来重建光场体**（这句话翻译的不佳，原因是我没太理解VT与光线跟踪的区别...有大神能够理解的话，请在评论区给出）。于是在Lytro Player中，观众在这些密集的光线的移动，沉浸在具有最高级视觉质量的重建CG场景中，并且在每个方向都具有完美的视差和六个自由度。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/cinema.jpg" width=1000px>

在这种体验中，光线不是实时呈现，而是从大量预先渲染的光线中实时获取，为视图体积内每个位置的每只眼睛组成一张图像。

PS: Lytro公司在2017年11月30号之后停止了对lytro live photo的线上支持，其相机业务至此告一段落。通过光场VR转型，不知Lytro能否再次创造辉煌？这里留下一个疑问，等待时间的检验吧！

## 从巅峰到倒闭

3月29日更新。

世界上第一个光场技术初创公司Lytro昨日发表声明，**正式宣布倒闭**！

看来时间并不允许Lytro继续存活，光场进阶之路就此截止了吗？早些时间就有传闻称Lytro即将倒闭，Google或将接盘。起因是Google早前公布了一款能够显示沉浸式VR场景的App，这种VR场景据说是由多摄像机采集得到，貌似用到了第三方公司的技术。有人猜测这个第三方公司就是Lytro，这是一家以光场技术著称的公司，它利用其光场采集设备获取场景深度，并将其利用到了VR技术之中。

但这只是猜测，并没有得到印证。有来源显示Lytro早前进行的属于“**资产抛售**”，抛售额度不超过**4000万美元**。也有人说，这个额度更低，不超过2500万美元。

<center><img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/lytro-light-field/omd.gif" width="600px"></center>
有可能接盘的公司包括Google，Facebook，Apple等。有知情人透露，Lytro内部员工已经陆续离职，与此抛售的还有Lytro公司的59项光场专利。这个抛售金额对于Lytro而言简直是低价销售，因为在其成立之初融资金额已经达到了2亿美元，并且到其2017年最后一次融资时已经达到了3.6亿美元！

投资者多是科技投资巨头，例如Andreessen Horowitz，富士康，GSV，Greylock，NEA，Qualcomm Ventures等。创业艰辛，Lytro同样面对。从2006年成立之初，Lytro就面临着创业圈共同面对的问题。**光场技术的硬件实现异常艰难，同时VR技术的发展并没有想像中那么快。同时，大型平台逐渐成为具有说服力的整合商，这是其发展的一大阻力**。

与此同时，Lytro的推出的光场相机迷之昂贵，这是VR技术的重要技术支点，同时也成为了其发展中最大的短板。如今看来，Lytro完全有足够的时间和资金提供一个面向大众更具有说服力的报价，以等待在正确的市场条件下推出正确的产品。同时，Lytro公司应该考虑把光场应用到更加广阔的领域，例如无人汽车、智能导航、地图以及游戏等。


一年前Lytro CEO Jason Rosenthal 在其官方博客中写道：“我认为我们有能力重新定义下一代Lytro的产品线、技术以及品控”。仅仅时隔一年，此时或许该轮到Google来完成Lytro的雄心壮志了。虽然Google对Lytro具体有何企图不得而知，但是我们可以确定的是，借助Google这个世界上最大的移动手机系统提供商，如果光场技术能够成功整合，这将是科技界的一大奇迹！

以下是Lytro官方通告原文（大意是：我虽已死，光场犹存）：
{%note%}
At Lytro, we believe that Light Field will continue to shape the course of Virtual and Augmented Reality, and we’re incredibly proud of the role we’ve been able to play in pushing the boundaries of what’s possible. We’ve uncovered challenges we never dreamed of and made breakthroughs at a seemingly impossible pace. We’ve had some spectacular successes, and built entire systems that no one thought possible. More importantly, we built a team that was singularly unified in its focus and unrivaled in its dedication. It has been an honor and a pleasure to contribute to the cinema and Virtual Reality communities, but starting today we will not be taking on new productions or providing professional services as we prepare to wind down the company. We’re excited to see what new opportunities the future brings for the Lytro team as we go our separate ways. We would like to thank the various communities that have supported us and hope that our paths will cross in the future.

Lytro was founded in 2006 by Executive Chairman Ren Ng, whose Ph.D. research on Light Field imaging won Stanford University’s prize for best thesis in computer science. In late 2015, Lytro announced the world's first Light Field solution for Virtual Reality (VR), Lytro Immerge, that was quickly followed by the 2016 launch of Lytro Cinema, the world's first Light Field capture system for cinematic content. With these products, Lytro pioneered the generational shift from legacy 2D imaging to 3D volumetric video.
{%endnote%}
## 后记

光场民用领域的践行者离我们而去，不知光场的未来将何去何从？敢问Raytrix和Magic Leap你们可好？

## 参考

- [6DoF](http://blog.lytro.com/glossary/6dof/)
- [Holiday Edition: What Are the Six Degrees of Freedom?](http://blog.lytro.com/holiday-edition-what-are-the-six-degrees-of-freedom/)
- [What is a Light Field?](http://blog.lytro.com/what-is-a-light-field/)
- [Ray tracing, Lytro Volume Tracing and CG generated Light Fields in VR](http://blog.lytro.com/ray-tracing-lytro-volume-tracing-and-cg-generated-light-fields-in-vr/)
- [Primer on Types of 360° Video for VR](http://blog.lytro.com/primer-on-360-video-for-vr/)
- [Homepage: Techcrunch](https://techcrunch.com/)
