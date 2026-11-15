# Loop run 2026-11-15 17:32 UTC — Wikipedia strip, part 7 (era 08, Early Modern)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11), split by era. Part 7 covers the eight chapters of era 08.
**Item:** STATUS 0ep (3). Item (1), merging #153, was not ready: Lighthouse on `2d3450cb` was still running at 17:32 and at 17:35 UTC (started 17:19). Item (2), the #154 review, cannot be done by this session because it built #154.
**Branch:** `loop/wikipedia-strip-08` **`b80d7568`**, one commit on `main` `30f6de4b` (fast-forwards). **PR #155** opened (Carter's "a").
**Session:** ..01HFWzTsBp7DzsRa. It built #154 and #155 and must review neither. It wrote none of #153.

## In plain words
27 Wikipedia links are gone from the Sources lists of six Early Modern chapters. Counted by article, that is 31 citations. Two chapters (ch73 Sabbateans/Hasidism, ch84 Yoruba) had none. Nothing outside the Sources lists changed. **ch33 African traditional religion goes from 11 items to 5, and ch32 witch trials from 10 to 5.** Some of the chapters' most carefully debunked claims, the Dogon/Sirius story, the Murray "witch-cult" thesis and the "nine million" toll, now have no source of their own. They belong near the front of the re-sourcing queue.

**Count note:** the commit message says 29 links / 34 citations. That was a miscount. The figures here were checked by counting `wikipedia.org/wiki/` URLs in `main`'s markdown. The same check found part 6 had 36 links, not 37; that reply and PR #154 are corrected.

## Rule used (same as parts 5–6)
- Only the Wikipedia citation goes, with its separator. Text before the dash is the bullet's topic, not a source, so **a bullet whose only citation after the dash was Wikipedia is removed whole.** 16 bullets went this way, including ones whose topic names a primary work (ch32 *Malleus Maleficarum*, *Daemonologie*, Ginzburg's *Night Battles*; ch33 Evans-Pritchard's *Nuer Religion*, Mbiti's *African Religions and Philosophy*). Those works are named in the flags below.
- **Kept:** ch33 "Azande witchcraft … — E. E. Evans-Pritchard, *Witchcraft, Oracles and Magic Among the Azande* (1937)." The book is the named source, but its link went to the Wikipedia article about the book. The link went and the book stays as plain text.
- **Disguised entry:** ch32 "The debunked Murray 'witch-cult' thesis … — general historiography, 'Witch trials in the early modern period.'" linked only to en.wikipedia.org. It was removed whole. (ch33's "African diaspora religions, reference overviews" bullet links to IEP and is untouched.)
- ch82: "Goindwal," Wikipedia "(pointer: no stronger source confirmed for the tradition)" went, note and all. The bullet keeps the Sikh Missionary Society, *The Guru's Way*.
- No era 08 Sources subsection was emptied (ch84 has subheads but no Wikipedia), and no Sources section is empty; the fewest left is 5 (ch32, ch33, ch34, ch63).

## Counts (the order's "diff summary per page")
| Chapter | Wikipedia citations removed (articles) | Links | Bullets removed whole | Source items left | wikipedia on built page, after |
|---|---|---|---|---|---|
| ch31 Reformation | 3 (Marburg Colloquy, Reformation iconoclasm, Jan Hus) | 3 | 2 | 10 | 0 |
| ch32 Witch trials | 6 (Malleus Maleficarum, Bamberg witch trials, Johannes Junius, North Berwick witch trials, The Night Battles, Witch trials in the early modern period) | 6 | 5 | 5 | 0 |
| ch33 African traditional religion | 14 (Yoruba religion, Ifá ×2, Oduduwa, Golden Stool, Okomfo Anokye, Kongo cosmogram, Nkisi, Nommo, The Nuer, John Mbiti, Adinkra symbols, Nsibidi, Witchcraft Oracles and Magic Among the Azande) | 11 | 6 | 5 | 0 |
| ch34 Sikhism | 5 (Guru Granth Sahib, Mul Mantar, Panj Pyare, Five thieves, Haumai) | 4 | 2 | 5 | 0 |
| ch63 Oceania | 2 (Tangaroa, Makemake) | 2 | 1 | 5 | 0 |
| ch82 Akbar | 1 (Goindwal) | 1 | 0 | 16 | 0 |
| ch73, ch84 | 0 | 0 | 0 | 15, 14 | 0 |
| **Total** | **31**, 6 pages touched | **27** | **16** (+7 trimmed) | | **0 on all 8 era 08 pages** |

## Sole-source flags (order item 5), for re-sourcing from the well
Judged from each chapter's own list; I did not open the remaining sources. The numbering continues from part 6, which ended at 78.

**Claims that now have no source in their list:**
79. ch31: the Marburg Colloquy (1529) and the Luther–Zwingli Eucharist split.
80. ch31: Reformation iconoclasm (the Beeldenstorm).
81. ch31: Jan Hus, Constance, 1415. Wycliffe keeps World History Encyclopedia.
82. ch32: the *Malleus Maleficarum*, *Summis desiderantes*, and the claim that it was "not officially authorized". *Contested detail; priority.*
83. ch32: the Bamberg trials and the Junius letter (1628).
84. ch32: the North Berwick trials, James VI, *Daemonologie*.
85. ch32: the benandanti (Ginzburg, *The Night Battles*).
86. ch32: **the debunked Murray thesis and the mythical "nine million"**. *A debunking claim with no source; priority.*
87. ch33: Ile-Ife and Oduduwa as the mythic origin.
88. ch33: Kongo religion, the cosmogram (dikenga), minkisi and the nkisi nkondi. *Sacred objects; re-source with care.*
89. ch33: **the Dogon and the Sirius controversy** (Griaule/Dieterlen, Temple, van Beek's refutation). *Contested; priority.*
90. ch33: the Nuer and Kwoth (Evans-Pritchard, *Nuer Religion*).
91. ch33: the "African traditional religion" category, Mbiti, and p'Bitek's critique.
92. ch33: Ifá's 256 odu and its UNESCO recognition; Adinkra and Nsibidi as sacred encodings.
93. ch34: the Guru Granth Sahib (1,430 angs, 31 ragas, Mul Mantar, Japji, bhagat bani). *Scripture; re-source with care.*
94. ch34: Waheguru, hukam, haumai and the five thieves.
95. ch63: Tangaroa/Kanaloa.

**Thinner, but still sourced:** ch33 Yoruba religion and Ifá (Mythopedia only: weak), the Golden Stool and Okomfo Anokye (BlackPast), Azande (Evans-Pritchard named, no link); ch34 the Panj Pyare (Britannica "Khalsa"); ch63 Makemake and the birdman cult (Smarthistory covers the moai; Makemake not checked); ch82 the Goindwal tradition (Sikh Missionary Society only).

**Prose mentions left standing (order item 2):** none. No era 08 body text names Wikipedia.

## Checks (all on `b80d7568`)
- Before editing, the Sources blocks in `content/chapters.js` for all eight era 08 chapters matched `tools/md-to-chapter.js` output from `main`'s markdown. After editing, all eight still match. In `chapters.js`, only `<li>` lines changed: 7 replaced and 16 removed.
- Full build order: the only files that changed are the 6 chapter pages, `content/dates.json` and `docs/sitemap.xml`. All committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn**. verify 18/18; tests 51/51.
- Crawl evidence: 0 Wikipedia anchors and 0 "wikipedia" in the page text on all 8 era 08 built pages.
- Headless Chromium at 360 and 390 px, 8 pages × 2 widths: standards mode, 0 script errors, no sideways overflow, no dangling list items. ch84 shows one empty `<ul>`: this is the known converter artefact before the first subhead (noted in part 3), already on `main`, on a page this PR does not touch.

## Merge
Not merged. **Per item** on Carter's strip yes. Still missing:
- an **independent review** by a session other than ..01HFWzTsBp7DzsRa (diff `30f6de4b..b80d7568`);
- GitHub green incl. Lighthouse;
- re-sync of the generated files after #153 and #154 merge (or stack #153 → #154 → #155 per LOOP.md).

## #153 at this run
Lighthouse on `2d3450cb` was still in progress at 17:35 UTC (16 minutes; started 17:19). The other 9 checks are green. Not merged. If it is still running past ~18:00 UTC, the next run should open the job log and re-run it rather than assume.
