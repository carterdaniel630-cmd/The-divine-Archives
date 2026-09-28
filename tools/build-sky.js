#!/usr/bin/env node
/* Build docs/museum/sky.json, the data of the planetarium in the museum's Rotunda, from the
   vendored d3-celestial catalogues (tools/data/d3-celestial, BSD-3-Clause) and the curated lore
   (museum/sky-lore.json, every line of which tools/verify-sky.js checks against chapter text).

   Output (angles in hundredths of a degree, magnitudes and colours in hundredths):
     stars   flat [ra, dec, mag, bv, ...], brightest first
     names   [[star index, proper name, constellation], ...] for the bright stars
     cons    [{ id, name, en, gen, at:[ra,dec], lines:[[ra,dec,...]], bounds:[[ra,dec,...]] }]
     mw      [[level, hole?, [ra,dec,...]], ...] Milky Way outlines, lightly simplified
     planets Keplerian elements (JPL approximate positions) for mer ven ter mar jup sat
     sites   observing places, each tied to a chapter
     lore    the curated entries (without their basis strings) */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, ".."), D = path.join(ROOT, "tools/data/d3-celestial");
const J = (f) => JSON.parse(fs.readFileSync(path.join(D, f), "utf8"));
const c100 = (v) => Math.round(v * 100);
const ra = (lon) => ((lon % 360) + 360) % 360;

// stars, brightest first
const stars = J("stars.6.json").features.map((f) => ({ hip: f.id, ra: ra(f.geometry.coordinates[0]), dec: f.geometry.coordinates[1], mag: +f.properties.mag, bv: parseFloat(f.properties.bv) || 0.6 }))
  .sort((a, b) => a.mag - b.mag);
const flat = []; stars.forEach((s) => flat.push(c100(s.ra), c100(s.dec), c100(s.mag), c100(s.bv)));
const SN = J("starnames.json"), names = [];
stars.forEach((s, i) => { const n = SN[s.hip]; if (s.mag <= 3.2 && n && n.name) names.push([i, n.name, n.c || ""]); });   // [index, name, constellation per the catalogue]

// constellations: names, figures, IAU boundaries (Serpens has two parts)
const EN_FIX = { UMa: "Great Bear", UMi: "Little Bear", Cru: "Southern Cross" }; // the package gives asterism names here
const lines = {}, bounds = {};
J("constellations.lines.json").features.forEach((f) => { (lines[f.id] = lines[f.id] || []).push(...f.geometry.coordinates.map((l) => l.flatMap((p) => [c100(ra(p[0])), c100(p[1])]))); });
J("constellations.bounds.json").features.forEach((f) => { (bounds[f.id] = bounds[f.id] || []).push(...f.geometry.coordinates.map((r) => r.flatMap((p) => [c100(ra(p[0])), c100(p[1])]))); });
// Serpens is one IAU constellation in two parts (Caput and Cauda): keep one entry, labelled at the head
const cons = J("constellations.json").features.filter((f, i, all) => all.findIndex((g) => g.id === f.id) === i).map((f) => {
  const p = f.properties;
  if (f.id === "Ser") p.name = "Serpens";
  return { id: f.id, name: p.name, en: EN_FIX[f.id] || p.en, gen: p.gen, at: [c100(ra(f.geometry.coordinates[0])), c100(f.geometry.coordinates[1])], lines: lines[f.id] || [], bounds: bounds[f.id] || [] };
});

// the Milky Way: drop points closer than 0.6° to the last kept one
const mw = [];
J("milkyway.json").features.forEach((f) => {
  const lvl = +String(f.id).replace(/\D/g, "");
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  polys.forEach((poly) => poly.forEach((ring, ri) => {
    const out = []; let last = null;
    ring.forEach((p) => { if (!last || Math.hypot(((p[0] - last[0] + 540) % 360) - 180, p[1] - last[1]) > 0.6) { out.push(c100(ra(p[0])), c100(p[1])); last = p; } });
    if (out.length >= 6) mw.push([lvl, ri ? 1 : 0, out]);           // ri > 0: a hole (a dark lane) in that level
  }));
});

const P = J("planets.json"), planets = {};
["mer", "ven", "ter", "mar", "jup", "sat"].forEach((id) => { planets[id] = { name: P[id].name, elements: P[id].elements }; });

// observing places, each one a site the archive writes about (coordinates: the site's
// standard published position, rounded to 0.01°)
const sites = [
  { id: "babylon", name: "Babylon", lat: 32.54, lon: 44.42, chapter: "ch03" },
  { id: "giza", name: "Giza", lat: 29.98, lon: 31.13, chapter: "ch02" },
  { id: "delphi", name: "Delphi", lat: 38.48, lon: 22.50, chapter: "ch08" },
  { id: "stonehenge", name: "Stonehenge", lat: 51.18, lon: -1.83, chapter: "ch42" },
  { id: "chichen", name: "Chichén Itzá", lat: 20.68, lon: -88.57, chapter: "ch29" },
  { id: "rapanui", name: "Rapa Nui", lat: -27.11, lon: -109.35, chapter: "ch63" }
];

const lore = JSON.parse(fs.readFileSync(path.join(ROOT, "museum/sky-lore.json"), "utf8")).entries
  .map((e) => ({ id: e.id, targets: e.targets, chapter: e.chapter, title: e.title, text: e.text, verdict: e.verdict || null }));

const out = { source: "d3-celestial 0.7.35 (BSD-3-Clause): XHIP stars, IAU constellations and boundaries, Vieira's Milky Way outlines, JPL planetary elements. See tools/data/d3-celestial/README.md.",
  stars: flat, names, cons, mw, planets, sites, lore };
const file = path.join(ROOT, "docs/museum/sky.json");
fs.writeFileSync(file, JSON.stringify(out));
console.log("sky.json: " + stars.length + " stars, " + names.length + " names, " + cons.length + " constellations, " + mw.length + " Milky Way rings, " + lore.length + " lore entries, " + (fs.statSync(file).size / 1024).toFixed(0) + " KB");
