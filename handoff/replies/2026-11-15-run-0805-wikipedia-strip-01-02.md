# Loop run 2026-11-15 08:05 UTC — Wikipedia strip, part 1 (eras 01–02)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11). Split by era, as STATUS allowed. This is part 1: the twelve chapters of eras 01 (Prehistory) and 02 (Bronze Age).

**Why this item:** STATUS → Next (6) named Rök photographs first, then the Wikipedia strip. The Rök photographs could not be built: commons.wikimedia.org and upload.wikimedia.org are refused by this session's network proxy, and no image files are staged under `handoff/rok/`. Nothing was fetched another way. The photographs stay blocked until atlas stages the files (with the licences already logged in `handoff/rok/rok-stone-photo-log.md`).

## What was built
- Branch `loop/wikipedia-strip-01-02`, head **`d8d91ab0`**, one commit on `main` `f92ab8d7`. **No PR opened** (runs don't open PRs unasked; Carter's a/b on that is still open).
- List removal only. No prose outside `## Sources` changed. `review-checks` confirms it: all six cleared chapters touched are "sources only, so it stays cleared".
- Files: 9 chapter markdown files, their 9 bodies in `content/chapters.js` (Sources block only), the 9 rebuilt pages in `docs/chapters/`, `content/dates.json` and `docs/sitemap.xml` (modified dates).

## Counts (order's "diff summary per page")
| Chapter | Wikipedia entries removed (markdown) | wikipedia.org links removed (live page) |
|---|---|---|
| ch41 The Paleolithic | 5 (4 links + 1 unlinked "Wikipedia" citation) | 4 |
| ch42 The Neolithic | 1 | 1 |
| ch61 Aboriginal Australian Dreaming | 2 | 2 |
| ch75 Siberian & Arctic Shamanism | 2 | 2 |
| ch02 Egypt | 4 | 4 |
| ch03 Mesopotamia | 6 | 3 |
| ch04 Indus Valley | 3 | 3 |
| ch05 Early Vedic | 5 | 3 |
| ch57 Hittite & Anatolian | 4 | 4 |
| ch66, ch67, ch76 | 0 (none there) | 0 |
| **Total** | **32** | **26** |

The live count is lower because 6 of the links sat in wrapped source lines that the live pages already drop (see "Found on the way" below).

Empty subsections removed (order item 4): ch03 "On the Hammurabi 'code' debate"; ch04 "General". No whole Sources section was left empty.

## Sole-source flags (order item 5) — for re-sourcing from the well
Judged from each chapter's own source list. I did not re-open the remaining sources to check what they cover.

**Claim now has no source in its list:**
1. ch41 — the Lion Man of Hohlenstein-Stadel (c. 40,000 years).
2. ch41 — Venus figurines, the contested fertility/goddess reading, the Dolní Věstonice ceramic Venus.
3. ch41 — the engraved Blombos ochre (c. 73,000 years) as the earliest abstract mark-making.
4. ch41 — the Neanderthal burial and symbolic-behaviour debate (Shanidar, La Pasiega, Bruniquel).
5. ch41 — Skhul (the bullet's remaining source, Smithsonian, is about Qafzeh). Sungir had no source before this change.
6. ch42 — megaliths and their alignments: Stonehenge/Durrington, Malta's Ġgantija and the Hypogeum. (Newgrange still has its own three sources.)
7. ch61 — songlines as song, map and law crossing language boundaries.
8. ch75 — the 1728 Copenhagen fire that destroyed Sámi drums (the old entry was labelled "pointer").
9. ch75 — the Arjeplog blasphemy trial of 1687 (the old entry said "no stronger source confirmed").
10. ch02 — Letters to the Dead (the remaining TheCollector source covers Meretseger only).
11. ch03 — *The Descent of Inanna into the Underworld* (its only entry was Wikipedia, so the whole bullet went).
12. ch03 — the Hammurabi "code" debate (the Wikipedia entry summarised Van De Mieroop and Yoffee; the chapter now names neither).
13. ch03 — divine numbers of the gods (Sin = 30, etc.). The rest of that bullet was only "god-list traditions", which is not a source.
14. ch03 — Nisaba and Nabu as patrons of writing.
15. ch04 — Doris Srinivasan's critique of the proto-Shiva reading, and Shubhangana Atre's "Lady of Beasts" reading. (Marshall's identification keeps its own source.)
16. ch05 — the soma/haoma plant-identity debate.

**Thinner, but still sourced (worth a look):**
- ch02 — Deir el-Medina household gods and oracles: one source left (Facts and Details).
- ch02 — Amarna/Atenism: ASOR, Britannica and The Past remain.
- ch03 — Enheduanna and the Ludlul: Morgan Library / World History Encyclopedia remain.
- ch05 — Nasadiya and Hiranyagarbha hymns: covered for their text by the Rigveda translations entry. The bullet now reads "Creation hymns: Purusha Sukta (Rigveda 10.90)." The Gayatri Mantra bullet was removed; its text is covered by the same entry.
- ch05 — Vedic pantheon: Britannica remains.
- ch57 — Sun-goddess of Arinna (Encyclopedia.com), Kumarbi (TheCollector + Reading), Telipinu (UT LRC) remain. The overview bullet (empire dates, Hattusa, Yazılıkaya, treaties) is gone: flag the empire dates and Yazılıkaya for a check.
- ch04 — the "General" overview had no specific claim of its own.

**Prose mentions left standing (order item 2):** none in eras 01–02. No body text names Wikipedia.

## Checks (this run)
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry): ran, committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn**. The warning is the expected "sources only, stays cleared" for ch03, ch04, ch05, ch41, ch57 and ch75. Build output matches the committed files.
- verify 18/18; `node --test framework/test/*.test.js` 51/51.
- Crawl evidence: `grep -ci wikipedia` = 0 on all 12 built era 01–02 chapter pages.
- Headless check at 360 and 390: 9 pages × 2 widths, standards mode, 0 script errors, no sideways overflow, 0 wikipedia.org anchors.
- graphify CLI not run this run (no code touched; content and markdown only).

## Found on the way — live defect, needs its own item
**Wrapped source entries are cut short on 14 live chapter pages.** Where a markdown source bullet runs onto a second line, the live page shows only the first line. The rest (usually the links) is missing. Example, live ch03: "*Enuma Elish* (Babylonian creation epic) —" ends there, with no Britannica or World History Encyclopedia link. A script compared each markdown continuation line with the live text: **121 lines are missing across ch03, ch04, ch05, ch06, ch07, ch09, ch10, ch13, ch14, ch15, ch16, ch17, ch18, ch20.**

Cause: those bodies in `content/chapters.js` were made from an older converter that did not join wrapped lines. Today's `tools/md-to-chapter.js` joins them, but it double-escapes entities written in the markdown (`&mdash;` shows as `&amp;mdash;`). So the fix needs care:
- rebuild only each Sources block;
- make the converter leave existing entities alone;
- check that each chapter stays "sources only".

I did not fix it in this branch, so the strip stays a pure list removal. Queued as a Next item. It is a citation-honesty fix: the sources are real and already listed in the markdown, but on the page they show only partly.

## Merge
**Per item.** It is Carter's own ruling, but it touches 9 chapter pages, 6 of them cleared. This run reads it as class (c) honesty-wording at most. If in doubt, per item.

Still missing:
- a PR, so the GitHub checks (incl. Lighthouse) run;
- an independent review by a session other than this one (..01HFWzToa6S9VECD2DYY1Ayi). The reviewer should open the chapters' remaining sources for the "thinner" list;
- Carter's yes. His ruling may count as the per-item yes for the strip: his call.

## Next
Wikipedia strip part 2 (era 03, Early Iron Age) on its own branch, the same way. Or, if Carter says so, the truncated-sources repair first: it is higher value, because it restores 121 lost source lines.
