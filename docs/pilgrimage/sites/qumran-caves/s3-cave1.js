/* III · Cave 1: a small natural cave in the limestone cliff, entered by a low crawl. Sizes APPROX. */
import * as THREE from "three";
import site, { C1 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { buildRelic } from "../../../museum/relics.js?v=2";
import { Bucket } from "../../kit.js?v=1";
import { cave, rubble } from "../../cave.js?v=1";
import { markers, glassCase, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const lime = ctx.mat("rock", { color: new THREE.Color("#c8b495") });
  const floorM = ctx.mat("rock", { color: new THREE.Color("#a9967a") });
  const B = new Bucket(), F = new Bucket();
  cave(B, { floor: "f", wall: "w" }, { cx: C1.x, cz: C1.z, y: 0, rx: D.c1r.rx, rz: D.c1r.rz, h: D.c1r.h, seed: 11, rough: 0.5, gaps: [{ a0: -0.3, a1: 0.3, h: 1.5 }] });
  // the crawl: a low, rough passage running north to the light
  const T = (x, y, z) => new THREE.Vector3(x, y, z), w = 0.5, h = 0.95;
  const z1 = C1.z - D.c1r.rz + 0.3, z0 = C1.z - D.c1r.rz - D.crawl;
  F.quad("f", T(C1.x - w, 0, z1), T(C1.x + w, 0, z1), T(C1.x + w, 0, z0), T(C1.x - w, 0, z0));
  B.quad("w", T(C1.x - w, h, z0), T(C1.x + w, h, z0), T(C1.x + w, h, z1), T(C1.x - w, h, z1));
  B.quad("w", T(C1.x - w, 0, z1), T(C1.x - w, 0, z0), T(C1.x - w, h, z0), T(C1.x - w, h, z1));
  B.quad("w", T(C1.x + w, 0, z0), T(C1.x + w, 0, z1), T(C1.x + w, h, z1), T(C1.x + w, h, z0));
  // a rough header over the crawl where it meets the chamber, closing the wall above the low roof
  B.quad("w", T(C1.x - 0.75, h, z1 - 0.05), T(C1.x + 0.75, h, z1 - 0.05), T(C1.x + 0.75, 1.55, z1 - 0.05), T(C1.x - 0.75, 1.55, z1 - 0.05));
  B.quad("w", T(C1.x - 0.75, 0, z1 - 0.05), T(C1.x - w, 0, z1 - 0.05), T(C1.x - w, 1.55, z1 - 0.05), T(C1.x - 0.75, 1.55, z1 - 0.05));
  B.quad("w", T(C1.x + w, 0, z1 - 0.05), T(C1.x + 0.75, 0, z1 - 0.05), T(C1.x + 0.75, 1.55, z1 - 0.05), T(C1.x + w, 1.55, z1 - 0.05));
  const day = new THREE.Mesh(new THREE.PlaneGeometry(2 * w, h), new THREE.MeshBasicMaterial({ color: "#f4e6c8" }));
  day.position.set(C1.x, h / 2, z0 - 0.02); ctx.group.add(day);
  ctx.portal({ w: 0.8, h: 0.7, tint: "#fff0d0" }, C1.x, 0, z0 + 0.25, 0);
  rubble(B, "f", C1.x + 1.6, C1.z - 1.0, 0, 0.5, 6, 12);
  finish(ctx, B, { w: lime, f: floorM }, ["f"]);
  finish(ctx, F, { f: floorM }, ["f"]);
  const jar = buildRelic("v02", null, 2, [0.6, 0.55, 0.6]);
  glassCase(ctx, C1.x - 1.1, C1.z + 0.8, jar ? jar.root : null, ctx.infoById("c1-jar"));
  const isa = buildRelic("v48", null, 2, [0.7, 0.4, 0.5]);
  glassCase(ctx, C1.x + 1.2, C1.z + 0.8, isa ? isa.root : null, ctx.infoById("c1-isaiah"));
  ctx.light(C1.x, 0.8, z0 + 0.5, 0.7); ctx.light(C1.x, 1.6, C1.z, 0.45);
  markers(ctx, site, "s3");
}
