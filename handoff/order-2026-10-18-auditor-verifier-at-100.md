# Carter's order — auditor and verifier at 100% inside the loop

Date: Sunday, October 18, 2026 (morning, ET)
From: Carter, in his own words: "we need to make sure that the auditor and we need to make sure everything is running at 100%. Not just the loop, but like we have an auditor and we have a verifier those things need to be running within Claude"

## What Carter wants

Not just the build loop running — the audit and verification machinery running at full strength inside it:

1. **The verifier** — the independent review (a run that wrote none of the work, reviewing it cold). Confirm it runs on EVERY item before that item can become mergeable. No item reaches Carter for a merge yes without a clean independent review.
2. **The auditor** — the scheduled reviewer/auditor with its heartbeat. Confirm it is alive, running on schedule, and actually saving its reports where they can be read. The old failure was a reviewer that ran but never saved its report — that must not be the state of things.
3. **Report back** — in plain words, in a handoff reply: what you checked, what is running at 100%, and anything that is not (with what it would take to fix it). If the reviewer-heartbeat repair in PR #58 is the fix, say so and whether it is merged and live.

## Bounds

This is a health-check and report order, not a merge approval. Nothing here approves any merge. Each merge still needs Carter's per-item yes.
