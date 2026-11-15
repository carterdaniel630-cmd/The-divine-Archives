# Loop run 2026-11-15 12:42 UTC — Wikipedia strip, part 2 (era 03, Early Iron Age)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11), split by era. This is part 2: the seven chapters of era 03.
**Item:** STATUS 0de (1), the highest-value item in Next that needs no Carter approval to build.
**Branch:** `loop/wikipedia-strip-03` **`fe1f5506`**, one commit on `loop/sources-wrap-fix` `02a870b8` (as STATUS asked, so the strip works from the full source entries, not the cut-short ones). **No PR opened** (runs don't open PRs unasked).

## In plain words
Fifteen Wikipedia links are gone from the source lists of five Early Iron Age chapters. The other two chapters in the era had none. Nothing outside the Sources lists changed. Ten claims are now left without a source of their own in their lists; they are listed below for re-sourcing.

## Rule used for partial bullets (follows the part 1 F1 ruling)
- Only the Wikipedia link goes. Names of primary texts and objects stay as plain text (ch07: Tel Dan Stele, Ketef Hinnom scrolls; the Mesha Stele was already plain).
- Where the link was the bullet's only topic label and not a text or object (ch08 Eleusinian Mysteries, ch09 Taotie / Human sacrifice), the label went with the link. The next word was capitalised ("On Orphism…", "On Fu Hao's tomb…"). No other wording changed.
- ch06 Faravahar: the bracket "(Wikipedia: Faravahar, noting the fravashi vs. khvarenah debate)" described the Wikipedia entry, so the whole bracket went. The chapter's prose still covers the debate; the list no longer points to a source for it (flag 1).
- ch07 Tel Dan line: "The"/"the" added before the two names that had been link text, so the line reads as a sentence. Flag it if a reviewer wants the names bare.

## Counts (order's "diff summary per page")
| Chapter | Wikipedia entries removed | wikipedia.org on the built page, after |
|---|---|---|
| ch06 Zoroaster | 2 (Bundahishn, Faravahar) | 0 |
| ch07 Pre-exilic Israel | 5 (Merneptah Stele, Kenite hypothesis, Khirbet el-Qom, Tel Dan Stele, Ketef Hinnom scrolls) | 0 |
| ch08 Early Greece | 3 (Eleusinian Mysteries, Curse tablet, History of the Greek alphabet) | 0 |
| ch09 Early China | 4 (Shang religious practitioners, Jiu Ge, Taotie, Human sacrifice in ancient China) | 0 |
| ch58 Canaanite & Phoenician | 1 (El (deity)) | 0 |
| ch68 Nubia & Kush, ch77 Etruscans | 0 (none there) | 0 |
| **Total** | **15**, 5 pages touched | **0 on all 7 era 03 pages** |

Bullets removed whole: ch08 "History of the Greek alphabet"; ch58 "El as the aged high god". No subsection left empty. ch08's *The alphabet* subsection now holds only the two Homeric Hymn bullets added later under it; that heading mismatch was already there and is not changed here (note for a later tidy, not part of this order).

## Sole-source flags (order item 5), for re-sourcing from the well
Judged from each chapter's own list. I did not open the remaining sources to check what they cover.

**Claim now has no source in its list:**
1. ch06: the meaning of the Faravahar (fravashi vs. khvarenah debate).
2. ch07: the Kenite (southern-origin) hypothesis for Yahweh. The bullet still names the "Yhw in the land of the Shasu" inscriptions, but cites no source for them.
3. ch07: the Khirbet el-Qom inscription (the BAS Kuntillet Ajrud article may cover it; not checked).
4. ch07: the Tel Dan Stele and the Ketef Hinnom scrolls. The bullet now names three inscriptions and links none.
5. ch08: the Eleusinian Mysteries (only Burkert's general handbook, in the bullet above, may cover them).
6. ch08: the curse tablets (katadesmoi/defixiones). The bullet still names "standard treatments" but no work.
7. ch08: the Greek adoption of the Phoenician letters and the invention of vowels. ch58's Britannica "Phoenician alphabet" covers the source side but sits on another page.
8. ch09: the taotie motif and its meaning.
9. ch09: Shang/Zhou human sacrifice. The bullet now reads only "On Fu Hao's tomb and Sanxingdui, standard archaeological reports", which names no work.
10. ch58: the Canaanite roots of biblical divine imagery (El as "father of the gods" is still covered by the Encyclopedia.com / New World Encyclopedia entry in the bullet above, which lists El in the pantheon).

**Thinner, but still sourced:**
- ch06: the twelve-thousand-year timeline and the Saoshyants: Encyclopaedia Iranica "Eschatology" remains.
- ch07: the Merneptah Stele: Biblical Archaeology Society remains.
- ch09: the Shang religious practitioners: Smarthistory and Keightley remain. The Nine Songs: Waley remains.

**Prose mentions left standing (order item 2):** none. No era 03 body text names Wikipedia.

**Also seen (not in this order's scope):** ch07 and ch09 still cite Grokipedia (an AI-written encyclopedia), already flagged by the sources-wrap-fix run for the re-sourcing pass.

## Checks (all on `fe1f5506`)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): only the 5 chapter pages, `content/dates.json` and `docs/sitemap.xml` change. Committed.
- `content/chapters.js`: each changed `<li>` is exactly what `tools/md-to-chapter.js` makes from the edited markdown. Before the edit, the five Sources blocks matched the converter's output line for line. 11 `<li>` replaced, 2 removed, **0 other lines touched**.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn**. The warning is the expected "sources only, stays cleared" for the 13 sources-wrap-fix chapters plus ch58. Build output matches the committed files.
- verify 18/18; `node --test framework/test/*.test.js` 51/51.
- Crawl evidence: `grep -ci wikipedia` = 0 on all 7 era 03 built pages.
- Headless Chromium at 360 and 390, 5 pages × 2 widths: standards mode, 0 script errors, no sideways overflow, 0 wikipedia anchors, 0 list items ending on a dangling "—", ";", ",", "in" or "and". (The only console error is the sandbox refusing an outside resource, the same on every page.)
- graphify CLI not run: no code touched, content only.

## Merge
Not merged. **Per item**, like part 1. It is Carter's own ruling, but ch07 is a sensitive-topic chapter and the branch sits on the unmerged `loop/sources-wrap-fix`.
- **Merge order:** after `loop/sources-wrap-fix`, since it carries that branch.
- **Overlap:** none with part 1, which touches eras 01–02 only. Both rewrite `content/dates.json` and `docs/sitemap.xml`, so whichever merges second needs a mechanical re-sync and rebuild.

Still missing:
- an **independent review** by a session other than this one (..01HFWzTkQDY1ZmPNWr39GST6). Diff to review: `02a870b8..fe1f5506`. Check the 15 removals against the markdown, the partial-bullet rule above, the 10 flags, and that nothing outside the Sources lists changed;
- a PR, so the GitHub checks (incl. Lighthouse) run;
- Carter's yes.

## Next
Wikipedia strip part 3 (era 04, Axial Age: ch10, ch13, ch14, ch15 …), the same way, built on `loop/sources-wrap-fix`. Or first the independent review of this part, by another session.
