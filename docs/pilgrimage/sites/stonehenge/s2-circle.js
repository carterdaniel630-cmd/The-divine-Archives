/* II · The sarsen circle: thirty uprights on a ring about 30 m across, with the lintels that are still in
   place. Standing, fallen and missing stones follow the present ruin in outline (layout.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { sarsens, sarsenLintels } from "./layout.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { stone, lintel } from "../../megalith.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const sars = ctx.mat("sarsen");
  const S = new Bucket();
  const list = sarsens(), byI = new Map(list.map((s) => [s.i, s]));
  for (const s of list) {
    if (s.state === "stand") stone(S, "s", { x: s.x, z: s.z, w: D.upW, d: D.upD, h: D.upH, yaw: s.b, taper: 0.08, rough: 0.09, seed: 10 + s.i });
    else if (s.state === "fallen") stone(S, "s", { x: s.x, z: s.z, w: D.upW, d: D.upD * 0.9, h: D.upH * 0.95, fall: true, yaw: s.b + 180 + ((s.i * 37) % 30 - 15), taper: 0.06, rough: 0.1, seed: 10 + s.i });
    else stone(S, "s", { x: s.x, z: s.z, w: D.upW * 0.8, d: D.upD * 0.8, h: 0.35, yaw: s.b, taper: 0.3, rough: 0.12, seed: 10 + s.i });   // a stump, or just the hole's place
  }
  // the lintels still in place, each spanning from one upright's centre to the next
  for (const [a, b] of sarsenLintels()) {
    const p = byI.get(a), q = byI.get(b);
    lintel(S, "s", p, q, D.upH, D.linH, D.linD, 200 + a);
  }
  finish(ctx, S, { s: sars }, []);
  sign(ctx, ["The sarsen circle", "30 uprights · a ring of lintels about 30 m across"], -D.sarsenR - 4.5, 1.2, -4, Math.PI / 2, 2.6, 0.5, { size: 50 });
  void THREE;
  markers(ctx, site, "s2");
}
