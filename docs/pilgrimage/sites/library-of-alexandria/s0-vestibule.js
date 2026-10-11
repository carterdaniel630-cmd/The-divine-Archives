/* The Pilgrim's Vestibule: the archive's own room before the site (not part of the reconstruction). */
import * as THREE from "three";
import site, { V0 } from "./site.js?v=1";
import { buildRelic } from "../../../museum/relics.js?v=2";
import { Bucket, room } from "../../kit.js?v=1";
import { markers, sign, glassCase, goldMat, lamp, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const x0 = V0.x - 4, x1 = V0.x + 4, z0 = V0.z - 5, z1 = V0.z + 5, H = 4.8;
  const panel = new THREE.MeshStandardMaterial({ color: "#2a1d12", roughness: 0.7 });
  const ceil = new THREE.MeshStandardMaterial({ color: "#140d07", roughness: 0.9 });
  const floor = ctx.mat("wood", { color: new THREE.Color("#7a5a3c") });
  const B = new Bucket();
  room(B, { floor: "F", wall: "W", ceil: "C" }, x0, x1, z0, z1, 0, H);
  finish(ctx, B, { F: floor, W: panel, C: ceil }, ["F"]);
  const strip = (len, x, y, z, rotY) => { const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, 0.03), goldMat); m.position.set(x, y, z); m.rotation.y = rotY; ctx.group.add(m); };
  for (const y of [0.95, H - 0.4]) { strip(8, V0.x, y, z0 + 0.02, 0); strip(8, V0.x, y, z1 - 0.02, 0); strip(10, x0 + 0.02, y, V0.z, Math.PI / 2); strip(10, x1 - 0.02, y, V0.z, Math.PI / 2); }
  ctx.portal({ w: 1.4, h: 2.3, tint: "#ffe8c0" }, V0.x, 0, z0 + 0.2, 0);
  sign(ctx, ["To the Museum of Alexandria", "a reconstruction"], V0.x, 3.9, z0 + 0.03, 0, 2.6, 0.62);
  ctx.portal({ w: 1.4, h: 2.3, tint: "#fff0d8" }, V0.x, 0, z1 - 0.2, Math.PI);
  sign(ctx, ["Back to the Museum", "Classical Greece"], V0.x, 3.9, z1 - 0.03, Math.PI, 2.6, 0.62);
  sign(ctx, ["RECONSTRUCTION", "the plan is lost · this is conjecture"], x1 - 0.03, 2.4, V0.z - 1.5, -Math.PI / 2, 2.6, 0.66, { size: 66 });
  sign(ctx, ["What is attested", "a walk · an exedra · a large house (Strabo)"], x1 - 0.03, 1.6, V0.z - 1.5, -Math.PI / 2, 2.6, 0.48, { size: 50 });
  sign(ctx, ["Preview", "built for review · not yet on the menu"], x1 - 0.03, 3.3, V0.z + 2.4, -Math.PI / 2, 2.0, 0.48, { size: 54 });
  const rel = buildRelic("v53", null, 2, [0.5, 0.6, 0.3]);
  glassCase(ctx, V0.x - 2.6, V0.z - 1.0, rel ? rel.root : null, ctx.infoById("v-v53"));
  sign(ctx, ["For comparison", "a Vault object · not from the Library"], x0 + 0.03, 2.5, V0.z - 1.0, Math.PI / 2, 2.2, 0.52, { size: 54 });
  lamp(ctx, V0.x, H - 0.2, V0.z - 2, 0.9); lamp(ctx, V0.x, H - 0.2, V0.z + 2, 0.9); lamp(ctx, V0.x - 2.6, 2.6, V0.z - 1.0, 0.6);
  markers(ctx, site, "v");
}
