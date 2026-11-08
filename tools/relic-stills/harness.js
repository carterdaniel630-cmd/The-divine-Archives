/* Renders one museum rendition (docs/museum/relics.js) at a time, lit with the Foundation Kit, for
   tools/build-relic-stills.js. window.renderStill(id, w, h) resolves to a WebP data URL. */
import * as THREE from "three";
import { buildRelic, hasRelic } from "/docs/museum/relics.js";
import { studioEnvironment, rig } from "/docs/assets/foundation/kit.js";

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
const env = studioEnvironment(renderer);

// the box of what a visitor can actually see: helpers the inspector uses (hit areas, hidden parts) are left out
function seen(root) {
  const box = new THREE.Box3(); root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isMesh && !o.isLine && !o.isPoints) return;
    for (let p = o; p; p = p.parent) if (!p.visible) return;
    const ms = [].concat(o.material || []); if (!ms.length || ms.every((mt) => !mt.visible || mt.opacity < 0.05 || mt.colorWrite === false)) return;
    if (o.geometry) o.geometry.computeBoundingBox();   // some renditions move their vertices after they are measured (a cloth folds)
    box.expandByObject(o);
  });
  return box.isEmpty() ? new THREE.Box3().setFromObject(root) : box;
}
const v0 = (v, k, d) => (v && v[k] != null ? v[k] : d);
window.renderStill = async (id, w, h, view) => {
  if (!hasRelic(id)) throw new Error("no rendition for " + id);
  renderer.setPixelRatio(1); renderer.setSize(w, h, false);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0805); scene.environment = env; scene.environmentIntensity = v0(view, "env", 1.25);
  const m = buildRelic(id, env, 2, [0.9, 0.9, 0.9]);
  scene.add(m.root);
  // a shadow catcher under the object: it stands on something, with nothing patterned competing with it
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.5 }));
  floor.receiveShadow = true; scene.add(floor);
  const L = rig(scene, "gallery", "screen", { renderer });
  L.lights.forEach((l, i) => { if (i === 0 && (l.isDirectionalLight || l.isPointLight)) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.0008; } });
  const camera = new THREE.PerspectiveCamera(30, w / h, 0.02, 40);
    // framed from the object's own middle (the kit's frame() keeps a standing visitor's eye height, which is right
  // for a room and too high for one object). An object lying flat (a book, a tablet on its back) is seen from higher.
  const box = seen(m.root), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const flat = size.y < 0.4 * Math.max(size.x, size.z);
  const yaw = v0(view, "yaw", 0.32), pitch = v0(view, "pitch", flat ? 0.78 : 0.14);
  const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
  let dist = size.length() * 2;
  const corners = []; for (let i = 0; i < 8; i++) corners.push(new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z));
  for (let k = 0; k < 6; k++) {   // move in or out until the object's box fills the frame to the margin
    camera.position.copy(c).addScaledVector(dir, dist); camera.lookAt(c); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
    let e = 0; corners.forEach((p) => { const q = p.clone().project(camera); e = Math.max(e, Math.abs(q.x), Math.abs(q.y)); });
    dist *= e / v0(view, "fill", 0.86);
  }
  camera.position.copy(c).addScaledVector(dir, dist); camera.lookAt(c); camera.updateProjectionMatrix();
  await new Promise((r) => requestAnimationFrame(r));
  renderer.render(scene, camera);
  const url = canvas.toDataURL("image/webp", v0(view, "quality", 0.82));
  L.dispose();
  scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); [].concat(o.material || []).forEach((mt) => { if (!mt) return; ["map", "normalMap", "roughnessMap", "bumpMap"].forEach((k) => { if (mt[k] && mt[k].isTexture) mt[k].dispose(); }); mt.dispose(); }); });
  return url;
};
window.__ready = true;
