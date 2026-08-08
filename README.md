# The Divine Archives

A long-term comparative reference work on world religion, mythology, and the
esoteric — organized **chronologically by era**, not by region. Each chapter
covers one culture/tradition within its era, or a cross-cutting comparative
theme (flood myths, creation cosmogonies, and the like).

The defining commitment is **evidence honesty**: every factual and
archaeological claim is sourced from real primary texts and current scholarly
consensus, contested points are flagged as contested rather than resolved by
picking a side, and genuine gaps in the record are named instead of papered
over. Every chapter ends with a plain reckoning of what's supported, what
isn't, and what's still open.

## How the work runs

This is a quality-over-speed project with a hard review gate:

1. **Draft** — one chapter at a time, researched from real sources, written in
   the narrative style of `ch01-the-flood.md` (open on a concrete scene or
   artifact, close with an evidence-honesty section). Drafts live in
   [`/drafts/`](drafts/).
2. **Review** — Carter is the sole approval authority. A chapter is a *draft*
   until he explicitly approves it.
3. **Approve** — only then does the chapter move into its
   [`/eras/`](eras/) folder and become eligible for the future website.

Nothing skips the gate. The full rules are in **[`CLAUDE.md`](CLAUDE.md)**.

## Repository layout

```
The-divine-Archives/
├── CLAUDE.md              # Project rules and the mandatory review gate
├── outline/
│   └── master-outline.md  # Framework, era taxonomy, chapter status board
├── eras/                  # APPROVED tradition chapters, filed by era (01-prehistory … 09-modern)
├── themes/                # APPROVED comparative-theme chapters (cross-era)
├── drafts/                # Work in progress — everything starts here
├── sources/               # Per-chapter citation logs
├── docs/                  # The website (static site, served by GitHub Pages)
└── README.md
```

## Website

The public site lives in [`docs/`](docs/) as a self-contained static site — plain
HTML, CSS, and vanilla JavaScript, **no build step**. Open `docs/index.html`
locally, or serve the folder with any static server.

The review gate is enforced by the site itself: a chapter's text is published
only when its entry in [`docs/assets/data.js`](docs/assets/data.js) has
`status: "published"`. Drafted-but-unapproved chapters render an honest
"awaiting review" placeholder and their text never reaches the public build.

**Going live (GitHub Pages + custom domain):**

1. Repo **Settings → Pages** → set the source to the **`main` branch, `/docs`
   folder** (or whichever branch is being published).
2. The custom domain is set via [`docs/CNAME`](docs/CNAME) — currently
   `getconexto.com`. Edit that one line if the domain or subdomain differs.
3. In your DNS provider, point the domain at GitHub Pages (an `ALIAS`/`ANAME`
   or four `A` records at the apex, or a `CNAME` to `<user>.github.io` for a
   `www` subdomain), then enable **Enforce HTTPS** once the certificate issues.

## Status

**Phase 1 — production, and Phase 2 — website, both underway.** Two chapters are
approved and published — *The Flood* (comparative theme) and *Egypt* (Bronze
Age) — and the full website is built and ready to deploy to `getconexto.com`.
Remaining traditions and themes appear on the site as honest "in preparation"
entries until each is drafted, reviewed, and approved.
