---
title: "变换光学基础：从 Fermat 原理到隐形衣"
date: 2026-03-01
categories:
  - Physics
tags:
  - Transformation Optics
toc: true
---

变换光学（Transformation Optics）的核心思想：**光的路径由空间几何决定**。如果我们能"弯曲"空间的度量，就能任意控制光的传播。

## 1. Fermat 原理与折射率

光的传播遵循 Fermat 原理——光走**光程极值**的路径：

$$S = \int n(\mathbf{r}) \, ds$$

其中 $n(\mathbf{r})$ 是折射率分布，$ds$ 是路径微元。变换光学的目标就是设计 $n(\mathbf{r})$ 使得光沿我们想要的路径传播。

## 2. 坐标变换与等效介质

Pendry 等人的关键洞察（[Science 2006](https://www.science.org/doi/10.1126/science.1125907)）：对空间做坐标变换后，Maxwell 方程组形式不变，但介电常数和磁导率变为：

$$\varepsilon' = \frac{\Lambda \varepsilon \Lambda^T}{\det \Lambda}, \qquad \mu' = \frac{\Lambda \mu \Lambda^T}{\det \Lambda}$$

其中 $\Lambda$ 是变换的 Jacobian 矩阵。**几何变换 ↔ 材料参数**，这就是"变换光学"名字的由来。

## 3. 隐形衣（Invisibility Cloak）

最简单的隐形衣设计：把空间中的一个区域"压缩"成一个点。径向映射：

$$r' = a + \frac{b-a}{b} r$$

对应的径向介电常数和磁导率分量发散于内边界——这就是为什么理想隐形衣需要"奇异材料"。实际实现常用**超表面**或**共形映射**近似。

## 4. Geodesic Lens

我的研究兴趣之一：**测地线透镜**。把透镜设计成弯曲的表面，光沿表面测地线传播。折射率分布与表面几何的关系（Cornbleet）：

$$n(r) = \sqrt{1 + \left(\frac{r}{a}\right)^2}$$

这种设计完全避开奇异材料，可用 3D 打印实现——是变换光学走向实用化的路径之一。

## 5. 参考资源

- Pendry, Schurig & Smith, "Controlling Electromagnetic Fields", *Science* 312, 1780 (2006)
- Leonhardt, "Optical Conformal Mapping", *Science* 312, 1777 (2006)
- Cornbleet, *Microwave and Geometrical Optics* (Academic Press, 1994)
