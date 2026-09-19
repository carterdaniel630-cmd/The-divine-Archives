# Phase 2 — Mechanics Breakdown (all 12 games)

**Branch:** `claude/games-audit` · **Read-only.** No game code changed.
**Method:** full source read of every module + live runs in headless Chromium (Playwright) at desktop (1100px) and mobile (390px) widths. Every game was launched via `symbols.html#play=<id>` on a local static server; menus and in-play frames were screenshotted. **All 12 mounted cleanly at both widths with no game-level console errors.** (The one console error seen everywhere is an external `ko-fi.com` resource failing TLS through the audit proxy — not a game bug.)

Ratings are 1–5 (5 best). "Fidelity" = how completely it implements the reference game's rules; "Feel" = responsiveness/juice/moment-to-moment play; "Polish" = visual finish; "Mobile" = touch usability.

---

## Cross-cutting findings (apply to several games)

1. **Frame-rate dependence (real, shared bug).** Several games advance physics by a fixed amount *per animation frame* rather than scaling by `dt`, even though their loops compute `dt`. On 120/144 Hz displays these run proportionally faster.
   - Affected: `pong.js:140` (`b.x += b.vx`), `pinball.js:173` (`b.x += b.vx/steps`, gravity per-substep), `treasure.js:158-159` (`p.x += p.vx`), `fighter.js:1056/1061` (`f.x += f.mvx`, `f.y += f.vy`).
   - **Correctly `dt`-scaled:** `pacman.js:152` (`e.prog += e.speed*dt*60`). **Loop-timed (immune):** `ouroboros.js`, `ziggurat.js`, `minesweeper.js` (setTimeout/setInterval step). Turn-based (immune): chess, reliquary, seeker, risk.
2. **Data dependency:** 11 games `fetch()` `data/<game>.json` at mount, so they require HTTP serving (fail from `file://`). All 11 have a graceful fetch-failure fallback (a "could not be loaded" placeholder) — verified in each `.catch(...)`.
3. **No shared pause / audio ducking:** ambient site audio (`ambient.js`) keeps playing over games; only ouroboros/ziggurat have an in-game pause. Minor.
4. **Score persistence** is absent for chess, fighter, risk (session-only) — acceptable for those genres, but the arcade has no cross-game "best" surfacing.
5. **Fact-surfacing is strong and consistent** across 11 games (a sourced fact + a "Read the chapter" link on each score event), with **one weak exception: the fighter** (see below).

---

## Per-game breakdown

### 1. Theomachy — `fighter.js` (1251 lines) · imitates Street Fighter / Mortal Kombat
- **Core loop:** variable-`dt` rAF (`fighter.js:1001`), `dt` clamped to 0.05; `hitStop` freezes the sim (`:1007`). Physics itself uses per-frame constants → frame-rate dependent (`:1053-1064`).
- **Rules vs reference:** a genuinely rich fighting model — state-timed **startup** (`_hit.at * stDur`, `:1045`), **hitstop** (0.06/0.12/0.25s, `:814`), **knockback** (`:810`), **blockstun via a guard meter + guard break** (`:820-826`, `:1043`), **combo counter** (`:811`), **energy specials** with **finishers** (energy≥100 & foe hp≤30, `:736`), **throwable stage relics** + **projectiles** (`:748`, `:741`), and **aerials** (`:716`). What's *missing* vs the reference genre: no rounds/round-timer (single life bar to KO), no move cancels / true combo system, no special-move inputs (specials are a single button), no crouch attacks, instant turnaround (facing flips with no animation, `:1068`).
- **Controls:** P1 A/D move, S guard, J light, K heavy (headbutt in close), L special, U grab/throw; P2 arrows + ,./ M; 6-button on-screen pad on touch.
- **Win/lose:** reduce foe HP to 0 → KO banner; no timer, no best-of-rounds.
- **AI:** intent-based random bot with a 0.45–0.6s decision timer (`:964`); **not reactive** (blocks ~18% randomly when close, doesn't read incoming moves), **no difficulty levels**.
- **Rendering:** procedural **skeletal rig** (bones/capsules + eased poses `poseFor`, `:102`), cel-shaded, per-god weapons drawn as vector art, real hero portraits from `art/heroes.jpg` on the select screen. Live frames read as **rigid puppets** — the source of the "blocky/stiff" complaint (Phase 3).
- **Archive facts:** **weakest of all games** — no per-round facts; only each god's name/epithet/weapon (grounded in ch08) and a single "Read Early Greece" link on select/result (`:1182`).
- **Performance:** heaviest module; lots of per-frame canvas path work + gradients + shadows; fine on desktop, to be measured on mobile in Phase 3.
- **Ratings — Fidelity 3 · Feel 2 · Polish 3 · Mobile 4.**

### 2. Archive Chess — `chess.js` (310) · imitates Chess
- **Core loop:** turn-based/event-driven; `setTimeout(aiMove, 220)` for AI pacing (`:237`).
- **Rules vs reference:** **complete legal chess** — castling (`:100-105`), en passant (`:68`, `:81`), promotion (auto-Queen only — no under-promotion, `:75`), check/checkmate/stalemate (`:234-235`), full attack/pin legality via make-move-and-test (`:96-98`). Three pantheons (Olympian/Egyptian/Aesir), vs **alpha-beta negamax AI at depth 3** with center-control eval + tie randomization (`:113-136`), and **local 2-player**.
- **Controls:** click/tap a god then a highlighted square; legal targets + last move + check are highlighted.
- **Facts:** on every capture, the captured god's sourced fact + chapter link (`:244`).
- **Gaps:** depth-3 AI is beatable by club players; no undo/move-list; no draw-by-repetition/50-move; promotion is Q-only.
- **Ratings — Fidelity 5 · Feel 4 · Polish 4 · Mobile 4.**

### 3. Ouroboros — `ouroboros.js` (317) · imitates Snake
- **Loop:** self-scheduling `setTimeout` at level-paced tempo (240→120ms, `:56-58`, `:270`).
- **Rules:** classic snake with **wrap-around walls** (a forgiving variant — no wall death; `:147`), self-collision death (`:150`), grow-on-eat, no-reverse guard (`:114`), per-level speed-up.
- **Controls:** arrows/WASD + on-screen d-pad + swipe; P to pause.
- **Facts:** each symbol eaten reveals a fact (`:170`), with a recap of all collected at game over.
- **Polish:** the standout visual — a tapering, gold-lit serpent with beaded sheen and a faint ouroboros watermark.
- **Ratings — Fidelity 4 · Feel 4 · Polish 5 · Mobile 5.**

### 4. Ziggurat Builder — `ziggurat.js` (380) · imitates Tetris
- **Loop:** self-scheduling `setTimeout` gravity, speed by level (820→120ms, `:331`).
- **Rules:** **7-bag randomizer** (`:72`), **ghost piece** (`:229-235`), **wall kicks** (simple 5-offset, not full SRS → no reliable T-spins, `:101`), next-piece preview, soft drop (+score) & hard drop, standard line-clear scoring (100/300/500/800 × level, `:134`). *Missing:* hold piece, lock delay (a piece locks the instant it lands — can feel unforgiving), line-clear animation.
- **Controls:** ←→ move, ↑/X/Z rotate, ↓ soft, space hard, P pause; pad + swipe on touch.
- **Facts:** one fact per completed course, revealed **in order**; a side "monument" canvas visibly builds a stepped ziggurat as you clear rows — a genuinely clever thematic touch (`:253`).
- **Ratings — Fidelity 4 · Feel 4 · Polish 5 · Mobile 4.**

### 5. The Reliquary — `reliquary.js` (233) · imitates Trivia
- **Loop:** event-driven.
- **Rules:** era + topic filters, Quick(curated)/Full sets, streak-bonus scoring (`:168`), optional AI "Archivist" opponent, results screen, local high scores. Bot accuracy is a **fixed 68%** regardless of anything (`:167`) — crude but harmless.
- **Controls:** click or keys 1–4, Enter to advance.
- **Facts:** questions are the content; every answer links to its source chapter (`:182`).
- **Ratings — Fidelity 5 · Feel 4 · Polish 4 · Mobile 5.**

### 6. The Seeker's Path — `seeker.js` (123) · imitates a riddle chain
- **Loop:** event-driven.
- **Rules:** a 10-gate chain of riddles; answers matched by **lenient substring/normalized compare** (`:85` — could accept loose input), hints, progress persisted in localStorage (`:20-22`).
- **Assessment:** the thinnest as a *game* — it's really a guided-reading device (its whole mechanic is "go read the chapter and type the word"). On-theme and well-made for what it is, but low mechanical depth by design.
- **Ratings — Fidelity 3 · Feel 3 · Polish 3 · Mobile 4.**

### 7. Antithesis — `pong.js` (302) · imitates Pong
- **Loop:** rAF; **movement not `dt`-scaled** (`:140`) → frame-rate dependent.
- **Rules:** angle-based paddle reflection from relative hit position (`:153`), progressive ball speed-up (cap 11, `:154`), spin visual, sparks/trail/motes, **3 AI tempers** (mild/even/fierce via reach+error, `:124`) **+ 2-player**, first-to-5.
- **Controls:** W/S or ↑/↓, drag anywhere on canvas, or pads; mode button cycles mild→even→fierce→2P.
- **Facts:** each point won reveals a dualism fact (`:163`).
- **Ratings — Fidelity 5 · Feel 4 · Polish 5 · Mobile 4.**

### 8. The Excavation — `minesweeper.js` (224) · imitates Minesweeper
- **Loop:** event-driven + `setInterval` clock.
- **Rules:** textbook — **first-click safety** (mines placed after first dig, safe 3×3, `:63-66`), flood-fill reveal (`:142`), flag mode + right-click + **long-press-to-flag with haptic vibrate** (`:115-120`), 3 difficulty levels, timer, win/lose with mine reveal + blast marker, score = mines×100 − seconds.
- **Facts:** a correct flag on a hazard turns up an archaeological find (`:131`, `:152`).
- **Mobile:** best-in-class touch handling (tap + long-press + vibrate).
- **Ratings — Fidelity 5 · Feel 4 · Polish 4 · Mobile 5.**

### 9. The Labyrinth — `pacman.js` (392) · imitates Pac-Man
- **Loop:** rAF, **`dt`-scaled** movement (grid-locked tween, `:140-156`).
- **Rules:** **procedurally generated maze** each game (recursive backtracker + braid for loops + guaranteed connected spines, `:54-87`), dots + 4 power lamps, **4 ghosts** with greedy-Manhattan chase + scatter randomness + **frightened mode** (flee → eaten → return to pen, `:164-178`), tunnel wrap, lives, escalating levels. *Simplification:* ghosts share one AI (no distinct Blinky/Pinky/Inky/Clyde personalities); frightened targeting is random.
- **Controls:** arrows/WASD + d-pad + swipe, with a direction **buffer** (`want`) applied at tile centers.
- **Facts:** each lamp lit reveals an underworld belief (`:213`).
- **Ratings — Fidelity 4 · Feel 4 · Polish 5 · Mobile 4.**

### 10. The Firmament — `pinball.js` (301) · imitates Pinball
- **Loop:** rAF, `dt` clamped to 0.033; physics **substepped ×5** to prevent tunneling (`:170`) but per-substep constants are not `dt`-scaled → frame-rate dependent.
- **Rules:** **real physics** — circle-vs-segment collision with restitution (`:117`), flippers driven by angular velocity (`:131-146`), slingshot kickers, 4 bumpers that **light after 3 hits** → fact + bonus, drain between flippers, 3 balls, and a **stuck-ball failsafe** (nudge, then drain, `:181-185`).
- **Controls:** ←/→ or A/D flip, Space/Launch fires; two flipper pads + launch on touch.
- **Gaps:** a single simple table; the stuck-ball nudge is a workaround for physics settling.
- **Ratings — Fidelity 4 · Feel 4 · Polish 4 · Mobile 4.**

### 11. Dominion of the Ancients — `risk.js` (401) · imitates Risk
- **Loop:** turn-based; a light rAF only fades the dice popup (`:341`).
- **Rules:** **3-way** (you + Bronze Empire + Iron Horde) over 13 territories; classic **reinforce / attack / fortify** phases, dice combat with true 3-vs-2 rules (`:149-162`), **region bonuses**, **capitals** (+1 each), **conquest cards** with escalating trade bonuses (4,6,8,10,12,15…, `:126`), and per-side AI that reinforces borders, attacks favorable odds, fortifies (`:235-265`), plus a battle log. *Simplifications:* fortify is adjacent-only (not connected-chain); attack is one dice-throw per tap (no "blitz").
- **Controls:** tap a land, then a neighbor to attack; phase button advances.
- **Facts:** each land **you** take reveals its people's belief (`:171`).
- **Mobile concern:** 344×300 canvas with ~18px-radius tap targets (`:186`) — territories are cramped and fiddly on a phone.
- **Ratings — Fidelity 4 · Feel 3 · Polish 4 · Mobile 3.**

### 12. The Tomb Robber — `treasure.js` (378) · imitates a platformer (Indiana-Jones run)
- **Loop:** rAF, `dt` clamped to 0.033; **movement not `dt`-scaled** (`:158`) → frame-rate dependent.
- **Rules:** 4 hand-authored sites; AABB tile collision (separate X/Y, `:116-134`), **one-way ledges** (`:129`), pits (fall → respawn + damage), spikes, **patrolling snakes** with edge-detection and a **stomp** mechanic (`:166-175`), camera scroll + parallax, hearts, relics-on-touch → facts, story cards between sites, evidence-honesty outro. Movement has **acceleration + friction** (`:153`), but the **jump is fixed-height** (no variable-height/coyote-time/jump-buffer, `:155`).
- **Controls:** ←/→ or A/D, ↑/Space/pad to jump; 3 touch pads.
- **Facts:** each relic recovered tells what it meant (`:181`).
- **Ratings — Fidelity 4 · Feel 3 · Polish 4 · Mobile 4.**

---

## Comparison table

| Game | Genre | Render | Loop | Fidelity | Feel | Polish | Mobile | Avg |
|---|---|---|---|:--:|:--:|:--:|:--:|:--:|
| Archive Chess | Chess | canvas+DOM | turn | 5 | 4 | 4 | 4 | **4.25** |
| The Reliquary | Trivia | DOM | event | 5 | 4 | 4 | 5 | **4.50** |
| The Excavation | Minesweeper | DOM | event+timer | 5 | 4 | 4 | 5 | **4.50** |
| Ouroboros | Snake | canvas | timed | 4 | 4 | 5 | 5 | **4.50** |
| Ziggurat Builder | Tetris | canvas | timed | 4 | 4 | 5 | 4 | **4.25** |
| Antithesis | Pong | canvas | rAF | 5 | 4 | 5 | 4 | **4.50** |
| The Labyrinth | Pac-Man | canvas | rAF | 4 | 4 | 5 | 4 | **4.25** |
| The Firmament | Pinball | canvas | rAF | 4 | 4 | 4 | 4 | **4.00** |
| The Tomb Robber | Platformer | canvas | rAF | 4 | 3 | 4 | 4 | **3.75** |
| Dominion | Risk | canvas+DOM | turn | 4 | 3 | 4 | 3 | **3.50** |
| The Seeker's Path | Riddles | DOM | event | 3 | 3 | 3 | 4 | **3.25** |
| **Theomachy** | Fighter | canvas | rAF | 3 | **2** | 3 | 4 | **3.00** |

---

## Ranked weakest games (weakest first, weighting game-polish)

1. **Theomachy (fighter)** — lowest overall and the flagship problem: rich combat *systems* undercut by stiff, puppet-like execution (Feel 2), the weakest archive-fact integration, no rounds/timer, and a non-reactive single-difficulty AI. **This is the Phase 3 deep-dive target.**
2. **The Seeker's Path** — thin as a game (guided reading, not really a mechanic) and lenient answer matching. Fine as a content feature; weak as an arcade entry.
3. **Dominion of the Ancients (risk)** — strong systems but slow pacing (many taps, AI waits) and **cramped mobile tap targets** on a 344px map — the worst mobile experience of the twelve.
4. **The Tomb Robber (treasure)** — solid platformer skeleton, but basic jump feel (fixed-height, no coyote/buffer) and frame-rate-dependent physics hold it back.

Everything from Pinball upward is genuinely solid; Snake/Pong/Trivia/Minesweeper/Tetris/Pac-Man/Chess are the strongest of the set.

---

## Summary
All 12 games are complete, functional, mobile-aware, and (11 of 12) tie archive facts to real chapters — an unusually high baseline. The clear weak point is **Theomachy**, which pairs the most ambitious combat model in the set with the least satisfying moment-to-moment feel; **Risk** (mobile) and the **shared frame-rate-dependence bug** are the next most impactful polish issues. Screenshots (desktop + mobile, menu + in-play) are saved in the audit scratchpad and can be attached on request.

**Phase 2 complete. Awaiting approval before Phase 3 (Theomachy deep dive).**
