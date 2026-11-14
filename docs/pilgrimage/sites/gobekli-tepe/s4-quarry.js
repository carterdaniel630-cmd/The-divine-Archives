/* IV · The quarry: the bare limestone of the plateau, and the unfinished T-pillar still lying in it, outlined
   by its cutting trench and never lifted. Size of the pillar published; its shape in plan, the trench and the
   surroundings APPROX. */
import * as THREE from "three";
import site, { Q } from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { rubble } from "../../cave.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const lime = ctx.mat("rock", { color: new THREE.Color("#e9e1cf") });
  const cut = ctx.mat("block", { color: new THREE.Color("#efe7d6") });
  const trench = ctx.mat("rock", { color: new THREE.Color("#a8987c") });
  const far = new THREE.MeshStandardMaterial({ color: "#c2a985", roughness: 1, side: THREE.DoubleSide });
  const F = new Bucket(), B = new Bucket(), C = new Bucket(), G = new Bucket();
  const u = D.unfinished, x0 = Q.x - u.L / 2, x1 = Q.x + u.L / 2, tr = 0.5, dep = 1.2;
  // the shape of the pillar in plan: a shaft and, at its east end, the wider head of the T (APPROX)
  const sh = u.w * 0.8, hd = u.w * 1.25, hx = x1 - 1.4;
  const outline = [[x0, -sh / 2], [hx, -sh / 2], [hx, -hd / 2], [x1, -hd / 2], [x1, hd / 2], [hx, hd / 2], [hx, sh / 2], [x0, sh / 2]];
  // the bedrock round it, flush with the pillar's top, with the trench cut round the outline
  const ox0 = x0 - tr, ox1 = x1 + tr, oz0 = Q.z - hd / 2 - tr, oz1 = Q.z + hd / 2 + tr, W = 60;
  F.quad("f", V(Q.x - W, 0, oz0), V(Q.x + W, 0, oz0), V(Q.x + W, 0, Q.z - W), V(Q.x - W, 0, Q.z - W));
  F.quad("f", V(Q.x - W, 0, Q.z + W), V(Q.x + W, 0, Q.z + W), V(Q.x + W, 0, oz1), V(Q.x - W, 0, oz1));
  F.quad("f", V(Q.x - W, 0, oz1), V(ox0, 0, oz1), V(ox0, 0, oz0), V(Q.x - W, 0, oz0));
  F.quad("f", V(ox1, 0, oz1), V(Q.x + W, 0, oz1), V(Q.x + W, 0, oz0), V(ox1, 0, oz0));
  // the trench: its floor and outer walls
  B.quad("c", V(ox0, -dep, oz1), V(ox1, -dep, oz1), V(ox1, -dep, oz0), V(ox0, -dep, oz0));
  B.quad("c", V(ox0, -dep, oz0), V(ox1, -dep, oz0), V(ox1, 0, oz0), V(ox0, 0, oz0));
  B.quad("c", V(ox1, -dep, oz1), V(ox0, -dep, oz1), V(ox0, 0, oz1), V(ox1, 0, oz1));
  B.quad("c", V(ox0, -dep, oz1), V(ox0, -dep, oz0), V(ox0, 0, oz0), V(ox0, 0, oz1));
  B.quad("c", V(ox1, -dep, oz0), V(ox1, -dep, oz1), V(ox1, 0, oz1), V(ox1, 0, oz0));
  // the pillar itself, still joined to the rock beneath: its top face and its sides down to the trench floor
  const shape = new THREE.Shape(); outline.forEach(([x, z], i) => (i ? shape.lineTo(x - Q.x, -(z)) : shape.moveTo(x - Q.x, -(z))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: dep, bevelEnabled: false });
  g.rotateX(-Math.PI / 2); g.translate(Q.x, -dep, Q.z); C.geo("p", g);
  // a crack across the shaft, which may be why it was left (a dark line)
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.05, sh * 1.02), new THREE.MeshBasicMaterial({ color: "#5d5345" }));
  crack.rotation.x = -Math.PI / 2; crack.rotation.z = 0.3; crack.position.set(Q.x - 0.8, 0.012, Q.z); ctx.group.add(crack);
  // spoil and chips round the work, and the plateau's edge falling away to the west
  rubble(G, "r", Q.x - 6, Q.z - 4, 0, 1.2, 9, 401); rubble(G, "r", Q.x + 6, Q.z + 4.5, 0, 1.0, 7, 402); rubble(G, "r", Q.x + 2, Q.z - 5, 0, 0.6, 5, 403);
  G.quad("e", V(Q.x - W, 0, Q.z - W), V(Q.x - W, 0, Q.z + W), V(Q.x - W - 200, -60, Q.z + W + 200), V(Q.x - W - 200, -60, Q.z - W - 200));
  finish(ctx, F, { f: lime }, ["f"]);
  finish(ctx, B, { c: trench }, []);
  finish(ctx, C, { p: cut }, []);
  finish(ctx, G, { r: lime, e: far }, []);
  sign(ctx, ["The quarry", "an unfinished pillar · about 7 m long"], Q.x - 8, 2.2, Q.z - 3.8, PI4(), 2.4, 0.5, { size: 54 });
  sign(ctx, ["Back to the hill", "the walkway"], Q.x - 14.4, 2.9, Q.z, Math.PI / 2, 1.6, 0.42, { size: 56 });
  ctx.portal({ w: 1.3, h: 2.1, tint: "#fff0d8" }, Q.x - 13.9, 0, Q.z, Math.PI / 2);
  markers(ctx, site, "s4");
}
function PI4() { return Math.PI / 4; }
