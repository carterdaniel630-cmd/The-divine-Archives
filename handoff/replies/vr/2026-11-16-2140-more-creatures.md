# VR loop reply — 2026-11-16 21:40 UTC: More creatures (PR #174)

**Built:** PR #174, `loop/vr-creatures` `aadc971c`, stacked on #170. **VR, per item**: merges only on Carter's yes.

## What it does (Carter's "More creatures, true to each room's place and era")
- **ch03 Mesopotamia:** the tilapia is gone. It is not native to Mesopotamia (Iraq's first wild records are 2007–2015
  introductions). In its place is the **bunni**, a barbel endemic to the Tigris-Euphrates. A shallow channel runs
  through the reeds (deepest 0.29 m below the water at your feet) so the fish actually swim; before, ch03's fish found
  no water deep enough. Also added: **pied kingfishers** and **dragonflies**.
- **ch02 Egypt:** adds **pied kingfishers** (painted in Amarna's Green Room) and **butterflies** in the plain tiger's
  orange (the butterfly painted in Nebamun's marsh scene).
- **Birds and insects at your feet:** they fly over the raised ground, from knee height to below eye height (the
  review-169 note: their heights were set for the old pit). Inside 4 m of you they turn away and only move when the
  move takes them further off (a kingfisher or dragonfly hovers while it turns; against a wall it slides along it).
- Sources: `sources/museum-fauna-pilot.md` (what was opened, what was seen only as a citation; colours called generic
  where no source backs them). Living wildlife only; nothing in a cult role.

## Checks (local)
- `tools/react-check.js` (extended to birds and insects, and to "each pilot room holds its creatures"): ch02 and ch03
  at 960 px, ch05, ch02 at 390 and 360 px all pass. The corridor passed in the first full run. Later runs crashed the
  headless browser (out of memory) on the corridor, and the same crash happens on #170's own head in this sandbox.
  One real bug found and fixed on the way: an insect pinned against the room's edge hovered within 2 m. It now slides
  along the wall.
- `tools/ground-check.js` all pass at 960, 390, 360 px. Full build order (no diff but the entity registry, rebuilt
  for the new source log), every `verify-*.js`, framework tests 51/51, `review-checks.js --base origin/main --build`
  9/9.
- Phone baseline (412 px) vs #170's head: hall 39 → 39 calls, corridor 80 → 85, ch02 63 → 65 (budget 100), 0 errors.
- For the reviewer: ch03's one heron can be herded into a corner by the test and then stands still facing away
  (reported as a note, the existing rule). The Amarna paper (Stimpson et al. 2022, *Antiquity*) was confirmed only
  through a press report.

## Lock note
This run took VR-LOCK at 19:12Z and ran 2.5 h (the browser checks are slow here), so its lock went stale. The 21:13Z
run took it over, which was correct. This run therefore leaves VR-LOCK and VR-STATUS to that run. It adds this reply,
the MERGEABLE entry and `handoff/loop/CLAIM-vr-creatures.md` so that run skips this piece and folds #174 into
VR-STATUS.

## Next
Independent review of #174 by a run that wrote none of it, then GitHub green. Then Day and weather. Then the G3
frame budget.
