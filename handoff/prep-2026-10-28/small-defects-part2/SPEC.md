# Handoff prep — Small defects, part 2 (the sweep-up list)

Status: PREPPED in chat, Carter approved the prep 2026-10-28. NOT staged to GitHub yet; ships only on Carter's go.
Compiled 2026-10-28 from the loop's own records: `handoff/replies/STATUS.md` (as of 2026-10-26 ~03:15 UTC), the hit-feel review replies it cites, `handoff/audit-fixes-2026-10-25.md`, and the 2026-10-27 fix sweep. Every candidate was checked against what already shipped or is already staged — see "Checked and cleared" below for what did NOT make the list and why.

## Where this item comes from
STATUS Next item 10 names "small defects part 2" and most of its original contents have already peeled off into their own work: Journal Sound/✕ (PR #78), Journal 320 clipping (PR #79), Journal tap sizes + touch tip (PR #83), ch02 "second death" (PR #82) — all live. The Spirit Board rename and the Errata page are prepped as their own items. What remains is below.

## The list — recorded, unfixed, not staged anywhere else

1. **PR #53 follow-up: ch08 omphalos maxims.** Left over from the Pilgrimage batch 1 reviews (STATUS 1e: "Follow-ups (separate items, own pass)"). A wording/source point on the Delphi chapter's omphalos maxims. Sources first, then the smallest wording change that makes it true.
2. **PR #53 follow-up: ch29 line 47, equinox intent.** Same origin. A claim about the equinox effect's *intent* at Chichén Itzá that the review record left open. Settle it the way the batch's other contested points were settled: give both views or soften to what the sources support — never resolve a debate by fiat.
3. **PR #53 follow-up: ch42 backfill, now contested.** Content that was going to be backfilled into ch42 is now contested. Sources-first pass; if the sources genuinely disagree, the page says so (the archive's contested-point pattern), it does not pick a winner.
4. **Debate Hall preview safety.** Named in STATUS item 10 with no detail given there. First step is identification, not building: read `handoff/debate-hall-spec.md` and the preview (`handoff/previews/debate-table-3d.html`), state plainly what the safety concern is, and only then fix that. Do not guess at the concern and do not widen the item beyond it.
5. **Review debt: PR #43 has never had a review of its own.** Flagged by the weekly loop audit (2026-10-25) as a coverage gap. Give it the standard independent review (a run that wrote none of it), 0 findings or a fix list — nothing about it merges or changes on this item alone.
6. **Review debt: independent review of PR #66.** STATUS item 8a: #66 is new content waiting on an independent review so it can reach MERGEABLE; it will still need Carter's own yes as new content. This item is the review only.

## Fold-in check (one item, verify before building)
- **Chapter banners vs. the verdict desk.** Carter's 2026-10-27 verdict-desk rulings changed several chapters' review states (incl. ch42 ruled REVIEWED), and the 2026-10-27 fix sweep found all 18 chapter banners on the live site still reading "pending review". The correction was recorded as a loop item in Muse-side notes (`buildout/loop-notes/site-stale-after-verdicts-2026-10-27.md`) but never reached staging. Verify whether the loop's queue already carries it; if it does not, this item is its home: banners brought in line with the verdict-desk record, chapter by chapter, nothing else touched. (The same note's other two findings are already covered — the ch19 typo rides audit Fix 3, and the Egypt game-slot Senet wording is in the staged audit-fixes package.)

## Checked and cleared — do NOT re-file these
- **iPhone game sound (the hit-feel part 1 review note: sound stays off after re-enabling mid-visit).** Already FIXED: hit-feel part 2 (PR #71, live 2026-10-24) — "audio resumes on every tap", reproduced broken 0 → fixed 1, and independently re-verified in #71's review. The fix is visible in live `feel.js` today. This was the first candidate checked for this list and it is the model for how every candidate above was treated.
- **The 8 site-audit fixes** (`audit-fixes-2026-10-25.md`: README counts/lists, ch19 honesty + typo, era-page label, games sourcing note, Graphify data refresh, default-branch note) — already staged with Carter's go (`decisions-2026-10-25-audit-fixes-go.md`), queued as STATUS 1g. Not this item. Fix 8 (default-branch note) stays FLAGGED/UNVERIFIED inside that package: confirm before acting on it there.
- **The absence page's share image filename (v68.jpg)** — content verified neutral; keep-or-rename is on Carter's own open list. Not a defect; do not touch it under this item.
- **Lighthouse occasionally failing on pages a change never touched** — a known quirk noted by the weekly audit, not a site defect. No action; don't chase it as one.

## Acceptance
- Items 1–3: wording changes carry their sources; contested points presented as contested. Independent review 0 findings.
- Item 4: the concern stated in plain words in the run's reply before any fix; fix verified against that statement.
- Items 5–6: reviews filed the standard way; findings, if any, become their own fix items — not silent riders on this one.
- Carter's yes before any merge, per item, as always.
