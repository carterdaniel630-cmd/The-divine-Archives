/* II · The Durupınar formation: a boat-shaped, raised rim of folded rock about 160 m long in a hollow of the
   hillside (true size; width and height APPROX), the massif as a scale model to the north, and an outline of
   the size Genesis gives the ark, shown only on request. */
import * as THREE from "three";
import site, { P2 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V, outlineBox } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { massif } from "./massif.js?v=1";

export function build(ctx) {
  const ground = ctx.mat("turf", { color: new THREE.Color("#cfc497") });
  const mud = ctx.mat("rock", { color: new THREE.Color("#b49a7c") });
  const G = new Bucket(), F = new Bucket();
  const r = 260;
  G.quad("g", V(P2.x - r, 0, P2.z + 50), V(P2.x + r, 0, P2.z + 50), V(P2.x + r, 0, P2.z - r), V(P2.x - r, 0, P2.z - r));
  G.quad("g", V(P2.x - r, 14, P2.z + 95), V(P2.x + r, 14, P2.z + 95), V(P2.x + r, 0, P2.z + 50), V(P2.x - r, 0, P2.z + 50));
  G.quad("g", V(P2.x - r, 30, P2.z + r), V(P2.x + r, 30, P2.z + r), V(P2.x + r, 14, P2.z + 95), V(P2.x - r, 14, P2.z + 95));
  finish(ctx, G, { g: ground }, ["g"]);
  massif(ctx, D.durup, { x: P2.x, y: 0, z: P2.z }, { drop: 1.2 });
  // the formation: a pointed-oval rim of tilted layers, higher at the sides, with a lower, lumpy middle
  const L = D.form.l / 2, W = D.form.w / 2, H = D.form.h, n = 64;
  const outline = (s) => { const t = s * Math.PI * 2; const x = Math.cos(t) * L; const z = Math.sin(t) * W * Math.pow(1 - Math.pow(Math.abs(Math.cos(t)), 6), 0.5); return [x, z]; };
  for (let i = 0; i < n; i++) {
    const [ax, az] = outline(i / n), [bx, bz] = outline((i + 1) / n);
    const k = 0.78, h0 = H * (0.75 + 0.25 * Math.sin(i * 1.3)), h1 = H * (0.75 + 0.25 * Math.sin((i + 1) * 1.3));
    // outer slope, crest, inner slope
    F.quad("m", V(P2.x + ax * 1.08, 0, P2.z + az * 1.18), V(P2.x + bx * 1.08, 0, P2.z + bz * 1.18), V(P2.x + bx, h1, P2.z + bz), V(P2.x + ax, h0, P2.z + az));
    F.quad("m", V(P2.x + ax, h0, P2.z + az), V(P2.x + bx, h1, P2.z + bz), V(P2.x + bx * k, H * 0.35, P2.z + bz * k), V(P2.x + ax * k, H * 0.35, P2.z + az * k));
    F.tri("m", V(P2.x + ax * k, H * 0.35, P2.z + az * k), V(P2.x + bx * k, H * 0.35, P2.z + bz * k), V(P2.x, H * 0.45, P2.z));
  }
  finish(ctx, F, { m: mud }, []);
  // the outline of Genesis's figures (300 × 50 × 30 cubits at 0.5 m), beside the formation for comparison; off until asked
  const c = D.cubit, ol = outlineBox(P2.x, D.arkG.h * c / 2, P2.z - W - 32, D.arkG.l * c, D.arkG.h * c, D.arkG.w * c, 0, "#ffd88a");
  ctx.outline("genesis-ark", ol);
  sign(ctx, ["The Durupınar formation", "claimed as the Ark · explained by geologists as a natural fold"], P2.x + 6, 11.6, P2.z + 74, 0, 4.0, 0.6, { size: 46 });
  ctx.portal({ w: 1.6, h: 2.4, tint: "#ffe2b0" }, P2.x, 14, P2.z + 96, Math.PI);
  sign(ctx, ["Back to the plain", "below Ararat"], P2.x, 17.0, P2.z + 96.1, Math.PI, 2.0, 0.48, { size: 54 });
  markers(ctx, site, "s2");
}
