/* IV · El Caracol: the path south through the trees and the round tower on its two platforms, the upper part of
   the tower broken away on one side, with narrow openings in what remains. Every size APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, stairs, blocksMat, UP } from "./maya.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const CR = D.car, PT = D.path, CG = D.carG, PI = Math.PI;

export function build(ctx) {
  const sand = ctx.mat("rock", { color: new THREE.Color("#c4b591") });
  const grass = ctx.mat("turf", { color: new THREE.Color("#93a06a") });
  const stone = blocksMat("#c7bea7", 31), stoneD = blocksMat("#aea48c", 37);
  const dark = new THREE.MeshBasicMaterial({ color: "#211a12", side: THREE.DoubleSide });
  const F = new Bucket(), B = new Bucket();

  oquad(F, "p", V(PT.x0, 0.01, PT.z0), V(PT.x1, 0.01, PT.z0), V(PT.x1, 0.01, PT.z1), V(PT.x0, 0.01, PT.z1), UP);
  oquad(F, "g", V(CG.x0, 0.01, CG.z0), V(CG.x1, 0.01, CG.z0), V(CG.x1, 0.01, CG.z1), V(CG.x0, 0.01, CG.z1), UP);
  // the lower platform, with a broad stair up its north side
  const L = CR.low, U = CR.up, T = CR.tower;
  box(B, "s", CR.x - L.w / 2, CR.x + L.w / 2, 0, L.h, CR.z - L.d / 2, CR.z + L.d / 2);
  box(B, "t", CR.x - L.w / 2 - 0.2, CR.x + L.w / 2 + 0.2, L.h - 0.4, L.h, CR.z - L.d / 2 - 0.2, CR.z + L.d / 2 + 0.2);
  stairs(B, "t", CR.x, CR.z - L.d / 2 - 7, 0, 1, 18, 0, L.h, 7, 24);
  // the upper platform, and its stair on the west
  const ux = CR.x + 2, uz = CR.z + 4;
  box(B, "s", ux - U.w / 2, ux + U.w / 2, L.h, L.h + U.h, uz - U.d / 2, uz + U.d / 2);
  box(B, "t", ux - U.w / 2 - 0.2, ux + U.w / 2 + 0.2, L.h + U.h - 0.3, L.h + U.h, uz - U.d / 2 - 0.2, uz + U.d / 2 + 0.2);
  stairs(B, "t", ux - U.w / 2 - 5, uz, 1, 0, 7, L.h, L.h + U.h, 5, 18);
  // the tower: a round drum with a cornice, and the smaller upper drum, partly fallen, with narrow openings
  const y0 = L.h + U.h, dr = new THREE.CylinderGeometry(T.r, T.r * 1.03, 7.0, 32); dr.translate(ux, y0 + 3.5, uz); B.geo("s", dr);
  const cn = new THREE.CylinderGeometry(T.r + 0.35, T.r + 0.35, 0.6, 32); cn.translate(ux, y0 + 7.3, uz); B.geo("t", cn);
  for (const a of [PI * 0.1, PI * 0.6, PI * 1.1, PI * 1.6]) { const x = ux + Math.cos(a) * (T.r + 0.03), z = uz + Math.sin(a) * (T.r + 0.03), nx = Math.cos(a), nz = Math.sin(a);
    oquad(B, "d", V(x - nz * 0.75, y0, z + nx * 0.75), V(x + nz * 0.75, y0, z - nx * 0.75), V(x + nz * 0.75, y0 + 2.6, z - nx * 0.75), V(x - nz * 0.75, y0 + 2.6, z + nx * 0.75), V(nx, 0, nz)); }
  const up = new THREE.CylinderGeometry(T.r * 0.62, T.r * 0.64, T.h - 7.6, 24, 1, false, PI * 0.15, PI * 1.35); up.translate(ux, y0 + 7.6 + (T.h - 7.6) / 2, uz); B.geo("s", up);
  const inner = new THREE.CylinderGeometry(T.r * 0.5, T.r * 0.5, T.h - 7.6, 16, 1, true); inner.translate(ux, y0 + 7.6 + (T.h - 7.6) / 2, uz); B.geo("t", inner);
  for (const a of [PI * 0.5, PI * 0.9, PI * 1.3]) {                         // the three openings that survive
    const x = ux + Math.sin(a) * (T.r * 0.63 + 0.02), z = uz + Math.cos(a) * (T.r * 0.63 + 0.02), nx = Math.sin(a), nz = Math.cos(a);
    oquad(B, "d", V(x - nz * 0.18, y0 + 9.0, z + nx * 0.18), V(x + nz * 0.18, y0 + 9.0, z - nx * 0.18), V(x + nz * 0.18, y0 + 10.4, z - nx * 0.18), V(x - nz * 0.18, y0 + 10.4, z + nx * 0.18), V(nx, 0, nz));
  }

  finish(ctx, F, { p: sand, g: grass }, ["p", "g"]);
  finish(ctx, B, { s: stone, t: stoneD, d: dark }, []);
  sign(ctx, ["El Caracol"], CR.x + 9, 2.4, CG.z0 + 12, PI, 1.8, 0.42, { size: 60 });
  sign(ctx, ["To El Caracol", "the path south"], PT.x1 + 1.4, 2.2, PT.z0 + 4, PI, 2.0, 0.5, { size: 56 });
  markers(ctx, site, "s4");
}
