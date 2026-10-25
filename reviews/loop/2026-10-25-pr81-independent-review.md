# PR #81 independent review: Qumran guided walk leaves Cave 4 — 0 open findings

**When:** 2026-10-25 ~10:43–11:00 UTC, build loop. **By:** a run that wrote none of #81 (and none of #68).
**Candidate:** `loop/qumran-walk-4b` @ `2c099a0`. **Own diff checked:** `dd98586..2c099a0` (1 file, +2 lines).
**Checklist:** `reviews/REVIEWER.md` §3–§4.

## In plain words
The fix works. On the live site, pressing "Walk on" at Qumran gets stuck in Cave 4's inner room. With #81 it carries
on through Cave 1 and ends in Cave 3, both with and without reduced motion. No wording, sources or pictures change.

## What was checked
- **Stack shape.** `origin/main..dd98586` is byte-identical to #68's own reviewed diff (`merge-base..c4e5141`), so the
  branch is exactly #68 + `main` `c957af5` + one Qumran commit. Nothing else rides along.
- **The change.** Three route points with `stop: false` in `docs/pilgrimage/sites/qumran-caves/site.js`, from 4b back
  west through the low passage (z = C4.z + 0.35), across 4a, to 4a's mouth stop. One comment line. No claim, date,
  name or source touched, so §4 items 1–5 have nothing to check (pass). §4.6: Qumran is not a restricted or
  secret-sacred site and no image or model changes (pass).
- **Automatic checks, clean copy of `2c099a0`:** `review-checks.js --base origin/main --build` 9 passed, 0 failed,
  0 warnings; build left the tree clean (output current); 17/17 `tools/verify-*.js`; `node --test` 42/42.
- **Own headless test** (`walk.js`, written for this review; phone 390×844, touch): pressed "Walk on" until the walker
  stopped moving (a loop would show as 80 presses).
  | Copy | Motion | Presses | Ends in | End point |
  |---|---|---|---|---|
  | `main` `c957af5` | reduced | 10 | II · Cave 4 (4b) | 303.6, −1.1 |
  | `main` | normal | 10 | II · Cave 4 (4b) | 303.7, −1.1 |
  | #81 | reduced | 15 | IV · Cave 3 | 499.45, 0.23 (route end 499.4, 0.3) |
  | #81 | normal | 15 | IV · Cave 3 | 499.5, 0.15 |
  Defect reproduced on `main`, gone on #81; the walker reaches the route's last point. The other five sites on #81
  (reduced motion) all come to rest without looping; 0 script errors on all six.
- **GitHub:** 10/10 checks on `2c099a0` completed green, Lighthouse included (finished 10:51).

## Findings
None open.

## What it still needs to go live
#68 on `main` first (it waits on Carter's yes), then Carter's yes for #81. Once #68 is merged, #81 fast-forwards if
`main` has not moved in between; otherwise bring it up and re-run checks.
