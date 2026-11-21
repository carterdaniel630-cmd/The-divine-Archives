// usage: node tools/vr-frame-budget.js [docs] [out.json]   (needs Playwright; headless, SwiftShader)
//        GATE=1 also exits 1 when any view is over a Quest 2 ceiling (it never runs in CI: see below)
// The VR frame-budget harness (VR loop G3; handoff/vr-performance-budget.md §2 and §7), beside tools/museum-baseline.js.
// It enters the museum in the stand-in headset (tools/xr-standin.js, a simulated Quest 2: floor tier, foveation 1.0,
// framebuffer scale 0.8) and, in each pilot room (the Rotunda, ch02 Egypt, ch03 Mesopotamia) and in the Wing II corridor
// that looks into both rooms, turns the head through eight headings at the doorway and at mid-room. For every view it
// reads, through three.js's own XR render path (both eyes drawn by one renderer.render):
//   - draw calls, stereo-submitted (renderer.info.render.calls: the number the driver actually takes);
//   - triangles per frame, both eyes (renderer.info.render.triangles);
//   - lights in the scene graph that are switched on in the frame (visible Light objects; three.js evaluates every one in
//     every lit fragment whatever its intensity, so intensity-0 lights are counted and listed separately);
//   - particle points on screen, per eye (renderer.info.render.points, both eyes, halved) and shader programs (must stop
//     growing after warm-up);
//   - textures: three.js's count of those uploaded, plus this harness's own ledger of their size (w × h × 4 × 1.33 with
//     mipmaps, §6) and how many are canvas textures — for the objects switched on in the frame ("in view": an upper
//     bound for the room, since corridors and neighbouring rooms that are switched on count too) and for everything
//     built in the scene graph (the session).
// and compares them with the §2 ceilings for the Quest 2 floor tier (and Quest 3, for information).
//
// What it does NOT measure: frame time in a headset. SwiftShader runs on the CPU, so its frame times are recorded only
// as "relative, not a headset figure". The 72 fps gate (p95 ≤ 13.9 ms) is certified only in a real Quest 2 (§7, §8 rule
// 6), which a build session cannot wear. Counts of draw calls, triangles and lights do not depend on the GPU, so they are
// the part of the gate that can be measured here. Texture memory is the whole session's resident set; a per-room ledger
// needs the debug registry of §7 and is not built yet, so the resident total is an upper bound for any one room.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { fakeXR } = require("./xr-standin");
const ROOT = process.argv[2] || "docs", OUT = process.argv[3] || null, PORT = +process.env.PORT || 8797;
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".glb": "model/gltf-binary" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);

// handoff/vr-performance-budget.md §2 (visible per frame, stereo). "hard" is the hard-fail line for either tier.
const CEIL = {
  calls: { q2: 160, q3: 240, hard: 320 },
  tris: { q2: 350000, q3: 600000, hard: 500000 },        // hard: > 500k on Quest 2 (> 800k on Quest 3)
  lights: { q2: 5, q3: 6, hard: 8 },
  points: { q2: 4000, q3: 8000, hard: 15000 },
  canvasTex: { q2: 14, q3: 20, hard: 28 },                 // per room; here: objects switched on in the frame (upper bound)
  texMB: { q2: 16, q3: 24, hard: 40 },                     // per room, MB; same upper bound
  sessionMB: { q2: 128, q3: 256, hard: Infinity }          // resident in the session: everything built in the scene graph
};
const Q2 = "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/36.0 Chrome/126.0 VR Safari/537.36";
const HEADINGS = 8;

// runs in the page before the museum loads: three.js announces every renderer it makes on __THREE_DEVTOOLS__ (its
// devtools hook), so the harness can see which scene the headset is drawn from without any change to the site
function watchRenderers() {
  const seen = (window.__vrSeen = { renderers: [] });
  window.__THREE_DEVTOOLS__ = new EventTarget();
  window.__THREE_DEVTOOLS__.addEventListener("observe", (e) => {
    const r = e.detail; if (!r || !r.isWebGLRenderer || typeof r.render !== "function") return;
    const slot = { r, scene: null }; seen.renderers.push(slot);
    const render = r.render; r.render = function (scene, camera) { if (r.xr && r.xr.isPresenting) slot.scene = scene; return render.call(this, scene, camera); };
  });
}
// runs in the page: everything the scene graph says about this frame that renderer.info does not
function sceneLedger() {
  const slot = window.__vrSeen.renderers.find((s) => s.r.xr && s.r.xr.isPresenting && s.scene), sc = slot && slot.scene;
  if (!sc) return null;
  const lights = { on: 0, zero: 0, byType: {} };
  sc.traverseVisible((o) => {
    if (o.isLight) { lights.on++; if (!o.intensity) lights.zero++; const k = o.type + (o.intensity ? "" : " (0)"); lights.byType[k] = (lights.byType[k] || 0) + 1; }
  });
  const texOf = (o, out) => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (const m of ms) for (const key in m) { const v = m[key]; if (v && v.isTexture && !out.has(v.uuid)) { const im = v.image || {}, w = im.width || 0, h = im.height || 0; out.set(v.uuid, { bytes: w * h * 4 * (v.generateMipmaps !== false && !v.isDataTexture ? 1.33 : 1), canvas: !!(v.isCanvasTexture || (typeof HTMLCanvasElement !== "undefined" && im instanceof HTMLCanvasElement) || (typeof OffscreenCanvas !== "undefined" && im instanceof OffscreenCanvas)) }); } } };
  const sum = (m) => { let bytes = 0, canvas = 0; for (const t of m.values()) { bytes += t.bytes; if (t.canvas) canvas++; } return { textures: m.size, canvas, MB: +(bytes / 1048576).toFixed(1) }; };
  const inView = new Map(), all = new Map();
  sc.traverseVisible((o) => texOf(o, inView)); sc.traverse((o) => texOf(o, all));
  if (sc.background && sc.background.isTexture) { texOf({ material: { b: sc.background } }, inView); texOf({ material: { b: sc.background } }, all); }
  const info = slot.r.info;
  return { lights, pointsPerEye: Math.round((info.render.points || 0) / 2), programs: info.programs ? info.programs.length : null, texView: sum(inView), texAll: sum(all) };
}

(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext({ viewport: { width: 400, height: 300 }, deviceScaleFactor: 1, userAgent: Q2 });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.addInitScript(fakeXR, {});
  await page.addInitScript(watchRenderers);
  await page.addInitScript(`window.__vrLedger = ${sceneLedger.toString()};`);
  await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e && !e.closest("[hidden]")) e.click(); });
  await page.waitForTimeout(1000);

  const frames = (n) => page.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
  const settle = async () => {   // relics stream in one per frame (app.js buildQueuedRelic): wait for the queue to empty
    const t0 = Date.now();
    while (Date.now() - t0 < 90000) { if ((await page.evaluate(() => window.__MU.relicsPending())) === 0) break; await page.waitForTimeout(500); }
    await page.waitForTimeout(1500);
  };
  const enter = async () => {
    await page.evaluate(() => { window.__fx.head = { x: 0, z: 0, yaw: 0 }; document.exitPointerLock && document.exitPointerLock(); });
    await page.click("#mu-vr-btn", { force: true, timeout: 120000 });   // a real click: WebXR needs the gesture
    await page.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 20000 });
    await frames(4);
  };
  const exit = async () => { await page.evaluate(() => window.__MU.xrExit()); await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 15000 }); await page.waitForTimeout(300); };

  // places: [label, teleport target, metres walked in from the arrival spot]
  const PLACES = [
    ["Rotunda — arrival", "@rotunda", 0], ["Rotunda — centre", "@rotunda", 8],
    ["ch02 Egypt — doorway", "ch02", 0], ["ch02 Egypt — mid-room", "ch02", 3],
    ["ch03 Mesopotamia — doorway", "ch03", 0], ["ch03 Mesopotamia — mid-room", "ch03", 3],
    ["Wing II corridor (sightline into ch02/ch03)", "@02-bronze-age", 0]
  ];
  const res = { root: ROOT, device: "stand-in Quest 2 (floor tier), SwiftShader; per-eye projection 1.6 rad vertical, aspect 0.9 (an approximation of the headset's field, not a Meta figure)", ceilings: CEIL, places: [], errors };
  const over = [];
  for (const [label, target, inward] of PLACES) {
    await page.evaluate(([t, d]) => { window.__MU.teleport(t); if (d) { const s = window.__MU.state(); window.__MU.place(s.x - Math.sin(s.yaw) * d, s.z - Math.cos(s.yaw) * d, s.yaw, 0); } }, [target, inward]);
    await settle();
    await enter();
    const xr = await page.evaluate(() => window.__MU.xr());
    const views = [];
    for (let k = 0; k < HEADINGS; k++) {
      await page.evaluate((yaw) => { window.__fx.head = { x: 0, z: 0, yaw }; }, (k * 2 * Math.PI) / HEADINGS);
      await frames(3);
      const t0 = await page.evaluate(() => [performance.now(), window.__fx.frames]);
      await frames(3);
      const v = await page.evaluate(([t, f]) => { const s = window.__MU.state(); return Object.assign({ calls: s.calls, tris: s.tris, textures: s.textures, where: s.where, msPerFrame: +((performance.now() - t) / Math.max(1, window.__fx.frames - f)).toFixed(0) }, window.__vrLedger()); }, t0);
      v.heading = Math.round((k * 360) / HEADINGS);
      views.push(v);
    }
    await exit();
    const max = (f) => Math.max(...views.map(f));
    const sum = { calls: max((v) => v.calls), tris: max((v) => v.tris), lights: max((v) => v.lights.on), lightsAt0: max((v) => v.lights.zero), lightTypes: views[0].lights.byType, points: max((v) => v.pointsPerEye), textures: max((v) => v.textures), texMB: max((v) => v.texView.MB), canvasTex: max((v) => v.texView.canvas), sessionMB: max((v) => v.texAll.MB), sessionCanvasTex: max((v) => v.texAll.canvas), programs: max((v) => v.programs || 0), msPerFrameSwiftShader: max((v) => v.msPerFrame) };
    const verdict = {};
    for (const k of ["calls", "tris", "lights", "points", "canvasTex", "texMB", "sessionMB"]) verdict[k] = sum[k] > CEIL[k].hard ? "HARD FAIL" : sum[k] > CEIL[k].q2 ? (sum[k] > CEIL[k].q3 ? "over Q2 and Q3" : "over Q2") : "within Q2";
    // the per-room texture lines are measured over everything switched on, not the room alone: an upper bound, so an
    // over-ceiling reading says "room not shown to be within", never a measured hard fail of the room
    for (const k of ["canvasTex", "texMB"]) if (verdict[k] !== "within Q2") verdict[k] = "upper bound over Q2 (per-room ledger not built yet)";
    for (const k in verdict) if (verdict[k] !== "within Q2") over.push(`${label}: ${k} ${sum[k]} (${verdict[k]})`);
    res.places.push({ label, target, inward, tier: xr.tier, foveation: xr.foveation, scale: xr.scale, where: views[0].where, worst: sum, verdict, views: views.map((v) => ({ heading: v.heading, calls: v.calls, tris: v.tris, lights: v.lights.on, points: v.pointsPerEye })) });
    console.log(`${label.padEnd(46)} calls ${String(sum.calls).padStart(4)}  tris ${String(sum.tris).padStart(7)}  lights ${sum.lights} (${sum.lightsAt0} at 0)  points/eye ${sum.points}  tex in view ${sum.texMB} MB (${sum.canvasTex} canvas)  session ${sum.sessionMB} MB (uploaded ${sum.textures})  programs ${sum.programs}`);
  }
  res.overQuest2 = over;
  res.errors = errors;
  console.log(over.length ? `\nOver a Quest 2 ceiling (handoff/vr-performance-budget.md §2):\n  ${over.join("\n  ")}` : "\nEvery view within the Quest 2 ceilings that can be counted here.");
  console.log(errors.length ? `script errors: ${errors.join(" | ")}` : "0 script errors");
  console.log("Frame time is not measured here: only a real Quest 2 certifies 72 fps.");
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  await b.close(); srv.close();
  process.exit(errors.length || (process.env.GATE && over.length) ? 1 : 0);
})().catch((e) => { console.error(e); srv.close(); process.exit(1); });
