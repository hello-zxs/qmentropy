"""Export the parallel-beam experiment (Node 22+, NumPy, Matplotlib, Pillow)."""
import json
from pathlib import Path
import subprocess

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
from matplotlib.colors import to_rgb
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets/images/morse-geodesics.gif"
# Use the browser's ray paths, common optical clock and matched exterior.
SAMPLE = """
import { parallelBeam } from './assets/js/morse-beam.js';
const scenes=[],frames=[],cache=new Map();
const compact=p=>[p.x,p.y,p.u,p.v,p.z,p.length].map(x=>Number(x.toFixed(6)));
for(let i=0;i<320;i++){
  const cycle=i%160,first=i<160, flight=cycle<120;
  const progress=flight?cycle/119:1;
  const mix=flight?0:(1-Math.cos(Math.PI*(cycle-120)/39))/2;
  const B=first?.5+.5*mix:1-.5*mix;
  const key=B.toFixed(6);
  if(!cache.has(key)){
    const beam=parallelBeam({B,b:.82,count:12});
    const paths=beam.rays.map(ray=>ray.parts.flatMap((part,n)=>part.filter((p,j)=>
      (j!==0 || n===0) && (j%2===0 || j===part.length-1)).map(compact)));
    const profile=beam.shape.profile.filter((_,j)=>j%8===0).map(p=>[p.rho,p.z]);
    cache.set(key,{beam,index:scenes.length});
    scenes.push({paths,profile,B});
  }
  const {beam,index}=cache.get(key),t=progress*beam.length;
  const heads=beam.rays.map(r=>flight && t<=r.end.length+1e-8 ? compact(r.atLength(t)):null);
  frames.push({index,t,progress,flight,heads});
}
console.log(JSON.stringify({scenes,frames}));
"""
data=json.loads(subprocess.check_output(["node","--input-type=module","-e",SAMPLE],cwd=ROOT))
bg,muted,wire,amber,teal="#0c171b","#adc1c2","#35535b","#ffbf7d","#81dbe3"
fig=plt.figure(figsize=(9,4.6),dpi=100,facecolor=bg)
fig.text(.035,.90,"Morse lens",color="white",size=24,fontfamily="DejaVu Serif")
fig.text(.037,.837,"12 PARALLEL RAYS     /     BEAM HALF-WIDTH 0.82 R     /     ZERO ENERGY OFFSET",
         color=muted,size=9,fontfamily="DejaVu Sans Mono")
axes=[fig.add_axes([.015,.10,.48,.60]),fig.add_axes([.505,.10,.48,.60])]
for ax in axes:
    ax.set_aspect("equal")
    ax.axis("off")
axes[0].set(xlim=(-1.77,1.77),ylim=(-1.72,1.72))
peak=max(scene["profile"][-1][1] for scene in data["scenes"])
axes[1].set(xlim=(-1.85,1.85),ylim=(-.77,peak*np.cos(.38)+.14))
fig.text(.25,.73,"Optical plane",ha="center",color="white",size=13)
fig.text(.75,.73,"Geodesic surface",ha="center",color="white",size=13)
status=fig.text(.037,.052,"",color=amber,size=9,fontfamily="DejaVu Sans Mono")
fig.text(.96,.052,"qmentropy.com",color=muted,size=9,ha="right")
tilt,yaw=.38,-.52
def project(u,v,z):
    return np.column_stack((u*np.cos(yaw)-v*np.sin(yaw),
                            (u*np.sin(yaw)+v*np.cos(yaw))*np.sin(tilt)+z*np.cos(tilt)))
angle=np.linspace(0,2*np.pi,97)
for radius in (.25,.5,.75,1):
    axes[0].plot(radius*np.cos(angle),radius*np.sin(angle),color=wire,lw=.8)
mesh=LineCollection([],colors=wire,linewidths=.6)
axes[1].add_collection(mesh)
colors=[teal]*11+[amber]
guides=[];trails=[];dots=[]
for ax in axes:
    guide=LineCollection([],colors=["#2a4249"]*11+["#56493e"],linewidths=.7,zorder=2)
    trail=LineCollection([],colors=colors,linewidths=[.85]*11+[1.65],zorder=3)
    ax.add_collection(guide);ax.add_collection(trail)
    guides.append(guide);trails.append(trail)
    dots.append(ax.scatter([np.nan]*12,[np.nan]*12,s=[13]*11+[23],c=colors,zorder=4,linewidths=0))

# A stable palette preserves thin traces and lets a GIF encode only the
# changed pixels during each flight, rather than repainting quantized text.
ink=[muted,wire,amber,teal,"#ffffff","#2a4249","#56493e"]
colors_rgb=np.vstack([np.linspace(to_rgb(bg),to_rgb(c),32) for c in ink])
palette=Image.new("P",(1,1))
palette.putpalette(np.rint(colors_rgb*255).astype("uint8").ravel().tolist())
images=[]
last_index=None
for frame in data["frames"]:
    scene=data["scenes"][frame["index"]]
    if last_index!=frame["index"]:
        paths=[np.asarray(row) for row in scene["paths"]]
        lines=[[p[:,:2] for p in paths],[project(*p[:,2:5].T) for p in paths]]
        for guide,line in zip(guides,lines):
            guide.set_segments(line)
        radii,heights=np.asarray(scene["profile"]).T
        rings=[project(r*np.cos(angle),r*np.sin(angle),z) for r,z in zip(radii[::5],heights[::5])]
        meridians=[project(radii*np.cos(a),radii*np.sin(a),heights) for a in angle[:-1:6]]
        mesh.set_segments(rings+meridians)
        last_index=frame["index"]
    heads=np.array([h if h is not None else [np.nan]*6 for h in frame["heads"]])
    positions=[heads[:,:2],project(*heads[:,2:5].T)]
    for j,line in enumerate(lines):
        segments=[]
        for i,(xy,p) in enumerate(zip(line,paths)):
            if frame["flight"] and frame["t"]<p[-1,-1]:
                end=np.searchsorted(p[:,-1],frame["t"],side="right")
                segments.append(np.vstack([xy[:end],positions[j][i]]))
            else:
                segments.append(xy)
        trails[j].set_segments(segments)
        dots[j].set_offsets(positions[j])
    mode=f'Flight {frame["progress"]:4.0%}' if frame["flight"] else "Shape sweep"
    status.set_text(f'{mode}     B = {scene["B"]:.2f}')
    fig.canvas.draw()
    rgb=Image.fromarray(np.asarray(fig.canvas.buffer_rgba())[:,:,:3])
    images.append(rgb.quantize(palette=palette,dither=Image.Dither.NONE))
images[0].save(DEST,save_all=True,append_images=images[1:],loop=0,duration=100,optimize=False)
plt.close(fig)
print(f"{len(images)} frames, 32 seconds: {DEST}")
