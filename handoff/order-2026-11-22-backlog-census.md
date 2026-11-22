# ORDER — the full backlog census and priority ledger (Carter, 2026-11-22 00:08 ET)

From atlas, for the build loop. Carter's question tonight, verbatim in substance: is there a way to look at everything in the repo, determine priority, untangle the mess, and make sure nothing important is left behind? This order is that instrument. It rides alongside the full-backlog order of the same night (handoff/note-2026-11-22-full-backlog.md) — the census comes first, then the march follows the ledger it produces.

## The sweep — read all of it

- Every file under `handoff/` — each note is either discharged (its work merged/done, say by which commit or PR) or still open. No note is skipped.
- `handoff/replies/STATUS.md`, `MERGEABLE.md`, and `CURRENT` — the loop's own standing records.
- Every open PR, and every recently merged PR whose follow-ups may still be owed.
- The source-flag lists (the 2026-11-18 sweep counted 151 of 167 still open — re-derive the true current list, do not copy the old count).
- The commissioned-but-unbuilt pieces (18 at the last sweep), the pushed-off items with no owner (13 at the last sweep), and the VR fix list from Carter's headset walks.
- Anything else in the repo that records owed work — TODO files, queue files, audit outputs.

## The ledger — one file, every item

Write the result to `handoff/replies/BACKLOG.md`. One row per item:

- **What** it is, in plain words.
- **Source** — the note, PR, list, or walk it came from, with its date.
- **State** — done / built-awaiting-gates / in progress / held-by-gate / needs-Carter's-verdict / orphaned (no owner).
- **Gate or owner** — what exactly it waits on.
- **Priority band** (below).

## Priority bands (Carter's standing rules, in this order)

1. **P0 — the save fix.** Sessions that cannot save cannot work a backlog; it lands and is proven first.
2. **P1 — Carter's yes already given** (#184, #185 as of this writing).
3. **P2 — honesty and source fixes.** The truth standard outranks new building.
4. **P3 — site and museum build-out**, in queue order (the well before distribution, per the well-sequencing rule).
5. **P4 — commissioned builds** in the order they were commissioned.
6. **P5 — everything else**, oldest first.
7. **Last, by Carter's ruling: the Flood.** Museum multiplayer enters its band when its design is staged (atlas-side; not yet).

## The guarantees Carter asked for

- **The count reconciles**: the ledger's total equals done + open + held, and every item from every source list appears exactly once — duplicates across lists are merged into one row naming all its sources.
- **Disagreements are flagged, not smoothed**: where two records say different things about one item, the row says so.
- **Nothing ownerless stays ownerless**: every orphaned item gets a named owner (the loop, atlas, or Carter) in its row.
- **Carter's verdicts are gathered, not dripped**: every needs-Carter's-verdict item is collected into one section at the ledger's foot — the single desk list he will be shown.
- After the census, the backlog march follows the ledger's bands; STATUS reports the ledger count going down only by work done or Carter's ruling.

The census is a read-and-write-one-file job: it does not pause the march beyond the session that builds it, and it changes no site code.

— atlas
