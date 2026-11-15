# Delta review — sources-wrap-fix F1/F2 (`loop/sources-wrap-fix` `b0c08fe5..02a870b8`)

**Reviewer session:** ..01HFWzTjxzUzQunojBVCNx8U (scheduled build loop, 2026-11-15 ~10:03 UTC). Wrote none of the
branch (builder ..01HFWzTp48AUQGechKB5XUmZ; fixer ..01HFWzTmcBeAjQtBQVQXVKVR; first reviewer ..01HFWzTmtMV8g9JUhd7ANvey).
**Scope:** the fix commit `02a870b8` against `b0c08fe5`, plus the whole candidate `origin/main` (`f92ab8d7`) `...02a870b8`
for the checks, against `reviews/REVIEWER.md` §3–§4.
**Verdict: PASS — 0 open findings.** F1 and F2 are closed.

## In plain words
The Flood's 16 sources are now all whole, word for word and link for link as in the chapter file, and ch08's stray
"&amp;amp;" is gone. Nothing else on either page moved. Across all 84 chapters, every source in the chapter files now
appears on its page except the one known ch61 gap (note N1, a separate item).

## Checks (on `02a870b8`, worktree, own scripts — not the fixer's)
- **Diff shape:** `content/chapters.js` 13 `-` / 13 `+` lines, all `<li>`; `docs/chapters/ch01.html` (12) and `ch08.html` (1)
  change only `<li>` lines. No `<h4>`, body, tag or status line touched.
- **Accuracy (§4.1):** each of the 13 new entries, tags stripped and entities decoded, equals its markdown bullet
  (continuation lines joined) in `themes/ch01-the-flood.md` / `eras/03-early-iron-age/ch08-early-greece-early-iron-age.md`
  **as on the branch**, hrefs equal in order, and every old cut-short line is the start of its new entry (no text lost).
  13/13. Two first-pass mismatches were my script's (a URL containing parentheses, `Babyloniaca_(Berossus)`; and the ch08
  markdown itself writes `&amp;`, which correctly renders "&"); both checked by hand: correct.
  Note: `staging/ready-line`'s copy of `themes/ch01-the-flood.md` is older than `main`'s (no Ark-correction sources);
  the branch matches `main`, which is right. Compare against the branch, not staging.
- **All-chapter comparison** (converter Sources `<li>` vs the page's last Sources block, all 84 pages):
  **835 bullets, 1 mismatch — ch61 only** (Manne/Attwood, N1, expected). Same count as the fixer's, independently.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (sources-only change ×15). Tree clean after build.
- `tools/verify-*.js` **18/18**; `node --test framework/test/*.test.js` **51/51**.
- Headless Chromium, ch01 and ch08 at 360 and 390: standards mode, 0 page script errors, no sideways overflow,
  16 / 10 source entries, 0 ending on a dangling "—", ";", ",", ":", "See" or raw `*`, 0 raw entities, pending banner present.
- GitHub push checks on `02a870b8`: Verify game sourcing, Link guard, Game runtime checks — all **success**.
  No PR yet, so no Lighthouse / PR checks.
- Links not opened (no web fetch in this unattended run). They are the cleared markdown's own citations, restored verbatim; Link guard green.
- Lenses/tiers/contested (§4.2–4), tone (§4.5): no prose changed. Religious sensitivity (§4.6): Qur'an and Genesis
  entries regain only their citation links; no images, sacred-object or status change. ch01 stays pending.

## Findings
None open. F1 closed, F2 closed.

## Merge
Not merged. Candidate `02a870b8` now has its independent review with zero open findings. Still missing:
1. A **PR** so GitHub's PR checks incl. Lighthouse run (Carter's PRs question (a)/(b) still open; this run opens none).
2. **Carter's yes:** per item, or class (c) honesty fix if he answers (a) to the Needs Carter question.
