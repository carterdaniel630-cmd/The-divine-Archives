/* Persepolis: where each column stands (shared by the section modules and site.js's walkable regions).
   Grids after the published counts (dims.js); the spacing and which columns stand are APPROX. */
import { D } from "./dims.js?v=1";

const A = D.ap, std = new Set(A.standing);
// the Apadana's 72 columns: 36 in the hall (6 × 6) and 12 in each of three porticoes (2 rows of 6)
export function apadanaCols() {
  const out = [], g = (i) => -A.half + 5 + 10 * i, pr = (r) => A.half + 6 + 8 * r;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) out.push({ id: `h-${i}-${j}`, x: g(i), z: g(j) });
  for (let r = 0; r < 2; r++) for (let k = 0; k < 6; k++) {
    out.push({ id: `n-${r}-${k}`, x: g(k), z: -pr(r) });
    out.push({ id: `e-${r}-${k}`, x: pr(r), z: g(k) });
    out.push({ id: `w-${r}-${k}`, x: -pr(r), z: g(k) });
  }
  for (const c of out) c.stand = std.has(c.id);
  return out;
}
// the Gate of All Nations: four columns, two of them standing (APPROX)
export function gateCols() {
  const G = D.gate, o = G.colOff;
  return [[-1, -1, true], [1, -1, true], [-1, 1, false], [1, 1, false]].map(([sx, sz, s], i) => ({ id: "g" + i, x: G.x + sx * o, z: G.z + sz * o, stand: s }));
}
// the gate's stone door jambs: west (bulls), east (human-headed winged bulls), south (plain)
export function gateJambs() {
  const G = D.gate, h = G.half, d = G.door / 2 + G.jambW / 2, out = [];
  for (const s of [-1, 1]) {
    out.push({ door: "w", x: G.x - h, z: G.z + s * d, along: "x", side: s });
    out.push({ door: "e", x: G.x + h, z: G.z + s * d, along: "x", side: s });
    out.push({ door: "s", x: G.x + s * d, z: G.z + h, along: "z", side: s });
  }
  return out;
}
// the Hall of a Hundred Columns: bases only
export function hundredCols() {
  const H = D.hc, sp = 2 * H.half / H.n, out = [];
  for (let i = 0; i < H.n; i++) for (let j = 0; j < H.n; j++) out.push({ x: H.x - H.half + sp * (i + 0.5), z: H.z - H.half + sp * (j + 0.5) });
  return out;
}
// a column base's footprint as a walkable-region hole
export const hole = (c, r) => [c.x - r, c.x + r, c.z - r, c.z + r];
// a jamb's footprint
export function jambBox(j) {
  const G = D.gate, a = j.along === "x" ? G.jambD / 2 : G.jambW / 2, b = j.along === "x" ? G.jambW / 2 : G.jambD / 2;
  return [j.x - a, j.x + a, j.z - b, j.z + b];
}
