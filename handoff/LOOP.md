# The build loop — continuous pickup (Carter 2026-10-17)

Carter's ruling, 2026-10-17 16:30: "automate it, but it should be a loop … as soon as one thing is done, the
other thing is picked up … there should be no downtime in terms of waiting."

Every run of the scheduled task **Divine Archives build loop** follows this file. Each run is a fresh session
with no memory of the last one: the repo is the memory.

## One run, start to finish
1. **Attach and clone** `carterdaniel630-cmd/the-divine-archives` (push access), branch `staging/ready-line`.
   Read `CLAUDE.md`, then this file.
2. **Halt check.** If `handoff/HALT` exists, stop at once: no writes, no next run.
3. **Lock check.** If `handoff/loop/LOCK` exists and its timestamp is under 3 hours old, another run is working:
   stop, with no next run. Otherwise write `handoff/loop/LOCK` (current time, one line), commit and push it. If the
   push is rejected because someone pushed first, pull and re-check the lock.
4. **Read the queue, newest first:**
   - `handoff/manifest-v2.md` and any Items added since `handoff/replies/STATUS.md` was last written;
   - Carter's rulings: every `handoff/decisions-*.md`, and especially any committed after STATUS was last written.
     Fold their actions into STATUS → Next so the ruling is never lost when STATUS is overwritten;
   - `STATUS.md` → Next;
   - `handoff/claude-ready-line.md` order.
   Newest Carter ruling wins. Pickup order every time: finish anything in progress → audit → fold → rebuild better.
5. **Do ONE bounded item**: the first item in Next that needs no Carter approval to do. Bounded means about one
   PR's worth of work, correct and verified. A smaller correct piece beats a larger unverified one. Gated items
   (below) can still be prepared: research, drafts, specs. Only the gated action itself waits.
6. **Verify** exactly as `CLAUDE.md` "Quality bar" says:
   - full build order;
   - every `tools/verify-*.js`;
   - `node --test framework/test/*.test.js`;
   - `node tools/review-checks.js --base origin/main --build`;
   - a headless browser check of anything visual.
   Never push red.
7. **Write back**:
   - one dated reply in `handoff/replies/`;
   - overwrite `handoff/replies/STATUS.md` (done / in progress / next / needs Carter);
   - remove `handoff/loop/LOCK`.
   Then commit and push to `staging/ready-line`.
8. **Chain.** If `STATUS.md` → Next still has an item that needs no Carter approval, start the next run right
   away (fire this same scheduled task). Do not wait for the hourly backstop.

## When the loop stops by itself (and tells Carter)
- Everything left in Next needs Carter's approval. Write the batch of decisions in `STATUS.md` → Needs Carter, send
  one notification, and do not chain. The hourly backstop then only checks for a new Carter ruling or Muse item,
  and starts work only when one exists.
- The same item fails verification in two runs in a row. Stop, describe it in STATUS, and notify.
- `handoff/HALT` exists.

## The one merge Carter has approved (Item 21, conditional)
`handoff/decisions-2026-10-17-claude-reply-answers.md` §3 approves merging PR #59 (`staging/ready-line` → `main`)
**if and only if it is complete and meets the standard, including Claude's own.** A run may do this merge only
when ALL of these hold for one exact commit (the "candidate"):
1. **Independent review.** The run doing the review wrote none of the candidate's changes to `docs/`, `tools/` or
   `framework/`. It reviews the whole site diff `origin/main...candidate` against `reviews/REVIEWER.md` §3–§4 and
   writes the report to `handoff/replies/` with zero open findings and zero NEEDS CARTER items. Anything it finds
   is fixed in a later run and then reviewed again by a different run.
2. **Every GitHub check on the candidate is completed and green**, Lighthouse included. A cancelled or flaky check
   is re-run and waited for; it is never assumed green.
3. **The local checks pass**:
   - full build order;
   - `review-checks.js --base origin/main --build`;
   - every verify script and test;
   - a headless phone-size check of every changed page and game.
4. **Nothing in the site diff needs a separate approval**: no new chapter, room, game or feature; no cleared
   pending tag; nothing religiously sensitive.
5. **Commits after the candidate touch only `handoff/`.** Anything else means a new candidate and a new review.

Then:
- merge by fast-forward;
- watch the deploy finish;
- open the changed live pages on getconexto.com to confirm;
- update `handoff/CURRENT.md`;
- notify Carter in plain words.

If any condition fails, do not merge: say in STATUS what is still missing and keep working.
This is the only merge any run may do. Every later merge needs a new go-ahead from Carter.

## Never, in any run
- Merge (except the single Item 21 merge above), push to `main`, or change the live site.
- Delete files, branches or data without Carter's go-ahead (moving into `_to_delete/` is fine).
- Publish or clear content, or add new features, games or rooms without approval.
- Touch money, accounts, credentials, DNS, the domain or Cloudflare.
- Build parked or on-hold items.
- Open any file named `KEY.md`.
- Write model names in files or commits.

## Carter's controls (phone)
- **Pause:** tell Claude "halt the loop". That adds `handoff/HALT`.
- **Resume:** "resume the loop". That removes it and starts a run.
- **See where it stands:** `handoff/replies/STATUS.md`. Muse reads the same file.
