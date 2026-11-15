# Loop run 2026-11-15 16:33 UTC — Wikipedia strip, part 4 (era 05, Late Antiquity)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11), split by era. Part 4: the nine chapters of era 05.
**Item:** STATUS 0ej (2). Item (1), the #151 merge, was not ready: Lighthouse on `73073027` was still running at 16:34 UTC, so per LOOP.md step 3 this run did not wait and took the next item.
**Branch:** `loop/wikipedia-strip-05` **`f7935176`**, one commit on `main` `0c807f9c` (fast-forwards). **PR #152** opened (Carter's "a", `decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`).
**Session:** ..01HFWzTpAKV5PowLJFt5hPFh (builder; must not review its own work).

## In plain words
Twenty-six Wikipedia links are gone from the source lists of seven Late Antiquity chapters. The other two chapters in the era (ch45 Pistis Sophia, ch79 First Christian Kingdoms) had none. Nothing outside the Sources lists changed. Several claims are now left without a source of their own; they are listed below for re-sourcing.

**Correction:** the commit message says "29 entries". That count is wrong; the correct number is **26** (counted from the diff: 26 Wikipedia anchors removed, 0 added). The commit was not rewritten; PR #152 and this reply carry the right number.

## Rule used (same as parts 1–3; the part 3 reviewer agreed the whole-bullet rule)
- Only the Wikipedia entry goes. Names of primary texts stay as plain text: ch18 "Apuleius, *The Golden Ass* Book XI" (was "(and Apuleius, …)" after the Isis link; same shape as part 3's ch13 *Senatus consultum*); ch20 "on Indra's Net, the Avatamsaka Sutra".
- Where the link text was only a topic label, the label went with it: ch17 "on the later Emerald Tablet, [Wikipedia]"; ch18 "on the evidence problem and the origin debate, [Parallelomania]"; ch19 "the figurative frescoes of the [Dura-Europos synagogue]" (that link pointed at wikipedia.org with no "Wikipedia:" label).
- **A bullet left naming no source at all was removed whole:** ch16 Junia and Phoebe; ch17 Abraxas; ch18 dying-and-rising god; ch19 Sefer Yetzirah / Merkabah ("standard reference overviews" names no work, so it was treated as no source); ch55 Manichaean scripture; ch70 the moon-god claim (its only remaining text was a pointer note about the Wikipedia link itself plus a cross-reference to Al-Jallad and Sidky, already cited in full higher in the same list).
- Bullets that still name a scholar were kept: ch20 "The Mahayana 'cult of the book' (Schopen) and sutra-copying merit." (part 3 precedent: ch14 Brunaux).
- **Empty subsections removed (order item 4):** ch17 "Sacred encoding — Abraxas and the numbered cosmos"; ch18 "The 'dying and rising god' and the parallels debate". No Sources section left empty.
- One awkward join for the reviewer: ch18 now reads "Julian's revival and the anti-pagan laws — on the end of Eleusis (c. 396 CE), World History Encyclopedia: Eleusis." No words were added; if the reviewer prefers, the Julian/Theodosius part could be dropped from the lead, a one-line change.

## Counts (order's "diff summary per page")
| Chapter | Wikipedia entries removed | wikipedia.org links on built page, after |
|---|---|---|
| ch16 Early Christianity | 6 (Sources for the historicity of Jesus, Junia, Phoebe, Passion of Perpetua and Felicity, Dies natalis, Ichthys) | 0 |
| ch17 Gnosticism | 4 (Nag Hammadi library, Gospel of Philip, Emerald Tablet, Abraxas) | 0 |
| ch18 Roman Mystery Cults | 5 (Parallelomania, Mysteries of Isis, Dying-and-rising god, Sol Invictus, Persecution of pagans under Theodosius I) | 0 |
| ch19 Rabbinic Judaism | 6 (Oral Torah, Judah ha-Nasi, Not in Heaven, Beth Alpha, Dura-Europos synagogue, Sefer Yetzirah) | 0 |
| ch20 Mahayana Buddhism | 2 (Indra's net, Sutra copying) | 0 |
| ch55 Manichaeism | 2 (Manichaean scripture, Cologne Mani-Codex) | 0 |
| ch70 Pre-Islamic Arabia | 1 (Allah as a lunar deity) | 0 |
| ch45, ch79 | 0 (none there) | 0 |
| **Total** | **26**, 7 pages touched | **0 links on all 9 era 05 pages** |

Bullets removed whole: 6. Subsections removed: 2.

## Sole-source flags (order item 5), for re-sourcing from the well
Judged from each chapter's own list; I did not open the remaining sources to check what they cover. Numbering continues the strip's running list (part 3 ended at 12).

**Claim now has no source in its list:**
13. ch16: Junia and Phoebe (women in the early church).
14. ch16: the ichthys symbol (the bullet keeps the staurogram and 666/Nero sources).
15. ch17: the Nag Hammadi discovery itself (IEP Gnosticism may cover it; not checked).
16. ch17: the Gospel of Philip.
17. ch17: the Emerald Tablet.
18. ch17: Abraxas, the isopsephy of 365 and Basilides.
19. ch18: the evidence problem and origin debate of Mithraism ("parallelomania"); the seven grades and tauroctony were already only "standard reference overviews".
20. ch18: the mysteries of Isis (Apuleius as primary text only).
21. ch18: the "dying and rising god" category and the parallels debate. **Priority:** this is a contested-claim discussion, and CLAUDE.md asks contested claims to be flagged with sources.
22. ch18: Julian's revival and the Theodosian anti-pagan laws.
23. ch19: the Oral Torah and Judah ha-Nasi (Britannica Mishna probably covers Judah; not checked).
24. ch19: Beth Alpha and the Dura-Europos synagogue frescoes.
25. ch19: Sefer Yetzirah, Merkabah and Hekhalot mysticism, "the four who entered pardes".
26. ch20: Indra's Net (Avatamsaka Sutra as primary text only).
27. ch20: the "cult of the book" and sutra-copying merit (Schopen named, no work).
28. ch55: Mani's own scriptures (the seven treatises, the Shābuhragān) and the Āržang picture-book.
29. ch55: the Cologne Mani-Codex (the remaining Iranica source is on the Coptic texts; the Codex is Greek).
30. ch70: the 1990s "moon-god" polemic and its rejection (the name's derivation from *al-ilāh* stays covered by Al-Jallad and Sidky, cited above in the list). Religiously sensitive topic: re-source with care.

**Thinner, but still sourced:**
- ch16: the historical-Jesus sources (Britannica); Perpetua (Britannica); Polycarp and the *dies natalis* (Christian History Institute).
- ch18: Sol Invictus (Britannica); Cybele (Encyclopedia.com).
- ch19: the Oven of Akhnai (My Jewish Learning, Bava Metzia 59); the zodiac mosaics (My Jewish Learning).

## Prose mentions left standing (order item 2)
- **ch19 shows one on its live page:** the Sources section's closing note ("Researched from … Britannica, My Jewish Learning, Wikipedia's sourced overviews, and …"). It is prose, not a list entry or a link, so it was left as the order says, and flagged here. Whether that note should change is Carter's call or a later wording fix.
- ch16 and ch17 have the same sentence in their markdown "Note on sourcing", but it is not on their live pages (their built Sources lists carry no note). Left as is.

## Checks (all on `f7935176`)
- Before editing, the Sources blocks in `content/chapters.js` for all nine era 05 chapters matched `tools/md-to-chapter.js` output from `main`'s markdown (ch16–ch18 differ only by the source note the converter would add and the live page does not carry; that note was kept off). After editing, all nine still match the converter. Only the Sources blocks changed.
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): only the 7 chapter pages, `content/dates.json` and `docs/sitemap.xml` change. Committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (expected "sources only, so it stays cleared").
- verify 18/18; `node --test framework/test/*.test.js` 51/51.
- Crawl evidence: 0 wikipedia.org links on all 9 era 05 built pages (the one text hit is the ch19 prose note above).
- Headless Chromium at 360 and 390, 7 pages × 2 widths: standards mode, 0 script errors, no sideways overflow, 0 Wikipedia anchors, 0 list items ending on "—", ";", ",", "in" or "and", no subhead without items. The one empty `<ul>` per subheaded list is the pre-existing converter artefact noted in part 3.
- graphify CLI not used: content only, no code touched.

## Merge
Not merged. **Per item** on Carter's strip yes. Still missing:
- an **independent review** by a session other than this one (..01HFWzTpAKV5PowLJFt5hPFh). Diff: `0c807f9c..f7935176`. Please check the 26 removals, the 6 whole-bullet removals, the 2 subsection removals, the ch18 Julian join, and flags 13–30;
- GitHub green incl. Lighthouse on PR #152.

**Overlap with #151:** both touch `content/chapters.js` (different chapters), `content/dates.json` and `docs/sitemap.xml`. Whichever merges second re-syncs those generated files (re-run stamp-dates and build-pages).

## #151 at this run
GitHub on `73073027`: 7 checks green, **Lighthouse in progress** at 16:34 UTC. Merge not attempted. The next run merges it per item once Lighthouse is green.
