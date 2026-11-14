/* IV · The stadium: the running track with its stone starting sills at each end, twelve rows of seats on the
   north side, six on the south and round the curved west end, and the four piers of the Roman arch at the east
   entrance (the arch over them is our own rendering). Track size and row counts published; the rest APPROX. */
import * as THREE from "three";
import site, { ST } from "./site.js?v=1";
import { box, oquad, UP } from "./greek.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const seatM = ctx.mat("limestone", { color: new THREE.Color("#cfc5b2") });
  const sand = ctx.mat("rock", { color: new THREE.Color("#cdb58f") });
  const stone = ctx.mat("limestone", { color: new THREE.Color("#b6ad9c") });
  const ground = ctx.mat("rock", { color: new THREE.Color("#a3957a") });
  const far = new THREE.MeshStandardMaterial({ color: "#8f8a6e", roughness: 1, side: THREE.DoubleSide });
  const S = new Bucket(), F = new Bucket(), W = new Bucket(), G = new Bucket();
  const x0 = ST.x - ST.L / 2, x1 = ST.x + ST.L / 2, zN = ST.z - ST.W / 2, zS = ST.z + ST.W / 2, cxW = x0, rW = ST.W / 2;
  // the track
  F.quad("t", V(x0, 0, zS), V(x1 + 14, 0, zS), V(x1 + 14, 0, zN), V(x0, 0, zN));
  for (let i = 0; i < 16; i++) { const a0 = Math.PI / 2 + Math.PI * i / 16, a1 = Math.PI / 2 + Math.PI * (i + 1) / 16; F.tri("t", V(cxW, 0, ST.z), V(cxW + Math.cos(a0) * rW, 0, ST.z + Math.sin(a0) * rW), V(cxW + Math.cos(a1) * rW, 0, ST.z + Math.sin(a1) * rW)); }
  // the starting sills: a line of stone slabs across the track at each end, with grooves for the runners' toes
  for (const x of [x0 + 0.6, x1 - 0.6]) { box(W, "st", x - 0.3, x + 0.3, -0.02, 0.04, zN + 0.3, zS - 0.3); for (let k = 1; k < 17; k++) box(W, "dk", x - 0.31, x + 0.31, 0.03, 0.05, zN + k * ST.W / 17 - 0.03, zN + k * ST.W / 17 + 0.03); }
  // the seats: straight rows along the north (12) and south (6), and the curved west end (6)
  const row = (k, side) => {
    const n = side < 0 ? ST.rowsN : ST.rowsS; if (k >= n) return;
    const zIn = side < 0 ? zN - 0.6 - k * ST.rowD : zS + 0.6 + k * ST.rowD, zOut = zIn + side * ST.rowD, y0 = 0.5 + k * ST.rowH, y1 = y0 + ST.rowH;
    oquad(S, "s", V(x0, y1, zIn), V(x1, y1, zIn), V(x1, y1, zOut), V(x0, y1, zOut), UP);
    oquad(S, "s", V(x0, y0, zIn), V(x1, y0, zIn), V(x1, y1, zIn), V(x0, y1, zIn), V(0, 0, -side));
    oquad(S, "s", V(x1, -0.2, zIn), V(x1, -0.2, zOut), V(x1, y1, zOut), V(x1, y1, zIn), V(1, 0, 0));
  };
  for (let k = 0; k < ST.rowsN; k++) row(k, -1);
  for (let k = 0; k < ST.rowsS; k++) row(k, 1);
  // the low wall in front of the seats (the seats start half a metre above the track)
  box(W, "st", x0, x1, -0.1, 0.5, zN - 0.6, zN); box(W, "st", x0, x1, -0.1, 0.5, zS, zS + 0.6);
  const segs = 18;
  for (let k = 0; k < ST.rowsS; k++) {
    const r0 = rW + 0.6 + k * ST.rowD, r1 = r0 + ST.rowD, y0 = 0.5 + k * ST.rowH, y1 = y0 + ST.rowH;
    for (let i = 0; i < segs; i++) {
      const a0 = Math.PI / 2 + Math.PI * i / segs, a1 = Math.PI / 2 + Math.PI * (i + 1) / segs, am = (a0 + a1) / 2;
      const p = (r, a, y) => V(cxW + Math.cos(a) * r, y, ST.z + Math.sin(a) * r);
      oquad(S, "s", p(r0, a0, y1), p(r0, a1, y1), p(r1, a1, y1), p(r1, a0, y1), UP);
      oquad(S, "s", p(r0, a0, y0), p(r0, a1, y0), p(r0, a1, y1), p(r0, a0, y1), V(-Math.cos(am), 0, -Math.sin(am)));
      if (k === 0) oquad(W, "st", p(rW, a0, -0.1), p(rW, a1, -0.1), p(rW, a1, 0.5), p(rW, a0, 0.5), V(-Math.cos(am), 0, -Math.sin(am)));
    }
  }
  // the hillside round the stadium: rising behind the north seats, falling away beyond the south ones
  const hy = (x, z) => {
    const dzN = (zN - 0.6 - ST.rowsN * ST.rowD) - z, dzS = z - (zS + 0.6 + ST.rowsS * ST.rowD), dxW = (x0 - rW - 0.6 - ST.rowsS * ST.rowD) - x;
    let y = -0.3;
    if (dzN > 0) y = 0.5 + ST.rowsN * ST.rowH + dzN * 0.45;
    else if (dzS > 0) y = 0.5 + ST.rowsS * ST.rowH - dzS * 0.3;
    if (dxW > 0) y = Math.max(y, 0.5 + ST.rowsS * ST.rowH + dxW * 0.2);
    return y;
  };
  const gx0 = ST.x - 260, gx1 = ST.x + 260, gz0 = ST.z - 160, gz1 = ST.z + 160, c = 8;
  const inner = (x, z) => x > x0 - rW - 5 && x < x1 + 15 && z > zN - 10 && z < zS + 6;
  for (let z = gz0; z < gz1; z += c) for (let x = gx0; x < gx1; x += c) {
    if (inner(x, z) && inner(x + c, z + c) && inner(x + c, z) && inner(x, z + c)) continue;
    G.quad("g", V(x, hy(x, z + c), z + c), V(x + c, hy(x + c, z + c), z + c), V(x + c, hy(x + c, z), z), V(x, hy(x, z), z));
  }
  const ring = (r0, r1, y0f, y1v) => { const n = 32; for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2; const p = (r, a, y) => V(ST.x + Math.cos(a) * r, y, ST.z + Math.sin(a) * r); G.quad("f", p(r1, y1v, a0), p(r1, y1v, a1), p(r0, y0f(a1), a1), p(r0, y0f(a0), a0)); } };
  ring(300, 2400, (a) => (Math.sin(a) < 0 ? 60 : -40), -120);
  // the east entrance: four piers of the Roman arch, and the arch over them (our own rendering)
  const ax = x1 + 2.6, zs = [-9.6, -3.2, 3.2, 9.6].map((d) => ST.z + d);
  for (const z of zs) box(W, "m", ax - 0.8, ax + 0.8, 0, 5.2, z - 0.8, z + 0.8);
  box(W, "m", ax - 0.9, ax + 0.9, 5.2, 6.4, zs[0] - 0.9, zs[3] + 0.9);
  finish(ctx, F, { t: sand }, ["t"]);
  finish(ctx, S, { s: seatM }, ["s"]);
  finish(ctx, W, { st: stone, m: ctx.mat("gallery", { color: new THREE.Color("#e6dfd1") }), dk: new THREE.MeshStandardMaterial({ color: "#6d6455", roughness: 0.9 }) }, []);
  finish(ctx, G, { g: ground, f: far }, ["g"]);
  sign(ctx, ["The stadium", "track 177.55 m · the Pythian Games"], ax + 0.92, 5.8, ST.z, Math.PI / 2, 2.6, 0.55, { size: 54 });
  sign(ctx, ["Back to the theatre"], x1 + 13.2, 2.9, ST.z - 1.7, -Math.PI / 2, 1.5, 0.36, { size: 56 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#fff0d8" }, x1 + 12.9, 0, ST.z, -Math.PI / 2);
  markers(ctx, site, "s4");
}
