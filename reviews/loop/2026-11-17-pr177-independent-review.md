# PR #177 independent review — ch38 re-sourcing (flags 101–105)

- **Reviewer:** build loop session ..01HFWzTm1SqoHZYYd4Yq6sfH (scheduled). Wrote none of `loop/resourcing-ch38`
  (builder ..01HFWzTkQaN1Xpp2EuiT58Lg, reply `2026-11-17-run-0012-resourcing-ch38-177.md`).
- **Candidate:** `loop/resourcing-ch38` @ `5083863e`, one commit on `main` `8226a332` (fast-forward possible).
- **Diff `origin/main...5083863e`:** 7 Sources entries in `eras/09-modern/ch38-wicca-modern-paganism-modern.md` and
  `content/chapters.js`, the generated `docs/chapters/ch38.html`, `content/dates.json`, `docs/sitemap.xml`, and a dated
  re-sourcing section in `sources/ch38-wicca-modern-paganism.md`. No chapter prose changed.
- **Verdict: PASS, 0 findings.** Merges **per item** (religious subject): needs Carter's yes.

## Each source re-opened by this reviewer (2026-11-17)
1. **Hutton, Gresham College transcript** — title "Modern Pagan Witchcraft", 14 May 2025. Says "the claim made in 1951"
   by Gardner; "in 1939 he had been initiated into one of the last covens of it, in the New Forest"; "No confirmation
   has been found to date of the existence of the coven…" and "he is still the sole known source of his religion".
   Entry matches; quotes exact.
2. **Berger, WRSP "Wicca"**, 5 April 2013 — New Forest 1939 (Clutterbuck); *Witchcraft Today* "the first non-fiction
   book on Wicca"; Murray wrote the foreword, her work "no longer accepted by historians"; Valiente "wrote much of the
   poetry used in the rituals"; eight sabbats; 1971 first feminist coven, California, Budapest; *The Spiral Dance* 1979;
   Starhawk founder of the Reclaiming Witches; 2007 pentagram on military graves. Entry claims nothing beyond this.
3. **Introvigne, *Bitter Winter*, 16 Feb 2026** — introduction by Murray that "added academic credibility"; "Scholars
   remain skeptical". The review names the series as Cambridge Elements; the entry's "Cambridge University Press,
   Elements in Magic, 2025" was checked by search: the book is in CUP's Elements in Magic series (Cambridge Core
   record; ISBNs 978-1-009-71387-0 / 978-1-108-95838-7). Bibliographic detail, correct.
4. **Encyclopedia of Occultism and Parapsychology via Encyclopedia.com** — "Founder of the main branch of Dianic
   (feminist) Wicca"; priestess of "the Susan B. Anthony Coven, in Venice, California". Entry matches.
5. **WRSP Ásatrú timeline**, 5 August 2020, no author shown — late 1960s Beinteinsson's group; 1972–1973 Ministry
   recognition as state-supported organization; first Allsherjargoði. Entry matches.
6. **ACLU press release**, 23 April 2007 — "will add the Pentacle to its list of approved emblems of belief"; separate
   lawsuits by the ACLU and Americans United. Entry matches.
7. **RNS Mabon report** — no headline, byline or date shown on the page; "in 1974, American witch Aidan Kelly claims to
   have given the holiday its name". **Judgement on this entry:** acceptable. It is labelled as Kelly's own claim and
   as a news report with no byline or year; it supports the chapter's "a name coined only in the 1970s" at the level
   of "claimed by its coiner, reported by RNS". A scholarly source (e.g. Hutton, *The Stations of the Sun*) would be
   stronger; the builder's gap list already says so. Not a finding.

## Gaps check
The source log's gap list is honest: "women-only" Dianic and "Coven No. 1", the folkish/universalist split, the Wheel
of the Year as modern synthesis, and pentacle element symbolism remain unsourced and are listed as such. The
preface/foreword/introduction label difference is noted; no chapter change needed.

## Local checks on `5083863e` (this reviewer)
- Full build order (stamp-dates → … → build-entity-registry): no diff.
- `node tools/review-checks.js --base origin/main --build`: 9 passed, 0 failed, 2 warnings (wikipedia-share on the ch38
  source log's older history, 73% — pre-existing pattern, same as #172; sources-only, chapter stays cleared).
- Verify 18/18. Tests 51/51.
- Headless `chapters/ch38.html` at 360/390/1280: standards mode, no sideways scroll, 0 page errors, all 7 new entries
  present, no "wikipedia" on the page, no pending tag (cleared status unchanged, as the sources-only rule allows).

## GitHub on `5083863e` (00:24 UTC)
9/10 completed green; **Lighthouse in progress** (run 43987021468, started 00:21 UTC).

## Still missing for merge
Lighthouse green on `5083863e`; Carter's per-item yes.
