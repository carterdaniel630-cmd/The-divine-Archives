# 2026-11-01 ~22:00 UTC — PR #106 merged; PR #107 built (museum fix batch item 3)

Build loop run, session ..WzTkikzopH4A4NayQHp8. Lock taken 21:42 UTC, released at the end of this run.

## 1. PR #106 merged (museum fix batch item 2: room guide bound to the Directory)
- Lighthouse on `412684a` completed **green** at 21:45 UTC; all 7 GitHub checks green on `412684a`.
- Merge conditions (LOOP.md "Merging"), all met:
  - Carter's per-item go: `order-2026-11-01-106-review-walk-merge.md` ("reviews pass do the walk through and merge").
  - Independent review + in-room walk (`2026-11-01-pr106-independent-review.md`), and the delta `3fa0c96..412684a`
    reviewed PASS 0 findings by a run that wrote neither (`2026-11-01-pr106-delta-review.md`). This run wrote none of #106.
  - Local checks re-run by this run on exactly `412684a`: build order, no generated-file changes; `review-checks.js
    --base origin/main --build` 9/9; `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 42/42;
    phone-size (390×700) Chromium check of the museum, Rotunda Flood bay guide, 0 page errors.
  - Nothing in the diff needs a separate approval (a fix from Carter's approved fix batch; no new room, no pending tag change).
  - No commits after the candidate.
- **Fast-forward `main` `6ee2150` → `412684a` at ~21:53 UTC.** Deploy run 234 **green** (21:53 UTC).

## 2. PR #107 built: Rotunda guide "Loading this room's exhibits…" hang (fix batch item 3)
`loop/rotunda-guide-load` **`4bb3d40`**, stacked on #106 (now on `main`, so the PR diff is only this commit).
- **Cause found, reproduced:** the guide is drawn when the visitor enters an area. If the zone's exhibit file is still
  downloading (slow phone network), it says "Loading this room's exhibits…". When the file arrives and the exhibits
  are built, nothing redrew the open guide, so it stayed on "Loading" until the visitor moved to another area.
  Reproduced in Chromium at phone size by holding `museum/wings/rotunda.json` back 22 s: exhibits built at ~7 s,
  guide still "Loading" at 19 s.
- **Fix:** `buildWingExhibits` redraws the guide once a zone is built, only when the guide is open and the visitor's
  room is in that zone. `app.js?v=44`.
- **After:** same setup, guide shows the Flood room's list the moment the exhibits build. Same check in Egypt (Wing II,
  `02-bronze-age.json` held back): updates too. 0 page errors. Local checks green (as above).
- **Not covered (follow-up):** if the exhibit file download fails outright, the guide still says "Loading…" forever
  (no retry, no message). Small; queued in STATUS.
- **Needs:** independent review by a run that wrote none of it; GitHub green incl. Lighthouse; merge class: a fix
  from Carter's approved museum fix batch, so class (b) if the reviewer agrees.

## 3. Folded into Next
- `note-2026-11-01-egypt-pond-grid.md` (floor grid through the Egypt pond; pond creatures overlap): atlas routed it
  to the DETAIL PASS; no queue change. Recorded in Next.
- `note-2026-11-01-phone-battery-weight.md` (museum and games drain Carter's phone): fix family recorded in Next,
  behind the fix batch; no queue change (atlas: pace note stands).
