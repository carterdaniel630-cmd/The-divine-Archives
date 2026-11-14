/* I · The Great Platform: the plaza and the forest round it, the pyramid of Kukulkan (nine stepped bodies, four
   stairways, the serpent heads at the foot of the north stairway, the temple on top), the switchable pattern of
   light on the north stairway and the outline of the inner pyramid, the platform of skulls, and the Temple of
   the Warriors with its colonnade. The plaza and the forest are built here for all the outdoor sections.
   Pyramid sizes published; everything else APPROX (dims.js); carvings our own (maya.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { box, oquad, body, stairs, skullsMat, lightTex, blocksMat, UP } from "./maya.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const CS = D.cas, PZ = D.plaza, TZ = D.tz, WR = D.war;
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

// a dashed outline of a square stepped mass (half-width a at the foot, b at height h), like kit.js outlineBox
function outlineFrustum(cx, cz, a, b, h, color) {
  const g = new THREE.EdgesGeometry(new THREE.CylinderGeometry(b * Math.SQRT2, a * Math.SQRT2, h, 4, 1).rotateY(Math.PI / 4));
  const m = new THREE.LineDashedMaterial({ color, dashSize: 0.6, gapSize: 0.4, transparent: true, opacity: 0.95, depthTest: false });
  const l = new THREE.LineSegments(g, m); l.computeLineDistances(); l.position.set(cx, h / 2, cz); l.renderOrder = 10;
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(b * Math.SQRT2, a * Math.SQRT2, h, 4, 1).rotateY(Math.PI / 4), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, depthTest: false, depthWrite: false }));
  fill.renderOrder = 9; l.add(fill); return l;
}

export function build(ctx) {
  const grass = ctx.mat("turf", { color: new THREE.Color("#93a06a") });
  const stone = blocksMat("#c9c0aa", 7), stoneD = blocksMat("#b3a990", 11);
  const plain = ctx.mat("limestone", { color: new THREE.Color("#cbc2ad") });
  const dark = new THREE.MeshBasicMaterial({ color: "#211a12" });
  const far = new THREE.MeshStandardMaterial({ color: "#7f8c5c", roughness: 1 });
  const forest = new THREE.MeshStandardMaterial({ color: "#46593a", roughness: 1, flatShading: true });
  const trunkM = new THREE.MeshStandardMaterial({ color: "#6b5a46", roughness: 1 });
  const G = new Bucket(), P = new Bucket(), W = new Bucket(), T = new Bucket();

  // ---- the plaza (walkable) and the ground beyond it, out to the forest
  oquad(G, "g", V(PZ.x0, 0, PZ.z0), V(PZ.x1, 0, PZ.z0), V(PZ.x1, 0, PZ.z1), V(PZ.x0, 0, PZ.z1), UP);
  const xs = [-1400, -500, PZ.x0, PZ.x1, 600, 1400], zs = [-1400, -600, PZ.z0, PZ.z1, 700, 1400];
  for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) {
    if (i === 2 && j === 2) continue;
    if (i === 2 && j === 1) {                                      // leave the rim of the cenote open (s3-cenote.js builds it)
      const RM = D.rim, f = (x0, x1, z0, z1) => oquad(G, "f", V(x0, -0.04, z0), V(x1, -0.04, z0), V(x1, -0.04, z1), V(x0, -0.04, z1), UP);
      f(xs[2], RM.x0, zs[1], zs[2]); f(RM.x1, xs[3], zs[1], zs[2]); f(RM.x0, RM.x1, zs[1], RM.z0); f(RM.x0, RM.x1, RM.z1, zs[2]);
      continue;
    }
    oquad(G, "f", V(xs[i], -0.04, zs[j]), V(xs[i + 1], -0.04, zs[j]), V(xs[i + 1], -0.04, zs[j + 1]), V(xs[i], -0.04, zs[j + 1]), UP);
  }
  // the trees: low rounded crowns round the plaza, kept off the causeway, the path south and the open ground
  const R = rng(13), clear = [[-14, 14, -460, PZ.z0], [-56, -24, PZ.z1, 600], [-110, 30, 460, 600], [-50, 50, -450, -350], [55, 66, -80, -70]];
  let n = 0;
  for (let i = 0; i < 2600 && n < 520; i++) {
    const x = -520 + R() * 900, z = -560 + R() * 1200;
    if (x > PZ.x0 - 4 && x < PZ.x1 + 4 && z > PZ.z0 - 4 && z < PZ.z1 + 4) continue;
    if (clear.some(([a, b, c, d]) => x > a && x < b && z > c && z < d)) continue;
    const h = 7 + R() * 7, r = 2.4 + R() * 2.6;
    const t = new THREE.CylinderGeometry(0.2, 0.3, h * 0.5, 5); t.translate(x, h * 0.25, z); T.geo("tr", t);
    const c = new THREE.IcosahedronGeometry(r, 0); c.scale(1, 0.75, 1); c.translate(x, h * 0.55 + r * 0.4, z); T.geo("cr", c);
    n++;
  }
  // the forest wall far off, on every side
  const ring = 36; for (let i = 0; i < ring; i++) {
    const a0 = i / ring * Math.PI * 2, a1 = (i + 1) / ring * Math.PI * 2, r0 = 760;
    const p = (a, y) => V(Math.cos(a) * r0, y, 60 + Math.sin(a) * r0);
    oquad(T, "cr", p(a0, -1), p(a1, -1), p(a1, 16 + 4 * Math.sin(i * 1.7)), p(a0, 16 + 4 * Math.sin(i * 1.3)), V(-Math.cos((a0 + a1) / 2), 0, -Math.sin((a0 + a1) / 2)));
  }

  // ---- the pyramid: nine stepped bodies, each with a sloping face and a narrow ledge
  const hb = CS.base / 2, ht = CS.top / 2, dh = CS.h / CS.terraces, dw = (hb - ht) / CS.terraces;
  for (let k = 0; k < CS.terraces; k++) {
    const a = hb - k * dw, y0 = k * dh;
    body(P, "s", CS.x, CS.z, a, a - dw * 0.62, y0, y0 + dh * 0.82, null);
    body(P, "s", CS.x, CS.z, a - dw * 0.62, a - dw * 0.62, y0 + dh * 0.82, y0 + dh, "t");   // the moulding band and ledge
  }
  // four stairways of 91 steps, each between two balustrades; the foot of each lies half a slope out from the base
  const sw = CS.stairW / 2, bw = CS.balW, foot = ht + CS.h;
  const dirs = [[0, 1], [-1, 0], [0, -1], [1, 0]];                 // north stair rises southward, east stair westward, ...
  for (const [dx, dz] of dirs) {
    const fx = CS.x - dx * foot, fz = CS.z - dz * foot;
    stairs(P, "t", fx, fz, dx, dz, CS.stairW, 0, CS.h, CS.h, CS.steps);
    for (const s of [-1, 1]) {
      // a balustrade: a sloping strip of stone with its outer side face down to the ground
      const px = -dz * s, pz = dx * s, o0 = sw, o1 = sw + bw;
      const at = (u, o, y) => V(fx + dx * u + px * o, y, fz + dz * u + pz * o);
      oquad(P, "s", at(0, o0, 0.9), at(0, o1, 0.9), at(CS.h, o1, CS.h + 0.9), at(CS.h, o0, CS.h + 0.9), UP);
      oquad(P, "s", at(0, o1, 0), at(CS.h, o1, 0), at(CS.h, o1, CS.h + 0.9), at(0, o1, 0.9), V(px, 0, pz));
      oquad(P, "s", at(0, o0, 0.0), at(0, o0, 0.9), at(CS.h, o0, CS.h + 0.9), at(CS.h, o0, CS.h), V(-px, 0, -pz));
      oquad(P, "s", at(0, o0, 0), at(0, o1, 0), at(0, o1, 0.9), at(0, o0, 0.9), V(-dx, 0, -dz));
    }
  }
  // the serpent heads at the foot of the north stairway: open-jawed heads on the ends of the balustrades
  for (const s of [-1, 1]) {
    const x = CS.x + s * (sw + bw / 2), z = CS.z - foot;
    box(W, "h", x - 0.85, x + 0.85, 0, 1.25, z - 1.9, z + 0.2);           // the head
    box(W, "h", x - 0.8, x + 0.8, 0, 0.35, z - 2.3, z - 1.7);             // the lower jaw
    box(W, "h", x - 0.9, x + 0.9, 1.05, 1.5, z - 2.2, z - 1.2);           // the upper jaw and snout
    box(W, "d", x - 0.7, x + 0.7, 0.35, 1.05, z - 2.05, z - 1.75);        // the open mouth
    for (const e of [-1, 1]) box(W, "d", x + e * 0.86 - 0.08, x + e * 0.86 + 0.08, 1.0, 1.25, z - 1.0, z - 0.7);   // the eyes
  }
  // the temple on top: walls with doorways (three to the north), a frieze band and a flat roof with a parapet
  const TP = CS.temple, ty = CS.h, th = TP.s / 2;
  box(W, "w", CS.x - th, CS.x + th, ty, ty + TP.h * 0.62, CS.z - th, CS.z + th);
  box(W, "w", CS.x - th - 0.25, CS.x + th + 0.25, ty + TP.h * 0.62, ty + TP.h * 0.9, CS.z - th - 0.25, CS.z + th + 0.25);
  box(W, "w", CS.x - th - 0.35, CS.x + th + 0.35, ty + TP.h * 0.9, ty + TP.h, CS.z - th - 0.35, CS.z + th + 0.35);
  const door = (x, z, nx, nz, w) => { const px = Math.abs(nz), pz = Math.abs(nx); oquad(W, "d", V(x - px * w / 2 + nx * 0.02, ty, z - pz * w / 2 + nz * 0.02), V(x + px * w / 2 + nx * 0.02, ty, z + pz * w / 2 + nz * 0.02), V(x + px * w / 2 + nx * 0.02, ty + 2.9, z + pz * w / 2 + nz * 0.02), V(x - px * w / 2 + nx * 0.02, ty + 2.9, z - pz * w / 2 + nz * 0.02), V(nx, 0, nz)); };
  for (const dx of [-3.4, 0, 3.4]) door(CS.x + dx, CS.z - th, 0, -1, 2.2);
  door(CS.x, CS.z + th, 0, 1, 2.4); door(CS.x - th, CS.z, -1, 0, 2.4); door(CS.x + th, CS.z, 1, 0, 2.4);
  // the two serpent columns in the north doorway
  for (const dx of [-1.7, 1.7]) box(W, "h", CS.x + dx - 0.4, CS.x + dx + 0.4, ty, ty + TP.h * 0.62, CS.z - th - 0.5, CS.z - th + 0.1);

  // ---- the pattern of light on the side of the north stairway (an overlay, switched on from the card)
  {
    const x = CS.x - sw - bw - 0.04, zf = CS.z - foot, zt = CS.z - ht, yAt = (z) => (z - zf) + 0.9;
    const g = new THREE.BufferGeometry(), za = zt, zb = zf + 1.2, band = 2.4;
    const pts = [[za, yAt(za)], [zb, yAt(zb)], [zb, Math.max(0, yAt(zb) - band)], [za, yAt(za) - band]];
    g.setAttribute("position", new THREE.Float32BufferAttribute([x, pts[0][1], pts[0][0], x, pts[1][1], pts[1][0], x, pts[2][1], pts[2][0], x, pts[0][1], pts[0][0], x, pts[2][1], pts[2][0], x, pts[3][1], pts[3][0]], 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0], 2));
    const shade = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: "#1c140c", transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
    const light = new THREE.Mesh(g.clone().translate(-0.02, 0, 0), new THREE.MeshBasicMaterial({ map: lightTex(7), transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    const grp = new THREE.Group(); grp.add(shade); grp.add(light); shade.renderOrder = 5; light.renderOrder = 6;
    ctx.outline("serpent", grp);
  }
  // ---- roughly where the inner pyramid lies (a guess at its size, not a survey)
  {
    const grp = new THREE.Group();
    grp.add(outlineFrustum(CS.x, CS.z, 16.5, 7.5, 17, "#e7c680"));
    const t = outlineFrustum(CS.x, CS.z, 4.5, 4.5, 4.5, "#e7c680"); t.position.y = 17 + 2.25; grp.add(t);
    ctx.outline("inner", grp);
  }

  // ---- the platform of skulls: low walls carved with rows of skulls, a plain top, a stair on the east
  box(W, "k", TZ.x0, TZ.x1, 0, TZ.h, TZ.z0, TZ.z1);
  box(W, "w", TZ.x0 - 0.2, TZ.x1 + 0.2, TZ.h, TZ.h + 0.25, TZ.z0 - 0.2, TZ.z1 + 0.2);
  stairs(W, "w", TZ.x1 + 2.0, (TZ.z0 + TZ.z1) / 2, -1, 0, 4.0, 0, TZ.h + 0.25, 2.0, 6);
  // ---- the Temple of the Warriors: four stepped bodies, a stair on the west, the temple, and the colonnade
  const wx = (WR.x0 + WR.x1) / 2, wz = (WR.z0 + WR.z1) / 2, wa = (WR.x1 - WR.x0) / 2, wt = 13, wdh = WR.h / 4;
  for (let k = 0; k < 4; k++) body(P, "s", wx, wz, wa - k * (wa - wt) / 4, wa - (k + 0.7) * (wa - wt) / 4, k * wdh, (k + 1) * wdh, "t");
  stairs(P, "t", WR.x0 - 6, wz, 1, 0, 9, 0, WR.h, 6 + (wa - wt), 34);
  box(W, "w", wx - 9, wx + 9, WR.h, WR.h + 5, wz - 7, wz + 7);
  for (let x = WR.cols.x0; x <= WR.cols.x1; x += 3) for (let z = WR.cols.z0; z <= WR.cols.z1; z += 3.3) {
    const c = new THREE.CylinderGeometry(0.42, 0.45, 3.6, 8); c.translate(x, 1.8, z); W.geo("c", c);
  }

  finish(ctx, G, { g: grass, f: far }, ["g"]);
  finish(ctx, T, { tr: trunkM, cr: forest }, []);
  finish(ctx, P, { s: stone, t: stoneD }, []);
  finish(ctx, W, { h: plain, d: dark, w: stoneD, k: skullsMat(), c: plain }, []);

  sign(ctx, ["Chichén Itzá", "the Great Platform · Yucatán"], -48.5, 2.2, -70.5, -2.45, 2.6, 0.62);
  sign(ctx, ["Back to the Vestibule"], 60, 2.9, -76.3, -Math.PI / 2, 1.6, 0.36, { size: 56 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#fff0d8" }, 60, 0, -75, -Math.PI / 2);
  markers(ctx, site, "s1");
}
