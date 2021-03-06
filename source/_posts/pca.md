---
title: 降维之PCA主成分分析原理
comments: true
mathjax: true
categories: 机器学习
tags:
  - PCA
  - LDA
  - 降维
  - 机器学习
abbrlink: 48503
date: 2017-10-02 13:22:25
---

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/pca/pca-cover.jpg)
[//]:![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/pca/smile.jpg)

<!--more-->

## 背景
在许多领域的研究与应用中，往往需要对反映事物的多个变量进行大量的观测，收集大量数据以便进行分析寻找规律。多变量大样本无疑会为研究和应用提供了丰富的信息，但也在一定程度上增加了数据采集的工作量，更重要的是在多数情况下，许多变量之间可能存在相关性，从而增加了问题分析的复杂性，同时对分析带来不便。如果分别对每个指标进行分析，分析往往是孤立的，而不是综合的。盲目减少指标会损失很多信息，容易产生错误的结论。
因此需要找到一个合理的方法，在减少需要分析的指标同时，尽量减少原指标包含信息的损失，以达到对所收集数据进行全面分析的目的。由于各变量间存在一定的相关关系，因此有可能用较少的综合指标分别综合存在于各变量中的各类信息。主成分分析与因子分析就属于这类降维的方法。


## 目的

PCA（Principal Component Analysis）是一种常用的数据分析方法。PCA通过线性变换将原始数据变换为一组各维度线性无关的表示，可用于提取数据的主要特征分量，常用于高维数据的降维。能够对高维数据降维的算法包括：
- LASSO
- 主成分分析法
- 聚类分析
- 小波分析法
- 线性判别法
- 拉普拉斯特征映射

## 降维有什么作用

降维有什么作用呢？
- 数据在低维下更容易处理、更容易使用
- 相关特征，特别是重要特征更能在数据中明确的显示出来；如果只有两维或者三维的话，更便于可视化展示
- 去除数据噪声
- 降低算法开销

常见的降维算法有主成分分析（principal component analysis,PCA）、因子分析（Factor Analysis）和独立成分分析（Independent Component Analysis，ICA）。
<center>{% asset_img fig_pca.png %}</center>

## 优化目标
将一组N维向量降为K维（K大于0，小于N），其目标是选择K个单位（模为1）正交基，使得原始数据变换到这组基上后，各字段两两间协方差为0，而字段的方差则尽可能大（在正交的约束下，取最大的K个方差）。
注意：PCA的变换矩阵是协方差矩阵，K-L变换的变换矩阵可以有很多种（二阶矩阵、协方差矩阵、总类内离散度矩阵等等）。当K-L变换矩阵为协方差矩阵时，等同于PCA。

## PCA原理

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/pca/projection.png)

最大化样本点在基上的投影，使得数据点尽量的分离。令第一主成分的方向是`$u_1$`，我们的目标就是将样本点在该方向上的投影最大化，即：

$$
\max \frac{1}{n}\sum_{i=1}^n<u_1,x_i>^2
$$

$$
 \frac{1}{n}\sum_{i=1}^n<u_1,x_i> \rightarrow \frac{1}{n}\sum_{i=1}^n(x_1^Tu_1)^2=\frac{1}{n}\sum_{i=1}^n(x_1^Tu_1)^T(x_1^Tu_1)
$$

$$
=\frac{1}{n}\sum_{i=1}^n(u_1^Tx_1x_1^Tu_1)=\frac{1}{n}u_1^T\left(\sum_{i=1}^nx_1x_1^T\right)u_1=\frac{1}{n}u_1^T\left(XX^T\right)u_1
$$

其中的`$X=[x_1,x_2,...,x_n]^T,x_i\in R^{m}$`。那么优化函数就变成了：

$$
\max u_1^T\left(XX^T\right)u_1
$$

以上式子是个二次型，可以证明`$XX^T$`是半正定矩阵，所以上式必然有最大值。

$$
\max u_1^T\left(XX^T\right)u_1=\max ||X^Tu_1||_2^2
$$

## 优化函数

$$
max||Wx||_2
$$

$$
s.t.  W^TW=I
$$

解释：**最大化方差同时最小化协方差**（PCA本质上是将方差最大的方向作为主要特征，并且在各个正交方向上将数据“离相关”）。最大化方差意味着，使得每个样本点在每个维度上与均值有很大差异，就是说非常有个性，有个性才能分辨出来；同时协方差越小的话表明样本之间的互相影响就非常小，如果协方差是0的话，表示两个字段完全独立。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/pca/explain.gif)

寻找协方差矩阵的特征向量和特征值就等价于拟合一条能保留最大方差的直线或主成分。因为特征向量追踪到了主成分的方向，而最大方差和协方差的轴线表明了数据最容易改变的方向。根据上述推导，我们发现达到优化目标就等价于将协方差矩阵对角化：即除对角线外的其它元素化为0，并且在对角线上将特征值按大小从上到下排列。协方差矩阵作为实对称矩阵，其主要性质之一就是可以正交对角化，因此就一定可以分解为特征向量和特征值。


## 具体实施步骤

总结一下PCA的算法步骤，设有`$m$`条`$n$`维(字段数)数据，我们采用以下步骤对数据降维。

1. 将原始数据按列组成`$n$`行`$m$`列矩阵X. (行数代表字段数目，一个字段就是取每个样本的该维度的数值；列数代表样本数目)
2. 将`$X$`的每一行（代表一个属性字段）进行零均值化，即减去这一行的均值
3. 求出协方差矩阵`$C=\frac{1}{m}XX^T$`
4. 求出协方差矩阵的特征值及对应的特征向量
5. 将特征向量按对应特征值大小从上到下按行排列成矩阵，取前k行组成矩阵P
6. `$Y=PX$`即为降维到k维后的数据

## 去均值化的目的
下面两幅图是数据做中心化（centering）前后的对比，可以看到其实就是一个平移的过程，平移后所有数据的中心是`$(0,0)$`.

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/pca/centering_1.jpg)

在做PCA的时候，我们需要找出矩阵的特征向量，也就是主成分（PC）。比如说找到的第一个特征向量是a = [1, 2]，a在坐标平面上就是从原点出发到点（1，2）的一个向量。如果没有对数据做中心化，那算出来的第一主成分的方向可能就不是一个可以“描述”（或者说“概括”）数据的方向了。还是看图比较清楚。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/pca/centering_2.jpg)

黑色线就是第一主成分的方向。只有中心化数据之后，计算得到的方向才能比较好的“概括”原来的数据。


## 限制
PCA虽可以很好的解除线性相关，但是对于高阶相关性就没有办法了，对于存在高阶相关性的数据，可以考虑Kernel PCA，通过Kernel函数将非线性相关转为线性相关。

## 参考

1. [PCA的数学原理 ](http://blog.codinglabs.org/articles/pca-tutorial.html)
2. [ K-L变换和PCA的区别](http://blog.csdn.net/oldmonkeyyu_s/article/details/45766543)
3. [从PCA和SVD的关系拾遗](http://blog.csdn.net/Dark_Scope/article/details/53150883)
4. [数据什么时候需要做中心化和标准化处理](https://www.zhihu.com/question/37069477/answer/132387124)
5. [主成分分析（PCA）原理详解](http://blog.jobbole.com/109015/)

附上最近比较火的一首歌**<font color=red >Time</font>**
<center><iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=45 height=86 src="//music.163.com/outchain/player?type=2&id=33035611&auto=0&height=66"></iframe></center>



