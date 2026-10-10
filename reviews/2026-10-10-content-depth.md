PREVIOUS SCHEDULED RUNS FAILED TO PUSH: 2026-10-10 21:23 UTC and 21:32 UTC (routine had no repository access); this is a manual run with the repository attached.
16 passed, 0 fixed, 1 needs Carter.

NEEDS CARTER (1)
  - ch61: the Stolen Generations figure "Robert Manne estimated 20,000–25,000" has no source in the chapter or its log. Also, this section is about Uluṟu, a restricted site, so it is yours to check anyway.

------------------------------------------------------------------------------------------------

Batch: content gaps list and the top 20 gaps filled in 17 chapters (PR #35, claude/content-depth)
Reviewed: 2026-10-10
Auto-pass: on ("baseline test batch review-test/2026-10 scored 9 of 9 (100%) ...", reviews/status.json)
Covers: claude/content-depth@997d7bb
Summary: 16 passed, 0 fixed, 1 needs you.

Automatic checks (base origin/main@91abd1f)
  - review-checks.js --build: 8 checks pass. The build output matches what is committed, and the build
    left no changed or untracked files.
  - pending-diff: all 17 changed chapters are set back to pending: true (ch02, ch08, ch11, ch12, ch19, ch20,
    ch21, ch44, ch47, ch50, ch51, ch52, ch53, ch60, ch61, ch69, ch74). Their banners show.
  - WARN wikipedia-share: 9 of 17 logs are over 20%: ch08 22%, ch11 25%, ch19 21%, ch21 33%, ch44 42%,
    ch50 27%, ch51 29%, ch52 33%, ch53 23%. These are older pointers. None of the new sections cites Wikipedia.
  - All 15 tools/verify-*.js pass.
  - GitHub Actions on 997d7bb: checks, guard, verify, runtime and links are green. Lighthouse was still
    running when I checked.

PASSED   (16)
  - ch02: the Opening of the Mouth, Opet, the Apis bull and the animal mummies. Commit 997d7bb rightly drops the
    unconfirmed "64 Apis bulls" figure. Opet: 11 days under Thutmose III is right. "24 or more under Ramesses III"
    fits the sources, which say 24 at the start of his reign and 27 by its end.
  - ch08: the Homeric Hymns. Note: "found it in a barn outside Moscow" could not be checked. The cited LibreTexts
    page does not load from here. Scholarly sources say only "in Moscow, 1777", and the "stable" story appears
    only in informal sources. It's worth a look when you clear the chapter.
  - ch11: the councils and the first schism. The disputed causes and dates are flagged, not resolved.
  - ch12: Neo-Confucianism. Note: the chapter says the exams ended in 1905, which is right. One version of the
    cited SEP entry gives 1908.
  - ch19: the Seder, the prayer book and the Karaites. The symposium debate and the Karaite origins are flagged as
    contested.
  - ch20: Dunhuang. The rescue-or-plunder question is flagged as debated.
  - ch21: the Hajj, Ramadan, the Eids and the mosque plan. The mihrab claim is hedged ("is reported"), as the MIT
    source does. Text only, with no image of the Kaaba.
  - ch44: the Huarochirí Manuscript. The source dates differ (c. 1598 vs c. 1608), and the text gives the range.
  - ch47: Xibalba and Mictlan. The nine-level scheme is flagged as a later systematisation.
  - ch50: the Ghost Dance and Wounded Knee. The death toll is given as a range (146, above 153, possibly much
    higher).
  - ch51: Eid al-Adha. Isaac vs Ishmael is given as a split in the classical commentators, not resolved.
  - ch52: Paryuṣaṇa and Daśa Lakṣaṇa.
  - ch53: Lhasa. The opposed accounts of religious life today are flagged, and the archive takes no side.
  - ch60: the Ukrainian schism. Both canonical readings are given, and the outcome is called unclear.
  - ch69: tīrtha and the Kumbh Mela. Claims to Vedic antiquity are labelled devotion, not evidence.
  - ch74: the New Atheists, with their critics given comparable weight.
  - Across the batch: the new sections sit before each chapter's believer's lens, skeptical lens and evidence
    sections, which are unchanged. The tone is descriptive, with no "proof" language. plans/content-gaps.md is a
    document only.

FIXED    (0)

NEEDS CARTER (1)
  - ch61 (eras/01-prehistory/ch61-aboriginal-australian-dreaming-prehistory.md, "The Stolen Generations and the
    return of Uluṟu"):
    (a) The sentence "the historian Robert Manne estimated 20,000–25,000" has no source. The cited pages
        (indigenous.gov.au, NSW Health, NMA, Parks Australia) are official commemoration and park pages, and
        nothing shows they mention Manne. Search results do attribute the figure to Manne, but only secondhand.
        Adding a source is not mine to do (REVIEWER.md §5).
    (b) The section touches a restricted site (Uluṟu; REVIEWER.md §4.6). The text is exterior-only ("gives none of
        its restricted knowledge") and has no image. Would pass on that point.
    Otherwise the facts check out: 1910–1970, "one in three to one in ten", the 2008 apology, the 26 Oct 1985
    handback, the unanimous 2017 vote, and the 26 Oct 2019 closure.

Accuracy spot-checks (search results; most hosts cannot be fetched directly from this session, which is noted)
  - ch61 | Bringing Them Home: 1910–1970, one in three to one in ten | https://humanrights.gov.au/?a=69507 (search) | supports
  - ch61 | Manne 20,000–25,000 | not in the cited sources; secondhand in search results (moodle.pmaclism, quadrant.org.au) | no source cited
  - ch61 | 2017 unanimous vote; closed 26 Oct 2019, 34th anniversary of the 1985 handback | https://www.thenewdaily.com.au/travel/2017/11/01/uluru-climbs-banned (search); parksaustralia.gov.au (could not load) | supports
  - ch02 | Opet 11 days (Thutmose III), 24+ (Ramesses III) | nationalgeographic.com (could not load); https://www.ucl.ac.uk/museums-static/digitalegypt/ideology/festivaldates.html (search) | supports
  - ch02 | Catacombs of Anubis, about 8 million animals; Antiquity 89 (2015) | https://orca.cardiff.ac.uk/id/eprint/74282/ (could not load; search confirms the article and its press coverage) | supports
  - ch08 | the manuscript found 1777 by Matthaei "in a barn outside Moscow" | LibreTexts (could not load); https://nottingham-repository.worktribe.com/OutputFile/750986 (search: "in Moscow in 1777") | 1777/Moscow supported; "barn outside Moscow" not confirmed
  - ch11 | third council c. 250 BCE, Moggaliputta Tissa, Kathāvatthu | https://www.ebsco.com/research-starters/history/third-buddhist-council/ (search) | supports
  - ch12 | Four Books exams 1313–1905 | https://plato.stanford.edu/entries/zhu-xi/ (search) | supports (one SEP version says 1908)
  - ch19 | Seder Rav Amram sent to Barcelona | https://www.jewishvirtuallibrary.org/amram-gaon (search) | supports
  - ch20 | Mogao 492 shrines, UNESCO 1987; Diamond Sūtra 11 May 868 | https://whc.unesco.org/en/list/440/ ; idp.bl.uk (search) | supports (the IDP's 1994 founding was not confirmed by search, but is widely stated)
  - ch21 | Hajj 2024: 1,833,164 pilgrims, 1,611,310 (88%) from abroad | https://www.stats.gov.sa/documents/20117/2067030/Hajj+Statistics+Publication+2024EN.pdf/ee9e1b69-731b-9976-b394-e24ec4bf6f72 (search) | supports
  - ch21 | concave mihrab under al-Walid I, Medina, c. 706–709 | https://ocw.mit.edu/courses/4-614-religious-architecture-and-islamic-cultures-fall-2002/pages/lecture-notes/umayyad/ (search: "reportedly first introduced ... 707") | supports
  - ch44 | Huarochirí MS c. 1598–1608, Madrid, Quechua; Salomon & Urioste 1991 | https://utpress.utexas.edu/9780292730533/the-huarochiri-manuscript/ ; https://wellcomecollection.org/works/g2ybjsjn (search) | supports
  - ch47 | nine levels mainly from Codex Vaticanus A, which differs from the Florentine Codex | https://godsandmonsters.info/mictlan/ (search) | supports (a popular source, as the log says)
  - ch50 | Wovoka's vision at the 1 Jan 1889 eclipse | https://www.encyclopedia.com/people/history/north-american-indigenous-peoples-biographies/wovoka (search) | supports
  - ch50 | 146 dead (44 women, 18 children); 25 soldiers | EBSCO (not found by search); https://www.history.com/articles/wounded-knee-massacre-facts ; https://www.britannica.com/place/Wounded-Knee (search) | supports (Britannica gives at least 28 soldiers)
  - ch53 | Potala begun 1645, White Palace 1648, Red Palace 1694; UNESCO 1994/2000/2001 | https://www.britannica.com/topic/Potala-Palace ; https://whc.unesco.org/en/list/707/ (search) | supports
  - ch60 | Minsk synod 15 Oct 2018; council 15 Dec 2018; tomos 5/6 Jan 2019 | https://risu.org.ua/en/index/all_news/confessional/orthodox_relations/73060/ (search) | supports (search confirms the 6 Jan handover; the 5 Jan signing is the standard account)
  - ch60 | Rada law, 20 Aug 2024 | https://pravda.com.ua/eng/news/2024/08/20/7471107 (search) | supports
  - ch69 | Kumbh Mela inscribed 2017, "largest peaceful congregation of pilgrims" | https://ich.unesco.org/en/decisions/12.COM/11.B.12 (search) | supports
  - ch74 | Gary Wolf, Wired, Nov 2006, the name "New Atheism", the quote | https://en.wikipedia.org/wiki/New_Atheism ; https://pmchurch.org/node/606 (search) | supports

Needs your decision
  - ch61: should the build session find and cite a source for Manne's 20,000–25,000 estimate, or remove the
    figure? And are you happy with how the Uluṟu passage handles the restricted site? (yes/no)
  - Merging PR #35 to main is your call. CI is green except Lighthouse, which was still running.
