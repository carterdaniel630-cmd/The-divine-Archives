/* IV · Cave 3: a low natural cave whose roof has partly fallen in; the Copper Scroll lay at the back.
   Sizes and the fallen rock APPROX. */
import * as THREE from "three";
import site, { C3 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { buildRelic } from "../../../museum/relics.js?v=2";
import { Bucket } from "../../kit.js?v=1";
import { cave, rubble } from "../../cave.js?v=1";
import { markers, glassCase, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const lime = ctx.mat("rock", { color: new THREE.Color("#c2ad8c") });
  const floorM = ctx.mat("rock", { color: new THREE.Color("#a28f72") });
  const B = new Bucket(), F = new Bucket();
  cave(B, { floor: "f", wall: "w" }, { cx: C3.x, cz: C3.z, y: 0, rx: D.c3r.rx, rz: D.c3r.rz, h: D.c3r.h, seed: 31, rough: 0.6, gaps: [{ a0: -0.33, a1: 0.33, h: 1.4 }] });
  const T = (x, y, z) => new THREE.Vector3(x, y, z), w = 0.65, h = 1.45;
  const z1 = C3.z - D.c3r.rz + 0.3, z0 = C3.z - D.c3r.rz - 1.5;
  F.quad("f", T(C3.x - w, 0, z1), T(C3.x + w, 0, z1), T(C3.x + w, 0, z0), T(C3.x - w, 0, z0));
  B.quad("w", T(C3.x - w, h, z0), T(C3.x + w, h, z0), T(C3.x + w, h, z1), T(C3.x - w, h, z1));
  B.quad("w", T(C3.x - w, 0, z1), T(C3.x - w, 0, z0), T(C3.x - w, h, z0), T(C3.x - w, h, z1));
  B.quad("w", T(C3.x + w, 0, z0), T(C3.x + w, 0, z1), T(C3.x + w, h, z1), T(C3.x + w, h, z0));
  const day = new THREE.Mesh(new THREE.PlaneGeometry(2 * w, h), new THREE.MeshBasicMaterial({ color: "#f4e6c8" }));
  day.position.set(C3.x, h / 2, z0 - 0.02); ctx.group.add(day);
  ctx.portal({ w: 1.0, h: 1.1, tint: "#fff0d0" }, C3.x, 0, z0 + 0.25, 0);
  // the fallen roof: heaps of broken rock along the east and south of the chamber
  rubble(B, "f", C3.x + 2.0, C3.z - 0.6, 0, 0.7, 14, 32);
  rubble(B, "f", C3.x - 0.4, C3.z + 1.7, 0, 1.2, 16, 33);
  rubble(B, "f", C3.x - 2.2, C3.z + 0.2, 0, 0.5, 8, 34);
  finish(ctx, B, { w: lime, f: floorM }, ["f"]);
  finish(ctx, F, { f: floorM }, ["f"]);
  const cs = buildRelic("v10", null, 2, [0.6, 0.4, 0.6]);
  glassCase(ctx, C3.x + 1.0, C3.z + 0.7, cs ? cs.root : null, ctx.infoById("c3-copper"));
  ctx.light(C3.x, 1.0, z0 + 0.5, 0.7); ctx.light(C3.x, 1.3, C3.z, 0.4);
  markers(ctx, site, "s4");
}
