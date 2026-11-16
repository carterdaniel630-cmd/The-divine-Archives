// Moving and turning in the VR headset: teleport, snap turn, the comfort vignette (VR loop piece G2).
// Numbers are the Comfort Warden's (handoff/vr-comfort-brief.md §a–§b) as settled in handoff/vr-interaction-spec.md
// §2 and its [WARDEN] table: teleport arc max 8 m, hold 200 ms to aim, a 150–250 ms dip-to-dark on arrival, no
// vignette on teleport; snap turn 30°, cooldown 250 ms, with the vignette (40–60 %, onset ≤ 100 ms, clearing over
// 300–400 ms). Smooth movement and smooth turn are opt-in only and need the settings stele, a later piece: they are
// not offered here, so a first session is the most comfortable one (Comfort §f.25).
//
// Everything moves the RIG (xr.js), never the camera: the headset owns the camera's pose inside the rig.
// One hand is enough (Comfort §d.16): either controller's trigger aims and either stick turns.
import * as THREE from "three";

export const MOVE = {
  HOLD: 0.2,                 // s of trigger hold before the arc shows (a shorter press is a "select", for a later piece)
  RANGE: 8,                  // m, every posture
  SPEED: 7,                  // m/s launch speed of the aiming arc (sets how far a given hand angle reaches)
  FADE_OUT: 0.09, FADE_IN: 0.11, FADE_MAX: 0.9,   // 200 ms dip, to the museum's own dark, never a pure black frame
  SNAP: Math.PI / 6,         // 30°
  COOLDOWN: 0.25,            // s between snaps
  STICK_ON: 0.7, STICK_OFF: 0.3,
  VIG: 0.5, VIG_ON: 0.08, VIG_OFF: 0.35            // strength 50 %, onset 80 ms, clears over 350 ms
};
const GOLD = new THREE.Color("#e0b252"), CRIMSON = new THREE.Color("#b3342b");

function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// renderer, scene, camera: the museum's own; rig: xr.js's rig; floorY: museum floor height;
// canStand(x, z, fromX, fromZ): may the visitor stand at (x, z), reached from (fromX, fromZ) without passing a wall?
// onMoved(): called after a teleport or a turn. onTap(ctrl): a short trigger press (under HOLD), with that hand's
// target-ray space, for whatever the hand points at (the posture plaque, xr-height.js).
export function createXRMove({ renderer, camera, rig, floorY = 0, canStand, onMoved, onTap }) {
  const dbg = { fadePeak: 0, vignettePeak: 0, aiming: false, valid: false, marker: null, fade: 0, vignette: 0, snaps: 0, teleports: 0, cancelled: 0, taps: 0, controllers: 0 };

  // ---- controllers: target-ray and grip spaces live in the rig, so they move with it
  const hands = [0, 1].map((i) => {
    const ctrl = renderer.xr.getController(i), grip = renderer.xr.getControllerGrip(i);
    rig.add(ctrl); rig.add(grip);
    const h = { i, ctrl, grip, source: null, held: null, armed: true };
    ctrl.addEventListener("connected", (e) => { h.source = e.data; dbg.controllers = hands.filter((x) => x.source).length; });
    ctrl.addEventListener("disconnected", () => { h.source = null; if (aim === h) stopAim(false); dbg.controllers = hands.filter((x) => x.source).length; });
    ctrl.addEventListener("selectstart", () => { if (!aim && !fade) h.held = 0; });
    ctrl.addEventListener("selectend", () => {
      if (aim === h) stopAim(true);
      else if (h.held != null) { dbg.taps++; if (onTap) onTap(h.ctrl); }
      h.held = null;
    });
    return h;
  });
  // a plain bronze rod in each hand, so the visitor sees where their hands are (bespoke wands come with the input piece)
  const rodMat = new THREE.MeshStandardMaterial({ color: "#8a6a3a", metalness: 0.6, roughness: 0.45 });
  const rodGeo = new THREE.CylinderGeometry(0.011, 0.016, 0.13, 10); rodGeo.rotateX(-Math.PI / 2);
  hands.forEach((h) => h.grip.add(new THREE.Mesh(rodGeo, rodMat)));

  // ---- the arc (quadratic Bézier, interaction spec §2) and the landing marker: a brass ring with a facing chevron
  const N = 28, arcGeo = new THREE.BufferGeometry();
  arcGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const arcMat = new THREE.LineBasicMaterial({ color: GOLD.clone(), fog: false, transparent: true, opacity: 0.95 });
  const arc = new THREE.Line(arcGeo, arcMat); arc.frustumCulled = false; arc.visible = false; arc.renderOrder = 5;
  rig.parent.add(arc);
  const marker = new THREE.Group(); marker.visible = false; rig.parent.add(marker);
  const ringMat = new THREE.MeshBasicMaterial({ color: GOLD.clone(), fog: false, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.27, 40), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.012;
  const chev = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0, 0.42), new THREE.Vector2(-0.09, 0.3), new THREE.Vector2(0.09, 0.3)])), ringMat);
  chev.rotation.x = -Math.PI / 2; chev.position.y = 0.013;
  const chevHolder = new THREE.Group(); chevHolder.add(chev);
  // not a way through: a crimson ring, a carved ✕ and the words NO WAY (colour is never the only signal, Comfort §d.17)
  const noTex = canvasTexture(512, 192, (g, w, h) => {
    g.fillStyle = "rgba(20,10,6,0.82)"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#e05a4c"; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = "#ffd7cf"; g.font = "600 104px Cinzel, Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("✕ NO WAY", w / 2, h / 2 + 6);
  });
  const no = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.28), new THREE.MeshBasicMaterial({ map: noTex, transparent: true, fog: false, depthTest: false }));
  no.renderOrder = 6; no.position.y = 0.75; no.visible = false;
  marker.add(ring, chevHolder, no);

  // ---- comfort overlays (head-locked by necessity: they ARE the view's edge; no text is ever head-locked)
  const vigTex = canvasTexture(256, 256, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, w * 0.18, w / 2, w / 2, w * 0.5);
    r.addColorStop(0, "rgba(11,7,4,0)"); r.addColorStop(0.55, "rgba(11,7,4,0.55)"); r.addColorStop(1, "rgba(11,7,4,1)");
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  });
  const vig = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: vigTex, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
  vig.position.z = -0.5; vig.renderOrder = 998; vig.visible = false; vig.frustumCulled = false;
  const veil = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 10), new THREE.MeshBasicMaterial({ color: "#0b0704", side: THREE.BackSide, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
  veil.renderOrder = 999; veil.visible = false; veil.frustumCulled = false;

  let aim = null, target = new THREE.Vector3(), valid = false, fade = null, cool = 0, vigT = 0, vigOn = false;
  const head = new THREE.Vector3(), p0 = new THREE.Vector3(), dir = new THREE.Vector3(), ctl = new THREE.Vector3(), tmp = new THREE.Vector3(), bez = new THREE.QuadraticBezierCurve3();

  function attach() { camera.add(vig); camera.add(veil); }
  function detach() {
    camera.remove(vig); camera.remove(veil);
    aim = null; fade = null; arc.visible = false; marker.visible = false; vig.visible = false; veil.visible = false;
    vigOn = false; vigT = 0; dbg.aiming = false; dbg.fade = 0; dbg.vignette = 0;
    hands.forEach((h) => { h.held = null; h.armed = true; });
  }

  function stopAim(release) {
    const h = aim; aim = null; arc.visible = false; marker.visible = false; dbg.aiming = false;
    if (!h) return;
    if (release && valid) fade = { t: 0, moved: false, to: target.clone() };
    else if (release) dbg.cancelled++;   // an invalid release cancels silently
  }

  function headPos() { camera.getWorldPosition(head); return head; }
  function headYaw() { camera.getWorldDirection(tmp); return Math.atan2(-tmp.x, -tmp.z); }

  function updateAim() {
    const h = aim;
    h.ctrl.getWorldPosition(p0);
    h.ctrl.getWorldDirection(dir).negate();      // the target ray points down the controller's -Z
    // where a stone thrown along the ray would land on the floor, then held to RANGE
    const vy = dir.y * MOVE.SPEED, y0 = p0.y - floorY, tt = (vy + Math.sqrt(Math.max(0, vy * vy + 2 * 9.8 * y0))) / 9.8;
    target.set(p0.x + dir.x * MOVE.SPEED * tt, floorY, p0.z + dir.z * MOVE.SPEED * tt);
    const hp = headPos(), dx = target.x - hp.x, dz = target.z - hp.z, d = Math.hypot(dx, dz);
    if (d > MOVE.RANGE) target.set(hp.x + dx / d * MOVE.RANGE, floorY, hp.z + dz / d * MOVE.RANGE);
    valid = !!canStand(target.x, target.z, hp.x, hp.z);
    ctl.copy(p0).addScaledVector(dir, Math.max(0.3, p0.distanceTo(target) * 0.5));
    bez.v0.copy(p0); bez.v1.copy(ctl); bez.v2.copy(target);
    const a = arcGeo.attributes.position;
    for (let i = 0; i < N; i++) { bez.getPoint(i / (N - 1), tmp); a.setXYZ(i, tmp.x, tmp.y, tmp.z); }
    a.needsUpdate = true; arcGeo.computeBoundingSphere();
    const col = valid ? GOLD : CRIMSON;
    arcMat.color.copy(col); ringMat.color.copy(col);
    marker.position.copy(target); marker.visible = true; arc.visible = true;
    chevHolder.visible = valid; no.visible = !valid;
    chevHolder.rotation.y = headYaw();            // the chevron points the way the visitor will face on arrival
    if (!valid) { no.lookAt(hp.x, floorY + 0.75, hp.z); const s = Math.max(1, d / 3); no.scale.setScalar(s); no.position.y = 0.45 + 0.3 * s; }
    dbg.aiming = true; dbg.valid = valid; dbg.marker = [+target.x.toFixed(3), +target.z.toFixed(3)];
  }

  function snap(sign) {
    const hp = headPos().clone(), th = -sign * MOVE.SNAP;   // stick right turns right
    rig.position.sub(hp).applyAxisAngle(THREE.Object3D.DEFAULT_UP, th).add(hp);
    rig.rotation.y += th; rig.updateMatrixWorld(true);
    cool = MOVE.COOLDOWN; vigOn = true; dbg.snaps++;
    if (onMoved) onMoved();
  }

  function stickX(src) {
    const gp = src && src.gamepad; if (!gp || !gp.axes) return 0;
    // xr-standard puts the thumbstick on axes 2–3; some runtimes report only 0–1 (do not hardcode, arch §6)
    return gp.axes.length >= 4 ? gp.axes[2] || 0 : gp.axes[0] || 0;
  }

  function update(dt) {
    cool = Math.max(0, cool - dt);
    // the dip-to-dark of a teleport
    if (fade) {
      fade.t += dt;
      if (!fade.moved && fade.t >= MOVE.FADE_OUT && fade.cb) { fade.moved = true; fade.cb(); }
      else if (!fade.moved && fade.t >= MOVE.FADE_OUT) {
        const hp = headPos();
        rig.position.x += fade.to.x - hp.x; rig.position.z += fade.to.z - hp.z; rig.updateMatrixWorld(true);
        fade.moved = true; dbg.teleports++;
        if (onMoved) onMoved();
      }
      const o = fade.t < MOVE.FADE_OUT ? fade.t / MOVE.FADE_OUT : Math.max(0, 1 - (fade.t - MOVE.FADE_OUT) / MOVE.FADE_IN);
      veil.material.opacity = o * MOVE.FADE_MAX; veil.visible = o > 0.001; dbg.fade = +veil.material.opacity.toFixed(3); dbg.fadePeak = Math.max(dbg.fadePeak, dbg.fade);
      if (fade.t >= MOVE.FADE_OUT + MOVE.FADE_IN) { fade = null; veil.visible = false; dbg.fade = 0; }
    }
    for (const h of hands) {
      if (!h.source) continue;
      if (h.held != null && !aim && !fade) { h.held += dt; if (h.held >= MOVE.HOLD) aim = h; }
      const x = stickX(h.source);
      if (!h.armed && Math.abs(x) < MOVE.STICK_OFF) h.armed = true;
      if (h.armed && Math.abs(x) > MOVE.STICK_ON && cool === 0 && !fade) { h.armed = false; snap(Math.sign(x)); }
    }
    if (aim) updateAim();
    // vignette: on with each snap (teleport has none, Comfort §b.8), then eases off
    if (vigOn) { vigT = Math.min(MOVE.VIG, vigT + dt * MOVE.VIG / MOVE.VIG_ON); if (vigT >= MOVE.VIG) vigOn = false; }
    else vigT = Math.max(0, vigT - dt * MOVE.VIG / MOVE.VIG_OFF);
    vig.material.opacity = vigT; vig.visible = vigT > 0.001; dbg.vignette = +vigT.toFixed(3); dbg.vignettePeak = Math.max(dbg.vignettePeak, dbg.vignette);
  }

  // the same dip-to-dark, with cb run at its darkest moment instead of a teleport (a posture change moves the whole
  // world up or down at once, so the visitor never sees it slide); refused while aiming or already dipping
  function dip(cb) { if (aim || fade) { return false; } fade = { t: 0, moved: false, cb }; return true; }

  return { update, attach, detach, dip, debug: dbg, get busy() { return !!(aim || fade); }, get controllers() { return hands.filter((h) => h.source).map((h) => h.ctrl); } };
}
