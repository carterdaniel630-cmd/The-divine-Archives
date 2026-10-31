/* Angkor Wat: the bas-reliefs. Every relief here is our own simple rendering in the manner of the first gallery's
   carving (a battle of the Mahabharata, the procession of Suryavarman II, the judgement of the dead with heavens
   above and hells below), drawn in code as outlines on a transparent sheet laid on the wall so the stone shows
   through, in tiles repeated along the wall. None is a tracing of a real panel. */
import * as THREE from "three";

const can = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
const INK = "rgba(26,22,18,0.82)", SHADE = "rgba(0,0,0,0.12)";
function pen(g, w) { g.strokeStyle = INK; g.fillStyle = SHADE; g.lineWidth = w || 2; }

function warrior(g, x, y, h, dir, R) {
  pen(g, Math.max(1.2, h / 30));
  g.beginPath(); g.arc(x, y - h * 0.86, h * 0.08, 0, Math.PI * 2); g.fill(); g.stroke();                         // head with a tall crown
  g.beginPath(); g.moveTo(x - h * 0.05, y - h * 0.93); g.lineTo(x, y - h * 1.05); g.lineTo(x + h * 0.05, y - h * 0.93); g.stroke();
  g.beginPath(); g.moveTo(x, y - h * 0.78); g.lineTo(x, y - h * 0.42); g.stroke();                                // body
  g.beginPath(); g.moveTo(x, y - h * 0.42); g.lineTo(x - dir * h * 0.2, y); g.moveTo(x, y - h * 0.42); g.lineTo(x + dir * h * 0.22, y - h * 0.05); g.stroke();  // striding legs
  const a = R() * 0.6;
  g.beginPath(); g.moveTo(x, y - h * 0.7); g.lineTo(x + dir * h * 0.3, y - h * (0.85 + a * 0.2)); g.stroke();      // arm and weapon
  g.beginPath(); g.moveTo(x + dir * h * 0.3, y - h * (0.85 + a * 0.2)); g.lineTo(x + dir * h * 0.55, y - h * (1.0 + a * 0.3)); g.stroke();
  if (R() < 0.5) { g.beginPath(); g.ellipse(x - dir * h * 0.08, y - h * 0.62, h * 0.08, h * 0.14, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }   // a shield
}
function parasol(g, x, y, h) { pen(g, 2); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h); g.stroke(); g.beginPath(); g.ellipse(x, y - h, h * 0.22, h * 0.06, 0, Math.PI, 0); g.fill(); g.stroke(); }
function elephant(g, x, y, h, dir) {
  pen(g, 2.2);
  g.beginPath(); g.ellipse(x, y - h * 0.55, h * 0.55, h * 0.32, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  for (const dx of [-0.35, -0.15, 0.15, 0.35]) { g.beginPath(); g.rect(x + dx * h - h * 0.06, y - h * 0.35, h * 0.12, h * 0.35); g.fill(); g.stroke(); }
  g.beginPath(); g.arc(x + dir * h * 0.55, y - h * 0.65, h * 0.2, 0, Math.PI * 2); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x + dir * h * 0.7, y - h * 0.6); g.quadraticCurveTo(x + dir * h * 0.85, y - h * 0.2, x + dir * h * 0.75, y - h * 0.05); g.stroke();
  g.beginPath(); g.rect(x - h * 0.2, y - h * 1.05, h * 0.4, h * 0.2); g.fill(); g.stroke();                          // the howdah
}
// a tile of relief, W px wide: "battle" (two armies meeting), "procession" (the king's army, parasols, elephants),
// or "judgement" (palaces of the heavens above, the procession to judgement, the hells below)
export function relief(kind, seed) {
  const W = 2048, H = 280, [c, g] = can(W, H), R = rng(seed);
  if (kind === "battle") {
    for (let row = 0; row < 3; row++) { const y = 92 + row * 92, h = 80; for (let x = 20 + row * 13; x < W - 20; x += 30 + R() * 14) warrior(g, x, y, h, x < W / 2 ? 1 : -1, R); }
  } else if (kind === "procession") {
    for (let x = 40; x < W - 60; ) {
      if (R() < 0.18) { elephant(g, x + 50, H - 14, 150, 1); parasol(g, x + 50, H - 170, 90); x += 140; }
      else { warrior(g, x, H - 14, 120, 1, R); if (R() < 0.4) parasol(g, x + 8, H - 135, 110); x += 38; }
    }
  } else {
    pen(g, 2); g.beginPath(); g.moveTo(0, 90); g.lineTo(W, 90); g.moveTo(0, 190); g.lineTo(W, 190); g.stroke();
    for (let x = 10; x < W; x += 120) { pen(g, 2); g.beginPath(); g.rect(x, 25, 90, 60); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - 6, 25); g.lineTo(x + 45, 6); g.lineTo(x + 96, 25); g.stroke(); }   // palaces of the heavens
    for (let x = 20; x < W - 20; x += 34) warrior(g, x, 184, 86, 1, R);                                                                  // the procession of the dead
    for (let x = 14; x < W - 14; x += 26 + R() * 10) { pen(g, 1.6); const y = 270; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10, y - 50 - R() * 20); g.lineTo(x + 20, y); g.stroke(); g.beginPath(); g.arc(x + 10, y - 62 - R() * 10, 7, 0, Math.PI * 2); g.stroke(); }   // the hells, simplified to falling figures
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = THREE.RepeatWrapping; return t;
}
// a relief sheet along a wall: tile of width `tile` m repeated over length L, height h, centred at (x, y, z), facing bearing b
export function panel(ctx, t, L, h, tile, x, y, z, b) {
  const tt = t.clone(); tt.needsUpdate = true; tt.wrapS = THREE.RepeatWrapping; tt.repeat.set(L / tile, 1);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(L, h), new THREE.MeshStandardMaterial({ map: tt, roughness: 0.9, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(x, y, z); m.rotation.y = Math.PI - b; ctx.group.add(m); return m;
}
