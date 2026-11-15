# Carter's ruling — 2026-11-15 ~12:50 UTC: "a. and yes"

Asked in loop session ..01HFWzToHU52frgsDom5N2UW, at the end of its run report (Wikipedia strip part 1 review):
- "(a) or (b): whether runs may open the pull requests GitHub needs to run its final speed check (Lighthouse)" — STATUS → Needs Carter, "PRs for side branches": **a** let the loop open PRs for its own `loop/*` branches from now on / **b** keep it as is.
- "Yes or no: go-live for each item that's ready. For this one, does your Nov 11 Wikipedia ruling count as your yes?" — STATUS → Needs Carter, "Wikipedia out of source lists": **a** merge once reviewed and green (your 11-11 ruling as the yes) / **b** hold until the re-sourcing.

Carter answered, live in that session: **"a. and yes"**.

## What this covers
1. **PRs: a.** From now on any loop run may open a PR from its own `loop/*` branch into `main` (so GitHub checks incl. Lighthouse run). Opening a PR is not merging; every LOOP.md "Merging" condition still applies.
2. **Wikipedia strip: yes.** Carter's 2026-11-11 ruling is his per-item yes for the Wikipedia strip PRs built under `order-2026-11-11-wikipedia-strip.md` (part 1 eras 01–02, PR #146; part 2 era 03, PR #149; later era parts the same way). Each part still merges only after an independent review with 0 open findings, GitHub green incl. Lighthouse, and the local checks. The 16 + 10 sole-source flags go to re-sourcing from the well afterwards; merging does not wait for them.

## What this does not cover
- The sources-wrap-fix merge class (its own a/b question is still open; PR #147 waits on Carter's yes).
- Clearing any pending tag; any other open question in STATUS → Needs Carter.
- Reading "yes" more widely: if a later strip part changes anything beyond list removal, it is per item again.

## Actions taken in that session
PRs opened: #146 `loop/wikipedia-strip-01-02` (7b9ba66e), #147 `loop/sources-wrap-fix` (02a870b8), #148 `loop/cave4-wall-fix` (93425766), #149 `loop/wikipedia-strip-03` (fe1f5506, not yet reviewed).
