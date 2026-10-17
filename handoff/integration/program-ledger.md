# Program Ledger — Muse × Claude Code (2026-10-12)

Everything built across both sides, in one place. Muse-side items are
verified by atlas against runtime records. Claude-side items are
Carter-reported (no repo access on the Muse side) and marked as such.

## MUSE SIDE (verified)

### Exhibits — 10, all delivered, all saved
| # | Exhibit | File | Size | Status |
|---|---------|------|------|--------|
| 1 | The Royal Game of Ur | your_files/the-royal-game-of-ur/the-royal-game-of-ur.html | 44K | Delivered; match-start flow fixed |
| 2 | The Antikythera Mechanism | your_files/the-antikythera-mechanism/the-antikythera-mechanism.html | 36K | Delivered; calendar day-count fixed |
| 3 | Senet | your_files/senet/senet.html | 44K | Delivered, no repairs |
| 4 | Hnefatafl | your_files/hnefatafl/hnefatafl.html | 40K | Delivered; tutorial de-flattened |
| 5 | Oracle Bones of Anyang | your_files/oracle-bones-of-anyang/oracle-bones-of-anyang.html | 56K | Delivered; scapula rebuilt from CUL.52 |
| 6 | The Library Rescue | your_files/the-library-rescue/the-library-rescue.html | 52K | Delivered; dimensional rebuild; hybrid renderer — Carter's call pending |
| 7 | The Astrolabe | your_files/the-astrolabe/the-astrolabe.html | 52K | Delivered; star-field + pointer fixes |
| 8 | The Alchemist's Magnum Opus | your_files/the-alchemist-s-magnum-opus/the-alchemist-s-magnum-opus.html | 68K | Delivered; Google Fonts removed |
| 9 | Mehen | your_files/mehen/mehen.html | 32K | Delivered |
| 10 | The I Ching | your_files/the-i-ching/the-i-ching.html | 40K | Delivered; Google Fonts removed |

### Audits, briefs & integration docs
- atlas-audit/atlas-audit.md — full audit (10 exhibits, F1–F8, T1–T7)
- atlas-audit/atlas-audit-compact.md — portable audit (<3KB)
- games-handoff-brief/Games Handoff Brief.md — shared audit contract + per-game prompts for Claude Code
- claude-integration/artifact-catalog-tree.md — exact file map
- claude-integration/library-rescue-lifecycle.md — unified lifecycle/disposal spec (P0 resolution)
- claude-integration/vault-manuscripts-batch.md — batch layout for the 5 missing manuscripts (awaiting repo chapter list)
- claude-integration/teardown-status.md — honest per-exhibit disposal record (4 attested, 2 likely, 4 unverified)
- claude-integration/exhibits-integration-payload.zip — 10 exhibits + 4 docs, 14 files

### Standards (all in ~/workspace/build-standards/)
- modular-framework-standard.md — 8 clauses (binding)
- artistry-standard.md — 5 parameters (binding)
- batch-emission-protocol.md — Hard Batch Engine
- craft-council-prompts.md — drop-in council pack for Claude Code
- research-drafter-role.md — research/drafting assistant role

### Datasets (batch-engine format)
- 12 zodiac glyph SVGs (true-path, not manuscript facsimiles)
- 8-entry museum expansion manifest (blueprint contract)

### Email drafts (awaiting Gmail connection)
- email-drafts/2026-10-12-integration-verdicts.md — [MUSE] RESEARCH: per-game verdicts (all 8 at ADD AFTER CHANGES, none held)

### Videos
- 10 shorts in your_files (disdain-*.mp4) + demo ankh short; 9-video backlog approved for posting. First distribution post due 2026-10-12 ~18:42 ET.

## CLAUDE SIDE (Carter-reported, not independently verified)
- Live site: getconexto.com — Nine Ages, Traditions/Themes, Vault, Pantheon (199 deities), Symbols, Museum (3D beta), Pilgrimage, Arcade, Methodology, About.
- Production repo: 12 games, 83 chapters (repo audit by Claude Code).
- PR #58: protected sandbox directory outside published docs/; pipeline blocks accidental deployments from it.
- Live-site survey (atlas, 2026-10-11/12): Vault shows 88 manuscripts. RESOLVED 2026-10-12: read-only GitHub check found the repo's `vault/` on `main` already holds all 88 (`v01`…`v88`); `vault-diff.py` matched 88/88, 0 missing. The "83" audit count was stale. No batch emission needed.

## HANDOFF STATE
- **Delivered to Carter:** everything above; payload zip ready for the PR #58 staging route.
- **Pending Carter:** ~~repo's 83-chapter list (to identify the 5 missing manuscripts);~~ Gmail connection (to send [MUSE] drafts); sign-off on Library Rescue renderer (accept composite vs. full-WebGL rebuild).
- **Pending Claude Code (per handoff brief):** per-game integration assessments; teardown confirmation on Ur/Antikythera/Astrolabe/Alchemist via mount/unmount residue tests; independent review of Antikythera/Astrolabe math; end-to-end playtests (Alchemist 2–4, Mehen full match); device gesture tests.
- **Roadmap (Carter, 2026-10-12):** the 10 exhibits will be added to the Museum section later, after the current integration phase.
- **Standing:** no repo access for Muse — all production changes go through Claude Code; Carter decides what gets built.
