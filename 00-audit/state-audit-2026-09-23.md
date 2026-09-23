# State Audit — 2026-09-23 (read-only)

Scope: check what the repo actually contains against what earlier sessions said they did.
Method: `git fetch --prune` on every origin branch, `git rev-list`/`merge-base`/`merge-tree`
(a dry-run merge that changes nothing), the static files on `origin/main`, GitHub PR and
Actions history, and dry runs of the merch agents in throwaway worktrees that were deleted afterward.
No existing branch was changed, nothing was merged and nothing was deployed.

Baseline: `origin/main` = **b697bd7** (2026-09-21) "Deploy Theomachy fighter overhaul: skeletal cutout rig + per-god specials".

---

## 1. Branch inventory

"Behind/Ahead" is measured against origin/main. "Merged" means the branch tip is an ancestor of main.

| Branch | Last commit | Date | Message | Behind / Ahead | Merged | Status |
|---|---|---|---|---|---|---|
| main | b697bd7 | 09-21 | Deploy Theomachy fighter overhaul… | 0 / 0 | — | VERIFIED |
| claude/site-overhaul | 1c14aee | 09-11 | Stage 1 (site overhaul): SSG / indexing fix | 90 / 0 | YES | VERIFIED (merged) |
| claude/stage-3-ycbpej | 6602667 | 09-12 | Merge Stage 2 (navigation / IA) to production | 85 / 0 | YES | VERIFIED |
| claude/mini-games-layer | 1fe117f | 09-14 | Theomachy: cinematic VS splash… | 60 / 0 | YES | VERIFIED (merged) |
| claude/games-audit | 2399c5f | 09-19 | audit: backlog B4 — add a Nubia/Kush chapter | 36 / **6** | no | PARTIAL: audit docs only (`audit/`), clean merge |
| claude/games-build | 7e6c574 | 09-20 | CI: game-runtime checks | 27 / 0 | YES (PR #8, 66d7946) | VERIFIED |
| claude/games-fighter-f3 | d4a494f | 09-20 | F3.2 (Hades): heavy bruiser kit | 21 / 0 | YES (PR #9, 07edd54) | VERIFIED |
| claude/games-fighter-rig | 3d6f883 | 09-20 | Pinball: celestial art pass | 10 / 0 | YES (PR #10) | VERIFIED |
| claude/games-fighter-cutout | 2134ae6 | 09-21 | Theomachy: per-god lore specials… | 1 / 0 | YES | VERIFIED |
| **claude/locate-current-task-cmjnz3** | ae31f02 | 09-22 | Divine Casualties: Zeus on true side-view art | 0 / **6** | **no** | UNMERGED fighter work |
| **claude/pose-based-fighter-sprites-ot2nig** | f341bd0 | 09-21 | Theomachy pilot: painted Zeus rig… | 0 / **2** | **no** | UNMERGED pilot |
| claude/pistis-sophia-research-8ytkke | 834164f | 09-11 | Stage 0 (site overhaul): ground-truth audit | 147 / 3 | no | SUPERSEDED (see §2) |
| claude/ch45-pistis-sophia | b76fcec | 09-12 | Add ch45 Pistis Sophia… | 88 / 0 | YES | VERIFIED |
| claude/content-port-new-chapters | 66df8ed | 09-14 | Port 19 net-new chapters (ch47–ch65) | 74 / 0 | YES (PR #7) | VERIFIED |
| claude/divine-archives-completion-2bplik | 5132a07 | 09-06 | Plates for ch43 Aztec, ch44 Inca | 91 / 0 | YES | VERIFIED |
| claude/divine-archives-update-xg83tz | 5132a07 | 09-06 | (same tip as above) | 91 / 0 | YES | VERIFIED |
| claude/site-information-updates-0ycl4c | 9933d71 | 09-15 | Dominion of the Ancients: a far deeper Risk | 36 / 0 | YES | VERIFIED |
| claude/divine-archives-status-images-w5l0fk | 5c7a7fe | 08-15 | Image-forward imagery | 211 / 0 | YES | VERIFIED |
| claude/session-start-ikztvo | 6474251 | 08-17 | Merge PR #6: cumulative build | 147 / 0 | YES | VERIFIED |
| claude/next-ptzs6g | 7f61f44 | 09-10 | Batch II: deepen ch21 Islam | 147 / **1** | no | UNMERGED, **conflicts** |
| claude/pending-reviews-approval-bhb8n4 | 157e3d9 | 08-18 | Clear pending-review tags on ch26–ch42 | 147 / **1** | no | UNMERGED, **conflicts** |
| claude/printify-merch-status-mmly9k | ad34a6b | 08-22 | Add Printify merch agent (dry-run only) | 147 / 1 | no | UNMERGED |
| claude/divine-archives-status-lq6zz4 | 583fada | 08-22 | Stage 05 merch: 5 blank types + ToL dry run | 146 / 3 | no | UNMERGED |
| claude/current-update-annu7g | 96e9e04 | 08-24 | Merch: hybrid Tree of Life aesthetic | 146 / 1 | no | UNMERGED |
| claude/orchard-merch-stage-setup-7kcebk | d6a285d | 08-19 | Studio Orchard engine + Pip batch | 147 / 15 | no | UNMERGED (A.T.L.E./Pip, not DA) |
| claude/parallel-build-workstreams-te4g1k | 5b08fa8 | 08-23 | Merch WS1: Tree of Life candidate | 147 / 1 | no | UNMERGED |
| claude/parallel-build-workstreams-yq09vz | ce6aeb9 | 08-23 | merch: ToL emblem style test + captions | 147 / 1 | no | UNMERGED |
| claude/divine-archives-audit-nr3mln | 10edf1f | 08-25 | Phase 1: competitive & structural audit | 147 / 1 | no | UNMERGED (docs) |
| claude/clipyield-ugc-init-h52c0c | d0663fa | 08-23 | Initialize clipyield-ugc-automation | 147 / 1 | no | UNMERGED (unrelated project) |

Local-only branches: `claude/session-start-ikztvo` (same as origin) and `claude/state-audit-fzv14x` (at 6474251, stale, never pushed).

**Fighter-file overlap (conflict risk):**

| Pair | Shared files | Dry-run merge | Status |
|---|---|---|---|
| locate-current-task-cmjnz3 ↔ pose-based-fighter-sprites-ot2nig | **none**. The pilot lives only in `docs/assets/games/theomachy-pilot/**`. The locate branch touches `fighter.js`, `fighter-moves.js`, `art/parts/**`, `games.css`, `index.html`, `symbols.html`, `tools/ci-play-fighter.js`, `tools/verify-fighters.js` | clean | No textual conflict. They are **competing designs**: the pilot uses a separate engine, while locate edits the live rig |
| games-build / games-fighter-f3 / -rig / -cutout | all touch `fighter.js` | already merged into main | none outstanding |

---

## 2. Content

| Item | Claimed | Actual | Evidence | Status |
|---|---|---|---|---|
| Chapter count on main | 42 → 44 (memory); 65 (games audit) | **65**: 58 era chapters in `eras/*/` + 7 theme chapters in `themes/`. Numbers ch01–ch65 are contiguous with no gaps and no duplicates. `docs/chapters/` has 65 HTML files | `find eras themes -name 'ch*.md'` → 65; `seq 1 65` gap check empty | VERIFIED (65) |
| Explanation of the discrepancy | — | The memory is out of date. **42** was ch01–ch42 before 09-06. **44** came after the Maya/Aztec/Inca split added ch43 Aztec and ch44 Inca (5132a07, 09-06). After that: **45** = Pistis Sophia (b76fcec/ae6ddb6, 09-12), **46** = Creation theme (3c0c3c4, 09-12), and **47–65** = the 19-chapter content port (66df8ed, PR #7, merged 09-14). The games audit's 65 is correct | commit hashes listed | VERIFIED |
| Pistis Sophia "unmerged and absent from main" | unmerged / absent | **FALSE. It is on main** as `eras/05-late-antiquity/ch45-pistis-sophia-late-antiquity.md` (3,434 words), `docs/chapters/ch45.html`, and in `data.js` (no pending flag) and `sitemap.xml`. The research branch `pistis-sophia-research-8ytkke` is still unmerged, but its content was **ported and renumbered** (ch43 → ch45, because ch43 went to Aztec). The markdown differs by 1 line. That branch now conflicts with main in 27 files and should **not** be merged | b76fcec, ae6ddb6; `git diff` research:ch43 vs main:ch45 = 1 line | VERIFIED as merged via port (the claim is wrong) |
| Pending-review tags | Carter cleared ch26–ch42 (08-18) | **Not applied on main.** `data.js` still has `pending: true` on 19 chapters: ch26–ch44. The clearing commit 157e3d9 lives only on the unmerged `pending-reviews-approval-bhb8n4` and now conflicts (data.js, master-outline.md). ch45–ch65 are cleared (f976538) | parse of `docs/assets/data.js` | **MISSING** |
| ch21 Islam deepening (Batch II) | done | Only on unmerged `next-ptzs6g`. It conflicts with main in 4 files (ch21 md, sources/ch21, chapters.js, ch21.html) | `git merge-tree` | PARTIAL |

---

## 3. SEO / site overhaul

| Item | Claimed | Actual | Evidence | Status |
|---|---|---|---|---|
| Era pages static on main | rendered | Yes. `docs/eras/0N-*.html` ×9 each carry prerendered text (era 02: ~1,175 words, h1, 12 chapter links) and a self-canonical. Dynamic `era.html` is `noindex` | text strip of HTML; `<link rel=canonical>` | VERIFIED |
| Tradition page static on main | rendered | Yes. `traditions.html` ~749 words, 58 chapter links, canonical | same | VERIFIED |
| Theme page static on main | rendered | Yes. `themes.html` ~885 words, 7 chapter links | same | VERIFIED |
| Chapter pages static on main | rendered | 65 static `chapters/chNN.html` (e.g. ch45 ~2,808 visible words), canonical set, `chapter.html` is `noindex` | same | VERIFIED |
| Same on `site-overhaul` tip (1c14aee) | rendered | Partial at that point: era02 ~343 words / 5 chapter links, themes ~158 words / 2 links, traditions ~567 words / 43 links, 44 chapter pages. Later main commits grew all of these. The branch is fully merged | `git show 1c14aee:docs/...` | VERIFIED (superseded by main) |
| sitemap.xml | exists | `docs/sitemap.xml`: 81 unique URLs (home, 6 listing pages, 9 eras, 65 chapters) on `https://getconexto.com/`. Every URL resolves to a file in `docs/`. Well-formed XML (`xmllint` OK). No `noindex` template pages are listed. `robots.txt` points to it. `tools/build-pages.js` regenerates it from `data.js`, and re-running it produced **no diff**, so the file is in sync | xmllint exit 0; path check | VERIFIED |

---

## 4. Divine Casualties (fighter)

| Item | Claimed | Actual | Evidence | Status |
|---|---|---|---|---|
| F1 fixed timestep | on games-build | 334c824 (09-19), plus a fix in ed08485 (undefined `dt` crash) | games-build log; merged PR #8 | VERIFIED |
| D3 verifiers in CI | on games-build | 0dafa61 (`.github/workflows/verify.yml`) | same | VERIFIED |
| D1 Pac-Man sourcing → ch47 | on games-build | 6cae399 | same | VERIFIED |
| D2 Risk facts | on games-build | 644e995, then amended by 3f6b830 (Nubia reverted, only Arabia kept, 12/13 covered, Nubia backlogged as B4) | same | VERIFIED (scope reduced by the amend) |
| F2 move-data system | on games-build | b60b701 | same | VERIFIED |
| D4 fighter surfaces facts | on games-build | 214b55a | same | VERIFIED |
| F3 per-god movesets | started? | **Done and merged** on `games-fighter-f3`: f3ed7cf (F3.1), then 6061f03 Zeus, 77df2b7 Poseidon, a4e393e Athena, d4a494f Hades. PR #9 merged (07edd54). Main later added per-god lore specials (2134ae6) | main log | VERIFIED |
| Combat-state sync fix (single event flow / state machine) | in progress somewhere | **NOT FOUND** on any branch. No commit message matches state machine / sync / event flow. `fighter.js` still sets state directly (25 `.state =` sites on main, 26 on locate branch). There is no FSM or event-queue code | `git log --all` grep; `git grep` | **MISSING** |
| Pose-based sprite rebuild, Zeus pilot | exists | Yes, on unmerged `pose-based-fighter-sprites-ot2nig`: 6151ea6 + f341bd0, a separate `docs/assets/games/theomachy-pilot/` with 10 painted Zeus PNGs, `pilot.js`, and `pose-sheet.html`. Its README ends at "STOP: awaiting approval (incl. camera-angle call)". Separately, main shipped a different approach (skeletal cutout rig for all four gods, aac0cdb…b697bd7). The unmerged `locate-current-task-cmjnz3` then moved Poseidon (2ba4b30) and Zeus (ae31f02) to side-view parts on the live rig | branch logs | PARTIAL: pilot parked, superseded in practice |
| Rename to "Divine Casualties" | done | Only on unmerged `locate-current-task-cmjnz3` (13ee102), along with super meter (4c71ae0), reactive AI (6845c9c), and rig readability (cb146ef). **The live site still says "Theomachy"** | main `symbols.html` | PARTIAL |
| Open PR | — | **No open PRs.** #1–#10 are all closed and merged. There are no PRs for the locate or pose-based branches | GitHub PR list | VERIFIED |
| verify.yml ran? result | — | Yes, **10 runs, all `success`**. #1 was 35470443791 (09-19, games-build D4). The latest, #10, was 35673494833 (09-22, locate branch). It is path-filtered, so it did not run on later locate commits. `game-runtime.yml` has 41 runs; the latest (#41, ae31f02) succeeded. Locally all 12 `tools/verify-*.js` exit 0 on main | Actions API; local exit codes | VERIFIED |

---

## 5. Mini-games

Game modules are in `docs/assets/games/*.js` (12 `AG.register(...)` calls).

**How games are triggered (applies to all 12):**
- **Symbols gallery:** in `symbols.html`, `registerSymbol()` turns the mapped chapter's symbol art into a clickable "✵ Playable" tile, using the `GAMES`/`TRIGGER_FOR` map.
- **Homepage arcade:** the "Arcade of the Ages" menu in `index.html` links to `symbols.html#play=<id>` (12 links).
- **Random easter eggs:** `seedEasterEggs()` is defined in `archive-games.js:214` but has **0 call sites**, so random easter-egg seeding is not wired up.

| Game (id) | Symbol → chapter | Phase reached | Evidence | Status |
|---|---|---|---|---|
| The Reliquary (reliquary), trivia | ch22 | Phase 2 | b9be646 | VERIFIED |
| Ouroboros (ouroboros), snake | ch37 | Phase 3 | 4618370 | VERIFIED |
| Ziggurat Builder (ziggurat), Tetris | ch03 | Phase 4 | 7ca6e68 | VERIFIED |
| Theomachy / Divine Casualties (fighter) | ch08 | Phase 5A, then F1–F3, then cutout rig on main; more on an unmerged branch | 8fede28 … b697bd7 | VERIFIED (ongoing) |
| Archive Chess (chess) | ch02 | Phase 5B | 5b7e045 | VERIFIED |
| The Seeker's Path (seeker), riddles | ch40 | Phase 6 (final planned phase) | 3337ffd | VERIFIED |
| Antithesis (pong) | ch06 | Post-plan add-on, playable | 78beb17 | VERIFIED* |
| The Excavation (minesweeper) | ch04 | Post-plan add-on, playable | 7d33f3f | VERIFIED* |
| The Labyrinth (pacman) | symbol ch29, facts ch47 | Post-plan add-on + D1 | 8e412e7, 6cae399 | VERIFIED* |
| The Firmament (pinball) | ch46 | Post-plan add-on + art pass | 342e9a7, 3d6f883 | VERIFIED* |
| Dominion of the Ancients (risk) | ch13 | Post-plan add-on, deepened | 710565f, 9933d71 | VERIFIED* |
| The Tomb Robber (treasure) | ch43 | Post-plan add-on + storyline | 839f83a, 8978f18 | VERIFIED* |

\* The `phaseNote` copy in `symbols.html` still says "In development" for these six, and the fighter tile is still titled "Theomachy". This is stale UI copy, not missing code.

---

## 6. Agents / automation

| Agent | Claimed | Actual | Evidence (path / exit) | Status |
|---|---|---|---|---|
| Printify merch agent (v1) | built | `merch/agent/{dry-run,build-product,listing-generator,printify-client}.js` on unmerged `printify-merch-status-mmly9k`. `node merch/agent/dry-run.js` runs but reports **0/5 pass**. Blockers: no artwork file, null blueprint/provider ids, empty variant_ids, no upload id, no `PRINTIFY_API_TOKEN` | exit 0; "RESULT: 0/5 pass, 5/5 fail" | PARTIAL: runs, all products blocked |
| Printify merch agent (v2, hybrid art) | built | Same agent on unmerged `current-update-annu7g`, plus `merch/artwork/tree-of-life.{png,svg}`. Still **0/5 pass** (catalog ids, token, upload). It gives an add/add conflict with v1 on `merch/artwork/README.md` and `merch/out/dry-run-tree-of-life.json` | exit 0; 0/5 pass | PARTIAL |
| Printify draft agent (Stage 05) | built | `05-merch/agent/printify-draft-agent.js` on unmerged `divine-archives-status-lq6zz4`. With `--symbol "Tree of Life"` it exits 0, then stops at the review gate with "art:transparent missing; art:parchment missing". `--dry-run` is not a valid flag (exit 1) | exit 0 / 1 | PARTIAL: a third, divergent implementation |
| Symbol content-entry agent | built | **NOT FOUND** on any branch. The closest match is a hand-written `drafts/symbols/tree-of-life.md` plus `05-merch/symbols-reference/README.md` on lq6zz4. There is no executable agent | `git ls-tree` search on all branches | **MISSING** |
| Studio Orchard / Pip content engine | — | `studio-orchard/tools/build-metricool-csv.js` + batch-01 on unmerged `orchard-merch-stage-setup-7kcebk` (A.T.L.E./Pip scope, not Divine Archives). Not run in this audit | path | PARTIAL (out of scope) |
| clipyield UGC automation | — | Skeleton only (`ARCHITECTURE.md`, `TODO.md`, `app/config.py`) on unmerged `clipyield-ugc-init-h52c0c`. Unrelated project inside this repo | path | PARTIAL (stub) |
| Scheduled / automatic runs of any agent | — | **None.** No workflow has a `schedule:`/cron, and no workflow calls a merch agent | `.github/workflows/*` | MISSING |

**GitHub Actions on main:**

| Workflow | Triggers | Does | Last result |
|---|---|---|---|
| `deploy.yml`: Deploy to Cloudflare Pages | push to `main`, `workflow_dispatch` | `wrangler pages deploy docs` | #75 success (b697bd7, 09-21); #73 cancelled by concurrency |
| `verify.yml`: Verify game sourcing | push (all branches) / PR, **path-filtered** to `docs/assets/games/data/**`, `docs/assets/chapters.js`, `tools/verify-*.js`, itself; `workflow_dispatch` | runs every `tools/verify-*.js` | 10/10 success |
| `game-runtime.yml`: Game runtime checks | push (all branches), PR, `workflow_dispatch`; no path filter | no-undef ESLint on game JS + headless play-to-KO (`tools/ci-play-fighter.js`) | #41 success (09-22) |

---

## Top 3 blockers

1. **Carter's review clearance was never applied on main.** ch26–ch44 (19 chapters) still show "pending review" on the live site. The clearing commit (157e3d9) sits on an unmerged branch that now conflicts. It needs to be re-applied on current main, and ch43/ch44 need an explicit decision because they came after that clearance.
2. **The latest fighter work is not live, and the combat-state sync fix does not exist.** The 6 commits on `locate-current-task-cmjnz3` (rename, super, AI, side-view Zeus/Poseidon) have no PR. The state-machine / single-event-flow fix has no commits anywhere. The pose-based pilot branch is parked at an approval gate while main moved to a different rig.
3. **The merch agent has 3 divergent implementations on 3 unmerged branches, and none can pass.** All are blocked on the same inputs: final art, a Printify token, and real catalog blueprint/provider/variant ids. The claimed symbol content-entry agent does not exist.

## Merge-conflict watchlist

- `pistis-sophia-research-8ytkke` → main: conflicts in 27 files. Its content is already on main as ch45. **Do not merge**; it is superseded.
- `pending-reviews-approval-bhb8n4` → main: conflicts in `docs/assets/data.js` and `outline/master-outline.md`. Re-apply the change by hand instead of merging.
- `next-ptzs6g` (ch21 Islam) → main: conflicts in the ch21 md, `sources/ch21-islam.md`, `docs/assets/chapters.js`, and `docs/chapters/ch21.html`. It needs a rebuild after resolving.
- `printify-merch-status-mmly9k` ↔ `current-update-annu7g`: add/add conflicts in `merch/artwork/README.md` and `merch/out/dry-run-tree-of-life.json`. The `te4g1k` ↔ `yq09vz` and `orchard-7kcebk` ↔ `lq6zz4` pairs also conflict with each other. Pick one merch line before merging any of them.
- Fighter: `locate-current-task-cmjnz3` and `pose-based-fighter-sprites-ot2nig` share no files and merge cleanly. Anything new that touches `docs/assets/games/fighter.js` will collide with the locate branch.
- Clean against main: games-audit, locate-current-task, pose-based, and all merch/audit/clipyield branches (each on its own).
