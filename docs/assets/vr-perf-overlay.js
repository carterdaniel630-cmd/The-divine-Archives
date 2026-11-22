// The Divine Archives — hidden frame-budget overlay for the museum in a VR headset (VR loop: "in-headset overlay").
// Spec: handoff/vr-performance-budget.md §7 (a separate module beside fps-overlay.js, the same query-param convention,
// `?vrfps=1`, stereo-aware, its numbers on window.__vrfps) and §2 (the per-tier ceilings it compares against).
//
// It does nothing unless the museum's address carries ?vrfps=1 (museum.html?vrfps=1): app.js only imports it then, so
// no visitor ever downloads or pays for it. Not linked anywhere on the site.
//
// Why it exists: the 72 fps gate (p95 frame time ≤ 13.9 ms on the Quest 2) can only be certified in a real headset
// (§7, §8 rule 6). tools/vr-frame-budget.js measures draw calls, triangles and lights headless, but its frame times are
// software-rendered and say nothing about a headset. This overlay is what Carter's own walk reads.
//
// What it measures, after every frame the museum draws (app.js calls frame() straight after renderer.render):
//   - frame time: the gap between successive animation-frame timestamps. In the headset these are the XR session's own
//     timestamps (the compositor's clock: the honest number). p50 / p95 / worst over the last second, over the whole
//     run, and per area of the museum. Frames over 20 ms are counted as hitches; those in the first 2 s after entering
//     (the warm-up) are counted apart, and so is any hitch on the frame right after this overlay's own once-a-second
//     scan, so its cost is never hidden inside the museum's figures.
//   - draw calls and triangles: renderer.info.render after the frame, which in the headset is both eyes (three.js draws
//     the two eyes in one renderer.render): the stereo-submitted count. The overlay's own panel costs one call per eye;
//     that is reported as overlayCalls and is included in the raw count.
//   - once a second: lights switched on in the scene graph (as the harness counts them), shader programs (must stop
//     growing after warm-up), textures uploaded (three.js's count) and a ledger of the textures on the objects switched
//     on in the frame (w × h × 4 × 1.33 with mipmaps, §6) — an upper bound for the area, as in the harness.
//   - the mode: flat or immersive, the device tier, foveation and framebuffer scale as xr.js read them back.
// The panel in the headset is a small plate fixed low in the view (a debug instrument, so head-locked on purpose; it is
// never shown without ?vrfps=1). On a flat screen the same lines appear in a corner box instead. Leaving VR and coming
// back starts a new run; window.__vrfpsReset() does the same.
import * as THREE from "three";

export const VRFPS = {
  HITCH: 20,                    // ms: a frame longer than this is a hitch (§7: zero after the entry fade)
  WARMUP: 2,                    // s after a run starts whose hitches are counted apart (shader warm-up, entry fade)
  BIN: 0.25, BINS: 400,         // frame-time histogram: 0.25 ms bins up to 100 ms (the last bin holds everything over)
  MIN_FRAMES: 300,              // frames an area needs before its p95 is judged (about 4 s at 72 fps)
  // §2 ceilings, visible per frame, stereo (texMB is shown for reference only: see judge()). ms: p95 frame time for 72 fps (Quest 2 floor) and the same 72 fps floor
  // for Quest 3 (§7 checklist line 1).
  BUDGET: {
    floor: { label: "QUEST 2", ms: 13.9, calls: 160, tris: 350000, lights: 5, texMB: 16 },
    q3: { label: "QUEST 3", ms: 13.9, calls: 240, tris: 600000, lights: 6, texMB: 24 }
  },
  PANEL: { W: 0.40, H: 0.20, PX: 2400, POS: [-0.16, -0.21, -0.85], TILT: 12 * Math.PI / 180 }
};

export function wanted(search) { return /[?&]vrfps=1(?:&|#|$)/.test(search || ""); }

// --- pure helpers (the checks read these without a headset)
export function binOf(ms) { return Math.max(0, Math.min(VRFPS.BINS - 1, Math.floor(ms / VRFPS.BIN))); }
// the q-quantile (0..1) of a histogram holding n samples, as the upper edge of the bin it falls in (never optimistic)
export function histQ(h, n, q) {
  if (!n) return null;
  const want = Math.max(1, Math.ceil(q * n));
  let seen = 0;
  for (let i = 0; i < h.length; i++) { seen += h[i]; if (seen >= want) return +((i + 1) * VRFPS.BIN).toFixed(2); }
  return +(h.length * VRFPS.BIN).toFixed(2);
}
// exact quantile of a short list (the last second)
export function listQ(a, q) {
  if (!a.length) return null;
  const s = Array.from(a).sort((x, y) => x - y);
  return +s[Math.min(s.length - 1, Math.max(0, Math.ceil(q * s.length) - 1))].toFixed(2);
}
// one area's (or the run's) figures against a tier: { state: "measuring" | "within" | "over", over: [what] }
export function judge(a, tier) {
  const B = VRFPS.BUDGET[tier] || VRFPS.BUDGET.floor, over = [];
  if (a.calls > B.calls) over.push("calls " + a.calls + " > " + B.calls);
  if (a.tris > B.tris) over.push("triangles " + Math.round(a.tris / 1000) + "k > " + Math.round(B.tris / 1000) + "k");
  if (a.lights > B.lights) over.push("lights " + a.lights + " > " + B.lights);
  // texture MB is NOT judged: the in-view ledger counts every texture switched on in the frame, corridors and
  // neighbouring rooms included, so it is an upper bound for the room (as in tools/vr-frame-budget.js); it is shown
  // as information until a per-room ledger exists
  if (a.hitches > 0) over.push(a.hitches + " frame" + (a.hitches === 1 ? "" : "s") + " > " + VRFPS.HITCH + " ms");
  const timed = a.frames >= VRFPS.MIN_FRAMES;
  if (timed && a.p95 > B.ms) over.push("p95 " + a.p95 + " ms > " + B.ms);
  return { state: over.length ? "over" : timed ? "within" : "measuring", over };
}

function area() { return { frames: 0, hist: new Uint32Array(VRFPS.BINS), worst: 0, hitches: 0, calls: 0, tris: 0, lights: 0, texMB: 0 }; }
function summary(a) { return { frames: a.frames, p50: histQ(a.hist, a.frames, 0.5), p95: histQ(a.hist, a.frames, 0.95), worst: +a.worst.toFixed(2), hitches: a.hitches, calls: a.calls, tris: a.tris, lights: a.lights, texMB: a.texMB }; }

// renderer, scene, camera: the museum's own. probe: xr.js's XRProbe (tier, foveation, scale, seated).
// where(): a label for where the visitor stands (app.js's "Wing II · …|Room" key), so figures are kept per area.
export function createVRPerf({ renderer, scene, camera, probe, where }) {
  const P = VRFPS.PANEL, W = Math.round(P.W * P.PX), H = Math.round(P.H * P.PX);
  let run, sec, mode = null, last = null, lastScanAt = -1, afterScan = false;
  const lines = { title: "", body: [], state: "measuring" };

  // the headset plate: built on first use only
  let canvas = null, tex = null, plate = null;
  function buildPlate() {
    if (plate) return;
    canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter;
    plate = new THREE.Mesh(new THREE.PlaneGeometry(P.W, P.H),
      new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false, depthTest: false, depthWrite: false }));
    plate.name = "vr-perf-overlay"; plate.renderOrder = 10000; plate.frustumCulled = false;
    plate.position.set(P.POS[0], P.POS[1], P.POS[2]); plate.rotation.x = P.TILT;
    plate.visible = false; camera.add(plate);
  }
  // the flat-screen box
  let box = null;
  function buildBox() {
    if (box || typeof document === "undefined") return;
    box = document.createElement("div"); box.setAttribute("aria-hidden", "true"); box.id = "mu-vrfps";
    box.style.cssText = "position:fixed;left:6px;bottom:6px;z-index:2147483647;padding:4px 7px;border-radius:4px;max-width:calc(100vw - 12px);" +
      "background:rgba(0,0,0,.72);color:#9f9;font:11px/1.35 ui-monospace,Menlo,monospace;pointer-events:none;white-space:pre-wrap";
    document.body.appendChild(box);
  }

  function reset() {
    run = { start: null, frames: 0, warmHitches: 0, scanHitches: 0, programs0: null, programsGrew: 0, all: area(), areas: new Map(), scanMs: 0 };
    sec = { start: null, ms: [], calls: 0, tris: 0, p50: null, p95: null, worst: null, fps: null };
    last = null; lastScanAt = -1; afterScan = false;
    publish(null);
  }

  // once a second: lights, programs, textures and the in-view texture ledger, in one walk of what is switched on
  function scan() {
    const t0 = performance.now();
    let lights = 0; const seen = new Set(); let bytes = 0;
    scene.traverseVisible((o) => {
      if (o.isLight) { lights++; return; }
      const m = o.material; if (!m) return;
      const ms = Array.isArray(m) ? m : [m];
      for (const mat of ms) for (const k in mat) {
        const v = mat[k];
        if (v && v.isTexture && !seen.has(v.uuid)) {
          seen.add(v.uuid);
          if (v === tex) continue;                       // the overlay's own plate is not the museum's
          const im = v.image || {}, w = im.width || 0, h = im.height || 0;
          bytes += w * h * 4 * (v.generateMipmaps !== false && !v.isDataTexture ? 1.33 : 1);
        }
      }
    });
    const info = renderer.info, programs = info.programs ? info.programs.length : 0;
    run.scanMs = +(performance.now() - t0).toFixed(2);
    return { lights, programs, textures: info.memory.textures, texMB: +(bytes / 1048576).toFixed(1) };
  }

  let snap = { lights: 0, programs: 0, textures: 0, texMB: 0 };
  function frame(now) {
    const xr = renderer.xr.isPresenting, m = xr ? "immersive" : "flat";
    if (m !== mode) { mode = m; reset(); if (xr) buildPlate(); else buildBox(); if (plate) plate.visible = xr; if (box) box.style.display = xr ? "none" : ""; }
    if (run.start === null) { run.start = now; sec.start = now; }
    const r = renderer.info.render, calls = r.calls, tris = r.triangles;
    const key = (where && where()) || "—";
    let A = run.areas.get(key); if (!A) { A = area(); run.areas.set(key, A); }
    if (last !== null) {
      const dt = now - last, b = binOf(dt), warm = (now - run.start) / 1000 < VRFPS.WARMUP;
      run.frames++;
      sec.ms.push(dt);
      for (const a of [run.all, A]) {
        a.frames++; a.hist[b]++; if (dt > a.worst) a.worst = dt;
        if (calls > a.calls) a.calls = calls; if (tris > a.tris) a.tris = tris;
      }
      if (dt > VRFPS.HITCH) {
        if (warm) run.warmHitches++;
        else if (afterScan) run.scanHitches++;
        else { run.all.hitches++; A.hitches++; }
      }
    }
    last = now; afterScan = false;
    if (calls > sec.calls) sec.calls = calls; if (tris > sec.tris) sec.tris = tris;
    if (now - sec.start >= 1000) {
      sec.p50 = listQ(sec.ms, 0.5); sec.p95 = listQ(sec.ms, 0.95);
      sec.worst = sec.ms.length ? +Math.max.apply(null, sec.ms).toFixed(2) : null;
      sec.fps = +(sec.ms.length * 1000 / (now - sec.start)).toFixed(1);
      snap = scan(); afterScan = true;
      for (const a of [run.all, A]) { if (snap.lights > a.lights) a.lights = snap.lights; if (snap.texMB > a.texMB) a.texMB = snap.texMB; }
      if (run.programs0 === null) run.programs0 = snap.programs;
      else if ((now - run.start) / 1000 > VRFPS.WARMUP && snap.programs > run.programs0) { run.programsGrew += snap.programs - run.programs0; run.programs0 = snap.programs; }
      publish({ calls: sec.calls, tris: sec.tris, key, A });
      draw();
      sec.start = now; sec.ms = []; sec.calls = 0; sec.tris = 0;
    }
  }

  function tierNow() { return probe && probe.tier ? probe.tier : "floor"; }
  function publish(cur) {
    const tier = tierNow(), B = VRFPS.BUDGET[tier];
    const areas = {};
    if (run) for (const [k, a] of run.areas) { const s = summary(a); s.verdict = judge(s, tier); areas[k] = s; }
    const all = run ? summary(run.all) : null;
    const out = {
      mode: mode || "flat", tier, budget: B.label,
      foveation: probe ? probe.foveation : null, framebufferScale: probe ? probe.scale : null, seated: probe ? !!probe.seated : false,
      seconds: run && run.start !== null && last !== null ? +((last - run.start) / 1000).toFixed(1) : 0,
      fps: sec ? sec.fps : null,
      frameMs: sec ? { p50: sec.p50, p95: sec.p95, worst: sec.worst } : null,
      drawCalls: cur ? cur.calls : 0, triangles: cur ? cur.tris : 0,
      lights: snap.lights, programs: snap.programs, programsGrew: run ? run.programsGrew : 0,
      textures: snap.textures, textureMemMB: snap.texMB, scanMs: run ? run.scanMs : 0,
      overlayCalls: mode === "immersive" ? 2 : 0,
      run: all ? Object.assign(all, { warmupHitches: run.warmHitches, hitchesAfterScan: run.scanHitches, verdict: judge(all, tier) }) : null,
      area: cur ? cur.key : null, areas
    };
    if (typeof window !== "undefined") window.__vrfps = out;
    if (cur) {
      const here = areas[cur.key], v = here.verdict, place = cur.key.split("|").pop();
      lines.state = v.state;
      lines.title = B.label + " BUDGET · " + place + " · " + (v.state === "over" ? "OVER" : v.state === "within" ? "WITHIN" : "MEASURING");
      const k = (n) => Math.round(n / 1000) + "k";
      lines.body = [
        "last 1 s: p95 " + (sec.p95 == null ? "–" : sec.p95) + " ms  worst " + (sec.worst == null ? "–" : sec.worst) + " ms  (72 fps: " + B.ms + ")",
        "calls " + cur.calls + "/" + B.calls + "   tris " + k(cur.tris) + "/" + k(B.tris) + "   lights " + snap.lights + "/" + B.lights,
        "here: p95 " + (here.frames >= VRFPS.MIN_FRAMES ? here.p95 : "–") + " ms  hitches " + here.hitches + "  max calls " + here.calls + "  max tris " + k(here.tris),
        "tex in view ≤ " + snap.texMB + " MB  programs " + snap.programs + (out.programsGrew ? " (+" + out.programsGrew + " after warm-up)" : "") + "  run " + Math.round(out.seconds) + " s",
        v.over.length ? "over: " + v.over.slice(0, 2).join("; ") : (mode === "immersive" ? "leave VR and come back to start a new run" : "flat screen: frames are drawn only on change; frame times are for the headset")
      ];
    }
  }

  function draw() {
    if (box && mode === "flat") { box.textContent = lines.title + "\n" + lines.body.join("\n"); return; }
    if (!canvas) return;
    const g = canvas.getContext("2d");
    g.fillStyle = "rgba(8,10,8,1)"; g.fillRect(0, 0, W, H);
    const col = lines.state === "over" ? "#f0a040" : lines.state === "within" ? "#8fe08f" : "#d8d8c0";
    g.strokeStyle = col; g.lineWidth = 6; g.strokeRect(4, 4, W - 8, H - 8);
    g.textAlign = "left"; g.textBaseline = "top";
    const font = (size, weight) => { g.font = (weight || "") + size + "px ui-monospace, Menlo, Consolas, monospace"; };
    const sizeFor = (list, px, weight) => {          // one size for a set of lines, shrunk until the widest fits
      let size = px; font(size, weight);
      while (size > 16 && list.some((t) => g.measureText(t).width > W - 44)) { size -= 2; font(size, weight); }
      return size;
    };
    g.fillStyle = col; font(sizeFor([lines.title], 40, "600 "), "600 "); g.fillText(lines.title, 22, 24);
    const bs = sizeFor(lines.body, 32, "");
    g.fillStyle = "#e8e8dc"; font(bs, ""); lines.body.forEach((t, i) => g.fillText(t, 22, 100 + i * 70));
    tex.needsUpdate = true;
  }

  reset();
  if (typeof window !== "undefined") window.__vrfpsReset = reset;
  return {
    frame, reset,
    get plate() { return plate; },
    image: () => canvas ? canvas.toDataURL("image/png") : null,
    text: () => [lines.title].concat(lines.body)
  };
}
