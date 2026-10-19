# LANGAR — The Free Kitchen (walkthrough experience #10)

**File:** `langar.html` (self-contained; Three.js r150 UMD vendored locally as `three.min.js` — zero CDN)
**Status:** Built + verified 2026-10-18 — `node --check` clean on all 4 script blocks; headless runtime smoke test passed (180 frames, all 5 phases, info tabs); seva click-to-serve interaction verified end-to-end via projected raycast.

## What it is
A 3D walkthrough of a gurdwara langar hall. The visitor enters through a respectful threshold (cover head, remove shoes, wash hands), joins the serving line for a steel plate, takes a seat on the floor in the pangat row, performs seva by serving other guests, and eats the same meal as everyone in the hall.

## What it's based on
- **Archive material:** the Sikhism chapter (ch34) of the Divine Archives — Guru Nanak founding langar at Kartarpur; Guru Amar Das systematizing it (even Emperor Akbar ate in the row before an audience); Mata Khivi running the kitchen; *vand chakna* (sharing what you earn) as one of the three disciplines; "There is no Hindu, there is no Muslim"; langar as "theology one can eat."
- **Real-world reference:** langar as practiced TODAY in gurdwaras worldwide — free lacto-vegetarian kitchen, everyone seated on the floor in rows, volunteer sewadars cooking/serving/cleaning, funded by small donations. Golden Temple scale noted in the info panel (tens of thousands fed daily).

## Living-practice framing
The entry veil states plainly: "This is a living practice, happening today in gurdwaras around the world. Walk it with respect." Info panel ("About Langar") has five tabs — Langar, Pangat, Seva, Equality, Today — each grounded in the chapter text. Etiquette is real: head covered, shoes off, hands washed; lacto-veg so all can eat; servers eat last; no mockery, no exoticizing.

## Seva / equality mechanics
- **Equality, made visible:** during "Take Your Seat" the camera drops to floor level and a gold line appears at head height across the rows — every head at exactly the same height. Caption: "One level for all."
- **Seva:** in "Serve" phase, unserved guests pulse with a soft gold ring; clicking one places a full thali (roti, daal, rice, sabzi) before them with a "+1 seva" float and a running counter. Servers (stationary + walking sewadars with trays) work the aisles; the kitchen end has three steaming degs with fire glow, a roti griddle, and thali stacks.
- **Eat:** the visitor's own thali fills, then food items are eaten one by one; closing caption covers cleanup discipline.

## Notes for Claude's rebuild
- Figures are stylized (capsule/sphere construction, turbans and head coverings, varied skin/cloth tones); men and women sit together per real practice.
- Custom drag-orbit camera (no OrbitControls dependency); phase tweens ease between five viewpoints.
- Palette follows the house: near-black warm browns, antique gold #b98f4e–#c9a24b, highlight #e6c27a, warm ivory; Cinzel/Cormorant/EB Garamond stacks (no webfonts — zero CDN).
- Not staged to GitHub per task instructions.
