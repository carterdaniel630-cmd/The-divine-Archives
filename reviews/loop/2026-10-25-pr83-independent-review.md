# PR #83 independent review: Journal touch polish — 0 open findings; brought up to `main`

**When:** 2026-10-25 ~12:50–13:20 UTC, build loop. **By:** a run that wrote none of #83.
**Candidate reviewed:** `loop/journal-touch-polish` @ `39eeef8` (PR commit), checked as merged onto current `main`
`91c40fe` plus #84's already-reviewed recount `88f2aa8` → new head **`be2ad69`** (pushed to the PR branch; both merges
clean, no conflicts; they add only `main` and #84's reviewed 4-line registry diff).
**Checklist:** `reviews/REVIEWER.md` §3–§4.

## In plain words
The fix does what it says. On a touch phone the small Select and Start pills now take a full-size touch (44–48 px tall)
without looking any different and without stealing touches from the D-pad, A/B or shoulder buttons. The first Journal tip
now says "◀ ▶ run · A jumps … B cracks the whip" on a phone, and still names the keys on a computer.

## What was checked
- **Diff shape** (`origin/main...be2ad69`, site part): `docs/assets/games/games.css` +7 (touch-only `@media (pointer:coarse)`
  rule: an invisible `::before` layer centred on each `.ap-mid .ap-btn`, `width:max(100%,44px)`, `height:44px`; stacked
  pills get `row-gap:1.4rem`), `docs/assets/games/treasure.js` +5 −3 (`hint()` takes optional touch wording; `onTouch()` is
  the negation of the same `(hover:hover) and (pointer:fine)` test that shows the keyboard legend, `games.css` line 714).
  Plus #84's `framework/registry/{index,source}.json` (reviewed separately, 0 findings).
- **Wording matches the controls:** the Journal's own how-to text (`treasure.js` ~line 1713) says jump = **A**, whip = **B**,
  D-pad runs, so the touch tip is accurate.
- **Geometry:** stacked pills are 22 px tall; 44 px layers need ≥ 22 px between pills, and 1.4rem = 22.4 px; side by side
  the layer is the pill's own width (min-width 46–52 px > 44 px), so layers never overlap. Measured below.
- **Caching:** no `?v=` bump is needed: `docs/_headers` sends `/assets/games/*` with `max-age=0, must-revalidate`.
- **Automatic checks on `be2ad69`:** full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages,
  build-museum, build-framework, build-entity-registry, build-sky) all exit 0 and leave the tree clean; 17/17
  `tools/verify-*.js`; `node --test framework/test/*.test.js` 42/42; `review-checks.js --base origin/main --build`
  9 passed, 0 failed, 0 warnings.
- **Headless (own script, phone emulation with touch, `pointer:coarse` confirmed), Journal and Fighter, upright
  320/360/390/412/430/480/520/600 and sideways 844×390, 740×360:** tap height through each pill's centre (counted with
  `elementFromPoint`, only points that land on that same pill) Journal Select 44–48, Start 47–48; Fighter Start 47–48;
  0 of 96 (Journal) / 160 (Fighter) sample points on the D-pad, face and shoulder buttons taken by a pill; no sideways
  scroll; 0 script errors (the only failed request is the Google Fonts stylesheet, blocked in this sandbox). Tip read from
  the live toast: phone "◀ ▶ run · A jumps (hold for height) · B cracks the whip."; desktop 1280×900 "← → run · ↑ or Space
  jumps (hold for height) · J or X cracks the whip."
- **§4.1–4.6:** no chapter, source log, Vault entry, Pantheon figure or sensitive item touched: not applicable / pass.
- **§4.7:** game files changed; runtime opened and played headless as above, renders, no errors. `game-runtime.yml` on
  the old head `39eeef8` was green; GitHub checks on the new head `be2ad69` were started by the push (next run confirms).

## Findings
- None open.

## Notes (not findings)
- The new head carries #84's recount so its framework tests are green on `main`; stack order #84 → #77 → #83 (or any order:
  whichever lands after #84 makes #84's part a no-op).
- #77 (`8204268`) and #83 (`be2ad69`) share both merge parents; a trial merge of the two is clean (no conflicts), so they
  can land in either order after #84.

**Verdict:** PASS, 0 open findings. Missing for merge: every GitHub check green on `be2ad69` incl. Lighthouse; Carter's yes
for #83 (then his Merge button).
