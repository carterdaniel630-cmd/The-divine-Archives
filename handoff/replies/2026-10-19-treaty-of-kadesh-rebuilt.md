# Build loop, 2026-10-19 ~06:15–06:35 UTC: Treaty of Kadesh tablet rebuilt (relic 1 of 4); PR #72 all checks green

**Short version.** First of the four approved relics (`briefing-2026-10-18-relic-catchup.md`, Next 2) analyzed and
rebuilt better, as a preview only (`handoff/`, nothing on the site): `handoff/previews/treaty-of-kadesh/index.html`.
The old Muse file is left where it was. Same run: **PR #72 Lighthouse finished green** (06:19 UTC), so #72 is now 7/7.

Open on a phone:
`https://raw.githack.com/carterdaniel630-cmd/the-divine-archives/dd676f6682b498eb24dc218902dc8f2eec76c732/handoff/previews/treaty-of-kadesh/index.html`

## What was wrong with the Muse starting point
1. **It could not show the tablet at all.** It loaded `three.min.js` from its own folder; that file was never pushed, and
   the repo's vendored three.js (r186) is module-only. Fixed: loads `docs/assets/vendor/three/three.module.min.js`
   through an import map, the same way the pilgrimage pages do. A 12-second fallback message shows if 3D cannot start.
2. **The "cuneiform" was random triangles.** Now every mark is a pressed wedge: a triangular head deepest where the
   stylus corner went in, and a tapering tail, in horizontal, vertical, slanting and corner (Winkelhaken) shapes, grouped
   into sign-like clusters with word gaps, on faint ruled lines, with a double line between sections. Drawn as a height
   field, turned into a normal map, and lit by a low raking light, so every wedge throws a shadow. Pale dust sits in the
   grooves; edges are darker from handling; shallow cracks. Still labelled as representative and not readable.
3. **The tablet was a flat box.** Now a rounded, cushion-shaped clay tablet that swells toward the middle, slightly
   tapered and uneven, seated on a cradle in a museum case.
4. **Turning it over was a sideways spin.** "Turn it over" now flips it top over bottom, the way a scribe turned a
   tablet, and the back reads upright after the flip. Free turning in any direction (trackball), pinch and scroll zoom,
   a Front/Back label that follows the tablet.
5. **Invented quotations.** Each clause had a made-up line in quotation marks ("We are brothers now…") that a visitor
   could take for the treaty's words. Replaced with "In short:" lines with no quote marks (Content Truth Policy; Carter's
   "plain words, never verbatim").
6. **Unchecked facts.** "Smaller fragments in Ankara and St Petersburg" could not be sourced: removed. "Egypt worried
   about the Sea Peoples" as the reason for peace: replaced with the sourced picture (Hattusili's position at home, his
   deposed nephew in Egypt, a rising Assyria). The 2026 Hattusa fragment was checked and is real (announced Sept 2026,
   Büyükkale, articles 12–20, refugees' homes not to be destroyed): kept, now sourced, and its clause added to the
   fugitives clause.
7. **No evidence-honesty section.** Added: well supported / not supported / still debated (the year: about 1259 BCE vs
   the 1269 BCE on UN and Turkish labels; who asked for peace), plus a sources list on the page.
8. Smaller: tap targets at least 44 px; pinch-zoom of the page no longer blocked; phones draw at pixel ratio 1 (museum
   ruling); reduced motion turns off the idle sway and the animated swings; tapping a section lights that section on
   the tablet; the Egyptian companion panel redrawn as sunk relief, still labelled "not a copy of the real walls".

## Clauses (Hittite version, plain words)
1 Peace and brotherhood forever, binding heirs · 2 No attacks · 3 Help against enemies and rebels · 4 Fugitives sent
home, with mercy (no punishment, no maiming, families and homes spared) · 5 Egypt backs Hattusili's heir (Hittite
version only) · 6 A thousand gods and the mountains, rivers, sky, sea, winds and clouds as witnesses; curses and blessings.

## Sources (opened this run)
- Wikipedia, "Egyptian–Hittite peace treaty": https://en.wikipedia.org/wiki/Egyptian%E2%80%93Hittite_peace_treaty :
  about 1259 BC, 21st year; three Akkadian tablets found at Hattusa 1906, two in Istanbul, one in Berlin; Karnak (south of
  the Great Hypostyle Hall) and Ramesseum versions; clauses; witnesses list; Kadesh not mentioned; envoys, likely never
  met; who sought peace debated; Hittite princess married Ramesses in his 34th year.
- Hunt et al. reader, "The 'Eternal Treaty' … (c. 1259 B.C.E.)", Hittite version:
  https://digfir-published.macmillanusa.com/hunt4e/hunt4e_ch01_6.html : silver tablet; fugitives "let them not exact
  punishment", "let them not tear out their eyes"; the son of Hattusili to be king.
- Smithsonian Magazine, 23 Sept 2026: https://www.smithsonianmag.com/smart-news/researchers-in-turkey-have-unearthed-an-ancient-fragment-inscribed-with-the-worlds-oldest-peace-treaty-180989554/ :
  Büyükkale fragment, articles 12–20, refugees' homes; silver originals lost; copper replica at the UN.
- UN Gifts: https://www.un.org/ungifts/node/615 : copper bas-relief replica, given by Türkiye 24 Sept 1970, second-floor
  delegates corridor near the Security Council; gives 1269 BC.
- Not used: a description of the seal images on the silver tablet (in the Egyptian version) could not be confirmed from a
  source opened this run, so it is left out rather than written from memory.

## Checks
- Headless phone (iPhone 13 size), both motion modes: tablet ready in 1.2–2.7 s (software graphics); tapping the face
  selects clause 1; "Turn it over" shows "Back (reverse)"; clause 4 chip turns to the back and lights its section; zoom
  works; no sideways scroll (390 px); **0 script errors, 0 console errors, 0 failed requests**.
  Screenshots: `handoff/previews/treaty-of-kadesh/shots/` (front, back with clause 4 lit, zoomed back, full page).
- Full build order (stamp-dates, og, vault, chapters, pages, museum, framework, entity registry, sky): no file changed.
  17 verify scripts green; framework tests 42/42; `review-checks.js --base origin/main --build`: 9 passed, 0 failed,
  0 warnings.
- Not measured: real-phone frame rate. Proportions of the tablet are a reconstruction (no published dimensions found for
  the Istanbul copy this run); the page says so.

## Needs Carter (added)
- **Treaty of Kadesh tablet preview:** open it and say **looks right / change something**. Putting it in the museum is a
  separate yes later (new exhibit).

## Next
- Relic 2 of 4: Crown of the Kandake (gold, labelled as a reconstruction), then the Etruscan mirror, one per run.
  Crown of Thorns last; its museum placement goes to Carter.
