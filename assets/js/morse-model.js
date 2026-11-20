/* Dimensionless Morse optics. Physical plane radii use R, optical lengths use N R. */
// Exact u=1/x at w=k*(phi-phi0)/ell for arbitrary launch data, with
// v0=du/dw at launch. Nonpositive results lie outside the physical branch.
export function inversePower(w, D, u0, v0) {
  const t = Math.sqrt(Math.abs(D)) * w;
  let S, T;
  if (Math.abs(t) < 0.001) {
    const q = D * w * w;
    S = w * (1 - q / 6 + (q * q) / 120);
    T = 0.5 * w * w * (1 - q / 12 + (q * q) / 360);
  } else {
    const scale = Math.sqrt(Math.abs(D));
    S = (D > 0 ? Math.sin(t) : Math.sinh(t)) / scale;
    const half = D > 0 ? Math.sin(t / 2) : Math.sinh(t / 2);
    T = 2 * (half / scale) ** 2;
  }
  return u0 + v0 * S + (1 - D * u0) * T;
}

export function orbit(B, b, energy) {
  const ell = b * Math.sqrt(1 + energy);
  const D = ell * ell - energy;
  const e = Math.sqrt(Math.max(0, 1 - D));
  const rate = B * Math.abs(ell);
  const critical = Math.abs(D) < 2e-14;
  const kind = critical ? "critical" : D > 0 ? "returning" : "open";

  const reciprocal = (w) => inversePower(w, D, 1, e);
  const sweep =
    kind === "returning" ? (2 * rate * Math.acos(-e)) / Math.sqrt(D) : Infinity;
  let angle = Math.min(sweep, 4 * Math.PI);
  // Infinite branches spiral toward the origin. Stop the drawing when they
  // are below plot resolution; this does not change the analytic solution.
  if (kind !== "returning" && reciprocal(angle / rate) ** -B < 0.012) {
    let low = 0,
      high = angle;
    for (let i = 0; i < 55; i++) {
      const mid = (low + high) / 2;
      if (reciprocal(mid / rate) ** -B < 0.012) high = mid;
      else low = mid;
    }
    angle = (low + high) / 2;
  }
  function at(fraction) {
    const phi = angle * fraction;
    const x = 1 / reciprocal(phi / rate);
    return {
      phi: b < 0 ? -phi : phi,
      x,
      r: x ** B,
      rho: Math.sqrt(Math.max(0, energy + x * (2 - x))),
    };
  }
  return { ell, D, kind, sweep, angle, at };
}

export function surface(B, energy, steps = 640) {
  // v=sqrt(x). At zero energy both apparent 0/0 factors cancel at the pole.
  // Positive energy has an infinite end; render only v >= 0.07.
  const rho = (v) => Math.sqrt(Math.max(0, energy + v * v * (2 - v * v)));
  function heightSquare(v) {
    const x = v * v;
    if (energy === 0) return 4 * (B * B * (2 - x) - (1 - x) ** 2 / (2 - x));
    const h = energy + x * (2 - x);
    if (v === 0 || h <= 0) return -Infinity;
    return 4 * ((B * B * h) / x - (x * (1 - x) ** 2) / h);
  }
  // Real embedding on the waist-connected sheet requires
  // B h - x(1-x) >= 0. Find the first forbidden interval analytically;
  // a sampled search could jump over a narrow non-embeddable annulus.
  const coeff = 1 - B,
    lin = 2 * B - 1,
    c = B * energy;
  const disc = lin * lin - 4 * coeff * c;
  const roots = [];
  if (Math.abs(coeff) < 1e-14) roots.push(-c / lin);
  else if (disc > 0) {
    const q = -0.5 * (lin + (lin >= 0 ? 1 : -1) * Math.sqrt(disc));
    roots.push(q / coeff);
    if (q !== 0) roots.push(c / q);
  }
  const cut =
    roots
      .filter((x) => x > 0 && x < 1 && 2 * coeff * x + lin > 0)
      .sort((a, b) => b - a)[0] || 0;
  const windowV = energy > 0 ? 0.07 : 0;
  const minimum = Math.max(Math.sqrt(cut), windowV);
  const end =
    minimum === 0
      ? "apex"
      : cut > 0 && Math.sqrt(cut) >= windowV
        ? "boundary"
        : "window";
  const dv = (1 - minimum) / steps;
  const slope = (v) => Math.sqrt(Math.max(0, heightSquare(v)));
  const profile = [{ v: 1, rho: rho(1), z: 0 }];
  let z = 0;
  for (let i = 1; i <= steps; i++) {
    const v = i === steps ? minimum : 1 - i * dv;
    const prev = profile[i - 1].v;
    z +=
      ((prev - v) * (slope(prev) + 4 * slope((prev + v) / 2) + slope(v))) / 6;
    profile.push({ v, rho: rho(v), z });
  }
  function height(x) {
    const v = Math.sqrt(x);
    if (v < minimum - 1e-12 || v > 1 + 1e-12) return null;
    const t = Math.max(0, Math.min(steps, (1 - v) / dv)),
      i = Math.min(steps - 1, Math.floor(t));
    return profile[i].z + (t - i) * (profile[i + 1].z - profile[i].z);
  }
  return { profile, height, minimum, end, z };
}

// The A,B,C meridian model. r(π/2)=R=1 fixes the radial scale and the
// waist's optical radius is 1/C. The plotted branch has A>=0 and B>0.
export function meridianModel(A, B, C, b, steps = 640) {
  const half = Math.PI / 2,
    turn = Math.asin(b),
    leg = A * Math.acos(b) + B * half;
  const radial = (t) => Math.sin(t) ** A * Math.tan(t / 2) ** B;
  const minTheta = A + B < 1 ? Math.acos(B / (1 - A)) : 0;
  const slope = (t) => {
    const c = Math.cos(t),
      q = B + A * c;
    return Math.sqrt(Math.max(0, (q - c) * (q + c))) / C;
  };
  const profile = [{ rho: 1 / C, z: 0 }];
  const dt = (half - minTheta) / steps;
  let z = 0;
  for (let i = 1; i <= steps; i++) {
    const t = half - i * dt;
    z += (dt * (slope(t) + 4 * slope(t + dt / 2) + slope(t + dt))) / 6;
    profile.push({ rho: Math.sin(t) / C, z });
  }
  function height(t) {
    if (t < minTheta - 1e-12) return null;
    const pos = Math.min(steps, Math.max(0, (half - t) / dt)),
      i = Math.min(steps - 1, Math.floor(pos));
    return profile[i].z + (pos - i) * (profile[i + 1].z - profile[i].z);
  }
  function at(f) {
    const t = turn + (half - turn) * Math.cos(Math.PI * f) ** 2;
    const sn = Math.sin(t),
      q = Math.sqrt(Math.max(0, (sn - b) * (sn + b)));
    const F =
      A * Math.acos(Math.min(1, b / sn)) + B * Math.atan2(q, b * Math.cos(t));
    return { phi: leg + (f <= 0.5 ? -F : F), r: radial(t), rho: sn / C, x: t };
  }
  // Both models expose a local profile coordinate on the ray as x.
  return {
    ray: { at, sweep: 2 * leg, angle: 2 * leg, kind: "returning" },
    shape: {
      profile,
      height,
      z,
      end: minTheta === 0 ? "apex" : "boundary",
      innerR: radial(minTheta),
    },
  };
}
