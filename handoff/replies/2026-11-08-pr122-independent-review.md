# PR #122 — independent review (Qumran Cave 4 wall, Presence Pass proof piece)

**Reviewed:** `origin/main` `ce1d44b8` ... `loop/cave4-wall` `9a175396` (fast-forward, one commit)
**Reviewer session:** ..01HFWzTpTGhwrVimiqevsm5A — wrote none of the candidate (builder ..01HFWzTnvHbqkD8otVFfKqHc) and none of the rival #121 (..01HFWzTovazLUaNgT45KnyVv)
**Against:** `reviews/REVIEWER.md` §3–§4
**Verdict:** PASS, 0 open findings. **Per item** (new visual work on a live site; never by class). Carter's per-item pick of #122: `handoff/carter-pick-cave4-wall-122.md`.

## What changed (3 files)
- `docs/pilgrimage/sites/qumran-caves/s2-cave4.js`: walls/floor use cloned marl materials with the Foundation Kit's `withBreakup`; each chamber's wall gets one continuous UV wrap (`wrapUVs`, one join left high on the vault, as the comment says) and smoothed facet normals; the 52 flat black discs become level, tapering, darkening sockets placed on the real wall by raycast, opened through the wall by draw order (sockets → depth-only mask → wall); varied size/spacing/height, ~7% lost, ~10% broken out wider. Seeded RNG, so the wall is the same on every visit. Returns `dispose()` for the cloned materials and socket/mask materials.
- `site.js`: holes flag and About card say "number, spacing **and wear**" of holes approximate; site `version` 1 → 2 (cache-bust for section modules; `site.js` itself stays `?v=1`, the existing convention, as on the Great Pyramid at v5).
- `qumran-caves.html`: the same two wording changes in the static text (build output matches; `review-checks --build` leaves the tree clean).

## Checklist (§4)
1. **Accuracy:** no new factual claim. The only text change widens an "approximate" label to cover the modelled wear — more honest, not less. Holes still on the south and west walls of 4a in two rows, as before; the "Contested" flag on their purpose is unchanged. Pass.
2. **Lens balance / 3. Evidence tiers / 4. Contested flagged:** unchanged; shelf-peg reading still flagged contested, "nothing of any shelf survives" kept. Pass.
5. **Tone:** unchanged. Pass.
6. **Religious sensitivity:** Qumran is not a restricted (S)/(R) site in `plans/pilgrimage-sites.md`; no sacred object, image of a revered person, or figure added; neutral West Bank wording untouched. No new page or asset — an existing live room's surfaces. Pass (still per item, because it is new visual work).
7. **Games and 3D:** headless walk, below. Pass.

## Code read
- Import `../../../assets/foundation/kit.js` resolves (`docs/assets/foundation/kit.js`, uses the page's `three` importmap); `withBreakup` sets `onBeforeCompile` + a cache key on the **clone**, so other caves' shared marl is untouched.
- Engine `dropSection` disposes geometries; the section's `dispose()` disposes the two cloned materials and the socket/mask materials; the shared breakup texture is kept (shared by design).
- Mask discs are front-side only, so nothing is cut from outside the cave; sockets are wound to face their normals.

## Local checks (this session, on `9a175396`)
- `node tools/review-checks.js --base origin/main --build`: **9/9 PASS**, tree clean after build.
- every `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: **42/42**.
- Headless (Chromium, swiftshader), 390×844 and 360×780, PR vs `main`:
  - no script errors (only an external resource blocked by the sandbox proxy, identical on `main`); no horizontal scroll;
  - Cave 4 builds in 158–303 ms; **10 draw calls / 3,786 triangles** vs main 8 / 1,124 (+2 calls, +2.7k tris, as the builder reported);
  - unload test: go to Cave 3 and back: geometry count returns to 10, no growth, no errors;
  - views of all four walls of 4a from the centre and from two points near the south/west walls at grazing angles: sockets read as holes with an inner lip and darkening depth; no see-through, no z-fighting, no mask halo; facet seams of `main` gone. Comparison: `handoff/previews/2026-11-08-pr122-review-main-vs-pr.png` (left main, right PR).

## Notes (not findings)
- A thin dark vertical line low on the 4a wall near the way through to 4b is visible at one grazing angle; it is **identical on `main`** (pre-existing geometry gap, not from this PR). Worth a look in the next Presence Pass room touch.
- The higher vault still shows slight texture stretch at the one remaining UV join; documented in the code comment, acceptable.

## GitHub (at 02:47 UTC)
8/9 green (runtime ×2, guard, verify ×2, checks, test, links). **Lighthouse in progress** (started 02:30:30 UTC). Merge waits on it.

## Findings
None.
