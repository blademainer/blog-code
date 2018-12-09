---
title: Light Field Depth Estimation
tags:
  - depth estimation
  - light field
comments: true
categories: 光场
copyright: false
mathjax: true
abbrlink: 6884
date: 2018-05-16 13:35:54

---


![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/street.jpg)

{%note success%}

本文将介绍光场领域进行深度估计的相关研究。
In this post, I'll introduce some depth estimation algorithms using Light field information. Here is some of the [code](https://github.com/Vincentqyw/Depth-Estimation-Light-Field).
研究生阶段的研究方向是光场深度信息的恢复。再此做一些总结，以便于让大家了解光场数据处理的一般步骤以及深度估计的相关的知识，光场可视化部分代码见[light-field-Processing](https://github.com/Vincentqyw/light-field-Processing)。如有任何疑问或者建议，请大家在评论区提出。
{%endnote%}

<!--more-->



# 什么是光场？
提到光场，很多人对它的解释模糊不清，在此我对它的概念进行统一表述。它的故事可以追溯到1936年，那是一个春天，Gershun写了一本名为**The Light Field**[^1]的鸿篇巨著（感兴趣的同学可以看看那个年代的论文），于是光场的概念就此诞生，但它并没有因此被世人熟知。经过了近六十年的沉寂，1991年Adelson[^2]等一帮帅小伙将光场表示成了如下的7维函数：

$$
P(\theta,\phi,\lambda,t,V_x,V_y,V_z). \tag{1}
$$

其中$(\theta,\phi)$表示球面坐标，$\lambda$表示光线的波长，$t$表示时间，$(V_x,V_y,V_z)$表示观察者的位置。
可以想象假如有这样一张由针孔相机拍摄的黑白照片，它表示：我们从**某个时刻**、**单一视角**观察到的**可见光谱**中某个**波长**的光线的平均。也就是说，它记录了通过$P$点的光强分布，光线方向可以由球面坐标$P(\theta,\phi)$或者笛卡尔坐标$P(x,y)$来表示。对于彩色图片而言，我们要添加光线的波长$\lambda$信息即变为$P(\theta,\phi,\lambda)$。按照同样的思路，彩色电影也就是增加了时间维度$t$，因此$P(\theta,\phi,\lambda,t)$。对于彩色全息电影而言，我们可以从任意空间位置$(V_x,V_y,V_z)$进行观看，于是其可以表达为最终的形式$P(\theta,\phi,\lambda,t,V_x,V_y,V_z)$。这个函数又被成为全光函数（Plenoptic Function）。
但是以上的七维的全光函数过于复杂，难以记录以及编程实现。所以在实际应用中我们对其进行简化处理。第一个简化是单色光以及时不变。可分别记录3原色以简化掉波长$\lambda$，可以通过记录不同帧以简化$t$，这样全光函数就变成了5D。第二个简化是Levoy[^3]等人（1996年）认为5D光场中还有一定的冗余，可以在自由空间（光线在传播过程中能量保持不变）中简化成4D。

## 光场参数化表示
参数化表示要解决的问题包括：1. 计算高效；2. 光线可控；3. 光线均匀采样。目前比较常用的表示方式是双平面法（$2PP$）[^3]，利用双平面法可以将光场表示为：$L(u,v,s,t)$。其中$(u,v)$为第一个平面，$(s,t)$是第二个平面。那么一条有方向的直线可以表示为连接$uv$以及$st$平面上任意两点确定的线，如下图所示：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/2pp-v1.png)

【注】：Levoy[^3]首先利用双平面法对光场进行表示，光线首先通过$uv$平面，然后再通过$st$平面。但是后来（同年）Gortler[^4]等人将其传播方向反了过来，导致后续研究者对此表述并不一致。与此同时，也有不少文献中也引入了$xy$坐标，例如著名的光场相机的缔造者N.G.博士的毕业论文。通常情况下，这指的是像平面坐标，即指的是由传感器得到的图像中像素的位置坐标。由于后续处理中都是针对图像而言，而对于光学结构以及光线的传播过程并不感兴趣。所以为了方便起见，我们在本文中统一采用Levoy[^3]的方式对**光场图像**进行表示，即$uv$表示角度分辨率，$xy$表示空间分辨率，即$L(u,v,x,y)$。同时在表示**光场**时用$L(u,v,s,t)$。有时候二者不做区分，注意即可。

## 光场的可视化

虽然光场由$7D$全光函数降维到$4D$，但是其结构还是很难直观想象。通过固定4D光场参数化表示$L(u,v,s,t)$中的某些变量，我们可以很容易地对光场进行可视化。我们通常认为$(u,v)$控制着某个视角的位置，即相机平面；而$(s,t)$控制着从某个视角观察到的图像。说简单点：$uv$控制角度分辨率，$st$控制空间分辨率（视野）。注意上式描述的是光线的表示方法，并没有涉及图像处理，所以没有$xy$。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/uvst2images.png" width="600" alt="uvst2images">

接下来讲解，几种常见的可视化方式（图片来源[^5]）。首先是**多视图法**。很容易理解，对于最简单的情况，首先固定$u=u^\*,v=v^\*$，我们可以得到多视角的某个视图$L(u^\*,v^\*,s,t)$，如下图所示：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/allviews.png)

第二种表示方法是**角度域法**，通过固定$s=s^\*,t=t^\*$可以得到某个宏像素$L(u,v,s^\*,t^\*)$，如下图所示：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/angular-patch.png)

第三种表示方法是**极线图法**，通过固定$v=v^\*,t=t^\*$可以得到极线图：$L(u,v^\*,s,t^\*)$，如下图中水平方向的图所示；同理固定$u=u^\*,s=s^\*$可以得到极线图：$L(u^\*,v,s^\*,t)$，如下图中竖直方向的图所示：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/epi.png)

最后，给出这几种方式的对应关系图（注意图中，$xy$对应于以上$st$，$st$对应于$uv$）。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/lf-all-view.png)


# 光场的获取

我们知道传统的相机只能采集来自场景某个方向的$2D$信息，那怎么才能够采集到光场信息呢？试想一下，当多个相机在多个不同视角同时拍摄时，这样我们就可以得到一个光场的采样（多视角图像）了。当然，这是容易想到的方法，目前已有多种获得光场的方式，如下表格中列举了其中具有代表性的方式[^5]。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/lf-acquisition.png)

# 光场深度估计算法分类

由上可知，光场图像中包含来自场景的多视角信息，这使得深度估计成为可能。相较于传统的多视角深度估计算法而言，基于光场的深度估计算法无需进行相机标定，这大大简化的深度估计的流程。但是由于光场图像巨大导致了深度估计过程占用大量的计算资源。同时这些所谓的多个视角之间虚拟相机的基线过短，从而可能导致误匹配的问题。以下将对多种深度估计算法进行分类并挑选具有代表性的算法进行介绍。

## 多视角立体匹配

根据光场相机的成像原理，我们可以将光场图像想像成为多个虚拟相机在多个不同视角拍摄同一场景得到图像的集合，那么此时的深度估计问题就转换成为多视角立体匹配问题。以下列举几种基于多视角立体匹配算法的深度估计算法[^8] [^9] [^10] [^20] [^21]。
<table>
	<tr>
	    <td rowspan="6"> MVS-based<br/>
	    <td><b>Approach</b></td>
	    <td><b>Main Feature</b></td>
	</tr>

	<tr>
	    <td>Jeon et al. <sup><a href="#fn_8" id="reffn_8">8</a></sup></td>
	    <td>Phase shift Sub-pixel</td>
	</tr>
	<tr>
	    <td>Yu et al. <sup><a href="#fn_9" id="reffn_9">9</a></sup></td>
	    <td>Line-assisted graph cut</td>
	</tr>
	<tr>
	    <td>Heber et al. <sup><a href="#fn_10" id="reffn_10">10</a></sup> <sup><a href="#fn_2" id="reffn_20">20</a></sup></td>
	    <td>PCA matching term</td>
	</tr>
    <tr>
	    <td>Chen et al. <sup><a href="#fn_21" id="reffn_21">21</a></sup></td>
	    <td>Scam: Bilateral Consistency Metric</td>
	</tr>

</table>

在这里介绍Jeon等人[^8]提出的基于相移的亚像素多视角立体匹配算法。

### 相移理论

该算法的核心就是用到了相移理论，即空域的一个小的位移在频域为原始信号的频域表达与位移的指数的幂乘积，即如下公式：

$$
\mathcal{F}\left\{I(x+\Delta x)\right\} = \mathcal{F}\left\{I(x)\right\}\exp^{2\pi j\Delta x}. \tag{2}
$$

所以，经过位移后图像可以表示为：

$$
I'(x)=I(x+\Delta x)={\mathcal{F}^{-1}\left\{\mathcal{F}\left\{I(x)\right\}\exp^{2 \pi j \Delta x}\right\}},\tag{3}
$$

面对Lytro相机窄基线的难点，通过相移的思想能够实现亚像素精度的匹配，在一定程度上解决了基线短的问题。那么大家可能好奇的是，如何将这个理论用在多视角立体匹配中呢？带着这样的疑问，继续介绍该算法。

### 匹配代价构建

为了能够使子视角图像之间进行匹配，作者设计了2中不同的代价量：Sum of Absolute Differences (SAD)以及Sum of Gradient Differences (GRAD)，最终通过加权的方式获得最终的匹配量$C$，它是位点$x$以及损失编号（可以理解成深度/视差层）$l$的函数，具体形式如下公式所示：

$$
C(x,l) = \alpha C_A(x,l)+(1-\alpha)C_G(x,l),\tag{4}
$$

其中$\alpha \in [0,1]$表示SAD损失量$C_A$以及SGD损失量$C_G$之间的权重。同时其中的$C_A$被定义为如下形式：

$$
C_A(x,l) = \sum_{u \in V}\sum_{x \in R_x}{\min\left( | I(u_c,x)-I(u,x+\Delta x(u,l))|,\tau _1\right)},\tag{5}
$$

其中的$R_x$表示在$x$点邻域的矩形区域；$\tau _1$是代价的截断值（为了增加算法鲁棒性）；$V$表示除了中心视角$u_c$之外的其余视角。上述公式通过比较中心视角图像$I(u_c,x)$与其余视角$I(u,x)$的差异来构建损失量，具体而言就是通过不断地在某个视角$I(u_i,x)$上$x$点的周围移动一个**小的距离**并于中心视角做差；重复这个过程直到比较完所有的视角(i=1...视角数目N)为止。此时会用到上节提及的相移理论以得到移动后的像素强度，注意上面提到的**小的距离**实际上就是公式中的$\Delta x$，它被定义为如下形式：

$$
\Delta x(u,l) = lk(u-u_c),\tag{6}
$$

其中k表示深度/视差层的单位（像素），$\Delta x$会随着任意视角与中心视角之间距离的增大而线性增加。同理，可以构造出第二个匹配代价量SGD，其基本形式如下所示：

$$
C_G(x,l) = \sum_{u \in V}\sum_{x \in R_x}\beta (u){\min\left( Diff_x(u_c,u,x,l),\tau _2\right)}+ \\ \ \ \ (1-\beta (u)){\min\left( Diff_y(u_c,u,x,l),\tau _2\right)},\tag{7}
$$

其中的$Diff_x(u_c,u,x,l)=|I_x(u_c,x)-I_x(u,x+\Delta x(u,l))|$表示子视角图像在x方向的上的梯度，同理$Diff_y$表示子孔径图像在y方向上的梯度；$\beta (u)$控制着这两个方向代价量的权重，它由任意视角与中心视角之间的相对距离表示：

$$
\beta (u) = \frac{|u-u_c|}{|u-u_c|+|v-v_c|}.\tag{8}
$$

至此，代价函数构建完毕。随后对于该代价函数利用边缘保持滤波器进行损失聚合，得到优化后的代价量。紧接着作者建立了一个多标签优化模型（GC求解）以及迭代优化模型对深度图进行优化，再此不做详细介绍。下面是其算法的分部结果：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/jeon-depth-step.png)


## 基于EPI的方法

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/2pp-epi-depth.png" width="100%">

不同于多视角立体匹配的方式，EPI的方式是通过分析光场数据结构的从而进行深度估计的方式。EPI图像中斜线的斜率就能够反映出场景的深度。上图中点P为空间点，平面$\Pi$为相机平面，平面$\Omega$为像平面。图中$\Delta u$与$\Delta x$的关系可以表示为如下公式[^6]：

$$
\Delta x=- \frac{f}{Z}\Delta u,\tag{9}
$$

假如固定相同的$\Delta u$，水平方向位移较大的EPI图中斜线所对应的视差就越大，即深度就越小。如下图所示，$\Delta x_2$>$\Delta x_1$，那么绿色线所对应的空间点要比红色线所对应的空间点深度小。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/epi-depth.png" width="100%">

以下列举几种基于EPI的深度估计算法[^11] [^12] [^13] [^14] [^15] [^24]。

<table>
	<tr>
	    <td rowspan="9"> EPI-based<br/>
	        
	    <td><b>Approach</b></td>
	    <td><b>Main Feature</b></td>
	</tr>

	<tr>
	    <td>Kim et al. <sup><a href="#fn_11" id="reffn_11">11</a></sup></td>
	    <td>Large scene reconstruction</td>
	</tr>

	<tr>
	    <td>Li et al. <sup><a href="#fn_12" id="reffn_12">12</a></sup></td>
	    <td>Sparse linear optimization</td>
	</tr>

	<tr>
	    <td>Krolla et al. <sup><a href="#fn_13" id="reffn_13">13</a></sup></td>
	    <td>Spherical light field</td>
	</tr>

	<tr>
	    <td>Wanner et al. <sup><a href="#fn_14" id="reffn_14">14</a></sup> <sup><a href="#fn_26" id="reffn_26">26</a></sup></td>
	    <td>Total variation(TV)</td>
	</tr>

	<tr>
	    <td>Diebode et al. <sup><a href="#fn_15" id="reffn_15">15</a></sup></td>
	    <td>Modified structure tensor</td>
	</tr>
    
    <tr>
	    <td>Zhang et al. <sup><a href="#fn_24" id="reffn_24">24</a></sup></td>
	    <td>Spinning Parallelogram Operator(SPO)</td>
	</tr>
    
</table>

在以上表格中最具代表性的算法是由wanner[^14]提出的结构张量法得到EPI图中线的斜率，如下公式所示：

$$
 J=
 \left[
 \begin{matrix}
   G_{\sigma}*(S_xS_x) & G_{\sigma}*(S_xS_y)  \\
   G_{\sigma}*(S_xS_y) & G_{\sigma}*(S_yS_y)
  \end{matrix}
  \right]=
  \left[
 \begin{matrix}
   J_{xx} & J_{xy}\\
   J_{xy} & J_{yy}
  \end{matrix}
  \right],
  \tag{10}
$$

其中$S=S_{y^\*,v^\*}$为极线图。$S_x$以及$S_y$表示极线图在x以及y方向上的梯度，$G_{\sigma}$表示高斯平滑算子。最终极线图中局部斜线的斜率可以表示成如下形式：
$$
 J=\left[
 \begin{matrix}
   \Delta x  \\
    \Delta v
  \end{matrix}
  \right]=
  \left[
 \begin{matrix}
  \sin \varphi\\
   \cos \varphi
  \end{matrix}
  \right],
  \tag{11}
$$
其中$\varphi = \frac{1}{2}\arctan\left(\frac{J_{yy}-J_{xx}}{2J_{xy}}\right)$。因此深度可以由公式（9）推出：

$$
Z=-f\frac{\Delta v}{\Delta x},  \tag{12}
$$

通常情况下，可以用一种更加简单的形式，如视差对其进行表示：

$$
d_{y^*,v^*}=-f/Z=\frac{\Delta x}{\Delta v}=\tan \phi .  \tag{13}
$$

至此，利用上述公式可以从EPI中估计出视差。

## 散焦及融合的方法

光场相机一个很重要的卖点是先拍照后对焦，这其实是根据光场剪切原理[^31]得到的。通过衡量像素在不同焦栈处的“模糊度”可以得到其对应的深度。以下列举几种基于散焦的深度估计算法[^7] [^16] [^17] [^22] [^23]。
<table>
	<tr>
	    <td rowspan="5"> Defocus-based<br/>
	    <td><b>Approach</b></td>
	    <td><b>Main Feature</b></td>
	</tr>
    
    <tr>
	    <td>Wang et al. <sup><a href="#fn_7" id="reffn_7">7</a></sup></td>
	    <td>Occlusion-aware</td>
	</tr>
    
	<tr>
	    <td>Tao et al. <sup><a href="#fn_16" id="reffn_16">16</a></sup></td>
	    <td>Defocus cues & Correspondence cues</td>
	</tr>
	<tr>
	    <td>Tao et al. <sup><a href="#fn_17" id="reffn_17">17</a></sup></td>
	    <td>Angular Coherence</td>
	</tr>
    
    <tr>
	    <td>Williem et al. <sup><a href="#fn_22" id="reffn_22">22</a></sup> <sup><a href="#fn_23" id="reffn_23">23</a></sup></td>
	    <td>Angular Entropy(AD, AE, CAD, CAE)</td>
	</tr>

</table>

这里介绍一个最具代表性的工作，由Tao等人[^16]在2013年提出，下图为其算法框架以及分部结果。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/tao2013.png)
![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/tao2013-results-step-by-step.png)

该工作其实就做了2件事情：1. 设计两种深度线索并估计原始深度；2. 置信度分析及MRF融合。以下对其进行具体介绍。
### 双线索提取

首先对光场图像进行重聚焦，然后得到一系列具有不同深度的焦栈。然后对该焦栈分别提取2个线索：散焦量以及匹配量。其中散焦量被定义为：

$$
D_{\alpha}(x)=\frac{1}{|W_{D}|}{\sum _{x' \in W_D} {|\Delta _x{L}_{\alpha}(x')|}},\tag{14}
$$

其中，$W_D$表示为当前像素领域窗口大小，$\Delta _x$表示水平方向拉式算子，$\overline{L}_{\alpha}(x)$为每个经过平均化后的重聚焦后光场图像，其表达式如下：

$$
\overline{L}_{\alpha}(x)=\frac{1}{N_{u}}\sum _{u'} {L}_{\alpha}(x,u'),\tag{15}
$$

其中$N_{u}$表示每一个角度域内像素的数目。然后匹配量被定义成如下形式：

$$
{C}_{\alpha}(x)=\frac{1}{|W_{C}|}\sum _{x' \in W_C} {\sigma}_{\alpha}(x'),\tag{16}
$$

其中，$W_C$表示为当前像素领域窗口大小，${\sigma}_{\alpha}(x)$表示每个宏像素强度的标准差，其表达式为：

$$
{\sigma}_{\alpha}(x)^2=\frac{1}{N_{u}}\sum _{u'} \left({L}_{\alpha}(x,u')-\overline{L}_{\alpha}(x)\right)^2.\tag{17}
$$

经过以上两个线索可以通过赢者通吃（Winner Takes All，WTA）得到两张原始深度图。注意：对这两个线索使用WTA时略有不同，通过最大化空间对比度可以得到散焦线索对应的深度，最小化角度域方差能够获得匹配量对应的深度。因此二者深度可以分别表示为如下公式：

$$
\alpha ^{*}_D(x)=\mathop{\arg\max}_{\alpha} \ \ {D}_{\alpha}(x).\tag{18}
$$

$$
\alpha ^{*}_C(x)=\mathop{\arg\min}_{\alpha} \ \ {C}_{\alpha}(x).\tag{19}
$$

### 置信度分析及深度融合

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/tao2013-confidence-analysis.png)

上图中显示了两个线索随着深度层次而变化的曲线。接下来的置信度分析用**主次峰值比例**（Peak Ratio）来定义每种线索的置信度，可表示为如下公式，其中的$\alpha ^{\*2}_D(x)$以及$\alpha ^{\*2}_C(x)$分别表示曲线的次峰值对应的深度层次。

$$
D_{conf}(x)=\frac{D_{\alpha ^{*}_D}(x)}{D_{\alpha ^{*2}_D}(x)}.\tag{20}
$$

$$
C_{conf}(x)=\frac{C_{\alpha ^{*}_C}(x)}{C_{\alpha ^{*2}_C}(x)}.\tag{21}
$$

接下来对原始深度进行MRF置信度融合：

$$
\mathop{minimize}_{Z} \ \ \sum_{source}\lambda _{source} \sum _i W_i|Z_i-Z_i^{source}|
$$

$$
+\lambda _{flat} \sum _{(x,y)}\left( \left |\frac{\partial Z_i}{\partial x}\right|_{(x,y)}+\left|\frac{\partial Z_i}{\partial y}\right|_{(x,y)}\right)
$$

$$
 + \lambda _{smooth} \sum _{(x,y)}|\Delta Z_i|_{(x,y)}.\tag{22}
$$

其中，$source$控制着数据项，即优化后的深度要与原始深度尽量保持一致。第二项与第三项分别控制着平坦性（flatness）与平滑性（smoothness）。注意：**平坦**的意思是物体表面没有凹凸变化的沟壑，例如魔方任一侧面，无论是否拼好（忽略中间黑线）。而**平滑**则表示在平坦的基础上物体表面没有花纹，如拼好的魔方的一个侧面。另外的$W$是权重量，此处选用的是每个线索的置信度。

$$
 \{Z_1^{source},Z_2^{source}\}=\{\alpha_C^{*},\alpha_D^{*}\}.\tag{23}
$$

$$
 \{W_1^{source},W_2^{source}\}=\{C_{conf},D_{conf}\}.\tag{24}
$$

至此，该算法介绍完毕，其代码已经放在我的[Github](https://github.com/Vincentqyw/Depth-Estimation-Light-Field/tree/master/LF_DC)。

## 学习的方法

目前而言，将深度学习应用于从双目或者单目中恢复深度已经不再新鲜，我在之前的[博文1](https://www.vincentqin.tech/2017/12/06/depth-estimation-using-deeplearning-1/)&[博文2](https://www.vincentqin.tech/2017/12/10/depth-estimation-using-deeplearning-2/)中有过对这类算法的介绍。但是将其应用于光场领域进行深度估计的算法还真是寥寥无几。不过总有一些勇敢的践行者去探索如何将二者结合，以下列举几种基于学习的深度估计算法[^18] [^19] [^25] [^27] [^28] [^29] [^30]。

<table>
	<tr>
	    <td rowspan="5"> Learning-based<br/>
	       <td><b>Approach</b></td>
	    <td><b>Main Feature</b></td>
	</tr>
	<tr>
	    <td>Johannsen et al. <sup><a href="#fn_18" id="reffn_18">18</a></sup> <sup><a href="#fn_25" id="reffn_25">25</a></sup></td>
	    <td>Sparse coding</td>
	</tr>
	<tr>
	    <td>Heber et al. <sup><a href="#fn_19" id="reffn_19">19</a></sup> <sup><a href="#fn_27" id="reffn_27">27</a></sup> <sup><a href="#fn_28" id="reffn_28">28</a></sup></td>
	    <td>CNN-based</td>
	</tr>
    
    <tr>
	    <td>Jeon et al. <sup><a href="#fn_29" id="reffn_29">29</a></sup></td>
	    <td>SAD, SGD, ZNCC, CT, Random Forests</td>
	</tr>
    
    <tr>
	    <td>Shin et al. <sup><a href="#fn_30" id="reffn_30">30</a></sup></td>
	    <td>4-Directions EPIs & CNN-based</td>
	</tr>
    
</table>

在此，我将对截止目前（2018年5月29日）而言，在HCI新数据集上表现最好的[EPINET: A Fully-Convolutional Neural Network Using Epipolar Geometry for Depth from Light Field Images](https://arxiv.org/abs/1804.02379)[^30]算法进行介绍，下图为该算法在各个指标上的表现情况。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/epinet-architecture.png)

算法摘要：光场相机能够同时采集空间光线的空域以及角度域信息，因此可以根据这种特性恢复出空间场景的涉深度。在本文中，作者提出了一种基于CNN的快速准确的光场深度估计算法。作者在设计网络时将光场的几何结构加入考虑，同时提出了一种新的数据增强算法以克服训练数据不足的缺陷。作者提出的算法能够在HCI 4D-LFB上在多个指标上取得Top1的成绩。作者指出，光场相机存在优势的同时也有诸多缺点，例如：基线超级短且空间&角度分辨率有一定的权衡关系。目前已有很多工作去克服这些问题，这样一来，深度图像的精度提升了，但是带来的后果就是计算量超级大，无法快速地估计出深度。因此作者为了解决精度以及速度之间权衡关系设计了该算法（感觉很有意义吧）。

上面表格中提到的诸如Johannsen[^18] [^25]以及Heber[^19] [^27] [^28]等人设计的算法仅仅考虑到了一个极线方向，从而容易导致低置信度的深度估计。为了解决他们算法中存在的问题，作者通过一种多流网络将不同的极线图像分别进行编码去预测深度。因为，每个极线图都有属于自己的集合特征，将这些极线图放入网络训练能够充分地利用其提供的信息。

### 光场图像几何特征

由于光场图像可以等效成多个视角图像的集合，这里的视角数目通常要比传统的立体匹配算法需要的视角数目多得多。所以，如果利用全部的视角做深度估计将会相当耗时，所以在实际情况下并不需要用到全部的视角。作者的思路就是想办法尽量减少实际要使用的视角数目，所以作者探究了不同角度域方向光场图像的特征。中心视角图像与其余视角的关系可以表示成如下公式：

$$
L(x,y,0,0)=L(x+d(x,y)*u,y+d(x,y)*v,u,v),\tag{25}
$$

其中$d(x,y)$表示中心视角到其相应相邻视角之间的视差（disparity）。令角度方向为$\theta$（$\tan \theta=v/u$），我们可以将上式改写成如下公式：

$$
L(x,y,0,0)=L(x+d(x,y)*u,y+d(x,y)*u \tan \theta,u,u \tan \theta).\tag{26}
$$

作者选择了四个方向$\theta$: 0<sup>o</sup>，45<sup>o</sup>，90<sup>o</sup>，135<sup>o</sup>，同时假设光场图像总视角数为$(2N+1)\times(2N+1)$。

### 网络设计

如本节开始的图所示的网络结构，该网络的开始为多路编码网络（类似于Flownet以及[Efficient Deep Learning for Stereo Matching](https://www.cs.toronto.edu/~urtasun/publications/luo_etal_cvpr16.pdf)[^32]），其输入为4个不同方向视角图像集合，每个方向对应于一路网络，每一路都可以对其对应方向上图像进行编码提取特征。每一路网络都由3个全卷积模块组成，因为全卷积层对逐点稠密预测问题卓有成效，所以作者将每一个全卷积模块定义为这样的卷积层的集合：**Conv-ReLU-Conv-BN-ReLU**，这样的话就可以在局部块中预逐点预测视差。为了解决基线短的问题，作者设计了非常小的卷积核：$2\times 2$，同时stride = 1，这样的话就可以测量$\pm 4$的视差。为了验证这种多路网络的有效性，作者同单路的网络做了对比试验，其结果如下表所示，可见多路网络相对于单路网络有10%的误差降低。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/viewpoints-effect.png" width="60%">

在完成多路编码之后，网络将这些特征串联起来组成更维度更高的特征。后面的融合网络包含8个卷积块，其目的是寻找经多路编码之后特征之间的相关性。注意除了最后一个卷积块之外，其余的卷积块全部相同。为了推断得到亚像素精度的视差图，作者将最后一个卷积块设计为**Conv-ReLU-Conv**结构。

最后，图像增强方式包括视角偏移（从9\*9视角中选7\*7，可扩展3\*3倍数据），图像旋转（90<sup>o</sup>，180<sup>o</sup>，270<sup>o</sup>），图像缩放（[0.25,1]），色彩值域变化（[0.5,2]），随机灰度变化，gamma变换（[0.8,1.2]）以及翻转，最终扩充了288倍。

以下为其各个指标上的性能表现：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/epinet-evaluation.png)

以上介绍了目前已有的深度估计算法不同类别中具有代表性的算法，它们不一定是最优的，但绝对是最容易理解其精髓的。到目前为止，光场领域已经有一大波人做深度估计的工作，利用传统的方式其精度很难再往上提高。随着深度学习的大热，已经有一批先驱开始用深度学习做深度估计，虽然在仿真数据上可以表现得很好，但实际场景千变万化，即使是深度学习的策略也不敢保证对所有的场景都有效。路漫漫其修远兮，深度估计道路阻且长。我认为以后的趋势应该是从EPI图像下手，然后利用CNN提feature（或者响应）；此时可供选择的工具有[KITTI Stereo](http://www.cvlibs.net/datasets/kitti/eval_scene_flow.php?benchmark=stereo)/[HCI新数据集算法比较](http://hci-lightfield.iwr.uni-heidelberg.de/)/[Middlebury Stereo](http://vision.middlebury.edu/stereo/)中较好的几种算法，我们需要总结其算法优势并迁移到光场领域中来。GPU这个Powerful的计算工具一定要用到光场领域中来，发挥出多线程的优势。否则传统的CPU对于动辄上百兆的数据有心无力。这样一来，深度图像不仅仅可以从精度上得以提高，而且深度估计的速度也会更快。至此，本文介绍到此结束。

# References
[^1]: Gershun, A. "[The Light Field](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/1.Gershun-1939-Journal_of_Mathematics_and_Physics.pdf)." Studies in Applied Mathematics 18.1-4(1939):51–151.

[^2]: Adelson, Edward H, and J. R. Bergen. "[The plenoptic function and the elements of early vision](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/2.The%20plenoptic%20function%20and%20the%20elements%20of%20early%20vision.pdf). " Computational Models of Visual Processing (1991):3-20.

[^3]: Levoy, Marc. "[Light field rendering](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/3.Light_Field_Rendering.pdf)." Conference on Computer Graphics and Interactive Techniques ACM, 1996:31-42.

[^4]: Gortler, Steven J., et al. "[The Lumigraph](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/4.The%20lumigraph.pdf)." Proc Siggraph 96(1996):43-54.

[^5]: Wu, Gaochang, et al. "[Light Field Image Processing: An Overview](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/5.Light-Field-Image-Processing-An%20Overview.pdf)." IEEE Journal of Selected Topics in Signal Processing PP.99(2017):1-1.

[^6]: Wanner, Sven, and B. Goldluecke. "[Variational Light Field Analysis for Disparity Estimation and Super-Resolution](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/6.Variational%20Light%20Field%20Analysis%20for%20Disparity%20Estimation%20and%20Super-Resolution.pdf)." IEEE Transactions on Pattern Analysis & Machine Intelligence 36.3(2013):1.

[^7]: Wang, Ting Chun, A. A. Efros, and R. Ramamoorthi. "[Occlusion-Aware Depth Estimation Using Light-Field Cameras](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/7.Occlusion-aware%20Depth%20Estimation%20Using%20Light-field%20Cameras.pdf)." IEEE International Conference on Computer Vision IEEE, 2016:3487-3495.

[^8]: Jeon, Hae Gon, et al. "[Accurate depth map estimation from a lenslet light field camera](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/8.Accurate%20Depth%20Map%20Estimation%20from%20a%20Lenslet%20Light%20Field%20Camera.pdf)." Computer Vision and Pattern Recognition IEEE, 2015:1547-1555.

[^9]: Yu, Zhan, et al. "[Line Assisted Light Field Triangulation and Stereo Matching](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/9.Line%20Assisted%20Light%20Field%20Triangulation%20and%20Stereo%20Matching.pdf)." IEEE International Conference on Computer Vision IEEE, 2014:2792-2799.

[^10]: Heber, Stefan, and T. Pock. "[Shape from Light Field Meets Robust PCA](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/10.Shape%20from%20Light%20Field%20meets%20Robust%20PCA.pdf)." Computer Vision – ECCV 2014. 2014:751-767.

[^11]: Kim, Changil, et al. "[Scene reconstruction from high spatio-angular resolution light fields](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/11.scene-reconstruction-from-high-spatio-angular-resolution-light-fields-siggraph-2013-compressed-kim-et-al.pdf)." Acm Transactions on Graphics 32.4(2017):1-12.

[^12]: Li, J., M. Lu, and Z. N. Li. "[Continuous Depth Map Reconstruction From Light Fields](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/12.Continuous%20Depth%20Map%20Reconstruction%20From%20Light%20Fields.pdf)." IEEE Transactions on Image Processing A Publication of the IEEE Signal Processing Society 24.11(2015):3257.

[^13]: Krolla, Bernd, et al. "[Spherical Light Fields](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/13.Spherical%20light%20field.pdf)." British Machine Vision Conference 2014.

[^14]: Wanner, Sven, C. Straehle, and B. Goldluecke. "[Globally Consistent Multi-label Assignment on the Ray Space of 4D Light Fields](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/14.Globally%20consistent%20multi-label%20assignment%20on%20the%20ray%20space%20of%204D%20light%20field.pdf)." IEEE Conference on Computer Vision and Pattern Recognition IEEE Computer Society, 2013:1011-1018.

[^15]: Diebold, Maximilian, B. Jahne, and A. Gatto. "[Heterogeneous Light Fields](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/15.Heterogeneous%20Light%20Fields.pdf)." Computer Vision and Pattern Recognition IEEE, 2016:1745-1753.

[^16]: Tao, M. W, et al. "[Depth from Combining Defocus and Correspondence Using Light-Field Cameras](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/16.Depth%20from%20Combining%20Defocus%20and%20Correspondence%20Using%20Light-Field%20Cameras.pdf)." IEEE International Conference on Computer Vision IEEE Computer Society, 2013:673-680.

[^17]: Tao, Michael W., et al. "[Depth from shading, defocus, and correspondence using light-field angular coherence](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/17.Depth%20from%20Shading,%20Defocus,%20and%20Correspondence%20Using%20Light-Field%20Angular%20Coherence.pdf)." Computer Vision and Pattern Recognition IEEE, 2015:1940-1948.

[^18]: Johannsen, Ole, A. Sulc, and B. Goldluecke. "[Variational Separation of Light Field Layers](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/18.Variational%20separation%20of%20light%20field%20layers.pdf)." (2015).

[^19]: Heber, Stefan, and T. Pock. "[Convolutional Networks for Shape from Light Field](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/19.Heber_Convolutional_Networks_for_CVPR_2016_paper.pdf)." Computer Vision and Pattern Recognition IEEE, 2016:3746-3754.

[^20]: Heber, Stefan, R. Ranftl, and T. Pock. "[Variational Shape from Light Field](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/20.Variational%20Shape%20from%20Light%20Field.pdf)." Energy Minimization Methods in Computer Vision and Pattern Recognition. Springer Berlin Heidelberg, 2013:66-79.

[^21]: Chen, Can, et al. "[Light Field Stereo Matching Using Bilateral Statistics of Surface Cameras](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/21.Light%20Field%20Stereo%20Matching%20Using%20Bilateral%20Statistics%20of%20Surface%20Cameras-Can_CVPR14_stereo.pdf)." IEEE Conference on Computer Vision and Pattern Recognition IEEE Computer Society, 2014:1518-1525.

[^22]: Williem W, Kyu P I. "[Robust light field depth estimation for noisy scene with occlusion](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/22.Williem_Robust_Light_Field_CVPR_2016_paper.pdf)." Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2016:4396-4404.

[^23]: Williem W, Park I K, Lee K M. "[Robust light field depth estimation using occlusion-noise aware data costs](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/23.TPAMI2017_Williem.pdf)." IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), 2017(99):1-1.

[^24]: Zhang S, Sheng H, Li C, et al. "[Robust depth estimation for light field via spinning parallelogram operator](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/24.Robust%20Depth%20Estimation%20for%20Light%20Field%20via%20Spinning%20Parallelogram%20Operator.pdf)." Computer Vision and Image Understanding, 2016, 145:148-159.

[^25]: Johannsen O, Sulc A, Goldluecke B. "[What sparse light field coding reveals about scene structure](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/25.What%20Sparse%20Light%20Field%20Coding%20Reveals%20about%20Scene%20Structure.pdf)." In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2016(1/3/4):3262-3270.

[^26]: Wanner S, Goldluecke B. "[Reconstructing reflective and transparent surfaces from epipolar plane images](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/26.Reconstructing%20reflective%20and%20transparent%20surfaces%20from%20epipolar%20plane%20images.pdf)." In German Conference on Pattern Recognition (Proc. GCPR), 2013:1-10.

[^27]: Heber S, Yu W, Pock T. "[U-shaped networks for shape from light field](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/27.U-shaped%20Networks%20for%20Shape%20from%20Light%20Field.pdf)." British Machine Vision Conference, 2016, 37:1-12.

[^28]: Heber S, Yu W, Pock T. "[Neural EPI-Volume networks for shape from light field](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/28.Neural%20EPI-volume%20Networks%20for%20Shape%20from%20Light%20Field.pdf)." IEEE International Conference on Computer Vision (ICCV), IEEE Computer Society, 2017:2271-2279.

[^29]: Jeon H G, Park J, Choe G, et.al. "[Depth from a Light Field Image with Learning-based Matching Costs](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/29.Depth%20from%20a%20Light%20Field%20Image%20with%20Learning-based%20Matching%20Costs.pdf)." IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), 2018.

[^30]: Shin C, Jeon H G, Yoon Y. "[EPINET: A Fully-Convolutional Neural Network for Light Field Depth Estimation Using Epipolar Geometry](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/30.EPINET%20A%20fully-Convolutional%20Neural%20Network%20Using%20Epipolar%20Geometry%20for%20Depth%20from%20Light%20Field%20Images.pdf)." Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2018.

[^31]: Ng, Ren. "[Digital light field photography](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/31.Digital%20light%20field%20photography.pdf)." 2006, 115(3):38-39.

[^32]: Luo, Wenjie, A. G. Schwing, and R. Urtasun. "[Efficient Deep Learning for Stereo Matching](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/light-field-depth-estimation/32.Efficient%20deep%20learning%20for%20stereo%20matching.pdf)." IEEE Conference on Computer Vision and Pattern Recognition IEEE Computer Society, 2016:5695-5703.