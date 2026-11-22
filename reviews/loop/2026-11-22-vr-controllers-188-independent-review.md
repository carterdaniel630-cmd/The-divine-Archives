# Independent review — PR #188 (VR: point at a relic and tap to read its label)

Batch: VR loop — independent review of #188 (pointing and reading in the headset, pilot rooms only)
Reviewed: 2026-11-22
Covers: loop/vr-controllers@1fef4276
Reviewer: a VR loop run that wrote none of #188 (its commit came from a different session).
Summary: 1 passed, 0 fixed, 0 need you.

Automatic checks (re-run here on 1fef4276):
- full build order: no diff;
- every tools/verify-*.js: 18/18 pass;
- node --test framework/test/*.test.js: 51 pass, 0 fail;
- review-checks.js --base origin/main --build: 9 passed, 0 failed, 0 warnings;
- tools/xr-entry-check.js: all pass, run twice (135 ok each), 0 script errors;
- GitHub: 7/7 green on 1fef4276, Lighthouse included.

PASSED (1)
  - site:pr188: 0 findings. Diff read in full (app.js, xr-read.js, xr-move.js, museum.html, xr-entry-check.js).

Checklist (REVIEWER.md §4)
  - 1 accuracy: pass. No new claims: the plaque is the flat card's own text through one function (cardHTML);
    the harness confirms 39 open readings carry every title, flag and contested line of their flat card.
  - 2 lenses, 3 evidence tiers, 4 contested: pass. Same text as the flat card; "sources and evidence are on its page"
    note added where the card had links.
  - 5 tone: pass.
  - 6 religious sensitivity: pass. No new image, model or scan; no sacred object newly shown. Pending elements outside
    Egypt keep their text back (12 found and veiled); Egypt reads in full under Carter's 2026-11-16 ruling.
  - 7 games and 3D: pass. Flat museum unchanged: museum-baseline.js on main and on #188, 3 runs each, hall 36 / Egypt
    67 calls identical, corridor 84–87 on both (load-timing noise), triangles equal; +5.7 KB page weight. 360/390 px and
    desktop with no VR: no Enter VR button, reading module not downloaded, 0 script errors.

GPU numbers
  - xr-entry-check §9 (ch03, at the Ishtar Gate): stereo draw calls 118 hand down, 124 pointing, 128 reading open
    (+10 in all), under Quest 2's 160 at that spot.
  - vr-frame-budget.js (#181 harness), main vs #188, hand down: calls and triangles identical in every view
    (Rotunda 156/148, ch02 202/214, ch03 220/218, corridor 266–268, tris equal). Session memory +2.9 MB (the reading
    canvas, built on first VR entry even if never opened). These views are before #187's culling; the over-budget
    figures there are known and not caused by #188.

Notes (not findings)
  - Re-sync: #188 merges cleanly onto main 23d312d5 (#185 now merged). It conflicts with #187 in museum.html (cache key)
    and in app.js tick(): the re-sync must keep BOTH calls on the headset line (#187's cullUpdate and #188's
    xrRead.update), not pick one side.
  - The plaque's backward tilt is set when it opens and not recomputed on a seated/standing switch; it stays below the
    eyes in both bands, so it reads correctly. Harmless.
  - Each frame, each raised hand runs one pick (exhibit list plus a wall raycast). Fine on paper; the ?vrfps=1 overlay
    (VR-STATUS Next) will show if it costs anything on the headset.
  - Veiled pending elements still show their name and "pending review" on the plaque. The objects themselves already
    stand in the rooms (G4 curtain not built outside Egypt), so the name adds nothing that is not on view; noted in case
    Carter reads OQ-4 more strictly.

Needs your decision
  - Nothing needed for the review. #188 still needs Carter's per-item yes to merge.
