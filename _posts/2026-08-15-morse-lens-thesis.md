---
title: "从 Fermat 原理到 Morse 透镜：我的毕业论文主线"
date: 2026-08-15
categories:
  - Research
tags:
  - Transformation Optics
  - Geodesic Lens
  - Morse Lens
  - Thesis
toc: true
---

> 本文是我毕业论文《Ray tracing and equivalent geodesic lenses for Morse lens》的核心主线整理。
> 导师：Dr. Yap Seong Shan；副导师：Prof. Chen Huanyang（陈焕阳，Morse 透镜原始论文作者）。

## 1. 问题：一个 GRIN 剖面能否"弯成"一个透镜？

任意球对称渐变折射率（GRIN）介质 $n(r)$，在合适条件下，都存在一个**等折射率旋转曲面**（测地线透镜），光在其上的传播与在原介质中完全一致。论文的核心问题：

> **给定 Morse 型 GRIN 剖面，如何构造它的等效测地线透镜？**

## 2. 方法主线：度规等价公理

从 Fermat 原理出发，定义三个度规等价关系：

$$\rho = nr, \qquad ds = n\,dr, \qquad dz^2 = ds^2 - d\rho^2$$

用链式法则可以推出一个**万能恒等式**：

$$s'(\rho)\,(n + rn') = n$$

这个恒等式连接了 GRIN 介质的折射率分布 $n(r)$ 与测地线透镜的曲面几何 $z(\rho)$——它是整条推导链的枢纽。

## 3. 核心结果：统一两条文献线索

论文证明了 **Cornbleet–Rinous（1981）反正弦分类** 与 **Šarbort–Tyc（2012）微分几何构造** 在数学上等价，并给出**修正的参数对应**：

$$A = B, \qquad C = 1, \qquad a = -\frac{1}{B}$$

由此，Cornbleet 的一般隐式折射率定律在 $(A=B,\ C=1)$ 条件下**无需额外系数匹配**即精确还原 Morse 剖面：

$$n^2(r) = 2r^{-2+1/B} - r^{-2+2/B} \;\Longleftrightarrow\; n^2(r) = 2r^{-(a+2)} - r^{-2a-2}$$

## 4. 两个极限情形的几何图景

| 参数 | 透镜 | 等效曲面行为 |
|------|------|--------------|
| $a = -2$，$B = 1/2$ | **Luneburg 透镜** | 光滑、闭合（拓扑为球）✅ |
| $a = -1$，$B = 1$ | **Eaton 透镜** | 原点处 $n \sim r^{-1/2}$ 使光学长度发散，曲面底部无法闭合（垂直切线开口）⚠️ |
| $-2 < a < -1$ | 中间 Morse 透镜 | 介于两者之间连续插值 |

## 5. 数值验证

基于测地线方程的射线追踪模拟确认：构造曲面上的光轨迹**精确复现**了 GRIN 介质中的聚焦（Luneburg）与回射（Eaton）图样。

## 6. 一点心得

这条主线的优雅之处在于：**一个折射率剖面是否"可被实现为闭合测地线透镜"，完全由曲面几何的闭合性决定**——物理问题变成了几何问题。感谢导师们的指导，特别是 Prof. Chen 作为 Morse 透镜原始工作（Chen & Xiao 2020）的作者，让我有机会在"巨人肩膀"上做延伸。

## 参考

- Cornbleet, *Microwave and Geometrical Optics* (Academic Press, 1994)
- Šarbort & Tyc, *J. Opt.* 14, 075103 (2012)
- Chen & Xiao, Morse 透镜原始工作 (2020)
- 论文全文：`PHY2109526_Zheng Xiangsheng_Thesis.pdf`
