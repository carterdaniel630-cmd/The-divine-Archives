// usage: node tools/xr-entry-check.js [docs]   (needs Playwright; headless, SwiftShader; not a verify-*.js, so the
// facts workflow, which has no browser, does not run it)
// The museum's VR door (docs/museum/xr.js, handoff/vr-architecture.md §1, §2, §5), checked without a headset:
//  1. no WebXR / no VR offered (phones 360 and 390 px, desktop): no "Enter VR" button, no script errors, the museum
//     runs and its render loop draws;
//  2. a simulated headset (a stand-in navigator.xr, injected before the page loads): the button shows; ten enters and
//     exits without a reload; each enter starts where the visitor stood, puts the camera on the rig and draws frames
//     through the session; each exit puts the camera back and the visitor down where their head was;
//  3. the declared seated fallback when the device has no local-floor (eye height 1.2 m);
//  4. a refused session stays flat with one honest line;
//  5. the per-tier constants: Quest 2 (and unknown headsets) 1.0 foveation / 0.8 scale, Quest 3 0.75 / 1.0.
// A stand-in device proves the museum's side of the contract only. Certification is on a real Quest 2 (the floor
// device), which a build session cannot wear.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", PORT = 8791;
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".glb": "model/gltf-binary" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);

// the stand-in headset: just enough of the WebXR Device API for three.js's WebXRManager (XRWebGLLayer path)
function fakeXR(opts) {
  const o = opts || {};
  try { delete window.XRWebGLBinding; } catch (e) { /* not there */ }
  Object.defineProperty(window, "XRWebGLBinding", { value: undefined, configurable: true, writable: true });
  const persp = (fov, aspect, n, f) => { const t = 1 / Math.tan(fov / 2); return new Float32Array([t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]); };
  const mat = (x, y, z, yaw) => { const c = Math.cos(yaw), s = Math.sin(yaw); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, x, y, z, 1]); };
  window.__fx = { frames: 0, sessions: 0, head: { x: 0.4, z: -0.3, yaw: 0.5 }, requests: [] };
  class FakeLayer {
    constructor(session, gl, init) { this.gl = gl; this.framebuffer = null; this.framebufferWidth = gl.drawingBufferWidth; this.framebufferHeight = gl.drawingBufferHeight; this.ignoreDepthValues = true; window.__fx.layerScale = init && init.framebufferScaleFactor; }
    getViewport(view) { const w = this.framebufferWidth / 2; return { x: view.eye === "left" ? 0 : w, y: 0, width: w, height: this.framebufferHeight }; }
  }
  window.XRWebGLLayer = FakeLayer;
  // a real headset makes the context XR-compatible; with no device Chromium refuses, so the stand-in says yes
  WebGL2RenderingContext.prototype.makeXRCompatible = function () { return Promise.resolve(); };
  class FakeSession extends EventTarget {
    constructor(features, floor) { super(); this.enabledFeatures = features; this.floor = floor; this.inputSources = []; this.renderState = { baseLayer: null, depthNear: 0.1, depthFar: 1000 }; this.environmentBlendMode = "opaque"; this.visibilityState = "visible"; this.ended = false; }
    updateRenderState(s) { Object.assign(this.renderState, s); }
    async requestReferenceSpace(type) { if (type === "local-floor" && !this.floor) throw new DOMException("no floor", "NotSupportedError"); return { type, getOffsetReferenceSpace() { return this; } }; }
    requestAnimationFrame(cb) {
      return window.requestAnimationFrame((t) => {
        if (this.ended) return;
        const h = window.__fx.head, y = this.floor ? 1.6 : 0;
        const pose = { transform: { matrix: mat(h.x, y, h.z, h.yaw) }, views: ["left", "right"].map((eye, i) => ({ eye, projectionMatrix: persp(1.6, 0.9, 0.05, 140), transform: { matrix: mat(h.x + (i ? 0.032 : -0.032), y, h.z, h.yaw) } })) };
        window.__fx.frames++;
        cb(t, { session: this, getViewerPose: () => pose, getPose: () => null });
      });
    }
    cancelAnimationFrame(id) { window.cancelAnimationFrame(id); }
    async end() { if (this.ended) return; this.ended = true; setTimeout(() => this.dispatchEvent(new Event("end")), 0); }
  }
  const xr = new EventTarget();
  xr.isSessionSupported = async (mode) => mode === "immersive-vr" && !o.unsupported;
  xr.requestSession = async (mode, init) => {
    window.__fx.requests.push(JSON.stringify(init));
    if (o.refuse) throw new DOMException("refused", "NotSupportedError");
    const req = (init && init.requiredFeatures) || [];
    if (req.includes("local-floor") && o.noFloor) throw new DOMException("no local-floor", "NotSupportedError");
    window.__fx.sessions++;
    const features = o.noFloor ? ["viewer", "local"] : ["viewer", "local", "local-floor"];
    return (window.__fx.session = new FakeSession(features, !o.noFloor));
  };
  Object.defineProperty(navigator, "xr", { value: xr, configurable: true });
}

const fails = [];
const check = (ok, what) => { console.log((ok ? "  ok   " : "  FAIL ") + what); if (!ok) fails.push(what); };

async function open(b, { width, height, mobile, ua, xr }) {
  const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: !!mobile, hasTouch: !!mobile, userAgent: ua });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  if (xr) await page.addInitScript(fakeXR, xr === true ? {} : xr);
  await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e && !e.closest("[hidden]")) e.click(); });
  await page.waitForTimeout(1500);
  return { ctx, page, errors };
}
const drawsFlat = (page) => page.evaluate(() => new Promise((ok) => { const a = window.__MU.state().calls; window.__MU.look(window.__MU.state().yaw + 0.01, 0); setTimeout(() => ok(window.__MU.state().calls > 0 || a > 0), 600); }));

(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const PHONE = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36";
  const DESK = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
  const Q2 = "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/36.0 Chrome/126.0 VR Safari/537.36";
  const Q3 = "Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/36.0 Chrome/126.0 VR Safari/537.36";

  console.log("1. no VR offered: the museum is the flat museum");
  for (const [w, h, mobile, ua, label] of [[360, 780, true, PHONE, "phone 360"], [390, 844, true, PHONE, "phone 390"], [1280, 800, false, DESK, "desktop"]]) {
    const { ctx, page, errors } = await open(b, { width: w, height: h, mobile, ua });
    const x = await page.evaluate(() => window.__MU.xr());
    check(!x.button, `${label}: no Enter VR button (probe: ${x.reason})`);
    check(x.mode === "flat" && !x.presenting && x.cameraParent === "Scene", `${label}: flat mode, camera in the scene`);
    check(await drawsFlat(page), `${label}: the render loop draws`);
    const noOverflow = await page.evaluate(() => document.getElementById("mu-bar").scrollWidth <= window.innerWidth + 1);
    check(noOverflow, `${label}: the top bar fits the screen`);
    check(errors.length === 0, `${label}: 0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await open(b, { width: 390, height: 844, mobile: true, ua: PHONE, xr: { unsupported: true } });
    const x = await page.evaluate(() => window.__MU.xr());
    check(!x.button && x.reason === "no-vr", "navigator.xr present but no immersive-vr: button hidden");
    check(errors.length === 0, "  … 0 script errors");
    await ctx.close();
  }

  console.log("2. a simulated Quest 2: ten enters and exits, no reload");
  {
    const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr: true });
    check((await page.evaluate(() => window.__MU.xr())).button, "Enter VR button shown");
    let allOk = true, notes = [];
    for (let i = 0; i < 10; i++) {
      const before = await page.evaluate((i) => { window.__MU.place(2 + i * 0.3, 9, 0.2 * i, 0); window.__fx.head = { x: 0.4, z: -0.3, yaw: 0.5 }; return window.__MU.state(); }, i);
      await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });   // a real click (the gesture WebXR needs), after Esc-ing the mouse look like a visitor would; force: SwiftShader frames are too slow for the stability wait
      try { await page.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 15000 }); }
      catch (e) { console.log(await page.evaluate(() => JSON.stringify({ xr: window.__MU.xr(), fx: window.__fx, note: document.getElementById("mu-xr-note").textContent }))); throw e; }
      const f0 = await page.evaluate(() => window.__fx.frames);
      await page.waitForFunction((f0) => window.__fx.frames - f0 > 5, f0, { timeout: 30000 });
      const inXR = await page.evaluate(() => ({ x: window.__MU.xr(), s: window.__MU.state(), frames: window.__fx.frames, cls: document.body.classList.contains("is-xr"), barShown: getComputedStyle(document.getElementById("mu-bar")).display !== "none" }));
      // where the head is: rig at the flat spot, turned by the flat yaw, plus the head's offset (0.4, -0.3) turned the same way
      const c = Math.cos(before.yaw), s = Math.sin(before.yaw);
      const ex = before.x + 0.4 * c + -0.3 * s, ez = before.z - 0.4 * s + -0.3 * c;
      const okIn = inXR.x.cameraParent === "xr-rig" && inXR.x.rigShown && inXR.frames - f0 > 5 && inXR.cls && !inXR.barShown && Math.abs(inXR.s.x - ex) < 0.05 && Math.abs(inXR.s.z - ez) < 0.05;
      if (!okIn) { allOk = false; notes.push(`enter ${i + 1}: ${JSON.stringify({ parent: inXR.x.cameraParent, rig: inXR.x.rigShown, frames: inXR.frames - f0, cls: inXR.cls, bar: inXR.barShown, got: [inXR.s.x.toFixed(2), inXR.s.z.toFixed(2)], want: [ex.toFixed(2), ez.toFixed(2)] })}`); }
      if (i === 0) check(inXR.x.foveation === 1 && inXR.x.scale === 0.8 && inXR.x.tier === "floor", `Quest 2 tier: foveation ${inXR.x.foveation}, framebuffer scale ${inXR.x.scale} (layer asked for ${await page.evaluate(() => window.__fx.layerScale)})`);
      if (i === 0) check(!inXR.x.seated && (await page.evaluate(() => window.__fx.requests[0])).includes('"requiredFeatures":["local-floor"]'), "standing session: local-floor required first");
      await page.evaluate(() => window.__MU.xrExit());
      await page.waitForFunction(() => !window.__MU.xr().presenting && window.__MU.xr().mode === "flat", null, { timeout: 10000 });
      await page.waitForTimeout(300);
      const out = await page.evaluate(() => ({ x: window.__MU.xr(), s: window.__MU.state(), cls: document.body.classList.contains("is-xr"), bar: !document.getElementById("mu-bar").hidden }));
      const okOut = out.x.cameraParent === "Scene" && !out.x.rigShown && !out.cls && out.bar && out.x.button && Math.abs(out.s.x - ex) < 0.05 && Math.abs(out.s.z - ez) < 0.05 && Math.abs(out.s.yaw - (before.yaw + 0.5)) < 0.02;
      if (!okOut) { allOk = false; notes.push(`exit ${i + 1}: ${JSON.stringify({ parent: out.x.cameraParent, rig: out.x.rigShown, cls: out.cls, bar: out.bar, at: [out.s.x.toFixed(2), out.s.z.toFixed(2), out.s.yaw.toFixed(2)] })}`); }
    }
    check(allOk, "10× enter/exit: starts where the visitor stood, camera on the rig, frames drawn in the session, page put away; exit puts the camera back and the visitor where the head was, facing where it faced" + (notes.length ? "\n      " + notes.join("\n      ") : ""));
    const x = await page.evaluate(() => window.__MU.xr());
    check(x.enters === 10 && x.exits === 10, `enter/exit counted 10/10 (${x.enters}/${x.exits})`);
    check(await drawsFlat(page), "flat render loop draws again after the last exit");
    check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  console.log("3. no local-floor: the declared seated mode");
  {
    const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr: { noFloor: true } });
    await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });   // a real click (the gesture WebXR needs), after Esc-ing the mouse look like a visitor would; force: SwiftShader frames are too slow for the stability wait
    await page.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 10000 });
    await page.waitForFunction(() => window.__fx.frames > 3, null, { timeout: 30000 });
    const r = await page.evaluate(() => ({ x: window.__MU.xr(), reqs: window.__fx.requests.length }));
    const eye = await page.evaluate(() => window.__MU.xr().eyeY);
    check(r.x.seated && r.reqs === 2, `seated: retried with local-floor optional and opened seated (requests: ${r.reqs})`);
    check(eye != null && Math.abs(eye - 1.2) < 0.02, `seated eye height 1.2 m (got ${eye == null ? "?" : eye.toFixed(2)})`);
    await page.evaluate(() => window.__MU.xrExit());
    await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 10000 });
    check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  console.log("4. a refused session stays flat");
  {
    const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr: { refuse: true } });
    await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });   // a real click (the gesture WebXR needs), after Esc-ing the mouse look like a visitor would; force: SwiftShader frames are too slow for the stability wait
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({ x: window.__MU.xr(), note: document.getElementById("mu-xr-note").textContent, shown: !document.getElementById("mu-xr-note").hidden }));
    check(!r.x.presenting && r.x.mode === "flat" && r.x.cameraParent === "Scene", "still flat, camera in the scene");
    check(r.shown && /could not open in VR .* It remains open in 3D\.$/.test(r.note), `one honest line: "${r.note}"`);
    check(r.x.button, "button stays for a later attempt");
    check(await drawsFlat(page), "the render loop draws");
    check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  console.log("5. Quest 3 tier");
  {
    const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q3, xr: true });
    await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });   // a real click (the gesture WebXR needs), after Esc-ing the mouse look like a visitor would; force: SwiftShader frames are too slow for the stability wait
    await page.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 10000 });
    const x = await page.evaluate(() => window.__MU.xr());
    check(x.tier === "q3" && x.foveation === 0.75 && x.scale === 1, `Quest 3: foveation ${x.foveation}, scale ${x.scale}`);
    await page.evaluate(() => window.__MU.xrExit());
    await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 10000 });
    check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nall XR entry checks passed");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); srv.close(); process.exit(1); });
