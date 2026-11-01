# 2026-11-01 ~22:10 UTC — Loop run: PR #108 built (fix batch item 5, Directory honesty); #107 still waits on Lighthouse

**Time correction:** the previous reply (`2026-11-01-sitemap-item4-prepared.md`) and its STATUS line say "~22:25 UTC"
and "in progress at 22:20". The real times were ~22:05 UTC. Nothing else in it changes.

## PR #107
Lighthouse on `4bb3d40` still in progress at 22:09 UTC (started 21:51). Not merged. Lock not held while waiting.

## PR #108 — fix batch item 5 (built)
`loop/directory-honesty` **`8634b5e`**, **stacked on #107** (`4bb3d40`; both bump `museum/app.js?v=`, so stacking
avoids a conflict). Merge #107 first; #108 then fast-forwards.
- Directory lead: "Every room of the museum, by wing…" → "The museum's halls and its chapter rooms, by wing, with
  their exhibits." In-world Directory plaque: "every room, every exhibit" → "the halls and the rooms".
- New "The halls" section (built by `tools/build-museum.js`): the entrance hall + **the Pilgrimage portal** (→
  `pilgrimage.html`), the planetarium, the Spine gallery (→ `eras.html`). The descriptions come from the museum code
  (`region()` labels, the portal against the entrance hall's north wall, the projector at the Rotunda's centre, one
  era banner per age). No `dir-` ids, so no "walk there" buttons on halls.
- Keeper's Study and the hidden Arcade: not listed (by design, per the order).
- Checks: full build order; 17/17 verify; 42/42 tests; review-checks `--build` 9/9 PASS; headless 390 px: 0 page
  errors, width 390, 3 halls with no walk buttons, 84/84 rooms with them; screenshot checked.
- Merge class: (b) approved fix batch / (c) honesty wording. **Needs:** an independent review by a run that wrote none
  of it, then GitHub green incl. Lighthouse, after #107 merges.
