/* II · The galleries: the five square levels, each a block whose outer face is the main wall of the gallery
   below and whose top is the floor of the gallery above; a notch on each axis for the stairs, a balustrade along
   each level's edge with its niches facing out, a plain gateway frame over each stair, and the carved panels on
   the main walls (our own renderings, art.js), drawn as one sheet. Heights and depths APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { reliefTex, nicheTex, sheet } from "./art.js?v=1";
import { box, steps, notchedEdges, SIDES } from "./shapes.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const G = D.gal, sw = D.stair.hw, nd = 2.0, t = G.wallT, bh = G.balH;
  const stone = ctx.mat("block", { color: new THREE.Color("#7b7871") }).clone(); stone.side = THREE.DoubleSide;
  const floor = ctx.mat("floor", { color: new THREE.Color("#8c887e") });
  const S = new Bucket(), Fl = new Bucket(), rel = [], nic = [];
  const flat = (x0, x1, z0, z1, y) => Fl.quad("f", V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0));
  const side = (a) => { const c = Math.cos(a), n = -Math.sin(a); return (r, u, y) => V(c * r - n * u, y, n * r + c * u); };

  for (let k = 0; k < G.n; k++) {
    const m = D.mainW(k), ya = D.galY(k), yb = D.galY(k + 1);
    // the level's faces (the main wall), round the notches
    for (const [x0, z0, x1, z1] of notchedEdges(m, nd, sw)) S.quad("s", V(x0, ya, z0), V(x1, ya, z1), V(x1, yb, z1), V(x0, yb, z0));
    // its top: the middle square and the strips beside the notches
    flat(-(m - nd), m - nd, -(m - nd), m - nd, yb);
    for (const a of SIDES) {
      const P = side(a);
      for (const [u0, u1] of [[-m, -sw], [sw, m]]) { const p = P(m - nd, u0, yb), q = P(m, u1, yb); flat(Math.min(p.x, q.x), Math.max(p.x, q.x), Math.min(p.z, q.z), Math.max(p.z, q.z), yb); }
      // the reliefs on the main wall, two registers, either side of the notch
      for (const [u0, u1] of [[-m + 0.6, -sw - 0.4], [sw + 0.4, m - 0.6]]) {
        const L = u1 - u0, y0 = ya + 0.45, y1 = ya + Math.min(3.1, yb - ya - 0.3);
        rel.push([P(m + 0.03, u0, y0), P(m + 0.03, u1, y0), P(m + 0.03, u1, y1), P(m + 0.03, u0, y1), u0 / 10.4, u0 / 10.4 + L / 10.4, 0, 1]);
      }
      // the balustrade on the level's edge (the next gallery's outer wall), its niches facing out, and the gateway frame
      for (const [u0, u1] of [[-m, -sw - 0.3], [sw + 0.3, m]]) {
        const g = new THREE.BoxGeometry(t, bh, u1 - u0); g.translate(m - t / 2, yb + bh / 2, (u0 + u1) / 2); g.rotateY(a); S.geo("s", g);
        nic.push([P(m + 0.03, u0, yb + 0.05), P(m + 0.03, u1, yb + 0.05), P(m + 0.03, u1, yb + bh - 0.05), P(m + 0.03, u0, yb + bh - 0.05), 0, (u1 - u0) / 2.6, 0, 1]);
      }
      for (const s of [-1, 1]) { const g = new THREE.BoxGeometry(t, 3.2, 0.5); g.translate(m - t / 2, yb + 1.6, s * (sw + 0.25)); g.rotateY(a); S.geo("s", g); }
      const lin = new THREE.BoxGeometry(t, 0.6, 2 * sw + 1.0); lin.translate(m - t / 2, yb + 3.5, 0); lin.rotateY(a); S.geo("s", lin);
      const cap = new THREE.BoxGeometry(t * 0.8, 0.5, 2 * sw); cap.translate(m - t / 2, yb + 4.05, 0); cap.rotateY(a); S.geo("s", cap);
    }
    // the stairs up through the notch, on every side
    steps(Fl, "f", m + 1.5, m - nd, ya, yb, sw, 10);
  }

  finish(ctx, Fl, { f: floor }, ["f"]);
  finish(ctx, S, { s: stone }, []);
  const rt = reliefTex(); rt.repeat.set(1, 1);
  const sheetMat = (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.9, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 });
  ctx.group.add(new THREE.Mesh(sheet(rel), sheetMat(rt)));
  ctx.group.add(new THREE.Mesh(sheet(nic), sheetMat(nicheTex())));
  markers(ctx, site, "s2");
}
