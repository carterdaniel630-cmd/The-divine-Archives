#!/usr/bin/env node
/* Builds the framework's entity registry: framework/registry/<type>.json (one shard
   per entity type) and framework/registry/index.json (counts against the target).

   Every entry follows framework/schema/entity.schema.json and has a stable ID,
   <type>:<slug>. Everything is read from files already in the repo; nothing is
   invented, and nothing in docs/ is changed. The output is sorted and carries
   no timestamp, so a re-run on the same tree gives the same bytes.

   Usage:  node tools/build-entity-registry.js [--check]
     --check  rebuild in memory and fail if the committed registry differs */

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "framework", "registry");
const TARGET = 10000;
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// ---- load the site's data globals the same way the build tools do
const win = {};
const ctx = vm.createContext({ window: win });
for (const f of ["docs/assets/data.js", "docs/assets/pantheon-data.js", "docs/assets/vault-data.js", "docs/assets/pilgrimage-data.js"]) {
  vm.runInContext(read(f), ctx, { filename: f });
}
const A = win.ARCHIVE, P = win.PANTHEON, V = win.VAULT, G = win.PILGRIMAGE;
const manifest = JSON.parse(read("docs/museum/manifest.json"));
const symbols = JSON.parse(read("tools/data/symbols.json"));
const sky = JSON.parse(read("docs/museum/sky.json"));

const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const decode = (s) => s.replace(/<[^>]+>/g, "").replace(/&rsquo;|&#8217;/g, "’").replace(/&lsquo;/g, "‘").replace(/&amp;/g, "&")
  .replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&[a-z]+;/g, "").replace(/\s+/g, " ").trim();

const shards = {};
const problems = [];
function add(e) {
  const type = e.id.slice(0, e.id.indexOf(":"));
  if (type !== e.type) problems.push(e.id + ": type does not match id");
  if (!/^[a-z][a-z0-9-]*:[a-z0-9][a-z0-9._/-]*$/.test(e.id)) problems.push(e.id + ": bad id");
  const shard = (shards[type] = shards[type] || new Map());
  if (shard.has(e.id)) { problems.push(e.id + ": duplicate"); return; }
  const clean = {};
  for (const k of ["id", "type", "label", "parent", "era", "status", "href", "links", "from"]) {
    if (e[k] === undefined || e[k] === null || (Array.isArray(e[k]) && !e[k].length)) continue;
    clean[k] = Array.isArray(e[k]) ? [...new Set(e[k])].sort() : e[k];
  }
  shard.set(e.id, clean);
}
const ch = (id) => "chapter:" + id;
const statusOf = (c) => (c.pending ? "pending" : c.status);

// ---- eras and themes
for (const e of A.eras) add({ id: "era:" + e.slug, type: "era", label: e.name, href: "eras/" + e.slug + ".html", from: "docs/assets/data.js" });
for (const t of A.themes) add({ id: "theme:" + t.slug, type: "theme", label: t.name, links: t.chapter ? [ch(t.chapter)] : [], status: t.chapter ? undefined : "planned", from: "docs/assets/data.js" });

// ---- chapters, and their sections (the h2 anchors build-chapters.js writes)
for (const c of A.chapters) {
  add({ id: ch(c.id), type: "chapter", label: c.title, era: c.era || undefined, status: statusOf(c), href: "chapters/" + c.id + ".html", from: "docs/assets/data.js" });
  const page = path.join(ROOT, "docs", "chapters", c.id + ".html");
  if (!fs.existsSync(page)) { problems.push(c.id + ": no prerendered page, sections not read"); continue; }
  const html = fs.readFileSync(page, "utf8");
  for (const m of html.matchAll(/<h2 id="([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
    if (["figures", "in-the-vault"].includes(m[1])) continue; // link lists, not chapter text
    add({ id: "section:" + c.id + "/" + m[1], type: "section", label: decode(m[2]), parent: ch(c.id), era: c.era || undefined, href: "chapters/" + c.id + ".html#" + m[1], from: rel(page) });
  }
}

// ---- Pantheon: traditions and figures
for (const [k, t] of Object.entries(P.traditions)) add({ id: "tradition:" + slug(k), type: "tradition", label: t.name, from: "docs/assets/pantheon-data.js" });
for (const f of P.figures) {
  add({ id: "figure:" + slug(f.id), type: "figure", label: f.n, parent: "tradition:" + slug(f.t), href: "pantheon.html#" + f.id,
    links: [...(f.ch || []).map(ch), ...(f.v || []).map((v) => "relic:" + v)], from: "docs/assets/pantheon-data.js" });
}

// ---- Vault objects
for (const v of V.items) {
  add({ id: "relic:" + v.id, type: "relic", label: v.title, era: v.era || undefined, status: v.pending ? "pending" : v.status,
    href: v.status === "published" ? "vault/" + v.slug + ".html" : undefined, links: (v.chapters || []).map(ch), from: "docs/assets/vault-data.js" });
}

// ---- symbol walls: one entity per distinct sign (by Unicode code point), one per set
for (const [wall, w] of Object.entries(symbols.walls)) {
  w.sets.forEach((set, i) => {
    const setId = "symbolset:" + wall + "/" + (i + 1);
    add({ id: setId, type: "symbolset", label: set.name, href: "museum/symbols/" + wall + ".webp", from: "tools/data/symbols.json" });
    for (const s of set.signs) {
      const id = "symbol:u-" + s.cp.toLowerCase();
      const have = shards.symbol && shards.symbol.get(id);
      if (have) { have.links = [...new Set([...(have.links || []), setId])].sort(); continue; }
      add({ id, type: "symbol", label: s.id + " (U+" + s.cp.toUpperCase() + ")", links: [setId], from: "tools/data/symbols.json" });
    }
  });
}

// ---- Pilgrimage: sites, and the info points of every site that has a module
for (const s of G.sites) {
  add({ id: "site:" + s.id, type: "site", label: s.name, era: s.era || undefined, status: s.status,
    href: s.status === "queued" ? undefined : "pilgrimage/" + s.id + ".html",
    links: [...(s.chapters || []).map(ch), ...(s.vault || []).map((v) => "relic:" + v)], from: "docs/assets/pilgrimage-data.js" });
}
// The hidden Archive Arcade has a page but is deliberately not in the Pilgrimage list.
if (fs.existsSync(path.join(ROOT, "docs", "pilgrimage", "arcade.html"))) {
  add({ id: "site:arcade", type: "site", label: "The Archive Arcade", status: "hidden", href: "pilgrimage/arcade.html", from: "docs/pilgrimage/arcade.html" });
}
const sitesDir = path.join(ROOT, "docs", "pilgrimage", "sites");
for (const dir of fs.readdirSync(sitesDir).sort()) {
  const f = path.join(sitesDir, dir, "site.js");
  if (!fs.existsSync(f) || dir === "arcade") continue; // the arcade's cards are the games, registered below
  const src = fs.readFileSync(f, "utf8");
  const parent = shards.site && shards.site.has("site:" + dir) ? "site:" + dir : undefined;
  if (!parent) problems.push("pilgrimage module " + dir + " has no entry in pilgrimage-data.js");
  // info entries are object literals that start with an id and a section
  for (const m of src.matchAll(/\{\s*id:\s*"([a-z0-9-]+)",\s*section:\s*"[a-z0-9-]+",[^\n]*?title:\s*"((?:[^"\\]|\\.)*)"/g)) {
    add({ id: "waypoint:" + dir + "/" + m[1], type: "waypoint", label: decode(m[2]), parent, href: "pilgrimage/" + dir + ".html", from: rel(f) });
  }
}

// ---- museum: wings, rooms, trails
for (const w of Object.keys(manifest.wings)) add({ id: "wing:" + slug(w), type: "wing", label: (A.eras.find((e) => e.slug === w) || { name: "The Rotunda" }).name, links: manifest.wings[w].map((r) => "room:" + r), from: "docs/museum/manifest.json" });
for (const r of manifest.rooms) {
  add({ id: "room:" + r.id, type: "room", label: r.title, parent: "wing:" + slug(r.wing), status: r.pending ? "pending" : undefined, href: "museum.html#" + r.id,
    links: [ch(r.id), ...(r.homeVault || []).map((v) => "relic:" + v), ...(r.homeFigs || []).map((f) => "figure:" + slug(f)), ...(r.game ? ["game:" + r.game] : [])], from: "docs/museum/manifest.json" });
}
for (const t of manifest.trails) add({ id: "trail:" + t.id, type: "trail", label: t.name, links: t.rooms.map((r) => "room:" + r), from: "docs/museum/manifest.json" });

// ---- games (the arcade's list, which names each game's chapter)
const arcade = read("docs/pilgrimage/sites/arcade/site.js");
for (const m of arcade.matchAll(/\{\s*id:\s*"([a-z]+)",\s*ch:\s*"(ch\d+)",[^\n]*?title:\s*"([^"]+)"/g)) {
  add({ id: "game:" + m[1], type: "game", label: decode(m[3]), href: "symbols.html#play=" + m[1], links: [ch(m[2])], from: "docs/pilgrimage/sites/arcade/site.js" });
}

// ---- planetarium: named stars, constellations, sky lore (not the 4,867 unnamed catalogue stars)
// Two stars can share a traditional name (Alnair in Grus and in Centaurus): those get the constellation added.
const starNames = {};
for (const [, name] of sky.names) starNames[slug(name)] = (starNames[slug(name)] || 0) + 1;
for (const [, name, con] of sky.names) {
  add({ id: "star:" + slug(name) + (starNames[slug(name)] > 1 ? "-" + slug(con) : ""), type: "star", label: name, links: ["constellation:" + slug(con)], from: "docs/museum/sky.json" });
}
const consIds = new Set(sky.cons.map((c) => slug(c.id)));
for (const c of sky.cons) add({ id: "constellation:" + slug(c.id), type: "constellation", label: c.name, from: "docs/museum/sky.json" });
// Lore targets that are planets, the Milky Way or a horizon view are not constellation entities; only real constellations are linked.
for (const l of sky.lore) add({ id: "skylore:" + slug(l.id), type: "skylore", label: l.title, links: [...(l.chapter ? [ch(l.chapter)] : []), ...(l.targets || []).filter((t) => consIds.has(slug(t))).map((t) => "constellation:" + slug(t))], from: "docs/museum/sky.json" });

// ---- rituals (framework data; drafts stay drafts)
const ritDir = path.join(ROOT, "data", "rituals");
if (fs.existsSync(ritDir)) {
  for (const f of fs.readdirSync(ritDir).filter((f) => f.endsWith(".json")).sort()) {
    const r = JSON.parse(fs.readFileSync(path.join(ritDir, f), "utf8"));
    const anchors = (r.steps || []).map((s) => s.historical_text_anchor_id).filter(Boolean);
    add({ id: r.id, type: "ritual", label: r.title, status: r.review && r.review.status, links: [...(r.chapter ? [r.chapter] : []), ...anchors], from: rel(path.join(ritDir, f)) });
  }
}

// ---- sources: every distinct URL in the citation logs, linked to the logs that cite it
const srcDir = path.join(ROOT, "sources");
const citedBy = new Map();
for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith(".md")).sort()) {
  const owner = (f.match(/^(ch\d+|v\d+)-/) || [])[1];
  const ownerId = owner ? (owner[0] === "c" ? ch(owner) : "relic:" + owner) : f === "pantheon.md" ? null : f.startsWith("pilgrimage-") ? "site:" + f.slice(11, -3) : null;
  const text = fs.readFileSync(path.join(srcDir, f), "utf8");
  for (const m of text.matchAll(/https?:\/\/[^\s)<>\]"'`]+/g)) {
    const url = m[0].replace(/[.,;:]+$/, "");
    if (!citedBy.has(url)) citedBy.set(url, { files: new Set(), owners: new Set() });
    citedBy.get(url).files.add("sources/" + f);
    if (ownerId) citedBy.get(url).owners.add(ownerId);
  }
}
for (const [url, c] of citedBy) {
  let host = "";
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) { problems.push("unparseable URL " + url); continue; }
  const h = crypto.createHash("sha256").update(url).digest("hex").slice(0, 10);
  add({ id: "source:" + slug(host) + "/" + h, type: "source", label: url, links: [...c.owners], from: [...c.files].sort()[0] });
}

// ---- links must point at something that exists
const all = new Map();
for (const s of Object.values(shards)) for (const [id, e] of s) all.set(id, e);
const dangling = [];
for (const e of all.values()) for (const l of [...(e.links || []), ...(e.parent ? [e.parent] : [])]) if (!all.has(l)) dangling.push(e.id + " -> " + l);

// ---- write
const types = Object.keys(shards).sort();
const counts = Object.fromEntries(types.map((t) => [t, shards[t].size]));
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const out = {};
for (const t of types) {
  const entities = [...shards[t].values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  out[t + ".json"] = JSON.stringify({ type: t, count: entities.length, entities }, null, 1) + "\n";
}
out["index.json"] = JSON.stringify({
  note: "Generated by tools/build-entity-registry.js from files in the repo; do not edit by hand. Schema: framework/schema/entity.schema.json.",
  target: TARGET,
  total,
  shortfall: Math.max(0, TARGET - total),
  counts,
  shards: types.map((t) => t + ".json"),
  dangling_links: dangling.sort(),
  problems: problems.sort()
}, null, 1) + "\n";

if (process.argv.includes("--check")) {
  let bad = 0;
  for (const [f, body] of Object.entries(out)) {
    const p = path.join(OUT, f);
    if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== body) { console.error("registry out of date: framework/registry/" + f); bad++; }
  }
  for (const f of fs.existsSync(OUT) ? fs.readdirSync(OUT) : []) if (!out[f]) { console.error("stale shard: framework/registry/" + f); bad++; }
  if (bad) { console.error("Run: node tools/build-entity-registry.js"); process.exit(1); }
  console.log("registry up to date (" + total + " entities)");
} else {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (!out[f]) fs.unlinkSync(path.join(OUT, f));
  for (const [f, body] of Object.entries(out)) fs.writeFileSync(path.join(OUT, f), body);
  console.log("entities: " + total + " of a " + TARGET + " target (" + (total >= TARGET ? "met" : "short by " + (TARGET - total)) + ")");
  for (const t of types) console.log("  " + t.padEnd(14) + String(counts[t]).padStart(6));
  if (dangling.length) console.log("dangling links: " + dangling.length + " (listed in index.json)");
  if (problems.length) console.log("problems: " + problems.length + " (listed in index.json)");
}
