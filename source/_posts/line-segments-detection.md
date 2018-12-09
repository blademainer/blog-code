---
title: 资料：Line Segments Detection
date: 2018-11-18 15:11:20
tags:
  - cv
  - line segment
  - detection
layout: blog
comments: true
categories: CV
mathjax: true
---


线段检测算法汇总，若无时间看正文，直接到[链接](https://github.com/Vincentqyw/LineSegmentsDetection)看线段检测算法代码集合。

<!--more-->

## HoughLine
基于`hough`变换的线段检测算法。`opencv`提供了2个基于`hough`变换的函数：`cv::HoughLines()`以及`cv::HoughLinesP()`。其中`cv::HoughLines()`为[标准霍夫变换](https://docs.opencv.org/master/dd/d1a/group__imgproc__feature.html#ga46b4e588934f6c8dfd509cc6e0e4545a)，此函数通常不会用到，它经常会被[累积概率霍夫变换](https://docs.opencv.org/master/dd/d1a/group__imgproc__feature.html#ga8618180a5948286384e3b7ca02f6feeb)函数`cv::HoughLinesP()`代替。概率霍夫变换函数原型：

``` c
void cv::HoughLinesP(InputArray image,
OutputArray lines,
double 	rho,
double 	theta,
int 	threshold,
double 	minLineLength = 0,
double 	maxLineGap = 0
)
```
注意函数返回值`line`，它是一个四维向量$(x_1,y_1,x_2,y_2)$，其中$(x_1,y_1)$以及$(x_2,y_2)$分别表示线段的端点坐标。以下给出示例代码：

``` c
#include <opencv2/imgproc.hpp>
#include <opencv2/highgui.hpp>
using namespace cv;
using namespace std;
int main(int argc, char** argv)
{
    Mat src, dst, color_dst;
    if( argc != 2 || !(src=imread(argv[1], 0)).data)
        return -1;
    // 边缘检测转换为二值边缘图
    Canny( src, dst, 50, 200, 3 );
    cvtColor( dst, color_dst, COLOR_GRAY2BGR );
    vector<Vec4i> lines;
    HoughLinesP( dst, lines, 1, CV_PI/180, 80, 30, 10 );
    for( size_t i = 0; i < lines.size(); i++ )
    {
        line( color_dst, Point(lines[i][0], lines[i][1]),
        Point( lines[i][2], lines[i][3]), Scalar(0,0,255), 3, 8 );
    }
    namedWindow( "Source", 1 );
    imshow( "Source", src );
    namedWindow( "Detected Lines", 1 );
    imshow( "Detected Lines", color_dst );
    waitKey(0);
    return 0;
}
```

## [LSD](http://www.ipol.im/pub/art/2012/gjmr-lsd/)

- 论文标题："LSD: a Line Segment Detector"
- 项目主页：http://www.ipol.im/pub/art/2012/gjmr-lsd/
- 论文地址：http://www.ipol.im/pub/art/2012/gjmr-lsd/article.pdf
- 代码地址：http://www.ipol.im/pub/art/2012/gjmr-lsd/lsd_1.5.zip

该方法是目前性价比（速度精度）最好的算法，现已经集成到`opencv`中[`LSDDetector`](https://docs.opencv.org/master/d1/dbd/classcv_1_1line__descriptor_1_1LSDDetector.html)。LSD能够在线性时间内检测到亚像素精度的线段。无需调整参数，适用于各种场景。因为每张图有误检，LSD能够控制误检率。PS：论文此处不介绍了，可以参考[这里](https://blog.csdn.net/chishuideyu/article/details/78081643?locationNum=9&fps=1)。

## LSWMS

- 论文标题："Line segment detection using weighted mean shift procedures on a 2D slice sampling strategy"
- 论文地址：[https://www.researchgate.net/LSWMS.pdf](https://www.researchgate.net/profile/Marcos_Nieto3/publication/220654859_Line_segment_detection_using_weighted_mean_shift_procedures_on_a_2D_slice_sampling_strategy/links/56a5d56a08aef91c8c16b1ac.pdf?inViewer=0&origin=publication_detail&pdfJsDownload=0)
- 代码地址：https://sourceforge.net/projects/lswms/

## EDline（ED: Edge Drawing）
- 论文标题："Edge Drawing: A Combined Real-Time Edge and Segment Detector"
- 论文地址：https://sci-hub.tw/10.1016/j.jvcir.2012.05.004
- 代码地址：https://github.com/mtamburrano/LBD_Descriptor

## [CannyLines](http://cvrs.whu.edu.cn/projects/cannyLines/)

- 论文标题："CannyLines: A Parameter-Free Line Segment Detector"
- 项目主页：http://cvrs.whu.edu.cn/projects/cannyLines/
- 论文地址：http://cvrs.whu.edu.cn/projects/cannyLines/papers/CannyLines-ICIP2015.pdf
- 代码地址：http://cvrs.whu.edu.cn/projects/cannyLines/codes/CannyLines-v3.rar

本文提出了一种鲁棒的线段检测算法来有效地检测来自输入图像的线段。首先，文章提出了一种无参数的Canny算子，称为Canny（PANYPF），通过自适应地设置传统Canny算子的低阈值和高阈值来鲁棒地从输入图像中提取边缘。然后，提出了有效的像素连接和分割技术，直接从边缘图中收集共线点群，用于基于最小二乘拟合方法拟合初始线段。第三，通过有效的扩展和合并，产生更长、更完整的线段。最后，利用亥姆霍兹原理（Helmholtz Principle）对所有的检测线段检测，主要考虑梯度方向和幅度信息。该算法能够在人工场景中能够获得比LSD以及EDline精度更高以及平均长度更高的线段。

## MCMLSD

- 论文标题："MCMLSD: A Dynamic Programming Approach to Line Segment Detection"
- 论文地址：http://openaccess.thecvf.com/content_cvpr_2017/papers/Almazan_MCMLSD_A_Dynamic_CVPR_2017_paper.pdf
- 代码地址：http://www.elderlab.yorku.ca/?smd_process_download=1&download_id=8423



