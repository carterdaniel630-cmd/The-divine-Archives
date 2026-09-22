#!/usr/bin/env python3
"""
Divine Casualties — side-view part extractor.

The fighter rig (docs/assets/games/fighter.js) is a side-facing skeleton, but the
first art pass only had FRONT-view god cutouts, so fighters read flat/front-on
("bobble-head, no arms"). Carter provided per-god SIDE-view part sheets, but on a
solid BLACK background — a plain luminance key fails because the dark armour is the
same luminance as the backdrop.

This script recovers clean side parts with a REGION FLOOD/FILL key:
  1. coarse foreground = luminance > BG_LUM, then a large morphological CLOSE +
     fill-holes so each part becomes ONE solid region (armour seams no longer
     split it, and interior dark armour is captured because holes are filled).
  2. label the regions; each is one part. Keep the region's pixels, drop the rest
     (the background black that is NOT enclosed by a part silhouette).

Because the source sheets are not in the repo (user uploads), this file documents
the exact method + per-god blob->part mapping and pivots used, so the parts under
docs/assets/games/art/parts/<god>/ are reproducible rather than a black box.

Usage: point SRC at a side sheet and set the god's MAP (region-index -> part name).
Region indices come from the printed bbox table (run with no MAP first to list them).
Limb pivot = top-centre (proximal joint); head/torso pivot = bottom-centre (neck/hip).
"""
import sys, os, json, math
import numpy as np
from scipy import ndimage
from PIL import Image

BG_LUM = 24            # background-black luminance threshold
MIN_AREA = 4500        # ignore specks

def regions(path):
    arr = np.array(Image.open(path).convert("RGB")).astype(int)
    lum = 0.299*arr[...,0] + 0.587*arr[...,1] + 0.114*arr[...,2]
    fg = lum > BG_LUM
    fg = ndimage.binary_closing(fg, structure=np.ones((9, 9)), iterations=2)
    fg = ndimage.binary_fill_holes(fg)
    fg = ndimage.binary_opening(fg, structure=np.ones((3, 3)))
    lbl, n = ndimage.label(fg)
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
    out = []
    for i in range(1, n + 1):
        if sizes[i - 1] > MIN_AREA:
            ys, xs = np.where(lbl == i)
            out.append((i, int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())))
    return arr, lbl, out

def cut(arr, lbl, idx):
    ys, xs = np.where(lbl == idx)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    mask = (lbl[y0:y1+1, x0:x1+1] == idx)
    sub = arr[y0:y1+1, x0:x1+1]
    a = np.where(mask, 255, 0).astype(np.uint8)
    img = Image.fromarray(np.dstack([sub[...,0], sub[...,1], sub[...,2], a]).astype(np.uint8), "RGBA")
    return img.crop(img.getbbox())

# region-index -> (part name, pivot kind). "top" = proximal joint at top (limbs),
# "bot" = neck/hip at bottom (head, torso). Poseidon (18edd04d side sheet):
POSEIDON = {1:("head","bot"), 3:("torso","bot"),
            4:("upperArmR","top"), 5:("upperArmL","top"),
            6:("foreArmR","top"), 7:("foreArmL","top"),
            10:("thighR","top"), 9:("thighL","top"),
            8:("shinR","top"), 8.1:("shinL","top")}  # one shin+foot, used L+R

def extract(src, mapping, dst):
    arr, lbl, regs = regions(src)
    print("regions:")
    for i, x0, x1, y0, y1 in regs:
        print(f"  idx{i}: x[{x0}-{x1}] y[{y0}-{y1}] {x1-x0}x{y1-y0}")
    if not mapping:
        return
    os.makedirs(dst, exist_ok=True)
    man = {}
    for key, (name, kind) in mapping.items():
        idx = int(key)
        img = cut(arr, lbl, idx); w, h = img.size
        px, py = (w//2, int(h*0.12)) if kind == "top" else (w//2, int(h*0.93))
        img.save(os.path.join(dst, name + ".png"))
        man[name] = {"w": w, "h": h, "pivotX": px, "pivotY": py}
    json.dump(man, open(os.path.join(dst, "manifest.json"), "w"), indent=1)
    print("wrote", len(man), "parts ->", dst)

if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else None
    dst = sys.argv[2] if len(sys.argv) > 2 else None
    if not src:
        print("usage: extract-side-parts.py <side-sheet.jpg> [out-dir]"); sys.exit(1)
    extract(src, POSEIDON if dst else None, dst)
