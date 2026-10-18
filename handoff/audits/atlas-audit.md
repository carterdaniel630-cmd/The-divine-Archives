# ATLAS AUDIT — Complete Build Program (2026-10-12)

Auditor: atlas (Muse). Scope: everything built in this program — 10 exhibits,
shared datasets, standards, and all repairs. Method and evidence below.
Designed to be used alongside Claude Code's independent audit on a
separate AI platform for troubleshooting: agreements are settled facts,
disagreements are the troubleshooting agenda.

## How each exhibit was verified
- Fresh desktop + 390px mobile audits: HTTP delivery, console errors,
  broken assets, clipping, overflow, unreachable controls, security scan.
- Live probes: real flows driven (tutorials, moves, casts, dials, panels,
  journals, restarts) on both viewports.
- Static source scans: external imports (fonts, scripts), explicit
  `.dispose()`/teardown presence, network calls, browser storage use.
- Limits of method: probes are click/keyboard-driven; fine drag gestures,
  full-length game sessions, and device-GPU behavior were not exhaustively
  covered. Anything not directly exercised is marked OPEN below, not
  assumed.

## Program inventory
Exhibits (10): the-royal-game-of-ur, the-antikythera-mechanism, senet,
hnefatafl, oracle-bones-of-anyang, the-library-rescue, the-astrolabe,
the-alchemist-s-magnum-opus, mehen, the-i-ching.
Saved snapshots: workspace/your_files/<slug>/<slug>.html (immutable).
Shared datasets: 12 zodiac glyph SVGs (batch-engine format); 8-entry
museum expansion manifest (blueprint contract format).
Standards: modular-framework-standard.md (8 clauses),
artistry-standard.md (5 parameters), batch-emission-protocol.md,
craft-council-prompts.md, research-drafter-role.md.

---

## Per-exhibit audit

### 1. The Royal Game of Ur — PASS WITH NOTES
Verified: complete playthrough (tutorial, dice, legal moves, rosette,
captures, bearing off, undo), 3-level AI, local 2-player, mobile clean.
Repairs applied: match-start flow (welcome panel now closes into live
board on mode select).
OPEN: deterministic teardown not explicitly confirmed (no `.dispose()`
in source scan; may exist under another name). Deferred to integration
audit. No artistry or scholarship blockers.

### 2. The Antikythera Mechanism — PASS WITH NOTES
Verified: front/rear dials, X-ray gear train, Today reset, education
panels, sound toggle, mobile clean.
Repairs applied: calendar register corrected (Oct 12 now day 285 of 365;
crank-year counter uses actual day count, not mean-year drift).
OPEN: (a) teardown unconfirmed — deferred; (b) crank-drag gesture
implemented but not probe-exercised — needs device testing; (c) lunar /
Saros mathematics needs independent verification before publication.

### 3. Senet — PASS
Verified: full playthrough (casts, swaps, protected groups, special
houses incl. drowning waters, bearing off), 3-level AI, tutorial,
history panel, mobile clean. No repairs needed. No open defects.
Integration work only (asset mapping, Arcade template).

### 4. Hnefatafl — PASS
Verified: full playthrough (selection, moves, captures, king escape,
AI both sides), undo, 5-part tutorial, mobile clean.
Repairs applied pre-delivery: opening tutorial de-flattened (no longer
blocks entry; dimensional controls).
No open defects. Integration work only.

### 5. Oracle Bones of Anyang — PASS WITH NOTES
Verified: full rite (inscribe → heat → crack → verdict), journal,
mobile clean.
Repairs applied: centerpiece scapula rebuilt from named CUL.52 specimen
(spine, glenoid cavity, irregular hollows, obverse/reverse faces).
LIMITATION (accepted): the bone is a hand-traced procedural study of
CUL.52, not a scan-derived mesh — pit coordinates and sign tracing are
not facsimile-accurate. Exhibit must carry "interpretive study" language;
never describe positions as exact.

### 6. The Library Rescue — PASS WITH NOTES
Verified: three wings, fire spread, collapses, named-work collection,
scoring, memorial, history panel, mobile clean.
Repairs applied: dimensional rebuild (beveled shelves, fluted columns,
scroll cylinders, Greek-key ornament, dynamic firelight).
OPEN — architecture decision: environment is WebGL; gameplay actors
(ship/scholar, scrolls, fire, smoke) render on a 2D canvas composited
above. atlas recommendation: ACCEPT the composite (actors are small
fast-moving tokens; full-WebGL actors raise mobile GPU cost against
hard performance bounds for no visible gain; scene reads dimensional).
Dissent on record: automated critic rated P0. Requires Carter sign-off
to overrule. If accepted: unify lifecycle/disposal across both
renderers and verify mobile GPU budget at integration.

### 7. The Astrolabe — PASS WITH NOTES
Verified: front/back faces, latitude plates (incl. Córdoba, Cairo),
prayer/qibla panel, guided tasks, sound toggle, mobile clean.
Repairs applied: star-field orientation corrected (rete now keyed to
computed local sidereal time); star-pointer reachability fixed
(overlapping layer removed; all nine pointers selectable).
OPEN: (a) teardown unconfirmed — deferred; (b) rete/alidade drag
gestures not probe-exercised — needs device testing; (c) sidereal /
qibla mathematics needs independent review; (d) confirm
educational-only wording on prayer-time tools.

### 8. The Alchemist's Magnum Opus — PASS WITH NOTES
Verified: entry flow, Nigredo played end-to-end, history panel,
journal, mobile clean.
Repairs applied: Google Fonts dependency removed (zero external
requests; visually identical).
OPEN: Albedo, Citrinitas, Rubedo source-validated but not
end-to-end playtested — full playthrough required before publication.

### 9. Mehen — PASS WITH NOTES
Verified: tutorial, casting, legal-move reveal, sound, history
drawer, mobile clean.
OPEN: full match to final victory not played end-to-end by probe
(move/capture/exact-finish/AI/win/restart paths implemented in
source). One complete game session recommended.

### 10. The I Ching — PASS
Verified: complete six-cast reading, changing lines, relating
hexagram, 64-hexagram library, journal export, mobile clean.
Repairs applied: Google Fonts dependency removed (zero external
requests; visually identical).
History panel correctly separates archive synopses from the
public-domain Legge translation. No open defects.

---

## Cross-cutting findings
- F1 — External dependencies: eliminated. Alchemist and I Ching had
  Google Fonts imports; both removed, verified zero external requests,
  pixel-identical rendering. No other exhibit makes network calls or
  uses browser storage.
- F2 — Teardown: Ur, Antikythera, Astrolabe show no explicit
  `.dispose()` in source scans. Repair-check inspections were
  inconclusive (they fixed real bugs instead: Ur match-start flow,
  Antikythera day-count, Astrolabe pointer reachability). Teardown
  confirmation is deferred to the integration audit — it is item 6 of
  the shared audit contract in the Games Handoff Brief.
- F3 — Renderer architecture: Library Rescue hybrid (WebGL + 2D
  composite) — decision above.
- F4 — Specimen fidelity: Oracle Bones bone is interpretive study,
  not facsimile — language guard required.
- F5 — Math verification: Antikythera (lunar/Saros) and Astrolabe
  (sidereal/qibla) calculations need independent review before
  publication. Both are currently builder-implemented and
  probe-plausible only.
- F6 — Playtest gaps: Alchemist stages 2–4, Mehen full match —
  end-to-end sessions outstanding.
- F7 — Gesture testing: crank drag (Antikythera), rete/alidade drag
  (Astrolabe) — implemented for touch/mouse/keyboard, not
  probe-exercised; needs real devices.
- F8 — Zodiac glyph dataset: 12 SVGs are clean vector renditions of
  traditional glyph forms authored as paths (not font-dependent).
  They are NOT traced from a specific manuscript — do not present
  them as facsimiles of any historical source.

## Standards compliance (auditor's assessment)
- Framework clauses 1–5 (vanilla, asset-inline, disposal intent,
  mobile throttling, output discipline): met across all exhibits
  (clause 2's production form — /assets/... registry — is an
  integration task, not a build defect).
- Framework clauses 6–8 (ledger, neutrality, reversibility):
  specified after builds began; retrofit at integration.
- Artistry parameters 1–5: met; two pre-delivery violations were
  caught and corrected (Hnefatafl tutorial flatness; Library Rescue
  scene flatness). Remaining accepted limitation: F4.
- Zero-CDN: met after F1 repairs (verified).

## Repair log (2026-10-12)
Ur match-start flow · Antikythera day-count (286→285) · Astrolabe
star-field orientation + pointer reachability · Hnefatafl tutorial
de-flattening · Library Rescue dimensional rebuild · Oracle Bones
CUL.52 scapula rebuild · Alchemist + I Ching font removal.

## Troubleshooting agenda for the external platform
Compare against Claude's audit; work the disagreements first:
T1. Teardown existence/method on Ur, Antikythera, Astrolabe.
T2. Correctness of Antikythera and Astrolabe astronomical math.
T3. Library Rescue: accept composite vs. full-WebGL migration
     (see recommendation and dissent above).
T4. Alchemist stages 2–4 and Mehen full-match playtests.
T5. Real-device gesture tests (crank, rete, alidade).
T6. Whether Oracle Bones' interpretive-study framing is
     sufficient, or the bone needs deeper specimen work.
T7. Any F1–F8 item where Claude's audit disagrees with this one.
