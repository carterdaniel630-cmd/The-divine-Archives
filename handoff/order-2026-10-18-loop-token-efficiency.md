# Item 32 — LOOP TOKEN EFFICIENCY FIX (Carter order, Sun 2026-10-18)

Carter said it plainly: "It hits message limit again. It just started. We need to
stop running into this issue. It goes down way too fast and nothing gets done."

## The problem

The build loop does ONE tiny thing per run — a "take lock" commit, one small work
commit, a "release lock" commit, then the next run starts. Every run is a fresh
session. Each fresh session burns messaging tokens just getting started: reading
STATUS.md, reading the manifest, re-reading replies, and committing lock
bookkeeping. That overhead eats the tokens before the real work gets done, and the
loop stalls on empty.

## The fix — five rules, effective immediately

1. **DO MORE PER RUN.** Finish a whole item in one run — build it, review it,
   merge it if Carter already approved that merge — instead of splitting one item
   across three runs. Fewer runs means fewer startup costs. One item, one run,
   done.

2. **CUT LOCK CHURN.** Stop committing "take lock" and "release lock" as separate
   commits. Fold the lock into the work commit. Locks are bookkeeping, not work.
   The history should show what got DONE, not that the loop was holding a lock.

3. **READ LESS PER RUN.** Targeted reads only. Do NOT re-read the full STATUS.md +
   manifest + every reply file every run. Read what this item needs. Keep a short
   working summary in the run's head; only pull the full files when something is
   genuinely unclear.

4. **CHECK BUDGET BEFORE EACH RUN.** If messaging tokens are low, finish the
   current item cleanly and PAUSE the loop instead of starting the next run on
   fumes. A clean pause beats a dead stall — the next run starts from the clean
   checkpoint instead of waking up to a broken half-state.

5. **KEEP THE CYCLE RULE.** Pickup → rework → bring to standard → merge → next item
   (Item 25) still applies. This order does NOT change that. It just makes each
   run do the WHOLE cycle for one item instead of one fragment of it.

## Report back

After this change takes effect, report in STATUS.md how many items get done per
run, so Carter can see the difference in plain words.

## What this order does NOT do

- It approves no merge. Each merge still needs Carter's per-item approval
  (Item 22).
- It does not change the mergeable-list rule: nothing merges unless it is listed
  in handoff/replies/MERGEABLE.md AND Carter approved that specific item.
- It does not unblock anything that is parked, on hold, or waiting on a Carter
  decision.
