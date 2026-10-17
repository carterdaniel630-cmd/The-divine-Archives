# Handoff v2 — Manifest (LIVE, 2026-10-17)

**Status: LIVE. v2 was approved by Carter 2026-10-17 and written to the staging branch.**
**Version:** v2 + explainer add-on (Item 15) + video-and-flow addendum (Item 16) + format-live addendum (Item 17) + loops spec (Item 18) + Claude loops research (Item 19) + chief-of-staff note (Item 20) + Carter answers to Claude blocked items (Item 21) + mergeable-list instruction (Item 22).
**Channel:** Muse writes handoff files DIRECTLY to the GitHub staging branch → build side reads them, reworks, and writes replies/status back on the same branch → Muse reads back. No Carter courier. Carter only sends TikTok himself; Facebook is automatic after Carter's click (see Addendum §4). Carter approves anything merging to main.
**Authorization:** Carter confirmed 2026-10-17: "Yes, Muse can write to staging branch only." Hard limits: staging only, never main, never merge, nothing live without Carter's explicit go-ahead.
**How to read status:** NEW = not in the repo yet (at send time). REPLACES = overwrites the whole old copy. OVERWRITES = replaces the old copy with the corrected copy. CARRIED = already in the repo (PR #59), do not re-send. ON HOLD = travels on file only, do not build. ADD-ON = added after the main send; does not renumber items 1–14.

## Send order (14 items, written 2026-10-17)

| # | Item | Status | Repo destination |
|---|---|---|---|
| 1 | Ready-line v2 (ordered work queue) | REPLACES | `handoff/claude-ready-line.md` |
| 2 | Decisions 2026-10-16 (9 approvals) | NEW | `handoff/decisions-2026-10-16.md` |
| 3 | Decisions 2026-10-17 (list walk + video end-tag pick) | NEW | `handoff/decisions-2026-10-17.md` |
| 4 | Corrections v2 (line-level overrides for v1 files) | NEW | `handoff/corrections-v2.md` |
| 5 | Pickup order (finish → audit → fold → rebuild better) | NEW | `handoff/pickup-order.md` |
| 6 | Audit brief 2026-10-15 (D1–D14 rulings + addenda) | NEW | `handoff/audits/advisory-brief-2026-10-15.md` |
| 7 | Audit brief 2026-10-16 (full-scope audit) + specialist briefs | NEW | `handoff/audits/advisory-brief-2026-10-16.md` + `handoff/audits/specialist-briefs-2026-10-16.md` |
| 8 | Witch's Grimoire preview (self-contained) | NEW | `handoff/previews/witch-s-grimoire.html` |
| 9 | Ouija fortune-board preview (self-contained) | NEW | `handoff/previews/ouija-board.html` |
| 10 | Multilingual plan | ON HOLD — on file only, do not build; English only | `handoff/multilingual-plan-for-claude.md` |
| 11 | 900 Theses specs (research + room + debate-table integration) | NEW | `handoff/nine-hundred-theses/` (3 files) |
| 12 | Hiss defect file (corrected: removal-only, `brook()`) | OVERWRITES | `handoff/defects/hallway-hiss-babble.md` |
| 13 | Fix package (relic fixes + game fixes + weekly detail pass) | NEW | `handoff/fix-package/` (3 files) |
| 14 | Build program (11 builds + Crown of Thorns revamp; the 4 relics travel as briefs here) | NEW | `handoff/build-program/build-program-approved.md` |

## Item 15 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–14)

| 15 | Explainer: what Muse is doing for Claude (the whole gambit) | NEW | `handoff/explainer-for-claude.md` |

## Item 16 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–15)

| 16 | Addendum 2026-10-17: final video end tag + call to action, production split, storyline videos, build-all approval flow | NEW | `handoff/addendum-2026-10-17-video-and-flow.md` |

**Where the addendum and an older v2 file disagree, THE ADDENDUM WINS.** In particular: the final video end tag is "The past is still speaking. Follow and share — The Divine Archives." (with the call to action) — not the plain Option 2 tag recorded in Decisions 2026-10-17 and in the older manifest line. Daily production is 3 full animations + 3 stills-with-motion (6 total). All videos go to Carter for approval before shipping to Facebook (auto-post is OFF for these videos). Storyline videos are a new kind; Anansi is the first storyline demo. The "DRAFT / v2 is NOT live" headers inside Decisions 2026-10-17 and other v2 files refer to their pre-approval state; v2 was approved and written after those headers were drafted — this manifest (LIVE) is the controlling record.

## Item 17 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–16)

| 17 | Addendum 2026-10-17: new format is LIVE, 5 re-tags posted | NEW | `handoff/addendum-2026-10-17-format-live.md` |

**Where this addendum and an older v2 file disagree, THIS ADDENDUM WINS.** In particular: the new format IS live — Carter approved the Mithras CTA demo as the format reference on 2026-10-17. That supersedes the "new format is NOT live until Carter approves a demo" lines in v2 / Item 16. The Mithras demo itself did NOT ship — it stays in pending/demo as the format reference only. All 5 re-tags (Valhalla, Krampus, Tower of Babel, Excalibur, Baba Yaga) are POSTED to Facebook with the final end tag "The past is still speaking. Follow and share — The Divine Archives." and captions verified (post IDs in Item 17). The ship-approval flow stands: each video goes to Carter as it finishes, and ships to Facebook only after he clicks approve. Next batch of 6 (3 animations + 3 stills) + the Anansi storyline demo are still building.

## Item 18 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–17)

| 18 | Performance spec — LOOPS-FIRST (loops that expand information; SCALE: why loops let ~30,000 updates ship without bogging down) | NEW | `handoff/addendum-2026-10-17-loops-spec.md` |

**Where this spec and an older v2 file disagree, THIS SPEC WINS on performance method.** Headline: every loop is **thread → benchmark → PR → flag → field → ratchet → NEXT loop**, and every loop writes down what it learned so the next loop starts smarter and expands on it. The id-map / "1 lookup per id" trick is ONE example of what a loop can produce — not the headline. SCALE: ~30,000 updates shipped without bogging down because (1) 1 lookup per id = constant-time lookups, cost does NOT grow as history piles up; (2) ratchets = regressions cannot pile up, each loop locks in its gain; (3) flags = fast rollback, one bad change never bogs the whole system; (4) benchmarks = slowdowns caught BEFORE they ship. Three loops named: video pipeline loop, site loop, council loop — each feeding the others. Guardrails: no behavior/visual changes in a performance PR, measure before AND after, phone-class budgets stay (Galaxy S22 is the verdict), no public source maps, no client-side secrets, staging only, nothing live without Carter's go-ahead. This spec does NOT authorize repo code edits by itself — code edits still need the loop process + Carter's go-ahead.

## Item 19 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–18)

| 19 | Claude loops / speed research — the TikTok's source found, claims verified, scale corrected | NEW | `handoff/research-2026-10-17-claude-loops-speed.md` |

**Where this research and Item 18 disagree, THIS RESEARCH WINS.** Two corrections, both binding:
1. **Item 18's "~30,000 updates" is STRUCK.** No source says 30,000. Anthropic says **>3,000 changes in two weeks** (>150 concurrent threads, >200 changes on busiest days). Do not use 30,000 anywhere. Item 18's loop framing stands; only its scale number is corrected.
2. **"id map / 1 lookup per id" is the TikTok creator's gloss, NOT Anthropic's wording.** Anthropic's text says only: a quarter of the message-tree path's instructions were megamorphic dictionary lookups resolving the same message ID 3 times. Treat "build one map, look up once" as a plausible inference, not a quoted claim.

What Item 19 adds beyond Item 18: the source identification (the breakpoint TikTok is a short explainer of Anthropic's post "How we made claude.ai 3x faster in two weeks", https://claude.dev/blog/how-we-made-claude-ai-faster/, published 2026-09-23 — the TikTok itself could not be retrieved: no URL, ID, date, or transcript found); the full lessons (4 journeys = 95% of activity / 13 measurements; deterministic counts, not wall-clock, to gate code; "measuring something makes it tractable"; self-expanding loop — threads that don't close, Claude opening its own threads, ~1/3 of PRs adding telemetry/guardrails that spawn more threads; steering — ambition, taste, direction, named human owner, human approval on every PR; guardrails — ~200 short-lived flags, >half removed, employees → 1% → everyone; 120 Hz / 8.33 ms frame-budget rig; em-dash / UTF-16 20-line fix); a claim-by-claim verification table (loop, −48%/−78%, 3,000+ verified against the Anthropic post; aggregate numbers are Anthropic self-report with no independent verification; only the em-dash mechanism has a partial independent reproduction); and what is still missing (TikTok URL/transcript/narration, exact message-tree fix code, independent verification of aggregates). Full breakdown page (Muse side): artifact page slug `how-claude-stays-fast-at-scale`. This file does NOT by itself authorize repo code edits — code edits still need the loop process + Carter's go-ahead.

## Item 20 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–19)

| 20 | Note for Claude — use the chief of staff skill for this pickup | NEW | `handoff/note-2026-10-17-chief-of-staff.md` |

Carter's instruction: use the chief of staff skill when picking up this handoff. If the skill is available in Claude Code's environment, load and follow it. If it is not available, operate as chief of staff for this pickup: coordinate the work, keep the pickup order (finish → audit → fold → rebuild better), track what is done / in progress / blocked, surface disagreements instead of resolving silently, and report back in plain words. This note sits alongside Items 1–19 and does not change them.

## Item 21 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–20)

| 21 | Carter's decisions on Claude's blocked items (rename code IDs, reword Hades, conditional PR #59 merge, Claude's own standards) | NEW | `handoff/decisions-2026-10-17-claude-reply-answers.md` |

**Answers to Claude's reply (`handoff/replies/2026-10-17-pickup-and-overclaim-fix.md` + `handoff/replies/STATUS.md`, "Blocked / needs Carter"). This item is the controlling record for these four decisions:**

1. **RENAME code IDs — YES.** Rename the code IDs that still carry marks (`pacman`, `pong`, `minesweeper`) to generic names, as part of the Protection work. Carter accepts that this changes game URLs and saved best scores. The rename still goes ahead.
2. **REWORD Hades — YES.** Reword in-game: Hades is NOT one of the Twelve Olympians. Do not call him an Olympian anywhere. Name the four gods instead. Do not invent a replacement title for Hades.
3. **MERGE PR #59 to main — ONLY IF completed and to standard.** Conditional approval: merge PR #59 to main **if and only if** it is completed AND meets the standard (including Claude's own standards — item 4). If it is not completed or not to standard, do NOT merge. This is the only merge approval in Item 21. Nothing else merges on its strength.
4. **CLAUDE'S OWN STANDARDS — ALL work held to Claude's own standards as well.** Not just Carter's bar — Claude's own standards apply to everything too. If Claude's own standards say something is not good enough, it is not good enough — fix it first.

**900 Theses is still blocked on Gates A–D + the intake ruling. Item 21 does not unblock it.**

## Item 22 (ADD-ON, Carter 2026-10-17 — does NOT renumber items 1–21)

| 22 | Instruction: keep a running list of all mergeable items as they come in | NEW | `handoff/instruction-2026-10-17-mergeable-list.md` |

**Carter's instruction:** Claude must keep a **running list of all mergeable items as they
come in** — one single list, updated at every checkpoint, in
`handoff/replies/MERGEABLE.md`. Each entry states: what it is, what branch/commit it is
on, whether it is up to standard (including Claude's own standards AND Carter's bar),
and whether it is ready to merge.

**Binding rule:** an item goes on the mergeable list **ONLY when it is completed AND
up to standard.** Nothing merges unless it is on that list **AND** Carter approves that
specific merge. Merge approval is per-item, not blanket. This list is how Carter merges
items as they finish, one by one. This item does not itself approve any merge.

**900 Theses is still blocked on Gates A–D + the intake ruling. Item 22 does not unblock it.**

## Already in the repo — DO NOT re-send

Debate Hall spec + preview, Grand Directory spec + preview, Urantia room spec + research, Wave 3 games, games differentiation brief, games handoff brief, Naming & IP Policy, Content Truth Policy, blurred-symbols defect, Rotunda zodiac spec, agent-systems config, build standards, integration docs. All on PR #59.

## Muse-side only — NOT repo-bound (never sent)

Video pipeline docs (craft-notes, D9 canonical-copy rule, D12 gate), video files and demos, staging-route notes, prompt cards, Sam relay log, punch-list, build readiness checklist, goals/tracking, memory. These govern the Muse side, not the repo. Video files go to Carter for approval, then to Facebook after his click — never to the repo.

## Deduplication notes (read before building)

- **Crown of Thorns = ONE revamp job.** It appears as a decision (item 2), a build-program brief (item 14), and photo-audit evidence (item 13). One job, three references — not three jobs.
- **Treaty of Kadesh, Crown of the Kandake, Etruscan mirror = ONE build job each.** The decision approves them; the build program briefs them. Not separate jobs.
- **Audit briefs are historical records.** Where a brief's "not done" finding is fixed by a later file (e.g., the ready-line repair), the later file wins. See Corrections v2.
- **The old 11-lens council prompt pack is SUPERSEDED.** The single council system is the 27-agent model. Do not follow the old pack. Deletion of the old pack needs Carter's explicit go-ahead — v2 marks it superseded; v2 does not delete it.

## Canonical numbers (use these everywhere; do not use the old ones)

- Museum rooms: **83 existing + 900 Theses threshold room = 84.**
- Chapters: **83 in the corpus + Urantia chapter 84 approved.** 900 Theses collection intake (Vault? chapter? Pantheon? none?) is OPEN — do not assign it a number.
- Debate Hall stations: **15 question stations + 1 disputation station = 16.**
- Pantheon: **199 figures.** Vault: **88 manuscripts.** Arcade: **12 live + 25 historical = 37** (keep both, historical forms, cabinets replaced).
- Videos: final end tag on all new and re-tagged videos is **"The past is still speaking. Follow and share — The Divine Archives."** Old videos already posted keep their old sign-offs. New format is NOT live until Carter approves a demo carrying the final tag. — SUPERSEDED by Item 17: Carter approved the Mithras demo 2026-10-17; the format IS live; all 5 re-tags posted.

## Standing rules carried into v2 (unchanged, except where Addenda Items 16–17 supersede)

- Two tiers: light version for the phone, rich version for the computer (headset rides the rich tier). Rich math wins. The Archives guide the builds (research + reference photos + pixel counting + fit-loop).
- Fix over-claiming pages FIRST. Pages say only what the code does.
- Fit-loop is the build method: reference photos → count pixels → render → compare → push math until it matches.
- Engine path: direction approved, evaluation next. NO rewrite until the evaluation lands and Carter confirms.
- Endless-tree museum approved: branches, every room ends in a choice, no two visits the same.
- Creative renditions stay engaging — label departures, do not strip capabilities for pure accuracy.
- Relics: highly detailed 3D, hold-in-your-hand bar. Games: fun, engaging, plenty of detail. Board games look and play like board games.
- Naming & IP Policy + Content Truth Policy bind everything.
- Facebook Page cleanup is CANCELLED. Do not restart. Carter handles Facebook manually.
- Parked: VR museum, family-court case file, multilingual program. Do not build parked items.
- Carter is the final judge. Phone check is the verdict.
