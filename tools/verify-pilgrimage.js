#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — verify the Pilgrimage

   For every site in docs/assets/pilgrimage-data.js:
     - its chapter and Vault ids exist in the archive;
   and for every "live" site:
     - its page docs/pilgrimage/<id>.html and its module folder exist, with every
       section module the site lists;
     - every chapter / Vault link in its info points resolves to a real page;
     - every relic copy names a real Vault entry, with the same title;
     - every info point outside the archive's own Vestibule (section "v") cites
       its sources
   Run: node tools/verify-pilgrimage.js   (also run by verify.yml)
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, ".."), DOCS = path.join(ROOT, "docs");
const sb = { window: {} }; vm.createContext(sb);
for (const f of ["assets/data.js", "assets/vault-data.js", "assets/pilgrimage-data.js"]) vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sb, { filename: f });
const A = sb.window.ARCHIVE, V = sb.window.VAULT, P = sb.window.PILGRIMAGE;
const chapters = new Set(A.chapters.map((c) => c.id)), vault = new Map(V.items.map((v) => [v.id, v]));
const errors = [];
let checked = 0;

for (const s of P.sites) {
  for (const c of s.chapters || []) if (!chapters.has(c)) errors.push(`${s.id}: unknown chapter ${c}`);
  for (const v of s.vault || []) if (!vault.has(v)) errors.push(`${s.id}: unknown Vault id ${v}`);
  if (!["R", "C", "S", ""].includes(s.label)) errors.push(`${s.id}: bad label "${s.label}"`);
  if (s.status !== "live") continue;
  const page = path.join(DOCS, "pilgrimage", s.id + ".html"), dir = path.join(DOCS, "pilgrimage", "sites", s.id), siteFile = path.join(dir, "site.js");
  if (!fs.existsSync(page)) errors.push(`${s.id}: no page ${path.relative(ROOT, page)} (run node tools/build-pages.js)`);
  if (!fs.existsSync(siteFile)) { errors.push(`${s.id}: no module ${path.relative(ROOT, siteFile)}`); continue; }
  const src = fs.readFileSync(siteFile, "utf8");
  for (const m of src.matchAll(/module:\s*"([^"]+)"/g)) if (!fs.existsSync(path.join(dir, m[1]))) errors.push(`${s.id}: section module ${m[1]} missing`);
  for (const m of src.matchAll(/"\.\.\/(chapters|vault)\/([a-z0-9-]+)\.html(?:#[a-z-]+)?"/g)) {
    if (!fs.existsSync(path.join(DOCS, m[1], m[2] + ".html"))) errors.push(`${s.id}: link to missing page ${m[1]}/${m[2]}.html`);
    checked++;
  }
  for (const m of src.matchAll(/relic:\s*\{\s*id:\s*"(v\d+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g)) {
    const v = vault.get(m[1]);
    if (!v) errors.push(`${s.id}: relic ${m[1]} is not in the Vault`);
    else { if (v.slug !== m[2]) errors.push(`${s.id}: relic ${m[1]} slug ${m[2]} ≠ ${v.slug}`); if (v.title !== m[3]) errors.push(`${s.id}: relic ${m[1]} title "${m[3]}" ≠ "${v.title}"`); }
    checked++;
  }
  // info points: split the info array into entries and require sources outside the Vestibule
  const infoBlock = src.slice(src.indexOf("const info = ["), src.indexOf("const about ="));
  const entries = infoBlock.split(/\n  \{ id: /).slice(1);
  for (const e of entries) {
    const id = (e.match(/^"([^"]+)"/) || [])[1], sec = (e.match(/section: "([^"]+)"/) || [])[1];
    if (sec !== "v" && !/sources:/.test(e)) errors.push(`${s.id}: info point "${id}" (section ${sec}) cites no sources`);
    checked++;
  }
}
if (errors.length) { console.error("verify-pilgrimage: " + errors.length + " problem(s)\n  " + errors.join("\n  ")); process.exit(1); }
console.log(`verify-pilgrimage: ${P.sites.length} sites, ${P.sites.filter((s) => s.status === "live").length} live; ${checked} links, relics and info points checked: OK`);
