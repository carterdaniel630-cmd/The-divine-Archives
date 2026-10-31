/* I · The stairway and the Gate: the plain and its far mountains, the terrace (its walls and paving), the Royal Hill
   behind it with the two rock-cut tombs, the Great Stairway (both halves drawn; the northern one walkable), and the
   Gate of All Nations: its stone door jambs with their guardians, its columns and the line of its lost walls.
   Sizes in dims.js; placings APPROX. */
import * as THREE from "three";
import site from "./site.js?v=1";
import { D } from "./dims.js?v=1";
import { gateCols, gateJambs } from "./layout.js?v=1";
import { guardian, panel } from "./art.js?v=1";
import { Bucket, V, wall } from "../../kit.js?v=1";
import { markers, sign, finish } from "../../parts.js?v=1";

// a tomb front cut in the cliff: a cross in outline, a carved upper register and a palace front with four columns
function tombTex() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 384; const g = c.getContext("2d");
  g.strokeStyle = "rgba(30,26,22,0.85)"; g.fillStyle = "rgba(0,0,0,0.16)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(70, 10); g.lineTo(186, 10); g.lineTo(186, 120); g.lineTo(246, 120); g.lineTo(246, 260); g.lineTo(186, 260); g.lineTo(186, 374); g.lineTo(70, 374); g.lineTo(70, 260); g.lineTo(10, 260); g.lineTo(10, 120); g.lineTo(70, 120); g.closePath(); g.fill(); g.stroke();
  for (let k = 0; k < 2; k++) { g.beginPath(); g.moveTo(80, 60 + k * 30); g.lineTo(176, 60 + k * 30); g.stroke(); }
  for (const x of [40, 90, 166, 216]) { g.beginPath(); g.moveTo(x, 140); g.lineTo(x, 250); g.stroke(); }
  g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(112, 190, 32, 60);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function build(ctx) {
  const T = D.T, S = D.st, G = D.gate, TR = D.terr;
  const plain = ctx.mat("rock", { color: new THREE.Color("#b9a27f") }), far = new THREE.MeshStandardMaterial({ color: "#a89479", roughness: 1 });
  const hillM = ctx.mat("rock", { color: new THREE.Color("#9e8a72") });
  const wallM = ctx.mat("block", { color: new THREE.Color("#a7a194") }), pave = ctx.mat("floor", { color: new THREE.Color("#b5ad9c") });
  const stone = ctx.mat("limestone", { color: new THREE.Color("#8f8b83") });
  const stepM = stone.clone(); stepM.side = THREE.DoubleSide;     // the stair's many small faces are drawn without care for their facing
  const Gr = new Bucket(), W = new Bucket(), St = new Bucket(), Gt = new Bucket();

  // ---- the plain, out to a ring of far mountains
  Gr.quad("p", V(-1400, 0, 1400), V(TR.x1, 0, 1400), V(TR.x1, 0, -1400), V(-1400, 0, -1400));
  const at = (r, b) => V(r * Math.sin(b), 0, -r * Math.cos(b));
  for (let i = 0; i < 64; i++) {
    const b0 = i / 64 * Math.PI * 2, b1 = (i + 1) / 64 * Math.PI * 2, h0 = 60 + 50 * Math.sin(i * 1.7) ** 2, h1 = 60 + 50 * Math.sin((i + 1) * 1.7) ** 2;
    const p = (r, y, b) => { const q = at(r, b); q.y = y; return q; };
    Gr.quad("f", p(1000, 0, b0), p(1000, 0, b1), p(1250, h1, b1), p(1250, h0, b0));
  }
  // ---- the Royal Hill behind the terrace: a slope, a cliff where the tombs are cut, and the hill rising beyond
  const prof = [[TR.x1, T - 0.5], [TR.x1 + 14, 20], [TR.x1 + 16, 62], [TR.x1 + 110, 120], [TR.x1 + 330, D.hill.top]];
  for (let k = 0; k < prof.length - 1; k++) {
    const [xa, ya] = prof[k], [xb, yb] = prof[k + 1];
    Gr.quad("h", V(xa, ya, -700), V(xa, ya, 700), V(xb, yb, 700), V(xb, yb, -700));
  }
  for (const t of D.tombs) panel(ctx, tombTex(), 10, 15, TR.x1 + 14.2, t.y, t.z, -Math.PI / 2);
  // ---- the terrace: its paving and its walls
  Gr.quad("t", V(TR.x0, T, TR.z1), V(TR.x1, T, TR.z1), V(TR.x1, T, TR.z0), V(TR.x0, T, TR.z0));
  wall(W, "w", TR.x0, TR.z0, TR.x0, TR.z1, 0, T);                 // west face
  wall(W, "w", TR.x1, TR.z0, TR.x0, TR.z0, 0, T);                 // north face
  wall(W, "w", TR.x0, TR.z1, TR.x1, TR.z1, 0, T);                 // south face

  // ---- the Great Stairway: both halves, mirrored about the centre line z = S.cz
  const cz = S.cz, b = S.bay, r = S.rise, run = S.run;
  for (const sz of [-1, 1]) {
    const Z = (d) => cz + sz * d;
    // the lower flight: from the bay outward
    for (let k = 0; k < S.lowN; k++) {
      const za = Z(b + k * run), zb = Z(b + (k + 1) * run), y = (k + 1) * r;
      St.quad("s", V(S.xLow0, y, za), V(S.xUp0, y, za), V(S.xUp0, y, zb), V(S.xLow0, y, zb));
      St.quad("s", V(S.xLow0, y - r, za), V(S.xUp0, y - r, za), V(S.xUp0, y, za), V(S.xLow0, y, za));
      St.quad("s", V(S.xLow0, 0, za), V(S.xLow0, 0, zb), V(S.xLow0, y, zb), V(S.xLow0, y, za));     // its outer face
    }
    // the landing, and its end face
    const zL0 = Z(b + S.lowLen), zL1 = Z(b + S.lowLen + S.w);
    St.quad("s", V(S.xLow0, S.yLand, zL0), V(TR.x0, S.yLand, zL0), V(TR.x0, S.yLand, zL1), V(S.xLow0, S.yLand, zL1));
    St.quad("s", V(S.xLow0, 0, zL1), V(TR.x0, 0, zL1), V(TR.x0, S.yLand, zL1), V(S.xLow0, S.yLand, zL1));
    St.quad("s", V(S.xLow0, 0, zL0), V(S.xLow0, 0, zL1), V(S.xLow0, S.yLand, zL1), V(S.xLow0, S.yLand, zL0));
    // the upper flight: from the landing back towards the centre, beside the wall
    for (let j = 0; j < S.upN; j++) {
      const za = Z(b + S.lowLen - j * run), zb = Z(b + S.lowLen - (j + 1) * run), y = S.yLand + (j + 1) * r;
      St.quad("s", V(S.xUp0, y, za), V(TR.x0, y, za), V(TR.x0, y, zb), V(S.xUp0, y, zb));
      St.quad("s", V(S.xUp0, y - r, za), V(TR.x0, y - r, za), V(TR.x0, y, za), V(S.xUp0, y, za));
      St.quad("s", V(S.xUp0, 0, za), V(S.xUp0, 0, zb), V(S.xUp0, y, zb), V(S.xUp0, y, za));       // its face above the lower flight
    }
    // a low parapet along the outer edge of the lower flight and the landing
    const yAt = (d) => Math.min(S.yLand, Math.max(0, (d - b) / run * r));
    for (let d = b; d < b + S.lowLen + S.w - 0.01; d += 2) {
      const d1 = Math.min(d + 2, b + S.lowLen + S.w), x0 = S.xLow0 - 0.5, x1 = S.xLow0;
      St.quad("s", V(x0, yAt(d) + 0.9, Z(d)), V(x1, yAt(d) + 0.9, Z(d)), V(x1, yAt(d1) + 0.9, Z(d1)), V(x0, yAt(d1) + 0.9, Z(d1)));
      St.quad("s", V(x0, 0, Z(d)), V(x0, 0, Z(d1)), V(x0, yAt(d1) + 0.9, Z(d1)), V(x0, yAt(d) + 0.9, Z(d)));
    }
  }
  // the top of the stairway, and the face under it that closes the bay
  const zt = b + S.lowLen - S.upLen;
  St.quad("s", V(S.xUp0, T, cz + zt), V(TR.x0, T, cz + zt), V(TR.x0, T, cz - zt), V(S.xUp0, T, cz - zt));
  St.quad("s", V(S.xUp0, 0, cz - zt), V(S.xUp0, 0, cz + zt), V(S.xUp0, T, cz + zt), V(S.xUp0, T, cz - zt));

  // ---- the Gate of All Nations: the stone door jambs, the guardians on the west and east doors, the columns, the walls' line
  const bull = guardian(false), lam = guardian(true);
  for (const j of gateJambs()) {
    const sx = j.along === "x" ? G.jambD : G.jambW, sz = j.along === "x" ? G.jambW : G.jambD;
    const g = new THREE.BoxGeometry(sx, G.jambH, sz); g.translate(j.x, T + G.jambH / 2, j.z); Gt.geo("j", g);
    if (j.door !== "s") {
      const zf = j.z - j.side * (G.jambW / 2 + 0.02), m = panel(ctx, j.door === "w" ? bull : lam, G.jambD * 0.96, G.jambD * 0.96, j.x, T + 1.4 + G.jambD * 0.48, zf, j.side < 0 ? Math.PI : 0);
      if ((j.door === "w") === (j.side < 0)) m.scale.x = -1;          // every guardian faces out of its door
    }
  }
  for (const c of gateCols()) {
    const base = new THREE.CylinderGeometry(1.0, 1.25, 0.8, 18); base.translate(c.x, T + 0.4, c.z); Gt.geo("j", base);
    if (c.stand) { const sh = new THREE.CylinderGeometry(0.62, 0.66, G.colH - 0.8, 20, 1, true); sh.translate(c.x, T + 0.8 + (G.colH - 0.8) / 2, c.z); Gt.geo("j", sh); }
    else { const dr = new THREE.CylinderGeometry(0.64, 0.64, 2.2, 16); dr.rotateZ(Math.PI / 2); dr.rotateY(c.x * 0.37); dr.translate(c.x + 2.2, T + 0.64, c.z + 1.4); Gt.geo("j", dr); }
  }
  // the line of the lost walls, as a low course of stone
  const h = G.half, dd = G.door / 2 + G.jambW, low = 0.35;
  const seg = (x0, z0, x1, z1) => { const g = new THREE.BoxGeometry(Math.abs(x1 - x0) || 1.0, low, Math.abs(z1 - z0) || 1.0); g.translate((x0 + x1) / 2, T + low / 2, (z0 + z1) / 2); Gt.geo("j", g); };
  seg(G.x - h, G.z - h, G.x + h, G.z - h);
  seg(G.x - h, G.z - h, G.x - h, G.z - dd); seg(G.x - h, G.z + dd, G.x - h, G.z + h);
  seg(G.x + h, G.z - h, G.x + h, G.z - dd); seg(G.x + h, G.z + dd, G.x + h, G.z + h);
  seg(G.x - h, G.z + h, G.x - dd, G.z + h); seg(G.x + dd, G.z + h, G.x + h, G.z + h);

  finish(ctx, Gr, { p: plain, f: far, h: hillM, t: pave }, ["p", "t"]);
  finish(ctx, W, { w: wallM }, []);
  finish(ctx, St, { s: stepM }, []);
  finish(ctx, Gt, { j: stone }, []);

  // ---- signposts and the way back
  sign(ctx, ["Persepolis", "the terrace of Darius · the Great Stairway ahead"], -138, 2.4, S.cz - 9, -Math.PI / 2, 3.4, 0.55, { size: 50 });
  sign(ctx, ["The Gate of All Nations", "built by Xerxes"], G.x - h - 8, T + 2.6, G.z - 6, -Math.PI / 2, 2.6, 0.5, { size: 54 });
  sign(ctx, ["The Vestibule", "and back to the museum"], -271.4, 2.6, S.cz, Math.PI / 2, 1.8, 0.45, { size: 54 });
  ctx.portal({ w: 1.4, h: 2.2, tint: "#ffe2b0" }, -271.2, 0, S.cz, Math.PI / 2);
  markers(ctx, site, "s1");
}
