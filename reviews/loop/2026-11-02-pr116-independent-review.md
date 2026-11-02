# Independent review — PR #116 (ch01 Ark Tablet 1985/2009 note)

**Id:** site:pr116 · **Candidate:** `loop/ch01-ark-dates` @ `f7c7d79` (parent `main` `cb8c52f`)
**Reviewer:** session ..01HFWzTk9uK91ZXBirrhE5wt, 2026-11-02 ~07:25–07:45 UTC. Wrote none of #116 (builder ..01HFWzTnn5yoLm3RF8BKRxrL).
**Verdict: 1 open finding (fixable, honesty wording). Not mergeable yet.**

## §3 automatic checks (on the candidate, clean worktree)
- `review-checks.js --base origin/main --build`: 9/9 PASS, 0 warnings; build output current (tree clean after build).
- `tools/verify-*.js`: 18/18 pass. `node --test framework/test/*.test.js`: 42/42.
- Headless ch01 at 360×640 and 390×844 (touch): 200, 0 page errors, no sideways scroll, new sentence present, pending tag present.
- GitHub on `f7c7d79`: 9/10 green; **Lighthouse in progress** (started 07:22:33 UTC).

## Scope
Only one paragraph of `content/chapters.js` changed (one line) and the same paragraph of `docs/chapters/ch01.html`;
the rest is the theme markdown, its Sources bullet, the source log and regenerated registry/dates. Matches the PR description.

## §4 checklist
1. **Accuracy** — sources fetched this run:
   - Wikipedia, Finkel's replica of Babylonian ark (https://en.wikipedia.org/wiki/Finkel%27s_replica_of_Babylonian_ark):
     "Dr. Finkel first encountered a recently discovered small cuneiform tablet in 1985"; "He was unable to gain access
     to translate the whole tablet until 2009." → supports "Wikipedia … first saw it in 1985". **pass**
   - *Jewish Chronicle* (https://thejc.com/life/the-tablet-that-altered-the-story-of-noahs-ark-k3x6gkoe), opened on
     second try: "Finkel first came across the tablet in 1985, when a man called Douglas Simmonds walked into the British
     Museum"; "only managed to convince Simmonds to leave it with him in 2009." → supports both JC attributions. **pass**
   - **"many 2014 news reports give only 2009"** — **fixable (open finding F1).** The ch01 source log cites no 2014
     news report for this. Checked this run: historyofinformation.com (a later summary citing the Guardian, 24 Jan 2014,
     and the BM blog) says "In 2009 … received"; but the 2014 reports I could open give **no year at all**:
     Christian Science Monitor 25 Jan 2014 (https://csmonitor.com/Science/2014/0125/Noah-s-Ark-Was-it-really-round),
     Times of Israel (https://www.timesofisrael.com/british-museum-prototype-for-noahs-ark-was-round/) and the AP copy
     in the Daily Star (https://www.thedailystar.net/4-000-year-old-tablet-gives-new-details-on-noahs-ark-8526) say
     "Finkel got hold of it a few years ago"; NBC News gives no year. So "many … give only 2009" is not shown by any cited
     source and the reports checked point the other way.
     **Suggested wording (theme md + chapter):** "…the *Jewish Chronicle* says the owner left it with him only in 2009,
     and some later summaries give 2009 alone (2014 news reports mostly say only 'a few years ago')." Add the
     historyofinformation.com and CSM/AP links to the ch01 Sources bullet and the source log.
   - Unchanged text in the paragraph (father brought it home after WWII; sixty lines; 1900–1700 BCE) not re-checked: not in the diff.
2. **Lens balance:** n/a for this wording; unchanged. **pass**
3. **Evidence tiers:** unchanged; no proof/settled language added. **pass**
4. **Contested flagged, not resolved:** yes, explicitly ("does not resolve them", points to V90). **pass**
5. **Tone:** descriptive. **pass**
6. **Sensitivity:** none touched; no tag cleared. **pass**
7. **Games/3D:** none changed. **pass**

## Follow-up outside this PR (not a finding on #116)
Live Vault V90 (`vault/v90-ark-tablet.md`, provenance bullet and "How the two dates fit") carries the same phrase
"many 2014 news reports". Same fix belongs there: a small class (c) honesty-wording PR, after #116's wording settles.

## Class
(c) honesty wording on live text, unchanged by this finding. After the fix: delta review by a session other than the fixer, GitHub green incl. Lighthouse, merge by class (c).
