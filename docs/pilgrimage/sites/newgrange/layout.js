/* Newgrange: where each stone stands (shared by the section modules and site.js's walkable regions).
   Bearings are measured clockwise from the entrance axis (+z), in degrees; every placing here is APPROX. */
import { D } from "./dims.js?v=1";

const RAD = Math.PI / 180;
// a point at radius r and bearing b from the entrance axis
export const at = (r, b) => ({ x: r * Math.sin(b * RAD), z: r * Math.cos(b * RAD) });
// a stone whose face looks outward from the centre, at bearing b: its megalith.js yaw
export const outward = (b) => Math.PI - b * RAD;

// the kerb: 97 places round the foot of the mound. Place 0 is the Entrance Stone (K1, built on its own);
// place 1 is left empty in the model for the way in past K1 (the real site has steps over it).
export function kerb() {
  const out = [];
  for (let k = 2; k < D.kerbN; k++) {
    const b = k * 360 / D.kerbN, p = at(D.R, b);
    out.push({ k, b, x: p.x, z: p.z, yaw: outward(b), w: 2 * Math.PI * D.R / D.kerbN - 0.12, h: D.kerbH * (0.82 + ((k * 37) % 11) / 30) });
  }
  return out;
}
// the twelve surviving stones of the Great Circle
export function circle() {
  return D.gc.map((s, i) => { const p = at(D.gcR, s.b); return { i, b: s.b, x: p.x, z: p.z, h: s.h, yaw: outward(s.b) + ((i * 29) % 20 - 10) * RAD, w: 1.5 + (i % 3) * 0.25, d: 0.8 }; });
}
// a stone's plan footprint as a walkable-region hole (generous: the stones are turned)
export const hole = (s, pad) => { const r = Math.max(s.w, s.d) / 2 + (pad || 0.3); return [s.x - r, s.x + r, s.z - r, s.z + r]; };
