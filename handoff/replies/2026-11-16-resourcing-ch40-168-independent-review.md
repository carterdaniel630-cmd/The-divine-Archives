# Independent review — PR #168, ch40 re-sourcing (flags 110–111)

**Reviewer:** build loop run ..01HFWzToUe2EcQZF3py63WkK (scheduled), 2026-11-16 ~10:35 UTC. Wrote none of the candidate.
**Candidate:** `loop/resourcing-ch40` `7396a6db`, diff `56d7c9d6..7396a6db` (6 files: ch40 markdown Sources + `content/chapters.js` `<li>` lines, `docs/chapters/ch40.html`, `content/dates.json`, `docs/sitemap.xml`, `sources/ch40-diaspora-religions.md`).
**Verdict: FIXABLE — 4 findings (F1–F4), all honesty-wording / URL fixes inside the new source entries. No body text, no religious-sensitivity rule, no fake source.**

## Step one: automatic checks (on `7396a6db`, own worktree)
- `review-checks.js --base origin/main --build`: 9 pass / 0 fail / 2 warn (sources-only change stays cleared; source log's history lines carry an 80% Wikipedia share — history, the page list has 0). Build left the tree clean.
- `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 51/51.
- Headless Chromium, `chapters/ch40.html` at 360 / 390 / 1280: standards mode, 0 horizontal overflow, 0 page errors, 13 Sources items, no "wikipedia" in page text.
- GitHub on `7396a6db`: 9/10 completed green (checks, guard, originality, verify ×2, runtime ×2, test, links); **Lighthouse in progress** (started 10:21 UTC).

## Step two: every new source opened and checked
| # | Entry | Opened | Result |
|---|---|---|---|
| 1 | Duffy (ed.), "Early accounts of the Bois Caïman ceremony," Miami U., © 2021 | sites.miamioh.edu PDF | Dalmas 1793–94/1814, Choiseul estate, "A pig, entirely black" ✔; Ardouin 1841/1865, priestess, black pig, Boukman kneeling oath ✔. **F1** |
| 2 | Strickland, *Religion & Slavery*, "Bois Caïman documents" | religionandslavery.org | Dalmas via Geggus 78–79 ✔; Métral 1818 "the 14th", Lenormand, young priestess, "terrible oaths" ✔; Dumesle 1824 mid-August, storm, a bull ✔. Page credits Strickland in its footer (no byline on the text) — acceptable as the site's author/editor. |
| 3 | Shilliam, "Race and Revolution at Bwa Kayiman" | core.ac.uk PDF | 14 Aug Lenormand de Mézy meeting, 21 Aug Bwa Kayiman called by Boukman ✔; Geggus's reading and critics (Bhambra, Hutton, Beauvoir-Dominique) ✔. **F2** |
| 4 | Britannica, "Haitian Revolution" | britannica.com | "thousands of slaves rose", 1 Jan 1804, "first country to be founded by former slaves" ✔; no Boukman/Bois Caïman, no "only slave revolution" ✔ (entry's own caveat is accurate). |
| 5 | Davis, *Botanical Museum Leaflets* 29(2) 1983, 139–149 | anoleannals.org scan | Header vol/issue/pages ✔ (author line OCR-garbled; self-citation "Davis 1983" confirms); "physical states of simulated death" ✔; conditional "if zombification has a real pharmacological basis" ✔; "forced to toil indefinitely as slaves" ✔ and the entry correctly calls it the popular belief. Pass. |
| 6 | Hahn, "Dead Man Walking," Biology Online 2007 | biologyonline.com | Narcisse pronounced dead 2 May 1962 at Albert Schweitzer Hospital, back 18 years later ✔; both Davis books ✔; Yasumoto & Kao two samples, trace TTX ✔; Benedek & Rivier counter-measurement ✔; "depersonalization and loss of liberty" ✔; sympathetic to Davis ✔ (concludes "the smart money is on Davis's thesis"). "insignificant traces" quoted from the entry was not separately confirmed verbatim by the fetch (it reported "trace amounts, 64 ng/g or less") — see F3 note. |
| 7 | Corbett, review of *Passage of Darkness*, Webster U., March 1990 | faculty.webster.edu | Booth, "Voodoo Science," *Science* 15 Apr 1988 ✔; "grossly exaggerated what he had found in the powder" ✔; "zombification is a form of social sanction" ✔. Pass. |
| 8 | Yasumoto & Kao, *Toxicon* 24(8) 1986, 747–749 | scilit.com record | Authors, journal, vol/issue/pages, DOI `10.1016/0041-0101(86)90098-x` all ✔; "not read" label honest. Pass. |
| 9 | Littlewood, "The plight of the living dead," *THE*, 28 Nov 1997 | timeshighereducation.com (canonical URL) | Organic brain syndrome + epilepsy ✔; learning disability ✔; "mistaken identification of a wandering mentally ill stranger by bereaved relatives … most likely explanation in many cases" ✔; "cannot exclude the possibility" ✔. **F3, F4** |

## Findings
- **F1 (fixable, honesty wording) — Duffy entry claims an editor's note the source does not contain.** The editor does **not** remark that the two accounts place the wood on different estates (Dalmas: Choiseul; Ardouin: Lenormand) — that is our reading of the two texts. The editor says Ardouin's account "may be based on information told to him fifty years after the event", and that the mambo "since the late 20th century, has been identified by the name Cécile Fatiman". Replace the last sentence of the entry with:
  > The two accounts place the wood on different estates (Choiseul in Dalmas, Lenormand in Ardouin). The editor notes that Ardouin's account may rest on information told to him about fifty years after the event, and that the priestess has been identified by the name "Cécile Fatiman" since the late twentieth century.
- **F2 (fixable, label) — Shilliam called an "author's accepted manuscript".** The PDF says only "Forthcoming in *Millennium* (2017)"; "accepted" appears nowhere. Change "(Queen Mary University of London; author's accepted manuscript for *Millennium: Journal of International Studies*, 2017)" to "(Queen Mary University of London; pre-publication version marked "Forthcoming in *Millennium*" (2017))". Same wording in the source log line.
- **F3 (fixable, slight overreach) — Littlewood DNA wording.** "DNA tests showing neither was related to the family that claimed them" is stronger than the article: Wilfred was "not the son of his putative parents"; Marie was related "neither to Michel, nor to her brother", though probably the mother of her Cabaret "daughter". Change to: "DNA tests showing the man was not the son of the parents who claimed him, and the woman was not related to the man and brother who claimed her". Hahn note: while there, either confirm "insignificant traces" verbatim in Hahn or change to "only trace amounts".
- **F4 (fixable, URL) — Littlewood link.** The cited `https://timeshighereducation.com/node/96226` could not be confirmed to resolve to this article; the confirmed canonical URL is `https://www.timeshighereducation.com/features/the-plight-of-the-living-dead/104813.article`. Use it.

## Checklist (§4)
1. Accuracy: 9/9 sources exist and load; 5 pass outright, F1–F4 above. No fake source.
2. Lens balance: Davis's hypothesis (his own paper + sympathetic Hahn) and its critics (Booth via Corbett, Yasumoto & Kao, Littlewood) both present, each labelled. Pass.
3. Evidence tiers: body unchanged. Pass.
4. Contested claims: Bois Caïman date/estate/sacrifice differences and Geggus debate named, not resolved; Hoffmann gap stated. Pass.
5. Tone: descriptive. Pass.
6. Religious sensitivity: Vodou is a living tradition; nothing frames it as extinct or primitive; no new images. Sources-only, but the item stays **per item** (MERGEABLE already says so).
7. Games/3D: none touched.

## What it needs now
F1–F4 applied on `loop/resourcing-ch40` (any session, the builder included; edit the markdown + source log, regenerate `content/chapters.js` `<li>` lines and the page by the build order), then a **delta review** by a session that wrote none of the fix (this reviewer may do it), GitHub green incl. Lighthouse on the new head, and **Carter's per-item yes**.
