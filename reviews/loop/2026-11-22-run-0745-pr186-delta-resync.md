# PR #186 save rules — delta check PASS 0, then re-synced onto `main` (2026-11-22 ~07:55 UTC)

- **Session:** build loop run ..01HFWzTmKaWBBbW23wH7jXRs. Wrote none of #186: not the writer (..01HFWzTnQh7cP5RgU9eQvBNg),
  not the reviewer (..01HFWzTpFuacHuzyHKfFU7M4), not the fixer (..01HFWzTnpxcdoXt2auPEmBmk).
- **Item:** STATUS Next (1). Carter's per-item yes on file: `decisions-2026-11-22-carter-save-rules-yes.md`.

## 1. Delta check on `cfe48c8d` (the F1/F2 fix): PASS, 0 findings
- `git diff 718a0cd2 cfe48c8d` = exactly one line in `.claude/settings.json` allow: `"Bash(gh api *)"` → `"Bash(gh api -X GET *)"`. Nothing else.
- F2 sentence present in the PR #186 description ("These rules stop direct pushes to `main`; the merge gate in LOOP.md and
  the run's own hard limits remain the real guard …") and in `2026-11-22-session-saves-diagnosis.md` lines 24–25.
- `git diff origin/main...cfe48c8d` = `.claude/settings.json` only, +44, JSON parses, hooks block untouched (context only).
- Local on `cfe48c8d`: tests 51/51, verify 18/18.
- GitHub on `cfe48c8d`: 6/6 completed green (guard, tools, runtime ×2, checks, graph). Lighthouse did not run: its
  workflow only triggers on `docs/**`, and #186 changes no site file. Not a gap.
- Observation, not a finding: `gh api -X GET … -X PATCH` (a second method flag) would still match the allow pattern.
  Same class as `node *` / `npm *` running anything, which F2's wording already names; the LOOP.md merge gate stays the guard.

## 2. Re-sync onto `main` `62b93b99` (#184 went live after #186 was cut on `a2a6aa4b`)
- Merge commit **`fa9e526d`** (`git merge --no-ff origin/main`), no conflicts, no shared files.
- `git diff origin/main fa9e526d` is byte-identical to `git diff a2a6aa4b cfe48c8d` (same sha1 of the diff text).
- Local on `fa9e526d`: tests 51/51, verify 18/18, `review-checks.js --base origin/main --build` 9 passed / 0 failed / 0 warnings.
  No visual change, so no headless check.
- Pushed; GitHub checks started on push, **not waited for** (lock not held while waiting).

## Owed before merge (per item)
Because this session re-synced, it may NOT check the re-sync. Next: a session that is none of writer / reviewer / fixer /
this one confirms `git diff origin/main fa9e526d` is the same text as `git diff a2a6aa4b cfe48c8d` (only the +44
`.claude/settings.json` lines), GitHub green on `fa9e526d`, then fast-forward `main` per item. Still Carter-only: GitHub default branch → `main`
(the rules only load once that is switched).
