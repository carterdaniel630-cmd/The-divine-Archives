#!/usr/bin/env node
/* verify-relic-stills.js — no excluded Vault object (tools/data/relic-stills.json "exclude": the tjurunga, the Báb,
   the rights-ledger holds, the objects held for Carter's sensitivity decision D2) has a still on disk or on any
   page, and every still a chapter page shows is captioned as a museum rendition, not a photograph. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const STILLS = path.join(DOCS, "assets/vault/stills");
const EXCLUDE = require("./data/relic-stills.json").exclude;
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(DOCS, "assets/vault-data.js"), "utf8"), sb);
const items = sb.window.VAULT.items;
const bad = [];
const banned = Object.keys(EXCLUDE).map((id) => { const it = items.find((i) => i.id === id); if (!it) bad.push(`excluded id ${id} is not in vault-data.js`); return it; }).filter(Boolean);
for (const it of banned) if (fs.existsSync(path.join(STILLS, it.slug + ".webp"))) bad.push(`${it.id}: ${it.slug}.webp is on disk (${EXCLUDE[it.id]})`);
const known = new Set(items.map((i) => i.slug));
if (fs.existsSync(STILLS)) for (const f of fs.readdirSync(STILLS)) if (!f.endsWith(".webp") || !known.has(f.slice(0, -5))) bad.push(`stills/${f} matches no Vault entry`);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
let shown = 0;
for (const f of walk(DOCS).filter((f) => /\.(html|js|json|css|xml)$/.test(f) && !f.includes(`${path.sep}vendor${path.sep}`))) {
  const t = fs.readFileSync(f, "utf8"), rel = path.relative(ROOT, f);
  for (const it of banned) if (t.includes("stills/" + it.slug + ".webp")) bad.push(`${rel} shows the excluded still of ${it.id}`);
  for (const m of t.matchAll(/<img class="vl-img"[^>]*alt="([^"]*)"[^>]*\/>(<span class="vl-r">[^<]*<\/span>)?/g)) {
    shown++;
    if (!/not a photograph/.test(m[1])) bad.push(`${rel}: a still's alt text does not say it is not a photograph`);
    if (!m[2] || !/not a photograph/.test(m[2])) bad.push(`${rel}: a still has no "not a photograph" caption`);
  }
}
if (bad.length) { console.error("verify-relic-stills: FAIL\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`verify-relic-stills: OK (${Object.keys(EXCLUDE).length} objects excluded, none on disk or on a page; ${shown} stills shown, all captioned as renditions)`);
