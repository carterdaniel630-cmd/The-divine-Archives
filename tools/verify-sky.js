#!/usr/bin/env node
/* Verify the planetarium's lore (museum/sky-lore.json): every `basis` string of every entry must
   appear in the rendered text of the entry's chapter, and every target must exist in the sky data.
   The published docs/museum/sky.json must carry exactly these entries (run tools/build-sky.js). */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const noop = { textContent: "", appendChild() {}, setAttribute() {}, style: {} };
const doc = { createElement() { return noop; }, querySelectorAll() { return []; }, addEventListener() {}, head: noop, documentElement: noop, body: noop };
const ctx = { window: {}, document: doc, console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "content/chapters.js"), "utf8"), ctx);
const C = ctx.window.CHAPTERS;
function strip(h) { return h.replace(/<[^>]+>/g, " ").replace(/&mdash;/g, "—").replace(/&rsquo;/g, "’").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim().toLowerCase(); }
const lore = JSON.parse(fs.readFileSync(path.join(ROOT, "museum/sky-lore.json"), "utf8")).entries;
const sky = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/museum/sky.json"), "utf8"));
const ids = new Set(sky.cons.map((c) => c.id));
let fails = 0, ok = 0;
lore.forEach((e) => {
  const t = C[e.chapter] ? strip(C[e.chapter].html || "") : null;
  if (!t) { console.log("  FAIL [" + e.id + "] unknown chapter " + e.chapter); fails++; return; }
  (e.basis || []).forEach((b) => { if (t.indexOf(b.toLowerCase()) === -1) { console.log("  FAIL [" + e.id + "] basis not in " + e.chapter + ': "' + b + '"'); fails++; } else ok++; });
  if (!(e.basis || []).length) { console.log("  FAIL [" + e.id + "] no basis"); fails++; }
  e.targets.forEach((g) => {
    const good = ids.has(g) || /^planet:(mer|ven|mar|jup|sat|lun)$/.test(g) || /^circumpolar:-?\d+(\.\d+)?$/.test(g) || ["mw", "horizon", "about"].includes(g);
    if (!good) { console.log("  FAIL [" + e.id + "] unknown target " + g); fails++; }
  });
});
const pub = JSON.stringify(sky.lore), src = JSON.stringify(lore.map((e) => ({ id: e.id, targets: e.targets, chapter: e.chapter, title: e.title, text: e.text, verdict: e.verdict || null })));
if (pub !== src) { console.log("  FAIL docs/museum/sky.json is stale: run node tools/build-sky.js"); fails++; }
console.log("Planetarium lore: " + lore.length + " entries | basis strings verified: " + ok + " | failures: " + fails);
if (fails) process.exit(1);
console.log("VERIFY OK — every line of sky lore is grounded in real chapter text.");
