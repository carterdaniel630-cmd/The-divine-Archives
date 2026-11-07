/* The Foundation Kit bench: the kit's materials, rigs, ground and scale, shown by themselves (kit-bench.html).
   Test hook: window.__KB. */
import * as THREE from "three";
import { material, metreUVs, tileOf, ground, rig, studioEnvironment, scaleFigure, frame, RIGS } from "../assets/foundation/kit.js";

const canvas = document.getElementById("scene"), readout = document.getElementById("readout");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0805);
scene.environment = studioEnvironment(renderer); scene.environmentIntensity = 1.0;
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80);

scene.add(ground("worked-stone", 14, { tint: 0x8a8070 }));   // the floor is darker than the pieces, so the pieces read first

// the six pieces, each a plain form chosen to show its material honestly (not a model of any object)
const pieces = [];
const put = (name, label, mesh, x, z) => { mesh.position.x += x; mesh.position.z += z; mesh.castShadow = true; mesh.receiveShadow = true; mesh.name = name; scene.add(mesh); pieces.push({ name, label, mesh }); };
const uv = (g, kind) => metreUVs(g, tileOf(kind));
{ const g = uv(new THREE.BoxGeometry(0.9, 0.6, 0.5).translate(0, 0.3, 0), "worked-stone"); put("worked-stone", "Worked stone (dressed, in courses)", new THREE.Mesh(g, material("worked-stone", { seed: 3 })), -1.15, 0.55); }
{ const pts = [[0, 0], [0.16, 0.02], [0.22, 0.16], [0.2, 0.34], [0.12, 0.44], [0.14, 0.52], [0.0, 0.52]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = uv(new THREE.LatheGeometry(pts, 48), "bronze"); put("bronze", "Bronze (cast, with patina in the hollows)", new THREE.Mesh(g, material("bronze", { seed: 5, side: THREE.DoubleSide })), 0.0, -0.95); }
{ const g = uv(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 64).rotateX(Math.PI / 2).translate(0, 0.42, 0), "gold"); const disc = new THREE.Mesh(g, material("gold", { seed: 7 }));
  const stand = new THREE.Mesh(uv(new THREE.BoxGeometry(0.12, 0.16, 0.12).translate(0, 0.08, 0), "wood"), material("wood", { seed: 2 })); disc.add(stand); stand.position.y = 0; put("gold", "Gold (worked sheet)", disc, -1.05, -0.95); }
{ const g = new THREE.PlaneGeometry(0.62, 0.44, 24, 16); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 9) * 0.006 + Math.sin(p.getY(i) * 13) * 0.004); g.computeVertexNormals();
  g.rotateX(-Math.PI / 2 + 0.5).translate(0, 0.32, 0); const lect = new THREE.Mesh(uv(new THREE.BoxGeometry(0.5, 0.26, 0.34).translate(0, 0.13, 0), "wood"), material("wood", { seed: 4 }));
  const sheet = new THREE.Mesh(uv(g, "parchment"), material("parchment", { seed: 11, side: THREE.DoubleSide })); lect.add(sheet); put("parchment", "Aged parchment (on a wooden stand)", lect, 0.05, 0.55); }
{ const pts = [[0, 0], [0.1, 0.0], [0.17, 0.08], [0.2, 0.24], [0.15, 0.38], [0.08, 0.44], [0.09, 0.5], [0.0, 0.5]].map(([x, y]) => new THREE.Vector2(x, y));
  put("ceramic", "Ceramic (burnished, with crazing)", new THREE.Mesh(uv(new THREE.LatheGeometry(pts, 48), "ceramic"), material("ceramic", { seed: 13, side: THREE.DoubleSide })), 1.05, -0.95); }
{ put("wood", "Wood (sawn board, grain and knots)", new THREE.Mesh(uv(new THREE.BoxGeometry(0.3, 1.2, 0.06).rotateZ(0.12).translate(0.06, 0.6, 0), "wood"), material("wood", { seed: 17 })), 1.1, 0.55); }
const marker = scaleFigure(); marker.position.set(-2.0, 0, -0.1); scene.add(marker);

// the light
let R = null;
const state = { rig: "flame", grade: "screen", view: "all", piece: 0 };
function setRig(name) { if (R) R.dispose(); R = rig(scene, name, state.grade, { renderer }); R.lights.forEach((l) => { if (l.isPointLight || l.isDirectionalLight) { l.castShadow = l === R.lights[0]; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.0008; } }); state.rig = name; paintBar(); dirty = true; }
function setGrade(g) { state.grade = g; R.set(g); paintBar(); dirty = true; }

// the camera: orbit by drag, zoom by pinch or wheel
const orbit = { yaw: 0.35, pitch: 0.32, dist: 5, target: new THREE.Vector3(0, 0.45, 0) };
function place() { const { yaw, pitch, dist, target } = orbit; camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist); camera.lookAt(target); dirty = true; }
function setView(v) {
  state.view = v;
  if (v === "next") { state.piece = (state.piece + 1) % pieces.length; v = "close"; state.view = "close"; }
  if (v === "all") { orbit.target.set(-0.3, 0.35, 0.05); orbit.dist = camera.aspect < 1.2 ? 7.4 : 5.2; orbit.pitch = 0.32; }
  else { const P = pieces[state.piece]; const f = frame(camera, P.mesh, { margin: 1.25, yaw: 0.15, pitch: 0.3 }); orbit.target.copy(f.center); orbit.dist = Math.max(0.55, f.distance); orbit.pitch = 0.2; }
  place(); paintBar();
}
let drag = null, pinch = null;
canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener("pointermove", (e) => { if (!drag || pinch) return; orbit.yaw -= (e.clientX - drag.x) * 0.006; orbit.pitch = Math.max(0.02, Math.min(1.2, orbit.pitch + (e.clientY - drag.y) * 0.004)); drag = { x: e.clientX, y: e.clientY }; place(); });
canvas.addEventListener("pointerup", () => { drag = null; });
canvas.addEventListener("wheel", (e) => { e.preventDefault(); orbit.dist = Math.max(0.4, Math.min(14, orbit.dist * (1 + Math.sign(e.deltaY) * 0.1))); place(); }, { passive: false });
canvas.addEventListener("touchstart", (e) => { if (e.touches.length === 2) pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
canvas.addEventListener("touchmove", (e) => { if (e.touches.length === 2 && pinch) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); orbit.dist = Math.max(0.4, Math.min(14, orbit.dist * pinch / d)); pinch = d; place(); } }, { passive: true });
canvas.addEventListener("touchend", () => { pinch = null; });

// the buttons
function paintBar() {
  document.querySelectorAll("[data-rig]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.rig === state.rig)));
  document.querySelectorAll("[data-grade]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.grade === state.grade)));
  document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
  readout.textContent = RIGS[state.rig].label + " · " + (state.grade === "phone" ? "phone grade" : "screen grade") + (state.view === "close" ? " · " + pieces[state.piece].label : "");
}
document.querySelectorAll("[data-rig]").forEach((b) => b.addEventListener("click", () => setRig(b.dataset.rig)));
document.querySelectorAll("[data-grade]").forEach((b) => b.addEventListener("click", () => setGrade(b.dataset.grade)));
document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

// render only when something changed (rest when still, for phone batteries)
let dirty = true;
function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); dirty = true; }
addEventListener("resize", resize);
function loop() { if (dirty) { renderer.render(scene, camera); dirty = false; } requestAnimationFrame(loop); }
resize(); setRig("flame"); setView("all"); loop();

window.__KB = { state: () => Object.assign({}, state, { pieces: pieces.map((p) => p.name), calls: renderer.info.render.calls }), rig: setRig, grade: setGrade, view: setView, piece: (i) => { state.piece = i; setView("close"); } };
