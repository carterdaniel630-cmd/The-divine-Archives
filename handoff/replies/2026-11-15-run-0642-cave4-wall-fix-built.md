# Run 2026-11-15 ~06:42–07:10 UTC (scheduled build loop)

## Start
- No HALT, no claim files. The lock from 04:58 UTC was 104 minutes old with no commits after it (that run stopped without writing back): stale, overwritten 06:42.
- No new Carter ruling since STATUS 05:25. Next buildable item without Carter: **Cave 4 wall fix** (`order-2026-11-09-cave4-wall-fix.md`, Carter's yes to build; merge per item).
- graphify CLI installed from `graph-tools` this run; `graphify update .` run on the work tree.

## Done: Cave 4 wall fix BUILT on `loop/cave4-wall-fix` `f106f484` (from `main` `f92ab8d7`, no PR)
Two files: `docs/pilgrimage/sites/qumran-caves/s2-cave4.js`, `site.js` (version 2 → 3, cache-bust, as the original wall did). Before/after: `handoff/previews/cave4-wall-fix/before-after.jpg` (390×844 phone, headless, top row = live `main`, bottom = fix).

The five faults, what caused each, what changed:
1. **Small holes read flat.** Cause: the socket walls went dark within a few centimetres, so a 7–10 cm hole was a black dot. Fix: every hole (small and broken-out) now has a worn lip in the wall's plane (a bevel 1.4× the hole's radius, 1.25× on the broken ones) and a socket wall that stays lit for its first part, then falls into shadow. Mask widened to the lip, a hair inside it, so no sliver opens round the edge.
2. **Visible panel seams.** Two causes. (a) The shared rock texture (`stone.js`, `rock`) does not repeat cleanly at its 3 m tile (its pick-mark sine terms are not periodic at 3 m), so a hairline ran every 3 m; Cave 4 now uses its own copy, cross-faded across its edges (two passes, 8% bands). The shared texture used by other sites is untouched. (b) Facet smoothing widened (normals averaged across facets meeting at up to ~78°).
3. **Horizontal texture boundary.** Cause: the per-chamber UV wrap switched to a top-down projection at 60% of the chamber height, drawing a line round the room at ~1.6 m. Fix: the walls now take the stone from three sides in world space (triplanar colour and relief, "whiteout" relief blend), so there are no UVs and no boundary. The old `wrapUVs` is gone.
4. **Mirrored rock pattern (V).** Causes found: the old top-down projection draped pick marks into a V over the mouth, and, separately, with each chamber lit from its middle the crossing pick marks light as mirror-image strokes either side of a wall's centre (shown by switching the relief off: the V went with it). Fix: each side plane reads u in one turning sense all round, and the texture is turned ~34° on every plane, so one half shows near-level strokes and the other near-upright ones. In 4b's east wall the V is gone at standing distance; a faint symmetry of light under the central lamp may still be visible to a careful eye. Reviewer: please judge it at 360/390.
5. **Entrance dark wedge: a defect, not shadow.** The mouth's opening was written from bearing −0.33, and the cave builder only tests bearings 0..2π, so only the eastern half of the wall opened (0 to +0.29 rad): the west half of the passage was blocked by wall and a ~0.2 m slot east of the passage looked out into nothing (black). Fix: the opening is written 2π−0.33 → 0.33 (both halves open, centred on the passage), and each side's slot is closed by a jamb of the same stone set just behind the chamber wall (placed by casting onto the wall) plus a floor strip a hair below the chamber floor.

Nothing else in Cave 4 changes: no wording, no holes added or moved (same seeded rows), same lights, same case.

## Checks (on `f106f484`)
- Full build order: all steps exit 0, **0 drift** (tree clean after build).
- Every `tools/verify-*.js`: **18/18**. `node --test framework/test/*.test.js`: **51/51**.
- `node tools/review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings**.
- Headless phone, 360×780 and 390×844 (touch): **0 script errors**, no sideways scroll; Cave 4 → terrace → Cave 3 → Cave 4 drops and rebuilds cleanly. Cave 4 standing view: **11 draw calls, 4,646 triangles** (live: 10, 3,786). Two more 512 px textures are alive while Cave 4 is loaded (its own seamless copies), freed when it is dropped.
- Not done by this run: GitHub checks incl. Lighthouse (they run on a PR; no PR opened, as runs do not open PRs unasked), and the independent review.

## Seen, not fixed (outside the order; for the reviewer / Carter)
- **The way through to 4b** has the same kind of cut as the mouth had: its opening is one ring segment wide (~0.7 m) against a 1.2 m tunnel, so part of the tunnel's south side is walled off and a thin dark slit shows beside it (view `east-through`). Not in atlas's five; left as is.
- **Light through rock:** 4a's lamps light the inside of 4b's vault (the engine has no shadows), which draws a soft straight terminator across 4b's crown. Same on `main`. Lighting, not texture; left as is.

## Next for this item
1. Independent review by a session that wrote none of it (this session wrote the whole diff). Probe scripts: `handoff/previews/cave4-wall-fix/cap-probe.js` (views; serve `docs/` on a port: `python3 -m http.server 8765` in `docs/`) and `reload-probe.js`.
2. A PR from `loop/cave4-wall-fix` (Carter or a chat session asks) so GitHub checks incl. Lighthouse run.
3. Merge **per item** (visual work on an exhibit; the order's yes covers the build, merge needs his yes on the finished item).

Lock released at the end of this run.
