/* Delphi: shared builders for the Greek buildings and the hillside. Doric and Ionic columns, an entablature
   with triglyphs, gabled roofs, the hillside as a height field cut by the terraces, and painted textures for
   the Polygonal Wall and for inscribed stone. Proportions follow ordinary Doric practice, not a survey of any
   one building (dims.js says which sizes are published). */
import * as THREE from "three";
import { D } from "./dims.js?v=1";
import { V } from "../../kit.js?v=1";

// ---------------------------------------------------------------- columns
// a fluted Doric column: shaft tapering, echinus, square abacus. Base of shaft at y.
export function doric(B, key, x, y, z, h, r, o) {
  o = o || {};
  const capH = Math.max(0.3, h * 0.08), shaftH = h - capH;
  const sh = new THREE.CylinderGeometry(r * 0.78, r, shaftH, o.seg || 20, 1); sh.translate(x, y + shaftH / 2, z); B.geo(key, sh);
  const ech = new THREE.CylinderGeometry(r * 1.18, r * 0.8, capH * 0.55, o.seg || 20, 1); ech.translate(x, y + shaftH + capH * 0.275, z); B.geo(key, ech);
  const ab = new THREE.BoxGeometry(r * 2.5, capH * 0.45, r * 2.5); ab.translate(x, y + h - capH * 0.225, z); B.geo(key, ab);
}
// a slender Ionic column with a moulded base and a volute capital (simplified)
export function ionic(B, key, x, y, z, h, r, yaw) {
  const base = new THREE.CylinderGeometry(r * 1.35, r * 1.45, h * 0.05, 16); base.translate(x, y + h * 0.025, z); B.geo(key, base);
  const sh = new THREE.CylinderGeometry(r * 0.88, r, h * 0.88, 16, 1); sh.translate(x, y + h * 0.05 + h * 0.44, z); B.geo(key, sh);
  const cap = new THREE.BoxGeometry(r * 3.0, h * 0.07, r * 1.7); cap.rotateY(yaw || 0); cap.translate(x, y + h * 0.965, z); B.geo(key, cap);
  for (const s of [-1, 1]) {   // the two volutes
    const v = new THREE.CylinderGeometry(r * 0.42, r * 0.42, r * 1.7, 12); v.rotateX(Math.PI / 2); v.rotateY(yaw || 0);
    v.translate(x + Math.cos(yaw || 0) * s * r * 1.3, y + h * 0.94, z - Math.sin(yaw || 0) * s * r * 1.3); B.geo(key, v);
  }
}

// ---------------------------------------------------------------- boxes and gables
export function box(B, key, x0, x1, y0, y1, z0, z1) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(key, g);
}
// a quad or triangle turned to face `out` (a direction), whatever order the corners are given in
export function oquad(B, key, a, b, c, d, out) {
  const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(d, a));
  if (n.dot(out) < 0) B.quad(key, a, d, c, b); else B.quad(key, a, b, c, d);
}
export function otri(B, key, a, b, c, out) {
  const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
  if (n.dot(out) < 0) B.tri(key, a, c, b); else B.tri(key, a, b, c);
}
const UP = V(0, 1, 0), DN = V(0, -1, 0);
// a gabled roof over the rectangle, ridge along x (axis "x") or z; with the pediment ends closed and the
// soffit under the eaves
export function gable(B, roofKey, endKey, x0, x1, z0, z1, y, rise, axis, over) {
  over = over == null ? 0.4 : over;
  const X0 = x0 - over, X1 = x1 + over, Z0 = z0 - over, Z1 = z1 + over;
  if (axis === "z") {
    const xm = (x0 + x1) / 2, yt = y + rise;
    oquad(B, roofKey, V(X0, y, Z1), V(X0, y, Z0), V(xm, yt, Z0), V(xm, yt, Z1), V(-1, 1, 0));
    oquad(B, roofKey, V(X1, y, Z0), V(X1, y, Z1), V(xm, yt, Z1), V(xm, yt, Z0), V(1, 1, 0));
    otri(B, endKey, V(x0, y, z1), V(x1, y, z1), V(xm, yt, z1), V(0, 0, 1)); otri(B, endKey, V(x1, y, z0), V(x0, y, z0), V(xm, yt, z0), V(0, 0, -1));
  } else {
    const zm = (z0 + z1) / 2, yt = y + rise;
    oquad(B, roofKey, V(X0, y, Z0), V(X1, y, Z0), V(X1, yt, zm), V(X0, yt, zm), V(0, 1, -1));
    oquad(B, roofKey, V(X1, y, Z1), V(X0, y, Z1), V(X0, yt, zm), V(X1, yt, zm), V(0, 1, 1));
    otri(B, endKey, V(x1, y, z1), V(x1, y, z0), V(x1, yt, zm), V(1, 0, 0)); otri(B, endKey, V(x0, y, z0), V(x0, y, z1), V(x0, yt, zm), V(-1, 0, 0));
  }
  oquad(B, roofKey, V(X0, y, Z1), V(X1, y, Z1), V(X1, y, Z0), V(X0, y, Z0), DN);
}
// a vertical rectangle from (xa,za) to (xb,zb), y0..y1, facing `out`
export function vrect(B, key, xa, za, xb, zb, y0, y1, out) { oquad(B, key, V(xa, y0, za), V(xb, y0, zb), V(xb, y1, zb), V(xa, y1, za), out); }
export { UP, DN };

// ---------------------------------------------------------------- painted textures
const tex = (c, rx, ry) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; if (rx) t.repeat.set(rx, ry || 1); return t; };
// the Doric frieze: triglyphs (dark, grooved) alternating with metopes (plain or with a dim figure)
export function friezeMat(tone) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 128; const g = c.getContext("2d");
  g.fillStyle = tone || "#e9e2d2"; g.fillRect(0, 0, 256, 128);
  g.fillStyle = "#3a4a5c"; g.fillRect(0, 0, 80, 128);                                   // triglyph, painted blue as many were
  g.fillStyle = "#24303c"; for (const x of [16, 36, 56]) g.fillRect(x, 10, 8, 118);
  g.fillStyle = "#b8463a"; g.fillRect(0, 0, 256, 8);                                    // the painted band above
  g.fillStyle = "rgba(120,104,80,0.35)"; g.beginPath(); g.ellipse(168, 72, 22, 40, 0, 0, Math.PI * 2); g.fill();   // a dim figure on the metope
  return new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.75 });
}
// a carved figure frieze (Ionic, continuous): pale figures in low relief on a painted blue ground, simplified
export function figureFriezeMat() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 128; const g = c.getContext("2d");
  g.fillStyle = "#4f6378"; g.fillRect(0, 0, 512, 128);
  g.fillStyle = "#e6dcc8";
  for (let i = 0; i < 7; i++) {
    const x = 30 + i * 72, lean = (i % 2 ? 1 : -1) * 10;
    g.beginPath(); g.ellipse(x + lean * 0.6, 28, 8, 9, 0, 0, Math.PI * 2); g.fill();                         // head
    g.beginPath(); g.moveTo(x - 12, 40); g.lineTo(x + 12, 40); g.lineTo(x + 16 + lean, 116); g.lineTo(x - 16 + lean, 116); g.closePath(); g.fill();   // body and robe
    g.fillRect(x + (i % 2 ? 10 : -38), 46, 28, 6);                                                             // an arm with a spear or shield-edge
    if (i % 3 === 0) { g.beginPath(); g.arc(x - 22, 70, 16, 0, Math.PI * 2); g.fill(); }                        // a round shield
  }
  g.fillStyle = "#b8463a"; g.fillRect(0, 0, 512, 6); g.fillRect(0, 122, 512, 6);
  return new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.75 });
}
// the Polygonal Wall: fitted many-sided blocks with fine joints, and lines of cut letters on some of them
export function polygonalMat() {
  const W = 512, c = document.createElement("canvas"); c.width = W; c.height = W; const g = c.getContext("2d");
  g.fillStyle = "#6f675c"; g.fillRect(0, 0, W, W);
  let s = 7; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts = []; for (let i = 0; i < 42; i++) pts.push([R() * W, R() * W]);
  // shade each pixel block by its nearest point (a coarse Voronoi): many-sided stones
  const step = 4;
  for (let y = 0; y < W; y += step) for (let x = 0; x < W; x += step) {
    let b = 1e9, b2 = 1e9, k = 0;
    for (let i = 0; i < pts.length; i++) for (const [ox, oy] of [[0, 0], [W, 0], [-W, 0], [0, W], [0, -W]]) {
      const d = (x - pts[i][0] - ox) ** 2 + (y - pts[i][1] - oy) ** 2; if (d < b) { b2 = b; b = d; k = i; } else if (d < b2) b2 = d;
    }
    const edge = Math.sqrt(b2) - Math.sqrt(b) < 5;
    const t = 168 + ((k * 37) % 30);
    g.fillStyle = edge ? "#4d463d" : `rgb(${t},${t - 10},${t - 24})`; g.fillRect(x, y, step, step);
  }
  g.fillStyle = "rgba(70,60,48,0.55)"; g.font = "13px Georgia, serif";
  // the formula of CID V 534 (Attic Inscriptions Online), with the names of seller and freed woman left out
  const L = "ΑΠΕΔΟΤΟ ΤΩΙ ΑΠΟΛΛΩΝΙ ΤΩΙ ΠΥΘΙΩΙ ΣΩΜΑ ΓΥΝΑΙΚΕΙΟΝ ΕΦ ΩΙΤΕ ΕΛΕΥΘΕΡΑ ΕΙΜΕΝ ";
  for (let i = 0; i < 9; i++) { const y0 = 40 + i * 50 + R() * 10, x0 = R() * 200; g.fillText(L.slice(i * 3) + L.slice(0, i * 3), x0, y0); g.fillText(L.slice(i * 2), x0 - 260, y0 + 15); }
  return new THREE.MeshStandardMaterial({ map: tex(c), roughness: 0.92 });
}
// lines of cut letters on a marble panel (illustrative lettering, not a transcription), optionally with
// the small signs written above the words where a hymn carries its music
export function lettersTex(lines, o) {
  o = o || {};
  const c = document.createElement("canvas"); c.width = o.w || 1024; c.height = o.h || 512; const g = c.getContext("2d");
  g.fillStyle = o.bg || "#ebe4d6"; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = o.ink || "#5a4e3e"; g.textAlign = "center"; g.textBaseline = "middle";
  const n = lines.length, lh = c.height / (n + 1);
  lines.forEach((t, i) => {
    g.font = `${o.size || 64}px Georgia, serif`; g.fillText(t, c.width / 2, lh * (i + 1));
    if (o.notes) { g.font = `${(o.size || 64) * 0.42}px Georgia, serif`; const sig = "ΦΜΓΛΖΕΙΚΘΩ"; let s = ""; for (let k = 0; k < t.length / 2; k++) s += sig[(i * 7 + k * 3) % sig.length] + " "; g.fillText(s, c.width / 2, lh * (i + 1) - (o.size || 64) * 0.62); }
  });
  const t = tex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}
// a flat panel of texture `t`, w × h, centred at (x, y, z), facing bearing `yaw` (0 = north, clockwise)
export function panel(ctx, t, w, h, x, y, z, yaw, o) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial(Object.assign({ map: t, roughness: 0.8, transparent: !!(o && o.transparent) }, o && o.mat)));
  m.position.set(x, y, z); m.rotation.y = Math.PI - yaw; ctx.group.add(m); return m;
}

// ---------------------------------------------------------------- the hillside
// A height field over the sanctuary: the natural slope (D.groundAt), dropped just under every built pad so the
// pads' own floors show, and blended back to the slope within `band` metres of each pad.
export function hillside(B, key, pads, o) {
  o = o || {};
  const x0 = o.x0 ?? -140, x1 = o.x1 ?? 140, z0 = o.z0 ?? -150, z1 = o.z1 ?? 140, cell = o.cell || 2.5, band = o.band || 5;
  const nx = Math.round((x1 - x0) / cell), nz = Math.round((z1 - z0) / cell);
  const hAt = (x, z) => {
    let h = D.groundAt(x, z), wsum = 0, acc = 0;
    for (const p of pads) {
      const dx = Math.max(p.x0 - x, 0, x - p.x1), dz = Math.max(p.z0 - z, 0, z - p.z1), d = Math.hypot(dx, dz);
      if (d >= band) continue;
      const py = p.at(Math.min(Math.max(x, p.x0), p.x1), Math.min(Math.max(z, p.z0), p.z1)) - (p.sink ?? 0.3);
      if (d === 0) return py;
      const w = (1 - d / band) ** 2; acc += py * w; wsum += w;
    }
    if (wsum > 0) { const w = Math.min(1, wsum); h = h * (1 - w) + (acc / wsum) * w; }
    return h;
  };
  const H = []; for (let j = 0; j <= nz; j++) { H.push([]); for (let i = 0; i <= nx; i++) H[j].push(hAt(x0 + i * cell, z0 + j * cell)); }
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const xa = x0 + i * cell, xb = xa + cell, za = z0 + j * cell, zb = za + cell;
    B.quad(key, V(xa, H[j + 1][i], zb), V(xb, H[j + 1][i + 1], zb), V(xb, H[j][i + 1], za), V(xa, H[j][i], za));
  }
  return hAt;
}
// a pad: a rectangle with a flat or sloping floor, in the same terms as kit.js region()
export function pad(r, sink) {
  const p = { x0: Math.min(r.x0, r.x1), x1: Math.max(r.x0, r.x1), z0: Math.min(r.z0, r.z1), z1: Math.max(r.z0, r.z1), sink };
  p.at = (x, z) => {
    if (r.y1 == null) return r.y;
    if (r.axis === "x") return r.y + (r.y1 - r.y) * (x - r.x0) / (r.x1 - r.x0);
    return r.y + (r.y1 - r.y) * (z - r.z0) / (r.z1 - r.z0);
  };
  return p;
}
// the floor of a pad as one quad (or strips, for a slope), in Bucket `B` under `key`
export function padFloor(B, key, r, strips) {
  const p = pad(r), n = r.y1 == null ? 1 : (strips || 8);
  for (let k = 0; k < n; k++) {
    if (r.axis === "x") {
      const xa = p.x0 + (p.x1 - p.x0) * k / n, xb = p.x0 + (p.x1 - p.x0) * (k + 1) / n;
      B.quad(key, V(xa, p.at(xa, 0), p.z1), V(xb, p.at(xb, 0), p.z1), V(xb, p.at(xb, 0), p.z0), V(xa, p.at(xa, 0), p.z0));
    } else {
      const za = p.z0 + (p.z1 - p.z0) * k / n, zb = p.z0 + (p.z1 - p.z0) * (k + 1) / n;
      B.quad(key, V(p.x0, p.at(0, zb), zb), V(p.x1, p.at(0, zb), zb), V(p.x1, p.at(0, za), za), V(p.x0, p.at(0, za), za));
    }
  }
}
