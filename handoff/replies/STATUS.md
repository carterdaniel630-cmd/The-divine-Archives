# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-17, evening (New York). **Answers:** manifest-v2 through Item 21 (last loop run: audit + fold), plus Carter's rulings of 2026-10-17 16:30.
**Branch:** `staging/ready-line`. Nothing merged. Nothing live.
**Loop:** ON (rules in `handoff/LOOP.md`): one item per run, each run starts the next.

## Done
- Audit + fold: both audit briefs, the atlas audit, the specialist briefs and the fix package were checked against the
  repo and folded into one de-duplicated list (`handoff/audits/folded-worklist-2026-10-17.md`). Found: most findings
  are still open; D11 deploy truth is already consistent; the atlas audit's "zero external requests" claim is false.
- Ready-line §1: Protection charter DRAFTED (`handoff/protection-charter-DRAFT.md`, reply
  `2026-10-17-protection-charter-draft.md`). Found: the GitHub repo is public; no LICENSE/copyright notices; no asset
  ledger; no CSP. No secrets or source maps shipped. Awaiting Carter (D1–D4 below); its build PRs wait on approval.
- Item 21 merge check for PR #59: independent review done (`2026-10-17-item21-merge-check-pr59.md`). Everything works and
  every check ran green locally; NOT merged, because two reviewer holds need Carter (below).
- Ready-line §2, over-claiming pages: fixed and verified (`2026-10-17-pickup-and-overclaim-fix.md`).
- Trademark game ids removed (pacman, pong, minesweeper, risk → labyrinth, antithesis, excavation, dominion). Old links and
  scores carry over (`2026-10-17-trademark-ids-and-hades.md`).
- Hades no longer called an Olympian in the fighter.
- Channel: `PROTOCOL-two-way-channel.md`, `handoff/replies/`, `handoff/LOOP.md`.

## In progress
- (none: the next loop run picks up the first item below)

## Next (the loop works these in order; the full folded list is `handoff/audits/folded-worklist-2026-10-17.md` §B)
1. Small defects that need no ruling: remove the hallway hiss (`brook()` in the corridors and fountain); change
   "199 gods" to "199 figures" in the Pantheon meta/OG and founder-guide; replace V72's 4 Wikipedia citations with real ones.
2. Debate Hall preview safety: the bookmark raw-HTML round-trip and the compare-well quotation marks.
3. Small fixes: zodiac `dispose()` should clear only its own host; Bagh-chal diagonals and the "standard board" claim;
   Oracle Bones wording and Google Fonts removed from 2 exhibits; amendment line in the Debate Hall spec ("fifteen" → 16);
   Grimoire disclaimers and lore flags.
4. Museum phone pixel-ratio cap (1.5 → 1.0), with a performance before/after.
5. `relics.js` GPU-memory trace; blurred symbol sprites and the missing symbol walls.
6. Fix package (§7), relic by relic in the package's order (folded list §B row 13).
7. Larger items (folded list §B rows 14–24): teardowns and math reviews, glyph audit, symbols registry, room registry
   and Directory 83/84, Arcade D2, playability floor, audio standard, debate engine, all-games audit.
- Waiting on Carter (not worked by the loop): PR #59 merge. When Carter answers, the next run re-checks GitHub checks
  and merges only if all are green and no site file changed since 2ab371d.
- Small, not blocking: PR #59's description still says "all files under handoff/, no deploy impact". Correct it before any merge.

## Needs Carter
- **Protection charter** (`handoff/protection-charter-DRAFT.md` §5):
  D1 Make the GitHub repo private? A) Yes (recommended) B) Keep public.
  D2 Copyright line name? A) Carter Daniel B) A business name C) The Divine Archives.
  D3 Register copyright? A) Ask a lawyer B) Not now.
  D4 Approve the charter? A) Yes B) With changes C) Not yet.
- **Merge PR #59?** Reviewed: nothing broken, all local checks green. Held because the reviewer's auto-pass is off
  (`reviews/status.json`), which makes every item need you, and because of the Tomb Robber question below.
  Options: A) Yes, merge as reviewed. B) Wait.
- **"The Tomb Robber"** card (boulder, tiger, whip): rename as a possible film-franchise lookalike?
  Options: A) Keep. B) Reword the blurb only. C) Rename and reword.
- **New rulings surfaced by the audit fold** (folded list §C): Pythia Pantheon entry? Errata page location? Ouija title?
  Scope of hit-feel sets while the fighter is parked? Override the phone's reduced-motion setting (recommend no)?
  The Ra-Horakhty correction text is missing from the repo: please have Muse send it.
- Remove the old-id compatibility table 90 days after this goes live? (Removing it breaks old links.)
- 900 Theses intake ruling (Vault? chapter? Pantheon? none?), plus Gates A–D.
