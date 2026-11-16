# Independent review — PR #167, ch39 (Satanism) re-sourcing

**Reviewer:** build loop run ..01HFWzTm4D3B2MfgKyqNedSi (scheduled), 2026-11-16 ~10:07 UTC (commit time; an earlier "~10:20" was a mis-estimate). Wrote none of #167 (builder ..01HFWzTn8GtwQWhrWh4oYaff).
**Candidate:** `loop/resourcing-ch39` **`b689f0fc`** on `main` `56d7c9d6`. Diff `origin/main...b689f0fc`: 6 files (ch39 markdown Sources list, `content/chapters.js` ch39 `<li>` lines, `docs/chapters/ch39.html` same lines + `dateModified`, `content/dates.json` ch39, `docs/sitemap.xml` two lastmods, `sources/ch39-satanism.md` appended log).
**Verdict: PASS — 0 open findings.** Merge stays **per item** (Satanism chapter: religiously sensitive).

## §3 automatic checks (on `b689f0fc`, clean worktree)
- `review-checks.js --base origin/main --build`: **9 pass / 0 fail / 2 warn**; build left the tree clean (committed output current).
  - WARN pending-diff: ch39 sources-only, stays cleared — correct; body prose unchanged (only `<li>` source lines + generated dates).
  - WARN wikipedia-share 60% in `sources/ch39-satanism.md`: the six counted lines are the original log kept as history; the page Sources list has no Wikipedia entry. Note, not a failure.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 51/51.
- Headless Chromium, `chapters/ch39.html` at 320 / 390 / 1280: no horizontal overflow, 0 script errors, new entries render, no "wikipedia" in page text.
- GitHub on `b689f0fc` at review time: originality, checks, guard, test, verify ×2, runtime ×2, links all **success**; **lighthouse in progress** (not yet green — merge condition 2 still open).

## §4.1 accuracy — every new source opened and checked against its entry
| Entry | Source checked | Result |
|---|---|---|
| Lanning 1992 | ojp.gov full-text PDF `136592NCJRS.pdf` + abstract page | **pass.** Author Kenneth V. Lanning, Supervisory Special Agent, BSU / NCAVC, FBI Academy; January 1992; NCJ 136592; "no bodies … in spite of major excavations"; "no physical evidence that a murder took place"; "in none of the cases of which I am aware has any evidence of a well-organized satanic cult been found." (Abstract page lists no author; the PDF does.) |
| Britannica "Satanism" | britannica.com/topic/Satanism | **pass.** Quote "Thorough investigation in both the United States and Britain found no evidence of any Satanist conspiracy" exact; *Là-bas* + black mass; Church of Satan 1966; Temple of Set 1975 / Aquino; TST "established … in 2012". |
| Britannica "Affair of the Poisons" | britannica.com/event/Affair-of-the-Poisons | **pass.** La Voisin (Catherine Deshayes, Madame Monvoisin); black masses; charges against Montespan "never proved"; 1679; no torture mentioned — the entry's own gap note is accurate. |
| Britannica "Church of Satan" | britannica.com/topic/Church-of-Satan | **pass.** 30 April 1966, Walpurgisnacht; *Satanic Bible* 1969; Satan not a real being; Aquino's defection; Blanche Barton after LaVey's death in 1997. |
| Encyclopedia.com "Temple of Set" (Gale) | encyclopedia.com …/temple-set | **pass.** Two Gale entries (Unusual & Unexplained; Occultism & Parapsychology); Aquino "an officer in the U.S. Army and a priest in the church"; "Set gave Aquino a mandate in the form of a book, *The Book of Coming Forth by Night*"; "the Left-Hand Path". "Xeper" only in a cited URL — the log's gap note is accurate. |
| Strube, *Correspondences* 4 | pure.uva.nl PDF | **pass.** 37–79; first in the 1854 *livraisons* of *Dogme de la haute magie*; frontispiece of *Dogme et rituel* (1855–1856); "a symbolization of the equilibrium of opposites"; Nicolai 1782, Barruel 1797, Hammer-Purgstall 1818. (Repository record says 2017; journal header 2016 — the entry follows the journal, fine.) |
| TST tenets page | search index title "THERE ARE SEVEN FUNDAMENTAL TENETS - TST" at the cited URL; tenet text read on thesatanictemple.com/about-us | **pass.** Summary in the entry matches the seven tenets; labelled as the group's own statement. (The blog URL itself could not be opened by this run's fetch tool; it is indexed under that exact URL and title.) |
| NPR via KPBS, 17 Aug 2018 | kpbs.org/news/2018/08/17/… | **pass.** Vanessa Romo (NPR); co-founder Lucien Greaves presented Baphomet at the rally at the State Capitol in Little Rock; "a 2015 state Supreme Court decision ruled the 6-foot granite structure unconstitutional, so Greaves withdrew it" (Oklahoma context). |
| AP via MPR, 4 Aug 2016 | mprnews.org/story/2016/08/04/… | **pass.** AP byline; After School Satan requests; "In all but one district, religious clubs are operated by the Child Evangelism Fellowship's Good News Clubs." |
| AP via Washington Times, 25 Apr 2019 | m.washingtontimes.com/news/2019/apr/25/… | **pass.** AP byline, 25 April 2019; non-theistic; Salem, Massachusetts. See note N1. |
| The Conversation (narrowed) | not fetched by URL; search confirms the article exists and is republished (Texas State Univ. newsroom, Religion News Service, 23 Sep 2021) with that title | **pass.** Entry now claims only what its title shows. |

No fake, dead or non-supporting source found. No entry claims more than its source covers.

## §4.2–4.6
- Lens balance, evidence-honesty tiers, contested-claim flags, tone: **pass** — body prose untouched; the new entries are descriptive and add no verdicts. The 2012/2013 founding-date difference is flagged in the entry rather than silently resolved — correct.
- Religious sensitivity: no image, model, sacred object or restricted site touched. Chapter is on the per-item list by subject (Satanism), so the merge stays per item.
- Games/3D: not touched.

## Notes (not findings)
- **N1.** The AP story reports the IRS designation on the group's account, from an IRS letter the group showed AP; the IRS had not commented. The entry's "The 2019 IRS recognition" is supported (AP saw the letter). If Carter wants the strictest wording, a later class-(c) fix could read "as reported by AP from the IRS letter the group shared".
- **N2.** Agree with the builder's two wording notes for Carter (Baphomet first published 1854, not 1856; TST 2012 per Britannica vs chapter's 2013). Both confirmed in the sources above. Prose fixes are out of #167's scope.
- **N3.** Gaps logged, not papered over: Affair of the Poisons 1677–1682 span and torture note; "Xeper"; *solve et coagula*; Gilmore and the Sigil of Baphomet. Accurate.

## Still missing before merge
1. Lighthouse on `b689f0fc` completed and green (was in progress at ~10:20 UTC).
2. **Carter's per-item yes.**
