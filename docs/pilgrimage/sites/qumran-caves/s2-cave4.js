/* II · Cave 4: two chambers hollowed by hand out of the marl, joined by a low way through, with rows of
   holes in the walls of the first. Sizes APPROX (dims.js).

   Presence Pass proof piece (order-2026-11-01-presence-pass.md item 4, "one varied wall in Qumran's Cave 4"):
   the marl walls and floor carry the Visual Foundation Kit's world-space breakup, so the stone no longer shows
   one tile stamped across it, and the wall facets are lit smoothly; the holes are cut INTO the wall (a socket
   with depth that darkens inward), hand-made rather than ruled: sizes, spacing and row heights wander, a few
   are broken out wider and a few are lost. Their number, spacing and wear remain our estimate, as the card says. */
import * as THREE from "three";
import site, { C4 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { withBreakup } from "../../../assets/foundation/kit.js";
import { cave, rubble } from "../../cave.js?v=1";
import { markers, glassCase, finish } from "../../parts.js?v=1";
import { enochFragments } from "./relics.js?v=1";

export function build(ctx) {
  // the shared marl materials, cloned (textures stay shared) so the kit's breakup applies to this cave only
  const marl = withBreakup(ctx.mat("rock", { color: new THREE.Color("#e8dcc2") }).clone(), 0.2, 2.3);
  const floorM = withBreakup(ctx.mat("rock", { color: new THREE.Color("#cdbd9c") }).clone(), 0.16, 1.7);
  const B = new Bucket(), F = new Bucket();
  const PI = Math.PI;
  // 4a: the mouth to the north, the way through to the east
  const a = cave(B, { floor: "f", wall: "wa" }, { cx: C4.x, cz: C4.z, y: 0, rx: D.c4a.rx, rz: D.c4a.rz, h: D.c4a.h, seed: 41, rough: 0.18,
    gaps: [{ a0: -0.33, a1: 0.33, h: 1.7 }, { a0: PI / 2 - 0.2, a1: PI / 2 + 0.28, h: 1.6 }] });
  const bx = C4.x + D.c4bOff;
  cave(B, { floor: "f", wall: "wb" }, { cx: bx, cz: C4.z + 0.3, y: 0, rx: D.c4b.rx, rz: D.c4b.rz, h: D.c4b.h, seed: 42, rough: 0.2,
    gaps: [{ a0: 1.5 * PI - 0.3, a1: 1.5 * PI + 0.25, h: 1.6 }] });
  // the way through between the chambers: a short low tunnel
  const tx0 = C4.x + D.c4a.rx - 0.4, tx1 = bx - D.c4b.rx + 0.4, tz0 = C4.z - 0.25, tz1 = C4.z + 0.95, th = 1.55;
  const T = (x, y, z) => new THREE.Vector3(x, y, z);
  F.quad("f", T(tx0, 0, tz1), T(tx1, 0, tz1), T(tx1, 0, tz0), T(tx0, 0, tz0));
  B.quad("w", T(tx0, th, tz0), T(tx1, th, tz0), T(tx1, th, tz1), T(tx0, th, tz1));
  B.quad("w", T(tx0, 0, tz0), T(tx1, 0, tz0), T(tx1, th, tz0), T(tx0, th, tz0));
  B.quad("w", T(tx1, 0, tz1), T(tx0, 0, tz1), T(tx0, th, tz1), T(tx1, th, tz1));
  // the mouth: a short passage out to the north, open to the light at its end
  const mz0 = C4.z - D.c4a.rz - 1.9, mz1 = C4.z - D.c4a.rz + 0.3, mh = 1.7;
  F.quad("f", T(C4.x - 0.75, 0, mz1), T(C4.x + 0.75, 0, mz1), T(C4.x + 0.75, 0, mz0), T(C4.x - 0.75, 0, mz0));
  B.quad("w", T(C4.x - 0.75, mh, mz0), T(C4.x + 0.75, mh, mz0), T(C4.x + 0.75, mh, mz1), T(C4.x - 0.75, mh, mz1));
  B.quad("w", T(C4.x - 0.75, 0, mz1), T(C4.x - 0.75, 0, mz0), T(C4.x - 0.75, mh, mz0), T(C4.x - 0.75, mh, mz1));
  B.quad("w", T(C4.x + 0.75, 0, mz0), T(C4.x + 0.75, 0, mz1), T(C4.x + 0.75, mh, mz1), T(C4.x + 0.75, mh, mz0));
  const day = new THREE.Mesh(new THREE.PlaneGeometry(1.5, mh), new THREE.MeshBasicMaterial({ color: "#f2e3c4" }));
  day.position.set(C4.x, mh / 2, mz0 - 0.02); ctx.group.add(day);
  ctx.portal({ w: 1.0, h: 1.4, tint: "#fff0d0" }, C4.x, 0, mz0 + 0.25, 0);
  rubble(B, "f", C4.x - 2.2, C4.z + 1.2, 0, 0.6, 7, 43);
  const walls = finish(ctx, B, { w: marl, wa: marl, wb: marl, f: floorM }, ["f"]);
  finish(ctx, F, { f: floorM }, ["f"]);
  // each chamber's hewn shell: one continuous wrap of the stone round it (no seams where the facets turn), and
  // its facets lit as one surface
  const wa = walls.find((m) => m.name === "wa"), wb = walls.find((m) => m.name === "wb");
  wrapUVs(wa.geometry, C4.x, C4.z, D.c4a.rx, D.c4a.rz, 0, D.c4a.h * 0.6); smoothNormals(wa.geometry, 0.5);
  wrapUVs(wb.geometry, bx, C4.z + 0.3, D.c4b.rx, D.c4b.rz, 1.5 * PI, D.c4b.h * 0.6); smoothNormals(wb.geometry, 0.5);
  const sockets = holeRows(ctx, wa, { x: C4.x, z: C4.z, h: D.c4a.h });
  // the case: Aramaic fragments of Enoch
  glassCase(ctx, C4.x + 1.6, C4.z + 1.2, enochFragments().root, ctx.infoById("c4-enoch"));
  // daylight from the mouth and a little spill inside (no fittings: the caves are unlit)
  ctx.light(C4.x, 1.4, mz0 + 0.6, 0.9); ctx.light(C4.x - 0.5, 1.8, C4.z, 0.45); ctx.light(bx, 1.6, C4.z + 0.3, 0.35);
  markers(ctx, site, "s2");
  return { dispose() { marl.dispose(); floorM.dispose(); sockets.dispose(); } };
}

// ---------------------------------------------------------------- one wrap of stone round a chamber
// The kit's default UVs project each face on its dominant axis, which leaves a seam wherever two facets of a
// curved cave fall to different axes. Here u runs round the chamber (metres of arc) and v runs up the wall and
// over the dome (height plus how far the wall has come in), so the stone is continuous round the whole shell.
function wrapUVs(g, cx, cz, rx, rz, seamAt, vaultY) {
  const p = g.attributes.position, uv = g.attributes.uv, R = (rx + rz) / 2, TAU = Math.PI * 2;
  for (let t = 0; t < p.count; t += 3) {
    // above the springing of the vault the shell turns flat enough to take the stone from above, as the kit
    // does; a wrap carried on up would pinch into streaks at the crown. One join, high on the wall, remains.
    if (Math.min(p.getY(t), p.getY(t + 1), p.getY(t + 2)) >= vaultY) { for (let k = 0; k < 3; k++) uv.setXY(t + k, p.getX(t + k), p.getZ(t + k)); continue; }
    const us = [];
    for (let k = 0; k < 3; k++) {
      const i = t + k, dx = p.getX(i) - cx, dz = p.getZ(i) - cz, b = Math.atan2(dx, -dz);
      const rEll = Math.hypot(rx * Math.sin(b), rz * Math.cos(b)), r = Math.hypot(dx, dz);
      us.push((((b - seamAt) % TAU) + TAU) % TAU); uv.setY(i, p.getY(i) + Math.max(0, rEll * 1.04 - r));
    }
    // the one seam sits at `seamAt` (over the chamber's own opening); a triangle that straddles it keeps its
    // three u values on one side
    const lo = Math.min(...us);
    for (let k = 0; k < 3; k++) uv.setX(t + k, (us[k] - lo > Math.PI ? us[k] - TAU : us[k]) * R);
  }
  uv.needsUpdate = true;
}

// ---------------------------------------------------------------- the wall's facets, lit smoothly
// average each vertex's normal with the normals of the vertices at the same place whose faces meet at a
// shallow angle (cos above `minDot`), so the ring reads as one hewn surface, not a set of flat panels
function smoothNormals(g, minDot) {
  const p = g.attributes.position, n = g.attributes.normal, key = (i) => `${Math.round(p.getX(i) * 500)},${Math.round(p.getY(i) * 500)},${Math.round(p.getZ(i) * 500)}`;
  const at = new Map();
  for (let i = 0; i < p.count; i++) { const k = key(i); (at.get(k) || at.set(k, []).get(k)).push(i); }
  const out = new Float32Array(n.count * 3), a = new THREE.Vector3(), b = new THREE.Vector3(), s = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    a.fromBufferAttribute(n, i); s.set(0, 0, 0);
    for (const j of at.get(key(i))) { b.fromBufferAttribute(n, j); if (a.dot(b) >= minDot) s.add(b); }
    s.normalize(); out[i * 3] = s.x; out[i * 3 + 1] = s.y; out[i * 3 + 2] = s.z;
  }
  g.setAttribute("normal", new THREE.BufferAttribute(out, 3));
}

// ---------------------------------------------------------------- the holes, cut into the wall
// Each hole is a socket: a short tapering tube into the rock, closed at the back, darkening inward. The wall
// itself is one mesh, so the hole is opened in it by drawing order alone (no stencil, no shader tricks): the
// sockets are drawn first, then a mask (a disc a few millimetres in front of the wall, depth only, no colour),
// then everything else. The wall behind a mask fails the depth test, so the socket shows through the disc;
// anything nearer than the wall still draws over it, and outside the discs the wall covers the sockets.
function holeRows(ctx, wallMesh, o) {
  const PI = Math.PI, R = rng(4401), ray = new THREE.Raycaster(), up = new THREE.Vector3(0, 1, 0);
  const pos = [], nrm = [], col = [], masks = [];
  const tube = (W, N, axis, r, rBack, depth, oval) => {
    let P = W;
    // a frame on the socket: w along the axis into the rock (level, as a peg hole is bored), u across, v up.
    // The hewn wall leans, so a level tube centred on the wall point would stand proud of it below the hole;
    // the tube starts that far back (lead), and the mask in the wall's own plane opens onto its inside.
    const tanT = Math.abs(N.y) / Math.max(1e-3, Math.hypot(N.x, N.z)), lead = r * tanT + 0.004;
    P = new THREE.Vector3().copy(W).addScaledVector(axis, lead);
    const w = axis, u = new THREE.Vector3().crossVectors(up, w).normalize(), v = new THREE.Vector3().crossVectors(w, u);
    const seg = 12, ring = (t) => { const rr = r + (rBack - r) * t, out = []; for (let k = 0; k <= seg; k++) { const th = (k / seg) * PI * 2; out.push(new THREE.Vector3().copy(P).addScaledVector(u, Math.cos(th) * rr * oval).addScaledVector(v, Math.sin(th) * rr).addScaledVector(w, t * depth)); } return out; };
    const r0 = ring(0), r1 = ring(0.5), r2 = ring(1), shade = [0.34, 0.09, 0.025];
    const push = (pt, nn, c) => { pos.push(pt.x, pt.y, pt.z); nrm.push(nn.x, nn.y, nn.z); col.push(c, c * 0.97, c * 0.92); };
    const inward = (pt, t) => new THREE.Vector3().subVectors(P, pt).addScaledVector(w, t * depth).normalize();  // faces the axis
    const band = (A, Bv, ta, tb, ca, cb) => {
      for (let k = 0; k < seg; k++) {
        const q = [[A[k], ta, ca], [Bv[k], tb, cb], [Bv[k + 1], tb, cb], [A[k], ta, ca], [Bv[k + 1], tb, cb], [A[k + 1], ta, ca]];
        for (const [pt, t, c] of q) push(pt, inward(pt, t), c);
      }
    };
    band(r0, r1, 0, 0.5, shade[0], shade[1]); band(r1, r2, 0.5, 1, shade[1], shade[2]);
    const back = new THREE.Vector3().copy(P).addScaledVector(w, depth), bn = new THREE.Vector3().copy(w).negate();
    for (let k = 0; k < seg; k++) { push(back, bn, 0.012); push(r2[k + 1], bn, shade[2]); push(r2[k], bn, shade[2]); }
    // the mask: a disc in the wall's own plane, a few millimetres in front of it, a little wider than the mouth
    const m = new THREE.CircleGeometry(1, seg + 4); m.scale(r * oval * 1.02, r * 1.02, 1);
    const mq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), N);
    m.applyQuaternion(mq); m.translate(W.x + N.x * 0.006, W.y + N.y * 0.006, W.z + N.z * 0.006); masks.push(m);
  };
  // two rows along the south and west walls of 4a (as described); the hand that cut them did not rule them
  for (const [hf0, seed] of [[0.34, 0], [0.56, 1]]) {
    let b = PI * 0.64 + R() * 0.03;
    const drift = R() * PI * 2;
    while (b < PI * 1.58) {
      const hf = hf0 + Math.sin(b * 2.3 + drift) * 0.018 + (R() - 0.5) * 0.022;
      const step = (PI * 0.95 / 25) * (0.72 + R() * 0.56);
      const lost = R() < 0.07, broken = !lost && R() < 0.1;
      if (!lost) {
        const y = hf * o.h, dir = new THREE.Vector3(Math.sin(b), 0, -Math.cos(b)).normalize();
        ray.set(new THREE.Vector3(o.x, y, o.z), dir); ray.far = 8;
        const hit = ray.intersectObject(wallMesh, false)[0];
        if (hit) {
          const N = hit.face.normal.clone().transformDirection(wallMesh.matrixWorld);   // into the cave
          const axis = new THREE.Vector3(-N.x, 0, -N.z).normalize();                    // level, into the rock
          const r = broken ? 0.06 + R() * 0.025 : 0.034 + R() * 0.02;
          tube(hit.point, N, axis, r, r * (broken ? 0.55 : 0.78), broken ? 0.06 + R() * 0.04 : 0.09 + R() * 0.07, broken ? 1.25 + R() * 0.3 : 0.86 + R() * 0.26);
        }
      }
      b += step;
    }
  }
  // wind every triangle to face the way its normals say, so the sockets draw single-sided
  for (let t = 0; t < pos.length; t += 9) {
    const A = new THREE.Vector3(pos[t], pos[t + 1], pos[t + 2]), Bv = new THREE.Vector3(pos[t + 3], pos[t + 4], pos[t + 5]), Cv = new THREE.Vector3(pos[t + 6], pos[t + 7], pos[t + 8]);
    const gn = new THREE.Vector3().crossVectors(Bv.sub(A), Cv.sub(A)), sn = new THREE.Vector3(nrm[t] + nrm[t + 3] + nrm[t + 6], nrm[t + 1] + nrm[t + 4] + nrm[t + 7], nrm[t + 2] + nrm[t + 5] + nrm[t + 8]);
    if (gn.dot(sn) < 0) for (const arr of [pos, nrm, col]) for (let c = 0; c < 3; c++) { const x = arr[t + 3 + c]; arr[t + 3 + c] = arr[t + 6 + c]; arr[t + 6 + c] = x; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeBoundingSphere();
  const sockM = new THREE.MeshStandardMaterial({ color: "#cbb994", vertexColors: true, roughness: 0.96 });
  const sock = new THREE.Mesh(g, sockM); sock.renderOrder = -2; sock.matrixAutoUpdate = false; sock.updateMatrix();
  // merge the masks: depth only, after the sockets and before the wall
  const mg = mergeFlat(masks);
  const maskM = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, depthTest: true });
  const mask = new THREE.Mesh(mg, maskM); mask.renderOrder = -1; mask.matrixAutoUpdate = false; mask.updateMatrix();
  ctx.group.add(mask, sock);
  return { dispose() { sockM.dispose(); maskM.dispose(); } };
}
function mergeFlat(list) {
  const pos = [];
  for (const g of list) { const n = g.index ? g.toNonIndexed() : g, p = n.attributes.position; for (let i = 0; i < p.count; i++) pos.push(p.getX(i), p.getY(i), p.getZ(i)); g.dispose(); if (n !== g) n.dispose(); }
  const out = new THREE.BufferGeometry(); out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); out.computeBoundingSphere();
  return out;
}
function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
