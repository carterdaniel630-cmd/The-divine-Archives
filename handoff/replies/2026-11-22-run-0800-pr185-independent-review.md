# PR #185 VR static zones — independent review PASS 0, re-synced onto `main` (2026-11-22 ~08:20 UTC)

- **Session:** build loop run ..01HFWzTnoEvwjXXW1ftKo8rD. Wrote none of #185 (built by VR loop ..01HFWzTmu3QQCKAmBWz3nvXc,
  which also did the earlier re-sync `17c6f3a0`).
- **Item:** STATUS Next (1). Carter's per-item yes on file: `decisions-2026-11-21-pr184-pr185-yes.md`.

## 1. Independent review of `17c6f3a0` (diff vs merge base `4864a9d2`): PASS, 0 findings
Diff: `docs/museum/app.js` `buildStatic()` (hall title, three hall plaques, Pilgrimage portal → `ZONES.hall.group`;
Rotunda reserved-bay plaque and star projector → `ZONES.rotunda.group`), `docs/museum.html` cache key → `v=58`, two
measurement reports under `audits/vr-frame-budget/`. Code only; no chapter, source, pending tag or sacred item.
Checked against REVIEWER.md §3 and the code side of §4:
- **Zone groups are safe parents.** `zone()` creates each group; `finishZones()` adds it to the scene (line 393) before
  `buildStatic()` runs (line 548). The groups sit at the origin with no transform, so world positions are unchanged.
  `dropWing()` disposes only `Z.exGroup`, never `Z.group`, so nothing moved here is ever disposed.
- **Visibility.** `manageZones()` shows a zone's group within SHOW_FAR (36 m) of its box. `pick()` only considers
  exhibits within 15 m, so a moved exhibit is always pickable when it is within reach. The LOD signs still work (they
  test `obj.parent`, which is set).
- **Behaviour that does not depend on drawing:** portal arrival (`portalTick`, uses `S.portalFx.pos`), collision boxes
  (`addBox`) and the planetarium sky (follows `ZONES.rotunda.group.visible`, as before) are unchanged.
- `wallMeshes()` collects only `MAT.wall` meshes, so the moved items do not become pick blockers.
- Local on `17c6f3a0`: tests 51/51, verify 18/18, review-checks `--build` 9/0/0, `xr-entry-check.js` all passed,
  `museum-baseline.js` 0 errors. Headless 360/390 px: the hall portal draws, animates and is picked ("The Pilgrimage:
  walk the sacred sites"). The Rotunda projector draws and opens the planetarium panel. Teleport to ch03 works.
  0 script errors.

## 2. Re-sync onto `main` `fa9e526d` (#183, #184, #186 went live after the base `4864a9d2`)
- Merge commit **`23d312d5`**. `app.js` merged cleanly. `museum.html` conflicted only on the cache-key line: took main's
  file and set `app.js?v=58` (main 57). A first try took the branch's whole `museum.html` and lost #184's directory
  edits; this was caught by the diff comparison before pushing and corrected (amended, never pushed).
- `git diff origin/main 23d312d5` is line-for-line the reviewed `git diff 4864a9d2 17c6f3a0`, except the expected
  base line (`v=57` instead of `v=56`). 4 files, +1548 −14 both.
- Local on `23d312d5`: build no diff, review-checks 9/0/0, verify 18/18, tests 51/51, xr-entry-check all passed,
  headless 360/390 0 script errors, portal and projector draw and pick.
- Pushed as a fast-forward of `loop/vr-static-zones`. GitHub checks were not waited for (lock not held).

## Owed before merge (per item)
This session re-synced, so it may NOT do the delta check. Next: a session that is not ..01HFWzTmu3QQCKAmBWz3nvXc and
not ..01HFWzTnoEvwjXXW1ftKo8rD confirms the delta above; GitHub green incl. **Lighthouse** on `23d312d5` (`docs/`
changed); then fast-forward `main` per item.
