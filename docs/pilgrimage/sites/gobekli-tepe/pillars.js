/* ==========================================================================
   Göbekli Tepe — the T-pillar builder and the carved reliefs

   tpillar(B, key, o) adds a T-shaped pillar to a kit.js Bucket: a slab-like
   shaft with a longer block on top (the "head" of the T), which overhangs the
   pillar's narrow front. o = { x, z, y, h, L, t, headH, headF, headB, yaw,
   tilt, broken, seed }: L is the shaft's length front to back, t its
   thickness; yaw is the bearing the front faces (0 north, clockwise, as in
   megalith.js); broken (0–1) cuts the pillar off at that fraction of its
   height (no head). Returns the plan footprint for walkable-region holes.

   relief(ctx, draw, o) puts one carved panel on a pillar face: our own
   drawing in the manner of the reliefs, NOT a tracing of any photograph or
   drawing of a real pillar (plans/pilgrimage-sites.md, ground rules). The
   panel is a transparent canvas in raised relief: a lit edge above, a shadow
   below. The draw functions below take (g, W, H) and fill shapes in white.
   ========================================================================== */
import * as THREE from "three";

function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

export function tpillar(B, key, o) {
  const R = rng(o.seed || 3), j = () => (R() - 0.5) * 0.04;
  const h = o.broken ? o.h * o.broken : o.h, parts = [];
  const shaftH = o.broken ? h : h - o.headH;
  // the shaft: front (narrow face) towards -z in local space, broad faces towards ±x
  const s = new THREE.BoxGeometry(o.t, shaftH, o.L, 1, 3, 2); s.translate(0, shaftH / 2, 0); parts.push(s);
  if (!o.broken) {
    const hl = o.L + o.headF + o.headB, hd = new THREE.BoxGeometry(o.t * 1.04, o.headH, hl, 1, 1, 2);
    hd.translate(0, h - o.headH / 2, (o.headB - o.headF) / 2); parts.push(hd);
  } else {
    // a broken top: a rough wedge
    const w = new THREE.BoxGeometry(o.t, 0.25, o.L * 0.8, 1, 1, 1); w.rotateX(0.18); w.translate(0, h + 0.05, o.L * 0.08); parts.push(w);
  }
  const out = { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 };
  for (const g of parts) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + j() * 0.5, p.getY(i), p.getZ(i) + j());   // a hand-dressed, not machined, surface
    if (o.tilt) g.rotateX(o.tilt);
    g.rotateY(-(o.yaw || 0)); g.translate(o.x, o.y || 0, o.z);
    B.geo(key, g);
    g.computeBoundingBox(); const bb = g.boundingBox;
    out.x0 = Math.min(out.x0, bb.min.x); out.x1 = Math.max(out.x1, bb.max.x); out.z0 = Math.min(out.z0, bb.min.z); out.z1 = Math.max(out.z1, bb.max.z);
  }
  return out;
}

// ---------------------------------------------------------------- reliefs
const PX = 110;   // canvas pixels per metre of face
function panelTexture(draw, wM, hM, tone) {
  const W = Math.max(32, Math.round(wM * PX)), H = Math.max(32, Math.round(hM * PX));
  const mask = document.createElement("canvas"); mask.width = W; mask.height = H;
  const mg = mask.getContext("2d"); mg.fillStyle = "#fff"; mg.strokeStyle = "#fff"; mg.lineCap = "round"; mg.lineJoin = "round";
  draw(mg, W, H);
  const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
  const tint = (col) => { const t = document.createElement("canvas"); t.width = W; t.height = H; const q = t.getContext("2d"); q.drawImage(mask, 0, 0); q.globalCompositeOperation = "source-in"; q.fillStyle = col; q.fillRect(0, 0, W, H); return t; };
  const d = Math.max(2, Math.round(W / 90));
  g.drawImage(tint("rgba(40,30,20,.75)"), d, d);            // the shadow under the raised edge
  g.drawImage(tint("rgba(255,248,230,.9)"), -d * 0.6, -d * 0.6);   // the lit upper edge
  g.drawImage(tint(tone || "#cdbb98"), 0, 0);                 // the carved surface itself
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
// o = { w, h, x, y, z, yaw } : the panel's size and centre, and the bearing its face looks towards
export function relief(ctx, draw, o) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.h), new THREE.MeshStandardMaterial({ map: panelTexture(draw, o.w, o.h, o.tone), transparent: true, alphaTest: 0.05, roughness: 0.92, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(o.x, o.y, o.z); m.rotation.y = Math.PI - (o.yaw || 0);   // a plane faces +z; turn it to face the bearing
  m.renderOrder = 2; ctx.group.add(m); return m;
}
// where a face of a pillar is: the centre of its front (narrow) face or one broad side, at height y
export function facePos(p, side, y, off) {
  off = off || 0.012;
  const b = p.yaw || 0, fx = Math.sin(b), fz = -Math.cos(b), rx = Math.cos(b), rz = Math.sin(b);   // front and right in plan
  if (side === "front") { const d = p.L / 2 + off; return { x: p.x + fx * d, y, z: p.z + fz * d, yaw: b }; }
  const sg = side === "right" ? 1 : -1, d = p.t / 2 + off;
  return { x: p.x + rx * d * sg, y, z: p.z + rz * d * sg, yaw: b + sg * Math.PI / 2 };
}

// ---------------------------------------------------------------- the drawings (white shapes; our own, stylised)
const lw = (g, W, k) => { g.lineWidth = W * k; };
// an arm running down the broad side from the back of the shoulder to the front edge, bent at the elbow,
// and the belt below it (the belt runs round the pillar)
export function arm(flip) {
  return (g, W, H) => {
    if (flip) { g.translate(W, 0); g.scale(-1, 1); }
    lw(g, W, 0.11);
    g.beginPath(); g.moveTo(W * 0.86, H * 0.04); g.lineTo(W * 0.74, H * 0.3); g.quadraticCurveTo(W * 0.68, H * 0.4, W * 0.52, H * 0.43); g.lineTo(W * 0.02, H * 0.47); g.stroke();
    lw(g, W, 0.03); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(W * 0.04, H * (0.44 + i * 0.022)); g.lineTo(0, H * (0.44 + i * 0.022)); g.stroke(); }
    g.fillRect(0, H * 0.56, W, H * 0.06);
    g.save(); g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 6; i++) g.fillRect(W * (0.05 + i * 0.16), H * 0.575, W * 0.07, H * 0.025); g.restore();
  };
}
// the front: the fingers of two hands meeting, a belt, and a loincloth below it (DAI FAQ: "hands resting on a belt
// with a loin cloth"). An earlier version drew a fox pelt and necklace symbols here; no checked source gives them.
export function front(_sym) {   // the argument is kept so callers need not change
  return (g, W, H) => {
    // the hands: four fingers each, meeting in the middle above the belt
    lw(g, W, 0.07);
    for (let i = 0; i < 4; i++) { const y = H * (0.42 + i * 0.03); g.beginPath(); g.moveTo(0, y); g.lineTo(W * 0.46, y); g.stroke(); g.beginPath(); g.moveTo(W, y); g.lineTo(W * 0.54, y); g.stroke(); }
    // the belt, with a pattern of linked bands
    g.fillRect(0, H * 0.56, W, H * 0.06);
    g.save(); g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 5; i++) g.fillRect(W * (0.08 + i * 0.19), H * 0.575, W * 0.08, H * 0.025); g.restore();
    // the loincloth: a plain cloth hanging from the belt, outlined
    lw(g, W, 0.05);
    g.beginPath(); g.moveTo(W * 0.36, H * 0.62); g.lineTo(W * 0.32, H * 0.86); g.lineTo(W * 0.68, H * 0.86); g.lineTo(W * 0.64, H * 0.62); g.stroke();
  };
}
// a fox in mid-leap, teeth bared (the commonest animal in Enclosure D, with the snake)
export function fox(g, W, H) {
  g.beginPath(); g.ellipse(W * 0.52, H * 0.45, W * 0.27, H * 0.15, -0.15, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(W * 0.27, H * 0.42); g.lineTo(W * 0.08, H * 0.5); g.lineTo(W * 0.2, H * 0.3); g.lineTo(W * 0.24, H * 0.18); g.lineTo(W * 0.3, H * 0.3); g.closePath(); g.fill();   // head and ear
  lw(g, W, 0.05);
  g.beginPath(); g.moveTo(W * 0.36, H * 0.55); g.lineTo(W * 0.28, H * 0.8); g.stroke(); g.beginPath(); g.moveTo(W * 0.68, H * 0.55); g.lineTo(W * 0.78, H * 0.82); g.stroke();
  g.beginPath(); g.moveTo(W * 0.76, H * 0.4); g.quadraticCurveTo(W * 0.95, H * 0.35, W * 0.96, H * 0.6); g.lineWidth = W * 0.08; g.stroke();   // the brush
  g.save(); g.globalCompositeOperation = "destination-out"; lw(g, W, 0.012); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(W * (0.1 + i * 0.03), H * 0.47); g.lineTo(W * (0.11 + i * 0.03), H * 0.42); g.stroke(); } g.restore();
}
// snakes running down the face, head first
export function snakes(n) {
  return (g, W, H) => {
    lw(g, W, 0.07);
    for (let k = 0; k < n; k++) {
      const x0 = W * (0.2 + 0.6 * (n === 1 ? 0.5 : k / (n - 1)));
      g.beginPath(); for (let i = 0; i <= 24; i++) { const v = i / 24, x = x0 + Math.sin(v * 9 + k) * W * 0.07, y = H * (0.05 + v * 0.8); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
      g.beginPath(); g.ellipse(x0 + Math.sin(9 + k) * W * 0.07, H * 0.88, W * 0.06, H * 0.05, 0, 0, Math.PI * 2); g.fill();
    }
  };
}
// a wild boar
export function boar(g, W, H) {
  g.beginPath(); g.moveTo(W * 0.12, H * 0.45); g.lineTo(W * 0.3, H * 0.25); g.lineTo(W * 0.78, H * 0.28); g.lineTo(W * 0.9, H * 0.42); g.lineTo(W * 0.82, H * 0.62); g.lineTo(W * 0.25, H * 0.64); g.closePath(); g.fill();
  lw(g, W, 0.05); for (const x of [0.3, 0.42, 0.68, 0.78]) { g.beginPath(); g.moveTo(W * x, H * 0.6); g.lineTo(W * x, H * 0.8); g.stroke(); }
  g.beginPath(); g.moveTo(W * 0.12, H * 0.45); g.lineTo(W * 0.04, H * 0.52); g.stroke();
  g.save(); g.globalCompositeOperation = "destination-out"; lw(g, W, 0.02); for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(W * (0.32 + i * 0.06), H * 0.27); g.lineTo(W * (0.34 + i * 0.06), H * 0.33); g.stroke(); } g.restore();
}
// a long-legged bird (a crane or similar)
export function bird(g, W, H) {
  g.beginPath(); g.ellipse(W * 0.5, H * 0.4, W * 0.2, H * 0.12, 0.3, 0, Math.PI * 2); g.fill();
  lw(g, W, 0.04); g.beginPath(); g.moveTo(W * 0.36, H * 0.34); g.quadraticCurveTo(W * 0.24, H * 0.2, W * 0.3, H * 0.08); g.lineTo(W * 0.16, H * 0.1); g.stroke();
  g.beginPath(); g.moveTo(W * 0.48, H * 0.5); g.lineTo(W * 0.44, H * 0.9); g.moveTo(W * 0.56, H * 0.5); g.lineTo(W * 0.6, H * 0.9); g.stroke();
}
// the Vulture Stone (Pillar 43), simplified: a vulture with spread wing and a disc beside it, smaller beasts and
// birds in the register above, and a small headless figure low on the shaft. Our own rendering, much simplified.
export function vulture(g, W, H) {
  // the register of small birds and a beast across the top
  for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(W * (0.2 + i * 0.28), H * 0.09, W * 0.07, H * 0.035, 0, 0, Math.PI * 2); g.fill(); }
  // the vulture: hunched body, long wing raised forward, hooked head with a collar
  g.beginPath(); g.moveTo(W * 0.3, H * 0.62); g.lineTo(W * 0.45, H * 0.3); g.lineTo(W * 0.62, H * 0.32); g.lineTo(W * 0.58, H * 0.6); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(W * 0.47, H * 0.36); g.lineTo(W * 0.15, H * 0.22); g.lineTo(W * 0.1, H * 0.3); g.lineTo(W * 0.42, H * 0.46); g.closePath(); g.fill();
  g.beginPath(); g.arc(W * 0.62, H * 0.27, W * 0.05, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(W * 0.66, H * 0.27); g.lineTo(W * 0.74, H * 0.3); g.lineTo(W * 0.66, H * 0.31); g.fill();
  lw(g, W, 0.025); g.beginPath(); g.moveTo(W * 0.56, H * 0.33); g.lineTo(W * 0.66, H * 0.33); g.stroke();   // the collar
  g.beginPath(); g.arc(W * 0.17, H * 0.17, W * 0.06, 0, Math.PI * 2); g.fill();      // the disc by the wing tip
  lw(g, W, 0.03); g.beginPath(); g.moveTo(W * 0.4, H * 0.62); g.lineTo(W * 0.36, H * 0.72); g.moveTo(W * 0.52, H * 0.62); g.lineTo(W * 0.56, H * 0.72); g.stroke();
  // a scorpion-like animal and the small headless figure lower down (simplified)
  g.beginPath(); g.ellipse(W * 0.3, H * 0.82, W * 0.08, H * 0.03, 0, 0, Math.PI * 2); g.fill();
  lw(g, W, 0.02); g.beginPath(); g.moveTo(W * 0.38, H * 0.82); g.quadraticCurveTo(W * 0.48, H * 0.8, W * 0.44, H * 0.75); g.stroke();
  g.fillRect(W * 0.68, H * 0.8, W * 0.05, H * 0.1); lw(g, W, 0.02); g.beginPath(); g.moveTo(W * 0.66, H * 0.82); g.lineTo(W * 0.75, H * 0.82); g.stroke();
}

// ---------------------------------------------------------------- dry-stone ring walls and benches
// a ring wall of rough coursed stone round (cx, cz): inner radius r (or rx/rz for an oval), thickness t,
// height h, with gaps [[b0, b1]] as bearings in degrees (0 north, clockwise). Faces both ways, and a top.
export function ringWall(B, key, o) {
  const n = o.n || 64, rx = o.rx || o.r, rz = o.rz || o.r, t = o.t, h = o.h, R = rng(o.seed || 5);
  const jit = []; for (let i = 0; i <= n; i++) jit.push(1 + (R() - 0.5) * 0.04);
  jit[n] = jit[0];
  const P = (i, d, y) => { const b = (i / n) * Math.PI * 2, k = jit[i]; return new THREE.Vector3(o.cx + Math.sin(b) * (rx + d) * k, y, o.cz - Math.cos(b) * (rz + d) * k); };
  const inGap = (deg) => (o.gaps || []).some(([a, b]) => (a <= b ? deg >= a && deg <= b : deg >= a || deg <= b));
  const hh = (i) => h * (o.ragged ? 0.86 + 0.08 * Math.sin(i * 0.45 + (o.seed || 0)) + 0.05 * Math.sin(i * 1.3 + (o.seed || 0) * 2) : 1);
  for (let i = 0; i < n; i++) {
    const mid = ((i + 0.5) / n) * 360; if (inGap(mid)) continue;
    const h0 = hh(i), h1 = hh(i + 1);
    B.quad(key, P(i, 0, 0), P(i + 1, 0, 0), P(i + 1, 0, h1), P(i, 0, h0));         // inner face, looking in
    B.quad(key, P(i + 1, t, 0), P(i, t, 0), P(i, t, h0), P(i + 1, t, h1));         // outer face
    B.quad(key, P(i, 0, h0), P(i + 1, 0, h1), P(i + 1, t, h1), P(i, t, h0));       // the top
    if (inGap(((i + 1.5) / n) * 360)) B.quad(key, P(i + 1, 0, 0), P(i + 1, 0, h1), P(i + 1, t, h1), P(i + 1, t, 0));   // the wall end at a gap
    if (inGap(((i - 0.5 + n) / n) * 360 % 360)) B.quad(key, P(i, t, 0), P(i, t, h0), P(i, 0, h0), P(i, 0, 0));
  }
}
// a low bench round the inside of a ring wall
export function bench(B, key, o) {
  const n = o.n || 64, r = o.r, d = o.d || 0.5, h = o.h || 0.5;
  const P = (i, rr, y) => { const b = (i / n) * Math.PI * 2; return new THREE.Vector3(o.cx + Math.sin(b) * rr, y, o.cz - Math.cos(b) * rr); };
  const inGap = (deg) => (o.gaps || []).some(([a, b]) => deg >= a && deg <= b);
  for (let i = 0; i < n; i++) {
    if (inGap(((i + 0.5) / n) * 360)) continue;
    B.quad(key, P(i, r - d, 0), P(i + 1, r - d, 0), P(i + 1, r - d, h), P(i, r - d, h));
    B.quad(key, P(i, r - d, h), P(i + 1, r - d, h), P(i + 1, r, h), P(i, r, h));
  }
}

// ---------------------------------------------------------------- dry-stone walling: a drawn texture of small rough stones in
// earth mortar (the walls are rubble, not the coursed blocks of stone.js). Tiles every `tile` metres; the
// kit's world-metre UVs put the stones at true size.
let DRY = null;
export function drystone(tone) {
  if (DRY && !tone) return DRY;
  const tile = 2.4, px = 512, k = px / tile, R = rng(77);
  const c = document.createElement("canvas"); c.width = c.height = px; const g = c.getContext("2d");
  g.fillStyle = "#8d7c64"; g.fillRect(0, 0, px, px);
  const rows = []; let y = 0; while (y < tile - 0.1) { const h = 0.13 + R() * 0.16; rows.push([y, h]); y += h; }
  const sc = tile / y; // stretch the rows to fill the tile exactly, so it wraps
  for (const [y0, h0] of rows) {
    const ry = y0 * sc * k, rh = h0 * sc * k; let x = R() * 0.3;
    while (x < tile) {
      const w = 0.18 + R() * 0.38, base = 175 + R() * 50, wob = () => (R() - 0.5) * rh * 0.25;
      for (const off of [0, -tile]) {
        const x0 = (x + off) * k + 2, x1 = (x + w + off) * k - 2, y0p = ry + 2, y1p = ry + rh - 2;
        const pts = [[x0 + wob(), y0p + wob()], [(x0 + x1) / 2, y0p + wob() * 0.5], [x1 + wob(), y0p + wob()], [x1 + wob(), (y0p + y1p) / 2], [x1 + wob(), y1p + wob()], [(x0 + x1) / 2, y1p + wob() * 0.5], [x0 + wob(), y1p + wob()], [x0 + wob(), (y0p + y1p) / 2]];
        g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.closePath();
        g.fillStyle = `rgb(${base},${base * 0.93},${base * 0.8})`; g.fill();
        g.strokeStyle = "rgba(60,48,34,.55)"; g.lineWidth = 2.5; g.stroke();
        g.fillStyle = "rgba(255,250,235,.18)"; g.fillRect(x0 + 3, y0p + 2, (x1 - x0) * 0.7, rh * 0.18);
      }
      x += w;
    }
  }
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${R() > 0.5 ? "40,30,20" : "255,250,240"},${R() * 0.12})`; g.fillRect(R() * px, R() * px, 2, 2); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tile, 1 / tile); t.anisotropy = 4;
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.96, side: THREE.DoubleSide, color: tone || "#ffffff" });
  if (!tone) DRY = m;
  return m;
}
