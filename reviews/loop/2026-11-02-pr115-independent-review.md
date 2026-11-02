Batch: Vault hero objects, V89 The Flood Tablet + V90 The Ark Tablet (PR #115)
Reviewed: 2026-11-02
Auto-pass: per reviews/status.json (no auto-pass used; loop review for a per-item merge)
Covers: loop/vault-hero-objects@010a67e
Reviewer: loop run 2026-11-02 ~06:11 UTC, a session that wrote none of PR #115 (builder: session ..WzTpUKTMrXm5Ymt3Q6PC)
Summary: 2 passed in substance, 0 fixed, 1 open finding (fixable wording, not by this reviewer).

Automatic checks: all pass.
  - Full build order on the branch: no diff.
  - verify-*.js: all pass. node --test framework/test: 42/42.
  - review-checks --base origin/main --build: 9 passed, 0 failed, 0 warnings.
  - Headless 360 and 390 px: vault/flood-tablet, vault/ark-tablet, vault, ch01, ch03: all 200, no sideways scroll, 0 script errors, pending banner on both new pages.
  - GitHub on 010a67e at 06:15 UTC: 7/8 green (checks, test, originality, runtime x2, guard, links); Lighthouse still running.

PASSED   (in substance)
  - v89: accurate to the sources checked; Budge anecdote and DT 42 handled honestly; evidence tiers kept apart; no proof language.
  - site:pr115-surfaces: index, era pages, ch01/ch03 links, search, sitemap, OG cards, museum manifests, registry all consistent; both entries pending.

FIXED    (0)

OPEN FINDING (1) — must be fixed before merge
  - v90/1 and v90/4: "In 2009 his son Douglas showed it to Irving Finkel" (opening paragraph, "From a serviceman's souvenirs" bullet 1, and "well supported" bullet 1) is stated as settled. A source disagrees: Wikipedia "Finkel's replica of Babylonian ark" says Finkel first encountered the tablet in 1985 and could not translate it fully until 2009. historyofinformation.com says Finkel received it in 2009. The archive's rule is to flag a disagreement, not pick a side.
    Suggested fix (honesty wording, does not change what is claimed): say the owner brought it to Finkel and Finkel worked on it from 2009, add to "genuinely open" that accounts differ on whether Finkel first saw it in 1985 or 2009, and log both sources. The live ch01 ("In 2009 a member of the public brought...") has the same wording and should get the same note in a follow-up.
    Who: a builder run (not this reviewer: REVIEWER.md §5 forbids a reviewer changing a claim), then a short delta review by a run that wrote none of the fix.

Advisory (not findings)
  - v90: the source-note says no source gave the tablet's size in cm; historyofinformation.com gives 11.5 x 6.0 cm (and the "six-metre walls" Finkel figure). Optional to add.
  - v89: "within days of starting" (the 1873 DT 42 find) could not be confirmed from a source opened this run (Assyrian Discoveries not opened). The 7 vs 14 May disagreement is already flagged as open.

Accuracy spot-checks
  - v89 | 15 x 13 cm; 7th c. BC; Ashurbanipal library; 11th tablet of Gilgamesh; Ea reveals plan | https://www.britishmuseum.org/collection/object/W_K-3375 | supports (15.24 x 13.33 cm)
  - v89 | DT 42 catalogued as Atrahasis | https://www.britishmuseum.org/collection/object/W_DT-42 | supports ("A copy of the Atrahasis myth")
  - v89 | apprenticed at 14, banknote engraving; Rassam 1853; 3 Dec 1872 lecture, Gladstone present; died Aleppo 19 Aug 1876 aged 36; dysentery | https://en.wikipedia.org/wiki/George_Smith_(Assyriologist) | supports (Rassam 1853 carries "citation needed" there)
  - v89 | "Gilgamesh" reading established 1890 | https://en.wikipedia.org/wiki/Theophilus_Pinches | supports (Pinches, Oct 1890)
  - v89 | "young family" | same Wikipedia page | supports (six children; entry avoids a number)
  - v90 | Leonard Simmons, RAF; son Douglas; 3,600 m²; wooden ribs; two kinds of bitumen; beside the Map of the World; "107%"; "most important human documents" | https://www.archaeology.wiki/blog/2014/01/28/how-to-build-noahs-ark/ | supports (gives "around 1700 BC")
  - v90 | 60 lines; 1900–1700 BCE; Simmonds spelling | https://historyofinformation.com/detail.php?id=4060 | supports
  - v90 | 2009 as the year Douglas brought it to Finkel | historyofinformation.com (supports) vs https://en.wikipedia.org/wiki/Finkel%27s_replica_of_Babylonian_ark (1985 first seen) | DISAGREE — open finding above
  - v90 | replica: leaks, pumps, a third scale in some accounts, NOVA/Channel 4 titles, Alleppey (Kerala) | Wikipedia replica page | supports
  - v90 | round coracle | https://en.wikipedia.org/wiki/Irving_Finkel | supports
  - Could not load (permission timed out): macleans.ca (circular-plan and "two by two" wording), thecatholicherald.com.

Religious sensitivity: neither object is secret-sacred, restricted or a revered person's image; no new images beyond OG text cards. Carter's per-item yes for this new build is on file (order-2026-11-01-vault-hero-objects.md).

Needs your decision
  - Nothing new from this review. (The badge question, pending vs cleared, is already in STATUS → Needs Carter.)
