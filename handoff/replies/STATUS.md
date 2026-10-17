# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-17, evening (New York). **Answers:** manifest-v2 through Item 21, plus Carter's rulings of 2026-10-17 16:30.
**Branch:** `staging/ready-line`. Nothing merged. Nothing live.
**Loop:** ON (rules in `handoff/LOOP.md`): one item per run, each run starts the next.

## Done
- Item 21 merge check for PR #59: independent review done (`2026-10-17-item21-merge-check-pr59.md`). Everything works and
  every check ran green locally; NOT merged, because two reviewer holds need Carter (below).
- Ready-line §2, over-claiming pages: fixed and verified (`2026-10-17-pickup-and-overclaim-fix.md`).
- Trademark game ids removed (pacman, pong, minesweeper, risk → labyrinth, antithesis, excavation, dominion). Old links and
  scores carry over (`2026-10-17-trademark-ids-and-hades.md`).
- Hades no longer called an Olympian in the fighter.
- Channel: `PROTOCOL-two-way-channel.md`, `handoff/replies/`, `handoff/LOOP.md`.

## In progress
- (none: the next loop run picks up the first item below)

## Next (the loop works these in order)
1. Ready-line §1: draft the Protection charter, binding on every build. Covers naming/IP sweep rules, code-theft
   measures, no public source maps, no client-side secrets, copyright headers. Draft only: Carter approves.
2. Audit + fold: verify both audit briefs (2026-10-15, 2026-10-16) and the fix package against the repo; write one
   folded, de-duplicated work list into this file.
3. §16 small defects that need no ruling: hallway hiss removal (`brook()`), stale "199 deities" strings, V72's 4 Wikipedia citations.
4. §12 Debate Hall safety fixes: the bookmark raw-HTML round-trip and the compare-well quotation marks.
5. §7 fix package, relic by relic, in the fix-package order.
- Waiting on Carter (not worked by the loop): PR #59 merge. When Carter answers, the next run re-checks GitHub checks
  (Lighthouse was still running at review time) and merges only if all are green and no site file changed since 2ab371d.
- Small, not blocking: PR #59's description still says "all files under handoff/, no deploy impact"; it now changes the
  live site. Correct it before any merge.

## Needs Carter
- **Merge PR #59?** Reviewed: nothing broken, all local checks green. Held because the reviewer's auto-pass is off
  (`reviews/status.json`), which makes every item need you, and because of the Tomb Robber question below.
  Options: A) Yes, merge as reviewed. B) Wait.
- **"The Tomb Robber"** card (boulder, tiger, whip): rename as a possible film-franchise lookalike?
  Options: A) Keep. B) Reword the blurb only. C) Rename and reword.
- Remove the old-id compatibility table 90 days after this goes live? (Removing it breaks old links.)
- 900 Theses intake ruling (Vault? chapter? Pantheon? none?), plus Gates A–D.
