# PR #135 Rotunda ring of statues — delta review 2 (R1d2): PASS, 0 open findings

**Run:** 2026-11-09 ~06:24–06:45 UTC, session ..01HFWzTmB8Wjx82okwuFtMY8. This session wrote none of
#135 (builder ..01HFWzToHt8256shdsp7mQn1; F1/F2 fixer ..01HFWzTo3a9ESmJDfqbLbdED; D1 fixer ..01HFWzToLNh8dkddCyMNvs77;
reviewers ..01HFWzToCaP3Wf1xDbEDJN1o, ..01HFWzTo72WoREjKk5JhZMYS).
**Reviewed:** `9d82ed28..42d2263a` on `loop/rotunda-pedestals` (`docs/museum/statues.js`, `docs/museum/app.js` 2 lines),
against `reviews/REVIEWER.md` §3–§4 and finding D1 of `2026-11-09-pr135-delta-review.md`.
`42d2263a` fast-forwards from `main` `43850da4`.

## Verdict
**PASS, 0 open findings.** D1 is closed: across 3.0 → 3.4 → 5 → 8.3 m the three statues stay recognisably the same
statue; faces, Shiva's trident/drum/snake, Isis's horned crown, Socrates's face and beard hold; no pinholes seen.
No card, plaque, page, placement or wording change in the delta, so nothing new for Carter. Carter's recorded per-item
yes (`decisions-2026-11-09-carter-yes-merge-135.md`) covers this candidate once GitHub is green incl. Lighthouse.

## What I checked
1. **Code read** (whole delta). Plane-fit placement: the 3×3 symmetric solve by cofactors is correct (adjugate terms
   and determinant checked by hand); it solves A·d = −(b + A·mean) about the cell average, falls back to the average when
   A is near-singular (det < 1e-3·tr³) or the point leaves its cell. Winding flip compares each face with the summed
   source normals before the index is written; normals then overwritten with averaged source normals only where they
   agree (|sum| > 0.35·count). Numeric triangle key `(lo·m+mid)·m+hi` is exact while m³ < 2^53: largest single mesh
   here has 66,342 points (Socrates), m³ ≈ 2.9e14, fine. Levels: near < 3.2 m, middle 3.2–8 m, far > 8 m via
   `THREE.LOD`; test hook gains `midTris` only.
2. **Local checks on `42d2263a`** (own worktree): `node tools/review-checks.js --base origin/main --build` **9 pass,
   0 fail, 0 warn**, tree clean after the full build; all 18 `tools/verify-*.js` pass; `node --test framework/test/*.test.js`
   **42/42**. graphify CLI installed this run via `tools/graphify-session.sh`; `graphify update .` ran.
3. **Looks** (`r1f2-shots-probe.js`, `OFF=0.5`, 360 and 390 px, 2 / 3 / 3.4 / 5 / 8.3 m per statue, 30 shots): no
   page errors. Level counts as stated: Shiva 94,904 / 25,702 / 8,889; Isis 75,000 / 24,146 / 7,846; Socrates
   94,553 / 26,026 / 7,381. Middle copy a little grainier than near (as the fixer said); no melted or faceless figure.
   Socrates's jagged robe edge appears equally at 2 m and 3 m (near level), so it is in the source mesh, not the copies.
4. **Budget sweep** (`fix-sweep-probe.js`, 390×844): 537 views = the 150 heaviest by triangles + 100 heaviest by
   calls from the fixer's 3,432-view sweep + 300 random views from `fix-sweep-views.json` (seed 135), plus the door:
   **worst 204,656 triangles, worst 96 calls; 0 views over 220k, 0 over 100 calls.** Door 89,821 / 68 calls.
5. **Load stall** (`r1f2-stall-probe.js`, 4× CPU throttle, 2 runs each, this sandbox is slower than the fixer's):
   `42d2263a` longest task 1.56 / 1.79 s, all statues ready 12.6–13.8 s after teleport to the door;
   `9d82ed28` longest task 3.66 / 3.24 s, ready 10.0–10.7 s. So the freeze is about halved; statues take ~3 s longer
   to appear.
6. **GitHub on `42d2263a`:** guard, checks, test, runtime ×2 green. **Lighthouse pending** (run 42572654942 queued behind
   the superseded `8e205f6f` run). Not merged.

## Advisory (not findings)
- **A1** Statues appear ~3 s later than on `9d82ed28` after a jump straight to the Rotunda door (≈13 s here at 4×
  throttle in SwiftShader; real phones untested). Pedestals and cards show meanwhile. Worth a glance on Carter's phone.
- **A2** The comment on the numeric key says "exact for any statue"; it is exact for meshes up to ~208k points. A
  future much denser statue should switch back to string keys or a BigInt. Not reachable with Tray 1.

## Merge status
Not merged this run: Lighthouse on `42d2263a` not yet completed. Every other LOOP.md "Merging" condition holds
(delta review 0 findings, local checks green, Carter's per-item yes recorded, fast-forward from `main`, no commits after
the candidate outside `handoff/`). The next run re-checks Lighthouse, re-runs local checks, and fast-forwards.
