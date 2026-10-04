# The Divine Archives

A comparative reference work on world religion and mythology, with evidence
honesty. It is organized **chronologically by era**, not by region: each chapter
covers one tradition within its era, or one theme that runs across eras (flood
myths, creation, the underworld, sacred kingship and so on).

**Live at [getconexto.com](https://getconexto.com).**

Every factual and archaeological claim is sourced from real primary texts and
current scholarship. Contested points are flagged as contested rather than
settled by picking a side, and gaps in the record are named, not papered over.
Every chapter ends with a plain account of what the evidence supports, what it
doesn't, and what is still open.

## What is on the site

| Section | What it is | Size |
|---|---|---|
| **Chapters** | One tradition or theme per chapter, each with a symbology section and an evidence-honesty close | **83** (76 traditions across nine eras + 7 themes) |
| **Eras** | The nine ages, from Prehistory to the Modern Age, each listing its chapters and objects | 9 |
| **Traditions / Themes / Compare / Search / Random** | Other ways into the same chapters | — |
| **The Vault** | Sacred objects and texts (manuscripts, relics, inscriptions), each with a study page | **88** entries |
| **The Pantheon** | A searchable directory of gods, spirits, heroes and prophets | **199** figures, 30 traditions |
| **Symbols and games** | The archive's sacred symbols; twelve of them open a game whose facts all come from chapter text | **12** games |
| **The Pilgrimage** (beta) | Walkable models of sacred sites, sized from published surveys, reached through a portal in the Museum's Rotunda; each holds relic copies linked to the Vault | **1** open (the Great Pyramid), 71 queued |
| **The Museum** (beta) | A walkable 3D building with one room per chapter, and a planetarium | **83** rooms in 10 wings |
| **Methodology / About** | The sourcing standard and what the "pending review" tag means | — |

Chapters per era: Prehistory 5 · Bronze Age 7 · Early Iron Age 7 · Axial Age 9 ·
Late Antiquity 9 · Early Medieval 10 · High Medieval 12 · Early Modern 7 · Modern 10 ·
cross-era themes 7.

### Review status

New chapters go live at once with a visible **"Recently added — pending full
review"** banner, and the banner comes off only when Carter clears the chapter in
a batch review. **11 chapters** carry it now: Batch IV (ch75–ch83, one per era),
plus ch45 and ch46, whose full text replaced a shorter live version on 2026-09-30.
One Vault entry (V88) is also pending. The chapter-by-chapter status is on the
[status board](outline/master-outline.md).

## How the work runs

The rules are in **[`CLAUDE.md`](CLAUDE.md)**: the sourcing standard, the depth
standard, the symbology section every chapter needs, and the publishing policy.
In short:

1. **Research and draft** one chapter at a time from real, checkable sources, in
   the style of the template chapter [`themes/ch01-the-flood.md`](themes/ch01-the-flood.md).
   Log the sources in [`sources/`](sources/).
2. **Publish with the pending tag**, straight away.
3. **Batch review**: Carter sends corrections, chapters are revised in place, and
   the tag comes off when Carter clears them.

## Repository layout

```
The-divine-Archives/
├── CLAUDE.md               project rules
├── README.md
├── outline/master-outline.md   framework and the chapter / Vault status board
├── eras/                   tradition chapters (markdown), one folder per era, 01-prehistory … 09-modern
├── themes/                 cross-era theme chapters, including the ch01 template
├── vault/                  Vault entries V01–V88 (markdown)
├── sources/                citation logs: one per chapter, one per Vault entry, and the Pantheon
├── content/chapters.js     chapter bodies as HTML, converted from the markdown (build input, not deployed)
├── docs/                   the website, deployed exactly as it is
├── functions/              Cloudflare Pages Functions (the home page's email form)
├── tools/                  build, conversion, check and measurement scripts
├── museum/                 museum plan, phase reports and the planetarium's lore
├── art-source/             source artwork kept out of the website
├── 00-audit/               audits, the founder guide and the performance baseline
├── .github/workflows/      deploy and checks (see below)
└── drafts/, icm/, stages/, mini-games/   older planning notes, kept for the record
```

## The website

`docs/` is a static site: plain HTML, CSS and JavaScript, no framework and
nothing built at request time. The chapter, era, listing, Vault, Pantheon, search-index
and sitemap pages are **prerendered**, and the generated files are committed.
After changing content, rebuild in this order:

```sh
node tools/stamp-dates.js      # published / revised dates (content/dates.json)
node tools/build-og.js         # share images, only the ones whose title or art changed (needs Playwright)
node tools/build-vault.js
node tools/build-chapters.js
node tools/build-pages.js
node tools/build-museum.js
node tools/build-sky.js        # only when the planetarium's lore or star data change
```

A chapter's body is converted from its markdown with
`node tools/md-to-chapter.js <id> <file.md>` and placed in `content/chapters.js`;
its listing entry (title, era, `pending` flag) lives in `docs/assets/data.js`.

Search and sharing: every chapter, Vault entry and era page has its own
1200×630 share image in `docs/assets/og/` (drawn from the chapter's plate or the
era's emblem; the hand-written pages use `site.jpg`), and its Article data and
sitemap entry carry the dates from `content/dates.json`. `stamp-dates.js` moves a
chapter's "revised" date only when its markdown changes.

To preview locally: `node tools/serve.js 8080` and open http://localhost:8080
(it compresses files the way Cloudflare does; `python3 -m http.server -d docs`
also works).

The Pilgrimage (`docs/pilgrimage.html`, one page per open site in `docs/pilgrimage/`) is built the same way: the list of sites is `docs/assets/pilgrimage-data.js`, each open site is a module folder `docs/pilgrimage/sites/<id>/` (a `site.js` with its sections, walkable regions, route and info points, plus one module per section), and `build-pages.js` writes the pages. Adding a site is one data entry plus its folder. `tools/verify-pilgrimage.js` checks the links and that every info point cites its sources.

The Museum is `noindex` and kept out of the sitemap, so search engines send
people to the chapter, Vault and Pantheon pages. Three.js is included in
`docs/assets/vendor/three/`. The planetarium's star data come from the
d3-celestial catalogues (`tools/data/d3-celestial/`, BSD licence).

Two pieces of game art are generated, not edited by hand:

- **The fighter's art**: the full-size originals live in `art-source/fighter/`.
  `node tools/build-fighter-art.js` writes the half-size WebP parts and the portrait sheet
  into `docs/assets/games/art/`. Re-run it after changing the art, and bump `PARTS_VER` in
  `fighter.js`.
- **The Risk map's territory grid** (`docs/assets/games/data/risk-grid.png`):
  `node tools/build-risk-grid.js` writes it with the game's own code. Re-run it after moving
  provinces or seas in `risk.js`; until then the game falls back to computing the grid.

## Deploy

Every push to **`main`** runs `.github/workflows/deploy.yml`, which publishes
`docs/` (and `functions/`) to **Cloudflare Pages** with `wrangler pages deploy docs`.
The domain getconexto.com is attached in the Cloudflare dashboard. Work happens
on feature branches and reaches `main` by fast-forward once approved.

- `docs/CNAME` is left over from GitHub Pages; Cloudflare ignores it.
- The email form answers "not configured" until a KV namespace named
  `SUBSCRIBERS` is bound to the Pages project, and says so honestly.
- **Analytics:** Cloudflare Web Analytics is wired in but off. Paste the site
  token into `docs/site-config.js` (`cfAnalyticsToken`) to turn it on. It
  sets no cookies.
- **Note:** the GitHub *default* branch is still the old `claude/session-start-ikztvo`.
  Production is `main`. Scheduled checks (the weekly link check) run only once the
  default branch is set to `main` in the repository's settings.

## Checks

| Workflow | When | What it does |
|---|---|---|
| `verify.yml` | chapter text or game data changes | every fact a game shows must appear in its source chapter (`tools/verify-*.js`) |
| `game-runtime.yml` | every push and pull request | lints the game code and plays the fighter to a knockout in a headless browser |
| `link-check.yml` | Mondays, or by hand | checks every external link (`tools/check-links.js`); fails only on dead links |
| `lighthouse.yml` | pull requests that change the site | mobile Lighthouse on the home page, an era, three chapters, the museum and the twelve games, base vs. pull request; fails if a page's score drops more than 5 points |

## Reports

- [`00-audit/founder-guide.md`](00-audit/founder-guide.md): every section of the
  site in plain language, with phone screenshots, and what a newcomer sees first.
- [`00-audit/perf-baseline.md`](00-audit/perf-baseline.md): Lighthouse scores and
  game frame rates, with the top fixes.
- [`00-audit/2026-09-29-full-audit.md`](00-audit/2026-09-29-full-audit.md): the
  latest full audit (content, sourcing, site health, museum and games).
