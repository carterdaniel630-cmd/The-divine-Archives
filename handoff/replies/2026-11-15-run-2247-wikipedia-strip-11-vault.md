# Loop run 2026-11-15 22:47 UTC: Wikipedia strip, part 10 (the Vault) + review-checks Vault parity

**Order:** `handoff/order-2026-11-11-wikipedia-strip.md`. Item: STATUS 0fb (1).
**Session:** ..01HFWzToHofH6REksVyk3KJC. It built #158 and #159 and **must not review either**.
**Branches:**
- `loop/review-checks-vault-sources` `089441d5` (PR **#158**), one commit on `main` `fa81753b`;
- `loop/wikipedia-strip-11` `63cd573e` (PR **#159**), two commits stacked on #158.

## In plain words
All 170 Wikipedia links are gone from the Sources lists of the 85 Vault entries and the Rök Stone, Decoded page. No page text changed.
The site's own pre-merge checker would have blocked this, though. For chapters it already allows a change that touches only the Sources list; for the Vault it didn't. So I gave the Vault the same rule, in a separate small PR (#158). Because that changes a review gate, it needs Carter's yes.

## #158: checker change (`tools/review-checks.js` only)
- A cleared Vault entry is treated like a chapter: if the registry entry is unchanged and the markdown is unchanged outside `## Sources`, the result is WARN ("re-check the new sources at review"); anything else still fails.
- The Pantheon footnote now prints only when there is a Pantheon warning.
- Tested on a scratch commit: a prose line in cleared V04 → **FAIL**; a Sources-only removal in V09 → **WARN**.
- **Needs Carter's per-item yes** (beyond list removal, so the strip yes does not cover it) plus an independent review.

## #159: the strip
- **Rule (same as parts 5–9):**
  - A bullet whose only citation was Wikipedia is removed whole: 168 bullets, two of which held two Wikipedia links each (V05, V13, V24 and V26 pairs counted as one bullet).
  - V08 "Gospel of Thomas" Wikipedia + NASSCAL became "- NASSCAL e-Clavis, https://www.nasscal.com/e-clavis-christian-apocrypha/gospel-of-thomas/". **Reviewer: judge whether the bullet should keep "Gospel of Thomas" as a label.**
- **Emptied subsections removed (5):** V03 *Doreal*, V34 *The pyramid and its texts*, V37 *Comparisons*, V66 *Ark and tradition*, V73 *The stele*.
- **No Sources section emptied.** Fewest left: 2 (V27 Sacred Tooth Relic).
- **Rök Stone, Decoded:** a hand-authored page with no generator. Its "(a pointer only)" Wikipedia `<li>` was removed (order item 3); no other change.
- **Prose mentions left standing:** none. Every wikipedia.org hit in `vault/*.md` was inside `## Sources`.
- **Not touched:** the internal `sources/*.md` citation logs (not site pages; same as earlier parts), and `docs/museum` (1 page, outside this part).
- **Changed files:** 85 `vault/*.md`, 86 `docs/vault/*.html`, `content/dates.json`, `docs/sitemap.xml`, `docs/assets/search-index.json`. The search index changed only for V52 and V59, because its 3,200-character text window now reaches different source lines.

## Sole-source flags (order item 5), numbering from 121
This is a **heuristic, not a reading of each claim:** the subject of a removed article is named by no remaining source in that entry's list. The remaining sources were not opened.
121. V02/V48: Qumran Cave 1 manuscript list
122. V03: Hugo of Santalla; Doreal's "Emerald Tablets of Thoth" (whole subsection gone)
123. V04: Geoffroi de Charny; Secondo Pia; Pray Codex
124. V05: Bayezid II / Innocent VIII gift; Ravenscroft's *Spear of Destiny*
125. V06: Baldwin II; Sainte-Chapelle
126. V07: Church of Our Lady Mary of Zion; Kiriath-Jearim
127. V08: *The Thunder, Perfect Mind*
128. V13: Marcos Cipac de Aquino; Lasso de la Vega; Antonio Valeriano
129. V14 Holy Grail (3 sources left): Sacro Catino; Doña Urraca chalice; Robert de Boron; Priory of Sion
130. V15: Judas Cyriacus
131. V24: Arca Santa; Cámara Santa
132. V26 Black Stone: Qarmatians, sack of Mecca. *Living sacred object; re-source with care.*
133. V27 Sacred Tooth Relic (2 left): 1998 attack; Esala Perahera. *Living sacred object.*
134. V28: Codex Parisino-petropolitanus
135. V33: Dhir Mal
136. V34: Gaston Maspero; the pyramid sources subsection (gone)
137. V37: Cernunnos (subsection gone)
138. V53: *Lettre à M. Dacier*; Philae obelisk
139. V55: Yinxu
140. V56: Luigi Pernier
141. V57: Abgar V; acheiropoieta
142. V58: Löwenmensch overview
143. V61: Motoori Norinaga
144. V63: Paryushana
145. V65: Staff God
146. V66: Kebra Nagast overview; Mary of Zion; tabot (subsection gone). *Living tradition.*
147. V71: stećak; Radimlja
148. V73: Stele of Ankh-ef-en-Khonsu (subsection gone)
149. V75: Anthon Transcript
150. V77: poto mitan. *Living tradition.*
151. V78: Helena Scheuberin; Jacob Sprenger
152. V82: Bardo Thodol overview; Karma Lingpa
153. V84: Chi Rho
154. V87: Hitfun. *Living tradition.*
155. V88: Vézelay Abbey

## Checks (on `63cd573e`)
- **Full build order:** stamp-dates, og, vault, chapters, pages, museum, framework, entity-registry. Rebuilding again gives no diff.
- **Code checks:**
  - review-checks `--base origin/main --build`: **9 pass / 0 fail / 1 warn** (sources-only for the cleared entries; this needs #158);
  - verify 18/18; tests 51/51.
- **Crawl:** 0 wikipedia.org on all 86 built Vault pages and `vault.html`.
- **Headless Chromium:** 86 pages × 360/390 px. Standards mode, 0 script errors, no empty list items or lists, Sources present, no Wikipedia anchors.
  - One exception: **rosetta-stone has 11 px overflow at 360**, from the hieroglyph cartouche (`.ct-ring`). It is identical on `main` `fa81753b` and not introduced here, probably a font fallback because the sandbox blocks Google Fonts. It is worth a look on a real phone.
- The graphify CLI is not installed in this session (`graphify update` could not run). Only one tool file changed.

## Merge
Not merged. Still missing:
- **#158:**
  - Carter's per-item yes;
  - an independent review by a session other than ..01HFWzToHofH6REksVyk3KJC;
  - GitHub green incl. Lighthouse.
- **#159** (per item on Carter's strip yes):
  - #158 merged first;
  - an independent review of `089441d5..63cd573e` by another session;
  - GitHub green incl. Lighthouse on `63cd573e`.
