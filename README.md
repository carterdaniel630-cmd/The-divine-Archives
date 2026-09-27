# The Divine Archives

A long-term comparative reference work on world religion, mythology and the
esoteric, organized **chronologically by era**, not by region. Each chapter
covers one culture or tradition within its era, or a cross-cutting comparative
theme (flood myths, creation, the underworld, sacred kingship and so on).

Live at **getconexto.com**.

The defining commitment is **evidence honesty**: every factual and
archaeological claim is sourced from real primary texts and current scholarly
consensus, contested points are flagged as contested rather than resolved by
picking a side, and genuine gaps in the record are named instead of papered
over. Every chapter ends with a plain reckoning of what is supported, what
isn't, and what is still open.

## How the work runs

The full rules are in **[`CLAUDE.md`](CLAUDE.md)**. In short:

1. **Research and draft** one chapter at a time from real, checkable sources,
   in the narrative style of the template chapter
   [`themes/ch01-the-flood.md`](themes/ch01-the-flood.md). Each chapter covers
   the textual record, cosmology, law, ritual, archaeology, a symbology section
   and connections, and closes with an evidence-honesty section. Sources are
   logged per chapter in [`sources/`](sources/).
2. **Auto-publish with a tag.** A new chapter goes live as soon as it is drafted,
   carrying a visible **"Recently added — pending full review"** banner.
3. **Batch review.** Carter reviews in batches and sends correction notes;
   chapters are revised in place, and the pending tag comes off only when Carter
   clears that chapter.

## Repository layout

```
The-divine-Archives/
├── CLAUDE.md             # Project rules: sourcing standard, publishing policy, symbology mandate
├── outline/
│   └── master-outline.md # Framework, era taxonomy, chapter status board
├── eras/                 # Tradition chapters (markdown), filed by era 01-prehistory … 09-modern
├── themes/               # Comparative-theme chapters (cross-era), including the ch01 template
├── vault/                # Vault entries V01…: sacred objects and texts, one markdown file each
├── sources/              # Citation logs: one per chapter, per Vault entry, and for the Pantheon
├── content/
│   └── chapters.js       # Chapter bodies as HTML (built from the markdown; read by the tools, not deployed)
├── docs/                 # The website (deployed as-is to Cloudflare Pages)
├── functions/            # Cloudflare Pages Functions (POST /api/subscribe for the home-page form)
├── tools/                # Build, conversion and verification scripts
├── art-source/           # Source artwork kept out of the deployed site
├── .github/workflows/    # deploy.yml (deploy), verify.yml + game-runtime.yml (checks)
├── 00-audit/             # Site audits (current: 00-audit/site-audit.md)
├── drafts/, icm/, stages/, mini-games/   # Historical planning and working notes
└── README.md
```

## Website

`docs/` is a static site: HTML, CSS and vanilla JavaScript, with no framework
and no runtime build. Sections:

- home, **eras**, **traditions**, **themes**, and one page per **chapter**;
- **compare**, **search**, and **random**;
- **methodology** (the sourcing standard and the pending-review tag) and **about**;
- the **Vault**: an interactive study page for each sacred object or text;
- the **Pantheon**: a directory of divine and sacred figures;
- **Symbols**: the site's sacred symbols, twelve of which open a mini-game. Every
  fact shown in a game is checked against chapter text by a
  `tools/verify-*.js` script.

The chapter, era, listing, Vault, search-index and sitemap pages are
**prerendered** and the output is committed. After changing content, rebuild
in this order:

```sh
node tools/build-vault.js
node tools/build-chapters.js
node tools/build-pages.js
```

To add or update a chapter's body, convert its markdown with
`node tools/md-to-chapter.js <id> <file.md>` and replace that chapter's block in
`content/chapters.js`; its entry (title, era, `pending` flag) lives in
`docs/assets/data.js`.

To preview locally, serve the folder: `python3 -m http.server -d docs`.

### Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which publishes
`docs/` (plus `functions/`) to **Cloudflare Pages** with
`wrangler pages deploy docs`. The custom domain is attached in the Cloudflare
dashboard. `docs/CNAME` is a leftover from the GitHub Pages setup, and
Cloudflare ignores it.

The email form's function answers `not_configured` until a KV namespace named
`SUBSCRIBERS` is bound to the Pages project. The form says so honestly
rather than pretending to subscribe anyone.

### Checks

- `verify.yml` runs every `tools/verify-*.js` whenever chapter text or game data
  changes, so every game fact must still appear in its source chapter.
- `game-runtime.yml` lints the game code for undeclared references and plays
  the fighter to a KO in a headless browser.

## Status

- **65 chapters** are live: 58 traditions across the nine eras and 7
  comparative themes. The per-chapter review status is on the
  [status board](outline/master-outline.md).
- The **Vault** and the **Pantheon** are live, and so are **12 games**.
- The latest full audit is [`00-audit/site-audit.md`](00-audit/site-audit.md).
