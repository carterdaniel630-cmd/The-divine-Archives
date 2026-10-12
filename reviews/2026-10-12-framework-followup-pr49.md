Summary: 1 passed, 0 fixed, 0 need you. #49 fixes both bugs I reported on #40, and each fix is proven by a test that failed before.

NEEDS CARTER (0)
  Nothing beyond the merge, which you approved on 2026-10-11 ("merge all the pls 49 when done"). It merges once
  the owner session resolves a version-number clash with #47 in docs/museum.html and CI is green.

------------------------------------------------------------------------------------------------

Batch: framework follow-up, the two fixes from my #40 Phase 2 report (PR #49)
Reviewed: 2026-10-11, re-checked 2026-10-12
Auto-pass: on ("audit 2026-10-11: 6 of 6 re-reviewed items agreed; ...", reviews/status.json)
Covers: claude/framework-followup@dcd729e   (the fixes)
Covers: claude/framework-followup@3ecc4df   (+ main merged in for #43, and a handoff note; no other change)
Covers: claude/framework-followup@097e415   (only main merges and handoff notes since; no new code)
Summary: 1 passed, 0 fixed, 0 need you.

Automatic checks (dcd729e)
  - node --test framework/test/*.test.js: 38 of 38 pass (two new regression tests).
  - review-checks.js --base origin/main --build: 8 pass, build output current.
  - All tools/verify-*.js pass. build-entity-registry --check and build-framework --check: up to date.

PASSED   (1)
  - site:fw-followup (#49):
      - site:fw-retry fixed. Retrying now decides from the stored failure reason (isTransient(reason)), so pages
        that failed with 429/5xx/timeouts before the earlier fix are retried too. The stored "transient" flag is
        gone. reportPath now follows the baseline folder (needed for the test; the same path in CI).
      - site:fw2-import fixed. The tracker records when it first ran in a browser (localStorage
        da.ledger.since), and imports only scores saved before that time. Re-run of my test: a score set after
        the tracker existed is counted once (was twice). A score from the day before is still imported, once,
        and not again on the next load.
      - The tracker script is bumped to ?v=2 on every page that loads it (171 chapter and Vault pages, symbols,
        museum, pantheon). The page builders write v=2, so the next rebuild keeps it.
      - Small remaining edge, not worth code: a visitor who played during the ~9 hours v=1 was live, and whose
        new-score game had not been imported yet, may get one extra imported copy on their first v=2 load.
        Best scores are unaffected.

Re-check on 097e415 (2026-10-12)
  - No new code since dcd729e: only main merged in (#43, #44, #46, #50, #51, #52, #55) and handoff notes
    (handoff/CARTER-TO-TRY.md, a phone checklist for Carter, reads correctly against the live site).
  - Test-merged with main after #47: one conflict, docs/museum.html script versions only. Right resolution: app.js?v=39
    and museum.css?v=10 from main, archive-ledger.js?v=2 from #49. With that: review-checks --build 9/9, 38 framework
    tests, every verify-*.js, and the registry (4,310) and framework checks all pass. Sent to the owner session to apply.
  - Lighthouse: the hard-gate failure on 5b6a404 (Tomb Robber 89 to 78) is noise. Both sides scored either about 89 or
    about 78 across the 9 runs, and #49 does not touch that game. The next head (0395ddb) passed the gate.

Merges carried out on Carter's instruction (2026-10-11: "close #45", "merge all the pls 49 when done", "yes merge"),
each after a local test-merge with the then-current main and a full check pass:
  - #48 Divine Casualties movesets: merged 740c43c.
  - #46 speed pass: merged 847cd69.
  - #44 games catalog: merged 0031d3a. Main merged into the branch first (e70b4f5). symbols.html versions resolved,
    fighter.js bumped to v=45, fighter play-to-KO test passing.
  - #47 Weighing of the Heart: merged b898e79. Main merged into the branch twice: the registry rebuilt (5d80fb7), then
    the handoff note taken from main (cf98740). All CI green, Lighthouse included.
  - #45 closed without merging: main already had the same rebuild.
