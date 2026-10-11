/* The Qumran caves — the site's own renditions (not Vault objects): the inspector's catalogue builders. */
import * as THREE from "three";

function rng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

// a parchment fragment's face: brown ground, illustrative lines of marks (not Aramaic text), ragged edges
function fragTex(seed) {
  const R = rng(seed), c = document.createElement("canvas"); c.width = 256; c.height = 200; const g = c.getContext("2d");
  g.fillStyle = "#6e5236"; g.fillRect(0, 0, 256, 200);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(${40 + R() * 40},${28 + R() * 30},${16 + R() * 20},${R() * 0.25})`; g.fillRect(R() * 256, R() * 200, 2 + R() * 6, 1 + R() * 3); }
  g.strokeStyle = "rgba(15,10,6,.9)"; g.lineWidth = 2.4; g.lineCap = "round";
  for (let line = 0; line < 6; line++) { let x = 236; const y = 30 + line * 28; while (x > 22) { const w = 5 + R() * 10; g.beginPath(); g.moveTo(x, y - 7); g.lineTo(x, y + 2); g.lineTo(x - w, y + 2); g.stroke(); x -= w + 4 + R() * 4; } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// a ragged outline for a fragment
function fragShape(R, w, h) {
  const s = new THREE.Shape(), n = 14;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, r = 0.62 + R() * 0.38; const x = Math.cos(a) * w * r, y = Math.sin(a) * h * r; if (i) s.lineTo(x, y); else s.moveTo(x, y); }
  s.closePath(); return s;
}
// Aramaic fragments of Enoch from Cave 4 (4Q201–212): a scatter of small brown scraps on a dark board
export function enochFragments() {
  const R = rng(4201), root = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.36), new THREE.MeshStandardMaterial({ color: "#1d1712", roughness: 0.9 })); root.add(board);
  for (let i = 0; i < 9; i++) {
    const w = 0.03 + R() * 0.06, h = 0.025 + R() * 0.05;
    const g = new THREE.ShapeGeometry(fragShape(R, w, h));
    const uv = g.attributes.uv, p = g.attributes.position;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (p.getX(k) / (2 * w)) + 0.5, (p.getY(k) / (2 * h)) + 0.5);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: fragTex(100 + i), roughness: 0.92, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2; m.rotation.z = R() * 6.3; m.position.set((R() - 0.5) * 0.4, 0.012 + i * 0.0005, (R() - 0.5) * 0.26);
    root.add(m);
  }
  return { root, note: "A modelled rendition of parchment fragments on a mounting board; the marks are illustrative, not the Aramaic text.", actions: [], act() { return null; }, update() { return false; } };
}
