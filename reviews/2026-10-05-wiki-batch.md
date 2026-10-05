Batch: Wikipedia-replacement sources batch, ch66–ch72 and ch75–ch82 (PRs #16–#30)
Reviewed: 2026-10-05
Auto-pass: SUSPENDED ("no baseline test batch yet", reviews/status.json)
Covers: claude/wiki-ch66@401cb47
Covers: claude/wiki-ch67@84f8973
Covers: claude/wiki-ch68@e3a8db9
Covers: claude/wiki-ch69@a3a6a95
Covers: claude/wiki-ch70@ce5ad14
Covers: claude/wiki-ch71@aa72d7b
Covers: claude/wiki-ch72@3fae3cc
Covers: claude/wiki-ch75@b46009b
Covers: claude/wiki-ch76@24d7d2e
Covers: claude/wiki-ch77@9da8761
Covers: claude/wiki-ch78@06fec49
Covers: claude/wiki-ch79@dd912b6
Covers: claude/wiki-ch80@47e7fe3
Covers: claude/wiki-ch81@7ed1c0b
Covers: claude/wiki-ch82@4f88881
Summary: 0 passed, 0 fixed, 15 need you (auto-pass is off).
         Of the 15: 12 would pass, 3 need your decision (ch70, ch71, ch77).

Automatic checks: all pass on all 15 branches. No failures.
  - review-checks.js --base origin/main --build: links, garbled links, file size,
    sitemap, pending banners, pending status and build output all PASS everywhere.
  - Every verify-*.js game check passes on every branch.
  - GitHub checks on PR #26 (sample): verify, checks, guard, runtime, links all green.
  - WARN ch72: Wikipedia share 24%, over the 20% line (7 citations kept as labelled
    "pointers" because the drafting session ran out of searches).
  - WARN ch66, ch67, ch69, ch71, ch72: "sources only, so it stays cleared". This is right
    for these cleared chapters. The extra line "1 Pantheon figure changed" is a wording
    slip in the branches' older copy of the tool (already corrected on main); no figure
    was changed.

How the sources were checked
  - Most publisher and journal sites are blocked from this session, both for direct
    reading and for web fetch. So almost every check is a search-result confirmation:
    the search found the work under that author, title, venue and year, and (where it
    matters) a summary saying what the work argues.
  - About 75 of the new sources were searched one by one: every unusual or less-known
    one, every web link that looked doubtful, and every source behind a date ruling.
  - The rest are standard, widely cited works (for example Herodotus, Lichtheim, Olivelle,
    Barber, Madelung, the UNESCO listings). I recognised them and checked that each fits
    the claim it is attached to, but did not run a separate search for each one.
  - No source was found that does not exist. One web link could not be confirmed (ch68).
    One source probably does not cover the claim it now carries (ch71).

Only the expected sentences changed
  - In 10 chapters, only the Sources section, the source log and the rebuilt pages changed.
  - In the 5 chapters you ruled on, exactly one body sentence changed each:
    ch68 line 19, ch70 line 21, ch77 line 55, ch79 line 27, ch81 line 47.
  - ch68 and ch70 also had pending switched on (pending: true), as you ruled.
    ch77, ch79 and ch81 were already pending on main.

Wikipedia share, before → after (matches each PR title)
  ch66 22%→0%  ch67 50%→0%  ch68 53%→0%  ch69 76%→0%  ch70 69%→3%  ch71 60%→0%
  ch72 66%→24% ch75 24%→5%  ch76 41%→0%  ch77 45%→0%  ch78 33%→0%  ch79 44%→0%
  ch80 53%→4%  ch81 55%→0%  ch82 28%→6%

PASSED   (0)
  (none: auto-pass is suspended)

FIXED    (0)
  (none: nothing needed a mechanical fix; ch70 is already pending on its branch)

NEEDS CARTER (15)
  - ch66 (#16): would pass. All 10 new sources found. The author's two notes stand for you:
    Tsodilo "published in 2006" (it was announced in 2006; the full paper came in 2011), and
    the 2006 Botswana ruling (the court also ruled 2–1 that ending services was lawful,
    which the chapter does not mention).
  - ch67 (#18): would pass. About 25 excavation reports and monographs, all real and on topic.
    The author's two notes stand for you: other theories of where the "horns of consecration"
    came from, and the scholars who defend the Ring of Nestor.
  - ch68 (#21): would pass. Your Qustul ruling is in the text exactly as recorded: "the early
    1980s", with "(his full excavation report followed in 1986)". Williams's first article
    is Archaeology 33 (1980). One link could not be confirmed: the asor.org PDF of Strabo
    17.1.54. Strabo's passage itself is real and does say this about Candace and Petronius.
  - ch69 (#24): would pass. All sources found. The Supreme Court of India Ambedkar page was
    found at api.sci.gov.in with the same path; the main.sci.gov.in address could not be
    confirmed. The author's note on the Heliodorus pillar date (~113 BCE) stands for you.
  - ch70 (#26): NEEDS YOUR DECISION. Your date ruling is not carried out correctly in the
    Taymāʾ sentence (Gods of the north, line 21). The text says "Joseph Naveh's study of its
    script, followed by Peter Stein (2013), puts it about 380 BCE". Search results quoting
    the Louvre's record for the stele (AO 1505) say Naveh (1970) dated it to the
    mid-fifth century BCE, and Stein (2013, p. 34) to about 380 BCE (Artaxerxes II). So
    380 is Stein's date, not Naveh's; the sources disagree with each other. The Louvre
    itself says fifth century. Also, the other dating ("often placed in Nabonidus's
    century") names no source, though you asked for both datings with their sources. The
    source log's own note repeats the "Stein follows Naveh" mistake. The chapter is
    already pending on its branch, so I changed nothing. The other new sources are all fine.
  - ch71 (#27): NEEDS YOUR DECISION. On the skeptical lens (line 50) the chapter says North Korea
    announced in 1993 that it had found Dangun's tomb. That claim's old Wikipedia source was
    replaced by Pai, Constructing "Korean" Origins (2000). The book is real and studies the
    Dangun myth, but searches could not confirm that it covers the 1993 tomb. The author
    flagged this too. So the sentence may now have no confirmed source. The chapter stays
    cleared (I have not shown the source fails), but you may want it sent back to pending
    until a source for the 1993 claim is added. The other new sources are fine.
  - ch72 (#30): would pass. The new sources are real and on topic. The Wikipedia share is
    still 24% (7 pointers), over the 20% line.
  - ch75 (#17): would pass. All sources found (Rydving 1991, Dick 1995, Brough 1971 and others).
  - ch76 (#19): would pass. All sources found. The Trafficking Culture page on El Manatí
    exists, but under a different address (/case_note/...) than the one cited.
  - ch77 (#20): NEEDS YOUR DECISION (small). Your ruling is mostly carried out (The linen book, line 55):
    "dated by some to the third century BCE, and by L. B. van der Meer's 2007 study to the first
    half of the second". Search confirms van der Meer's date. But the third-century dating is
    "by some", with no source named, and you asked for both datings with their sources.
    Nothing else in the sentence changed. The new sources are all fine.
  - ch78 (#22): would pass. All sources found (Polosmak 1999, Ol'khovskii & Evdokimov 1994,
    Encyclopedia of Ukraine and others).
  - ch79 (#23): would pass. Your Garima ruling is in the text and matches McKenzie and Watson
    (2016) as search results report it: three manuscripts, two illustrated; about 390–570
    (Garima 2) and 530–660 (Garima 1); Garima 2 the oldest. "In Oxford" was dropped, which
    only removes words. Sources found (Cowley 1974, the Aethiopica review, the Met essay).
  - ch80 (#25): would pass. All sources found. The Aga Khan V date (succeeded 4 February 2025)
    is confirmed by the Institute of Ismaili Studies.
  - ch81 (#28): would pass. Your Phagpa ruling is exact: "National Preceptor (1260) and later
    his Imperial Preceptor (c. 1270)". The Treasury of Lives confirms the 1260 national
    preceptor title. Sources found (Atwood 2004, Melville 1990, Balogh 2010 and others).
  - ch82 (#29): would pass. All sources found (Rezavi 2008, Truschke 2011, JAINpedia,
    Thackston's Jahangirnama, Bailey 1998).

Accuracy spot-checks (search-result confirmation unless marked)
  - ch68 | Williams's Qustul proposal, early 1980s | search: Williams, "The Lost Pharaohs of Nubia", Archaeology 33 (1980) 12–21; Adams, JNES 44.3 (1985) 185–192 | supports
  - ch68 | Strabo 17.1.54 on Candace | https://www.asor.org/wp-content/uploads/2022/04/Strabo_Geography_Vol8_17.1.54.pdf | could not load; link not found by search (text itself real)
  - ch70 | Taymāʾ stele: Naveh/Stein ~380 BCE | search results quoting Louvre AO 1505 record; https://www.sttonline.org/wp-content/uploads/files/STT8_2013_PStein_EN.pdf (blocked) | does not support (Naveh = mid-5th c.; 380 is Stein's)
  - ch70 | Stewart, saj' | search: Journal of Arabic Literature 21.2 (1990) 101–139 | supports
  - ch71 | 1993 Dangun tomb | https://korea.fas.harvard.edu/publications/constructing-%E2%80%9Ckorean%E2%80%9D-origins-critical-review-archaeology-historiography | could not confirm coverage
  - ch71 | 2015 census, 56.1% no religion | https://www.koreatimes.co.kr/amp/lifestyle/others/20170110/more-koreans-now-non-believers-census-shows | supports
  - ch72 | Porete burned 1 June 1310 | https://muse.jhu.edu/article/516560 (review of Field 2012) | supports (book found)
  - ch77 | Liber Linteus, van der Meer 2007: first half of 2nd c. BCE | search results on van der Meer 2007 | supports
  - ch79 | Garima: three MSS, 390–570 / 530–660 | search results on McKenzie & Watson 2016; https://journals.sub.uni-hamburg.de/aethiopica/article/view/1089 | supports
  - ch79 | Ezana replaced crescent with cross | https://www.metmuseum.org/essays/foundations-of-aksumite-civilization-and-its-christian-legacy-1st-7th-century | supports
  - ch79 | Ethiopian canon "81 books" | search: Cowley, Ostkirchliche Studien 23 (1974) 318–323 | supports
  - ch80 | Aga Khan V, 50th Imam, 4 Feb 2025 | https://www.iis.ac.uk/about-us/ismaili-imamat/his-highness-prince-rahim-aga-khan-v/ | supports
  - ch80 | ta'zīye inscribed 2010 | https://ich.unesco.org/en/decisions/5.COM/6.21 | supports
  - ch81 | Phagpa National Preceptor 1260 | https://treasuryoflives.org/biographies/view/Pakpa-Lodro-Gyeltsen | supports
  - ch81 | Balogh, contemporary shamanisms | https://doi.org/10.1080/14631361003779489 (tandfonline record) | supports
  - ch66 | Sesana ruling, 13 Dec 2006 | https://www.informea.org/en/court-decision/roy-sesana-v-attorney-general-republic-botswana | supports
  - ch66 | Apollo 11 painted slabs | search: Wendt, SAAB 31 (1976) | supports
  - ch67 | Ring of Nestor doubted | https://journals.librarypublishing.arizona.edu/jaei/article/id/960 | supports
  - ch67 | Horns of consecration | search: Diamant & Rutter, Anatolian Studies 19 (1969) 147–177 | supports
  - ch69 | Heliodorus pillar inscriptions | https://journal-vniispk.ru/0321-0391/article/view/277366 | supports
  - ch69 | Ram's Bridge, both views | https://sapiens.org/archaeology/rams-bridge-god-or-geology | supports
  - ch75 | Sámi drums | https://doi.org/10.30674/scripta.67195 | supports
  - ch76 | Cascajal critique | search: Bruhns & Kelker, Science 315 (2007) 1365 | supports
  - ch77 | Pyrgi tablets | https://publicera.kb.se/opuscula/article/view/62853 | supports
  - ch78 | Ice Maiden, 1993 | search: Polosmak, Ancient Civilizations from Scythia to Siberia (1999) | supports
  - ch82 | Ibadat Khana | search: Rezavi, Studies in History (2008) | supports

Other notes
  - The branches are one commit behind main (a wording fix to review-checks.js only). No
    conflict expected.
  - Several source logs still say "No sentence of the chapter was changed" above a later
    "Resolved 2026-10-05" note that records your edit. It reads oddly but is not wrong.

Needs your decision
  - ch70: Send the Taymāʾ sentence back for a correction that gives Naveh's mid-fifth-century
    date and Stein's ~380 BCE as separate datings, with a source for each? (It stays pending.)
  - ch71: Put ch71 back to pending until a source for the 1993 "Dangun tomb" claim is added?
  - ch77: Is "dated by some to the third century BCE" acceptable, or should a source be named
    for that dating too?
  - ch68: Replace the unconfirmed asor.org Strabo link with a known copy (for example Perseus)?
  - Batch-approve the 12 "would pass" chapters (ch66, 67, 68, 69, 72, 75, 76, 78, 79, 80, 81, 82)?
