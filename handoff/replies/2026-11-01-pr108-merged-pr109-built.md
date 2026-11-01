# 2026-11-01 ~22:40 UTC — Loop run: PR #108 merged (class (b)/(c)); PR #109 built (fix batch item 6, state resets)

Run: session ..WzTpAhoVEY9mHq6DBzuy (chained run; the payload's #107/#108 items had already been done by this same
session at 22:16–22:20).

## PR #108 — MERGED
Lighthouse on `8634b5e` green at 22:27 UTC; all 7 checks green. Independent review PASS 0 findings (this session,
which wrote none of it; `2026-11-01-pr108-independent-review.md`); local checks green on `8634b5e`. Class (b) approved
fix batch item 5 / (c) honesty wording. `main` `4bb3d40` → **`8634b5e`** by fast-forward ~22:35 UTC. **Deploy 236 green.**

Record note: #108's commit message (written by its builder) carries a model name in its co-author line, against the
"no model names in commits" rule. It is on `main` now; history is not rewritten (Carter's 2026-10-31 no-rewrite
ruling). Builders: use a plain "Claude" co-author line.

## PR #109 — built (fix batch item 6 + inspection supplement A7)
`loop/state-resets` **`c4d1ce8`**, parent = `main` `8634b5e` (fast-forward). Every defect reproduced headless on
`8634b5e` first, then shown fixed:

| Defect | Before | After |
|---|---|---|
| Examined object's dialog name (museum) | the previous card's title ("About this sky"); 2 ids `mu-card-h` | its own heading; 1 id |
| Lion Man hover, then Venus of Willendorf opened | tag "E The Lion Man…" over Venus | hidden while examining; back after close |
| Rotunda guide after choosing Giza | "Sky over Babylon" | "Sky over Giza" |
| Sound off in museum → Stonehenge | on | off; on at the site → on back in the museum |
| Qumran: About card, then Book of Enoch (Pilgrimage inspector) | "How close is this to the real thing?" | "The Book of Enoch" |

Cause of the wrong titles: the inspector panel (`inspect.js`, shared by museum and Pilgrimage) was labelled by
`#mu-card-h`, but the card's stale heading with that id sits earlier in the page. The panel now owns `mu-insp-h`
(renamed on open and on later rewrites, e.g. walkthroughs). Sound: one shared `da-snd` key, old keys read until set.
Cache versions bumped (app 46, inspect 11, sound 2 ×2, engine 8; site pages rebuilt, arcade page by hand).

Checks: full build order; review-checks `--base origin/main --build` 9/9 PASS; every `verify-*` pass; tests 42/42;
headless 360/390 px 0 page errors, no sideways scroll. Seen, not in scope: on a phone the inspector toolbar sits over
the site's header text (same on `main`) — for the detail pass.

**Needs:** independent review by a run that wrote none of it; GitHub green incl. Lighthouse; class (b).
Not subscribed to PR activity from this session: the loop's later runs own review and merge, under the lock.

## Carter's sitemap ruling (arrived 22:25 UTC)
`decision-2026-11-01-sitemap-noindex.md`: public pages in, deliberately hidden pages out. That matches the built
`loop/sitemap-coverage` (Museum + 10 open walks in; previews, Keeper, Arcade, search/random/templates out): 11 pages,
not the 20 the walk counted (the other 9 are the hidden/utility pages the ruling keeps out). Folded into Next: re-sync,
PR, independent review, merge per item.

graphify CLI missing this run; not used.
