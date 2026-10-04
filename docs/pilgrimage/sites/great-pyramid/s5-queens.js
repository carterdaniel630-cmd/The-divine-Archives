/* V · The horizontal passage (with its step down) and the gabled Queen's Chamber with its corbelled niche. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, wall, V } from "../../kit.js?v=1";
import { markers, lamp, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const M = { lime: ctx.mat("limestone"), qc: ctx.mat("qc"), floor: ctx.mat("floor"), rough: ctx.mat("rock", { color: new THREE.Color("#d8c9ac") }) };
  const B = new Bucket(), F = new Bucket();
  const pw2 = D.pw / 2, zA = D.ggZ0 + 0.9, zF = D.ggZ0 + (D.ph + D.slab) / D.ascTan, roofY = D.hpY + D.ph;

  // ---- the horizontal passage: low, level, then a step down for its last stretch
  F.quad("pf", V(-pw2, D.hpY, D.hpStepZ), V(pw2, D.hpY, D.hpStepZ), V(pw2, D.hpY, zA), V(-pw2, D.hpY, zA));
  F.quad("pf", V(-pw2, D.qcFloor, D.qcZ0), V(pw2, D.qcFloor, D.qcZ0), V(pw2, D.qcFloor, D.hpStepZ), V(-pw2, D.qcFloor, D.hpStepZ));
  B.quad("lime", V(-pw2, D.qcFloor, D.hpStepZ), V(pw2, D.qcFloor, D.hpStepZ), V(pw2, D.hpY, D.hpStepZ), V(-pw2, D.hpY, D.hpStepZ));   // the step
  B.quad("lime", V(-pw2, roofY, zF), V(pw2, roofY, zF), V(pw2, roofY, D.qcZ0), V(-pw2, roofY, D.qcZ0));                                 // roof
  for (const sg of [-1, 1]) {
    const x = sg * pw2;
    const q = (za, zb, ya, yb) => sg < 0 ? B.quad("lime", V(x, ya, zb), V(x, ya, za), V(x, yb, za), V(x, yb, zb)) : B.quad("lime", V(x, ya, za), V(x, ya, zb), V(x, yb, zb), V(x, yb, za));
    q(zA, D.hpStepZ, D.hpY, roofY); q(D.hpStepZ, D.qcZ0, D.qcFloor, roofY);
  }
  for (const z of [-34, -24, -14, D.hpStepZ + 1.5]) lamp(ctx, pw2 - 0.04, (z > D.hpStepZ ? D.qcFloor : D.hpY) + 0.9, z, 0.45, -1, 0);

  // ---- the Queen's Chamber
  const x0 = D.qcX0, x1 = D.qcX1, z0 = D.qcZ0, z1 = D.qcZ1, y0 = D.qcFloor, hw = D.qcWall, hr = D.qcRidge, sx = -2.0, sh = 0.2, shY = 1.5;
  F.quad("rf", V(x0, y0, z1), V(x1, y0, z1), V(x1, y0, z0), V(x0, y0, z0));
  wall(B, "qc", x0, z0, x1, z0, y0, hw, [{ u0: -pw2 - x0, u1: pw2 - x0, v0: 0, v1: roofY - y0 }, { u0: sx - x0 - sh / 2, u1: sx - x0 + sh / 2, v0: shY, v1: shY + sh }]);
  wall(B, "qc", x1, z1, x0, z1, y0, hw, [{ u0: x1 - sx - sh / 2, u1: x1 - sx + sh / 2, v0: shY, v1: shY + sh }]);
  wall(B, "qc", x0, z1, x0, z0, y0, hw);
  // the east wall, with the opening of the niche
  const N = D.niche, c = N.zOff, os = (N.base - N.top) / (2 * N.steps), H = [0, 1.58, 2.37, 3.17, N.topAt, N.roof];   // overlap heights APPROX except the top two
  const wk = (k) => N.base - 2 * os * k;
  wall(B, "qc", x1, z0, x1, z1, y0, hw, [{ u0: c - z0 - N.base / 2, u1: c - z0 + N.base / 2, v0: 0, v1: N.roof }]);
  for (let k = 1; k <= N.steps; k++) {    // the wall stands in at each overlap: fill back the stepped edges
    for (const sg of [-1, 1]) {
      const za = c + sg * N.base / 2, zb = c + sg * wk(k) / 2;
      B.quad("qc", V(x1, y0 + H[k], Math.min(za, zb)), V(x1, y0 + H[k], Math.max(za, zb)), V(x1, y0 + H[k + 1], Math.max(za, zb)), V(x1, y0 + H[k + 1], Math.min(za, zb)));
    }
  }
  // gable ends (east and west walls rise to the ridge at the middle), and the two roof slopes
  for (const x of [x0, x1]) B.tri("qc", V(x, y0 + hw, z0), V(x, y0 + hw, z1), V(x, y0 + hr, 0));
  B.quad("qc", V(x0, y0 + hw, z0), V(x1, y0 + hw, z0), V(x1, y0 + hr, 0), V(x0, y0 + hr, 0));
  B.quad("qc", V(x1, y0 + hw, z1), V(x0, y0 + hw, z1), V(x0, y0 + hr, 0), V(x1, y0 + hr, 0));
  // the niche: its stepped back, sides and ceilings
  const xb = x1 + N.depth;
  F.quad("rf", V(x1, y0, c + N.base / 2), V(xb, y0, c + N.base / 2), V(xb, y0, c - N.base / 2), V(x1, y0, c - N.base / 2));
  for (let k = 0; k <= N.steps; k++) {
    const w = wk(k), ya = y0 + H[k], yb = y0 + H[k + 1];
    B.quad("qc", V(xb, ya, c - w / 2), V(xb, ya, c + w / 2), V(xb, yb, c + w / 2), V(xb, yb, c - w / 2));
    for (const sg of [-1, 1]) B.quad("qc", V(x1, ya, c + sg * w / 2), V(xb, ya, c + sg * w / 2), V(xb, yb, c + sg * w / 2), V(x1, yb, c + sg * w / 2));
    if (k < N.steps) for (const sg of [-1, 1]) B.quad("qc", V(x1, yb, c + sg * w / 2), V(xb, yb, c + sg * w / 2), V(xb, yb, c + sg * wk(k + 1) / 2), V(x1, yb, c + sg * wk(k + 1) / 2));
  }
  B.quad("qc", V(x1, y0 + N.roof, c - N.top / 2), V(xb, y0 + N.roof, c - N.top / 2), V(xb, y0 + N.roof, c + N.top / 2), V(x1, y0 + N.roof, c + N.top / 2));
  // the treasure hunters' hole at the back of the niche, and the dark mouths of the two shafts
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.82), new THREE.MeshBasicMaterial({ color: "#060403" }));
  hole.position.set(xb - 0.006, y0 + 0.45, c); hole.rotation.y = -Math.PI / 2; ctx.group.add(hole);
  for (const [z, dir] of [[z0, -1], [z1, 1]]) {
    const tube = new THREE.Mesh(new THREE.BoxGeometry(sh, sh, 0.8), new THREE.MeshBasicMaterial({ color: "#050302", side: THREE.BackSide }));
    tube.position.set(sx, y0 + shY + sh / 2, z + dir * 0.4); ctx.group.add(tube);
  }
  lamp(ctx, x0 + 0.05, y0 + 2.6, 0, 0.8, 1, 0);
  lamp(ctx, -1.0, y0 + 2.6, z1 - 0.05, 0.7, 0, -1);

  finish(ctx, F, { pf: M.floor, rf: M.rough }, ["pf", "rf"]);
  finish(ctx, B, { lime: M.lime, qc: M.qc }, []);
  markers(ctx, site, "s5");
}
