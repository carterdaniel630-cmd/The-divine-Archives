/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: the visual pass (period floors,
   flame light and symbol walls), area by area

   plans/museum-visual-pass.md. The table STYLE below says which areas have
   been given the pass; everything else in the museum is unchanged. Each area
   can have:
   - floor: a period floor round its glass pit, painted in the browser (colour
     and relief), and a kerb at the pit's edge;
   - fittings: flame lights of the area's era instead of the hanging bulbs:
     lamps in wall niches, tripod braziers. Only the nearest few flames are
     real lights (app.js, updateLights); every other flame is a glowing quad,
     and the light each throws on floor and wall is painted on once ("baked"),
     so phones stay fast;
   - symbols: the hallway's symbol wall (symbolWall below): the era's signs in
     slow columns, a soft white glow that never outshines the flames. The signs
     come from tools/data/symbols.json via tools/build-symbols.js, which draws
     them into one small atlas; tools/verify-symbols.js checks that no sign held
     back on sensitivity grounds is in it;
   - sky: 1 = the more detailed sky (world.js).

   These are the archive's own furniture, period-appropriate in kind, not
   reconstructions of any particular building.
   ========================================================================== */
import * as THREE from "three";

export const STYLE = {
  "cor:02-bronze-age": { floor: "brick", kerb: "limestone", fittings: "bronze-corridor", symbols: "bronze", sky: 1 },
  ch02: { floor: "limestone", kerb: "painted", fittings: "bronze-room", sky: 1 }
};
export const styleOf = (id) => STYLE[id] || null;

const TAU = Math.PI * 2;
function rng(seed) { let s = (seed | 0) || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function tex(c, srgb, rep) {
  const t = new THREE.CanvasTexture(c); if (srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4; if (rep !== false) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
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
function speckle(g, w, h, n, cols, size, R) { for (let i = 0; i < n; i++) { g.fillStyle = cols[(R() * cols.length) | 0]; const s = size * (0.4 + R()); g.fillRect(R() * w, R() * h, s, s); } }
function blot(g, x, y, r, col) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }

// ---------------------------------------------------------------- floors
// each covers 2 m × 2 m of floor (the museum's floor UVs are metres / 2) and tiles seamlessly
const FLOORS = {
  // dressed limestone paving: slabs in courses of varying length, cream to ochre, worn smooth in the middle,
  // chipped at the corners, thin mortar joints
  limestone(px) {
    const c = canvas(px, px), h = canvas(px, px), g = c.getContext("2d"), hg = h.getContext("2d"), R = rng(7), m = px / 2;   // px per metre
    g.fillStyle = "#b9a37c"; g.fillRect(0, 0, px, px); hg.fillStyle = "#6a6a6a"; hg.fillRect(0, 0, px, px);
    const rows = [0.62, 0.7, 0.68];                      // course widths (m), sum 2.0
    let y = 0;
    rows.forEach((rw, ri) => {
      let x = -R() * 0.8;
      while (x < 2) {
        const len = 0.55 + R() * 0.75, x0 = x, x1 = Math.min(x + len, 2 + 0.01);
        const L = 62 + R() * 14, hue = 36 + R() * 8, sat = 22 + R() * 14;
        const paint = (xa, xb) => {
          const X0 = xa * m + 2, X1 = xb * m - 2, Y0 = y * m + 2, Y1 = (y + rw) * m - 2;
          if (X1 <= X0) return;
          g.fillStyle = `hsl(${hue},${sat}%,${L}%)`; g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
          // worn middle, darker edges
          blot(g, (X0 + X1) / 2, (Y0 + Y1) / 2, Math.max(X1 - X0, Y1 - Y0) * 0.6, "rgba(255,245,220,.10)");
          g.strokeStyle = "rgba(80,60,35,.25)"; g.lineWidth = 3; g.strokeRect(X0 + 1.5, Y0 + 1.5, X1 - X0 - 3, Y1 - Y0 - 3);
          hg.fillStyle = "#9a9a9a"; hg.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
          hg.fillStyle = "#8a8a8a"; hg.fillRect(X0, Y0, X1 - X0, 3); hg.fillRect(X0, Y0, 3, Y1 - Y0);
          // chips at corners
          for (let k = 0; k < 2; k++) { const cx = R() < 0.5 ? X0 : X1, cy = R() < 0.5 ? Y0 : Y1, r = 4 + R() * 10; g.fillStyle = "rgba(90,70,45,.5)"; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); hg.fillStyle = "#606060"; hg.beginPath(); hg.arc(cx, cy, r, 0, TAU); hg.fill(); }
        };
        paint(x0, x1); if (x0 < 0) paint(x0 + 2, Math.min(x1 + 2, 2.01));   // wrap so the texture tiles
        x += len;
      }
      y += rw;
    });
    // grain, fossil specks, stains and scuffs
    speckle(g, px, px, px * px / 60, ["rgba(90,70,40,.35)", "rgba(240,230,205,.35)", "rgba(120,95,60,.3)"], px / 400, R);
    for (let i = 0; i < 18; i++) blot(g, R() * px, R() * px, px * (0.04 + R() * 0.1), "rgba(90,65,35,.12)");
    for (let i = 0; i < 40; i++) { g.strokeStyle = "rgba(70,55,35,.18)"; g.lineWidth = 1; g.beginPath(); const x = R() * px, yy = R() * px; g.moveTo(x, yy); g.lineTo(x + (R() - 0.5) * 40, yy + (R() - 0.5) * 12); g.stroke(); }
    speckle(hg, px, px, px * px / 90, ["#8a8a8a", "#a4a4a4"], px / 300, R);
    return { map: tex(c), normalMap: normalMap(h, 2.2) };
  },
  // baked brick in a square pavement, bitumen in the joints (Mesopotamian practice); buff and yellow, some reddened in the kiln
  brick(px) {
    const c = canvas(px, px), h = canvas(px, px), g = c.getContext("2d"), hg = h.getContext("2d"), R = rng(11), n = 6, s = px / n;   // 6 bricks per 2 m: about 33 cm
    g.fillStyle = "#2a1f18"; g.fillRect(0, 0, px, px); hg.fillStyle = "#404040"; hg.fillRect(0, 0, px, px);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i * s + 2, y = j * s + 2, w = s - 4, L = 54 + R() * 12, hue = 38 + R() * 8, red = R() < 0.12;
      g.fillStyle = red ? `hsl(${22 + R() * 6},${18 + R() * 8}%,${L - 8}%)` : `hsl(${hue},${10 + R() * 9}%,${L}%)`; g.fillRect(x, y, w, w);
      blot(g, x + w / 2, y + w / 2, w * 0.7, "rgba(255,240,210,.08)");
      speckle(g, s, s, 260, ["rgba(70,50,30,.35)", "rgba(230,210,170,.3)", "rgba(40,30,20,.3)"], px / 300, R);
      g.strokeStyle = "rgba(40,28,18,.35)"; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, w - 2);
      hg.fillStyle = `rgb(${150 + R() * 20},${150 + R() * 20},${150 + R() * 20})`; hg.fillRect(x, y, w, w);
      if (R() < 0.35) { g.fillStyle = "rgba(40,28,18,.45)"; const cx = x + (R() < 0.5 ? 0 : w), cy = y + (R() < 0.5 ? 0 : w), r = 3 + R() * 8; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); hg.fillStyle = "#505050"; hg.beginPath(); hg.arc(cx, cy, r, 0, TAU); hg.fill(); }
    }
    // the bitumen joints: dark, glossy, a little uneven
    g.fillStyle = "rgba(38,28,20,.85)"; for (let k = 0; k <= n; k++) { g.fillRect(k * s - 2, 0, 4, px); g.fillRect(0, k * s - 2, px, 4); }
    for (let i = 0; i < 12; i++) blot(g, R() * px, R() * px, px * (0.05 + R() * 0.12), "rgba(30,20,12,.14)");
    return { map: tex(c), normalMap: normalMap(h, 2.6) };
  }
};
// kerbs at the glass pit's edge: their texture runs along the strip (u = metres along, v across)
const KERBS = {
  limestone(px) {
    const c = canvas(px, px / 4), g = c.getContext("2d"), R = rng(5), w = c.width, hh = c.height;
    g.fillStyle = "#c8b48c"; g.fillRect(0, 0, w, hh);
    for (let x = 0; x < w; x += w / 2) { g.fillStyle = `hsl(38,${24 + R() * 10}%,${64 + R() * 8}%)`; g.fillRect(x + 2, 2, w / 2 - 4, hh - 4); }
    speckle(g, w, hh, w * hh / 40, ["rgba(90,70,40,.3)", "rgba(250,240,215,.3)"], w / 500, R);
    g.fillStyle = "rgba(255,248,230,.18)"; g.fillRect(0, hh * 0.78, w, hh * 0.22);         // the arris, rubbed bright
    return { map: tex(c), repeat: 0.5 };
  },
  // the block border of Egyptian painting: rectangles of blue, red, green and yellow between black and white rules,
  // as on the painted plaster floors of New Kingdom palaces (the Great Palace at Amarna)
  painted(px) {
    const c = canvas(px, px / 4), g = c.getContext("2d"), R = rng(9), w = c.width, hh = c.height;
    g.fillStyle = "#d8c4a0"; g.fillRect(0, 0, w, hh);
    const cols = ["#2f5f9a", "#b0402a", "#3f7a4a", "#d8a83a"], n = 8, bw = w / n;
    g.fillStyle = "#1a1410"; g.fillRect(0, hh * 0.16, w, hh * 0.05); g.fillRect(0, hh * 0.79, w, hh * 0.05);
    for (let i = 0; i < n; i++) {
      g.fillStyle = cols[i % 4]; g.fillRect(i * bw + bw * 0.08, hh * 0.25, bw * 0.84, hh * 0.5);
      g.fillStyle = "#f2ead8"; g.fillRect(i * bw, hh * 0.25, bw * 0.08, hh * 0.5);
    }
    // the paint is old: rubbed, flaked and stained
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(216,196,160,${0.25 + R() * 0.45})`; g.beginPath(); g.arc(R() * w, R() * hh, 2 + R() * 9, 0, TAU); g.fill(); }
    speckle(g, w, hh, w * hh / 30, ["rgba(90,70,40,.25)", "rgba(250,240,215,.25)"], w / 600, R);
    return { map: tex(c), repeat: 1 };
  }
};

export function createStyle(o) {
  const touch = !!o.touch, PX = touch ? 512 : 1024, FL = {}, KB = {};
  function floorMat(kind) {
    if (!FL[kind]) { const t = FLOORS[kind](PX); FL[kind] = new THREE.MeshLambertMaterial({ map: t.map, normalMap: t.normalMap, normalScale: new THREE.Vector2(0.9, 0.9) }); }
    return FL[kind];
  }
  function kerbMat(kind) {
    if (!KB[kind]) { const t = KERBS[kind](PX); KB[kind] = new THREE.MeshLambertMaterial({ map: t.map }); KB[kind].userData.repeat = t.repeat; }
    return KB[kind];
  }
  // a flat strip round the pit's rim, u running along each side (metres × repeat)
  function kerb(hole, kind, width) {
    const w = width || 0.26, m = kerbMat(kind), rep = m.userData.repeat || 1, pos = [], uv = [], idx = [], y = 0.004;
    const strip = (ax, az, bx, bz, ox, oz) => {          // a → b along the edge, (ox, oz) outward
      const len = Math.hypot(bx - ax, bz - az), b = pos.length / 3;
      pos.push(ax, y, az, bx, y, bz, bx + ox * w, y, bz + oz * w, ax + ox * w, y, az + oz * w);
      uv.push(0, 0, len * rep, 0, len * rep, 1, 0, 1);
      idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
    };
    const { x0, x1, z0, z1 } = hole;
    strip(x0 - w, z0, x1 + w, z0, 0, -1); strip(x1 + w, z1, x0 - w, z1, 0, 1);
    strip(x0, z1, x0, z0, -1, 0); strip(x1, z0, x1, z1, 1, 0);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(new Array(pos.length).fill(0).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx);
    // winding: make sure every face points up
    const p = geo.attributes.position, ix = geo.index.array, a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) { a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]); const ny = (b.z - a.z) * (c.x - a.x) - (b.x - a.x) * (c.z - a.z); if (ny < 0) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } }
    const mesh = new THREE.Mesh(geo, m); mesh.matrixAutoUpdate = false; mesh.renderOrder = 1;
    m.polygonOffset = true; m.polygonOffsetFactor = -1; m.polygonOffsetUnits = -1;
    return mesh;
  }

  // ---------------------------------------------------------------- fittings
  const MAT = o.MAT, FM = {
    clay: new THREE.MeshLambertMaterial({ color: "#9c6a44" }),
    soot: new THREE.MeshLambertMaterial({ color: "#2a1a10" }),
    niche: new THREE.MeshLambertMaterial({ color: "#1a120c" }),
    sill: new THREE.MeshLambertMaterial({ color: "#a89270" }),
    coal: new THREE.MeshBasicMaterial({ color: "#ff6a20" }),
    ash: new THREE.MeshLambertMaterial({ color: "#3a2a20" })
  };
  // a Canaanite-style saucer lamp: a shallow clay bowl with the rim pinched into a spout for the wick (Middle and Late Bronze Age)
  function saucerLamp(L, x, y, z, ry) {
    const bowl = new THREE.LatheGeometry([[0, 0], [0.055, 0.004], [0.07, 0.02], [0.074, 0.032], [0.066, 0.03], [0.05, 0.012], [0, 0.01]].map(([r, h]) => new THREE.Vector2(r, h)), 18);
    // pinch the rim on one side into a spout
    const p = bowl.attributes.position;
    for (let i = 0; i < p.count; i++) { const px = p.getX(i), pz = p.getZ(i), r = Math.hypot(px, pz); if (r > 0.04) { const a = Math.atan2(pz, px), k = Math.exp(-a * a * 8); p.setX(i, px * (1 + 0.35 * k)); p.setZ(i, pz * (1 - 0.55 * k)); } }
    bowl.computeVertexNormals(); bowl.rotateY(ry); bowl.translate(x, y, z); L.push([bowl, FM.clay]);
    const sp = new THREE.Vector3(Math.cos(-ry) * 0.085, 0.034, Math.sin(-ry) * 0.085);
    return new THREE.Vector3(x + sp.x, y + sp.y, z + sp.z);   // where the wick burns
  }
  // a niche in the wall with a stone sill and surround; (nx, nz) points into the corridor
  function niche(L, x, y, z, nx, nz) {
    const ry = Math.atan2(nx, nz), W = 0.46, Hh = 0.56, d = 0.05, put = (geo, mat, u, v, w) => { geo.rotateY(ry); geo.translate(x + nx * w + Math.cos(ry) * u, y + v, z + nz * w - Math.sin(ry) * u); L.push([geo, mat]); };
    put(new THREE.PlaneGeometry(W, Hh), FM.niche, 0, Hh / 2, 0.012);                                            // the shadowed back
    put(new THREE.BoxGeometry(0.08, Hh + 0.08, d * 2), FM.sill, -W / 2 - 0.04, Hh / 2, d);
    put(new THREE.BoxGeometry(0.08, Hh + 0.08, d * 2), FM.sill, W / 2 + 0.04, Hh / 2, d);
    put(new THREE.BoxGeometry(W + 0.16, 0.08, d * 2.4), FM.sill, 0, Hh + 0.04, d * 1.1);
    put(new THREE.BoxGeometry(W + 0.2, 0.06, 0.22), FM.sill, 0, -0.03, 0.11);                                   // the sill the lamp stands on
    put(new THREE.PlaneGeometry(W * 0.8, Hh * 0.55), FM.niche, 0, Hh * 0.62, 0.014);                              // soot above the flame
    return saucerLamp(L, x + nx * 0.12, y, z + nz * 0.12, ry + Math.PI / 2 * 0);
  }
  // a bronze tripod brazier with a shallow bowl of coals
  function brazier(L, x, z, s) {
    s = s || 1;
    const bowl = new THREE.LatheGeometry([[0, 0], [0.12, 0.01], [0.2, 0.05], [0.24, 0.1], [0.25, 0.12], [0.23, 0.12], [0.2, 0.07], [0.12, 0.04], [0, 0.035]].map(([r, h]) => new THREE.Vector2(r * s, h * s)), 24);
    bowl.translate(x, 0.78 * s, z); L.push([bowl, MAT.bronze]);
    const coals = new THREE.CylinderGeometry(0.2 * s, 0.2 * s, 0.03, 18); coals.translate(x, 0.88 * s, z); L.push([coals, FM.niche]);   // ash: drawn with the niche material (one draw call fewer)
    for (let k = 0; k < 3; k++) {
      const a = k / 3 * TAU + 0.5, leg = new THREE.CylinderGeometry(0.014 * s, 0.018 * s, 0.86 * s, 6);
      leg.translate(0, 0.43 * s, 0); leg.rotateX(0.16); leg.rotateY(-a + Math.PI / 2); leg.translate(x + Math.cos(a) * 0.05 * s, 0, z + Math.sin(a) * 0.05 * s); L.push([leg, MAT.bronze]);
      const foot = new THREE.SphereGeometry(0.035 * s, 8, 6); foot.translate(x + Math.cos(a) * 0.19 * s, 0.03, z + Math.sin(a) * 0.19 * s); L.push([foot, MAT.bronze]);
    }
    const ring = new THREE.TorusGeometry(0.17 * s, 0.01 * s, 6, 24); ring.rotateX(Math.PI / 2); ring.translate(x, 0.42 * s, z); L.push([ring, MAT.bronze]);
    const glow = new THREE.CircleGeometry(0.17 * s, 18); glow.rotateX(-Math.PI / 2); glow.translate(x, 0.897 * s, z); L.push([glow, FM.coal]);
    return new THREE.Vector3(x, 0.9 * s, z);
  }

  // ---------------------------------------------------------------- flames (one instanced draw call for all of them)
  const FLAMES = [];          // { p, size, seed }
  let flameMesh = null;
  const flameU = { uTime: { value: 0 } };
  const flameMat = new THREE.ShaderMaterial({
    uniforms: flameU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
attribute vec3 iPos; attribute vec2 iData; uniform float uTime; varying vec2 vUv; varying float vSeed;
void main(){
  vUv = uv; vSeed = iData.y;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  float sway = sin(uTime * 2.3 + iData.y * 17.) * .06 + sin(uTime * 5.1 + iData.y * 5.) * .03;
  vec3 p = iPos + right * (position.x + sway * position.y) * iData.x + vec3(0., 1., 0.) * position.y * iData.x * 1.9;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,
    fragmentShader: `
uniform float uTime; varying vec2 vUv; varying float vSeed;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main(){
  float t = uTime * 2.6 + vSeed * 31.;
  vec2 q = vec2(vUv.x - .5, vUv.y);
  float n = n2(vec2(q.x * 5., q.y * 4. - t)) * .6 + n2(vec2(q.x * 11., q.y * 9. - t * 1.7)) * .4;
  q.x += (n - .5) * .22 * q.y;
  float y = q.y * (1.05 + .12 * sin(t * 1.3));
  float width = .34 * sqrt(max(y, 0.)) * (1. - y) * 1.6;
  float d = abs(q.x) / max(width, 1e-3);
  float body = (1. - smoothstep(.55, 1., d)) * step(0., y) * (1. - smoothstep(.8, 1., y));
  float core = (1. - smoothstep(.0, .55, d)) * (1. - smoothstep(.15, .6, y));
  vec3 col = mix(vec3(1., .42, .08), vec3(1., .78, .32), smoothstep(.15, .7, 1. - y)) * body + vec3(1., .95, .8) * core * .9;
  col += vec3(.15, .25, .9) * (1. - smoothstep(.0, .12, y)) * body * .5;       // the blue root of the flame
  gl_FragColor = vec4(col * (body * .9 + core * .5), 1.);
}`
  });
  function addFlame(p, size) { FLAMES.push({ p: p.clone(), size: size || 0.07, seed: Math.random() }); }
  function flames() {
    if (flameMesh) return flameMesh;
    const base = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0), g = new THREE.InstancedBufferGeometry();
    g.index = base.index; g.setAttribute("position", base.attributes.position); g.setAttribute("uv", base.attributes.uv);
    g.setAttribute("iPos", new THREE.InstancedBufferAttribute(new Float32Array(FLAMES.flatMap((f) => [f.p.x, f.p.y, f.p.z])), 3));
    g.setAttribute("iData", new THREE.InstancedBufferAttribute(new Float32Array(FLAMES.flatMap((f) => [f.size, f.seed])), 2));
    g.instanceCount = FLAMES.length;
    flameMesh = new THREE.Mesh(g, flameMat); flameMesh.frustumCulled = false; flameMesh.renderOrder = 5;
    return flameMesh;
  }

  // ---------------------------------------------------------------- light painted once on floor and wall
  let glowTex = null;
  function poolTex() {
    if (glowTex) return glowTex;
    const c = canvas(128, 128), g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,205,150,.85)"); r.addColorStop(0.4, "rgba(255,180,120,.3)"); r.addColorStop(1, "rgba(255,150,90,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128); glowTex = tex(c, true, false); return glowTex;
  }
  const poolMat = new THREE.MeshBasicMaterial({ map: null, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.26, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  // quads: { x, y, z, r, nx, ny, nz } (n = the surface's normal)
  function pools(list) {
    poolMat.map = poolTex();
    const geos = list.map((q) => {
      const g = new THREE.PlaneGeometry(q.r * 2, q.r * 2);
      if (q.ny) g.rotateX(-Math.PI / 2); else g.rotateY(Math.atan2(q.nx || 0, q.nz || 0));
      g.translate(q.x + (q.nx || 0) * 0.015, q.y + (q.ny || 0) * 0.006, q.z + (q.nz || 0) * 0.015); return g;
    });
    const m = new THREE.Mesh(o.merge(geos), poolMat); m.matrixAutoUpdate = false; m.renderOrder = 2; return m;
  }

  // ---------------------------------------------------------------- per-area decoration
  // corridor: { slug, side, zk, xa, xb, corW, gapsN, gapsS, hole, len }
  // room: { id, frame (W, f), hole }
  function decorate(area, info) {
    const st = STYLE[area]; if (!st) return null;
    const out = { group: new THREE.Group(), lamps: [], segs: [] }, L = [], P = [];
    if (st.kerb && info.hole) out.group.add(kerb(info.hole, st.kerb));
    if (st.fittings === "bronze-corridor") {
      const { side: s, zk, corW, len } = info, wallY = 2.3;
      for (const [north, gaps] of [[true, info.gapsN], [false, info.gapsS]]) {
        const zw = zk + (north ? -corW / 2 : corW / 2), nz = north ? 1 : -1, segs = wallSegments(gaps, len);
        for (const [a, b] of segs) {
          const n = Math.max(1, Math.round((b - a) / 9));
          for (let k = 0; k < n; k++) {
            const along = a + (b - a) * (k + 0.5) / n, x = s * (4 + along);
            const fl = niche(L, x, wallY, zw, 0, nz);
            addFlame(fl, 0.055); out.lamps.push({ p: fl.clone().add(new THREE.Vector3(0, 0.12, nz * 0.32)), s: 0.5 });
            P.push({ x, y: 0, z: zw + nz * 0.9, r: 1.5, ny: 1 }, { x, y: wallY + 0.45, z: zw, r: 0.95, nz });
          }
        }
      }
      // braziers at the corridor's two ends
      for (const along of [1.2, len - 1.0]) for (const dz of [-1.35, 1.35]) {
        if (along < 2 && Math.abs(dz) > 0) { /* by the spine door: keep the doorway clear */ }
        const x = s * (4 + along), z = zk + dz, fl = brazier(L, x, z, 0.92);
        addFlame(fl, 0.13); addFlame(fl.clone().add(new THREE.Vector3(0.07, 0, 0.03)), 0.09); addFlame(fl.clone().add(new THREE.Vector3(-0.06, 0, -0.04)), 0.1);
        out.lamps.push({ p: fl.clone().add(new THREE.Vector3(0, 0.25, 0)), s: 0.85 });
        P.push({ x, y: 0, z, r: 1.9, ny: 1 });
        out.segs.push([x, z, 0.3]);
      }
    }
    if (st.fittings === "bronze-room") {
      const { W, f } = info, sill = 3.45;          // well above the Pantheon medallions (their tops are at 2.66 m)
      // niche lamps on the side walls, between the Pantheon medallions
      for (const side of [-1, 1]) for (const v of [4.6, 7.0, 9.4, 11.8]) {
        const [x, z] = W(f, side * 6.5, v), nx = -side * f.rx, nz = -side * f.rz;
        const fl = niche(L, x, sill, z, nx, nz);
        addFlame(fl, 0.055); out.lamps.push({ p: fl.clone().add(new THREE.Vector3(nx * 0.32, 0.12, nz * 0.32)), s: 0.5 });
        P.push({ x, y: sill + 0.45, z, r: 0.95, nx, nz }, { x: x + nx * 0.8, y: 0, z: z + nz * 0.8, r: 1.3, ny: 1 });
      }
      // a brazier in each corner
      for (const [u, v] of [[-5.85, 0.75], [5.85, 0.75], [-5.85, 13.25], [5.85, 13.25]]) {
        const [x, z] = W(f, u, v), fl = brazier(L, x, z, 1);
        addFlame(fl, 0.14); addFlame(fl.clone().add(new THREE.Vector3(0.08, 0, 0.02)), 0.1); addFlame(fl.clone().add(new THREE.Vector3(-0.06, 0, -0.05)), 0.11);
        out.lamps.push({ p: fl.clone().add(new THREE.Vector3(0, 0.25, 0)), s: 0.9 });
        P.push({ x, y: 0, z, r: 2.1, ny: 1 });
        out.segs.push([x, z, 0.3]);
      }
    }
    // merge the fittings by material: a handful of draw calls per area
    const byMat = new Map(); for (const [g, m] of L) { if (!byMat.has(m)) byMat.set(m, []); byMat.get(m).push(g); }
    for (const [m, list] of byMat) { const mesh = new THREE.Mesh(o.merge(list.map((g) => g.index ? g : g.toNonIndexed())), m); mesh.matrixAutoUpdate = false; out.group.add(mesh); }
    if (P.length) out.group.add(pools(P));
    if (st.symbols) { const sw = symbolWall(st.symbols, info); if (sw) out.group.add(sw); }
    return out;
  }
  // the stretches of a corridor wall between its door gaps (distances from the spine wall)
  function wallSegments(gaps, len) {
    const out = []; let a = 0.4;
    for (const [g0, g1] of gaps.slice().sort((p, q) => p[0] - q[0])) { if (g0 - a > 1.2) out.push([a, g0]); a = g1; }
    if (len - 0.3 - a > 1.2) out.push([a, len - 0.3]);
    return out;
  }

  // ---------------------------------------------------------------- the symbol wall
  const SYM = {};             // set name → { tex, data } once loaded
  const symU = [];            // every symbol material's uniforms, for the clock
  function loadSymbols(name) {
    if (SYM[name]) return SYM[name];
    const S = SYM[name] = { tex: null, data: null, mats: [] };
    fetch(`museum/symbols/${name}.json?v=1`).then((r) => r.json()).then((d) => {
      S.data = d;
      new THREE.TextureLoader().load(`museum/symbols/${name}.webp?v=1`, (t) => {
        t.colorSpace = THREE.NoColorSpace; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; S.tex = t;
        for (const m of S.mats) fill(m, S); if (o.onReady) o.onReady();
      });
    }).catch(() => {});
    return S;
  }
  function fill(m, S) {
    const d = S.data, U = m.uniforms; U.uAtlas.value = S.tex; U.uGrid.value.set(d.cols, d.rows);
    d.sets.slice(0, 4).forEach((s, i) => U.uSets.value[i].set(s.start, s.len)); U.uN.value = Math.min(4, d.sets.length); m.visible = true;
  }
  // the hallway's symbol wall: drips of glowing signs that fall from the ceiling toward the floor at uneven intervals,
  // each sign flipping to another as it goes (Carter's reference, 2026-10-06). So that a column can never spell a word
  // or a name, the scripts alternate row by row: no two signs of one script ever stand together.
  function symbolWall(name, info) {
    const { side: s, zk, corW, len } = info, pos = [], uv = [], dat = [], idx = [];
    const y0 = 0.98, y1 = (info.ceil || 4.6) - 0.05, H = y1 - y0, clear = 0.5;
    for (const [north, gaps] of [[true, info.gapsN], [false, info.gapsS]]) {
      const zw = zk + (north ? -corW / 2 : corW / 2) + (north ? 0.012 : -0.012), segs = wallSegments(gaps, len);
      for (const [a, b] of segs) {
        // the niches sit at the centres of n equal parts: panels run between them (clear of the door signs too)
        const n = Math.max(1, Math.round((b - a) / 9)), cuts = [a + 0.5];
        for (let k = 0; k < n; k++) { const c = a + (b - a) * (k + 0.5) / n; cuts.push(c - 0.23 - clear, c + 0.23 + clear); }
        cuts.push(b - 0.5);
        for (let k = 0; k < cuts.length; k += 2) {
          const u0 = cuts[k], u1 = cuts[k + 1]; if (u1 - u0 < 0.6) continue;
          const xa = s * (4 + u0), xb = s * (4 + u1), base = pos.length / 3, L = u1 - u0, seed = Math.random() * 100;
          pos.push(xa, y0, zw, xb, y0, zw, xb, y1, zw, xa, y1, zw);
          uv.push(0, 0, L, 0, L, H, 0, H);
          for (let i = 0; i < 4; i++) dat.push(L, H, seed);
          idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
      }
    }
    if (!idx.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute("aDat", new THREE.Float32BufferAttribute(dat, 3)); g.setIndex(idx);
    const U = { uTime: { value: 0 }, uAtlas: { value: null }, uGrid: { value: new THREE.Vector2(1, 1) }, uSets: { value: [0, 1, 2, 3].map(() => new THREE.Vector2(0, 1)) }, uN: { value: 1 }, uStrength: { value: 0.85 } };
    const m = new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: `attribute vec3 aDat; varying vec2 vUv; varying vec3 vDat; void main(){ vUv = uv; vDat = aDat; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: `
uniform float uTime, uN, uStrength; uniform sampler2D uAtlas; uniform vec2 uGrid; uniform vec2 uSets[4];
varying vec2 vUv; varying vec3 vDat;
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
vec2 setOf(float i){ return i < .5 ? uSets[0] : i < 1.5 ? uSets[1] : i < 2.5 ? uSets[2] : uSets[3]; }
void main(){
  const float colW = .3, cellH = .29, gs = .24;            // column pitch, row pitch, sign size (metres)
  float L = vDat.x, H = vDat.y;
  float ci = floor(vUv.x / colW), fx = vUv.x - ci * colW;
  float sd = hash(vec2(ci, vDat.z));
  // the signs themselves stream down the wall: each column slides from the ceiling toward the floor at its own speed
  float sd2 = hash(vec2(vDat.z + 1.3, ci * .7)), speed = .9 + sd2 * 2.6;              // rows per second, uneven from column to column
  float s = (H - vUv.y) / cellH + sd * 40. - uTime * speed, ri = floor(s), fy = s - ri;
  // the lit runs travel with the signs: runs of uneven length with uneven gaps, the leading (lowest) sign brightest
  float blk = floor(s / 24.), bh = hash(vec2(blk, ci + vDat.z)), run = 5. + bh * 15.;
  float st = hash(vec2(blk + .37, ci * 1.9 + vDat.z)) * (24. - run), loc = s - blk * 24. - st;
  float lum = .07, headNear = 0.;
  if (bh > .18 && loc >= 0. && loc < run + 1.) {
    float k = clamp(loc / run, 0., 1.);
    float hd = 1. - smoothstep(0., 1.2, abs(loc - run));
    lum = max(lum, k * k * .85 + hd * 1.2); headNear = hd;
  }
  // each sign flips to another of its script at its own uneven rate; the leading sign flips fastest
  float sIdx = mod(ri + floor(sd * 4.), uN);
  vec2 set = setOf(sIdx);
  float cr = hash(vec2(ci * 7.13 + ri, vDat.z + 3.)), rate = (.2 + cr * 1.3) * (1. + headNear * 7.);
  float tick = floor(uTime * rate + cr * 17.);
  float cell = set.x + floor(hash(vec2(tick + cr * 9., ci * 13. + ri * 1.7 + vDat.z)) * set.y);
  vec2 lc = vec2((fx - (colW - gs) * .5) / gs, (fy * cellH - (cellH - gs) * .5) / gs);   // 0..1 inside the sign, y down
  vec2 cl = clamp(lc, 0., 1.), cxy = vec2(mod(cell, uGrid.x), floor(cell / uGrid.x));
  vec2 inCell = vec2(cl.x, 1. - cl.y) * .96 + .02, auv = (cxy + inCell) / uGrid; auv.y = 1. - auv.y;
  // sample with the derivatives of the position inside the sign, not of the wrapped atlas position
  vec2 gx = dFdx(inCell) / uGrid, gy = dFdy(inCell) / uGrid; gx.y = -gx.y; gy.y = -gy.y;
  // how many signs one pixel covers: far off and at a slant, the halo and fine detail fade rather than sparkle
  float px = max(length(dFdx(vUv)), length(dFdy(vUv))) / gs, far = 1. - smoothstep(.06, .22, px);
  float inside = step(0., lc.x) * step(lc.x, 1.) * step(0., lc.y) * step(lc.y, 1.);
  float a = textureGrad(uAtlas, auv, gx * 1.6, gy * 1.6).a * inside;   // a touch soft: smooth strokes, no sparkle
  float od = length(lc - cl);
  float glow = textureGrad(uAtlas, auv, gx * 4., gy * 4.).a * exp(-od * 7.) * far;   // the soft halo (near only)
  float fade = smoothstep(0., .25, vUv.x) * smoothstep(0., .25, L - vUv.x) * smoothstep(0., .45, vUv.y) * smoothstep(0., .05, H - vUv.y);
  vec3 c = vec3(.93, .96, 1.) * (a * lum * mix(.35, 1., far) + glow * min(lum, 1.) * .55) * fade * uStrength;
  gl_FragColor = vec4(c, 1.);
}`
    });
    m.visible = false;
    const S = loadSymbols(name); S.mats.push(m); if (S.tex) fill(m, S);
    symU.push(U);
    const mesh = new THREE.Mesh(g, m); mesh.matrixAutoUpdate = false; mesh.renderOrder = 3;
    return mesh;
  }

  // the clock: flames and symbol walls (held still under "reduce motion")
  let t = 0;
  function update(dt, reduce) {
    if (reduce) return false;
    t += dt; flameU.uTime.value = t; for (const U of symU) U.uTime.value = t;
    return FLAMES.length > 0;
  }
  // for the screenshot tools: set the clock directly
  function setTime(v) { t = v; flameU.uTime.value = t; for (const U of symU) U.uTime.value = t; }
  return { floorMat, decorate, flames, update, setTime, get flameCount() { return FLAMES.length; } };
}
