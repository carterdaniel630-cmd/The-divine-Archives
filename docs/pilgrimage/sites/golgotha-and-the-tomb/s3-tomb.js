/* III · The tomb: the low doorway and one chamber, after the common form of Jerusalem tombs of the time
   (Kloner and Zissu 2007): a standing pit cut into the floor, a bench along the north wall (as the surviving
   bench under the Edicule), and kokhim only begun, as in a new tomb. The bench is empty. Sizes CJ (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V, room } from "../../kit.js?v=1";
import { markers, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const tx = D.tomb.x, tz = D.tomb.z, dr = D.door, C = D.ch, pit = D.pit, bh = D.bench.h, bd = D.bench.d, K = D.kokh;
  const rockM = ctx.mat("block", { color: new THREE.Color("#efe6d2") });
  const floorM = ctx.mat("block", { color: new THREE.Color("#ddd0b4") });
  const B = new Bucket(), Fl = new Bucket();
  // the doorway: a short low passage through the rock
  const dx0 = tx - dr.t, dz0 = tz - dr.w / 2, dz1 = tz + dr.w / 2;
  Fl.quad("f", V(dx0, 0, dz1), V(tx, 0, dz1), V(tx, 0, dz0), V(dx0, 0, dz0));
  B.quad("w", V(dx0, dr.h, dz0), V(tx, dr.h, dz0), V(tx, dr.h, dz1), V(dx0, dr.h, dz1));
  B.quad("w", V(dx0, 0, dz0), V(tx, 0, dz0), V(tx, dr.h, dz0), V(dx0, dr.h, dz0));
  B.quad("w", V(tx, 0, dz1), V(dx0, 0, dz1), V(dx0, dr.h, dz1), V(tx, dr.h, dz1));
  // the chamber, its floor the standing pit; the doorway opens in its east wall a step above the pit
  const x0 = dx0 - C.w, x1 = dx0, z0 = tz - C.d / 2, z1 = tz + C.d / 2, y0 = -pit;
  const holes = { e: [{ u0: (dz0 - z0), u1: (dz1 - z0), v0: pit, v1: pit + dr.h }],
    w: [{ u0: z1 - (tz + 0.95), u1: z1 - (tz + 0.95) + K.w, v0: pit + bh, v1: pit + bh + K.h }, { u0: z1 - (tz - 0.05), u1: z1 - (tz - 0.05) + K.w, v0: pit + bh, v1: pit + bh + K.h }],
    s: [{ u0: x1 - (x0 + 1.2), u1: x1 - (x0 + 1.2) + K.w, v0: pit + bh, v1: pit + bh + K.h }] };
  room(B, { floor: "f", wall: "w", ceil: "w" }, x0, x1, z0, z1, y0, C.h, holes);
  // the bench along the north wall: its top and its face
  B.quad("w", V(x0, y0 + bh, z0 + bd), V(x1, y0 + bh, z0 + bd), V(x1, y0 + bh, z0), V(x0, y0 + bh, z0));
  B.quad("w", V(x0, y0, z0 + bd), V(x1, y0, z0 + bd), V(x1, y0 + bh, z0 + bd), V(x0, y0 + bh, z0 + bd));
  // the kokhim: one cut to full depth in the west wall, one only begun beside it, one begun in the south wall
  const niche = (nx0, nx1, nz0, nz1, ny, open) => room(B, { floor: "w", wall: "w", ceil: "w" }, nx0, nx1, nz0, nz1, ny, K.h, open);
  const ky = y0 + pit + bh;
  niche(x0 - K.d, x0, tz + 0.95 - K.w, tz + 0.95, ky, { e: [{ u0: 0, u1: K.w, v0: 0, v1: K.h }] });
  niche(x0 - 0.35, x0, tz - 0.05 - K.w, tz - 0.05, ky, { e: [{ u0: 0, u1: K.w, v0: 0, v1: K.h }] });
  niche(x0 + 1.2 - K.w, x0 + 1.2, z1, z1 + 0.4, ky, { n: [{ u0: 0, u1: K.w, v0: 0, v1: K.h }] });
  finish(ctx, Fl, { f: floorM }, ["f"]);
  finish(ctx, B, { f: floorM, w: rockM }, ["f"]);
  // daylight from the doorway: a faint glow, no lamp fitting (there is none in a tomb)
  ctx.light(dx0 - 0.6, 0.9, tz, 0.22);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(dr.w, dr.h), new THREE.MeshBasicMaterial({ color: "#f6ead0" }));
  glow.position.set(tx + 0.02, dr.h / 2, tz); glow.rotation.y = -Math.PI / 2; ctx.group.add(glow);
  void site;
  markers(ctx, site, "s3");
}
