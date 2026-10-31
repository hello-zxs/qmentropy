---
layout: paper
title: "Sixty years of transformation optics: From Dolin’s conjecture to experimental cloaks"
description: "A review of the transformation-optics programme: the invariance of Maxwell’s equations under coordinate transformations, the two cloaking routes of 2006, the metamaterial turn, and the experimental state of the art."
pub_id: transformation-optics-review
lang: en
mathjax: true
permalink: /papers/transformation-optics-review/
index_terms: "Transformation optics; metamaterials; invisibility cloaking; conformal mapping; effective media."
references:
  - authors: "L. S. Dolin"
    title: "To the possibility of comparison of three-dimensional electromagnetic systems with nonuniform anisotropic filling"
    journal: "Izv. Vyssh. Uchebn. Zaved. Radiofiz."
    volume: 4
    number: 5
    pages: "964–967"
    year: 1961
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
  - authors: "D. Schurig et al."
    title: "Metamaterial electromagnetic cloak at microwave frequencies"
    journal: "Science"
    volume: 314
    number: 5801
    pages: "977–980"
    year: 2006
    doi: "10.1126/science.1133628"
  - authors: "Z. Liu et al."
    title: "Locally resonant sonic materials"
    journal: "Science"
    volume: 289
    number: 5485
    pages: "1734–1736"
    year: 2000
    doi: "10.1126/science.289.5485.1734"
  - authors: "J. B. Pendry"
    title: "Negative refraction makes a perfect lens"
    journal: "Phys. Rev. Lett."
    volume: 85
    number: 18
    pages: "3966–3969"
    year: 2000
    doi: "10.1103/PhysRevLett.85.3966"
  - authors: "W. Cai, U. K. Chettiar, A. V. Kildishev, and V. M. Shalaev"
    title: "Optical cloaking with metamaterials"
    journal: "Nat. Photonics"
    volume: 1
    number: 4
    pages: "224–227"
    year: 2007
    doi: "10.1038/nphoton.2007.28"
  - authors: "J. Valentine, S. Li, T. Zentgraf, G. Bartal, and X. Zhang"
    title: "An optical cloak made of dielectrics"
    journal: "Nat. Mater."
    volume: 8
    number: 7
    pages: "568–571"
    year: 2009
    doi: "10.1038/nmat2461"
  - authors: "H. Chen, C. T. Chan, and P. Sheng"
    title: "Transformation optics and metamaterials"
    journal: "Nat. Mater."
    volume: 9
    number: 5
    pages: "387–396"
    year: 2010
    doi: "10.1038/nmat2743"
  - authors: "L. Xu and H. Chen"
    title: "Conformal transformation optics"
    journal: "Nat. Photonics"
    volume: 9
    number: 1
    pages: "15–23"
    year: 2015
    doi: "10.1038/nphoton.2014.274"
  - authors: "K.-P. Ye, W.-J. Pei, Z.-H. Sa, H. Chen, and R.-X. Wu"
    title: "Invisible gateway by superscattering effect of metamaterials"
    journal: "Phys. Rev. Lett."
    volume: 126
    number: 22
    pages: "227403"
    year: 2021
    doi: "10.1103/PhysRevLett.126.227403"
  - authors: "H. Chen"
    title: "The Morse lens"
    arxiv: "2002.03884"
    year: 2020
    url: "https://arxiv.org/abs/2002.03884"
---

## I. Introduction

Transformation optics is the observation that Maxwell's equations are form-invariant under coordinate transformations, and that a transformation of space can therefore be traded for a transformation of the constitutive parameters of a medium [1]–[3]. The idea is old — Dolin formulated a precursor in 1961 [1] — but it became a research programme only when metamaterials made the required anisotropic, sometimes negative, parameters plausible [4]–[6].

This review has two purposes. The first is to separate the mathematics from the materials. The invariance of Maxwell's equations is exact and, in itself, uncontroversial; the difficulty lies in realizing the effective medium that a given transformation demands. The second is to give a compact account of the experimental trajectory: from the microwave cloak of 2006 [4] to optical-frequency demonstrations [7], [8] and, more recently, to illusion devices such as the invisible gateway [11].

The review is organized chronologically and conceptually. Section II states the invariance result. Section III gives a timeline. Section IV contrasts the coordinate-transformation and conformal-mapping routes. Section V discusses materials and experiments. Section VI lists open problems, and Section VII concludes.

## II. Form Invariance and Effective Media

Consider a coordinate transformation $x^{\mu}\to x'^{\mu}(x)$ with Jacobian

$$\Lambda^{\mu}{}_{\nu}=\frac{\partial x'^{\mu}}{\partial x^{\nu}}. \tag{1}$$

Maxwell's equations retain their form in the new coordinates provided the constitutive parameters are redefined as

$$\varepsilon'=\frac{\Lambda\,\varepsilon\,\Lambda^{T}}{\det\Lambda},\qquad
  \mu'=\frac{\Lambda\,\mu\,\Lambda^{T}}{\det\Lambda}. \tag{2}$$

Equation (2) is the mathematical core of the field. It says that a region of space can be made to behave as though it had been stretched, compressed, or bent, at the price of an inhomogeneous and generally anisotropic medium. Two consequences follow immediately. First, the transformation is exact in the geometric-optics limit and, with the full constitutive parameters, in the wave equation as well. Second, the medium is typically anisotropic: the eigenvalues of $\varepsilon'$ and $\mu'$ differ, and either can be negative in some region.

<figure>
<img src="{{ '/assets/images/paper-fig2.png' | relative_url }}" alt="A regular grid and the same grid after a radial coordinate transformation">
<figcaption><strong>Fig. 1.</strong> A coordinate grid before (a) and after (b) a radial transformation. In transformation optics the distortion of the grid is not a drawing convention: it is encoded in the constitutive parameters through (2), and light follows the transformed coordinates.</figcaption>
</figure>

## III. A Timeline

The development of the field can be read as a sequence of attempts to make (2) physically realizable. Table I lists the milestones that, in the author's reading, define the main line.

<table>
<caption>TABLE I. Main-line milestones of transformation optics.</caption>
<thead>
<tr><th>Year</th><th>Development</th><th>Ref.</th></tr>
</thead>
<tbody>
<tr><td>1961</td><td>Dolin formulates the coordinate-transformation precursor</td><td>[1]</td></tr>
<tr><td>2000</td><td>Locally resonant acoustic metamaterials; negative refraction and the perfect lens</td><td>[5], [6]</td></tr>
<tr><td>2006</td><td>Coordinate-transformation cloak (Pendry <em>et al.</em>) and conformal cloak (Leonhardt)</td><td>[2], [3]</td></tr>
<tr><td>2006</td><td>Microwave cloak demonstrated experimentally</td><td>[4]</td></tr>
<tr><td>2007</td><td>Optical-frequency cloak design with metamaterials</td><td>[7]</td></tr>
<tr><td>2009</td><td>Dielectric optical carpet cloak</td><td>[8]</td></tr>
<tr><td>2010</td><td>Review of transformation optics and metamaterials</td><td>[9]</td></tr>
<tr><td>2015</td><td>Conformal transformation optics systematized</td><td>[10]</td></tr>
<tr><td>2021</td><td>Invisible gateway demonstrated at microwave frequencies</td><td>[11]</td></tr>
</tbody>
</table>

The table makes the central asymmetry of the field visible. The mathematical result of 1961 waited four decades for a materials platform; once metamaterials arrived, the gap between proposal and experiment closed within a year for microwaves [4], but took longer at optical frequencies [7], [8].

## IV. Two Routes of 2006

### A. Coordinate transformation

Pendry, Schurig, and Smith [2] chose a transformation that compresses a spherical region into a shell. The resulting parameters are anisotropic and diverge on the inner boundary, which is why an ideal cloak requires a singular medium. The appeal of the route is its generality: any desired ray pattern can, in principle, be encoded in a coordinate map. The cost is the anisotropy.

### B. Conformal mapping

Leonhardt [3] restricted attention to two-dimensional conformal maps. In that case the transformed medium is isotropic,

$$n'=n\left|\frac{dw}{dz}\right|, \tag{3}$$

so the cloak can be built from a gradient-index dielectric rather than an anisotropic metamaterial. The restriction to two dimensions is the price. The two routes were later unified under the heading of conformal transformation optics [10], and the trade-off between generality and realizability remains the field's organizing tension. The same conformal logic has recently been used to construct the Morse lens and its relatives [12].

## V. Materials and Experiments

The first experimental cloak operated at microwave frequencies and used split-ring resonators and wire media to synthesize the required anisotropy [4]. At optical frequencies the same strategy is hampered by absorption and by the difficulty of fabricating three-dimensional anisotropic structures at the relevant scale. Two responses are visible in the literature. The first is to reduce the dimensionality of the problem: the carpet cloak [8] hides an object under a reflective surface and requires only a modest, non-singular index modulation, which can be implemented in a dielectric. The second is to accept a restricted functionality — an illusion device, a superscatterer, or a gateway — for which the material demands are weaker than those of a full cloak. The invisible gateway of Ye <em>et al.</em> [11] is a good example: the device stops waves in an air channel wider than the cutoff of the corresponding waveguide, and the experiment confirmed that the effect originates from the excitation of surface plasmons.

Two material lessons recur. First, loss and dispersion are not incidental: a passive, broadband cloak is constrained by the Kramers–Kronig relations, and the bandwidth of a resonant metamaterial cloak is narrow. Second, the anisotropy that makes (2) general is also what makes fabrication hard; the most successful experiments are those that trade generality for isotropy or for reduced dimensionality [8], [10].

## VI. Open Problems

Four problems seem to define the current frontier. <em>Broadband operation</em>: most demonstrations are narrowband, and a passive cloak that works over a octave remains out of reach. <em>Three-dimensional isotropic media</em>: conformal maps are inherently two-dimensional, and a genuine three-dimensional isotropic cloak would require a material with a non-trivial index profile at the required resolution. <em>Loss and gain</em>: transformation media with singular parameters necessarily involve regions of extreme index, where absorption is unavoidable; whether gain can compensate without instability is an open question. <em>Wave versus geometric optics</em>: the ray picture that motivates (2) is only the short-wavelength limit, and the full-wave response of a fabricated device can differ substantially from the geometric prediction.

## VII. Conclusion

Transformation optics is best understood as a bridge between a mathematical invariance and a materials problem. The invariance is exact and was known, in essence, by 1961; the materials problem is what turned it into a field. The two 2006 routes — general but anisotropic, and restricted but isotropic — still frame the subject, and the experimental record shows that progress has come from choosing the transformation to fit the available material rather than the other way round.

## Acknowledgment

The author thanks Prof. Huanyang Chen for discussions on conformal lenses and the Morse lens, and Dr. Yap Seong Shan for supervision of the thesis work that motivated this review.
