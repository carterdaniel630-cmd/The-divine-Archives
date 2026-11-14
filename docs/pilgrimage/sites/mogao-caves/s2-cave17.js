/* II · The Library Cave: the corridor of Cave 16, the small room of Cave 17 opening off its north wall (the clay
   portrait of Hongbian on its platform, the twin-tree painting behind him, the stele of 851 on the west wall),
   and the hall of Cave 16 with its central platform. A toggle shows Cave 17 as found in 1900, filled with
   bundles and without the statue, which then stood elsewhere. Sizes APPROX; paintings our own (paint.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, panel, funnel, seated, standing, thousandMat, plasterMat, treesMural, steleTex } from "./paint.js?v=1";
import { Bucket, V, wall, room } from "../../kit.js?v=1";
import { markers, sign, lamp, finish } from "../../parts.js?v=1";

const C16 = D.c16, C17 = D.c17, PI = Math.PI;
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export function build(ctx) {
  const floorM = ctx.mat("floor", { color: new THREE.Color("#8f7c63") });
  const rockM = ctx.mat("rock", { color: new THREE.Color("#9d8667") });
  const corrM = thousandMat(true), hallM = thousandMat(false);
  const plaster = plasterMat("#c9b48e"), ceilM = plasterMat("#b39b75");
  const clay = { robe: "ro", skin: "sk", robe2: "pl" };
  const B = new Bucket(), F = new Bucket(), H = new Bucket();
  const zN = C16.z - C16.corrW / 2, zS = C16.z + C16.corrW / 2;

  // ---- the corridor: floor, ceiling, painted walls; the door of Cave 17 in the north wall
  oquad(F, "f", V(C16.corrX0, 0, zN), V(0.4, 0, zN), V(0.4, 0, zS), V(C16.corrX0, 0, zS), V(0, 1, 0));
  oquad(B, "ce", V(C16.corrX0, C16.corrH, zN), V(0, C16.corrH, zN), V(0, C16.corrH, zS), V(C16.corrX0, C16.corrH, zS), V(0, -1, 0));
  wall(B, "cw", C16.corrX0, zN, 0, zN, 0, C16.corrH, [{ u0: C17.door.x0 - C16.corrX0, u1: C17.door.x1 - C16.corrX0, v0: 0, v1: C17.door.h }]);
  wall(B, "cw", 0, zS, C16.corrX0, zS, 0, C16.corrH);
  // the doorway through to Cave 17: its sides and lintel in the thickness of the rock
  for (const x of [C17.door.x0, C17.door.x1]) oquad(B, "rk", V(x, 0, C17.z1), V(x, 0, zN), V(x, C17.door.h, zN), V(x, C17.door.h, C17.z1), V(x === C17.door.x0 ? 1 : -1, 0, 0));
  oquad(B, "rk", V(C17.door.x0, C17.door.h, C17.z1), V(C17.door.x1, C17.door.h, C17.z1), V(C17.door.x1, C17.door.h, zN), V(C17.door.x0, C17.door.h, zN), V(0, -1, 0));
  oquad(F, "f", V(C17.door.x0, 0, C17.z1), V(C17.door.x1, 0, C17.z1), V(C17.door.x1, 0, zN), V(C17.door.x0, 0, zN), V(0, 1, 0));

  // ---- Cave 17: a small square room with an upturned-funnel ceiling, a low platform along the north wall
  const wH = C17.h - 0.5;
  room(B, { floor: "pw", wall: "pw", ceil: "pw" }, C17.x0, C17.x1, C17.z0, C17.z1, 0, wH,
    { s: [{ u0: C17.x1 - C17.door.x1, u1: C17.x1 - C17.door.x0, v0: 0, v1: C17.door.h }] }, { noFloor: true, noCeil: true });
  oquad(F, "f", V(C17.x0, 0, C17.z0), V(C17.x1, 0, C17.z0), V(C17.x1, 0, C17.z1), V(C17.x0, 0, C17.z1), V(0, 1, 0));
  funnel(B, "ce", C17.x0, C17.x1, C17.z0, C17.z1, wH, C17.h + 0.4, 0.55);
  const plat = { z1: C17.z0 + 1.15, h: 0.45 };
  box(B, "pl", C17.x0 + 0.02, C17.x1 - 0.02, 0, plat.h, C17.z0 + 0.02, plat.z1);
  const cx = (C17.x0 + C17.x1) / 2;
  panel(ctx, treesMural(), C17.x1 - C17.x0 - 0.12, 1.85, cx, plat.h + 0.15 + 0.92, C17.z0 + 0.03, PI);
  panel(ctx, steleTex(), C17.stele.w, C17.stele.h, C17.x0 + 0.04, 0.35 + C17.stele.h / 2, (C17.z0 + C17.z1) / 2 + 0.55, PI / 2);
  box(B, "rk", C17.x0 + 0.01, C17.x0 + 0.05, 0.3, 0.4 + C17.stele.h, (C17.z0 + C17.z1) / 2 + 0.55 - C17.stele.w / 2 - 0.05, (C17.z0 + C17.z1) / 2 + 0.55 + C17.stele.w / 2 + 0.05);

  // the clay portrait of Hongbian, seated on the platform facing the door (today's arrangement)
  const statue = new THREE.Group(), SB = new Bucket();
  seated(SB, clay, cx, plat.h, C17.z0 + 0.58, 1.15, PI, { bare: true });
  SB.build({ ro: new THREE.MeshStandardMaterial({ color: "#7c4f3a", roughness: 0.9 }), sk: new THREE.MeshStandardMaterial({ color: "#c8a47e", roughness: 0.85 }), pl: ctx.mat("rock", { color: new THREE.Color("#a99474") }) }, statue);
  // the room as found in 1900: bundles of manuscripts and paintings piled high (a simple stand-in)
  const bundles = new THREE.Group(), BB = new Bucket(), R = rng(41);
  for (let y = 0; y < 2.5; y += 0.27) for (let x = C17.x0 + 0.08; x < C17.x1 - 0.3; x += 0.36) for (let z = C17.z0 + 0.06; z < C17.z1 - 1.0 - (y > 1.6 ? 0.3 : 0); z += 0.31) {
    const w = 0.28 + R() * 0.07, d = 0.24 + R() * 0.06, k = R() < 0.55 ? "b1" : R() < 0.6 ? "b2" : "b3";
    if (k === "b3") { const c = new THREE.CylinderGeometry(0.06, 0.06, w, 7); c.rotateZ(PI / 2); for (const dz of [-0.07, 0.07]) { const cc = c.clone(); cc.translate(x + w / 2, y + 0.07, z + d / 2 + dz); BB.geo(k, cc); } continue; }
    box(BB, k, x, x + w, y, y + 0.24 + R() * 0.02, z, z + d);
  }
  BB.build({ b1: new THREE.MeshStandardMaterial({ color: "#b49c74", roughness: 1 }), b2: new THREE.MeshStandardMaterial({ color: "#8b6a4c", roughness: 1 }), b3: new THREE.MeshStandardMaterial({ color: "#d8c7a2", roughness: 1 }) }, bundles);
  bundles.visible = false;
  const found = new THREE.Group(); found.add(statue); found.add(bundles);
  let on = false;
  Object.defineProperty(found, "visible", { get: () => true, set: (v) => { on = !!v; bundles.visible = on; statue.visible = !on; } });
  ctx.outline("found", found);

  // ---- the hall of Cave 16: walls of small Buddhas, a funnel ceiling, a platform with stand-in figures
  const hW = C16.h - 2.4;
  room(H, { floor: "hw", wall: "hw", ceil: "hw" }, C16.x0, C16.x1, C16.z0, C16.z1, 0, hW,
    { e: [{ u0: zN - C16.z0, u1: zS - C16.z0, v0: 0, v1: C16.corrH }] }, { noFloor: true, noCeil: true });
  // the band above the corridor opening on the east wall is part of the room's wall; the opening's reveal:
  oquad(F, "f", V(C16.x0, 0, C16.z0), V(C16.x1, 0, C16.z0), V(C16.x1, 0, C16.z1), V(C16.x0, 0, C16.z1), V(0, 1, 0));
  funnel(H, "ce", C16.x0, C16.x1, C16.z0, C16.z1, hW, C16.h, 2.2);
  const A = C16.altar;
  box(H, "pl", A.x0, A.x1, 0, A.h, A.z0, A.z1);
  box(H, "pl", A.x0 - 0.3, A.x0 + 0.5, A.h, A.h + 5.2, A.z0 + 0.4, A.z1 - 0.4);   // the screen behind the figures
  seated(H, { robe: "ro", skin: "sk", robe2: "pl" }, A.x0 + 2.0, A.h, C16.z, 3.0, PI / 2, { buddha: true });
  for (const dz of [-2.4, 2.4]) standing(H, { robe: "r2", skin: "sk" }, A.x0 + 3.4, A.h, C16.z + dz, 2.3, PI / 2);

  finish(ctx, F, { f: floorM }, ["f"]);
  finish(ctx, B, { cw: corrM, ce: ceilM, pw: plaster, pl: ctx.mat("rock", { color: new THREE.Color("#a99474") }), rk: rockM }, []);
  finish(ctx, H, { hw: hallM, ce: ceilM, pl: ctx.mat("rock", { color: new THREE.Color("#a99474") }), ro: new THREE.MeshStandardMaterial({ color: "#8a3a2a", roughness: 0.85 }), r2: new THREE.MeshStandardMaterial({ color: "#3f6b5c", roughness: 0.85 }), sk: new THREE.MeshStandardMaterial({ color: "#d9bb8c", roughness: 0.8 }) }, []);

  sign(ctx, ["Cave 17", "the Library Cave"], (C17.door.x0 + C17.door.x1) / 2, C17.door.h + 0.55, zN + 0.03, 0, 1.3, 0.38, { size: 60 });
  lamp(ctx, -1.2, C16.corrH - 0.25, C16.z, 0.8);
  lamp(ctx, cx, C17.h - 0.35, C17.z1 - 0.3, 0.45);
  lamp(ctx, C16.x1 - 1.2, hW - 0.4, C16.z, 1.0);
  markers(ctx, site, "s2");
}
