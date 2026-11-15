# Independent review — PR #150, graph workflow fix (2026-11-15 ~16:30 UTC)

**Verdict: PASS, 0 findings.**
- **Candidate:** `loop/graphify-label-title`. Reviewed at `11f96187`, then re-synced onto `main` `ef7e4d30` as **`0c807f9c`**: a mechanical merge whose diff against `main` is byte-identical to the reviewed one.
- **Reviewer:** session ..01HFWzToHU52frgsDom5N2UW. It wrote none of the fix; the builder was ..01HFWzToKKSgmRHB4QQzjDLd.
- **Against:** `reviews/REVIEWER.md` §3–§4. This is a tooling-only change, so §4's content items (accuracy, lenses, tiers, sensitivity) do not apply.

## The change
One regex in `tools/graphify-label.js`. It now renames `"title": "Community N"` as well as `community_name` and `label`, with the same rule as before: only exact `"Community N"` values whose N has a name. There are no `docs/`, content or workflow changes.

## Checks
- **The cause, reproduced.** The graphify CLI was installed in this session. On `main` `ef7e4d30`, `graphify extract . --code-only` followed by `graphify cluster-only . --no-label` gives an aggregated view (more than 5,000 nodes), and then:
  - `main`'s script: `named 297 communities; 297 unnamed left`, exit 1, which is the failure seen on `main`;
  - the fix's script on the same output: `0 unnamed left`, exit 0.
- **What the fix renames.**
  - All 297 `"title": "Community N"` values are renamed. The other 659 `title` fields in the page are untouched, and the line count of graph.html is unchanged.
  - Both inline scripts in graph.html still parse.
- **The PR's own graph job:** green, with its log reading `named 293 communities; 0 unnamed left in graph.html`. All checks on `11f96187` are green: checks, graph, guard, runtime ×2, tools.
- **Lighthouse:** it does not run on a tools-only change, by the workflows' path filters. It has no page to measure, so there is no Lighthouse result to wait for.
- **Local, on `0c807f9c`:** review-checks 9/0/0; verify 18/18; tests 51/51. No `--build`, because no site file changes.
- **Edge case considered:** in the non-aggregated view (5,000 nodes or fewer), a node `title` would be renamed only if it were exactly `"Community N"`. Code symbols do not take that form, so I see no risk.

## Merge
**Per item.** It is a tooling fix, not on an approved audit list, and not a typo, label or honesty fix. It still needs:
1. GitHub green on `0c807f9c`, which runs on push;
2. Carter's yes.

Once merged, the next push to `main` publishes a fresh code map. The current map is stale at `a5256e3`.
