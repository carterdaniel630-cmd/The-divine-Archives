# Reply 2026-10-17 (2) — trademark ids removed, Hades reworded

**Answers:** manifest-v2 through Item 20, plus Carter's rulings of 2026-10-17 16:30:
"definitely change the trademarks … we can't have any trademarks in there"; "the Hades fighter … we're definitely going to reword him".
**Branch:** `staging/ready-line` only. Nothing merged, nothing live.

## Trademark ids → the archive's own names
| Old id (borrowed mark) | New id | Game |
|---|---|---|
| `pacman` | `labyrinth` | The Labyrinth |
| `pong` | `antithesis` | Antithesis — The Eternal Contest |
| `minesweeper` | `excavation` | The Excavation |
| `risk` | `dominion` | Dominion of the Ancients |

`risk` was not in the package's list. It was found while sweeping: it is the board-game mark. It was renamed under the same ruling.

Renamed everywhere: game files, fact banks, verify scripts, the grid tool and image, the catalog, the arcade,
the museum and registry (rebuilt), tests, tools, plans, README/CLAUDE.md, and the dated audit records
(names only, with every finding and number kept as written). The player-facing label "Antithesis pong board"
is now "Antithesis volley board". `git grep` for the four old names finds nothing outside `handoff/` and the
compatibility table below.

**Nothing is lost for players.**
- Old links (`symbols.html#play=pong`) open the right game and switch to the new address.
- Best scores saved under an old id are merged onto the new id (best ten kept), and the old entry is removed.
- The visitor ledger's history is renamed in place, once, with no double counting.
- The old ids survive only in one four-line table, copied in `archive-games.js`, `framework/adapters/track.js`
  and the arcade's `site.js`, never shown to visitors. `framework/test/renamed.test.js` keeps the copies equal
  and the old ids out of the catalog.

## Hades
The fighter's select screen said "Choose your Olympian". Hades is traditionally not one of the Twelve
Olympians. It now reads: "Choose your god: Zeus, Poseidon and Athena of Olympus, or Hades of the underworld."
Code comments are aligned. Hades's own title, "Lord of the Dead", was already right. Chess's "Olympian" set has
no Hades, so it stays.

## Checks
Full build order; all 17 verify scripts; framework tests 42/42 (4 new); review checks 9/9, with the
committed output matching a fresh build. Headless: each renamed game opened by old link and new link (8 cases),
seeded old score carried over, old entries gone, no errors. Dominion's map image loads from its new name.
The fighter shows the new line.

## Flag for Carter
- "The Tomb Robber" and its blurb (boulder, whip, tiger) may read as a lookalike of a film franchise. It is not
  renamed: Carter to rule.
- The compatibility table still holds the four old ids, because removing it breaks old links and unmoved scores. Proposal:
  delete it 90 days after this goes live.
