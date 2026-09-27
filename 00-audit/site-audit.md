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
