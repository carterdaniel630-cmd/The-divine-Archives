/* Newgrange: the carved stones. Every carving here is our own simple rendering of its motifs (spirals, lozenges,
   zigzags, concentric arcs), drawn in code as pecked grooves on a transparent sheet laid on the stone's face, so
   the stone itself shows through; none is a tracing of a real stone. */
import * as THREE from "three";

const can = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

// a pecked groove: many small dots along a path, darker than the stone
function peck(g, pts, R, w) {
  g.fillStyle = "rgba(30,28,24,0.82)";
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 2));
    for (let k = 0; k < n; k++) { const t = k / n; g.beginPath(); g.arc(x0 + (x1 - x0) * t + (R() - 0.5) * 2, y0 + (y1 - y0) * t + (R() - 0.5) * 2, w * (0.7 + R() * 0.5), 0, Math.PI * 2); g.fill(); }
  }
}
// an outward spiral of `turns` turns, radius r, centred (cx, cy); dir 1 or -1
function spiral(cx, cy, r, turns, dir, a0) {
  const pts = [], N = Math.round(turns * 48);
  for (let i = 0; i <= N; i++) { const t = i / N, a = (a0 || 0) + dir * t * turns * Math.PI * 2, rr = r * t; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return pts;
}

// the Entrance Stone's face (K1): spirals in two groups either side of a vertical groove, lozenges at the ends, wavy lines
export function k1Tex() {
  const W = 1024, H = 384, [c, g] = can(W, H), R = rng(11);
  const S = (x, y, r, d) => peck(g, spiral(x, y, r, 3, d, R() * 6), R, 3.2);
  S(250, 170, 92, 1); S(395, 210, 82, -1); S(300, 300, 52, 1);            // the left group
  S(640, 175, 78, -1); S(780, 205, 86, 1);                                  // the right group
  peck(g, [[512, 30], [500, 120], [522, 220], [508, 360]], R, 3.4);         // the vertical groove
  for (const x0 of [40, 900]) for (let k = 0; k < 3; k++) {                 // nested lozenges at the ends
    const cx = x0 + 45, cy = 190, s = 70 - k * 20; peck(g, [[cx, cy - s], [cx + s * 0.6, cy], [cx, cy + s], [cx - s * 0.6, cy], [cx, cy - s]], R, 3);
  }
  for (let k = 0; k < 3; k++) { const pts = []; for (let x = 120; x <= 900; x += 10) pts.push([x, 30 + k * 16 + Math.sin(x / 26) * 6]); if (k === 0) peck(g, pts, R, 2.4); }
  return tex(c);
}
// the triple spiral of the back recess: three joined spirals, about 30 × 28 cm on its stone
export function tripleTex() {
  const W = 512, H = 512, [c, g] = can(W, H), R = rng(23);
  const r = 70, ctr = [[256, 170], [170, 320], [342, 320]];
  ctr.forEach(([x, y], i) => peck(g, spiral(x, y, r, 2.6, i === 0 ? 1 : -1, i * 2.1), R, 3.6));
  peck(g, [[200, 205], [218, 245], [205, 278]], R, 3.4); peck(g, [[312, 205], [294, 245], [307, 278]], R, 3.4); peck(g, [[218, 360], [256, 342], [294, 360]], R, 3.4);
  return tex(c);
}
// the east recess: spirals, lozenges and zigzags on the backstone
export function eastTex() {
  const W = 512, H = 640, [c, g] = can(W, H), R = rng(37);
  peck(g, spiral(150, 170, 80, 2.5, 1, 0), R, 3); peck(g, spiral(360, 230, 70, 2.2, -1, 1), R, 3);
  for (let k = 0; k < 4; k++) { const y = 380 + k * 52; const pts = []; for (let x = 60, j = 0; x <= 450; x += 39, j++) pts.push([x, y + (j % 2 ? 20 : -20)]); peck(g, pts, R, 2.8); }
  for (let k = 0; k < 3; k++) { const cx = 256, cy = 330, s = 40 - k * 12; peck(g, [[cx, cy - s], [cx + s, cy], [cx, cy + s], [cx - s, cy], [cx, cy - s]], R, 2.6); }
  return tex(c);
}
// the west recess: large and small concentric circles
export function westTex() {
  const W = 512, H = 640, [c, g] = can(W, H), R = rng(41);
  for (const [x, y, n] of [[180, 220, 5], [360, 420, 4], [150, 470, 3]]) for (let k = 1; k <= n; k++) {
    const pts = []; for (let a = 0; a <= 64; a++) pts.push([x + Math.cos(a / 64 * Math.PI * 2) * k * 22, y + Math.sin(a / 64 * Math.PI * 2) * k * 22]); peck(g, pts, R, 2.8);
  }
  return tex(c);
}
// a flat carved panel of texture `t`, w × h, centred at (x, y, z), facing bearing `b` (0 = north, -z; clockwise)
export function panel(ctx, t, w, h, x, y, z, b) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(x, y, z); m.rotation.y = Math.PI - b; ctx.group.add(m); return m;
}
