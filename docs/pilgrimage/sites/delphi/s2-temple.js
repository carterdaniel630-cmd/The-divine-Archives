/* II · The Temple of Apollo: the terrace and its north retaining wall, the Altar of the Chians, the Serpent
   Column without its gold, and the temple: crepis, 6 × 15 Doric columns, entablature and roof, the porch with
   the maxims and the E, the hall with two rows of columns, and the inner room with the omphalos, the tripod
   and a laurel. Overall size published; everything else APPROX or our own rendering (dims.js, site.js). */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D, templeCols, porchCols, naosCols } from "./dims.js?v=1";
import { doric, ionic, box, gable, vrect, oquad, friezeMat, lettersTex, panel, padFloor, UP, DN } from "./greek.js?v=1";
import { Bucket, V } from "../../kit.js?v=1";
import { markers, sign, lamp, finish, goldMat } from "../../parts.js?v=1";

export function build(ctx) {
  const T = D.temple, C = D.cella, TY = T.crepis, TR = D.terrace;
  const paving = ctx.mat("floor", { color: new THREE.Color("#d3cab8") });
  const stone = ctx.mat("limestone", { color: new THREE.Color("#b9b0a0") });
  const blue = ctx.mat("limestone", { color: new THREE.Color("#8d8f93") });
  const marble = ctx.mat("gallery", { color: new THREE.Color("#ece5d7") });
  const colM = ctx.mat("block", { color: new THREE.Color("#ddd3c0") });
  const roofM = new THREE.MeshStandardMaterial({ color: "#a65a3c", roughness: 0.8 });
  const ceilM = new THREE.MeshStandardMaterial({ color: "#3e3226", roughness: 0.9 });
  const bronze = new THREE.MeshStandardMaterial({ color: "#9a7444", roughness: 0.4, metalness: 0.6 });
  const leaf = new THREE.MeshStandardMaterial({ color: "#3f5a33", roughness: 1, flatShading: true });
  const F = new Bucket(), W = new Bucket(), K = new Bucket(), R = new Bucket(), Bz = new Bucket(), G = new Bucket(), Lf = new Bucket();
  // the terrace: paving, and the retaining wall along its north side (with the way up to the theatre)
  padFloor(F, "p", TR);
  const tt = D.toTheatre;
  vrect(W, "st", TR.x0, TR.z0, tt.x0 - 0.5, TR.z0, -0.5, 6.5, V(0, 0, 1)); vrect(W, "st", tt.x1 + 0.5, TR.z0, TR.x1, TR.z0, -0.5, 6.5, V(0, 0, 1));
  box(W, "st", TR.x0, tt.x0 - 0.5, 6.3, 6.6, TR.z0 - 0.6, TR.z0); box(W, "st", tt.x1 + 0.5, TR.x1, 6.3, 6.6, TR.z0 - 0.6, TR.z0);
  // the crepis: three steps of blue-grey limestone, and the stylobate
  const L2 = T.L / 2, W2 = T.W / 2;
  box(W, "bl", T.x - L2 - 0.8, T.x + L2 + 0.8, 0, 0.4, T.z - W2 - 0.8, T.z + W2 + 0.8);
  box(W, "bl", T.x - L2 - 0.4, T.x + L2 + 0.4, 0.4, 0.8, T.z - W2 - 0.4, T.z + W2 + 0.4);
  box(W, "bl", T.x - L2, T.x + L2, 0.8, TY, T.z - W2, T.z + W2);
  // the ramp up to the east front
  const RP = D.ramp, rw = RP.w / 2;
  oquad(F, "p", V(RP.x0, TY + 0.01, -rw), V(RP.x1, 0.01, -rw), V(RP.x1, 0.01, rw), V(RP.x0, TY + 0.01, rw), UP);
  vrect(W, "bl", RP.x0, -rw, RP.x1, -rw, 0, TY, V(0, 0, -1)); vrect(W, "bl", RP.x0, rw, RP.x1, rw, 0, TY, V(0, 0, 1));
  // the peristyle and the entablature over it
  for (const [x, z] of templeCols()) doric(K, "c", x, TY, z, T.colH, T.colR);
  const yA = TY + T.colH, yF = yA + 1.3, yC = yF + 1.45, yR = yC + 0.45;
  const e0 = T.x - L2 + 0.25, e1 = T.x + L2 - 0.25, f0 = T.z - W2 + 0.25, f1 = T.z + W2 - 0.25;
  box(W, "m", e0, e1, yA, yF, f0, f0 + 2.2); box(W, "m", e0, e1, yA, yF, f1 - 2.2, f1);
  box(W, "m", e0, e0 + 2.2, yA, yF, f0, f1); box(W, "m", e1 - 2.2, e1, yA, yF, f0, f1);
  box(W, "m", e0 + 0.05, e1 - 0.05, yF, yC, f0 + 0.05, f1 - 0.05);
  const fr = friezeMat("#e6dfcf");
  const frieze = (cx, cz, w, yaw) => { const m = fr.clone(); m.map = fr.map.clone(); m.map.needsUpdate = true; m.map.repeat.set(Math.round(w / 2.1), 1); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, yC - yF), m); p.position.set(cx, (yF + yC) / 2, cz); p.rotation.y = Math.PI - yaw; ctx.group.add(p); };
  frieze(T.x, f0 + 0.04, e1 - e0, 0); frieze(T.x, f1 - 0.04, e1 - e0, Math.PI); frieze(e0 + 0.04, T.z, f1 - f0, -Math.PI / 2); frieze(e1 - 0.04, T.z, f1 - f0, Math.PI / 2);
  box(W, "m", T.x - L2 - 0.2, T.x + L2 + 0.2, yC, yR, T.z - W2 - 0.2, T.z + W2 + 0.2);
  gable(R, "r", "m", T.x - L2 - 0.1, T.x + L2 + 0.1, T.z - W2 - 0.1, T.z + W2 + 0.1, yR, 3.1, "x", 0.35);
  // the ceiling over the walk round the cella
  oquad(R, "ce", V(e0, yA - 0.02, f0), V(e1, yA - 0.02, f0), V(e1, yA - 0.02, f1), V(e0, yA - 0.02, f1), DN);
  // the cella: side and back walls, the porch's side walls running on to the front (antae), the wall between
  // porch and hall with its great door, and the wall before the inner room with a smaller door
  const wt = C.wallT, ch = yA - TY, xPN = C.x1 - C.pronaos, xNA = C.x0 + C.adyton;
  box(W, "m", C.x0, C.x1, TY, yA, C.z0, C.z0 + wt); box(W, "m", C.x0, C.x1, TY, yA, C.z1 - wt, C.z1);
  box(W, "m", C.x0, C.x0 + wt, TY, yA, C.z0, C.z1);
  box(W, "m", xPN - wt / 2, xPN + wt / 2, TY, yA, C.z0, -1.4); box(W, "m", xPN - wt / 2, xPN + wt / 2, TY, yA, 1.4, C.z1);
  box(W, "m", xPN - wt / 2, xPN + wt / 2, TY + 7.0, yA, -1.4, 1.4);
  box(W, "m", xNA - wt / 2, xNA + wt / 2, TY, yA, C.z0, -1.1); box(W, "m", xNA - wt / 2, xNA + wt / 2, TY, yA, 1.1, C.z1);
  box(W, "m", xNA - wt / 2, xNA + wt / 2, TY + 3.6, yA, -1.1, 1.1);
  for (const [x, z] of porchCols()) doric(K, "c", x, TY, z, ch, 0.62);
  // the ceilings of porch, hall and inner room; the floor of the cella
  oquad(R, "ce", V(C.x0, yA - 0.05, C.z0), V(C.x1, yA - 0.05, C.z0), V(C.x1, yA - 0.05, C.z1), V(C.x0, yA - 0.05, C.z1), DN);
  oquad(F, "p", V(C.x0, TY + 0.01, C.z0), V(C.x1, TY + 0.01, C.z0), V(C.x1, TY + 0.01, C.z1), V(C.x0, TY + 0.01, C.z1), UP);
  // the hall's two rows of columns, carrying the roof
  for (const [x, z] of naosCols()) ionic(K, "c", x, TY, z, ch - 0.1, 0.38, Math.PI / 2);
  // the maxims and the E on the porch wall, either side of and above the door (wording ancient, placing ours)
  const mx = xPN + wt / 2 + 0.015;
  panel(ctx, lettersTex(["ΓΝΩΘΙ ΣΑΥΤΟΝ"], { size: 110, w: 1024, h: 220, bg: "#e8e0d0", ink: "#4a3f30" }), 4.0, 0.86, mx, TY + 3.2, 3.6, Math.PI / 2);
  panel(ctx, lettersTex(["ΜΗΔΕΝ ΑΓΑΝ"], { size: 110, w: 1024, h: 220, bg: "#e8e0d0", ink: "#4a3f30" }), 4.0, 0.86, mx, TY + 3.2, -3.6, Math.PI / 2);
  const eShape = new THREE.Shape(); eShape.moveTo(0, 0); eShape.lineTo(1.0, 0); eShape.lineTo(1.0, 0.24); eShape.lineTo(0.26, 0.24); eShape.lineTo(0.26, 0.6); eShape.lineTo(0.8, 0.6); eShape.lineTo(0.8, 0.84);
  eShape.lineTo(0.26, 0.84); eShape.lineTo(0.26, 1.2); eShape.lineTo(1.0, 1.2); eShape.lineTo(1.0, 1.44); eShape.lineTo(0, 1.44); eShape.closePath();
  const eG = new THREE.ExtrudeGeometry(eShape, { depth: 0.08, bevelEnabled: false }); eG.rotateY(Math.PI / 2); eG.translate(mx, TY + 7.6, 0.5);
  const eM = new THREE.Mesh(eG, goldMat); ctx.group.add(eM);
  // the inner room: the omphalos in its net with two gold eagles, the tripod, a laurel
  const om = new THREE.SphereGeometry(0.62, 20, 14); om.scale(1, 1.3, 1); om.translate(-18.5, TY + 0.55 + 0.8, 0);
  const netC = document.createElement("canvas"); netC.width = netC.height = 256; const ng = netC.getContext("2d");
  ng.fillStyle = "#e9e1d0"; ng.fillRect(0, 0, 256, 256); ng.strokeStyle = "#9d8a6a"; ng.lineWidth = 6;
  for (let k = -256; k < 512; k += 36) { ng.beginPath(); ng.moveTo(k, 0); ng.lineTo(k + 256, 256); ng.stroke(); ng.beginPath(); ng.moveTo(k + 256, 0); ng.lineTo(k, 256); ng.stroke(); }
  const netT = new THREE.CanvasTexture(netC); netT.colorSpace = THREE.SRGBColorSpace;
  ctx.group.add(new THREE.Mesh(om, new THREE.MeshStandardMaterial({ map: netT, roughness: 0.7 })));
  box(W, "m", -19.3, -17.7, TY, TY + 0.55, -0.8, 0.8);
  for (const dz of [-0.28, 0.28]) { const b = new THREE.ConeGeometry(0.12, 0.34, 6); b.rotateX(Math.PI / 2 * (dz > 0 ? 1 : -1)); b.translate(-18.5, TY + 0.55 + 1.62, dz); G.geo("g", b); }
  const ty0 = TY, tz = 2.0, tx = -15.8;
  for (let k = 0; k < 3; k++) { const a = k * Math.PI * 2 / 3, leg = new THREE.CylinderGeometry(0.04, 0.05, 1.9, 6); leg.rotateZ(0.12 * Math.cos(a)); leg.rotateX(0.12 * Math.sin(a)); leg.translate(tx + Math.cos(a) * 0.45, ty0 + 0.95, tz + Math.sin(a) * 0.45); Bz.geo("b", leg); }
  const bowl = new THREE.CylinderGeometry(0.62, 0.32, 0.36, 18, 1, true); bowl.translate(tx, ty0 + 1.95, tz); Bz.geo("b", bowl);
  const lid = new THREE.CylinderGeometry(0.6, 0.6, 0.04, 18); lid.translate(tx, ty0 + 2.1, tz); Bz.geo("b", lid);
  const trunk = new THREE.CylinderGeometry(0.08, 0.12, 2.0, 6); trunk.translate(-15.8, TY + 1.0, -2.7); W.geo("st", trunk);
  for (const [dx, dy, dz, r] of [[0, 2.4, 0, 0.8], [0.4, 2.0, 0.3, 0.55], [-0.35, 2.1, -0.3, 0.6]]) { const l = new THREE.IcosahedronGeometry(r, 0); l.translate(-15.8 + dx, TY + dy, -2.7 + dz); Lf.geo("l", l); }
  // the Altar of the Chians: dark limestone with a white marble moulding top and bottom
  const A = D.altar;
  box(W, "dk", A.x - A.L / 2, A.x + A.L / 2, 0, A.h, A.z - A.W / 2, A.z + A.W / 2);
  box(W, "m", A.x - A.L / 2 - 0.15, A.x + A.L / 2 + 0.15, A.h - 0.25, A.h + 0.05, A.z - A.W / 2 - 0.15, A.z + A.W / 2 + 0.15);
  box(W, "m", A.x - A.L / 2 - 0.15, A.x + A.L / 2 + 0.15, 0, 0.3, A.z - A.W / 2 - 0.15, A.z + A.W / 2 + 0.15);
  // the Serpent Column: three bronze snakes twisted together on a stone base; the gold tripod is gone
  const S = D.serpent;
  box(W, "st", S.x - S.base / 2, S.x + S.base / 2, 0, 1.4, S.z - S.base / 2, S.z + S.base / 2);
  for (let k = 0; k < 3; k++) {
    const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * Math.PI * 2 * 9 + k * Math.PI * 2 / 3; pts.push(V(S.x + Math.cos(a) * 0.16, 1.4 + t * S.h, S.z + Math.sin(a) * 0.16)); }
    const a = k * Math.PI * 2 / 3; pts.push(V(S.x + Math.cos(a) * 0.55, 1.4 + S.h + 0.45, S.z + Math.sin(a) * 0.55));
    Bz.geo("b", new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.13, 7, false));
    const hd = new THREE.SphereGeometry(0.2, 8, 6); hd.scale(1.5, 0.8, 1); hd.translate(S.x + Math.cos(a) * 0.62, 1.4 + S.h + 0.5, S.z + Math.sin(a) * 0.62); Bz.geo("b", hd);
  }
  finish(ctx, F, { p: paving }, ["p"]);
  finish(ctx, W, { st: stone, bl: blue, m: marble, dk: new THREE.MeshStandardMaterial({ color: "#4a4744", roughness: 0.7 }) }, []);
  finish(ctx, K, { c: colM }, []);
  finish(ctx, R, { r: roofM, m: marble, ce: ceilM }, []);
  finish(ctx, Bz, { b: bronze }, []);
  finish(ctx, G, { g: goldMat }, []);
  finish(ctx, Lf, { l: leaf }, []);
  // lamps in the porch, the hall and the inner room (the temple was dim; these are for seeing by)
  lamp(ctx, xPN + 2.6, TY + 5.5, 0, 1.0); lamp(ctx, 4, TY + 6.5, 0, 1.2); lamp(ctx, -8, TY + 6.5, 0, 1.2); lamp(ctx, -14.0, TY + 4.2, 0, 1.0);
  sign(ctx, ["The Temple of Apollo", "rebuilt c. 330 BCE · reconstruction"], RP.x1 + 1.2, 2.6, -3.6, Math.PI / 2, 3.0, 0.62, { size: 54 });
  markers(ctx, site, "s2");
}
