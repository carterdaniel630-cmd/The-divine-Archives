// Standing or seated in the VR headset, and how high the visitor's eyes are (VR loop piece "height check").
// Spec: handoff/vr-comfort-brief.md §d.15 (seated mode: eye height 1.2 m when there is no floor or the visitor
// chooses seated; heights re-anchor), §c.10–§c.14 (text size, contrast, reading distance, plaque height and tilt),
// §e.22 (nothing appears within 2 m), §f.24 (the choice is kept on this device only), §f.25 (the seated choice is
// offered on first entry); handoff/vr-interaction-spec.md §2 (seated mode, explicit toggle); vr-pilot-spec.md
// (reference space: `local-floor` requested, otherwise the declared seated mode — never a silent substitution).
//
// Why this piece exists: Carter's first walk in his headset (2026-11-16) felt "too low" standing. The cause could be
// the headset's own floor level or the seated fallback; this piece shows which, in the headset and on the page after
// leaving, and lets the visitor change posture.
//
// The posture plaque: a dark slab with cream lettering, standing in the world (never head-locked) about 2 m in front
// of where the visitor enters, present from the session's first drawn frame and staying put for the session. It says
// the posture and the eye height, and a short trigger press while pointing at it changes standing ↔ seated. The change
// happens inside the same dip-to-dark a teleport uses, because it moves the whole world up or down at once.
//
// Heights. Standing with the headset's floor (`local-floor`): the eyes are where the headset says they are, measured
// from its floor; nothing is added. Seated (by choice or because the headset gave no floor): the eyes are set at
// 1.2 m above the museum floor, measured once at the change (so leaning still moves the head). Standing on a headset
// that gave no floor: the eyes are set at the museum's standing eye height (1.62 m, the flat museum's own), and the
// plaque says the height is set, not measured.
import * as THREE from "three";

export const HEIGHT = {
  KEY: "mu-vr-posture",          // localStorage, this device only (Comfort §f.24)
  DIST: 2.0, NEAR: 1.2,          // m in front of the entry spot (reading distance 0.8–2.5 m, §c.12)
  W: 1.5, H: 0.66,               // panel, m
  PX: 768,                       // canvas pixels per metre
  TILT: 8 * Math.PI / 180,       // tilted back when below eye level (§c.14: 5–10°)
  LOW: 1.4                       // a measured standing eye height below this gets the floor-level hint
};

// the angle a cap height subtends at a distance, in degrees (Comfort §c.10: body ≥ 1.3°, titles ≥ 1.8°)
export function capAngle(capMetres, dist) { return 2 * Math.atan(capMetres / 2 / dist) * 180 / Math.PI; }

// What the plaque and the page say. Pure, so the checks can read it without a headset.
export function postureText({ posture, floor, eye }) {
  const e = eye == null || !isFinite(eye) ? null : eye.toFixed(2);
  const lines = [];
  if (posture === "standing" && floor) {
    lines.push(e ? `Eyes ${e} m above the floor` : "Eyes: measuring");
    if (eye != null && eye < HEIGHT.LOW) lines.push("Low? Reset the headset's floor");
  } else {
    lines.push(`Eyes set at ${(posture === "seated" ? 1.2 : 1.62).toFixed(2)} m`);
    if (!floor) lines.push("The headset gave no floor height");
  }
  lines.push(`Point here and tap: ${posture === "seated" ? "stand" : "sit"}`);
  return { title: posture === "seated" ? "SEATED" : "STANDING", lines };
}

export function exitNote({ posture, floor, eye }) {
  if (posture === "standing" && floor && eye != null && isFinite(eye)) {
    const low = eye < HEIGHT.LOW ? " That is lower than most standing eyes: the headset's floor level may be set too high, which its boundary setup can reset." : "";
    return `In VR you were standing, eyes ${eye.toFixed(2)} m above the museum floor (measured by the headset).${low}`;
  }
  const set = posture === "seated" ? "1.20" : "1.62";
  return `In VR you were ${posture}, eyes set at ${set} m${floor ? "" : " (the headset gave no floor height)"}.`;
}

// camera, rig, scene: the museum's own and xr.js's rig; floorY: museum floor; standEye/seatedEye: set heights;
// clear(ax, az, bx, bz): is the line between two floor points free of walls? dip(cb): run cb at the dark of a dip;
// load()/save(v): the visitor's remembered posture on this device.
export function createXRHeight({ camera, rig, scene, floorY = 0, standEye = 1.62, seatedEye = 1.2, clear, dip, load, save }) {
  const dbg = { posture: null, floor: null, eye: null, placed: null, plaqueY: null, hover: false, changes: 0, frames: 0, title: null, lines: null, bodyDeg: null, titleDeg: null, dist: null };
  let live = false, posture = "standing", floor = true, frames = 0, shown = null, redraw = 0, pending = false;
  const W = Math.round(HEIGHT.W * HEIGHT.PX), Hh = Math.round(HEIGHT.H * HEIGHT.PX);
  // built on the first entry into VR only, so a phone or a computer without a headset never pays for it
  let canvas = null, tex = null, face = null;
  // sizes from the angle rules at the plaque's farthest placement (2 m): cap height ≈ 0.7 of the font size
  const bodyPx = Math.ceil(capPx(1.45) / 0.69), titlePx = Math.ceil(capPx(1.95) / 0.7);
  function capPx(deg) { return 2 * HEIGHT.DIST * Math.tan(deg / 2 * Math.PI / 180) * HEIGHT.PX; }
  dbg.bodyDeg = +capAngle(bodyPx * 0.69 / HEIGHT.PX, HEIGHT.DIST).toFixed(2);
  dbg.titleDeg = +capAngle(titlePx * 0.7 / HEIGHT.PX, HEIGHT.DIST).toFixed(2);

  const plaque = new THREE.Group(); plaque.name = "xr-posture"; plaque.visible = false; scene.add(plaque);
  function build() {
    if (canvas) return;
    canvas = document.createElement("canvas"); canvas.width = W; canvas.height = Hh;
    tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const back = new THREE.Mesh(new THREE.BoxGeometry(HEIGHT.W + 0.06, HEIGHT.H + 0.06, 0.04), new THREE.MeshBasicMaterial({ color: "#8a6a3a", fog: false, toneMapped: false }));
    back.position.z = -0.025;
    face = new THREE.Mesh(new THREE.PlaneGeometry(HEIGHT.W, HEIGHT.H), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false }));
    plaque.add(back, face);
  }

  const head = new THREE.Vector3(), dir = new THREE.Vector3(), ray = new THREE.Raycaster(), o = new THREE.Vector3(), q = new THREE.Quaternion();

  function headLocalY() { camera.getWorldPosition(head); return head.y - rig.position.y; }
  function eyeNow() { camera.getWorldPosition(head); return head.y - floorY; }

  function draw() {
    if (!canvas) return;
    const t = postureText({ posture, floor, eye: dbg.eye });
    const g = canvas.getContext("2d");
    g.fillStyle = "#140c07"; g.fillRect(0, 0, W, Hh);
    g.strokeStyle = dbg.hover ? "#e0b252" : "#6b5230"; g.lineWidth = dbg.hover ? 10 : 6; g.strokeRect(8, 8, W - 16, Hh - 16);
    g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillStyle = "#f3e6c8";
    const pad = 54;
    g.font = `600 ${titlePx}px Cinzel, Georgia, serif`;
    let y = pad + titlePx * 0.8; g.fillText(t.title, pad, y);
    g.font = `400 ${bodyPx}px Georgia, "Times New Roman", serif`;
    for (const line of t.lines) {
      y += bodyPx * 1.32;
      // never shrink below the angle rule: a line that would not fit is a text fault, caught by the checks
      g.fillText(line, pad, y, W - pad * 2);
      if (g.measureText(line).width > W - pad * 2) dbg.overflow = line;
    }
    tex.needsUpdate = true;
    dbg.title = t.title; dbg.lines = t.lines; shown = t.lines.join("|") + dbg.hover;
  }

  // the plaque's centre sits a quarter metre below the eyes, inside the standing (1.35–1.55 m) or seated (0.9–1.1 m)
  // band of Comfort §c.14, and tilts back because it is below eye level
  function anchorY(eye) {
    const lo = posture === "seated" ? 0.9 : 1.35, hi = posture === "seated" ? 1.1 : 1.55;
    return floorY + Math.min(hi, Math.max(lo, eye - 0.25));
  }

  // put the plaque in front of the head, on a line no wall crosses; try straight ahead first, then nearer, then to the
  // sides, then behind
  function place() {
    camera.getWorldPosition(head); camera.getWorldDirection(dir);
    const yaw0 = Math.atan2(dir.x, dir.z);
    const tries = [];
    for (const d of [HEIGHT.DIST, HEIGHT.NEAR]) for (const a of [0, 0.5, -0.5, 1.1, -1.1, 1.6, -1.6, Math.PI]) tries.push([d, a]);
    let pick = tries[0];
    for (const [d, a] of tries) {
      const yaw = yaw0 + a, x = head.x + Math.sin(yaw) * d, z = head.z + Math.cos(yaw) * d;
      // the plaque's edges as well as its centre must be clear of walls
      const ex = Math.cos(yaw) * HEIGHT.W / 2, ez = -Math.sin(yaw) * HEIGHT.W / 2;
      if (!clear || (clear(head.x, head.z, x, z) && clear(head.x, head.z, x + ex, z + ez) && clear(head.x, head.z, x - ex, z - ez))) { pick = [d, a]; break; }
    }
    const yaw = yaw0 + pick[1];
    plaque.position.set(head.x + Math.sin(yaw) * pick[0], 0, head.z + Math.cos(yaw) * pick[0]);
    plaque.rotation.set(0, 0, 0, "YXZ");
    plaque.rotation.y = Math.atan2(head.x - plaque.position.x, head.z - plaque.position.z);
    plaque.rotation.x = -HEIGHT.TILT;
    dbg.dist = +pick[0].toFixed(2); dbg.placed = [+plaque.position.x.toFixed(2), +plaque.position.z.toFixed(2)];
  }
  function setPlaqueY() { plaque.position.y = anchorY(dbg.eye == null ? (posture === "seated" ? seatedEye : standEye) : dbg.eye); dbg.plaqueY = +plaque.position.y.toFixed(3); }

  // set the rig's height for the posture; heights are set from the head's height inside the rig at this moment
  function apply() {
    if (posture === "standing" && floor) rig.position.y = floorY;
    else rig.position.y = floorY + (posture === "seated" ? seatedEye : standEye) - headLocalY();
    rig.updateMatrixWorld(true);
    dbg.eye = +eyeNow().toFixed(3); dbg.posture = posture; dbg.floor = floor;
    setPlaqueY(); draw();
  }

  function attach({ floor: hasFloor }) {
    floor = !!hasFloor; build();
    let saved = null; try { saved = load ? load() : null; } catch (e) { saved = null; }
    // the headset's floor decides the first posture (spec: no floor → declared seated), a remembered choice overrides it
    posture = saved === "seated" || saved === "standing" ? saved : floor ? "standing" : "seated";
    live = true; frames = 0; pending = false; dbg.hover = false; dbg.eye = null; dbg.overflow = null;
    plaque.visible = false;   // shown with the first frame whose head pose is known (two frames in), placed already
  }

  function detach() {
    if (!live) return null;
    live = false; plaque.visible = false; dbg.hover = false;
    const note = dbg.eye == null ? null : exitNote({ posture, floor, eye: dbg.eye });
    dbg.note = note;
    return note;
  }

  function change() {
    if (!live || pending) return false;
    const go = () => {
      pending = false;
      posture = posture === "seated" ? "standing" : "seated";
      try { if (save) save(posture); } catch (e) { /* storage blocked: the choice lasts this session */ }
      apply(); dbg.changes++;
    };
    pending = true;
    if (!dip) { go(); return true; }
    if (!dip(go)) { pending = false; return false; }   // mid-aim or mid-dip: nothing happens, the next tap can try
    return true;
  }

  // a short trigger press from a hand: does its ray meet the plaque?
  function hits(ctrl) {
    if (!plaque.visible || !face) return false;
    ctrl.getWorldPosition(o); ctrl.getWorldQuaternion(q);
    ray.set(o, dir.set(0, 0, -1).applyQuaternion(q)); ray.far = 6;
    return ray.intersectObject(face, false).length > 0;
  }
  function tap(ctrl) { return hits(ctrl) ? change() : false; }

  function update(dt, ctrls) {
    if (!live) return;
    frames++; dbg.frames = frames;
    // the head pose reaches the camera during the first XR render; measure and place from the second frame on
    if (frames === 2) { apply(); place(); setPlaqueY(); plaque.visible = true; }
    if (frames < 2) return;
    if (posture === "standing" && floor) {
      redraw += dt;
      const e = eyeNow();
      if (redraw >= 1 && Math.abs(e - dbg.eye) >= 0.03) { redraw = 0; dbg.eye = +e.toFixed(3); draw(); }
    }
    const hov = !!(ctrls && ctrls.some((c) => c && hits(c)));
    if (hov !== dbg.hover) { dbg.hover = hov; draw(); }
    else if (shown === null) draw();
  }

  return { attach, detach, update, tap, change, plaque, debug: dbg, get posture() { return posture; }, image: () => (canvas ? canvas.toDataURL("image/png") : null) };
}
