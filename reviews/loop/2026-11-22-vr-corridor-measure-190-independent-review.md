# Independent review — #190 VR draw ledger (loop/vr-corridor-measure@4436c5d0)

Reviewed: 2026-11-22 ~22:45 UTC, by a VR loop run that wrote none of #190. Against `reviews/REVIEWER.md` §3–§4.
Diff vs main: 3 new files — `tools/vr-draw-ledger.js`, `audits/vr-draw-ledger/2026-11-22-corridor.md`, its JSON. No `docs/` change.

## §3 automatic checks (on 4436c5d0)
- `review-checks.js --base origin/main`: 9 passed, 0 failed, 0 warnings. Every `tools/verify-*.js`: 18/18.
- GitHub: 4/4 green (Lighthouse is path-filtered to `docs/` and does not run; nothing on the site changes).

## §4 checklist
1. Accuracy (here: the report's numbers and code citations against the data and the code)
   - Re-ran the tool myself on the branch's `docs/`: all eight headings reproduce **exactly** (0° 736,156 tris / 192 calls … 180°
     654,988 / 152), 0 script errors. pass.
   - From the committed JSON: zones at 0° sum to 736,156; the four grounds 202,798 + 199,960 + 166,846 + 91,916 = 661,520 = 89.9%
     ("about nine tenths", "90%") and 88 calls; ch03 plants 123,552 (429 instances); Spine ground plane 88,560; Spine culling
     sphere r 77.56 m on a 155.1 m strip ("77 m radius", "155 m"); never-culled ground objects at 0° 504,236. All match. pass.
   - Code citations: `world.js` 781 and `fauna.js` 165, 288, 330, 423 each set `frustumCulled = false` on main; `style.js` 490 is
     the flame mesh with `frustumCulled = false` (the report says "likely, not checked" — honest). pass.
   - The fixes' figures are labelled "estimates, not measured" and "don't trust these estimates". pass.
2–5. Lens balance, evidence tiers, contested claims, tone: not applicable (a measuring tool, no content claims). pass.
6. Religious sensitivity: nothing touched. pass.
7. Games and 3D: no site file changes; the tool only reads the page in a headless stand-in headset. pass.

## Note (not a finding)
- The ground groups' scene-child numbers move between runs (ch03's ground was #125 in the committed run, #124 in mine); the
  report names them by room, so nothing in it is wrong. The "scene child 109/108" labels were stable in my run, but whoever
  identifies them (VR-STATUS Next) should find them by content, not by number.
- Fix 3 (a distant tier for the ground) is correctly marked as an artistry call for Carter, not built.

## Verdict
PASS, 0 findings. Carter's per-item yes is on file (`decisions-2026-11-22-pr190-yes.md`).
