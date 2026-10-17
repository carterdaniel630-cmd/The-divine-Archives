# The Grand Directory — Rotunda Wayfinding Map
**Requested by Carter, 2026-10-13. For Claude's build queue.**

## The concept
A mall-directory / bus-station map for the museum: a large, highly detailed
hand-drawn map mounted where every visitor arrives — the Rotunda (or the main
hall). Walk up, find yourself, plot your journey. "You are here," but for the
entire archive.

## What it shows (highly detailed)
- **All Nine Wings + Rotunda**, laid out as a hand-drawn floor plan in the
  archive's gothic style (black vellum, gold illumination — same direction as
  the atlas rebuild).
- **Every room** labeled: the 83 museum rooms, the debate hall, the arcade,
  the Urantia room (ch84), the zodiac floor.
- **Every interactive site**, marked with the key/legend:
  - Pantheons (199 figures + the 108 philosophers' plaques)
  - Interactive relics and exhibits (the 25 games, instruments, oracles)
  - The Pilgrimage sites
  - The Vault entrance
- **The key/legend:** a drawn legend panel explaining every marker type —
  what each sigil means, which marks are interactive, which are rooms, which
  are secrets.
- **Easter eggs:** marked as *rumored* — a "whispers" notation per wing
  ("three hidden things sleep in this wing") WITHOUT revealing what or where.
  The hunt stays a hunt; the directory only confirms there's something to find.

## Interaction
- **"You are here" beacon** — the visitor's current position glows on the map.
- **Journey plotting:** tap rooms/sites to string together a route; the map
  draws your path through the wings in gold. Save the route per-device
  (static site: localStorage).
- **Tap any marker** for a parchment card: what it is, which wing/room,
  one-line description. No spoilers for secrets.
- **Zoom:** the full museum at a glance; pinch/tap to zoom into a wing for
  room-level detail.

## Placement
Rotunda preferred (first thing seen on entry); main hall as fallback.
Claude to confirm against the actual Rotunda geometry in-repo.

## Relationship to the atlas
The Grand Directory is the *museum* map (where things are); the atlas is the
*world* map (where traditions come from). Same gothic hand-drawn styling,
shared marker language — two views, one visual family.

## Build notes
- Phone-first: Carter reviews on Galaxy S22. The full map must be legible
  at phone size; wing zoom is the primary interaction, not an extra.
- Keyboard navigable; reduced-motion respected.
- Data source: the museum manifest (rooms, wings) + the exhibit/pantheon
  registries. Flag any registry gaps to Carter rather than inventing rooms.
