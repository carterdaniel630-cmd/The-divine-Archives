# The build loop — continuous pickup (Carter 2026-10-17)

Carter's ruling, 2026-10-17 16:30: "automate it, but it should be a loop … as soon as one thing is done, the
other thing is picked up … there should be no downtime in terms of waiting."

Every run of the scheduled task **Divine Archives build loop** follows this file. Each run is a fresh session
with no memory of the last one: the repo is the memory.

## One run, start to finish
1. **Attach and clone** `carterdaniel630-cmd/the-divine-archives` (push access), branch `staging/ready-line`.
   Read `CLAUDE.md`, then this file.
2. **Halt check.** If `handoff/HALT` exists, stop at once: no writes, no next run.
3. **Lock check.** If `handoff/loop/LOCK` exists and its timestamp is under 90 minutes old, another run is working:
   stop, with no next run. Older than that is stale: overwrite it. Otherwise write `handoff/loop/LOCK` (current
   time, one line), commit and push it. If the push is rejected because someone pushed first, pull and re-check.
   **Never hold the lock while waiting** (for CI, Lighthouse, Carter or anything else). The 2026-10-17 stall came
   from a run that waited holding the lock and then ended, so later runs stood down for hours. If your item has to wait:
   - write what it is waiting for in STATUS;
   - release the lock;
   - go on to the next highest-value item, or chain.
   A later run picks the waiting item back up once its condition is met.
4. **Read the queue, newest first:**
   - `handoff/manifest-v2.md` and any Items added since `handoff/replies/STATUS.md` was last written;
   - Carter's rulings: every `handoff/decisions-*.md`, and especially any committed after STATUS was last written.
     Fold their actions into STATUS → Next so the ruling is never lost when STATUS is overwritten;
   - `STATUS.md` → Next;
   - `handoff/claude-ready-line.md` order.
   Newest Carter ruling wins. Pickup order every time: finish anything in progress → audit → fold → rebuild better.
5. **Do ONE bounded item**: the highest-value item in Next that needs no Carter approval to do, ranked by
   `handoff/decisions-2026-10-17-priority-by-value.md` (Carter: "priority … most high value outcomes"), not by
   list order. Keep STATUS → Next sorted by that value. Bounded means about one
   PR's worth of work, correct and verified. A smaller correct piece beats a larger unverified one. Gated items
   (below) can still be prepared: research, drafts, specs. Only the gated action itself waits. Before touching code, follow Graph refresh below — never work from a stale map.
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
   **Reviewer and auditor saving (Carter's option A, `decisions-2026-10-24-batch-six.md` 4):** the scheduled reviewer
   and auditor save nothing themselves, so the loop does it.
   - **Every independent review** a run writes is also filed on the `review-log` branch: the report copied unchanged
     into `reviews/loop/`, its verdict line (id `site:pr<N>`, branch@sha, findings, path of the copy) under PASSED /
     FIXED / NEEDS CARTER in a dated index `reviews/YYYY-MM-DD-loop-<topic>.md` with `Batch:`, `Reviewed:`, `Covers:`
     and `Summary:` lines (the shape of `reviews/REVIEWER.md` §7, so the auditor's sampler reads it), and one line
     at the end of `reviews/runs.md` (`YYYY-MM-DD HH:MM UTC reviewer loop <PR> <passed/fixed/need Carter>`). Push
     `review-log` (never `main`) and confirm with `git ls-remote`. Back-filled 2026-10-25:
     `reviews/2026-10-25-loop-reviews-catchup.md` (16 loop reviews, 2026-10-17 → 2026-10-25).
   - **The weekly audit:** the first run on or after each Wednesday (or any run, if no `reviews/*-audit.md` is dated in
     the last 7 days) does `reviews/AUDITOR.md`'s weekly steps, by a run that wrote none of the sampled items: the
     blind re-review of §2 (sample drawn before reading verdicts), coverage of PRs merged since the last audit, and the
     scorecard and report of §4, saved the same way. It counts as that run's one item (value 6, after live-site
     merges). The monthly planted-error test (§3) is **not** done by the loop: scoring it means opening `KEY.md`, which
     no run ever opens. While no test batch is scored, say so in the report; change `reviews/status.json` only as §4b allows.
   **Claims:** a chat session working beside the loop writes `handoff/loop/CLAIM-<what>.md` (time, what, which
   branches to leave alone). It is not a lock: runs keep working, but skip that item and don't push to the branches it
   names until the file is gone. A claim over 3 hours old is stale.
8. **Chain.** If `STATUS.md` → Next still has an item that needs no Carter approval, start the next run right
   away (fire this same scheduled task). Do not wait for the hourly backstop.

## Graph refresh — every run, every commit (Carter 2026-10-17)

The code map must always match the code. A stale map is not acceptable.

- **Every run, at run start** (after attach/clone): run `graphify update .`. That is incremental — it re-extracts only new or changed files, so it is cheap. The session's local `graphify-out/` then matches its checkout.
- **Freshness check.** If `graphify-out/` is missing, or the checkout is newer than the local map, run a full `graphify extract . --code-only` plus `graphify cluster-only . --no-label` before touching code.
- **If the CLI is missing:** SessionStart already tried to install it (see `tools/graphify-session.sh`). If it still cannot be installed, read `graphify-out/GRAPH_REPORT.md` for the code map and say so in STATUS — do not pretend the live query tools worked.
- **Every commit that changes code** is picked up by the next run's refresh. No separate publish step per commit.
- **Published graph.** `.github/workflows/graphify.yml` rebuilds the published graph on push to `main` and publishes it to the `graph` branch. On push to `staging/ready-line` or `loop/*` branches it builds the graph as a check (artifact upload, no publish), so a broken graph is caught before it reaches main.
- **Never open any file named `KEY.md`.** (Also in Never, below — repeated here because the graph tools must never index answer keys.)

## When the loop stops by itself (and tells Carter)
- Everything left in Next needs Carter's approval. Write the batch of decisions in `STATUS.md` → Needs Carter, send
  one notification, and do not chain. The hourly backstop then only checks for a new Carter ruling or Muse item,
  and starts work only when one exists.
- The same item fails verification in two runs in a row. Stop, describe it in STATUS, and notify.
- `handoff/HALT` exists.

## Merging (Items 22 and 25: per item, Carter approves each one)
PR #59 (site batch A) was merged on 2026-10-17 under Items 21/24. From now on a run may merge an item only when
ALL of these hold for one exact commit (the "candidate"):
0. The item is listed as mergeable in `handoff/replies/MERGEABLE.md`, AND Carter's yes covers it in one of two ways:
   - **per item:** a Carter approval for **that specific item** is recorded in a `handoff/` decisions or order file; or
   - **by class** (Carter's "b", 2026-11-01, `decisions-2026-11-01-carter-b-a-a.md` 1, adopting
     `loop-speed-order-2026-10-31.md` §3): the item is only (a) a flip of content already reviewed in substance,
     (b) a fix from an audit list Carter already approved (e.g. `audit-fixes-2026-10-25.md`), or (c) a typo, label or
     honesty-wording fix. Say in MERGEABLE which class and why.
   **Never by class, always per item:** new builds (chapters, rooms, games, features, exhibits, pages), verdict pieces
   (finished relics, chapters, videos), anything a review flagged that went to Carter, anything religiously sensitive or
   touching a sacred object or restricted site, every armory round, and clearing a pending tag. If in doubt, it is
   per item. Carter can revoke the class yes at any time; a revocation in any `handoff/` file wins at once.
   A general "merge as we go" is still not approval.
1. **Independent review.** The run doing the review wrote none of the candidate's site changes (`docs/`,
   `tools/`, `framework/`, `.github/`). It reviews `origin/main...candidate` against `reviews/REVIEWER.md` §3–§4,
   with zero open findings, and writes the report to `handoff/replies/`.
2. **Every GitHub check on the candidate is completed and green**, Lighthouse included. A cancelled or flaky check
   is re-run and waited for; it is never assumed green. Wait without holding the lock (step 3).
3. **The local checks pass**:
   - full build order;
   - `review-checks.js --base origin/main --build`;
   - every verify script and test;
   - a headless phone-size check of every changed page and game.
4. **Nothing in the site diff needs a separate approval**: no new chapter, room, game or feature; no cleared
   pending tag; nothing religiously sensitive.
5. **Commits after the candidate touch only `handoff/`.**

Then:
- merge by fast-forward (rebase the item's branch onto `main` first if needed, and re-run checks 2–3 after a rebase);
- **several approved items waiting at once:** stack them (merge each branch into the next with a merge commit, in
  the order they'll go live) so every candidate already contains the ones before it. Then checks run once per head
  and the items fast-forward back to back, instead of each merge sending the rest back for a fresh sync and another
  full round of checks. The stacking merge must add only already-reviewed diffs; say so in the reply;
- watch the deploy finish;
- update `handoff/CURRENT.md`;
- move the item to "Merged" in MERGEABLE;
- notify Carter in plain words.

If any condition fails, do not merge: write in MERGEABLE what is still missing and keep working other items.

## Never, in any run
- Merge anything except as "Merging" above allows; push to `main` other than that fast-forward; or change the live site any other way.
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
