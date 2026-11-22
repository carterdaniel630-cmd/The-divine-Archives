// usage: node tools/vr-perf-overlay-check.js [docs] [shot-dir]   (needs Playwright; headless, SwiftShader; not a
// verify-*.js, so the facts workflow, which has no browser, does not run it)
// The hidden frame-budget overlay for the headset (docs/assets/vr-perf-overlay.js; handoff/vr-performance-budget.md §7),
// checked without a headset:
//  1. the helpers: percentiles from the frame-time histogram (never optimistic), the per-tier verdict;
//  2. without ?vrfps=1 (phones 360 and 390 px, desktop): the module is never requested, no box, no plate, 0 errors;
//  3. ?vrfps=1 on a phone with no VR: the corner box shows, no Enter VR button, 0 errors, the bar still fits;
//  4. ?vrfps=1 in the stand-in Quest 2, in the Rotunda and ch02 Egypt: the plate shows in the view (a child of the
//     camera, on the rig), window.__vrfps reads immersive, floor tier, foveation 1.0, scale 0.8; its draw calls and
//     triangles equal three.js's own count for the same frame; figures are kept per area; leaving VR hides the plate
//     and a new entry starts a new run.
// A stand-in device proves the overlay's wiring only. Its frame times are software-rendered and mean nothing; the
// numbers that certify the 72 fps gate are the ones this overlay shows in a real Quest 2.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", SHOTS = process.argv[3] || null, PORT = 8793;
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".glb": "model/gltf-binary" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
const { fakeXR } = require("./xr-standin");

const fails = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) fails.push(what); };
const PHONE = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36";
const DESK = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const Q2 = "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/36.0 Chrome/126.0 VR Safari/537.36";

async function helpers(page) {
  console.log("1. the helpers (run in the page, where three.js resolves)");
  const r = await page.evaluate(async () => {
    const M = await import("./assets/vr-perf-overlay.js?v=1"), out = [];
    const h = new Uint32Array(M.VRFPS.BINS); for (let i = 0; i < 95; i++) h[M.binOf(11.1)]++; for (let i = 0; i < 5; i++) h[M.binOf(30)]++;
    out.push([M.histQ(h, 100, 0.5) === 11.25 && M.histQ(h, 100, 0.95) === 11.25 && M.histQ(h, 100, 0.96) === 30.25, "histogram quantiles are the upper bin edge (11.25 / 11.25 / 30.25)"]);
    out.push([M.listQ([10, 12, 11, 30], 0.5) === 11 && M.listQ([10, 12, 11, 30], 0.95) === 30, "last-second quantiles are exact"]);
    const ok = { frames: 400, p95: 13.5, calls: 150, tris: 300000, lights: 5, texMB: 10, hitches: 0 }, w = (o) => Object.assign({}, ok, o);
    out.push([M.judge(ok, "floor").state === "within", "a room inside every Quest 2 ceiling is WITHIN"]);
    out.push([M.judge(w({ calls: 200 }), "floor").state === "over" && M.judge(w({ calls: 200 }), "q3").state === "within", "200 calls: over on Quest 2, within on Quest 3"]);
    out.push([M.judge(w({ p95: 14.2 }), "floor").state === "over", "p95 14.2 ms over enough frames: OVER"]);
    out.push([M.judge(w({ frames: 100, p95: 30 }), "floor").state === "measuring", "too few frames: p95 is not judged yet (MEASURING)"]);
    out.push([M.judge(w({ hitches: 1 }), "floor").over[0] === "1 frame > 20 ms", "one hitch is named"]);
    out.push([M.judge(w({ texMB: 60 }), "floor").state === "within", "the in-view texture figure (an upper bound) is shown, not judged"]);
    out.push([M.wanted("?vrfps=1") && M.wanted("?a=2&vrfps=1") && !M.wanted("?vrfps=10") && !M.wanted("?fps=1") && !M.wanted(""), "only ?vrfps=1 turns it on"]);
    return out;
  });
  for (const [ok, what] of r) check(ok, what);
}


async function open(b, { width, height, mobile, ua, xr, query }) {
  const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: !!mobile, hasTouch: !!mobile, userAgent: ua });
  const page = await ctx.newPage();
  const errors = [], asked = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("request", (r) => { if (/vr-perf-overlay\.js/.test(r.url())) asked.push(r.url()); });
  if (xr) await page.addInitScript(fakeXR, xr === true ? {} : xr);
  await page.goto(`http://localhost:${PORT}/museum.html${query || ""}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e && !e.closest("[hidden]")) e.click(); });
  await page.waitForTimeout(2500);
  return { ctx, page, errors, asked };
}

(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });

  console.log("2. without ?vrfps=1: nothing loads");
  for (const [w, h, mobile, ua, label] of [[360, 780, true, PHONE, "phone 360"], [390, 844, true, PHONE, "phone 390"], [1280, 800, false, DESK, "desktop"]]) {
    const { ctx, page, errors, asked } = await open(b, { width: w, height: h, mobile, ua });
    const r = await page.evaluate(() => ({ hook: window.__MU.vrfps(), box: !!document.getElementById("mu-vrfps"), g: typeof window.__vrfps }));
    check(asked.length === 0, `${label}: the overlay module is never requested`);
    check(r.hook === null && !r.box && r.g === "undefined", `${label}: no overlay, no box, no window.__vrfps`);
    check(errors.length === 0, `${label}: 0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  console.log("3. ?vrfps=1 on phones with no VR: the corner box");
  for (const [w, h, label] of [[360, 780, "phone 360"], [390, 844, "phone 390"]]) {
    const { ctx, page, errors, asked } = await open(b, { width: w, height: h, mobile: true, ua: PHONE, query: "?vrfps=1" });
    if (w === 360) await helpers(page);
    await page.evaluate(() => window.__MU.look(window.__MU.state().yaw + 0.3, 0));
    await page.waitForTimeout(1600);
    const r = await page.evaluate(() => { const bx = document.getElementById("mu-vrfps"), rc = bx && bx.getBoundingClientRect(); return { x: window.__MU.xr(), s: window.__vrfps, box: bx ? { text: bx.textContent, shown: bx.style.display !== "none", fits: rc.right <= window.innerWidth + 1 && rc.left >= 0 } : null, bar: document.getElementById("mu-bar").scrollWidth <= window.innerWidth + 1 }; });
    check(asked.length >= 1, `${label}: the module is requested`);
    check(!r.x.button, `${label}: still no Enter VR button`);
    check(r.box && r.box.shown && r.box.fits && /BUDGET/.test(r.box.text), `${label}: the corner box shows and fits${r.box ? " — " + r.box.text.split("\n")[0] : ""}`);
    check(r.s && r.s.mode === "flat" && r.s.drawCalls > 0, `${label}: __vrfps reads flat with draw calls (${r.s && r.s.drawCalls})`);
    check(r.bar, `${label}: the top bar still fits`);
    check(errors.length === 0, `${label}: 0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    if (SHOTS && w === 390) await page.screenshot({ path: path.join(SHOTS, "vrfps-phone-390.png") });
    await ctx.close();
  }

  console.log("4. ?vrfps=1 in the stand-in Quest 2");
  {
    const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr: {}, query: "?vrfps=1" });
    await page.waitForFunction(() => !!window.__MU.vrfps(), null, { timeout: 20000 });
    // three.js's own count for the frame the overlay read, taken in the same task as the overlay's figure
    const frames = (n) => page.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
    const enter = async () => {
      await page.evaluate(() => { window.__fx.head = { x: 0, z: 0, yaw: 0 }; document.exitPointerLock && document.exitPointerLock(); });
      await page.click("#mu-vr-btn", { force: true, timeout: 120000 });
      await page.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 20000 });
    };
    const exit = async () => { await page.evaluate(() => window.__MU.xrExit()); await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 15000 }); await page.waitForTimeout(400); };
    const wait = async (ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) await page.waitForTimeout(200); };
    let firstRun = null;
    for (const [label, target] of [["Rotunda", "@rotunda"], ["ch02 Egypt", "ch02"]]) {
      await page.evaluate((t) => window.__MU.teleport(t), target);
      await page.waitForTimeout(1500);
      await enter();
      await frames(6);
      await wait(2600);   // at least two once-a-second updates
      const r = await page.evaluate(() => { const v = window.__MU.vrfps(), s = window.__MU.state(); return { v, calls: s.calls, tris: s.tris, x: window.__MU.xr() }; });
      const s = r.v.stats;
      check(r.v.plateShown && r.v.plateParent === "PerspectiveCamera" && r.x.cameraParent === "xr-rig", `${label}: the plate shows, on the camera (${r.v.plateParent}), on the rig (${r.x.cameraParent})`);
      check(s.mode === "immersive" && s.tier === "floor" && s.budget === "QUEST 2" && s.foveation === 1 && s.framebufferScale === 0.8, `${label}: immersive, floor tier, foveation ${s.foveation}, scale ${s.framebufferScale}`);
      check(s.drawCalls > 0 && s.triangles > 0 && s.overlayCalls === 2, `${label}: stereo draw calls ${s.drawCalls}, triangles ${s.triangles} (overlay ${s.overlayCalls} calls)`);
      check(s.drawCalls <= r.calls * 1.25 + 2 && s.drawCalls >= r.calls * 0.75 - 2, `${label}: the overlay's calls (${s.drawCalls}, the second's peak) agree with three.js's count (${r.calls}, last frame)`);
      check(s.lights > 0 && s.programs > 0 && s.textures > 0 && s.textureMemMB > 0, `${label}: lights ${s.lights}, programs ${s.programs}, textures ${s.textures} (${s.textureMemMB} MB in view, upper bound), scan ${s.scanMs} ms`);
      check(s.run && s.run.frames > 10 && s.frameMs && s.frameMs.p95 > 0, `${label}: frame times recorded (${s.run && s.run.frames} frames; stand-in figures, not a headset's)`);
      check(s.area && s.areas[s.area] && /Rotunda|Egypt|Bronze/i.test(s.area), `${label}: figures kept for the area "${s.area}"`);
      check(/BUDGET/.test(r.v.text[0]) && r.v.text.length === 6, `${label}: the plate reads "${r.v.text[0]}"`);
      if (!firstRun) firstRun = s.run.frames;
      if (SHOTS) {
        const img = await page.evaluate(() => window.__MU.vrfpsImage());
        if (img) fs.writeFileSync(path.join(SHOTS, `vrfps-plate-${target.replace(/\W/g, "")}.png`), Buffer.from(img.split(",")[1], "base64"));
        await page.screenshot({ path: path.join(SHOTS, `vrfps-headset-${target.replace(/\W/g, "")}.png`) });
      }
      await exit();
      const after = await page.evaluate(() => ({ v: window.__MU.vrfps(), box: (document.getElementById("mu-vrfps") || {}).style }));
      check(!after.v.plateShown, `${label}: leaving VR hides the plate`);
      await page.waitForTimeout(1500);
      const flat = await page.evaluate(() => window.__vrfps);
      check(flat.mode === "flat", `${label}: back on the flat screen, a new run (mode ${flat.mode})`);
    }
    check(errors.length === 0, `stand-in Quest 2: 0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(fails.length ? `\n${fails.length} FAILED` : "\nall passed");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); srv.close(); process.exit(1); });
