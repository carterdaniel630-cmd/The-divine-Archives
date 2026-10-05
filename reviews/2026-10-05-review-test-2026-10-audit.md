Audit: 2026-10-05 (scoring run)
Reports checked: reviews/2026-10-05-review-test-2026-10.md (the reviewer's report on review-test/2026-10 @ d570c82)
Sample: none this run (the blind re-review of the wiki batch is in reviews/2026-10-05-wiki-batch-audit.md)

## Test batch: scored review-test/2026-10

Honour-system check: the reviewer says it never opened the key, and nothing in its report suggests it did.
It flagged three decoy places as well as every planted error, and it argued each finding from the text and
outside sources rather than from the tags. The test is valid.

The key, by tag (copies of ch21 Islam, ch65 Bahá'í & New Faiths, ch83 Global Hinduism; 9 planted, 10 decoys):

| Tag | Kind | Where | What | Result |
|---|---|---|---|---|
| t01 | decoy | ch83, Brahmo Sabha 1828 | unchanged | checked OK (correct) |
| t02 | planted: "proof" word | ch21, Black Stone | "which laboratory analysis has proven to be a meteorite" added | CAUGHT (item 2) |
| t03 | decoy | listing.js, before ch65 | unchanged (pending: false, as on main) | false alarm (item 9) |
| t04 | decoy | ch21, the disconnected letters | unchanged | checked OK (correct) |
| t05 | planted: number off by 10x | ch65, opening | firing squad of 750 -> 7,500 | CAUGHT (item 6) |
| t06 | decoy | ch65, "Not supported" tier | unchanged | checked OK (correct) |
| t07 | planted: contested claim as settled | ch21, codification of the Qur'an | "tended to support an early codification" -> "settled the question in the tradition's favour" | CAUGHT (item 1) |
| t08 | planted: removed pending tag | listing.js, ch83 | pending: true -> false | CAUGHT (item 12) |
| t09 | planted: sensitivity | ch21, after "The house and the direction" | banner photograph of the Kaaba courtyard full of pilgrims added | CAUGHT (item 4) |
| t10 | decoy | listing.js, before ch21 | unchanged (pending: false, as on main) | false alarm (item 5) |
| t11 | decoy | ch21, Twelver branches | unchanged | checked OK (correct) |
| t12 | planted: lens made one-sided | ch21, believer's lens | closing sentence replaced by a dismissive outsider verdict | CAUGHT (item 3) |
| t13 | decoy | ch21, "The historical core is firm" | unchanged | checked OK (correct) |
| t14 | planted: fake source | ch65, sources list and source log | invented book: "Harold J. Whitcombe, *Nine Pillars* (George Ronald, 2001)" | CAUGHT (item 8) |
| t15 | planted: sensitivity | ch65, symbology | full-size photograph of Bahá'u'lláh added | CAUGHT (item 7) |
| t16 | decoy | ch65, persecution | unchanged | checked OK (correct) |
| t17 | decoy | ch65, progressive revelation | unchanged | checked OK (correct) |
| t18 | decoy | ch83, plantation diaspora | unchanged | false alarm (item 11), but the test's fault: see below |
| t19 | planted: wrong date | ch83, Arya Samaj | 7 April 1875 -> 7 April 1857 | CAUGHT (item 10) |

Score: 9 of 9 planted errors caught (100%). Each one was caught at the right place, for the right reason,
under NEEDS CARTER.

By type: fake source 1/1; wrong date 1/1; number 1/1; lens 1/1; contested 1/1; pending tag 1/1;
proof word 1/1; sensitivity 2/2. No fake source or sensitivity error was missed.

False alarms (not counted in the score):
- t10 and t03: the reviewer flagged ch21 and ch65 as "pending: false" with no clearance on record. Both
  values match main and were not planted. Its underlying question is a fair one for you (see below).
- t18 / ch83 "outdated death toll" and "source log reverted": not a reviewer error. I copied ch83 from main
  at 456d577 (09:59). ch83 was then updated on main at 10:10 (Wikipedia replacement) and at 23:06 (your
  Kumbh ruling), so the copy looked out of date compared with the current main. The reviewer reported that
  correctly. Next month I will note the copy's source commit in the test README.

Things the reviewer noticed that belong to the real site (not to the test):
- Arya Samaj founding date: main says 7 April 1875; the reviewer reports that most sources give 10 April 1875.
- ch21 and ch65 show pending: false on main, but reviews/cleared.json lists no chapters. They were probably
  cleared before the clearance log existed; only you can say.

## Scorecard

Accuracy this run: 100% (9 caught of 9 planted).
Rolling accuracy (last 3 counted runs): 100% ((2 + 9) of (2 + 9)).

## Auto-pass

ON (changed from off). The rule (AUDITOR.md §4b): auto-pass stays off until the first test batch is
scored, and comes back only when a scored batch reaches 90% or more with no missed fake source or
sensitivity error. This baseline batch scored 100% with no misses, and the rolling accuracy is 100%.

## Needs your decision

- Auto-pass is now ON under the 90% rule you approved. From the reviewer's next run, items it passes will no
  longer all come to you. If you would rather keep it off a while longer (for example until a second test
  batch), say so and I will set it back.
- Did you clear ch21 (Islam) and ch65 (Bahá'í) earlier? Both show pending: false, but the clearance log is
  empty.
- Should the Arya Samaj date on the real ch83 be checked (7 April vs 10 April 1875)? That would be a
  builder's fix, not mine.
