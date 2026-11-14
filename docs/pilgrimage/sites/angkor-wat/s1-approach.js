/* I · The western approach: the ground and the far tree line, the moat with the causeway across it, the laterite
   enclosure wall, the western colonnade with its three-part gate and the elephant gates at its ends, the raised way
   with its naga balustrades, the two "libraries" and the two square pools; and the equinox sun (toggled from its
   card; built here because this section is loaded wherever the visitor stands on the site). Sizes in dims.js:
   the plan SURVEY, heights and the smaller buildings APPROX. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { nearPortal } from "./lod.js?v=1";

export function build(ctx) {
  const E = D.enc, M = D.moat, PW = D.pw, gp = D.gop, mw = D.mcw;
  const turf = ctx.mat("turf", { color: new THREE.Color("#8d9466") }), far = ctx.mat("turf", { color: new THREE.Color("#7d8a5c") });
  const sand = ctx.mat("limestone", { color: new THREE.Color("#9d968a") }).clone(), late = ctx.mat("rock", { color: new THREE.Color("#9a6448") });
  const floor = ctx.mat("floor", { color: new THREE.Color("#a49c8c") });
  sand.side = THREE.DoubleSide;   // the banks, pools and the way's sides are drawn one way round and seen from either side
  const water = new THREE.MeshStandardMaterial({ color: "#5d6c58", roughness: 0.25, metalness: 0.1 });
  const trees = new THREE.MeshStandardMaterial({ color: "#3f5233", roughness: 1, side: THREE.BackSide });
  const G = new Bucket(), W = new Bucket(), S = new Bucket(), Lt = new Bucket(), F = new Bucket();
  const flat = (B, k, x0, x1, z0, z1, y) => B.quad(k, V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0));
  const box = (B, k, x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(k, g); };

  // ---- the ground inside the moat (with the two pools cut out), and outside it out to the tree line
  const ix = -M.x0, iz = E.hz + M.bank, ox = -M.x1, oz = iz + M.w, P = D.pond;
  flat(G, "g", -ix, P.x0, -iz, iz, 0); flat(G, "g", P.x1, ix, -iz, iz, 0);
  flat(G, "g", P.x0, P.x1, -iz, -P.z1, 0); flat(G, "g", P.x0, P.x1, -P.z0, P.z0, 0); flat(G, "g", P.x0, P.x1, P.z1, iz, 0);
  const R = 1500;
  flat(G, "f", -R, -ox, -R, R, 0); flat(G, "f", ox, R, -R, R, 0); flat(G, "f", -ox, ox, -R, -oz, 0); flat(G, "f", -ox, ox, oz, R, 0);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R - 20, R - 20, 26, 40, 1, true), trees); band.position.y = 11; ctx.group.add(band);
  // ---- the moat: water, and the stepped stone banks down to it (drawn as plain walls)
  const wy = M.y;
  flat(W, "w", -ox, ox, -oz, -iz, wy); flat(W, "w", -ox, ox, iz, oz, wy); flat(W, "w", -ox, -ix, -iz, iz, wy); flat(W, "w", ix, ox, -iz, iz, wy);
  const bank = (x0, z0, x1, z1) => S.quad("s", V(x0, wy - 0.3, z0), V(x1, wy - 0.3, z1), V(x1, 0, z1), V(x0, 0, z0));
  bank(-ix, -iz, -ix, iz); bank(ix, iz, ix, -iz); bank(-ix, iz, ix, iz); bank(ix, -iz, -ix, -iz);              // the inner banks face out
  bank(-ox, oz, -ox, -oz); bank(ox, -oz, ox, oz); bank(ox, oz, -ox, oz); bank(-ox, -oz, ox, -oz);              // the outer banks face in
  // ---- the causeway over the moat, and on to the gate
  box(S, "s", -ox - 4, -E.hx - gp.d / 2, wy - 0.4, mw.y, -mw.hw, mw.hw);
  // ---- the laterite enclosure wall (its western middle is the colonnade)
  const t = 1.2, h = E.wallH;
  box(Lt, "l", -E.hx - t / 2, -E.hx + t / 2, 0, h, -E.hz, -gp.hz); box(Lt, "l", -E.hx - t / 2, -E.hx + t / 2, 0, h, gp.hz, E.hz);
  box(Lt, "l", E.hx - t / 2, E.hx + t / 2, 0, h, -E.hz, E.hz);
  box(Lt, "l", -E.hx, E.hx, 0, h, -E.hz - t / 2, -E.hz + t / 2); box(Lt, "l", -E.hx, E.hx, 0, h, E.hz - t / 2, E.hz + t / 2);
  // ---- the western colonnade: a back wall, a row of pillars on the moat side and a roof, broken by the gate
  const cx0 = -E.hx - gp.d / 2, cx1 = -E.hx + gp.d / 2, rh = 5.2;
  const gates = [[-gp.hz, -gp.hz + 9], [-36, -14], [-11, 11], [14, 36], [gp.hz - 9, gp.hz]];   // elephant gates, the three-part gate
  const runs = []; { let z = -gp.hz; for (const [a, b] of gates) { if (a > z) runs.push([z, a]); z = b; } }
  for (const [a, b] of runs) {
    box(S, "s", cx1 - 1.4, cx1, 0, rh, a, b);                                  // the back wall
    box(S, "s", cx0 + 0.2, cx1, rh, rh + 0.7, a, b);                           // the roof
    for (let z = a + 1.6; z < b - 0.8; z += 3.2) box(S, "s", cx0 + 0.5, cx0 + 1.3, 0, rh, z - 0.4, z + 0.4);
  }
  // the pavilions: solid blocks with a passage through the middle one, each with a truncated tower
  const pav = (z0, z1, ht, tower, passage) => {
    if (passage) { box(S, "s", cx0, cx1, 0, ht, z0, -passage); box(S, "s", cx0, cx1, 0, ht, passage, z1); box(S, "s", cx0, cx1, 4.2, ht, -passage, passage); }
    else box(S, "s", cx0, cx1, 0, ht, z0, z1);
    if (!tower) return;
    const zc = (z0 + z1) / 2, wz = (z1 - z0) / 2;
    for (let k = 0; k < 4; k++) { const s = 1 - k * 0.17; box(S, "s", -E.hx - gp.d / 2 * s, -E.hx + gp.d / 2 * s, ht + k * 2.2, ht + (k + 1) * 2.2, zc - wz * s, zc + wz * s); }
  };
  pav(-11, 11, gp.h + 1.5, true, 2.6); pav(-36, -14, gp.h, true); pav(14, 36, gp.h, true);
  pav(-gp.hz, -gp.hz + 9, gp.h - 1, false); pav(gp.hz - 9, gp.hz, gp.h - 1, false);
  // ---- the ramp from the gate up to the raised way, and the way itself on its base
  F.quad("f", V(cx1, mw.y, PW.hw), V(PW.x0, PW.y, PW.hw), V(PW.x0, PW.y, -PW.hw), V(cx1, mw.y, -PW.hw));
  flat(F, "f", cx0, cx1, -mw.hw, mw.hw, mw.y);
  flat(F, "f", PW.x0, PW.x1, -PW.hw, PW.hw, PW.y);
  for (const s of [-1, 1]) S.quad("s", V(PW.x0, 0, s * PW.hw), V(PW.x1, 0, s * PW.hw), V(PW.x1, PW.y, s * PW.hw), V(PW.x0, PW.y, s * PW.hw));
  // the naga balustrades: a serpent's body on short posts along each edge, a raised hood of seven heads at each end,
  // and six stairs down from each side (shown as breaks)
  const stairs = [0, 1, 2, 3, 4, 5].map((i) => PW.x0 + 30 + i * (PW.x1 - PW.x0 - 60) / 5);
  for (const s of [-1, 1]) {
    const z = s * (PW.hw - 0.3);
    let xa = PW.x0;
    for (const xs of stairs.concat([PW.x1])) {
      const xb = Math.min(xs - 2.5, PW.x1);
      if (xb > xa) { const body = new THREE.CylinderGeometry(0.22, 0.22, xb - xa, 8); body.rotateZ(Math.PI / 2); body.translate((xa + xb) / 2, PW.y + 0.85, z); S.geo("s", body); }
      for (let x = xa + 1; x < xb; x += 3) box(S, "s", x - 0.15, x + 0.15, PW.y, PW.y + 0.7, z - 0.15, z + 0.15);
      xa = xs + 2.5;
    }
    for (const xh of [PW.x0 + 0.6, PW.x1 - 0.6]) {
      const hood = new THREE.Shape(); hood.moveTo(-1.3, 0);
      for (let k = 0; k < 7; k++) { const a = Math.PI * (0.95 - k * 0.15), r = k === 3 ? 1.7 : 1.35; hood.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      hood.lineTo(1.3, 0); hood.lineTo(-1.3, 0);
      const g = new THREE.ExtrudeGeometry(hood, { depth: 0.3, bevelEnabled: false }); g.rotateY(Math.PI / 2); g.translate(xh, PW.y + 0.6, z - 0.15 * s); S.geo("s", g);
    }
  }
  // ---- the two "libraries": raised halls with a porch on each side and a pitched roof
  const Lb = D.lib;
  for (const s of [-1, 1]) {
    const x = Lb.x, z = s * Lb.z;
    box(S, "s", x - Lb.hx - 1, x + Lb.hx + 1, 0, 1.2, z - Lb.hz - 1, z + Lb.hz + 1);
    box(S, "s", x - Lb.hx, x + Lb.hx, 1.2, 4.6, z - Lb.hz, z + Lb.hz);
    for (const [px, pz, sx, sz] of [[x - Lb.hx - 2, z, 2, 3], [x + Lb.hx + 2, z, 2, 3], [x, z - Lb.hz - 2, 3, 2], [x, z + Lb.hz + 2, 3, 2]]) box(S, "s", px - sx, px + sx, 1.2, 4.0, pz - sz, pz + sz);
    const roof = new THREE.CylinderGeometry(0.01, Lb.hz, Lb.h - 4.6 + 1, 4, 1); roof.rotateY(Math.PI / 4); roof.scale(Lb.hx / Lb.hz, 1, 1); roof.translate(x, 4.6 + (Lb.h - 3.6) / 2, z); S.geo("s", roof);
  }
  // ---- the two square pools: sunken, with stone steps (as a stepped rim)
  for (const s of [-1, 1]) {
    const z0 = s > 0 ? P.z0 : -P.z1, z1 = s > 0 ? P.z1 : -P.z0;
    for (let k = 0; k < 3; k++) {
      const i = k * 1.2, y0 = -k * 0.5, y1 = -(k + 1) * 0.5;
      const a = P.x0 + i, b = P.x1 - i, c = z0 + i, d = z1 - i;
      S.quad("s", V(a, y0, c), V(b, y0, c), V(b, y1, c), V(a, y1, c)); S.quad("s", V(b, y0, d), V(a, y0, d), V(a, y1, d), V(b, y1, d));
      S.quad("s", V(a, y0, d), V(a, y0, c), V(a, y1, c), V(a, y1, d)); S.quad("s", V(b, y0, c), V(b, y0, d), V(b, y1, d), V(b, y1, c));
      if (k < 2) { const j = i + 1.2; flat(S, "s", a, b, c, c + 1.2, y1); flat(S, "s", a, b, d - 1.2, d, y1); flat(S, "s", a, a + 1.2, c + 1.2, d - 1.2, y1); flat(S, "s", b - 1.2, b, c + 1.2, d - 1.2, y1); }
    }
    flat(W, "w", P.x0 + 3.6, P.x1 - 3.6, z0 + 3.6, z1 - 3.6, -1.3);
  }

  finish(ctx, G, { g: turf, f: far }, ["g"]);
  finish(ctx, W, { w: water }, []);
  finish(ctx, S, { s: sand }, []);
  finish(ctx, Lt, { l: late }, []);
  finish(ctx, F, { f: floor }, ["f"]);

  // ---- the equinox sun (shown from its card): aimed from the viewpoint on the way over the central tower's top
  const top = new THREE.Vector3(0, D.l3.y + D.tw.c.h, 0), eye = new THREE.Vector3(D.eqView.x, D.eqView.y, 0);
  const dir = top.clone().sub(eye).normalize(), sunAt = eye.clone().add(dir.clone().multiplyScalar(1450));
  const sun = new THREE.Group(); sun.position.copy(sunAt); sun.lookAt(eye);
  const disc = (r, c, op) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); sun.add(m); return m; };
  disc(60, "#ffb070", 0.18); disc(26, "#ffcf8a", 0.45); disc(9, "#fff1d2", 1.0);
  ctx.outline("equinox", sun);

  // ---- signposts and the way back
  sign(ctx, ["Angkor Wat", "the western entrance · the temple faces west"], -E.hx - gp.d / 2 - 2, 3.4, 4.2, -Math.PI / 2, 3.4, 0.55, { size: 48 });
  sign(ctx, ["The Vestibule", "and back to the museum"], -755, 2.6, -2.4, Math.PI / 2, 1.8, 0.45, { size: 54 });
  nearPortal(ctx, { w: 1.4, h: 2.2, tint: "#ffe2b0" }, -756, 0, 0, Math.PI / 2);
  markers(ctx, site, "s1");
}
