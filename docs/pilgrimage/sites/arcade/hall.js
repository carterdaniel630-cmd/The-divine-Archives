/* ==========================================================================
   The Archive Arcade — the hall (the site's one section)

   A round hall 16 m across, built of the archive's own parts:
   - floor: nine wedges, one per era, each in a period floor drawn by the
     museum's floor atlas (docs/museum/style.js, imported read-only); the
     cabinets stand on small platforms in their chapters' floors;
   - walls: short curved panels of the museum's three symbol-wall atlases
     (docs/museum/symbols/{bronze,iron,axial}), falling as in the hallways,
     with no gold signs; the shader is a copy of style.js's symbolWall;
   - light: one of each flame fitting (saucer lamp, terracotta lamp, lampstand,
     brazier; geometry after style.js), flames in one instanced draw call.
     Only three are real lights (the engine's light pool); the rest is painted;
   - a starfield dome, a small pool with a gentle shimmer;
   - twelve cabinets in a ring facing the centre, the scoreboard on the north
     wall and the golden portal back to the museum in the south.

   Phone budget: every plain surface (cabinets, fittings, trims, kerbs) is one
   merged mesh with a palette texture; all twelve screens share one shader in
   one mesh, all marquees one texture in one mesh. Test hook: window.__ARCADE.
   ========================================================================== */
import * as THREE from "three";
import { GAMES, R_HALL, R_CAB, R_POOL, cabPos, bestOf } from "./site.js?v=1";
import { createStyle } from "../../../museum/style.js?v=14";
import { sign } from "../../parts.js?v=1";

const TAU = Math.PI * 2, RAD = Math.PI / 180;
const WALL_H = 4.6, POOL_IN = 1.6, KERB_H = 0.32, WATER_Y = 0.2;
const ERA_FLOORS = ["rammedearth", "brick", "ashlar", "marble", "tessellated", "oak", "limestone", "cedar", "greytile"];
// each setting: the floor atlas's cell and a tint, or (palette) a plain colour
const SETTINGS = {
  limestone: { kind: "limestone" }, mudbrick: { kind: "brick", tint: [0.86, 0.74, 0.6] }, brick: { kind: "brick" }, ashlar: { kind: "ashlar" },
  tessellated: { kind: "tessellated" }, marble: { kind: "marble" }, oak: { kind: "oak" }, night: { kind: "greytile", tint: [0.34, 0.4, 0.68] },
  plain: { pal: "plain" }, basalt: { pal: "basalt", h: 0.1 }
};
// how each cabinet's attract screen moves: 0 board, 1 stack, 2 grid, 3 volley, 4 trail, 5 maze, 6 stars, 7 quiz
const SCREEN = { chess: 0, ziggurat: 1, minesweeper: 2, pong: 3, fighter: 3, risk: 2, reliquary: 7, pacman: 5, ouroboros: 4, seeker: 4, treasure: 5, pinball: 6 };

// ---------------------------------------------------------------- the palette: one material for every plain surface
const PAL = { body: "#24170f", trim: "#c79a54", panel: "#121010", red: "#b0402a", blue: "#2f5f9a", clay: "#9c6a44", bronze: "#6a4826", terracotta: "#a85a36",
  dark: "#1a120c", kerb: "#bfae8a", basalt: "#2b2a28", brass: "#b08a3a", leaf: "#2f4a2a", leaf2: "#43602f", plain: "#6b5a48", ash: "#2a1810", marble: "#d8d2c8", bezel: "#060606" };
const PK = Object.keys(PAL);
function paletteMaterial() {
  const c = document.createElement("canvas"); c.width = PK.length; c.height = 1; const g = c.getContext("2d");
  PK.forEach((k, i) => { g.fillStyle = PAL[k]; g.fillRect(i, 0, 1, 1); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  return new THREE.MeshLambertMaterial({ map: t });
}
class Merge {
  constructor() { this.pos = []; this.nrm = []; this.uv = []; }
  add(geo, sw, m4) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (m4) g.applyMatrix4(m4);
    if (!g.attributes.normal) g.computeVertexNormals();
    const p = g.attributes.position, n = g.attributes.normal, u = (PK.indexOf(sw) + 0.5) / PK.length;
    for (let i = 0; i < p.count; i++) { this.pos.push(p.getX(i), p.getY(i), p.getZ(i)); this.nrm.push(n.getX(i), n.getY(i), n.getZ(i)); this.uv.push(u, 0.5); }
    g.dispose(); geo.dispose();
  }
  mesh(mat) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(this.nrm, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(this.uv, 2));
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, mat); m.matrixAutoUpdate = false; return m;
  }
}
const M4 = (x, y, z, ry, rx) => { const m = new THREE.Matrix4().makeRotationY(ry || 0); if (rx) m.multiply(new THREE.Matrix4().makeRotationX(rx)); m.setPosition(x, y, z); return m; };
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// ---------------------------------------------------------------- the clock (flames, screens, signs, water, stars)
const U = { uTime: { value: 0 } };
let reduce = false, reduceT = 0;
function readReduce() {
  try { const v = window.localStorage.getItem("pg-rm"); if (v != null) return v === "1"; } catch (e) { /* storage blocked */ }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function build(ctx) {
  const G = ctx.group, style = createStyle({ touch: ctx.touch });
  const pal = paletteMaterial(), P = new Merge();
  const anchors = [];

  // ---------------------------------------------------------------- the floor: nine era wedges and the cabinets' platforms (one draw call)
  const kinds = ERA_FLOORS.slice();
  const { material: floorMat, cell } = style.floorAtlas(kinds);
  floorMat.vertexColors = true;
  const F = { pos: [], nrm: [], uv: [], cell: [], col: [] };
  const fTri = (a, b, c, ck, tint) => {
    const ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    const pts = ny < 0 ? [a, c, b] : [a, b, c], cc = cell[ck], t = tint || [1, 1, 1];
    for (const p of pts) { F.pos.push(p[0], p[1], p[2]); F.nrm.push(0, 1, 0); F.uv.push(p[0] / 2, p[2] / 2); F.cell.push(...cc); F.col.push(...t); }
  };
  const polar = (deg, r, y) => [Math.sin(deg * RAD) * r, y || 0, -Math.cos(deg * RAD) * r];
  ERA_FLOORS.forEach((k, i) => {
    const a0 = i * 40 - 20, n = 10, rings = [R_POOL, 3.5, 5.0, 6.5, R_HALL + 0.05];
    for (let s = 0; s < n; s++) for (let q = 0; q < rings.length - 1; q++) {
      const da = a0 + 40 * s / n, db = a0 + 40 * (s + 1) / n;
      const A = polar(da, rings[q]), B = polar(db, rings[q]), C = polar(db, rings[q + 1]), D = polar(da, rings[q + 1]);
      fTri(A, B, C, k); fTri(A, C, D, k);
    }
    // a thin gold line between eras
    const dv = new THREE.BoxGeometry(0.035, 0.01, R_HALL - R_POOL); P.add(dv, "trim", M4(...polar(a0, (R_HALL + R_POOL) / 2, 0.004), -a0 * RAD));
  });
  // the cabinets' platforms: a piece of each chapter's floor (or plain stone) under the cabinet
  const cabY = {};
  for (const g of GAMES) {
    const st = SETTINGS[g.setting], h = st.h || 0.05, a = g.deg * RAD, ry = -a;
    const r0 = 5.35, r1 = 6.85, w = 1.6, rc = (r0 + r1) / 2, c = cabPos(g, rc);
    cabY[g.id] = h;
    const m = M4(c.x, 0, c.z, ry), corner = (u, v) => new THREE.Vector3(u, h, v).applyMatrix4(m).toArray();
    const hl = (r1 - r0) / 2;
    if (st.kind) { const A = corner(-w / 2, -hl), B = corner(w / 2, -hl), C = corner(w / 2, hl), D = corner(-w / 2, hl); fTri(A, B, C, st.kind, st.tint); fTri(A, C, D, st.kind, st.tint); }
    else P.add(box(w, 0.002, r1 - r0), st.pal, M4(c.x, h, c.z, ry));
    // its sides, and a bevel of the kerb stone round the top
    P.add(box(w + 0.04, h - 0.006, r1 - r0 + 0.04), st.pal === "basalt" ? "basalt" : "kerb", M4(c.x, (h - 0.006) / 2, c.z, ry));
  }
  const fg = new THREE.BufferGeometry();
  fg.setAttribute("position", new THREE.Float32BufferAttribute(F.pos, 3)); fg.setAttribute("normal", new THREE.Float32BufferAttribute(F.nrm, 3));
  fg.setAttribute("uv", new THREE.Float32BufferAttribute(F.uv, 2)); fg.setAttribute("aCell", new THREE.Float32BufferAttribute(F.cell, 4)); fg.setAttribute("color", new THREE.Float32BufferAttribute(F.col, 3));
  fg.computeBoundingSphere();
  const floor = new THREE.Mesh(fg, floorMat); floor.userData.floor = true; floor.matrixAutoUpdate = false; G.add(floor);

  // ---------------------------------------------------------------- the wall (a stone drum) and its gold rings
  {
    const n = 72, pos = [], uv = [], nrm = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const a = i / n * TAU, x = Math.sin(a) * R_HALL, z = -Math.cos(a) * R_HALL, u = a * R_HALL;
      pos.push(x, 0, z, x, WALL_H, z); nrm.push(-x / R_HALL, 0, -z / R_HALL, -x / R_HALL, 0, -z / R_HALL); uv.push(u, 0, u, WALL_H);
      if (i < n) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    const wall = new THREE.Mesh(g, ctx.mat("gallery", { color: new THREE.Color("#8f7f6a") })); wall.userData.wall = true; wall.matrixAutoUpdate = false; G.add(wall);
    for (const [y, tube] of [[0.95, 0.018], [WALL_H, 0.07], [0.04, 0.035]]) { const t = new THREE.TorusGeometry(R_HALL - 0.03, tube, 4, 72); t.rotateX(Math.PI / 2); t.translate(0, y, 0); P.add(t, "trim"); }
  }

  // ---------------------------------------------------------------- the dome: a plain starfield
  {
    const g = new THREE.SphereGeometry(R_HALL, 40, 12, 0, TAU, 0, Math.PI / 2); g.translate(0, WALL_H, 0);
    const m = new THREE.ShaderMaterial({
      uniforms: U, side: THREE.BackSide, depthWrite: true,
      vertexShader: `varying vec3 vDir; void main(){ vDir = position - vec3(0., ${WALL_H.toFixed(2)}, 0.); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: `
uniform float uTime; varying vec3 vDir;
float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float layer(vec3 d, float sc, float th, float seed){
  vec3 p = d * sc, c = floor(p), f = fract(p) - .5;
  float h = h3(c + seed); if (h < th) return 0.;
  vec3 o = vec3(h3(c + 1.3 + seed), h3(c + 2.7 + seed), h3(c + 5.1 + seed)) - .5;
  float dist = length(f - o * .5), tw = .75 + .25 * sin(uTime * (.6 + h * 2.) + h * 60.);
  return smoothstep(.16, .02, dist) * (h - th) / (1. - th) * tw;
}
void main(){
  vec3 d = normalize(vDir);
  vec3 col = mix(vec3(.05, .045, .08), vec3(.012, .016, .04), smoothstep(0., .8, d.y));
  float band = exp(-pow(dot(d, normalize(vec3(.35, .25, .9))), 2.) * 18.);
  col += vec3(.07, .065, .09) * band * (.6 + .4 * h3(floor(d * 90.)));
  float s = layer(d, 60., .9, 0.) * 1.4 + layer(d, 130., .93, 9.) * .8 + layer(d, 26., .985, 4.) * 2.2;
  col += vec3(1., .95, .85) * s;
  gl_FragColor = vec4(col, 1.);
}`
    });
    const dome = new THREE.Mesh(g, m); dome.matrixAutoUpdate = false; G.add(dome);
  }

  // ---------------------------------------------------------------- the symbol panels (three atlases, three draw calls)
  const SYM = [["bronze", [45, 225]], ["iron", [90, 270]], ["axial", [135, 315]]];
  const symMats = [];
  await Promise.all(SYM.map(async ([name, bearings]) => {
    const m = symbolMaterial(); symMats.push(m);
    const pos = [], uv = [], dat = [], idx = [], y0 = 0.98, y1 = WALL_H - 0.12, H = y1 - y0, r = R_HALL - 0.02, span = 30, n = 10;
    for (const b of bearings) {
      const seed = Math.random() * 100, L = span * RAD * r, base = pos.length / 3;
      for (let i = 0; i <= n; i++) {
        const a = (b - span / 2 + span * i / n) * RAD, x = Math.sin(a) * r, z = -Math.cos(a) * r, u = L * i / n;
        pos.push(x, y0, z, x, y1, z); uv.push(u, 0, u, H); dat.push(L, H, seed, L, H, seed);
        if (i < n) { const k = base + i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute("aDat", new THREE.Float32BufferAttribute(dat, 3)); g.setIndex(idx);
    const mesh = new THREE.Mesh(g, m); mesh.matrixAutoUpdate = false; mesh.renderOrder = 3; mesh.visible = false; G.add(mesh);
    try {
      const d = await (await fetch(new URL(`../../../museum/symbols/${name}.json?v=1`, import.meta.url))).json();
      const t = await new THREE.TextureLoader().loadAsync(new URL(`../../../museum/symbols/${name}.webp?v=1`, import.meta.url).href);
      t.colorSpace = THREE.NoColorSpace; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4;
      const u = m.uniforms; u.uAtlas.value = t; u.uGrid.value.set(d.cols, d.rows);
      d.sets.slice(0, 4).forEach((s, i) => u.uSets.value[i].set(s.start, s.len)); u.uN.value = Math.min(4, d.sets.length);
      mesh.visible = true;
    } catch (e) { console.warn("arcade: symbol wall " + name + " not loaded", e); }
  }));

  // ---------------------------------------------------------------- flames and the light painted round them
  const FL = [], glows = [];
  const flame = (p, size) => FL.push({ p, size, seed: Math.random() });
  const glow = (x, y, z, r, col, nx, nz) => glows.push({ x, y, z, r, col, nx, nz });
  const light = (p, s) => { const a = ctx.light(p.x, p.y + 0.2, p.z, s); anchors.push({ a, s }); };
  const tangent = (g) => ({ x: Math.cos(g.deg * RAD), z: Math.sin(g.deg * RAD) });
  const beside = (g, side, r) => { const c = cabPos(g, r || 5.75), t = tangent(g); return { x: c.x + t.x * side, z: c.z + t.z * side }; };
  for (const g of GAMES) {
    const h = cabY[g.id];
    if (g.prop === "saucer") {                          // ch02: a stand of limestone with a clay saucer lamp
      const p = beside(g, 0.62), ry = -g.deg * RAD;
      P.add(box(0.26, 0.86, 0.26), "kerb", M4(p.x, h + 0.43, p.z, ry));
      const wick = saucerLamp(P, p.x, h + 0.86, p.z, ry + Math.PI / 2); flame(wick, 0.055); light(wick, 0.55);
      glow(p.x, 0.012 + h, p.z, 1.3, [1, 0.7, 0.45]);
    } else if (g.prop === "terracotta") {               // ch22: a marble stand with a Roman-type terracotta lamp (glow only)
      const p = beside(g, -0.62), ry = -g.deg * RAD;
      P.add(box(0.26, 0.86, 0.26), "marble", M4(p.x, h + 0.43, p.z, ry));
      const wick = terracottaLamp(P, p.x, h + 0.86, p.z, ry + Math.PI); flame(wick, 0.05);
      glow(p.x, 0.012 + h, p.z, 1.2, [1, 0.7, 0.45]);
    } else if (g.prop === "brazier") {                  // ch08: a bronze tripod brazier
      const p = beside(g, 0.68);
      const fl = brazier(P, p.x, h, p.z, 0.92); flame(fl, 0.13); flame(fl.clone().add(new THREE.Vector3(0.07, 0, 0.03)), 0.09); flame(fl.clone().add(new THREE.Vector3(-0.06, 0, -0.04)), 0.1);
      light(fl, 0.85); glow(p.x, 0.012 + h, p.z, 1.9, [1, 0.62, 0.35]);
    } else if (g.prop === "glow") {                     // ch06: a fire's warm light on the floor, without the altar
      const p = cabPos(g, 5.7); glow(p.x, 0.012 + h, p.z, 1.1, [1, 0.45, 0.15]); glow(p.x, 0.013 + h, p.z, 0.55, [1, 0.6, 0.3]);
    } else if (g.prop === "bricks") {                   // ch03: a few mud bricks stacked by the cabinet
      const p = beside(g, 0.6), ry = -g.deg * RAD;
      for (let k = 0; k < 3; k++) P.add(box(0.36, 0.09, 0.18), "plain", M4(p.x, h + 0.045 + k * 0.09, p.z, ry + (k % 2) * 0.25));
    } else if (g.prop === "jungle") {                   // ch29: a screen of green behind the cabinet
      for (let k = 0; k < 7; k++) {
        const p = beside(g, -0.7 + k * 0.23, 6.62), s = 0.22 + (k % 3) * 0.08, ic = new THREE.IcosahedronGeometry(s, 0); ic.scale(1, 1.6 + (k % 2) * 0.6, 1);
        P.add(ic, k % 2 ? "leaf" : "leaf2", M4(p.x, h + 0.35 + (k % 2) * 0.25, p.z, k));
      }
    } else if (g.prop === "brass") {                    // ch37: a plain brass ring on a post (no emblem)
      const p = beside(g, 0.62), ry = -g.deg * RAD;
      P.add(new THREE.CylinderGeometry(0.02, 0.03, 1.1, 6), "brass", M4(p.x, h + 0.55, p.z, 0));
      P.add(new THREE.TorusGeometry(0.17, 0.025, 6, 20), "brass", M4(p.x, h + 1.28, p.z, ry));
    }
  }
  // the lampstand on the west side, between two cabinets, so the three real lights are spread round the hall
  { const a = 270 * RAD, x = Math.sin(a) * 7.2, z = -Math.cos(a) * 7.2, wick = lampstand(P, x, z, Math.PI / 2); flame(wick, 0.05); light(wick, 0.7); glow(x, 0.012, z, 1.4, [1, 0.7, 0.45]); glow(x * 1.1, 1.6, z * 1.1, 1.0, [1, 0.7, 0.45], -x / 7.2, -z / 7.2); }
  // a soft fill, so the far side of the hall is never black (not a flame: the flames' own light is the pool above)
  const fill = new THREE.HemisphereLight("#7a6a8a", "#3a2614", 0.55); G.add(fill);

  // ---------------------------------------------------------------- the pool
  {
    const n = 48, wall = (r, y0, y1, inward) => { const g = new THREE.CylinderGeometry(r, r, y1 - y0, n, 1, true); g.translate(0, (y0 + y1) / 2, 0); if (inward) { g.scale(-1, 1, 1); } return g; };
    P.add(wall(R_POOL, 0, KERB_H), "kerb");
    P.add(wall(POOL_IN, WATER_Y - 0.05, KERB_H, true), "kerb");
    const top = new THREE.RingGeometry(POOL_IN, R_POOL, n, 1); top.rotateX(-Math.PI / 2); top.translate(0, KERB_H, 0); P.add(top, "kerb");
    const rim = new THREE.TorusGeometry(R_POOL, 0.018, 4, n); rim.rotateX(Math.PI / 2); rim.translate(0, KERB_H, 0); P.add(rim, "trim");
    const wg = new THREE.CircleGeometry(POOL_IN, 40); wg.rotateX(-Math.PI / 2); wg.translate(0, WATER_Y, 0);
    const water = new THREE.Mesh(wg, new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: `varying vec2 vP; void main(){ vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: `
uniform float uTime; varying vec2 vP;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  float t = uTime, r = length(vP) / ${POOL_IN.toFixed(2)};
  vec2 p = vP * 2.4;
  float w1 = sin(p.x * 3.1 + t * .9 + sin(p.y * 2.2 + t * .6) * 1.6) * .5 + .5;
  float w2 = sin(p.y * 3.6 - t * .75 + sin(p.x * 2.5 - t * .5) * 1.4) * .5 + .5;
  float caust = pow(w1 * w2, 5.) * 1.1;
  vec3 col = mix(vec3(.05, .15, .16), vec3(.015, .05, .07), r * r) + vec3(.45, .65, .62) * caust * .35;
  // the dome's stars, broken by the ripples
  vec2 sp = vP * 14. + vec2(w1, w2) * .6; vec2 c = floor(sp), f = fract(sp) - .5;
  float st = step(.96, h(c)) * smoothstep(.22, .05, length(f)) * (.6 + .4 * sin(t * 2. + h(c) * 30.));
  col += vec3(.8, .8, .75) * st * .5;
  col += vec3(1., .62, .3) * .05 * (1. - r);
  col *= 1. - smoothstep(.9, 1., r) * .5;
  gl_FragColor = vec4(col, 1.);
}`
    }));
    water.matrixAutoUpdate = false; G.add(water);
  }

  // ---------------------------------------------------------------- the cabinets: bodies (palette), screens (one shader), marquees (one atlas)
  const scr = { pos: [], uv: [], dat: [], idx: [] }, mq = { pos: [], uv: [], idx: [] };
  const quad = (Q, m4, w, h, x, y, z, uvs, extra) => {
    const base = Q.pos.length / 3;
    for (const [u, v] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const p = new THREE.Vector3(x + u * w / 2, y + v * h / 2, z).applyMatrix4(m4); Q.pos.push(p.x, p.y, p.z); if (extra) Q.dat.push(...extra); }
    Q.uv.push(...uvs); Q.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitGeo = box(0.86, 2.2, 0.8);
  GAMES.forEach((g, i) => {
    const c = cabPos(g, R_CAB), ry = -g.deg * RAD, m = M4(c.x, cabY[g.id], c.z, ry), at = (x, y, z, rx) => { const q = M4(x, y, z, 0, rx); return m.clone().multiply(q); };
    // body: plinth, cabinet, upper housing, marquee box, control deck, trims and controls
    P.add(box(0.78, 0.08, 0.66), "panel", at(0, 0.04, 0));
    P.add(box(0.74, 1.0, 0.62), "body", at(0, 0.54, 0));
    P.add(box(0.74, 0.82, 0.36), "body", at(0, 1.45, -0.13));
    P.add(box(0.78, 0.26, 0.32), "body", at(0, 1.98, -0.02));
    P.add(box(0.74, 0.07, 0.34), "panel", at(0, 1.07, 0.19, 0.2));
    P.add(box(0.62, 0.48, 0.01), "bezel", at(0, 1.45, 0.052));
    for (const sx of [-1, 1]) { P.add(box(0.025, 1.98, 0.025), "trim", at(sx * 0.38, 1.03, 0.05 + (sx > 0 ? 0 : 0))); P.add(box(0.03, 2.1, 0.66), "body", at(sx * 0.385, 1.05, -0.0)); }
    P.add(box(0.8, 0.025, 0.34), "trim", at(0, 2.12, -0.02)); P.add(box(0.8, 0.025, 0.34), "trim", at(0, 1.85, -0.02));
    P.add(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6), "panel", at(-0.17, 1.15, 0.2, 0.2)); P.add(new THREE.SphereGeometry(0.03, 8, 6), "red", at(-0.17, 1.2, 0.21));
    P.add(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 10), i % 2 ? "blue" : "red", at(0.06, 1.11, 0.2, 0.2)); P.add(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 10), i % 2 ? "red" : "blue", at(0.16, 1.11, 0.24, 0.2));
    // the screen and the marquee
    quad(scr, m, 0.56, 0.42, 0, 1.45, 0.06, [0, 0, 1, 0, 1, 1, 0, 1], [i, SCREEN[g.id]]);
    const col = i % 2, row = Math.floor(i / 2), u0 = col / 2, u1 = u0 + 0.5, v1 = 1 - row / 6, v0 = 1 - (row + 1) / 6;
    quad(mq, m, 0.74, 0.22, 0, 1.985, 0.141, [u0, v0, u1, v0, u1, v1, u0, v1]);
    // light from the screen on the floor in front
    const f = cabPos(g, R_CAB - 0.9); glows.push({ x: f.x, y: cabY[g.id] + 0.014, z: f.z, r: 0.9, col: screenTint(i) });
    // the tap target
    const hb = new THREE.Mesh(hitGeo, hitMat); hb.applyMatrix4(at(0, 1.1, 0)); G.add(hb); ctx.hit(hb, ctx.infoById("cab-" + g.id));
  });
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.Float32BufferAttribute(scr.pos, 3)); sg.setAttribute("uv", new THREE.Float32BufferAttribute(scr.uv, 2)); sg.setAttribute("aGame", new THREE.Float32BufferAttribute(scr.dat, 2)); sg.setIndex(scr.idx); sg.computeBoundingSphere();
  const screens = new THREE.Mesh(sg, screenMaterial()); screens.matrixAutoUpdate = false; G.add(screens);
  await fontsReady();
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.Float32BufferAttribute(mq.pos, 3)); mg.setAttribute("uv", new THREE.Float32BufferAttribute(mq.uv, 2)); mg.setIndex(mq.idx); mg.computeBoundingSphere();
  const marquees = new THREE.Mesh(mg, new THREE.MeshBasicMaterial({ map: marqueeAtlas(ctx.touch), toneMapped: false })); marquees.matrixAutoUpdate = false; G.add(marquees);

  // ---------------------------------------------------------------- the scoreboard (north wall) and the way out (south)
  const boardTex = new THREE.CanvasTexture(document.createElement("canvas")); boardTex.colorSpace = THREE.SRGBColorSpace;
  const paintBoard = () => { drawBoard(boardTex.image); boardTex.needsUpdate = true; };
  paintBoard();
  const board = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.95), new THREE.MeshBasicMaterial({ map: boardTex })); board.position.set(0, 2.45, -R_HALL + 0.17); G.add(board);
  ctx.hit(board, ctx.infoById("board"));
  P.add(box(2.72, 2.07, 0.05), "trim", M4(0, 2.45, -R_HALL + 0.13, 0));
  const onShow = () => { if (!document.hidden) paintBoard(); };
  document.addEventListener("visibilitychange", onShow); window.addEventListener("pageshow", onShow); window.addEventListener("focus", onShow);
  ctx.portal({ w: 1.4, h: 2.3, tint: "#ffd9a0" }, 0, 0, R_HALL - 0.42, Math.PI);
  sign(ctx, ["Back to the Museum", "the Bronze Age hallway"], 0, 3.95, R_HALL - 0.19, Math.PI, 2.4, 0.58);

  // ---------------------------------------------------------------- merged meshes: plain surfaces, flames, painted light
  const plain = P.mesh(pal); plain.userData.wall = true; G.add(plain);
  const flames = flameMesh(FL); G.add(flames);
  G.add(glowMesh(glows));

  // the clock: one hook on the flames (never culled) moves every shader and flickers the real lights
  let last = performance.now();
  flames.onBeforeRender = () => {
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    reduceT -= dt; if (reduceT <= 0) { reduceT = 0.5; reduce = readReduce(); }
    if (reduce) return;
    U.uTime.value += dt; const t = U.uTime.value;
    anchors.forEach((o, k) => { o.a.s = o.s * (0.9 + 0.06 * Math.sin(t * 11.3 + k * 2.1) + 0.04 * Math.sin(t * 23.7 + k)); });
  };

  window.__ARCADE = {
    cabinets: () => GAMES.map((g) => ({ id: g.id, ch: g.ch, ...cabPos(g, R_CAB), stand: cabPos(g, 4.95), yaw: -g.deg * RAD, best: bestOf(g.id) })),
    flames: FL.length, lights: anchors.length,
    setTime: (v) => { U.uTime.value = v; },
    repaintBoard: paintBoard
  };
  return { dispose() { document.removeEventListener("visibilitychange", onShow); window.removeEventListener("pageshow", onShow); window.removeEventListener("focus", onShow); } };
}

// ---------------------------------------------------------------- fittings (after docs/museum/style.js, merged into the palette mesh)
function saucerLamp(P, x, y, z, ry) {   // a Canaanite-style saucer lamp: a shallow clay bowl, the rim pinched into a spout
  const bowl = new THREE.LatheGeometry([[0, 0], [0.055, 0.004], [0.07, 0.02], [0.074, 0.032], [0.066, 0.03], [0.05, 0.012], [0, 0.01]].map(([r, h]) => new THREE.Vector2(r, h)), 12);
  const p = bowl.attributes.position;
  for (let i = 0; i < p.count; i++) { const px = p.getX(i), pz = p.getZ(i), r = Math.hypot(px, pz); if (r > 0.04) { const a = Math.atan2(pz, px), k = Math.exp(-a * a * 8); p.setX(i, px * (1 + 0.35 * k)); p.setZ(i, pz * (1 - 0.55 * k)); } }
  bowl.computeVertexNormals(); bowl.rotateY(ry); bowl.translate(x, y, z); P.add(bowl, "clay");
  return new THREE.Vector3(x + Math.cos(-ry) * 0.085, y + 0.034, z + Math.sin(-ry) * 0.085);
}
function terracottaLamp(P, x, y, z, ry) {   // a Greek or Roman mould-made oil lamp: a round body and a nozzle for the wick
  const body = new THREE.LatheGeometry([[0, 0], [0.032, 0.001], [0.044, 0.01], [0.045, 0.02], [0.038, 0.028], [0.014, 0.024], [0.01, 0.03], [0, 0.03]].map(([r, h]) => new THREE.Vector2(r, h)), 12);
  body.translate(x, y, z); P.add(body, "terracotta");
  const dx = Math.sin(ry), dz = Math.cos(ry);
  const noz = new THREE.CylinderGeometry(0.011, 0.015, 0.055, 6); noz.rotateX(Math.PI / 2); noz.rotateY(ry); noz.translate(x + dx * 0.065, y + 0.014, z + dz * 0.065); P.add(noz, "terracotta");
  return new THREE.Vector3(x + dx * 0.094, y + 0.022, z + dz * 0.094);
}
function lampstand(P, x, z, ry) {   // a bronze lampstand: three feet, a slender shaft, a disc with the lamp on it
  for (let k = 0; k < 3; k++) { const a = k / 3 * TAU + 0.3, foot = new THREE.CylinderGeometry(0.008, 0.014, 0.2, 5); foot.translate(0, 0.1, 0); foot.rotateZ(0.9); foot.rotateY(-a); foot.translate(x, 0.02, z); P.add(foot, "bronze"); }
  const shaft = new THREE.CylinderGeometry(0.011, 0.016, 1.26, 6); shaft.translate(x, 0.7, z); P.add(shaft, "bronze");
  const knot = new THREE.SphereGeometry(0.024, 6, 4); knot.translate(x, 0.75, z); P.add(knot, "bronze");
  const disc = new THREE.CylinderGeometry(0.075, 0.06, 0.012, 10); disc.translate(x, 1.335, z); P.add(disc, "bronze");
  return terracottaLamp(P, x, 1.341, z, ry);
}
function brazier(P, x, y, z, s) {   // a bronze tripod brazier with a shallow bowl of coals
  const bowl = new THREE.LatheGeometry([[0, 0], [0.12, 0.01], [0.2, 0.05], [0.24, 0.1], [0.25, 0.12], [0.23, 0.12], [0.2, 0.07], [0.12, 0.04], [0, 0.035]].map(([r, h]) => new THREE.Vector2(r * s, h * s)), 14);
  bowl.translate(x, y + 0.78 * s, z); P.add(bowl, "bronze");
  const coals = new THREE.CylinderGeometry(0.2 * s, 0.2 * s, 0.03, 10); coals.translate(x, y + 0.88 * s, z); P.add(coals, "ash");
  for (let k = 0; k < 3; k++) {
    const a = k / 3 * TAU + 0.5, leg = new THREE.CylinderGeometry(0.014 * s, 0.018 * s, 0.86 * s, 5);
    leg.translate(0, 0.43 * s, 0); leg.rotateX(0.16); leg.rotateY(-a + Math.PI / 2); leg.translate(x + Math.cos(a) * 0.05 * s, y, z + Math.sin(a) * 0.05 * s); P.add(leg, "bronze");
    const foot = new THREE.SphereGeometry(0.035 * s, 6, 4); foot.translate(x + Math.cos(a) * 0.19 * s, y + 0.03, z + Math.sin(a) * 0.19 * s); P.add(foot, "bronze");
  }
  const ring = new THREE.TorusGeometry(0.17 * s, 0.01 * s, 4, 14); ring.rotateX(Math.PI / 2); ring.translate(x, y + 0.42 * s, z); P.add(ring, "bronze");
  return new THREE.Vector3(x, y + 0.9 * s, z);
}

// ---------------------------------------------------------------- flames: one instanced draw call (the shader is style.js's)
function flameMesh(FL) {
  const mat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
attribute vec3 iPos; attribute vec2 iData; uniform float uTime; varying vec2 vUv; varying float vSeed;
void main(){
  vUv = uv; vSeed = iData.y;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  float sway = sin(uTime * 2.3 + iData.y * 17.) * .06 + sin(uTime * 5.1 + iData.y * 5.) * .03;
  vec3 p = iPos + right * (position.x * 12. + sway * position.y) * iData.x + vec3(0., 1., 0.) * ((position.y - .5) * 12. + .5) * iData.x * 1.9;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,
    fragmentShader: `
uniform float uTime; varying vec2 vUv; varying float vSeed;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
void main(){
  float t = uTime * 2.6 + vSeed * 31.;
  vec2 q0 = vec2((vUv.x - .5) * 12., (vUv.y - .5) * 12. + .5);
  float hr = length(vec2(q0.x, (q0.y - .4) * 1.9));
  float halo = (exp(-hr * .55) * .55 + exp(-hr * 2.) * .35) * (1. - smoothstep(3.5, 6., hr)) * (.9 + .1 * sin(t * 1.7));
  vec2 q = q0;
  float n = n2(vec2(q.x * 5., q.y * 4. - t)) * .6 + n2(vec2(q.x * 11., q.y * 9. - t * 1.7)) * .4;
  q.x += (n - .5) * .22 * q.y;
  float y = q.y * (1.05 + .12 * sin(t * 1.3));
  float width = .34 * sqrt(max(y, 0.)) * (1. - y) * 1.6;
  float d = abs(q.x) / max(width, 1e-3);
  float body = (1. - smoothstep(.55, 1., d)) * step(0., y) * (1. - smoothstep(.8, 1., y));
  float core = (1. - smoothstep(.0, .55, d)) * (1. - smoothstep(.15, .6, y));
  vec3 col = mix(vec3(1., .42, .08), vec3(1., .78, .32), smoothstep(.15, .7, 1. - y)) * body + vec3(1., .95, .8) * core * .9;
  col += vec3(.15, .25, .9) * (1. - smoothstep(.0, .12, y)) * body * .5;
  gl_FragColor = vec4(col * (body * .9 + core * .5) + vec3(1., .62, .3) * halo, 1.);
}`
  });
  const base = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0), g = new THREE.InstancedBufferGeometry();
  g.index = base.index; g.setAttribute("position", base.attributes.position); g.setAttribute("uv", base.attributes.uv);
  g.setAttribute("iPos", new THREE.InstancedBufferAttribute(new Float32Array(FL.flatMap((f) => [f.p.x, f.p.y, f.p.z])), 3));
  g.setAttribute("iData", new THREE.InstancedBufferAttribute(new Float32Array(FL.flatMap((f) => [f.size, f.seed])), 2));
  g.instanceCount = FL.length;
  const m = new THREE.Mesh(g, mat); m.frustumCulled = false; m.renderOrder = 5; return m;
}
// light painted once on the floor (and the board's wall), flames warm and screens in their colours: one draw call
function glowMesh(list) {
  const c = document.createElement("canvas"); c.width = c.height = 128; const q = c.getContext("2d"), r = q.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,.85)"); r.addColorStop(0.4, "rgba(255,255,255,.3)"); r.addColorStop(1, "rgba(255,255,255,0)"); q.fillStyle = r; q.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const pos = [], uv = [], col = [], idx = [];
  for (const o of list) {
    const g = new THREE.PlaneGeometry(o.r * 2, o.r * 2);
    if (o.nx || o.nz) g.rotateY(Math.atan2(o.nx, o.nz)); else g.rotateX(-Math.PI / 2);
    g.translate(o.x, o.y, o.z);
    const p = g.attributes.position, u = g.attributes.uv, base = pos.length / 3;
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); uv.push(u.getX(i), u.getY(i)); col.push(...o.col); }
    for (const i of g.index.array) idx.push(base + i);
    g.dispose();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: t, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.3, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  m.renderOrder = 2; m.matrixAutoUpdate = false; return m;
}
function screenTint(i) { const a = i * 0.083 * TAU; return [0.35 + 0.3 * Math.cos(a), 0.35 + 0.3 * Math.cos(a - 2.1), 0.45 + 0.3 * Math.cos(a - 4.2)]; }

// ---------------------------------------------------------------- the screens' attract loops: one shader for all twelve
function screenMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `attribute vec2 aGame; varying vec2 vUv; varying vec2 vGame; void main(){ vUv = uv; vGame = aGame; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `
uniform float uTime; varying vec2 vUv; varying vec2 vGame;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float dot2(vec2 a, vec2 b, float r){ return smoothstep(r, r * .6, length((a - b) * vec2(1.33, 1.))); }
void main(){
  vec2 uv = vUv; float id = vGame.x, k = vGame.y, t = uTime + id * 7.3;
  vec3 acc = .55 + .45 * cos(6.2831 * (id * .083 + vec3(0., .33, .67)));
  vec3 col = vec3(.02, .02, .04);
  if (k < .5) {                                 // a board, a piece crossing it
    vec2 g = floor(uv * vec2(8., 6.)); col = mix(vec3(.10, .07, .04), vec3(.42, .33, .2), mod(g.x + g.y, 2.));
    vec2 pc = (floor(vec2(mod(t * .7, 8.), 3. + 2. * sin(floor(t * .7 / 8.) * 2.1))) + .5) / vec2(8., 6.);
    col = mix(col, acc, dot2(uv, pc, .07));
  } else if (k < 1.5) {                         // courses rising into a stepped tower
    float lvl = mod(floor(t * .8), 9.), row = floor(uv.y * 9.), w = .92 - row * .1;
    float on = step(row, lvl - 1.) * step(abs(uv.x - .5), w * .5);
    float fall = step(row, 8.) * step(abs(row - (8. - fract(t * .8) * (8. - lvl))), .5) * step(abs(uv.x - .5), w * .5) * step(lvl, row);
    col += acc * (on * (.55 + .35 * hash(vec2(row, floor(uv.x * 14.)))) + fall);
  } else if (k < 2.5) {                         // a grid of cells uncovering
    vec2 n = vec2(10., 7.), g = floor(uv * n), f = fract(uv * n); float h = hash(g + id);
    float rev = step(h, fract(t * .07)), edge = step(.08, f.x) * step(.08, f.y);
    col = mix(vec3(.2, .22, .26), mix(vec3(.06), acc, h * h), rev) * edge;
  } else if (k < 3.5) {                         // a volley: a ball between two paddles
    vec2 b = vec2(abs(fract(t * .23) * 2. - 1.), abs(fract(t * .37) * 2. - 1.)) * vec2(.84, .8) + vec2(.08, .1);
    col += acc * dot2(uv, b, .03);
    col += vec3(.9) * step(abs(uv.x - .04), .012) * step(abs(uv.y - mix(.5, b.y, .8)), .1);
    col += vec3(.9) * step(abs(uv.x - .96), .012) * step(abs(uv.y - mix(.5, b.y, .7)), .1);
    col += vec3(.25) * step(abs(uv.x - .5), .003) * step(.5, fract(uv.y * 12.));
  } else if (k < 4.5) {                         // a trail winding round the screen
    float m = 0.;
    for (int i = 0; i < 14; i++) { float tt = t - float(i) * .09; vec2 p = .5 + vec2(.38 * sin(tt * 1.1), .36 * sin(tt * 1.7 + 1.)); m = max(m, dot2(uv, p, .045) * (1. - float(i) / 14.)); }
    col += acc * m + vec3(1., .9, .5) * dot2(uv, .5 + vec2(.3 * sin(floor(t * .3) * 3.), .3 * cos(floor(t * .3) * 5.)), .025);
  } else if (k < 5.5) {                         // a maze of corridors with a runner
    vec2 n = vec2(12., 9.), g = floor(uv * n), f = fract(uv * n);
    float wall = step(.68, hash(g + id * 3.)) * (1. - step(abs(g.y - 4.), .5));
    col += acc * .55 * wall * step(abs(f.x - .5), .42) * step(abs(f.y - .5), .42);
    col += vec3(1., .9, .6) * (1. - wall) * smoothstep(.13, .07, length(f - .5)) * .6 * step(fract(t * .1) * 12., g.x);
    col += vec3(1., .85, .2) * dot2(uv, vec2(fract(t * .1), 4.5 / 9.), .045);
  } else if (k < 6.5) {                         // stars and a spark bouncing among them
    vec2 n = vec2(16., 12.), g = floor(uv * n), f = fract(uv * n); float h = hash(g + id);
    col += vec3(.8, .85, 1.) * step(.9, h) * smoothstep(.2, .05, length(f - .5)) * (.5 + .5 * sin(t * 3. + h * 40.));
    vec2 b = vec2(.5 + .4 * sin(t * .9), .15 + .7 * abs(sin(t * 1.3)));
    col += acc * dot2(uv, b, .04) + acc * .3 * step(abs(uv.y - .06), .015) * step(abs(uv.x - .5), .12);
  } else {                                      // a question and four answers lighting in turn
    col += vec3(.7) * step(abs(uv.y - .82), .025) * step(abs(uv.x - .5), .38) * step(.25, fract(uv.x * 9.));
    for (int i = 0; i < 4; i++) { float y = .6 - float(i) * .14, lit = step(abs(mod(floor(t * 1.2), 4.) - float(i)), .5);
      col += mix(vec3(.18), acc, lit) * step(abs(uv.y - y), .045) * step(abs(uv.x - .5), .32); }
  }
  col *= .82 + .18 * sin(vUv.y * 260.);                                   // scan lines
  vec2 q = vUv - .5; col *= 1. - dot(q, q) * 1.6;                          // the tube's dark corners
  col += acc * .05 + vec3(.02, .03, .05);
  gl_FragColor = vec4(col * 1.3, 1.);
}`
  });
}

// ---------------------------------------------------------------- the symbol wall (a copy of style.js's symbolWall shader; no gold signs)
function symbolMaterial() {
  const u = { uTime: U.uTime, uAtlas: { value: null }, uGrid: { value: new THREE.Vector2(1, 1) }, uSets: { value: [0, 1, 2, 3].map(() => new THREE.Vector2(0, 1)) }, uN: { value: 1 }, uStrength: { value: 0.85 } };
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: `attribute vec3 aDat; varying vec2 vUv; varying vec3 vDat; void main(){ vUv = uv; vDat = aDat; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `
uniform float uTime, uN, uStrength; uniform sampler2D uAtlas; uniform vec2 uGrid; uniform vec2 uSets[4];
varying vec2 vUv; varying vec3 vDat;
float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
vec2 setOf(float i){ return i < .5 ? uSets[0] : i < 1.5 ? uSets[1] : i < 2.5 ? uSets[2] : uSets[3]; }
void main(){
  const float colW = .3, cellH = .29, gs = .24;
  float L = vDat.x, H = vDat.y;
  float ci = floor(vUv.x / colW), fx = vUv.x - ci * colW;
  float sd = hash(vec2(ci, vDat.z));
  float sd2 = hash(vec2(vDat.z + 1.3, ci * .7)), speed = .9 + sd2 * 2.6;
  float s = (H - vUv.y) / cellH + sd * 40. - uTime * speed, ri = floor(s), fy = s - ri;
  float blk = floor(s / 24.), bh = hash(vec2(blk, ci + vDat.z)), run = 5. + bh * 15.;
  float st = hash(vec2(blk + .37, ci * 1.9 + vDat.z)) * (24. - run), loc = s - blk * 24. - st;
  float lum = .07, headNear = 0.;
  if (bh > .18 && loc >= 0. && loc < run + 1.) {
    float k = clamp(loc / run, 0., 1.);
    float hd = 1. - smoothstep(0., 1.2, abs(loc - run));
    lum = max(lum, k * k * .85 + hd * 1.2); headNear = hd;
  }
  float sIdx = mod(ri + floor(sd * 4.), uN);
  vec2 set = setOf(sIdx);
  float cr = hash(vec2(ci * 7.13 + ri, vDat.z + 3.)), rate = (.2 + cr * 1.3) * (1. + headNear * 7.);
  float tp = uTime * rate + cr * 17., tick = floor(tp), ph = tp - tick;
  float flip = max(smoothstep(0., .14, ph) * (1. - smoothstep(.86, 1., ph)), .04);
  float cell = set.x + floor(hash(vec2(tick + cr * 9., ci * 13. + ri * 1.7 + vDat.z)) * set.y);
  vec2 lc = vec2((fx - (colW - gs) * .5) / gs, (fy * cellH - (cellH - gs) * .5) / gs);
  lc.y = (lc.y - .5) / flip + .5;
  vec2 cl = clamp(lc, 0., 1.), cxy = vec2(mod(cell, uGrid.x), floor(cell / uGrid.x));
  vec2 inCell = vec2(cl.x, 1. - cl.y) * .96 + .02, auv = (cxy + inCell) / uGrid; auv.y = 1. - auv.y;
  vec2 gx = dFdx(inCell) / uGrid, gy = dFdy(inCell) / uGrid; gx.y = -gx.y; gy.y = -gy.y;
  float px = max(length(dFdx(vUv)), length(dFdy(vUv))) / gs, far = 1. - smoothstep(.06, .22, px);
  float inside = step(0., lc.x) * step(lc.x, 1.) * step(0., lc.y) * step(lc.y, 1.);
  float a = textureGrad(uAtlas, auv, gx * 1.6, gy * 1.6).a * inside;
  float od = length(lc - cl);
  float glow = textureGrad(uAtlas, auv, gx * 4., gy * 4.).a * exp(-od * 7.) * far;
  float fade = smoothstep(0., .25, vUv.x) * smoothstep(0., .25, L - vUv.x) * smoothstep(0., .45, vUv.y) * smoothstep(0., .05, H - vUv.y);
  lum *= .55 + .45 * flip;
  vec3 c = vec3(.93, .96, 1.) * (a * lum * mix(.35, 1., far) + glow * min(lum, 1.) * .55) * fade * uStrength;
  gl_FragColor = vec4(c, 1.);
}`
  });
}

// ---------------------------------------------------------------- canvases: the marquees (one atlas) and the scoreboard
function fontsReady() {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  return Promise.race([Promise.all(["600 48px Cinzel", "italic 28px 'Cormorant Garamond'"].map((f) => document.fonts.load(f))).catch(() => {}), new Promise((r) => setTimeout(r, 1500))]);
}
function fitText(g, text, font, size, maxW) { let s = size; do { g.font = font.replace("{s}", s); s -= 2; } while (g.measureText(text).width > maxW && s > 12); }
function marqueeAtlas(touch) {
  const W = touch ? 1024 : 2048, cw = W / 2, ch = W / 6, c = document.createElement("canvas"); c.width = W; c.height = W; const g = c.getContext("2d"), k = W / 1024;
  GAMES.forEach((gm, i) => {
    const x = (i % 2) * cw, y = Math.floor(i / 2) * ch, [r, gg, b] = screenTint(i).map((v) => Math.round(Math.min(1, v * 1.6) * 255));
    const bg = g.createLinearGradient(x, y, x, y + ch); bg.addColorStop(0, "#1a0f08"); bg.addColorStop(0.5, `rgb(${r * 0.25 | 0},${gg * 0.2 | 0},${b * 0.25 | 0})`); bg.addColorStop(1, "#0d0805"); g.fillStyle = bg; g.fillRect(x, y, cw, ch);
    g.strokeStyle = "#c79a54"; g.lineWidth = 5 * k; g.strokeRect(x + 6 * k, y + 6 * k, cw - 12 * k, ch - 12 * k);
    g.strokeStyle = `rgba(${r},${gg},${b},.6)`; g.lineWidth = 2 * k; g.strokeRect(x + 15 * k, y + 15 * k, cw - 30 * k, ch - 30 * k);
    g.textAlign = "center"; g.textBaseline = "middle";
    fitText(g, gm.title.toUpperCase(), "600 {s}px Cinzel, 'Trajan Pro', Georgia, serif", Math.round(40 * k), cw - 60 * k);
    g.shadowColor = `rgb(${r},${gg},${b})`; g.shadowBlur = 16 * k; g.fillStyle = "#ffe9b8"; g.fillText(gm.title.toUpperCase(), x + cw / 2, y + ch * 0.44);
    g.shadowBlur = 0; g.fillStyle = "#cdbb96"; g.font = `italic ${Math.round(22 * k)}px 'Cormorant Garamond', Georgia, serif`;
    g.fillText(gm.chName, x + cw / 2, y + ch * 0.76);
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function drawBoard(c) {
  c.width = 1024; c.height = 768; const g = c.getContext("2d");
  g.fillStyle = "#0f0a06"; g.fillRect(0, 0, 1024, 768);
  g.strokeStyle = "#c79a54"; g.lineWidth = 4; g.strokeRect(12, 12, 1000, 744); g.strokeStyle = "rgba(199,154,84,.4)"; g.lineWidth = 1.5; g.strokeRect(26, 26, 972, 716);
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "#e7c680"; g.font = "600 52px Cinzel, Georgia, serif"; g.fillText("THE ARCHIVE ARCADE", 512, 84);
  g.fillStyle = "#cdbb96"; g.font = "italic 28px 'Cormorant Garamond', Georgia, serif"; g.fillText("your best scores, kept on this device only", 512, 132);
  g.font = "26px Cinzel, Georgia, serif";
  GAMES.forEach((gm, i) => {
    const col = i < 6 ? 0 : 1, row = i % 6, x0 = 70 + col * 470, x1 = x0 + 420, y = 196 + row * 88, b = bestOf(gm.id);
    g.textAlign = "left"; g.fillStyle = "#e9dcc0"; fitText(g, gm.title, "{s}px Cinzel, Georgia, serif", 24, 300); g.fillText(gm.title, x0, y);
    g.fillStyle = "rgba(199,154,84,.35)"; for (let d = x0 + g.measureText(gm.title).width + 10; d < x1 - 70; d += 12) g.fillRect(d, y + 8, 3, 3);
    g.textAlign = "right"; g.fillStyle = b ? "#ffd98a" : "#7d6f5a"; g.font = "600 26px Cinzel, Georgia, serif"; g.fillText(b || "—", x1, y);
    g.textAlign = "left"; g.fillStyle = "#8f7f66"; g.font = "italic 20px 'Cormorant Garamond', Georgia, serif"; g.fillText(gm.chName, x0, y + 28);
  });
}
