---

title:
date: 2016-08-13 18:06:03
comments: false
type: "picture"

---


# <blockquote class="blockquote-center"> COLLECTIONS </blockquote>

<br>

## Links About Light Field



* [斯坦福大学光场数据库](http://lightfield.stanford.edu/lfs.html)：老牌斯坦福大学计算机图形实验室(Computer Graphics Laboratory)提供的，该数据库所在网站还提供了光场的采集设备，相机标定以及可视化工具。
* 斯坦福大学计算机图形实验室的[Marc Levoy](http://graphics.stanford.edu/~levoy/)教授做的动画仿真，利于理解。[Flash applets on some technical aspects of photography](https://graphics.stanford.edu/courses/cs178/applets/applets.html)，这里面详细地介绍了相机的各种参数变化对应的光路图的变化，强烈推荐。
* [HCI光场数据集](http://hci-lightfield.iwr.uni-heidelberg.de/)，千呼万唤始出来，有好长一段时间这个数据集突然消失了（可能是在维护数据）。如今以新的面貌重现天日，真的让人喜出望外。对于其数据集，HCI提供的[解码工具](https://github.com/lightfield-analysis/matlab-tools)；这是要建立与[Middlebury](#Middlebury)齐名的数据集（包括评价排名）的节奏啊！（ps:日后整理，很感兴趣）
* [**Ravi Ramamoorthi**](http://cseweb.ucsd.edu/~ravir/)教授主页，一位计算成像，计算机视觉领域的大神，他所在组发表了很多高质量的文章，详情可参考他的主页。
* [光场实验室网站](http://cseweb.ucsd.edu/~viscomp/projects/LF/)，研究光场领域，隶属于**Ravi Ramamoorthi**教授。这里将是研究光场领域深度图像获取，三维重建以及去除高光等领域研究者的福音。
* 光场相机的缔造者以及Lytro公司的创始人[Ren Ng](http://www.eecs.berkeley.edu/Faculty/Homepages/yirenng.html/)。看这里是其创建的[Lytro公司](https://illum.lytro.com)的主页；最初Lytro的最大卖点在于**先拍照后对焦**，可是买账的人并不多；购买者多数是摄影爱好者以及科研机构。最近Lytro公司开始进军VR以及AR领域，看了下其设备，怎一个大字了得（Ps: 话说Ng为何去教书了？）
* [Lytro论坛](http://blog.lytro.com/)，这里有关于Lytro公司以及光场相机最新的应用，时常关注不至于落后于时代，不至于被世界残忍的抛弃。
* MATLAB[光场工具包](http://www.mathworks.com/matlabcentral/fileexchange/49683-light-field-toolbox-v0-4)，这个工具包从事光场研究的科研人员的福利，后文中我将详细的介绍这个工具包的使用方法。
* [**LytroMeltdown**](http://optics.miloush.net/lytro/Default.aspx)，一位布拉格大学(Charles University)的学生拆解Lytro 1.0的资料，如果你想对光场相机的内部结构有更加深入的了解的话，这个网址有丰富的介绍。（目前仅有Lytro一代的拆解并没有ILLUM的拆解，原因是过于昂贵，作者买不起）
* cocolib[光场工具套件](http://sourceforge.net/p/cocolib/home/Home/)，这个套件实际上是一个处理凸优化问题的库，既可以用命令行操作也可Matlab界面操作。该库实现了目前集中常用的算法诸如： inverse problems，基于总变分最小化的图像分割以及矢量多标记交易成本函数；当然最重要的还有对于光场图像的分析函数套件（基于HCI发表的深度估计论文）。
* 著名的[Middlebury](http://vision.middlebury.edu/stereo/)<span id="Middlebury">数据集</span>：来提供了Benchmark(左右视角的纹理图以及对应的GT深度图像)，各种算法的性能对比， 在双目深度估计领域属于最为权威的评估标准。
* Deep learning: [Depth Estimation](https://github.com/iro-cp/FCRN-DepthPrediction)，目前基于双目，多目以及利用光场进行深度估计的算法已有很多；有些研究者利用当前比较火热的深度学习的策略对**单幅图像**进行深度图像的提取；我本来想跑跑人家代码，可以目前还没时间搞这些。
* [Computer Vision Laboratory - CVLAB](http://cvlab.epfl.ch/)
* [宽带网数字媒体技术实验室](http://media.au.tsinghua.edu.cn/people.jsp)的[Yebin Liu 刘烨斌主页](http://www.liuyebin.com/)
* 深度图+原始彩色图像转化成多视角动态gif，[戳这里](http://wigglemaker.ugocapeto.com/)，这算是深度图像的一个小小的应用。



## [Light Field Resources](https://github.com/Vincentqyw/light-field-resources/blob/master/README.md)
This is a (work in progress) repo for collecting links to data sets, source code, and other resources related to research on light fields for computer vision.For further information and interaction within the light field community, have a look at:
- [Google Community for the Matlab Light Field Toolbox](https://plus.google.com/communities/114934462920613225440)
- [Light Field Forum](http://lightfield-forum.com/en/)
- [Mailing List / General Light Field Vision Google Group](https://groups.google.com/forum/#!forum/lightfieldvision)


## Background Information / General Light Field Information
- [Wikipedia](https://en.wikipedia.org/wiki/Light_field)
- [plenoptic.info](http://plenoptic.info/) provides some nice visualizations on how micro lens based plenoptic cameras work
- [Todor Georgievs Website](http://www.tgeorgiev.net/) insights into plenoptic cameras. No longer updated (?)
- [A Taxonomy and Evaluation of Dense Light Field Depth Estimation Algorithms](http://lightfield-analysis.net/benchmark/paper/survey_cvprw_lf4cv_2017.pdf) paper with an in depth overview of depth estimation approaches for 4D light fields
- [Light Fields and Computational Imaging](https://web.stanford.edu/class/ee367/reading/levoy-lfphoto-ieee06.pdf) early survey of the theory and practice of light field imaging 
- *please add more :)*

## Other Light Field Datasets

- [The (New) Stanford Light Field Archive](http://lightfield.stanford.edu/)
- [MIT Synthetic Light Field Archive](http://web.media.mit.edu/~gordonw/SyntheticLightFields/index.php)
- [4D Light Field Dataset (CVIA Konstanz & HCI Heidelberg)](http://lightfield-analysis.net/)
- [HCI 4D Light Field Dataset](http://lightfieldgroup.iwr.uni-heidelberg.de/?page_id=713)
- [Lytro first generation dataset](https://www.irisa.fr/temics/demos/lightField/index.html)
- [EPFL Light-Field Image Dataset](http://mmspg.epfl.ch/EPFL-light-field-image-dataset)
- [Disney High Spatio-Angular Resolution Light Fields](https://www.disneyresearch.com/project/lightfields/)
- [Light field Saliency Dataset (LFSD)](https://www.eecis.udel.edu/~nianyi/LFSD.htm)
- [LCAV-31 - A Dataset for Light Field Object Recognition](https://github.com/aghasemi/lcav31)
- [A 4D Light-Field Dataset for Material Recognition](http://cseweb.ucsd.edu/~viscomp/projects/LF/papers/ECCV16/LF_dataset.zip)
- [Data for: Occlusion-aware depth estimation using light-field cameras](http://cseweb.ucsd.edu/~viscomp/projects/LF/papers/ICCV15/dataset.zip)
- [DDFF 12-Scene 4.5D Lightfield-Depth Benchmark](https://vision.in.tum.de/data/datasets/ddff12scene)
- *please add more :)*

## Tools
- [Matlab Light Field Toolbox](http://dgd.vision/Tools/LFToolbox/)
- [cocolib light field suite](http://cocolib.net/index.php/examples/lightfields)
- [Geometric light field camera calibration toolbox](https://sites.google.com/site/yunsubok/lf_geo_calib)
- [Blender addon to create synthetic light field data sets](https://github.com/lightfield-analysis/blender-addon)
- *please add more :)*

## Algorithm Source Code
- [Accurate Depth Map Estimation from a Lenslet Light Field Camera](https://sites.google.com/site/hgjeoncv/home/depthfromlf_cvpr15) (*LF)
- [Occlusion-aware depth estimation using light-field cameras](http://cseweb.ucsd.edu/~viscomp/projects/LF/papers/ICCV15/occCode.zip) (*LF_OCC)
- [Empirical Bayesian Light-Field Stereo Matching by Robust Pseudo Random Field Modeling](http://www.ee.nthu.edu.tw/chaotsung/rprf/index.html) (RPRF)
- [Robust Depth Estimation for Light Field via Spinning Parallelogram Operator](https://github.com/shuozh/Spinning-Parallelogram-Operator) (SPO)
- *please add more :)*

*Where applicable, the short name in parentheses denotes the acronym used on the [4D light field benchmark](http://lightfield-analysis.net).*


## Workshops & Tutorials
- [1st Workshop on Light Fields for Computer Vision @ ECCV 2014](https://www.eecis.udel.edu/~yu/LF4CV/)
- [2nd Workshop on Light Fields for Computer Vision @ CVPR 2017](http://lightfield-analysis.net/LF4CV/)
- *please add more :)*


## People / Labs
- [CVIA, Computer Vision and Image Analysis, Uni Konstanz, Germany](https://www.cvia.uni-konstanz.de/)
- [SCI, Stanford Computational Imaging, Stanford University, USA](http://www.computationalimaging.org/)
- [HCI, Heidelberg Collaboratory for Image Processing, Heidelberg University, Germany](http://lightfieldgroup.iwr.uni-heidelberg.de/?page_id=453)
- *please add more :)*

## Deep Learning Related

- [Deep Learning in Matlab](https://cn.mathworks.com/help/nnet/examples.html?s_cid=doc_flyout#bvljehw)
- *please add more :)*

## Others
- [Free Images](https://unsplash.com/)
- [mouto](http://i.mouto.org/#kodak)
- [Lab](http://lab.mouto.org/)
- [Metheno](https://blog.metheno.net/)
- [You Know](http://x.mouto.org/wb/)








