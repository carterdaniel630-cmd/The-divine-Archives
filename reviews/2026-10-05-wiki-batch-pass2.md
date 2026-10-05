Batch: Wikipedia-replacement sources batch, pass 2 (PRs #30, #31, #32, #33; re-edits on #26, #20, #21)
Reviewed: 2026-10-05
Auto-pass: SUSPENDED ("no baseline test batch yet", reviews/status.json)
Covers: claude/wiki-ch72@8ac0309
Covers: claude/wiki-ch73@5076df4
Covers: claude/wiki-ch74@b4bd8f0
Covers: claude/wiki-ch83@421b1af
Covers: claude/wiki-ch70@0f277ea   (only the Taymāʾ re-edit, commit 0f277ea)
Covers: claude/wiki-ch77@07ad3a3   (only the Liber Linteus re-edit, commit 07ad3a3)
Covers: claude/wiki-ch68@47217b7   (only the Strabo link re-edits, commits b8b4c9b and 47217b7)
Summary: 0 passed, 0 fixed, 7 need you (auto-pass is off).
         Of the 7: 6 would pass, 1 needs your decision (ch70).
         Two known open items you are already deciding are flagged correctly (ch73, ch83).

Automatic checks: all pass on all 7 branch heads. No failures.
  - review-checks.js --base origin/main --build: links, garbled links, file size,
    sitemap, pending banners, pending status, Wikipedia share and build output
    all PASS. The build left no changed or new files.
  - All 14 verify-*.js game checks pass on every branch.
  - WARN ch72, ch73, ch74: "sources only, so it stays cleared". Right: these three
    are cleared on main, and only their Sources lists and logs changed.
    (On ch72 the summary line still says "1 Pantheon figure changed"; that is the
    branch's older copy of the tool. No figure changed.)
  - Pending flags: none changed in this pass. ch83 and ch77 are pending on main
    and stay pending; ch70 and ch68 stay pending (your earlier ruling);
    ch72, ch73, ch74 stay cleared.

How the sources were checked
  - Publisher, journal, museum and archive sites are still blocked from this session
    (direct reading and web fetch both fail). Every check below is a search-result
    confirmation: author, title, venue, year and, where it matters, what the work says.
  - Sampled: 20 new sources searched one by one, chosen as every source behind a
    date or number, every source tied to an open item, and the least-known ones.
  - The rest are standard, widely cited works (for example Burr 2001, Douie 1932,
    Hudson 1988, Fudge 2010, Vovelle 1991, Arnstein 1965, Berger 1999, Boyer 2001,
    Fine 2003, Nadler 1997, Stern 2013, Green 1979, Biale et al. 2018, Babb 1986,
    Jaffrelot 2007, Bryant & Ekstrand 2004). I recognised them and checked that each
    fits the claim it is attached to, but did not search each one.
  - No source was found that does not exist. No source was found that fails its claim.

Only the expected lines changed
  - ch72, ch73, ch74, ch83: only the Sources section, the source log and the rebuilt
    pages changed. No sentence of the chapter body changed.
  - ch70: exactly one body sentence (Gods of the north, the Taymāʾ stele) plus its
    Sources line and log.
  - ch77: exactly one body sentence (The linen book) plus its Sources line and log.
  - ch68: no body sentence; two source links in the Sources list and log.

Wikipedia share, after (matches each PR title)
  ch72 24% → 3% (one pointer left, for Otto Rahn's SS membership)
  ch73 50% → 0%   ch74 28% → 0%
  ch83 25% → 2% (one pointer left, for the Fales–Markovsky critique)

PASSED   (0)
  (none: auto-pass is suspended)

FIXED    (0)
  (none: nothing needed a mechanical fix)

NEEDS CARTER (7)
  - ch72 (#30): would pass. The six new replacements are real and fit their claims:
    Peters (1980) does contain Ad abolendam in translation (doc. 29, p. 170); the
    UNESCO Tentative List entry 6245 exists (submitted 21 April 2017) and describes
    the "Cathar castles" as 13th-century fortresses defending Carcassonne, which is
    what the chapter says; Rahn's book is the right source for his own Grail claim
    (German original 1933, matches "published in the 1930s"). One Wikipedia pointer
    kept, clearly labelled, for Rahn's SS membership.
  - ch73 (#31): would pass. All 21 Wikipedia links replaced; sampled sources real and
    on topic. Known open item, flagged accurately: the first sentence says Glückel
    married "in the 1640s and 1650s"; the log's flag says she was born 1646/47 and
    married at about fourteen, around 1660, and offers a correction. That matches the
    standard account. Not resolved by me. The log's two other minor notes (Sabbatai's
    1648 self-revelation; Stampfer's casualty estimate) are accurate and need no change.
  - ch74 (#32): would pass. All 9 Wikipedia links replaced. The log asked for the
    "5.5 million members" figure to be checked against Peris: search results report
    that, per Peris, the League of the Militant Godless had 5.5 million members by
    1932 "on paper", which supports the chapter's "claimed 5.5 million".
  - ch83 (#33): would pass. 13 of 14 Wikipedia links replaced; sampled sources real.
    Known open item, flagged accurately: the chapter says the 29 January 2025 crush
    "killed at least 30 people by the official count". Search results on The Wire
    (19 Feb 2025) confirm the Chief Minister told the UP Assembly 30 died at the Sangam
    and 7 in a second incident that day, 37 in all; the South First report (June 2025)
    gives the BBC's at least 82 against the official 37. The log's flag says exactly
    this. Not resolved by me. The two minor notes (175 vs 177 co-sponsors; 217 vs 225
    Fatel Razack passengers) are fairly stated.
  - ch70 (#26, commit 0f277ea): NEEDS YOUR DECISION. The scholar mix-up from pass 1 is
    fixed: the sentence now gives the Louvre's fifth-century date with Naveh (1970)
    for the mid-fifth century, and Stein (2013) for about 380 BCE (Artaxerxes II),
    choosing neither. That matches what pass 1 found in search results quoting the
    Louvre record. But the earlier third dating, "often placed in Nabonidus's century"
    (sixth century BCE), was removed, not given a source. The log says why: no study
    giving that date could be confirmed (it mentions a possible 2023 article redating
    the stele to about 500 BCE, not cited). Dropping a dating changes what the sentence
    says, and you had asked for both datings with their sources, so this is yours to
    accept. Also: the Louvre record's exact web address (ark …cl010120341) did not show
    up in search, so that link is unconfirmed (the record itself, AO 1505, is real).
  - ch77 (#20, commit 07ad3a3): would pass. The third-century dating now names its
    source: Housley, Srdoč and Horvatinčić, Radiocarbon 31(3) 1989, 970–975. Search
    results confirm the article and its abstract: most probable age of the linen
    about 360–210 cal BC, making the 3rd-century date the most likely. The sentence
    says exactly that. Van der Meer (2007) unchanged. Nothing else changed.
  - ch68 (#21, commits b8b4c9b, 47217b7): would pass. The unconfirmed asor.org link was
    replaced by LacusCurtius (Jones's Loeb translation) and Perseus (Hamilton &
    Falconer, text 1999.01.0239, 17.1.54), both well-known editions of Strabo. The
    exact pages could not be opened or found by search, so they are not confirmed
    page by page. The %2A fix is correct: it encodes the bare asterisk in the two
    LacusCurtius addresses, which is the same page. Note: the old asor.org PDF
    ("Strabo Geography Vol8 17.1.54") did appear in search results this time, so it
    seems to exist after all; the replacement is still fine.

Accuracy spot-checks (search-result confirmation; no page could be opened)
  - ch72 | Ad abolendam (1184) | Peters, Heresy and Authority (1980), doc. 29 p. 170, per search of book contents | supports
  - ch72 | "Cathar castles" are 13th-c. royal fortresses | https://whc.unesco.org/en/tentativelists/6245/ | supports
  - ch72 | Rahn, Crusade Against the Grail, 1930s | Inner Traditions 2006 ed. of Kreuzzug gegen den Gral (1933) | supports
  - ch73 | Uman pilgrims, tens of thousands | https://euromaidanpress.com/2025/09/24/35000-hasidic-pilgrims-mark-jewish-new-year-in-uman-with-prayer-and-symbolic-rituals/ | supports (35,000)
  - ch73 | 1648 casualties debated, thousands to tens of thousands | Stampfer, Jewish History 17.2 (2003) 207–227 | supports (at most half of ~40,000)
  - ch73 | Dönme | https://researchonline.lse.ac.uk/id/eprint/53133 (Baer, Stanford 2010) | supports
  - ch73 | Glückel married "1640s and 1650s" | JWA and the log's reading of the memoirs | open item, flagged correctly
  - ch74 | d'Holbach, System of Nature, 1770, false name | https://gutenberg.org/cache/epub/8909/pg8909-images.html (published under Mirabaud) | supports
  - ch74 | League of Militant Godless claimed 5.5 million | Peris, Storming the Heavens (Cornell 1998) | supports
  - ch74 | Sunday Assembly, 2013 | https://eprints.kingston.ac.uk/41775 (Bullock thesis, 2018) | supports
  - ch74 | Sunday Assembly study | Schmoll, Journal of Sociology and Christianity 11.1 (2021) | supports (year not given in the log; not a fault)
  - ch83 | 1984 salmonella attack, 751 cases | Török et al., JAMA 278.5 (1997) 389–395, CDC copy | supports
  - ch83 | 2025 Kumbh, official toll | https://thewire.in/politics/people-said-dont-do-post-mortem-yogi-addresses-maha-kumbh-stampedes-at-up-assembly | supports the flag (30 + 7 = 37)
  - ch83 | 2025 Kumbh, BBC at least 82 | https://thesouthfirst.com/news/maha-kumbh-stampede-bbc-report-claims-at-least-82-dead-against-official-count-of-37/ | supports the flag
  - ch83 | Secret Swami (BBC, 2004) | https://www.thetvdb.com/series/this-world/episodes/4870889 (aired 17 June 2004) | supports
  - ch70 | Taymāʾ stele: Louvre 5th c. / Naveh 1970 mid-5th c. / Stein 2013 ~380 BCE | pass-1 search quotes of Louvre AO 1505; https://collections.louvre.fr/en/ark:/53355/cl010120341 not found by search | supports; link unconfirmed
  - ch77 | Liber Linteus radiocarbon ~360–210 cal BC | https://www.cambridge.org/core/journals/radiocarbon/article/ams-and-radiometric-dating-of-an-etruscan-linen-book-and-associated-mummy/6E6A6D2D3820FCC6253A82DD90CFA74D | supports
  - ch68 | Strabo 17.1.54 on Candace and Petronius | https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Strabo/17A3%2A.html ; Perseus 1999.01.0239 | could not load (blocked); editions real, passage real

Other notes
  - ch74: the chapter calls Barrett's idea "hyperactive agency detection". Barrett's own
    term is usually "hypersensitive (or hyperactive) agency detection device"; both
    wordings are in use. No change needed.
  - Several logs still carry "No sentence of the chapter was changed", which is true
    for ch72, ch73, ch74 and ch83 in this pass.

Needs your decision
  - ch70: Accept the Taymāʾ sentence with the "Nabonidus's century" dating dropped
    (two attributed datings left), or send it back to find a source for a sixth-century
    dating? (It stays pending either way.)
  - ch73: Correct Glückel's marriage to "around 1660" as the log suggests? (Known item.)
  - ch83: Update the Kumbh toll to "37 by the official count; a BBC investigation found
    at least 82"? (Known item.)
  - Batch-approve the would-pass items: ch72, ch73 (sources), ch74, ch83 (sources),
    ch77 re-edit, ch68 re-edit?
