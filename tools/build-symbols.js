#!/usr/bin/env node
/* Draws each symbol wall's signs into one small atlas for the museum (plans/museum-visual-pass.md §5).

   Reads tools/data/symbols.json; writes docs/museum/symbols/<wall>.webp (white signs on transparent, in a
   grid) and <wall>.json (the grid and where each set starts). The fonts (SIL Open Font License) are used here
   only: visitors download the atlas, never the fonts. Needs Playwright (Chromium).
   Run tools/verify-symbols.js afterwards (it also runs in CI). */
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, ".."), DATA = JSON.parse(fs.readFileSync(path.join(__dirname, "data/symbols.json"), "utf8"));
const CELL = 96, OUT = path.join(ROOT, "docs/museum/symbols");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const fonts = Object.fromEntries(Object.entries(DATA.fonts).map(([k, f]) => [k, "data:font/woff2;base64," + fs.readFileSync(path.join(ROOT, f)).toString("base64")]));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent("<!doctype html><canvas id=c></canvas>");
  for (const [wall, W] of Object.entries(DATA.walls)) {
    const cells = []; const sets = [];
    for (const s of W.sets) { sets.push({ name: s.name, font: s.font, start: cells.length, len: s.signs.length }); for (const g of s.signs) cells.push({ font: s.font, ch: String.fromCodePoint(parseInt(g.cp, 16)) }); }
    const cols = Math.ceil(Math.sqrt(cells.length)), rows = Math.ceil(cells.length / cols);
    const res = await page.evaluate(async ({ fonts, cells, cols, rows, CELL }) => {
      for (const [k, url] of Object.entries(fonts)) { const f = new FontFace("S_" + k, `url(${url})`); await f.load(); document.fonts.add(f); }
      const c = document.getElementById("c"); c.width = cols * CELL; c.height = rows * CELL;
      const g = c.getContext("2d"); g.clearRect(0, 0, c.width, c.height); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
      const missing = [];
      cells.forEach((cell, i) => {
        const x = (i % cols) * CELL + CELL / 2, y = Math.floor(i / cols) * CELL + CELL / 2;
        let size = CELL * 0.74; g.font = `${size}px "S_${cell.font}"`;
        const m = g.measureText(cell.ch); const w = m.width, h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        if (!w || !h) { missing.push(i); return; }
        const k = Math.min(1, (CELL * 0.82) / Math.max(w, h)); size *= k; g.font = `${size}px "S_${cell.font}"`;
        const m2 = g.measureText(cell.ch), dy = (m2.actualBoundingBoxAscent - m2.actualBoundingBoxDescent) / 2;
        g.textBaseline = "alphabetic"; g.fillText(cell.ch, x, y + dy);
        g.strokeStyle = "#fff"; g.lineWidth = CELL * 0.022; g.lineJoin = "round"; g.strokeText(cell.ch, x, y + dy);   // a little weight, so thin signs read at a distance
      });
      return { url: c.toDataURL("image/webp", 0.9), missing };
    }, { fonts, cells, cols, rows, CELL });
    if (res.missing.length) throw new Error(wall + ": no glyph drawn for cells " + res.missing.join(", "));
    const png = Buffer.from(res.url.split(",")[1], "base64");
    fs.writeFileSync(path.join(OUT, wall + ".webp"), png);
    fs.writeFileSync(path.join(OUT, wall + ".json"), JSON.stringify({ wall, label: W.label, cell: CELL, cols, rows, sets: sets.map((s) => ({ name: s.name, start: s.start, len: s.len })) }, null, 1) + "\n");
    console.log(`build-symbols: ${wall}: ${cells.length} signs in ${cols}×${rows}, ${(png.length / 1024).toFixed(1)} KB`);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
