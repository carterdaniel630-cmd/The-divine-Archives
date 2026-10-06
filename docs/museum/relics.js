/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: renditions of the Vault's objects

   Each object shown in the museum has a modelled rendition of its own, built
   from the physical details its Vault entry records: shape, material, size,
   what is carved, painted or written on it, how it is broken or worn. These
   are renditions, NOT replicas: none is modelled from measurements or scans,
   details are simplified, and any writing on them is illustrative marks in
   the manner of the script, never the actual text. Objects that the Vault
   shows without images get no model (V68; V76), and objects whose existence
   is itself in question (the Ark, the Golden Plates) follow the descriptions
   in the texts, and say so.

   buildRelic(id, env, q) returns the same kind of model inspect.js uses:
   { root, target, fit, actions, act(id), update(dt), note } — so each can be
   turned, zoomed and opened (books open and turn their pages, scrolls unroll,
   caskets open, stones turn to show their backs).
   ========================================================================== */
import * as THREE from "three";

const TAU = Math.PI * 2;
const ease = (a, b, k) => a + (b - a) * k;
function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
let R = rng(1);                                         // reseeded per object, so every build of an object is the same

// ---------------------------------------------------------------- canvases
function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function tex(c, srgb) { const t = new THREE.CanvasTexture(c); if (srgb !== false) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
// a height canvas (white = high) into a tangent-space normal map
function normalMap(hc, strength) {
  const w = hc.width, h = hc.height, src = hc.getContext("2d").getImageData(0, 0, w, h).data, out = canvas(w, h), g = out.getContext("2d"), img = g.createImageData(w, h), d = img.data;
  const H = (x, y) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let nx = (H(x - 1, y) - H(x + 1, y)) * strength, ny = (H(x, y + 1) - H(x, y - 1)) * strength; const l = Math.hypot(nx, ny, 1); nx /= l; ny /= l;
    const o = (y * w + x) * 4; d[o] = (nx * 0.5 + 0.5) * 255; d[o + 1] = (ny * 0.5 + 0.5) * 255; d[o + 2] = (1 / l * 0.5 + 0.5) * 255; d[o + 3] = 255;
  }
  g.putImageData(img, 0, 0); return tex(out, false);
}
// speckle a canvas with grains, stains and wear
function grain(g, w, h, n, cols, size) { for (let i = 0; i < n; i++) { g.fillStyle = cols[(R() * cols.length) | 0]; const s = (size || 2) * (0.5 + R()); g.fillRect(R() * w, R() * h, s, s); } }
function blotches(g, w, h, n, col, r) { for (let i = 0; i < n; i++) { const x = R() * w, y = R() * h, rr = (r || 60) * (0.4 + R()); const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); } }

// ---------------------------------------------------------------- surfaces: colour, relief and roughness from one recipe
// kind: a stone, metal or organic ground; paint(g, h, w, hh): draws on the colour (g) and height (h) contexts
const GROUND = {
  granite: { base: "#6e6a66", cols: ["#2a2826", "#a8a29a", "#8a6a5a", "#44403c"], n: 9000, rough: 0.8 },
  pinkgranite: { base: "#8a6a60", cols: ["#2a2220", "#c8a898", "#5a4640", "#e0d0c0"], n: 9000, rough: 0.8 },
  granodiorite: { base: "#3a3836", cols: ["#1a1918", "#8a8680", "#5a5854", "#c0bcb4"], n: 7000, rough: 0.55 },
  // the visual pass: darker stones matched to the published descriptions of V53 (dark grey granodiorite with a pink streak) and V43 (black granite)
  rosetta: { base: "#2c2a29", cols: ["#141312", "#5a5652", "#3e3a38", "#7a6460"], n: 9000, rough: 0.5 },
  blackgranite: { base: "#222020", cols: ["#0e0d0d", "#4a4846", "#353331", "#6a6866"], n: 9000, rough: 0.55 },
  basalt: { base: "#2e2c2a", cols: ["#1a1918", "#4a4644", "#3a3634"], n: 5000, rough: 0.75 },
  limestone: { base: "#c9bca0", cols: ["#a89878", "#e0d6c0", "#b8a888", "#8a7a5a"], n: 5000, rough: 0.9, stains: "rgba(120,90,50,.18)" },
  sandstone: { base: "#b89a74", cols: ["#9a7a58", "#d0b890", "#7a5a40"], n: 8000, rough: 0.95 },
  andesite: { base: "#6a6660", cols: ["#4a4640", "#8a8680", "#5a5650"], n: 7000, rough: 0.85 },
  greywacke: { base: "#5a5a54", cols: ["#3a3a36", "#7a7a72", "#4a4a44"], n: 7000, rough: 0.85 },
  clay: { base: "#b08058", cols: ["#8a5a38", "#c89a70", "#6a4a30", "#d8b890"], n: 6000, rough: 0.95, stains: "rgba(60,40,20,.2)" },
  redclay: { base: "#a0603c", cols: ["#7a4028", "#c07a50", "#5a3020"], n: 6000, rough: 0.95 },
  ivory: { base: "#d8c8a4", cols: ["#b8a078", "#e8dcc0", "#a08860"], n: 3000, rough: 0.6, stains: "rgba(110,80,40,.25)" },
  soapstone: { base: "#8a8a7a", cols: ["#6a6a5a", "#a0a090", "#7a7a68"], n: 3000, rough: 0.5 },
  bone: { base: "#d8c8a8", cols: ["#b8a078", "#e8dcc4", "#8a7050"], n: 3000, rough: 0.7, stains: "rgba(90,60,30,.2)" },
  gold: { base: "#d8a848", cols: ["#b88a30", "#f0cc70", "#8a6420"], n: 3000, rough: 0.28, metal: 1 },
  silver: { base: "#b8b8b4", cols: ["#8a8a86", "#d8d8d4", "#5a5a58"], n: 3000, rough: 0.3, metal: 1, stains: "rgba(40,40,40,.25)" },
  brass: { base: "#a07838", cols: ["#7a5820", "#c09850", "#4a3a20"], n: 4000, rough: 0.45, metal: 1, stains: "rgba(40,60,40,.3)" },
  bronze: { base: "#3e6e5c", cols: ["#2a4a3e", "#6a9a80", "#8a6a3a", "#2e3a30"], n: 9000, rough: 0.7, metal: 0.3 },
  copper: { base: "#4a6a58", cols: ["#2a3a30", "#8a5a38", "#6a8a70", "#3a2a20"], n: 9000, rough: 0.8, metal: 0.3 },
  iron: { base: "#3a3430", cols: ["#5a3a28", "#2a2624", "#6a4a30"], n: 8000, rough: 0.7, metal: 0.6 },
  parchment: { base: "#e4d4ac", cols: ["#cdb888", "#f0e4c4", "#b89c70"], n: 4000, rough: 0.9, stains: "rgba(140,100,50,.14)" },
  papyrus: { base: "#d8c08c", cols: ["#b8a068", "#e8d4a8", "#9a8050"], n: 3000, rough: 0.9, fibres: 1, stains: "rgba(110,80,40,.18)" },
  paper: { base: "#ece2c8", cols: ["#d8ccb0", "#f6f0e0"], n: 2000, rough: 0.9, stains: "rgba(150,120,70,.12)" },
  amate: { base: "#b89c74", cols: ["#9a7a50", "#d0b890", "#7a5a38"], n: 5000, rough: 0.95, fibres: 2 },
  gesso: { base: "#e8e0cc", cols: ["#d0c4a8", "#f4ecdc"], n: 2000, rough: 0.8, stains: "rgba(120,90,50,.15)" },
  silk: { base: "#c8a878", cols: ["#a88858", "#dcc098", "#8a6a40"], n: 3000, rough: 0.7, weave: 1, stains: "rgba(80,50,20,.25)" },
  linen: { base: "#d8ccb0", cols: ["#bcae90", "#e8dcc4", "#a09070"], n: 3000, rough: 1, weave: 1, stains: "rgba(120,90,50,.12)" },
  leather: { base: "#5a3420", cols: ["#3a2012", "#7a4a2c", "#2a160a"], n: 7000, rough: 0.7, stains: "rgba(20,10,5,.3)" },
  wood: { base: "#6a4428", cols: ["#4a2c18", "#8a5a34"], n: 1500, rough: 0.75, grainLines: 1 },
  palm: { base: "#c8a870", cols: ["#a88850", "#dcc090"], n: 2000, rough: 0.8, fibres: 1 },
  cornmeal: { base: "#3a2c20", cols: ["#2a2018", "#4a3a2c"], n: 6000, rough: 1 },
  mosaic: { base: "#d8c8a4", cols: ["#c0b08c"], n: 100, rough: 0.8 },
  agate: { base: "#8a4a30", cols: ["#6a3020", "#b87050", "#d8a080"], n: 2000, rough: 0.15, bands: 1 },
  stoneblack: { base: "#1a1614", cols: ["#0a0808", "#2a2420", "#3a3230"], n: 5000, rough: 0.35 },
  glaze: { base: "#1f4f9a", cols: ["#163a78", "#2a60b0", "#10306a"], n: 5000, rough: 0.35 }
};
// build a material: base ground plus a painter for the details (inscriptions, pictures) on colour and height
let QS = 1;                                             // texture resolution: 1 in the inspector, less in the museum's cases
function surface(kind, W, H, paint, o) {
  const G = GROUND[kind] || GROUND.limestone, c = canvas(Math.max(16, Math.round(W * QS)), Math.max(16, Math.round(H * QS))), h = canvas(c.width, c.height), g = c.getContext("2d"), hg = h.getContext("2d");
  g.setTransform(QS, 0, 0, QS, 0, 0); hg.setTransform(QS, 0, 0, QS, 0, 0);
  g.fillStyle = G.base; g.fillRect(0, 0, W, H); hg.fillStyle = "#808080"; hg.fillRect(0, 0, W, H);
  if (G.bands) for (let y = 0; y < H; y += 4) { g.fillStyle = G.cols[(y / 4 | 0) % G.cols.length] + "55"; g.fillRect(0, y + Math.sin(y * 0.05) * 6, W, 3); }
  if (G.grainLines) { for (let y = 0; y < H; y += 3) { g.fillStyle = `rgba(30,15,5,${0.05 + R() * 0.12})`; g.fillRect(0, y + Math.sin(y * 0.02) * 8, W, 1 + R() * 2); } }
  if (G.fibres) { for (let y = 0; y < H; y += 5) { g.fillStyle = "rgba(90,60,30,.12)"; g.fillRect(0, y + R() * 2, W, 1.5); hg.fillStyle = "rgba(255,255,255,.08)"; hg.fillRect(0, y, W, 2); } if (G.fibres > 1) for (let x = 0; x < W; x += 7) { g.fillStyle = "rgba(90,60,30,.08)"; g.fillRect(x + R() * 3, 0, 1.2, H); } }
  if (G.weave) { for (let i = 0; i < W; i += 3) { g.fillStyle = "rgba(90,70,40,.1)"; g.fillRect(i, 0, 1, H); } for (let j = 0; j < H; j += 3) { g.fillStyle = "rgba(255,250,235,.08)"; g.fillRect(0, j, W, 1); } }
  grain(g, W, H, G.n * (W * H) / (512 * 512), G.cols, W / 400);
  grain(hg, W, H, G.n * 0.6 * (W * H) / (512 * 512), ["#707070", "#909090", "#606060"], W / 300);
  if (G.stains) blotches(g, W, H, 8, G.stains, W / 5);
  if (paint) paint(g, hg, W, H);
  // wear: edges and highlights rubbed
  if (o && o.worn) blotches(g, W, H, 10, "rgba(0,0,0,.12)", W / 6);
  const rel = (o && o.relief) || 3, map = tex(c), normal = rel > 1.6 ? normalMap(h, rel) : null;   // paper and cloth need no relief map
  const m = new THREE.MeshStandardMaterial({ map, normalMap: normal, roughness: G.metal ? Math.max(G.rough, 0.34) : G.rough, metalness: G.metal ? G.metal * 0.72 : 0, envMapIntensity: G.metal ? 1.7 : 0.4 });
  if (o && o.env) m.envMap = o.env;
  if (o && o.side) m.side = o.side;
  if (o && o.transparent) { m.transparent = true; m.opacity = o.transparent; }
  return m;
}
// a plain material of a ground, for sides and backs (small canvas)
const PLAIN = new Map();
function plain(kind, env) { const k = kind + (env ? "e" : ""); if (!PLAIN.has(k)) { const m = surface(kind, 256, 256, null, { env, relief: 2 }); m.map.repeat.set(2, 2); m.normalMap.repeat.set(2, 2); m.userData.shared = true; PLAIN.set(k, m); } return PLAIN.get(k); }

// ---------------------------------------------------------------- illustrative scripts (never the text)
// draws marks in the manner of a script on colour (g, ink) and height (hg, carved = dark, raised = light)
function glyph(style, g, x, y, s, rr) {
  const r = rr || R, line = (a, b, c, d) => { g.moveTo(x + a * s, y + b * s); g.lineTo(x + c * s, y + d * s); };
  g.beginPath();
  switch (style) {
    case "hiero": {                                  // small pictographs: bird, reed, eye, loaf, water, snake, legs
      const k = (r() * 9) | 0;
      if (k === 0) { g.ellipse(x + 0.5 * s, y + 0.55 * s, 0.3 * s, 0.2 * s, 0, 0, TAU); line(0.75, 0.45, 0.95, 0.35); line(0.4, 0.75, 0.4, 0.95); line(0.6, 0.75, 0.6, 0.95); }
      else if (k === 1) { line(0.5, 0.05, 0.5, 0.95); line(0.5, 0.2, 0.75, 0.05); }
      else if (k === 2) { g.ellipse(x + 0.5 * s, y + 0.5 * s, 0.4 * s, 0.18 * s, 0, 0, TAU); g.moveTo(x + 0.6 * s, y + 0.5 * s); g.arc(x + 0.5 * s, y + 0.5 * s, 0.1 * s, 0, TAU); }
      else if (k === 3) { g.arc(x + 0.5 * s, y + 0.8 * s, 0.35 * s, Math.PI, 0); }
      else if (k === 4) { for (let i = 0; i < 4; i++) { g.moveTo(x + i * 0.25 * s, y + 0.5 * s); g.lineTo(x + (i + 0.12) * 0.25 * s, y + 0.35 * s); g.lineTo(x + (i + 0.25) * 0.25 * s, y + 0.5 * s); } }
      else if (k === 5) { g.moveTo(x, y + 0.7 * s); g.bezierCurveTo(x + 0.3 * s, y + 0.2 * s, x + 0.6 * s, y + 1.1 * s, x + s, y + 0.4 * s); }
      else if (k === 6) { line(0.2, 0.9, 0.5, 0.3); line(0.5, 0.3, 0.8, 0.9); line(0.8, 0.9, 0.95, 0.9); }
      else if (k === 7) { g.rect(x + 0.2 * s, y + 0.2 * s, 0.6 * s, 0.6 * s); }
      else { g.arc(x + 0.5 * s, y + 0.5 * s, 0.3 * s, 0, TAU); g.moveTo(x + 0.55 * s, y + 0.5 * s); g.arc(x + 0.5 * s, y + 0.5 * s, 0.05 * s, 0, TAU); }
      break;
    }
    case "cuneiform": { for (let i = 0; i < 2 + (r() * 3 | 0); i++) { const ox = x + r() * s * 0.7, oy = y + r() * s * 0.6, v = r() < 0.5; g.moveTo(ox, oy); if (v) { g.lineTo(ox + 0.25 * s, oy); g.lineTo(ox + 0.12 * s, oy + 0.5 * s); } else { g.lineTo(ox, oy + 0.25 * s); g.lineTo(ox + 0.5 * s, oy + 0.12 * s); } g.closePath(); } break; }
    case "runes": { line(0.5, 0, 0.5, 1); const k = (r() * 5) | 0; if (k === 0) line(0.5, 0.2, 0.9, 0.5); else if (k === 1) { line(0.5, 0.1, 0.85, 0.35); line(0.5, 0.4, 0.85, 0.65); } else if (k === 2) line(0.15, 0.3, 0.85, 0.7); else if (k === 3) { line(0.5, 0.3, 0.15, 0.6); line(0.5, 0.3, 0.85, 0.6); } else line(0.5, 0.5, 0.9, 0.15); break; }
    case "greek": case "latin": { const k = (r() * 8) | 0; if (k === 0) { line(0.1, 1, 0.5, 0); line(0.5, 0, 0.9, 1); line(0.3, 0.55, 0.7, 0.55); } else if (k === 1) { line(0.2, 0, 0.2, 1); line(0.2, 0, 0.8, 0); line(0.2, 0.5, 0.7, 0.5); } else if (k === 2) { line(0.2, 0, 0.2, 1); line(0.8, 0, 0.8, 1); line(0.2, 0.5, 0.8, 0.5); } else if (k === 3) { g.arc(x + 0.5 * s, y + 0.5 * s, 0.4 * s, 0, TAU); } else if (k === 4) { line(0.2, 0, 0.2, 1); line(0.2, 1, 0.8, 1); } else if (k === 5) { line(0.1, 0, 0.9, 0); line(0.5, 0, 0.5, 1); } else if (k === 6) { line(0.1, 0, 0.9, 1); line(0.9, 0, 0.1, 1); } else { line(0.2, 1, 0.2, 0); line(0.2, 0, 0.8, 1); line(0.8, 1, 0.8, 0); } break; }
    case "hebrew": case "aramaic": { const k = (r() * 5) | 0; line(0.1, 0.1, 0.85, 0.1); if (k === 0) line(0.85, 0.1, 0.85, 0.95); else if (k === 1) { line(0.85, 0.1, 0.85, 0.95); line(0.85, 0.95, 0.1, 0.95); } else if (k === 2) { line(0.2, 0.1, 0.2, 0.95); line(0.85, 0.1, 0.85, 0.95); } else if (k === 3) line(0.5, 0.1, 0.3, 0.9); else line(0.85, 0.1, 0.6, 0.6); break; }
    case "arabic": { const up = r() < 0.4; g.moveTo(x, y + 0.8 * s); g.lineTo(x + s, y + 0.8 * s); if (up) { g.moveTo(x + 0.3 * s, y + 0.8 * s); g.lineTo(x + 0.4 * s, y); } if (r() < 0.4) { g.moveTo(x + 0.7 * s, y + 0.8 * s); g.quadraticCurveTo(x + 0.85 * s, y + 0.4 * s, x + 0.6 * s, y + 0.5 * s); } break; }
    case "chinese": case "oracle": { for (let i = 0; i < 3 + (r() * 3 | 0); i++) { const a = r() < 0.5, p = r() * 0.8 + 0.1, q = r() * 0.4, e = q + 0.3 + r() * 0.3; if (a) line(q, p, e, p); else line(p, q, p, e); } if (style === "oracle" && r() < 0.3) { g.moveTo(x + 0.8 * s, y + 0.5 * s); g.arc(x + 0.5 * s, y + 0.5 * s, 0.3 * s, 0, TAU); } break; }
    case "maya": { g.roundRect ? g.roundRect(x + 0.05 * s, y + 0.05 * s, 0.9 * s, 0.9 * s, 0.25 * s) : g.rect(x + 0.05 * s, y + 0.05 * s, 0.9 * s, 0.9 * s); g.moveTo(x + 0.35 * s, y + 0.4 * s); g.arc(x + 0.3 * s, y + 0.4 * s, 0.06 * s, 0, TAU); line(0.2, 0.7, 0.8, 0.7); if (r() < 0.5) { g.moveTo(x + 0.7 * s, y + 0.35 * s); g.arc(x + 0.65 * s, y + 0.35 * s, 0.07 * s, 0, TAU); } break; }
    case "voynich": { g.moveTo(x, y + 0.7 * s); g.bezierCurveTo(x + 0.2 * s, y, x + 0.4 * s, y + s, x + 0.55 * s, y + 0.5 * s); g.arc(x + 0.7 * s, y + 0.55 * s, 0.14 * s, Math.PI, TAU * 1.2); if (r() < 0.4) { line(0.9, 0.7, 0.95, 0.1); } break; }
    case "devanagari": case "gurmukhi": case "tibetan": { line(0, 0.15, 1, 0.15); const k = (r() * 4) | 0; if (k === 0) { g.moveTo(x + 0.3 * s, y + 0.15 * s); g.quadraticCurveTo(x + 0.1 * s, y + 0.6 * s, x + 0.5 * s, y + 0.8 * s); } else if (k === 1) line(0.7, 0.15, 0.7, 0.95); else if (k === 2) { g.moveTo(x + 0.5 * s, y + 0.15 * s); g.arc(x + 0.45 * s, y + 0.55 * s, 0.22 * s, -1.5, 3); } else { line(0.3, 0.15, 0.3, 0.8); line(0.3, 0.5, 0.75, 0.5); } if (style === "tibetan") line(0.5, 0.15, 0.5, 0.0); break; }
    case "ethiopic": { line(0.2, 0.1, 0.2, 0.9); line(0.2, 0.1, 0.7, 0.1); line(0.7, 0.1, 0.7, 0.9); if (r() < 0.5) line(0.7, 0.5, 0.95, 0.5); if (r() < 0.4) { g.moveTo(x + 0.3 * s, y + 0.95 * s); g.arc(x + 0.25 * s, y + 0.95 * s, 0.05 * s, 0, TAU); } break; }
    case "stamp": { const k = (r() * 6) | 0; if (k === 0) { g.arc(x + 0.5 * s, y + 0.3 * s, 0.18 * s, 0, TAU); line(0.5, 0.48, 0.5, 0.95); line(0.2, 0.65, 0.8, 0.65); } else if (k === 1) { g.ellipse(x + 0.5 * s, y + 0.5 * s, 0.35 * s, 0.25 * s, 0, 0, TAU); for (let i = 0; i < 5; i++) line(0.2 + i * 0.15, 0.3, 0.2 + i * 0.15, 0.7); } else if (k === 2) { line(0.1, 0.9, 0.5, 0.1); line(0.5, 0.1, 0.9, 0.9); line(0.1, 0.9, 0.9, 0.9); } else if (k === 3) { g.arc(x + 0.5 * s, y + 0.5 * s, 0.35 * s, 0, TAU); g.moveTo(x + 0.65 * s, y + 0.5 * s); g.arc(x + 0.5 * s, y + 0.5 * s, 0.15 * s, 0, TAU); } else if (k === 4) { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; line(0.5, 0.5, 0.5 + Math.cos(a) * 0.4, 0.5 + Math.sin(a) * 0.4); } } else { g.moveTo(x + 0.2 * s, y + 0.8 * s); g.bezierCurveTo(x + 0.2 * s, y, x + 0.8 * s, y, x + 0.8 * s, y + 0.8 * s); } break; }
    default: { const L = 0.3 + r() * 0.6; line(0, 0.6, L, 0.6); if (r() < 0.4) line(L * 0.5, 0.2, L * 0.5, 0.6); }
  }
  g.stroke();
}
// a block of writing: lines (or columns) in a box; dir "rows" or "cols"; carved marks go dark into the height map
function write(g, hg, box, style, o) {
  o = o || {}; const s = o.size || 14, gap = o.gap || s * 0.25, lh = o.lh || s * 1.5, [x0, y0, x1, y1] = box;
  g.strokeStyle = o.ink || "rgba(30,20,10,.85)"; g.lineWidth = o.weight || Math.max(1, s * 0.12); g.lineCap = "round";
  if (hg) { hg.strokeStyle = o.raised ? "#c8c8c8" : "#3a3a3a"; hg.lineWidth = (o.weight || Math.max(1, s * 0.12)) * 1.3; hg.lineCap = "round"; }
  const one = (x, y) => { const seed = R(); let t = seed; const rr = () => { t = (t * 16807 + 0.1234) % 1; t = (t * 9301 + 0.4927) % 1; return t; }; glyph(style, g, x, y, s, rr); if (hg) { t = seed; glyph(style, hg, x, y, s, rr); } };
  if (o.cols) { for (let x = x1 - s; x > x0; x -= s + gap * 2) for (let y = y0; y < y1 - s; y += s + gap) { if (R() < (o.gapChance || 0.04)) continue; one(x, y); } }
  else for (let y = y0; y < y1 - s; y += lh) { let x = x0; while (x < x1 - s) { if (R() < (o.space || 0.12)) x += s * 0.6; one(x, y); x += s + gap; } }
}
// exactly n lines of marks across a box (the layout of a real inscription: its number of lines, never its words)
function rows(g, hg, box, style, n, o) {
  const [x0, y0, x1, y1] = box, lh = (y1 - y0) / n, sz = o.size || lh * 0.72;
  for (let i = 0; i < n; i++) write(g, hg, [x0, y0 + i * lh, x1, y0 + i * lh + sz + 0.5], style, Object.assign({}, o, { size: sz, lh: lh * 4 }));
}
// a seated figure in profile on a block throne (registers of gods in Egyptian painting)
function seated(g, x, y, h, o) {
  o = o || {}; const s = h / 10, dir = o.left ? -1 : 1, col = o.col || "#8a4a2a", cloth = o.cloth || "#f0e8d8", line = o.line || "#1a1008";
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.beginPath(); g.rect(-1.6 * s, 5.4 * s, 2.4 * s, 4.6 * s); fillStroke(g, o.throne || "#c8a050", line, s * 0.12);          // the throne
  g.beginPath(); g.moveTo(-0.9 * s, 5.6 * s); g.lineTo(1.6 * s, 5.6 * s); g.lineTo(1.7 * s, 10 * s); g.lineTo(1.1 * s, 10 * s); g.lineTo(1.0 * s, 6.6 * s); g.lineTo(-0.9 * s, 6.6 * s); g.closePath(); fillStroke(g, cloth, line, s * 0.12);   // lap and shins
  g.beginPath(); g.moveTo(-0.9 * s, 5.8 * s); g.lineTo(0.8 * s, 5.8 * s); g.lineTo(1.0 * s, 3 * s); g.lineTo(-1.0 * s, 3 * s); g.closePath(); fillStroke(g, col, line, s * 0.12);    // torso
  g.beginPath(); g.moveTo(0.8 * s, 3.4 * s); g.lineTo(1.9 * s, 4.6 * s); fillStroke(g, null, col, s * 0.45);
  g.beginPath(); g.arc(0, 2 * s, 0.8 * s, 0, TAU); fillStroke(g, col, line, s * 0.1);
  g.beginPath(); g.moveTo(-0.9 * s, 1.4 * s); g.lineTo(0.3 * s, 1.2 * s); g.lineTo(-0.1 * s, 3.2 * s); g.lineTo(-0.95 * s, 3.2 * s); fillStroke(g, o.wig || "#1a1a28");
  g.beginPath(); g.moveTo(1.6 * s, 4.4 * s); g.lineTo(1.9 * s, 0.4 * s); fillStroke(g, null, line, s * 0.18);                 // the staff (was sceptre)
  g.restore();
}
// a spiral of writing (incantation bowls, the Phaistos disc)
function spiral(g, hg, cx, cy, r0, r1, style, o) {
  let a = 0, r = r0; const s = o.size || 12;
  g.strokeStyle = o.ink || "rgba(30,20,10,.85)"; g.lineWidth = Math.max(1, s * 0.13); if (hg) { hg.strokeStyle = "#303030"; hg.lineWidth = s * 0.18; }
  while (r > r1) { const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2); if (hg) { hg.save(); hg.translate(x, y); hg.rotate(a + Math.PI / 2); } const seed = R(); let t = seed; const rr = () => { t = (t * 16807 + 0.37) % 1; return t; }; glyph(style, g, -s / 2, -s / 2, s, rr); if (hg) { t = seed; glyph(style, hg, -s / 2, -s / 2, s, rr); hg.restore(); } g.restore(); a += (s * 1.3) / r; r -= (s * (o.pitch || 1.6)) / (TAU * r / (s * 1.3)); }
}
export { surface, write, spiral, glyph, GROUND, plain, canvas, tex, normalMap, grain, blotches };

// ---------------------------------------------------------------- geometry helpers
const V2 = (a) => a.map((p) => new THREE.Vector2(p[0], p[1]));
function mesh(geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; m.receiveShadow = true; return m; }
function put(parent, obj) { parent.add(obj); return obj; }
// planar UVs over a shape's bounding box
function planarUV(g, bb) { const P = g.attributes.position, uv = new Float32Array(P.count * 2); for (let i = 0; i < P.count; i++) { uv[i * 2] = (P.getX(i) - bb[0]) / (bb[2] - bb[0]); uv[i * 2 + 1] = (P.getY(i) - bb[1]) / (bb[3] - bb[1]); } g.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); return g; }
// outlines: a rectangle with chipped, broken or arched edges, in metres, centred on x, from y = 0
function outline(w, h, o) {
  o = o || {}; const pts = [], n = o.n || 14, jag = o.jag || 0;
  const edge = (ax, ay, bx, by, j) => { for (let i = 0; i < n; i++) { const t = i / n; pts.push([ax + (bx - ax) * t + (j ? (R() - 0.5) * j : 0), ay + (by - ay) * t + (j ? (R() - 0.5) * j : 0)]); } };
  const top = o.arch ? h - w / 2 * o.arch : h;
  edge(-w / 2, 0, w / 2, 0, jag * 0.3);
  edge(w / 2, 0, w / 2, top, o.jagR != null ? o.jagR : jag);
  if (o.arch) { for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI; pts.push([Math.cos(a) * w / 2 + (R() - 0.5) * jag * 0.5, top + Math.sin(a) * w / 2 * o.arch + (R() - 0.5) * jag * 0.5]); } }
  else edge(w / 2, top, -w / 2, top, o.jagT != null ? o.jagT : jag);
  edge(-w / 2, top, -w / 2, 0, o.jagL != null ? o.jagL : jag);
  if (o.bite) { const [cx, cy, r] = o.bite; for (let i = 0; i < pts.length; i++) { const dx = pts[i][0] - cx, dy = pts[i][1] - cy, d = Math.hypot(dx, dy); if (d < r) { pts[i][0] = cx + dx / d * r * (0.85 + R() * 0.3); pts[i][1] = cy + dy / d * r * (0.85 + R() * 0.3); } } }
  return pts;
}
// a slab: front and back faces carry their own materials; the edges are the stone itself, chamfered
function slabGeo(pts, d, bevel) {
  const sh = new THREE.Shape(); pts.forEach((p, i) => sh[i ? "lineTo" : "moveTo"](p[0], p[1]));
  const bb = [Infinity, Infinity, -Infinity, -Infinity]; pts.forEach(([x, y]) => { bb[0] = Math.min(bb[0], x); bb[1] = Math.min(bb[1], y); bb[2] = Math.max(bb[2], x); bb[3] = Math.max(bb[3], y); });
  const b = bevel == null ? d * 0.12 : bevel;
  const body = new THREE.ExtrudeGeometry(sh, { depth: d - b * 2, bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 }); body.translate(0, 0, -(d - b * 2) / 2);
  const front = planarUV(new THREE.ShapeGeometry(sh, 6), bb); front.translate(0, 0, d / 2 + 0.0015);
  const back = planarUV(new THREE.ShapeGeometry(sh, 6), bb); back.rotateY(Math.PI); back.translate(0, 0, -d / 2 - 0.0015);
  // the back's UVs mirrored so its writing reads the right way round
  const bu = back.attributes.uv; for (let i = 0; i < bu.count; i++) bu.setX(i, 1 - bu.getX(i));
  return { body, front, back, bb };
}
function slab(o) {
  const g = new THREE.Group(), side = plain(o.stone, o.env);
  const { body, front, back, bb } = slabGeo(o.pts, o.d, o.bevel);
  const fm = surface(o.stone, o.px || 1024, Math.round((o.px || 1024) * (bb[3] - bb[1]) / (bb[2] - bb[0])), (cg, hg, W, H) => o.paint(cg, hg, W, H, bb), { env: o.env, relief: o.relief || 4 });
  const bm = o.paintBack ? surface(o.stone, 512, Math.round(512 * (bb[3] - bb[1]) / (bb[2] - bb[0])), (cg, hg, W, H) => o.paintBack(cg, hg, W, H, bb), { env: o.env, relief: 3 }) : side;
  g.add(mesh(body, side), mesh(front, fm), mesh(back, bm));
  return g;
}
// turn-over and camera actions for any object
function flipper(root, spinAxis, extra) {
  const spin = new THREE.Group(); while (root.children.length) spin.add(root.children[0]); root.add(spin);
  let a = 0, want = 0;
  return {
    actions: [{ id: "flip", label: "Turn it over", alt: "Turn it back" }].concat(extra || []),
    act(id) { if (id !== "flip") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(a - want) > 0.001) { a = ease(a, want, Math.min(1, dt * 3.2)); if (Math.abs(a - want) < 0.002) a = want; spin.rotation[spinAxis || "y"] = a * Math.PI; return true; } return false; }
  };
}
const still = (extra) => ({ actions: extra || [], act() { return null; }, update() { return false; } });

// ---------------------------------------------------------------- books
// o: { w, h, t (block thickness), cover: material, back?, spine?, pages: [painter...], paper: ground, deco(parent, w, h, t, top) }
function book(o) {
  const root = new THREE.Group(), W = o.w, D = o.h, T = o.t, ct = o.ct || 0.012, paper = o.paper || "parchment";
  const pageMat = (k) => surface(paper, o.px || 768, Math.round((o.px || 768) * D / W), (g, hg, w, h) => o.pages[k % o.pages.length](g, hg, w, h, k), { relief: 1.5 });
  const pm = []; for (let k = 0; k < Math.min(o.pages.length * 2, 6); k++) pm.push(pageMat(k));
  const edgeMat = plain(paper);
  const back = mesh(new THREE.BoxGeometry(W, ct, D), o.cover, W / 2, ct / 2, 0); root.add(back);
  const block = mesh(new THREE.BoxGeometry(W - 0.012, T - ct * 1.6, D - 0.014), edgeMat, W / 2 + 0.002, T / 2, 0); root.add(block);
  const spine = mesh(new THREE.CylinderGeometry(T / 2, T / 2, D, 16, 1, false, Math.PI, Math.PI), o.spine || o.cover, 0.004, T / 2, 0); spine.rotation.x = Math.PI / 2; spine.scale.x = 0.5; root.add(spine);
  const coverPivot = new THREE.Group(); coverPivot.position.set(0, T, 0); root.add(coverPivot);
  coverPivot.add(mesh(new THREE.BoxGeometry(W, ct, D), o.cover, W / 2, ct / 2, 0));
  if (o.deco) o.deco(coverPivot, W, D, ct);
  const pageL = mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), pm[0], W / 2, -0.001, 0); pageL.rotation.x = Math.PI / 2; coverPivot.add(pageL);
  const pageR = mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), pm[1], W / 2, T - ct * 0.7, 0); pageR.rotation.x = -Math.PI / 2; root.add(pageR);
  const leafPivot = new THREE.Group(); leafPivot.position.set(0, T - ct * 0.6, 0); root.add(leafPivot);
  const leafM = pm[2 % pm.length].clone(); leafM.side = THREE.DoubleSide;
  const leaf = mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02, 12, 1), leafM, W / 2, 0, 0); leaf.rotation.x = -Math.PI / 2; leafPivot.add(leaf); leafPivot.visible = false;
  root.position.x = -W / 2;
  const holder = new THREE.Group(); holder.add(root);
  let open = o.startOpen ? 1 : 0, want = open, turn = -1, spread = 0;
  const pose = () => { coverPivot.rotation.z = open * Math.PI * 0.985; coverPivot.position.y = T - (T - ct * 1.8) * open; pageR.visible = open > 0.3; root.position.x = -W / 2 + (W / 2) * open * 0; };
  pose();
  return {
    root: holder,
    actions: [{ id: "open", label: o.openLabel || "Open the book", alt: "Close the book", on: !!o.startOpen }, { id: "page", label: "Turn a page", needs: "open" }],
    act(id) {
      if (id === "open") { want = want ? 0 : 1; if (!want) { turn = -1; leafPivot.visible = false; } return want; }
      if (id === "page" && want && turn < 0) { turn = 0; leaf.material = pm[(spread * 2 + 2) % pm.length].clone(); leaf.material.side = THREE.DoubleSide; leafPivot.visible = true; }
      return null;
    },
    isOpen: () => want === 1,
    update(dt) {
      let moving = false;
      if (Math.abs(open - want) > 0.001) { open = ease(open, want, Math.min(1, dt * 3)); if (Math.abs(open - want) < 0.002) open = want; pose(); moving = true; }
      if (turn >= 0) {
        turn = Math.min(1, turn + dt * 1.2); const k = turn < 0.5 ? 2 * turn * turn : 1 - Math.pow(-2 * turn + 2, 2) / 2;
        leafPivot.rotation.z = k * Math.PI * 0.985;
        // the leaf bends as it turns
        const P = leaf.geometry.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i) + (W - 0.02) / 2; P.setZ(i, Math.sin(k * Math.PI) * 0.06 * Math.sin(x / W * Math.PI)); } P.needsUpdate = true;
        if (turn >= 1) { spread++; pageL.material = pm[(spread * 2) % pm.length]; pageR.material = pm[(spread * 2 + 1) % pm.length]; leafPivot.visible = false; leafPivot.rotation.z = 0; turn = -1; }
        moving = true;
      }
      return moving;
    }
  };
}
// a folding screen (Mesoamerican codices): panels that open out like an accordion
function screenfold(o) {
  const root = new THREE.Group(), n = o.panels || 8, W = o.w, H = o.h, th = 0.006, mats = [];
  for (let i = 0; i < n; i++) mats.push(surface(o.ground || "gesso", 384, Math.round(384 * H / W), (g, hg, w, h) => o.paint(g, hg, w, h, i), { relief: 1.2 }));
  const edge = plain(o.ground || "gesso"), panels = [];
  let parent = root;
  for (let i = 0; i < n; i++) {
    const piv = new THREE.Group(); if (i) piv.position.x = W; parent.add(piv);
    const p = new THREE.Mesh(new THREE.BoxGeometry(W, th, H), [edge, edge, mats[i], mats[(i + 1) % n], edge, edge]); p.position.x = W / 2; p.castShadow = true; piv.add(p);
    panels.push(piv); parent = piv;
  }
  const holder = new THREE.Group(); holder.add(root);
  let u = 1, want = 1;
  const pose = () => { panels.forEach((p, i) => { const fold = (1 - u) * Math.PI * 0.98; p.rotation.z = i === 0 ? 0 : (i % 2 ? fold : -fold); p.position.y = i === 0 ? 0 : (i % 2 ? th : 0) * (1 - u); }); root.position.x = -W * (1 + (n - 1) * u) / 2; };
  pose();
  return {
    root: holder, postMeasure() { u = want = 0; pose(); },
    actions: [{ id: "fold", label: "Open it out", alt: "Fold it up" }],
    act(id) { if (id !== "fold") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.2)); if (Math.abs(u - want) < 0.002) u = want; pose(); return true; } return false; }
  };
}

// ---------------------------------------------------------------- scrolls
// o: { len (unrolled length shown), h, ground, paint(g, hg, w, h), rods, knobs, r (rolled radius), frag }
function scroll(o) {
  const root = new THREE.Group(), W = o.len, H = o.h, px = 2048;
  const m = surface(o.ground || "parchment", px, Math.round(px * H / W), o.paint, { side: THREE.DoubleSide, relief: 1.5, env: o.env });
  const sheet = mesh(new THREE.PlaneGeometry(W, H, 64, 1), m, 0, 0.06); sheet.rotation.x = -Math.PI / 2 + 0.25; root.add(sheet);
  const rollM = plain(o.ground || "parchment", o.env);
  const mk = () => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(1, 1, H * 0.99, 40), rollM)); if (o.rods) { g.add(mesh(new THREE.CylinderGeometry(0.009, 0.009, H + 0.12, 12), plain("wood"))); [1, -1].forEach((s) => g.add(mesh(new THREE.SphereGeometry(0.02, 14, 10), plain(o.knob || "wood"), 0, s * (H / 2 + 0.06), 0))); } g.rotation.x = Math.PI / 2; g.rotation.z = Math.PI / 2; g.rotation.set(0, 0, Math.PI / 2); root.add(g); return g; };
  const L = mk(), Rr = mk();
  let u = 1, want = 1;
  const r0 = o.r || 0.035;
  function pose() {
    const half = (W / 2) * u, r = r0 * (1 - 0.6 * u) + 0.008;
    [L, Rr].forEach((g, i) => { const s = i ? 1 : -1; g.position.set(s * (half + r * 0.3), r, 0); g.children[0].scale.set(r, 1, r); });
    sheet.scale.x = Math.max(0.001, u); m.map.repeat.set(Math.max(0.001, u), 1); m.map.offset.set((1 - u) / 2, 0); if (m.normalMap) { m.normalMap.repeat.copy(m.map.repeat); m.normalMap.offset.copy(m.map.offset); }
    sheet.position.y = r0 * 0.6; sheet.rotation.x = -Math.PI / 2 + 0.25 * (1 - u) * 0; sheet.visible = u > 0.01;
    // the unrolled sheet sags a little between the rolls
    const P = sheet.geometry.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i) / (W / 2); P.setZ(i, (1 - x * x) * -0.004); } P.needsUpdate = true;
  }
  pose();
  // tilted toward the viewer, as on a reading slope
  const tilt = new THREE.Group(); tilt.add(root); tilt.rotation.x = 0.45; tilt.position.y = H * 0.25;
  const holder = new THREE.Group(); holder.add(tilt);
  return {
    root: holder, postMeasure() { u = want = o.start || 0; pose(); },
    actions: [{ id: "roll", label: "Unroll it", alt: "Roll it up", on: !!o.start }],
    act(id) { if (id !== "roll") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.6)); if (Math.abs(u - want) < 0.002) u = want; pose(); return true; } return false; }
  };
}

// ---------------------------------------------------------------- lathed vessels and discs
function lathe(prof, mat, seg) { const g = new THREE.LatheGeometry(V2(prof), seg || 64); return mesh(g, mat); }
function disc(r, t, faceMat, backMat, edgeMat) {
  const g = new THREE.Group(), s = 96;
  const e = mesh(new THREE.CylinderGeometry(r, r, t, s, 1, true), edgeMat); e.rotation.x = Math.PI / 2; g.add(e);
  const f = mesh(new THREE.CircleGeometry(r, s), faceMat, 0, 0, t / 2); g.add(f);
  const b = mesh(new THREE.CircleGeometry(r, s), backMat || edgeMat, 0, 0, -t / 2); b.rotation.y = Math.PI; g.add(b);
  return g;
}
export { slab, slabGeo, outline, flipper, still, book, screenfold, scroll, lathe, disc, mesh, put, planarUV, V2 };

// ---------------------------------------------------------------- drawing kit for scenes (illustrative, simplified)
function star5(g, x, y, r, col) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fillStyle = col; g.fill(); }
function fillStroke(g, fill, stroke, w) { if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = w || 2; g.stroke(); } }
// a standing figure in profile, Egyptian manner: head (human or animal), kilt, stride
function profile(g, x, y, h, o) {
  o = o || {}; const s = h / 10, dir = o.left ? -1 : 1, col = o.col || "#8a4a2a", cloth = o.cloth || "#f0e8d8", line = o.line || "#1a1008";
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.beginPath(); g.moveTo(-0.6 * s, 10 * s); g.lineTo(-0.2 * s, 6 * s); g.lineTo(0.3 * s, 6 * s); g.lineTo(1.2 * s, 10 * s); fillStroke(g, col, line, s * 0.15);           // legs in stride
  g.beginPath(); g.moveTo(-0.9 * s, 6.3 * s); g.lineTo(0.9 * s, 6.3 * s); g.lineTo(0.7 * s, 4.6 * s); g.lineTo(-0.7 * s, 4.6 * s); g.closePath(); fillStroke(g, cloth, line, s * 0.15);   // kilt
  g.beginPath(); g.moveTo(-0.8 * s, 4.7 * s); g.lineTo(0.8 * s, 4.7 * s); g.lineTo(1.1 * s, 2.2 * s); g.lineTo(-1.1 * s, 2.2 * s); g.closePath(); fillStroke(g, col, line, s * 0.15);    // torso
  g.beginPath(); g.moveTo(0.9 * s, 2.5 * s); g.lineTo(2.2 * s, o.armUp ? 1 * s : 3.5 * s); fillStroke(g, null, col, s * 0.5);
  g.beginPath(); g.moveTo(-0.9 * s, 2.5 * s); g.lineTo(-1.4 * s, 4.5 * s); fillStroke(g, null, col, s * 0.5);
  g.beginPath();
  if (o.head === "jackal") { g.moveTo(-0.5 * s, 2.2 * s); g.lineTo(-0.4 * s, 0.4 * s); g.lineTo(-0.2 * s, -0.8 * s); g.lineTo(0.1 * s, 0.4 * s); g.lineTo(1.6 * s, 1.2 * s); g.lineTo(0.5 * s, 1.8 * s); g.closePath(); fillStroke(g, "#1a1410", line, s * 0.1); }
  else if (o.head === "ibis") { g.arc(0, 1.2 * s, 0.7 * s, 0, TAU); fillStroke(g, "#1a1410", line, s * 0.1); g.beginPath(); g.moveTo(0.5 * s, 1.1 * s); g.quadraticCurveTo(2 * s, 1.2 * s, 2.3 * s, 2.6 * s); fillStroke(g, null, "#1a1410", s * 0.25); }
  else if (o.head === "falcon") { g.arc(0, 1.2 * s, 0.75 * s, 0, TAU); fillStroke(g, "#3a5a30", line, s * 0.1); g.beginPath(); g.moveTo(0.6 * s, 1 * s); g.lineTo(1.1 * s, 1.4 * s); g.lineTo(0.6 * s, 1.6 * s); fillStroke(g, "#d8a030"); }
  else { g.arc(0, 1.2 * s, 0.75 * s, 0, TAU); fillStroke(g, col, line, s * 0.1); g.beginPath(); g.moveTo(-0.8 * s, 0.6 * s); g.lineTo(0.3 * s, 0.4 * s); g.lineTo(-0.1 * s, 2.4 * s); g.lineTo(-0.9 * s, 2.4 * s); fillStroke(g, o.wig || "#1a1a28"); }
  if (o.crown) { g.beginPath(); g.moveTo(-0.5 * s, 0.6 * s); g.lineTo(0, -1.4 * s); g.lineTo(0.5 * s, 0.6 * s); fillStroke(g, o.crown, line, s * 0.1); }
  g.restore();
}
// a frontal figure (Andean, Mesoamerican, medieval): head, body, arms out
function frontal(g, x, y, h, o) {
  o = o || {}; const s = h / 10, line = o.line || "#1a1008";
  g.save(); g.translate(x, y); g.lineWidth = s * 0.25; g.strokeStyle = line;
  g.fillStyle = o.body || "#a08060"; g.fillRect(-1.6 * s, 3.4 * s, 3.2 * s, 4 * s); g.strokeRect(-1.6 * s, 3.4 * s, 3.2 * s, 4 * s);
  g.fillRect(-1.2 * s, 7.4 * s, 0.9 * s, 2.6 * s); g.fillRect(0.3 * s, 7.4 * s, 0.9 * s, 2.6 * s);
  g.fillStyle = o.head || o.body || "#a08060"; g.fillRect(-1.3 * s, 0.6 * s, 2.6 * s, 2.8 * s); g.strokeRect(-1.3 * s, 0.6 * s, 2.6 * s, 2.8 * s);
  g.fillStyle = line; g.fillRect(-0.8 * s, 1.5 * s, 0.5 * s, 0.4 * s); g.fillRect(0.3 * s, 1.5 * s, 0.5 * s, 0.4 * s); g.fillRect(-0.5 * s, 2.6 * s, 1 * s, 0.25 * s);
  if (o.rays) for (let i = 0; i < 12; i++) { const a = -Math.PI + i / 11 * Math.PI; g.beginPath(); g.moveTo(Math.cos(a) * 1.6 * s, 2 * s + Math.sin(a) * 1.6 * s); g.lineTo(Math.cos(a) * 2.8 * s, 2 * s + Math.sin(a) * 2.8 * s); g.stroke(); g.beginPath(); g.arc(Math.cos(a) * 3 * s, 2 * s + Math.sin(a) * 3 * s, 0.3 * s, 0, TAU); g.stroke(); }
  if (o.staffs) [-1, 1].forEach((d) => { g.beginPath(); g.moveTo(d * 2.4 * s, 0.4 * s); g.lineTo(d * 2.4 * s, 8.5 * s); g.stroke(); g.beginPath(); g.moveTo(d * 1.6 * s, 4.5 * s); g.lineTo(d * 2.4 * s, 4.5 * s); g.stroke(); g.beginPath(); g.arc(d * 2.4 * s, 0.2 * s, 0.4 * s, 0, TAU); g.stroke(); });
  g.restore();
}
// an animal in profile: a simple silhouette of a body, legs, head and tail (bull, lion, dragon, fox, dog...)
function beast(g, x, y, L, o) {
  o = o || {}; const s = L / 10, line = o.line || "#1a1008"; g.save(); g.translate(x, y); if (o.left) g.scale(-1, 1);
  g.fillStyle = o.col || "#d8b060"; g.strokeStyle = line; g.lineWidth = s * 0.2;
  g.beginPath(); g.ellipse(0, 0, 4 * s, 1.8 * s, 0, 0, TAU); g.fill(); g.stroke();
  [-3, -1.8, 2, 3.2].forEach((lx, i) => { g.beginPath(); g.moveTo(lx * s, 1 * s); g.lineTo((lx + (o.dragon && i < 2 ? 0.6 : 0)) * s, 4.2 * s); g.lineWidth = s * 0.7; g.stroke(); if (o.dragon && i < 2) { g.beginPath(); g.moveTo(lx * s, 4.2 * s); g.lineTo((lx + 1) * s, 4.6 * s); g.lineWidth = s * 0.2; g.stroke(); } g.lineWidth = s * 0.2; });
  g.beginPath(); g.moveTo(3.4 * s, -1 * s); g.lineTo((o.dragon ? 5.4 : 4.8) * s, (o.dragon ? -4 : -2.2) * s); g.lineTo((o.dragon ? 6.6 : 6) * s, (o.dragon ? -4.4 : -1.8) * s); g.lineTo((o.dragon ? 6 : 5.4) * s, (o.dragon ? -3.4 : -0.8) * s); g.lineTo(4 * s, 0); g.closePath(); g.fill(); g.stroke();
  if (o.horns) { g.beginPath(); g.moveTo(5 * s, -2.2 * s); g.quadraticCurveTo(5.8 * s, -4 * s, 4.8 * s, -4.6 * s); g.stroke(); }
  if (o.mane) { g.beginPath(); g.arc(4.6 * s, -1.6 * s, 1.4 * s, 0, TAU); g.fill(); g.stroke(); }
  g.beginPath(); g.moveTo(-4 * s, -0.4 * s); g.quadraticCurveTo(-6.5 * s, (o.dragon ? -4 : -1) * s, -6 * s, (o.dragon ? -5 : -3) * s); g.lineWidth = s * (o.dragon ? 0.8 : 0.4); g.stroke();
  g.restore();
}
// the mushhushshu, the dragon of Marduk on the Ishtar Gate: a serpent's head with a horn and a forked tongue,
// a long neck and scaly body, a lion's forelegs, an eagle's hind legs, and a tail ending in a scorpion's sting
function mushhushshu(g, x, y, L, o) {
  const s = L / 20; g.save(); g.translate(x, y); g.lineJoin = "round";
  g.fillStyle = (o && o.col) || "#efe2bc"; g.strokeStyle = (o && o.line) || "#b8862a"; g.lineWidth = s * 0.25;
  g.beginPath(); g.moveTo(-7 * s, -1 * s); g.bezierCurveTo(-4 * s, -2.6 * s, 3 * s, -2.8 * s, 5 * s, -2 * s);   // back
  g.bezierCurveTo(6.5 * s, -4 * s, 6.8 * s, -7 * s, 7.4 * s, -9 * s);                                            // the long neck
  g.lineTo(9.6 * s, -9.2 * s); g.lineTo(8 * s, -8.2 * s); g.bezierCurveTo(7.6 * s, -6 * s, 7.8 * s, -3 * s, 6 * s, 0.6 * s);   // head and throat
  g.bezierCurveTo(3 * s, 1.4 * s, -4 * s, 1.2 * s, -7 * s, 0.4 * s); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(7.6 * s, -9.3 * s); g.lineTo(8.8 * s, -11.5 * s); g.lineTo(8.4 * s, -9.4 * s); g.fill(); g.stroke();   // horn
  g.beginPath(); g.moveTo(9.6 * s, -9.1 * s); g.lineTo(10.6 * s, -9.4 * s); g.moveTo(9.6 * s, -9.1 * s); g.lineTo(10.6 * s, -8.8 * s); g.stroke();   // tongue
  g.beginPath(); g.arc(8.3 * s, -9 * s, 0.25 * s, 0, TAU); g.stroke();
  // scales
  for (let i = 0; i < 40; i++) { const t = i / 40, px = -6 * s + t * 11 * s, py = -1.6 * s + Math.sin(t * 3) * 0.6 * s; g.beginPath(); g.arc(px, py + (i % 3) * 0.6 * s, 0.35 * s, 0, Math.PI); g.stroke(); }
  // lion forelegs, eagle hind legs with talons
  [[4.2, 0], [2.8, 0.2]].forEach(([lx, dy]) => { g.beginPath(); g.moveTo(lx * s, 0.6 * s); g.lineTo((lx + 0.4) * s, 5.5 * s); g.lineTo((lx + 1.5) * s, 5.8 * s); g.lineWidth = s * 0.9; g.stroke(); g.lineWidth = s * 0.25; });
  [[-4.6], [-5.8]].forEach(([lx]) => { g.beginPath(); g.moveTo(lx * s, 0.6 * s); g.lineTo((lx - 0.6) * s, 3 * s); g.lineTo((lx + 0.2) * s, 5.6 * s); g.lineWidth = s * 0.8; g.stroke(); g.lineWidth = s * 0.2; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo((lx + 0.2) * s, 5.6 * s); g.lineTo((lx + 0.2 + k * 0.8) * s, 6.2 * s); g.stroke(); } });
  // the tail, curling up to a sting
  g.beginPath(); g.moveTo(-7 * s, -0.4 * s); g.bezierCurveTo(-9.5 * s, -0.5 * s, -10.5 * s, -3.5 * s, -9 * s, -5 * s); g.lineWidth = s * 0.7; g.stroke(); g.lineWidth = s * 0.25;
  g.beginPath(); g.moveTo(-9 * s, -5 * s); g.lineTo(-8.2 * s, -5.8 * s); g.lineTo(-8.6 * s, -4.8 * s); g.fill(); g.stroke();
  g.restore();
}
// a rosette of petals
function rosette(g, x, y, r, n, col, line) { g.save(); g.translate(x, y); for (let i = 0; i < (n || 8); i++) { g.rotate(TAU / (n || 8)); g.beginPath(); g.ellipse(r * 0.5, 0, r * 0.45, r * 0.18, 0, 0, TAU); g.fillStyle = col; g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = r * 0.06; g.stroke(); } } g.beginPath(); g.arc(0, 0, r * 0.18, 0, TAU); g.fillStyle = line || "#fff"; g.fill(); g.restore(); }
// interlace border (Insular)
function interlace(g, x0, y0, x1, y1, col, bg, s) { g.fillStyle = bg; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeStyle = col; g.lineWidth = s * 0.28; for (let x = x0; x < x1; x += s) { g.beginPath(); for (let t = 0; t <= 1.001; t += 0.1) { const yy = y0 + (y1 - y0) * (0.5 + 0.38 * Math.sin((t + (x / s) % 2) * Math.PI)); g.lineTo(x + t * s, yy); } g.stroke(); g.beginPath(); for (let t = 0; t <= 1.001; t += 0.1) { const yy = y0 + (y1 - y0) * (0.5 - 0.38 * Math.sin((t + (x / s) % 2) * Math.PI)); g.lineTo(x + t * s, yy); } g.stroke(); } }
// relief on both colour and height: run a draw function on each context
function both(g, hg, fn, hval) { fn(g, false); if (hg) { hg.save(); hg.fillStyle = hval || "#b0b0b0"; hg.strokeStyle = hval || "#b0b0b0"; fn(hg, true); hg.restore(); } }

// ---------------------------------------------------------------- the catalogue
// each entry builds one object at its real size in metres (the display scales it) and says how it can be handled
export const CAT = {};
const cam = (id, label, c) => ({ id, label, camera: c });
const regions = (H, list) => list.map(([a, b]) => [a * H, b * H]);

// ---- stones, stelae and slabs
CAT.v53 = (E) => {                                          // the Rosetta Stone (BM EA 24): 112.3 × 75.7 × 28.4 cm, grey and pink granodiorite, broken top
  // the visual pass: the British Museum's published dimensions and the real number of lines in each script (14, 32, 54);
  // the marks are illustrative, never the text (sources/v53-rosetta-stone.md, "Museum rendition")
  const w = 0.757, h = 1.123, pts = outline(w, h, { jag: 0.02, jagT: 0.06 }); pts.forEach((p) => { if (p[1] > 0.79) p[1] -= (p[0] + w / 2) * 0.28 + (R() - 0.5) * 0.04; if (p[0] > 0.2 && p[1] < 0.25) p[0] -= (0.25 - p[1]) * 0.4; });
  const ink = { ink: "rgba(170,166,160,.42)" };
  const g = slab({ pts, d: 0.284, stone: "rosetta", env: E.env, relief: 5, px: 1400, paint: (c, hg, W, H) => {
    for (let i = 0; i < 5; i++) { c.strokeStyle = `rgba(150,110,105,${0.08 + R() * 0.08})`; c.lineWidth = 6 + R() * 18; c.beginPath(); const y = H * (0.05 + R() * 0.9); c.moveTo(0, y); c.bezierCurveTo(W * 0.3, y + (R() - 0.5) * 80, W * 0.7, y + (R() - 0.5) * 80, W, y + (R() - 0.5) * 60); c.stroke(); }   // the pink in the grey
    rows(c, hg, [W * 0.05, H * 0.04, W * 0.95, H * 0.255], "hiero", 14, Object.assign({ space: 0.04 }, ink));                // 14 lines of hieroglyphs (the top is lost)
    rows(c, hg, [W * 0.04, H * 0.275, W * 0.96, H * 0.595], "demotic", 32, ink);                                         // 32 lines of Demotic
    rows(c, hg, [W * 0.035, H * 0.615, W * 0.965, H * 0.975], "greek", 54, Object.assign({ space: 0.08 }, ink));          // 54 lines of Greek
    c.globalAlpha = 1;
  }, paintBack: (c, hg) => {                                   // the back was left rough, never dressed for display
    blotches(c, c.canvas.width, c.canvas.height, 30, "rgba(20,18,16,.25)", 60); blotches(hg, hg.canvas.width, hg.canvas.height, 60, "rgba(40,40,40,.5)", 40); blotches(hg, hg.canvas.width, hg.canvas.height, 50, "rgba(220,220,220,.35)", 30);
  } });
  return Object.assign({ root: g, note: "Modelled to the British Museum's dimensions (112.3 × 75.7 × 28.4 cm), with the real number of lines in each script: 14, 32 and 54." }, flipper(g));
};
CAT.v43 = (E) => {                                          // the Merneptah Stele: arched granite, a lunette scene over 28 lines
  const w = 1.63, h = 3.18, g = slab({ pts: outline(w, h, { arch: 0.55, jag: 0.015 }), d: 0.3, stone: "blackgranite", env: E.env, relief: 5, px: 1024, paint: (c, hg, W, H) => {
    const ly = H * 0.8; 
    both(c, hg, (x) => { x.beginPath(); x.ellipse(W / 2, H * 0.08 + 18, 40, 14, 0, 0, TAU); x.fill(); x.fillRect(W / 2 - 170, H * 0.08 + 12, 340, 10); }, "#c8c8c8");   // the winged sun
    const fig = (fx, left, o) => profile(c, fx, H * 0.1 + 34, H * 0.12, Object.assign({ left, col: "#6a6660", cloth: "#9a9690", line: "#2a2826" }, o));
    fig(W * 0.3, false, { crown: "#8a8680" }); fig(W * 0.42, true, { crown: "#8a8680" }); fig(W * 0.58, false, {}); fig(W * 0.7, true, { crown: "#8a8680" });
    rows(c, hg, [W * 0.06, H * 0.27, W * 0.94, H * 0.965], "hiero", 28, { ink: "rgba(150,146,140,.45)", space: 0.05 });   // 28 lines
  }, paintBack: (c, hg, W, H) => {                             // the back: the earlier inscription of Amenhotep III, whose stela Merneptah reused (illustrative marks)
    write(c, hg, [W * 0.08, H * 0.2, W * 0.92, H * 0.92], "hiero", { size: 13, ink: "rgba(30,28,26,.55)", lh: 19 });
    blotches(c, W, H, 14, "rgba(20,18,16,.2)", 90);
  } });
  return Object.assign({ root: g, note: "Modelled at 3.18 × 1.63 m (some sources give 3.10 × 1.60 m), with its 28 lines; the back carries the older inscription of Amenhotep III." }, flipper(g));
};
CAT.v22 = (E) => {                                          // the Mesha Stele: arched basalt, rebuilt from fragments with plaster between
  const w = 0.6, h = 1.15, g = slab({ pts: outline(w, h, { arch: 0.9, jag: 0.01 }), d: 0.3, stone: "basalt", env: E.env, relief: 5, paint: (c, hg, W, H) => {
    // the plaster infill between the surviving fragments, then 34 lines where the stone survives
    c.fillStyle = "#8a8074"; for (let i = 0; i < 9; i++) { c.beginPath(); const x = R() * W, y = R() * H; for (let k = 0; k < 7; k++) c.lineTo(x + (R() - 0.5) * W * 0.35, y + (R() - 0.5) * H * 0.2); c.closePath(); c.fill(); }
    write(c, hg, [W * 0.07, H * 0.06, W * 0.93, H * 0.8], "hebrew", { size: 10, lh: 13, ink: "rgba(200,190,170,.5)" });
  } });
  return Object.assign({ root: g }, flipper(g));
};
CAT.v23 = (E) => {                                          // the Tel Dan Stele: three basalt fragments
  const root = new THREE.Group();
  [[0.32, 0.22, -0.2, 0], [0.2, 0.2, 0.17, 0.05], [0.14, 0.12, 0.2, -0.13]].forEach(([w, h, x, y], i) => {
    const pts = outline(w, h, { jag: 0.03, n: 8 }); const f = slab({ pts, d: 0.08, stone: "basalt", env: E.env, relief: 5, paint: (c, hg, W, H) => write(c, hg, [W * 0.02, H * 0.05, W * 0.98, H * 0.95], "aramaic", { size: 14, lh: 19, ink: "rgba(200,190,170,.5)" }) });
    f.position.set(x, y + 0.12, 0); f.rotation.z = (R() - 0.5) * 0.2; root.add(f);
  });
  return Object.assign({ root }, flipper(root));
};
CAT.v44 = (E) => {                                          // the Pilate Stone: a limestone block, four lines, its left side chipped away
  const w = 0.82, h = 0.65, pts = outline(w, h, { jag: 0.02, jagL: 0.08, n: 10 }); pts.forEach((p) => { if (p[0] < -0.2) p[0] += (R() * 0.08); });
  const g = slab({ pts, d: 0.2, stone: "limestone", env: E.env, relief: 5, paint: (c, hg, W, H) => { for (let i = 0; i < 4; i++) write(c, hg, [W * (0.28 + i * 0.03), H * (0.2 + i * 0.16), W * 0.9, H * (0.3 + i * 0.16)], "latin", { size: 26, lh: 30, ink: "rgba(60,50,40,.7)", space: 0.2 }); } });
  return Object.assign({ root: g }, flipper(g));
};
CAT.v47 = (E) => {                                          // the Kensington Runestone: a greywacke slab with runes on its face and one edge
  const g = slab({ pts: outline(0.41, 0.76, { jag: 0.012 }), d: 0.15, stone: "greywacke", env: E.env, relief: 5, paint: (c, hg, W, H) => write(c, hg, [W * 0.08, H * 0.1, W * 0.92, H * 0.9], "runes", { size: 18, lh: 26, ink: "rgba(30,30,28,.8)" }) });
  return Object.assign({ root: g }, flipper(g));
};
CAT.v36 = (E) => {                                          // the Rök Runestone: a tall granite slab covered in runes, lines between the rows
  const g = slab({ pts: outline(1.4, 2.5, { arch: 0.25, jag: 0.03 }), d: 0.25, stone: "granite", env: E.env, relief: 5, paint: (c, hg, W, H) => { for (let y = H * 0.06; y < H * 0.95; y += 34) { c.fillStyle = "rgba(30,28,26,.5)"; c.fillRect(W * 0.05, y, W * 0.9, 2); } write(c, hg, [W * 0.06, H * 0.06, W * 0.94, H * 0.94], "runes", { size: 22, lh: 34, ink: "rgba(30,28,26,.8)" }); },
    paintBack: (c, hg, W, H) => write(c, hg, [W * 0.06, H * 0.06, W * 0.94, H * 0.94], "runes", { size: 20, lh: 30, ink: "rgba(30,28,26,.8)" }) });
  return Object.assign({ root: g }, flipper(g));
};
CAT.v54 = (E) => {                                          // the Behistun relief: Darius, the captives, the winged symbol, columns of cuneiform below
  const g = slab({ pts: outline(1.6, 1.0, { jag: 0.02 }), d: 0.2, stone: "limestone", env: E.env, relief: 7, px: 1400, paint: (c, hg, W, H) => {
    
    const base = H * 0.52, col = "#a89478";
    both(c, hg, (x) => { x.fillStyle = col; x.fillRect(W * 0.08, base - 4, W * 0.84, 8); }, "#b8b8b8");
    both(c, hg, (x) => { profile(x, W * 0.18, base - H * 0.34, H * 0.34, { col, cloth: col, line: "#4a3e30", crown: col }); profile(x, W * 0.12, base - H * 0.28, H * 0.28, { col, cloth: col, line: "#4a3e30" }); }, "#c0c0c0");
    for (let i = 0; i < 9; i++) both(c, hg, (x) => profile(x, W * (0.4 + i * 0.058), base - H * 0.22, H * 0.22, { left: true, col, cloth: col, line: "#4a3e30", armUp: false }), "#b8b8b8");
    both(c, hg, (x) => { x.save(); x.translate(W * 0.55, H * 0.12); x.fillStyle = col; x.beginPath(); x.arc(0, 0, 16, 0, TAU); x.fill(); x.fillRect(-120, -6, 240, 14); for (let k = 0; k < 5; k++) { x.fillRect(-120 + k * 10, 8, 6, 18); x.fillRect(114 - k * 10, 8, 6, 18); } x.restore(); }, "#c8c8c8");   // the winged symbol
    for (let k = 0; k < 4; k++) write(c, hg, [W * (0.06 + k * 0.22), H * 0.58, W * (0.26 + k * 0.22), H * 0.96], "cuneiform", { size: 12, lh: 16, ink: "rgba(40,30,20,.7)" });
    
  } });
  return Object.assign({ root: g }, still([cam("king", "The king and the captives", { yaw: 0, pitch: 0.05, dist: 0.9 })]));
};
CAT.v34 = (E) => {                                          // the Pyramid Texts of Unas: columns of hieroglyphs filled with blue, under a gabled ceiling of stars (the burial chamber, 7.3 × 3.08 m)
  const root = new THREE.Group();
  const wall = slab({ pts: outline(1.4, 1.1, { jag: 0.004 }), d: 0.12, stone: "limestone", env: E.env, relief: 4, px: 1400, paint: (c, hg, W, H) => {
    for (let x = W * 0.03; x < W * 0.97; x += 46) { c.fillStyle = "rgba(60,40,20,.35)"; c.fillRect(x, 0, 2, H); }
    write(c, hg, [W * 0.03, H * 0.03, W * 0.97, H * 0.97], "hiero", { size: 26, gap: 5, cols: true, ink: "#2f6fa0", weight: 3.5 });
  } });
  root.add(wall);
  const starMat = surface("limestone", 1024, 512, (c) => { c.fillStyle = "#1c2c5a"; c.fillRect(0, 0, 1024, 512); for (let y = 28; y < 512; y += 56) for (let x = 22 + ((y / 56) % 2) * 28; x < 1024; x += 56) star5(c, x, y, 13, "#e0c060"); }, { relief: 2 });
  starMat.side = THREE.DoubleSide;
  for (const [th, z] of [[1.142, 0.125], [1.998, 0.475]]) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.385), starMat); pl.rotation.x = th; pl.position.set(0, 1.22, z); root.add(pl); }   // the gabled ceiling, painted with five-pointed stars
  const ceil = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.05, 0.12), plain("limestone"));   // the cornice where wall meets gable
  ceil.position.set(0, 1.135, 0.02); root.add(ceil);
  return Object.assign({ root }, still([cam("stars", "Look up at the stars", { pitch: -0.6, dist: 1.4 })]));
};
CAT.v52 = (E) => {                                          // the Ishtar Gate: glazed blue brick, a dragon of Marduk and rosettes, in relief
  const w = 1.3, h = 1.1, g = slab({ pts: outline(w, h, { jag: 0 }), d: 0.3, bevel: 0.01, stone: "glaze", env: E.env, relief: 8, px: 1400, paint: (c, hg, W, H) => {
    const bh = H / 14, bw = W / 7;
    for (let r = 0; r < 14; r++) for (let k = -1; k < 8; k++) { const x = k * bw + (r % 2) * bw / 2, y = r * bh; c.fillStyle = `hsl(${212 + R() * 10},${60 + R() * 15}%,${28 + R() * 10}%)`; c.fillRect(x + 2, y + 2, bw - 4, bh - 4); if (hg) { hg.fillStyle = "#606060"; hg.fillRect(x, y, bw, 3); hg.fillRect(x, y, 3, bh); } }
    const bandY = [H * 0.08, H * 0.9];
    bandY.forEach((y) => { for (let x = 40; x < W; x += 90) both(c, hg, (q) => rosette(q, x, y, 30, 10, "#f0e8d0", "#d8a030"), "#c8c8c8"); });
    
    both(c, hg, (q) => mushhushshu(q, W * 0.5, H * 0.56, W * 0.62), "#d8d8d8");
    
  } });
  return Object.assign({ root: g }, flipper(g));
};
CAT.v60 = (E) => {                                          // a pillar of Göbekli Tepe: a T of limestone with arms, hands, a belt, and a fox
  const root = new THREE.Group(), lime = E.env ? plain("limestone", E.env) : plain("limestone");
  const side = surface("limestone", 512, 1024, (c, hg, W, H) => {
    both(c, hg, (q) => { q.lineWidth = 26; q.strokeStyle = q.fillStyle; q.beginPath(); q.moveTo(W * 0.3, H * 0.28); q.lineTo(W * 0.5, H * 0.55); q.lineTo(W * 0.85, H * 0.62); q.stroke(); for (let f = 0; f < 5; f++) { q.lineWidth = 8; q.beginPath(); q.moveTo(W * 0.85, H * (0.6 + f * 0.012)); q.lineTo(W * 0.98, H * (0.6 + f * 0.014)); q.stroke(); } }, "#c0c0c0");
    both(c, hg, (q) => { q.fillRect(0, H * 0.66, W, 30); }, "#b8b8b8");                    // the belt
    both(c, hg, (q) => { q.save(); q.translate(W * 0.5, H * 0.3); q.rotate(Math.PI / 2); beast(q, 0, 0, W * 0.5, { col: "#c8b898", line: "#6a5a40" }); q.restore(); }, "#c8c8c8");
  }, { env: E.env, relief: 6 });
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.4, 1.0), [side, side, lime, lime, lime, lime]); shaft.position.y = 1.7; root.add(shaft);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.7, 1.7), lime); head.position.set(0, 3.7, 0.3); root.add(head);
  root.traverse((o) => { o.castShadow = o.receiveShadow = true; });
  return Object.assign({ root }, still([cam("arms", "The carved arms and belt", { yaw: 1.57, pitch: 0.05, dist: 2.2, target: 1.9 })]));
};
CAT.v65 = (E) => {                                          // the Gate of the Sun at Tiwanaku: a monolithic andesite doorway with the Staff God
  const w = 3.84, h = 2.73, sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, h); sh.lineTo(-w / 2, h); sh.closePath();
  const hole = new THREE.Path(); hole.moveTo(-0.5, 0); hole.lineTo(0.5, 0); hole.lineTo(0.5, 1.4); hole.lineTo(-0.5, 1.4); hole.closePath(); sh.holes.push(hole);
  const d = 0.5, bb = [-w / 2, 0, w / 2, h];
  const body = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }); body.translate(0, 0, -d / 2);
  const front = planarUV(new THREE.ShapeGeometry(sh, 4), bb); front.translate(0, 0, d / 2 + 0.002);
  const fm = surface("andesite", 1400, Math.round(1400 * h / w), (c, hg, W, H) => {
    
    const top = H * 0.08, fh = H * 0.3;
    both(c, hg, (q) => frontal(q, W / 2, top, fh, { rays: true, staffs: true, body: "#7a766e", line: "#3a3834" }), "#c8c8c8");
    for (let row = 0; row < 3; row++) for (let k = 0; k < 8; k++) [-1, 1].forEach((sd) => both(c, hg, (q) => { const x = W / 2 + sd * (W * 0.1 + k * W * 0.048), y = top + row * fh * 0.36; q.save(); q.translate(x, y); if (sd < 0) q.scale(-1, 1); q.fillStyle = "#7a766e"; q.fillRect(-12, 6, 24, 30); q.beginPath(); q.arc(0, 0, 10, 0, TAU); q.fill(); q.beginPath(); q.moveTo(-10, 10); q.lineTo(-30, 0); q.lineTo(-12, 26); q.fill(); q.restore(); }, "#b8b8b8"));
    both(c, hg, (q) => { q.fillStyle = "#7a766e"; for (let x = W * 0.06; x < W * 0.94; x += 40) { q.fillRect(x, top + fh * 1.12, 30, 8); q.fillRect(x + 22, top + fh * 1.12, 8, 22); } }, "#b0b0b0");   // the meander band
    
  }, { env: E.env, relief: 6 });
  const side = plain("andesite", E.env);
  const root = new THREE.Group(); root.add(mesh(body, side), mesh(front, fm));
  return Object.assign({ root }, still([cam("god", "The Staff God", { yaw: 0, pitch: 0.05, dist: 1.6, target: 2.35 })]));
};
CAT.v70 = (E) => {                                          // a Pictish symbol stone: crescent and V-rod, double disc and Z-rod, mirror and comb, the beast
  const g = slab({ pts: outline(0.7, 1.6, { jag: 0.06, arch: 0.4 }), d: 0.22, stone: "sandstone", env: E.env, relief: 7, paint: (c, hg, W, H) => {
    
    const ink = "rgba(60,40,25,.85)", lw = 10;
    const draw = (q) => { q.strokeStyle = ink; q.lineWidth = lw;
      q.beginPath(); q.arc(W / 2, H * 0.18, W * 0.28, Math.PI * 1.05, Math.PI * 1.95); q.arc(W / 2, H * 0.24, W * 0.22, Math.PI * 1.9, Math.PI * 1.1, true); q.closePath(); q.stroke();
      q.beginPath(); q.moveTo(W * 0.25, H * 0.26); q.lineTo(W * 0.5, H * 0.14); q.lineTo(W * 0.75, H * 0.26); q.stroke();
      [0.32, 0.68].forEach((fx) => { q.beginPath(); q.arc(W * fx, H * 0.42, W * 0.14, 0, TAU); q.stroke(); q.beginPath(); q.arc(W * fx, H * 0.42, W * 0.05, 0, TAU); q.stroke(); });
      q.beginPath(); q.moveTo(W * 0.15, H * 0.36); q.lineTo(W * 0.85, H * 0.36); q.lineTo(W * 0.15, H * 0.48); q.lineTo(W * 0.85, H * 0.48); q.stroke();
      beast(q, W * 0.5, H * 0.66, W * 0.6, { col: "rgba(0,0,0,0)", line: ink });
      q.beginPath(); q.arc(W * 0.3, H * 0.86, W * 0.08, 0, TAU); q.moveTo(W * 0.3, H * 0.94); q.lineTo(W * 0.3, H * 0.98); q.stroke();                   // mirror
      q.strokeRect(W * 0.55, H * 0.84, W * 0.25, H * 0.03); for (let k = 0; k < 8; k++) { q.beginPath(); q.moveTo(W * (0.56 + k * 0.03), H * 0.87); q.lineTo(W * (0.56 + k * 0.03), H * 0.9); q.stroke(); }   // comb
    };
    draw(c); if (hg) { const s2 = hg.strokeStyle; draw(hg); }
    
  } });
  return Object.assign({ root: g }, flipper(g));
};
CAT.v71 = (E) => {                                          // a stećak: a gabled house-shaped tombstone with spirals, crescent, a hunt and the raised hand
  const root = new THREE.Group(), L = 1.9, Wd = 0.8, H = 0.9, roof = 0.45;
  const sideMat = surface("limestone", 1024, 512, (c, hg, W, Hh) => {
    both(c, hg, (q) => { q.strokeStyle = q.fillStyle; q.lineWidth = 8; for (let x = 40; x < W - 20; x += 70) { q.beginPath(); for (let t = 0; t < 12; t += 0.2) q.lineTo(x + Math.cos(t) * t * 2.2, Hh * 0.14 + Math.sin(t) * t * 2.2); q.stroke(); } }, "#c0c0c0");
    both(c, hg, (q) => { for (let k = 0; k < 6; k++) profile(q, W * (0.1 + k * 0.08), Hh * 0.35, Hh * 0.5, { col: "#b0a48c", cloth: "#b0a48c", line: "#6a5e48" }); }, "#c8c8c8");   // the circle dance
    both(c, hg, (q) => { profile(q, W * 0.72, Hh * 0.32, Hh * 0.55, { col: "#b0a48c", cloth: "#b0a48c", line: "#6a5e48", armUp: true }); q.save(); q.translate(W * 0.72 + Hh * 0.13, Hh * 0.32); q.fillStyle = "#b0a48c"; q.beginPath(); q.arc(0, 0, 18, 0, TAU); q.fill(); for (let f = 0; f < 5; f++) q.fillRect(-14 + f * 7, -40, 5, 28); q.restore(); }, "#d0d0d0");   // the man with the raised hand
    both(c, hg, (q) => { beast(q, W * 0.9, Hh * 0.7, W * 0.12, { col: "#b0a48c", line: "#6a5e48", horns: true }); }, "#c0c0c0");
    both(c, hg, (q) => { q.beginPath(); q.arc(W * 0.9, Hh * 0.28, 30, 0.6, Math.PI * 2 - 0.6); q.arc(W * 0.9 + 12, Hh * 0.28, 24, Math.PI * 2 - 0.9, 0.9, true); q.fill(); }, "#d0d0d0");   // crescent
  }, { env: E.env, relief: 7 });
  const lime = plain("limestone", E.env);
  const box = new THREE.Mesh(new THREE.BoxGeometry(L, H, Wd), [lime, lime, lime, lime, sideMat, sideMat]); box.position.y = H / 2; root.add(box);
  const gs = new THREE.Shape(); gs.moveTo(-Wd / 2 - 0.04, 0); gs.lineTo(Wd / 2 + 0.04, 0); gs.lineTo(0, roof); gs.closePath();
  const gable = new THREE.ExtrudeGeometry(gs, { depth: L + 0.06, bevelEnabled: false }); gable.rotateY(Math.PI / 2); gable.translate(-(L + 0.06) / 2, H, 0); root.add(mesh(gable, lime));
  root.traverse((o) => { o.castShadow = o.receiveShadow = true; });
  return Object.assign({ root }, still([cam("hand", "The man with the raised hand", { yaw: 0, pitch: 0.1, dist: 1.4, target: 0.5 })]));
};

// ---------------------------------------------------------------- building one, at display size
// display: the largest dimension the object is shown at (the inspector and the museum's cases size it
// to their own space); the real size stays in the label
export function hasRelic(id) { return !!CAT[id]; }
export function buildRelic(id, env, q, fitTo) {
  const f = CAT[id]; if (!f) return null;
  R = rng(parseInt(id.slice(1), 10) * 7919 + 13); QS = (q || 2) > 1 ? 1 : 0.5;
  let m; try { m = f({ env, q: q || 2 }); } finally { QS = 1; }
  const holder = new THREE.Group(); holder.add(m.root);
  m.root.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(m.root), size = bb.getSize(new THREE.Vector3());
  const box = fitTo || [0.9, 0.9, 0.9], k = Math.min(box[0] / Math.max(size.x, 1e-3), box[1] / Math.max(size.y, 1e-3), box[2] / Math.max(size.z, 1e-3));
  m.root.scale.multiplyScalar(k);
  m.root.position.x -= (bb.min.x + bb.max.x) / 2 * k; m.root.position.z -= (bb.min.z + bb.max.z) / 2 * k; m.root.position.y -= bb.min.y * k;
  const H = size.y * k, D = Math.max(size.x, size.z) * k;
  // camera actions were written in the object's own metres: bring their targets and distances to the display scale
  (m.actions || []).forEach((a) => { if (a.camera) { if (a.camera.target != null) a.camera.target = a.camera.target * k; if (a.camera.dist != null) a.camera.dist = Math.max(0.3, a.camera.dist * k); } });
  holder.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  if (m.postMeasure) m.postMeasure();
  return Object.assign({ target: H / 2, fit: Math.max(1.2, Math.max(H, D) * 2.1), note: m.note || null, scale: k }, m, { root: holder });
}

// ---- discs, figurines, vessels and metalwork
CAT.v45 = (E) => {                                          // the Nebra Sky Disc: green bronze, a gold sun, crescent, 32 stars, two horizon arcs (one lost), a boat, holes at the rim
  const r = 0.16, face = surface("bronze", 1024, 1024, (c, hg, W) => {
    const cx = W / 2, gold = (fn) => both(c, hg, (q) => { q.fillStyle = "#e0b850"; fn(q); }, "#d0d0d0");
    gold((q) => { q.beginPath(); q.arc(cx - W * 0.1, cx - W * 0.08, W * 0.12, 0, TAU); q.fill(); });
    gold((q) => { q.beginPath(); q.arc(cx + W * 0.14, cx + W * 0.02, W * 0.13, -1.2, 1.9); q.arc(cx + W * 0.18, cx + W * 0.0, W * 0.1, 1.7, -1.0, true); q.closePath(); q.fill(); });
    const stars = []; const Rs = rng(45);
    for (let i = 0; i < 25; i++) { let x, y, ok; do { x = cx + (Rs() - 0.5) * W * 0.78; y = cx + (Rs() - 0.5) * W * 0.78; ok = Math.hypot(x - cx, y - cx) < W * 0.36 && Math.hypot(x - cx + W * 0.1, y - cx + W * 0.08) > W * 0.16 && Math.hypot(x - cx - W * 0.14, y - cx - W * 0.02) > W * 0.15; } while (!ok); stars.push([x, y]); }
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; stars.push([cx - W * 0.02 + Math.cos(a) * W * 0.035 + (i ? 0 : 0), cx - W * 0.25 + Math.sin(a) * W * 0.03]); }   // the cluster read as the Pleiades
    stars.forEach(([x, y]) => gold((q) => { q.beginPath(); q.arc(x, y, W * 0.013, 0, TAU); q.fill(); }));
    gold((q) => { q.beginPath(); q.arc(cx, cx, W * 0.46, Math.PI * 0.62, Math.PI * 1.38); q.arc(cx, cx, W * 0.42, Math.PI * 1.36, Math.PI * 0.64, true); q.closePath(); q.fill(); });   // the western horizon arc (the eastern is lost)
    c.strokeStyle = "rgba(20,40,30,.6)"; c.lineWidth = 3; c.beginPath(); c.arc(cx, cx, W * 0.46, -Math.PI * 0.38, Math.PI * 0.38); c.stroke();
    gold((q) => { q.beginPath(); q.arc(cx, cx + W * 0.2, W * 0.2, Math.PI * 0.28, Math.PI * 0.72); q.arc(cx, cx + W * 0.2, W * 0.17, Math.PI * 0.7, Math.PI * 0.3, true); q.closePath(); q.fill(); });   // the boat
    c.fillStyle = "#1a2a22"; for (let i = 0; i < 39; i++) { const a = i / 39 * TAU; c.beginPath(); c.arc(cx + Math.cos(a) * W * 0.485, cx + Math.sin(a) * W * 0.485, W * 0.007, 0, TAU); c.fill(); }
    // green corrosion creeping over the gold
    for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(${40 + R() * 40},${90 + R() * 50},${70 + R() * 30},${R() * 0.5})`; c.beginPath(); c.arc(R() * W, R() * W, 1 + R() * 6, 0, TAU); c.fill(); }
  }, { env: E.env, relief: 6 });
  const g = disc(r, 0.004, face, plain("bronze", E.env), plain("bronze", E.env)); g.position.y = r; g.rotation.x = -0.25;
  const root = new THREE.Group(); root.add(g);
  return Object.assign({ root }, flipper(root, "y", [cam("pleiades", "The cluster of seven", { yaw: 0, pitch: 0.2, dist: 0.25, target: 0.22 })]));
};
CAT.v56 = (E) => {                                          // the Phaistos Disc: fired clay, a spiral of stamped signs in boxes on both sides
  const side = (seed) => surface("clay", 1024, 1024, (c, hg, W) => {
    R = rng(seed); const cx = W / 2;
    c.strokeStyle = "rgba(60,35,20,.8)"; c.lineWidth = 3; if (hg) { hg.strokeStyle = "#404040"; hg.lineWidth = 4; }
    const spir = (q) => { q.beginPath(); for (let a = 0; a < TAU * 4.6; a += 0.05) { const r = W * 0.47 - a * W * 0.0145; q.lineTo(cx + Math.cos(a) * r, cx + Math.sin(a) * r); } q.stroke(); };
    spir(c); if (hg) spir(hg);
    for (let a = 0.3; a < TAU * 4.3; a += 0.42 - a * 0.004) { const r = W * 0.44 - a * W * 0.0145; const q2 = (q) => { q.beginPath(); q.moveTo(cx + Math.cos(a) * (r - W * 0.035), cx + Math.sin(a) * (r - W * 0.035)); q.lineTo(cx + Math.cos(a) * (r + W * 0.03), cx + Math.sin(a) * (r + W * 0.03)); q.stroke(); }; q2(c); if (hg) q2(hg); }   // word dividers
    spiral(c, hg, cx, cx, W * 0.43, W * 0.05, "stamp", { size: 20, pitch: 2.7, ink: "rgba(60,35,20,.85)" });
  }, { env: E.env, relief: 7 });
  const g = disc(0.08, 0.02, side(561), side(562), plain("clay")); g.position.y = 0.08; g.rotation.x = -0.2;
  const root = new THREE.Group(); root.add(g);
  return Object.assign({ root }, flipper(root));
};
CAT.v86 = (E) => {                                          // the Berlin Gold Hat: a tall gold cone with a brim, stamped with bands of discs and crescents
  const gold = surface("gold", 512, 2048, (c, hg, W, H) => {
    for (let y = 30; y < H - 30; y += 64) {
      both(c, hg, (q) => { q.fillStyle = "#f0cc70"; q.fillRect(0, y - 3, W, 6); }, "#c0c0c0");
      const kind = (y / 64 | 0) % 4;
      for (let x = 20; x < W; x += 44) both(c, hg, (q) => { q.strokeStyle = "#b88a30"; q.lineWidth = 3; q.beginPath(); if (kind === 1) { q.arc(x, y + 30, 14, 0.6, TAU - 0.6); } else { for (let k = 1; k <= (kind === 2 ? 4 : 3); k++) { q.moveTo(x + k * 5, y + 30); q.arc(x, y + 30, k * 5, 0, TAU); } } q.stroke(); }, "#b0b0b0");
    }
  }, { env: E.env, relief: 6 });
  const prof = [[0, 0], [0.18, 0], [0.19, 0.005], [0.1, 0.02], [0.095, 0.1], [0.088, 0.25], [0.075, 0.4], [0.06, 0.55], [0.045, 0.65], [0.03, 0.71], [0.012, 0.74], [0, 0.745]];
  const hat = lathe(prof, gold, 72); gold.map.repeat.set(3, 1);
  const root = new THREE.Group(); root.add(hat);
  // the star at the tip
  const star = new THREE.Shape(); for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, r = k % 2 ? 0.006 : 0.014; star[k ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r); }
  const sm = mesh(new THREE.ShapeGeometry(star), plain("gold", E.env), 0, 0.746, 0); sm.rotation.x = -Math.PI / 2; root.add(sm);
  return Object.assign({ root }, still([cam("bands", "The bands of discs and crescents", { yaw: 0.3, pitch: 0.1, dist: 0.5, target: 0.4 })]));
};
// a sculpted figure from swept cross-sections along y: prof [[y, rx, rz, cx, cz], ...]
function sculpt(prof, seg, color) {
  const pos = [], idx = [], n = prof.length;
  for (let i = 0; i < n; i++) { const [y, rx, rz, cx, cz] = prof[i]; for (let k = 0; k <= seg; k++) { const a = k / seg * TAU; pos.push((cx || 0) + Math.cos(a) * rx, y, (cz || 0) + Math.sin(a) * rz); } }
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < seg; k++) { const a = i * (seg + 1) + k, b = a + seg + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  const uv = []; for (let i = 0; i < n; i++) for (let k = 0; k <= seg; k++) uv.push(k / seg, i / (n - 1)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals(); return g;
}
function bumpy(g, amt, freq, seed) { const P = g.attributes.position, N = g.attributes.normal, Rr = rng(seed || 3); const ph = [Rr() * 9, Rr() * 9, Rr() * 9]; for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), k = amt * (Math.sin(x * freq + ph[0]) * Math.sin(y * freq * 1.3 + ph[1]) * Math.sin(z * freq * 0.9 + ph[2])); P.setXYZ(i, x + N.getX(i) * k, y + N.getY(i) * k, z + N.getZ(i) * k); } g.computeVertexNormals(); return g; }
CAT.v59 = (E) => {                                          // the Venus of Willendorf: 11 cm of limestone, no face, the head in rows of knobs, traces of red ochre
  const lime = surface("limestone", 512, 512, (c, hg, W, H) => { blotches(c, W, H, 18, "rgba(170,60,40,.35)", W / 8); }, { relief: 3 });
  const root = new THREE.Group();
  const body = sculpt([[0.0, 0.004, 0.004], [0.004, 0.012, 0.011], [0.012, 0.016, 0.014, 0, 0.002], [0.022, 0.02, 0.018, 0, 0.004], [0.032, 0.026, 0.022, 0, 0.004], [0.04, 0.03, 0.024, 0, 0.006], [0.048, 0.03, 0.028, 0, 0.01], [0.056, 0.028, 0.03, 0, 0.012], [0.064, 0.026, 0.026, 0, 0.008], [0.072, 0.026, 0.022, 0, 0.004], [0.078, 0.02, 0.017], [0.083, 0.012, 0.012], [0.086, 0.012, 0.012]], 40);
  root.add(mesh(bumpy(body, 0.0008, 300, 5), lime));
  // legs: two tapering forms ending without feet
  [-1, 1].forEach((s) => { const l = mesh(sculpt([[0, 0.004, 0.005, s * 0.008], [0.012, 0.008, 0.009, s * 0.009], [0.024, 0.011, 0.012, s * 0.01, 0.002]], 18), lime); root.add(l); });
  // breasts, and the thin arms resting on them with their zig-zag bracelets
  [-1, 1].forEach((s) => { const b = mesh(new THREE.SphereGeometry(0.012, 20, 14), lime, s * 0.012, 0.062, 0.022); b.scale.set(1, 1.35, 0.9); root.add(b);
    const arm = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(s * 0.024, 0.078, 0.008), new THREE.Vector3(s * 0.025, 0.072, 0.024), new THREE.Vector3(s * 0.016, 0.068, 0.034)]), 12, 0.0028, 8); root.add(mesh(arm, lime)); });
  // the head: rows of knobs spiralling round, no face
  const head = new THREE.Group(); head.position.y = 0.097; root.add(head);
  head.add(mesh(new THREE.SphereGeometry(0.013, 20, 14), lime));
  for (let row = 0; row < 7; row++) { const lat = -0.35 + row * 0.26, n = Math.round(14 * Math.cos(lat)) + 3; for (let k = 0; k < n; k++) { const a = k / n * TAU + row * 0.3; const kn = mesh(new THREE.SphereGeometry(0.0032, 8, 6), lime, Math.cos(a) * Math.cos(lat) * 0.0135, Math.sin(lat) * 0.0135, Math.sin(a) * Math.cos(lat) * 0.0135); kn.scale.set(1.2, 0.7, 1.2); head.add(kn); } }
  head.scale.set(1, 1.05, 1);
  return Object.assign({ root, note: "Shown enlarged: the figure is 11 cm tall." }, still([cam("head", "The head, without a face", { yaw: 0, pitch: 0.2, dist: 0.25, target: 0.8 })]));
};
CAT.v58 = (E) => {                                          // the Lion Man: 31 cm of mammoth ivory, a lion's head on an upright body, notches on the left arm, rebuilt from fragments
  const iv = surface("ivory", 512, 1024, (c, hg, W, H) => {
    for (let i = 0; i < 40; i++) { c.strokeStyle = "rgba(60,40,20,.45)"; c.lineWidth = 1 + R() * 2; c.beginPath(); let x = R() * W, y = R() * H; c.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (R() - 0.5) * 40; y += R() * 50; c.lineTo(x, y); } c.stroke(); }   // the cracks between the fragments
    for (let i = 0; i < 8; i++) { c.fillStyle = "rgba(90,60,30,.35)"; c.beginPath(); c.ellipse(R() * W, R() * H, 30 + R() * 40, 20 + R() * 60, 0, 0, TAU); c.fill(); }   // fillers and lost areas
  }, { relief: 3 });
  const root = new THREE.Group();
  const torso = sculpt([[0.1, 0.022, 0.017, 0, 0], [0.13, 0.028, 0.019], [0.16, 0.03, 0.02], [0.19, 0.03, 0.021], [0.22, 0.034, 0.022], [0.245, 0.03, 0.02], [0.255, 0.018, 0.016]], 32); root.add(mesh(torso, iv));
  [-1, 1].forEach((s) => { root.add(mesh(sculpt([[0, 0.012, 0.013, s * 0.013], [0.04, 0.014, 0.014, s * 0.013], [0.07, 0.017, 0.015, s * 0.013], [0.1, 0.018, 0.016, s * 0.012]], 18), iv));
    root.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(s * 0.036, 0.235, 0), new THREE.Vector3(s * 0.04, 0.19, 0.004), new THREE.Vector3(s * 0.038, 0.14, 0.006)]), 12, 0.009, 10), iv));
    if (s < 0) for (let k = 0; k < 7; k++) root.add(mesh(new THREE.BoxGeometry(0.019, 0.0015, 0.004), plain("leather"), s * 0.04, 0.215 - k * 0.006, 0.008)); });   // the seven notches
  const head = new THREE.Group(); head.position.set(0, 0.28, 0.004); root.add(head);
  head.add(mesh(new THREE.SphereGeometry(0.024, 24, 18), iv)); const muz = mesh(new THREE.SphereGeometry(0.016, 18, 12), iv, 0, -0.006, 0.02); muz.scale.set(1, 0.8, 1.1); head.add(muz);
  [-1, 1].forEach((s) => { const ear = mesh(new THREE.SphereGeometry(0.007, 10, 8), iv, s * 0.017, 0.02, -0.004); ear.scale.set(1, 1, 0.5); head.add(ear); head.add(mesh(new THREE.SphereGeometry(0.003, 8, 6), plain("leather"), s * 0.009, 0.006, 0.02)); });
  return Object.assign({ root, note: "Shown enlarged: the figure is 31 cm tall." }, still([cam("head", "The lion's head", { yaw: 0.3, pitch: 0.1, dist: 0.3, target: 0.28 }), cam("arm", "The notches on the arm", { yaw: -1.2, pitch: 0.05, dist: 0.25, target: 0.2 })]));
};
CAT.v35 = (E) => {                                          // the Cyrus Cylinder: a clay barrel 22.5 cm long, 45 lines of cuneiform around it, a missing piece
  const clay = surface("clay", 2048, 1024, (c, hg, W, H) => {
    write(c, hg, [W * 0.02, H * 0.08, W * 0.98, H * 0.92], "cuneiform", { size: 16, lh: 19, ink: "rgba(60,35,20,.8)" });
    c.fillStyle = "#6a4a30"; c.beginPath(); c.moveTo(W * 0.62, H * 0.3); for (let k = 0; k < 10; k++) c.lineTo(W * (0.62 + R() * 0.25), H * (0.3 + R() * 0.5)); c.closePath(); c.fill();   // the lost area
  }, { env: E.env, relief: 6 });
  const prof = []; for (let i = 0; i <= 16; i++) { const t = i / 16, x = -0.1125 + t * 0.225; prof.push([0.043 + 0.008 * Math.sin(t * Math.PI), x]); }
  const g = new THREE.LatheGeometry(V2(prof), 96); g.rotateZ(Math.PI / 2);
  const m = mesh(g, clay, 0, 0.05, 0); const root = new THREE.Group(); root.add(m);
  [-1, 1].forEach((s) => { const cap = mesh(new THREE.CircleGeometry(0.043, 40), plain("clay"), s * 0.1125, 0.05, 0); cap.rotation.y = s * Math.PI / 2; root.add(cap); });
  return Object.assign({ root }, flipper(root, "x"));
};
CAT.v55 = (E) => {                                          // oracle bones: a turtle plastron and an ox shoulder-blade, cracked in fire, carved with the questions
  const root = new THREE.Group();
  const bone = (kind, W0, H0) => surface("bone", 768, Math.round(768 * H0 / W0), (c, hg, W, H) => {
    for (let i = 0; i < 12; i++) { const x = W * (0.15 + R() * 0.7), y = H * (0.1 + R() * 0.8); c.strokeStyle = "rgba(40,25,10,.85)"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y - 20); c.lineTo(x, y + 20); c.moveTo(x, y - 4); c.lineTo(x + (R() < 0.5 ? 18 : -18), y - 14); c.stroke(); if (hg) { hg.strokeStyle = "#303030"; hg.lineWidth = 3; hg.beginPath(); hg.moveTo(x, y - 20); hg.lineTo(x, y + 20); hg.stroke(); }   // the 卜-shaped cracks
      write(c, hg, [x + 10, y - 30, x + 60, y + 40], "oracle", { size: 14, cols: true, ink: "rgba(60,35,15,.9)" }); }
    blotches(c, W, H, 10, "rgba(90,60,30,.25)", 40);
  }, { env: E.env, relief: 5 });
  // the plastron: an oval plate with scute seams
  const pl = new THREE.Shape(); for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, r = 1 + 0.08 * Math.cos(a * 4); pl[k ? "lineTo" : "moveTo"](Math.cos(a) * 0.1 * r, Math.sin(a) * 0.14 * r); }
  const pg = new THREE.ExtrudeGeometry(pl, { depth: 0.008, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.003 }); const pm = bone("plastron", 0.2, 0.28);
  planarUV(pg, [-0.11, -0.155, 0.11, 0.155]); const pa = mesh(pg, pm); pa.rotation.x = -Math.PI / 2; pa.position.set(-0.13, 0.008, 0); root.add(pa);
  // the scapula: a broad blade narrowing to the joint
  const sc = new THREE.Shape(); sc.moveTo(-0.02, 0); sc.lineTo(0.02, 0); sc.bezierCurveTo(0.09, 0.08, 0.12, 0.2, 0.09, 0.3); sc.lineTo(-0.06, 0.3); sc.bezierCurveTo(-0.07, 0.2, -0.05, 0.08, -0.02, 0);
  const sg = new THREE.ExtrudeGeometry(sc, { depth: 0.01, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003 }); planarUV(sg, [-0.08, 0, 0.13, 0.3]);
  const sa = mesh(sg, bone("scapula", 0.2, 0.3)); sa.rotation.x = -Math.PI / 2; sa.position.set(0.1, 0.01, 0.15); root.add(sa);
  return Object.assign({ root }, flipper(root, "z"));
};
CAT.v37 = (E) => {                                          // the Gundestrup Cauldron: gilded silver, outer plates of great heads, inner plates of scenes
  const plates = (inner) => surface("silver", 2048, 512, (c, hg, W, H) => {
    const n = inner ? 5 : 7, pw = W / n;
    for (let i = 0; i < n; i++) {
      const x0 = i * pw; c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(x0, 0, 4, H);
      if (!inner) { both(c, hg, (q) => { q.fillStyle = "#d8c080"; q.beginPath(); q.ellipse(x0 + pw / 2, H * 0.45, pw * 0.22, H * 0.3, 0, 0, TAU); q.fill(); q.fillStyle = "#6a6a66"; [0.42, 0.58].forEach((ex) => { q.beginPath(); q.ellipse(x0 + pw * ex, H * 0.4, pw * 0.035, 7, 0, 0, TAU); q.fill(); }); q.fillRect(x0 + pw * 0.485, H * 0.4, pw * 0.03, H * 0.12); q.beginPath(); q.moveTo(x0 + pw * 0.38, H * 0.58); q.quadraticCurveTo(x0 + pw * 0.5, H * 0.52, x0 + pw * 0.62, H * 0.58); q.lineTo(x0 + pw * 0.5, H * 0.56); q.fill(); for (let k = 0; k < 9; k++) q.fillRect(x0 + pw * (0.3 + k * 0.05), H * 0.14, 4, H * 0.1); q.strokeStyle = "#e0c070"; q.lineWidth = 8; q.beginPath(); q.arc(x0 + pw / 2, H * 0.72, pw * 0.16, 0.2, Math.PI - 0.2); q.stroke(); }, "#d8d8d8");   // a great head: hair, moustache, a torc at the neck
        [0.2, 0.8].forEach((fx) => both(c, hg, (q) => profile(q, x0 + pw * fx, H * 0.35, H * 0.45, { col: "#b8b8b0", cloth: "#b8b8b0", line: "#5a5a56", left: fx > 0.5 }), "#c0c0c0")); }
      else if (i === 0) {                                                                 // the antlered figure with a torc and a serpent, among beasts
        both(c, hg, (q) => { frontal(q, x0 + pw / 2, H * 0.3, H * 0.5, { body: "#c8c8c0", line: "#5a5a56" }); q.strokeStyle = "#5a5a56"; q.lineWidth = 6; [-1, 1].forEach((s) => { q.beginPath(); q.moveTo(x0 + pw / 2 + s * 20, H * 0.32); q.lineTo(x0 + pw / 2 + s * 60, H * 0.12); q.lineTo(x0 + pw / 2 + s * 80, H * 0.18); q.moveTo(x0 + pw / 2 + s * 45, H * 0.2); q.lineTo(x0 + pw / 2 + s * 60, H * 0.04); q.stroke(); }); q.beginPath(); q.arc(x0 + pw * 0.3, H * 0.55, 22, 0, TAU); q.stroke(); q.beginPath(); q.moveTo(x0 + pw * 0.72, H * 0.4); q.bezierCurveTo(x0 + pw * 0.8, H * 0.6, x0 + pw * 0.66, H * 0.7, x0 + pw * 0.8, H * 0.85); q.lineWidth = 10; q.stroke(); }, "#d0d0d0");
        beast(c, x0 + pw * 0.25, H * 0.85, pw * 0.25, { col: "#c0c0b8", line: "#5a5a56", horns: true }); }
      else if (i === 1) { for (let k = 0; k < 3; k++) both(c, hg, (q) => beast(q, x0 + pw * (0.25 + k * 0.25), H * 0.55, pw * 0.22, { col: "#c8c8c0", line: "#5a5a56", horns: true }), "#c8c8c8"); }   // bulls and their slayers
      else if (i === 2) { for (let k = 0; k < 6; k++) both(c, hg, (q) => profile(q, x0 + pw * (0.12 + k * 0.13), H * 0.5, H * 0.35, { col: "#c0c0b8", cloth: "#c0c0b8", line: "#5a5a56" }), "#c0c0c0"); both(c, hg, (q) => { q.fillStyle = "#c8c8c0"; q.fillRect(x0 + pw * 0.8, H * 0.35, pw * 0.14, H * 0.3); profile(q, x0 + pw * 0.88, H * 0.1, H * 0.7, { left: true, col: "#c8c8c0", cloth: "#c8c8c0", line: "#5a5a56" }); }, "#d0d0d0"); }   // the procession and the giant at the vat
      else { both(c, hg, (q) => { frontal(q, x0 + pw / 2, H * 0.2, H * 0.6, { body: "#c8c8c0", line: "#5a5a56" }); q.strokeStyle = "#5a5a56"; q.lineWidth = 6; q.beginPath(); q.arc(x0 + pw * 0.28, H * 0.5, 40, 0, TAU); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; q.moveTo(x0 + pw * 0.28, H * 0.5); q.lineTo(x0 + pw * 0.28 + Math.cos(a) * 40, H * 0.5 + Math.sin(a) * 40); } q.stroke(); }, "#d0d0d0"); }   // the god with the wheel
      // gilding on the figures
      for (let k = 0; k < 12; k++) { c.fillStyle = "rgba(220,180,80,.25)"; c.fillRect(x0 + R() * pw, R() * H, 8 + R() * 30, 8 + R() * 30); }
    }
  }, { env: E.env, relief: 6 });
  const root = new THREE.Group(), prof = [[0, 0], [0.12, 0.005], [0.22, 0.04], [0.3, 0.1], [0.34, 0.18], [0.345, 0.24]];
  const bowl = lathe(prof, plain("silver", E.env), 96); root.add(bowl);
  const ring = (r0, r1, y0, y1, mat, back) => { const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, 96, 1, true); const m = mesh(g, mat, 0, (y0 + y1) / 2, 0); if (back) m.material.side = THREE.BackSide; return m; };
  root.add(ring(0.345, 0.35, 0.22, 0.42, plates(false)));
  const inn = plates(true); inn.side = THREE.BackSide; root.add(ring(0.335, 0.34, 0.22, 0.415, inn, true));
  root.add(mesh(new THREE.TorusGeometry(0.348, 0.008, 8, 96).rotateX(Math.PI / 2), plain("silver", E.env), 0, 0.42, 0));
  return Object.assign({ root }, still([cam("inside", "Look inside", { pitch: 1.0, dist: 1.1, target: 0.25 }), cam("antlers", "The antlered figure", { yaw: Math.PI, pitch: 0.55, dist: 0.8, target: 0.3 })]));
};
CAT.v67 = (E) => {                                          // an incantation bowl: a spiral of spells round a drawing of a chained demon
  const inside = surface("clay", 1024, 1024, (c, hg, W) => {
    spiral(c, null, W / 2, W / 2, W * 0.47, W * 0.18, "aramaic", { size: 16, pitch: 1.4, ink: "rgba(30,15,5,.85)" });
    c.strokeStyle = "rgba(30,15,5,.9)"; c.lineWidth = 4; c.beginPath(); c.arc(W / 2, W / 2, W * 0.16, 0, TAU); c.stroke();
    frontal(c, W / 2, W * 0.36, W * 0.26, { body: "rgba(0,0,0,0)", line: "rgba(30,15,5,.9)" });
    c.beginPath(); for (let k = 0; k < 8; k++) { c.moveTo(W * 0.45, W * (0.47 + k * 0.012)); c.lineTo(W * 0.55, W * (0.47 + k * 0.012)); } c.stroke();   // the chains
  }, { relief: 2 });
  const prof = []; for (let i = 0; i <= 24; i++) { const t = i / 24, a = t * Math.PI / 2; prof.push([Math.sin(a) * 0.08 + 0.004, (1 - Math.cos(a)) * 0.065]); }
  const root = new THREE.Group(); root.add(lathe(prof, plain("clay"), 72));
  const inner = mesh(new THREE.CircleGeometry(0.081, 72), inside, 0, 0.012, 0); inner.rotation.x = -Math.PI / 2;
  // lay the writing on the inside of the bowl: bend the disc into the bowl's curve
  const P = inner.geometry.attributes.position; for (let i = 0; i < P.count; i++) { const r = Math.hypot(P.getX(i), P.getY(i)) / 0.081, a = r * Math.PI / 2; const k = Math.sin(a) * 0.078 / Math.max(1e-4, r * 0.081); P.setXYZ(i, P.getX(i) * k, P.getY(i) * k, 0.063 - Math.cos(a) * 0.058 - 0.004); } inner.geometry.computeVertexNormals(); inner.position.y = 0; root.add(inner);
  return Object.assign({ root, note: "Shown enlarged: such bowls are about 16 cm across." }, still([cam("look", "Look inside", { pitch: 1.2, dist: 0.5, target: 0.02 })]));
};
CAT.v14 = (E) => {                                          // the Holy Grail, as the Santo Cáliz of Valencia: an agate cup on a gold stem with handles and pearls, an agate foot
  const root = new THREE.Group(), gold = plain("gold", E.env), ag = surface("agate", 512, 512, null, { env: E.env, relief: 1 });
  ag.envMapIntensity = 1.2;
  const cup = lathe([[0, 0.14], [0.03, 0.141], [0.06, 0.15], [0.074, 0.168], [0.078, 0.19], [0.074, 0.19], [0.07, 0.17], [0.056, 0.155], [0, 0.148]], ag, 64); root.add(cup);
  root.add(lathe([[0.02, 0.07], [0.028, 0.075], [0.024, 0.1], [0.03, 0.115], [0.022, 0.13], [0.032, 0.142], [0.0, 0.142], [0, 0.07]], gold, 48));
  root.add(mesh(new THREE.TorusGeometry(0.03, 0.004, 8, 40).rotateX(Math.PI / 2), gold, 0, 0.115, 0));
  const foot = lathe([[0, 0], [0.07, 0.0], [0.075, 0.01], [0.06, 0.04], [0.03, 0.065], [0.0, 0.07]], ag, 64); foot.scale.set(1, 1, 0.72); root.add(foot);
  root.add(mesh(new THREE.TorusGeometry(0.072, 0.004, 8, 60).rotateX(Math.PI / 2), gold, 0, 0.004, 0));
  [-1, 1].forEach((s) => { root.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(s * 0.025, 0.125, 0), new THREE.Vector3(s * 0.07, 0.12, 0), new THREE.Vector3(s * 0.06, 0.085, 0), new THREE.Vector3(s * 0.025, 0.085, 0)]), 16, 0.004, 8), gold)); });
  for (let k = 0; k < 28; k++) { const a = k / 28 * TAU; root.add(mesh(new THREE.SphereGeometry(0.0045, 10, 8), new THREE.MeshStandardMaterial({ color: k % 7 === 0 ? "#2a8a5a" : "#f4f0e8", roughness: 0.2, envMap: E.env }), Math.cos(a) * 0.066, 0.02, Math.sin(a) * 0.066 * 0.72)); }   // pearls and emeralds on the foot
  return Object.assign({ root }, still([cam("cup", "The agate cup", { pitch: 0.4, dist: 0.5, target: 0.16 })]));
};
CAT.v05 = (E) => {                                          // the Holy Lance in Vienna: an iron blade with a nail set in it, bound with wire, a gold sleeve over a silver one
  const root = new THREE.Group(), iron = surface("iron", 512, 1024, null, { env: E.env, relief: 4 });
  const bl = new THREE.Shape(); bl.moveTo(0, 0); bl.lineTo(0.028, 0.02); bl.lineTo(0.03, 0.2); bl.bezierCurveTo(0.03, 0.34, 0.012, 0.46, 0, 0.51); bl.bezierCurveTo(-0.012, 0.46, -0.03, 0.34, -0.03, 0.2); bl.lineTo(-0.028, 0.02); bl.closePath();
  const hole = new THREE.Path(); hole.moveTo(-0.005, 0.12); hole.lineTo(0.005, 0.12); hole.lineTo(0.005, 0.3); hole.lineTo(-0.005, 0.3); hole.closePath(); bl.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(bl, { depth: 0.006, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004 }); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 8 + 0.5, uv.getY(i) * 2);
  root.add(mesh(g, iron));
  root.add(mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.19, 8), iron, 0, 0.21, 0.003));   // the nail
  const gold = surface("gold", 512, 256, (c, hg, W, H) => write(c, hg, [W * 0.05, H * 0.35, W * 0.95, H * 0.65], "latin", { size: 26, ink: "rgba(90,60,20,.9)" }), { env: E.env, relief: 6 });
  root.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 40, 1, true), gold, 0, 0.1, 0.003));
  root.add(mesh(new THREE.CylinderGeometry(0.029, 0.029, 0.11, 40, 1, true), plain("silver", E.env), 0, 0.1, 0.003));
  for (let k = 0; k < 18; k++) root.add(mesh(new THREE.TorusGeometry(0.018, 0.0015, 6, 20).rotateX(Math.PI / 2), plain("brass", E.env), 0, 0.17 + k * 0.004, 0.003));   // the binding wire
  root.add(mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.08, 20), iron, 0, -0.03, 0.003));    // the socket
  root.rotation.z = Math.PI / 2; root.position.set(0, 0.05, 0);
  const holder = new THREE.Group(); holder.add(root);
  return Object.assign({ root: holder }, flipper(holder, "x", [cam("sleeve", "The gold sleeve", { yaw: 0, pitch: 0.2, dist: 0.3 })]));
};
CAT.v06 = (E) => {                                          // the Crown of Thorns: a ring of bundled rushes bound with gold thread, in a crystal ring
  const root = new THREE.Group(), rush = surface("palm", 512, 128, (c, hg, W, H) => { for (let y = 0; y < H; y += 3) { c.fillStyle = `rgba(${90 + R() * 40},${70 + R() * 30},${40 + R() * 20},.6)`; c.fillRect(0, y, W, 2); } }, { relief: 4 });
  for (let k = 0; k < 9; k++) { const a0 = R() * TAU, t = new THREE.TorusGeometry(0.105 + (R() - 0.5) * 0.008, 0.005, 6, 80); t.rotateX(Math.PI / 2); t.rotateY(a0); t.translate((R() - 0.5) * 0.004, (R() - 0.5) * 0.01, (R() - 0.5) * 0.004); root.add(mesh(t, rush)); }
  for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; const b = mesh(new THREE.TorusGeometry(0.018, 0.0012, 5, 16), plain("gold", E.env), Math.cos(a) * 0.105, 0, Math.sin(a) * 0.105); b.rotation.y = -a; root.add(b); }   // gold thread binding the bundle
  const cr = new THREE.MeshPhysicalMaterial({ color: "#f4fbff", roughness: 0.02, transmission: 0, transparent: true, opacity: 0.18, envMap: E.env, envMapIntensity: 1.8, clearcoat: 1, depthWrite: false });
  root.add(mesh(new THREE.TorusGeometry(0.105, 0.034, 20, 96).rotateX(Math.PI / 2), cr));
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; const m = mesh(new THREE.TorusGeometry(0.036, 0.004, 8, 24), plain("gold", E.env), Math.cos(a) * 0.105, 0, Math.sin(a) * 0.105); m.rotation.y = -a; root.add(m); }
  root.position.y = 0.05; const holder = new THREE.Group(); holder.add(root);
  return Object.assign({ root: holder }, still([cam("rush", "The bundled rushes", { pitch: 0.7, dist: 0.35, target: 0.05 })]));
};
CAT.v26 = (E) => {                                          // the Black Stone: dark fragments set in a silver frame
  const root = new THREE.Group(), silver = surface("silver", 512, 512, (c, hg, W, H) => { for (let y = 0; y < H; y += 24) both(c, hg, (q) => { q.strokeStyle = "#e0e0dc"; q.lineWidth = 4; q.beginPath(); for (let x = 0; x < W; x += 8) q.lineTo(x, y + Math.sin(x * 0.05) * 6); q.stroke(); }, "#c0c0c0"); }, { env: E.env, relief: 5 });
  const frame = lathe([[0.0, -0.001], [0.16, 0.0], [0.19, 0.03], [0.2, 0.08], [0.19, 0.13], [0.15, 0.16], [0.14, 0.17], [0.12, 0.15], [0.13, 0.08], [0.12, 0.02], [0.0, 0.02]], silver, 72);
  frame.rotation.x = Math.PI / 2; frame.scale.set(1, 1, 1.25); root.add(frame);
  const st = plain("stoneblack", E.env);
  for (let k = 0; k < 8; k++) { const f = mesh(new THREE.DodecahedronGeometry(0.025 + R() * 0.02, 1), st, (R() - 0.5) * 0.14, (R() - 0.5) * 0.18, 0.03 + R() * 0.01); f.scale.z = 0.5; root.add(f); }
  root.position.y = 0.25; const holder = new THREE.Group(); holder.add(root);
  return Object.assign({ root: holder }, still());
};
CAT.v27 = (E) => {                                          // the Sacred Tooth Relic's golden casket: a stupa of gold set with gems, caskets within caskets
  const root = new THREE.Group(), gold = surface("gold", 1024, 1024, (c, hg, W, H) => { for (let y = 40; y < H; y += 90) for (let x = 30; x < W; x += 70) both(c, hg, (q) => { q.fillStyle = "#f0d070"; q.beginPath(); q.arc(x + (y / 90 % 2) * 35, y, 16, 0, TAU); q.fill(); }, "#c8c8c8"); }, { env: E.env, relief: 5 });
  const stupa = (s) => { const g = new THREE.Group(); g.add(lathe([[0, 0], [0.16, 0], [0.16, 0.03], [0.13, 0.04], [0.14, 0.12], [0.12, 0.2], [0.06, 0.26], [0.05, 0.3], [0.035, 0.34], [0.025, 0.42], [0.012, 0.48], [0, 0.5]].map(([r, y]) => [r * s, y * s]), gold, 72));
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.add(mesh(new THREE.SphereGeometry(0.009 * s, 10, 8), new THREE.MeshStandardMaterial({ color: ["#b01830", "#1a5ab0", "#1a8a4a"][k % 3], roughness: 0.15, envMap: E.env }), Math.cos(a) * 0.137 * s, 0.12 * s, Math.sin(a) * 0.137 * s)); }
    return g; };
  const outer = stupa(1); root.add(outer); const inner = stupa(0.62); inner.visible = false; root.add(inner);
  let u = 0, want = 0;
  return { root, actions: [{ id: "open", label: "Lift the outer casket", alt: "Close it" }],
    act(id) { if (id !== "open") return null; want = want ? 0 : 1; inner.visible = true; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.5)); if (Math.abs(u - want) < 0.002) u = want; outer.position.y = u * 0.45; outer.position.x = u * 0.25; inner.visible = u > 0.02; return true; } return false; } };
};
CAT.v07 = (E) => {                                          // the Ark of the Covenant, after Exodus 25: an acacia chest overlaid with gold, poles in rings, the mercy seat with two cherubim
  const cubit = 0.45, L = 2.5 * cubit, Wd = 1.5 * cubit, H = 1.5 * cubit, root = new THREE.Group(), gold = plain("gold", E.env);
  const body = surface("gold", 1024, 512, (c, hg, W, Hh) => { both(c, hg, (q) => { q.fillStyle = "#f0cc70"; q.fillRect(0, 10, W, 14); q.fillRect(0, Hh - 24, W, 14); for (let x = 60; x < W; x += 120) q.fillRect(x, 24, 6, Hh - 48); }, "#c0c0c0"); }, { env: E.env, relief: 4 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(L, H, Wd), [body, body, gold, gold, body, body]); box.position.y = H / 2 + 0.05; root.add(box);
  root.add(mesh(new THREE.BoxGeometry(L + 0.04, 0.03, Wd + 0.04), gold, 0, H + 0.035, 0));   // the crown moulding
  const lid = new THREE.Group(); lid.position.y = H + 0.05; root.add(lid);
  lid.add(mesh(new THREE.BoxGeometry(L, 0.03, Wd), gold, 0, 0.015, 0));
  [-1, 1].forEach((s) => {                                                        // cherubim facing each other, wings spread over the cover
    const ch = new THREE.Group(); ch.position.set(s * L * 0.34, 0.03, 0); ch.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; lid.add(ch);
    ch.add(mesh(new THREE.CapsuleGeometry(0.06, 0.14, 6, 16), gold, 0, 0.12, 0)); ch.add(mesh(new THREE.SphereGeometry(0.055, 20, 14), gold, 0, 0.3, 0.03));
    [-1, 1].forEach((w) => { const wg = new THREE.Shape(); wg.moveTo(0, 0); wg.bezierCurveTo(0.1, 0.12, 0.3, 0.24, 0.42, 0.22); wg.lineTo(0.38, 0.14); wg.lineTo(0.3, 0.12); wg.lineTo(0.22, 0.05); wg.lineTo(0.14, 0.02); wg.closePath(); const wm = mesh(new THREE.ExtrudeGeometry(wg, { depth: 0.01, bevelEnabled: false }), gold, w * 0.04, 0.2, -0.04); wm.rotation.y = w > 0 ? -Math.PI / 2 + 0.4 : Math.PI / 2 - 0.4; wm.rotation.z = 0.15; ch.add(wm); });
  });
  // rings and poles
  [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => root.add(mesh(new THREE.TorusGeometry(0.035, 0.008, 8, 20), gold, sx * L * 0.35, 0.18, sz * (Wd / 2 + 0.01)))));
  [-1, 1].forEach((sz) => { const p = mesh(new THREE.CylinderGeometry(0.02, 0.02, L * 1.9, 16), gold, 0, 0.18, sz * (Wd / 2 + 0.035)); p.rotation.z = Math.PI / 2; root.add(p); });
  // inside, the two stone tablets of the covenant
  const tab = plain("sandstone"); [-1, 1].forEach((s) => { const t = mesh(new THREE.BoxGeometry(0.2, 0.3, 0.04), tab, s * 0.13, 0.22, 0); root.add(t); });
  let u = 0, want = 0;
  return { root, note: "After the description in Exodus 25. No such object has been found.",
    actions: [{ id: "lid", label: "Lift the mercy seat", alt: "Lower it" }],
    act(id) { if (id !== "lid") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2)); if (Math.abs(u - want) < 0.002) u = want; lid.position.y = H + 0.05 + u * 0.5; lid.rotation.x = -u * 0.25; return true; } return false; } };
};
CAT.v75 = (E) => {                                          // the Golden Plates, after the witnesses' descriptions: thin plates held by three rings, part of the stack sealed
  const root = new THREE.Group(), n = 26, W = 0.15, D = 0.2, t = 0.003;
  const face = surface("gold", 512, 682, (c, hg, Wc, Hc) => write(c, hg, [Wc * 0.08, Hc * 0.08, Wc * 0.92, Hc * 0.92], "voynich", { size: 14, lh: 20, ink: "rgba(90,60,20,.9)" }), { env: E.env, relief: 5 });
  const edge = plain("gold", E.env), plates = [];
  for (let i = 0; i < n; i++) { const p = new THREE.Group(); p.position.set(-W / 2, i * t * 1.4, 0); root.add(p); const m = new THREE.Mesh(new THREE.BoxGeometry(W, t, D), [edge, edge, face, edge, edge, edge]); m.position.x = W / 2; m.castShadow = true; p.add(m); plates.push(p); }
  for (let k = 0; k < 3; k++) { const r = mesh(new THREE.TorusGeometry(0.022, 0.003, 8, 24, Math.PI * 1.3), edge, -W / 2, n * t * 0.7, -D / 2 + 0.03 + k * (D - 0.06) / 2); r.rotation.y = Math.PI / 2; r.rotation.z = -Math.PI * 0.65; root.add(r); }
  const band = mesh(new THREE.BoxGeometry(W * 0.98, 0.004, 0.03), plain("leather"), 0, n * t * 1.4 * 0.35, 0); root.add(band);   // the sealed part
  let u = 0, want = 0;
  return { root, note: "After the descriptions given by Joseph Smith and the witnesses. The plates themselves have not been seen by anyone else; their existence is a matter of faith and debate.",
    actions: [{ id: "leaf", label: "Lift the top plates", alt: "Lower them" }],
    act(id) { if (id !== "leaf") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.5)); if (Math.abs(u - want) < 0.002) u = want; for (let i = n - 8; i < n; i++) plates[i].rotation.z = u * (2.4 + (i - n) * 0.05); return true; } return false; } };
};
CAT.v46 = (E) => {                                          // the Piprahwa relics: an inscribed soapstone urn, a crystal bowl with a fish-shaped handle, and gems
  const root = new THREE.Group(), soap = surface("soapstone", 1024, 512, (c, hg, W, H) => write(c, hg, [W * 0.05, H * 0.08, W * 0.95, H * 0.2], "stamp", { size: 22, ink: "rgba(40,40,30,.85)" }), { env: E.env, relief: 5 });
  const urn = lathe([[0, 0], [0.05, 0], [0.07, 0.02], [0.085, 0.07], [0.08, 0.12], [0.06, 0.15], [0.055, 0.155], [0, 0.155]], soap, 64); urn.position.x = -0.12; root.add(urn);
  root.add(mesh(new THREE.SphereGeometry(0.058, 32, 12, 0, TAU, 0, Math.PI / 2).scale(1, 0.4, 1), plain("soapstone", E.env), -0.12, 0.155, 0));
  root.add(mesh(new THREE.SphereGeometry(0.012, 12, 10), plain("soapstone", E.env), -0.12, 0.18, 0));
  const cryst = new THREE.MeshPhysicalMaterial({ color: "#f4f8ff", roughness: 0.05, transparent: true, opacity: 0.35, envMap: E.env, envMapIntensity: 2, clearcoat: 1 });
  const bowl = lathe([[0, 0], [0.045, 0.0], [0.06, 0.03], [0.058, 0.045], [0.05, 0.045], [0.052, 0.03], [0.04, 0.008], [0, 0.008]], cryst, 48); bowl.position.x = 0.1; root.add(bowl);
  const fish = mesh(new THREE.SphereGeometry(0.02, 16, 10), cryst, 0.1, 0.062, 0); fish.scale.set(1.6, 0.6, 0.6); root.add(fish);
  root.add(mesh(new THREE.ConeGeometry(0.012, 0.02, 8).rotateZ(Math.PI / 2), cryst, 0.07, 0.062, 0));
  for (let i = 0; i < 60; i++) root.add(mesh(new THREE.SphereGeometry(0.003 + R() * 0.004, 8, 6), new THREE.MeshStandardMaterial({ color: ["#f4f0e8", "#c8203a", "#e0b040", "#3a7ab0", "#f0e0a0"][i % 5], roughness: 0.2, metalness: i % 5 === 2 ? 1 : 0, envMap: E.env }), (R() - 0.5) * 0.28, 0.004, 0.08 + R() * 0.06));
  return Object.assign({ root }, still([cam("urn", "The inscription on the urn", { yaw: 0, pitch: 0.2, dist: 0.35, target: 0.15 })]));
};
CAT.v16 = (E) => {                                          // the James Ossuary: a limestone box with a lid, rosettes on one side, one line of Aramaic on the other
  const L = 0.5, Wd = 0.25, H = 0.3, root = new THREE.Group(), lime = plain("limestone", E.env);
  const ros = surface("limestone", 1024, 612, (c, hg, W, Hh) => { both(c, hg, (q) => { q.strokeStyle = "rgba(90,70,50,.8)"; q.lineWidth = 4; q.strokeRect(W * 0.05, Hh * 0.1, W * 0.9, Hh * 0.8); [0.3, 0.7].forEach((fx) => { q.beginPath(); q.arc(W * fx, Hh / 2, Hh * 0.3, 0, TAU); q.stroke(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; q.beginPath(); q.arc(W * fx + Math.cos(a) * Hh * 0.15, Hh / 2 + Math.sin(a) * Hh * 0.15, Hh * 0.15, a + 2.1, a + 4.2); q.stroke(); } }); }, "#404040"); }, { env: E.env, relief: 5 });
  const ins = surface("limestone", 1024, 612, (c, hg, W, Hh) => write(c, hg, [W * 0.3, Hh * 0.3, W * 0.8, Hh * 0.42], "aramaic", { size: 30, ink: "rgba(70,55,40,.85)", space: 0.25 }), { env: E.env, relief: 6 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(L, H, Wd), [lime, lime, lime, lime, ros, ins]); box.position.y = H / 2; root.add(box);
  const lid = mesh(new THREE.BoxGeometry(L + 0.01, 0.03, Wd + 0.01), lime, 0, H + 0.015, 0); root.add(lid);
  let u = 0, want = 0; const f = flipper(root);
  return { root, actions: f.actions.concat([{ id: "lid", label: "Lift the lid", alt: "Put it back" }]),
    act(id) { if (id === "lid") { want = want ? 0 : 1; return want; } return f.act(id); },
    update(dt) { let m = f.update(dt); if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.5)); if (Math.abs(u - want) < 0.002) u = want; lid.position.y = H + 0.015 + u * 0.18; lid.position.x = u * 0.2; m = true; } return m; } };
};
CAT.v62 = (E) => {                                          // an Inca khipu: a main cord with pendant cords of different colours, knotted in clusters by place value
  const root = new THREE.Group(), cols = ["#c8b088", "#6a4a2c", "#e8dcc4", "#8a3a2a", "#3a2a1c", "#a08050"];
  const cordMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1 });
  const mats = cols.map(cordMat);
  const main = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.45, 0.6, 0), new THREE.Vector3(0, 0.62, 0.02), new THREE.Vector3(0.45, 0.6, 0)]), 40, 0.008, 8), mats[4]); root.add(main);
  const pend = [];
  for (let i = 0; i < 36; i++) {
    const p = new THREE.Group(), x = -0.42 + i * 0.024; p.position.set(x, 0.6, 0); root.add(p);
    const len = 0.35 + R() * 0.2, m = mats[(i * 7 + (i / 6 | 0)) % mats.length];
    const pts = []; for (let k = 0; k <= 8; k++) pts.push(new THREE.Vector3(Math.sin(k * 0.8 + i) * 0.004, -k / 8 * len, Math.cos(k * 0.6 + i) * 0.004));
    p.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.0035, 6), m));
    // knots at the hundreds, tens and units places: long knots low, single knots higher
    [0.12, 0.22, 0.32].forEach((d, place) => { const n = (R() * 7) | 0; for (let k = 0; k < n && d < len; k++) { const kn = new THREE.Mesh(new THREE.SphereGeometry(place === 2 ? 0.006 : 0.005, 8, 6), m); kn.position.y = -d - k * 0.009; if (place === 2) kn.scale.y = 1.8; p.add(kn); } });
    if (R() < 0.3) { const sub = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.05, 0), new THREE.Vector3(0.01, -0.15, 0.01), new THREE.Vector3(0.012, -0.25, 0)]), 8, 0.0025, 5), mats[(i + 3) % mats.length]); p.add(sub); }
    pend.push(p);
  }
  let u = 0, want = 0;
  return { root, actions: [{ id: "fan", label: "Spread the cords", alt: "Let them hang" }],
    act(id) { if (id !== "fan") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.6)); if (Math.abs(u - want) < 0.002) u = want; pend.forEach((p, i) => { p.rotation.x = u * (0.9 + (i % 5) * 0.1); p.rotation.z = u * (i - 18) * 0.02; }); return true; } return false; } };
};
CAT.v64 = (E) => {                                          // a Benin plaque: cast brass in high relief, figures of the court on a ground of river-leaf pattern
  const root = new THREE.Group(), W = 0.36, H = 0.46;
  const face = surface("brass", 768, 982, (c, hg, Wc, Hc) => {
    for (let y = 0; y < Hc; y += 40) for (let x = 0; x < Wc; x += 40) both(c, hg, (q) => { q.fillStyle = "#b08840"; q.beginPath(); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; q.ellipse(x + 20 + Math.cos(a) * 8, y + 20 + Math.sin(a) * 8, 7, 4, a, 0, TAU); } q.fill(); }, "#909090");   // the quatrefoil ground
    [[0.5, 0.12, 0.75], [0.2, 0.3, 0.5], [0.8, 0.3, 0.5]].forEach(([fx, fy, fh]) => both(c, hg, (q) => { frontal(q, Wc * fx, Hc * fy, Hc * fh, { body: "#c09848", head: "#b08840", line: "#4a3818" }); q.fillStyle = "#c09848"; q.fillRect(Wc * fx - 18, Hc * fy + Hc * fh * 0.02, 36, 24); for (let k = 0; k < 5; k++) q.fillRect(Wc * fx - 26, Hc * fy + Hc * fh * (0.3 + k * 0.03), 52, 6); }, "#e0e0e0"));   // the Oba and attendants, collars of coral beads
    c.fillStyle = "#1a1408"; [[0.05, 0.03], [0.95, 0.03], [0.05, 0.97], [0.95, 0.97]].forEach(([fx, fy]) => { c.beginPath(); c.arc(Wc * fx, Hc * fy, 8, 0, TAU); c.fill(); });
    for (let i = 0; i < 20; i++) { c.fillStyle = "rgba(40,80,60,.25)"; c.beginPath(); c.arc(R() * Wc, R() * Hc, 10 + R() * 30, 0, TAU); c.fill(); }   // patina
  }, { env: E.env, relief: 9 });
  const g = slab({ pts: outline(W, H, { jag: 0 }), d: 0.02, stone: "brass", env: E.env, paint: () => {} });
  g.children[1].material = face; g.children[0].material = plain("brass", E.env); root.add(g);
  return Object.assign({ root }, flipper(root));
};
CAT.v15 = (E) => {                                          // a fragment of the True Cross in a Byzantine staurotheke: a gold box with a sliding lid, a double-armed cross of wood inside
  const root = new THREE.Group(), W = 0.35, H = 0.48, T = 0.035, gold = plain("gold", E.env);
  const inside = surface("gold", 512, 702, (c, hg, Wc, Hc) => { for (let i = 0; i < 10; i++) for (let j = 0; j < 14; j++) both(c, hg, (q) => { q.fillStyle = (i + j) % 2 ? "#e0b850" : "#c89a38"; q.fillRect(i * Wc / 10 + 4, j * Hc / 14 + 4, Wc / 10 - 8, Hc / 14 - 8); }, (i + j) % 2 ? "#a0a0a0" : "#808080"); }, { env: E.env, relief: 4 });
  const lidTex = surface("gold", 512, 702, (c, hg, Wc, Hc) => {
    both(c, hg, (q) => { q.strokeStyle = "#f0d070"; q.lineWidth = 16; q.strokeRect(20, 20, Wc - 40, Hc - 40); }, "#c0c0c0");
    for (let i = 0; i < 9; i++) { const x = Wc * (0.2 + (i % 3) * 0.3), y = Hc * (0.2 + ((i / 3) | 0) * 0.3); c.fillStyle = ["#1a4a9a", "#b01830", "#1a7a4a"][i % 3]; c.fillRect(x - 40, y - 50, 80, 100); frontal(c, x, y - 40, 90, { body: "#e0d0b0", line: "#4a3818" }); }   // enamel figures
    for (let k = 0; k < 40; k++) { const a = k / 40; c.fillStyle = k % 2 ? "#f4f0e8" : "#1a5ab0"; c.beginPath(); c.arc(20 + (Wc - 40) * a, 20, 7, 0, TAU); c.fill(); }
  }, { env: E.env, relief: 5 });
  root.add(mesh(new THREE.BoxGeometry(W, T, H), gold, 0, T / 2, 0));
  const floor = mesh(new THREE.PlaneGeometry(W - 0.03, H - 0.03), inside, 0, T + 0.001, 0); floor.rotation.x = -Math.PI / 2; root.add(floor);
  const wood = plain("wood"); const cr = new THREE.Group(); cr.position.y = T + 0.008; root.add(cr);
  cr.add(mesh(new THREE.BoxGeometry(0.03, 0.014, 0.34), wood)); cr.add(mesh(new THREE.BoxGeometry(0.2, 0.014, 0.03), wood, 0, 0, -0.05)); cr.add(mesh(new THREE.BoxGeometry(0.14, 0.014, 0.028), wood, 0, 0, -0.11));
  const lid = new THREE.Group(); root.add(lid); const lm = new THREE.Mesh(new THREE.BoxGeometry(W, 0.012, H), [gold, gold, lidTex, gold, gold, gold]); lm.position.y = T + 0.016; lid.add(lm);
  lidTex.map.rotation = 0;
  let u = 0, want = 0;
  return { root, actions: [{ id: "lid", label: "Slide the lid open", alt: "Close it" }],
    act(id) { if (id !== "lid") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.2)); if (Math.abs(u - want) < 0.002) u = want; lid.position.z = u * H * 0.95; return true; } return false; } };
};

// ---- pages: a painter for a manuscript or printed page
// o: { style, cols, size, lh, ink, initial (colour), border, rubric (colour for every nth line), pic(g, hg, W, H, k) on pages where pics(k) }
function page(o) {
  return (g, hg, W, H, k) => {
    const m = o.margin || 0.1, x0 = W * m, x1 = W * (1 - m), y0 = H * m, y1 = H * (1 - m * 1.1);
    if (o.burn) { g.fillStyle = "rgba(40,20,5,.8)"; g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= W; x += 20) g.lineTo(x, 8 + R() * 30); g.lineTo(W, 0); g.fill(); blotches(g, W, H, 4, "rgba(60,30,10,.35)", W / 5); }
    if (o.border) { g.strokeStyle = o.border; g.lineWidth = 3; g.strokeRect(x0 - 10, y0 - 10, x1 - x0 + 20, y1 - y0 + 20); }
    if (o.pic && (!o.pics || o.pics(k))) { o.pic(g, hg, W, H, k); if (o.picOnly) return; }
    const cols = o.cols || 1, cw = (x1 - x0) / cols, top = o.pic && (!o.pics || o.pics(k)) ? (o.picTop || y0) : y0;
    for (let c = 0; c < cols; c++) {
      write(g, null, [x0 + c * cw + (c ? cw * 0.06 : 0), top, x0 + (c + 1) * cw - cw * 0.06, y1], o.style, { size: o.size || 12, lh: o.lh || (o.size || 12) * 1.6, ink: o.ink || "rgba(40,25,12,.85)", cols: o.vertical });
      if (o.rubric) for (let y = top; y < y1; y += (o.lh || 20) * 6) { g.fillStyle = o.rubric; g.fillRect(x0 + c * cw, y, cw * 0.3, (o.size || 12) * 0.5); }
    }
    if (o.initial && k % 2 === 0) { g.fillStyle = o.initial; g.fillRect(x0, top, (o.size || 12) * 3, (o.size || 12) * 3.4); g.fillStyle = "#e0b040"; g.fillRect(x0 + 5, top + 5, (o.size || 12) * 3 - 10, (o.size || 12) * 3.4 - 10); g.fillStyle = o.initial; g.fillRect(x0 + 12, top + 12, (o.size || 12) * 3 - 24, (o.size || 12) * 3.4 - 24); }
    if (o.gloss) { g.globalAlpha = 0.9; write(g, null, [x0, top + (o.size || 12) * 0.9, x1, y1], "latin", { size: (o.size || 12) * 0.45, lh: o.lh || (o.size || 12) * 1.6, ink: o.gloss }); g.globalAlpha = 1; }
    if (o.marg) write(g, null, [W * 0.02, y0, x0 - 6, y1], o.style, { size: (o.size || 12) * 0.4, lh: (o.size || 12) * 0.7, ink: o.marg, space: 0.5 });
  };
}
// covers: metal corners and bosses, straps, clasps, a panel
function studs(parent, W, D, ct, mat, o) {
  const y = ct + 0.004;
  if (o.corners) [[0.03, -D / 2 + 0.03], [W - 0.03, -D / 2 + 0.03], [0.03, D / 2 - 0.03], [W - 0.03, D / 2 - 0.03]].forEach(([x, z]) => { const c = mesh(new THREE.CylinderGeometry(o.corners, o.corners * 1.1, 0.008, 4), mat, x, y, z); c.rotation.y = Math.PI / 4; parent.add(c); });
  if (o.bosses) [[W / 2, 0], [W * 0.25, -D * 0.3], [W * 0.75, -D * 0.3], [W * 0.25, D * 0.3], [W * 0.75, D * 0.3]].slice(0, o.bosses).forEach(([x, z]) => parent.add(mesh(new THREE.SphereGeometry(0.012 * (o.scale || 1), 12, 8), mat, x, y, z)));
  if (o.panel) { const p = mesh(new THREE.PlaneGeometry(W * 0.8, D * 0.85), o.panel, W / 2, y - 0.002, 0); p.rotation.x = -Math.PI / 2; parent.add(p); }
  if (o.strap) parent.add(mesh(new THREE.BoxGeometry(0.08, 0.004, 0.025), o.strap, W + 0.03, ct / 2, 0));
}
function bookEntry(E, o) {
  const b = book(o); return Object.assign({ root: b.root, note: o.note || null }, b);
}
// loose leaves lying in a mount: turn them over
function leaves(E, o) {
  const root = new THREE.Group();
  (o.list || [[0, 0]]).forEach(([x, z], i) => { const g = slab({ pts: o.pts ? o.pts() : outline(o.w, o.h, { jag: o.jag || 0.003 }), d: 0.002, bevel: 0, stone: o.ground, env: E.env, relief: 1.5, paint: (c, hg, W, H) => o.paint(c, hg, W, H, i), paintBack: o.back ? (c, hg, W, H) => o.back(c, hg, W, H, i) : null }); g.rotation.x = -Math.PI / 2 + 0.25; g.position.set(x, 0.05, z); root.add(g); });
  return Object.assign({ root, note: o.note || null }, flipper(root));
}
// a pothi: long unbound leaves between two boards, tied with a cord
function pothi(E, o) {
  const root = new THREE.Group(), W = o.w, D = o.h, n = 18, lt = 0.0012, boards = plain(o.board || "wood");
  root.add(mesh(new THREE.BoxGeometry(W + 0.01, 0.012, D + 0.01), boards, 0, 0.006, 0));
  const lm = [0, 1, 2, 3].map((k) => surface(o.ground || "paper", 1024, Math.round(1024 * D / W), (g, hg, Wc, Hc) => o.paint(g, hg, Wc, Hc, k), { relief: 1.2 }));
  const edge = plain(o.ground || "paper"), stack = [];
  for (let i = 0; i < n; i++) { const p = new THREE.Group(); p.position.set(-W / 2, 0.012 + i * lt, 0); root.add(p); const m = new THREE.Mesh(new THREE.BoxGeometry(W, lt, D), [edge, edge, lm[i % lm.length], edge, edge, edge]); m.position.x = W / 2; m.castShadow = m.receiveShadow = true; p.add(m); stack.push(p); }
  const top = mesh(new THREE.BoxGeometry(W + 0.01, 0.012, D + 0.01), boards, 0, 0.012 + n * lt + 0.006, 0); top.visible = false; root.add(top);
  if (o.cloth) { const cl = mesh(new THREE.BoxGeometry(W * 0.5, 0.01, D + 0.08), plain(o.cloth), W * 0.55, 0.002, 0); root.add(cl); }
  let turned = 0, t = -1;
  return { root, note: o.note || null, actions: [{ id: "leaf", label: "Turn a leaf" }],
    act(id) { if (id === "leaf" && t < 0 && turned < n - 1) { t = 0; } return null; },
    update(dt) { if (t < 0) return false; t = Math.min(1, t + dt * 1.3); const p = stack[n - 1 - turned]; p.rotation.z = t * Math.PI * 0.985; p.position.y = 0.012 + (n - 1 - turned) * lt + Math.sin(t * Math.PI) * 0.03; if (t >= 1) { p.position.y = 0.012 + (n + turned) * lt * 0.2; turned++; t = -1; } return true; } };
}
// cloth: a framed or flat textile with an image; o.fold: can be folded and unfolded
function cloth(E, o) {
  const root = new THREE.Group(), W = o.w, H = o.h;
  const m = surface(o.ground || "linen", o.px || 1024, Math.round((o.px || 1024) * H / W), o.paint, { relief: 1.5, side: THREE.DoubleSide, transparent: o.sheer });
  const seg = o.fold ? 48 : 1, sheet = mesh(new THREE.PlaneGeometry(W, H, seg, 1), m); root.add(sheet);
  if (o.frame) {
    const fm = o.frameMat || plain("gold", E.env), f = o.frame, L = [];
    [[0, H / 2 + f / 2, W + f * 2, f], [0, -H / 2 - f / 2, W + f * 2, f], [-W / 2 - f / 2, 0, f, H], [W / 2 + f / 2, 0, f, H]].forEach(([x, y, w, h]) => root.add(mesh(new THREE.BoxGeometry(w, h, f * 0.6), fm, x, y, -0.004)));
    root.add(mesh(new THREE.BoxGeometry(W + f * 2, H + f * 2, 0.01), o.backMat || plain("wood"), 0, 0, -f * 0.3 - 0.006));
    if (o.frameDeco) o.frameDeco(root, W, H, f, fm);
    root.position.y = H / 2 + (o.frame || 0); root.rotation.x = -0.12;
    const holder = new THREE.Group(); holder.add(root);
    return Object.assign({ root: holder, note: o.note || null }, still(o.actions || []));
  }
  // lying flat, folded in panels that open out
  sheet.rotation.x = -Math.PI / 2; sheet.position.y = 0.005;
  const P = sheet.geometry.attributes.position, base = Float32Array.from(P.array);
  let u = 1, want = 1;
  const pose = () => { const panels = o.fold; for (let i = 0; i < P.count; i++) { const x = base[i * 3], t = (x + W / 2) / W, pi = Math.min(panels - 1, Math.floor(t * panels)), lt = t * panels - pi, pw = W / panels; const xs = -pw / 2 + ((pi % 2) ? (1 - lt) : lt) * pw; P.setX(i, lerp(xs, x, u)); P.setZ(i, lerp(pi * 0.002, 0, u)); } P.needsUpdate = true; sheet.geometry.computeVertexNormals(); };
  return { root, note: o.note || null, postMeasure() { if (o.fold) { u = want = 0; pose(); } }, actions: o.fold ? [{ id: "unfold", label: "Unfold it", alt: "Fold it" }] : [],
    act(id) { if (id !== "unfold") return null; want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 1.8)); if (Math.abs(u - want) < 0.002) u = want; pose(); return true; } return false; } };
}
const lerp = (a, b, t) => a + (b - a) * t;

// ---- books and manuscripts
const leather = () => plain("leather"), woodB = () => plain("wood");
function plantPic(mandrake) { return (g, hg, W, H) => {
  const cx = W / 2, top = H * 0.12, bot = H * 0.78; g.lineCap = "round";
  if (mandrake) { g.fillStyle = "#c89a70"; g.beginPath(); g.ellipse(cx, H * 0.62, W * 0.08, H * 0.12, 0, 0, TAU); g.fill(); [-1, 1].forEach((s) => { g.strokeStyle = "#b8865a"; g.lineWidth = 12; g.beginPath(); g.moveTo(cx + s * 20, H * 0.56); g.lineTo(cx + s * W * 0.16, H * 0.5); g.moveTo(cx + s * 16, H * 0.72); g.lineTo(cx + s * W * 0.1, H * 0.86); g.stroke(); }); }   // the root in the shape of a person
  else { g.strokeStyle = "#8a5a30"; g.lineWidth = 6; for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(cx, bot); g.quadraticCurveTo(cx + (R() - 0.5) * 80, bot + 30, cx + (R() - 0.5) * 160, bot + 60 + R() * 30); g.stroke(); } }
  g.strokeStyle = "#3a6a2a"; g.lineWidth = 5; g.beginPath(); g.moveTo(cx, bot - (mandrake ? H * 0.2 : 0)); g.lineTo(cx, top); g.stroke();
  for (let k = 0; k < 9; k++) { const y = top + (k / 9) * (bot - top) * (mandrake ? 0.6 : 1), s = k % 2 ? 1 : -1; g.fillStyle = `hsl(${95 + R() * 30},${35 + R() * 20}%,${28 + R() * 14}%)`; g.beginPath(); g.ellipse(cx + s * W * 0.12, y, W * 0.12, H * 0.028, s * 0.4, 0, TAU); g.fill(); }
  if (!mandrake && R() < 0.6) { g.fillStyle = ["#b83a3a", "#3a5ab8", "#d8a030"][(R() * 3) | 0]; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(cx + Math.cos(k * 1.26) * 18, top + Math.sin(k * 1.26) * 18, 12, 0, TAU); g.fill(); } }
}; }
CAT.v01 = (E) => bookEntry(E, { w: 0.16, h: 0.235, t: 0.05, cover: plain("parchment"), paper: "parchment", startOpen: true,
  pages: [page({ style: "voynich", size: 11, lh: 17, pic: plantPic(false), picTop: 0.8, pics: () => true, ink: "rgba(70,45,25,.85)" }), page({ style: "voynich", size: 11, lh: 17, ink: "rgba(70,45,25,.85)", pic: (g, hg, W, H) => { g.strokeStyle = "rgba(70,45,25,.8)"; g.lineWidth = 3; for (let r = 1; r < 5; r++) { g.beginPath(); g.arc(W / 2, H / 2, r * W * 0.09, 0, TAU); g.stroke(); } for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.fillStyle = k % 2 ? "#3a6aa8" : "#d8b050"; g.beginPath(); g.arc(W / 2 + Math.cos(a) * W * 0.32, H / 2 + Math.sin(a) * W * 0.32, 14, 0, TAU); g.fill(); } }, pics: (k) => k % 3 === 1, picOnly: true })] });
CAT.v08 = (E) => bookEntry(E, { w: 0.14, h: 0.26, t: 0.04, cover: leather(), paper: "papyrus", pages: [page({ style: "greek", size: 12, lh: 17, ink: "rgba(40,25,12,.85)" })],
  deco: (p, W, D, ct) => { const flap = mesh(new THREE.BoxGeometry(0.06, ct, D), leather(), W + 0.03, ct / 2, 0); p.add(flap); const th = mesh(new THREE.BoxGeometry(0.004, 0.003, 0.5), plain("leather"), W + 0.05, ct + 0.002, 0.02); th.rotation.y = 0.3; p.add(th); } });
CAT.v09 = (E) => bookEntry(E, { w: 0.5, h: 0.92, t: 0.22, ct: 0.025, cover: leather(), paper: "parchment", px: 900, openLabel: "Open the Codex Gigas",
  pages: [page({ style: "latin", cols: 2, size: 9, lh: 13, initial: "#9a2a1a" }),
    page({ style: "latin", size: 9, pic: (g, hg, W, H) => { g.fillStyle = "#d8ccb0"; g.fillRect(W * 0.15, H * 0.12, W * 0.7, H * 0.78); // the devil, crouching, with horns, red claws and forked tongue
      g.fillStyle = "#3a5a3a"; g.beginPath(); g.ellipse(W / 2, H * 0.32, W * 0.12, H * 0.08, 0, 0, TAU); g.fill(); g.fillStyle = "#ece4d0"; [-1, 1].forEach((s) => { g.beginPath(); g.moveTo(W / 2 + s * W * 0.05, H * 0.26); g.lineTo(W / 2 + s * W * 0.14, H * 0.16); g.lineTo(W / 2 + s * W * 0.08, H * 0.27); g.fill(); g.fillStyle = "#b02020"; g.beginPath(); g.arc(W / 2 + s * W * 0.04, H * 0.31, 7, 0, TAU); g.fill(); g.fillStyle = "#ece4d0"; });
      g.fillStyle = "#c83020"; g.fillRect(W / 2 - 3, H * 0.37, 6, H * 0.05); g.fillStyle = "#e8e0c8"; g.fillRect(W * 0.38, H * 0.4, W * 0.24, H * 0.18); g.fillStyle = "#3a5a3a"; [-1, 1].forEach((s) => { g.fillRect(W / 2 + s * W * 0.16 - 8, H * 0.38, 16, H * 0.18); g.fillRect(W / 2 + s * W * 0.08 - 8, H * 0.58, 16, H * 0.2); g.fillStyle = "#c02020"; for (let c = 0; c < 4; c++) g.fillRect(W / 2 + s * W * 0.16 - 10 + c * 6, H * 0.56, 3, 16); g.fillStyle = "#3a5a3a"; }); }, pics: (k) => k % 2 === 1, picOnly: true }),
    page({ style: "latin", pic: (g, hg, W, H) => { g.strokeStyle = "#7a3a2a"; g.lineWidth = 6; for (let r = 0; r < 4; r++) { g.strokeRect(W * (0.15 + r * 0.05), H * (0.12 + r * 0.06), W * (0.7 - r * 0.1), H * (0.78 - r * 0.12)); for (let x = W * (0.2 + r * 0.05); x < W * (0.8 - r * 0.05); x += 40) { g.fillStyle = "#b85a3a"; g.fillRect(x, H * (0.1 + r * 0.06), 20, 18); } } }, pics: () => true, picOnly: true })],
  deco: (p, W, D, ct) => studs(p, W, D, ct, plain("brass", E.env), { corners: 0.07, bosses: 5, scale: 2.5 }) });
CAT.v11 = (E) => bookEntry(E, { w: 0.1, h: 0.12, t: 0.06, cover: leather(), paper: "paper", startOpen: true,
  pages: [page({ style: "stamp", size: 12, lh: 17, ink: "rgba(40,25,12,.85)" }), page({ style: "stamp", size: 12, pic: (g, hg, W, H) => { g.strokeStyle = "rgba(40,25,12,.85)"; g.lineWidth = 4; g.beginPath(); g.moveTo(W * 0.3, H * 0.2); g.lineTo(W * 0.3, H * 0.6); g.moveTo(W * 0.18, H * 0.3); g.lineTo(W * 0.42, H * 0.3); g.stroke(); g.beginPath(); g.arc(W * 0.7, H * 0.35, W * 0.12, 0.8, TAU - 0.8); g.stroke(); }, pics: (k) => k % 2 === 1, picTop: 0.65 })] });
CAT.v17 = (E) => leaves(E, { w: 0.08, h: 0.04, ground: "papyrus", jag: 0.004, note: "A proven forgery. Shown enlarged: the fragment is about 8 by 4 cm.", paint: (c, hg, W, H) => write(c, hg, [W * 0.06, H * 0.08, W * 0.94, H * 0.92], "greek", { size: 22, lh: 24, ink: "rgba(30,20,10,.85)" }), back: (c, hg, W, H) => write(c, null, [W * 0.1, H * 0.1, W * 0.9, H * 0.9], "greek", { size: 22, lh: 24, ink: "rgba(30,20,10,.25)" }) });
CAT.v18 = (E) => bookEntry(E, { w: 0.34, h: 0.38, t: 0.06, cover: leather(), paper: "parchment", startOpen: true, pages: [page({ style: "greek", cols: 4, size: 9, lh: 12, ink: "rgba(60,35,20,.8)", margin: 0.08 })] });
CAT.v19 = (E) => bookEntry(E, { w: 0.2, h: 0.28, t: 0.06, cover: leather(), paper: "paper", startOpen: true,
  pages: [page({ style: "latin", pic: (g, hg, W, H) => { const n = 18, x0 = W * 0.1, y0 = H * 0.12, cs = (W * 0.8) / n; g.strokeStyle = "rgba(40,25,12,.6)"; g.lineWidth = 1; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(x0 + i * cs, y0); g.lineTo(x0 + i * cs, y0 + n * cs); g.stroke(); g.beginPath(); g.moveTo(x0, y0 + i * cs); g.lineTo(x0 + n * cs, y0 + i * cs); g.stroke(); } for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) glyph("latin", g, x0 + i * cs + cs * 0.2, y0 + j * cs + cs * 0.2, cs * 0.6); }, pics: () => true, picTop: 0.8 })] });
CAT.v21 = (E) => bookEntry(E, { w: 0.25, h: 0.33, t: 0.09, cover: leather(), paper: "parchment", startOpen: true,
  pages: [page({ style: "latin", pic: (g, hg, W, H) => {                                        // the Chi-Rho page: the great XP, knotwork, and tiny animals
      interlace(g, W * 0.06, H * 0.05, W * 0.94, H * 0.09, "#d8a030", "#6a2a5a", 22); interlace(g, W * 0.06, H * 0.91, W * 0.94, H * 0.95, "#d8a030", "#6a2a5a", 22);
      g.lineCap = "round"; g.strokeStyle = "#8a2a4a"; g.lineWidth = W * 0.09; g.beginPath(); g.moveTo(W * 0.18, H * 0.14); g.bezierCurveTo(W * 0.45, H * 0.4, W * 0.6, H * 0.6, W * 0.82, H * 0.86); g.stroke(); g.beginPath(); g.moveTo(W * 0.8, H * 0.16); g.lineTo(W * 0.25, H * 0.7); g.stroke();
      g.strokeStyle = "#e0b040"; g.lineWidth = W * 0.05; g.stroke(); g.beginPath(); g.moveTo(W * 0.18, H * 0.14); g.bezierCurveTo(W * 0.45, H * 0.4, W * 0.6, H * 0.6, W * 0.82, H * 0.86); g.stroke();
      interlace(g, W * 0.4, H * 0.36, W * 0.56, H * 0.46, "#3a7a5a", "#e0c070", 12);
      for (let k = 0; k < 40; k++) { g.fillStyle = ["#d83a2a", "#3a6ab0", "#e0b040", "#3a8a5a"][k % 4]; g.beginPath(); g.arc(W * (0.15 + R() * 0.7), H * (0.15 + R() * 0.7), 3 + R() * 6, 0, TAU); g.fill(); }
      g.fillStyle = "#2a1a10"; g.beginPath(); g.ellipse(W * 0.3, H * 0.84, 18, 8, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(W * 0.4, H * 0.86, 10, 5, 0, 0, TAU); g.fill();   // cats and mice at the foot
    }, pics: (k) => k === 0 || k % 3 === 0, picOnly: true }), page({ style: "latin", size: 14, lh: 22, initial: "#8a2a4a", ink: "rgba(30,20,10,.9)" })] });
// V28, V29: the leaves are shown plain, unwritten. The archive does not draw imitation Qur'anic script (Carter's decision, 2026-10-06); "Read it in English" gives what the leaves contain.
CAT.v28 = (E) => leaves(E, { w: 0.25, h: 0.33, ground: "parchment", list: [[-0.14, 0], [0.14, 0]], paint: (c, hg, W, H) => { blotches(c, W, H, 6, "rgba(120,90,50,.10)", W / 4); }, back: (c, hg, W, H) => { blotches(c, W, H, 6, "rgba(120,90,50,.10)", W / 4); }, note: "The pages are shown plain: the archive does not draw imitation Qur'anic script." });
CAT.v29 = (E) => leaves(E, { w: 0.28, h: 0.36, ground: "parchment", list: [[-0.15, 0], [0.15, 0.02]], paint: (c, hg, W, H) => { blotches(c, W, H, 9, "rgba(110,80,45,.12)", W / 4); }, note: "The pages are shown plain: the archive does not draw imitation Qur'anic script, in either the upper or the erased lower text." });
CAT.v32 = (E) => bookEntry(E, { w: 0.2, h: 0.3, t: 0.04, cover: plain("parchment"), paper: "paper", startOpen: true, pages: [page({ style: "latin", cols: 2, size: 10, lh: 15, ink: "rgba(40,25,12,.85)" })] });
CAT.v38 = (E) => bookEntry(E, { w: 0.26, h: 0.33, t: 0.1, cover: leather(), paper: "parchment", startOpen: true, pages: [page({ style: "hebrew", cols: 3, size: 9, lh: 13, burn: 1, marg: "rgba(60,35,20,.6)" })] });
CAT.v40 = (E) => bookEntry(E, { w: 0.16, h: 0.3, t: 0.03, cover: plain("papyrus"), paper: "papyrus", startOpen: true, note: "The papyrus is shown fragmentary, as it survives.",
  pages: [page({ style: "greek", size: 12, lh: 17, pic: (g, hg, W, H) => { for (let k = 0; k < 7; k++) { g.fillStyle = "#1a1410"; g.beginPath(); const x = R() * W, y = R() * H; g.moveTo(x, y); for (let j = 0; j < 7; j++) g.lineTo(x + (R() - 0.5) * 120, y + (R() - 0.5) * 120); g.fill(); } }, pics: () => true })] });
CAT.v42 = (E) => bookEntry(E, { w: 0.25, h: 0.34, t: 0.08, cover: plain("silver", E.env), paper: "parchment", startOpen: true,
  pages: [page({ style: "latin", pic: (g, hg, W, H) => {                                      // a cross-carpet page
      interlace(g, W * 0.08, H * 0.06, W * 0.92, H * 0.94, "#c8a040", "#2a4a3a", 26);
      g.fillStyle = "#8a2a2a"; g.fillRect(W * 0.42, H * 0.08, W * 0.16, H * 0.84); g.fillRect(W * 0.12, H * 0.36, W * 0.76, H * 0.12); interlace(g, W * 0.44, H * 0.1, W * 0.56, H * 0.9, "#e0c070", "#6a1a1a", 14);
    }, pics: (k) => k % 3 === 0, picOnly: true }), page({ style: "latin", cols: 2, size: 13, lh: 26, gloss: "rgba(140,40,20,.9)", initial: "#2a5a3a" })],
  deco: (p, W, D, ct) => studs(p, W, D, ct, plain("gold", E.env), { corners: 0.03, bosses: 5, scale: 1.2 }) });
const ethiopic = (E, pic) => bookEntry(E, { w: 0.2, h: 0.26, t: 0.07, ct: 0.014, cover: woodB(), paper: "parchment", startOpen: true,
  pages: [page({ style: "ethiopic", cols: 2, size: 10, lh: 14, rubric: "#b02a1a", ink: "rgba(30,20,10,.9)" })].concat(pic ? [page({ style: "ethiopic", pic, pics: (k) => k % 3 === 1, picOnly: true })] : []) });
CAT.v49 = (E) => ethiopic(E);
CAT.v66 = (E) => ethiopic(E, (g, hg, W, H) => { g.fillStyle = "#e0c060"; g.fillRect(W * 0.1, H * 0.1, W * 0.8, H * 0.8); profile(g, W * 0.35, H * 0.3, H * 0.45, { col: "#8a5a3a", cloth: "#b02a1a", crown: "#e0b040" }); profile(g, W * 0.65, H * 0.3, H * 0.45, { left: true, col: "#8a5a3a", cloth: "#2a5ab0", crown: "#e0b040" }); });
CAT.v50 = (E) => bookEntry(E, { w: 0.3, h: 0.37, t: 0.1, cover: leather(), paper: "parchment", startOpen: true, pages: [page({ style: "greek", pic: plantPic(true), pics: (k) => k % 2 === 0, picOnly: true }), page({ style: "greek", pic: plantPic(false), pics: () => true, picTop: 0.82, size: 12 })] });
CAT.v51 = (E) => bookEntry(E, { w: 0.21, h: 0.3, t: 0.05, cover: plain("parchment"), paper: "paper", startOpen: true,
  pages: [page({ style: "latin", pic: (g, hg, W, H) => {                                       // the founding of Tenochtitlan: an eagle on a cactus on a rock in a square of water, framed by the year count
      g.fillStyle = "#6a9ac0"; g.fillRect(W * 0.2, H * 0.25, W * 0.6, H * 0.45); g.fillStyle = "#ece2c8"; g.fillRect(W * 0.26, H * 0.3, W * 0.48, H * 0.35);
      g.strokeStyle = "#2a5ab0"; g.lineWidth = 8; g.beginPath(); g.moveTo(W * 0.2, H * 0.25); g.lineTo(W * 0.8, H * 0.7); g.moveTo(W * 0.8, H * 0.25); g.lineTo(W * 0.2, H * 0.7); g.stroke();
      g.fillStyle = "#3a8a3a"; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(W * 0.5 + (k - 2) * 18, H * 0.5 - Math.abs(k - 2) * 10, 14, 22, (k - 2) * 0.3, 0, TAU); g.fill(); }
      g.fillStyle = "#6a4a2a"; g.beginPath(); g.ellipse(W * 0.5, H * 0.4, 26, 18, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(W * 0.46, H * 0.36); g.lineTo(W * 0.42, H * 0.3); g.lineTo(W * 0.5, H * 0.34); g.fill();
      g.fillStyle = "#2a4a9a"; for (let x = W * 0.08; x < W * 0.92; x += 28) { g.fillRect(x, H * 0.08, 22, 22); g.fillRect(x, H * 0.84, 22, 22); }
    }, pics: (k) => k % 2 === 0, picOnly: true }), page({ style: "latin", size: 10, pic: (g, hg, W, H) => { for (let k = 0; k < 12; k++) { const x = W * (0.15 + (k % 4) * 0.2), y = H * (0.15 + ((k / 4) | 0) * 0.2); g.fillStyle = ["#c83a2a", "#3a6ab0", "#e0b040", "#3a8a5a"][k % 4]; g.fillRect(x, y, 40, 40); g.strokeStyle = "#2a1a10"; g.strokeRect(x, y, 40, 40); } }, pics: () => true, picTop: 0.8 })] });
CAT.v61 = (E) => bookEntry(E, { w: 0.17, h: 0.26, t: 0.025, cover: surface("paper", 256, 384, (c, hg, W, H) => { c.fillStyle = "#6a5a3a"; c.fillRect(0, 0, W, H); c.fillStyle = "#e8dcc0"; c.fillRect(W * 0.1, H * 0.06, W * 0.2, H * 0.4); }), paper: "paper", startOpen: true,
  pages: [page({ style: "chinese", size: 16, vertical: true, ink: "rgba(20,15,10,.9)" })],
  deco: (p, W, D, ct) => { for (let k = 0; k < 4; k++) p.add(mesh(new THREE.BoxGeometry(0.02, 0.003, 0.002), plain("linen"), 0.012, ct + 0.001, -D / 2 + 0.03 + k * (D - 0.06) / 3)); } });
CAT.v63 = (E) => pothi(E, { w: 0.3, h: 0.11, ground: "paper", paint: (g, hg, W, H, k) => {        // a Kalpa Sutra leaf: red borders, a miniature of one of the fourteen dreams, black and red text
  g.fillStyle = "#b02a1a"; g.fillRect(0, 0, W * 0.05, H); g.fillRect(W * 0.95, 0, W * 0.05, H);
  const mx = k % 2 ? W * 0.62 : W * 0.08; g.fillStyle = "#b02a1a"; g.fillRect(mx, H * 0.1, W * 0.28, H * 0.8); g.fillStyle = "#e0b040"; g.fillRect(mx + 6, H * 0.14, W * 0.28 - 12, H * 0.72);
  if (k % 4 === 0) beast(g, mx + W * 0.14, H * 0.55, W * 0.18, { col: "#f0f0f0", line: "#2a1a10" }); else if (k % 4 === 1) { g.fillStyle = "#e8e8e8"; g.beginPath(); g.arc(mx + W * 0.14, H * 0.5, H * 0.25, 0, TAU); g.fill(); } else if (k % 4 === 2) beast(g, mx + W * 0.14, H * 0.55, W * 0.16, { col: "#e0a030", line: "#2a1a10", mane: true }); else profile(g, mx + W * 0.14, H * 0.2, H * 0.6, { col: "#c89060", cloth: "#2a5ab0", crown: "#e0b040" });
  write(g, null, [k % 2 ? W * 0.08 : W * 0.4, H * 0.12, k % 2 ? W * 0.58 : W * 0.92, H * 0.88], "devanagari", { size: 14, lh: 22, ink: "rgba(20,15,10,.9)" });
} });
CAT.v82 = (E) => pothi(E, { w: 0.5, h: 0.12, ground: "paper", cloth: "silk", paint: (g, hg, W, H) => { g.strokeStyle = "rgba(90,40,20,.6)"; g.strokeRect(W * 0.04, H * 0.1, W * 0.92, H * 0.8); write(g, null, [W * 0.06, H * 0.16, W * 0.94, H * 0.86], "tibetan", { size: 14, lh: 18, ink: "rgba(20,15,10,.9)" }); } });
CAT.v69 = (E) => bookEntry(E, { w: 0.15, h: 0.23, t: 0.02, cover: surface("leather", 256, 384, (c) => { c.fillStyle = "#3a2a4a"; c.fillRect(0, 0, 256, 384); c.fillStyle = "#d8b050"; c.fillRect(40, 80, 176, 20); }), paper: "paper", startOpen: true, pages: [page({ style: "latin", size: 10, lh: 16, ink: "rgba(20,15,10,.9)" })] });
CAT.v72 = (E) => bookEntry(E, { w: 0.2, h: 0.26, t: 0.04, cover: leather(), paper: "paper", startOpen: true,
  pages: [page({ style: "latin", size: 11, lh: 20, ink: "rgba(20,30,70,.8)", pic: (g, hg, W, H) => { g.strokeStyle = "rgba(20,30,70,.85)"; g.lineWidth = 3; const cx = W / 2, cy = H * 0.3, r = W * 0.16; g.beginPath(); g.arc(cx, cy, r * 1.15, 0, TAU); g.stroke(); g.beginPath(); for (let k = 0; k <= 5; k++) { const a = -Math.PI / 2 + k * 4 * Math.PI / 5; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.stroke(); }, pics: (k) => k % 2 === 1, picTop: 0.52 })] });
CAT.v74 = (E) => bookEntry(E, { w: 0.11, h: 0.175, t: 0.022, ct: 0.002, cover: surface("paper", 256, 400, (c) => { c.fillStyle = "#0e0c0e"; c.fillRect(0, 0, 256, 400); c.fillStyle = "#c8c0c8"; c.fillRect(30, 40, 196, 16); c.fillRect(60, 340, 136, 10); }), paper: "paper", startOpen: false, pages: [page({ style: "latin", size: 8, lh: 12, ink: "rgba(20,15,10,.9)" })] });
CAT.v78 = (E) => bookEntry(E, { w: 0.2, h: 0.28, t: 0.07, cover: leather(), paper: "paper", startOpen: true, pages: [page({ style: "latin", cols: 2, size: 9, lh: 12, initial: "#a02a1a", ink: "rgba(15,10,8,.95)" })], deco: (p, W, D, ct) => studs(p, W, D, ct, plain("brass", E.env), { corners: 0.025, bosses: 5 }) });
CAT.v79 = (E) => bookEntry(E, { w: 0.28, h: 0.4, t: 0.08, cover: leather(), paper: "paper", startOpen: true, pages: [page({ style: "hebrew", cols: 2, size: 10, lh: 13, ink: "rgba(15,10,8,.95)", marg: "rgba(15,10,8,.6)" })] });
CAT.v80 = (E) => bookEntry(E, { w: 0.14, h: 0.2, t: 0.02, cover: leather(), paper: "paper", startOpen: true,
  pages: [page({ style: "hebrew", size: 10, lh: 14, ink: "rgba(15,10,8,.95)", pic: (g, hg, W, H) => { g.strokeStyle = "rgba(15,10,8,.9)"; g.lineWidth = 2; const pts = [[0.5, 0.08], [0.3, 0.16], [0.7, 0.16], [0.3, 0.3], [0.7, 0.3], [0.5, 0.24], [0.5, 0.38], [0.3, 0.44], [0.7, 0.44], [0.5, 0.52]]; pts.forEach(([a, b], i) => pts.slice(i + 1).forEach(([c2, d2]) => { if (Math.hypot(a - c2, b - d2) < 0.25) { g.beginPath(); g.moveTo(W * a, H * b); g.lineTo(W * c2, H * d2); g.stroke(); } })); pts.forEach(([a, b]) => { g.fillStyle = "#ece2c8"; g.beginPath(); g.arc(W * a, H * b, 12, 0, TAU); g.fill(); g.stroke(); }); }, pics: (k) => k % 2 === 0, picTop: 0.6 })],
  note: "The diagram of ten circles joined by paths is shown as later printed editions draw it." });
CAT.v85 = (E) => bookEntry(E, { w: 0.2, h: 0.28, t: 0.05, cover: leather(), paper: "parchment", startOpen: true,
  pages: [page({ style: "latin", size: 11, lh: 17, pic: (g, hg, W, H) => { for (let k = 0; k < 3; k++) { const x = W * (0.2 + k * 0.3); g.strokeStyle = "rgba(40,25,12,.85)"; g.lineWidth = 2; g.beginPath(); g.arc(x, H * 0.2, 44, 0, TAU); g.stroke(); frontal(g, x, H * 0.12, 60, { body: "#c83a2a", line: "#2a1a10" }); } }, pics: (k) => k % 2 === 0, picTop: 0.36 })] });
CAT.v03 = (E) => bookEntry(E, { w: 0.18, h: 0.26, t: 0.04, cover: leather(), paper: "paper", startOpen: true, pages: [page({ style: "latin", size: 12, lh: 19, initial: "#a02a1a", ink: "rgba(15,10,8,.95)" })],
  note: "The Emerald Tablet survives only as a text, in Arabic and Latin copies; no tablet is known. It is shown here as a printed page." });
CAT.v73 = (E) => leaves(E, { w: 0.2, h: 0.26, ground: "paper", list: [[-0.11, 0], [0.11, 0.01]], paint: (c, hg, W, H) => { c.strokeStyle = "rgba(100,120,160,.35)"; for (let y = H * 0.1; y < H * 0.95; y += 24) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); } write(c, null, [W * 0.08, H * 0.1, W * 0.92, H * 0.92], "latin", { size: 14, lh: 24, ink: "rgba(20,20,40,.8)", space: 0.2 }); } });
CAT.v33 = (E) => {                                          // the Kartarpur Bir: a great volume wrapped in an embroidered cloth, resting on cushions on a low stand
  const root = new THREE.Group(), silk = surface("silk", 1024, 1024, (c, hg, W, H) => { c.fillStyle = "#8a1a2a"; c.fillRect(0, 0, W, H); for (let y = 30; y < H; y += 80) for (let x = 30; x < W; x += 80) rosette(c, x + (y / 80 % 2) * 40, y, 22, 8, "#e0b040", "#f0d890"); c.strokeStyle = "#e0b040"; c.lineWidth = 12; c.strokeRect(20, 20, W - 40, H - 40); }, { relief: 2 });
  root.add(mesh(new THREE.BoxGeometry(0.9, 0.2, 0.6), plain("wood"), 0, 0.1, 0));
  const cush = (x, z) => { const m = mesh(new THREE.SphereGeometry(0.2, 24, 14), silk, x, 0.26, z); m.scale.set(1.1, 0.35, 1.3); root.add(m); }; cush(-0.2, 0); cush(0.2, 0);
  const vol = mesh(new THREE.BoxGeometry(0.5, 0.14, 0.38), silk, 0, 0.4, 0); root.add(vol);
  const drape = mesh(new THREE.BoxGeometry(0.9, 0.02, 0.62), silk, 0, 0.47, 0); root.add(drape);
  return Object.assign({ root, note: "The volume is shown wrapped, as it is kept." }, still());
};

// ---- scrolls
const colsOf = (style, o) => (g, hg, W, H) => { const n = o.n, cw = W / n; for (let i = 0; i < n; i++) { if (o.seams && i % o.seams === 0 && i) { g.strokeStyle = "rgba(80,50,20,.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(i * cw, 0); g.lineTo(i * cw, H); g.stroke(); for (let y = 10; y < H; y += 18) { g.fillStyle = "rgba(60,40,20,.6)"; g.fillRect(i * cw - 3, y, 6, 3); } } write(g, null, [i * cw + cw * 0.1, H * 0.1, i * cw + cw * 0.9, H * 0.9], style, { size: o.size || 11, lh: o.lh || 15, ink: o.ink || "rgba(40,25,12,.85)", cols: o.vertical }); } if (o.holes) for (let k = 0; k < o.holes; k++) { g.fillStyle = "#1a120a"; g.beginPath(); g.ellipse(R() * W, R() < 0.5 ? R() * 30 : H - R() * 30, 20 + R() * 40, 10 + R() * 20, 0, 0, TAU); g.fill(); } };
CAT.v48 = (E) => { const s = scroll({ len: 1.6, h: 0.26, ground: "parchment", r: 0.06, paint: colsOf("hebrew", { n: 20, seams: 4, size: 10, lh: 13, holes: 6 }), start: 1 }); return Object.assign({ root: s.root, note: "Shown in part: the whole scroll is 7.34 metres long." }, s); };
CAT.v02 = (E) => {                                          // the Dead Sea Scrolls: a cylindrical Qumran jar with its lid, and a scroll unrolled beside it
  const root = new THREE.Group(), clay = surface("clay", 512, 512, null, { relief: 3 });
  const jar = lathe([[0, 0], [0.1, 0], [0.12, 0.05], [0.125, 0.3], [0.11, 0.5], [0.08, 0.56], [0.075, 0.6], [0, 0.6]], clay, 48); jar.position.set(-0.45, 0, 0); root.add(jar);
  const lid = lathe([[0, 0.6], [0.09, 0.6], [0.095, 0.62], [0.06, 0.66], [0, 0.67]], clay, 48); lid.position.set(-0.45, 0.02, 0); root.add(lid);
  const s = scroll({ len: 0.8, h: 0.2, ground: "parchment", r: 0.04, paint: colsOf("hebrew", { n: 8, size: 9, lh: 12, holes: 5 }) }); s.root.position.x = 0.15; root.add(s.root);
  return Object.assign({}, s, { root });
};
CAT.v10 = (E) => {                                          // the Copper Scroll: oxidised copper, cut into curved segments to be read, letters punched into it
  const root = new THREE.Group(), cu = surface("copper", 1024, 512, (c, hg, W, H) => write(c, hg, [W * 0.05, H * 0.1, W * 0.95, H * 0.9], "hebrew", { size: 18, lh: 24, ink: "rgba(30,20,10,.75)" }), { env: E.env, relief: 6, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) { const a0 = R() * 0.6, g = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 32, 1, true, a0, 2.2 + R()); const m = mesh(g, cu, (i % 4) * 0.16 - 0.24, 0.06, ((i / 4) | 0) * 0.2 - 0.1); m.rotation.z = Math.PI / 2; m.rotation.y = (R() - 0.5) * 0.4; root.add(m); }
  return Object.assign({ root, note: "The scroll was sawn into 23 segments in 1956 so that it could be read." }, still());
};
CAT.v12 = (E) => {                                          // the Ketef Hinnom amulets: two tiny rolled silver strips, and one unrolled, lightly scratched with letters
  const root = new THREE.Group(), ag = surface("silver", 1024, 256, (c, hg, W, H) => write(c, hg, [W * 0.03, H * 0.1, W * 0.97, H * 0.9], "hebrew", { size: 16, lh: 20, ink: "rgba(40,40,40,.6)", weight: 1.2 }), { env: E.env, relief: 4, side: THREE.DoubleSide });
  put(root, mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.027, 24), plain("silver", E.env), -0.03, 0.006, -0.02)).rotation.z = Math.PI / 2;
  root.add(mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.011, 16), plain("silver", E.env), 0.02, 0.004, -0.02));
  const flat = mesh(new THREE.PlaneGeometry(0.097, 0.027, 24, 1), ag, 0, 0.002, 0.02); flat.rotation.x = -Math.PI / 2; const P = flat.geometry.attributes.position; for (let i = 0; i < P.count; i++) P.setZ(i, Math.sin(P.getX(i) * 90) * 0.0008); root.add(flat);
  return Object.assign({ root, note: "Shown greatly enlarged: the larger amulet is under 10 cm long when unrolled." }, still());
};
CAT.v20 = (E) => { const s = scroll({ len: 1.2, h: 0.42, ground: "papyrus", r: 0.05, start: 1, paint: (g, hg, W, H) => {   // the judgment (sheet 3, BM EA 10470/3): the gods seated as judges above; Anubis at the scales, the heart against the feather, Thoth writing, the Devourer waiting
  write(g, null, [W * 0.02, H * 0.03, W * 0.98, H * 0.12], "hiero", { size: 14, cols: true, ink: "rgba(30,20,10,.85)" });
  for (let k = 0; k < 12; k++) seated(g, W * (0.28 + k * 0.052), H * 0.14, H * 0.17, { left: true, col: ["#3a5aa0", "#c07040", "#3a7a4a", "#b0704a"][k % 4], cloth: "#f4ecd8", throne: "#d8b070" });   // twelve gods seated as judges
  g.fillStyle = "#2a1a10"; g.fillRect(W * 0.26, H * 0.32, W * 0.65, 3);
  const base = H * 0.88, fh = H * 0.55;
  profile(g, W * 0.1, base - fh, fh, { col: "#b0704a", cloth: "#f4ecd8" }); profile(g, W * 0.18, base - fh, fh, { col: "#d8a080", cloth: "#f4ecd8" });
  g.strokeStyle = "#2a1a10"; g.lineWidth = 5; g.beginPath(); g.moveTo(W * 0.4, base); g.lineTo(W * 0.4, base - fh * 0.9); g.moveTo(W * 0.3, base - fh * 0.8); g.lineTo(W * 0.5, base - fh * 0.8); g.stroke();
  g.beginPath(); g.moveTo(W * 0.3, base - fh * 0.8); g.lineTo(W * 0.3, base - fh * 0.45); g.moveTo(W * 0.5, base - fh * 0.8); g.lineTo(W * 0.5, base - fh * 0.45); g.stroke();
  g.fillStyle = "#b02a1a"; g.beginPath(); g.ellipse(W * 0.3, base - fh * 0.42, 14, 18, 0, 0, TAU); g.fill(); g.fillStyle = "#f4ecd8"; g.beginPath(); g.ellipse(W * 0.5, base - fh * 0.48, 5, 22, 0.2, 0, TAU); g.fill(); g.strokeStyle = "#2a1a10"; g.lineWidth = 2; g.stroke();
  profile(g, W * 0.45, base - fh * 0.8, fh * 0.8, { head: "jackal", col: "#2a1a10", cloth: "#f4ecd8" });
  g.fillStyle = "#2a1a10"; g.beginPath(); g.ellipse(W * 0.4, base - fh * 0.98, 14, 18, 0, 0, TAU); g.fill();                   // Thoth's baboon on the post of the scale
  profile(g, W * 0.62, base - fh, fh, { head: "ibis", col: "#3a6a3a", cloth: "#f4ecd8" });
  beast(g, W * 0.8, base - fh * 0.3, fh * 0.6, { col: "#6a8a3a", line: "#2a1a10", mane: true });
  g.fillStyle = "#2a1a10"; g.fillRect(0, base + 4, W, 4);
} }); return Object.assign({ root: s.root, note: "One scene of a scroll about 24 metres long, now cut into 37 sheets; the sheets are 42 cm high (the British Museum's records)." }, s); };
CAT.v30 = (E) => { const s = scroll({ len: 1.5, h: 0.27, ground: "paper", r: 0.04, rods: true, start: 1, paint: (g, hg, W, H) => {   // the frontispiece: the Buddha preaching under a canopy, then columns of printed text
  const fw = W * 0.3; g.strokeStyle = "rgba(20,15,10,.9)"; g.lineWidth = 2;
  g.strokeRect(W - fw, H * 0.06, fw - 10, H * 0.88);
  g.beginPath(); g.arc(W - fw / 2, H * 0.45, H * 0.18, 0, TAU); g.stroke(); frontal(g, W - fw / 2, H * 0.3, H * 0.45, { body: "rgba(0,0,0,0)", line: "rgba(20,15,10,.9)" });
  g.beginPath(); g.moveTo(W - fw * 0.8, H * 0.14); g.lineTo(W - fw * 0.2, H * 0.14); g.lineTo(W - fw * 0.3, H * 0.2); g.lineTo(W - fw * 0.7, H * 0.2); g.closePath(); g.stroke();
  for (let k = 0; k < 8; k++) profile(g, W - fw * (k < 4 ? 0.9 - k * 0.06 : 0.1 + (k - 4) * 0.06) - 10, H * 0.55, H * 0.3, { left: k >= 4, col: "rgba(0,0,0,0)", cloth: "rgba(0,0,0,0)", line: "rgba(20,15,10,.8)" });
  for (let x = W - fw - 20; x > 20; x -= 30) write(g, null, [x - 26, H * 0.08, x, H * 0.92], "chinese", { size: 18, cols: true, ink: "rgba(15,10,8,.9)" });
} }); return Object.assign({ root: s.root, note: "Shown in part: the whole scroll is about five metres long." }, s); };
CAT.v39 = (E) => {                                          // the Derveni Papyrus: carbonised fragments laid out in columns under glass
  const root = new THREE.Group(); root.add(mesh(new THREE.BoxGeometry(0.9, 0.02, 0.5), plain("linen"), 0, 0.01, 0));
  const face = surface("stoneblack", 512, 512, (c, hg, W, H) => write(c, null, [W * 0.05, H * 0.08, W * 0.95, H * 0.92], "greek", { size: 16, lh: 21, ink: "rgba(170,150,120,.45)" }), { env: E.env, relief: 1.5 }), edge = plain("stoneblack");
  for (let i = 0; i < 26; i++) { const w = 0.05 + R() * 0.07, h = 0.04 + R() * 0.05, G = slabGeo(outline(w, h, { jag: 0.012, n: 6 }), 0.002, 0), g = new THREE.Group(); g.add(mesh(G.body, edge), mesh(G.front, face));
    g.rotation.x = -Math.PI / 2; g.position.set(-0.4 + (i % 7) * 0.12 + R() * 0.02, 0.022, -0.2 + ((i / 7) | 0) * 0.13); root.add(g); }
  return Object.assign({ root }, still([cam("close", "Look closely", { pitch: 1.1, dist: 0.5, target: 0.02 })]));
};
CAT.v81 = (E) => cloth(E, { w: 0.48, h: 0.24, ground: "silk", fold: 4, paint: (g, hg, W, H) => {   // silk with ruled red columns of characters, some lost
  g.strokeStyle = "rgba(160,40,20,.55)"; g.lineWidth = 2; for (let x = 20; x < W; x += 26) { g.beginPath(); g.moveTo(x, H * 0.05); g.lineTo(x, H * 0.95); g.stroke(); }
  for (let x = W - 26; x > 10; x -= 26) write(g, null, [x + 2, H * 0.07, x + 24, H * 0.93], "chinese", { size: 18, cols: true, ink: "rgba(20,15,10,.85)" });
  for (let k = 0; k < 10; k++) { g.fillStyle = "#2a1c10"; g.beginPath(); g.ellipse(R() * W, R() * H, 20 + R() * 50, 10 + R() * 30, R(), 0, TAU); g.fill(); }
} });
CAT.v87 = (E) => { const s = scroll({ len: 1.6, h: 0.22, ground: "paper", r: 0.035, start: 1, paint: (g, hg, W, H) => {   // the Diwan Abatur: drawings of the watch-houses, the ship on the river, the scales, with text between
  for (let k = 0; k < 7; k++) { const x = W * (0.05 + k * 0.14); g.strokeStyle = "rgba(20,15,10,.85)"; g.lineWidth = 2; g.strokeRect(x, H * 0.15, W * 0.06, H * 0.35); frontal(g, x + W * 0.03, H * 0.2, H * 0.28, { body: "rgba(0,0,0,0)", line: "rgba(20,15,10,.85)" }); write(g, null, [x + W * 0.07, H * 0.15, x + W * 0.13, H * 0.85], "aramaic", { size: 10, lh: 13, ink: "rgba(20,15,10,.85)" }); }
  g.strokeStyle = "rgba(20,40,120,.8)"; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); for (let x = 0; x < W; x += 10) g.lineTo(x, H * (0.7 + k * 0.04) + Math.sin(x * 0.05) * 4); g.stroke(); }
  g.strokeStyle = "rgba(20,15,10,.9)"; g.beginPath(); g.moveTo(W * 0.4, H * 0.68); g.lineTo(W * 0.5, H * 0.68); g.lineTo(W * 0.48, H * 0.74); g.lineTo(W * 0.42, H * 0.74); g.closePath(); g.stroke();
} }); return Object.assign({ root: s.root, note: "Shown in part: the scroll is over six metres long." }, s); };

// ---- screenfolds of the Americas
CAT.v31 = (E) => { const s = screenfold({ w: 0.09, h: 0.205, panels: 10, ground: "amate", paint: (g, hg, W, H, i) => {   // the Dresden Codex: red-and-black glyph blocks, numbers in bars and dots, a figure in each band
  g.fillStyle = "#e8dcc0"; g.fillRect(8, 8, W - 16, H - 16);
  for (let r = 0; r < 3; r++) { const y = H * (0.06 + r * 0.32); write(g, null, [W * 0.1, y, W * 0.9, y + H * 0.12], "maya", { size: 22, ink: r % 2 ? "rgba(160,40,20,.9)" : "rgba(20,15,10,.9)" }); frontal(g, W * 0.5, y + H * 0.13, H * 0.16, { body: ["#c83a2a", "#3a7a9a", "#d8a030"][(i + r) % 3], line: "#1a1008" }); for (let k = 0; k < 3; k++) { g.fillStyle = "#1a1008"; g.fillRect(W * 0.12, y + H * 0.18 + k * 8, W * 0.12, 4); } }
} }); return Object.assign({ root: s.root }, s); };
CAT.v41 = (E) => { const s = screenfold({ w: 0.27, h: 0.27, panels: 8, ground: "gesso", paint: (g, hg, W, H, i) => {   // the Codex Borgia: a god in full colour, day-signs down the side
  const cols = ["#c8302a", "#2a6ab0", "#e0b030", "#2a8a4a", "#1a1a1a"]; g.fillStyle = "#b02a1a"; g.fillRect(0, 0, W, 10); g.fillRect(0, H - 10, W, 10);
  for (let k = 0; k < 6; k++) { g.fillStyle = cols[(k + i) % 5]; g.fillRect(8, 14 + k * (H - 28) / 6, 40, (H - 28) / 6 - 4); }
  frontal(g, W * 0.58, H * 0.15, H * 0.7, { body: cols[i % 5], head: cols[(i + 2) % 5], rays: i % 2 === 0, staffs: i % 2 === 1, line: "#1a1008" });
} }); return Object.assign({ root: s.root }, s); };
CAT.v83 = (E) => { const s = screenfold({ w: 0.25, h: 0.2, panels: 10, ground: "amate", paint: (g, hg, W, H, i) => {   // the Codex Boturini: black ink only, footprints marching, place glyphs, year counts in boxes
  g.fillStyle = "#1a1410"; for (let x = 20; x < W - 20; x += 30) { g.beginPath(); g.ellipse(x, H * 0.55 + (x / 30 % 2) * 12, 7, 11, 0.3, 0, TAU); g.fill(); for (let t = 0; t < 4; t++) { g.beginPath(); g.arc(x - 6 + t * 4, H * 0.55 + (x / 30 % 2) * 12 - 13, 2, 0, TAU); g.fill(); } }
  for (let k = 0; k < 4; k++) { g.strokeStyle = "#1a1410"; g.lineWidth = 2; g.strokeRect(10 + k * 34, H * 0.1, 28, 28); glyph("maya", g, 12 + k * 34, H * 0.1 + 2, 24); }
  profile(g, W * 0.75, H * 0.2, H * 0.3, { col: "rgba(0,0,0,0)", cloth: "rgba(0,0,0,0)", line: "#1a1410" });
} }); return Object.assign({ root: s.root, note: "Shown in part: the strip is 5.5 metres long." }, s); };

// ---- cloths and images on cloth
const faintFace = (g, W, H, cx, cy, s, col) => { g.fillStyle = col; g.globalAlpha = 0.35; g.beginPath(); g.ellipse(cx, cy, s * 0.35, s * 0.48, 0, 0, TAU); g.fill(); g.globalAlpha = 0.5; g.fillStyle = col; [-1, 1].forEach((d) => { g.beginPath(); g.ellipse(cx + d * s * 0.13, cy - s * 0.06, s * 0.06, s * 0.025, 0, 0, TAU); g.fill(); }); g.fillRect(cx - s * 0.015, cy - s * 0.02, s * 0.03, s * 0.16); g.fillRect(cx - s * 0.08, cy + s * 0.2, s * 0.16, s * 0.02); g.globalAlpha = 0.25; g.beginPath(); g.ellipse(cx, cy + s * 0.34, s * 0.2, s * 0.14, 0, 0, TAU); g.fill(); g.globalAlpha = 1; };
CAT.v04 = (E) => cloth(E, { w: 4.4, h: 1.1, px: 2048, ground: "linen", fold: 8, note: "The faint image is drawn schematically here: how the image on the Shroud was formed is unexplained.", paint: (g, hg, W, H) => {
  for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 12) { g.fillStyle = ((x / 12 + y / 6) % 4 < 2) ? "rgba(120,100,70,.08)" : "rgba(255,250,235,.06)"; g.fillRect(x, y, 12, 6); }   // herringbone
  const body = (cx, flip) => { g.fillStyle = "rgba(140,105,70,.35)"; g.beginPath(); g.ellipse(cx, H / 2, W * 0.2, H * 0.16, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(cx + flip * W * 0.215, H / 2, H * 0.09, 0, TAU); g.fill(); g.fillRect(cx - flip * W * 0.2 - W * 0.02, H * 0.42, W * 0.04, H * 0.16); g.fillStyle = "rgba(150,60,40,.35)"; for (let k = 0; k < 20; k++) { g.beginPath(); g.arc(cx + (R() - 0.5) * W * 0.3, H / 2 + (R() - 0.5) * H * 0.25, 2 + R() * 3, 0, TAU); g.fill(); } };
  body(W * 0.27, 1); body(W * 0.73, -1);
  // the scorches and patches of the 1532 fire, and water stains
  for (let k = 0; k < 16; k++) { const x = W * (k % 8) / 8 + W / 16, y = k < 8 ? H * 0.18 : H * 0.82; g.fillStyle = "#e8dcc4"; g.beginPath(); g.moveTo(x - 30, y - 20); g.lineTo(x + 30, y - 20); g.lineTo(x, y + 30); g.closePath(); g.fill(); g.strokeStyle = "#3a2210"; g.lineWidth = 4; g.stroke(); }
  for (let k = 0; k < 8; k++) { g.strokeStyle = "rgba(120,90,50,.3)"; g.lineWidth = 3; g.beginPath(); g.ellipse(W * (0.06 + k * 0.125), H / 2, 60, 110, 0, 0, TAU); g.stroke(); }
} });
CAT.v13 = (E) => cloth(E, { w: 1.05, h: 1.7, ground: "amate", frame: 0.08, px: 900, note: "The image is drawn schematically here, without the features of the face.", paint: (g, hg, W, H) => {   // Our Lady of Guadalupe: rays, a star-strewn mantle, the moon, the angel
  const cx = W / 2; g.fillStyle = "#d8b060"; g.beginPath(); g.ellipse(cx, H * 0.5, W * 0.38, H * 0.44, 0, 0, TAU); g.fill();
  g.strokeStyle = "#f0d070"; g.lineWidth = 6; for (let k = 0; k < 90; k++) { const a = k / 90 * TAU; g.beginPath(); g.moveTo(cx + Math.cos(a) * W * 0.24, H * 0.5 + Math.sin(a) * H * 0.3); g.lineTo(cx + Math.cos(a) * W * 0.37, H * 0.5 + Math.sin(a) * H * 0.43); g.stroke(); }
  g.fillStyle = "#c86a6a"; g.beginPath(); g.moveTo(cx - W * 0.12, H * 0.3); g.lineTo(cx + W * 0.12, H * 0.3); g.lineTo(cx + W * 0.16, H * 0.8); g.lineTo(cx - W * 0.16, H * 0.8); g.closePath(); g.fill();
  g.fillStyle = "#2a6a70"; g.beginPath(); g.moveTo(cx, H * 0.14); g.bezierCurveTo(cx + W * 0.2, H * 0.2, cx + W * 0.22, H * 0.6, cx + W * 0.2, H * 0.82); g.lineTo(cx + W * 0.08, H * 0.82); g.lineTo(cx, H * 0.28); g.lineTo(cx - W * 0.08, H * 0.82); g.lineTo(cx - W * 0.2, H * 0.82); g.bezierCurveTo(cx - W * 0.22, H * 0.6, cx - W * 0.2, H * 0.2, cx, H * 0.14); g.fill();
  g.fillStyle = "#f0d070"; for (let k = 0; k < 30; k++) { const x = cx + (R() - 0.5) * W * 0.36, y = H * (0.2 + R() * 0.6); if (Math.abs(x - cx) < W * 0.09 && y > H * 0.3) continue; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); }
  faintFace(g, W, H, cx - W * 0.02, H * 0.2, W * 0.12, "#7a5a40");
  g.fillStyle = "#2a2a2a"; g.beginPath(); g.arc(cx, H * 0.86, W * 0.16, 0, Math.PI); g.arc(cx, H * 0.84, W * 0.13, Math.PI, 0, true); g.fill();
  frontal(g, cx, H * 0.86, H * 0.12, { body: "#c83a2a", head: "#d8b080", line: "#2a1a10" });
} });
CAT.v24 = (E) => cloth(E, { w: 0.84, h: 0.53, ground: "linen", frame: 0.05, frameMat: plain("silver", E.env), paint: (g, hg, W, H) => {   // the Sudarium: stained linen, the stains repeating in a folded pattern
  for (let k = 0; k < 4; k++) { const cx = W * (k % 2 ? 0.7 : 0.3), cy = H * (k < 2 ? 0.4 : 0.6), sx = k % 2 ? -1 : 1; for (let j = 0; j < 12; j++) { g.fillStyle = `rgba(${110 + R() * 30},${60 + R() * 20},${40},${0.25 + R() * 0.2})`; g.beginPath(); g.ellipse(cx + sx * (R() * 60), cy + (R() - 0.5) * 80, 10 + R() * 30, 8 + R() * 20, R(), 0, TAU); g.fill(); } }
  g.strokeStyle = "rgba(90,70,40,.3)"; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, H); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();
} });
CAT.v25 = (E) => cloth(E, { w: 0.17, h: 0.24, ground: "linen", sheer: 0.7, frame: 0.02, frameMat: plain("silver", E.env), note: "The face is drawn schematically here.",
  paint: (g, hg, W, H) => { g.fillStyle = "rgba(230,215,180,.5)"; g.fillRect(0, 0, W, H); faintFace(g, W, H, W / 2, H * 0.45, W * 0.8, "#6a4a30"); },
  frameDeco: (root, W, H, f, fm) => { const ray = new THREE.Group(); for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; const m = mesh(new THREE.BoxGeometry(0.004, 0.06, 0.003), fm, Math.cos(a) * (W * 0.9), Math.sin(a) * (H * 0.8), -0.006); m.rotation.z = a - Math.PI / 2; ray.add(m); } root.add(ray); } });
CAT.v57 = (E) => cloth(E, { w: 0.29, h: 0.4, ground: "linen", frame: 0.1, note: "The face is drawn schematically here.", paint: (g, hg, W, H) => { g.fillStyle = "#8a6a44"; g.fillRect(0, 0, W, H); faintFace(g, W, H, W / 2, H * 0.45, W * 0.9, "#2a1a10"); g.fillStyle = "#c8a050"; g.globalAlpha = 0.5; g.beginPath(); g.arc(W / 2, H * 0.4, W * 0.46, 0, TAU); g.fill(); g.globalAlpha = 1; },
  frameDeco: (root, W, H, f, fm) => { for (let k = 0; k < 10; k++) { const side = k < 5 ? -1 : 1, y = -H / 2 + (k % 5 + 0.5) * H / 5; const p = mesh(new THREE.PlaneGeometry(f * 0.7, H / 5 * 0.8), surface("gold", 128, 256, (c, hg2, W2, H2) => { profile(c, W2 / 2, H2 * 0.2, H2 * 0.6, { col: "#8a6030", cloth: "#b08040", line: "#4a3010" }); }, { env: E.env }), side * (W / 2 + f / 2), y, 0.002); root.add(p); } } });

// ---- floors
CAT.v77 = (E) => {                                          // a vèvè for Legba traced in cornmeal on an earth floor: a cross, the cane, scrolls and stars
  const root = new THREE.Group(), fl = surface("cornmeal", 1024, 1024, (c, hg, W) => {
    const cx = W / 2, draw = (q) => { q.strokeStyle = "#ece2c8"; q.lineWidth = 14; q.lineCap = "round";
      q.beginPath(); q.moveTo(cx, W * 0.12); q.lineTo(cx, W * 0.88); q.moveTo(W * 0.12, cx); q.lineTo(W * 0.88, cx); q.stroke();
      q.lineWidth = 10; [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => { const x = cx + dx * W * 0.38, y = cx + dy * W * 0.38; q.beginPath(); q.arc(x - dy * 30, y + dx * 30, 26, 0, TAU * 0.8); q.stroke(); q.beginPath(); q.arc(x + dy * 30, y - dx * 30, 26, Math.PI, Math.PI * 2.8); q.stroke(); });
      q.beginPath(); q.moveTo(W * 0.62, W * 0.25); q.lineTo(W * 0.62, W * 0.45); q.arc(W * 0.66, W * 0.25, 40, Math.PI, Math.PI * 1.9); q.stroke();   // the cane
      q.lineWidth = 6; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, x = cx + Math.cos(a) * W * 0.25, y = cx + Math.sin(a) * W * 0.25; q.beginPath(); for (let j = 0; j < 10; j++) { const b = j / 10 * TAU, r = j % 2 ? 10 : 26; q.lineTo(x + Math.cos(b) * r, y + Math.sin(b) * r); } q.closePath(); q.stroke(); } };
    draw(c); if (hg) { draw(hg); }
    for (let i = 0; i < 1500; i++) { c.fillStyle = "rgba(236,226,200,.5)"; c.fillRect(R() * W, R() * W, 1.5, 1.5); }
  }, { relief: 5 });
  const floor = mesh(new THREE.PlaneGeometry(1.2, 1.2), fl); floor.rotation.x = -Math.PI / 2; root.add(floor);
  root.add(mesh(new THREE.BoxGeometry(1.24, 0.04, 1.24), plain("sandstone"), 0, -0.021, 0));
  return Object.assign({ root, note: "A vèvè is traced anew for each ceremony and danced over; this is one drawn in the manner of Legba's, not a record of a particular one." }, still([cam("above", "Look from above", { pitch: 1.35, dist: 1.6, target: 0 })]));
};
CAT.v84 = (E) => {                                          // the Hinton St Mary mosaic: the central roundel, a man's bust before the Chi-Rho, pomegranates either side
  const root = new THREE.Group(), fl = surface("mosaic", 1400, 1400, (c, hg, W) => {
    const t = 11, cx = W / 2, pal = (x, y) => { const dx = x - cx, dy = y - cx, d = Math.hypot(dx, dy);
      if (d > W * 0.45) return (Math.floor(x / (t * 4)) + Math.floor(y / (t * 4))) % 2 ? "#8a3a24" : "#e0d4b4";
      if (d > W * 0.42) return "#2a2620";
      if (d > W * 0.4) return "#e0d4b4";
      const inChiRho = (Math.abs(dx - dy) < 22 || Math.abs(dx + dy) < 22) && d < W * 0.34 || (Math.abs(dx) < 16 && d < W * 0.34) || (Math.hypot(dx - 50, dy + W * 0.22) < 60 && Math.hypot(dx - 50, dy + W * 0.22) > 30 && dx > 10);
      const bust = Math.hypot(dx, (dy - 20) * 0.8) < W * 0.13 || (Math.abs(dx) < W * 0.16 && dy > W * 0.08 && dy < W * 0.3);
      const pom = [-1, 1].some((s) => Math.hypot(dx - s * W * 0.3, dy) < W * 0.05);
      if (bust) return Math.hypot(dx, (dy - 20) * 0.8) < W * 0.1 ? "#c8906a" : "#d8c090";
      if (inChiRho) return "#2a2620"; if (pom) return "#9a2a24"; return "#ece2c8"; };
    for (let y = 0; y < W; y += t) for (let x = 0; x < W; x += t) { if (R() < 0.03) continue; c.fillStyle = pal(x + t / 2, y + t / 2); c.fillRect(x + 1 + (R() - 0.5), y + 1 + (R() - 0.5), t - 2, t - 2); if (hg) { hg.fillStyle = "#909090"; hg.fillRect(x + 1, y + 1, t - 2, t - 2); } }
  }, { relief: 3 });
  const floor = mesh(new THREE.PlaneGeometry(1.4, 1.4), fl); floor.rotation.x = -Math.PI / 2; root.add(floor);
  root.add(mesh(new THREE.BoxGeometry(1.44, 0.05, 1.44), plain("limestone"), 0, -0.026, 0));
  return Object.assign({ root, note: "The central roundel, shown schematically; the face is not reproduced." }, still([cam("above", "Look from above", { pitch: 1.35, dist: 1.8, target: 0 })]));
};
