#!/usr/bin/env node
/* Verify the games catalog (docs/assets/games/catalog.js) is the one list of the games,
   and that every other place that lists them agrees with it:
     - every catalog chapter exists in docs/assets/data.js;
     - every game module registers a catalog id, and every catalog id has a module on the Symbols page;
     - the home page cards, pilgrimage/arcade.html and the 3D arcade (pilgrimage/sites/arcade/site.js)
       list exactly the catalog's games, with the catalog's title and "hidden in" chapter. */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(read("docs/assets/data.js"), ctx);
vm.runInContext(read("docs/assets/games/catalog.js"), ctx);
const CH = {}; ctx.window.ARCHIVE.chapters.forEach((c) => (CH[c.id] = c.title));
const CAT = ctx.window.ARCHIVE_GAMES;
const byId = {}; CAT.forEach((g) => (byId[g.id] = g));
const decode = (s) => s.replace(/&rsquo;/g, "’").replace(/&amp;/g, "&").replace(/&mdash;/g, "—").replace(/'/g, "’").trim();
const same = (a, b) => decode(a) === decode(b);
let fails = 0;
const fail = (m) => { console.log("  FAIL " + m); fails++; };

// the catalog itself
if (CAT.length !== new Set(CAT.map((g) => g.id)).size) fail("duplicate ids in catalog.js");
CAT.forEach((g) => {
  ["id", "title", "subtitle", "chapter", "hiddenIn"].forEach((k) => { if (!g[k]) fail(g.id + ": missing " + k); });
  [g.chapter, g.hiddenIn].concat(g.eggs || []).forEach((c) => { if (!CH[c]) fail(g.id + ": unknown chapter " + c); });
});

// modules: each registers a catalog id and is loaded on the Symbols page
const symbols = read("docs/symbols.html");
if (!/assets\/games\/catalog\.js/.test(symbols)) fail("symbols.html does not load catalog.js");
const dir = path.join(ROOT, "docs/assets/games");
const registered = {};
fs.readdirSync(dir).filter((f) => f.endsWith(".js")).forEach((f) => {
  const m = /AG\.register\("([a-z0-9_-]+)"/.exec(fs.readFileSync(path.join(dir, f), "utf8"));
  if (!m) return;
  registered[m[1]] = f;
  if (!byId[m[1]]) fail(f + " registers \"" + m[1] + "\", which is not in catalog.js");
  if (!symbols.includes("assets/games/" + f)) fail(f + " is not loaded on symbols.html");
});
CAT.forEach((g) => { if (!registered[g.id]) fail(g.id + ": no game module registers it"); });

// other lists of the games
function checkList(where, rows, withChapter) {
  const seen = {};
  rows.forEach((r) => {
    const g = byId[r.id];
    if (!g) return fail(where + ": lists unknown game \"" + r.id + "\"");
    seen[r.id] = 1;
    if (r.title != null && !same(r.title, g.title) && !decode(r.title).startsWith(decode(g.title) + " —"))
      fail(where + ": " + r.id + " is titled \"" + r.title + "\", catalog says \"" + g.title + "\"");
    if (withChapter && r.ch !== g.hiddenIn) fail(where + ": " + r.id + " is under " + r.ch + ", catalog says " + g.hiddenIn);
    if (withChapter && r.chName != null && !same(r.chName, CH[g.hiddenIn])) fail(where + ": " + r.id + " names its chapter \"" + r.chName + "\", data.js says \"" + CH[g.hiddenIn] + "\"");
  });
  CAT.forEach((g) => { if (!seen[g.id]) fail(where + ": " + g.id + " is missing"); });
}
const home = read("docs/index.html");
checkList("index.html", [...home.matchAll(/href="symbols\.html#play=([a-z]+)">[\s\S]*?game-card-name">([^<]+)</g)].map((m) => ({ id: m[1], title: m[2] })), false);
const arcade = read("docs/pilgrimage/arcade.html");
checkList("pilgrimage/arcade.html", [...arcade.matchAll(/symbols\.html#play=([a-z]+)">([^<]+)<\/a> &middot; <a href="\.\.\/chapters\/(ch\d+)\.html">([^<]+)</g)]
  .map((m) => ({ id: m[1], title: m[2], ch: m[3], chName: m[4] })), true);
const site = read("docs/pilgrimage/sites/arcade/site.js");
checkList("pilgrimage/sites/arcade/site.js", [...site.matchAll(/\{ id: "([a-z]+)", ch: "(ch\d+)", chName: "([^"]+)", title: "([^"]+)"/g)]
  .map((m) => ({ id: m[1], ch: m[2], chName: m[3], title: m[4] })), true);

console.log("Games catalog: " + CAT.length + " games | modules: " + Object.keys(registered).length + " | failures: " + fails);
if (fails) process.exit(1);
console.log("VERIFY OK — every list of the games agrees with catalog.js.");
