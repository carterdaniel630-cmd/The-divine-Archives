#!/usr/bin/env node
/* ==========================================================================
   build-risk-grid.js — precompute the Risk game's territory grid.

   Dominion of the Ancients assigns every cell of its map to a province through
   noisy borders (risk.js, computeGrid). That takes about 0.4 s on a laptop and
   over a second on a phone, every time the game opens, and the answer never
   changes. This tool runs the game's own code once in a headless browser,
   reads the finished grid, and saves it as docs/assets/games/data/risk-grid.png
   (red channel = (province index + 2) × 8; -1 sea, -2 unclaimed land).
   The game reads that image instead, and computes the grid itself if the image
   is missing or no longer matches the provinces.

   Re-run after changing the provinces (TERR), seas (SEAS) or border weights in risk.js:
     node tools/serve.js 8080 &   then   node tools/build-risk-grid.js [--base http://localhost:8080]
   Needs Playwright.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt("--base", "http://localhost:8080").replace(/\/$/, "");
const OUT = path.join(__dirname, "..", "docs", "assets", "games", "data", "risk-grid.png");
const { chromium } = require("playwright");

async function grab(page, fresh) {
  await page.addInitScript((f) => { window.__ARCHIVE_TEST__ = true; if (f) window.__RISK_GRID_FRESH = true; }, fresh);
  await page.goto(BASE + "/symbols.html#play=risk", { waitUntil: "load" });
  await page.waitForFunction(() => window.__riskGrid && window.__riskGrid(), null, { timeout: 30000 });
  return page.evaluate(() => window.__riskGrid());
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--no-proxy-server"] });
  const ctx = await browser.newContext();
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

  // 1) compute the grid with the game's own code
  const page = await ctx.newPage();
  const g = await grab(page, true);
  if (g.fromFile) throw new Error("expected a freshly computed grid");
  const png = await page.evaluate(({ w, h, data }) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const m = c.getContext("2d"), im = m.createImageData(w, h);
    for (let i = 0; i < data.length; i++) { const o = i * 4; im.data[o] = (data[i] + 2) * 8; im.data[o + 1] = 0; im.data[o + 2] = 0; im.data[o + 3] = 255; }
    m.putImageData(im, 0, 0);
    return c.toDataURL("image/png").split(",")[1];
  }, g);
  fs.writeFileSync(OUT, Buffer.from(png, "base64"));
  console.log(`wrote ${path.relative(process.cwd(), OUT)}: ${g.w}×${g.h}, ${Math.round(fs.statSync(OUT).size / 1024)} KB`);

  // 2) check: a fresh page must now read the image and get exactly the same grid
  const page2 = await ctx.newPage();
  const g2 = await grab(page2, false);
  let diff = 0; for (let i = 0; i < g.data.length; i++) if (g.data[i] !== g2.data[i]) diff++;
  console.log(`read back from the image: ${g2.fromFile ? "yes" : "NO (fell back to computing)"}; cells that differ: ${diff}`);
  await browser.close();
  if (!g2.fromFile || diff) process.exit(1);
})().catch((e) => { console.error(e); process.exit(2); });
