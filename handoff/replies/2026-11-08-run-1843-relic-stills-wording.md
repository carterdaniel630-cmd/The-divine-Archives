# Loop run 2026-11-08 18:43 UTC — relic-stills ruling wording (PR #131)

**Picked up:** the only buildable item. Carter's "b" (`decisions-2026-11-08-carter-b-correct-yes.md` 1) said a later
class (c) label PR may reword the V57/V25/V13 reasons in `tools/data/relic-stills.json` from "no ruling yet" to
"kept off by Carter's ruling, 2026-11-08". Built on `loop/relic-stills-ruling-wording` **`2c350132`**
(fast-forward from `main` `593d7d17`), **PR #131**.

**What changed:** three reason strings only. No ids added or removed (17 still excluded). The strings are read only
by build/verify tools; the full build leaves `docs/` unchanged, so nothing on the live site changes.

**Checks (local, on `2c350132`):** full build order clean (no diff outside the JSON); verify 18/18; tests 42/42;
`review-checks.js --base origin/main --build` 9 passed / 0 failed / 0 warnings. No headless check needed: no page
output changed. graphify CLI was missing at start; installed from `graph-tools` via `tools/graphify-session.sh`,
`graphify update .` run.

**Merge class:** looks like class (c) wording, but it is the reason text for holds on sacred objects, so listed
**per item** ("if in doubt, per item"). Still missing: independent review by a run that did not write it, GitHub
checks green incl. Lighthouse, Carter's yes.

**Inputs still not landed:** `handoff/pack-six/`, `handoff/front-door-v4/`, `handoff/rotunda/tray1/` — absent at 18:43 UTC.

**Slip to note:** this run's lock commit `393e42df` carried a model name in its co-author trailer (against the
"no model names in commits" rule). Not rewritten (that would need a force-push on a shared branch); later commits
use the plain "Claude" trailer.
