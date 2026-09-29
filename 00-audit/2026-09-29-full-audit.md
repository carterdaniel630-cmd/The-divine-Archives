# Full audit — The Divine Archives (2026-09-29)

- **Audited commit:** `fb3e43b` (`main`, "Batch IV complete: README and outline status board (83 chapters)")
- **Mode:** read-only. This report is the only file written. No content, code, tag or config was changed.
- **Method:** measured from the repository. I ran every build script in a throwaway git worktree and diffed the output, ran every `tools/verify-*.js`, crawled every internal link in `docs/`, reconverted every chapter's markdown and compared it with the published body, scanned topic coverage with grep, and loaded 13 key pages plus the museum in headless Chromium (desktop, and Pixel 7 emulation).
- **Limits:** outbound web access is blocked in this sandbox (`403` from the egress proxy, including Wikipedia and getconexto.com). So **external link liveness and the live site could not be checked here**. Those items are tagged `needs-live-check`. No real phone was available either.


> **Corrections (added 2026-09-29, during the fixes on `claude/audit-fixes`):**
> 1. **CLAUDE.md drift (§3.5) was wrong.** `main`'s CLAUDE.md already has the build order ("Build & deploy") and the full file-structure list. The audit read a stale local copy. No change was needed.
> 2. **Finding C was mis-stated.** ch03's text matches its markdown. The 4% gap came from raw HTML (`<em>`, `&rsquo;`) in the markdown, which the converter escapes. ch45 and ch46 are not simply behind their markdown. Since ch45 was first added, the live page has been a condensed version (the one Carter cleared) and the markdown a longer draft. Each has material the other lacks: the live pages have a lead paragraph, a research note and extra sources. Resolving that is Carter's call, so it is on hold.
> 3. **Also found:** 7 external URLs that contain parentheses are cut short at the first `)`. There are 3 in chapters (ch03, ch14, ch16) and 4 in Vault pages (black-stone, holy-lance, kartarpur-bir, skull-reliquary-saint-maximin). The cause is the markdown link pattern in the converters. Not yet fixed; this is a proposed follow-up.

---

## 0. Headline findings

| # | Finding | Severity | Where |
|---|---|---|---|
| **A** | **The 18 Batch III/IV chapters (ch66–ch83) are orphaned from browsing.** They are missing from every era page and from `traditions.html`. They can be reached only through search, the sitemap, the museum and direct links. | **High** | `docs/assets/data.js`: each era's `traditions:` list was never extended. `tools/build-pages.js:158, 247` builds the tiles from that list. |
| **B** | **93 broken source links on 20 live chapter pages (ch01–ch20).** Each one renders as `<a href="<a href="https://…">Label:">https://…">Label:</a>`, so the visible Sources lists are garbled and the links are dead. | **High** (it undermines the sourcing standard on the public page) | `content/chapters.js` (89 lines) → `docs/chapters/ch01–ch20.html`. Root cause: `tools/md-to-chapter.js:31-35`. `sourceLine()` runs `inline()`, which already turns `[label](url)` into an anchor, and then linkifies bare URLs again inside that anchor. |
| **C** | **The live text of ch45 and ch46 is out of date with their markdown.** The markdown is 37% (ch45) and 47% (ch46) longer than the published body, and some section headings differ. ch03 differs by 4%. | Medium | `eras/05-late-antiquity/ch45-…md`, `themes/ch46-creation.md` compared with `content/chapters.js` |
| **D** | **No Pantheon figures for any of ch66–ch83**, although the outline says to add figures as chapters are drafted. **26 chapters have no Vault object**, including all 18 new ones. | Medium | `docs/assets/pantheon-data.js`, `docs/assets/vault-data.js` |
| **E** | **The outline's Vault table stops at V77 + V88.** V78–V87 (Malleus … Diwan Abatur) are live, but the outline still lists them as a "Batch 9 queue … not started". | Low (doc drift) | `outline/master-outline.md`, Vault table |
| **F** | **Everything else builds and verifies clean.** The 5 builds are idempotent: running them in README order changed 0 files. All 13 verifiers pass, and CI is green on `fb3e43b` (deploy, verify, game-runtime). | ✅ | — |

---

## 1. Content

### 1.1 Chapter counts (from `docs/assets/data.js`, cross-checked with the files)

| Era | Chapters | Of which pending | Files |
|---|---|---|---|
| 01 Prehistory | 5 | 2 (ch66, ch75) | ch41, 42, 61, 66, 75 |
| 02 Bronze Age | 7 | 2 (ch67, ch76) | ch02–05, 57, 67, 76 |
| 03 Early Iron Age | 7 | 2 (ch68, ch77) | ch06–09, 58, 68, 77 |
| 04 Axial Age | 9 | 2 (ch69, ch78) | ch10–15, 52, 69, 78 |
| 05 Late Antiquity | 9 | 2 (ch70, ch79) | ch16–20, 45, 55, 70, 79 |
| 06 Early Medieval | 10 | 2 (ch71, ch80) | ch21–25, 53, 54, 60, 71, 80 |
| 07 High Medieval | 12 | 2 (ch72, ch81) | ch26–30, 43, 44, 56, 59, 62, 72, 81 |
| 08 Early Modern | 7 | 2 (ch73, ch82) | ch31–34, 63, 73, 82 |
| 09 Modern | 10 | 2 (ch74, ch83) | ch35–40, 64, 65, 74, 83 |
| Themes (cross-era) | 7 | 0 | ch01, 46–51 |
| **Total** | **83** (76 + 7) | **18** | matches README and the outline |

- **Status board vs site:** consistent. The 18 chapters flagged `pending: true` in `data.js` are exactly the 18 marked pending on the status board, and exactly the 18 built pages that carry the "Recently added — pending full review" banner. The other 65 are CLEARED.
- **Vault:** 88 entries. 87 are cleared, and **V88 (Skull of Saint-Maximin) is still pending**.
- **Pantheon:** 199 figures from 30 traditions, CLEARED.
- **Your "passed" at the end of the last session:** no tag has been removed. **I need you to tell me which chapters it clears:** all 18 (ch66–ch83)? Only Batch III (ch66–ch74)? Does it include V88? Until you say, every tag stays.

### 1.2 Era balance

Prehistory (5), Bronze Age (7), Early Iron Age (7) and Early Modern (7) are the thinnest eras, and High Medieval (12) is the thickest. The seven themes are all cross-era. There is no era-specific theme chapter yet, although CLAUDE.md asks for "one comparative theme chapter per era where useful".

Placement note (for review): **ch76 The Olmec** is filed in the Bronze Age (c. 3300–1200 BCE), but its own dating is c. 1600–400 BCE, so most of it falls in the Early Iron Age range. This is defensible as a start-date rule, but it should be a stated rule.

### 1.3 Gaps against the CLAUDE.md depth standard

The table counts the chapter files that mention each topic at all (grep over `eras/` and `themes/`).

| Depth-standard area | What exists | Gap |
|---|---|---|
| **Western esotericism (Renaissance to early modern)** | Hermeticism is in ch17 and V03. Golden Dawn and Thelema are in ch37 and V73. Kabbalah is ch26. | **Largest single gap.** Nothing bridges ch28 (Scholasticism) and ch37 (Theosophy). Ficino appears in 1 file. There is **0** on Agrippa, John Dee, Paracelsus, Giordano Bruno, Renaissance alchemy and the Rosicrucian manifestos as subjects (1 mention). Christian Cabala / Pico: 1 file. Freemasonry: 1. |
| **Folk magic and grimoires** | Witch trials (ch32); cunning folk and the benandanti (1 file each); grimoires (1); curse tablets (1). | No chapter on everyday magic: the Greek Magical Papyri (0), defixiones, the grimoire tradition, cunning folk, charms, and Jewish folk magic (golem 1, dybbuk 0). |
| **Satanism** | ch39 plus V74. The Temple of Set, ONA, Luciferianism, TST and the Satanic Panic are each touched once, all inside ch39. | Adequate for now. A deeper pass could give the **Satanic Panic** (1980s–90s, a documented moral panic) proper treatment, perhaps in a theme on accusation. |
| **Witchcraft** | ch32 (trials) and ch38 (Wicca), V72, V78 Malleus. | Pre-Christian European folk practice is thin, and so are regional trial variants outside the Anglo-German core (Scandinavia and the Basque country are worth checking). |
| **Apocrypha and canon** | ch10, ch17, ch45, V49 Enoch, V40 Judas. | **Deuterocanonical: 0 hits.** Tobit, Judith and the Maccabees appear once each. No chapter on **how canons formed** (Jewish, Christian, Ethiopian, Buddhist, Qur'anic codification), although CLAUDE.md names canon, deuterocanon and pseudepigrapha explicitly. |
| **Christian mysticism** | Eckhart appears in 1 file. | Hildegard, Julian of Norwich, Teresa of Ávila and John of the Cross each have **0** hits. Beguines, hesychasm (1) and devotio moderna are also missing. |
| **Folk and vernacular religion** | "Folk", "popular" or "vernacular religion" appears in 7 files. | No chapter on Chinese popular religion (1 file), and none on village Hinduism or the saint cults of lived Islam (the zar has 0). |
| **Missing regions** | — | **Mainland Southeast Asia: 0** (Burma, Thailand, Cambodia/Angkor, Theravada kingship; Theravada appears in 3 files). **The Andes before the Inca: 0** (Chavín, Tiwanaku, Nazca), even though V65 Gateway of the Sun is in the Vault. **Vietnam** (Cao Đài, Hòa Hảo) 3 passing mentions; **Philippines** 0; **Finno-Ugric** (Kalevala 0, táltos 0); **Ainu** 0; the Taiping 0; Mami Wata 0. |
| **Modern NRMs** | ch35 (umbrella), ch65. | Scientology, the LDS Church, the Nation of Islam, UFO religions, Rastafari and Falun Gong each get 1 file, all inside ch35. Anthroposophy and Gurdjieff are 1 and 0. |

---

## 2. Sourcing

### 2.1 Structure (all 83 chapters, measured)

- **Symbology section:** 83/83 have one (`## Symbology and sacred encoding` or equivalent).
- **Evidence-honesty section:** 83/83.
- **Believer's and skeptical lens sections:** all 18 new chapters have both. The status board says every older chapter has them too.
- **Source logs:** 83/83 chapters, 88/88 Vault entries, and the Pantheon (172 files). **Every chapter has a log.**
- **The log matches the chapter** for all 18 new chapters: 0 URLs in the chapter without a log entry, and 0 the other way round.

### 2.2 Sample of the newest chapters (ch66–ch83)

- They run 2,466–4,036 words, with 29–55 distinct URLs each (660 in total).
- **Source mix:** Wikipedia is **296 of about 660 URLs (≈45%)**. Next come Britannica (33), World History Encyclopedia (13), Pew (9), Cambridge (9), Encyclopedia.com (8), ResearchGate (7) and Academia.edu (6). Tertiary sources are acceptable for orientation, but for contested claims the standard implies primary texts or peer-reviewed work. **Recommendation:** during review, swap Wikipedia for the source Wikipedia itself cites wherever a specific or contested claim rests on it.
- **Opaque links:** 3 bare ResearchGate IDs in ch81 (`/publication/233088535`, `/233110240`, `/313108127`) give no title in the chapter's source line text beyond the label. They are checkable, but fragile (ResearchGate often blocks bots and moves pages). Prefer the DOI.
- **Overclaiming scan:** every use of "prove/proven/proof" in ch66–ch83 (8 hits) is either inside a "Not supported" list or is attributed to someone ("Kendall argues…", "Vivekananda interpreted as proof…"). **No unflagged proof claims.**
- **No placeholder text** (`TODO`, `citation needed`, `[source]`) in the new chapters.
- **Date-sensitive claims to recheck at review:** ch80 (Aga Khan V, succession in 2025), ch83 (the 2025 Kumbh; the BAPS allegations, correctly framed as unresolved), ch74 (survey figures). These age quickly.
- **Link liveness:** **`needs-live-check`.** I could not test any external URL from here. I recommend a scheduled link-check workflow (see Next moves).
- **Older chapters:** many cleared chapters carry only 4–14 URLs (ch46 Creation has only 4). They lean on print sources, which is legitimate, but thinner than the new standard. Worth noting, but not urgent.

### 2.3 Finding B in detail: garbled source links (ch01–ch20)

```
<li><a href="<a href="https://biologos.org/articles/gilgamesh-atrahasis-and-the-flood">BioLogos:">https://biologos.org/…">BioLogos:</a> Gilgamesh…
```

This affects 20 pages and 93 links. The markdown is fine. The converter breaks it, because `sourceLine()` linkifies again text that is already a link. The fix is (1) make `sourceLine()` skip URLs that are already inside `href="…"` or an anchor, (2) reconvert ch01–ch20 (or repair the 89 lines in `content/chapters.js`), and (3) rebuild. A check in `verify.yml` for `href="<` would stop it coming back.

---

## 3. Site health

### 3.1 Builds, in the order README gives

CLAUDE.md itself gives **no** build order; see 3.5.

| Script | Result |
|---|---|
| `build-vault.js` | 0 pages written; 88 published, 0 queued |
| `build-chapters.js` | 83 chapter pages prerendered |
| `build-pages.js` | nothing changed; sitemap 9 eras + 83 chapters |
| `build-museum.js` | 83 rooms in 10 wings; manifest 35.9 KB; wing files 19–178 KB |
| `build-sky.js` | 5,044 stars, 88 constellations, 18 lore entries, 207 KB |

**`git status` after all five: clean.** The committed output matches the sources.

### 3.2 Verifiers

All 13 `tools/verify-*.js` pass: chess 18/18, fighters 4/4, minesweeper 8/8, ouroboros 14/14, pacman 10/10, pinball 8/8, pong 6/6, reliquary (25 chapters), risk 12/12, seeker 10/10, sky 43 basis strings, treasure 17/17, ziggurat 12/12. GitHub Actions on `fb3e43b` are all green.

**Gap:** `verify.yml` does not check `docs/museum/english.js` sources, `scans.js` or chapter HTML well-formedness, which is how finding B got through.

### 3.3 Internal links and assets

- The crawl covered 196 HTML files and 7,994 internal `href`/`src` references. **The only breakage is the 93 garbled source links (B).** Everything else resolves.
- **Illustrations:** every chapter page has its plate (`class="plate"` plus plate art). None are missing.
- **Pending banners:** exactly 18, on the right pages.
- **Browser smoke test** (13 pages, desktop and Pixel 7 emulation): no JavaScript errors, no horizontal scroll at phone width, and the museum canvas initialises. The only console error is Google Fonts failing TLS through this sandbox's proxy, which is environmental.

### 3.4 Museum coverage

- **Rooms:** 83/83 chapters have a room.
- **Relic renditions:** 85 in `relics.js`, plus V88 in `reliquary.js`. **V68 (Tjurunga) and V76 (the Báb's Star Tablet) have no model, deliberately** (`tools/build-museum.js:57`: secret-sacred objects, and Bahá'í practice on images of the Báb).
- **"Read it in English":** 86 entries (none 26, sum 29, pd 22, lit 9). **Missing: V68 and V76**, with no note explaining why. A `none` entry for V68 (it carries designs, not a text, and is secret-sacred) would be honest and harmless. **V76 is a text**: the Bahá'í restriction is on images of the Báb, not on his writings, so a summary is possible. **That is your call.**
- **Scans:** 11 Sketchfab embeds, loaded only on request, with `dnt=1`. The Benin Bronzes are excluded by a stated policy and await your decision.
- **The phone-performance numbers are stale.** The last measurements (`museum/01-build/REPORT.md`) were taken with **65 rooms**, before the ENV skies, fauna, sound and renditions were added. They were also emulated: 6.1 s cold start on slow 4G, over the 5 s budget. The **real-phone check is still owed.**

### 3.5 Doc drift

| Doc | Drift |
|---|---|
| `CLAUDE.md` | Its file-structure block lists only `eras/`, `outline/` and `sources/`. It is missing `themes/`, `vault/`, `docs/`, `content/`, `tools/`, `functions/` and `museum/`. **It gives no build order** (README does). It still describes the Ctrl+B background workflow. (Policy text is accurate. Edit only with your OK.) |
| `outline/master-outline.md` | (1) The era taxonomy table still lists only the original traditions. (2) Vault table: V78–V87 are live but listed as "Batch 9 queue… not started" (E). (3) "Status values" lists `CLEARED` twice and omits "published, pending review". (4) The per-chapter checklist omits the symbology, believer's-lens and skeptical-lens sections that every chapter now has. |
| `docs/assets/data.js` | The era `traditions` lists omit ch66–ch83 (finding A). This is data drift with visible consequences. |
| `content/chapters.js` header | Still says the file is "loaded by chapter.html". It is build-only now. |
| README | Accurate on counts (83, 76 + 7, 18 pending) and layout. It should link this audit as the latest. |
| `00-audit/CONTEXT.md` | Correctly marked historical. |
| Branches | 31 non-main branches on the remote, including three unrelated to this project (`clipyield-ugc-init`, `orchard-merch-stage-setup`, `printify-merch-status`). Nothing to do without your OK. |

---

## 4. Museum and games

### 4.1 Games: status of the 2026-09-27 audit findings

| Earlier finding | Now |
|---|---|
| Pong, Pinball and Tomb Robber ran faster on high-refresh screens | **Fixed.** All three use a fixed 1/60 s accumulator step. |
| Fighter: no input buffer, key-repeat mashing | **Fixed.** 8-tick buffer (`fighter.js:1217`) and an `e.repeat` filter. |
| Fighter: 5.4 MB sprite download, dead head rig | **Fixed.** The sprites and `USE_HEAD_RIG` are gone. |
| Ziggurat: no lock delay, hold, DAS or counter-clockwise rotation | **Fixed.** Rotation both ways, hold, a 3-piece preview and a 0.5 s lock delay. |
| Ouroboros single-slot turn latch | **Fixed.** Input queue. |
| Minesweeper chording; Tomb Robber coyote time and jump buffer; chess quiescence | **Fixed.** |
| Fighter hurtboxes, and hits checked only on the first active frame | Not confirmed fixed (no hurtbox code found). A feel issue, not a correctness one. |
| **Risk: the `nubia` tile has no fact** ("until a Nubia/Kush chapter exists") | **Now unblocked.** ch68 Nubia & Kush exists. The `arabia` fact could also move from ch21 to ch70 Pre-Islamic Arabia. Both would need to pass `verify-risk.js`. |

### 4.2 Museum: open items

1. A **real-phone check** (owed since Phase 1).
2. **Re-measuring performance** at 83 rooms with fauna, sound and ENV skies (the budget table is from 65 rooms).
3. **English entries** for V68 and V76 (your decision on V76).
4. The **Benin Bronzes scan** (your decision).
5. **Beta links:** the museum is still `noindex` and beta. You still need to decide where it is linked from.

---

## 5. Next moves, ranked

Effort: **S** is under an hour, **M** is a session, **L** is several sessions.

| Rank | Move | Why | Effort |
|---|---|---|---|
| 1 | **Fix A: put ch66–ch83 on the era pages and `traditions.html`** (add them to `data.js` era `traditions`, then rebuild) | 18 live chapters can't be browsed to | S |
| 2 | **Fix B: the garbled source links**. Patch `md-to-chapter.js`, reconvert or repair ch01–ch20, rebuild, and add an `href="<` guard to CI | Sources are the project's core promise, and they are broken on 20 public pages | S–M |
| 3 | **Review-clearing pass.** You tell me what "passed" covers, and I remove those tags, update `data.js`, the status board and README, and rebuild. Also decide on V88. | 18 chapters (and V88) still carry the tag | S |
| 4 | **Fix C: republish ch45 and ch46 (and check ch03) from their markdown** | The public text is behind the source | S |
| 5 | **Doc sync:** outline (Vault V78–V87, status values, checklist, taxonomy), CLAUDE.md structure and build order (with your OK), and the README link to this audit | Keeps future sessions from repeating these mistakes | S |
| 6 | **Link-rot CI:** a weekly workflow that checks every external URL and reports (it does not auto-fix) | The sandbox can't check liveness, but GitHub Actions can | S–M |
| 7 | **Batch V chapters** (below) | Closes the depth-standard gaps in §1.3 | L (9 chapters ≈ Batch III/IV size) |
| 8 | **Pantheon and Vault for the new chapters:** about 2–4 figures per new chapter, plus Vault objects for the 26 chapters without one (candidates: Sámi drum, Kul Tigin stele, Ezana's inscriptions at Aksum, Olmec Offering 4, the Liber Linteus, a Jebel Barkal stela, the Baal Shem Tov's letter (Iggeret ha-Kodesh), Akbar's Ibadat Khana paintings) | Brings the new chapters to parity | M |
| 9 | **Risk: Nubia and Arabia facts** from ch68 and ch70 | Closes a gap the games have carried since launch | S |
| 10 | **Museum:** English for V68 (and V76 if you agree), re-measure performance at 83 rooms, and do the real-phone check (**you**, on your phone; I can give you a 5-minute checklist) | The open museum items | S + your phone |
| 11 | **Source-quality pass** on ch66–ch83: replace Wikipedia with primary or peer-reviewed sources for contested claims, and turn ResearchGate IDs into DOIs | Raises the evidence bar | M |
| 12 | Branch clean-up (you delete them in the GitHub UI; the push path here refuses deletions) | Housekeeping | S (you) |

### 5.1 Suggested Batch V (one per era, aimed at the §1.3 gaps)

| Era | Proposed chapter | Gap it closes |
|---|---|---|
| 01 Prehistory | **Megalithic Europe: Stonehenge, Newgrange, Carnac** (or the Finno-Ugric and Sámi deep past) | The prehistory era is the thinnest; the megaliths are named in the era's own scope but have no chapter |
| 02 Bronze Age | **Chavín and the early Andes** | The pre-Inca Andes are at 0 |
| 03 Early Iron Age | **Magic in the ancient Mediterranean: curse tablets, amulets and the Greek Magical Papyri** (straddles into Era IV) | Folk magic |
| 04 Axial Age | **Canon & Apocrypha: how scriptures closed** (a theme chapter: Hebrew Bible, deuterocanon, pseudepigrapha, Ethiopian canon, the Pali canon) | Explicit CLAUDE.md requirement; deuterocanon at 0 |
| 05 Late Antiquity | **Tiwanaku and Wari** *or* **the Church of the East and the Silk Road** | Andes and Asia gaps |
| 06 Early Medieval | **Theravada and the Southeast Asian kingdoms: Pagan, Angkor, Sukhothai** (runs into Era VII) | Southeast Asia at 0 |
| 07 High Medieval | **Christian mysticism: Hildegard, Eckhart, the Beguines, Julian of Norwich** | 0 hits on most names |
| 08 Early Modern | **Renaissance magic and the Rosicrucians: Ficino, Pico, Agrippa, Dee, Paracelsus, alchemy** | The largest esotericism gap |
| 09 Modern | **Chinese popular religion and its modern forms: Taiping, Yiguandao, Falun Gong, Cao Đài** *or* **Cunning folk, grimoires and the Satanic Panic** | Folk religion, East Asia |

Other strong candidates: Jewish folk religion (golem, dybbuk, amulets); Finno-Ugric and the Kalevala; the LDS Church and American prophetic religion as a chapter of its own; an era theme on **pilgrimage** or **divination**.

---

## 6. Questions for Carter

1. **"Passed"**: does it clear all 18 (ch66–ch83), only Batch III, or some other set? Does it include V88?
2. May I fix A, B and C, and the doc sync, as one "fixes" batch before any new chapters?
3. Batch V: accept the table above, or swap topics?
4. V76 English entry: a summary of the Báb's text (no image), yes or no?
5. Benin Bronzes scan: still held?
