# 2026-10-25 ~11:42–12:15 UTC — build loop: PR #83, Journal touch polish

**What:** Next 10 (small defects part 2), its two remaining Journal items: "Select/Start pills under the 44 px tap
guide" and "timed tip names keyboard keys on touch phones". Live, pre-existing phone defects (value 3). Everything
higher in Next waits on Carter (#76 Merge button; yes for #68/#78–#82) or on Muse (Armory batch 1). #82's Lighthouse
was still running at 11:45 (started 11:30), so not waited on.

**Found (on `main` `c957af5`):** tap height through each pill's centre 24–25 px at every phone size (the pills are
22 px tall, turned 18°). The first tip ("← → run · ↑ or Space jumps … J or X cracks the whip") shows on touch phones,
where neither key exists. The pills belong to the shared controller (`pad.js`), used by the Journal and Fighter.

**Fix:** PR #83, `loop/journal-touch-polish` @ `39eeef8`, off `main`. 2 files, +12 −3.
- `games.css`, touch screens only: an invisible layer centred on each pill takes the touch at 44 px; stacked pills
  (narrow phones) sit 1.4rem apart so the two areas never overlap. The pills look the same.
- `treasure.js`: hints may carry touch wording; on a touch screen with no mouse (the test that hides the keyboard
  legend) the first tip reads "◀ ▶ run · A jumps (hold for height) · B cracks the whip." Desktop unchanged.

**Checked (this run wrote it, so this is not the independent review):**
- headless phone emulation, Journal and Fighter, upright 320/360/390/412/430/480/520/600, sideways 844×390 and
  740×360: tap height through the centre 44–48 px; 0 sample points of the D-pad, face or shoulder buttons taken over
  by the pills; 0 script errors; no sideways scroll; elements outside the dialog unchanged from `main` (the ones at
  320/360/430 are what #79 fixes);
- tip: phone shows the button wording, desktop the key wording (read from the live toast);
- full build order (0 changes), 17/17 verify, 42/42 tests, `review-checks --base origin/main --build` 9/9, 0 warnings;
- trial merge with #78, #79, #80: clean; re-measured with all three: 44–48 px everywhere, 0 outside the dialog;
- screenshots `handoff/previews/journal-touch-polish/` (before-390, after-390 with the new tip).

**Note:** the lock commit `e0f5db9` carried an attribution line naming a model (same slip as earlier runs); not
rewritten (shared branch). The PR commit and this write-back carry none.

**Next for #83:** independent review by a run that wrote none of it; all GitHub checks green incl. Lighthouse; then
Carter's yes (batched with #78–#82). Items per run: 1.
