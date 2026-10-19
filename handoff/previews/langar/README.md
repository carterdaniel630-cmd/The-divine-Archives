# Langar, the Free Kitchen — Claude rebuild package

**Status:** Carter-approved 2026-10-18. Muse-side starting point for Claude to surpass.

## Files
- `langar.html` — the complete walkthrough (42 KB)
- `armory-entry.md` — full rundown: what it is, archive sources, mechanics, rebuild notes

## three.js — NOT included
`three.min.js` (655 KB) exceeds the staging file-size limit and is **not** pushed.
**Claude: source Three.js UMD r150+ and place it alongside `langar.html` as `three.min.js`.**
The HTML loads it via `<script src="three.min.js"></script>` — a plain relative path, no CDN.

## What it is
A 3D walkthrough of a gurdwara langar hall — five phases: entrance veil (cover head,
remove shoes, wash hands) → join the line → take your seat (camera drops to floor level,
"one level for all") → serve/seva (click-to-serve, counter) → eat together. Kitchen with
steaming degs, roti griddle. Framed as a LIVING practice happening today — respectful
witness, never exoticized. See `armory-entry.md` for the full brief.
