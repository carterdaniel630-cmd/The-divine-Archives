# Run 2026-11-15 ~07:19–08:00 UTC (scheduled build loop): Cave 4 wall fix, review F1 + F2 fixed

## Start
- No HALT, no claim files, no lock (the 07:09 run had released it). Lock taken 07:19 UTC.
- No new Carter ruling or Muse item since STATUS 07:20 UTC. PRs #142–#145 still wait only on Carter's per-item yes.
  Highest-value item that needs no Carter approval: **Cave 4 wall fix F1/F2** (review
  `2026-11-15-cave4-wall-fix-independent-review.md`; any session may fix, including the builder).
- graphify CLI not installed this run; the code was read directly (one file).
- Frontend-design skill: not installed in this session.

## Done: F1 and F2 fixed on `loop/cave4-wall-fix` `93425766` (one commit on top of `f106f484`; no PR)
One file: `docs/pilgrimage/sites/qumran-caves/s2-cave4.js`. No wording, no hole positions, no lights, no case changed.
Site version stays 3 (the branch is not live, so the first commit's cache-bust covers both).

### F1, the chevron in 4b's east wall: two causes, each found by taking it away
1. **Flat projections under a vault.** With the relief on its own and a test pattern of straight diagonal stripes
   in place of the rock, the stripes stayed straight on the lower wall and bent into arches from head height up.
   There the top-down plane drapes straight marks over the curve as arches, and the side plane across the wall
   reads the slope into the rock as its u, flipped either side of the wall's middle. 4b is so low (2.2 m, eye at
   1.62 m) that its whole upper wall is vault.
   **Fix:** each chamber's shell is now wrapped round its own centre, in world space, per pixel: u runs round the
   chamber (bearing x a radius rounded to a whole number of 3 m tiles, so the wrap closes on itself), v runs up the
   wall and over the vault (height plus how far the wall has come in). Still no UVs, so no seams and no vault line.
   The wrap's one join sits in each chamber's own opening (4a: the mouth; 4b: the way through), with screen
   derivatives taken from the continuous side so no mip line shows on the vault above it (checked over the mouth,
   `pass2/mouth-vault-wrap-join-390x2.jpg`). Only the crown (rock within ~20° of flat overhead) takes the top-down
   plane, its relief combed to run up the vault so it draws no arches either.
2. **The visitor's own lamp** (`engine.js` puts a light at the eye). With the wrap alone a fainter chevron stayed,
   always centred in view. Moving 4b's lamp ±1.2 m or switching off 4a's lamps did not move it; it follows the
   camera. On relief whose strokes run every way, a light at the eye picks out the strokes that lie across its beam,
   which form rings round the point you face: a V or an arch in the middle of every view. This is also the "mirror
   down the centre seam" atlas saw on main.
   **Fix:** the shell's relief is combed one way, as pick marks struck by one hand run one way: relief across the
   stroke (about 70° from level, wandering ±17° with the kit's breakup) kept and deepened 1.5×, the rest kept at
   one fifth, so the wall does not go flat and the lamp has no second set of strokes to mirror.
- Result at 360 and 390, from 2.3, 2.8 and 3.6 m, level and looking up: no chevron of strokes
  (`pass2/f1-4b-east-f106-top-pass2-390-mid-360-bottom.jpg`, `pass2/f1-4b-east-e28-main-f106-pass2.jpg`).
- **Still visible, not the chevron (reviewer please judge):** from 3.6 m a soft Λ of light shows at the very top of
  4b's east wall where the vault's facets meet. It does not change with 4a's lamps off, so it is the shell's
  geometry, and it is on `main` and `f106f484` too. Looking almost straight up at 4b's crown, faint strokes converge
  on it (the wrap's tiles closing in); it reads as tool marks running up into the crown.

### F2, small holes flat: the socket shading was too dark
- The first pass had darkened the socket (mouth 0.2 against main's 0.34), so the lit crescent went black, and the
  lip (0.45 / 0.24) was darker than the wall, which widened the dark disc.
- **Fix:** socket shade 0.5 → 0.17 → 0.03 (mouth brighter than main's, so the far side's lit crescent shows on a
  phone; only the back half goes dark); lip outer edge 0.7 (near the wall's own tone), inner edge 0.58. The code
  comments now say what the values do.
- Result at phone density (390 × 844 at ×3), south and west walls: every small hole shows a lit socket wall and a
  worn lip; main and `f106f484` show flat discs (`pass2/f2-holes-dpr3-main-f106-pass2.jpg`,
  `pass2/f2-holes-west-dpr3-f106-pass2.jpg`).

### The other three faults, re-checked so nothing came back
- Seams (2), vault line (3), entrance wedge (5): still fixed at 360/390 (`pass2/views-4a-…`, `pass2/views-4b-…`,
  top row `f106f484`, bottom row this pass).

## Checks (on `93425766`)
- `node tools/review-checks.js --base origin/main --build` (runs the full build order): **9 passed, 0 failed,
  0 warnings**; tree clean after build (0 drift).
- Every `tools/verify-*.js`: **18/18**. `node --test framework/test/*.test.js`: **51/51**.
- Headless phone 360×780 and 390×844 (touch): **0 script or shader errors**, no sideways scroll; Cave 4 → terrace →
  Cave 3 → Cave 4 drops and rebuilds cleanly. Standing view **11 draw calls, 4,646 triangles** (same as `f106f484`;
  live 10 / 3,786). The walls' shader does more per pixel (two more texture reads on the chamber shells); headless
  frame rate unchanged (~20 fps in the software renderer). Lighthouse will measure it on the PR.
- Probe: `handoff/previews/cave4-wall-fix/pass2/probe.js` (serve `docs/`; views as `[name, x, z, yaw, pitch]`).
- Not done by this run: GitHub checks incl. Lighthouse (no PR; runs do not open PRs unasked) and the delta review.

## Next for this item
1. **Delta review `f106f484..93425766`** by a session that wrote none of the fix (NOT ..01HFWzToC29Z8sEX72saF5Gr,
   this run). The reviewer of `f106f484` (..01HFWzTpYzjR34RgUjscvB4D) wrote none of it and may do it. Look at:
   4b east wall from 2.3/2.8/3.6 m at 360 and 390; 4a south and west walls; the vault over the mouth (wrap join);
   small holes at ×3; looking up into each crown.
2. A PR from `loop/cave4-wall-fix` (Carter or a chat session asks), so GitHub checks incl. Lighthouse run.
3. Merge **per item** on Carter's yes for the finished wall (visual work on an exhibit).

Lock released at the end of this run.
