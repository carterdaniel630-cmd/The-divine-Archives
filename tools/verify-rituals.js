#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — verify the museum's guided rituals

   For every ritual in docs/museum/rituals.js (plans/games-modern.md §4–§5):
     - it has an id, a title, steps, and a tier of 1, 2 or 3;
     - every step has a non-empty `source`, a caption (`lens`) and a camera view;
     - every tier-1 ritual's `chapter` exists in the archive (docs/assets/data.js);
     - its `object` is a real Vault entry and its `vault` slug matches it, and its
       `room` is a room of the museum (docs/museum/manifest.json);
     - no tier-3 ritual unless Carter has approved it in reviews/cleared.json
       (an entry under "rituals" with the ritual's id);
     - a ritual not marked `pending` must be cleared there too;
     - every quotation it shows is logged, word for word, in its source log
       sources/ritual-<id>.md
   Run: node tools/verify-rituals.js   (also run by verify.yml)
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, ".."), DOCS = path.join(ROOT, "docs");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// the rituals file is an ES module for the browser: run it here with its exports turned into globals
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(read("docs/museum/rituals.js").replace(/^export const (\w+)/gm, "globalThis.$1"), sb, { filename: "rituals.js" });
for (const f of ["assets/data.js", "assets/vault-data.js"]) vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sb, { filename: f });
const RITUALS = sb.RITUALS, A = sb.window.ARCHIVE, V = sb.window.VAULT;
const manifest = JSON.parse(read("docs/museum/manifest.json"));
let cleared = {};
try { cleared = JSON.parse(read("reviews/cleared.json")); } catch (e) { cleared = {}; }
const clearedRituals = new Set((cleared.rituals || []).map((r) => r.id));

const chapters = new Set(A.chapters.map((c) => c.id));
const vault = new Map(V.items.map((v) => [v.id.toLowerCase(), v]));
const rooms = new Set(Object.values(manifest.wings || {}).flat().concat(Object.keys((manifest.names && manifest.names.rooms) || {})));
const errors = [];
const nonEmpty = (x) => typeof x === "string" && x.trim().length > 0;
let steps = 0;

if (!Array.isArray(RITUALS) || !RITUALS.length) errors.push("docs/museum/rituals.js: no RITUALS found");
const ids = new Set();
for (const r of RITUALS || []) {
  const at = r.id || "(no id)";
  if (!nonEmpty(r.id)) errors.push("a ritual has no id");
  if (ids.has(r.id)) errors.push(`${at}: duplicate id`); ids.add(r.id);
  if (!nonEmpty(r.title)) errors.push(`${at}: no title`);
  if (![1, 2, 3].includes(r.tier)) errors.push(`${at}: tier must be 1, 2 or 3 (is ${r.tier})`);
  if (r.tier === 1 && !chapters.has(r.chapter)) errors.push(`${at}: tier-1 ritual's chapter "${r.chapter}" does not exist`);
  if (r.chapter && !chapters.has(r.chapter)) errors.push(`${at}: unknown chapter "${r.chapter}"`);
  if (r.tier === 3 && !clearedRituals.has(r.id)) errors.push(`${at}: tier 3 (living sacred practice) needs Carter's approval in reviews/cleared.json under "rituals"`);
  if (!r.pending && !clearedRituals.has(r.id)) errors.push(`${at}: not marked pending and not cleared in reviews/cleared.json`);
  const v = vault.get(String(r.object || "").toLowerCase());
  if (!v) errors.push(`${at}: object "${r.object}" is not a Vault entry`);
  else if (r.vault && v.slug !== r.vault) errors.push(`${at}: vault slug "${r.vault}" does not match ${v.id} (${v.slug})`);
  if (!rooms.has(r.room)) errors.push(`${at}: room "${r.room}" is not a museum room`);
  if (!Array.isArray(r.steps) || !r.steps.length) { errors.push(`${at}: no steps`); continue; }
  const logFile = `sources/ritual-${r.id}.md`;
  const log = fs.existsSync(path.join(ROOT, logFile)) ? read(logFile) : null;
  if (!log) errors.push(`${at}: no source log ${logFile}`);
  r.steps.forEach((s, i) => {
    steps++;
    const where = `${at} step ${i + 1}`;
    if (!nonEmpty(s.title)) errors.push(`${where}: no title`);
    if (!nonEmpty(s.source)) errors.push(`${where}: no source`);
    if (!nonEmpty(s.lens)) errors.push(`${where}: no caption (lens)`);
    if (!s.at || typeof s.at.u !== "number" || s.at.u < 0 || s.at.u > 1) errors.push(`${where}: camera view "at.u" must be between 0 and 1`);
    for (const q of s.quotes || []) if (log && !log.includes(q)) errors.push(`${where}: quotation not logged word for word in ${logFile}: "${q.slice(0, 60)}…"`);
    for (const l of s.links || []) {
      const file = l[1].split("#")[0];
      if (!fs.existsSync(path.join(DOCS, file))) errors.push(`${where}: link to missing page ${l[1]}`);
    }
  });
}

if (errors.length) {
  console.error(`verify-rituals: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`verify-rituals: OK — ${RITUALS.length} ritual(s), ${steps} step(s), every step sourced; no unapproved tier-3 ritual`);
