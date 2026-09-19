# Phase 4 — Content & Information Needs (+ fighter data-system & moveset design)

**Branch:** `claude/games-audit` · **Read-only.** No game code or data changed. All figures below were extracted by parsing `docs/assets/data.js` and the 12 `data/*.json` files and by running (not modifying) the `tools/verify-*.js` scripts.

---

## Part 1 — Content inventory

### Chapters
- **65 chapters, all `status: "published"`** (nothing in draft/review/planned on the live index). 58 tradition chapters + 7 comparative-theme chapters.
- **9 eras** (each carries a `traditions` list) and **8 comparative themes** — but one theme, "The Dying & Returning God", has `chapter: null` (**a themed slot with no chapter written yet**).
- **Chapter schema:** `id, title, kind ("tradition"|"theme"), era (slug|null), eraLabel, status, source, summary`. **There is no per-chapter tradition/theme/topic tag** — the only classification is `era` + `kind` + the free-text `eraLabel`. Traditions exist only as a list on each *era*, not linked to individual chapters. (This is the tagging gap that blocks cross-game filtering — see §2.4.)

### How games pull from content
Every game loads its own `data/<game>.json`; facts are **paraphrased in the data file** and anchored to a chapter by two fields:
- `chapter` — the chapter id the fact links to (renders the "Read …" link), and
- `basis` — a short anchor phrase that **must appear verbatim in that chapter's source**, checked by `tools/verify-<game>.js`.

So sourcing is real and machine-checkable, but the surfaced text is a paraphrase, not a quote (see §3).

### Fact-bank sizes & chapter spread (per game)

| Game | Records | Distinct chapters | Notes |
|---|--:|--:|---|
| The Reliquary | **46 questions** (25 curated) | 25 | richest; tagged by era + 25 topic `cat`s; covers all 9 eras + theme |
| Archive Chess | **18 god-facts** (3 pantheons × 6 roles) | 3 (ch08 Greek, + Egyptian, Norse) | healthy; one fact per piece-role |
| The Tomb Robber | 17 | 5 | 4 levels (ch02/03/04/06) + story text |
| Ouroboros | 14 | **14** | best chapter spread of the action games |
| Ziggurat Builder | 12 | **1** (ch03) | single-chapter (thematically scoped to Mesopotamia) |
| Dominion (Risk) | 11 | 9 | **only 11 of 13 territories have a fact** (see gaps) |
| The Seeker's Path | 10 clues | 10 | one chapter per gate |
| The Excavation | **8** | 4 | thin |
| The Labyrinth (Pac-Man) | **8** | 3 (ch02/03/08) | thin **and mis-sourced** (see gaps) |
| The Firmament (Pinball) | **8** | **1** (ch46) | single-chapter (Creation) |
| Antithesis (Pong) | **6** | 3 | **thinnest fact bank** |
| Theomachy (fighter) | **0 facts** (4 epithet/weapon rows) | 0 | **surfaces no chapter facts at all** |

---

## Part 2 — Gaps

### 2.1 Thin fact banks (facts repeat within a single session)
- **Pong (6)**, **Minesweeper (8)**, **Pac-Man (8)**, **Pinball (8)** are the shallow banks. Pong is worst: a first-to-5 match can surface up to ~9 points against only 6 facts, so repeats are guaranteed. Target ~12–16 each so a full session rarely repeats.
- **Fighter (0)** — no chapter-linked facts during or after play; only 4 epithet/weapon metadata rows. Weakest content integration in the set (consistent with Phase 3).

### 2.2 Mis-sourced / mismatched content
- **Pac-Man ("The Labyrinth", the maze of the dead)** declares its source as **ch47 "Journeys to the Underworld"** (`pacman.js:37`) but its 8 facts are pulled from **ch02/ch03/ch08** (Egypt/Mesopotamia/Greece). The one chapter that is literally about the underworld is **not surfaced by the underworld game.** Re-point its facts at ch47 (+ related underworld material).
- **Risk:** territories **`nubia`** and **`arabia`** have no fact — capturing them reveals nothing. Add 2 facts to cover all 13.

### 2.3 Large untapped content pool
**Only 30 of 65 published chapters are surfaced by any game; 35 are never used.** The unused set includes major traditions and — most usefully — theme chapters that map cleanly onto existing games:

- **Theme chapters ready to plug in:** ch47 Journeys to the Underworld → **Pac-Man**; ch46 Creation → already used by Pinball; ch50 The End of Days → an **apocalypse** angle for a game; ch51 Sacrifice & the Scapegoat, ch48 The Great Goddess, ch49 Sacred Kingship → Reliquary/Seeker/Risk fodder.
- **Major unused traditions** (rich, would broaden every fact bank): Classical Greece (ch15), Gnosticism (ch17), Roman Mystery Cults (ch18), Rabbinic Judaism (ch19), Mahayana (ch20), Patristic Christianity (ch22), Tantra (ch24), Shinto (ch25), Sufism (ch27), Scholasticism (ch28), Bhakti (ch30), Witch Trials (ch32), African Diaspora (ch40), plus ch52–ch65.

### 2.4 Tagging gap that blocks filtering
Only the **Reliquary** filters by era/topic, and it does so with **its own `era` + `cat` tags baked into each question** — not from chapter metadata. Because chapters carry **no tradition/theme/topic tag**, any other game (or a shared, filterable fact bank) can't classify facts without re-tagging by hand. To enable era/tradition/theme filtering across games, either (a) add `tradition`/`theme`/`tags` fields to each chapter in `data.js` and derive fact tags from `chapter`, or (b) require every fact record to carry `era`+`tradition` tags like the Reliquary already does. Option (a) is the single source of truth and unlocks the whole layer.

---

## Part 3 — Evidence-honesty check

**Current state: clean, with two process risks.**

- **All 12 `verify-*.js` pass** right now — every `basis` anchor appears in its chapter. The sourcing invariant holds today.
- **Contested claims are handled correctly.** Spot-checks of the sensitive topics show the games *reinforce* the archive's standard rather than violating it: Indus Valley → "a genuinely open question / its script has never been read"; Neolithic Göbekli Tepe → framed as Klaus Schmidt *"argued that…"* (attributed, not asserted); Wicca → "a modern religion assembled in living memory"; Satanism → explicitly "separates the invented Devil-cult of persecutors from real modern (mostly atheistic) Satanism." No question was found asserting a contested claim as settled fact.
- **Risk 1 — verifiers are not enforced.** `.github/workflows/deploy.yml` only deploys; **nothing runs `verify-*.js` in CI**, so a future edit could break a `basis` anchor and still ship. Wire the verifiers into a CI check (and/or a pre-deploy step).
- **Risk 2 — paraphrase drift.** `verify` only checks that the `basis` substring exists in the chapter; the surfaced `fact` is a paraphrase that could still overstate or flatten a nuance the chapter is careful about, even while containing the anchor. This is a manual-review item, not something the current tooling catches. Recommend a periodic human spot-review of `fact` text against sources (Carter's batch pass), and consider adding an optional `quote` field for the strongest claims.
- **Fighter:** epithets/weapons are grounded in ch08 (verify-fighters passes) but never surfaced in play — an integration gap, not an accuracy one.

---

## Part 4 — Fighter: per-god movesets + data-driven move system (design, not built)

Per the revised standard: each god needs a **distinct** moveset, and moves must be **defined as data** that drives **both** combat and animation. Below is the design + spec to build against (build happens only after the audit-complete gate).

### 4.1 Per-god moveset design (4 distinct kits, all myth-grounded in ch08 + each god's domain)

Same 3-button control surface (light / heavy / special) but distinct archetypes, frame data, reach, and specials:

| God | Archetype | Light | Heavy | Special | Signature / finisher | Frame-data feel |
|---|---|---|---|---|---|---|
| **Zeus** — thunderbolt | Balanced zoner | quick jab | overhead bolt-smash | **Keraunos**: fast straight bolt projectile (chargeable → calls a vertical lightning strike at range) | sky-splitting bolt (screen flash) | average startup/recovery; strong ranged control |
| **Poseidon** — trident | Long-reach spacer | longest-reach trident poke | wide sweep | **Tidal Surge**: horizontal wave, low damage / **high knockback** + **Earth-Shaker** ground-pound shockwave vs grounded foes | tsunami push to the wall | slower startup, biggest reach & pushback |
| **Athena** — spear + aegis | Technical counter/defense | fast spear thrust | **aegis shield-bash** (guard-break property) | **Aegis Ward**: raise shield to **reflect/negate a projectile** (counter window) + spear lunge | shield-parry → riposte | fastest recovery; anti-projectile, punish-based |
| **Hades** — bident | Close pressure + sustain | bident jab | **bident hook** that *pulls the foe in* (sets up pressure) | **Shades of the Styx**: homing spectral wisp / small **life-drain** on hit (thematic to the dead) | drag into the underworld (stun) | slower startup, high reward up close, sustain |

Differentiation is expressed as data (below): reach, damage, startup/active/recovery ticks, knockback vectors, meter cost/gain, special behavior, and per-god `walkSpeed`/`jumpVel`/`weight`. The current engine already draws each god's weapon distinctly, so the visual hooks exist.

### 4.2 Data-driven move-system spec

**Goal:** one data record per move that the *same* runtime reads to (i) advance combat timing/hitboxes and (ii) drive the animation — so combat and animation can never drift apart, and Phase-3 root causes are fixed *in data*.

**Character record:**
```
character = {
  id, skin,                       // skin = colors + weapon/crown draw fns (existing ROSTER data)
  walkSpeed, jumpVel, gravity, weight,   // per-god locomotion (fixes "all move identically")
  moves: { light, heavy, special, throw, ... },  // ids into the move table
  finisher, factRef: { chapter, basis } // surfaces a per-god archive fact (fixes content gap)
}
```

**Move record (frame-based; ticks at the fixed 60 Hz logic step):**
```
move = {
  id, input,                      // which button / state triggers it
  timeline: { startup: N, active: [a,b], recovery: M },   // in ticks
  cancelInto: [moveIds],          // cancel rules → enables real combos
  cancelWindow: [start,end],      // when a cancel is allowed
  poseKeys: [                     // ANIMATION = keyframes as joint offsets over the skeleton
    { at: 0,           pose: {…jointDeltas}, ease: 'out' },
    { at: startup,     pose: {…contactPose} },   // the strike pose at first-active
    { at: a+b,         pose: {…} },
    { at: total,       pose: {} }                // return to BASE
  ],
  rootMotion: [ { at, dx, dy } ], // BODY LUNGE — fixes Phase-3 cause #1 (planted body)
  hitboxes: [                     // JOINT-TIED — fixes Phase-3 cause #6 (decoupled boxes)
    { joint: 'hnF', ox, oy, r, activeFrames: [a,b] }
  ],
  onHit:   { damage, hitstop, hitstun, blockstun, knockback:{x,y}, launch:false },
  onBlock: { chipDamage, guardDamage, pushback },
  meter:   { cost, gain },
  fx:      { contact:'heavy', trail:'bolt', shake, hold:2 }  // impact hold = the "pop"
}
```

**Runtime (the move-runner) — how it maps onto the existing clean seam (Phase 3, Q2):**
1. **Fixed timestep first** (build item #5): a 60 Hz accumulator drives logic ticks; rendering interpolates between the last two ticks. This removes the measured frame-rate dependence and makes timing (startup/active/recovery in ticks) exact.
2. On each tick, advance the active move's frame counter; when `frame ∈ active` and a `hitbox` is live, compute the box from the **current interpolated joint position** and feed the **existing `applyDamage`** with the move's `onHit`/`onBlock` values (hitstop, knockback, hitstun all come from data now, not hardcoded constants).
3. `poseKeys` are interpolated (with easing + optional overshoot) into the skeleton and handed to **`drawFighter` unchanged** — the render seam stays `drawFighter(c, f, t)` reading `f.state`/pose/`x`/`y`/`facing`. `rootMotion` writes into `f.x` so the body actually steps (Phase-3 cause #1).
4. `cancelInto`/`cancelWindow` replace the current all-or-nothing `cooldown` gate → real combos become possible.

This satisfies the requirement exactly: **moves as data (frames, pose keys, joint-tied hitboxes, hitstop, knockback, cancel rules) driving both combat and animation**, and it is a superset of the current hardcoded `poseFor`+`tryAttack` behaviour, migrated into tables.

### 4.3 Scoped recommendation — (a) tune **and** (b2) skeletal rig, together

The Phase-3 options (a) and (b2) share one foundation — the move-data system — so they should be built as one track, not sequenced as "tune now, rig maybe later":

- The **fixed timestep** (#5) and **move-data system** are prerequisites for *both*. Once moves are data, the "tune existing rig" improvements from option (a) — root motion, overshoot/settle, stronger hitstop/knockback, joint-tied hitboxes — become **values and poseKeys in the move files**, not throwaway code. So (a)'s work is *authored as data* and carries directly into (b2).
- **(b2) the rig** then only replaces the pose-evaluation/render layer with a proper keyframed clip player (easing + secondary motion + IK for foot/weapon placement), **reading the same `poseKeys`**. Nothing in combat changes; the seam is already clean.
- Net: (a) and (b2) overlap ~70 % (the data system + fixed timestep). The incremental cost of (b2) over (a) is the clip/IK renderer and richer part art — worth doing in the same track so the tuning isn't thrown away.

**Build order (as directed, gated on audit approval):**
1. **#5 Fixed timestep** — S (~0.5–1 day). Convert loop to a 60 Hz accumulator + render interpolation; dt-decouple. Removes the measured 2× frame-rate bug.
2. **Move-data system** — M (~3–5 days). Schema (§4.2) + move-runner wired into the existing state machine/`applyDamage`; migrate the current 4 shared moves into data as a baseline.
3. **Per-god movesets** — M (~3–5 days incl. tuning). Author the 4 kits (§4.1) as data; per-god locomotion; add each god's `factRef` so the fighter finally surfaces a sourced fact.
4. **Rig (b2)** — M–L (~5–10 days + art). Clip/IK renderer reading the same poseKeys; secondary motion; richer parts. This is where "fluid from fight sequence to animation" lands.

Rough total: ~2.5–4 weeks of engineering + art for step 4. Content work (Part 1–3 fixes) can run in parallel and independently.

---

## Summary
Content sourcing is **healthy and honest** — 65 published chapters, a real machine-checkable `basis`/`chapter` sourcing scheme, all 12 verifiers currently passing, and contested topics framed correctly. The gaps are **breadth and enforcement**, not accuracy: thin fact banks (pong/minesweeper/pacman/pinball), the fighter surfacing no facts, Pac-Man mis-sourced away from the actual Underworld chapter, 2 Risk territories with no fact, **35 of 65 chapters unused** (including theme chapters that map onto existing games), **no per-chapter tags** to enable cross-game filtering, and **verifiers not run in CI**. For the fighter, the design is specified: **4 distinct myth-grounded movesets** and a **data-driven move system** where one record per move drives both combat and animation — the foundation shared by the (a)-tune and (b2)-rig work, to be built in the order fixed-timestep → move-data → movesets → rig.

**Phase 4 complete. Awaiting approval before Phase 5 (the prioritized plan).**
