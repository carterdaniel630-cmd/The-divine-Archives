# Run 2026-11-02 00:42 UTC — PR #111 built: ch01 Ark Tablet build correction

**Item:** Carter's approved truth correction `handoff/note-2026-11-01-ark-build-correction.md` (value 1: an over-claim live on the site).
**Branch / PR:** `loop/ark-build-correction` **`5daa7f4`** (parent = `main` `fe7481c`), PR #111.

## What changed
- ch01 *The Flood* (`content/chapters.js`, `themes/ch01-the-flood.md`, built `docs/chapters/ch01.html`): the sentence
  "a full-scale attempt … broadly vindicated the design" now reads: "the same year a television team built a
  scaled-down version of the round ark in Kerala, India, at roughly a third of the tablet's size. It floated, but it
  leaked from the start and needed a pump running continuously to stay up: a test of the boat type, not proof that
  the full-size design would have worked."
- Differences from the note's suggested shape: "bitumen seams" left out (no checked source states it); scale given
  as "roughly a third" because Wikipedia says one-third and The Telegraph (India) says "bigger than one-fifth".
- Twin search (`full-scale`, `vindicated`, Kerala, Alleppey, replica near the ark) across the repo: no other page
  carries the claim.
- **ch01 back to pending** (it was cleared): `pending: true` in `docs/assets/data.js`, recorded under `reopened` in
  `reviews/cleared.json` (ch42 precedent, 2026-10-25). The pending-diff gate needs this or a Carter re-clear; the loop
  cannot clear. The live chapter page and listings will show "Recently added · pending review" until Carter re-clears.
- Source log `sources/ch01-the-flood.md`: correction log with the sources checked 2026-11-02 (Wikipedia replica page;
  Channel 4 press release; The Telegraph (India) — its own URL could not be opened, a copy was read; said so).
- Build outputs: dates.json + sitemap lastmod for ch01, listing badges, museum manifest/rotunda, entity registry
  (+2 sources).

## Checks on `5daa7f4`
- Full build order incl. stamp-dates and entity registry; output matches committed.
- `review-checks --base origin/main --build`: 8 PASS + 1 WARN (ch01 source log 24% Wikipedia, 4/17).
- verify 18/18; `node --test framework/test/*.test.js` 42/42.
- Headless 360×740 and 390×844: ch01, themes, museum — no sideways scroll, pending banner on ch01, new sentence
  present, old sentence gone, no script errors (only the sandbox's blocked web-font request).

## Still needed to merge
1. Independent review by a run that wrote none of it (builder session:
   session_01HFWzTnCsxbnXXXdHqVMgLA).
2. All GitHub checks green on `5daa7f4`, Lighthouse included.
3. Merge class: (c) honesty-wording fix, Carter-approved in substance. Reviewer to confirm it is not "religiously
   sensitive" (flood/ark history, no sacred object); if in doubt, per item. Putting ch01 back to pending is the
   gate's safe direction, not a clearance.

## Not done this run
- graphify CLI not checked/used this run (text-only fix; no code touched).
- Chain: attempted at end of run (see STATUS).
