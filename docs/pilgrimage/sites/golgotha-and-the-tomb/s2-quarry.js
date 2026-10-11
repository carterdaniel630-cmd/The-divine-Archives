/* II · The quarry: the floor, the cut faces with their tool marks, the ramp up to the road, the unquarried
   knob of rock, garden plots of olive and vine on the fill, the neighbouring family tomb in the north face,
   and the forecourt of the new tomb in the west face. Placed by estimate (dims.js). */
import * as THREE from "three";
import site, { TREES } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V, wall } from "../../kit.js?v=1";
import { stone } from "../../megalith.js?v=1";
import { markers, finish } from "../../parts.js?v=1";

function rng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

export function build(ctx) {
  const R5 = D.rim, Q = D.q, tx = D.tomb.x, tz = D.tomb.z, F = D.fore;
  const face = ctx.mat("block", { color: new THREE.Color("#fffaf0") });          // meleke: a fine, pale limestone
  const floorM = ctx.mat("block", { color: new THREE.Color("#f2ead8") });
  const soil = ctx.mat("turf", { color: new THREE.Color("#a59872") });
  const rim = ctx.mat("turf", { color: new THREE.Color("#c9c08f") });
  const knobM = ctx.mat("rock", { color: new THREE.Color("#fff6e4") });
  const B = new Bucket(), Fl = new Bucket(), So = new Bucket(), Rm = new Bucket(), K = new Bucket();
  // the floor of the quarry and of the forecourt
  Fl.quad("f", V(Q.x0, 0, Q.z1), V(Q.x1, 0, Q.z1), V(Q.x1, 0, Q.z0), V(Q.x0, 0, Q.z0));
  Fl.quad("f", V(tx, 0, tz + F.w / 2), V(Q.x0, 0, tz + F.w / 2), V(Q.x0, 0, tz - F.w / 2), V(tx, 0, tz - F.w / 2));
  // the ramp up to the road, and the rim ground beside it
  Fl.quad("f", V(D.ramp.x0, 0, D.ramp.z1), V(D.ramp.x1, R5, D.ramp.z1), V(D.ramp.x1, R5, D.ramp.z0), V(D.ramp.x0, 0, D.ramp.z0));
  Rm.quad("g", V(Q.x1, R5, D.ramp.z0), V(D.ramp.x1, R5, D.ramp.z0), V(D.ramp.x1, R5, Q.z0), V(Q.x1, R5, Q.z0));
  Rm.quad("g", V(Q.x1, R5, Q.z1), V(D.ramp.x1, R5, Q.z1), V(D.ramp.x1, R5, D.ramp.z1), V(Q.x1, R5, D.ramp.z1));
  B.tri("w", V(Q.x1, 0, D.ramp.z0), V(D.ramp.x1, R5, D.ramp.z0), V(Q.x1, R5, D.ramp.z0));
  B.tri("w", V(Q.x1, 0, D.ramp.z1), V(Q.x1, R5, D.ramp.z1), V(D.ramp.x1, R5, D.ramp.z1));
  // the four quarry faces, open at the ramp (east) and at the forecourt (west)
  wall(B, "w", Q.x0, Q.z0, Q.x1, Q.z0, 0, R5);                                                          // north face
  wall(B, "w", Q.x1, Q.z1, Q.x0, Q.z1, 0, R5);                                                          // south face
  wall(B, "w", Q.x0, Q.z1, Q.x0, Q.z0, 0, R5, [{ u0: Q.z1 - (tz + F.w / 2), u1: Q.z1 - (tz - F.w / 2), v0: 0, v1: R5 + 1 }]);   // west face, with the forecourt
  wall(B, "w", Q.x1, Q.z0, Q.x1, Q.z1, 0, R5, [{ u0: D.ramp.z0 - Q.z0, u1: D.ramp.z1 - Q.z0, v0: 0, v1: R5 + 1 }]);   // east face, with the ramp
  // the forecourt: two side walls and the tomb's face, with its low doorway
  wall(B, "w", tx, tz - F.w / 2, Q.x0, tz - F.w / 2, 0, R5);
  wall(B, "w", Q.x0, tz + F.w / 2, tx, tz + F.w / 2, 0, R5);
  wall(B, "w", tx, tz + F.w / 2, tx, tz - F.w / 2, 0, R5, [{ u0: F.w / 2 - D.door.w / 2, u1: F.w / 2 + D.door.w / 2, v0: 0, v1: D.door.h }]);
  // a narrow strip of rim behind the tomb's face (the forecourt itself is open to the sky)
  Rm.quad("g", V(tx - 0.5, R5, tz + F.w / 2), V(tx, R5, tz + F.w / 2), V(tx, R5, tz - F.w / 2), V(tx - 0.5, R5, tz - F.w / 2));
  // the square blocking stone, moved aside and leaning against the forecourt wall
  stone(K, "k", { x: tx + 0.45, z: tz - F.w / 2 + 0.75, w: D.blocker.w, d: D.blocker.t, h: D.blocker.h, yaw: 90, lean: -0.08, taper: 0.04, rough: 0.03, seed: 12 });
  // quarrying left the faces stepped and blocky: half-cut blocks along their foot
  const R = rng(5);
  for (let i = 0; i < 30; i++) {
    const side = i % 3, t = R();
    let x, z, b;
    if (side === 0) { x = Q.x0 + 2 + t * (Q.x1 - Q.x0 - 4); z = Q.z0 + 0.8; b = 0; }
    else if (side === 1) { x = Q.x0 + 2 + t * (Q.x1 - Q.x0 - 4); z = Q.z1 - 0.8; b = 180; }
    else { x = Q.x0 + 0.8; z = Q.z0 + 3 + t * (Q.z1 - Q.z0 - 6); b = 90; if (Math.abs(z - tz) < F.w) continue; }
    if (Math.abs(x - D.tomb2.x) < 3 && side === 0) continue;
    stone(K, "k", { x, z, w: 1.2 + R() * 1.6, d: 0.9 + R() * 0.6, h: 0.6 + R() * 1.4, yaw: b, taper: 0.05, rough: 0.06, seed: 70 + i });
  }
  // the unquarried rock, left standing (cracked)
  stone(K, "k", { x: D.knob.x, z: D.knob.z, w: D.knob.l, d: D.knob.w, h: D.knob.h, yaw: 0, taper: 0.22, rough: 0.35, seed: 33 });
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.08, D.knob.h * 0.8), new THREE.MeshBasicMaterial({ color: "#3a3024" }));
  crack.position.set(D.knob.x + 0.6, D.knob.h * 0.45, D.knob.z + D.knob.w / 2 + 0.06); crack.rotation.z = 0.12; ctx.group.add(crack);
  // garden plots on the fill: darker soil, olive trees, and rows of vines on stakes
  So.quad("s", V(-27, 0.02, -31), V(10, 0.02, -31), V(10, 0.02, -41), V(-27, 0.02, -41));
  So.quad("s", V(-27, 0.02, 19), V(8, 0.02, 19), V(8, 0.02, 4), V(-27, 0.02, 4));
  finish(ctx, Fl, { f: floorM }, ["f"]);
  finish(ctx, So, { s: soil }, ["s"]);
  finish(ctx, Rm, { g: rim }, ["g"]);
  finish(ctx, B, { w: face }, []);
  finish(ctx, K, { k: knobM }, []);
  const bark = new THREE.MeshStandardMaterial({ color: "#5e5446", roughness: 1 });
  const leaf = new THREE.MeshStandardMaterial({ color: "#8e9a78", roughness: 0.95, flatShading: true });
  const vine = new THREE.MeshStandardMaterial({ color: "#6f8a46", roughness: 0.95, flatShading: true });
  for (const [k, [x, z]] of TREES.entries()) {
    const r = rng(100 + k), g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r() * 6;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 1.7, 7), bark); trunk.position.y = 0.85; trunk.rotation.z = (r() - 0.5) * 0.4; g.add(trunk);
    for (let j = 0; j < 4; j++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9 + r() * 0.6, 0), leaf); c.position.set((r() - 0.5) * 1.6, 2.0 + r() * 0.8, (r() - 0.5) * 1.6); c.scale.y = 0.65; g.add(c); }
    ctx.group.add(g);
  }
  const stakeG = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 4), blob = new THREE.IcosahedronGeometry(0.35, 0);
  const stakes = new THREE.InstancedMesh(stakeG, bark, 60), blobs = new THREE.InstancedMesh(blob, vine, 60), m = new THREE.Matrix4();
  let n = 0;
  for (let row = 0; row < 4; row++) for (let i = 0; i < 15; i++) {
    const x = -25 + i * 1.6, z = 6 + row * 2.6;
    if (TREES.some(([tx2, tz2]) => Math.hypot(tx2 - x, tz2 - z) < 2)) continue;
    m.makeTranslation(x, 0.6, z); stakes.setMatrixAt(n, m); m.makeTranslation(x, 1.0, z); blobs.setMatrixAt(n, m); n++;
  }
  stakes.count = blobs.count = n; ctx.group.add(stakes, blobs);
  // the neighbouring family tomb in the north face: a low dark doorway with a cut frame (exterior only)
  const dark = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.9), new THREE.MeshBasicMaterial({ color: "#120d08" }));
  dark.position.set(D.tomb2.x, 0.45, Q.z0 + 0.02); ctx.group.add(dark);
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshStandardMaterial({ color: "#d5c6a2", roughness: 1 }));
  frame.position.set(D.tomb2.x, 0.75, Q.z0 + 0.01); ctx.group.add(frame);
  // a hit box on the rock
  const hit = new THREE.Mesh(new THREE.BoxGeometry(D.knob.l, D.knob.h, D.knob.w), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.position.set(D.knob.x, D.knob.h / 2, D.knob.z); ctx.group.add(hit); ctx.hit(hit, ctx.infoById("rock"));
  markers(ctx, site, "s2");
}
