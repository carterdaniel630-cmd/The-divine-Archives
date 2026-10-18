#!/usr/bin/env node
/* ==========================================================================
   THE DIVINE ARCHIVES — standards board (Carter's Item 29)

   One page that lists every Claude-side and Muse-side item and whether it is up to
   standard: UP TO STANDARD, NEEDS WORK, BLOCKED, PARKED or NOT YET BUILT.

   Reads   handoff/standards/board.json      (hand-kept item list, one status each)
           graphify-out/graph.json            (the Graphify code map, if present)
   Writes  handoff/standards/board.html

       node tools/build-standards-board.js
       node tools/build-standards-board.js --fragment <out.html>
   The second form writes the page without <!doctype>/<head> wrapping, for
   publishing as a claude.ai page that Carter can open on his phone.

   For each item with `paths`, the map adds: how many code symbols those files
   hold, which other files call into them (what a change would touch), and the
   map's area names. Graphify's areas are numbered; the board names each one by
   the file most of its symbols come from. The board also says whether the map
   was built from the commit it is looking at.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "handoff", "standards", "board.json");
const GRAPH = path.join(ROOT, "graphify-out", "graph.json");
const OUT = path.join(ROOT, "handoff", "standards", "board.html");

const STATES = [
  ["needs-work", "Needs work", "Built, not yet up to standard. Fix first."],
  ["not-built", "Not yet built", "In the queue."],
  ["blocked", "Blocked", "Waiting on a ruling, Muse, or something outside the loop."],
  ["up", "Up to standard", "Done, verified, meets the bar."],
  ["parked", "Parked", "Carter parked it. Do not build."],
];
const LABEL = Object.fromEntries(STATES.map(([k, l]) => [k, l]));

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function readGraph() {
  if (!fs.existsSync(GRAPH)) return null;
  const g = JSON.parse(fs.readFileSync(GRAPH, "utf8"));
  const fileOf = new Map(g.nodes.map((n) => [n.id, n.source_file || ""]));
  // Name each numbered community by the file most of its symbols come from.
  const tally = new Map();
  for (const n of g.nodes) {
    if (!n.source_file) continue;
    const t = tally.get(n.community) || new Map();
    t.set(n.source_file, (t.get(n.source_file) || 0) + 1);
    tally.set(n.community, t);
  }
  const areaName = new Map();
  for (const [c, t] of tally) areaName.set(c, [...t].sort((a, b) => b[1] - a[1])[0][0]);
  let head = "";
  try { head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(); } catch (e) { /* not a checkout */ }
  return { g, fileOf, areaName, head, built: g.built_at_commit || "" };
}

function mapFacts(G, paths) {
  if (!G || !paths || !paths.length) return null;
  const set = new Set(paths);
  const nodes = G.g.nodes.filter((n) => set.has(n.source_file));
  const ids = new Set(nodes.map((n) => n.id));
  const callers = new Map();
  for (const e of G.g.links) {
    if (!ids.has(e.target) || ids.has(e.source)) continue;
    const f = G.fileOf.get(e.source);
    if (f && !set.has(f)) callers.set(f, (callers.get(f) || 0) + 1);
  }
  const areas = [...new Set(nodes.map((n) => G.areaName.get(n.community)).filter(Boolean))];
  return {
    symbols: nodes.length,
    missing: paths.filter((p) => !nodes.some((n) => n.source_file === p)),
    callers: [...callers].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f]) => f),
    areas: areas.filter((a) => !set.has(a)).slice(0, 4),
  };
}

function card(it, G) {
  const m = mapFacts(G, it.paths);
  let map = "";
  if (m) {
    const bits = [`<b>${m.symbols}</b> code symbols in the map`];
    if (m.callers.length) bits.push(`used by ${m.callers.map((f) => `<code>${esc(f)}</code>`).join(", ")}`);
    if (m.areas.length) bits.push(`shares an area with ${m.areas.map((f) => `<code>${esc(f)}</code>`).join(", ")}`);
    if (m.missing.length) bits.push(`not in the map: ${m.missing.map((f) => `<code>${esc(f)}</code>`).join(", ")}`);
    map = `<p class="map"><span class="tag">Map</span> ${bits.join(" · ")}</p>`;
  }
  return `<article class="item s-${esc(it.status)}" id="${esc(it.id)}">
  <div class="row"><span class="pill">${esc(LABEL[it.status] || it.status)}</span><span class="meta">${esc(it.side === "muse" ? "Muse" : "Claude")} · ${esc(it.area)}</span></div>
  <h3>${esc(it.title)}</h3>
  <p>${esc(it.why)}</p>
  ${it.where ? `<p class="where">${esc(it.where)}</p>` : ""}
  ${map}
</article>`;
}

function render(fragment) {
  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  for (const it of data.items) if (!LABEL[it.status]) throw new Error(`board.json: ${it.id} has unknown status "${it.status}"`);
  const G = readGraph();
  const count = (k) => data.items.filter((i) => i.status === k).length;
  const fresh = G && G.head && G.built === G.head;
  const mapLine = !G ? "No Graphify map in this checkout, so the board shows no map facts. Run tools/graphify-session.sh first."
    : `Graphify map: ${G.g.nodes.length.toLocaleString("en-US")} code symbols, ${G.g.links.length.toLocaleString("en-US")} links, built from <code>${esc(G.built.slice(0, 7))}</code>${fresh ? " (current)." : `; this checkout is <code>${esc(G.head.slice(0, 7))}</code>, so map facts may be out of date.`}`;
  const tally = STATES.map(([k, l]) => `<a class="tally s-${k}" href="#g-${k}"><span class="n">${count(k)}</span><span class="l">${l}</span></a>`).join("");
  const groups = STATES.map(([k, l, d]) => {
    const items = data.items.filter((i) => i.status === k);
    if (!items.length) return "";
    return `<section class="group" id="g-${k}"><h2><span class="dot s-${k}"></span>${l} <span class="c">${items.length}</span></h2><p class="gd">${d}</p>
<div class="list">${items.map((i) => card(i, G)).join("\n")}</div></section>`;
  }).join("\n");

  const body = `<title>Archives Standards Board</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=EB+Garamond:wght@400;500&display=swap">
<style>
/* Layout: one column of status groups, worst first; a tally strip on top jumps to each group. */
:root{--bg:#f3ece0;--panel:#fbf7ef;--fg:#2a1f14;--dim:#6c5a42;--line:#d9ccb4;--gold:#8a6424;
--up:#4f7a32;--work:#b0502a;--block:#8a6a12;--park:#6f6f78;--new:#4e6a8c;
--display:"Cinzel",Optima,"Palatino Linotype",Georgia,serif;--body:"EB Garamond",Georgia,"Times New Roman",serif;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#140d07;--panel:#1e150d;--fg:#e6dabf;--dim:#9c8a68;--line:#3a2c1a;--gold:#c79a54;
--up:#8fb36a;--work:#e0875a;--block:#d9b35a;--park:#9a98a2;--new:#86a6cc;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#140d07;--panel:#1e150d;--fg:#e6dabf;--dim:#9c8a68;--line:#3a2c1a;--gold:#c79a54;
--up:#8fb36a;--work:#e0875a;--block:#d9b35a;--park:#9a98a2;--new:#86a6cc;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:17px/1.5 var(--body);padding-block:24px 48px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.wrap{max-width:46rem;margin:0 auto;display:grid;gap:28px}
h1{font:600 clamp(1.5rem,5vw,2.1rem)/1.15 var(--display);letter-spacing:.04em;margin:0;text-wrap:balance}
.lede{margin:.4rem 0 0;color:var(--dim)}
.tallies{display:grid;grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr));gap:8px}
.tally{display:grid;gap:2px;padding:10px 12px;border:1px solid var(--line);border-radius:6px;background:var(--panel);color:var(--fg);text-decoration:none;border-top:4px solid var(--c)}
.tally:focus-visible,.tally:hover{outline:2px solid var(--c);outline-offset:1px}
.tally .n{font:600 1.6rem/1 var(--display);font-variant-numeric:tabular-nums;color:var(--c)}
.tally .l{font-size:.85rem;color:var(--dim)}
.s-up{--c:var(--up)}.s-needs-work{--c:var(--work)}.s-blocked{--c:var(--block)}.s-parked{--c:var(--park)}.s-not-built{--c:var(--new)}
.group h2{font:600 1.1rem/1.2 var(--display);letter-spacing:.05em;margin:0;display:flex;align-items:center;gap:10px}
.group .c{color:var(--dim);font-variant-numeric:tabular-nums}
.dot{width:12px;height:12px;border-radius:50%;background:var(--c)}
.gd{margin:4px 0 12px;color:var(--dim);font-size:.95rem}
.list{display:grid;gap:10px}
.item{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--c);border-radius:4px;padding:12px 14px;min-width:0}
.item h3{margin:6px 0 4px;font:500 1.12rem/1.3 var(--body)}
.item p{margin:4px 0}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.pill{font:600 .68rem/1 var(--display);letter-spacing:.08em;text-transform:uppercase;color:var(--c);border:1px solid var(--c);border-radius:999px;padding:4px 8px}
.meta{font-size:.85rem;color:var(--dim)}
.where{font:.8rem/1.4 var(--mono);color:var(--dim);overflow-wrap:anywhere}
.map{font-size:.88rem;color:var(--dim);overflow-wrap:anywhere}
.tag{font:600 .65rem/1 var(--display);letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-right:4px}
code{font:.8em var(--mono);overflow-wrap:anywhere}
.foot{font-size:.9rem;color:var(--dim);border-top:1px solid var(--line);padding-top:12px}
</style>
<main class="wrap">
<header><h1>Standards Board</h1>
<p class="lede">Every item, Claude side and Muse side, and whether it meets the bar. As of ${esc(data.asOf)}. Worst first.</p></header>
<nav class="tallies" aria-label="Status counts">${tally}</nav>
${groups}
<p class="foot">${mapLine} Statuses come from <code>handoff/standards/board.json</code>; the loop updates it at every checkpoint. Muse-side items can't be checked from the repo, so they stay Blocked until Muse reports.</p>
</main>`;
  return fragment ? body : `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="robots" content="noindex">\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}

const i = process.argv.indexOf("--fragment");
if (i > -1) {
  const out = process.argv[i + 1];
  if (!out) { console.error("usage: build-standards-board.js --fragment <out.html>"); process.exit(1); }
  fs.writeFileSync(out, render(true));
  console.log(`standards board fragment: ${out}`);
} else {
  fs.writeFileSync(OUT, render(false));
  console.log(`standards board: ${path.relative(ROOT, OUT)}`);
}
