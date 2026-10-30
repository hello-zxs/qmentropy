---
title: "Lab notes: single-photon interference"
date: 2026-03-08
categories:
  - Lab Notes
tags:
  - Quantum Optics
toc: true
lang: en
ref: single-photon-interference
---

This week's experiment: verify **single-photon interference** — fringes persist even when photons pass through the apparatus one at a time. It is the most direct experimental evidence for wave–particle duality.

## 1. Setup

```
single-photon source ──► BS1 ──► path A ─┐
                        └──► path B ─────┼──► BS2 ──► detectors D1/D2
                                          └──────────┘
```

Key point: the source (an attenuated laser, or SPDC) guarantees at most one photon in the apparatus at any time.

## 2. Theory

After the two beam splitters, the probability of detecting the photon at $D_1$ is

$$P_1 = \frac{1}{2}(1 + \cos\phi)$$

where $\phi$ is the phase difference between the two paths. At $\phi = 0$, $P_1 = 1$ (destructive interference, no counts at $D_2$); at $\phi = \pi$, the reverse.

## 3. Observations

- In single-photon mode, the $D_1$ count rate oscillates as a cosine in $\phi$ ✅
- Blocking one path removes the interference; $P_1 = 1/2$ stays constant ✅
- This shows that **interference is not an interaction between photons, but the superposition of a single photon's own probability amplitude**

## 4. Questions for myself

1. If a which-way detector is placed before BS2, do the fringes survive?
2. No — **the measurement collapses the amplitude**. That is the starting point of the quantum eraser.

## 5. To do

- [ ] Reproduce the quantum eraser (delayed-choice version)
- [ ] Organize the coincidence data from the SPDC source
- [ ] Write a lab-report template (Markdown → PDF)
