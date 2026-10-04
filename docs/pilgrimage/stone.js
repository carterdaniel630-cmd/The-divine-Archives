/* ==========================================================================
   THE DIVINE ARCHIVES — the Pilgrimage: procedural stone

   Every surface is drawn in code on a canvas: no photographs, no scans. Each
   kind of stone is a colour map, a normal map (from a height field drawn in the
   same pass) and a roughness value, and tiles seamlessly. UVs are world metres
   (see kit.js), so `tile` says how many metres one copy of the texture covers,
   and the block joints come out at true size.

   Kinds:
     limestone  fine white Tura-type limestone, dressed, laid in courses (passages)
     gallery    the same, smoother, larger blocks (Grand Gallery walls)
     floor      limestone worn by feet, with joints across the passage
     granite    red Aswan granite: pink feldspar, grey quartz, black mica and
                hornblende; ground smooth, darkened by soot and hands
     core       the rough, weathered core masonry of the outer face
     rock       bedrock and rubble hewn with picks (the robbers' tunnel)
     qc         the Queen's Chamber limestone, crusted with pale salt
     wood       the modern visitors' walkway boards
   ========================================================================== */
import * as THREE from "three";

// ---------------------------------------------------------------- seeded, tileable value noise
function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function lattice(n, R) { const a = new Float32Array(n * n); for (let i = 0; i < a.length; i++) a[i] = R(); return a; }
const fade = (t) => t * t * (3 - 2 * t);
// fbm over a [0,1)^2 domain that wraps: octave k has 4·2^k cells across
function makeFbm(seed, octaves, base) {
  const R = rng(seed), L = [];
  for (let k = 0; k < octaves; k++) { const n = (base || 4) << k; L.push({ n, a: lattice(n, R) }); }
  return (u, v) => {
    let s = 0, amp = 1, tot = 0;
    for (let k = 0; k < L.length; k++) {
      const { n, a } = L[k], x = u * n, y = v * n, xi = Math.floor(x), yi = Math.floor(y), fx = fade(x - xi), fy = fade(y - yi);
      const x0 = ((xi % n) + n) % n, y0 = ((yi % n) + n) % n, x1 = (x0 + 1) % n, y1 = (y0 + 1) % n;
      const top = a[y0 * n + x0] + (a[y0 * n + x1] - a[y0 * n + x0]) * fx, bot = a[y1 * n + x0] + (a[y1 * n + x1] - a[y1 * n + x0]) * fx;
      s += (top + (bot - top) * fy) * amp; tot += amp; amp *= 0.5;
    }
    return s / tot;
  };
}

// ---------------------------------------------------------------- courses of blocks (running bond), in tile metres
// returns, for a point in metres, the block's id and the distance to the nearest joint
function makeCourses(tileW, tileH, course, lenMin, lenMax, seed) {
  const R = rng(seed), rows = Math.max(1, Math.round(tileH / course)), ch = tileH / rows, rowsArr = [];
  for (let r = 0; r < rows; r++) {
    // block lengths that add up exactly to the tile width, so the pattern wraps
    const cuts = []; let x = R() * lenMin;
    while (x < tileW - lenMin * 0.6) { cuts.push(x); x += lenMin + R() * (lenMax - lenMin); }
    if (!cuts.length) cuts.push(0);
    rowsArr.push({ cuts, tone: [] });
    for (let i = 0; i < cuts.length; i++) rowsArr[r].tone.push(R());
  }
  return (mx, my) => {
    const r = Math.min(rows - 1, Math.floor(my / ch)), row = rowsArr[r], cuts = row.cuts;
    let i = cuts.length - 1; for (let k = 0; k < cuts.length; k++) { if (mx < cuts[k]) { i = k - 1; break; } }
    const idx = (i + cuts.length) % cuts.length;
    const left = i < 0 ? cuts[cuts.length - 1] - tileW : cuts[i], right = i + 1 < cuts.length ? cuts[i + 1] : cuts[0] + tileW;
    const dv = Math.min(my - r * ch, (r + 1) * ch - my), du = Math.min(mx - left, right - mx);
    return { id: r * 97 + idx, tone: row.tone[idx], d: Math.min(du, dv), dv, du };
  };
}

// ---------------------------------------------------------------- the kinds
const KINDS = {
  limestone: { tile: [4, 2.4], course: 0.6, len: [0.9, 1.9], joint: 0.006, base: [205, 190, 160], vary: 16, grain: 0.10, pits: 0.012, soot: 0.18, rough: 0.82, bump: 2.2 },
  gallery:   { tile: [6, 2.7], course: 0.9, len: [1.4, 2.8], joint: 0.004, base: [214, 199, 170], vary: 12, grain: 0.07, pits: 0.006, soot: 0.22, rough: 0.7, bump: 1.6 },
  floor:     { tile: [2.2, 4], course: 1.0, len: [1.05, 1.06], joint: 0.008, base: [176, 158, 126], vary: 14, grain: 0.14, pits: 0.02, soot: 0.3, rough: 0.9, bump: 2.6, worn: true },
  granite:   { tile: [2.4, 2.336], course: 1.168, len: [1.1, 2.3], joint: 0.003, base: [112, 72, 64], vary: 8, granite: true, soot: 0.2, rough: 0.45, bump: 0.9 },
  block:     { tile: [3, 3], course: 0, base: [204, 188, 158], vary: 0, grain: 0.12, pits: 0.008, soot: 0.15, rough: 0.85, bump: 2.4 },
  core:      { tile: [6, 3.0], course: 0.75, len: [0.8, 1.7], joint: 0.05, base: [196, 172, 134], vary: 22, grain: 0.18, pits: 0.02, soot: 0, rough: 0.95, bump: 5, weathered: true },
  rock:      { tile: [3, 3], course: 0, base: [176, 160, 132], vary: 0, grain: 0.3, pits: 0.025, soot: 0.25, rough: 0.97, bump: 6, hewn: true },
  qc:        { tile: [4, 2.6], course: 0.65, len: [1.0, 2.2], joint: 0.006, base: [200, 186, 160], vary: 12, grain: 0.1, pits: 0.012, soot: 0.12, rough: 0.85, bump: 2, salt: true },
  wood:      { tile: [1.2, 2.4], base: [104, 76, 48], wood: true, rough: 0.75, bump: 1.4 }
};

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);

function draw(kind, px) {
  const K = KINDS[kind], [tw, th] = K.tile, W = px, H = Math.max(64, Math.round(px * th / tw / 64) * 64) || px;
  const seed = Object.keys(KINDS).indexOf(kind) * 131 + 7;
  const n1 = makeFbm(seed, 5, 4), n2 = makeFbm(seed + 1, 4, 16), n3 = makeFbm(seed + 2, 3, 64);
  // fine grain for pits and crystals: cells of a few pixels, whatever the tile size
  const cells = Math.max(64, Math.round(px / 3.5)), nf = makeFbm(seed + 4, 2, cells);
  const g1 = K.granite ? makeFbm(seed + 5, 2, Math.round(px / 5)) : null, g2 = K.granite ? makeFbm(seed + 6, 2, Math.round(px / 4)) : null, g3 = K.granite ? makeFbm(seed + 7, 2, Math.round(px / 3)) : null;
  const blocks = K.course ? makeCourses(tw, th, K.course, K.len[0], K.len[1], seed + 3) : null;
  const col = new Uint8ClampedArray(W * H * 4), hgt = new Float32Array(W * H);
  const R = rng(seed + 9);
  for (let y = 0; y < H; y++) {
    const v = y / H, my = v * th;
    for (let x = 0; x < W; x++) {
      const u = x / W, mx = u * tw, o = (y * W + x);
      const big = n1(u, v), mid = n2(u, v), fine = n3(u, v);
      let r = K.base[0], g = K.base[1], b = K.base[2], h = 0.5;
      if (K.wood) {
        // boards running along v, with grain lines and cleats every 0.4 m
        const board = Math.floor(u * 6), bt = ((board * 37) % 11) / 11;
        const grain = Math.sin((u * 6 - board) * 40 + mid * 9 + big * 4) * 0.5 + 0.5;
        const t = 0.75 + bt * 0.2 + grain * 0.12 - fine * 0.1;
        r *= t; g *= t; b *= t;
        const edge = Math.min((u * 6) % 1, 1 - ((u * 6) % 1));
        const cleat = Math.min((my % 0.4) / 0.4, 1 - (my % 0.4) / 0.4) < 0.06;
        h = 0.5 + grain * 0.1 - (edge < 0.04 ? 0.3 : 0) + (cleat ? 0.35 : 0);
        if (edge < 0.04) { r *= 0.55; g *= 0.55; b *= 0.55; }
        if (cleat) { r *= 0.8; g *= 0.8; b *= 0.8; }
      } else if (K.granite) {
        // coarse crystals: three populations, each a threshold of its own noise
        // crystals a few millimetres to a few centimetres across: big pink feldspars, grey quartz, black mica
        const fel = g1(u, v), qtz = g2(u, v), mic = g3(u, v); void fine;
        let t = 0.9 + (big - 0.5) * 0.22 + (mid - 0.5) * 0.1;
        if (fel > 0.56) { r = 142; g = 88; b = 76; t *= 0.96 + (fel - 0.56) * 0.5; }        // pink feldspar
        if (qtz > 0.64) { r = 112; g = 104; b = 100; }                                        // grey quartz
        if (mic > 0.7) { r = 40; g = 32; b = 29; }                                           // black mica / hornblende
        r *= t; g *= t; b *= t;
        h = 0.5 + (fel - 0.5) * 0.15 - (mic > 0.66 ? 0.06 : 0);
      } else {
        const t = 1 + (big - 0.5) * 0.28 + (mid - 0.5) * 0.12 + (fine - 0.5) * (K.grain || 0.1);
        r *= t; g *= t; b *= t;
        h = 0.5 + (big - 0.5) * 0.3 + (mid - 0.5) * 0.25 + (fine - 0.5) * (K.grain || 0.1) * 2;
        if (K.hewn) {
          // pick marks: short parallel gouges
          const gouge = Math.sin(mx * 22 + my * 9 + big * 12) * Math.sin(my * 3 + mid * 6);
          h += gouge * 0.12; const s = 1 + gouge * 0.06; r *= s; g *= s; b *= s;
        }
        if (K.salt) { const sp = n2(u * 0.7 + 0.5, v * 0.7); if (sp > 0.6) { const k = (sp - 0.6) * 2.4; r += (238 - r) * k; g += (232 - g) * k; b += (220 - b) * k; h += k * 0.15; } }
      }
      if (blocks) {
        const bl = blocks(mx, my), tone = (bl.tone - 0.5) * (K.vary || 0);
        r += tone; g += tone * 0.95; b += tone * 0.85;
        if (K.weathered) {
          // rounded, eroded block edges and deep joints
          const e = clamp(bl.d / 0.12, 0, 1);
          h = h * 0.6 + e * 0.6 - (1 - e) * 0.2; const k = 0.62 + e * 0.38; r *= k; g *= k; b *= k;
        } else {
          const jw = K.joint, d = bl.d;
          if (d < jw * 2.2) { const k = d < jw ? 0.62 : 0.85; r *= k; g *= k; b *= k; h -= d < jw ? 0.35 : 0.1; }
          if (K.worn) { const wear = Math.exp(-Math.pow((u - 0.5) * 3.2, 2)); r += wear * 10; g += wear * 9; b += wear * 7; h -= wear * 0.08; }
        }
      }
      if (K.pits) { const pf = nf(u, v); if (pf > 1 - K.pits * 8) { const k = 0.82; r *= k; g *= k; b *= k; h -= 0.18; } }
      if (K.soot) { const s = 1 - Math.max(0, big - 0.55) * K.soot * 2.2; r *= s; g *= s; b *= s; }
      col[o * 4] = r; col[o * 4 + 1] = g; col[o * 4 + 2] = b; col[o * 4 + 3] = 255;
      hgt[o] = h;
    }
  }
  // a few random scratches and chips on dressed stone
  if (!K.wood && !K.hewn && !K.weathered) {
    for (let i = 0; i < 40; i++) {
      const x0 = R() * W, y0 = R() * H, len = 6 + R() * 30, a = R() * Math.PI;
      for (let s = 0; s < len; s++) { const xx = Math.round(x0 + Math.cos(a) * s) % W, yy = Math.round(y0 + Math.sin(a) * s) % H; if (xx < 0 || yy < 0) continue; const o = yy * W + xx; hgt[o] -= 0.08; col[o * 4] *= 0.92; col[o * 4 + 1] *= 0.92; col[o * 4 + 2] *= 0.92; }
    }
  }
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  c.getContext("2d").putImageData(new ImageData(col, W, H), 0, 0);
  // normal map from the height field (wrapping, so it tiles)
  const n = document.createElement("canvas"); n.width = W; n.height = H;
  const out = new Uint8ClampedArray(W * H * 4), str = K.bump * (W / 512);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const hx = hgt[y * W + ((x + 1) % W)] - hgt[y * W + ((x - 1 + W) % W)], hy = hgt[((y + 1) % H) * W + x] - hgt[((y - 1 + H) % H) * W + x];
    let nx = -hx * str, ny = hy * str; const l = Math.hypot(nx, ny, 1); nx /= l; ny /= l;
    const o = (y * W + x) * 4; out[o] = (nx * 0.5 + 0.5) * 255; out[o + 1] = (ny * 0.5 + 0.5) * 255; out[o + 2] = (1 / l * 0.5 + 0.5) * 255; out[o + 3] = 255;
  }
  n.getContext("2d").putImageData(new ImageData(out, W, H), 0, 0);
  return { c, n };
}

const texCache = {}, matCache = {};
// px: texture width in pixels (512 on phones, 1024 elsewhere). Textures are made once per kind; each variant
// (a tint, a different roughness) is a new material sharing them.
export function stoneMaterial(kind, px, opts) {
  const key = kind + ":" + px + ":" + JSON.stringify(opts || {});
  if (matCache[key]) return matCache[key];
  const K = KINDS[kind], tk = kind + ":" + px;
  if (!texCache[tk]) {
    const { c, n } = draw(kind, px);
    const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace;
    const nrm = new THREE.CanvasTexture(n);
    for (const t of [map, nrm]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; t.repeat.set(1 / K.tile[0], 1 / K.tile[1]); }
    texCache[tk] = { map, nrm };
  }
  const { map, nrm } = texCache[tk];
  const m = new THREE.MeshStandardMaterial(Object.assign({ map, normalMap: nrm, roughness: K.rough, metalness: 0, side: THREE.DoubleSide }, opts || {}));
  matCache[key] = m;
  return m;
}
export const STONE_TILES = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, v.tile]));
