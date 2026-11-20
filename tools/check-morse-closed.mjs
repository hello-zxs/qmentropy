// Run with Node 22+. All lengths are normalized by the equatorial radius.
import assert from "node:assert/strict";
import {
  meridianFactor,
  closedSurface,
  closedOrbit,
} from "../assets/js/morse-closed-model.js";

const tau = 2 * Math.PI;
let maxPosition = 0,
  maxTangent = 0,
  maxTrace = 0;
function near(a, b, tolerance) {
  assert.ok(
    Math.abs(a - b) <= tolerance,
    `${a} differs from ${b} by more than ${tolerance}`,
  );
}

// Independent time evolution of H = (p_theta²/F² + m²/sin²(theta))/2.
// No periodic identification of phi and no endpoint correction.
function integrate(strength, edge, m, trace) {
  const initial = [Math.PI / 2, 0, -Math.sqrt(1 - m * m)];
  const f = (theta) => meridianFactor(Math.cos(theta), strength, edge);
  function velocity([theta, , p]) {
    const v = f(theta),
      s = Math.sin(theta),
      df = (f(theta + 1e-5) - f(theta - 1e-5)) / 2e-5;
    return [
      p / (v * v),
      m / (s * s),
      (p * p * df) / (v * v * v) + (m * m * Math.cos(theta)) / (s * s * s),
    ];
  }
  const add = (x, k, h) => x.map((v, i) => v + h * k[i]);
  const n = 7200,
    h = tau / n;
  let state = initial;
  for (let i = 1; i <= n; i++) {
    const k1 = velocity(state),
      k2 = velocity(add(state, k1, h / 2)),
      k3 = velocity(add(state, k2, h / 2)),
      k4 = velocity(add(state, k3, h));
    state = state.map(
      (v, j) => v + (h * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) / 6,
    );
    if (i % (n / 16) === 0) {
      const length = i * h;
      const hi = trace.findIndex((point) => point.distance >= length);
      const j = hi < 0 ? trace.length - 1 : hi;
      const a = trace[j - 1],
        b = trace[j],
        t = (length - a.distance) / (b.distance - a.distance);
      const [theta, phi] = state;
      for (const [axis, value] of [
        ["x", Math.sin(theta) * Math.cos(phi)],
        ["y", Math.sin(theta) * Math.sin(phi)],
        ["u", Math.cos(theta)],
      ])
        maxTrace = Math.max(
          maxTrace,
          Math.abs(a[axis] + (b[axis] - a[axis]) * t - value),
        );
    }
  }
  maxPosition = Math.max(
    maxPosition,
    Math.abs(state[0] - initial[0]),
    Math.abs(state[1] - Math.sign(m) * tau),
  );
  const before = velocity(initial),
    after = velocity(state);
  maxTangent = Math.max(
    maxTangent,
    Math.abs(after[0] - before[0]),
    Math.abs(after[1] - before[1]),
  );
}

for (const [strength, edge] of [
  [0, 0.5],
  [0.35, 0.25],
  [0.8, 0.75],
  [1, 0.1],
  [1, 0.5],
  [1, 0.9],
]) {
  const height = closedSurface(strength, edge);
  near(height(Math.PI / 2), 0, 1e-12);
  for (let i = 0; i <= 400; i++) {
    const u = (i - 200) / 200,
      f = meridianFactor(u, strength, edge);
    near(f + meridianFactor(-u, strength, edge), 2, 3e-16);
    assert.ok(f >= Math.abs(u));
    if (strength === 1 && u >= edge) near(f, (1 + u) / 2, 2e-16);
    if (strength === 0) near(height(Math.acos(u)), u, 3e-6);
  }
  // Finite differences of the embedded meridian check its optical metric.
  const fineHeight = closedSurface(strength, edge, 7200);
  for (let i = 1; i < 7200; i += 7) {
    const theta = (Math.PI * i) / 7200,
      step = Math.PI / 7200;
    const dz =
      (fineHeight(theta + step) - fineHeight(theta - step)) / (2 * step);
    near(
      Math.hypot(Math.cos(theta), dz),
      meridianFactor(Math.cos(theta), strength, edge),
      1.6e-4,
    );
  }
  for (const m of [0, 0.08, -0.32, 0.65, 0.92, 0.995, 1]) {
    const trace = closedOrbit(m, strength, height, edge);
    const first = trace[0],
      last = trace.at(-1);
    near(last.distance, tau, 3e-12);
    for (const axis of ["x", "y", "z"]) near(last[axis], first[axis], 1e-12);
    if (m === 0) {
      near(trace[180].z, height(0), 1e-12);
      near(trace[540].z, height(Math.PI), 1e-12);
      near(trace[540].distance - trace[180].distance, Math.PI, 1e-12);
      assert.ok(trace.every((p) => Math.abs(p.y) < 1e-14));
    } else if (m === 1) {
      assert.ok(trace.every((p) => Math.abs(p.z) < 1e-12));
      near(trace[180].y, 1, 1e-12);
    } else integrate(strength, edge, m, trace);
  }
}
assert.ok(maxPosition < 2e-7, String(maxPosition));
assert.ok(maxTangent < 2e-7, String(maxTangent));
assert.ok(maxTrace < 5e-5, String(maxTrace));
console.log(
  `Closed Morse cap: maximum angular return error ${maxPosition.toExponential(2)} rad, tangent component error ${maxTangent.toExponential(2)}, intermediate trace error ${maxTrace.toExponential(2)}.`,
);
