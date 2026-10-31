/* III · The circular terraces: three round terraces stepping up from the plateau, each notched on the axes for
   its stairs, with rings of 32, 24 and 16 perforated stupas (a plain stand-in figure inside each), and the great
   central stupa. Sizes APPROX except the central stupa's top, 35 m above the ground (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { latticeTex, seated } from "./art.js?v=1";
import { box, steps, merged } from "./shapes.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";
import { nearPortal } from "./lod.js?v=1";

// a round terrace's top: a disc of radius r with a notch (depth d, half-width s) on each axis, in the XZ plane
function notchedDisc(r, d, s) {
  const sh = new THREE.Shape(), dl = Math.asin(s / r);
  for (let i = 0; i < 4; i++) {
    const ax = (i * Math.PI) / 2, c = Math.cos(ax), n = Math.sin(ax);
    const pin = (u, rr) => [c * rr - n * u, n * rr + c * u];
    const a = pin(-s, r - d), b = pin(s, r - d);
    if (i === 0) sh.moveTo(...pin(-s, r * Math.cos(dl))); else sh.lineTo(...pin(-s, r * Math.cos(dl)));
    sh.lineTo(...a); sh.lineTo(...b); sh.lineTo(...pin(s, r * Math.cos(dl)));
    sh.absarc(0, 0, r, ax + dl, ax + Math.PI / 2 - dl, false);
  }
  const g = new THREE.ShapeGeometry(sh, 24); g.rotateX(-Math.PI / 2); return g;
}

export function build(ctx) {
  const C = D.circ, sw = D.stair.hw, st = D.stupa, cs = D.cs;
  const stone = ctx.mat("block", { color: new THREE.Color("#7b7871") }).clone(); stone.side = THREE.DoubleSide;
  const floor = ctx.mat("floor", { color: new THREE.Color("#8c887e") });
  const fig = ctx.mat("block", { color: new THREE.Color("#55524c") });
  const lat = (sq) => new THREE.MeshStandardMaterial({ color: "#7e7a72", roughness: 0.92, alphaMap: latticeTex(sq), alphaTest: 0.5, side: THREE.DoubleSide });
  const S = new Bucket(), Fl = new Bucket(), Fg = new Bucket(), bells = [[], []];

  let yLow = D.top.y;
  for (let j = 0; j < C.length; j++) {
    const c = C[j], h = c.y - yLow, dl = Math.asin(sw / c.r), d = 2.5;
    // the terrace's wall: four arcs between the notches, and the notches' sides
    for (let i = 0; i < 4; i++) {
      const wall = new THREE.CylinderGeometry(c.r, c.r, h, 24, 1, true, (i * Math.PI) / 2 + dl, Math.PI / 2 - 2 * dl); wall.translate(0, yLow + h / 2, 0); S.geo("s", wall);
    }
    for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) for (const s of [-1, 1]) {
      const g = new THREE.PlaneGeometry(d + 0.4, h); g.rotateY(0); g.translate(c.r - d / 2 - 0.2, yLow + h / 2, s * sw); g.rotateY(a); S.geo("s", g);
    }
    const top = notchedDisc(c.r, d, sw); top.translate(0, c.y, 0); Fl.geo("f", top);
    steps(Fl, "f", c.r + 1.5, c.r - d, yLow, c.y, sw, 6);
    // the ring of stupas
    for (let i = 0; i < c.n; i++) {
      const th = (i + 0.5) * 2 * Math.PI / c.n, x = c.ring * Math.cos(th), z = c.ring * Math.sin(th), y = c.y;
      const base = new THREE.CylinderGeometry(st.r + 0.25, st.r + 0.35, 0.4, 8); base.translate(x, y + 0.2, z); S.geo("s", base);
      const prof = [[st.r * 1.0, 0], [st.r * 1.06, 0.12], [st.r * 1.0, 0.3], [st.r * 0.92, 0.5], [st.r * 0.74, 0.7], [st.r * 0.48, 0.88], [st.r * 0.22, 1.0]].map(([r, v]) => new THREE.Vector2(r, v * st.h * 0.72));
      const bell = new THREE.LatheGeometry(prof, 16); bell.translate(x, y + 0.4, z); bells[j === 2 ? 1 : 0].push(bell);
      box(S, "s", x - 0.45, x + 0.45, y + 0.4 + st.h * 0.72, y + 0.4 + st.h * 0.72 + 0.4, z - 0.45, z + 0.45);
      const fin = new THREE.ConeGeometry(0.22, st.fin, 8); fin.translate(x, y + 0.8 + st.h * 0.72 + st.fin / 2, z); S.geo("s", fin);
      for (const p of seated(x, y + 0.4, z, 1.0)) Fg.geo("g", p);
    }
    yLow = c.y;
  }
  // ---- the central stupa: a base, the great bell, a square block and the remains of its spire
  const y3 = C[2].y, bellH = cs.h * 0.62;
  const cb = new THREE.CylinderGeometry(cs.r + 0.6, cs.r + 0.9, 0.9, 32); cb.translate(0, y3 + 0.45, 0); S.geo("s", cb);
  const prof = [[cs.r, 0], [cs.r * 1.04, 0.1], [cs.r, 0.28], [cs.r * 0.9, 0.5], [cs.r * 0.72, 0.7], [cs.r * 0.45, 0.88], [cs.r * 0.18, 1.0]].map(([r, v]) => new THREE.Vector2(r, v * bellH));
  const bell = new THREE.LatheGeometry(prof, 32); bell.translate(0, y3 + 0.9, 0); S.geo("s", bell);
  const yb = y3 + 0.9 + bellH;
  box(S, "s", -1.3, 1.3, yb - 0.2, yb + 1.0, -1.3, 1.3);
  const spire = new THREE.CylinderGeometry(0.35, 0.7, cs.h - 0.9 - bellH - 1.0, 8); spire.translate(0, yb + 1.0 + (cs.h - 0.9 - bellH - 1.0) / 2, 0); S.geo("s", spire);

  finish(ctx, Fl, { f: floor }, ["f"]);
  finish(ctx, S, { s: stone }, []);
  finish(ctx, Fg, { g: fig }, []);
  ctx.group.add(merged(bells[0], lat(false))); ctx.group.add(merged(bells[1], lat(true)));
  sign(ctx, ["Down to the foot", "and the way back"], 2.0, C[2].y + 2.6, -16.8, 0, 2.2, 0.48, { size: 46 });
  nearPortal(ctx, { w: 1.4, h: 2.2, tint: "#ffe2b0" }, 0, C[2].y, -17.0, 0);
  markers(ctx, site, "s3");
}
