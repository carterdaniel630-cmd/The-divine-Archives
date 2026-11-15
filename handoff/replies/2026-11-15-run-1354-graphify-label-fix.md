# Loop run 2026-11-15 13:54 UTC — graph workflow fix (PR #150)

Session ..01HFWzToKKSgmRHB4QQzjDLd. Item: STATUS → Next 0ed (1), **Graph workflow fix** (value: tooling; no Carter approval needed to build).

## Cause
The "Knowledge graph (graphify)" job `graph` has exited 1 on every `main` push since 2026-11-14 (runs 97–101, latest 43717737070 on `7b9ba66e`), so the published `graph` branch is stale.
The failing command is the last line of "Build the code graph": `node tools/graphify-label.js graphify-out` printed
`named 293 communities; 293 unnamed left in graph.html` and set exit code 1.
The code map passed 5,000 nodes (6,189), so graphify 0.9.85 writes its **aggregated** graph.html: one node per community, and each such node carries the name in `community_name`, `label` **and `title`** (hover text). The label script renamed only the first two.

## Fix
`loop/graphify-label-title` **`11f96187`** (one commit on `main` `7b9ba66e`), **PR #150**. One regex in `tools/graphify-label.js` now renames `community_name|label|title` with the same rule (only exact `"Community N"` values whose N has a name). No `docs/`, no site change.

## Verified
- graphify 0.9.85 installed offline from `graph-tools`; extract + cluster-only on `main` reproduced the failure (292 left, exit 1). With the fix: 0 left, exit 0.
- All 292 aggregated nodes: id = community, label = title = community_name (script check).
- graph.html inline scripts parse. (Locally the page can't load vis-network from unpkg; same before and after the fix, so not caused by it.)
- `node --test framework/test/*.test.js` 51/51; 18/18 `tools/verify-*.js`; `review-checks.js --base origin/main` 9 passed / 0 failed / 0 warnings. Full build not re-run: no site file changes (`--build` skipped for that reason).
- PR #150 changes `tools/graphify-label.js`, which is in the workflow's `pull_request` paths, so the graph job runs on the PR as a live check.

## Merge
**Per item** (tooling change; not on an approved audit list, not a typo/label fix). Still needed: an independent review by a session that is NOT ..01HFWzToKKSgmRHB4QQzjDLd; GitHub green on `11f96187` incl. the graph job; Carter's yes.

## Note
The commit trailer uses "Claude" without a model name (loop hard limit).
