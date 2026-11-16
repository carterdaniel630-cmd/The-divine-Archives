Batch: independent review, PR #170 (VR pilot: react to you)
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/vr-react@fbc0d6f4 (#170's own delta is loop/vr-ground@5067bc74..fbc0d6f4; #169 and #166 beneath it reviewed separately, both PASS). main now 9d35e620; fbc0d6f4 merges clean onto it (no museum file changed on main since 39a947b8).
Summary: 1 passed, 0 fixed, 0 need you.

Independent: VR loop run (scheduled, ~16:12-17:10 UTC). It wrote none of #170 (built by the 13:14-15:50 UTC VR loop run) and none of #169 or #166 beneath it.

PASSED   (1)
  - site:pr170 React to you (ch02 Egypt, ch03 Mesopotamia, Bronze Age corridor)
    - Scope of #170's delta: 5 files, 274+/40-. world.js (feel(): A.me per area, plants' uMe, visitor ripple slots
      4-5; PART lean in the plant vertex shader, only for `feet` areas' swaying plants; uSplash 4 -> 6), fauna.js
      (SHY, awayPoint, shyStep, keepAway, notNearMe; cats, lizards, waders, fish), app.js (cache bumps, __MU.react,
      __MU.reactSim test hooks), museum.html (app.js?v=53), new tools/react-check.js. No content, data, chapter,
      Vault, Pantheon or generated file touched.
    - Code read in full. Spaces agree: pit group and plant instances are in world space (group never moved), so the
      shader's io.xz and uMe.xy compare like for like; water hgt() and uSplash use world xz as fish/heron splashes
      already did. In the headset S.pos is the head (xrFollow runs before world.update), on flat it is the camera.
    - Distance only grows: awayPoint keeps the target within 1.05 rad of straight away and requires it to be further;
      shyStep walks only once facing within 0.5 rad of the target (1.55 < pi/2). A creature with nowhere further to
      stand turns away and stays still (no move toward). Wander targets, stalks (prey filtered >= 4.2 m from the
      visitor; stalk and wiggle abandoned inside 3.2 m) and a lizard's flee all avoid the visitor.
    - Fish: inside 1.6 m turn away and swim off; a wander step that would close inside 1.6 m is refused; no leap
      starts with take-off or landing within 3 m; a leap in the air near the visitor bends away (forward motion held
      until facing away).
    - Plants: lean only with o.part (feet areas, swaying kinds); program cache key includes it; strength 0 when the
      visitor is off a feet ground, so other rooms render as before. Teleport (>1 m in a frame) resets the fade.
    - Ripples: visitor rings use slots 4-5 only; splash() still cycles 0-3; all 6 slots aged and uploaded each frame;
      skipped under reduced motion.
    - Local on fbc0d6f4: full build order leaves the tree clean; review-checks.js --base origin/main --build 9/0/0;
      18/18 verify-*.js; framework tests 51/51; xr-entry-check all pass; ground-check all pass at 960/390/360 px;
      react-check all pass (57 ok) at 960/390/360, 0 script errors.
    - Phone budget (museum-baseline, 412 px, DPR 1): hall 39 calls / 26770 tris, corridor 80 / 204594, ch02 65 /
      120536; 0 errors. Same as #169's head within the creatures' random wander (budget 100 calls).
    - GitHub on fbc0d6f4: guard (skipped by design), checks, test, links, runtime x2, lighthouse all completed green
      (lighthouse 16:05 UTC).
    - Checklist 1-6: no claims or content; nothing religiously sensitive. 7: museum code, run headless above.
  - Notes (not findings):
    - A cat already mid-pounce (0.45 s, <= 0.55 m hop toward a lizard) is exempt from keepAway, so a teleport landing
      during that instant could see it finish the hop within 2 m. The pounce itself can only start with cat and lizard
      >= 3.2 m from the visitor; rare and brief. Worth watching on the headset walk, not a blocker.
    - react-check's corridor trials found no land creature or wader to test (only fish there); the corridor's land
      behaviour is the same code as ch02/ch03.
    - ch02 at 390 px: once a creature had nowhere further to go within 2 m and stood still facing away (reported by
      the check's notes). That is the intended cornered behaviour; judged in the headset.
    - The graphify CLI is not installed in this session; the code was read directly from the branch, not the map.

FIXED   (0)

NEEDS CARTER   (0)
