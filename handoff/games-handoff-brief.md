# Games handoff brief

## Purpose

This brief preserves the ten self-contained exhibit builds and gives Claude Code a disciplined, game-by-game analysis request. The first pass is an integration audit, not an instruction to overwrite production files.

## Saved source inventory

1. `workspace/your_files/the-royal-game-of-ur/the-royal-game-of-ur.html`
2. `workspace/your_files/the-antikythera-mechanism/the-antikythera-mechanism.html`
3. `workspace/your_files/senet/senet.html`
4. `workspace/your_files/hnefatafl/hnefatafl.html`
5. `workspace/your_files/oracle-bones-of-anyang/oracle-bones-of-anyang.html`
6. `workspace/your_files/the-library-rescue/the-library-rescue.html`
7. `workspace/your_files/the-astrolabe/the-astrolabe.html`
8. `workspace/your_files/the-alchemist-s-magnum-opus/the-alchemist-s-magnum-opus.html`
9. `workspace/your_files/mehen/mehen.html`
10. `workspace/your_files/the-i-ching/the-i-ching.html`

These are immutable handoff snapshots. Claude should integrate from copies or a feature branch and leave the saved originals unchanged.

## Preliminary source scan

The snapshots are self-contained HTML files with inline scripts and no external JavaScript imports. They do not use browser storage or network fetches. Two builds (**The Alchemist's Magnum Opus**, **The I Ching**) originally imported Google Fonts; both dependencies were removed before the final snapshots and verified at zero external requests with visually identical rendering.

Three builds show no explicit `.dispose()` call in a static source scan: **The Royal Game of Ur**, **The Antikythera Mechanism**, and **The Astrolabe**. Claude must confirm whether equivalent teardown exists under another name; if not, teardown is required before integration. **The Alchemist's Magnum Opus** teardown was listed as "to check" and never confirmed. This scan is not a production-readiness verdict.

Known design questions to resolve:

- **Library Rescue**: the environment is WebGL, but gameplay actors are 2D canvas elements composited over it. Claude must decide whether this passes the archive’s true-depth standard or requires full WebGL actors.
- **Oracle Bones**: the scapula is a hand-built study of CUL.52, not a scan-derived mesh. Exact pit locations and sign tracing must not be described as facsimile-accurate.
- **Antikythera and Astrolabe**: calculation logic and fine drag gestures need direct device testing.
- **Alchemist**: later stages need end-to-end play testing in addition to the font correction.
- **Mehen**: a full match to final victory was never played end to end by the verification probe; one complete game session is required.
- **I Ching**: archive synopses must remain clearly separated from the public-domain Legge translation; no paraphrase may be presented as translation.

---

## Shared audit contract for Claude Code

Paste this contract before any one of the ten prompts below.

```text
You are evaluating a saved interactive exhibit for integration into The Divine Archives production repository. Inspect the repository and the supplied artifact before making any recommendation.

PASS 1 IS ANALYSIS ONLY. Do not change production code, move files, rename routes, or delete anything. Leave the saved source artifact untouched.

Return one verdict:
A. ADD AS-IS
B. ADD AFTER REQUIRED CHANGES
C. HOLD — REBUILD OR RESEARCH REQUIRED

Your report must include:
1. The verdict and its technical, artistic, scholarly, and editorial basis.
2. The correct Nine Wing, section, route, navigation entry, and surrounding page context based on the actual repository structure. Do not invent a route or taxonomy.
3. Every required change, separated into blockers, required parity work, and optional refinements.
4. A file-by-file integration map showing what should become HTML, ES module, stylesheet, local asset, data module, and source note.
5. A dependency audit: external scripts, fonts, images, network calls, browser APIs, global variables, and CSP implications.
6. A lifecycle audit: deterministic destroy/disconnect path; cancellation of animation frames, timers, listeners, audio nodes, observers, pointer capture, WebGL resources, geometries, textures, materials, and contexts.
7. A performance audit on desktop and mobile: forced mobile DPR cap of 1.0, guarded render loop, context-loss handling, reduced-motion behavior, audio opt-in, and graceful low-power fallback.
8. An accessibility audit: semantic controls, focus order, keyboard parity, touch targets, visible focus, labels, contrast, motion controls, mute state, instructions, and completion feedback.
9. A visual audit against the museum standard: real spatial depth, tactile materials, precise attested iconography, elegant easing, micro-interactions, chiaroscuro with structural clarity, and no generic flat UI.
10. A scholarship audit: distinguish attested evidence, scholarly reconstruction, modern gameplay convention, and creative interpretation; verify every named object, inscription, rule claim, date, quotation, and source against repository standards and real sources.
11. A state-integrity audit: every state change has a structurally matching reversal; invalid or incomplete state changes fail safely; journal or ledger behavior uses the site’s canonical schema if present.
12. A regression plan covering phone, keyboard, mouse, touch, resize, orientation change, tab hiding/restoration, repeated mount/unmount, sound toggling, completion, restart, undo where applicable, and failure recovery.
13. A concise acceptance checklist Claude can execute after implementation.

Do not flatten the work into a generic card layout. Preserve the artifact’s identity while adapting it to the archive’s actual design system. If repository conventions conflict with assumptions in the artifact, the repository wins. If historical evidence is uncertain, label uncertainty rather than silently choosing a reconstruction.

After the report, stop and wait for approval before editing the repository.
```

---

## 1. The Royal Game of Ur

```text
Apply the shared audit contract to:
workspace/your_files/the-royal-game-of-ur/the-royal-game-of-ur.html

Determine whether this build can enter The Divine Archives without losing its tactile lapis, shell, limestone, cedar, rosette, dice, and AI-driven play experience.

Concentrate on:
- verifying the playable rule set against the Irving Finkel reconstruction and clearly separating it from what is directly attested by the excavated boards and tablets;
- checking board pathing, rosette behavior, captures, extra turns, legal-move detection, bearing off, AI difficulty, local two-player mode, tutorial, restart, and undo;
- verifying that decorative markings correspond to the actual Royal Cemetery board rather than modern or invented symbols;
- eliminating global namespace leakage when embedded in an archive page;
- adding a complete deterministic teardown if one is absent;
- deciding whether the self-contained page should become an ES module, Web Component, or repository-native page component;
- mapping the history panel and source notes into the archive’s evidence language without overclaiming reconstructed rules.

State exactly what must change before this can be added, and identify what should be preserved unchanged because it defines the exhibit’s character.
```

## 2. The Antikythera Mechanism

```text
Apply the shared audit contract to:
workspace/your_files/the-antikythera-mechanism/the-antikythera-mechanism.html

Determine whether this working relic can be added as an interactive exhibit rather than a decorative simulation.

Concentrate on:
- validating the date model, lunar phase, Metonic cycle, Saros/eclipse indications, dial labels, gear relationships, and all claims about established versus reconstructed functions;
- directly testing crank drag, inertia, fine pointer control, touch behavior, keyboard alternatives, Today reset, face switching, X-ray mode, resize, and orientation changes;
- checking whether gear motion is mechanically coherent rather than merely visually coupled;
- preserving corrosion, patina, engraved detail, gear depth, and focal lighting while avoiding unreadably dark presentation;
- adding deterministic teardown for animation, listeners, audio, and rendering resources if it is absent;
- identifying a clear low-power or non-WebGL fallback without substituting a sterile static panel;
- placing research caveats beside the affected reconstructed features rather than hiding them in a general disclaimer.

State whether the scientific model is adequate for publication, which calculations need correction or independent verification, and what repository changes are required.
```

## 3. Senet

```text
Apply the shared audit contract to:
workspace/your_files/senet/senet.html

Determine whether this game can be added while remaining explicit that its exact ancient rules are lost.

Concentrate on:
- documenting which modern reconstruction the implementation follows and checking every movement, swap, protected-group, special-house, water, blocking, casting-stick, bearing-off, and AI rule against that chosen ruleset;
- testing complete games in local two-player and every AI difficulty, including no-legal-move states, repeated casts, undo, restart, and final-house edge cases;
- verifying board markings and iconography against archaeological examples rather than treating a modern rules diagram as an ancient original;
- preserving ebony, faience, gold, stick-cast motion, torchlight, and afterlife atmosphere without presenting symbolic interpretation as settled fact;
- checking that teardown, mobile DPR, audio, timers, and listeners satisfy the archive standards;
- integrating the historical note and evidence labels into the archive’s scholarly voice.

State whether the chosen reconstruction is internally consistent and publishable, and list every rule, symbol, or interface change required before addition.
```

## 4. Hnefatafl

```text
Apply the shared audit contract to:
workspace/your_files/hnefatafl/hnefatafl.html

Determine whether this 11×11 siege game can be added as a historically honest reconstruction with reliable asymmetric play.

Concentrate on:
- naming the exact rules variant implemented and distinguishing Viking-Age evidence from the later tablut account used in modern reconstruction;
- checking throne and corner behavior, king hostility, king capture requirements, sandwich captures, edge cases, repetitions, stalemate, victory detection, legal moves, undo, and AI play from both sides;
- testing full games at all AI levels and ensuring the AI does not exploit rules the player cannot use;
- verifying carved decoration and any runic imagery against attested material instead of generic “Viking” motifs;
- preserving snow-dusted oak, bone defenders, dark raiders, aurora, brazier light, and dimensional controls while retaining phone clarity;
- checking the full disposal path, sound lifecycle, render throttling, and reduced-motion mode;
- determining whether the tutorial explains asymmetry and victory conditions within 30 seconds.

State whether the implemented variant is suitable for the archive, what must be relabeled or altered, and where the scholarly reconstruction note should appear.
```

## 5. Oracle Bones of Anyang

```text
Apply the shared audit contract to:
workspace/your_files/oracle-bones-of-anyang/oracle-bones-of-anyang.html

Determine whether this divination exhibit can be added without overstating the precision of its modeled bone, inscriptions, crack interpretation, or ritual sequence.

Concentrate on:
- comparing the scapula silhouette, spine, glenoid cavity, prepared hollows, obverse, and reverse to the named CUL.52 reference and identifying every non-facsimile feature;
- verifying each displayed graph or inscription against a documented oracle-bone form and removing any invented, decorative, or mismatched sign;
- checking whether the inscribe → heat → crack → verdict sequence accurately conveys Shang pyromancy while clearly marking simulated interpretation;
- preventing generated crack patterns or verdicts from being presented as an authentic divinatory translation;
- preserving thin bone material, scorch blooms, heat progression, smoke, ember light, turnable specimen, and ritual pacing;
- testing journal state, reversibility, repeated rites, restart, input sanitation, mobile touch, audio, timers, and complete cleanup;
- adding specimen and inscription provenance in the archive’s source format.

State whether the exhibit is acceptable as an interpretive study, which visual or textual elements require stronger provenance, and what language prevents visitors from mistaking it for a scan or exact facsimile.
```

## 6. The Library Rescue

```text
Apply the shared audit contract to:
workspace/your_files/the-library-rescue/the-library-rescue.html

Determine whether this hybrid WebGL/canvas game can be added under the rule that flat gameplay elements do not ship.

Concentrate on:
- deciding explicitly whether 2D gameplay actors composited over a 3D hall meet the archive standard; if not, specify a full-WebGL actor migration for the scholar, carried scrolls, fire, smoke, ash, collisions, and feedback;
- testing all three wings, spreading fire, route blocking, shelf collapse, named-work collection, scoring, timer behavior, loss/win states, restart, phone controls, and keyboard parity;
- verifying every named author and work, and distinguishing attested holdings from plausible or purely game-driven selections;
- ensuring the game does not imply that the Library ended in one single cinematic fire; keep the multi-event historical caveat visible before or during play;
- preserving beveled cedar shelves, fluted columns, scroll cylinders, Greek-key ornament, moving firelight, and memorial tone;
- profiling the dual-renderer cost and proposing one coherent lifecycle, mobile budget, context-loss path, and complete disposal routine;
- checking whether emergency pacing remains solemn rather than turning the loss of texts into a trivial score chase.

Return a firm accept-composite or require-full-WebGL decision with reasons, followed by the exact alteration plan.
```

## 7. The Astrolabe

```text
Apply the shared audit contract to:
workspace/your_files/the-astrolabe/the-astrolabe.html

Determine whether this instrument is accurate and robust enough to be published as a working astrolabe rather than an atmospheric approximation.

Concentrate on:
- validating local sidereal time, rete orientation, star placement, plate projection, horizon and altitude lines, date handling, alidade readings, prayer-time presentation, and qibla calculation;
- checking the stated epochs, coordinate conventions, atmospheric assumptions, calendar assumptions, and limitations of any simplified computation;
- verifying Arabic and Latin star names, engraving, scales, and decorative calligraphy against appropriate historical examples;
- directly testing rete and alidade dragging with mouse, touch, keyboard, pointer cancellation, multi-touch rejection, resizing, orientation changes, and all supplied latitude plates;
- preserving engraved brass, patina, star pointers, swappable plates, night-sky reflection, and chiaroscuro while keeping fine markings legible on phones;
- adding deterministic teardown for rendering, animation, audio, listeners, and observers if absent;
- deciding whether qibla and prayer-time tools need explicit educational-only wording because the exhibit may simplify juristic or observational practice.

State which computations are publication-ready, which require correction or expert review, and the exact integration changes required.
```

## 8. The Alchemist’s Magnum Opus

```text
Apply the shared audit contract to:
workspace/your_files/the-alchemist-s-magnum-opus/the-alchemist-s-magnum-opus.html

Determine whether the four-stage puzzle can be added as a historically responsible exhibit on alchemical practice and symbolism.

Concentrate on:
- replacing Google Fonts with repository typography or locally hosted, licensed font files so the exhibit has no CDN dependency;
- playing Nigredo, Albedo, Citrinitas, and Rubedo end to end, including all failure, retry, sequence, timing, restart, journal, and completion states;
- verifying that the four-stage sequence is presented as one influential schema rather than a universal invariant across all alchemical traditions;
- checking the alembic, furnace, vessels, substances, seals, diagrams, colors, terminology, and manuscript imagery against named historical sources;
- removing invented sigils or visually plausible but unattested apparatus details;
- preserving glass depth, furnace brick, soot, vapor, firelight, stage-color transformation, and deliberate laboratory pacing;
- preventing the narrative from claiming successful metallic transmutation and distinguishing laboratory history from later psychological interpretation;
- checking teardown, timer cancellation, audio nodes, responsive controls, reduced motion, mobile DPR, and graceful fallback.

State whether the exhibit’s historical frame and all four puzzle stages are ready, and list each required source, visual, mechanic, and dependency correction before addition.
```

## 9. Mehen

```text
Apply the shared audit contract to:
workspace/your_files/mehen/mehen.html

Determine whether this serpent-coil race game can be added as a historically honest reconstruction with a complete, verifiable game loop.

Concentrate on:
- naming the exact rules reconstruction implemented and distinguishing excavated Mehen boards (Predynastic Egyptian finds) from modern rule proposals; Mehen's true rules are lost and the exhibit must say so;
- playing complete games: full spiral circuit, captures, exact-finish requirement, no-legal-move states, AI play, local two-player mode, win detection, restart, and undo;
- verifying the coiled-serpent board, lion pieces, and casting sticks against archaeological examples rather than generic Egyptian motifs;
- preserving the serpent-coil board depth, game-piece tactility, casting motion, torchlight, and desert-night atmosphere;
- checking teardown, mobile DPR cap, audio lifecycle, timers, listeners, and reduced-motion behavior;
- integrating the rules-provenance note into the archive's scholarly voice, clearly marking what is attested, what is reconstructed, and what is modern gameplay convention.

State whether the chosen reconstruction is internally consistent and publishable, and list every rule, symbol, or interface change required before addition.
```

## 10. The I Ching

```text
Apply the shared audit contract to:
workspace/your_files/the-i-ching/the-i-ching.html

Determine whether this divination exhibit can be added as a working, scholarly-responsible I Ching rather than a decorative oracle.

Concentrate on:
- verifying the casting simulation (coin or yarrow method as implemented), changing-line logic, hexagram assembly from six casts, and relating-hexagram derivation;
- confirming the archive's synopses remain clearly separated from the public-domain Legge translation and that no paraphrase is presented as translation;
- testing a complete six-cast reading end to end, including changing lines, relating hexagram, the 64-hexagram library search, journal export, restart, and repeated readings;
- verifying zero external requests (the Google Fonts dependency was removed pre-handoff — confirm no CDN dependency remains in the final snapshot);
- preserving casting-ritual pacing, bronze and silk materials, chiaroscuro, and solemn atmosphere;
- checking teardown, timer cancellation, audio nodes, listeners, mobile DPR, and graceful fallback.

State whether the casting logic and textual apparatus are publication-ready, and list each required correction before addition.
```

---

## Recommended handoff order

1. Give Claude the shared audit contract and one exhibit prompt at a time.
2. Require the analysis report before authorizing any repository edit.
3. Resolve shared architecture once: component boundary, archive shell, typography, lifecycle helper, audio policy, DPR policy, context-loss fallback, source-note component, and test harness.
4. Integrate one representative board game first. **The Royal Game of Ur** is the strongest pilot because it exercises rules, AI, tutorial, undo, sound, materials, and scholarly caveats without the dual-renderer question.
5. Follow with the other board games: **Senet**, **Hnefatafl**, then **Mehen**.
5. Reuse only validated infrastructure, never shared historical content or mechanics.
6. Treat **Library Rescue** as a separate architectural decision because of its hybrid renderer.
7. Treat **Antikythera**, **Astrolabe**, **Oracle Bones**, and **I Ching** as scholarship-sensitive exhibits requiring calculation, inscription, specimen, or translation verification before publication.
8. Run the acceptance checklist after each addition and keep each change independently reversible.

## Final acceptance gate

An exhibit is ready only when Claude can answer yes to all of the following:

- It fits an existing archive location without inventing taxonomy.
- It works through a complete session on phone and desktop.
- Mouse, touch, and keyboard paths are coherent.
- Historical claims, symbols, inscriptions, rules, and reconstructions are sourced and honestly labeled.
- The visual identity remains museum-grade and materially dimensional.
- No CDN, hidden network dependency, or unsafe global coupling remains.
- Mounting and unmounting repeatedly leaves no listeners, timers, audio nodes, animation loops, or GPU resources behind.
- Mobile DPR is capped at 1.0 and low-power fallback does not become a blank canvas.
- State changes are reversible or fail safely.
- Reduced motion, mute, focus, labels, contrast, and completion feedback are usable.
- Repository navigation, metadata, styles, paths, and source conventions are followed.
- The saved handoff snapshot remains unchanged.
