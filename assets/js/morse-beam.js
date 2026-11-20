import {
  orbit,
  surface,
  meridianModel,
  meridianRay,
} from "./morse-model.js?v=beam2";

// All launch points lie on one incident wavefront. The uniform exterior is
// matched to the index at the lens rim; its equivalent exterior is a flat sheet.
const launchX = -1.6;
const observationRadius = 1.65;
const halfWindow = 8 * Math.PI;

function flatPoint(x, y, index, length) {
  return { x, y, u: index * x, v: index * y, z: 0, length };
}

function traceRay(height, model, shape) {
  const impact = Math.abs(height),
    sign = Math.sign(height);
  const rimIndex = shape.profile[0].rho,
    radial = Math.sqrt(1 - height * height);
  const entryPhi = Math.PI - Math.asin(height);
  const entryLength = (Math.abs(launchX) - radial) * rimIndex;
  function inside(f) {
    const p = model.at(f);
    const phi = entryPhi - sign * p.phi,
      c = Math.cos(phi),
      s = Math.sin(phi);
    return {
      x: p.r * c,
      y: p.r * s,
      u: p.rho * c,
      v: p.rho * s,
      z: shape.height(p.x),
      length: entryLength + model.opticalDistance(f, p),
    };
  }
  const start = flatPoint(launchX, height, rimIndex, 0);
  const entry = inside(0);
  const parts = [[start, entry]];
  const condensed = model.kind === "returning" && model.sweep > 2 * halfWindow;
  const edge = condensed ? halfWindow / model.sweep : 0;
  const intervals = condensed
    ? [
        [0, edge],
        [1 - edge, 1],
      ]
    : [[0, 1]];
  for (const [a, b] of intervals) {
    const count = Math.max(200, Math.ceil(55 * (b - a) * model.angle));
    const points = [];
    for (let i = 0; i <= count; i++) {
      // Higher rim resolution captures small-impact and near-critical paths.
      const f = a + ((b - a) * (1 - Math.cos((Math.PI * i) / count))) / 2;
      points.push(inside(f));
    }
    parts.push(points);
  }
  const rimEnd = inside(1);
  let end = rimEnd;
  if (model.kind === "returning") {
    const angle = entryPhi - sign * (model.sweep + Math.asin(impact));
    const distance = Math.sqrt(observationRadius ** 2 - height ** 2) - radial;
    end = flatPoint(
      rimEnd.x + distance * Math.cos(angle),
      rimEnd.y + distance * Math.sin(angle),
      rimIndex,
      rimEnd.length + distance * rimIndex,
    );
    parts.push([rimEnd, end]);
  }
  function atLength(length) {
    if (length <= 0) return start;
    if (length >= end.length) return end;
    const part = parts.find(
      (p) => p[0].length <= length && length <= p.at(-1).length,
    );
    if (!part) {
      // Omitted high-winding strokes keep their full transit time and exact head.
      let lo = edge,
        hi = 1 - edge;
      for (let i = 0; i < 42; i++) {
        const mid = (lo + hi) / 2;
        if (entryLength + model.opticalDistance(mid) < length) lo = mid;
        else hi = mid;
      }
      return inside((lo + hi) / 2);
    }
    let lo = 0,
      hi = part.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (part[mid].length < length) lo = mid;
      else hi = mid;
    }
    const a = part[lo],
      b = part[hi],
      t = (length - a.length) / (b.length - a.length || 1);
    const lerp = (x, y) => x + (y - x) * t;
    return {
      x: lerp(a.x, b.x),
      y: lerp(a.y, b.y),
      u: lerp(a.u, b.u),
      v: lerp(a.v, b.v),
      z: a.z === null || b.z === null ? null : lerp(a.z, b.z),
      length,
    };
  }
  return { height, model, parts, entry, rimEnd, end, condensed, atLength };
}

export function parallelBeam({
  family = "morse",
  B,
  b,
  energy = 0,
  A = 0.75,
  C = 1,
  count = 12,
}) {
  // Even bundles straddle the singular axial ray without assigning a
  // continuation at a cone point. Single-ray mode retains the selected impact.
  if (count !== 1 && (!Number.isInteger(count) || count < 2 || count % 2))
    throw new RangeError("Choose one ray or an even bundle.");
  const abc = family === "abc";
  const shape = abc ? meridianModel(A, B, C, b).shape : surface(B, energy);
  if (!abc) shape.innerR = shape.minimum ** (2 * B);
  const rays = Array.from({ length: count }, (_, i) => {
    const height = count === 1 ? b : (b * (2 * i - (count - 1))) / (count - 1);
    const impact = Math.abs(height);
    return traceRay(
      height,
      abc ? meridianRay(A, B, C, impact) : orbit(B, impact, energy),
      shape,
    );
  });
  return {
    shape,
    rays,
    reference: rays.at(-1),
    length: Math.max(...rays.map((ray) => ray.end.length)),
  };
}
