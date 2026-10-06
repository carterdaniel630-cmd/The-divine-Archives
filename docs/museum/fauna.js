/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: animals

   The creatures that live in each room's world (world.js): fish that school
   and leap from the water, birds and bats in the air under the skylight,
   butterflies, dragonflies and fireflies over the ground under the glass,
   and, on that ground, cats stalking lizards on the Nile's bank, herons and
   ibises wading, crabs on the shore, frogs on lotus pads, turtles, ravens on
   the snow, an owl, hares, mice, scorpions and axolotls.

   Every creature is built from code (lathed bodies, shaped fins, feathers
   and limbs, patterned vertex colours) and animated by code: schools and
   flocks by steering, fish and wings by vertex shaders, walkers by a small
   skeleton. They are atmosphere, like the skies and grounds, not natural
   history exhibits. With "reduce motion" on, they hold still.
   ========================================================================== */
import * as THREE from "three";
import { colorize, mergeG, rng, fbm2, smooth, PLANT_U } from "./world.js?v=5";

const TAU = Math.PI * 2;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const angWrap = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };

// ---------------------------------------------------------------- the creatures' material
// Phong for smooth normals and a wet or glossy highlight, lit mostly by the area's sky (as the ground is)
// and a little by the museum's lamps; o.vert is extra vertex motion (swimming, wing beats), with io the
// instance's position for a phase
function creatureMat(o, LU) {
  const sp = o.spec == null ? 0.06 : o.spec;
  const m = new THREE.MeshPhongMaterial({ vertexColors: true, color: new THREE.Color(0.35, 0.35, 0.35), specular: new THREE.Color(sp, sp, sp), shininess: o.shine || 24, side: o.side || THREE.FrontSide });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, LU, { uTime: PLANT_U.uTime }, o.uniforms || {});
    sh.vertexShader = "uniform float uTime;\n" + (o.head || "") + "\n" + sh.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      #ifdef USE_INSTANCING
      vec3 io = (instanceMatrix * vec4(0., 0., 0., 1.)).xyz;
      #else
      vec3 io = vec3(0.);
      #endif
      ${o.vert || ""}`);
    sh.fragmentShader = "uniform vec3 uAmb, uSun, uSunDir;\n" + sh.fragmentShader.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
      vec3 nW = normalize(inverseTransformDirection(normal, viewMatrix));
      totalEmissiveRadiance += diffuseColor.rgb * 1.6 * (uAmb * (.5 + .5 * max(nW.y, 0.)) + uSun * max(dot(nW, uSunDir), 0.));`);
  };
  m.customProgramCacheKey = () => "cr" + (o.key || "");
  return m;
}

// ---------------------------------------------------------------- geometry kit
// a body lathed along +z (forward), elliptical in section; prof: [[z, r], ...] from tail to nose
function body(prof, o) {
  o = o || {}; const seg = o.seg || 20, w = o.w || 1, h = o.h || 1, pos = [], col = [], idx = [], n = prof.length;
  for (let i = 0; i < n; i++) {
    const [z, r, dy] = prof[i];
    for (let k = 0; k <= seg; k++) {
      const a = k / seg * TAU, x = Math.cos(a) * r * w, y = Math.sin(a) * r * h + (dy || 0) + (o.belly && Math.sin(a) < 0 ? Math.sin(a) * r * o.belly : 0);
      pos.push(x, y, z);
      const c = o.color ? o.color(z, a, x, y, i / (n - 1)) : [1, 1, 1]; col.push(c[0], c[1], c[2]);
    }
  }
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < seg; k++) { const a = i * (seg + 1) + k, b = a + seg + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
// a thin fin or wing from an outline in its own plane (x across, y up), then placed
function fin(pts, color, thick) {
  const sh = new THREE.Shape(); pts.forEach((p, i) => sh[i ? "lineTo" : "moveTo"](p[0], p[1]));
  const g = thick ? new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false, curveSegments: 4 }) : new THREE.ShapeGeometry(sh, 4);
  if (thick) g.translate(0, 0, -thick / 2);
  return colorize(g, typeof color === "function" ? color : () => color);
}
function ball(r, c, sx, sy, sz, seg) { const g = new THREE.SphereGeometry(r, seg || 10, Math.max(6, (seg || 10) * 0.7 | 0)); g.scale(sx || 1, sy || 1, sz || 1); return colorize(g, typeof c === "function" ? c : () => c); }
function limb(pts, r0, r1, c, seg) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => V3(p[0], p[1], p[2]))), g = new THREE.TubeGeometry(curve, seg || 6, 1, 10, false), P = g.attributes.position, N = g.attributes.normal;
  // taper: move each ring toward its centre
  const rings = (seg || 6) + 1, per = P.count / rings;
  for (let i = 0; i < rings; i++) { const t = i / (rings - 1), r = lerp(r0, r1, t), c0 = curve.getPointAt(t); for (let k = 0; k < per; k++) { const j = i * per + k; P.setXYZ(j, c0.x + N.getX(j) * r, c0.y + N.getY(j) * r, c0.z + N.getZ(j) * r); } }
  g.computeVertexNormals();
  return colorize(g, typeof c === "function" ? c : () => c);
}
function cone(r, h, c, seg) { const g = new THREE.ConeGeometry(r, h, seg || 8); return colorize(g, () => c); }
const T = (g, x, y, z, rx, ry, rz) => { if (rx) g.rotateX(rx); if (ry) g.rotateY(ry); if (rz) g.rotateZ(rz); g.translate(x || 0, y || 0, z || 0); return g; };
// eyes: a dark ball with a bright point of reflection
function eyes(L, x, y, z, r, iris) { [-1, 1].forEach((s) => { L.push(T(ball(r, iris || [0.03, 0.03, 0.03], 1, 1, 1, 10), s * x, y, z)); L.push(T(ball(r * 0.28, [1, 1, 1], 1, 1, 1, 6), s * (x + r * 0.5), y + r * 0.35, z + r * 0.55)); }); }
function withAttr(g, name, fn) { const P = g.attributes.position, a = new Float32Array(P.count); for (let i = 0; i < P.count; i++) a[i] = fn(P.getX(i), P.getY(i), P.getZ(i)); g.setAttribute(name, new THREE.BufferAttribute(a, 1)); return g; }
// merge keeping one extra float attribute (wing weight, bone index...)
function mergeA(list, names) {
  let n = 0; const parts = list.map((g) => { const q = g.index ? g.toNonIndexed() : g; if (!q.attributes.normal) q.computeVertexNormals(); n += q.attributes.position.count; return q; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3).fill(1), ex = (names || []).map(() => new Float32Array(n)); let o = 0;
  parts.forEach((q) => { const c = q.attributes.position.count; pos.set(q.attributes.position.array, o * 3); nor.set(q.attributes.normal.array, o * 3); if (q.attributes.color) col.set(q.attributes.color.array, o * 3); (names || []).forEach((nm, k) => { if (q.attributes[nm]) ex[k].set(q.attributes[nm].array, o); }); o += c; });
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  (names || []).forEach((nm, k) => g.setAttribute(nm, new THREE.BufferAttribute(ex[k], 1)));
  return g;
}

// ---------------------------------------------------------------- fish
// length 1 along +z (nose at +0.5); patterns by kind
const FISH = {
  koi: { len: [0.34, 0.5], speed: 0.16, jump: 0, color: (z, a, x, y, R) => { const n = fbm2(z * 7 + R, a * 1.3 + R, 3, 3), top = y > -0.02; if (!top) return [0.95, 0.92, 0.86]; return n > 0.58 ? [0.98, 0.96, 0.92] : n > 0.4 ? [0.95, 0.38, 0.08] : n > 0.3 ? [0.08, 0.07, 0.07] : [0.95, 0.5, 0.12]; }, fins: [0.96, 0.62, 0.36] },
  trout: { len: [0.24, 0.36], speed: 0.3, jump: 1, color: (z, a, x, y, R) => { const spot = fbm2(z * 40 + R, a * 6, 5, 2) > 0.66 && y > -0.01; const stripe = Math.abs(y + 0.005) < 0.018; let c = y > 0.02 ? [0.34, 0.38, 0.24] : y > -0.03 ? [0.7, 0.72, 0.62] : [0.92, 0.9, 0.84]; if (stripe) c = [0.86, 0.5, 0.5]; return spot ? [0.08, 0.08, 0.06] : c; }, fins: [0.56, 0.5, 0.38] },
  tilapia: { len: [0.2, 0.3], speed: 0.22, jump: 1, deep: 1.35, color: (z, a, x, y) => { const bar = Math.sin(z * 50) > 0.55 && y > -0.02; const c = y > 0.02 ? [0.36, 0.4, 0.36] : y > -0.03 ? [0.58, 0.62, 0.58] : [0.82, 0.84, 0.8]; return bar ? c.map((v) => v * 0.6) : c; }, fins: [0.5, 0.38, 0.36] },
  bream: { len: [0.22, 0.34], speed: 0.26, jump: 1, deep: 1.5, color: (z, a, x, y) => { const c = y > 0.03 ? [0.42, 0.44, 0.4] : [0.82, 0.8, 0.72]; return c.map((v) => v * (0.9 + 0.1 * Math.sin(z * 90))); }, fins: [0.6, 0.5, 0.4] },
  axolotls: { len: [0.18, 0.24], speed: 0.06, jump: 0, color: () => [0.95, 0.72, 0.74], fins: [0.95, 0.7, 0.72], axolotl: true }
};
// a fin with rays: an outline, coloured with the rays darker, and a clear-ish margin
function rayFin(pts, base, rays, ox, oy) {
  return fin(pts, (x, y) => { const a = Math.atan2(y - (oy || 0), x - (ox || 0)), r = Math.hypot(x - (ox || 0), y - (oy || 0)); const k = 0.82 + 0.18 * Math.pow(Math.abs(Math.sin(a * (rays || 14))), 0.4); return base.map((v) => Math.min(1, v * k * (0.9 + r * 0.8))); });
}
function eyeBall(L, x, y, z, r, iris, dir) {
  [-1, 1].forEach((s) => {
    const e = ball(r, (px, py, pz) => { const d = Math.hypot(py, (dir || 1) * pz - r * 0.9); return d < r * 0.45 ? [0.02, 0.02, 0.02] : d < r * 0.8 ? iris : [0.9, 0.88, 0.8]; }, 1, 1, 1, 14);
    e.rotateY(s * 1.2); L.push(T(e, s * x, y, z));
    L.push(T(ball(r * 0.18, [1, 1, 1], 1, 1, 1, 6), s * (x + r * 0.55), y + r * 0.4, z + r * 0.45));
  });
}
function fishGeo(kind) {
  const F = FISH[kind], L = [], deep = F.deep || 1, seed = kind.length;
  const scale = (z, a) => { const u = z * 70 + (Math.floor(a * 9 / TAU * 2) % 2) * 0.5, v = a * 9 / TAU * 2; return 0.9 + 0.1 * smooth(0.2, 0.5, Math.abs((u % 1 + 1) % 1 - 0.5) + Math.abs((v % 1 + 1) % 1 - 0.5) * 0.6); };
  const prof = F.axolotl
    ? [[-0.5, 0.004], [-0.3, 0.05], [-0.1, 0.09], [0.1, 0.1], [0.25, 0.09], [0.3, 0.1], [0.4, 0.12], [0.47, 0.1], [0.5, 0.02]]
    : [[-0.5, 0.018], [-0.44, 0.03], [-0.35, 0.052], [-0.2, 0.088], [0, 0.112], [0.16, 0.114], [0.28, 0.102], [0.37, 0.083], [0.43, 0.062], [0.47, 0.04], [0.495, 0.018], [0.5, 0.0]];
  L.push(body(prof, { seg: 28, w: F.axolotl ? 0.85 : 0.52, h: deep, belly: 0.08, color: (z, a, x, y) => {
    let c = F.color(z, a, x, y, seed);
    if (!F.axolotl) {
      c = c.map((v) => v * scale(z, a));
      if (Math.abs(z - 0.3) < 0.006 && y > -0.08 * deep) c = c.map((v) => v * 0.55);           // the gill cover
      if (Math.abs(y - 0.01 * deep) < 0.004 && z < 0.28) c = c.map((v) => v * 0.75);           // the lateral line
    }
    return c; } }));
  const fc = F.fins;
  if (F.axolotl) {
    [[-1, 0.18], [1, 0.18], [-1, -0.12], [1, -0.12]].forEach(([s, z]) => { L.push(T(limb([[0, 0, 0], [s * 0.06, -0.03, 0.02], [s * 0.1, -0.06, 0.04]], 0.018, 0.01, fc), 0, -0.02, z));
      for (let k = 0; k < 4; k++) L.push(T(limb([[0, 0, 0], [s * 0.02, -0.005, (k - 1.5) * 0.012]], 0.005, 0.003, fc), s * 0.1, -0.08, z + 0.04)); });
    L.push(T(fin([[0, 0.08], [0.1, 0.05], [0.5, 0.01], [0.55, 0], [0.5, -0.01], [0.1, -0.05], [0, -0.07]], (x, y) => [0.95, 0.72 - Math.abs(y), 0.74]), 0, 0.02, -0.05, 0, Math.PI / 2, 0));   // the fin down back and tail
    for (let k = 0; k < 3; k++) [-1, 1].forEach((s) => { const st = [[0, 0, 0], [s * 0.04, 0.05 + k * 0.01, -0.02 - k * 0.02], [s * 0.07, 0.1, -0.06 - k * 0.03]];
      L.push(T(limb(st, 0.008, 0.004, [0.85, 0.3, 0.42], 5), s * 0.07, 0.04 - k * 0.02, 0.36));
      for (let f = 0; f < 6; f++) { const t = 0.3 + f * 0.12, px = st[1][0] * t * 1.4, py = st[1][1] * t * 1.4, pz = st[1][2] * t * 1.4; L.push(T(ball(0.009, [0.95, 0.35, 0.5], 1, 0.4, 1, 5), s * 0.07 + px, 0.04 - k * 0.02 + py, 0.36 + pz)); } });
    eyeBall(L, 0.07, 0.035, 0.42, 0.012, [0.1, 0.1, 0.1]);
    L.push(T(limb([[-0.05, -0.02, 0.49], [0, -0.03, 0.505], [0.05, -0.02, 0.49]], 0.004, 0.004, [0.6, 0.35, 0.38], 6), 0, 0, 0));   // the smile
  } else {
    L.push(T(rayFin([[0, 0], [0.04, 0.1 * deep], [0.1, 0.14 * deep], [0.18, 0.1 * deep], [0.26, 0]], fc, 10, 0.13, 0), 0, 0.1 * deep, -0.22, 0, -Math.PI / 2, 0));   // dorsal
    L.push(T(rayFin([[0, 0.02], [-0.1, 0.12], [-0.22, 0.22 * deep], [-0.17, 0.02], [-0.22, -0.2 * deep], [-0.1, -0.12], [0, -0.02]], fc, 16, 0, 0), 0, 0, -0.46, 0, -Math.PI / 2, 0));   // forked tail
    L.push(T(rayFin([[0, 0], [0.04, -0.08 * deep], [0.12, -0.06 * deep], [0.14, 0]], fc, 8, 0.07, 0), 0, -0.1 * deep, -0.3, 0, -Math.PI / 2, 0));   // anal
    if (kind === "trout") L.push(T(fin([[0, 0], [0.02, 0.03], [0.05, 0.02], [0.05, 0]], fc), 0, 0.07, -0.37, 0, -Math.PI / 2, 0));   // adipose
    [-1, 1].forEach((s) => {
      L.push(T(rayFin([[0, 0], [0.1, -0.015], [0.1, -0.05], [0, -0.022]].map(([x, y]) => [x * s, y]), fc, 8), s * 0.045, -0.03, 0.22, 0.25, 0, s * 0.35));        // pectoral
      L.push(T(rayFin([[0, 0], [0.07, -0.02], [0.06, -0.05], [0, -0.02]].map(([x, y]) => [x * s, y]), fc, 7), s * 0.025, -0.09 * deep, -0.02, 0.25, 0, s * 0.25));   // pelvic
    });
    eyeBall(L, 0.042, 0.03, 0.37, 0.016, kind === "koi" ? [0.6, 0.45, 0.2] : [0.75, 0.6, 0.25]);
    if (kind === "koi") [-1, 1].forEach((s) => { L.push(T(limb([[0, 0, 0], [s * 0.01, -0.01, 0.01], [s * 0.015, -0.03, 0.005]], 0.004, 0.002, [0.95, 0.7, 0.5], 4), s * 0.02, -0.02, 0.48)); });
    L.push(T(body([[0, 0.022], [0.01, 0.018], [0.014, 0.0]], { seg: 12, w: 1.2, h: 0.6, color: () => [0.35, 0.22, 0.2] }), 0, -0.012, 0.487));   // lips
  }
  return mergeG(L);
}
// schools in the water: steering, and leaps from the surface
function fishSchool(A, kind, q, ctx) {
  const F = FISH[kind], n = kind === "koi" ? (q > 1 ? 9 : 5) : kind === "axolotls" ? 4 : (A.kind === "room" ? (q > 1 ? 10 : 6) : 5), R = rng(A.seedN + kind.length);
  const mat = creatureMat({ key: "fish", spec: 0.35, shine: 70, side: THREE.DoubleSide, uniforms: { uSwim: { value: kind === "koi" ? 4 : 9 } }, head: "uniform float uSwim;",
    vert: "float bw = smoothstep(.35, -.55, position.z); float ph = io.x * 3.1 + io.z * 1.7; transformed.x += sin(position.z * 7. - uTime * uSwim + ph) * .07 * bw;" }, A.LU);
  const im = new THREE.InstancedMesh(fishGeo(kind), mat, n); im.frustumCulled = false;
  const W = A.waterY, ok = (x, z) => { const [s, t] = A.toL(x, z); return s > 0.2 && s < A.L - 0.2 && Math.abs(t) < A.W / 2 - 0.2 && A.groundH(x, z) < W - 0.14; };
  // find water to swim in
  const spots = []; for (let i = 0; i < 400 && spots.length < 60; i++) { const [x, z] = A.toW(R() * A.L, (R() - 0.5) * A.W); if (ok(x, z)) spots.push([x, z]); }
  if (!spots.length) { im.dispose(); return null; }
  const fish = []; for (let i = 0; i < n; i++) { const s = spots[Math.floor(R() * spots.length)]; fish.push({ x: s[0], z: s[1], y: W - 0.12, h: R() * TAU, v: F.speed * (0.7 + R() * 0.6), len: lerp(F.len[0], F.len[1], R()), tgt: null, jump: -1, jt: 0, wait: R() * 6 }); }
  let nextJump = 3 + R() * 6; const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(0, 0, 0, "YXZ"), P = new THREE.Vector3(), S = new THREE.Vector3();
  function place(f, i, pitch, roll) { E.set(pitch || 0, f.h, roll || 0); Q.setFromEuler(E); M.compose(P.set(f.x, f.y, f.z), Q, S.setScalar(f.len)); im.setMatrixAt(i, M); }
  fish.forEach((f, i) => place(f, i));
  return {
    obj: im,
    update(dt, t) {
      nextJump -= dt;
      fish.forEach((f, i) => {
        if (f.jump >= 0) {                                              // a leap: out, arc, back in with a splash
          f.jump += dt / 1.0; const u = f.jump;
          f.x += Math.sin(f.h) * f.v * 3 * dt; f.z += Math.cos(f.h) * f.v * 3 * dt;
          f.y = W + Math.sin(Math.min(1, u) * Math.PI) * f.jh;
          place(f, i, -Math.cos(Math.min(1, u) * Math.PI) * 0.9, Math.sin(u * 9) * 0.3);
          if (u >= 1) { f.jump = -1; f.y = W - 0.1; ctx.splash(A, f.x, f.z, 1); }
          return;
        }
        if (!f.tgt || Math.hypot(f.tgt[0] - f.x, f.tgt[1] - f.z) < 0.15) { const s = spots[Math.floor(Math.random() * spots.length)]; f.tgt = [s[0], s[1]]; }
        const want = Math.atan2(f.tgt[0] - f.x, f.tgt[1] - f.z), d = angWrap(want - f.h);
        f.h += clamp(d, -1.4 * dt, 1.4 * dt);
        const nx = f.x + Math.sin(f.h) * f.v * dt, nz = f.z + Math.cos(f.h) * f.v * dt;
        if (ok(nx, nz)) { f.x = nx; f.z = nz; } else { f.h += 2 * dt; f.tgt = null; }
        f.y = lerp(f.y, Math.max(A.groundH(f.x, f.z) + 0.06, W - 0.08 - 0.12 * (0.5 + 0.5 * Math.sin(t * 0.3 + i))), dt);
        place(f, i, Math.sin(t * 0.7 + i) * 0.08, 0);
      });
      if (F.jump && nextJump <= 0) { nextJump = 5 + Math.random() * 9; const f = fish[Math.floor(Math.random() * n)]; if (f.jump < 0) { f.jump = 0; f.jh = 0.25 + Math.random() * 0.3; f.y = W; ctx.splash(A, f.x, f.z, 0.8); } }
      im.instanceMatrix.needsUpdate = true;
    }
  };
}

// ---------------------------------------------------------------- birds and bats in flight (instanced, flapping in the vertex shader)
const FLYER = {
  swallows: { n: 6, size: 0.17, speed: 3.2, flap: 16, amp: 0.8, agile: 3.5, col: { back: [0.08, 0.1, 0.24], belly: [0.94, 0.88, 0.8], face: [0.08, 0.1, 0.24], throat: [0.62, 0.22, 0.12] }, fork: true },
  songbirds: { n: 5, size: 0.13, speed: 2.2, flap: 20, amp: 0.9, agile: 3, col: { back: [0.46, 0.34, 0.2], belly: [0.9, 0.78, 0.58], face: [0.46, 0.34, 0.2], throat: [0.85, 0.45, 0.25], tip: [0.25, 0.18, 0.12] }, hop: true },
  doves: { n: 4, size: 0.26, speed: 1.8, flap: 9, amp: 0.7, agile: 1.6, col: { back: [0.66, 0.66, 0.72], belly: [0.82, 0.76, 0.78], face: [0.6, 0.6, 0.66], throat: [0.5, 0.62, 0.55], tip: [0.3, 0.3, 0.34] } },
  macaws: { n: 2, size: 0.42, speed: 2, flap: 7, amp: 0.6, agile: 1.2, col: { back: [0.85, 0.1, 0.08], belly: [0.88, 0.14, 0.1], face: [0.9, 0.12, 0.1], wing: [0.95, 0.75, 0.1], tip: [0.08, 0.3, 0.85], tail: [0.85, 0.12, 0.1] }, longTail: true },
  kingfisher: { n: 1, size: 0.16, speed: 2.6, flap: 22, amp: 0.8, agile: 2.5, col: { back: [0.05, 0.5, 0.75], belly: [0.9, 0.5, 0.15], face: [0.05, 0.4, 0.7] }, low: true },
  ravens: { n: 2, size: 0.4, speed: 1.7, flap: 6, amp: 0.7, agile: 1.2, col: { back: [0.05, 0.05, 0.07], belly: [0.06, 0.06, 0.08], face: [0.05, 0.05, 0.06] } },
  bats: { n: 7, size: 0.2, speed: 2.6, flap: 14, amp: 1, agile: 5, bat: true, col: { back: [0.1, 0.08, 0.07], belly: [0.16, 0.12, 0.1], face: [0.12, 0.1, 0.08] } },
};
// one feather: a tapered vane with a darker shaft, lying along +x in the xy plane
function feather(len, w, c, shaft) {
  const pts = [[0, -w * 0.3], [len * 0.15, -w * 0.5], [len * 0.85, -w * 0.42], [len, 0], [len * 0.85, w * 0.36], [len * 0.15, w * 0.45], [0, w * 0.3]];
  return fin(pts, (x, y) => { const k = Math.abs(y) < w * 0.06 ? (shaft || 0.7) : 0.92 + 0.08 * Math.sin(x / len * 40 + y * 60); return c(x / len).map((v) => v * k); });
}
function wing(span, chord, cols, nP, nS, weight) {
  // in the wing's plane: x outward, y forward; primaries from the hand, secondaries from the arm, coverts over their roots
  const L = [];
  for (let i = 0; i < nP; i++) {
    const t = i / (nP - 1), len = chord * (1.25 + 0.55 * Math.sin(t * 2.6)), base = span * (0.52 + 0.4 * t);
    const f = feather(len, chord * 0.28, (u) => cols.tip && u > 0.5 ? cols.tip : cols.prim); f.rotateZ(-Math.PI / 2 + 0.25 + t * 1.15); f.translate(base, chord * 0.1, 0.0015 * (nP - i)); L.push(f);
  }
  for (let i = 0; i < nS; i++) {
    const t = i / (nS - 1), len = chord * 1.05, base = span * (0.05 + 0.47 * t);
    const f = feather(len, chord * 0.32, () => cols.sec); f.rotateZ(-Math.PI / 2 + 0.08 + t * 0.12); f.translate(base, chord * 0.12, 0.0015 * i); L.push(f);
  }
  for (let r = 0; r < 2; r++) L.push(T(fin([[0, chord * 0.28], [span * 0.55, chord * 0.26], [span * 0.95, chord * 0.12], [span * 0.9, -chord * (0.1 + r * 0.12)], [span * 0.5, -chord * (0.18 + r * 0.15)], [0, -chord * (0.2 + r * 0.15)]], (x, y) => (r ? cols.sec : cols.cov).map((v) => v * (0.9 + 0.1 * Math.sin(x * 160)))), 0, 0, 0.012 + r * 0.004));
  const g = mergeG(L);
  return withAttr(g, "aWing", (x) => clamp(Math.abs(x) / span, 0, 1) * (weight || 1));
}
function flyerGeo(kind) {
  const F = FLYER[kind], c = F.col, L = [];
  if (F.bat) {
    L.push(body([[-0.1, 0.01], [-0.07, 0.03], [0.0, 0.042], [0.05, 0.04], [0.085, 0.028], [0.1, 0.012]], { seg: 14, color: (z, a) => { const n = 0.8 + 0.4 * fbm2(z * 90, a * 5, 3, 2); return (Math.sin(a) > 0 ? c.back : c.belly).map((v) => v * n); } }));
    L.push(T(ball(0.028, c.face, 1, 0.85, 1.25, 14), 0, 0.012, 0.115));
    L.push(T(ball(0.012, [0.2, 0.12, 0.1], 1.2, 0.8, 1, 8), 0, 0.006, 0.14));                                        // the snout
    [-1, 1].forEach((s) => L.push(T(fin([[0, 0], [0.012, 0.045], [0.022, 0]], (x, y) => [0.22 + y, 0.15, 0.13]), s * 0.016, 0.03, 0.11, -0.2, s * 0.3, -s * 0.25)));   // ears
    eyes(L, 0.013, 0.02, 0.135, 0.004);
    [-1, 1].forEach((s) => {
      // the membrane stretched between the finger bones, with its scalloped trailing edge; the bones darker
      const fingers = [[0.34, 0.03], [0.3, -0.05], [0.22, -0.09], [0.12, -0.1]];
      const pts = [[0, 0.03], [0.1, 0.06], [0.2, 0.055], [0.34, 0.03], [0.3, -0.05], [0.26, -0.035], [0.22, -0.09], [0.17, -0.06], [0.12, -0.1], [0.06, -0.06], [0, -0.07]];
      const w = fin(pts.map(([x, y]) => [x * s, y]), (x, y) => { const X = Math.abs(x); let d = 9; fingers.forEach(([fx, fy]) => { const t = clamp((X * fx + y * fy) / (fx * fx + fy * fy), 0, 1); d = Math.min(d, Math.hypot(X - fx * t, y - fy * t)); }); d = Math.min(d, Math.abs(y - 0.03 - X * 0.08)); return d < 0.004 ? [0.1, 0.07, 0.06] : [0.28, 0.18, 0.15].map((v) => v * (0.85 + 0.3 * X)); });
      w.rotateX(Math.PI / 2); w.translate(s * 0.02, 0, 0.02); L.push(withAttr(w, "aWing", (x) => clamp((Math.abs(x) - 0.02) / 0.32, 0, 1)));
    });
    L.push(T(fin([[-0.05, 0], [0.05, 0], [0, -0.07]], [0.26, 0.17, 0.14]), 0, 0, -0.1, Math.PI / 2, 0, 0));   // tail membrane
  } else {
    const nl = F.longNeck ? 0.2 : 0;
    L.push(body([[-0.15, 0.01], [-0.12, 0.028], [-0.07, 0.046], [-0.01, 0.056], [0.05, 0.055], [0.09, 0.045], [0.115, 0.032], [0.13, 0.024]], { seg: 18, belly: 0.12, color: (z, a) => { const up = Math.sin(a); const base = up > 0.1 ? c.back : up > -0.3 ? c.back.map((v, i) => lerp(v, c.belly[i], 0.5)) : c.belly; return base.map((v) => v * (0.92 + 0.08 * Math.sin(z * 220 + a * 6))); } }));
    if (F.longNeck) L.push(limb([[0, 0.02, 0.12], [0, 0.04, 0.22], [0, 0.04, 0.32]], 0.024, 0.016, c.back, 10));
    L.push(T(ball(0.034, (x, y, z) => z > 0.02 && y < 0 ? (c.throat || c.face) : c.face, 1, 0.95, 1.15, 16), 0, 0.022, 0.15 + nl));
    const bl = F.longNeck ? 0.12 : kind === "macaws" ? 0.045 : 0.04;
    L.push(T(body([[0, 0.012], [bl * 0.5, 0.008], [bl, 0.001]], { seg: 8, w: 0.8, h: kind === "macaws" ? 1.6 : 1, color: () => kind === "macaws" ? [0.9, 0.88, 0.85] : [0.18, 0.15, 0.1] }), 0, 0.016, 0.178 + nl));
    eyeBall(L, 0.022, 0.032, 0.163 + nl, 0.0065, [0.25, 0.15, 0.05]);
    // tail: a fan of feathers
    const tl = F.longTail ? 0.34 : F.fork ? 0.15 : 0.1, nt = 8;
    for (let i = 0; i < nt; i++) { const t = i / (nt - 1) - 0.5, len = F.fork ? tl * (0.6 + Math.abs(t) * 0.9) : tl; const f = feather(len, 0.028, () => c.tail || c.back); f.rotateZ(-Math.PI / 2 + t * (F.longTail ? 0.25 : 0.5)); f.rotateX(Math.PI / 2); f.translate(t * 0.02, 0.008 + 0.001 * i, -0.13); L.push(f); }
    const span = F.longNeck ? 0.5 : 0.34, chord = F.longNeck ? 0.13 : 0.085;
    [-1, 1].forEach((s) => { const w = wing(span, chord, { prim: c.wing || c.back.map((v) => v * 0.85), sec: c.wing || c.back, cov: c.back, tip: c.tip }, 9, 8); if (s < 0) w.scale(-1, 1, 1); w.rotateX(Math.PI / 2); w.translate(s * 0.03, 0.03, 0.03); L.push(w); });
    // feet tucked under the tail
    [-1, 1].forEach((s) => L.push(T(limb([[0, 0, 0], [0, -0.01, -0.03]], 0.004, 0.003, [0.3, 0.22, 0.15], 3), s * 0.015, -0.035, -0.06)));
  }
  const g = mergeA(L, ["aWing"]); g.scale(F.size / 0.3, F.size / 0.3, F.size / 0.3); return g;
}
function flock(A, kind, q, ctx) {
  const F = FLYER[kind], R = rng(A.seedN + kind.length * 3), n = Math.max(1, Math.round(F.n * (q > 1 ? 1 : 0.6)));
  const sky = A.sky, low = F.low || kind === "crane";
  // bats and most birds fly in the room's air under the skylight; the kingfisher and the crane keep low over the ground under the glass
  const box = low ? { x0: A.hole.x0 + 0.3, x1: A.hole.x1 - 0.3, z0: A.hole.z0 + 0.3, z1: A.hole.z1 - 0.3, y0: (A.waterY || -0.9) + 0.18, y1: -0.12 } : { x0: sky.x0 + 0.4, x1: sky.x1 - 0.4, z0: sky.z0 + 0.4, z1: sky.z1 - 0.4, y0: sky.y - 1.9, y1: sky.y - 0.45 };
  if (kind === "crane") { box.y0 = -0.5; }
  const mat = creatureMat({ key: "fly", side: THREE.DoubleSide, uniforms: { uFlap: { value: F.flap }, uAmp: { value: F.amp } }, head: "uniform float uFlap, uAmp; attribute float aWing;",
    vert: `float ph2 = io.x * 5.3 + io.z * 2.1; float fa = sin(uTime * uFlap + ph2) * uAmp * (.6 + .4 * sin(uTime * .5 + ph2)); if (aWing > 0.) { float sx = sign(transformed.x); float r0 = abs(transformed.x); transformed.y += r0 * sin(fa) * .9; transformed.x = sx * r0 * cos(fa * .8); }` }, A.LU);
  const im = new THREE.InstancedMesh(flyerGeo(kind), mat, n); im.frustumCulled = false;
  const pick = () => [lerp(box.x0, box.x1, Math.random()), lerp(box.y0, box.y1, Math.random()), lerp(box.z0, box.z1, Math.random())];
  const birds = []; for (let i = 0; i < n; i++) { const p = pick(); birds.push({ p: V3(p[0], p[1], p[2]), h: R() * TAU, pitch: 0, bank: 0, v: F.speed * (0.8 + R() * 0.4), tgt: V3(...pick()), rest: 0 }); }
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(0, 0, 0, "YXZ"), S = new THREE.Vector3(1, 1, 1);
  return {
    obj: im,
    update(dt, t) {
      birds.forEach((b, i) => {
        if (b.p.distanceTo(b.tgt) < 0.5 || Math.random() < dt * 0.05) b.tgt.set(...pick());
        const dx = b.tgt.x - b.p.x, dz = b.tgt.z - b.p.z, dy = b.tgt.y - b.p.y;
        const want = Math.atan2(dx, dz), d = angWrap(want - b.h), turn = clamp(d, -F.agile * dt, F.agile * dt);
        b.h += turn; b.bank = lerp(b.bank, -turn / dt * 0.25, dt * 4);
        if (F.bat) { b.h += Math.sin(t * 7 + i * 3) * dt * 2.5; }                       // the jinking flight of bats
        b.pitch = lerp(b.pitch, clamp(-dy * 0.8, -0.5, 0.5), dt * 2);
        b.p.x += Math.sin(b.h) * b.v * dt; b.p.z += Math.cos(b.h) * b.v * dt; b.p.y += clamp(dy, -1, 1) * b.v * 0.35 * dt;
        b.p.x = clamp(b.p.x, box.x0, box.x1); b.p.z = clamp(b.p.z, box.z0, box.z1); b.p.y = clamp(b.p.y, box.y0, box.y1);
        E.set(b.pitch, b.h, clamp(b.bank, -0.9, 0.9)); Q.setFromEuler(E); M.compose(b.p, Q, S); im.setMatrixAt(i, M);
      });
      im.instanceMatrix.needsUpdate = true;
    }
  };
}

// ---------------------------------------------------------------- insects and fireflies over the ground under the glass
function insects(A, kind, q) {
  const bf = kind === "butterflies", n = Math.round((bf ? 8 : 5) * (q > 1 ? 1 : 0.6)), R = rng(A.seedN + 77), L = [];
  if (bf) {
    L.push(body([[-0.012, 0.001], [-0.006, 0.0025], [0.006, 0.0025], [0.01, 0.002]], { seg: 6, color: () => [0.1, 0.08, 0.06] }));
    [-1, 1].forEach((s) => { const fw = fin([[0, 0.004], [0.012, 0.022], [0.028, 0.02], [0.03, 0.006], [0.012, -0.002]].map(([x, y]) => [x * s, y]), (x, y) => [1, 1, 1]); fw.rotateX(-Math.PI / 2); L.push(withAttr(fw, "aWing", () => 1));
      const hw = fin([[0, -0.001], [0.016, -0.004], [0.02, -0.016], [0.008, -0.02]].map(([x, y]) => [x * s, y]), () => [0.85, 0.85, 0.85]); hw.rotateX(-Math.PI / 2); L.push(withAttr(hw, "aWing", () => 1)); });
    [-1, 1].forEach((s) => L.push(T(new THREE.CylinderGeometry(0.0004, 0.0004, 0.014, 3), s * 0.003, 0.004, 0.015, 1.1, 0, s * 0.3)));
  } else {
    L.push(body([[-0.035, 0.0015], [-0.01, 0.002], [0.004, 0.003], [0.01, 0.0035], [0.014, 0.001]], { seg: 6, color: (z) => z < 0 ? [0.1, 0.45, 0.55] : [0.12, 0.3, 0.4] }));
    L.push(T(ball(0.004, [0.1, 0.3, 0.35], 1.4, 1, 1, 8), 0, 0, 0.014));
    [-1, 1].forEach((s) => [0.004, -0.004].forEach((z) => { const w = fin([[0, 0], [0.028, 0.004], [0.03, -0.001], [0, -0.004]].map(([x, y]) => [x * s, y]), () => [0.82, 0.88, 0.9]); w.rotateX(-Math.PI / 2); w.translate(0, 0.002, z); L.push(withAttr(w, "aWing", () => 1)); }));
  }
  const geo = mergeA(L, ["aWing"]);
  const mat = creatureMat({ key: "bug" + kind, spec: 0.3, shine: 60, side: THREE.DoubleSide, uniforms: { uFlap: { value: bf ? 11 : 40 }, uAmp: { value: bf ? 1.1 : 0.4 } }, head: "uniform float uFlap, uAmp; attribute float aWing;",
    vert: `float ph2 = io.x * 9.3 + io.z * 4.1; float fa = sin(uTime * uFlap + ph2) * uAmp; if (aWing > 0.) { float sx = sign(transformed.x); float r0 = abs(transformed.x); transformed.y += r0 * sin(fa); transformed.x = sx * r0 * cos(fa); }` }, A.LU);
  const im = new THREE.InstancedMesh(geo, mat, n); im.frustumCulled = false;
  const cc = new THREE.Color(), cols = [[0.95, 0.55, 0.1], [0.98, 0.9, 0.3], [0.3, 0.5, 0.95], [0.95, 0.95, 0.92], [0.85, 0.3, 0.2]];
  const bugs = []; for (let i = 0; i < n; i++) { const [x, z] = A.toW(0.5 + R() * (A.L - 1), (R() - 0.5) * (A.W - 1)); bugs.push({ p: V3(x, -0.5, z), h: R() * TAU, v: bf ? 0.35 : 0.9, tgt: null, hover: 0 }); if (bf) { cc.setRGB(...cols[i % cols.length]); im.setColorAt(i, cc); } }
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(0, 0, 0, "YXZ"), S = new THREE.Vector3(bf ? 2.2 : 1.6, bf ? 2.2 : 1.6, bf ? 2.2 : 1.6);
  return {
    obj: im,
    update(dt, t) {
      bugs.forEach((b, i) => {
        if (!b.tgt || b.p.distanceTo(b.tgt) < 0.08) { const [x, z] = A.toW(0.4 + Math.random() * (A.L - 0.8), (Math.random() - 0.5) * (A.W - 0.8)); const g = Math.max(A.groundH(x, z), A.waterY != null ? A.waterY : -9); b.tgt = V3(x, Math.min(-0.12, g + 0.12 + Math.random() * 0.35), z); b.hover = bf ? 0 : Math.random() * 1.5; }
        if (b.hover > 0) { b.hover -= dt; }
        else {
          const want = Math.atan2(b.tgt.x - b.p.x, b.tgt.z - b.p.z); b.h += clamp(angWrap(want - b.h), -4 * dt, 4 * dt);
          b.p.x += Math.sin(b.h) * b.v * dt; b.p.z += Math.cos(b.h) * b.v * dt; b.p.y += clamp(b.tgt.y - b.p.y, -1, 1) * dt * 1.5;
          if (bf) b.p.y += Math.sin(t * 9 + i) * dt * 0.25;                          // the bobbing flight of butterflies
        }
        E.set(0, b.h, 0); Q.setFromEuler(E); M.compose(b.p, Q, S); im.setMatrixAt(i, M);
      });
      im.instanceMatrix.needsUpdate = true;
    }
  };
}
function fireflies(A, q) {
  const n = q > 1 ? 60 : 30, R = rng(A.seedN + 5), pos = new Float32Array(n * 3), sd = new Float32Array(n);
  for (let i = 0; i < n; i++) { const [x, z] = A.toW(0.3 + R() * (A.L - 0.6), (R() - 0.5) * (A.W - 0.6)); pos.set([x, A.groundH(x, z) + 0.1 + R() * 0.5, z], i * 3); sd[i] = R(); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("seed", new THREE.BufferAttribute(sd, 1));
  const m = new THREE.ShaderMaterial({ uniforms: { uTime: PLANT_U.uTime }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime; attribute float seed; varying float vA; void main(){ vec3 p = position; p.x += sin(uTime * .3 + seed * 30.) * .25; p.z += cos(uTime * .27 + seed * 17.) * .25; p.y += sin(uTime * .5 + seed * 9.) * .08;
      float blink = pow(max(0., sin(uTime * (.6 + seed * .5) + seed * 40.)), 12.); vA = blink; vec4 mv = modelViewMatrix * vec4(p, 1.); gl_PointSize = 26. / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - .5); gl_FragColor = vec4(.75, 1., .35, vA * smoothstep(.5, 0., d)); }` });
  const p = new THREE.Points(g, m); p.frustumCulled = false; return { obj: p, update() {} };
}

// ---------------------------------------------------------------- the registry
export function makeFauna(A, q, ctx) {
  const group = new THREE.Group(), live = [];
  const add = (x) => { if (x) { group.add(x.obj); live.push(x); } };
  for (const k of A.env.fauna || []) {
    if (FISH[k]) { if (A.waterY != null && A.biome && A.biome.water) add(fishSchool(A, k, q, ctx)); }
    else if (FLYER[k]) { add(flock(A, k, q, ctx)); if (k === "ravens" && A.biome && !A.biome.void && A.kind === "room") WALKERS.ravensGround(A, q, ctx).forEach(add); }
    else if (k === "butterflies" || k === "dragonflies") add(insects(A, k, q));
    else if (k === "fireflies") add(fireflies(A, q));
    else if (WALKERS[k]) WALKERS[k](A, q, ctx).forEach(add);
  }
  if (!live.length) return null;
  return { group, update(dt, t) { live.forEach((x) => x.update(dt, t)); } };
}
const WALKERS = {};
export const ZOO = { fishGeo: (k) => fishGeo(k), flyerGeo: (k) => flyerGeo(k) };
export { WALKERS, body, fin, ball, limb, cone, T, eyes, mergeA, withAttr, lerp, clamp, angWrap, V3, TAU };

// ---------------------------------------------------------------- skeletons for the walkers
// defs: { name: [parent or null, x, y, z] } in the creature's own space (forward +z, feet at y = 0)
function makeRig(defs) {
  const bones = {}, list = [], index = {}, at = {};
  for (const [name, [parent, x, y, z]] of Object.entries(defs)) {
    const b = new THREE.Bone(); b.name = name; at[name] = [x, y, z];
    if (parent) { const p = at[parent]; b.position.set(x - p[0], y - p[1], z - p[2]); bones[parent].add(b); } else b.position.set(x, y, z);
    bones[name] = b; index[name] = list.length; list.push(b);
  }
  return { bones, list, index, at, root: list[0] };
}
// parts: { g, b: bone } rigid, or { g, chain: [bones], axis } blended along an axis between the bones' rest positions
function skinGeo(parts, rig) {
  const out = [];
  parts.forEach((p) => {
    const g = p.g.index ? p.g.toNonIndexed() : p.g, P = g.attributes.position, n = P.count, si = new Float32Array(n * 4), sw = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      if (p.b) { si[i * 4] = rig.index[p.b]; sw[i * 4] = 1; continue; }
      const ax = p.axis === "y" ? 1 : p.axis === "x" ? 0 : 2, v = [P.getX(i), P.getY(i), P.getZ(i)][ax], ch = p.chain, cs = ch.map((b) => rig.at[b][ax]);
      const inc = cs[cs.length - 1] > cs[0];
      let k = 0; while (k < ch.length - 2 && (inc ? v > cs[k + 1] : v < cs[k + 1])) k++;
      const t = clamp((v - cs[k]) / ((cs[k + 1] - cs[k]) || 1), 0, 1);
      si[i * 4] = rig.index[ch[k]]; si[i * 4 + 1] = rig.index[ch[k + 1]]; sw[i * 4] = 1 - t; sw[i * 4 + 1] = t;
    }
    g.setAttribute("skinIndex", new THREE.BufferAttribute(new Uint16Array(si), 4)); g.setAttribute("skinWeight", new THREE.BufferAttribute(sw, 4));
    out.push(g);
  });
  let n = 0; out.forEach((g) => { if (!g.attributes.normal) g.computeVertexNormals(); n += g.attributes.position.count; });
  const G = new THREE.BufferGeometry(), A = (nm, sz, T2) => { const a = new T2(n * sz); let o = 0; out.forEach((g) => { const src = g.attributes[nm]; if (src) a.set(src.array, o * sz); else if (nm === "color") a.fill(1, o * sz, (o + g.attributes.position.count) * sz); o += g.attributes.position.count; }); return a; };
  G.setAttribute("position", new THREE.BufferAttribute(A("position", 3, Float32Array), 3)); G.setAttribute("normal", new THREE.BufferAttribute(A("normal", 3, Float32Array), 3));
  G.setAttribute("color", new THREE.BufferAttribute(A("color", 3, Float32Array), 3)); G.setAttribute("skinIndex", new THREE.BufferAttribute(A("skinIndex", 4, Uint16Array), 4)); G.setAttribute("skinWeight", new THREE.BufferAttribute(A("skinWeight", 4, Float32Array), 4));
  return G;
}
function skinned(parts, rig, mat) {
  const m = new THREE.SkinnedMesh(skinGeo(parts, rig), mat);
  m.add(rig.root); rig.root.updateMatrixWorld(true); m.bind(new THREE.Skeleton(rig.list)); m.frustumCulled = false;
  rig.rest = {}; rig.list.forEach((b) => { rig.rest[b.name] = b.position.clone(); });
  return m;
}
// where a land animal may stand in this area (not in water, not against the pit's walls)
function landAt(A, x, z, m) { const [s, t] = A.toL(x, z), mm = m || 0.25; if (s < mm || s > A.L - mm || Math.abs(t) > A.W / 2 - mm) return false; return A.waterY == null || A.groundH(x, z) > A.waterY + 0.02; }
function randLand(A, R, m) { for (let i = 0; i < 200; i++) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); if (landAt(A, x, z, m)) return [x, z]; } return null; }
// turn toward and walk to a point; returns true on arrival
function stepTo(c, tx, tz, speed, dt, turn) {
  const want = Math.atan2(tx - c.x, tz - c.z), d = angWrap(want - c.h); c.h += clamp(d, -(turn || 3) * dt, (turn || 3) * dt);
  const dist = Math.hypot(tx - c.x, tz - c.z); if (dist < 0.04) return true;
  const sp = speed * (Math.abs(d) > 1.2 ? 0.3 : 1); c.x += Math.sin(c.h) * sp * dt; c.z += Math.cos(c.h) * sp * dt; return false;
}

// ---------------------------------------------------------------- lizards: basking, bobbing, darting
function lizardParts(rig, c) {
  const P = [], pat = (z, a, x, y) => { const back = Math.sin(a) > 0.2; const spot = fbm2(z * 120, a * 3, 9, 2) > 0.62; const base = back ? c.back : c.belly; return (spot && back ? c.spot : base).map((v) => v * (0.9 + 0.1 * Math.sin(z * 900) * Math.sin(a * 20))); };
  P.push({ g: body([[-0.07, 0.009], [-0.04, 0.014], [0.0, 0.017], [0.05, 0.016], [0.075, 0.011], [0.085, 0.012], [0.1, 0.013], [0.118, 0.009], [0.13, 0.002]].map(([z, r]) => [z, r, 0.026]), { seg: 14, w: 1.25, h: 0.75, belly: 0.1, color: pat }), chain: ["tail0", "hips", "spine", "chest", "head"], axis: "z" });
  P.push({ g: limb([[0, 0.024, -0.07], [0, 0.02, -0.12], [0.004, 0.012, -0.17], [-0.004, 0.006, -0.22], [0, 0.004, -0.26]], 0.009, 0.0015, (x, y, z) => pat(z, 1, x, y), 14), chain: ["tail0", "tail1", "tail2", "tail3"], axis: "z" });
  const hd = [];
  hd.push(T(ball(0.016, (x, y, z) => y < -0.004 ? c.belly : c.back, 1.05, 0.62, 1.5, 16), 0, 0.03, 0.112));
  hd.push(T(limb([[-0.012, 0.024, 0.1], [0, 0.023, 0.132], [0.012, 0.024, 0.1]], 0.0015, 0.0015, c.spot, 8), 0, 0, 0));     // the line of the mouth
  eyes(hd, 0.011, 0.036, 0.113, 0.0038, [0.55, 0.38, 0.1]);
  [-1, 1].forEach((s) => hd.push(T(ball(0.0012, [0.05, 0.05, 0.05], 1, 1, 1, 5), s * 0.004, 0.032, 0.134)));
  hd.forEach((g) => P.push({ g, b: "head" }));
  [["FL", -1, 0.06], ["FR", 1, 0.06], ["BL", -1, -0.03], ["BR", 1, -0.03]].forEach(([n, s, z]) => {
    const up = n + "u", lo = n + "l";
    P.push({ g: limb([[s * 0.016, 0.024, z], [s * 0.042, 0.02, z + 0.004]], 0.0055, 0.0045, c.back, 4), b: up });
    P.push({ g: limb([[s * 0.042, 0.02, z + 0.004], [s * 0.048, 0.004, z + 0.012]], 0.0045, 0.0035, c.back, 4), b: lo });
    for (let t = 0; t < 5; t++) { const a = (t - 2) * 0.45 + (s > 0 ? 0 : Math.PI) * 0; P.push({ g: limb([[s * 0.048, 0.003, z + 0.012], [s * 0.048 + Math.sin(a) * 0.012 * s, 0.001, z + 0.012 + Math.cos(a) * 0.012]], 0.0012, 0.0008, c.back, 2), b: lo }); }
  });
  return P;
}
function lizardRig() {
  return makeRig({ hips: [null, 0, 0.024, -0.02], spine: ["hips", 0, 0.026, 0.03], chest: ["spine", 0, 0.027, 0.07], head: ["chest", 0, 0.03, 0.1],
    tail0: ["hips", 0, 0.024, -0.07], tail1: ["tail0", 0, 0.02, -0.12], tail2: ["tail1", 0, 0.012, -0.17], tail3: ["tail2", 0, 0.006, -0.22],
    FLu: ["chest", -0.016, 0.024, 0.06], FLl: ["FLu", -0.042, 0.02, 0.064], FRu: ["chest", 0.016, 0.024, 0.06], FRl: ["FRu", 0.042, 0.02, 0.064],
    BLu: ["hips", -0.016, 0.024, -0.03], BLl: ["BLu", -0.042, 0.02, -0.026], BRu: ["hips", 0.016, 0.024, -0.03], BRl: ["BRu", 0.042, 0.02, -0.026] });
}
WALKERS.lizards = (A, q, ctx) => {
  const n = A.kind === "room" ? 3 : 1, out = [], R = rng(A.seedN + 3);
  const cols = A.env.ground === "redearth" ? { back: [0.62, 0.34, 0.2], belly: [0.82, 0.62, 0.45], spot: [0.28, 0.14, 0.08] } : A.env.ground === "nile" ? { back: [0.55, 0.5, 0.36], belly: [0.85, 0.8, 0.66], spot: [0.2, 0.18, 0.12] } : { back: [0.5, 0.46, 0.34], belly: [0.82, 0.78, 0.64], spot: [0.22, 0.2, 0.14] };
  for (let i = 0; i < n; i++) {
    const rig = lizardRig(), mesh = skinned(lizardParts(rig, cols), rig, creatureMat({ key: "liz", spec: 0.25, shine: 50 }, A.LU));
    const p = randLand(A, R, 0.3); if (!p) break;
    const L = { x: p[0], z: p[1], h: Math.random() * TAU, st: "bask", t: Math.random() * 3, ph: 0, tgt: null, alive: true, scale: 1.4 + Math.random() * 0.5 };
    mesh.scale.setScalar(L.scale);
    const B = rig.bones;
    const pose = (dt, time) => {
      const moving = L.st === "dart" || L.st === "walk";
      if (moving) L.ph += dt * (L.st === "dart" ? 26 : 10);
      const w = moving ? Math.sin(L.ph) : 0;
      B.spine.rotation.y = w * 0.25; B.chest.rotation.y = -w * 0.18; B.hips.rotation.y = -w * 0.12;
      B.tail0.rotation.y = -w * 0.3 + Math.sin(time * 0.6) * 0.05; B.tail1.rotation.y = -w * 0.25; B.tail2.rotation.y = w * 0.2;
      [["FL", 0], ["BR", 0], ["FR", Math.PI], ["BL", Math.PI]].forEach(([n, o]) => { const s = n[1] === "L" ? -1 : 1, ph = L.ph + o; B[n + "u"].rotation.y = moving ? Math.sin(ph) * 0.6 * s : 0; B[n + "u"].rotation.z = moving ? Math.max(0, Math.cos(ph)) * 0.35 * s : 0; });
      // basking: push-ups, the head raised and lowered
      const bob = L.st === "bask" ? Math.max(0, Math.sin(time * 3 + i)) * (Math.sin(time * 0.4 + i) > 0.6 ? 1 : 0) : 0;
      B.hips.position.y = rig.rest.hips.y + bob * 0.006; B.head.rotation.x = -bob * 0.3;
    };
    out.push({
      obj: mesh, liz: L,
      update(dt, time) {
        L.t -= dt;
        if (L.st === "bask" && L.t <= 0) { L.st = Math.random() < 0.6 ? "walk" : "dart"; const p2 = randLand(A, R, 0.3); L.tgt = p2; L.t = 5; }
        if ((L.st === "walk" || L.st === "dart") && L.tgt) { if (stepTo(L, L.tgt[0], L.tgt[1], L.st === "dart" ? 0.9 : 0.12, dt, 6) || L.t < 0) { L.st = "bask"; L.t = 3 + Math.random() * 6; } }
        if (L.st === "flee" && L.tgt) { if (stepTo(L, L.tgt[0], L.tgt[1], 1.3, dt, 9)) { L.st = "bask"; L.t = 4; } }
        if (!landAt(A, L.x, L.z, 0.2)) { const p2 = randLand(A, R, 0.3); if (p2) L.tgt = p2; }
        mesh.visible = L.alive;
        mesh.position.set(L.x, A.groundH(L.x, L.z) + 0.002, L.z); mesh.rotation.y = L.h;
        pose(dt, time);
      },
      flee(fx, fz) { const a = Math.atan2(L.x - fx, L.z - fz); const tx = L.x + Math.sin(a) * 1.2, tz = L.z + Math.cos(a) * 1.2; L.tgt = landAt(A, tx, tz, 0.3) ? [tx, tz] : randLand(A, R, 0.3); L.st = "flee"; }
    });
  }
  (ctx.prey || (ctx.prey = new Map())).set(A, out);
  return out;
};

// ---------------------------------------------------------------- cats: patrolling, stalking lizards, pouncing, sitting to wash
function catRig() {
  return makeRig({
    hips: [null, 0, 0.22, -0.13], spine: ["hips", 0, 0.225, -0.01], chest: ["spine", 0, 0.225, 0.11], neck: ["chest", 0, 0.25, 0.17], head: ["neck", 0, 0.29, 0.22],
    tail0: ["hips", 0, 0.23, -0.2], tail1: ["tail0", 0, 0.2, -0.27], tail2: ["tail1", 0, 0.17, -0.34], tail3: ["tail2", 0, 0.17, -0.41], tail4: ["tail3", 0, 0.2, -0.47],
    FLu: ["chest", -0.045, 0.2, 0.13], FLl: ["FLu", -0.045, 0.11, 0.12], FLp: ["FLl", -0.045, 0.02, 0.13],
    FRu: ["chest", 0.045, 0.2, 0.13], FRl: ["FRu", 0.045, 0.11, 0.12], FRp: ["FRl", 0.045, 0.02, 0.13],
    BLu: ["hips", -0.048, 0.2, -0.13], BLl: ["BLu", -0.048, 0.11, -0.09], BLp: ["BLl", -0.048, 0.05, -0.16],
    BRu: ["hips", 0.048, 0.2, -0.13], BRl: ["BRu", 0.048, 0.11, -0.09], BRp: ["BRl", 0.048, 0.05, -0.16]
  });
}
function catParts(rig, c) {
  // a slender, spotted, sandy cat with a banded tail and dark-ringed tail tip (after cats in Egyptian art; atmosphere, not a breed)
  const coat = (x, y, z, band) => { const sp = fbm2(x * 60 + z * 30, y * 60 + z * 45, 17, 2) > 0.64; const stripe = band && Math.sin(z * 90) > 0.6; const under = y < 0.19 && Math.abs(x) < 0.04; const b = under ? c.belly : c.fur; const k = 0.9 + 0.12 * fbm2(x * 200, z * 200 + y * 150, 3, 2); return (sp || stripe ? c.mark : b).map((v) => v * k); };
  const P = [];
  P.push({ g: body([[-0.2, 0.03], [-0.17, 0.052], [-0.1, 0.064], [-0.02, 0.066], [0.06, 0.068], [0.12, 0.066], [0.17, 0.05], [0.2, 0.03]].map(([z, r]) => [z, r, 0.225]), { seg: 22, w: 0.82, h: 1.05, belly: 0.1, color: (z, a, x, y) => coat(x, y, z) }), chain: ["hips", "spine", "chest", "neck"], axis: "z" });
  P.push({ g: limb([[0, 0.235, 0.15], [0, 0.26, 0.19], [0, 0.28, 0.215]], 0.036, 0.03, (x, y, z) => coat(x, y, z), 6), chain: ["chest", "neck", "head"], axis: "z" });
  // the head: skull, cheeks, muzzle, nose, ears with pink insides, green-gold eyes with slit pupils, whiskers
  const H = [];
  H.push(T(ball(0.043, (x, y, z) => { const tabbyM = y > 0.02 && Math.abs(Math.sin(x * 160)) > 0.8 && z > -0.01; return tabbyM ? c.mark : (y < -0.01 ? c.belly : c.fur); }, 1.05, 0.92, 1.0, 20), 0, 0.3, 0.23));
  H.push(T(ball(0.025, (x, y) => y < 0 ? c.belly : c.fur, 1.25, 0.8, 1, 14), 0, 0.285, 0.265));
  H.push(T(ball(0.008, [0.55, 0.3, 0.3], 1.3, 0.8, 0.8, 8), 0, 0.293, 0.288));
  [-1, 1].forEach((s) => {
    const ear = cone(0.022, 0.05, c.fur, 8); ear.scale(1, 1, 0.45); L2(ear, s * 0.027, 0.345, 0.225, -0.15, 0, s * -0.35); H.push(ear);
    const inn = cone(0.014, 0.034, [0.8, 0.55, 0.5], 8); inn.scale(1, 1, 0.3); L2(inn, s * 0.027, 0.342, 0.232, -0.15, 0, s * -0.35); H.push(inn);
    const e = ball(0.0115, (x, y, z) => Math.abs(x - 0) < 0.0025 * (z > 0 ? 1 : 1) && z > 0.006 ? [0.02, 0.02, 0.02] : z > 0.006 ? [0.55, 0.62, 0.2] : [0.9, 0.88, 0.8], 1, 1, 1, 14); e.rotateY(s * 0.35); L2(e, s * 0.02, 0.306, 0.262, 0, 0, 0); H.push(e);
    H.push(T(ball(0.003, [1, 1, 1], 1, 1, 1, 5), s * 0.022, 0.31, 0.273));
    for (let w = 0; w < 3; w++) H.push(limb([[s * 0.012, 0.283 - w * 0.004, 0.282], [s * 0.05, 0.285 - w * 0.012, 0.285], [s * 0.075, 0.28 - w * 0.02, 0.278]], 0.0009, 0.0004, [0.92, 0.9, 0.85], 4));
  });
  H.forEach((g) => P.push({ g, b: "head" }));
  // tail: banded, with a dark tip
  P.push({ g: limb([[0, 0.23, -0.2], [0, 0.2, -0.27], [0, 0.17, -0.34], [0, 0.17, -0.41], [0, 0.2, -0.47]], 0.02, 0.012, (x, y, z) => z < -0.44 ? c.mark : coat(x, y, z, true), 16), chain: ["tail0", "tail1", "tail2", "tail3", "tail4"], axis: "z" });
  // legs: thigh, shank, paw with toes; banded on the upper legs
  [["FL", -1, 0.13, 1], ["FR", 1, 0.13, 1], ["BL", -1, -0.13, 0], ["BR", 1, -0.13, 0]].forEach(([n, s, z, fr]) => {
    const [ux, uy, uz] = rig.at[n + "u"], [lx, ly, lz] = rig.at[n + "l"], [px, py, pz] = rig.at[n + "p"];
    P.push({ g: limb([[ux, uy + 0.02, uz], [lx, ly, lz]], fr ? 0.026 : 0.034, 0.018, (x, y, zz) => coat(x, y, zz, true), 6), b: n + "u" });
    P.push({ g: limb([[lx, ly, lz], [px, py, pz]], 0.016, 0.013, (x, y, zz) => coat(x, y, zz, true), 6), b: n + "l" });
    P.push({ g: T(ball(fr ? 0.019 : 0.021, (x, y, zz) => coat(x + lx, y + ly, zz + lz, true), 1, 1, 1, 10), lx, ly, lz), b: n + "l" });
    P.push({ g: T(ball(0.014, c.fur, 1, 1, 1, 8), px, py, pz), b: n + "p" });
    P.push({ g: T(ball(0.017, c.fur, 1, 0.55, 1.3, 10), px, 0.012, pz + 0.012), b: n + "p" });
    for (let t = 0; t < 4; t++) P.push({ g: T(ball(0.006, c.fur, 1, 0.8, 1, 6), px + (t - 1.5) * 0.008, 0.008, pz + 0.03), b: n + "p" });
  });
  return P;
}
function L2(g, x, y, z, rx, ry, rz) { g.rotateX(rx || 0); g.rotateY(ry || 0); g.rotateZ(rz || 0); g.translate(x, y, z); return g; }
WALKERS.cats = (A, q, ctx) => {
  const out = [], R = rng(A.seedN + 11), n = A.kind === "room" ? 2 : 1;
  const cols = { fur: [0.72, 0.58, 0.38], belly: [0.9, 0.82, 0.66], mark: [0.22, 0.16, 0.1] };
  for (let i = 0; i < n; i++) {
    const rig = catRig(), mesh = skinned(catParts(rig, cols), rig, creatureMat({ key: "cat", spec: 0.05, shine: 12 }, A.LU)), B = rig.bones, rest = rig.rest;
    const p = randLand(A, R, 0.45); if (!p) break;
    const C = { x: p[0], z: p[1], h: R() * TAU, st: "walk", t: 2, ph: 0, tgt: randLand(A, R, 0.45), prey: null, jump: 0, jx: 0, jz: 0, low: 0 };
    const legs = (ph, amp, lift) => {
      // the walk: left hind, left fore, right hind, right fore, a quarter-cycle apart
      [["BL", 0], ["FL", 0.25], ["BR", 0.5], ["FR", 0.75]].forEach(([nm, o]) => {
        const a = (ph + o * TAU), sw = Math.sin(a), up = Math.max(0, Math.cos(a)), fr = nm[0] === "F";
        B[nm + "u"].rotation.x = -sw * amp; B[nm + "l"].rotation.x = fr ? up * lift : -up * lift; B[nm + "p"].rotation.x = fr ? -up * lift * 0.6 : up * lift * 0.6;
      });
    };
    const crouch = (k) => {                     // lower the body by bending every leg
      ["FL", "FR"].forEach((nm) => { B[nm + "u"].rotation.x += -0.5 * k; B[nm + "l"].rotation.x += 1.0 * k; B[nm + "p"].rotation.x += -0.5 * k; });
      ["BL", "BR"].forEach((nm) => { B[nm + "u"].rotation.x += 0.6 * k; B[nm + "l"].rotation.x += -1.1 * k; B[nm + "p"].rotation.x += 0.5 * k; });
      B.hips.position.y = rest.hips.y - 0.07 * k;
    };
    const pose = (dt, time) => {
      const st = C.st;
      if (st === "walk" || st === "stalk") C.ph += dt * (st === "stalk" ? 3.2 : 7.5);
      legs(C.ph, st === "walk" ? 0.42 : st === "stalk" ? 0.3 : 0, st === "walk" ? 0.7 : 0.45);
      C.low = lerp(C.low, st === "stalk" ? 0.75 : st === "wiggle" ? 0.95 : st === "sit" || st === "wash" ? 0 : 0, dt * 4);
      crouch(C.low);
      // head and tail
      B.head.rotation.set(st === "stalk" || st === "wiggle" ? 0.25 : st === "wash" ? 0.9 + Math.sin(time * 6) * 0.15 : Math.sin(time * 0.7) * 0.1, st === "walk" ? Math.sin(time * 0.5) * 0.3 : 0, 0);
      B.neck.rotation.x = st === "stalk" || st === "wiggle" ? 0.35 : 0;
      const tw = st === "stalk" || st === "wiggle" ? Math.sin(time * 9) * 0.35 : Math.sin(time * 1.3 + i) * 0.2;
      B.tail0.rotation.set(st === "stalk" ? 0.4 : -0.2, 0, 0); B.tail1.rotation.set(0.1, tw * 0.3, 0); B.tail2.rotation.set(-0.2, tw * 0.6, 0); B.tail3.rotation.set(-0.3, tw, 0); B.tail4.rotation.set(-0.3, tw * 1.3, 0);
      B.hips.rotation.z = st === "wiggle" ? Math.sin(time * 14) * 0.12 : 0;
      if (st === "sit" || st === "wash") {
        // sitting: the hindquarters down, the forelegs straight, the body tilted up
        B.hips.position.y = rest.hips.y - 0.13; B.hips.rotation.x = -0.75; B.chest.rotation.x = 0.25; B.head.rotation.x += 0.3;
        ["BL", "BR"].forEach((nm) => { B[nm + "u"].rotation.x = -1.3; B[nm + "l"].rotation.x = 2.2; B[nm + "p"].rotation.x = -1.2; });
        ["FL", "FR"].forEach((nm) => { B[nm + "u"].rotation.x = 0.55; B[nm + "l"].rotation.x = 0; B[nm + "p"].rotation.x = 0.2; });
        if (st === "wash") { B.FRu.rotation.x = -0.6; B.FRl.rotation.x = 1.6; }
        B.tail0.rotation.set(0.6, 0.6, 0); B.tail1.rotation.set(0.2, 0.7, 0); B.tail2.rotation.set(0, 0.7, 0);
      } else { B.hips.rotation.x = 0; B.chest.rotation.x = 0; }
      if (st === "pounce") {
        ["FL", "FR"].forEach((nm) => { B[nm + "u"].rotation.x = -1.2; B[nm + "l"].rotation.x = 0.3; });
        ["BL", "BR"].forEach((nm) => { B[nm + "u"].rotation.x = 0.9; B[nm + "l"].rotation.x = 0.4; });
        B.hips.position.y = rest.hips.y;
      }
    };
    out.push({
      obj: mesh, force(st) { C.st = st; C.t = 99; C.low = st === "stalk" ? 0.75 : st === "wiggle" ? 0.95 : 0; C.ph = 1; C.prey = { liz: { x: C.x, z: C.z + 1, st: "bask" }, flee() {} }; C.tgt = [C.x, C.z + 5]; },
      update(dt, time) {
        C.t -= dt;
        const prey = (ctx.prey && ctx.prey.get(A) || []).filter((l) => l.liz.alive && l.liz.st === "bask");
        if (C.st === "walk") {
          if (!C.tgt || stepTo(C, C.tgt[0], C.tgt[1], 0.35, dt, 2.5)) C.tgt = randLand(A, R, 0.45);
          if (C.t <= 0) { const l = prey[Math.floor(Math.random() * prey.length)]; if (l && Math.random() < 0.7) { C.prey = l; C.st = "stalk"; C.t = 14; } else { C.st = Math.random() < 0.5 ? "sit" : "wash"; C.t = 4 + Math.random() * 6; } }
        } else if (C.st === "stalk") {
          const L = C.prey.liz, d = Math.hypot(L.x - C.x, L.z - C.z);
          stepTo(C, L.x, L.z, 0.1, dt, 2);
          if (d < 0.55) { C.st = "wiggle"; C.t = 1 + Math.random(); }
          if (C.t <= 0 || L.st !== "bask") { C.st = "walk"; C.t = 5; }
        } else if (C.st === "wiggle") {
          const L = C.prey.liz; C.h += clamp(angWrap(Math.atan2(L.x - C.x, L.z - C.z) - C.h), -dt, dt);
          if (C.t <= 0) { C.st = "pounce"; C.jump = 0; C.jx = L.x; C.jz = L.z; C.fx = C.x; C.fz = C.z; if (Math.random() < 0.7) C.prey.flee(C.x, C.z); }
        } else if (C.st === "pounce") {
          C.jump += dt / 0.45; const u = Math.min(1, C.jump);
          C.x = lerp(C.fx, C.jx, u); C.z = lerp(C.fz, C.jz, u);
          if (u >= 1) { const L = C.prey.liz; if (L.st !== "flee" && Math.hypot(L.x - C.x, L.z - C.z) < 0.15) { L.alive = false; setTimeout(() => { const p2 = randLand(A, R, 0.3); if (p2) { L.x = p2[0]; L.z = p2[1]; } L.alive = true; L.st = "bask"; L.t = 5; }, 12000); }
            C.st = "sit"; C.t = 3 + Math.random() * 3; }
        } else if (C.t <= 0) { C.st = "walk"; C.t = 5 + Math.random() * 6; C.tgt = randLand(A, R, 0.45); }
        if (!landAt(A, C.x, C.z, 0.3) && C.st !== "pounce") { C.tgt = randLand(A, R, 0.45); C.st = "walk"; }
        const hop = C.st === "pounce" ? Math.sin(Math.min(1, C.jump) * Math.PI) * 0.16 : 0;
        mesh.position.set(C.x, A.groundH(C.x, C.z) + hop, C.z); mesh.rotation.y = C.h;
        pose(dt, time);
      }
    });
  }
  return out;
};

// ---------------------------------------------------------------- wading birds: the sacred ibis of the Nile, the heron, the crane
const WADER = {
  ibis: { h: 0.62, body: [0.95, 0.95, 0.93], back: [0.92, 0.92, 0.9], neck: [0.08, 0.08, 0.08], head: [0.08, 0.08, 0.08], plume: [0.1, 0.1, 0.14], bill: [0.1, 0.1, 0.1], leg: [0.12, 0.12, 0.12], curve: 1, billLen: 0.16 },
  heron: { h: 0.82, body: [0.6, 0.62, 0.66], back: [0.52, 0.55, 0.6], neck: [0.9, 0.9, 0.9], head: [0.92, 0.92, 0.92], plume: [0.3, 0.32, 0.36], bill: [0.85, 0.7, 0.2], leg: [0.55, 0.5, 0.3], crest: [0.1, 0.1, 0.1], billLen: 0.12, streak: 1 },
  crane: { h: 0.9, body: [0.95, 0.95, 0.94], back: [0.95, 0.95, 0.94], neck: [0.1, 0.1, 0.1], head: [0.12, 0.12, 0.12], plume: [0.08, 0.08, 0.08], bill: [0.55, 0.6, 0.45], leg: [0.12, 0.12, 0.12], crown: [0.85, 0.1, 0.1], billLen: 0.13 }
};
function waderRig() {
  return makeRig({ body: [null, 0, 0.42, 0], neck0: ["body", 0, 0.46, 0.1], neck1: ["neck0", 0, 0.55, 0.13], neck2: ["neck1", 0, 0.62, 0.1], head: ["neck2", 0, 0.66, 0.13],
    Lt: ["body", -0.035, 0.38, 0.0], Ls: ["Lt", -0.035, 0.23, 0.02], Lf: ["Ls", -0.035, 0.02, 0.0], Rt: ["body", 0.035, 0.38, 0.0], Rs: ["Rt", 0.035, 0.23, 0.02], Rf: ["Rs", 0.035, 0.02, 0.0] });
}
function waderParts(rig, c) {
  const P = [];
  P.push({ g: body([[-0.16, 0.012], [-0.12, 0.045], [-0.05, 0.07], [0.03, 0.072], [0.09, 0.055], [0.12, 0.03]].map(([z, r]) => [z, r, 0.42]), { seg: 18, w: 0.85, h: 0.9, belly: 0.1, color: (z, a) => Math.sin(a) > 0 ? c.back : c.body }), b: "body" });
  // folded wings: long feathers laid along each side, the tertials drooping over the tail
  [-1, 1].forEach((s) => { for (let k = 0; k < 7; k++) { const f = feather(0.2 + k * 0.012, 0.05, (u) => (k > 4 ? c.plume : c.back).map((v) => v * (0.9 + u * 0.1))); f.rotateZ(Math.PI); f.rotateY(-Math.PI / 2 + s * 0.08); f.translate(s * (0.055 - k * 0.002), 0.45 - k * 0.006, 0.08 - k * 0.012); P.push({ g: f, b: "body" }); } });
  for (let k = 0; k < 7; k++) { const f = feather(0.1, 0.03, () => c.plume); f.rotateZ(Math.PI + (k - 3) * 0.08); f.rotateX(Math.PI / 2); f.translate((k - 3) * 0.006, 0.42, -0.13); P.push({ g: f, b: "body" }); }
  P.push({ g: limb([[0, 0.44, 0.1], [0, 0.5, 0.14], [0, 0.55, 0.13], [0, 0.6, 0.1], [0, 0.65, 0.13]], 0.026, 0.017, (x, y, z) => c.streak && z > 0.12 && Math.abs(x) < 0.004 ? [0.1, 0.1, 0.1] : c.neck, 14), chain: ["neck0", "neck1", "neck2", "head"], axis: "y" });
  const H = [];
  H.push(T(ball(0.025, (x, y, z) => c.crown && y > 0.012 ? c.crown : c.head, 1, 0.95, 1.25, 14), 0, 0.665, 0.14));
  if (c.curve) H.push(limb([[0, 0.66, 0.16], [0, 0.65, 0.22], [0, 0.61, 0.28], [0, 0.56, 0.3]], 0.008, 0.002, c.bill, 10));
  else { const b2 = body([[0, 0.009], [c.billLen * 0.6, 0.006], [c.billLen, 0.0005]], { seg: 8, w: 0.8, h: 1.1, color: () => c.bill }); H.push(T(b2, 0, 0.662, 0.16)); }
  if (c.crest) H.push(limb([[0, 0.675, 0.13], [0, 0.68, 0.08], [0, 0.66, 0.02]], 0.004, 0.001, c.crest, 6));
  eyeBall(H, 0.018, 0.672, 0.15, 0.005, [0.85, 0.7, 0.2]);
  H.forEach((g) => P.push({ g, b: "head" }));
  [["L", -1], ["R", 1]].forEach(([n, s]) => {
    const [tx, ty, tz] = rig.at[n + "t"], [sx, sy, sz] = rig.at[n + "s"], [fx, fy, fz] = rig.at[n + "f"];
    P.push({ g: limb([[tx, ty, tz], [sx, sy, sz]], 0.012, 0.007, c.leg, 5), b: n + "t" });
    P.push({ g: limb([[sx, sy, sz], [fx, fy, fz]], 0.0065, 0.005, c.leg, 5), b: n + "s" });
    P.push({ g: T(ball(0.009, c.leg, 1, 1, 1, 8), sx, sy, sz), b: n + "s" });
    [-0.5, 0, 0.5, Math.PI].forEach((a) => P.push({ g: limb([[fx, 0.004, fz], [fx + Math.sin(a) * 0.06, 0.002, fz + Math.cos(a) * (a > 3 ? 0.03 : 0.06)]], 0.003, 0.002, c.leg, 3), b: n + "f" }));
  });
  return P;
}
function wader(kind) {
  return (A, q, ctx) => {
    const c = WADER[kind], R = rng(A.seedN + kind.length), rig = waderRig(), B = rig.bones;
    const mesh = skinned(waderParts(rig, c), rig, creatureMat({ key: "wader", spec: 0.05 }, A.LU));
    const sc = c.h / 0.7; mesh.scale.setScalar(sc * 0.8);
    // where to wade: shallow water or the bank beside it
    const good = (x, z) => { const [s, t] = A.toL(x, z); if (s < 0.4 || s > A.L - 0.4 || Math.abs(t) > A.W / 2 - 0.4) return false; const g = A.groundH(x, z); return A.waterY == null ? true : g > A.waterY - 0.22 && g < A.waterY + 0.12; };
    const pick = () => { for (let i = 0; i < 300; i++) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); if (good(x, z)) return [x, z]; } return null; };
    const p = pick(); if (!p) return [];
    const W = { x: p[0], z: p[1], h: R() * TAU, st: "stand", t: 2, ph: 0, strike: -1, tgt: null };
    return [{
      obj: mesh,
      update(dt, time) {
        W.t -= dt;
        if (W.st === "stand" && W.t <= 0) { const r = Math.random(); if (r < 0.45) { W.st = "walk"; W.tgt = pick(); W.t = 8; } else if (r < 0.8) { W.st = "strike"; W.strike = 0; } else { W.st = "preen"; W.t = 3; } }
        if (W.st === "walk") { W.ph += dt * 3.2; if (!W.tgt || stepTo(W, W.tgt[0], W.tgt[1], 0.12, dt, 1.2) || W.t <= 0) { W.st = "stand"; W.t = 2 + Math.random() * 4; } }
        if (W.st === "preen" && W.t <= 0) { W.st = "stand"; W.t = 2; }
        // legs: a slow, high-stepping walk
        const lift = W.st === "walk" ? 1 : 0;
        [["L", 0], ["R", Math.PI]].forEach(([n, o]) => { const a = W.ph + o; B[n + "t"].rotation.x = -Math.sin(a) * 0.35 * lift; B[n + "s"].rotation.x = Math.max(0, Math.cos(a)) * 0.9 * lift; B[n + "f"].rotation.x = -Math.max(0, Math.cos(a)) * 0.5 * lift; });
        B.body.rotation.x = 0.08 + Math.sin(W.ph * 2) * 0.02 * lift;
        // the neck: resting S-curve, head-bob while walking, a lightning strike at the water, preening
        let n0 = 0.2, n1 = -0.5, n2 = 0.35, hd = 0;
        if (W.st === "walk") { n1 = -0.5 + Math.sin(W.ph * 2) * 0.1; }
        if (W.st === "strike") {
          W.strike += dt; const u = W.strike;
          const k = u < 1.2 ? u / 1.2 * 0.6 : u < 1.35 ? 0.6 + (u - 1.2) / 0.15 * 0.4 : u < 1.8 ? 1 : Math.max(0, 1 - (u - 1.8) / 0.8);   // aim slowly, strike fast, hold, recover
          n0 = lerp(0.2, 1.0, k); n1 = lerp(-0.5, 0.35, k); n2 = lerp(0.35, 0.5, k); hd = lerp(0, 0.4, k);
          if (u > 1.35 && !W.splashed && A.waterY != null) { W.splashed = true; const hx = W.x + Math.sin(W.h) * 0.3 * mesh.scale.x, hz = W.z + Math.cos(W.h) * 0.3 * mesh.scale.x; if (A.groundH(hx, hz) < A.waterY) ctx.splash(A, hx, hz, 0.6); }
          if (u > 2.6) { W.st = "stand"; W.t = 3 + Math.random() * 4; W.splashed = false; }
        }
        if (W.st === "preen") { n0 = -0.2; n1 = 0.9; n2 = 0.8; hd = 0.6 + Math.sin(time * 5) * 0.2; B.neck0.rotation.y = 1.4; } else B.neck0.rotation.y = 0;
        B.neck0.rotation.x = n0; B.neck1.rotation.x = n1; B.neck2.rotation.x = n2; B.head.rotation.x = hd;
        mesh.position.set(W.x, A.groundH(W.x, W.z), W.z); mesh.rotation.y = W.h;
      }
    }];
  };
}
WALKERS.ibis = wader("ibis"); WALKERS.heron = wader("heron"); WALKERS.crane = wader("crane");

// ---------------------------------------------------------------- crabs on the shore
function crabRig() {
  const d = { body: [null, 0, 0.035, 0], Lc: ["body", -0.035, 0.035, 0.035], Lc2: ["Lc", -0.05, 0.04, 0.06], Rc: ["body", 0.035, 0.035, 0.035], Rc2: ["Rc", 0.05, 0.04, 0.06] };
  for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => { const n = (s < 0 ? "L" : "R") + k; d[n] = ["body", s * 0.04, 0.03, 0.02 - k * 0.018]; d[n + "b"] = [n, s * 0.08, 0.04, 0.02 - k * 0.022]; });
  return makeRig(d);
}
function crabParts(rig, c) {
  const P = [];
  P.push({ g: T(ball(0.05, (x, y, z) => { const k = 0.85 + 0.25 * fbm2(x * 80, z * 80, 4, 2); return (y > 0.01 ? c.shell : c.under).map((v) => v * k); }, 1, 0.42, 0.78, 20), 0, 0.035, 0), b: "body" });
  [-1, 1].forEach((s) => { P.push({ g: T(limb([[0, 0, 0], [0, 0.012, 0.004]], 0.002, 0.002, c.under, 3), s * 0.012, 0.05, 0.035), b: "body" }); P.push({ g: T(ball(0.004, [0.05, 0.05, 0.05], 1, 1, 1, 6), s * 0.012, 0.063, 0.04), b: "body" }); });
  for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => { const n = (s < 0 ? "L" : "R") + k, a = rig.at[n], b = rig.at[n + "b"];
    P.push({ g: limb([a, b], 0.006, 0.005, c.shell, 3), b: n }); P.push({ g: limb([b, [b[0] + s * 0.025, 0.002, b[2] - 0.004]], 0.005, 0.0015, c.shell, 3), b: n + "b" }); });
  [-1, 1].forEach((s) => { const n = s < 0 ? "L" : "R", a = rig.at[n + "c"], b = rig.at[n + "c2"];
    P.push({ g: limb([a, b], 0.008, 0.007, c.shell, 4), b: n + "c" });
    P.push({ g: T(ball(0.02, c.claw, 1, 0.7, 1.6, 12), b[0], b[1], b[2] + 0.018), b: n + "c2" });
    P.push({ g: T(cone(0.006, 0.03, c.tip, 6), b[0] + s * 0.004, b[1] - 0.006, b[2] + 0.045, Math.PI / 2, 0, 0), b: n + "c2" }); });
  return P;
}
WALKERS.crabs = (A, q) => {
  const out = [], n = A.kind === "room" ? 4 : 2, R = rng(A.seedN + 21), c = { shell: [0.62, 0.3, 0.16], under: [0.86, 0.72, 0.56], claw: [0.7, 0.34, 0.18], tip: [0.15, 0.1, 0.08] };
  const onSand = (x, z) => landAt(A, x, z, 0.3) && A.groundH(x, z) < (A.waterY || -0.86) + 0.2;
  for (let i = 0; i < n; i++) {
    const rig = crabRig(), mesh = skinned(crabParts(rig, c), rig, creatureMat({ key: "crab", spec: 0.3, shine: 50 }, A.LU)), B = rig.bones;
    mesh.scale.setScalar(1.3);
    let p = null; for (let k = 0; k < 300 && !p; k++) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); if (onSand(x, z)) p = [x, z]; } if (!p) break;
    const K = { x: p[0], z: p[1], h: R() * TAU, st: "rest", t: R() * 3, ph: 0, dir: 1 };
    out.push({ obj: mesh, update(dt, time) {
      K.t -= dt;
      if (K.st === "rest" && K.t <= 0) { K.st = "run"; K.t = 0.8 + Math.random() * 1.5; K.dir = Math.random() < 0.5 ? -1 : 1; K.h += (Math.random() - 0.5) * 1.2; }
      if (K.st === "run") { K.ph += dt * 30; const nx = K.x + Math.cos(K.h) * K.dir * 0.35 * dt, nz = K.z - Math.sin(K.h) * K.dir * 0.35 * dt; if (onSand(nx, nz)) { K.x = nx; K.z = nz; } else K.dir *= -1; if (K.t <= 0) { K.st = "rest"; K.t = 1 + Math.random() * 4; } }
      for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => { const n = (s < 0 ? "L" : "R") + k, a = K.ph + k * 1.3 + (s > 0 ? Math.PI : 0); B[n].rotation.z = K.st === "run" ? Math.sin(a) * 0.35 : 0; B[n].rotation.y = K.st === "run" ? Math.cos(a) * 0.25 : 0; });
      const wave = K.st === "rest" ? Math.max(0, Math.sin(time * 1.5 + i * 2)) : 0; B.Lc.rotation.x = -wave * 0.6; B.Rc.rotation.x = -wave * 0.4 * Math.sin(time); B.Lc2.rotation.y = Math.sin(time * 3) * 0.1;
      mesh.position.set(K.x, A.groundH(K.x, K.z), K.z); mesh.rotation.y = K.h;
    } });
  }
  return out;
};

// ---------------------------------------------------------------- frogs: sitting at the water's edge, throats pulsing, leaping in
function frogRig() {
  return makeRig({ body: [null, 0, 0.025, 0], head: ["body", 0, 0.03, 0.03], throat: ["head", 0, 0.018, 0.035],
    Lt: ["body", -0.018, 0.022, -0.02], Ls: ["Lt", -0.04, 0.018, -0.005], Lf: ["Ls", -0.03, 0.004, -0.03], Rt: ["body", 0.018, 0.022, -0.02], Rs: ["Rt", 0.04, 0.018, -0.005], Rf: ["Rs", 0.03, 0.004, -0.03],
    La: ["body", -0.018, 0.02, 0.02], Ra: ["body", 0.018, 0.02, 0.02] });
}
function frogParts(rig, c) {
  const P = [], skin = (x, y, z) => { const sp = fbm2(x * 150, z * 150, 13, 2) > 0.62; return (y < 0.018 ? c.belly : sp ? c.spot : c.back).map((v) => v * (0.9 + 0.1 * fbm2(x * 400, z * 400, 2, 2))); };
  P.push({ g: T(ball(0.028, (x, y, z) => skin(x, y + 0.025, z), 1, 0.62, 1.25, 18), 0, 0.025, 0), b: "body" });
  P.push({ g: T(ball(0.022, (x, y, z) => skin(x, y + 0.03, z + 0.03), 1.15, 0.55, 1.0, 16), 0, 0.03, 0.03), b: "head" });
  P.push({ g: T(ball(0.012, c.belly, 1.3, 0.6, 1, 10), 0, 0.018, 0.035), b: "throat" });
  [-1, 1].forEach((s) => { P.push({ g: T(ball(0.0062, [0.7, 0.55, 0.15], 1, 1, 1, 10), s * 0.013, 0.04, 0.036), b: "head" }); P.push({ g: T(ball(0.0032, [0.02, 0.02, 0.02], 1.6, 0.8, 1, 8), s * 0.0152, 0.041, 0.039), b: "head" }); });
  [["L", -1], ["R", 1]].forEach(([n, s]) => {
    const t = rig.at[n + "t"], sh = rig.at[n + "s"], f = rig.at[n + "f"], a = rig.at[n + "a"];
    P.push({ g: limb([t, sh], 0.011, 0.008, (x, y, z) => skin(x, y, z), 5), b: n + "t" });
    P.push({ g: limb([sh, f], 0.007, 0.005, (x, y, z) => skin(x, y, z), 5), b: n + "s" });
    for (let k = 0; k < 4; k++) P.push({ g: limb([f, [f[0] + s * (k - 1) * 0.008, 0.002, f[2] + 0.025]], 0.0025, 0.0015, c.back, 3), b: n + "f" });
    P.push({ g: limb([a, [a[0] + s * 0.012, 0.004, a[2] + 0.012]], 0.005, 0.004, c.back, 3), b: n + "a" });
  });
  return P;
}
WALKERS.frogs = (A, q, ctx) => {
  if (A.waterY == null) return [];
  const out = [], n = 3, R = rng(A.seedN + 31), c = A.env.ground === "jungle" ? { back: [0.15, 0.55, 0.2], belly: [0.9, 0.85, 0.6], spot: [0.05, 0.15, 0.05] } : { back: [0.32, 0.48, 0.2], belly: [0.88, 0.84, 0.66], spot: [0.12, 0.2, 0.08] };
  const edge = () => { for (let i = 0; i < 400; i++) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); const g = A.groundH(x, z); if (landAt(A, x, z, 0.3) && g < A.waterY + 0.06) return [x, z]; } return null; };
  const wet = () => { for (let i = 0; i < 400; i++) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); const [s, t] = A.toL(x, z); if (s > 0.3 && s < A.L - 0.3 && Math.abs(t) < A.W / 2 - 0.3 && A.groundH(x, z) < A.waterY - 0.1) return [x, z]; } return null; };
  for (let i = 0; i < n; i++) {
    const rig = frogRig(), mesh = skinned(frogParts(rig, c), rig, creatureMat({ key: "frog", spec: 0.4, shine: 60 }, A.LU)), B = rig.bones;
    mesh.scale.setScalar(1.6);
    const p = edge(); if (!p) break;
    const F = { x: p[0], z: p[1], h: R() * TAU, st: "sit", t: 2 + R() * 6, jump: 0, from: null, to: null, swim: false };
    out.push({ obj: mesh, update(dt, time) {
      F.t -= dt;
      if (F.st === "sit" && F.t <= 0) { const to = F.swim ? edge() : (Math.random() < 0.6 ? wet() : edge()); if (to) { F.st = "jump"; F.jump = 0; F.from = [F.x, F.z]; F.to = to; F.h = Math.atan2(to[0] - F.x, to[1] - F.z); } else F.t = 3; }
      let y = A.groundH(F.x, F.z), leap = 0;
      if (F.st === "jump") {
        F.jump += dt / 0.55; const u = Math.min(1, F.jump); leap = u;
        F.x = lerp(F.from[0], F.to[0], u); F.z = lerp(F.from[1], F.to[1], u);
        const g1 = Math.max(A.groundH(F.x, F.z), A.waterY - 0.02); y = g1 + Math.sin(u * Math.PI) * 0.2;
        if (u >= 1) { F.swim = A.groundH(F.x, F.z) < A.waterY - 0.03; F.st = "sit"; F.t = F.swim ? 2 + Math.random() * 3 : 4 + Math.random() * 8; if (F.swim) ctx.splash(A, F.x, F.z, 0.5); }
      } else if (F.swim) y = A.waterY - 0.022;
      // legs tucked while sitting, flung back in the leap; the throat pulses
      const ext = F.st === "jump" ? Math.sin(Math.min(1, leap) * Math.PI) : F.swim ? 0.5 + 0.5 * Math.sin(time * 5) : 0;
      ["L", "R"].forEach((nm) => { B[nm + "t"].rotation.x = ext * 1.2; B[nm + "s"].rotation.x = -ext * 0.8; B[nm + "f"].rotation.x = ext * 0.5; });
      B.throat.scale.setScalar(F.st === "sit" && !F.swim ? 1 + 0.35 * Math.max(0, Math.sin(time * 5 + i)) : 1);
      B.body.rotation.x = F.st === "jump" ? -0.4 * Math.sin(leap * Math.PI) : F.swim ? 0.1 : -0.25;
      mesh.position.set(F.x, y, F.z); mesh.rotation.y = F.h;
    } });
  }
  return out;
};

// ---------------------------------------------------------------- turtles: paddling through the water, surfacing to breathe
function turtleRig() { return makeRig({ shell: [null, 0, 0.04, 0], head: ["shell", 0, 0.04, 0.1], FL: ["shell", -0.07, 0.035, 0.06], FR: ["shell", 0.07, 0.035, 0.06], BL: ["shell", -0.06, 0.035, -0.07], BR: ["shell", 0.06, 0.035, -0.07] }); }
function turtleParts(rig, c) {
  const P = [];
  // the shell: a dome with its scutes drawn in darker seams
  P.push({ g: T(ball(0.1, (x, y, z) => { const hx = Math.abs(x) / 0.1, hz = z / 0.1; const seam = Math.abs(Math.sin(hz * 4.2)) < 0.12 || Math.abs(hx - 0.35) < 0.04 || (hx < 0.05 && y > 0.02); const k = 0.85 + 0.25 * fbm2(x * 60, z * 60, 7, 2); return (y < -0.01 ? c.plastron : seam ? c.seam : c.shell).map((v) => v * k); }, 0.85, 0.38, 1.05, 24), 0, 0.04, 0), b: "shell" });
  P.push({ g: limb([[0, 0.04, 0.08], [0, 0.045, 0.12]], 0.018, 0.016, c.skin, 5), b: "head" });
  P.push({ g: T(ball(0.022, (x, y, z) => Math.abs(y) < 0.004 ? c.seam : c.skin, 0.9, 0.75, 1.3, 14), 0, 0.047, 0.135), b: "head" });
  eyeBall(P, 0.014, 0.053, 0.145, 0.004, [0.5, 0.4, 0.1]); P.splice(P.length - 4, 4, ...P.slice(P.length - 4).map((g) => ({ g, b: "head" })));
  [["FL", -1, 0.06], ["FR", 1, 0.06], ["BL", -1, -0.07], ["BR", 1, -0.07]].forEach(([n, s, z]) => { const f = fin([[0, 0.012], [0.07, 0.01], [0.1, -0.006], [0.06, -0.018], [0, -0.012]].map(([x, y]) => [x * s * (z > 0 ? 1 : 0.7), y]), c.skin); f.rotateX(Math.PI / 2); f.translate(s * 0.06, 0.035, z); P.push({ g: f, b: n }); });
  return P;
}
WALKERS.turtles = (A, q, ctx) => {
  if (A.waterY == null) return [];
  const out = [], n = 2, R = rng(A.seedN + 41), c = A.env.ground === "shore" ? { shell: [0.36, 0.3, 0.18], seam: [0.16, 0.12, 0.08], plastron: [0.8, 0.74, 0.5], skin: [0.42, 0.44, 0.3] } : { shell: [0.24, 0.26, 0.16], seam: [0.1, 0.1, 0.06], plastron: [0.78, 0.68, 0.36], skin: [0.3, 0.34, 0.22] };
  const wet = () => { for (let i = 0; i < 400; i++) { const [x, z] = A.toW(Math.random() * A.L, (Math.random() - 0.5) * A.W); const [s, t] = A.toL(x, z); if (s > 0.4 && s < A.L - 0.4 && Math.abs(t) < A.W / 2 - 0.4 && A.groundH(x, z) < A.waterY - 0.2) return [x, z]; } return null; };
  for (let i = 0; i < n; i++) {
    const rig = turtleRig(), mesh = skinned(turtleParts(rig, c), rig, creatureMat({ key: "turtle", spec: 0.3, shine: 40 }, A.LU)), B = rig.bones;
    mesh.scale.setScalar(A.env.ground === "shore" ? 2.2 : 1.4);
    const p = wet(); if (!p) break;
    const Tt = { x: p[0], z: p[1], h: R() * TAU, y: A.waterY - 0.15, tgt: wet(), ph: R() * 6, up: 0 };
    out.push({ obj: mesh, update(dt, time) {
      Tt.ph += dt * 2.2;
      if (!Tt.tgt || stepTo(Tt, Tt.tgt[0], Tt.tgt[1], 0.12, dt, 0.8)) { Tt.tgt = wet(); Tt.up = Math.random() < 0.4 ? 1 : 0; }
      if (A.groundH(Tt.x, Tt.z) > A.waterY - 0.12) Tt.tgt = wet();
      const want = Tt.up ? A.waterY - 0.03 : Math.max(A.groundH(Tt.x, Tt.z) + 0.06, A.waterY - 0.3); Tt.y = lerp(Tt.y, want, dt * 0.5);
      const st = Math.sin(Tt.ph); B.FL.rotation.y = st * 0.6; B.FR.rotation.y = -st * 0.6; B.BL.rotation.y = -st * 0.3; B.BR.rotation.y = st * 0.3;
      B.head.rotation.x = Math.sin(time * 0.7 + i) * 0.15;
      mesh.position.set(Tt.x, Tt.y, Tt.z); mesh.rotation.y = Tt.h;
    } });
  }
  return out;
};

// ---------------------------------------------------------------- scorpions on sand and in caves
function scorpRig() {
  const d = { body: [null, 0, 0.012, 0], t0: ["body", 0, 0.014, -0.035], t1: ["t0", 0, 0.018, -0.05], t2: ["t1", 0, 0.024, -0.063], t3: ["t2", 0, 0.032, -0.073], t4: ["t3", 0, 0.042, -0.078], Lp: ["body", -0.01, 0.012, 0.02], Rp: ["body", 0.01, 0.012, 0.02] };
  for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => { d[(s < 0 ? "L" : "R") + k] = ["body", s * 0.008, 0.012, 0.012 - k * 0.01]; });
  return makeRig(d);
}
function scorpParts(rig, c) {
  const P = [];
  P.push({ g: body([[-0.035, 0.006], [-0.02, 0.011], [0.0, 0.012], [0.015, 0.011], [0.025, 0.006]].map(([z, r]) => [z, r, 0.012]), { seg: 12, w: 1.1, h: 0.45, color: (z) => c.body.map((v) => v * (Math.sin(z * 600) > 0.7 ? 0.8 : 1)) }), b: "body" });
  const tp = [[0, 0.014, -0.035], [0, 0.018, -0.05], [0, 0.024, -0.063], [0, 0.032, -0.073], [0, 0.042, -0.078], [0, 0.05, -0.074]];
  for (let k = 0; k < 5; k++) P.push({ g: T(ball(0.0045 - k * 0.0002, c.body, 1, 0.9, 1.4, 8), ...tp[k]), b: "t" + k });
  P.push({ g: T(ball(0.005, c.sting, 1, 1, 1.3, 8), 0, 0.048, -0.072), b: "t4" }); P.push({ g: T(cone(0.0015, 0.01, [0.05, 0.03, 0.02], 5), 0, 0.052, -0.066, 0.8, 0, 0), b: "t4" });
  [-1, 1].forEach((s) => { const n = s < 0 ? "Lp" : "Rp"; P.push({ g: limb([[s * 0.01, 0.012, 0.02], [s * 0.025, 0.014, 0.03], [s * 0.02, 0.012, 0.045]], 0.0022, 0.0022, c.body, 5), b: n }); P.push({ g: T(ball(0.006, c.claw, 1, 0.6, 1.6, 10), s * 0.02, 0.012, 0.052), b: n }); });
  for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => { const a = rig.at[(s < 0 ? "L" : "R") + k]; P.push({ g: limb([a, [a[0] + s * 0.02, 0.018, a[2] - 0.002], [a[0] + s * 0.03, 0.0, a[2] - 0.006 - k * 0.002]], 0.0014, 0.0008, c.body, 4), b: (s < 0 ? "L" : "R") + k }); });
  return P;
}
WALKERS.scorpions = (A, q) => {
  const out = [], n = A.kind === "room" ? 2 : 1, R = rng(A.seedN + 51), c = A.env.ground === "cave" ? { body: [0.14, 0.1, 0.08], sting: [0.2, 0.12, 0.08], claw: [0.16, 0.11, 0.08] } : { body: [0.72, 0.6, 0.32], sting: [0.6, 0.45, 0.2], claw: [0.7, 0.56, 0.28] };
  for (let i = 0; i < n; i++) {
    const rig = scorpRig(), mesh = skinned(scorpParts(rig, c), rig, creatureMat({ key: "scorp", spec: 0.5, shine: 70 }, A.LU)), B = rig.bones;
    mesh.scale.setScalar(2.2);
    const p = randLand(A, R, 0.3); if (!p) break;
    const S = { x: p[0], z: p[1], h: R() * TAU, st: "rest", t: R() * 4, ph: 0, tgt: null };
    out.push({ obj: mesh, update(dt, time) {
      S.t -= dt;
      if (S.st === "rest" && S.t <= 0) { S.st = "walk"; S.tgt = randLand(A, R, 0.3); S.t = 6; }
      if (S.st === "walk") { S.ph += dt * 18; if (!S.tgt || stepTo(S, S.tgt[0], S.tgt[1], 0.08, dt, 2) || S.t <= 0) { S.st = "rest"; S.t = 3 + Math.random() * 6; } }
      for (let k = 0; k < 4; k++) [-1, 1].forEach((s) => { B[(s < 0 ? "L" : "R") + k].rotation.y = S.st === "walk" ? Math.sin(S.ph + k * 1.4 + (s > 0 ? Math.PI : 0)) * 0.35 : 0; });
      const curl = 0.5 + 0.1 * Math.sin(time * 1.3 + i); for (let k = 0; k < 5; k++) B["t" + k].rotation.x = -curl * (0.4 + k * 0.1);
      B.Lp.rotation.y = 0.2 + Math.sin(time * 0.9) * 0.15; B.Rp.rotation.y = -0.2 - Math.sin(time * 1.1) * 0.15;
      mesh.position.set(S.x, A.groundH(S.x, S.z), S.z); mesh.rotation.y = S.h;
    } });
  }
  return out;
};

// ---------------------------------------------------------------- birds on the ground: ravens hopping and pecking, an owl on its stump
function perchRig(owl) {
  return makeRig(owl
    ? { body: [null, 0, 0.14, 0], head: ["body", 0, 0.26, 0.01], lid: ["head", 0, 0.28, 0.05], Lw: ["body", -0.07, 0.18, 0], Rw: ["body", 0.07, 0.18, 0] }
    : { body: [null, 0, 0.1, 0], head: ["body", 0, 0.15, 0.09], jaw: ["head", 0, 0.148, 0.13], Ll: ["body", -0.02, 0.07, 0.0], Rl: ["body", 0.02, 0.07, 0.0], Lw: ["body", -0.05, 0.11, 0.02], Rw: ["body", 0.05, 0.11, 0.02], tail: ["body", 0, 0.1, -0.1] });
}
function ravenParts(rig) {
  const P = [], k = [0.045, 0.045, 0.05], sheen = (x, y, z) => k.map((v, i) => v + (i === 2 ? 0.025 : 0.012) * Math.max(0, Math.sin(z * 90 + y * 60)));
  P.push({ g: body([[-0.1, 0.01], [-0.06, 0.04], [0.0, 0.055], [0.05, 0.05], [0.08, 0.035]].map(([z, r]) => [z, r, 0.1]), { seg: 16, belly: 0.1, color: (z, a, x, y) => sheen(x, y, z) }), b: "body" });
  P.push({ g: limb([[0, 0.12, 0.06], [0, 0.145, 0.085]], 0.03, 0.026, k, 5), b: "head" });
  P.push({ g: T(ball(0.031, sheen, 1, 0.95, 1.15, 14), 0, 0.152, 0.095), b: "head" });
  P.push({ g: T(body([[0, 0.012], [0.03, 0.009], [0.055, 0.001]], { seg: 8, w: 0.8, h: 1.2, color: () => [0.08, 0.08, 0.08] }), 0, 0.156, 0.117), b: "head" });
  P.push({ g: T(body([[0, 0.008], [0.04, 0.003], [0.05, 0.0005]], { seg: 8, w: 0.8, h: 0.6, color: () => [0.08, 0.08, 0.08] }), 0, 0.146, 0.117), b: "jaw" });
  eyeBall(P, 0.022, 0.16, 0.105, 0.005, [0.1, 0.07, 0.04]); P.splice(P.length - 4, 4, ...P.slice(P.length - 4).map((g) => ({ g, b: "head" })));
  [-1, 1].forEach((s) => { for (let j = 0; j < 6; j++) { const f = feather(0.16 - j * 0.01, 0.04, () => k); f.rotateZ(Math.PI + 0.05); f.rotateY(-Math.PI / 2 + s * 0.12); f.translate(s * (0.045 - j * 0.002), 0.12 - j * 0.004, 0.05 - j * 0.012); P.push({ g: f, b: s < 0 ? "Lw" : "Rw" }); } });
  for (let j = 0; j < 6; j++) { const f = feather(0.12, 0.03, () => k); f.rotateZ(Math.PI + (j - 2.5) * 0.08); f.rotateX(Math.PI / 2); f.translate((j - 2.5) * 0.008, 0.1, -0.09); P.push({ g: f, b: "tail" }); }
  [["Ll", -1], ["Rl", 1]].forEach(([n, s]) => { P.push({ g: limb([[s * 0.02, 0.07, 0], [s * 0.022, 0.004, 0.005]], 0.005, 0.004, [0.1, 0.1, 0.1], 4), b: n }); [-0.5, 0, 0.5, Math.PI].forEach((a) => P.push({ g: limb([[s * 0.022, 0.003, 0.005], [s * 0.022 + Math.sin(a) * 0.03, 0.001, 0.005 + Math.cos(a) * 0.03]], 0.002, 0.0012, [0.1, 0.1, 0.1], 2), b: n })); });
  return P;
}
WALKERS.ravensGround = (A, q) => {
  const out = [], n = 2, R = rng(A.seedN + 61);
  for (let i = 0; i < n; i++) {
    const rig = perchRig(false), mesh = skinned(ravenParts(rig), rig, creatureMat({ key: "raven", spec: 0.25, shine: 40 }, A.LU)), B = rig.bones;
    mesh.scale.setScalar(1.3);
    const p = randLand(A, R, 0.35); if (!p) break;
    const Rv = { x: p[0], z: p[1], h: R() * TAU, st: "stand", t: R() * 3, hop: -1, fx: 0, fz: 0, tx: 0, tz: 0 };
    out.push({ obj: mesh, update(dt, time) {
      Rv.t -= dt; let lift = 0;
      if (Rv.st === "stand" && Rv.t <= 0) { const r = Math.random(); if (r < 0.5) { const a = Rv.h + (Math.random() - 0.5) * 2, d = 0.12 + Math.random() * 0.15, tx = Rv.x + Math.sin(a) * d, tz = Rv.z + Math.cos(a) * d; if (landAt(A, tx, tz, 0.3)) { Rv.st = "hop"; Rv.hop = 0; Rv.fx = Rv.x; Rv.fz = Rv.z; Rv.tx = tx; Rv.tz = tz; Rv.h = a; } else Rv.h += 1; } else if (r < 0.8) { Rv.st = "peck"; Rv.t = 1.2; } else { Rv.st = "caw"; Rv.t = 1.2; } }
      if (Rv.st === "hop") { Rv.hop += dt / 0.28; const u = Math.min(1, Rv.hop); Rv.x = lerp(Rv.fx, Rv.tx, u); Rv.z = lerp(Rv.fz, Rv.tz, u); lift = Math.sin(u * Math.PI) * 0.05; if (u >= 1) { Rv.st = Math.random() < 0.5 ? "hop" : "stand"; Rv.hop = 0; Rv.fx = Rv.x; Rv.fz = Rv.z; const a = Rv.h + (Math.random() - 0.5) * 0.8; Rv.tx = Rv.x + Math.sin(a) * 0.14; Rv.tz = Rv.z + Math.cos(a) * 0.14; if (!landAt(A, Rv.tx, Rv.tz, 0.3)) Rv.st = "stand"; else Rv.h = a; Rv.t = 1 + Math.random() * 3; } }
      if ((Rv.st === "peck" || Rv.st === "caw") && Rv.t <= 0) { Rv.st = "stand"; Rv.t = 1 + Math.random() * 3; }
      B.head.rotation.x = Rv.st === "peck" ? 0.9 * Math.abs(Math.sin(time * 9)) : Rv.st === "caw" ? -0.3 : 0; B.head.rotation.z = Rv.st === "stand" ? Math.sin(time * 1.3 + i) * 0.3 : 0;
      B.jaw.rotation.x = Rv.st === "caw" ? 0.35 * Math.max(0, Math.sin(time * 7)) : 0;
      B.body.rotation.x = Rv.st === "peck" ? 0.35 : -0.15; B.tail.rotation.x = Rv.st === "hop" ? -0.3 : 0.15;
      B.Lw.rotation.z = Rv.st === "hop" ? -0.4 * Math.sin(Rv.hop * Math.PI) : 0; B.Rw.rotation.z = -B.Lw.rotation.z;
      mesh.position.set(Rv.x, A.groundH(Rv.x, Rv.z) + lift, Rv.z); mesh.rotation.y = Rv.h;
    } });
  }
  return out;
};
function owlParts(rig) {
  const P = [], c = { back: [0.42, 0.33, 0.24], belly: [0.82, 0.74, 0.6], face: [0.86, 0.8, 0.7], bar: [0.3, 0.22, 0.15] };
  P.push({ g: T(ball(0.085, (x, y, z) => { const front = z > 0.02; const bar = Math.sin(y * 260) > 0.6 && front; return (front ? (bar ? c.bar : c.belly) : c.back).map((v) => v * (0.9 + 0.12 * fbm2(x * 90, y * 90, 5, 2))); }, 0.95, 1.2, 0.85, 20), 0, 0.14, 0), b: "body" });
  P.push({ g: T(ball(0.07, (x, y, z) => z > 0.03 ? c.face : c.back.map((v) => v * (0.9 + 0.1 * Math.sin(x * 200))), 1.05, 0.9, 0.88, 20), 0, 0.26, 0.01), b: "head" });
  [-1, 1].forEach((s) => {
    P.push({ g: T(ball(0.03, (x, y, z) => { const r = Math.hypot(x, y); return r < 0.02 ? c.face : c.bar; }, 1, 1, 0.3, 16), s * 0.03, 0.265, 0.062), b: "head" });            // facial disc
    P.push({ g: T(ball(0.014, (x, y, z) => Math.hypot(x, y) < 0.007 ? [0.02, 0.02, 0.02] : [0.95, 0.6, 0.08], 1, 1, 0.6, 14), s * 0.03, 0.268, 0.07), b: "head" });   // eyes
    P.push({ g: T(ball(0.003, [1, 1, 1], 1, 1, 1, 5), s * 0.026, 0.274, 0.078), b: "head" });
    P.push({ g: T(cone(0.012, 0.04, c.back, 6), s * 0.045, 0.33, 0.01, 0, 0, -s * 0.3), b: "head" });   // ear tufts
    P.push({ g: T(ball(0.016, [0.9, 0.9, 0.9].map((v) => v * 0.9), 1.3, 0.3, 1, 10), s * 0.03, 0.277, 0.066), b: "lid" });       // eyelid
    for (let j = 0; j < 6; j++) { const f = feather(0.16 - j * 0.01, 0.05, () => c.back.map((v) => v * (j % 2 ? 0.85 : 1))); f.rotateZ(Math.PI + 0.1); f.rotateY(-Math.PI / 2 + s * 0.2); f.translate(s * (0.075 - j * 0.002), 0.21 - j * 0.004, 0.03 - j * 0.012); P.push({ g: f, b: s < 0 ? "Lw" : "Rw" }); }
  });
  P.push({ g: T(cone(0.01, 0.025, [0.3, 0.28, 0.25], 6), 0, 0.245, 0.075, Math.PI * 0.6, 0, 0), b: "head" });
  [-1, 1].forEach((s) => { for (let t = 0; t < 3; t++) P.push({ g: T(limb([[0, 0, 0], [(t - 1) * 0.01, -0.005, 0.02]], 0.004, 0.002, [0.35, 0.3, 0.2], 3), s * 0.03, 0.03, 0.03), b: "body" }); });
  return P;
}
WALKERS.owl = (A, q) => {
  const R = rng(A.seedN + 71), rig = perchRig(true), mesh = skinned(owlParts(rig), rig, creatureMat({ key: "owl", spec: 0.02 }, A.LU)), B = rig.bones;
  const p = randLand(A, R, 0.6); if (!p) return [];
  // a weathered stump to perch on
  const stumpH = 0.28, st = limb([[0, 0, 0], [0.01, stumpH * 0.5, 0], [0, stumpH, 0.01]], 0.09, 0.07, (x, y, z) => { const k = 0.8 + 0.3 * Math.sin(Math.atan2(z, x) * 20 + y * 30); return [0.3 * k, 0.22 * k, 0.15 * k]; }, 6);
  const top = colorize(new THREE.CircleGeometry(0.07, 18).rotateX(-Math.PI / 2).translate(0.0, stumpH, 0.01), (x, y, z) => { const r = Math.hypot(x, z - 0.01); const ring = 0.55 + 0.2 * Math.sin(r * 300); return [ring, ring * 0.75, ring * 0.5]; });
  const stump = new THREE.Mesh(mergeG([st, top]), creatureMat({ key: "stump" }, A.LU)); const gy = A.groundH(p[0], p[1]); stump.position.set(p[0], gy, p[1]);
  mesh.position.set(p[0], gy + stumpH, p[1] + 0.01); mesh.rotation.y = R() * TAU; mesh.scale.setScalar(1.1);
  let look = 0, want = 0, next = 2, blink = 0;
  return [{ obj: stump, update() {} }, { obj: mesh, update(dt, time) {
    next -= dt; if (next <= 0) { want = (Math.random() - 0.5) * 3.6; next = 2 + Math.random() * 5; if (Math.random() < 0.3) blink = 0.25; }
    look = lerp(look, want, dt * 4); B.head.rotation.y = look; B.head.rotation.z = Math.sin(time * 0.6) * 0.08;
    blink = Math.max(0, blink - dt); B.lid.scale.y = blink > 0 ? 3.5 : 0.01; B.lid.position.y = rig.rest.lid.y + (blink > 0 ? 0 : 0.01);
    const stretch = Math.max(0, Math.sin(time * 0.25)) > 0.97 ? 0.5 : 0; B.Lw.rotation.z = -stretch; B.Rw.rotation.z = stretch;
  } }];
};

// ---------------------------------------------------------------- hares and mice
function hareRig(mouse) {
  const k = mouse ? 0.28 : 1;
  const d = { body: [null, 0, 0.1, -0.02], head: ["body", 0, 0.16, 0.12], Le: ["head", -0.018, 0.2, 0.11], Re: ["head", 0.018, 0.2, 0.11], Fl: ["body", -0.03, 0.08, 0.08], Fr: ["body", 0.03, 0.08, 0.08], Bl: ["body", -0.05, 0.08, -0.08], Br: ["body", 0.05, 0.08, -0.08] };
  for (const key of Object.keys(d)) d[key] = [d[key][0], d[key][1] * k, d[key][2] * k, d[key][3] * k];
  return makeRig(d);
}
function hareParts(rig, mouse) {
  const k = mouse ? 0.28 : 1, P = [], c = mouse ? { fur: [0.45, 0.38, 0.3], belly: [0.8, 0.74, 0.66], ear: [0.72, 0.52, 0.5] } : { fur: [0.55, 0.42, 0.28], belly: [0.9, 0.86, 0.78], ear: [0.5, 0.36, 0.26] };
  const fur = (x, y, z) => (y < 0.11 * k ? c.belly : c.fur).map((v) => v * (0.88 + 0.2 * fbm2(x * 300 / k, (y + z) * 300 / k, 3, 2)));
  P.push({ g: T(ball(0.09 * k, fur, 0.8, 0.85, 1.35, 20), 0, 0.1 * k, -0.02 * k), b: "body" });
  P.push({ g: T(ball(0.05 * k, fur, 0.85, 0.9, 1.2, 16), 0, 0.16 * k, 0.13 * k), b: "head" });
  P.push({ g: T(ball(0.008 * k, [0.4, 0.25, 0.25], 1, 0.8, 1, 8), 0, 0.16 * k, 0.19 * k), b: "head" });
  eyeBall(P, 0.028 * k, 0.175 * k, 0.15 * k, 0.009 * k, [0.4, 0.25, 0.08]); P.splice(P.length - 4, 4, ...P.slice(P.length - 4).map((g) => ({ g, b: "head" })));
  [-1, 1].forEach((s) => { const n = s < 0 ? "Le" : "Re"; const e = mouse ? ball(0.02 * k * 1.8, c.ear, 1, 1, 0.3, 12) : ball(0.022, (x, y) => y > 0.06 ? [0.1, 0.08, 0.06] : c.ear, 0.7, 2.9, 0.3, 12);
    if (!mouse) e.translate(0, 0.06, 0); L2(e, s * 0.018 * k, 0.2 * k, 0.11 * k, -0.25, s * 0.3, s * -0.2); P.push({ g: e, b: n });
    for (let w = 0; w < 3; w++) P.push({ g: limb([[s * 0.01 * k, 0.158 * k, 0.185 * k], [s * 0.05 * k, (0.16 - w * 0.008) * k, 0.19 * k]], 0.0008, 0.0004, [0.9, 0.9, 0.9], 3), b: "head" }); });
  [["Fl", -1, 0.08], ["Fr", 1, 0.08]].forEach(([n, s, z]) => P.push({ g: limb([[s * 0.03 * k, 0.08 * k, z * k], [s * 0.03 * k, 0.003, (z + 0.02) * k]], 0.012 * k, 0.009 * k, fur, 5), b: n }));
  [["Bl", -1], ["Br", 1]].forEach(([n, s]) => { P.push({ g: T(ball(0.045 * k, fur, 0.6, 1, 1.3, 12), s * 0.05 * k, 0.065 * k, -0.07 * k), b: n }); P.push({ g: T(ball(0.02 * k, fur, 0.7, 0.4, 2.8, 10), s * 0.05 * k, 0.012 * k, -0.04 * k), b: n }); });
  P.push({ g: mouse ? limb([[0, 0.08 * k, -0.14 * k], [0, 0.04 * k, -0.3 * k], [0.01, 0.01, -0.45 * k]], 0.012 * k, 0.004 * k, c.ear, 8) : T(ball(0.025, c.belly, 1, 1, 1, 10), 0, 0.13, -0.14), b: "body" });
  return P;
}
function hopper(mouse) {
  return (A, q) => {
    const out = [], n = mouse ? 3 : 2, R = rng(A.seedN + (mouse ? 81 : 91));
    for (let i = 0; i < n; i++) {
      const rig = hareRig(mouse), mesh = skinned(hareParts(rig, mouse), rig, creatureMat({ key: "hare", spec: 0.03 }, A.LU)), B = rig.bones;
      if (mouse) mesh.scale.setScalar(1.6);
      const p = randLand(A, R, 0.3); if (!p) break;
      const H = { x: p[0], z: p[1], h: R() * TAU, st: "sit", t: R() * 3, hop: 0, fx: 0, fz: 0, tx: 0, tz: 0 };
      out.push({ obj: mesh, update(dt, time) {
        H.t -= dt; let lift = 0, u = 0;
        if (H.st === "sit" && H.t <= 0) { const a = H.h + (Math.random() - 0.5) * 2.4, d = mouse ? 0.3 : 0.45, tx = H.x + Math.sin(a) * d, tz = H.z + Math.cos(a) * d; if (landAt(A, tx, tz, 0.3)) { H.st = "hop"; H.hop = 0; H.fx = H.x; H.fz = H.z; H.tx = tx; H.tz = tz; H.h = a; H.n = mouse ? 1 : 1 + Math.floor(Math.random() * 3); } else H.h += 1.5; }
        if (H.st === "hop") { H.hop += dt / (mouse ? 0.5 : 0.35); u = Math.min(1, H.hop); H.x = lerp(H.fx, H.tx, u); H.z = lerp(H.fz, H.tz, u); lift = mouse ? 0 : Math.sin(u * Math.PI) * 0.12;
          if (u >= 1) { if (--H.n > 0) { H.hop = 0; H.fx = H.x; H.fz = H.z; H.tx = H.x + Math.sin(H.h) * 0.45; H.tz = H.z + Math.cos(H.h) * 0.45; if (!landAt(A, H.tx, H.tz, 0.3)) H.st = "sit"; } else { H.st = Math.random() < 0.3 && !mouse ? "up" : "sit"; H.t = 2 + Math.random() * 4; } } }
        if (H.st === "up" && H.t <= 0) { H.st = "sit"; H.t = 2; }
        const stretch = H.st === "hop" ? Math.sin(u * Math.PI) : 0;
        B.Bl.rotation.x = B.Br.rotation.x = mouse ? Math.sin(time * 30) * 0.4 * (H.st === "hop" ? 1 : 0) : stretch * 0.9; B.Fl.rotation.x = B.Fr.rotation.x = mouse ? -B.Bl.rotation.x : -stretch * 0.9;
        B.body.rotation.x = H.st === "up" ? -0.9 : -stretch * 0.2; B.body.position.y = rig.rest.body.y + (H.st === "up" ? 0.04 : 0);
        const tw = Math.max(0, Math.sin(time * 2.3 + i * 3)) > 0.96 ? 0.3 : 0; B.Le.rotation.x = -tw + (H.st === "up" ? 0.3 : 0); B.Re.rotation.x = tw * 0.5; B.head.rotation.x = Math.sin(time * (mouse ? 11 : 4)) * 0.04;
        mesh.position.set(H.x, A.groundH(H.x, H.z) + lift, H.z); mesh.rotation.y = H.h;
      } });
    }
    return out;
  };
}
WALKERS.hares = hopper(false); WALKERS.mice = hopper(true);
