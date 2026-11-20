// Lengths are in units of the equatorial optical radius a = NR.
const tau = 2 * Math.PI;

// C-infinity step, flat at both endpoints. The cap starts at cos(theta)=edge.
function capWeight(u, edge) {
  const t = Math.abs(u) / edge;
  if (t >= 1) return 1;
  if (t === 0) return 0;
  const left = Math.exp(-1 / t),
    right = Math.exp(-1 / (1 - t));
  return left / (left + right);
}

export function meridianFactor(u, strength, edge = 0.5) {
  return (
    1 - 0.5 * strength * Math.sign(u) * (1 - Math.abs(u)) * capWeight(u, edge)
  );
}

export function closedSurface(strength, edge = 0.5, steps = 720) {
  const z = [0],
    step = Math.PI / steps;
  function slope(theta) {
    const u = Math.cos(theta),
      f = meridianFactor(u, strength, edge);
    return Math.sqrt((f - u) * (f + u));
  }
  for (let i = 0; i < steps; i++) {
    const theta = i * step;
    z.push(
      z[i] -
        (step *
          (slope(theta) + 4 * slope(theta + step / 2) + slope(theta + step))) /
          6,
    );
  }
  const equator = (z[Math.floor(steps / 2)] + z[Math.ceil(steps / 2)]) / 2;
  return function height(theta) {
    const index = Math.min(steps, Math.max(0, theta / step)),
      i = Math.floor(index);
    return z[i] + (index - i) * ((z[i + 1] ?? z[i]) - z[i]) - equator;
  };
}

// Start at the equator, heading north with signed Clairaut constant m.
// u = sqrt(1-m²) sin(t). Relative to the round sphere, only an extra
// azimuth and a reparametrization by optical length need to be integrated.
export function closedOrbit(m, strength, height, edge = 0.5, steps = 720) {
  const amplitude = Math.sqrt((1 - m) * (1 + m)),
    step = tau / steps;
  const points = [];
  let correction = 0,
    distance = 0;
  function rates(t) {
    const u = amplitude * Math.sin(t);
    // Cancel (1-|u|) analytically. This also covers pole crossings at m=0.
    const shift = -0.5 * strength * Math.sign(u) * capWeight(u, edge);
    return [(m * shift) / (1 + Math.abs(u)), 1 + shift * (1 - Math.abs(u))];
  }
  let left = rates(0);
  for (let i = 0; i <= steps; i++) {
    const t = i * step;
    const x = Math.cos(t),
      y = m * Math.sin(t),
      u = amplitude * Math.sin(t);
    points.push({
      x: x * Math.cos(correction) - y * Math.sin(correction),
      y: x * Math.sin(correction) + y * Math.cos(correction),
      z: height(Math.acos(u)),
      u,
      distance,
    });
    if (i === steps) break;
    const mid = rates(t + step / 2),
      right = rates((i + 1) * step);
    correction += (step * (left[0] + 4 * mid[0] + right[0])) / 6;
    distance += (step * (left[1] + 4 * mid[1] + right[1])) / 6;
    left = right;
  }
  return points;
}
