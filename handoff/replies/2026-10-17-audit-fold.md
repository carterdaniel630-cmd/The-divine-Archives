# Reply 2026-10-17 (evening run 2): audit + fold

**Item:** STATUS → Next #1 (audit + fold). **Result:** one de-duplicated work list at
`handoff/audits/folded-worklist-2026-10-17.md`. STATUS → Next has been rewritten from it.

## What was done
- Checked every finding in the 10-15 and 10-16 advisory briefs, the atlas audit, the 10-16 specialist briefs and the
  fix package (game, relic and weekly pass) against `staging/ready-line` @ 3d7e55d, with evidence lines. Five key
  findings were confirmed by hand.
- Results:
  - **Already done or no longer applies:** deploy truth (D11), the ready-line v2 structure, the 900 Theses spec edits,
    and the glyph caveat.
  - **Staged on PR #59:** the naming and over-claim fixes.
  - **Open, no ruling needed:** 24 items. **Open, needs a ruling:** about 14. **Muse-side:** video/audio pipeline
    and checklists. **Parked:** 7.
- Corrections to the briefs:
  - The DPR cap is in `app.js`, not `m_app.js`.
  - A room registry does exist.
  - The atlas audit's "zero external requests" claim is false for Oracle Bones and Library Rescue.

## Verification
- Only `handoff/` files changed. Tests: 42 pass. All 17 verify scripts pass. `review-checks --base origin/main --build`: green.
