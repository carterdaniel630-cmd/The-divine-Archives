# Museum Wing Design — Placing the Ten Living Exhibits

Design for integrating the ten interactive exhibits into the Museum's
existing wings as playable rooms. Prepared for Claude Code's
implementation pass.

## 1. Design principle: living rooms, not a games ghetto

Each exhibit becomes an interactive room inside its era-matched wing,
adjacent to its tradition's contemplative room. Rationale: the museum's
power is context — playing the Royal Game of Ur steps from the
Mesopotamia room, casting the I Ching beside Early China. A segregated
"games wing" would strip every exhibit of the scholarship that gives it
meaning. The exhibits are rooms you *do*; the existing rooms are rooms
you *read*. Both belong in the same wings.

## 2. Room placements

| # | Exhibit | Wing | Anchor room | Rationale |
|---|---------|------|-------------|-----------|
| 1 | Mehen | Wing II · The Bronze Age | Egypt (ch02) | Predynastic Egyptian serpent-coil game; sits at the Bronze Age threshold beside Egypt |
| 2 | The Royal Game of Ur | Wing II · The Bronze Age | Mesopotamia (ch03) | Sumerian royal game; pilot room for the living-room class |
| 3 | Senet | Wing II · The Bronze Age | Egypt (ch02) | Egyptian afterlife game; pairs with Mehen as the Egyptian play cluster |
| 4 | Oracle Bones of Anyang | Wing III · The Early Iron Age | Early China (ch09) | Shang pyromancy; interpretive-study framing required |
| 5 | The I Ching | Wing III · The Early Iron Age | Early China (ch09) | Zhou divination; pairs with Oracle Bones as the Chinese divination cluster |
| 6 | The Antikythera Mechanism | Wing IV · The Axial Age | Classical Greece (ch15) | Hellenistic instrument; math needs independent review before opening |
| 7 | The Library Rescue | Wing IV · The Axial Age | Classical Greece (ch15) | Alexandrian Hellenistic; pairs with Antikythera as the Hellenistic cluster; renderer decision required |
| 8 | Hnefatafl | Wing VI · The Early Medieval | Norse Paganism (ch23) | Viking-Age siege game |
| 9 | The Astrolabe | Wing VI · The Early Medieval | Islam (ch21) | Islamic Golden Age instrument; qibla/prayer math needs review |
| 10 | The Alchemist's Magnum Opus | Wing VII · The High Medieval | Scholasticism (ch28) | Latin four-stage schema; Islamic roots link back to Wing VI's Islam room |

Result: three natural clusters emerge — Egyptian play (Mehen + Senet),
Chinese divination (Oracle Bones + I Ching), Hellenistic instruments
(Antikythera + Library Rescue). Clusters get shared antechamber copy
explaining what the visitor is about to do.

## 3. Room class: "living room" (technical spec)

A new museum room type alongside contemplative rooms:
- **Component model:** one ES module / Web Component per exhibit,
  constructed from the payload snapshots (see Games Handoff Brief §4).
- **Lifecycle:** mount/destroy through the shared lifecycle helper —
  deterministic teardown, RAF/timer/listener/audio disposal, DPR capped
  at 1.0 on mobile, context-loss messaging (see
  library-rescue-lifecycle.md for the reference implementation).
- **Assets:** inline assets remapped to absolute `/assets/...` pointers
  via construction config (Framework clause 2).
- **Routing:** deep links `museum#living-<slug>`; directory panel
  entries with a "living room" marker distinguishing them from
  contemplative rooms.
- **Atlas linkage:** atlas markers for these rooms link to the living
  room routes; the atlas dataset gains a `living: true` flag per room.

## 4. Visitor flow

- Wing maps and the museum directory mark living rooms distinctly.
- Each living room opens with a 30-second orientation: what it is,
  what is attested vs. reconstructed, and the honest-evidence note —
  before play begins. Scholarship first, play second.
- Exit returns to the anchor contemplative room, not to a menu —
  the visitor stays inside the tradition.

## 5. Build order

Mirrors the handoff brief: Ur pilots the living-room class (exercises
rules, AI, tutorial, undo, sound, materials, caveats); then Senet,
Hnefatafl, Mehen; then the scholarship-sensitive four (Antikythera,
Astrolabe, Oracle Bones, I Ching); then Alchemist; then Library
Rescue last (dual-renderer architecture decision).

## 6. Acceptance per room

Each living room must pass the Games Handoff Brief's final acceptance
gate (12 checks) plus: orientation shown before play; exit returns to
anchor room; no invented taxonomy — repository conventions win on
conflicts.

## 7. What Claude Code needs

The payload zip (10 snapshots), the Games Handoff Brief (contract +
per-exhibit prompts), the lifecycle spec, and this document. Open
repo-side decisions: component boundary and museum shell conventions,
shared lifecycle helper location, `/assets/...` registry entries,
directory-panel marker design. Carter's pending calls (Library Rescue
renderer, 83-chapter manuscript diff) feed in as they land.
