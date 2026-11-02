# PR #115 delta review — `010a67e..cfe2449` (V90 Ark Tablet, 2009 vs 1985)

**Reviewer:** loop run 2026-11-02 ~06:27 UTC, session ..01HFWzTkgFh1apfYrEWjfvXT. This session wrote none of PR #115
(builder ..WzTpUKTMrXm5Ymt3Q6PC; first review and fix ..01HFWzTnPJ2pn7m6jcT9oP8G).
**Candidate:** `loop/vault-hero-objects` @ `cfe2449` (parent `main` `f8c39af`).
**Verdict: NOT PASS — 1 open finding (honesty wording, fixable by a builder run).**

## What the fix changed
`vault/v90-ark-tablet.md` (+ rebuilt `docs/vault/ark-tablet.html`, `content/dates.json`, search index): the opening no
longer states 2009 as when Finkel first saw the tablet; provenance bullet says "Most reports give 2009; one account says
Finkel first saw it in 1985"; well-supported bullet now says "from work he did on it from 2009"; new "genuinely open"
line names the Wikipedia replica article as the 1985 source; historyofinformation.com logged; size 11.5 x 6.0 cm.

## Sources opened this run
- historyofinformation.com id=4060 (opened): "In 2009 … Finkel" received the tablet; "11.5 x 6.0 cm"; "exactly 60 lines";
  "1900-1700 BCE". **Matches the entry.**
- Wikipedia, "Finkel's replica of Babylonian ark" (opened): "first encountered … in 1985"; "unable to gain access to
  translate the whole tablet until 2009". **Matches the entry's log note.**
- *Historia* magazine, "Irving Finkel and the ark", https://historiamag.com/irving-finkel-and-the-ark/ (opened): "In 1985,
  a member of the public brought in a damaged clay tablet"; Finkel quoted: "I was more taken aback than I can say…";
  Simmonds "took the tablet away again"; "It was another 14 years before Finkel ran into Simmonds at an exhibition".
- *Jewish Chronicle*, "The tablet that altered the story of Noah's ark",
  https://thejc.com/life/the-tablet-that-altered-the-story-of-noahs-ark-k3x6gkoe (opened): "Finkel first came across the
  tablet in 1985, when a man called Douglas Simmonds walked into the British Museum"; "only managed to convince Simmonds
  to leave it with him in 2009."
(Pages were read through the fetch tool's summary, with short verbatim quotes; a reviewer should re-read Historia directly.)

## Finding 1 (open) — the 1985 date is understated as "one account"
The fix flags the dates (good: it no longer asserts 2009 as first sight) but weighs the sources wrongly. The 1985 first
sighting is not one stray account: it is Finkel's own telling as reported by *Historia* (with his quote), and the
*Jewish Chronicle* gives the same, as well as Wikipedia. These sources also explain the two dates: 1985 = first shown,
taken away again; 2009 = left with Finkel for study. "Most reports give 2009; one account says 1985" and a
"genuinely open" line citing only Wikipedia therefore misstate the record (content-truth: say whose account it is).
Also open, and not on the page: *Historia*'s "another 14 years" before Finkel met Simmonds again points to about 1999,
which fits neither 2009 nor a straight 1985→2009 story.

**Suggested fix (builder run; flag, don't resolve):**
- Provenance bullet: "Accounts give two dates. In Finkel's own telling (*Historia* magazine; also the *Jewish Chronicle*),
  Douglas Simmons first brought the tablet in **1985**, then took it away again, and left it with him for study only in
  **2009**. Many 2014 news reports give 2009 alone."
- Opening: keep "who worked on it from 2009" + the pointer; optionally "first showed it to him in 1985" is NOT to be
  asserted as fact — keep the pointer.
- Genuinely open: "How the two dates fit. Finkel's account has a first viewing in 1985 and study from 2009; *Historia*
  says it was "another 14 years" before he met the owner again, which would be about 1999. The sources do not line up
  exactly; this entry does not resolve it."
- Log *Historia* and the *Jewish Chronicle* in the V90 source list (and in `sources/ch01-the-flood.md`, whose line 71
  says Historia was "not opened in this check").
- The (i5e) ch01 follow-up ("In 2009 a member of the public…") should use the same wording.

## Checks on `cfe2449` (this run)
- Build (vault, chapters, pages, museum, framework, registry): no diff.
- Every `tools/verify-*.js`: pass. `node --test framework/test/*.test.js`: 42/42.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Headless `vault/ark-tablet.html` at 360 and 390: no script errors (one blocked external request from the sandbox
  proxy), no sideways scroll, pending banner present.
- GitHub on `cfe2449`: 7/8 green; Lighthouse in progress at 06:29 UTC.

Nothing else in the delta is wrong: dimensions, line count and date range match historyofinformation.com; the Wikipedia
log note is accurate; the pending tag stays.
