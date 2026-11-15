# Benchmark Hunter — Technique Brief (supporting input for vr-artistry-addendum.md)

Technique only; the soul stays Divine Archives. Received 2026-10-12.

## 1. RED MATTER 2 (Vertical Robot, Quest-native flagship)
Technique: custom-written shaders (not stock UE shaders) + emissive-driven "lighting": laser-scanner light that realistically bounces off nearby surfaces; window-light "melting" onto floors via lightmap-style baked pools; detailed character "optimized metahumans." Reflections fake, not real-time (cubemap/reflection-probe style).
Phone-class verdict: SURVIVES — built Quest 2-first; the lesson is baked/static light pools + custom cheap shaders, not more real-time lights.
Informs: architecture (shader strategy), performance, artistry.

## 2. LUCENT VR (Specoolar, Mar 2026, "prettiest Quest 3 experience" — UploadVR)
Technique: dense atmospheric particles + water shaders + high-contrast emissive skies (starfields, campfire, undersea) on baked/fake lighting. Beauty comes from atmosphere and color grading, not geometry.
Phone-class verdict: SURVIVES on Quest 3; Quest 2 floor should cap particle counts.
Informs: artistry, performance (particle budgets).

## 3. ASGARD'S WRATH 2 (Sanzaru, Meta's AAA Quest showcase)
Technique A — scale composition: dual-scale design — you shift between a mortal hero at ground level and a god overlooking the same terrain as a tabletop diorama. Vastness from scale contrast, not polygon count; runs 90fps on Quest 3.
Technique B — onboarding: rail-move intro on rails at constant speed (like a museum tram) — you absorb the world before being asked to learn controls; tutorial is a spectacular boss battle that teaches slashing; later controls map to real-world gestures (throwing axe, opening chests), no UI lessons.
Technique C — optimization: programmatic pipeline where design ships first and performance optimization is a separate later pass.
Phone-class verdict: SURVIVES standalone. Dual-scale is the cheapest "vastness" trick there is.
Informs: architecture (wing-scale contrast), interaction (onboarding), artistry.

## 4. GHOST TOWN (Fireproof Games, photo-realistic Quest standalone)
Technique: "keep the player close to surfaces" — art direction concentrates detail density where the visitor actually looks (documents, machinery, walls), so fidelity reads high while total poly count stays low; lighting composition does the heavy lifting.
Phone-class verdict: SURVIVES — this is the exact doctrine for 83 museum rooms: density-per-gaze, not density-per-room.
Informs: architecture, artistry.

## 5. DIEGETIC UI / TEXT (cross-title best practice)
Technique: read information off in-world objects (Red Matter's documents, tools-as-hands) instead of floating text bubbles; spatial UI only for attention-guidance (arrows, highlights). Text sized by angular measure — Distance-Independent Millimeters: ~1mm at 1m; Meta practice: keep panels 0.75–3.5m away, centered in the comfort zone in front of the user, high contrast, larger than you think. *(External practice summary — this program's governing numbers are the Comfort Warden's, §c: 0.8–2.5 m. AM-BEN-02.)*
Phone-class verdict: SURVIVES — it's design, not compute. Big win for house voice: exhibit labels as physical plaques/steles, not HUD.
Informs: interaction, artistry.

## 6. AUDIO THAT SELLS SPACE (Meta XR Audio SDK / Oculus Spatializer, native-tested)
Technique: HRTF spatialization for point sources (each exhibit's audio positioned at the object) + AmbiX B-format ambisonic bed for the room's base atmosphere + room-acoustics simulation (early reflections + late reverb modeled on actual room dimensions/materials) so the space itself "sounds" — a cathedral reverb vs. a crypt reverb tells the visitor the scale before they see it. Frontiers research (2022): head-tracked binaural + reverb measurably boosts immersion vs. flat audio.
Phone-class verdict: SURVIVES — HRTF + baked ambisonics run on Quest 2; full per-source real-time reverb is the cap item — use convolution-lite/room-model reverb with 1–2 simultaneous models.
Informs: interaction (spatial audio spec), performance (audio budget).

## 7. WEBXR EXEMPLAR — Meta's webxr-showcases + Fathom VR
Proves: browser VR is not a demo toy — full WebXR sessions (controllers, mixed reality, spatial audio via WebAudio + HRTF PannerNodes) run in the Quest browser and Apple Vision Pro Safari from plain web pages, no install. Fathom VR spatializes music clouds with WebAudio — our audio layer has a browser-native path. Three.js r186 + WebXR handles museum-scale rooms with baked lighting.
Phone-class verdict: THE FLOOR — this is exactly our stack; anything achievable here is achievable by us.
Informs: architecture (confirms stack choice), performance (browser VR budget proof).

## BAR RULES ("as beautiful as the best")
1. Zero real-time shadow-casting lights in any room on standalone; all light as baked lightmaps/lightmap pools + emissive materials + fake reflections (probe cubemaps).
2. Density-per-gaze, not per-room: hero detail only within arm's reach and on sight lines; corridors/streets get atmosphere (fog, particles), not geometry.
3. Dual-scale composition mandatory: every Wing must make the visitor feel small at least once — high ceilings, god-scale overlooks, or object scale contrast.
4. Onboarding is composed, not a ride *(rule replaced 2026-11-01, AM-BEN-01)*: the first 60 seconds are a **stationary, composed arrival** — the visitor is planted, the sightline does the pulling (oculus shaft, one lit portal), and light travels instead of the visitor; gestures are taught by doing (one object, one gesture), never a UI panel. The former rule — "first 60 seconds = guided rail/tram sequence with no required input" — is **struck**: it prescribed forced camera motion, which the Comfort Warden's ban list (§a.6, non-negotiable) forbids. *[Aligned 2026-11-01 — read this rule through the Comfort Warden's ban list, which outranks it: NO forced camera motion, no cutscene flythroughs, no auto-dolly (comfort brief §a.6). The pilot spec already resolves the tension Carter's way — the arrival is a composed sightline and a visitor-paced orientation ritual at the Rotunda lectern, not a ride the visitor is carried on. This rule survives as "the first sixty seconds are composed, guided, and teach by doing" — the guidance is architecture and light, never locomotion imposed on the visitor.]*
5. Text only as physical objects (plaques, steles, codices) at **0.8–2.5 m** *(amended 2026-11-01, AM-BEN-02: this brief's §5 summary quoted 0.75–3.5 m from external practice; the Comfort Warden's §c.12 governs this program — 0.8–2.5 m, ideal 1.2–1.8 m)*, sized by angular measure — no floating HUD text, ever.
6. Every room gets an acoustic identity: **per the audio brief's caps, which govern** *(amended 2026-11-01, AM-BEN-02)* — a stereo ambience bed per room + positional point sources at key exhibits **within the cap (≤ 6 emitters per room, ≤ 3 HRTF)** + generated reverb matching the room's real volume. (The AmbiX B-format bed this rule formerly required is an external-technique summary; the program's own audio brief specifies the stereo bed, and a benchmark does not outrank the brief.) Silence is designed, not default.
7. If a technique needs PCVR (real-time GI, dynamic shadows on everything, RTX volumetrics), it's discarded — the bar is "what Vertical Robot shipped on Quest 2," not PC specs.
8. Beauty budget priority, in order: lighting composition > atmosphere/particles > material detail > geometry. Any review that asks for "more polys" first is mis-scoped.
