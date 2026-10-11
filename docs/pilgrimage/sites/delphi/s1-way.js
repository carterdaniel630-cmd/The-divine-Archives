/* I · The Sacred Way: the hillside of the sanctuary and the cliffs behind it, the main gate, the bases of the
   offerings along the lower way, the Siphnian and Athenian Treasuries, the Rock of the Sibyl and the Naxian
   Sphinx, and the Stoa of the Athenians against the Polygonal Wall. The hillside and the far landscape are
   built here for the three sections that share the open ground. Placings APPROX (dims.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { doric, ionic, box, gable, vrect, oquad, friezeMat, figureFriezeMat, polygonalMat, lettersTex, panel, hillside, pad, padFloor, UP } from "./greek.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

const TH = D.theatre;
const wCy = (x) => D.wayC.y + (D.wayC.y1 - D.wayC.y) * (x - D.wayC.x0) / (D.wayC.x1 - D.wayC.x0);
// every built area the hillside must give way to (the hillside is dropped under them and blended back)
export function pads() {
  const caveaR = TH.orchR + TH.rows * TH.rowD;
  const cavea = { x0: TH.x - caveaR, x1: TH.x + caveaR, z0: TH.z - caveaR, z1: TH.z + 1, sink: 0.6,
    at: (x, z) => { const r = Math.hypot(x - TH.x, z - TH.z); return TH.y + Math.max(0, Math.min(TH.rows, (r - TH.orchR) / TH.rowD)) * TH.rowH; } };
  return [D.gate, Object.assign({ axis: "x" }, D.wayA), D.k1, D.wayB, D.k2, Object.assign({ axis: "x" }, D.wayC), D.k3, D.wayD,
    { x0: D.polygonal.x0, x1: D.polygonal.x1, z0: D.polygonal.z - 1.6, z1: D.wayC.z0, axis: "x", y: wCy(D.polygonal.x0), y1: wCy(D.polygonal.x1) },
    Object.assign({}, D.terrace),
    { x0: D.athenian.x0 - 1, x1: D.athenian.x1 + 1, z0: D.athenian.z0 - 1, z1: D.marathon.z1 + 0.5, y: D.athenian.y - 0.75 },
    { x0: D.siphnian.x0 - 1, x1: D.siphnian.x1 + 1, z0: D.siphnian.z0 - 1, z1: D.siphnian.z1 + 1, y: D.siphnian.y - 0.6 },
    D.toTheatre, D.parodos, { x0: TH.x - TH.orchR - 1, x1: TH.x + TH.orchR + 1, z0: TH.z - 2, z1: D.skene.z1 + 1, y: TH.y },
  ].map((r) => (r.at ? r : pad(r))).concat([cavea]);
}
// the far landscape: Parnassus above the cliffs to the north, the valley of the Pleistos below to the south and
// the slopes of Kirphis across it. A coarse grid round the near hillside, which fills x, z in [-150, 150].
function farY(x, z) {
  if (z <= -160) return 300 + (-z - 160) * 0.08;
  if (z <= 700) return D.groundAt(x, z);
  if (z <= 1300) return D.groundAt(x, 700);
  return D.groundAt(x, 700) + (z - 1300) * 0.38;
}
function farLand(B, key) {
  const xs = [-2500, -1500, -800, -400, -150, 150, 400, 800, 1500, 2500];
  const zs = [-2500, -1500, -800, -400, -200, -160, -150, -110, -70, 150, 400, 700, 1300, 1800, 2500];
  for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i], xb = xs[i + 1], za = zs[j], zb = zs[j + 1];
    if (xa >= -150 && xb <= 150 && za >= -150 && zb <= 150) continue;      // the near hillside is there
    B.quad(key, V(xa, farY(xa, zb), zb), V(xb, farY(xb, zb), zb), V(xb, farY(xb, za), za), V(xa, farY(xa, za), za));
  }
}
// the Phaedriades: two cliffs over the sanctuary, split by the gorge of the Castalian spring to the east
function cliffs(B, key) {
  let s = 11; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const z = D.cliffs.z, yb = D.groundAt(0, z) - 6, n = 64, x0 = -420, x1 = 420;
  let prev = null;
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n, gorge = Math.abs(x - 82) < 14;
    const top = gorge ? yb + 30 : 300 - 20 * R() - 26 * Math.abs(Math.sin(i * 0.7));
    const zz = z - 4 * R() - (gorge ? 26 : 0);
    const p = { x, z: zz, top };
    if (prev) oquad(B, key, V(prev.x, yb, prev.z), V(x, yb, zz), V(x, top, zz), V(prev.x, prev.top, prev.z), V(0, 0, 1));
    prev = p;
  }
}
// small trees on the hillside: cypress spires and round olives, kept off the built areas
function trees(B, hAt, P) {
  let s = 5; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 420; k++) {
    const x = -145 + 290 * R(), z = -140 + 285 * R();
    if (P.some((p) => x > p.x0 - 3 && x < p.x1 + 3 && z > p.z0 - 3 && z < p.z1 + 3)) continue;
    const y = hAt(x, z), cyp = R() < 0.35;
    const g = cyp ? new THREE.ConeGeometry(0.9, 7 + 3 * R(), 7) : new THREE.IcosahedronGeometry(1.6 + R(), 0);
    g.translate(x, y + (cyp ? 4 : 1.8), z); B.geo(cyp ? "cy" : "ol", g);
  }
}
// a bronze figure on a base: a plain stand-in for a statue (body, head)
function figure(B, key, x, y, z, h) {
  const b = new THREE.CylinderGeometry(h * 0.1, h * 0.13, h * 0.82, 8); b.translate(x, y + h * 0.41, z); B.geo(key, b);
  const hd = new THREE.SphereGeometry(h * 0.075, 8, 6); hd.translate(x, y + h * 0.9, z); B.geo(key, hd);
}
function bull(B, key, x, y, z) {
  box(B, key, x - 1.1, x + 1.1, y + 0.7, y + 1.5, z - 0.4, z + 0.4);
  for (const [dx, dz] of [[-0.9, -0.3], [-0.9, 0.3], [0.9, -0.3], [0.9, 0.3]]) box(B, key, x + dx - 0.1, x + dx + 0.1, y, y + 0.75, z + dz - 0.1, z + dz + 0.1);
  box(B, key, x + 1.05, x + 1.6, y + 1.2, y + 1.7, z - 0.25, z + 0.25);
}
// a small treasury: crepis, walls, porch (columns or caryatids), frieze and gable. Faces east (front = x1) or west.
function treasury(B, o) {
  const { x0, x1, z0, z1, y } = o, h = o.h, front = o.front;   // front: "e" or "w"
  box(B, "st", x0 - 0.5, x1 + 0.5, y - 0.75, y - 0.5, z0 - 0.5, z1 + 0.5);
  box(B, "st", x0 - 0.25, x1 + 0.25, y - 0.5, y - 0.25, z0 - 0.25, z1 + 0.25);
  box(B, "m", x0, x1, y - 0.25, y, z0, z1);
  const porch = o.porch || 2.2, fx = front === "e" ? x1 : x0, bx = front === "e" ? x0 : x1, cx = front === "e" ? x1 - porch : x0 + porch;
  const wt = 0.45, wy1 = y + h;
  box(B, "m", Math.min(bx, cx), Math.max(bx, cx), y, wy1, z0, z0 + wt); box(B, "m", Math.min(bx, cx), Math.max(bx, cx), y, wy1, z1 - wt, z1);
  box(B, "m", Math.min(bx, bx + (front === "e" ? wt : -wt)), Math.max(bx, bx + (front === "e" ? wt : -wt)), y, wy1, z0, z1);
  // the porch: side walls run on (antae) to the front; the cross wall with its door
  box(B, "m", Math.min(cx, fx), Math.max(cx, fx), y, wy1, z0, z0 + wt); box(B, "m", Math.min(cx, fx), Math.max(cx, fx), y, wy1, z1 - wt, z1);
  const zm = (z0 + z1) / 2, dw = 0.8;
  box(B, "m", cx - wt / 2, cx + wt / 2, y, wy1, z0, zm - dw); box(B, "m", cx - wt / 2, cx + wt / 2, y, wy1, zm + dw, z1);
  box(B, "m", cx - wt / 2, cx + wt / 2, y + 3.0, wy1, zm - dw, zm + dw);
  box(B, "dk", cx - wt / 2 - 0.02, cx + wt / 2 + 0.02, y, y + 3.0, zm - dw, zm + dw);    // the door, closed
  const px = fx + (front === "e" ? -0.45 : 0.45);
  for (const zz of [zm - (z1 - z0) * 0.18, zm + (z1 - z0) * 0.18]) {
    if (o.caryatids) { figure(B, "m", px, y, zz, h * 0.78); box(B, "m", px - 0.35, px + 0.35, y + h * 0.8, y + h, zz - 0.35, zz + 0.35); }
    else doric(B, "m", px, y, zz, h, o.colR || 0.36, { seg: 16 });
  }
  return { top: wy1 };
}

export function build(ctx) {
  const P = pads();
  const ground = ctx.mat("rock", { color: new THREE.Color("#968c6a") });
  const far = new THREE.MeshStandardMaterial({ color: "#8f8a6e", roughness: 1, side: THREE.DoubleSide });
  const cliffM = ctx.mat("rock", { color: new THREE.Color("#b49d86") });
  const paving = ctx.mat("floor", { color: new THREE.Color("#cfc5b2") });
  const stone = ctx.mat("limestone", { color: new THREE.Color("#bdb4a4") });
  const marble = ctx.mat("gallery", { color: new THREE.Color("#efe9dd") });
  const bronze = new THREE.MeshStandardMaterial({ color: "#6b4f2e", roughness: 0.45, metalness: 0.7 });
  const roofM = new THREE.MeshStandardMaterial({ color: "#a65a3c", roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.8 });
  const cyp = new THREE.MeshStandardMaterial({ color: "#2f3d27", roughness: 1, flatShading: true });
  const olive = new THREE.MeshStandardMaterial({ color: "#6b7350", roughness: 1, flatShading: true });
  const H = new Bucket(), F = new Bucket(), W = new Bucket(), M = new Bucket(), Br = new Bucket(), Tr = new Bucket();
  // the hillside, the far land and the cliffs
  const hAt = hillside(H, "h", P, { x0: -150, x1: 150, z0: -150, z1: 150, cell: 3 });
  farLand(H, "far");
  cliffs(H, "cl");
  trees(Tr, hAt, P);
  // the paving of the Sacred Way
  for (const r of [D.gate, Object.assign({ axis: "x" }, D.wayA), D.k1, D.wayB, D.k2, Object.assign({ axis: "x" }, D.wayC), D.k3, D.wayD]) padFloor(F, "p", r, 10);
  // the precinct wall either side of the main gate (east side of the sanctuary), and the gateposts
  box(W, "st", 64.4, 65.4, D.gate.y - 2, D.gate.y + 3.2, 20, 63.4); box(W, "st", 64.4, 65.4, D.gate.y - 2, D.gate.y + 3.2, 70.6, 96);
  for (const z of [63.4, 70.6]) box(W, "m", 64.2, 65.6, D.gate.y, D.gate.y + 3.6, z - 0.6, z + 0.6);
  // the offerings: bases, and on them bronze figures (stand-ins), a bull; several bases left bare
  const wAy = (x) => D.wayA.y + (D.wayA.y1 - D.wayA.y) * (x - D.wayA.x0) / (D.wayA.x1 - D.wayA.x0);
  for (const o of D.offerings) {
    const y = wAy(o.x);
    if (o.kind === "arc") {
      const n = 14;
      for (let i = 0; i < n; i++) {
        const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n, ri = o.r - 1.2;
        const p = (r, a, yy) => V(o.x - Math.cos(a) * r, yy, o.z + Math.sin(a) * r);
        oquad(W, "st", p(ri, a0, y + o.h), p(ri, a1, y + o.h), p(o.r, a1, y + o.h), p(o.r, a0, y + o.h), UP);
        oquad(W, "st", p(ri, a0, y - 1), p(ri, a1, y - 1), p(ri, a1, y + o.h), p(ri, a0, y + o.h), V(o.x - Math.cos((a0 + a1) / 2) * -1, 0, -Math.sin((a0 + a1) / 2)));
      }
      for (let i = 0; i < o.n; i++) { if (i % 3 === 1) continue; const a = Math.PI * (i + 0.5) / o.n; figure(Br, "b", o.x - Math.cos(a) * (o.r - 0.6), y + o.h, o.z + Math.sin(a) * (o.r - 0.6), 2.1); }
      continue;
    }
    box(W, "st", o.x - o.w / 2, o.x + o.w / 2, y - 1, y + o.h, o.z - o.d / 2, o.z + o.d / 2);
    if (o.kind === "bull") bull(Br, "b", o.x, y + o.h, o.z);
    else for (let i = 0; i < o.n; i++) { if (i % 4 === 2) continue; figure(Br, "b", o.x - o.w / 2 + (i + 0.5) * o.w / o.n, y + o.h, o.z, 2.1); }
  }
  // two plain treasuries standing in for the twenty-odd others along the way
  treasury(M, { x0: 17, x1: 23.5, z0: 54.6, z1: 59.4, y: wAy(20) + 0.4, h: 4.6, front: "w" });
  treasury(M, { x0: -16.2, x1: -10.4, z0: 49, z1: 53.6, y: -8.2, h: 4.4, front: "w" });
  // the Siphnian Treasury: faces west, two caryatids for columns, a carved frieze all round
  const S = D.siphnian, sT = treasury(M, { x0: S.x0, x1: S.x1, z0: S.z0, z1: S.z1, y: S.y, h: S.h - 1.6, front: "w", caryatids: true, porch: 2.0 });
  box(M, "m", S.x0 - 0.1, S.x1 + 0.1, sT.top, sT.top + 0.5, S.z0 - 0.1, S.z1 + 0.1);
  box(M, "m", S.x0, S.x1, sT.top + 0.5, sT.top + 1.25, S.z0, S.z1);
  const frieze = friezeBand(S.x0 - 0.12, S.x1 + 0.12, S.z0 - 0.12, S.z1 + 0.12, sT.top + 0.5, 0.75);
  gable(M, "r", "m", S.x0, S.x1, S.z0, S.z1, sT.top + 1.25, 1.2, "x", 0.3);
  // the Athenian Treasury: faces east onto the way; Doric, two columns between the antae; triglyph frieze
  const A = D.athenian, aT = treasury(M, { x0: A.x0, x1: A.x1, z0: A.z0, z1: A.z1, y: A.y, h: A.colH, front: "e", colR: A.colR, porch: 2.3 });
  box(M, "m", A.x0 - 0.08, A.x1 + 0.08, aT.top, aT.top + 0.55, A.z0 - 0.08, A.z1 + 0.08);
  box(M, "m", A.x0, A.x1, aT.top + 0.55, aT.top + 1.17, A.z0, A.z1);
  const aFr = friezeBand(A.x0 - 0.1, A.x1 + 0.1, A.z0 - 0.1, A.z1 + 0.1, aT.top + 0.55, 0.62, true);
  box(M, "m", A.x0 - 0.3, A.x1 + 0.3, aT.top + 1.17, aT.top + 1.4, A.z0 - 0.3, A.z1 + 0.3);
  gable(M, "r", "m", A.x0, A.x1, A.z0, A.z1, aT.top + 1.4, 1.1, "x", 0.3);
  // the Marathon base along its south side, with a few stand-in figures
  box(W, "st", D.marathon.x0, D.marathon.x1, A.y - 1.6, A.y - 0.75 + D.marathon.h, D.marathon.z0, D.marathon.z1);
  for (let i = 0; i < 6; i++) if (i !== 2) figure(Br, "b", D.marathon.x0 + 1.2 + i * 2.0, A.y + 0.25, (D.marathon.z0 + D.marathon.z1) / 2, 2.0);
  // the hymns: a lettered panel high on the south wall (illustrative letters with signs above them)
  panel(ctx, lettersTex(["ΚΛΥΤ ΕΛΙΚΩΝΑ ΒΑΘΥΔΕΝΔΡΟΝ Α ΛΑΧΕΤ", "ΔΙΟΣ ΕΡΙΒΡΟΜΟΥ ΘΥΓΑΤΡΕΣ ΕΥΩΛΕΝΟΙ", "ΜΟΛΕΤΕ ΣΥΝΟΜΑΙΜΟΝ ΙΝΑ ΦΟΙΒΟΝ ΩΙΔΑΙΣΙ"], { notes: true, size: 54, w: 1024, h: 420 }), 5.6, 2.3, (A.x0 + A.x1) / 2, A.y + 2.6, A.z1 + 0.012, Math.PI);
  // the Rock of the Sibyl, and the Sphinx of the Naxians on its column
  const rock = new THREE.IcosahedronGeometry(D.sibyl.r, 1); { const p = rock.attributes.position; for (let i = 0; i < p.count; i++) { const k = 0.75 + 0.35 * Math.abs(Math.sin(i * 2.3)); p.setXYZ(i, p.getX(i) * k * 1.3, p.getY(i) * k * 0.8, p.getZ(i) * k); } }
  rock.translate(D.sibyl.x, -6.6 + 0.9, D.sibyl.z); W.geo("rk", rock);
  const sy = D.groundAt(D.sphinx.x, D.sphinx.z);
  box(W, "st", D.sphinx.x - 1.2, D.sphinx.x + 1.2, sy - 2, -5.2, D.sphinx.z - 1.2, D.sphinx.z + 1.2);
  ionic(M, "m", D.sphinx.x, -5.2, D.sphinx.z, D.sphinx.colH, 0.42, 0);
  const sx = D.sphinx.x, sY = -5.2 + D.sphinx.colH;
  box(M, "m", sx - 0.7, sx + 0.7, sY, sY + 0.9, D.sphinx.z - 0.3, D.sphinx.z + 0.3);
  box(M, "m", sx - 0.75, sx - 0.25, sY + 0.9, sY + 1.8, D.sphinx.z - 0.22, D.sphinx.z + 0.22);
  const wing = new THREE.BufferGeometry().setFromPoints([V(sx - 0.2, sY + 0.9, D.sphinx.z), V(sx + 0.8, sY + 2.2, D.sphinx.z), V(sx + 0.6, sY + 0.8, D.sphinx.z)]); wing.setIndex([0, 1, 2, 0, 2, 1]); M.geo("m", wing);
  // the Polygonal Wall holding up the temple terrace, and its continuation east as a plain retaining wall
  const PW = D.polygonal, pwM = polygonalMat();
  vrect(W, "pw", PW.x0, PW.z, PW.x1, PW.z, -7.5, 0, V(0, 0, 1));
  vrect(W, "st", D.k3.x1, PW.z, D.terrace.x1, PW.z, -9, 0, V(0, 0, 1));
  box(W, "st", PW.x0, D.terrace.x1, -0.12, 0.05, PW.z - 0.4, PW.z + 0.02);
  // the Stoa of the Athenians: a slender Ionic colonnade against the wall, with a lean-to roof
  const SA = D.stoa;
  box(W, "st", SA.x0, SA.x1, SA.y - 0.6, SA.y, SA.z0, SA.z1);
  for (let i = 0; i < SA.n; i++) ionic(M, "m", SA.x0 + 1.5 + i * (SA.x1 - SA.x0 - 3) / (SA.n - 1), SA.y, SA.z1 - 0.5, SA.colH, 0.2, 0);
  box(M, "m", SA.x0 + 0.8, SA.x1 - 0.8, SA.y + SA.colH, SA.y + SA.colH + 0.35, SA.z1 - 0.8, SA.z1 - 0.2);
  oquad(M, "r", V(SA.x0 + 0.6, SA.y + SA.colH + 0.35, SA.z1 - 0.1), V(SA.x1 - 0.6, SA.y + SA.colH + 0.35, SA.z1 - 0.1), V(SA.x1 - 0.6, SA.y + SA.colH + 1.3, SA.z0), V(SA.x0 + 0.6, SA.y + SA.colH + 1.3, SA.z0), UP);
  oquad(M, "m", V(SA.x0 + 0.6, SA.y + SA.colH + 0.34, SA.z1 - 0.1), V(SA.x1 - 0.6, SA.y + SA.colH + 0.34, SA.z1 - 0.1), V(SA.x1 - 0.6, SA.y + SA.colH + 1.29, SA.z0), V(SA.x0 + 0.6, SA.y + SA.colH + 1.29, SA.z0), V(0, -1, 0));
  finish(ctx, H, { h: ground, far, cl: cliffM }, ["h"]);
  finish(ctx, F, { p: paving }, ["p"]);
  finish(ctx, W, { st: stone, m: marble, pw: pwM, rk: cliffM }, []);
  finish(ctx, M, { m: marble, r: roofM, dk: dark, st: stone }, []);
  finish(ctx, Br, { b: bronze }, []);
  finish(ctx, Tr, { cy: cyp, ol: olive }, []);
  // the friezes: painted bands round the two treasuries
  for (const f of [frieze, aFr]) for (const m of f) ctx.group.add(m);
  sign(ctx, ["Delphi", "the sanctuary of Apollo · the main gate"], 61, D.gate.y + 3.0, 63.8, 0, 3.0, 0.62, { size: 54 });
  sign(ctx, ["The Vestibule", "and back to the museum"], 64.3, D.gate.y + 3.2, 67, -Math.PI / 2, 1.8, 0.42, { size: 54 });
  ctx.portal({ w: 1.3, h: 2.2, tint: "#fff0d8" }, 63.9, D.gate.y, 67, -Math.PI / 2);
  sign(ctx, ["The Sacred Way", "straightened in this model · placings approximate"], 54, wAy(54) + 2.4, 70.3, Math.PI, 3.0, 0.6, { size: 52 });
  markers(ctx, site, "s1");

  // a frieze band of painted panels on the four outer faces of a rectangle (triglyphs, or a carved figure frieze)
  function friezeBand(x0, x1, z0, z1, y, h, doricBand) {
    const out = [], mat = doricBand ? friezeMat() : figureFriezeMat();
    const face = (cx, cz, w, yaw) => {
      const mt = mat.clone(); if (mt.map) { mt.map = mt.map.clone(); mt.map.needsUpdate = true; mt.map.repeat.set(Math.max(1, Math.round(w / 1.2)), 1); }
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); m.position.set(cx, y + h / 2, cz); m.rotation.y = Math.PI - yaw; out.push(m);
    };
    face((x0 + x1) / 2, z0, x1 - x0, 0); face((x0 + x1) / 2, z1, x1 - x0, 180 * Math.PI / 180);
    face(x0, (z0 + z1) / 2, z1 - z0, -Math.PI / 2); face(x1, (z0 + z1) / 2, z1 - z0, Math.PI / 2);
    return out;
  }
}
