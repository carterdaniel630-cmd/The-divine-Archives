# PR #186 independent review — save rules in `.claude/settings.json` (2026-11-22 ~06:50 UTC)

- **Reviewer:** build loop run, session ..01HFWzTpFuacHuzyHKfFU7M4. Wrote none of #186 (its commit is from
  session ..01HFWzTnQh7cP5RgU9eQvBNg; the decision file names ..01HFWzTkiswjZCRdX7PmTty8 as the excluded writer — this
  run is neither).
- **Candidate:** `claude/project-thread-x3njdb` @ `718a0cd2`, based on `main` `a2a6aa4b` (current, no re-sync needed).
- **Scope:** `origin/main...718a0cd2` = `.claude/settings.json` only, +44 lines (a `permissions` block). Against
  `reviews/REVIEWER.md` §3–§4 and the stated intent in `2026-11-22-session-saves-diagnosis.md` ("still stop and ask
  for anything that touches the live site or can't be undone").

## Checked and fine
- JSON valid; `hooks` byte-for-byte the same as `main` after parse (compared as sorted JSON).
- Matches the block in the diagnosis that Carter said yes to (`decisions-2026-11-22-carter-save-rules-yes.md`).
- `ask` beats `allow` in the settings precedence, so `git push … main`, force pushes (`--force`, `-f`, `+refspec`),
  deletes (`--delete`, `:ref`), `--mirror`, `--all`, `git branch -D/--delete`, and `gh api …/merge`, `…DELETE`,
  `…default_branch` all still ask. Over-matching (e.g. a branch name containing `-f` or `main`) only asks more,
  never less — harmless.
- Local on `718a0cd2`: review-checks 9 passed / 0 failed / 0 warnings; tests 51/51; verify scripts 18/18.
  No visual change, so no headless check needed.
- GitHub on `718a0cd2`: 6/6 completed green (guard, tools, graph, checks, runtime ×2). No `docs/` change, so no
  Lighthouse run is expected.

## Findings — verdict: FIXABLE, 2 open

**F1 (blocks merge). `Bash(gh api *)` lets a run change `main` and repo settings without asking.**
`gh api` sends a write whenever it gets `-X PATCH/PUT/POST` or any `-f`/`-F` field (it defaults to POST then).
None of the ask rules catch these, for example:
- `gh api -X PATCH repos/<owner>/<repo>/git/refs/heads/main -f sha=<sha>` — moves the live branch;
- `gh api -X PUT repos/<owner>/<repo>/contents/docs/index.html -f branch=main …` — commits straight to `main`;
- `gh api -X PATCH repos/<owner>/<repo> -f visibility=…` or branch-protection endpoints — repo settings.
That defeats the PR's own promise that "any push naming main" stops and asks. Nothing in the repo uses `gh api`
(searched LOOP.md, VR-LOOP.md, tools/, .github/, CLAUDE.md); the only planned use is read-only search.
**Fix:** replace `"Bash(gh api *)"` with `"Bash(gh api -X GET *)"`. Keep the three `gh api` ask rules.

**F2 (wording only). The "still asks for anything touching the live site" promise is wider than the rules.**
`Bash(node *)` and `Bash(npm *)` run any code (`node -e "…execSync('git push origin HEAD:main')"`), so the ask
rules guard direct commands only, not everything. That is acceptable — the loop needs node — but Carter was told
otherwise. **Fix:** add one sentence to the PR body and to `2026-11-22-session-saves-diagnosis.md`: "These rules
stop direct pushes to `main`; the merge gate in LOOP.md and the run's own hard limits remain the real guard."
(Optional, not required: narrow to `Bash(node tools/*)`, `Bash(node --test*)`, `Bash(node framework/*)`,
`Bash(npm ci*)`, `Bash(npm run *)`.)

## Next
A run or session that is not this reviewer applies F1 (one line) and F2 (wording) on
`claude/project-thread-x3njdb`; a session that wrote neither the PR nor the fix does a delta check; GitHub green on
the new head; then merge per item on Carter's yes already on file. Still Carter-only: switching the GitHub default
branch to `main` — without it the rules never load in new sessions.
