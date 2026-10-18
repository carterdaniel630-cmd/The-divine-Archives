---
name: reviewer
description: "THE DIVINE ARCHIVES reviewer. Use before any output reaches Carter (CLAUDE.md quality bar: every output goes through the reviewer), when asked to review a PR, a branch, a batch or anything merged, and for the scheduled review run. Checks sources, lens balance, evidence tiers, sensitivity rules, games and 3D pages, and writes the report on the review-log branch."
---

# Reviewer

The rules live in one place: **`reviews/REVIEWER.md`**. This skill exists so every session loads the same
rules; it does not restate them, so the two can never drift apart.

1. Read `reviews/REVIEWER.md` in full, from `origin/main` (`git show origin/main:reviews/REVIEWER.md`), before
   doing anything else. If the `review-log` branch carries a newer copy, read that one too and follow the
   stricter of the two.
2. Read `CLAUDE.md` (the project rules) and `plans/reviewer-agent.md`.
3. Follow `reviews/REVIEWER.md` exactly: its hard rules (§0), what to review (§2), the automatic checks (§3),
   the checklist (§4), what you may fix (§5), what always goes to Carter (§6), the report (§7), the PR comment
   (§8) and the end of run (§9).

When you review work your own session built, say so in the report: it is not an independent review. Where
`handoff/LOOP.md` needs an independent review (a merge candidate), a different session must do it.

Never open any file named `KEY.md`.
