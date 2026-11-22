# Independent review — PR #187, portal culling in the headset

Batch: VR loop — independent review of #187 (portal culling)
Reviewed: 2026-11-22
Auto-pass: on
Covers: loop/vr-portal-cull@758056a4
Summary: 1 passed, 0 fixed, 0 need you.

Reviewer: a VR loop run (session ..01HFWzTkRBpxMtBakEkUUagA) that wrote none of #187. Reviewed
`origin/main...758056a4` (main `fa9e526d`) against `reviews/REVIEWER.md` §3–§4 and `handoff/VR-LOOP.md` step 6.

## What it changes
Headset only. `docs/museum/portals.js` (new) turns the plan into 90 cells and 89 doors and lists the cells that can be
seen from the head through the doors (plus a 0.35 m ring round it). `app.js` hides zone shells, room exhibits,
fittings, statues, signs, the world areas and the planetarium in cells not on the list. With no headset the list is
null and every new test returns "seen", so the flat museum takes the old paths. Cache keys: app.js 57 → 59,
world.js 9 → 10 (both importers, app.js and fauna.js, moved together), portals.js new at 1.

## Automatic checks (re-run here, on 758056a4)
- Build order (stamp-dates, og, vault, chapters, pages, museum, framework, registry, sky): no diff.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 51/51.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- `tools/xr-portal-check.js`: all pass — 31,485,952 rays, 0 misses; 151,813 drawn points, 0 outside their cells
  (seams: spine frame 54, spine doorway floor 2, both explained in the tool); stand-in Quest 2 in Rotunda, ch02, ch03
  and the Wing II corridor as reported; null again after each exit; 0 script errors.
- `tools/xr-entry-check.js`: all passed, twice (104 ok lines).
- GitHub: 7 of 7 checks completed and green on the head, Lighthouse included.
- Merges cleanly onto `main` `fa9e526d` (git merge-tree). Conflicts with #185 on the shared cache-key lines, as
  VR-STATUS already says: whichever merges second re-syncs.

## Independent checks of my own (not the author's)
- **Random-point ray sweep:** 60,000 uniformly random points over the whole plan (not the author's grid; 34,945 fell
  inside a cell), 1,024 rays each through the real walls: 35,783,680 rays, **0 reached a cell the set left out**.
- **No two rectangular cells overlap** (0 of all pairs), so a point's cell is unambiguous.
- **Flat museum unchanged**, `museum-baseline.js` at 412 px, branch vs `main`, run twice each: hall 36 calls / 26,764
  triangles, Wing II corridor 86 / 215,928, ch02 67 / 122,011 — identical; 0 script errors. Heap and first-zone time
  moved both ways between runs (main 72 → 92 MB, branch 92 → 68 MB): noise, not this change.
- **Phones, 360 and 390 px:** 0 script errors, no sideways scroll, the VR button hidden (no WebXR), cull set null.
- Read the algorithm: a door's wedge is taken from its two ends; each further door can only narrow it; lintels are
  ignored and doors behind the eye keep the whole wedge — every simplification shows more, never less. Recursion is
  bounded (tree of cells, the door entered by is skipped, depth ≤ 24).

## §4 checklist
1. Accuracy: no factual claims or sources changed. pass.
2–5. Lenses, tiers, contested claims, tone: no content changed. pass.
6. Religious sensitivity: nothing new is shown; culling only hides. No sacred object, site or figure touched. pass.
7. Games and 3D: museum renders, 0 script errors flat and in the stand-in headset; runtime checks green. pass.

## Findings
None.

## Notes for later (not findings, nothing blocks)
- `portals.js` comment says rooms are checked before the larger areas, but rooms are added after their corridor.
  Harmless (no cells overlap); worth a one-word fix next time the file is touched.
- On leaving the headset the list clears at the next zone check (≤ 0.25 s), so for at most a quarter second the flat
  view could still hide a culled room. The check tool sees it cleared each time.
- In the headset the list is rebuilt every frame (9 small walks, a new set and a sorted key). Cheap, but it is
  per-frame allocation; the in-headset overlay (`?vrfps=1`) will show whether it matters on a Quest 2.
- The containment test covers zone shells and room exhibits; fittings, statues and signs are hidden by their own
  room's id or their measured position, which the code reads correctly but the tool does not sweep.
- For Carter's walk: if anything ever "pops in" passing a doorway, that is this change.

Needs your decision
  - Nothing needed now. #187 comes to Carter for a per-item yes once re-synced onto `main` (and a delta check by a run
    that did not re-sync).
