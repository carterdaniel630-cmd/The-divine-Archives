/* ==========================================================================
   THE DIVINE ARCHIVES — the Visual Foundation Kit (movement 1)

   One shared kit that every visual build stands on, so the floor is raised by
   what a build is handed rather than by each room re-inventing it
   (handoff/visual-floor-plan-staging-note-2026-11-04.md, Lift 2; Carter's
   ruling 2026-11-07: the kit is the Presence Pass's first movement).

   What is in it:
   - MATERIALS: a library of tuned surfaces (worked stone, bronze, gold, aged
     parchment, ceramic, wood), painted in the browser once per kind and size
     (colour, relief and roughness maps), shared by every mesh that uses them;
   - UN-REPEATED SURFACES: every kit material carries a "breakup" layer, a
     low-frequency variation sampled in WORLD space at a scale unrelated to the
     tile, so a wall or floor no longer shows the same tile stamped across it;
   - LIGHT: graded rigs (flame, skylight, gallery) that shape the scene with a
     key, a fill and falloff, and a darkness grade for phones ("phone" lifts the
     shadows and exposure so a dim room still reads on a phone screen; the
     acceptance test is Carter's own phone, never a bright desktop screenshot);
   - ENVIRONMENT: a small studio environment built from the core library, so
     metals have something to reflect (bronze and gold are flat without one);
   - GROUND: a ground plane in true metres with the same breakup, fading at its
     edge instead of ending in a hard line;
   - SCALE: the archive's human scale (eye height, a person, a doorway) and a
     camera framing rule, so nothing is built or shot at a doll's-house scale.

   Honesty: these are the archive's own materials, tuned to read as their real
   counterparts. They are not scans of any object. Where a build shows a real
   object, the object's own true source still governs (the relic fidelity
   clause); the kit is the ground it stands on, not a substitute for it.

   Conventions: metres; y up. Only the core three.js library is used.
   ========================================================================== */
import * as THREE from "three";

// ---------------------------------------------------------------- seeded, tileable noise
function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const fade = (t) => t * t * (3 - 2 * t);
// fractal value noise over a [0,1)^2 domain that wraps; octave k has base·2^k cells across
export function fbm(seed, octaves, base) {
  const R = rng(seed), L = [];
  for (let k = 0; k < octaves; k++) { const n = (base || 4) << k, a = new Float32Array(n * n); for (let i = 0; i < a.length; i++) a[i] = R(); L.push({ n, a }); }
  return (u, v) => {
    let s = 0, amp = 1, tot = 0;
    for (const { n, a } of L) {
      const x = u * n, y = v * n, xi = Math.floor(x), yi = Math.floor(y), fx = fade(x - xi), fy = fade(y - yi);
      const x0 = ((xi % n) + n) % n, y0 = ((yi % n) + n) % n, x1 = (x0 + 1) % n, y1 = (y0 + 1) % n;
      const top = a[y0 * n + x0] + (a[y0 * n + x1] - a[y0 * n + x0]) * fx, bot = a[y1 * n + x0] + (a[y1 * n + x1] - a[y1 * n + x0]) * fx;
      s += (top + (bot - top) * fy) * amp; tot += amp; amp *= 0.5;
    }
    return s / tot;
  };
}

// ---------------------------------------------------------------- the material library
// Each kind: tile (metres one texture covers), base colour (sRGB 0-255), how much the colour wanders, the
// relief recipe, roughness and metalness, and how strong its world-space breakup is.
// The relief recipes are small painters over (u, v) in [0,1): they return a height 0..1 and a tone -1..1.
const RECIPES = {
  // dressed stone in courses: blocks with a slightly sunk joint, faces tooled, a few chips
  ashlar(seed) {
    const n = fbm(seed, 5, 4), m = fbm(seed + 7, 3, 2), R = rng(seed + 3), rows = 4, cuts = [];
    for (let r = 0; r < rows; r++) { const c = []; let x = R() * 0.2; while (x < 1 - 0.12) { c.push(x); x += 0.22 + R() * 0.2; } cuts.push({ c: c.length ? c : [0], t: c.map(() => R()) }); }
    return (u, v) => {
      const r = Math.min(rows - 1, Math.floor(v * rows)), row = cuts[r], c = row.c;
      let i = c.length - 1; for (let k = 0; k < c.length; k++) if (u < c[k]) { i = k - 1; break; }
      const left = i < 0 ? c[c.length - 1] - 1 : c[i], right = i + 1 < c.length ? c[i + 1] : c[0] + 1;
      const dj = Math.min(u - left, right - u, v * rows - r, r + 1 - v * rows) ;
      const joint = Math.min(1, dj / 0.012), tone = (row.t[(i + c.length) % c.length] || 0.5) - 0.5;
      const h = 0.55 * joint + 0.35 * n(u, v) + 0.1 * m(u * 2 % 1, v * 2 % 1);
      return [h, tone * 0.7 + (n(u, v) - 0.5) * 0.6 - (1 - joint) * 0.5];
    };
  },
  // smooth worked metal: cast surface, hammer facets, and pits where patina gathers
  metal(seed) {
    const n = fbm(seed, 5, 6), p = fbm(seed + 11, 4, 16);
    return (u, v) => { const pit = Math.max(0, p(u, v) - 0.62) * 2.6; return [0.6 + 0.25 * n(u, v) - pit * 0.4, (n(u, v) - 0.5) * 0.5 - pit]; };
  },
  // laid parchment: fibres along one axis, cockling, foxing spots
  parchment(seed) {
    const n = fbm(seed, 5, 3), f = fbm(seed + 5, 3, 24), s = fbm(seed + 9, 4, 10);
    return (u, v) => { const fox = Math.max(0, s(u, v) - 0.66) * 3; return [0.5 + 0.35 * n(u, v) + 0.08 * f(u * 0.2 % 1, v), (n(u, v) - 0.5) * 0.6 - fox * 0.9 + (f(u * 0.2 % 1, v) - 0.5) * 0.25]; };
  },
  // glazed or burnished ceramic: a soft throw, crazing in the glaze
  ceramic(seed) {
    const n = fbm(seed, 4, 3), c = fbm(seed + 13, 3, 28);
    return (u, v) => { const craze = Math.abs(c(u, v) - 0.5) < 0.012 ? 1 : 0; return [0.7 + 0.2 * n(u, v) - craze * 0.25, (n(u, v) - 0.5) * 0.4 - craze * 0.6]; };
  },
  // sawn wood: growth rings stretched along the grain, with knots
  wood(seed) {
    const n = fbm(seed, 4, 4), w = fbm(seed + 17, 3, 3), R = rng(seed + 19), knots = [];
    for (let i = 0; i < 3; i++) knots.push([R(), R(), 0.03 + R() * 0.04]);
    return (u, v) => {
      let d = 0; for (const [ku, kv, kr] of knots) { const du = Math.min(Math.abs(u - ku), 1 - Math.abs(u - ku)), dv = Math.min(Math.abs(v - kv), 1 - Math.abs(v - kv)) * 0.35; d += Math.max(0, kr - Math.hypot(du, dv)) / kr; }
      const ring = 0.5 + 0.5 * Math.sin((v * 22 + w(u, v) * 6 + d * 3) * Math.PI * 2);
      return [0.5 + 0.25 * ring + 0.15 * n(u, v) - d * 0.3, (ring - 0.5) * 0.7 + (n(u, v) - 0.5) * 0.4 - d * 0.8];
    };
  },
};

export const MATERIALS = {
  "worked-stone": { recipe: "ashlar", tile: [2.4, 1.6], base: [178, 164, 136], vary: 22, rough: 0.86, metal: 0, bump: 2.4, breakup: 0.16 },
  bronze:         { recipe: "metal", tile: [0.6, 0.6], base: [140, 96, 54], vary: 26, rough: 0.42, metal: 1, bump: 1.2, breakup: 0.18, patina: [64, 112, 92] },
  gold:           { recipe: "metal", tile: [0.5, 0.5], base: [222, 178, 88], vary: 14, rough: 0.26, metal: 1, bump: 0.8, breakup: 0.10 },
  parchment:      { recipe: "parchment", tile: [0.5, 0.5], base: [192, 166, 120], vary: 42, rough: 0.9, metal: 0, bump: 0.9, breakup: 0.14 },
  ceramic:        { recipe: "ceramic", tile: [0.7, 0.7], base: [168, 98, 62], vary: 16, rough: 0.48, metal: 0, bump: 0.7, breakup: 0.12 },
  wood:           { recipe: "wood", tile: [1.2, 2.4], base: [118, 78, 46], vary: 26, rough: 0.74, metal: 0, bump: 1.4, breakup: 0.15 },
};

// paint one kind into colour, normal and roughness canvases (W x H pixels)
function paint(kind, px, seed) {
  const K = MATERIALS[kind], W = px, H = Math.max(64, Math.round(px * K.tile[1] / K.tile[0] / 32) * 32);
  const f = RECIPES[K.recipe](seed), hgt = new Float32Array(W * H);
  const col = new Uint8ClampedArray(W * H * 4), rgh = new Uint8ClampedArray(W * H * 4), nrm = new Uint8ClampedArray(W * H * 4);
  const pat = K.patina;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [h, t] = f(x / W, y / H), i = y * W + x, o = i * 4;
    hgt[i] = h;
    let r = K.base[0] + t * K.vary, g = K.base[1] + t * K.vary, b = K.base[2] + t * K.vary;
    if (pat && t < -0.35) { const k = Math.min(1, (-0.35 - t) * 2.2); r += (pat[0] - r) * k; g += (pat[1] - g) * k; b += (pat[2] - b) * k; }
    col[o] = r; col[o + 1] = g; col[o + 2] = b; col[o + 3] = 255;
    const rv = 255 * Math.min(1, Math.max(0, K.rough + (pat && t < -0.35 ? 0.35 : 0) - t * 0.12));
    rgh[o] = rgh[o + 1] = rgh[o + 2] = rv; rgh[o + 3] = 255;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, o = i * 4;
    const dx = (hgt[y * W + (x + 1) % W] - hgt[y * W + (x - 1 + W) % W]) * K.bump, dy = (hgt[((y + 1) % H) * W + x] - hgt[((y - 1 + H) % H) * W + x]) * K.bump;
    const l = Math.hypot(dx, dy, 1);
    nrm[o] = (-dx / l * 0.5 + 0.5) * 255; nrm[o + 1] = (dy / l * 0.5 + 0.5) * 255; nrm[o + 2] = (1 / l * 0.5 + 0.5) * 255; nrm[o + 3] = 255;
  }
  const can = (data) => { const c = document.createElement("canvas"); c.width = W; c.height = H; c.getContext("2d").putImageData(new ImageData(data, W, H), 0, 0); return c; };
  return { col: can(col), nrm: can(nrm), rgh: can(rgh) };
}

// one shared breakup texture: two unrelated noise fields in red and green
let BREAKUP = null;
function breakupTexture() {
  if (BREAKUP) return BREAKUP;
  const S = 256, a = fbm(9001, 4, 3), b = fbm(9013, 4, 5), d = new Uint8ClampedArray(S * S * 4);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const o = (y * S + x) * 4; d[o] = a(x / S, y / S) * 255; d[o + 1] = b(x / S, y / S) * 255; d[o + 2] = 128; d[o + 3] = 255; }
  const c = document.createElement("canvas"); c.width = c.height = S; c.getContext("2d").putImageData(new ImageData(d, S, S), 0, 0);
  BREAKUP = new THREE.CanvasTexture(c); BREAKUP.wrapS = BREAKUP.wrapT = THREE.RepeatWrapping;
  return BREAKUP;
}

// add the world-space breakup to a standard material: colour and roughness wander over metres, not tiles
export function withBreakup(mat, amount, metres) {
  const tex = breakupTexture(), scale = 1 / (metres || 7.3);
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.kitBreakup = { value: tex }; sh.uniforms.kitAmt = { value: amount }; sh.uniforms.kitScale = { value: scale };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vKitWorld;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvKitWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vKitWorld;\nuniform sampler2D kitBreakup;\nuniform float kitAmt;\nuniform float kitScale;")
      .replace("#include <map_fragment>", "#include <map_fragment>\nvec2 kitUv = vKitWorld.xz * kitScale + vec2(vKitWorld.y * kitScale * 0.73, vKitWorld.y * kitScale * 0.41);\nvec4 kitB = texture2D(kitBreakup, kitUv) * 0.6 + texture2D(kitBreakup, kitUv * 2.37 + 0.31) * 0.4;\ndiffuseColor.rgb *= 1.0 + (kitB.r - 0.5) * 2.0 * kitAmt;")
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor * (1.0 + (kitB.g - 0.5) * 1.2 * kitAmt), 0.04, 1.0);");
  };
  mat.customProgramCacheKey = () => "kit-breakup";
  return mat;
}

const texCache = {};
// material(kind, { px, seed, breakup, tint, side }) — px: texture width (512 on phones, 1024 elsewhere).
// Textures are painted once per kind/size/seed and shared; each call returns its own material.
export function material(kind, opt) {
  const K = MATERIALS[kind]; if (!K) throw new Error("kit: no material " + kind);
  const o = opt || {}, px = o.px || defaultPx(), seed = o.seed || 1, key = kind + ":" + px + ":" + seed;
  if (!texCache[key]) {
    const p = paint(kind, px, seed), T = {};
    for (const [k, c] of Object.entries(p)) { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; if (k === "col") t.colorSpace = THREE.SRGBColorSpace; T[k] = t; }
    texCache[key] = T;
  }
  const T = texCache[key];
  const m = new THREE.MeshStandardMaterial({ map: T.col, normalMap: T.nrm, roughnessMap: T.rgh, roughness: 1, metalness: K.metal, side: o.side || THREE.FrontSide });
  if (o.tint) m.color = new THREE.Color(o.tint);
  m.userData.kitTile = K.tile;
  return o.breakup === false ? m : withBreakup(m, o.breakup == null ? K.breakup : o.breakup);
}
export const tileOf = (kind) => MATERIALS[kind].tile;
export function defaultPx() { return (window.matchMedia && window.matchMedia("(pointer:coarse)").matches) || Math.min(screen.width, screen.height) < 600 ? 512 : 1024; }

// world-metre UVs for a geometry, so a texture comes out at its true size whatever the mesh (box-projected)
export function metreUVs(geo, tile) {
  const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const u = ay >= ax && ay >= az ? p.getX(i) : ax >= az ? p.getZ(i) : p.getX(i), v = ay >= ax && ay >= az ? p.getZ(i) : p.getY(i);
    uv[i * 2] = u / tile[0]; uv[i * 2 + 1] = v / tile[1];
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

// ---------------------------------------------------------------- environment for metals
// A small studio built from plain geometry and rendered once into a prefiltered environment map.
export function studioEnvironment(renderer, warmth) {
  const scene = new THREE.Scene(), w = warmth == null ? 0.5 : warmth;
  scene.background = new THREE.Color().setRGB(0.05, 0.04, 0.03);
  const panel = (c, i, x, y, z, sx, sy) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sy), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); scene.add(m); };
  panel(new THREE.Color().setRGB(1, 0.82 + 0.1 * (1 - w), 0.6 + 0.3 * (1 - w)), 8, 4, 4, 4, 6, 4);   // warm key
  panel(0xbfcfe0, 2.4, -5, 2, 3, 6, 5);                                                              // cool fill
  panel(0xffe2b0, 3, 0, 6, -4, 10, 2);
  panel(0xd8c8a8, 1.2, 0, 1, -6, 12, 4);                                                           // back wall glow
  panel(0xd8c8a8, 1.2, 0, 1, 6, 12, 4);                                                            // front wall glow                                                              // top strip
  panel(0x2a2016, 1, 0, -3, 0, 12, 12);                                                              // floor bounce
  const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromScene(scene, 0.04);
  pm.dispose();
  return rt.texture;
}

// ---------------------------------------------------------------- light: graded rigs
// Each rig: key (colour, intensity, position), fill (hemisphere sky/ground), rim, exposure.
// grade "screen" is the reference; grade "phone" lifts shadows and exposure for a phone held in a dim room.
export const RIGS = {
  flame:   { key: [0xffb46b, 14, [1.6, 2.4, 1.8], 7], fill: [0x6a5440, 0x1a120a, 0.3], rim: [0xffd9a0, 6, [-2.5, 2.2, -2.2]], exposure: 1.0, label: "Flame light (lamps, braziers)" },
  skylight:{ key: [0xfff1dc, 2.2, [1.5, 6, 2]],    fill: [0xb8c8dc, 0x3a3024, 0.7],  rim: [0xd8e6ff, 1.2, [-3, 3, -3]],   exposure: 1.0, label: "Skylight (open court, daylight from above)" },
  gallery: { key: [0xfff4e6, 1.7, [2.5, 4, 3]],    fill: [0xd8d2c8, 0x2a241c, 0.55], rim: [0xffffff, 1.0, [-3, 2.5, -2]], exposure: 1.0, label: "Gallery (even, neutral, for study)" },
};
export const GRADES = {
  screen: { exposure: 1.0, lift: 0 },
  phone:  { exposure: 1.35, lift: 0.22 },   // shadows lifted so a dark room still reads on a phone's screen
};
// rig(scene, name, grade, opt) — adds the rig's lights to the scene and returns { lights, set(grade), dispose() }.
// opt.renderer: when given, tone mapping and exposure are set too; opt.at: a Vector3 the rig is placed round.
export function rig(scene, name, grade, opt) {
  const R = RIGS[name]; if (!R) throw new Error("kit: no rig " + name);
  const o = opt || {}, at = o.at || new THREE.Vector3(), lights = [];
  const [kc, ki, kp, kd] = R.key;
  const key = kd ? new THREE.PointLight(kc, ki, kd * 2.2, 2) : new THREE.DirectionalLight(kc, ki);
  key.position.set(at.x + kp[0], at.y + kp[1], at.z + kp[2]);
  if (key.isDirectionalLight) { key.target.position.copy(at); scene.add(key.target); }
  const hemi = new THREE.HemisphereLight(R.fill[0], R.fill[1], R.fill[2]);
  const rim = new THREE.DirectionalLight(R.rim[0], R.rim[1]); rim.position.set(at.x + R.rim[2][0], at.y + R.rim[2][1], at.z + R.rim[2][2]); rim.target.position.copy(at); scene.add(rim.target);
  const lift = new THREE.AmbientLight(0xfff0dc, 0);
  lights.push(key, hemi, rim, lift); lights.forEach((l) => scene.add(l));
  const api = {
    lights, name,
    set(g) {
      const G = GRADES[g] || GRADES.screen;
      lift.intensity = G.lift * (name === "flame" ? 1.6 : 1);
      hemi.intensity = R.fill[2] * (1 + G.lift);
      if (o.renderer) { o.renderer.toneMapping = THREE.ACESFilmicToneMapping; o.renderer.toneMappingExposure = R.exposure * G.exposure; }
      api.grade = g;
    },
    dispose() { lights.forEach((l) => { scene.remove(l); if (l.target) scene.remove(l.target); l.dispose && l.dispose(); }); },
  };
  api.set(grade || "screen");
  return api;
}

// ---------------------------------------------------------------- ground
// ground(kind, size, opt) — a square of `size` metres in true-metre UVs, with the breakup, whose edge fades into
// the background colour (opt.fadeTo) instead of ending in a hard line.
export function ground(kind, size, opt) {
  const o = opt || {}, g = new THREE.PlaneGeometry(size, size, 1, 1).rotateX(-Math.PI / 2);
  metreUVs(g, tileOf(kind));
  const m = material(kind, o);
  const fadeTo = new THREE.Color(o.fadeTo == null ? 0x0a0805 : o.fadeTo), r0 = size * 0.32, r1 = size * 0.5;
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh) => {
    prev(sh);
    sh.uniforms.kitFade = { value: fadeTo }; sh.uniforms.kitR = { value: new THREE.Vector2(r0, r1) };
    sh.fragmentShader = sh.fragmentShader.replace("uniform float kitScale;", "uniform float kitScale;\nuniform vec3 kitFade;\nuniform vec2 kitR;")
      .replace("#include <dithering_fragment>", "#include <dithering_fragment>\nfloat kitE = smoothstep(kitR.x, kitR.y, length(vKitWorld.xz));\ngl_FragColor.rgb = mix(gl_FragColor.rgb, kitFade, kitE);");
  };
  m.customProgramCacheKey = () => "kit-ground";
  const mesh = new THREE.Mesh(g, m); mesh.receiveShadow = true; mesh.name = "kit-ground";
  return mesh;
}

// ---------------------------------------------------------------- scale and camera
// The archive's human scale. Builds use these instead of private numbers, so every room and site agrees.
export const SCALE = Object.freeze({
  eye: 1.6,          // a visitor's eye height (the museum and the Pilgrimage both walk at this)
  person: 1.7,       // a standing adult
  door: 2.1,         // an ordinary doorway's height
  step: 0.18,        // one stair riser
  minFeature: 0.02,  // nothing a visitor is meant to read is modelled smaller than 2 cm at close zoom
});
// A person-height marker (a plain column topped by a head), for benches and review shots only: it shows the
// scale of a piece at a glance. Never placed in a public room.
export function scaleFigure() {
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: 0x6b6355, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.45, 16), m); body.position.y = 0.725;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), m); head.position.y = 1.58;
  g.add(body, head); g.name = "kit-scale-figure";
  return g;
}
// Frame an object: the camera stands at eye height or above, never below the object's base, at the distance
// that fits the object's bounding sphere in the vertical field of view with a margin.
export function frame(camera, object, opt) {
  const o = opt || {}, box = new THREE.Box3().setFromObject(object), s = box.getBoundingSphere(new THREE.Sphere());
  const fov = THREE.MathUtils.degToRad(camera.fov), aspect = camera.aspect || 1;
  const fit = s.radius * (o.margin || 1.15) / Math.sin(Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * aspect)) / 2);
  const yaw = o.yaw == null ? 0.6 : o.yaw, y = Math.max(box.min.y + SCALE.eye * 0.5, s.center.y + fit * (o.pitch == null ? 0.18 : o.pitch));
  camera.position.set(s.center.x + Math.sin(yaw) * fit, y, s.center.z + Math.cos(yaw) * fit);
  camera.lookAt(s.center); camera.updateProjectionMatrix();
  return { center: s.center, distance: fit };
}

export const KIT_VERSION = 1;
