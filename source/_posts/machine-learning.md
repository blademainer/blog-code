---
title: 机器学习修炼手册
comments: true
mathjax: true
categories: 机器学习
tags:
  - 机器学习
  - Machine Learning
abbrlink: 40595
date: 2017-05-07 20:02:56
---

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/machine-learning/ML.jpg)

<p id="div-border-left-green">对机器学习的学习我开始于二年级的《数据挖掘》课，当时袁老师对数据挖掘中的常用的算法做了一些介绍，但是这仅仅是个入门教学，我并没有深入了解的其中的原理。到现在我才深刻的意识到ML的重要性，我就抽空看了一些这方面的资料，整理了这一份文档。</p>

<!--more-->

机器学习算法包括，<span id="inline-red">监督学习</span>(回归、分类)以及<span id="inline-red">非监督学习</span>(聚类)。


## 梯度下降

$$\bbox[5px,border:2px solid red]
{
	\theta_j:=\theta_j-\alpha\frac{\partial}{\partial \theta}J(\theta)
}
$$

其中$\alpha$为学习率一般为很小的数字(0.001-0.1)，$\theta$为我们需要求解的参数，$J(\theta)$为能量函数或者为损失函数，通过上述公式可知，梯度下降是沿着损失函数梯度的反方向寻找迭代寻找最优值的过程。梯度下降容易陷入局部最极小点，所以我们要采取一定的措施来阻止这种现象的发生。

## 过拟合（Overfitting）
<p id ="div-border-left-red">如果训练样本的特征过多，我们学习的假设可能在训练集上表现地很好，但是在验证集上表现地就不尽人意</p>
### 避免过拟合
- 减少特征的大小
- 正则化
    - 在保证所有特征都保留的情况下，限制$\theta$的大小，即Small values for parameters $ \theta_0,\theta_1,\theta_2...\theta_n$
    - 当特征量很多时，该方式仍然表现的很好
- 交叉验证(Cross Validation)

### 正则化

#### 线性回归
对于线性回归而言，其损失函数形式如下：
$$
	J(\theta)=\frac{1}{2m}\sum_{i=1}^{m}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)^2
$$
引入正则化之后的损失函数的形式为：
$$
	J(\theta)=\frac{1}{2m}\left(\sum_{i=1}^{m}(h_{\theta}(x^{(i)})-y^{(i)})^2+\lambda\sum_{j=1}^{n}\theta_{j}^2\right)
$$
##### GD迭代求解参数
**Repeat**{

$$
	\theta_0:=\theta_0-\alpha\frac{1}{m}\sum_{i=1}^{m}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)x_0^{(i)}
$$

$$
	\theta_j:=\theta_j-\alpha\frac{1}{m}\left(\sum_{i=1}^{m}(h_{\theta}(x^{(i)})-y^{(i)})x_j^{(i)}+\lambda\theta_j\right)
$$
}
梯度下降法的学习率$\alpha$需要提前指定，并且还要制定收敛标准。
##### Normal Equation
$$
\theta=\left(x^Tx+\lambda\begin{bmatrix}
{0}&{0}&{\cdots}&{0}\\
{0}&{1}&{\cdots}&{0}\\
{\vdots}&{\vdots}&{\ddots}&{\vdots}\\
{0}&{0}&{\cdots}&{1}\\
\end{bmatrix}_{(n+1)(n+1)}\right)^{-1}x^Ty
$$
上式是对线性回归正则化后的矩阵解。可以证明的是当$\lambda>0$时，求逆符号内部的式子总是可逆的。

#### 逻辑回归
在没有加入正则化之前，逻辑回归的损失函数的形式是这样的：
$$
J(\theta)=-\frac{1}{m}\sum_{i=1}^{m}\left(y^{(i)}\log\left(h_{\theta}(x^{(i)})\right)+(1-y^{(i)})\log\left(1-h_{\theta}(x^{(i)})\right)\right)
$$
加入正则项之后的形式为：
$$
J(\theta)=-\frac{1}{m}\sum_{i=1}^{m}\left(y^{(i)}\log\left(h_{\theta}(x^{(i)})\right)+(1-y^{(i)})\log\left(1-h_{\theta}(x^{(i)})\right)\right)+\frac{\lambda}{2m}\sum_{j=1}^{n}\theta_j^2
$$

##### GD迭代求解参数
**Repeat**{

$$
\theta_0:=\theta_0-\alpha\frac{1}{m}\sum_{i=1}^{m}\left(h_{\theta}(x^{(i)})-y^{(i)}\right)x_0^{(i)}$$
$$\theta_j:=\theta_j-\alpha\frac{1}{m}\left(\sum_{i=1}^{m}(h_{\theta}(x^{(i)})-y^{(i)})x_j^{(i)}+\lambda\theta_j\right)
$$
}

## SVM支持向量机

支持向量机又被称作最大间距（Large Margin）分类器，损失函数的形式是：
$$
J(\theta)=C\sum_{i=1}^{m}\left(y^{(i)}cost_1\left(h_{\theta}(x^{(i)})\right)+(1-y^{(i)})cost_0\left(h_{\theta}(x^{(i)})\right)\right)+\frac{1}{2}\sum_{j=1}^{n}\theta_j^2
$$
其中：$h_{\theta}(x^{(i)})=\theta^Tx^{i}$，$cost_1$以及$cost_0$的形式如下图所示：

$$
\begin{cases}
\text{we want } \theta^Tx\ge1,  & \text{if $y$ =1} \\[2ex]
\text{we want } \theta^Tx\le-1,  & \text{if $y$ =0}
\end{cases}
$$

在考虑到soft margin时的损失函数是hinge损失，[SVM就等价于Hinge损失函数+L2正则](http://breezedeus.github.io/2015/07/12/breezedeus-svm-is-hingeloss-with-l2regularization.html)。此时损失函数为0时候就对应着非支持向量样本的作用，“从而所有的普通样本都不参与最终超平面的决定，这才是支持向量机最大的优势所在，对训练样本数目的依赖大大减少，而且提高了训练效率”。
以下是七月在线大神July写的一篇关于SVM的介绍，个人觉得不错。分享下：[支持向量机通俗导论（理解SVM的三层境界）](https://coding.net/s/f03e79be-8200-46bb-b714-7bb4ef70c391)。

