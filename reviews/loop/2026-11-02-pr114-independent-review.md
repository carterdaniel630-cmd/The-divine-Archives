# Independent review — PR #114 Symbols page lazy-load (2026-11-02 ~04:15–04:35 UTC)

**Verdict: PASS, 0 open findings.** Reviewed by a build-loop run that wrote none of #114's site changes
(builder: session ..WzTpDKp4yBFafKNBEAyr). Reviewed diff: `origin/main...f5c54a9` (2 files:
`docs/assets/games/archive-games.js` +70/−6, `docs/symbols.html` +22/−16). Per `reviews/REVIEWER.md` §3–§4.

## Re-sync
`main` moved to `b97a868` (#113). Branch re-synced by a merge commit **`f8c39af`** (adds only `main`'s reviewed
content). Its diff against `main` has the same patch-id as the reviewed diff (`b26c0d48…`), and its tree equals the
tree checked below (`24ead8d`). A rebase + force push was tried first and refused by the session guard; no history
was rewritten.

## §3 Automatic checks (on the re-synced tree)
- Full build order (stamp-dates, build-og, vault, chapters, pages, museum, framework, entity-registry, sky): no diff.
- `tools/verify-*.js`: 18/18 pass.
- `node --test framework/test/*.test.js`: 42 pass, 0 fail.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- eslint no-undef: **not run locally** (npm install blocked in this sandbox). Read by hand: every new name
  (`lazyScripts`, `loading`, `loadedSrc`, `lazy`, `load`, `isAvailable`, `loadScript`, `catalog`, `escText`,
  `titleId`, `openState`, `Event`) is defined in scope. CI `runtime` runs the real lint on the new head.
- `tools/ci-play-fighter.js` against the PR: 40 moves' frame data match; played to KO; 0 page errors.

## §4 Checklist
1. Accuracy: no content claims changed. The code comment says "~0.9 MB"; the builder's reply rightly does not
   claim it. Measured by this run (resource timing, decoded sizes, 390 px): `main` 933.7 KB / 25 JS files →
   PR 305.9 KB / 11 files (−628 KB). Matches the builder's figures. **pass** (comment figure is the order's
   estimate, labelled as Carter's bundle wording; advisory below).
2–5. No chapter or prose changed. **pass**.
6. Sensitivity: no image, symbol or sacred-object change; the same symbols and triggers as before. **pass**.
7. Games: own headless walk:
   - All 12 games by `#play=<id>` at 360×640 and 390×844 (touch): registered, real game mounted (no placeholder, no
     "Opening" left), no sideways scroll, 0 page errors — 24/24 OK.
   - Tap path: tapping the first live symbol (Archive Chess, Egypt) opens the game, focus moves into the dialog,
     Esc closes it, 0 errors.
   - Trigger labels: 20, none read "Play a game".
   - Slow load (treasure.js delayed 2.5 s): "Opening the game…" shows; closing during the load leaves 0 stray dialogs.
   - Failed load (labyrinth.js blocked): failure line shows; after unblocking, reopening mounts the game.
   **pass**.

## Advisory (not a finding)
- The code comment in `symbols.html` says the games were "~0.9 MB"; measured saving is ~0.61 MB (data.js and
  plates.js stay because the page draws from them). Visitors never see it; a later touch can correct the comment.

## Merge
Per item, covered by Carter's honesty-bundle yes (`order-2026-11-01-honesty-completions-bundle.md` item 4).
**Missing only:** every GitHub check green on `f8c39af`, Lighthouse included. Then fast-forward `main` → `f8c39af`.
