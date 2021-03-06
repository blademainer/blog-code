---
title: Matlab相关问题汇总
comments: true
categories: Matlab大法好
tags: Matlab
abbrlink: 22789
date: 2017-01-16 10:43:01
---

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/issues-Matlab/matlab-logo.jpg" width=1000px>


以下是我在使用Matlab编程时遇到的问题以及解决方法，最后彩蛋随时补充。


<!-- more -->
## Matlab绘制GIF动图

```matlab
input_file_path='your image folder';
out_name = 'out'; %output name

img_path_list=dir(strcat(input_file_path,'*.jpg')); %image format
[~, ind] = sort([img_path_list(:).datenum], 'ascend');
img_path_list = img_path_list(ind);
img_num=length(img_path_list);

if img_num == 0
    disp('No images in the folder!');
else
    for j=1:img_num
        image_name = img_path_list(j).name;
        read_image = imread(strcat(input_file_path,image_name));
        imshow(read_image,'border','tight','initialmagnification','fit');
        axis normal;
        truesize;

        n=j;
        frame(n)=getframe(gcf); % get the frame
        image=frame(n).cdata;
        [image,map]     =  rgb2ind(image,256);

        if n==1
%              imwrite(image,map,outname,'gif');
             imwrite(image,map,[out_name '.gif'],'gif','Loopcount',inf);
        else
             imwrite(image,map,[out_name '.gif'],'WriteMode','append','DelayTime',0.2);
        end
    end
end

```

## Matlab 局部放大图像

论文里的局部放大图，再也不用每次手动截了。

```matlab
function small_im=ZoomIm_(im,pos)
% im= imread('lena.jpg');
% pos=[226,221,340,384];
% [左上X，左上Y，右下X，右下Y]

clc
close all;
figure;

up_leftX=pos(1);
up_leftY=pos(2);
down_rightX=pos(3);
down_rightY=pos(4);

%% mark rectangle in source image
imshow(im);hold on;
set(gcf,'color',[1 1 1]);
line([up_leftX, down_rightX]   ,[up_leftY   ,up_leftY],'linestyle','-','linewidth',3,'color','r');
line([up_leftX, up_leftX]      ,[up_leftY   ,down_rightY],'linestyle','-','linewidth',3,'color','r');
line([down_rightX, down_rightX],[up_leftY   ,down_rightY],'linestyle','-','linewidth',3,'color','r');
line([up_leftX, down_rightX]   ,[down_rightY,down_rightY],'linestyle','-','linewidth',3,'color','r');
hold off;

%% get rect image
figure;
small_im=im(up_leftY:down_rightY,up_leftX:down_rightX,:);
imagesc(small_im);
axis equal
axis off
set(gcf,'color',[1 1 1]);
set(gca,'xtick',[],'ytick',[]);
% set(gca,'position',[0.1 0.1,0.8 0.8])
set(0,'DefaultFigureMenu','figure');
% figure('menubar','on');
% set(0,'Default');
set(gcf,'Position',[500,200,800,500])
end
```


## Matlab 保存超高质量图像

除了直接保存成`eps`或者`emf`格式之外，也可直接在绘制完图像之后，保持当前绘图窗口不要关闭，在**命令行窗口**键入如下命令，然后在word文档/PPT里`ctrl+v`粘贴即可。
```matlab
uimenufcn(gcf,'EditCopyFigure')
```

## Matlab 写入Excel错误

### 问题描述
>Matlab 在创建EXCEL文件的时候总是出错，即使使用MATLAB自带的程序。 问题描述：在Matlab中使用xlswrite函数时，如果excel文件存在时，则程序能够正常运行；当excel文件不存在时，则会出现错误：

```matlab
 Error using xlswrite (line 220) Error: 服务器出现意外情况。
```

### 解决之道

xlswrite函数在调用时会占用Excel的com端口，所以要保证在调用时这个端口是开放的，也就是没有被其他程序占用。打开任意一个Excel（我的是16版）文档，点击**文件**--**选项**，弹出Excel选项卡，在**加载项**中可以看到，活动应用程序加载项，以及非活动应用程序加载项；
由于我的系统中装了一个福昕阅读器，该程序占用了Excel的com端口，所以当Matlab再去调用这个端口时就会出现异常。具体解决方法：点击管理旁边的下拉菜单，选择COM加载项，点击转到，把福昕阅读器的前面的勾去掉，然后确定。

<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/issues-Matlab/issue-matlab-1.png" width="100%">
<img src="https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/issues-Matlab/issue-matlab-2.png" width="100%">


## Matlab设置绘图坐标轴信息

### 问题描述
>Matlab 作图时更改纵轴刻度为科学计数法，指数放在框左上方
 
```matlab
plot([0 1],[0 .02]) % 作图，换成自己的图像就可以~
oldLabels = str2num(get(gca,'YTickLabel'));
scale = 10^2;newLabels = num2str(oldLabels*scale);
set(gca,'YTickLabel',newLabels,'units','normalized');
posAxes = get(gca,'position');
textBox = annotation('textbox','linestyle','none','string',['x 10\it^{' sprintf('%d',log10(1./scale)) '}']);
posAn = get(textBox,'position');
set(textBox,'position',[posAxes(1) posAxes(2)+posAxes(4) posAn(3) posAn(4)],'VerticalAlignment','cap');
```

## Matlab显示图片错误

### 问题描述
> MATLAB图像显示总是白色

`imshow`是一个很强大的"武器"，显示图像简直无所不能，但这其中往往会出现问题。在处理图像时，我们的图像经常是经过了某种运算，为了保证其精度，系统会自动的将`uint8`型数据类型转化成`double`型。

如果直接运行`imshow(I)`，我们会发现显示的是一个白色的图像。这是因为imshow()显示图像时对`double`型是认为在0~1范围内，即大于1时都是显示为白色，而`imshow`显示`uint8`型时是0~255范围。而经过运算的范围在0-255之间的`double`型数据就被不正常得显示为白色图像了。

### 解决之道

- 可以利用`mat2gray()`函数，这个函数是归一化函数，可以把数据归一化到0-1之间，再用`imshow()`就可以了；
- 或者对于一个处理后的黑白图像Img，若为double型可以这样写：`imshow(Img/max(Img(:)))`；
- 还有一种就是：`imshow(Img,[])`;就是加一个`[]`，即可以自动调整显示；

## 常用命令汇总

- （2016.05.19）今天学到一个特别简单的语句，删除元胞数组中空元素：
```matlab
  a(cellfun(@isempty,a))=[];
```
- （2018年6月1日）在命令行敲入如下命令，如果运行出现错误，matlab会自动停在出错的那行，并且保存所有相关变量。
```matlab
dbstop if error
```

## 彩蛋

 - 大神教我们怎么画图，#MATLAB无所不能#，[戳戳这里](http://blogs.mathworks.com/graphics/)~
 - Matlab 字体困扰了我很长时间，终于在网上找到了一个比较好的组合，[猛戳这里](http://pan.baidu.com/s/1geIRi2R)！[原文地址](http://blog.csdn.net/whoispo/article/details/50383362)
 - [Matlab与C混合编程](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/cv-books/matlab-cmex.pdf)
 - [Matlab并行](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/cv-books/matlab-parallel.pdf)
 - [Matlab代码优化：教你写出漂亮的Matlab代码](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/cv-books/Writing-Fast-Matlab-Code.pdf)
