"""Export one optical period of the Morse-cap Zoll lens (Node 22+, NumPy, Matplotlib, Pillow)."""
import json
from pathlib import Path
import subprocess

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import to_rgb
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = """
import {closedSurface, closedOrbit} from './assets/js/morse-closed-model.js';
const h = closedSurface(1), theta = Array.from({length:181}, (_,i)=>Math.PI*i/180);
const rays = Array.from({length:7}, (_,i)=>closedOrbit(Math.sin(i*Math.PI/12),1,h)
  .map(p=>[p.x,p.y,p.z,p.distance]));
console.log(JSON.stringify({z:theta.map(h),rays}));
"""
data = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", source], cwd=root))
rays = np.asarray(data["rays"])
tau = 2 * np.pi
theta = np.linspace(0, np.pi, len(data["z"]))
rho, z = np.sin(theta), np.asarray(data["z"])
bg, grid, ink, cyan, gold = "#101e22", "#3c585e", "#d4e1df", "#80def0", "#ffbc77"
fig = plt.figure(figsize=(8.8, 4.5), dpi=100, facecolor=bg)
fig.text(.04, .90, "A closed lens with a Morse cap", size=24, family="DejaVu Serif", color=ink)
fig.text(.04, .83, "7 equatorial launch directions, 0° to 90°    ·    λ = 1    ·    c = 0.5", size=11, color=ink)
surface = fig.add_axes([.035, .12, .44, .64], aspect="equal", xlim=(-1.2, 1.2), ylim=(-1.43, 1.08))
surface.axis("off")
chart = fig.add_axes([.57, .23, .38, .48], facecolor=bg)
chart.set(xlim=(0, 1), ylim=(-.05, 2.5), xticks=[0, .25, .5, .75, 1], yticks=[0, 1, 2])
chart.tick_params(colors=ink)
for spine in chart.spines.values():
    spine.set_color(grid)
chart.set(xlabel="Fraction of one optical period")
chart.xaxis.label.set_color(ink)
chart.set_title("Distance from launch / a", color=ink, loc="left", fontsize=12)
chart.grid(color=grid, alpha=.45)
fig.text(.57, .096, "Straight-line distance in 3D", color=ink, fontsize=9)
status = fig.text(.04, .055, "", color=gold, family="DejaVu Sans Mono", fontsize=10)

def project(x, y, z):
    return 0.55*x + 0.835*y, 0.97*z - 0.24*(0.835*x - 0.55*y)

phi = np.linspace(0, tau, 121)
for j in range(15, 180, 15):
    col = cyan if j == 60 else grid
    surface.plot(*project(rho[j]*np.cos(phi), rho[j]*np.sin(phi), z[j]), color=col, lw=.6)
for angle in phi[:-1:8]:
    surface.plot(*project(rho*np.cos(angle), rho*np.sin(angle), z), color=grid, lw=.6)
surface.plot(*project(1, 0, 0), marker="o", ms=8, mfc="none", mec=ink, zorder=6)

fractions = np.linspace(0, 1, 241)
dist = tau*fractions
tracks = []
for i, ray in enumerate(rays):
    x, y, zpos = [np.interp(dist, ray[:, 3], col) for col in ray[:, :3].T]
    px, py = project(x, y, zpos)
    separation = np.sqrt((x-1)**2 + y*y + zpos*zpos)
    color = gold if i == 3 else cyan
    width = 2.0 if i == 3 else .95
    for ax, xx, yy in [(surface, px, py), (chart, fractions, separation)]:
        ax.plot(xx, yy, color=grid, lw=.7)
        line, = ax.plot([], [], color=color, lw=width, zorder=4 if i == 3 else 3)
        dot, = ax.plot([], [], "o", ms=4, color=color, zorder=5)
        tracks.append((line, dot, xx, yy))

palette = Image.new("P", (1, 1))
colors = np.vstack([np.linspace(to_rgb(bg), to_rgb(col), 48) for col in [grid, ink, cyan, gold]])
palette.putpalette(np.rint(colors*255).astype("uint8").ravel().tolist())
frames = []
for j, phase in enumerate(fractions):
    for line, dot, xx, yy in tracks:
        line.set_data(xx[:j+1], yy[:j+1])
        dot.set_data(xx[j:j+1], yy[j:j+1])
    status.set_text(f"Optical length / a   {tau*phase:5.3f} / 2π")
    fig.canvas.draw()
    rgb = Image.fromarray(np.asarray(fig.canvas.buffer_rgba())[:, :, :3])
    frames.append(rgb.quantize(palette=palette, dither=Image.Dither.NONE))
dest = root / "assets/images/closed-morse-geodesics.gif"
frames[0].save(dest, save_all=True, append_images=frames[1:], duration=[100]*240+[1500],
               optimize=False, loop=0)
plt.close(fig)
print(dest)
