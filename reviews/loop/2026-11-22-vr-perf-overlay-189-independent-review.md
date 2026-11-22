Batch: VR loop — independent review of #189 (hidden frame-budget readout in the headset, `?vrfps=1`)
Reviewed: 2026-11-22
Auto-pass: on (reviews/status.json, 2026-11-14)
Covers: loop/vr-perf-overlay@ee7ffc76 (on main 1cfb8d9f)
Summary: 1 passed, 0 fixed, 0 need you.

Reviewer: VR loop run 2026-11-22 ~21:22 UTC. This run wrote none of #189 (built by the 16:50 run).
Diff `origin/main...ee7ffc76`: 4 files, +390 / −2:
`docs/assets/vr-perf-overlay.js` (new, 240), `tools/vr-perf-overlay-check.js` (new, 143),
`docs/museum/app.js` (+7 / −1), `docs/museum.html` (cache key app.js 59 → 60).

Automatic checks: pass.
  - `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings; tree clean after the build.
  - every `tools/verify-*.js` (18): pass.
  - `node --test framework/test/*.test.js`: 51 pass, 0 fail.
  - GitHub on ee7ffc76: 7/7 completed and green, Lighthouse included (finished 16:53 UTC).

PASSED   (1)
  - site:pr189: 0 findings.

FIXED    (0)

NEEDS CARTER (0)

Checklist (§4)
  - 1–5 accuracy / lenses / tiers / contested / tone: not applicable (no chapter, Vault, Pantheon or other prose
    changed; the overlay's only words are measuring labels).
  - 6 religious sensitivity: pass. Nothing new is shown in any room; the plate is a text instrument fixed to the
    view, only with `?vrfps=1`.
  - 7 games and 3D: pass, checked headless (below).

What I read in the code
  - Off by default: app.js imports the module only when the address carries `vrfps=1` (same pattern as
    `wanted()`); a failed import is swallowed, so the museum runs without it. Confirmed headless: without the flag
    the module is never requested (phones 360 / 390 px, desktop).
  - Hooks: `S.perf.frame(now)` straight after each `renderer.render`, both the headset path and the flat path, so
    `renderer.info.render` is read for the frame just drawn (in the headset: both eyes, the stereo count).
  - Hitch accounting is honest: the 2 s warm-up and the frame after the overlay's own once-a-second scan are
    counted apart, never hidden inside the museum's figures; percentiles take the upper bin edge (never optimistic).
  - The plate is excluded from the texture ledger; its own 2 calls (one per eye) are reported as `overlayCalls`.
  - Leaving VR resets the run and hides the plate; the flat box is `aria-hidden` and ignores taps.
  - Nit, not a finding: on a phone the corner box nearly always reads OVER (phone frame times counted as hitches
    against the Quest 2 line). Its last line already says flat frame times are not headset figures, and the
    module never loads for visitors.

Headless checks (this run, on ee7ffc76)
  - `vr-perf-overlay-check.js`: all passed — helpers; no flag = not loaded; phone with flag = box fits, no Enter VR
    button, top bar fits, 0 errors; stand-in Quest 2 in the Rotunda and ch02 Egypt: plate on the camera, immersive,
    floor tier, foveation 1, scale 0.8; its calls equal three.js's count (Rotunda 150, Egypt 146, overlay 2);
    per-area figures kept; leaving VR hides the plate; 0 errors.
  - `xr-entry-check.js`: all passed (Enter VR stays hidden where WebXR is missing; 0 errors).
  - `museum-baseline.js` (flat phone): hall 36 / corridor 84 / Egypt 66 calls (the builder measured 39 / 84 / 65;
    within run-to-run variation of the moving creatures), 2,740,818 bytes, 0 errors.
  - The plate reads "OVER" in the stand-in because software frames take ~80 ms. Says nothing about a headset.

Needs your decision
  - #189: merge it once you say yes? (recommended: yes — every check has passed; it only appears with `?vrfps=1`).
