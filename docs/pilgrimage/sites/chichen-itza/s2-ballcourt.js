/* II · The Great Ball Court: the playing alley between two long walls, the sloping benches at their foot with
   six carved panels, a stone ring high on each wall, the temples at the two ends and the temple on the east
   wall. Overall size and alley size published; walls, benches and temples APPROX (dims.js); carvings our own. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, panel, stairs, reliefTex, blocksMat, UP } from "./maya.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const BC = D.bc, PI = Math.PI;

export function build(ctx) {
  const stone = blocksMat("#c4bba4", 19), stoneD = blocksMat("#ada38b", 23);
  const floorM = ctx.mat("turf", { color: new THREE.Color("#9aa46e") });
  const ringM = ctx.mat("limestone", { color: new THREE.Color("#d2cab6") });
  const dark = new THREE.MeshBasicMaterial({ color: "#211a12" });
  const B = new Bucket(), F = new Bucket();
  const ax0 = BC.x - BC.alleyW / 2, ax1 = BC.x + BC.alleyW / 2, az0 = BC.z - BC.alleyL / 2, az1 = BC.z + BC.alleyL / 2;
  const ox0 = BC.x - BC.W / 2, ox1 = BC.x + BC.W / 2, oz0 = BC.z - BC.L / 2, oz1 = BC.z + BC.L / 2;

  // ---- the alley's floor (a little above the plaza, so the court reads as its own ground)
  oquad(F, "f", V(ax0, 0.01, oz0 + 14), V(ax1, 0.01, oz0 + 14), V(ax1, 0.01, oz1 - 14), V(ax0, 0.01, oz1 - 14), UP);
  // ---- the two long walls, each the face of a solid mass, with the bench at its foot
  box(B, "s", ox0, ax0, 0, BC.wallH, az0, az1);
  box(B, "s", ax1, ox1, 0, BC.wallH, az0, az1);
  box(B, "t", ax0, ax0 + BC.benchD, 0, BC.benchH, az0, az1);
  box(B, "t", ax1 - BC.benchD, ax1, 0, BC.benchH, az0, az1);
  box(B, "t", ox0 - 0.3, ax0 + 0.3, BC.wallH, BC.wallH + 0.5, az0 - 0.3, az1 + 0.3);
  box(B, "t", ax1 - 0.3, ox1 + 0.3, BC.wallH, BC.wallH + 0.5, az0 - 0.3, az1 + 0.3);
  // stairs up the outer side of each mass
  stairs(B, "t", ox0 - 9, BC.z + 20, 1, 0, 6, 0, BC.wallH, 9, 30);
  stairs(B, "t", ox1 + 9, BC.z - 20, -1, 0, 6, 0, BC.wallH, 9, 30);
  // the rings, high on each wall at the middle of the alley, set upright to face across it
  for (const [x, s] of [[ax0, 1], [ax1, -1]]) {
    const r = new THREE.TorusGeometry(0.85, 0.24, 10, 28); r.rotateY(PI / 2); r.translate(x + s * 0.25, BC.ringY, BC.z); B.geo("r", r);
    box(B, "r", Math.min(x, x + s * 0.2), Math.max(x, x + s * 0.2), BC.ringY - 0.2, BC.ringY + 0.2, BC.z - 1.25, BC.z + 1.25);
  }
  // the temple on the east wall, near its south end, facing the alley
  const tx0 = ax1 + 1, tx1 = ox1 - 2, tz0 = az1 - 22, tz1 = az1 - 6;
  box(B, "s", tx0, tx1, BC.wallH + 0.5, BC.wallH + 5.0, tz0, tz1);
  box(B, "t", tx0 - 0.3, tx1 + 0.3, BC.wallH + 5.0, BC.wallH + 5.6, tz0 - 0.3, tz1 + 0.3);
  oquad(B, "d", V(tx0 - 0.03, BC.wallH + 0.5, tz0 + 4), V(tx0 - 0.03, BC.wallH + 0.5, tz1 - 4), V(tx0 - 0.03, BC.wallH + 3.4, tz1 - 4), V(tx0 - 0.03, BC.wallH + 3.4, tz0 + 4), V(-1, 0, 0));
  // the temples at the two ends: a platform with a small temple, a stair towards the alley
  for (const [z0, z1, s] of [[oz0, oz0 + 14, 1], [oz1 - 14, oz1, -1]]) {
    const xa = ax0 - 3, xb = ax1 + 3, ph = 5.5;
    box(B, "s", xa, xb, 0, ph, z0, z1);
    box(B, "t", xa + 8, xb - 8, ph, ph + 4.2, z0 + 3, z1 - 3);
    const zf = s > 0 ? z1 : z0;
    oquad(B, "d", V(BC.x - 1.8, ph, zf - s * 3 + s * 0.03), V(BC.x + 1.8, ph, zf - s * 3 + s * 0.03), V(BC.x + 1.8, ph + 3, zf - s * 3 + s * 0.03), V(BC.x - 1.8, ph, zf - s * 3 + s * 0.03).setY(ph + 3), V(0, 0, s));
    stairs(B, "t", BC.x, zf + s * 6, 0, -s, 8, 0, ph, 6, 20);
  }

  finish(ctx, F, { f: floorM }, ["f"]);
  finish(ctx, B, { s: stone, t: stoneD, r: ringM, d: dark }, []);
  // the six carved panels on the bench fronts (our own rendering of the subject)
  const rt = reliefTex();
  for (const dz of [-35, 10, 38]) panel(ctx, rt, 4.6, 1.3, ax0 + BC.benchD + 0.03, BC.benchH / 2, BC.z + dz, PI / 2);
  for (const dz of [-38, -10, 35]) panel(ctx, rt, 4.6, 1.3, ax1 - BC.benchD - 0.03, BC.benchH / 2, BC.z + dz, -PI / 2);
  sign(ctx, ["The Great Ball Court", "166 × 68 m overall"], BC.x + 9.5, 2.4, az1 + 4, 0, 2.6, 0.62);
  markers(ctx, site, "s2");
}
