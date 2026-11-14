# PR #87 merge gate (Pilgrimage batch 2: Persepolis, Angkor Wat, Borobudur), 2026-10-31

Candidate: 75b931d. Commits after it touch only `handoff/`.

- **Carter's approval:** "approve all reviewed with the opening to adust later if necessary" (2026-10-31 20:08 UTC,
  project chat, relayed to the Pilgrimage thread). He approved the batch's sensitivity calls on 2026-10-25 ("Approve all").
- **Independent reviews** (runs that wrote none of the changes):
  - 3ed72ea: FAIL, 8 findings, fixed in 0f224d3. The one NEEDS CARTER on sensitivity is covered by his approvals above.
  - 0f224d3: FAIL, 2 findings, fixed in e6ea5e3.
  - e6ea5e3: FAIL, 1 finding, fixed in 151f630.
  - 151f630: FAIL, 2 findings, fixed in 4a8985e and 5812fae.
  - 5812fae: FAIL, 3 findings (full re-read of all three sites; Persepolis and Borobudur passed), fixed in 75b931d.
  - 75b931d: **PASS (0 findings, 0 NEEDS CARTER).**
- **GitHub checks on 75b931d:** all completed and green: review checks and guard, verify, originality, framework
  tests, game runtime, and Lighthouse (run 41239675277, success).
- **Local checks on 75b931d:**
  - full build: stamp-dates, vault, chapters, pages, museum, framework, entity registry;
  - `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 warnings;
  - every `tools/verify-*.js`: OK;
  - framework tests: 42 pass;
  - each site opened headless with no script errors.
- **Status:** all three sites stay noindex previews with the pending-review tag.
- **Newgrange:** left to #66. The batch's review fixes for it are in `/mnt/project-files/pilgrimage/newgrange-batch2-vs-pr66.diff`.
