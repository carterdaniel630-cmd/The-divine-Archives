/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: the reliquary of Saint-Maximin (V88)

   A modelled rendition, NOT a replica, of the gilded-bronze reliquary of 1860
   in the crypt of the basilica of Saint-Maximin-la-Sainte-Baume, after the
   published descriptions and a photograph of it. It is built from code:
   - a long gilded plinth on claw feet, with a chased rosette frieze, two
     enamelled shields and a Gothic niche;
   - four winged angels in pleated robes, bare-footed, lifting a gilded bust
     with a collar and clasp and long waved hair;
   - the bust's hood of gold framing the darkened skull behind glass, with a
     red wax seal;
   - between the angels, a small columned and domed shrine holding the glass
     vial of the "noli me tangere".

   The gilding is worn: rubbed through to bronze on the high points, tarnished
   in the recesses, scratched and chased, all as procedural textures (colour,
   roughness and relief). In the inspector the piece stands in a limestone
   niche under a warm key light that casts soft shadows, on a polished floor
   that reflects it, with candle light flickering below.
   ========================================================================== */
import * as THREE from "three";

const TAU = Math.PI * 2;
function rng(seed) { let s = seed || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------------------------------------------------------------- tileable noise
function hash(i, j, s) { let n = (i * 374761393 + j * 668265263 + s * 1442695041) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
function vnoise(x, y, P, s) {                               // value noise that wraps every P cells
  const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
  const w = (k) => ((k % P) + P) % P;
  const n00 = hash(w(i), w(j), s), n10 = hash(w(i + 1), w(j), s), n01 = hash(w(i), w(j + 1), s), n11 = hash(w(i + 1), w(j + 1), s);
  return n00 + (n10 - n00) * a + (n01 - n00) * b + (n00 - n10 - n01 + n11) * a * b;
}
function fbm(u, v, P, s, oct) { let f = 0, amp = 0.5, p = P; for (let o = 0; o < (oct || 4); o++) { f += amp * vnoise(u * p, v * p, p, s + o * 7); amp *= 0.5; p *= 2; } return f / (1 - Math.pow(0.5, oct || 4)); }

// height field -> tangent-space normal map
function normalFrom(H, W, Hh, strength) {
  const c = document.createElement("canvas"); c.width = W; c.height = Hh;
  const g = c.getContext("2d"), img = g.createImageData(W, Hh), d = img.data, at = (x, y) => H[((y + Hh) % Hh) * W + ((x + W) % W)];
  for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
    let nx = (at(x - 1, y) - at(x + 1, y)) * strength, ny = (at(x, y + 1) - at(x, y - 1)) * strength, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const o = (y * W + x) * 4; d[o] = (nx * 0.5 + 0.5) * 255; d[o + 1] = (ny * 0.5 + 0.5) * 255; d[o + 2] = (nz * 0.5 + 0.5) * 255; d[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}
function toTex(W, H, fill, srgb) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d"), img = g.createImageData(W, H);
  for (let i = 0; i < W * H; i++) { const [r, gg, b] = fill(i); const o = i * 4; img.data[o] = r; img.data[o + 1] = gg; img.data[o + 2] = b; img.data[o + 3] = 255; }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}

// ---------------------------------------------------------------- worn gilding
// colour: gold, darkened by tarnish in broad patches, rubbed through to bronze in others, with fine
// scratches; roughness: burnished where rubbed, dull where tarnished; relief: a chased, hammered skin
function giltTextures(N, tint) {
  const H = new Float32Array(N * N), T = new Float32Array(N * N), Wm = new Float32Array(N * N), F = new Float32Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N, i = y * N + x;
    T[i] = smooth(0.5, 0.72, fbm(u, v, 4, 11, 5));                                 // tarnish
    Wm[i] = smooth(0.6, 0.78, fbm(u, v, 6, 23, 5));                                // rubbed through
    F[i] = fbm(u, v, 32, 5, 3);                                                     // hammered skin
    H[i] = F[i] * 0.6 - Wm[i] * 0.25;
  }
  const R = rng(91), S = new Float32Array(N * N);                                   // scratches
  for (let k = 0; k < 160; k++) {
    let x = R() * N, y = R() * N; const a = R() * TAU, len = 10 + R() * 60, depth = 0.3 + R() * 0.7;
    for (let s = 0; s < len; s++) { const xi = ((Math.round(x) % N) + N) % N, yi = ((Math.round(y) % N) + N) % N, i = yi * N + xi; S[i] = Math.max(S[i], depth * 0.7); H[i] -= 0.22 * depth; x += Math.cos(a + Math.sin(s * 0.05) * 0.2); y += Math.sin(a + Math.sin(s * 0.05) * 0.2); }
  }
  const gold = tint || [0.86, 0.66, 0.32], tarn = [0.3, 0.22, 0.11], bronze = [0.6, 0.38, 0.19];
  const map = toTex(N, N, (i) => {
    const f = 0.9 + 0.2 * F[i];
    let c = gold.map((g) => g * f);
    c = c.map((g, k) => g + (tarn[k] - g) * T[i] * 0.62);
    c = c.map((g, k) => g + (bronze[k] - g) * Wm[i] * 0.75);
    c = c.map((g) => g * (1 - S[i] * 0.25));
    return c.map((g) => Math.round(Math.pow(Math.max(0, Math.min(1, g)), 1 / 2.2) * 255));
  }, true);
  const rough = toTex(N, N, (i) => { const r = 0.2 + 0.32 * T[i] - 0.06 * Wm[i] + 0.06 * F[i] + 0.25 * S[i]; const b = Math.round(Math.max(0.08, Math.min(0.9, r)) * 255); return [b, b, b]; });
  return { map, rough, normal: normalFrom(H, N, N, 2.2) };
}
// the plinth's frieze: rosettes and running scrolls in relief, chased into the gilding
function friezeTextures() {
  const W = 1024, Hh = 160, c = document.createElement("canvas"); c.width = W; c.height = Hh;
  const g = c.getContext("2d");
  g.fillStyle = "#555"; g.fillRect(0, 0, W, Hh);
  const R = rng(4);
  g.fillStyle = "#9a9a9a"; g.fillRect(0, 10, W, 8); g.fillRect(0, Hh - 18, W, 8);          // fillets
  for (let x = 40; x < W; x += 92) {
    const cx = x, cy = Hh / 2;
    const gr = g.createRadialGradient(cx, cy, 2, cx, cy, 40); gr.addColorStop(0, "#fff"); gr.addColorStop(0.35, "#bbb"); gr.addColorStop(0.7, "#8a8a8a"); gr.addColorStop(1, "#555");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 38, 0, TAU); g.fill();
    for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; g.fillStyle = "#e8e8e8"; g.beginPath(); g.ellipse(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22, 10, 4.5, a, 0, TAU); g.fill(); }
    g.fillStyle = "#fff"; g.beginPath(); g.arc(cx, cy, 7, 0, TAU); g.fill();
    // running scroll between rosettes
    g.strokeStyle = "#cfcfcf"; g.lineWidth = 3.5; g.beginPath(); g.moveTo(cx + 40, cy); g.bezierCurveTo(cx + 52, cy - 30, cx + 64, cy + 30, cx + 52, cy); g.stroke();
    for (let k = 0; k < 3; k++) { g.fillStyle = "#d8d8d8"; g.beginPath(); g.ellipse(cx + 46 + k * 5, cy - 18 + k * 16, 6, 2.5, R() * 3, 0, TAU); g.fill(); }
  }
  const px = g.getImageData(0, 0, W, Hh).data, H = new Float32Array(W * Hh);
  for (let i = 0; i < W * Hh; i++) H[i] = px[i * 4] / 255 + (hash(i % W, (i / W) | 0, 3) - 0.5) * 0.04;
  const map = toTex(W, Hh, (i) => { const h = H[i], dark = [0.28, 0.19, 0.08], gold = [0.9, 0.7, 0.34], k = smooth(0.3, 0.85, h), w = smooth(0.8, 0.98, h) * 0.3; return dark.map((d, j) => Math.round(Math.pow(Math.min(1, (d + (gold[j] - d) * k) * (1 - w) + [0.62, 0.4, 0.2][j] * w), 1 / 2.2) * 255)); }, true);
  const rough = toTex(W, Hh, (i) => { const b = Math.round((0.55 - 0.35 * H[i]) * 255); return [b, b, b]; });
  return { map, rough, normal: normalFrom(H, W, Hh, 5) };
}
// limestone for the niche, marble for the plinth top, polished dark stone for the floor
function stoneTextures(kind) {
  const N = 512;
  if (kind === "lime") {
    const H = new Float32Array(N * N);
    const map = toTex(N, N, (i) => { const x = i % N, y = (i / N) | 0, u = x / N, v = y / N, n = fbm(u, v, 3, 31, 6), s = smooth(0.6, 0.8, fbm(u, v, 5, 37, 4));
      // ashlar courses: four rows of three blocks a tile, staggered, with sunken mortar joints
      const row = Math.floor(v * 4), bu = u * 3 + (row % 2) * 0.5, jv = Math.abs(v * 4 - Math.round(v * 4)), ju = Math.abs(bu - Math.round(bu)) / 3 * 4;
      const joint = 1 - smooth(0.012, 0.03, Math.min(jv, ju)), tone = hash(Math.floor(bu) % 3, row, 59) * 0.08;
      H[i] = n - joint * 0.7; const b = (0.5 + 0.22 * n - 0.26 * s - tone) * (1 - joint * 0.45); return [b * 0.86, b * 0.74, b * 0.56].map((q) => Math.round(Math.pow(Math.max(0, q), 1 / 2.2) * 255)); }, true);
    return { map, normal: normalFrom(H, N, N, 3) };
  }
  if (kind === "marble") {
    return { map: toTex(N, N, (i) => { const x = i % N, y = (i / N) | 0, u = x / N, v = y / N, vein = Math.abs(Math.sin((u * 3 + fbm(u, v, 4, 43, 5) * 2.2) * Math.PI)), b = 0.84 - 0.2 * Math.pow(1 - vein, 8) - 0.06 * fbm(u, v, 8, 47, 3); return [b, b * 0.96, b * 0.9].map((q) => Math.round(Math.pow(q, 1 / 2.2) * 255)); }, true) };
  }
  return { map: toTex(N, N, (i) => { const x = i % N, y = (i / N) | 0, u = x / N, v = y / N, b = 0.08 + 0.05 * fbm(u, v, 4, 53, 5); return [b * 1.1, b * 0.95, b * 0.8].map((q) => Math.round(Math.pow(q, 1 / 2.2) * 255)); }, true) };
}

// ---------------------------------------------------------------- materials (built once per environment)
const CACHE = new Map();
function materials(env) {
  if (CACHE.has(env)) return CACHE.get(env);
  const gt = giltTextures(512), gd = giltTextures(512, [0.72, 0.52, 0.24]), fr = friezeTextures();
  const phys = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ envMap: env, envMapIntensity: 1.25 }, o));
  const M = {
    gilt: phys({ color: "#ffffff", map: gt.map, roughnessMap: gt.rough, roughness: 1, metalness: 1, normalMap: gt.normal, normalScale: new THREE.Vector2(0.55, 0.55) }),
    giltDark: phys({ color: "#ffffff", map: gd.map, roughnessMap: gd.rough, roughness: 1, metalness: 1, normalMap: gd.normal, normalScale: new THREE.Vector2(0.45, 0.45) }),
    frieze: phys({ color: "#ffffff", map: fr.map, roughnessMap: fr.rough, roughness: 1, metalness: 1, normalMap: fr.normal, normalScale: new THREE.Vector2(1.4, 1.4) }),
    marble: phys({ map: stoneTextures("marble").map, roughness: 0.34, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.4 }),
    glass: phys({ color: "#0e1214", roughness: 0.03, metalness: 0, transparent: true, opacity: 0.12, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false }),
    skull: phys({ vertexColors: true, color: "#30251c", roughness: 0.86, metalness: 0, envMapIntensity: 0.4 }),
    bone: phys({ color: "#2c2219", roughness: 0.7, metalness: 0, envMapIntensity: 0.4 }),
    cloth: phys({ color: "#120204", roughness: 0.9, metalness: 0, sheen: 0.1, sheenColor: new THREE.Color("#6a2a3a"), sheenRoughness: 0.5, envMapIntensity: 0.3 }),
    wax: phys({ color: "#420707", roughness: 0.45, metalness: 0, clearcoat: 0.6, envMapIntensity: 0.8 }),
    socket: phys({ color: "#0c0704", roughness: 1, metalness: 0, envMapIntensity: 0.1 }),
    relic: phys({ color: "#4a2a1c", roughness: 0.9, metalness: 0, envMapIntensity: 0.3 })
  };
  Object.values(M).forEach((m) => { m.userData.shared = true; });   // cached: a museum wing that drops its exhibits must not dispose these
  CACHE.set(env, M);
  return M;
}
function enamel(env, kind) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 320; const g = c.getContext("2d");
  const lily = (x, y, s) => {                                                    // a fleur-de-lis
    g.beginPath(); g.moveTo(x, y - 18 * s); g.bezierCurveTo(x + 7 * s, y - 8 * s, x + 6 * s, y, x, y + 4 * s); g.bezierCurveTo(x - 6 * s, y, x - 7 * s, y - 8 * s, x, y - 18 * s); g.fill();
    [-1, 1].forEach((d) => { g.beginPath(); g.moveTo(x + d * 3 * s, y); g.bezierCurveTo(x + d * 16 * s, y - 14 * s, x + d * 20 * s, y + 2 * s, x + d * 9 * s, y + 6 * s); g.bezierCurveTo(x + d * 14 * s, y - 2 * s, x + d * 8 * s, y - 4 * s, x + d * 3 * s, y + 3 * s); g.fill(); });
    g.fillRect(x - 10 * s, y + 5 * s, 20 * s, 4 * s); g.beginPath(); g.moveTo(x - 4 * s, y + 9 * s); g.lineTo(x, y + 18 * s); g.lineTo(x + 4 * s, y + 9 * s); g.fill();
  };
  if (kind === "left") {                                                         // paly of gold and red beside a blue field with gold lilies
    for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "#c9a24a" : "#a8202a"; g.fillRect(i * 21, 0, 21, 320); }
    g.fillStyle = "#23479e"; g.fillRect(128, 0, 128, 320); g.fillStyle = "#e3c25e"; [[160, 60], [220, 60], [190, 130], [160, 200], [220, 200], [190, 270]].forEach(([x, y]) => lily(x, y, 0.9));
    g.fillStyle = "#a8202a"; g.fillRect(128, 0, 128, 34);
  } else {                                                                       // blue with gold lilies and a red label
    g.fillStyle = "#23479e"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#e3c25e";
    [[64, 120], [128, 120], [192, 120], [96, 200], [160, 200], [128, 272]].forEach(([x, y]) => lily(x, y, 1.1));
    g.fillStyle = "#b52024"; g.fillRect(24, 28, 208, 16); [60, 120, 180].forEach((x) => g.fillRect(x, 28, 20, 44));
  }
  const R = rng(kind === "left" ? 5 : 6);                                        // chips in the enamel, showing the metal
  for (let i = 0; i < 26; i++) { g.fillStyle = "rgba(170,120,60,.85)"; g.beginPath(); g.arc(R() * 256, R() * 320, 1 + R() * 3.5, 0, TAU); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMap: env, envMapIntensity: 1 });
}

// ---------------------------------------------------------------- geometry assembly (merged per material)
class Parts {
  constructor() { this.m = {}; this.o = new THREE.Object3D(); }
  add(key, geo, p, r, s) {
    const o = this.o; o.position.set(p ? p[0] : 0, p ? p[1] : 0, p ? p[2] : 0); o.rotation.set(r ? r[0] : 0, r ? r[1] : 0, r ? r[2] : 0, r && r[3] || "XYZ");
    if (s == null) o.scale.set(1, 1, 1); else if (typeof s === "number") o.scale.setScalar(s); else o.scale.set(s[0], s[1], s[2]);
    o.updateMatrix(); geo.applyMatrix4(o.matrix);
    (this.m[key] || (this.m[key] = [])).push(geo); return geo;
  }
  addMatrix(key, geo, m) { geo.applyMatrix4(m); (this.m[key] || (this.m[key] = [])).push(geo); }
  absorb(other, m) { for (const k of Object.keys(other.m)) other.m[k].forEach((g) => this.addMatrix(k, g, m)); }
  build(mats, shadows) {
    const g = new THREE.Group();
    for (const k of Object.keys(this.m)) {
      const mesh = new THREE.Mesh(merge(this.m[k]), mats[k]);
      mesh.castShadow = shadows; mesh.receiveShadow = shadows; mesh.name = k; g.add(mesh);
    }
    return g;
  }
}
function merge(list) {
  let n = 0; const hasCol = list.some((g) => g.attributes.color);
  const parts = list.map((g) => { const q = g.index ? g.toNonIndexed() : g; if (!q.attributes.normal) q.computeVertexNormals(); n += q.attributes.position.count; return q; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), col = hasCol ? new Float32Array(n * 3).fill(1) : null; let o = 0;
  parts.forEach((q) => {
    const c = q.attributes.position.count;
    pos.set(q.attributes.position.array, o * 3); nor.set(q.attributes.normal.array, o * 3);
    if (q.attributes.uv) uv.set(q.attributes.uv.array, o * 2);
    if (col && q.attributes.color) col.set(q.attributes.color.array, o * 3);
    o += c;
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  if (col) g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeBoundingSphere(); return g;
}
const V2 = (a) => a.map((p) => new THREE.Vector2(p[0], p[1]));
const lathe = (prof, seg) => new THREE.LatheGeometry(V2(prof), seg || 48);
function tube(pts, r, seg, rs, closed) { return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])), !!closed), seg || 32, r, rs || 8, !!closed); }

// ---------------------------------------------------------------- the skull
function skullGeometry() {
  const g = new THREE.SphereGeometry(0.1, 176, 132), P = g.attributes.position, col = [], R = rng(17), v = new THREE.Vector3();
  const bump = (x, y, cx, cy, wx, wy) => Math.exp(-(((x - cx) * (x - cx)) / (wx * wx) + ((y - cy) * (y - cy)) / ((wy || wx) * (wy || wx))));
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).normalize();
    const front = Math.max(0, v.z), low = Math.max(0, -v.y);                        // faces +z
    let r = 1, dark = 0;
    r *= 1 + 0.1 * Math.max(0, -v.z);                                                // the long back of the cranium
    r *= 1 - 0.34 * low * low * (0.35 + 0.65 * front);                               // the face narrows below the cheekbones
    r *= 1 + 0.06 * front * bump(v.x, v.y, 0, 0.22, 0.5, 0.08);                      // brow ridge
    r *= 1 + 0.07 * (bump(v.x, v.y, 0.62, -0.18, 0.12) + bump(v.x, v.y, -0.62, -0.18, 0.12)) * (0.3 + front);   // cheekbones
    r *= 1 - 0.05 * (bump(v.x, v.y, 0.8, 0.1, 0.18) + bump(v.x, v.y, -0.8, 0.1, 0.18));                           // temples
    if (front > 0.3) {
      // orbits: rounded squares with a sharp rim, deep and dark; the nasal aperture an inverted pear; the maxilla forward
      const orbit = (cx) => { const dx = (v.x - cx) / 0.17, dy = (v.y - 0.02) / 0.14, d = Math.pow(Math.pow(Math.abs(dx), 2.4) + Math.pow(Math.abs(dy), 2.4), 1 / 2.4); return 1 - smooth(0.6, 1.02, d); };
      const eyes = Math.max(orbit(0.3), orbit(-0.3)), rimE = Math.max(0, bump(v.x, v.y, 0.3, 0.02, 0.2, 0.17) + bump(v.x, v.y, -0.3, 0.02, 0.2, 0.17) - eyes);
      const ny = (v.y + 0.25) / 0.13, nw = 0.055 + 0.06 * smooth(-1, 1, -ny), nose = Math.abs(ny) < 1 ? 1 - smooth(0.6, 1, Math.abs(v.x) / nw) : 0;
      const maxilla = bump(v.x, v.y, 0, -0.44, 0.22, 0.08);
      r *= (1 - 0.42 * eyes * front) * (1 - 0.3 * nose * front) * (1 + 0.05 * maxilla + 0.02 * rimE);
      dark = Math.min(1, eyes * 1.2 + nose * 1.2);
    }
    P.setXYZ(i, v.x * 0.84 * r * 0.1, v.y * 0.98 * r * 0.1, v.z * 1.08 * r * 0.1);
    const n = fbm(v.x * 0.5 + 0.5, v.y * 0.5 + 0.5, 6, 3, 4), k = 1 - dark * 0.9, grime = 0.75 + 0.45 * n;
    col.push(0.26 * grime * k, 0.18 * grime * k, 0.11 * grime * k);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return g;
}

// ---------------------------------------------------------------- an angel (faces +z; its right side is -x)
function feather(L, w, bend) {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(w, L * 0.25, w * 0.85, L * 0.7); s.quadraticCurveTo(w * 0.5, L * 0.98, 0, L); s.quadraticCurveTo(-w * 0.55, L * 0.9, -w * 0.6, L * 0.6); s.quadraticCurveTo(-w * 0.5, L * 0.2, 0, 0);
  const g = new THREE.ShapeGeometry(s, 6), P = g.attributes.position;
  for (let i = 0; i < P.count; i++) { const y = P.getY(i), x = P.getX(i); P.setZ(i, bend * Math.pow(y / L, 2) + Math.abs(x) * 0.12); }   // curved, with a raised shaft
  g.computeVertexNormals();
  // two-sided: a back face with reversed winding, a hair behind the front one
  const n = P.count, pos = new Float32Array(n * 6), nor = new Float32Array(n * 6), N0 = g.attributes.normal, I = g.index.array, idx = [];
  for (let i = 0; i < n; i++) { pos.set([P.getX(i), P.getY(i), P.getZ(i)], i * 3); pos.set([P.getX(i), P.getY(i), P.getZ(i) - 0.0012], (n + i) * 3); nor.set([N0.getX(i), N0.getY(i), N0.getZ(i)], i * 3); nor.set([-N0.getX(i), -N0.getY(i), -N0.getZ(i)], (n + i) * 3); }
  for (let k = 0; k < I.length; k += 3) { idx.push(I[k], I[k + 1], I[k + 2]); idx.push(n + I[k], n + I[k + 2], n + I[k + 1]); }
  const d = new THREE.BufferGeometry(); d.setAttribute("position", new THREE.BufferAttribute(pos, 3)); d.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  const uv = g.attributes.uv.array, uv2 = new Float32Array(uv.length * 2); uv2.set(uv); uv2.set(uv, uv.length); d.setAttribute("uv", new THREE.BufferAttribute(uv2, 2));
  d.setIndex(idx); g.dispose(); return d;
}
function wingParts(p, side, spread) {
  // a folded wing standing up behind the shoulder, in the plane (u back, v up): the leading edge rises from the
  // shoulder to the wrist; the primaries hang from the wrist nearly to the hem, the secondaries from the arm,
  // and three rows of coverts overlap their roots
  const w = new Parts(), R = rng(side > 0 ? 41 : 43), S = [0, 0.47], Wr = [0.12, 0.7];
  const along = (t) => [S[0] + (Wr[0] - S[0]) * t + Math.sin(t * Math.PI) * 0.02, S[1] + (Wr[1] - S[1]) * t];
  const place = (uv, ang, geo, key, layer) => w.add(key, geo, [uv[0], uv[1], layer * 0.0035], [0, 0, ang]);
  // a feather's +y is turned by PI + d: it then points down, leaning back by d
  for (let i = 0; i < 12; i++) { const t = i / 11; place(along(0.62 + t * 0.38), Math.PI + 0.08 + t * 0.26, feather(0.3 + t * 0.16, 0.03, 0.03), R() < 0.3 ? "giltDark" : "gilt", 0); }   // primaries
  for (let i = 0; i < 12; i++) { const t = i / 11; place(along(0.05 + t * 0.58), Math.PI + 0.02 + t * 0.1, feather(0.2 + t * 0.12, 0.028, 0.02), R() < 0.25 ? "giltDark" : "gilt", 1); }  // secondaries
  for (let row = 0; row < 3; row++) for (let i = 0; i < 12; i++) { const t = i / 11, uv = along(0.04 + t * 0.94); place([uv[0] - 0.004, uv[1] - 0.01 - row * 0.035], Math.PI + 0.06 + t * 0.2, feather(0.09 - row * 0.015, 0.02, 0.008), row % 2 ? "giltDark" : "gilt", 2 + row); }   // coverts
  const edge = []; for (let k = 0; k <= 8; k++) { const uv = along(k / 8); edge.push([uv[0], uv[1] + 0.004, 0.012]); }
  w.add("gilt", tube(edge, 0.011, 30, 8));                                                                             // the leading edge
  const o = new THREE.Object3D(); o.position.set(p[0], p[1], p[2]); o.rotation.set(0, Math.PI / 2 + spread, 0); o.updateMatrix();
  return { parts: w, matrix: o.matrix };
}
function angelParts(side, handTargets, q) {
  const a = new Parts(), R = rng(side > 0 ? 7 : 13);
  // robe: pleated, flaring to the floor, the hem lifting over a bare foot
  const prof = [[0, 0], [0.105, 0], [0.11, 0.02], [0.095, 0.14], [0.078, 0.28], [0.066, 0.38], [0.072, 0.45], [0.06, 0.5], [0.032, 0.53], [0, 0.535]];
  const lg = lathe(prof, q > 1 ? 96 : 64), P = lg.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const ang = Math.atan2(v.z, v.x), low = 1 - Math.min(1, v.y / 0.47); const k = 1 + 0.09 * low * Math.sin(ang * 24 + v.y * 6) + 0.025 * Math.sin(ang * 9); P.setXYZ(i, v.x * k, v.y + (v.z > 0.06 && v.y < 0.04 ? 0.02 : 0), v.z * k * 0.8); }
  lg.computeVertexNormals(); a.add("gilt", lg);
  // an over-mantle falling from the shoulders down the back
  const ml = new THREE.LatheGeometry(V2([[0.07, 0.5], [0.09, 0.42], [0.1, 0.3], [0.11, 0.16], [0.115, 0.06]]), 40, Math.PI * 0.55, Math.PI * 0.9), MP = ml.attributes.position;
  for (let i = 0; i < MP.count; i++) { v.fromBufferAttribute(MP, i); const ang = Math.atan2(v.z, v.x); const k = 1 + 0.08 * Math.sin(ang * 16) * (1 - v.y); MP.setXYZ(i, v.x * k, v.y, v.z * k * 0.82); }
  ml.computeVertexNormals(); a.add("giltDark", ml);
  // bare foot at the hem, toes forward
  a.add("gilt", new THREE.SphereGeometry(0.02, 14, 10), [side * 0.03, 0.012, 0.085], null, [1, 0.55, 1.9]);
  for (let t = 0; t < 4; t++) a.add("gilt", new THREE.SphereGeometry(0.006, 8, 6), [side * 0.03 + (t - 1.5) * 0.008, 0.008, 0.118]);
  // head bowed toward the bust, with a face and a crown of curls
  const head = [0, 0.585, 0.02];
  a.add("gilt", new THREE.SphereGeometry(0.04, 28, 20), head, null, [0.92, 1.05, 1]);
  a.add("gilt", new THREE.SphereGeometry(0.009, 10, 8), [0, head[1] - 0.004, head[2] + 0.04], null, [0.8, 1.2, 1]);   // nose
  a.add("gilt", new THREE.CylinderGeometry(0.02, 0.024, 0.05, 16), [0, 0.535, 0.012]);                              // neck
  for (let i = 0; i < (q > 1 ? 44 : 26); i++) { const th = R() * TAU, ph = R() * 1.3 - 0.2; if (Math.sin(th) > 0.55 && ph < 0.6) continue; a.add(R() < 0.4 ? "giltDark" : "gilt", new THREE.TorusGeometry(0.009, 0.0045, 6, 12), [head[0] + Math.cos(th) * Math.cos(ph) * 0.042, head[1] + Math.sin(ph) * 0.04 + 0.006, head[2] + Math.sin(th) * Math.cos(ph) * 0.04], [R() * 3, R() * 3, 0]); }
  // arms reaching to the bust, each in a wide falling sleeve
  handTargets.forEach((t, k) => {
    const sh = [side * 0.055 * (k ? -1 : 1) * 0.7, 0.5, 0.01], el = [(sh[0] + t[0]) / 2 + side * 0.02, (sh[1] + t[1]) / 2 - 0.05, (sh[2] + t[2]) / 2];
    a.add("gilt", tube([sh, el, t], 0.016, 24, 10));
    a.add("gilt", new THREE.SphereGeometry(0.014, 12, 10), t, null, [1.3, 0.8, 1]);                                     // hand
    for (let f = 0; f < 4; f++) a.add("gilt", new THREE.CapsuleGeometry(0.003, 0.018, 3, 6), [t[0] + (f - 1.5) * 0.006, t[1] + 0.006, t[2] + 0.012], [-1.2, 0, 0]);
    // sleeve: a pleated open cone hanging from the forearm
    const sl = new THREE.ConeGeometry(0.045, 0.2, 24, 1, true), SP = sl.attributes.position;
    for (let i = 0; i < SP.count; i++) { v.fromBufferAttribute(SP, i); const ang = Math.atan2(v.z, v.x), k2 = 1 + 0.18 * Math.sin(ang * 8); SP.setXYZ(i, v.x * k2, v.y, v.z * k2); }
    sl.computeVertexNormals(); a.add("giltDark", sl, [el[0], el[1] - 0.09, el[2]], [0.3, 0, side * 0.2]);
  });
  // wings
  [-1, 1].forEach((k) => { const W = wingParts([k * 0.035, 0, -0.05], side, -k * 0.32); a.absorb(W.parts, W.matrix); });
  return a;
}

// ---------------------------------------------------------------- the whole reliquary
export function buildReliquary(env, quality) {
  const q = quality || 1, M = materials(env), P = new Parts(), R = rng(88);
  const mats = Object.assign({}, M, { enamelL: enamel(env, "left"), enamelR: enamel(env, "right") });
  const PW = 1.1, PD = 0.46, FY = 0.075, PH = 0.16;

  // ---- plinth: claw feet, moulded base, chased frieze, leaf cornice, marble top
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const x = sx * (PW / 2 - 0.07), z = sz * (PD / 2 - 0.06);
    P.add("gilt", new THREE.SphereGeometry(0.045, 20, 14), [x, 0.03, z], null, [1.2, 0.7, 1]);                        // the ball
    for (let c = 0; c < 3; c++) { const a = (c - 1) * 0.7 + (sz > 0 ? 0 : Math.PI); P.add("giltDark", tube([[x, 0.07, z], [x + Math.sin(a) * 0.035, 0.05, z + Math.cos(a) * 0.035], [x + Math.sin(a) * 0.05, 0.012, z + Math.cos(a) * 0.05]], 0.008, 12, 6)); }   // talons
    P.add("gilt", new THREE.TorusGeometry(0.035, 0.013, 10, 20, Math.PI * 1.3), [x + sx * 0.025, FY - 0.005, z], [0, Math.PI / 2, 0]);   // scroll
  });
  P.add("giltDark", new THREE.BoxGeometry(PW, 0.02, PD), [0, FY, 0]);
  P.add("gilt", new THREE.CylinderGeometry(0.014, 0.014, PW + 0.01, 12), [0, FY + 0.014, PD / 2], [0, 0, Math.PI / 2]);        // half-round moulding
  P.add("gilt", new THREE.CylinderGeometry(0.014, 0.014, PW + 0.01, 12), [0, FY + 0.014, -PD / 2], [0, 0, Math.PI / 2]);
  const fh = PH - 0.05, fy = FY + 0.03 + fh / 2;
  P.add("frieze", new THREE.PlaneGeometry(PW - 0.02, fh), [0, fy, PD / 2 - 0.009]);
  P.add("frieze", new THREE.PlaneGeometry(PW - 0.02, fh), [0, fy, -PD / 2 + 0.009], [0, Math.PI, 0]);
  P.add("frieze", new THREE.PlaneGeometry(PD - 0.02, fh), [PW / 2 - 0.009, fy, 0], [0, Math.PI / 2, 0], [1, 1, 1]);
  P.add("frieze", new THREE.PlaneGeometry(PD - 0.02, fh), [-PW / 2 + 0.009, fy, 0], [0, -Math.PI / 2, 0]);
  P.add("giltDark", new THREE.BoxGeometry(PW - 0.03, fh, PD - 0.03), [0, fy, 0]);
  // cornice: ovolo and fillet
  P.add("gilt", new THREE.BoxGeometry(PW + 0.02, 0.018, PD + 0.02), [0, FY + PH - 0.012, 0]);
  [[0, PD / 2 + 0.012, PW + 0.03, 0], [0, -PD / 2 - 0.012, PW + 0.03, 0]].forEach(([x, z, L]) => P.add("gilt", new THREE.CylinderGeometry(0.012, 0.012, L, 12, 1, false, 0, Math.PI), [x, FY + PH + 0.002, z], [0, 0, Math.PI / 2]));
  P.add("marble", new THREE.BoxGeometry(PW - 0.04, 0.014, PD - 0.04), [0, FY + PH + 0.012, 0]);
  const TOP = FY + PH + 0.019;
  // the Gothic niche at the centre of the frieze, with a small standing figure
  const nz = PD / 2 + 0.006;
  P.add("giltDark", new THREE.BoxGeometry(0.13, fh + 0.02, 0.014), [0, fy, nz]);
  const gable = new THREE.Shape(); gable.moveTo(-0.075, 0); gable.lineTo(0.075, 0); gable.lineTo(0, 0.06); gable.closePath();
  P.add("gilt", new THREE.ExtrudeGeometry(gable, { depth: 0.012, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.002, bevelSegments: 2 }), [0, fy + fh / 2 + 0.005, nz - 0.004]);
  [-0.07, 0.07].forEach((x) => { P.add("gilt", new THREE.CylinderGeometry(0.006, 0.006, fh + 0.04, 8), [x, fy + 0.01, nz + 0.006]); P.add("gilt", new THREE.ConeGeometry(0.01, 0.035, 6), [x, fy + fh / 2 + 0.045, nz + 0.006]); });
  P.add("gilt", lathe([[0, 0], [0.018, 0], [0.014, 0.04], [0.011, 0.07], [0.008, 0.078], [0, 0.08]], 20), [0, fy - fh / 2 + 0.005, nz + 0.012]);
  P.add("gilt", new THREE.SphereGeometry(0.009, 12, 8), [0, fy - fh / 2 + 0.094, nz + 0.012]);
  // the two enamelled shields, each in a gilt rim
  const sh = new THREE.Shape(); sh.moveTo(-0.05, 0.055); sh.lineTo(0.05, 0.055); sh.lineTo(0.05, -0.005); sh.quadraticCurveTo(0.05, -0.05, 0, -0.066); sh.quadraticCurveTo(-0.05, -0.05, -0.05, -0.005); sh.closePath();
  [[-0.36, "enamelL"], [0.36, "enamelR"]].forEach(([x, key]) => {
    P.add("gilt", new THREE.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.003, bevelSegments: 2 }), [x, fy, nz - 0.004], null, [1.12, 1.1, 1]);
    const face = new THREE.ShapeGeometry(sh, 12), uv = face.attributes.uv, pp = face.attributes.position;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pp.getX(i) + 0.05) / 0.1, (pp.getY(i) + 0.066) / 0.121);
    P.add(key, face, [x, fy, nz + 0.0068]);                                                             // just proud of the rim's bevel
  });

  // ---- the little shrine between the angels
  const sy = TOP;
  P.add("gilt", lathe([[0, 0], [0.13, 0], [0.132, 0.012], [0.12, 0.02], [0.118, 0.03], [0.105, 0.036], [0.1, 0.05], [0, 0.05]], 64), [0, sy, 0]);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; P.add("giltDark", new THREE.SphereGeometry(0.006, 8, 6), [Math.cos(a) * 0.124, sy + 0.022, Math.sin(a) * 0.124]); }   // beading
  const colR = 0.078, colH = 0.24;
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * TAU + Math.PI / 4, x = Math.cos(a) * colR, z = Math.sin(a) * colR;
    P.add("gilt", lathe([[0, 0], [0.016, 0], [0.016, 0.008], [0.011, 0.014], [0, 0.014]], 16), [x, sy + 0.05, z]);         // base
    const shaft = new THREE.CylinderGeometry(0.0075, 0.0085, colH, 12); P.add("gilt", shaft, [x, sy + 0.064 + colH / 2, z]);
    P.add("gilt", lathe([[0, 0], [0.009, 0], [0.016, 0.018], [0.018, 0.024], [0, 0.024]], 16), [x, sy + 0.064 + colH, z]);  // capital
  }
  // pointed arches between the columns
  for (let i = 0; i < 4; i++) {
    const a0 = i / 4 * TAU + Math.PI / 4, a1 = a0 + TAU / 4, x0 = Math.cos(a0) * colR, z0 = Math.sin(a0) * colR, x1 = Math.cos(a1) * colR, z1 = Math.sin(a1) * colR, yb = sy + 0.064 + colH + 0.024;
    P.add("gilt", tube([[x0, yb, z0], [x0 * 0.8 + x1 * 0.2, yb + 0.03, z0 * 0.8 + z1 * 0.2], [(x0 + x1) / 2 * 1.05, yb + 0.045, (z0 + z1) / 2 * 1.05], [x1 * 0.8 + x0 * 0.2, yb + 0.03, z1 * 0.8 + z0 * 0.2], [x1, yb, z1]], 0.005, 24, 6));
    P.add("giltDark", new THREE.TorusGeometry(0.01, 0.003, 6, 16), [(x0 + x1) / 2 * 1.05, yb + 0.025, (z0 + z1) / 2 * 1.05], [0, -(a0 + a1) / 2 + Math.PI / 2, 0]);   // trefoil
  }
  const dy = sy + 0.064 + colH + 0.07;
  P.add("gilt", lathe([[0, 0], [0.1, 0], [0.104, 0.012], [0.098, 0.02], [0, 0.02]], 48), [0, dy, 0]);
  // fluted dome
  const domeProf = []; for (let k = 0; k <= 16; k++) { const t = k / 16; domeProf.push([0.095 * Math.cos(t * Math.PI / 2), 0.075 * Math.sin(t * Math.PI / 2)]); }
  const dome = lathe(domeProf, 96), DP = dome.attributes.position, vv = new THREE.Vector3();
  for (let i = 0; i < DP.count; i++) { vv.fromBufferAttribute(DP, i); const ang = Math.atan2(vv.z, vv.x), k = 1 + 0.06 * Math.pow(Math.abs(Math.sin(ang * 8)), 0.6) * (1 - vv.y / 0.075); DP.setXYZ(i, vv.x * k, vv.y, vv.z * k); }
  dome.computeVertexNormals(); P.add("gilt", dome, [0, dy + 0.02, 0]);
  P.add("gilt", lathe([[0, 0], [0.018, 0], [0.012, 0.02], [0.02, 0.03], [0.008, 0.05], [0, 0.058]], 20), [0, dy + 0.09, 0]);   // finial
  // the crystal vial of the "noli me tangere", on a stemmed foot, crowned
  const vy = sy + 0.06;
  P.add("gilt", lathe([[0, 0], [0.032, 0], [0.02, 0.012], [0.007, 0.03], [0.007, 0.05], [0.022, 0.06], [0, 0.062]], 32), [0, vy, 0]);
  P.add("glass", new THREE.CylinderGeometry(0.019, 0.019, 0.13, 32, 1, true), [0, vy + 0.13, 0]);
  P.add("gilt", new THREE.CylinderGeometry(0.023, 0.023, 0.014, 24), [0, vy + 0.064, 0]);
  P.add("gilt", new THREE.CylinderGeometry(0.023, 0.023, 0.014, 24), [0, vy + 0.196, 0]);
  P.add("relic", new THREE.SphereGeometry(0.009, 12, 8), [0, vy + 0.13, 0], null, [1, 1.4, 0.5]);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; P.add("gilt", new THREE.ConeGeometry(0.004, 0.022, 4), [Math.cos(a) * 0.018, vy + 0.214, Math.sin(a) * 0.018]); }
  P.add("gilt", new THREE.SphereGeometry(0.008, 10, 8), [0, vy + 0.226, 0]);

  // ---- the bust: shoulders, collar and clasp, neck
  const by = TOP + 0.43;
  const bust = lathe([[0, 0], [0.2, 0], [0.212, 0.018], [0.2, 0.05], [0.17, 0.08], [0.12, 0.11], [0.08, 0.13], [0.064, 0.16], [0.06, 0.24], [0, 0.245]], 72);
  P.add("gilt", bust, [0, by, 0], null, [1, 1, 0.62]);
  P.add("giltDark", new THREE.TorusGeometry(0.13, 0.013, 10, 64), [0, by + 0.085, 0], [Math.PI / 2, 0, 0], [1, 0.62, 1]);
  const cz = 0.13 * 0.62 + 0.004;
  P.add("gilt", new THREE.CylinderGeometry(0.03, 0.03, 0.01, 32), [0, by + 0.09, cz], [Math.PI / 2, 0, 0]);             // clasp
  P.add("giltDark", new THREE.TorusGeometry(0.03, 0.004, 8, 32), [0, by + 0.09, cz + 0.005]);
  P.add("gilt", new THREE.BoxGeometry(0.012, 0.03, 0.006), [0, by + 0.09, cz + 0.007]); P.add("gilt", new THREE.BoxGeometry(0.024, 0.008, 0.006), [0, by + 0.094, cz + 0.007]);   // a small cross in relief

  // ---- the head: skull, jaw and teeth, the dark cloth at the brow, the hood, glass, rivets, seal
  const hy = by + 0.38;
  const skull = skullGeometry(); P.add("skull", skull, [0, hy, 0], null, 1.05);
  // mandible: a U of bone from ear to ear, with the chin forward
  const jaw = []; for (let k = 0; k <= 16; k++) { const t = k / 16 * Math.PI; jaw.push([Math.cos(t) * 0.055, hy - 0.085 - Math.sin(t) * 0.018, 0.02 + Math.sin(t) * 0.045]); }
  const jawG = P.add("skull", tube([[0.066, hy - 0.035, 0.0], [0.062, hy - 0.07, 0.01]].concat(jaw.slice(1, -1)).concat([[-0.062, hy - 0.07, 0.01], [-0.066, hy - 0.035, 0.0]]), 0.011, 60, 10));
  jawG.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(jawG.attributes.position.count * 3).map((_, i) => [0.2, 0.14, 0.09][i % 3]), 3));
  // teeth, worn and uneven, some lost
  for (let row = 0; row < 2; row++) for (let t = 0; t < 12; t++) { if (R() < 0.22) continue; const a = -0.62 + t * 0.113, h = 0.009 + R() * 0.005; P.add("bone", new THREE.CapsuleGeometry(0.0038, h, 2, 6), [Math.sin(a) * 0.05, hy - (row ? 0.1 : 0.083) + (R() - 0.5) * 0.002, 0.018 + Math.cos(a) * 0.05], [(R() - 0.5) * 0.2, a, (R() - 0.5) * 0.25], [1.1, 1, 0.75]); }
  // the dark cloth band across the brow, laid on the skull's own surface
  const SP = skull.attributes.position, bandPts = [], dir = new THREE.Vector3(), q3 = new THREE.Vector3();
  for (let k = 0; k <= 24; k++) {
    const a = -1.35 + k / 24 * 2.7, e = 0.34 + 0.22 * Math.abs(a) / 1.35; dir.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e));
    let best = -2, bp = null; for (let i = 0; i < SP.count; i += 3) { q3.set(SP.getX(i), SP.getY(i) - hy, SP.getZ(i)); const d = q3.dot(dir) / (q3.length() || 1); if (d > best) { best = d; bp = q3.clone(); } }
    bandPts.push([bp.x * 1.035, hy + bp.y * 1.035, bp.z * 1.035]);
  }
  P.add("cloth", tube(bandPts, 0.0075, 64, 8));
  // hood: a tall shell of gold with an oval window from brow to chin
  const hood = new THREE.SphereGeometry(0.132, 72, 48, Math.PI / 2 + 0.72, TAU - 1.44, 0, Math.PI * 0.86);
  P.add("gilt", hood, [0, hy, 0], null, [1, 1.3, 1]);
  const hoodIn = new THREE.SphereGeometry(0.128, 48, 32, Math.PI / 2 + 0.72, TAU - 1.44, 0, Math.PI * 0.86); hoodIn.scale(-1, 1, 1);
  P.add("giltDark", hoodIn, [0, hy, 0], null, [1, 1.3, 1]);
  P.add("glass", new THREE.SphereGeometry(0.13, 40, 28, Math.PI / 2 - 0.72, 1.44, 0.12, Math.PI * 0.72), [0, hy, 0], null, [1, 1.3, 1]);
  const rim = []; for (let i = 0; i <= 64; i++) { const t = i / 64 * TAU, th = 0.12 + (Math.PI * 0.72) * (0.5 - 0.5 * Math.cos(t)), ph = Math.PI / 2 + Math.sin(t) * 0.72; rim.push([-Math.cos(ph) * Math.sin(th) * 0.1335, hy + Math.cos(th) * 0.1335 * 1.3, Math.sin(ph) * Math.sin(th) * 0.1335]); }
  P.add("gilt", tube(rim, 0.0085, 128, 10, true));
  for (let i = 0; i < 28; i++) { const pnt = rim[Math.round(i / 28 * 64)]; P.add("giltDark", new THREE.SphereGeometry(0.0045, 8, 6), [pnt[0] * 1.03, pnt[1], pnt[2] * 1.03 + 0.002]); }   // rivets
  P.add("gilt", tube([[0, hy + 0.17, 0.02], [0, hy + 0.175, -0.05], [0, hy + 0.1, -0.12]], 0.006, 24, 6));             // a seam down the crown
  // the red wax seal, pressed flat against the hood beside the window
  const sd = new THREE.Vector3(0.62, 0.55, 0.56).normalize(), sn = new THREE.Vector3(sd.x, sd.y / 1.3, sd.z).normalize(), se = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), sn));
  P.add("wax", new THREE.CylinderGeometry(0.012, 0.013, 0.005, 24).rotateX(Math.PI / 2), [sd.x * 0.1345, hy + sd.y * 0.1345 * 1.3, sd.z * 0.1345], [se.x, se.y, se.z], [1, 1.1, 1]);

  // ---- the hair: long waved locks from beneath the hood over the shoulders and down the back
  const nLocks = q > 1 ? 170 : 90;
  for (let i = 0; i < nLocks; i++) {
    const ang = Math.PI / 2 + 0.85 + (i / nLocks) * (TAU - 1.7) + (R() - 0.5) * 0.05;               // all round but the face
    const back = Math.max(0, -Math.sin(ang)), fall = 0.26 + back * 0.12 + R() * 0.08, pts = [], ph = R() * 6, amp = 0.012 + R() * 0.01;
    for (let k = 0; k <= 9; k++) { const t = k / 9, wave = Math.sin(t * 11 + ph) * amp * (0.3 + t); const rad = 0.125 + t * t * 0.1 + wave * 0.6, a2 = ang + wave * 1.4; pts.push([Math.cos(a2) * rad, hy - 0.02 - t * fall, Math.sin(a2) * rad * 0.82]); }
    P.add(R() < 0.3 ? "giltDark" : "gilt", tube(pts, 0.007 + R() * 0.006, q > 1 ? 48 : 28, q > 1 ? 7 : 5));
  }

  // ---- the four angels
  const clasp = [0, by + 0.09, cz + 0.004];
  [[-0.29, 0.08, -1, [[-0.035, clasp[1] - 0.005, clasp[2] + 0.012], [-0.075, by + 0.07, 0.07]]], [0.29, 0.08, 1, [[0.035, clasp[1] - 0.005, clasp[2] + 0.012], [0.075, by + 0.07, 0.07]]],
   [-0.23, -0.13, -1, [[-0.15, by + 0.05, -0.02], [-0.13, by + 0.06, -0.07]]], [0.23, -0.13, 1, [[0.15, by + 0.05, -0.02], [0.13, by + 0.06, -0.07]]]].forEach(([x, z, side, targets]) => {
    const yaw = Math.atan2(-x, -z) + side * 0.18, c = Math.cos(yaw), s = Math.sin(yaw);
    // hand targets from world into the angel's local frame
    const local = targets.map((t) => { const dx = t[0] - x, dy = t[1] - TOP, dz = t[2] - z; return [c * dx - s * dz, dy, s * dx + c * dz]; });
    const A = angelParts(side, local, q), o = new THREE.Object3D(); o.position.set(x, TOP, z); o.rotation.y = yaw; o.updateMatrix();
    P.absorb(A, o.matrix);
  });

  const root = P.build(mats, true); root.name = "reliquary";
  // the glass and its reflections draw after everything else
  root.children.forEach((m) => { if (m.name === "glass") { m.renderOrder = 5; m.castShadow = false; } });
  return { root, top: TOP, height: hy + 0.2, headY: hy, shrineY: sy + 0.2 };
}

// ---------------------------------------------------------------- the inspector's setting: a niche in the crypt
export function reliquaryStage(env) {
  const g = new THREE.Group(), lime = stoneTextures("lime"), floorT = stoneTextures("floor");
  const limeM = new THREE.MeshStandardMaterial({ map: lime.map, normalMap: lime.normal, normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.95, envMap: env, envMapIntensity: 0.25 });
  lime.map.repeat.set(2, 2); lime.normal.repeat.set(2, 2);
  // back wall and the barrel vault of the niche
  const back = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.9), limeM); back.position.set(0, 1.95, -0.62); back.receiveShadow = true; g.add(back);
  const vault = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 1.3, 64, 1, true, -Math.PI / 2, Math.PI), limeM); vault.material = limeM.clone(); vault.material.side = THREE.BackSide;
  vault.rotation.x = -Math.PI / 2; vault.position.set(0, 2.1, 0.02); vault.receiveShadow = true; g.add(vault);
  [-1, 1].forEach((s) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.2), limeM); w.position.set(s * 1.7, 1.1, 0.02); w.rotation.y = -s * Math.PI / 2; w.receiveShadow = true; g.add(w); });
  // the soot-dark arch band of the niche
  const arch = new THREE.Mesh(new THREE.TorusGeometry(1.66, 0.05, 10, 64, Math.PI), new THREE.MeshStandardMaterial({ color: "#1c1712", roughness: 0.9 })); arch.position.set(0, 2.1, 0.66); g.add(arch);
  // a polished floor that reflects the reliquary (a mirrored copy under a translucent floor)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.4), new THREE.MeshPhysicalMaterial({ map: floorT.map, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.84, envMap: env, envMapIntensity: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 0.05); floor.receiveShadow = true; floor.renderOrder = 2; g.add(floor);
  // light: a warm key from above and in front (soft shadows), a cool rim, two low candles that flicker
  const key = new THREE.SpotLight("#ffd8a8", 38, 0, 0.55, 0.65, 1.6); key.position.set(0.9, 2.3, 1.7); key.target.position.set(0, 0.55, 0);
  key.castShadow = true; key.shadow.mapSize.setScalar(window.matchMedia && window.matchMedia("(pointer: coarse)").matches ? 1024 : 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 6; key.shadow.camera.near = 0.5; key.shadow.camera.far = 6;
  g.add(key, key.target);
  const rim = new THREE.DirectionalLight("#8fa8ff", 0.9); rim.position.set(-2, 1.6, -1.2); g.add(rim);
  const hemi = new THREE.HemisphereLight("#ffe6c4", "#1a120a", 0.35); g.add(hemi);
  const candles = [-0.75, 0.75].map((x) => { const l = new THREE.PointLight("#ffb56a", 1.2, 2.6, 1.8); l.position.set(x, 0.14, 0.55); g.add(l); return l; });
  let t = 0;
  return {
    group: g,
    mirror(root) { const m = root.clone(); m.scale.y = -1; m.traverse((o) => { o.castShadow = false; o.receiveShadow = false; }); m.name = "reflection"; return m; },
    update(dt, reduce) { t += dt; candles.forEach((l, i) => { l.intensity = reduce ? 1.2 : 1.1 + 0.25 * Math.sin(t * 9 + i * 2) * Math.sin(t * 3.3 + i) + 0.1 * Math.sin(t * 23 + i * 5); }); }
  };
}
