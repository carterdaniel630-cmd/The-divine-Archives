# VR Artistry Addendum — in-headset extensions to the Artistry Standard

**Dated:** written 2026-10-12; amended 2026-11-01 (amendment pass AM-ART-01 and the cleanup pass — see the goal's amendment and cleanup logs).

**Status:** normative. Applies to all VR embodiment alongside the Artistry Standard's five parameters. Where this addendum and the base standard differ in-headset, **the addendum governs** — it is the stricter, medium-specific reading. The Craft Council audits VR work against both; the High Council's Consistency auditor checks the addendum line by line.

---

## 1. True 3D depth under stereo budgets

- Museum-grade materials at 72 fps on Quest-class silicon. Roughness, metalness, and subtle normal mapping are **mandatory on hero surfaces** (relics, focal plaques, fig faces) — and earned by budget, never assumed. The Performance Sculptor's ceilings are artistry law: ≤240 stereo draw calls / ≤600k tris (Quest 3); ≤160 / ≤350k (Quest 2 floor).
- **Density-per-gaze, not per-room** (benchmark: Ghost Town). Hero detail lives within arm's reach and on sightlines; corridors and streets get atmosphere — fog, capped particle drift — never geometry.
- **Zero real-time shadow-casting lights.** All shadow as baked lightmaps / painted light pools + emissive materials + probe-style fake reflections (benchmark: Red Matter 2). A shadow that costs a frame is a shadow that doesn't ship.
- **Dual-scale composition is mandatory** (benchmark: Asgard's Wrath 2). Every wing makes the visitor feel small at least once — high ceilings, god-scale overlooks, object scale contrast. Vastness from scale contrast, never from polygon count.
- **Foveation is fixed, not a knob:** 1.0 (Quest 2) / 0.75 (Quest 3), set once per session. Micro-interactions must read in the central 20° — nothing essential may live in the foveated periphery. Never modulate foveation at runtime.

## 2. Iconography in VR — legibility as rigor

- **No invented glyphs, ever** (Artistry Standard clause 2; pilot spec Lorekeeper rule). In VR the temptation to fake detail at distance is strongest — L2 impostors must be silhouettes, never pseudo-script. A distant inscription that cannot be rendered truly is rendered as stone, not as marks.
- **Inscription legibility minimums** (Comfort Warden, normative): body text ≥ 1.3° visual angle (~2.4 cm cap height at 1 m); titles ≥ 1.8°; captions never below 1.0°. Contrast ≥ 7:1 body, ≥ 10:1 captions — measured in-headset, on the worst-lit plaque. Reading distance 0.8–2.5 m (ideal 1.2–1.8 m). Line length 40–60 characters. Plaques auto-face the reader.
- **All text diegetic:** carved plaques, steles, codices, the vade-mecum book — never floating HUD text (benchmark: diegetic UI rule). Panels sit at the Comfort Warden's distances — **0.8–2.5 m** *(amended 2026-11-01, AM-ART-01: the 0.75–3.5 m figure formerly here was the benchmark's external summary; §c.12 governs)*, high contrast, larger than feels necessary on desktop.
- **Long-form text stays flat-mode.** VR plaques carry complete summaries and metadata; the vade-mecum inscribes *"The full telling waits on this room's page in the flat museum — leave the headset and it opens where you stood."* (interaction spec §8 as amended — the former wording, "The full telling awaits beyond the headset," named no place and is struck). This is the one honest content-scope difference, and it is stated on the plaque — never discovered by accident.

## 3. Motion — comfort-choreographed

- **Transitions are séance-paced and comfort-safe:** portal transits are masked swaps (~250 ms fade over ≤ 400 ms of masked work) while the **light and ambience ease over 2–3 s around a stationary or self-moving visitor** — the ease is atmosphere, never transit time and never motion imposed on the visitor *(clarified 2026-11-01, AM-ART-01 — CON-A9)*; teleport as incense-smoke dissolve (**150–250 ms** — the Warden's number; formerly printed 250–350 ms); scale changes (God's-eye ↔ table ↔ room) choreographed — breath, blur, arrive. Never a hard cut. Never forced camera motion, never falling, never camera shake (comfort ban list).
- **Locomotion default: arc teleport** per the Comfort Warden's norms (snap turn, vignette hooks, seated mode). Smooth locomotion is opt-in only, behind deliberate confirmation. The rig never moves under the visitor without their explicit command.
- **Micro-interactions that survive foveation:** dust motes drifting in light shafts (capped counts), emissive pulse on focal objects, parchment-whisper feedback on select, the slow swell of a tier-up in one's own light. All central-vision, all cheap, all eased. Nothing essential in the periphery.
- **Reduced-motion is a first-class mode**, honored by JS-driven motion in every exhibit — not just CSS. A reduced-motion visitor gets the full museum with the ceremony intact and the vection removed.

## 4. Chiaroscuro in-headset

- **High-contrast drama with structural clarity.** The visitor must always see the axis — procession path, ramp, corridor — while focal spots pull the eye to relics and plaques. Dark is directional, never global: no frame below 2 nits in focal regions; total black frames banned.
- **Light as emotion, baked not computed.** Static/baked light pools + focal spots carry the scene; the only dynamic lights are torch flicker (cheap noise), the oculus shaft, brazier glow. ≤ 6 fragment-evaluated lights (Quest 3); ≤ 5 (Quest 2 floor). An intensity-0 light still costs a shader slot — remove it, don't dim it.
- **No fixed-vignette overlay for style.** Drama comes from diegetic lighting — pools of lamplight, never post-process darkness — so the image is brightest at focal points. Luminance audit: exhibit focal point ≥ 3× ambient dark surround. (Comfort language is never borrowed for style.)
- **Silence is designed, not default.** Sacred rooms cap concurrent audio layers; the burial chamber's hush is a composed choice; relic inspection ducks the bed 60% so the object speaks first (audio brief). Sound and light are one instrument.

## 5. Performance as an artistry constraint

- **Beauty within the budget IS the bar** (benchmark bar rule 8): lighting composition > atmosphere/particles > material detail > geometry — in that order, always. Any review that asks for "more polys" first is mis-scoped.
- **The miser's rules are artistry rules:** every light is a tax on every pixel — want a seventh, delete one or bake it. Draw calls are rent; triangles are cheap — merge first, decimate second. Never pay per-frame for what can be paid once — shadows, lightmaps, canvas text, impostors are build-time costs, free at runtime. Hitches are the only unforgivable sin — mask, stream, compile early; one relic per frame, forever.
- **Measure in the headset or it didn't happen.** The `vr-perf-overlay` gate (p95 ≤ 13.9 ms, in-headset, Quest 2 floor device) is an artistry gate, not merely an engineering gate. A room that misses its budget is not "unoptimized" — it is unfinished.
- **Living exhibits get micro-budgets** (≤ 60 stereo draw calls, ≤ 150k tris, ≤ 32 MB textures, zero own lights). An exhibit that cannot fit does not ship; the room's beauty is never sacrificed for the exhibit. If a room plus its living exhibit exceeds the Quest 2 ceiling, the exhibit drops to L2 impostor until the visitor approaches within 4 m.

---

*Addendum ends. The standard is not lowered for the medium — the medium is mastered to meet the standard. — The Divine Archives.*

---

## ALIGNED 2026-11-01 — the Shiva floor and the Cinematic Floor, in-headset

*Appended on the program's reopening; the sections above stand. Full gap map: `../files/vr-standards-alignment-2026-11-01.md` §§2, 4.*

**Shiva is the design floor in VR too** (Carter, 2026-10-27: every piece meets or exceeds the true-source Murudeshwar Shiva scan). In-headset readings of that floor:

- **Close-zoom hold = arm's-reach hold.** The museum's close-zoom standard (§1's hero-surface rule) is the Shiva floor at VR distance: a relic, fig face, or plaque brought within inspection range (< 2.5 m, the budget's L0 tier) must hold — face, hands, surface — the way Shiva's face holds at close zoom. An asset that dissolves at arm's reach is below the floor, however well it reads across the room.
- **True source first.** Hero assets trace to the real object (scan, record, primary text) before any hand-work, exactly as on the flat side; renditions are labelled renditions (pilot spec §4 grammar). L2 impostors stay silhouettes, never pseudo-detail (§2 stands).
- **The floor device is the judge.** The hold is certified in-headset on the Quest 2 floor device — the weakest display a real visitor brings — not on a desktop monitor.

**The Cinematic Floor in VR** (Carter, 2026-10-31: cinematography built in from the first frame — camera, light, movement, depth, pacing — not a post-hoc test). Reconciled with §3 and §4 above and with the miser's rules:

- **"Camera" in VR is composition, never motion of the visitor.** The comfort ban list (comfort brief §a.6) outranks cinema: no forced camera movement, ever. The cinematic work is done by sightlines, reveals, and scale (§1 dual-scale, pilot spec §3 sequences) — the visitor's own head is the camera; the room is what's shot.
- **Light graded for the weakest display.** Chiaroscuro (§4) is graded so focal detail survives the Quest 2's dimmer panel and Carter's dark-rendering Galaxy preview — shadows lifted, never drowned black, exactly the Cinematic Floor's phone-grading rule. The §4 luminance audit (focal ≥ 3× surround; no focal frame below 2 nits) is the measuring instrument.
- **Movement is the world's, honestly sourced:** dust in light shafts, torch flicker, water, the sky — air that moves where the scene truthfully has it. Nothing flat or frozen; nothing invented for spectacle.
- **Depth is already the doctrine:** density-per-gaze + dual-scale (§1) is the floor's foreground/middle/distance, paid for inside the budget.
- **The first-seconds hook is a sightline:** the Rotunda's warm Wing II portal against eight veiled ones, the Ishtar Gate's blue wall, the star ceiling after the descent — the hook comes from the scene itself, per the floor's rule, never from a trick.
- **Honesty guards bind in-headset:** attested scenes only; no invented storylines, dialogue, or events; the wonder register only.
