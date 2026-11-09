# PR #135 Rotunda ring of statues — delta review of the F1/F2 fix (R1d)

**Verdict: NOT MERGEABLE YET — FIXABLE, 1 new finding (D1: the far copies look broken where they first appear).**
The phone-budget fix itself works and F2 is done.
Reviewer: session ..01HFWzTo72WoREjKk5JhZMYS (wrote none of #135: builder ..01HFWzToHt8256shdsp7mQn1, fixer
..01HFWzTo3a9ESmJDfqbLbdED, first reviewer ..01HFWzToCaP3Wf1xDbEDJN1o).
Candidate `loop/rotunda-pedestals` `9d82ed28`; delta reviewed `1eb77b03..9d82ed28` (3 files: `docs/museum/statues.js`,
`docs/museum/app.js` (2 lines), `docs/assets/rotunda/lib/README.txt`), against `reviews/REVIEWER.md` §3–§4.
Class: per item (new museum build; revered figures).

## §3 automatic checks (fresh worktree on `9d82ed28`)
- `review-checks.js --base origin/main --build`: 9 pass, 0 fail, 0 warn; tree clean after the build.
- every `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- GitHub on `9d82ed28` (04:31 UTC): test, checks, guard, runtime ×2 green; **Lighthouse still running** at 04:45 UTC.
- No script errors in any headless run (only the blocked Google Fonts request and SwiftShader's GL notices).

## What passed
- **F1 phone budget: fixed.** Re-ran the fixer's own sweep (`handoff/previews/pr135/fix-sweep-probe.js` +
  `fix-sweep-views.json`, 390×844 @1×): **first 1,100 of 3,432 views, worst 201,125 triangles / 92 draw calls, 0 over
  220k, 0 over 100 calls** (stopped there; SwiftShader shared the CPU with the other checks, ~40 min for all of it). My
  own spot views agree: beside Socrates 162k, beside Shiva 181k, ring from the door side 78k.
- **Level switch logic** (`THREE.LOD`, each statue by its own distance) behaves as described: the near level comes
  in within ~3.2 m, the far copy beyond; the hit boxes, cards, plaques and placement are unchanged (the diff touches
  none of them). Tapping Socrates from 1.4 m opens the right card with the same wording as on `1eb77b03`.
- **Near Socrates** (thinned 132,060 → 114,603): at 1.4 m on a 390 phone it is not visibly different from the full
  mesh (`pr-near-socrates`; compare `review-390.png`).
- **Load cost:** with the phone CPU slowed 4× (headless), longest main-thread stall while the three statues load was
  3.6–5.1 s on `9d82ed28` vs 4.1–4.3 s on `1eb77b03` (two runs each, noisy). The in-browser thinning does not make
  the existing stall clearly worse. Not measured on a real phone.
- **F2: fixed.** The README line is accurate (the museum runs this folder's GLTFLoader/BufferGeometryUtils against its
  r186 three on purpose).
- Code read: vertex clustering uses one grid per statue; cell keys pack 4096 cells per axis, enough for the chosen
  cell sizes (statue ≲ 2 m, cells ≥ ~1 mm). Original meshes are dropped after the copies are made (no leak).

## Finding

**D1 — fixable (the far copies look broken where they first appear).** The far copy (~6k triangles) starts at
3.2 m, which on a phone is still close: the statue fills a third of the screen. There, all three are visibly
damaged, and the switch at 3.2 m is an obvious jump (360 px, same spot each side of 3.2 m):
- **Shiva**: the face and crown melt into one smooth lump, the trident and drum break up, the lotus base turns to
  blobs (`handoff/previews/pr135/delta-pop-shiva-360.png`, left near mesh at 3.0 m, right far copy at 3.4 m).
- **Socrates**: the face is gone (a blank oval), the robe is spotted with black pinholes, the feet break up
  (`delta-pop-socrates-360.png`; at 3.0 m it was already on the far copy, measured from eye height).
- **Isis**: the face goes dark and featureless, part of the crown is lost (`delta-pop-isis-360.png`).
- Still the same at 5 m (`delta-far-5m-360.png`).

The fixer's own far shot (`fix-far-ring-390.png`) is from ~8 m, where the damage is too small to see; the
statues a visitor walks between are mostly seen at 3–7 m. For revered figures (Shiva, Isis) a faceless, melted
figure is also a respect issue (C1 below), not just looks.

Suggested fix (builder's choice; re-run the full sweep afterwards): there is room in the budget, since every view
without a near statue stays under ~90k. For example a **middle level** of about 25–35k triangles per statue from
3.2 m to ~8 m, with the ~6k copy only beyond that, or push the far switch out and make the far copy finer; and fix the
pinholes (likely flipped/sliver triangles from clustering plus recomputed normals; e.g. drop zero-area triangles,
keep the cluster normals from the source mesh, or render the copy double-sided). Then look at each statue at 3.3 m,
5 m and 8 m on 360/390 and confirm the face, hands and attributes still read.

## For Carter
Nothing new. **C1** is already answered: Carter said "a" at ~04:53 UTC (`decisions-2026-11-09-carter-yes-merge-135.md`),
yes to merge once the fix passes a delta review with zero open findings and GitHub is green. This review has one open
finding, so **no merge now**. D1 is a fixable look finding (it does not go to Carter): once a builder fixes it and a
delta review by a session that wrote none of that fix finds nothing, his yes covers that candidate. The respect point
above is why D1 must be fixed before merge, not a new question for him.

## Screenshots
`handoff/previews/pr135/delta-pop-{shiva,socrates,isis}-360.png`, `delta-far-5m-360.png`.

## What happens next
1. (R1f2) a builder run fixes D1 on `loop/rotunda-pedestals` (any session; re-run the sweep).
2. Delta review by a session that wrote none of that fix.
3. GitHub green incl. Lighthouse on the new head; Carter's per-item yes (C1).
