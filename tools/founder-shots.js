#!/usr/bin/env node
/* ==========================================================================
   founder-shots.js — phone screenshots (390×844) of every section of the site
   for 00-audit/founder-guide.md, plus a short machine check of each page
   (JS errors, horizontal scrolling, what loaded).

   Usage: node tools/founder-shots.js [--base http://localhost:8080] [--out 00-audit/founder-guide]
   Needs Playwright. Google Fonts are blocked here only if FONT_BLOCK=1.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt("--base", "http://localhost:8080").replace(/\/$/, "");
const OUT = opt("--out", path.join(__dirname, "..", "00-audit", "founder-guide"));
const { chromium } = require("playwright");

const GAMES = ["fighter", "chess", "ouroboros", "ziggurat", "reliquary", "seeker", "pong", "minesweeper", "pacman", "pinball", "risk", "treasure"];
const SHOTS = [
  { key: "home", url: "/index.html" },
  { key: "home-explore", url: "/index.html", scrollTo: ".explore" },
  { key: "home-games", url: "/index.html", scrollTo: "#games" },
  { key: "eras", url: "/eras.html" },
  { key: "era-page", url: "/eras/02-bronze-age.html", scrollTo: ".tiles" },
  { key: "traditions", url: "/traditions.html" },
  { key: "themes", url: "/themes.html" },
  { key: "chapter-top", url: "/chapters/ch02.html" },
  { key: "chapter-evidence", url: "/chapters/ch02.html", scrollTo: "#evidence" },
  { key: "chapter-pending", url: "/chapters/ch80.html" },
  { key: "search", url: "/search.html?q=flood", wait: 1500 },
  { key: "compare", url: "/compare.html" },
  { key: "random", url: "/random.html", wait: 1500 },
  { key: "pantheon", url: "/pantheon.html", wait: 1000 },
  { key: "vault", url: "/vault.html" },
  { key: "vault-entry", url: "/vault/shroud-of-turin.html", wait: 2000 },
  { key: "museum", url: "/museum.html", wait: 7000 },
  { key: "symbols", url: "/symbols.html" },
  ...GAMES.map((g) => ({ key: "game-" + g, url: "/symbols.html#play=" + g, wait: 1500 })),
  { key: "methodology", url: "/methodology.html" },
  { key: "about", url: "/about.html" },
  { key: "sitemap", url: "/sitemap.xml" },
  { key: "not-found", url: "/no-such-page" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-proxy-server"] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
  if (process.env.FONT_BLOCK === "1") await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const report = {};
  for (const s of SHOTS) {
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
    page.on("requestfailed", (r) => { if (r.url().startsWith(BASE)) failed.push(r.url().slice(BASE.length)); });
    const resp = await page.goto(BASE + s.url, { waitUntil: "load" }).catch((e) => ({ status: () => "ERR " + e.message }));
    await page.waitForTimeout(s.wait || 600);
    if (s.scrollTo) await page.evaluate((sel) => { const el = document.querySelector(sel); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 8, behavior: "instant" }); }, s.scrollTo);   // the site scrolls smoothly; jump instead
    await page.waitForTimeout(700);
    const info = await page.evaluate(() => ({
      title: document.title, finalUrl: location.pathname + location.search + location.hash,
      hscroll: document.documentElement.scrollWidth > window.innerWidth + 1,
      words: (document.body && document.body.innerText || "").split(/\s+/).filter(Boolean).length,
      pageHeight: document.documentElement.scrollHeight,
    })).catch(() => ({}));
    await page.screenshot({ path: path.join(OUT, s.key + ".jpg"), type: "jpeg", quality: 70 });
    report[s.key] = { url: s.url, status: resp && resp.status ? resp.status() : null, ...info, errors, failed };
    console.log(s.key.padEnd(18), JSON.stringify(report[s.key]).slice(0, 220));
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "_checks.json"), JSON.stringify(report, null, 2));
})().catch((e) => { console.error(e); process.exit(2); });
