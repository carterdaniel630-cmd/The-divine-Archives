# Reviewer and auditor, option A, folded into the loop — 2026-10-25 ~02:07–02:18 UTC (build loop)

**Item:** STATUS Next 0, Carter's ruling `decisions-2026-10-24-batch-six.md` 4: "Reviewer and auditor: option A. The
build loop does their saving." Chosen because PR #67 (Next 1) still had Lighthouse running when this run started
(01:50 start), #75/#76 sit under the chat session's claim, and #77 waits on Carter. Items per run: 1.

## What was done
- **A chat session folded the same ruling into `LOOP.md` step 7 at the same time** (`2026-10-25-bottlenecks-stack-and-option-a.md`).
  This run's push was refused as out of date, so it merged the two texts into one paragraph in step 7 rather than
  adding a second rule. The merged rule: every independent review the loop writes is also filed on `review-log`
  (verbatim copy in `reviews/loop/`, a verdict line in a dated index in the reviewer's report shape, one line in
  `reviews/runs.md`). The weekly audit (first run on/after Wednesday, or whenever none is dated in the last 7 days) is that run's item (value 6): the blind re-review and scorecard of
  `reviews/AUDITOR.md` §2 and §4. The monthly planted-error test is **not** done by the loop, because scoring it means
  opening `KEY.md`, which no run ever opens.
- **Back-filled `review-log`** (`eaf6436`): all 16 loop independent reviews from 2026-10-17 to 2026-10-25 copied
  unchanged into `reviews/loop/`, indexed in `reviews/2026-10-25-loop-reviews-catchup.md` (15 passed with 0 open
  findings, 0 fixed, 2 need Carter, both already answered), and one `runs.md` line. Only additions; nothing on
  `review-log` changed or removed. `main` untouched.

## Checked
- The auditor's own sampler (AUDITOR.md §2a) reads the new index: 15 ids found, sample drawn (seed `test`: site:pr71,
  site:pr77).
- Commit SHAs and findings in the index taken from each report's own header; the two "need Carter" lines match the
  reports (Tjurunga wording point, Pantheon `ra` re-clear).
- No site file changed on any branch: `staging/ready-line` diff is `handoff/` only; `node --test framework/test/*.test.js`
  42/42.
- Not changed: the reviewer and auditor scheduled tasks themselves (still enabled; the ruling did not ask to switch them
  off) and `reviews/status.json` (still says auto-pass on from 2026-10-11; only an audit may change it).

## Also seen this run
- Carter's 02:08 answers (`decisions-2026-10-25-hero-show-me-and-75.md`) folded into STATUS and MERGEABLE: #77 show me
  first (not merged); #75 the loop may merge, after #67 and #76.
- PR #76 on `be51670`: 8/8 checks shown green, no Lighthouse run listed yet.
- **PR #67: all 8 GitHub checks green on `c957af5`**, Lighthouse finished 02:10 UTC. It now meets every merge condition
  except the merging run's own local re-check. The next run (which wrote none of #67) should merge it.
