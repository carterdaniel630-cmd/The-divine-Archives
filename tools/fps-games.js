#!/usr/bin/env node
/* ==========================================================================
   fps-games.js — frame rate of each game under a slowed CPU.

   Opens symbols.html?fps=1#play=<game> on a 390×844 touch phone viewport,
   slows the CPU (default 4×, Lighthouse's stand-in for a mid-range phone),
   starts the game, plays it with simple inputs for --seconds, and reads the
   hidden overlay's numbers (docs/assets/fps-overlay.js): average FPS, worst
   one-second window, longest single frame.

   Usage: node tools/fps-games.js [--base http://localhost:8080] [--cpu 4] [--seconds 10] [--out fps.json]
                                  [--only fighter,pong] [--shots <folder>]
   Needs Playwright (CHROME_PATH optional). Numbers come from a headless browser
   drawing in software, so read them as relative, not as a real phone's.
   ========================================================================== */
"use strict";
const fs = require("fs");
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt("--base", "http://localhost:8080").replace(/\/$/, "");
const CPU = parseFloat(opt("--cpu", "4"));
const SECONDS = parseFloat(opt("--seconds", "10"));
const OUT = opt("--out", "fps.json");
const SHOTS = opt("--shots", null);               // folder: save a screenshot of each game at the end of its run
const { chromium } = require("playwright");

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
// how to get each game moving, and what to keep doing while measuring
const ONLY = opt("--only", null);
const GAMES = {
  fighter:     { start: /to the arena/i, keys: ["d", "a", "j", "k", "l", "w"], every: 180 },
  chess:       { start: /set the board/i, keys: [], every: 1000 },
  ouroboros:   { keys: ARROWS, every: 350 },
  ziggurat:    { keys: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"], every: 250 },
  reliquary:   { start: /^begin$/i, keys: [], every: 1000 },
  seeker:      { start: /begin the path/i, keys: [], every: 1000 },
  pong:        { keys: ["ArrowUp", "ArrowDown"], every: 200 },
  minesweeper: { tapCells: true, keys: [], every: 1000 },
  pacman:      { keys: ARROWS, every: 300 },
  pinball:     { start: /launch/i, keys: ["ArrowLeft", "ArrowRight", " "], every: 220 },
  risk:        { tapCanvas: true, keys: [], every: 1000 },
  treasure:    { start: /begin the expedition/i, then: /^enter /i, keys: ["ArrowRight", "ArrowLeft", "ArrowUp", " "], every: 220 },
};

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-proxy-server"] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36" });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const out = {};
  for (const [id, g] of Object.entries(GAMES).filter(([k]) => !ONLY || ONLY.split(",").includes(k))) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
    await page.goto(`${BASE}/symbols.html?fps=1#play=${id}`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    const click = async (re) => { const b = page.locator(".game-dialog button:visible").filter({ hasText: re }).first(); if (await b.count()) { await b.click({ timeout: 3000 }).catch(() => {}); return true; } return false; };
    if (g.start) await click(g.start);
    if (g.then) { await page.waitForTimeout(800); await click(g.then); }          // a second screen, e.g. the Tomb Robber's "Enter Egypt"
    await page.waitForTimeout(1000);
    const box = async () => (await page.locator(".game-dialog canvas:visible").first().boundingBox().catch(() => null));
    await page.evaluate(() => window.__fpsReset && window.__fpsReset());
    const t0 = Date.now();
    while (Date.now() - t0 < SECONDS * 1000) {
      if (g.keys.length) await page.keyboard.press(rnd(g.keys)).catch(() => {});
      if (g.tapCells) { const cells = page.locator(".game-dialog button:visible").filter({ hasText: /^$/ }); const n = await cells.count(); if (n) await cells.nth(Math.floor(Math.random() * n)).tap().catch(() => {}); }
      if (g.tapCanvas) { const b = await box(); if (b) await page.touchscreen.tap(b.x + Math.random() * b.width, b.y + Math.random() * b.height).catch(() => {}); }
      await page.waitForTimeout(g.every);
    }
    const f = await page.evaluate(() => window.__fps || null);             // read first: a screenshot stalls the page
    if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: `${SHOTS}/fps-${id}.jpg`, type: "jpeg", quality: 60 }).catch(() => {}); }
    out[id] = f ? { avg: +f.avg.toFixed(1), min: f.min == null ? null : +f.min.toFixed(1), worstFrameMs: Math.round(f.worstFrameMs), seconds: +f.seconds.toFixed(1), errors } : { error: "overlay not found", errors };
    console.log(id.padEnd(12), JSON.stringify(out[id]));
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify({ date: new Date().toISOString(), cpuSlowdown: CPU, seconds: SECONDS, results: out }, null, 2));
})().catch((e) => { console.error(e); process.exit(2); });
