/* III · The chamber: a cross in plan (a central space and three recesses), walls of upright slabs, the recesses
   roofed flat at the height of their lintels, the central space under a corbelled roof of stepped courses closing
   at a capstone about 6 m above the floor. A stone basin in each recess; the carved panels of the back, east and
   west recesses. Plan and sizes APPROX except the roof height (dims.js). */
import * as THREE from "three";
import site, { lamps } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { tripleTex, eastTex, westTex, panel } from "./art.js?v=1";
import { Bucket, V, wall } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, lamp, finish } from "../../parts.js?v=1";

function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export function build(ctx) {
  const C = D.ch, R = D.rec, y0 = C.y, H = D.recH, yT = y0 + H, hw = D.pass.w / 2;
  const M = { floor: ctx.mat("rock", { color: new THREE.Color("#6a6052") }), wall: ctx.mat("rock", { color: new THREE.Color("#4d4840") }), slab: ctx.mat("sarsen", { color: new THREE.Color("#8d8a80") }), corbel: ctx.mat("rock", { color: new THREE.Color("#706b60") }) };
  const B = new Bucket(), F = new Bucket(), S = new Bucket();
  const flo = (x0, x1, z0, z1) => F.quad("f", V(x0, y0, z1), V(x1, y0, z1), V(x1, y0, z0), V(x0, y0, z0));
  const ceil = (x0, x1, z0, z1, y) => B.quad("w", V(x0, y, z0), V(x1, y, z0), V(x1, y, z1), V(x0, y, z1));
  // ---- floors
  flo(-C.x, C.x, C.z0, C.z1); flo(R.east.x0, R.east.x1, R.east.z0, R.east.z1); flo(R.west.x0, R.west.x1, R.west.z0, R.west.z1); flo(R.back.x0, R.back.x1, R.back.z0, R.back.z1);
  // ---- the walls round the cross, walked so each faces inward
  const pts = [[-hw, C.z1], [-C.x, C.z1], [-C.x, R.west.z1], [R.west.x0, R.west.z1], [R.west.x0, R.west.z0], [-C.x, R.west.z0], [-C.x, C.z0],
    [R.back.x0, C.z0], [R.back.x0, R.back.z0], [R.back.x1, R.back.z0], [R.back.x1, C.z0], [C.x, C.z0], [C.x, R.east.z0], [R.east.x1, R.east.z0],
    [R.east.x1, R.east.z1], [C.x, R.east.z1], [C.x, C.z1], [hw, C.z1]];
  for (let i = 0; i < pts.length - 1; i++) wall(B, "w", pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], y0, H);
  // over the passage mouth, from the passage roof up to the lintels
  const pRoof = y0 + D.pass.h / Math.cos(Math.atan2(D.pass.rise, D.pass.z1 - D.pass.z0));
  wall(B, "w", hw, C.z1, -hw, C.z1, pRoof, yT - pRoof);
  // ---- the recesses' flat roofs
  for (const r of [R.east, R.west, R.back]) ceil(r.x0, r.x1, r.z0, r.z1, yT);
  // ---- the corbelled roof: courses stepping in from the walls' tops to a capstone
  const N = 12, cz = (C.z0 + C.z1) / 2, X0 = C.x, Z0 = (C.z1 - C.z0) / 2, xe = 0.45, ze = 0.5, rr = rng(77);
  let prev = null;
  for (let i = 0; i <= N; i++) {
    const t = i / N, j = i === 0 ? 0 : (rr() - 0.5) * 0.1;
    const rect = { x0: -(X0 + (xe - X0) * t) + j, x1: X0 + (xe - X0) * t + j, z0: cz - (Z0 + (ze - Z0) * t) - j, z1: cz + (Z0 + (ze - Z0) * t) - j, y: yT + (y0 + C.top - yT) * t };
    if (prev) {
      // the underside of this course, from the course below inward to this one
      const p = prev, q = rect, y = q.y;
      B.quad("c", V(p.x0, y, p.z0), V(p.x1, y, p.z0), V(q.x1, y, q.z0), V(q.x0, y, q.z0));
      B.quad("c", V(p.x1, y, p.z1), V(p.x0, y, p.z1), V(q.x0, y, q.z1), V(q.x1, y, q.z1));
      B.quad("c", V(p.x0, y, p.z1), V(p.x0, y, p.z0), V(q.x0, y, q.z0), V(q.x0, y, q.z1));
      B.quad("c", V(p.x1, y, p.z0), V(p.x1, y, p.z1), V(q.x1, y, q.z1), V(q.x1, y, q.z0));
    }
    if (i < N) {
      // this course's inner face, up to the next course's underside
      const h = (C.top - H) / N;
      wall(B, "c", rect.x0, rect.z0, rect.x1, rect.z0, rect.y, h); wall(B, "c", rect.x1, rect.z0, rect.x1, rect.z1, rect.y, h);
      wall(B, "c", rect.x1, rect.z1, rect.x0, rect.z1, rect.y, h); wall(B, "c", rect.x0, rect.z1, rect.x0, rect.z0, rect.y, h);
    } else ceil(rect.x0, rect.x1, rect.z0, rect.z1, rect.y);                         // the capstone
    prev = rect;
  }
  // ---- upright slabs lining the recesses and the central space (inset a little from the wall lines)
  const slab = (x, z, w, h, yaw, seed) => stone(S, "s", { x, z, y: y0 - 0.03, w, d: 0.26, h, yaw, taper: 0.05, rough: 0.05, seed });
  const E = Math.PI / 2;
  for (const [r, sx] of [[R.east, 1], [R.west, -1]]) {
    const xBack = sx > 0 ? r.x1 - 0.14 : r.x0 + 0.14, zc = (r.z0 + r.z1) / 2, xm = (r.x0 + r.x1) / 2;
    slab(xBack, zc, r.z1 - r.z0 - 0.1, H - 0.05, sx > 0 ? -E : E, sx > 0 ? 701 : 711);              // the backstone
    slab(xm, r.z0 + 0.14, r.x1 - r.x0 - 0.1, H - 0.1, Math.PI, sx > 0 ? 702 : 712);                // its two sides
    slab(xm, r.z1 - 0.14, r.x1 - r.x0 - 0.1, H - 0.12, 0, sx > 0 ? 703 : 713);
  }
  slab(0, R.back.z0 + 0.14, R.back.x1 - R.back.x0 - 0.1, H - 0.05, Math.PI, 721);
  for (const sx of [-1, 1]) slab(sx * (R.back.x1 - 0.14), (R.back.z0 + R.back.z1) / 2, R.back.z1 - R.back.z0 - 0.1, H - 0.1, sx > 0 ? -E : E, 722 + sx);
  for (const sx of [-1, 1]) for (const [za, zb, k] of [[R.east.z1, C.z1, 0], [C.z0, R.east.z0, 1]]) slab(sx * (C.x - 0.14), (za + zb) / 2, zb - za - 0.1, H + 0.15, sx > 0 ? -E : E, 730 + k * 2 + sx);
  // ---- the stone basins, one in each recess
  const basin = (x, z, w, d, seed) => {
    stone(S, "s", { x, z, y: y0, w, d, h: 0.32, taper: 0.04, rough: 0.04, seed });
    const g = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.72, d * 0.66), new THREE.MeshStandardMaterial({ color: "#3a352e", roughness: 1 }));
    g.rotation.x = -Math.PI / 2; g.position.set(x, y0 + 0.33, z); ctx.group.add(g);
  };
  basin((R.east.x0 + R.east.x1) / 2, (R.east.z0 + R.east.z1) / 2, 1.1, 0.95, 741);
  basin((R.west.x0 + R.west.x1) / 2, (R.west.z0 + R.west.z1) / 2, 1.0, 0.85, 742);
  basin(0, (R.back.z0 + R.back.z1) / 2 - 0.1, 0.85, 0.7, 743);
  finish(ctx, F, { f: M.floor }, ["f"]);
  finish(ctx, B, { w: M.wall, c: M.corbel }, []);
  finish(ctx, S, { s: M.slab }, []);
  // ---- the carved stones (our own renderings of the motifs)
  panel(ctx, tripleTex(), 0.5, 0.5, 0, y0 + 1.05, R.back.z0 + 0.36, Math.PI);
  panel(ctx, eastTex(), 1.2, 1.5, R.east.x1 - 0.36, y0 + 1.3, (R.east.z0 + R.east.z1) / 2, -Math.PI / 2);
  panel(ctx, westTex(), 1.2, 1.5, R.west.x0 + 0.36, y0 + 1.3, (R.west.z0 + R.west.z1) / 2, Math.PI / 2);
  // ---- low lamps
  for (const h of [lamp(ctx, C.x - 0.3, y0 + 0.35, C.z1 - 0.5, 0.55, -1, 0), lamp(ctx, -C.x + 0.3, y0 + 0.35, C.z0 + 0.6, 0.55, 1, 0),
    lamp(ctx, 0, yT + 1.4, cz, 0.6)]) if (h) lamps.push(h);
  markers(ctx, site, "s3");
}
