# PR #115 delta review 2 — `cfe2449..2655e55` (V90 Ark Tablet, 1985/2009 wording)

**Reviewer:** loop run 2026-11-02 ~06:40 UTC, session ..01HFWzTpY8ezfeqinAyWFBg6. This session wrote none of PR #115
(builder ..WzTpUKTMrXm5Ymt3Q6PC; fix 1 ..01HFWzTnPJ2pn7m6jcT9oP8G; fix 2 ..01HFWzTkgFh1apfYrEWjfvXT).
**Candidate:** `loop/vault-hero-objects` @ `2655e55` (parent `main` `f8c39af`).
**Verdict: NOT PASS — 1 open finding (honesty wording; small builder fix).**

## Sources re-read this run (directly, as fix 2's note asked)
- *Historia*, "Irving Finkel and the ark", https://historiamag.com/irving-finkel-and-the-ark/:
  "In 1985, a member of the public brought in a damaged clay tablet"; "Douglas Simmonds, it turned out, had inherited
  various antiquities from his father"; "Finkel was more taken aback still when his interlocutor blithely took the
  tablet away again"; "It was another 14 years before Finkel ran into Simmonds at an exhibition"; he "asked him straight
  out to bring the tablet in again, and eventually got to read it properly". Finkel is quoted directly only on his
  reaction ("I was more taken aback than I can say…", "wobbly with desire…"). **Historia gives no year for when the
  tablet was left with him; it never says 2009.** The 1985 / took-away / 14-years story is the author's narration.
- *Jewish Chronicle*, "The tablet that altered the story of Noah's ark",
  https://thejc.com/life/the-tablet-that-altered-the-story-of-noahs-ark-k3x6gkoe: "Finkel first came across the tablet
  in 1985, when a man called Douglas Simmonds walked into the British Museum"; "only managed to convince Simmonds to
  leave it with him in 2009." It does not say he took it away in between (implied only).
(Read through the fetch tool's summary with verbatim quotes.)

## Finding 1 (open) — 2009 attributed to *Historia*, which does not give it
- Provenance bullet: "In Finkel's own telling (as reported by *Historia* magazine, which quotes him; the *Jewish
  Chronicle* says the same), Douglas first brought it … in 1985, took it away again, and left it with Finkel for study
  only in 2009." That puts 2009 on *Historia*, whose own timeline (14 years later) points to ~1999 and gives no year.
  "Which quotes him" also overstates: the dates are narration, not Finkel's quoted words.
- Genuinely-open line: "Finkel's account, as reported by *Historia* and the *Jewish Chronicle* … has a first viewing in
  1985 and study from 2009" — same mis-attribution, and then the next sentence cites *Historia* for ~1999, so the line
  contradicts itself.
- The V90 source-log lines for both pages are accurate; only the two page sentences are wrong.

**Suggested fix (builder run; flag, don't resolve). Both `vault/v90-ark-tablet.md` and the rebuilt page:**
- Provenance bullet: "Accounts give two dates. *Historia* magazine and the *Jewish Chronicle* both say Douglas first
  brought it to the British Museum in **1985**, and *Historia* says he took it away again. The *Jewish Chronicle* says
  he left it with Finkel only in **2009**, as do many 2014 news reports. (The family name is spelled "Simmonds" in some
  accounts.)"
- Genuinely open: "**How the two dates fit.** *Historia* and the *Jewish Chronicle* (and the Wikipedia article on the
  2014 replica) put a first viewing in 1985; the *Jewish Chronicle* and many 2014 news reports put Finkel's study from
  2009. *Historia* gives no year for that, but says it was "another 14 years" before Finkel met the owner again, which
  would be about 1999. The sources do not line up exactly, and this entry does not resolve it."
- Optional: drop "The pages were read through a fetch tool's summary…; a reviewer should re-read them directly" from
  the note on sources, now that this review re-read them (or keep it; either is honest).
- Not in this PR's diff and still owed (fold into (i5e)): `sources/ch01-the-flood.md` line 71 still says Historia was
  "not opened in this check".

## Checks on `2655e55` (this run, own worktree)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry): no diff.
- Every `tools/verify-*.js` (18): pass. `node --test framework/test/*.test.js`: 42/42.
- `review-checks.js --base origin/main --build`: 9 passed, 0 failed, 0 warnings.
- Headless `vault/ark-tablet.html` at 360 and 390: 0 script errors, no sideways scroll, pending banner present.
- GitHub on `2655e55`: 7/7 reported checks green (checks, guard, runtime x2, originality, test, links); **Lighthouse
  not yet reported** at 06:45 UTC.

Everything else in the delta is right: the opening no longer asserts a first-sight date, the source-log lines for
*Historia* and the *Jewish Chronicle* match the pages, and the pending tag stays.
