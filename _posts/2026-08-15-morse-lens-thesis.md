---
title: "From Fermat's principle to the Morse lens: the thread of my thesis"
date: 2026-08-15
categories:
  - Research
tags:
  - Geodesic Lens
toc: true
lang: en
ref: morse-lens-thesis
---

> This post reorganizes the main thread of my thesis, *Ray tracing and equivalent geodesic lenses for Morse lens*.
> Advisor: Dr. Yap Seong Shan; co-advisor: Prof. Huanyang Chen, author of the original Morse-lens paper.

## 1. The question: can a GRIN profile be "bent" into a lens?

For any spherically symmetric gradient-index (GRIN) medium $n(r)$, under suitable conditions there exists an **equi-index surface of revolution** (a geodesic lens) on which light propagates exactly as it does in the original medium. The thesis question:

> **Given a Morse-type GRIN profile, how do we construct its equivalent geodesic lens?**

## 2. Method: the metric-equivalence axioms

Starting from Fermat's principle, define three metric relations:

$$\rho = nr, \qquad ds = n\,dr, \qquad dz^2 = ds^2 - d\rho^2$$

The chain rule then yields a **master identity**:

$$s'(\rho)\,(n + rn') = n$$

This identity links the GRIN profile $n(r)$ to the surface geometry $z(\rho)$ — the hinge of the whole derivation.

## 3. Main result: unifying two lines of work

The thesis proves that the **Cornbleet–Rinous (1981) arcsine classification** and the **Šarbort–Tyc (2012) differential-geometry construction** are mathematically equivalent, and gives the corrected parameter correspondence:

$$A = B, \qquad C = 1, \qquad a = -\frac{1}{B}$$

With these values, Cornbleet's general implicit index law reduces exactly to the Morse profile **without any extra coefficient matching**:

$$n^2(r) = 2r^{-2+1/B} - r^{-2+2/B} \;\Longleftrightarrow\; n^2(r) = 2r^{-(a+2)} - r^{-2a-2}$$

## 4. Two limiting geometries

| Parameters | Lens | Behavior of the equivalent surface |
|------------|------|-------------------------------------|
| $a = -2$, $B = 1/2$ | **Luneburg lens** | smooth and closed (topology of a sphere) ✅ |
| $a = -1$, $B = 1$ | **Eaton lens** | $n \sim r^{-1/2}$ at the origin makes the optical length diverge; the surface cannot close at the bottom (vertical tangent) ⚠️ |
| $-2 < a < -1$ | intermediate Morse lens | continuous interpolation between the two |

## 5. Numerical check

Ray tracing based on the geodesic equations confirms that the constructed surfaces **reproduce exactly** the focusing (Luneburg) and retroreflection (Eaton) patterns of the GRIN media.

## 6. A note

The elegance of this thread is that **whether a profile can be realized as a closed geodesic lens is decided entirely by the closure of the surface geometry** — a physics problem becomes a geometry problem. Thanks to my advisors, especially Prof. Chen, an author of the original Morse-lens work (Chen & Xiao 2020), for the chance to build on that foundation.

## References

- Cornbleet, *Microwave and Geometrical Optics* (Academic Press, 1994)
- Šarbort & Tyc, *J. Opt.* 14, 075103 (2012)
- Chen & Xiao, original Morse-lens work (2020)
- Full thesis: `PHY2109526_Zheng Xiangsheng_Thesis.pdf`
