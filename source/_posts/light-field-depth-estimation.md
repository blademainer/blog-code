---
title: Light Field Depth Estimation
tags:
  - depth estimation
  - light field
comments: true
categories: 计算机视觉
copyright: false
mathjax: true
abbrlink: 6884
date: 2018-05-16 13:35:54
sticky: 1001
---
先占个坑，本文将介绍光场领域进行深度估计的相关研究。
In this post, I'll introduce some depth estimation algorithms using Light field information. Here is some of the [code](https://github.com/Vincentqyw/Depth-Estimation-Light-Field).

<!--more-->

研究生阶段的研究方向是光场深度信息的恢复。再此做一些总结，以便于让大家了解光场数据处理的一般步骤以及深度估计的相关的知识。

## 什么是光场？
提到光场，很多人对它的解释模糊不清，在此我对它的概念进行统一表述。它的故事可以追溯到1936年，那是一个春天，Gershun写了一本名为**The Light Field**[^1]的鸿篇巨著（感兴趣的同学可以看看那个年代的论文），于是光场的概念就此诞生，但它并没有因此被世人熟知。经过了近六十年的沉寂，1991年Adelson[^2]等一帮帅小伙将光场表示成了如下的7维函数：
$$
P(\theta,\phi,\lambda,t,V_x,V_y,V_z).
$$
其中$(\theta,\phi)$表示球面坐标，$\lambda$表示光线的波长，$t$表示时间，$(V_x,V_y,V_z)$表示观察者的位置。
可以想象假如有这样一张由针孔相机拍摄的黑白照片，它表示：我们从**某个时刻**、**单一视角**观察到的**可见光谱**中某个**波长**的光线的平均。也就是说，它记录了通过$P$点的光强分布，光线方向可以由球面坐标$P(\theta,\phi)$或者笛卡尔坐标$P(x,y)$来表示。对于彩色图片而已，我们要添加光线的波长$\lambda$信息即变为$P(\theta,\phi,\lambda)$。按照同样的思路，彩色电影也就是增加了时间维度$t$，因此$P(\theta,\phi,\lambda,t)$。对于彩色全息电影而言，我们可以从任意空间位置$(V_x,V_y,V_z)$进行观看，于是其可以表达为最终的形式$P(\theta,\phi,\lambda,t,V_x,V_y,V_z)$。这个函数又被成为全光函数（Plenoptic Function）。
但是以上的七维的全光函数过于复杂，难以记录以及编程实现。所以在实际应用中我们对其进行简化处理。第一个简化是单色光以及时不变。可分别记录3原色以简化掉波长$\lambda$，可以通过记录不同帧以简化$t$，这样全光函数就变成了5D。第二个简化是Levoy[^3]等人（1996年）认为5D光场中还有一定的冗余，可以在自由空间（光线在传播过程中能量保持不变）中简化成4D。

### 光场参数化表示
参数化表示要解决的问题包括：1. 计算高效；2. 光线可控；3. 光线均匀采样。目前比较常用的表示方式是双平面法（$2PP$）[^3]，利用双平面法可以将光场表示为：$L(u,v,s,t)$。其中$(u,v)$为第一个平面，$(s,t)$是第二个平面。那么一条有方向的直线可以表示为连接$uv$以及$st$平面上任意两点确定的线，如下图所示：
![](http://oofx6tpf6.bkt.clouddn.com/2pp-v1.png)
【注】：Levoy[^3]首先利用双平面法对光场进行表示，光线首先通过$uv$平面，然后再通过$st$平面。但是后来（同年）Gortler[^4]等人将其传播方向反了过来，导致后续研究者对此表述并不一致。我们在本文中统一采用Levoy[^3]提出的表述进行展开。

### 光场的可视化

虽然光场由$7D$全光函数降维到$4D$，但是其结构还是很难直观想象。通过固定4D光场参数化表示$L(u,v,s,t)$中的某些变量，我们可以很容易地对光场进行可视化。我们通常认为$(u,v)$控制着某个视角的位置，即相机平面；而$(s,t)$控制着从某个视角观察到的图像。说简单点：$uv$控制角度分辨率，$st$控制空间分辨率。
<img src="http://oofx6tpf6.bkt.clouddn.com/uvst2images.png" width="600" alt="uvst2images">
接下来讲解，几种常见的可视化方式（图片来源[^5]）。首先是**多视图法**。很容易理解，对于最简单的情况，首先固定$u=u^*,v=v^*$，我们可以得到多视角的某个视图$L(u^*,v^*,s,t)$，如下图所示：
![](http://oofx6tpf6.bkt.clouddn.com/allviews.png)
第二种表示方法是**角度域法**，通过固定$s=s^*,t=t^*$可以得到某个宏像素$L(u,v,s^*,t^*)$，如下图所示：
![](http://oofx6tpf6.bkt.clouddn.com/angular-patch.png)
第三种表示方法是**极线图法**，通过固定$v=v^*,t=t^*$可以得到极线图：$L(u,v^*,s,t^*)$，如下图中水平方向的图所示；同理固定$u=u^*,s=s^*$可以得到极线图：$L(u^*,v,s^*,t)$，如下图中竖直方向的图所示：
![](http://oofx6tpf6.bkt.clouddn.com/epi.png)

<!--![](http://oofx6tpf6.bkt.clouddn.com/lumigraph-pixel-image-plane.png)-->

【未完待续...】

## References
[^1]: Gershun, A. "The Light Field." Studies in Applied Mathematics 18.1-4(1939):51–151.

[^2]: Adelson, Edward H, and J. R. Bergen. "The plenoptic function and the elements of early vision. " Computational Models of Visual Processing 1(1991):3-20.

[^3]: Levoy, Marc. "Light field rendering." Conference on Computer Graphics and Interactive Techniques ACM, 1996:31-42.

[^4]: Gortler, Steven J., et al. "The Lumigraph." Proc Siggraph 96(1996):43--54.

[^5]: Wu G, Masia B, Jarabo A, et al. "Light Field Image Processing: An Overview." IEEE Journal of Selected Topics in Signal Processing, 2017(99):1-1.