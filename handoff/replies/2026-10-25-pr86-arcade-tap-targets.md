# 2026-10-25 ~16:57–17:10 UTC — build loop: PR #86, arcade tap targets (part 1)

**First:** #83 on `45d4a95`: 5/6 GitHub checks green, Lighthouse still running (started 16:56), so not merged and not
waited on with the lock held (STATUS 1c → 1d).

**What:** Next 5, Arcade playability floor, its "readable tap targets" piece (value 3: what visitors feel on a phone).
Everything higher waits on #83's Lighthouse or on Carter / Muse.

**Found on `main` `3762691`** (headless touch-phone emulation, all 12 games, 320×640, 360×740, 390×844, 412×915,
480×900, 600×960 upright, 844×390 and 740×360 sideways): Close (✕) and Full-screen buttons take touches over
34×34 / 31×34 px in every game; the shared text buttons (`.rq-btn`) are 33–35 px tall; the Reliquary menus 37 px.

**Fix:** PR #86, `loop/arcade-tap-targets` @ `cbf6f1e`, off `main` `3762691`. `games.css` only, +8 lines, touch
screens only. Text buttons and the start-screen menus are at least 44 px tall; Close and Full-screen keep their look
and take the touch through an invisible 44 px layer centred on each (the method #83 uses for the pills).

**Checked (this run wrote it, so this is not the independent review):**
- 12 games × 8 sizes, `main` vs #86: Close/Full-screen tap area under 44 px 192 → 0; buttons whose centre another
  control takes 0 → 0; elements outside the dialog 0 → 0; sideways scroll 0 → 0; script errors 0 → 0.
- Start screens grow 5–39 px; the dialogs already scroll inside on `main` (sideways, Begin was below the fold before
  too), so nothing becomes unreachable.
- Full build order 0 changes; 17/17 verify; 42/42 tests; `review-checks --base origin/main --build` 9/9, 0 warnings.
- Trial merge with #83 (also edits `games.css`): clean.
- Screenshots `handoff/previews/arcade-tap-targets/`.

**Left for part 2:** Excavation's 9×9 cells (33 px at 390 wide) and Ziggurat's keypad (40 px) need layout work;
Fighter's "Read …" link is an inline text link (29 px).

**Next for #86:** independent review by a run that wrote none of it; all GitHub checks green incl. Lighthouse; then
Carter's yes. Items per run: 1.
