// usage: node tools/xr-portal-check.js [docs]   (needs Playwright; headless)
// Checks the headset's portal culling (docs/museum/portals.js; handoff/vr-performance-budget.md §5) against the real
// building, so that culling can only ever hide what the walls already hide:
//  1. flat screen: nothing is culled (the cull set is null) — the flat museum is exactly as before;
//  2. ray sweep: from a grid of points in every cell (and either side of every door), rays in every direction are run
//     through the building's own walls (app.js WALLS, as built). Every cell a ray reaches before its first wall must be
//     in the set portals.js gives for that point with no margin. One miss fails the check;
//  3. containment: every drawn thing of a zone (its shell: floors, walls, fittings; its exhibits, room by room) must
//     stand in that zone's own cells (a room's exhibits in that room, or the strip of corridor under its door sign),
//     since culling shows or hides it with them. The two seams this allows are named below, with why each is safe;
//  4. in the stand-in headset: the set is on and changes as the visitor moves (Rotunda, ch02, ch03, the Wing II corridor).
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { fakeXR } = require("./xr-standin");
const ROOT = process.argv[2] || "docs", PORT = +process.env.PORT || 8803;
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".glb": "model/gltf-binary" };
const srv = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); if (p.endsWith("/")) p += "index.html"; const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); }).listen(PORT);
const Q2 = "Mozilla/5.0 (X11; Linux x86_64; Quest 2) AppleWebKit/537.36 (KHTML, like Gecko) OculusBrowser/36.0 Chrome/126.0 VR Safari/537.36";
let failed = 0;
const check = (ok, msg) => { console.log((ok ? "  ok   " : "  FAIL ") + msg); if (!ok) failed++; };

// ---- the sweep (in Node, against the walls the page built)
function sweep(G, cells, walls) {
  const B = 4, grid = new Map(), key = (i, j) => i + "," + j;
  walls.forEach((w, n) => { const [ax, az, bx, bz] = w; for (let i = Math.floor(Math.min(ax, bx) / B); i <= Math.floor(Math.max(ax, bx) / B); i++) for (let j = Math.floor(Math.min(az, bz) / B); j <= Math.floor(Math.max(az, bz) / B); j++) { const k = key(i, j); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(n); } });
  // the first wall along a ray (grid walk), or Infinity
  function firstHit(x, z, dx, dz, maxT) {
    let i = Math.floor(x / B), j = Math.floor(z / B); const si = dx > 0 ? 1 : -1, sj = dz > 0 ? 1 : -1;
    let tx = dx ? ((dx > 0 ? (i + 1) * B : i * B) - x) / dx : Infinity, tz = dz ? ((dz > 0 ? (j + 1) * B : j * B) - z) / dz : Infinity;
    const ddx = dx ? B / Math.abs(dx) : Infinity, ddz = dz ? B / Math.abs(dz) : Infinity;
    let best = Infinity, t0 = 0;
    for (let guard = 0; guard < 400 && t0 < maxT; guard++) {
      for (const n of grid.get(key(i, j)) || []) {
        const [ax, az, bx, bz] = walls[n], ex = bx - ax, ez = bz - az, den = dx * ez - dz * ex; if (Math.abs(den) < 1e-12) continue;
        const t = ((ax - x) * ez - (az - z) * ex) / den, u = ((ax - x) * dz - (az - z) * dx) / den;
        if (t > 1e-6 && u >= -1e-9 && u <= 1 + 1e-9 && t < best) best = t;
      }
      const tn = Math.min(tx, tz); if (best <= tn) return best;
      t0 = tn; if (tx < tz) { tx += ddx; i += si; } else { tz += ddz; j += sj; }
    }
    return best;
  }
  // cells the segment from (x, z) to t along (dx, dz) passes into by at least EPS
  const EPS = 0.01;
  function cellsOn(x, z, dx, dz, t, out) {
    for (const c of cells) {
      if (c.kind === "round") { const px = c.cx - x, pz = c.cz - z, s = Math.max(0, Math.min(t, px * dx + pz * dz)), qx = x + dx * s - c.cx, qz = z + dz * s - c.cz; if (Math.hypot(qx, qz) < c.r - EPS) out.add(c.id); continue; }
      let lo = 0, hi = t; const x0 = c.x0 + EPS, x1 = c.x1 - EPS, z0 = c.z0 + EPS, z1 = c.z1 - EPS;
      if (Math.abs(dx) < 1e-12) { if (x <= x0 || x >= x1) continue; } else { let a = (x0 - x) / dx, b = (x1 - x) / dx; if (a > b) [a, b] = [b, a]; lo = Math.max(lo, a); hi = Math.min(hi, b); }
      if (Math.abs(dz) < 1e-12) { if (z <= z0 || z >= z1) continue; } else { let a = (z0 - z) / dz, b = (z1 - z) / dz; if (a > b) [a, b] = [b, a]; lo = Math.max(lo, a); hi = Math.min(hi, b); }
      if (hi > lo) out.add(c.id);
    }
  }
  // the points: a grid in every cell, inset from its walls, and points either side of every door
  const pts = [], STEP = 1.25, IN = 0.12, RAYS = 2048;
  for (const c of cells) {
    if (c.kind === "round") { for (let x = c.cx - c.r; x <= c.cx + c.r; x += STEP) for (let z = c.cz - c.r; z <= c.cz + c.r; z += STEP) if (Math.hypot(x - c.cx, z - c.cz) < c.r - 0.6) pts.push([x, z]); continue; }
    for (let x = c.x0 + IN; x <= c.x1 - IN + 1e-9; x += Math.min(STEP, (c.x1 - c.x0 - 2 * IN) / Math.max(1, Math.round((c.x1 - c.x0 - 2 * IN) / STEP)))) for (let z = c.z0 + IN; z <= c.z1 - IN + 1e-9; z += Math.min(STEP, (c.z1 - c.z0 - 2 * IN) / Math.max(1, Math.round((c.z1 - c.z0 - 2 * IN) / STEP)))) pts.push([x, z]);
    for (const d of c.doors) { const mx = (d[0] + d[2]) / 2, mz = (d[1] + d[3]) / 2, ux = d[2] - d[0], uz = d[3] - d[1], L = Math.hypot(ux, uz), nx = -uz / L, nz = ux / L;
      for (const f of [-0.45, 0, 0.45]) for (const o of [-0.3, -0.06, 0.06, 0.3]) pts.push([mx + ux * f * 0.9 + nx * o, mz + uz * f * 0.9 + nz * o]); }
  }
  let rays = 0, points = 0, misses = []; const seen = new Set();
  for (const [x, z] of pts) {
    const vis = G.visible(x, z, 0); if (!vis) continue;     // outside every cell (a door's own thickness): nothing culled there
    points++;
    for (let k = 0; k < RAYS; k++) {
      const a = (k + 0.5) / RAYS * Math.PI * 2, dx = Math.cos(a), dz = Math.sin(a), t = Math.min(firstHit(x, z, dx, dz, 160), 160);
      seen.clear(); cellsOn(x, z, dx, dz, t, seen); rays++;
      for (const id of seen) if (!vis.has(id)) { misses.push({ from: [+x.toFixed(2), +z.toFixed(2)], cell: G.cellAt(x, z).id, ray: +a.toFixed(4), reaches: id }); break; }
    }
  }
  return { rays, points, misses };
}

(async () => {
  const { createPortals } = await import(path.resolve(ROOT, "museum/portals.js"));
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__MU && window.__MU.portals && window.__MU.portals(), null, { timeout: 60000 });

  console.log("1. flat screen: nothing culled");
  const P = await page.evaluate(() => window.__MU.portals());
  check(P.cull === null, "no headset: the cull set is null");
  check(P.cells.length > 20 && P.walls.length > 100, `the plan: ${P.cells.length} cells, ${P.cells.reduce((n, c) => n + c.doors.length, 0) / 2} doors, ${P.walls.length} wall pieces`);

  // the same graph in Node, from the page's own cells
  const G = createPortals(), byId = new Map(P.cells.map((c) => [c.id, c]));
  for (const c of P.cells) c.kind === "round" ? G.round(c.id, c.zone, c.cx, c.cz, c.r) : G.rect(c.id, c.zone, c.x0, c.x1, c.z0, c.z1);
  const doneDoor = new Set();
  for (const c of P.cells) for (const d of c.doors) { const k = d.join(","); if (doneDoor.has(k)) continue; doneDoor.add(k); G.door(d[4], d[5], d[0], d[1], d[2], d[3]); }

  console.log("2. ray sweep through the real walls (no margin)");
  const t0 = Date.now(), R = sweep(G, P.cells, P.walls);
  check(R.misses.length === 0, `${R.rays.toLocaleString("en")} rays from ${R.points.toLocaleString("en")} points: ${R.misses.length} reached a cell the set left out (${((Date.now() - t0) / 1000).toFixed(0)} s)` + (R.misses.length ? "\n" + R.misses.slice(0, 12).map((m) => "         " + JSON.stringify(m)).join("\n") : ""));

  console.log("3. containment: what each zone draws stands in its own cells");
  // build the pilot zones' exhibits (the Rotunda, Wing II with ch02 and ch03) and the zones round them
  for (const t of ["@rotunda", "ch02", "ch03"]) {
    await page.evaluate((id) => window.__MU.teleport(id), t); await page.waitForTimeout(3000);
    const t1 = Date.now(); while (Date.now() - t1 < 90000 && (await page.evaluate(() => window.__MU.relicsPending())) > 0) await page.waitForTimeout(500);   // relics stream in one per frame
  }
  const owners = await page.evaluate(() => window.__MU.portalOwners(1500));
  const IN = 0.03;
  const inCell = (c, x, z) => c.kind === "round" ? Math.hypot(x - c.cx, z - c.cz) < c.r - IN : x > c.x0 + IN && x < c.x1 - IN && z > c.z0 + IN && z < c.z1 - IN;
  const cellAt = (x, z) => { for (const c of P.cells) if (inCell(c, x, z)) return c; return null; };
  // seams allowed, each safe by construction:
  //  - the Spine's shell in a wing corridor: its door frames stand 0.21 m into the corridor; app.js keeps the Spine's
  //    shell whenever any corridor is seen (zoneSeen);
  //  - the Spine's shell in the Rotunda: the strip of floor in the doorway (within 0.5 m of the Spine's end line); a ray
  //    that sees it crosses that line at once, inside the Rotunda–Spine door (the Spine's whole end), so the Spine is listed;
  //  - a room's exhibits in its corridor: the door sign, within 0.1 m of the door line and its 3.4 m width, which is the
  //    width the room's door is given in the graph
  const doorOf = (room) => { const c = byId.get(room); return c && c.doors[0]; };
  const allowed = (o, c, x, z) => {
    if (o.part === "shell" && o.zone === "spine" && c.id.indexOf("cor:") === 0) return "spine frame";
    if (o.part === "shell" && o.zone === "spine" && c.id === "rotunda" && z < -26 + 0.5 && Math.abs(x) < 4) return "spine doorway floor";
    if (o.part === "exhibits" && o.room && c.id.indexOf("cor:") === 0) { const d = doorOf(o.room); if (d && Math.abs(z - d[1]) < 0.1 && x >= Math.min(d[0], d[2]) - 1e-6 && x <= Math.max(d[0], d[2]) + 1e-6) return "door sign"; }
    return null;
  };
  let pts = 0, bad = [], seams = {};
  for (const o of owners) for (let i = 0; i < o.pts.length; i += 2) {
    const x = o.pts[i], z = o.pts[i + 1], c = cellAt(x, z); pts++;
    if (!c) continue;                                                    // in a wall's own line or outside: no cell to be culled with
    const own = o.part === "exhibits" && o.room && byId.has(o.room) ? c.id === o.room : c.zone === o.zone;
    if (own) continue;
    const why = allowed(o, c, x, z);
    if (why) { seams[why] = (seams[why] || 0) + 1; continue; }
    bad.push({ zone: o.zone, part: o.part, room: o.room, name: o.name, at: [x, z], in: c.id });
  }
  const zonesBuilt = [...new Set(owners.filter((o) => o.part === "exhibits").map((o) => o.zone))].sort();
  check(bad.length === 0, `${pts.toLocaleString("en")} points of ${owners.length} drawn objects (exhibits built: ${zonesBuilt.join(", ")}): ${bad.length} outside their cells; seams allowed: ${JSON.stringify(seams)}` + (bad.length ? "\n" + bad.slice(0, 12).map((b) => "         " + JSON.stringify(b)).join("\n") : ""));
  await ctx.close();

  console.log("4. in the stand-in headset (simulated Quest 2)");
  const xctx = await browser.newContext({ viewport: { width: 400, height: 300 }, deviceScaleFactor: 1, userAgent: Q2 });
  const xp = await xctx.newPage();
  xp.on("pageerror", (e) => errors.push(String(e)));
  await xp.addInitScript(fakeXR, {});
  await xp.goto(`http://localhost:${PORT}/museum.html`, { waitUntil: "load" });
  await xp.waitForFunction(() => window.__MU && window.__MU.state().built.length > 0, null, { timeout: 120000 });
  await xp.evaluate(() => { const e = document.getElementById("mu-enter"); if (e && !e.closest("[hidden]")) e.click(); });
  await xp.waitForTimeout(1000);
  const frames = (n) => xp.evaluate((n) => new Promise((ok) => { const f0 = window.__fx.frames; const w = () => (window.__fx.frames - f0 >= n ? ok() : setTimeout(w, 30)); w(); }), n);
  // teleported on the flat screen, then into the headset there (as tools/vr-frame-budget.js does)
  const at = async (target) => {
    await xp.evaluate((t) => window.__MU.teleport(t), target); await xp.waitForTimeout(1500);
    await xp.evaluate(() => { window.__fx.head = { x: 0, z: 0, yaw: 0 }; document.exitPointerLock && document.exitPointerLock(); });
    await xp.click("#mu-vr-btn", { force: true, timeout: 120000 });
    await xp.waitForFunction(() => window.__MU.xr().presenting, null, { timeout: 20000 }); await frames(6);
    const r = await xp.evaluate(() => ({ s: window.__MU.state(), cull: window.__MU.portals().cull, sky: window.__MU.sky() }));
    await xp.evaluate(() => window.__MU.xrExit()); await xp.waitForFunction(() => !window.__MU.xr().presenting, null, { timeout: 15000 }); await xp.waitForTimeout(600);
    r.after = await xp.evaluate(() => window.__MU.portals().cull);
    return r;
  };
  const rot = await at("@rotunda"), c2 = await at("ch02"), c3 = await at("ch03"), cor = await at("@02-bronze-age");
  check(Array.isArray(rot.cull) && rot.cull.includes("rotunda") && rot.sky && rot.sky.visible, `Rotunda: culling on; the planetarium shown (${rot.cull && rot.cull.length} cells seen)`);
  check(Array.isArray(c2.cull) && c2.cull.includes("ch02") && !c2.cull.includes("rotunda") && c2.sky && !c2.sky.visible, `ch02 doorway: the Rotunda and its planetarium culled (${c2.cull && c2.cull.length} cells seen: ${c2.cull && c2.cull.join(" ")})`);
  check(Array.isArray(c3.cull) && c3.cull.includes("ch03") && !c3.cull.includes("rotunda") && c3.sky && !c3.sky.visible, `ch03 doorway: the Rotunda and its planetarium culled (${c3.cull && c3.cull.length} cells seen: ${c3.cull && c3.cull.join(" ")})`);
  check(Array.isArray(cor.cull) && cor.cull.includes("cor:02-bronze-age"), `Wing II corridor: culling on (${cor.cull && cor.cull.length} cells seen; planetarium ${cor.sky && cor.sky.visible ? "shown" : "culled"})`);
  check([rot, c2, c3, cor].every((r) => r.after === null), "leaving the headset: nothing culled again, each time");
  await xctx.close();

  check(errors.length === 0, `script errors: ${errors.length}` + (errors.length ? " " + errors.slice(0, 3).join(" | ") : ""));
  await browser.close(); srv.close();
  console.log(failed ? `${failed} check(s) FAILED` : "All portal-culling checks passed.");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); srv.close(); process.exit(1); });
