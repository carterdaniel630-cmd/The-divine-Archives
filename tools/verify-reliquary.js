#!/usr/bin/env node
/* Verify every Reliquary trivia question is grounded in real chapter text.
   For each question: the `basis` string MUST appear in its source chapter's
   rendered text. Also checks structure (chapter exists, 4 choices, answer in
   range, era matches). Exit non-zero on any failure. This is the mechanized
   "never invent facts" guarantee for the mini-games trivia. */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
function load(file, ctx) { vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx); }
const noop = { textContent: "", appendChild() {}, setAttribute() {}, style: {} };
const doc = { createElement() { return noop; }, querySelectorAll() { return []; }, addEventListener() {}, head: noop, documentElement: noop, body: noop };
const ctx = { window: {}, document: doc, console };
vm.createContext(ctx);
load("docs/assets/data.js", ctx);
load("docs/assets/chapters.js", ctx);
const A = ctx.window.ARCHIVE, C = ctx.window.CHAPTERS;
const eraSlugs = new Set(A.eras.map(e => e.slug).concat(["theme"]));
function strip(h) {
  return h.replace(/<[^>]+>/g, " ")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, "&").replace(/&hellip;/g, "…")
    .replace(/&[a-z]+;/g, " ").replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ").trim();
}
const text = {};
Object.keys(C).forEach(id => { text[id] = strip((C[id] || {}).html || "").toLowerCase(); });

const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/assets/games/data/reliquary.json"), "utf8"));
let fails = 0, ok = 0;
const ids = new Set();
bank.questions.forEach(q => {
  const where = q.id || JSON.stringify(q).slice(0, 40);
  function fail(msg) { console.log("  FAIL [" + where + "] " + msg); fails++; }
  if (ids.has(q.id)) fail("duplicate id"); ids.add(q.id);
  if (!q.chapter || !C[q.chapter]) return fail("unknown chapter " + q.chapter);
  if (!eraSlugs.has(q.era)) fail("bad era " + q.era);
  if (!Array.isArray(q.choices) || q.choices.length !== 4) fail("needs exactly 4 choices");
  if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) fail("answer out of range");
  if (!q.basis) return fail("no basis");
  if (text[q.chapter].indexOf(String(q.basis).toLowerCase()) === -1)
    return fail('basis not found in ' + q.chapter + ': "' + q.basis + '"');
  ok++;
});
const chapters = new Set(bank.questions.map(q => q.chapter));
const eras = new Set(bank.questions.map(q => q.era));
console.log("Reliquary bank: " + bank.questions.length + " questions | verified basis: " + ok + " | failures: " + fails);
console.log("coverage: " + chapters.size + " chapters, " + eras.size + " era-buckets, "
  + bank.questions.filter(q => q.curated).length + " curated");
if (fails) { console.log("VERIFY FAILED (" + fails + ")"); process.exit(1); }
console.log("VERIFY OK — every question is grounded in real chapter text.");
