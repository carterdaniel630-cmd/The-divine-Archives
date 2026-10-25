# 2026-10-25 ~17:50 UTC — build loop: PR #53 brought up to main, Göbekli Tepe wording fixed; #86 waits on Lighthouse

## #86 (approved, `decisions-2026-10-25-pr86-go.md`)
Head still `3785b2b` (= approved head; `main` `45d4a95` is its ancestor; site diff `games.css` +8, the reviewed diff).
GitHub checks on `3785b2b`: runtime ×2, test, checks, guard all **success**; **Lighthouse run 194 is `pending`** (queued
behind the older Lighthouse run 193 on `cbf6f1e`, in progress since 17:30). Not merged: Carter's rule is all-green
including Lighthouse. Lock not held while waiting. Next run: if run 194 is green, re-run local checks on `3785b2b`
and fast-forward `main`; if it is still queued, the old run 193 may need cancelling (it is on a superseded head).

## #53 (Pilgrimage batch 1), item 1e (`decisions-2026-10-25-cleanup.md` C)
- Merged `main` `45d4a95` into `claude/project-thread-s3qxre` (no rebase, no force). Conflicts only in generated
  `framework/registry/{index,source,waypoint}.json` (rebuilt by `build-entity-registry.js`) and `handoff/CURRENT.md`
  (main's copy kept). New head **`befb607`**.
- Göbekli Tepe, the audit's open point (`reviews/2026-10-25-audit.md`): "the oldest known megaliths" was in neither
  cited source. Now "among the earliest known monumental architecture" on the opening card (`site.js`), the list blurb
  (`pilgrimage-data.js`) and the built page. Sources opened this run:
  - UNESCO, https://whc.unesco.org/en/list/1572, criterion (ii): "one of the first manifestations of human-made
    monumental architecture"; megalithic structures 9,600–8,200 BCE.
  - DAI, The Tepe Telegrams FAQ, https://www.dainst.blog/the-tepe-telegrams/faq/ : "the earliest yet known
    monumental architecture constructed by humankind".
  Both quoted on the card's source line and logged in `sources/pilgrimage-gobekli-tepe.md`. Nothing else changed;
  preview, noindex and pending tags unchanged.
- Local checks on `befb607`: full build order (+ sky) leaves 0 changes; 17/17 `verify-*.js`; 42/42 framework tests;
  `review-checks.js --base origin/main --build` 9 passed, 0 warnings; headless 4 sites × 360/390 px phones: no
  script errors, no sideways scroll, new wording present (the one console error per page is an outside resource the
  sandbox proxy blocks). GitHub checks were starting at write-up.
- **Still missing for #53:** an independent review by a run that wrote none of this (this run did the fix), then
  GitHub checks green, then one yes/no to Carter. The PR is still a draft.

## Slip to record
The merge commit `befb607` ends with a co-author line naming the model, which the loop's rules forbid in commits.
It is on a branch this loop did not create, so it is not rewritten (no force-push). Handoff commits keep to the
session-link line only.
