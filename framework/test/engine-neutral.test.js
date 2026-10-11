"use strict";
/* The engine must stay content-neutral: no tradition, deity or practice name may
   appear anywhere in framework/engine/. The word list is built from the archive's
   own data (Pantheon traditions, chapter titles, ritual files) plus a fixed list,
   so a new tradition added to the site is covered automatically. */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const FIXED = ["buddh", "christ", "islam", "muslim", "jew", "judai", "hindu", "catholic", "orthodox", "protestant", "sikh",
  "zoroastr", "shinto", "dao", "tao", "confuci", "pagan", "wicca", "spiritualis", "jain", "bahai", "baha'i", "vedic", "sufi",
  "kabbal", "gnostic", "druid", "norse", "aztec", "maya", "inca", "egypt", "greek", "roman", "celtic", "satan",
  "mass", "communion", "eucharist", "baptism", "salat", "prayer", "puja", "seance", "séance", "votive", "candle",
  "meditat", "breath", "sutta", "sutra", "scripture", "bible", "quran", "qur'an", "torah", "temple", "church", "mosque",
  "god", "gods", "goddess", "deity", "saint", "ritual", "sacred", "holy", "divine"];

function wordList() {
  const win = {}; const ctx = vm.createContext({ window: win });
  for (const f of ["docs/assets/data.js", "docs/assets/pantheon-data.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx);
  const words = new Set(FIXED);
  const addWords = (s) => String(s).toLowerCase().split(/[^a-zà-ÿāīūṛṣṇśḥ']+/).filter((w) => w.length >= 5).forEach((w) => words.add(w));
  for (const [k, t] of Object.entries(win.PANTHEON.traditions)) { if (k.length >= 5) words.add(k.toLowerCase()); addWords(t.name); }
  for (const c of win.ARCHIVE.chapters) if (c.kind === "tradition") addWords(c.title);
  const rit = path.join(ROOT, "data", "rituals");
  for (const f of fs.readdirSync(rit).filter((f) => f.endsWith(".json"))) addWords(JSON.parse(fs.readFileSync(path.join(rit, f), "utf8")).tradition);
  // Plain English words that turn up in chapter titles but say nothing about any tradition.
  for (const w of ["early", "later", "modern", "classical", "ancient", "valley", "world", "religion", "religions", "movements", "practice",
    "traditions", "tradition", "second", "first", "great", "age", "the", "and", "new", "folk", "thought", "after", "beyond"]) words.delete(w);
  return [...words];
}

function engineFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? engineFiles(path.join(dir, d.name)) : [path.join(dir, d.name)]);
}

test("no tradition name appears in framework/engine/", () => {
  const words = wordList();
  assert.ok(words.length > 80, "word list unexpectedly small: " + words.length);
  const hits = [];
  for (const f of engineFiles(path.join(ROOT, "framework", "engine"))) {
    const text = fs.readFileSync(f, "utf8").toLowerCase();
    for (const w of words) {
      const re = new RegExp("(^|[^a-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + (FIXED.includes(w) ? "" : "([^a-z]|$)"));
      if (re.test(text)) hits.push(path.relative(ROOT, f) + ": " + w);
    }
  }
  assert.deepStrictEqual(hits, []);
});

test("the check itself catches a planted name", () => {
  const words = wordList();
  assert.ok(words.includes("buddh") && words.some((w) => w.startsWith("egypt")));
});
