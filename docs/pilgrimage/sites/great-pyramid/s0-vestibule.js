/* The Pilgrim's Vestibule: the archive's own room before the site (not part of the pyramid). */
import * as THREE from "three";
import site, { V0 } from "./site.js?v=1";
import * as R from "./relics.js?v=1";
import { drawCartouche } from "./glyphs.js?v=1";
import { Bucket, room, V } from "../../kit.js?v=1";
import { markers, sign, glassCase, goldMat, lamp, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const x0 = V0.x - 4, x1 = V0.x + 4, z0 = V0.z - 5, z1 = V0.z + 5, H = 4.8;
  const panel = new THREE.MeshStandardMaterial({ color: "#2a1d12", roughness: 0.7 });
  const ceil = new THREE.MeshStandardMaterial({ color: "#140d07", roughness: 0.9 });
  const floor = ctx.mat("wood", { color: new THREE.Color("#7a5a3c") });
  const B = new Bucket();
  room(B, { floor: "F", wall: "W", ceil: "C" }, x0, x1, z0, z1, 0, H);
  finish(ctx, B, { F: floor, W: panel, C: ceil }, ["F"]);
  // gold dado and cornice lines all round
  const strip = (len, x, y, z, rotY) => { const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, 0.03), goldMat); m.position.set(x, y, z); m.rotation.y = rotY; ctx.group.add(m); };
  for (const y of [0.95, H - 0.4]) { strip(8, V0.x, y, z0 + 0.02, 0); strip(8, V0.x, y, z1 - 0.02, 0); strip(10, x0 + 0.02, y, V0.z, Math.PI / 2); strip(10, x1 - 0.02, y, V0.z, Math.PI / 2); }
  // the two ways out are golden portals (../../portal.js): north to the pyramid, south back to the museum's Rotunda
  ctx.portal({ w: 1.4, h: 2.3, tint: "#ffd9a0" }, V0.x, 0, z0 + 0.2, 0);
  sign(ctx, ["To the Great Pyramid", "the north face, Giza"], V0.x, 3.9, z0 + 0.03, 0, 2.6, 0.62);
  ctx.portal({ w: 1.4, h: 2.3, tint: "#fff0d8" }, V0.x, 0, z1 - 0.2, Math.PI);
  sign(ctx, ["Back to the Museum", "the Rotunda"], V0.x, 3.9, z1 - 0.03, Math.PI, 2.6, 0.62);
  // the board: what this site is, with a cross-section
  sign(ctx, ["The Great Pyramid of Khufu", "c. 2560 BCE · the five spaces you can walk"], x1 - 0.03, 2.3, V0.z - 1.5, -Math.PI / 2, 2.4, 0.6);
  sign(ctx, ["Before you enter", "sizes from published surveys · stone drawn in code"], x1 - 0.03, 1.6, V0.z - 1.5, -Math.PI / 2, 2.4, 0.45, { size: 52 });
  // the two Vault objects, for comparison
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.06), new THREE.MeshStandardMaterial({ color: "#cdbb96", roughness: 0.85 })); slab.position.y = 0.2;
  const blue = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), new THREE.MeshBasicMaterial({ color: "#3d5a8a" })); blue.position.set(0, 0.2, 0.031);
  const g34 = new THREE.Group(); g34.add(slab, blue);
  glassCase(ctx, V0.x - 2.6, V0.z - 1.0, g34, ctx.infoById("v-v34"));
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16), new THREE.MeshStandardMaterial({ color: "#d8c08c", roughness: 0.8 })); roll.rotation.z = Math.PI / 2; roll.position.set(-0.1, 0.1, 0);
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), new THREE.MeshStandardMaterial({ color: "#e2cf9e", roughness: 0.85 })); sheet.rotation.x = -Math.PI / 2.6; sheet.position.set(0.1, 0.12, 0);
  const g20 = new THREE.Group(); g20.add(roll, sheet);
  glassCase(ctx, V0.x - 2.6, V0.z + 1.6, g20, ctx.infoById("v-v20"));
  sign(ctx, ["For comparison", "Vault objects · not from this site"], x0 + 0.03, 2.5, V0.z + 0.3, Math.PI / 2, 2.2, 0.52, { size: 54 });
  // ---- from Khufu's world (not from inside the pyramid): four cases and a board of his name
  const fit = (obj, size) => { const b = new THREE.Box3().setFromObject(obj), d = b.getSize(new THREE.Vector3()), k = size / Math.max(d.x, d.y, d.z); obj.scale.multiplyScalar(k); obj.position.y -= b.min.y * k; const g = new THREE.Group(); g.add(obj); return g; };
  const roll2 = new THREE.Group();
  const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 16), new THREE.MeshStandardMaterial({ color: "#cdb27a", roughness: 0.85 })); r2.rotation.z = Math.PI / 2; r2.position.set(-0.12, 0.035, -0.05); roll2.add(r2);
  const frag = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), new THREE.MeshStandardMaterial({ map: papyrusTex(), roughness: 0.9 })); frag.rotation.x = -Math.PI / 2.3; frag.position.set(0.08, 0.08, 0.05); roll2.add(frag);
  glassCase(ctx, V0.x + 2.6, V0.z + 1.2, roll2, ctx.infoById("v-merer"));
  glassCase(ctx, V0.x + 2.6, V0.z + 3.0, fit(R.statuette().root, 0.34), ctx.infoById("v-statuette"));
  const sh = fit(R.ship().root, 0.8); sh.rotation.y = Math.PI / 4; glassCase(ctx, V0.x - 2.6, V0.z + 3.6, sh, ctx.infoById("v-ship"));
  glassCase(ctx, V0.x + 2.6, V0.z - 3.6, fit(R.casing().root, 0.5), ctx.infoById("v-casing"));
  sign(ctx, ["From Khufu's world", "not from inside the pyramid"], x1 - 0.03, 2.5, V0.z + 2.1, -Math.PI / 2, 2.2, 0.52, { size: 54 });
  // the board of the name, on the south wall west of the way back
  const nb = document.createElement("canvas"); nb.width = 512; nb.height = 768; const ng = nb.getContext("2d");
  ng.fillStyle = "#140d07"; ng.fillRect(0, 0, 512, 768); ng.strokeStyle = "#c79a54"; ng.lineWidth = 4; ng.strokeRect(10, 10, 492, 748);
  ng.fillStyle = "#e7c680"; ng.textAlign = "center"; ng.font = "600 40px Cinzel, Georgia, serif"; ng.fillText("Khufu", 256, 74);
  drawCartouche(ng, 256, 110, 130, "ink");
  ng.fillStyle = "#cdbb96"; ng.font = "italic 26px 'Cormorant Garamond', Georgia, serif";
  ng.fillText("ḫ · w · f · w, read top to bottom", 256, 690); ng.fillText("our drawing of the signs", 256, 724);
  const nt = new THREE.CanvasTexture(nb); nt.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.5), new THREE.MeshBasicMaterial({ map: nt, fog: true })); board.position.set(V0.x - 2.4, 2.05, z1 - 0.03); board.rotation.y = Math.PI; ctx.group.add(board);
  ctx.hit(board, ctx.infoById("v-names"));
  lamp(ctx, V0.x + 2.6, 2.6, V0.z + 2.1, 0.6); lamp(ctx, V0.x - 2.4, 3.2, z1 - 0.3, 0.5);
  lamp(ctx, V0.x, H - 0.2, V0.z - 2, 0.9); lamp(ctx, V0.x, H - 0.2, V0.z + 2, 0.9); lamp(ctx, V0.x - 2.6, 2.6, V0.z + 0.3, 0.6);
  markers(ctx, site, "v");
}

// a papyrus fragment with illustrative marks in a few lines (not Merer's text)
function papyrusTex() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 170; const g = c.getContext("2d");
  g.fillStyle = "#d8c18c"; g.fillRect(0, 0, 256, 170);
  g.strokeStyle = "rgba(120,95,55,.25)"; for (let y = 0; y < 170; y += 5) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y + 2); g.stroke(); }
  let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  g.strokeStyle = "rgba(30,20,10,.85)"; g.lineWidth = 2.2; g.lineCap = "round";
  for (let line = 0; line < 6; line++) { let x = 236; const y = 26 + line * 24; while (x > 30) { const w = 4 + r() * 12; g.beginPath(); g.moveTo(x, y - r() * 8); g.quadraticCurveTo(x - w / 2, y + r() * 6, x - w, y - r() * 4); g.stroke(); x -= w + 3 + r() * 5; } }
  g.fillStyle = "rgba(80,50,25,.9)"; for (let i = 0; i < 3; i++) g.fillRect(200 - i * 70, 4, 22, 6);   // red-ink style headings, illustrative
  g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(r() * 256, r() < 0.5 ? r() * 14 : 170 - r() * 14, 6 + r() * 16, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
