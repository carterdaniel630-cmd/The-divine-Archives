# Theomachy — Pose-Based Sprite Rebuild (Pilot)

**Status: PILOT — awaiting Carter's approval before any other god is touched.**

Rebuild direction: drop the old skeletal cutout / mesh-warped rig; rebuild fighters
from **rigid painted parts** animated as **smooth whole-body motion** (the Tekken
reference). Deliver Zeus + a playable Zeus vs. placeholder Hades. Stop before other gods.

Self-contained — does **not** modify the live Theomachy (`docs/symbols.html`, engine
`docs/assets/games/fighter.js`). Nothing here is wired into the site nav; review only.

## What's here
| File | What it is |
|---|---|
| `art/zeus/*.png` | Carter's painted Zeus parts, chroma-sliced to transparent PNGs (head, cuirass, charged torso, upper arm, two forearm+hand variants, armored/bare thighs, armored/bare shins with sandals). |
| `zeus-painted.js` | Painted-part rig: places + rotates each **rigid** part on a skeleton joint. Uniform scale, no stretch/skew/mesh — driven by the shared pose angles. |
| `poses.js` | The pose definitions (angles) — single source of truth — plus a procedural cel-shaded drawer used for the placeholder Hades. |
| `pilot.js` | Match engine: fixed-timestep loop, state machine, **smooth keyframe interpolation**, hit-stop, screen shake, smear/trail, projectile, input + AI. |
| `pose-sheet.html` | Every Zeus pose in a labeled grid (painted), + placeholder Hades row. |
| `index.html` | Playable **Zeus vs. placeholder Hades**. |

## How to review
Open `index.html` / `pose-sheet.html`. From a plain file open they work; for the
painted art to load without browser file:// image limits, it's cleanest over the
deployed site (or any http server), e.g. `…/assets/games/theomachy-pilot/index.html`.

**Controls (Zeus / P1):** `A`/`D` move · `W` jump · `J` punch · `K` kick · `L` block ·
`U` Keraunos (bolt) · `I` Anabasis (uppercut) · `O` Bronte (clap). Player 2 (Hades)
is AI by default (button toggles human on arrows + `1`/`2`/`3`). `R` rematch.

## How the rebuild works
- **Rigid painted parts, no warp.** Each part is placed with its proximal pivot on a
  skeleton joint and rotated so its axis runs down the bone. **Uniform scale only** —
  parts are never stretched, skewed, IK-solved, or mesh-skinned. That rubber-limb warp
  is exactly what we dropped.
- **Smooth motion (the Tekken bar).** The engine interpolates the joint **angles**
  between authored key poses and adds secondary motion (idle breathing/sway, distance-
  tied walk, whole-body anticipation → contact → follow-through). Rotating rigid parts
  smoothly is not warping — it's how a clean 2-D cut-out rig gets fluid movement.
- **One pose source.** Every pose is a complete authored stance in `poses.js`; the
  painted rig and the procedural drawer both read it, so the pose sheet and the match
  always agree, and feet stay on one pivot.

### Zeus's kit
Core: idle, walk, punch, kick, block, hit-react, KO. **3 distinct signatures:**
**Keraunos** (bolt projectile), **Anabasis** (rising bolt-uppercut / launcher),
**Bronte** (thunderclap slam + ground shock). Signatures swap in the lightning
torso/forearm art while active.

### Feel (timing)
Anticipation → held impact → **hit-stop** freeze → **screen shake** → **smear/trail**
across the strike → impact particles.

## Honest report (what's true, what to watch)
- **Movement is smooth now**, not stepped — interpolated rigid parts + secondary motion.
  Filmstrips of each move show the in-betweens.
- **The one real art constraint: the parts are painted FRONT-facing** (portrait head,
  front cuirass), while Tekken is strict **side profile**. Assembled, Zeus reads as a
  painterly ¾-front fighter (beat-em-up angle), not true profile. The *movement* can be
  Tekken-quality; the *camera angle* can't be true-profile without side-view art. **This
  is the call I most want your read on.** (Options: keep the ¾-front look; or commission/
  generate side-profile part art; or a hybrid where the head turns to profile.)
- **Hands are open palms** (the art has no fist), so punches read as palm-strikes /
  bolt-hands. Fine for Zeus, but worth knowing.
- **Hades is still the procedural placeholder**, recolored — deliberately, until his own
  painted pass.
- **Pivots/scale are hand-tuned** and good, but a couple of extreme poses (very high kick,
  overhead reaches) sit near the art's rotation comfort zone — expected for cut-out art,
  and why crisp poses (not warping) is the right call.

## If you approve — integration plan
1. Port `zeus-painted.js` + the smooth-interpolation engine into `fighter.js`, replacing
   the old `drawCutout`/`springPose`/IK path. Keep the state machine, move data, and the
   existing shake/hit-stop/flash globals.
2. Decide the camera-angle question above; if side-profile is wanted, that drives the art
   spec for the remaining gods.
3. Add Anabasis + Bronte to `fighter-moves.js` and Zeus's inputs.
4. **Then** paint + rig Poseidon, Athena, and the real Hades — one reviewed god at a time.
