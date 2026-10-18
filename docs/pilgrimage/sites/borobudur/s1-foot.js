/* I · The foot: the ground round the monument and the far tree line, the broad foot (123 m square) with its
   walkway, the first balustrade with its niches, the stairs up onto the foot on every side, and the line to Pawon
   and Mendut with the zenith-passage sunset (toggled from its card; built here because this section is loaded
   wherever the visitor stands). Base SURVEY; heights APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { nicheTex, sheet } from "./art.js?v=1";
import { box, steps } from "./shapes.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { nearPortal } from "./lod.js?v=1";

export function build(ctx) {
  const F = D.F, G = D.gal, sw = D.stair.hw, B0 = D.B0;
  const turf = ctx.mat("turf", { color: new THREE.Color("#7f8c58") }), far = ctx.mat("turf", { color: new THREE.Color("#748452") });
  const stone = ctx.mat("block", { color: new THREE.Color("#7d7a73") }).clone(); stone.side = THREE.DoubleSide;
  const floor = ctx.mat("floor", { color: new THREE.Color("#8e8a80") });
  const trees = new THREE.MeshStandardMaterial({ color: "#3d5130", roughness: 1, side: THREE.BackSide });
  const Gr = new Bucket(), S = new Bucket(), Fl = new Bucket();
  const flat = (B, k, x0, x1, z0, z1, y) => B.quad(k, V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0));

  // ---- the ground, out to a ring of trees
  const R = 1500, h = F.hw;
  flat(Gr, "g", -150, 150, -150, -h, 0); flat(Gr, "g", -150, 150, h, 150, 0); flat(Gr, "g", -150, -h, -h, h, 0); flat(Gr, "g", h, 150, -h, h, 0);
  flat(Gr, "f", -R, -150, -R, R, 0); flat(Gr, "f", 150, R, -R, R, 0); flat(Gr, "f", -150, 150, -R, -150, 0); flat(Gr, "f", -150, 150, 150, R, 0);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R - 20, R - 20, 30, 40, 1, true), trees); band.position.y = 13; ctx.group.add(band);
  // ---- the foot: its four faces and its top (the walkway, and the floor of the first gallery)
  for (const [x0, z0, x1, z1] of [[-h, -h, h, -h], [h, -h, h, h], [h, h, -h, h], [-h, h, -h, -h]]) S.quad("s", V(x0, 0, z0), V(x1, 0, z1), V(x1, F.y, z1), V(x0, F.y, z0));
  flat(Fl, "f", -h, h, -h, h, F.y);
  box(S, "s", -h - 0.4, h + 0.4, F.y - 0.5, F.y, -h - 0.4, -h); box(S, "s", -h - 0.4, h + 0.4, F.y - 0.5, F.y, h, h + 0.4);   // the cornice
  box(S, "s", -h - 0.4, -h, F.y - 0.5, F.y, -h, h); box(S, "s", h, h + 0.4, F.y - 0.5, F.y, -h, h);
  // ---- the stairs up onto the foot, on every side
  steps(Fl, "f", F.hw + 4.5, F.hw, 0, F.y, sw, 14);
  // ---- the first balustrade, with a gap on each axis, and its niches facing out
  const t = G.wallT, bh = G.balH, quads = [];
  for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const c = Math.cos(a), n = -Math.sin(a), P = (r, u, y) => V(c * r - n * u, y, n * r + c * u);
    for (const [u0, u1] of [[-B0, -sw - 0.3], [sw + 0.3, B0]]) {
      const g = new THREE.BoxGeometry(t, bh, u1 - u0); g.translate(B0 - t / 2, F.y + bh / 2, (u0 + u1) / 2); g.rotateY(a); S.geo("s", g);
      const L = u1 - u0; quads.push([P(B0 + 0.03, u0, F.y + 0.05), P(B0 + 0.03, u1, F.y + 0.05), P(B0 + 0.03, u1, F.y + bh - 0.05), P(B0 + 0.03, u0, F.y + bh - 0.05), 0, L / 2.6, 0, 1]);
    }
  }
  const nm = new THREE.MeshStandardMaterial({ map: nicheTex(), roughness: 0.9, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 });
  ctx.group.add(new THREE.Mesh(sheet(quads), nm));

  finish(ctx, Gr, { g: turf, f: far }, ["g"]);
  finish(ctx, Fl, { f: floor }, ["f"]);
  finish(ctx, S, { s: stone }, []);

  // ---- the line to Pawon and Mendut, and the sun setting on it (shown from its card)
  const L = D.line, grp = new THREE.Group(), rad = (d) => (d * Math.PI) / 180;
  const dirE = new THREE.Vector3(Math.sin(rad(L.azE)), 0, -Math.cos(rad(L.azE))), dirW = new THREE.Vector3(Math.sin(rad(L.azW)), 0, -Math.cos(rad(L.azW)));
  const pts = [dirW.clone().multiplyScalar(F.hw + 2).setY(0.12), dirW.clone().multiplyScalar(1300).setY(0.12)];
  const pts2 = [dirE.clone().multiplyScalar(F.hw + 6).setY(0.12), dirE.clone().multiplyScalar(1300).setY(0.12)];
  // the line drawn as a dashed gold strip on the ground, west and east of the foot
  const dash = new Bucket();
  for (const [p, q] of [pts, pts2]) {
    const d = q.clone().sub(p), L2 = d.length(); d.normalize(); const nx = -d.z * 0.3, nz = d.x * 0.3;
    for (let s = 0; s < L2; s += 6) {
      const a0 = p.clone().addScaledVector(d, s), a1 = p.clone().addScaledVector(d, Math.min(L2, s + 3.5));
      dash.quad("d", V(a0.x - nx, 0.1, a0.z - nz), V(a1.x - nx, 0.1, a1.z - nz), V(a1.x + nx, 0.1, a1.z + nz), V(a0.x + nx, 0.1, a0.z + nz));
    }
  }
  dash.build({ d: new THREE.MeshBasicMaterial({ color: "#e7c680", side: THREE.DoubleSide }) }, grp);
  const alt = rad(L.horizon + 0.3), eye = new THREE.Vector3(0, D.circ[2].y + 1.6, 0);
  const sun = new THREE.Group(); sun.position.copy(eye).add(dirW.clone().multiplyScalar(1450 * Math.cos(alt))).setY(eye.y + 1450 * Math.sin(alt)); sun.lookAt(eye);
  const disc = (r, c, op) => sun.add(new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })));
  disc(50, "#ff9a5a", 0.2); disc(22, "#ffbf80", 0.45); disc(7.5, "#ffe6c4", 1.0);
  grp.add(sun);
  ctx.outline("line", grp);

  // ---- signposts and the way back
  sign(ctx, ["Borobudur", "the east stairs · the pilgrim's way begins here"], F.hw + 8, 2.4, -4.4, Math.PI / 2, 3.4, 0.55, { size: 48 });
  sign(ctx, ["The Vestibule", "and back to the museum"], 128.9, 2.6, -2.4, -Math.PI / 2, 1.8, 0.45, { size: 54 });
  nearPortal(ctx, { w: 1.4, h: 2.2, tint: "#ffe2b0" }, 129.5, 0, 0, -Math.PI / 2);
  markers(ctx, site, "s1");
}
