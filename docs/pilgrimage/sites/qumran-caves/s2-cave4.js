/* II · Cave 4: two chambers hollowed by hand out of the marl, joined by a low way through, with rows of
   holes in the walls of the first. Sizes APPROX (dims.js). */
import * as THREE from "three";
import site, { C4 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { cave, rubble } from "../../cave.js?v=1";
import { markers, glassCase, finish } from "../../parts.js?v=1";
import { enochFragments } from "./relics.js?v=1";

export function build(ctx) {
  const marl = ctx.mat("rock", { color: new THREE.Color("#e8dcc2") });
  const floorM = ctx.mat("rock", { color: new THREE.Color("#cdbd9c") });
  const B = new Bucket(), F = new Bucket();
  const PI = Math.PI;
  // 4a: the mouth to the north, the way through to the east
  const a = cave(B, { floor: "f", wall: "w" }, { cx: C4.x, cz: C4.z, y: 0, rx: D.c4a.rx, rz: D.c4a.rz, h: D.c4a.h, seed: 41, rough: 0.18,
    gaps: [{ a0: -0.33, a1: 0.33, h: 1.7 }, { a0: PI / 2 - 0.2, a1: PI / 2 + 0.28, h: 1.6 }] });
  const bx = C4.x + D.c4bOff;
  cave(B, { floor: "f", wall: "w" }, { cx: bx, cz: C4.z + 0.3, y: 0, rx: D.c4b.rx, rz: D.c4b.rz, h: D.c4b.h, seed: 42, rough: 0.2,
    gaps: [{ a0: 1.5 * PI - 0.3, a1: 1.5 * PI + 0.25, h: 1.6 }] });
  // the way through between the chambers: a short low tunnel
  const tx0 = C4.x + D.c4a.rx - 0.4, tx1 = bx - D.c4b.rx + 0.4, tz0 = C4.z - 0.25, tz1 = C4.z + 0.95, th = 1.55;
  const T = (x, y, z) => new THREE.Vector3(x, y, z);
  F.quad("f", T(tx0, 0, tz1), T(tx1, 0, tz1), T(tx1, 0, tz0), T(tx0, 0, tz0));
  B.quad("w", T(tx0, th, tz0), T(tx1, th, tz0), T(tx1, th, tz1), T(tx0, th, tz1));
  B.quad("w", T(tx0, 0, tz0), T(tx1, 0, tz0), T(tx1, th, tz0), T(tx0, th, tz0));
  B.quad("w", T(tx1, 0, tz1), T(tx0, 0, tz1), T(tx0, th, tz1), T(tx1, th, tz1));
  // the mouth: a short passage out to the north, open to the light at its end
  const mz0 = C4.z - D.c4a.rz - 1.9, mz1 = C4.z - D.c4a.rz + 0.3, mh = 1.7;
  F.quad("f", T(C4.x - 0.75, 0, mz1), T(C4.x + 0.75, 0, mz1), T(C4.x + 0.75, 0, mz0), T(C4.x - 0.75, 0, mz0));
  B.quad("w", T(C4.x - 0.75, mh, mz0), T(C4.x + 0.75, mh, mz0), T(C4.x + 0.75, mh, mz1), T(C4.x - 0.75, mh, mz1));
  B.quad("w", T(C4.x - 0.75, 0, mz1), T(C4.x - 0.75, 0, mz0), T(C4.x - 0.75, mh, mz0), T(C4.x - 0.75, mh, mz1));
  B.quad("w", T(C4.x + 0.75, 0, mz0), T(C4.x + 0.75, 0, mz1), T(C4.x + 0.75, mh, mz1), T(C4.x + 0.75, mh, mz0));
  const day = new THREE.Mesh(new THREE.PlaneGeometry(1.5, mh), new THREE.MeshBasicMaterial({ color: "#f2e3c4" }));
  day.position.set(C4.x, mh / 2, mz0 - 0.02); ctx.group.add(day);
  ctx.portal({ w: 1.0, h: 1.4, tint: "#fff0d0" }, C4.x, 0, mz0 + 0.25, 0);
  rubble(B, "f", C4.x - 2.2, C4.z + 1.2, 0, 0.6, 7, 43);
  finish(ctx, B, { w: marl, f: floorM }, ["f"]);
  finish(ctx, F, { f: floorM }, ["f"]);
  // the rows of holes along the south and west walls of 4a (their number and spacing are approximate)
  const hole = new THREE.CircleGeometry(0.045, 8), holeM = new THREE.MeshBasicMaterial({ color: "#1a120b" });
  const n = 26, inst = new THREE.InstancedMesh(hole, holeM, n * 2), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s1 = new THREE.Vector3(1, 1, 1);
  let k = 0;
  for (const hf of [0.34, 0.56]) {
    for (let i = 0; i < n; i++) {
      const b = PI * 0.62 + (i / (n - 1)) * PI * 0.95, p = a.point(b, hf);
      const toC = new THREE.Vector3(C4.x - p.x, 0, C4.z - p.z).normalize();
      p.addScaledVector(toC, 0.06);
      q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), toC);
      m4.compose(p, q, s1); inst.setMatrixAt(k++, m4);
    }
  }
  ctx.group.add(inst);
  // the case: Aramaic fragments of Enoch
  glassCase(ctx, C4.x + 1.6, C4.z + 1.2, enochFragments().root, ctx.infoById("c4-enoch"));
  // daylight from the mouth and a little spill inside (no fittings: the caves are unlit)
  ctx.light(C4.x, 1.4, mz0 + 0.6, 0.9); ctx.light(C4.x - 0.5, 1.8, C4.z, 0.45); ctx.light(bx, 1.6, C4.z + 0.3, 0.35);
  markers(ctx, site, "s2");
}
