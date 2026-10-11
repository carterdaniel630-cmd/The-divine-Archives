/* The Pilgrim's Vestibule: the archive's own room before the site (not part of Qumran). */
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
  // the two ways out: north to the terrace, south back to the museum
  ctx.portal({ w: 1.4, h: 2.3, tint: "#ffe2b0" }, V0.x, 0, z0 + 0.2, 0);
  sign(ctx, ["To the Qumran caves", "the marl terrace, above the Dead Sea"], V0.x, 3.9, z0 + 0.03, 0, 2.6, 0.62);
  ctx.portal({ w: 1.4, h: 2.3, tint: "#fff0d8" }, V0.x, 0, z1 - 0.2, Math.PI);
  sign(ctx, ["Back to the Museum", "Second Temple Judaism"], V0.x, 3.9, z1 - 0.03, Math.PI, 2.6, 0.62);
  sign(ctx, ["The Qumran caves", "where the Dead Sea Scrolls were found"], x1 - 0.03, 2.3, V0.z - 1.5, -Math.PI / 2, 2.4, 0.6);
  sign(ctx, ["Before you go out", "sizes approximate · rock drawn in code"], x1 - 0.03, 1.6, V0.z - 1.5, -Math.PI / 2, 2.4, 0.45, { size: 52 });
  sign(ctx, ["Preview", "built for review · not yet on the menu"], x1 - 0.03, 3.2, V0.z + 2.4, -Math.PI / 2, 2.0, 0.48, { size: 54 });
  // the Vault object for comparison: the Book of Enoch in Ge'ez
  const rel = buildRelic("v49", null, 2, [0.5, 0.4, 0.5]);
  glassCase(ctx, V0.x - 2.6, V0.z - 1.0, rel ? rel.root : null, ctx.infoById("v-v49"));
  sign(ctx, ["For comparison", "a Vault object · not from Qumran"], x0 + 0.03, 2.5, V0.z - 1.0, Math.PI / 2, 2.2, 0.52, { size: 54 });
  lamp(ctx, V0.x, H - 0.2, V0.z - 2, 0.9); lamp(ctx, V0.x, H - 0.2, V0.z + 2, 0.9); lamp(ctx, V0.x - 2.6, 2.6, V0.z - 1.0, 0.6);
  markers(ctx, site, "v");
}
