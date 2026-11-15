# Independent review — Wikipedia strip part 1, eras 01–02 (2026-11-15 ~10:30 UTC)

**Verdict: FIXABLE, 1 open finding (F1).**
- **Candidate:** `loop/wikipedia-strip-01-02` @ `d8d91ab0`, one commit on `main` `f92ab8d7` (still current `main`).
- **Reviewer:** session ..01HFWzToHU52frgsDom5N2UW. It wrote none of the candidate. The builder was ..01HFWzToa6S9VECD2DYY1Ayi.
- **Against:** `reviews/REVIEWER.md` §3–§4 and `handoff/order-2026-11-11-wikipedia-strip.md`.

## Automatic checks (§3)
- `node tools/review-checks.js --base origin/main --build`: **9 pass / 0 fail / 1 warn**. The warning is the expected "sources only, so it stays cleared" for ch03, ch04, ch05, ch41, ch57 and ch75. The build left no changed files, so the committed output is current.
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 51 pass, 0 fail.
- Headless check, 9 changed pages at 360 and 390 px wide:
  - standards mode;
  - 0 script errors;
  - no sideways overflow;
  - **0 wikipedia.org anchors**.
  - The pending banners are the same as on `main` (shown on ch02, ch42 and ch61).
- Crawl evidence: `grep -ci wikipedia` returns 0 on all 12 era 01–02 chapter pages (ch02, 03, 04, 05, 41, 42, 57, 61, 66, 67, 75, 76). It also returns 0 on all 12 era 01–02 markdown files.
- No PR is open yet, so the GitHub PR checks, Lighthouse included, have not run.

## Checklist (§4) against the order
- **List removal only (order item 2): pass.**
  - Every changed line in `eras/` falls under `## Sources`.
  - In `content/chapters.js`, every changed line is inside `<div class="sources">`.
  - `docs/sitemap.xml` and `content/dates.json` change only modified dates and hashes.
  - No prose changed, and no body text names Wikipedia.
- **Every removed entry is Wikipedia: pass, with one exception (F1).** I checked all 32 markdown removals line by line.
  - Where a bullet mixed Wikipedia and other sources, only the Wikipedia part went. The other sources are kept word for word: ch41 Smithsonian Qafzeh; ch61 Creative Spirits; ch75's seven Sámi-drum sources; ch02 Facts and Details and TheCollector; ch03 Morgan Library, WHE Hymn to Inanna and WHE Ludlul; ch05 Britannica; ch57 Encyclopedia.com, TheCollector and UT LRC.
  - ch02's Plutarch line keeps its text and loses only the link.
- **Empty subsections (item 4): pass.**
  - ch03 "On the Hammurabi 'code' debate" and ch04 "General" were removed cleanly, with their `<h4>`/`<ul>` in the built page.
  - No whole Sources section was left empty.
- **Sole-source flags (item 5): pass.** I checked the 16 flags against the diff. Each claim named had only a Wikipedia entry in its list, and none was missed.
  - The ch03 "god-list traditions" leftover is not a source, so removing that whole bullet is right.
  - The Hammurabi parenthetical named scholars without works, so it was not a citation either.
- **Cleared and pending status: pass.** The cleared chapters stay cleared (sources only), and no pending tag was cleared.
- **Accuracy, lens balance, honesty tiers, tone: not affected.** No claim text changed.
- **Sensitivity: pass.**
  - ch61's Wandjina line keeps its Creative Spirits source.
  - No image or sacred-object change.

## F1 (fixable) — ch05 lost primary-text pointers along with the Wikipedia links
**Where:** `eras/02-bronze-age/ch05-early-vedic-bronze-age.md`, `## Sources` → *Primary texts (translations)*, and the same `<li>` lines in `content/chapters.js`.

**What happened:** two bullets were cut back further than the order asks:
- `Creation hymns: [Wikipedia: Nasadiya Sukta]; [Hiranyagarbha Sukta]; Purusha Sukta (Rigveda 10.90).` became `Creation hymns: Purusha Sukta (Rigveda 10.90).`
- `The Gayatri Mantra (Rigveda 3.62.10) — [Wikipedia: Gayatri Mantra].` was removed whole.

The names of the hymns and the verse reference "Rigveda 3.62.10" are pointers to the primary text, not Wikipedia. The chapter's prose discusses all three by name: the Hiranyagarbha Sukta (10.121) and the Nasadiya Sukta (10.129) at lines ~138–140, and the Gayatri Mantra (Rigveda 3.62.10) at ~310. The order removes Wikipedia entries only. The same commit kept ch02's Plutarch line and dropped only its link, so ch05 is handled differently.

**Fix (exact wording; only the link text goes):**
```
- Creation hymns: Nasadiya Sukta; Hiranyagarbha Sukta; Purusha Sukta (Rigveda 10.90).
- The Gayatri Mantra (Rigveda 3.62.10).
```
Make the matching two `<li>` in ch05's Sources block in `content/chapters.js`, then rebuild ch05 and the dates/sitemap. Do not add verse numbers that were not there; they appear in the prose, not in the old list. Any session may fix this, including the builder. A session that did not write the fix then does a delta review. This review did not fix it, because §5 allows only mechanical slips and this restores list content.

## Notes (not findings)
- **N1 — the remaining "thinner" sources were not opened.**
  - WebFetch needs a live permission answer, and none came in this unattended run. I fetched nothing by any other means.
  - Web search shows that Encyclopedia.com "Hittite Religion" and Creative Spirits "What are Wandjinas?" still exist at their listed addresses. Facts and Details entry-143 did not come up in search.
  - These sources were already on the live pages before this change, so none of this is a defect in the diff. A session with web access may still open ch02's Deir el-Medina source (Facts and Details), now the bullet's only source.
- **N2 — overlap with `loop/sources-wrap-fix` (`02a870b8`).**
  - Both branches rewrite the Sources blocks of ch03, ch04 and ch05 in `content/chapters.js`. Whichever merges second will conflict and needs a re-sync.
  - After the re-sync, re-run the crawl. The wrap-fix restores full multi-line entries, and some of those (ch04 Pashupati, ch05 creation hymns / Nasadiya) carried Wikipedia continuation lines on `main`. The strip's markdown is already clean, so regenerating from markdown is safe. A hand merge must not bring the links back.
- **N3 — merge class.** Per item. It touches 6 cleared chapters, and Carter's 11-11 ruling may count as his yes: his call. This agrees with the builder's reading.

## Still missing before merge
1. F1 fixed, then a delta review by a session that did not write the fix.
2. A PR, so GitHub checks incl. Lighthouse run green.
3. Carter's per-item yes.
