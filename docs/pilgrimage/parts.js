/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: small shared parts for section modules
   (info markers, lamp fixtures, hand rails, glass cases, painted signs), and
   finish(), which turns a section's buckets into meshes and flags floors and
   walls for the engine.
   ========================================================================== */
import * as THREE from "three";

// ---------------------------------------------------------------- the gold info marker (a lozenge that always faces you)
let markerTex = null;
function markerTexture() {
  if (markerTex) return markerTex;
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
  const r = g.createRadialGradient(64, 64, 6, 64, 64, 62); r.addColorStop(0, "rgba(255,230,170,.55)"); r.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  g.translate(64, 64); g.rotate(Math.PI / 4);
  g.fillStyle = "#1b120a"; g.fillRect(-22, -22, 44, 44);
  g.strokeStyle = "#e7c680"; g.lineWidth = 5; g.strokeRect(-22, -22, 44, 44);
  g.rotate(-Math.PI / 4); g.fillStyle = "#e7c680"; g.font = "bold 40px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("i", 0, 2);
  markerTex = new THREE.CanvasTexture(c); markerTex.colorSpace = THREE.SRGBColorSpace;
  return markerTex;
}
export function marker(ctx, info, scale) {
  if (!info) return null;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTexture(), depthWrite: false, transparent: true, fog: false }));
  s.scale.setScalar(scale || 0.34); s.position.set(info.pos[0], info.pos[1], info.pos[2]); s.renderOrder = 5;
  ctx.group.add(s); ctx.hit(s, info);
  return s;
}
// every info point of this section gets a marker
export function markers(ctx, site, sectionId) {
  for (const i of site.info) if (i.section === sectionId && i.pos && !i.noMarker) marker(ctx, i);
}

// ---------------------------------------------------------------- lamps: a small warm fitting plus a light anchor for the engine's pool
const lampMat = new THREE.MeshBasicMaterial({ color: "#ffd9a0", fog: true });
const bracketMat = new THREE.MeshStandardMaterial({ color: "#2a2520", roughness: 0.6, metalness: 0.5 });
export function lamp(ctx, x, y, z, strength, nx, nz) {
  const g = new THREE.Group();
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.07), lampMat); g.add(bulb);
  const br = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.09), bracketMat); br.position.y = 0.05; g.add(br);
  g.position.set(x, y, z); if (nx || nz) g.rotation.y = Math.atan2(nx || 0, nz || 0);
  ctx.group.add(g);
  ctx.light(x + (nx || 0) * 0.25, y, z + (nz || 0) * 0.25, strength || 1);
}

// ---------------------------------------------------------------- hand rails along a slope (a pipe on posts)
const railMat = new THREE.MeshStandardMaterial({ color: "#3b3631", roughness: 0.45, metalness: 0.7 });
export function rail(ctx, x, z0, z1, yAt, h) {
  const a = new THREE.Vector3(x, yAt(z0) + h, z0), b = new THREE.Vector3(x, yAt(z1) + h, z1);
  const len = a.distanceTo(b), pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, len, 6), railMat);
  pipe.position.copy(a).add(b).multiplyScalar(0.5); pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  ctx.group.add(pipe);
  const n = Math.max(2, Math.round(Math.abs(z1 - z0) / 2.4));
  const post = new THREE.CylinderGeometry(0.018, 0.018, h, 5), posts = new THREE.InstancedMesh(post, railMat, n + 1), m = new THREE.Matrix4();
  for (let i = 0; i <= n; i++) { const z = z0 + (z1 - z0) * i / n; m.makeTranslation(x, yAt(z) + h / 2, z); posts.setMatrixAt(i, m); }
  ctx.group.add(posts);
}

// ---------------------------------------------------------------- a painted sign or board (canvas text, Cinzel if loaded)
export function signTexture(lines, o) {
  o = o || {};
  const w = o.w || 1024, h = o.h || 256, c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
  g.fillStyle = o.bg || "#140d07"; g.fillRect(0, 0, w, h);
  if (o.frame !== false) { g.strokeStyle = "#c79a54"; g.lineWidth = 4; g.strokeRect(10, 10, w - 20, h - 20); g.strokeStyle = "rgba(199,154,84,.4)"; g.lineWidth = 1.5; g.strokeRect(22, 22, w - 44, h - 44); }
  g.textAlign = "center"; g.textBaseline = "middle";
  const size = o.size || 64;
  lines.forEach((t, i) => {
    g.fillStyle = i === 0 ? "#e7c680" : "#cdbb96";
    g.font = (i === 0 ? "600 " : "italic ") + Math.round(i === 0 ? size : size * 0.55) + "px " + (i === 0 ? "Cinzel, 'Trajan Pro', Georgia, serif" : "'Cormorant Garamond', Georgia, serif");
    g.fillText(t, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.05);
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function sign(ctx, lines, x, y, z, yaw, w, h, o) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: signTexture(lines, o), fog: true }));
  m.position.set(x, y, z); m.rotation.y = yaw || 0; ctx.group.add(m); return m;
}

// ---------------------------------------------------------------- a glass case on a plinth, with something inside
const glassMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0, depthWrite: false });
const plinthMat = new THREE.MeshStandardMaterial({ color: "#1e150d", roughness: 0.55 });
const goldMat = new THREE.MeshStandardMaterial({ color: "#c79a54", roughness: 0.35, metalness: 0.85 });
export function glassCase(ctx, x, z, inner, info) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const pl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.95, 0.9), plinthMat); pl.position.y = 0.475; g.add(pl);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.04, 0.94), goldMat); trim.position.y = 0.97; g.add(trim);
  if (inner) { inner.position.y += 1.0; g.add(inner); }
  const gl = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.62, 0.86), glassMat); gl.position.y = 1.3; g.add(gl);
  ctx.group.add(g);
  const hitBox = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.7, 0.95), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hitBox.position.set(x, 0.85, z); ctx.group.add(hitBox); ctx.hit(hitBox, info);
  return g;
}
export { goldMat, plinthMat };

// ---------------------------------------------------------------- finish: buckets to meshes; floors are tap-to-walk targets, walls hide markers
export function finish(ctx, B, mats, floorKeys) {
  const meshes = B.build(mats, ctx.group);
  for (const m of meshes) { if ((floorKeys || []).includes(m.name)) m.userData.floor = true; else m.userData.wall = true; }
  return meshes;
}
