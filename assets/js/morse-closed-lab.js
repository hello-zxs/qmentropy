import { closedSurface, closedOrbit } from "./morse-closed-model.js";

const get = (id) => document.getElementById(id);
const zh = new URLSearchParams(location.search).get("lang") === "zh";
const tr = (english, chinese) => (zh ? chinese : english);
document.documentElement.lang = tr("en", "zh");
document.title =
  tr("Closed Morse-cap lens", "含 Morse 极帽的闭合测地线透镜") + " | QMENTROPY";
get("language").href = tr("?lang=zh", "?lang=en");
get("language").textContent = tr("中文", "English");
get("language").lang = tr("zh", "en");
function typeset() {
  window.renderMathInElement?.(document.querySelector("article"), {
    throwOnError: false,
  });
}
if (document.readyState === "complete") typeset();
else window.addEventListener("load", typeset, { once: true });

const tau = 2 * Math.PI,
  gold = "#ffbc77",
  blue = "#80def0",
  muted = "#55777d";
const sphere = get("closed-surface"),
  profile = get("closed-profile");
let height,
  orbits,
  capAngle,
  progress = 0,
  frame = 0,
  last = null;

function view(canvas) {
  const { width, height } = canvas.getBoundingClientRect(),
    dpr = Math.min(devicePixelRatio || 1, 2);
  if (
    canvas.width !== Math.round(width * dpr) ||
    canvas.height !== Math.round(height * dpr)
  ) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = ctx.lineJoin = "round";
  return { ctx, width, height };
}
function line(ctx, points, color, weight = 1) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.strokeStyle = color;
  ctx.lineWidth = weight;
  ctx.stroke();
}
function dot(ctx, [x, y], color, radius) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, tau);
  ctx.fill();
}
function sample(n, fn) {
  return Array.from({ length: n + 1 }, (_, i) => fn(i / n));
}
function surfacePoint(theta, phi) {
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: height(theta),
  };
}
function drawProfile() {
  const { ctx, width, height: h } = view(profile);
  const top = Math.max(1, height(0)),
    bottom = Math.min(-1, height(Math.PI));
  const scale = Math.min(width * 0.67, (h - 36) / (top - bottom));
  const x0 = (width - scale) / 2,
    y0 = 16 + top * scale;
  const at = (theta, z) => [x0 + scale * Math.sin(theta), y0 - scale * z];
  const curve = (from, to) =>
    sample(120, (t) => {
      const theta = from + (to - from) * t;
      return at(theta, height(theta));
    });
  ctx.setLineDash([3, 4]);
  line(
    ctx,
    [
      [x0, 8],
      [x0, h - 8],
    ],
    muted,
  );
  line(
    ctx,
    sample(90, (t) => at(Math.PI * t, Math.cos(Math.PI * t))),
    "#779094",
  );
  ctx.setLineDash([]);
  line(ctx, curve(0, Math.PI), "#c9d8d6", 2);
  line(ctx, curve(0, capAngle), blue, 3);
  dot(ctx, at(capAngle, height(capAngle)), blue, 3.5);
  dot(ctx, at(Math.PI / 2, 0), gold, 3);
  ctx.fillStyle = "#c9d8d6";
  ctx.font = "12px system-ui";
  ctx.fillText("N", x0 - 17, y0 - height(0) * scale + 5);
  ctx.fillText("S", x0 - 17, y0 - height(Math.PI) * scale + 4);
}
// Cache the wireframe and the full paths. During playback only the growing
// trails and markers change, at the same optical distance on every ray.
let backdrop, projection;
function prepareSurface() {
  const { width, height: h } = view(sphere),
    dpr = Math.min(devicePixelRatio || 1, 2);
  backdrop = document.createElement("canvas");
  backdrop.width = sphere.width;
  backdrop.height = sphere.height;
  const ctx = backdrop.getContext("2d");
  ctx.scale(dpr, dpr);
  const scale = Math.min(
    width / 2.55,
    (h - 28) / (height(0) - height(Math.PI) + 0.38),
  );
  const center = (height(0) + height(Math.PI)) / 2;
  projection = ({ x, y, z }) => [
    width / 2 + scale * (0.55 * x + 0.835 * y),
    h / 2 - scale * (0.97 * (z - center) - 0.24 * (0.835 * x - 0.55 * y)),
  ];
  for (let i = 0; i < 18; i++)
    line(
      ctx,
      sample(90, (t) => projection(surfacePoint(Math.PI * t, (tau * i) / 18))),
      "#334c50",
    );
  for (let i = 1; i < 12; i++)
    line(
      ctx,
      sample(120, (t) => projection(surfacePoint((Math.PI * i) / 12, tau * t))),
      "#355357",
    );
  line(
    ctx,
    sample(120, (t) => projection(surfacePoint(capAngle, tau * t))),
    "#639ca5",
    1.5,
  );
  for (const [i, points] of orbits.entries())
    line(
      ctx,
      points.map(projection),
      i === orbits.length - 1 ? "#9b7753" : "#44696e",
      1,
    );
}
function draw() {
  const { ctx, width, height: h } = view(sphere);
  ctx.drawImage(backdrop, 0, 0, width, h);
  for (const [i, points] of orbits.entries()) {
    const target = progress * tau;
    let lo = 0,
      hi = points.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (points[mid].distance <= target) lo = mid;
      else hi = mid;
    }
    const a = points[lo],
      b = points[hi];
    const f = Math.min(
      1,
      Math.max(0, (target - a.distance) / (b.distance - a.distance)),
    );
    const head = projection({
      x: a.x + f * (b.x - a.x),
      y: a.y + f * (b.y - a.y),
      z: a.z + f * (b.z - a.z),
    });
    const active = i === orbits.length - 1;
    line(
      ctx,
      [...points.slice(0, lo + 1).map(projection), head],
      active ? gold : blue,
      active ? 2.6 : 1.3,
    );
    dot(ctx, head, active ? gold : blue, active ? 4 : 2.5);
  }
  const [x, y] = projection(orbits[0][0]);
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, tau);
  ctx.strokeStyle = "#f2f6ee";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  get("closed-progress").value = Math.round(progress * 1000);
  get("closed-distance").textContent = (tau * progress).toFixed(3) + " / 2π";
}
function label() {
  get("closed-play").textContent = frame
    ? tr("Pause", "暂停")
    : progress >= 1
      ? tr("Replay one period", "重播一周")
      : tr("Play one period", "播放一周");
  get("closed-play").setAttribute("aria-pressed", String(Boolean(frame)));
}
function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  last = null;
  label();
}
function tick(now) {
  if (last !== null) progress = Math.min(1, progress + (now - last) / 24000);
  last = now;
  draw();
  if (progress >= 1) stop();
  else frame = requestAnimationFrame(tick);
}
function refresh() {
  stop();
  progress = 0;
  const strength = get("strength").valueAsNumber,
    angle = get("inclination").valueAsNumber,
    edge = get("cap-edge").valueAsNumber;
  capAngle = Math.acos(edge);
  get("edge-out").textContent = edge.toFixed(2);
  get("cap-size").textContent =
    tr("Northern cap", "北极帽") +
    " · θ ≤ " +
    ((capAngle * 180) / Math.PI).toFixed(1) +
    "°";
  get("strength-out").textContent = strength.toFixed(2);
  get("inclination-out").textContent = angle + "°";
  height = closedSurface(strength, edge);
  const angles = [15, 35, 55, 75].filter((a) => Math.abs(angle - a) > 1);
  orbits = [...angles, angle].map((a) =>
    closedOrbit(Math.sin((a * Math.PI) / 180), strength, height, edge),
  );
  prepareSurface();
  drawProfile();
  draw();
  label();
}
get("closed-play").addEventListener("click", () => {
  if (frame) {
    stop();
    return;
  }
  if (progress >= 1) progress = 0;
  last = null;
  frame = requestAnimationFrame(tick);
  label();
});
get("closed-progress").addEventListener("input", () => {
  stop();
  progress = get("closed-progress").valueAsNumber / 1000;
  draw();
  label();
});
for (const id of ["strength", "inclination", "cap-edge"])
  get(id).addEventListener("input", refresh);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop();
});
refresh();
new ResizeObserver(() => {
  prepareSurface();
  drawProfile();
  draw();
}).observe(sphere);
