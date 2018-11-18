---
title: 初试HCI光场数据集
comments: true
categories: 计算机视觉
tags:
  - 光场
  - 计算成像
  - 点云Point Cloud
  - Light Field
abbrlink: 20681
date: 2017-04-30 14:22:20

---

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/new-hci-lightfield-datasets/buddha2.gif" width="80%">

{%note success%}
好的数据集是做出漂亮实验的必要条件.
<span id="inline-red">声明</span>：<u>一切理解都是本人观点，如有疑问，还望在**评论**中留言。如需转载请与本人联系，谢谢合作</u>! 邮箱：[点我](/about#CONTACT INFORMATION)
{%endnote%}
<!--more-->

## Wanner光场数据集
目前光场数据集有如下几种主流的数据集，
1. [斯坦福大学光场数据集](http://lightfield.stanford.edu/lfs.html)；
2. [Wanner(HCI)数据集](http://lightfieldgroup.iwr.uni-heidelberg.de/?page_id=713)(Old 4D Light Field Benchmark)；
3. [4D Light Field Dataset](http://hci-lightfield.iwr.uni-heidelberg.de/)(Konstanz大学与Heidelberg大学的HCI合作,New 4D Light Field Benchmark)。

下面对Wanner数据集进行讨论。学习光场的同学应该很熟悉Wanner提供的数据集共有**10**个场景，分别是：
1. Buddha
2. Buddha2
3. Couple
4. Cube
5. Mona
6. Medieval
7. Papillon
8. StillLife
9. Horses
10. rx_watch

其中，1-8为仿真场景，9-10是由Raytrix拍摄的场景。他们的文件后缀为 .h5, 格式是HDF5，这是一种文件组织格式，可以很好的将数据组织在一起，具体不做展开。MATLAB 提供了一系列相应的读取该文件的函数，如：h5disp，hdf5info(新版本用h5info)，hdf5read等函数，如利用h5disp就可以得到HDF5文件的内容信息，如下图：

![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/new-hci-lightfield-datasets/Buddha2Hd5.gif)

以下给出解码HDF5文件得到子孔径图像以及重排图像的代码：

``` matlab
input_file       = 'Buddha2.h5'; % file name
input_folder     = '';           % your datasets folder

[pathstr,name,ext] = fileparts([input_folder '/' input_file]);
file_path=[pathstr,name,ext];

hinfo_data = hdf5info(file_path);
if strcmp(file_path,'Cube') || strcmp(file_path,'Couple')
	data = hdf5read(hinfo_data.GroupHierarchy.Datasets(3));
else
	data = hdf5read(hinfo_data.GroupHierarchy.Datasets(2));
end
data = permute(data, [3 2 1 5 4]);
data = im2double(data(:, :, :, :, end:-1:1));
% parameters from input
UV_diameter = size(data, 4);                   % angular resolution
UV_radius    = floor(UV_diameter/2);           % half angular resolution
h                  = size(data, 1);            % spatial image height
w                  = size(data, 2);            % spatial image width
y_size=h;
x_size=w;
UV_size=UV_diameter^2;
LF_y_size   = h * UV_diameter;                 % total image height
LF_x_size   = w * UV_diameter;                 % total image width
LF_Remap    = reshape(permute(data, ...
	   [4 1 5 2 3]), [LF_y_size LF_x_size 3]); % the remap image
IM_Pinhole = data(:,:,:,UV_radius+1,UV_radius+1); % the pinhole image

```
经过以上步骤可以得到相应的中心视角图像以及Remap（重排）之后的图像，从而进一步方便接下来的工作，例如基于该数据集的深度图像估计算法估计。

## HCI 4D光场数据集(4D Light Field Benchmark)
<p id="div-border-left-red">The 4D Light Field Benchmark was jointly created by the University of Konstanz and the HCI at Heidelberg University.</p>


上周整理上一篇博客的时候，想再次查看HCI数据集是否更新，结果惊喜地看到它竟然更新了！激动之余，就连夜把数据以及代码下载了下来，看看这个数据集的庐山真面目。

### 数据集概况

这个数据集共有4大类：

- Stratified（4）

- training（4）

- test（4）

- additional（16）

  ​


![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/new-hci-lightfield-datasets/scenes.png)

总结而言这个4D光场数据集提供了如下信息：

- 9x9x512x512x3 light fields as individual PNGs（角度分辨率：9×9，空间分辨率：512×512）
- Config files with camera settings and disparity ranges（相机配置文件以及视差范围）
- Per center view (except for the 4 test scenes):（除了测试类外每类的中心视角图像）
    - 512×512 and 5120×5120 depth and disparity maps as PFMs（深度图像以及视差图：512×512低分辨率，以及5120×5120高分辨率）
    - 512×512 and 5120×5120 evaluation masks as PNGs（png格式的评价掩膜：512×512低分辨率，以及5120×5120高分辨率）
- 16组additional的每个视角的Ground Truth Depth图像（pfm格式）



### 数据集下载
开始下载吧！在[该页面](http://hci-lightfield.iwr.uni-heidelberg.de/)的`get the data`处填写自己的邮箱，然后点击`request download links`。接下来你的邮箱里就会出现这个数据集的下载链接，链接有点多，你可以选择性的下载或者全部下载。方便起见，我把邮件中提供的链接贴在了下面：

- [Benchmark package with the 12 benchmark scenes](http://lightfield-analysis.net/benchmark/downloads/benchmark.zip)

- [**Full package with all 28 scenes**](http://lightfield-analysis.net/benchmark/downloads/full_data.zip)(这是全部的场景，共28类；注意不包含深度图像)


- Packages per category:
 - [stratified](http://lightfield-analysis.net/benchmark/downloads/stratified.zip)
 - [test](http://lightfield-analysis.net/benchmark/downloads/test.zip)
 - [training](http://lightfield-analysis.net/benchmark/downloads/training.zip)
 - [additional](http://lightfield-analysis.net/benchmark/downloads/additional.zip)


- Stratified scenes:
 - [backgammon](http://lightfield-analysis.net/benchmark/downloads/backgammon.zip)
 - [dots](http://lightfield-analysis.net/benchmark/downloads/dots.zip)
 - [pyramids](http://lightfield-analysis.net/benchmark/downloads/pyramids.zip)
 - [stripes](http://lightfield-analysis.net/benchmark/downloads/stripes.zip)


- Test scenes:
 - [bedroom](http://lightfield-analysis.net/benchmark/downloads/bedroom.zip)
 - [bicycle](http://lightfield-analysis.net/benchmark/downloads/bicycle.zip)
 - [herbs](http://lightfield-analysis.net/benchmark/downloads/herbs.zip)
 - [origami](http://lightfield-analysis.net/benchmark/downloads/origami.zip)



- Training scenes:
    - [boxes](http://lightfield-analysis.net/benchmark/downloads/boxes.zip)
    - [cotton](http://lightfield-analysis.net/benchmark/downloads/cotton.zip)
    - [dino](http://lightfield-analysis.net/benchmark/downloads/dino.zip)
    - [sideboard](http://lightfield-analysis.net/benchmark/downloads/sideboard.zip)


- Additional scenes:

 - [antinous](http://lightfield-analysis.net/benchmark/downloads/antinous.zip)
 - [boardgames](http://lightfield-analysis.net/benchmark/downloads/boardgames.zip)
 - [dishes](http://lightfield-analysis.net/benchmark/downloads/dishes.zip)
 - [greek](http://lightfield-analysis.net/benchmark/downloads/greek.zip)
 - [kitchen](http://lightfield-analysis.net/benchmark/downloads/kitchen.zip)
 - [medieval2](http://lightfield-analysis.net/benchmark/downloads/medieval2.zip)
 - [museum](http://lightfield-analysis.net/benchmark/downloads/museum.zip)
 - [pens](http://lightfield-analysis.net/benchmark/downloads/pens.zip)
 - [pillows](http://lightfield-analysis.net/benchmark/downloads/pillows.zip)
 - [platonic](http://lightfield-analysis.net/benchmark/downloads/platonic.zip)
 - [rosemary](http://lightfield-analysis.net/benchmark/downloads/rosemary.zip)
 - [table](http://lightfield-analysis.net/benchmark/downloads/table.zip)
 - [tomb](http://lightfield-analysis.net/benchmark/downloads/tomb.zip)
 - [tower](http://lightfield-analysis.net/benchmark/downloads/tower.zip)
 - [town](http://lightfield-analysis.net/benchmark/downloads/town.zip)
 - [vinyl](http://lightfield-analysis.net/benchmark/downloads/vinyl.zip)


- [Depth and disparity maps for all views of the additional scenes](http://lightfield-analysis.net/benchmark/downloads/additional_depth_disp_all_views.zip)


### 数据集初体验

#### 测试代码下载
在其官方给出的[代码页面](https://github.com/lightfield-analysis/matlab-tools)下载测试程序，下载完毕后将convert\*.m以及lib文件夹其放置在与上述数据集同级目录。例如：TEST目录下同时包括：convert.m 以及 lib/， 同样也包含 additional/, stratified/, test/, 以及 training/。

#### 生成LF.mat
- convertAll. 对于每一个场景都声称一个`LF.mat`文件

如果我们仅仅下载了几个场景我们可以利用如下函数得到相应的`LF.mat`

- convertBlenderTo5D('FOLDER')

这个LF.mat中包含该场景的光场信息诸如：

- 光场数据 (LF.LF)
- 真实值 (LF.depth/disp_high/lowres)
- 评价掩膜（mask）
- 中心视角图像

<span id="inline-red" >注意</span>：生成LF.mat的过程用到的参数通过加载相应文件夹下parameters.cfg得到，并将其存储在了LF.parameters中；H变换矩阵存储在了LF.H中（可以参考论文["Decoding, Calibration and Rectification for Lenselet-Based Plenoptic Cameras" ](http://www-personal.acfr.usyd.edu.au/ddan1654/PlenCal.pdf)）；两个平面的距离存储在LF.f, 单位 [mm]； 相机焦距：LF.parameters.intrinsics.focal_length_mm.


#### 生成点云（Point Cloud）

接下来我以**additional**文件下的**`antinous`**为例子展示如何利用深度图像（官方利用视差）与纹理图像生成点云。

``` matlab
filename='antinous';
addpath('lib');
% 得到antinous的LF.mat
convertBlenderTo5D(['additional/',filename])
load(['additional/',filename,'/LF.mat']);

img=LF.LF(5,5,:,:,:); %中心视角，用于着色
r=img(:,:,1);
g=img(:,:,2);
b=img(:,:,3);

% 深度图读取
d=pfmread(['additional_depth_disp_all_views\',filename,'\gt_disp_lowres_Cam025.pfm']);
d=mat2gray(d);

mkdir(['PointClouds-color/',filename]);建立一个文件夹存储图片

[ X,Y,Z ] = getPointcloud(LF,'disp',d);
ptCloud1 = pointCloud([X(:),Y(:),Z(:)],'color',[r(:) g(:) b(:)]);

h1=figure(1);
pcshow(ptCloud1);

axis off
set(gcf,'color',[1 1 1])
set(gcf,'Position',[800,300,600,600], 'color','w')
view(90.6338,  88.5605);
zoom(1.2)
```
结果如下所示：


![](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/new-hci-lightfield-datasets/PCs.gif)

<span id="inline-red" >注意</span>：生成点云这一步，低版本的MATLAB（如R2014a）由于没有加入相应的函数所以不能够生成点云，高版本（R2016b）可以正常生成。另外，在此提供另外一个函数`visualizeZ_3D`，该函数将depth map当做彩色图像的z向延伸，然后构图。
<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/new-hci-lightfield-datasets/3d-demo.jpg" width=1200px>


``` matlab 文件名: visualizeZ_3D.m
<!--The function visualizeZ_3D-->
function visualizeZ_3D(Z,im)

if (im == 0)
    surf(Z, visualizeZ(Z), 'EdgeColor', 'none'); imtight; axis image ij; %view(-180, 91);
else
    surf(Z, im, 'EdgeColor', 'none'); imtight; axis image ij; %view(-180, 91);
end

end

function imtight
axis image off;
xMult = 1;
yMult = 1;
borderSize = 0;
PLOTBASESIZE = 500;
set(gca, 'PlotBoxAspectRatio', [xMult yMult 1])
set(gcf, 'Position', get(gcf, 'Position') .* [1 1 0 0] + [0 0 PLOTBASESIZE*xMult PLOTBASESIZE*yMult]);
set(gca, 'Position', [borderSize borderSize 1-2*borderSize 1-2*borderSize]);
end
```













