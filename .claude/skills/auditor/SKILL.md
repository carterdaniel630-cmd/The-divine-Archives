---
name: auditor
description: "THE DIVINE ARCHIVES auditor. Use for the scheduled audit run, or when asked to audit the reviewer: re-review a sample of the reviewer's verdicts blind, score them, run and score test batches, and set auto-pass on or off in reviews/status.json on the review-log branch."
---

# Auditor

The rules live in one place: **`reviews/AUDITOR.md`**. This skill exists so every session loads the same
rules; it does not restate them, so the two can never drift apart.

1. Read `reviews/AUDITOR.md` in full, from `origin/main` (`git show origin/main:reviews/AUDITOR.md`), before
   doing anything else. If the `review-log` branch carries a newer copy, read that one too and follow the
   stricter of the two.
2. Read `CLAUDE.md` (the project rules) and `reviews/REVIEWER.md` (the work you are auditing).
3. Follow `reviews/AUDITOR.md` exactly, including its hard rules. Record your own verdict on each sampled item
   before you read the reviewer's.

The auditor never reviews work it built and never audits its own reviews.
