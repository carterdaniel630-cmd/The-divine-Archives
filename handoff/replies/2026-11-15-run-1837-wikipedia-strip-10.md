# Loop run 2026-11-15 18:37 UTC — Wikipedia strip, part 9 (theme chapters ch01, ch47–ch51)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11). Item: STATUS 0ew (1).
**Branch:** `loop/wikipedia-strip-10` **`77a3d2ad`**, one commit on `main` `78a50014` (fast-forwards). **PR #157** opened (Carter's "a": the loop may open PRs for its own branches).
**Session:** ..01HFWzTnC46rbNLPpRHGbWk9. It built #157 and must not review it.

## In plain words
19 Wikipedia links are gone from the Sources lists of six theme chapters (The Flood, Underworld, Great Goddess, Sacred Kingship, End of Days, Sacrifice). Nothing outside the Sources lists changed, with one small exception in ch01's source notes, explained below. Five claims now have no source of their own and join the re-sourcing queue: Inanna's Descent, the Sapa Inca, the Zoroastrian end of the world (Frashokereti), the Mahdi, and the Greek pharmakos.

## Rule used (same as parts 5–8)
- Only the Wikipedia citation goes, with its separator. **A bullet whose only citation after the dash was Wikipedia is removed whole** (5 bullets: ch47 Inanna/Ereshkigal, ch49 Sapa Inca, ch50 Frashokereti, ch50 Mahdi, ch51 pharmakos).
- **Primary-text bullets keep the text's name.** ch01 "Ovid, *Metamorphoses* Bk. I (Deucalion); Plato, *Timaeus*. See [Wikipedia …]" became "Ovid, *Metamorphoses* Bk. I (Deucalion); Plato, *Timaeus*." The primary texts are themselves the cited sources, like "Genesis 6–9" in the same list (part 2 precedent).
- **ch01 Finkel replica entry:** the Wikipedia link went with its bracketed note (1985/2009, Alleppey 2014, "one-third scale", petrol pump, and the remark that the page follows the documentary). The page body already follows PBS NOVA ("a fifth", "a collection of pumps"); the 1985/2009 dates rest on the *Jewish Chronicle* entry, which quotes both; the Kerala build rests on NOVA, the Telegraph (India) and Channel 4.
- **ch01 Telegraph (India) note — reviewer, please judge:** "the text was read from a copy and is cited via the Wikipedia page;" became "the text was read from a copy;". The clause pointed at the link that is now gone; leaving it would keep "Wikipedia" in a Sources list with nothing behind it. This is a wording change inside the Sources list, not prose.
- No Sources subsection was emptied and no Sources section is empty. Fewest left: 5 (ch48, ch49).

## Counts (the order's "diff summary per page")
| Chapter | Wikipedia articles removed | Links | Bullets removed whole | Trimmed | Source items left | wikipedia anchors on built page, after |
|---|---|---|---|---|---|---|
| ch01 The Flood | 5 (Eridu Genesis, Ancient Greek flood myths, Finkel's replica of the Babylonian ark, Babyloniaca (Berossus), Black Sea deluge hypothesis) | 5 | 0 | 5 | 16 | 0 |
| ch47 Underworld | 2 (Descent of Inanna into the Underworld, Ereshkigal) | 2 | 1 | 0 | 6 | 0 |
| ch48 Great Goddess | 2 (Great Goddess hypothesis, Thealogy) | 2 | 0 | 2 | 5 | 0 |
| ch49 Sacred Kingship | 2 (Sacred king, Sapa Inca) | 2 | 1 | 1 | 5 | 0 |
| ch50 End of Days | 3 (Frashokereti, Apocalyptic literature, Mahdi) | 3 | 2 | 1 | 6 | 0 |
| ch51 Sacrifice | 5 (Korban, Azazel, Pharmakos, Human sacrifice in Aztec culture, René Girard) | 5 | 1 | 4 | 8 | 0 |
| **Total** | **19**, 6 pages touched | **19** | **5** | **13** | | **0 on all 6** |

(STATUS said "18 links": that counted lines; ch47's two links share one line.)

## Sole-source flags (order item 5), for re-sourcing from the well
Judged from each chapter's own list; the remaining sources were not opened. Numbering continues from part 8 (ended at 115).

**Claims that now have no source in their list:**
116. ch47: Inanna's Descent and the Descent of Ishtar: the seven gates, the stripping, death on the hook, Dumuzi as substitute, the "land of no return"; Ereshkigal. (The adjacent era 02 Mesopotamia chapter may cover it; its own flag from part 1, Descent of Inanna, is the same gap.)
117. ch49: the Sapa Inca as son of Inti, his divinity and mummified afterlife. (Britannica "Sacred kingship" in the same list names Peru; may cover part.)
118. ch50: Zoroastrian eschatology: the Saoshyant, resurrection, the ordeal of molten metal, Frashokereti. *Priority: the chapter's comparative claim rests on it.*
119. ch50: Islamic eschatology: the Mahdi, the return of Isa, the Dajjal. *Living tradition; re-source with care.*
120. ch51: the Greek pharmakos (human scapegoat ritual).

**Thinner, but still sourced:**
- ch01: Eridu Genesis (Livius only); Berossus (Livius only); Black Sea hypothesis (Science only); Ovid/Plato (primary texts named, no secondary).
- ch48: the Great Goddess hypothesis now rests on one Academia.edu review (plus ch48's bibliography and "Mother goddess" overview items); thealogy rests on a personal WordPress blog. *Weak; worth re-sourcing.*
- ch49: Frazer's sacred king rests on EBSCO's *Golden Bough* starter.
- ch50: comparative apocalyptic rests on one Substack post.
- ch51: korban rests on a Kenyon College student project page; Azazel on Britannica + TheTorah.com; Aztec sacrifice on Mexicolore only; Girard on one ResearchGate paper.

**Prose mentions left standing (order item 2):** **ch01, "The ark builder's manual":** "the *Jewish Chronicle* and Wikipedia say Finkel first saw it in 1985". Left as written (no prose edits under this order). The *Jewish Chronicle* still supports the 1985 date on its own. For Carter: a one-word prose fix would drop "and Wikipedia", but ch01 prose changes need his say (ch01's pending/re-clear question is still open).

## Checks (all on `77a3d2ad`)
- Before editing, each chapter's Sources block in `content/chapters.js` matched `tools/md-to-chapter.js` output from `main`'s markdown (ch01: once the `source-note` paragraph, which ch01's page does not carry, is set aside). Edited markdown converted with the same tool and swapped in. In `chapters.js`, only `<li>` lines changed: 13 replaced, 5 removed.
- Full build order (stamp-dates, build-og, build-vault, build-chapters, build-pages, build-museum, build-framework, build-entity-registry): only the 6 chapter pages, `content/dates.json` and `docs/sitemap.xml` changed. All committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (sources only, stays cleared). verify 18/18; tests 51/51.
- Crawl: 0 wikipedia.org anchors on all 6 built pages; the only "wikipedia" text left is ch01's prose mention above.
- Headless Chromium at 360 and 390 px, 6 pages × 2 widths: standards mode, 0 script errors, no sideways overflow, no empty list items, Sources lists present.
- The graphify CLI was not run in this session; no code was touched.

## Merge
Not merged. **Per item** on Carter's strip yes. Still missing:
- an **independent review** by a session other than ..01HFWzTnC46rbNLPpRHGbWk9 (diff `78a50014..77a3d2ad`; judge the ch01 Telegraph wording and the Ovid keep);
- GitHub green incl. Lighthouse on `77a3d2ad`.
