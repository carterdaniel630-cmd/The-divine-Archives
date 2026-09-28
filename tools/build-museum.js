#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — Virtual Museum builder

   Generates the museum from the archive's own data, so nothing in it is typed
   twice. Reads docs/assets/{data,plates,emblems,vault-data,pantheon-data,
   pantheon-art}.js (same vm sandbox as build-chapters.js) and writes:

     docs/museum/manifest.json      layout-level data for every wing and room
     docs/museum/wings/<wing>.json  per-wing detail loaded on approach: label
                                    text, plate / emblem / Pantheon SVGs
     docs/museum.html               the fallback directory, between the
                                    <!-- museum:directory --> markers

   Rules (museum/00-scoping/PLAN.md §2, §13 as decided in Phase 1):
     - A Vault item's home room is the first chapter in its `chapters` list; a
       figure's is the first in its `ch` list. Other rooms that list it show it
       on their "See also" board.
     - Figures drawn with a glyph head appear as calligraphy panels, never as
       statues or medallion portraits.
     - Secret-sacred or devotional objects shown without images in the Vault
       (NO_IMAGE) get a plaque instead of a display case and prop.
     - Props in cases are generic stand-ins chosen by object type, and every
       label card says so.

   Usage: node tools/build-museum.js
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUT = path.join(DOCS, "museum");

const noopNode = { textContent: "", appendChild() {}, setAttribute() {} };
const sandbox = { window: {}, document: { createElement: () => Object.assign({}, noopNode), head: noopNode, documentElement: noopNode }, console };
vm.createContext(sandbox);
for (const f of ["assets/data.js", "assets/plates.js", "assets/emblems.js", "assets/vault-data.js", "assets/pantheon-data.js", "assets/pantheon-art.js"]) {
  vm.runInContext(fs.readFileSync(path.join(DOCS, f), "utf8"), sandbox, { filename: f });
}
const A = sandbox.window.ARCHIVE;
const PLATES = sandbox.window.PLATES;
const PLATE_ART = sandbox.window.PLATE_ART;
const EMBLEMS = sandbox.window.EMBLEMS;
const VAULT = sandbox.window.VAULT;
const PANTHEON = sandbox.window.PANTHEON;
const PANTHEON_ART = sandbox.window.PANTHEON_ART;

// ---- curated inputs (the only hand-written museum data) ------------------
// the chapter-to-game map lives inline in symbols.html; read it from there so it is not copied
const symbolsHtml = fs.readFileSync(path.join(DOCS, "symbols.html"), "utf8");
const GAME = {};
for (const m of symbolsHtml.matchAll(/(\w+):\s*\{\s*gameId:"(\w+)",\s*ch:"(ch\d+)",\s*title:"([^"]+)"/g)) GAME[m[3]] = { id: m[2], title: m[4] };
// Vault entries that deliberately show no image (see their own entries)
const NO_IMAGE = { v68: "The Vault shows no image of the tjurunga: they are secret-sacred objects.", v76: "The Vault shows no image connected with the Báb, out of respect for Bahá'í practice." };
// living traditions that data.js files in an early wing (PLAN §4 flags; §13 decision 7)
const LIVING = ["ch33", "ch61", "ch62", "ch63"];
// objects shown in a floor vitrine rather than a standing case
const FLOOR = { v84: true };
// objects with a purpose-built rendition instead of a generic stand-in (each labelled a rendition, not a replica)
const RENDITION = { v88: "magdalene" };
// tradition trails: a family of rooms walked in chronological order
const TRAILS = [
  { id: "christianity", name: "Christianity", rooms: ["ch16", "ch22", "ch60", "ch28", "ch31", "ch64"] },
  { id: "judaism", name: "Judaism", rooms: ["ch07", "ch10", "ch19", "ch26"] },
  { id: "buddhism", name: "Buddhism", rooms: ["ch11", "ch20", "ch53", "ch54"] },
  { id: "islam", name: "Islam", rooms: ["ch21", "ch27"] },
  { id: "gnosis", name: "Gnosis and dualism", rooms: ["ch17", "ch45", "ch55", "ch56"] },
  { id: "esoteric", name: "Western esotericism", rooms: ["ch26", "ch37", "ch38", "ch39"] }
];

// ---- helpers -------------------------------------------------------------
const GOLD = "#c79a54", GOLD_BRIGHT = "#e7c680";
const decode = (s) => String(s || "")
  .replace(/<[^>]+>/g, "")
  .replace(/&rsquo;|&lsquo;/g, (m) => (m === "&rsquo;" ? "’" : "‘"))
  .replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
  .replace(/&amp;/g, "&").replace(/&middot;/g, "·").replace(/&hellip;/g, "…").replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/\s+/g, " ").trim();
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// a plate or emblem SVG made standalone: xmlns added, currentColor made gold
const standalone = (svg) => String(svg || "")
  .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
  .replace(/currentColor/g, GOLD_BRIGHT);
// Pantheon emblems are styled by archive.css; inline those rules so the SVG renders on its own
const css = fs.readFileSync(path.join(DOCS, "assets", "archive.css"), "utf8");
const ptRules = (css.match(/^\.pt-svg \.pt-[^\n]+$/gm) || []).join("");
function figureSvg(f) {
  const tr = PANTHEON.traditions[f.t] || { color: GOLD };
  const rules = ptRules.replace(/var\(--acc, var\(--gold\)\)/g, tr.color).replace(/var\(--gold-bright\)/g, GOLD_BRIGHT).replace(/var\(--gold\)/g, GOLD);
  return PANTHEON_ART.svg(f, tr.color, "mu" + f.id.replace(/[^a-z0-9]/gi, ""))
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" ')
    .replace(/(<svg[^>]*>)/, "$1<style>" + rules + "</style>");
}
const plateCaption = (id) => { const m = (PLATES[id] || "").match(/<figcaption>([\s\S]*?)<\/figcaption>/); return m ? decode(m[1].replace(/<span class="tag">[\s\S]*?<\/span>/, "")) : ""; };
// stand-in prop by the Vault object's interactive type, falling back to its category
function propFor(i) {
  const t = (i.artifact && i.artifact.type) || "";
  const byType = { codex: "codex", scroll: "scroll", palimpsest: "codex", inscription: "slab", tablet: "tablet", oracle: "bone", lance: "spear", linen: "cloth", crown: "ring", ark: "chest", bowl: "bowl", cauldron: "bowl", venus: "figurine", skydisc: "disc", khipu: "cords", cartouche: "slab", gate: "slab", enclosure: "pillar", chamber: "slab", haykal: "tablet", veve: "tablet", scales: "codex", daycount: "codex" };
  if (byType[t]) return byType[t];
  return { manuscripts: "codex", texts: "tablet", relics: "casket" }[i.category] || "casket";
}

// ---- rooms ---------------------------------------------------------------
const pub = A.chapters.filter((c) => c.status === "published");
const vaultPub = VAULT.items.filter((i) => i.status === "published");
const eras = A.eras.map((e, k) => ({ slug: e.slug, num: e.num, name: e.name, dates: e.dates, blurb: e.blurb, side: k % 2 === 0 ? "west" : "east" }));
const roomOf = (id) => pub.find((c) => c.id === id);
const rooms = pub.map((c) => {
  const homeVault = vaultPub.filter((i) => i.chapters[0] === c.id).sort((a, b) => (a.year || 0) - (b.year || 0)).map((i) => i.id);
  const seeVault = vaultPub.filter((i) => i.chapters.indexOf(c.id) > 0).map((i) => i.id);
  const homeFigs = PANTHEON.figures.filter((f) => f.ch[0] === c.id).map((f) => f.id);
  const seeFigs = PANTHEON.figures.filter((f) => f.ch.indexOf(c.id) > 0).map((f) => f.id);
  return {
    id: c.id, title: c.title, kind: c.kind, wing: c.era || "rotunda", pending: !!c.pending,
    homeVault, seeVault, homeFigs, seeFigs,
    game: GAME[c.id] ? GAME[c.id].id : null,
    living: LIVING.indexOf(c.id) !== -1,
    plate: !!PLATE_ART[c.id]
  };
});
// wing order and room order inside a wing: by chapter number (the archive's own order)
const wingRooms = {};
for (const r of rooms) (wingRooms[r.wing] = wingRooms[r.wing] || []).push(r.id);
Object.values(wingRooms).forEach((a) => a.sort((x, y) => +x.slice(2) - +y.slice(2)));

// ---- per-wing detail files -------------------------------------------------
fs.mkdirSync(path.join(OUT, "wings"), { recursive: true });
const figById = Object.fromEntries(PANTHEON.figures.map((f) => [f.id, f]));
const vaultById = Object.fromEntries(vaultPub.map((i) => [i.id, i]));
const homeRoomOfVault = (i) => i.chapters[0];
const wingFiles = {};
for (const wing of Object.keys(wingRooms)) {
  const ids = wingRooms[wing];
  const out = { wing, emblem: wing === "rotunda" ? "" : standalone(EMBLEMS[wing]), rooms: {}, vault: {}, figs: {} };
  for (const id of ids) {
    const c = roomOf(id), r = rooms.find((x) => x.id === id);
    out.rooms[id] = {
      title: c.title, eraLabel: c.eraLabel || "Comparative theme · cross-era", summary: c.summary, pending: !!c.pending,
      plate: standalone(PLATE_ART[id]), plateCaption: plateCaption(id),
      game: GAME[id] || null
    };
    for (const vid of r.homeVault.concat(r.seeVault)) {
      const i = vaultById[vid];
      out.vault[vid] = {
        title: i.title, category: VAULT.categories[i.category] || i.category, dated: i.dated, held: i.held, summary: i.summary,
        slug: i.slug, home: homeRoomOfVault(i), pending: !!i.pending,
        prop: NO_IMAGE[vid] ? null : (RENDITION[vid] || propFor(i)), rendition: !!RENDITION[vid], noImage: NO_IMAGE[vid] || null, floor: !!FLOOR[vid],
        forgery: /forger/i.test(i.dated || "") || /\bforgery\b/i.test(i.title)
      };
    }
    for (const fid of r.homeFigs.concat(r.seeFigs)) {
      if (out.figs[fid] && out.figs[fid].svg) continue;
      const f = figById[fid], tr = PANTHEON.traditions[f.t] || {};
      const shown = r.homeFigs.indexOf(fid) !== -1; // see-also figures appear on a text board, not as emblems
      out.figs[fid] = {
        name: f.n, epithet: f.e, tradition: tr.name || f.t, color: tr.color || GOLD, kind: f.k, desc: f.d, contested: f.c || null,
        home: f.ch[0], glyph: /^glyph:/.test(f.p || ""), svg: shown ? figureSvg(f) : ""
      };
    }
  }
  const json = JSON.stringify(out);
  fs.writeFileSync(path.join(OUT, "wings", wing + ".json"), json);
  wingFiles[wing] = json.length;
}

// ---- manifest ---------------------------------------------------------------
const manifest = {
  generated: "build-museum.js",
  note: "Generated from the archive's data files; do not edit by hand.",
  eras,
  themes: A.themes.map((t) => ({ slug: t.slug, name: t.name, chapter: t.chapter })),
  wings: Object.fromEntries(Object.entries(wingRooms)),
  rooms,
  trails: TRAILS.map((t) => ({ id: t.id, name: t.name, rooms: t.rooms.filter((id) => roomOf(id)) })),
  names: {
    vault: Object.fromEntries(vaultPub.map((i) => [i.id, [i.title, i.chapters[0], i.slug]])),
    figs: Object.fromEntries(PANTHEON.figures.map((f) => [f.id, [f.n, f.ch[0]]]))
  }
};
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest));

// ---- fallback directory in museum.html ------------------------------------
function directory() {
  const roomLi = (id) => {
    const c = roomOf(id), r = rooms.find((x) => x.id === id);
    const v = r.homeVault.map((vid) => `<a href="vault/${esc(vaultById[vid].slug)}.html">${esc(vaultById[vid].title)}</a>`);
    const f = r.homeFigs.map((fid) => `<a href="pantheon.html#${esc(fid)}">${esc(figById[fid].n)}</a>`);
    return `<li id="dir-${id}"><a class="dir-room" href="chapters/${id}.html">${esc(c.title)}</a>` +
      (c.pending ? ` <span class="badge is-pending">pending review</span>` : "") +
      (v.length ? `<p class="dir-ex"><span>Vault:</span> ${v.join(" · ")}</p>` : "") +
      (f.length ? `<p class="dir-ex"><span>Pantheon:</span> ${f.join(" · ")}</p>` : "") +
      (GAME[id] ? `<p class="dir-ex"><span>Game:</span> <a href="symbols.html#play=${GAME[id].id}">${esc(GAME[id].title)}</a></p>` : "") +
      `</li>`;
  };
  let h = `<section class="dir-wing"><h3>The Rotunda · Comparative themes</h3><ul>${(wingRooms.rotunda || []).map(roomLi).join("")}</ul></section>`;
  for (const e of A.eras) {
    if (!wingRooms[e.slug]) continue;
    h += `<section class="dir-wing"><h3>Wing ${esc(e.num)} · ${esc(e.name)} <span>${esc(e.dates)}</span></h3><ul>${wingRooms[e.slug].map(roomLi).join("")}</ul></section>`;
  }
  return h;
}
const mpath = path.join(DOCS, "museum.html");
if (fs.existsSync(mpath)) {
  const html = fs.readFileSync(mpath, "utf8");
  const a = "<!-- museum:directory -->", b = "<!-- /museum:directory -->";
  const i = html.indexOf(a), j = html.indexOf(b);
  if (i !== -1 && j !== -1) {
    const next = html.slice(0, i + a.length) + "\n" + directory() + "\n" + html.slice(j);
    if (next !== html) fs.writeFileSync(mpath, next);
  }
}

const kb = (n) => (n / 1024).toFixed(1) + " KB";
console.log("build-museum: " + rooms.length + " rooms in " + Object.keys(wingRooms).length + " wings; manifest " +
  kb(fs.statSync(path.join(OUT, "manifest.json")).size) + "; wing files " +
  Object.entries(wingFiles).map(([w, n]) => w.replace(/^\d\d-/, "") + " " + kb(n)).join(", "));
