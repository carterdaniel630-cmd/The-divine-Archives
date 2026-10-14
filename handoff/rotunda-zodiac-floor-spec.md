# Rotunda Zodiac Floor — Redesign Spec
**Requested by Carter, 2026-10-13. For Claude's build queue.**

## Current state
Under the planetarium in the Rotunda, a ring of lights represents the 12
astrological signs; clicking a light shows that sign's details. Carter's
verdict: they're too high up and poorly placed for what they represent.

## Proposed redesign: the zodiac moves to the floor
- **A zodiac wheel set into the Rotunda floor** — all 12 signs arranged in a
  ring, large enough to walk around (and read while standing on the
  perimeter).
- **Tap/click a sign** for its details (keep the current interaction, relocate
  it).
- **Cosmological logic:** planets turn above in the planetarium dome; the
  zodiac wheel rests below on the floor. Heavens above, wheel below — the
  arrangement means something instead of floating at an arbitrary height.

## Build notes
- 12 glyphs needed. A batch of 12 zodiac SVGs exists at
  `workspace/your_files/claude-integration/zodiac-glyphs.md` but is NOT
  historically audited — audit against primary astronomical/astrological
  sources before use, or cut new glyphs.
- Must remain legible and tappable on a phone screen (Carter reviews on
  Galaxy S22).
- Keep the existing detail content for each sign; only the placement and
  presentation change.
- Reduced-motion: the wheel itself is static architecture, not animation —
  no motion-sensitivity concern beyond the existing tap transitions.
