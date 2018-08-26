---
title: 资料：那些年我们一起调过的Bug
tags:
  - bugs
abbrlink: c48fd506
date: 2018-08-26 03:24:49
categories: 资料

---

- [图优化](http://www.cnblogs.com/gaoxiang12/p/5244828.html)
- [三维旋转](http://www.cnblogs.com/yiyezhai/p/3176725.html)
- [C++记录时间](https://blog.csdn.net/u013390476/article/details/50209603)
- [相机内外参解释](https://blog.csdn.net/u010128736/article/details/52850444)
- [shell echo字符串处理](https://www.cnblogs.com/gaochsh/p/6901809.html)
- [ubuntu 14.04 安装 ceres](http://www.ceres-solver.org/installation.html#linux)
- [Ubuntu 14.04 安装 ROS indigo](http://wiki.ros.org/cn/indigo/Installation/Ubuntu)
- [Ubuntu 14.04 安装 Cmake 3.9.x](https://blog.csdn.net/u010472607/article/details/76166008)
- [ubuntu 14.04 安装 Opencv 3.2.0](https://blog.csdn.net/youngpan1101/article/details/58027049)
- [VMware Ubuntu 无法全屏解决方案](https://blog.csdn.net/a874909657/article/details/79161533)
- [OpenCV重映射 & SURF特征点检测合辑](https://blog.csdn.net/poem_qianmo/article/details/30974513)
- [VS2010控制台程序运行一闪而过的完美解决办法](https://blog.csdn.net/xiaotanyu13/article/details/8210955)
- [OpenCV数据持久化: **FileStorage**类的数据存取操作与示例](https://blog.csdn.net/iracer/article/details/51339377)
- [fata error: LAPACKE_H_PATH-NOTFOUND when building OpenCV 3.2](http://answers.opencv.org/question/121651/fata-error-lapacke_h_path-notfound-when-building-opencv-32/)
- [E:Could not get lock /var/lib/apt/lists/lock - open (11: Resource temporarily unavailable)](https://blog.csdn.net/zyxlinux888/article/details/6358615)

<!--more-->
- Ubuntu下上Matlab运行时terminal会提示一堆错误：
```
libGL error: unable to load driver: vmwgfx_dri.so
libGL error: driver pointer missing
libGL error: failed to load driver: vmwgfx
libGL error: unable to load driver: swrast_dri.so
libGL error: failed to load driver: swrast
X Error of failed request:  BadValue (integer parameter out of range for operation)
  Major opcode of failed request:  155 (GLX)
  Minor opcode of failed request:  3 (X_GLXCreateContext)
  Value in failed request:  0x0
  Serial number of failed request:  31
  Current serial number in output stream:  34
```
    [解决方法](https://bbs.archlinux.org/viewtopic.php?id=154775)：
    ```
    sudo ln -sf /lib/libstdc++.so.6 /usr/local/MATLAB/R2015a/sys/os/glnxa64/libstdc++.so.6
    ```