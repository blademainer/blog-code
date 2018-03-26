---
title: 立体视觉综述：Stereo Vision Overview
tags:
  - stereo matching
  - computer vision
abbrlink: 9351
date: 2018-03-26 15:03:55
mathjax: true

---



![](https://source.unsplash.com/random/1600x900)

文中主要介绍以下几个方面的内容：

- Introduction to stereo vision
- Overview of a stereo vision system
- Algorithms for visual correspondence
- Computational optimizations
- Hardware implementation
- Applications

<!--more-->


## 什么是立体视觉

- 是一个能够从双目或者多目相机中提取深度图像的技术
- 在计算机视觉领域很火爆的研究话题
- 这与以下几个方面的相关：双目立体视觉系统、稠密立体算法、立体视觉应用
- 偏好能够实时或者硬件实现

## 单目相机

<img src="http://p66ri5yke.bkt.clouddn.com/p6.png" width=1200px>如图所示的是单目摄像机的拍摄原理，右侧实际场景中的P与Q点会同时汇聚在图像中的一点，同样的遮挡问题出现在PQ连线的所有点。

## 双目相机
对于双目相机，$O_R$和$O_T$分别是左右相机的光学中心，对于在参考相机像平面上被汇聚的两点（p和q），在目标相机像平面上会被区分开来，那么我们可以找到双目或者多目相机中匹配的点利用三角相似原理来估计深度。那么我们怎么寻找相对应的点呢？2D范围的寻找？
<img src="http://p66ri5yke.bkt.clouddn.com/p8.png" width=1200px>

不，多亏了极线约束，我们可以在**1D**范围上进行搜索。

### 极线约束

<img src="http://p66ri5yke.bkt.clouddn.com/p9.png" width=1200px>
- 对于参考图像R而言，现实场景中的P与Q点在其像平面${\pi}_R$上被投影成为一个点p=q。
- 极线约束规定，属于（红色）视线的点对应位于目标图像T的图像平面${\pi}_T$上的绿线上。

<img src="http://p66ri5yke.bkt.clouddn.com/p10.png" width=1200px>
由极线约束可知，我们可以将原来的匹配点搜索范围由2D，我们将上述变化摆放成更容易理解的形式，可以发现对应点的匹配问题转换成了在同一条扫描线上的匹配问题。

<img src="http://p66ri5yke.bkt.clouddn.com/p11.png" width=1200px>
可以发现相机的摆放姿势影响着扫描线的方向。上图A中相机水平呈一定角度摆放，其扫描线为其右图所示，它为与水平倾斜的扫描线。假如两个相机平行摆放的话，其拍出来匹配对是扫描线已经对齐了的。

### 深度与视差

<img src="http://p66ri5yke.bkt.clouddn.com/p12.png" width=1200px>
如图为扫描线已经对齐了的匹配对，可以发现：$PO_RO_T$与$Ppp'$是相似三角形，由于相似三角形原理，我们可以知道：
$$\frac{b}{Z}=\frac{(b+x_T)-x_R}{Z-f}$$

其中，$x_R-x_T$就是视差，Z表示深度，B为基线，f是焦距。

<img src="http://p66ri5yke.bkt.clouddn.com/p13.png" width=1200px>
<img src="http://p66ri5yke.bkt.clouddn.com/p14-1.png" width=1200px>

所谓视差就是匹配对中对应点之间x方向上的差异，我们可以将这种差异转换成为灰度图（越近越白）。如上图最后一个图所示。
<img src="http://p66ri5yke.bkt.clouddn.com/p14-2.png" width=1200px>

距离相机越近的话，视差就越大。

### 视界

<img src="http://p66ri5yke.bkt.clouddn.com/p15.png" width=1200px>

图中双摄装置，基线为b，焦距为f，那么双摄的视界被视差范围所限定{$d_{min},d_{max}$}，如图中绿色区域。

<img src="http://p66ri5yke.bkt.clouddn.com/p16.png" width=1200px>

- 深度通过利用立体匹配系统，将视差离散成一系列平行的平面来测量的；每一层平面对应着一个视差。
- 可以通过超像素的方法得到效果更好的深度图。

<img src="http://p66ri5yke.bkt.clouddn.com/p17.png" width=1200px>
图为5个视差{$d_{min},d_{min}+4$}组成的视场。

<img src="http://p66ri5yke.bkt.clouddn.com/p18.png" width=1200px>
- 图为5个视差{$\Delta+d_\{min\},\Delta+d_\{min}+4$\}组成的视场
- $\Delta>0$时，视场收缩并向相机靠近

## 深度估计

<img src="http://p66ri5yke.bkt.clouddn.com/p21.png" width=1200px>
图中为传统算法以及ICCV2011当时最好的结果。可以发现，能够达到较好的视差是具有挑战性的。下面将要展示视差估计的基本流程。

<img src="http://p66ri5yke.bkt.clouddn.com/p22.png" width=1200px>
通过双摄设备采集图像，此时图像是存在镜头畸变的，在进行扫描线对齐之前要进行离线标定以消除镜头畸变。扫描线对齐的过程叫做**镜头矫正**（rectificaition），经过这步之后就可以进行1D的匹配点搜索（stereo correspondence）了。随后通过三角形相似原理得到相应的深度/视差图。


### 离线标定


<img src="http://p66ri5yke.bkt.clouddn.com/p23.png" width=1200px>
标定的目标是寻找：
- 相机内参：焦距、图像中心、镜头畸变参数
- 相机外参：排列相机使其对齐的参数

注意的是，相机标定的话一般需要10对以上的图像（通常拍摄棋盘格图像，利用张氏标定法进行标定）。
- 标定程序可以见[Opencv](39)和Matlab[40]。
- 更为详细的介绍参见[20,21,22]。

<img src="http://p66ri5yke.bkt.clouddn.com/p25.png" width=1200px>
<img src="http://p66ri5yke.bkt.clouddn.com/p26.png" width=1200px>
### 匹配矫正

<img src="http://p66ri5yke.bkt.clouddn.com/p27.png" width=1200px>
利用标定步骤得到的相机的内参对相机镜头畸变进行校正，同时对其扫描线。

### 立体匹配

<img src="http://p66ri5yke.bkt.clouddn.com/p28.png" width=1200px>
目标：从匹配对中寻找对应的点，反映在图像中就是视差图像。

### 三角测量

<img src="http://p66ri5yke.bkt.clouddn.com/p29.png" width=1200px>
给定视差图像，基线长度以及焦距可以通过三角计算得到当前位置对应的3D位置。

## 立体匹配的挑战性

- 光度失真以及噪声

<img src="http://p66ri5yke.bkt.clouddn.com/p37-1.png" width=1200px>
### 高光表面

<img src="http://p66ri5yke.bkt.clouddn.com/p37-2.png" width=1200px>

### 透视收缩

<img src="http://p66ri5yke.bkt.clouddn.com/p38.png" width=1200px>
### 透视变形

<img src="http://p66ri5yke.bkt.clouddn.com/p39-1.png" width=1200px>
### 无纹理区域

<img src="http://p66ri5yke.bkt.clouddn.com/p39-2.png" width=1200px>
### 重复/混淆区域

<img src="http://p66ri5yke.bkt.clouddn.com/p40.png" width=1200px>
### 透明物体

<img src="http://p66ri5yke.bkt.clouddn.com/p41-1.png" width=1200px>
### 遮挡区以及不连续区域（1）

<img src="http://p66ri5yke.bkt.clouddn.com/p41-2.png" width=1200px>
### 遮挡区以及不连续区域（2）

<img src="http://p66ri5yke.bkt.clouddn.com/p42.png" width=1200px>

## Middlebury数据集
[Middlebury数据集](http://vision.middlebury.edu/stereo/eval3/)提供了一套可供深度估计的数据集以及评价系统，深度估计算法可在该数据集上进行测试性能。2003年的数据集提供了Tsukuba, Venus, Teddy and Cones这几个场景的匹配对。

<img src="http://p66ri5yke.bkt.clouddn.com/p44.png" width=1200px>


## 匹配问题
立体匹配的算法可以分成以下几个步骤：

1. 匹配量/损失计算
2. 损失聚合
3. 视差计算/优化
4. 视差精化

- 局部算法包括：
1->2->3（简单的WTA算法）
- 全局算法包括：
1（->2）->3（全局或者半全局算法）

### 数据预处理

数据预处理是为了消除图像的光度失真。常见的操作有：
- LoG滤波器[41]
- 消减附近像素中计算的平均值[42]
- 双边滤波
- 统计变换

最简单的立体匹配算法如下图所示，逐像素地计算SAD匹配损失；然后通过WTA得到初始视差，但是此时得到的视差质量是很差的。那么如何提高深度图像的质量呢？通常来说有两种不同类别的策略。
<img src="http://p66ri5yke.bkt.clouddn.com/p47.png" width=1200px>
<img src="http://p66ri5yke.bkt.clouddn.com/p48.png" width=1200px>


- 局部算法。同样是利用到了简单的WTA提取到初始视差，但是通过计算窗口内的损失量提高了信噪比。有时需会加入平滑项。Steps 1+2 (+ WTA)
<img src="http://p66ri5yke.bkt.clouddn.com/p50.png" width=1200px>
- 全局/半全局算法。寻找能够使得能量函数的最小值的视差以得到逐点视差。Steps 1+ Step3。（有时，损失函数需要聚合）

两种算法都假设了匹配对是平滑的，但有时，该假设并不成立。这个假设在局部算法中隐晦地提及，却在全局算法中明确地建模，如下形式。
$$E(d)=E_{data}(d)+E_{smooth}(d)$$

## 损失量的计算

### 逐像素的匹配误差
- 绝对值误差
$$e(x,y,d)=|I_R(x,y)-I_T(x+d,y)|$$

- 平方误差
$$e(x,y,d)=(I_R(x,y)-I_T(x+d,y))^2$$

- 鲁棒匹配子（M-estimators）
如截断绝对误差（truncated absolute differences (TAD)）可以减少离群点的干扰：
$$e(x,y,d)=min\{|I_R(x,y)-I_T(x+d,y),T\}$$

- 相异性测量对于图像噪声不敏感（Birchfield and Tomasi[27]）

<img src="http://p66ri5yke.bkt.clouddn.com/p52.png" width=1200px>
视差空间图像（DSI）是一个如下图所示张量（$W\times H\times(d_{max}-d_{min})$）
其中的每一个元素$C(x,y,d)$表示$I_R(x_R,y)$与$I_T(x_R+d,y)$之间的匹配度。

<img src="http://p66ri5yke.bkt.clouddn.com/p53.png" width=1200px>
### 区域匹配损失

- 绝对误差和（Sum of Absolute differences (SAD)）
$$C(x,y,d)=\sum_{x\in S}|I_R(x,y)-I_T(x+d,y)|$$
- 绝对平方和（Sum of Squared differences (SSD)）
$$C(x,y,d)=\sum_{x\in S}\left(I_R(x,y)-I_T(x+d,y)\right)^2$$
- 截断绝对误差和（Sum of truncated absolute differences (STAD)）
$$C(x,y,d)=\sum_{x\in S}\{|I_R(x,y)-I_T(x+d,y),T\}$$
- Normalized Cross Correlation [57]
- Zero mean Normalized Cross Correlation [58]
- Gradient based MF [59]
- Non parametric [60,61]
- Mutual Information [30]
- Combination of matching costs

## 损失聚合

未完待续...

## 参考文献
[1] F. Tombari, S. Mattoccia, L. Di Stefano, E. Addimanda, Classification and evaluation of cost aggregation methods for stereo correspondence, IEEE International Conference on Computer Vision and Pattern Recognition (CVPR 2008)
[2] Y. Boykov, O. Veksler, and R. Zabih, A variable window approach to early vision IEEE Trans. PAMI, 20(12):1283–1294, 1998
[3] S. Chan, Y. Wong, and J. Daniel, Dense stereo correspondence based on recursive adaptive size multi-windowing In Proc. Image and Vision Computing New Zealand (IVCNZ’03), volume 1, pages 256–260, 2003
[4] C. Demoulin and M. Van Droogenbroeck, A method based on multiple adaptive windows to improve the determination
of disparity maps. In Proc. IEEE Workshop on Circuit, Systems and Signal Processing, pages 615–618, 2005
[5] M. Gerrits and P. Bekaert. Local Stereo Matching with Segmentation-based Outlier Rejection In Proc. Canadian Conf. on Computer and Robot Vision (CRV 2006), pages 66-66, 2006.
[6] M. Gong and R. Yang. Image-gradient-guided real-time stereo on graphics hardware In Proc. Int. Conf. 3D Digital Imaging and Modeling (3DIM), pages 548–555, 2005
[7] H. Hirschmuller, P. Innocent, and J. Garibaldi, Real-time correlation-based stereo vision with reduced border errors Int. Journ. of Computer Vision, 47:1–3, 2002
[8] S. Kang, R. Szeliski, and J. Chai, Handling occlusions in dense multi-view stereo In Proc. Conf. on Computer Vision and Pattern Recognition (CVPR 2001), pages 103–110, 2001
[9] J. Kim, K. Lee, B. Choi, and S. Lee. A dense stereo matching using two-pass dynamic programming with generalized ground control points, In Proc. Conf. on Computer Vision and Pattern Recognition (CVPR 2005), pages 1075–1082, 2005
[10] F. Tombari, S. Mattoccia, and L. Di Stefano, Segmentation-based adaptive support for accurate stereo correspondence PSIVT 2007
[11] D. Scharstein and R. Szeliski, A taxonomy and evaluation of dense two-frame stereo correspondence algorithms Int. Jour. Computer Vision, 47(1/2/3):7–42, 2002.
[12] O. Veksler. Fast variable window for stereo correspondence using integral images, In Proc. Conf. on Computer Vision
and Pattern Recognition (CVPR 2003), pages 556–561, 2003
[13] Y. Xu, D. Wang, T. Feng, and H. Shum, Stereo computation using radial adaptive windows, In Proc. Int. Conf. on Pattern Recognition (ICPR 2002), volume 3, pages 595–598, 2002
[14] K. Yoon and I. Kweon, Adaptive support-weight approach for correspondence search, IEEE Trans. PAMI, 28(4):650–656,2006
[15] D. Scharstein and R. Szeliski, http://vision.middlebury.edu/stereo/eval/
[16 ] A. Ansar, A. Castano, L. Matthies, Enhanced real-time stereo using bilateral filtering
IEEE Conference on Computer Vision and Pattern Recognition 2004
[17] D. Scharstein and R. Szeliski, 􀀃High-accuracy stereo depth maps using structured light. In IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2003), volume 1, pages 195-202
[18] D. Scharstein and C. Pal. Learning conditional random fields for stereo.
In IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2007)
[19] H. Hirschmüller and D. Scharstein. Evaluation of cost functions for stereo matching.
In IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR 2007)
[20 ] E. Trucco, A. Verri, Introductory Techniques for 3-D Computer Vision, Prentice Hall, 1998
[21] R.I.Hartley, A. Zisserman, Multiple View Geometry in Computer Vision, Cambridge University Press, 2000
[22] G. Bradsky, A. Kaehler, Learning Opencv, O’Reilly, 2008
[23] OpenCV Computer Vision Library, http://sourceforge.net/projects/opencvlibrary/
[24] Jean-Yves Bouguet , Camera Calibration Toolbox for Matlab, http://www.vision.caltech.edu/bouguetj/calib_doc/
[25] M. A. Fischler and R. C. Bolles, Random Sample Consensus: A Paradigm for Model Fitting with Applications to Image
Analysis and Automated Cartography, Comm. of the ACM 24: 381–395, June 1981
[26] Z. Wang and Z. Zheng, A region based stereo matching algorithm using cooperative optimization
IEEE CVPR 2008
[27] S. Birchfield and C. Tomasi. A pixel dissimilarity measure that is insensitive to image sampling.
IEEE Transactions on Pattern Analysis and Machine Intelligence, 20(4):401-406, April 1998
[28] J. Zabih, J. Woodfill, Non-parametric local transforms for computing visual correspondence. European
Conf. on Computer Vision, Stockholm, Sweden, 151–158
[29 ] S. Mattoccia, F. Tombari, and L. Di Stefano, Stereo vision enabling precise border localization within a scanline
optimization framework, ACCV 2007
[30 H. Hirschmüller. Stereo vision in structured environments by consistent semi-global matching.
CVPR 2006, PAMI 30(2):328-341, 2008
[31] F. Tombari, S. Mattoccia, L. Di Stefano, F. Tonelli, Detecting motion by means of 2D and 3D information
ACCV'07 Workshop on Multi-dimensional and Multi-view Image Processing (ACCV 2007 WS)
[32] P. Azzari, L. Di Stefano, F. Tombari, S. Mattoccia, Markerless augmented reality using image mosaics
International Conference on Image and Signal Processing (ICISP 2008)
[33 ] Li Zhang, Brian Curless, and Steven M. Seitz Spacetime Stereo: Shape Recovery for Dynamic Scenes
IEEE Computer Society Conference on Computer Vision and Pattern Recognition (CVPR 2003), pp. 367-374
[34 ] J. Davis, D. Nehab, R. Ramamoothi, S. Rusinkiewicz. Spacetime Stereo : A Unifying Framework for Depth from
Triangulation, IEEE Trans. On Pattern Analysis and Machine Intelligence (PAMI), vol. 27, no. 2, Feb 2005
[35] F. Tombari, L. Di Stefano, S. Mattoccia, A. Zanetti, Graffiti detection using a Time-Of-Flight camera
Advanced Concepts for Intelligent Vision Systems (ACIVS 2008)
[36] L. Di Stefano, F. Tombari, A. Lanza, S. Mattoccia, S. Monti, Graffiti detection using two views
ECCV 2008 - 8th International Workshop on Visual Surveillance (VS 2008)
[37] T. Darrell, D. Demirdijan, N. Checka, P. Felzenszwalb, Plan-view trajectory estimation with dense stereo background
models, International Conference on Computer Vision (ICCV 2001), 2001
[38] M. Harville, Stereo person tracking with adaptive plan-view templates of height and occupancy statistics
Image and Vision Computing 22(2) pp 127-142, February 2004
[39] OpenCV Computer Vision Library, http://sourceforge.net/projects/opencvlibrary/
[40] Jean-Yves Bouguet , Camera Calibration Toolbox for Matlab, http://www.vision.caltech.edu/bouguetj/calib_doc/
[41 ] T. Kanade, H. Kato, S. Kimura, A. Yoshida, and K. Oda, Development of a Video-Rate Stereo Machine
International Robotics and Systems Conference (IROS '95), Human Robot Interaction and Cooperative Robots, 1995
[42 ] O. Faugeras, B. Hotz, H. Mathieu, T. Viville, Z. Zhang, P. Fua, E. Thron, L. Moll, G. Berry,
Real-time correlation-based stereo: Algorithm. Implementation and Applications, INRIA TR n. 2013, 1993
[43] F. Crow, Summed-area tables for texture mapping, Computer Graphics, 18(3):207–212, 1984
[44] M. Mc Donnel. Box-filtering techniques, Computer Graphics and Image Processing, 17:65–70, 1981
[45] A. Goshtasby, 2-D and 3-D Image Registration for Medical, Remote Sensing and Industrial Applications
New York: Wiley, 2005
[46] B. Zitova and J. Flusser, Image registration methods:A survey, Image Vision Computing, vol. 21, no. 11,
pp. 977–1000, 2003
[47] Changming Sun, Recursive Algorithms for Diamond, Hexagon and General Polygonal Shaped Window Operations
Pattern Recognition Letters, 27(6):556-566, April 2006
[48] L. Di Stefano, M. Marchionni, S. Mattoccia, A fast area-based stereo matching algorithm, Image and Vision Computing,
22(12), pp 983-1005, October 2004
[49] L. Di Stefano, M. Marchionni, S. Mattoccia, A PC-based real-time stereo vision system, Machine Graphics & Vision,
13(3), pp. 197-220, January 2004
[50] D. Comaniciu and P. Meer, Mean shift: A robust approach toward feature space analysis, IEEE Transactions on Pattern
Analysis and Machine Intelligence, 24:603–619, 2002
[51] C. Tomasi and R. Manduchi. Bilateral filtering for gray and color images. In ICCV98, pages 839–846, 1998
[52] V. Kolmogorov and R. Zabih, Computing visual correspondence with occlusions using graph cuts, ICCV 2001
[53] A. Klaus, M. Sormann and K. Karner, Segment-based stereo matching using belief propagation and a self-adapting
dissimilarity measure, ICPR 2006
[54] Z. Wang and Z. Zheng, A region based stereo matching algorithm using cooperative optimization, CVPR 2008
[55] L. Di Stefano, S. Mattoccia, Real-time stereo within the VIDET project Real-Time Imaging, 8(5), pp. 439-453, Oct.
2002
[56] F. Tombari, S. Mattoccia, L. Di Stefano, Full search-equivalent pattern matching with Incremental Dissimilarity
Approximations, IEEE Transactions on Pattern Analysis and Machine Intelligence, 31(1), pp 129-141, January 2009
[57] S. Mattoccia, F. Tombari, L. Di Stefano, Fast full-search equivalent template matching by Enhanced Bounded
Correlation, IEEE Transactions on Image Processing, 17(4), pp 528-538, April 2008
[58] L. Di Stefano, S. Mattoccia, F. Tombari, ZNCC-based template matching using Bounded Partial Correlation
Pattern Recognition Letters, 16(14), pp 2129-2134, October 2005
[59] F. Tombari, L. Di Stefano, S. Mattoccia, A. Galanti, Performance evaluation of robust matching measures
3rd International Conference on Computer Vision Theory and Applications (VISAPP 2008)
[60] R. Zabih, J John Woodll Non-parametric Local Transforms for Computing Visual Correspondence, ECCV 1994
[61] D. N. Bhat, S. K. Nayar, Ordinal measures for visual correspondence, CVPR 1996
[62] D. G. Lowe, Distinctive image features from scale-invariant keypoints, International Journal of Computer Vision, 60, 2
(2004), pp. 91-110
[63] R.Szeliski, R. Zabih, D. Scharstein, O. Veksler, V. Kolmogorov, A. Agarwala, M. Tappen, C. Rother, A Comparative
Study of Energy Minimization Methods for Markov Random Fields with Smoothness-Based Priors, IEEE Transactions on
Pattern Analysis and Machine Intelligence, 30, 6, June 2008, pp 1068-1080
[64] F. Tombari, S. Mattoccia, L. Di Stefano, E. Addimanda, Near real-time stereo based on effective cost aggregation
International Conference on Pattern Recognition (ICPR 2008)
[65] S. Mattoccia, S. Giardino,A. Gambini, Accurate and efficient cost aggregation strategy for stereo correspondence
based on approximated joint bilateral filtering, Asian Conference on Computer Vision (ACCV 2009), September 23-27
2009, Xiang, China
[66] S. Mattoccia, A locally global approach to stereo correspondence, 3D Digital Imaging and Modeling (3DIM 2009),
pp 1763-1770, October 3-4, 2009, Kyoto, Japan
[67] S. Mattoccia, Improving the accuracy of fast dense stereo correspondence algorithms by enforcing local consistency
of disparity fields, 3D Data Processing, Visualization, and Transmission (3DPVT 2010), 17-20 May 2010, Paris, France
[68] S. Mattoccia, Fast locally consistent dense stereo on multicore, Sixth IEEE Embedded Computer Vision Workshop
(ECVW2010), CVPR workshop, June 13, 2010, San Francisco, USA
[69] S. Mattoccia, Accurate dense stereo by constraining local consistency on superpixels, 20th International Conference
on Pattern Recognition (ICPR2010), August 23-26, 2010, Istanbul, Turkey
[70] L. Wang, M. Liao, M. Gong, R. Yang, and D. Nistér. High-quality real-time stereo using adaptive cost aggregation
and dynamic programming. 3DPVT 2006
[71] S. Mattoccia, M. Viti, F. Ries,. Near real-time Fast Bilateral Stereo on the GPU, 7th IEEE Workshop on Embedded
Computer Vision (ECVW20011), CVPR Workshop, June 20, 2011, Colorado Springs (CO), USA
[72] S. Mattoccia, L. De-Maeztu, "A fast segmentation-driven algorithm for stereo correspondence", International
Conference on 3D (IC3D 2011), December 7-8, 2011, Liege, Belgium
[73] L. De-Maeztu, S. Mattoccia, A. Villanueva, R. Cabeza, "Efficient aggregation via iterative block-based adapting
support weight",International Conference on 3D (IC3D 2011), December 7-8, 2011, Liege, Belgium
[74] D. Min, J. Lu, and M. Do, A revisit to cost aggregation in stereo matching: how far can we reduce its computational
redundancy?, ICCV 2011
[75] L. De-Maeztu, S. Mattoccia, A. Villanueva, R. Cabeza, "Linear stereo matching", International Conference on
Computer Vision (ICCV 2011), November 6-13, 2011, Barcelona, Spain

注：本文翻译自[Stefano Mattoccia](www.vision.deis.unibo.it/smatt)的立体视觉综述，特此感谢，[本文最新版本在此](http://www.vision.deis.unibo.it/smatt/Seminars/StereoVision.pdf)。

