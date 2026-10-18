# Build-side STATUS — running (overwritten at every checkpoint)

**As of:** 2026-10-18 (build loop). **Answers:** manifest-v2 through Item 29 and every `decisions-*.md` to date.
**Deployed (`main`):** `218c51b` (site batch A, PR #59, merged 2026-10-17 21:08 EDT, deploy green) at
the-divine-archives.pages.dev. getconexto.com is not pointed yet (`decisions-2026-10-17-domain-not-pointed.md`).
**Branches:** `loop/small-defects-2026-10-17` = batch B (`3e7129a`, current with `main`). `loop/journal-hero-redesign`
= PR #60 (`6862dee`, on hold for Carter's selfie). `staging/ready-line` carries `handoff/` only.
**Loop (Item 28 answer):** RUNNING. One item per run, highest value first, each run starts the next. Nothing is
blocking it except the items listed under Needs Carter.

## Done
- 2026-10-18: batch B brought up to `main` (merge, no force-push); Items 26–29 folded here
  (reply `2026-10-18-branches-current-and-fold-26-29.md`). All local checks green.
- 2026-10-17: PR #59 (batch A) merged and deployed; small defects part 1 on batch B; Tomb Robber → The Unfinished
  Journal; mergeable list started; audit + fold; Protection charter drafted; over-claims fixed; trademark ids removed.

## In progress
- (none: the next loop run picks up item 1 below)

## Next (ranked by value per `decisions-2026-10-17-priority-by-value.md`; full list in the folded worklist §B)
1. **Museum phone performance:** pixel-ratio cap 1.5 → 1.0, measured before and after on the phone budget (value 3).
   Build on a new `loop/*` branch from `main`.
2. **Small defects, part 2** on batch B, live-text accuracy first (value 1 for the Bagh-chal "standard board" claim):
   Bagh-chal diagonals and the claim; zodiac `dispose()` clears only its own host; Oracle Bones wording; Google Fonts
   out of 2 exhibits; Grimoire disclaimers and lore flags. Then an independent review of batch B by a run that wrote
   none of it, then list it in MERGEABLE for Carter's per-item yes.
3. **Item 29, Graphify tie-in:** (a) check Graphify against the standard (workflow green, map current, CLAUDE.md
   steps work) and fix what falls short; (b) wire it into the loop (each run queries the map before touching code);
   (c) the one-view standards dashboard (UP TO STANDARD / NEEDS WORK / BLOCKED / PARKED / NOT YET BUILT) from the map,
   STATUS and MERGEABLE. Carter ordered it, so it needs no new approval to build; its merge still needs his yes.
4. **Arcade playability floor:** difficulty selector, undo where it fits, short tutorial, readable tap targets;
   most-played first.
5. **Fix package (§7)**, relic by relic, most visible rooms first.
6. **Protection charter D4:** check the draft against the standard and fix it (D1–D3 parked, Item 26).
7. **Debate Hall preview safety:** bookmark raw-HTML round-trip; compare-well quotation marks; spec "fifteen" → 16.
8. Larger items (folded list §B rows 14–24), each ranked by the same rule when reached.
- Scheduled: on or after **2027-01-15**, remove the old-id table (`archive-games.js`, `framework/adapters/track.js`,
  arcade `site.js`, `framework/test/renamed.test.js`) on a side branch.

## Parked (do not build)
- Protection charter D1 (repo private), D2 (copyright line: site says "The Divine Archives"; legal name Daniel
  Carter), D3 (no registration). Item 26. Revisit only when Carter says so.
- 900 Theses: blocked on Gates A–D and the intake ruling.

## Needs Carter
- **Your selfie for the Journal hero (Item 27).** It is not in the repo. Send it in a chat with Claude and say
  "add it to the repo for the Journal hero"; PR #60 waits until then.
- **Re-clear V72 (Book of Shadows)** in your next batch review: only its sources list changed (Wikipedia out).
- **Email-list account** so the home-page sign-up can be switched on (founder lane, value 4).
- **Rulings from the audit fold** (folded list §C): Pythia Pantheon entry? Errata page location? Ouija title? Hit-feel
  scope while the fighter is parked? Override reduced-motion (recommend no)? Ra-Horakhty correction text: please have
  Muse send it.
- 900 Theses intake ruling (Vault? chapter? Pantheon? none?), plus Gates A–D.
