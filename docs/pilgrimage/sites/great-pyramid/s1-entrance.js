/* I · The north face, the original entrance under its gable stones, and the descending passage. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { Bucket, passage, wall, V, outlineBox } from "../../kit.js?v=1";
import { markers, lamp, rail, sign, finish } from "../../parts.js?v=1";
import { drawColumns } from "./glyphs.js?v=1";

export function build(ctx) {
  const M = { block: ctx.mat("block"), core: ctx.mat("core"), tread: ctx.mat("core", { color: new THREE.Color("#d9c39c") }), lime: ctx.mat("limestone"), floor: ctx.mat("floor"), granite: ctx.mat("granite"), wood: ctx.mat("wood") };
  const B = new Bucket(), F = new Bucket();
  const pw2 = D.pw / 2, cot = 1 / Math.tan(D.faceAng);
  const ledgeY = D.entY, recessZ = D.entZ - 1.6, recessW = 2.1;

  // ---- the stepped core masonry of the north face (the casing is gone)
  // courses of 0.75 m; each course is a riser (facing north) and a tread. Above the ledge they rise to the south,
  // below it they fall away to the ground.
  const ch = 0.75, tread = ch * cot, X = 34;
  const faceZ = (y) => recessZ + (y - ledgeY) * cot;            // the face line through the front of the recess
  for (let k = -22; k < 30; k++) {
    const y0 = ledgeY + k * ch, y1 = y0 + ch, zr = faceZ(y0);
    if (k >= 0 && y0 < ledgeY + 4.9) {
      // around the recess the face is cut away; build only either side of it
      for (const [a, b] of [[-X, -recessW], [recessW, X]]) {
        B.quad("core", V(a, y0, zr), V(b, y0, zr), V(b, y1, zr), V(a, y1, zr));
        B.quad("tread", V(a, y1, zr), V(b, y1, zr), V(b, y1, zr + tread), V(a, y1, zr + tread));
      }
    } else {
      const zz = k < 0 ? zr - 4.3 : zr;                          // below the ledge the face is 4.3 m further out
      B.quad("core", V(-X, y0, zz), V(X, y0, zz), V(X, y1, zz), V(-X, y1, zz));
      if (k !== -1) B.quad("tread", V(-X, y1, zz), V(X, y1, zz), V(X, y1, zz + tread), V(-X, y1, zz + tread));
    }
  }
  // the ledge: a level platform cut into the face, about 4.6 m deep
  const L0 = faceZ(ledgeY - ch) - 4.3;
  F.quad("tread", V(-X, ledgeY, recessZ), V(X, ledgeY, recessZ), V(X, ledgeY, L0), V(-X, ledgeY, L0));

  // ---- the recess round the entrance: rough side walls, the back wall with the passage mouth
  wall(B, "core", -recessW, recessZ, -recessW, D.entZ, ledgeY, 4.9);
  wall(B, "core", recessW, D.entZ, recessW, recessZ, ledgeY, 4.9);
  F.quad("tread", V(-recessW, ledgeY, D.entZ), V(recessW, ledgeY, D.entZ), V(recessW, ledgeY, recessZ), V(-recessW, ledgeY, recessZ));
  // back wall (facing north) with the mouth of the descending passage
  wall(B, "lime", recessW, D.entZ, -recessW, D.entZ, ledgeY, 4.9, [{ u0: recessW - pw2, u1: recessW + pw2, v0: 0, v1: D.descHv }]);

  // ---- the gable stones: two tiers of limestone beams leaning together in pairs (sizes APPROX)
  const beam = (x0, y0, x1, y1, z0, depth, th) => {   // solid limestone, no course joints
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), g = new THREE.BoxGeometry(L, th, depth);
    g.rotateZ(Math.atan2(dy, dx)); g.translate((x0 + x1) / 2, (y0 + y1) / 2, z0 + depth / 2);
    B.geo("block", g);
  };
  for (const [tier, dz] of [[0, 0], [1, 0.55]]) {
    const yb = ledgeY + 2.55 + tier * 1.2, ya = yb + 1.55, z0 = recessZ - 0.15 + dz;
    beam(-recessW - 0.2, yb, 0.02, ya, z0, 2.0, 0.78);
    beam(recessW + 0.2, yb, -0.02, ya, z0, 2.0, 0.78);
  }
  // the Lepsius inscription of 1842 on the lower western gable stone: eleven columns (the marks shown are illustrative, not the text)
  {
    const x0 = -recessW - 0.2, y0 = ledgeY + 2.55, x1 = 0.02, y1 = y0 + 1.55, ang = Math.atan2(y1 - y0, x1 - x0);
    const c = document.createElement("canvas"); c.width = 512; c.height = 320; const g = c.getContext("2d");
    g.fillStyle = "rgba(0,0,0,0)"; g.fillRect(0, 0, 512, 320);
    g.strokeStyle = "rgba(70,55,40,.55)"; g.lineWidth = 5; g.strokeRect(12, 12, 488, 296);
    drawColumns(g, 26, 24, 460, 272, 11, 1842, "rgba(60,46,32,.8)");
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.49), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    const holder = new THREE.Group(); holder.position.set((x0 + x1) / 2 - 0.05, (y0 + y1) / 2, recessZ - 0.15 - 0.004); holder.rotation.y = Math.PI;
    slab.rotation.z = -ang; holder.add(slab); ctx.group.add(holder);
    const hitP = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })); hitP.rotation.z = -ang; const hh = holder.clone(false); hh.add(hitP); ctx.group.add(hh);
    ctx.hit(hitP, ctx.infoById("lepsius"));
  }
  // a lid of masonry over the recess, behind the gables, up to where the face's courses resume
  const yLid = ledgeY + 7 * ch, zLid = faceZ(yLid);
  B.quad("core", V(-recessW, yLid, recessZ + 2.6), V(recessW, yLid, recessZ + 2.6), V(recessW, yLid, zLid), V(-recessW, yLid, zLid));
  B.quad("core", V(-recessW, ledgeY + 4.9, D.entZ), V(recessW, ledgeY + 4.9, D.entZ), V(recessW, yLid, D.entZ), V(-recessW, yLid, D.entZ));
  // ---- the descending passage
  const run = D.descEndZ - D.entZ, rise = -run * D.descTan;
  const s = (z) => z - D.entZ;
  passage(F, { floor: "pfloor" }, 0, D.entZ, D.entY, run, rise, D.pw, D.ph, { roof: [[0, run]], left: [[0, run]], right: [[0, run]] }, { floorUV: "slopeFloor" });
  passage(B, { floor: "x", wall: "lime", ceil: "lime" }, 0, D.entZ, D.entY, run, rise, D.pw, D.ph,
    { floor: [[0, run]], left: [[s(D.rtZ0 - 0.8), s(D.rtZ0 + 0.8)]], roof: [[s(D.ascZ0 - 0.05), s(D.ascZ0 + 1.6)]] });
  // the underside of the lowest granite plug, seen in the roof where the ascending passage leaves it
  const hv = D.descHv, yR = (z) => D.descFloor(z) + hv;
  B.quad("granite", V(-pw2, yR(D.ascZ0 - 0.05), D.ascZ0 - 0.05), V(pw2, yR(D.ascZ0 - 0.05), D.ascZ0 - 0.05), V(pw2, yR(D.ascZ0 + 1.6), D.ascZ0 + 1.6), V(-pw2, yR(D.ascZ0 + 1.6), D.ascZ0 + 1.6));
  // the far end: a modern grille, and darkness beyond
  const gz = D.descEndZ - 0.3, gy = D.descFloor(gz);
  const bars = new THREE.Group(), barMat = new THREE.MeshStandardMaterial({ color: "#2b2826", metalness: 0.6, roughness: 0.5 });
  for (let i = 0; i < 7; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, hv, 0.02), barMat); b.position.set(-pw2 + 0.08 + i * (D.pw - 0.16) / 6, gy + hv / 2, gz); bars.add(b); }
  for (const y of [0.15, hv - 0.15]) { const b = new THREE.Mesh(new THREE.BoxGeometry(D.pw, 0.03, 0.03), barMat); b.position.set(0, gy + y, gz); bars.add(b); }
  ctx.group.add(bars);
  // way-finding (the archive's signs, not the site's): the way on is the robbers' tunnel, back up on the right
  sign(ctx, ["No way on here", "the robbers' tunnel: back up, on your right"], 0, gy + hv * 0.55, gz - 0.06, Math.PI, D.pw * 0.92, D.pw * 0.23, { size: 72 });
  sign(ctx, ["The way on", "through the robbers' tunnel"], pw2 - 0.02, D.descFloor(D.rtZ0) + 0.95, D.rtZ0, -Math.PI / 2, 0.9, 0.23, { size: 72 });
  const dark = new THREE.Mesh(new THREE.PlaneGeometry(D.pw, hv), new THREE.MeshBasicMaterial({ color: "#000000" })); dark.position.set(0, D.descFloor(D.descEndZ) + hv / 2, D.descEndZ - 0.01); dark.rotation.y = Math.PI; ctx.group.add(dark);
  // modern boards, a rail and lamps
  const boardY = (z) => D.descFloor(z) + 0.03;
  F.quad("wood", V(-0.42, boardY(gz - 0.3), gz - 0.3), V(0.42, boardY(gz - 0.3), gz - 0.3), V(0.42, boardY(D.entZ + 0.2), D.entZ + 0.2), V(-0.42, boardY(D.entZ + 0.2), D.entZ + 0.2), "slopeFloor");
  rail(ctx, pw2 - 0.06, D.entZ + 0.5, gz - 0.4, D.descFloor, 0.62);
  for (const z of [-100, -91, -83]) lamp(ctx, pw2 - 0.04, D.descFloor(z) + 0.95, z, 0.55, -1, 0);

  finish(ctx, F, { pfloor: M.floor, tread: M.tread, wood: M.wood }, ["pfloor", "tread", "wood"]);
  finish(ctx, B, { core: M.core, tread: M.tread, lime: M.lime, granite: M.granite, block: M.block }, []);

  // ---- the sky and the desert below (daylight only matters out here)
  const sk = document.createElement("canvas"); sk.width = 4; sk.height = 256; const g = sk.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#7fa6c9"); gr.addColorStop(0.45, "#c9d3d6"); gr.addColorStop(0.5, "#e6d6b4"); gr.addColorStop(1, "#c9ac7d"); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const st = new THREE.CanvasTexture(sk); st.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(new THREE.SphereGeometry(700, 24, 12), new THREE.MeshBasicMaterial({ map: st, side: THREE.BackSide, fog: false, depthWrite: false }));
  sky.position.set(0, 0, D.entZ); sky.renderOrder = -1; ctx.group.add(sky);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshStandardMaterial({ color: "#c7a87a", roughness: 1 }));
  sand.rotation.x = -Math.PI / 2; sand.position.set(0, -0.05, -500); ctx.group.add(sand);

  // ---- the North Face Corridor, known from muon scans (outline only; position APPROX)
  ctx.outline("nfc", outlineBox(0, ledgeY + 5.9, recessZ + 2.1 + 4.5, 2, 2, 9));
  // the golden portal on the ledge that leads back to the Vestibule
  ctx.portal({ w: 1.0, h: 2.0, tint: "#fff0d8", sparks: 50 }, -2.75, ledgeY, -110.05, 0);
  // daylight on the ledge
  ctx.light(0, ledgeY + 2.2, recessZ - 2.5, 0.6);
  markers(ctx, site, "s1");
}
