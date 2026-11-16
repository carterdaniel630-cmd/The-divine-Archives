# Delta review — PR #168, ch40 re-sourcing (F1–F4 fixes)

**Reviewer:** build loop run ..01HFWzTjutTUt38SbhFeQaPr (scheduled), 2026-11-16 ~11:00 UTC. Wrote none of the candidate (not the builder, not the fixer ..01HFWzTm8prJe778rk7ohuDo).
**Candidate:** `loop/resourcing-ch40` `54bdcf70`, delta `7396a6db..54bdcf70` (ch40 markdown Sources, `content/chapters.js`, `docs/chapters/ch40.html`, `content/dates.json`, `sources/ch40-diaspora-religions.md`). Base `main` `56d7c9d6`.
**Verdict: FIXABLE — F1–F4 confirmed fixed against the sources; 1 new finding (F5), one word.**

## Sources re-opened this run
| Fix | Source | What it says | Result |
|---|---|---|---|
| F1 Duffy | sites.miamioh.edu PDF | Editor: Ardouin's account "may be based on information told to him fifty years after the event by Paul Ali"; the mambo "since the late 20th century, has been identified by the name Cécile Fatiman". No editor remark on the estates; Dalmas "Choiseul estate, called Caïman", Ardouin "Lenormand estate". | ✔ new wording states the estate difference as ours and credits the editor only with what he says |
| F2 Shilliam | core.ac.uk PDF | First page: "Forthcoming in Millennium (2017)"; "accepted" nowhere | ✔ |
| F3 Hahn | biologyonline.com | "found only insignificant traces of tetrodotoxin – 64 ng/g or less" (the quote was verbatim after all) | ✔ unquoted "only trace amounts" is a faithful paraphrase; no change needed |
| F3 Littlewood | THE canonical URL | "DNA fingerprinting **suggested** Wilfred was not the son of his putative parents"; "Marie was related neither to Michel, nor to her brother in Cabaret" | ✔ scope narrowed correctly — but see F5 |
| F4 Littlewood URL | `https://www.timeshighereducation.com/features/the-plight-of-the-living-dead/104813.article` | Resolves: "The plight of the living dead", Roland Littlewood, 28 November 1997 | ✔ |

## Finding
- **F5 (fixable, honesty wording, class (c)) — Littlewood "DNA tests showing".** The article says DNA fingerprinting *suggested* the man was not his putative parents' son; "showing" is stronger. Change, in the ch40 markdown Sources entry (and so the regenerated `chapters.js` / page), "DNA tests showing the man was not the son" → "DNA tests suggesting the man was not the son". The source log line ("DNA tests: the man not the son of his putative parents") is fine as is; add the dated correction line.

## Local checks (own worktree, `54bdcf70`)
- `review-checks.js --base origin/main --build`: 9 pass / 0 fail / 2 warn (same two as before: sources-only change, source-log history Wikipedia share). Tree clean after build.
- `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 51/51.
- Headless Chromium `chapters/ch40.html` at 320 / 390 / 1280: standards mode, 0 horizontal overflow, 0 page errors, fixed wording present, no "wikipedia" in page text.

## GitHub on `54bdcf70`
9/10 completed green (checks, guard, originality, verify ×2, runtime ×2, test, links). **Lighthouse in progress** (started 10:45 UTC). Moot until F5 lands — the new head needs its own run.

## Checklist (§4), delta only
1. Accuracy: F1–F4 confirmed; F5 open. 2–5. Unchanged from the first review (pass). 6. Religious sensitivity: Vodou, living tradition; sources-only; stays **per item**. 7. No games/3D.

## What it needs now
F5 applied on `loop/resourcing-ch40` (any session, this one excepted for the follow-up review), rebuild by the build order, a delta review of `54bdcf70..<new>` by a session that wrote none of F5, GitHub green incl. Lighthouse on the new head, and **Carter's per-item yes**.
