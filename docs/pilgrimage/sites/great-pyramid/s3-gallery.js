/* III · The Grand Gallery: corbelled walls, ramps with their slots, the modern walkway and steps, and the Great Step. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, wall, V, outlineBox } from "../../kit.js?v=1";
import { markers, lamp, rail, finish } from "../../parts.js?v=1";

const IN6 = 0.0254;   // one inch, in metres
export function build(ctx) {
  const M = { gal: ctx.mat("gallery"), lime: ctx.mat("limestone"), floor: ctx.mat("floor"), wood: ctx.mat("wood") };
  const B = new Bucket(), F = new Bucket();
  const W2 = D.ggW / 2, C2 = D.ggCh / 2, os = D.overlapStep, cH = (D.ggH - D.ggWall0) / D.overlaps;
  const zA = D.ggZ0, zE = D.ggZ1, fl = D.ggFloor;
  const zF = zA + (D.ph + D.slab) / D.ascTan;            // where the gallery floor spans over the horizontal passage
  const stairZ0 = zA + 0.8, stairZ1 = zA + 3.4, walk = (z) => fl(z) + 0.08;
  const P = (x, z, h) => V(x, fl(z) + h, z);

  // ---- the corbelled walls: a vertical lower wall, then seven courses each standing in by about 3 in
  for (const sg of [-1, 1]) {
    const band = (x, h0, h1) => sg < 0
      ? B.quad("gal", P(x, zE, h0), P(x, zA, h0), P(x, zA, h1), P(x, zE, h1))
      : B.quad("gal", P(x, zA, h0), P(x, zE, h0), P(x, zE, h1), P(x, zA, h1));
    const ledge = (xo, xi, h) => sg < 0
      ? B.quad("gal", P(xo, zE, h), P(xi, zE, h), P(xi, zA, h), P(xo, zA, h))
      : B.quad("gal", P(xi, zE, h), P(xo, zE, h), P(xo, zA, h), P(xi, zA, h));
    let x = sg * W2;
    band(x, -0.6, D.ggWall0);                             // (runs a little below the floor line, behind the ramps)
    for (let k = 1; k <= D.overlaps; k++) {
      const xi = sg * (W2 - k * os), h = D.ggWall0 + (k - 1) * cH;
      ledge(x, xi, h); band(xi, h, h + cH); x = xi;
    }
  }
  // the groove: a shallow channel along each wall just above the third overlap, its lower edge midway between floor
  // and roof (Petrie), 6 in wide and 3/4 in deep, running the whole length (purpose unknown)
  const grooveMat = ctx.mat("gallery", { color: new THREE.Color("#6e5e4a") }), shade = new THREE.MeshBasicMaterial({ color: "#1c140c" });
  for (const sg of [-1, 1]) {
    const x = sg * (W2 - 3 * os) - sg * 0.004, h0 = D.ggH / 2, h1 = h0 + 6 * IN6;
    const geo = new THREE.BufferGeometry(), pts = [P(x, zA, h0), P(x, zE, h0), P(x, zE, h1), P(x, zA, h1)];
    geo.setFromPoints([pts[0], pts[1], pts[2], pts[0], pts[2], pts[3]]); geo.computeVertexNormals();
    geo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, D.ggRun / 2.4, 0, D.ggRun / 2.4, 0.06, 0, 0, D.ggRun / 2.4, 0.06, 0, 0.06], 2));
    const g = new THREE.Mesh(geo, grooveMat); grooveMat.side = THREE.DoubleSide; ctx.group.add(g);
    const lip = new THREE.BufferGeometry(); lip.setFromPoints([P(x - sg * 0.001, zA, h1 - 0.012), P(x - sg * 0.001, zE, h1 - 0.012), P(x - sg * 0.001, zE, h1), P(x - sg * 0.001, zA, h1 - 0.012), P(x - sg * 0.001, zE, h1), P(x - sg * 0.001, zA, h1)]);
    const lm = new THREE.Mesh(lip, shade); shade.side = THREE.DoubleSide; ctx.group.add(lm);
  }
  // the roof: slabs spanning the narrow top, at the gallery's slope
  const xr = W2 - D.overlaps * os;
  B.quad("gal", P(-xr, zA, D.ggH), P(xr, zA, D.ggH), P(xr, zE, D.ggH), P(-xr, zE, D.ggH));
  // the north end wall, with the mouth of the ascending passage
  wall(B, "gal", -W2, zA, W2, zA, D.ggY0, D.ggH + 0.2, [{ u0: W2 - D.pw / 2, u1: W2 + D.pw / 2, v0: 0, v1: D.ascHv }]);
  // the Great Step's face at the top (its platform belongs to the next section)
  B.quad("lime", V(W2, fl(zE), zE), V(-W2, fl(zE), zE), V(-W2, D.kcFloor, zE), V(W2, D.kcFloor, zE));

  // ---- the floor: a landing at the foot, the open well over the horizontal passage, then the channel between the ramps
  F.quad("pfloor", V(-W2, D.ggY0, zA + 0.9), V(W2, D.ggY0, zA + 0.9), V(W2, D.ggY0, zA), V(-W2, D.ggY0, zA));
  B.quad("lime", P(-C2, zE, 0), P(C2, zE, 0), P(C2, zF, 0), P(-C2, zF, 0));          // channel floor, under the walkway
  B.quad("lime", V(-C2, D.hpY + D.ph, zF), V(C2, D.hpY + D.ph, zF), V(C2, fl(zF), zF), V(-C2, fl(zF), zF));   // the slab's edge over the well
  for (const sg of [-1, 1]) {
    const z0 = sg < 0 ? stairZ1 : zA + 0.9;
    const xo = sg * W2, xi = sg * C2, h = D.rampH;
    // ramp top and inner face
    if (sg < 0) { B.quad("lime", P(xo, zE, h), P(xi, zE, h), P(xi, z0, h), P(xo, z0, h)); B.quad("lime", P(xi, zE, 0), P(xi, z0, 0), P(xi, z0, h), P(xi, zE, h)); }
    else { B.quad("lime", P(xi, zE, h), P(xo, zE, h), P(xo, z0, h), P(xi, z0, h)); B.quad("lime", P(xi, z0, 0), P(xi, zE, 0), P(xi, zE, h), P(xi, z0, h)); }
    // the well's side walls, from the horizontal passage's floor up to the ramp tops
    const wz0 = zA + 0.9, wz1 = zF;
    if (sg < 0) B.quad("lime", V(xi, D.hpY, wz1), V(xi, D.hpY, wz0), V(xi, fl(wz0) + h, wz0), V(xi, fl(wz1) + h, wz1));
    else B.quad("lime", V(xi, D.hpY, wz0), V(xi, D.hpY, wz1), V(xi, fl(wz1) + h, wz1), V(xi, fl(wz0) + h, wz0));
    // the ramp's end, facing north, at its lower end
    B.quad("lime", V(sg < 0 ? xo : xi, D.ggY0, z0), V(sg < 0 ? xi : xo, D.ggY0, z0), V(sg < 0 ? xi : xo, fl(z0) + h, z0), V(sg < 0 ? xo : xi, fl(z0) + h, z0));
  }
  // the slots cut along both ramps (count and size APPROX)
  const slotMat = new THREE.MeshBasicMaterial({ color: "#0d0906" }), n = 27, slots = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.012, 0.52), slotMat, n * 2), m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -D.ascAng);
  for (let i = 0; i < n; i++) for (const sg of [-1, 1]) {
    const z = stairZ1 + 1.0 + i * (zE - stairZ1 - 2.0) / (n - 1);
    m.compose(new THREE.Vector3(sg * (C2 + D.rampW * 0.5), fl(z) + D.rampH + 0.006, z), q, new THREE.Vector3(1, 1, 1)); slots.setMatrixAt(i * 2 + (sg > 0 ? 1 : 0), m);
  }
  ctx.group.add(slots);

  // ---- modern fittings: the steps at the foot, the landing over the well, the walkway and its rails
  const steps = 10, sTop = walk(stairZ1), sx0 = -W2, sx1 = -C2 + 0.05;
  for (let i = 0; i < steps; i++) {
    const z0 = stairZ0 + (stairZ1 - 0.6 - stairZ0) * i / steps, z1 = stairZ0 + (stairZ1 - 0.6 - stairZ0) * (i + 1) / steps, y = D.ggY0 + (sTop - D.ggY0) * (i + 1) / steps;
    F.quad("wood", V(sx0, y, z1), V(sx1, y, z1), V(sx1, y, z0), V(sx0, y, z0));
    B.quad("woodside", V(sx1, y - (sTop - D.ggY0) / steps, z0), V(sx0, y - (sTop - D.ggY0) / steps, z0), V(sx0, y, z0), V(sx1, y, z0));
  }
  F.quad("wood", V(-W2, sTop, stairZ1 + 0.4), V(C2, sTop, stairZ1 + 0.4), V(C2, sTop, stairZ1 - 0.6), V(-W2, sTop, stairZ1 - 0.6));
  F.quad("wood", P(-C2 + 0.03, zE - 1.2, 0.08), P(C2 - 0.03, zE - 1.2, 0.08), P(C2 - 0.03, stairZ1 - 0.3, 0.08), P(-C2 + 0.03, stairZ1 - 0.3, 0.08), "slopeFloor");
  // wooden steps up the Great Step
  for (let i = 0; i < 5; i++) {
    const z0 = zE - 1.2 + i * 0.24, y = walk(zE - 1.2) + (D.kcFloor - walk(zE - 1.2)) * (i + 1) / 5;
    F.quad("wood", V(-C2, y, z0 + 0.24), V(C2, y, z0 + 0.24), V(C2, y, z0), V(-C2, y, z0));
  }
  rail(ctx, -C2 - 0.06, stairZ1, zE - 1.4, (z) => fl(z) + D.rampH, 0.85);
  rail(ctx, C2 + 0.06, stairZ1, zE - 1.4, (z) => fl(z) + D.rampH, 0.85);
  for (let z = zA + 6; z < zE - 2; z += 8.5) { lamp(ctx, -W2 + 0.04, fl(z) + 1.6, z, 0.75, 1, 0); lamp(ctx, W2 - 0.04, fl(z + 4.2) + 1.6, z + 4.2, 0.75, -1, 0); }
  lamp(ctx, W2 - 0.04, D.ggY0 + 1.7, zA + 1.2, 0.7, -1, 0);

  const woodside = ctx.mat("wood", { color: new THREE.Color("#8a6a4a") });
  finish(ctx, F, { pfloor: M.floor, wood: M.wood }, ["pfloor", "wood"]);
  finish(ctx, B, { gal: M.gal, lime: M.lime, woodside }, []);

  // ---- the Big Void, known from muon scans (outline only; size, slope and position APPROX)
  const cz = zA + D.ggRun * 0.5, cy = fl(cz) + D.ggH + 9;
  ctx.outline("bigvoid", outlineBox(0, cy, cz, 2.0, 6.0, 30, -D.ascAng));
  markers(ctx, site, "s3");
}
