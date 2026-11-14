/* Borobudur: drawn surfaces. Every relief here is our own simple rendering in the manner of the galleries' framed
   panels (figures among trees and pavilions, in two registers), not a copy of any real panel; the balustrades'
   niches are drawn as outlines with plain seated stand-ins, and the stupas' lattice as a pattern of openings.
   Also the stand-in seated figure placed inside each stupa, a plain stone form, not a portrait of any statue. */
import * as THREE from "three";

const can = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
const INK = "rgba(30,26,22,0.78)", SHADE = "rgba(0,0,0,0.10)";
function pen(g, w) { g.strokeStyle = INK; g.fillStyle = SHADE; g.lineWidth = w || 2; }
const tex = (c, rep) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = THREE.RepeatWrapping; } return t; };

function figure(g, x, y, h, R) {
  pen(g, Math.max(1.4, h / 34));
  g.beginPath(); g.arc(x, y - h * 0.86, h * 0.085, 0, Math.PI * 2); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x, y - h * 0.77); g.lineTo(x - h * 0.12, y - h * 0.38); g.lineTo(x - h * 0.14, y); g.moveTo(x, y - h * 0.77); g.lineTo(x + h * 0.12, y - h * 0.38); g.lineTo(x + h * 0.14, y); g.stroke();
  g.beginPath(); g.moveTo(x, y - h * 0.68); g.lineTo(x + (R() < 0.5 ? -1 : 1) * h * 0.22, y - h * (0.5 + R() * 0.2)); g.stroke();
}
function tree(g, x, y, h) { pen(g, 2); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h * 0.55); g.stroke(); g.beginPath(); g.ellipse(x, y - h * 0.72, h * 0.22, h * 0.2, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
function pavilion(g, x, y, w, h) { pen(g, 2); g.strokeRect(x - w / 2, y - h * 0.6, w, h * 0.6); g.beginPath(); g.moveTo(x - w * 0.62, y - h * 0.6); g.lineTo(x, y - h); g.lineTo(x + w * 0.62, y - h * 0.6); g.stroke(); }

// the main walls' reliefs: a tile of framed panels in two registers; the sheet's height covers both
export function reliefTex() {
  const W = 2048, H = 512, [c, g] = can(W, H), R = rng(73), pw = 256;
  for (let row = 0; row < 2; row++) {
    const y0 = row * 256;
    for (let p = 0; p < W / pw; p++) {
      const x0 = p * pw; pen(g, 4); g.strokeRect(x0 + 8, y0 + 10, pw - 16, 236);
      const base = y0 + 232, k = R();
      if (k < 0.3) pavilion(g, x0 + pw * 0.3, base, 70, 150);
      tree(g, x0 + (k < 0.5 ? pw * 0.82 : pw * 0.18), base, 140 + R() * 40);
      const n = 2 + Math.floor(R() * 3);
      for (let i = 0; i < n; i++) figure(g, x0 + pw * (0.3 + 0.5 * (i + 0.5) / n), base, 110 + R() * 40, R);
    }
  }
  return tex(c, true);
}
// the balustrades' outer faces: a row of arched niches, each with a plain seated stand-in, under a cornice
export function nicheTex() {
  const W = 512, H = 256, [c, g] = can(W, H);
  for (let i = 0; i < 2; i++) {
    const x = 128 + i * 256;
    g.fillStyle = "rgba(0,0,0,0.30)"; g.beginPath(); g.moveTo(x - 70, 240); g.lineTo(x - 70, 110); g.arc(x, 110, 70, Math.PI, 0); g.lineTo(x + 70, 240); g.closePath(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    g.fillStyle = "rgba(120,112,98,0.95)"; g.beginPath(); g.ellipse(x, 228, 48, 12, 0, 0, Math.PI * 2); g.fill();      // the seated stand-in: lap, body, head
    g.beginPath(); g.moveTo(x - 46, 226); g.lineTo(x - 22, 150); g.lineTo(x + 22, 150); g.lineTo(x + 46, 226); g.fill();
    g.beginPath(); g.arc(x, 128, 20, 0, Math.PI * 2); g.fill();
  }
  pen(g, 5); g.beginPath(); g.moveTo(0, 18); g.lineTo(W, 18); g.stroke();
  return tex(c, true);
}
// the stupas' lattice: openings (diamonds below, squares on the top terrace) in the bell, the top part solid
export function latticeTex(square) {
  const W = 512, H = 256, [c, g] = can(W, H);
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = "destination-out";
  const n = 16, rows = 3;
  for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) {
    const cx = (i + 0.5 + (r % 2) * 0.5 * (square ? 0 : 1)) * (W / n), cy = 132 + r * 44, s = 13;
    g.beginPath();
    if (square) g.rect(cx - s, cy - s, 2 * s, 2 * s); else { g.moveTo(cx, cy - s * 1.3); g.lineTo(cx + s, cy); g.lineTo(cx, cy + s * 1.3); g.lineTo(cx - s, cy); g.closePath(); }
    g.fill();
  }
  const t = tex(c, true); t.colorSpace = THREE.NoColorSpace; return t;
}

// sheets with their own UVs (one mesh for many walls): quads as [a, b, c, d, u0, u1, v0, v1] with corners in the
// order bottom-left, bottom-right, top-right, top-left as seen from the side the sheet faces
export function sheet(quads) {
  const pos = [], uv = [], nrm = [];
  for (const [a, b, c, d, u0, u1, v0, v1] of quads) {
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(d, a)).normalize();
    const P = [[a, u0, v0], [b, u1, v0], [c, u1, v1], [a, u0, v0], [c, u1, v1], [d, u0, v1]];
    for (const [p, u, v] of P) { pos.push(p.x, p.y, p.z); uv.push(u, v); nrm.push(n.x, n.y, n.z); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeBoundingSphere(); return g;
}

// the seated stand-in placed in each stupa: a plain stone form (lap, body, head), facing outward
export function seated(x, y, z, s) {
  const parts = [];
  const lap = new THREE.CylinderGeometry(0.62 * s, 0.7 * s, 0.32 * s, 14); lap.translate(0, 0.16 * s, 0); parts.push(lap);
  const body = new THREE.CylinderGeometry(0.28 * s, 0.5 * s, 0.75 * s, 12); body.translate(0, 0.32 * s + 0.37 * s, 0); parts.push(body);
  const head = new THREE.SphereGeometry(0.22 * s, 10, 8); head.translate(0, 1.22 * s, 0); parts.push(head);
  for (const p of parts) p.translate(x, y, z);
  return parts;
}
