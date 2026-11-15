# VR Roadmap — Divine Archives Museum (dual-mode WebXR)

**Status: REOPENED 2026-11-01** (Carter's order — the program was parked 2026-10-17; he took it out of its parked position today). SPEC ONLY — Muse-side planning. Claude Code implements per phase in repo `carterdaniel630-cmd/the-divine-archives`.
**Queue placement (2026-11-01):** in line BEHIND the current build line — the merge stack, armory batch 1, the Divine Casualties upgrade, the Keeper production build, and the Yoruba chapter. The council pipeline on the pilot spec (Craft Council lens review → High Council ruling) runs first; no implementation until the ruling lands and Carter gives the build its own yes.
**Standards alignment (2026-11-01):** this roadmap and its supporting docs were checked against every standard the project adopted after the specs were ratified (2026-10-12). The gap map and corrected rules live in `../files/vr-standards-alignment-2026-11-01.md` — read it alongside this roadmap; where the two disagree, the alignment doc's dated corrections govern until the councils fold them in.
**Standing rule:** the museum itself goes dual-mode — one build, walkable flat-screen or in a VR headset. No separate replica.
**Carter owns every decision gate below.** Nothing proceeds past a gate without his word.

---

## The pipeline (every phase, every wing, every exhibit)

1. **VR team writes the spec** — analysis and design only. Muse never implements; Muse never touches the repo.
2. **Craft Council lens review** — the 11 lenses (Artisan, Art Director, Designer, Mechanic, Lorekeeper, Soundscape, Performer, Skeptic, First-Timer, Wordsmith, Humanist) audit the spec; highest-impact corrections recorded.
3. **High Council audit** — three auditors: Security, Sourcing, Consistency. Rulings: UPHELD / DISMISSED / ADVISORY. A DISMISSED sourcing finding blocks implementation. No exceptions.
4. **Claude Code implements + verifies** — in the repo, against the spec's acceptance criteria, **in-headset on the Quest 2 floor device**. Desktop Chrome numbers do not certify anything.

---

## Phase 0 — The Pilot: Rotunda + Bronze Age wing

**Scope:** Four spaces — the Rotunda entry atrium, the Wing II atrium, ch02 Egypt, ch03 Mesopotamia (Wing II · The Bronze Age). Exact scope, presence design, Lorekeeper verdict, acceptance criteria, and living-room insertion contract: `vr-pilot-spec.md` §§1–7.

**Dependencies:** `vr-architecture.md` (session lifecycle, rig, input profiles), `vr-interaction-spec.md` (action table, diegetic UI, luminous presence), `vr-comfort-brief.md` (locomotion norms, readability minimums), `vr-performance-budget.md` (frame ceilings, miser's rules), `vr-audio-brief.md` (procedural audio, reverb zones), `vr-benchmark-brief.md` (bar rules). Wing JSONs: `rotunda.json`, `02-bronze-age.json` (read-only, `ref: main`).

**Decision gates:** pilot spec ratified 2026-10-12; **amended in one Carter-approved pass 2026-11-01** (amendment log: `../files/vr-pilot-amendment-log-2026-11-01.md`) after the first council ruling returned Sourcing DISMISSED and Consistency DISMISSED. High Council must issue its **re-ruling** on the amended spec before Claude Code starts (spec §5, criterion 8 — as amended, a DISMISSED finding from **any** of the three auditors blocks).

**What it proves for Phase 1** (pilot spec §6): hub-spoke portals + veiled future portals; relic prop system at 3 scales (slab, scroll-vitrine, architectural); fig plinths ×17 (the component the full 199-fig Pantheon needs); verticality in both directions (tomb descent + ziggurat ascent — the highest-risk VR mechanic, retired first); chiaroscuro lighting rig; the honest-evidence grammar (the marker device — carved shape + word + colour: ATTESTED / RECONSTRUCTED / RENDITION / ORIGINAL RENDERING / AWAITING REVIEW); living-room sockets ×3 (`mehen`, `senet`, `ur` — with `ur` mounted live as the contract's first proof); the phone-class envelope held on Quest 2 / Galaxy S22-class.

**Exit criteria:** pilot spec §5 — all 16 acceptance criteria green, in-headset on the Quest 2 floor device.

---

## Phase 1 — Wave 2 wings: Axial Age + Prehistory

**Scope:** Wing IV · Axial Age (ch10 Second Temple Judaism, ch15 Classical Greece) and Wing I · Prehistory (ch41 Paleolithic, ch42 Neolithic). The pilot's contracts repeat unchanged: same portal grammar, same evidence markers, same living-room socket contract, same orientation ritual.

**Dependencies:** Phase 0 exit. Wing JSONs for ch10, ch15, ch41, ch42 cleared at manifest level or better.

**Decision gates:**
- **DG-1 (Carter + Lorekeeper): the aniconic sacred-space problem.** ch10's Second Temple room must hold presence through absence, not statuary — the hardest design problem in the wave. Approach approved before any geometry is built.
- **DG-2 (Performance Sculptor):** Prehistory's cave-painting chiaroscuro must fit the phone-class budget — atmosphere and capped particles (benchmark brief: Lucent verdict), never geometry density.

**What it proves for Phase 2:** the wing factory — a repeatable per-wing build cadence with known costs; the aniconic design pattern for sensitive sacred spaces (reusable wherever reverence forbids representation); the theme-room composition variant if a theme room ships in this wave.

**Exit criteria:** `vr-perf-overlay.md` gate checklist green per room on Quest 2 (p95 ≤ 13.9 ms, draw calls / tris inside ceilings, zero >20 ms frames after entry fade); High Council sourcing review on all newly embodied content; zero invented content — every element traces to a wing-JSON id.

---

## Phase 2 — All 83 rooms

**Scope:** the remaining wings, wave by wave; the 7 Rotunda theme rooms (comparative composition variant — parallel tradition bays, no syncretic blending, per pilot spec §2); living-room docking for the 10 exhibits per the insertion contract (pilot spec §7) as each exhibit clears its own integration review.

*Aligned 2026-11-01 — counts are living numbers:* "83 rooms" is the count live today (83 chapters live on the site). The Yoruba chapter is approved for build as the 84th; when it stands live it enters this phase's scope automatically. Read every count in this program as "rooms live at build time," never as a frozen 83. (Full counts refresh: alignment doc §8.)

**Dependencies:** Phase 1 exit. All wing JSONs. Living-room `CONTRACT.md` published (`vr-architecture.md` §8, step 11). The 10 exhibit modules shipping against their micro-budgets (≤60 stereo draw calls, ≤150k tris, ≤32 MB textures, zero own lights — performance budget §8).

**Decision gates:**
- **DG-3 (Carter):** wave order for the remaining wings.
- **DG-4 (High Council):** per-wave sourcing audit — the structural rules hold at scale: no relic outside its home room; pending-review plaques wherever `pending: true`; era labels never misdate objects.

**What it proves for Phase 3:** the complete single-user museum — the full 83-room graph navigable dual-mode; portal-culling resident-set discipline at scale (current room + 1 ring + spine); wing-transition masked loading proven across era boundaries. The presence seam (`LocalPresenceProvider`, architecture Appendix C.3) has shipped in every room since Phase 0 — Phase 3 is a provider swap, not a rewrite.

**Exit criteria:** all 83 rooms navigable in both modes; per-room perf gate on Quest 2; the directory, mosaic, and Ariadne's thread resolve across all wings; flat-mode parity contract holds (interaction spec §8).

---

## Phase 2B — WebGPU enhancement tier (flat-mode)

**Scope:** a renderer tier inside the one build — same scene graph, same rooms, same data, two GPU paths selected at runtime by feature detection. WebGL2 stays the ship path (maximum reach, the XR session path); WebGPU becomes the flat-mode enhancement tier where `navigator.gpu` yields a usable adapter. Full analysis, support matrix, standards fit, architecture change, and acceptance criteria: `vr-webgpu-brief.md`. Carter's order 2026-10-13 ("add webgpu").

**Why here:** Phase 3's pilgrim-lights are a compute-shader workload — this tier is the runway they take off from. It also buys ~45% frame-time headroom (GL2GPU, ACM 2025) the artistry budget can spend inside the phone-class envelope.

**Dependencies:** Phase 2 exit. `vr-webgpu-brief.md` through the pipeline (VR-team review → Craft Council lenses → High Council audit).

**Decision gates:**
- **DG-W1 (Carter):** approve the tier + the sequencing (WebGL2 pilot first, WebGPU enhancement after) — or countermand with pilot-on-WebGPU (not recommended: gates reach).
- **DG-W2 (Performance Sculptor):** the tier's frame budget — p95 must improve-or-hold vs the WebGL2 baseline on Carter's S22 before it ships to visitors.
- **Standing:** no exhibit migrates until the museum tier proves out on the Quest 2 floor device + the S22. The pilot (Phase 0) is untouched and ungated by this phase.

**What it proves for Phase 3:** compute-driven atmosphere (incense, gold dust, lights) at phone-class cost; TSL NodeMaterials for richer PBR without hand-written WGSL; the renderer factory + fallback as a reversibility contract (forward = adopt tier, reverse = WebGL2).

**Exit criteria:** `vr-webgpu-brief.md` §7 — all 8 acceptance items green, including the in-headset `navigator.gpu` check on the Quest 2 floor device and the S22 p95 gate; High Council UPHELD.

---

## Phase 3 — First aliveness: lights on the map

**Scope:** presence layer v1 — pilgrim lights at two resolutions (map-table / God's-eye motes; in-room soft glows under the culling rules, interaction spec §9.3); pseudonymous pilgrim profiles **as settled 2026-11-01** (interaction spec §9.2/§9.4: radiance private and owner-only; remote rendering carries shade + tier at most; rooms-walked count and favoured wing are local or explicit opt-in, never broadcast by default; no displayed names); the Rotunda shade-selection brazier (§9.1); radiance tiers per the proposed table (§9.2), **pending Carter's ratification (DG-6)**. No voice, no chat, no gestures beyond the bow of light (§9.6). **High magic, no moderation surface** — lights cannot grief, so there is nothing to moderate. **Entry condition (binding, Security 2026-11-01): a fresh Security audit with an UPHELD ruling for this phase, and block / hide-presence + personal-boundary controls specified before build** (architecture Appendix C.8).

**Dependencies:** Phase 2 exit (the full graph gives the lights somewhere to be). Backend decision (DG-5).

**Decision gates:**
- **DG-5 (Carter): the first backend.** The site is static today; presence needs a minimal WebSocket fan-out server — ephemeral in-memory state, no persistence, no accounts, ~$5–20/mo at small scale (architecture Appendix C.2). Funding source confirmed before any build.
- **DG-6 (Carter): radiance tier definitions ratified** — thresholds, tier names, what feeds the flame. The interaction spec's table is a proposal, not a ruling.
- **Honesty rule (non-negotiable, High Council Security):** never fake presence. Before the backend exists, the museum shows nothing — no ambient-animation-as-people. If atmosphere is desired pre-backend it is labeled as animation, never as visitors.

**What it proves for Phase 4:** the presence pipeline end-to-end (broadcast → fan-out → render at two resolutions); luminous anonymity as an architecture (no identities to leak because none exist); the 10–15 Hz pose-update + interpolation model under load.

**Exit criteria:** 50 concurrent pilgrim-lights with p95 frame time inside budget on Quest 2; profiles viewable diegetically (gaze-hold bloom); High Council Security audit confirms zero stored personal data — nothing retained past the socket's lifetime.

---

## Phase 4 — The Living Archive (full social layer)

**Scope:** the social vision (`files/social-vr-vision.md`): debate halls in the philosophy and theology wings — proximity voice/text scoped to the hall, the speaking-flame protocol, hall-keeper gestures, the hall stele *"Speak as the schools spoke: of the thing seen, not of the speaker"*; shared pilgrimages — parties of lights traveling routes together; the soul you build — radiance tiers live, profiles growing with engagement; the bow-of-light greeting (§9.6). **Gate note (2026-11-01):** the debate-hall *contract* formerly carried in interaction spec §9.5 was struck in the amendment pass — halls enter this phase only through **their own re-specified proposal** (captioning, consent, defined/warned/appealable moderation, keeper authentication, rejoin-evasion — architecture Appendix C.8), audited fresh; nothing about halls is pre-wired by earlier phases.

**Dependencies:** Phase 3 exit. Backend hardened for the chosen scoping model (DG-7).

**Decision gates — all Carter-owned, all explicit:**
- **DG-7: private pilgrimage groups vs. public halls with strangers.** Private parties: invite codes, ~8–12 visitors, near-zero moderation, $5–10/mo. Public halls: the full "alive museum" vision, but name-free presence (no names, no free text — settled 2026-11-01), rate limits, kick tooling, and a named moderator. This decision drives the moderation, scale, and cost answers.
- **DG-8: debate facilitation.** Structured formats (turn-taking enforced, topics proposed) vs. open discourse with the evidence as the only referee.
- **DG-9: the moderation answer.** "Who keeps it sacred" — a named answer, funded and willing, before any public hall ships. High Council Security must see it; without it, Phase 4 stays private-parties-only.

**What it proves:** the end state Carter described — the archive as a living academy: anonymous and safe by design, evidence-anchored debate (the facts are in the room; you cannot run from them), pilgrimages together, the soul built through engagement. Pilgrims, not players.

*Aligned 2026-11-01 — Living Sites are a different population from pilgrim lights.* Carter's Living Sites direction (2026-10-31) puts era-true inhabitants — construction crews, townspeople living their lives — into the PILGRIMAGE areas, population not guides. That program rides the flat pilgrimage lane first (next buildout packet). Whether and when those inhabitants are embodied in VR pilgrimage spaces is a later Carter decision (alignment doc §7, OQ-3) — this phase's "pilgrimages together" is about VISITORS traveling as lights, and the two populations must never be conflated in spec or build: lights are guests; inhabitants are the era's own people, era-true from the record, never performed where the evidence is contested.

**Exit criteria:** a 12-light debate session with legible turn-taking and working keeper gestures; an 8-light pilgrimage party completing a route together; High Council UPHELD on Security and Consistency; radiance tiers ratified and rendering.

---

## Standing constraints (all phases, no exceptions)

- **One build, dual-mode.** Flat-screen and WebXR from the same scene graph, same rooms, same data. VR is an additional door, never a gate — every failure degrades to the complete flat museum.
- **Aligned 2026-11-01 — THE EVERY-SCREEN RULE binds this program** (Carter, 2026-10-31): layout rearranges per screen; weight adjusts to the device (Quest 3 rich tier / Quest 2 floor tier / lighter flat tier — the performance budget's tiers ARE this rule's weight ladder); and a simple backup always exists — the flat text Directory is that backup, and it must actually work in every space this program ships (see alignment doc §3).
- **Aligned 2026-11-01 — THE CINEMATIC FLOOR binds this program** (Carter, 2026-10-31): scenes are shot, not assembled — placed cinema light graded for the weakest display, real movement and depth, a first-seconds visual hook from the scene itself — inside the miser's rules, and never by moving the visitor's camera (the comfort ban list outranks any cinematic instinct). Honesty guards stand: attested scenes only, rendition labelling unchanged (alignment doc §4).
- **Aligned 2026-11-01 — pending review is a standing state, not a defect** (Carter's ruling): a pending-review room is a first draft approved, standing live BY DESIGN under constant review. The veil marker and threshold plaque carry that meaning — "newly added, standing by design, still being reviewed" — never the language of failure or warning-off (alignment doc §5).
- **Aligned 2026-11-01 — guide data comes from the Directory layer.** Any VR room guide, stele "Here" page, or directory surface binds to the same corrected data the flat Directory carries — never to a per-room guide list (the 2026-11-01 walk found the in-room lists straying in room after room while the Directory was correct in every checked case) (alignment doc §6).
- **Aligned 2026-11-01 — the Archivist lives here too.** The museum this program embodies now holds the Keeper, his Table, his Study, the Raven, and the Grader (design settled 2026-10-29 → 2026-11-01 — after these specs were ratified). The absorption map is alignment doc §9; the Table-in-pilot-scope question is OPEN and Carter's to rule (alignment doc §11, OQ-1).
- **Phone-class hardware is the ceiling.** Quest 2 floor must stay usable; Quest 3 is the primary target. Nothing is ever specced for high-end PCVR. The miser's rules (performance budget §8) are law.
- **Zero real-time shadow-casting lights.** All shadow as baked lightmaps / painted light pools + emissive materials (benchmark bar rule 1).
- **The content is the archive's.** Every surface traces to wing JSON, vault data, or primary texts. No invented glyphs, no fantasy filler, no relic outside its home room. The Lorekeeper's rules travel with every phase.
- **House voice on everything public.** Respectful, wonder-first, stoic. No personal name, no URL, no begging. Sign-off: The Divine Archives.
- **Carter's Galaxy S22 is a preview tier.** The magic-window path (architecture §7) must keep working so progress is checkable from his phone.
- **Muse specs; Claude Code builds.** Every deliverable in this program is analysis, design, and acceptance criteria. Implementation and verification live repo-side, after the councils.
