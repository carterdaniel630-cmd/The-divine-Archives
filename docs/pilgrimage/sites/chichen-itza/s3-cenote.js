/* III · The Sacred Cenote: the raised causeway (sacbe) north from the Great Platform, and the great round well
   at its end: sheer rock falling to green water, trees round the rim and roots down the walls. Width of the
   cenote, the drop to its water and the causeway's length published; the rest APPROX (dims.js). No remains and
   no offerings are shown. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, UP } from "./maya.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const SB = D.sacbe, CN = D.cenote, RM = D.rim;
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export function build(ctx) {
  const road = ctx.mat("limestone", { color: new THREE.Color("#d8d1bf") });
  const edge = ctx.mat("block", { color: new THREE.Color("#b8ae95") });
  const grass = ctx.mat("turf", { color: new THREE.Color("#8f9b63") });
  const rock = ctx.mat("rock", { color: new THREE.Color("#a99c80") });
  const water = new THREE.MeshStandardMaterial({ color: "#26402a", roughness: 0.45, metalness: 0 });
  const leaf = new THREE.MeshStandardMaterial({ color: "#4b6139", roughness: 1, flatShading: true });
  const root = new THREE.MeshStandardMaterial({ color: "#5d5140", roughness: 1 });
  const S = new Bucket(), G = new Bucket(), C = new Bucket(), T = new Bucket();

  // ---- the causeway: a pale road a little above the ground, with low kerbs of stone
  oquad(S, "r", V(SB.x0, 0.02, SB.z0), V(SB.x1, 0.02, SB.z0), V(SB.x1, 0.02, SB.z1), V(SB.x0, 0.02, SB.z1), UP);
  for (const x of [SB.x0, SB.x1]) box(S, "e", x - 0.35, x, -0.3, 0.12, SB.z0, SB.z1);
  // ---- the ground round the rim: a square with the round well cut out of it
  const n = 48, R = CN.r, cx = CN.x, cz = CN.z;
  const sq = (a) => { const c = Math.cos(a), s = Math.sin(a), k = 1 / Math.max(Math.abs(c) / (RM.x1 - cx), Math.abs(s) / (Math.max(cz - RM.z0, RM.z1 - cz))); return [cx + c * k, cz + s * k]; };
  const clampZ = (p) => [Math.max(RM.x0, Math.min(RM.x1, p[0])), Math.max(RM.z0, Math.min(RM.z1, p[1]))];
  const Rr = rng(5), wob = []; for (let i = 0; i <= n; i++) wob.push(i === n ? wob[0] : 1 + (Rr() - 0.5) * 0.06);
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
    const p0 = V(cx + Math.cos(a0) * R * wob[i], 0, cz + Math.sin(a0) * R * wob[i]), p1 = V(cx + Math.cos(a1) * R * wob[i + 1], 0, cz + Math.sin(a1) * R * wob[i + 1]);
    const q0 = clampZ(sq(a0)), q1 = clampZ(sq(a1));
    oquad(G, "g", p0, p1, V(q1[0], 0, q1[1]), V(q0[0], 0, q0[1]), UP);
    // the wall of the well: sheer rock down to the water, leaning out a little as it falls (an undercut)
    const d0 = V(cx + Math.cos(a0) * R * wob[i] * 1.06, -CN.drop - 1, cz + Math.sin(a0) * R * wob[i] * 1.06), d1 = V(cx + Math.cos(a1) * R * wob[i + 1] * 1.06, -CN.drop - 1, cz + Math.sin(a1) * R * wob[i + 1] * 1.06);
    oquad(C, "k", p0, p1, d1, d0, V(-Math.cos((a0 + a1) / 2), 0, -Math.sin((a0 + a1) / 2)));
  }
  // the water, about 27 m down
  const wd = new THREE.CircleGeometry(R * 1.07, 48); wd.rotateX(-Math.PI / 2); wd.translate(cx, -CN.drop, cz); C.geo("w", wd);
  // roots and creepers hanging down the walls, trees leaning over the rim
  for (let i = 0; i < 70; i++) {
    const a = Rr() * Math.PI * 2, len = 4 + Rr() * 14, r0 = R * 0.995;
    const g = new THREE.CylinderGeometry(0.06, 0.12, len, 4); g.translate(cx + Math.cos(a) * r0, -len / 2, cz + Math.sin(a) * r0); T.geo("rt", g);
  }
  for (let i = 0; i < 40; i++) {
    const a = Rr() * Math.PI * 2, rr = R + 2 + Rr() * 8, x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    if (Math.abs(x - cx) < 9 && z > cz) continue;                // keep the view from the end of the causeway open
    const h = 6 + Rr() * 6, c = new THREE.IcosahedronGeometry(2.5 + Rr() * 2, 0); c.scale(1.2, 0.7, 1.2); c.translate(x - Math.cos(a) * 2, h, z - Math.sin(a) * 2); T.geo("lf", c);
    const t = new THREE.CylinderGeometry(0.18, 0.28, h, 5); t.translate(x, h / 2, z); T.geo("rt", t);
  }
  // a low stone parapet at the end of the causeway, where visitors look down
  const pz = cz + R + 0.35;
  box(S, "e", -8, 8, 0, 0.45, pz - 0.25, pz + 0.05);

  finish(ctx, S, { r: road, e: edge }, ["r"]);
  finish(ctx, G, { g: grass }, ["g"]);
  finish(ctx, C, { k: rock, w: water }, []);
  finish(ctx, T, { rt: root, lf: leaf }, []);
  sign(ctx, ["The Sacred Cenote", "about 60 m across · 27 m to the water"], 8.6, 1.6, pz + 1.4, 0, 2.6, 0.62);
  sign(ctx, ["The sacbe", "to the Sacred Cenote · about 300 m"], SB.x1 + 1.6, 2.2, SB.z1 - 6, 0, 2.4, 0.56, { size: 56 });
  markers(ctx, site, "s3");
}
