/* qmentropy.com — the Lab
   A two-source interference field and a small menu. No dependencies. */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------------------------------------------------------- menu */
  const menuBtn = document.querySelector("[data-lab-menu]");
  const menu = document.getElementById("lab-menu");
  if (menuBtn && menu) {
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      const first = menu.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    };
    const close = () => {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    menuBtn.addEventListener("click", () => {
      menu.classList.contains("is-open") ? close() : open();
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) close();
    });
  }

  /* --------------------------------------------------------- field canvas */
  const canvas = document.querySelector("[data-field]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const slider = document.querySelector("[data-coherence]");
  const visibility = document.querySelector("[data-visibility]");
  const reset = document.querySelector("[data-reset]");
  const stage = canvas.parentElement;
  const W = 320;
  const H = 256;
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d", { willReadFrequently: true });
  const image = octx.createImageData(W, H);
  const data = image.data;

  const state = {
    gamma: 0.92,
    bx: 0.42,
    by: 0.02,
    dragging: false,
    idle: true,
    lastInteract: 0,
    visible: true,
    running: false,
    last: 0,
    phase: 0,
    width: 1,
    height: 1,
  };

  const stops = [
    [0.0, 7, 9, 11],
    [0.32, 9, 29, 35],
    [0.6, 16, 92, 105],
    [0.82, 96, 198, 216],
    [1.0, 238, 252, 255],
  ];

  function ramp(v) {
    for (let i = 1; i < stops.length; i++) {
      if (v <= stops[i][0]) {
        const a = stops[i - 1];
        const b = stops[i];
        const t = (v - a[0]) / (b[0] - a[0] || 1);
        return [
          Math.round(a[1] + (b[1] - a[1]) * t),
          Math.round(a[2] + (b[2] - a[2]) * t),
          Math.round(a[3] + (b[3] - a[3]) * t),
        ];
      }
    }
    return [238, 252, 255];
  }

  function fieldImage() {
    const g = state.gamma;
    const bx = state.bx;
    const by = state.by;
    const xmin = -1.05;
    const xmax = 1.05;
    const ymin = -0.84;
    const ymax = 0.84;
    const k = (2 * Math.PI) / 0.066;
    let index = 0;
    for (let py = 0; py < H; py++) {
      const wy = ymax - (py / (H - 1)) * (ymax - ymin);
      for (let px = 0; px < W; px++) {
        const wx = xmin + (px / (W - 1)) * (xmax - xmin);
        const r1 = Math.hypot(wx + 0.45, wy);
        const r2 = Math.hypot(wx - bx, wy - by);
        const a1 = 1 / Math.sqrt(r1 + 0.12);
        const a2 = 1 / Math.sqrt(r2 + 0.12);
        const phase = k * (r1 - r2);
        const denom = (a1 + a2) * (a1 + a2);
        let I = (a1 * a1 + g * g * a2 * a2 + 2 * g * a1 * a2 * Math.cos(phase)) / denom;
        I = Math.pow(clamp(I, 0, 1), 0.82);
        const c = ramp(I);
        data[index++] = c[0];
        data[index++] = c[1];
        data[index++] = c[2];
        data[index++] = 255;
      }
    }
    octx.putImageData(image, 0, 0);
  }

  function screen(wx, wy) {
    const xmin = -1.05;
    const xmax = 1.05;
    const ymin = -0.84;
    const ymax = 0.84;
    return [
      ((wx - xmin) / (xmax - xmin)) * state.width,
      (1 - (wy - ymin) / (ymax - ymin)) * state.height,
    ];
  }

  function drawSources() {
    const pts = [
      { x: -0.45, y: 0, label: "A" },
      { x: state.bx, y: state.by, label: "B" },
    ];
    for (const p of pts) {
      const [sx, sy] = screen(p.x, p.y);
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 28);
      glow.addColorStop(0, "rgba(127, 220, 242, 0.55)");
      glow.addColorStop(1, "rgba(127, 220, 242, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235, 252, 255, 0.95)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(127, 220, 242, 0.55)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.font = "9px ui-monospace, monospace";
      ctx.fillStyle = "rgba(237, 243, 245, 0.55)";
      ctx.fillText(p.label, sx + 9, sy - 9);
    }
  }

  function draw() {
    if (!state.width || !state.height) return;
    fieldImage();
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, state.width, state.height);
    const v = ctx.createRadialGradient(
      state.width * 0.5,
      state.height * 0.5,
      0,
      state.width * 0.5,
      state.height * 0.5,
      state.width * 0.75
    );
    v.addColorStop(0, "rgba(7, 9, 10, 0)");
    v.addColorStop(1, "rgba(7, 9, 10, 0.5)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, state.width, state.height);
    drawSources();
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.max(1, rect.width);
    state.height = Math.max(1, rect.height);
    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function setGamma(value) {
    state.gamma = clamp(value, 0, 1);
    if (slider) {
      slider.value = String(state.gamma);
      slider.style.setProperty("--p", `${state.gamma * 100}%`);
    }
    if (visibility) visibility.textContent = `V = ${state.gamma.toFixed(2)}`;
  }

  function loop(t) {
    if (!state.visible) {
      state.running = false;
      return;
    }
    state.running = true;
    if (!state.last) state.last = t;
    if (t - state.last > 38) {
      state.last = t;
      if (!state.dragging && state.idle && !reduced) {
        state.bx = 0.42 + 0.03 * Math.sin(t * 0.00035);
        state.by = 0.02 + 0.022 * Math.sin(t * 0.00052);
      }
      draw();
    }
    if (!reduced) window.requestAnimationFrame(loop);
  }

  if (slider) {
    setGamma(parseFloat(slider.value));
    slider.addEventListener("input", () => {
      setGamma(parseFloat(slider.value));
      draw();
    });
  } else {
    setGamma(state.gamma);
    if (visibility) visibility.textContent = `V = ${state.gamma.toFixed(2)}`;
  }

  if (reset) {
    reset.addEventListener("click", () => {
      state.bx = 0.42;
      state.by = 0.02;
      state.idle = true;
      setGamma(0.92);
      draw();
    });
  }

  let dragStart = null;
  canvas.addEventListener("pointerdown", (e) => {
    state.dragging = true;
    state.idle = false;
    state.lastInteract = performance.now();
    dragStart = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture?.(e.pointerId);
    canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!state.dragging) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    state.bx = clamp(-1.0 + x * 2.1, -0.65, 0.8);
    state.by = clamp(0.84 - y * 1.68, -0.55, 0.55);
    state.lastInteract = performance.now();
    draw();
  });
  const endDrag = () => {
    state.dragging = false;
    canvas.style.cursor = "crosshair";
    state.lastInteract = performance.now();
    window.setTimeout(() => {
      if (!state.dragging && performance.now() - state.lastInteract > 1800) state.idle = true;
    }, 1900);
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(stage);
  } else {
    window.addEventListener("resize", resize);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        state.visible = entries.some((entry) => entry.isIntersecting);
        if (state.visible && !reduced && !state.running) {
          state.last = 0;
          window.requestAnimationFrame(loop);
        }
      },
      { threshold: 0.02 }
    ).observe(canvas);
  }

  resize();
  setGamma(state.gamma);
  if (reduced) draw();
  else window.requestAnimationFrame(loop);
})();
