// Stick walking in the VR headset: the opt-in setting and its plaque (VR loop piece "stick walking").
// Carter's ruling, 2026-11-21 (handoff/decisions-2026-11-21-carter-vr-stick-walking-a.md): add smooth thumbstick
// walking as an option in the pilot rooms; teleport stays the default and stick walking is opt-in. It answers item 7 of
// his first headset walk (handoff/field-report-2026-11-16-vr-walk.md: "trigger instead of analog movement").
// Spec: handoff/vr-comfort-brief.md §a.2 (smooth movement is opt-in only, behind a panel that warns "more intense",
// with 2 deliberate confirmations; a default session never shows it), §f.24 (kept on this device only), §c.10–§c.14
// (text size, plaque height and tilt); handoff/vr-interaction-spec.md §1 row 1 and §2 (left thumbstick, opt-in).
// The walking itself (speed, ramp, vignette, walls) is in xr-move.js.
//
// The walking plaque stands in the world beside the posture plaque (xr-height.js), never head-locked, at the same
// height and tilt. A short trigger press while pointing at it asks to turn stick walking on; the plaque then warns
// "more intense" and needs two more presses, each at least half a second after the one before, to turn it on (the
// request, then confirmation 1 of 2, then 2 of 2). Doing nothing for 10 seconds drops the request. Turning it off is
// one press: the comfortable direction never needs confirming.
//
// Carter's headset walk, 2026-11-22 (handoff/vr-fix-order-2026-11-22-carters-walk.md, fault 2): he could not make stick
// walking work. The plaque stood only where he entered, so after a teleport it was behind him or rooms away, and
// pushing a stick did nothing visible. Now pushing a stick forward or back without stick walking on brings the plaque
// to the visitor (summon()): it is placed again in front of them, in the world (never head-locked), on a line no wall
// crosses, and its border lights for a few seconds. Opt-in and the two confirmations are unchanged.
import * as THREE from "three";

export const WALK = {
  KEY: "mu-vr-walk",            // localStorage, this device only (Comfort §f.24): "on" or "off"
  DIST: 2.0, NEAR: 1.2,         // m from the head, as the posture plaque (reading distance 0.8–2.5 m, §c.12)
  W: 1.5, H: 0.66, PX: 768,     // panel size, m; canvas pixels per metre
  TILT: 8 * Math.PI / 180,      // tilted back when below eye level (§c.14: 5–10°)
  GAP: 0.5,                     // s: a press sooner than this after the last one is not a deliberate confirmation
  TIMEOUT: 10,                  // s: an unanswered request falls back to off
  SIDE: [0.8, -0.8, 1.2, -1.2, 1.6, -1.6, 2.4, -2.4],  // rad from the posture plaque's direction, tried in order
  FRONT: [0.3, -0.3, 0, 0.45, -0.45, 0.6, -0.6, 0.8, -0.8, 1.0, -1.0],   // rad from where the head faces, tried in order, when summoned
  APART: 0.05,                  // rad of clear sky between this plaque and the posture plaque, seen from the head
  VIEW: 0.6,                    // rad: a plaque this close to where the head faces, within reading distance, is in view already
  CALL: 3,                      // s the border stays lit after a summon
  AGAIN: 4                      // s: a second summon sooner than this is ignored (no chasing the visitor around)
};

// What the plaque says. state: "off" | "ask1" | "ask2" | "on"; left: is there a left-hand controller to walk with?
// Pure, so the checks can read it without a headset.
export function walkText(state, left) {
  if (state === "ask1") return { title: "MORE INTENSE", lines: ["The room glides past you;", "some people feel queasy.", "Tap again to go on (1 of 2)"] };
  if (state === "ask2") return { title: "MORE INTENSE", lines: ["Left stick walks, 2 m/s top.", "Teleport still works.", "Tap to turn it on (2 of 2)"] };
  if (state === "on") return { title: "STICK WALKING", lines: [left ? "On: the left stick walks" : "On: needs the left controller", "Teleport still works", "Point here and tap: off"] };
  return { title: "STICK WALKING", lines: ["Off: you move by teleport", "Point here and tap", "to turn stick walking on"] };
}

// The opt-in steps, pure: the next state after a press (t: seconds since the last press, null for none) or after time
// passing with no press. Returns { state, save } where save is the value to keep on the device, if any.
export function walkPress(state, t) {
  if (state === "on") return { state: "off", save: "off" };
  if (state === "off") return { state: "ask1" };
  if (t != null && t < WALK.GAP) return { state };            // too quick to be deliberate: ignored
  if (state === "ask1") return { state: "ask2" };
  return { state: "on", save: "on" };
}

// camera, scene: the museum's own; anchor: the posture plaque (xr-height.js), whose height this plaque follows;
// clear(ax, az, bx, bz): is the line between two floor points free of walls? load()/save(v): this device's choice;
// onChange(on): stick walking switched on or off; hasLeft(): is a left-hand controller connected?
export function createXRWalk({ camera, scene, anchor, clear, load, save, onChange, hasLeft }) {
  const dbg = { state: "off", on: false, placed: null, dist: null, hover: false, presses: 0, summons: 0, moved: 0, lit: false, title: null, lines: null, overflow: null, bodyDeg: null, titleDeg: null, y: null };
  let live = false, state = "off", since = null, idle = 0, shown = null, left = null, lit = 0, lastCall = -1e9;
  const W = Math.round(WALK.W * WALK.PX), Hh = Math.round(WALK.H * WALK.PX);
  // the posture plaque's sizes: body ≥ 1.3°, title ≥ 1.8° at the farthest placement (2 m); cap height ≈ 0.7 em
  const capPx = (deg) => 2 * WALK.DIST * Math.tan(deg / 2 * Math.PI / 180) * WALK.PX;
  const bodyPx = Math.ceil(capPx(1.45) / 0.69), titlePx = Math.ceil(capPx(1.95) / 0.7);
  const ang = (cap) => 2 * Math.atan(cap / WALK.PX / 2 / WALK.DIST) * 180 / Math.PI;
  dbg.bodyDeg = +ang(bodyPx * 0.69).toFixed(2); dbg.titleDeg = +ang(titlePx * 0.7).toFixed(2);

  const plaque = new THREE.Group(); plaque.name = "xr-walk"; plaque.visible = false; scene.add(plaque);
  let canvas = null, tex = null, face = null;
  function build() {   // on the first entry into VR only: a phone or a computer without a headset never pays for it
    if (canvas) return;
    canvas = document.createElement("canvas"); canvas.width = W; canvas.height = Hh;
    tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const back = new THREE.Mesh(new THREE.BoxGeometry(WALK.W + 0.06, WALK.H + 0.06, 0.04), new THREE.MeshBasicMaterial({ color: "#8a6a3a", fog: false, toneMapped: false }));
    back.position.z = -0.025;
    face = new THREE.Mesh(new THREE.PlaneGeometry(WALK.W, WALK.H), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false }));
    plaque.add(back, face);
  }

  function draw() {
    if (!canvas) return;
    const t = walkText(state, hasLeft ? hasLeft() : true);
    const g = canvas.getContext("2d");
    const warn = state === "ask1" || state === "ask2";
    g.fillStyle = "#140c07"; g.fillRect(0, 0, W, Hh);
    const hot = dbg.hover || lit > 0;
    g.strokeStyle = hot ? "#e0b252" : warn ? "#c0703a" : "#6b5230"; g.lineWidth = hot ? 10 : 6; g.strokeRect(8, 8, W - 16, Hh - 16);
    g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillStyle = "#f3e6c8";
    const pad = 54;
    g.font = `600 ${titlePx}px Cinzel, Georgia, serif`;
    let y = pad + titlePx * 0.8; g.fillText(t.title, pad, y);
    if (g.measureText(t.title).width > W - pad * 2) dbg.overflow = t.title;
    g.font = `400 ${bodyPx}px Georgia, "Times New Roman", serif`;
    for (const line of t.lines) {
      y += bodyPx * 1.32;
      g.fillText(line, pad, y, W - pad * 2);   // never shrunk below the angle rule: an overlong line is caught by the checks
      if (g.measureText(line).width > W - pad * 2) dbg.overflow = line;
    }
    tex.needsUpdate = true;
    dbg.title = t.title; dbg.lines = t.lines; dbg.state = state; dbg.on = state === "on";
    shown = state + t.lines.join("|") + dbg.hover; dbg.lit = lit > 0;
  }

  const head = new THREE.Vector3(), dir = new THREE.Vector3(), ray = new THREE.Raycaster(), o = new THREE.Vector3(), q = new THREE.Quaternion();

  // where the head faces, as a yaw on the floor (the same convention as place(): +z is yaw 0)
  function faceYaw() { camera.getWorldDirection(dir); return Math.atan2(dir.x, dir.z); }

  // seen from the head, does a plaque at (yaw, d) leave a gap beside the posture plaque (if that is up)?
  function apart(yaw, d) {
    if (!anchor.visible) return true;
    const ax = anchor.position.x - head.x, az = anchor.position.z - head.z, da = Math.max(0.3, Math.hypot(ax, az));
    let sep = yaw - Math.atan2(ax, az); sep = Math.abs(Math.atan2(Math.sin(sep), Math.cos(sep)));
    return sep >= Math.atan(WALK.W / 2 / d) + Math.atan(WALK.W / 2 / da) + WALK.APART;
  }

  // around the head, on lines no wall crosses (centre and both edges): beside the posture plaque on entry, or in front
  // of the visitor when summoned
  function place(front) {
    camera.getWorldPosition(head);
    const yawP = front ? faceYaw() : Math.atan2(anchor.position.x - head.x, anchor.position.z - head.z);
    let pick = null;
    for (const d of [WALK.DIST, WALK.NEAR]) {
      for (const a of (front ? WALK.FRONT : WALK.SIDE)) {
        const yaw = yawP + a, x = head.x + Math.sin(yaw) * d, z = head.z + Math.cos(yaw) * d;
        const ex = Math.cos(yaw) * WALK.W / 2, ez = -Math.sin(yaw) * WALK.W / 2;
        if (front && !apart(yaw, d)) continue;   // never in front of or behind the posture plaque: one ray, one plaque
        if (!clear || (clear(head.x, head.z, x, z) && clear(head.x, head.z, x + ex, z + ez) && clear(head.x, head.z, x - ex, z - ez))) { pick = [d, a]; break; }
      }
      if (pick) break;
    }
    if (!pick) pick = [WALK.NEAR, front ? 0 : WALK.SIDE[0]];
    const yaw = yawP + pick[1];
    plaque.position.set(head.x + Math.sin(yaw) * pick[0], anchor.position.y, head.z + Math.cos(yaw) * pick[0]);
    plaque.rotation.set(0, 0, 0, "YXZ");
    plaque.rotation.y = Math.atan2(head.x - plaque.position.x, head.z - plaque.position.z);
    plaque.rotation.x = -WALK.TILT;
    dbg.dist = +pick[0].toFixed(2); dbg.placed = [+plaque.position.x.toFixed(2), +plaque.position.z.toFixed(2)];
  }

  function set(next, keep) {
    const was = state === "on";
    state = next; idle = 0;
    if (keep) { try { if (save) save(keep); } catch (e) { /* storage blocked: the choice lasts this session */ } }
    if ((state === "on") !== was && onChange) onChange(state === "on");
    draw();
  }

  function attach() {
    build();
    let saved = null; try { saved = load ? load() : null; } catch (e) { saved = null; }
    live = true; since = null; idle = 0; lit = 0; lastCall = -1e9; dbg.hover = false; dbg.overflow = null; dbg.placed = null; plaque.visible = false;
    state = saved === "on" ? "on" : "off";   // a first session is the most comfortable one (Comfort §f.25)
    if (onChange) onChange(state === "on");
    draw();
  }
  function detach() {
    if (!live) return;
    live = false; plaque.visible = false; dbg.hover = false;
    if (state === "ask1" || state === "ask2") state = "off";   // an unfinished request is dropped with the session
    if (onChange) onChange(false);
  }

  function hits(ctrl) {
    if (!plaque.visible || !face) return false;
    ctrl.getWorldPosition(o); ctrl.getWorldQuaternion(q);
    ray.set(o, dir.set(0, 0, -1).applyQuaternion(q)); ray.far = 6;
    return ray.intersectObject(face, false).length > 0;
  }
  // the visitor pushed a stick to walk: bring the plaque into view, unless it is already there; light its border
  function summon() {
    if (!live || !plaque.visible) return false;
    const now = performance.now() / 1000;
    if (now - lastCall < WALK.AGAIN) return false;
    lastCall = now; dbg.summons++; dbg.calledAt = now;
    camera.getWorldPosition(head);
    const dx = plaque.position.x - head.x, dz = plaque.position.z - head.z, dist = Math.hypot(dx, dz);
    let off = Math.atan2(dx, dz) - faceYaw(); off = Math.atan2(Math.sin(off), Math.cos(off));
    const inView = dist >= WALK.NEAR - 0.05 && dist <= WALK.DIST + 0.5 && Math.abs(off) <= WALK.VIEW && (!clear || clear(head.x, head.z, plaque.position.x, plaque.position.z));
    if (!inView) { place(true); dbg.moved++; }
    lit = WALK.CALL; draw();
    return true;
  }

  // a short trigger press from a hand: does its ray meet this plaque?
  function tap(ctrl) {
    if (!live || !hits(ctrl)) return false;
    const now = performance.now() / 1000, t = since == null ? null : now - since;
    const r = walkPress(state, t);
    if (r.state !== state || r.save) since = now;
    dbg.presses++;
    if (r.state !== state || r.save) set(r.state, r.save);
    return true;
  }

  function update(dt, ctrls) {
    if (!live) return;
    if (!plaque.visible) {
      if (!anchor.visible) return;   // the posture plaque is placed on the second drawn frame; this one goes beside it
      place(); plaque.visible = true; draw();
    }
    if (plaque.position.y !== anchor.position.y) plaque.position.y = anchor.position.y;   // follows a posture change
    dbg.y = +plaque.position.y.toFixed(3);
    if (state === "ask1" || state === "ask2") { idle += dt; if (idle >= WALK.TIMEOUT) { since = null; set("off"); } }
    if (lit > 0) { lit -= dt; if (lit <= 0) { lit = 0; draw(); } }
    const hov = !!(ctrls && ctrls.some((c) => c && hits(c))), l = hasLeft ? hasLeft() : true;
    if (hov !== dbg.hover || l !== left) { dbg.hover = hov; left = l; draw(); }
    else if (shown === null) draw();
  }

  return { attach, detach, update, tap, summon, hits, plaque, debug: dbg, get state() { return state; }, redraw: draw, image: () => (canvas ? canvas.toDataURL("image/png") : null) };
}
