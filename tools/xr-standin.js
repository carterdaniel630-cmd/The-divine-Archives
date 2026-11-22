// The stand-in headset shared by the VR checks (tools/xr-entry-check.js, tools/vr-frame-budget.js): just enough of
// the WebXR Device API for three.js's WebXRManager (XRWebGLLayer path), injected with page.addInitScript(fakeXR, opts)
// before the museum loads. opts: { unsupported, refuse, noFloor, controller, left }. It draws two eyes from a scripted
// head pose (window.__fx.head) — it proves the museum's side of the contract and lets draw calls be counted through the
// real XR render path; it says nothing about a real headset's frame time. `left` adds a left-hand controller
// (window.__fx.lctrl, window.__fx.lsource) beside the right one.
function fakeXR(opts) {
  const o = opts || {};
  try { delete window.XRWebGLBinding; } catch (e) { /* not there */ }
  Object.defineProperty(window, "XRWebGLBinding", { value: undefined, configurable: true, writable: true });
  const persp = (fov, aspect, n, f) => { const t = 1 / Math.tan(fov / 2); return new Float32Array([t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]); };
  const mat = (x, y, z, yaw, pitch) => { const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch || 0), sp = Math.sin(pitch || 0); return new Float32Array([c, 0, -s, 0, s * sp, cp, c * sp, 0, s * cp, -sp, c * cp, 0, x, y, z, 1]); };
  window.__fx = { frames: 0, sessions: 0, head: { x: 0.4, z: -0.3, yaw: 0.5 }, requests: [],
    // one right-hand controller, in the play space: position, yaw, pitch (down is negative); its thumbstick on axes 2–3
    ctrl: { x: 0.2, y: 1.3, z: -0.3, yaw: 0, pitch: -0.5 },
    source: { handedness: "right", targetRayMode: "tracked-pointer", targetRaySpace: { id: "ray" }, gripSpace: { id: "grip" }, profiles: ["generic-trigger-squeeze-thumbstick"], gamepad: { axes: [0, 0, 0, 0], buttons: [] } },
    // the left-hand controller (opts.left): its own spaces and thumbstick
    lctrl: { x: -0.2, y: 1.2, z: -0.3, yaw: 0, pitch: -0.6 },
    lsource: { handedness: "left", targetRayMode: "tracked-pointer", targetRaySpace: { id: "lray" }, gripSpace: { id: "lgrip" }, profiles: ["generic-trigger-squeeze-thumbstick"], gamepad: { axes: [0, 0, 0, 0], buttons: [] } } };
  window.__fx.press = (type) => { const e = new Event(type); e.inputSource = window.__fx.source; e.frame = window.__fx.lastFrame; window.__fx.session.dispatchEvent(e); };
  class FakeLayer {
    constructor(session, gl, init) { this.gl = gl; this.framebuffer = null; this.framebufferWidth = gl.drawingBufferWidth; this.framebufferHeight = gl.drawingBufferHeight; this.ignoreDepthValues = true; window.__fx.layerScale = init && init.framebufferScaleFactor; }
    getViewport(view) { const w = this.framebufferWidth / 2; return { x: view.eye === "left" ? 0 : w, y: 0, width: w, height: this.framebufferHeight }; }
  }
  window.XRWebGLLayer = FakeLayer;
  // a real headset makes the context XR-compatible; with no device Chromium refuses, so the stand-in says yes
  WebGL2RenderingContext.prototype.makeXRCompatible = function () { return Promise.resolve(); };
  class FakeSession extends EventTarget {
    constructor(features, floor) { super(); this.enabledFeatures = features; this.floor = floor; this.inputSources = []; this.renderState = { baseLayer: null, depthNear: 0.1, depthFar: 1000 }; this.environmentBlendMode = "opaque"; this.visibilityState = "visible"; this.ended = false; }
    updateRenderState(s) { Object.assign(this.renderState, s); }
    async requestReferenceSpace(type) { if (type === "local-floor" && !this.floor) throw new DOMException("no floor", "NotSupportedError"); return { type, getOffsetReferenceSpace() { return this; } }; }
    requestAnimationFrame(cb) {
      return window.requestAnimationFrame((t) => {
        if (this.ended) return;
        const h = window.__fx.head, y = this.floor ? (window.__fx.headY || 1.6) : 0;
        const pose = { transform: { matrix: mat(h.x, y, h.z, h.yaw) }, views: ["left", "right"].map((eye, i) => ({ eye, projectionMatrix: persp(1.6, 0.9, 0.05, 140), transform: { matrix: mat(h.x + (i ? 0.032 : -0.032), y, h.z, h.yaw) } })) };
        window.__fx.frames++;
        const k = window.__fx.ctrl, cpose = { transform: { matrix: mat(k.x, this.floor ? k.y : k.y - 1.6, k.z, k.yaw, k.pitch) }, emulatedPosition: false };
        const l = window.__fx.lctrl, lpose = { transform: { matrix: mat(l.x, this.floor ? l.y : l.y - 1.6, l.z, l.yaw, l.pitch) }, emulatedPosition: false };
        const getPose = (space) => {
          if (space && (space.id === "ray" || space.id === "grip") && o.controller) return cpose;
          if (space && (space.id === "lray" || space.id === "lgrip") && o.left) return lpose;
          return null;
        };
        const frame = { session: this, getViewerPose: () => pose, getPose };
        window.__fx.lastFrame = frame;
        cb(t, frame);
      });
    }
    cancelAnimationFrame(id) { window.cancelAnimationFrame(id); }
    async end() { if (this.ended) return; this.ended = true; setTimeout(() => this.dispatchEvent(new Event("end")), 0); }
  }
  const xr = new EventTarget();
  xr.isSessionSupported = async (mode) => mode === "immersive-vr" && !o.unsupported;
  xr.requestSession = async (mode, init) => {
    window.__fx.requests.push(JSON.stringify(init));
    if (o.refuse) throw new DOMException("refused", "NotSupportedError");
    const req = (init && init.requiredFeatures) || [];
    if (req.includes("local-floor") && o.noFloor) throw new DOMException("no local-floor", "NotSupportedError");
    window.__fx.sessions++;
    const features = o.noFloor ? ["viewer", "local"] : ["viewer", "local", "local-floor"];
    const ses = (window.__fx.session = new FakeSession(features, !o.noFloor));
    if (o.controller) setTimeout(() => { const src = o.left ? [window.__fx.source, window.__fx.lsource] : [window.__fx.source]; ses.inputSources = src; const e = new Event("inputsourceschange"); e.added = src.slice(); e.removed = []; e.session = ses; ses.dispatchEvent(e); }, 300);
    return ses;
  };
  Object.defineProperty(navigator, "xr", { value: xr, configurable: true });
}

module.exports = { fakeXR };
