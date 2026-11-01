# PR #105 independent review — museum wing guide buttons IV / VI / VIII (museum fix batch item 1)

**Verdict: PASS, 0 findings.** id `site:pr105`, `loop/museum-wing-buttons` reviewed at `e151079`, re-synced with
`main` `7d75e30` as **`6ee2150`** (merge commit adds nothing: `origin/main...6ee2150` is the same 3-file diff).
Reviewer: build loop run 2026-11-01 ~19:00–19:40 UTC. This run wrote none of the candidate's site changes (built by
session ..WzTkijWpXHy48tH7tkJt); its only commit on the branch is the sync merge of `main`.

## What changed (3 files, +8 −3)
- `docs/museum/secret.js`: the archway's step-through test gets a far limit. `s = (pos.z − at.z) · nz` is the
  distance out from the wall into the archway's own hallway; it now fires only for `−0.25 < s < 0.85` (was
  `s < 0.85`, with no far limit, so every point at the same x behind the wall's line counted).
- `docs/museum/app.js`: `secret.js?v=3` → `?v=4`. `docs/museum.html`: `app.js?v=40` → `?v=41`. The cache-bust chain is
  complete (no other file imports either module).

## Correctness (REVIEWER.md §3)
- **Cause matches the bug.** The Room guide lands every east wing at x 5.5 (`__MU.state()` after each button: Wings
  II/IV/VI/VIII all at x 5.50). An archway found on the Wing II hallway's north wall near x 5.5 has `nz = +1`; Wings
  IV (z −92), VI (z −124), VIII (z −156) give `s` of −30, −62, −94: all `< 0.85`, so the old test fired.
- **The new near limit cannot be reached from behind.** The archway's `at.z` is the panel plane, 0.012 m in front of
  the wall face (`style.js` 614). Player radius is 0.3 (`app.js` 35) and `collide()` keeps the eye ≥ 0.3 from any wall,
  so a visitor on the far side is at `s ≤ −(0.012 + wall thickness + 0.3) < −0.31`, outside `−0.25`, whatever the
  wall's thickness. A visitor in front can reach `s ≈ 0.29`, inside the trigger band, so walking into the archway
  still works.
- The tap path (raycast on the archway's hit mesh, `secret.js` 204) is unchanged and needs the archway visible; not
  part of this bug.
- `A.fired` reset (`d > 1.6`) unchanged; behaviour on the near side unchanged.

## Hands-on browser walk (the order's requirement, and inspection A4)
Real Chromium (software WebGL), 390×700, `node tools/serve.js`, two builds side by side. The archway was put in
place the way the site itself remembers it after a visitor finds it (`localStorage "mu-arcade"`,
`{x: 5.5, z: −61.99, nz: 1}`: Wing II hallway north wall), loaded with the page so the archway is full-grown, then
the Room guide buttons were clicked and the page watched for 20 s after each arrival.

| Build | Wing II | Wing IV | Wing VI | Wing VIII | Rotunda → IV | III → VIII | 1.1 m in front | 0.55 m in front |
|---|---|---|---|---|---|---|---|---|
| `main` `7afab76` (before) | stays | **arrives, then sent to `/pilgrimage/arcade.html`** | (walk ended in the Arcade) | | | | | |
| PR #105 | stays | stays | stays | stays | stays | stays | does not go through | **goes through to the Arcade** |

Page errors on the PR build: 0. A first PR walk with a 6 s watch also passed every button, from every starting room
(Wing II, Wing III, Rotunda), and again after a reload with the archway remembered. Bug reproduced, fix confirmed,
the secret still works from in front.

Not covered: a real phone's touch walk (Carter's or atlas's eye is the final live check); finding the archway by
playing the wall game (the seeded state is what that game stores, so the trigger logic tested is the same).

## Checks
- Local on `6ee2150`: `review-checks.js --base origin/main --build` 9/9 PASS (full build order, output matches);
  every `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 42/42.
- GitHub on `e151079`: 7/7 green incl. Lighthouse (19:09 UTC). On `6ee2150`: started 19:34 UTC, **not yet complete** at review time (Lighthouse running).

## Merge class
**Class (b)**, a fix from a list Carter already approved: it is item 1 of the museum fix batch
(`order-2026-11-01-museum-fix-batch.md`, Carter "3. yes" 12:51 ET), a defect list from the 2026-11-01 walks. It adds
nothing, changes no content, nothing religiously sensitive or sacred, no pending tag; it narrows a trigger so the
hidden Arcade archway fires only where it was always meant to. Mergeable on GitHub green on `6ee2150`.

## Findings
None open. One note, not a finding: the 2026-11-01 inspection report called the misroute "intermittent"; the cause
explains it exactly (only visitors who had found the archway).
