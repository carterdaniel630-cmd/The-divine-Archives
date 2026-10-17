# ADVISORY BRIEF FOR CARTER — Divine Archives Full-Group Audit

**Convener pair: June + Paul (acting jointly as ONE convening task)**
**Date: 2026-10-15 | Agents aggregated: 26 independent briefs + Sam relay**
**Scope compliance:** Read-only on GitHub. No Instagram touched. TikTok from Carter's reports only, not touched. No contact outside. No excluded material.

**Roster covered:** Joe/Rosa (Video Editing), Stan/Dean (Audio), Marcus/Vera (High Council), Mara/Iris (Occult & Pagan), Cole/Finn (3D Museum, Pilgrimage & Relics), Nora/Beth (Atlas, Mapping, Wayfinding & Directory), Ruth/Glen (Research & Development), Sara/Tess (Religions), Owen/Hugh (Philosophers & Philosophy), Leo/Milo (Games & Arcade), Clara/Nina (Vault, Pantheon & Symbols), Hank/Wade (Chapters & Content), June/Paul (Convener).

**KNOWN GAP — stated honestly:** For Joe and Rosa, only their addenda are visible post-compaction (Joe: scene-change measurement; Rosa: audio measurements). Their main briefs' substance is included in the consolidated summary treated as the record. For Nina, her addendum corrections supersede the corresponding "Unverified" lines of her main brief. This brief does not invent brief content beyond what was given.

## 1. ADVISORY BRIEF

### Bottom line

The core collections are sound. The public-facing violations and the build queue are not.

Vault 88, Pantheon 199, and Atlas arithmetic (83 museum + 73 pilgrimage = 156) all verify by independent counts. Chapter anatomy, house voice, and honesty labeling hold where checked.

What is urgent is not a new build. It is: (1) live policy violations on the homepage and in code, (2) a ready-line that contradicts itself and still assigns work to the friend ruled out 2026-10-13, and (3) a token queue with ~20 items, 5 open PRs, and no dated reset, owner-per-item, or triage rule. Most ambitious work — Rotunda wheel, Ouija fix, Debate Hall, Directory, VR — is blocked on small, auditable inputs (audited glyphs, canonical room registry, glossary), not on bigger ideas.

### What is solid

- **Vault:** 88 verified three ways — repo v01–v88 consecutive, 88 hrefs in `vault.html`, era nav 3+5+6+14+16+8+15+11+10 = 88, filter sums 34+24+30 = 88. All 88 IDs appear in at least one museum room's `homeVault/seeVault`. Sampled V01 Voynich, V04 Shroud, V72 Book of Shadows honor the evidence standard in full (holders, dating limits, unresolved disagreements left unresolved). V88 correctly flagged "Recently added · pending review."
- **Pantheon:** 199 verified — JSON-LD `numberOfItems` 199, `itemListElement` length 199, 199 unique names, 199 body cards. Manifest references 199 distinct figure IDs. YHWH entry is the correct template for the Content Truth aniconism exception, with reason stated on the face of the entry.
- **Chapters / voice:** Chapter anatomy + Truth Policy in practice (Egypt ch02, Flood ch01). House voice holds in scripts. Pending-review badges consistent across surfaces (17 pending / 66 published / 83 total). Ra-Horakhty correction exemplary in form.
- **Honest models:** Solomonic Ritual Space is the honest-practice model (bounded, labeled, sourced, reversible) and the hygiene exemplar (no CDN found). Production `museum.html` correctly vendors Three.js. Gematria volvelle states on its face, twice, that it is a modern devotional instrument, not a historical replica — the labeling standard every invented/reconstructed artifact should meet. Games honesty labeling (attested vs. reconstructed) is strong and must survive rework. Atlas sync arithmetic verifies.

### What is broken

**Live policy violations — visitor-facing, now:**
- Homepage arcade blurbs use trademarked names / "-style" phrasing banned by the binding Naming & IP Policy (2026-10-13). Found independently by Owen, Vera, Cole, Leo, Milo, Hank, Wade, Mara, Tess, Sara.
- Blurred symbols baked into `.webp` sprite sheets — an open Content Truth violation. Defect file's directive stands: unblur or replace; gray splotches are not an acceptable third option.
- Internal Naming/IP violation: `docs/assets/games/pacman.js` + catalog `{ id: "pacman" }` survive, though visitor-facing title is compliant ("The Labyrinth"). Policy scopes itself to code identifiers and file names too. All other 11 catalog titles Clara read are generic.

**Build hygiene:**
- CDN / external-dependency violations of Modular Framework Clause 1: Ring of Solomon (Three.js via CDN), Grimoire (Three.js CDN + Google Fonts), Debate Table v3 (Three.js via unpkg), Ouija (Google Fonts), Oracle Bones / Library Rescue (Google Fonts). Library Rescue still contains Google Fonts `@import` despite a zero-external claim.
- Production `museum.html` vendors Three.js correctly — the violation is in previews/exhibits, not the museum core. Finn: production `app.js` sets mobile DPR cap 1.5 on touch, violating the 1.0 standard. `relics.js` (160,969 bytes) shows 0 dispose matches — needs code trace, not grep verdict. VR `m_app.js` has zero WebXR calls: designed, not built.

**Ready-line / queue:**
- Ready-line is self-contradictory and disordered: still assigns work to the friend (ruled OUT 2026-10-13); Library Rescue listed as both open (§3) and decided (§14, hybrid accepted + upscale); numbering runs 1–11, then 14–16, then 12–13, then 17–20; Protection duplicated (§1 and §20). Grimoire rebuild has no queue slot. Hiss file body still says "Replace it" against the removal order.
- Token queue is the binding bottleneck: ~20-item ready-line, 5 open PRs, main last merged ~2026-10-12, no dated reset, no owner-per-item, no triage rule. No fallback builder authorized. Carter is sole approver + sole courier + sole publisher.

**Museum defects still open:**
- Hallway hiss: `brook()` generator still on main per Finn/Stan/Dean/Marcus, assigned to all 9 corridors + rooms + fountain reuses `brook`. Defect file mislabels it: no `babble()` function; technique lives inside `brook()`. See Divergence Matrix — listen-verification is missing.
- Rotunda zodiac glyphs explicitly unaudited. Current ring of lights too high under planetarium; floor-wheel redesign is cosmologically sound but blocked on audited glyphs.
- Museum symbol walls: 528 labeled cells, 17 unaccounted grid slots, 5 of 9 wings covered (Wings I, VII, VIII, IX have no wall files — repo does not say whether they display differently or not at all).

**Atlas / Directory / Wayfinding:**
- Grand Directory preview shows 76 rooms (missing the 7 Rotunda rooms) vs. spec 83. Wing date bands contradict each other across artifacts (Wing IV ends 200 BCE vs. 200 CE; Wing VI 600–1000 vs. 800–1100, etc.). Pilgrimage Era vs. chapter Wing are two dating logics sharing one vocabulary. Legend systems fragmented. Practice markers approved 2026-10-14 are absent from preview. No native scripts in mapping data; endonym/exonym use inconsistent with no stated rule. Atlas has no visited/progress tracking; pins in-memory only. Atlas sync surveyed 2026-10-12 (3 days stale at audit). No canonical room registry across Atlas / Directory / Debate table / VR God's Eye View. `/arcade/` returns 404 (games live under `symbols.html#play=...`). Videos name no museum room (spoken wayfinding deferred).

**Games / Arcade:**
- 25 games verified distinct in rules, but differentiation brief NOT yet implemented in files (Pachisi still 2-player simplified, Yut still 2 mals/side with no team mode, Konane/Go palette identity not carried). Uniform dark-museum + gold art direction is the similarity driver.
- **TWO ARCADES, UNRECONCILED:** 12 live genre-reskin games (Pong/Snake/Pac-Man-maze/pinball/Minesweeper/Risk-style/Indiana-Jones-style) vs. 25 staged historical games. Carter's vision (historical forms, not retro cabinets) matches the 25 and contradicts the 12. Games are orphans (no chapter/museum links in sampled files). Playability floor uneven (undo missing in 5, difficulty in only 4, tutorial in only 4). Teardown/dispose unconfirmed. Yut/Rithmomachia phone tap targets below 44px.

**Videos / Audio:**
- Single TTS voice everywhere; all videos mono 24 kHz. Loudness spread ~10.3 dB (Eye of Horus mean −20.5 dB, max −0.4 dB near clipping; Lotus mean −30.8 dB). No normalization step, no audio QA gate, no pronunciation control for sacred names.
- Burned-in captions only on the 4 newest one-off videos (~26 of 30 posted lack them), no SRT/VTT sidecars. Facebook's own ASR garbles the sign-off ("The Divine R Archives"). No music bed/sound effects in any video (Shamanism video has no drum despite drum-driven topic). Craft-notes "VARIED FEEL" has no voice/music mechanism (one voice, no music).
- Queues empty at audit (pending 0, approved 0, posted 30) — consistent with between-batch drain, not proof of stall. Posted-log counts disagree across sources (briefing 27 vs. folder 30 vs. log 29 events). Ra-Horakhty correction has NO posted-log entry (shipped manually by Carter). Direct-post bypass around review-first has no written rule. Facebook reach near-zero on sampled posts (Rosetta 123 views standout). Distribution cron failed/partial 2 of 3 runs (semi-manual, not unattended).
- Music correctly parked: 5 rounds rejected; phone-speaker physics (roll-off below ~200 Hz; depth from harmonics) is the recorded lesson. Pitches are 42–52 s loops, no reference track, no seam measurement. Synthesized sacred instruments (Powwow drum highest sensitivity, Mokugyo, Daf) need tradition-specific review. No reopen trigger/owner. Museum sound: `sound.js` architecture sound (Web Audio, gesture-start, toggle persists) but hiss generator is systemic; no volume control, no per-room control, no text equivalent; hum/cave/embers layers are sub-phone-range. Artistry + Modular standards contain zero audio parameters. Practice renditions have zero audio decisions — highest-risk audio gap.

**Philosophers / Debate Hall:**
- Research strong (108 entries verified by count; misattributions audited; entanglements retained). Blockers: only Augustine has a debate corpus (1 of 108); preview has 7 flames, 3-turn cap vs. spec 6-offer/12-max, regex classifier not a move classifier, no source shelf / quote-catcher, histogram decorative, bookmark round-trips raw HTML (self-injection hole), compare-well PARAPHRASE entries contain quotation marks (spec forbids). Plaque-map uses a wing scheme that does not exist (civilization wings + rooms like Academy/Lyceum/Miletus vs. real 83-room Nine Wings). All 108 pantheon entries have pending link targets. Translation-licensing legal review still pending (in-copyright translations recommended in era reports — Kaufmann Nietzsche, 2011 Beauvoir, Pinkard Hegel, etc.). Delphic Oracle missing from live Pantheon (Thoth + Norns present) against the ruling that all three oracle spirits be represented. Ra-Horakhty correction has not propagated (Pantheon/Museum still list "Ra").

**Religions / Occult:**
- Chapter architecture strong (variant naming inside chapters: Islam/Christianity/Judaism/Buddhism each split across multiple chapters; ch33 African Traditional Religion caveat is the model). BUT practice-renditions goal file still lists generic "Muslim prayer, Jewish prayer, Christian prayer, baptism, communion" with no variant lists. No sensitivity matrix / procedure maps / insider-review requirement exist (briefs/ + files/ empty). Content Truth "no pulling back" collides with veiling — needs a Show / Veil-with-reason / Withhold protocol.
- Ouija board is a syncretic composite (Delphic + Thoth + Nornir on one 19th-century Spiritualist board) needing labeling as archive invention + simulation disclaimer + vulnerable-user (grief) framing. Ouija history entirely absent from the exhibit (no 1890–91 patent, parlor game, Parker/Hasbro, Spiritualism, ideomotor). Answer engine undisclosed in-session. "Ouija" title itself needs a Consistency ruling (trademark; factual-reference exception vs. rename to "Spirit Board"). Flame law needs scoping (Pantheon Thoth ibis-head emblem vs. flames-not-faces; Goetic spirits scope unresolved). "Light and Dark" ruling risks moralizing pagan traditions (darkness = mystery/solemnity, never moral judgment).
- Grimoire circle-rite is instructional in form ("Walk the rite step by step") with no "not an instruction" disclaimer (Ring/Solomonic have it) — one standard must apply everywhere. Grimoire lore pins needed (Pythia bay-chewing disputed; Culpeper correspondences are one tradition, not universal; flying-ointment Harner thesis disputed).
- Shamanism video flattens a contested comparative pattern; Hell caption contradicts site's own nuance (most afterlives un-judged). No practitioner/scholar/insider review anywhere — "in its own terms" is currently self-certified. Grouped chapters need the ch33 treatment (ch56 Guarded Faiths, ch73 Sabbateans/Frankists/Hasidim — Hasidim under heresy-led title risks guilt by association, ch12 Confucianism & Daoism, ch14 Celtic & Germanic, Indigenous ch61/ch62/ch63/ch75 — highest-risk grouping, full text unverified for ch61–63). No locked sacred-terms glossary yet — do not enable auto-dubbing on religion content until Phase 0 glossary exists. Music pitches use living ritual instruments as ambience — needs per-tradition framing/review.

**Symbols:**
- Weakest collection: no independent catalogue, only a derivative view. Symbols page re-displays chapter art grouped by era + themes, each cell linking to its chapter. No per-symbol record — no independent provenance, date, culture, attestation status, or primary source per symbol. Against the collection definition (item + identity + provenance + status + retrievability), Symbols fails provenance and status legs. Fix: lightweight registry (symbol, tradition, attested date range, source, evidence badge).
- Ouija zodiac glyphs: known Clause 2 violation (geometric approximations, not individually legible glyphs). Supposed fix NOT audited. The 12-SVG zodiac-glyphs registry carries its own explicit caveat — "NEVER verified against primary texts or the archaeological record. Do NOT treat them as historically audited." It must NOT ship as the fix without an audit. Its `dispose()` sets `this.svg = null`, destroying the shared glyph definition — after one teardown the glyph can never mount again; dispose should clear only the host, not the asset.

**Governance / Process:**
- No single decision log (rulings scattered across ≥6 files). High Council cadence contradiction (GOAL says first session Nov 1; ledger records 2026-10-13). Council cadence lives in docs, not scheduler — no heartbeat. 27-agent model exists in task text/memory, not durable process docs (no convener template, divergence-matrix template, Sam relay protocol, per-agent prompt files). Handoff has no delivery receipt (email-drafts holds 1 file, empty gmail/ subfolder). Video files triple-stored with no canonical-copy rule (33 mp4s in `your_files/` vs. 30 in `posted/`). Pacing rules changed 3× in 2 days, none consolidated. Corrections mechanism is a rule without a place (footnotes location TBD; Methodology links to no errata page). 21 goal folders, 9 with empty files/. Goals/programs with no schedule (philosophers, games/relics, defects, multilingual, VR, practice renditions, easter eggs, directory, token queue) advance only on human memory. High Council's see-first rule unclosed (1 session, text-only, verification rests on Carter's phone). Deployed-vs-repo drift is possible on several findings (deploy path contradiction: `handoff/CURRENT.md` says Cloudflare Pages deploys `docs/`, README says GitHub Pages serves `docs/`).
- Research: only 4 in-scope research reports for a site with hundreds of factual entries; best reports genuinely strong but standards do not propagate to videos/atlas/games (no per-claim sourcing on video scripts; atlas dataset has no evidence tier — 4-badge key still OPEN). Video pipeline inverted research order once (format decision 2026-10-14 preceded viral-formats research 2026-10-15). Agentic-councils research (2026-10-15 03:44) describes a superseded model with no delta note. No chapter-word-count/translation-cost basis. No practice-rendition research pack. Re-research of the same weak points (mobile 3D, dark openings, repetition) ≥3× while build items sit open.

### What is blocked (not broken — waiting on an input)

- Rotunda floor wheel + Ouija medallion fix: blocked on audited zodiac glyphs.
- Debate Hall full build: blocked on debate corpora for 107 of 108 figures + source shelf / quote-catcher / histogram / bookmark safety fixes + plaque-map remap to real Nine Wings rooms.
- Lived Practice vision: only 4 of 83 rooms have `"living": true`; 17 rooms (20.5%) are `"pending": true`. Track as living rooms / 83 at each review, not prose.
- Multilingual: blocked on Phase 0 sacred-terms glossary; do not enable auto-dubbing on religion content until glossary exists.
- Practice renditions: blocked on per-tradition rulings and variant lists (already pending from earlier sessions — not re-decided here).
- Music reopen: blocked on reference track / owner / reopen trigger.
- VR: designed, not built (zero WebXR calls).

### Consolidated priority order — with conflicts resolved explicitly

Clara ranked blurred sprites #1 within her lens. The Convener does not demote that finding — it re-sequences it against two facts Clara's lens does not cover: (a) the token queue gates *all* fixes, and (b) homepage naming violations are on the highest-traffic page and carry the binding policy's legal signal, with a cheaper fix (text) than sprite regeneration (asset build).

**Tier 0 — Unblock everything (enabling, not a content fix):**
1. Repair ready-line: remove friend assignment, resolve Library Rescue open-vs-decided, fix numbering 1–11 / 14–16 / 12–13 / 17–20, de-duplicate Protection, give Grimoire a queue slot, correct hiss file body ("Replace it" → removal). Add owner-per-item, dated reset, triage rule.
2. Settle deploy truth: Cloudflare Pages vs. GitHub Pages — one canonical deploy path, in one place.
3. Create single decision log; fix High Council cadence contradiction; put council cadence in scheduler.

**Tier 1 — Stop live violations (visitor-facing, in this order):**
4. Homepage arcade blurbs: remove trademarked / "-style" phrasing.
5. Rename `pacman` → `labyrinth` (file + ID + loader reference).
6. Regenerate blurred symbol sprites (unblur or replace). *Why after naming: naming is text-only and highest-traffic; sprites need asset regeneration that itself needs the Tier 0 queue.*
7. Remove CDN / Google Fonts violations from Ring, Grimoire, Debate Table v3, Ouija, Oracle Bones, Library Rescue (vendor locally, as production museum already does). Fix production DPR cap 1.5 → 1.0.

**Tier 2 — Close Carter rulings already made:**
8. Add Delphic Oracle / Pythia Pantheon entry — framed as institution-and-person, Apollo cross-linked, NOT invented as a goddess. Completes 2-of-3 → 3-of-3.
9. Execute hiss removal (correct `brook()` mislabel first), propagate Ra-Horakhty correction to Pantheon/Museum, fix "199 gods/deities" → "199 figures" phrasing, state Pantheon grouping rule once on page.
10. Apply one disclaimer standard everywhere: Grimoire gets the Ring/Solomonic "not an instruction" disclaimer; Ouija gets archive-invention + simulation + grief framing + in-session answer-engine disclosure.

**Tier 3 — Unblock the blocked builds:**
11. Commission audited zodiac glyphs against primary sources (blocks Rotunda + Ouija; do NOT ship unaudited registry). Fix glyph `dispose()` to clear host only.
12. Debate Hall safety + scope fixes (bookmark self-injection, compare-well quotes, source shelf, quote-catcher, histogram as real data or remove) + plaque-map remap to real 83 rooms + corpora plan for remaining 107.
13. Grand Directory 76 → 83 rooms (restore 7 Rotunda rooms) + reconcile wing date bands + canonical room registry across Atlas / Directory / Debate table / VR.
14. Two-arcades reconciliation (see Decision D2) + implement differentiation brief in files + fix tap targets, undo/difficulty/tutorial floor.
15. Symbols provenance registry (lightweight) + V72 sourcing fix (replace/demote 4 Wikipedia citations).

**Tier 4 — Harden the pipeline:**
16. Audio QA gate: normalization target, loudness check, pronunciation control for sacred names, captions/SRT sidecars, fix sign-off ASR garble path.
17. Video canonical-copy rule + single posted-log source (resolve 27/30/29) + written direct-post bypass rule + errata/corrections location.
18. Audio parameters in Artistry + Modular standards (volume control, per-room control, text equivalent, phone-range floors); practice-rendition audio decisions when renditions are ruled.
19. Music: set reopen trigger + owner + reference-track requirement before any Round 6.

## 2. DIVERGENCE MATRIX

Do not read lens differences as disagreements. Different agents sampling different files is not a disagreement. Only genuine contradictions are listed.

| # | Disagreement | Side A — evidence | Side B — evidence | What settles it |
|---|---|---|---|---|
| D-M1 | **Naming/IP live violation** | 10 agents (Owen, Vera, Cole, Leo, Milo, Hank, Wade, Mara, Tess, Sara) fetched live homepage text and found trademarked / "-style" arcade blurbs banned by binding policy. Clara adds internal `pacman` file + ID. | Marcus reported no textual violation in the files he inspected. | Marcus inspected a sample of files, not full live site text. Weight: live-homepage fetchers. Settles by: one live-homepage text fetch against the policy's banned list + one repo grep for trademarked IDs. Marcus's finding is scoped to his sample, not a contradiction of the live finding. |
| D-M2 | **Hiss still live** | Finn / Stan / Dean / Marcus: code-read — `brook()` generator still on main, assigned to all 9 corridors + rooms + fountain reuses `brook`. | Mara: could only confirm a `babble` comment string, not whether the generator is wired to the hallway. Clara: accepted defect file as reported, did not re-prove; could not inspect audio. | Keep "hiss still live" as **code-read, not listen-verified**. Settles by: one listened hallway walk on a phone + one trace from `brook()` assignment to hallway audio node. Also settle mislabel: defect file says `babble()`, code has technique inside `brook()` — correct the file. |
| D-M3 | **Queue empty = stall vs. drain** | Stall reading: pending 0 + approved 0 at audit time could imply production stalled. | Drain reading (summary + Clara): posted/ held 30 files; empty pending/approved is consistent with between-batch drain, not proof of stall. | Neither side proved stall. Settles by: reading queue state **at batch time**, not from an audit snapshot, plus a dated batch log. Do not treat snapshot emptiness as failure. |
| D-M4 | **Deploy path** | `handoff/CURRENT.md`: Cloudflare Pages deploys `docs/`. | README: GitHub Pages serves `docs/`. | Doc contradiction, not agent disagreement. Settles by: Carter/Claude Code confirming the one live deploy path and correcting the other file. Until settled, deployed-vs-repo drift is possible on several findings. |
| D-M5 | **Video counts** | Briefing: 27. Folder `posted/`: 30 files. Log: 29 events. `your_files/`: 33 mp4s. | — (no agent claims all agree; the sources disagree with each other) | Source contradiction. Settles by: one canonical-copy rule + one posted-log as single source of truth, reconciled once. |
| D-M6 | **"199 deities" vs. "199 figures"** | Site meta description: "199 gods… from 30 traditions." Common shorthand: "199 deities." | Clara: Pantheon lede discloses "gods, spirits, prophets, heroes and primordial beings… Moses, Jesus and Muhammad, Coyote and the Peacock Angel"; entries include Confucius, ʿAlī ibn Abī Ṭālib. Accurate phrasing is "199 figures." "30 traditions" not counted. | Clara is correct on definition. Settles by: changing public phrasing to "199 figures" and counting/verifying "30 traditions" or removing the number. |
| D-M7 | **Symbols: collection vs. view** | Site presents Symbols as a collection alongside Vault/Pantheon. | Clara: Symbols page is a re-display of chapter art with no per-symbol provenance/date/culture/attestation/source. Fails provenance + status legs of collection definition. | Not an agent-vs-agent fight; it is a presentation-vs-structure gap. Settles by: building the lightweight registry (Tier 3) or relabeling the page as a view of chapter art. |
| D-M8 | **Ready-line self-contradictions** | §3: Library Rescue renderer open. | §14: Library Rescue hybrid accepted + upscale. Also: numbering 1–11 / 14–16 / 12–13 / 17–20; Protection in §1 and §20. | Doc self-contradiction. Settles by: Tier 0 ready-line repair (one decided line for Library Rescue, sequential numbering, one Protection entry). |
| D-M9 | **High Council cadence** | GOAL: first session Nov 1. | Ledger: session recorded 2026-10-13. | Doc contradiction. Settles by: one corrected cadence in the single decision log + scheduler. |
| D-M10 | **Wing date bands** | One artifact set: Wing IV ends 200 BCE; Wing VI 600–1000. | Another artifact set: Wing IV ends 200 CE; Wing VI 800–1100 (etc.). | Artifact contradiction. Settles by: one canonical date-band table in the room registry (Tier 3). |
| D-M11 | **Directory room count** | Spec: 83 rooms. | Grand Directory preview: 76 rooms (missing 7 Rotunda rooms). | Artifact gap, not agent disagreement. Settles by: restoring the 7 Rotunda rooms in the preview. |

**Not disagreements (recorded to prevent false matrix entries):** Different agents sampling different Vault entries (V72 Wikipedia vs. other entries' strong sourcing) is sampling, not contradiction. Different agents noting different CDN files is coverage, not conflict. Mara's comment-string-only hiss finding is a *limit*, not a counter-finding — it narrows the verification status, it does not refute the code-read.

## 3. VERIFIED vs. NOT VERIFIED

**Verified at source (repo file reads / direct counts):**
- Vault 88 (four agreeing tallies); Pantheon 199 (JSON-LD + body + unique names); manifest cross-links (all 88 Vault IDs, 199 figure IDs); 83 museum + 73 pilgrimage = 156; manifest 83 rooms / 17 pending / 4 living; symbol-wall JSON sums (528 cells, 17 unaccounted slots, 5 wings covered); catalog titles (12 generic visitor-facing titles); `pacman.js` + catalog ID exist; production `museum.html` vendors Three.js; production DPR cap 1.5; VR `m_app.js` zero WebXR calls; 108 philosophers entries by count.

**Rests on logs, reports, or sampling (preserve as such):**
- Hiss still live: code-read, not listen-verified. Blurred symbols: defect-file report, not pixel-verified (Clara could not inspect `.webp` pixels). Ouija medallion violation: punch-list / Artistry Standard record, not re-inspected (no Ouija preview file found). Homepage naming violations: search-result text fetch, not live-browser render. Facebook distribution: posted-log claims (URLs + post IDs), not connector re-verified live posts. Video contents: pipeline docs + posted-log, not watched end-to-end. Vault sourcing: only V01/V04/V72 read in full; other 85 source lists not fully read. Pantheon slug identity: counts match (199/199); slug-level identity not fully audited.

**Not verified / provisional:**
- Rendered live site, rendered 3D walk, phone test, audio listening, video watching end-to-end. See-first rule remains unsatisfied by this audit class.
- Token queue / Claude Code build order / dated reset — not verifiable from repo.
- Pantheon "30 traditions" figure — not counted. Philosophers' 108 entries — not recount-verified by Clara; grep-no-hit for oracle spirits in `pantheon-drafts.md` is a weak check, not proof. Wings I, VII, VIII, IX symbol displays — no wall files found; unanswered in repo. Whether every manifest Pantheon slug resolves to the same figure — not fully audited. Whether 17 unaccounted wall slots are spacers vs. blurred cells — JSON alone cannot decide.

**UNIVERSAL AUDIT LIMIT (every agent):** No live-browser control; no rendered 3D walk, no phone test, no audio listening, no video watching end-to-end. Text/code/log findings are solid; feel/rendered-behavior findings are provisional.

## 4. CONVENER SCRATCHPAD, SELF-CRITIQUE, UNVERIFIED

### Scratchpad (Fact A → Conclusion B)

- Fact A: 10 independent agents fetched the live homepage and found the same banned phrasing. Fact B: Marcus's no-violation finding was sample-only, not full live text. → Conclusion: live naming violation is real; Marcus's finding scopes to his sample.
- Fact A: Clara verified Vault 88 four ways and Pantheon 199 three ways from repo files. → Conclusion: core collection counts are facts, not estimates.
- Fact A: Ready-line assigns work to the friend ruled out 2026-10-13, contradicts itself on Library Rescue, and misnumbers. → Conclusion: ready-line cannot be executed as written; it must be repaired before it can gate work.
- Fact A: ~20-item ready-line + 5 open PRs + main last merged ~2026-10-12 + no dated reset. → Conclusion: token queue is the binding bottleneck; every fix waits on it.
- Fact A: Zodiac registry self-declares "NEVER verified against primary texts." Fact B: Rotunda + Ouija both need glyphs. → Conclusion: shipping the registry as the fix would swap one Clause 2 violation for another; audit must precede use.
- Fact A: Only Augustine has a debate corpus (1/108). Fact B: Preview has 3-turn cap, regex classifier, raw-HTML bookmark. → Conclusion: Debate Hall is a preview with a safety hole, not a near-complete build.
- Fact A: Queues empty + posted/ holds 30. → Conclusion: empty queues alone do not prove stall; batch-time reading is required.
- Fact A: Two arcades exist (12 live reskins vs. 25 staged historical). Fact B: Carter's vision matches the 25. → Conclusion: the 12 and the 25 cannot both be "the arcade" without a reconciliation decision.
- Fact A: No single decision log; rulings scattered across ≥6 files. → Conclusion: contradictions (deploy path, cadence, Library Rescue, wing bands) persist because there is no one place where a ruling, once made, becomes canonical.

### Self-critique lock

**The weakest part of our plan is** that we aggregated a consolidated summary + one verbatim brief, not 26 full briefs. For Joe/Rosa we have only addenda + summary substance. If compaction softened any agent's qualifier (e.g., "verified" vs. "suggests"), our matrix could overstate agreement or miss a nuance.

**The edge case that breaks our logic is** deploy lag + summary drift: if the live site lags repo main, every repo count (88, 199, 528, 83) could be right about repo and wrong about what a visitor receives — and if the summary mis-condensed any brief, our priority order inherits that error. Mitigation: Carter should treat Tier 0 (ready-line + deploy truth + decision log) as the fix that makes all later tiers checkable, and require one live verification pass before Tier 1 closes.

### Convener's own unverified list

- Did not re-read repo files, re-fetch the live site, re-count Vault/Pantheon, or re-listen / re-watch anything. Relied on the summary as the record of 25 briefs + Clara verbatim.
- Joe/Rosa main briefs unseen beyond summary + addenda. Nina addendum supersession taken as given.
- Did not verify token state, deploy path, Facebook live posts, TikTok state, or Claude Code queue order.

## 5. DECISIONS CARTER MUST MAKE

Each is an approval question arising from **this audit's** findings. Items already pending from earlier sessions (per-tradition perform-vs-witness / observe-vs-participate rulings, variant lists for practice renditions, translation-licensing review, music reopen direction) are **not** re-decided here — they remain pending and are noted only where this audit depends on them.

**D1 — Ready-line repair:** Approve Tier 0 repair as written (remove friend assignment, one decided Library Rescue line, sequential numbering, one Protection entry, Grimoire slot, hiss-file correction, owner-per-item, dated reset, triage rule)? Approve / Amend / Reject.

**D2 — Two arcades reconciliation:** Which is the arcade? (a) Retire/replace the 12 live reskins with the 25 historical games; (b) keep both with distinct labels and separate spaces; (c) keep the 12 live and park the 25. Carter's stated vision matches the 25 — this decision makes that vision operational or revises it.

**D3 — Naming fixes:** Approve (a) homepage arcade blurb rewrite removing all trademarked / "-style" phrasing, and (b) `pacman` → `labyrinth` rename (file + ID + loader)? Approve / Amend.

**D4 — Blurred sprites:** Approve regeneration (unblur or replace) as Tier 1 #6, accepting that it needs the Tier 0 queue to ship? Approve / Defer to after Tier 0.

**D5 — Delphic Oracle entry:** Approve framing as Pythia / Delphic Oracle as institution-and-person, Apollo cross-linked, NOT invented as a goddess? Approve / Amend framing.

**D6 — "199 figures" phrasing + grouping rule:** Approve changing public "199 gods/deities" → "199 figures" and adding a one-line Pantheon grouping rule (singular figures + groups)? Approve / Amend.

**D7 — Symbols registry:** Approve building the lightweight Symbols provenance registry (symbol, tradition, attested date range, source, evidence badge) vs. relabeling the Symbols page as a view of chapter art? Approve registry / Approve relabel / Defer.

**D8 — Zodiac glyph audit:** Approve commissioning a primary-source audit of the 12 glyph SVGs before any use in Rotunda or Ouija, with `dispose()` fixed to clear host only? Approve / Amend scope.

**D9 — Video canonical truth:** Approve one canonical-copy rule for video files + one posted-log as single source of truth (reconciling 27/30/29) + a written direct-post bypass rule? Approve / Amend.

**D10 — Corrections location:** Approve a single errata/corrections location (footnotes page/section) that Methodology links to, closing the rule-without-a-place gap? Approve + choose location / Defer.

**D11 — Deploy truth:** Confirm the one live deploy path (Cloudflare Pages vs. GitHub Pages) and authorize correcting the other file? Confirm one / Needs Claude Code confirmation.

**D12 — Audio QA gate:** Approve adding a normalization + loudness + pronunciation + captions/SRT gate before videos post, with sign-off ASR check? Approve / Amend thresholds / Defer.

**D13 — V72 sourcing:** Approve replacing/demoting the 4 Wikipedia citations in V72 to primary/secondary sources or "further reading — tertiary"? Approve approach / Direct a full 88-entry source sweep instead.

**D14 — Debate Hall safety:** Approve fixing the bookmark raw-HTML round-trip (self-injection hole) + compare-well quotation-marks violation before any further Debate Hall build? Approve / Defer with preview.

**Already pending (not re-asked):** Practice-rendition per-tradition rulings + variant lists; sensitivity matrix / Show-Veil-Withhold protocol; insider-review requirement; translation-licensing legal review; "Ouija" title Consistency ruling; flame-law scoping; music reopen trigger/owner.

---

## SAM'S PROCESS NOTES (Group Manager)

- **Process followed:** Sam fanned out to 26 independent subagents (one per agent, 13 pairs), each with its name, tag, pair, the three strict rules (first-principles, scratchpad, self-critique lock), its own perspective, the full scope, and the see-first rule. All 26 briefs were collected. The complete set was then handed to June + Paul (Convener pair) as their own task, which produced the ONE Advisory Brief + Divergence Matrix above. No generic compromise — disagreements are preserved in the Matrix with the evidence for each side and what would settle each.
- **Constraints held:** Read-only on GitHub throughout (no writes, merges, or PR changes). No public sharing. No contacting anyone outside. No Instagram. No case-file or personal material. No financial details in any output.
- **Known gaps to carry forward (do not treat as closed):**
  1. Joe/Rosa: only addenda visible post-compaction; main briefs' substance survives only via the consolidated summary. The Conveners flagged this explicitly.
  2. The Conveners aggregated a consolidated summary + Clara verbatim, not 26 full brief texts — if compaction softened any agent's qualifier, the Matrix could overstate agreement or miss a nuance.
  3. Universal audit limit stands: no agent had live-browser control; no rendered 3D walk, phone test, audio listening, or end-to-end video watching. Text/code/log findings are solid; feel/rendered-behavior findings are provisional. See-first remains unsatisfied by this audit class — one live verification pass (live site render, hallway listen, phone test) is still needed before Tier 1 closes.
  4. PR states, token-queue state, and deploy path were not re-verified live in this pass — the brief preserves them as reported, with the deploy-path contradiction called out as D-M4 / D11.
- **Group status:** The 27-agent group (13 pairs + Sam) remains intact. First group project complete. Awaiting Carter's rulings on D1–D14.

---

# RULINGS — Carter, 2026-10-15

All 14 decisions ruled. This appendix + the brief above form the package that goes to GitHub for Claude Code to rework.

- **D1 APPROVED** — Ready-line repair as written (remove friend assignment, one decided Library Rescue line, sequential numbering, one Protection entry, Grimoire slot, hiss-file correction, owner-per-item, dated reset, triage rule).
- **D2 RULED KEEP BOTH** — The 12 live reskins stay AND the 25 historical games get added in, with distinct labels and separate spaces. Sub-requirements: refresh the arcade section on the website to reflect the added games; arcade UI changes from individual boxes to a dropdown menu; when tokens reset, EXPAND (not just rearrange) the secret hidden arcade room; every room still has a gaming console AND games also live in the hidden room; the 12 prior games are plug-and-play — reuse their formatting for the 25 (drop in new info/skins). Live-site check 2026-10-15: Arcade is homepage #games "THE ARCADE OF THE AGES" (12 cards, 3×4 grid; /arcade/ 404s). **Console premise under correction — see RESOLVED below.**
- **D3 APPROVED** — Naming fixes: (a) homepage arcade blurb rewrite removing trademarked / "-style" phrasing, (b) `pacman` → `labyrinth` rename (file + ID + loader).
- **D4 APPROVED** — Blurred sprites regeneration (unblur or replace) as Tier 1 #6, accepting it needs the Tier 0 queue to ship.
- **D5 APPROVED** — Delphic Oracle entry as Pythia / Delphic Oracle as institution-and-person, Apollo cross-linked, NOT invented as a goddess.
- **D6 APPROVED** — Public phrasing "199 gods/deities" → "199 figures" + one-line Pantheon grouping rule (singular figures + groups).
- **D7 RULED — BUILD THE REGISTRY** — Lightweight Symbols provenance registry (symbol, tradition, attested date range, source, evidence badge).
- **D8 APPROVED** — Commission primary-source audit of the 12 glyph SVGs before any Rotunda/Ouija use, with `dispose()` fixed to clear host only.
- **D9 APPROVED** — Video canonical truth: one canonical-copy rule for video files + one posted-log as single source of truth (reconciling 27/30/29) + written direct-post bypass rule.
- **D10 APPROVED** — Single errata/corrections location that Methodology links to (exact location TBD — to be chosen).
- **D11 NEEDS CLAUDE CODE CONFIRMATION** — Carter: "not sure." Deploy path (Cloudflare Pages vs. GitHub Pages) to be confirmed by Claude Code, then the other file corrected.
- **D12 APPROVED** — Audio QA gate: normalization + loudness + pronunciation + captions/SRT gate before videos post, with sign-off ASR check.
- **D13 RULED — FIX V72 ONLY** — Replace/demote the 4 Wikipedia citations in V72 to primary/secondary sources or "further reading — tertiary" (no full 88-entry sweep).
- **D14 APPROVED** — Debate Hall safety: fix the bookmark raw-HTML round-trip (self-injection hole) + compare-well quotation-marks violation before any further Debate Hall build.

## RESOLVED — console question (Carter 2026-10-15)

**Console question RESOLVED:** Carter meant the existing GAME entries in the selected rooms — like a little kiosk when you walk up to the game. Kiosks in every room are acceptable, OR the games can be embedded in the room information somehow — either approach works. ALL games transfer into the hidden arcade room — all 37 (12 + 25), not just a subset. **Retro cabinets:** CORRECTION (verified 2026-10-15): retro cabinets ARE present in the hidden arcade — classic upright cabinets (black bodies, colored marquees, live screens, joystick panels), one per game on a themed floor section. The earlier "cabinets are out" claim was wrong — it rested on visible surfaces only. The hidden arcade is at `pilgrimage/arcade`: round hall, central dark-teal pool, domed starry ceiling, scoreboard (device-local scores, all empty), golden return portal. OPEN QUESTION for Carter: keep the cabinets or replace with historical forms per the standing vision? → RULED (Carter 2026-10-15): REPLACE with historical forms — the retro cabinets in the hidden arcade go; games presented in their historical forms. Also corrected: the egg is FIVE words (EVERY TRADITION LEFT A DOOR), not four.

## Standing rule

All of it gets sent to GitHub for Claude to rework. Nothing ships from the Muse side as final.

---

# POST-AUDIT ADDENDUM — Ambiance Upgrade (Carter 2026-10-15)

**Requirement:** The ambiance in each museum room needs to go up a notch. Floors render as rivers and ponds with fish and all that; skies render with clouds or rain or any of that. Motion exists — the river runs, little water drops hit the water and ripple — but the artistry is lacking, very flat almost. It needs to be much more detailed.

**Status:** Live-room inspection running to ground the spec (what is actually in each room now: floor detail, sky/weather, motion, flatness). Findings (2026-10-15, live inspection — Entrance Hall + Paleolithic, Egypt, Buddhism, Sufism, Wicca): Carter's "flat" impression CONFIRMED. Every room uses the same template: flat brick/block side walls, large flat rectangular skylight ceiling divided by dark grid bars, flat ground texture seen through a black glass-grid overlay, low-poly flat-shaded texture-less props. Skies are flat 2D backdrops (solid color + simple sun/moon disc + sparse star dots, or pale cloudy wash). No rain, no volumetric clouds, no reflections, shadows minimal/absent, no water shader/ripple visible in stills. Lighting uniform/flat. Detail low: repeated cones, blobs for bushes, simple fish/bird silhouettes. Motion did not read in stills (no ripples, rain, or moving water visible; fish/birds in fixed positions between views; VIEW MOTION not toggled) — motion may exist in code but does not read as rich ambiance. Per-room: Entrance Hall — central pond, light-blue flat water, lily pads, small fish, tile border, no river; dark star-dot sky. Paleolithic — pale sand, pebbles, identical dark-grey conical spikes, no water; night sky, full moon + halo. Egypt — sand + winding greenish river/pond, lily pads, thin papyrus stalks; pale cloudy wash sky. Buddhism — large rectangular pond, dark green-blue flat water, lily pads, stone walkway; pale cloudy sky. Sufism — entire garden UNDER glass (lawn, cross-shaped water channel + circular fountain, rose bushes); sunset gradient sky, sun disc, wispy clouds. Wicca — no water; speckled sand, grass tufts, mushrooms/twigs; night sky, full moon, wispy clouds (most atmospheric, still flat 2D). ANIMALS: both placements, split roughly by type — aquatic fish/koi BELOW glass (muted, diorama-like); terrestrial cat/lizard/rabbit/owl ABOVE glass (pasted-on, no shadow/grounding); birds in sky volume. All tiny, low-poly, flat-shaded, no limb animation, fur/feather/scale texture, shadows, or ripple interaction in stills. "Stiff/frozen" confirmed; "staticky/jittery" could NOT be confirmed from stills (appeared frozen, not jittering) — needs live video to verify. Placement judgment: neither placement fixes the core issue; the split by type is already roughly in place — the fix is detail, animation, and grounding, applied consistently. Goes to GitHub for Claude to rework with the rest of the package.

**MOTION ALWAYS ON (Carter 2026-10-15):** motion runs by default — VIEW MOTION defaults ON, no button press required to get motion. The motion-off-by-default compute-saving measure is removed — motion itself must be efficient enough to render properly on phone + web + computer. Build station: Carter builds/reviews from his phone — phone-first rendering is the bar.

---

# POST-AUDIT ADDENDUM — Punchy Hits in the Fighting Games (Carter 2026-10-15)

**Source:** TikTok tutorial by @qutsune, "How to: Make Hits Punchy!" — watched via transcript. The MECHANICS are adopted (standard game-feel techniques); none of the video's assets, text, or style are copied.

**Requirement:** every fighting game — any game where a hit lands — builds in all five hit-feel mechanics:

1. **FLASH** — turn the enemy white for just a few frames on impact.
2. **ADD SOUND** — a sharp WHACK right on the impact.
3. **PARTICLES** — blast them out in the direction of the hit.
4. **KNOCKBACK** — push the enemy away; bounce the player back a bit.
5. **SHAKE + FREEZE** — tiny screen shake on impact; freeze the game for a few frames.

**Scope:** applies to every game with hits/combat. Flagship: Divine Casualties (War of the Gods). Also applies wherever hits land in contest/combat-adjacent games (e.g., Antithesis paddle hits, Dominion battles) and any future combat game. Claude to apply wherever a hit lands — not just the flagship.

**House adaptation:** effects are themed to each game's tradition (particles as embers/gold dust/etc., sounds fitting the setting), kept subtle (tiny shake, few-frame freeze — as the tutorial stresses), and phone-safe per the motion-always-on + phone-rendering bar. Punchy, not flashy — the archive's solemn house feel holds.

**Status:** goes to GitHub for Claude to rework with the rest of the package.

---

# POST-AUDIT ADDENDUM — Ouija Fortune-Board Rebuild (Carter 2026-10-15)

**Status:** Live-verified by Carter on his phone (personal question, "it's fine"). Exported as a self-contained file for Claude: `workspace/your_files/ouija-board/ouija-board.html`. Goes to GitHub with this package for Claude to rework.

**What changed:** The Ouija board is now a fortune board, not an archive-trivia machine. Any question gets an answer through the planchette: yes/no personal questions → YES/NO + short oracular line in the spirit's voice; open personal questions → topic-matched fortunes (success, love, wealth, health, family, journeys, fate) from 63 voice-written fortunes across Delphic Oracle, Thoth, Nornir. Old deflections gone ("no verdict," "no record" for personal questions). Archive questions still get facts. Death-timing questions get a gentle in-voice refusal, not a prediction. Answer plaque labeled "The board's fortune"; opening copy reframed as "A fortune-telling board for reflection and play."

**Verification split:** Harness-verified (24 test questions × 3 spirits, audit pass, no console errors) + live-verified by Carter on his phone (personal question). Ring-size dispute, dark chamber, and generic zodiac medallions (held for D8 glyph audit) remain standing.

---

# POST-AUDIT ADDENDUM — Magic Attacks in the Games (Carter 2026-10-15)

**Source:** TikTok tutorial by @qutsune, "How to: Make a Magic Attack!" — watched via transcript. Companion to the "How to: Make Hits Punchy!" tutorial. The MECHANICS are adopted (standard game-feel techniques); none of the video's assets, text, or style are copied.

**Requirement:** every game with magic/spell attacks builds in all eight magic-attack mechanics:

1. **CHARGE** — pull fire out of the air before the cast (visible wind-up: energy gathers).
2. **CORE** — a hot ball that swells in the hand (the projectile reads as charged before release).
3. **TRAIL** — tongues of flame streaming behind it in flight.
4. **BURST** — flash and sparks spraying through the enemy on impact.
5. **REACTION** — flash the enemy white and make it flinch on impact.
6. **SOUND** — a whoosh on the cast, a boom on impact.
7. **AFTERMATH** — set the enemy on fire and let it die down (lingering burn shows the hit landed).
8. **DAMAGE NUMBERS** — small, punchy numbers; bigger for crits; out of health, burn it to ashes.

**Scope:** applies to every game with magic/spell attacks. Flagship: Divine Casualties (War of the Gods). Pairs with the Punchy Hits addendum: Punchy Hits governs regular/melee hits; this addendum governs magic/spell attacks. Carter: "do both for the magic and the regular attacks" — both sets apply, each to its attack type.

**House adaptation:** effects are themed to each game's tradition (fire/lightning/energy fitted to the god or tradition casting; particles as embers/gold dust/etc.), kept subtle and phone-safe per the motion-always-on + phone-rendering bar. Punchy, not flashy — the archive's solemn house feel holds. The "burn it to ashes" defeat is adopted as presented (Carter did not cut it, unlike the balloon-pop defeat cut from Punchy Hits).

**Status:** goes to GitHub for Claude to rework with the rest of the package.

---

# POST-AUDIT ADDENDUM — Gunfire / Projectile Weapons in the Games (Carter 2026-10-15)

**Source:** TikTok tutorial by @qutsune, "How to: Make Gunfire Punchy!" — watched via transcript. The MECHANICS are adopted (standard game-feel techniques); none of the video's assets, text, or style are copied.

**Requirement:** every game with projectile weapons builds in all seven gunfire mechanics:

1. **THE SHOT** — kick the weapon, flash the muzzle/barrel, answer on the same frame as the shot.
2. **BULLETS** — spread, a tail, sparks; identical projectiles read as a laser without variation.
3. **THE HIT** — flash, squash, knock back; or you can't tell you hit.
4. **RECOIL** — push the hero, kick the camera; the player feels it too.
5. **BLOOD & SHELLS** — spray it, leave it on the floor; the fight leaves a mess.
6. **SOUND** — crack, whiz, thud, ping; few samples, nudge the pitch.
7. **THE KILL** — freeze, then throw the body; the last bullet hits hardest.

**Scope:** applies to every game with projectile weapons. Flagship: Divine Casualties (War of the Gods). Third attack-feel set alongside Punchy Hits (regular/melee) and Magic Attacks (spells) — three sets, each to its attack type.

**House adaptation:** the archive has no modern guns — projectile weapons are arrows, spears, thrown weapons, and divine bolts, and the mechanics are themed to each game's tradition. Blood is kept subtle and tradition-appropriate, never gore. Shells become the projectile's own debris (broken shafts, embers, spent energy) — there are no shell casings in ancient combat. The body-throw defeat is adopted as the defeat flourish, consistent with the burn-to-ashes defeat kept in Magic Attacks. Punchy, not flashy; subtle and phone-safe per the motion-always-on + phone-rendering bar.

**Status:** goes to GitHub for Claude to rework with the rest of the package.

---

# POST-AUDIT ADDENDUM — Lightning Animation in the Games (Carter 2026-10-15)

**Source:** TikTok tutorial by @qutsune, "How to: Animate Lightning!" — watched via transcript. The TECHNIQUE is adopted (standard animation layering); none of the video's assets, text, or style are copied.

**Requirement:** lightning effects are built with the seven-step layering recipe, then animated:

1. **SQUIGGLE** — draw the bolt's path (not white yet — that comes later).
2. **EXAGGERATE THE ACTION IN THE LINE** — push the corners out, sharper turns.
3. **GIVE IT SOME SHAPE** — thick at the bends, thin between.
4. **START BROAD** — loose and atmospheric, low opacity, new layer.
5. **CLOSER TO CENTER** — narrower airbrush, bright color.
6. **ACCENTS** — taper all brush strokes.
7. **ADD DAT ZAP** — bright branch arcs.

Then **ANIMATE**: a short frame sequence (start thick + bright), **LOOPED** for ambient lightning or **TRIGGERED ON HIT** for strikes (pairs with Damage Numbers from Magic Attacks).

**Scope:** lightning VFX in the games — Zeus's thunderbolt in Divine Casualties first, storm gods and any lightning elsewhere — plus museum skies and storm effects where lightning appears.

**House adaptation:** bolt color and atmosphere fitted to the god or tradition casting (Zeus gold-white, storm gods per tradition), keeping the candlelit house feel. Subtle and phone-safe per the motion-always-on + phone-rendering bar.

**Status:** goes to GitHub for Claude to rework with the rest of the package.

---

# POST-AUDIT ADDENDUM — Water Shader Recipe for the Museum (Carter 2026-10-15)

**Source:** TikTok tutorial by @qutsune, water-shader recipe — watched via transcript (title card not captured in the frames pulled). The RECIPE is adopted (standard shader techniques); none of the video's assets, text, or style are copied.

**Requirement:** water is built with the shader recipe:

- **Vertex waves:** surface displaced by `y = sin(x + t) + sin(z − t)`.
- **Two textures:** two noise/opacity textures panning in opposite directions.
- **Floating objects:** bob with the wave function (`y += wave(x, t)`) and rotate with it.
- **River current:** flow velocity follows the river spline's tangent.
- **Splash/foam:** particles spawn where something touches the water.
- **Waterfall:** a river plane rotated 90°.

**Scope:** the museum ambiance upgrade FIRST — this is the concrete recipe for the Ambiance Upgrade addendum's rivers, ponds, and waterfalls in the rooms — plus any game with water.

**House adaptation:** water color and character fitted to each room's tradition and palette, keeping the candlelit house feel. Performance within the phone-first bar (motion-always-on + phone rendering).

**Status:** goes to GitHub for Claude to rework with the rest of the package.
