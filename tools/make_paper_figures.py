"""Generate the figures used by the paper pages.

    python tools/make_paper_figures.py

Requires matplotlib (in addition to the Pillow/numpy used by make_assets.py).
Outputs:
    assets/images/paper-fig1.png  geodesic on a surface of revolution
    assets/images/paper-fig2.png  coordinate grid before/after a transformation
"""

from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images"

plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["Times New Roman", "DejaVu Serif"],
    "mathtext.fontset": "dejavuserif",
    "axes.edgecolor": "#cccccc",
})


def figure_surface() -> None:
    """A geodesic on a surface of revolution (schematic)."""
    R = 1.0
    rho = np.linspace(0, 0.98, 70)
    phi = np.linspace(0, 2 * np.pi, 140)
    rho_grid, phi_grid = np.meshgrid(rho, phi)
    z_grid = R - np.sqrt(R ** 2 - rho_grid ** 2)
    x_grid = rho_grid * np.cos(phi_grid)
    y_grid = rho_grid * np.sin(phi_grid)

    fig = plt.figure(figsize=(7.2, 4.1), dpi=300)
    ax = fig.add_subplot(111, projection="3d")
    ax.plot_wireframe(x_grid, y_grid, z_grid, rstride=5, cstride=5,
                      color="#b8b8b8", linewidth=0.45)

    theta = np.linspace(-1.15, 1.15, 240)
    ax.plot(R * np.sin(theta), np.zeros_like(theta), R * (1 - np.cos(theta)),
            color="#0b3d91", linewidth=2.6, zorder=10)

    ax.set_xlabel(r"$\rho\cos\varphi$", fontsize=11, labelpad=1)
    ax.set_ylabel(r"$\rho\sin\varphi$", fontsize=11, labelpad=1)
    ax.set_zlabel(r"$z$", fontsize=11, labelpad=1)
    ax.set_box_aspect((1, 1, 0.42))
    ax.view_init(elev=23, azim=-58)
    ax.set_xticks([-1, 0, 1])
    ax.set_yticks([-1, 0, 1])
    ax.set_zticks([0, 0.5, 1])
    ax.tick_params(labelsize=8, pad=0)
    ax.grid(False)

    for pane in (ax.xaxis.pane, ax.yaxis.pane, ax.zaxis.pane):
        pane.set_facecolor((1, 1, 1, 0))
        pane.set_edgecolor("#e2e2e2")

    fig.subplots_adjust(left=0, right=1, bottom=0.02, top=1)
    fig.savefig(OUT / "paper-fig1.png", dpi=300, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("  assets/images/paper-fig1.png")


def _warp(x, y, amp=0.55, sigma=0.75):
    dx, dy = x, y
    r = np.hypot(dx, dy)
    factor = 1.0 + amp * np.exp(-(r ** 2) / (2 * sigma ** 2))
    return dx * factor, dy * factor


def figure_grid() -> None:
    """A coordinate grid before and after a radial transformation."""
    fig, axes = plt.subplots(1, 2, figsize=(7.2, 3.4), dpi=300)

    for ax, warped in zip(axes, (False, True)):
        for x in np.linspace(-2, 2, 17):
            y = np.linspace(-2, 2, 240)
            xx = np.full_like(y, x)
            if warped:
                xx, yy = _warp(xx, y)
            else:
                yy = y
            ax.plot(xx, yy, color="#555555", linewidth=0.5)
        for y in np.linspace(-2, 2, 17):
            x = np.linspace(-2, 2, 240)
            yy = np.full_like(x, y)
            if warped:
                xx, yy = _warp(x, yy)
            else:
                xx = x
            ax.plot(xx, yy, color="#555555", linewidth=0.5)

        ax.set_xlim(-2.6, 2.6)
        ax.set_ylim(-2.6, 2.6)
        ax.set_aspect("equal")
        ax.axis("off")

    axes[0].set_title("(a) virtual space", fontsize=10, pad=6)
    axes[1].set_title("(b) transformed space", fontsize=10, pad=6)

    fig.subplots_adjust(left=0.02, right=0.98, top=0.9, bottom=0.04, wspace=0.04)
    fig.savefig(OUT / "paper-fig2.png", dpi=300, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("  assets/images/paper-fig2.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("Generating paper figures …")
    figure_surface()
    figure_grid()
    print("Done.")


if __name__ == "__main__":
    main()
