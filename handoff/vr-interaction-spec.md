# VR Interaction Spec — Divine Archives Museum (Interaction Choreographer)

**Status:** spec only — Claude Code implements. **Date:** 2026-10-12.
**AMENDED 2026-11-01 — council amendment pass (Carter-approved, one pass). Every change
is recorded in `../files/vr-pilot-amendment-log-2026-11-01.md` (AM-INT-…). Superseded
[WARDEN] plugs are marked where they stood; §9 is re-scoped to its phase.**
**Read with:** `~/workspace/build-standards/artistry-standard.md` (5 params),
`~/workspace/build-standards/modular-framework-standard.md` (8 clauses).
**Current flat model (kept intact):** `docs/museum/app.js` + `docs/museum.html`
— WASD/arrows walk (Shift = run), pointer-lock/drag look, E/Enter or tap = `openCard`
(inspect relic / plaque), Esc = close card / close guide, G = room guide,
Directory + per-room "walk there" buttons = `teleport(id)` with `mu-fade` dissolve,
touch tap-floor = auto-walk (`S.auto`), hash deep-links (`#<roomId>`, `#@<era>`).
**Data source:** `docs/museum/wings/*.json` → `{ wing, emblem, rooms{title, eraLabel,
summary, plate, plateCaption}, vault{title, category, dated, held, summary, slug, home}, figs }`.
**Soul rule (non-negotiable):** diegetic UI only in VR. No floating flat menus, no
sci-fi chrome. A visitor must feel inside getconexto.com — stone, parchment,
gold leaf, the house voice (respectful, wonder-first, stoic; sign-off
"The Divine Archives" carved, never pasted).

`[WARDEN]` marks a normative parameter owned by the Comfort Warden. This spec
proposes defaults; the Warden's numbers are final.

---

## 1. Input mapping table — every museum action, every modality

One table, no gaps. Flat column = current behavior, unchanged.

| # | Action | Flat (keep current) | Controller (Quest-class) | Hand tracking | Magic-window (phone fallback) |
|---|--------|---------------------|--------------------------|---------------|-------------------------------|
| 1 | Move through room | WASD / arrows; Shift = run; tap floor (touch) = auto-walk | **Teleport (default):** hold right trigger >[WARDEN: 200 ms] → arc appears → release to land. **Smooth (opt-in only, behind warning + 2 confirmations):** left thumbstick, vignette hooks | **Teleport (default):** pinch-hold → arc → release. No smooth loco by hand (teleport-only) | Tap floor = auto-walk (current); drag = look |
| 2 | Turn | Mouse / drag; ←/→ arrows turn at 1.9 rad/s | Right thumbstick = **snap turn** [WARDEN: 30°; 15° alternate setting] *(amended 2026-11-01 — the 45° plug was superseded by the Warden's number)* | Open-palm quick swipe L/R = snap turn 30° | Drag horizontal = turn |
| 3 | Look around | Pointer-lock mouse / drag | Physical head turn (room-scale respected) | Physical head turn | Device orientation (magic window) / drag |
| 4 | Select relic / plaque (open reading) | E / Enter at reticle; click/tap exhibit → `openCard` | Trigger **tap** (<[WARDEN: 200 ms] hold threshold) on ray target; or A | Pinch **tap** on ray target | Tap exhibit (current) |
| 5 | Read plaque up close | Walk to plaque; inspect card | **Near-field poke:** controller tip collider touches plaque → plaque magnifies to reading size | **Near-field poke:** index fingertip collider → magnify | Walk/tap to plaque (current) |
| 6 | Open directory | Directory button / skip link → `showDirectory` | **X (left)** summons/dismisses the vade-mecum book in left hand; rotunda lectern always present | **Palm-up hold** [WARDEN: 600 ms] summons book | Directory button (current) |
| 7 | Open room guide (what's in this room) | G / Guide button → `toggleGuide` | **B (right) with nothing open** → room stele text is read aloud-on-plaque: the doorway stele's "Here" page opens in the book | Palm-up book → poke "Here" ribbon | G / Guide button (current) |
| 8 | Enter wing portal | Walk into portal zone (`stepThroughPortal`) / guide "walk there" / hash link | Walk through archway (room-scale) **or** teleport-target the archway | Walk through / pinch-select the archway | Walk / "walk there" button (current) |
| 9 | Close reading / step back | Esc → `closeCard` | **B (right)** = close current page, then close book, then (nothing open) open "Here" page | **Palm-down swipe** = back one level | Esc / × button (current) |
| 10 | **Return to rotunda (lost-visitor recovery)** | Directory → "walk there" rotunda; hash `#@rotunda` | **Y (left)** — one press, always works, from anywhere | **Flat palm toward face, hold** [WARDEN: 800 ms] | "Return to the 3D museum" / directory (current) |
| 11 | Grab / inspect relic in hand | n/a (flat uses card only) | Grip button = grab; release = place; two grips on one relic = scale/rotate | Natural grasp = grab; two-hand grasp = scale/rotate | n/a |
| 12 | Room-scale walk | n/a | Physical walking within guardian bounds | Physical walking | n/a |
| 13 | Pause / comfort break | `mu-motion-btn` (reduce motion) | Settings stele (Rotunda) or the palm-menu comfort page = fade to the rotunda threshold (seated-safe vista), interactions suspended until X. **Y is never long-pressed for this** — Y keeps exactly one meaning (row 10) *(amended 2026-11-01 — the former long-press Y binding double-bound the recovery button and is struck)* | Long palm-hold [WARDEN: 1.5 s] = same | Reduce-motion toggle (current) |
| 14 | Acknowledge orientation (first visit) | Tap the lectern seal on the orientation card | Trigger **tap** on the lectern seal, or **A** while facing the lectern | Near-field **poke** of the lectern seal | Tap the seal |

**Tap vs hold on one trigger (settled):** a press released under the
200 ms threshold is a select (row 4) and fires on release; a press held
past it becomes the teleport arc (row 1) — and the arc's appearance is
itself the feedback that the press has changed meaning. A press that
became a hold never fires select. The Start Here practice ring teaches
both halves of this before either matters. *(AM-INT-01 — FT-3.)*

**One-hand and no-hands completeness (settled):** every row above is
reachable on the **dominant controller alone** — directory (row 6),
close (row 9), and return-to-rotunda (row 10) are remappable to the
dominant hand in settings, so a one-controller visitor can always press
the recovery button (the earlier split — directory X / return Y on the
left, close B on the right — stranded exactly that visitor). Two-grip
relic scale/rotate (row 11) has a one-hand equivalent: grip + thumbstick
push/pull to scale, grip + thumbstick twist to rotate. The gaze-only
path (accessibility opt-in, §3) covers grab, scale, teleport-hold, and
return-to-rotunda as well as select. Acceptance (pilot spec §5.10): a
one-handed pass and a gaze-only pass of the FULL pilot, not only the
core loop. *(AM-INT-01 — HUM-6, FT-5.)*

**Critical-action rule:** actions 6, 7, 9, 10, 11 MUST have controller
equivalents — none are ever hand-only. Hand-tracking failure (tracking lost,
low light) silently falls back to controller rays; if no controllers are
paired either, the session offers magic-window mode.

---

## 2. Locomotion design

- **Default: teleport.** Hold right trigger (or pinch-hold) → a golden arc
  (quadratic Bézier, [WARDEN: max 8 m] *(amended 2026-11-01 — the 12 m plug was
  superseded by the Warden's number)*) rises from the hand; landing marker =
  a flat brass ring that settles on the floor with a soft chime. Release →
  brief dip-to-darkness fade ([WARDEN: 150–250 ms] *(amended — Warden's number)*, the VR twin of `mu-fade`)
  → arrival facing the marker's indicated direction (marker shows a small
  chevron = facing). Arc turns **crimson — and shows a carved ✕ and the word
  NO WAY at the marker** when the target is invalid
  (inside a wall, off the navmesh, inside another visitor's space in future
  multi-user); invalid release cancels silently. Colour is never the only
  channel for this signal (Comfort §d.17). *(AM-INT-02 — HUM-2.)*
- **Smooth locomotion: opt-in only** (settings stele in the rotunda, persisted
  like `mu-rm`; the panel warns "more intense" and requires 2 deliberate
  confirmations — Comfort §a.2). Left thumbstick, [WARDEN: max 2.0 m/s — no
  run speed] *(amended — the 3.5 m/s run plug was superseded by the Warden's
  max)*. Comfort vignette: at speeds > [WARDEN: 1.2 m/s] a soft darkening closes in
  from the periphery (strength [WARDEN: 40–60% at full effect, onset ≤ 100 ms,
  clearing over 300–400 ms] *(amended — Warden's numbers)*); vignette hooks must exist even when
  smooth loco is off (used during auto-walk/portal transitions).
- **Snap turn:** right thumbstick left/right, or left/right arrows in flat =
  unchanged 1.9 rad/s. VR snap [WARDEN: 30° per flick (15° alternate setting)],
  cooldown **250 ms** *(settled by the 2026-11-01 amendment pass — no Warden
  number existed; the longer cooldown survives because it prevents rapid
  repeated snaps, the comfort-safer failure direction; recorded in the
  amendment log)*. Smooth turn available as an accessibility opt-in with
  vignette at max strength.
- **Room-scale respected:** the rig's play-space origin follows physical
  walking; guardian boundary is shown by the platform (not re-skinned —
  platform safety chrome is the one allowed exception to the soul rule).
  Teleport target = rig origin; eye height from `local-floor` when available.
- **Seated mode:** detected via `local-floor` absence or explicit toggle on
  the rotunda stele. Eye height fixed at [WARDEN: 1.2 m]; teleport arc range
  stays [WARDEN: 8 m] for every posture *(amended 2026-11-01 — the former +4 m
  seated extension is struck; the Warden's maximum governs, and distance
  parity is achieved by chained teleports, not longer hops)*; all plaques/pedestals remain reachable (no content
  placed below 0.9 m or above 2.0 m from the seated eye); snap-turn stays.

**Acceptance:** a first-time visitor with no instructions can cross any room
by holding trigger and releasing on a valid marker within 60 seconds;
zero unintended teleports during a 5-minute contemplative session.

---

## 3. Selection model

- **Controller ray = a shaft of light, not a laser pointer.** A soft volumetric
  beam in warm gold (artistry params 1, 3, 4), widening slightly at the target,
  with dust motes drifting inside it (param 3 micro-interaction). The beam is
  cast from the dominant hand; the non-dominant hand shows a shorter, dimmer
  "candle" beam for near-field work. Beam appears only while a hand is raised
  above waist height — lowered hands hide it, so contemplation is never
  interrupted by UI chrome.
- **Near-field poke:** a small sphere collider at the controller tip / index
  fingertip. Touching a plaque magnifies it to reading size (0.9 m wide,
  angled toward the visitor, holding Comfort §c's line length of 40–60
  characters at the magnified type size); withdrawing beyond [WARDEN: 0.5 m] shrinks it
  back. No click needed — touch is the verb, per the museum's tactility.
- **Grab / rotate relic inspection (contemplative rooms):** relics sit on
  pedestals; grip (or natural grasp) lifts a **facsimile** — the original
  never leaves its plinth (house voice: "What is ancient stays where it
  rests; hold its shadow"). Facsimile can be rotated freely, brought close,
  and with two hands scaled between [WARDEN: 0.5×–2.0×]. Release returns it
  along an eased path (reversibility contract, modular standard clause 8);
  flinging is disabled — nothing is thrown in the Archives.
- **Gaze + dwell verdict: recommend AGAINST for selection**, with one
  exception below. Rationale: a museum is a place for *looking*. Dwell-select
  punishes lingering gazes (Midas-touch), causes eye fatigue over 83 rooms,
  and conflicts with the contemplative pacing (artistry param 3). The beam +
  tap/pinch is strictly better. **Exception:** as an accessibility opt-in for
  visitors who cannot use hands, gaze+dwell [WARDEN: dwell 1.2 s, with a
  filling gold ring as the only indicator] drives the same action table.

**Acceptance:** target acquisition ≤ 300 ms perceived latency; plaque text
legible per the Comfort Warden's numbers — reading distance **0.8–2.5 m**
(ideal 1.2–1.8 m; the former 0.6 m body-text test is superseded: closer than
0.8 m is convergence strain), body ≥ 1.3° / titles ≥ 1.8° visual angle —
without leaning through geometry;
facsimile always returns to rest within 1.5 s of release.
The beam's raise-to-show behaviour (§3) is taught at the Start Here
practice plaque before it is needed anywhere it matters, and every Start
Here surface answers near-field poke with no beam raised — a first-timer
with controllers at their sides is never faced with an invisible verb.
*(AM-INT-03 — CON-A16, WRD-4, FT-3.)*

---

## 4. Diegetic UI pattern catalog

All text is rendered as carved/inscribed geometry or high-resolution
procedural textures (artistry param 2 — no flat-shaded floating text quads;
use the site's existing serif voice in texture space).

1. **The lectern directory (rotunda center).** A stone lectern holds an open
   book. Left page: the Nine Wings, each a rubricated chapter head with its
   carved emblem above (`wings/*.json → wing`, `emblem`). Right page: the
   rooms of the touched wing (`rooms → title`, `eraLabel`). Touching a room
   title turns its page into a walking itinerary and offers a brass seal:
   press the seal = `teleport(roomId)`. Binds: wing list, emblems, room
   titles, eraLabels. **No first-visit gate (cleanup 2026-11-01 — the
   former rule here, written by amendment AM-INT-04, made the seal and the
   mosaic inlay teleport inert until the orientation beat was done; that
   gate contradicted the pilot's settled arrival rule and is struck):**
   the seal and the mosaic inlay teleport (§4.5) work from the first
   frame, on a first visit as on any other — the portal is never locked
   and orientation is presented, never imposed (pilot spec §2). The Start
   Here sequence *invites* the visitor past the lectern first; it bars
   nothing. The book's wing list carries the same honesty line as the
   Rotunda directory lectern (pilot spec §2): some spaces are unlisted, one
   is withheld and named as withheld, one is hidden — the book never claims
   "every room." *(AM-INT-04 — FT-4, PA-3.)*
2. **Plaque labels (every relic).** Engraved brass/stone plaque on each
   pedestal: title + one-line summary (`vault → title`, truncated `summary`;
   `figs → title`). Near-field poke magnifies to full reading size showing
   `dated`, `held`, `category`, and the plate caption where one exists.
   Plaques face the room's entry path; text follows the room's era script
   styling from the wing JSON where provided.
3. **Stele orientation text (room thresholds).** A standing stone at each
   room's entrance, inscribed: room `title`, `eraLabel`, a 2–3 line welcome
   in the house voice drawn from `summary`, closing "— The Divine Archives".
   This is the VR room guide (flat G-key equivalent): the stele's "Here" page
   lists the room's relics as small carved icons; touching one highlights its
   pedestal with a shaft of light.
4. **Portal archways (wing transitions).** Each wing is entered through a
   stone archway; the wing's emblem is carved into the keystone and its name
   cut into the lintel (`wing`, `emblem`). Walking through (or teleporting
   at) the arch fires the wing transition with the standard fade. The archway
   on the far side of every wing is the **rotunda door** — the diegetic
   "exit": one doorway, always, back to the hub.
5. **Rotunda "you are here" mosaic.** The rotunda floor is a mosaic of nine
   wing inlays around a central compass rose. Visited wings glow faintly
   (visited set persisted like `mu-pos`). Standing on an inlay and tapping
   select teleports to that wing's threshold stele. The center rose is the
   spawn point and the seated-mode anchor.
6. **Ariadne's thread (breadcrumb trail).** A faint golden thread lies along
   the floor tracing the last [WARDEN: 12] rooms visited. It is a
   wayfinding *ambience* layer — pleasant to follow, never the way home.
   **The home guarantee is the rotunda door and the Y / palm-hold recovery
   (§1 row 10), not the thread** — a thread that only remembers 12 rooms
   cannot promise a road home from the thirteenth. *(Copy corrected
   2026-11-01 — the former line "following it backward always leads home"
   was false at room 13 of 83 and is struck.)* It fades where you linger (contemplation
   leaves no trace) and brightens at junctions. Pure wayfinding, zero text.
   Where the thread is a colour cue it also carries a shape channel — a
   dashed inlay in the floor — never colour alone (Comfort §d.17).

**Acceptance:** every pattern's text is legible per §3 distances; all
bindings resolve from wing JSON with no hardcoded room names; the book,
plaques, steles, arches, and mosaic share one typeface treatment and one
gold.

---

## 5. Wayfinding

- **Hub:** the rotunda. Nine portal archways ring it (one per wing), each
  keyed with its emblem; the mosaic inlays mirror them 1:1. Spawn faces the
  lectern; the lectern faces the arches. A visitor who does nothing but look
  around understands the whole museum in ten seconds.
- **Wing portals:** archways (§4.4). Threshold steles (§4.3) orient on entry.
- **Breadcrumb:** Ariadne's thread (§4.6) — wayfinding ambience; follow it for pleasure, never as the way home (it remembers only 12 rooms). The way home is the rotunda door and the Y / palm-hold recovery below.
- **Return to rotunda:** Y button / palm-hold (§1, action 10) = one action
  from anywhere, always. Also: every wing's exit archway, every mosaic inlay,
  and the vade-mecum's "Here" page carries a rotunda seal.
- **Lost-visitor recovery contract:** no visitor is ever more than **one
  deliberate action** from orientation (Y/palm-hold → rotunda; the rotunda
  re-orients by architecture alone). If tracking degrades, the session fades
  to the rotunda threshold vista rather than stranding the visitor.

---

## 6. Hand tracking vs controllers — detection & fallback

**Capability detection order** (at session start and on `inputsourceschange`):
1. `navigator.xr` + `immersive-vr` session granted → VR mode.
2. Enumerate `session.inputSources`: any `gamepad` profile → **controller
   mode** (dominant = first `handedness: 'right'`).
3. `optionalFeatures: ['hand-tracking']` granted and a `hand` input source
   with no gamepad → **hand mode**.
4. Both present → **mixed mode**: controllers drive the action table; bare
   hands are tracked for grab only when controllers are set down (proximity
   + 2 s stillness), switching back on any button press.
5. No `immersive-vr` → **magic-window** on phones (rotation + touch,
   gaze = screen center, tap = select), else flat — the current build,
   untouched.

**Fallback paths:** hand-tracking lost > [WARDEN: 1.5 s] → beam control
falls back to last known hand pose, then to head-gaze + dwell (accessibility
path) with an inscribed notice on the vade-mecum — **verbatim:** *"Your
hands have wandered from sight — gaze has taken over. Rest your eyes on
what you want for a slow count of two, and it will answer. When your hands
are seen again, touch returns."* (It says what to look at, how long, and
that gaze-dwell has taken over — in plain words. *(AM-INT-05 — WRD-8.)*) Controllers disconnected
mid-session → offer re-pair via the rotunda stele or continue in hand mode;
critical actions (§1: 6, 7, 9, 10, 11) are never hand-only, so nothing
strands.

---

## 7. Living-room extension points (the 10 future exhibits)

Exhibits are not yet integrated; the input layer must be ready for them.
Each exhibit module exposes a manifest consumed by the same action table:

```js
exhibit.vr = {
  grabbables: [
    { id: "ur-die", label: "Cast the die",
      verbs: ["lift", "shake", "release"],        // from a fixed verb set
      bounds: { maxLift: 1.2, maxScale: [0.5, 2.0] },
      onVerb: (verb, ctx) => ActionResult,        // ctx: {hand, pose, dt}
      reverse: (verb) => UndoSpec }               // modular standard clause 8
  ],
  surfaces: [ { id: "ur-board", verbs: ["place", "slide"] } ],
  announce: "The Royal Game of Ur — the pieces may be lifted."
}
```

- **One input abstraction:** exhibits never read devices. They subscribe to
  `InputAction`s (`select`, `grab`, `release`, `manipulate`, `teleport`) —
  the same actions in §1. Controller grip, natural grasp, and flat drag all
  arrive as `grab`. An exhibit that works with one modality works with all.
- **Verb set is closed:** `lift, turn, slide, crank, press, place, pour`
  (pour reserved; no liquids ship in v1). New verbs need Choreographer +
  Warden sign-off.
- **Reversibility:** every `onVerb` registers its `reverse` before executing
  (modular standard clause 8); the vade-mecum gains an "Unwind" ribbon per
  exhibit that inverts the last N manipulations.
- **Comfort:** exhibit interactions never move the visitor's rig (no
  vection); heavy two-hand verbs (crank) are seated-safe; haptics are a
  single soft pulse on grab and on valid placement — never continuous buzz.
- **Acceptance:** a new exhibit module declares its manifest and receives
  full controller + hand + flat-drag support with zero changes to the input
  layer; teardown (`destroy()`/`disconnectedCallback`, modular clauses 3–4)
  disposes all grabbables, listeners, and haptic handles.

---

## 8. Flat-mode parity contract

- **Everything achievable flat stays achievable.** All 83 rooms, every
  relic summary, plaque, vault record, wing directory, guide, and teleport
  target exists in both modes. VR adds embodiment (walking, grabbing,
  looking). Flat keeps: keyboard walk, pointer-lock
  look, cards, directory, guide, hash deep-links, reduce-motion toggle —
  none are removed or degraded by the VR build (one codebase, `navigator.xr`
  feature-detected; VR code paths are additive modules with `destroy()`).
- **The one honest exception — stated plainly, at the Rotunda, before
  entry:** full-length chapter pages and external manuscript links remain
  flat-mode reading. In VR, the plaque carries the complete summary and
  metadata; the vade-mecum inscribes the chapter's title and number with
  the line *"The full telling waits on this room's page in the flat
  museum — leave the headset and it opens where you stood."* (It says
  **where**.) The limit is also stated on the orientation lectern, so no
  visitor discovers it by accident inside a room. The former claim "VR
  never gates content" is **struck until it is true**: the pilot's §5
  acceptance includes the parity test — a VR visitor reaches the full
  telling via the flat/magic-window backup on the same device and resumes
  at the exact room. *(AM-INT-06 — HUM-4, WRD-8.)*
- **Progress parity:** visited wings, reduce-motion preference, and last
  position persist in the same store flat uses (`mu-pos`-style keys), so a
  visitor can leave the headset and resume flat exactly where they stood.

---

## Appendix: [WARDEN] normative parameter plugs

**Status column added 2026-11-01 (AM-INT-11 — CON Table B, orphan settlement).**
Rows marked SUPERSEDED printed the losing value in a table titled "normative"
— they are corrected here so the table can never again be read as the rule.
Rows marked PROPOSAL are the Choreographer's, with no owner number behind
them; they bind nothing until their owner ratifies them.

| Parameter | Value that governs | Status | Used in |
|---|---|---|---|
| Teleport hold-to-arc threshold | 200 ms | RATIFIED (this pass) | §1.1, §2 |
| Teleport arc max range | **8 m** (all postures) | SUPERSEDED — was 12 m (+4 m seated) | §2 |
| Teleport fade duration | **150–250 ms** | SUPERSEDED — was 250–350 ms | §2 |
| Snap-turn degrees | **30°** (15° alternate) | SUPERSEDED — was 45° | §1.2, §2 |
| Snap-turn cooldown | **250 ms** | SETTLED (this pass; no Warden number existed) — was 150 ms | §2 |
| Smooth-loco max speed | **2.0 m/s, no run** | SUPERSEDED — was 2.0 / 3.5 m/s | §2 |
| Vignette | onset ≤ 100 ms after motion passes 1.2 m/s; strength **40–60%** | SUPERSEDED — was 0–60%; onset is a time, the 1.2 m/s is its trigger speed — one label, two dimensions, now stated | §2 |
| Poke magnification trigger distance | 0.5 m withdraw | PROPOSAL (Choreographer) | §3 |
| Facsimile scale limits | 0.5×–2.0× | PROPOSAL (Choreographer) | §3 |
| Hand-mode palm-up summon hold | 600 ms | PROPOSAL (Choreographer) | §1.6 |
| Hand-mode rotunda palm hold | 800 ms | PROPOSAL (Choreographer) | §1.10 |
| Hand-tracking loss fallback delay | 1.5 s | PROPOSAL (Choreographer) | §6 |
| Gaze+dwell (accessibility only) | 1.2 s | RATIFIED (agrees across specs) | §3 |
| Seated eye height | 1.2 m | WARDEN (Comfort §d.15) | §2 |
| Ariadne thread length | 12 rooms | PROPOSAL (Choreographer) | §4.6 |
| First-session comfort prompt | before first entry (pilot spec §2 Start Here; Comfort §f.25 defaults) | WARDEN + pilot spec | §2 |
| Presence distances (8 m / 3 m / 2 m), profile gaze hold 800 ms, presence culling (6 full / 20 glow) | — | PROPOSALS for the future presence phase; the culling figures were labelled [SCULPTOR] but the Performance Budget holds no such numbers — that phase's audit sets them | §9.3–9.4 |

---

---

## 9. Luminous Presence (Carter's avatar decision, 2026-10-12)

> **PILOT SCOPE — settled 2026-11-01 (AM-INT-07 — CON-A12, CON-A13, HUM-1,
> SEC-3, SEC-4, FT-2).** The pilot is **single-user** (architecture
> Appendix C.3): it ships `LocalPresenceProvider` only, and the only
> presence in it is **the visitor's own light, visible to themselves
> alone** — shade fixed at the default **Vow of Gold**, assigned
> silently, persisted like `mu-pos`. There is no shade-selection
> ceremony in the pilot arrival, no other-visitor rendering, no
> noticing, no profile bloom, no bow — §§9.3, 9.4, and 9.6 below are
> **future-phase specification (roadmap Phase 3+)**, kept here as
> design record, and they bind nothing in the pilot build. Radiance
> counters, where they run in the pilot, run **locally and privately**
> (§9.2's rule, settled below). Radiance **tier definitions**
> (thresholds, names, what feeds the flame) remain Carter's unruled
> gate **DG-6** — the table in §9.2 is a proposal, and nothing in this
> amendment ratifies it. Any future presence phase additionally
> requires: a fresh Security audit with an UPHELD ruling (SEC-3);
> **block / hide-presence and personal-boundary controls specified
> before build**; and the privacy settlement recorded at §9.2/§9.4.

Visitors are not humanoid avatars. They are **luminous divine presences** —
small lights traveling the museum, as one visits the Divine Archives as a
small divinity, not a tourist. **Rationale, recorded:** *thematic* — a light
befits a house of gods; *technical* — a presence is a shader plus glow, no
rigged character, cheap on phone-class budgets, zero uncanny valley;
*privacy* — luminous anonymity by design; no face, no body, nothing to
profile. In-world, visitors are "pilgrims," never users or players.

### 9.1 Shade selection (rotunda first-arrival onboarding)

**Future phase — not in the pilot** (the pilot assigns Vow of Gold
silently; see the §9 scope banner). When the presence phase builds it:
first arrival spawns the pilgrim before a **brazier of flames** on a tripod
beside the lectern. Nine flames burn in nine hues; the stele reads: *"Choose
the light you will carry. None is greater; all are welcome."* — The Divine
Archives. Touching a flame kindles the presence in that shade (persisted
like `mu-pos`; re-choosable at any wing-threshold brazier). Flames are
chosen by their **carved name labels**, never by hue alone, and every shade
— Vigil Black included — stays perceivable in the burial chamber's low
light (a rim or marker channel, not brightness). **Curated
palette, not full RGB** — a free wheel would admit neon memes and fracture
the chiaroscuro; nine muted mineral shades with house-voice names: **Vow of
Gold** (default, warm gold), **Temple Ember** (deep ember), **Drowned Blue**
(dark lapis), **Myrrh Smoke** (grey-violet), **Olive Vigil** (muted olive),
**Sepulchre Rose** (dim rose, never pink), **Desert Bone** (pale warm
white), **Nile Dusk** (teal-slate), **Vigil Black** (near-black, gold rim).

### 9.2 Radiance = progression (private growth, never display)

| Tier | Name | Threshold | Render |
|---|---|---|---|
| I | **Ember** | arrival | dim core, halo 0.15 m, no wisps |
| II | **Lantern** | 10 rooms visited | halo 0.25 m, sparse wisps |
| III | **Torch** | 30 rooms + 5 manuscripts read (plaque magnifications) | halo 0.4 m, steady wisp drift |
| IV | **Beacon** | 60 rooms + 3 exhibits completed | halo 0.6 m, dense wisps, faint floor pool |
| V | **Radiance** | all 83 rooms + 20 manuscripts | halo 0.8 m, orbiting wisps, mote trail |

Feeds are local counters — no account, no leaderboard. Tier-up is a slow
~2 s swell of the pilgrim's own light, witnessed by no one (artistry 3–4:
the light never washes out the room; spots stay with the relics).

**The privacy settlement (one rule, binding every phase):** radiance is
**private** — tier and size are rendered **to the owner only**; another
visitor's light never grows or brightens by tier (equal apparent size
regardless of tier). If a future phase renders remote presences at all,
remote rendering carries **shade + tier at most**; rooms-walked counts and
favoured wing are **not broadcast** — they stay local, or are shared only
by the owner's explicit, revocable opt-in. Disclosure of one's own tier to
another visitor is self-initiated only. This settles the former collision
between this section's "never display" and §9.3/§9.4's readable-at-a-glance
profile: **§9.2's private promise governs.** *(AM-INT-08 — HUM-1, SEC-4.)*

### 9.3 Presence scaling (one system, two resolutions)

**Future phase (Phase 3+) — no pilot content.** Where it speaks of the
radiance tier being "readable at a glance," the §9.2 privacy settlement
governs: tier is readable **by its owner**; remote lights render at equal
apparent size. The distances below (8 m / 3 m) and the culling figures are
**Choreographer proposals for that phase**, not ratified numbers — the
Performance Budget contains no presence-culling numbers, and that phase's
audit must set them.

- **Map / God's-eye:** distant visitors are **small motes** in their shade.
- **In-room:** within 8 m (Choreographer proposal for that phase — not a
  ratified number) a mote resolves into a **full presence**
  (core, halo, wisps); radiance tier readable at a glance **by its owner**.
- **Noticing:** approach is **peripheral warmth** — soft brightening at the
  edge of vision — plus one low chime from the Audio Weaver's vocabulary
  (**never a startle**: no sudden sound, no motion toward the visitor).
- **Approach-to-reveal:** inside 3 m (same proposal status) detail blooms; inside 1.5 m
  the presence **yields** — presences never occlude a plaque another pilgrim
  reads (right-of-study: your light dims 30% within 1 m of a reader).
- **Culling (proposal for that phase, numbers not ratified):** nearest N at full
  fidelity, rest as soft glows (no particles), beyond their distance as
  map-motes only. Suggested: N = 6 full / 20 glow / rest motes — that phase's
  audit sets the real numbers; the Performance Budget holds none.

### 9.4 Profiles behind anonymity

**Future phase (Phase 3+) — no pilot content.** Each light carries a **pseudonymous profile**: shade, radiance rank, rooms
walked (count), favored wing. **Never:** name, device, location, contact,
history — no friend lists, no DMs, no whispers; the museum is not a network.
**No visitor is ever given a displayed name** — architecture Appendix C.2's
generated-name display ("Pilgrim of the Second Wing") is struck in favour
of this section's rule: presence identity is name-free (light + self-chosen
shade only). *(AM-INT-09 — CON-A13.)*
**Diegetic viewing:** approach within 2 m + hold gaze 800 ms
(both Choreographer proposals for that phase) (or ray-select) → the light **blooms into light-script**: *"Lantern
· Temple Ember · 24 rooms walked · favors the Axial Age."* Look away and it
folds closed. **Under the §9.2 privacy settlement, the rooms-walked count
and favoured wing appear in this bloom only if their owner has explicitly
opted in to sharing them; the default bloom carries shade and tier only.**
(The former closing sentence — "Nothing private to protect — the profile
is the light itself" — is struck: a persisted shade + tier + monotonic
rooms count + favoured wing *is* a linkable profile across sessions, and
this spec does not pretend otherwise. *(AM-INT-09 — SEC-4.)*)

### 9.5 Debate halls — REMOVED from this contract (2026-11-01)

The debate-hall contract formerly written here (proximity voice/text, the
speaking flame, a hall keeper's power to **bank** a disruptive light) is
**struck, not inherited**. It contracted, in advance, a public-demotion
power held by an unaccountable role, with no definition of "disruptive,"
no warning, no appeal, no captioning provision, and no consent design —
against the architecture's standing rule (Appendix C.5: **never voice
chat**, which remains the current rule of the program). Debate halls may
return **only as their own proposal**, gated on: a fresh Security audit
(Permissions-Policy microphone change, per-hall opt-in, relay/retention
rules, text handling, block/report for ordinary pilgrims, keeper
authentication, rejoin-evasion answer — SEC-6); full captioning of speech;
and a moderation design in which any sanction is defined, warned, and
appealable. Until that proposal exists and passes, no phase of this
program builds, reserves, or pre-wires debate halls.
*(AM-INT-10 — CON-A14, HUM-5, SEC-6.)*

### 9.6 Greeting: the bow of light

**Future phase (Phase 3+) — no pilot content.** To greet, **dip your presence ~0.2 m for half a second** — a brief dimming
in acknowledgment. Returned, both lights warm slightly for a breath. One
gesture, universally understood, impossible to misuse. The onboarding stele
teaches it: *"To greet a fellow pilgrim, bow your light."* A **non-body
equivalent** (a ray-select "greet" on the approached light) is specified
alongside it in that phase — no social verb may require a body motion some
visitors cannot make. *(AM-INT-10 — HUM-6.)*

**Supreme rule of presences:** *your light must never interrupt another
pilgrim's contemplation* — presences yield to readers, arrivals are warmth
never pop-ins, there is no voice chat anywhere in this program (debate halls
are struck from the contract, §9.5 — they return only as their own audited
proposal), radiance is private growth, never public display.

---

## 10. ALIGNED 2026-11-01 — parity, data, and state after the museum walk

*Appended on the program's reopening. Full gap map: `../files/vr-standards-alignment-2026-11-01.md` §6.*

- **Flat parity is verified, not assumed.** §8's contract stands, with one
  correction of method: the flat column of §1 describes the live build as
  found in October 2026, and the 2026-11-01 walk found the live flat
  museum wanting in ways this spec must not inherit by copy — above all,
  **touch**. The walk found the pilgrimage walk has NO touch controls at
  all (the single biggest gap for a phone-first audience). Corrected rule:
  touch is a first-class input in the parity contract — tap targets sized
  for fingers (Every-Screen rule), tap-to-walk and tap-to-inspect present
  and *tested on a phone* in every space, flat and magic-window alike —
  and parity is certified against the live build at each phase gate, not
  carried forward from this document's description of it.
- **Guide data binds to the Directory layer.** The stele "Here" page
  (§4.3), the vade-mecum, and every room-guide surface resolve their
  figure and exhibit lists from the same corrected data the flat
  Directory carries. The walk found per-room guide lists straying in
  room after room (foreign figures present, the room's own figures
  missing) while the Directory was correct in every checked case — a
  per-room guide list is a second source of truth, and this program
  ships one source only.
- **State resets on open.** The walk's stale-window pattern (dialogs
  titled for other rooms, a sky heading that would not follow its sky, a
  sound toggle flipped by a journey) is a discipline rule for this
  spec's surfaces: the XR label panel, the vade-mecum's pages, and the
  stele "Here" page re-derive their title and contents from the current
  room at every open. Nothing carries a previous room's name into the
  next room.
- **Text fallback in every space.** If a room's 3D path fails or a
  device cannot run it, the visitor reaches that room's complete text
  version (the Directory backup) from inside the experience — the
  Every-Screen rule's always-existing backup, reachable, not merely
  existent. (The walk found the flat pilgrimage's text-version link
  present but unworking; a fallback that doesn't open is not a fallback.)
- **The residents are not in this table yet — deliberately.** The
  museum now holds the Keeper, the Raven, and the Grader (alignment doc
  §9). No action rows are specced for them here: how a visitor calls the
  Keeper, and how the Raven leads, awaits Carter's ruling on the
  findability proposal recorded 2026-11-01. The Archivist absorption map
  and the proposed action rows live in the alignment doc as proposals
  for the council, not as spec.
