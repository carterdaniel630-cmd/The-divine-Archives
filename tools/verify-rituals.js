#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — verify the guided walkthroughs (rituals)

   Every walkthrough is a file data/rituals/<slug>.json (schema:
   framework/schema/ritual.schema.json, played by the framework's ritual player;
   the schema and the framework tests check its shape). This adds the archive's
   sourcing rules (plans/games-modern.md §4–§5, plans/rituals-tiers.md):
     - every step cites at least one of the file's sources, and every source has
       an https link and a note of how it was checked;
     - every ritual's `chapter` exists (always for tier 1);
     - no tier-3 ritual unless Carter has approved it in reviews/cleared.json
       (an entry under "rituals" with the ritual's id), and a tier-2 ritual
       carries his recorded framing approval;
     - "cleared" only when reviews/cleared.json says so;
     - a walkthrough launched from a museum case (`museum_object`) names a real
       Vault object and has a camera view for every step in
       docs/museum/ritual-views.js;
     - every quotation a step shows (text inside “ ”) is logged word for word in
       its source log sources/ritual-<slug>.md
   Run: node tools/verify-rituals.js   (also run by verify.yml)
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, ".."), DOCS = path.join(ROOT, "docs");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

const sb = { window: {} }; vm.createContext(sb);
for (const f of ["assets/data.js", "assets/vault-data.js"]) vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sb, { filename: f });
// the museum's camera views are an ES module for the browser: run it here with its export turned into a global
vm.runInContext(read("docs/museum/ritual-views.js").replace(/^export const (\w+)/gm, "globalThis.$1"), sb, { filename: "ritual-views.js" });
const A = sb.window.ARCHIVE, V = sb.window.VAULT, VIEWS = sb.RITUAL_VIEWS || {};
let cleared = {};
try { cleared = JSON.parse(read("reviews/cleared.json")); } catch (e) { cleared = {}; }
const clearedRituals = new Set((cleared.rituals || []).map((r) => r.id));

const chapters = new Set(A.chapters.map((c) => c.id));
const vault = new Set(V.items.map((v) => v.id.toLowerCase()));
const nonEmpty = (x) => typeof x === "string" && x.trim().length > 0;
const errors = [];
let n = 0, steps = 0, quotes = 0;

const dir = path.join(ROOT, "data", "rituals");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
if (!files.length) errors.push("data/rituals: no ritual files");
for (const f of files) {
  const slug = f.slice(0, -5), at = "data/rituals/" + f;
  let r;
  try { r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch (e) { errors.push(at + ": not valid JSON"); continue; }
  n++;
  const id = r.id, tier = r.sensitivity_tier, status = r.review && r.review.status;
  const ch = (r.chapter || "").replace(/^chapter:/, "");
  if (r.chapter && !chapters.has(ch)) errors.push(`${at}: chapter "${r.chapter}" does not exist`);
  if (tier === 1 && !r.chapter && !(r.steps || []).some((s) => s.anchor_gap)) errors.push(`${at}: a tier-1 ritual needs a chapter (or an anchor_gap note saying none covers it yet)`);
  if (tier === 3 && !clearedRituals.has(id)) errors.push(`${at}: tier 3 needs Carter's approval in reviews/cleared.json under "rituals"`);
  if (tier === 2 && !(r.framing_approval && r.framing_approval.by === "Carter")) errors.push(`${at}: tier 2 needs framing_approval (Carter's recorded approval)`);
  if (status === "cleared" && !clearedRituals.has(id)) errors.push(`${at}: marked cleared but not in reviews/cleared.json`);
  const src = new Map((r.sources || []).map((s) => [s.id, s]));
  for (const s of r.sources || []) {
    if (!/^https:\/\//.test(s.url || "")) errors.push(`${at}: source ${s.id} has no https link`);
    if (!nonEmpty(s.checked)) errors.push(`${at}: source ${s.id} does not say how it was checked`);
  }
  const logFile = `sources/ritual-${slug}.md`;
  const log = fs.existsSync(path.join(ROOT, logFile)) ? read(logFile).replace(/\s+/g, " ") : null;   // line-wrapping in the log does not count
  const v = r.museum_object ? VIEWS[slug] : null;
  if (r.museum_object) {
    const obj = r.museum_object.replace(/^relic:/, "");
    if (!vault.has(obj)) errors.push(`${at}: museum_object ${r.museum_object} is not a Vault object`);
    if (!v) errors.push(`${at}: launched from a museum case but has no camera views in docs/museum/ritual-views.js`);
    else if (v.object !== obj) errors.push(`${at}: ritual-views.js names object ${v.object}, the ritual ${obj}`);
    for (const l of (v && v.endLinks) || []) if (!fs.existsSync(path.join(DOCS, l[1].split("#")[0]))) errors.push(`${at}: end link to missing page ${l[1]}`);
  }
  for (const s of r.steps || []) {
    steps++;
    const where = `${at} step ${s.sequence_order}`;
    if (!Array.isArray(s.source_ids) || !s.source_ids.length) errors.push(`${where}: no source`);
    for (const sid of s.source_ids || []) if (!src.has(sid)) errors.push(`${where}: unknown source ${sid}`);
    if (!nonEmpty(s.text)) errors.push(`${where}: no text`);
    if (v) {
      const view = v.views && v.views[s.sequence_order];
      if (!view || typeof view.u !== "number" || view.u < 0 || view.u > 1) errors.push(`${where}: no camera view (u between 0 and 1) in ritual-views.js`);
    }
    for (const m of String(s.text || "").matchAll(/“([^”]{20,})”/g)) {
      quotes++;
      if (!log) errors.push(`${where}: shows a quotation but there is no source log ${logFile}`);
      else if (!log.includes(m[1].replace(/[.,]$/, ""))) errors.push(`${where}: quotation not logged word for word in ${logFile}: "${m[1].slice(0, 60)}…"`);
    }
  }
}
for (const slug of Object.keys(VIEWS)) if (!files.includes(slug + ".json")) errors.push(`docs/museum/ritual-views.js: views for unknown ritual ${slug}`);

if (errors.length) {
  console.error(`verify-rituals: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`verify-rituals: OK — ${n} ritual file(s), ${steps} step(s) all sourced, ${quotes} quotation(s) logged; no unapproved tier-2 or tier-3 ritual`);
