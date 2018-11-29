---
abbrlink: '0'
---

祭出这几本书&博客。

- [slambook](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/slam/slambook14.pdf)
- [slambook code](https://github.com/gaoxiang12/slambook/tree/master/project/0.3)
- [OpenCV3.0](https://qcloud.coding.net/u/vincentqin/p/blogResource/git/raw/master/slam/OpenCV3book.pdf)
- [SLAM前世今生](https://blog.csdn.net/OnafioO/article/details/73175835)
- [深入理解图优化与g2o：g2o篇](https://www.cnblogs.com/gaoxiang12/p/5304272.html)
- [深入理解图优化与g2o：g2o篇 code](https://github.com/RainerKuemmerle/g2o )
- [白巧克力亦唯心的博客](https://me.csdn.net/heyijia0327)


## g2o

### BlockSolver，块求解器

块求解器是包含线性求解器的存在，之所以是包含，是因为块求解器会构建好线性求解器所需要的矩阵块（也就是H和b），之后给线性求解器让它进行运算，边的jacobian也就是在这个时候发挥了自己的光和热。

这里再记录下一个比较容易混淆的问题，也就是在初始化块求解器的时候的参数问题。大部分的例程在初始化块求解器的时候都会使用如下的程序代码：
``` c
std::unique_ptr<g2o::BlockSolver_6_3::LinearSolverType> linearSolver = g2o::make_unique<g2o::LinearSolverCholmod<g2o::BlockSolver_6_3::PoseMatrixType>>();  
```
其中的BlockSolver_6_3有两个参数，分别是6和3，在定义的时候可以看到这是一个模板的重命名（模板类的重命名只能用using）
``` c
template<int p, int l>  
using BlockSolverPL = BlockSolver< BlockSolverTraits<p, l> >;  
```
其中p代表pose的维度，l表示landmark的维度，且这里都表示的是增量的维度。


## g2o的顶点（Vertex）

- `g2o::BaseVertex< D, T >` 其中 `int D, typename T`

首先记录一下定义模板的两个参数D和T，两个类型分别是int和typename的类型，D表示的是维度，g2o源码里面是这个注释的:

```c
static const int Dimension = D; //< dimension of the estimate (minimal) in the manifold space
```

可以看到这个D并非是顶点（更确切的说是状态变量）的维度，而是其在流形空间（manifold）的最小表示，这里一定要区别开；之后是T，源码里面也给出了T的作用:

``` c
typedef T EstimateType;
EstimateType _estimate;
```

可以看到，这里T就是顶点（状态变量）的类型。在顶点的继承中，这两个参数是直接面向我们的，所以务必要定义妥当。

## g2o的边（Edge）

- g2o::BaseBinaryEdge< D, E, VertexXi, VertexXj > 其中 int D, typename E

首先还是介绍这两个参数，还是从源码上来看：

```c
static const int Dimension = D;
typedef E Measurement;
typedef Eigen::Matrix<number_t, D, 1, Eigen::ColMajor> ErrorVector;
```
可以看到，D决定了误差的维度，从映射的角度讲，三维情况下就是2维的，二维的情况下是1维的；然后E是measurement的类型，也就是测量值是什么类型的，这里E就是什么类型的（一般都是Eigen::VectorN表示的，N是自然数）。

- typename VertexXi, typename VertexXj

这两个参数就是边连接的两个顶点的类型，这里特别注意一下，这两个必须一定是顶点的类型，也就是继承自`BaseVertex`等基础类的类！不是顶点的数据类！例如必须是`VertexSE3Expmap`而不是`VertexSE3Expmap`的数据类型类`SE3Quat`。原因的话源码里面也很清楚，因为后面会用到一系列顶点的维度等等的属性，这些属性是数据类型类里面没有的。

- _jacobianOplusXi，_jacobianOplusXj

这两个变量本质上是Eigen::Matrix类型的，具体定义在这里：
```c
typedef typename Eigen::Matrix<number_t, D, Di, D==1?Eigen::RowMajor:Eigen::ColMajor>::AlignedMapType JacobianXiOplusType;
typedef typename Eigen::Matrix<number_t, D, Dj, D==1?Eigen::RowMajor:Eigen::ColMajor>::AlignedMapType JacobianXjOplusType;
JacobianXiOplusType _jacobianOplusXi;
JacobianXjOplusType _jacobianOplusXj;
```
`_jacobianOplusXi`和`_jacobianOplusXj`就是所谓的雅可比矩阵，如果是二元边的话二者都有；若为一元边，只有`_jacobianOplusXi`。



