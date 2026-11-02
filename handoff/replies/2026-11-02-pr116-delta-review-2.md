# Delta review 2 — PR #116 (ch01 Ark Tablet 1985/2009 note), fix for F2

**Id:** site:pr116 · **Candidate:** `loop/ch01-ark-dates` @ `75176f5` (delta `5f41173..75176f5`, parent `main` `cb8c52f`, fast-forward)
**Reviewer:** session ..01HFWzTnKKR13Ef57fkEkaGt, 2026-11-02 ~08:43–09:00 UTC. Wrote none of #116
(builder ..01HFWzTnn5yoLm3RF8BKRxrL; F1 reviewer/fixer ..01HFWzTk9uK91ZXBirrhE5wt; F2 reviewer/fixer ..01HFWzTjwXBago34nDXqR2sv).
**Verdict: PASS — F2 closed, 0 open findings. Mergeable by class (c).**

## §3 automatic checks (clean worktree at `75176f5`)
- `review-checks.js --base origin/main --build`: 9/9 PASS, 0 warnings; tree clean after the build.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 42/42.
- Headless ch01 at 360×640 and 390×844 (touch): 200, 0 page errors, no sideways scroll, new wording present, old wording gone, pending tag present.
- GitHub on `75176f5`: 10/10 completed green, Lighthouse included (08:00–08:19 UTC).

## Scope
Delta touches only the one ch01 paragraph (theme md, `content/chapters.js`, `docs/chapters/ch01.html`), the ch01 Sources
bullet, one dated source-log entry, and regenerated registry/dates (4 new source nodes). Whole PR vs `main`: same 7 files.

## F2 — closed
New wording matches the suggested wording in `2026-11-02-pr116-delta-review.md` exactly. Sources re-opened this run:
- historyofinformation.com (id=4060): "In 2009 British Museum curator Irving Finkel … received"; no 1985. Supports "one later summary gives 2009 alone". ✔
- Christian Science Monitor 25 Jan 2014: byline Jill Lawless, Associated Press; "Finkel got hold of it a few years ago". ✔
- Deseret News 24 Jan 2014: "By Associated Press"; same sentence. ✔ (so CSM/ToI/Deseret are one AP story, as the page now says)
- PBS NewsHour 24 Jan 2014 (Sam Lane): no year, no "a few years ago" (only "recently deciphered"). ✔
- Archaeology magazine 27 Jan 2014: no year, no "a few years ago". ✔
- Christian Post: not re-opened this run (fetch not permitted); the page relies on it for nothing beyond the source log.
"the 2014 news reports checked give no year" is accurate for every report opened.

## §4 checklist (delta)
1. Accuracy: pass. 2. Lens balance: n/a. 3. Evidence tiers: unchanged, no proof language. 4. Contested flagged, not
resolved: yes ("this chapter does not resolve them"). 5. Tone: descriptive. 6. Sensitivity: none; no tag cleared; ch01
stays pending. 7. Games/3D: none.

## Class
(c) honesty wording on live text. The F1/F2 findings were fixable wording findings, not sent to Carter.
