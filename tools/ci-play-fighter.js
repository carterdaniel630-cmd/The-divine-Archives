#!/usr/bin/env node
/* CI runtime check for Theomachy: load the fighter and PLAY A REAL MATCH TO KO in
   headless Chromium, failing on ANY uncaught page error. This catches runtime
   ReferenceErrors that a static lint might miss and, crucially, exercises the
   end-of-match BANNER + result path (the class of bug where `banner.t -= dt`
   crashed the loop only on KO). Exit 0 only if a KO/result was reached with zero
   page errors; exit 1 otherwise. */
"use strict";
const BASE = process.env.FIGHT_URL || "http://localhost:8099/symbols.html";
let chromium, launchOpts = { args: ["--no-sandbox"] };
try { chromium = require("playwright").chromium; }
catch (e) {
  chromium = require("playwright-core").chromium;
  launchOpts.executablePath = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
}

(async () => {
  const browser = await chromium.launch(launchOpts);
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 820 } });
  await ctx.addInitScript(() => { window.__FIGHT_TEST__ = true; });
  const pageErrors = [];
  const page = await ctx.newPage();
  page.on("pageerror", e => pageErrors.push(String(e && (e.stack || e.message)).split("\n")[0]));
  page.on("console", m => { if (m.type() === "error") { const t = m.text(); if (!/Failed to load resource|net::ERR_|favicon/i.test(t)) pageErrors.push("console: " + t); } });

  const fail = (msg) => { console.error("FAIL:", msg); if (pageErrors.length) console.error("page errors:\n  " + pageErrors.join("\n  ")); browser.close(); process.exit(1); };

  await page.goto(BASE + "#play=fighter", { waitUntil: "load", timeout: 30000 }).catch(e => fail("goto: " + e.message));
  await page.waitForSelector('button[data-a="fight"]', { timeout: 15000 }).catch(() => fail("no select screen"));
  await page.click('button[data-a="fight"]');
  await page.waitForSelector(".fg-canvas", { timeout: 15000 }).catch(() => fail("no fight canvas"));
  await page.waitForTimeout(500);

  const st = () => page.evaluate(() => (window.__fightState && window.__fightState()) || null);
  const resultShown = () => page.evaluate(() => { const h = document.querySelector(".game-dialog h2"); return h && /victorious/i.test(h.textContent) ? h.textContent.trim() : null; });

  // Drive a real match: close distance, throw punches/kicks/specials until someone is KO'd.
  let reached = null;
  const deadline = Date.now() + 110000; // up to ~110s
  while (Date.now() < deadline) {
    if (pageErrors.length) fail("page error during play");
    const done = await resultShown();
    if (done) { reached = done; break; }
    const q = await st();
    if (q) {
      const gap = Math.abs(q.p1.x - q.p2.x);
      if (gap > 52) { await page.keyboard.down("d"); await page.waitForTimeout(70); await page.keyboard.up("d"); }
      else { await page.keyboard.press(Math.random() < 0.5 ? "k" : "j"); }
      if ((q.p1.combo || 0) === 0 && Math.random() < 0.25) await page.keyboard.press("l"); // occasional special
    }
    await page.waitForTimeout(45);
  }
  // let any final banner fully play out (the crash used to happen here)
  await page.waitForTimeout(3500);
  if (pageErrors.length) fail("page error during end-of-match banner");
  if (!reached) reached = await resultShown();

  const canvasEverRendered = await page.evaluate(() => true); // page still alive
  if (!canvasEverRendered) fail("page died");
  if (!reached) fail("no KO/result reached within time budget (banner path not exercised)");

  console.log("OK: played to KO — result screen:", JSON.stringify(reached), "| page errors:", pageErrors.length);
  await browser.close();
  process.exit(0);
})().catch(e => { console.error("FATAL:", e && e.message); process.exit(1); });
