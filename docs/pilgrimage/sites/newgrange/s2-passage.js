/* II · The passage: just under 19 m from the door to the chamber, its floor climbing about 2 m, lined with
   upright slabs (22 on the west side, 21 on the east). Drawn straight and a little higher than the real one
   (dims.js); the roof is left open under the roof-box, which s1-mound.js builds with the doorway. */
import * as THREE from "three";
import site, { lamps } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, passage } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, lamp, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const P_ = D.pass, run = P_.z1 - P_.z0, hw = P_.w / 2;
  const M = { floor: ctx.mat("rock", { color: new THREE.Color("#6f6556") }), wall: ctx.mat("rock", { color: new THREE.Color("#4a463f") }), slab: ctx.mat("sarsen", { color: new THREE.Color("#8a877d") }) };
  const B = new Bucket(), F = new Bucket();
  const rbZ0 = D.face - 2.5;                               // where the roof-box opens over the passage (s1-mound.js)
  const pg = passage(F, { floor: "f", wall: "w", ceil: "w" }, 0, P_.z0, P_.rise, run, -P_.rise, P_.w, P_.h, { roof: [[0, run]], left: [[0, run]], right: [[0, run]] });
  passage(B, { floor: "w", wall: "w", ceil: "w" }, 0, P_.z0, P_.rise, run, -P_.rise, P_.w, P_.h, { floor: [[0, run]], roof: [[rbZ0 - P_.z0, run]] });
  // the upright slabs, side by side along each wall, their feet on the climbing floor
  const yF = pg.yF, roofAt = (z) => yF(z - P_.z0) + pg.hv;
  const side = (n, sx, seed) => {
    const len = run / n;
    for (let i = 0; i < n; i++) {
      const z = P_.z0 + (i + 0.5) * len, h = roofAt(z) - yF(z - P_.z0) - 0.02 - ((i * 7 + seed) % 5) * 0.06;
      stone(B, "s", { x: sx * (hw - 0.02), z, y: yF(z - P_.z0) - 0.04, w: len - 0.05, d: 0.24, h, yaw: sx > 0 ? -Math.PI / 2 : Math.PI / 2, taper: 0.06, rough: 0.04, seed: seed + i });
    }
  };
  side(P_.westN, -1, 500); side(P_.eastN, 1, 600);
  finish(ctx, F, { f: M.floor }, ["f"]);
  finish(ctx, B, { w: M.wall, s: M.slab }, []);
  // low lamps at the foot of the walls, as in the real passage's modern lighting
  for (const [z, sx] of [[34.5, 1], [28.5, -1], [23, 1]]) { const h = lamp(ctx, sx * (hw - 0.14), yF(z - P_.z0) + 0.35, z, 0.5, -sx, 0); if (h) lamps.push(h); }
  markers(ctx, site, "s2");
}
