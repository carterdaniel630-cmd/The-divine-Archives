# Theomachy — Pose-Based Sprite Rebuild (Pilot)

**Status: PILOT — awaiting Carter's approval before any other god is touched.**

Direction being executed: *drop the skeletal / mesh-warped sprites; rebuild fighters
as pose-based sprites (rigid whole-body poses, no warping). Deliver the pose sheet
+ a playable Zeus vs. placeholder Hades. Stop for approval before touching any other god.*

This folder is **self-contained** and does **not** modify the live Theomachy
(`docs/symbols.html#play=fighter`, engine `docs/assets/games/fighter.js`). Nothing
here is wired into the site nav — it's for review only.

## What's here
| File | What it is |
|---|---|
| `poses.js` | The rebuild's core. Rigid figure drawer + every Zeus pose + the placeholder Hades recolor. **Single source of truth** for both the sheet and the game. |
| `pose-sheet.html` | Visual reference: every Zeus pose in a labeled grid (+ a Hades placeholder row). |
| `index.html` | Playable **Zeus vs. placeholder Hades**. |
| `pilot.js` | Compact match engine: fixed-timestep loop, state machine, hitboxes, and all the "feel" systems. |

## How to review
Open either HTML file directly in a browser (they work from `file://` — no build, no
server). On the deployed site they'll be at
`…/assets/games/theomachy-pilot/pose-sheet.html` and `…/index.html`.

**Controls (Zeus / Player 1):** `A`/`D` move · `W` jump · `J` punch · `K` kick ·
`L` block (hold) · `U` Keraunos (bolt) · `I` Anabasis (uppercut) · `O` Bronte (clap).
Player 2 (Hades) is an AI by default; the button toggles it to a human on the arrow
keys + `1`/`2`/`3`. `R` rematches.

## The rebuild, concretely
The old system warped painted body-part PNGs (`art/parts/<god>/…`) onto a spring +
IK **skeleton** (`drawCutout` / `springPose` / `shapeLimbs`). That's the warping being
dropped. Here instead:

- **Rigid segments, constant length.** Every limb bone has a fixed length (see `LEN`
  in `poses.js`). Nothing is ever stretched, IK-solved, or mesh-skinned. A pose only
  chooses **angles** for rigid segments plus a whole-body offset/rotation.
- **Discrete frame-swapping.** An action plays as authored key poses swapped as whole
  frames (no interpolation/springs between them). That hard swap is the crisp sprite feel.
- **One source of truth.** Each pose is a complete authored stance, so the pose sheet
  and the match render the *same* pose — pivot on the feet baseline in every frame, so
  poses never jump when they swap.

### Zeus's kit (pilot)
- Core: `idle`, `walk` (4-frame stance footwork), `punch`, `kick`, `block`, `hit-react`, `KO`.
- **3 distinct signature moves** (not shared with any other god):
  1. **Keraunos** — thunderbolt throw (a real projectile).
  2. **Anabasis** — rising bolt-uppercut (launcher; electric arc up the fist path).
  3. **Bronte** — thunderclap overhead slam (both fists to the ground + shock ring, heavy hit-stop/shake).

### Feel = timing (all present)
- **Anticipation frame** — every strike opens on a held wind-up pose.
- **Held impact frame** — the contact pose is held, and frozen by hit-stop on connect.
- **Hit-stop** — both fighters freeze for N ticks on a confirmed hit (`ATK[*].hitstop`).
- **Screen shake** — decaying camera kick, scaled per move.
- **Smear / trail** — a motion streak + ghost limbs drawn across the strike's swing
  (`armSmear` / `drawSmear`), so a fast rigid swap still reads as motion.

## Honest pose-to-pose consistency report (as requested)
What I checked, and what's true:

- **No drift / no jumping.** Because all poses share one kit with constant segment
  lengths and one feet-pivot, I found **no** pose-to-pose limb-length changes, pivot
  jumps, or proportion drift. That consistency is guaranteed by construction, and the
  pose sheet confirms it visually.
- **Biggest decision for you — art style.** These figures are **procedural rigid vector
  figures** (a clean cel-shaded "living bronze statue" look), *not* hand-painted sprites
  like the existing lineup art (`heroes.jpg`). This was the fastest way to prove the
  pose-based motion end-to-end. The exact same pose definitions can later drive
  **exported painted PNG pose-frames** if you'd rather keep the painted look — the
  engine already frame-swaps discrete images the same way. **This is the call I most
  want your read on before going further.**
- **Hades is a literal recolor.** Placeholder Hades uses Zeus's body geometry, recolored.
  So he has no unique silhouette yet — intended, and flagged, until his own pass.
- **Walk is deliberately subtle.** It's stance-locked footwork (guard kept up), so on the
  static sheet `walk 1–4` look close to idle; the motion reads in play via the body bob +
  leg cycle. If you want a bigger visible stride, that's a one-line amplitude change.
- **The beard is the least-refined face element** — it reads as a beard now, but it's a
  large near-white shape; it could be tightened.
- **Hitboxes are reach-based**, tuned to match how far each pose actually extends the
  fist/foot (not pixel-perfect to the drawn fist). Good for feel; can be switched to
  joint-anchored later (the engine already computes the fist's world position for FX).

Nothing here is presented as final art — it's a faithful, reviewable proof of the
pose-based approach.

## If you approve — integration plan
1. Port `poses.js`'s rigid renderer into `fighter.js`, replacing the `drawCutout` /
   `drawSprite` / skeletal-vector render path. Keep the state machine, `fighter-moves.js`
   data, damage, and the existing `shake` / `hitStop` / `flash` feel globals.
2. Map each engine state (`idle/walk/jump/block/light/kick/headbutt/throw/special/aerial/
   hit/ko`) to an authored rigid pose clip; retire `springPose` / `shapeLimbs` / IK and the
   `PARTS` cutout loader.
3. Add Anabasis + Bronte to `fighter-moves.js` and Zeus's inputs.
4. **Then** author distinct pose sets for Poseidon, Athena, and Hades — one god at a time,
   each reviewed — instead of the shared-recolor placeholder.
