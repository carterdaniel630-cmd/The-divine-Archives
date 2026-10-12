/* Chichén Itzá: shared builders (boxes, faced quads, panels, stepped bodies, stairways) and the carved and
   painted textures. Every carving here is our own simple rendering of its subject (rows of skulls, the ball-court
   relief, the serpent's head), drawn in code; none is a copy of a real carving. */
import * as THREE from "three";
import { V } from "../../kit.js?v=1";

export const UP = V(0, 1, 0);
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
// a square stepped body: sloping sides from half-width a at y0 to half-width b at y1, with a flat top, centred (cx, cz)
export function body(B, key, cx, cz, a, b, y0, y1, top) {
  const P = (h, y) => [V(cx - h, y, cz - h), V(cx + h, y, cz - h), V(cx + h, y, cz + h), V(cx - h, y, cz + h)];
  const lo = P(a, y0), hi = P(b, y1), outs = [V(0, 0.4, -1), V(1, 0.4, 0), V(0, 0.4, 1), V(-1, 0.4, 0)];
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; oquad(B, key, lo[i], lo[j], hi[j], hi[i], outs[i]); }
  if (top) oquad(B, top, hi[0], hi[1], hi[2], hi[3], UP);
}
// a straight stairway of n steps rising along direction (dx, dz) from (x, z) at y0 to y1 over horizontal run `run`, width w
export function stairs(B, key, x, z, dx, dz, w, y0, y1, run, n) {
  const px = -dz, pz = dx, rs = (y1 - y0) / n, rn = run / n;
  for (let k = 0; k < n; k++) {
    const u0 = k * rn, u1 = (k + 1) * rn, ya = y0 + k * rs, yb = ya + rs;
    const c = (u, s) => V(x + dx * u + px * s * w / 2, 0, z + dz * u + pz * s * w / 2);
    const a0 = c(u0, -1), a1 = c(u0, 1), b0 = c(u1, -1), b1 = c(u1, 1);
    oquad(B, key, V(a0.x, ya, a0.z), V(a1.x, ya, a1.z), V(a1.x, yb, a1.z), V(a0.x, yb, a0.z), V(-dx, 0, -dz));       // riser
    oquad(B, key, V(a0.x, yb, a0.z), V(a1.x, yb, a1.z), V(b1.x, yb, b1.z), V(b0.x, yb, b0.z), UP);                  // tread
  }
}

// ---------------------------------------------------------------- textures
const tex = (c, rep) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = rep ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping; t.anisotropy = 4; return t; };
const can = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
// the side of the platform of skulls: rows of skulls in profile, carved as if threaded on stakes (one metre a tile)
export function skullsMat() {
  const [c, g] = can(256, 256); g.fillStyle = "#b9b1a0"; g.fillRect(0, 0, 256, 256);
  for (let r = 0; r < 4; r++) {
    const y = r * 64 + 32; g.fillStyle = "#8d8576"; g.fillRect(0, y - 2, 256, 4);
    for (let k = 0; k < 4; k++) {
      const x = k * 64 + 32 + (r % 2) * 16;
      g.fillStyle = "#d2cbb9"; g.beginPath(); g.ellipse(x, y, 20, 18, 0, 0, Math.PI * 2); g.fill();
      g.fillRect(x - 6, y + 10, 18, 12);
      g.fillStyle = "#5d574c"; g.beginPath(); g.arc(x + 6, y - 2, 6, 0, Math.PI * 2); g.fill(); g.fillRect(x + 2, y + 14, 3, 6); g.fillRect(x + 8, y + 14, 3, 6);
    }
  }
  const t = tex(c, true); t.repeat.set(0.45, 0.45);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 });
}
// the ball-court bench panel: players meeting at a skull-marked ball; on the right the kneeling, beheaded player
// with serpents and plants springing from the neck (our own simple rendering of the subject)
export function reliefTex() {
  const [c, g] = can(1024, 320); g.fillStyle = "#c2b9a6"; g.fillRect(0, 0, 1024, 320);
  g.strokeStyle = "#8a826f"; g.lineWidth = 10; g.strokeRect(5, 5, 1014, 310);
  const fig = (x, kneel) => {
    g.fillStyle = "#a69d88"; const y = kneel ? 280 : 290, h = kneel ? 120 : 200;
    g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x + 30, y); g.lineTo(x + 22, y - h); g.lineTo(x - 22, y - h); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x - 30, y - h + 10); g.lineTo(x - 70, y - h - 30); g.lineTo(x - 60, y - h - 40); g.lineTo(x - 20, y - h - 10); g.fill();   // a plume
    if (!kneel) { g.beginPath(); g.arc(x, y - h - 22, 22, 0, Math.PI * 2); g.fill(); }
    return y - h;
  };
  for (const x of [120, 220, 320]) fig(x);
  const top = fig(700, true); for (const x of [820, 910]) fig(x);
  // the ball, marked with a skull
  g.fillStyle = "#a69d88"; g.beginPath(); g.arc(500, 210, 58, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#d8d0bd"; g.beginPath(); g.arc(500, 205, 30, 0, Math.PI * 2); g.fill(); g.fillStyle = "#6c6556"; g.beginPath(); g.arc(490, 200, 7, 0, Math.PI * 2); g.arc(512, 200, 7, 0, Math.PI * 2); g.fill();
  // serpents and plants springing from the neck
  g.strokeStyle = "#7d8a5a"; g.lineWidth = 8;
  for (const [dx, dy] of [[-60, -110], [-10, -150], [50, -120], [90, -60], [-90, -50], [20, -170]]) {
    g.beginPath(); g.moveTo(700, top); g.bezierCurveTo(700 + dx * 0.2, top + dy * 0.5, 700 + dx, top + dy * 0.4, 700 + dx, top + dy); g.stroke();
    g.fillStyle = "#7d8a5a"; g.beginPath(); g.arc(700 + dx, top + dy, 9, 0, Math.PI * 2); g.fill();
  }
  return tex(c);
}
// the pattern of light near the equinoxes: triangles of light along the side of the north stairway, read from
// the top of the stair (left) to its foot (right), with the shadows of the stepped corners between them
export function lightTex(n) {
  const [c, g] = can(2048, 128); g.clearRect(0, 0, 2048, 128);
  const w = 2048 / n;
  g.fillStyle = "rgba(255,226,160,0.85)";
  for (let i = 0; i < n; i++) { const x = i * w; g.beginPath(); g.moveTo(x + w * 0.08, 6); g.lineTo(x + w * 0.92, 6); g.lineTo(x + w * 0.5, 122); g.closePath(); g.fill(); }
  const t = tex(c); return t;
}
// weathered limestone blocks for the pyramid's faces
export function blocksMat(col, seed) {
  const [c, g] = can(256, 256); g.fillStyle = col; g.fillRect(0, 0, 256, 256); const R = rng(seed || 7);
  for (let y = 0; y < 256; y += 32) for (let x = (y / 32) % 2 ? -24 : 0; x < 256; x += 48) {
    g.fillStyle = `rgba(70,64,52,${0.05 + R() * 0.1})`; g.fillRect(x + 2, y + 2, 44, 28);
    g.strokeStyle = "rgba(60,54,44,0.35)"; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, 46, 30);
  }
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(40,50,30,${R() * 0.12})`; g.fillRect(R() * 256, R() * 256, 2 + R() * 8, 2 + R() * 5); }
  const t = tex(c, true); t.repeat.set(0.5, 0.5);
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, side: THREE.DoubleSide });
}
