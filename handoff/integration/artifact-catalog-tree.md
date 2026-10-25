# Artifact Catalog — Directory Tree Map (2026-10-12)

Local validated artifact catalog for integration into the main codebase.
All snapshots are self-contained single-file builds (vanilla ES6+, zero
dependencies, zero external requests — verified). Snapshots are immutable;
integrate from copies.

## The 10 exhibits (exact file locations)

```
~/workspace/your_files/
├── the-royal-game-of-ur/the-royal-game-of-ur.html          44K
├── the-antikythera-mechanism/the-antikythera-mechanism.html 36K
├── senet/senet.html                                        44K
├── hnefatafl/hnefatafl.html                                40K
├── oracle-bones-of-anyang/oracle-bones-of-anyang.html      56K
├── the-library-rescue/the-library-rescue.html              52K
├── the-astrolabe/the-astrolabe.html                        52K
├── the-alchemist-s-magnum-opus/the-alchemist-s-magnum-opus.html 68K
├── mehen/mehen.html                                        32K
└── the-i-ching/the-i-ching.html                            40K
```

## Supporting documents

```
~/workspace/your_files/
├── atlas-audit/atlas-audit.md              # full audit (reference)
├── atlas-audit/atlas-audit-compact.md      # compact audit (portable, <3KB)
├── games-handoff-brief/Games Handoff Brief.md  # shared audit contract + per-game prompts
└── claude-integration/
    ├── artifact-catalog-tree.md            # this file
    ├── library-rescue-lifecycle.md         # unified lifecycle/disposal spec (P0 resolution)
    └── vault-manuscripts-batch.md          # batch layout for the 5 missing Vault manuscripts

~/workspace/build-standards/
├── modular-framework-standard.md           # 8-clause framework (binding)
├── artistry-standard.md                    # 5-parameter artistry bar (binding)
├── batch-emission-protocol.md              # Hard Batch Engine rules
├── craft-council-prompts.md                # council prompts for Claude Code
└── research-drafter-role.md                # research/drafting assistant role

~/workspace/email-drafts/
└── 2026-10-12-integration-verdicts.md      # [MUSE] RESEARCH draft: per-game verdicts
```

## Snapshot freshness
Re-exported 2026-10-12 after all repairs (Ur match-start flow, Antikythera
day-count, Astrolabe pointer reachability, Alchemist + I Ching font
removal). The 10 files above are the current validated set.
