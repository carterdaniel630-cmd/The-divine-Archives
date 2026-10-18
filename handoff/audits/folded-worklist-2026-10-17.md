# Folded work list: audit briefs and fix package checked against the repo (2026-10-17)

**Sources folded:** `audits/advisory-brief-2026-10-15.md`, `audits/advisory-brief-2026-10-16.md`, `audits/atlas-audit.md`,
`audits/specialist-briefs-2026-10-16.md`, `fix-package/*`, `corrections-v2.md`, and the decisions files. When files
disagree, the later file wins.
**Checked against:** `staging/ready-line` @ 3d7e55d (read-only); `origin/main` is c455bfe. A second check confirmed these
by hand: `sound.js:65` `brook()`, `pantheon.html:7,19` "199 gods", `app.js:72` `touch ? 1.5 : 2`, 4 Wikipedia
citations in V72, and the bagh-chal "standard board" claim on line 463.
**State key:**
- **DONE**: finished in the repo.
- **STAGED**: on PR #59 only, not yet merged.
- **OPEN**: not done.
- **PARTIAL**: started, not finished.
- **MUSE-SIDE**: not stored in this repo, so it can't be checked here.
- **PARKED**: on hold.

## A. Already done or no longer applies (nothing to do)
- **D11 deploy truth.** README, CURRENT and `deploy.yml` all say Cloudflare Pages, and README notes the CNAME file as
  a leftover. The briefs' contradiction no longer exists. The live site was not checked.
- **D1 ready-line repair.** v2 exists with §1–17. It still has no Grimoire slot and no dated reset/triage rule, and it
  is marked DRAFT until Carter approves it.
- **900 Theses spec conformance.** The handoff copies are fixed (TEXT-ONLY, Arezzo, Apologia caveat, Gates C/D,
  Dionysian cross-note).
- **Glyph "not a facsimile" caveat** is present. **Reconstruction truth labels** are kept (Hnefatafl, I Ching).
- **Motion always on** (`app.js:61`). It respects the operating system's reduced-motion setting.
- **Protection charter** drafted (`protection-charter-DRAFT.md`).
- **STAGED (reach the live site only when PR #59 merges):** trademark ids, homepage blurbs, the "twelve games" line,
  and the over-claiming pages.

## B. Open, needs no ruling: the loop's queue, in order (small first)
| # | Item | Evidence | Size |
|---|---|---|---|
| 1 | Remove the hallway hiss: retire `brook()` from the corridors and the fountain (Carter's order) | `docs/museum/sound.js:65,100`; `world.js:30-38` | S |
| 2 | Change "199 gods" in the Pantheon meta and OG tags to "199 figures", plus the founder-guide line | `pantheon.html:7,19`; `00-audit/founder-guide.md:156` | S |
| 3 | V72: replace or demote its 4 Wikipedia citations with real, checked sources | `vault/v72-book-of-shadows.md:52-55` | S |
| 4 | Debate Hall preview safety: rebuild the bookmark without saving and reloading raw HTML; fix the quotation marks in the compare well | `previews/debate-table-3d.html` ~:893/910, :174/182 | S |
| 5 | Zodiac glyph `dispose()` should clear only its own host (`this.svg = null` today) | `integration/zodiac-glyphs.md:32` | S |
| 6 | Bagh-chal: diagonals only at alternating points; fix the "standard board" claim | `exhibits/wave3/bagh-chal.html:463` | S |
| 7 | Oracle Bones: "interpretive study" wording. Remove the Google Fonts load from the Oracle Bones and Library Rescue exhibits (the atlas audit's "zero external requests" claim is false) | exhibit files | S |
| 8 | Base `debate-hall-spec.md` still says "fifteen" stations: add an amendment line pointing to corrections-v2 C1.3 (16) | `debate-hall-spec.md:31` | S |
| 9 | Museum: lower the phone pixel ratio from 1.5 to 1.0 (needs a performance before/after) | `docs/museum/app.js:72` | S |
| 10 | Grimoire preview: "not an instruction" note above the circle rite; label the rite Gardnerian; lore flags on the Pythia/bay, Harner and Culpeper lines | `previews/witch-s-grimoire.html` | S |
| 11 | `relics.js` never frees GPU memory: trace whether this leaks, and fix it if so | `docs/museum/relics.js` (0 `dispose`) | M |
| 12 | Regenerate the blurred symbol sprites; add the missing symbol walls (Wings I, VII–IX) | `docs/museum/symbols/` (5 sheets, last changed 10-06) | M |
| 13 | Fix package (§7), relic by relic in the package's order: RF-6 Gematria volvelle, RF-7 Oracle Bones crack order, RF-8 Astrolabe, RF-9 Antikythera, RF-10 Alchemist, RF-11 Mehen, RF-12 Senet, RF-13 Hnefatafl pegs (PARTIAL), RF-14 I Ching yarrow, RF-15 Ur, RF-16 Library Rescue upscale; then RF-1 Emerald Tablet (= M8), RF-4 Grimoire anatomy, M1 book shapes, M2 Codex Gigas, M4 Zohar, M9 Gospel of Judas, M10 Nag Hammadi, M11 Sinaiticus binding (PARTIAL), M12 Holy Lance, M13 Mawangdui, M14 Siberian room, M15 bear, M16 animals under the glass | `handoff/exhibits/*` last changed 10-13, before the package; `relics.js` last changed 10-11 | M each |
| 14 | Teardown on Ur, Antikythera, Astrolabe and Alchemist; math review of Antikythera and Astrolabe; play-throughs of Alchemist stages 2–4 and a full Mehen match | `integration/teardown-status.md` | M |
| 15 | Glyph primary-source audit (D8). This unblocks the Rotunda floor wheel and the Ouija zodiac medallions | `zodiac-glyphs.md:9` "NEVER verified" | M |
| 16 | Symbols provenance registry (D7) | no registry file | M–L |
| 17 | Room registry fields (date bands, practice markers, plaques); Directory 76 → 83/84; different whispers per wing | `framework/registry/room.json` exists but lacks these fields; the preview adds up to 76 | L |
| 18 | Arcade D2: dropdown, bigger hidden room, all 37 games in historical forms, kiosks | 25 games exist only in `exhibits/wave3` | L |
| 19 | Game differentiation and playability floor: Yut 2v2, Konane sacrifice, Pachisi 4-player; difficulty, undo, tutorial | difficulty 2/15, tutorial 3/15 | M |
| 20 | Audio standard: parameters, volume control, per-room levels, text equivalents | 0 audio lines in the standards; no volume control in `sound.js` | M |
| 21 | Debate engine: 107 corpora, turn cap, classifier, quote-catcher, pantheon links | preview only. The corpus work can be prepared now; quoting translations waits on the licensing review (C) | L |
| 22 | Talking Museum answer-rule spec | no file | S |
| 23 | All-games audit: everything visible, possible to do, and feels good | none filed | L |
| 24 | Housekeeping: one decision log | rulings are spread over 3 decisions files plus corrections | S |

## C. Open, needs a Carter ruling (prepare only; the gated action waits)
- **Merge PR #59** and **Tomb Robber name** (also gates GF-2: bigger character, shorter spikes, jump audit).
- **Approve ready-line v2** (still DRAFT). **Protection charter D1–D4.**
- **Delphic Oracle / Pythia Pantheon entry** (D5). This adds a new Pantheon figure, which changes the canonical
  199 count.
- **Ra-Horakhty correction.** The correction text itself is not in the repo, so there is nothing to apply until
  Muse or Carter supplies it.
- **Errata location** (D10). This also gates the Shamanism video correction.
- **Ouija:** the title (trademark) and the invention/simulation/history disclosure. The rework is parked by the
  decisions of 10-17 (#5).
- **Sensitive relics:** M5 Shroud, M6 True Cross, M7 Black Stone. M3 Crown of Thorns was approved 10-16 but is a
  Christian relic, so it gets a sensitivity review before it ships.
- **Grouped chapters** (ch12, 14, 56, 61–63, 73, 75); **sensitivity matrix / variant lists / insider-review rule**;
  **translation-licensing review**.
- **Hit-feel / magic / gunfire / lightning sets:** scope them while Divine Casualties is parked?
- **Motion:** override the operating system's reduced-motion setting? (Recommended: no.)
- **900 Theses intake and Gates A–D.**
- **Ring / Wheel rulings** (perform vs witness, flame-law scope, palette). Those files are not in the repo.
- **Old-id compatibility table:** remove it after 90 days?

## D. Muse-side (can't be checked here)
The video/audio pipeline (D9, D12, captions, cadence, outro cues, Mary still, Curse Tablets / Evil Eye wording,
Shamanism video), checklist drift, DO-NOT-RETRY files, the weekly detail-pass lists, and the Atlas sync/visit
tracking. These stay with Muse.

## E. Parked (do not build)
VR/WebXR, the multilingual program and glossary, Divine Casualties rebuild (GF-1), the Mesoamerican ballgame,
Facebook cleanup, the case file, and the music reopen.

## Duplicates folded
- Crown of Thorns: M3 = ready-line §7/§8 = build-program §12.
- Emerald Tablet: RF-1 = M8.
- Library Rescue: RF-16 = ready-line §9 = Milo's finding.
- Hiss: Stan, Marcus, Vera and Cole = one item.
- D8 glyphs: Marcus, Clara, Ruth and Cole = one item.
- Arcade D2: Leo, Milo and Hank = one item.
- Naming and "twelve games": Hank, Wade and Leo = one item.
- A16 tiers 1–24 restate A15 tiers 1–15.
- The 900 Theses spec-gap notes (Iris, Ruth, Sara, Tess, Owen, Hugh) = one item.

## Corrections to the briefs
- The DPR cap is in `docs/museum/app.js:72`, not `m_app.js`.
- A room registry does exist (`framework/registry/room.json`); it lacks the date and practice fields.
- The atlas audit's F1 claim ("zero external requests") is false for Oracle Bones and Library Rescue.
