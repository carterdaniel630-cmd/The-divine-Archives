/* I · The road by the gate: the ground on the quarry's rim, the road along its east side, the three empty
   crosses on a low rise (no figures, nails or instruments), the Second Wall with its gate, Herod's three
   towers on the skyline, a low city behind the wall, and the Temple far to the east. All placed by estimate
   (dims.js); the towers and the Temple are sized from Josephus. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

function rng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

export function build(ctx) {
  const R5 = D.rim, cu = D.cubit, Q = D.q;
  const ground = ctx.mat("turf", { color: new THREE.Color("#c9c08f") });
  const road = ctx.mat("rock", { color: new THREE.Color("#d9c7a2") });
  const wallM = ctx.mat("core", { color: new THREE.Color("#fff4e2") });
  const towerM = ctx.mat("limestone", { color: new THREE.Color("#efe3c8") });
  const houseM = ctx.mat("block", { color: new THREE.Color("#e6d8b8") });
  const rockM = ctx.mat("block", { color: new THREE.Color("#fbf3e2") });
  const wood = new THREE.MeshStandardMaterial({ color: "#6e5d49", roughness: 1 });
  const gold = new THREE.MeshStandardMaterial({ color: "#d8b45a", roughness: 0.35, metalness: 0.8 });
  const white = new THREE.MeshStandardMaterial({ color: "#f4f1e8", roughness: 0.6 });
  const G = new Bucket(), Rd = new Bucket(), W = new Bucket(), T = new Bucket(), Hs = new Bucket(), Rk = new Bucket();
  // the ground on the rim, round the hole of the quarry (and the ramp, and the tomb's forecourt)
  const hx0 = D.tomb.x - 0.5, hx1 = D.ramp.x1, hz0 = Q.z0, hz1 = Q.z1, far = 700;
  const flat = (x0, z0, x1, z1) => G.quad("g", V(x0, R5, z1), V(x1, R5, z1), V(x1, R5, z0), V(x0, R5, z0));
  flat(-far, -far, far, hz0); flat(-far, hz1, far, far); flat(-far, hz0, hx0, hz1); flat(hx1, hz0, far, hz1);
  // between the forecourt and the quarry's north-west corner the rim is rock, not hole
  flat(hx0, hz0, Q.x0, D.tomb.z - D.fore.w / 2); flat(hx0, D.tomb.z + D.fore.w / 2, Q.x0, hz1);
  finish(ctx, G, { g: ground }, ["g"]);
  // the road: packed earth along the rim, through the gate
  Rd.quad("r", V(D.road.x0, R5 + 0.02, D.wall2.z + 30), V(D.road.x1, R5 + 0.02, D.wall2.z + 30), V(D.road.x1, R5 + 0.02, D.road.z0 - 120), V(D.road.x0, R5 + 0.02, D.road.z0 - 120));
  finish(ctx, Rd, { r: road }, ["r"]);
  // the Second Wall, east–west, with a gate and two gate towers where the road passes
  const wz = D.wall2.z, wh = D.wall2.h, gx0 = D.gate.x - D.gate.w / 2, gx1 = D.gate.x + D.gate.w / 2;
  const box = (B, k, x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(k, g); };
  box(W, "w", -260, gx0, R5, R5 + wh, wz, wz + D.wall2.t);
  box(W, "w", gx1, 260, R5, R5 + wh, wz, wz + D.wall2.t);
  box(W, "w", gx0, gx1, R5 + D.gate.h, R5 + wh, wz, wz + D.wall2.t);                   // over the gateway
  box(W, "w", gx0 - 7, gx0, R5, R5 + wh + 4, wz - 2, wz + D.wall2.t + 1);               // gate towers
  box(W, "w", gx1, gx1 + 7, R5, R5 + wh + 4, wz - 2, wz + D.wall2.t + 1);
  // crenellations along the top, every 3 m
  for (let x = -258; x < 258; x += 3) if (x < gx0 - 7 || x > gx1 + 7) box(W, "w", x, x + 1.5, R5 + wh, R5 + wh + 1.0, wz, wz + 0.8);
  finish(ctx, W, { w: wallM }, []);
  // the dark of the gateway, and the way back (a portal just inside it)
  const dark = new THREE.Mesh(new THREE.PlaneGeometry(D.gate.w, D.gate.h), new THREE.MeshBasicMaterial({ color: "#2b2117" }));
  dark.position.set(D.gate.x, R5 + D.gate.h / 2, wz + D.wall2.t + 0.05); dark.rotation.y = Math.PI; ctx.group.add(dark);
  ctx.portal({ w: 1.8, h: 2.4, tint: "#ffe2b0" }, D.gate.x, R5, D.road.z1 + 0.6, Math.PI);
  sign(ctx, ["The Vestibule", "and back to the museum"], D.gate.x, R5 + 3.1, D.road.z1 + 0.7, Math.PI, 2.0, 0.48, { size: 54 });
  // the city beyond the wall: low flat-roofed houses, climbing to the west (a backdrop)
  const R = rng(17);
  for (let i = 0; i < 260; i++) {
    const x = -250 + R() * 560, z = wz + 8 + R() * 260, w = 6 + R() * 10, d = 6 + R() * 10, h = 4 + R() * 6, y = R5 + (z - wz) * 0.04 + (x < 0 ? -x * 0.02 : 0);
    if (Math.abs(x - D.gate.x) < 12 && z < wz + 30) continue;
    box(Hs, "h", x, x + w, y - 3, y + h, z, z + d);
  }
  // Herod's three towers, sized from Josephus (cubits), with a palace wall between them; above the stated height, reconstruction
  for (const t of D.towers) {
    const b = t.b * cu, h = t.h * cu, y0 = R5 + D.towerBase;
    box(T, "t", t.x - b / 2, t.x + b / 2, y0 - 6, y0 + h, t.z - b / 2, t.z + b / 2);
    for (let k = -b / 2; k < b / 2 - 1; k += 2.5) { box(T, "t", t.x + k, t.x + k + 1.2, y0 + h, y0 + h + 1.4, t.z - b / 2, t.z - b / 2 + 0.8); box(T, "t", t.x + k, t.x + k + 1.2, y0 + h, y0 + h + 1.4, t.z + b / 2 - 0.8, t.z + b / 2); }
  }
  box(T, "t", D.towers[0].x, D.towers[2].x, R5, R5 + D.towerBase + 12, D.towers[1].z - 3, D.towers[1].z + 3);
  finish(ctx, T, { t: towerM }, []);
  finish(ctx, Hs, { h: houseM }, []);
  // the Temple far to the east: the platform and the white sanctuary; its gilded front faces east, away from here (TEXT: Josephus)
  const tp = D.temple, tw = tp.w * cu, th = tp.h * cu;
  const plat = new THREE.Mesh(new THREE.BoxGeometry(280, tp.plat, 420), white); plat.position.set(tp.x + 100, tp.plat / 2 - 6, tp.z); ctx.group.add(plat);
  const sanct = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.6, th, tw), white); sanct.position.set(tp.x + 40, tp.plat - 6 + th / 2, tp.z); ctx.group.add(sanct);
  const face = new THREE.Mesh(new THREE.BoxGeometry(2, th, tw), gold); face.position.set(tp.x + 40 + tw * 0.3 + 1, tp.plat - 6 + th / 2, tp.z); ctx.group.add(face);
  // the hills round the city: a low ring
  const hills = new Bucket();
  for (let i = 0; i < 64; i++) {
    const a0 = i / 64 * Math.PI * 2, a1 = (i + 1) / 64 * Math.PI * 2, r0 = 500, r1 = 900, h0 = 18 + 14 * Math.sin(i * 1.7), h1 = 18 + 14 * Math.sin((i + 1) * 1.7);
    const p = (r, a, y) => V(Math.cos(a) * r + 150, y, Math.sin(a) * r + 60);
    hills.quad("h", p(r0, a0, R5), p(r0, a1, R5), p(r1, a1, R5 + h1 + 30), p(r1, a0, R5 + h0 + 30));
  }
  finish(ctx, hills, { h: ctx.mat("turf", { color: new THREE.Color("#aab082") }) }, []);
  // the low rise by the road, and the three crosses: bare timber, wedged with stones; no figures (brief, section 6)
  const rise = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 8, 0.6, 18), rockM); rise.position.set(D.crosses[1].x, R5 + 0.3 - 0.29, D.crosses[1].z - 1); rise.scale.set(1, 1, 0.75); ctx.group.add(rise);
  const C = D.cross;
  for (const [k, c] of D.crosses.entries()) {
    const g = new THREE.Group(); g.position.set(c.x, R5, c.z); g.rotation.y = (k - 1) * 0.08;
    const up = new THREE.Mesh(new THREE.BoxGeometry(C.s, C.h, C.s * 0.9), wood); up.position.y = C.h / 2; g.add(up);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(C.bar, C.s * 0.85, C.s * 0.8), wood); bar.position.set(0, C.at, 0.02); g.add(bar);
    const rope = new THREE.Mesh(new THREE.TorusGeometry(C.s * 0.62, 0.012, 4, 10), new THREE.MeshStandardMaterial({ color: "#8a7a5c", roughness: 1 })); rope.position.set(0, C.at, 0); rope.rotation.z = Math.PI / 4; g.add(rope);
    ctx.group.add(g);
    for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2; stone(Rk, "k", { x: c.x + Math.cos(a) * 0.32, z: c.z + Math.sin(a) * 0.32, w: 0.35, d: 0.3, h: 0.28, yaw: a * 57.3, taper: 0.3, rough: 0.05, seed: 40 + k * 7 + j }); }
    // a hit box so the crosses open their note
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3, 0.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.position.set(c.x, R5 + 1.5, c.z); ctx.group.add(hit); ctx.hit(hit, ctx.infoById("crosses"));
  }
  for (const [x, z] of [[24.6, 40], [44, 20], [46, 40], [22, 8]]) stone(Rk, "k", { x, z, w: 1.4, d: 1.1, h: 0.7, fall: true, yaw: x * 13, taper: 0.2, rough: 0.12, seed: Math.round(x * z) });
  Rk.parts.k && finish(ctx, Rk, { k: rockM }, []);
  void stone; void sign;
  markers(ctx, site, "s1");
}
