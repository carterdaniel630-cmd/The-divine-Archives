#!/usr/bin/env python3
"""Divine Archives merch symbol #1 — Tree of Life.
Gilded Vellum aesthetic: bronze/copper linework, aged-parchment ground,
illuminated-manuscript roundel. Output: high-res PNG for print merch."""

import math, random, io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import cairosvg

SIZE   = 2400          # px, square (8" @ 300dpi)
CX = CY = SIZE / 2
SEED   = 7
random.seed(SEED); np.random.seed(SEED)

# ---- palette ----------------------------------------------------------------
VELLUM      = (231, 216, 180)
VELLUM_HI   = (241, 229, 199)
VELLUM_SH   = (201, 176, 131)
BRONZE_DEEP = "#6f4a24"
COPPER      = "#9c6a34"
GOLD        = "#b98f4e"
GOLD_BRIGHT = "#d9b06a"

# =============================================================================
# 1. AGED PARCHMENT GROUND (PIL, procedural)
# =============================================================================
def parchment():
    base = Image.new("RGB", (SIZE, SIZE), VELLUM)
    # fibre noise
    n = np.random.default_rng(SEED).normal(0, 1, (SIZE//2, SIZE//2))
    noise = Image.fromarray(((n - n.min())/(np.ptp(n))*255).astype("uint8")).resize((SIZE, SIZE))
    noise = noise.filter(ImageFilter.GaussianBlur(1.2))
    base = Image.composite(Image.new("RGB",(SIZE,SIZE),VELLUM_HI), base, noise.point(lambda v:int(v*0.10)))

    # irregular warm mottling / foxing — layered rotated ellipses, then blurred
    # hard, so nothing reads as a clean disc. Two passes at different scales.
    for scale, count, amax in ((1.0, 90, 10), (0.4, 220, 8)):
        blot = Image.new("RGBA", (SIZE, SIZE), (0,0,0,0))
        bd = ImageDraw.Draw(blot, "RGBA")
        for _ in range(count):
            r = int(random.randint(40, 240) * scale)
            r2 = int(r * random.uniform(0.45, 1.0))
            x = random.randint(-100, SIZE+100); y = random.randint(-100, SIZE+100)
            a = random.randint(3, amax)
            tone = random.choice([(150,120,74),(120,92,54),(196,168,120),(170,140,96)])
            bd.ellipse([x-r,y-r2,x+r,y+r2], fill=(*tone, a))
        blot = blot.rotate(random.randint(0,180), resample=Image.BILINEAR, expand=False)
        blot = blot.filter(ImageFilter.GaussianBlur(int(28*scale)+6))
        base = Image.alpha_composite(base.convert("RGBA"), blot).convert("RGB")
    base = base.filter(ImageFilter.GaussianBlur(2))

    # re-lay a crisp fibre grain on top (subtle)
    g = np.random.default_rng(SEED+1).normal(0,1,(SIZE,SIZE))
    grain = Image.fromarray(((g-g.min())/np.ptp(g)*255).astype("uint8")).convert("L")
    base = Image.composite(Image.new("RGB",(SIZE,SIZE),(210,190,150)), base,
                           grain.point(lambda v:int(abs(v-128)*0.18)))

    # radial vignette: candlelit center, foxed edges
    yy, xx = np.mgrid[0:SIZE,0:SIZE]
    dist = np.sqrt((xx-CX)**2+(yy-CY)**2) / (SIZE*0.72)
    vig  = np.clip(dist,0,1)**2.2
    vlayer = Image.fromarray((vig*255).astype("uint8")).convert("L")
    base = Image.composite(Image.new("RGB",(SIZE,SIZE),VELLUM_SH), base, vlayer.point(lambda v:int(v*0.55)))
    # faint bright core
    core = Image.fromarray(((1-np.clip(dist,0,1))**2*255).astype("uint8")).convert("L")
    base = Image.composite(Image.new("RGB",(SIZE,SIZE),VELLUM_HI), base, core.point(lambda v:int(v*0.28)))
    return base.convert("RGBA")

# =============================================================================
# 2. TREE OF LIFE — recursive branch system, mirrored roots, in a roundel (SVG)
# =============================================================================
RLIMIT = SIZE*0.352   # keep all growth inside the roundel; tips brush the rim

def branch(items, x, y, ang, length, width, depth, foliage):
    """Grow a graceful tapering branch, recursing into children. Appends
    ('L', pts, width) polylines and ('D', (x,y), r, kind) leaf/fruit marks.
    Clamped to a circle (RLIMIT) so the tree sits within the ring."""
    if depth == 0 or length < 10:
        return
    steps = 7
    curl = random.uniform(-0.30, 0.30)
    pts = [(x, y)]
    a = ang
    clamped = False
    for i in range(1, steps+1):
        a += curl / steps
        seg = length / steps
        nx = x + math.cos(a) * seg
        ny = y - math.sin(a) * seg
        if math.hypot(nx-CX, ny-CY) > RLIMIT:
            clamped = True
            break
        x, y = nx, ny
        pts.append((x, y))
    if len(pts) < 2:
        return
    items.append(('L', pts, width))
    tip = (x, y)
    terminal = clamped or depth <= 2
    if terminal and foliage:                      # clustered foliage at canopy tips
        for _ in range(random.randint(1, 3)):
            jx = tip[0] + random.uniform(-14, 14)
            jy = tip[1] + random.uniform(-14, 14)
            items.append(('D', (jx, jy), random.uniform(6, 11), 'leaf'))
    elif terminal:                                # single seed/nodule at root tips
        if random.random() < 0.5:
            items.append(('D', tip, random.uniform(4, 6), 'seed'))
    if clamped:
        return
    nchild = 2 if depth > 5 else random.choice([2, 2, 3])
    spread = random.uniform(0.42, 0.74)
    for k in range(nchild):
        t = (k/(nchild-1)-0.5) if nchild > 1 else 0
        na = a + t*spread + random.uniform(-0.05, 0.05)
        nl = length * random.uniform(0.80, 0.90)
        nw = width * 0.74
        branch(items, x, y, na, nl, nw, depth-1, foliage)

def mirror(items):
    """Reflect a set of items across the vertical centre axis."""
    out = []
    for it in items:
        if it[0] == 'L':
            out.append(('L', [(2*CX-px, py) for px, py in it[1]], it[2]))
        else:
            (px, py) = it[1]
            out.append(('D', (2*CX-px, py), it[2], it[3]))
    return out

def build_tree_svg():
    trunk_w = 42
    # --- canopy: grow one side, then mirror for heraldic symmetry ---
    random.seed(SEED)
    half_up = []
    for off in (0.16, 0.54, 0.98):
        branch(half_up, CX, CY-48, math.pi/2 + off, RLIMIT*0.34,
               trunk_w*random.uniform(0.9, 1.0), 9, foliage=True)
    canopy = half_up + mirror(half_up)
    # --- roots: mirror likewise, a touch shallower/sparser ---
    random.seed(SEED+21)
    half_dn = []
    for off in (0.16, 0.52, 0.92):
        branch(half_dn, CX, CY+48, -math.pi/2 - off, RLIMIT*0.30,
               trunk_w*random.uniform(0.85, 0.95), 8, foliage=False)
    roots = half_dn + mirror(half_dn)
    # --- the shared trunk column joining canopy to roots ---
    trunk = [('L', [(CX, CY-54), (CX, CY-4)], trunk_w),
             ('L', [(CX, CY+54), (CX, CY+4)], trunk_w)]

    def poly(pts):
        return "M %.2f %.2f " % pts[0] + " ".join("L %.2f %.2f" % p for p in pts[1:])
    def strokes(items, color, wscale, op):
        s = ""
        for it in items:
            if it[0] != 'L':
                continue
            s += f'<path d="{poly(it[1])}" fill="none" stroke="{color}" ' \
                 f'stroke-width="{max(1.3, it[2]*wscale):.2f}" stroke-linecap="round" ' \
                 f'stroke-linejoin="round" opacity="{op}"/>\n'
        return s
    def marks(items):
        s = ""
        for it in items:
            if it[0] != 'D':
                continue
            (x, y), r, kind = it[1], it[2], it[3]
            if kind == 'leaf':
                s += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{GOLD_BRIGHT}" ' \
                     f'stroke="{BRONZE_DEEP}" stroke-width="1.6" opacity="0.95"/>\n'
            else:
                s += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{COPPER}" opacity="0.85"/>\n'
        return s

    allsets = (roots, trunk, canopy)              # roots behind, canopy in front
    tree = ""
    for items in allsets:                         # dark spine / hollow
        tree += strokes(items, BRONZE_DEEP, 1.30, 1.0)
    for items in allsets:                         # copper body
        tree += strokes(items, COPPER, 1.00, 1.0)
    for items in allsets:                         # raised gold centre
        tree += strokes(items, GOLD, 0.60, 0.95)
    for items in allsets:                         # bright highlight filament
        tree += strokes(items, GOLD_BRIGHT, 0.24, 0.9)
    for items in allsets:                         # foliage + seeds on top
        tree += marks(items)

    # ---- illuminated roundel frame ----
    Rout = SIZE*0.40
    frame = f'''
      <circle cx="{CX}" cy="{CY}" r="{Rout:.1f}" fill="none" stroke="{BRONZE_DEEP}" stroke-width="10"/>
      <circle cx="{CX}" cy="{CY}" r="{Rout-16:.1f}" fill="none" stroke="{GOLD}" stroke-width="4"/>
      <circle cx="{CX}" cy="{CY}" r="{Rout-64:.1f}" fill="none" stroke="{COPPER}" stroke-width="2.4" opacity="0.9"/>
    '''
    # guilloché of small ticks between the two inner rings
    ticks = ""
    N = 180
    for i in range(N):
        a = 2*math.pi*i/N
        r1 = Rout-16; r2 = Rout-30
        x1 = CX+math.cos(a)*r1; y1=CY+math.sin(a)*r1
        x2 = CX+math.cos(a)*r2; y2=CY+math.sin(a)*r2
        ticks += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{GOLD}" stroke-width="1.6" opacity="0.7"/>\n'
    # four cardinal illuminated leaf ornaments on the ring
    orn = ""
    for a in (0, math.pi/2, math.pi, 3*math.pi/2):
        ox = CX+math.cos(a)*(Rout); oy=CY+math.sin(a)*(Rout)
        orn += f'<circle cx="{ox:.1f}" cy="{oy:.1f}" r="17" fill="{VELLUM_svg}" stroke="{BRONZE_DEEP}" stroke-width="6"/>'
        orn += f'<circle cx="{ox:.1f}" cy="{oy:.1f}" r="7" fill="{GOLD_BRIGHT}"/>'

    # small radiating seed-of-life hint behind trunk base (very faint)
    halo = ""
    for k in range(6):
        a = math.pi/3*k
        hx = CX+math.cos(a)*46; hy=CY+math.sin(a)*46
        halo += f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="46" fill="none" stroke="{GOLD}" stroke-width="1.2" opacity="0.16"/>'

    # central boss: a small illuminated medallion resolving trunk↔root crossing
    boss = f'''
      <circle cx="{CX}" cy="{CY}" r="34" fill="{VELLUM_svg}" stroke="{BRONZE_DEEP}" stroke-width="7"/>
      <circle cx="{CX}" cy="{CY}" r="34" fill="none" stroke="{GOLD}" stroke-width="2.5"/>
      <circle cx="{CX}" cy="{CY}" r="12" fill="{GOLD_BRIGHT}" stroke="{BRONZE_DEEP}" stroke-width="2"/>
    '''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">
      {frame}{ticks}{halo}
      {tree}
      {boss}
      {orn}
    </svg>'''
    return svg

VELLUM_svg = "#e7d8b4"

def main():
    ground = parchment()
    svg = build_tree_svg()
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=SIZE, output_height=SIZE)
    line = Image.open(io.BytesIO(png)).convert("RGBA")

    # ink-bleed: faint spread of the linework into the vellum
    bleed = line.filter(ImageFilter.GaussianBlur(3))
    bleed.putalpha(bleed.getchannel("A").point(lambda v:int(v*0.22)))
    comp = Image.alpha_composite(ground, bleed)
    comp = Image.alpha_composite(comp, line)

    # final unifying grain + subtle warm glaze so line and ground share light
    g = np.random.default_rng(SEED+5).normal(0,1,(SIZE,SIZE))
    grain = Image.fromarray(((g-g.min())/np.ptp(g)*255).astype("uint8")).convert("L")
    comp = Image.composite(Image.new("RGBA",(SIZE,SIZE),(120,95,55,255)), comp,
                           grain.point(lambda v:int(abs(v-128)*0.05)))
    comp = comp.convert("RGB")
    out = "/home/user/The-divine-Archives/merch/artwork/tree-of-life.png"
    comp.save(out, "PNG")
    # also a downsized preview
    comp.resize((900,900), Image.LANCZOS).save(
        "/tmp/claude-0/-home-user-The-divine-Archives/a116adde-4fc4-5e21-8bd6-76f2d2597714/scratchpad/preview.png","PNG")
    print("wrote", out)

if __name__ == "__main__":
    main()
