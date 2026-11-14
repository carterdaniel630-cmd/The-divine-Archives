/* Persepolis: the reliefs. Every relief here is our own simple rendering in the manner of the Persepolis
   sculpture (processions of guards, nobles and gift-bearers, the winged disc, the lion and bull, the guardian
   bulls of the gate), drawn in code as outlines on a transparent sheet laid on the stone, so the stone shows
   through. None is a tracing of a real relief, and the delegations are not meant to be identified. */
import * as THREE from "three";

const can = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
const INK = "rgba(28,26,24,0.85)", SHADE = "rgba(0,0,0,0.13)", LIT = "rgba(255,250,235,0.10)";

// one standing figure in profile, walking right; feet at (x, y), height h; kind: guard | noble | bearer
function figure(g, x, y, h, kind, R) {
  const w = h * 0.26;
  g.fillStyle = SHADE; g.strokeStyle = INK; g.lineWidth = Math.max(1.2, h / 40);
  g.beginPath();                                                     // the robe
  g.moveTo(x - w * 0.55, y); g.lineTo(x + w * 0.6, y); g.lineTo(x + w * 0.35, y - h * 0.62); g.lineTo(x - w * 0.3, y - h * 0.62); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(x + w * 0.05, y - h * 0.74, w * 0.34, h * 0.13, 0, 0, Math.PI * 2); g.fill(); g.stroke();   // shoulders
  g.beginPath(); g.arc(x + w * 0.12, y - h * 0.88, h * 0.075, 0, Math.PI * 2); g.fill(); g.stroke();                   // head
  g.beginPath(); g.moveTo(x + w * 0.05, y - h * 0.97); g.lineTo(x + w * 0.3, y - h * 1.0); g.lineTo(x + w * 0.2, y - h * 0.93); g.stroke(); // headdress
  g.beginPath(); g.moveTo(x + w * 0.16, y - h * 0.82); g.lineTo(x + w * 0.12, y - h * 0.74); g.stroke();             // beard
  if (kind === "guard") {                                            // a spear held upright, a bow case at the shoulder
    g.beginPath(); g.moveTo(x + w * 0.62, y + 1); g.lineTo(x + w * 0.62, y - h * 1.05); g.stroke();
    g.beginPath(); g.moveTo(x - w * 0.4, y - h * 0.55); g.lineTo(x - w * 0.15, y - h * 0.85); g.stroke();
  } else if (kind === "noble") {                                     // a hand raised to the next man's shoulder, a flower
    g.beginPath(); g.moveTo(x + w * 0.3, y - h * 0.68); g.lineTo(x + w * 0.95, y - h * 0.74); g.stroke();
    g.beginPath(); g.arc(x - w * 0.15, y - h * 0.7, h * 0.03, 0, Math.PI * 2); g.stroke();
  } else {                                                           // a gift: a vessel, a bundle or a bowl held forward
    const k = Math.floor(R() * 3), gx = x + w * 0.7, gy = y - h * 0.62;
    g.beginPath();
    if (k === 0) { g.ellipse(gx, gy, w * 0.22, h * 0.09, 0, 0, Math.PI * 2); g.moveTo(gx - w * 0.1, gy - h * 0.09); g.lineTo(gx - w * 0.06, gy - h * 0.16); g.lineTo(gx + w * 0.06, gy - h * 0.16); g.lineTo(gx + w * 0.1, gy - h * 0.09); }
    else if (k === 1) g.rect(gx - w * 0.2, gy - h * 0.12, w * 0.4, h * 0.14);
    else { g.moveTo(gx - w * 0.25, gy); g.quadraticCurveTo(gx, gy + h * 0.08, gx + w * 0.25, gy); }
    g.fill(); g.stroke();
  }
}
// a small beast led by a gift-bearer (a humped bull, a ram, a horse), walking right
function beast(g, x, y, h, R) {
  const L = h * 1.3; g.fillStyle = SHADE; g.strokeStyle = INK; g.lineWidth = Math.max(1.2, h / 40);
  g.beginPath(); g.ellipse(x, y - h * 0.55, L * 0.42, h * 0.22, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  for (const dx of [-0.32, -0.2, 0.22, 0.32]) { g.beginPath(); g.moveTo(x + dx * L, y - h * 0.45); g.lineTo(x + dx * L, y); g.stroke(); }
  g.beginPath(); g.moveTo(x + L * 0.38, y - h * 0.62); g.lineTo(x + L * 0.55, y - h * 0.85); g.lineTo(x + L * 0.62, y - h * 0.78); g.lineTo(x + L * 0.46, y - h * 0.55); g.closePath(); g.fill(); g.stroke();
  if (R() < 0.5) { g.beginPath(); g.arc(x + L * 0.55, y - h * 0.86, h * 0.07, Math.PI, Math.PI * 1.9); g.stroke(); }
}
function cypress(g, x, y, h) {
  g.fillStyle = SHADE; g.strokeStyle = INK; g.lineWidth = Math.max(1.2, h / 40);
  g.beginPath(); g.moveTo(x, y - h); g.quadraticCurveTo(x + h * 0.14, y - h * 0.4, x + h * 0.06, y); g.lineTo(x - h * 0.06, y); g.quadraticCurveTo(x - h * 0.14, y - h * 0.4, x, y - h); g.fill(); g.stroke();
}
// a long frieze in three registers; kind "nobles" (guards and nobles) or "nations" (delegations between cypresses)
export function frieze(kind, seed, aspect) {
  const W = 2048, H = Math.round(W / (aspect || 8.5)), [c, g] = can(W, H), R = rng(seed), rh = H / 3;
  for (let r = 0; r < 3; r++) {
    const y = rh * (r + 1) - 8, h = rh - 18;
    g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, rh * (r + 1) - 3); g.lineTo(W, rh * (r + 1) - 3); g.stroke();
    if (kind === "nobles") {
      for (let x = 20 + r * 9; x < W - 20; x += h * 0.42) figure(g, x, y, h, r === 2 ? "guard" : "noble", R);
    } else {
      let x = 14;
      while (x < W - 40) {
        cypress(g, x, y, h); x += h * 0.4;
        const n = 2 + Math.floor(R() * 3);
        for (let k = 0; k < n && x < W - 40; k++) { if (k === n - 1 && R() < 0.5) { beast(g, x + h * 0.35, y, h * 0.62, R); x += h * 0.9; } else { figure(g, x, y, h, k === 0 ? "noble" : "bearer", R); x += h * 0.46; } }
        x += h * 0.12;
      }
    }
  }
  return tex(c);
}
// the lion attacking the bull, for the triangular ends of a staircase's parapet
export function lionBull() {
  const W = 512, H = 256, [c, g] = can(W, H);
  g.fillStyle = SHADE; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.ellipse(300, 170, 120, 50, -0.05, 0, Math.PI * 2); g.fill(); g.stroke();                      // the bull, rearing back
  for (const x of [220, 245, 360, 385]) { g.beginPath(); g.moveTo(x, 200); g.lineTo(x + (x > 300 ? 12 : -12), 250); g.stroke(); }
  g.beginPath(); g.moveTo(410, 150); g.lineTo(470, 95); g.lineTo(490, 115); g.lineTo(430, 175); g.closePath(); g.fill(); g.stroke();   // its head turned back
  g.beginPath(); g.moveTo(470, 95); g.quadraticCurveTo(455, 60, 480, 45); g.stroke();
  g.beginPath(); g.ellipse(230, 120, 90, 38, -0.5, 0, Math.PI * 2); g.fill(); g.stroke();                          // the lion, on its back
  g.beginPath(); g.arc(300, 75, 30, 0, Math.PI * 2); g.fill(); g.stroke();                                            // the lion's maned head
  for (let a = 0; a < 12; a++) { const t = a / 12 * Math.PI * 2; g.beginPath(); g.moveTo(300 + Math.cos(t) * 30, 75 + Math.sin(t) * 30); g.lineTo(300 + Math.cos(t) * 40, 75 + Math.sin(t) * 40); g.stroke(); }
  g.beginPath(); g.moveTo(170, 150); g.lineTo(150, 215); g.stroke(); g.beginPath(); g.moveTo(290, 100); g.lineTo(330, 150); g.stroke();
  return tex(c);
}
// the winged disc between two seated sphinxes, for the centre panel
export function wingedDisc() {
  const W = 1024, H = 256, [c, g] = can(W, H);
  g.fillStyle = SHADE; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.arc(512, 80, 26, 0, Math.PI * 2); g.fill(); g.stroke();
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(512 + s * 26, 70 + k * 6); g.quadraticCurveTo(512 + s * (110 + k * 8), 50 + k * 8, 512 + s * (190 - k * 22), 66 + k * 10); g.stroke(); }
  for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(500 + k * 8, 108); g.lineTo(492 + k * 12, 150); g.stroke(); }   // the tail
  for (const s of [-1, 1]) {                                           // the sphinxes, facing the disc
    const x = 512 + s * 300; g.beginPath(); g.ellipse(x, 200, 90, 30, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.arc(x - s * 80, 140, 22, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(x - s * 20, 185); g.quadraticCurveTo(x + s * 10, 110, x + s * 90, 130); g.stroke();
  }
  for (const x of [120, 904]) cypress(g, x, 240, 200);
  return tex(c);
}
// a guardian of the gate in profile, facing outward: a bull, or (human) a bearded, crowned, winged bull
export function guardian(human) {
  const W = 512, H = 512, [c, g] = can(W, H);
  g.fillStyle = "rgba(0,0,0,0.22)"; g.strokeStyle = "rgba(20,18,16,0.95)"; g.lineWidth = 7;
  g.beginPath(); g.ellipse(250, 300, 190, 95, 0, 0, Math.PI * 2); g.fill(); g.stroke();                          // body
  for (const x of [110, 160, 330, 380]) { g.beginPath(); g.rect(x - 16, 360, 32, 140); g.fill(); g.stroke(); }    // four legs (not the Assyrian five)
  if (human) {
    g.beginPath(); g.rect(420, 120, 70, 110); g.fill(); g.stroke();                                                // the head
    g.beginPath(); g.rect(412, 70, 86, 52); g.fill(); g.stroke();                                                  // the crown
    for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(425 + k * 12, 230); g.lineTo(425 + k * 12, 300); g.stroke(); }   // the beard
    for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(300 - k * 10, 230 - k * 4); g.quadraticCurveTo(200 - k * 20, 120 - k * 10, 60 + k * 18, 70 + k * 18); g.stroke(); }   // the wing
  } else {
    g.beginPath(); g.moveTo(400, 260); g.lineTo(480, 200); g.lineTo(500, 260); g.lineTo(440, 320); g.closePath(); g.fill(); g.stroke();   // head
    g.beginPath(); g.moveTo(470, 205); g.quadraticCurveTo(440, 150, 480, 130); g.stroke();                       // horn
  }
  return tex(c);
}
// a flat relief sheet of texture `t`, w × h, centred at (x, y, z), facing bearing `b` (0 = north, -z; clockwise)
export function panel(ctx, t, w, h, x, y, z, b) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(x, y, z); m.rotation.y = Math.PI - b; ctx.group.add(m); return m;
}
