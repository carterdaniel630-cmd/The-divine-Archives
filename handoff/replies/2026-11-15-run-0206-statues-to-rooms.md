# 2026-11-15 ~02:06–02:35 UTC — Rotunda statue change + Zeus: BUILT on `loop/statues-to-rooms`

Session ..01HFWzTkZKyQtTHTy1kFpxN4 (build loop). Item: STATUS 0cn (4) / 0ca (2), Carter's change of plans
`order-2026-11-09-rotunda-statue-change.md` + `correction-2026-11-09-zeus-figure-exists.md`. Build needs no
approval; **merge is per item** (sacred figures, new placement in the museum; never by class).

## What was built
Branch `loop/statues-to-rooms` **`b7a8afbd`** (two commits on `main` `dfe4d272`). No PR opened (runs don't open
PRs unasked; see Needs Carter "PRs for side branches").
1. **No statues in the Rotunda.** The three pedestals, plaques, lamps and tap targets in the 3D Rotunda are gone.
2. **Shiva** stands in **Global Hinduism & the Guru Movements** (ch83): same mesh, same three-level detail, same
   card and link to `rotunda/shiva.html`.
3. **Zeus** stands in **Classical Greece** (ch15): atlas's figure mesh extracted byte for byte from the staged page
   (MD5 of the page matches the correction note), now `docs/assets/rotunda/zeus.glb` (1.87 MB, under the 2 MB
   budget; 140,697 triangles: scan + drape + perizoma). Same single dark bronze as Shiva. Card: what is scanned
   (SMK's CC0 scan of plaster cast KAS2100 of the Artemision bronze), what is ours (lighter body mesh, drape,
   bronze finish), and the Zeus-or-Poseidon question flagged open. Links: the Classical Greece chapter and Zeus in
   the Pantheon (there is no Zeus figure page on the site; building one would be a new page).
4. **Socrates and Isis**: not placed. Their pages and the Rotunda Circle pages are unchanged (order item 4).
- Placement: each statue in its room's centre aisle at 9.7 m in from the door, facing the door, between the second
  and third case rows, in front of the symbol panel. Built once at start (not with the wing), fetched within 22 m
  of its room, shown exactly when the room's exhibits are (so never drawn through a neighbour's walls). The room
  guide lists it as "Statue". About card and Directory line updated.
- Source log `sources/museum-statues-in-rooms.md` (SMK Sketchfab page opened today: publisher SMK, CC0 1.0,
  KAS2100, c. 460–450 BCE, scan of the cast).

## Room choice (judgment call, flagged)
The order says "the Hinduism room" and "the Greek room"; no rooms have those titles. Chosen by date, because the
museum is arranged by time: the Artemision bronze (c. 460–450 BCE) → Classical Greece; the modern Murudeshwar
statue → Global Hinduism. Alternatives are a one-line change in `STATUES`: the Pantheon's home rooms (Zeus → Early
Greece ch08, Shiva → Tantra ch24) or The Upanishads & the Hindu Synthesis (ch69). Put to Carter.

## Checks (all on `b7a8afbd`)
- Full build order (stamp-dates, vault, chapters, pages, museum, framework, entity registry): output committed;
  `review-checks --base origin/main --build` **9/0/0** (largest file zeus.glb 1.87 MB).
- verify **18/18**; `node --test framework/test/*.test.js` **51/51**.
- Headless (Chromium, swiftshader) at 390×844 and 360×740: 0 script errors; both statues load (Zeus near 93.7k /
  mid 26.1k / far 8.1k; Shiva 94.9k / 25.7k / 8.9k). **Phone budget sweep** 200 views per room (5 × 5 positions ×
  8 directions, eye level): **0 over** 220k triangles / 100 calls; worst Classical Greece **202.6k / 60 calls**,
  Global Hinduism 166.4k / 43. Margin in Classical Greece is thin (~17k); the reviewer should look down and
  close up too (not swept: pitch below eye level). Tap on each statue opens the right card with the right links.
  Rotunda entry view shows no statues. Screens + sweep: `handoff/previews/statues-to-rooms/`.
- graphify CLI not installed in this session; no `graphify-out/`. Map not refreshed; work done from reading code.
- Frontend-design skill not installed in this session (Quality bar asks to say so).

## Notes for the reviewer (must be a session other than ..01HFWzTkZKyQtTHTy1kFpxN4)
- `origin/main...loop/statues-to-rooms`; `reviews/REVIEWER.md` §3–§4. Check the card wording against atlas's Zeus
  plaque (`handoff/rotunda/zeus/zeus-figure.html`) and the SMK page; the visibility rule (no statue through walls);
  the phone budget looking down at Zeus from 1–3 m; that dropping and rebuilding wing 04 does not lose the statue's
  tap target (zone "statues").
- Left alone on purpose: `docs/rotunda/index.html` still says "A ring of statues is being made for the Rotunda".
  That is now out of date, but the order says the Tray 1 pages are not changed. To Carter.

## Next
Independent review; a PR so GitHub checks incl. Lighthouse run; Carter's per-item yes (and his room choice).
