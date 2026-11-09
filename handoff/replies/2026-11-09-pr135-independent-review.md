# PR #135 Rotunda ring of statues (R1b) — independent review

**Verdict: NOT MERGEABLE YET — 1 fixable finding (phone budget), 1 small fixable doc note, 1 point for Carter's per-item yes.**
Reviewer: session ..01HFWzToCaP3Wf1xDbEDJN1o (wrote none of #135; builder ..01HFWzToHt8256shdsp7mQn1).
Candidate `loop/rotunda-pedestals` `1eb77b03`, one commit, fast-forward from `main` `43850da4`. Reviewed
`origin/main...1eb77b03` (4 files: `docs/museum/statues.js` new, `docs/museum/app.js`, `docs/museum.html`,
`tools/build-museum.js`) against `reviews/REVIEWER.md` §3–§4. Class: per item (new museum build; revered figures).

## §3 automatic checks (on `1eb77b03`, fresh worktree)
- `review-checks.js --base origin/main --build`: 9 pass, 0 fail, 0 warn; tree clean after the build (output current).
- `tools/verify-*.js`: all pass. `node --test framework/test/*.test.js`: 42/42.
- Headless, 360×780 and 390×844 (touch, SwiftShader): from the entrance hall nothing of the ring is fetched
  (all three `idle`, hidden); at the Rotunda centre all three load (`ready`; Shiva 106,936 tris, Isis 75,000,
  Socrates 132,060). Walking up to each statue and tapping the screen centre opens the right card with the right
  two links (`rotunda/<id>.html`, `rotunda/index.html`). No script errors (only the blocked Google Fonts request and
  SwiftShader's own GL notices); no sideways scroll. Screenshot: `handoff/previews/pr135/review-390.png`
  (Shiva, Isis, Socrates on their pedestals; the Isis card).
- GLTFLoader/BufferGeometryUtils are the r160 example files from `docs/assets/rotunda/lib/`, run against the museum's
  r186 three: all 67 names they import from "three" exist in r186 (checked by import). There is no CSP in `_headers`
  that would block the blob-URL modules.

## Findings

**F1 — fixable (phone budget exceeded).** `plans/museum-visual-pass.md` sets the museum's phone budget at
**≤ 220k triangles per view** (line 244; the PR's spec asks for the phone budget per `tools/museum-baseline.js`).
Measured with `museum-baseline.js` (DPR 1, no throttle, spots `@hall` and `@rotunda`), main `43850da4` vs `1eb77b03`:

| spot | main | #135 |
|---|---|---|
| hall | 39 calls, 26,770 tris | 39 calls, 26,770 tris (unchanged) |
| Rotunda (entrance view) | 57 calls, 72,122 tris, 5.4 fps | 68 calls, **255,022 tris**, 4.5 fps |

The builder's own reply records the same 255k. From the Rotunda's door all three statues (314k tris together) are
drawn at full detail, so the view is ~35k over budget, and it will grow with every tray. Suggested fixes (builder's
choice, then re-measure every Rotunda view, not just the door): draw each statue by its own distance to the visitor
rather than the ring centre's, and/or a lighter far copy (level of detail) for statues seen from across the room, so
that every view stays ≤ 220k triangles and ≤ 100 draw calls. Not measured on a real phone (Carter's `?fps=1` walk).

**F2 — fixable (doc out of date, small).** `docs/assets/rotunda/lib/README.txt` says the museum uses its own r186
three "do not mix them". After #135 the museum loads this folder's GLTFLoader and BufferGeometryUtils against its r186
three (deliberately, one THREE in the page; header of `statues.js` explains). Add one line to the README saying so,
so the next builder does not "fix" it back.

**C1 — for Carter's per-item yes (sensitivity rule, REVIEWER §4.6), not a defect.** The museum now shows 3D figures of
Shiva (a scan of the worshipped Murudeshwar monument) and Isis (venerated in revived Kemetic practice) in the Rotunda.
Carter's yes on #134 covered their statue pages; his per-item yes on #135 should cover showing them in the museum too.
The tone is respectful: each card says what is scan and what is ours, and nothing is called a likeness.

## Passed
- **Honesty of the cards vs the statue pages** (read in full on the branch): Shiva "A real scan of the modern statue at
  Murudeshwar, Karnataka, by Boris3D Studio (CC BY 3.0). The dark bronze finish is ours" — matches the page. Isis
  "A modelled rendition built to the tradition, not a scan of an ancient statue. Her face follows a Roman bronze bust
  of Isis in the Mount Holyoke College Art Museum" — matches, and wisely names no model-maker while #134 C1 (the
  "3DWP" credit) is open. Socrates "The head is from a museum scan of the ancient portrait type … the robed body was
  made for this statue" — matches, and names no museum while #134 C2 (SMK vs Uffizi) is open. Each card links to the
  page carrying the full credits and licences (CC BY allows credit by link to a page that carries it; Shiva's card
  names author and licence outright).
- Pending wording on every plaque ("recently added · tap to read"), card ("Recently added, pending full review") and
  Directory line.
- About card: the new paragraph names the statues as the exception to "no scans, no likenesses" and says none is
  presented as a likeness of a person or god — consistent with the pages.
- Directory (text version): new "The ring of statues" line under The halls, links checked by `review-checks`.
- Placement: ring r 6.4 m at −45°, −135°, 180°, between the theme bays (22.5° + k·45°) and clear of the north–south
  walkway (x = 0) and the projector (r 0.6); collision boxes 0.85 m. Lazy loading works as described (fetch < 22 m,
  draw < 18 m); a failed load shows a plain note on the card.
- Startup cost: bytes at first ready 2.18 → 2.19 MB (+9 KB); ~3.6 MB of meshes fetched only on approaching the Rotunda.

## Observation (no action required)
- Under the Rotunda's warm lamps the "Marble" Socrates reads honey-gold, close to Shiva's bronze (see screenshot). Not
  an honesty issue (the card and page say marble), but Carter may want a cooler marble before the ring grows.

## What happens next
A builder run fixes F1 (and F2) on `loop/rotunda-pedestals`, re-measures every Rotunda view; then a delta review by a
session that wrote none of the fix; GitHub green incl. Lighthouse on the new head; then Carter's per-item yes covering C1.

## Run note
This run (02:42–02:55 UTC) took the lock at `7c262f61`; that lock commit's trailer named a model by mistake (house rule: none in commits). Left as is rather than rewrite pushed history; later commits follow the rule.
