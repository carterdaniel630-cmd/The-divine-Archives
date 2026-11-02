# PR #115 delta review 3 — `2655e55..cb8c52f` (V90 Ark Tablet, 1985/2009 wording)

**Reviewer:** loop run 2026-11-02 ~06:50 UTC, session ..01HFWzTpWzCFfzkie5HTyEiv. This session wrote none of PR #115
(builder ..WzTpUKTMrXm5Ymt3Q6PC; fix 1 ..01HFWzTnPJ2pn7m6jcT9oP8G; fix 2 ..01HFWzTkgFh1apfYrEWjfvXT; fix 3
..01HFWzTpY8ezfeqinAyWFBg6).
**Candidate:** `loop/vault-hero-objects` @ `cb8c52f` (parent `main` `f8c39af`).
**Verdict: PASS — 0 open findings.** Earlier findings (independent review on `010a67e`, delta reviews 1 and 2) are all
closed by this head.

## Delta read
4 files: `vault/v90-ark-tablet.md`, rebuilt `docs/vault/ark-tablet.html`, `content/dates.json` (v90 hash only),
`docs/assets/search-index.json`. The provenance bullet and the genuinely-open line apply delta review 2's suggested
wording verbatim; the note on sources now says *Historia* gives no year for the hand-over and 2009 is the *Jewish
Chronicle*'s. Built HTML matches the markdown. Pending tag stays. No other change.

## Sources re-read this run (fetch tool summary with verbatim quotes, a third separate check)
- *Historia*, https://historiamag.com/irving-finkel-and-the-ark/: "In 1985, a member of the public brought in a damaged
  clay tablet"; "his interlocutor blithely took the tablet away again"; "It was another 14 years before Finkel ran into
  Simmonds at an exhibition". **No 2009 anywhere.** Matches the page: 1985, took it away, no year for the hand-over,
  "14 years" (~1999) flagged as unreconciled.
- *Jewish Chronicle*, https://thejc.com/life/the-tablet-that-altered-the-story-of-noahs-ark-k3x6gkoe: "Finkel first came
  across the tablet in 1985…"; "only managed to convince Simmonds to leave it with him in 2009." Matches the page.
- Wikipedia, "Finkel's replica of Babylonian ark": "first encountered … in 1985"; "unable to gain access to translate the
  whole tablet until 2009." Matches the page's "first viewing in 1985" attribution.
Every attribution in the two changed sentences now matches its source; the disagreement is flagged, not resolved.

## Checks on `cb8c52f` (this run, own worktree)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry): no diff.
- Every `tools/verify-*.js` (18): pass. `node --test framework/test/*.test.js`: 42/42.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Headless `vault/ark-tablet.html` at 360 and 390: 0 script errors, no sideways scroll, pending tag present, new wording present.
- GitHub on PR #115 head: 7/7 completed green (checks, guard, originality, test, links, runtime x2); **Lighthouse in
  progress** (started 06:50:57 UTC). Not mergeable until Lighthouse completes green.

## Still owed, outside this PR
- (i5e) `sources/ch01-the-flood.md` line 71 still says Historia was "not opened in this check", and live ch01 has no
  1985/2009 note. Class (c), own PR off `main`, use V90's final wording.
