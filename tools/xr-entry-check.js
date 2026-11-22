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
//  5. the per-tier constants: Quest 2 (and unknown headsets) 1.0 foveation / 0.8 scale, Quest 3 0.75 / 1.0;
//  6. moving (teleport, snap turn, vignette);
//  7. standing or seated (xr-height.js): the posture plaque, measured or set eye height, the switch, the note on leaving;
//  8. stick walking (xr-walk.js, xr-move.js): off by default, the walking plaque and its two confirmations, the
//     Warden's speed and ramp, level travel along the head's facing, the vignette, stopping, walls, kept on the device.
// SHOTS=<dir> also saves the headset's two-eye view while aiming (open floor, then a wall).
// A stand-in device proves the museum's side of the contract only. Certification is on a real Quest 2 (the floor
// device), which a build session cannot wear.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = process.argv[2] || "docs", PORT = 8791;
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".glb": "model/gltf-binary" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);

const { fakeXR } = require("./xr-standin");   // the stand-in headset (shared with tools/vr-frame-budget.js)

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

  console.log("6. moving in the headset: teleport, snap turn, vignette (simulated Quest 2, one right controller)");
  {
    const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr: { controller: true } });
    const frames = (n) => page.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
    const enterAt = async (x, z, yaw) => {
      await page.evaluate(([x, z, yaw]) => { window.__MU.place(x, z, yaw, 0); window.__fx.head = { x: 0, z: 0, yaw: 0 }; window.__fx.ctrl = { x: 0.2, y: 1.3, z: -0.3, yaw: 0, pitch: -0.5 }; window.__fx.source.gamepad.axes = [0, 0, 0, 0]; }, [x, z, yaw]);
      await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });
      await page.waitForFunction(() => window.__MU.xr().presenting && window.__MU.xrMove().controllers === 1, null, { timeout: 30000 });
      await frames(3);
    };
    const exit = async () => { await page.evaluate(() => window.__MU.xrExit()); await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 15000 }); await page.waitForTimeout(200); };
    // find, at the visitor's saved start, one heading whose aim lands on open floor and one that meets a wall
    const st = await page.evaluate(() => window.__MU.state());
    const probe = await page.evaluate(([x, z]) => {
      const out = { ok: null, bad: null };
      for (let k = 0; k < 24; k++) { const yaw = k * Math.PI / 12, d = 3.2; const tx = x - Math.sin(yaw) * d, tz = z - Math.cos(yaw) * d;
        const can = window.__MU.xrCanStand(tx, tz, x, z); if (can && out.ok == null) out.ok = yaw; if (!can && out.bad == null) out.bad = yaw; }
      return out; }, [st.x, st.z]);
    check(probe.ok != null && probe.bad != null, `test setup: an open heading (${probe.ok}) and a walled one (${probe.bad}) from the start spot`);

    // a valid teleport
    await enterAt(st.x, st.z, probe.ok);
    const before = await page.evaluate(() => window.__MU.state());
    await page.evaluate(() => window.__fx.press("selectstart"));
    await page.waitForFunction(() => window.__MU.xrMove().aiming, null, { timeout: 20000 });
    await frames(2);
    const aimed = await page.evaluate(() => window.__MU.xrMove());
    if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, "xr-aim-open.png"), timeout: 120000 });
    const dist = Math.hypot(aimed.marker[0] - before.x, aimed.marker[1] - before.z);
    check(aimed.valid && dist > 1 && dist <= 8.01, `holding the trigger shows the arc; marker ${dist.toFixed(2)} m ahead, on open floor (≤ 8 m)`);
    await page.evaluate(() => { window.__fx.press("selectend"); window.__fx.press("select"); });
    await page.waitForFunction(() => window.__MU.xrMove().teleports === 1 && window.__MU.xrMove().fade === 0, null, { timeout: 20000 });
    await frames(2);
    const after = await page.evaluate(() => ({ s: window.__MU.state(), m: window.__MU.xrMove() }));
    check(Math.hypot(after.s.x - aimed.marker[0], after.s.z - aimed.marker[1]) < 0.05, `release: the visitor's head lands on the marker (${after.s.x.toFixed(2)}, ${after.s.z.toFixed(2)})`);
    check(after.m.fadePeak >= 0.45 && after.m.fadePeak <= 0.9 + 1e-6 && after.m.vignettePeak === 0, `dip-to-dark on arrival (peak ${after.m.fadePeak}, never pure black); no vignette on a teleport`);

    // a tap is not a teleport
    await page.evaluate(() => { window.__fx.press("selectstart"); window.__fx.press("selectend"); });
    await frames(6);
    const tap = await page.evaluate(() => window.__MU.xrMove());
    check(tap.teleports === 1 && tap.taps === 1 && !tap.aiming, "a short press does not teleport");

    // snap turn: right stick, 30°, around the head, once per flick, 250 ms apart, with the vignette
    const s0 = await page.evaluate(() => window.__MU.state());
    await page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 1, 0]; });
    await page.waitForFunction(() => window.__MU.xrMove().snaps === 1, null, { timeout: 20000 });
    await frames(8);
    const s1 = await page.evaluate(() => ({ s: window.__MU.state(), m: window.__MU.xrMove() }));
    let dy = s1.s.yaw - s0.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
    check(s1.m.snaps === 1, "holding the stick over gives one snap, not a spin");
    check(Math.abs(dy + Math.PI / 6) < 0.01, `snap right turns 30° right (${(dy * 180 / Math.PI).toFixed(1)}°)`);
    check(Math.hypot(s1.s.x - s0.x, s1.s.z - s0.z) < 0.01, "the turn is about the head: the visitor does not slide");
    check(s1.m.vignettePeak >= 0.4 && s1.m.vignettePeak <= 0.6, `comfort vignette on the snap (peak ${s1.m.vignettePeak})`);
    await page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 0, 0]; });
    await frames(4);
    await page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, -1, 0]; });
    await page.waitForFunction(() => window.__MU.xrMove().snaps === 2, null, { timeout: 20000 });
    await page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 0, 0]; });
    await page.waitForFunction(() => window.__MU.xrMove().vignette === 0, null, { timeout: 20000 });
    check(true, "release and flick again: a second snap; the vignette clears");
    await exit();
    const gone = await page.evaluate(() => window.__MU.xr());
    check(gone.cameraChildren === 1 && gone.cameraParent === "Scene", `after exit the comfort overlays are gone from the view (camera children ${gone.cameraChildren})`);

    // aiming at a wall: crimson, NO WAY, and the release cancels
    await enterAt(st.x, st.z, probe.bad);
    const b0 = await page.evaluate(() => window.__MU.state()), m0 = await page.evaluate(() => window.__MU.xrMove());
    await page.evaluate(() => { window.__fx.ctrl.pitch = 0.15; window.__fx.press("selectstart"); });
    await page.waitForFunction(() => window.__MU.xrMove().aiming, null, { timeout: 20000 });
    await frames(2);
    const bad = await page.evaluate(() => window.__MU.xrMove());
    if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, "xr-aim-wall.png"), timeout: 120000 });
    await page.evaluate(() => window.__fx.press("selectend"));
    await frames(6);
    const b1 = await page.evaluate(() => ({ s: window.__MU.state(), m: window.__MU.xrMove() }));
    check(Math.hypot(bad.marker[0] - b0.x, bad.marker[1] - b0.z) > 3.2 && !bad.valid && b1.m.teleports === m0.teleports && b1.m.cancelled === m0.cancelled + 1 && Math.hypot(b1.s.x - b0.x, b1.s.z - b0.z) < 0.01, `aiming through a wall is refused (NO WAY) and the release cancels silently${JSON.stringify({ bad, b0: [b0.x, b0.z], b1: [b1.s.x, b1.s.z], m: b1.m })}`);
    await exit();
    check(await drawsFlat(page), "flat render loop draws after the movement checks");
    check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  console.log("7. standing or seated: the posture plaque, the eye height, the switch (simulated Quest 2)");
  {
    const posture = async (xr, label) => {
      const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr });
      const frames = (n) => page.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
      const H = () => page.evaluate(() => window.__MU.xrHeight());
      const enter = async () => {
        await page.evaluate(() => { window.__fx.head = { x: 0, z: 0, yaw: 0 }; window.__fx.ctrl = { x: 0.2, y: 1.3, z: -0.3, yaw: 0, pitch: -0.5 }; });
        await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });
        await page.waitForFunction(() => window.__MU.xr().presenting && window.__MU.xrMove().controllers === 1 && window.__MU.xrHeight().plaqueShown, null, { timeout: 30000 });
        await frames(3);
      };
      const exit = async () => { await page.evaluate(() => window.__MU.xrExit()); await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 15000 }); await page.waitForTimeout(200); };
      // point the controller (in the play space) at the plaque's centre
      const pointAtPlaque = () => page.evaluate(() => {
        const h = window.__MU.xrHeight(), [rx, ry, rz, th] = h.rig, [px, py, pz] = h.plaquePos, k = window.__fx.ctrl, fy = window.__fx.session.floor ? 0 : 1.6;
        const c = Math.cos(th), s = Math.sin(th), wx = rx + k.x * c + k.z * s, wy = ry + k.y - fy, wz = rz - k.x * s + k.z * c;
        let dx = px - wx, dy = py - wy, dz = pz - wz; const L = Math.hypot(dx, dy, dz); dx /= L; dy /= L; dz /= L;
        const lx = dx * c - dz * s, lz = dx * s + dz * c;
        k.pitch = Math.asin(dy); k.yaw = Math.atan2(-lx, -lz);
      });
      const tap = async () => { await page.evaluate(() => { window.__fx.press("selectstart"); window.__fx.press("selectend"); }); };
      return { ctx, page, errors, frames, H, enter, exit, pointAtPlaque, tap };
    };
    const headDist = (h) => Math.hypot(h.plaquePos[0] - h.rig[0], h.plaquePos[2] - h.rig[2]);
    const noteNow = (page) => page.evaluate(() => { const n = document.getElementById("mu-xr-note"); return n && !n.hidden ? n.textContent : null; });

    // a. standing, with the headset's floor
    {
      const t = await posture({ controller: true });
      const { page, errors, frames, H, enter, exit, pointAtPlaque, tap } = t;
      await enter();
      let h = await H();
      check(h.posture === "standing" && h.floor && Math.abs(h.eye - 1.6) < 0.02 && Math.abs(h.rigY) < 1e-6, `standing: eyes where the headset says (${h.eye} m), nothing added (rig ${h.rigY})`);
      check(h.title === "STANDING" && h.lines[0] === "Eyes 1.60 m above the floor" && /tap: sit$/.test(h.lines[h.lines.length - 1]), `plaque reads: ${h.title} / ${h.lines.join(" / ")}`);
      check(h.plaqueY >= 1.35 && h.plaqueY <= 1.55 && h.dist >= 0.8 && h.dist <= 2.5, `plaque centre ${h.plaqueY} m high (standing band 1.35–1.55), ${h.dist} m away (reading 0.8–2.5)`);
      check(h.bodyDeg >= 1.3 && h.titleDeg >= 1.8 && !h.overflow, `text size at 2 m: body ${h.bodyDeg}°, title ${h.titleDeg}° (≥ 1.3° / ≥ 1.8°), every line fits`);
      const hp = await page.evaluate(() => window.__MU.xrClear(window.__MU.xrHeight().rig[0], window.__MU.xrHeight().rig[2], window.__MU.xrHeight().plaquePos[0], window.__MU.xrHeight().plaquePos[2]));
      check(hp && headDist(h) > 0.7, "no wall between the visitor and the plaque");
      await pointAtPlaque(); await frames(3);
      h = await H();
      check(h.hover, "pointing at the plaque lights its border");
      if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, "xr-posture-standing.png"), timeout: 120000 });
      await tap();
      await page.waitForFunction(() => window.__MU.xrHeight().changes === 1 && window.__MU.xrMove().fade === 0, null, { timeout: 20000 });
      await frames(2);
      h = await H(); let m = await page.evaluate(() => window.__MU.xrMove()), eye = await page.evaluate(() => window.__MU.xr().eyeY);
      check(h.posture === "seated" && Math.abs(eye - 1.2) < 0.02 && h.title === "SEATED" && h.lines[0] === "Eyes set at 1.20 m", `tap: seated, eyes set at 1.2 m (${eye.toFixed(2)}); plaque reads ${h.title} / ${h.lines.join(" / ")}`);
      check(h.plaqueY >= 0.9 && h.plaqueY <= 1.1, `the plaque re-anchors to the seated band (${h.plaqueY} m)`);
      check(m.fadePeak >= 0.45 && m.fadePeak <= 0.9 + 1e-6 && m.teleports === 0 && m.vignettePeak === 0, `the change happens inside a dip to dark (peak ${m.fadePeak}), not a teleport`);
      if (process.env.SHOTS) { await pointAtPlaque(); await frames(3); await page.screenshot({ path: path.join(process.env.SHOTS, "xr-posture-seated.png"), timeout: 120000 }); }
      await pointAtPlaque(); await frames(2); await tap();
      await page.waitForFunction(() => window.__MU.xrHeight().changes === 2 && window.__MU.xrMove().fade === 0, null, { timeout: 20000 });
      await frames(2);
      h = await H(); eye = await page.evaluate(() => window.__MU.xr().eyeY);
      check(h.posture === "standing" && Math.abs(eye - 1.6) < 0.02 && Math.abs(h.rigY) < 1e-6, `tap again: standing, eyes back to the headset's ${eye.toFixed(2)} m`);
      // a tap pointing away from the plaque changes nothing
      await page.evaluate(() => { window.__fx.ctrl.yaw += Math.PI; }); await frames(2); await tap(); await frames(20);
      h = await H();
      check(h.changes === 2 && !h.hover, "a tap pointing elsewhere changes nothing");
      // the headset's floor set too high: the visitor's eyes measure low; the plaque and the page say so
      await page.evaluate(() => { window.__fx.headY = 1.15; }); await page.waitForTimeout(1600); await frames(3);
      h = await H();
      check(Math.abs(h.eye - 1.15) < 0.02 && h.lines.includes("Low? Reset the headset's floor"), `eyes measured low (${h.eye} m): plaque adds "${h.lines[1]}"`);
      await exit();
      const note = await noteNow(page);
      check(/^In VR you were standing, eyes 1\.15 m above the museum floor \(measured by the headset\)\. That is lower than most standing eyes/.test(note || ""), `after leaving, the page says: "${note}"`);
      const kept = await page.evaluate(() => localStorage.getItem("mu-vr-posture"));
      check(kept === "standing", `the choice is kept on this device (${kept})`);
      // seated, leave, come back: remembered
      await page.evaluate(() => { window.__fx.headY = 1.6; localStorage.setItem("mu-vr-posture", "seated"); });
      await enter();
      h = await H(); eye = await page.evaluate(() => window.__MU.xr().eyeY);
      check(h.posture === "seated" && Math.abs(eye - 1.2) < 0.02, `a remembered seated choice comes back on the next entry (eyes ${eye.toFixed(2)} m)`);
      await exit();
      const note2 = await noteNow(page);
      check(note2 === "In VR you were seated, eyes set at 1.20 m.", `after leaving: "${note2}"`);
      const cam = await page.evaluate(() => window.__MU.xr());
      check(cam.cameraParent === "Scene" && cam.cameraChildren === 1, "after exit the camera is back in the scene, nothing left on it");
      const shown = await page.evaluate(() => window.__MU.xrHeight().plaqueShown);
      check(!shown, "the plaque is put away with the session");
      check(await drawsFlat(page), "flat render loop draws after the posture checks");
      check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
      await t.ctx.close();
    }
    // b. a headset that gives no floor: declared seated; standing is a set height, said so
    {
      const t = await posture({ controller: true, noFloor: true });
      const { page, errors, frames, H, enter, exit, pointAtPlaque, tap } = t;
      await enter();
      let h = await H(), eye = await page.evaluate(() => window.__MU.xr().eyeY);
      check(h.posture === "seated" && !h.floor && Math.abs(eye - 1.2) < 0.02 && h.lines.includes("The headset gave no floor height"), `no floor: seated, eyes 1.2 m; plaque: ${h.title} / ${h.lines.join(" / ")}`);
      await pointAtPlaque(); await frames(3); await tap();
      await page.waitForFunction(() => window.__MU.xrHeight().changes === 1 && window.__MU.xrMove().fade === 0, null, { timeout: 20000 });
      await frames(2);
      h = await H(); eye = await page.evaluate(() => window.__MU.xr().eyeY);
      check(h.posture === "standing" && Math.abs(eye - 1.62) < 0.02 && h.lines[0] === "Eyes set at 1.62 m", `tap: standing at the museum's set eye height (${eye.toFixed(2)} m), said as set, not measured`);
      await exit();
      const note = await noteNow(page);
      check(note === "In VR you were standing, eyes set at 1.62 m (the headset gave no floor height).", `after leaving: "${note}"`);
      check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
      await t.ctx.close();
    }
    // c. entering face to a wall: the plaque goes where no wall stands between
    {
      const t = await posture({ controller: true });
      const { page, errors, enter, exit, H } = t;
      const st = await page.evaluate(() => window.__MU.state());
      // walk out from the start spot along some heading until a wall is about 1 m ahead, and stand there facing it
      const spot = await page.evaluate(([x, z]) => {
        for (let k = 0; k < 24; k++) {
          const y = k * Math.PI / 12, sx = -Math.sin(y), sz = -Math.cos(y);
          let r = 0.2; while (r < 8 && window.__MU.xrClear(x, z, x + sx * r, z + sz * r)) r += 0.1;
          if (r >= 8 || r < 1.6) continue;
          const px = x + sx * (r - 1.0), pz = z + sz * (r - 1.0);
          if (window.__MU.xrCanStand(px, pz, x, z)) return [px, pz, y];
        }
        return null;
      }, [st.x, st.z]);
      if (spot == null) check(false, "test setup: a spot about 1 m from a wall, facing it");
      else {
        await page.evaluate(([x, z, y]) => window.__MU.place(x, z, y, 0), spot);
        await enter();
        const h = await H();
        const ok = await page.evaluate(() => { const h = window.__MU.xrHeight(); const c = window.__MU.xrClear(h.rig[0], h.rig[2], h.plaquePos[0], h.plaquePos[2]); return c; });
        check(ok, `facing a wall on entry: the plaque stands clear of it (${h.dist} m away, at [${h.placed}])`);
        await exit();
      }
      check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
      await t.ctx.close();
    }
  }

  console.log("8. stick walking: opt-in, two confirmations, the Warden's envelope, walls (simulated Quest 2, two controllers)");
  {
    const openWalk = async (xr) => {
      const { ctx, page, errors } = await open(b, { width: 400, height: 300, ua: Q2, xr });
      const frames = (n) => page.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
      const W = () => page.evaluate(() => window.__MU.xrWalk());
      const M = () => page.evaluate(() => window.__MU.xrMove());
      const enterAt = async (x, z, yaw, n) => {
        await page.evaluate(([x, z, yaw]) => { window.__MU.place(x, z, yaw, 0); window.__fx.head = { x: 0, z: 0, yaw: 0 }; window.__fx.ctrl = { x: 0.2, y: 1.3, z: -0.3, yaw: 0, pitch: -0.5 }; window.__fx.source.gamepad.axes = [0, 0, 0, 0]; window.__fx.lsource.gamepad.axes = [0, 0, 0, 0]; }, [x, z, yaw]);
        await page.evaluate(() => document.exitPointerLock && document.exitPointerLock()); await page.click("#mu-vr-btn", { force: true });
        await page.waitForFunction((n) => window.__MU.xr().presenting && window.__MU.xrMove().controllers === n && window.__MU.xrWalk().shown, n, { timeout: 30000 });
        await frames(3);
      };
      const exit = async () => { await page.evaluate(() => window.__MU.xrExit()); await page.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 15000 }); await page.waitForTimeout(200); };
      // point the right controller (in the play space) at the walking plaque's centre
      const pointAtWalk = () => page.evaluate(() => {
        const h = window.__MU.xrHeight(), [rx, ry, rz, th] = h.rig, [px, py, pz] = window.__MU.xrWalk().pos, k = window.__fx.ctrl, fy = window.__fx.session.floor ? 0 : 1.6;
        const c = Math.cos(th), s = Math.sin(th), wx = rx + k.x * c + k.z * s, wy = ry + k.y - fy, wz = rz - k.x * s + k.z * c;
        let dx = px - wx, dy = py - wy, dz = pz - wz; const L = Math.hypot(dx, dy, dz); dx /= L; dy /= L; dz /= L;
        const lx = dx * c - dz * s, lz = dx * s + dz * c;
        k.pitch = Math.asin(dy); k.yaw = Math.atan2(-lx, -lz);
      });
      const tap = async () => { await pointAtWalk(); await frames(2); await page.evaluate(() => { window.__fx.press("selectstart"); window.__fx.press("selectend"); }); await frames(2); };
      return { ctx, page, errors, frames, W, M, enterAt, exit, tap };
    };
    const t = await openWalk({ controller: true, left: true });
    const { page, errors, frames, W, M, enterAt, exit, tap } = t;
    const st = await page.evaluate(() => window.__MU.state());
    // an open heading with about 4 m of floor ahead, and a walled one with a wall within about 3 m
    const probe = await page.evaluate(([x, z]) => {
      const out = { ok: null, bad: null };
      for (let k = 0; k < 48; k++) { const yaw = k * Math.PI / 24, sx = -Math.sin(yaw), sz = -Math.cos(yaw);
        let r = 0.2; while (r < 6 && window.__MU.xrCanStand(x + sx * r, z + sz * r, x, z)) r += 0.1;
        if (r >= 4.2 && out.ok == null) out.ok = yaw;
        if (r >= 1.2 && r <= 3.2 && out.bad == null) out.bad = yaw; }
      return out; }, [st.x, st.z]);
    check(probe.ok != null && probe.bad != null, `test setup: an open heading (${probe.ok}) and a walled one (${probe.bad}) from the start spot`);
    await page.evaluate(() => localStorage.removeItem("mu-vr-walk"));

    // a. a first session: stick walking is off; the left stick does not move the visitor
    await enterAt(st.x, st.z, probe.ok, 2);
    let w = await W(), m = await M();
    check(w.state === "off" && !w.on && !m.walk && w.title === "STICK WALKING" && /^Off: you move by teleport$/.test(w.lines[0]), `first session: stick walking off; walking plaque reads ${w.title} / ${w.lines.join(" / ")}`);
    const h0 = await page.evaluate(() => window.__MU.xrHeight());
    const wallFree = await page.evaluate(([a, b]) => window.__MU.xrClear(a[0], a[2], b[0], b[2]), [h0.rig, w.pos]);
    const dHead = Math.hypot(w.pos[0] - h0.rig[0], w.pos[2] - h0.rig[2]), dPlaques = Math.hypot(w.pos[0] - h0.plaquePos[0], w.pos[2] - h0.plaquePos[2]);
    check(wallFree && dHead >= 0.8 && dHead <= 2.5 && dPlaques > 1.5 && Math.abs(w.pos[1] - h0.plaquePos[1]) < 1e-6, `walking plaque beside the posture plaque (${dPlaques.toFixed(2)} m apart), ${dHead.toFixed(2)} m away, same height ${w.pos[1].toFixed(2)} m, no wall between`);
    check(w.bodyDeg >= 1.3 && w.titleDeg >= 1.8 && !w.overflow, `walking plaque text at 2 m: body ${w.bodyDeg}°, title ${w.titleDeg}°, every line fits`);
    const p0 = await page.evaluate(() => window.__MU.state());
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, -1]; }); await frames(20);
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, 0]; });
    const p1 = await page.evaluate(() => window.__MU.state()); m = await M();
    check(m.walked === 0 && Math.hypot(p1.x - p0.x, p1.z - p0.z) < 0.01 && m.snaps === 0, "with it off, pushing the left stick forward moves nothing (teleport is the way to move)");
    if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, "xr-walk-off.png"), timeout: 120000 });

    // b. turning it on: the request, then two deliberate confirmations
    await tap(); w = await W();
    check(w.state === "ask1" && w.title === "MORE INTENSE" && !(await M()).walk, `press 1: the plaque warns: ${w.title} / ${w.lines.join(" / ")}`);
    await tap(); w = await W();
    check(w.state === "ask1", "a press straight after (under half a second) is not taken as a confirmation");
    await page.waitForTimeout(650); await tap(); w = await W();
    check(w.state === "ask2" && !(await M()).walk && /\(2 of 2\)$/.test(w.lines[2]), `confirmation 1 of 2: ${w.lines.join(" / ")}`);
    await page.waitForTimeout(650); await tap(); w = await W(); m = await M();
    const kept = await page.evaluate(() => localStorage.getItem("mu-vr-walk"));
    check(w.state === "on" && m.walk && kept === "on" && w.lines[0] === "On: the left stick walks", `confirmation 2 of 2: on, kept on this device (${kept}); plaque: ${w.lines.join(" / ")}`);
    if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, "xr-walk-on.png"), timeout: 120000 });

    // c. walking: the ramp, the top speed, level, along the head's facing, the vignette, and stopping
    const a0 = await page.evaluate(() => ({ s: window.__MU.state(), rig: window.__MU.xrHeight().rig }));
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, -1]; });
    await frames(6);
    m = await M();
    check(m.speed > 0 && m.speed < 1.0 && m.vignette >= 0.4 && m.vignette <= 0.6, `speeding up gently, not at once: ${m.speed} m/s after six frames (each at most 50 ms), vignette ${m.vignette}`);
    await page.waitForFunction(() => window.__MU.xrMove().speed >= 1.99, null, { timeout: 60000 });
    const a1 = await page.evaluate(() => ({ s: window.__MU.state(), rig: window.__MU.xrHeight().rig, m: window.__MU.xrMove() }));
    const dx = a1.s.x - a0.s.x, dz = a1.s.z - a0.s.z, dist = Math.hypot(dx, dz);
    const along = (dx * -Math.sin(a0.s.yaw) + dz * -Math.cos(a0.s.yaw)) / (dist || 1);
    check(a1.m.speedPeak <= 2.0 + 1e-6 && a1.m.accelPeak <= 2.0 + 1e-3, `top speed ${a1.m.speedPeak} m/s (≤ 2.0), speeding up at ≤ ${a1.m.accelPeak} m/s² (0 → 2.0 over 1.0 s)`);
    check(dist >= 0.85 && dist <= 1.3, `reaching top speed took about a metre (${dist.toFixed(2)} m: 1.0 m for a 1 s ramp)`);
    check(along > 0.99, `the visitor goes the way the head faces (cos ${along.toFixed(4)})`);
    check(Math.abs(a1.rig[1] - a0.rig[1]) < 1e-9 && Math.abs(a1.rig[3] - a0.rig[3]) < 1e-9, "level: no height change, no turning from walking (horizon lock)");
    const walked0 = a1.m.walked;
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, 0]; });
    await page.waitForFunction(() => window.__MU.xrMove().speed === 0, null, { timeout: 60000 });
    m = await M();
    check(m.walked - walked0 <= 0.55 && m.accelPeak <= 4.0 + 1e-3, `letting go stops within ${(m.walked - walked0).toFixed(2)} m (≤ 0.5 m at 4 m/s²); no drifting on`);
    await page.waitForFunction(() => window.__MU.xrMove().vignette === 0, null, { timeout: 30000 });
    check(true, "the vignette clears once the visitor stops");
    // a resting thumb (inside the dead zone) does not creep
    const r0 = (await M()).walked;
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0.08, -0.1]; }); await frames(12);
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, 0]; });
    check((await M()).walked === r0, "a thumb resting on the stick (inside the dead zone) does not creep");

    // d. with walking on: the right stick still snap-turns, and the trigger still aims a teleport
    const n0 = (await M()).snaps;
    await page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 1, 0]; });
    await page.waitForFunction((n0) => window.__MU.xrMove().snaps === n0 + 1, n0, { timeout: 20000 });
    await page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 0, 0]; }); await frames(4);
    check(true, "right stick: still a 30° snap turn");
    await page.evaluate(() => { window.__fx.ctrl = { x: 0.2, y: 1.3, z: -0.3, yaw: 0, pitch: -0.5 }; window.__fx.press("selectstart"); });
    await page.waitForFunction(() => window.__MU.xrMove().aiming, null, { timeout: 20000 });
    await page.evaluate(() => window.__fx.press("selectend")); await frames(6);
    check(!(await M()).aiming, "trigger: teleport aiming still works beside stick walking");
    await exit();

    // e. a remembered choice comes back; walking into a wall stops at it (or slides along it), never through
    await enterAt(st.x, st.z, probe.bad, 2);
    w = await W(); m = await M();
    check(w.state === "on" && m.walk, "next entry: the device's confirmed choice comes back (on), no new confirmations");
    const b0 = await page.evaluate(() => window.__MU.state());
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, -1]; });
    await page.waitForFunction(() => window.__MU.xrMove().blocked > 0, null, { timeout: 90000 });
    await frames(30);
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, 0]; });
    await page.waitForFunction(() => window.__MU.xrMove().speed === 0, null, { timeout: 60000 });
    const b1 = await page.evaluate(() => window.__MU.state());
    const through = !(await page.evaluate(([a, c]) => window.__MU.xrClear(a.x, a.z, c.x, c.z), [b0, b1]));
    const stand = await page.evaluate(([c]) => window.__MU.xrCanStand(c.x, c.z, c.x, c.z), [b1]);
    check(!through && stand, `walking at a wall: stopped or slid along it, never through (${Math.hypot(b1.x - b0.x, b1.z - b0.z).toFixed(2)} m, still on open floor)`);

    // f. turning it off is one press
    await tap(); w = await W(); m = await M();
    const off = await page.evaluate(() => localStorage.getItem("mu-vr-walk"));
    check(w.state === "off" && !m.walk && off === "off", `one press turns it off (kept: ${off})`);
    const q0 = await page.evaluate(() => window.__MU.state());
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, -1]; }); await frames(12);
    await page.evaluate(() => { window.__fx.lsource.gamepad.axes = [0, 0, 0, 0]; });
    const q1 = await page.evaluate(() => window.__MU.state());
    check(Math.hypot(q1.x - q0.x, q1.z - q0.z) < 0.01, "off again: the left stick moves nothing");
    // a request left unanswered is dropped
    await tap(); w = await W();
    check(w.state === "ask1", "a new request shows the warning");
    await page.waitForFunction(() => window.__MU.xrWalk().state === "off", null, { timeout: 90000 });
    check(!(await M()).walk, "unanswered for 10 seconds: back to off");
    await exit();
    const gone = await page.evaluate(() => ({ x: window.__MU.xr(), w: window.__MU.xrWalk() }));
    check(!gone.w.shown && gone.x.cameraParent === "Scene" && gone.x.cameraChildren === 1, "after exit the walking plaque is put away; nothing left on the camera");
    check(await drawsFlat(page), "flat render loop draws after the walking checks");
    check(errors.length === 0, `0 script errors${errors.length ? " — " + errors.join(" | ") : ""}`);
    await t.ctx.close();

    // g. only a right-hand controller, stick walking kept on: the plaque says it needs the left one; the stick turns
    const u = await openWalk({ controller: true });
    await u.page.evaluate(() => localStorage.setItem("mu-vr-walk", "on"));
    const s2 = await u.page.evaluate(() => window.__MU.state());
    await u.enterAt(s2.x, s2.z, s2.yaw, 1);
    const w2 = await u.W();
    check(w2.state === "on" && w2.lines[0] === "On: needs the left controller", `one right controller only: plaque reads "${w2.lines[0]}"`);
    const n1 = (await u.M()).snaps;
    await u.page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 1, 0]; });
    await u.page.waitForFunction((n) => window.__MU.xrMove().snaps === n + 1, n1, { timeout: 20000 });
    await u.page.evaluate(() => { window.__fx.source.gamepad.axes = [0, 0, 0, 0]; });
    check((await u.M()).walked === 0, "its stick still snap-turns and walks nowhere");
    await u.exit();
    check(u.errors.length === 0, `0 script errors${u.errors.length ? " — " + u.errors.join(" | ") : ""}`);
    await u.ctx.close();
  }

  await b.close(); srv.close();
  console.log(fails.length ? `\n${fails.length} check(s) failed` : "\nall XR entry checks passed");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); srv.close(); process.exit(1); });
