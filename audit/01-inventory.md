# Phase 1 — Inventory: The Divine Archives Games Layer

**Audit branch:** `claude/games-audit` (off `origin/main`)
**Scope:** read-only. No game code changed, nothing merged or deployed. Reports written only to `/audit/`.
**Date:** 2026-09-19

> **Note on branch name.** The task text asks for a branch `claude/games-audit`; the session scaffold designates `claude/games-audit-ew8px6`. These refer to the same audit work. I used the exact name the task specifies. Flag if you want it renamed to match the scaffold.

---

## 1. Repository map

### Top-level layout
```
The-divine-Archives/
├── CLAUDE.md              # project rules (content + games + publishing policy)
├── README.md              # says "GitHub Pages, no build step" (see discrepancy below)
├── eras/ themes/ drafts/  # chapter source (Markdown) — the content track
├── sources/               # per-chapter citation logs
├── outline/               # master outline
├── tools/                 # Node build + per-game verify scripts (see §5)
├── stages/ icm/ 00-audit/ # prior planning/audit notes (content-overhaul track)
├── mini-games/            # CONTEXT.md + PHASE-0-CONTENT-AUDIT.md (games planning notes)
└── docs/                  # THE WEBSITE (static, served as-is)
```

### The website (`docs/`) — where the games live
```
docs/
├── index.html             # home; "Arcade of the Ages" grid links to all 12 games (lines 274–360)
├── symbols.html           # symbol gallery + the games host page & loader (the arcade engine)
├── eras.html traditions.html themes.html compare.html methodology.html about.html search.html random.html
├── chapters/*.html        # 65 static chapter pages (NO games embedded in them)
├── eras/*.html            # 9 era pages
├── assets/
│   ├── archive.css archive.js   # site chrome
│   ├── data.js                  # 65 published chapters + 1 planned (chapter metadata)
│   ├── chapters.js (1.4 MB)     # full chapter bodies
│   ├── plates.js emblems.js     # symbol artwork (SVG) keyed by chapter/era id
│   ├── ambient.js               # ambient audio
│   ├── search-index.json (256 KB)
│   └── games/                   # ← THE GAMES LAYER
│       ├── archive-games.js     # shared framework / overlay / registry (237 lines)
│       ├── games.css (44 KB)    # all game styling
│       ├── <game>.js × 12       # one file per game
│       ├── data/<game>.json × 12 (+ fighters.json)  # per-game fact/clue/config banks
│       └── art/heroes.jpg       # sole raster asset used by the layer
```

### Build process
- **Site: no build step.** `docs/` is plain HTML/CSS/vanilla JS served directly. README §Website confirms "no build step."
- **Deploy:** `.github/workflows/deploy.yml` deploys `docs/` to **Cloudflare Pages** (`wrangler pages deploy`) on push to `main`; `workflow_dispatch` publishes a `preview` alias. 
  - **Discrepancy (UNVERIFIED impact):** README says the site is "served by GitHub Pages" and there is a `docs/CNAME`, but the actual CI deploys to Cloudflare Pages. Doc drift, not a game bug — noted for accuracy.
- **Tools (`tools/`):** Node scripts — `build-chapters.js`, `build-pages.js`, `md-to-chapter.js` (content pipeline, generate chapter/era HTML from Markdown) and 12 `verify-<game>.js` scripts (data-integrity checks, see §5). These are dev/CI helpers, not part of the served runtime.

### How games are triggered
1. **The Arcade grid (primary):** `docs/index.html` lines 284–356 — 12 `<a class="game-card" href="symbols.html#play=<id>">` cards under the "Arcade of the Ages" section (`#games`, line 275).
2. **`#play=<gameId>` deep-link:** `docs/symbols.html` lines 213–229 — `openFromHash()` parses `#play=<id>` (regex line 216) and calls `AG.open(id, …)`. Also fires on `hashchange`. This is what the arcade cards use.
3. **Symbol gallery (in-place triggers):** `symbols.html` builds a grid of symbol artworks (lines 137–180). Chapters that map to a game (the `GAMES`→`TRIGGER_FOR` map, lines 103–135) get a visible "✵ Playable" tag (line 156) and their artwork becomes an accessible activator via `AG.registerSymbol`.
4. **Randomized easter eggs:** `symbols.html` lines 182–211 — `EGG_POOL` maps 8 games to 3 candidate chapters each; one candidate per game is made silently "live" per visit (hover shimmer only, no tag). `archive-games.js` also exposes a generic `seedEasterEggs()` (lines 210–225) that picks a random 1–2, though the symbols page uses its own inline seeding.
5. **Chapter embeds:** **none found.** Games are referenced only in `index.html` and `symbols.html` (verified: `grep -rln` for `assets/games/|game-card|#play=` matches only those two files). The CLAUDE.md/task mention of "chapter embeds" is not implemented.

### Shared framework — `docs/assets/games/archive-games.js` (237 lines)
Single interaction model for the whole layer. `window.ArchiveGames` exposes:
- `register(gameId, def)` (line 49) / `isRegistered` (line 50) — game registry; `def.mount(container, ctx)` returns an optional cleanup fn.
- `registerSymbol(el, opts)` (line 54) — turns artwork into an accessible (`role=button`, `tabindex`, `aria-haspopup=dialog`, `aria-label`) activator with keyboard support (Enter/Space, lines 73–75).
- `open(gameId, ctx)` (line 85) — builds a modal overlay/dialog (`role=dialog`, `aria-modal`), focus trap (`onKeydown`, lines 141–155), Esc-to-close, body-scroll lock, focus restore on close. Falls back to a themed `placeholder()` (line 176) if a module isn't registered; wraps `mount` in try/catch (line 125).
- localStorage helpers (namespace `da.games.`): `lsGet/lsSet` (safe, try/catch, lines 26–33), `getHighScores/addHighScore/bestScore` (per-game top-10, lines 36–45).
- `maybeShowHint()` (line 195) first-visit dismissible hint; `seedEasterEggs()` (line 214).

### localStorage use
- **Framework:** namespace `da.games.` — `hintDismissed` flag; `score.<gameId>` high-score arrays (top 10, sorted by score).
- **Per game (`addHighScore`/`bestScore`/`lsGet`/`lsSet` call counts):** ouroboros 2, ziggurat 2, pacman 2, pinball 2, pong 2, treasure 2, minesweeper 2, reliquary 2, seeker 3. **No persistence:** chess 0, fighter 0, risk 0 (session-only; scores/progress not saved).
- All access is wrapped in try/catch in the framework, so private-mode / disabled storage degrades gracefully.

### Data loading
- 11 games `fetch()` their own `data/<game>.json` at mount (relative path). **Implication:** games must be served over HTTP; opening `docs/*.html` via `file://` will fail the fetch (CORS/file scheme). Live testing must use a local static server. UNVERIFIED whether each game has a graceful fallback if the fetch fails — to be checked in Phase 2.
- **Fighter is the exception:** `fighter.js` does **not** fetch; its roster/moves are embedded inline (Zeus/Poseidon/Hades/Athena + a "Shade of the Styx" training dummy, lines ~522–606). `data/fighters.json` (852 B) holds only epithet/weapon/basis metadata consumed by `tools/verify-fighters.js`, not by the running game.

---

## 2. Game roster & status (all 12 live)

All 12 arcade games are **implemented and registered** (each calls `AG.register(...)` with a real `mount` fn — verified). None are running as placeholders. Mapping of arcade name → file → source chapter (`ch` from `symbols.html` GAMES map):

| # | Arcade name | Genre / imitates | File | Source ch |
|---|---|---|---|---|
| 1 | Theomachy — War of the Gods | 1v1 fighter (Street Fighter/MK) | `fighter.js` | ch08 |
| 2 | Archive Chess | Chess | `chess.js` | ch02 |
| 3 | Ouroboros | Snake | `ouroboros.js` | ch37 |
| 4 | Ziggurat Builder | Tetris | `ziggurat.js` | ch03 |
| 5 | The Reliquary | Trivia | `reliquary.js` | ch22 |
| 6 | The Seeker's Path | Riddle chain | `seeker.js` | ch40 |
| 7 | Antithesis — The Eternal Contest | Pong | `pong.js` | ch06 |
| 8 | The Excavation | Minesweeper | `minesweeper.js` | ch04 |
| 9 | The Labyrinth | Pac-Man | `pacman.js` | ch29 |
| 10 | The Firmament | Pinball | `pinball.js` | ch46 |
| 11 | Dominion of the Ancients | Risk | `risk.js` | ch13 |
| 12 | The Tomb Robber | Platformer (Indiana Jones) | `treasure.js` | ch43 |

---

## 3. Per-game technical profile

Rendering, loop, and input verified by code inspection (grep for `getContext`/`canvas`/`innerHTML`/`requestAnimationFrame`/`setInterval`/`setTimeout`/`keydown`/`touch`/`pointer`). Line counts via `wc -l`.

| Game | File size / lines | Rendering | Game loop | Keyboard | Touch/pointer | Persists score | Loads data |
|---|---|---|---|---|---|---|---|
| **Theomachy** `fighter.js` | 86 KB / 1251 | Canvas (procedural shapes) | `requestAnimationFrame` (4 rAF refs) | yes | yes (3 refs) | no | inline (no fetch) |
| **Archive Chess** `chess.js` | 24 KB / 310 | Canvas board (`.ch-board`) + DOM UI/facts | turn-based; `setTimeout` for AI move | no | no (mouse-click) | no | `fetch chess.json` |
| **Ouroboros** `ouroboros.js` | 17 KB / 317 | Canvas | timed step (`setTimeout`), no rAF | yes | yes (2) | yes | `fetch ouroboros.json` |
| **Ziggurat** `ziggurat.js` | 22 KB / 380 | Canvas (7 canvas refs) | timed step (`setTimeout`), no rAF | yes | yes (2) | yes | `fetch ziggurat.json` |
| **The Reliquary** `reliquary.js` | 12 KB / 233 | DOM (`innerHTML`) | event-driven (no loop) | yes (1) | no (button taps) | yes | `fetch reliquary.json` |
| **The Seeker's Path** `seeker.js` | 8 KB / 123 | DOM (`innerHTML`, text input) | event-driven | no | no (text input) | yes (3) | `fetch seeker.json` |
| **Antithesis** `pong.js` | 19 KB / 302 | Canvas | `requestAnimationFrame` (2) | yes | yes (4 refs) | yes | `fetch pong.json` |
| **The Excavation** `minesweeper.js` | 12 KB / 224 | DOM grid (`role=grid`, divs) | event-driven + `setInterval` clock | no | yes (3, tap/flag) | yes | `fetch minesweeper.json` |
| **The Labyrinth** `pacman.js` | 22 KB / 392 | Canvas | `requestAnimationFrame` (2) | yes | yes (2) | yes | `fetch pacman.json` |
| **The Firmament** `pinball.js` | 18 KB / 301 | Canvas | `requestAnimationFrame` (2) | yes | yes (1) | yes | `fetch pinball.json` |
| **Dominion** `risk.js` | 26 KB / 401 | Canvas map + DOM HUD | `requestAnimationFrame` (2, dice/anim) | no | no (click) | no | `fetch risk.json` |
| **The Tomb Robber** `treasure.js` | 25 KB / 378 | Canvas | `requestAnimationFrame` (2) | yes | yes (1) | yes | `fetch treasure.json` |

**Data-bank sizes (`docs/assets/games/data/`):** reliquary.json 16.5 KB (largest fact bank), treasure 7.4 KB, chess 4.2 KB, seeker 3.3 KB, ziggurat 3.2 KB, ouroboros 3.1 KB, risk 2.7 KB, minesweeper 2.3 KB, pacman 2.3 KB, pinball 2.3 KB, pong 1.8 KB, fighters.json 0.85 KB. (Fact-count/schema detail → Phase 4.)

### Mobile support (preliminary)
- **Explicit touch/pointer handlers:** fighter, ouroboros, ziggurat, pong, minesweeper, pacman, pinball, treasure. (Effectiveness — button size, on-screen d-pad quality — to be judged live in Phase 2.)
- **Click-driven, so usable on touch without dedicated handlers:** chess, reliquary, seeker, risk. (These need only tap targets; adequacy UNVERIFIED until played.)
- All games open in the shared responsive modal; `games.css` (44 KB) holds the layout. Per-game mobile usability rating deferred to Phase 2.

### Known bugs / TODOs
- **No TODO/FIXME/BUG/HACK markers** in any game file (grep clean). Code is comment-rich but carries no in-code defect tags.
- `fighter.js` line 11 comment: "...so the look is judged before the roster / select / finishers / 2P are built" — indicates the fighter was built look-first, staged. Relevant to the Phase 3 "stiff/blocky" investigation.
- Potential fragility (UNVERIFIED, for Phase 2): 11 games depend on a runtime `fetch` of local JSON — behavior on fetch failure not yet confirmed; games are unusable from `file://`.

---

## 4. Tooling available for later phases
- **Node 22** present; **`playwright-core` installed** in the audit scratchpad and **headless Chromium (`/opt/pw-browsers/chromium-1194`) launches successfully** (smoke-tested). 
- **Conclusion: I CAN run each game live** in Phases 2–3 by serving `docs/` over a local static server and driving it with Playwright (screenshots + scripted input + behavior capture). This satisfies the task's "run each game if a headless browser is available" requirement.

## 5. Verify scripts (`tools/verify-*.js`)
One per game (chess, fighters, minesweeper, ouroboros, pacman, pinball, pong, reliquary, risk, seeker, treasure, ziggurat). These are data-integrity/sourcing checks (e.g. `verify-fighters.js` checks each fighter's `basis` string appears in the source chapter). Whether CI runs them and whether they currently pass is UNVERIFIED — flagged for Phase 4 (content/sourcing) rather than Phase 1.

---

## Summary
- **Structure:** static site in `docs/`, no build step; games are a self-contained vanilla-JS layer under `docs/assets/games/` with a shared framework (`archive-games.js`), per-game modules, per-game JSON data banks, and one shared CSS file.
- **All 12 arcade games are real and registered** (no placeholders live). Triggered from the homepage arcade grid via `symbols.html#play=<id>`, from tagged symbols in the gallery, and via randomized per-visit easter eggs. No chapter-embedded games exist.
- **Rendering split:** 8 canvas games (fighter, chess[board], ouroboros, ziggurat, pong, pacman, pinball, risk[map], treasure), DOM games (reliquary, seeker, minesweeper). **Loops:** rAF (fighter, pong, pacman, pinball, risk, treasure), timed-step (ouroboros, ziggurat), event-driven (chess, reliquary, seeker, minesweeper).
- **Persistence:** most games save high scores to `localStorage`; chess, fighter, and risk save nothing.
- **Testing:** headless Chromium + Playwright confirmed working — live runs are feasible for Phases 2–3.
- **Doc drift flagged:** README says GitHub Pages; CI actually deploys to Cloudflare Pages.

**Phase 1 complete. Awaiting approval before starting Phase 2 (mechanics breakdown).**
