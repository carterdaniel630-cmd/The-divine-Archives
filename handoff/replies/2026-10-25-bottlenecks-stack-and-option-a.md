# 2026-10-25 — Bottlenecks cleared: approved PRs stacked; reviewer/auditor option A folded in

**Asked by:** Carter, "resolve any bottlenecks" (chat session, beside the loop; claim `loop/CLAIM-stack-67-75-76.md`).

## 1. Merge queue (the main bottleneck)
Three approved PRs (#67, #76, #75) each sat on `efba79c`. Every merge would have sent the other two back for a fresh
sync and another full round of checks (Lighthouse is the slow one), three times over.
Now stacked in going-live order, each head containing the ones before it:
- **#67** `c957af5` (unchanged).
- **#76** `be51670` = reviewed `7100802` + #67. Clean merge.
- **#75** `71206ee` = reviewed `223600f` + #67 + #76. One file touched by both (`docs/vault/book-of-shadows.html`:
  #76's script version and #75's banner removal), merged cleanly with both changes kept.
Checked: the diff each stacking merge adds equals the already-reviewed PR beneath it; `review-checks --base origin/main
--build` 9/9 on both new heads (committed output matches a fresh build); 17/17 verify scripts; 42/42 framework tests;
headless phone (390 px) on Book of Shadows, Codex Mendoza, Pantheon, an era page and the museum: 0 script errors, no
sideways scroll.
Order rationale: the loop may merge #67 and #76; #75 clears pending tags, so only Carter presses its Merge. It goes last
so it blocks nothing. My first stacking (02:10) had #76 on top of #75, which would have tied #76 to Carter's button;
corrected minutes later by moving `loop/speed-fix-a` from my own `a2b0952` to `be51670` (nothing else was built on it).
GitHub checks restarted on `be51670` and `71206ee`.

## 2. Reviewer and auditor (option A, Carter 2026-10-24)
The scheduled reviewer and auditor have saved nothing since 2026-10-12 (no repo attached, usage limits). Folded into
`handoff/LOOP.md` step 7: each independent review is also saved to `review-log` with a `runs.md` line; the first run on
or after each Wednesday does AUDITOR.md's weekly steps. The two scheduled tasks are left as they are (not changed).

## 3. Rules added to LOOP.md so this doesn't recur
- Several approved items waiting at once → stack them and let them fast-forward back to back.
- Chat-session claims (`handoff/loop/CLAIM-*.md`) written down: not a lock, skip the item, stale after 3 hours.

Nothing merged by this session.
