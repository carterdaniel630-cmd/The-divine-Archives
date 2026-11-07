# Order — Inscribed walls in every museum hallway (prepared 2026-11-04)

Status: LOCAL PREP ONLY. Not yet written to Claude's channel. This note is
ready to go as a handoff file on staging/ready-line in Saturday's batch
(Claude is capped until Saturday's reset); each channel write still takes
its own approval card.

## Why
On 2026-11-03 Carter ordered: an inscribed/glyph wall treatment "needs to
be in every hallway throughout the museum" — each wing in its OWN era's
real script. Before the order travelled, atlas owed one verification:
what Wing III's wall actually carries (real signs vs decorative glyphs).
That check is now done (2026-11-04, read from the production code on
main; full finding: ~/workspace/goals/inscribed-walls-in-every-museum-hallway/WING3-WALL-FINDING-2026-11-04.md).

## What the check found (the ground this order stands on)
- The museum ALREADY builds its corridor symbol walls from real signs:
  every sign is an explicit Unicode codepoint (tools/data/symbols.json),
  drawn in SIL Noto script fonts (tools/build-symbols.js), per-wing sets
  assigned in docs/museum/style.js.
- Wing III (Early Iron Age: Zoroaster, Pre-exilic Israel, Early Greece,
  Early China, Canaanite & Phoenician, Nubia & Kush, The Etruscans)
  carries the "iron" set: Greek alphabet (24), Old Italic (32), Old
  South Arabian (29), Old Persian syllabary (36, word-signs excluded —
  they sit on the sensitivity held list, enforced by
  tools/verify-symbols.js).
- The signs deliberately spell NOTHING: per Carter's 2026-10-06 design
  rule, scripts alternate row by row so no column forms a word or name.
  Real letters, arranged as atmosphere — NOT readable inscriptions. This
  order keeps that rule. (Readable inscription texts would be a different
  build and a new ruling; not asked for here.)
- Wings II, IV, V, VI also carry real per-wing sets already.
- Wings I, VII, VIII, IX have NO symbol walls at all. That missing
  coverage — not Wing III — is the unbuilt part of "every hallway."

## The order
1. Extend symbol-wall coverage to the four bare wings — I, VII, VIII,
   IX — using the same machinery (per-wing set in style.js, signs from
   tools/data/symbols.json, Noto script fonts, verify-symbols held list
   enforced). Each wing's set drawn from ITS OWN era's real scripts,
   chosen from the wing's chapter record; no invented glyphs, no
   decorative look-alikes, no sign from the held list.
2. Complete Wing III's set: add Phoenician and Hebrew letters (the wing
   holds the Canaanite & Phoenician and Pre-exilic Israel rooms;
   Phoenician is the parent script of the Greek set already on the
   wall). Neither script is on the held list. Note in the build report
   that Early China and Nubia & Kush remain uncovered in Wing III and
   why (no suitable period sign set in the current data, or held-list
   reason) — do not improvise coverage.
3. Keep the no-spelling rule exactly as built: scripts alternate so no
   word or name can form, in every new and existing wall.
4. Every-screen rule and phone grade apply as always: walls must read
   at phone size without costing the frame rate (rest-when-still).

## Acceptance
- Atlas re-reads the built sets against tools/data/symbols.json
  (codepoint-for-codepoint) and walks the four new hallways at phone
  size before this is called done.
- Build report names each wing's final set and any wing left uncovered,
  with the reason.

## Out of scope
- Readable inscription texts on walls (different build, needs a ruling).
- Any sign on the sensitivity held list.
- Pilgrimage-site walls (this order is the museum's hallways).
