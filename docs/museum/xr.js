// The museum in a VR headset (WebXR): the door, and the way back.
// Spec: handoff/vr-architecture.md §1–§2 and §5 (feature probe, session request with the declared seated fallback,
// camera rig, per-tier foveation and framebuffer scale, fallback matrix). Core three.js only: its own WebXRManager
// (renderer.xr) does the stereo rendering; no examples modules, no CDN, no second GL context.
//
// What this module does NOT do yet (later VR-loop pieces): movement and turning in the headset (comfort, G2),
// the in-scene plaques and status text, controller and hand input, the curtain over rooms under review (G4).
//
// How the rig works: three.js poses the camera it is given relative to that camera's PARENT. So while a session is
// on, the museum's own camera is moved into `rig`, a group standing where the visitor stood on the flat screen and
// turned the way they faced; the headset's pose then lands on top of it, and the visitor's torch (a child of the
// camera) follows the head. When the session ends the camera goes back to the scene and the visitor is put down
// where their head was, facing where it faced. Nothing here ever writes the XR camera itself.
import * as THREE from "three";

export const XRProbe = {
  supported: false,       // navigator.xr exists in a secure context
  vrSupported: false,     // isSessionSupported('immersive-vr') resolved true
  reason: "unprobed",     // 'no-navigator-xr' | 'secure-context' | 'no-vr' | 'ok' | 'session-failed'
  mode: "flat",           // 'flat' | 'xr'
  seated: false,          // the declared seated mode (no local-floor on this device)
  tier: null, foveation: null, layerFoveation: null, scale: null, framebuffer: null,
  error: null,            // the last session error, for diagnosis
  enters: 0, exits: 0
};

// Per-tier constants (vr-architecture.md §2.3 as amended 2026-11-01; vr-performance-budget.md §1, §3). Quest 2 is the
// floor device, so any headset not known to be Quest 3-class gets the floor's lighter settings.
export const TIERS = {
  floor: { foveation: 1.0, scale: 0.8 },   // Quest 2 and unknown headsets
  q3: { foveation: 0.75, scale: 1.0 }      // Quest 3 / 3S / Pro
};
export function tierOf(ua) { return /Quest (3|Pro)/i.test(ua || "") ? "q3" : "floor"; }

export async function probeXR() {
  XRProbe.supported = false; XRProbe.vrSupported = false;
  if (typeof navigator === "undefined" || !("xr" in navigator) || !navigator.xr) { XRProbe.reason = "no-navigator-xr"; return XRProbe; }
  if (!window.isSecureContext) { XRProbe.reason = "secure-context"; return XRProbe; }
  XRProbe.supported = true;
  try {
    XRProbe.vrSupported = !!(await navigator.xr.isSessionSupported("immersive-vr"));
    XRProbe.reason = XRProbe.vrSupported ? "ok" : "no-vr";
  } catch (e) { XRProbe.reason = "no-vr"; }
  return XRProbe;
}

function shortReason(err) {
  const n = err && err.name;
  if (n === "NotSupportedError") return "this device does not offer it";
  if (n === "SecurityError" || n === "NotAllowedError") return "the browser did not allow it";
  if (n === "InvalidStateError") return "a VR session is already open";
  return "it did not start";
}

// renderer: the museum's WebGLRenderer; camera: its one camera; scene: its one scene.
// floorY: the height of the museum floor; seatedEye: eye height in the declared seated mode (1.2 m, §1.3).
// onStart({ seated }) / onEnd({ x, z, yaw }) let the museum hide or restore its page and put the visitor down;
// onMessage(text) shows one honest line on the page (house voice: no "please", no exclamation).
export function createXR({ renderer, camera, scene, floorY = 0, seatedEye = 1.2, onStart, onEnd, onMessage }) {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");
  const rig = new THREE.Group();
  rig.name = "xr-rig"; rig.visible = false;
  scene.add(rig);
  const wp = new THREE.Vector3(), wq = new THREE.Quaternion(), we = new THREE.Euler(0, 0, 0, "YXZ");
  let pending = null, busy = false, live = false;

  function begin() {
    const p = pending || { x: camera.position.x, z: camera.position.z, yaw: 0, seated: false };
    rig.position.set(p.x, p.seated ? floorY + seatedEye : floorY, p.z);
    rig.rotation.set(0, p.yaw, 0);
    rig.visible = true;        // lights inside an invisible group are skipped by three.js: the torch needs it shown
    rig.add(camera);           // the head pose now lands relative to the rig
    rig.updateMatrixWorld(true);
    live = true; XRProbe.mode = "xr"; XRProbe.enters++;
    if (onStart) onStart({ seated: p.seated });
  }

  // the restore path must not depend on XR state: it runs from plain values and always ends flat
  function finish() {
    if (!live) return;
    live = false;
    let out = null;
    try {
      camera.getWorldPosition(wp); camera.getWorldQuaternion(wq); we.setFromQuaternion(wq, "YXZ");
      out = { x: wp.x, z: wp.z, yaw: we.y };
    } catch (e) { out = null; }
    scene.add(camera);         // back to the scene (also removes it from the rig)
    camera.position.set(0, 0, 0); camera.quaternion.identity(); camera.scale.set(1, 1, 1);
    rig.visible = false;
    try { renderer.xr.setFoveation(0); } catch (e) { /* no session left to apply it to */ }
    XRProbe.mode = "flat"; XRProbe.exits++;
    pending = null;
    if (onEnd) onEnd(out && isFinite(out.x) && isFinite(out.z) ? out : null);
  }

  renderer.xr.addEventListener("sessionstart", begin);
  renderer.xr.addEventListener("sessionend", finish);

  // must be called straight from the visitor's tap (WebXR needs the user's gesture); pose = where they stand flat
  async function enter(pose) {
    if (!XRProbe.vrSupported || busy || renderer.xr.isPresenting) return false;
    busy = true;
    const tier = tierOf(navigator.userAgent), t = TIERS[tier];
    let session = null, seated = false;
    try {
      try {
        session = await navigator.xr.requestSession("immersive-vr", { requiredFeatures: ["local-floor"], optionalFeatures: ["hand-tracking", "layers"] });
      } catch (floorErr) {
        // the declared seated fallback (§1.3, AM-ARC-01): no local-floor does not refuse the session; it opens seated
        session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor", "hand-tracking", "layers"] });
        seated = !(session.enabledFeatures && session.enabledFeatures.includes("local-floor"));
      }
      renderer.xr.setReferenceSpaceType(seated ? "local" : "local-floor");
      renderer.xr.setFramebufferScaleFactor(t.scale);      // must be set before the session is bound
      pending = { x: pose.x, z: pose.z, yaw: pose.yaw, seated };
      XRProbe.seated = seated; XRProbe.tier = tier;
      await renderer.xr.setSession(session);              // fires 'sessionstart' → begin()
      renderer.xr.setFoveation(t.foveation);
      // read back what actually took, rather than assuming it (vr-architecture.md §8 step 7)
      XRProbe.foveation = renderer.xr.getFoveation() == null ? null : renderer.xr.getFoveation();
      XRProbe.scale = t.scale;
      const bl = session.renderState && session.renderState.baseLayer;
      XRProbe.framebuffer = bl ? [bl.framebufferWidth, bl.framebufferHeight] : "projection layer";
      XRProbe.layerFoveation = bl && typeof bl.fixedFoveation === "number" ? bl.fixedFoveation : null;   // what the headset's layer reports, where it says
      return true;
    } catch (err) {
      XRProbe.reason = "session-failed";
      XRProbe.error = (err && (err.name + ": " + err.message)) || String(err);
      if (session) { try { await session.end(); } catch (e) { /* already ended */ } }
      finish();
      if (onMessage) onMessage("The museum could not open in VR (" + shortReason(err) + "). It remains open in 3D.");
      return false;
    } finally { busy = false; }
  }

  function exit() { const s = renderer.xr.getSession(); if (s) return s.end().catch(() => finish()); finish(); return Promise.resolve(); }

  return { rig, enter, exit, get presenting() { return renderer.xr.isPresenting; } };
}
