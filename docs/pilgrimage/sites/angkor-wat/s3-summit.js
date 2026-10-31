/* III · The central sanctuary: the two-storey base of the third level with its steep axial stairs, the platform on
   top with the gallery round its edge, and the five towers: four at the corners and the central one over the
   sanctuary, 42 m above the platform. The towers are turned shapes (a square body, then tiers narrowing to a
   bud-like top), simplified from the real ones, which are square in plan with many recesses. Quincunx width and
   central height SURVEY; the rest APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { nearPortal } from "./lod.js?v=1";

// a tower's outline as (radius, height) pairs, bottom to top: a body, then `n` tiers each stepping in, closing to a point
function profile(r, h, n) {
  const pts = [[0.01, 0], [r, 0], [r, h * 0.3]];
  for (let k = 0; k < n; k++) {
    const t0 = 0.3 + 0.62 * k / n, t1 = 0.3 + 0.62 * (k + 1) / n, f = (t) => r * 0.92 * Math.pow(Math.max(0, 1 - Math.pow((t - 0.3) / 0.7, 1.7)), 0.55);
    pts.push([f(t0) * 1.04, h * t0], [f(t0) * 1.04, h * (t0 + 0.012)], [f(t1) * 0.94, h * t1]);
  }
  pts.push([r * 0.08, h * 0.97], [0.01, h]);
  return pts.map(([a, b]) => new THREE.Vector2(a, b));
}

export function build(ctx) {
  const L3 = D.l3, y2 = D.g2.y, y3 = L3.y, b = L3.base, t = L3.top, ym = (y2 + y3) / 2, mid = (b + t) / 2;
  const sand = ctx.mat("limestone", { color: new THREE.Color("#968f82") }).clone(); sand.side = THREE.DoubleSide;
  const tow = ctx.mat("limestone", { color: new THREE.Color("#8c8579") }), dark = ctx.mat("block", { color: new THREE.Color("#6f6a60") });
  const floor = ctx.mat("floor", { color: new THREE.Color("#a0988a") });
  const S = new Bucket(), T = new Bucket(), R = new Bucket(), F = new Bucket();
  const flat = (B, k, x0, x1, z0, z1, y) => B.quad(k, V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0));
  const box = (B, k, x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(k, g); };

  // ---- the base: two sloping storeys with a ledge between, and a steep stair up the middle of each side
  const frustum = (r0, r1, ya, yb) => {
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a);
      const P = (r, y, u) => V(c * r - s * u, y, s * r + c * u);   // side i: outward along (c, s); u along it
      S.quad("s", P(r0, ya, -r0), P(r0, ya, r0), P(r1, yb, r1), P(r1, yb, -r1));
    }
  };
  frustum(b, mid + 1, y2, ym); flat(S, "s", -(mid + 1), mid + 1, -(mid + 1), mid + 1, ym); frustum(mid, t, ym, y3);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a), n = 40;
    for (let k = 0; k < n; k++) {
      const f = k / n, r = b + 0.6 - (b + 0.6 - t) * f, yy = y2 + (y3 - y2) * f, d = (b - t) / n, hh = (y3 - y2) / n;
      const g = new THREE.BoxGeometry(d + 0.02, hh, 3.6); g.translate(r - d / 2, yy + hh / 2, 0); g.rotateY(-a); T.geo("t", g);
      if (k % 4 === 0) { const w = new THREE.BoxGeometry(0.6, hh * 4 + 0.5, 0.6); for (const side of [-2.1, 2.1]) { const ww = w.clone(); ww.translate(r - d / 2, yy + hh * 2, side); ww.rotateY(-a); T.geo("t", ww); } }
    }
    void c; void s;
  }
  // ---- the platform and its gallery: an outer wall with doors on the axes, pillars inside, a roof between
  flat(F, "f", -t, t, -t, t, y3);
  const gw = L3.inset, hG = L3.galH;
  for (const o of [-1, 1]) for (const half of [-1, 1]) {
    const u0 = half < 0 ? -t : 1.5, u1 = half < 0 ? -1.5 : t;
    box(S, "s", u0, u1, y3, y3 + hG, o * t - 0.4, o * t + 0.4); box(S, "s", o * t - 0.4, o * t + 0.4, y3, y3 + hG, u0, u1);
    for (let u = u0 + 1.4; u < u1 - 0.4; u += 2.8) { box(S, "s", u - 0.3, u + 0.3, y3, y3 + hG, o * (t - gw) - 0.3, o * (t - gw) + 0.3); box(S, "s", o * (t - gw) - 0.3, o * (t - gw) + 0.3, y3, y3 + hG, u - 0.3, u + 0.3); }
  }
  for (const o of [-1, 1]) { box(R, "r", -t, t, y3 + hG, y3 + hG + 0.5, o > 0 ? t - gw - 0.4 : -t, o > 0 ? t : -t + gw + 0.4); box(R, "r", o > 0 ? t - gw - 0.4 : -t, o > 0 ? t : -t + gw + 0.4, y3 + hG, y3 + hG + 0.5, -t + gw + 0.4, t - gw - 0.4); }
  // ---- the five towers on their sanctuary bodies
  const tower = (x, z, r, h) => {
    box(T, "t", x - r, x + r, y3, y3 + h * 0.18, z - r, z + r);                          // the sanctuary body, square
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) box(T, "t", x + dx * r - (dx ? 0.8 : 1.6), x + dx * r + (dx ? 0.8 : 1.6), y3, y3 + h * 0.15, z + dz * r - (dz ? 0.8 : 1.6), z + dz * r + (dz ? 0.8 : 1.6));   // its porches
    const g = new THREE.LatheGeometry(profile(r * 0.95, h * 0.82, 7), 12); g.rotateY(Math.PI / 12); g.translate(x, y3 + h * 0.18, z); T.geo("t", g);
  };
  tower(0, 0, D.tw.c.r, D.tw.c.h);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) tower(sx * D.tw.k.off, sz * D.tw.k.off, D.tw.k.r, D.tw.k.h);

  finish(ctx, F, { f: floor }, ["f"]);
  finish(ctx, S, { s: sand }, []);
  finish(ctx, T, { t: tow }, []);
  finish(ctx, R, { r: dark }, []);
  sign(ctx, ["Down to the gallery of bas-reliefs", "and the way back"], -t + 1.4, y3 + 2.6, -2.0, Math.PI / 2, 2.6, 0.5, { size: 46 });
  nearPortal(ctx, { w: 1.6, h: 2.3, tint: "#ffe2b0" }, -t + 0.9, y3, 0, Math.PI / 2);
  markers(ctx, site, "s3");
}
