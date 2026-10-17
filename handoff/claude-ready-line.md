# Ready-Line v2 — Ordered Work Queue (DRAFT, 2026-10-17)

**Status: DRAFT. v2 is NOT live. Replaces the v1 ready-line only after Carter approves v2.**
**Version:** v2-draft-2026-10-17. **Supersedes:** v1 ready-line (2026-10-16).
**How to use this queue:** work it in order, except where an item is marked PARKED, ON HOLD, or OPEN. Where any older doc contradicts this queue, the newest Carter ruling wins. Where a Muse-side spec contradicts the repo, the repo is the truth — flag the conflict, do not silently pick one.
**Counts in this queue are canonical:** 83 museum rooms existing, 84 with the 900 Theses room; 15 + 1 = 16 Debate Hall stations; 199 Pantheon figures; 88 Vault manuscripts; 37 arcade games (12 + 25).

## Pickup order (applies to every pickup)

1. Finish whatever was in progress when work stopped. Do not drop in-progress work to start something new.
2. Audit the system: what is built, what is staged, what is broken, what contradicts what. Verify the audit briefs against the repo — do not just trust them.
3. Fold ALL instructions together (this queue + both audit briefs + decisions + corrections + standing policies). Newest Carter ruling wins on conflict.
4. Rebuild Muse-side work better — expand, add detail, compare, push every game and relic further. Do not do the work twice.

## 1. Protection program — FIRST, gates everything below

Protection charter still to be drafted (not delivered in this package). Security / legal / platform-compliance audit whose constraints every build below must satisfy. Building inside known constraints is cheap; retrofitting is expensive.
Binding policies: Naming & IP Policy (generic names everywhere — no trademarked names, no "-style" phrasing, no copyrighted characters/plots) and Content Truth Policy (present what was actually said/believed/made, accurately and completely, down to the letter). Code-theft measures required: obfuscation pipeline, no public source maps, watermarking/fingerprinting, copyright headers, no client-side secrets, tamper-evidence. Honest baseline: client-side code cannot be made truly unhackable — make theft expensive, detectable, legally actionable.
Owner: build side (draft); Carter (approve).

## 2. Fix over-claiming pages FIRST (free, Carter 2026-10-16)

Pages must say only what the code does. Fixes: the two pilgrimage pages claiming survey measurements that do not exist (Library of Alexandria, Qumran); "tap to play" on cabinets that open a card; finishers that do not exist; game renames (maze game + trademarked homepage descriptions). Homepage arcade blurbs: remove all trademarked / "-style" phrasing; fix the "Twelve games in all" line (false against 37 under keep-both).
Owner: build side.

## 3. 900 Theses room — TOP PRIORITY (Carter 2026-10-16, reaffirmed 2026-10-17)

Own museum room for Pico della Mirandola, Conclusiones nongentae (900 Theses, 1486) + offered at the Debate Hall table as Station 16. Utmost care; protected and accurate through and through. Specs: `handoff/nine-hundred-theses/` (research report, room spec, debate-table integration). Decided: Arezzo included (one factual paragraph); Oration TEXT-ONLY (no voice); Waite (1929) yes if gates pass, labeled + caveated. Hard gates: Gate A Farmer/Copenhaver extraction; Gate B translation-licensing; Gate C manifest/Directory/Atlas confirmation; Gate D capture-verified build check with a named verifier. Threshold / bridge room on the High Medieval / Early Modern boundary. Room count becomes 84 with this room.
OPEN: collection intake — Vault entry? chapter assignment? Pantheon entry? Some combination? None? The room floats outside all three collections until Carter rules. Do not assign it a number.
Owner: build side.

## 4. Fit-loop system (Carter 2026-10-16)

The build method from now on for relics and rooms: pull reference photos → count pixels for proportions → render → compare → push the math until it matches. This is how relics and rooms get built from now on.
Owner: build side.

## 5. Engine evaluation (Carter 2026-10-16)

Engine direction approved. Next step is EVALUATION ONLY: which engine, what it costs, what breaks, what happens to the no-packages rule. NO rewrite until the evaluation lands and Carter confirms it.
Owner: build side (evaluate); Carter (confirm).

## 6. Endless-tree museum (Carter 2026-10-16)

Approved: branches instead of a fixed hallway — every room ends in a choice, every choice branches, no two visits the same.
Owner: build side.

## 7. Relic + game fixes (fix package)

Specs: `handoff/fix-package/` (relic fixes for 19 audited relics + museum photo audit; game fixes for Divine Casualties + Tomb Robber + all-games bar; weekly detail-pass program). Crown of Thorns is ONE revamp job (see §8). Bagh-chal gameplay error: diagonals only through alternating points; correct the "standard board" claim. Museum photo audit: generic-book problem, birds belong in the air / fish in water / land animals on the ground above the glass (no animal under the floor unless the story says it is buried), plus the per-relic fixes.
Balance rule: creative renditions stay engaging — label departures, do not strip capabilities for pure accuracy.
Owner: build side.

## 8. Build program — 11 builds + Crown of Thorns revamp (Carter 2026-10-16)

Briefs: `handoff/build-program/build-program-approved.md`. The 4 relics from the 2026-10-16 decisions travel as briefs here: Treaty of Kadesh tablet, Crown of the Kandake, Etruscan bronze mirror, Crown of Thorns revamp. Plus: Scythian gold stag, Tabula, Awithlaknannai, Sort the Seals, Mithraeum, Fire Temple, Langar, Cave painting wall. Mesoamerican ballgame EXCLUDED — still parked, do not spec it. Top-tier standard on every item: detail, palettes, tones, lighting, shading — all top tier, all based on Divine Archives information.
Owner: build side.

## 9. The Royal Game of Ur + remaining nine exhibits

Ur first — establishes true per-exhibit cost before the rest. Then, by audit severity: Senet, Astrolabe, I Ching, Antikythera, Hnefatafl, Oracle Bones, Alchemist, Mehen, Library Rescue (hybrid ACCEPTED + UPSCALE — bigger, more detailed, fills the screen; no full-WebGL rebuild).
Owner: build side.

## 10. Agent systems rollout

The pack: five systems, all approved 2026-10-13. Config: `handoff/agent-systems-config.md` (already in repo). On pickup: review the filled config against the actual repo, then bless or amend.
Owner: build side.

## 11. Arcade — KEEP BOTH (Carter 2026-10-15)

The 12 live reskins STAY, and the 25 historical games get ADDED IN, with distinct labels and separate spaces. Refresh the arcade section; arcade UI changes from individual boxes to a dropdown menu; EXPAND (not just rearrange) the secret hidden arcade room; ALL 37 games go in the hidden room; kiosks in every room OR games embedded in room info (either works); retro cabinets REPLACED with historical forms. Implement the differentiation brief in files. Playability floor: difficulty selector, undo, tutorial, readable tap targets.
Owner: build side.

## 12. Debate Hall — solo first, social later

Solo mode: visitor debates the philosopher itself, back-and-forth against its actual positions, in its own words. Soul-flame avatars — no 3D figures; text bubble floats over a flickering flame. Utterance tiers: VERBATIM (exact quote, cited), PARAPHRASE (labeled, never in quotes), HALL (room narrating, never attributed). Stations: 15 question stations + 1 disputation station (900 Theses) = 16. Safety fixes first: bookmark raw-HTML round-trip (self-injection hole) + compare-well quotation-marks violation. Then: corpora for remaining figures, source shelf, quote-catcher, plaque-map remap to the real 83-room Nine Wings (84 with 900), pantheon link targets, translation-licensing review.
Social mode (pilgrim-lights) comes with the Living Archive phase — architect for it, do not build it now.
Owner: build side.

## 13. Grand Directory + Atlas reconciliation

Grand Directory: true floor plan (central spine, 9 wings alternating west/east), "you are here" beacon, key/legend, journey plotting, wing zoom, Easter eggs as "whispers" (hinted, never revealed). Counts: Directory data comes from the museum manifest — 83 rooms, 84 with the 900 room. Never hard-code. One canonical room registry (room IDs, date bands, practice/plaque fields, interactive sites) reconciling Directory vs. Atlas vs. live museum text. Reconcile wing date bands with one canonical table + one owner. Whispers: per-wing verified counts or a clearly-labeled generic form — not identical boilerplate on every wing.
OPEN: deploy truth (Cloudflare vs. GitHub Pages) — one canonical deploy path, confirmed by the build side. Errata/corrections location (D10) — single location that Methodology links to; until chosen, corrections live on the card + corpus errata array.
Owner: build side.

## 14. Content Truth + Naming & IP — binding, always on

Already in the repo. Apply on every review. No blurring, backing off, or silent omissions. Philosophers' words preserved verbatim. Only exception: content explicitly violating a religion's own tenets inside its own sacred space.
Owner: build side (apply).

## 15. Easter eggs — standing program

One hidden Easter egg per chapter, ongoing as chapters are added. Bronze Age gold-sign hunt ("EVERY TRADITION LEFT A DOOR") is the template.
Owner: build side.

## 16. Remaining defects + open items

- Blurred symbols: unblur or replace; no gray blobs. Blur is baked into the sprite sheets; regenerate affected cells.
- Rotunda zodiac floor: 12 sign lights as a floor-set wheel. BLOCKED on audited zodiac glyphs — commission a primary-source audit before any Rotunda/Ouija use; fix glyph dispose to clear host only. Do not ship the unaudited registry as the fix.
- Hallway hiss: REMOVAL, not replacement. Technique lives in `brook()`. Near-silence (faint stone resonance at most).
- Delphic Oracle / Pythia Pantheon entry: institution-and-person, Apollo cross-linked, NOT invented as a goddess. Completes 3-of-3 oracle spirits.
- "199 figures" + one-line Pantheon grouping rule (singular figures + groups) on the page; meta/OG descriptions fixed; stale "199 deities" strings fixed.
- V72 ONLY: replace/demote the 4 Wikipedia citations. No full 88-entry sweep.
- Symbols provenance registry: symbol, tradition, attested date range, source, evidence badge.
- 900 Theses intake ruling (see §3) — needs Carter.
- D10 errata location + D11 deploy truth (see §13) — need confirmation.
- Ra-Horakhty correction propagation to Pantheon/Museum.
- One disclaimer standard everywhere (Grimoire "not an instruction" above the circle rite; Ouija archive-invention + simulation + grief framing + in-session answer-engine disclosure).
- Practice renditions: per-tradition rulings + variant lists still pending. Exorcism observational only. Sensitivity matrix / Show-Veil-Withhold protocol still to be built. Insider-review rule for living-belief content still needs Carter's ruling.
- Translation-licensing legal review before any verbatim translated display ships.
- "Ouija" title consistency ruling still open.
- Music stays PARKED. No Round 6 without reference track / owner / reopen trigger.
Owner: build side; Carter (open rulings).

## 17. PARKED / ON HOLD — do not build

- VR museum: PARKED (reaffirmed 2026-10-17). Specs on file. Do not start until Carter reopens.
- Family-court case file: PARKED (2026-10-17). Not repo-bound. No work.
- Multilingual program: PARKED / ON HOLD (reaffirmed 2026-10-17). English only. Plan on file only.
- Facebook Page cleanup: CANCELLED. Do not restart. Carter handles Facebook manually.
- Mesoamerican ballgame: PARKED. Do not spec it.
- Divine Casualties rebuild: completed / scratched per prior rulings — do not revive without Carter's say-so.

## Staging rule

Nothing merges to main without Carter's explicit go-ahead. Staging area: PR #59. Muse writes handoff files directly to the staging branch (staging only — authorization confirmed 2026-10-17, recorded in PROTOCOL-two-way-channel.md), but ONLY after Carter approves v2. No writes happen in this draft. The build side works on feature branches and writes replies/status back on the staging branch.
