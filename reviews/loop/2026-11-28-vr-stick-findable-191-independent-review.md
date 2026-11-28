Batch: VR loop — independent review of #191 (a press on a plaque is always a press; Carter's walk item 2, stick walking)
Reviewed: 2026-11-28
Auto-pass: on (reviews/status.json, 2026-11-14)
Covers: loop/vr-stick-findable@37154f55 (on main f12dc09d)
Summary: 1 passed, 0 fixed, 0 need you.

Reviewer: VR loop run 2026-11-28 ~20:45 UTC. This run wrote none of #191 (built by the 20:15 run, another session).
Diff `origin/main...37154f55`: 7 files, +47 / −25: `docs/museum/xr-move.js`, `app.js`, `xr-height.js`, `xr-walk.js`,
`xr-read.js`, `docs/museum.html` (app.js key 60 → 62), `tools/xr-entry-check.js`.

Automatic checks: pass.
  - full build order (stamp-dates → build-sky): no diff in the tree.
  - `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
  - every `tools/verify-*.js` (18): pass. `node --test framework/test/*.test.js`: 51 pass, 0 fail.
  - GitHub on 37154f55: 6 of 7 completed and green (test, checks, guard, runtime ×2, links); **Lighthouse still
    running** at review time. Not green until it finishes.

PASSED   (1)
  - site:pr191: 0 findings.

FIXED    (0)

NEEDS CARTER (0)

Checklist (§4)
  - 1–5 accuracy / lenses / tiers / contested / tone: not applicable (no chapter, Vault, Pantheon or prose changed).
  - 6 religious sensitivity: pass. Nothing new is shown; only how a trigger press is read changes.
  - 7 games and 3D: pass, checked headless (below).

What I read in the code
  - `xr-move.js`: on selectstart it asks `onPanel(ctrl)` once; if the press starts on a panel, the hold timer never
    turns it into a teleport arc (both the walking hand and the other hand). Release still goes to `onTap` as before.
  - `onPanel` = posture plaque `hits` || walking plaque `hits` || open reading `panelHit`: the same ray tests (6 m,
    visible face only) the taps already use, now exported, no side effects. So "is a panel press" and "the tap lands"
    agree.
  - Floor and relics unchanged: a hold over 0.2 s off any panel still aims a teleport (checked below).
  - Stick walking stays off by default behind the warning and two confirmations; nothing about that changed.
  - The one changed existing check ("teleport aiming beside stick walking") now aims lower and asserts it is NOT on a
    plaque before expecting an arc. That makes the check stricter, not weaker.
  - Nit, not a finding: a press that starts on a plaque and is dragged off before release gives no teleport (the
    visitor presses again). Sensible for a plaque.

Headless checks (this run, on 37154f55)
  - `xr-entry-check.js`: 137 ok, 0 FAIL, incl. the three new slow-press checks (700 ms on the walking plaque: no arc,
    counts as press 1; 700 ms on the posture plaque: no arc, posture switches; a 200 ms+ hold off panels still aims).
    Phones 360 / 390 px and desktop: no Enter VR button where WebXR is missing, 0 script errors.
  - **Fault reproduced on main:** the same check script run against `main`'s `docs/` gives 5 FAIL, starting with "a slow
    press held 700 ms on the walking plaque shows no teleport arc (aiming true)" and stick walking never turning on.
    So the fix addresses a real, reproducible fault. Whether it is what Carter hit is inferred: no run can wear a headset.
  - `museum-baseline.js` (flat phone): hall 39 / corridor 84 / Egypt 64 calls, 0 errors (builder measured 36 / 84 / 66;
    within the moving creatures' run-to-run variation).

Needs your decision
  - #191: merge it once Lighthouse is green and you say yes? (recommended: yes.)
