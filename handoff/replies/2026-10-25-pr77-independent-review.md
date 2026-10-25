# PR #77 independent review — The Unfinished Journal hero, part 1: The Archivist (2026-10-25, build loop)

**Reviewed:** `origin/main` `efba79c` ... `loop/journal-hero-archivist` @ `dbf5d16`, against `reviews/REVIEWER.md` §3–§4.
**Reviewer:** a scheduled build-loop run that wrote none of #77 (no commit on that branch). **Result: 0 findings.**
Nothing merged, nothing pushed to the PR branch.

## Why this item this run
#67 (`c957af5`) still had Lighthouse running (started 01:50). A chat session holds `handoff/loop/CLAIM-stack-67-75-76.md`
and has stacked #75 (`053fc97`) on #67 and #76 (`a2b0952`) on #75, so their checks restart. Not waited on with the lock.
The next item by value was the review #77 needs before it can go to Carter.

## What was checked
- **The face is Carter's approved sheet, not a new drawing.** The committed `art-source/archivist/character-sheet-archivist-hooded.webp`
  is byte-identical to the approved sheet Carter's account committed in `handoff/journal-hero-b64/` (sha256 `9aebd3f5…5544`).
  `cut.py` crops, masks and mirrors only; it draws no face. Re-ran it: all five images and the manifest come out
  byte-identical to the committed ones. Carter's selfie is not committed anywhere new.
- **No invented smile:** `portrait.png` and `portrait-smile.png` are the same file (checked byte for byte).
- **Trademark look:** no fedora, no leather jacket in the painted parts, the arm sleeve or the pre-load fallback (now a hood).
- **Code** (`treasure.js`, 31 lines): arm sizes now come from the manifest, with the old values kept as a fallback if the
  manifest has no `arm`; offsets scale with the figure height, so the hand and the line stay joined. Cache version `v=1` → `v=2`
  on every art request, so phones do not mix old and new parts.
- **Full build order** on a clean copy: nothing changed (committed build is current). `review-checks.js --base origin/main --build`:
  9/9 passed, 0 warnings. 17/17 `verify-*.js`. 42/42 framework tests.
- **Headless phone** (390×844 at 3×), normal and reduced motion, own script: story card, stand, run, jump, cast. All art
  loads (manifest, body, thigh, shin, portrait: 200). Hooded figure runs, jumps and casts the line with the hand joined to it.
  0 script errors (only the blocked outside font request). Page 390 px wide, nothing sideways.
- **GitHub on `dbf5d16`:** 5/6 completed green (guard, checks, test, runtime ×2); Lighthouse running (started 02:02).

## Notes (not findings)
- The charcoal coat reads dark against the dusk Egypt sky; visible, but small on a phone. Worth Carter's own look.
- The game still says "crack the whip" and keeps the boulder; that is part 2 by design (Option A set pieces), not this PR.
- §4 item 6: no sacred object, holy site or revered person is touched. The likeness is Carter's own, from the sheet he approved.

## What #77 still needs to go live
1. Lighthouse green on `dbf5d16`.
2. **Carter's yes for #77** (his 2026-10-21 approval named PR #60; #77 replaces #60's hero). STATUS → Needs Carter A.

Items per run: 1.
