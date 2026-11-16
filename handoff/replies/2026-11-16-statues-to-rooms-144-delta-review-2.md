Batch: delta review 2, PR #144 (statues to their rooms), re-sync onto #162 + main with the VR pilot G1+G2
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/statues-to-rooms@56d7c9d6 (15450243..56d7c9d6: one merge commit)
Summary: 0 passed, 1 fixed, 0 need you.

Independent: same chat session as delta review 1; wrote none of #144's build.

Automatic checks (on 56d7c9d6): review-checks.js --base origin/main --build 9 passed, 0 failed, 0 warnings; all 18
verify-*.js pass; framework tests 51/51.

FIXED    (1)
  - site:statues-to-rooms-144/app-version: #144 changes docs/museum/app.js but its museum.html still asked for
    app.js?v=47, the number from before the branch. Main is now at v=49 for the VR pilot, so after the merge phones
    holding v=49 would have kept running the old file. The page now asks for v=50. Fixed in the merge commit 56d7c9d6.

Merge note (no finding): docs/museum/app.js conflicted only in the test hook (window.__MU). Both sides were kept:
the VR pilot's xr / xrExit / xrMove / xrCanStand lines, and #144's statues() line that reports each statue's room.
The statue import line is #144's (statues.js?v=2, no RING_R; nothing else uses RING_R). #144's diff against #162's
head is the same 8 files as before, plus the one version line.

Checks on 56d7c9d6
  - The statue probe (handoff/previews/statues-to-rooms-review/probe.js), 390x844 and 360x740, gives the same results
    as before: Rotunda empty; Zeus (ch15) and Shiva (ch83) each 72 close views, 0 over budget (worst 202.7k / 61,
    166.4k / 41); shown from all 8 sides; cards open front and back; no statue through walls; 0 script errors.
  - tools/xr-entry-check.js (the VR door, simulated headset): "all XR entry checks passed", including teleport, snap
    turn, vignette and the refused-session path, with 0 script errors.

NEEDS CARTER (0)

Needs your decision
  - Nothing needed: merge per item on Carter's "a,yes" once #162 is merged and GitHub is green on 56d7c9d6.
