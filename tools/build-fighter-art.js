#!/usr/bin/env node
/* ==========================================================================
   build-fighter-art.js — make the fighter's web art from the full-size originals.

   Divine Casualties draws each god from cut-out body parts. The originals
   (art-source/fighter/parts/<god>/*.png, plus the select-screen sheet
   art-source/fighter/heroes.jpg) were downloaded as-is: 5.5 MB of parts and a
   0.47 MB sheet. Measured during a match, the parts are drawn at no more than
   0.47x their own resolution even on a 1440px high-density laptop (0.20x on a
   phone), so this tool writes them at HALF size as WebP (quality 85, alpha
   kept) to docs/assets/games/art/parts/<god>/, and the sheet at 60% as WebP.
   The manifests keep the ORIGINAL sizes and pivots: fighter.js draws each part
   at its manifest size, so the rig is unchanged.

   Usage: node tools/build-fighter-art.js      (needs Playwright; no network)
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "art-source", "fighter");
const OUT = path.join(ROOT, "docs", "assets", "games", "art");
const PART_SCALE = 0.5, PART_Q = 0.85, SHEET_SCALE = 0.6, SHEET_Q = 0.82;

async function encode(page, file, scale, quality, mime) {
  const b64 = fs.readFileSync(file).toString("base64");
  const out = await page.evaluate(async ({ b64, mime, scale, quality }) => {
    const im = new Image(); im.src = `data:${mime};base64,${b64}`; await im.decode();
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(im.width * scale)); c.height = Math.max(1, Math.round(im.height * scale));
    const g = c.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(im, 0, 0, c.width, c.height);
    const url = c.toDataURL("image/webp", quality);
    if (!url.startsWith("data:image/webp")) throw new Error("this browser cannot encode WebP");
    return { data: url.split(",")[1], w: c.width, h: c.height };
  }, { b64, mime, scale, quality });
  return { buf: Buffer.from(out.data, "base64"), w: out.w, h: out.h };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const page = await browser.newPage();
  let before = 0, after = 0;
  for (const god of fs.readdirSync(path.join(SRC, "parts")).sort()) {
    const manPath = path.join(OUT, "parts", god, "manifest.json");
    const man = JSON.parse(fs.readFileSync(manPath, "utf8"));
    for (const name of Object.keys(man)) {
      const src = path.join(SRC, "parts", god, name + ".png");
      const r = await encode(page, src, PART_SCALE, PART_Q, "image/png");
      fs.writeFileSync(path.join(OUT, "parts", god, name + ".webp"), r.buf);
      before += fs.statSync(src).size; after += r.buf.length;
    }
    console.log(`${god}: ${Object.keys(man).length} parts`);
  }
  const sheet = await encode(page, path.join(SRC, "heroes.jpg"), SHEET_SCALE, SHEET_Q, "image/jpeg");
  fs.writeFileSync(path.join(OUT, "heroes.webp"), sheet.buf);
  const sb = fs.statSync(path.join(SRC, "heroes.jpg")).size;
  console.log(`parts: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB; sheet: ${Math.round(sb / 1024)} KB -> ${Math.round(sheet.buf.length / 1024)} KB (${sheet.w}x${sheet.h})`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
