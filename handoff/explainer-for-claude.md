# What Muse Is Doing for Claude — Read This First

**For the build side (Claude Code). From Muse, via the GitHub staging branch. Carter approved this handoff (v2, 2026-10-17).**

## The whole gambit, in plain words

There are three of us, with three jobs:

- **Muse builds things off to the side.** Drafts, previews, specs, fix specs, research, video formats — all prepared in a workshop, away from the live site. Everything Muse makes is a **starting point, never a finished product.**
- **Claude reworks each one and makes it EVEN BETTER, then adds it to the Divine Archives website** (getconexto.com). Claude is the one who builds the real site. Muse never touches the live site.
- **Carter decides.** Carter approves what gets built, checks it on his phone, and says what goes live. Nothing merges to the live site without Carter's explicit go-ahead. Carter also sends TikTok himself. Facebook posting is already automatic — not your job, not Muse's job.

## The standing rule

**Muse outputs are starting points for Claude to surpass — never final product.**

That means: do not copy-paste a Muse draft into the site and call it done. Read it, understand what it is trying to do, then rebuild it better — more detail, better fit, truer to the Archives, compared against the real thing. If a Muse spec is wrong about the repo, the repo is the truth: flag the conflict, do not silently pick one.

## What to do with each kind of item in this package

- **Specs (room specs, system specs, program briefs):** rebuild from the spec. The spec tells you what it is, what it draws on from the Archives, and what the real-world reference looks like. Build it true to that, better than the spec asks.
- **Previews (self-contained demo pages):** rebuild them better for production. They show the shape of the thing. Expand them: more detail, better materials, truer proportions, real depth. Do not ship the preview file itself as production code.
- **Fix specs (relic fixes, game fixes, photo-audit fixes):** fix AND improve. The fix spec tells you what is wrong and what the fix is. Your job is to make each piece better than the spec asks, not just tick boxes. Where a fix spec says a rendition is creative, keep it engaging — label departures plainly, do not strip capabilities for pure accuracy.
- **Decisions:** follow them. They are Carter's rulings. Where two rulings conflict, the newest one wins.
- **Audit briefs:** they are snapshots — historical records of what a review found at the time. Verify them against the repo; do not just trust them. Where a later file fixes a brief's finding, the later file wins.
- **Corrections:** line-level overrides. Where a correction and an older file disagree, the correction wins.
- **ON HOLD items (multilingual plan):** file only. Do not build. English only until Carter reopens it.
- **PARKED items (VR museum, family-court case file, ballgame):** do not build. Do not spec them further.

## Pickup order, every time

1. **Finish** whatever was in progress when work stopped. Do not drop in-progress work to start something new.
2. **Audit** the system yourself: what is built, what is staged, what is broken, what contradicts what. Verify the audit briefs against the repo.
3. **Fold ALL instructions together** — this queue, both audit briefs, decisions, corrections, standing policies. Newest Carter ruling wins on conflict.
4. **Rebuild Muse-side work better** — expand, add detail, compare, push every game and relic further. Do not do the work twice (no parallel rebuilds of the same thing).

## How this channel works

- Muse writes handoff files to the **staging branch only**. The build side reads them here.
- The build side writes replies and status back on the **same branch**, under `handoff/replies/` — one dated file per reply, naming the manifest version it answers. Muse reads them back and reports to Carter in plain words.
- Muse never edits build-side code, replies, or feature branches. The build side works on feature branches.
- **Never main, never merge.** Nothing merges to the live site without Carter's separate explicit go-ahead.
- Carter can halt this channel at any time. A halt means no more writes until Carter reopens it.

## What stays out of this channel

- Video pipeline files (drafts, demos, logs) — Muse-side only, never sent.
- Family-court case file, personal material, financial material — never.
- Instagram — permanently off-limits.
- TikTok sends — Carter's job only.
- Live publishing — never via this channel without Carter's separate explicit go-ahead.

## If something in this package is wrong

Say so in a reply file under `handoff/replies/` — what is wrong, what the repo actually shows, and what you did instead. Do not silently substitute. Do not silently omit a gap: gaps are displayed as gaps.
