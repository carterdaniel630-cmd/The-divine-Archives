/* II · The large house (reconstruction): a columned hall with the scholars' long table, and along its
   walls niches of pigeonholes for rolls, after later Roman libraries. Every size is conjecture. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, room, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const H = D.hall, x0 = H.x - H.w / 2, x1 = H.x + H.w / 2, z0 = H.z - H.d / 2, z1 = H.z + H.d / 2;
  const marble = ctx.mat("gallery", { color: new THREE.Color("#e6dccb") });
  const paving = ctx.mat("floor", { color: new THREE.Color("#cbbd9f") });
  const col = ctx.mat("block", { color: new THREE.Color("#efe7d8") });
  const woodM = ctx.mat("wood", { color: new THREE.Color("#5e4128") });
  const ceil = new THREE.MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.85 });
  const B = new Bucket(), F = new Bucket(), K = new Bucket(), Wd = new Bucket();
  room(B, { floor: "x", wall: "w", ceil: "c" }, x0, x1, z0, z1, 0, H.h, { n: [{ u0: H.w / 2 - 0.9, u1: H.w / 2 + 0.9, v0: 0, v1: 3.0 }] }, { noFloor: true });
  F.quad("p", V(x0, 0, z1), V(x1, 0, z1), V(x1, 0, z0), V(x0, 0, z0));
  // two rows of columns down the hall
  for (const x of [H.x - 3.4, H.x + 3.4]) for (let z = z0 + 3; z < z1 - 1; z += 3.6) {
    const g = new THREE.CylinderGeometry(0.28, 0.32, H.h, 12); g.translate(x, H.h / 2, z); K.geo("c", g);
  }
  // the long table and its benches (the common table: Strabo's "mess-hall")
  const box = (bk, key, x, y, z, w, h, d) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); bk.geo(key, g); };
  box(Wd, "d", H.x, 0.74, H.z + 5, 6.4, 0.08, 1.2); for (const dx of [-2.8, 0, 2.8]) box(Wd, "d", H.x + dx, 0.37, H.z + 5, 0.14, 0.74, 0.9);
  for (const dz of [-1.0, 1.0]) box(Wd, "d", H.x, 0.44, H.z + 5 + dz, 6.0, 0.06, 0.36);
  // a reading table near the niches
  box(Wd, "d", H.x - 1.2, 0.76, H.z - 5.5, 1.2, 0.06, 0.8); box(Wd, "d", H.x - 1.2, 0.38, H.z - 5.5, 0.1, 0.76, 0.6);
  // wall niches on both long walls, each a grid of pigeonholes with rolls in them (illustrative)
  const rollGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8); rollGeo.rotateZ(Math.PI / 2);   // end-out, as rolls lie in pigeonholes
  const rollM = new THREE.MeshStandardMaterial({ color: "#cfb784", roughness: 0.85 });
  const rolls = new THREE.InstancedMesh(rollGeo, rollM, 2 * 5 * 4 * 6 * 3), m4 = new THREE.Matrix4(); let k = 0;
  for (const side of [-1, 1]) {
    const xw = side < 0 ? x0 : x1, inward = -side;
    for (let i = 0; i < 5; i++) {
      const zc = z0 + 3.2 + i * 2.6;
      if (zc > H.z + 1) break;
      box(Wd, "d", xw + inward * 0.2, 1.6, zc, 0.4, 2.6, 1.8);                              // the cabinet
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
        const y = 0.6 + r * 0.6, z = zc - 0.75 + c * 0.3;
        for (let t = 0; t < 3; t++) { m4.makeTranslation(xw + inward * 0.3, y - 0.12 + (t === 2 ? 0.075 : 0), z + (t === 2 ? 0 : (t - 0.5) * 0.09)); if (k < rolls.count) rolls.setMatrixAt(k++, m4); }
      }
    }
  }
  rolls.count = k; ctx.group.add(rolls);
  finish(ctx, F, { p: paving }, ["p"]);
  finish(ctx, B, { w: marble, c: ceil, x: paving }, []);
  finish(ctx, K, { c: col }, []);
  finish(ctx, Wd, { d: woodM }, []);
  sign(ctx, ["The large house", "Strabo's word · its plan is conjecture"], H.x, 4.2, z0 + 0.05, 0, 3.0, 0.62, { size: 58 });
  sign(ctx, ["Book niches: CONJECTURE", "after later Roman libraries"], x0 + 0.05, 3.6, z0 + 6, Math.PI / 2, 2.4, 0.5, { size: 50 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#ffe8c0" }, H.x, 0, z0 + 0.15, 0);
  // light from high windows, as anchors without fittings (an ancient hall had no lamps on brackets like the museum's)
  for (const z of [z0 + 4, H.z, z1 - 4]) { ctx.light(x0 + 1.2, 5.5, z, 0.8); ctx.light(x1 - 1.2, 5.5, z, 0.8); }
  markers(ctx, site, "s2");
}
