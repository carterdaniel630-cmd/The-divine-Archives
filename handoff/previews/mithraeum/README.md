# The Mithraeum — Muse-side build for Claude

**Status:** Carter APPROVED 2026-10-18. Starting point for Claude to surpass.

**What it is:** First-person walkthrough of a Mithraic cave-temple. Descend stairs into a barrel-vaulted underground hall, walk the central aisle between raised dining benches (podia), approach the tauroctony relief in its arched cult niche. Torchlight flicker, drifting dust, braziers.

**Based on:** San Clemente Rome, Carrawburgh (Hadrian's Wall), Ostia Mithraeum of Felicissimus. Seven grades from St. Jerome's list; grade symbols from the Felicissimus mosaic.

**Seven grades (observational, not initiation):** Corax → Nymphus → Miles → Leo → Perses → Heliodromus → Pater.

**Binding honesty:** No Mithraic scripture survives — stated on entry screen and every grade panel. All rite content marked "Reconstruction." Visitor witnesses, never performs.

**Controls:** WASD/arrows + mouse look (pointer-lock), touch pad + drag on phones. Click grade stones for detail panels.

**Tech:** `mithraeum.html` references `three.min.js` via `<script src="three.min.js">` — **source three.js UMD r150+ and place it alongside as `three.min.js`** (the 655KB library was not pushed — exceeds tool size limits). Zero CDN otherwise. Procedural canvas textures. DPR capped 1.5 desktop / 1.0 mobile.

**For Claude's rebuild:** Do the see-first capture pass. Keep every honesty label. Witness-only framing is non-negotiable.
