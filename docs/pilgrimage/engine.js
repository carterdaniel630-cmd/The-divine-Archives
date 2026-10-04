/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: the walking engine

   One engine for every site. A site is a module (sites/<id>/site.js) that
   lists its sections, the walkable regions, a walking route, its info points
   and its relic copies; each section is its own module, fetched and built only
   when the visitor comes near it, and dropped again when they are far away.

   Moving: the visitor walks on "regions" (kit.js): rectangles in plan with a
   flat or sloping floor and an eye height (low passages make you stoop). Regions
   may lie one above another (the ascending passage runs over the descending
   one), so the engine always keeps to the region nearest the visitor's feet.

   Controls follow the museum: drag to look; on a phone tap the floor to walk
   there, or use "Walk on"; on a computer click to look with the mouse and walk
   with W A S D. Info points and relic cases open the museum's label card and
   object inspector, styled by museum.css.

   Test hook: window.__PG.
   ========================================================================== */
import * as THREE from "three";
import { stoneMaterial } from "./stone.js?v=1";
import { portal } from "./portal.js?v=1";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const touch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
const store = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
};
const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
// speeds, field of view and turning follow the museum (docs/museum/app.js) so walking feels the same in both
const WALK = 3.0, RUN = 6.0, STEP = 0.5, LOAD_NEAR = 26, DROP_FAR = 60, PX = touch ? 512 : 1024;

const S = {
  site: null, regions: [], sections: {}, info: [], hits: [], floors: [], outlines: {},
  pos: new THREE.Vector3(), foot: 0, eye: 1.62, yaw: 0, pitch: 0, lean: 0, region: null,
  keys: new Set(), auto: null, route: [], locked: false, hover: null, dirty: true, started: false,
  reduce: store.get("pg-rm") === "1" || (store.get("pg-rm") == null && mqReduce.matches),
  lightAnchors: [], anims: [], fps: { n: 0, t: 0, v: 0 }, insp: null, busy: 0
};
let renderer, scene, camera, lamp, pool = [], sun, hemi;

// ---------------------------------------------------------------- renderer
function initRenderer() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("webgl2", { antialias: !touch, powerPreference: "high-performance" });
  if (!ctx) throw new Error("WebGL2 is not available");
  renderer = new THREE.WebGLRenderer({ canvas, context: ctx, antialias: !touch });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  canvas.setAttribute("tabindex", "0");
  canvas.setAttribute("aria-label", "The site in 3D. Use the Guide button for an accessible list of its sections and info points.");
  $("mu-stage").appendChild(canvas);
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#050302");
  scene.fog = new THREE.Fog("#050302", 8, 46);
  camera = new THREE.PerspectiveCamera(touch ? 70 : 64, 1, 0.03, 900);
  scene.add(camera);
  hemi = new THREE.HemisphereLight("#8a7356", "#1a120a", 0.45); scene.add(hemi);
  lamp = new THREE.PointLight("#ffd7a0", 1.3, 8, 1.6);           // the visitor's own lamp
  camera.add(lamp); lamp.position.set(0.15, 0.05, 0);
  for (let i = 0; i < 4; i++) { const l = new THREE.PointLight("#ffc488", 0, 14, 1.25); scene.add(l); pool.push(l); }
  sun = new THREE.DirectionalLight("#fff1d6", 0); sun.position.set(-40, 80, -60); scene.add(sun); scene.add(sun.target);
  resize(); window.addEventListener("resize", resize);
}
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); S.dirty = true;
  if (S.insp && S.insp.active) S.insp.resize();
}

// ---------------------------------------------------------------- materials shared with section modules
const MATS = {};
function mat(kind, opts) {
  const key = kind + JSON.stringify(opts || {});
  if (!MATS[key]) MATS[key] = stoneMaterial(kind, PX, opts);
  return MATS[key];
}

// ---------------------------------------------------------------- sections: fetch, build, drop
function boxDist(b, p) {
  const dx = Math.max(b[0] - p.x, 0, p.x - b[3]), dy = Math.max(b[1] - p.y, 0, p.y - b[4]), dz = Math.max(b[2] - p.z, 0, p.z - b[5]);
  return Math.hypot(dx, dy, dz);
}
async function loadSection(sec) {
  if (sec.state) return sec.ready;
  sec.state = "loading"; S.busy++; paintBusy();
  sec.ready = (async () => {
    const t0 = performance.now();
    const mod = await import(`./sites/${S.site.id}/${sec.module}?v=${S.site.version || 1}`);
    // build on the next frame so the page keeps responding
    await new Promise((r) => requestAnimationFrame(r));
    const group = new THREE.Group(); group.name = sec.id;
    const ctx = { THREE, mat, group, outline: (id, obj) => { S.outlines[id] = obj; obj.visible = !!S.outlineOn[id]; group.add(obj); }, hit: registerHit, infoById: (id) => S.site.info.find((i) => i.id === id), light: (x, y, z, s) => { const a = { p: new THREE.Vector3(x, y, z), s: s || 1, sec: sec.id }; S.lightAnchors.push(a); return a; }, touch,
      // a golden portal (portal.js), animated by the engine while the visitor is near
      portal: (o, x, y, z, yaw) => { const fx = portal(o); fx.group.position.set(x, y, z); fx.group.rotation.y = yaw || 0; group.add(fx.group); S.anims.push({ sec: sec.id, p: new THREE.Vector3(x, y + 1.4, z), fx }); return fx; } };
    const out = (await mod.build(ctx)) || {};
    group.traverse((o) => { if (o.isMesh && o.userData.floor) S.floors.push(o); });
    scene.add(group);
    sec.group = group; sec.dispose = out.dispose; sec.state = "built"; sec.ms = Math.round(performance.now() - t0);
    S.busy--; paintBusy(); S.dirty = true;
  })().catch((e) => { console.error(e); sec.state = null; S.busy--; paintBusy(); });
  return sec.ready;
}
function dropSection(sec) {
  if (sec.state !== "built") return;
  scene.remove(sec.group);
  sec.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });   // materials and textures are shared and kept
  S.floors = S.floors.filter((m) => !sec.group.getObjectById(m.id));
  S.hits = S.hits.filter((m) => !sec.group.getObjectById(m.id));
  S.lightAnchors = S.lightAnchors.filter((a) => a.sec !== sec.id);
  S.anims.filter((a) => a.sec === sec.id).forEach((a) => a.fx.dispose()); S.anims = S.anims.filter((a) => a.sec !== sec.id);
  for (const [k, v] of Object.entries(S.outlines)) if (sec.group.getObjectById(v.id)) delete S.outlines[k];
  if (sec.dispose) sec.dispose();
  sec.group = null; sec.state = null; sec.ready = null;
}
function manageSections() {
  for (const sec of S.site.sections) {
    const d = boxDist(sec.box, S.pos);
    if (d < LOAD_NEAR && !sec.state) loadSection(sec);
    else if (d > DROP_FAR && sec.state === "built") dropSection(sec);
    if (sec.group) sec.group.visible = d < DROP_FAR - 10;
  }
}
function paintBusy() { const b = $("pg-busy"); if (b) b.hidden = S.busy === 0; }

// ---------------------------------------------------------------- walking
function regionAt(x, z, foot) {
  let best = null, bd = 1e9;
  for (const r of S.regions) {
    if (!r.contains(x, z)) continue;
    const d = Math.abs(r.floorAt(x, z) - foot);
    if (d < STEP && d < bd) { bd = d; best = r; }
  }
  return best;
}
function place(x, z, yaw, foot) {
  S.pos.x = x; S.pos.z = z;
  const r = regionAt(x, z, foot != null ? foot : S.foot) || S.regions.filter((q) => q.contains(x, z)).sort((a, b) => Math.abs(a.floorAt(x, z) - (foot || 0)) - Math.abs(b.floorAt(x, z) - (foot || 0)))[0];
  if (r) { S.region = r; S.foot = r.floorAt(x, z); S.eye = r.eye; }
  if (yaw != null) { S.yaw = yaw; S.pitch = 0; }
  S.pos.y = S.foot + S.eye; S.dirty = true;
  manageSections(); locate();
}
function tryMove(dx, dz) {
  const nx = S.pos.x + dx, nz = S.pos.z + dz;
  let r = regionAt(nx, nz, S.foot);
  if (r) { S.pos.x = nx; S.pos.z = nz; S.region = r; S.foot = r.floorAt(nx, nz); return true; }
  // slide along whichever axis is still free
  r = regionAt(nx, S.pos.z, S.foot); if (r && Math.abs(dx) > 1e-4) { S.pos.x = nx; S.region = r; S.foot = r.floorAt(nx, S.pos.z); return true; }
  r = regionAt(S.pos.x, nz, S.foot); if (r && Math.abs(dz) > 1e-4) { S.pos.z = nz; S.region = r; S.foot = r.floorAt(S.pos.x, nz); return true; }
  return false;
}
// the rise of the floor in the direction the visitor faces, as an angle
function slopeAhead() {
  const r = S.region; if (!r || r.y1 == null) return 0;
  const fx = -Math.sin(S.yaw), fz = -Math.cos(S.yaw);
  const g = r.axis === "x" ? (r.y1 - r.y) / (r.x1 - r.x0) * fx : (r.y1 - r.y) / (r.z1 - r.z0) * fz;
  return Math.atan(g) * 0.85;
}
// ---------------------------------------------------------------- finding the way: regions joined where they overlap
// Two regions join where their walkable rectangles overlap and their floors meet there (within a step).
// A tap is walked through the chain of joins, so a tap anywhere in view (round a corner, up a side tunnel)
// gets you there, as in the museum.
function joins() {
  if (S.joins) return S.joins;
  const J = new Map(S.regions.map((r) => [r, []]));
  for (let i = 0; i < S.regions.length; i++) for (let j = i + 1; j < S.regions.length; j++) {
    const a = S.regions[i], b = S.regions[j];
    if (a.portal || b.portal) continue;
    const x0 = Math.max(a.bx0, b.bx0), x1 = Math.min(a.bx1, b.bx1), z0 = Math.max(a.bz0, b.bz0), z1 = Math.min(a.bz1, b.bz1);
    if (x0 > x1 || z0 > z1) continue;
    let best = null, bd = 1e9; const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    for (let u = 0; u <= 6; u++) for (let v = 0; v <= 6; v++) {
      const x = x0 + (x1 - x0) * u / 6, z = z0 + (z1 - z0) * v / 6;
      if (!a.contains(x, z) || !b.contains(x, z) || Math.abs(a.floorAt(x, z) - b.floorAt(x, z)) >= STEP * 0.8) continue;
      const d = Math.hypot(x - cx, z - cz); if (d < bd) { bd = d; best = { x, z }; }
    }
    if (best) { J.get(a).push({ to: b, p: best }); J.get(b).push({ to: a, p: best }); }
  }
  return (S.joins = J);
}
function findWay(from, to, target) {
  if (from === to) return [target];
  const J = joins(), dist = new Map([[from, 0]]), at = new Map([[from, { x: S.pos.x, z: S.pos.z }]]), prev = new Map(), open = [from];
  while (open.length) {
    open.sort((a, b) => dist.get(a) - dist.get(b));
    const u = open.shift(); if (u === to) break;
    for (const e of J.get(u)) {
      const d = dist.get(u) + Math.hypot(e.p.x - at.get(u).x, e.p.z - at.get(u).z);
      if (d < (dist.has(e.to) ? dist.get(e.to) : 1e9)) { dist.set(e.to, d); at.set(e.to, e.p); prev.set(e.to, { r: u, p: e.p }); if (!open.includes(e.to)) open.push(e.to); }
    }
  }
  if (!prev.has(to)) return null;
  const pts = [target]; let r = to;
  while (prev.has(r)) { const q = prev.get(r); pts.unshift({ x: q.p.x, z: q.p.z, join: true }); r = q.r; }
  return pts;
}
// where a tap on the stone (floor, wall or ceiling) means to go: the nearest walkable spot below the point hit
function tapTarget(hit) {
  let best = null, bd = 1e9;
  for (const r of S.regions) {
    if (r.portal && !r.contains(hit.x, hit.z)) continue;
    const x = Math.max(r.bx0, Math.min(r.bx1, hit.x)), z = Math.max(r.bz0, Math.min(r.bz1, hit.z));
    const plan = Math.hypot(x - hit.x, z - hit.z), below = hit.y - r.floorAt(x, z);
    if (plan > 0.9 || below < -0.4 || below > 4.5 || !r.contains(x, z)) continue;
    const d = plan * 2 + Math.max(0, below - 0.1) * 0.5;
    if (d < bd) { bd = d; best = { r, x, z }; }
  }
  return best;
}
// in a narrow passage the stone ahead is always close (a 1.2 m passage's ceiling meets the eye a metre or
// two on), so a tap ahead or behind in the passage you are in means: walk along it that way, up to 12 m
function alongPassage(t) {
  const r = t.r, w = r.bx1 - r.bx0, l = r.bz1 - r.bz0;
  if (r !== S.region || Math.min(w, l) > 1.6) return t;
  if (l >= w) { const sg = Math.sign(t.z - S.pos.z) || 1; return { r, x: (r.bx0 + r.bx1) / 2, z: Math.max(r.bz0 + 0.05, Math.min(r.bz1 - 0.05, S.pos.z + sg * 12)) }; }
  const sg = Math.sign(t.x - S.pos.x) || 1; return { r, z: (r.bz0 + r.bz1) / 2, x: Math.max(r.bx0 + 0.05, Math.min(r.bx1 - 0.05, S.pos.x + sg * 12)) };
}
function walkTo(t) {
  const way = S.region && findWay(S.region, t.r, { x: t.x, z: t.z });
  if (!way) return false;
  if (S.reduce) { fadeThen(() => { jumpAlong(way); }); return true; }   // reduced motion: a fade, not a walk
  S.auto = way.shift(); S.route = way; paintRoute();
  return true;
}
const angDiff = (a, b) => { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
function step(dt) {
  let mx = 0, mz = 0; const k = S.keys;
  if (k.has("KeyW") || k.has("ArrowUp")) mz += 1;
  if (k.has("KeyS") || k.has("ArrowDown")) mz -= 1;
  if (k.has("KeyA")) mx -= 1;
  if (k.has("KeyD")) mx += 1;
  if (k.has("ArrowLeft")) { S.yaw += 1.9 * dt; S.dirty = true; }
  if (k.has("ArrowRight")) { S.yaw -= 1.9 * dt; S.dirty = true; }
  const speed = (k.has("ShiftLeft") || k.has("ShiftRight")) ? RUN : WALK;
  const fx = -Math.sin(S.yaw), fz = -Math.cos(S.yaw), rx = -fz, rz = fx;
  let moved = false;
  if (mx || mz) {
    S.auto = null; S.route = [];
    const n = Math.hypot(mx, mz), sub = 3;
    for (let i = 0; i < sub; i++) moved = tryMove((fx * mz + rx * mx) / n * speed * dt / sub, (fz * mz + rz * mx) / n * speed * dt / sub) || moved;
  } else if (S.auto) {
    const a = S.auto, dx = a.x - S.pos.x, dz = a.z - S.pos.z, d = Math.hypot(dx, dz);
    // a join between two regions must be reached exactly (it may be a narrow overlap); other stops loosely
    if (d < (a.join ? 0.04 : 0.2)) { S.auto = S.route.length ? S.route.shift() : null; if (!S.auto) paintRoute(); }
    else {
      // face where the walk is going, as the museum does; near a join, look past it to the next leg so the
      // turn is one smooth swing rather than a jerk at each corner
      const nx = S.route[0], ahead = nx && d < 1.6 ? { x: nx.x - S.pos.x, z: nx.z - S.pos.z } : { x: dx, z: dz };
      S.yaw += angDiff(Math.atan2(-ahead.x, -ahead.z), S.yaw) * Math.min(1, dt * 5);
      const v = Math.min(d, WALK * 1.2 * dt);
      moved = tryMove(dx / d * v, dz / d * v);
      // stuck against stone (a waypoint just outside reach): go on to the next one, or stop
      a.stuck = moved ? 0 : (a.stuck || 0) + dt;
      if (a.stuck > 0.3) { S.auto = S.route.length ? S.route.shift() : null; if (!S.auto) { S.route = []; paintRoute(); } }
    }
  }
  // eye height follows the region (stooping in low passages), smoothly
  const want = S.region ? S.region.eye : 1.62;
  if (Math.abs(want - S.eye) > 0.002) { S.eye += (want - S.eye) * Math.min(1, dt * 2.5); moved = true; }
  // on a sloping floor the head tips to follow the slope, so you look along the passage rather than into
  // its ceiling or floor (a passage only 1.2 m high closes the view within a metre if you look level)
  const lw = slopeAhead();
  if (Math.abs(lw - S.lean) > 0.001) { S.lean += (lw - S.lean) * Math.min(1, dt * 3); moved = true; }
  const y = S.foot + S.eye; if (Math.abs(y - S.pos.y) > 1e-4) { S.pos.y = y; moved = true; }
  if (moved) S.dirty = true;
  // portals: standing in any portal region (they overlap the rooms they open from) takes you through
  if (!S.portalT) {
    const pr = S.regions.find((r) => r.portal && r.contains(S.pos.x, S.pos.z) && Math.abs(r.floorAt(S.pos.x, S.pos.z) - S.foot) < STEP);
    if (pr) {
      S.portalT = true; S.auto = null; S.route = []; S.keys.clear(); paintRoute();
      const f = $("mu-fade"); f.classList.add("gold");
      if (pr.href) { f.classList.add("on"); setTimeout(() => { window.location.href = pr.href; }, S.reduce ? 0 : 650); }   // out of the site (to the museum)
      else goTo(pr.portal, () => { f.classList.remove("gold"); setTimeout(() => { S.portalT = false; }, 400); });
    }
  }
}

// ---------------------------------------------------------------- the route ("Walk on" / "Walk back")
function nearestRouteIndex() {
  let bi = 0, bd = 1e9;
  S.site.route.forEach((p, i) => { const d = Math.hypot(p.x - S.pos.x, p.z - S.pos.z) + Math.abs((p.y != null ? p.y : S.foot) - S.foot) * 3; if (d < bd) { bd = d; bi = i; } });
  return bi;
}
function walkRoute(dir) {
  const R = S.site.route; if (!R.length) return;
  // the route passes some places twice (down from the King's Chamber, on to the Queen's): remember where we are on it
  const ri = S.routeIdx, near = ri != null && R[ri] && Math.hypot(R[ri].x - S.pos.x, R[ri].z - S.pos.z) < 3 && Math.abs((R[ri].y != null ? R[ri].y : S.foot) - S.foot) < 1.5;
  let i = near ? ri : nearestRouteIndex();
  const path = []; let j = i + dir;
  // walk point by point to the next stop in that direction
  for (; j >= 0 && j < R.length; j += dir) { path.push({ x: R[j].x, z: R[j].z }); if (R[j].stop) break; }
  S.routeIdx = Math.max(0, Math.min(R.length - 1, j));
  if (!path.length) return;
  if (S.reduce) {           // reduced motion: jump straight there with a fade
    const last = R[i + dir * path.length] || path[path.length - 1];
    const p = path[path.length - 1];
    fadeThen(() => { for (const q of path) { let g = 0; while (g++ < 400 && Math.hypot(q.x - S.pos.x, q.z - S.pos.z) > 0.25) { const d = Math.hypot(q.x - S.pos.x, q.z - S.pos.z); tryMove((q.x - S.pos.x) / d * 0.2, (q.z - S.pos.z) / d * 0.2); } } S.pos.y = S.foot + (S.region ? S.region.eye : 1.62); if (last.yaw != null) S.yaw = last.yaw; manageSections(); locate(); S.dirty = true; });
    void p; return;
  }
  S.auto = path.shift(); S.route = path; paintRoute();
}
function jumpAlong(path) {
  for (const q of path) { let g = 0; while (g++ < 400 && Math.hypot(q.x - S.pos.x, q.z - S.pos.z) > 0.25) { const d = Math.hypot(q.x - S.pos.x, q.z - S.pos.z); if (!tryMove((q.x - S.pos.x) / d * Math.min(d, 0.2), (q.z - S.pos.z) / d * Math.min(d, 0.2))) break; } }
  S.eye = S.region ? S.region.eye : 1.62; S.pos.y = S.foot + S.eye; manageSections(); locate(); S.dirty = true;
}
function paintRoute() { const b = $("pg-walk"); if (b) b.setAttribute("aria-pressed", String(!!S.auto)); }

// ---------------------------------------------------------------- fades and jumps
function fadeThen(fn, done) {
  const f = $("mu-fade");
  if (S.reduce) { fn(); if (done) done(); return; }
  f.classList.add("on");
  setTimeout(() => { fn(); setTimeout(() => { f.classList.remove("on"); if (done) done(); }, 80); }, 330);
}
function goTo(id, done) {
  const sec = S.site.sections.find((s) => s.id === id) || S.site.sections[0];
  const st = sec.start;
  fadeThen(async () => { place(st.x, st.z, st.yaw, st.y); await loadSection(sec); }, done);
}

// ---------------------------------------------------------------- where am I
function locate() {
  const r = S.region, sec = r && S.site.sections.find((s) => s.id === r.section);
  const t = sec ? sec.name : "";
  if (t !== S.where) { S.where = t; $("mu-where").textContent = t; }
  // daylight only near the outside
  const out = r && r.outside ? 1 : 0;
  sun.intensity = out * 1.5;
  hemi.intensity = out ? 1.5 : 0.45; hemi.color.set(out ? "#dfe6ee" : "#8a7356"); hemi.groundColor.set(out ? "#b08a5a" : "#1a120a");
  scene.fog.color.set(out ? "#cdb995" : "#050302"); scene.background.set(out ? "#d9c7a3" : "#050302");
  scene.fog.near = out ? 60 : 8; scene.fog.far = out ? 700 : 46;
}

// ---------------------------------------------------------------- lights: the nearest few lamps get the light pool
function updateLights() {
  const p = S.pos;
  const near = S.lightAnchors.map((a) => [a, a.p.distanceToSquared(p)]).sort((a, b) => a[1] - b[1]).slice(0, pool.length);
  pool.forEach((l, i) => { const a = near[i]; if (a && a[1] < 26 * 26) { l.position.copy(a[0].p); l.intensity = 12 * a[0].s; l.distance = 16 * Math.max(0.8, a[0].s); } else l.intensity = 0; });
}

// ---------------------------------------------------------------- info points and cards
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pick(cx, cy) {
  ndc.set(cx, cy); ray.setFromCamera(ndc, camera); ray.far = 14;
  const hits = ray.intersectObjects(S.hits.filter((h) => h.visible && h.parent && sectionVisible(h)), false);
  const walls = ray.intersectObjects(S.floors.concat(wallMeshes()), false);
  if (!hits.length) return null;
  if (walls.length && walls[0].distance < hits[0].distance - 0.25) return null;   // behind stone
  return hits[0].object.userData.info;
}
function sectionVisible(o) { let p = o; while (p) { if (p.visible === false) return false; p = p.parent; } return true; }
function wallMeshes() { const out = []; for (const s of S.site.sections) if (s.group && s.group.visible) s.group.traverse((o) => { if (o.isMesh && o.userData.wall) out.push(o); }); return out; }
function floorPoint(cx, cy) {
  ndc.set(cx, cy); ray.setFromCamera(ndc, camera); ray.far = 40;
  const h = ray.intersectObjects(S.floors.concat(wallMeshes()).filter((m) => sectionVisible(m)), false)[0];
  return h ? h.point : null;
}
// section modules register their clickable things through ctx.hit
function registerHit(obj, info) { obj.userData.info = info; S.hits.push(obj); }

function linkBtn(href, label, ghost) { return `<a class="${ghost ? "ghost" : ""}" href="${esc(href)}">${esc(label)}</a>`; }
function openCard(info) {
  if (!info) return;
  unlock();
  if (info.relic) { openRelic(info); return; }
  S.cardInfo = info;
  const links = (info.links || []).map((l, i) => linkBtn(l.href, l.label, i > 0)).join("");
  const toggles = (info.toggle ? [info.toggle] : []).map((t) => `<button type="button" class="pg-toggle" data-outline="${esc(t.id)}" aria-pressed="${S.outlineOn[t.id] ? "true" : "false"}">${esc(S.outlineOn[t.id] ? t.off : t.on)}</button>`).join("");
  $("mu-card-body").innerHTML =
    `<p class="mu-cat">${esc(info.cat || S.site.title)}</p><h2 id="mu-card-h">${esc(info.title)}</h2>` +
    (info.flags || []).map((f) => `<span class="mu-flag${f.soft ? " soft" : ""}">${esc(f.t)}</span>`).join("") +
    info.html +
    (info.diagram ? `<div class="pg-diagram">${info.diagram}</div>` : "") +
    (toggles ? `<div class="mu-actions">${toggles}</div>` : "") +
    (info.objects ? `<div class="mu-actions">${info.objects.map((o, i) => `<button type="button" class="pg-toggle" data-object="${i}">${esc(o.button)}</button>`).join("")}</div>` : "") +
    (links ? `<div class="mu-actions">${links}</div>` : "") +
    (info.sources ? `<p class="pg-src"><strong>Sources:</strong> ${info.sources}</p>` : "");
  $("mu-card-wrap").hidden = false; S.cardAt = performance.now();
  $("mu-card").focus({ preventScroll: true });
}
function closeCard() { $("mu-card-wrap").hidden = true; S.dirty = true; renderer.domElement.focus(); }
async function openRelic(info) {
  const r = info.relic;
  // a site's own relic: its builder lives in the site's relics.js; hand it to the museum's inspector catalogue
  if (r.build) {
    const [own, cat] = await Promise.all([import(`./sites/${S.site.id}/relics.js?v=${S.site.version || 1}`), import("../museum/relics.js?v=1")]);
    if (!cat.CAT[r.id]) cat.CAT[r.id] = () => own[r.build]();
  }
  if (!S.insp) {
    const m = await import("../museum/inspect.js?v=7");
    S.insp = m.createInspector({ renderer, reduce: () => S.reduce, onClose: () => { S.keys.clear(); S.dirty = true; resize(); renderer.domElement.focus(); } });
    const cl = S.insp.el.querySelector('[data-i="close"]'); if (cl) cl.textContent = "Back to the site";
  }
  const html = `<p class="mu-cat">${r.slug ? "Vault" : "Modelled copy"} · ${esc(r.category)}</p><h2 id="mu-card-h">${esc(r.title)}</h2>` +
    `<p class="mu-meta">${esc(r.held)} · ${esc(r.dated)}</p>` + info.html +
    (r.slug ? `<div class="mu-actions">${linkBtn("../vault/" + r.slug + ".html", "Open the Vault entry")}${linkBtn("../vault/" + r.slug + ".html#evidence", "The evidence, honestly", true)}</div>`
      : (info.links || []).length ? `<div class="mu-actions">${info.links.map((l, i) => linkBtn(l.href, l.label, i > 0)).join("")}</div>` : "") +
    (info.sources ? `<p class="pg-src"><strong>Sources:</strong> ${info.sources}</p>` : "");
  S.cardAt = performance.now();
  S.insp.open(r.kind || "tablet", html, r.note || "A modelled rendition, after the description in its Vault entry; not a replica. Its writing is illustrative marks. This object is shown here for comparison: it does not come from this site.", r.id);
}

// ---------------------------------------------------------------- the guide (accessible list)
function renderGuide() {
  const body = $("mu-guide-body");
  body.innerHTML = S.site.sections.filter((s) => !s.hidden).map((s) => {
    const items = S.site.info.filter((i) => i.section === s.id);
    return `<h3>${esc(s.name)}</h3><p class="tiny">${esc(s.blurb || "")}</p><ul><li><button type="button" data-go="${esc(s.id)}">Go to ${esc(s.short || s.name)}</button></li>` +
      items.map((i) => `<li><button type="button" data-info="${esc(i.id)}">${esc(i.title)}</button></li>`).join("") + "</ul>";
  }).join("") + `<h3>About this model</h3><ul><li><button type="button" data-info="about">How close is this to the real thing?</button></li></ul>`;
}
function toggleGuide(on) {
  const g = $("mu-guide"), show = on == null ? g.hidden : on;
  g.hidden = !show; $("mu-guide-btn").setAttribute("aria-expanded", String(show));
  if (show) { renderGuide(); unlock(); }
}

// ---------------------------------------------------------------- input
function lock() { if (touch || !$("mu-card-wrap").hidden) return; const c = renderer.domElement; if (c.requestPointerLock) { try { const p = c.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* not allowed */ } } }
function unlock() { if (document.pointerLockElement) document.exitPointerLock(); }
function bindInput() {
  const c = renderer.domElement;
  document.addEventListener("pointerlockchange", () => { S.locked = document.pointerLockElement === c; $("mu-reticle").hidden = !S.locked; });
  document.addEventListener("mousemove", (e) => { if (!S.locked || Math.abs(e.movementX) > 180 || Math.abs(e.movementY) > 180) return; S.yaw -= e.movementX * 0.0024; S.pitch = Math.max(-1.2, Math.min(1.48, S.pitch - e.movementY * 0.0024)); S.dirty = true; });
  let down = null;
  c.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now(), yaw: S.yaw, pitch: S.pitch, moved: false }; c.setPointerCapture(e.pointerId); c.focus(); });
  c.addEventListener("pointermove", (e) => {
    if (!down || S.locked) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.hypot(dx, dy) > 6) down.moved = true;
    if (down.moved) { S.yaw = down.yaw - dx * 0.005; S.pitch = Math.max(-1.1, Math.min(1.45, down.pitch - dy * 0.004)); S.dirty = true; }
  });
  c.addEventListener("pointerup", (e) => {
    if (!down) return;
    const tap = !down.moved && performance.now() - down.t < 450; down = null;
    if (!tap) return;
    if (S.locked) { const inf = pick(0, 0); if (inf) openCard(inf); return; }
    const r = c.getBoundingClientRect(), cx = ((e.clientX - r.left) / r.width) * 2 - 1, cy = -((e.clientY - r.top) / r.height) * 2 + 1;
    const inf = pick(cx, cy); if (inf) { openCard(inf); return; }
    if (!touch && e.pointerType === "mouse") { lock(); return; }
    const fp = floorPoint(cx, cy), t = fp && tapTarget(fp);
    if (t) walkTo(alongPassage(t));
  });
  window.addEventListener("keydown", (e) => {
    if (!$("mu-card-wrap").hidden) { if (e.key === "Escape") { e.preventDefault(); closeCard(); } return; }
    if (S.insp && S.insp.active) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target.tagName)) return;
    if (e.key === "Escape" && !$("mu-guide").hidden) { toggleGuide(false); return; }
    if (e.code === "KeyE" || e.key === "Enter") { const inf = S.hover || pick(0, 0); if (inf) { e.preventDefault(); openCard(inf); } return; }
    if (e.code === "KeyG") { toggleGuide(); return; }
    if (e.code === "KeyN") { walkRoute(1); return; }
    if (e.code === "KeyB") { walkRoute(-1); return; }
    if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"].includes(e.code)) { if (e.code.startsWith("Arrow")) e.preventDefault(); S.keys.add(e.code); }
  });
  window.addEventListener("keyup", (e) => S.keys.delete(e.code));
  window.addEventListener("blur", () => S.keys.clear());
  $("mu-card-wrap").addEventListener("click", (e) => { if (performance.now() - (S.cardAt || 0) < 450) { e.preventDefault(); e.stopPropagation(); } }, true);
  $("mu-card-x").addEventListener("click", closeCard);
  $("mu-card-wrap").addEventListener("click", (e) => {
    if (e.target === $("mu-card-wrap")) { closeCard(); return; }
    const ob = e.target.closest("[data-object]");
    if (ob) { const inf = S.cardInfo && S.cardInfo.objects && S.cardInfo.objects[+ob.getAttribute("data-object")]; if (inf) { $("mu-card-wrap").hidden = true; openRelic(inf); } return; }
    const t = e.target.closest("[data-outline]");
    if (t) { const id = t.getAttribute("data-outline"); S.outlineOn[id] = !S.outlineOn[id]; if (S.outlines[id]) S.outlines[id].visible = S.outlineOn[id]; const inf = S.site.info.find((i) => i.toggle && i.toggle.id === id); if (inf) openCard(inf); S.dirty = true; }
  });
  $("mu-guide-btn").addEventListener("click", () => toggleGuide());
  $("mu-guide-x").addEventListener("click", () => toggleGuide(false));
  $("mu-guide-body").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-go")) { toggleGuide(false); goTo(b.getAttribute("data-go")); return; }
    const id = b.getAttribute("data-info"); const inf = id === "about" ? S.site.about : S.site.info.find((i) => i.id === id);
    if (inf) { if (inf.look) { S.yaw = inf.look[0]; S.pitch = inf.look[1]; } openCard(inf); }
  });
  $("pg-walk").addEventListener("click", () => walkRoute(1));
  $("pg-back").addEventListener("click", () => walkRoute(-1));
  $("mu-help-btn").addEventListener("click", () => { $("mu-intro").hidden = false; $("mu-enter").textContent = "Back to the site"; unlock(); });
  $("mu-motion-btn").addEventListener("click", () => setReduce(!S.reduce));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) S.dirty = true; });
  window.addEventListener("pageshow", () => { $("mu-fade").classList.remove("gold", "on"); S.portalT = false; });
}
function setReduce(v) { S.reduce = v; store.set("pg-rm", v ? "1" : "0"); $("mu-motion-btn").setAttribute("aria-pressed", String(v)); S.dirty = true; }

// ---------------------------------------------------------------- loop
let last = performance.now(), secT = 0, locT = 0, idle = 0;
function tick(now) {
  requestAnimationFrame(tick);
  if (document.hidden) { last = now; return; }
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  S.fps.n++; S.fps.t += dt; if (S.fps.t > 1) { S.fps.v = S.fps.n / S.fps.t; S.fps.n = 0; S.fps.t = 0; }
  if (S.insp && S.insp.active) { S.insp.render(dt); return; }
  if ($("mu-card-wrap").hidden && $("mu-intro").hidden) step(dt);
  secT += dt; if (secT > 0.3) { secT = 0; manageSections(); }
  locT += dt; if (locT > 0.25) { locT = 0; locate(); }
  idle += dt;
  for (const a of S.anims) if (a.p.distanceTo(S.pos) < 25 && a.fx.group.parent && a.fx.group.parent.visible !== false) { if (a.fx.update(S.reduce ? 0 : dt)) S.dirty = true; }
  if (!S.dirty && (S.reduce || idle < 0.12)) return;   // like the museum: a fresh frame at least every 0.12 s
  idle = 0; S.dirty = false;
  camera.position.copy(S.pos);
  camera.rotation.set(Math.max(-1.3, Math.min(1.5, S.pitch + S.lean)), S.yaw, 0, "YXZ");
  updateLights();
  // markers face the camera and pulse gently
  for (const h of S.hits) if (h.userData.marker) { h.userData.marker.quaternion.copy(camera.quaternion); }
  const inf = (S.locked || !touch) && $("mu-card-wrap").hidden ? pick(0, 0) : null;
  if (inf !== S.hover) {
    S.hover = inf; const tag = $("mu-tag");
    if (inf) { tag.innerHTML = `<kbd>${touch ? "tap" : "E"}</kbd>` + esc(inf.title); tag.hidden = false; } else tag.hidden = true;
    $("mu-reticle").classList.toggle("on", !!inf);
  }
  renderer.render(scene, camera);
}

// ---------------------------------------------------------------- start
export async function start(siteId) {
  document.body.classList.add("is-3d");
  $("mu-intro").hidden = false;
  $("mu-keys").innerHTML = touch
    ? "<kbd>drag</kbd><span>look around</span><kbd>tap the floor</kbd><span>walk there</span><kbd>Walk on</kbd><span>follow the route to the next stop</span><kbd>tap a gold marker</kbd><span>read about what you see</span><kbd>Guide</kbd><span>every section and info point, and a way to jump there</span>"
    : "<kbd>click</kbd><span>look with the mouse (Esc to release)</span><kbd>W A S D</kbd><span>walk (arrows to turn, Shift to hurry)</span><kbd>N / B</kbd><span>walk on to the next stop / back</span><kbd>E</kbd><span>read the info point in view</span><kbd>G</kbd><span>the Guide: every section and info point</span>";
  $("mu-enter").disabled = true;
  try { initRenderer(); }
  catch (e) { $("mu-status").textContent = "Your browser could not start the 3D view. The Guide below lists everything this site holds."; showFallback(); return; }
  try {
    const mod = await import(`./sites/${siteId}/site.js?v=1`);
    S.site = mod.default; S.site.id = siteId;
    S.regions = S.site.regions; S.outlineOn = {};
  } catch (e) { console.error(e); $("mu-status").textContent = "This site could not be loaded."; showFallback(); return; }
  bindInput(); setReduce(S.reduce);
  const first = S.site.sections[0], st = first.start;
  place(st.x, st.z, st.yaw, st.y);
  await loadSection(first);
  // draw every kind of stone the site uses while the visitor is still at the start, one kind per idle moment,
  // so that walking into a new section never waits for its textures; then fetch the next section
  const warm = (S.site.stones || []).slice(), idle = window.requestIdleCallback || ((f) => setTimeout(f, 120));
  const next = () => { if (!warm.length) { if (S.site.sections[1]) loadSection(S.site.sections[1]); return; } mat(warm.shift()); idle(next, { timeout: 600 }); };
  setTimeout(() => idle(next, { timeout: 600 }), 400);
  S.started = true; $("mu-bar").hidden = false; $("pg-nav").hidden = false;
  requestAnimationFrame(tick);
  $("mu-status").textContent = "";
  $("mu-enter").disabled = false;
  $("mu-enter").addEventListener("click", () => { $("mu-intro").hidden = true; store.set("pg-seen-" + siteId, "1"); renderer.domElement.focus(); if (!touch) lock(); S.dirty = true; });
  if (store.get("pg-seen-" + siteId) === "1") { $("mu-intro").hidden = true; renderer.domElement.focus(); } else $("mu-enter").focus();
}
function showFallback() { document.body.classList.remove("is-3d"); $("mu-intro").hidden = true; const d = $("pg-fallback"); if (d) d.hidden = false; }

window.__PG = {
  state: () => ({ x: +S.pos.x.toFixed(2), y: +S.pos.y.toFixed(2), z: +S.pos.z.toFixed(2), foot: +S.foot.toFixed(2), yaw: S.yaw, where: S.where, region: S.region && S.region.id, built: S.site ? S.site.sections.filter((s) => s.state === "built").map((s) => s.id) : [], busy: S.busy, ms: S.site ? Object.fromEntries(S.site.sections.filter((s) => s.ms).map((s) => [s.id, s.ms])) : {}, fps: Math.round(S.fps.v), calls: renderer ? renderer.info.render.calls : 0, tris: renderer ? renderer.info.render.triangles : 0, textures: renderer ? renderer.info.memory.textures : 0, geometries: renderer ? renderer.info.memory.geometries : 0 }),
  go: (id) => new Promise((res) => goTo(id, res)),
  place: (x, z, yaw, foot, pitch) => { place(x, z, yaw, foot); if (pitch != null) S.pitch = pitch; S.dirty = true; },
  look: (yaw, pitch) => { S.yaw = yaw; S.pitch = pitch; S.dirty = true; },
  walk: (dir) => walkRoute(dir),
  route: () => ({ auto: !!S.auto, left: S.route.length }),
  tap: (cx, cy) => { const fp = floorPoint(cx, cy), t = fp && tapTarget(fp); return t ? (walkTo(alongPassage(t)) ? t.r.id : "no way") : null; },
  walkTo: (x, z, y) => { const t = tapTarget({ x, z, y: y + 0.5 }); return t ? (walkTo(t) ? t.r.id : "no way") : null; },
  way: () => [S.auto, ...S.route].filter(Boolean).map((q) => [+q.x.toFixed(2), +q.z.toFixed(2)]),
  joins: () => [...joins()].map(([r, es]) => [r.id, es.map((e) => e.to.id)]),
  key: (code, ms) => { S.keys.add(code); return new Promise((r) => setTimeout(() => { S.keys.delete(code); r(); }, ms)); },
  open: (id) => openCard(S.site.info.find((i) => i.id === id) || S.site.about),
  close: () => closeCard(),
  outline: (id, on) => { S.outlineOn[id] = on; if (S.outlines[id]) S.outlines[id].visible = on; S.dirty = true; },
  ready: () => Promise.all(S.site.sections.filter((s) => s.state === "loading").map((s) => s.ready))
};
