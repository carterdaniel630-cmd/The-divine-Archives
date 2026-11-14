/* III · The theatre: the way up from the temple terrace, the side entrance, the round orchestra, the stage
   building (our own simple rendering) and 35 rows of seats rising up the hill, with the stairways between
   the wedges of seats; at the top, the way on to the stadium. Row count published; the rest APPROX. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, vrect, padFloor, gable, doric, UP } from "./greek.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const TH = D.theatre;
  const seatM = ctx.mat("limestone", { color: new THREE.Color("#cbc1ae") });
  const paving = ctx.mat("floor", { color: new THREE.Color("#d2c8b4") });
  const stone = ctx.mat("limestone", { color: new THREE.Color("#b5ac9b") });
  const marble = ctx.mat("gallery", { color: new THREE.Color("#ece5d7") });
  const roofM = new THREE.MeshStandardMaterial({ color: "#a65a3c", roughness: 0.8 });
  const S = new Bucket(), F = new Bucket(), W = new Bucket();
  // the way up from the terrace, and the side entrance (parodos) into the orchestra
  padFloor(F, "p", D.toTheatre, 10); padFloor(F, "p", D.parodos);
  // the orchestra: a paved disc, with the low base of an altar at its centre
  const n = 40;
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, r = TH.orchR;
    F.tri("p", V(TH.x, TH.y + 0.01, TH.z), V(TH.x + Math.sin(a1) * r, TH.y + 0.01, TH.z - Math.cos(a1) * r), V(TH.x + Math.sin(a0) * r, TH.y + 0.01, TH.z - Math.cos(a0) * r));
  }
  box(W, "st", TH.x - 0.6, TH.x + 0.6, TH.y, TH.y + 0.5, TH.z - 0.6, TH.z + 0.6);
  // the rows: each a band of the ring, its riser and its tread, from bearing -span to +span (0 = north)
  const span = TH.span * Math.PI / 180, segs = 36, stairs = 7;
  const at = (r, a, y) => V(TH.x + Math.sin(a) * r, y, TH.z - Math.cos(a) * r);
  for (let k = 0; k < TH.rows; k++) {
    const r0 = TH.orchR + k * TH.rowD, r1 = r0 + TH.rowD, y0 = TH.y + k * TH.rowH, y1 = y0 + TH.rowH;
    for (let i = 0; i < segs; i++) {
      const a0 = -span + 2 * span * i / segs, a1 = -span + 2 * span * (i + 1) / segs, am = (a0 + a1) / 2;
      oquad(S, "s", at(r0, a0, y1), at(r0, a1, y1), at(r1, a1, y1), at(r1, a0, y1), UP);
      oquad(S, "s", at(r0, a0, y0), at(r0, a1, y0), at(r0, a1, y1), at(r0, a0, y1), V(-Math.sin(am), 0, Math.cos(am)));
    }
    // the ends of the row (seen from the side entrances)
    for (const a of [-span, span]) oquad(S, "s", at(r0, a, TH.y - 0.5), at(r1, a, TH.y - 0.5), at(r1, a, y1), at(r0, a, y1), V(Math.cos(a) * Math.sign(a), 0, Math.sin(a) * Math.sign(a)));
  }
  // the stairways: a paler strip up each line between the wedges of seats
  for (let s = 0; s <= stairs; s++) {
    const a = -span + 2 * span * s / stairs;
    for (let k = 0; k < TH.rows; k++) {
      const r0 = TH.orchR + k * TH.rowD, r1 = r0 + TH.rowD, y1 = TH.y + (k + 1) * TH.rowH + 0.01;
      const w = 0.5 / r0;
      oquad(F, "st", at(r0, a - w, y1), at(r0, a + w, y1), at(r1, a + w, y1), at(r1, a - w, y1), UP);
    }
  }
  // the walk along the top
  const rTop = TH.orchR + TH.rows * TH.rowD, yTop = TH.y + TH.rows * TH.rowH;
  padFloor(F, "p", { x0: TH.x - 6, x1: TH.x + 6, z0: TH.z - rTop - 2.4, z1: TH.z - rTop, y: yTop });
  // the stage building: a long low hall with three doors and a colonnaded front onto the orchestra
  const SK = D.skene, sy = TH.y;
  box(W, "m", SK.x0, SK.x1, sy, sy + SK.h, SK.z0 + 1.6, SK.z1);
  for (const dx of [-6, 0, 6]) box(W, "dk", (SK.x0 + SK.x1) / 2 + dx - 0.8, (SK.x0 + SK.x1) / 2 + dx + 0.8, sy, sy + 2.6, SK.z0 + 1.58, SK.z0 + 1.62);
  box(W, "m", SK.x0, SK.x1, sy, sy + 0.25, SK.z0, SK.z0 + 1.6);
  for (let i = 0; i < 9; i++) doric(W, "m", SK.x0 + 1 + i * (SK.x1 - SK.x0 - 2) / 8, sy + 0.25, SK.z0 + 0.4, 2.8, 0.18, { seg: 10 });
  box(W, "m", SK.x0, SK.x1, sy + 3.05, sy + 3.35, SK.z0, SK.z0 + 1.6);
  gable(W, "r", "m", SK.x0, SK.x1, SK.z0 + 1.6, SK.z1, sy + SK.h, 1.2, "x", 0.25);
  finish(ctx, S, { s: seatM }, ["s"]);
  finish(ctx, F, { p: paving, st: stone }, ["p", "st"]);
  finish(ctx, W, { st: stone, m: marble, r: roofM, dk: new THREE.MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.8 }) }, []);
  sign(ctx, ["To the stadium", "higher up the hill"], TH.x, yTop + 3.2, TH.z - rTop - 2.85, 0, 1.8, 0.45, { size: 54 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#ffe2b0" }, TH.x, yTop, TH.z - rTop - 2.6, 0);
  sign(ctx, ["The theatre", "35 rows · about 5,000 seats"], D.parodos.x1 - 2.0, TH.y + 2.6, D.parodos.z1 - 0.3, 0, 2.2, 0.5, { size: 54 });
  markers(ctx, site, "s3");
}
