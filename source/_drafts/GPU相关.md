---
title: Memory Transfer Overhead
tags:
  - GPU
  - CUDA
  - cudaMemcpy
  - pinned memory
abbrlink: 39758
date: 2017-04-11 13:47:21
---


Before executing a kernel on the GPU, all of the data used by kernel needs to be transferred from the CPU memory to the GPU memory. After execution, the data produced by the kernel most likely needs to be transferred back to the CPU memory. The function most commonly used to accomplish this memory transferring is cudaMemcpy.

<!-- more -->


Figure 1 shows the average transfer time using  cudaMemcpy across a wide range of transfer sizes. All data was collected on Barracuda10, which has the following hardware setup: 3.20 GHz Core 2 Extreme processor, GTX 280 GPU, and PCIe version 2.0. Four different configurations were measured; they are differentiated by whether they measure transfers to or from the GPU memory and whether they use pinned or non-pinned memory. Pinned memory is memory allocated using the cudaMallocHost function, which prevents the memory by being swapped out and provides improved transfer speeds. Non-pinned memory is memory allocated using the malloc function. See Memory Management Overhead for details on the performance difference between cudaMallocHost and malloc. 

For small transfer sizes, there is a constant overhead of about 10 microseconds. At around 8 KB, the transfer time starts to increase linearly and the the performance advantage of pinned memory becomes more significant. For pinned memory, the direction of transfer (to or from GPU memory) has no noticeable impact on the transfer time. For non-pinned memory, the direction of transfer has no noticeable impact for transfer sizes larger than 10 MB. 

![img](http://www.cs.virginia.edu/~mwb7w/cuda_support/images/transfer_time.png) 
**Figure 1: Time per memory transfer as a function of transfer size. Note the logarithmic scales.**

Figure 2 shows the average transfer throughput across the same range of transfer sizes. For small transfer sizes, there is little difference between the various configurations. Above about 16 KB, there is a significant difference between pinned and non-pinned memory. At the largest transfer sizes, pinned memory provides approximately 2.4x higher throughput than non-pinned memory. 

![img](http://www.cs.virginia.edu/~mwb7w/cuda_support/images/transfer_throughput.png) 
**Figure 2: Transfer throughput as a function of transfer size. Note the logarithmic scales.**

【转载-[原网址](http://www.cs.virginia.edu/~mwb7w/cuda_support/memory_transfer_overhead.html)】