# Tjurunga takedown built — PR #73 (build loop, 2026-10-24 ~21:47–22:35 UTC)

**Item:** STATUS Next 2, Carter's ruling 2026-10-20 (`tjurunga-takedown-order-2026-10-20.md`) plus the one-line
`random.html` description (`fix-random-meta-description.md`).
**Branch:** `loop/tjurunga-absence` @ `529b1eb` (from `main` `09f48b3`). **PR #73.** Not merged.

## What it does (order §2, point by point)
1. Vault index: V68 card removed; "Everything (87)"; no code renumbered. No other copy states a count.
2. `vault/tjurunga.html`: same URL, now "The Tjurunga of Central Australia — Not Shown", §3 wording verbatim, the
   last sentence linked to ch61; honesty section trimmed to the absence; sources kept (Durkheim dropped because the
   text no longer discusses him; noted in `sources/v68-tjurunga.md`). No image, viewer, IIIF box or "Study the object".
3. Museum directory: §3 room note, verbatim, in place of the Vault link (before "Pantheon: The Rainbow Serpent",
   which stays). The 3D museum's manifest and Prehistory wing no longer carry V68.
4. Era IX page: link removed, no replacement.
5. ch61: prose untouched. Its one Vault link now reads "Why the archive does not show the tjurunga", same URL.
6. Sitemap: URL kept (house call), lastmod 2026-10-24.
Also: search index no longer lists it; entity registry drops `relic:v68` from the room and its link.
The share card is re-rendered as "… — Not Shown / An absence, kept on purpose" (era emblem only, no object), and
the page keeps its dates, so **nothing is deleted** (the first build would have removed the old card; changed
`build-og.js` and `stamp-dates.js` instead).

How: one new Vault status, `withdrawn`. Every builder lists only `published` items, so the object drops out of every
list by itself; `build-vault.js` writes the absence page, `build-chapters.js` keeps the relabelled link,
`build-museum.js` places the room note.

## Checks
- Full build order, then a second run: nothing changes (idempotent).
- `review-checks.js --base origin/main --build`: 9/9, 0 warnings. pending-diff sees 0 changed items because a
  withdrawn entry is not published content; the absence wording is Carter's own ruling, so it carries no pending tag.
- 17/17 verify scripts; 42/42 tests.
- Headless phone (390 px): absence page, ch61, museum, Vault, Era IX, random: 0 script errors, no sideways scroll,
  0 images on the absence page. Screenshots: `handoff/previews/tjurunga-absence-phone.png`,
  `handoff/previews/tjurunga-ch61-link-phone.png`.

## Left as is (noted, not in the order)
- `docs/museum/english.js` still has a `v68` line (why no translation is given). Nothing can open it now that the
  object is out of the museum. It names the designs' general kind ("circles, lines, arcs"); a later run can drop it
  if Carter wants every trace gone.
- §5 (chapter prose) stays a separate ruling, as the order says. §6 is Muse-side.

## Still needed before merge
Independent review by a run that wrote none of this; every GitHub check green on `529b1eb`, Lighthouse included;
Carter's yes for PR #73.

## PR #70 this run
6/6 checks done except Lighthouse, still running at 22:30 UTC (started 21:45). Not waited on; the next run merges it
if green.
