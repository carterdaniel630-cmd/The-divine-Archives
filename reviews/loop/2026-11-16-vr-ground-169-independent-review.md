Batch: independent review, PR #169 (VR pilot: ground at your feet)
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/vr-ground@5067bc74 (diff origin/main...5067bc74, main 39a947b8; #169's own delta is loop/vr-height@902e96dc..5067bc74, #166 reviewed separately)
Summary: 1 passed, 0 fixed, 0 need you.

Independent: VR loop run (chained, ~15:50-16:20 UTC). It wrote none of #169 (built by the 10:02 UTC VR loop run) and none of #166 beneath it.

PASSED   (1)
  - site:pr169 Ground at your feet (ch02 Egypt, ch03 Mesopotamia, Bronze Age corridor)
    - Scope of #169's delta: 5 files, 114+/23-. world.js (ENV `feet` on 3 areas, FEET constants, feetMap, buildPit
      raises the ground and drops the glass/bronze grid for `feet` areas, addGlass split out), app.js (world.js?v=6,
      fauna.js?v=5, __MU.ground probe), fauna.js (import bump), museum.html (app.js?v=52), new tools/ground-check.js.
      No content, data, chapter, Vault, Pantheon or generated file touched.
    - Code read in full. Heights: water at -0.06; land rises at half its slope above the water and is capped at
      -0.012 (never above the floor); everything below the water keeps its depth. Measured probe: ch02 range
      -0.296..-0.012, ch03 -0.172..-0.012, water -0.06, no glass, plants 281 / 478 (Comfort §a.6 no drops holds).
    - Consistency: plant placement and ground tint stay in raw biome space (same choices as before), drawn at the
      raised height; A.waterY and A.groundH are both the raised values, so every fauna.js use (fish swim band,
      wader/cat/lizard footing, splashes, drips) and the pit shader's uWater read one consistent space. The shore
      uniform is horizontal only, so raw-space search is correct. Ice path also raised (no ice in the pilot).
    - Teleport lands on the floor plane (xr-move.js floorY 0), ring 0.012 above, ground 0.012 below: no z-fight
      with the ground; xrCanStand unchanged (walls only).
    - Non-pilot rooms keep glass (ground-check: ch05 keeps glass).
    - Local on 5067bc74: full build order leaves the tree clean; review-checks.js --base origin/main --build 9/0/0;
      18/18 verify-*.js; framework tests 51/51; xr-entry-check all pass; ground-check all pass at 960/390/360 px
      (0 script errors).
    - Phone budget (museum-baseline, 412 px, DPR 1) against #166 head 902e96dc: hall 39/39 calls, identical tris;
      corridor 86 -> 80 calls, 205308 -> 204594 tris; ch02 67 -> 63 calls, 120361 -> 119817 tris; +3.3 KB at ready;
      0 errors both. Lighter, as the PR says.
    - GitHub on 5067bc74: guard (skipped by design), checks, test, links, runtime x2, lighthouse all completed green
      (lighthouse 11:05 UTC).
    - Checklist 1-6: no claims or content; nothing religiously sensitive. 7: museum code, rendered and checked above
      (own probe at 390 px; the author's flat screenshots on staging match the measured heights).
  - Notes (not findings):
    - #169 alone lets ibis, heron, cats and lizards walk at floor level and fish leap near the visitor; Comfort
      §e.22 is met only by #170 (React to you). Agree with the PR: #169 goes live together with #170, not alone.
    - For "More creatures": fauna.js flock() `low` flyers use y0 = waterY + 0.18 and y1 = -0.12, which inverts in a
      `feet` area (waterY -0.06 -> y0 0.12 > y1); insects() aim at min(-0.12, ground + ...), below a feet ground at
      -0.012. Neither kind is in a pilot area today, so nothing is wrong now; any low flyer, butterfly or dragonfly
      added to ch02/ch03/the corridor must re-base these boxes on the raised ground.
    - Papyrus and reeds up to ~1.2 m stand in the walking area until #170's lean; judged in the headset.

FIXED   (0)

NEEDS CARTER   (0)
