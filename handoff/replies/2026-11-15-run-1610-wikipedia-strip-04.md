# Loop run 2026-11-15 16:09 UTC — Wikipedia strip, part 3 (era 04, Axial Age)

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md` (Carter's ruling, 2026-11-11), split by era. Part 3: the nine chapters of era 04.
**Item:** STATUS 0eg (1), the highest-value item in Next that needs no Carter approval to build.
**Branch:** `loop/wikipedia-strip-04` **`ffa58624`**, one commit on `main` `ef7e4d30` (fast-forwards). **PR #151** opened (Carter's "a", `decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`).

## In plain words
Twenty-seven Wikipedia links are gone from the source lists of seven Axial Age chapters. The other two chapters in the era (ch69 Upanishads, ch78 Scythians) had none. Nothing outside the Sources lists changed. Several claims are now left without a source of their own; they are listed below for re-sourcing.

## Rule used (follows parts 1 and 2)
- Only the Wikipedia link goes. Names of primary texts and objects stay as plain text: ch13 "The *Senatus consultum de Bacchanalibus*"; ch14 "The Coligny calendar" ("The" added so the line reads, as in part 2's ch07).
- Where the link text was only a topic label, the label went with it. ch15: "Socrates' trial, Plato's Forms/Demiurge/soul, and [unmoved mover]" became "Socrates' trial and Plato's Forms/Demiurge/soul" (the "and" moved; no other words changed).
- New this part, for the reviewer to judge: **a bullet left naming no source at all was removed whole** (no text, link, work or primary text left). That is ch11 "on the stupa and Gandharan art" (its two links were both Wikipedia), ch14 the three-link Germanic paganism bullet and the seeress bullet, ch52 the Jainism overview and Sallekhana bullets. Bullets that still name a primary text or a scholar were kept (ch10 Personified Wisdom keeps "Proverbs 8, Ben Sira 24, and the Wisdom of Solomon"; ch14 keeps "Jean-Louis Brunaux"). If the reviewer prefers the topic left standing without a source, that is a one-line change per bullet.
- Trailing ";" before a removed last item became "." (ch12, ch13, ch14, ch15).

## Counts (order's "diff summary per page")
| Chapter | Wikipedia entries removed | wikipedia on built page, after |
|---|---|---|
| ch10 Second Temple Judaism | 3 (Second Temple, Personification of wisdom, Jewish apocrypha and pseudepigrapha) | 0 |
| ch11 Buddhism | 2 (Dharmachakra, Aniconism in Buddhism) | 0 |
| ch12 Confucianism & Daoism | 2 (Way of the Celestial Masters, Zhang Daoling) | 0 |
| ch13 Rome | 6 (College of Pontiffs, Vestal Virgin, Sibylline Books, Lemuria, Bacchanalia, Roman imperial cult) | 0 |
| ch14 Celtic & Germanic | 8 (Cernunnos, Taranis, Gournay-sur-Aronde, Germanic paganism, Sacred trees and groves, Nerthus, Seeress, Coligny calendar) | 0 |
| ch15 Classical Greece | 2 (Sisyphus fragment, Unmoved mover) | 0 |
| ch52 Jainism | 4 (Mahavira, Jainism, Sāmāyika, Sallekhana) | 0 |
| ch69, ch78 | 0 (none there) | 0 |
| **Total** | **27**, 7 pages touched | **0 on all 9 era 04 pages** |

Bullets removed whole: 5 (ch11 ×1, ch14 ×2, ch52 ×2). No subsection left empty; no Sources section left empty. ch11's *Symbol and art* subsection now holds only the councils bullets added later under it; that heading mismatch is noted for a later tidy, not changed here (same as part 2's ch08 note).

## Sole-source flags (order item 5), for re-sourcing from the well
Judged from each chapter's own list. I did not open the remaining sources to check what they cover.

**Claim now has no source in its list:**
1. ch10: personified Wisdom (Hokhmah/Sophia). The bullet names the primary texts only.
2. ch11: the Dharmachakra, Buddhist aniconism, the stupa and Gandharan (Greco-Buddhist) art.
3. ch13: the Bacchanalia affair of 186 BCE (the *Senatus consultum* is named as a primary text, nothing else).
4. ch13: the Roman imperial cult.
5. ch14: the Gournay-sur-Aronde and Ribemont-sur-Ancre war-sanctuaries (Brunaux named, no work).
6. ch14: Germanic paganism, sacred groves, Nerthus (Tacitus is named only in the subsection heading).
7. ch14: the Germanic seeresses (Veleda, Aurinia/Albruna).
8. ch14: the Coligny calendar (named, no source).
9. ch15: Aristotle's unmoved mover.
10. ch52: Sallekhana/santhara, its distinction from suicide, and its legal controversy.
11. ch52: Mahavira and the 24 Tirthankaras (the doctrines in that bullet are still covered by the PMF IAS / Vajiram & Ravi and Britannica bullets; Mahavira himself is not named in them).

**Thinner, but still sourced:**
- ch10: the Second Temple period (Britannica Jewish Diaspora, Cohen); the apocrypha (My Jewish Learning).
- ch12: the Celestial Masters and Zhang Daoling (SEP Religious Daoism).
- ch13: the pontiffs and Vestals (Encyclopedia.com Roman Religion); the Sibylline Books (OCD Roman Divination); the Lemuria (World History Encyclopedia, Roman Household Spirits).
- ch14: Cernunnos and Taranis (Britannica Celtic religion).
- ch15: the Sisyphus fragment (IEP The Sophists).
- ch52: samayika (Britannica Ritual practices).

**Prose mentions left standing (order item 2):** none. No era 04 body text names Wikipedia.

**Also seen (not in scope):** each subheaded Sources list on the site starts with an empty `<ul></ul>` before its first subhead (a converter artefact, already on `main`, e.g. ch06, ch10, ch13). Not caused or changed here; a later tidy for `tools/md-to-chapter.js`.

## Checks (all on `ffa58624`)
- Before editing, the Sources lists in `content/chapters.js` for all nine era 04 chapters matched `tools/md-to-chapter.js` output exactly; after editing, all nine still match. 14 `<li>` replaced, 5 removed, no other line in `chapters.js` touched.
- Full build order (stamp-dates, og, vault, chapters, pages, museum, sky, framework, entity registry): only the 7 chapter pages, `content/dates.json` and `docs/sitemap.xml` change. Committed.
- `review-checks --base origin/main --build`: **9 pass / 0 fail / 1 warn** (expected "sources only, so it stays cleared" for ch10, ch13, ch14, ch15).
- verify 18/18; `node --test framework/test/*.test.js` 51/51.
- Crawl evidence: `grep -ci wikipedia` = 0 on all 9 era 04 built pages.
- Headless Chromium at 360 and 390, 7 pages × 2 widths: standards mode, 0 script errors, no sideways overflow, 0 wikipedia anchors, 0 list items ending on "—", ";", ",", "in" or "and"; the only empty list is the pre-existing one above.
- graphify CLI not installed in this session; no code touched (content only), so no map refresh needed.

## Merge
Not merged. **Per item** on Carter's strip yes. Still missing:
- an **independent review** by a session other than this one (..01HFWzTmdFQ6fNZymPZSKAiC). Diff: `ef7e4d30..ffa58624`. Please check the 27 removals, the "bullet with no source left goes whole" rule, and the 11 flags;
- GitHub green incl. Lighthouse on PR #151.

**Overlap:** #150 touches tools only; no conflict. Whichever later strip part merges second re-syncs `content/dates.json` and `docs/sitemap.xml`.

## Next
Independent review of #151 (another session). Then Wikipedia strip part 4 (era 05, Late Antiquity) the same way. #150 still waits on Carter's per-item yes.
