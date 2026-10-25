#!/usr/bin/env node
/* CI runtime check for Divine Casualties: load the fighter and PLAY A REAL MATCH TO KO in
   headless Chromium, failing on ANY uncaught page error. This catches runtime
   ReferenceErrors that a static lint might miss and, crucially, exercises the
   end-of-match BANNER + result path (the class of bug where `banner.t -= dt`
   crashed the loop only on KO). Exit 0 only if a KO/result was reached with zero
   page errors; exit 1 otherwise. */
"use strict";
const BASE = process.env.FIGHT_URL || "http://localhost:8099/symbols.html";

/* games-modern §2.3 frame-data test. FRAME_TABLE is the plan's table
   (plans/games-modern.md §2.2) copied by hand, NOT read from the game: each move's
   [startup, first active tick, last active tick, total ticks]. The test fails if
   (1) the move data in fighter-moves.js says anything else, or (2) the game, run
   tick by tick in the browser, opens the move's live window on other ticks or
   ends it after a different total. The balance can change, but only on purpose:
   change the plan's table, this copy and the data together.
   Totals: a normal or command move ends `recovery` ticks after its last active tick;
   a projectile special ends `recovery` ticks after its cast; the house of Hades ends
   20 ticks after its cast, while its darkness field runs ticks 24-204 (FIELD).
   Phalanx step has no hit (null window); it can cancel into a normal on ticks 4-8. */
const FRAME_TABLE = {
  zeus: {
    light: [4, 4, 6, 16], kick: [12, 12, 15, 28], headbutt: [6, 6, 8, 20], aerialPunch: [6, 6, 12, 25], aerialDive: [9, 9, 20, 36],
    special: [23, 23, 23, 54], fspecial: [14, 14, 22, 40], bspecial: [9, 9, 15, 35], super: [30, 30, 60, 84], grab: [5, 5, 6, 26],
  },
  poseidon: {
    light: [6, 6, 8, 20], kick: [14, 14, 18, 32], headbutt: [7, 7, 9, 22], aerialPunch: [8, 8, 13, 27], aerialDive: [10, 10, 22, 40],
    special: [26, 26, 26, 56], fspecial: [12, 12, 20, 42], bspecial: [16, 16, 20, 42], super: [28, 28, 70, 96], grab: [6, 6, 7, 29],
  },
  athena: {
    light: [3, 3, 5, 13], kick: [10, 10, 12, 24], headbutt: [5, 5, 7, 18], aerialPunch: [5, 5, 11, 22], aerialDive: [8, 8, 18, 32],
    special: [20, 20, 20, 46], fspecial: [4, null, null, 12], bspecial: [2, 2, 7, 25], super: [18, 18, 60, 82], grab: [4, 4, 5, 23],
  },
  hades: {
    light: [5, 5, 7, 18], kick: [14, 14, 17, 32], headbutt: [7, 7, 9, 22], aerialPunch: [7, 7, 12, 25], aerialDive: [11, 11, 24, 44],
    special: [24, 24, 24, 56], fspecial: [8, 8, 10, 40], bspecial: [2, 2, 12, 26], super: [24, 24, 24 + 19, 44], grab: [6, 6, 7, 27],
  },
};
const FIELD = { hades: { super: [24, 204] } };       // the darkness of the house of Hades
const EXTRA = {                                      // other windows the plan's notes give in ticks
  poseidon: { fspecial: { armor: [6, 14] } },
  athena: { fspecial: { cancelWindow: [4, 8] } },
  hades: { bspecial: { invuln: [2, 12] } },
};
// the house of Hades: its own active ticks in the data are the field's [24, 204]; the move
// itself is live from its cast until it ends, which the probe sees as 24..43
const DATA_ACTIVE = { hades: { super: [24, 204] } };

function staticFrameCheck() {
  const fs = require("fs"), vm = require("vm"), path = require("path");
  const cx = { window: {}, console }; vm.createContext(cx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "docs/assets/games/fighter-moves.js"), "utf8"), cx);
  const R = cx.window.FIGHTER_RESOLVE, errs = [];
  let n = 0;
  for (const [g, moves] of Object.entries(FRAME_TABLE)) for (const [id, [su, a0, a1, tot]] of Object.entries(moves)) {
    const m = R(g, id); n++;
    if (!m) { errs.push(`${g}.${id}: missing`); continue; }
    const act = (DATA_ACTIVE[g] || {})[id] || (a0 == null ? null : [a0, a1]);
    if (m.startup !== su) errs.push(`${g}.${id}: startup ${m.startup}, table ${su}`);
    if (JSON.stringify(m.active || null) !== JSON.stringify(act)) errs.push(`${g}.${id}: active ${JSON.stringify(m.active)}, table ${JSON.stringify(act)}`);
    if (m.total !== tot) errs.push(`${g}.${id}: total ${m.total}, table ${tot}`);
    const castBased = m.kind === "projectile" || m.kind === "darkness";
    const ends = castBased ? m.cast + m.recovery : (m.active ? m.active[1] : m.startup) + m.recovery;
    if (m.total !== ends) errs.push(`${g}.${id}: total ${m.total} does not equal its ${castBased ? "cast" : "last active tick"} + recovery (${ends})`);
    for (const [k, w] of Object.entries(((EXTRA[g] || {})[id]) || {})) if (JSON.stringify(m[k]) !== JSON.stringify(w)) errs.push(`${g}.${id}: ${k} ${JSON.stringify(m[k])}, table ${JSON.stringify(w)}`);
  }
  return { n, errs };
}
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

  // ---- frame data: the move data against the plan's table, then the running game against it ----
  const sf = staticFrameCheck();
  if (sf.errs.length) fail("frame data differs from the plan's table:\n  " + sf.errs.join("\n  "));
  const probeErrs = [];
  for (const [g, moves] of Object.entries(FRAME_TABLE)) for (const [id, [, a0, a1, tot]] of Object.entries(moves)) {
    const r = await page.evaluate(([g, id]) => window.__frameProbe(g, id), [g, id]);
    if (!r || !r.started) { probeErrs.push(`${g}.${id}: did not start`); continue; }
    if (r.first !== a0 || r.last !== a1 || r.total !== tot) probeErrs.push(`${g}.${id}: game ran live ${r.first}-${r.last}, total ${r.total}; table ${a0}-${a1}, total ${tot}`);
    const fw = (FIELD[g] || {})[id];
    if (fw && JSON.stringify(r.field) !== JSON.stringify(fw)) probeErrs.push(`${g}.${id}: field ${JSON.stringify(r.field)}, table ${JSON.stringify(fw)}`);
  }
  if (probeErrs.length) fail("the running game does not match the frame-data table:\n  " + probeErrs.join("\n  "));
  if (pageErrors.length) fail("page error during the frame-data probe");
  console.log(`OK: frame data — ${sf.n} moves match the plan's table in the data and in the running game (startup, active, total)`);

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
