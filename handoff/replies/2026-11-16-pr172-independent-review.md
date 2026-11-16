# PR #172 — independent review (ch37 re-sourcing, flags 98 + 100)

**Reviewer:** build loop run ..01HFWzTkfGQG6ha72LP3FJ9M (scheduled), which wrote none of #172 (builder: ..01HFWzTob5yS1QaU71g62iGz).
**Candidate:** `loop/resourcing-ch37` @ `67d99dd2`, diff `origin/main` (`9d35e620`)...`67d99dd2`, 8 files.
**Verdict: FIXABLE — 2 findings (both small citation-precision fixes, exact wording below). Not mergeable until fixed and delta-reviewed.**

## Scope read
Three new Sources entries (markdown + `content/chapters.js` + generated `docs/chapters/ch37.html`), the dated source-log section, registry rebuild (+5 source entities, total 4675), dates/sitemap. Chapter text unchanged (confirmed in the diff).

## Each source opened
1. **theosociety.org/pasadena/sd/sd-hp.htm** — opened. Says: "This HTML edition was corrected against the facsimile edition of 1888." Entry's description matches.
2. **sacred-texts.com/the/sd/sd2-3-09.htm** — opened. Vol. II, ends "End of Vol. II."; page markers run **778 to 798**. Contains "every Root-Race runs through a gamut of seven sub-races with seven branchlets" and "Lemuria cannot any more be confounded with the Atlantis continent than Europe with America." Supports the entry — but see F1 on the page range.
3. **Strube, JAAR 89.4 (2021) 1180–1189** (opened via academic.oup.com/jaar/article/89/4/1180/6500917, CC BY 4.0). Reads: "Central to Theosophical doctrines is the concept of 'root races'"; "the current fifth root race is called the 'Aryan' race"; race theories "had concrete effects on racial relations…". Santucci is described as holding Theosophical race discussion "entirely separate and apart" from contemporary racial ideas; Lubelsky distinguishes "racial discourse" from "racial policy". Entry matches; the dispute is framed as a dispute, neither side picked. Framing judged fair.
4. **Santucci, Nova Religio 11.3 (2008) 37–63**, DOI 10.1525/nr.2008.11.3.37 — bibliographic data confirmed on relbib.de/Record/1816078697. Its summary says: "Race as interpreted in The Secret Doctrine is not racist **in intent**". See F2.
5. **Price, "The Hodgson Report on Theosophy," Psi Encyclopedia (SPR)** — opened. Leslie Price, created 28 November 2016. Hodgson et al., *Proc. SPR* 3 (1885) 201–400; Harrison "a senior SPR member and expert in photography and handwriting"; "J'Accuse", *JSPR* 53 (1986) 286–310; "three distinct hands"; "seriously criticised the procedure used by Hodgson". The article does not say the SPR as a body distanced itself — confirms the builder's wording flag to Carter.

## Findings
- **F1 (citation precision, fixable):** the Secret Doctrine entry gives "pp. 778–799"; the page read runs pp. 778–798 and vol. II ends on p. 798. **Fix:** "(pp. 778–799)" → "(pp. 778–798)" in `eras/09-modern/ch37-theosophy-occult-revival-modern.md`, `content/chapters.js` (and so the generated ch37 page) and the source log ("pp. 778–799" there too). Rebuild generated files.
- **F2 (contested-claim precision, fixable):** the Strube entry says Santucci "finds Blavatsky's race teaching not racist". Santucci's own summary says "not racist in intent", and Strube describes his view as race in Theosophy being "entirely separate and apart" from contemporary racial ideas. Dropping "in intent" overstates his position on a sensitive, contested point. **Fix:** "who finds Blavatsky's race teaching not racist" → "who argues that race as taught in *The Secret Doctrine* is not racist in intent" (markdown uses `*The Secret Doctrine*`, chapters.js uses `<em>The Secret Doctrine</em>`).

No other findings. Gaps listed by the builder (Ariosophy/Thule, rounds, "impostors" quote, plagiarism) are honestly flagged and no entry claims them.

## Local checks on `67d99dd2` (separate worktree)
- `review-checks.js --base origin/main --build`: 9 pass / 0 fail / 2 warn (sources-only stays cleared; ch37 source-log Wikipedia share 27%, historical). Build left the tree clean.
- verify 18/18; tests 51/51.
- Headless ch37 at 320/390/1280: standards mode, no horizontal overflow, 0 script errors, all three new entries present.

## GitHub on `67d99dd2` (16:3x UTC)
9/10 green; Lighthouse run 43906710103 in progress since 16:22.

## Next for #172
Any run applies F1+F2 on `loop/resourcing-ch37` (and rebuilds); a session that wrote none of the fix does the delta review; GitHub green incl. Lighthouse on the new head; then Carter's per-item yes. The "formally distanced" sentence stays a separate Carter question.
