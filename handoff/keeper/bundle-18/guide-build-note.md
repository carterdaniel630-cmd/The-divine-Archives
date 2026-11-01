# THE ARCHIVIST — Museum Guide design build note
Built 2026-10-26 night (Carter's order 22:01 ET + Ferryman addition 22:03 ET).
Deliverable: `guide-single.html` — 936,087 bytes (≤ 3.1 MB ✓), 74,740 render tris,
zero console errors at 390×844 on every capture; standalone proof passed (file alone
in an empty folder: ready, 0 errors, 0 external requests).

## What he is
- Carter's icon from his four references: tall hooded figure, face = unlit black
  void inside the hood (MeshBasicMaterial black — the shadow cannot lift at any
  brightness), gold rim cord arcing over the opening.
- The robe: dark warm-brown cloth carrying a procedural canvas embroidery
  (map + bump, UVs following the robe's lathe, repeated 3× around) — three
  winding vines with stitched stems, leaves and berries; roses in muted rose;
  gold marigolds; crescent moons; four-point stars; ringed planets. At the
  robe-detail close-up the motifs read as worked pattern ON the cloth.
- Right hand raised, open, thumb tip on index tip (the teaching sign);
  left hand down, fingers curled ~230° around the ferryman's pole.
- THE FERRYMAN (22:03 addition, all three marks in): the pole — plain dark
  wood, worn bronze collar + tip, planted on the pedestal's top step beside
  him; the robe's hem border carries the woven RIVER pattern (two running
  wave rows, foam dots, gold trims) among the flowers; the plaque's second
  paragraph names the side role ("no one crosses his museum unaccompanied").
- The halo: flat disc behind the head, canvas face with 12 moon-phase
  stations at the rim, flower-of-life circles + twin triangles, a muted
  rainbow vertex-coloured torus at its edge (candlelit, not neon) and a fine
  gold ring inside it.
- Bare feet peek from under the hem; wide hanging sleeves (right sleeve has
  the broad hanging panel of the references); deep V opening with an inset
  darker inner panel and gold trim cords.
- House mechanics unchanged: shared stepped pedestal (fixed), figure-only
  Y rotation through centre, tilt locked, opens face-on, no auto-rotate,
  plaque BELOW on solid ground. Hashes: #tq, #close (robe detail).

## Verification (all viewed by the builder at phone size)
- check-guide-front.png / -dark (0.55): full figure reads as the icon —
  halo, black hood, raised hand, pole, river hem, feet. In the darkened
  shot the embroidery still reads and the hood stays pure black.
- check-guide-tq.png / -dark: panel fall, halo edge rainbow, pole hand.
- check-guide-close.png / -dark: embroidery detail — vines, stitch ticks,
  marigolds, moons, roses on the cloth with bump relief.

## SECOND PASS — Oct 27 (Carter's phone screenshots, Oct 26 ~22:49 ET)
Two named targets, both from what his phone actually showed:
1. **Embroidery scale.** The tile was redrawn bigger and plainer: motifs are
   drawn in a taller design space squashed onto the canvas (SQ 0.56), which
   cancels the cloth's vertical stretch so they land round on the robe; the
   tile now wraps twice around (uRep 3→2). Roses ~3× the old size with bold
   outlines and gold hearts, crescents r46, marigolds, sparkle stars, ringed
   planets, leaves 62×27 on two thick two-tone vines; the ground's fine
   speckle (a grain source) cut from 5200 flecks to 1300, bump 0.7→0.45,
   anisotropy 4→8. The river band's waves are bolder (9.5px, amplitude 15).
   Judged at FULL-FIGURE distance in the 0.55-darkened capture: roses,
   crescents, gold flowers, vines and the river hem are each individually
   nameable — where pass 1 read as speckle. Trade-off, stated plainly: at
   close zoom the work now reads as bold appliqué rather than fine
   stitchwork, and motif density is lower (more plain cloth between).
2. **Opening frame.** Default camera distance 3.55→4.15 and look-centre
   1.14→1.25 (the figure's true centre: plinth base 0 to disc top 2.37).
   At 390×844 the whole figure now stands inside the frame — headroom above
   the disc, plinth and ground below the feet. His phone cropped pass 1 by
   more than the page geometry alone explains, so his device stays the
   final check; the margin is the robust page-side fix.
File: 936,467 bytes (≤ 3.1 MB ✓), 74,740 render tris (geometry unchanged),
zero console errors on all three captures (front / three-quarter / close).

## Honest residuals
- The raised hand reads clearly but its forearm emerges from dark sleeve
  mass; at full-figure distance the hand can read slightly floaty.
- The chest V is subtle from dead front (trim cords converge but dim);
  the layered opening reads better at three-quarter.
- Robe folds are quiet under the embroidery (the references' cloth is also
  fairly smooth-falling; the pattern is the surface interest).
- The rainbow rim is deliberately muted — visible as a soft spectral band
  at the disc's edge, strongest at three-quarter.
- Two build iterations were needed on palette: the first pass rendered too
  dark for Carter's phone (near-black robe, embroidery lost); cloth ground,
  motif sizes/density and the light rig were all lifted, and the sleeve
  cuffs were re-mapped so the river band lives only at the true hem.


## PASS 3 — PALETTE ONLY (Carter 2026-10-27 09:07 ET)
Carter's direction: "no bright colors. no reds or greens. just the same
color pallet used in the archives." Colours only — pass 2's motif sizes,
plainness and framing untouched.
- Roses: petal rings now #b98f4e (outer) / #d9a950 (mid) / #e8d5a8
  (inner), gold heart kept. Berries became gold beads #d9a950.
- Vines: stems #8a6a30 with #c9a24b highlight; leaves alternate #b98f4e
  and #e8d5a8, warm-brown veins.
- Planets: #b98f4e, #e8d5a8, #8a6a3c (were sage / terracotta / blue-grey).
- River hem: waves #d9a950 and #e8d5a8 on dark (was teal), foam dots
  warm ivory rgba(232,213,168,0.6).
- Halo rim: the spectral vertex-coloured torus is GONE — plain antique
  gold #c9a24b, matching the fine inner ring.
- Page accent: the plaque tag line #c96a4a (rust) -> #c9a24b.
- One cool light warmed: rim light 0xb9c9f2 (blue) -> 0xd8c9a3, same
  strength — it was washing a blue tint over the figure's edge.
- Marigolds, moons, stars and the halo canvas were already gold/ivory
  and are unchanged.
Verified: rebuilt 936,155 bytes; captures re-shot (front / front-dark /
tq / tq-dark / close / close-dark), zero console errors. Judged in the
darkened front capture at full-figure distance: flowers, the winding
vine, leaves, crescent moons, stars, a ringed planet and the gold river
band are all still nameable in golds and ivory alone. Honest cost: roses
and marigolds are told apart by petal shape and tone now, not by colour,
and the moons remain the quietest motif, as in pass 2.

## PASS 4 — FULL REBUILD (Carter rejected the pass-3 build 2026-10-27
10:17 ET with side-by-side phone evidence: "the first two is what we
made, the others is how he should look." The pass-3 build is preserved
as `guide-single-pass3-backup.html`. Builder: `build_guide_v2.py`.)
The form was the task — not a patch:
- **Robe rebuilt as carved drape.** New profile (hem 0.318, waist 0.240,
  sloped shoulders to a 0.060 neck) on a dense lathe (150×280) with an
  18-fold carved field — grooves cut −0.030 with side ridges, drifting
  as they fall — plus six pooling mounds at the hem and a pool ring of
  the same cloth spread on the plinth (to r 0.45, spilling over the top
  step onto the step below). Two long front falls hang from the chest
  to the hem. The lathe-column silhouette is gone.
- **Sleeves.** Right: pleated upper sleeve, a folded cascade fall from
  the forearm (billow reduced in the fix round so it hangs as cloth,
  not a sail), pleated forearm. Left: a long pleated bell sleeve,
  tucked toward the body's A-line in the fix round (it read as a fin),
  with the diamond-border cuff band.
- **Hands.** Right hand enlarged (scale 1.30), fingers lengthened and
  fanned, thumb-tip on index-tip (teaching sign) preserved. Left hand
  grips the ferryman's pole, as before.
- **Hood** re-draped with ripple and back grooves; the face is still
  the unlit black void. No face, ever.
- **Halo disc enlarged to reference scale** (r 0.310 → 0.40; top of
  disc 2.22 m), face material de-metalled so the moon stations and
  geometry read instead of washing out.
- **Embroidery redrawn fine AND large** (1536² canvas): stitched stems
  with veined leaf pairs and tendrils, two sizes of veined roses with
  spiral hearts, two-ring marigolds, filler blossoms, crescents in two
  sizes, ringed planets and orbs — archive colours only (antique golds,
  warm ivory, bronzes on warm brown-grey cloth; no reds, no greens).
  Fix round: main motifs scaled a further ×1.25–1.3 and the noise
  layer cut down (sparkles dimmed ~half, dot stars 90→36, seed-stitch
  field halved) — the full-figure speckle Carter flagged twice was the
  small bright layer swamping the real motifs, not the motifs
  themselves: at close range they were already large worked goldwork.
- **Feet** enlarged ×1.4, raised proud of the pool cloth and pushed
  forward in two steps; in the final front capture (enlarged crop
  checked) two bare feet read plainly at the front centre below the
  river band, toes forward — simply modelled (rounded forms, toes
  suggested, not separated).
- **Framing:** default camera 4.15 → 3.85 (disc top and plinth base
  both keep margin at 390×844 — the whole figure stands in frame,
  larger than pass 3).
- **NO LOADING VEIL.** The veil is removed entirely (markup, CSS and
  script references); the figure is simply there when the page opens,
  on the Zeus page's load structure. A WebGL failure now writes into
  the hint line instead.
- Pole and plaque text unchanged. House mechanics unchanged.
Verified: **948,826 bytes (≤ 3.1 MB ✓); zero console errors on front,
three-quarter and close captures at 390×844** (render tris 135,800
full view); module script passes `node --check`; captures judged
against Carter's references side by side, including 0.55-darkened
variants.

### ⚠️ FLAGGED CHOICE — the disc rim (for Carter's eye)
The reference's disc carries a soft rainbow rim. Carter's standing
palette order (2026-10-27) is archive colours only, no bright colours.
The rim is therefore rendered as a **very muted, desaturated echo**:
vertex-coloured metal, spectrum saturation 0.32 pulled 80% toward pale
gold #d9c096 — it reads as coloured metal with the faintest spectrum
at the disc's edges, never as bright colour. If his eye wants it pure
gold (the pass-3 state), that is a one-line change.

### Honest residuals (pass 4)
- The robe's folds are real carved drape now, but still tidier and
  shallower than the reference's deep, soft, uneven hang; the figure
  reads as a carved statue of the Archivist more than as cloth.
- The raised hand reads as a hand and the gesture is correct, but it
  sits high and close against the pale disc (low contrast) where the
  reference extends the arm out to the side, palm up. The weakest
  element.
- Embroidery: nameable at full-figure distance on the skirt (roses,
  marigolds, a ringed planet, the river band); the upper robe still
  reads finer-grained at distance, and the moons stay the quietest
  motif. At close range the work is large and bold — embroidery, not
  stickers — but bolder than the reference's fine stitchwork.
- Disc geometry linework is faint dead-front; it wakes at angles.
  Moon stations read.
- Feet are present and visible but simply modelled.
- **Phone truth not claimed:** every check above is this machine's
  renderer at 390×844 with a 0.55 darkening. Carter's Galaxy reads
  darker and is the final rung — the pass-3 build passed here and
  failed there. His eye decides.


## PASS 5 — THE FLOWERY DESIGN REMOVED (Carter 2026-10-27 12:06 ET:
"remove the flowery design. make it representative of the
archivist/ferryman robe like the angel of death robe." The pass-4
build is preserved as `guide-single-pass4-backup.html`. Builder:
`build_guide_v3.py` — `build_guide_v2.py` stays as the pass-4 builder.)
- **Removed, entirely:** the whole embroidery canvas — roses, marigolds,
  filler blossoms, crescent moons, stars/sparkles, ringed planets and
  orbs, vines, leaves, tendrils, berries, seed-stitch field — plus the
  neck border band with its gold diamonds, the woven RIVER border at
  the hem, and every gold trim cord on the robe (the front falls' inner
  cords, the opening's two cords, the hood's rim cord). Nothing floral
  or motif-like remains on the robe at any scale; the robe close
  capture was checked for exactly this.
- **The halo rim** is now plain muted antique gold — the pass-4
  desaturated-spectrum vertex colours are gone. The disc itself is
  unchanged (simple muted gold, moon stations, geometry) — it was not
  part of the robe problem and no decoration was added to it.
- **Bare feet removed.** The pooling hem now covers them, as a heavy
  Angel-of-Death robe falls; no feet are forced out from under it.
- **The new robe:** a plain woven-cloth texture only — very dark warm
  brown-grey, matte (roughness 0.97), whose only variation is the weave
  grain itself and broad, soft panel shading. No trim on the robe at
  all. The robe's whole presence is carried by the Pass-4 drape
  geometry — the 18-fold carved field, the pooling hem, the hanging
  sleeves and front falls — and by light on those folds.
- **Kept, untouched:** the black-void face in the hood; the ferryman's
  pole and the left hand gripping it; the raised right hand; house
  viewer mechanics (fixed stepped pedestal, figure-only Y rotation,
  opens face-on, no auto-rotate, NO loading veil, Zeus load pattern).
- **Plaque — ONE sentence changed, flagged plainly:** the old first
  paragraph described "his robe, worked all over with the flowers and
  moons and stars…" — that sentence described the removed design, so
  keeping it would have made the plaque lie about the piece in front of
  the visitor. It now reads: "His robe is plain and heavy, without
  ornament — dark cloth falling in deep folds, the robe of a keeper and
  a ferryman, made for thresholds and crossings, not for display."
  Everything else in the plaque — the Archivist / Keeper /
  Ferryman-of-the-Crossings tag, the keeper paragraph, and the whole
  ferryman paragraph — is verbatim unchanged.

### SHIVA-FLOOR CHECK (Carter's standing rule, 2026-10-27 12:13 ET:
"Shiva is the new floor in design — everything should meet or exceed it")
The first plain build was judged against Shiva's level (real presence,
dignified at phone size, reads true darkened) and found wanting: with
the embroidery gone, the robe's first plain pass read too much like a
flat dark column — the folds were present but shallow, and the hem had
no weight. Deepening pass applied before delivery, robe direction
unchanged (no flowers, no motifs):
- Fold grooves cut deeper (−0.030 → −0.042, ridges 0.011 → 0.015) and
  groove shading strengthened (0.36 → 0.50).
- Hem profile widened (0.318 → 0.336 at the floor, with the rows above
  widened in step) and the pooling mounds pushed further out
  (0.042 → 0.056), so the cloth lands with weight.
- Raking light raised (0.55 → 0.95) and the robe light lifted
  (0.55 → 0.70) so the fold channels model under the front view instead
  of washing flat.
Re-judged after the deepening: in the front capture the fold channels
now run the full length of the robe and the hem sits heavy on the
plinth; in the 0.55-darkened capture the silhouette, disc, pole and
fold shadows all still read, and the figure keeps its solemn,
threshold-keeper presence at phone size. The robe close shows plain
heavy cloth and deep fold grooves — no motifs anywhere.

### Honest residuals (pass 5)
- This is still built cloth, not a scan: the drape is tidier and more
  regular than real hanging cloth, and it does not have Shiva's
  scanned surface truth. It meets the robe direction; the scan gap is
  named, not hidden.
- The raised hand remains the weakest element (unchanged from pass 4):
  it sits high and small against the pale disc, where the reference
  extends the arm out to the side.
- The front falls now blend into the robe as plain panels — correct
  for an unadorned robe, but the chest reads plainer than pass 4.
- **Phone truth not claimed:** every check above is this machine's
  renderer at 390×844 with a 0.55 darkening. Carter's Galaxy is the
  final rung and his eye decides — the pass-3 build passed here and
  failed there, and that lesson stands.
Verified: **935,353 bytes (≤ 3.1 MB ✓); zero console errors on front,
three-quarter and close captures at 390×844** (render tris 123,112
full view; 98,464 close).

## Pass 6 — the symbology robe (2026-10-27)

Carter's direction, 2026-10-27 12:44 ET, verbatim: "no it's meant to
look dark with ancient symbology on it.. pulled from the information
held within the divine archives. it's meant to represent all of it
remember". Pass 5's plain robe was wrong on meaning, not on cloth:
the Archivist is the keeper who carries the whole Archive, and his
robe now carries its marks. Pass 5 is preserved as
guide-single-pass5-backup.html.

### What was kept from Pass 5
- The dark, heavy Angel-of-Death / ferryman drape: deep fold field,
  pooling hem, wide bell sleeves, front falls, cascade sleeve fall.
- Black-void face in the hood (never a face), the ferryman's pole,
  the raised teaching hand, the plain muted-gold disc (unchanged).
- Viewer mechanics unchanged: fixed stepped pedestal, figure-only
  Y rotation, opens face-on, no auto-rotate, NO loading veil.

### What changed
- The plain cloth now carries ancient symbology in muted antique
  gold (material toned to 0xbfa06a, metalness 0.2, roughness 0.62 —
  thread, not stickers). Two earlier attempts put the symbols in the
  robe's weave texture and failed on their own captures: thin linework
  was chopped by the fold grooves, and the robe's wrap stretches a
  texture ~2:1 so square glyphs landed tall and narrow. Final method:
  each symbol is drawn once on a transparent atlas and laid as a gold
  patch that follows the robe's real surface maths (curved body
  patches on the fold field, panel patches on the front falls, one on
  the cascade sleeve fall), so every symbol keeps true proportions.
- The weave texture itself now carries only the two hem borders.
- Plaque corrected: the Pass 5 sentence "plain and heavy, without
  ornament" was false under this direction and is replaced — the robe
  is "worked all over, in muted gold, with the ancient signs of the
  traditions held within these walls… because he represents all of
  it." Keeper and Ferryman paragraphs unchanged.

### The symbols (the honesty record — attested forms only)
Body of the robe:
1. Ankh — Egypt
2. Feather of Ma'at — Egypt
3. Eye of Horus — Egypt
4. Ouroboros — Greek alchemical
5. Yin-yang — Chinese Taoist
6. Scarab — Egypt
7. Crescent and star — Islamic/Ottoman generic form
Front falls:
8. Om (stylised Devanagari form) — Hindu
9. Flower of Life — sacred geometry
10. Star of David — Jewish
11. Mjölnir — Norse
12. Valknut — Norse
13. Unalome — Buddhist
Cascade sleeve fall:
14. Triskele — Celtic
Hem borders (in the weave):
- Greek key / meander band — Greek
- Stepped fret (xicalcoliuhqui) band — Aztec / Mesoamerican
No invented glyphs, no fake runes, no scrambled letters anywhere.

### The nameable count — counted on the captures, honestly
Front capture at phone size (390×844), lit: **6 of the 14 symbols
nameable** — Om, Star of David, Mjölnir, valknut, crescent, ankh —
plus both hem borders (the meander reads clearly; the stepped fret
reads as a worked band). Front capture at 0.55 darkening: **5
nameable** (the ankh drops out) plus both borders. The remaining
symbols are placed around the robe's curve (±0.6 rad and beyond) or
low on the falls; they read on rotation and in the three-quarter and
close captures (the close capture shows the unalome and valknut
large, bold and true-proportioned), but they are NOT nameable
dead-front at phone distance, and this note does not pretend
otherwise. Nothing reads as speckle — the failure mode of passes
1–3 is gone; the limit now is placement around a round robe, not
size or contrast.

### Honest residuals (pass 6)
- Still built cloth, not a scan: no scanned surface truth (the Shiva
  gap, named not hidden). The gold is applied patch work that follows
  the cloth's surface and light — it reads as heavy appliqué
  embroidery, not thread woven into the weave itself.
- The raised hand remains the weakest element (unchanged since
  pass 4): high and small against the disc.
- Gold reads brighter in the close and three-quarter captures than
  dead-front; Carter's phone reads darker than this screen, which
  cuts both ways and is his call to make.
- **Phone truth not claimed:** all checks are this machine's
  renderer at 390×844 with a 0.55 darkening. Carter's Galaxy and
  Carter's eye are the final rung.

Verified: **962,326 bytes (≤ 3.1 MB ✓); zero console errors on front,
three-quarter and close captures at 390×844** (render tris 123,112
full view; 98,464 close), single clean capture run.

## CORRECTION — 2026-10-29 ~21:13 ET (Carter)
- The plaque line "no one crosses his museum unaccompanied" is STRUCK by Carter: "the museum is a free space." The Archivist offers guidance/crossings; he never requires accompaniment. Any rebuild of this figure must not carry that line or that framing.
- Robe direction updated by Carter the same night: embroidery = sacred geometry linework + ancient symbology of all kinds.
- UPDATE 2026-10-29 ~21:14 ET (Carter): robe embroidery — NO FLOWERS. Keep the moon and the stars; add sacred geometry linework + ancient symbology of all kinds. Floral embroidery from the Oct 26 figure does NOT carry forward.

## DESIGN v1 — THE ARCHIVIST & HIS RAVEN (2026-10-29 night, builder: build_archivist_raven_v1.py)
Built for Carter's verdict from the settled design (archivist-design-2026-10-29.md §1 + §9) on the Pass-6 construction. Deliverable: archivist-raven-design-v1.html — **968,194 bytes (≤ 3.0 MB ✓)**; zero console errors on the front capture at 390×844 (173,776 render tris).
- REMOVED: the ferryman's pole and the left hand's grip (hand rebuilt resting open at his side); the struck plaque paragraph and every trace of the gating framing — grep of the finished file: "unaccompanied" 0, "ferryman" 0.
- PLAQUE REPLACED, short: tag "The Archivist · Keeper of the Divine Archives"; para 1 names him keeper/student/teacher, the hood's shadow, the robe's sacred geometry + ancient signs + moons and stars; para 2 the raven, his companion, who flies out and returns with what it has seen.
- ROBE: the 14 attested Pass-6 symbols kept; ADDED sacred-geometry linework — Seed of Life (robe flank), triquetra (other flank), eight-point star (front fall) — and moons: a plain crescent patch mirroring the crescent-and-star, a crescent on the left fall's foot. Moons and stars now read on the robe body and both falls. NO floral motifs drawn anywhere (the only "flower" strings left in the file are two historical code comments and the Flower of Life's name — that figure is circle geometry, drawn on the halo and one fall patch).
- BARE FEET restored: feet with toes step out from under the pooling hem at the front.
- THE RAVEN: built form (body, neck, head, long beak, folded wings, fanned tail, legs and gripping toes) perched on a rough stone at his left on the plinth's top step, turned toward him in profile; near-black plumage with a muted bronze sheen on breast and crown — Archives palette only. First capture read as a blob; one fix round (scale 1.22→1.52, perch moved forward, neck added, beak lengthened, sheen lifted) — it now reads as a bird in profile at phone size. In the 0.55-darkened capture it goes very quiet (silhouette + faint sheen) — named, not hidden.
- Captures: archivist-raven-design-v1-capture.png (front), -dark.png (0.55), -robe.png (close crop: valknut, yin-yang, unalome large and true; cloth dark with gold work at close range). Robe close was shot from the first v1 build — embroidery code is byte-identical in the final build (the fix round touched only raven/hand/feet).
- Honest residuals: built form, not a scan (the standing Shiva gap); the machine renderer washes the robe gold at full-figure distance exactly as it did for Pass 6's own accepted captures — at close range the cloth reads dark with gold work. Carter's Galaxy is the final rung; phone truth not claimed.

---
**KEEPER TURNAROUND — APPROVED 2026-10-29 22:32 ET (Carter, explicit):** `media-generation-keeper-turnaround-v1-0-132e1646-1cd1-4e44-a042-ff8da4a7c010.webp` is the modeling reference for the Keeper/Archivist figure. Three atlas flags ride with it as modeling-pass corrections, not features: (1) back view shows the wrong hand raised — in the model, the raised teaching hand is his RIGHT in every view; (2) the halo disc must be solid with physical weight (the sheet renders it as linework); (3) the decay→renewal footstep wake must read stronger in the built scene than in the sheet.

---
**VISUAL APPROVED 2026-10-29 22:47 ET (Carter, explicit, yes/no session item 3):** archivist-raven-design-v1.html IS him. Supersedes the 22:09 "not yet".

---
**COUNTERED 2026-10-29 23:07 ET (Carter, from his phone close look):** v1 build craft REJECTED at tier — "idk about the shapes. this isn't built to its highest tier capacity." Approval of 22:47 superseded. Defects: crude hand at close zoom, decal-flat symbols, unfinished hood edge, stiff robe. Rebuild-to-tier order stands in the daily log; the DESIGN and the TURNAROUND are unaffected.

**ROBE DIRECTION 2026-10-29 23:08 ET (Carter):** the robe visuals get a TATTERED, MYSTICAL feel — worn, aged, time-softened cloth; frayed edges and hem; the goldwork worked into old cloth, not printed on new. Part of the rebuild-to-tier order.

**RAVEN DIRECTION 2026-10-29 23:09 ET (Carter):** the raven reads as an ANCIENT bird — weathered, old — but STRONG and CUNNING: keen eye, vital, sharp-minded. Not a cute pet, not frail. Part of the rebuild-to-tier order.

**RULING 2026-10-30 ~00:27 ET:** the shadow-companion idea was explored and DECLINED by Carter — the raven stays a bird of flesh (ancient, strong, cunning). The wake stays tied to the Keeper's steps.

**RULING 2026-10-30 ~00:29 ET (corrects the 00:27 note):** the SHADOW is approved — as the KEEPER'S OWN extension, not the raven's form. His shadow detaches at times (errands, watching, under the Study door) while he operates fully. The raven remains flesh, as ruled.
