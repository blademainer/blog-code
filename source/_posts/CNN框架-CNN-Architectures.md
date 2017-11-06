---
title: CNN框架(CNN Architectures)
tags:
  - AlexNet
  - VGG
  - GoogLeNet
  - ResNet
comments: true
mathjax: true
abbrlink: 57818
date: 2017-11-07 00:24:45
---
<center><img src="http://oofx6tpf6.bkt.clouddn.com/17-11-7/9721733.jpg" width="75%" Dense-Net></center>


本文来自于CS231N（2017 Spring），将介绍几种较为常见的CNN结构。以下网络结构均是ImageNet比赛的冠军之作，我们将从网络结构，参数大小，运算量等来描述各个网络的特点。

<!--more-->

- AlexNet
- VGG
- GoogLeNet
- ResNet

Plus：

- NiN(Network in Network)
- wide ResNet
- ResNeXT
- stochastic Depth
- [DenseNet](https://github.com/liuzhuang13/DenseNet)
- FractalNet
- SqueezeNet

以下是正文。

## AlexNet

![AlexNet](http://oofx6tpf6.bkt.clouddn.com/17-10-24/99013631.jpg)
The input size is 227\*227\*3.

|Layer Type| \#Filters  |   Stride | Pading  |OUTPUT SIZE|Parameters|
|:-----|:-----|:-----|:-----|:-----|:-----|
| CONV1 | \#96 @11\*11  | 4         |    0   |55\*55\*96|11\*11\*3\*96|
| MAXPOOL1 | 3\*3       | 2         |    0   |27\*27\*96|0|
| NORM1 |               |           |        |27\*27\*96|55\*55\*96|
| CONV1 | \#256 @5\*5   | 1         |    2   |27\*27\*256|55\*55\*96|
| MAXPOOL2 | 3\*3       | 2         |    0   |13\*13\*256|55\*55\*96|
| NORM2 |               |           |        |13\*13\*256|55\*55\*96|
| CONV3 | \#384 @3\*3   | 1         |    1   |13\*13\*384|55\*55\*96|
| CONV4 | \#384 @3\*3   | 1         |    1   |13\*13\*384|55\*55\*96|
| CONV5 | \#256 @3\*3   | 1         |    1   |13\*13\*256|55\*55\*96|
| MAXPOOL3 | 3\*3       | 2         |    0   |6\*6\*256|55\*55\*96|
| FC6 |                 |           |        |4096|55\*55\*96|
| FC7 |                 |           |        |4096|55\*55\*96|
| FC8 |                 |           |        |1000|55\*55\*96|
The size of output image is $\frac{N-Conv+2\times Pading}{stride}+1$

![AlexNet-details](http://oofx6tpf6.bkt.clouddn.com/17-10-24/33818113.jpg)

## VGGNet

The winner of ImageNet Large Scale Visual Recognition Challenge (ILSVRC) 2014.
### 结构
**small filters, deeper networks**。
将原来8层的AlexNet扩展到了16&19层。卷积层的大小仅仅有3\*3，stride=1，pad=1；池化层仅仅有stride=2的2\*2的MAXPOOL。以下是其与AlexNet的结构对比图。
![VGG](http://oofx6tpf6.bkt.clouddn.com/17-11-6/89475867.jpg)

更加具体的，VGG16的网络的参数个数以及内存消耗如下：
![VGG-details](http://oofx6tpf6.bkt.clouddn.com/17-11-6/31257061.jpg)

Q：为何采用更小的CONV？
A：几个3\*3的CONV叠加后的接受域和一个7\*7大小的CONV的接受域一致，但是与此同时，**网络层数变深，引入了更多的非线性，参数数量更少**。（Stack of three 3x3 conv (stride 1) layers has same effective receptive field as one 7x7 conv layer，But deeper, more non-linearities. And fewer parameters: ($3\times3^2C^2$) vs. $7^2C^2$ for C channels per layer）

### 更多信息

- ILSVRC'14 2nd in classification, 1st in localization Similar training
- procedure as Krizhevsky 2012 No Local Response Normalisation (LRN)
- Use VGG16 or VGG19 (VGG19 only slightly better, more memory) 
- Use ensembles for best results 
- FC7 features generalize well to other tasks

## GoogLeNet

论文地址：[https://arxiv.org/pdf/1409.4842.pdf](https://arxiv.org/pdf/1409.4842.pdf)
代码地址：NULL
**Deeper networks, with computational efficiency**。GoogLeNet是ILSVRC'14的图像分类冠军网络，它加入了**Inception**模块，并且去除了全连接层，大大减少了参数的个数。

- 22 layers (with weights)
- Efficient “Inception” module
- No FC layers
- Only 5 million parameters! 12x less than AlexNet
- ILSVRC’14 classification winner (6.7% top 5 error)

### “Inception module”
精心设计了一个局部网络模块，并且将这些模块叠加构成GoolgeNet。这种经过精心设计的模块就是Inception。（design a good local network topology (network within a network) and then stack these modules on top of each other）。
Inception包含几个接受域不同的CONV核（1\*1，3\*3，5\*5）以及池化操作（3\*3）；最终将这些操作后的输出在depth方向串联。以下是两种两种不同的实现方式，左图时原始的inception模块，右图是改进版的inception模块。
![inception](http://oofx6tpf6.bkt.clouddn.com/17-11-6/33298717.jpg)
对于naive inception而言，它面临这运算量巨大的问题。由于池化层的输出会保留原始输入的depth，所以经过CONV&MAXPOOL过后的输出的feature map势必比原始输入的depth更深。
![inception-naive](http://oofx6tpf6.bkt.clouddn.com/17-11-6/53626485.jpg)
那么如何去解决以上问题呢，一个通常的方式就是降维。我们在每个CONV前加上1\*1的CONV（“bottleneck” layers）来减少feature map的维度。所谓的1\*1CONV就是在保持输入的空间分辨率不变的情况下来减小depth维度，即通过将不同depth上的feature map进行组合，从而将输入的feature map映射到更低的depth维度上。经过以上操作就可以将运算的操作次数大大降低。
![inception-improve](http://oofx6tpf6.bkt.clouddn.com/17-11-6/95592762.jpg)

于是GoogLeNet的全貌如下：
![googlenet](http://oofx6tpf6.bkt.clouddn.com/17-11-6/75689322.jpg)

## ResNet

利用**残差**连接成的超级深网络。

### 概况
- 152-layer model for ImageNet
- ILSVRC' 15 classification winner (3.57% top 5 error)
- Swept all classification and detection competitions in ILSVRC' 15 and COCO' 15!

### 深度增加带来的问题
![deeper-nets-problems](http://oofx6tpf6.bkt.clouddn.com/17-11-6/22279699.jpg)
从上图可以发现，当网络层数增加时，训练误差和测试误差都有所下降。这并不符合以往的经验，我们会想，既然网络层数增加了，那么模型参数势必僧多，此时会造成过拟合。然而过拟合的表现是：训练误差减小，测试误差增大。但是事实和分析并不吻合。
何凯明认为：**The problem is an optimization problem, deeper models are harder to optimize**。这是一个优化问题，更深的网络更难优化。并且，更深的网络应该至少比浅层网络不差，这是因为我们可以通过拷贝浅层网络+identity mapping（恒等映射）来构造一个更深的网络，这个结构化的方案表明深层网络可以达到和浅层网络一致的性能。

### 解决方案
![resnet-layer](http://oofx6tpf6.bkt.clouddn.com/17-11-6/63404628.jpg)
Use network layers to fit a residual mapping instead of directly trying to fit a desired underlying mapping.
作者假设：**相较于最优化最初的无参照映射（残差函数以输入x作为参照），最优化残差映射是更容易的**。利用网络去拟合残差$F(x)$，并非直接拟合$H(x)$。


### 整个ResNet框架
![resnet-structure](http://oofx6tpf6.bkt.clouddn.com/17-11-6/82101608.jpg)

- Stack residual blocks
- Every residual block has two 3x3 conv layers
- Periodically, double # of filters and downsample spatially using stride 2 (/2 in each dimension)
- Additional conv layer at the beginning
- No FC layers at the end (only FC 1000 to output classes)

对于ImageNet比赛而言，ResNet设置的网络深度有34、50、101以及152层。对于层数较多的网络，利用“bottleneck”（类似于GoogLeNet的1\*1卷积操作）来提高效率。



## 总结
论文[An Analysis of Deep Neural Network Models for Practical Applications](https://arxiv.org/pdf/1605.07678.pdf) 比较了2016年以来的一些神经网络的规模、运算量、能耗以及精度等项目。
![complexity-compare](http://oofx6tpf6.bkt.clouddn.com/17-11-6/40479799.jpg)

- GoogLeNet: most efficient
- VGG: Highest memory, most operations
- AlexNet: Smaller compute, still memory heavy, lower accuracy
- ResNet: Moderate efficiency depending on model, highest accuracy

## 其他网络变体

后续补充。

## 疑问

- **<font color=red>ResNet为何能够使网络层数更深，应如何正确理解残差网络？He是受何启发从而发明了这种结构？</font>**
- more questions will be added...

## 参考文献

1. [DeepLearning.net](http://deeplearning.net/)
2. [Reading List](http://deeplearning.net/reading-list/)
3. [ImageNet Classification with Deep Convolutional Neural Networks](http://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)
4. [为什么ResNet和DenseNet可以这么深？一文详解残差块为何有助于解决梯度弥散问题](https://zhuanlan.zhihu.com/p/28124810)
5. [An Analysis of Deep Neural Network Models for Practical Applications](https://arxiv.org/pdf/1605.07678.pdf)
6. [CS231n: Convolutional Neural Networks for Visual Recognition](http://cs231n.stanford.edu/)
7. [Densely Connected Convolutional Networks](https://arxiv.org/pdf/1608.06993.pdf)