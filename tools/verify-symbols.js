#!/usr/bin/env node
/* Checks the museum's symbol walls (plans/museum-visual-pass.md §5):
   - every sign on every wall is outside the signs and scripts held back on sensitivity grounds
     (tools/data/symbols.json, "held"), which only Carter can release;
   - each built atlas (docs/museum/symbols/<wall>.json) matches the data: same sets, same order, same counts,
     so a wall can only show what the data lists, in the order it lists;
   - each atlas image is present and small (phone budget: 150 KB). */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), D = JSON.parse(fs.readFileSync(path.join(__dirname, "data/symbols.json"), "utf8"));
const bad = [];
const held = [];
for (const h of D.held.codepoints) held.push(h.cp ? [parseInt(h.cp, 16), parseInt(h.cp, 16), h.why] : [parseInt(h.range[0], 16), parseInt(h.range[1], 16), h.why]);
for (const b of D.held.blocks) held.push([parseInt(b.range[0], 16), parseInt(b.range[1], 16), b.why]);
let n = 0;
for (const [wall, W] of Object.entries(D.walls)) {
  for (const s of W.sets) {
    if (!s.signs.length) bad.push(`${wall}: set "${s.name}" is empty`);
    const seen = new Set();
    for (const g of s.signs) {
      n++; const cp = parseInt(g.cp, 16);
      if (!Number.isFinite(cp)) { bad.push(`${wall}: bad code point ${g.cp}`); continue; }
      if (seen.has(cp)) bad.push(`${wall}: ${g.cp} twice in "${s.name}"`); seen.add(cp);
      for (const [a, b, why] of held) if (cp >= a && cp <= b) bad.push(`${wall}: U+${g.cp} (${g.id}) is held back: ${why}`);
    }
  }
  const jp = path.join(ROOT, "docs/museum/symbols", wall + ".json"), ip = path.join(ROOT, "docs/museum/symbols", wall + ".webp");
  if (!fs.existsSync(jp) || !fs.existsSync(ip)) { bad.push(`${wall}: atlas missing (run tools/build-symbols.js)`); continue; }
  const A = JSON.parse(fs.readFileSync(jp, "utf8"));
  let start = 0;
  W.sets.forEach((s, i) => {
    const a = A.sets[i];
    if (!a || a.name !== s.name || a.start !== start || a.len !== s.signs.length) bad.push(`${wall}: atlas set ${i} does not match the data (rebuild with tools/build-symbols.js)`);
    start += s.signs.length;
  });
  if (A.sets.length !== W.sets.length) bad.push(`${wall}: atlas has ${A.sets.length} sets, data has ${W.sets.length}`);
  if (A.cols * A.rows < start) bad.push(`${wall}: atlas grid too small`);
  const kb = fs.statSync(ip).size / 1024;
  if (kb > 150) bad.push(`${wall}: atlas is ${kb.toFixed(0)} KB (budget 150 KB)`);
}
if (bad.length) { console.error("verify-symbols: FAIL\n  " + bad.join("\n  ")); process.exit(1); }
console.log(`verify-symbols: ${Object.keys(D.walls).length} wall(s), ${n} signs, none held back; atlases match the data`);
