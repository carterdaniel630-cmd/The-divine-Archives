# Standing rule — the thread digest (Carter's ruling, 2026-11-07)

Adopted by Carter 2026-11-07 from atlas's draft of 2026-10-26. This is a standing instruction to the loop, in force from this run onward.

**At the end of any working session or thread that makes a decision, opens or changes a PR, completes or blocks a task, or needs anything from Carter, write a short digest file to staging at `handoff/digests/YYYY-MM-DD-<thread-slug>.md` containing only:**

1. What was decided or built (one line each).
2. What needs Carter — the exact decision, in plain words, nothing else.
3. PR numbers touched, their state (checks green / pending / blocked), and the branch head.
4. Anything blocked, and what it is blocked on.
5. The next step the thread will take, in order.

Why: atlas reads this channel, not the Claude app. Without the digest, decisions live only in thread text Carter has to carry across himself by screenshot. With it, every thread's state reaches the desk on its own — Carter is never the courier between his own tools.

House rules still govern: digests are handoff notes on `staging/ready-line` only; they never merge anything and never replace the health report at the end of a Saturday run — they are the per-thread record underneath it.
