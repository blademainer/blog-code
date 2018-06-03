---
title: 理解LSTM网络【译】
comments: true
mathjax: true
categories: LSTM
tags:
  - LSTM
  - RNN
  - CNN
abbrlink: 6251
date: 2017-10-23 21:26:20
---

![](http://oofx6tpf6.bkt.clouddn.com/honghong.jpg)

本文是我对大神[Christopher Olah](http://colah.github.io/about.html)的[Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)的译文。
<!--more-->

## 循环神经网络（Recurrent Neural Networks）

人们并非每时每刻都在大脑一片空白时开始思考。当我们读这篇文章的时候，我们会根据之前学习的知识来理解当前你在阅读的内容。我们不是把原来的知识丢的一干二净来重新学习，我们的记忆有一定的**持久性**。
传统的神经网络做不到这些，这是它的一大缺陷。比如说，可以想象有这样一种情况，我们想知道一部电影的每一帧画面正在发生什么。使用传统的神经网络很难通过理解电影之前的画面来推断以后将要发生的事件。（传统的神经网络不能处理带有时序的样本）
循环神经网络（Recurrent Neural Networks）尝试解决了以上问题。这种网络是一种带有循环结构的网络，可以使得信息得以持久保持。
<center><img src="http://oofx6tpf6.bkt.clouddn.com/RNN-rolled.png" width="15%" RNN有循环结构></center>

上图是一个RNN模块，$A$读取输入$x_i$，同时输出$h_t$，$A$这个循环允许信息从网络的当前步骤传递到下一步骤。
上述过程把RNN的过程讲的有些神秘感。但是，如果我们仔细想想，这也不比一个正常的神经网络难以理解。一个RNN可以看成是多个相同网络的拷贝，每一个拷贝都会向后续网络传递信息，下图我们把RNN展开。
![展开RNN](http://oofx6tpf6.bkt.clouddn.com/RNN-unrolled.png)
这种链式的特性揭示了RNN与序列和列表有关，RNN是对这些数据最自然的表达。RNN目前已经被广泛使用！在过去的几年间，RNN在很多领域都有着出色的表现：语音识别，语言建模，翻译，图像描述...推荐大家阅读大神Andrej Karpathy的博文[ The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)，来领略下RNN的诸多应用，这简直不能太棒！
以上的成功案例离不开使用**长短期记忆**（LSTM: Long Short Term Memory）网络，这是一种特殊的RNN网络并且能够应对更多任务，相比于标准的RNN网络，它具有更为出色的表现。几乎所有的RNN都是基于LSTM来实现的，接下来我们讨论下LSTM的奥义。

## 长期依赖（Long-Term Dependencies）问题

RNNs的要求之一就是它能够连接之前的信息到当前的任务之上，例如利用之前的视频帧来理解当前帧的内容。如果RNNs能够做到这一点的话，它将会超级有用。但是它真的可以吗？看情况而定。
有时，我们仅仅需要离当前任务最近的几个任务信息。例如，我们有一个**语言模型**，它的目标是根据当前已有的词语去预测接下来将要出现的词语。如果我们尝试去预测“the clouds are in the sky”中的最后一个单词，我们不需要任何更多的语料，很明显最后一个单词将会是“sky”。在这种情况下，相关信息和当前需要预测词的位置的间隔是非常小的，这时RNNs可以去利用过去的信息。
![短期记忆](http://oofx6tpf6.bkt.clouddn.com/RNN-shorttermdepdencies.png)
但是也有一种情况是，我们需要更多的信息才能够做预测。例如我们的**语言模型**需要预测下面句子的最后一个单词“I grew up in France… I speak fluent French.”。从相邻近的几个单词可以推断最后一个单词可能是一种语言，但如果我们想要知道到底是哪种语言的话，我们需要句子最前面的一个单词“France”。这会使得相关信息以及需要预测词的位置的间隔变得很大。
遗憾的是，随着间隔的逐渐增大，RNNs不能够去关联有用的信息。
![长期记忆](http://oofx6tpf6.bkt.clouddn.com/RNN-longtermdependencies.png)
在理论上，RNNs能够解决长期依赖的问题。人们可以通过仔细选取参数来解决这类问题。但是实际上RNNs并不能去解决这个问题。[ Hochreiter (1991) [German] and Bengio(1994)](http://people.idsia.ch/~juergen/SeppHochreiter1991ThesisAdvisorSchmidhuber.pdf)等人深入研究了该问题为何如此艰难。
阿弥陀佛，LSTMs并没有上述问题。

## LSTM网络

长短期记忆网络——经常被叫做“LSTM”——是RNN的这一种特殊的形式，它能够解决长期依赖的问题。LSTM是由[Hochreiter & Schmidhuber (1997)](https://www.researchgate.net/publication/13853244_Long_Short-term_Memory)提出，并由很多后来者完善以及推广。LSTM能够在很多问题上取得优秀的结果，现如今被广泛引用。
LSTM被设计成防止长期依赖问题的发生。在实践中，LSTM的长期记忆是默认行为，而并非艰苦习得！所有的RNN都有链式重复的神经网络模块。在标准的RNN中，这些重复的模块仅仅有简单的结构，例如$tanh$层。
![标准RNN中重复的简单模块](http://oofx6tpf6.bkt.clouddn.com/LSTM3-SimpleRNN.png)
当然，LSTM中也存在这样的链式结构，但是其中的重复模块就大为不同了。LSTM的重复的模块中包含4种不同的层，它们以一种特殊的结构交错着。
![LSTM中重复的模块中包含4种不同层](http://oofx6tpf6.bkt.clouddn.com/LSTM3-chain.png)
看不懂，不用担心，细节即将展开。接下来，我们会一步步来讲解LSTM的网络结构。首先我们先明确几个会经常用到的表示方法。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM2-notation.png)
在以上的图示中，每条实线传输着整个向量，从一个节点的输出到其他节点的输入。粉红色的圆圈表示的是**逐点操作**，例如向量的加法，黄色的方形表示已经学习了的网络层。汇集的线表示**串联**，分叉的线表示**复制**操作，这些复制的内容流向不同的位置。

## LSTM背后的核心技术

LSTM的关键技术在于细胞（cell）状态，也就是图表中最上方水平穿行的直线。细胞状态可以理解成是一种传送带。它仅仅以少量的线性相交，贯穿整个链式结构上方。信息沿着这条传动带很容易保持不变。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-C-line.png)
LSTM有一种能向细胞增加或者移除信息的能力，这种经过精心设计的结构称作**门**（gates）。所谓的门就是一种让信息选择性通过的方法。它是由一个$sigmoid$层和一个逐点乘法单元构成。如下图：
<center><img src="http://oofx6tpf6.bkt.clouddn.com/LSTM3-gate.png" width="15%" RNN有循环结构></center>

$sigmoid$层的输出是$0$-$1$之间的数字，它描述了每个部分可以有多少量能够通过。$0$代表“啥都不能通过”，$1$代表“啥都能通过”！一个LSTM有三种这样的门结构，用来保证以及控制细胞状态。

## 逐步理解LSTM

LSTM的第一步是来决定**啥信息将要从细胞状态中丢弃**。这个决定是由一个叫做“遗忘门”（“forget gate layer”）的$sigmoid$层来决定。它的输入是$h\_{t-1}$和$x\_t$，输出是一个介于$0$到$1$之间数值，给每个在状态$C\_{t-1}$的数值。$1$表示“完全保留”，$0$表示“完全丢弃”。
让我们回到之前的的语言模型的例子中，我们还是基于以前的词语来预测后续的单词。在这样一个问题中，细胞状态可能会包含当前主语的性别信息，所以正确的**介词**将会被使用。当我们看到一个新的主语时，我们要遗忘掉旧的的主语。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-focus-f.png)

下一步就是决定**啥新信息将要存储在细胞状态中**。这包括两个方面。第一，一个叫做“输入门层”的$sigmoid$层来决定哪些值我们要更新；第二，一个$tanh$层创造了新的候选值$\tilde{C}_t$，这个值将会加入到新的状态中去。进一步，我们要把上述两个方面结合起来来更新细胞状态。
在我们的语言模型中，我们想要在新的主语对应的细胞状态中加入性别信息，去代替我们遗忘掉的那个旧主语状态。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-focus-i.png)

我们现在更新旧的细胞状态，从状态$C\_{t-1}$到状态$C\_{t}$。上述步骤已经详述了具体如何操作，我们现在就开始更新！
我们将旧的细胞状态乘以$f_t$，目的是忘记我们要忘记的旧状态。然后我们加上$i_t*\tilde{C}_t$，这就是我们创造新的候选值，这个值根据我们想要更新每个状态值的程度进行伸缩变化（这就是$i_t$的意义）。
在我们的语言模型中，这就是我们根据最开始确定的目标，丢弃旧主语性别以及增加新主语信息的地方。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-focus-C.png)

最后一步我们要决定到底输出什么信息。这个输出信息会基于细胞状态，但将会是一个经过过滤后的结果。首先，我们用一个$sigmoid$层去决定细胞状态的哪一部分将会被输出。然后，我们将细胞状态通过$tanh$（将其值规范到$-1$到$1$之间）。最后我们将这个值与$sigmoid$输出相乘，这样我们仅仅输出我们想要输出的部分。
还是对于之前提到的语言模型，因为它只看到了一个主语，它可能会输出一个与动词相关的信息。例如，可能输出这个主语是单数还是复数，所以我们会知道紧跟的动词是何种形式。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-focus-o.png)
至此，基本的LSTM介绍完毕。

## LSTM的变体
我们以上描述的均是最为普通的LSTM。但是并不是所有的LSTM都是以上那个样子。事实上，似乎每一篇涉及LSTMs的论文均对其做了细微的修改。其中的差别不大，以下列举几种LSTM的变体。

其中之一就是一种特别流行的LSTM变体，它由[ Gers & Schmidhuber (2000)](ftp://ftp.idsia.ch/pub/juergen/TimeCount-IJCNN2000.pdf)提出，加入一种**窥视孔连接**（peephole connections）的结构。这使得细胞状态可以作为门层（译者：gete layers:$sigmoid$ layers & $tanh$ layer）输入。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-var-peepholes.png)
以上的图示为每个门层加入了窥视孔连接，但是也有一些论文并不是所有的门层都加。

另外一种变体是加入了双遗忘门（coupled forget）以及输入门。我们同时考虑了何时遗忘以及应该加入何种新信息，而并非分别考虑。我们仅仅在我们需要就地输入信息的时候才会遗忘，同时我们仅仅在遗忘掉旧的信息的时候才会加入新的信息（译者：此时$f_t=0$，表示遗忘旧的细胞状态，同时加入新的输入$\tilde{C}_t$）。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-var-tied.png)

另外一种改动较大的变体是门控循环单元（Gated Recurrent Unit）即GRU。这个算法由[Cho,et al.(2014)](http://arxiv.org/pdf/1406.1078v3.pdf)提出，它把遗忘门和输入门结合起来构成一个“更新门”（update gate）。与此同时，它还将细胞状态和隐含状态合并起来，当然还有一些其他变化在此不一一赘述。最终的变体比标准的LSTM简单，这使得它很受欢迎。
![](http://oofx6tpf6.bkt.clouddn.com/LSTM3-var-GRU.png)

以上均是最近比较劲爆的LSTM变体。当然也有很多其他形式的变体，如[Yao,et al. (2015)](http://arxiv.org/pdf/1508.03790v2.pdf)提出的**深度门RNN**（Depth Gated RNNs）。还有一些变体用完全不同的方式来解决长期依赖问题，例如[Koutnik,et al.(2014)](http://arxiv.org/pdf/1402.3511v1.pdf)提出的**时钟频率驱动RNN**（Clockwork RNNs ）。

列举了诸多LSTM变体，那么到底哪一种变体是最好的呢？其中的差异真的很重要吗？[Greff, et al.(2015)](http://arxiv.org/pdf/1503.04069.pdf)做了一个非常棒了比较，发现这些变体几乎都是一样一样的。[Jozefowicz,et al.(2015)](http://jmlr.org/proceedings/papers/v37/jozefowicz15.pdf)测试了上万种RNN框架，发现了一些框架在特定任务上会比LSTM表现出色。（译者：没有一种算法一统江湖）
## 结论
以上，我提到了人们利用RNNs得到了很多优秀的结果。在本质上说，几乎所有的RNNs都使用了LSTMs。LSTMs在诸多任务上表现优异。
在介绍LSTMs的过程中写了很多公式，这让它看起来很吓人。幸运的是，我们在文中通过一步步地探索，让LSTM看起来平易近人。
LSTMs是我们完成RNNs的重大成果。我们很自然地想：还有没有其他的重大成果？研究员们的共识是：当然有！下一个重大成果就是——**注意力**。这个观点是让RNNs的每一步都能够从更大的数据集中挑选信息。例如，如果你想利用RNNs去给一幅图像创造标题来描述它，这就可能会选择图像的一部分作为输入，然后根据这些输入来得到每个单词。事实上，[Xu,et al.(2015)](http://arxiv.org/pdf/1502.03044v2.pdf)就是这么做的——这可能你探究**注意力**这个领域的起点。还有诸多使用**注意力**取得的令人激动的研究结果，看起来还有更多需要探索。
**注意力**并非RNN唯一令人激动的研究方向。例如，[Kalchbrenner, et al. (2015)](http://arxiv.org/pdf/1507.01526v1.pdf)提出的网格LSTM（Grid LSTMs）看似非常有前景。[Gregor, et al.(2015)](http://arxiv.org/pdf/1502.04623.pdf)，[Chung, et al.(2015)](http://arxiv.org/pdf/1506.02216v3.pdf)和[ Bayer & Osendorfer (2015)](http://arxiv.org/pdf/1411.7610v3.pdf)等人的研究工作是在生成模型中使用RNNs，这些工作都看起来非常有趣。过去几年是RNNs异常火爆的时期，未来也会有更多更加有意义的成果出现。

## 致谢
我非常感谢那些帮助我去理解LSTMs的大佬们，同时感谢对可视化进行评论并在这篇博文提供反馈的网友们。非常感激谷歌同事们的反馈，尤其感谢[Oriol Vinyals](http://research.google.com/pubs/OriolVinyals.html)，[Greg Corrado](http://research.google.com/pubs/GregCorrado.html)，[Jon Shlens](http://research.google.com/pubs/JonathonShlens.html)，[Luke Vilnis](http://people.cs.umass.edu/~luke/)以及[Ilya Sutskever](http://www.cs.toronto.edu/~ilya/)。我也由衷感谢很多同事朋友的帮助，包括[Dario Amodei](https://www.linkedin.com/pub/dario-amodei/4/493/393)和[Jacob Steinhardt](http://cs.stanford.edu/~jsteinhardt/)。值得特别感谢还有[Kyunghyun Cho](http://www.kyunghyuncho.me/)，这哥们对图表的绘制给了我极大的帮助。
在写这篇博文之前，我尝试在我讲授的神经网络课程中利用两系列研讨会的时间来解释LSTMs。感谢每一位参与者，感觉大家的反馈。


