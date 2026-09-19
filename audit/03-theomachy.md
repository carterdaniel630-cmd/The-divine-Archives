# Phase 3 — Theomachy Deep Dive (why the fighter feels blocky/stiff)

**Branch:** `claude/games-audit` · **Read-only.** No game code was modified. All instrumentation was done by wrapping browser APIs (canvas methods, `requestAnimationFrame`) from *outside* the game via Playwright `addInitScript` — the game source in `docs/assets/games/fighter.js` was only read.

**File:** `docs/assets/games/fighter.js` (1251 lines), roster/moves embedded inline (no data fetch).

## Instrumentation method (so the numbers are reproducible)
- Hooked `CanvasRenderingContext2D.prototype.translate` — `drawFighter` calls `translate(f.x, GROUND − f.y)` once per fighter per frame (`fighter.js:257`), so the exact sub-pixel position of each fighter every frame was captured with no code change.
- Hooked `clearRect` (frame boundary, `:1020`) and the path methods (`fill/stroke/arc/moveTo/lineTo/quadraticCurveTo/clip/…`) to count draw calls per frame.
- Replaced `requestAnimationFrame` with a manually-driven ticker to run the fight at controlled 60/120/144 Hz cadences.
- Artifacts: `audit/theomachy-frames/STRIP-{walk,light,special,hit}.png` (frame strips) and `audit/theomachy-frames/kinematics-metrics.json` (raw metrics). Headless Chromium software-renders at ~21 fps, so **absolute fps below is NOT a real-device number** — it is used only to show the *shape* of the physics; the controlled-cadence test is the authoritative timestep evidence.

---

## Q1 — How the figures are built and posed

**Not sprites, not rotations — a procedural point-skeleton drawn as stacked vector shapes.**

- **Skeleton:** `BASE` (`:93`) is 13 named 2D joint *points* — `footB, kneeB, footF, kneeF, hip, chest, neck, head, shF, elF, hnF, shB, elB, hnB` (front/back shoulder-elbow-hand, both legs, spine). Poses are joint **positions**, not joint angles.
- **Posing:** `poseFor(f, t)` (`:102`) clones `BASE` and applies **additive offsets** per state, parameterized by normalized progress `pr = stTime/stDur`:
  - Strikes (light/kick/headbutt/throw) use `strikeCurve(pr)` (`:25`) — a 3-segment anticipation→snap→recover curve (pull back to −0.5, snap to +1, ease back to 0).
  - special/aerial/hit/ko use `ease()` (`:22`).
  - idle/walk are **sine cycles** (breathing sway, leg swing).
- **Rendering of each figure** (`drawFighter`, `:244`): ~**14 composite parts** drawn every frame — ground shadow, aura, cape, back leg (a `boneChain` smooth outline), back sandal, back arm chain, back fist, torso, front leg chain, greave, front sandal, head, front arm chain, pauldron, front fist, the god's **weapon** (per-god vector fn), and damage **wounds**. Limbs are `boneChain` Path2Ds (`:210`) with cel-shading (3-tone fill + outline + lit rim + a dark "separation moat"). Only the **menu/VS/victory portraits** use raster art (`art/heroes.jpg`, `:67`); **combat is 100% procedural vector.**
- **Distinct poses per action / interpolation:** there is **one continuous procedural pose *function* per state**, not a set of discrete keyframes — so the number of "poses" is effectively infinite (continuously evaluated along the curve). Interpolation is present **twice over**:
  1. the pose formula itself is continuous (easing curves), and
  2. `drawFighter` eases a **displayed** skeleton `f.dpose` toward the computed target every frame (`:248-250`, blend factor `bf` = 0.55 for strikes, 0.30 otherwise), and **facing eases too** (`f.face += (f.facing − f.face)*0.3`, `:254` — so turnarounds are smoothed, not instant; this corrects a note in Phase 2).

**Consequence for "stiff":** the stiffness is **not** a low-frame-count or snapping problem — the animation is fully interpolated and sub-pixel. It is a **motion-design** problem (what the poses do), diagnosed in Q5.

---

## Q2 — Is combat separated from rendering? Could visuals be swapped without touching combat?

**Yes — cleanly. The combat code issues zero canvas draw calls.**

- **Combat/logic path:** `tryAttack` (`:708`), `trySpecial` (`:734`), `throwItem`, `updateShots` (`:764`), `resolveHit` (`:780`), `applyDamage` (`:797`), `think` (AI, `:964`), `humanControl` (`:1070`), `update` (`:1039`). These only **mutate the fighter state object** and trigger FX helpers. No `cx.*` drawing.
- **Render path:** `poseFor` + `drawFighter` + all `draw*` + `burst/spray/drawFX`. These only **read** state.
- **The seam is one function: `drawFighter(c, f, t)`.** Its entire contract with combat is the fighter fields: `state` (string), `stTime`/`stDur` (→ `pr`), `x`, `y`, `facing`, `face`, `hp`, `aerialKind`, `holding`, `skin`. **You can replace `poseFor` + `drawFighter` + every `draw*`/weapon fn with a sprite-sheet or skeletal-clip renderer that switches on `f.state` + `pr` and reads `f.x/f.y/f.facing`, without editing a single line of `tryAttack/resolveHit/applyDamage/update`.**

**What is entangled (all minor, list):**
1. **Hitboxes are not pose-derived.** `resolveHit` (`:780`) uses hard-coded reach distances (kick 100, headbutt 50, light 62, aerial 78×130) + a horizontal `dx` test — there are **no geometric hurtboxes** (the target is tested by distance from its center). *Good* for a visual swap (new art won't break hit detection); *bad* for feel (hits don't line up with the drawn limb — see Q5 #6).
2. **Roster skins mix data with draw fns.** Each `ROSTER` entry (`:521-612`) bundles data (name, epithet, colors) **and** rendering (`weapon: zeusBolt`, `crown: laurel`). A sprite swap rewrites the draw fns but keeps the data.
3. **Combat calls FX helpers directly** (`applyDamage` → `burst/spray/shake/hitStop/banner`, `:812-818`). Render-adjacent but trivially retained or re-pointed.
4. **`f.dpose`** (the eased display skeleton) is render-only state that lives on the fighter object; a new renderer would own its own interpolation state instead.

Net: the separation is good enough that **option (b) below is low-risk on the combat side.**

---

## Q3 — Does fixed-vs-variable timestep change behavior at 60 vs 120/144 Hz? (MEASURED)

**Yes — decisively. The fighter runs ~2× faster on a 120 Hz display.**

The loop is variable-`dt` rAF (`:1001`, `dt = min(0.05, (ts−last)/1000)`), and `hitStop` freezes the sim (`:1007`). **But the physics ignores `dt`:** movement and gravity are applied as fixed per-*frame* constants — `f.x += f.mvx` (`:1056`), `f.y += f.vy; f.vy −= 0.56` (`:1061`), `f.mvx += (f.vx − f.mvx) * accel` (`:1054`). More frames per second → more increments per second.

**Controlled-cadence measurement** (held "walk right" for an equal **0.5 s of simulated time**, driving rAF manually):

| Refresh | Frames in 0.5 s | Distance walked | Ratio vs 60 Hz |
|---|---|---|---|
| 60 Hz | 30 | **82.4 px** | 1.00× |
| 120 Hz | 60 | **162.8 px** | **1.98×** |
| 144 Hz | 72 | **180.6 px** | **2.19×** |

Same effect on the **jump**: peak height is fixed (~176 px, frame-count-based) but **airtime is frame-rate-dependent** — time-to-apex is ~22 frames ≈ **367 ms @60 Hz vs ~183 ms @120 Hz**. So on a high-refresh monitor the gods walk twice as fast and jumps snap up twice as quickly; on a slow/throttled device (or the 20 fps `dt` clamp floor) everything crawls. This is a real "feel" bug independent of the pose stiffness. **Fix: scale every per-frame delta by `dt` (or use a fixed-timestep accumulator).**

---

## Q4 — Frame strips (attached)

`audit/theomachy-frames/STRIP-{walk,light,special,hit}.png` — successive rendered frames, ~46 ms apart. The **light-attack** strip is the clearest: the front arm winds and extends (frames 2–5) then retracts, but **Zeus's feet never move and his hips/torso barely shift** — the body stays rooted while the arm does all the work. The **hit** strip shows Hades taking the punch with only a small head/chest lean — no convincing flinch, minimal knockback. These are the stiffness, visible.

---

## Detailed findings (the Phase-3 checklist)

- **Game loop / timestep:** variable-`dt` rAF, `dt` clamped to 0.05 (20 fps floor); `hitStop` freezes the sim cleanly. Physics per-frame → frame-rate dependent (Q3). Draw cost is heavy: **~1,400 canvas path-ops per frame** total (both fighters + stage + weather + FX): median per frame ≈ stroke 293, beginPath 291, lineTo 252, moveTo 241, fill 171, clip 57, arc 49, fillRect 28. Everything is re-pathed every frame (no caching of the static stage or of unchanged limbs).
- **Positions:** **sub-pixel, not integer-snapped** — 107/112 sampled `f.x` values were non-integer; `translate(f.x,…)` is never rounded. (So snapping is *not* a cause of stiffness.)
- **State machine:** states are `idle, walk, jump, aerial, block, light, kick, headbutt, throw, special, hit, ko` (grab is an instantaneous action, not a state). `setState` (`:630`) ignores same-state re-entry; "acting" states auto-return to idle/jump when `stTime ≥ stDur` (`:1065`); walk↔idle by velocity; block is held. **Cancel rules: essentially none** — `f.cooldown > 0` blocks new actions (`:709`); there are **no special-cancels, no chain/target combos, no recovery cancels**. **Input buffering: none** — attacks fire immediately on keydown (`:1236`) with no buffer window; movement is held-key state. **Input→motion latency measured ≈ 14 ms (~1 frame) — responsive; latency is not the problem.**
- **Movement:** **acceleration, not instant** — `mvx` eases toward the desired `vx` (accel 0.24/0.32, `:1053`); measured ramp 0.74 → 1.31 → 1.74 → 2.07 → 2.31 → … → ~2.9 px/frame steady (reaches steady in ~6 frames ≈ 100 ms @60 Hz). Jump `vy = 12.5`, gravity 0.56/frame, air-control drift ±2.4 (`:1075-1076`). Facing eases (0.3/frame). So momentum exists but is light and, crucially, frame-rate-scaled (Q3).
- **Combat model:** startup = `_hit.at × stDur` (e.g. light ≈ 0.24×0.32 ≈ 77 ms; kick 0.42×0.46 ≈ 193 ms) applied as a **single instantaneous hit-check at that instant** (`:1045`) — there is **no multi-frame active window**. Recovery = the remainder of `stDur`. **Hitboxes = reach distances; hurtboxes = none** (distance-from-center test). **Hitstop** 0.06/0.12/0.25 s (`:814`) — confirmed firing (frozen runs of 4 and 9 frames observed). **Hitstun** = `setState(hit)` 0.34–0.42 s + `hitLock`. **Blockstun** = guard-meter erosion with **guard break** (`:820-826`). **Pushback/knockback** = a `vx` impulse (2–6 px/frame, `:810`). **Combos** = a counter only (`:811`) — no true links (the opponent's hitstun rarely allows a real follow-up). **Specials** = one blockable projectile (`:741`); **finishers** at energy ≥ 100 & foe HP ≤ 30 (`:736`). **Throwable stage relics** + falling **debris** add variety. No rounds, no round-timer — single HP bar to KO.
- **Rendering:** procedural cel-shaded vector rig (Q1); rich FX — impact bursts, expanding rings, spark/blood particles, energy auras, screen shake, weather (rain/storm/ash), banners. **Anticipation** exists (strikeCurve pull-back) but **no follow-through overshoot, no squash-and-stretch**; limbs are rigid single-bend tubes with no hand/foot articulation.
- **AI:** intent-based **random** bot (`think`, `:964`) with a 0.45–0.6 s decision timer; picks advance/light/heavy/block/special by weighted random; **not reactive** (it does not read or respond to the opponent's current move — blocks ~18 % at random when close); **single difficulty**, **no telegraph reading**.
- **Roster:** 5 skins — Zeus, Poseidon, Athena, Hades (playable) + "Shade of the Styx" (training echo). **All gods share the same moveset** — `poseFor`/`tryAttack` are not per-character; only the **weapon/crown draw fn and colors differ** (`:521-612`). So characters are visually distinct but **mechanically identical** (same reach, damage, timings). Move definitions are **hard-coded in `poseFor`/`tryAttack`, not data-driven** — a data table per character does not exist.
- **Touch controls:** an 8-button on-screen pad (dpad: jump/left/guard/right; actions: punch/kick/special/grab, `:1142-1153`), attacks fire-on-press so they work mid-air. Mounts and lays out correctly at 390 px (verified Phase 2). No gesture/combo inputs.

---

## Q5 — Root causes of "blocky/stiff", ranked by contribution (with fix type)

1. **No root/body motion during attacks — the biggest cause.** Strikes translate the limbs but `f.x` doesn't lunge and the hips/torso/feet stay planted (visible in the light strip). Real fighters step and drive weight through a punch. → **FIX IN CODE** (add a forward hip/torso shift in `poseFor` for strike states + a short `f.x` lunge impulse in `tryAttack`). No art needed.
2. **The pose-lerp smoothing blunts impact; no overshoot/settle.** `dpose` critically-damps toward the target (`bf` 0.3–0.55, `:250`) with no spring overshoot, so the crisp `strikeCurve` snap gets averaged into mush and there's no follow-through/recoil-settle. → **CODE** (raise `bf` on active frames, add overshoot/spring, hold the contact pose 1–2 frames).
3. **Weak contact feedback.** Hitstop is short (0.06–0.12 s), knockback is small, the hit-react is a minor lean (hit strip), hitsparks don't scale or linger. Impacts don't "land." → **CODE** (longer hitstop on heavies, bigger knockback, a real flinch pose, scale/hold FX).
4. **Thin pose vocabulary; no anticipation/landing/secondary motion.** One additive formula per state; no wind-up crouch before a jump, no landing squash, no whiff-recovery pose, no turn-step; rigid tube limbs, single-bend joints, no squash-and-stretch. → **MOSTLY CODE** (more keyed pose targets + secondary motion); true fluidity (cloth, muscle, articulated hands) → **NEW ART / richer rig**.
5. **Frame-rate-dependent physics** (Q3, measured 2× @120 Hz) — movement/jump feel inconsistent across displays. → **CODE** (dt-scale all deltas or fixed timestep).
6. **Hitboxes decoupled from the visible pose.** Hits register on hard-coded distances, not the drawn limb, so contact can look disconnected from the animation. → **CODE**.
7. **Heavy per-frame redraw (~1,400 ops/frame)** compounds everything on weak hardware (drops toward the 20 fps clamp, which makes the per-frame physics crawl). → **CODE** (cache the static stage layer; cache each fighter to an offscreen buffer when its pose is unchanged) or removed entirely by **ART** (sprite sheets).

**Not causes (ruled out by measurement):** pixel-snapping (positions are sub-pixel floats), low frame-count (animation is continuous), and input latency (~1 frame). The problem is motion design + feedback + timestep, not resolution or responsiveness.

---

## Q6 — Rebuild options, effort, and recommendation

### (a) Tune the existing procedural rig — **RECOMMENDED (do this first)**
Keep the rig, combat, and art. Changes: add root/hip motion + a lunge impulse to strikes (cause #1), add overshoot/settle and higher active-frame blend to the pose-lerp (#2), strengthen hitstop/knockback + add a real flinch pose and scaled FX (#3), dt-scale the physics or add a fixed-timestep accumulator (#5), add anticipation/landing poses (#4, partial), and cache the static stage layer (#7).
- **Effort: S–M (~2–4 focused days).** **Risk: low** (rendering + a handful of physics lines; combat untouched). **Upside:** directly attacks causes #1–3, #5, #7 — the actual sources of the "stiff/blocky" perception — and should recover an estimated 70–80 % of the feel gap with zero new assets. **Ceiling:** still a vector rig; won't match a sprite-game's fidelity.

### (b) Keep combat, replace the visuals via the `drawFighter` seam
Either **(b1) sprite sheets** per state, or **(b2) a skeletal rig** with authored keyframe clips + IK. The clean seam (Q2) means combat code is untouched.
- **Effort: L.** For (b1) the cost is **art**: ~5 characters × ~10 states × N frames — large, and sprite atlases risk the no-backend / size budget. For (b2): M–L in code (a bone system + clip player) plus rigging + part art. **Risk: medium** (art pipeline, asset size). **Upside:** highest fidelity ceiling. **Requires NEW ART.**

### (c) Restructure into a "real" fighting game
Fixed-timestep engine, **data-driven frame data** (per-move startup/active/recovery + hitbox/hurtbox tied to animation), a proper cancel/combo system, rounds + timer, per-character movesets, and a reactive AI; visuals via (b).
- **Effort: XL (near-rewrite, weeks).** **Risk: high.** **Upside:** a genuine fighter. **Overkill** for one arcade entry.

### Recommendation
**Do (a) now.** It is cheap, low-risk, and fixes the top three causes plus the measured timestep bug — which is where the "blocky/stiff" impression actually comes from — without new art or combat changes. **Then, only if Theomachy is promoted to a flagship feature, follow with (b2) skeletal rig** for the fidelity ceiling, reusing the clean seam. **Skip (c)** unless the fighter becomes a headline: the combat model is already rich enough to keep, and the effort/risk isn't justified for a single game in the arcade. A useful side-fix during (a): also make the **roster mechanically distinct** (per-character reach/damage/timing via a small data table) and surface **per-god archive facts** on the select/result screens — the fighter's Phase-4 content weakness.

---

## Summary
The fighter is **well-engineered under the hood** — a clean state machine, a genuinely rich combat model (hitstop, guard break, specials, finishers, throwables), fully interpolated sub-pixel animation, and combat cleanly separated from rendering behind a single `drawFighter` seam. It feels "stiff/blocky" for reasons that are almost all **fixable in code without new art**: (1) the body stays planted through attacks, (2) the pose-lerp blunts the snap with no overshoot/settle, (3) weak contact feedback, and (5) frame-rate-dependent physics (measured at ~2× speed on 120 Hz). The recommended path is a **low-risk tuning pass (option a)**, with a **skeletal-rig visual swap (option b2)** held in reserve for later.

**Phase 3 complete. Awaiting approval before Phase 4 (content & information needs).**
