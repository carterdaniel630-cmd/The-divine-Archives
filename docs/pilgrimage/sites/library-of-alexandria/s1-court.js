/* I · The walk and the exedra (reconstruction): a garden court inside a colonnaded walk, with a
   semicircular exedra and its bench on the north side. Every size is conjecture (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const marble = ctx.mat("gallery", { color: new THREE.Color("#ece4d4") });
  const paving = ctx.mat("floor", { color: new THREE.Color("#d8ccb4") });
  const col = ctx.mat("block", { color: new THREE.Color("#f1ebde") });
  const roofM = new THREE.MeshStandardMaterial({ color: "#9b6a44", roughness: 0.8 });
  const garden = new THREE.MeshStandardMaterial({ color: "#6f7d4a", roughness: 0.95 });
  const C = D.court, W = D.walk, Hc = D.colH, B = new Bucket(), F = new Bucket(), K = new Bucket();
  const ox0 = C.x0 - W, ox1 = C.x1 + W, oz0 = C.z0 - W, oz1 = C.z1 + W;
  // paving under the walk and round the garden, and the garden beds in the middle
  F.quad("p", V(ox0, 0, oz1), V(ox1, 0, oz1), V(ox1, 0, oz0), V(ox0, 0, oz0));
  const bed = new THREE.Mesh(new THREE.BoxGeometry(C.x1 - C.x0 - 4, 0.25, C.z1 - C.z0 - 4), garden); bed.position.set(0, 0.125, 0); ctx.group.add(bed);
  // the back walls of the walk, with a door in the south (to the large house), in the east (back to the
  // vestibule) and the opening of the exedra in the north
  const wallH = Hc + 0.6, ex = D.exedra.r;
  const wallQ = (a, b) => B.quad("w", V(a[0], 0, a[1]), V(b[0], 0, b[1]), V(b[0], wallH, b[1]), V(a[0], wallH, a[1]));
  wallQ([ox0, oz0], [-ex, oz0]); wallQ([ex, oz0], [ox1, oz0]);                         // north, with the exedra's opening
  wallQ([ox1, oz1], [1.0, oz1]); wallQ([-1.0, oz1], [ox0, oz1]);                       // south, with the door
  B.quad("w", V(1.0, 3.0, oz1), V(-1.0, 3.0, oz1), V(-1.0, wallH, oz1), V(1.0, wallH, oz1));
  wallQ([ox0, oz1], [ox0, oz0]);                                                       // west
  wallQ([ox1, oz0], [ox1, -1.0]); wallQ([ox1, 1.0], [ox1, oz1]);                       // east, with the door
  B.quad("w", V(ox1, 3.0, -1.0), V(ox1, 3.0, 1.0), V(ox1, wallH, 1.0), V(ox1, wallH, -1.0));
  // the columns round the court, and the lean-to roof of the walk
  const pos = [];
  for (let x = C.x0; x <= C.x1 + 1e-6; x += D.colStep) { pos.push([x, C.z0], [x, C.z1]); }
  for (let z = C.z0 + D.colStep; z < C.z1 - 1e-6; z += D.colStep) { pos.push([C.x0, z], [C.x1, z]); }
  for (const [x, z] of pos) {
    const shaft = new THREE.CylinderGeometry(D.colR * 0.86, D.colR, Hc, 14, 1); shaft.translate(x, Hc / 2, z); K.geo("c", shaft);
    const cap = new THREE.BoxGeometry(D.colR * 2.6, 0.28, D.colR * 2.6); cap.translate(x, Hc + 0.14, z); K.geo("c", cap);
    const base = new THREE.CylinderGeometry(D.colR * 1.25, D.colR * 1.3, 0.22, 14); base.translate(x, 0.11, z); K.geo("c", base);
  }
  const beam = (x0, z0, x1, z1) => { const g = new THREE.BoxGeometry(Math.abs(x1 - x0) + 0.6, 0.5, Math.abs(z1 - z0) + 0.6); g.translate((x0 + x1) / 2, Hc + 0.53, (z0 + z1) / 2); K.geo("c", g); };
  beam(C.x0, C.z0, C.x1, C.z0); beam(C.x0, C.z1, C.x1, C.z1); beam(C.x0, C.z0, C.x0, C.z1); beam(C.x1, C.z0, C.x1, C.z1);
  const rT = wallH, rB = Hc + 0.78;
  B.quad("r", V(ox0, rT, oz0), V(ox1, rT, oz0), V(C.x1, rB, C.z0), V(C.x0, rB, C.z0));
  B.quad("r", V(C.x0, rB, C.z1), V(C.x1, rB, C.z1), V(ox1, rT, oz1), V(ox0, rT, oz1));
  B.quad("r", V(ox0, rT, oz1), V(C.x0, rB, C.z1), V(C.x0, rB, C.z0), V(ox0, rT, oz0));
  B.quad("r", V(ox1, rT, oz0), V(C.x1, rB, C.z0), V(C.x1, rB, C.z1), V(ox1, rT, oz1));
  // the exedra: a half-round recess north of the walk, with a continuous stone bench and a half-dome
  const n = 18, cz = oz0;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI + (i / n) * Math.PI, a1 = Math.PI + ((i + 1) / n) * Math.PI;
    const p0 = [Math.cos(a0) * ex, cz + Math.sin(a0) * ex], p1 = [Math.cos(a1) * ex, cz + Math.sin(a1) * ex];
    B.quad("w", V(p0[0], 0, p0[1]), V(p1[0], 0, p1[1]), V(p1[0], D.exedra.h, p1[1]), V(p0[0], D.exedra.h, p0[1]));
    F.quad("p", V(0, 0, cz), V(p1[0], 0, p1[1]), V(p0[0], 0, p0[1]), V(0, 0, cz));
    const b0 = [Math.cos(a0) * (ex - 0.55), cz + Math.sin(a0) * (ex - 0.55)], b1 = [Math.cos(a1) * (ex - 0.55), cz + Math.sin(a1) * (ex - 0.55)];
    K.quad("c", V(b0[0], 0.45, b0[1]), V(b1[0], 0.45, b1[1]), V(p1[0], 0.45, p1[1]), V(p0[0], 0.45, p0[1]));
    K.quad("c", V(b1[0], 0, b1[1]), V(b0[0], 0, b0[1]), V(b0[0], 0.45, b0[1]), V(b1[0], 0.45, b1[1]));
    for (let k = 0; k < 4; k++) {   // the half-dome, in four rings
      const e0 = k / 4 * Math.PI / 2, e1 = (k + 1) / 4 * Math.PI / 2, r0 = Math.cos(e0) * ex, r1 = Math.cos(e1) * ex, y0 = D.exedra.h + Math.sin(e0) * ex * 0.6, y1 = D.exedra.h + Math.sin(e1) * ex * 0.6;
      B.quad("w", V(Math.cos(a0) * r0, y0, cz + Math.sin(a0) * r0), V(Math.cos(a1) * r0, y0, cz + Math.sin(a1) * r0), V(Math.cos(a1) * r1, y1, cz + Math.sin(a1) * r1), V(Math.cos(a0) * r1, y1, cz + Math.sin(a0) * r1));
    }
  }
  finish(ctx, F, { p: paving }, ["p"]);
  finish(ctx, B, { w: marble, r: roofM }, []);
  finish(ctx, K, { c: col }, []);
  sign(ctx, ["RECONSTRUCTION", "after one sentence of Strabo · the plan is conjecture"], 0, 4.2, oz1 - 0.05, Math.PI, 3.4, 0.7, { size: 60 });
  sign(ctx, ["To the large house", "reconstruction"], 0, 3.5, oz1 - 0.06, Math.PI, 1.8, 0.42, { size: 54 });
  sign(ctx, ["The Vestibule", "and back to the museum"], ox1 - 0.06, 3.5, 0, -Math.PI / 2, 1.8, 0.42, { size: 54 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#ffe8c0" }, 0, 0, oz1 - 0.15, Math.PI);
  ctx.portal({ w: 1.3, h: 2.2, tint: "#fff0d8" }, ox1 - 0.15, 0, 0, -Math.PI / 2);
  markers(ctx, site, "s1");
}
