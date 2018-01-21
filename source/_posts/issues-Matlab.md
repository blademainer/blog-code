---
title: Matlab相关问题汇总
comments: true
categories: Matlab大法好
tags: Matlab
abbrlink: 22789
date: 2017-01-16 10:43:01
---


<center><img src="http://www.vincentqin.tech/2017/01/16/Matlab%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%E6%B1%87%E6%80%BB/matlab.jpg" width="100%"></center>

以下是我在使用Matlab编程时遇到的问题以及解决方法，最后彩蛋随时补充。


<!-- more -->


## Matlab 写入Excel错误

### 问题描述
>Matlab 在创建EXCEL文件的时候总是出错，即使使用MATLAB自带的程序。 问题描述：在Matlab中使用xlswrite函数时，如果excel文件存在时，则程序能够正常运行；当excel文件不存在时，则会出现错误：

```matlab
 Error using xlswrite (line 220) Error: 服务器出现意外情况。
```

问题解决：xlswrite函数在调用时会占用Excel的com端口，所以要保证在调用时这个端口是开放的，也就是没有被其他程序占用。打开任意一个Excel（我的是16版）文档，点击**文件**--**选项**，弹出Excel选项卡，在**加载项**中可以看到，活动应用程序加载项，以及非活动应用程序加载项；
由于我的系统中装了一个福昕阅读器，该程序占用了Excel的com端口，所以当Matlab再去调用这个端口时就会出现异常。具体解决方法：点击管理旁边的下拉菜单，选择COM加载项，点击转到，把福昕阅读器的前面的勾去掉，然后确定。<center>![这里写图片描述](http://img.blog.csdn.net/20160628202102846)![这里写图片描述](http://img.blog.csdn.net/20160628202117268)</center>



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

 - 今天学到一个特别简单的语句，删除元胞数组中空元素： **a(cellfun(@isempty,a))=[]**；（2016.05.19）

## Matlab显示图片错误
### 问题描述
> MATLAB图像显示总是白色

  imshow是一个很强大的"武器"，显示图像简直无所不能，但这其中往往会出现问题。在处理图像时，我们的图像经常是经过了某种运算，为了保证其精度，系统会自动的将uint8型数据类型转化成double型。

   “如果直接运行imshow(I)，我们会发现显示的是一个白色的图像。这是因为imshow()显示图像时对double型是认为在0~1范围内，即大于1时都是显示为白色，而imshow显示uint8型时是0~255范围。而经过运算的范围在0-255之间的double型数据就被不正常得显示为白色图像了。
   ”

### 解决之道

- 可以利用mat2gray()函数，这个函数是归一化函数，可以把数据归一化到0-1之间，再用imshow()就可以了；
- 或者对于一个处理后的黑白图像Img，若为double型可以这样写：imshow(Img/max(Img(:)))；
- 还有一种就是：imshow(Img,[]);就是加一个[]，即可以自动调整显示；

## 彩蛋

 - 大神教我们怎么画图，#MATLAB无所不能#，[戳戳这里](http://blogs.mathworks.com/graphics/)~
 - Matlab 字体困扰了我很长时间，终于在网上找到了一个比较好的组合，[猛戳这里](http://pan.baidu.com/s/1geIRi2R)！[原文地址](http://blog.csdn.net/whoispo/article/details/50383362)
