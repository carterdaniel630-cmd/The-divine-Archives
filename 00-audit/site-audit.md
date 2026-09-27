# Site audit — The Divine Archives (`main`)

- **Audited commit:** `bf89a0f` (main, 2026-09-27)
- **Mode:** read-only. The only file written is this report. No code, asset or config was changed.
- **Method:** measured from the repository (git, grep, scripted reference scans, and loading the built site in headless Chromium). Findings that need the live site or a dashboard are tagged `needs-live-check`.
- **Stages:** 1 Dead code · 2 Doc drift · 3 Games · 4 Branch inventory. Each stage is appended after approval.

---

## Stage 1 — Dead code

### 1.1 Legacy hosting config

| Item | Where | Finding | Recommendation |
|---|---|---|---|
| `CNAME` | `docs/CNAME:1` (`getconexto.com`) | GitHub Pages artifact. The site deploys to **Cloudflare Pages** via `wrangler pages deploy docs` (`.github/workflows/deploy.yml:56-62`). Cloudflare Pages ignores `CNAME`; the custom domain is set in the Cloudflare dashboard. Nothing reads this file. | Remove, once the dashboard domain is confirmed (`needs-live-check`). |
| `.nojekyll`, `_config.yml` | — | Absent. No other GitHub Pages config remains. | — |
| `_headers` | `docs/_headers` | **Live**: Cloudflare Pages reads it (security headers, cache control). Keep. | Keep. |
| `404.html`, `robots.txt` | `docs/` | **Live**: used by the host and crawlers, not by links. Keep. | Keep. |

### 1.2 A Pages Function that is probably not deployed

`docs/functions/api/subscribe.js` implements `POST /api/subscribe` for the home-page email form (`docs/index.html:502-516`). Cloudflare Pages reads Functions from a `functions/` directory **in the directory where `wrangler pages deploy` runs**, which in `deploy.yml:59` is the repo root, not inside the deployed `docs/` folder. The repo has no root-level `functions/`. So:

- the function is very probably **not deployed**, and the form's `fetch("/api/subscribe")` gets a 405 or 404;
- the source file is **served publicly** as a static asset at `/functions/api/subscribe.js`.

**Tag:** `needs-live-check` (POST to `https://getconexto.com/api/subscribe` to confirm). Egress to the live site is blocked in this environment.
**Recommendation:** move it to `/functions/api/subscribe.js` at the repo root (and run wrangler from the root with `docs` as the output), or remove the form.

### 1.3 Unreferenced or unloaded files

| File | Size | Finding | Recommendation |
|---|---|---|---|
| `docs/assets/chapters.js` | 1.4 MB | **No page loads it** (checked every non-generated HTML page). It is the authoring source that `tools/build-chapters.js` and `tools/build-pages.js` read at build time, but it sits inside the deployed folder, so it ships to the CDN and is publicly downloadable. | Move it out of `docs/` (e.g. `content/chapters.js`) and update the two build scripts. |
| `docs/assets/games/art/sprites/*.png` (28 files) | 5.4 MB | Painted full-body sprites for the four gods. `loadSprites()` (`fighter.js:117-127`, called at `fighter.js:2130`) **downloads all 28 every time the fighter opens**. They are drawn only if a god's cut-out parts fail to load (`fighter.js:716-717`), and all four gods have complete parts (every `parts/*/manifest.json` matches its files exactly). In normal play they are never shown. | Load them lazily only on a parts failure, or drop the sprite path (see 1.4). |
| `docs/assets/games/art/sprites/sprite-meta.json` | small | Never fetched: the same values are hard-coded as `SPRITE_META` (`fighter.js:111`). | Remove, or read it instead of the constant. |
| `docs/assets/games/art/SPRITE-ART-SPEC.md` | small | An internal art brief inside the deployed folder, served publicly. Nothing links to it. | Move to a non-deployed folder. |
| `tools/extract-side-parts.py` | — | Not referenced by any workflow, script or doc. A one-off helper used to cut the side-view fighter parts. | Keep as a documented tool, or remove. |
| `docs/chapter.html`, `docs/era.html` | tiny | `noindex` legacy redirectors from `?id=` / `?era=` URLs to the prerendered pages. Nothing on the site links to them. They exist only for old external links and bookmarks. | Keep for now; retire later, or replace with `_redirects` rules. |
| `docs/assets/vendor/*/LICENSE*.txt` | small | Unreferenced, but they are the licences for bundled OpenSeadragon and the Noto Egyptian font (OFL). | Keep (licence obligation). |

Fighter art that looked unreferenced by filename but **is live**: `art/parts/<god>/*.png` (loaded by name from each `manifest.json`, `fighter.js:137-148`) and `art/heroes.jpg` (select-screen portraits, `fighter.js:75, 94-97, 1974`).

### 1.4 Dead or effectively-dead JavaScript

Declared-but-never-called functions across `docs/assets/**/*.js`, `docs/functions` and `tools/` (scripted scan, then checked by hand):

| Code | Where | Status |
|---|---|---|
| `shapeLimbs()` | `docs/assets/games/fighter.js:241-247` | **Never called.** Superseded by `anatomicalPose()` in commit `897bf28`. |
| `solveMid()`, `ik2()` | `fighter.js:228-240` | Called only by `shapeLimbs`, so **transitively dead**. |
| `bone()` | `fighter.js:499-502` | **Never called** (only `boneChain` is used). |
| Head-on-body rig: `FIGHTER_ART`, `drawFaceMesh()`, `drawHeadArt()` | `fighter.js:1095-1224`, gate at `fighter.js:110` and `748` | **Dead**: gated behind the constant `USE_HEAD_RIG = false`. About 130 lines. |
| Sprite renderer: `loadSprites`, `stateToPose`, `frameFor`, `updateSpriteAnim`, `drawSprite` | `fighter.js:111-127, 539-600`, branch at `716-717` | **Effectively dead**: runs only when a god's cut-out parts fail to load. It still costs a 5.4 MB download (1.3). |
| Procedural body (`drawTorso`, `drawHead`, `drawPauldron`, `drawGreave`, `drawSandal`, `drawFist`, `drawCape`, `darkHelm`, `warHelm`, `athenaSpear`, `poseidonTrident` and the rest of `drawFighter`) | `fighter.js:718-1060` approx. | **Fallback only**: draws while the part PNGs are loading, or if they fail. A legitimate safety net, but about 340 lines kept for a split second of loading. |
| `renderEra()`, `renderTraditions()`, `renderChapter()` | `docs/assets/archive.js:53-240`, boot at `249-251` | **Dead in production.** `archive.js` is loaded only by `index.html`, which has none of the mount elements (`#era-mount`, `#traditions-mount`, `#chapter-mount`). The era and traditions pages that do have mounts are prerendered and don't load `archive.js`. Only `wireSearch()` runs. |
| `onRequestPost()` | `docs/functions/api/subscribe.js:26` | Framework entry point, not dead code, but see 1.2: probably not deployed. |

### 1.5 Unused CSS

Scripted scan of every class selector against all HTML and JS (generated pages excluded). Class names built by string concatenation (`"theme-" + …`, `"gate-" + …`, `"cx-" + side`, `"fg-" + side`, `"vn-" + kind`, `"s-" + kind`) were resolved against the data before counting anything as unused. The ones below are genuinely unused:

| Selector | Where | Note |
|---|---|---|
| `.ambient-toggle` (whole block) | `docs/assets/archive.css:288-313`, `504` | The audio control was rebuilt as `.da-audio` (`ambient.js:352-360`); nothing emits `.ambient-toggle`. About 25 lines. |
| `.grid-2` | `archive.css:240` | Not used by any page or builder. |
| `.game-rule--scorch` | `docs/assets/games/games.css:161` | Unused modifier. |
| `.zig-controls` | `games.css:327` | Ziggurat uses `.ouro-controls` / `.zig-pad`. |
| `.rk-you`, `.rk-empire`, `.rk-horde` | `games.css:446` | The Risk HUD no longer emits these. |
| `.s-en` | `docs/assets/vault/relic.css:524` | No scroll column uses `kind: "en"`. |
| `.is-empty` | `docs/assets/vault/vault.css:46` | `study.js` never sets it. |

The unused CSS is small (about 40 lines in total); the dead JavaScript and unloaded assets matter more.

### 1.6 Related observation (not dead code)

- `v01` Voynich Manuscript is the only Vault item with no `artifact` (interactive object). It relies on the page-image study viewer. The project rule is that every entry has an interactive object (`docs/assets/vault-data.js`, first item).

### Stage 1 summary

- **Biggest waste:** 5.4 MB of sprites downloaded on every fighter open but never drawn, and the 1.4 MB `chapters.js` source deployed but never loaded.
- **Likely-broken feature:** the email-subscribe function probably isn't deployed (`needs-live-check`).
- **Dead code:** about 130 lines behind `USE_HEAD_RIG`, plus `shapeLimbs`/`solveMid`/`ik2`/`bone` in the fighter; about 190 lines of `archive.js` render code that never runs in production; about 40 lines of unused CSS.
- **Legacy config:** only `docs/CNAME` remains from GitHub Pages.

---

## Stage 2 — Doc drift

Ground truth, measured on `main` at `bf89a0f`:

| Fact | Actual state | Evidence |
|---|---|---|
| Chapters | **65 published** (58 tradition chapters in `eras/`, 7 theme chapters in `themes/`): 46 without a pending tag, **19 with** (ch26–ch44 range) | `docs/assets/data.js` (`ARCHIVE.chapters`, all `status: "published"`); `pending: true` on 19; every `docs/chapters/chNN.html` banner matches its flag |
| Source logs | 65/65 chapters + 77/77 Vault entries + `sources/pantheon.md` | `sources/` |
| Chapter format | 65/65 have a symbology section and an evidence-honesty section in both the `.md` and the built page | scripted check |
| Other content | Vault: 77 entries (V01–V77) + 10 queued; Pantheon: 199 figures; 12 games | `vault-data.js`, `pantheon-data.js`, `symbols.html:79-91` |
| Deploy | **Cloudflare Pages** via GitHub Actions on every push to `main` (`wrangler pages deploy docs`), plus a manual `preview` alias | `.github/workflows/deploy.yml:8-11, 56-62` |
| Build | Static output is **committed**. Prerendering is done locally by `tools/build-vault.js`, `tools/build-chapters.js`, `tools/build-pages.js`; CI has no build step, only verification (`verify.yml`, `game-runtime.yml`) | `tools/`, `.github/workflows/` |
| GitHub default branch | **`claude/session-start-ikztvo`**, *not* `main`. It stopped at `6474251` (2026-08-17) and is **172 commits behind `main`**, 0 ahead | `git ls-remote --symref origin HEAD`; `git rev-list --count` |

### 2.1 README.md — badly out of date (every section drifts)

| Line(s) | Claim | Reality |
|---|---|---|
| `README.md:17-28` | "Hard review gate": Carter approves before a chapter is published; drafts wait in `/drafts/`. | Replaced by CLAUDE.md's **auto-publish + pending-review tag** policy (`CLAUDE.md:76-87`). `drafts/` holds only `.gitkeep`. |
| `README.md:37-39` | `eras/` and `themes/` hold only **approved** chapters; "everything starts in drafts". | Chapters are written straight into `eras/`/`themes/` and published with a pending tag. |
| `README.md:32-43` | Layout lists 6 entries. | Missing: `vault/` (77 Vault entries), `tools/` (build and verify scripts), `.github/workflows/`, `00-audit/`, `stages/`, `icm/`, `mini-games/`. |
| `README.md:41` | `docs/` "served by GitHub Pages". | Served by **Cloudflare Pages**. |
| `README.md:47-49` | "Plain HTML… **no build step**." | Three prerender scripts generate the chapter, era, Vault, listing, search and sitemap pages; their output is committed. |
| `README.md:51-54` | Unapproved chapters show an "awaiting review" placeholder, and their text never ships. | No `planned`/`draft` entries exist; every chapter ships, with a pending banner instead. |
| `README.md:56-64` | "Going live (GitHub Pages + custom domain)": Pages settings, `docs/CNAME`, DNS A records at GitHub. | Obsolete. The domain is attached in Cloudflare; `docs/CNAME` is unused (Stage 1.1). Following these steps would be wrong. |
| `README.md:66-72` | "**Two chapters** are approved and published… website ready to deploy… remaining traditions appear as 'in preparation'." | 65 chapters live, plus the Vault, the Pantheon and 12 games; the site has been deployed for weeks; there are no "in preparation" entries. |

Because the default branch is stale (below), this is also the README visitors see on GitHub. Its Status section is byte-identical there.

### 2.2 CLAUDE.md — mostly accurate on policy, incomplete on structure

| Line(s) | Claim | Reality |
|---|---|---|
| `CLAUDE.md:8-24` | File structure: `/eras/`, `/outline/`, `/sources/`. | Also `/themes/` (the 7 theme chapters, including the ch01 template it cites at `:30`), `/vault/`, `/docs/`, `/tools/`. The file never mentions `themes/`, although `:71` points to `ch01-the-flood.md`, which lives there. |
| `CLAUDE.md:21` | `master-outline.md` is "copy from chat-provided version". | Still the placeholder scaffold: `outline/master-outline.md:1-7` says "PLACEHOLDER — replace with the chat-provided master outline". |
| `CLAUDE.md:76-87` | Every newly published chapter carries the pending tag until Carter clears it in a batch. | **Implemented and consistent**: 19 chapters carry the tag and the banners match the data. The 21 cleared chapters ch45–ch65 were cleared by commit `f976538` (2026-09-14, "Clear the review tag on the 19 new chapters (ch47–ch65)"); ch45 and ch46 were published untagged. Whether Carter approved that batch can't be verified from the repo. |
| `CLAUDE.md:117-126` | Site structure: home → era → tradition → chapter → about/methodology. | Accurate as far as it goes. The site has since added Themes, Compare, Search, **Symbols + 12 games**, the **Vault** (77 pages) and the **Pantheon**. None is described in CLAUDE.md, including the Vault's own rules (batches of 10, interactive object per entry, placement on era and chapter pages), which exist only in conversation and `outline/master-outline.md:139`. |
| `CLAUDE.md` (whole) | — | Nothing about the default branch, deploy trigger, or build scripts, so a new session has no written instruction to run `build-vault → build-chapters → build-pages` before committing. |
| `CLAUDE.md:1-24` (era examples) | Era contents. | Accurate for the listed traditions (checked against `data.js` era slugs). |

### 2.3 Default branch

- The GitHub default branch is **`claude/session-start-ikztvo`** (`6474251`, last commit 2026-08-17, merge of PR #6), **172 commits behind `main`** and 0 ahead.
- Production deploys only from `main` (`deploy.yml:8-11`).
- **Effects:** the repo home page shows an August README and file tree; new PRs target the stale branch by default; `git clone` checks it out; any tool that assumes "default branch = production" is wrong.
- **Recommendation:** set the default branch to `main` in GitHub Settings → Branches (a dashboard change; per CLAUDE.md, infrastructure changes need Carter's instruction).

### 2.4 Outline and planning docs

| File | Drift |
|---|---|
| `outline/master-outline.md:1-7` | Placeholder header, never replaced. |
| `outline/master-outline.md:50, 60-123` | Status board: "bringing the archive to **44 chapters**"; the table has 44 rows (25 CLEARED, 19 PENDING). **ch45–ch65 (21 chapters) have no rows**, although they are live. The 44 rows that exist agree with `data.js`. |
| `00-audit/CONTEXT.md` (2026-08-16) | Historical, not maintained. Says 24 chapters; F1.3 "zero external requests, no web fonts", but `archive.css:6` now `@import`s Google Fonts, and the Vault loads Google Fonts and IIIF viewers; F1.1 `chapters.js` "404 KB" is now 1.4 MB. Should be marked superseded by this report. |
| `stages/00-audit/CONTEXT.md` | Validated against "44 chapters"; superseded. |
| `icm/BATCH-I-READY-FOR-REVIEW.md:3, 15` | "Held off production… not merged"; "42 chapters". Long since merged; stale status file. |
| `stages/01-ssg-indexing/CONTEXT.md:4` | "Nothing deployed; nothing merged." The work shipped. |

### 2.5 Drift visible on the live site

| Where | Text | Reality |
|---|---|---|
| `docs/index.html:369` | "More games are on the way — a treasure-hunt adventure, pinball, minesweeper and others" | All three are live (Tomb Robber, Firmament, Excavation). |
| `docs/symbols.html:~105-135` | Per-game `phaseNote` placeholders ("Built in Phase 2…", "In development"). | Not user-visible today (shown only if a game module fails to register), but the fighter note still calls it "In development". |

### Stage 2 summary

- **Most consequential:** the GitHub default branch is a stale August branch, 172 commits behind production.
- **README** is wrong in every section: review gate, layout, hosting, build, going-live steps and status. It still says two chapters; there are 65.
- **CLAUDE.md** policy text matches the implementation. Its file structure omits `themes/`, `vault/`, `docs/` and `tools/`, and it documents neither the build pipeline nor the Vault, Pantheon or games.
- **Master outline** is still a placeholder, and its status board stops at 44 of 65 chapters.
- **Four planning docs** (`00-audit/CONTEXT.md`, `stages/00-audit`, `stages/01-ssg-indexing`, `icm/BATCH-I…`) report statuses that are no longer true.

---

## Stage 3 — Games

Paths are under `docs/assets/games/`. Twelve games are registered on `docs/symbols.html:79-91`.

### 3.1 Summary table

| Game | Genre | Tick model | Input | Frame / timing data | Refresh-rate safe? |
|---|---|---|---|---|---|
| **Divine Casualties** `fighter.js` | 2D fighter | **Fixed 60 Hz step** with accumulator, `MAXSTEPS = 5`, render interpolation (`fighter.js:51-54`, `stepSim` `:1798`) | `keydown`/`keyup` into a `keys{}` map for movement; **attacks fire directly from `keydown`** (`:2111-2123`); touch pad (`:2042`) | **Yes**: per-move `startup/active/recovery/total` in ticks, `onHit {damage, hitstop, knockback}`, `cancelInto/cancelWindow` (`fighter-moves.js:5-120`); per-god overrides and stats (`fighter-moves.js:133-196`) | Yes (fixed step) |
| **Ziggurat Builder** `ziggurat.js` | Tetris-like | `setTimeout` gravity at `dropMs() = max(120, 820 − 70·(level−1))` ms (`:376-386`); redraws only on events | `keydown` → one action per event (`:351-360`); swipe/tap | Gravity table only | Yes (timer-based) |
| **Ouroboros** `ouroboros.js` | Snake | `setTimeout` step at `speedFor(level)` = 240 → 120 ms (`:56-58, 309-312`) + rAF for ambient art (`:339`) | `keydown`, swipe, pad; **one-slot direction latch** `nextDir` (`:112-118, 148`) | Speed table | Yes |
| **The Labyrinth** `pacman.js` | Pac-Man | rAF, variable `dt` clamped to 50 ms (`:358`); movement `prog += speed·dt·60` (`:152`) | `keydown`, swipe, pad; **pre-turn buffer** `player.want` (`:129, 143-144`) | Ghost/fright timers in seconds | Yes (dt-scaled) |
| **Antithesis** `pong.js` | Pong | rAF, `dt` clamped to 50 ms (`:248`), but **physics is per frame**: `b.x += b.vx`, paddles `±6.4` per frame (`:136-140`) | keys, mouse drag, touch drag, pads | — | **No**: about 2.4× faster at 144 Hz |
| **The Firmament** `pinball.js` | Pinball | rAF, `dt` ≤ 33 ms (`:301`); 5 substeps per frame (`:44, 173-176`), but **per-frame gravity and velocity** | keys, mouse, touch | — | **No**: substeps prevent tunnelling but speed scales with refresh |
| **The Tomb Robber** `treasure.js` | Platformer | rAF, `dt` ≤ 33 ms (`:252`), but **per-frame physics**: `vx += 0.6`, `vy += 0.5`, `x += vx` (`:152-158`) | keys, mouse, touch | — | **No** |
| **The Excavation** `minesweeper.js` | Minesweeper | Event-driven; 1 s `setInterval` clock (`:175`) | click, right-click/`contextmenu`, long-press (`:117`), flag mode | — | n/a |
| **Archive Chess** `chess.js` | Chess | Turn-based; AI via `setTimeout(aiMove, 220)` (`:237`) | click/tap | — | n/a |
| **Dominion of the Ancients** `risk.js` | Risk-like | Turn-based; AI sequenced by `setTimeout` 420 ms (`:232`); rAF for rendering | click | — | n/a |
| **The Reliquary** `reliquary.js` | Trivia | Event-driven DOM | click, keys 1–4 | — | n/a |
| **The Seeker's Path** `seeker.js` | Riddle chain | Event-driven DOM | form submit | — | n/a |

### 3.2 Divine Casualties vs fighting-game standards

| Standard | Present? | Evidence and gap |
|---|---|---|
| Fixed-rate simulation | ✅ | 60 Hz fixed step, deterministic per refresh rate (`fighter.js:51-54`). |
| Per-move frame data | ✅ | `startup`, `active [first,last]`, `recovery`, `total` in ticks (`fighter-moves.js:11-14`, e.g. light `:30`, kick `:48`, headbutt `:64`). Data-driven poses (`poseKeys`). |
| Per-character movesets | ✅ partial | Each god overrides base moves and has `walkSpeed/jumpVel/weight` (`fighter-moves.js:137-196`). The overrides tune numbers (damage, hitstop, windows); all four share the same **move list** (light, kick, headbutt, special, throw, two aerials), so characters differ in feel but not in kit. |
| Hitstop | ✅ | Global freeze of the whole sim while `hitStop > 0` (`fighter.js:1800`); per-move `onHit.hitstop` in **seconds** (e.g. 0.06–0.16 s, finisher 0.25 s at `:1511`). Frozen together; no per-character hitstop or shake-only victim. |
| Cancels | ✅ | `cancelInto` + `cancelWindow` checked in ticks (`fighter.js:383-391`). |
| Throws / throw tech | ✅ | Grab and tech window (`fighter.js:1409`). |
| **Input buffer** | ❌ | No buffer. Attacks resolve **immediately on the `keydown` event, outside the fixed step** (`fighter.js:2119-2122` → `tryAttack` `:1316`). A press during recovery is **dropped** unless it lands inside a cancel window. The genre standard is a 3–10 frame buffer consumed in the sim tick. |
| Key repeat | ❌ | No `e.repeat` filter (`:2112`): **holding J fires repeated attacks** at the OS auto-repeat rate. |
| Active frames honoured | ❌ | The hit is resolved **once**, when `stTime` reaches the *first* active tick (`fighter.js:1348` sets `at = active[0]/total`; `:1874-1878` fires once). Later active ticks never check, so an opponent who walks into a live hitbox on tick 5–6 isn't hit. |
| Hurtboxes | ❌ | Hits test **horizontal distance only** (`fighter.js:1454-1456`: `dx` against reach); grounded moves have no vertical/hurtbox test, so crouch/low/high distinctions aren't possible. Aerials use a crude box (`:1440-1441`). |
| Blocking model | ⚠️ | Block is a **button** (`KM1.block = "s"`), not hold-back; there is no high/low. Chip, parry and counter callouts exist (`:1412, 1494-1515`). |
| Special inputs | ⚠️ | Specials are one button with an energy meter; no motion inputs. Fine for a web audience, but not genre-standard. |
| Frame advantage / hitstun data | ⚠️ | Hitstun and blockstun aren't per-move data (only damage, hitstop, knockback), so advantage on hit or block can't be tuned or read. |
| Netplay / rollback | n/a | Local 2P only. |

### 3.3 Ziggurat Builder vs Tetris guideline

| Standard | Present? | Evidence and gap |
|---|---|---|
| **7-bag randomizer** | ✅ | Fisher–Yates bag of 7 (`ziggurat.js:43, 72, 79`). |
| **SRS rotation** | ❌ | One-direction matrix rotation (`rot` `:98`). Kicks are horizontal only, `[0, −1, 1, −2, 2]` (`:101`): no SRS offset tables, no vertical kicks, no separate I-piece table. **Z also rotates clockwise** (`:356`); there is no counter-clockwise rotation. |
| **Lock delay** | ❌ | None. When gravity finds the piece grounded it **locks on that tick** (`:384`), and soft drop onto the stack locks at once (`:108`). No 0.5 s delay, no move/rotate reset. |
| **DAS / ARR** | ❌ | No implementation. Each `keydown` event moves one cell (`:353-354`); holding a key relies on the **OS auto-repeat** (typically about 500 ms delay, 30 ms rate, not configurable, and it also re-fires rotate and hard drop). No `e.repeat` filter. |
| Soft/hard drop | ✅ | Soft drop 1 pt per cell and resets gravity (`:108`); hard drop 2 pts per cell (`:109`). |
| Ghost piece | ✅ | Dashed landing guide (draw loop). |
| Hold | ❌ | Not implemented. |
| Next queue | ⚠️ | One piece (`drawNext`); the guideline shows 3–6. |
| Scoring / levels | ✅ | 100/300/500/800 × level (`:134-135`); level every 10 lines (`:136`). No T-spin, back-to-back or combo detection. |
| Field | ⚠️ | 10×18 visible (`:54`), no hidden buffer rows above (guideline 10×20 + 20 hidden). |
| Gravity curve | ⚠️ | Linear 820 ms → 120 ms floor (`:376`); the guideline curve is exponential and reaches 20G. |

### 3.4 Other games: notable gaps

- **Frame-rate dependence (bug):** `pong.js:136-140`, `treasure.js:152-158` and `pinball.js:173-176` advance positions and velocities **per rendered frame** even though `dt` is computed. On 120/144 Hz displays these games run 2–2.4× faster; on a throttled tab, slower. `pacman.js:152` and `fighter.js` scale correctly.
- **Ouroboros:** the single-slot `nextDir` latch (`ouroboros.js:118, 148`) means two quick turns inside one step collapse to the last one, so a tight U-turn needs two ticks. The standard fix is a 2–3 entry input queue.
- **Labyrinth:** ghosts all chase the player's tile with 18% random moves and random choices when frightened (`pacman.js:165-176`). There are no per-ghost targeting personalities and no scatter/chase mode cycle. Buffered turning is present.
- **Tomb Robber:** jump only while `onGround` (`treasure.js:155`), with no coyote time and no jump buffering; no variable jump height (release doesn't cut `vy`).
- **Excavation:** first click is safe (mines exclude the clicked cell and its neighbours, `minesweeper.js:63-65`). Chording (clicking a satisfied number) isn't implemented.
- **Chess:** full legal rules (castling, en passant, promotion, check/mate/stalemate) and alpha-beta negamax at **fixed depth 3** (`chess.js:113-132, 240`), with capture-first ordering. No quiescence search, so it can blunder at the horizon.
- **Dominion:** classic attacker/defender dice (`risk.js:33, 153-154`).
- **Reliquary / Seeker:** event-driven DOM quizzes; no timing concerns.
- **Verification:** every game except the fighter has a data-grounding verifier (`tools/verify-*.js`) run by `.github/workflows/verify.yml`. Only the fighter has a runtime play test (`tools/ci-play-fighter.js`). None tests input feel or timing.

### Stage 3 summary

- **Fighter:** solid core. It has a fixed step, real frame data, cancels, hitstop, per-god tuning and a throw tech. The gaps that matter most for feel are: no input buffer, attacks read outside the sim tick, OS key-repeat mashing, hits checked only on the first active frame, and no hurtboxes or hitstun data. All four gods share one move list.
- **Ziggurat:** 7-bag ✅, but no SRS, **no lock delay**, **no DAS/ARR** (OS key repeat), no hold, a single-piece preview and a short well.
- **Bug across three games:** Pong, Firmament and Tomb Robber run faster on high-refresh displays because their physics is per frame.
