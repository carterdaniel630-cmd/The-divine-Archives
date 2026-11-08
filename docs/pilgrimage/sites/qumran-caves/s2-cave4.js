/* II · Cave 4: two chambers hollowed by hand out of the marl, joined by a low way through, with rows of
   holes in the walls of the first. Sizes APPROX (dims.js).
   Presence Pass proof piece (order 2026-11-01, item 4: "one varied wall in Qumran's Cave 4 first"): the marl
   carries the Foundation Kit's world-space breakup, so the 3 m rock texture no longer reads as one tile stamped
   round the chamber, and the holes are sunk sockets of varied size and set, laid on the real wall surface,
   instead of flat black discs in two ruler-straight rows. Their number and spacing stay approximate. */
import * as THREE from "three";
import site, { C4 } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket } from "../../kit.js?v=1";
import { cave, rubble } from "../../cave.js?v=1";
import { markers, glassCase, finish } from "../../parts.js?v=1";
import { enochFragments } from "./relics.js?v=1";
import { withBreakup } from "../../../assets/foundation/kit.js";

function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

// One socket, painted once: a pit whose sides fall away into shadow, with an uneven, worn edge. Colour and
// alpha in one canvas, a bowl-shaped relief in a normal map, so the scene's light catches the far lip.
let SOCKET = null;
function socketTextures() {
  if (SOCKET) return SOCKET;
  const S = 64, R = rng(77), wob = [];
  for (let i = 0; i < 12; i++) wob.push(1 + (R() - 0.5) * 0.22);
  const edgeAt = (a) => { const t = (((a / (Math.PI * 2)) % 1) + 1) % 1 * wob.length, i = Math.floor(t), f = t - i; return wob[i % wob.length] * (1 - f) + wob[(i + 1) % wob.length] * f; };
  const col = new Uint8ClampedArray(S * S * 4), nrm = new Uint8ClampedArray(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const u = ((x + 0.5) / S) * 2 - 1, v = 1 - ((y + 0.5) / S) * 2, e = 0.74 * edgeAt(Math.atan2(v, u)), r = Math.hypot(u, v) / e, o = (y * S + x) * 4;
    // colour: marl shadow at the lip, near-black at the bottom of the pit
    const k = Math.max(0, Math.min(1, 1 - r)), sh = 1 - Math.pow(k, 0.55);
    col[o] = 20 + 92 * sh; col[o + 1] = 14 + 78 * sh; col[o + 2] = 9 + 58 * sh;
    // alpha: solid inside, a short feathered lip outside (a worn, darkened rim), nothing beyond
    col[o + 3] = 255 * (r < 0.9 ? 1 : r < 1.32 ? Math.pow(1 - (r - 0.9) / 0.42, 1.6) * 0.85 : 0);
    // relief: a bowl, so the faces inside lean toward the middle; flat outside
    let nx = 0, ny = 0;
    if (r < 1) { nx = -1.6 * u / (e * e); ny = -1.6 * v / (e * e); }
    const l = Math.hypot(nx, ny, 1);
    nrm[o] = (nx / l * 0.5 + 0.5) * 255; nrm[o + 1] = (ny / l * 0.5 + 0.5) * 255; nrm[o + 2] = (1 / l * 0.5 + 0.5) * 255; nrm[o + 3] = 255;
  }
  const tex = (d, srgb) => { const c = document.createElement("canvas"); c.width = c.height = S; c.getContext("2d").putImageData(new ImageData(d, S, S), 0, 0); const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
  SOCKET = { map: tex(col, true), normalMap: tex(nrm, false) };
  return SOCKET;
}

export function build(ctx) {
  const marl = ctx.mat("rock", { color: new THREE.Color("#e8dcc2") });
  const floorM = ctx.mat("rock", { color: new THREE.Color("#cdbd9c") });
  const B = new Bucket(), F = new Bucket();
  const PI = Math.PI;
  // 4a: the mouth to the north, the way through to the east
  const a = cave(B, { floor: "f", wall: "w" }, { cx: C4.x, cz: C4.z, y: 0, rx: D.c4a.rx, rz: D.c4a.rz, h: D.c4a.h, seed: 41, rough: 0.18,
    gaps: [{ a0: -0.33, a1: 0.33, h: 1.7 }, { a0: PI / 2 - 0.2, a1: PI / 2 + 0.28, h: 1.6 }] });
  const bx = C4.x + D.c4bOff;
  cave(B, { floor: "f", wall: "w" }, { cx: bx, cz: C4.z + 0.3, y: 0, rx: D.c4b.rx, rz: D.c4b.rz, h: D.c4b.h, seed: 42, rough: 0.2,
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
  // the marl and the floor take the kit's world-space breakup (colour and roughness wander over ~2.3 m and its
  // second octave, a scale unrelated to the 3 m tile); own copies, so the other caves keep their materials
  const marlK = withBreakup(marl.clone(), 0.32, 2.3), floorK = withBreakup(floorM.clone(), 0.14, 2.3);
  const walls = finish(ctx, B, { w: marlK, f: floorK }, ["f"]);
  finish(ctx, F, { f: floorK }, ["f"]);
  // the rows of holes along the south and west walls of 4a (their number and spacing are approximate): each one
  // is found on the built wall by a ray from the chamber's middle, so it sits on the rock rather than floating
  // in front of it or sinking behind it, and each varies a little in size, shape, height and place along its row
  const wallMesh = walls.find((m) => m.name === "w"); wallMesh.updateMatrixWorld(true);
  const T2 = socketTextures(), holeM = new THREE.MeshStandardMaterial({ map: T2.map, normalMap: T2.normalMap, roughness: 1, metalness: 0, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const n = 26, hole = new THREE.PlaneGeometry(0.1 / 0.74, 0.1 / 0.74), inst = new THREE.InstancedMesh(hole, holeM, n * 2);
  const ray = new THREE.Raycaster(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), roll = new THREE.Quaternion(), sc = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1), Rh = rng(4101), tone = new THREE.Color();
  let k = 0;
  for (const hf of [0.34, 0.56]) {
    for (let i = 0; i < n; i++) {
      const b = PI * 0.62 + ((i + (Rh() - 0.5) * 0.5) / (n - 1)) * PI * 0.95, y = (hf + (Rh() - 0.5) * 0.035) * D.c4a.h;
      const dir = new THREE.Vector3(Math.sin(b), 0, -Math.cos(b));
      ray.set(new THREE.Vector3(C4.x, y, C4.z), dir); ray.far = 8;
      const hit = ray.intersectObject(wallMesh, false)[0];
      if (!hit) continue;
      const nrm = hit.face.normal.clone().transformDirection(wallMesh.matrixWorld);
      if (nrm.dot(dir) > 0) nrm.negate();                     // face the room
      q.setFromUnitVectors(Z, nrm); roll.setFromAxisAngle(Z, Rh() * PI * 2); q.multiply(roll);
      const sz = 0.82 + Rh() * 0.42; sc.set(sz * (0.86 + Rh() * 0.28), sz * (0.86 + Rh() * 0.28), 1);
      m4.compose(hit.point.clone().addScaledVector(nrm, 0.004), q, sc); inst.setMatrixAt(k, m4);
      inst.setColorAt(k, tone.setScalar(0.82 + Rh() * 0.3)); k++;
    }
  }
  inst.count = k; inst.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  inst.frustumCulled = false; ctx.group.add(inst);
  // the case: Aramaic fragments of Enoch
  glassCase(ctx, C4.x + 1.6, C4.z + 1.2, enochFragments().root, ctx.infoById("c4-enoch"));
  // daylight from the mouth and a little spill inside (no fittings: the caves are unlit)
  ctx.light(C4.x, 1.4, mz0 + 0.6, 0.9); ctx.light(C4.x - 0.5, 1.8, C4.z, 0.45); ctx.light(bx, 1.6, C4.z + 0.3, 0.35);
  markers(ctx, site, "s2");
  // the section's own materials go with it (the shared stone textures and the socket textures are kept)
  return { dispose() { marlK.dispose(); floorK.dispose(); holeM.dispose(); } };
}
