# Independent review — PR #149, Wikipedia strip part 2, era 03 (2026-11-15 ~13:55 UTC)

**Verdict: FIXABLE, 1 open finding (F1).**
- **Candidate:** `loop/wikipedia-strip-03` @ `c4c6c77a` (PR #149), the re-sync merge of `loop/sources-wrap-fix` `d35f9115` (which carries `main` `7b9ba66e`) into the strip commit `fe1f5506`.
- **Reviewer:** session ..01HFWzTmo6UmrXqvGu5Yu3eX. It wrote none of the candidate and did not do the re-sync. Builder was ..01HFWzTkQDY1ZmPNWr39GST6; re-sync by ..01HFWzToHU52frgsDom5N2UW.
- **Against:** `reviews/REVIEWER.md` §3–§4 and `handoff/order-2026-11-11-wikipedia-strip.md`.
- **Scope:** the strip delta `d35f9115..c4c6c77a`. The `loop/sources-wrap-fix` part (PR #147) was already reviewed (PASS, `2026-11-15-sources-wrap-fix-resync-delta-review.md`) and is not re-reviewed here.

## Re-sync check
The content delta `d35f9115..c4c6c77a` in `eras/`, `content/chapters.js` and `docs/chapters/` is **line-for-line identical** to the builder's reviewed-for-review diff `02a870b8..fe1f5506` (only hunk offsets differ). `content/dates.json` and `docs/sitemap.xml` change only dates/hashes; the five built pages change only their `<li>` lines and the JSON-LD `dateModified` (2026-09-05 → 2026-11-15 on ch06, same shape on the others). The re-sync added nothing.

## Automatic checks (§3), on `c4c6c77a`
- `node tools/review-checks.js --base origin/main --build`: **9 pass / 0 fail / 1 warn** (the expected "sources only, stays cleared" for the 15 sources-touched chapters). The build left the tree clean.
- `tools/verify-*.js` 18/18; `node --test framework/test/*.test.js` 51 pass / 0 fail.
- Crawl: `grep -ci wikipedia` = 0 on all 7 era 03 markdown files and all 7 built pages (ch06, 07, 08, 09, 58, 68, 77).
- Headless Chromium, ch06/07/08/09/58 at 360 and 390: standards mode, 0 script errors, no sideways overflow, 0 wikipedia anchors, 0 Sources items ending on a dangling "—", ";", ",", "in" or "and". Pending banners same as `main` (only ch08 has one, unchanged).
- GitHub on PR #149: **10/10 checks completed green, Lighthouse included** (Lighthouse finished 13:33 UTC).
- graphify CLI not installed in this session; no code was touched by the candidate's strip part, and this run changed only `handoff/`.

## Checklist (§4) against the order
- **15 removals, all Wikipedia: pass.** ch06 2, ch07 5, ch08 3, ch09 4, ch58 1, matching the builder's table. Every other source in each mixed bullet is kept word for word (Iranica, Britannica hvarenah, BAS ×2, WHE Asherah, Graf & Johnston, Smarthistory, Keightley, Waley, Encyclopedia.com / NWE).
- **List removal only (item 2): pass.** All changed lines sit under `## Sources` / inside `<div class="sources">`. No prose changed; no era 03 body text names Wikipedia.
- **Empty subsections (item 4): pass.** None left empty.
- **Sole-source flags (item 5): pass.** The 10 flags match the diff; none missed. Bundahishn stays named as a primary text elsewhere in ch06's list (line ~355), so its removal there is clean.
- **Cleared / pending: pass.** Sources only; no tag cleared.
- **Sensitivity: pass.** ch07 (sensitive-topic chapter) loses only list links; no claim text, image or sacred-object change.
- **Partial-bullet rule: one inconsistency → F1.**

## F1 (fixable) — ch07 drops two object names the builder's own rule keeps
**Where:** `eras/03-early-iron-age/ch07-pre-exilic-israel-early-iron-age.md`, `## Sources` → *Origins and emergence* and *Yahweh, El, Asherah…*, and the same `<li>` lines in `content/chapters.js`.

**What happened:** the builder's stated rule (reply `2026-11-15-run-1242-wikipedia-strip-03.md`, following part 1's F1) is: "Only the Wikipedia link goes. Names of primary texts and objects stay as plain text." It was applied to the Tel Dan Stele and the Ketef Hinnom scrolls, but not to two other inscriptions whose names were the link text:
- `[Wikipedia: Merneptah Stele]; [Biblical Archaeology Society: the first mention of Israel](…)` became just the BAS link. The list no longer names the stele it is about.
- `…[BAS: Kuntillet Ajrud](…); [Wikipedia: Khirbet el-Qom](…).` lost "Khirbet el-Qom" entirely. The chapter discusses that inscription by name (lines ~12, ~301, ~393), and flag 3 already marks it as now unsourced; dropping the name also hides what the flag refers to.

This is the same kind of slip as part 1's F1 (ch05 hymn names), which was fixed.

**Fix (exact wording; only the link text goes, as with Tel Dan):**
```
- The Merneptah Stele: [Biblical Archaeology Society: the first mention of Israel](https://www.biblicalarchaeology.org/daily/ancient-cultures/ancient-israel/does-the-merneptah-stele-contain-the-first-mention-of-israel/).
```
and in the Asherah bullet:
```
  [Biblical Archaeology Society: Kuntillet Ajrud](…unchanged…);
  Khirbet el-Qom.
```
Make the two matching `<li>` in ch07's Sources block in `content/chapters.js` with `tools/md-to-chapter.js`, rebuild ch07 + dates/sitemap, re-run all checks. Any session may fix, including the builder; a session that did not write the fix then does a delta review. Not fixed here: §5 allows only mechanical slips, and this restores list content (same call as part 1).

## Notes (not findings)
- **N1 — topic labels dropped, judged acceptable:** "Kenite hypothesis" (ch07), "Eleusinian Mysteries" (ch08), "Taotie" and "Human sacrifice…" (ch09) were link-only topic labels, not texts or objects; the builder's rule drops them and each bullet still reads as a sentence. The ideas stay named in each chapter's prose and in flags 2, 5, 8, 9. A later re-sourcing pass may want to put the names back alongside new sources.
- **N2 — "The"/"the" added on the Tel Dan line:** fine; reads as a sentence and adds no claim.
- **N3 — merge class:** per item (Carter's 11-11 ruling is the yes for strip parts, `decisions-2026-11-15-carter-a-prs-yes-wikipedia.md`). Merges after #147, which it contains.

## Still missing before merge
1. F1 fixed on `loop/wikipedia-strip-03`, then a delta review by a session that did not write the fix.
2. GitHub green incl. Lighthouse on the new head.
3. #147 merged first (it is the base), which itself waits on Carter's yes.
