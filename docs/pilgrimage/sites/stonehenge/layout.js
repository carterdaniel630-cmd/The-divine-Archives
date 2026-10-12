/* ==========================================================================
   Stonehenge — where each stone is, and what state it is in today

   One table shared by the walkable regions (site.js, as footprints) and the
   section modules (as stones), so the two always agree. Pure arithmetic: no
   three.js here.

   The present ruin is simplified. Which sarsen uprights stand, which have
   fallen and which are missing follows the present monument only in outline
   (seventeen uprights standing on the north-east side and in scattered
   places, six lintels in place); the place of every stone is APPROX (dims.js).

   Bearings are in degrees, clockwise from the axis (model north, -z), as seen
   from above. A stone at bearing b and radius r sits at
   x = r sin b, z = -r cos b.
   ========================================================================== */
import { D } from "./dims.js?v=1";

const RAD = Math.PI / 180;
export const at = (r, bDeg) => ({ x: r * Math.sin(bDeg * RAD), z: -r * Math.cos(bDeg * RAD) });
// the plan footprint of a w × d rectangle turned to bearing b (its depth axis radial)
export function foot(x, z, w, d, bDeg) {
  const c = Math.abs(Math.cos(bDeg * RAD)), s = Math.abs(Math.sin(bDeg * RAD));
  const ex = c * w / 2 + s * d / 2, ez = s * w / 2 + c * d / 2;
  return { x0: x - ex, x1: x + ex, z0: z - ez, z1: z + ez };
}

// ---------------------------------------------------------------- the sarsen circle: 30 uprights, stone 1 just clockwise of the axis
const STAND = new Set([1, 2, 3, 4, 5, 6, 7, 10, 11, 16, 21, 22, 23, 27, 28, 29, 30]);
const FALLEN = new Set([8, 9, 12, 14, 15, 19, 25, 26]);      // the rest (13, 17, 18, 20, 24) are missing or low stumps
const LINTELS = [[30, 1], [1, 2], [2, 3], [5, 6], [6, 7], [22, 23]];
export function sarsens() {
  const out = [];
  for (let i = 1; i <= D.sarsenN; i++) {
    const b = (i - 0.5) * (360 / D.sarsenN), p = at(D.sarsenR, b);
    out.push({ i, b, x: p.x, z: p.z, state: STAND.has(i) ? "stand" : FALLEN.has(i) ? "fallen" : "stump" });
  }
  return out;
}
export const sarsenLintels = () => LINTELS;

// ---------------------------------------------------------------- the trilithons
export function trilithons() {
  return D.trilithons.map((t, k) => {
    const c = at(t.r, t.b), off = D.triW / 2 + D.triGap / 2;
    // the two uprights sit either side of the centre, along the tangent
    const tx = Math.cos(t.b * RAD), tz = Math.sin(t.b * RAD);
    const pa = { x: c.x - tx * off, z: c.z - tz * off }, pb = { x: c.x + tx * off, z: c.z + tz * off };
    return Object.assign({ k, c, pa, pb }, t);   // pa, pb: the two uprights (t.b is the bearing)
  });
}

// ---------------------------------------------------------------- bluestones: the circle and the horseshoe
function seeded(n) { let s = n; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
export function bluestones() {
  const R = seeded(77), out = [];
  for (let i = 0; i < D.bluN; i++) {
    const b = (i + 0.5) * (360 / D.bluN);
    if (b < 4 || b > 356) continue;                               // the way in on the axis
    const r = R(), p = at(D.bluR + (R() - 0.5) * 0.4, b);
    if (r < 0.28) continue;                                       // missing
    out.push({ x: p.x, z: p.z, b, h: r < 0.62 ? 0.25 + R() * 0.5 : D.bluH * (0.75 + R() * 0.35), w: D.bluW * (0.8 + R() * 0.5), d: D.bluD * (0.8 + R() * 0.4), fallen: r > 0.94 });
  }
  return out;
}
export function bluestoneHorseshoe() {
  const R = seeded(91), out = [], up = new Set([3, 6, 9, 10, 12, 15]);   // six still upright
  for (let i = 0; i < D.bhN; i++) {
    const b = 112 + i * (136 / (D.bhN - 1)), p = at(D.bhR, b);
    out.push({ x: p.x, z: p.z, b, h: up.has(i) ? 1.8 + R() * 0.6 : 0.3 + R() * 0.4, w: 0.55, d: 0.45 });
  }
  return out;
}

// ---------------------------------------------------------------- the fallen stones inside the circle (base point, bearing the top points to, size)
// 55 lies broken in two across the Altar Stone, with its lintel 156 beside it; 59 and its lintel lie inward. APPROX
export function fallenInner() {
  const T = trilithons(), g = T[2], f = T[4];
  return [
    { x: g.pa.x, z: g.pa.z - 0.4, b: 8, w: D.triW, d: 1.0, h: 3.6, seed: 55 },              // 55, lower half
    { x: g.pa.x + 0.3, z: g.pa.z - 4.3, b: 352, w: D.triW * 0.95, d: 1.0, h: 3.4, seed: 56 }, // 55, upper half
    { x: g.pb.x + 1.2, z: g.pb.z - 1.6, b: 300, w: D.triLinH, d: D.triD, h: 4.8, seed: 57 },  // lintel 156
    { x: f.pa.x + 0.2, z: f.pa.z - 0.5, b: 35, w: D.triW, d: 1.0, h: 5.4, seed: 59 },         // 59
    { x: f.c.x + 0.8, z: f.c.z - 2.4, b: 120, w: D.triLinH, d: D.triD, h: 4.6, seed: 60 }   // its lintel
  ];
}
export function fallenFoot(s) {
  const ex = s.x + s.h * Math.sin(s.b * RAD), ez = s.z - s.h * Math.cos(s.b * RAD);
  const px = Math.cos(s.b * RAD) * s.w / 2, pz = Math.sin(s.b * RAD) * s.w / 2;
  const xs = [s.x - px, s.x + px, ex - px, ex + px], zs = [s.z - pz, s.z + pz, ez - pz, ez + pz];
  return { x0: Math.min(...xs), x1: Math.max(...xs), z0: Math.min(...zs), z1: Math.max(...zs) };
}

// ---------------------------------------------------------------- footprints for the walkable regions
export function ringStones() {
  const station = D.station.map((s) => at(D.aubreyR - 1.5, s.b));
  return {
    heel: foot(D.heel.x, D.heel.z, D.heel.w, D.heel.d, 0),
    slaughter: { x0: -4.7, x1: -2.5, z0: -60.4, z1: -53.6 },
    station: station.map((p) => foot(p.x, p.z, 1.0, 0.8, 0)),
    stationPos: station
  };
}
export function innerStones() {
  const out = [];
  for (const t of trilithons()) {
    out.push(foot(t.pa.x, t.pa.z, D.triW, D.triD, t.b), foot(t.pb.x, t.pb.z, D.triW, D.triD, t.b));
  }
  for (const f of fallenInner()) out.push(fallenFoot(f));
  out.push({ x0: D.altar.x - D.altar.l / 2, x1: D.altar.x + D.altar.l / 2, z0: D.altar.z - 0.6, z1: D.altar.z + 0.6 });
  for (const s of bluestoneHorseshoe()) out.push(foot(s.x, s.z, s.w, s.d, s.b));
  return out;
}
