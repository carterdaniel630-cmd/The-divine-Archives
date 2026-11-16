# VR loop — 2026-11-16 ~23:12 UTC: independent review of PR #174 (more creatures)

**Run:** scheduled VR loop run. No HALT/VR-HALT. Took VR-LOCK at 23:13 (the 21:13Z lock was stale, over 90 min; that
run pushed nothing). Built nothing new; merged nothing. This run wrote none of #174 (built by the 19:12Z run) and none
of #170, #169 or #166 beneath it. Folded `handoff/loop/CLAIM-vr-creatures.md` into VR-STATUS and removed it, as it asked.

## Verdict: PASS, 0 open findings
`loop/vr-creatures` `aadc971c` (#174's own delta is `loop/vr-react@fbc0d6f4..aadc971c`: 8 files, 213+/30-). Report
filed on `review-log`: `reviews/loop/2026-11-16-vr-creatures-174-independent-review.md`, index
`reviews/2026-11-16-loop-vr-creatures-174.md`, line in `reviews/runs.md`.

### Code (read in full)
- `world.js`: ENV ch02 adds `pkingfisher`, `butterflies`; ch03 swaps `tilapia` for `bunni`, adds `pkingfisher`,
  `dragonflies`. `marsh` ground gains `-0.18 * chan(...)` (a shallow channel). No other room's ENV changed.
- `fauna.js`: new `bunni` (FISH, no leap), `pkingfisher` (FLYER, `low`), `SHY.AIR = 4`, `airShy()`. Every new path is
  behind `A.feet`, so non-pilot rooms (ch04's kingfisher, ch05) behave as before. In `airShy` a flyer inside 4 m
  turns away (straight away, or up to 90° off along a wall) and a step that would not open the distance is refused,
  so the distance never shrinks; with nowhere open it hovers facing away. Targets are re-picked >= 5 m from the
  visitor (12 tries, then any). Low flyers at your feet keep between water+0.3 m and 1.1 m; insects at ground
  +0.25..0.95 m: below a standing visitor's eyes, as the review-169 note asked.
- `app.js`: cache bumps (world v8, fauna v7; the only two importers agree, so no double module load); `__MU.react`
  tags instanced flyers `air` so the test can tell them from fish. `museum.html` app.js v54.
- `tools/react-check.js`: adds "holds its creatures" and the bird/insect distance checks.

### Sources (`sources/museum-fauna-pilot.md`), checked this run
- Bunni endemic to the Tigris-Euphrates basin: FishBase summary 54811 fetched: "Asia: endemic to the Tigris-Euphrates
  basin"; freshwater, benthopelagic; max 42.7 cm TL. **Supported.**
- Tilapia not native to Iraq, records from 2007: the *Oceanological and Hydrobiological Studies* paper (download
  13500/12058/21775) fetched: "Reports of three tilapia species in Iraq's southern and central regions date back to
  2007"; reference entries for Saleh 2007, Mutlak & Al-Faisal 2009 ("exotic cichlids"), Al-Faisal & Mutlak 2015 match
  the log. **Supported.** (The paper itself places Saleh's record on the Euphrates in its text and the Tigris in its
  reference title; the code comment says only "first Iraqi records 2007-2015", which is safe.)
- Pied kingfisher range incl. north Egypt and Iraq: kuwaitbirds.org/node/639 fetched, wording matches. **Supported.**
- Pied kingfisher in Amarna's Green Room: Live Science and Gizmodo reports of Stimpson et al. 2022 (*Antiquity*) both
  name "pied kingfisher (Ceryle rudis)". The paper itself again could not be opened (this run's fetch of the
  Cambridge PDF was refused). phys.org's report says only "kingfishers". **Supported via two press reports; paper
  unread — the log already says so.** Note, not a finding.
- Plain tiger in Nebamun's fowling scene: Larsen, *Saudi Aramco World* Sept/Oct 1994, fetched: "He painted seven of
  them", the Common Tiger, "the earliest recognizable painting of a butterfly", "Some 3500 years ago". **Supported.**
- Odonata in the southern Iraqi marshes: BINHM 16(4):571-621 (2021) abstract fetched: 109 species, "Odonata with 29
  species", DOI as logged. **Supported.**
- Wikipedia share of the log 10% (review-checks PASS). Nothing in a cult or sacred role; no sacred object, site or
  person; the ibis and cats predate this piece and are unchanged.

### Local checks on `aadc971c`
- Full build order: tree clean after (no stale output). `review-checks.js --base origin/main --build`: 9 passed,
  0 failed, 0 warnings. Every `tools/verify-*.js` ok (18). Framework tests 51/51.
- `tools/react-check.js`: all pass, 71 ok / 0 fail, at 960 px (ch02, ch03, the Bronze Age corridor, ch05) and 390/360 px (ch02); 0 script errors. One note: ch03's heron cornered once (below).
- `tools/ground-check.js`: all pass, 58 ok / 0 fail, at 960/390/360 px incl. the corridor (ch03 lowest bed -0.348 m, water -0.06 m: 0.29 m deep, as #174 says). A first attempt crashed the headless browser (out of memory) on the corridor right after react-check; run alone it passed.
- Phone baseline (`museum-baseline.js`, 412 px): hall 39 / corridor 85 / ch02 68 calls (budget 100), 0 errors (#174's own run had ch02 65; the view varies with where creatures are).
- GitHub on `aadc971c`: 7 green + `guard` skipped (as on every PR), Lighthouse included (completed 21:59 UTC).

### Notes passed on (not findings)
- ch03's single heron can be cornered by the test and then stands still facing away (existing rule, as #174 reported).
- **Merge-time re-sync:** `aadc971c` conflicts with today's `main` only in the generated `framework/registry/index.json`
  and `source.json`. At merge, re-sync and re-run `node tools/build-entity-registry.js` rather than hand-merging.
- graphify CLI is not installed in this session; code was read straight from the branch.

## Next
Day and weather (light and shafts first), stacked on #174. Then G3 frame budget.
