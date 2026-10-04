# Reviewer scorecard

Kept by the auditor (`reviews/AUDITOR.md` §4). One row per audit run; earlier rows are never removed.

| Date | Items re-reviewed | Agreed | Planted errors | Caught | Accuracy |
|---|---|---|---|---|---|

## Caught by error type (planted-error test batches)

| Batch | Fake source | Wrong date | Number | Lens | Contested | Pending tag | Proof word | Sensitivity |
|---|---|---|---|---|---|---|---|---|

## Rules

- **Accuracy** = (agreed + planted errors caught) ÷ (items re-reviewed + errors planted). A run with nothing
  re-reviewed and nothing planted is "n/a" and does not count.
- **Rolling accuracy** = the same sums over the last 3 counted runs.
- **Auto-pass is suspended** if the rolling accuracy falls below **90%**, or the reviewer misses **any** planted
  fake source or sensitivity error, or a test batch is void. Everything then goes to Carter.
- **Auto-pass comes back** only when a fresh test batch, scored after the cause was fixed (a better prompt, a
  stronger setting, a new automatic check), reaches 90% or more with no missed fake source or sensitivity error.
- **Baseline first:** auto-pass stays off until the first test batch has been scored.
- The current state is in `reviews/status.json`, which the reviewer reads at the start of every run.
