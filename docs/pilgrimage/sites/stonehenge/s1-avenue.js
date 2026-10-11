/* I · The Avenue, and the open ground of the monument: the plain, the henge ditch and its bank (with the
   north-east entrance), the Avenue's banks running out along the axis, the Heel Stone, the fallen Slaughter
   Stone, the Aubrey Holes and the two Station Stones. Sizes in dims.js; the horizon is a low backdrop. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { at, ringStones } from "./layout.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const RAD = Math.PI / 180;
// a ring of quads between radius/height profiles, skipping bearings inside the gap (degrees)
function ringStrip(B, key, prof, gap, seg) {
  seg = seg || 120;
  for (let i = 0; i < seg; i++) {
    const b0 = i * 360 / seg, b1 = (i + 1) * 360 / seg, mid = (b0 + b1) / 2;
    if (gap && (mid < gap || mid > 360 - gap)) continue;
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, y0] = prof[k], [r1, y1] = prof[k + 1];
      const p = (r, y, b) => { const q = at(r, b); return V(q.x, y, q.z); };
      B.quad(key, p(r0, y0, b0), p(r0, y0, b1), p(r1, y1, b1), p(r1, y1, b0));
    }
  }
}

export function build(ctx) {
  const turf = ctx.mat("turf"), turfFar = ctx.mat("turf", { color: new THREE.Color("#8fa07a") });
  const chalk = new THREE.MeshStandardMaterial({ color: "#e9e6da", roughness: 0.9 });
  const sars = ctx.mat("sarsen");
  const F = new Bucket(), B = new Bucket(), S = new Bucket();
  const gap = (D.entranceW / 2) / D.ditchR / RAD;            // the entrance, in degrees either side of the axis
  const dIn = D.ditchR - D.ditchW / 2, dOut = D.ditchR + D.ditchW / 2;
  // the ground inside the ditch: a flat disc you walk on
  ringStrip(F, "g", [[0.01, 0], [dIn, 0]], 0, 96);
  // the causeway across the ditch at the entrance
  for (const sgn of [1]) { const a = at(dIn - 0.2, -gap), b = at(dIn - 0.2, gap), c = at(dOut + 0.2, gap), d = at(dOut + 0.2, -gap); F.quad("g", V(a.x, 0, a.z), V(b.x, 0, b.z), V(c.x, 0, c.z), V(d.x, 0, d.z)); void sgn; }
  // the ditch: sloping sides, a flat bottom, interrupted at the entrance
  ringStrip(B, "g", [[dIn, 0], [dIn + 1.2, -D.ditchDepth], [dOut - 1.2, -D.ditchDepth], [dOut, 0]], gap, 120);
  // the bank inside the ditch, worn low
  ringStrip(B, "g", [[D.bankR - D.bankW / 2, 0.01], [D.bankR, D.bankH], [D.bankR + D.bankW / 2, 0.01]], gap, 120);
  // the plain outside the ditch, out to a low horizon
  ringStrip(F, "g", [[dOut, 0], [260, 0]], 0, 96);
  ringStrip(B, "f", [[260, 0], [520, 2], [700, 26]], 0, 72);
  // the Avenue: two low banks with a ditch outside each, running out along the axis from the entrance
  const z0 = -dOut, z1 = -D.avLen - 60, hw = D.avW / 2;
  for (const sx of [-1, 1]) {
    const xb = sx * hw, xd = sx * (hw + 2.4);
    B.quad("g", V(xb - 1.4, 0.01, z1), V(xb, 0.45, z1), V(xb, 0.45, z0), V(xb - 1.4, 0.01, z0));
    B.quad("g", V(xb, 0.45, z1), V(xb + 1.4, 0.01, z1), V(xb + 1.4, 0.01, z0), V(xb, 0.45, z0));
    // the ditch outside the bank, a shallow dip
    B.quad("g", V(xd - 1.0, 0.0, z0), V(xd, -0.35, z0), V(xd, -0.35, z1), V(xd - 1.0, 0.0, z1));
    B.quad("g", V(xd, -0.35, z0), V(xd + 1.0, 0.0, z0), V(xd + 1.0, 0.0, z1), V(xd, -0.35, z1));
  }
  // round barrows on the skyline (the King Barrows and others): low mounds, placed by eye. APPROX
  const barrow = (x, z, r, h) => { const g = new THREE.SphereGeometry(r, 18, 6, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(1, h / r, 1); g.translate(x, 0, z); B.geo("g", g); };
  for (const [b, r, s, h] of [[95, 330, 14, 3], [101, 345, 16, 3.5], [108, 360, 13, 2.8], [190, 420, 18, 3], [205, 400, 12, 2.2], [300, 380, 15, 3], [312, 395, 12, 2.4], [40, 460, 16, 3]]) { const p = at(r, b); barrow(p.x, p.z, s, h); }
  finish(ctx, F, { g: turf }, ["g"]);
  finish(ctx, B, { g: turf, f: turfFar }, []);
  // the Aubrey Holes, marked today by white discs in the grass
  const disc = new THREE.CircleGeometry(D.aubreyD / 2, 14); disc.rotateX(-Math.PI / 2);
  const holes = new THREE.InstancedMesh(disc, chalk, D.aubreyN), m = new THREE.Matrix4();
  for (let i = 0; i < D.aubreyN; i++) { const p = at(D.aubreyR, (i + 0.5) * 360 / D.aubreyN); m.makeTranslation(p.x, 0.02, p.z); holes.setMatrixAt(i, m); }
  ctx.group.add(holes);
  // the Heel Stone, unshaped and leaning towards the circle; the Slaughter Stone, fallen at the entrance
  stone(S, "s", { x: D.heel.x, z: D.heel.z, w: D.heel.w, d: D.heel.d, h: D.heel.h, lean: D.heel.lean, taper: 0.3, rough: 0.28, seed: 96 });
  stone(S, "s", { x: -3.6, z: -53.7, w: D.slaughter.w, d: D.slaughter.d, h: D.slaughter.l, fall: true, yaw: 0, taper: 0.08, rough: 0.12, seed: 95 });
  // the two surviving Station Stones (small, one leaning)
  const st = ringStones().stationPos;
  stone(S, "s", { x: st[0].x, z: st[0].z, w: 1.1, d: 0.8, h: 1.2, taper: 0.2, rough: 0.12, seed: 91 });
  stone(S, "s", { x: st[1].x, z: st[1].z, w: 1.0, d: 0.9, h: 2.4, lean: -0.2, taper: 0.25, rough: 0.14, seed: 93 });
  finish(ctx, S, { s: sars }, []);
  // signposts: which way is which, and the way back
  sign(ctx, ["The Avenue", "ahead: the stones · behind you: north-east, the midsummer sunrise"], 4.5, 1.9, -D.avLen + 2, Math.PI, 3.2, 0.5, { size: 50 });
  sign(ctx, ["The Vestibule", "and back to the museum"], 0, 2.6, -D.avLen - 6.4, Math.PI, 1.8, 0.45, { size: 54 });
  ctx.portal({ w: 1.4, h: 2.2, tint: "#ffe2b0" }, 0, 0, -D.avLen - 6.5, Math.PI);
  markers(ctx, site, "s1");
}
