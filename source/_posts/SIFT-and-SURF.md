---
title: SIFT和SURF特性提取总结
comments: true
mathjax: true
categories: 计算机视觉

tags:
  - sift
  - surf
  - 特征提取
abbrlink: 7753
date: 2017-10-01 10:18:01
---

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/match_before_v2.png)

> SIFT（Scale-invariant feature transform）是一种检测局部特征的算法，该算法通过求一幅图中的特征点（interest points,or corner points）及其有关**scale** 和 **orientation** 的描述子得到特征并进行图像特征点匹配

<!--more-->

## 什么是SIFT

先看看上图利用sift进行匹配的结果：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/matches_adjust_contrast.png)

这个结果应该可以很好的解释sift的尺度、旋转以及光照不变性。接下来就介绍一下这个神奇的算法的奥义。我把代码放在了[Github](https://github.com/Vincentqyw/siftDemo)，感兴趣的同学自己下载下来试试。


### 算法描述
SIFT特征具有尺度不变性，旋转不变性，光照不变性。

### 实现流程

#### 构建尺度空间

尺度空间的目的是模拟图像的多尺度特性。
**高斯卷积核是实现尺度变换的唯一线性核**，于是 一副二维图像的尺度空间定义为：
$$
L(x,y,\sigma)=G(x,y,\sigma)*I(x,y)
$$
其中的`$G(x,y,\sigma)$`是尺度可以发生变化的高斯函数`$G(x,y,\sigma)=\frac{1}{2\pi{\sigma}^2}e^{-\frac{x^2+y^2}{2{\sigma}^2}}$`。`$(x,y)$`表示空间坐标，`$\sigma$`是尺度系数，描述了图像的模糊程度。
为了能够更为有效的提取出特征点，提出了DOG（高斯差分尺度空间）的概念。通过不同尺度下的高斯差分核与图像卷积形成：

$$
D(x,y,\sigma)=(G(x,y,k\sigma)-G(x,y,\sigma))*I(x,y) 
=L(x,y,k\sigma)-L(x,y,\sigma)
$$

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/scale_space.png)

图像金字塔的建立：为了实现尺度不变特性，对于每一幅图像`$I(x,y)$`，分成**子八度（octave）**，第一个子八度的scale为原图大小，后面每个octave为上一个octave降采样的结果，即原图size的1/4（长宽分别减半），构成下一个子八度（高一层金字塔）。此时要强烈注意size和尺度空间的概念。size是图像大小，而尺度空间表示不同`$\sigma$`的图像的集合。那么尺度空间的集合是：
$$
2^{i-1}(\sigma, k*\sigma,k^2*\sigma,k^3*\sigma,...,k^{n-1}*\sigma)
$$
其中的 `$k=2^{1/S}$`，`$S$`表示尺度金字塔每个octave的层数，`$n$`表示尺度金字塔的总层数，`$i$`表示的是在某个octave的第`$i$`层，`$i\in[1,2,3,...n]$`。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/DoG.jpg)

由图片size决定建几个塔，每塔几层图像(S一般为3-5层)。0塔的第0层是原始图像(或你double后的图像)，往上每一层是对其下一层进行Laplacian变换（高斯卷积，其中σ值渐大，例如可以是σ, k\*σ, k\*k\*σ…），直观上看来越往上图片越模糊。塔间的图片是降采样关系，例如1塔的第0层可以由0塔的第3层down sample得到，然后进行与0塔类似的高斯卷积操作。

#### 在DoG空间找到关键点

为了寻找尺度空间的极值点，每一个采样点要和它所有的相邻点比较，看其是否比它的图像域和尺度域的相邻点大或者小。如图所示，中间的检测点和它同尺度的8个相邻点和上下相邻尺度对应的9×2个点共26个点比较，以确保在尺度空间和二维图像空间都检测到极值点。 一个点如果在DOG尺度空间本层以及上下两层的26个领域中是最大或最小值时，就认为该点是图像在该尺度下的一个特征点,如图所示。使用Laplacian of Gaussian能够很好地找到找到图像中的兴趣点，但是需要大量的计算量，所以使用Difference of Gaussian图像的极大极小值近似寻找特征点.DOG算子计算简单，是尺度归一化的LoG算子的近似。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/DoG_Space.jpg)

#### 去除不好的点

> 这一步本质上要去掉DoG局部曲率非常不对称的像素。通过拟和三维二次函数以精确确定关键点的位置和尺度（达到亚像素精度），同时去除低对比度的关键点和不稳定的边缘响应点(因为DoG算子会产生较强的边缘响应)，以增强匹配稳定性、提高抗噪声能力，在这里使用近似Harris Corner检测器。


#### 给特征点赋值一个128维方向参数并描述

前面的几个步骤确定了特征点到底在哪里，此步骤是为了**描述特征点**。
(x,y)处梯度的模值和方向公式为：

$$
m(x,y)=\sqrt{(L(x+1,y)-L(x-1,y))^2+(L(x,y+1)-L(x,y-1))^2}
$$
$$
\theta(x,y)=tan^{-1}\left(\frac{L(x,y+1)-L(x,y-1)}{L(x+1,y)-L(x-1,y)}\right)
$$
> 利用关键点邻域像素的梯度方向分布特性为每个关键点指定方向参数，使算子具备旋转不变性。

其中L所用的尺度为每个关键点各自所在的尺度。至此，图像的关键点已经检测完毕，每个关键点有三个信息：**位置，所处尺度、方向**，由此可以确定一个SIFT特征区域。

在实际计算时，我们在以关键点为中心的邻域窗口内采样，并用直方图统计邻域像素的梯度方向。梯度直方图的范围是0～360度，其中每45度一个柱，总共8个柱, 或者每10度一个柱，总共36个柱。Lowe论文中还提到要使用高斯函数对直方图进行平滑，减少突变的影响。直方图的峰值则代表了该关键点处邻域梯度的主方向，即作为该关键点的方向。直方图中的峰值就是主方向，其他的达到最大值80%的方向可作为辅助方向。

计算keypoint周围的16\*16的window中每一个像素的梯度，而且使用高斯下降函数降低远离中心的权重。图左部分的中央为当前关键点的位置，每个小格代表关键点邻域所在尺度空间的一个像素，利用公式求得每个像素的梯度幅值与梯度方向，箭头方向代表该像素的梯度方向，箭头长度代表梯度模值，然后用高斯窗口对其进行加权运算。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/keypoints.jpg)

该图是8\*8的区域计算得到2\*2描述子向量的过程。但是在实际中使用的是在16\*16的区域计算得到4\*4的特征描述子，如下图：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/descriptor.jpg)

这样就可以对每个feature形成一个4\*4\*8=128维的描述子，每一维都可以表示4\*4个格子中一个的scale/orientation。将这个**向量归一化之后，就进一步去除了光照的影响**。



### sift的缺点


SIFT在图像的不变特征提取方面拥有无与伦比的优势，但并不完美，仍然存在：
1. 实时性不高。
2. 有时特征点较少。
3. 对边缘光滑的目标无法准确提取特征点。

PS: 论文见这里：[Distinctive Image Features from Scale-Invariant Keypoints](http://www.cs.ubc.ca/~lowe/papers/ijcv04.pdf)，这里是[David Lowe大神](http://www.cs.ubc.ca/~lowe/home.html)做的一个[Demo Software: SIFT Keypoint Detector](http://www.cs.ubc.ca/~lowe/keypoints/).


## SURF 简介

参考了好友整理的一篇文章[特征与匹配](http://simtalk.cn/2017/08/18/%E7%89%B9%E5%BE%81%E4%B8%8E%E5%8C%B9%E9%85%8D/#ORB)
1. 整体的思路就是将计算DOG的一整套东西来检测关键点的理论替换成了利用hessian矩阵来检测关键点，因为当Hessian矩阵的判别式取得局部极大值时，判定当前点是比周围邻域内其他点更亮或更暗的点，由此来定位关键点的位置。
上述过程要进行Hessian判别式的计算，可以采用box filter的方式进行加速。
2. 构建尺度金字塔的方式不同，具体见下图：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/diff.png)

3. Sift特征点方向分配是采用在特征点邻域内统计其梯度直方图，取直方图bin值最大的以及超过最大bin值80%的那些方向作为特征点的主方向。而在Surf中，采用的是统计特征点圆形邻域内的harr小波特征。即在特征点的圆形邻域内，统计60度扇形内所有点的水平、垂直harr小波特征总和，然后扇形以0.2弧度大小的间隔进行旋转并再次统计该区域内harr小波特征值之后，最后将值最大的那个扇形的方向作为该特征点的主方向。该过程示意图如下：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/direction.jpg)

4. 生成特征点描述子: 在Sift中，是取特征点周围4\*4个区域块，统计每小块内8个梯度方向，用着4\*4\*8=128维向量作为Sift特征的描述子。surf算法中，也是在特征点周围取一个4\*4的矩形区域块，但是所取得矩形区域方向是沿着特征点的主方向。每个子区域统计25个像素的水平方向和垂直方向的haar小波特征，这里的水平和垂直方向都是相对主方向而言的。该haar小波特征为水平方向值之后、垂直方向值之后、水平方向绝对值之后以及垂直方向绝对值之和4个方向。
把这4个值作为每个子块区域的特征向量，所以一共有4\*4\*4=64维向量作为Surf特征的描述子，比Sift特征的描述子减少了2倍。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/SIFT-and-SURF/diff_more.jpg)


## 参考
- [SIFT特征提取分析](http://blog.csdn.net/abcjennifer/article/details/7639681/)
- [特征匹配-SURF原理与源码解析（一）](http://blog.csdn.net/luoshixian099/article/details/47807103)
- [特征与匹配](http://simtalk.cn/2017/08/18/%E7%89%B9%E5%BE%81%E4%B8%8E%E5%8C%B9%E9%85%8D/#ORB)