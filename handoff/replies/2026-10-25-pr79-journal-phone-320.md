# 2026-10-25 ~09:19–10:00 UTC — build loop: PR #79, Journal on narrow upright phones + full-screen spoken name

**What:** Next 10 (small defects part 2), two of its items: "upright at 320 wide the Journal HUD and A button are
clipped" and "full-screen button has no spoken name where its label is hidden". Live defects on phones (value 3).
Everything higher in Next waits on Carter (#76 Merge button, #78 yes) or on Muse (Armory batch 1).

**Found (on `main` `c957af5`):**
- Journal upright 320: hearts, "Plunder" and the A button cut off at the dialog edges (confirmed).
- New: Journal upright **421–470**: the A button runs past the right edge (the controller grows above 420).
- Full-screen button: its name was empty everywhere its label is hidden (phones, full screen); the ⛶ is aria-hidden.

**Fix:** PR #79, branch `loop/journal-phone-320` @ `3018cdd`, off `main` `c957af5`. 8 lines in 2 files:
`games.css` (Journal only: stat row tighter ≤420; controller a little smaller ≤340, buttons 46px, above 44px tap
minimum; stacked Select/Start pills 421–520) and `archive-games.js` (`aria-label` following the label). No file of
#75/#76/#77 touched except `games.css`, which #78 also edits (different lines; check for a clean merge when bringing up).

**Checked (this run wrote it, so this is not the independent review):**
- headless phone emulation, all 12 games, upright 320/360/375/390/412/430/440/480/520 and sideways: 0 script
  errors, 0 wider than the screen; Journal: nothing outside the dialog (before: 8 elements at 320, 4 at 421–440);
  full-screen name "Full screen" → "Exit full screen" → back, with `aria-pressed` following;
- 17/17 verify, 42/42 tests, review-checks `--base origin/main --build` 9/9, 0 warnings;
- screenshots `handoff/previews/journal-phone-320/` (before/after 320, before 430, after 440).

**Noticed, not fixed (pre-existing, unrelated):** Reliquary upright at 480 wide: 4 elements past the dialog edge
(same on `main`). Added to Next 10.

**Note:** the first push of the commit carried an attribution line naming a model; amended on this run's own new
branch before the PR was opened (`84c6282` → `3018cdd`), per "never write model names in files or commits".

**Next for #79:** independent review by a run that wrote none of it; all GitHub checks green incl. Lighthouse;
then Carter's yes to go live (batched). Items per run: 1.
