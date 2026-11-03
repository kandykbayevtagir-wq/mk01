#!/usr/bin/env python3
"""
Brand assets derived from the owner's original logo — nothing is redrawn.

  python3 scripts/generate-brand.py

Source of truth: brand/podology-logo-original.png (raster, 1254×1254,
black #0f0f0f + grey #7e7e7d on white). It is a flat raster, so every variant is
a crop / tone-to-transparency conversion of those pixels:

  logo-full(-light).png     full lockup, transparent (dark ink / white ink)
  logo-compact(-light).png  the PODOLOGY wordmark line only (mobile header)
  logo-symbol.png           the foot-in-circle mark
  logo-square.png           the original, 512 px square on white (schema.org Organization logo)
  src/app/{favicon.ico,icon.png,apple-icon.png}, public/icons/*  favicons / home-screen icons

Tone → transparency: alpha = (254 − L) / (254 − 15). Over white this reproduces
the original pixel for pixel, and any other background simply shows through.
Symbol sizes above the 140 px source are upsampled 4×, edge-sharpened (a contrast
curve on the anti-aliasing only — geometry is unchanged) and area-averaged down.
Requires: Pillow, numpy.
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand/podology-logo-original.png"
OUT = ROOT / "public/brand"
ICONS = ROOT / "public/icons"
APP = ROOT / "src/app"

BG, INK, GREY = 254.0, 15.0, 126.0
PAPER = (255, 255, 255)  # site background (--color-paper)

rgb = np.asarray(Image.open(SRC).convert("RGB"), dtype=np.float32)
L = rgb.mean(2)
alpha = np.clip((BG - L) / (BG - INK), 0, 1)
alpha[alpha < 0.03] = 0  # scanner / JPEG haze around the ink

# --- locate the parts (no hard-coded coordinates) ---------------------------
ys, xs = np.where(alpha > 0.5)
full = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
rows = np.where((alpha > 0.5).any(1))[0]
gap = next(i for i in range(len(rows) - 1) if rows[i + 1] - rows[i] > 8)
wm_y1 = rows[gap] + 1  # end of the PODOLOGY line
compact = (full[0], full[1], full[2], wm_y1)

line = alpha[full[1]:wm_y1]
cols = np.where((line > 0.5).any(0))[0]
runs, s, p = [], cols[0], cols[0]
for c in cols[1:]:
    if c - p > 3:
        runs.append((s, p)); s = c
    p = c
runs.append((s, p))
grey_frac = lambda r: ((L[full[1]:wm_y1, r[0]:r[1] + 1] > 90) & (L[full[1]:wm_y1, r[0]:r[1] + 1] < 170)).mean()
cx0, cx1 = max(runs, key=grey_frac)  # the foot circle = the greyest column run
# Radius at 50 % edge coverage (so the anti-aliased rim is inside the circle, not cropped).
cover = np.clip((BG - L) / (BG - GREY), 0, 1)
win = cover[full[1] - 2:wm_y1 + 2, cx0 - 3:cx1 + 4] >= 0.5
cyw, cxw = np.where(win)
R = ((cxw.max() - cxw.min() + 1) + (cyw.max() - cyw.min() + 1)) / 4.0
CX = cx0 - 3 + (cxw.min() + cxw.max() + 1) / 2.0
CY = full[1] - 2 + (cyw.min() + cyw.max() + 1) / 2.0
print(f"lockup {full}  wordmark rows to {wm_y1}  circle centre ({CX:.1f},{CY:.1f}) R={R:.1f}")


def ink(box, color, width):
    x0, y0, x1, y1 = box
    m = 2  # keep the anti-aliased edge
    a = alpha[y0 - m:y1 + m, x0 - m:x1 + m]
    img = Image.fromarray((a * 255 + 0.5).astype("uint8"), "L")
    h = round(width * img.height / img.width)
    a2 = img.resize((width, h), Image.LANCZOS)
    out = Image.new("RGBA", (width, h), color + (0,))
    out.putalpha(a2)
    return out


def indexed(img, levels=64):
    """Same pixels, ~6× smaller file: one ink colour, alpha in `levels` exact steps
    (error ≤ half a step ≈ 0.8 %) stored as an indexed PNG with a transparency table."""
    a = np.asarray(img.getchannel("A")).astype(float)
    idx = np.round(a / 255 * (levels - 1)).astype("uint8")
    r, g, b, _ = img.getpixel((0, 0))
    out = Image.fromarray(idx, "P")
    out.putpalette([r, g, b] * levels)
    out.info["transparency"] = bytes(int(round(i / (levels - 1) * 255)) for i in range(levels))
    return out


def symbol(diameter):
    """Foot-in-circle, exactly `diameter` px, transparent outside the circle."""
    k = 4
    side = int(2 * R + 8)
    x0, y0 = int(round(CX - side / 2)), int(round(CY - side / 2))
    sub = L[y0:y0 + side, x0:x0 + side]
    yy, xx = np.mgrid[0:side, 0:side]
    r = np.hypot(xx + x0 + 0.5 - CX, yy + y0 + 0.5 - CY)
    ring = np.clip((BG - sub) / (BG - GREY), 0, 1)
    a = np.where(r <= R - 1.5, 1.0, np.where(r <= R + 2.5, ring, 0.0))
    foot = np.where(r <= R - 1.5, np.clip((sub - GREY) / (BG - GREY), 0, 1), 0.0)

    # Upsample both layers, then fit the output to the *rendered* circle's bounding
    # box (centred, exactly `diameter` wide) — no reliance on estimated geometry.
    S = max(diameter, 256) * k
    scale = S / (2 * R)
    n = int(round(side * scale))
    up = lambda arr: np.asarray(Image.fromarray(arr.astype("float32"), "F").resize((n, n), Image.LANCZOS))
    sharpen = lambda v: np.clip((v - 0.5) * 3.0 + 0.5, 0, 1)
    a_u, f_u = sharpen(up(a)), sharpen(up(foot))
    yy2, xx2 = np.where(a_u > 0.5)
    x_lo, x_hi, y_lo, y_hi = xx2.min(), xx2.max() + 1, yy2.min(), yy2.max() + 1
    side_px = max(x_hi - x_lo, y_hi - y_lo)
    cx_, cy_ = (x_lo + x_hi) / 2, (y_lo + y_hi) / 2
    box = (int(round(cx_ - side_px / 2)), int(round(cy_ - side_px / 2)))
    box = (box[0], box[1], box[0] + side_px, box[1] + side_px)
    fit = lambda arr: np.asarray(Image.fromarray(arr, "F").resize((diameter, diameter), Image.BOX if diameter < side_px else Image.LANCZOS, box=box))
    A, F = fit(a_u), fit(f_u)
    col = GREY * (1 - F) + 255 * F
    out = np.stack([col, col, col, A * 255], -1)
    return Image.fromarray(np.clip(out + 0.5, 0, 255).astype("uint8"), "RGBA")


def on_paper(size, share):
    d = round(size * share)
    tile = Image.new("RGBA", (size, size), PAPER + (255,))
    sym = symbol(d)
    tile.alpha_composite(sym, ((size - d) // 2, (size - d) // 2))
    return tile.convert("RGB")


def with_padding(size, pad):
    d = round(size * (1 - 2 * pad))
    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile.alpha_composite(symbol(d), ((size - d) // 2, (size - d) // 2))
    return tile


save = lambda im, path, **kw: (im.save(path, optimize=True, **kw), print(f"{path.relative_to(ROOT)}  {im.size}  {path.stat().st_size // 1024 or '<1'} KB"))

W = 720
save(indexed(ink(full, (15, 15, 15), W)), OUT / "logo-full.png")
save(indexed(ink(full, (255, 255, 255), W)), OUT / "logo-full-light.png")
save(indexed(ink(compact, (15, 15, 15), W)), OUT / "logo-compact.png")
save(indexed(ink(compact, (255, 255, 255), W)), OUT / "logo-compact-light.png")
save(symbol(512), OUT / "logo-symbol.png")
save(Image.open(SRC).convert("L").resize((512, 512), Image.LANCZOS), OUT / "logo-square.png")

# favicons: tab icons fill the canvas; home-screen icons sit on the site's white
save(with_padding(96, 0.04), APP / "icon.png")
save(on_paper(180, 0.64), APP / "apple-icon.png")
save(with_padding(192, 0.1), ICONS / "icon-192.png")
save(with_padding(512, 0.1), ICONS / "icon-512.png")
save(on_paper(512, 0.60), ICONS / "icon-maskable-512.png")  # inside the 80 % maskable safe zone

# self-check: a round mark must not be flat against its canvas edge
chk = np.asarray(symbol(512))[..., 3] > 250
assert chk[0].sum() < 40 and chk[:, 0].sum() < 40 and chk[-1].sum() < 40 and chk[:, -1].sum() < 40, "symbol is clipped"
print("symbol roundness check ok")

frames = [with_padding(s, 0.0) for s in (16, 32, 48)]
frames[2].save(APP / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=frames[:2])
print("src/app/favicon.ico  16/32/48")
