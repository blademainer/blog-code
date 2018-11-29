---
title: ORB-SLAM-overview
tags:
  - 计算机视觉
  - ORB-SLAM
  - SLAM
abbrlink: 9c50823
date: 2018-08-26 15:57:10
mathjax: true
---

{%note success%}
"ORB-SLAM is a versatile and accurate SLAM solution for Monocular, Stereo and RGB-D cameras. It is able to compute in real-time the camera trajectory and a sparse 3D reconstruction of the scene in a wide variety of environments, ranging from small hand-held sequences of a desk to a car driven around several city blocks. It is able to close large loops and perform global relocalisation in real-time and from wide baselines. It includes an automatic and robust initialization from planar and non-planar scenes." BY： Raúl Mur-Artal et.al.
{%endnote%}

<!--more-->


# 算法原理架构
## 系统说明


![](http://pe2bdos9i.bkt.clouddn.com/pipeline.png)

上图是[ORB-SLAM2](http://pe2bdos9i.bkt.clouddn.com/ORB-SLAM2.pdf)的流程图。整个ORB-SLAM系统包括三个部分组成，分别是{% label danger@跟踪（Tracking）、局部建图（Local Mapping）以及回环检测（Loop Mapping）%}模块，它们分别被三个线程并行地进行处理。

## 跟踪模块

跟踪（Tracking）是在每帧中**{% label danger@粗略地定位相机位姿以及决定何时插入新的关键帧%}**。算法设计了**运动模型**以及**跟踪参考帧模型**去大致预测出相机的位姿。如相机跟踪失败（由于遮挡、大幅度运动等），就启动**重定位**模块对相机进行位置查找。如果已经有了初始位姿以及特征匹配，利用关键帧的Covisibility Graph恢复出局部可见图。之后，局部地图点的匹配可利用重投影实现，随后相机的位姿利用BA来优化。最后，Tracking线程决定是否插入新的关键帧。

- 初始位姿估计：利用运动模型或者关键帧模型去预测相机位姿。如果运动模型已经跟踪到了当前帧，会利用引导匹配（Guided Search）在上一帧中寻找地图点。如果没有找到足够的匹配（如，运动模型不适用的情况），我们就在上一帧中更大的范围中寻找地图点。如不满足运动模型条件，导致运动模型失败，则采用参考关键帧模型利用参考帧模型对当前帧进行跟踪。通过以上两个模型即可对相机位姿进行初步定位。
- 跟踪局部地图：一旦我们已经估计了相机位姿以及我们得到一系列匹配的特征。我们可以**投影到该帧上以搜索更多的匹配地图点**。为了减小计算大图的超大复杂度，我们仅将其投影局部小图。局部地图包括，一系列关键帧$K_1$，这些关键帧与当前帧共享着相同的地图点；还有与$K_1$有共视关系的关键帧$K_2$。局部图还有一个参考帧$K_{ref}$，这个关键帧与当前帧有最多的匹配点。接下来，在$K_1$和$K_2$中可以同时被观测到的地图点在当前帧中被搜索。
- 重定位：当运动模型以及跟踪关键帧失败时，可利用重定位来恢复得到相机位姿。应该从历史关键帧中选取和当前帧相似的图片，对当前帧进行位姿估计以及位姿优化。

## 局部建图模块

局部建图（Local Mapping）的主要任务：当跟踪当前帧成功之后，需要利用局部建图更新其运动模型同时更新地图点。等待跟踪过程判断是否应该插入一个新的关键帧，并把关键帧插入到地图中，并对局部地图进行局部$BA$优化。这个线程能够获得更为精细的相机位姿以及点云。

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


# 跟踪模块模块说明

## 初始位姿估计模块

该模块由两个模型来完成，包括运动模型以及跟踪参考帧模型。
### 运动模型功能
假设物体处于匀速运动，通过运动模型，可利用上一帧的位姿和速度对当前帧的位姿进行估计。

### 模型设计以及处理流程

模块运动模型算法处理流程图
根据运动模型假设，当前帧的初始位姿能够被初始化为：

其中$\Delta T$表示上上帧到上帧的变换矩阵，$T_k$表示第$k$帧的相机位姿。然后将上一帧的地图点通过投影的方式投影到当前帧上，然后在该投影区域的邻域内进行特征匹配（如图2），如果匹配数目小于20则扩大搜索区域范围继续搜索，直至匹配数目大于20。此时已经找到足够多的匹配对（3D-2D），对相机位姿进行优化（PoseOptimizition）。之后剔除地图外点，如果匹配到的地图点数大于10返回true；如果在跟踪模式下，匹配数大于20，返回true。
 
运动模型算法处理原理

### 跟踪参考帧模型功能

该模块主要针对运动模型失效的情况，由于当前帧与上一个关键帧的距离较近，此时关键帧与其最近一个关键帧去做匹配。

### 模型设计以及处理流程
 
跟踪参考帧模型算法处理流程图

首先计算当前帧的BoW向量，然后与上一个参考帧进行匹配，如图4所示，同时将当前帧位姿初始化为上一帧的位姿。由于参考帧的位姿以及地图点都是已知的，一旦当前帧与参考帧匹配成功之后，就可以根据3D-2D对应关系，对相机位姿进行优化（PoseOptimizition）。之后剔除地图外点，如果匹配到的地图点数大于10返回true。

 
跟踪参考帧模型算法原理

## 跟踪局部地图模块

### 模块功能描述

跟踪局部地图，对当前帧寻找更多的地图点，即更多添加约束，然后优化相机位姿。

### 模块框架设计以及处理流程

前述方法是帧与帧之间的联系，这里我们进行局部地图的跟踪，即通过更多的3D-2D的匹配对来对位姿进行约束；对于当前帧所在的局部地图，所有的地图点投影到当前帧；寻找匹配，确定3D-2D关系，对相机位姿以及点云进行优化。
 
### 模块算法处理流程

通过以下过程寻找与当前帧有更多匹配的点云。
1. 计算地图点投影到当前帧的坐标x，如果x超过了图像边界则丢弃；
2. 计算当前视线方向向量v与点云平均视线方向向量n的夹角，舍弃n·v < cos(60°)的点云；
3. 计算地图点到相机中心的距离d，如果d [dmin,dmax]，则丢弃；
4. 计算图像的尺度因子，为d/dmin；
5. 将地图点的特征描述子D与还未匹配上的ORB特征进行比较，根据尺度因子，找到最佳匹配。

### 判定关键帧原则
经过以上帧与帧之间、帧与地图点之间的跟踪，可以很好的跟踪到当前帧。由于在后续的Local Mapping阶段将有关键帧剔除操作，此处应该尽量快的以宽松的条件添加关键帧。当前帧若是能够成为关键帧，必须满足以下四个条件：
1. 两个关键帧之间不能太稠密：距离上次全局重定位至少已经经过了20帧；
2. 局部建图（Local Mapping）是空闲的，并且距离上次关键帧插入已经超过20帧；
3. 要有尽量多的匹配点：当前帧至少匹配到了至少50个点云；
4. 当前帧匹配到的点云的个数不能超过参考关键帧Kref（与当前帧拥有最多点云的关键帧）对应点云的90%，说明此时参考关键帧可以取代当前帧，还没有必要创建关键帧。

## 重定位模块
### 模块功能描述
该模块主要是针对运动模型以及参考关键帧模型都失败的情况，即此时当前帧已经丢了，无法确定其真实位置。此时放宽条件，当前帧与所有BoW得分较高的关键帧进行匹配，看能否找到合适的位置。

### 框架设计以及处理流程


模块算法处理流程图

重定位原理示意
 
模块算法处理流程图

重定位成功之前，当前帧的位姿是未知的。根据检测到的和当前帧BoW相似的候选关键帧，利用这些关键帧上的地图点以及与当前帧的匹配点，采用EPnP计算当前帧位姿。为了得到更准确的位姿，需要对位姿进行进一步的优化。若优化后的当前帧与对应关键帧之间的匹配点足够多，则重定位成功；否则，可能是优化后的位姿不够准确，导致匹配点较少，于是，可以利用当前优化位姿进行引导匹配，得到更多的匹配点，进一步进行位姿优化。多次的引导匹配以及位姿优化，是为了提高重定位的精确率和召回率。

# 局部建图模块说明

## 处理关键帧模块

### 模块功能描述
建立当前关键帧与其它关键帧的连接关系，更新关键地图点并将其插入地图。

### 模块框架设计以及处理流程
 
模块算法处理流程图
跟踪过程成功后，需要对其跟踪的关键帧构建的地图进行更新。首先从缓存队列中取出一帧，作为当前要处理的关键帧，重新计算该当前关键帧的BoW向量以加速后续的匹配过程。接下来对关键帧和地图点进行绑定，最后更新关键帧之间的连接关系（ORB-SLAM2的特点在于先更新地图点然后再优化关键帧位姿）。


## 精选地图点模块 
### 模块功能描述
该模块主要用于剔除冗余地图点。
### 模块框架设计以及处理流程
如果地图点满足下述条件，即剔除。
1. 如果是坏点，就丢弃；
2. 跟踪到该MapPoint的Frame数相比预计可观测到该MapPoint的Frame数的比例小于25%，丢弃；
3. 从该点开始，到现在已经过了不小于2个关键帧，但是观测到该点的关键帧数却不超过cnThObs帧， 那么该点检验不合格；
4. 从建立该点开始，已经过了3个关键帧而没有被剔除，则认为是质量高的点；

## 创建地图点

### 模块功能描述
该模块通过三角化恢复出更多置信度高的地图点。
### 模块框架设计以及处理流程
 
算法处理流程图
通过处理当前关键帧的共视图中的关键帧，根据这些关键帧及其邻近关键帧，通过三角化计算出相应的3D点，同时给这些3D点添加属性。

## 局部BA优化模块 

### 模块功能描述

该模块通过局部BA优化局部地图点以及局部关键帧的位姿。

### 模块框架设计以及处理流程
 
模块算法处理流程图

模块算法原理
 
其中Posi表示关键帧，其位姿已知；Xi表示Pos能够看到的3D点云；(u,v)是X在Pos下的二维投影点。按照以上原理，待优化的节点包括：lLocalKeyFrames为Pos2、Pos3；lFixedCameras为Pos1。边包括：(u2,3,v2,3)、(u2,2,v2,2)、(u1,2,v1,2)、(u1,1,v1,1)。信息矩阵(权重)是观测值的偏离程度, 即重投影误差。

## 精选关键帧模块 

### 模块功能描述
由于Tracking线程会向Local Mapping模块输入大量的关键帧，此时需要有选择的剔除冗余的关键帧，这样不至于增加后期BA的压力，而且可以保证在相同的环境下，关键帧的数目不会无限制的增长，同时减小存储压力。

### 框架设计以及处理流程
 
模块算法处理流程图
总的来说也就是当前关键帧对应的每个地图点能被其它至少3个局部关键帧观测到90%以上，说明该关键帧的观测可以在很大程度上被其他关键帧观测到，就没有保留的必要。

# 闭环检测模块说明

## 闭环检测模块

### 模块功能描述
通过设计筛选策略，从数据库中选取和当前帧相似的关键帧，以得到闭环候选帧。

### 模块框架设计以及处理流程

PD-001模块算法处理流程图

### 粗略检测闭环候选帧
其中检测闭环候选帧的流程可以概括为：

 
检测闭环候选帧的流程
通过以上策略可以大致得到闭环候选帧，接下来接下来进行回环一致性检测。

### 检测回环一致性的步骤

1. 将每个候选帧与自己相连的关键帧构成一个“子候选组”；然后以下过程即检测子候选组的元素是否存在于“连续组”。
2. 如果前一个连续组中找到候选关键帧组任意一个，则将计数器+1，加入后续连续组；
3. 再扫描下一个连续组，执行相同操作，直到扫描完最后一个连续组；
4. 若某一个连续组的计数器>=3，则将本次候选关键帧加入经过筛选的候选关键帧集（即连续的闭环候选关键帧）。
5. 进入下一个候选关键帧组的扫描，直至最后一个“子候选组”扫描完成；
6. 当扫描完所有“子候选组”之后，将未添加进后续连续组的“子候选组”添加到连续组，且计数器初始化为0；
7. 进入下一轮候选帧的筛选。

## 相似度矩阵计算模块

### 模块功能描述
SLAM系统存在尺度漂移，当前关键帧与闭环帧之间存在一个相似变换，该模块计算该相似变换。

### 模块框架设计以及处理流程
 
模块算法处理流程图

利用SearchByBoW寻找当前关键帧与闭环候选帧之间的匹配。之后计算Sim3，进行5次RANSAC迭代，得到Sim3相似性变换阵。由于SearchByBoW存在大量的漏匹配现象，此时利用Sim3进行一步优化来弥补前述步骤中的漏匹配。此时的优化（OptimizeSim3）是对当前关键帧，闭环关键帧，以及匹配的地图点进行优化，获得更准确的Sim3位姿，再去下一步的闭环调整。若优化后的Sim3，当前帧有足够多的内点，则将对应的闭环候选帧初步认定为闭环帧。然后将闭环帧及其共视关键帧上的地图点根据Sim3投影到当前关键帧上，判断是否有新增的匹配点对。若Sim3的内点以及新增匹配点对的总数超过40，则认为检测到闭环。

### 相似变换的计算原理

考虑到SLAM系统的尺度漂移，当前关键帧与回环帧之间应该存在一个相似变换（Sim3）。并且，当前关键帧和回环帧之间应当具有足够多的匹配点对。计算步骤如下：
1. 寻找匹配地图点对：基于BoW向量表示，搜索当前关键帧与候选关键帧之间的匹配地图点对，只有和当前关键帧的匹配点对的数目超过20的候选关键帧，才会和当前关键帧进行Sim3的计算。
2. 计算Sim3：采用RANSAC迭代求解当前关键帧与候选关键帧之间的Sim3。
3. 优化Sim3：SearchByBoW得到的匹配点数目仅够供Sim3求解，存在着一定的漏匹配现象。此时利用Sim3将当前关键帧上的地图点投影到对应候选关键帧上，判断是否有新增的匹配地图点对；同样的，将候选关键帧上的地图点投影到当前关键帧上，判断是否有新增的匹配地图点。保留两次新增的匹配地图点对中彼此对应的匹配对，作为新增匹配对。然后利用Sim3的内点以及新增匹配地图点对，采用g2o优化Sim3。
4. 选取回环帧：若优化后的Sim3有足够多的内点(不少于20)，则将对应的闭环候选关键帧初步地定为回环帧。然后将回环帧及其共视关键帧上的地图点根据Sim3投影到当前关键帧上，判断是否有新增的匹配点对。若Sim3的内点以及新增匹配点对的总数不少于40，则认为检测到回环。

## 闭环修正模块

### 模块功能描述

根据闭环帧修正这个SLAM系统的累积误差，更新共视图以及融合地图点。

### 模块框架设计以及处理流程

 
模块算法处理流程图

对于经过闭环检测后的闭环帧而言，我们会利用其进行回环修正。根据位姿传播，得到Sim3调整后其它与当前帧相连关键帧的位姿。根据Sim3调整这些帧的位姿，同时调整这些帧对应的地图点。接下来融合地图点，以消除冗余。融合地图点之后，更新当前帧与公示关键帧的共视图。然后进行本质图的优化，通过本质图优化，可以将闭环的误差分散到整个图中。由于Loop-Connections是形成闭环后新生成的连接关系，此时增加当前帧与闭环帧之间的连接，最后新开辟一个线程用于全局BA优化。

### 地图点融合及共视图更新

将回环帧及其共视关键帧上的地图点，分别投影到当前帧及其共视关键帧上，寻找匹配点对，若是地图点与地图点的匹配，则用回环帧及其共视关键帧上的地图点替换当前帧及其共视关键帧上对应地图点，并更改地图点与关键帧之间的连接关系；若是地图点与特征点的匹配，则建立地图点与关键帧之间的连接关系。
由于地图点与关键帧之间的连接关系发生更改，因此，需要更新共视图。其中，回环帧及其共视关键帧与当前帧及其共视关键帧之间新增的共视边，为本质图优化中涉及到的回环边。

### 本质图优化
本质图优化步骤主要是优化所有关键帧位姿（除了回环帧位姿，同时也不优化地图点）。优化的边包括：
1. 回环边：当前帧与匹配帧之间的边，以及权重大于100的边；
2. 最小生成树的边；
3. 闭环连接边；
4. 共视图中具有很好共视关系的边：权重大于100。


 
# EuRoC数据集

EuRoC数据集包含11个双目序列，这个序列由小型无人机在两个房间（V1/V2, Vicon Room）以及一个大工厂环境(MH, Machine Hall)中拍摄得到。相机的基线长约为11cm，以20Hz速度拍摄图片。序列被分成了三种（根据MAV的速度，光照以及场景纹理）easy , medium, difficult。
$ATE$表示绝对轨迹误差，是衡量相机位姿的标准之一。假设有真实位姿序列：$P_1,P_2,P_3,...,P_n$以及估计的位姿序列：$Q_1,Q_2,Q_3,...,Q_n$ ，它们已经做了包括时间戳对齐等操作。实际场景中，这两个序列可能有不同的采样率、长度亦或数据可能丢失，此时需要进行数据关联和插值。首先得的在第i时刻的轨迹误差：

$$F_i := Q_i^{-1}SP_i $$

其中$S$是从$P_{1:n}$到$Q_{1:n}$的最小二乘刚体变换，通过求取以上误差在所有位置时刻的均方根我们得到APE的具体形式：

$$RMSE(F_{1:n}):=\left(\frac{1}{n}\sum_{i=1}^n||trans(F_i)||^2\right)^{\frac{1}{2}}$$

其中的$trans(·)$表示求取该位姿的平移分量算子。

# 参考
- paper: [ORB-SLAM2](https://sci-hub.tw/10.1109/tro.2017.2705103)
- paper: [ORB-SLAM](https://zaguan.unizar.es/record/32799/files/texto_completo.pdf)
- http://www.slamcn.org/index.php/%E9%A6%96%E9%A1%B5
- ORB-SLAM. http://webdiis.unizar.es/~raulmur/orbslam/
- https://blog.csdn.net/qinruiyan/article/details/50918504
- Sturm J, Engelhard N, Endres F, et al. A benchmark for the evaluation of RGB-D SLAM systems[C]. Ieee International Conference on Intelligent Robots and Systems. IEEE, 2012:573-580.
- Horn B K P. Closed-form solution of absolute orientation using unit quaternions[J]. J.opt.soc.am.a, 1987, 5(7):1127-1135.


