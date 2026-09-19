# Phase 5 — Prioritized Plan

**Branch:** `claude/games-audit` · This is a **plan only**. No build begins until Carter approves at the **audit-complete gate** below. Rig (b2) has its own second gate.

Two tracks run **in parallel**: the **Foundation track** (fighter engine, current pose layer, no art) and the **Content track** (quick, independent, no engine dependency). Every item lists **size (S/M/L)**, **dependencies**, **risk**, whether it **needs your input** or is **CC-only**, and **acceptance criteria verifiable by file, commit, or verifier**.

Sizes: **S** ≈ ≤1 day · **M** ≈ 3–5 days · **L** ≈ 5–10 days (+art where noted).

---

## Open items needing your decision

| # | Decision | Needed before | Why it blocks |
|---|---|---|---|
| **OI‑1** | **Roster: Greek‑only vs cross‑tradition.** Keep the 4 Olympians (Zeus/Poseidon/Athena/Hades, all grounded in ch08), **or** expand to cross‑tradition gods (e.g. Norse/Egyptian — Chess already models 3 pantheons). | **Step F3 (movesets)** | Determines how many kits to author, the content grounding (single ch08 vs multiple chapters), and each god's `factRef`. F1/F2 do **not** depend on it, so the foundation can start before you decide. |
| **OI‑2** | **Rig art direction & inputs** (see Rig Gate). Stay procedural, or supply drawn part art. | **Rig gate (R1)** | Decides whether R1 is code‑only or art‑dependent. |
| **OI‑3** | Fixed‑timestep logic rate (default **60 Hz**). | F1 | Trivial; assumed 60 Hz unless you say otherwise. |

---

## Ranked punch list

### FOUNDATION TRACK — fighter engine on the current pose layer (no art)

#### F1 · Fixed timestep — **S** · deps: none (OI‑3 default) · risk: low–med · **CC‑only**
Convert `fighter.js` loop (`:1001`) to a fixed 60 Hz accumulator with render interpolation; scale/remove all per‑frame constants so physics is rate‑independent.
**Acceptance (verifiable):**
- The Phase‑3 timestep harness (`scratchpad/timestep.js`, re‑runnable) reports walk distance over equal *simulated* time **within ±5 % across 60 / 120 / 144 Hz** (currently 1.00× / 1.98× / 2.19×).
- Jump time‑to‑apex is equal (±1 tick) at 60 vs 120 Hz.
- Commit on `claude/games-audit`; game still mounts clean at desktop + 390 px (harness `harness.js` shows `ok=Y`, 0 game console errors).

#### F2 · Move‑data system — **M** · deps: F1 · risk: med · **CC‑only**
Introduce the move‑table + move‑runner from `04-content-needs.md §4.2`. Migrate the 4 existing (shared) moves into data; drive timeline (startup/active/recovery in ticks), joint‑tied hitboxes, hitstop/knockback/hitstun, and cancel rules from data through the existing `applyDamage` and the clean `drawFighter` seam.
**Acceptance (verifiable):**
- New file `docs/assets/games/fighter-moves.js` (or `data/moves.json`) holds the move records; `fighter.js` reads them (no hardcoded pose/timing branches remain for migrated moves).
- A headless smoke test (extend `instrument.js`) confirms: a light attack still connects and applies damage; hitstop fires; a `cancelInto` window allows a second move before full recovery (a real 2‑hit combo — impossible today).
- Hitboxes are computed from interpolated joint positions (assert a hitbox origin tracks `hnF` within a few px of the drawn fist).
- No regression: all games still mount clean.

#### F3 · Per‑god movesets — **M** · deps: F2 **and OI‑1** · risk: med · **CC‑only (design done in Phase 4 §4.1)**
Author the distinct kits (Zeus/Poseidon/Athena/Hades, or the OI‑1 roster) as data: per‑god `walkSpeed/jumpVel/weight`, reach, damage, frame data, specials, finisher, and `factRef {chapter, basis}`.
**Acceptance (verifiable):**
- Move data exists for every roster god; an assertion script shows each god's kit **differs on ≥3 quantitative stats** (e.g. light‑reach, special behavior, startup) — i.e. no two gods share a moveset.
- Each god carries a `factRef` whose `basis` appears in its chapter (a new `verify-fighters.js` assertion passes — ties into content item D).
- Headless check: selecting each god yields visibly different reach/special behavior.

---

### RIG GATE (b2) — separate gate, only after F3 and your approval

#### R1 · Skeletal / clip rig — **M–L (+art)** · deps: F3 complete + rig‑gate approval + OI‑2 · risk: med · **needs input (art)**
Replace the pose‑evaluation/render layer with a keyframed clip player (easing + overshoot/secondary motion + IK for foot/weapon placement) that reads the **same `poseKeys`** authored in F2/F3. Combat is untouched (the seam is `drawFighter(c,f,t)`).
Two sub‑paths:
- **R1a (code‑only):** run the new rig on the **existing procedural parts** — adds fluidity (IK, secondary motion, follow‑through) with **no new art**. Can proceed at the rig gate without art.
- **R1b (art‑dependent):** swap procedural parts for drawn part art per god.

**Art inputs you (Carter) must supply for R1b** — list, explicit:
1. **Per‑god part sheets** in a neutral A/T‑pose, one image per part with a marked pivot point: `head/face`, `torso/armor`, `upper‑arm`, `forearm`, `hand/fist`, `thigh`, `shin`, `foot/sandal`, `cape`, `weapon` — ×4 gods.
2. **Signature‑move VFX** art if not procedural: Zeus bolt, Poseidon wave/quake, Athena aegis shimmer, Hades wisp/drain.
3. **Resolution / pixel scale target** and a **per‑god palette** (or confirm reuse of the current color sets).
4. **Style reference** (e.g. "smooth skeletal, 60 fps" vs "12 fps sprite‑ish").
5. Confirm reuse of the existing **portrait art** (`art/heroes.jpg`) for menus (no new portraits needed).
6. Optional **stage/background** art if stages are to be upgraded (otherwise current procedural stages stay).

**Acceptance (verifiable):**
- Rig reads F2/F3 `poseKeys`; new frame strips (re‑run `strips.js`) show a stepped/weight‑shifted punch and a real flinch (contrast the Phase‑3 strips).
- If R1b: art assets integrated; rendered page ≤ 16 MB (Artifact/site budget) and games mount clean.

---

### CONTENT TRACK — parallel, CC‑only, no engine dependency

#### D1 · Fix Pac‑Man sourcing to the Underworld chapter — **S** · deps: none · risk: low · **CC‑only**
Re‑point `data/pacman.json` facts at **ch47 "Journeys to the Underworld"** (+ related underworld material), matching the game's theme and its declared `sourceHref`.
**Acceptance:** `verify-pacman.js` exits 0; a grep shows the majority of pacman facts now reference `ch47`; game still surfaces a fact on each lamp.

#### D2 · Add Nubia + Arabia facts (Risk) — **S** · deps: none · risk: low · **CC‑only**
Add `territory` facts so all 13 territories reveal a fact on capture.
**Acceptance:** a coverage script asserts **13/13** territories have a fact; `verify-risk.js` exits 0.

#### D3 · Add verifiers to CI — **S** · deps: none · risk: low · **CC‑only**
New `.github/workflows/verify.yml` runs all `tools/verify-*.js` on push/PR and **fails on any non‑zero exit** (enforces the sourcing invariant that is currently unenforced).
**Acceptance:** workflow file exists; a CI run on the branch is green; deliberately breaking a `basis` locally makes the corresponding verifier exit non‑zero (demonstrated, then reverted).

#### D4 · Fighter surfaces archive facts — **S–M** · deps: none (dovetails with F3 `factRef`) · risk: low · **CC‑only**
Show a sourced, chapter‑linked fact per god on the select and/or result screen (and carry `chapter`+`basis` per fighter in data).
**Acceptance:** `fighters.json` (or move data) carries `chapter`+`basis` per god; a new `verify-fighters.js` assertion confirms each `basis` appears in its chapter and exits 0; a screenshot shows the fact + "Read …" link in‑game.

---

### BACKLOG — after the above, lower priority

| # | Item | Size | Deps | Input | Acceptance |
|---|---|---|---|---|---|
| **B1** | **Per‑chapter tags** (`tradition`/`theme`/`tags` on every chapter in `data.js`) to unlock cross‑game era/tradition/theme filtering | M | none | decision on tag vocabulary | assertion: every chapter has a `tradition` (or `theme`) tag; ≥1 additional game gains a working filter |
| **B2** | **Grow thin fact banks** — Pong 6→≥14, Minesweeper/Pac‑Man/Pinball 8→≥14 | M | D1 (pacman) | none | count script: each ≥ target; all verifiers exit 0 |
| **B3** | **Tap unused chapters** — add facts drawing on the 35 unused chapters (theme chapters mapped: Underworld→Pac‑Man done in D1, Apocalypse/Sacrifice/Great Goddess→Reliquary/Seeker/Risk) | L | B1 (tags help), B2 | none | coverage script: chapters surfaced by ≥1 game rises from 30 → target; verifiers exit 0 |

---

## Execution order & approval gates

```
        ┌─ AUDIT‑COMPLETE GATE (you approve this plan) ──────────────────┐
        │                                                                │
Foundation:   F1 fixed timestep ─▶ F2 move‑data ─▶ [OI‑1] ─▶ F3 movesets ─▶ ┤ RIG GATE (you) ─▶ R1 rig (+OI‑2 art)
Content   :   D1, D2, D3, D4  (start immediately, independent)  ────────────┤
Backlog   :   ................................. B1 ─▶ B2 ─▶ B3 (after above) ┘
```

- **Audit‑complete gate (now):** you approve this plan → F1 and the content track (D1–D4) may start. Nothing starts before this.
- **OI‑1** must be answered before **F3**. (F1/F2 don't need it.)
- **Rig gate:** after F3, you review, approve the rig, and supply OI‑2 art inputs (or choose R1a code‑only). Only then does R1 start.
- Content and Foundation are independent; content items are quick wins that can land while the engine work proceeds.

## Priority ordering (single list, highest first)
1. **F1 fixed timestep** (unblocks everything fighter; fixes the measured 2× bug) 
2. **D3 verifiers in CI** (cheap, protects the sourcing bar during all later work) 
3. **D1 Pac‑Man sourcing**, **D2 Risk facts** (cheap correctness fixes) 
4. **F2 move‑data system** (the foundation both tune + rig build on) 
5. **D4 fighter surfaces facts** (cheap; content‑honesty win; dovetails F3) 
6. **F3 per‑god movesets** (needs OI‑1) 
7. **R1 rig** (needs rig gate + OI‑2) 
8. **B1 → B2 → B3** backlog

---

## Summary
Foundation and Content run in parallel behind one approval gate; the rig is a second gate after movesets. The critical path is **F1 → F2 → (OI‑1) → F3 → [rig gate] → R1**, with the four content fixes (D1–D4) landing independently and cheaply alongside. Every item has a file/commit/verifier‑checkable acceptance test. **One decision (OI‑1: Greek‑only vs cross‑tradition roster) is needed from you before step F3**, and the rig's art inputs are listed for the second gate.

**Phase 5 complete — this concludes the audit. Awaiting your approval at the audit‑complete gate before any build begins.**
