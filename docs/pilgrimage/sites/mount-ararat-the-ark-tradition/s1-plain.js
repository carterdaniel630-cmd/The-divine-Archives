/* I · The plain below Ararat: a stretch of steppe south of the mountain (true size), with the massif as a
   scale model behind it (massif.js), boulders, and the portals on to Durupınar and up to the summit. */
import * as THREE from "three";
import site, { P1 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { massif } from "./massif.js?v=1";

export function build(ctx) {
  const steppe = ctx.mat("turf", { color: new THREE.Color("#d7cfa2") });
  const rockM = ctx.mat("rock", { color: new THREE.Color("#8b7a6c") });
  const G = new Bucket(), R = new Bucket();
  const r = 60;
  G.quad("g", V(P1.x - r, 0, P1.z + r), V(P1.x + r, 0, P1.z + r), V(P1.x + r, 0, P1.z - r), V(P1.x - r, 0, P1.z - r));
  finish(ctx, G, { g: steppe }, ["g"]);
  massif(ctx, D.viewS, { x: P1.x, y: 0, z: P1.z });
  // volcanic boulders on the steppe
  for (const [i, [x, z, s]] of [[7, -10, 1.6], [-9, 7, 1.0], [11, 9, 0.8], [-13, -10, 1.2], [8, 13, 0.7], [-4, 12, 0.6]].entries())
    stone(R, "r", { x: P1.x + x, z: P1.z + z, w: 2.2 * s, d: 1.6 * s, h: 1.2 * s, yaw: i * 47, taper: 0.35, rough: 0.25 * s, seed: 500 + i });
  finish(ctx, R, { r: rockM }, []);
  // the ways on
  ctx.portal({ w: 1.6, h: 2.4, tint: "#ffe2b0" }, P1.x + 16.3, 0, P1.z + 3.4, -Math.PI / 2);
  sign(ctx, ["To the Durupınar formation", "about 30 km south of the summit"], P1.x + 16.4, 3.0, P1.z + 3.4, -Math.PI / 2, 2.4, 0.5, { size: 50 });
  ctx.portal({ w: 1.6, h: 2.4, tint: "#eaf2ff" }, P1.x, 0, P1.z - 16.3, 0);
  sign(ctx, ["To the summit", "Greater Ararat, 5,137 m"], P1.x, 3.0, P1.z - 16.4, 0, 2.2, 0.5, { size: 54 });
  ctx.portal({ w: 1.6, h: 2.4, tint: "#fff0d8" }, P1.x, 0, P1.z + 16.3, Math.PI);
  sign(ctx, ["The Vestibule", "and back to the museum"], P1.x, 3.0, P1.z + 16.4, Math.PI, 2.0, 0.48, { size: 54 });
  markers(ctx, site, "s1");
}
