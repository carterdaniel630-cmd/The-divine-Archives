Batch: independent review, PR #166 (VR height check: posture plaque)
Reviewed: 2026-11-16
Auto-pass: on
Covers: loop/vr-height@902e96dc (diff origin/main...902e96dc, main 56d7c9d6)
Summary: 1 passed, 0 fixed, 0 need you.

Independent: VR loop run (scheduled, ~09:45 UTC). It wrote none of #166 (built by VR loop session ..01HFWzTp1GXKnJxKjEEKUKCR).

PASSED   (1)
  - site:pr166 VR height check
    - Scope: 5 files, 374+/12-. New docs/museum/xr-height.js (posture plaque); xr-move.js gains dip(cb), onTap,
      controllers; app.js wiring and app.js?v=51; tools/xr-entry-check.js +26 checks. No content, data, chapter,
      Vault, Pantheon or generated file touched.
    - Code read in full. xr.js already calls onStart({ seated }) (line 76), so the new destructuring is safe; the
      controllers getter uses the existing h.source set on "connected". The plaque group is added to the scene
      empty and only built on first VR entry, so phones and computers pay nothing at draw time.
    - Heights: standing+floor leaves the rig at the floor (measured); seated sets eyes 1.2 m; standing without a
      floor sets 1.62 m (the flat museum's EYE) and says "set", not measured. Posture change runs inside the
      teleport dip-to-dark; refused mid-aim or mid-dip.
    - Spec (vr-comfort-brief.md): §10 text angle (body/title sized from 1.45°/1.95° at 2 m, above 1.3°/1.8°);
      §11 contrast cream #f3e6c8 on #140c07 = 15.6:1 (>= 7:1); §12 distance 2.0 m, 1.2 m fallback (in 0.8-2.5 m);
      §13 longest line 30 characters; §14 centre clamped to 1.35-1.55 m standing / 0.9-1.1 m seated, tilt 8°;
      §15 seated 1.2 m; §24 choice in localStorage on this device only, wrapped in try/catch.
    - Local on 902e96dc: full build order leaves the tree clean; review-checks.js --base origin/main --build 9/0/0;
      18/18 verify-*.js; framework tests 51/51; xr-entry-check 74/74 (stand-in headset: floor, no floor, remembered
      seated, wall in front, exit note).
    - Flat museum unchanged: museum-baseline (412 px, phone) on main and on 902e96dc give identical draw calls,
      triangles, textures and geometries in hall 39 / corridor 86 / ch02 69, 0 errors. Only change: +14 KB
      uncompressed JS (xr-height.js is imported on every visit).
    - Headless 360 and 390 px: "Enter VR" hidden (no WebXR), plaque not shown, 0 script errors (the one console
      line is the Google Fonts request blocked by this sandbox's network, same on main).
    - GitHub on 902e96dc: guard, checks, test, links, runtime x2 green; lighthouse still running at review time
      (started 09:44 UTC). Not assumed green.
    - Checklist 1-6: not applicable (no claims or content); no sensitive content. 7: museum code, rendered and
      checked above.
  - Notes (not findings):
    - The plaque shows on the session's 2nd frame, one frame after the world. When a wall forces the 1.2 m
      fallback this is technically a pop-in inside 2 m (§22), lasting ~14 ms at session start. Worth a look in
      the headset; not blocking.
    - §15 also asks that all plaque and interaction heights re-anchor when seated. This PR re-anchors its own
      plaque only; the museum's other plaques are the later "controllers + select -> plaques" piece.
    - draw() passes a maxWidth to fillText, which would squeeze an over-long line; the check flags overflow and
      no current line comes near it.

FIXED    (0)

NEEDS CARTER (0)  (merge itself still needs Carter's per-item yes: VR is a new build, per item)
