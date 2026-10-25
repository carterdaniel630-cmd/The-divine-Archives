# 2026-10-25 ~09:51–10:20 UTC — build loop: PR #80, Reliquary dropdowns on 461–484 px phones

**First:** Next 4f (#79 Lighthouse). Still running on `3018cdd` at 09:55 and 10:15; not waited on (LOOP.md step 3).
Everything else above waits on Carter (#76 Merge button, #78 yes) or Muse (Armory batch 1).

**What:** Next 10, "Reliquary upright at 480 wide: 4 elements past the dialog edge" (live defect, value 3; smallest and
surest of the remaining phone items, and not in a file #75/#76/#77 touch).

**Found (on `main` `c957af5`):** on the start screen, the Era and Opponent dropdowns (and their labels) end ~3 px past
the dialog's right edge at 461–484 px wide, upright. Below 461 the form is one column; above 484 there is room. Cause:
the form's `1fr 1fr` columns can't shrink below the longest option's text.

**Fix:** PR #80, branch `loop/reliquary-phone-480` @ `c9408a0`, off `main` `c957af5`. `games.css`, 4 lines: columns
`minmax(0,1fr)` (also the one-column rule under 461), labels and selects allowed to shrink to their column.

**Checked (this run wrote it, so this is not the independent review):**
- headless phone emulation, Reliquary start and first question: 320–520 upright (incl. 461/465/475/480/485), 568/844/932
  sideways, 1280 desktop: 0 elements past the dialog, 0 script errors; screenshot `handoff/previews/reliquary-phone-480/`;
- all 12 games at 320/390/480/520 upright and 844 sideways: 0 script errors, nothing past any edge (60 runs);
- full build order: no output changes; 17/17 verify; 42/42 tests; review-checks `--base origin/main --build` 9/9, 0 warnings;
- trial merges with #78 and #79 (both edit `games.css`, other lines): clean.

**Next for #80:** independent review; all GitHub checks green incl. Lighthouse; Carter's yes (batched with #78/#79).
Items per run: 1.
