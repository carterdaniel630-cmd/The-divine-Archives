/* I · Before the mound: the ground of the Boyne ridge and a low horizon, the mound itself (turf over a quartz
   wall across its front, as reconstructed), the kerb with the Entrance Stone, the doorway with the roof-box
   above it, the surviving stones of the Great Circle, and the solstice beam (toggled from its cards; it is
   built here because this section is loaded wherever the visitor stands on the site). Sizes in dims.js,
   placings in layout.js, all APPROX unless dims.js says SURVEY. */
import * as THREE from "three";
import site, { lamps } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { at, kerb, circle } from "./layout.js?v=1";
import { k1Tex, panel } from "./art.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

// a ring of quads between points of a radius/height profile (listed outward), for bearings b0..b1 (degrees from
// the entrance axis), skipping any segment whose middle `skip` rejects; faces up and outward
function ring(B, key, prof, b0, b1, seg, skip) {
  for (let i = 0; i < seg; i++) {
    const a0 = b0 + (b1 - b0) * i / seg, a1 = b0 + (b1 - b0) * (i + 1) / seg;
    if (skip && skip((a0 + a1) / 2)) continue;
    for (let k = 0; k < prof.length - 1; k++) {
      const [r0, y0] = prof[k], [r1, y1] = prof[k + 1];
      const p = (r, y, b) => { const q = at(r, b); return V(q.x, y, q.z); };
      B.quad(key, p(r0, y0, a1), p(r0, y0, a0), p(r1, y1, a0), p(r1, y1, a1));
    }
  }
}

export function build(ctx) {
  const turf = ctx.mat("turf"), turfFar = ctx.mat("turf", { color: new THREE.Color("#8a9a78") });
  const quartz = ctx.mat("quartz"), kerbM = ctx.mat("sarsen", { color: new THREE.Color("#9a978d") });
  const rock = ctx.mat("rock", { color: new THREE.Color("#8b877c") });
  const rock2 = rock.clone(); rock2.side = THREE.DoubleSide;   // the small faces of the doorway and roof-box are seen from both sides
  const G = new Bucket(), M = new Bucket(), S = new Bucket(), Dr = new Bucket();
  const W = D.wallH, F = D.face, A = D.facadeArc, P_ = D.pass;

  // ---- the ground, out to a low horizon; a long low hill to the south-east, where the midwinter sun rises
  ring(G, "g", [[0.01, 0], [260, 0]], -180, 180, 72);
  ring(G, "f", [[260, 0], [520, 3], [820, 34]], -180, 180, 60);
  const hill = new THREE.SphereGeometry(160, 20, 6, 0, Math.PI * 2, 0, Math.PI / 2); hill.scale(1.6, 0.26, 1); hill.translate(90, -6, 640); G.geo("f", hill);

  // ---- the mound: a domed top over all of it; in front a vertical wall of quartz (with a gap for the doorway),
  //      elsewhere the turf slopes down to the kerb
  const top = [[0.01, D.H], [8, D.H], [18, D.H - 1.0], [30, 7.2], [F, W]];
  ring(M, "t", top, -180, 180, 96);
  const doorDeg = 2.0;                                   // the doorway: the wall's two middle segments are left out
  ring(M, "q", [[F, W], [F + 0.001, 0]], -A, A, 42, (b) => Math.abs(b) < doorDeg);
  ring(M, "t", [[F, W], [D.R - 0.4, 0.35]], A, 360 - A, 108);
  // the doorway's face between the wall's ends: an opening for the passage with the roof-box above it
  const e = at(F, doorDeg), xd = e.x, zd = e.z, hw = P_.w / 2, rb = D.roofBox, rbY1 = rb.y + rb.h, rbZ0 = zd - 2.5;
  {
    const P = (x, y) => V(x, y, zd);
    // the stone frame round the opening, as quads on the face (faces +z)
    Dr.quad("r", P(-xd, 0), P(-hw, 0), P(-hw, W), P(-xd, W));
    Dr.quad("r", P(hw, 0), P(xd, 0), P(xd, W), P(hw, W));
    Dr.quad("r", P(-hw, P_.h), P(hw, P_.h), P(hw, rb.y), P(-hw, rb.y));                // the lintel over the door
    Dr.quad("r", P(-hw, rbY1), P(hw, rbY1), P(hw, W), P(-hw, W));                      // the roof-box's carved lintel
    Dr.quad("r", P(-hw, rb.y), P(-rb.w / 2, rb.y), P(-rb.w / 2, rbY1), P(-hw, rbY1));
    Dr.quad("r", P(rb.w / 2, rb.y), P(hw, rb.y), P(hw, rbY1), P(rb.w / 2, rbY1));
    // the roof-box itself: a short stone-lined slot running in over the passage roof
    const zb = zd - 0.6, rw = rb.w / 2, roofAt = (z) => P_.rise * (P_.z1 - z) / (P_.z1 - P_.z0) + P_.h / Math.cos(Math.atan2(P_.rise, P_.z1 - P_.z0));
    Dr.quad("r", V(-hw, rb.y, zd), V(hw, rb.y, zd), V(hw, rb.y, zb), V(-hw, rb.y, zb));          // its sill (the door lintel's top)
    Dr.quad("r", V(-hw, P_.h, zb), V(hw, P_.h, zb), V(hw, P_.h, zd), V(-hw, P_.h, zd));          // the door lintel's underside
    Dr.quad("r", V(-hw, P_.h, zb), V(-hw, rb.y, zb), V(hw, rb.y, zb), V(hw, P_.h, zb));          // its back face
    Dr.quad("r", V(-rw, rbY1, rbZ0), V(rw, rbY1, rbZ0), V(rw, rbY1, zd), V(-rw, rbY1, zd));      // the roof-box's roof
    Dr.quad("r", V(-rw, roofAt(rbZ0), rbZ0), V(rw, roofAt(rbZ0), rbZ0), V(rw, rbY1, rbZ0), V(-rw, rbY1, rbZ0)); // its back
    for (const s of [-1, 1]) {
      const x = s * rw, a = V(x, roofAt(zb), zb), b = V(x, roofAt(rbZ0), rbZ0), c = V(x, rbY1, rbZ0), d = V(x, rbY1, zb);
      if (s < 0) Dr.quad("r", b, a, d, c); else Dr.quad("r", a, b, c, d);
      const a2 = V(x, rb.y, zd), b2 = V(x, rb.y, zb), c2 = V(x, rbY1, zb), d2 = V(x, rbY1, zd);
      if (s < 0) Dr.quad("r", a2, b2, c2, d2); else Dr.quad("r", b2, a2, d2, c2);
      // the ledge between the slot's side and the passage wall
      Dr.quad("r", V(s * hw, roofAt(zb), zb), V(x, roofAt(zb), zb), V(x, roofAt(rbZ0), rbZ0), V(s * hw, roofAt(rbZ0), rbZ0));
    }
  }

  // ---- the kerb, the Entrance Stone (K1) lying across the entrance, and its carving
  for (const k of kerb()) stone(S, "k", { x: k.x, z: k.z, w: k.w, d: D.kerbD, h: k.h, yaw: k.yaw, taper: 0.1, rough: 0.07, seed: 300 + k.k });
  const K = D.k1;
  stone(S, "k", { x: 0, z: K.z, w: K.l, d: K.d, h: K.h, yaw: Math.PI, taper: 0.12, rough: 0.04, seed: 301 });
  panel(ctx, k1Tex(), K.l - 0.3, K.h - 0.2, 0, K.h * 0.47, K.z + K.d / 2 + 0.05, Math.PI);
  // ---- the Great Circle
  for (const s of circle()) stone(S, "c", { x: s.x, z: s.z, w: s.w, d: s.d, h: s.h, yaw: s.yaw, taper: 0.28, rough: 0.16, seed: 400 + s.i });

  finish(ctx, G, { g: turf, f: turfFar }, ["g"]);
  finish(ctx, M, { t: turf, q: quartz }, []);
  finish(ctx, S, { k: kerbM, c: kerbM }, []);
  finish(ctx, Dr, { r: rock2 }, []);

  // ---- the solstice beam (switched on from its cards). The lamps go down, a soft shaft of sun enters over the
  //      roof-box, creeps up the rising passage and lies along the chamber floor as far as it reaches today, then
  //      narrows and withdraws: about 17 minutes compressed into 16 seconds, repeating. A dashed line marks the
  //      further reach Ray found for the time of building.
  const beam = new THREE.Group();
  const soft = (w, h, along) => {   // a gold band, bright on its centre line, fading to its edges (and its ends, if along)
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"), img = g.createImageData(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const u = Math.abs(i / (w - 1) - 0.5) * 2, v = j / (h - 1), a = Math.pow(Math.max(0, 1 - u * u), 1.6) * (along ? Math.min(1, v * 6) * Math.min(1, (1 - v) * 3) : 1);
      const k = (j * w + i) * 4; img.data[k] = 255; img.data[k + 1] = 214; img.data[k + 2] = 140; img.data[k + 3] = Math.round(255 * a);
    }
    g.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  };
  const beamM = new THREE.MeshBasicMaterial({ map: soft(64, 8, false), transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const poolM = new THREE.MeshBasicMaterial({ map: soft(64, 64, true), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const flat = new THREE.PlaneGeometry(0.4, 1).rotateX(-Math.PI / 2);   // 0.4 wide, 1 long along z
  const shaft = new THREE.Group(); shaft.add(new THREE.Mesh(flat, beamM), new THREE.Mesh(flat.clone().rotateZ(Math.PI / 2), beamM)); beam.add(shaft);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 1), poolM); pool.rotation.x = -Math.PI / 2; beam.add(pool);
  const then = new THREE.BufferGeometry().setFromPoints([V(0, D.ch.y + 0.05, D.ch.z0 + 0.4), V(0, D.ch.y + 0.05, D.rec.back.z0 + 0.4), V(0, D.ch.y + 0.9, D.rec.back.z0 + 0.15)]);
  const line = new THREE.Line(then, new THREE.LineDashedMaterial({ color: "#e7c680", dashSize: 0.18, gapSize: 0.12, depthTest: false, transparent: true }));
  line.computeLineDistances(); line.renderOrder = 10; beam.add(line);
  const yIn = rb.y + rb.h / 2, zIn = zd + 0.2, yEnd = D.ch.y + 0.04, zEnd = D.ch.z0 + 0.4, run = zIn - zEnd;
  const glow = ctx.light(0, -1000, 0, 0, "#ffcf80");   // the sunlight's own glow on the stones round the lit floor
  let t = 6, dimmed = false;   // starts at full reach, so a visitor with reduced motion sees the whole beam, still
  const dim = (on) => {
    if (on === dimmed) return; dimmed = on;
    for (const h of lamps) { h.anchor.s = on ? 0.05 : h.s; h.halo.visible = !on; }
    if (!on) { glow.s = 0; glow.p.y = -1000; }
  };
  const fx = { group: beam, update(dt) {
    if (!beam.visible) { dim(false); return false; }
    dim(true); t += dt; const ph = (t % 16) / 16;
    const reach = Math.min(1, Math.max(0, Math.sin(Math.PI * ph) * 1.35)), w = ph < 0.5 ? 1 : Math.max(0.3, 1 - (ph - 0.5) * 1.4);
    const zTip = zIn - reach * run, len = Math.max(0.01, zIn - zTip), yTip = yIn - (yIn - yEnd) * (len / run);
    shaft.scale.set(w, 1, len); shaft.position.set(0, (yIn + yTip) / 2, (zIn + zTip) / 2); shaft.rotation.x = -Math.atan2(yIn - yTip, len);
    const lit = Math.max(0.01, D.ch.z1 - zTip); pool.visible = zTip < D.ch.z1;
    pool.scale.set(w, lit, 1); pool.position.set(0, D.ch.y + 0.015, (D.ch.z1 + zTip) / 2);
    glow.s = pool.visible ? 0.45 * Math.min(1, lit / 2) * w : 0;
    if (glow.s > 0) glow.p.set(0, D.ch.y + 0.5, Math.min(D.ch.z1, zTip + 0.8)); else glow.p.y = -1000;
    return true;
  }, dispose() { dim(false); } };
  fx.update(0);
  ctx.anim(fx, 0, 2, (zIn + zEnd) / 2);
  ctx.outline("solstice", beam);

  // ---- signposts and the way back
  sign(ctx, ["Newgrange", "Brú na Bóinne · the entrance faces south-east, to the midwinter sunrise"], -4.5, 2.2, 52, 0, 3.6, 0.55, { size: 48 });
  sign(ctx, ["The Vestibule", "and back to the museum"], 0, 2.6, D.lawn.z1 + 1.0, Math.PI, 1.8, 0.45, { size: 54 });
  ctx.portal({ w: 1.4, h: 2.2, tint: "#ffe2b0" }, 0, 0, D.lawn.z1 + 0.9, Math.PI);
  markers(ctx, site, "s1");
}
