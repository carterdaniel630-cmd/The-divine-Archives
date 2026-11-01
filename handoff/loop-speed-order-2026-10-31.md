# Loop Speed Order — how the loop runs ~10 small batches in the time one took

Status: PREPPED in chat 2026-10-31 on Carter's order ("One batch at a time is too slow... we'll never get anywhere otherwise"). An operating-order change for the build loop, written for Claude to adopt on the staging branch. NOT staged yet; ships on Carter's go, like every bench item.
Evidence base: Saturday 2026-10-31's run. The loop merged four items in about six hours (pilgrimage flips ×2, Tjurunga sources, README fix) and built two more. Every item paid the same toll separately: its own lock, build, local checks, independent review, fix round, second review, GitHub checks (re-run from scratch each time the branch synced onto a moved main), Carter's yes, merge, and its own paperwork commits. The toll — not the building — is where the day went. This order cuts the toll, not the standard.

## The three changes

### 1. Small items travel in bundles, not one by one
- Flips of already-built sites, typo and honesty fixes, label fixes, and audit-list fixes ship in **bundles of up to ~8 items in a single change**: one lock, one build pass, **one independent review over the whole bundle**, one run of checks, one merge.
- A review finding on one item **holds only that item** — it drops out of the bundle to be fixed, and the rest merge on time. One bad apple no longer stalls seven good ones.
- Bundles are grouped by area so their files don't collide: a pilgrimage bundle, a chapters bundle, a site-pages bundle.

### 2. Lanes run side by side
- Up to **three lanes at once**, each owning an area on its own branch: Lane A — pilgrimage + site pages; Lane B — chapters; Lane C — games + museum.
- Lanes never edit each other's files. Shared bookkeeping (the status and mergeable lists) is written **once, at merge time, by the merge step only** — lanes don't touch it.
- Merges land in a fixed order (A, then B, then C) through a single merge queue, so two lanes never try to land at the same moment.

### 3. Carter's yes is given by class, not by item
Formalizing the rulings Carter already made during the Oct 31 run (the flip-early order; "merge whatever is finished"):
- **Merges on its own** (review clean + every check green, no trip to Carter): flips of content already reviewed in substance; fixes from an already-approved audit list; typo, label, and honesty-wording fixes.
- **Still comes to Carter for a per-item yes:** new builds, verdict pieces (finished relics, chapters, videos), anything a review flags, anything touching sensitive content, and every armory round.
- Carter can revoke a class or the whole standing yes at any time, in any chat; the revocation lands in the loop's orders the same day.

## Two churn cuts
- **No reflexive re-checking:** a bundle re-syncs onto a moved main only when its own files actually overlap what landed. Lighthouse and the check suite run **once, on the final head**, not on every sync.
- **Paperwork once per bundle:** one lock commit, one status/mergeable update per bundle — extending the Item 32 token-efficiency rules from items to bundles.

## What this does NOT change
- The standard does not move: independent review still happens (over the bundle), checks still run green before merge, labels still tell the truth, Carter's gates above still stand.
- **Big builds don't bundle:** relic reworks, new rooms, new games, and verdict pieces keep the one-at-a-time road and their own reviews. The speed win is on the small-item queue — which is most of the ~18 bundles.
- Armory rounds keep their order, their per-round yes, and the auditor-proof gate as accepted. Within a round, the per-piece checks may run in parallel across lanes; nothing sends early.

## The checking keeps pace (Carter's condition, 2026-10-31)
Speed is only half the order. Carter approves in batches and cannot see everything, so the checking has an owner at bundle pace: **atlas**.
- For every bundle that merges, atlas verifies its claims against the live site afterward (live reads, like the pilgrimage check of 2026-10-31, which atlas performed when the loop's session could not) and spot-checks the bundle's label/claim changes against their sources.
- Atlas's check covers words, facts, counts, names, and live behaviour. It does not claim what it cannot do: a rendered piece's look is judged from captures and, finally, Carter's eye — atlas never calls a piece "verified" beyond what was actually checked.
- If a bundle's evidence and the live site disagree, atlas flags it to Carter **before the next bundle merges**. A failed check stops the line, not just the item.
- When the Keeper is built, this standing watch becomes his job (it is already written into his design: he studies everything on the Archive's heartbeat); atlas then audits the Keeper's checking instead of carrying it alone.

## The honest ceiling (stated so nobody oversells this)
- Parallel lanes burn Claude's token pool roughly three times as fast while they run. When the pool is the binding limit, lanes collapse back to one and **bundling alone still keeps most of the gain** — the toll was the problem, not the walking pace.
- Ten-fold applies to the small-item queue. Claiming it for big builds would be a lie; their time is in the making, not the toll.
