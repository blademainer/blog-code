---
title: 资料：ORB SLAM2 阅读报告
mathjax: true
abbrlink: 203b9068
date: 2018-11-30 23:14:30
---

首先，解释下SLAM的概念，借鉴高博《视觉 SLAM 十四讲》中的一句话：SLAM 是 Simultaneous Localization and Mapping 的缩写，中文译作“同时定位与地图构建”。它是指搭载特定传感器的主体，在没有环境先验信息的情况下，于运动过程中建立环境的模型，同时估计自己的运动。如果这里的传感器主要为相机，那就称为“视觉 SLAM”。

<!--more-->

先来张图，下图就是利用相机作为传感器在环境中采集一系列的图像，经过SLAM系统建立的点云图以及相机轨迹。

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/orb-slam/MH01-traj.gif)



SLAM自1986年提出之后，一直以来是机器人领域的热点问题。这里总结一些常用开源SLAM方案。

<style>
table th:nth-of-type(1) {
    width: 150px;
}
table th:nth-of-type(2) {
    width: 200px;
}
</style>

| 方案名称 | 传感器形式 | 地址 |
| ------ | ------ | ------ |
| MonoSLAM| 单目 | [https://github.com/hanmekim/SceneLib2](https://github.com/hanmekim/SceneLib2) |
| PTAM | 单目 | [http://www.robots.ox.ac.uk/~gk/PTAM/](http://www.robots.ox.ac.uk/~gk/PTAM/) |
|ORB-SLAM|单目|[http://webdiis.unizar.es/~raulmur/orbslam/](http://webdiis.unizar.es/~raulmur/orbslam/)|
|ORB-SLAM2|单目/双目/RGB-D|[https://github.com/raulmur/ORB_SLAM2](https://github.com/raulmur/ORB_SLAM2)|
|LSD-SLAM|单目为主|[http://vision.in.tum.de/research/vslam/lsdslam](http://vision.in.tum.de/research/vslam/lsdslam)|
|SVO  |单目  |[https://github.com/uzh-rpg/rpg_svo](https://github.com/uzh-rpg/rpg_svo)|
|DTAM  |RGB-D  |[https://github.com/anuranbaka/OpenDTAM](https://github.com/anuranbaka/OpenDTAM)|
|DVO  |RGB-D  |[https://github.com/tum-vision/dvo_slam](https://github.com/tum-vision/dvo_slam)|
|DSO  |单目  |[https://github.com/JakobEngel/dso](https://github.com/JakobEngel/dso)|
|RTAB-MAP  |双目/RGB-D  |[https://github.com/introlab/rtabmap](https://github.com/introlab/rtabmap)|
|RGBD-SLAM-V2  |RGB-D  |[https://github.com/felixendres/rgbdslam_v2](https://github.com/felixendres/rgbdslam_v2)|
|Elastic Fusion  |RGB-D  |[https://github.com/mp3guy/ElasticFusion](https://github.com/mp3guy/ElasticFusion)|
|Hector SLAM  |激光  |[http://wiki.ros.org/hector_slam](http://wiki.ros.org/hector_slam)|
|GMapping  |激光  |[http://wiki.ros.org/gmapping](http://wiki.ros.org/gmapping)|
|OKVIS  |多目+IMU  |[https://github.com/ethz-asl/okvis](https://github.com/ethz-asl/okvis)|
|ROVIO  |多目+IMU  |[https://github.com/ethz-asl/rovio](https://github.com/ethz-asl/rovio)|
|VINS  |单目+IMU  |[https://github.com/HKUST-Aerial-Robotics/VINS-Mono](https://github.com/HKUST-Aerial-Robotics/VINS-Mono)|

ORB-SLAM应该是SLAM最具有代表性的算法，[ORB-SLAM2: an Open-Source SLAM System for Monocular, Stereo and RGB-D Cameras；](https://arxiv.org/abs/1610.06475) [**code；**](https://github.com/raulmur/ORB_SLAM2) [**主页；**](http://webdiis.unizar.es/~raulmur/orbslam/)

ORB-SLAM 是PTAM 的继承者们中非常有名的一位 [73]。它提出于 2015 年，是现代 SLAM 系统中做的非常完善，非常易用的系统之一（如果不是最完善和易用的话）。ORB-SLAM 代表着主流的特征点 SLAM 的一个高峰。相比于之前的工作，ORB-SLAM 具有以下几条明显的优势：
1. 支持单目、双目、RGB-D 三种模式。这使得无论我们拿到了任何一种常见的传感器，都可以先放到 ORB-SLAM 上测试一下，它具有良好的泛用性。
2. 整个系统围绕 ORB 特征进行计算，包括视觉里程计与回环检测的 ORB 字典。它体现出 ORB 特征是现阶段计算平台的一种优秀的效率与精度之间的折衷方式。ORB不像 SIFT 或 SURF 那样费时，在 CPU 上面即可实时计算；相比 Harris 角点等简单角点特征，又具有良好的旋转和缩放不变性。并且，ORB 提供描述子，使我们在大范围运动时能够进行回环检测和重定位。
3. ORB 的回环检测是它的亮点。优秀的回环检测算法保证了 ORB-SLAM 有效地防止累计误差，并且在丢失之后还能迅速找回，这在许多现有的 SLAM 系统中都不够完善。为此，ORB-SLAM 在运行之前必须加载一个很大的 ORB 字典文件。
4. ORB-SLAM 创新式地使用了三个线程完成 SLAM：实时跟踪特征点的 Tracking 线程，局部 Bundle Adjustment 的优化线程（Co-visibility Graph，俗称小图），以及全局 Pose Graph 的回环检测与优化线程（Essential Graph 俗称大图）。其中，Tracking线程负责对每张新来的图像提取 ORB 特征点，并与最近的关键帧进行比较，计算特征点的位置并粗略估计相机位姿。小图线程求解一个 Bundle Adjustment 问题，它包括局部空间内的特征点与相机位姿。这个线程负责求解更精细的相机位姿与特征点空间位置。不过，仅有前两个线程，只完成了一个比较好的视觉里程计。第三个线程，也就是大图线程，对全局的地图与关键帧进行回环检测，消除累积误差。由于全局地图中的地图点太多，所以这个线程的优化不包括地图点，而只有相机位姿组成的位姿图。继 PTAM 的双线程结构之后，ORB-SLAM 的三线程结构取得了非常好的跟踪和建图效果，能够保证轨迹与地图的全局一致性。这种三线程结构亦将被后续的研究者认同和采用。
5. ORB-SLAM 围绕特征点进行了不少的优化。例如，在 OpenCV 的特征提取基础上保证了特征点的均匀分布；在优化位姿时使用了一种循环优化四遍以得到更多正确匹配的方法；比 PTAM 更为宽松的关键帧选取策略等等。这些细小的改进使得 ORB￾SLAM 具有远超其他方案的鲁棒性：即使对于较差的场景，较差的标定内参，ORB￾SLAM 都能够顺利地工作。


整个ORB-SLAM系统包括三个部分组成，分别是跟踪（Tracking）、局部建图（Local Mapping）以及回环检测（Loop Closing）模块，它们分别被三个线程并行地进行处理。接下来对这个系统进行介绍。

![](https://raw.githubusercontent.com/Vincentqyw/ORB-SLAM2-CHINESE/master/papers/orb-slam2-mainflow.png)


# 理论篇

## 跟踪模块
跟踪（Tracking）是在每帧中粗略地定位相机位姿以及决定何时插入新的关键帧。算法设计了运动模型以及跟踪参考帧模型去大致预测出相机的位姿。如相机跟踪失败（由于遮挡、大幅度运动等），就启动重定位模块对相机进行位置查找。如果已经有了初始位姿以及特征匹配，利用关键帧的Covisibility Graph恢复出局部可见图。之后，局部地图点的匹配可利用重投影实现，随后相机的位姿利用BA来优化。最后，Tracking线程决定是否插入新的关键帧。

- 初始位姿估计：利用运动模型或者关键帧模型去预测相机位姿。如果运动模型已经跟踪到了当前帧，会利用引导匹配（Guided Search）在上一帧中寻找地图点。如果没有找到足够的匹配（如，运动模型不适用的情况），我们就在上一帧中更大的范围中寻找地图点。如不满足运动模型条件，导致运动模型失败，则采用参考关键帧模型利用参考帧模型对当前帧进行跟踪。通过以上两个模型即可对相机位姿进行初步定位。
- 跟踪局部地图：一旦我们已经估计了相机位姿以及我们得到一系列匹配的特征。我们可以将地图点投影到该帧上以搜索更多的匹配地图点。为了减小计算大图的超大复杂度，我们仅将其投影局部小图。局部地图包括，一系列关键帧$K_1$，这些关键帧与当前帧共享着相同的地图点；还有与$K_1$有共视关系的关键帧$K_2$们。局部图还有一个参考帧$K_{ref}$，这个关键帧与当前帧有最多的匹配点。
- 重定位：当运动模型以及跟踪关键帧失败时，可利用重定位来恢复得到相机位姿。应该从历史关键帧中选取和当前帧相似的图片，对当前帧进行位姿估计以及位姿优化。

## 局部建图模块

局部建图（Local Mapping）的主要任务：当跟踪当前帧成功之后，需要利用局部建图更新其运动模型同时更新地图点。等待跟踪过程判断是否应该插入一个新的关键帧，并把关键帧插入到地图中，并对局部地图进行局部BA优化。这个线程能够获得更为精细的相机位姿以及点云。

- 处理关键帧：跟踪成功之后，需要对关键帧进行处理以得到地图。具体而言：从关键帧队列中获得一帧，计算出其特征点的BoW映射向量（表示）。关键帧和其对应的地图点进行绑定，更新地图点的平均观测方向以及观测距离范围。更新关键帧之间的连接关系（共视关系），最后将关键帧插入地图中。
- 精选地图点：由于跟踪过程引入地图点的策略较为宽松，此时需要检查最近加入的地图点，并将一些冗余的地图点从最近地图点的列表中剔除。
- 创建新地图点：由于上一步已经剔除了一些冗余地图点，该模块需要通过当前关键帧及其共视关键帧利用三角化得到更多高质量的3D地图点并添加地图点的属性。
- Local BA：该步骤通过局部BA优化局部地图点以及局部关键帧的位姿。
- 精选关键帧：剔除冗余的关键帧，这样不至于增加后期BA的压力，而且可以保证在相同的环境下，关键帧的数目不会无限制的增长，同时减小存储压力。

## 回环检测模块

回环检测（Loop Closing）的主要目标是检测当前关键帧是否经过历史位置。如有经过，则利用回环检测得到的回环帧去修正整个SLAM长期跟踪过程中带来的累积误差、尺度漂移等。如果仅有前两个线程的话，仅仅完成了一个很好的视觉里程计（VO），这个线程会对全局地图以及关键帧进行回环检测，以消除上述累积误差。

- 候选关键帧检测：当前关键帧仅有与历史关键帧足够相似才可能成为回环候选帧，该模块通过一定的筛选策略对当前关键帧进行筛选，判断其是否为闭环候选关键帧。由于在实际闭环检测过程中，回环候选帧及其共视关键帧，在一定连续的时间内都可能被观测到。该模块主要通过利用这一条件，对闭环候选关键帧进一步地筛选，通过筛选条件的候选关键帧将进行下一步的判断。
- 相似性变换计算：考虑到单目SLAM的尺度漂移，当前帧和回环帧之间的相对位姿应是一个相似变换，并且，二者之间应具有足够多的匹配点。该模块主要是通过循环计算当前帧和上述经过筛选后的候选关键帧之间的相似变换，直到找到一个和当前帧具有足够多匹配点的相似变换，对应的候选关键帧即为最终的回环帧。
- 回环修正：受累积误差的影响，时间越久，越接近当前帧的关键帧及相应的地图点，误差将越大。若寻找到的回环帧，当前帧位姿及其对应的地图点会更精确。该模块就是为了修正累积误差，利用回环帧及其共视关键帧，以及对应的地图点，来修正当前帧及其共视关键帧的位姿以及对应的地图点的世界坐标。紧接着进行地图点融合，更新共视图，然后通过本质图优化相机位姿，最后进行全局BA来修正整个SLAM的累积误差（相机位姿以及地图点）。



牛吹完了，说下缺点。
当然，ORB-SLAM 也存在一些不足之处。首先，由于整个 SLAM 系统都采用特征点进行计算，我们必须对每张图像都计算一遍 ORB 特征，这是非常耗时的。ORB-SLAM 的三线程结构也对 CPU 带来了较重的负担，使得它只有在当前 PC 架构的 CPU 上才能实时运算，移植到嵌入式端则有一定困难。其次，ORB-SLAM 的建图为稀疏特征点，目前还没有开放存储和读取地图后重新定位的功能（虽然从实现上来讲并不困难）。根据我们在建图章节的分析，稀疏特征点地图只能满足我们对定位的需求，而无法提供导航、避障、交互等诸多功能。然而，如果我们仅用 ORB-SLAM 处理定位问题，似乎又嫌它有些过于重量级了。相比之下，另外一些方案提供了更为轻量级的定位，使我们能够在低端的处理器上运行 SLAM，或者让 CPU 有余力处理其他的事务。

# 实践篇

在这里下载ORB-SLAM2的源码，然后参考ORB-SLAM2项目的说明文档，安装一些必要的第三方软件：
- pangolin：http://eigen.tuxfamily.org/index.php?title=Main_Page
- Eigen：http://eigen.tuxfamily.org/index.php?title=Main_Page
- opencv 3.4.2 ：https://blog.csdn.net/haoqimao_hard/article/details/82049565
- ROS：http://wiki.ros.org/melodic/Installation/Ubuntu#Ubuntu_install_of_ROS_Melodic

注意，其中有坑，务必安装正确。安装好之后顺便在Euroc数据集中的MH01上测试，得到下面的轨迹地图。

<img src="/posts/orb-slam/MH01-traj.png">


## EuRoC数据集

EuRoC数据集包含11个双目序列，这个序列由小型无人机在两个房间（V1/V2, Vicon Room）以及一个大工厂环境(MH, Machine Hall)中拍摄得到。相机的基线长约为11cm，以20Hz速度拍摄图片。序列被分成了三种（根据MAV的速度，光照以及场景纹理）easy , medium, difficult。
$ATE$表示绝对轨迹误差，是衡量相机位姿的标准之一。假设有真实位姿序列：$P_1,P_2,P_3,...,P_n$以及估计的位姿序列：$Q_1,Q_2,Q_3,...,Q_n$ ，它们已经做了包括时间戳对齐等操作。实际场景中，这两个序列可能有不同的采样率、长度亦或数据可能丢失，此时需要进行数据关联和插值。首先得的在第i时刻的轨迹误差：

$$F_i := Q_i^{-1}SP_i $$

其中$S$是从$P_{1:n}$到$Q_{1:n}$的最小二乘刚体变换，通过求取以上误差在所有位置时刻的均方根我们得到APE的具体形式：

$$RMSE(F_{1:n}):=\left(\frac{1}{n}\sum_{i=1}^n||trans(F_i)||^2\right)^{\frac{1}{2}}$$

其中的$trans(·)$表示求取该位姿的平移分量算子。


文中大部分内容来自网络以及高博十四讲。因本人水平有限，如有错误，谢谢指出。

# 参考
- http://www.slamcn.org/index.php/%E9%A6%96%E9%A1%B5
- https://blog.csdn.net/qinruiyan/article/details/50918504
- Sturm J, Engelhard N, Endres F, et al. A benchmark for the evaluation of RGB-D SLAM systems[C]. Ieee International Conference on Intelligent Robots and Systems. IEEE, 2012:573-580.
- Horn B K P. Closed-form solution of absolute orientation using unit quaternions[J]. J.opt.soc.am.a, 1987, 5(7):1127-1135.


