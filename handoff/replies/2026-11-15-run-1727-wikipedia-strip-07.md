# Loop run 2026-11-15 17:27 UTC — Wikipedia strip, part 6 (era 07, High Medieval)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11), split by era. Part 6 covers the twelve chapters of era 07.
**Item:** STATUS 0eo (2). Item (1), merging #153, was not ready: Lighthouse on `2d3450cb` was still running when this run started (17:27 UTC) and when it ended (17:31 UTC; started 17:19). This run therefore took the next item.
**Branch:** `loop/wikipedia-strip-07` **`ce8f3575`**, one commit on `main` `30f6de4b` (fast-forwards). **PR #154** opened (Carter's "a").
**Session:** ..01HFWzTsBp7DzsRa. It built #154 and must not review it. It wrote none of #153.

**Correction (run 17:32 UTC, same session):** the link count is **36**, not 37. ch26 has 8 Wikipedia links; its Notarikon/Temurah entry named the articles without a link. The commit `ce8f3575` message still says 37. The PR #154 body is corrected.

## In plain words
36 Wikipedia links are gone from the Sources lists of eleven High Medieval chapters. Counted by article, that is 43 citations, because some links named two articles and two named articles had no link of their own. The twelfth chapter (ch81 Tengri) had none. Nothing outside the Sources lists changed. Era 06 was hit harder. Here **ch26 Kabbalah and ch27 Sufism lose the most**: five whole bullets each, which leaves the Sefer Yetzirah, the Tree of Life, PaRDeS, Christian Kabbalah, the golem and all the Sufi orders without a source.

## Rule used (same as parts 3–5)
- Only the Wikipedia citation goes. The rest of the bullet is untouched, and the separator next to it goes with it (" ; ", "; ", " · ").
- **A bullet left naming no source is removed whole.** 22 bullets went this way.
- **Two disguised Wikipedia entries:** ch43 "Foundation of Tenochtitlan, reference overviews" and ch44 "'Inca religion' / 'Taki Unquy,' reference overviews". Each linked only to en.wikipedia.org. "Reference overviews" names no source, so both bullets were removed whole. (ch33 in era 08 has a "reference overviews" bullet that links to IEP, not Wikipedia. It is not touched by this order.)
- **One borderline keep, for the reviewer:** ch26 now reads "Zohar authorship: traditional (Shimon bar Yochai) vs. modern consensus (Moses de León / a circle, c. 1270–1330); Scholem." Scholem is a named scholar but no work is given. I kept it under the rule, as part 5 kept VikingRune. If the reviewer prefers, removing the whole bullet is a one-line change.
- ch72 Otto Rahn: the Wikipedia entry was marked "(pointer, for his SS membership: no stronger source confirmed)". The note went with the link. The bullet keeps Rahn's own book and the UNESCO entry. **The body text still says Rahn "later joined the SS"**, and that claim now has no source (flag 76). I did not change the prose (order item 2).
- No subsections in era 07 Sources, so none were emptied. No Sources section is left empty; the fewest left is ch56, with 4 items.

## Counts (the order's "diff summary per page")
| Chapter | Wikipedia citations removed (articles) | Links | Bullets removed whole | Source items left | wikipedia on built page, after |
|---|---|---|---|---|---|
| ch26 Kabbalah | 12 (Sefer Yetzirah, Zohar, Tree of life, Shekhinah, Lurianic Kabbalah, Sabbatai Zevi, Pardes, Notarikon, Temurah, Christian Kabbalah, Golem, Hasidei Ashkenaz) | 8 | 5 | 6 | 0 |
| ch27 Sufism | 5 (Junayd, Revival of the Religious Sciences, Mevlevi Order, Naqshbandi Order, Anti-Sufism) | 5 | 5 | 7 | 0 |
| ch28 Scholasticism | 6 (Incoherence of the Incoherence, Five Ways, Siger of Brabant, Double truth, Ars combinatoria, Medieval Exegesis) | 5 | 4 | 9 | 0 |
| ch29 Maya | 4 (Maya Hero Twins, Bloodletting in Mesoamerica, Sacred Cenote, Diego de Landa) | 4 | 1 | 6 | 0 |
| ch30 Bhakti | 4 (Alvars, Chaitanya Mahaprabhu, Gaudiya Vaishnavism ×2) | 3 | 3 | 6 | 0 |
| ch43 Aztec | 2 (Florentine Codex, Tenochtitlan "reference overviews") | 2 | 1 | 8 | 0 |
| ch44 Inca | 6 (Inti, Pacha, Ceque system, Huaca, Children of Llullaillaco, Taki Unquy) | 5 | 3 | 7 | 0 |
| ch56 Mandaeans etc. | 1 (Mandaeism) | 1 | 0 | 4 | 0 |
| ch59 Slavic & Baltic | 1 (Romuva) | 1 | 0 | 6 | 0 |
| ch62 Native N. American | 1 (Southeastern Ceremonial Complex) | 1 | 0 | 6 | 0 |
| ch72 Cathars | 1 (Otto Rahn) | 1 | 0 | 13 | 0 |
| ch81 Tengri | 0 | 0 | 0 | 12 | 0 |
| **Total** | **43**, 11 pages touched | **36** | **22** (+16 trimmed) | | **0 on all 12 era 07 pages** |

## Sole-source flags (order item 5), for re-sourcing from the well
Judged from each chapter's own list; I did not open the remaining sources. The numbering continues the strip's running list (part 5 ended at 61).

**Claims that now have no source in their list:**
62. ch26: the Sefer Yetzirah, with its 10 sefirot + 22 letters = 32 paths.
63. ch26: the Tree of Life, the ten sefirot, the four worlds, the Shekhinah.
64. ch26: PaRDeS (peshat/remez/derash/sod).
65. ch26: notarikon and temurah. Gematria keeps Encyclopedia.com.
66. ch26: Christian Kabbalah (Pico 1486, Reuchlin 1517) and the Hermetic Qabalah.
67. ch26: the Hasidei Ashkenaz and the golem tradition ("231 gates").
68. ch27: Bistami vs. Junayd and the sobriety/intoxication typology.
69. ch27: al-Ghazali's *Deliverance from Error* and the *Ihya*.
70. ch27: Rumi, the Mathnawi, the Mevlevi order and the sema.
71. ch27: the orders (Qadiriyya, Chishtiyya, Naqshbandiyya and its silent dhikr).
72. ch27: anti-Sufism, the Wahhabi/Salafi condemnation of tomb-veneration as bid'a. *Contested and sensitive; re-source with care.*
73. ch28: Aquinas's Five Ways; Siger of Brabant and the "double truth"; Llull's *Ars combinatoria*; the four senses of Scripture.
74. ch29: Diego de Landa and the 1562 burning of the codices (four survive).
75. ch30: the Alvars and Nayanars; Chaitanya and Gaudiya Vaishnavism; the Bhagavata Purana, Gita Govinda and madhurya-rasa.
76. ch72: **Otto Rahn's SS membership**. It is stated in the body text, and its only source was the Wikipedia pointer. *Claim about a real person; priority.*
77. ch43: the founding of Tenochtitlan (c. 1325, eagle and cactus).
78. ch44: the three pachas (Hanan, Kay, Uku); the huacas; the extirpation of idolatries and the Taki Onqoy movement.

**Thinner, but still sourced:** ch26 the Zohar (Scholem named, no work; see above), Luria (Britannica, My Jewish Learning), Sabbatai Zevi (My Jewish Learning, no link); ch28 the Incoherence debate (SEP al-Ghazali); ch29 the Hero Twins (EBSCO), bloodletting (Mayan.org), Sacred Cenote (The Met); ch43 the Florentine Codex (Britannica); ch44 Inti (Britannica Inca religion), the ceque system (Bauer), Llullaillaco (PNAS); ch56 Mandaeism (a Medium post only: weak, worth re-sourcing); ch59 Romuva (Euronews); ch62 the SECC (Britannica Cahokia covers the site, not the SECC by name).

**Prose mentions left standing (order item 2):** none. No era 07 body text names Wikipedia.

## Checks (all on `ce8f3575`)
- Before editing, the Sources blocks in `content/chapters.js` for all twelve era 07 chapters matched `tools/md-to-chapter.js` output from `main`'s markdown. After editing, all twelve still match. In `chapters.js`, only `<li>` lines changed: 16 replaced and 22 removed.
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): the only files that changed are the 11 chapter pages, `content/dates.json` and `docs/sitemap.xml`. All committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn**.
- verify 18/18; `node --test framework/test/*.test.js` 51/51.
- Crawl evidence: 0 Wikipedia anchors and 0 "wikipedia" in the page text on all 12 era 07 built pages.
- Headless Chromium at 360 and 390 px, 12 pages × 2 widths: standards mode, 0 script errors, no sideways overflow, 0 list items ending on "—", ";", ",", "in" or "and", and no empty lists.
- The graphify CLI is not installed in this session. The change touches only content (no code), so no map query was needed.

## Merge
Not merged. **Per item** on Carter's strip yes (`decisions-2026-11-15-carter-a-prs-yes-wikipedia.md` 2). Still missing:
- an **independent review** by a session other than ..01HFWzTsBp7DzsRa (diff `30f6de4b..ce8f3575`; check the 43 removals, the 22 whole-bullet removals, the Scholem keep, flags 62–78);
- GitHub green incl. Lighthouse;
- after #153 merges, a re-sync of the generated `content/dates.json` and `docs/sitemap.xml` (or stack per LOOP.md).

## #153 at this run
Lighthouse on `2d3450cb` was still in progress at 17:31 UTC (started 17:19); the other 9 checks are green. Not merged.
