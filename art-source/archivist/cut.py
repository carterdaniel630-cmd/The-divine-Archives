#!/usr/bin/env python3
"""Cut The Unfinished Journal hero ("The Archivist") into the game's painted parts.

Source: character-sheet-archivist-hooded.webp (approved by Carter 2026-10-21; face from his own selfie,
hood up). Output: docs/assets/games/art/treasure/{body,thigh,shin,portrait,portrait-smile}.png + manifest.json.

Run from the repo root:  python3 art-source/archivist/cut.py
Needs Pillow, numpy, scipy. Re-running gives the same files.

The side view (left figure on the sheet) faces left; the game's parts face right, so they are mirrored.
Coordinates below are in sheet pixels. The hero's face is never redrawn: every pixel of it comes from the sheet.
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "docs", "assets", "games", "art", "treasure")
SHEET = Image.open(os.path.join(HERE, "character-sheet-archivist-hooded.webp")).convert("RGB")


def cutout(box):
    """Crop a box and make the paper and grid lines transparent: flood-fill light, grey pixels from the edge."""
    im = SHEET.crop(box)
    a = np.asarray(im).astype(int)
    mx, mn = a.max(2), a.min(2)
    light = (mn > 150) & (mx - mn < 28)                 # paper white and the grey grid; the figure is outlined in black
    lab, _ = ndimage.label(light)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    fg = ndimage.binary_opening(~bg, iterations=1)     # drop stray grid specks
    lab2, n = ndimage.label(fg)
    if n > 1:                                           # keep only pieces of a useful size
        sizes = ndimage.sum(fg, lab2, range(1, n + 1))
        keep = [i + 1 for i, s in enumerate(sizes) if s > 400]
        fg = np.isin(lab2, keep)
    alpha = ndimage.gaussian_filter(fg.astype(float), 0.6)   # soft one-pixel edge
    rgba = np.dstack([a, (np.clip(alpha, 0, 1) * 255)]).astype(np.uint8)
    return rgba


def save(rgba, name):
    Image.fromarray(rgba).save(os.path.join(OUT, name + ".png"), optimize=True)


# ---- side view: sheet box (100,400)-(400,1390); figure coordinates are relative to that box ----
SIDE = (100, 400, 400, 1390)
side = cutout(SIDE)
H, W = side.shape[:2]
ys, xs = np.nonzero(side[:, :, 3] > 128)
top, sole = int(ys.min()), int(ys.max())
HIP = (140, 490)        # under the coat, level with the wrist
KNEE = (140, 712)       # just below the coat hem
HEM = 686               # the coat ends here; the body part stops at it

# body: hood to coat hem (arm, hand and the scroll case on the back included)
body = side[top:HEM].copy()

# shin: the near leg from the knee to the sole. Its boot is the lower one; the far leg's boot pokes out above-left,
# so everything left of the near trouser above the near boot's laces is cleared.
shin = side[KNEE[1]:sole + 1].copy()
lace = 912 - KNEE[1]
for r in range(lace + 11):                     # the near trouser's back edge slants from x 86 at the knee to 108 at the laces
    shin[r, :int(86 + 22 * min(r, lace) / lace), 3] = 0
# thigh: hidden under the coat almost all the time; made from the trouser just below the hem, stretched up to the hip
strip = Image.fromarray(side[HEM + 2:KNEE[1] + 24, 84:200].copy())
thigh = np.asarray(strip.resize((116, KNEE[1] + 24 - HIP[1]), Image.LANCZOS)).copy()

def mirror(a):
    return a[:, ::-1].copy()

def trim(a):
    """Trim fully transparent columns and rows; returns the array and the (x0, y0) removed."""
    al = a[:, :, 3] > 8
    yy, xx = np.nonzero(al)
    x0, x1, y0, y1 = xx.min(), xx.max() + 1, yy.min(), yy.max() + 1
    return a[y0:y1, x0:x1], int(x0), int(y0)

# mirror so the hero faces right, then trim and record pivots in the trimmed images
body_m, bx0, by0 = trim(mirror(body))
shin_m, sx0, sy0 = trim(mirror(shin))
thigh_m, tx0, ty0 = trim(mirror(thigh))
hipX_m = W - 1 - HIP[0]
kneeX_m = W - 1 - KNEE[0]
# The hero is drawn about 36 px tall (up to ~170 device pixels on a sharp phone), so the parts ship at half the sheet's
# resolution and every manifest number is in those half-size pixels.
S = 0.5
def half(a):
    im = Image.fromarray(a)
    return np.asarray(im.resize((max(1, round(im.width * S)), max(1, round(im.height * S))), Image.LANCZOS))
body_h, thigh_h, shin_h = half(body_m), half(thigh_m), half(shin_m)
save(body_h, "body"); save(thigh_h, "thigh"); save(shin_h, "shin")
def r(v):
    return round(v * S, 1)

# the raised arm drawn while using the line or hanging from the rope: shoulder relative to the hip, in sheet pixels
SHOULDER = (150, 236)
manifest = {
    "figH": r(sole - top),
    "body": {"pivotX": r(hipX_m - bx0), "pivotY": r(HIP[1] - top - by0), "w": int(body_h.shape[1]), "h": int(body_h.shape[0])},
    "thigh": {"pivotX": r(116 - 1 - 58 - tx0), "pivotY": r(0 - ty0), "w": int(thigh_h.shape[1]), "h": int(thigh_h.shape[0])},
    "shin": {"pivotX": r(kneeX_m - sx0), "pivotY": r(0 - sy0), "w": int(shin_h.shape[1]), "h": int(shin_h.shape[0])},
    "kneeFromHip": [r(-(KNEE[0] - HIP[0])), r(KNEE[1] - HIP[1])],
    "footFromHip": r(sole - HIP[1]),
    "arm": {"x": r(-(SHOULDER[0] - HIP[0])), "y": r(SHOULDER[1] - HIP[1]), "len": r(215), "w": r(62),
            "sleeve": "#2b2b23", "sleeveLight": "#454436", "hand": "#c99878"},
}
with open(os.path.join(OUT, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=1)

# ---- portraits for the story cards: the front view's head and shoulders, hood up ----
PORTRAIT = (520, 150, 820, 522)           # 300 x 372, the cards' 220 x 273 shape
p = cutout(PORTRAIT)
pim = Image.fromarray(p).resize((220, 273), Image.LANCZOS)
pim.save(os.path.join(OUT, "portrait.png"), optimize=True)
# The sheet has one expression only. No smile is invented: the "smile" card shows the same face.
pim.save(os.path.join(OUT, "portrait-smile.png"), optimize=True)
print(json.dumps(manifest))
