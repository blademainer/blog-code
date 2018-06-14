---
title: Light Field 光场以及MATLAB光场工具包(LightField ToolBox)的使用说明
comments: true
categories: 计算机视觉
copyright: false
mathjax: true
tags:
  - Matlab光场工具包
  - 光场
  - 计算成像
  - Light Field
abbrlink: 61110
date: 2017-02-16 10:45:54
updated: 2018-01-28 22:55:30
sticky: 1000
---


<img src="http://oofx6tpf6.bkt.clouddn.com/18-1-13/91252468.jpg" alt="Magic Leap">

{%note success%}
[这里](https://www.vincentqin.tech/collections/)我汇总了有关光场（Light Field）一些有用的链接以及光场数据的处理过程。目前还在整理中，随时更新。
<span id="inline-red">声明</span>：<u>**一切理解都是本人观点，如有疑问，还望在**评论**中留言。如需转载请与本人联系，谢谢合作**</u>! 邮箱：[点我](/about)
{%endnote%}

<!-- more -->


## 光场相机
大家在刚刚入手光场领域的时候可能会用到目前消费级的手持光场相机，如Lytro或者ILLUM，如图（实验室的设备，我可买不起ILLUM）：
![](http://oofx6tpf6.bkt.clouddn.com/LF-cameras.jpg)

## 获取.LFP(or .LFR)原文件
由Lytro拍摄的图像的原格式是.lfp格式，我们要将其解码成我们需要的格式。
工具：**Lytro Desktop**，**MATLAB光场工具包**（很强大，推荐，本文介绍该方法）。

首先用数据线把设备连接到电脑，打开Lytro Desktop，点击想要导入的图片，选中点击右上角立即处理，然后打开我的电脑图片->Lytro Desktop\Libraries\Lytro 图库.lytrolibrary\*，就可以发现有很多文件夹名字是一串很长数字字母云云。点击进去可以发现里面有几个文件，以lytro为例，这几个文件如下形式：
![](http://oofx6tpf6.bkt.clouddn.com/lfp_list.png)

**<font color=red>raw.lfp</font>**就是我们需要的原文件，之后我们就要利用Matlab光场工具包对其进行解码操作。


## Matlab Light Field ToolBox(光场工具箱)的使用

### 下载光场工具包（LFToolBox）

首先下载[光场工具箱](http://cn.mathworks.com/matlabcentral/fileexchange/49683-light-field-toolbox-v0-4)并仔细阅读说明文档，根据文档把相应的数据拷贝到工具箱的文件夹下(这一步很关键，要仔细配置)。~~如果不想在官网下载的话我上传到了度娘的云盘链接：[链接](http://pan.baidu.com/s/1hsDo0ks) 密码：yykc。这是我修改后的一个版本，可以直接运行。~~**<font color=red >另外我在Github上传了一个版本，大家可以git clone[链接](https://github.com/Vincentqyw/Light_Field_TB)</font>**。下载下来的工具包是这样的：

![](http://oofx6tpf6.bkt.clouddn.com/LF-TB-main.png)

LFToolbox0.4就是我们需要的工具包，该工具包里包含很多函数，如下图：

![](http://oofx6tpf6.bkt.clouddn.com/LF-TB-files.png)

在此，我把一些比较常用的函数及文档用红色的框标注出来，其中PDF文档是该工具包的说明书。这个说明书中详细地介绍了该工具包的使用方法，我们完全可以根据该文档的介绍来实现自己想要的功能。如下是该说明书的截图：

![](http://oofx6tpf6.bkt.clouddn.com/LF-TB.png)

该说明文档提供了各种函数用于从LFP文件中提取出自己需要的各种信息：白图像(white image)，Raw Image，对齐后的图像，以及颜色校正，频域滤波后的图像等。
~~因为时间不足没有整理的，感觉大家都对这个过程比较感兴趣，我觉得有必要写一下到底如何读取lfp、lfr、raw文件了。好了言归正传，开写。~~

### 前期准备

#### step 1: 创建自己的工作目录
<u>如果是直接clone我在github上的[工程](https://github.com/Vincentqyw/Light_Field_TB)的话直接跳转**step 2**</u>。如果没有，那就要建立自己的工作目录，便于文件的管理。这一步是必要的，如果建立的目录不一致，可能导致程序无法运行，这也是我当时初次用这个工具包时常常出错的地方。好了，建立这样的目录结构：
![](http://oofx6tpf6.bkt.clouddn.com/folder-structure-raw.png)

#### step 2: 根据相机序列号修改文件名
**<font color=red >Sample_test</font>**表示我们的测试目录，里面包含了相机信息以及自己拍摄照片的图像（lfp/lfr）。
**<font color=red >Cameras</font>** 这个目录中又包含了几个文件夹，它们分别是以“A”或者“B”开头，在其后面有一长串数字。这其实就是光场相机的serial number，我们可以从默认目录<u> c:\Users\<username>\AppData\Local\Lytro\cameras\sn- serial_number</u>中找到，这个数字每个相机不一样，大家根据自己的相机序列号修改这个目录哈。"A"表示的是LYTRO系列相机，“B”表示ILLUM系列相机；以上图为例，"A303134427"就是我相机的序列号。

#### step 3: 把白图像文件拷贝到相应的文件夹下

在每个序列号文件夹下又有一个文件夹**<font color=red >WhiteImages</font>**，这里面放着由该相机拍摄的白图像。所谓白图像就是一张由光场相机拍摄的白色的图像，当然自己也可以拿着光场相机对着白色的墙面拍几张，但是效果并不一定很好。庆幸的是LYTRO官方提供了白图像，以Lytro为例，我们可以从以下目录找到:<u> c:\Users\ **username**\AppData\Local\Lytro\cameras\sn- serial_number</u>。如下图所示：

![](http://oofx6tpf6.bkt.clouddn.com/white-image-files-folders.png)

我们发现这里有以下4个文件：**data.C.0/1/2/3**，这是官方把白图像压缩成了这种格式，我们需要用工具箱进行解码。我们需要的正是这四个文件，拷贝出这4个文件，放在**<font color=red >WhiteImages</font>**文件夹里。这一步相当关键，一定要确保拷贝对了目录。**<font color=red>注意</font>**，Illum相机的白图像与Lytro的白图像的存放位置不一样，在[相机的SD](#Whiteimage-Illum)卡里。

#### step 4: 将测试文件放到Images目录

**<font color=red >Images</font>**文件夹下包含我们需要处理的文件们，**<font color=red >F01</font>**下存放LYTRO系列拍摄的文件，**<font color=red >B01</font>**下存放ILLUM系列拍摄的文件。以Lytro为例，由于前面已经有了测试文件**<font color=red >raw.lfp</font>**，我们就把这个文件放在**<font color=red >F01</font>**下。经过我们上述的过程之后，最后我们的目录会变成这样（注意：<u>Sample_test与LFToolBox0.4为同级目录，各个文件夹的名字务必正确</u>）：

![](http://oofx6tpf6.bkt.clouddn.com/folder-structure.png)

### 测试开始

我用的是实验室的电脑，配置是：**Intel(R) Core(TM) i7-4790 CPU  @3.60GHz  3.60GHz RAM 16GB**。其中的Demo文件是本人编写的一小段测试代码，已经贴在了文末。接下来的过程就是RUN CODE了。程序大致可以分为以下几个测试：
1. 处理白图像
2. 解码LFP文件
3. 频域滤波
4. 颜色校正

#### 处理白图像

处理白图像的目的是得到相机的某些参数，我当时是为了获得每幅光场的中心点坐标才进行的这一步。白图像拍摄的场景没有纹理，此时可以清楚的观察到微透镜成像的边界信息。如下图所示：

![](http://oofx6tpf6.bkt.clouddn.com/white-image-macro-pixels.png)

可以看到的是，微透镜下成像是这种正六边形的网格，类似于蜂窝的结构，感觉很酷有木有。需要注意的是，该过程不是简单地提取出一张白图像来，而是提取几十张白图像对（image pairs），这个过程运行起来有点久，以下是运行的截图：

![](http://oofx6tpf6.bkt.clouddn.com/running-process.png)

#### 解码LFP文件

如果只是单纯地读出LFP/LFR、RAW文件的数据的话可以分别用工具包提供的如下函数：LFReadLFP、LFReadRaw。注意两个函数的返回值不一样。LFReadLFP返回一个结构体类型的变量，它包含相机的各个信息，我们可以根据自己的需要保留数据。LFReadRaw返回的是一张uint16的灰度图，还没有经过demosaicing操作。去马赛克操作在malatb中有相应的函数，这点不用担心。我们在这里不是直接调用的LFReadLFP而是调用了工具箱提供的LFLytroDecodeImage函数。如果运行有问题（<u>若是直接clone我github上项目的话，不需要修改</u>），将LFLytroDecodeImage中的WhiteImageDatabase路径由以下：

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
<center><img src="http://oofx6tpf6.bkt.clouddn.com/deer.jpg" width="80%" ></center>


局部放大效果图：
<center><img src="http://oofx6tpf6.bkt.clouddn.com/deer-zoom-in.png" width="80%"></center>


所有视角的图像：
<center><img src="http://oofx6tpf6.bkt.clouddn.com/all-views-raw.png" width="80%"></center>

这时候可以看到在边界视角上的图像比较黑，所以我们接下来要进行频域滤波，以及颜色校正。


#### 频域滤波以及颜色校正

这部分分别用到了LFFilt4DFFT以及LFColourCorrect函数。以LYTRO 1.0 为例子，我们得到的光场图像一种有11*11个视角，但是这个121个视角子孔径图像的质量真的不敢恭维，尤其是边角处的视角(u=1,v=1)时，这个图像时完全变成黑色的。所以嘛，LFFilt4DFFT这个函数是将这些变成黑色的图像或者质量不好的图像进行校正的，具体原理不作展开。LFColourCorrect这个函数是利用gamma变化对原始图像进行颜色校正的，这一点比较简单。总之利用这两个函数能够让我们得到的光场图像的质量更好，当然你也可以选择不用。

以下是经过滤波之后的所有子孔径图像，可以发现边界的视角相比于频域滤波之前有了很好的可视性。
<center><img src="http://oofx6tpf6.bkt.clouddn.com/all-views-freq-correction.png" width="80%"></center>

以下是经过颜色校正之后的所有所有子孔径图像。
<center><img src="http://oofx6tpf6.bkt.clouddn.com/all-views-freq-color-correction.png" width="80%"></center>

经过以上的步骤我们可以学习到白图像的处理，以及光场图像的处理等操作。当然我没有列出这个工具包所有的功能介绍，大家可以根据需要建立自己工程，对自己的数据进行测试，以上！

## **<font color=red >注意事项及测试代码</font>**

### <span id="Whiteimage-Illum">参数设置好了再Run</span>

不少同学是因为设置不当，导致运行错误，以下我列举了可能出现错误的地方。
- 务必在WhiteImagesPath处写明相机型号，确定好到底是Lytro还是Illum
- 注意Illum相机的配对数据在相机的SD卡中，解压`caldata-Bxxxxxxxxx.tar`，将里面的文件拷贝出来放在路径**Sample_test\Cameras\Bxxxxxxxxx\**下即可
- 白图像的处理过程比较久，耐心等待就行即可
- Lytro与Illum的频域滤波调用函数是不同的，我已经把代码添加在了相应位置；这个函数用时较久，耐心等待
- 结果存放在**Results_saving**文件夹下
- 再次提醒，由于Illum图像的分辨率比较大，所以当程序运行到LFLytroDecodeImage以及频域滤波时会造成内存以及磁盘的大量使用，慎重考虑。
- 如有Bug请及时联系我，请在评论区留言。

### 没有图像文件怎么搞

1. 下载整个[工程](https://github.com/Vincentqyw/light-field-TB)；
2. 下载数据集：可以在[这里](https://www.irisa.fr/temics/demos/lightField/index.html)下载Lytro数据集，该数据集包括白图像以及图像原文件；
3. 然后将工程`Sample_test/Cameras/`下的文件`Axxxxxxxxxxx`修改为`A303134643`，然后将数据集`LytroDataset\sn-A303134643`文件夹下的`data.C.0.1/2/3`放在`Sample_test/Cameras/A303134643`文件夹下；
4. 将`LytroDataset\raws`文件夹下的图像原文件放在工程`Sample_test/Images/A01/`文件夹下；
5. 修改`Demo.m`中`WhiteImagesPath='Sample_test\Cameras\Axxxxxxxxxx'`，以及`lfpname='test'`改成步骤4中的任何一个图像原文件即可。
6. run起来吧~

### 解码效果为何不佳
另外，很多童鞋问过我一些问题，例如**为何光场工具包解码出来的图像质量如此之差，始终达不到Lytro Desktop导出图像的质量**。其实该问题是个普遍现象，目前没有一个好的解决方法。光场工具包的发明者**Donald Dansereau**在[Google Plus](https://plus.google.com/communities/114934462920613225440)也是这么认为的，我把原话附在下面：

{% note %}
Q from email: there are differences between the toolbox decoded output and the Lytro Desktop's image. The differences involve color, intensity and noise. How can I fix this?

A: Thanks for the email. There will always be important differences between the Lytro software output and the toolbox output. The toolbox tries to generate a 4D light field that is as close as possible to the raw image measured by the camera, while still being a standard two-plane parameterized 4D light field. The Lytro software has a very different goal. They do not produce a 4D light field, they produce 2D renders. These are optimized to look nice, and evidently look much nicer than any 2D slice taken from the toolbox output. They use sophisticated decoding and denoising techniques to do this.
The philosophy of the toolbox is to provide a 4D light field close to the raw image captured by the camera, to allow researchers to explore the characteristics of this kind of signal. It should, in theory, be possible to go from the 4D light field output by the toolbox to nice 2D renderings like those produced by the Lytro software. Making nice 2D renderings can also be accomplished by working directly from the lenslet image, as has been demonstrated in a few papers by researchers at Lytro and elsewhere.
{% endnote %}
从他的回复可以看到，他提供的**光场工具包的目的是尽量提供光场相机采集的原汁原味的数据（raw data）用来逼近4D光场信息**；同时让研究者去研究这些数据，为他们所用。但是Lytro公司提供**Lytro desktop的目的是渲染出漂亮的2D图像，以供用户使用**。以上也反映了研究和商业重要区别，Lytro并未提供他们渲染的方式，属内部机密。

此外我也单独问了Donald Dansereau同样的问题，我把他的回复建议原话附在下面：
{% note success %}
If you want to make nice 2D images, I suggest

**Filter before colour correction**.  Try a simple planar focus filter (LFFiltShiftSum, or one of the linear filters in the LFDemoBasicFilt* examples).

**Don't use the toolbox colour correction**, the code is extremely simplistic and is mostly meant to show you where the metadata is.
Look into some **4D - to - 2D rendering techniques** for light fields.

Look into some **2D denoising techniques** and apply them to your 2D render, or to the 4D light field slices.

If you do find something that works well for you please share, as this is a common question.
{% endnote %}

我习惯的参数设置：颜色校正的参数设为**Gamma=0.8或者小于0.8**，这个参数你可以不停地试。另外，我一般不用我公布代码里的频域滤波，因为我认为这步会很大程度地破坏原始数据。我会选用中心视角邻域的几个视角，例如原来ILLUM提供的是15x15个视角，但是我只用其中的11x11或者更少，这样就可以不用考虑边界视角黑暗的问题了。当然大家可以尝试下按照Donald Dansereau的说法进行尝试，如果大家有好的方法，也可以告诉我。（PS：以上为回复@lixiaohao同学邮件部分内容）





### 测试代码

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

### 数字重聚焦

利用如下的重聚焦公式可以实现光场图像的重聚焦。
$$
L_{\alpha}(x,y,u,v)=L_0(x+(1-\frac{1}{\alpha})u,y+(1-\frac{1}{\alpha})v,u,v)
$$

![](http://oofx6tpf6.bkt.clouddn.com/concatImg.png)
左图为其中心视角图像，右图为重聚焦（参数 $\alpha$ =0.5）之后的图像。

给出部分测试代码如下，全部代码见**[Github](https://github.com/Vincentqyw/Light-Field-Refocusing)**;

```matlab
%% This is a demo of light field refocusing
% input: LF 
% ouput: refocused pinhole image
% Writen by: Vincent Qin
% Data: 2018 May 17th 21:35:14

%% Note: the input is 5D LF data  decoded from Matlab Light field Toolbox

clc;

addpath(genpath(pwd));
%% mex function
cd('src'); 
mex REMAP2REFOCUS_mex.c 
mex BLOCKMEAN_mex.c 
cd ..

use_vincent_data=1;

if use_vincent_data
    disp('Downloading LF data, please wait...');

    URL='http://p8vl2tjcq.bkt.clouddn.com/LF.mat';
    [f, status] = urlwrite(URL,'input/LF_web.mat');
    if status == 1;
        fprintf(1,'Success！\n');
    else
        fprintf(1,'Failed！\n');
    end
    load('input/LF_web.mat');
else
    load('input/your_LF_data.mat');
end

disp('Processing LF to Remap image...');

LF=LF(:,:,:,:,1:3);
[UV_diameter,~,y_size,x_size,c]=size(LF);

%  get LF remap and pinhole image before refocusing
LF_Remap = LF2Remap(LF);
% IM_Refoc_1 = zeros(y_size, x_size,3);temp = zeros(y_size, x_size);
% BLOCKMEAN_mex(x_size, y_size, UV_diameter, LF_Remap(:,:,1), temp);IM_Refoc_1(:,:,1)=temp;
% BLOCKMEAN_mex(x_size, y_size, UV_diameter, LF_Remap(:,:,2), temp);IM_Refoc_1(:,:,2)=temp;
% BLOCKMEAN_mex(x_size, y_size, UV_diameter, LF_Remap(:,:,3), temp);IM_Refoc_1(:,:,3)=temp;

% get params
LF_x_size = x_size * UV_diameter;
LF_y_size = y_size * UV_diameter;
UV_radius = (UV_diameter-1)/2;
UV_size   = UV_diameter*UV_diameter;

% collect data
LF_parameters       = struct(...
                             'LF_x_size',LF_x_size,...
                             'LF_y_size',LF_y_size,...
                             'x_size',x_size,...
                             'y_size',y_size,...
                             'UV_radius',(UV_diameter-1)/2,...
                             'UV_diameter',UV_diameter,...
                             'UV_size',UV_diameter*UV_diameter) ;

% predefine output
LF_Remap_alpha   = zeros(LF_y_size,LF_x_size,3) ;
IM_Refoc_alpha   = zeros(y_size,x_size,3)       ;

% here begins refocusing
disp('Processing refocusing...');
alpha=0.5;    %　shearing number
REMAP2REFOCUS_mex(x_size,y_size,UV_diameter,UV_radius,LF_Remap,LF_Remap_alpha,IM_Refoc_alpha,alpha);  

% show figure
central_view=squeeze(LF(UV_radius+1,UV_radius+1,:,:,:));
figure; imshow(central_view);
title('central view');set(gcf,'color',[1 1 1]);  
figure; imshow(IM_Refoc_alpha);
title(['refocused image pinhole at alpha = ' num2str(alpha)]);
set(gcf,'color',[1 1 1]);  

% concat them
concatImg=[central_view,IM_Refoc_alpha];
figure;imshow(concatImg);set(gcf,'color',[1 1 1]); 
imwrite(concatImg,'concatImg.png');
```

### Lytro Desktop

Lytro Desktop是曾经的Lytro官方提供的软件，可以处理由Lytro系列相机拍摄到的图像。利用该软件能够导出相机配对数据、重聚焦图像、全聚焦图、深度图、原始文件等。下面给出一些常用的导出文件。
- 导入需要处理的图像

![](http://oofx6tpf6.bkt.clouddn.com/lytro-desktop-1.jpg)
- 导出配对数据

![](http://oofx6tpf6.bkt.clouddn.com/lytro-desktop-3.jpg)
- 导出待处理图像的各种格式

![](http://oofx6tpf6.bkt.clouddn.com/lytro-desktop-2.jpg)
- 全聚焦彩色图与内置深度图

![](http://oofx6tpf6.bkt.clouddn.com/color-depth.jpg)
- 重聚焦

![](http://oofx6tpf6.bkt.clouddn.com/refocusing.jpg)
- H.264电影

{% dplayer url="http://oofx6tpf6.bkt.clouddn.com/molly.mp4" "http://oofx6tpf6.bkt.clouddn.com/molly.jpg" "api=https://api.prprpr.me/dplayer/" "id=4d5c01842f37d90651f9693783c6564279fed6f4" "loop=true" %}


**<center>以上，如有问题欢迎评论</center>**