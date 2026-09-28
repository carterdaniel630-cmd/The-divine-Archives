/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum (museum.html)

   A walkable building generated from docs/museum/manifest.json, which
   tools/build-museum.js writes from the archive's data files. Layout (PLAN.md
   §3, option A): an entrance hall, the Rotunda of comparative themes, and a long
   Spine gallery with one wing per Age; each chapter is a room.

   Everything here is procedural: walls, floors and props are built from
   primitives, and every picture on a wall is the archive's own SVG art
   (chapter plates, era emblems, Pantheon emblems) drawn onto a canvas. Label
   cards are DOM, not WebGL text, so they are readable by assistive technology.

   Units are metres; -z is north. Test hook: window.__MU.
   ========================================================================== */
import * as THREE from "three";

// ---------------------------------------------------------------- constants
const EYE = 1.62, RADIUS = 0.3, WALK = 3.0, RUN = 6.0;
const ROOM_W = 13, ROOM_D = 14, ROOM_H = 5.4, DOOR_W = 2.6, DOOR_H = 3.3;
const COR_W = 4, COR_H = 4.6, SPINE_HALF = 4, SPINE_H = 7.6, WING_DOOR = 4, WING_DOOR_H = 4.2;
const HALL = { x0: -9, x1: 9, z0: 0, z1: 14, h: 7 };
const ROT = { cx: 0, cz: -14, r: 12, h: 8 };
const SPINE_Z0 = ROT.cz - ROT.r;               // -26
const WING_Z0 = -44, WING_STEP = 16;
const GOLD = "#e7c680", GOLD_DIM = "#c79a54";
const FETCH_NEAR = 30, BUILD_NEAR = 14, DROP_FAR = 48, SHOW_FAR = 36, ROOM_SHOW = 9, SIGN_FAR = 26;

const $ = (id) => document.getElementById(id);
const store = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  sget(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
  sset(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
};
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const touch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

// ---------------------------------------------------------------- state
const S = {
  manifest: null, rooms: {}, eras: {}, wings: {}, detail: {}, loading: {},
  pos: new THREE.Vector3(0, EYE, 11), yaw: 0, pitch: 0,
  keys: new Set(), locked: false, auto: null, hover: null, card: null,
  reduce: store.get("mu-rm") === "1" || (store.get("mu-rm") == null && mqReduce.matches),
  where: "", dirty: true, started: false, regions: [], exhibits: [], lampAnchors: []
};

// ---------------------------------------------------------------- renderer
let renderer, scene, camera, lantern, pool = [], lampPoints;
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
  canvas.setAttribute("aria-label", "The museum in 3D. Use the Room guide button for an accessible list of this room's exhibits.");
  $("mu-stage").appendChild(canvas);
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b0704");
  scene.fog = new THREE.Fog("#0b0704", 10, 52);
  camera = new THREE.PerspectiveCamera(touch ? 70 : 64, 1, 0.05, 140);
  scene.add(camera);
  scene.add(new THREE.HemisphereLight("#8a6a44", "#1a120a", 1.15));
  scene.add(new THREE.AmbientLight("#40301f", 0.6));
  lantern = new THREE.PointLight("#ffcf94", 5, 9, 1.6);
  camera.add(lantern);
  for (let i = 0; i < 4; i++) { const l = new THREE.PointLight("#ffb46a", 0, 22, 1.6); scene.add(l); pool.push(l); }
  resize();
  window.addEventListener("resize", resize);
}
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  S.dirty = true;
}

// ---------------------------------------------------------------- procedural textures
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d"); draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}
function noise(g, w, h, n, a, colors) {
  for (let i = 0; i < n; i++) { g.fillStyle = colors[i % colors.length]; g.globalAlpha = Math.random() * a; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 3); }
  g.globalAlpha = 1;
}
const TEX = {};
function makeTextures() {
  TEX.floor = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#3a2c1e"; g.fillRect(0, 0, w, h);
    const s = w / 2;
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      const v = 44 + Math.random() * 16; g.fillStyle = `rgb(${v + 14},${v + 2},${v - 12})`;
      g.fillRect(x * s + 3, y * s + 3, s - 6, s - 6);
    }
    noise(g, w, h, 9000, 0.22, ["#1d140c", "#6a5438", "#2b2015"]);
    g.strokeStyle = "rgba(15,10,5,.9)"; g.lineWidth = 5; g.strokeRect(0, 0, w, h); g.beginPath(); g.moveTo(s, 0); g.lineTo(s, h); g.moveTo(0, s); g.lineTo(w, s); g.stroke();
  }, true);
  TEX.wall = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#5a4630"; g.fillRect(0, 0, w, h);
    const rows = 4, rh = h / rows;
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * w / 4;
      for (let x = -w / 2; x < w; x += w / 2) {
        const v = 78 + Math.random() * 18; g.fillStyle = `rgb(${v + 18},${v + 2},${v - 20})`;
        g.fillRect(x + off + 3, r * rh + 3, w / 2 - 6, rh - 6);
      }
    }
    noise(g, w, h, 12000, 0.18, ["#3b2c1c", "#9c8058", "#4a3825"]);
  }, true);
  TEX.dado = canvasTex(256, 64, (g, w, h) => {
    g.fillStyle = "#2a1c10"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#1a1008"; g.lineWidth = 2; for (let x = 0; x < w; x += 64) { g.strokeRect(x + 6, 8, 52, h - 16); }
    noise(g, w, h, 1500, 0.2, ["#120a04", "#4a3420"]);
  }, true);
  TEX.ceil = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = "#1b120a"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#3a2816"; g.lineWidth = 10; g.strokeRect(0, 0, w, h);
    g.strokeStyle = "#2a1c0f"; g.lineWidth = 4; g.strokeRect(24, 24, w - 48, h - 48);
    noise(g, w, h, 1500, 0.2, ["#0e0804", "#3c2a18"]);
  }, true);
  TEX.glow = canvasTex(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, "rgba(255,214,150,1)"); r.addColorStop(0.25, "rgba(255,170,90,.55)"); r.addColorStop(1, "rgba(255,140,60,0)");
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  });
  TEX.mosaic = canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = "#c9b48c"; g.fillRect(0, 0, w, h);
    const cols = ["#8c3b24", "#d8c9a3", "#3d3020", "#a0763e", "#6f5a3a"];
    for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) {
      const cx = x - w / 2, cy = y - h / 2, d = Math.hypot(cx, cy);
      const ring = Math.floor(d / 34) % 5;
      g.fillStyle = (Math.abs(cx) < 6 || Math.abs(cy) < 6) && d < 150 ? cols[2] : cols[(ring + ((x + y) / 8) % 2) % cols.length];
      g.fillRect(x + 1, y + 1, 6, 6);
    }
    g.strokeStyle = "#3d3020"; g.lineWidth = 10; g.strokeRect(6, 6, w - 12, h - 12);
  });
}
const MAT = {};
function makeMaterials() {
  MAT.floor = new THREE.MeshLambertMaterial({ map: TEX.floor });
  MAT.wall = new THREE.MeshLambertMaterial({ map: TEX.wall, side: THREE.DoubleSide });
  MAT.dado = new THREE.MeshLambertMaterial({ map: TEX.dado, side: THREE.DoubleSide });
  MAT.ceil = new THREE.MeshLambertMaterial({ map: TEX.ceil, side: THREE.DoubleSide });
  MAT.bronze = new THREE.MeshPhongMaterial({ color: "#5a3e22", specular: "#8f6c40", shininess: 30, emissive: "#0e0803" });
  MAT.frame = new THREE.MeshLambertMaterial({ color: "#3a2614" });
  MAT.stone = new THREE.MeshLambertMaterial({ color: "#6d5a44" });
  MAT.darkstone = new THREE.MeshLambertMaterial({ color: "#2a1f16" });
  MAT.wood = new THREE.MeshLambertMaterial({ color: "#4a2f1a" });
  MAT.glass = new THREE.MeshPhongMaterial({ color: "#cfe2e6", specular: "#ffffff", shininess: 120, transparent: true, opacity: 0.13, depthWrite: false });
  MAT.parch = new THREE.MeshLambertMaterial({ color: "#d9c79f" });
  MAT.leather = new THREE.MeshLambertMaterial({ color: "#5a2f1c" });
  MAT.gold = new THREE.MeshPhongMaterial({ color: "#c9a04c", specular: "#fff0c0", shininess: 80, emissive: "#2a1a06" });
  MAT.clay = new THREE.MeshLambertMaterial({ color: "#a6784c" });
  MAT.bone = new THREE.MeshLambertMaterial({ color: "#d8cdb2" });
  MAT.linen = new THREE.MeshLambertMaterial({ color: "#d9d0bb" });
  MAT.verdigris = new THREE.MeshPhongMaterial({ color: "#3f6f5c", specular: "#b8d8c0", shininess: 30 });
  MAT.flame = new THREE.MeshBasicMaterial({ color: "#ffd08a" });
  MAT.hit = new THREE.MeshBasicMaterial({ visible: false });
}

// text on a canvas (signs, plaques, lecterns)
function textTex(lines, o) {
  o = Object.assign({ w: 512, h: 128, bg: "#1c130b", fg: GOLD, sub: "#b79d74", size: 44, font: "Cinzel", frame: true }, o || {});
  return canvasTex(o.w, o.h, (g, w, h) => {
    g.fillStyle = o.bg; g.fillRect(0, 0, w, h);
    if (o.frame) { g.strokeStyle = GOLD_DIM; g.lineWidth = Math.max(3, w / 160); g.strokeRect(g.lineWidth * 1.5, g.lineWidth * 1.5, w - g.lineWidth * 3, h - g.lineWidth * 3); }
    g.textAlign = "center"; g.textBaseline = "middle";
    const n = lines.length, lh = h / (n + 1);
    lines.forEach((ln, i) => {
      const main = i === 0;
      let size = main ? o.size : Math.round(o.size * 0.58);
      g.font = `${main ? 600 : 500} ${size}px ${o.font}, Georgia, serif`;
      while (g.measureText(ln).width > w * 0.9 && size > 10) { size -= 2; g.font = `${main ? 600 : 500} ${size}px ${o.font}, Georgia, serif`; }
      g.fillStyle = main ? o.fg : o.sub;
      g.fillText(ln, w / 2, lh * (i + 1) + (n === 1 ? 0 : (i === 0 ? -lh * 0.1 : lh * 0.1)));
    });
  });
}
// the archive's SVG art onto a canvas
function svgTex(svg, o) {
  o = Object.assign({ size: 512, bg: "#16100a", pad: 0.12, round: false, rim: true }, o || {});
  const c = document.createElement("canvas"); c.width = c.height = o.size;
  const g = c.getContext("2d");
  const paint = () => {
    g.fillStyle = o.bg; g.fillRect(0, 0, o.size, o.size);
    const r = g.createRadialGradient(o.size / 2, o.size * 0.4, 0, o.size / 2, o.size / 2, o.size * 0.7);
    r.addColorStop(0, "rgba(90,60,30,.35)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = r; g.fillRect(0, 0, o.size, o.size);
  };
  paint();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (svg) {
    const img = new Image();
    img.onload = () => {
      const p = o.size * o.pad;
      g.drawImage(img, p, p, o.size - 2 * p, o.size - 2 * p);
      t.needsUpdate = true; S.dirty = true;
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  return t;
}

// ---------------------------------------------------------------- geometry helpers
function quad(ax, az, bx, bz, y0, y1, uScale, vScale) {
  const len = Math.hypot(bx - ax, bz - az), nx = (bz - az) / len, nz = -(bx - ax) / len;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([ax, y0, az, bx, y0, bz, bx, y1, bz, ax, y1, az], 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute([nx, 0, nz, nx, 0, nz, nx, 0, nz, nx, 0, nz], 3));
  const us = uScale || 2, vs = vScale || 2;
  g.setAttribute("uv", new THREE.Float32BufferAttribute([0, y0 / vs, len / us, y0 / vs, len / us, y1 / vs, 0, y1 / vs], 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  return g;
}
function flat(x0, x1, z0, z1, y, down, s) {
  const g = new THREE.BufferGeometry(), sc = s || 2;
  g.setAttribute("position", new THREE.Float32BufferAttribute([x0, y, z0, x1, y, z0, x1, y, z1, x0, y, z1], 3));
  const ny = down ? -1 : 1;
  g.setAttribute("normal", new THREE.Float32BufferAttribute([0, ny, 0, 0, ny, 0, 0, ny, 0, 0, ny, 0], 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute([x0 / sc, z0 / sc, x1 / sc, z0 / sc, x1 / sc, z1 / sc, x0 / sc, z1 / sc], 2));
  g.setIndex(down ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
  return g;
}
function merge(list) {
  let nv = 0, ni = 0;
  for (const g of list) { nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint32Array(ni);
  let ov = 0, oi = 0;
  for (const g of list) {
    const c = g.attributes.position.count;
    pos.set(g.attributes.position.array, ov * 3); nor.set(g.attributes.normal.array, ov * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, ov * 2);
    if (g.index) { const a = g.index.array; for (let i = 0; i < a.length; i++) idx[oi + i] = a[i] + ov; oi += a.length; }
    else { for (let i = 0; i < c; i++) idx[oi + i] = ov + i; oi += c; }
    ov += c; g.dispose();
  }
  const m = new THREE.BufferGeometry();
  m.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  m.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  m.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  m.setIndex(new THREE.BufferAttribute(idx, 1));
  m.computeBoundingSphere(); m.computeBoundingBox();
  return m;
}
function boxAt(w, h, d, x, y, z, rotY) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rotY) g.rotateY(rotY);
  g.translate(x, y, z);
  return g;
}

// ---------------------------------------------------------------- collision (circle vs wall segments, hashed)
const SEGS = [], GRID = new Map(), CELL = 8;
function addSeg(ax, az, bx, bz, owner) {
  const s = [ax, az, bx, bz]; SEGS.push(s);
  if (owner) owner.push(s);
  const x0 = Math.floor(Math.min(ax, bx) / CELL), x1 = Math.floor(Math.max(ax, bx) / CELL);
  const z0 = Math.floor(Math.min(az, bz) / CELL), z1 = Math.floor(Math.max(az, bz) / CELL);
  for (let i = x0; i <= x1; i++) for (let j = z0; j <= z1; j++) { const k = i + "," + j; if (!GRID.has(k)) GRID.set(k, []); GRID.get(k).push(s); }
}
function collide(p) {
  for (let iter = 0; iter < 3; iter++) {
    const ci = Math.floor(p.x / CELL), cj = Math.floor(p.z / CELL);
    for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) {
      const list = GRID.get(i + "," + j); if (!list) continue;
      for (const s of list) {
        const dx = s[2] - s[0], dz = s[3] - s[1], L2 = dx * dx + dz * dz;
        let t = L2 ? ((p.x - s[0]) * dx + (p.z - s[1]) * dz) / L2 : 0; t = Math.max(0, Math.min(1, t));
        const cx = s[0] + t * dx, cz = s[1] + t * dz, ex = p.x - cx, ez = p.z - cz, d = Math.hypot(ex, ez);
        if (d < RADIUS && d > 1e-6) { const push = (RADIUS - d) / d; p.x += ex * push; p.z += ez * push; }
      }
    }
  }
}

// ---------------------------------------------------------------- building
// bucket of geometry per "zone" (entrance, rotunda, spine, each wing) merged into a few meshes
const ZONES = {};
function zone(id) {
  if (!ZONES[id]) ZONES[id] = { id, floor: [], wall: [], dado: [], ceil: [], trim: [], segs: [], group: new THREE.Group(), box: new THREE.Box3() };
  return ZONES[id];
}
// a straight wall with door gaps; gaps are [start, end] distances along the wall
function wall(z, ax, az, bx, bz, h, gaps, doorH) {
  const len = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / len, uz = (bz - az) / len;
  const pts = [0]; (gaps || []).slice().sort((a, b) => a[0] - b[0]).forEach((g) => pts.push(g[0], g[1])); pts.push(len);
  const P = (t) => [ax + ux * t, az + uz * t];
  for (let i = 0; i < pts.length; i += 2) {
    const [x0, z0] = P(pts[i]), [x1, z1] = P(pts[i + 1]);
    if (pts[i + 1] - pts[i] < 0.01) continue;
    z.wall.push(quad(x0, z0, x1, z1, 0, h));
    z.dado.push(quad(x0, z0, x1, z1, 0, 0.95, 2, 0.95));
    addSeg(x0, z0, x1, z1);
  }
  for (let i = 1; i < pts.length - 1; i += 2) {
    const [x0, z0] = P(pts[i]), [x1, z1] = P(pts[i + 1]), dh = doorH || DOOR_H;
    z.wall.push(quad(x0, z0, x1, z1, dh, h));
    // bronze door frame
    const ang = Math.atan2(ux, uz) + Math.PI / 2;
    z.trim.push(boxAt(0.16, dh, 0.42, x0, dh / 2, z0, ang), boxAt(0.16, dh, 0.42, x1, dh / 2, z1, ang));
    z.trim.push(boxAt(Math.hypot(x1 - x0, z1 - z0) + 0.16, 0.16, 0.42, (x0 + x1) / 2, dh, (z0 + z1) / 2, ang));
  }
}
function rect(z, x0, x1, z0, z1, h) {
  z.floor.push(flat(x0, x1, z0, z1, 0, false));
  z.ceil.push(flat(x0, x1, z0, z1, h, true, 3));
  z.box.expandByPoint(new THREE.Vector3(x0, 0, z0)); z.box.expandByPoint(new THREE.Vector3(x1, h, z1));
}
function finishZones() {
  for (const z of Object.values(ZONES)) {
    for (const [k, mat] of [["floor", MAT.floor], ["wall", MAT.wall], ["dado", MAT.dado], ["ceil", MAT.ceil], ["trim", MAT.frame]]) {
      if (!z[k].length) continue;
      const m = new THREE.Mesh(merge(z[k]), mat); m.matrixAutoUpdate = false; z.group.add(m); z[k] = [];
    }
    scene.add(z.group);
  }
}
function region(id, label, x0, x1, z0, z1, extra) { S.regions.push(Object.assign({ id, label, x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1) }, extra || {})); }
function lamp(x, y, z, strength) { S.lampAnchors.push({ p: new THREE.Vector3(x, y, z), s: strength || 1 }); }

// room frames: origin on the entrance wall, F into the room, R to the right
function frame(ox, oz, fx, fz) { return { ox, oz, fx, fz, rx: -fz, rz: fx }; }
const W = (f, u, v) => [f.ox + f.rx * u + f.fx * v, f.oz + f.rz * u + f.fz * v];
const faceYaw = (dx, dz) => Math.atan2(dx, dz); // rotation.y that turns a +z-facing plane toward (dx, dz)

function build() {
  const M = S.manifest;
  // ---- entrance hall
  const zh = zone("hall");
  rect(zh, HALL.x0, HALL.x1, HALL.z0, HALL.z1, HALL.h);
  wall(zh, HALL.x0, HALL.z1, HALL.x1, HALL.z1, HALL.h);
  wall(zh, HALL.x0, HALL.z0, HALL.x0, HALL.z1, HALL.h);
  wall(zh, HALL.x1, HALL.z0, HALL.x1, HALL.z1, HALL.h);
  wall(zh, HALL.x0, HALL.z0, HALL.x1, HALL.z0, HALL.h, [[9 - 2, 9 + 2]], 4.2);
  // passage to the rotunda
  rect(zh, -2, 2, ROT.cz + ROT.r, 0, 4.2);
  wall(zh, -2, ROT.cz + ROT.r, -2, 0, 4.2); wall(zh, 2, ROT.cz + ROT.r, 2, 0, 4.2);
  region("hall", "The entrance hall", HALL.x0, HALL.x1, ROT.cz + ROT.r, HALL.z1);
  lamp(0, 5.6, 7, 1.3); lamp(-6, 4.5, 3); lamp(6, 4.5, 3);
  for (const x of [-5, 5]) for (const zc of [4, 10]) zh.trim.push(new THREE.CylinderGeometry(0.42, 0.5, HALL.h, 12).translate(x, HALL.h / 2, zc));
  for (const x of [-5, 5]) for (const zc of [4, 10]) addBox(x, zc, 0.5);

  // ---- rotunda
  const zr = zone("rotunda");
  const N = 48, gapA = Math.asin(2.1 / ROT.r);
  const floorG = new THREE.CircleGeometry(ROT.r, N).rotateX(-Math.PI / 2).translate(ROT.cx, 0, ROT.cz);
  scaleUV(floorG, ROT.r / 1.5); zr.floor.push(floorG);
  const dome = new THREE.SphereGeometry(ROT.r, N, 16, 0, Math.PI * 2, 0, Math.PI / 2).translate(ROT.cx, ROT.h, ROT.cz);
  scaleUV(dome, 6); zr.ceil.push(dome);
  for (let i = 0; i < N; i++) {
    const a0 = i / N * Math.PI * 2, a1 = (i + 1) / N * Math.PI * 2, mid = (a0 + a1) / 2;
    const gapS = Math.abs(angDiff(mid, Math.PI / 2)) < gapA, gapN = Math.abs(angDiff(mid, -Math.PI / 2)) < gapA;
    const x0 = ROT.cx + ROT.r * Math.cos(a0), z0 = ROT.cz + ROT.r * Math.sin(a0), x1 = ROT.cx + ROT.r * Math.cos(a1), z1 = ROT.cz + ROT.r * Math.sin(a1);
    if (gapS || gapN) { zr.wall.push(quad(x0, z0, x1, z1, gapS ? 4.2 : WING_DOOR_H, ROT.h)); continue; }
    zr.wall.push(quad(x0, z0, x1, z1, 0, ROT.h)); zr.dado.push(quad(x0, z0, x1, z1, 0, 0.95, 2, 0.95)); addSeg(x0, z0, x1, z1);
  }
  zr.box.set(new THREE.Vector3(-ROT.r, 0, ROT.cz - ROT.r), new THREE.Vector3(ROT.r, ROT.h + ROT.r, ROT.cz + ROT.r));
  region("rotunda", "The Rotunda · Comparative themes", -ROT.r, ROT.r, ROT.cz - ROT.r, ROT.cz + ROT.r, { round: true });
  lamp(ROT.cx, 7, ROT.cz, 1.6);
  // theme bays (8 positions, the eighth for a theme still in preparation)
  const themeRooms = M.themes;
  themeRooms.forEach((t, k) => {
    const a = Math.PI / 2 + Math.PI / 8 + k * Math.PI / 4;
    const px = ROT.cx + (ROT.r - 0.05) * Math.cos(a), pz = ROT.cz + (ROT.r - 0.05) * Math.sin(a);
    const f = frame(px, pz, -Math.cos(a), -Math.sin(a));
    const id = t.chapter;
    lamp(px - Math.cos(a) * 3, 5, pz - Math.sin(a) * 3, 1.3);
    if (id && S.rooms[id]) { S.rooms[id].frame = f; S.rooms[id].bay = true; S.rooms[id].zone = "rotunda"; }
    else S.reservedBay = { f, t };
  });

  // ---- spine
  const zs = zone("spine");
  const nW = M.eras.length, zEnd = WING_Z0 - (nW - 1) * WING_STEP - 12;
  S.spineEnd = zEnd;
  rect(zs, -SPINE_HALF, SPINE_HALF, zEnd, SPINE_Z0, SPINE_H);
  const doorsW = [], doorsE = [];
  M.eras.forEach((e, k) => { const zk = WING_Z0 - k * WING_STEP; (k % 2 === 0 ? doorsW : doorsE).push([SPINE_Z0 - zk - WING_DOOR / 2, SPINE_Z0 - zk + WING_DOOR / 2]); });
  wall(zs, -SPINE_HALF, SPINE_Z0, -SPINE_HALF, zEnd, SPINE_H, doorsW, WING_DOOR_H);
  wall(zs, SPINE_HALF, SPINE_Z0, SPINE_HALF, zEnd, SPINE_H, doorsE, WING_DOOR_H);
  wall(zs, -SPINE_HALF, zEnd, SPINE_HALF, zEnd, SPINE_H);
  // the short joins between the rotunda's round wall and the spine's straight walls
  for (const sx of [-1, 1]) { const ax = sx * 2.1, az = ROT.cz - Math.sqrt(ROT.r * ROT.r - 2.1 * 2.1); zs.wall.push(quad(ax, az, sx * SPINE_HALF, SPINE_Z0, 0, SPINE_H)); addSeg(ax, az, sx * SPINE_HALF, SPINE_Z0); }
  zs.floor.push(flat(-2.3, 2.3, SPINE_Z0, SPINE_Z0 + 0.5, -0.004, false));
  region("spine", "The Spine gallery", -SPINE_HALF, SPINE_HALF, zEnd, SPINE_Z0);
  for (let zc = SPINE_Z0 - 6; zc > zEnd; zc -= 10) lamp(0, 6.4, zc, 1.1);
  // pilasters along the spine, clear of the wing doors
  for (let zc = SPINE_Z0 - 3; zc > zEnd + 1; zc -= 4) {
    for (const sx of [-1, 1]) {
      const blocked = M.eras.some((e, k) => (k % 2 === 0 ? -1 : 1) === sx && Math.abs(zc - (WING_Z0 - k * WING_STEP)) < WING_DOOR / 2 + 0.8);
      if (!blocked) zs.trim.push(boxAt(0.5, SPINE_H, 0.5, sx * (SPINE_HALF - 0.2), SPINE_H / 2, zc));
    }
  }

  // ---- wings and rooms
  M.eras.forEach((e, k) => {
    const ids = M.wings[e.slug] || [];
    const s = k % 2 === 0 ? -1 : 1, zk = WING_Z0 - k * WING_STEP;
    const slots = Math.max(1, Math.ceil(ids.length / 2)), len = slots * ROOM_W + 1;
    const xa = s * SPINE_HALF, xb = s * (SPINE_HALF + len);
    const zw = zone(e.slug);
    S.eras[e.slug] = Object.assign({}, e, { k, side: s, zk, xa, xb });
    rect(zw, Math.min(xa, xb), Math.max(xa, xb), zk - COR_W / 2, zk + COR_W / 2, COR_H);
    region("wing-" + e.slug, "Wing " + e.num + " · " + e.name, xa, xb, zk - COR_W / 2, zk + COR_W / 2, { era: e.slug });
    const gapsN = [], gapsS = [];
    ids.forEach((id, i) => {
      const j = Math.floor(i / 2), north = i % 2 === 0;
      const along = 0.5 + j * ROOM_W + ROOM_W / 2;         // distance from the spine wall to the room's centre line
      const cx = s * (SPINE_HALF + along);
      (north ? gapsN : gapsS).push([along - DOOR_W / 2, along + DOOR_W / 2]);
      const ez = north ? zk - COR_W / 2 : zk + COR_W / 2, bz = north ? ez - ROOM_D : ez + ROOM_D;
      const f = frame(cx, ez, 0, north ? -1 : 1);
      const x0 = cx - ROOM_W / 2, x1 = cx + ROOM_W / 2;
      rect(zw, x0, x1, Math.min(ez, bz), Math.max(ez, bz), ROOM_H);
      wall(zw, x0, bz, x1, bz, ROOM_H);
      wall(zw, x0, ez, x0, bz, ROOM_H);
      wall(zw, x1, ez, x1, bz, ROOM_H);
      const r = S.rooms[id];
      Object.assign(r, { frame: f, zone: e.slug, era: e.slug, cx, cz: (ez + bz) / 2 });
      region("room-" + id, r.title, x0, x1, ez, bz, { room: id, era: e.slug });
      lamp(cx, 4.4, (ez + bz) / 2, 1);
    });
    // corridor walls; they run outward from the spine, so a door's distance along the wall is its distance from the spine
    wall(zw, xa, zk - COR_W / 2, xb, zk - COR_W / 2, ROOM_H, gapsN);
    wall(zw, xa, zk + COR_W / 2, xb, zk + COR_W / 2, ROOM_H, gapsS);
    wall(zw, xb, zk - COR_W / 2, xb, zk + COR_W / 2, COR_H);
    for (let a = 4; a < len; a += 8) lamp(s * (SPINE_HALF + a), 3.9, zk, 0.7);
  });
  finishZones();
  // lamp glows (one Points object)
  const lp = new Float32Array(S.lampAnchors.length * 3);
  S.lampAnchors.forEach((l, i) => lp.set([l.p.x, l.p.y, l.p.z], i * 3));
  const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.BufferAttribute(lp, 3));
  lampPoints = new THREE.Points(lg, new THREE.PointsMaterial({ map: TEX.glow, size: 1.1, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: "#ffd9a0" }));
  scene.add(lampPoints);
  const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), MAT.flame, S.lampAnchors.length);
  const mtx = new THREE.Matrix4();
  S.lampAnchors.forEach((l, i) => { mtx.makeTranslation(l.p.x, l.p.y, l.p.z); bulbs.setMatrixAt(i, mtx); });
  scene.add(bulbs);
  buildStatic();
}
function scaleUV(g, s) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * s, uv.getY(i) * s); }
function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; }
function addBox(x, z, r, owner, rz) { const q = rz || r; addSeg(x - r, z - q, x + r, z - q, owner); addSeg(x + r, z - q, x + r, z + q, owner); addSeg(x + r, z + q, x - r, z + q, owner); addSeg(x - r, z + q, x - r, z - q, owner); }
function removeSegs(list) {
  const dead = new Set(list);
  for (const [k, arr] of GRID) { const keep = arr.filter((s) => !dead.has(s)); if (keep.length !== arr.length) GRID.set(k, keep); }
  list.length = 0;
}

// ---------------------------------------------------------------- exhibits
// every exhibit: { key, mesh (for raycast), center, data: {type, ...}, zone }
function addExhibit(group, hitMesh, data, zoneId) {
  hitMesh.userData.exhibit = data;
  group.add(hitMesh);
  hitMesh.updateMatrixWorld(true);
  const c = new THREE.Vector3(); new THREE.Box3().setFromObject(hitMesh).getCenter(c);
  const ex = { mesh: hitMesh, data, center: c, zone: zoneId };
  S.exhibits.push(ex);
  return ex;
}
function plane(w, h, mat) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); }
function placeOnWall(obj, x, y, z, nx, nz) { obj.position.set(x + nx * 0.04, y, z + nz * 0.04); obj.rotation.y = faceYaw(nx, nz); }
// things drawn only when near (signs, boards); far ones are lost in the fog anyway
const LOD = [];
function lod(obj, far) { LOD.push({ obj, far: far || SIGN_FAR }); return obj; }

// signs and exhibits that need no wing detail (entrance, spine, wing doors)
function buildStatic() {
  const g = new THREE.Group(); scene.add(g);
  // entrance: title over the north door, orientation plaque, trails board
  const title = plane(9, 1.6, new THREE.MeshBasicMaterial({ map: textTex(["The Museum", "of the Divine Archives"], { w: 1024, h: 192, size: 78, frame: false, bg: "#140d07" }) }));
  placeOnWall(title, 0, 5.4, HALL.z0, 0, 1); g.add(lod(title, 34));
  const plaque = plane(2.4, 1.5, new THREE.MeshLambertMaterial({ map: textTex(["About this museum", "how to read the exhibits"], { w: 512, h: 320, size: 40 }) }));
  placeOnWall(plaque, HALL.x0, 1.9, 7, 1, 0); g.add(plaque);
  addExhibit(g, hitBoxFor(plaque, 0.2), { type: "about", name: "About this museum" }, "hall");
  const trails = plane(2.4, 1.5, new THREE.MeshLambertMaterial({ map: textTex(["Trails", "walk one tradition through the ages"], { w: 512, h: 320, size: 44 }) }));
  placeOnWall(trails, HALL.x1, 1.9, 7, -1, 0); g.add(trails);
  addExhibit(g, hitBoxFor(trails, 0.2), { type: "trails", name: "Tradition trails" }, "hall");
  const dir = plane(2.4, 1.5, new THREE.MeshLambertMaterial({ map: textTex(["Directory", "every room, every exhibit"], { w: 512, h: 320, size: 44 }) }));
  placeOnWall(dir, HALL.x1, 1.9, 11.5, -1, 0); g.add(dir);
  addExhibit(g, hitBoxFor(dir, 0.2), { type: "directory", name: "Museum directory" }, "hall");
  // spine: one banner per Age opposite its wing door, and a sign over the door
  S.manifest.eras.forEach((e) => {
    const E = S.eras[e.slug], s = E.side;
    const sign = plane(3.8, 0.75, new THREE.MeshBasicMaterial({ map: textTex(["Wing " + e.num + " · " + e.name, e.dates], { w: 768, h: 150, size: 46 }) }));
    placeOnWall(sign, s * SPINE_HALF, WING_DOOR_H + 0.75, E.zk, -s, 0); g.add(lod(sign, 40));
    const banner = plane(2.6, 3.4, new THREE.MeshLambertMaterial({ map: textTex([e.num, e.name, e.dates], { w: 384, h: 512, size: 110 }) }));
    placeOnWall(banner, -s * SPINE_HALF, 3.1, E.zk, s, 0); g.add(lod(banner, 30));
    addExhibit(g, hitBoxFor(banner, 0.2), { type: "era", era: e.slug, name: e.name }, "spine");
  });
  const end = plane(3.2, 2, new THREE.MeshLambertMaterial({ map: textTex(["Here the Nine Ages end", "for now"], { w: 512, h: 320, size: 42 }) }));
  placeOnWall(end, 0, 2.6, S.spineEnd, 0, 1); g.add(lod(end, 30));
  addExhibit(g, hitBoxFor(end, 0.2), { type: "end", name: "The end of the gallery" }, "spine");
  // the reserved theme bay
  if (S.reservedBay) {
    const { f, t } = S.reservedBay; const [x, z] = W(f, 0, 0);
    const p = plane(2.6, 1.6, new THREE.MeshLambertMaterial({ map: textTex([t.name, "in preparation"], { w: 512, h: 320, size: 40 }) }));
    placeOnWall(p, x, 2.4, z, f.fx, f.fz); g.add(lod(p, 24));
    addExhibit(g, hitBoxFor(p, 0.2), { type: "reserved", name: t.name }, "rotunda");
  }
  // room door signs are built with each wing's exhibits
}
function hitBoxFor(obj, depth, pad) {
  obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj), sz = new THREE.Vector3(), c = new THREE.Vector3();
  b.getSize(sz); b.getCenter(c);
  const d = depth || 0.2, p = pad || 0.1;
  const m = new THREE.Mesh(new THREE.BoxGeometry(Math.max(sz.x, d) + p, sz.y + p, Math.max(sz.z, d) + p), MAT.hit);
  m.position.copy(c);
  return m;
}

// ---- stand-in props (generic shapes, never replicas)
function prop(kind) {
  const g = new THREE.Group();
  const add = (geo, mat, x, y, z, rx, ry, rz) => { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.rotation.set(rx || 0, ry || 0, rz || 0); g.add(m); return m; };
  switch (kind) {
    case "codex": add(new THREE.BoxGeometry(0.34, 0.07, 0.26), MAT.leather, 0, 0.035); add(new THREE.BoxGeometry(0.32, 0.05, 0.24), MAT.parch, 0.012, 0.035); break;
    case "scroll": add(new THREE.CylinderGeometry(0.05, 0.05, 0.46, 14), MAT.parch, 0, 0.06, 0, 0, 0, Math.PI / 2); add(new THREE.CylinderGeometry(0.018, 0.018, 0.58, 8), MAT.wood, 0, 0.06, 0, 0, 0, Math.PI / 2); break;
    case "slab": add(new THREE.BoxGeometry(0.46, 0.38, 0.08), MAT.stone, 0, 0.19); break;
    case "tablet": add(new THREE.BoxGeometry(0.3, 0.2, 0.05), MAT.clay, 0, 0.12, 0, -0.35); break;
    case "bone": add(new THREE.SphereGeometry(0.16, 16, 10), MAT.bone, 0, 0.04).scale.set(1.3, 0.25, 0.8); break;
    case "spear": add(new THREE.CylinderGeometry(0.012, 0.012, 0.56, 8), MAT.wood, -0.05, 0.05, 0, 0, 0, Math.PI / 2); add(new THREE.ConeGeometry(0.035, 0.2, 10), MAT.gold, 0.32, 0.05, 0, 0, 0, -Math.PI / 2); break;
    case "cloth": for (let i = 0; i < 3; i++) add(new THREE.BoxGeometry(0.4 - i * 0.02, 0.025, 0.28 - i * 0.02), MAT.linen, 0, 0.013 + i * 0.026); break;
    case "ring": add(new THREE.TorusGeometry(0.13, 0.03, 10, 24), MAT.gold, 0, 0.13, 0); break;
    case "chest": add(new THREE.BoxGeometry(0.42, 0.24, 0.26), MAT.gold, 0, 0.12); add(new THREE.BoxGeometry(0.44, 0.04, 0.28), MAT.gold, 0, 0.26); break;
    case "bowl": add(new THREE.SphereGeometry(0.17, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MAT.clay, 0, 0.17); break;
    case "figurine": add(new THREE.CapsuleGeometry(0.06, 0.16, 4, 10), MAT.clay, 0, 0.14); break;
    case "disc": add(new THREE.CylinderGeometry(0.16, 0.16, 0.012, 32), MAT.verdigris, 0, 0.16, 0, Math.PI / 2 - 0.4); break;
    case "cords": add(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 6), MAT.wood, 0, 0.36, 0, 0, 0, Math.PI / 2); for (let i = 0; i < 7; i++) add(new THREE.CylinderGeometry(0.006, 0.006, 0.3, 5), MAT.linen, -0.21 + i * 0.07, 0.21); break;
    case "pillar": add(new THREE.BoxGeometry(0.16, 0.5, 0.1), MAT.stone, 0, 0.25); add(new THREE.BoxGeometry(0.3, 0.08, 0.12), MAT.stone, 0.06, 0.52); break;
    default: add(new THREE.BoxGeometry(0.36, 0.2, 0.24), MAT.wood, 0, 0.1); add(new THREE.BoxGeometry(0.38, 0.05, 0.26), MAT.gold, 0, 0.225);
  }
  return g;
}
function caseAt(group, x, z, yaw, item, id, zoneId) {
  const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = yaw; group.add(c);
  const m = (geo, mat, y) => { const o = new THREE.Mesh(geo, mat); o.position.y = y; c.add(o); return o; };
  if (item.floor) {
    m(new THREE.BoxGeometry(2.4, 0.3, 1.8), MAT.darkstone, 0.15);
    const top = m(new THREE.PlaneGeometry(2.1, 1.5), new THREE.MeshLambertMaterial({ map: TEX.mosaic }), 0.305); top.rotation.x = -Math.PI / 2;
    m(new THREE.BoxGeometry(2.3, 0.02, 1.7), MAT.glass, 0.33);
  } else if (!item.prop) {
    // no image: a plain plaque on a plinth instead of a case (see the Vault entry)
    m(new THREE.BoxGeometry(0.8, 1.0, 0.5), MAT.darkstone, 0.5);
    const p = m(new THREE.PlaneGeometry(0.7, 0.44), new THREE.MeshLambertMaterial({ map: textTex([item.title, "no image shown"], { w: 512, h: 320, size: 34 }) }), 1.12);
    p.rotation.x = -0.5; p.position.z = 0.06;
  } else {
    m(new THREE.BoxGeometry(0.9, 0.95, 0.9), MAT.wood, 0.475);
    m(new THREE.BoxGeometry(0.96, 0.06, 0.96), MAT.bronze, 0.03);
    m(new THREE.BoxGeometry(0.96, 0.05, 0.96), MAT.bronze, 0.95);
    m(new THREE.BoxGeometry(0.86, 0.72, 0.86), MAT.glass, 1.34);
    m(new THREE.BoxGeometry(0.88, 0.03, 0.88), MAT.bronze, 1.715);
    const p = prop(item.prop); p.position.y = 0.975; c.add(p);
    if (item.forgery) { const band = m(new THREE.PlaneGeometry(0.86, 0.14), new THREE.MeshBasicMaterial({ map: textTex(["PROVEN FORGERY"], { w: 512, h: 84, size: 44, fg: "#f0a878", bg: "#2a120a" }) }), 0.8); band.position.z = 0.456; }
  }
  const hit = hitBoxFor(c, 0.4, 0.05);
  const bb = new THREE.Box3().setFromObject(c), Z = ZONES[zoneId];
  addBox((bb.min.x + bb.max.x) / 2, (bb.min.z + bb.max.z) / 2, (bb.max.x - bb.min.x) / 2 + 0.02, Z.segs, (bb.max.z - bb.min.z) / 2 + 0.02);
  return addExhibit(group, hit, { type: "vault", id, name: item.title }, zoneId);
}
function medallion(group, x, y, z, nx, nz, fig, id, zoneId, scale) {
  const s = scale || 1, g = new THREE.Group();
  if (fig.glyph) {
    const frameM = new THREE.Mesh(new THREE.BoxGeometry(1.25 * s, 0.95 * s, 0.06), MAT.bronze); g.add(frameM);
    const face = plane(1.1 * s, 0.8 * s, new THREE.MeshLambertMaterial({ map: svgTex(fig.svg, { size: 256, pad: -0.05 }) })); face.position.z = 0.035; g.add(face);
  } else {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.56 * s, 0.05 * s, 8, 40), MAT.bronze); g.add(ring);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.54 * s, 40), new THREE.MeshLambertMaterial({ map: svgTex(fig.svg, { size: 256, pad: 0 }) })); disc.position.z = 0.02; g.add(disc);
  }
  placeOnWall(g, x, y, z, nx, nz); group.add(g);
  return addExhibit(group, hitBoxFor(g, 0.25), { type: "fig", id, name: fig.name }, zoneId);
}
function wallBoard(group, x, y, z, nx, nz, w, h, lines, data, zoneId, o) {
  const p = plane(w, h, new THREE.MeshLambertMaterial({ map: textTex(lines, Object.assign({ w: 512, h: Math.round(512 * h / w) }, o || {})) }));
  const back = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.05), MAT.bronze);
  const g = new THREE.Group(); back.position.z = -0.03; g.add(back); g.add(p);
  placeOnWall(g, x, y, z, nx, nz); group.add(g);
  return addExhibit(group, hitBoxFor(g, 0.2), data, zoneId);
}

// build every room of a zone (wing or rotunda) once its detail file is here
function buildWingExhibits(zoneId) {
  const D = S.detail[zoneId], Z = ZONES[zoneId];
  if (!D || !Z || Z.built) return;
  const g = new THREE.Group(); g.name = "exhibits-" + zoneId; Z.exGroup = g; Z.built = true;
  const ids = zoneId === "rotunda" ? S.manifest.themes.map((t) => t.chapter).filter((id) => id && S.rooms[id]) : (S.manifest.wings[zoneId] || []);
  const outer = g;
  for (const id of ids) {
    const r = S.rooms[id], f = r.frame, d = D.rooms[id];
    if (!f || !d) continue;
    const Wp = (u, v) => W(f, u, v);
    const g = new THREE.Group(); g.name = "room-" + id; outer.add(g);
    if (r.bay) { g.userData.box = new THREE.Box3(new THREE.Vector3(-ROT.r, 0, ROT.cz - ROT.r), new THREE.Vector3(ROT.r, 9, ROT.cz + ROT.r)); buildBay(g, zoneId, id, r, f, d); bake(g); continue; }
    {
      const reg = S.regions.find((x) => x.room === id);
      g.userData.box = new THREE.Box3(new THREE.Vector3(reg.x0, 0, reg.z0), new THREE.Vector3(reg.x1, ROOM_H, reg.z1));
      // door sign in the corridor
      const [sx, sz] = Wp(0, 0);
      const sign = plane(3.4, 0.62, new THREE.MeshBasicMaterial({ map: textTex([r.title], { w: 640, h: 116, size: 48 }) }));
      placeOnWall(sign, sx, DOOR_H + 0.6, sz, -f.fx, -f.fz); g.add(sign); lod(sign, 22);
      // chapter lectern
      lectern(g, ...Wp(-3.2, 2.2), f, { type: "room", id, name: r.title }, zoneId, r.title);
      // symbol carving on the back wall
      if (d.plate) {
        const [px, pz] = Wp(0, ROOM_D - 0.02);
        const panel = new THREE.Group();
        const face = plane(3, 3, new THREE.MeshLambertMaterial({ map: svgTex(d.plate, { size: 512, pad: 0.1, bg: "#1a120b" }) }));
        const back = new THREE.Mesh(new THREE.BoxGeometry(3.25, 3.25, 0.08), MAT.bronze); back.position.z = -0.05;
        panel.add(back, face); placeOnWall(panel, px, 2.7, pz, -f.fx, -f.fz); g.add(panel);
        addExhibit(g, hitBoxFor(panel, 0.2), { type: "plate", id, name: "The symbol of " + r.title }, zoneId);
      }
      // Vault cases: two columns down the middle
      const slots = [[-2.3, 5], [2.3, 5], [-2.3, 8.2], [2.3, 8.2], [-2.3, 11.2], [2.3, 11.2]];
      let si = 0;
      r.homeVault.forEach((vid) => {
        const item = D.vault[vid]; if (!item) return;
        if (item.floor) { const [x, z] = Wp(0, 6.6); caseAt(g, x, z, faceYaw(-f.fx, -f.fz), item, vid, zoneId); return; }
        const sl = slots[si++] || [0, 3.5 + si]; const [x, z] = Wp(sl[0], sl[1]);
        caseAt(g, x, z, faceYaw(-f.fx, -f.fz), item, vid, zoneId);
      });
      // Pantheon figures on the side walls
      const figs = r.homeFigs.filter((fid) => D.figs[fid]);
      const perSide = Math.ceil(figs.length / 2), rows = perSide > 6 ? 2 : 1, perRow = Math.ceil(perSide / rows);
      figs.forEach((fid, i) => {
        const side = i % 2 === 0 ? -1 : 1, n = Math.floor(i / 2), row = Math.floor(n / perRow), col = n % perRow;
        const v = perRow === 1 ? 7.5 : 3.4 + col * (9.6 / Math.max(1, perRow - 1));
        const y = rows === 1 ? 2.1 : (row === 0 ? 1.55 : 3.1);
        const [x, z] = Wp(side * (ROOM_W / 2 - 0.02), v);
        medallion(g, x, y, z, -side * f.rx, -side * f.rz, D.figs[fid], fid, zoneId, rows === 1 ? 1 : 0.82);
      });
      // see-also board beside the door, inside the room
      const nSee = r.seeVault.length + r.seeFigs.length;
      if (nSee) { const [x, z] = Wp(3.6, 0.02); wallBoard(g, x, 2.1, z, f.fx, f.fz, 1.6, 1.9, ["See also", nSee + " in other rooms"], { type: "see", id, name: "See also" }, zoneId, { size: 60 }); }
      // living tradition note, the other side of the door
      if (r.living) { const [x, z] = Wp(-3.6, 0.02); wallBoard(g, x, 2.1, z, f.fx, f.fz, 1.6, 1.2, ["A living tradition"], { type: "living", id, name: "A living tradition" }, zoneId, { size: 44 }); }
      // game kiosk
      if (d.game) kiosk(g, ...Wp(4.4, 12.2), f, d, id, zoneId);
      // the corridor sign stays visible from outside the room
      outer.add(sign);
    }
    bake(g);
  }
  scene.add(outer);
  roomVisibility(Z);
  S.dirty = true;
}
// merge every untextured part of a room into one mesh per shared material (few draw calls)
function bake(room) {
  const shared = new Set([MAT.wood, MAT.bronze, MAT.glass, MAT.stone, MAT.darkstone, MAT.parch, MAT.leather, MAT.gold, MAT.clay, MAT.bone, MAT.linen, MAT.verdigris]);
  room.updateMatrixWorld(true);
  const buckets = new Map(), dead = [];
  room.traverse((o) => { if (o.isMesh && shared.has(o.material)) dead.push(o); });
  for (const o of dead) {
    const geo = o.geometry.clone().applyMatrix4(o.matrixWorld);
    if (!geo.attributes.uv) geo.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    if (!buckets.has(o.material)) buckets.set(o.material, []);
    buckets.get(o.material).push(geo);
    o.geometry.dispose(); o.parent.remove(o);
  }
  for (const [mat, list] of buckets) { const m = new THREE.Mesh(merge(list), mat); m.matrixAutoUpdate = false; if (mat === MAT.glass) m.renderOrder = 2; room.add(m); }
}
function lectern(g, x, z, f, data, zoneId, title) {
  const L = new THREE.Group(); L.position.set(x, 0, z); L.rotation.y = faceYaw(-f.fx, -f.fz);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.0, 0.18), MAT.wood); post.position.y = 0.5; L.add(post);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.5), MAT.bronze); base.position.y = 0.03; L.add(base);
  // the reading desk: a tilted slab with the page lying on its top face
  const desk = new THREE.Group(); desk.position.set(0, 1.06, 0); desk.rotation.x = 0.6; L.add(desk);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.04, 0.54), MAT.wood); desk.add(slab);
  const top = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), new THREE.MeshLambertMaterial({ map: textTex([title, "read the chapter"], { w: 512, h: 360, size: 46, bg: "#d6c39a", fg: "#3a2410", sub: "#6a4a28", frame: false }) }));
  top.position.y = 0.022; top.rotation.x = -Math.PI / 2; desk.add(top);
  g.add(L);
  addBox(x, z, 0.4, ZONES[zoneId].segs);
  return addExhibit(g, hitBoxFor(L, 0.5, 0.1), data, zoneId);
}
function kiosk(g, x, z, f, d, id, zoneId) {
  const K = new THREE.Group(); K.position.set(x, 0, z); K.rotation.y = faceYaw(-f.fx, -f.fz);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.5), MAT.darkstone); body.position.y = 0.55; K.add(body);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.5), new THREE.MeshBasicMaterial({ map: textTex([d.game.title, "play"], { w: 512, h: 360, size: 40 }) }));
  screen.position.set(0, 1.25, 0.12); screen.rotation.x = -0.35; K.add(screen);
  g.add(K);
  addBox(x, z, 0.45, ZONES[zoneId].segs);
  return addExhibit(g, hitBoxFor(K, 0.5), { type: "game", id, name: d.game.title }, zoneId);
}
// a theme bay in the Rotunda
function buildBay(g, zoneId, id, r, f, d) {
  const Wp = (u, v) => W(f, u, v);
  const [px, pz] = Wp(0, 0);
  if (d.plate) {
    const panel = new THREE.Group();
    const face = plane(2.4, 2.4, new THREE.MeshLambertMaterial({ map: svgTex(d.plate, { size: 512, pad: 0.1, bg: "#1a120b" }) }));
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.62, 2.62, 0.08), MAT.bronze); back.position.z = -0.05;
    panel.add(back, face); placeOnWall(panel, px, 3.2, pz, f.fx, f.fz); g.add(panel);
    addExhibit(g, hitBoxFor(panel, 0.2), { type: "plate", id, name: "The symbol of " + r.title }, zoneId);
  }
  const title = plane(3, 0.55, new THREE.MeshBasicMaterial({ map: textTex([r.title], { w: 640, h: 116, size: 48 }) }));
  placeOnWall(title, px, 5.0, pz, f.fx, f.fz); g.add(title);
  lectern(g, ...Wp(0, 2.4), { fx: -f.fx, fz: -f.fz }, { type: "room", id, name: r.title }, zoneId, r.title);
  const nSee = r.seeVault.length + r.seeFigs.length + r.homeVault.length + r.homeFigs.length;
  if (nSee) { const [x, z] = Wp(2.2, 0.35); wallBoard(g, x, 1.9, z, f.fx, f.fz, 1.3, 1.6, ["Across the archive", nSee + " exhibits"], { type: "see", id, name: "Across the archive" }, zoneId, { size: 50 }); }
  if (d.game) kiosk(g, ...Wp(-2.2, 1.4), { fx: -f.fx, fz: -f.fz }, d, id, zoneId);
}
function dropWing(zoneId) {
  const Z = ZONES[zoneId]; if (!Z || !Z.built) return;
  Z.exGroup.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material && o.material !== MAT.hit && !Object.values(MAT).includes(o.material)) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
  });
  scene.remove(Z.exGroup); Z.exGroup = null; Z.built = false;
  removeSegs(Z.segs);
  S.exhibits = S.exhibits.filter((e) => e.zone !== zoneId);
}
async function loadDetail(zoneId) {
  if (S.detail[zoneId] || S.loading[zoneId]) return S.loading[zoneId];
  S.loading[zoneId] = fetch("museum/wings/" + zoneId + ".json").then((r) => r.json()).then((j) => { S.detail[zoneId] = j; S.loading[zoneId] = null; if (distToBox(ZONES[zoneId].box, S.pos) < BUILD_NEAR) buildWingExhibits(zoneId); });
  return S.loading[zoneId];
}
function distToBox(b, p) { const dx = Math.max(b.min.x - p.x, 0, p.x - b.max.x), dz = Math.max(b.min.z - p.z, 0, p.z - b.max.z); return Math.hypot(dx, dz); }
// inside a room only that room's exhibits are drawn; from a corridor, the rooms whose doors are near
function roomVisibility(z, d) {
  z.exGroup.visible = (d == null ? distToBox(z.box, S.pos) : d) < SHOW_FAR;
  z.exGroup.children.forEach((rg) => { if (rg.userData.box) rg.visible = S.inRoom ? rg.name === "room-" + S.inRoom : distToBox(rg.userData.box, S.pos) < ROOM_SHOW; });
}
function manageZones() {
  for (let i = LOD.length - 1; i >= 0; i--) {
    const l = LOD[i];
    if (!l.obj.parent) { LOD.splice(i, 1); continue; }
    l.obj.visible = l.obj.position.distanceTo(S.pos) < l.far;
  }
  const inside = S.regions.find((r) => r.room && S.pos.x > r.x0 && S.pos.x < r.x1 && S.pos.z > r.z0 && S.pos.z < r.z1);
  S.inRoom = inside ? inside.room : null;
  for (const z of Object.values(ZONES)) {
    const d = distToBox(z.box, S.pos);
    z.group.visible = d < SHOW_FAR || z.id === "spine";
    if (z.id === "hall" || z.id === "spine") continue;
    if (d < FETCH_NEAR && !S.detail[z.id]) loadDetail(z.id);
    if (d < BUILD_NEAR && !z.built && S.detail[z.id]) buildWingExhibits(z.id);
    else if (d > DROP_FAR && z.built) dropWing(z.id);
    if (z.exGroup && !z.exGroup.parent) z.exGroup = null;
    if (z.exGroup) roomVisibility(z, d);
  }
}

// ---------------------------------------------------------------- lights: pooled onto the nearest lamps
let flick = 0;
function updateLights() {
  const p = S.pos;
  const near = S.lampAnchors.map((l) => [l, l.p.distanceToSquared(p)]).sort((a, b) => a[1] - b[1]).slice(0, pool.length);
  near.forEach(([l], i) => {
    const L = pool[i]; L.position.copy(l.p);
    const f = S.reduce ? 1 : 0.93 + 0.07 * Math.sin(flick * 7 + i * 2.1) * Math.sin(flick * 3.3 + i);
    L.intensity = 26 * l.s * f;
  });
}

// ---------------------------------------------------------------- where am I
function locate() {
  const p = S.pos;
  let reg = null;
  for (const r of S.regions) {
    if (r.round) { if (Math.hypot(p.x - ROT.cx, p.z - ROT.cz) <= ROT.r + 0.1) { reg = r; } continue; }
    if (p.x >= r.x0 - 0.05 && p.x <= r.x1 + 0.05 && p.z >= r.z0 - 0.05 && p.z <= r.z1 + 0.05) { reg = r; if (r.room) break; }
  }
  if (!reg) return;
  let text, sub;
  if (reg.room) { const e = S.eras[reg.era]; sub = "Wing " + e.num + " · " + e.name; text = reg.label; }
  else if (reg.id === "rotunda") {
    // nearest bay
    let best = null, bd = 1e9;
    for (const id of S.manifest.themes.map((t) => t.chapter).filter(Boolean)) { const r = S.rooms[id]; if (!r || !r.frame) continue; const d = Math.hypot(p.x - r.frame.ox, p.z - r.frame.oz); if (d < bd) { bd = d; best = id; } }
    sub = "The Rotunda · Comparative themes"; text = bd < 7.5 ? S.rooms[best].title : "The Rotunda";
    reg = Object.assign({}, reg, { room: bd < 7.5 ? best : null });
  } else { text = reg.label; sub = reg.era ? "Corridor" : "The Divine Archives"; }
  const key = sub + "|" + text;
  if (key !== S.where) {
    S.where = key; S.room = reg.room || null;
    $("mu-where").innerHTML = "<small>" + esc(sub) + "</small>" + esc(text);
    if (!$("mu-guide").hidden) renderGuide();
  }
}

// ---------------------------------------------------------------- label cards
function roomTitle(id) { const r = S.rooms[id]; return r ? r.title : id; }
function openCard(ex) {
  const d = ex.data, b = $("mu-card-body");
  let h = "";
  const zoneOf = (id) => (S.rooms[id] ? S.rooms[id].zone : null);
  const detailFor = (id) => S.detail[zoneOf(id)];
  const btn = (href, label, ghost) => `<a class="${ghost ? "ghost" : ""}" href="${esc(href)}">${esc(label)}</a>`;
  const go = (id, label) => `<button type="button" class="ghost" data-go="${esc(id)}">${esc(label || "Go to its room")}</button>`;
  if (d.type === "vault") {
    const v = findVaultItem(d.id);
    h = `<p class="mu-cat">Vault · ${esc(v.category)}</p><h2 id="mu-card-h">${esc(v.title)}</h2>` +
      (v.forgery ? `<span class="mu-flag">Proven forgery</span>` : "") +
      (v.prop ? `<span class="mu-flag soft">Stand-in, not a replica</span>` : "") +
      (v.noImage ? `<span class="mu-flag soft">No image shown</span>` : "") +
      (v.floor ? `<span class="mu-flag soft">Generic mosaic pattern, not the floor itself</span>` : "") +
      (v.pending ? `<span class="mu-flag soft">Recently added · pending review</span>` : "") +
      `<p class="mu-meta">${esc(v.dated)}<br>${esc(v.held)}</p><p>${esc(v.summary)}</p>` +
      (v.noImage ? `<p class="mu-contested">${esc(v.noImage)}</p>` : "") +
      `<div class="mu-actions">${btn("vault/" + v.slug + ".html", "Open the Vault entry")}${btn("vault/" + v.slug + ".html#evidence", "The evidence, honestly", true)}` +
      (v.home && v.home !== S.room ? go(v.home, "Go to its room: " + roomTitle(v.home)) : "") + `</div>`;
  } else if (d.type === "fig") {
    const f = findFig(d.id);
    h = (f.svg ? `<div class="mu-art" aria-hidden="true">${f.svg}</div>` : "") +
      `<p class="mu-cat">Pantheon · ${esc(f.tradition)}</p><h2 id="mu-card-h">${esc(f.name)}</h2><p class="mu-meta">${esc(f.epithet)}</p>` +
      `<p>${esc(f.desc)}</p>` + (f.contested ? `<p class="mu-contested"><strong>Contested:</strong> ${esc(f.contested)}</p>` : "") +
      `<p class="mu-meta">The emblem is an interpretive drawing of traditional attributes, not a likeness.</p>` +
      `<div class="mu-actions">${btn("pantheon.html#" + d.id, "Open in the Pantheon")}${btn("chapters/" + f.home + ".html#figures", "Read the chapter", true)}` +
      (f.home !== S.room && S.rooms[f.home] ? go(f.home, "Go to its room: " + roomTitle(f.home)) : "") + `</div>`;
  } else if (d.type === "room") {
    const R = detailFor(d.id).rooms[d.id];
    h = `<p class="mu-cat">${esc(R.eraLabel)}</p><h2 id="mu-card-h">${esc(R.title)}</h2>` +
      (R.pending ? `<span class="mu-flag soft">Recently added · pending review</span>` : "") +
      `<p>${esc(R.summary)}</p><div class="mu-actions">${btn("chapters/" + d.id + ".html", "Read the chapter")}` +
      `${btn("chapters/" + d.id + ".html#evidence", "The evidence, honestly", true)}${btn("chapters/" + d.id + ".html#symbology", "Symbology", true)}</div>`;
  } else if (d.type === "plate") {
    const R = detailFor(d.id).rooms[d.id];
    h = `<div class="mu-art" aria-hidden="true">${R.plate}</div><p class="mu-cat">Chapter symbol</p><h2 id="mu-card-h">${esc(R.title)}</h2><p>${esc(R.plateCaption)}</p>` +
      `<div class="mu-actions">${btn("chapters/" + d.id + ".html#symbology", "Read the symbology")}` + (R.game ? btn("symbols.html#play=" + R.game.id, "Play " + R.game.title, true) : "") + `</div>`;
  } else if (d.type === "game") {
    const R = detailFor(d.id).rooms[d.id];
    h = `<p class="mu-cat">Game</p><h2 id="mu-card-h">${esc(R.game.title)}</h2><p>A game built from the facts of <em>${esc(R.title)}</em>. Every fact it shows is checked against the chapter's text.</p>` +
      `<div class="mu-actions">${btn("symbols.html#play=" + R.game.id, "Play")}${btn("chapters/" + d.id + ".html", "Read the chapter", true)}</div>`;
  } else if (d.type === "see") {
    const r = S.rooms[d.id], N = S.manifest.names;
    const items = (r.bay ? r.homeVault : []).concat(r.seeVault).map((v) => ({ t: N.vault[v][0], href: "vault/" + findVaultSlug(v) + ".html", home: N.vault[v][1], kind: "Vault" }))
      .concat((r.bay ? r.homeFigs : []).concat(r.seeFigs).map((f) => ({ t: N.figs[f][0], href: "pantheon.html#" + f, home: N.figs[f][1], kind: "Pantheon" })));
    h = `<p class="mu-cat">${r.bay ? "Across the archive" : "See also"}</p><h2 id="mu-card-h">${esc(r.title)}</h2>` +
      `<p class="mu-meta">${r.bay ? "Objects and figures this theme draws on, each displayed in its home room." : "Objects and figures connected with this chapter that are displayed in other rooms."}</p><ul class="mu-list">` +
      items.map((it) => `<li><a href="${esc(it.href)}">${esc(it.t)}</a><small>${it.kind} · displayed in ${esc(roomTitle(it.home))} ${S.rooms[it.home] && it.home !== d.id ? `· <button type="button" data-go="${esc(it.home)}">go there</button>` : ""}</small></li>`).join("") + `</ul>`;
  } else if (d.type === "living") {
    h = `<p class="mu-cat">A living tradition</p><h2 id="mu-card-h">${esc(roomTitle(d.id))}</h2><p>This tradition is living and practised today. Its room stands in this wing because the archive's chronology places the start of its documented story here, not its end.</p>` +
      `<p>Much of its sacred knowledge is held by its own communities and is not published; the archive, and this museum, show only what is public.</p><div class="mu-actions">${btn("chapters/" + d.id + ".html", "Read the chapter")}</div>`;
  } else if (d.type === "era") {
    const e = S.manifest.eras.find((x) => x.slug === d.era);
    h = `<p class="mu-cat">Wing ${esc(e.num)}</p><h2 id="mu-card-h">${esc(e.name)}</h2><p class="mu-meta">${esc(e.dates)}</p><p>${esc(e.blurb || "")}</p>` +
      `<div class="mu-actions">${btn("eras/" + e.slug + ".html", "Read about this age")}</div><p class="mu-meta" style="margin-top:.8rem">Rooms: ${(S.manifest.wings[e.slug] || []).map((id) => `<button type="button" class="mu-linkish" data-go="${id}">${esc(roomTitle(id))}</button>`).join(" · ")}</p>`;
  } else if (d.type === "about") {
    h = `<p class="mu-cat">The Museum</p><h2 id="mu-card-h">About this museum</h2>` +
      `<p>The building is generated from the archive itself: one room per chapter, arranged by the Nine Ages, with the comparative themes in the Rotunda. A room holds the Vault objects and Pantheon figures whose home is that chapter; items that belong to several chapters are displayed once, in their home room, and listed on the other rooms' "See also" boards.</p>` +
      `<p>The objects in the cases are <strong>generic stand-ins</strong>, never replicas, and the figures appear as the Pantheon's <strong>interpretive emblems</strong>, never as likenesses. Figures whose tradition does not depict them appear as calligraphy. Objects that the Vault shows without images are marked by plaques.</p>` +
      `<p>Every label keeps belief and evidence apart and links to the archive's page, where the sources and the evidence verdict live. Chapters marked "pending review" have new material not yet cleared in the keeper's review.</p>` +
      `<div class="mu-actions">${btn("methodology.html", "The methodology")}${btn("index.html", "The archive", true)}</div>`;
  } else if (d.type === "trails") {
    h = `<p class="mu-cat">Trails</p><h2 id="mu-card-h">Walk one tradition through the ages</h2><p>The museum is arranged by time, so a single tradition's rooms are spread across the wings. A trail takes you through them in order.</p><ul class="mu-list">` +
      S.manifest.trails.map((t) => `<li><strong>${esc(t.name)}</strong><small>${t.rooms.map((id) => esc(roomTitle(id))).join(" → ")} · <button type="button" data-trail="${t.id}">start</button></small></li>`).join("") + `</ul>`;
  } else if (d.type === "directory") { showDirectory(); return; }
  else if (d.type === "reserved") {
    h = `<p class="mu-cat">Comparative theme</p><h2 id="mu-card-h">${esc(d.name)}</h2><p>This alcove is reserved for a theme chapter that has not been written yet. It will open when the chapter is published.</p><div class="mu-actions">${btn("themes.html", "All themes")}</div>`;
  } else if (d.type === "end") {
    h = `<p class="mu-cat">The Spine gallery</p><h2 id="mu-card-h">Here the Nine Ages end, for now</h2><p>The archive is still being written; new chapters open new rooms, and the museum is rebuilt from the archive each time.</p><div class="mu-actions">${btn("index.html", "Back to the archive")}</div>`;
  }
  b.innerHTML = h;
  S.card = ex; S.cardAt = performance.now();
  unlock();
  $("mu-card-wrap").hidden = false;
  $("mu-card").focus();
}
function closeCard() { $("mu-card-wrap").hidden = true; S.card = null; S.dirty = true; $("mu-stage").querySelector("canvas").focus(); }
function findFig(id) { let any = null; for (const D of Object.values(S.detail)) { const f = D.figs[id]; if (f && f.svg) return f; if (f) any = f; } return any; }
function findVault(id) { return Object.values(S.detail).find((D) => D.vault[id]); }
function findVaultItem(id) { const D = findVault(id); return D ? D.vault[id] : null; }
function findVaultSlug(id) { return S.manifest.names.vault[id][2]; }

// ---------------------------------------------------------------- room guide
function renderGuide() {
  const body = $("mu-guide-body");
  const here = S.room ? S.exhibits.filter((e) => e.data.id === S.room || ((e.data.type === "vault" || e.data.type === "fig") && roomOfExhibit(e) === S.room)) : [];
  let h = "";
  if (S.room) {
    const r = S.rooms[S.room];
    h += `<h3>${esc(r.title)}</h3><ul>` + here.map((e) => `<li><button type="button" data-ex="${S.exhibits.indexOf(e)}">${esc(e.data.name)}<small>${esc(typeLabel(e.data.type))}</small></button></li>`).join("") + `</ul>`;
    if (!here.length) h += `<p class="mu-trail">Loading this room's exhibits…</p>`;
    const trail = S.manifest.trails.find((t) => t.rooms.indexOf(S.room) !== -1);
    if (trail) {
      const i = trail.rooms.indexOf(S.room), next = trail.rooms[i + 1], prev = trail.rooms[i - 1];
      h += `<p class="mu-trail">Trail: <strong>${esc(trail.name)}</strong> (${i + 1} of ${trail.rooms.length})</p><ul>` +
        (prev ? `<li><button type="button" data-go="${prev}">← ${esc(roomTitle(prev))}<small>previous on the trail</small></button></li>` : "") +
        (next ? `<li><button type="button" data-go="${next}">${esc(roomTitle(next))} →<small>next on the trail</small></button></li>` : "") + `</ul>`;
    }
  } else {
    h += `<p class="mu-trail">You are in ${esc(S.where.split("|")[1] || "the museum")}. Walk into a room, or choose one:</p>`;
  }
  h += `<h3>Go to a room</h3><ul><li><button type="button" data-go="@hall">The entrance hall</button></li><li><button type="button" data-go="@rotunda">The Rotunda · themes</button></li>` +
    S.manifest.eras.map((e) => `<li><button type="button" data-go="@${e.slug}">Wing ${esc(e.num)} · ${esc(e.name)}</button></li>`).join("") + `</ul>`;
  body.innerHTML = h;
}
function roomOfExhibit(e) {
  // exhibits are built per room; find the room whose area contains the exhibit
  const r = S.regions.find((g) => g.room && e.center.x >= g.x0 - 0.2 && e.center.x <= g.x1 + 0.2 && e.center.z >= g.z0 - 0.2 && e.center.z <= g.z1 + 0.2);
  if (r) return r.room;
  if (e.zone === "rotunda") return e.data.id;
  return null;
}
function typeLabel(t) { return { vault: "Vault object", fig: "Pantheon figure", room: "Chapter lectern", plate: "Chapter symbol", see: "See also board", game: "Game", living: "Note" }[t] || ""; }

// ---------------------------------------------------------------- movement, teleport
function teleport(target, instant) {
  let x, z, yaw;
  if (target === "@hall") { x = 0; z = 11; yaw = 0; }
  else if (target === "@rotunda") { x = 0; z = ROT.cz + ROT.r - 2; yaw = 0; }
  else if (target && target[0] === "@") { const e = S.eras[target.slice(1)]; if (!e) return; x = e.side * (SPINE_HALF + 1.5); z = e.zk; yaw = Math.atan2(-e.side, 0); }
  else { const r = S.rooms[target]; if (!r || !r.frame) return; const f = r.frame; [x, z] = W(f, 0, r.bay ? 6.4 : 1.6); yaw = Math.atan2(-f.fx, -f.fz); if (r.bay) yaw += Math.PI; }
  const jump = () => { S.pos.set(x, EYE, z); S.yaw = yaw; S.pitch = 0; S.auto = null; S.dirty = true; manageZones(); locate(); if (!$("mu-guide").hidden) renderGuide(); };
  if (instant || S.reduce) { jump(); return; }
  const fade = $("mu-fade"); fade.classList.add("on");
  setTimeout(() => { jump(); setTimeout(() => fade.classList.remove("on"), 60); }, 330);
}
const fwd = new THREE.Vector3(), right = new THREE.Vector3();
function step(dt) {
  let mx = 0, mz = 0;
  const k = S.keys;
  if (k.has("KeyW") || k.has("ArrowUp")) mz += 1;
  if (k.has("KeyS") || k.has("ArrowDown")) mz -= 1;
  if (k.has("KeyA")) mx -= 1;
  if (k.has("KeyD")) mx += 1;
  if (k.has("ArrowLeft")) { S.yaw += 1.9 * dt; S.dirty = true; }
  if (k.has("ArrowRight")) { S.yaw -= 1.9 * dt; S.dirty = true; }
  const speed = (k.has("ShiftLeft") || k.has("ShiftRight")) ? RUN : WALK;
  fwd.set(-Math.sin(S.yaw), 0, -Math.cos(S.yaw)); right.set(-fwd.z, 0, fwd.x);
  const before = S.pos.clone();
  if (mx || mz) {
    S.auto = null;
    const n = Math.hypot(mx, mz);
    S.pos.addScaledVector(fwd, mz / n * speed * dt).addScaledVector(right, mx / n * speed * dt);
  } else if (S.auto) {
    const a = S.auto, dx = a.x - S.pos.x, dz = a.z - S.pos.z, d = Math.hypot(dx, dz);
    if (d < 0.25) S.auto = null;
    else {
      const want = Math.atan2(-dx, -dz);
      S.yaw += angDiff(want, S.yaw) * Math.min(1, dt * 5);
      const v = Math.min(d, WALK * 1.2 * dt);
      S.pos.x += dx / d * v; S.pos.z += dz / d * v;
      a.t = (a.t || 0) + dt;
      if (a.last != null && a.last - d < 0.002 && a.t > 0.5) S.auto = null;
      a.last = d;
    }
  }
  collide(S.pos);
  if (!before.equals(S.pos)) S.dirty = true;
}

// ---------------------------------------------------------------- input
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pick(cx, cy) {
  ndc.set(cx, cy); ray.setFromCamera(ndc, camera); ray.far = 15;
  const cand = S.exhibits.filter((e) => e.center.distanceTo(S.pos) < 15 && e.mesh.parent && e.mesh.parent.visible !== false && (!e.mesh.parent.parent || e.mesh.parent.parent.visible !== false)).map((e) => e.mesh);
  const hit = ray.intersectObjects(cand, false)[0];
  if (!hit) return null;
  // don't pick through walls
  const w = ray.intersectObjects(wallMeshes(), false)[0];
  if (w && w.distance < hit.distance - 0.3) return null;
  return S.exhibits.find((e) => e.mesh === hit.object) || null;
}
function wallMeshes() {
  const out = [];
  for (const z of Object.values(ZONES)) if (z.group.visible) z.group.children.forEach((m) => { if (m.material === MAT.wall) out.push(m); });
  return out;
}
function floorPoint(cx, cy) {
  ndc.set(cx, cy); ray.setFromCamera(ndc, camera); ray.far = 40;
  const t = -ray.ray.origin.y / ray.ray.direction.y;
  if (!(t > 0) || t > 40) return null;
  return ray.ray.origin.clone().addScaledVector(ray.ray.direction, t);
}
function lock() { if (touch || S.card) return; const c = renderer.domElement; if (c.requestPointerLock) { try { const p = c.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* not allowed */ } } }
function unlock() { if (document.pointerLockElement) document.exitPointerLock(); }
function bindInput() {
  const c = renderer.domElement;
  document.addEventListener("pointerlockchange", () => { S.locked = document.pointerLockElement === c; $("mu-reticle").hidden = !S.locked; });
  document.addEventListener("mousemove", (e) => { if (!S.locked || Math.abs(e.movementX) > 180 || Math.abs(e.movementY) > 180) return; S.yaw -= e.movementX * 0.0024; S.pitch = Math.max(-1.2, Math.min(1.2, S.pitch - e.movementY * 0.0024)); S.dirty = true; });
  // pointer: drag to look; tap/click to inspect or (touch) walk
  let down = null;
  c.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now(), yaw: S.yaw, pitch: S.pitch, moved: false }; c.setPointerCapture(e.pointerId); c.focus(); });
  c.addEventListener("pointermove", (e) => {
    if (!down || S.locked) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.hypot(dx, dy) > 6) down.moved = true;
    if (down.moved) { S.yaw = down.yaw - dx * 0.005; S.pitch = Math.max(-1.1, Math.min(1.1, down.pitch - dy * 0.004)); S.dirty = true; }
  });
  c.addEventListener("pointerup", (e) => {
    if (!down) return;
    const tap = !down.moved && performance.now() - down.t < 450; down = null;
    if (!tap) return;
    if (S.locked) { const ex = pick(0, 0); if (ex) openCard(ex); return; }
    const r = c.getBoundingClientRect(), cx = ((e.clientX - r.left) / r.width) * 2 - 1, cy = -((e.clientY - r.top) / r.height) * 2 + 1;
    const ex = pick(cx, cy);
    if (ex) { openCard(ex); return; }
    if (!touch && e.pointerType === "mouse") { lock(); return; }
    const fp = floorPoint(cx, cy);
    if (fp) {
      if (S.reduce) {
        const dx = fp.x - S.pos.x, dz = fp.z - S.pos.z, d = Math.hypot(dx, dz), n = Math.ceil(d / 0.15);
        for (let i = 0; i < n; i++) { S.pos.x += dx / n; S.pos.z += dz / n; collide(S.pos); }
        S.dirty = true;
      }
      else S.auto = { x: fp.x, z: fp.z };
    }
  });
  window.addEventListener("keydown", (e) => {
    if (!$("mu-card-wrap").hidden) { if (e.key === "Escape") { e.preventDefault(); closeCard(); } return; }
    if (e.target && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target.tagName)) return;
    if (e.key === "Escape" && !$("mu-guide").hidden) { toggleGuide(false); return; }
    if (e.code === "KeyE" || e.key === "Enter") { const ex = S.hover || pick(0, 0); if (ex) { e.preventDefault(); openCard(ex); } return; }
    if (e.code === "KeyG") { toggleGuide(); return; }
    if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"].includes(e.code)) {
      if (e.code.startsWith("Arrow")) e.preventDefault();
      S.keys.add(e.code);
    }
  });
  window.addEventListener("keyup", (e) => S.keys.delete(e.code));
  window.addEventListener("blur", () => S.keys.clear());
  // DOM controls
  // a tap that opens a card is followed by the browser's own click at the same spot; swallow it so it
  // cannot land on a button that has just appeared under the finger
  $("mu-card-wrap").addEventListener("click", (e) => { if (performance.now() - (S.cardAt || 0) < 450) { e.preventDefault(); e.stopPropagation(); } }, true);
  $("mu-card-x").addEventListener("click", closeCard);
  $("mu-card-wrap").addEventListener("click", (e) => {
    if (e.target === $("mu-card-wrap")) { closeCard(); return; }
    const go = e.target.closest("[data-go]"); if (go) { closeCard(); teleport(go.getAttribute("data-go")); return; }
    const tr = e.target.closest("[data-trail]"); if (tr) { const t = S.manifest.trails.find((x) => x.id === tr.getAttribute("data-trail")); closeCard(); teleport(t.rooms[0]); }
  });
  $("mu-guide-btn").addEventListener("click", () => toggleGuide());
  $("mu-guide-x").addEventListener("click", () => toggleGuide(false));
  $("mu-guide-body").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-go")) { teleport(b.getAttribute("data-go")); return; }
    const ex = S.exhibits[+b.getAttribute("data-ex")]; if (ex) { lookAt(ex.center); openCard(ex); }
  });
  $("mu-dir-btn").addEventListener("click", showDirectory);
  $("mu-help-btn").addEventListener("click", () => { $("mu-intro").hidden = false; $("mu-enter").textContent = "Back to the museum"; unlock(); });
  $("mu-motion-btn").addEventListener("click", () => setReduce(!S.reduce));
  window.addEventListener("pagehide", savePos);
  document.addEventListener("visibilitychange", () => { if (document.hidden) savePos(); else S.dirty = true; });
}
function lookAt(v) { const dx = v.x - S.pos.x, dz = v.z - S.pos.z; S.yaw = Math.atan2(-dx, -dz); S.pitch = Math.atan2(v.y - EYE, Math.hypot(dx, dz)) * 0.8; S.dirty = true; }
function toggleGuide(on) {
  const g = $("mu-guide"), show = on == null ? g.hidden : on;
  g.hidden = !show; $("mu-guide-btn").setAttribute("aria-expanded", String(show));
  if (show) { unlock(); renderGuide(); const first = g.querySelector("button"); if (first) first.focus(); }
}
function setReduce(v) { S.reduce = v; store.set("mu-rm", v ? "1" : "0"); $("mu-motion-btn").setAttribute("aria-pressed", String(v)); S.dirty = true; }
function savePos() { if (S.started) store.sset("mu-pos", JSON.stringify({ x: +S.pos.x.toFixed(2), z: +S.pos.z.toFixed(2), yaw: +S.yaw.toFixed(3) })); }

// ---------------------------------------------------------------- directory (fallback)
function showDirectory(reason) {
  unlock();
  document.body.classList.remove("is-3d");
  $("mu-bar").hidden = true; $("mu-intro").hidden = true; $("mu-guide").hidden = true; $("mu-card-wrap").hidden = true;
  const back = $("mu-dir-back");
  if (renderer && typeof reason !== "string") back.innerHTML = `<button type="button" class="mu-linkish" id="mu-back3d">Return to the 3D museum</button>`;
  else back.textContent = typeof reason === "string" ? reason : "";
  const b3 = $("mu-back3d"); if (b3) b3.addEventListener("click", () => enter3d());
  // "walk there" buttons on the directory's rooms, when 3D is available
  if (renderer) document.querySelectorAll(".dir-wing li[id^='dir-']").forEach((li) => {
    if (li.querySelector(".mu-walk")) return;
    const id = li.id.slice(4), b = document.createElement("button");
    b.type = "button"; b.className = "mu-linkish mu-walk"; b.textContent = "walk there"; b.style.marginLeft = ".6rem";
    b.addEventListener("click", () => { enter3d(); teleport(id, true); });
    li.querySelector(".dir-room").after(b);
  });
  S.paused = true;
  window.scrollTo(0, 0);
}
function enter3d() {
  document.body.classList.add("is-3d");
  $("mu-bar").hidden = false; $("mu-intro").hidden = true;
  S.paused = false; S.dirty = true; resize();
  renderer.domElement.focus();
}

// ---------------------------------------------------------------- loop
let last = performance.now(), idleT = 0, locT = 0, zoneT = 0;
function tick(now) {
  requestAnimationFrame(tick);
  if (S.paused || document.hidden) { last = now; return; }
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if ($("mu-card-wrap").hidden) step(dt);
  zoneT += dt; if (zoneT > 0.25) { zoneT = 0; manageZones(); }
  locT += dt; if (locT > 0.2) { locT = 0; locate(); }
  flick += dt; idleT += dt;
  if (!S.reduce && idleT > 0.12) { idleT = 0; S.dirty = true; }
  if (!S.dirty) return;
  S.dirty = false;
  camera.position.copy(S.pos);
  camera.rotation.set(S.pitch, S.yaw, 0, "YXZ");
  updateLights();
  // hover (centre of view when looking with the mouse)
  const ex = (S.locked || !touch) && $("mu-card-wrap").hidden ? pick(0, 0) : null;
  const near = ex && ex.center.distanceTo(S.pos) < 6 ? ex : null;
  if (near !== S.hover) {
    S.hover = near;
    const tag = $("mu-tag");
    if (near) { tag.innerHTML = `<kbd>${touch ? "tap" : "E"}</kbd>` + esc(near.data.name); tag.hidden = false; } else tag.hidden = true;
    $("mu-reticle").classList.toggle("on", !!near);
  }
  renderer.render(scene, camera);
}

// ---------------------------------------------------------------- start
async function start() {
  const status = $("mu-status");
  document.body.classList.add("is-3d");
  $("mu-intro").hidden = false;
  $("mu-keys").innerHTML = touch
    ? "<kbd>drag</kbd><span>look around</span><kbd>tap the floor</kbd><span>walk there</span><kbd>tap an exhibit</kbd><span>read its label</span><kbd>Room guide</kbd><span>every exhibit in this room, and a way to any room</span>"
    : "<kbd>click</kbd><span>look with the mouse (Esc to release)</span><kbd>W A S D</kbd><span>walk (arrows to turn, Shift to hurry)</span><kbd>E</kbd><span>read the label of the exhibit in view</span><kbd>G</kbd><span>the Room guide: every exhibit here, and a way to any room</span>";
  $("mu-skip").addEventListener("click", () => showDirectory());
  $("mu-enter").disabled = true;
  try { initRenderer(); }
  catch (e) {
    document.body.classList.remove("is-3d"); $("mu-intro").hidden = true;
    showDirectory("Your browser could not start the 3D view, so here is the museum as a directory.");
    return;
  }
  try {
    const [m] = await Promise.all([fetch("museum/manifest.json").then((r) => r.json()), document.fonts ? Promise.race([document.fonts.load("600 40px Cinzel"), new Promise((r) => setTimeout(r, 1500))]) : null]);
    S.manifest = m;
    for (const r of m.rooms) S.rooms[r.id] = Object.assign({}, r);
    makeTextures(); makeMaterials(); build();
  } catch (e) {
    showDirectory("The museum could not be loaded, so here is its directory.");
    return;
  }
  bindInput();
  setReduce(S.reduce);
  // where to begin: a room in the hash, else where you were, else the entrance
  const hash = (location.hash || "").replace("#", "");
  let saved = null; try { saved = JSON.parse(store.sget("mu-pos") || "null"); } catch (e) { saved = null; }
  if (hash && S.rooms[hash]) teleport(hash, true);
  else if (saved && isFinite(saved.x)) { S.pos.set(saved.x, EYE, saved.z); S.yaw = saved.yaw || 0; }
  else { S.pos.set(0, EYE, 11); S.yaw = 0; }
  manageZones(); locate();
  S.started = true;
  $("mu-bar").hidden = false;
  requestAnimationFrame(tick);
  status.textContent = "";
  $("mu-enter").disabled = false;
  $("mu-enter").addEventListener("click", () => { $("mu-intro").hidden = true; store.set("mu-seen", "1"); renderer.domElement.focus(); if (!touch) lock(); S.dirty = true; });
  // returning from an exhibit page: skip the introduction
  if (saved || hash || store.get("mu-seen") === "1") { $("mu-intro").hidden = true; renderer.domElement.focus(); }
  else $("mu-enter").focus();
  setInterval(savePos, 2000);
}

// test hook for automated checks (read-only state + teleport)
window.__MU = {
  state: () => ({ x: S.pos.x, z: S.pos.z, yaw: S.yaw, where: S.where, room: S.room, exhibits: S.exhibits.length, built: Object.values(ZONES).filter((z) => z.built).map((z) => z.id), calls: renderer ? renderer.info.render.calls : 0, tris: renderer ? renderer.info.render.triangles : 0, textures: renderer ? renderer.info.memory.textures : 0, geometries: renderer ? renderer.info.memory.geometries : 0 }),
  teleport: (id) => teleport(id, true),
  open: (i) => openCard(S.exhibits[i]),
  exhibits: () => S.exhibits.map((e) => Object.assign({ x: e.center.x, z: e.center.z }, e.data)),
  walk: (code, ms) => { S.keys.add(code); return new Promise((r) => setTimeout(() => { S.keys.delete(code); r(); }, ms)); },
  load: (z) => loadDetail(z),
  debug: () => {
    const out = {};
    scene.children.forEach((c, i) => {
      let n = 0;
      c.traverseVisible((o) => { if ((o.isMesh || o.isPoints || o.isInstancedMesh) && o.material && o.material.visible !== false) n++; });
      const k = (c.name || c.type) + (c.isGroup ? "#" + i : "");
      if (n) out[k] = n;
    });
    out.inRoom = S.inRoom;
    out.groups = Object.values(ZONES).filter((z) => z.exGroup).map((z) => z.id + ":" + z.exGroup.children.filter((c) => c.isGroup).map((c) => c.name.replace("room-", "") + (c.visible ? "+" : "-")).join(","));
    return out;
  }
};
start();
