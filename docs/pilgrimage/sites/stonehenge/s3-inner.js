/* III · Inside the stones: the five trilithons (three complete, two partly fallen), the bluestone circle and
   horseshoe, and the Altar Stone under the broken Great Trilithon. Layout in layout.js; sizes in dims.js. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { trilithons, bluestones, bluestoneHorseshoe, fallenInner } from "./layout.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { stone, lintel } from "../../megalith.js?v=1";
import { markers, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const sars = ctx.mat("sarsen");
  const blue = ctx.mat("sarsen", { color: new THREE.Color("#d2dbe4") });       // the bluestones: darker, bluish-grey
  const altarM = ctx.mat("sarsen", { color: new THREE.Color("#e6e6c8") });     // the Altar Stone: a greenish sandstone
  const S = new Bucket(), Bl = new Bucket(), A = new Bucket();
  // the trilithons: both uprights and the lintel where complete; for 55–56 and 59–60 only one upright stands
  for (const t of trilithons()) {
    const seed = 300 + t.k * 3;
    const ext = (p, q, k) => ({ x: p.x + (p.x - q.x) * k, z: p.z + (p.z - q.z) * k });   // push a lintel end out past the upright
    if (t.standing) {
      stone(S, "s", { x: t.pa.x, z: t.pa.z, w: D.triW, d: D.triD, h: t.h, yaw: t.b, taper: 0.1, rough: 0.1, seed });
      stone(S, "s", { x: t.pb.x, z: t.pb.z, w: D.triW, d: D.triD, h: t.h, yaw: t.b, taper: 0.1, rough: 0.1, seed: seed + 1 });
      const k = (D.triW / 2) / Math.hypot(t.pa.x - t.pb.x, t.pa.z - t.pb.z);
      lintel(S, "s", ext(t.pa, t.pb, k), ext(t.pb, t.pa, k), t.h, D.triLinH, D.triD * 0.95, seed + 2);
    } else {
      // only the second upright still stands (56 of the Great Trilithon leans a little; 60 stands)
      stone(S, "s", { x: t.pb.x, z: t.pb.z, w: D.triW, d: D.triD, h: t.h, yaw: t.b, lean: t.n === "55–56" ? 0.03 : 0, taper: 0.1, rough: 0.1, seed: seed + 1 });
    }
  }
  for (const f of fallenInner()) stone(S, "s", { x: f.x, z: f.z, w: f.w, d: f.d, h: f.h, fall: true, yaw: f.b, taper: 0.05, rough: 0.1, seed: f.seed });
  // the bluestones: the circle (many now stumps) and the horseshoe (six still upright)
  for (const b of bluestones()) stone(Bl, "b", { x: b.x, z: b.z, w: b.w, d: b.d, h: b.h, fall: b.fallen, yaw: b.fallen ? b.b + 90 : b.b, taper: 0.2, rough: 0.06, seed: Math.round(b.b * 10) });
  for (const b of bluestoneHorseshoe()) stone(Bl, "b", { x: b.x, z: b.z, w: b.w, d: b.d, h: b.h, yaw: b.b, taper: 0.25, rough: 0.05, seed: 900 + Math.round(b.b) });
  // the Altar Stone, lying flat under the broken halves of stone 55
  stone(A, "a", { x: D.altar.x - D.altar.l / 2, z: D.altar.z, w: D.altar.w, d: D.altar.t, h: D.altar.l, fall: true, yaw: 90, taper: 0.03, rough: 0.05, seed: 80 });
  finish(ctx, S, { s: sars }, []);
  finish(ctx, Bl, { b: blue }, []);
  finish(ctx, A, { a: altarM }, []);
  markers(ctx, site, "s3");
}
