# RESUMPTION PACK — for the loop's return, Sat 2026-11-21 (from atlas)

Written 2026-11-21 ~11:05 ET, ahead of the 2:59 PM reset. Everything
below is Carter-ruled or Carter-approved. Queue order first, then
three new items. Nothing here touches main directly; all of it
travels the normal loop (pickup, rework, review, merge-on-green
where the queue allows).

## Queue order (yeses already on file in this branch's handoff/)

1. PR #181 (VR frame-budget harness) — Carter's yes 2026-11-17
   (handoff note 5dbd9c5f). GOES FIRST.
2. PR #169 (VR ground fix) — Carter's CONDITIONAL yes 2026-11-21
   (handoff note 5161cd01): the yes fires only after atlas
   re-verifies the PR green against current main (independent
   review PASS + all checks green incl. Lighthouse). Atlas runs
   that check right after the reset and confirms in a follow-up
   note. If any part fails, the yes does not fire and atlas
   reports back instead. Do not merge #169 before atlas's
   confirmation note lands.

## Item A — Games placement fix (handover of the verified list)

Source of record: the games machine's placement fix list, verified
against the live site 2026-11-20 (three live lists read and
cross-checked: home-page Arcade, Symbols page, Museum Directory —
all the same 11 games). Carter's corrected games plan (2026-10-31):
a game's true home is the age of its FORM; all games also live in
the Arcade.

Findings and fixes owed:

1. Archive Chess is assigned as the EGYPT room's game (Symbols +
   Museum Directory). Chess's form is medieval (~1475). Re-home
   the room assignment out of Egypt. Its Arcade presence stands.
2. Every other live game is likewise room-assigned to a tradition
   its form does not belong to. Per the record, modern forms home
   to the Arcade proper; the room assignments are the wrong home:
   Divine Casualties (Early Greece), Ouroboros (Theosophy), Ziggurat
   Builder (Mesopotamia), The Reliquary (Patristic Christianity),
   The Seeker's Path (African Diaspora Religions), Antithesis
   (Zoroaster), The Excavation (Indus Valley), The Labyrinth
   (Maya), Dominion of the Ancients (Rome), The Unfinished Journal
   (Aztec). Fix = clear the room assignments; Arcade stays.
3. Tomb Robber is missing from the Arcade entirely (site search
   "Robber": 0 results; not in any of the three lists). It is a
   distinct game, not The Unfinished Journal renamed. Restore it
   to the Arcade from the program's build.
4. The historical games are absent as games (Senet, Mehen, Royal
   Game of Ur, Antikythera, Hnefatafl, Astrolabe, Game of the
   Goose). They ship when their dressed builds ship — Senet's
   transport build is the games machine's current work atlas-side;
   nothing to place yet. The Oracle Bones interactive exists live
   only as a Vault object, not as the Early China room's game.
5. The Firmament's absence is BY CARTER'S ORDER (retired
   2026-11-05, PR #124) — not a loss, no restore owed.
6. Two arguable rows are CARTER'S CALL, undecided — do not place:
   Library Rescue and The Alchemist's Magnum Opus (modern forms
   carrying classical/medieval content; not live).

## Item B — Rok Stone page: routine honesty fix (Carter 2026-11-21)

Carter ruled today: the loop fixes the Rok Stone page as a routine
honesty fix (not held for his review). From the weekly loop audit:
the page's BBC Future link points via an unofficial mirror instead
of bbc.com; the Holmberg PDF path is unconfirmed; the "3.82
metres" figure is unsourced. Substance is not wrong — these are
citation/wording fixes. Fix the links/sources, source or remove
the unsourced figure, keep the decoding content as it stands.

## Item C — Planted-error auditor: RESTART (Carter 2026-11-21)

Carter ruled today: restart the scheduled planted-error test that
keeps the reviewer/auditor routines honest. It has not run since
October. Restore it to its former cadence alongside the weekly
re-review audit.

## NOT in this pack (no new ruling — do not start)

- Museum multiplayer: commissioned 2026-11-21, but its design and
  bubble come first, atlas-side. No staging note until the design
  exists.
- PRs #170, #174, #178, #179/#180, #182: no new rulings today
  beyond what is already on file.
- The Flood film: held on atlas's shelf by Carter's order; it
  stays last and is not handed over early.

— atlas, 2026-11-21
