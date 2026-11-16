# VR loop STATUS (overwritten every run)

**As of:** 2026-11-16 ~23:50 UTC. **#174 (more creatures) passed independent review** (0 open; GitHub 7 green +
guard skipped, Lighthouse included). **#169, #170 and #174 are now all qualified except Carter's yes** (and a
merge-only re-sync onto `main` at merge time). #166 (height check) is **live** since ~18:48 UTC.

## Done
- **Review of #174 — PASS, 0 open** (23:13–23:50 UTC, a run that wrote none of it): `review-log` `ce3af5bc`,
  `reviews/loop/2026-11-16-vr-creatures-174-independent-review.md`. All six sources re-fetched and support the log;
  the Amarna paper itself still unread (two press reports name the pied kingfisher). Local re-run green:
  build no-op, review-checks 9/0/0, verify 18/18, tests 51/51, react-check 71 ok / 0 fail incl. the corridor,
  phone baseline hall 39 / corridor 85 / ch02 68 calls (of 100), 0 errors. Reply `vr/2026-11-16-2340-review-174.md`.
- **More creatures — PR #174** `loop/vr-creatures` `aadc971c` (on #170): ch03 tilapia (not native) → the bunni
  (Tigris-Euphrates endemic) with a shallow channel to swim in, pied kingfishers, dragonflies; ch02 pied kingfishers
  and plain-tiger butterflies; birds and insects fly at knee-to-chest height and keep 4 m off. **VR, per item.**
  Reply `vr/2026-11-16-2140-more-creatures.md`. (Its claim file is folded in here and removed.)
- **#166 height check — LIVE** (merged ~18:48 UTC on Carter's yes, `carter-yes-2026-11-16-pr166.md`).
- Reviews PASS: #170 (16:57 UTC), #169 (16:20 UTC). #161 + #163 live since 01:43 UTC.
- Spec set is staged in `handoff/vr-*.md` (atlas, 2026-11-15), not `handoff/vr/`; Next was re-planned from it.

## In progress
- Nothing held. Stack: `main` → #169 `5067bc74` → #170 `fbc0d6f4` → #174 `aadc971c`. All three were cut before
  today's later merges; at merge time re-sync (merge only) and re-run `node tools/build-entity-registry.js` for the
  two generated registry files that conflict (`framework/registry/index.json`, `source.json`).

## Next (in order; Carter's live rulings 2026-11-16 first)
1. **Day and weather**: wind, light and weather over time, from what `world.js`/`style.js` already carry (light and
   shafts first, rain last if ever, per `order-2026-11-15-vr-buildout.md` 5). Stacked on #174. Needs no approval to build.
2. **G3 Frame budget**: Quest 2 72 fps gate per pilot room (with the living ground in it).
3. Controllers + select → plaques (incl. §15 seated re-anchoring of every plaque); audio; performance scope;
   pilot spaces; living-room contract (as before).
4. More creatures, later candidates (each still needs a source and the keep-your-distance rule first): marsh frog,
   Euphrates softshell turtle (ch03); Nile frogs, turtles (ch02).
G4 curtain: not needed for ch02 (Carter); other pending elements surface before building.

## Needs Carter
1. **Your yes to put the living ground live: #169 (ground at your feet), #170 (creatures and plants react to you),
   #174 (more creatures).** All three reviewed PASS and green. They go live together, in that order. Options:
   a) yes to all three; b) yes to #169 + #170 only; c) not yet.
2. **Height:** #166 is live. On your next headset visit the plaque in front of you shows STANDING/SEATED and your eye
   height; tell us the number if it still feels low.
3. Curtain: ANSWERED (Egypt stays open in VR). Floor feedback: ANSWERED (`decisions-2026-11-16-carter-ground-at-your-feet.md`);
   built as #169, #170, #174.
