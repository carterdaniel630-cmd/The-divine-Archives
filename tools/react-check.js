// usage: node tools/react-check.js [docs]   (needs Playwright; headless, SwiftShader; not a verify-*.js, so the
// facts workflow, which has no browser, does not run it)
// "React to you" (Carter 2026-11-16, handoff/decisions-2026-11-16-carter-ground-at-your-feet.md), checked in the flat
// museum, which is the same build the headset draws. In each VR pilot ground (ch02 Egypt, ch03 Mesopotamia, the Bronze
// Age corridor), with the visitor set down next to a creature and standing still:
//  1. no land animal or wader inside SHY_R ever closes the distance to the visitor (it only moves away);
//  2. after SETTLE seconds no land animal or wader is within 2 m of the visitor (Comfort §e.22), unless it is
//     cornered (nowhere further away it can stand: water, a wall or the room's edge), when it stands still facing
//     away (reported in the notes, not hidden);
//  3. no fish inside FISH_R swims in toward the visitor; no leap starts within LEAP_R, and a leap already in the air
//     when the visitor arrives (a teleport) only bends away from them;
//  4. the plants know where the visitor is (uMe x, z) and lean fully once the teleport fade is over (strength 1);
//  5. walking through the water leaves rings: each step past RIPPLE_STEP starts a fresh ring at the visitor's feet,
//     in the visitor's own slots (4 and 5), so fish and herons keep theirs (0 to 3);
//  6. a room outside the pilot (ch05) does not react: the visitor is not "on" its ground and the plants' lean is 0;
//  7. birds and insects in the air (ch02's kingfishers and butterflies, ch03's kingfishers and dragonflies; "More
//     creatures"): none inside AIR_R of the visitor (on the ground plan, any height) ever comes closer, and after
//     SETTLE s none is within CLOSE; and each pilot room has the creatures its ENV lists (by kind: land, fish, air);
//  8. 0 script errors at 960, 390 and 360 px.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", PORT = 8794;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });

const PILOT = [["ch02", "ch02"], ["ch03", "ch03"], ["cor:02-bronze-age", "@02-bronze-age"]];
const TRIALS = 4, AIR_R = 4, SHY_R = 2.5, CLOSE = 2, FISH_R = 1.6, LEAP_R = 3, SETTLE = 9, TOL = 0.012, RIPPLE_STEP = 0.42;
// what each pilot room must hold, by kind (world.js ENV; sources/museum-fauna-pilot.md)
const HOLDS = { ch02: { land: 4, fish: 1, air: 2 }, ch03: { land: 1, fish: 1, air: 2 } };
const fails = [], notes = [];
const check = (ok, what) => { console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails.push(what); };

(async () => {
  await new Promise((r) => srv.listen(PORT, r));
  let b = null;
  // one fresh page per room: SwiftShader runs out of memory holding two pilot rooms at 960 px (as in ground-check.js)
  const RUNS = PILOT.map((r) => [960, r]).concat([[960, ["ch05", "ch05"]], [390, PILOT[0]], [360, PILOT[0]]]);
  for (const [w, [id, target]] of RUNS) {
    console.log(`\n${id} at ${w} px`);
    if (b) await b.close(); b = await chromium.launch();   // a fresh browser per room: SwiftShader's memory is not handed back between pages
    const page = await b.newPage({ viewport: { width: w, height: w > 800 ? 600 : 800 } });
    const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
    await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e) e.click(); });
    if (id === "ch05") {
      await page.evaluate(() => window.__MU.teleport("ch05"));
      await page.waitForFunction(() => !!window.__MU.react("ch05"), null, { timeout: 120000 }).catch(() => {});
      const r = await page.evaluate(() => { const q = window.__MU.reactSim("ch05", 0.5, 0.5); return q[q.length - 1]; });
      check(!!r && !r.feet && !r.me.on && r.plantsMe[2] === 0, `ch05 (outside the pilot): does not react (on ${r && r.me.on}, lean ${r && r.plantsMe[2]})`);
    } else {
      await page.evaluate((t) => window.__MU.teleport(t), target);
      await page.waitForFunction((i) => !!window.__MU.react(i), id, { timeout: 60000 }).catch(() => {});
      const r0 = await page.evaluate((i) => window.__MU.react(i), id);
      if (!r0) { check(false, `${id}: its ground was built`); await page.close(); continue; }
      check(r0.feet, `${id}: a ground at your feet`);
      if (HOLDS[id] && w > 800) { const kinds = (k) => r0.fauna.filter((f) => k === "air" ? f.air : k === "fish" ? f.fish && !f.air : !f.fish && !f.air).length, H = HOLDS[id];
        const got = { land: kinds("land"), fish: kinds("fish"), air: kinds("air") };
        check(got.land >= H.land && got.fish >= H.fish && got.air >= H.air, `${id}: holds its creatures (land ${got.land} ≥ ${H.land} walkers, fish ${got.fish}, air ${got.air}; groups of each listed kind present)`);
        const B0 = r0.bounds, overGround = r0.fauna.filter((f) => f.air).every((f) => f.y > -0.1 && f.y < 1.6);
        check(overGround, `${id}: the birds and insects fly over the raised ground, below eye height (y ${r0.fauna.filter((f) => f.air).map((f) => f.y.toFixed(2)).join(", ")})`); }
      // set the visitor down 1.2 m from each land creature in turn (up to TRIALS; with none, from fish), inside the room,
      // and run the world for SETTLE s of world time while they stand still, sampling every 0.1 s. reactSim steps the
      // same world.update the frame loop calls, without drawing: SwiftShader draws a pilot room at < 1 fps.
      const B = r0.bounds, inB = (x, z) => x > B.x0 + 0.3 && x < B.x1 - 0.3 && z > B.z0 + 0.3 && z < B.z1 - 0.3;
      const land = r0.fauna.filter((f) => !f.fish && !f.air), airs = r0.fauna.filter((f) => f.air), nTrials = TRIALS + (airs.length ? 2 : 0);   // two more beside a bird or insect   // cycles through the creatures when there are fewer than TRIALS
      let airIn = [], airClose = 0, closer = [], fishIn = [], leaps = [], tooCloseN = 0, corneredN = 0, nearN = 0, knows = true, nearest = 99, seqL = null, trials = 0;
      for (let tr = 0; tr < nTrials; tr++) {
        const now = await page.evaluate((i) => window.__MU.react(i), id), pool = tr >= TRIALS ? now.fauna.filter((f) => f.air) : land.length ? now.fauna.filter((f) => !f.fish && !f.air) : now.fauna.filter((f) => f.fish && !f.air);
        const f = pool[tr % pool.length]; if (!f) break;
        let spot = null; for (let a = 0; a < 6.28 && !spot; a += 0.5) { const x = f.x + Math.sin(a) * 1.2, z = f.z + Math.cos(a) * 1.2; if (inB(x, z)) spot = [x, z]; }
        if (!spot) continue;
        const seq = await page.evaluate(([i, x, z, n]) => { window.__MU.place(x, z, 0, -0.4); return window.__MU.reactSim(i, n, 0.1); }, [id, spot[0], spot[1], SETTLE]);
        trials++; seqL = seq;
        const me = { x: spot[0], z: spot[1] }, dist = (f) => Math.hypot(f.x - me.x, f.z - me.z);
        knows = knows && seq.every((s) => s.me.on && Math.abs(s.me.x - me.x) < 1e-6 && Math.abs(s.me.z - me.z) < 1e-6);
        for (let k = 1; k < seq.length; k++) {
          const A = seq[k - 1].fauna, Bf = seq[k].fauna; if (A.length !== Bf.length) continue;
          for (let j = 0; j < A.length; j++) {
            const d0 = dist(A[j]), d1 = dist(Bf[j]);
            if (A[j].air) { if (d0 < AIR_R && d1 < d0 - TOL) airIn.push(`#${tr} ${j}@${seq[k].t.toFixed(1)}s ${d0.toFixed(2)}→${d1.toFixed(2)}`); continue; }
            if (!A[j].fish && d0 < SHY_R && d1 < d0 - TOL) closer.push(`#${tr} ${j}@${seq[k].t.toFixed(1)}s ${d0.toFixed(2)}→${d1.toFixed(2)}`);
            if (A[j].fish && d0 < FISH_R && d1 < d0 - TOL) fishIn.push(`#${tr} ${j}@${seq[k].t.toFixed(1)}s ${d0.toFixed(2)}→${d1.toFixed(2)}`);
            // a leap may not START within LEAP_R; one already in the air when the visitor arrives may only bend away
            const out0 = seq[k - 1].waterY != null && A[j].y > seq[k - 1].waterY + 0.03, out1 = seq[k].waterY != null && Bf[j].y > seq[k].waterY + 0.03;
            if (Bf[j].fish && d1 < LEAP_R && out1 && !out0) leaps.push(`#${tr} ${j}@${seq[k].t.toFixed(1)}s ${d1.toFixed(2)} m`);
            if (Bf[j].fish && d0 < LEAP_R && out0 && out1 && d1 < d0 - TOL) leaps.push(`#${tr} ${j}@${seq[k].t.toFixed(1)}s in the air, ${d0.toFixed(2)}→${d1.toFixed(2)} m`);
          }
        }
        nearN += seq[0].fauna.filter((f) => !f.fish && !f.air && dist(f) < SHY_R).length;
        airClose += seq[seq.length - 1].fauna.filter((f) => f.air && dist(f) < CLOSE).length;
        const end = seq[seq.length - 1].fauna.filter((f) => !f.fish && !f.air), tc = end.filter((f) => dist(f) < CLOSE), cn = tc.filter((f) => f.shy === 2);
        tooCloseN += tc.length; corneredN += cn.length; if (end.length) nearest = Math.min(nearest, ...end.map(dist));
      }
      if (!trials) { check(false, `${id}: found a place 1.2 m from a creature`); await page.close(); continue; }
      check(knows, `${id}: the creatures know where the visitor stands (${trials} placements)`);
      check(nearN > 0 || land.length === 0, `${id}: land creatures or waders started near the visitor (${nearN} within ${SHY_R} m over ${trials} placements)`);
      check(closer.length === 0, `${id}: no land creature or wader came closer inside ${SHY_R} m${closer.length ? ": " + closer.slice(0, 3).join("; ") : ""}`);
      if (corneredN) notes.push(`${id} @${w}px: ${corneredN} time(s) a creature had nowhere further to go (water, wall or the room's edge behind it) within ${CLOSE} m, and stood still facing away`);
      check(tooCloseN - corneredN === 0, `${id}: after ${SETTLE} s no creature within ${CLOSE} m (nearest ${nearest < 99 ? nearest.toFixed(2) : "-"} m${corneredN ? `; ${corneredN} cornered, see notes` : ""})`);
      check(airIn.length === 0, `${id}: no bird or insect inside ${AIR_R} m came closer${airIn.length ? ": " + airIn.slice(0, 3).join("; ") : ""}`);
      check(airClose === 0, `${id}: after ${SETTLE} s no bird or insect within ${CLOSE} m (${airClose})`);
      check(fishIn.length === 0, `${id}: no fish swam in toward the visitor inside ${FISH_R} m${fishIn.length ? ": " + fishIn.slice(0, 3).join("; ") : ""}`);
      check(leaps.length === 0, `${id}: no leap starts within ${LEAP_R} m, and none in the air comes closer${leaps.length ? ": " + leaps.slice(0, 3).join("; ") : ""}`);
      const pm = seqL[seqL.length - 1].plantsMe, lastMe = seqL[seqL.length - 1].me;
      check(Math.abs(pm[0] - lastMe.x) < 1e-6 && Math.abs(pm[1] - lastMe.z) < 1e-6 && pm[2] > 0.99, `${id}: the plants lean from the visitor at full strength after the fade (${pm.map((v) => +v.toFixed(2)).join(", ")})`);
      const fade = await page.evaluate(([i, b]) => { window.__MU.place(b.x0 + 1, b.z0 + 1, 0, -0.4); window.__MU.reactSim(i, 2, 2); window.__MU.place(b.x1 - 1, b.z1 - 1, 0, -0.4); return window.__MU.reactSim(i, 0.1, 0.1)[0].plantsMe[2]; }, [id, B]);
      check(fade < 0.5, `${id}: right after a teleport across the room the lean was fading in, not snapping (${fade.toFixed(2)} after 0.1 s)`);
      // water: from the deepest point, walk three steps through it and look for fresh rings at the feet
      if (r0.wet) {
        const [x0, z0] = r0.wet, rings = [];
        await page.evaluate(([i, x, z]) => { window.__MU.place(x, z, 0, -0.4); window.__MU.reactSim(i, 0.05, 0.05); }, [id, x0, z0]);
        for (let k = 1; k <= 3; k++) {
          const ds = (k - 2) * 0.5, x = r0.axis === "x" ? x0 + ds : x0, z = r0.axis === "x" ? z0 : z0 + ds;   // from mid-channel, step along the area's length
          const r = await page.evaluate(([i, x, z]) => { window.__MU.place(x, z, 0, -0.4); const q = window.__MU.reactSim(i, 0.05, 0.05); return q[q.length - 1]; }, [id, x, z]); const over = r.rip.find((s) => Math.abs(s[0] - x) < 1e-6 && Math.abs(s[1] - z) < 1e-6 && s[3] < 1);
          rings.push(over ? 1 : 0);
        }
        // a step of 0.5 m is over RIPPLE_STEP, so every step that is still over water rings; the bed may end, so 2 of 3 is the floor
        check(rings.reduce((a, b) => a + b, 0) >= 2, `${id}: walking through the water leaves fresh rings at the feet (${rings.join("")}, step ${RIPPLE_STEP} m)`);
      }
    }
    check(errors.length === 0, `0 script errors${errors.length ? ": " + errors.slice(0, 2).join(" | ") : ""}`);
    await page.close();
  }
  await b.close(); srv.close();
  if (notes.length) console.log("\nnotes:\n  " + notes.join("\n  "));
  console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nall react checks passed");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
