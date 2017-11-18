---
title: Matlab Deep Learning学习笔记
tags:
  - CNN
  - CIFAR10
  - Deep Learning
  - Matlab
comments: true
mathjax: true
abbrlink: 25505
date: 2017-11-19 01:22:40
---


![](http://oofx6tpf6.bkt.clouddn.com/cifar10-fig.png)
本文列举了几个在Matlab上学习Deep Learning的例子。务必保证主机已经安装Matlab 2017a及以上。
<!--more-->

## 手写字符识别

利用CNN做数字分类实验。

接下来的实验会阐明如何进行：
- 加载图像数据
- 设计网络结构
- 设置网络训练参数
- 训练网络
- 预测新数据的类别


### 加载图像数据


``` matlab
digitDatasetPath = fullfile(matlabroot,'toolbox','nnet','nndemos',...
    'nndatasets','DigitDataset');
% imageDatastore函数 能够通过文件夹名自动地把数据存储成ImageDatastore 对象
digitData = imageDatastore(digitDatasetPath,...
    'IncludeSubfolders',true,'LabelSource','foldernames');

% Display some of the images in the datastore.
figure;
perm = randperm(10000,25);
for i = 1:25
    subplot(5,5,i);
    imshow(digitData.Files{perm(i)});
end
```
以下是手写字符的部分数据：

![](http://oofx6tpf6.bkt.clouddn.com/17-11-18/63361958.jpg)

### 创建训练集与验证集

``` matlab
trainNumFiles = 750;
[trainDigitData,valDigitData] = splitEachLabel(digitData,750,'randomize'); 
% 每类有1000个，选择其中的750类作为训练集，剩下的作为验证集；此处750可以换成一个比例：75%
```


### 创建自己的网络结构

``` matlab
%% Define Network Architecture
% Define the convolutional neural network architecture.
layers = 
    [
    imageInputLayer([28 28 1])
    convolution2dLayer(3,16,'Padding',1)
    batchNormalizationLayer()
    reluLayer()
    maxPooling2dLayer(2,'Stride',2)
    
    convolution2dLayer(3,32,'Padding',1)
    batchNormalizationLayer()
    reluLayer()
    
    maxPooling2dLayer(2,'Stride',2)
    
    convolution2dLayer(3,64,'Padding',1)
    batchNormalizationLayer()
    reluLayer()
    
    fullyConnectedLayer(10)
    softmaxLayer()
    classificationLayer()
    ];
```
以下就是该网络结构及参数设置：

``` js
 1   ''   Image Input             28x28x1 images with 'zerocenter' normalization
 2   ''   Convolution             16 3x3 convolutions with stride [1  1] and padding [1  1  1  1]
 3   ''   Batch Normalization     Batch normalization
 4   ''   ReLU                    ReLU
 5   ''   Max Pooling             2x2 max pooling with stride [2  2] and padding [0  0  0  0]
 6   ''   Convolution             32 3x3 convolutions with stride [1  1] and padding [1  1  1  1]
 7   ''   Batch Normalization     Batch normalization
 8   ''   ReLU                    ReLU
 9   ''   Max Pooling             2x2 max pooling with stride [2  2] and padding [0  0  0  0]
10   ''   Convolution             64 3x3 convolutions with stride [1  1] and padding [1  1  1  1]
11   ''   Batch Normalization     Batch normalization
12   ''   ReLU                    ReLU
13   ''   Fully Connected         10 fully connected layer
14   ''   Softmax                 softmax
15   ''   Classification Output   crossentropyex
```

### 网络训练参数设计

``` matlab
 options = trainingOptions('sgdm',...
'MaxEpochs',3, ...                 % 训练最大轮回
'ValidationData',valDigitData,...  % 验证集
'ValidationFrequency',30,...
'Verbose',false,...
'Plots','training-progress');
```

### 开始训练
``` matlab
net = trainNetwork(trainDigitData,layers,options);
```

### 测试新的数据
``` matlab
predictedLabels = classify(net,valDigitData);
valLabels = valDigitData.Labels;
accuracy = sum(predictedLabels == valLabels)/numel(valLabels)
```

### 查看某层参数
例如查看第2层的weight参数，输入以下命令：
``` matlab
montage(imresize(mat2gray(net.Layers(2).Weights),[128 128]));
set(gcf,'color',[1 1 1]); 
frame=getframe(gcf); % get the frame
image=frame.cdata;
[image,map]     =  rgb2ind(image,256);  
imwrite(image,map,'weight-layer2.png'); 
```
图像如下所示：
![](http://oofx6tpf6.bkt.clouddn.com/weight-layer2.png)

再看一下第10层的参数：
``` matlab
[~,~,iter,~]=size(net.Layers(10).Weights);
name='weight.gif';
dt=0.4;
for i=1:iter
	montage(imresize(mat2gray(net.Layers(10).Weights(:,:,i,:)),[128 128]));
    set(gcf,'color',[1 1 1]); %变白
	title(['Layer(10), Channel: ',num2str(i)]);
	axis normal
	truesize
	%Creat GIF
	frame(i)=getframe(gcf); % get the frame
	image=frame(i).cdata;
	[image,map]     =  rgb2ind(image,256);  
	if i==1
		 imwrite(image,map,name,'gif');
	else
		 imwrite(image,map,name,'gif','WriteMode','append','DelayTime',dt);
    end
end
```

![](http://oofx6tpf6.bkt.clouddn.com/weight.gif)



## 搭建自己的CNN网络进行分类

CIFAR10和CIFAR100是[80 million tiny images](http://groups.csail.mit.edu/vision/TinyImages/)的子集，是由Alex Krizhevsky, Vinod Nair和 Geoffrey Hinton共同采集。
### [CIFAR10](http://www.cs.toronto.edu/~kriz/cifar.html)
CIFAR10由60000张32\*32的彩色图像组成，一种分成10类，平均每类图像6000张。共有50000张训练图像，10000张测试图像。这个数据集被分成了5个分支，其中每个分支10000张。测试集包含每类中随机选择的1000张图像。训练集就是剩下的那些图像。
对于每个分支的数据的大小是：10000\*3072；其中3072=32\*32\*3。数据以行优先的顺序存储，所以前1024个数据是r通道的数据，接下来的1024个数据是g通道的数据，最后1024个数据是b通道的。
假如原始的数据是data，我们想要将其重新排列成我们需要的数据。首先对其进行转置，然后再用reshape函数对图像重组（可选：最后将图像前两维互换（转置），之所以这么做，可以更好的可视化）。

``` matlab
XBatch = data';
XBatch = reshape(XBatch, 32,32,3,[]);
XBatch = permute(XBatch, [2 1 3 4]);
```
以下是cifar10的部分数据。
![](http://oofx6tpf6.bkt.clouddn.com/cifar10-images.png)
共有10类，包括：airplane，automobile，bird，cat，deer，dog，frog，horse，ship，truck。

### Just run it

接下来我们就开始运行以下代码，来训练我们的网络。闲话少说，show your the code...

``` matlab

%% a simple CNN demo for cifar10 
%% running on Matlab 2017b

% addpath some necessary functions
addpath(fullfile(matlabroot,'examples', 'vision', 'main')); 

% the url of your datasets
cifar10Data = 'F:\DeepLearning\project-1\cifar-10-matlab'; 

% download your datasets from <https://www.cs.toronto.edu/~kriz/cifar-10-matlab.tar.gz>
% if you do not has this datasets, uncomment the following 2 lines
% url = 'https://www.cs.toronto.edu/~kriz/cifar-10-matlab.tar.gz';
% helperCIFAR10Data.download(url, cifar10Data);

%% Load the CIFAR-10 training and test data.
[trainingImages, trainingLabels, testImages, testLabels] = helperCIFAR10Data.load(cifar10Data);
size(trainingImages)
numImageCategories = 10;
categories(trainingLabels)
% Display a few of the training images, resizing them for display.
figure;
set(gcf,'color',[1 1 1])
thumbnails = trainingImages(:,:,:,1:100);
thumbnails = imresize(thumbnails, [64 64]);
montage(thumbnails)

%% Create the image input layer for 32x32x3 CIFAR-10 images
[height, width, numChannels, ~] = size(trainingImages);
imageSize = [height width numChannels];
inputLayer = imageInputLayer(imageSize);

%% Convolutional layer parameters
filterSize = [5 5];
numFilters = 32;

middleLayers = [

% The first convolutional layer has a bank of 32 5x5x3 filters. A
% symmetric padding of 2 pixels is added to ensure that image borders
% are included in the processing. This is important to avoid
% information at the borders being washed away too early in the
% network.
convolution2dLayer(filterSize, numFilters, 'Padding', 2);

% Note that the third dimension of the filter can be omitted because it
% is automatically deduced based on the connectivity of the network. In
% this case because this layer follows the image layer, the third
% dimension must be 3 to match the number of channels in the input
% image.

% Next add the ReLU layer:
reluLayer();

% Follow it with a max pooling layer that has a 3x3 spatial pooling area
% and a stride of 2 pixels. This down-samples the data dimensions from
% 32x32 to 15x15.
maxPooling2dLayer(3, 'Stride', 2);

% Repeat the 3 core layers to complete the middle of the network.
convolution2dLayer(filterSize, numFilters, 'Padding', 2);
reluLayer();
maxPooling2dLayer(3, 'Stride',2);

convolution2dLayer(filterSize, 2 * numFilters, 'Padding', 2);
reluLayer();
maxPooling2dLayer(3, 'Stride',2);
]

finalLayers = [

% Add a fully connected layer with 64 output neurons. The output size of
% this layer will be an array with a length of 64.
fullyConnectedLayer(64);

% Add an ReLU non-linearity.
reluLayer();

% Add the last fully connected layer. At this point, the network must
% produce 10 signals that can be used to measure whether the input image
% belongs to one category or another. This measurement is made using the
% subsequent loss layers.
fullyConnectedLayer(numImageCategories);

% Add the softmax loss layer and classification layer. The final layers use
% the output of the fully connected layer to compute the categorical
% probability distribution over the image classes. During the training
% process, all the network weights are tuned to minimize the loss over this
% categorical distribution.
softmaxLayer();
classificationLayer;
]
layers = [
    inputLayer
    middleLayers
    finalLayers
    ]
layers(2).Weights = 0.0001 * randn([filterSize numChannels numFilters]);
% Set the network training options
opts = trainingOptions('sgdm', ...
    'Momentum', 0.9, ...
    'InitialLearnRate', 0.002, ...
    'LearnRateSchedule', 'piecewise', ...
    'LearnRateDropFactor', 0.1, ...
    'LearnRateDropPeriod', 8, ...
    'L2Regularization', 0.004, ...
    'MaxEpochs', 20, ...
    'MiniBatchSize', 128, ...
    'Verbose', true,...
    'ExecutionEnvironment','gpu');
% A trained network is loaded from disk to save time when running the
% example. Set this flag to true to train the network.
doTraining = true;

if doTraining
    % Train a network.
    cifar10Net = trainNetwork(trainingImages, trainingLabels, layers, opts);
else
    % Load pre-trained detector for the example.
    load('rcnnStopSigns.mat','cifar10Net')
end

% Run the network on the test set.
YTest = classify(cifar10Net, testImages);

% Calculate the accuracy.
accuracy = sum(YTest == testLabels)/numel(testLabels)
```

``` js
1   'imageinput'    Image Input         28x28x1 images with 'zerocenter' normalization
2   'conv_1'        Convolution         16 3x3x1 convolutions with stride [1  1] and padding [1  1  1  1]
3   'batchnorm_1'   Batch Normalization Batch normalization with 16 channels
4   'relu_1'        ReLU                ReLU
5   'maxpool_1'     Max Pooling         2x2 max pooling with stride [2  2] and padding [0 0  0  0]
6   'conv_2'        Convolution         32 3x3x16 convolutions with stride [1  1] and padding [1  1  1  1]
7   'batchnorm_2'   Batch Normalization Batch normalization with 32 channels
8   'relu_2'        ReLU                ReLU
9   'maxpool_2'     Max Pooling         2x2 max pooling with stride [2  2] and padding [0  0  0 0]
10   'conv_3'       Convolution         64 3x3x32 convolutions with stride [1  1] and padding [1 1  1  1]
11   'batchnorm_3'  Batch Normalization Batch normalization with 64 channels
12   'relu_3'       ReLU                    ReLU
13   'fc'           Fully Connected         10 fully connected layer
14   'softmax'      Softmax                 softmax
15   'classoutput'  Classification Output   crossentropyex with '0', '1', and 8 other classes
```

以下是训练过程输出：

|     Epoch    |   Iteration  | Time Elapsed(seconds)  |  Mini-batch Loss |  Mini-batch Accuracy | Base Learning Rate|
| ----------| --------- |:---------:| :-----:|:-----:  |:-----:  |
|            1 |            1 |         0.06 |       2.3026 |        8.59% |       0.0020 |
|            1 |           50 |         1.27 |       2.3026 |       14.06% |       0.0020 |
|            1 |          100 |         2.52 |       2.3024 |        7.81% |       0.0020 |
|            1 |          150 |         3.73 |       2.2999 |       20.31% |       0.0020 |
|            1 |          200 |         5.01 |       2.2740 |       15.63% |       0.0020 |
|            1 |          250 |         6.28 |       2.1194 |       21.09% |       0.0020 |
|            1 |          300 |         7.58 |       1.9100 |       23.44% |       0.0020 |
|            1 |          350 |         8.86 |       1.8892 |       28.13% |       0.0020 |
|            2 |          400 |        10.08 |       1.7490 |       29.69% |       0.0020 |
|            2 |          450 |        11.32 |       1.8377 |       31.25% |       0.0020 |
|            2 |          500 |        12.57 |       1.6073 |       39.84% |       0.0020 |
|            2 |          550 |        13.94 |       1.5701 |       42.19% |       0.0020 |
|            2 |          600 |        15.15 |       1.3507 |       50.78% |       0.0020 |
|            2 |          650 |        16.38 |       1.4391 |       48.44% |       0.0020 |
|            2 |          700 |        17.66 |       1.3671 |       49.22% |       0.0020 |
|            2 |          750 |        18.92 |       1.5472 |       45.31% |       0.0020 |
|            3 |          800 |        20.17 |       1.2632 |       53.13% |       0.0020 |
|            3 |          850 |        21.48 |       1.2793 |       56.25% |       0.0020 |
|            3 |          900 |        22.69 |       1.1790 |       60.16% |       0.0020 |
|            3 |          950 |        23.95 |       1.2033 |       57.81% |       0.0020 |
|            3 |         1000 |        25.22 |       0.9942 |       64.84% |       0.0020 |
|            3 |         1050 |        26.52 |       1.3352 |       58.59% |       0.0020 |
|            3 |         1100 |        27.84 |       0.9810 |       70.31% |       0.0020 |
|            3 |         1150 |        29.11 |       1.0424 |       67.97% |       0.0020 |
|            4 |         1200 |        30.41 |       1.0653 |       62.50% |       0.0020 |
|            4 |         1250 |        31.65 |       1.0066 |       62.50% |       0.0020 |
|            4 |         1300 |        32.88 |       0.9886 |       66.41% |       0.0020 |
|            4 |         1350 |        34.17 |       0.9842 |       62.50% |       0.0020 |
|            4 |         1400 |        35.52 |       0.8894 |       71.88% |       0.0020 |
|            4 |         1450 |        36.88 |       0.9506 |       64.06% |       0.0020 |
|            4 |         1500 |        38.36 |       1.0310 |       60.16% |       0.0020 |
|            4 |         1550 |       252.04 |       0.9446 |       67.97% |       0.0020 |
|            5 |         1600 |       253.36 |       0.9401 |       66.41% |       0.0020 |
|            5 |         1650 |       254.67 |       1.0163 |       65.63% |       0.0020 |
|            5 |         1700 |       255.97 |       0.8410 |       71.88% |       0.0020 |
|            5 |         1750 |       257.31 |       0.6903 |       76.56% |       0.0020 |
|            5 |         1800 |       258.68 |       0.8257 |       71.88% |       0.0020 |
|            5 |         1850 |       259.96 |       0.8490 |       70.31% |       0.0020 |
|            5 |         1900 |       261.28 |       0.8806 |       65.63% |       0.0020 |
|            5 |         1950 |       262.55 |       0.7470 |       75.00% |       0.0020 |
|            6 |         2000 |       263.82 |       0.7600 |       70.31% |       0.0020 |
|            6 |         2050 |       265.11 |       0.9844 |       66.41% |       0.0020 |
|            6 |         2100 |       266.39 |       0.8914 |       70.31% |       0.0020 |
|            6 |         2150 |       267.70 |       0.6644 |       75.78% |       0.0020 |
|            6 |         2200 |       269.00 |       0.8662 |       73.44% |       0.0020 |
|            6 |         2250 |       270.34 |       0.7505 |       78.13% |       0.0020 |
|            6 |         2300 |       271.75 |       0.6974 |       68.75% |       0.0020 |
|            7 |         2350 |       273.04 |       0.6320 |       76.56% |       0.0020 |
|            7 |         2400 |       274.35 |       0.8597 |       69.53% |       0.0020 |
|            7 |         2450 |       275.72 |       0.5654 |       82.03% |       0.0020 |
|            7 |         2500 |       277.01 |       0.6571 |       76.56% |       0.0020 |
|            7 |         2550 |       278.36 |       0.6455 |       75.78% |       0.0020 |
|            7 |         2600 |       279.64 |       0.6780 |       75.78% |       0.0020 |
|            7 |         2650 |       281.04 |       0.6790 |       71.88% |       0.0020 |
|            7 |         2700 |       282.27 |       0.8688 |       67.97% |       0.0020 |
|            8 |         2750 |       283.48 |       0.7690 |       69.53% |       0.0020 |
|            8 |         2800 |       284.78 |       0.8445 |       71.88% |       0.0020 |
|            8 |         2850 |       286.02 |       0.6690 |       70.31% |       0.0020 |
|            8 |         2900 |       287.32 |       0.6433 |       78.91% |       0.0020 |
|            8 |         2950 |       288.66 |       0.5967 |       78.91% |       0.0020 |
|            8 |         3000 |       290.00 |       0.7889 |       75.00% |       0.0020 |
|            8 |         3050 |       291.33 |       0.6210 |       78.13% |       0.0020 |
|            8 |         3100 |       292.63 |       0.6594 |       77.34% |       0.0020 |
|            9 |         3150 |       293.86 |       0.7263 |       78.13% |       0.0002 |
|            9 |         3200 |       295.13 |       0.6098 |       76.56% |       0.0002 |
|            9 |         3250 |       296.40 |       0.6055 |       76.56% |       0.0002 |
|            9 |         3300 |       297.73 |       0.6234 |       76.56% |       0.0002 |
|            9 |         3350 |       299.03 |       0.6268 |       82.81% |       0.0002 |
|            9 |         3400 |       300.34 |       0.4702 |       82.03% |       0.0002 |
|            9 |         3450 |       301.62 |       0.4798 |       83.59% |       0.0002 |
|            9 |         3500 |       302.88 |       0.4072 |       81.25% |       0.0002 |
|           10 |         3550 |       304.13 |       0.5794 |       79.69% |       0.0002 |
|           10 |         3600 |       305.43 |       0.5458 |       85.16% |       0.0002 |
|           10 |         3650 |       306.68 |       0.4539 |       84.38% |       0.0002 |
|           10 |         3700 |       307.96 |       0.3521 |       89.84% |       0.0002 |
|           10 |         3750 |       309.20 |       0.3972 |       86.72% |       0.0002 |
|           10 |         3800 |       310.44 |       0.4207 |       83.59% |       0.0002 |
|           10 |         3850 |       311.69 |       0.4341 |       83.59% |       0.0002 |
|           10 |         3900 |       312.92 |       0.2996 |       89.06% |       0.0002 |
|           11 |         3950 |       314.16 |       0.3791 |       90.63% |       0.0002 |
|           11 |         4000 |       315.38 |       0.6310 |       82.03% |       0.0002 |
|           11 |         4050 |       316.60 |       0.5047 |       79.69% |       0.0002 |
|           11 |         4100 |       317.93 |       0.3989 |       88.28% |       0.0002 |
|           11 |         4150 |       319.19 |       0.5099 |       84.38% |       0.0002 |
|           11 |         4200 |       320.42 |       0.4630 |       83.59% |       0.0002 |
|           11 |         4250 |       321.63 |       0.3826 |       85.16% |       0.0002 |
|           12 |         4300 |       322.89 |       0.4811 |       87.50% |       0.0002 |
|           12 |         4350 |       324.14 |       0.5673 |       79.69% |       0.0002 |
|           12 |         4400 |       325.41 |       0.4076 |       87.50% |       0.0002 |
|           12 |         4450 |       326.64 |       0.4463 |       86.72% |       0.0002 |
|           12 |         4500 |       327.99 |       0.4293 |       86.72% |       0.0002 |
|           12 |         4550 |       329.26 |       0.4358 |       81.25% |       0.0002 |
|           12 |         4600 |       330.47 |       0.4431 |       88.28% |       0.0002 |
|           12 |         4650 |       331.71 |       0.5435 |       82.03% |       0.0002 |
|           13 |         4700 |       332.95 |       0.5352 |       79.69% |       0.0002 |
|           13 |         4750 |       334.16 |       0.5147 |       84.38% |       0.0002 |
|           13 |         4800 |       335.39 |       0.5522 |       73.44% |       0.0002 |
|           13 |         4850 |       336.66 |       0.3779 |       85.94% |       0.0002 |
|           13 |         4900 |       338.02 |       0.3394 |       89.84% |       0.0002 |
|           13 |         4950 |       339.25 |       0.4669 |       83.59% |       0.0002 |
|           13 |         5000 |       340.51 |       0.4054 |       85.94% |       0.0002 |
|           13 |         5050 |       341.74 |       0.4444 |       87.50% |       0.0002 |
|           14 |         5100 |       342.97 |       0.5341 |       81.25% |       0.0002 |
|           14 |         5150 |       344.21 |       0.4745 |       81.25% |       0.0002 |
|           14 |         5200 |       345.47 |       0.4576 |       83.59% |       0.0002 |
|           14 |         5250 |       346.68 |       0.4825 |       80.47% |       0.0002 |
|           14 |         5300 |       348.00 |       0.4949 |       84.38% |       0.0002 |
|           14 |         5350 |       349.24 |       0.3859 |       83.59% |       0.0002 |
|           14 |         5400 |       350.48 |       0.3783 |       86.72% |       0.0002 |
|           14 |         5450 |       351.70 |       0.3595 |       86.72% |       0.0002 |
|           15 |         5500 |       352.92 |       0.4481 |       83.59% |       0.0002 |
|           15 |         5550 |       354.13 |       0.4404 |       85.94% |       0.0002 |
|           15 |         5600 |       355.36 |       0.3766 |       87.50% |       0.0002 |
|           15 |         5650 |       356.57 |       0.3081 |       90.63% |       0.0002 |
|           15 |         5700 |       357.91 |       0.3222 |       89.84% |       0.0002 |
|           15 |         5750 |       359.17 |       0.3549 |       88.28% |       0.0002 |
|           15 |         5800 |       360.37 |       0.3722 |       85.94% |       0.0002 |
|           15 |         5850 |       361.62 |       0.2671 |       91.41% |       0.0002 |
|           16 |         5900 |       362.86 |       0.2890 |       92.19% |       0.0002 |
|           16 |         5950 |       364.08 |       0.5407 |       85.94% |       0.0002 |
|           16 |         6000 |       365.33 |       0.4010 |       87.50% |       0.0002 |
|           16 |         6050 |       366.58 |       0.3321 |       89.06% |       0.0002 |
|           16 |         6100 |       367.97 |       0.4393 |       86.72% |       0.0002 |
|           16 |         6150 |       369.33 |       0.4067 |       85.16% |       0.0002 |
|           16 |         6200 |       370.64 |       0.3223 |       90.63% |       0.0002 |
|           17 |         6250 |       371.90 |       0.4250 |       86.72% |     2.00e-05 |
|           17 |         6300 |       373.19 |       0.5366 |       79.69% |     2.00e-05 |
|           17 |         6350 |       374.43 |       0.3064 |       92.97% |     2.00e-05 |
|           17 |         6400 |       375.69 |       0.3514 |       88.28% |     2.00e-05 |
|           17 |         6450 |       376.98 |       0.3675 |       86.72% |     2.00e-05 |
|           17 |         6500 |       378.33 |       0.3349 |       87.50% |     2.00e-05 |
|           17 |         6550 |       379.59 |       0.3474 |       90.63% |     2.00e-05 |
|           17 |         6600 |       380.87 |       0.4294 |       83.59% |     2.00e-05 |
|           18 |         6650 |       382.12 |       0.4112 |       85.94% |     2.00e-05 |
|           18 |         6700 |       383.36 |       0.4332 |       85.16% |     2.00e-05 |
|           18 |         6750 |       384.61 |       0.4859 |       79.69% |     2.00e-05 |
|           18 |         6800 |       385.85 |       0.3246 |       88.28% |     2.00e-05 |
|           18 |         6850 |       387.10 |       0.2643 |       91.41% |     2.00e-05 |
|           18 |         6900 |       388.44 |       0.3765 |       91.41% |     2.00e-05 |
|           18 |         6950 |       389.69 |       0.3487 |       86.72% |     2.00e-05 |
|           18 |         7000 |       390.97 |       0.4068 |       88.28% |     2.00e-05 |
|           19 |         7050 |       392.24 |       0.4772 |       83.59% |     2.00e-05 |
|           19 |         7100 |       393.51 |       0.4213 |       82.81% |     2.00e-05 |
|           19 |         7150 |       394.79 |       0.3608 |       89.06% |     2.00e-05 |
|           19 |         7200 |       396.05 |       0.4320 |       82.81% |     2.00e-05 |
|           19 |         7250 |       397.37 |       0.4360 |       84.38% |     2.00e-05 |
|           19 |         7300 |       398.71 |       0.3427 |       87.50% |     2.00e-05 |
|           19 |         7350 |       400.00 |       0.3183 |       88.28% |     2.00e-05 |
|           19 |         7400 |       401.24 |       0.3136 |       87.50% |     2.00e-05 |
|           20 |         7450 |       402.56 |       0.4018 |       82.03% |     2.00e-05 |
|           20 |         7500 |       403.85 |       0.4224 |       87.50% |     2.00e-05 |
|           20 |         7550 |       405.10 |       0.3295 |       90.63% |     2.00e-05 |
|           20 |         7600 |       406.39 |       0.2832 |       91.41% |     2.00e-05 |
|           20 |         7650 |       407.74 |       0.2858 |       93.75% |     2.00e-05 |
|           20 |         7700 |       409.06 |       0.3127 |       89.84% |     2.00e-05 |
|           20 |         7750 |       410.38 |       0.3254 |       87.50% |     2.00e-05 |
|           20 |         7800 |       411.64 |       0.2456 |       92.19% |     2.00e-05 |

### 可视化某层的参数

``` matlab
% Extract the first convolutional layer weights
w = cifar10Net.Layers(2).Weights;

% rescale and resize the weights for better visualization
w = mat2gray(w);
w = imresize(w, [100 100]);

figure
montage(w)
name='cifar10-weight-layer2';
set(gcf,'color',[1 1 1]);
frame=getframe(gcf); % get the frame
image=frame.cdata;
[image,map]     =  rgb2ind(image,256);  
imwrite(image,map,[name,'.png']); 
```

![](http://oofx6tpf6.bkt.clouddn.com/cifar10-weight-layer2.png)


## 一些基本问题

- 参数的基本格式
**$$Height \times Width \times NumberofChannels \times NumberofFilters$$**
- SGD是什么？

- 什么是epoch？ 
模型训练的时候一般采用stochastic gradient descent（SGD），一次迭代选取一个batch进行update。一个epoch的意思就是迭代次数*batch的数目 和训练数据的个数一样，就是一个epoch。
- 为什么要是用BN？
Batch normalization layers normalize the activations and gradients propagating through a network, making network training an easier optimization problem. Use batch normalization layers between convolutional layers and nonlinearities, such as ReLU layers, to speed up network training and reduce the sensitivity to network initialization.
- RELU的作用？
*Max-Pooling Layer* Convolutional layers (with activation functions) are sometimes followed by a down-sampling operation that reduces the spatial size of the feature map and removes redundant spatial information. Down-sampling makes it possible to increase the number of filters in deeper convolutional layers without increasing the required amount of computation per layer. One way of down-sampling is using a max pooling. The max pooling layer returns the maximum values of rectangular regions of inputs.
- *add more*