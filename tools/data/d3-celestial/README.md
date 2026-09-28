# d3-celestial data (vendored source for the museum's planetarium)

Files copied unchanged from the npm package **d3-celestial 0.7.35** by Olaf Frohn
(BSD-3-Clause, see `LICENSE`), fetched from the npm registry with `npm pack d3-celestial@0.7.35`.
`tools/build-sky.js` reads them and writes the compact `docs/museum/sky.json`.

| File | What it holds | Original sources, as cited by the package's readme |
|---|---|---|
| `stars.6.json` | 5,044 stars to magnitude 6: J2000 position, magnitude, B−V colour | XHIP: An Extended Hipparcos Compilation (Anderson & Francis 2012), VizieR V/137D |
| `starnames.json` | proper names and designations by Hipparcos number | Kostjuk 2002 cross index (VizieR IV/27A); Smith 1996 FK5-SAO-HD common-name cross index (VizieR IV/22); GCVS; Gliese 1991 |
| `constellations.json` | the 88 IAU constellations: names, genitive, label position | IAU constellation page; label positions by the package's author |
| `constellations.lines.json` | stick figures joining the constellations' stars | IAU constellation page, with some line modifications by the package's author |
| `constellations.bounds.json` | the official IAU boundaries, J2000 | Catalogue of Constellation Boundary Data (Davenhall & Leggett 1989), VizieR VI/49 |
| `milkyway.json` | outlines of the Milky Way at five brightness levels | Milky Way Outline Catalog, Jose R. Vieira (skymap.com) |
| `planets.json` | Keplerian elements of the major planets | JPL, "Keplerian Elements for Approximate Positions of the Major Planets" (E. M. Standish) |

Note: the stick figures are a drawing convention, not astronomical data; the IAU defines only
the boundaries. The museum says so on its "About this sky" card.
