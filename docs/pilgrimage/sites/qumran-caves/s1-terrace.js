/* I · The marl terrace: the hub. Daylight, the gully, the openings of Cave 4 across it, the ruins of
   Khirbet Qumran in outline, the cliffs to the west and the Dead Sea below to the east. A low-detail
   backdrop: shapes and distances are approximate. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const marl = ctx.mat("block", { color: new THREE.Color("#efe4cc") });
  const cliff = ctx.mat("core", { color: new THREE.Color("#c9a77c") });
  const rock = ctx.mat("rock", { color: new THREE.Color("#e6d8bc") });
  const B = new Bucket(), F = new Bucket();
  // the terrace floor the visitor walks on, and the wider plateau around it
  F.quad("t", V(-14, 0, 10), V(14, 0, 10), V(14, 0, -16), V(-14, 0, -16));
  B.quad("m", V(-60, 0, -16), V(14, 0, -16), V(14, 0, -90), V(-60, 0, -90));
  B.quad("m", V(14, 0, 10), V(60, 0, 10), V(60, 0, -90), V(14, 0, -90));
  B.quad("m", V(-60, 0, 10), V(-14, 0, 10), V(-14, 0, -16), V(-60, 0, -16));
  // the gully south of the terrace: its two banks slope down to the dry bed
  const gy = -7;
  B.quad("m", V(-60, 0, 10), V(60, 0, 10), V(60, gy, 15), V(-60, gy, 15));
  B.quad("m", V(-60, gy, 15), V(60, gy, 15), V(60, gy, 18), V(-60, gy, 18));
  B.quad("m", V(-60, gy, 18), V(60, gy, 18), V(60, 0, 22), V(-60, 0, 22));
  // the spur across the gully, with Cave 4's two openings in its face (dark mouths)
  B.quad("m", V(-20, 0, 22), V(20, 0, 22), V(20, 0, 50), V(-20, 0, 50));
  for (const [ox, w, h] of [[-1.6, 1.3, 1.5], [1.9, 1.0, 1.2]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: "#120c07" }));
    m.position.set(ox, gy * 0.42 + h / 2, 20.4); m.rotation.y = Math.PI; m.rotation.x = -0.35; ctx.group.add(m);
  }
  // the cliffs to the west: two tall weathered faces stepping back
  B.quad("c", V(-60, 0, 60), V(-60, 0, -120), V(-75, 70, -120), V(-75, 70, 60));
  B.quad("c", V(-75, 70, 60), V(-75, 70, -120), V(-95, 90, -120), V(-95, 90, 60));
  // the Dead Sea: a flat grey-blue plane far below to the east
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(900, 1200), new THREE.MeshStandardMaterial({ color: "#7d93a0", roughness: 0.25, metalness: 0.1 }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(560, -60, -100); ctx.group.add(sea);
  const slope = new THREE.Mesh(new THREE.PlaneGeometry(120, 1200), marl); slope.rotation.x = -Math.PI / 2; slope.rotation.y = -0.45; slope.position.set(110, -30, -100); ctx.group.add(slope);
  // Khirbet Qumran in outline: low walls and the tower, north-east of the terrace
  const wall = (x, z, w, d, h) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, h / 2, z); B.geo("r", g); };
  wall(24, -30, 30, 0.8, 1.2); wall(24, -52, 30, 0.8, 1.0); wall(9.4, -41, 0.8, 22, 1.1); wall(38.6, -41, 0.8, 22, 0.9);
  wall(20, -41, 0.7, 10, 0.8); wall(30, -36, 8, 0.7, 0.7); wall(14, -33, 6, 6, 4.5);   // the tower
  finish(ctx, F, { t: rock }, ["t"]);
  finish(ctx, B, { m: marl, c: cliff, r: rock }, []);
  // signposts for the three ways on, and the way back
  sign(ctx, ["Down to Cave 4", "across the gully"], 0, 1.9, 8.0, Math.PI, 1.8, 0.45, { size: 56 });
  sign(ctx, ["To Cave 1", "the cliffs to the north"], -10.0, 1.9, -8.0, Math.PI / 2, 1.6, 0.42, { size: 56 });
  sign(ctx, ["To Cave 3", "the cliffs to the north"], -10.0, 1.9, -4.0, Math.PI / 2, 1.6, 0.42, { size: 56 });
  sign(ctx, ["The Vestibule", "and back to the museum"], 10.0, 1.9, 0, -Math.PI / 2, 1.6, 0.42, { size: 56 });
  for (const [x, z, yaw] of [[0, 8.6, Math.PI], [-10.6, -8, Math.PI / 2], [-10.6, -4, Math.PI / 2], [10.6, 0, -Math.PI / 2]]) ctx.portal({ w: 1.2, h: 2.0, tint: "#ffe2b0" }, x, 0, z, yaw);
  markers(ctx, site, "s1");
}
