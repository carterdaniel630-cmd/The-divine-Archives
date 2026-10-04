# reviews/ — the review desk

This folder is where your work gets checked before it reaches you. Plan: `plans/reviewer-agent.md`
(approved 2026-10-04: no API key, scheduled Claude Code sessions, 90% accuracy bar, monthly tests).

## Who does what

- **Automatic checks** (no AI, free): every pull request runs `.github/workflows/review.yml`. It checks
  links, file sizes, the sitemap, the pending-review tags and that the built pages are up to date, and it
  blocks test material from ever reaching `main`. The script is `tools/review-checks.js`.
- **The reviewer** (a scheduled Claude Code session, instructions in `REVIEWER.md`): reads each new batch,
  spot-checks facts against the cited sources, checks the evidence sections, balance, tone and the
  religious-sensitivity rules, fixes small mechanical slips on the batch's own branch, and sorts everything
  into **passed**, **fixed** and **needs you**.
- **The auditor** (a separate scheduled session, its own instructions in `AUDITOR.md`): re-checks a random
  10% of what the reviewer passed, without looking at the reviewer's answer first, and once a month gives the
  reviewer a test batch with planted mistakes to see what it catches. It keeps the **scorecard** and can
  switch auto-pass off.

Neither session can merge, push to `main`, clear a pending tag or delete anything. Those stay with you.

## Schedule

- Reviewer: regularly (for example nightly), on whatever was pushed since its last report.
- Auditor: on a different day (for example weekly). Its first run each month plants the test batch; a later
  run scores it once the reviewer has reviewed it.

## How to read it (on a phone)

The reports live on the **`review-log`** branch (so they never touch the live site). On GitHub, switch the
branch menu to `review-log` and open `reviews/`.

- `YYYY-MM-DD-<batch>.md` — one per batch. Read the **Summary** line and the **Needs your decision** list at
  the bottom. That is all you need; the rest is the evidence.
- `YYYY-MM-DD-audit.md` — the auditor's check on the reviewer. Look for disagreements and the auto-pass line.
- `scorecard.md` — how accurate the reviewer has been.
- `status.json` — `"autoPass": true` means the reviewer may pass work by itself; `false` means everything
  comes to you. It starts `false` until the first test batch sets a baseline.

Each PR also gets a one-line comment pointing to its report.

## Clearing content: `cleared.json`

When you clear chapters, Vault entries or Pantheon figures in a batch review, the change that removes their
pending tag also adds them to `cleared.json`, for example:

```json
{ "chapters": [{ "id": "ch66", "date": "2026-10-05", "note": "Batch III review" }], "vault": [], "pantheon": [] }
```

It is a running log; entries are only ever added. The automatic check lets a chapter go live without the
pending tag only in the change that adds its clearance, so one clearance never covers later edits. Only you
decide what goes in it.

## Test batches

Test batches live only on branches named `review-test/YYYY-MM`, inside a `review-test/` folder, with each
planted mistake marked by a hidden tag containing `REVIEW-TEST-PLANTED`. They are never opened as pull
requests, and the `guard` check fails any pull request into `main` that comes from such a branch, adds a
`review-test/` folder or adds that marker.
