# Build loop run 2026-11-28 ~20:56 UTC — weekly audit (and finishing the 2026-11-22 audit)

Session ..01HFWzTp8QPeb1nCFQaQUCi8. Wrote none of the audited items or reviews (no commit in the repo carries this session).

## What this run did
- **Tried item 1 (#190 re-sync onto `f206d61a`)**: the merge of `main` into `loop/vr-corridor-measure` was refused by this
  session's permission settings (twice), so nothing was pushed to that branch. No file overlap exists (#190 adds only
  `tools/vr-draw-ledger.js` and `audits/vr-draw-ledger/*`; main's changes since its base touch neither), so the next run
  can re-sync it as a merge-only commit; a different run then does the delta check.
- **Item 2 (#191)** was being reviewed by the VR loop (VR-LOCK, 20:43Z); left alone.
- **Item 3, the weekly audit** (value 6): `review-log` `5a999f12`, report `reviews/2026-11-28-audit.md`.
  - Blind verdicts for the 3 reports since the last audit (#189 merged head, #190, #191) committed first (`f85f61a2`),
    then compared: **3 of 3 agreed**.
  - **Found the 2026-11-22 audit unfinished**: it committed blind verdicts for 49 merged PRs but never compared them,
    never added a scorecard row, never updated `status.json`. This run did the comparison: **29 of 47 agreed**; the 18
    disagreements are listed in the report, and every one re-checked on `main` still stands.
  - Scorecard rows added (11-22: 62%, 11-28: 100%). Rolling over the last 3 counted runs **48/67 = 72%** (67% if the 11
    Wikipedia-strip PRs count as one), below 90%, so by rule 4b **auto-pass is now OFF** in `reviews/status.json`.
  - `reviews/runs.md` line added. No test batch planted or scored (KEY.md rule).
- Checks run: `review-checks --base f12dc09d` on `f206d61a` 9/0/0; verify 18/18; `vr-perf-overlay-check` all passed.
  #190 figures re-checked against its JSON and the `1cfb8d9f` source lines it cites.

## Still open on `main` (from the disagreements; candidates for a fix list)
1. `sources/` logs still carry Wikipedia lines removed from the published lists (#146–#160), e.g. `sources/ch02-egypt.md`
   lines 15 and 22; the ch18 log entry makes World History Encyclopedia look like the source for Julian (#152).
2. `tools/build-museum.js` line 211: "Zeus, from a scan of the Artemision bronze" → a scan of a cast (#144).
3. ch39 Strube entry credits him with more than he says (#167).
4. `sources/ch33-african-traditional-religion.md` line 29: Temple's date is given (1976, Skeptical Inquirer 1996 p. 39) (#180).
5. `docs/museum/xr-move.js` line 162 `walkHand()`: a visitor with only a left controller loses snap turn (#183).
Questions for Carter: Pilate stone dimensions (#176); Isis licence page unconfirmed (#143); save-rule gaps (#186).

## Needs your decision (also in STATUS)
- Auto-pass is off by rule. (a) keep off until a scheduled auditor plants and scores a fresh test batch (recommended), or
  (b) turn it back on anyway.
- Fixes 1–5: (a) approve them as an audit fix list so the loop fixes and merges them by class (recommended), (b) one by one.
- Pilate stone: (a) keep 65 wide x 82 tall as the corpus measures it (recommended), (b) your 82 x 65.
