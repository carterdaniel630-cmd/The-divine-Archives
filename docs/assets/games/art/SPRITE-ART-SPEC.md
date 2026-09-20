# Theomachy — Art Spec

The game runs a **layered, reactive head rig** (a lightweight Live2D-style face)
plus a **layered cutout body rig**. Today the heads are driven from a single
portrait crop of `heroes.jpg` and warped procedurally (blink, jaw, brow, sway,
neck-lag, KO slump). Authoring a proper **head-set** per this spec replaces the
warp hack with real layered art the rig composes; a **body-set** replaces the
color-matched procedural body. **Do heads first** — they carry the identity and
the reactions.

Gods: **Zeus, Poseidon, Athena, Hades.** Match the `heroes.jpg` style: anime /
painterly, bold cel shading, heavy dark outline, rim light from the upper-right,
each god's established palette and motifs.

---

## PART 1 — HEAD SET (do this first)

For each god, deliver a head that the rig can pose and emote. Two axes:
**3 angles × 5 expressions**, built from **separated layers** so the rig can
blink, open the jaw, angle the brows, sway the hair/plume, and fake-turn.

### 1a. Layers (separate transparent PNGs, straight alpha)
Draw the head once, then separate onto these layers (back → front). Each layer
extends a little past its seams so nothing gaps when it moves.
1. `hairBack` — hair / mane behind the skull (sways).
2. `plume` — **Athena only**: the red helmet crest (sways independently).
3. `crownBack` — rear of the helm/laurel/coral/horns, behind the face.
4. `faceBase` — skull + skin + nose + ears, **no eyes, no jaw seam** (neutral).
5. `jaw` — lower jaw + mouth + (Zeus/Poseidon) lower beard. Pivots at the hinge
   so it can rotate/drop open. Include an inner-mouth (teeth/dark) so an open
   mouth reads.
6. `eyes` — eyeballs + upper/lower lids as a unit (for blink + gaze).
7. `brows` — brows only, on their own layer (angle for anger/hurt).
8. `crownFront` / `hairFront` — helm front, laurel, front hair strands (sway).

### 1b. Angles (3)
Provide each head at three yaws; the rig mirrors for the other facing and picks
by where the fighter is aiming:
- **front** (0°, looking at camera),
- **three-quarter** (~30° toward screen-right),
- **near-profile** (~55° toward screen-right).
If full angle sets are too costly, ship **front + three-quarter**; the rig fakes
the rest with parallax.

### 1c. Expressions (5)
As **brow + eye + jaw** layer variants (not whole new heads) so they compose
with any angle:
- **neutral** (idle),
- **shout** (mouth open wide, brows down — attacking),
- **grimace** (brows up/together, eyes tight, teeth clenched — hurt),
- **fierce** (brows down hard, eyes narrowed — charge / guard-break),
- **stunned** (eyes half-lidded, jaw slack — KO).
Plus a **blink** frame for the eyes layer (closed lids).

### 1d. Framing, scale, pivots (consistent across every file)
- **Canvas:** a fixed square per god, **256 × 256 px** (author 3× ≈ 768 and we
  downscale). Same box for every angle/expression/layer of that god.
- **Alignment:** the **eye line sits at y = 0.42** of the box and the head is
  horizontally centered, identically in every file, so layers and expressions
  register exactly. The head silhouette fills ~78% of the box width.
- **Neck pivot:** bottom-center of the box, at **(0.5, 0.94)** — the rig hinges
  the whole head here (spring-lag, look-at, KO slump). Mark it (a 1px magenta dot
  on a guide layer, or state it in an atlas).
- **Per-layer pivots:** `jaw` pivots at the jaw hinge (~0.5, 0.66); `plume` and
  `hairBack`/`crownFront` pivot where they attach to the skull, so they can sway.
- **Transparent background**, no baked ground shadow, no baked glow (the game
  adds eye-glow, rim, and the hit-flash).

### 1e. Delivery
Per god: `art/<god>/head/{layer}__{expr}.png` (+ `{layer}__{angle}` for the two
angle sets of face/crown/hair), or one sheet + JSON atlas listing each region's
`{x,y,w,h,pivotX,pivotY}`. Drop the atlas in and set `FIGHTER_ART[god].head` to
`mode:"set"` — the rig switches from warp to composed layers with no other change.

---

## PART 2 — BODY SET (after heads)

Full-body cutout parts so the color-matched placeholder body becomes real art.

- **Style/lighting:** as above. Right-facing; the engine mirrors.
- **Format:** one transparent PNG per part (straight alpha) or a sheet + atlas
  with pivots. Folder `art/<god>/body/`.
- **Parts (z-order back → front):** `cape`, `legB_thigh`, `legB_shin`, `footB`,
  `armB_upper`, `armB_fore`, `handB`, `torso`, `legF_thigh`, `legF_shin`, `footF`,
  `armF_upper`, `armF_fore`, `handF`, `weapon`. Each pivots at its **top/parent
  joint**; draw each limb segment straight (the rig bends joints with IK).
- **Scale / proportions (match the skeleton, author 3×):** character ~148 units
  tall (foot 0 → head −148). Joint positions (x, y; right-facing):
  footF (21,0) footB (−20,0) · kneeF (15,−40) kneeB (−15,−40) · hip (0,−74) ·
  chest (3,−116) · neck (4,−128) · head (7,−148) · shF (12,−122) shB (−4,−122) ·
  elF (27,−116) elB (−17,−108) · hnF (38,−110) hnB (−22,−116).
  Rest bone lengths: thigh ≈ 36, shin ≈ 40, torso ≈ 54, upper-arm ≈ 16,
  forearm ≈ 13, neck→head ≈ 20.
- **Pose:** one neutral right-facing stance, separated onto part layers; the rig
  animates it (no per-frame animation needed).

---
_Prototype status: heads are a live rig warping a single `heroes.jpg` crop
(blink, jaw-open on attack, brow on hurt/anger, hair/plume sway, neck-lag,
hit-flash, KO slump); bodies are color-matched procedural placeholders. Author
Part 1 to replace the warp with real layered heads; Part 2 for real bodies._
