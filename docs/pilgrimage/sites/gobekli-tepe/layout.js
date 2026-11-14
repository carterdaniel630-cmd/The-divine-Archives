/* Göbekli Tepe — where each pillar stands (shared by site.js, for the walkable regions, and by the section
   modules, for the geometry). Every placing is APPROX (dims.js): the pattern follows the published plans in
   outline (a central pair, the rest set radially in the wall facing in), not pillar by pillar. */
import { D } from "./dims.js?v=1";

const RAD = Math.PI / 180;
const at = (c, r, deg) => ({ x: c.x + Math.sin(deg * RAD) * r, z: c.z - Math.cos(deg * RAD) * r });
// a pillar set in a ring wall, its front (narrow face) turned to the centre
function ringOf(c, r, n, from, to, dim, tag) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const b = from + (to - from) * (n === 1 ? 0.5 : i / (n - 1)), p = at(c, r, b);
    out.push(Object.assign({ x: p.x, z: p.z, yaw: (b + 180) * RAD, b, id: tag + i }, dim));
  }
  return out;
}
// the central pair: side by side, fronts to the south (the long axis of the pair runs north–south, as in D)
function pairOf(c, gap, dim, ids, broken) {
  return ids.map((id, k) => Object.assign({ x: c.x + (k ? gap / 2 : -gap / 2), z: c.z, yaw: Math.PI, id, broken: broken ? broken[k] : 0 }, dim));
}

export function pillarsD() {
  const ring = ringOf(D.encD, D.encD.r - 0.45, D.dPillars, 205, 515, D.ring, "d");   // round the wall, leaving the south gap
  // the Vulture Stone, Pillar 43, stands in the north-west of the wall: give that place its own id
  const p43 = ring.reduce((a, p) => (Math.abs(((p.b % 360) + 360) % 360 - 315) < Math.abs(((a.b % 360) + 360) % 360 - 315) ? p : a));
  p43.id = "p43";
  return { central: pairOf(D.encD, D.dCentralGap, D.central, ["p31", "p18"]), ring };
}
export function pillarsC() {
  return { central: pairOf(D.encC, 2.8, D.central, ["p35", "p37"], [0.42, 0.3]), ring: ringOf(D.encC, D.encC.rings[0] - 0.4, D.cPillars, 210, 510, D.ring, "c") };
}
export function pillarsB() {
  return { central: pairOf(D.encB, 2.2, Object.assign({}, D.central, { h: 4.6 }), ["p9", "p10"]), ring: ringOf(D.encB, D.encB.r - 0.4, D.bPillars, 20, 340, Object.assign({}, D.ring, { h: 3.4 }), "b") };
}
export function pillarsA() {
  return { central: pairOf(D.encA, 2.0, Object.assign({}, D.central, { h: 3.8, L: 1.2 }), ["p1", "p2"]), ring: ringOf({ x: D.encA.x, z: D.encA.z }, 5.2, D.aPillars, 30, 330, Object.assign({}, D.ring, { h: 3.0 }), "a") };
}
// a pillar's plan footprint, padded, as a walkable-region hole [x0, x1, z0, z1]
export function hole(p, pad) {
  pad = pad || 0.3;
  const hl = (p.L + (p.headF || 0)) / 2 + pad, ht = p.t / 2 + pad, c = Math.abs(Math.cos(p.yaw)), s = Math.abs(Math.sin(p.yaw));
  const ex = hl * s + ht * c, ez = hl * c + ht * s;
  return [p.x - ex, p.x + ex, p.z - ez, p.z + ez];
}
export { at };
