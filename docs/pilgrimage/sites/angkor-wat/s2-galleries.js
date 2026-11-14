/* II · The gallery of bas-reliefs: the cruciform terrace, the first level on its plinth with the gallery all round
   (pillars on the outer side, the relief wall inside, the roof, the corner and entrance pavilions), three of its
   great panels (our own renderings, art.js), the cruciform cloister drawn as one passage, the stair to the second
   level, and the second gallery on its terrace with its four corner towers. Plans SURVEY, heights and the shapes
   of the pavilions and towers APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { relief, panel } from "./art.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { nearPortal } from "./lod.js?v=1";

export function build(ctx) {
  const G1 = D.g1, G2 = D.g2, C = D.cru;
  const sand = ctx.mat("limestone", { color: new THREE.Color("#9a9386") }).clone(); sand.side = THREE.DoubleSide;
  const dark = ctx.mat("block", { color: new THREE.Color("#6f6a60") }), floor = ctx.mat("floor", { color: new THREE.Color("#a39b8b") });
  const S = new Bucket(), R = new Bucket(), F = new Bucket();
  const flat = (B, k, x0, x1, z0, z1, y) => B.quad(k, V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0));
  const box = (B, k, x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(k, g); };
  // a tiered tower, truncated: square stages narrowing upward
  const tiers = (x, z, y, w, n, step, shrink) => { for (let k = 0; k < n; k++) { const s = w / 2 * (1 - k * shrink); box(S, "s", x - s, x + s, y + k * step, y + (k + 1) * step, z - s, z + s); } };
  // the four sides of a gallery square of half-sizes (hx, hz): calls f(x0, x1, z0, z1) for each straight piece
  // between the axial doors (half-width `door`) and the corners (`corner` kept clear)
  const sides = (hx, hz, door, corner, f) => {
    for (const s of [-1, 1]) {
      f(-hx + corner, -door, s * hz, s * hz, "x"); f(door, hx - corner, s * hz, s * hz, "x");
      f(s * hx, s * hx, -hz + corner, -door, "z"); f(s * hx, s * hx, door, hz - corner, "z");
    }
  };

  // ---- the cruciform terrace before the first gallery (its two levels drawn as one)
  const ty = G1.y;
  box(S, "s", C.x0, C.x1, 0, ty, -8, 8); box(S, "s", C.x0 + 4, C.x1 - 4, 0, ty, -C.hz, C.hz);
  flat(F, "f", C.x0, C.x1, -8, 8, ty); flat(F, "f", C.x0 + 4, C.x1 - 4, -C.hz, -8, ty); flat(F, "f", C.x0 + 4, C.x1 - 4, 8, C.hz, ty);
  // ---- the first level: its plinth and floor, and the gallery
  const hx = G1.hx, hz = G1.hz, ins = G1.inset, y = G1.y, h = G1.h, yR = y + h;
  box(S, "s", -hx, hx, 0, y - 0.01, -hz, hz);
  flat(F, "f", -hx, hx, -hz, hz, y);
  sides(hx - ins - 0.5, hz - ins - 0.5, 4, 0, (x0, x1, z0, z1, ax) => {                     // the relief wall
    if (ax === "x") box(S, "s", Math.min(x0, x1), Math.max(x0, x1), y, yR, z0 - 0.5, z0 + 0.5); else box(S, "s", x0 - 0.5, x0 + 0.5, y, yR, Math.min(z0, z1), Math.max(z0, z1));
  });
  sides(hx - 0.4, hz - 0.4, 4.5, 4, (x0, x1, z0, z1, ax) => {                               // the pillars on the outer side
    const a = ax === "x" ? x0 : z0, b = ax === "x" ? x1 : z1;
    for (let u = a + 1.6; u < b - 0.4; u += 3.2) ax === "x" ? box(S, "s", u - 0.4, u + 0.4, y, yR, z0 - 0.4, z0 + 0.4) : box(S, "s", x0 - 0.4, x0 + 0.4, y, yR, u - 0.4, u + 0.4);
  });
  // the roof over the gallery: a slab and a narrower one above it
  const w0 = ins + 0.5;
  for (const o of [-1, 1]) {
    const za = o > 0 ? hz - w0 : -hz, zb = o > 0 ? hz : -hz + w0, xa = o > 0 ? hx - w0 : -hx, xb = o > 0 ? hx : -hx + w0;
    box(R, "r", -hx, hx, yR, yR + 0.6, za, zb); box(R, "r", xa, xb, yR, yR + 0.6, -hz + w0, hz - w0);
    box(R, "r", -hx + 0.6, hx - 0.6, yR + 0.6, yR + 1.4, za + 0.6, zb - 0.6); box(R, "r", xa + 0.6, xb - 0.6, yR + 0.6, yR + 1.4, -hz + w0 + 0.6, hz - w0 - 0.6);
  }
  // the corner pavilions and the four entrance pavilions (the western one larger, with a passage), truncated
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) tiers(sx * (hx - 3), sz * (hz - 3), yR, 9, 3, 1.6, 0.18);
  for (const [cx, cz, w] of [[-hx + 2, 0, 12], [hx - 2, 0, 9], [0, -hz + 2, 9], [0, hz - 2, 9]]) { box(S, "s", cx - w / 2, cx + w / 2, yR, yR + 1.2, cz - w / 2, cz + w / 2); tiers(cx, cz, yR + 1.2, w - 2, 3, 1.8, 0.2); }
  // ---- three of the great panels, on the relief wall facing out into the gallery
  const xr = -hx + ins - 0.02, zr = hz - ins + 0.02, rh = G1.relH, ry = y + 0.55 + rh / 2, tile = rh * 2048 / 280;
  panel(ctx, relief("battle", 11), 82, rh, tile, xr, ry, 47, -Math.PI / 2);           // west gallery, south half: Kurukshetra
  panel(ctx, relief("procession", 23), 90, rh, tile, -57, ry, zr, Math.PI);           // south gallery, west part: the army of Suryavarman II
  panel(ctx, relief("judgement", 37), 60, rh, tile, 40, ry, zr, Math.PI);             // south gallery, east part: heavens and hells

  // ---- the cruciform cloister, as a single roofed passage east from the west door
  const cx0 = -hx + ins + 0.5, cx1 = -72;
  for (const s of [-1, 1]) box(S, "s", cx0, cx1, y, y + 4.6, s * 3.4 - 0.4, s * 3.4 + 0.4);
  box(R, "r", cx0, cx1, y + 4.6, y + 5.2, -4.0, 4.0);
  // ---- the second level: its terrace, the stair up from the cloister, the gallery and its corner towers
  const ax = G2.hx, az = G2.hz, y2 = G2.y, h2 = G2.h;
  box(S, "s", -ax, ax, y, y2 - 0.01, -az, az);
  flat(F, "f", -ax, ax, -az, az, y2);
  const n = 26, run = (-ax - cx1) / n, rise = (y2 - y) / n;
  for (let k = 0; k < n; k++) {
    const xa = cx1 + k * run, xb = xa + run, yy = y + (k + 1) * rise;
    flat(F, "f", xa, xb, -2.5, 2.5, yy);
    S.quad("s", V(xa, yy - rise, -2.5), V(xa, yy - rise, 2.5), V(xa, yy, 2.5), V(xa, yy, -2.5));
  }
  for (const s of [-1, 1]) S.quad("s", V(cx1, y, s * 2.5), V(-ax, y, s * 2.5), V(-ax, y2 + 0.6, s * 2.5), V(cx1, y + 0.6, s * 2.5));
  sides(ax, az, 2.5, 0, (x0, x1, z0, z1, a) => {                                              // the outer wall (closed, with windows not drawn)
    if (a === "x") box(S, "s", Math.min(x0, x1), Math.max(x0, x1), y2, y2 + h2, z0 - 0.5, z0 + 0.5); else box(S, "s", x0 - 0.5, x0 + 0.5, y2, y2 + h2, Math.min(z0, z1), Math.max(z0, z1));
  });
  sides(ax - G2.inset, az - G2.inset, 2.5, 3, (x0, x1, z0, z1, a) => {                         // the inner pillars
    const p = a === "x" ? x0 : z0, q = a === "x" ? x1 : z1;
    for (let u = p + 1.6; u < q - 0.4; u += 3.2) a === "x" ? box(S, "s", u - 0.35, u + 0.35, y2, y2 + h2, z0 - 0.35, z0 + 0.35) : box(S, "s", x0 - 0.35, x0 + 0.35, y2, y2 + h2, u - 0.35, u + 0.35);
  });
  box(R, "r", -ax, ax, y2 + h2, y2 + h2 + 0.6, -az, -az + G2.inset + 0.4); box(R, "r", -ax, ax, y2 + h2, y2 + h2 + 0.6, az - G2.inset - 0.4, az);
  box(R, "r", -ax, -ax + G2.inset + 0.4, y2 + h2, y2 + h2 + 0.6, -az, az); box(R, "r", ax - G2.inset - 0.4, ax, y2 + h2, y2 + h2 + 0.6, -az, az);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) tiers(sx * (ax - 3), sz * (az - 3), y2 + h2 + 0.6, 9, 5, 2.0, 0.15);
  for (const [cx, cz] of [[-ax + 2, 0], [ax - 2, 0], [0, -az + 2], [0, az - 2]]) tiers(cx, cz, y2 + h2 + 0.6, 7, 3, 1.6, 0.2);

  finish(ctx, F, { f: floor }, ["f"]);
  finish(ctx, S, { s: sand }, []);
  finish(ctx, R, { r: dark }, []);
  sign(ctx, ["The Gallery of Bas-Reliefs", "followed from here southward · anticlockwise"], -hx - 3, y + 3.2, -6.5, -Math.PI / 2, 3.4, 0.55, { size: 46 });
  sign(ctx, ["Up to the central sanctuary", "the platform of the five towers"], -D.l3.base - 1.0, y2 + 2.6, -2.2, -Math.PI / 2, 2.6, 0.5, { size: 46 });
  nearPortal(ctx, { w: 1.6, h: 2.3, tint: "#ffe2b0" }, -D.l3.base - 0.8, y2, 0, -Math.PI / 2);
  markers(ctx, site, "s2");
}
