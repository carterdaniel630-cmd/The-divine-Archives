# VR loop — 2026-11-16 ~10:02–10:50 UTC: ground at your feet built (PR #169)

**Run:** chained VR loop run. Took VR-LOCK at 10:02 (none held), released at the end. Merged nothing.
VR-STATUS Next 1 (`decisions-2026-11-16-carter-ground-at-your-feet.md`, "Ground at your feet").

## Built — PR #169 `loop/vr-ground` `5067bc74` (stacked on #166 `loop/vr-height` `902e96dc`)
- Egypt (ch02), Mesopotamia (ch03) and the Bronze Age corridor: **no glass, no bronze grid; the ground is at the
  floor.** Land is held 1.2 cm below the floor, water 6 cm below, and beds under the water keep their old depth
  (deepest point 0.30 m in ch02, 0.17 m in ch03, 0.23 m in the corridor). There are no drops (Comfort §a.6).
- Phones, computers and the headset get the same change, because it's one build. Every other room keeps its pit
  under glass.
- Plants still grow where they did (papyrus on the shore, lotus on the water). Creatures and the water's
  shimmer follow the raised ground.
- Before/after (flat, looking down): `2026-11-16-ground-ch02-before.png` → `2026-11-16-ground-ch02.png`;
  `2026-11-16-ground-ch03.png`; `2026-11-16-ground-cor.png`.
- New check `tools/ground-check.js` (headless): passes at 960 / 390 / 360 px.

## Checks on `5067bc74`
- Build order leaves the tree clean; review-checks 9/0/0; verify 18/18; tests 51/51; xr-entry-check all pass;
  ground-check all pass.
- Phone budget held and lighter (against #166 head): corridor 86 → 80 calls, ch02 69 → 65 calls, triangles down;
  hall identical; 0 errors.
- GitHub checks: just started; the next run reads them. This run did not wait holding the lock.
- Note: one ground-check attempt at 1280 px crashed the headless browser (memory) on the second room; 960 px is
  used. Not seen on any phone size.

## Not in this piece (says so in the PR)
- **Creatures don't step aside yet.** Ibis, heron, cats and lizards now walk at floor level, and fish can jump
  ~0.5 m out of the water near your feet. Comfort §e.22 (nothing startles within 2 m) is the next piece,
  "React to you". **Recommendation: #169 goes live only together with that piece.**
- Papyrus and reeds stand up to ~1.2 m at the water's edge, and you can walk through them until "plants part".
- ch03's marsh was already too shallow for its tilapia, so only the heron shows there. That goes to "More creatures".

## #166 (height check)
- GitHub on `902e96dc`: **7/7 green incl. Lighthouse** (10:03 UTC). Independent review PASS 0 open (earlier run).
  **It is now ready for Carter's per-item yes.**
