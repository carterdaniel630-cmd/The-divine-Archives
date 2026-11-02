# Loop run 2026-11-02 03:42 UTC — (i2) Ark pump source follow-up built as PR #113

Session: ..WzTn28Jqa5P9EFrsbzzU. Lock taken 03:42 UTC, released at the end of this run.

## Picked
Highest value without Carter: (i2), live-text honesty on ch01 (value 1), small and sure. The new Carter order
(Vault hero objects, committed 03:23 UTC) was folded into Next; it is a larger new build and its Ark draft
depends on this same fact, so settling the fact first was the right order.

## What the sources say
- **PBS NOVA, *Secrets of Noah's Ark*** (programme text, https://dipsy.pbs.org/wgbh/nova/ancient/secrets-noahs-ark.html,
  aired 7 Oct 2015): "about 40 feet in diameter, just a fifth the size of the ark described in the tablet";
  Eric Staples at launch: "we have a heck of a lot of water coming in"; narrator: "They plug the gaps and put a
  collection of pumps to work"; closing: "never managed to duplicate Babylonian bitumen, but the structure of the
  ark is sound".
- **The Telegraph (India)**, Shrabani Basu, 13 Sep 2014 (copy at obeta.ttef.in): "bigger than one-fifth of the original";
  no leaks or pumps mentioned.
- **Wikipedia** (Finkel's replica): "one-third scale", one petrol pump run continuously. Only source for both.
- Historia (Finkel interview): permission timed out this run; not re-read. Logged as such.

## Change (PR #113, `loop/ark-pump-source` `b97a868`)
ch01 live text and `themes/ch01-the-flood.md`: "...about 40 feet across: a fifth of the tablet's size by the
documentary's own count, though some accounts say a third. It floated, but water came in through its seams from the
moment it was launched, and the crew had to plug the gaps and set pumps working: a test of the boat type, not proof
that the full-size design would have worked." Source list in themes and the correction log in
`sources/ch01-the-flood.md` updated. Build outputs: ch01 page, dates, entity registry.

## Checks (on `b97a868`)
- Full build order; output matches committed.
- `review-checks --base origin/main --build`: 9 PASS, 1 WARN (ch01 Wikipedia share 22%, was 24%).
- verify 18/18; `node --test framework/test/*.test.js` 42/42.
- Headless 360x740 and 390x844, ch01 + themes: no sideways scroll, no script errors (only blocked external fonts in
  the sandbox), new sentence present, old gone, pending banner present. Screenshot `2026-11-02-run-0342-ch01-ark-pump-360.png`.
- Twins: `git grep` for "roughly a third" / "pump running": only ch01, its themes copy and the source log (all updated).
- graphify CLI missing in this session; not used (wording-only change).

## Merge
Not merged. Needs a non-builder independent review and GitHub green incl. Lighthouse. Builder's view: class (c)
honesty wording (softens, adds no claim, clears no tag). It does move the scale off the "one-third" in Carter's note,
so if the reviewer is in doubt: per item.

## For the Vault hero build (i5)
`handoff/vault-hero-ark-tablet-entry.md` repeats "one-third scale" and "a petrol pump had to run continuously", and
says the Flood chapter tells it "more generously". After #113 both are off: build the entry to the source log.
