---
title: Light Field 光场以及MATLAB光场工具包(LightField ToolBox)的使用说明
comments: true
categories: 计算机视觉
copyright: false
tags:
  - Matlab光场工具包
  - 光场
  - 计算成像
  - Light Field
abbrlink: 61110
date: 2017-02-16 10:45:54
updated: 2017-12-03 14:30:30
top: 1000
---

<center>{% asset_img lf_cover.jpg Magic Leap %}</center>

[这里](https://www.vincentqin.tech/collections/)我汇总了有关光场（Light Field）一些有用的链接以及光场数据的处理过程。目前还在整理中，随时更新。
<span id="inline-red">声明</span>：<u>**一切理解都是本人观点，如有疑问，还望在**评论**中留言。如需转载请与本人联系，谢谢合作**</u>! 邮箱：[点我](www.vincentqin.tech/about)

<!-- more -->


## 光场相机
大家在刚刚入手光场领域的时候会用到现在的消费者用的手持光场相机Lytro或者ILLUM，如图（实验室的设备，我可买不起ILLUM）：
<center>{% asset_img LF-cameras.jpg (Left).Lytro;(Right).Illum%}</center>


## 获取.LFP(or .LFR)原文件
由Lytro拍摄的图像的原格式是.lfp格式，我们要解码成我们需要的格式。
工具：**Lytro Desktop**，**MATLAB光场工具包**（很强大，推荐，本文介绍该方法）。
用数据线把设备连接到电脑，打开Lytro Desktop，点击想要导入的图片，选中点击右上角立即处理，然后打开我的电脑图片->Lytro Desktop\Libraries\Lytro 图库.lytrolibrary\*，就可以发现有很多文件夹名字是一串很长数字字母啥的。点击去就可以发现好几个文件，以lytro为例，这几个文件如下形式：
<center>{% asset_img lfp_list.png Light field files %}</center>

**<font color=red>raw.lfp</font>**就是我们需要的原文件，之后我们就要利用Matlab光场工具包对其进行解码操作。


## Matlab Light Field ToolBox(光场工具箱)的使用

### 下载光场工具包（LFToolBox）

首先下载[光场工具箱](http://cn.mathworks.com/matlabcentral/fileexchange/49683-light-field-toolbox-v0-4)并仔细阅读说明文档，根据文档把相应的数据拷贝到工具箱的文件夹下(这一步很关键，要仔细配置)。如果不想在官网下载的话我上传到了度娘的云盘链接：[链接](http://pan.baidu.com/s/1hsDo0ks) 密码：yykc。这是我修改后的一个版本，可以直接运行，推荐下载这个版本。**<font color=red >另外我在Github上传了一个版本，大家可以git clone[链接](https://github.com/Vincentqyw/Light_Field_TB)</font>**。下载下来的工具包是这样的：
<center>{% asset_img LF-TB-main.png 工具包文件夹 %}</center> 

LFToolbox0.4就是我们要的工具包，里面包含很多函数，如下图：
<center>{% asset_img LF-TB-files.png 工具包函数 %}</center>

我把一些比较常用的函数或者文档用红色的框标注出来，其中PDF文档是该工具包的说明书。这个说明书中详细的介绍了该工具包的使用方法，我们完全可以根据该文档的介绍来实现自己想要的功能。如下是该说明书的截图：
<center>{% asset_img LF-TB.png 说明文档 %}</center>

同时该说明文档提供了各种函数用于从LFP文件中提取出自己需要的各种信息：白图像(white image)，Raw Image，对齐后的图像，以及颜色校正，频域滤波后的图像等。
~~因为时间不足没有整理的，感觉大家都对这个过程比较感兴趣，我觉得有必要写一下到底如何读取lfp、lfr、raw文件了。好了言归正传，开写。~~

### 前期准备

#### step 1: 创建自己的工作目录
<u>如果是直接clone我在github上的[工程](https://github.com/Vincentqyw/Light_Field_TB)的话直接跳转**step 2**</u>。如果没有，那就要建立自己的工作目录，便于文件的管理。这一步是必要的，如果建立的目录不一致，可能导致程序无法运行，这也是我当时初次用这个工具包时常常出错的地方。好了，建立这样的目录结构：
<center>{% asset_img folder-structure-raw.png 文件目录 %}</center>

#### step 2: 根据相机序列号修改文件名
**<font color=red >Sample_test</font>**表示我们的测试目录，里面包含了相机信息以及自己拍摄照片的图像（lfp/lfr）。
**<font color=red >Cameras</font>** 这个目录中又包含了几个文件夹，它们分别是以“A”或者“B”开头，在其后面有一长串数字。这其实就是光场相机的serial number，我们可以从默认目录<u> c:\Users\<username>\AppData\Local\Lytro\cameras\sn- serial_number</u>中找到，这个数字每个相机不一样，大家根据自己的相机序列号修改这个目录哈。"A"表示的是LYTRO系列相机，“B”表示ILLUM系列相机；以上图为例，"A303134427"就是我相机的序列号。

#### step 3: 把白图像文件拷贝到相应的文件夹下

在每个序列号文件夹下又有一个文件夹<font color=red >WhiteImages</font>，这里面放着由该相机拍摄的白图像。所谓白图像就是一张由光场相机拍摄的白色的图像，当然自己也可以拿着光场相机对着白色的墙面拍几张，但是效果并不一定很好。庆幸的是LYTRO官方提供了白图像，以Lytro为例，我们可以从以下目录找到:<u> c:\Users\ **username**\AppData\Local\Lytro\cameras\sn- serial_number</u>。如下图所示：
<center>{% asset_img white-image-files-folders.png 白图像目录 %}</center>

我们发现这里有以下4个文件：**data.C.0/1/2/3**，这是官方把图像压缩成了这种格式，我们需要用工具箱进行解码。我们需要的就是这四个文件，拷贝出这4个文件，放在<font color=red >WhiteImages</font>文件夹里。这一步相当关键，一定要确保拷贝对了目录。<font color=red><u>注意，Illum相机的白图像与Lytro的白图像的存放位置不一样，在相机的SD卡里</u>。</font>

#### step 4: 将测试文件放到Images目录

**<font color=red >Images</font>**文件夹下包含我们需要处理的文件们，<font color=red >F01</font>下存放LYTRO系列拍摄的文件，<font color=red >B01</font>下存放ILLUM系列拍摄的文件。以Lytro为例，由于前面已经有了测试文件**<font color=red >raw.lfp</font>**，我们就把这个文件放在<font color=red >F01</font>下。经过我们上述的过程之后，最后我们的目录会变成这样（注意：<u>Sample_test与LFToolBox0.4为同级目录，各个文件夹的名字务必正确</u>）：
<center>{% asset_img folder-structure.png 文件目录结构 %}</center>

### 测试开始

我用的是实验室的电脑，配置是：**Intel(R) Core(TM) i7-4790 CPU  @3.60GHz  3.60GHz RAM 16GB**。其中的Demo文件是本人编写的一小段测试代码，已经贴在了文末。接下来的过程就是RUN CODE了。程序大致可以分为以下几个测试：
1. 处理白图像
2. 解码LFP文件
3. 频域滤波
4. 颜色校正

#### 处理白图像

处理白图像的目的为了得到相机的某些参数，我当时是为了获得每幅光场的中心点坐标才进行的这一步。以为白图像拍摄的场景没有纹理，此时可以清楚的观察到微透镜成像的边界信息。如下图所示：
<center>{% asset_img white-image-macro-pixels.png 白图像宏像素块 %}</center>

可以看到的是，微透镜下成像是这种正六边形的网格，类似于蜂窝的结构，感觉666。需要注意的是，该过程不是简单的提取出一张白图像来，而是提取几十张白图像对（image pairs），这个过程运行起来有点久，以下是运行的截图：
<center> <img src="running-process.png" width="80%"></center>

#### 解码LFP文件

如果只是单纯的读出LFP/LFR、RAW文件的数据的话可以分别用工具包提供的如下函数：LFReadLFP、LFReadRaw。注意两个函数的返回值不一样。LFReadLFP返回一个结构体类型的变量，它包含相机的各个信息，我们可以根据自己的需要保留数据。LFReadRaw返回的是一张uint16的灰度图，还没有经过demosaicing操作。去马赛克操作在malatb中有相应的函数，这点不用担心。我们在这里不是直接调用的LFReadLFP而是调用了工具箱提供的LFLytroDecodeImage函数。如果运行有问题（<u>若是直接clone我github上项目的话，不需要修改</u>），将LFLytroDecodeImage中的WhiteImageDatabase路径由以下：

```matlab
DecodeOptions = LFDefaultField( 'DecodeOptions', 'WhiteImageDatabasePath'...
,fullfile('Cameras','WhiteImageDatabase.mat'));% line 71
```
改为：

```matlab
DecodeOptions = LFDefaultField( 'DecodeOptions', 'WhiteImageDatabasePath'...
 ,fullfile('Cameras',LFMetadata.SerialData.camera.serialNumber,'WhiteImageDatabase.mat'));
%== 注意，这条插在  ---Select appropriate white image---上行，而不是在原来的71行修改==。
```

经过这样的修改之后，这下应该可以跑了。我们可以得到以下图像：
<center><img src="deer.png" width="80%" ></center>


局部放大效果图：
<center><img src="deer-zoom-in.png" width="80%"></center>


所有视角的图像：
<center><img src="all-views-raw.png" width="80%"></center>

这时候可以看到在边界视角上的图像比较黑，所以我们接下来要进行频域滤波，以及颜色校正。


#### 频域滤波以及颜色校正

这部分分别用到了LFFilt4DFFT以及LFColourCorrect函数。以LYTRO 1.0 为例子，我们得到的光场图像一种有11*11个视角，但是这个121个视角子孔径图像的质量真的不敢恭维，尤其是边角处的视角(u=1,v=1)时，这个图像时完全变成黑色的。所以嘛，LFFilt4DFFT这个函数是将这些变成黑色的图像或者质量不好的图像进行校正的，具体原理不作展开。LFColourCorrect这个函数是利用gamma变化对原始图像进行颜色校正的，这一点比较简单。总之利用这两个函数能够让我们得到的光场图像的质量更好，当然你也可以选择不用。

以下是经过滤波之后的所有子孔径图像，可以发现边界的视角相比于频域滤波之前有了很好的可视性。
<center><img src="all-views-freq-correction.png" width="80%"></center>

以下是经过颜色校正之后的所有所有子孔径图像。
<center><img src="all-views-freq-color-correction.png" width="80%"></center>

经过以上的步骤我们可以学习到白图像的处理，以及光场图像的处理等操作。当然我没有列出这个工具包所有的功能介绍，大家可以根据需要建立自己工程，对自己的数据进行测试，以上！

**<font color=red >注意</font>**：
- 务必在WhiteImagesPath处写明相机型号，确定好到底是Lytro还是Illum
- 注意Illum相机的白图像们在相机的SD卡中，那些白图像们拷贝出来放在路径**Sample_test\Cameras\B5151500510\**下即可
- 白图像的处理过程比较久，耐心等待就行即可
- Lytro与Illum的频域滤波调用函数是不同的，我已经把代码添加在了相应位置；这个函数用时较久，耐心等待
- 结果存放在**Results_saving**文件夹下
- 再次提醒，由于Illum图像的分辨率比较大，所以当程序运行到LFLytroDecodeImage以及频域滤波时会造成内存以及磁盘的大量使用，慎重考虑。
- 如有Bug请及时联系我，请在评论区留言。

以下是Demo文件的代码，仅供学习使用。

```matlab

clc;
clear all;
clc;

addpath(genpath('Sample_test'));
addpath(genpath('LFToolbox0.4'));

LFMatlabPathSetup;

%% Step1: 解压data.C.0/1/2/3--->white,结果存储在Cameras中
fprintf('===============Step1: Unpack Lytro Files===============\n\n ');
LFUtilUnpackLytroArchive('Sample_test')

%% Step2: 包含刚刚解压出来的文件的目录

fprintf('===============Step2: Process WhiteImages===============\n\n');

WhiteImagesPath='Sample_test\Cameras\B5151500510'; % 务必要设置这个值 B5151500510   A303134427
LFUtilProcessWhiteImages( WhiteImagesPath);

%% Step3: 解码光场图像.lfp
fprintf('=====================Step3: Decode LFP===================\n\n');
cd('Sample_test');  % 进入Sample_test目录

lfpname='baby'; %测试图像名称，改成你自己的


if WhiteImagesPath(21)=='A'    %找到型号  exist('LYTRO','var')
    version='F01';
elseif WhiteImagesPath(21)=='B'%找到型号  exist('ILLUM','var')
    version='B01';
end

InputFname=['Images\',version,'\',lfpname,'.lfp'];

[LF, LFMetadata,WhiteImage,CorrectedLensletImage, ...
WhiteImageMetadata, LensletGridModel, DecodeOptions]...
                              =  LFLytroDecodeImage(InputFname);
cd('..');

imshow(CorrectedLensletImage) %Raw Image
mkdir(['Results_saving\',lfpname]);
imwrite(CorrectedLensletImage,['Results_saving\',lfpname,'\',lfpname,'.bmp']);
save(['Results_saving\',lfpname,'\',lfpname,'.mat'],'CorrectedLensletImage');


%% =======================频域滤波================================
%---Setup for linear filters---
tic
% lytro
if strcmp(version,'F01')==1
    LFPaddedSize = [16, 16, 400, 400];
    BW = 0.03;
    FiltOptions = [];
    FiltOptions.Rolloff = 'Butter';
    Slope1 = -3/9; % Lorikeet
    Slope2 = 4/9;  % Building
    fprintf('Building 4D frequency hyperfan... ');
    [H, FiltOptionsOut] = LFBuild4DFreqHyperfan( LFPaddedSize, Slope1, Slope2, BW, FiltOptions );
    fprintf('Applying filter');
    [LFFilt, FiltOptionsOut] = LFFilt4DFFT( LF, H, FiltOptionsOut );

% illum
elseif strcmp(version,'B01')==1

    LFSize = size(LF);
    LFPaddedSize = LFSize;
    BW = 0.04;
    FiltOptions = [];
    %---Demonstrate 4D Hyperfan filter---
    Slope1 = -4/15; % Lorikeet
    Slope2 = 15/15; % Far background
    fprintf('Building 4D frequency hyperfan... ');
    [H, FiltOptionsOut] = LFBuild4DFreqHyperfan( LFPaddedSize, Slope1, Slope2, BW, FiltOptions );
    fprintf('Applying filter');
    [LFFilt, FiltOptionsOut] = LFFilt4DFFT( LF, H, FiltOptionsOut );
    title(sprintf('Frequency hyperfan filter, slopes %.3g, %.3g, BW %.3g', Slope1, Slope2, BW));
    drawnow
    save(['Results_saving\',lfpname,'\',lfpname,'5D.mat'],'LFFilt');
end

%% =======================颜色校正参数设置==========================                               

ColMatrix = DecodeOptions.ColourMatrix;
Gamma=DecodeOptions.Gamma;
ColBalance=DecodeOptions.ColourBalance;

% 对3280*3280的原始彩色图像进行颜色校正
ColorCorrectedImage=LFColourCorrect(CorrectedLensletImage, ColMatrix, ColBalance, Gamma);
imwrite(ColorCorrectedImage,['Results_saving\',lfpname,'\',lfpname,'ColorCorrectedImage.bmp']);
save(['Results_saving\',lfpname,'\',lfpname,'ColorCorrectedImage.mat'],'ColorCorrectedImage')
imshow(ColorCorrectedImage);title('Corrected Lenslet Image');



%% 同样是颜色矫正， 为了得到光场数据。得到5-D LFColorCorrectedImage数据
LFColorCorrectedImage=zeros(size(LF,1),size(LF,2),size(LF,3),size(LF,4),size(LF,5));
for i=1:size(LF,1)
    for j=1:size(LF,2)
        temp =squeeze(LFFilt(i,j,:,:,1:3));
        temp = LFColourCorrect(temp, ColMatrix, ColBalance, Gamma);
        LFColorCorrectedImage(i,j,:,:,1:3)=temp;
        imshow(temp);
        pause(0.1)
    end
end
LFColorCorrectedImage(:,:,:,:,4)=LF(:,:,:,:,4);
save(['Results_saving\',lfpname,'\',lfpname,'RawLFColorCorrectedImage.mat'],'LFColorCorrectedImage');% very important

toc
%--------------------------------------------------------------------------------


```

___

~~## Lytro官网可视化工具~~

~~谁让人家Lytro不开源呢，人家自己做的Demo还不错。通过鼠标就可以对以下图像进行**重聚焦，变化视角，以及缩放**等操作。话不多说，上图！~~ 呵，人家公司在2017年11月30号之后停止了对lytro live photo的线上支持，所以以下啥都没有了。
<!--<center><iframe width='600' height='434' src='https://pictures.lytro.com/89268543555/pictures/1083179/embed' frameborder='0' allowfullscreen scrolling='no'></iframe></center> <center><iframe width='600' height='434' src='https://pictures.lytro.com/michaelsternoffphoto/pictures/1030057/embed' frameborder='0' allowfullscreen scrolling='no'></iframe></center> <center><iframe width='600' height='434' src='https://pictures.lytro.com/karinaguillenphoto/pictures/926574/embed' frameborder='0' allowfullscreen scrolling='no'></iframe></center> <center><iframe width='600' height='434' src='https://pictures.lytro.com/karinaguillenphoto/pictures/1004450/embed' frameborder='0' allowfullscreen scrolling='no'></iframe></center>更多图像在[这里](https://pictures.lytro.com/)。-->

日常来首歌曲：
<center><iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=600 height=86 src="http://music.163.com/outchain/player?type=2&id=33538955&auto=0&height=66"></iframe></center>












