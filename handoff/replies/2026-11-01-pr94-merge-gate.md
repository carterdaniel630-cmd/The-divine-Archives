# PR #94 merge gate (Newgrange, carries #66), 2026-11-01

Candidate: c343c32. Commits after it touch only `handoff/`.

- **Carter's approval:** "yes on 66" (2026-11-01 02:44 UTC, project chat, relayed to the Pilgrimage thread). #94 is
  #66's branch, merged unchanged onto current main, plus review fixes. He approved the batch's sensitivity calls on
  2026-10-25 ("Approve all"), the Newgrange burials and DNA card included.
- **Independent reviews** (runs that wrote none of the changes):
  - 687a56c, a full review: FAIL, 3 findings, 0 NEEDS CARTER. The engine and parts.js changes were checked against
    main on Delphi, Stonehenge and the Great Pyramid, with draw calls and triangles unchanged. The findings were
    fixed in c343c32.
  - c343c32: **PASS (0 findings, 0 NEEDS CARTER).**
- **GitHub checks on c343c32:** all completed and green: review checks and guard, verify, originality, framework
  tests, game runtime, and Lighthouse (run 41267293646, success).
- **Local checks:** the full build order; `review-checks.js --base origin/main --build` 9 passed, 0 warnings; every
  `tools/verify-*.js` OK; framework tests 42 pass; the mound, the passage with the solstice card, and the chamber
  opened headless with no script errors.
- **Status:** Newgrange stays a noindex preview with the pending-review tag.
- **Not for this PR:** ch42 calls the megaliths' solstice alignments "genuine, measurable", while Ray (1989) calls
  the evidence for Newgrange's deliberate design weak. This is a possible note for a future ch42 batch.
