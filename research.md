---
title: "Research"
permalink: /research/
layout: page
kicker: "Research"
lead: "How geometry shapes light — the three threads behind my thesis and current work."
mathjax: true
toc: true
lang: en
ref: research
---

My research can be summed up in one sentence: **designing light with geometry**. Given a metric, light travels along geodesics; conversely, to make light follow a chosen path, design the metric — then translate it into a realizable refractive-index profile or surface.

This page follows three threads: transformation optics (the language), geodesic lenses (the object of my thesis), and quantum optics (experiments at the single-photon level).

## Transformation optics {#transformation-optics}

The central fact of transformation optics is that **Maxwell's equations are form-invariant under coordinate transformations**. Transform a virtual space, and its Jacobian $\Lambda$ appears verbatim in the effective medium parameters:

$$\varepsilon' = \frac{\Lambda\,\varepsilon\,\Lambda^{T}}{\det\Lambda}, \qquad
  \mu' = \frac{\Lambda\,\mu\,\Lambda^{T}}{\det\Lambda}$$

"Curved space" thus becomes "special material": the problem of designing a light path becomes the problem of designing $\varepsilon(\mathbf{r})$ and $\mu(\mathbf{r})$. Pendry and co-workers used this idea to propose the invisibility cloak in 2006; Leonhardt reached the two-dimensional version through conformal mapping at the same time.

**Open questions**: how to realize anisotropic and dispersive parameters in real structures; bandwidth and loss; where transformation media end and metasurface design begins.

## Geodesic lenses {#geodesic-lenses}

A spherically symmetric gradient-index (GRIN) medium is, under the metric-equivalence condition, exactly equivalent to a **geodesic lens on a surface of revolution**:

$$\rho = n(r)\,r, \qquad ds = n(r)\,dr, \qquad dz^{2} = ds^{2} - d\rho^{2}$$

Geodesics on the surface coincide with the rays in the original GRIN medium. A three-dimensional index-design problem is thus reduced to a two-dimensional surface-construction problem.

My thesis studies the **Morse lens** family. Main results:

- A proof that conformal Morse lenses are exactly the $(A=B,\;C=1)$ subclass of Cornbleet's general family, unifying the Cornbleet–Rinous (1981) and Šarbort–Tyc (2012) lines of work;
- Equivalent surface constructions for the Luneburg, Eaton and intermediate Morse profiles, verified by ray tracing.

**Full paper**

- [Ray tracing and equivalent geodesic lenses for the Morse lens](/papers/morse-lens/) — thesis paper with the derivation, parameter correspondence and ray-tracing validation

Advisors: Dr. Yap Seong Shan; co-advisor Prof. Huanyang Chen, author of the original Morse-lens paper. The workflow is mostly ray tracing in Python/NumPy, with Mathematica for symbolic derivations and numerical cross-checks.

## Quantum optics {#quantum-optics}

At the single-photon level, interference can no longer be read as two waves overlapping: one photon passes through the apparatus at a time, yet the fringes still build up point by point. It is the cleanest expression of wave–particle duality, and the starting point of quantum measurement.

Questions I am interested in: single-photon sources and coincidence counting; the trade-off between path information and interference visibility (quantum erasure); and the effect of detector dark counts on the result.

## What's next {#next}

- Turn the thesis ray tracer into a reproducible notebook with parameters and convergence checks;
- Update this page once the project at Western takes shape.

If any of these threads interests you, feel free to [write](mailto:helloworld.3a@gmail.com).
