PREVIOUS SCHEDULED RUN FAILED TO PUSH: 2026-10-10 21:32 UTC (routine had no repository access; already reported in the 2026-10-10 reports). This is a manual run.
1 passed, 0 fixed, 1 needs Carter.

NEEDS CARTER (1)
  - ch61: the source problem from yesterday is fixed (Manne's figure now has a real source and is labelled as his estimate). It stays with you only because it covers Uluṟu, a restricted site; it would pass.

------------------------------------------------------------------------------------------------

Batch: follow-up on PR #35 (claude/content-depth) after the fixes to yesterday's findings; also notes main
Reviewed: 2026-10-11
Auto-pass: on ("audit 2026-10-11: 6 of 6 re-reviewed items agreed; rolling accuracy ... 17/17 (100%) ...", reviews/status.json)
Covers: claude/content-depth@20c1c11
Covers: main@7541b7c   (#36 at 13204b3 and #39 at 48dfcf8, merged on Carter's batch approval 2026-10-11; same content as reviewed on 2026-10-10, nothing new)
Summary: 1 passed, 0 fixed, 1 needs you.

What changed since 997d7bb (the head reviewed in 2026-10-10-content-depth.md)
  - 3652e81 then 4d46b5e: ch61's Stolen Generations figures. The unsourced "at least 100,000" is gone. Manne's
    20,000–25,000 is back, cited to *In Denial* (Quarterly Essay 1, 2001) as quoted in Bain Attwood's review,
    *Aboriginal History* 25 (2001), p. 164. The text now says "That is Manne's estimate, not an agreed figure".
  - 20c1c11 (labelled "review fix", from another session): ch08's "in a barn outside Moscow" becomes "in Moscow",
    with Thomas, *Mnemosyne* 68.3 (2015), added for 1777.
  - be49a1a: main merged in (#36, #39). No other chapter text changed. The other 15 chapters' verdicts from
    2026-10-10 stand.

Automatic checks (base origin/main@7541b7c)
  - review-checks.js --build: 8 checks pass. The build output matches what is committed, and nothing was left
    over. All 17 chapters stay pending.
  - WARN wikipedia-share: 8 of 17 logs are over 20%. These are older pointers, with none in the new sections.
  - All 15 tools/verify-*.js pass.
  - GitHub Actions on 20c1c11: checks, guard, verify, runtime and links are green. Lighthouse was still running.

PASSED   (1)
  - ch08: the unconfirmed detail is removed, and 1777 is now cited to a peer-reviewed article that says it.

NEEDS CARTER (1)
  - ch61 (eras/01-prehistory/ch61-aboriginal-australian-dreaming-prehistory.md, "The Stolen Generations and the
    return of Uluṟu"): it touches the restricted-site rule (REVIEWER.md §4.6), so it always goes to you. Would
    pass. The Uluṟu text is exterior-only, with no image. The Manne figure is now cited and framed as one
    historian's disputed estimate. The contested numbers are flagged, not resolved.

Accuracy spot-checks
  - ch61 | Attwood, "The Stolen Generations and genocide: Robert Manne's In Denial", Aboriginal History 25 (2001) | https://www.kooriweb.org/foley/resources/pdfs/90.pdf (could not load from here; search confirms the essay exists in vol. 25) | essay confirmed; the exact quote and page 164 could not be read
  - ch61 | Manne's 20,000–25,000 estimate | search results on Manne (quadrant.org.au; moodle.pmaclism) | consistent: widely attributed to Manne
  - ch08 | Thomas, "Manuscript Readings in the Homeric Hymn to Demeter 389–479", Mnemosyne 68.3 (2015), 465–469, doi 10.1163/1568525X-12341719 | https://nottingham-repository.worktribe.com/output/750980 (search) | supports ("discovery by C.F. von Matthaei in Moscow in 1777")

Needs your decision
  - ch61: are you happy with how the Uluṟu passage handles the site, and with Manne's figure as now framed?
    (yes/no)
  - Merging PR #35 is your call.
