# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-17, evening (New York). **Answers:** manifest-v2 through Item 22, Carter's rulings of 2026-10-17 16:30,
`decisions-2026-10-17-carter-answers-2.md` (16:53), `decisions-2026-10-17-priority-by-value.md` (17:06) and
`decisions-2026-10-17-charter-and-pr59.md` (Item 23).
**Branches:** `staging/ready-line` = site batch A (site changes up to `6b419fd`, Lighthouse fix `ac6d5fa`; later commits
touch `handoff/` only). `loop/small-defects-2026-10-17` = batch B in progress (built on batch A). **Batch A MERGED and live** (`main` = `218c51b`, 2026-10-17 21:08 EDT, deploy green).
**Loop:** ON (rules in `handoff/LOOP.md`): one item per run, highest value first, each run starts the next.
**Rule while batch A waits:** new site work goes on `loop/*` side branches built from the batch A head, never on
`staging/ready-line`, so batch A stays a clean merge candidate (LOOP.md Item 21 condition 5). Only `handoff/` lands on staging.

## Done
- Small defects, part 1 (reply `2026-10-17-small-defects-hiss-199-v72.md`, branch `loop/small-defects-2026-10-17`
  `ce31f9f`): hallway hiss removed (corridors now faint wind only); "199 gods" → "199 figures" (Pantheon meta/OG,
  founder guide); V72's 4 Wikipedia citations replaced with checked sources. V72 carries the pending-review tag again
  because its text changed. All checks green.
- Carter batch 2: Tomb Robber renamed **The Unfinished Journal**; old commit note left; old-id table removed 90 days after go-live.
- Mergeable list started (`replies/MERGEABLE.md`, Item 22).
- Audit + fold (`handoff/audits/folded-worklist-2026-10-17.md`); Protection charter DRAFTED; Item 21 merge check of
  `2ab371d`; over-claiming pages fixed; trademark game ids removed; Hades reworded.

## In progress
- (none: the next loop run picks up item 1 below)

## Next (ranked by value per `decisions-2026-10-17-priority-by-value.md`; full list in the folded worklist §B)
1. ~~Batch A review + merge~~ DONE: merged `218c51b`, deploy green. Next run: rebase `loop/*` branches (batch B, PR #60) onto `main`.
   PR #60 must start from Carter's selfie (Item 27): if the selfie image is not in the repo, stop and ask Carter.
   Items 26 (charter D1–D3 parked), 28 (restart) and 29 (Graphify tie-in + standards dashboard) to be folded into Next.
2. Museum phone performance: pixel-ratio cap 1.5 → 1.0, measured before and after on the phone budget.
3. Arcade playability floor: difficulty selector, undo where it fits, short tutorial, readable tap targets; most-played first.
4. Fix package (§7), relic by relic, most visible rooms first.
5. Small defects, part 2 (add to `loop/small-defects-2026-10-17`): Bagh-chal diagonals and the "standard board" claim
   (live-text accuracy, first); zodiac `dispose()` clears only its own host; Oracle Bones wording; Google Fonts out of 2
   exhibits; Grimoire disclaimers and lore flags.
6. Debate Hall preview safety: bookmark raw-HTML round-trip; compare-well quotation marks. Spec amendment "fifteen" → 16.
7. Larger items (folded list §B rows 14–24), each ranked by the same rule when reached.
- Scheduled (Carter batch 2 §3): 90 days after the merge carrying `2ab371d` lands on `main`, remove the old-id table
  (`archive-games.js`, `framework/adapters/track.js`, arcade `site.js`, `framework/test/renamed.test.js`) on staging.
  The merging run records the go-live and due dates in `handoff/CURRENT.md`.

## Needs Carter
- **Unfinished Journal hero** (still reads as the famous film explorer: fedora, leather jacket, whip swing, boulder):
  A) Redesign hero + rework those two set pieces (recommended). B) Hero only. C) Keep.
- **Re-clear V72 (Book of Shadows)** in your next batch review: only its sources list changed (Wikipedia out).
- **Protection charter** (Item 23 answers): D1 private = YES, but changing repo settings is an account action the loop
  may not do: **you flip it** (GitHub app → repo → Settings → Change visibility → Private), or tell a session to.
  D2 copyright name: still yours to pick. D3 register only if free: US registration has a filing fee, so the loop will
  not register (to be confirmed in the charter pass). D4 approve if up to standard: a later loop run checks the draft
  against the standard and fixes it first.
- **Note:** Item 23 lists Tomb Robber, old commit note and the old-id table as still open, but you answered them at 16:53
  (`decisions-2026-10-17-carter-answers-2.md`). The loop follows the 16:53 answers unless you say otherwise.
- **Email-list account** so the home-page sign-up can be switched on (founder lane, value 4).
- **Rulings from the audit fold** (folded list §C): Pythia Pantheon entry? Errata page location? Ouija title? Hit-feel
  scope while the fighter is parked? Override reduced-motion (recommend no)? Ra-Horakhty correction text: please have Muse send it.
- 900 Theses intake ruling (Vault? chapter? Pantheon? none?), plus Gates A–D.
