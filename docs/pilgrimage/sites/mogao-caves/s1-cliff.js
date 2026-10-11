/* I · The cliff: the ground in front of the caves, the face of the cliff with its doorways and the modern
   walkways on three tiers, the gravel plateau and dunes above it, the nine-storey building (outside), the stair
   up to the middle tier, poplars along the old river bed, and the desert round about. The ground, the cliff and
   the building are built here for the three sections that share them. Placings APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad } from "./paint.js?v=1";
import { Bucket, V, wall } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const CL = D.cliff, P96 = D.pav, C96 = D.c96, C16 = D.c16, C254 = D.c254, ST = D.stair, W2 = D.walk2, G = D.ground;
const UP = V(0, 1, 0), E = V(1, 0, 0);
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

// the plateau above the cliff: flat gravel near the edge, then the dunes of the Mingsha Shan to the west
function plateauY(x, z) {
  const d = -x;                                        // distance back from the edge
  if (d < 30) return CL.h;
  const k = Math.min(1, (d - 30) / 120);
  return CL.h + k * (14 + 10 * Math.sin(z / 47 + x / 83) + 7 * Math.sin(z / 19 - x / 29));
}
// the desert east of the ground: the dry bed of the river and the gravel plain, rising to low hills far off
function plainY(x, z) {
  if (x < 60) return -0.05;
  if (x < 900) return -0.05 - Math.min(1.5, (x - 60) / 40);
  return -1.55 + (x - 900) * 0.08;
}
// the doorways of the caves: dark openings along each tier, irregularly spaced, kept clear of the parts built
function doorways(B, key) {
  const R = rng(17), keep = [[P96.z0 - 1.5, P96.z1 + 1.5, -1, 99], [C16.z - 3, C16.z + 3, -1, 2], [C254.pillar.z - 3, C254.pillar.z + 3, 8, 10]];
  for (const [ti, y] of [0, D.tiers[1], D.tiers[2], D.tiers[3]].entries()) {
    let z = CL.z0 + 8 + R() * 6;
    while (z < CL.z1 - 8) {
      const w = 1.0 + R() * 0.8, h = ti === 0 ? 2.2 + R() * 0.8 : 1.8 + R() * 0.7;
      if (!keep.some(([a, b, y0, y1]) => z + w > a && z - w < b && y >= y0 && y <= y1))
        oquad(B, key, V(0.04, y, z - w / 2), V(0.04, y, z + w / 2), V(0.04, y + h, z + w / 2), V(0.04, y + h, z - w / 2), E);
      z += w + 3 + R() * 7;
    }
  }
}
// a walkway along the cliff at height y: a concrete slab, its face, and a low parapet with a rail
function walkway(B, z0, z1, y, out) {
  box(B, "cc", 0, out, y - 0.35, y, z0, z1);
  box(B, "cc", out - 0.14, out, y, y + 0.55, z0, z1);
  box(B, "rl", out - 0.1, out - 0.04, y + 0.95, y + 1.0, z0, z1);
  for (let z = z0 + 0.1; z < z1; z += 2.4) box(B, "rl", out - 0.1, out - 0.04, y + 0.55, y + 0.95, z, z + 0.06);
}
// a poplar: a slim trunk and a tall narrow crown
function poplar(B, x, z, h, R) {
  const t = new THREE.CylinderGeometry(0.12, 0.2, h * 0.4, 5); t.translate(x, h * 0.2 - 0.1, z); B.geo("tr", t);
  const c = new THREE.ConeGeometry(h * (0.13 + R() * 0.05), h * 0.8, 6, 1); c.translate(x, h * 0.58, z); B.geo("lf", c);
}

export function build(ctx) {
  const cliffM = ctx.mat("rock", { color: new THREE.Color("#b59c77") });
  const groundM = ctx.mat("rock", { color: new THREE.Color("#c2ab86") });
  const sandM = ctx.mat("rock", { color: new THREE.Color("#d4b98d") });
  const concM = ctx.mat("limestone", { color: new THREE.Color("#b3aa99") });
  const far = new THREE.MeshStandardMaterial({ color: "#b9a37f", roughness: 1, side: THREE.DoubleSide });
  const dark = new THREE.MeshBasicMaterial({ color: "#1d1712", side: THREE.DoubleSide });
  const railM = new THREE.MeshStandardMaterial({ color: "#4a443d", roughness: 0.6, metalness: 0.4 });
  const redM = new THREE.MeshStandardMaterial({ color: "#9a3326", roughness: 0.85, side: THREE.DoubleSide });
  const tileM = new THREE.MeshStandardMaterial({ color: "#4c4b47", roughness: 0.8, side: THREE.DoubleSide });
  const postM = new THREE.MeshStandardMaterial({ color: "#7d2a1f", roughness: 0.8 });
  const trunkM = new THREE.MeshStandardMaterial({ color: "#6e6050", roughness: 1 });
  const leafM = new THREE.MeshStandardMaterial({ color: "#6d8150", roughness: 1, flatShading: true });
  const Cl = new Bucket(), Gr = new Bucket(), Fa = new Bucket(), Dk = new Bucket(), Cc = new Bucket(), Pv = new Bucket(), Tr = new Bucket();

  // ---- the face of the cliff, with openings for Cave 96 (behind the building), Cave 16's corridor and Cave 254
  const u = (z) => CL.z1 - z;                                // the wall runs north from z1, so u counts from the south end
  wall(Cl, "c", 0, CL.z1, 0, CL.z0, 0, CL.h, [
    { u0: u(C96.z1), u1: u(C96.z0), v0: 0, v1: C96.h },
    { u0: u(C16.z + C16.corrW / 2), u1: u(C16.z - C16.corrW / 2), v0: 0, v1: C16.corrH },
    { u0: u(C254.pillar.z + 0.9), u1: u(C254.pillar.z - 0.9), v0: C254.y, v1: C254.y + 2.4 }]);
  // a slight overhang along the top and the foot of fallen gravel, so the face is not a flat sheet
  oquad(Cl, "c", V(0, CL.h, CL.z0), V(0, CL.h, CL.z1), V(1.2, CL.h - 2.5, CL.z1), V(1.2, CL.h - 2.5, CL.z0), V(1, -1, 0));
  oquad(Cl, "c", V(0, CL.h - 3.2, CL.z0), V(0, CL.h - 3.2, CL.z1), V(1.2, CL.h - 2.5, CL.z1), V(1.2, CL.h - 2.5, CL.z0), V(1, -1, 0));
  // the plateau and dunes, a coarse grid back from the edge
  const xs = [-1200, -600, -300, -150, -60, -30, 0], zs = []; for (let z = -1200; z <= 1200; z += 60) zs.push(z);
  for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i], xb = xs[i + 1], za = zs[j], zb = zs[j + 1];
    oquad(Gr, "s", V(xa, plateauY(xa, za), za), V(xb, plateauY(xb, za), za), V(xb, plateauY(xb, zb), zb), V(xa, plateauY(xa, zb), zb), UP);
  }
  // the ground in front of the cliff (walkable) and the plain beyond it
  oquad(Gr, "g", V(0, 0, G.z0), V(G.x1, 0, G.z0), V(G.x1, 0, G.z1), V(0, 0, G.z1), UP);
  const px = [0, G.x1, 60, 200, 500, 900, 1500, 2600], pz = [-2600, -1200, -600, G.z0, G.z1, 600, 1200, 2600];
  for (let j = 0; j < pz.length - 1; j++) for (let i = 0; i < px.length - 1; i++) {
    const xa = px[i], xb = px[i + 1], za = pz[j], zb = pz[j + 1];
    if (xa === 0 && za === G.z0) continue;                   // the walkable ground is there
    oquad(Fa, "f", V(xa, plainY(xa, za), za), V(xb, plainY(xb, za), za), V(xb, plainY(xb, zb), zb), V(xa, plainY(xa, zb), zb), UP);
  }
  // the cliff beyond the plain to north and south fades into fog; below the cliff, behind x = 0, nothing is seen
  doorways(Dk, "d");

  // ---- the modern walkways on the three upper tiers, and the stair to the middle one
  for (const y of [D.tiers[1], D.tiers[2], D.tiers[3]]) {
    const runs = y === D.tiers[1] ? [[CL.z0 + 40, P96.z0 - 0.5], [P96.z1 + 0.5, W2.z0], [W2.z1, CL.z1 - 40]] : [[CL.z0 + 60, P96.z0 - 0.5], [P96.z1 + 0.5, CL.z1 - 60]];
    for (const [a, b] of runs) walkway(Cc, a, b, y, 2.2);
  }
  // the walkway this walk uses (wider, walkable) and its stair: steps rising south from the ground
  box(Cc, "cc", 0, W2.x1, W2.y - 0.35, W2.y, W2.z0, W2.z1);
  box(Cc, "cc", W2.x1 - 0.14, W2.x1, W2.y, W2.y + 0.55, ST.z1, W2.z1);
  box(Cc, "rl", W2.x1 - 0.1, W2.x1 - 0.04, W2.y + 0.95, W2.y + 1.0, ST.z1, W2.z1);
  for (let z = ST.z1; z < W2.z1; z += 2.4) box(Cc, "rl", W2.x1 - 0.1, W2.x1 - 0.04, W2.y + 0.55, W2.y + 0.95, z, z + 0.06);
  const n = 40, run = (ST.z1 - ST.z0) / n, rise = (ST.y1 - ST.y) / n;
  for (let k = 0; k < n; k++) box(Cc, "st", ST.x0, ST.x1, ST.y + k * rise - 0.12, ST.y + (k + 1) * rise, ST.z0 + k * run, ST.z0 + (k + 1) * run);
  for (const x of [ST.x0 - 0.15, ST.x1]) {                    // the stair's side walls, stepped
    for (let k = 0; k < n; k += 4) box(Cc, "cc", x, x + 0.15, 0, ST.y + (k + 4) * rise + 0.5, ST.z0 + k * run, ST.z0 + (k + 4) * run);
  }
  // under the walkway, plain concrete facing down to the ground (the modern revetment)
  oquad(Cc, "cc", V(0.3, 0, W2.z0), V(0.3, 0, W2.z1), V(0.3, W2.y - 0.35, W2.z1), V(0.3, W2.y - 0.35, W2.z0), E);

  // ---- the nine-storey building: red walls and grey eaves, set back a little at each storey, a door in front
  const sh = P96.h / P96.storeys, door = { z0: -1.3, z1: 1.3, h: 3.6 };
  for (let k = 0; k < P96.storeys; k++) {
    const y0 = k * sh, y1 = y0 + sh, xf = P96.x1 - k * 0.35, zi = k * 0.25, z0 = P96.z0 + zi, z1 = P96.z1 - zi;
    // the front wall (u runs north to south as seen from outside), with the door on the ground storey
    const holes = k === 0 ? [{ u0: door.z0 - z0, u1: door.z1 - z0, v0: 0, v1: door.h }] : [];
    wall(Pv, "r", xf, z0, xf, z1, y0, sh, holes);
    wall(Pv, "r", P96.x0, z0, xf, z0, y0, sh); wall(Pv, "r", xf, z1, P96.x0, z1, y0, sh);
    // red posts along the front, and the eave: a tiled slope out over the storey below
    for (let i = 0; i <= 6; i++) { const z = z0 + (z1 - z0) * i / 6; box(Pv, "p", xf - 0.05, xf + 0.35, y0, y1 - 0.3, z - 0.2, z + 0.2); }
    const ey = y1 - 0.3, out = k === P96.storeys - 1 ? 2.6 : 1.8;
    oquad(Pv, "t", V(xf, ey + 0.9, z0 - 0.2), V(xf, ey + 0.9, z1 + 0.2), V(xf + out, ey, z1 + out * 0.7), V(xf + out, ey, z0 - out * 0.7), UP);
    oquad(Pv, "t", V(xf, ey + 0.9, z0 - 0.2), V(xf + out, ey, z0 - out * 0.7), V(P96.x0, ey, z0 - out * 0.7), V(P96.x0, ey + 0.9, z0 - 0.2), V(0, 1, -1));
    oquad(Pv, "t", V(xf, ey + 0.9, z1 + 0.2), V(xf + out, ey, z1 + out * 0.7), V(P96.x0, ey, z1 + out * 0.7), V(P96.x0, ey + 0.9, z1 + 0.2), V(0, 1, 1));
    // the lattice of the window band: a dark strip on each upper storey
    if (k > 0) oquad(Dk, "d", V(xf + 0.03, y0 + 1.3, -3.6), V(xf + 0.03, y0 + 1.3, 3.6), V(xf + 0.03, y0 + 3.2, 3.6), V(xf + 0.03, y0 + 3.2, -3.6), E);
  }
  // the top roof: a hipped roof to a short ridge, its back against the cliff
  const yt = P96.h, xt = P96.x1 - (P96.storeys - 1) * 0.35, zt0 = P96.z0 + 2, zt1 = P96.z1 - 2;
  oquad(Pv, "t", V(xt + 2.6, yt - 0.3, zt0 - 2), V(xt + 2.6, yt - 0.3, zt1 + 2), V(xt - 4, yt + 4, zt1 - 4), V(xt - 4, yt + 4, zt0 + 4), V(1, 1, 0));
  oquad(Pv, "t", V(xt + 2.6, yt - 0.3, zt0 - 2), V(xt - 4, yt + 4, zt0 + 4), V(P96.x0 - 0.5, yt + 4, zt0 + 4), V(P96.x0 - 0.5, yt - 0.3, zt0 - 2), V(0, 1, -1));
  oquad(Pv, "t", V(xt + 2.6, yt - 0.3, zt1 + 2), V(xt - 4, yt + 4, zt1 - 4), V(P96.x0 - 0.5, yt + 4, zt1 - 4), V(P96.x0 - 0.5, yt - 0.3, zt1 + 2), V(0, 1, 1));
  oquad(Pv, "t", V(xt - 4, yt + 4, zt0 + 4), V(xt - 4, yt + 4, zt1 - 4), V(P96.x0 - 0.5, yt + 4, zt1 - 4), V(P96.x0 - 0.5, yt + 4, zt0 + 4), UP);
  // the door frame
  box(Pv, "p", P96.x1 - 0.1, P96.x1 + 0.3, 0, door.h + 0.4, door.z0 - 0.4, door.z0);
  box(Pv, "p", P96.x1 - 0.1, P96.x1 + 0.3, 0, door.h + 0.4, door.z1, door.z1 + 0.4);
  box(Pv, "p", P96.x1 - 0.1, P96.x1 + 0.3, door.h, door.h + 0.4, door.z0, door.z1);

  // ---- the modern door frames of Cave 16 and Cave 254
  const frame = (z, y, h) => { box(Cc, "cc", -0.1, 0.25, y, y + h + 0.3, z - 1.6, z - 1.3); box(Cc, "cc", -0.1, 0.25, y, y + h + 0.3, z + 1.3, z + 1.6); box(Cc, "cc", -0.1, 0.25, y + h, y + h + 0.3, z - 1.3, z + 1.3); };
  frame(C16.z, 0, C16.corrH); frame(C254.pillar.z, C254.y, 2.4);

  // ---- poplars along the old river bed, east of the ground and beyond it
  const R = rng(29);
  for (let i = 0; i < 150; i++) {
    const z = G.z0 - 40 + R() * (G.z1 - G.z0 + 80), x = i < 70 ? 38.5 + R() * 5 : 46 + R() * 34, h = 9 + R() * 8;
    if (x < 44 && Math.abs(z + 41) < 5) continue;            // keep the portal clear
    poplar(Tr, x, z, h, R);
  }

  finish(ctx, Cl, { c: cliffM }, []);
  finish(ctx, Gr, { g: groundM, s: sandM }, ["g"]);
  finish(ctx, Fa, { f: far }, []);
  finish(ctx, Dk, { d: dark }, []);
  finish(ctx, Cc, { cc: concM, st: concM, rl: railM }, ["st"]);
  finish(ctx, Pv, { r: redM, t: tileM, p: postM }, []);
  finish(ctx, Tr, { tr: trunkM, lf: leafM }, []);

  // ---- signs and the way back
  sign(ctx, ["The Mogao Caves", "Dunhuang · fourth to fourteenth centuries"], 26, 2.6, -59, -2.8, 2.8, 0.66);
  sign(ctx, ["Cave 16 · the Library Cave"], 0.3, C16.corrH + 0.95, C16.z, Math.PI / 2, 2.4, 0.5, { size: 60 });
  sign(ctx, ["Cave 96 · the great Buddha"], P96.x1 + 0.35, door.h + 1.0, 0, Math.PI / 2, 2.6, 0.55, { size: 60 });
  sign(ctx, ["Cave 254", "up the stair to the middle tier"], ST.x1 + 0.4, 2.2, ST.z0 + 1.2, Math.PI / 2, 2.0, 0.5, { size: 56 });
  sign(ctx, ["Cave 254 · Northern Wei"], 0.3, C254.y + 2.95, C254.pillar.z, Math.PI / 2, 2.2, 0.45, { size: 60 });
  sign(ctx, ["Back to the Vestibule"], 40.1, 2.9, -42.3, -Math.PI / 2, 1.6, 0.36, { size: 56 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#fff0d8" }, 40.1, 0, -41, -Math.PI / 2);
  markers(ctx, site, "s1");
}
