/* II · The Apadana stairs: the eastern of the hall's two staircases, a block about 82 m long against the podium,
   with a flight at each end climbing from the court to the podium and, along its front, the carved wings (guards
   and nobles; the delegations), the centre panel and the lion-and-bull spandrels. The reliefs are our own outline
   renderings (art.js). Sizes in dims.js: length SURVEY, the rest APPROX. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { frieze, lionBull, wingedDisc, panel } from "./art.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const A = D.ap, T = D.T, AY = A.y, x0 = A.sx, x1 = A.sx + A.stairD, xp = x1 - 0.7, L2 = A.stairLen / 2, zf = L2 - A.fl, par = 0.9;
  const stone = ctx.mat("limestone", { color: new THREE.Color("#8f8b83") }), two = stone.clone(); two.side = THREE.DoubleSide;
  const floor = ctx.mat("floor", { color: new THREE.Color("#a9a294") });
  const B = new Bucket(), F = new Bucket();
  const top = (z) => { const a = Math.abs(z); return a >= L2 ? T + par : a <= zf ? AY + par : T + par + (AY - T) * (L2 - a) / A.fl; };   // the parapet's top line
  // the carved front (x = x1) and the parapet's inner face (x = xp), with its top
  const zs = [-L2, -zf, zf, L2];
  for (let i = 0; i < 3; i++) {
    const za = zs[i], zb = zs[i + 1];
    for (const x of [x1, xp]) B.quad("s", V(x, T, za), V(x, T, zb), V(x, top(zb), zb), V(x, top(za), za));
    B.quad("s", V(xp, top(za), za), V(x1, top(za), za), V(x1, top(zb), zb), V(xp, top(zb), zb));
  }
  for (const z of [-L2, L2]) B.quad("s", V(xp, T, z), V(x1, T, z), V(x1, T + par, z), V(xp, T + par, z));
  // the two flights, from the court at each end up to the podium; the floor between them, at the podium's height
  const n = 28, run = A.fl / n, rise = (AY - T) / n;
  for (const sz of [-1, 1]) for (let k = 0; k < n; k++) {
    const za = sz * (L2 - k * run), zb = sz * (L2 - (k + 1) * run), y = T + (k + 1) * rise;
    F.quad("f", V(x0, y, za), V(xp, y, za), V(xp, y, zb), V(x0, y, zb));
    B.quad("s", V(x0, y - rise, za), V(xp, y - rise, za), V(xp, y, za), V(x0, y, za));
  }
  F.quad("f", V(x0 - 0.01, AY, zf), V(xp, AY, zf), V(xp, AY, -zf), V(x0 - 0.01, AY, -zf));
  finish(ctx, F, { f: floor }, ["f"]);
  finish(ctx, B, { s: two }, []);
  // the reliefs on the front, facing east
  const E = Math.PI / 2, xr = x1 + 0.03, wingL = zf - 4.0, wz = (zf + 4.0) / 2, rh = 3.3;
  const nob = panel(ctx, frieze("nobles", 7, wingL / rh), wingL, rh, xr, T + 0.2 + rh / 2, -wz, E); nob.scale.x = -1;   // the north wing walks south, to the centre
  panel(ctx, frieze("nations", 19, wingL / rh), wingL, rh, xr, T + 0.2 + rh / 2, wz, E);                                 // the south wing walks north
  panel(ctx, wingedDisc(), 7.2, 1.8, xr, T + 1.5 + 0.9, 0, E);
  const lb = lionBull();
  for (const s of [-1, 1]) { const m = panel(ctx, lb, 5.0, 2.5, xr, T + 1.6, s * (zf + 4.7), E); if (s > 0) m.scale.x = -1; }
  sign(ctx, ["The Apadana", "the east staircase · the audience hall above"], x1 + 14, T + 2.4, -L2 - 6, Math.PI / 2, 3.0, 0.5, { size: 50 });
  markers(ctx, site, "s2");
}
