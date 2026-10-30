#!/usr/bin/env python3
"""Generate the raster artwork used by qmentropy.com.

Creates:
  assets/images/hero.png            homepage hero background (1600x900)
  assets/images/feature-to.png      "Transformation optics" card (800x450)
  assets/images/feature-lens.png    "Geodesic lenses" card (800x450)
  assets/images/feature-quantum.png "Quantum optics" card (800x450)
  assets/images/og.png              social sharing card (1200x630)
  assets/images/favicon-32.png      browser favicon
  assets/images/apple-touch-icon.png

Requires Pillow + numpy.  Run from the repository root:

    python tools/make_assets.py

The artwork is deterministic (fixed random seed), so re-running produces
byte-identical output.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images"
S = 2  # supersampling factor

NAVY_TOP = (7, 11, 22)
NAVY_BOTTOM = (14, 23, 44)
CYAN = (79, 195, 247)
TEAL = (38, 198, 218)
GOLD = (255, 213, 79)
INK = (236, 242, 255)
MUTED = (148, 163, 189)
GRID = (86, 132, 180)

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_SANS = FONT_DIR / "segoeui.ttf"
FONT_SANS_BOLD = FONT_DIR / "segoeuib.ttf"
FONT_SERIF_BOLD = FONT_DIR / "georgiab.ttf"


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def background(w: int, h: int) -> np.ndarray:
    """Vertical gradient as a float RGB array at supersampled resolution."""
    t = np.linspace(0.0, 1.0, h * S)[:, None]
    top = np.array(NAVY_TOP, dtype=np.float32)
    bottom = np.array(NAVY_BOTTOM, dtype=np.float32)
    row = top + (bottom - top) * t
    return np.repeat(row[:, None, :], w * S, axis=1)


def radial_glow(arr: np.ndarray, cx: float, cy: float, radius: float,
                colour: tuple[int, int, int], strength: float = 1.0,
                aspect: float = 1.0) -> None:
    """Additively blend a soft radial glow into a float RGB array."""
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d2 = ((xx - cx * S) / (radius * S)) ** 2 + ((yy - cy * S) / (radius * aspect * S)) ** 2
    g = np.exp(-d2 * 2.0) * strength
    for i in range(3):
        arr[..., i] = np.clip(arr[..., i] + g * colour[i], 0, 255)


def vignette(arr: np.ndarray, strength: float = 0.45) -> np.ndarray:
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / math.sqrt(2)
    v = 1.0 - strength * np.clip(d, 0, 1) ** 2
    return arr * v[..., None]


def to_image(arr: np.ndarray) -> Image.Image:
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def starfield(img: Image.Image, count: int, seed: int = 7,
              area: tuple[float, float, float, float] | None = None) -> None:
    """Draw faint stars (deterministic)."""
    rng = random.Random(seed)
    w, h = img.size
    x0, y0, x1, y1 = area or (0.0, 0.0, 1.0, 1.0)
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.uniform(x0, x1) * w
        y = rng.uniform(y0, y1) * h
        r = rng.choice([0.6, 0.7, 0.8, 1.0, 1.4]) * S
        a = rng.randint(18, 95)
        d.ellipse([x - r, y - r, x + r, y + r], fill=INK + (a,))
    img.alpha_composite(layer)


def warp_point(x: float, y: float, cx: float, cy: float,
               amp: float, sigma: float,
               twist: float = 0.0) -> tuple[float, float]:
    """Distort a point around (cx, cy) with a Gaussian falloff.

    ``amp`` pushes the grid radially outwards (the "empty well" of a
    gravitational lens); ``twist`` rotates it (frame dragging).  The grid is
    untouched far from the centre.
    """
    dx, dy = x - cx, y - cy
    r = math.hypot(dx, dy)
    if r < 1e-6:
        return x, y
    g = math.exp(-(r * r) / (2.0 * sigma * sigma))
    if twist:
        a = twist * g
        ca, sa = math.cos(a), math.sin(a)
        dx, dy = dx * ca - dy * sa, dx * sa + dy * ca
    push = amp * g
    return cx + dx * (1 + push / r), cy + dy * (1 + push / r)


def warped_grid(draw: ImageDraw.ImageDraw, w: int, h: int, spacing: float,
                cx: float, cy: float, amp: float, sigma: float,
                colour: tuple[int, int, int, int],
                major_colour: tuple[int, int, int, int] | None = None,
                width: int = 1, step: float = 6.0,
                twist: float = 0.0) -> None:
    """Draw a coordinate grid distorted by a lens at (cx, cy)."""
    major_colour = major_colour or colour
    idx = 0
    x = -spacing
    while x <= w + spacing:
        pts = [warp_point(x, y, cx, cy, amp, sigma, twist)
               for y in np.arange(-20, h + 21, step)]
        draw.line([(p[0] * S, p[1] * S) for p in pts],
                  fill=major_colour if idx % 5 == 0 else colour,
                  width=(width + 1) if idx % 5 == 0 else width)
        idx += 1
        x += spacing
    idx = 0
    y = -spacing
    while y <= h + spacing:
        pts = [warp_point(x, y, cx, cy, amp, sigma, twist)
               for x in np.arange(-20, w + 21, step)]
        draw.line([(p[0] * S, p[1] * S) for p in pts],
                  fill=major_colour if idx % 5 == 0 else colour,
                  width=(width + 1) if idx % 5 == 0 else width)
        idx += 1
        y += spacing


def glowing_ring(img: Image.Image, cx: float, cy: float, radius: float,
                 colour: tuple[int, int, int], blur: float = 16.0,
                 alpha: int = 150, width: int = 3) -> None:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    box = [(cx - radius) * S, (cy - radius) * S, (cx + radius) * S, (cy + radius) * S]
    d.ellipse(box, outline=colour + (alpha,), width=width * S)
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur * S)))
    # crisp core
    core = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(core).ellipse(box, outline=colour + (230,), width=max(1, S))
    img.alpha_composite(core)


def font(path: Path, size: float) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), int(size * S))


def tracked_text(draw: ImageDraw.ImageDraw, xy: tuple[float, float], text: str,
                 fnt: ImageFont.FreeTypeFont, fill: tuple[int, ...],
                 tracking: float = 0.0) -> None:
    x, y = xy[0] * S, xy[1] * S
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking * S


def finish(img: Image.Image, path: Path, size: tuple[int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    out = img.convert("RGB").resize(size, Image.LANCZOS)
    out.save(path, optimize=True)
    print(f"  {path.relative_to(ROOT)}  {out.size[0]}x{out.size[1]}  {path.stat().st_size / 1024:.1f} kB")


# --------------------------------------------------------------------------- #
# artwork
# --------------------------------------------------------------------------- #
def make_hero() -> None:
    w, h = 1600, 900
    arr = background(w, h)
    radial_glow(arr, 0.74 * w, 0.44 * h, 520, TEAL, 0.30, aspect=0.9)
    radial_glow(arr, 0.18 * w, 0.92 * h, 460, (40, 80, 160), 0.22)
    radial_glow(arr, 0.95 * w, 0.05 * h, 380, (30, 60, 120), 0.18)
    arr = vignette(arr, 0.5)
    img = to_image(arr)

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    cx, cy = 0.745 * w, 0.44 * h
    warped_grid(d, w, h, 52, cx, cy, 78, 195,
                GRID + (24,), GRID + (40,), width=1, step=6, twist=0.52)
    img.alpha_composite(overlay)

    starfield(img, 320, seed=11)

    # lensed ring + faint caustic arcs
    glowing_ring(img, cx, cy, 132, CYAN, blur=20, alpha=130, width=3)
    glowing_ring(img, cx, cy, 176, TEAL, blur=26, alpha=60, width=2)

    rays = Image.new("RGBA", img.size, (0, 0, 0, 0))
    rd = ImageDraw.Draw(rays)
    for offset, a in ((-150, 46), (-96, 60), (96, 60), (150, 46)):
        pts = []
        for t in np.linspace(0, 1, 120):
            x = 0.02 * w + t * 0.96 * w
            y = cy + offset * (1 - 0.55 * math.exp(-((x - cx) / 380.0) ** 2))
            pts.append((x * S, y * S))
        rd.line(pts, fill=CYAN + (a,), width=S, joint="curve")
    img.alpha_composite(rays.filter(ImageFilter.GaussianBlur(1.2 * S)))

    # keep the left third dark for the headline
    shade = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for i in range(int(0.62 * w)):
        a = int(120 * (1 - i / (0.62 * w)) ** 1.6)
        sd.line([(i * S, 0), (i * S, h * S)], fill=(4, 7, 15, a))
    img.alpha_composite(shade)

    finish(img, OUT / "hero.png", (w, h))


def make_feature_to() -> None:
    w, h = 800, 450
    arr = background(w, h)
    radial_glow(arr, w * 0.5, h * 0.5, 260, TEAL, 0.22)
    arr = vignette(arr, 0.35)
    img = to_image(arr)

    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    warped_grid(d, w, h, 40, w / 2, h / 2, 52, 95, GRID + (55,), CYAN + (85,), width=1, step=4)
    img.alpha_composite(layer)

    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    r = 74
    gd.ellipse([(w / 2 - r) * S, (h / 2 - r) * S, (w / 2 + r) * S, (h / 2 + r) * S],
               outline=CYAN + (220,), width=2 * S)
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(6 * S)))
    core = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(core).ellipse(
        [(w / 2 - r) * S, (h / 2 - r) * S, (w / 2 + r) * S, (h / 2 + r) * S],
        outline=CYAN + (240,), width=S)
    img.alpha_composite(core)
    finish(img, OUT / "feature-to.png", (w, h))


def make_feature_lens() -> None:
    w, h = 800, 450
    arr = background(w, h)
    radial_glow(arr, w * 0.75, h * 0.5, 220, GOLD, 0.10)
    arr = vignette(arr, 0.35)
    img = to_image(arr)

    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # optical axis
    d.line([(20 * S, 225 * S), (780 * S, 225 * S)], fill=GRID + (45,), width=S)

    # plan-convex lens profile
    left = 250
    top, bottom = 118, 332
    curve = []
    for t in np.linspace(-1, 1, 80):
        y = 225 + t * (bottom - 225)
        x = 250 + 150 * math.sqrt(max(0.0, 1 - t * t * 0.92))
        curve.append((x, y))
    poly = [(left, top)] + curve + [(left, bottom)]
    d.polygon([(p[0] * S, p[1] * S) for p in poly], fill=(79, 195, 247, 26))
    d.line([(p[0] * S, p[1] * S) for p in poly] + [(left * S, top * S)],
           fill=CYAN + (190,), width=2 * S, joint="curve")

    focus = (610.0, 225.0)
    heights = np.linspace(150, 300, 7)
    for y in heights:
        # exit point on the curved surface at this height
        t = (y - 225) / (bottom - 225)
        ex = 250 + 150 * math.sqrt(max(0.0, 1 - t * t * 0.92))
        d.line([(40 * S, y * S), (left * S, y * S)], fill=INK + (110,), width=S)
        d.line([(left * S, y * S), (ex * S, y * S)], fill=CYAN + (110,), width=S)
        d.line([(ex * S, y * S), (focus[0] * S, focus[1] * S)], fill=GOLD + (150,), width=S)
        # out through the focus, diverging
        dx, dy = focus[0] - ex, focus[1] - y
        d.line([(focus[0] * S, focus[1] * S), ((focus[0] + dx * 0.55) * S, (focus[1] + dy * 0.55) * S)],
               fill=GOLD + (95,), width=S)

    img.alpha_composite(layer)

    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse(
        [(focus[0] - 16) * S, (focus[1] - 16) * S, (focus[0] + 16) * S, (focus[1] + 16) * S],
        fill=GOLD + (210,))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(9 * S)))

    finish(img, OUT / "feature-lens.png", (w, h))


def make_feature_quantum() -> None:
    w, h = 800, 450
    arr = background(w, h)
    radial_glow(arr, w * 0.55, h * 0.5, 280, CYAN, 0.16)
    arr = vignette(arr, 0.35)
    img = to_image(arr)

    barrier_x = 300
    slits = (196, 254)

    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # barrier with two slits
    segments = [(0, slits[0] - 9), (slits[0] + 9, slits[1] - 9), (slits[1] + 9, h)]
    for y0, y1 in segments:
        d.line([(barrier_x * S, y0 * S), (barrier_x * S, y1 * S)], fill=INK + (120,), width=3 * S)

    # incoming plane wavefronts
    for x in range(40, barrier_x - 10, 26):
        d.line([(x * S, 30 * S), (x * S, (h - 30) * S)], fill=CYAN + (34,), width=S)

    # circular wavefronts from each slit (their overlap is the interference pattern)
    for slit_y in slits:
        for k in range(1, 17):
            r = 18 * k
            box = [(barrier_x - r) * S, (slit_y - r) * S, (barrier_x + r) * S, (slit_y + r) * S]
            # clip to the right of the barrier by drawing an arc
            d.arc(box, start=-75, end=75, fill=TEAL + (34,), width=S)

    # highlight the slits
    for slit_y in slits:
        d.ellipse([(barrier_x - 2.5) * S, (slit_y - 2.5) * S,
                   (barrier_x + 2.5) * S, (slit_y + 2.5) * S], fill=GOLD + (230,))

    img.alpha_composite(layer)

    # subtle vignette on the right where the pattern gets dense
    finish(img, OUT / "feature-quantum.png", (w, h))


def make_og() -> None:
    w, h = 1200, 630
    arr = background(w, h)
    radial_glow(arr, 0.86 * w, 0.42 * h, 360, TEAL, 0.26)
    radial_glow(arr, 0.1 * w, 0.95 * h, 330, (40, 80, 160), 0.2)
    arr = vignette(arr, 0.4)
    img = to_image(arr)

    grid = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    warped_grid(gd, w, h, 64, 0.865 * w, 0.44 * h, 40, 150,
                GRID + (16,), GRID + (24,), width=1, step=8)
    img.alpha_composite(grid)

    starfield(img, 140, seed=5, area=(0.45, 0.0, 1.0, 1.0))
    glowing_ring(img, 0.865 * w, 0.44 * h, 118, CYAN, blur=18, alpha=120, width=3)

    # left-to-right shade so the type stays legible
    shade = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for i in range(int(0.78 * w)):
        a = int(150 * (1 - i / (0.78 * w)) ** 1.5)
        sd.line([(i * S, 0), (i * S, h * S)], fill=(4, 7, 15, a))
    img.alpha_composite(shade)

    d = ImageDraw.Draw(img)
    # kicker
    tracked_text(d, (84, 118), "PHYSICS  ·  TRANSFORMATION OPTICS", font(FONT_SANS, 19),
                 CYAN + (225,), tracking=2.2)
    # name
    d.text((82 * S, 168 * S), "Zheng Xiangsheng", font=font(FONT_SERIF_BOLD, 66), fill=INK + (255,))
    # accent rule
    d.line([(84 * S, 282 * S), (232 * S, 282 * S)], fill=CYAN + (220,), width=3 * S)
    # site title
    d.text((84 * S, 312 * S), "Physics Lab Notes", font=font(FONT_SANS_BOLD, 40), fill=(214, 233, 255, 255))
    # tagline
    d.text((84 * S, 384 * S), "Geodesic lenses · Transformation optics · Quantum optics",
           font=font(FONT_SANS, 23), fill=MUTED + (255,))
    # url
    d.text((84 * S, 520 * S), "qmentropy.com", font=font(FONT_SANS, 21), fill=(120, 190, 230, 255))

    finish(img, OUT / "og.png", (w, h))


def make_icons() -> None:
    big = 512  # render once, downscale to both icon sizes
    yy, xx = np.mgrid[0:big, 0:big]
    t = (yy / (big - 1)).astype(np.float32)
    top = np.array(NAVY_TOP, dtype=np.float32)
    bottom = np.array((18, 34, 64), dtype=np.float32)
    arr = top + (bottom - top) * t[..., None]
    d2 = ((xx - big / 2) / (big * 0.42)) ** 2 + ((yy - big / 2) / (big * 0.42)) ** 2
    glow = np.exp(-d2 * 2.0) * 0.95
    for i in range(3):
        arr[..., i] = np.clip(arr[..., i] + glow * TEAL[i], 0, 255)
    img = to_image(np.clip(arr, 0, 255))

    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, big - 1, big - 1],
                                           radius=int(big * 0.22), fill=255)
    icon = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    icon.paste(img, (0, 0), mask)

    c = big / 2
    rx, ry = big * 0.33, big * 0.125
    for angle in (0, 60, 120):
        ellipse = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        ImageDraw.Draw(ellipse).ellipse([c - rx, c - ry, c + rx, c + ry],
                                        outline=CYAN + (240,),
                                        width=max(3, int(big * 0.020)))
        icon.alpha_composite(ellipse.rotate(angle, resample=Image.BICUBIC, center=(c, c)))
    r = big * 0.056
    ImageDraw.Draw(icon).ellipse([c - r, c - r, c + r, c + r], fill=GOLD + (255,))

    for size, name in ((180, "apple-touch-icon.png"), (32, "favicon-32.png")):
        icon.resize((size, size), Image.LANCZOS).convert("RGB").save(OUT / name, optimize=True)
        print(f"  assets/images/{name}  {size}x{size}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("Generating artwork …")
    make_hero()
    make_feature_to()
    make_feature_lens()
    make_feature_quantum()
    make_og()
    make_icons()
    print("Done.")


if __name__ == "__main__":
    main()
