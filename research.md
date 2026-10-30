---
title: "Research"
permalink: /research/
layout: single
author_profile: true
mathjax: true
toc: true
toc_sticky: true
toc_label: "本页目录"
---

我的研究可以用一句话概括：**用几何设计光**。给定一个空间度规，光沿测地线传播；反过来，想让光走一条指定的路径，就去设计那个度规——再把它翻译成可实现的折射率分布或曲面形状。

这页按三条线索整理：变换光学（语言）、测地线透镜（我毕业论文的具体对象）、量子光学（单光子层面的实验）。

## Transformation optics {#transformation-optics}

变换光学（Transformation Optics）的核心事实是：**Maxwell 方程组在坐标变换下形式不变**。对一个虚拟空间做坐标变换，其 Jacobian $\Lambda$ 会原封不动地出现在等效介质参数里：

$$\varepsilon' = \frac{\Lambda\,\varepsilon\,\Lambda^{T}}{\det\Lambda}, \qquad
  \mu' = \frac{\Lambda\,\mu\,\Lambda^{T}}{\det\Lambda}$$

于是"弯曲空间"变成"特殊材料"：设计光路的问题，变成设计 $\varepsilon(\mathbf{r})$、$\mu(\mathbf{r})$ 的问题。Pendry 等人在 2006 年用这个思路给出了隐形衣方案，同一时期 Leonhardt 从共形映射出发得到了二维版本。

**相关笔记**

- [隐形衣如何炼成：变换光学 60 年](/physics/2026/08/16/transformation-optics-60-years.html) —— 37 篇经典论文梳理出的主线（1961–2022）
- [变换光学基础：从 Fermat 原理到隐形衣](/physics/2026/03/01/transformation-optics-basics.html) —— 从光程变分到坐标变换的推导

**我关心的问题**：各向异性与色散参数如何在实际结构中实现；宽带化与损耗；以及变换介质与超表面设计之间的边界在哪里。

## Geodesic lenses {#geodesic-lenses}

旋转对称的渐变折射率（GRIN）介质，在满足度规等价条件时，可以严格等价为一块**旋转曲面上的测地线透镜**：

$$\rho = n(r)\,r, \qquad ds = n(r)\,dr, \qquad dz^{2} = ds^{2} - d\rho^{2}$$

光在曲面上的测地线，与它在原 GRIN 介质中的光线路径完全一致。于是三维的折射率设计问题，被降维成二维曲面的构造问题。

我的毕业论文研究 **Morse 透镜**这一族剖面。主要结果：

- 证明共形 Morse 透镜恰好是 Cornbleet 一般族的 $(A=B,\;C=1)$ 子类，从而把 Cornbleet–Rinous (1981) 与 Šarbort–Tyc (2012) 两条文献线索统一起来；
- 给出 Luneburg、Eaton 以及中间 Morse 透镜的等效曲面构造，并用射线追踪验证光线路径。

**相关笔记**

- [从 Fermat 原理到 Morse 透镜：我的毕业论文主线](/research/2026/08/15/morse-lens-thesis.html)

导师：Dr. Yap Seong Shan；副导师：Prof. Chen Huanyang（陈焕阳，Morse 透镜原始论文作者）。工具以 Python/NumPy 的射线追踪为主，Mathematica 用于符号推导与数值对照。

## Quantum optics {#quantum-optics}

在单光子层面，干涉不再能由"两束波叠加"直观解释：一次只有一个光子通过装置，条纹却依然逐点累积出来。这是波粒二象性最干净的实验表达，也是量子测量课程的起点。

**相关笔记**

- [量子光学实验笔记：单光子干涉](/lab%20notes/2026/03/08/single-photon-interference.html)

我关注的问题：单光子源与符合计数、路径信息与干涉可见度的取舍（量子擦除），以及探测器暗计数对结果的影响。

## 接下来 {#next}

- 把毕业论文的射线追踪代码整理成可复现的 notebook，附参数与收敛性检查；
- 继续整理变换光学文献库（目前 37 篇经典论文），做成可检索的索引；
- 在 Western 开展新的课题后，在这里更新研究方向。

如果你对其中任何一条线索感兴趣，欢迎[写信](mailto:helloworld.3a@gmail.com)讨论。
