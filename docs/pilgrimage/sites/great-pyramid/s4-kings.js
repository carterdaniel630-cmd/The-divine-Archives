/* IV · The platform above the Great Step, the antechamber with its portcullis slots, the King's Chamber and the sarcophagus. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, room, wall, V } from "../../kit.js?v=1";
import { markers, lamp, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const M = { lime: ctx.mat("limestone"), gal: ctx.mat("gallery"), granite: ctx.mat("granite"), gfloor: ctx.mat("granite", { roughness: 0.55 }), floor: ctx.mat("floor") };
  const B = new Bucket(), F = new Bucket();
  const pw2 = D.pw / 2, W2 = D.ggW / 2, y0 = D.kcFloor, lowH = D.lowH;

  // ---- the platform at the top of the gallery (roofed at the gallery's top height)
  const platH = D.ggFloor(D.ggZ1) + D.ggH - y0;
  // its north side is open to the gallery (a hole the size of the whole wall)
  room(B, { floor: "x", wall: "gal", ceil: "gal" }, -W2, W2, D.ggZ1, D.stepZ1, y0, platH, { n: [{ u0: 0, u1: D.ggW, v0: 0, v1: platH }], s: [{ u0: W2 - pw2, u1: W2 + pw2, v0: 0, v1: lowH }] }, { noFloor: true });
  F.quad("lfloor", V(-W2, y0, D.stepZ1), V(W2, y0, D.stepZ1), V(W2, y0, D.ggZ1), V(-W2, y0, D.ggZ1));

  // ---- the low passage to the antechamber
  room(B, { floor: "x", wall: "lime", ceil: "lime" }, -pw2, pw2, D.p1Z0, D.p1Z1, y0, lowH, { n: [{ u0: 0, u1: D.pw, v0: 0, v1: lowH }], s: [{ u0: 0, u1: D.pw, v0: 0, v1: lowH }] }, { noFloor: true });
  F.quad("lfloor", V(-pw2, y0, D.p1Z1), V(pw2, y0, D.p1Z1), V(pw2, y0, D.p1Z0), V(-pw2, y0, D.p1Z0));

  // ---- the antechamber: granite walls with three pairs of portcullis slots, and the granite leaf hanging in the first
  const aw2 = D.acW / 2;
  room(B, { floor: "x", wall: "granite", ceil: "lime" }, -aw2, aw2, D.acZ0, D.acZ1, y0, D.acH,
    { n: [{ u0: aw2 - pw2, u1: aw2 + pw2, v0: 0, v1: lowH }], s: [{ u0: aw2 - pw2, u1: aw2 + pw2, v0: 0, v1: lowH }] }, { noFloor: true });
  F.quad("gfl", V(-aw2, y0, D.acZ1), V(aw2, y0, D.acZ1), V(aw2, y0, D.acZ0), V(-aw2, y0, D.acZ0));
  const slotMat = new THREE.MeshBasicMaterial({ color: "#120b08" });
  for (const zz of [D.acZ0 + 0.95, D.acZ0 + 1.55, D.acZ0 + 2.15]) for (const sg of [-1, 1]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.03, D.acH - lowH - 0.05, 0.5), slotMat);
    s.position.set(sg * (aw2 - 0.012), y0 + lowH + (D.acH - lowH) / 2, zz); ctx.group.add(s);
  }
  const leaf = new THREE.BoxGeometry(D.acW - 0.02, 1.6, 0.4); leaf.translate(0, y0 + lowH + 0.8, D.acZ0 + 0.35); B.geo("granite", leaf);
  const boss = new THREE.CylinderGeometry(0.09, 0.11, 0.07, 14, 1, false, 0, Math.PI); boss.rotateX(Math.PI / 2); boss.rotateZ(Math.PI); boss.translate(-0.15, y0 + lowH + 0.9, D.acZ0 + 0.13); B.geo("granite", boss);
  // the joint between the leaf's two stones
  const seam = new THREE.Mesh(new THREE.BoxGeometry(D.acW - 0.02, 0.012, 0.41), slotMat); seam.position.set(0, y0 + lowH + 0.75, D.acZ0 + 0.35); ctx.group.add(seam);

  // ---- the passage into the King's Chamber (granite)
  room(B, { floor: "x", wall: "granite", ceil: "granite" }, -pw2, pw2, D.p2Z0, D.p2Z1, y0, lowH, { n: [{ u0: 0, u1: D.pw, v0: 0, v1: lowH }], s: [{ u0: 0, u1: D.pw, v0: 0, v1: lowH }] }, { noFloor: true });
  F.quad("gfl", V(-pw2, y0, D.p2Z1), V(pw2, y0, D.p2Z1), V(pw2, y0, D.p2Z0), V(-pw2, y0, D.p2Z0));

  // ---- the King's Chamber: red granite, 10.47 × 5.24 m, 5.84 m high, ceiling of nine granite beams
  const kx0 = D.kcX0, kx1 = D.kcX1, kz0 = D.kcZ0, kz1 = D.kcZ1, H = D.kcH, shaftX = -2.6, sh = 0.21, shY = 0.9;
  room(B, { floor: "x", wall: "granite", ceil: "x" }, kx0, kx1, kz0, kz1, y0, H,
    { n: [{ u0: D.kcEW - D.pw, u1: D.kcEW, v0: 0, v1: lowH }, { u0: shaftX - kx0 - sh / 2, u1: shaftX - kx0 + sh / 2, v0: shY, v1: shY + sh }],
      s: [{ u0: kx1 - shaftX - sh / 2, u1: kx1 - shaftX + sh / 2, v0: shY, v1: shY + sh }] }, { noFloor: true, noCeil: true });
  F.quad("gfl", V(kx0, y0, kz1), V(kx1, y0, kz1), V(kx1, y0, kz0), V(kx0, y0, kz0));
  const bw = D.kcEW / 9;
  for (let i = 0; i < 9; i++) {   // the nine ceiling beams, each a hair lower or higher than the next
    const xa = kx0 + i * bw + 0.006, xb = kx0 + (i + 1) * bw - 0.006, yc = y0 + H + ((i * 37) % 5 - 2) * 0.004;
    B.quad("granite", V(xa, yc, kz0), V(xb, yc, kz0), V(xb, yc, kz1), V(xa, yc, kz1));
  }
  const ceilShadow = new THREE.Mesh(new THREE.PlaneGeometry(D.kcEW, D.kcNS), new THREE.MeshBasicMaterial({ color: "#0a0605" }));
  ceilShadow.rotation.x = Math.PI / 2; ceilShadow.position.set((kx0 + kx1) / 2, y0 + H + 0.03, (kz0 + kz1) / 2); ctx.group.add(ceilShadow);
  // the shafts: dark mouths running back into the wall; a modern fan grille in the southern one
  for (const [z, dir] of [[kz0, -1], [kz1, 1]]) {
    const tube = new THREE.Mesh(new THREE.BoxGeometry(sh, sh, 0.9), new THREE.MeshBasicMaterial({ color: "#050302", side: THREE.BackSide }));
    tube.position.set(shaftX, y0 + shY + sh / 2, z + dir * 0.45); ctx.group.add(tube);
  }
  const grille = new THREE.Mesh(new THREE.PlaneGeometry(sh, sh), new THREE.MeshStandardMaterial({ color: "#5d5a55", metalness: 0.7, roughness: 0.4, wireframe: true }));
  grille.position.set(shaftX, y0 + shY + sh / 2, kz1 - 0.02); grille.rotation.y = Math.PI; ctx.group.add(grille);

  // ---- the sarcophagus (Petrie's outside and inside measures); lidless, one corner broken away
  const C = D.coffer, cx = D.cofferX, cz = D.cofferZ, t = (C.W - C.iW) / 2, te = (C.L - C.iL) / 2, base = C.H - C.iH;
  const cof = new Bucket();
  const box = (x0, x1, ya, yb, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, yb - ya, z1 - z0); g.translate((x0 + x1) / 2, (ya + yb) / 2, (z0 + z1) / 2); cof.geo("cg", g); };
  const X0 = cx - C.W / 2, X1 = cx + C.W / 2, Z0 = cz - C.L / 2, Z1 = cz + C.L / 2, Y1 = y0 + C.H;
  box(X0, X1, y0, y0 + base, Z0, Z1);                                    // floor of the box
  box(X0, X0 + t, y0 + base, Y1, Z0, Z1);                                // west side
  box(X1 - t, X1, y0 + base, Y1, Z0, Z1 - 0.32);                         // east side, short of the broken corner
  box(X1 - t, X1, y0 + base, Y1 - 0.26, Z1 - 0.32, Z1);                  // the broken south-east corner, lower
  box(X0 + t, X1 - t, y0 + base, Y1, Z0, Z0 + te);                       // north end
  box(X0 + t, X1 - 0.3, y0 + base, Y1, Z1 - te, Z1);                     // south end, also broken at the east
  box(X1 - 0.3, X1 - t, y0 + base, Y1 - 0.26, Z1 - te, Z1);
  const cmeshes = cof.build({ cg: ctx.mat("granite", { roughness: 0.38 }) }, ctx.group);
  cmeshes.forEach((mm) => { mm.userData.wall = true; });
  const hit = new THREE.Mesh(new THREE.BoxGeometry(C.W + 0.1, C.H + 0.3, C.L + 0.1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.position.set(cx, y0 + C.H / 2, cz); ctx.group.add(hit); ctx.hit(hit, ctx.infoById("coffer"));

  // lamps: the platform, the antechamber, the chamber (the real chamber is lit electrically)
  lamp(ctx, W2 - 0.04, y0 + 1.8, D.ggZ1 + 0.8, 0.6, -1, 0);
  lamp(ctx, aw2 - 0.03, y0 + 2.6, D.acZ0 + 1.8, 0.5, -1, 0);
  lamp(ctx, kx1 - 0.05, y0 + 2.9, (kz0 + kz1) / 2, 0.9, -1, 0);
  lamp(ctx, kx0 + 0.05, y0 + 2.9, (kz0 + kz1) / 2, 0.9, 1, 0);
  lamp(ctx, (kx0 + kx1) / 2, y0 + 2.9, kz1 - 0.05, 0.8, 0, -1);

  finish(ctx, F, { lfloor: M.floor, gfl: M.gfloor }, ["lfloor", "gfl"]);
  finish(ctx, B, { gal: M.gal, lime: M.lime, granite: M.granite }, []);
  markers(ctx, site, "s4");
}
