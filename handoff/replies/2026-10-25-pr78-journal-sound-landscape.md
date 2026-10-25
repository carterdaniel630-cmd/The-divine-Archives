# 2026-10-25 ~07:45–08:20 UTC — build loop: PR #78, Journal Sound pill under the ✕ (phone sideways)

**What:** the live defect from the small-defects list ("Journal 'Sound' button sits under the close ✕ at phone
width"), value 1/3 (live, phone). #76 → #75 → #77 all wait on Carter's Merge button for #76, so this was the
highest-value item needing no approval to build.

**Found:** the overlap only happens with the phone **held sideways** (upright 320–430: fine). There the game title
is hidden, so the Journal's HUD row rises into the corner buttons: Sound pill under the ✕ at every sideways width
tested (568–932), and at 568 (smallest phones) the hearts under "Full screen" too.

**Fix:** PR #78, branch `loop/journal-sound-landscape` @ `42e0a6a`, off `main` `c957af5`. CSS only, 5 lines in the
sideways-phone rule of `docs/assets/games/games.css`: full-screen button icon-only (as upright phones already do);
Journal HUD row padded 2.75rem each side (symmetric so the stats don't move). No file touched by #75, #76 or #77.

**Checked (this run wrote it, so this is not the independent review):**
- headless phone sideways 568/640/667/740/844/932, reduced motion on: no overlap with either corner button (before:
  Sound under ✕ at all six); upright 320/360/375/390/412/430: positions unchanged;
- all 12 games opened sideways: 0 script errors, 0 wider than the screen;
- full build order 0 files changed; 17/17 verify; 42/42 tests; review-checks `--base origin/main --build` 9/9, 0 warnings.
- Screenshots: `handoff/previews/journal-sound-landscape/` (before/after at 740 and 568).

**Noticed, not fixed (pre-existing, added to defects list):** upright at 320 wide, the Journal's HUD (hearts, "Plunder")
and the A button are clipped at the dialog edges. 360 and up are fine.

**Next for #78:** independent review by a run that wrote none of it; GitHub checks green incl. Lighthouse; then
Carter's yes to go live (batched). Items per run: 1.
