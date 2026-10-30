---
title: "Transformation optics: from Fermat's principle to the invisibility cloak"
date: 2026-03-01
categories:
  - Physics
tags:
  - Transformation Optics
toc: true
lang: en
ref: transformation-optics-basics
---

The central idea of transformation optics: **the path of light is determined by the geometry of space**. If we can "bend" the metric of space, we can control the propagation of light at will.

## 1. Fermat's principle and the refractive index

Light follows Fermat's principle — it takes the path of **stationary optical path length**:

$$S = \int n(\mathbf{r}) \, ds$$

where $n(\mathbf{r})$ is the refractive-index distribution and $ds$ a path element. The goal of transformation optics is to design $n(\mathbf{r})$ so that light follows a path we choose.

## 2. Coordinate transformations and effective media

The key insight of Pendry et al. ([Science 2006](https://www.science.org/doi/10.1126/science.1125907)): after a coordinate transformation of space, Maxwell's equations keep their form, but the permittivity and permeability become

$$\varepsilon' = \frac{\Lambda \varepsilon \Lambda^T}{\det \Lambda}, \qquad \mu' = \frac{\Lambda \mu \Lambda^T}{\det \Lambda}$$

where $\Lambda$ is the Jacobian of the transformation. **Geometric transformation ↔ material parameters** — that is where the name comes from.

## 3. The invisibility cloak

The simplest cloak: "compress" a region of space into a point. The radial mapping is

$$r' = a + \frac{b-a}{b} r$$

The radial components of $\varepsilon$ and $\mu$ diverge at the inner boundary — which is why an ideal cloak needs "singular materials". Practical implementations approximate it with **metasurfaces** or **conformal mapping**.

## 4. Geodesic lens

One of my research interests: **geodesic lenses**. Design the lens as a curved surface, and light follows geodesics on it. The relation between the index profile and the surface geometry (Cornbleet) is

$$n(r) = \sqrt{1 + \left(\frac{r}{a}\right)^2}$$

This design avoids singular materials entirely and can be 3D-printed — one route toward practical transformation optics.

## 5. References

- Pendry, Schurig & Smith, "Controlling Electromagnetic Fields", *Science* 312, 1780 (2006)
- Leonhardt, "Optical Conformal Mapping", *Science* 312, 1777 (2006)
- Cornbleet, *Microwave and Geometrical Optics* (Academic Press, 1994)
