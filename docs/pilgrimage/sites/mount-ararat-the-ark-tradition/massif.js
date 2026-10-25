/* ==========================================================================
   Mount Ararat — the massif as a scale model (shared by the sections)

   A height field for the two cones of Ararat, drawn at 1/K of true size and
   set behind a walkable place so that, seen from there, it fills the same
   angle of view as the real mountain. The shape is ours, built from the
   published heights (dims.js): two volcanic cones with concave flanks, a
   saddle, radial gullies, the deep Ahora Gorge on the north-east flank, and
   ice above the snowline. It is not a copy of any elevation model, and its
   detail is invented; only the heights and the overall layout are published.

   massif(ctx, viewer, at, o)
     viewer  { x, z, h }  where the walkable place is: km from the summit, metres up
     at      { x, y, z }  where that place is in the model (metres)
     o       { range: half-width in km of the area drawn, cx/cz: its centre (km), n: grid size, drop: how far (in K-metres) it sinks near the viewer }
   ========================================================================== */
import * as THREE from "three";
import { D } from "./dims.js?v=1";

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function hash(x, z) { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, z) => { let s = 0, f = 1, a = 0.5; for (let i = 0; i < 5; i++) { s += a * vnoise(x * f, z * f); f *= 2.03; a *= 0.5; } return s; };

// height in metres at (x, z) km from the summit of Greater Ararat
export function heightAt(x, z) {
  const base = D.plainN + (D.plainS - D.plainN) * smooth(-14, 14, z);
  const dg = Math.hypot(x - D.greater.x, z - D.greater.z), tg = dg / 15.5;
  let g = tg < 1 ? Math.pow(1 - tg, 1.65) : 0;
  g = g * (1 - 0.04 * smooth(0.0, 0.06, 0.06 - tg));                   // a rounded summit dome, not a spike
  const ang = Math.atan2(x, -z);
  // radial gullies and spurs, strongest on the middle flanks
  const rib = Math.sin(ang * 17 + fbm(x * 0.3, z * 0.3) * 6) * 0.035 * smooth(0.05, 0.3, tg) * (1 - smooth(0.6, 1, tg));
  g *= 1 + rib;
  // the Ahora Gorge: a deep cleft on the north-east flank
  const gorgeA = 0.75, da = Math.atan2(Math.sin(ang - gorgeA), Math.cos(ang - gorgeA));
  g *= 1 - 0.32 * Math.exp(-Math.pow(da / 0.09, 2)) * smooth(0.06, 0.18, tg) * (1 - smooth(0.45, 0.7, tg));
  const dl = Math.hypot(x - D.lesser.x, z - D.lesser.z), tl = dl / 7.5;
  const l = tl < 1 ? Math.pow(1 - tl, 1.45) : 0;
  const hg = base + (D.greater.h - base) * g, hl = base + (D.lesser.h - base) * l;
  // the saddle between them, and a little roughness everywhere
  return Math.max(hg, hl) + (fbm(x * 0.9, z * 0.9) - 0.5) * 120 * smooth(0, 0.4, Math.max(g, l));
}

const C = { steppe: new THREE.Color("#a59b70"), scree: new THREE.Color("#7a6656"), basalt: new THREE.Color("#4e423d"), snow: new THREE.Color("#f3f6fb"), ice: new THREE.Color("#dde8f2") };
export function massif(ctx, viewer, at, o) {
  o = o || {};
  const K = D.K, n = o.n || 160, range = o.range || 30, cx = o.cx != null ? o.cx : viewer.x / 2, cz = o.cz != null ? o.cz : viewer.z / 2;
  const g = new THREE.PlaneGeometry(1, 1, n, n); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const xk = cx + p.getX(i) * 2 * range, zk = cz + p.getZ(i) * 2 * range;
    let h = heightAt(xk, zk);
    // near the walkable place the backdrop sinks under the true-size ground
    const dv = Math.hypot(xk - viewer.x, zk - viewer.z);
    h -= (o.drop || 0.5) * K * (1 - smooth(0.4, 1.6, dv));
    p.setXYZ(i, at.x + (xk - viewer.x) * 1000 / K, at.y + (h - viewer.h) / K, at.z + (zk - viewer.z) * 1000 / K);
    // colour by height and roughness: steppe, scree, dark volcanic rock, then snow and ice
    const n2 = fbm(xk * 1.7, zk * 1.7);
    if (h < 2300) c.copy(C.steppe).lerp(C.scree, smooth(1900, 2300, h) * 0.8);
    else c.copy(C.scree).lerp(C.basalt, smooth(2400, 3300, h + (n2 - 0.5) * 500));
    const sn = smooth(D.snow - 250, D.snow + 150, h + (n2 - 0.5) * 600);
    c.lerp(h > 4700 ? C.snow : C.ice, sn);
    c.multiplyScalar(0.88 + n2 * 0.24);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: false }));
  m.name = "massif"; ctx.group.add(m);
  return m;
}
