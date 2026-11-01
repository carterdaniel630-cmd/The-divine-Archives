# The Keeper's Table — design note
## Carter's order, 2026-10-30 22:22 ET · companion to the Archivist design (2026-10-29)

**Carter's words, in substance:** the interactive table is wanted — and
something like it should exist *for the Keeper*: a surface visitors interact
with, where looking through the table's contents they find short clips to
watch right there on the table, can play-test some of the things the Keeper
is building, and can leave reviews that help decide whether a thing gets
built.

## What it is
The Keeper's worktable, standing in the open museum (at the edge of his
presence — near the Study door visitors may see but never open; the table is
outside it, in public, because this part of his work is meant to be touched).
It is the public face of his §8 hands: what he is making lies on the table,
in the open, before it is finished.

**The table holds three.** At any time exactly three works-in-progress lie
on the table — no more, so it never becomes a junk drawer. When Carter
decides one (built into the museum, or benched), the next work takes its
place. The three are atlas/Claude-built prototypes of pieces already in the
Archives' build flow — the Keeper "builds" them in the fiction; the system
builds them in fact, exactly like everything else he does.

## What a visitor does at the table
1. **Browse its contents.** The table's surface is a living spread of the
   Archive it draws from — the same interactive grammar as the Debate Hall's
   atlas table: a timeline to drag through the ages, places and figures to
   tap, fact cards opening in place. Browsing is the invitation; the works
   are found *within* the browsing, not behind a menu.
2. **Watch short clips, on the table.** Short clips lie on the table like
   objects among the maps — tap one and it plays right there on the surface,
   small and contained, the museum's own screening of its material. (Site
   content in the museum; the social posting lanes are untouched. Voice-only
   law applies to anything with narration, as everywhere.)
3. **Play-test the three works.** Each work-in-progress is present in a
   tryable form — a game prototype, an interactive piece, a room fragment —
   playable at the table for a few minutes, honestly badged: *a work in
   progress, unfinished, shown because your hands on it help decide its
   future.*
4. **Leave a review.** Three plain prompts, nothing more: *Did it hold you?
   What confused you? Should this be built into the museum — yes, no, or
   not yet?* Reviews render as the museum's candle language: the works
   gather candle-flames, never star-ratings or scores.

## How reviews reach a decision (honest mechanics)
- **Carter still decides.** Reviews are evidence, never verdicts. When a
  table piece reaches Carter's desk, its review record comes WITH it: how
  many tried it, the yes/no/not-yet split, and the most common confusion in
  visitors' own words. He rules; the candles inform.
- **The Keeper reads them** — in the fiction, the reviews are how he learns
  what his hands got wrong; in the design, review summaries join the
  material his study draws on (his study log stays private, as ruled).
- **Static-site truth:** the site has no backend, so in the pilot a review
  lives on the visitor's own device (the Debate Hall histogram pattern),
  with the data shape matching the future tally service exactly. The Living
  Archive phase turns the tap into a real submission with no redesign.
  Nothing in the pilot pretends a review traveled where it did not.

## Relation to the Debate Hall table
Two tables, one grammar. The Debate Hall's atlas table stays FULLY
interactive (§3 of its spec: timeline scrub, tappable map, source shelf,
compare well) — the v2 preview simplified it to a landing surface for the
demonstration only; that simplification is the preview's, not the design's.
The Keeper's Table reuses the grammar for making instead of arguing:
browse, watch, test, review.

## Laws that bind it
- THE STANDARD + Shiva floor: a prototype on the table is a starting point
  honestly badged as one — unfinished never masquerades as finished.
- Truth policy: contents are the record; clips are real Archive material.
- The Keeper's gates stand: he never speaks for Carter, touches no money,
  accounts, or sign-ins; the table changes nothing about them.
- Owner test applies: Carter browses, watches, tests, and reviews at the
  table on his phone, unaided, first try — or it does not ship.
