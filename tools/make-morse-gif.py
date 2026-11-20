"""Render the interactive model as a looping GIF (Node 22+, NumPy, Matplotlib, Pillow)."""
from io import BytesIO
import json
from pathlib import Path
import subprocess

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets/images/morse-geodesics.gif"
# The statically exported figure uses the exact model shipped to the browser.
sample = """
import {orbit,surface} from './assets/js/morse-model.js';
const frames=[];
for(let i=0;i<72;i++){
  const B=1-0.5*Math.cos(2*Math.PI*i/72), s=surface(B,0), ray=orbit(B,0.55,0);
  frames.push({B,sweep:ray.sweep,profile:s.profile.filter((_,j)=>j%8===0),
    ray:Array.from({length:321},(_,j)=>{const p=ray.at(j/320);
      return [p.r,p.phi,p.rho,s.height(p.x)];})});
}
console.log(JSON.stringify(frames));
"""
frames = json.loads(subprocess.check_output(
    ["node", "--input-type=module", "-e", sample], cwd=ROOT))
bg, muted, wire, amber = "#0c171b", "#aabfc1", "#365c64", "#ffbb74"
fig = plt.figure(figsize=(8.8, 4.6), dpi=105, facecolor=bg)
fig.text(0.045, 0.91, "Morse lens", color="white", size=24, fontfamily="DejaVu Serif")
fig.text(0.047, 0.845, "SHAPE SWEEP     /     b = 0.55     /     energy offset = 0", color=muted,
         size=9, fontfamily="DejaVu Sans Mono")
axes = [fig.add_axes([0.03, 0.12, 0.44, 0.58]), fig.add_axes([0.49, 0.12, 0.48, 0.58])]
for ax in axes:
    ax.set_aspect("equal")
    ax.axis("off")
axes[0].set(xlim=(-1.18, 1.18), ylim=(-1.18, 1.18))
tilt, yaw = 0.38, -0.52
zmax = max(frame["profile"][-1]["z"] for frame in frames)
axes[1].set(xlim=(-1.2, 1.2), ylim=(-0.49, zmax*np.cos(tilt)+0.15))
fig.text(0.25, 0.735, "Optical plane", ha="center", color="white", size=13)
fig.text(0.72, 0.735, "Geodesic surface", ha="center", color="white", size=13)
label = fig.text(0.047, 0.049, "", color=amber, size=10, fontfamily="DejaVu Sans Mono")
fig.text(0.96, 0.049, "qmentropy.com", color=muted, size=9, ha="right")
angle = np.linspace(0, 2*np.pi, 121)

def project(radius, phi, z):
    return np.column_stack((radius*np.cos(phi+yaw),
        radius*np.sin(phi+yaw)*np.sin(tilt)+z*np.cos(tilt)))

for radius in (0.25, 0.5, 0.75, 1):
    axes[0].plot(radius*np.cos(angle), radius*np.sin(angle), color=wire, lw=0.8)
left, = axes[0].plot([], [], color=amber, lw=2.1)
right, = axes[1].plot([], [], color=amber, lw=2.1, zorder=4)
mesh = LineCollection([], colors=wire, linewidths=0.65)
axes[1].add_collection(mesh)
axes[0].plot([1], [0], "o", color="white", ms=4)
axes[1].plot(*project(1, 0, 0).T, "o", color="white", ms=4, zorder=5)
images = []
for frame in frames:
    r, phi, rho, z = np.array(frame["ray"]).T
    left.set_data(r*np.cos(phi), r*np.sin(phi))
    right.set_data(*project(rho, phi, z).T)
    levels = frame["profile"]
    radii = np.array([p["rho"] for p in levels])
    heights = np.array([p["z"] for p in levels])
    rings = [project(p["rho"], angle, p["z"]) for p in levels[::5]]
    meridians = [project(radii, a, heights) for a in angle[:-1:6]]
    mesh.set_segments(rings+meridians)
    label.set_text(f'B = {frame["B"]:.3f}     Rim sweep = {np.degrees(frame["sweep"]):.1f}°')
    with BytesIO() as output:
        fig.savefig(output, format="png", facecolor=bg)
        with Image.open(output) as img:
            images.append(img.convert("RGB").quantize(colors=128, dither=Image.Dither.NONE))
images[0].save(DEST, save_all=True, append_images=images[1:], loop=0, duration=90, optimize=False)
plt.close(fig)
print(f"{len(images)} frames written to {DEST}")
