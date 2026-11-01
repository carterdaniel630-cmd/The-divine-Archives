# 2026-11-01 ~08:42–09:05 UTC — build loop run: independent review of PR #96 (share images, six pages)

**Reviewer:** a fresh loop run that wrote none of PR #96 (built by the 06:42 UTC run).
**Candidate:** `loop/share-images-six` @ `842b51e` (15 files, +172/−4: six JPEGs in `docs/assets/share/`, tags on six
pages, `tools/seo.js` `PAGE_SHARE`, `tools/build-pages.js`, new `tools/verify-share-images.js`).
**Verdict: NOT MERGEABLE — 1 NEEDS CARTER, 1 fixable (back to a builder run), 2 notes.**

## Step one: automatic checks (clean worktree of `842b51e`)
- Full build order (stamp-dates → build-og → vault → chapters → pages → museum → framework → entity-registry): **0 changes**.
- `tools/verify-*.js`: **18/18** pass (incl. the new `verify-share-images.js`: 6/6, sizes match).
- `node --test framework/test/*.test.js`: **42/42**.
- `review-checks.js --base origin/main --build`: **9 passed, 0 failed, 0 warnings**.
- Headless phone, 360 and 390 px × six pages: **0 script errors, no sideways scroll, every og:image serves (200)**.
  `random.html` redirects to a chapter as designed (crawlers read the raw tags, which are present).
- GitHub on `842b51e`: **9/9 green incl. Lighthouse** (07:09 UTC).
- Branch is **3 commits behind `main` `ff08cc1`**; a trial merge is clean. Needs a re-sync and re-check before any merge.

## Step two: checklist
| # | Item | Result |
|---|------|--------|
| 1 | Accuracy | Text pass: "Khufu around 2560 BCE" matches the site's own chapter text (`content/chapters.js` l.235); Qumran "among the earliest known Hebrew Bible manuscripts" and the Library line are hedged correctly. **Images: see findings 1 and 2.** |
| 2–4 | Lens / tiers / contested | n/a (no chapter text changed). |
| 5 | Tone | pass. |
| 6 | Sensitivity | No restricted site, sacred object or revered person shown. Qumran shows a storage-jar form, not a scroll text. Giza is not (S)/(R). pass. New images on holy/historic-site pages → per-item Carter yes (already required). |
| 7 | Games/3D | Pages open clean, see above. |

## Findings
1. **NEEDS CARTER — the museum share card carries garbled and wrong text** (`docs/assets/share/museum.jpg`). I viewed it
   at full size. It is generated art, and its lettering would go out on every shared museum link:
   - garbled words: "Path aya beine Ages" (lower path), "Tlẏcyeans" (river label), "Chapter Ropm" (Renaissance block);
   - **two different "Wing II"s** ("Wing II Classical" on the left, "Wing II Civilization" at the bottom);
   - wing names that are **not the site's nine eras** ("Classical Empire", "Egyptian Sands", "Renaissance",
     "Wing VII Enlightenment", "Wing V Medieval"; the site's eras are Prehistory, Bronze Age, Early Iron Age, Axial Age,
     Late Antiquity, Early Medieval, High Medieval, Early Modern, Modern);
   - title "Section VII – The Museum", which matches no section of the site.
   The alt text ("nine wings along the Path of the Nine Ages") describes a cleaner map than the one shown.
   A reviewer may not swap a picked image, and the pick was made on Carter's authority (atlas, 2026-10-25), so this is
   Carter's call. Options: **(a)** ship #96 with five images and drop the museum card for now (museum page keeps no image,
   as today); **(b)** hold all of #96 until atlas supplies a museum image without lettering or with correct lettering.
   Recommendation: **(a)** — the other five are clean and the fix is quick.
2. **Fixable (honesty wording, class (c)) — the Great Pyramid alt reads as a photograph.** Per the pick note
   (`handoff/share-images-2026-10-25.md` §4) the image is "a frame from the Archives' own Great Pyramid video", i.e.
   made, not photographed. The Library card says so ("An evocation, not a photograph: …"); the pyramid's alt ("The
   pyramids at Giza in warm light, their stone courses visible") does not. Also: the front pyramid's capped apex looks
   like **Khafre's** (the one that keeps its casing at the top), so "the Great Pyramid and its neighbour" is not clearly
   right. Suggested alt for a builder run: "A rendering, not a photograph: pyramids at Giza in warm light". Changing alt
   wording is not on the reviewer's self-fix list (REVIEWER.md §5), so it goes back to a builder run; the fix delta then
   needs its own independent review.
3. **Note — Qumran card is portrait (900×1440)** while the tag says `summary_large_image`. X and Facebook crop large
   cards to about 1.91:1 from the centre, so the shared card will likely show the jar's middle without its lid. Not
   wrong; the pick note chose it knowingly. Worth a landscape crop later.
4. **Note — `museum.jpg` is 0.27 MB**, now the 6th-largest file in `docs/`. Only fetched by link-preview crawlers, so no
   visitor cost. No action.

## What #96 still needs
Carter's answer on finding 1 → builder run fixes finding 2 (and drops/replaces the museum card per Carter) → re-sync to
`main` → independent review of the delta → GitHub checks green → Carter's per-item yes (new build; never by class).

Filed on `review-log` (copy in `reviews/loop/`, index `reviews/2026-11-01-loop-pr96-share-images.md`, line in `reviews/runs.md`).
Graph: `graphify` CLI not installed in this session; no code was changed by this run (review only).
Items per run: 1.
