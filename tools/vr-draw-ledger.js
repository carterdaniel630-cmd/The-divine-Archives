// usage: node tools/vr-draw-ledger.js [docs] [out.json] [place]   (needs Playwright; headless, SwiftShader)
//        place: a teleport target as tools/vr-frame-budget.js uses them (default "@02-bronze-age": the Wing II corridor
//        view, the one the harness finds over the hard lines), optionally "target+metres" to walk in from the arrival spot.
// The VR draw ledger (VR-STATUS Next: "measure what the corridor draws, which meshes, per view, before choosing a fix").
// tools/vr-frame-budget.js says HOW MUCH a view costs; this says WHAT it is made of. It enters the museum in the same
// stand-in headset (tools/xr-standin.js: simulated Quest 2, floor tier), stands at one place, turns through the same eight
// headings, and at every view records each draw the renderer submits, by wrapping renderer.renderBufferDirect (three.js's
// one entry point for a draw) through the devtools hook, as the harness does — no change to the site. For every draw:
//   - triangles, read as the change in renderer.info.render.triangles across that one call (so drawRange, groups and
//     instancing are counted exactly as the frame-budget harness counts them), and which pass (each eye, or other);
//   - the object: type, name, its chain of named parents, material type and name, instance count;
//   - where it stands: the zone it belongs to (the scene child whose own "decor-<zone>" child names it), the plan cell
//     (portals.js) its world bounding-box centre falls in, the cells its box overlaps, and its distance from the head;
//   - whether that cell is in the portal set the headset sees from here (window.__MU.portals().cull).
// Output: per heading, the totals and the top draws; over all headings, each object's worst-view cost, and roll-ups by
// zone, by cell, by named group and by object type. Counts only: frame time is never measured here (SwiftShader).
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { fakeXR } = require("./xr-standin");
const ROOT = process.argv[2] || "docs", OUT = process.argv[3] || null, PLACE = process.argv[4] || "@02-bronze-age", PORT = +process.env.PORT || 8798;
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".glb": "model/gltf-binary" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
const Q2 = "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/36.0 Chrome/126.0 VR Safari/537.36";
const HEADINGS = 8;

// runs in the page before the museum loads: find the renderer through three.js's devtools hook and wrap its draw call.
// Recording is off until the harness arms it for one frame (window.__dl.arm()).
function watchDraws() {
  const dl = (window.__dl = { r: null, scene: null, rec: null, want: 0 });
  window.__THREE_DEVTOOLS__ = new EventTarget();
  window.__THREE_DEVTOOLS__.addEventListener("observe", (e) => {
    const r = e.detail; if (!r || !r.isWebGLRenderer || typeof r.render !== "function" || dl.r) return;
    dl.r = r;
    const render = r.render;
    r.render = function (scene, camera) {
      const presenting = r.xr && r.xr.isPresenting;
      if (presenting) dl.scene = scene;
      if (presenting && dl.want > 0 && !dl.rec) { dl.rec = { draws: [], eyes: (r.xr.getCamera().cameras || []).slice() }; }
      const out = render.call(this, scene, camera);
      if (dl.rec && dl.rec.draws) { dl.want--; dl.last = { draws: dl.rec.draws, calls: r.info.render.calls, tris: r.info.render.triangles }; dl.rec = null; }
      return out;
    };
    const rbd = r.renderBufferDirect;
    r.renderBufferDirect = function (cam, scene, geometry, material, object, group) {
      if (!dl.rec) return rbd.apply(this, arguments);
      const t0 = r.info.render.triangles, c0 = r.info.render.calls;
      const out = rbd.apply(this, arguments);
      const eye = dl.rec.eyes.indexOf(cam);
      dl.rec.draws.push({ object, material, group: group ? group.materialIndex : null, tris: r.info.render.triangles - t0, calls: r.info.render.calls - c0, pass: eye >= 0 ? "eye" + eye : (cam && cam.type) || "?" });
      return out;
    };
  });
  dl.arm = () => { dl.last = null; dl.want = 1; };
}
// runs in the page: turn the last recorded frame into plain records
function describeFrame() {
  const dl = window.__dl, f = dl.last; if (!f) return null;
  const P = window.__MU.portals(), cells = P ? P.cells : [], cull = P ? P.cull : null;
  const inside = (c, x, z) => c.kind === "round" ? Math.hypot(x - c.cx, z - c.cz) < c.r : x > c.x0 && x < c.x1 && z > c.z0 && z < c.z1;
  const cellAt = (x, z) => { for (const c of cells) if (inside(c, x, z)) return c.id; return null; };
  const overlaps = (b) => cells.filter((c) => c.kind === "round" ? (Math.max(b.min.x, Math.min(c.cx, b.max.x)) - c.cx) ** 2 + (Math.max(b.min.z, Math.min(c.cz, b.max.z)) - c.cz) ** 2 < c.r * c.r : b.min.x < c.x1 && b.max.x > c.x0 && b.min.z < c.z1 && b.max.z > c.z0).map((c) => c.id);
  const head = dl.r.xr.getCamera().position;
  const zoneOf = (o) => { let p = o; while (p && p.parent && p.parent !== dl.scene) p = p.parent; if (!p || p.parent !== dl.scene) return "(not in scene)";
    const d = p.children.find((c) => c.name && c.name.indexOf("decor-") === 0); return d ? d.name.slice(6) : (p.name || p.type) + " #" + dl.scene.children.indexOf(p); };
  const rootOf = (o) => { let p = o; while (p && p.parent && p.parent !== dl.scene) p = p.parent; return p && p.parent === dl.scene ? p : null; };
  const pathOf = (o) => { const n = []; for (let p = o; p && p.parent && p !== dl.scene; p = p.parent) n.push(p.parent.children.indexOf(p)); return n.reverse().join("."); };
  const chain = (o) => { const n = []; for (let p = o.parent; p && p !== dl.scene; p = p.parent) if (p.name) n.push(p.name); return n.join(" < "); };
  const cache = new Map(), recs = new Map();
  for (const d of f.draws) {
    const o = d.object, key = o.uuid + (d.group == null ? "" : "#" + d.group);
    let info = cache.get(o);
    if (!info) {
      let box = null;
      try {
        if (o.isInstancedMesh) { if (!o.boundingBox) o.computeBoundingBox(); box = o.boundingBox.clone().applyMatrix4(o.matrixWorld); }
        else if (o.geometry) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); box = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld); }
      } catch (e) { box = null; }
      const cx = box ? (box.min.x + box.max.x) / 2 : null, cz = box ? (box.min.z + box.max.z) / 2 : null;
      const cell = box ? cellAt(cx, cz) : null;
      const m = Array.isArray(o.material) ? o.material : [o.material];
      info = { type: o.type, name: o.name || "", chain: chain(o), zone: zoneOf(o), material: m.map((x) => x ? x.type + (x.name ? " " + x.name : "") : "?").join(", "), geometry: o.geometry ? o.geometry.type : null,
        sceneChild: (() => { const r = rootOf(o); return r ? dl.scene.children.indexOf(r) : null; })(), path: pathOf(o), userData: Object.keys(o.userData || {}).join(","),
        transparent: m.some((x) => x && x.transparent), renderOrder: o.renderOrder, frustumCulled: o.frustumCulled,
        // the sphere three.js tests against the view frustum (world space): an InstancedMesh's own, else its geometry's
        cullSphere: (() => { const bs = o.isInstancedMesh ? o.boundingSphere : (o.geometry && o.geometry.boundingSphere); if (!bs) return null; const c = bs.center.clone().applyMatrix4(o.matrixWorld); return { centre: [+c.x.toFixed(2), +c.y.toFixed(2), +c.z.toFixed(2)], r: +(bs.radius * o.matrixWorld.getMaxScaleOnAxis()).toFixed(2) }; })(), instances: o.isInstancedMesh ? o.count : null,
        centre: box ? [+cx.toFixed(2), +((box.min.y + box.max.y) / 2).toFixed(2), +cz.toFixed(2)] : null, size: box ? [+(box.max.x - box.min.x).toFixed(2), +(box.max.y - box.min.y).toFixed(2), +(box.max.z - box.min.z).toFixed(2)] : null,
        cell, cellSeen: cull ? (cell ? cull.includes(cell) : null) : null, spans: box ? overlaps(box) : [], dist: box ? +Math.hypot(cx - head.x, cz - head.z).toFixed(1) : null,
        geometryTris: o.geometry ? Math.round((o.geometry.index ? o.geometry.index.count : (o.geometry.attributes.position ? o.geometry.attributes.position.count : 0)) / 3) : null };
      cache.set(o, info);
    }
    let r = recs.get(key);
    if (!r) recs.set(key, (r = Object.assign({ key, materialIndex: d.group, tris: 0, calls: 0, passes: {} }, info)));
    r.tris += d.tris; r.calls += d.calls; r.passes[d.pass] = (r.passes[d.pass] || 0) + 1;
  }
  return { calls: f.calls, tris: f.tris, drawsRecorded: f.draws.length, trisRecorded: f.draws.reduce((a, d) => a + d.tris, 0), cull, head: [+head.x.toFixed(2), +head.z.toFixed(2)], records: [...recs.values()] };
}

(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await b.newContext({ viewport: { width: 400, height: 300 }, deviceScaleFactor: 1, userAgent: Q2 });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.addInitScript(fakeXR, {});
  await page.addInitScript(watchDraws);
  await page.addInitScript(`window.__dlDescribe = ${describeFrame.toString()};`);
  await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  await page.evaluate(() => { const e = document.getElementById("mu-enter"); if (e && !e.closest("[hidden]")) e.click(); });
  await page.waitForTimeout(1000);
  const frames = (n) => page.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
  const settle = async () => { const t0 = Date.now(); while (Date.now() - t0 < 90000) { if ((await page.evaluate(() => window.__MU.relicsPending())) === 0) break; await page.waitForTimeout(500); } await page.waitForTimeout(1500); };

  const [target, inward] = PLACE.split("+"), d = +inward || 0;
  await page.evaluate(([t, d]) => { window.__MU.teleport(t); if (d) { const s = window.__MU.state(); window.__MU.place(s.x - Math.sin(s.yaw) * d, s.z - Math.cos(s.yaw) * d, s.yaw, 0); } }, [target, d]);
  await settle();
  await page.evaluate(() => { window.__fx.head = { x: 0, z: 0, yaw: 0 }; document.exitPointerLock && document.exitPointerLock(); });
  await page.click("#mu-vr-btn", { force: true, timeout: 120000 });
  await page.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 20000 });
  await frames(4);

  const views = [];
  for (let k = 0; k < HEADINGS; k++) {
    await page.evaluate((yaw) => { window.__fx.head = { x: 0, z: 0, yaw }; }, (k * 2 * Math.PI) / HEADINGS);
    await frames(4);
    await page.evaluate(() => window.__dl.arm());
    await page.waitForFunction(() => !!window.__dl.last, null, { timeout: 20000 });
    const v = await page.evaluate(() => Object.assign(window.__dlDescribe(), { where: window.__MU.state().where }));
    v.heading = Math.round((k * 360) / HEADINGS);
    views.push(v);
  }
  await page.evaluate(() => window.__MU.xrExit());

  // roll-ups: each object's worst-view cost; then by zone, cell, group and type, summed over objects at the worst view
  const worstView = views.reduce((a, v) => (v.tris > a.tris ? v : a), views[0]);
  const byKey = new Map();
  for (const v of views) for (const r of v.records) { const w = byKey.get(r.key); if (!w || r.tris > w.tris) byKey.set(r.key, Object.assign({}, r, { worstHeading: v.heading, seenIn: (w ? w.seenIn : 0) + 1 })); else w.seenIn++; }
  const objects = [...byKey.values()].sort((a, b) => b.tris - a.tris);
  const roll = (recs, keyf) => { const m = new Map(); for (const r of recs) { const k = keyf(r); const e = m.get(k) || { key: k, tris: 0, calls: 0, draws: 0 }; e.tris += r.tris; e.calls += r.calls; e.draws++; m.set(k, e); } return [...m.values()].sort((a, b) => b.tris - a.tris); };
  const W = worstView.records;
  const group1 = (r) => (r.chain ? r.chain.split(" < ")[0] : "(no named parent)");
  const res = {
    root: ROOT, place: PLACE, where: views[0].where, head: views[0].head, cull: views[0].cull, errors,
    device: "stand-in Quest 2 (floor tier), SwiftShader; same headset model as tools/vr-frame-budget.js",
    perHeading: views.map((v) => ({ heading: v.heading, calls: v.calls, tris: v.tris, drawsRecorded: v.drawsRecorded, trisRecorded: v.trisRecorded, top: v.records.slice().sort((a, b) => b.tris - a.tris).slice(0, 12).map((r) => ({ tris: r.tris, calls: r.calls, zone: r.zone, cell: r.cell, cellSeen: r.cellSeen, dist: r.dist, type: r.type, name: r.name, group: group1(r), material: r.material })) })),
    worstHeading: worstView.heading,
    atWorst: { byZone: roll(W, (r) => r.zone), byCell: roll(W, (r) => r.cell || "(outside every cell)"), byGroup: roll(W, (r) => r.zone + " / " + group1(r)), byType: roll(W, (r) => r.type + (r.instances != null ? " (instanced)" : "")), byCellSeen: roll(W, (r) => r.cellSeen == null ? "no cell / no cull" : r.cellSeen ? "cell in the seen set" : "cell NOT in the seen set") },
    objects
  };
  console.log(`place ${PLACE} (${res.where}); head ${res.head}; cells seen: ${res.cull ? res.cull.join(", ") : "(no culling)"}`);
  for (const v of views) console.log(`  heading ${String(v.heading).padStart(3)}°  calls ${String(v.calls).padStart(4)}  tris ${String(v.tris).padStart(7)}  (recorded ${v.drawsRecorded} draws, ${v.trisRecorded} tris)`);
  const show = (title, rows, n) => { console.log(`\n${title} (worst heading ${worstView.heading}°, ${worstView.tris} tris, ${worstView.calls} calls)`); rows.slice(0, n).forEach((e) => console.log(`  ${String(e.tris).padStart(7)} tris  ${String(e.calls).padStart(4)} calls  ${String(e.draws).padStart(4)} objects  ${e.key}`)); };
  show("By zone", res.atWorst.byZone, 20); show("By plan cell", res.atWorst.byCell, 20); show("By zone / named group", res.atWorst.byGroup, 25); show("By object type", res.atWorst.byType, 12); show("By whether the cell is seen", res.atWorst.byCellSeen, 4);
  console.log("\nHeaviest objects (worst view of each):");
  objects.slice(0, 25).forEach((r) => console.log(`  ${String(r.tris).padStart(7)} tris  ${String(r.calls).padStart(3)} calls  ${r.zone} / ${group1(r)}  ${r.type}${r.name ? " " + r.name : ""}  [${r.material}]  cell ${r.cell}${r.cellSeen === false ? " (NOT seen)" : ""}  ${r.dist} m${r.instances != null ? "  ×" + r.instances : ""}`));
  console.log(errors.length ? `\nscript errors: ${errors.join(" | ")}` : "\n0 script errors");
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  await b.close(); srv.close();
  process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error(e); srv.close(); process.exit(1); });
