#!/usr/bin/env node
// Gives graphify's communities plain-word names, so the map reads "Arcade · chess" instead of
// "Community 13". Run after `graphify cluster-only . --no-label` (see .github/workflows/graphify.yml).
//
// No AI runs here: each community is named from the files its members come from, by a fixed rule
// (the folder says which part of the site it is, the file says which piece). The same graph always
// gets the same names. Two communities that come out the same are numbered "(2)", "(3)", largest first.
//
// Rewrites, in place: graphify-out/graph.json (community_name on every node),
// graphify-out/graph.html (node data and the legend) and graphify-out/GRAPH_REPORT.md (headings and
// the hub list). Usage: node tools/graphify-label.js [graphify-out]
'use strict';
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || 'graphify-out';
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(dir, f), s);

const words = (s) => s.replace(/(\.[a-z]+)+$/i, '').replace(/[-_]+/g, ' ').trim();
const SMALL = new Set(['a', 'an', 'and', 'at', 'in', 'of', 'on', 'the', 'to']);
const title = (s) => words(s).split(' ').map((w, i) => (i && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');

// Which part of the project a file belongs to, in plain words.
function area(file) {
  const p = file.split('/');
  const base = p[p.length - 1];
  const stem = words(base);
  if (file === 'docs/museum/manifest.json') return 'Museum catalogue';
  if (p[0] === 'docs' && p[1] === 'museum') return `Museum · ${stem}`;
  if (p[0] === 'docs' && p[1] === 'pilgrimage' && p[2] === 'sites' && p[3]) return `Pilgrimage · ${title(p[3])}`;
  if (p[0] === 'docs' && p[1] === 'pilgrimage') return stem === 'engine' ? 'Pilgrimage engine' : `Pilgrimage engine · ${stem}`;
  if (p[0] === 'docs' && p[1] === 'assets' && p[2] === 'games' && p[3] === 'art' && p[4]) return `Arcade art · ${words(p[4])}`;
  if (p[0] === 'docs' && p[1] === 'assets' && p[2] === 'games') return `Arcade · ${stem}`;
  if (p[0] === 'docs' && p[1] === 'assets' && p[2] === 'vault') return `Vault · ${stem}`;
  if (p[0] === 'docs') return `Site · ${stem}`;
  if (p[0] === 'tools' && /^(verify|check|review|ci)-/.test(base)) return `Checks · ${stem}`;
  if (p[0] === 'tools' && /^build-/.test(base)) return `Build · ${stem.replace(/^build /, '')}`;
  if (p[0] === 'tools') return `Tools · ${stem}`;
  if (p[0] === 'framework' && p[1] === 'test') return `Framework tests · ${stem.replace(/ test$/, '')}`;
  if (p[0] === 'framework') return `Framework · ${stem}`;
  if (p[0] === 'functions') return `Server · ${stem}`;
  if (p[0] === 'mini-games') return `Mini-games · ${stem}`;
  return `${title(p[0])} · ${stem}`;
}

const graph = JSON.parse(read('graph.json'));
const members = new Map(); // community id -> Map(area -> count)
for (const n of graph.nodes) {
  if (n.community === undefined || n.community === null) continue;
  if (!members.has(n.community)) members.set(n.community, new Map());
  const a = n.source_file ? area(n.source_file) : null;
  if (a) members.get(n.community).set(a, (members.get(n.community).get(a) || 0) + 1);
}

const size = (c) => [...members.get(c).values()].reduce((s, v) => s + v, 0);
const ids = [...members.keys()].sort((a, b) => size(b) - size(a) || a - b);
const names = new Map();
const used = new Map();
for (const c of ids) {
  const ranked = [...members.get(c).entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  let name = ranked.length ? ranked[0][0] : 'Unfiled pieces';
  const total = size(c);
  // A second part that holds at least a quarter of the members is named too.
  if (ranked[1] && ranked[1][1] * 4 >= total) name += ` + ${ranked[1][0].split(' · ').pop()}`;
  const k = (used.get(name) || 0) + 1;
  used.set(name, k);
  names.set(c, k > 1 ? `${name} (${k})` : name);
}

// graph.json
for (const n of graph.nodes) if (names.has(n.community)) n.community_name = names.get(n.community);
write('graph.json', JSON.stringify(graph, null, 2) + '\n');

const esc = (s) => JSON.stringify(s).slice(1, -1);

// graph.html: node data, then the legend entries.
let html = read('graph.html');
html = html.replace(/("community_name": )"Community (\d+)"/g, (m, pre, id) => (names.has(+id) ? `${pre}"${esc(names.get(+id))}"` : m));
html = html.replace(/("label": )"Community (\d+)"/g, (m, pre, id) => (names.has(+id) ? `${pre}"${esc(names.get(+id))}"` : m));
write('graph.html', html);

// GRAPH_REPORT.md: headings and hub list keep the number, so older references still match.
let md = read('GRAPH_REPORT.md');
md = md.replace(/^(### Community (\d+) - )"Community \d+"/gm, (m, pre, id) => (names.has(+id) ? `${pre}"${names.get(+id)}"` : m));
md = md.replace(/^- Community (\d+)$/gm, (m, id) => (names.has(+id) ? `- Community ${id}: ${names.get(+id)}` : m));
md = md.replace(/`Community (\d+)`/g, (m, id) => (names.has(+id) ? `\`${names.get(+id)}\`` : m));
write('GRAPH_REPORT.md', md);

const left = (html.match(/"Community \d+"/g) || []).length;
console.log(`graphify-label: named ${names.size} communities; ${left} unnamed left in graph.html`);
if (left) process.exitCode = 1;
