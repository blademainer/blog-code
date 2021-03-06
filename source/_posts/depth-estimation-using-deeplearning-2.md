---
title: 深度学习在深度(视差)估计中的应用(2)
tags:
  - Deep Learning
  - depth estimation
  - disparity
  - DispNet
comments: true
mathjax: true
abbrlink: 29504
date: 2017-12-10 17:07:19
---


![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/wonderwomanv3.jpg)

{% note success %}
最近一段时间一直痴迷于如何将深度学习用于深度估计，看了不少关于该方面的介绍，再次做一个简单的总结。虽说`深度学习`和`深度估计`都有`深度`二字，但是其意义确是完全不一样。一个是`deep`一个是`depth`，前者表示网络层纵向的延伸度，后者表示三维场景中物体距离摄像头的距离。这两个差异如此之大的名词是如何结合在一起的呢？且听我慢慢解释。
{% endnote %}
<!--more-->

深度学习的历史在此不做介绍，我们只关心深度学习在深度估计的方面的成果。在开始之前要到一个著名的网络**[FlowNet](https://lmb.informatik.uni-freiburg.de/Publications/2015/DFIB15/)**，这是*Dosovitskiy*等人发表在**ICCV2015**上的作品。这篇文章其实就是做了两件事情：1. 建立了两种结构的FlowNet；2. 建立了一个虚拟场景训练集（Flying Chairs）。最后的测试效果还不错，虽说仅仅在这个数据集上进行了训练，但是泛化能力能够达到业界水平。

## FlowNet
首先大体看一下这个可以end-to-end训练的网络长得如何，如下图所示：对于输入的图像对，依次经过一个收缩（contractive）网络以及放大（expanding）网络，最后输出得到对应的光流。很难想象CNN可以用来做classification的同时，也可以做到寻找图像之间的相关信息。作者这么做的目的就是为了验证CNN这种强大的特性。原话如是说“*The idea is to exploit the ability of convolutional networks to learn strong features at multiple levels of scale and abstraction and to help it with finding the actual correspondences based on these features*”。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/flow-net-structure.png" width=60% alt= "A Encoder-Decoder Network for Disparity Estimation">

接下来就是网络的设计环节，首先作者回顾了之前的网络设计策略。一种是最简单的“sliding window”方式，但这种方式的缺点在于计算量很大，它使用了各种优化包括重用网络的临时输出；另外一种对各个层的临时输出做上采样到全分辨率，然后将这些图叠起来，这行对于每一点而言，都能够得到相应的多级特征向量，这个向量可用来学习想要的信息。

### Contrasting Part
作者受到“per-pixel prediction tasks”的相关工作的启发，设计了两种光流网络框架。一种是相对简单的实现：首先将输入的图像对叠加起来作为输入，然后输入一个网络，让网络自己学，最后提取运动信息。
![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/flownet-simple.png)

另外一种方式就是将输入的图像pair（左图&右图）分开训练，提取出高维丰富的信息之后再做相关性连接，即增加了`correlation layer`。
![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/flownet-corr.png)
这个correlation layer是为了衡量左右图相应位置的相似度而设置的。一个的很直观地理解就是，在左图选取一个patch，同时在右图中的可能的位置选择同样大小的patch进行匹配运算(点积运算或者说是卷积运算)。
具体而言，分别在左右`feature map`（$f_1$和$f_2$）以$x_1$和$x_2$为中心的块之间进行卷积运算。`correlation`的定义如下：
$$c(x_1,x_2)=\sum_{o \in [-k,k] \times [-k,k]}{<f_1(x_1+o),f_2(x_2+o)>}$$

其中`$f_1$`和`$f_2$`的维度为`$w \times h \times c$`。可以看到计算一次$c(x_1,x_2)$需要$c \times K^2$次乘法，$K:=2k+1$。而对于所有的位置则需要$w^2 \times h^2 \times c \times K^2 $次乘法，可想而知，这个计算量是巨大的。于是作者为了减少运算量，对搜素窗口进行了限制，设置了最大的搜索半径为$d$，则$x_2$就能在窗口大小是$D=2d+1$里计算`correlation`了。另外值得一提的是，我们以上的过程是在计算光流信息，所以应该在某个**某个窗口**内进行匹配，而不是在某个方向，而后续即将提到的`DispNet`的 `correlation` 是在某一个方向上进行搜索。那么最后得到的`correlation`的维度是$w \times h \times D^2$。


<!--![](flow-net-simple-corr.png)-->

### Expanding Part
如下是优化网络的结构，大部分都是结合缩放阶段信息的**反卷积**操作。这里不再赘述，最后得到的结果图像大小是输入图像的$1/4$。

![refinement](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/refinement.png)

~~最后作者利用`variational approach`对低分辨率的输出做了20次迭代以得到高分辨率的光流图，之后又对全分辨率的光流图做了进一步优化。~~


很多深度估计的工作受到这一篇论文启发，特别是`correlation layer`实现了寻找图像对之间的相关性这一点，对于后续`DispNet`的诞生起到重要作用。其实`DispNet`就是在`FlowNet`的基础上进行的改进，接下来就会详细的介绍`DispNet`。

## DispNet

受到**FlowNet**的启发，另外一篇论文将光流估计拓广到了视差以及场景流的估计。2015年12月放在arxiv上的大作*[A Large Dataset to Train Convolutional Networks for Disparity, Optical Flow, and Scene Flow Estimation](https://arxiv.org/abs/1512.02134)*便是具体代表性的作品。这篇文章有两个主要贡献：

1. 建立了三个仿真视差数据集（3 stereo video datasets），这是当时第一个超大规模的用于视差以及光流场景流训练以及评估的数据集；
2. 设计了**DispNet**，**SceneFlownet**。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/disp-flow.png" width=50% />

### 开篇
文章一开始就说估计场景流这个问题，堪称“皇家赛事”级别的任务（场景流是估计空间三维物体的运动场，相比于光流多了一个深度信息）。然后又提到没有好的数据集无法做到完美的训练，那么这么好的数据集又不是天上掉下来的，那只能自食其力，自力更生，自己造吧，于是他们的超大规模（**35000** stereo frames）的数据集便成功诞生！
### 模型
参考了前方开创性的**FlowNet**工作之后，他们就把**FlowNet**改造成**DispNet**，真是华丽丽的变身。然后对于场景流模型的构建，作者提到：虽然在以往的成千上万的论文中均有涉及到光流的估计，但是仅仅有极少数的工作敢去尝试估计场景流。然后作者就是厉害，他们足够相信CNN具有强大的学习与抽象能力，能够通过某种方式的组合使场景流的估计问题转化成为学习问题。文中提到“相机无关的场景流的学习可以转化成视差，光流以及光流变化学习问题”，于是在实际上文中提到的**SceneFlownet**就是**FlowNet**与**DispNet**的组合。以下重点介绍**DispNet**的实现。

### DispNet & DispNetC

![dispnet](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/dispnet.png)
收缩部分从conv1到conv6b；在放大部分，upconvolutions (upconvN), convolutions (iconvN, prN)和loss layers是交替出现的。从低层提取的特征与高层的特征进行串联，增加特征的多样性。最后的网络输出是pr1。

二者与*Dosovitskiy*提出的**FlowNet**两种结构差不多，总结起来共有3个变化：
1. 对原来的**FLowNet**进行了改造，在上卷积层之间增加了卷积层，这样可以使得最终的深度图像更加的平滑；
2. 将原来的`2D correlation` 改造成了`1D correlation`；并且发现加入`correlation` 层之后会有普遍的效果提升；原因在于左右图均进行了`rectify`，基于极线约束，我们就可以在一个方向进行搜索。所以类似于`FlowNet`，我们得到的`correlation` map的大小是$D \times w  \times h$。
3. 放大部分比Flownet多做了一次deconv，使输出为原来的$1/2$。
注意：DispNet对应于FlowNet的第一种实现，DispNetC对应于FlowNet的第二种实现；

### 数据增强
虽然文中提出了一个超大的数据集，但是仍然需要一定的数据增强以获得更加多样的训练数据。具体方法：空间变化（旋转，变形，裁剪，缩放），色度变换（颜色，对比度，明暗）。

### 结果
![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/dispnet-res.png)
文中比较了Zbontar&LeCun的[MC-CNN](https://github.com/jzbontar/mc-cnn)以及opencv中**SGBM**方法。**DispNet**是在`FlyingThings3D`数据集上做得训练，然后在`KITTI 2015`数据集上做了优化，注意“K”表示优化之后的网络。

## 其他网络

To be continued, more depth net pls refer to this [link](https://sites.google.com/site/yorkyuhuang/home/research/machine-learning-information-retrieval/disparityestimationbydeeplearning).

## 问题
- 此处对`correlation`的理解还不透彻;
- 待补充其他类型深度/视差估计网络；

## Change Log

- 添加了对`correlation`的解释。

## 参考

- [Homepage: Freiburg: Pattern Recognition and Image Processing](https://lmb.informatik.uni-freiburg.de/resources/binaries/)
- [Homepage: FlowNet: Learning Optical Flow with Convolutional Networks](https://lmb.informatik.uni-freiburg.de/Publications/2015/DFIB15/)
- [Paper: FlowNet](FlowNet-Learning-Optical-Flow-with-Convolutional-Networks.pdf)
- [Paper: A Large Dataset to Train Convolutional Networks for Disparity, Optical Flow, and Scene Flow Estimation](A%20Large%20Dataset%20to%20Train%20Convolutional%20Networks%20for%20Disparity,%20Optical%20Flow,%20and%20Scene%20Flow%20Estimation.pdf)
- [Github: Stereo matching by training a convolutional neural network to compare image patches](https://github.com/jzbontar/mc-cnn)
- [Blog: Disparity Estimation by Deep Learning](https://sites.google.com/site/yorkyuhuang/home/research/machine-learning-information-retrieval/disparityestimationbydeeplearning)
- [Paper: Unsupervised Adaptation for Deep Stereo](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/depth-estimation-using-deeplearning-2/Unsupervised%20Adaptation%20for%20Deep%20Stereo.pdf)
- [Code: Unsupervised Adaptation for Deep Stereo](https://github.com/CVLAB-Unibo/Unsupervised-Adaptation-for-Deep-Stereo)
- [Blog: 【论文学习】神经光流网络——用卷积网络实现光流预测（FlowNet: Learning Optical Flow with Convolutional Networks）](http://blog.csdn.net/hysteric314/article/details/50529804)
- [Blog: 论文阅读笔记之Dispnet](http://blog.csdn.net/kongfy4307/article/details/75212800)
