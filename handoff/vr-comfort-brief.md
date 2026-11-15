# Comfort Warden — Normative Report (supporting input for merge)

Received 2026-10-12. Target: Quest 2 floor / Quest 3 primary, first-time VR users, wonder-first audience. All numbers normative; the Interaction Choreographer builds on them.

## (a) LOCOMOTION NORMS (for vr-interaction-spec.md)
1. **Default: arc teleport only.** Arc: quadratic-bézier, max range 8 m; landing marker = soft elliptical ring (no targeting reticle clutter); fade-to-dissolve transition 150–250 ms. Why: teleport eliminates continuous visual flow (primary nausea driver). Test: 10 first-time users, 5 min of room-hopping, 0 reports of dizziness.
2. **Smooth locomotion is opt-in only**, behind a settings panel that warns "more intense." Why: Meta's locomotion guidance defaults to comfort-friendly options. Test: opt-in must require 2 deliberate confirmations; default session never shows smooth stick.
3. **Snap turn default: 30°** (15° alternate setting), snap completes ≤80 ms, **cooldown 250 ms between snaps** *(cooldown settled by the 2026-11-01 amendment pass — this brief previously set none; the longer of the two colliding spec values survives because rapid repeated snaps are the comfort risk)*. Why: discrete steps avoid sustained optic flow. Test: no user-visible frame drop during snap.
4. **Smooth turn restricted**: only with user opt-in; yaw ≤ 45°/s, linear accel ≤ 4 m/s² (velocity ramp 0→2.0 m/s over 1.0 s), max velocity 2.0 m/s. Why: keeps vestibular mismatch sub-perceptual. Test: SSQ nausea subscale delta < 5 pre/post.
5. **Horizon lock: absolute.** The world horizon never pitches/rolls with the user; camera roll from locomotion = 0°. Why: tilt mismatch is the fastest queasiness trigger. Test: gyro-instrumented audit, zero roll during any movement.
6. **Ban list (non-negotiable):** never forced camera motion (no cutscene flythroughs, no auto-dolly); never falling (no pits, drops, vertical falls — even short); never vehicle-style movement (boats, chariots) without explicit consent; never camera shake, head-bob, or strafing-drift. Why: each is a documented discomfort vector. Test: design review checklist + code grep for camera position animation on tick.

## (b) VIGNETTING (for vr-interaction-spec.md + vr-architecture.md)
7. **Dynamic FOV reduction during any artificial motion** (smooth locomotion opt-in, snap turn — *teleport excluded: see §b.8; the former "teleport dash" in this list contradicted §b.8 and is struck, AM-COM-01*): onset ≤ 100 ms, strength 40–60% edge darkening at full effect, symmetric exponential fade in/out over 300–400 ms. Why: reduces peripheral optic flow (Meta docs cite vignettes for motion-sickness reduction). Test: enable during movement, confirm full clear ≥ 300 ms before user can read a plaque.
8. **Teleport gets NO vignette** (dissolve fade covers it). Why: no continuous flow exists to suppress. Test: verify vignette state machine skips teleport events.
9. **Static vignette for chiaroscuro: REJECTED as a fixed overlay.** Drama is delivered via *diegetic lighting* (pools of lamplight, not post-process darkness) so the image is brightest at focal points; an always-on vignette would read as a comfort cue and train users to expect queasiness. Why: comfort language must never be borrowed for style. Test: luminance audit — exhibit focal point ≥ 3× ambient dark surround.

## (c) TEXT READABILITY MINIMUMS (museum is text-rich — weight accordingly)
10. **Body text: ≥ 1.3° of visual angle** cap-height equivalent (~2.4 cm cap height at 1 m); titles: ≥ 1.8°; small captions minimum 1.0° (never below). Why: XR research recommends 1.2–1.3° comfortable body, 1.8° comfortable reading, minimums near 0.8–0.9° — we hold the comfortable end on a text-rich site. Test: Quest 2 legibility check, 12 pt-uncorrected fonts pass at plaque distance.
11. **Contrast: ≥ 7:1 body, ≥ 10:1 captions** (WCAG AAA level in-headset, per reading study findings). Why: dark chiaroscuro environments erode contrast budgets. Test: measured on-device with headset-captured screenshots, worst-lit plaque still passes.
12. **Reading distance: 0.8–2.5 m**, ideal 1.2–1.8 m. Plaques auto-face the reader and re-center when read from >2.5 m (or gently invite one step closer). Why: beyond 2.5 m angular size collapses; closer than 0.8 m causes convergence strain. Test: place 60 test plaques; 100% readable without crouching or backing up.
13. **Line length: 40–60 characters**, 2.2–3.0 m panel width max, left-aligned. Why: long lines force head-swing reading = neck fatigue. Test: eye-track or manual count of head-turns per paragraph < 3.
14. **Plaque placement:** center of panel at 1.35–1.55 m standing (0.9–1.1 m seated), tilt back 5–10° when below eye level; never place text above 30° or below −40° vertical FOV. Why: keeps text inside the comfort zone for gaze. Test: seated + standing volunteers, neck-angle sensor under 20°.

## (d) ACCESSIBILITY
15. **Seated mode:** when `local-floor` unavailable or user selects seated, eye height falls back to 1.2 m and all interaction/plaque heights re-anchor. Why: Meta VRC accessibility expectation. Test: full tour completable seated with zero unreachable elements.
16. **One-hand operation:** entire museum (move, read, select, back) on one controller; dominant-hand toggle in settings. Why: VRC accessibility requirement. Test: one-handed pass of core loop by QA.
17. **Color-blind-safe wayfinding:** wing colors must differ in luminance ≥ 3:1 *and* carry shape/icon redundancy — never color alone. Why: ~8% of male visitors; color-only cues fail. Test: simulator pass (deuteranopia/protanopia/tritanopia) with wayfinding intact.
18. **Subtitles/captions:** every audio line gets a caption hook (dialogue panel + caption log), toggled in settings. Why: app should be playable without audio (VRC.Quest.Accessibility.1). Test: mute headset, complete an audio-led exhibit.
19. **Photosensitivity:** no flashes > 3 Hz, no full-screen strobe ever, fade transitions ≥ 150 ms, particle flicker capped at low contrast. Why: seizure safety + comfort. Test: Harding-style flash audit on all transitions.
20. **Session length:** soft guidance at 30 min, firm nudge at 45 min — diegetic: rotunda benches glow warm with a "Rest. The archive will keep." prompt. Why: fatigue compounds discomfort. Test: 45-min user sessions, prompt appears without breaking immersion.

## (e) COMFORT ARTISTRY
21. Teleport dissolve = **incense-smoke fade**: soft particle exhale, warm lamp-light blooms in. Comfort mechanism becomes solemn ritual, on house voice. Test: users describe the transition as "peaceful" unprompted.
22. **Never startle:** nothing appears/disappears within 2 m of the user; reveals happen ≥ 3 m away or above eye level with an audio herald (soft chime, not sting). Why: startle spikes heart rate and breaks trust in first-timers. Test: scripted walkthrough, zero jump-scares by reviewer panel.
23. Darkness is *directional*, not global: chiaroscuro survives because light pools guide the eye; total black frames banned. Test: no frame drops below 2 nits in focal regions.

## (f) ARCHITECTURE HOOKS
24. **Per-user comfort settings persist locally** (localStorage/WebXR session profile), never leave the device — the Framework has no accounts. Why: privacy posture + Meta's "remember user choices." Test: revisit after reboot; settings restored, no network call.
25. **First-session defaults = maximum comfort:** teleport + 30° snap + dynamic vignette + seated prompt + caption option surfaced on first entry. Why: we design for the most sensitive visitor first. Test: fresh profile walkthrough, zero comfort regressions.
26. Comfort preset switcher (Comfort / Balanced / Adventurous) must switch live, no restart. Test: mid-session switch applies within 2 s.

## (g) ALIGNED 2026-11-01 — readability after the museum walk

*Appended on the program's reopening. Full gap map: `../files/vr-standards-alignment-2026-11-01.md` §6.*

27. **The gloss rule (new, normative).** A cold term is glossed in plain words at its first use on any plaque, stele, or book page — in VR and, via the flat-mode parity contract, on flat surfaces too. The 2026-11-01 walk found visitors stopped cold by unglossed terms (the found five: Ma'at, Demotic, greywacke, gematria, Gravettian). This is Carter's plain-language law applied to the walls; a gloss is part of the text budget (§c), not an addition to it.
28. **Silence loses nothing — keep it that way.** The walk's deaf visitor lost no essential information anywhere on the flat side: everything functional is text, sound is atmosphere only. That is now a stated invariant for this program: no fact, direction, or warning may be carried by sound alone in any mode (the audio brief's visual-equivalent and caption rules are its enforcement). §18's caption hooks are load-bearing, not decorative.
29. **The flat-side readability faults are this brief's faults too.** The walk found pale italic footnotes, tiny gold category labels, and faint small signs failing real readers on flat screens — the exact failures §c.10–11 (angular minimums, ≥7:1 / ≥10:1 contrast, worst-lit-plaque measurement) exist to prevent in-headset. Via parity, the same minimums are the floor for any text surface the dual-mode build renders flat.
