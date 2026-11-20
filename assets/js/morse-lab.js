import { orbit, surface, meridianModel } from "./morse-model.js";

const byId = (id) => document.getElementById(id);
const chinese = new URLSearchParams(location.search).get("lang") === "zh";
const tr = (en, zh) => (chinese ? zh : en);
document.documentElement.lang = tr("en", "zh");
const language = byId("language");
language.href = tr("?lang=zh", "?lang=en");
language.lang = tr("zh", "en");
language.textContent = tr("中文", "English");
if (chinese) document.title = "Morse 透镜 · 光线与测地线 | QMENTROPY";
function typeset() {
  if (window.renderMathInElement)
    window.renderMathInElement(document.querySelector("article"), {
      throwOnError: false,
    });
}
if (document.readyState === "complete") typeset();
else window.addEventListener("load", typeset, { once: true });

const fields = ["B", "b", "energy", "A", "C"].map(byId);
const morsePresets = [
  [tr("Custom", "自定义"), null],
  ["Luneburg", [0.5, 0.55, 0]],
  ["Eaton", [1, 0.55, 0]],
  [tr("Intermediate Morse", "中间 Morse 剖面"), [0.75, 0.55, 0]],
  [tr("Partial surface", "部分曲面"), [0.3, 0.35, 0]],
  [tr("Critical ray", "临界光线"), [0.8, 0.6, 0.5625]],
  [tr("Open ray", "开放光线"), [0.7, 0.3, 0.5]],
];
const abcPresets = [
  [tr("Custom", "自定义"), null],
  ["Luneburg", [0.5, 0.55, 0, 0.5, 1]],
  ["Eaton", [1, 0.55, 0, 1, 1]],
  [tr("Fish-eye hemisphere", "鱼眼半球"), [1, 0.55, 0, 0, 1]],
  [tr("Independent A and B", "独立的 A、B"), [1.2, 0.55, 0, 0.25, 0.8]],
];
const isABC = () => byId("family").value === "abc";
const currentPresets = () => (isABC() ? abcPresets : morsePresets);
function setFamily() {
  const abc = isABC();
  byId("energy-control").hidden = abc;
  for (const name of ["A", "C"]) byId(name + "-control").hidden = !abc;
  document.querySelector(".controls").classList.toggle("is-abc", abc);
  byId("preset").replaceChildren();
  for (const [i, [label]] of currentPresets().entries())
    byId("preset").add(new Option(label, String(i)));
}
let model,
  shape,
  points,
  opticalLengths,
  mode = "",
  progress = 0,
  last = 0,
  frame = 0,
  sweepDir = 1;
const tau = 2 * Math.PI;
const viewAngle = -0.52;
function context(canvas) {
  const rect = canvas.getBoundingClientRect(),
    dpr = Math.min(devicePixelRatio || 1, 2);
  const w = Math.round(rect.width * dpr),
    h = Math.round(rect.height * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  return { ctx, w: rect.width, h: rect.height };
}
function stroke(ctx, vertices, color, width = 1) {
  ctx.beginPath();
  let move = true;
  for (const p of vertices) {
    if (!p) {
      move = true;
      continue;
    }
    if (move) ctx.moveTo(p[0], p[1]);
    else ctx.lineTo(p[0], p[1]);
    move = false;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function dot(ctx, p, color, size) {
  if (!p) return;
  ctx.beginPath();
  ctx.arc(p[0], p[1], size, 0, tau);
  ctx.fillStyle = color;
  ctx.fill();
}
const samples = (count, fn) =>
  Array.from({ length: count + 1 }, (_, i) => fn(i / count));
function drawRay(ctx, project) {
  stroke(ctx, points.map(project), "#ffbc77", 2.4);
  dot(ctx, project(points[0]), "#fff", 4);
  if (mode === "trace") {
    const target = progress * opticalLengths.at(-1);
    let low = 0,
      high = opticalLengths.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (opticalLengths[mid] < target) low = mid;
      else high = mid;
    }
    const fraction =
      (target - opticalLengths[low]) /
      (opticalLengths[high] - opticalLengths[low]);
    dot(
      ctx,
      project(model.at((low + fraction) / (points.length - 1))),
      "#ffe7c9",
      6,
    );
  }
}
function render() {
  if (!points) return;
  const p = context(byId("plane"));
  const unit = 0.405 * Math.min(p.w, p.h),
    cx = p.w / 2,
    cy = p.h / 2;
  const flat = (r, phi) => [
    cx + unit * r * Math.cos(phi),
    cy - unit * r * Math.sin(phi),
  ];
  stroke(
    p.ctx,
    [
      [cx - 1.14 * unit, cy],
      [cx + 1.14 * unit, cy],
    ],
    "#31484d",
  );
  stroke(
    p.ctx,
    [
      [cx, cy - 1.12 * unit],
      [cx, cy + 1.12 * unit],
    ],
    "#31484d",
  );
  for (const radius of [0.25, 0.5, 0.75, 1])
    stroke(
      p.ctx,
      samples(128, (t) => flat(radius, t * tau)),
      radius === 1 ? "#7c9c9e" : "#2d4349",
    );
  drawRay(p.ctx, (pt) => flat(pt.r, pt.phi));
  const s = context(byId("surface")),
    tilt = 0.38,
    profile = shape.profile;
  const rim = profile[0].rho;
  // Orthographic view in common units along all three spatial axes.
  const low = -Math.sin(tilt) * rim,
    high = shape.z * Math.cos(tilt) + Math.sin(tilt) * rim;
  const scale = Math.min((0.46 * s.w) / rim, (0.84 * s.h) / (high - low));
  const project = (radius, phi, z) => [
    s.w / 2 + scale * radius * Math.cos(phi + viewAngle),
    s.h / 2 -
      scale *
        (z * Math.cos(tilt) +
          radius * Math.sin(phi + viewAngle) * Math.sin(tilt) -
          (high + low) / 2),
  ];
  const ring = (level, color, width) =>
    stroke(
      s.ctx,
      samples(100, (t) => project(level.rho, t * tau, level.z)),
      color,
      width,
    );
  for (let i = 0; i <= 12; i++)
    ring(profile[Math.round((i * (profile.length - 1)) / 12)], "#3a5b62", 0.9);
  for (let i = 0; i < 24; i++)
    stroke(
      s.ctx,
      profile
        .filter((_, j) => j % 8 === 0 || j === profile.length - 1)
        .map((l) => project(l.rho, (i * tau) / 24, l.z)),
      "#31545b",
    );
  ring(profile[0], "#79979a", 1.15);
  if (shape.end === "boundary") {
    s.ctx.setLineDash([4, 4]);
    ring(profile.at(-1), "#80def0", 1.7);
    s.ctx.setLineDash([]);
  }
  const bar = 0.25 * scale;
  stroke(
    s.ctx,
    [
      [12, s.h - 15],
      [12 + bar, s.h - 15],
    ],
    "#b5c8c9",
    1.5,
  );
  s.ctx.font = "11px system-ui";
  s.ctx.fillStyle = "#b5c8c9";
  s.ctx.fillText("0.25", 12, s.h - 20);
  drawRay(s.ctx, (pt) => {
    const z = shape.height(pt.x);
    return z === null ? null : project(pt.rho, pt.phi, z);
  });
}
function refresh() {
  const [B, b, energy, A, C] = fields.map((e) => e.valueAsNumber);
  for (const field of fields)
    byId(field.id + "-out").value =
      field.id === "energy"
        ? String(field.valueAsNumber)
        : field.valueAsNumber.toFixed(2);
  if (isABC()) {
    const result = meridianModel(A, B, C, b);
    model = result.ray;
    shape = result.shape;
  } else {
    model = orbit(B, b, energy);
    shape = surface(B, energy);
    shape.innerR = shape.minimum ** (2 * B);
  }
  points = samples(540, model.at);
  // ds/dphi = rho²/L. The constant |L| cancels in normalized optical time.
  opticalLengths = [0];
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1],
      q = points[i];
    opticalLengths.push(
      opticalLengths[i - 1] +
        (Math.abs(q.phi - p.phi) * (p.rho * p.rho + q.rho * q.rho)) / 2,
    );
  }
  const matched = currentPresets().findIndex(
    ([, v]) =>
      v &&
      v[0] === B &&
      v[1] === b &&
      (isABC() ? v[3] === A && v[4] === C : v[2] === energy),
  );
  byId("preset").value = String(Math.max(0, matched));
  const angle =
    model.kind === "returning"
      ? ((model.sweep * 180) / Math.PI).toFixed(1) + "°"
      : tr("no return", "无返回");
  const kind = {
    returning: tr("Returning ray", "返回光线"),
    critical: tr("Critical ray", "临界光线"),
    open: tr("Open ray", "开放光线"),
  };
  byId("readout").textContent =
    kind[model.kind] +
    "  ·  " +
    tr("Rim sweep ", "边缘间方位角 ") +
    angle +
    "  ·  " +
    tr("Launch angle ", "入射角 ") +
    ((Math.asin(b) * 180) / Math.PI).toFixed(1) +
    "°" +
    (isABC() ? "  ·  ρ(rim) = " + (1 / C).toFixed(3) : "");
  const apex = tr("Full inner sheet to the apex.", "内支可完整嵌入至极点。");
  const boundary =
    tr("Real sheet ends at", "真实曲面止于") +
    " r/R = " +
    shape.innerR.toPrecision(3) +
    tr(
      "; only the embeddable ray segment is lifted.",
      "；只投影可嵌入的光线段。",
    );
  const windowNote =
    tr("Infinite end cropped at", "无限端绘图截于") +
    " r/R = " +
    shape.innerR.toPrecision(3) +
    ".";
  byId("extent").textContent =
    { apex, boundary, window: windowNote }[shape.end] +
    (model.angle + 1e-9 < model.sweep
      ? tr(" Ray shown over a finite window.", " 光线仅显示有限区间。")
      : "");
  render();
}
function stop() {
  cancelAnimationFrame(frame);
  mode = "";
  last = 0;
  progress = 0;
  for (const id of ["sweep", "trace"])
    byId(id).setAttribute("aria-pressed", "false");
}
function tick(time) {
  const dt = last ? Math.min(0.1, (time - last) / 1000) : 0;
  last = time;
  if (mode === "sweep") {
    let B = Number(fields[0].dataset.sweepValue) + sweepDir * dt * 0.21;
    if (B >= 2 || B <= 0.25) {
      B = Math.max(0.25, Math.min(2, B));
      sweepDir *= -1;
    }
    fields[0].dataset.sweepValue = B;
    fields[0].value = B.toFixed(2);
    refresh();
  } else if (mode === "trace") {
    progress = (progress + dt / 6) % 1;
    render();
  }
  if (mode) frame = requestAnimationFrame(tick);
}
for (const id of ["sweep", "trace"])
  byId(id).addEventListener("click", () => {
    const start = mode !== id;
    stop();
    if (start) {
      mode = id;
      byId(id).setAttribute("aria-pressed", "true");
      fields[0].dataset.sweepValue = fields[0].value;
      sweepDir = fields[0].valueAsNumber === 2 ? -1 : 1;
      frame = requestAnimationFrame(tick);
    }
    render();
  });
for (const f of fields)
  f.addEventListener("input", () => {
    stop();
    refresh();
  });
byId("preset").addEventListener("change", (event) => {
  const values = currentPresets()[Number(event.target.value)][1];
  if (!values) return;
  stop();
  values.forEach((value, i) => {
    fields[i].value = value;
  });
  refresh();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stop();
    render();
  }
});
byId("family").addEventListener("change", () => {
  stop();
  setFamily();
  refresh();
});
setFamily();
new ResizeObserver(render).observe(byId("plane"));
refresh();
