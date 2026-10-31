---
layout: paper
title: "Ray tracing and equivalent geodesic lenses for the Morse lens"
description: "We construct the equivalent geodesic-lens representation of the Morse refractive-index profile, show that the conformal Morse lens is the (A = B, C = 1) subclass of Cornbleet's general family, and validate the construction by ray tracing."
pub_id: morse-lens
lang: en
mathjax: true
permalink: /papers/morse-lens/
index_terms: "Geodesic lenses; transformation optics; Morse potential; gradient-index optics; ray tracing."
references:
  - authors: "R. K. Luneburg"
    title: "Mathematical Theory of Optics"
    book: true
    publisher: "Brown Univ. Press"
    year: 1944
  - authors: "S. P. Morgan"
    title: "General solution of the Luneburg lens problem"
    journal: "J. Appl. Phys."
    volume: 29
    number: 9
    pages: "1358–1366"
    year: 1958
    doi: "10.1063/1.1723435"
  - authors: "S. Cornbleet"
    title: "Microwave and Geometrical Optics"
    book: true
    publisher: "Academic Press"
    year: 1994
  - authors: "M. Šarbort and T. Tyc"
    title: "Spherical media and geodesic lenses in geometrical optics"
    journal: "J. Opt."
    volume: 14
    number: 7
    pages: "075103"
    year: 2012
    doi: "10.1088/2040-8978/14/7/075103"
  - authors: "H. Chen"
    title: "The Morse lens"
    arxiv: "2002.03884"
    year: 2020
    url: "https://arxiv.org/abs/2002.03884"
  - authors: "J. B. Pendry, D. Schurig, and D. R. Smith"
    title: "Controlling electromagnetic fields"
    journal: "Science"
    volume: 312
    number: 5781
    pages: "1780–1782"
    year: 2006
    doi: "10.1126/science.1125907"
  - authors: "U. Leonhardt"
    title: "Optical conformal mapping"
    journal: "Science"
    volume: 312
    number: 5781
    pages: "1777–1780"
    year: 2006
    doi: "10.1126/science.1126493"
  - authors: "L. Xu and H. Chen"
    title: "Conformal transformation optics"
    journal: "Nat. Photonics"
    volume: 9
    number: 1
    pages: "15–23"
    year: 2015
    doi: "10.1038/nphoton.2014.274"
  - authors: "D. Schurig et al."
    title: "Metamaterial electromagnetic cloak at microwave frequencies"
    journal: "Science"
    volume: 314
    number: 5801
    pages: "977–980"
    year: 2006
    doi: "10.1126/science.1133628"
---

## I. Introduction

A gradient-index (GRIN) lens shapes a wavefront by making the refractive index a function of position. The classical examples — the Luneburg lens [1], [2], the Eaton lens, and the Maxwell fisheye — are spherically or cylindrically symmetric, and their ray paths can be obtained analytically. A different but equivalent route replaces the three-dimensional index distribution by a curved surface: if the surface metric is chosen correctly, rays in the medium and geodesics on the surface coincide. Lenses built this way are called geodesic lenses, and the equivalence is the basis of a body of work on microwave and geometrical optics [3], [4].

The Morse potential, familiar from molecular physics, was recently shown to generate a family of conformal lenses related to the Eaton and Luneburg solutions [5]. The Morse lens is attractive for two reasons. First, its refractive-index profile is a one-parameter deformation that contains the Luneburg and Eaton lenses as limiting cases. Second, being conformal, it requires an isotropic index rather than the anisotropic constitutive parameters of a general transformation-optics device [6], [7]. The material and experimental side of the wider programme is reviewed in [8] and [9].

What has been missing is a single, explicit account that (i) derives the surface construction from the metric-equivalence relations, (ii) locates the conformal Morse lens inside Cornbleet's general implicit family [3], and (iii) validates the construction numerically. This paper provides that account. The contributions are:

1. a compact derivation of the metric equivalence, including the master identity that links the index profile $n(r)$ to the surface profile $z(\rho)$;
2. a proof that the conformal Morse lens is the $(A=B,\,C=1)$ subclass of Cornbleet's family, with the corrected parameter correspondence $a=-1/B$;
3. the surface construction for the Luneburg, Eaton, and intermediate Morse profiles, together with a closure criterion;
4. a ray-tracing comparison between the original GRIN media and the reconstructed surfaces.

The paper is organized as follows. Section II derives the equivalence. Section III places the Morse profile in Cornbleet's family. Section IV constructs the surfaces and states the closure criterion. Section V reports the ray-tracing results. Section VI discusses limitations, and Section VII concludes.

## II. Metric Equivalence

### A. Fermat's principle

In a medium with refractive index $n(\mathbf{r})$, Fermat's principle states that the optical path

$$S=\int n(\mathbf{r})\,ds \tag{1}$$

is stationary along a ray, where $ds$ is the Euclidean arc length. For a spherically symmetric profile $n=n(r)$, the ray problem has two conserved quantities: the optical angular momentum $L=n(r)\,r^{2}\dot{\varphi}$ and the ray invariant $n\cos\psi$, with $\psi$ the angle between the ray and the radial direction.

### B. Surface of revolution

Consider a surface of revolution generated by $z=z(\rho)$, parameterized by $(\rho,\varphi)$. Its metric is

$$ds_{\Sigma}^{2}=\left[1+\left(\frac{dz}{d\rho}\right)^{2}\right]d\rho^{2}+\rho^{2}\,d\varphi^{2}. \tag{2}$$

We look for a mapping $\rho=\rho(r)$ such that the geodesics of (2) coincide with the rays of the GRIN medium. Equating the optical metric $n^{2}(r)\left(dr^{2}+r^{2}d\varphi^{2}\right)$ to (2) gives the three metric-equivalence relations

$$\rho=n(r)\,r,\qquad ds=n(r)\,dr,\qquad dz^{2}=ds^{2}-d\rho^{2}. \tag{3}$$

The first relation defines the projected radius; the second identifies the optical arc length with the arc length on the surface; the third fixes the height profile.

### C. The master identity

Differentiating $\rho=n r$ gives $d\rho/dr=n+r n'$, and therefore

$$s'(\rho)\,(n+r n')=n,\qquad s'(\rho)\equiv\frac{ds}{d\rho}, \tag{4}$$

which is the master identity of the construction. Once $s'(\rho)$ is known, the surface is obtained by quadrature:

$$z(\rho)=\int_{0}^{\rho}\sqrt{s'(\xi)^{2}-1}\;d\xi. \tag{5}$$

Equation (5) makes the geometry explicit: the existence of a real surface requires $s'(\rho)\ge 1$, and a closed lens requires the integral to remain finite up to the rim and the tangent to become vertical there.

## III. The Morse Profile in Cornbleet's Family

### A. Morse profile

The Morse-type profile considered here is

$$n^{2}(r)=2\,r^{-2+1/B}-r^{-2+2/B},\qquad 0<r\le 1, \tag{6}$$

with $B>0$ a shape parameter. For $B=1/2$ and $B=1$ the expression reduces to the Luneburg and Eaton profiles, respectively; intermediate values interpolate between them.

### B. Parameter correspondence

Cornbleet's implicit family is characterized by three parameters $(A,B,C)$, with $a$ a scale parameter of the underlying profile [3]. Matching (6) to the general family term by term gives

$$A=B,\qquad C=1,\qquad a=-\frac{1}{B}. \tag{7}$$

Equation (7) is the central structural result: the conformal Morse lens is not a new family but the $(A=B,\,C=1)$ slice of Cornbleet's family. The correspondence also explains the two limits. Substituting $B=1/2$ into (6),

$$n^{2}(r)=2-r^{2}, \tag{8a}$$

which is the Luneburg profile [1], [2]; substituting $B=1$ gives

$$n^{2}(r)=\frac{2}{r}-1, \tag{8b}$$

which is the Eaton profile. The Morse parameter therefore controls a continuous deformation between a focusing lens and a retroreflector.

<figure>
<img src="{{ '/assets/images/paper-fig1.png' | relative_url }}" alt="A geodesic on a surface of revolution">
<figcaption><strong>Fig. 1.</strong> A geodesic on a surface of revolution. The surface is the equivalent geometry of a radially symmetric GRIN profile; the highlighted curve is a geodesic, corresponding to a ray in the original medium. The plot is schematic: the profiles used in Section V are computed from (5) and (6).</figcaption>
</figure>

## IV. Surface Construction and Closure

### A. Integration

For a given $B$, (6) provides $n(r)$ on $0<r\le1$. The projected radius $\rho(r)=r n(r)$ is monotone on the interval of interest, so $r(\rho)$ can be inverted numerically. Equation (4) then gives $s'(\rho)$, and (5) is integrated with a cumulative trapezoidal rule on a fine grid.

### B. Closure criterion

The surface closes if and only if $z(\rho)$ remains finite as $\rho\to\rho_{\max}$ and $dz/d\rho\to\infty$ there. For the Luneburg case the reconstructed surface is a spherical cap: $\rho$ reaches the rim with a vertical tangent, and the lens is closed. For the Eaton case, $n\sim r^{-1/2}$ as $r\to0$, so the optical length diverges and the surface cannot close at the bottom; the profile opens into a vertical tangent. Intermediate Morse profiles inherit the behavior of the nearer limit. Table I summarizes the correspondence.

<table>
<caption>TABLE I. Parameter correspondence and surface behavior.</caption>
<thead>
<tr><th>Profile</th><th><em>B</em></th><th><em>a</em></th><th><em>n</em><sup>2</sup>(<em>r</em>)</th><th>Equivalent surface</th></tr>
</thead>
<tbody>
<tr><td>Luneburg</td><td>1/2</td><td>−2</td><td>2 − <em>r</em><sup>2</sup></td><td>Closed, spherical cap</td></tr>
<tr><td>Morse</td><td>(1/2, 1)</td><td>(−2, −1)</td><td>2<em>r</em><sup>−2+1/B</sup> − <em>r</em><sup>−2+2/B</sup></td><td>Interpolates between the limits</td></tr>
<tr><td>Eaton</td><td>1</td><td>−1</td><td>2/<em>r</em> − 1</td><td>Open at the origin; vertical tangent</td></tr>
</tbody>
</table>

## V. Ray-Tracing Validation

### A. Method

Two independent integrations are compared. In the GRIN medium, the ray equation

$$\frac{d}{ds}\left(n\frac{d\mathbf{r}}{ds}\right)=\nabla n \tag{9}$$

is integrated in polar coordinates with a fourth-order Runge–Kutta scheme and a fixed small step; convergence is checked by halving the step and comparing the exit point. On the surface, the geodesic equations for the metric (2) are integrated with the same scheme. The initial conditions are matched through (3). Because both problems are integrable up to quadrature, the comparison tests the construction rather than the integrator.

### B. Scenarios

Three scenarios are considered, all with rays launched parallel to the optical axis at different impact parameters: the Luneburg profile, an intermediate Morse profile, and the Eaton profile. The expected behavior follows from the ray invariant. The Luneburg lens focuses a parallel bundle at the rear pole; the Eaton lens reverses each ray; the intermediate Morse lens focuses between the rim and the rear pole. Table II records the outcome of the numerical experiment.

<table>
<caption>TABLE II. Ray-tracing scenarios and observed behavior.</caption>
<thead>
<tr><th>Profile</th><th>Initial rays</th><th>Expected</th><th>Observed</th></tr>
</thead>
<tbody>
<tr><td>Luneburg</td><td>Parallel to axis</td><td>Focus at rear pole</td><td>Focus recovered</td></tr>
<tr><td>Morse, intermediate</td><td>Parallel to axis</td><td>Focus between rim and pole</td><td>Intermediate focus recovered</td></tr>
<tr><td>Eaton</td><td>Parallel to axis</td><td>Retroreflection</td><td>Direction reversed</td></tr>
</tbody>
</table>

In all three cases the surface trajectories reproduce the topology of the GRIN ray paths: a single focus for the Luneburg lens, an intermediate focus for the Morse lens, and a reversal for the Eaton lens. The comparison is qualitative in the sense that no experimental uncertainty is involved; the residual difference between the two integrations is at the level of the discretization error of the Runge–Kutta step.

## VI. Discussion

The construction separates two questions that are often conflated in transformation optics: whether an equivalent geometry exists, and whether the required medium can be built. The metric equivalence answers the first question. The closure criterion answers the second in the geometric-optics sense: a profile admits a closed geodesic lens exactly when its reconstructed surface closes. The Eaton limit shows that this is not automatic — the divergence of the index at the origin is a geometric obstruction, not a fabrication problem.

Three limitations should be stated. First, the treatment is scalar and geometric: polarization, Fresnel coefficients, and wave effects are outside its scope. Second, the construction assumes exact rotational symmetry; a fabricated surface will have finite tolerance, and the sensitivity of the focus to surface error is a separate study. Third, the ray tracing validates the geometry, not a particular realization. A natural next step is to pattern the surface as a dielectric metasurface and to compare the full-wave response with the geodesic prediction.

## VII. Conclusion

The conformal Morse lens is the $(A=B,\,C=1)$ subclass of Cornbleet's general family, with the parameter correspondence $a=-1/B$. The metric-equivalence relations reduce the design of the lens to a single quadrature, and the resulting surfaces reproduce the focusing and retroreflection of the Luneburg and Eaton limits. The closure criterion turns the question of realizability into a property of the surface, which is the main conceptual gain of the geodesic-lens formulation.
