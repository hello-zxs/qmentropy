// Run with Node 22+ from any directory: node tools/check-morse.mjs
import { parallelBeam } from "../assets/js/morse-beam.js";
import assert from "node:assert/strict";
import {
  orbit,
  surface,
  inversePower,
  meridianModel,
} from "../assets/js/morse-model.js";

// Integrate H=(p.p-n²)/2=0 in Cartesian coordinates with R=N=1.
// Use azimuth as independent variable: dphi/dtau=L/r².
function cartesianRay(B, b, energy, steps = 2400) {
  const ray = orbit(B, b, energy),
    k = 1 / B,
    L = b * Math.sqrt(1 + energy);
  // Compare the same resolved integration interval across near-critical cases.
  const angle = Math.sign(b) * Math.min(4 * Math.PI, ray.angle),
    dphi = angle / steps;
  let state = [1, 0, -Math.sqrt(1 + energy - L * L), L],
    maxError = 0;
  function rhs([x, y, px, py]) {
    const r2 = x * x + y * y,
      u = r2 ** (k / 2);
    const n2 = (energy + 2 * u - u * u) / r2;
    const force = ((k * u * (1 - u)) / r2 - n2) / r2;
    const scale = r2 / L;
    return [scale * px, scale * py, scale * force * x, scale * force * y];
  }
  const advance = (s, v, h) => s.map((val, j) => val + h * v[j]);
  for (let i = 1; i <= steps; i++) {
    const a = rhs(state),
      c = rhs(advance(state, a, dphi / 2));
    const d = rhs(advance(state, c, dphi / 2)),
      f = rhs(advance(state, d, dphi));
    state = state.map(
      (v, j) => v + (dphi * (a[j] + 2 * c[j] + 2 * d[j] + f[j])) / 6,
    );
    const ref = ray.at(((i / steps) * Math.abs(angle)) / ray.angle);
    maxError = Math.max(
      maxError,
      Math.hypot(
        state[0] - ref.r * Math.cos(ref.phi),
        state[1] - ref.r * Math.sin(ref.phi),
      ),
    );
  }
  return maxError;
}
let worstRay = 0,
  worstMetric = 0;
for (const [B, b, energy] of [
  [0.5, 0.55, 0],
  [1, 0.24, 0],
  [0.3, 0.35, 0],
  [1.45, -0.7, 0],
  [0.7, 0.75, -0.35],
  [0.7, 0.3, 0.5],
  [0.8, 0.6, 0.5625],
  [0.8, 0.6, 0.5625 + 1e-7],
  [0.8, 0.6, 0.5625 - 1e-7],
]) {
  const error = cartesianRay(B, b, energy);
  assert.ok(error < 2e-7, JSON.stringify({ B, b, energy, error }));
  worstRay = Math.max(worstRay, error);
}
for (const B of [0.5, 0.75, 1, 1.6]) {
  for (const b of [0.1, 0.4, 0.7, 0.95]) {
    const ray = orbit(B, b, 0),
      end = ray.at(1);
    assert.ok(Math.abs(ray.sweep - B * (Math.PI + 2 * Math.acos(b))) < 1e-12);
    assert.ok(Math.abs(end.r - 1) < 1e-12);
    // Rotate each launch point so its incident direction is +x (upper rays
    // have negative angular momentum). Compare exit positions/directions.
    const entryPhi = Math.PI - Math.asin(b),
      exitPhi = entryPhi - ray.sweep;
    if (B === 0.5) assert.ok(Math.abs(exitPhi) < 1e-12);
    if (B === 1)
      assert.ok(Math.abs(Math.cos(exitPhi - Math.asin(b)) + 1) < 1e-12);
  }
}
for (const [B, E] of [
  [0.3, 0],
  [0.5, 0],
  [1, 0],
  [0.45, 0.01],
  [0.8, 0.6],
  [0.8, -0.4],
  [1.4, -0.6],
]) {
  const s = surface(B, E, 2400);
  const p = s.profile;
  for (let i = 10; i < p.length - 10; i += 19) {
    const a = p[i - 1],
      c = p[i + 1],
      v = p[i].v;
    const h = E + v * v * (2 - v * v);
    const speed = Math.hypot(c.rho - a.rho, c.z - a.z) / (a.v - c.v);
    const expected = (2 * B * Math.sqrt(h)) / v;
    const err = Math.abs(speed / expected - 1);
    worstMetric = Math.max(worstMetric, err);
    assert.ok(err < 3e-5, JSON.stringify({ B, E, v, err }));
  }
  if (s.end === "boundary") {
    const x = s.minimum ** 2,
      h = E + 2 * x - x * x;
    assert.ok(Math.abs((x * (1 - x)) / (B * h) - 1) < 1e-10);
    assert.equal(s.height(x * 0.99), null);
  }
}
assert.equal(surface(0.5, 0).end, "apex");
assert.equal(surface(0.3, 0).end, "boundary");
assert.equal(orbit(0.8, 0.6, 0.5625).kind, "critical");
console.log(
  "Maximum Cartesian ray discrepancy (R):",
  worstRay.toExponential(3),
);
console.log(
  "Maximum sampled relative meridian metric error:",
  worstMetric.toExponential(3),
);
console.log(
  "Luneburg focus, Eaton reversal, embedding cutoffs and critical branch: passed.",
);

// Off-waist launches, both signs of k and L, and both radial directions.
for (const [k, r0, psi] of [
  [-1.4, 1.3, 0.95],
  [1.2, 1.12, 2.2],
  [-0.8, 0.82, -2.15],
  [1.6, 0.74, -0.85],
]) {
  const E = 0.32,
    x0 = r0 ** k,
    h0 = E + x0 * (2 - x0),
    u0 = 1 / x0;
  const ell = Math.sqrt(h0) * Math.sin(psi),
    D = ell * ell - E;
  const v0 = -u0 * Math.sqrt(h0) * Math.cos(psi);
  // Quadrature of the original optical ray away from a turning point.
  const r1 = r0 * (Math.cos(psi) > 0 ? 1.03 : 0.97),
    dr = (r1 - r0) / 2000;
  const integrand = (r) => {
    const x = r ** k,
      h = E + x * (2 - x);
    return (Math.sign(Math.cos(psi)) * ell) / (r * Math.sqrt(h - ell * ell));
  };
  let phi = 0;
  for (let j = 0; j < 2000; j++) {
    const r = r0 + j * dr;
    phi +=
      (dr * (integrand(r) + 4 * integrand(r + dr / 2) + integrand(r + dr))) / 6;
  }
  assert.ok(
    Math.abs(inversePower((k * phi) / ell, D, u0, v0) ** (-1 / k) - r1) < 1e-11,
  );
}
for (const b of [0.2, 0.55, 0.86]) {
  const sphere = meridianModel(0, 1, 1, b);
  for (const f of [0, 0.1, 0.25, 0.5, 0.79, 1]) {
    const p = sphere.ray.at(f),
      z = sphere.shape.height(p.x);
    assert.ok(Math.abs(p.rho * p.rho + z * z - 1) < 1e-6);
    // The lifted ray is on the great circle determined by its launch tangent.
    assert.ok(
      Math.abs(Math.sqrt(1 - b * b) * p.rho * Math.sin(p.phi) - b * z) < 1e-6,
    );
  }
  for (const B of [0.3, 0.5, 1, 1.35]) {
    const mer = meridianModel(B, B, 1, b),
      mor = orbit(B, b, 0);
    for (const f of [0.03, 0.2, 0.5, 0.71, 0.96]) {
      const p = mer.ray.at(f),
        q = mor.at(p.phi / mor.sweep);
      assert.ok(Math.abs(p.r - q.r) < 1e-9);
      assert.ok(Math.abs(p.rho - q.rho) < 1e-9);
    }
  }
}
const independent = meridianModel(0.35, 1.2, 0.8, 0.55);
for (const f of [0.17, 0.31, 0.62, 0.84]) {
  const a = independent.ray.at(f - 1e-5),
    c = independent.ray.at(f + 1e-5),
    p = independent.ray.at(f);
  // Clairaut invariant estimated from the tangent of the actual 3D polyline.
  const dphi = c.phi - a.phi;
  const tangent = Math.hypot(
    c.rho - a.rho,
    independent.shape.height(c.x) - independent.shape.height(a.x),
    p.rho * dphi,
  );
  assert.ok(Math.abs((p.rho ** 2 * dphi) / tangent - 0.55 / 0.8) < 0.001);
}
console.log(
  "Off-waist and negative-exponent launches, independent A/B/C, sphere and Morse overlap: passed.",
);

// Regression coverage for a uniformly illuminated wavefront and synchronized clocks.
for (const family of ["morse", "abc"]) {
  for (const B of [0.5, 1]) {
    const { rays, length } = parallelBeam({
      family,
      B,
      A: B,
      C: 1,
      b: 0.82,
      count: 12,
    });
    const ref = rays[0];
    for (const [i, r] of rays.entries()) {
      assert.ok(Math.abs(r.height - (-0.82 + (i * 1.64) / 11)) < 1e-12);
      assert.ok(Math.abs(r.atLength(0).x + 1.6) < 1e-12);
      assert.ok(Math.abs(r.atLength(0).y - r.height) < 1e-12);
      assert.equal(r.end, r.atLength(length));
      assert.ok(Math.abs(Math.hypot(r.end.x, r.end.y) - 1.65) < 1e-12);
      const top = rays.at(-1 - i);
      for (const f of [0.12, 0.43, 0.78]) {
        const p = r.atLength(r.end.length * f),
          q = top.atLength(top.end.length * f);
        assert.ok(Math.abs(p.x - q.x) < 1e-9 && Math.abs(p.y + q.y) < 1e-9);
      }
      if (B === 0.5) {
        assert.ok(Math.hypot(r.rimEnd.x - 1, r.rimEnd.y) < 1e-11);
        assert.ok(Math.abs(r.rimEnd.length - ref.rimEnd.length) < 1e-10);
      } else {
        assert.ok(
          r.end.x < r.rimEnd.x && Math.abs(r.end.y - r.rimEnd.y) < 1e-10,
        );
      }
      for (const part of r.parts) {
        for (let j = 1; j < part.length; j++)
          assert.ok(part[j].length >= part[j - 1].length - 1e-9);
      }
    }
  }
}
const mixed = parallelBeam({ B: 0.8, b: 0.8, energy: 0.5625, count: 24 });
assert.ok(
  mixed.rays.some((r) => r.model.kind === "open") &&
    mixed.rays.some((r) => r.model.kind === "returning"),
);
for (const ray of mixed.rays) {
  assert.equal(
    ray.parts.length,
    ray.model.kind === "returning" ? (ray.condensed ? 4 : 3) : 2,
  );
}
const near = parallelBeam({
  B: 0.8,
  b: 0.6,
  energy: 0.5625 - 1e-7,
  count: 1,
}).reference;
assert.ok(near.condensed && near.parts.length === 4 && near.model.sweep > 1000);
assert.ok(Math.abs(Math.hypot(near.rimEnd.x, near.rimEnd.y) - 1) < 1e-10);
assert.ok(Number.isFinite(near.atLength(near.rimEnd.length * 0.48).x));
const critical = parallelBeam({
  B: 0.8,
  b: 0.6,
  energy: 0.5625,
  count: 1,
}).reference;
assert.equal(critical.model.kind, "critical");
for (const ray of [near, critical, ...mixed.rays]) {
  for (const part of ray.parts)
    for (const p of part) assert.ok(Number.isFinite(p.length));
}
// Independently integrate sampled optical length for both analytic clocks,
// including a non-unit rim index. It must be in the same units as the exterior.
for (const config of [
  { B: 0.7, energy: 0.4 },
  { B: 1.1, energy: -0.25 },
  { B: 0.8, A: 0.34, C: 1.7, family: "abc" },
]) {
  for (const b of [0.33, 0.85]) {
    const ray = parallelBeam({ ...config, b, count: 1 }).reference,
      model = ray.model;
    const L = b * (config.C ? 1 / config.C : Math.sqrt(1 + config.energy));
    let prev = model.at(0),
      sum = 0;
    for (let i = 1; i <= 12000; i++) {
      const curr = model.at(i / 12000);
      sum +=
        (Math.abs(curr.phi - prev.phi) * (prev.rho ** 2 + curr.rho ** 2)) /
        (2 * L);
      prev = curr;
    }
    assert.ok(Math.abs(sum - model.opticalDistance(1)) < 2e-6, { sum });
  }
}
console.log(
  "Parallel launch, common optical time, matched entry/exit, mixed and long-return bundles: passed.",
);
