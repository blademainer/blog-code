---
title: 笔记：李群与李代数求导
mathjax: true
tags:
  - SLAM
  - 李代数
  - computer vision
categories: SLAM
abbrlink: 9eda79f0
date: 2018-12-04 23:40:56
---
{%note danger%}

最近一段时间在推$Jacobian$，会用到一些关于李代数求导的知识。参考高博《视觉slam十四讲》一书，在此总结一些常用的关于李群与李代数相关的知识点。

{%endnote%}

<!--more-->

## 前言

在SLAM中位姿是未知的，而我们需要解决什么样的相机位姿最符合当前观测数据这样的问题。一种典型的方式是把它构建成一个优化问题，求解最优的$R$,$t$，使得误差最小化。
旋转矩阵自身是带有约束的（正交且行列式为 1）。它们作为优化变量时，会引入额外的约束，使优化变得困难。通过李群——李代数间的转换关系，我们希望把位姿估计变成无约束的优化问题，简化求解方式。群（Group）是一种集合加上一种运算的代数结构，李群是指具有连续（光滑）性质的群，李群在相机姿态估计时具有重要意义，接下来主要讨论特殊正交群$SO(n)$与特殊欧式群$SE(n)$。

## 特殊正交群与特殊欧式群


$$
SO(n) = \{ \mathbf{R} \in \mathbb{R}^{n \times n} | \mathbf{R R}^T = \mathbf{I}, det(\mathbf{R})=1 \}
$$

$$
SE(3) = \left\{ \mathbf{T} = \left[ {\begin{array}{*{20}{c}} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{array}} \right]  \in \mathbb{R}^{4 \times 4} | \mathbf{R} \in SO(3), \mathbf{t} \in \mathbb{R}^3\right\}
$$
在李群中，我们使用矩阵来表达一个旋转和平移，这存在冗余的自由度。三维空间的旋转只有三自由度，旋转+平移有六自由度。因此，我们希望寻找一个没有冗余自由度（但是相应的存在奇异性）的表示，也就是李代数$\mathfrak{so}(3)$和$\mathfrak{se}(3)$。且无论是旋转还是变换矩阵，它们都是对加法不封闭的，但是对乘法是封闭的。

## 李代数的引出

对于任意旋转矩阵$R$，它必定满足：

$$\mathbf{R} \mathbf{R}^T＝\mathbf{I}.$$

考虑它随时间发生变化，即从$\mathbf{R}$变为$\mathbf{R(t)}$，它仍然满足如下如下等式：

$$\mathbf{R}(t) \mathbf{R}(t) ^T = \mathbf{I}$$

对两侧同时对时间求导数得：

$$\mathbf{\dot{R}} (t) \mathbf{R} {(t)^T} + \mathbf{R} (t) \mathbf{\dot{R}} {(t)^T} = 0 $$
则有：
$$\mathbf{\dot{R}} (t) \mathbf{R} {(t)^T} = - \left(  \mathbf{\dot{R}} (t) \mathbf{R} {(t)^T} \right)^T $$
可见$\mathbf{\dot{R}} (t) \mathbf{R} {(t)^T}$是一个反对称矩阵，将其记作$\mathbf{A}$，于是$\mathbf{A}^T=-\mathbf{A}$,所以它主对角线元素必为，而非对角线元素则只有三个自由度。我们一定可以找到一个这样的向量$\mathbf{a}=[a_1, a_2, a_3]^T$使得：
$$
{\mathbf{a}^ \wedge } = \mathbf{A} = \left[ {\begin{array}{*{20}{c}} 0& -a_3 & a_2\\ {a_3}&0& - {a_1}\\  - {a_2}&{a_1}&0 \end{array}} \right]
$$

其中$^{\wedge}$符号表示由向量转换为矩阵，反之我们也可以用$^{\vee}$符号定义由矩阵转换为向量的方式:
$$ { \mathbf{A}^ \vee } = \mathbf{a} $$

现在，由于$\mathbf{\dot{R}} (t) \mathbf{R} {(t)^T}$是一个反对称矩阵，所以我们一定可以找到一个三维向量$\mathbf{\phi} (t) \in \mathbb{R}^3$与之对应。于是我们有：
$$\mathbf{ \dot{R} } (t) \mathbf{R}(t)^T = \mathbf{\phi} (t) ^ {\wedge}$$
左右各右乘$\mathbf{R}(t)$，由于其正交性，有：
$$ \mathbf{ \dot{R} } (t)  = \mathbf{\phi} (t)^{\wedge} \mathbf{R}(t) =   \left[ {\begin{array}{*{20}{c}} 0&- {\phi _3}&{\phi _2}\\ {\phi _3}&0& - {\phi _1}\\ { - \phi _2}&{\phi _1}&0 \end{array}} \right] \mathbf{R} (t) $$

可以看到，每对旋转矩阵求一次导数，只需左乘一个矩阵$\mathbf{\phi} (t)^{\wedge}$即可。由于$\mathbf{\phi} (t)^{\wedge}$反映了的导数性质，故称它在的正切空间(tangent space)上。同时在$t_0$附近，设$\mathbf{\phi}$保持为常数$\mathbf{\phi}(t_0)=\mathbf{\phi}_0$，我们有：
$$ \mathbf{ \dot{R} } (t)  = \mathbf{\phi} (t_0)^{\wedge} \mathbf{R}(t)= \mathbf{\phi}_0^{\wedge} \mathbf{R}(t) $$
又因为初始值$\mathbf{ R } (0) = \mathbf{I} $对上式进行求解可得：

$$\label{eq:so3ode} \mathbf{R}(t) = \exp \left( \mathbf{\phi}_0^{\wedge} t\right) .$$

上式描述$\mathbf{R}$在局部的导数关系。

## 李代数 $\mathfrak{so}(3)$

上文提及的$\mathbf{\phi}$是一种李代数，$SO(3)$对应的李代数是定义在$\mathbb{R}^3$上的向量，我们记作$\mathbf{\phi}$，它 对应与一个反对称矩阵：

$$
\label{eq:phi} \mathbf{\Phi} = \mathbf{\phi}^{\wedge} = \left[ {\begin{array}{*{20}{c}} 	0&{ - \phi _3}&{\phi _2}\\ 	{\phi _3}&0&{ - \phi _1}\\ 	{ - \phi _2}&{\phi _1}&0 	\end{array}} \right] \in \mathbb{R}^{3 \times 3}
$$

由于它与反对称矩阵关系很紧密，在不引起歧义的情况下，就说的元素是3维向量或者3维反对称矩阵，不加区别：
$$\bbox[5px,border:2px solid red]
{
\mathfrak{so}(3) = \left\{ \Phi = \mathbf{\phi^\wedge} \in \mathbb{R}^{3 \times 3} | \mathbf{\phi} \in \mathbb{R}^3 \right\}
}
$$


## 李代数 $\mathfrak{se}(3)$

$SE(3)$对应的李代数为$\mathfrak{se}(3)$，$\mathfrak{se}(3)$定义在$\mathbb{R}^{6}$空间，其具体形式如下：
$$\bbox[5px,border:2px solid red]
{
\mathfrak{se}(3) = \left\{ \mathbf{ \xi } = \left[ \begin{array}{l} 	\mathbf{\rho} \\ 	\mathbf{\phi}  	\end{array} \right] \in \mathbb{R}^{6}, \mathbf{\rho} \in \mathbb{R}^{3},\mathbf{\phi} \in \mathfrak{so}(3),\mathbf{\xi}^\wedge  = \left[ {\begin{array}{*{20}{c}} 	\mathbf{\phi} ^ \wedge &\mathbf{\rho} \\ \mathbf{0}^T&0 \end{array}} \right] \in \mathbb{R}^{4 \times 4} \right\}
}
$$

$\mathfrak{se}(3)$是一个这样的六维向量，前三维表示平移，记作$\mathbf{\rho}$；后三维表示旋转，记作$\mathbf{\phi}$（有时候这两个参数会反过来，可也可以的）。

## 指数映射

$\mathfrak{so}(3)$以及$\mathfrak{se}(3)$的指数映射分别对应于$SO(3)$以及$SE(3)$，它们之间的转换关系可以由下图表示：

<img src="/posts/LieAlgebra/lieGroup.png">


## 李代数求导

### 对旋转矩阵李代数求导

对$\mathbf{R}$进行一次扰动$\Delta \mathbf{R}$，假设左扰动$\Delta \mathbf{R}$对应的李代数为$ {\boldsymbol \varphi}$，对$ {\boldsymbol \varphi}$求导，得到：

$$
\begin{aligned}
\frac{\partial ({\boldsymbol Rp})}{\partial {\boldsymbol \varphi}}
&= \lim_{\boldsymbol \varphi \to 0}
\frac{ \overbrace{ \exp ({\boldsymbol \varphi}^{\land}) }^{\color{Red}{可作泰勒展开}} \exp ({\boldsymbol \phi}^{\land}) {\boldsymbol p} - \exp ({\boldsymbol \phi}^{\land}) {\boldsymbol p}}
{ {\boldsymbol \varphi} }\\
&\approx \lim_{\boldsymbol \varphi \to 0}
\frac{({\boldsymbol I} + {\boldsymbol \varphi}^{\land}) \exp ({\boldsymbol \phi}^{\land}) {\boldsymbol p} - \exp ({\boldsymbol \phi}^{\land}) {\boldsymbol p}}
{ {\boldsymbol \varphi} }  \\
&= \lim_{\boldsymbol \varphi \to 0}
\frac{ {\boldsymbol \varphi}^{\land} {\boldsymbol {Rp}} }
{ {\boldsymbol \varphi} }  \\
&= \lim_{\boldsymbol \varphi \to 0}
\frac{ -({\boldsymbol {Rp}})^{\land} {\boldsymbol \varphi} }
{ {\boldsymbol \varphi} } \\
&= -({\boldsymbol {Rp}})^{\land}
\end{aligned}
$$

### 变换转矩阵李代数求导

假设空间点${\boldsymbol p}$经过一次变换${\boldsymbol T}$（对应的李代数为${\boldsymbol \xi}$）后变为 ${\boldsymbol Tp}$ 。当给${\boldsymbol T}$左乘一个扰动$\Delta {\boldsymbol T} = \exp (\delta {\boldsymbol \xi}^{\land})$，设扰动项的李代数为$\delta {\boldsymbol \xi} = [\delta {\boldsymbol \rho}, \delta {\boldsymbol \phi}]^{T}$，有：

$$
\begin{aligned}
\frac{\partial ({\boldsymbol {Tp}})}{\partial \delta{\boldsymbol \xi}}
&= \lim_{\delta{\boldsymbol \xi} \to 0}
\frac{ \overbrace{ \exp (\delta {\boldsymbol \xi}^{\land}) }^{\color{Red}{可作泰勒展开}}  \exp ({\boldsymbol \xi}^{\land}) {\boldsymbol p} - \exp ({\boldsymbol \xi}^{\land}) {\boldsymbol p}}
{ \delta {\boldsymbol \xi} } \\
&\approx \lim_{\delta{\boldsymbol \xi} \to 0}
\frac{ ({\boldsymbol I} + \delta {\boldsymbol \xi}^{\land}) \exp ({\boldsymbol \xi}^{\land}) {\boldsymbol p} - \exp ({\boldsymbol \xi}^{\land}) {\boldsymbol p} }
{ \delta {\boldsymbol \xi} } \\
&= \lim_{\delta{\boldsymbol \xi} \to 0}
\frac{  \delta {\boldsymbol \xi}^{\land} \exp ({\boldsymbol \xi}^{\land}) {\boldsymbol p}  }
{ \delta {\boldsymbol \xi} } \\
&= \lim_{\delta{\boldsymbol \xi} \to 0}
\frac{
\begin{bmatrix}
 \delta {\boldsymbol \phi}^{\land}  &   \delta {\boldsymbol \rho}     \\
     {\boldsymbol 0}^{T}                 &                      1                           \\
\end{bmatrix}
\begin{bmatrix}
   {\boldsymbol {Rp}} +  {\boldsymbol t}     \\
                                     1                                \\
\end{bmatrix}
}
{ \delta {\boldsymbol \xi} } \\
&= \lim_{\delta{\boldsymbol \xi} \to 0}
\frac{
\begin{bmatrix}
   \delta {\boldsymbol \phi}^{\land} ({\boldsymbol {Rp}} + {\boldsymbol t}) + \delta {\boldsymbol \rho}     \\
                                     0                                \\
\end{bmatrix}
}
{ \delta {\boldsymbol \xi} } \\
&=
\overbrace{
\begin{bmatrix}
 {\boldsymbol I}            &   -({\boldsymbol {Rp}} + {\boldsymbol t})^{\land}    \\
 {\boldsymbol 0}^{T}    &     {\boldsymbol 0}^{T}             \\
\end{bmatrix}
}^{\color{Red}{上式分块求导}}\\
&= ({\boldsymbol {Tp}})^{\bigodot}
\end{aligned}

$$

上式中运算符号$\bigodot$的含义：将一个齐次坐标的空间点变换成一个$4 \times 6$的矩阵。

## 补充

### $SE(3)$左扰
$$
\begin{aligned}
\rm{exp}\left( {\Delta \xi } \right){\rm{exp}}\left( \xi  \right)
& \approx \left( {I + {\left[ {\Delta \xi } \right]}_ \times } \right){\rm{exp}}(\xi) \\
&= \left( I_{4 \times 4} +
\left[
\begin{array}{*{20}{c}}
{  \left[ \Delta \phi  \right]}_{\times}   &   \Delta \rho    \\
0&0
\end{array}
\right]
\right)
\left[
\begin{array}{*{20}{c}}
 R   &   t    \\
0&1
\end{array}
\right] \\
&=
\left[
\begin{array}{*{20}{c}}
{  \left[ \Delta \phi  \right]}_{\times}+I_{3 \times 3}   &   \Delta \rho    \\
0&1
\end{array}
\right]
\left[
\begin{array}{*{20}{c}}
 R   &   t    \\
0&1
\end{array}
\right] \\
&=
\left[
\begin{array}{*{20}{c}}
 \left( \left[ \Delta \phi  \right]_{\times}+I_{3 \times 3} \right) R  &    \left( \left[ \Delta \phi  \right]_{\times}+I_{3 \times 3} \right) t + \Delta \rho    \\
0&1
\end{array}
\right]
\end{aligned}
$$

### $SE(3)$右扰

$$
\begin{aligned}
\rm{exp}\left( \xi  \right) \rm{exp}\left( {\Delta \xi } \right)
& \approx {\rm{exp}}(\xi) \left( {I + {\left[ {\Delta \xi } \right]}_ \times } \right)\\
&=
\left[
\begin{array}{*{20}{c}}
 R   &   t    \\
0&1
\end{array}
\right]
\left( I_{4 \times 4} +
\left[
\begin{array}{*{20}{c}}
{  \left[ \Delta \phi  \right]}_{\times}   &   \Delta \rho    \\
0&0
\end{array}
\right]
\right)\\
&=
\left[
\begin{array}{*{20}{c}}
 R   &   t    \\
0&1
\end{array}
\right]

\left[
\begin{array}{*{20}{c}}
{  \left[ \Delta \phi  \right]}_{\times}+I_{3 \times 3}   &   \Delta \rho    \\
0&1
\end{array}
\right] \\
&=
\left[
\begin{array}{*{20}{c}}
 R \left( \left[ \Delta \phi  \right]_{\times}+I_{3 \times 3} \right)  &   R \Delta \rho + t   \\
0&1
\end{array}
\right]

\end{aligned}
$$

