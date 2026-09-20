# Theomachy — Full-Body Sprite Art Spec (layered cutout rig)

This is the generation/commission spec for the god fighters. The game already
runs a **layered cutout rig**: each fighter is an ordered stack of parts driven
by a 13-joint skeleton. Today only the **head** uses real art (cropped from
`heroes.jpg`); every other part is a color-matched procedural placeholder. Author
art to this spec and it drops straight into `FIGHTER_ART` in `fighter.js` — no
engine change.

Deliver art for the four gods: **Zeus, Poseidon, Athena, Hades**.

---

## 1. Style (match `heroes.jpg`)
- Anime / painterly, bold cel shading, heavy dark outline, dramatic rim light.
- Keep each god's established palette and motifs (already in the game):
  - **Zeus** — gold armor, white beard + laurel, electric-blue glowing eyes, lightning.
  - **Poseidon** — teal skin, coral crown, gold trident, seawater greens.
  - **Athena** — bronze armor, crested war helm (red plume), spear + aegis, owl.
  - **Hades** — grey skin, dark horned helm, violet glowing eyes, purple flame.
- Lighting comes from the **upper-right** (the game shades that way). Paint form,
  not a flat fill.

## 2. Format & delivery
- **One transparent PNG per part** (straight alpha, no matte), OR a single sheet
  per god + a JSON atlas of `{part: {x,y,w,h, pivotX, pivotY}}`. Transparent PNGs
  are simplest.
- Folder per god: `art/zeus/head.png`, `art/zeus/torso.png`, … (names in §4).
- Each part drawn for a **right-facing** character (the engine mirrors for the
  other direction). No baked-in shadow on the ground; the game draws that.
- **Pivot** = the point where the part rotates about its parent joint. Mark it
  (atlas `pivotX/Y`, or a 1px magenta dot on a separate guide layer). Pivots are
  critical — they're how the part tracks the skeleton.

## 3. Scale & proportions (IMPORTANT — match the skeleton)
The in-game skeleton is defined in local units where the character is ~148 units
tall (foot at 0, head center at −148). **Author at 3× for crispness** (≈ 444 px
tall), and we downscale. Match these joint positions (x, y in local units, y-up
is negative; right-facing). Bone = segment between two joints.

| Joint | x | y | | Joint | x | y |
|---|---|---|---|---|---|---|
| footF | 21 | 0 | | footB | −20 | 0 |
| kneeF | 15 | −40 | | kneeB | −15 | −40 |
| hip | 0 | −74 | | chest | 3 | −116 |
| neck | 4 | −128 | | head | 7 | −148 |
| shF (front shoulder) | 12 | −122 | | shB (back shoulder) | −4 | −122 |
| elF (front elbow) | 27 | −116 | | elB (back elbow) | −17 | −108 |
| hnF (front hand) | 38 | −110 | | hnB (back hand) | −22 | −116 |

**Rest bone lengths** (author parts to these, ×3): thigh ≈ 36, shin ≈ 40, torso
(hip→neck) ≈ 54, upper-arm ≈ 16, forearm ≈ 13, neck→head ≈ 20. Limbs bend at the
mid joint; the rig re-solves elbows/knees with IK, so draw each limb segment as a
**separate straight part** that pivots at its top joint.

## 4. Part list (z-order back → front)
Draw each as its own transparent part, in its rest orientation, pivot at the
**top** (parent) joint unless noted.

1. `cape` (optional) — behind everything, pivots at the upper back.
2. `legB_thigh` — pivot hip; `legB_shin` — pivot knee; `footB` — pivot ankle.
3. `armB_upper` — pivot back shoulder; `armB_fore` — pivot back elbow; `handB`.
4. `torso` — the hips-to-shoulders trunk (armor/robe), pivot at hip.
5. `legF_thigh` / `legF_shin` / `footF` — front leg, same pivots as back.
6. `head` — pivot at the neck joint. **Include the crown/helm and hair/beard**
   (the head part carries them; there is no separate crown part). Framed so the
   face fills a head silhouette ~44 units wide.
7. `armF_upper` — pivot front shoulder; `armF_fore` — pivot front elbow; `handF`.
8. `weapon` (optional) — held in the front hand; pivot at the grip.

Minimum viable set if simplifying: **head, torso, armF_upper, armF_fore, armB_upper,
armB_fore, legF_thigh, legF_shin, legB_thigh, legB_shin** (hands/feet/cape/weapon
can stay procedural at first).

## 5. Pose to draw the parts in
Draw the character once in a **neutral stance facing right**, weight even, arms
slightly forward (a relaxed fighting idle), then separate onto layers by part.
The rig animates from there — you do NOT draw per-frame animation; the skeleton
provides motion. Keep each part's art extending a little past its joints so
neighbors overlap cleanly with no gaps when the limb bends.

## 6. How it plugs in
For each god, add the part crops + pivots to `FIGHTER_ART[godId]` in `fighter.js`
and flip that part from procedural to `art`. The head entry already there is the
working example. Nothing else changes.

---
_Prototype status: heads are live (cropped from `heroes.jpg`); bodies are
color-matched procedural placeholders pending art authored to this spec._
