/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: the planetarium in the Rotunda dome

   The dome shows the real sky over a site the archive writes about: 5,044 stars
   to magnitude 6 (XHIP), the Milky Way (Vieira's outlines), the 88 IAU
   constellations with their stick figures, names and official boundaries, and
   the Sun, Moon and planets where they are on the date shown (ephem.js). The sky
   turns with the site's sidereal time.

   Tapping the dome finds the constellation whose IAU boundary contains that
   point (or a planet, the Moon, the horizon). Its card shows what the archive's
   chapters say about it (museum/sky-lore.json, verified against chapter text by
   tools/verify-sky.js), and says so plainly when they say nothing.
   ========================================================================== */
import * as THREE from "three";
import { julian, gmst, planetsAt, moonPhase, skyMatrix, horizontal } from "./ephem.js";

const D2R = Math.PI / 180;
const PLANET = {
  mer: { name: "Mercury", col: "#d8cfc0", size: 0.34 }, ven: { name: "Venus", col: "#fff6dc", size: 0.62 },
  mar: { name: "Mars", col: "#ff9a6a", size: 0.42 }, jup: { name: "Jupiter", col: "#fbe8c4", size: 0.54 },
  sat: { name: "Saturn", col: "#f0dca4", size: 0.44 }
};
const ZODIAC = ["Ari", "Tau", "Gem", "Cnc", "Leo", "Vir", "Lib", "Sco", "Sgr", "Cap", "Aqr", "Psc"];
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const eqVec = (ra, dec) => { const a = ra * D2R, d = dec * D2R; return new THREE.Vector3(Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)); };
const toRaDec = (v) => ({ ra: ((Math.atan2(v.y, v.x) / D2R) + 360) % 360, dec: Math.asin(Math.max(-1, Math.min(1, v.z))) / D2R });
function sepDeg(a, b) { return Math.acos(Math.max(-1, Math.min(1, Math.sin(a.dec * D2R) * Math.sin(b.dec * D2R) + Math.cos(a.dec * D2R) * Math.cos(b.dec * D2R) * Math.cos((a.ra - b.ra) * D2R)))) / D2R; }
// colour of a star from its B−V index (a smooth fit through the main-sequence colours)
function bvColor(bv) {
  const t = Math.max(-0.4, Math.min(2, bv));
  const r = t < 0.4 ? 0.62 + 0.38 * (t + 0.4) / 0.8 : 1, g = t < 0 ? 0.72 + 0.28 * (t + 0.4) / 0.4 : 1 - 0.36 * Math.min(1, t / 1.8), b = t < 0.4 ? 1 : Math.max(0.35, 1 - 0.65 * (t - 0.4) / 1.4);
  return [r, g, b];
}
// point-in-polygon on the sphere: project the ring onto a plane centred on the test point
// (azimuthal equidistant), with long edges along a parallel densified so they keep their curve,
// then count crossings of a ray from the centre. Exact for any ring that does not enclose the
// point's antipode (every IAU boundary except the two polar ones, handled by the caller).

function inRing(ring, ra, dec) {
  const d0 = dec * D2R, s0 = Math.sin(d0), c0 = Math.cos(d0), P = [];
  let near = Math.PI;
  const proj = (a, d) => {
    const A = (a - ra) * D2R, D = d * D2R, cosc = Math.max(-1, Math.min(1, s0 * Math.sin(D) + c0 * Math.cos(D) * Math.cos(A))), c = Math.acos(cosc);
    const th = Math.atan2(Math.cos(D) * Math.sin(A), c0 * Math.sin(D) - s0 * Math.cos(D) * Math.cos(A));
    if (c < near) near = c;
    P.push(c * Math.sin(th), c * Math.cos(th));
  };
  const n = ring.length / 2;
  for (let i = 0; i < n; i++) {
    const a0 = ring[i * 2] / 100, e0 = ring[i * 2 + 1] / 100, a1 = ring[((i + 1) % n) * 2] / 100, e1 = ring[((i + 1) % n) * 2 + 1] / 100;
    const dra = ((a1 - a0 + 540) % 360) - 180, steps = Math.max(1, Math.ceil(Math.abs(dra) / 3));
    for (let k = 0; k < steps; k++) proj(a0 + dra * k / steps, e0 + (e1 - e0) * k / steps);
  }
  // a ring around the point's antipode also loops the centre of the projection; a real container
  // always has a corner well within 60° of the point (the IAU areas are small), an antipodal one never does
  if (near > Math.PI / 3) return false;
  let inside = false;
  for (let i = 0, m = P.length / 2, j = m - 1; i < m; j = i++) {
    const xi = P[i * 2], yi = P[i * 2 + 1], xj = P[j * 2], yj = P[j * 2 + 1];
    if ((yi > 0) !== (yj > 0) && 0 < (xj - xi) * (0 - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function createSky(opt) {
  const C = opt.center, R = opt.radius, BASE = C.y;
  const root = new THREE.Group(); root.position.copy(C); root.name = "planetarium";
  const cel = new THREE.Group(); cel.matrixAutoUpdate = false; root.add(cel);
  const clip = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -BASE - 0.02)];
  const M = new THREE.Matrix4(), M3 = new THREE.Matrix3(), toEq = new THREE.Matrix3();
  const st = { data: null, site: null, date: new Date(), mode: "tonight", run: false, lines: true, names: true, lst: 0, bodies: null, hover: null, sel: null, twinkle: true, day: false };

  // ---- the dome: night gradient, horizon glow and the Milky Way, sampled by celestial position
  const mwCanvas = document.createElement("canvas"); mwCanvas.width = 1024; mwCanvas.height = 512;
  const mwTex = new THREE.CanvasTexture(mwCanvas); mwTex.wrapS = THREE.RepeatWrapping;
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uToEq: { value: toEq }, uMW: { value: mwTex }, uCenter: { value: C }, uDay: { value: 0 }, uMWOn: { value: 1 } },
    vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: `
      uniform mat3 uToEq; uniform sampler2D uMW; uniform vec3 uCenter; uniform float uDay, uMWOn; varying vec3 vW;
      void main(){
        vec3 d = normalize(vW - uCenter); float alt = max(d.y, 0.0);
        vec3 zen = vec3(0.006, 0.010, 0.030), hor = vec3(0.030, 0.045, 0.085);
        vec3 col = mix(hor, zen, smoothstep(0.0, 0.55, alt));
        col += vec3(0.10, 0.07, 0.04) * pow(1.0 - alt, 10.0);                 // a faint warm glow along the horizon
        vec3 e = uToEq * d; float ra = atan(e.y, e.x); float dec = asin(clamp(e.z, -1.0, 1.0));
        vec2 uv = vec2(fract(ra / 6.2831853), dec / 3.1415927 + 0.5);
        float mw = texture2D(uMW, uv).r * uMWOn;
        col += vec3(0.20, 0.21, 0.26) * mw * smoothstep(0.0, 0.12, alt);
        col = mix(col, vec3(0.30, 0.46, 0.70) * (0.6 + 0.4 * alt), uDay);
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  dome.renderOrder = -2; root.add(dome);

  // ---- stars
  const starMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 1 }, uTime: { value: 0 }, uTw: { value: 1 }, uBase: { value: BASE }, uDay: { value: 0 } },
    vertexShader: `
      uniform float uScale, uTime, uTw, uBase, uDay; attribute float aMag; attribute vec3 aCol; attribute float aPh; varying vec3 vCol; varying float vA;
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.0); vec4 mv = viewMatrix * w;
        float b = pow(10.0, -0.4 * (aMag - 1.0));
        gl_PointSize = clamp(2.0 + 3.6 * sqrt(b), 2.0, 13.0) * uScale;
        float h = smoothstep(uBase + 0.02, uBase + 0.6, w.y);
        float tw = 1.0 + uTw * 0.28 * sin(uTime * (2.0 + aPh * 3.0) + aPh * 40.0) * (1.0 - min(1.0, b));
        vA = clamp(0.3 + 1.1 * sqrt(b), 0.24, 1.5) * h * tw * (1.0 - 0.85 * uDay);
        vCol = aCol; gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: "varying vec3 vCol; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.0, d); a = a * a * (0.6 + 0.4 * a); if (a * vA < 0.004) discard; gl_FragColor = vec4(vCol * a * vA, 1.0); }"
  });
  let starPts = null;

  // ---- constellation figures (all), the highlighted figure and its IAU boundary
  const lineMat = new THREE.LineBasicMaterial({ color: "#6f86b8", transparent: true, opacity: 0.34, depthWrite: false, fog: false, clippingPlanes: clip });
  const hiMat = new THREE.LineBasicMaterial({ color: "#f3cf7a", transparent: true, opacity: 0.95, depthWrite: false, fog: false, clippingPlanes: clip });
  const bdMat = new THREE.LineDashedMaterial({ color: "#d9a950", transparent: true, opacity: 0.6, dashSize: 0.18, gapSize: 0.12, depthWrite: false, fog: false, clippingPlanes: clip });
  let figLines = null, hiLines = null, hiBound = null, labels = null, labelIdx = {};
  const RL = R - 0.06;

  function segs(list, r) {
    const pos = [];
    list.forEach((l) => { for (let i = 0; i + 3 < l.length; i += 2) { const a = eqVec(l[i] / 100, l[i + 1] / 100).multiplyScalar(r), b = eqVec(l[i + 2] / 100, l[i + 3] / 100).multiplyScalar(r); pos.push(a.x, a.y, a.z, b.x, b.y, b.z); } });
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); return g;
  }
  // boundaries: densify the long edges along lines of constant declination so they follow the sphere
  function boundSegs(rings, r) {
    const pos = [];
    rings.forEach((ring) => {
      const n = ring.length / 2;
      for (let i = 0; i < n; i++) {
        const a = [ring[i * 2] / 100, ring[i * 2 + 1] / 100], b = [ring[((i + 1) % n) * 2] / 100, ring[((i + 1) % n) * 2 + 1] / 100];
        let dra = ((b[0] - a[0] + 540) % 360) - 180; const steps = Math.max(1, Math.ceil(Math.abs(dra) / 2));
        for (let k = 0; k < steps; k++) {
          const p = eqVec(a[0] + dra * k / steps, a[1] + (b[1] - a[1]) * k / steps).multiplyScalar(r), q = eqVec(a[0] + dra * (k + 1) / steps, a[1] + (b[1] - a[1]) * (k + 1) / steps).multiplyScalar(r);
          pos.push(p.x, p.y, p.z, q.x, q.y, q.z);
        }
      }
    });
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); return g;
  }

  // ---- names: one atlas texture, one mesh of quads lying on the dome, reading from inside
  function buildLabels(cons) {
    const cv = document.createElement("canvas"); cv.width = 2048; cv.height = 1024;
    const g = cv.getContext("2d"), H = 46; g.font = "600 30px Cinzel, Georgia, serif"; g.textBaseline = "middle"; g.fillStyle = "#fff";
    const cells = []; let x = 0, y = 0;
    const items = cons.map((c) => ({ key: c.id, text: c.name.toUpperCase().split("").join(" "), ra: c.at[0] / 100, dec: c.at[1] / 100, h: 0.34 }))
      .concat(["N", "E", "S", "W"].map((t) => ({ key: "cp" + t, text: t, cardinal: true, h: 0.55 })));
    items.forEach((it) => {
      const w = Math.ceil(g.measureText(it.text).width) + 12;
      if (x + w > cv.width) { x = 0; y += H; }
      g.fillText(it.text, x + 6, y + H / 2); cells.push({ it, x, y, w }); x += w;
    });
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    // constellation names: each quad sits at its label point on the celestial sphere and is turned
    // to face the viewer, upright on the screen, in the vertex shader (so it is readable anywhere)
    const pos = [], uv = [], col = [], idx = [], corner = [];
    cells.forEach((c, i) => {
      const it = c.it, ww = it.h * c.w / H, hh = it.h;
      const p = it.cardinal ? new THREE.Vector3() : eqVec(it.ra, it.dec).multiplyScalar(RL - 0.05);
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { pos.push(p.x, p.y, p.z); corner.push(it.cardinal ? 0 : sx * ww / 2, it.cardinal ? 0 : sy * hh / 2); col.push(0.62, 0.68, 0.86); });
      uv.push(c.x / cv.width, 1 - (c.y + H) / cv.height, (c.x + c.w) / cv.width, 1 - (c.y + H) / cv.height, (c.x + c.w) / cv.width, 1 - c.y / cv.height, c.x / cv.width, 1 - c.y / cv.height);
      const b = i * 4; idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
      labelIdx[it.key] = i;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); geo.setAttribute("aTint", new THREE.Float32BufferAttribute(col, 3)); geo.setAttribute("aCorner", new THREE.Float32BufferAttribute(corner, 2)); geo.setIndex(idx);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { map: { value: tex }, uBase: { value: BASE } },
      vertexShader: `
        uniform float uBase; attribute vec2 aCorner; attribute vec3 aTint; varying vec2 vUv; varying vec3 vT; varying float vH;
        void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vec4 mv = viewMatrix * w; mv.xy += aCorner;
          vH = smoothstep(uBase + 0.1, uBase + 0.5, w.y); vUv = uv; vT = aTint; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: "uniform sampler2D map; varying vec2 vUv; varying vec3 vT; varying float vH; void main(){ vec4 t = texture2D(map, vUv); float a = t.a * vH * 0.9; if (a < 0.01) discard; gl_FragColor = vec4(vT, a); }"
    });
    const mesh = new THREE.Mesh(geo, mat); mesh.renderOrder = 2; mesh.frustumCulled = false;
    // the cardinal points live in the (fixed) horizon frame, so they get their own mesh
    const cg = new THREE.BufferGeometry(), cpos = [], cuv = [], ccol = [], cidx = [];
    [["N", 0], ["E", 90], ["S", 180], ["W", 270]].forEach(([t, az], k) => {
      const c = cells[labelIdx["cp" + t]], hh = 0.55, ww = hh * c.w / H, alt = 2.2 * D2R, A = az * D2R;
      const p = new THREE.Vector3(Math.sin(A) * Math.cos(alt), Math.sin(alt), -Math.cos(A) * Math.cos(alt)).multiplyScalar(R - 0.12);
      const right = new THREE.Vector3(Math.cos(A), 0, Math.sin(A)).multiplyScalar(ww / 2), up = new THREE.Vector3(0, hh / 2, 0);
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { const v = p.clone().addScaledVector(right, sx).addScaledVector(up, sy); cpos.push(v.x, v.y, v.z); ccol.push(0.95, 0.8, 0.5); });
      cuv.push(c.x / cv.width, 1 - (c.y + H) / cv.height, (c.x + c.w) / cv.width, 1 - (c.y + H) / cv.height, (c.x + c.w) / cv.width, 1 - c.y / cv.height, c.x / cv.width, 1 - c.y / cv.height);
      const b = k * 4; cidx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    });
    cg.setAttribute("position", new THREE.Float32BufferAttribute(cpos, 3)); cg.setAttribute("uv", new THREE.Float32BufferAttribute(cuv, 2)); cg.setAttribute("color", new THREE.Float32BufferAttribute(ccol, 3)); cg.setIndex(cidx);
    const cmesh = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ map: tex, transparent: true, vertexColors: true, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    root.add(cmesh);
    return mesh;
  }
  function tintLabel(id, rgb) {
    if (!labels || labelIdx[id] == null) return;
    const a = labels.geometry.attributes.aTint, b = labelIdx[id] * 4;
    for (let k = 0; k < 4; k++) a.setXYZ(b + k, rgb[0], rgb[1], rgb[2]);
    a.needsUpdate = true;
  }

  // ---- the Milky Way texture: each brightness level adds light, its holes (dark lanes) take it away
  function paintMilkyWay(mw) {
    const W = mwCanvas.width, H = mwCanvas.height, g = mwCanvas.getContext("2d");
    g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
    const tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H; const t = tmp.getContext("2d");
    const trace = (ctx, ring, off) => {
      let prev = null; ctx.beginPath();
      for (let i = 0; i < ring.length; i += 2) {
        let ra = ring[i] / 100; if (prev != null) { while (ra - prev > 180) ra -= 360; while (prev - ra > 180) ra += 360; } prev = ra;
        const x = (ra / 360) * W + off, y = (0.5 - ring[i + 1] / 100 / 180) * H;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.closePath();
    };
    for (let lvl = 1; lvl <= 5; lvl++) {
      t.clearRect(0, 0, W, H);
      for (const pass of [0, 1]) {
        t.globalCompositeOperation = pass ? "destination-out" : "source-over"; t.fillStyle = "#fff";
        mw.filter((m) => m[0] === lvl && m[1] === pass).forEach((m) => { for (const off of [-W, 0, W]) { trace(t, m[2], off); t.fill(); } });
      }
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.24; g.filter = "blur(3px)"; g.drawImage(tmp, 0, 0); g.restore();
    }
    mwTex.needsUpdate = true;
  }

  // ---- the Sun, the Moon and the planets
  const bodies = {};
  function glowTex(col) {
    const cv = document.createElement("canvas"); cv.width = cv.height = 64; const g = cv.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "#fff"); gr.addColorStop(0.18, col); gr.addColorStop(0.45, "rgba(255,240,210,.18)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const moonCv = document.createElement("canvas"); moonCv.width = moonCv.height = 128;
  const moonTex = new THREE.CanvasTexture(moonCv); moonTex.colorSpace = THREE.SRGBColorSpace;
  function paintMoon(ph, brightLimbAngle) {
    const g = moonCv.getContext("2d"), r = 44; g.clearRect(0, 0, 128, 128);
    const gl = g.createRadialGradient(64, 64, r * 0.9, 64, 64, 64); gl.addColorStop(0, "rgba(255,248,220,.25)"); gl.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gl; g.fillRect(0, 0, 128, 128);
    g.save(); g.translate(64, 64); g.rotate(brightLimbAngle);
    g.fillStyle = "#1c2230"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();                 // the unlit disc, faintly (earthshine)
    // the lit part: the limb semicircle on the sun's side (+x) and the terminator ellipse
    const k = 1 - 2 * ph.lit;                                                                  // +1 new … −1 full
    g.fillStyle = "#f1ead2"; g.beginPath(); g.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false); g.ellipse(0, 0, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0); g.fill();
    g.fillStyle = "rgba(120,110,95,.28)"; [[-12, -10, 9], [10, 14, 7], [4, -20, 5], [-16, 16, 6]].forEach(([x, y, s]) => { g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); });
    g.restore(); moonTex.needsUpdate = true;
  }
  function makeBodies() {
    for (const id of Object.keys(PLANET)) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(PLANET[id].col), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      s.scale.setScalar(PLANET[id].size); s.renderOrder = 3; root.add(s); bodies[id] = s;
    }
    bodies.lun = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, transparent: true, depthWrite: false, fog: false })); bodies.lun.scale.setScalar(0.95); bodies.lun.renderOrder = 3; root.add(bodies.lun);
    bodies.sol = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("#fff2c0"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); bodies.sol.scale.setScalar(2.4); root.add(bodies.sol);
  }
  const worldDir = (ra, dec) => eqVec(ra, dec).applyMatrix3(M3).normalize();

  // ---- time and place
  function timeFor() {
    if (st.mode === "now" || st.run) return st.date;
    // tonight at 22:00 local mean solar time at the site
    const now = new Date(), offMs = st.site.lon / 15 * 3600e3, local = new Date(now.getTime() + offMs);
    const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 22, 0, 0) - offMs);
    return d;
  }
  function apply() {
    if (!st.data) return;
    const date = st.run || st.mode === "now" ? st.date : timeFor(); st.shown = date;
    const jd = julian(date); st.lst = (gmst(jd) + st.site.lon + 360) % 360;
    const m = skyMatrix(st.site.lat, st.lst);
    M.set(m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0, 0, 0, 0, 1); cel.matrix.copy(M); cel.matrixWorldNeedsUpdate = true;
    M3.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]); toEq.copy(M3).transpose();
    // bodies
    const B = planetsAt(st.data.planets, jd); st.bodies = B;
    const sunAlt = horizontal(B.sol.ra, B.sol.dec, st.site.lat, st.lst).alt; st.sunAlt = sunAlt;
    const day = Math.max(0, Math.min(1, (sunAlt + 6) / 10)); st.day = sunAlt > -6;
    domeMat.uniforms.uDay.value = day * 0.85; starMat.uniforms.uDay.value = day;
    for (const id of Object.keys(PLANET)) placeBody(bodies[id], B[id].ra, B[id].dec, 0);
    const ph = moonPhase(B.sol, B.lun); st.phase = ph;
    placeBody(bodies.lun, B.lun.ra, B.lun.dec, B.lun.parallax);
    placeBody(bodies.sol, B.sol.ra, B.sol.dec, 0);
    // turn the lit limb toward the Sun as seen on the dome
    const mw = bodies.lun.position.clone(), sw = worldDir(B.sol.ra, B.sol.dec).multiplyScalar(R);
    const toSun = sw.sub(mw), view = mw.clone().normalize(), upv = new THREE.Vector3(0, 1, 0).sub(view.clone().multiplyScalar(view.y)).normalize(), rightv = new THREE.Vector3().crossVectors(upv, view).normalize();
    paintMoon(ph, -Math.atan2(toSun.dot(upv), -toSun.dot(rightv)));
    if (opt.onChange) opt.onChange();
  }
  function placeBody(s, ra, dec, parallax) {
    const d = worldDir(ra, dec);
    if (parallax) { const alt = Math.asin(d.y), az = Math.atan2(d.x, -d.z), a2 = alt - parallax * D2R * Math.cos(alt); d.set(Math.sin(az) * Math.cos(a2), Math.sin(a2), -Math.cos(az) * Math.cos(a2)); }
    s.position.copy(d).multiplyScalar(R - 0.2); s.visible = d.y > 0.004; s.userData.alt = Math.asin(d.y) / D2R;
  }

  // ---- highlight a constellation: gold figure, dashed boundary, bright name
  function highlight(id) {
    if (st.hiId === id) return; st.hiId = id;
    if (hiLines) { cel.remove(hiLines); hiLines.geometry.dispose(); hiLines = null; }
    if (hiBound) { cel.remove(hiBound); hiBound.geometry.dispose(); hiBound = null; }
    if (st.hiLabel) tintLabel(st.hiLabel, [0.62, 0.68, 0.86]); st.hiLabel = null;
    const c = id && st.data.cons.find((x) => x.id === id); if (!c) return;
    hiLines = new THREE.LineSegments(segs(c.lines, RL - 0.02), hiMat); hiLines.renderOrder = 4; cel.add(hiLines);
    hiBound = new THREE.LineSegments(boundSegs(c.bounds, RL), bdMat); hiBound.computeLineDistances(); hiBound.renderOrder = 4; cel.add(hiBound);
    tintLabel(id, [1, 0.86, 0.52]); st.hiLabel = id;
  }

  // ---- what is at this point of the dome?
  function pickRay(origin, dir) {
    if (!st.data) return null;
    const o = origin.clone().sub(C), b = o.dot(dir), c = o.lengthSq() - R * R, disc = b * b - c;
    if (disc < 0) return null;
    const t = -b + Math.sqrt(disc); if (t <= 0) return null;
    const p = o.addScaledVector(dir, t);
    if (p.y < 0.02) return null;
    const d = p.normalize(), alt = Math.asin(d.y) / D2R;
    if (alt < 4) return { type: "horizon" };
    const eq = toRaDec(d.clone().applyMatrix3(toEq)), B = st.bodies;
    let best = null, bd = 3.2;
    for (const id of ["mer", "ven", "mar", "jup", "sat"]) { if (!bodies[id].visible) continue; const s2 = sepDeg(eq, B[id]); if (s2 < bd) { bd = s2; best = id; } }
    if (bodies.lun.visible) { const mv = bodies.lun.position.clone().normalize().applyMatrix3(toEq), s2 = sepDeg(eq, toRaDec(mv)); if (s2 < 3.6 && (!best || s2 < bd)) best = "lun"; }
    if (best) return { type: "planet", id: best };
    return { type: "cons", id: consAt(eq.ra, eq.dec), mw: inMilkyWay(eq.ra, eq.dec) };
  }
  function consAt(ra, dec) {
    const cons = st.data.cons;
    if (dec > 86.1) return "UMi";
    if (dec < -82.5) return "Oct";
    for (const c of cons) if (c.bounds.some((r) => inRing(r, ra, dec))) return c.id;
    let best = null, bd = 1e9; for (const c of cons) { const s2 = sepDeg({ ra, dec }, { ra: c.at[0] / 100, dec: c.at[1] / 100 }); if (s2 < bd) { bd = s2; best = c.id; } }
    return best;
  }
  function inMilkyWay(ra, dec) {
    const L1 = st.data.mw.filter((m) => m[0] === 1);
    return L1.some((m) => m[1] === 0 && inRing(m[2], ra, dec)) && !L1.some((m) => m[1] === 1 && inRing(m[2], ra, dec));
  }
  function altOf(ra, dec) { return horizontal(ra, dec, st.site.lat, st.lst).alt; }

  // ---- cards
  const loreFor = (target) => st.data.lore.filter((e) => e.targets.includes(target));
  const circumpolar = (c) => st.data.lore.filter((e) => e.targets.some((t) => { const m = /^circumpolar:(-?[\d.]+)$/.exec(t); if (!m) return false; const lat = +m[1]; return lat >= 0 ? c.at[1] / 100 > 90 - lat : c.at[1] / 100 < -90 - lat; }));
  function loreHtml(list, chapterTitle) {
    if (!list.length) return "";
    return list.map((e) => `<div class="mu-lore"><h3>${esc(e.title)}</h3>` +
      (e.verdict === "contested" ? `<span class="mu-flag soft">Contested</span>` : e.verdict === "not supported" ? `<span class="mu-flag">Not supported by the evidence</span>` : "") +
      `<p>${esc(e.text)}</p><p class="mu-meta"><a href="chapters/${e.chapter}.html${e.verdict ? "#evidence" : ""}">From “${esc(chapterTitle(e.chapter))}” ›</a></p></div>`).join("");
  }
  function where(ra, dec) {
    const a = altOf(ra, dec);
    return a > 0 ? `${Math.round(a)}° above the horizon of ${esc(st.site.name)}` : `below the horizon of ${esc(st.site.name)} at this hour`;
  }
  function card(d, chapterTitle) {
    const S = st.data, siteNote = `<p class="mu-meta">${esc(timeLabel())}</p>`;
    if (d.what === "cons") {
      const c = S.cons.find((x) => x.id === d.id), list = loreFor(c.id).concat(circumpolar(c));
      const zod = ZODIAC.includes(c.id);
      const bright = S.names.filter((x) => x[2] === c.id).slice(0, 3).map((x) => x[1]);
      return `<p class="mu-cat">The planetarium · ${zod ? "Constellation of the zodiac" : "Constellation"}</p><h2 id="mu-card-h">${esc(c.name)}</h2>` +
        `<p class="mu-meta">“${esc(c.en)}” · genitive <em>${esc(c.gen)}</em> · IAU abbreviation ${esc(c.id)}${bright.length ? `<br>Brightest named stars: ${bright.map(esc).join(", ")}` : ""}<br>Its centre is ${where(c.at[0] / 100, c.at[1] / 100)}.</p>` +
        (zod ? `<p>The zodiac is the band of sky along which the Sun, the Moon and the planets travel; this is one of the twelve constellations that gave the signs their names.</p>` : "") +
        (list.length ? loreHtml(list, chapterTitle) : `<p class="mu-contested">The archive has no chapter that writes about this constellation yet, so this card gives only the astronomy.</p>`) +
        (d.mw ? `<div class="mu-actions"><button type="button" class="ghost" data-sky="mw">Also here: the Milky Way</button></div>` : "") +
        `<p class="mu-meta" style="margin-top:.7rem">Outlined in gold: the constellation's official IAU boundary. The stick figure is a drawing convention, not part of the definition.</p>` + siteNote;
    }
    if (d.what === "planet") {
      const B = st.bodies[d.id], name = d.id === "lun" ? "The Moon" : PLANET[d.id].name, list = loreFor("planet:" + d.id);
      const inC = S.cons.find((x) => x.id === consAt(B.ra, B.dec));
      const extra = d.id === "lun" ? `<br>${Math.round(st.phase.lit * 100)}% lit, ${st.phase.waxing ? "waxing" : "waning"}. Drawn larger than life, as planetariums do.` : "";
      return `<p class="mu-cat">The planetarium · ${d.id === "lun" ? "The Moon" : "Planet"}</p><h2 id="mu-card-h">${name}</h2>` +
        `<p class="mu-meta">In ${esc(inC.name)} on this date, ${where(B.ra, B.dec)}.${extra}</p>` + loreHtml(list, chapterTitle) +
        `<p class="mu-meta" style="margin-top:.7rem">Position computed for the date shown from JPL's approximate planetary elements${d.id === "lun" ? " (for the Moon, the Astronomical Almanac's low-precision formulae)" : ""}; accurate to a fraction of a degree.</p>` + siteNote;
    }
    if (d.what === "mw") {
      return `<p class="mu-cat">The planetarium</p><h2 id="mu-card-h">The Milky Way</h2><p class="mu-meta">The disc of our own galaxy, seen edge-on from inside it. Its outline here follows Vieira's Milky Way Outline Catalog.</p>` + loreHtml(loreFor("mw"), chapterTitle) + siteNote;
    }
    if (d.what === "horizon") {
      return `<p class="mu-cat">The planetarium</p><h2 id="mu-card-h">The horizon of ${esc(st.site.name)}</h2><p class="mu-meta">The dome's rim is the true horizon of the site, with north, east, south and west marked. Stars rise in the east and set in the west, each at its own point on the horizon.</p>` + loreHtml(loreFor("horizon"), chapterTitle) + siteNote;
    }
    // about this sky
    return `<p class="mu-cat">The planetarium</p><h2 id="mu-card-h">About this sky</h2>` +
      `<p>The dome shows the sky over ${esc(st.site.name)} for the date and time below: ${S.stars.length / 4} stars down to the faintest the eye can see (magnitude 6), the Milky Way, the 88 constellations and, where they are on that date, the Moon and the five planets known since antiquity. Tap any part of the dome to learn which constellation is there and what the archive says about it.</p>` +
      `<p class="mu-contested">This is the sky as it is now. The stars are placed at their modern (J2000) positions, and the slow wobble of the Earth's axis, precession, shifts the whole sky by about 1.4° a century, so the sky the ancient builders of ${esc(st.site.name)} saw was measurably different.</p>` +
      loreHtml(loreFor("about"), chapterTitle) +
      `<p class="mu-meta" style="margin-top:.7rem">Data: XHIP (Anderson &amp; Francis 2012) for the stars; the IAU's constellation boundaries (Davenhall &amp; Leggett 1989); Vieira's Milky Way outlines; JPL's approximate planetary elements (Standish), all via d3-celestial (BSD licence). The stick figures are a convention; the IAU defines only the boundaries.</p>` + siteNote;
  }
  function timeLabel() {
    const d = st.shown || new Date(), local = new Date(d.getTime() + st.site.lon / 15 * 3600e3);
    const hh = String(local.getUTCHours()).padStart(2, "0"), mm = String(local.getUTCMinutes()).padStart(2, "0");
    const day = local.toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return `Sky over ${st.site.name}, ${day}, ${hh}:${mm} local solar time${st.day ? " (daylight: the dome shows the stars anyway)" : ""}.`;
  }

  // ---- load
  async function load(url) {
    const data = await fetch(url).then((r) => r.json());
    st.data = data; st.site = data.sites[0];
    const n = data.stars.length / 4, pos = new Float32Array(n * 3), mag = new Float32Array(n), col = new Float32Array(n * 3), ph = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = eqVec(data.stars[i * 4] / 100, data.stars[i * 4 + 1] / 100).multiplyScalar(R - 0.1);
      pos.set([v.x, v.y, v.z], i * 3); mag[i] = data.stars[i * 4 + 2] / 100; col.set(bvColor(data.stars[i * 4 + 3] / 100), i * 3); ph[i] = (i * 0.61803) % 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("aMag", new THREE.BufferAttribute(mag, 1)); g.setAttribute("aCol", new THREE.BufferAttribute(col, 3)); g.setAttribute("aPh", new THREE.BufferAttribute(ph, 1));
    starPts = new THREE.Points(g, starMat); starPts.frustumCulled = false; starPts.renderOrder = 1; cel.add(starPts);
    figLines = new THREE.LineSegments(segs(data.cons.flatMap((c) => c.lines), RL), lineMat); figLines.renderOrder = 1; cel.add(figLines);
    labels = buildLabels(data.cons); cel.add(labels);
    paintMilkyWay(data.mw);
    makeBodies();
    apply();
  }

  return {
    root, load, state: st,
    setScale(px) { starMat.uniforms.uScale.value = px; },
    setSite(id) { const s = st.data && st.data.sites.find((x) => x.id === id); if (s) { st.site = s; apply(); } },
    setMode(m) { st.mode = m; st.run = false; st.date = new Date(); apply(); },
    toggleRun() { st.run = !st.run; if (st.run) st.date = new Date((st.shown || new Date()).getTime()); apply(); return st.run; },
    toggleLines() { st.lines = !st.lines; if (figLines) figLines.visible = st.lines; if (labels) labels.visible = st.lines; return st.lines; },
    tick(dt, now, reduce) {
      if (!st.data) return false;
      starMat.uniforms.uTime.value = now / 1000; starMat.uniforms.uTw.value = reduce ? 0 : 1;
      if (st.run) { st.date = new Date(st.date.getTime() + dt * 1200e3); apply(); return true; }        // 20 minutes of sky per second
      if (st.mode === "now") { const t = Date.now(); if (!st.lastNow || t - st.lastNow > 20000) { st.lastNow = t; st.date = new Date(t); apply(); return true; } }
      return false;
    },
    pickRay, highlight, card, timeLabel,
    loreTargets() { return st.data ? st.data.lore : []; }
  };
}
