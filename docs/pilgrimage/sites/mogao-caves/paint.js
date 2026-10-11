/* The Mogao Caves: shared builders (boxes, faced quads, panels), seated and standing clay figures, and the
   painted walls. Every painting here is our own simple rendering in the manner of the caves (rows of small
   seated Buddhas, a twin-tree mural, story panels), drawn in code; none is a copy of a real painting. */
import * as THREE from "three";
import { V } from "../../kit.js?v=1";

export function box(B, key, x0, x1, y0, y1, z0, z1) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); B.geo(key, g);
}
export function oquad(B, key, a, b, c, d, out) {
  const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(d, a));
  if (n.dot(out) < 0) B.quad(key, a, d, c, b); else B.quad(key, a, b, c, d);
}
// a flat panel of texture `t`, w × h, centred at (x, y, z), facing bearing `b` (radians; 0 = north, clockwise)
export function panel(ctx, t, w, h, x, y, z, b, o) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial(Object.assign({ map: t, roughness: 0.9 }, o)));
  m.position.set(x, y, z); m.rotation.y = Math.PI - b; ctx.group.add(m); return m;
}
// a ceiling in the form of an upturned funnel (the truncated-pyramid ceiling of many Mogao caves): four slopes
// from the wall tops at yW up to a flat square of half-size `top` at yT, seen from below
export function funnel(B, key, x0, x1, z0, z1, yW, yT, top) {
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, a = [cx - top, cz - top], b = [cx + top, cz + top], D = V(0, -1, 0);
  oquad(B, key, V(x0, yW, z0), V(x1, yW, z0), V(b[0], yT, a[1]), V(a[0], yT, a[1]), V(0, -1, 1));
  oquad(B, key, V(x1, yW, z1), V(x0, yW, z1), V(a[0], yT, b[1]), V(b[0], yT, b[1]), V(0, -1, -1));
  oquad(B, key, V(x0, yW, z1), V(x0, yW, z0), V(a[0], yT, a[1]), V(a[0], yT, b[1]), V(1, -1, 0));
  oquad(B, key, V(x1, yW, z0), V(x1, yW, z1), V(b[0], yT, b[1]), V(b[0], yT, a[1]), V(-1, -1, 0));
  oquad(B, key, V(a[0], yT, a[1]), V(b[0], yT, a[1]), V(b[0], yT, b[1]), V(a[0], yT, b[1]), D);
}

// ---------------------------------------------------------------- clay figures
// built facing east (+x), then turned to face bearing `b`; keys: robe, skin
function place(g, x, y, z, b) { g.rotateY(-(b - Math.PI / 2)); g.translate(x, y, z); return g; }
// a limb: a tapered cylinder from point a to point b (arrays [x, y, z] in the figure's own frame)
function limb(a, b, r0, r1) {
  const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b), d = Bv.clone().sub(A);
  const g = new THREE.CylinderGeometry(r1, r0, d.length(), 8);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
  const m = A.add(Bv).multiplyScalar(0.5); g.translate(m.x, m.y, m.z); return g;
}
export function seated(B, keys, x, y, z, H, b, o) {
  o = o || {};
  const parts = [], h = H;
  const ped = new THREE.CylinderGeometry(h * 0.36, h * 0.42, h * 0.16, 16); ped.translate(0, h * 0.08, 0); parts.push([keys.robe2 || keys.robe, ped]);
  const lap = new THREE.SphereGeometry(h * 0.3, 16, 8); lap.scale(0.62, 0.3, 1.0); lap.translate(h * 0.07, h * 0.24, 0); parts.push([keys.robe, lap]);
  const torso = new THREE.CylinderGeometry(h * 0.13, h * 0.16, h * 0.34, 14); torso.translate(-h * 0.03, h * 0.47, 0); parts.push([keys.robe, torso]);
  const sh = new THREE.SphereGeometry(h * 0.14, 14, 8); sh.scale(0.75, 0.42, 1.3); sh.translate(-h * 0.03, h * 0.63, 0); parts.push([keys.robe, sh]);
  const neck = new THREE.CylinderGeometry(h * 0.035, h * 0.045, h * 0.06, 10); neck.translate(-h * 0.02, h * 0.69, 0); parts.push([keys.skin, neck]);
  const head = new THREE.SphereGeometry(h * 0.085, 16, 12); head.scale(0.95, 1.2, 1); head.translate(-h * 0.02, h * 0.79, 0); parts.push([keys.skin, head]);
  if (o.buddha) { const u = new THREE.SphereGeometry(h * 0.045, 12, 8); u.translate(-h * 0.03, h * 0.9, 0); parts.push([keys.hair || keys.skin, u]); }
  else if (!o.bare) { const cap = new THREE.CylinderGeometry(h * 0.06, h * 0.08, h * 0.08, 12); cap.translate(-h * 0.025, h * 0.89, 0); parts.push([keys.robe2 || keys.robe, cap]); }
  for (const s of [-1, 1]) {
    const ear = new THREE.BoxGeometry(h * 0.012, h * 0.06, h * 0.02); ear.translate(-h * 0.02, h * 0.78, s * h * 0.085); parts.push([keys.skin, ear]);
    parts.push([keys.robe, limb([-h * 0.03, h * 0.64, s * h * 0.17], [0, h * 0.46, s * h * 0.19], h * 0.05, h * 0.042)]);   // upper arm
    parts.push([keys.robe, limb([0, h * 0.46, s * h * 0.19], [h * 0.12, h * 0.37, s * h * 0.06], h * 0.042, h * 0.034)]);   // forearm
    const knee = new THREE.SphereGeometry(h * 0.08, 10, 8); knee.scale(1, 0.7, 1); knee.translate(h * 0.18, h * 0.22, s * h * 0.2); parts.push([keys.robe, knee]);
  }
  const hands = new THREE.SphereGeometry(h * 0.055, 10, 6); hands.scale(1, 0.55, 1.5); hands.translate(h * 0.13, h * 0.35, 0); parts.push([keys.skin, hands]);
  for (const [k, g] of parts) B.geo(k, place(g, x, y, z, b));
}
// seated with both legs hanging down (the posture of many Maitreya images)
export function pendant(B, keys, x, y, z, H, b) {
  const parts = [], s = H;
  const throne = new THREE.BoxGeometry(s * 0.34, s * 0.36, s * 0.5); throne.translate(-s * 0.1, s * 0.18, 0); parts.push([keys.robe2 || keys.robe, throne]);
  for (const dz of [-0.11, 0.11]) {
    const shin = new THREE.CylinderGeometry(s * 0.055, s * 0.065, s * 0.3, 20); shin.translate(s * 0.12, s * 0.17, dz * s); parts.push([keys.robe, shin]);
    const foot = new THREE.BoxGeometry(s * 0.1, s * 0.035, s * 0.06); foot.translate(s * 0.15, s * 0.02, dz * s); parts.push([keys.skin, foot]);
    const thigh = new THREE.CylinderGeometry(s * 0.07, s * 0.08, s * 0.26, 20); thigh.rotateZ(Math.PI / 2); thigh.translate(s * 0.01, s * 0.36, dz * s); parts.push([keys.robe, thigh]);
    const fore = new THREE.CylinderGeometry(s * 0.035, s * 0.04, s * 0.2, 8); fore.rotateZ(Math.PI / 2); fore.translate(s * 0.03, s * 0.44, dz * 1.6 * s); parts.push([keys.robe, fore]);
    const hand = new THREE.SphereGeometry(s * 0.035, 8, 6); hand.translate(s * 0.14, s * 0.44, dz * 1.6 * s); parts.push([keys.skin, hand]);
  }
  const torso = new THREE.CylinderGeometry(s * 0.13, s * 0.17, s * 0.36, 28); torso.translate(-s * 0.08, s * 0.58, 0); parts.push([keys.robe, torso]);
  const sh = new THREE.SphereGeometry(s * 0.15, 28, 14); sh.scale(0.6, 0.45, 1.25); sh.translate(-s * 0.08, s * 0.75, 0); parts.push([keys.robe, sh]);
  const neck = new THREE.CylinderGeometry(s * 0.04, s * 0.05, s * 0.08, 20); neck.translate(-s * 0.05, s * 0.82, 0); parts.push([keys.skin, neck]);
  const head = new THREE.SphereGeometry(s * 0.075, 28, 20); head.scale(0.95, 1.2, 1); head.translate(-s * 0.03, s * 0.91, 0); parts.push([keys.skin, head]);
  const u = new THREE.SphereGeometry(s * 0.04, 12, 8); u.translate(-s * 0.04, s * 1.0, 0); parts.push([keys.hair || keys.skin, u]);
  for (const dz of [-1, 1]) { const ear = new THREE.BoxGeometry(s * 0.012, s * 0.06, s * 0.02); ear.translate(-s * 0.03, s * 0.89, dz * s * 0.075); parts.push([keys.skin, ear]); }
  for (const [k, g] of parts) B.geo(k, place(g, x, y, z, b));
}
export function standing(B, keys, x, y, z, H, b) {
  const body = new THREE.CylinderGeometry(H * 0.09, H * 0.14, H * 0.8, 10); body.translate(0, H * 0.4, 0); B.geo(keys.robe, place(body, x, y, z, b));
  const head = new THREE.SphereGeometry(H * 0.07, 10, 8); head.translate(0, H * 0.88, 0); B.geo(keys.skin, place(head, x, y, z, b));
}

// ---------------------------------------------------------------- painted textures
const tex = (c, rep) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = rep ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping; t.anisotropy = 4; return t; };
const can = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
// rows of small seated Buddhas, each with a halo, in alternating colours: one metre square per tile
export function thousandMat(dim) {
  const [c, g] = can(512, 512), cols = ["#3f6b5c", "#8a3a2a", "#3d4f7a", "#b0793a"];
  g.fillStyle = dim ? "#a68d6c" : "#c9b08a"; g.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    const x = k * 128 + 64, y = r * 128 + 70, col = cols[(r + k) % 4];
    g.fillStyle = col; g.beginPath(); g.arc(x, y - 18, 34, 0, Math.PI * 2); g.fill();              // halo
    g.fillStyle = "#e3cfa7"; g.beginPath(); g.ellipse(x, y + 26, 30, 16, 0, 0, Math.PI * 2); g.fill();   // crossed legs
    g.fillStyle = cols[(r + k + 1) % 4]; g.beginPath(); g.moveTo(x - 18, y + 22); g.lineTo(x + 18, y + 22); g.lineTo(x + 12, y - 8); g.lineTo(x - 12, y - 8); g.closePath(); g.fill();
    g.fillStyle = "#e3cfa7"; g.beginPath(); g.arc(x, y - 18, 11, 0, Math.PI * 2); g.fill();          // head
    g.fillStyle = "#3a2a1e"; g.fillRect(x - 52, y + 46, 104, 4);
  }
  const t = tex(c, true); t.repeat.set(2.5, 2.5);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 });
}
export function plasterMat(col) {
  const [c, g] = can(256, 256); g.fillStyle = col || "#c8b28c"; g.fillRect(0, 0, 256, 256);
  let s = 3; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(90,70,50,${0.04 + R() * 0.06})`; g.fillRect(R() * 256, R() * 256, 2 + R() * 6, 2 + R() * 6); }
  return new THREE.MeshStandardMaterial({ map: tex(c, true), roughness: 0.95 });
}
// painted rafters for a gabled ceiling
export function raftersMat() {
  const [c, g] = can(256, 256); g.fillStyle = "#d2bb92"; g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 64) { g.fillStyle = "#7a3b28"; g.fillRect(x, 0, 16, 256); g.fillStyle = "#3f6b5c"; g.fillRect(x + 28, 40, 10, 30); g.fillRect(x + 28, 160, 10, 30); }
  return new THREE.MeshStandardMaterial({ map: tex(c, true), roughness: 0.95 });
}
// Cave 17's north wall: two trees with a bag and a water flask hanging, a lay woman with a staff, a nun with a fan
export function treesMural() {
  const [c, g] = can(1024, 640); g.fillStyle = "#d4bf98"; g.fillRect(0, 0, 1024, 640);
  const tree = (x) => {
    g.fillStyle = "#6b4a2f"; g.fillRect(x - 12, 260, 24, 380);
    g.fillStyle = "#4f6b45"; for (const [dx, dy, r] of [[0, 170, 120], [-90, 230, 80], [90, 230, 80], [-40, 110, 70], [50, 110, 70]]) { g.beginPath(); g.arc(x + dx, dy, r, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#3d5636"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(x - 120 + (i * 37) % 240, 80 + (i * 53) % 220, 10, 0, Math.PI * 2); g.fill(); }
  };
  tree(250); tree(774);
  g.fillStyle = "#8c6a48"; g.beginPath(); g.ellipse(330, 330, 26, 40, 0, 0, Math.PI * 2); g.fill(); g.fillRect(326, 280, 4, 20);   // the bag
  g.fillStyle = "#7b8a8a"; g.beginPath(); g.ellipse(700, 340, 22, 32, 0, 0, Math.PI * 2); g.fill(); g.fillRect(694, 296, 12, 22);   // the flask
  const fig = (x, robe, prop) => {
    g.fillStyle = robe; g.beginPath(); g.moveTo(x - 40, 620); g.lineTo(x + 40, 620); g.lineTo(x + 24, 430); g.lineTo(x - 24, 430); g.closePath(); g.fill();
    g.fillStyle = "#e7d3b2"; g.beginPath(); g.arc(x, 408, 24, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#2c2420"; if (prop === "staff") g.fillRect(x + 34, 380, 6, 240); else { g.beginPath(); g.arc(x + 44, 460, 26, 0, Math.PI * 2); g.fill(); g.fillRect(x + 42, 486, 4, 50); }
  };
  fig(170, "#9a5a3c", "staff"); fig(860, "#6b6a5a", "fan");
  return tex(c);
}
// a story panel: a landscape of hills with figures (our own simple rendering of the subject only)
export function storyMural(kind) {
  const [c, g] = can(1024, 512); g.fillStyle = "#b9875c"; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = "#4f6f62"; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(i * 120 - 20, 512); g.lineTo(i * 120 + 50, 300 + (i % 3) * 40); g.lineTo(i * 120 + 120, 512); g.fill(); }
  const person = (x, y, s, col, lying) => { g.fillStyle = col; if (lying) { g.fillRect(x - 50 * s, y - 10 * s, 100 * s, 20 * s); g.fillStyle = "#e7d3b2"; g.beginPath(); g.arc(x - 60 * s, y, 12 * s, 0, Math.PI * 2); g.fill(); return; } g.beginPath(); g.moveTo(x - 20 * s, y); g.lineTo(x + 20 * s, y); g.lineTo(x + 10 * s, y - 70 * s); g.lineTo(x - 10 * s, y - 70 * s); g.closePath(); g.fill(); g.fillStyle = "#e7d3b2"; g.beginPath(); g.arc(x, y - 82 * s, 13 * s, 0, Math.PI * 2); g.fill(); };
  if (kind === "tigress") {
    const cat = (x, y, s) => { g.fillStyle = "#c98a3a"; g.beginPath(); g.ellipse(x, y, 60 * s, 22 * s, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(x - 62 * s, y - 10 * s, 20 * s, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#3a2a1e"; g.lineWidth = 4 * s; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x + k * 18 * s, y - 20 * s); g.lineTo(x + k * 18 * s + 6, y + 18 * s); g.stroke(); } };
    person(200, 260, 1.1, "#e8e0d0"); person(330, 250, 1.0, "#8a3a2a"); person(430, 250, 1.0, "#3d4f7a");
    person(560, 420, 1.3, "#e8e0d0", true); cat(700, 410, 1.2); cat(820, 440, 0.6); cat(880, 420, 0.55);
    g.fillStyle = "#e8e0d0"; g.fillRect(920, 180, 60, 120); g.beginPath(); g.moveTo(910, 180); g.lineTo(990, 180); g.lineTo(950, 120); g.fill();   // the stupa
  } else if (kind === "sibi") {
    person(420, 440, 1.6, "#8a3a2a"); g.fillStyle = "#2c2420"; g.fillRect(600, 220, 6, 220); g.fillRect(540, 220, 126, 6);
    g.beginPath(); g.moveTo(540, 226); g.lineTo(520, 300); g.lineTo(560, 300); g.fill(); g.beginPath(); g.moveTo(666, 226); g.lineTo(646, 300); g.lineTo(686, 300); g.fill();   // the scales
    g.fillStyle = "#eee"; g.beginPath(); g.ellipse(540, 290, 16, 10, 0, 0, Math.PI * 2); g.fill();   // the dove
    g.fillStyle = "#4a3a2a"; g.beginPath(); g.moveTo(760, 120); g.lineTo(860, 100); g.lineTo(800, 150); g.fill();   // the hawk
    person(240, 440, 1.0, "#3d4f7a"); person(780, 440, 1.0, "#3f6b5c");
  } else {
    g.fillStyle = "#e8e0d0"; g.beginPath(); g.arc(512, 200, 110, 0, Math.PI * 2); g.fill(); person(512, 470, 2.4, "#f2ede2");
  }
  g.strokeStyle = "#5a3020"; g.lineWidth = 14; g.strokeRect(7, 7, 1010, 498);
  return tex(c);
}
// the stele: dark stone with columns of marks standing for the text (not a transcription)
export function steleTex() {
  const [c, g] = can(256, 512); g.fillStyle = "#4a4640"; g.fillRect(0, 0, 256, 512);
  g.fillStyle = "#6a655c"; g.fillRect(14, 14, 228, 484);
  g.fillStyle = "#2d2a26"; let s = 9; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let col = 0; col < 9; col++) for (let k = 0; k < 26; k++) { const x = 220 - col * 24, y = 40 + k * 17; g.fillRect(x, y, 4 + R() * 10, 2); g.fillRect(x + 4, y - 4 + R() * 4, 2, 6 + R() * 6); }
  return tex(c);
}
