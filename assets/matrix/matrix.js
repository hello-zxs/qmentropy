/* ==========================================================================
   THE MATRIX — portable three-site dock
   No dependencies. Injects the dock, marks the current site, and wires
   keyboard/outside-click behaviour. Include after matrix.css.
   ========================================================================== */
(() => {
  "use strict";

  const ROLES = [
    {
      id: "index",
      name: "Index",
      domain: "zhengxs.com",
      url: "https://zhengxs.com/",
      line: "The person, now. Research, field notes, selected work.",
    },
    {
      id: "lab",
      name: "Lab",
      domain: "qmentropy.com",
      url: "https://qmentropy.com/",
      line: "Instruments, papers and computations in light and geometry.",
    },
    {
      id: "record",
      name: "Record",
      domain: "zhengxiangsheng.com",
      url: "https://zhengxiangsheng.com/",
      line: "The formal academic record: CV, publications, timeline.",
    },
  ];

  const meta = document.querySelector('meta[name="matrix-site"]');
  const host = window.location.hostname.replace(/^www\./, "");
  const fromHost = host.includes("qmentropy")
    ? "lab"
    : host.includes("zhengxiangsheng")
    ? "record"
    : host.includes("zhengxs")
    ? "index"
    : "";
  const current = (meta && meta.content) || document.documentElement.dataset.matrix || fromHost || "index";

  const dock = document.createElement("div");
  dock.className = "mx-dock";
  dock.setAttribute("data-current", current);

  const dots = ROLES.map(
    (r) => `<i data-role="${r.id}"${r.id === current ? ' class="is-current"' : ""}></i>`
  ).join("");

  const items = ROLES.map((r) => {
    const here = r.id === current;
    return `<a class="mx-item${here ? " is-current" : ""}" data-site="${r.id}" href="${r.url}"${
      here ? ' aria-current="page"' : ""
    }>
      <i class="mx-dot" aria-hidden="true"></i>
      <span class="mx-item__main"><strong>${r.name}</strong><span class="mx-domain">${r.domain}</span></span>
      <span class="mx-here">${here ? "You are here" : ""}</span>
      <small>${r.line}</small>
    </a>`;
  }).join("");

  dock.innerHTML = `
    <button class="mx-btn" type="button" aria-expanded="false" aria-controls="mx-panel" aria-haspopup="dialog" title="The matrix — three sites, one practice">
      <span class="mx-dots" aria-hidden="true">${dots}</span>
      <span class="mx-label">${ROLES.find((r) => r.id === current)?.name || "Index"}</span>
      <span class="mx-chev" aria-hidden="true"></span>
    </button>
    <div class="mx-panel" id="mx-panel" role="dialog" aria-label="The matrix" aria-hidden="true">
      <div class="mx-panel__head"><strong>The matrix</strong><span>Three sites, one practice</span></div>
      ${items}
      <div class="mx-panel__foot">
        <a href="https://zhengxs.com/matrix/">About the matrix ↗</a>
        <span>Index · Lab · Record</span>
      </div>
    </div>`;

  document.body.appendChild(dock);

  const button = dock.querySelector(".mx-btn");
  const panel = dock.querySelector(".mx-panel");
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    dock.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    const first = panel.querySelector("a,button");
    if (first) first.focus({ preventScroll: true });
  };

  const close = (returnFocus = true) => {
    if (!dock.classList.contains("is-open")) return;
    dock.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    if (returnFocus && lastFocus) lastFocus.focus({ preventScroll: true });
  };

  button.addEventListener("click", () => {
    if (dock.classList.contains("is-open")) close();
    else open();
  });

  document.addEventListener("click", (e) => {
    if (!dock.contains(e.target)) close(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (!dock.classList.contains("is-open") || e.key !== "Tab") return;
    const focusables = Array.from(panel.querySelectorAll("a,button")).filter(
      (el) => el.offsetParent !== null
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // The dock steps aside for the footer (which carries the same links).
  const footer = document.querySelector("footer");
  if (footer && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        dock.classList.toggle("is-hidden", visible);
        if (visible) close(false);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );
    io.observe(footer);
  }

  // Mark the current site in any footer strip.
  document.querySelectorAll(".mx-strip a[data-site]").forEach((a) => {
    if (a.dataset.site === current) {
      a.classList.add("is-current");
      a.setAttribute("aria-current", "page");
    }
  });
})();
