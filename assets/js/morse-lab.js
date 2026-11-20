import { parallelBeam } from "./morse-beam.js";

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
  ["Luneburg", [0.5, 0.82, 0]],
  ["Eaton", [1, 0.82, 0]],
  [tr("Intermediate Morse", "中间 Morse 剖面"), [0.75, 0.82, 0]],
  [tr("Partial surface", "部分曲面"), [0.3, 0.35, 0]],
  [tr("Critical ray", "临界光线"), [0.8, 0.6, 0.5625]],
  [tr("Open ray", "开放光线"), [0.7, 0.3, 0.5]],
];
const abcPresets = [
  [tr("Custom", "自定义"), null],
  ["Luneburg", [0.5, 0.82, 0, 0.5, 1]],
  ["Eaton", [1, 0.82, 0, 1, 1]],
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
let beam,
  geometry,
  mode = "",
  tracing = false,
  progress = 0,
  last = 0,
  frame = 0,
  sweepDir = 1;
const tau = 2 * Math.PI;
const samples = (count, fn) =>
  Array.from({ length: count + 1 }, (_, i) => fn(i / count));
function canvasView(id) {
  const canvas = byId(id),
    { width: w, height: h } = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const background = document.createElement("canvas");
  canvas.width = background.width = Math.round(w * dpr);
  canvas.height = background.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d"),
    grid = background.getContext("2d");
  for (const c of [ctx, grid]) {
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.lineJoin = "round";
    c.lineCap = "round";
  }
  return { w, h, ctx, grid, background };
}
function pathOf(points) {
  const path = new Path2D();
  let start = true;
  for (const point of points) {
    if (!point) {
      start = true;
      continue;
    }
    if (start) path.moveTo(point[0], point[1]);
    else path.lineTo(point[0], point[1]);
    start = false;
  }
  return path;
}
function stroke(ctx, path, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke(path);
}
function dot(ctx, point, color, size) {
  if (!point) return;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point[0], point[1], size, 0, tau);
  ctx.fill();
}
function buildViews() {
  const p = canvasView("plane"),
    s = canvasView("surface");
  const unit = Math.min(0.285 * p.w, 0.29 * p.h);
  p.project = (pt) => [p.w / 2 + unit * pt.x, p.h / 2 - unit * pt.y];
  const flat = (x, y) => p.project({ x, y });
  stroke(p.grid, pathOf([flat(-1.7, 0), flat(1.7, 0)]), "#31484d");
  stroke(p.grid, pathOf([flat(0, -1.4), flat(0, 1.4)]), "#31484d");
  for (const r of [0.25, 0.5, 0.75, 1])
    stroke(
      p.grid,
      pathOf(
        samples(100, (t) => flat(r * Math.cos(t * tau), r * Math.sin(t * tau))),
      ),
      r === 1 ? "#79979a" : "#2e454a",
    );
  const tilt = 0.38,
    yaw = -0.52,
    profile = beam.shape.profile,
    rim = profile[0].rho;
  const low = -1.85 * rim * Math.sin(tilt),
    high = Math.max(-low, beam.shape.z * Math.cos(tilt) + rim * Math.sin(tilt));
  const scale = Math.min((0.26 * s.w) / rim, (0.84 * s.h) / (high - low));
  function project(u, v, z) {
    return [
      s.w / 2 + scale * (u * Math.cos(yaw) - v * Math.sin(yaw)),
      s.h / 2 -
        scale *
          (z * Math.cos(tilt) +
            (u * Math.sin(yaw) + v * Math.cos(yaw)) * Math.sin(tilt) -
            (high + low) / 2),
    ];
  }
  s.project = (pt) => (pt.z === null ? null : project(pt.u, pt.v, pt.z));
  const polar = (l, phi) =>
    project(l.rho * Math.cos(phi), l.rho * Math.sin(phi), l.z);
  const ring = (l, color, width) =>
    stroke(s.grid, pathOf(samples(96, (t) => polar(l, t * tau))), color, width);
  for (let i = 0; i <= 12; i++)
    ring(profile[Math.round((i * (profile.length - 1)) / 12)], "#37565c", 0.9);
  const meridian = profile.filter(
    (_, i) => i % 8 === 0 || i === profile.length - 1,
  );
  for (let i = 0; i < 24; i++)
    stroke(
      s.grid,
      pathOf(meridian.map((l) => polar(l, (i * tau) / 24))),
      "#304a50",
    );
  ring(profile[0], "#79979a", 1.15);
  if (beam.shape.end === "boundary") {
    s.grid.setLineDash([4, 4]);
    ring(profile.at(-1), "#80def0", 1.7);
    s.grid.setLineDash([]);
  }
  stroke(
    s.grid,
    pathOf([
      [12, s.h - 14],
      [12 + 0.25 * scale, s.h - 14],
    ]),
    "#adc1c2",
    1.3,
  );
  s.grid.font = "11px system-ui";
  s.grid.fillStyle = "#adc1c2";
  s.grid.fillText("0.25", 12, s.h - 19);
  for (const view of [p, s]) {
    view.tracks = beam.rays.map((ray) =>
      ray.parts.map((part) => {
        const vertices = part.map(view.project);
        return { vertices, path: pathOf(vertices), points: part };
      }),
    );
  }
  return [p, s];
}
function render() {
  if (!beam) return;
  geometry ??= buildViews();
  const t = progress * beam.length;
  const heads = tracing ? beam.rays.map((ray) => ray.atLength(t)) : [];
  for (const view of geometry) {
    const { ctx, w, h, tracks } = view;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(view.background, 0, 0, w, h);
    tracks.forEach((parts, i) => {
      const ray = beam.rays[i],
        reference = ray === beam.reference;
      const color = reference ? "#ffc181" : "#80dce4",
        width = reference ? 2.3 : 1.15;
      for (const part of parts) {
        stroke(
          ctx,
          part.path,
          tracing ? (reference ? "#65503e" : "#30474c") : color,
          width,
        );
        if (!tracing || t <= part.points[0].length) continue;
        if (t >= part.points.at(-1).length) {
          stroke(ctx, part.path, color, width);
          continue;
        }
        const end = part.points.findIndex((pt) => pt.length >= t);
        const drawn = part.vertices.slice(0, end);
        drawn.push(view.project(heads[i]));
        stroke(ctx, pathOf(drawn), color, width);
      }
      if (reference) dot(ctx, view.project(ray.entry), "#fff", 3.2);
    });
    if (tracing)
      beam.rays.forEach((ray, i) => {
        if (t <= ray.end.length + 1e-8)
          dot(
            ctx,
            view.project(heads[i]),
            ray === beam.reference ? "#fff1cc" : "#b1f4f6",
            ray === beam.reference ? 4.8 : 3.2,
          );
      });
  }
}
function refresh() {
  const [B, b, energy, A, C] = fields.map((f) => f.valueAsNumber);
  for (const f of fields)
    byId(f.id + "-out").value =
      f.id === "energy" ? String(f.valueAsNumber) : f.valueAsNumber.toFixed(2);
  beam = parallelBeam({
    family: byId("family").value,
    B,
    b,
    energy,
    A,
    C,
    count: Number(byId("count").value),
  });
  const {
    shape,
    reference: { model },
  } = beam;
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
  const returning = beam.rays.filter(
    (r) => r.model.kind === "returning",
  ).length;
  byId("readout").textContent =
    tr("Reference: ", "参考光线：") +
    kind[model.kind] +
    " · " +
    tr("Rim sweep ", "边缘间方位角 ") +
    angle +
    " · " +
    tr("Launch angle ", "入射角 ") +
    ((Math.asin(b) * 180) / Math.PI).toFixed(1) +
    "° · " +
    tr("Returning ", "返回 ") +
    returning +
    "/" +
    beam.rays.length +
    (isABC() ? " · ρ(rim) = " + (1 / C).toFixed(3) : "");
  const apex = tr("Full inner sheet to the apex.", "内支可完整嵌入至极点。");
  const boundary =
    tr("Real sheet ends at", "真实曲面止于") +
    " r/R = " +
    shape.innerR.toPrecision(3) +
    tr(". Only embeddable segments are lifted.", "；只显示可嵌入的曲面段。");
  const windowNote =
    tr("Infinite end cropped at", "无限端绘图截于") +
    " r/R = " +
    shape.innerR.toPrecision(3) +
    ".";
  byId("extent").textContent =
    { apex, boundary, window: windowNote }[shape.end] +
    (returning < beam.rays.length
      ? tr(
          " Open and critical paths end at the plotting limit.",
          " 开放与临界光线显示至绘图边界。",
        )
      : "") +
    (beam.rays.some((r) => r.condensed)
      ? tr(
          " Intervening high-winding strokes are omitted; their travel time is included.",
          " 密集绕行段省略连线，保留传播时间。",
        )
      : "");
  geometry = null;
  render();
}
function setProgress(value) {
  progress = Math.max(0, Math.min(1, value));
  byId("progress").value = Math.round(progress * 1000);
  byId("percent").value = Math.round(progress * 100) + "%";
  byId("progress").setAttribute("aria-valuetext", byId("percent").value);
}
function setButtons() {
  for (const id of ["sweep", "trace"])
    byId(id).setAttribute("aria-pressed", String(mode === id));
  byId("trace").textContent =
    mode === "trace"
      ? tr("Pause beam", "暂停光束")
      : progress >= 1
        ? tr("Replay beam", "重播光束")
        : tracing && progress > 0
          ? tr("Resume beam", "继续播放")
          : tr("Play beam", "播放光束");
}
function pause() {
  cancelAnimationFrame(frame);
  mode = "";
  last = 0;
  setButtons();
}
function reset() {
  pause();
  tracing = false;
  setProgress(0);
  setButtons();
}
function tick(time) {
  const dt = last ? (time - last) / 1000 : 0;
  last = time;
  if (mode === "sweep") {
    let B =
      Number(fields[0].dataset.sweepValue) +
      sweepDir * Math.min(dt, 0.1) * 0.15;
    if (B >= 2 || B <= 0.25) {
      B = Math.max(0.25, Math.min(2, B));
      sweepDir *= -1;
    }
    fields[0].dataset.sweepValue = B;
    if (fields[0].valueAsNumber !== Number(B.toFixed(2))) {
      fields[0].value = B.toFixed(2);
      refresh();
    }
  } else if (mode === "trace") {
    setProgress(progress + dt / Number(byId("duration").value));
    render();
    if (progress >= 1) pause();
  }
  if (mode) frame = requestAnimationFrame(tick);
}
byId("trace").addEventListener("click", () => {
  const active = mode === "trace";
  pause();
  if (active) return;
  if (progress >= 1) setProgress(0);
  tracing = true;
  mode = "trace";
  setButtons();
  render();
  frame = requestAnimationFrame(tick);
});
byId("sweep").addEventListener("click", () => {
  const start = mode !== "sweep";
  reset();
  if (start) {
    mode = "sweep";
    fields[0].dataset.sweepValue = fields[0].value;
    sweepDir = fields[0].valueAsNumber === 2 ? -1 : 1;
    frame = requestAnimationFrame(tick);
  }
  setButtons();
  render();
});
byId("progress").addEventListener("input", () => {
  pause();
  tracing = true;
  setProgress(Number(byId("progress").value) / 1000);
  setButtons();
  render();
});
for (const f of [...fields, byId("count")])
  f.addEventListener("input", () => {
    reset();
    refresh();
  });
byId("preset").addEventListener("change", (event) => {
  const values = currentPresets()[Number(event.target.value)][1];
  if (!values) return;
  reset();
  values.forEach((v, i) => {
    fields[i].value = v;
  });
  refresh();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
byId("family").addEventListener("change", () => {
  reset();
  setFamily();
  refresh();
});
setFamily();
setButtons();
new ResizeObserver(() => {
  geometry = null;
  render();
}).observe(byId("plane"));
refresh();
