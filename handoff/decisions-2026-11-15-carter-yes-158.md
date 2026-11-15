# Carter's ruling, 2026-11-15 ~23:00 UTC: "yes" (PR #158, Vault checker fix)

Asked live in loop session ..01HFWzToHofH6REksVyk3KJC, at the end of its run report and in a push notification:
"Vault checker fix (#158): a) Yes, merge #158 once it's reviewed and green. Then #159 can go live under your existing yes
for removing Wikipedia. / b) No …"

Carter answered, live in that session: **"yes"** (= **a**).

## What this covers
- **Per-item yes for PR #158** (`loop/review-checks-vault-sources` `089441d5`, `tools/review-checks.js` only): merge once
  every LOOP.md "Merging" condition holds. That means an independent review with 0 open findings by a session other than
  ..01HFWzToHofH6REksVyk3KJC, GitHub green (Lighthouse too if it runs), the local checks, and no commits after the candidate
  outside `handoff/`.
- **#159** (Wikipedia strip part 10, Vault, `63cd573e`, stacked on #158) stays on Carter's strip yes
  (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`). It merges after #158 once its own review and GitHub checks pass.

## What this does not cover
- Any change to #158 beyond `089441d5`. If a review fix alters the rule itself, ask again; a wording or comment fix is fine.
- Clearing any pending tag; the sole-source flags (they go to re-sourcing).

Recorded without the loop lock: run 22:56 UTC holds it. Only this file was added; that run or the next folds it into
STATUS → Needs Carter / MERGEABLE.
