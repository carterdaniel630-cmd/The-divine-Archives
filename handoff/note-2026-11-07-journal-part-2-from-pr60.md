# Note — Journal hero part 2 (set pieces) can reuse PR #60's code (2026-11-07)

**Carter, 2026-11-07 (live, in the session that built PR #60):** "The new hero is supposed to be based off of the selfie
that I took. So even without the fedora, it's still supposed to look like me."

**Where that stands:** done for the face. The live hero is The Archivist (PR #77, `dbf5d16`/`d038119`): his face from his
selfie, hooded, no fedora. PR #60's generic surveyor was rightly closed (takeover batch item 3). No change to the face.

**Still open on `main` (STATUS: "Set pieces (whip, boulder) are part 2"):** the live game still has the whip, the rolling
boulder, the 7-tile Egyptian spike pit, the unzoomed camera (hero ~25 px tall on an upright phone) and the darker tomb.

**For whichever run picks up part 2:** branch `loop/journal-hero-redesign` (`6862dee`, kept) already has these, all
independent of the hero's face, verified on 2026-10-17 (all 4 sites play to the exit, swing lands at col 111, gap audit
of all 13 gaps passes, FPS unchanged):
- the plumb-line in place of the whip (`drawWhip`/`drawRope`/`drawBob`/`cord`, chime sound, all player-facing text);
- the sand torrent (Egypt) and scree slide (Persia) in place of the boulder (`drawBoulder`, `sandTop`, the `caught` test);
- camera zoom 1.25–1.6× with vertical follow (`fitCanvas`, `camTopFor`, the sky drawn unzoomed, lighting offset);
- spike pit 101–107 → 102–106; tomb darkness 0.9 → 0.8 and a wider glow around the hero.
Port those onto current `main`. Keep The Archivist's painted parts (`drawPlayer`, `art/treasure/`) and his portrait as
they are: do NOT bring over #60's procedural surveyor, its portrait, or its move of `art/treasure/` to `_to_delete/`.
The Archivist's cast arm should hold the plumb-line in place of the whip. Same quality bar and independent review.
