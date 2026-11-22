Batch: independent review, PR #183 (VR pilot: stick walking, opt-in beside teleport)
Reviewed: 2026-11-22
Auto-pass: on
Covers: loop/vr-stick-walking@254cf17c
Summary: 1 passed, 0 fixed, 0 need you.

Who: a VR loop run that wrote none of #183 (its commits a95995eb and 254cf17c come from another session).
Carter's build yes: decisions-2026-11-21-carter-vr-stick-walking-a.md ("a": stick walking as an option, teleport the default).
Not a merge approval: #183 is a new build and needs Carter's per-item yes.

Automatic checks (run here, on 254cf17c over main 6871e3ca)
  - Full build order: no diff.
  - Every tools/verify-*.js: pass.
  - Framework tests: 51/51.
  - review-checks.js --base origin/main --build: 9 passed, 0 failed, 0 warnings.
  - xr-entry-check.js: 104/104 ok, 0 script errors (section 8: 30 stick-walking checks; section 1: phones at 360 and 390 px show no VR button).
  - museum-baseline.js, flat phone view, this branch vs main run side by side here:
    hall 39/39 calls, 26,770 triangles both; corridor 85/85 calls, 215,888 triangles both; ch02 66/66 calls, 121,687 triangles both.
    0 errors. Download +15.6 KB (the new xr-walk.js module), inside the 300 KB pass budget.
  - GitHub on 254cf17c: checks, guard, test, links, runtime x2 green. Lighthouse still running at review time (02:36 start).

PASSED   (1)
  - site:pr183: 0 findings. Read in full: docs/museum/xr-walk.js (new), xr-move.js, app.js, museum.html, tools/xr-entry-check.js, tools/xr-standin.js.

Checklist (REVIEWER.md §4; no chapter, Vault or Pantheon content changed, so 1-5 do not apply)
  - 6 Religious sensitivity: pass. No image, model or text about any sacred object or site; plaque text is controls only.
  - 7 3D: pass. Opened headless in the stand-in headset and on flat phones; no script errors, no black canvas.
  Against the comfort brief (handoff/vr-comfort-brief.md):
  - §a.2 opt-in only, warns "more intense", 2 deliberate confirmations, default session never shows it: pass
    (walkPress: request, then 2 confirmations each >= 0.5 s apart; 10 s timeout to off; restored only from this device's own saved "on").
  - §a.4 top speed 2.0 m/s, 0 to 2.0 over 1.0 s, accel <= 4 m/s²: pass (WALK_UP 2, WALK_DOWN 4, cap 2.0; measured peak 2.0, stop 0.45 m).
  - §a.5 horizon lock, no roll or height change: pass (rig moves on x/z only).
  - §b.7 vignette during any artificial motion, 40-60 %: pass (held at 50 % for the glide, clears after).
  - §c.10 text >= 1.3° body / 1.8° title: pass (1.47° / 1.96° at 2 m). §c.13 line length under 60 characters: pass.
  - §f.24 kept on this device only (localStorage mu-vr-walk, try/catch): pass. §f.25 first session teleport only: pass.
  - Walls: canStand checks the head's new point and the line to it; slide on one axis or stop. Never through: pass.

Notes (not findings; for the headset walk or later pieces)
  - A snap turn in the middle of a glide keeps the world-frame velocity, so for about half a second the glide eases
    from the old heading to the new one (inside the 4 m/s² limit). Worth Carter's eye on the headset walk.
  - With only a LEFT controller and walking turned on, that stick walks and nothing snap-turns (one press on the plaque
    turns walking off). The brief's dominant-hand toggle (§d.16) belongs to the settings piece.
  - The plaque appears at 2.0 m (1.2 m fallback) on entry, as the posture plaque already does (#166).
  - #182 and #183 both change docs/museum.html (app.js cache key) and app.js: whichever merges second needs a re-sync.

Accuracy spot-checks
  - none: code-only change, no factual claims.

Needs your decision
  - Nothing needed from the review. #183 still needs Lighthouse green on 254cf17c and Carter's per-item yes.
