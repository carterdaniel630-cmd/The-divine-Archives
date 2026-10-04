/* The Pilgrim's Vestibule: the archive's own room before the site (not part of the pyramid). */
import * as THREE from "three";
import site, { V0 } from "./site.js?v=1";
import { Bucket, room, V } from "../../kit.js?v=1";
import { markers, sign, glassCase, goldMat, lamp, finish } from "../../parts.js?v=1";

export function build(ctx) {
  const x0 = V0.x - 4, x1 = V0.x + 4, z0 = V0.z - 5, z1 = V0.z + 5, H = 4.8;
  const panel = new THREE.MeshStandardMaterial({ color: "#2a1d12", roughness: 0.7 });
  const ceil = new THREE.MeshStandardMaterial({ color: "#140d07", roughness: 0.9 });
  const floor = ctx.mat("wood", { color: new THREE.Color("#7a5a3c") });
  const B = new Bucket();
  room(B, { floor: "F", wall: "W", ceil: "C" }, x0, x1, z0, z1, 0, H, { n: [{ u0: 3.2, u1: 4.8, v0: 0, v1: 2.7 }] });
  finish(ctx, B, { F: floor, W: panel, C: ceil }, ["F"]);
  // gold dado and cornice lines all round
  const strip = (len, x, y, z, rotY) => { const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, 0.03), goldMat); m.position.set(x, y, z); m.rotation.y = rotY; ctx.group.add(m); };
  for (const y of [0.95, H - 0.4]) { strip(8, V0.x, y, z0 + 0.02, 0); strip(8, V0.x, y, z1 - 0.02, 0); strip(10, x0 + 0.02, y, V0.z, Math.PI / 2); strip(10, x1 - 0.02, y, V0.z, Math.PI / 2); }
  // the way in (north): a gilded doorframe with the warm haze of the desert beyond
  const frame = (x, z, w, h, rotY) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY;
    for (const sx of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, h, 0.16), goldMat); p.position.set(sx * (w / 2 + 0.07), h / 2, 0); g.add(p); }
    const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.28, 0.16, 0.16), goldMat); top.position.y = h + 0.08; g.add(top);
    ctx.group.add(g); return g;
  };
  frame(V0.x, z0, 1.6, 2.7, 0);
  const haze = document.createElement("canvas"); haze.width = 8; haze.height = 128; const hg = haze.getContext("2d");
  const gr = hg.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "#f2dfb4"); gr.addColorStop(0.55, "#d8b77e"); gr.addColorStop(1, "#8d6a3d"); hg.fillStyle = gr; hg.fillRect(0, 0, 8, 128);
  const ht = new THREE.CanvasTexture(haze); ht.colorSpace = THREE.SRGBColorSpace;
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.7), new THREE.MeshBasicMaterial({ map: ht, fog: false })); glow.position.set(V0.x, 1.35, z0 - 0.35); ctx.group.add(glow);
  sign(ctx, ["To the Great Pyramid", "the north face, Giza"], V0.x, 3.45, z0 + 0.03, 0, 2.6, 0.62);
  // the way back (south): a gilded frame onto the museum
  frame(V0.x, z1, 1.6, 2.7, Math.PI);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.7), new THREE.MeshBasicMaterial({ color: "#3a2a1a", fog: false })); back.position.set(V0.x, 1.35, z1 - 0.03); back.rotation.y = Math.PI; ctx.group.add(back);
  sign(ctx, ["Back to the Museum", "the Rotunda"], V0.x, 3.45, z1 - 0.03, Math.PI, 2.6, 0.62);
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
  lamp(ctx, V0.x, H - 0.2, V0.z - 2, 0.9); lamp(ctx, V0.x, H - 0.2, V0.z + 2, 0.9); lamp(ctx, V0.x - 2.6, 2.6, V0.z + 0.3, 0.6);
  markers(ctx, site, "v");
}
