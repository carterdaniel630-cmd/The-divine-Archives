/* III · The Apadana: its podium, the bases of all 72 columns with the shafts of those that stand (layout.js), the
   worn-down corner towers; and, seen from it, the other ruins of the terrace in outline: the Hall of a Hundred
   Columns (bases and door frames), the Tachara (columns and its stone door and window frames) and the Treasury
   (the line of its walls). Sizes in dims.js; placings and which columns stand APPROX. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { apadanaCols, hundredCols } from "./layout.js?v=1";
import { Bucket, V, wall } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export function build(ctx) {
  const A = D.ap, T = D.T, AY = A.y, O = A.out, R = rng(91);
  const stone = ctx.mat("limestone", { color: new THREE.Color("#8f8b83") }), floor = ctx.mat("floor", { color: new THREE.Color("#a9a294") });
  const mud = ctx.mat("rock", { color: new THREE.Color("#a58a6a") }), podM = ctx.mat("block", { color: new THREE.Color("#a29c8f") });
  const F = new Bucket(), P = new Bucket(), C = new Bucket(), M = new Bucket();
  const box = (B, k, sx, sy, sz, x, y, z) => { const g = new THREE.BoxGeometry(sx, sy, sz); g.translate(x, y + sy / 2, z); B.geo(k, g); };

  // ---- the podium: its top and its four faces
  F.quad("f", V(-O, AY, O), V(O, AY, O), V(O, AY, -O), V(-O, AY, -O));
  wall(P, "p", -O, -O, -O, O, T, A.podH); wall(P, "p", O, -O, -O, -O, T, A.podH); wall(P, "p", -O, O, O, O, T, A.podH); wall(P, "p", O, O, O, -O, T, A.podH);
  // ---- the 72 columns: a square plinth and a bell-shaped base for each; the shaft where a column stands, a stump where it fell
  for (const c of apadanaCols()) {
    box(C, "c", 2.2, 0.35, 2.2, c.x, AY, c.z);
    const bell = new THREE.CylinderGeometry(A.colD / 2 + 0.05, A.colD / 2 + 0.45, 0.9, 20); bell.translate(c.x, AY + 0.35 + 0.45, c.z); C.geo("c", bell);
    const y0 = AY + 1.25, h = c.stand ? A.colH - 1.25 : 0.4 + R() * 1.6;
    const sh = new THREE.CylinderGeometry(A.colD / 2 - 0.04, A.colD / 2, h, c.stand ? 24 : 16, 1, !c.stand ? false : true); sh.translate(c.x, y0 + h / 2, c.z); C.geo("c", sh);
  }
  // ---- the four corner towers, worn down to their lowest courses
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(M, "m", O - A.half, 1.4, O - A.half, sx * (A.half + O) / 2, AY, sz * (A.half + O) / 2);
  // the south side's rooms, as the lines of their walls
  for (let k = 0; k < 4; k++) box(M, "m", 0.9, 0.8, O - A.half, -A.half + 6 + k * 16, AY, (A.half + O) / 2);

  // ---- the Hall of a Hundred Columns: bases, and the stone frames of its doors, two to a side
  const H = D.hc;
  for (const c of hundredCols()) box(C, "c", 1.7, 0.45, 1.7, c.x, T, c.z);
  for (const [nx, nz] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) for (const o of [-10, 10]) for (const s of [-1, 1]) {
    const x = H.x + nx * H.half + (nz ? o + s * 2.6 : 0), z = H.z + nz * H.half + (nx ? o + s * 2.6 : 0);
    box(C, "c", nx ? 1.6 : 1.2, 7.0, nx ? 1.2 : 1.6, x, T, z);
  }
  // ---- the Tachara: twelve column bases, and its stone door and window frames round the walls' line
  const Ta = D.ta;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) box(C, "c", 1.2, 0.4, 1.2, Ta.x - 6 + 6 * i, T, Ta.z - 9 + 6 * j);
  const frame = (x, z, along, w, h) => {
    const a = along === "x";
    box(C, "c", a ? 0.9 : 1.1, h, a ? 1.1 : 0.9, x - (a ? w / 2 : 0), T, z - (a ? 0 : w / 2));
    box(C, "c", a ? 0.9 : 1.1, h, a ? 1.1 : 0.9, x + (a ? w / 2 : 0), T, z + (a ? 0 : w / 2));
    box(C, "c", a ? w + 0.9 : 1.1, 0.8, a ? 1.1 : w + 0.9, x, T + h, z);
  };
  for (const x of [Ta.x - 8, Ta.x, Ta.x + 8]) frame(x, Ta.z - Ta.hz, "x", 2.4, x === Ta.x ? 5.4 : 3.6);
  for (const z of [Ta.z - 10, Ta.z, Ta.z + 10]) { frame(Ta.x - Ta.hx, z, "z", 2.2, 3.4); frame(Ta.x + Ta.hx, z, "z", 2.2, 3.4); }
  // ---- the Treasury: the line of its walls
  const Tr = D.tr;
  box(M, "m", 2 * Tr.hx, 0.9, 1.4, Tr.x, T, Tr.z - Tr.hz); box(M, "m", 2 * Tr.hx, 0.9, 1.4, Tr.x, T, Tr.z + Tr.hz);
  box(M, "m", 1.4, 0.9, 2 * Tr.hz, Tr.x - Tr.hx, T, Tr.z); box(M, "m", 1.4, 0.9, 2 * Tr.hz, Tr.x + Tr.hx, T, Tr.z);
  for (let k = 1; k < 4; k++) box(M, "m", 1.0, 0.6, 2 * Tr.hz, Tr.x - Tr.hx + k * 2 * Tr.hx / 4, T, Tr.z);

  finish(ctx, F, { f: floor }, ["f"]);
  finish(ctx, P, { p: podM }, []);
  finish(ctx, C, { c: stone }, []);
  finish(ctx, M, { m: mud }, []);
  sign(ctx, ["The Hall of a Hundred Columns", "begun by Xerxes · finished by Artaxerxes I"], H.x - H.half - 3, T + 2.4, H.z, -Math.PI / 2, 3.0, 0.5, { size: 48 });
  sign(ctx, ["The Tachara", "the palace of Darius"], Ta.x, T + 2.4, Ta.z - Ta.hz - 3, Math.PI, 2.4, 0.5, { size: 52 });
  markers(ctx, site, "s3");
}
