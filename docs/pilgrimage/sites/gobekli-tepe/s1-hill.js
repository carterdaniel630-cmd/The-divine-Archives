/* I · The hill and the hollow: the mound's surface and the excavated hollow sunk in it, the walkway on the
   north rim, the model's ramp down, and Enclosures A and B (walls and pillars). Enclosures C and D are their
   own sections. Positions APPROX (dims.js, layout.js); the far landscape is a low backdrop. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { pillarsA, pillarsB } from "./layout.js?v=1";
import { tpillar, ringWall, relief, facePos, fox, snakes, bird, drystone } from "./pillars.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const Y = D.surfY;
  const floorM = ctx.mat("rock", { color: new THREE.Color("#e6dccb") });
  const soil = ctx.mat("rock", { color: new THREE.Color("#c99f78") });
  const far = new THREE.MeshStandardMaterial({ color: "#b7997a", roughness: 1, side: THREE.DoubleSide });
  const wallM = drystone();
  const pillarM = ctx.mat("block", { color: new THREE.Color("#efe6d2") });
  const wood = ctx.mat("wood", { color: new THREE.Color("#8a6a48") });
  const F = new Bucket(), T = new Bucket(), W = new Bucket(), Pl = new Bucket(), Wd = new Bucket();
  // the floor of the hollow, and its sides rising to the surface of the mound
  const hx0 = -42, hx1 = 18, hz0 = -28, hz1 = 46, s = 3;
  F.quad("f", V(hx0, 0, hz1), V(hx1, 0, hz1), V(hx1, 0, hz0), V(hx0, 0, hz0));
  T.quad("t", V(hx0, 0, hz0), V(hx1, 0, hz0), V(hx1 + s, Y, hz0 - s), V(hx0 - s, Y, hz0 - s));    // north side
  T.quad("t", V(hx1, 0, hz1), V(hx0, 0, hz1), V(hx0 - s, Y, hz1 + s), V(hx1 + s, Y, hz1 + s));    // south side
  T.quad("t", V(hx0, 0, hz1), V(hx0, 0, hz0), V(hx0 - s, Y, hz0 - s), V(hx0 - s, Y, hz1 + s));    // west side
  T.quad("t", V(hx1, 0, hz0), V(hx1, 0, hz1), V(hx1 + s, Y, hz1 + s), V(hx1 + s, Y, hz0 - s));    // east side
  // the surface of the mound round the hollow, then the ridge falling away to the plain
  const e0 = hx0 - s, e1 = hx1 + s, b0 = hz0 - s, b1 = hz1 + s, R = 160;
  T.quad("t", V(-R, Y, b0), V(R, Y, b0), V(R, Y, -R), V(-R, Y, -R));
  T.quad("t", V(-R, Y, R), V(R, Y, R), V(R, Y, b1), V(-R, Y, b1));
  T.quad("t", V(-R, Y, b1), V(e0, Y, b1), V(e0, Y, b0), V(-R, Y, b0));
  T.quad("t", V(e1, Y, b1), V(R, Y, b1), V(R, Y, b0), V(e1, Y, b0));
  const ring = (r0, y0, r1, y1, key, B) => { const n = 48; for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2; const p = (r, y, t) => V(Math.sin(t) * r * 1.42, y, -Math.cos(t) * r * 1.42); B.quad(key, p(r1, y1, t0), p(r1, y1, t1), p(r0, y0, t1), p(r0, y0, t0)); } };
  ring(R / 1.42, Y, 420, -40, "g", T); ring(420, -40, 900, -70, "g", T);
  // the walkway on the rim (boards on low posts) and a rail along its edge
  Wd.quad("w", V(-40, Y + 0.05, -28), V(14, Y + 0.05, -28), V(14, Y + 0.05, -31), V(-40, Y + 0.05, -31));
  Wd.quad("w", V(-40, Y + 0.05, -28), V(-40, Y - 0.25, -28), V(14, Y - 0.25, -28), V(14, Y + 0.05, -28));
  // the model's ramp down into the hollow, with a rail each side
  const rz0 = -28.6, rz1 = -17.6, ry = (z) => Y + (0 - Y) * (z - rz0) / (rz1 - rz0);
  Wd.quad("w", V(10, ry(rz1) + 0.04, rz1), V(12.4, ry(rz1) + 0.04, rz1), V(12.4, ry(rz0) + 0.04, rz0), V(10, ry(rz0) + 0.04, rz0));
  const railMat = new THREE.MeshStandardMaterial({ color: "#3b3631", roughness: 0.45, metalness: 0.7 });
  const pipe = (a, b) => { const len = a.distanceTo(b), m = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, len, 6), railMat); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); ctx.group.add(m); };
  pipe(V(-40, Y + 1.0, -28.05), V(10, Y + 1.0, -28.05));
  for (const x of [9.95, 12.45]) pipe(V(x, Y + 1.0, rz0), V(x, 1.0, rz1));
  const post = new THREE.CylinderGeometry(0.03, 0.03, 1, 5);
  for (let x = -40; x <= 10; x += 2.5) { const g = post.clone(); g.translate(x, Y + 0.5, -28.05); Wd.geo("p", g); }
  for (let z = rz0; z <= rz1; z += 2.2) for (const x of [9.95, 12.45]) { const g = new THREE.CylinderGeometry(0.03, 0.03, ry(z) + 1, 5); g.translate(x, (ry(z) + 1) / 2, z); Wd.geo("p", g); }
  // Enclosures A and B: their walls and pillars (seen, not entered)
  ringWall(W, "w", { cx: D.encA.x, cz: D.encA.z, rx: D.encA.rx, rz: D.encA.rz, t: D.encA.wallT, h: D.encA.wallH, seed: 11, ragged: true });
  ringWall(W, "w", { cx: D.encB.x, cz: D.encB.z, r: D.encB.r, t: D.encB.wallT, h: D.encB.wallH, seed: 12, ragged: true });
  const pa = pillarsA(), pb = pillarsB();
  for (const p of pa.central.concat(pa.ring, pb.central, pb.ring)) tpillar(Pl, "p", Object.assign({ seed: p.id.length * 31 + Math.round(p.x * 7) }, p));
  finish(ctx, F, { f: floorM }, ["f"]);
  finish(ctx, T, { t: soil, g: far }, ["t"]);
  finish(ctx, W, { w: wallM }, []);
  finish(ctx, Pl, { p: pillarM }, []);
  finish(ctx, Wd, { w: wood, p: railMat }, ["w"]);
  // a few carvings on A and B: the snakes of A's central pair, the fox of B's, a bird on a wall pillar
  const [a1, a2] = pa.central, [, b2] = pb.central;
  for (const [p, d, w, h, y] of [[a1, snakes(3), 0.9, 1.6, 1.9], [a2, bird, 0.9, 1.0, 2.2], [b2, fox, 1.2, 0.9, 2.6]]) {
    const f = facePos(p, "right", y); relief(ctx, d, Object.assign({ w, h }, f));
    const g = facePos(p, "left", y); relief(ctx, d, Object.assign({ w, h }, g));
  }
  // the triangle of Haklay and Gopher, drawn on our approximate layout (toggled from its info card)
  const tri = [[D.encB.x, D.encB.z], [D.encC.x, D.encC.z], [D.encD.x, D.encD.z]];
  const geo = new THREE.BufferGeometry().setFromPoints(tri.concat([tri[0]]).map(([x, z]) => new THREE.Vector3(x, 3.2, z)));
  const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: "#e7c680", dashSize: 0.8, gapSize: 0.5, depthTest: false, transparent: true }));
  line.computeLineDistances(); line.renderOrder = 10; ctx.outline("triangle", line);
  // signposts and portals
  sign(ctx, ["Göbekli Tepe", "the main excavation · enclosures A, B, C and D below"], -14, Y + 2.3, -31.2, 0, 3.4, 0.6, { size: 52 });
  sign(ctx, ["To the quarry", "on the plateau"], -10, Y + 3.4, -31.4, 0, 1.6, 0.42, { size: 56 });
  ctx.portal({ w: 1.3, h: 2.1, tint: "#ffe2b0" }, -10, Y, -31.3, 0);
  sign(ctx, ["The Vestibule", "and back to the museum"], -41, Y + 3.4, -29.5, Math.PI / 2, 1.6, 0.42, { size: 56 });
  ctx.portal({ w: 1.3, h: 2.1, tint: "#fff0d8" }, -40.4, Y, -29.5, Math.PI / 2);
  sign(ctx, ["Down into the hollow", "the model's own ramp"], 11.2, Y + 2.2, -29.8, Math.PI, 1.8, 0.45, { size: 54 });
  markers(ctx, site, "s1");
}
