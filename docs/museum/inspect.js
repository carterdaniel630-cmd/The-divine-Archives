/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: the object inspector

   Click a Vault case and its object comes out of the glass: a close-up, lit
   study of the museum's stand-in for that kind of object, which you can turn
   (drag), zoom (wheel or pinch) and open. Scrolls unroll, books open and turn
   their pages, caskets lift their lids, tablets and bones turn over, cloth
   unfolds, khipu cords fan out. The object's label (the same card as always,
   with its links to the Vault entry and the evidence) sits beside it.

   Every model here is a generic stand-in for its KIND of object, never a
   replica of the object itself, and any writing on it is illustrative marks,
   not the text. The one purpose-built model, the reliquary of Saint-Maximin
   (V88), is a rendition from published descriptions and is labelled so.
   ========================================================================== */
import * as THREE from "three";
import { buildReliquary, reliquaryStage } from "./reliquary.js?v=1";
import { buildRelic, hasRelic } from "./relics.js?v=1";
import { englishHTML, hasEnglish } from "./english.js?v=2";
import { scanEmbed } from "./scans.js?v=1";

const TAU = Math.PI * 2;
const ease = (a, b, k) => a + (b - a) * k;

// ---------------------------------------------------------------- textures
function canvasTex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function rng(seed) { let s = seed || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
// parchment / vellum / papyrus ground with illustrative writing (not a text): lines of small strokes
function writing(w, h, o) {
  o = o || {};
  return canvasTex(w, h, (g) => {
    const R = rng(o.seed || 7);
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, o.bg || "#e7d6ad"); gr.addColorStop(1, o.bg2 || "#d3bb88");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = R() < 0.5 ? "rgba(120,90,50,.06)" : "rgba(255,250,230,.08)"; g.fillRect(R() * w, R() * h, 2 + R() * 5, 2 + R() * 5); }
    if (o.fibres) { g.strokeStyle = "rgba(120,95,55,.18)"; for (let y = 0; y < h; y += 6) { g.beginPath(); g.moveTo(0, y + R() * 3); g.lineTo(w, y + R() * 3); g.stroke(); } }
    const cols = o.cols || 1, m = o.margin || 0.08, colW = (w * (1 - m * 2)) / cols, gap = colW * 0.08;
    g.fillStyle = o.ink || "rgba(40,24,12,.8)";
    for (let c = 0; c < cols; c++) {
      const x0 = w * m + c * colW + gap / 2, x1 = x0 + colW - gap;
      for (let y = h * m + 14; y < h * (1 - m); y += o.lh || 18) {
        let x = x0;
        while (x < x1 - 6) { const L = 3 + R() * 9; g.fillRect(x, y + (R() - 0.5) * 2, L, o.stroke || 2.2); if (R() < 0.3) g.fillRect(x + L * 0.4, y - 4, 1.6, 5); x += L + 2 + R() * 5; if (R() < 0.12) x += 8; }
      }
    }
    if (o.initial) { g.fillStyle = "#9c2a1a"; g.fillRect(w * m, h * m + 4, 46, 52); g.fillStyle = "#d8ae4c"; g.fillRect(w * m + 8, h * m + 12, 30, 36); }
    if (o.edge) { g.strokeStyle = "rgba(90,60,30,.5)"; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); }
  });
}
// incised surface for tablets and slabs: wedges or chiselled strokes, lit from the top left
function incised(w, h, o) {
  return canvasTex(w, h, (g) => {
    const R = rng(o.seed || 3);
    g.fillStyle = o.bg; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3000; i++) { g.fillStyle = R() < 0.5 ? "rgba(0,0,0,.06)" : "rgba(255,255,255,.05)"; g.fillRect(R() * w, R() * h, 2 + R() * 4, 2 + R() * 4); }
    for (let y = 26; y < h - 20; y += o.lh || 30) {
      let x = 22;
      while (x < w - 30) {
        if (o.wedge) {
          const s = 7 + R() * 7, dir = R() < 0.6 ? 0 : 1;
          g.fillStyle = "rgba(0,0,0,.45)"; g.beginPath();
          if (dir) { g.moveTo(x, y - s); g.lineTo(x + s * 0.5, y - s); g.lineTo(x + s * 0.25, y + s * 0.6); } else { g.moveTo(x, y - s * 0.3); g.lineTo(x, y + s * 0.3); g.lineTo(x + s * 1.3, y); }
          g.fill(); x += s * 1.4 + R() * 6;
        } else {
          const L = 5 + R() * 12; g.fillStyle = "rgba(0,0,0,.42)"; g.fillRect(x, y, L, 3); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x, y + 3, L, 1); x += L + 5 + R() * 6;
        }
      }
      if (o.wedge) { g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(14, y + 14, w - 28, 1.5); }
    }
  });
}

// ---------------------------------------------------------------- materials
function materials(env) {
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ envMap: env, envMapIntensity: 0.9 }, o));
  return {
    gold: std({ color: "#d8ad55", metalness: 1, roughness: 0.26 }),
    goldDark: std({ color: "#a37a2e", metalness: 1, roughness: 0.38 }),
    bronze: std({ color: "#7a5230", metalness: 0.9, roughness: 0.42 }),
    verdigris: std({ color: "#4d7f6a", metalness: 0.5, roughness: 0.55 }),
    wood: std({ color: "#6b4424", roughness: 0.72 }),
    woodDark: std({ color: "#3e2614", roughness: 0.66 }),
    leather: std({ color: "#5a2a18", roughness: 0.6 }),
    parch: std({ color: "#e4d2a6", roughness: 0.9 }),
    clay: std({ color: "#a8784b", roughness: 0.95 }),
    stone: std({ color: "#8a7a64", roughness: 0.92 }),
    bone: std({ color: "#dccfb0", roughness: 0.8 }),
    linen: std({ color: "#ddd3bb", roughness: 1 }),
    velvet: std({ color: "#6d1522", roughness: 1 }),
    skull: std({ color: "#4a3626", roughness: 0.85 }),
    socket: std({ color: "#120b06", roughness: 1 }),
    glass: new THREE.MeshStandardMaterial({ color: "#dfeff4", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.16, envMap: env, envMapIntensity: 1.4, depthWrite: false }),
    cord: std({ color: "#c9a878", roughness: 1 }),
    cordDark: std({ color: "#7a5230", roughness: 1 }),
    pedestal: std({ color: "#241a12", roughness: 0.55 })
  };
}
function makeEnv(renderer) {
  const pm = new THREE.PMREMGenerator(renderer), s = new THREE.Scene();
  s.background = new THREE.Color("#1a1209");
  const panel = (c, x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  panel("#fff0d2", 0, 7, 0, 9, 9); panel("#ffc27a", 7, 2, 4, 5, 7); panel("#5a5462", -7, 2, -4, 5, 7); panel("#3a2612", 0, -7, 0, 12, 12); panel("#ffe3b0", -3, 3, 7, 4, 3);
  const rt = pm.fromScene(s, 0.04); pm.dispose();
  return rt.texture;
}

// ---------------------------------------------------------------- models
// each returns { root, actions: [{ id, label, alt }], act(id), update(dt), target (look-at y), fit (camera distance) }
function put(parent, obj) { parent.add(obj); return obj; }   // add a child and return the CHILD (Object3D.add returns the parent)
function mesh(geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); return m; }

function scrollModel(M) {
  const root = new THREE.Group(), W = 1.4, H = 0.42;
  const tex = writing(2048, 620, { cols: 6, margin: 0.06, lh: 22, seed: 11, bg: "#e2cf9f", bg2: "#cdb483" });
  const sheetMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, side: THREE.DoubleSide });
  const sheet = mesh(new THREE.PlaneGeometry(W, H), sheetMat, 0, 0.3); sheet.rotation.x = -0.25; root.add(sheet);
  const mk = () => { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(1, 1, H * 0.98, 32), M.parch)); const rod = mesh(new THREE.CylinderGeometry(0.014, 0.014, H + 0.16, 12), M.wood); g.add(rod);
    [1, -1].forEach((s) => g.add(mesh(new THREE.SphereGeometry(0.026, 14, 10), M.woodDark, 0, s * (H / 2 + 0.08), 0))); g.rotation.x = -0.25; root.add(g); return g; };
  const L = mk(), Rr = mk();
  let u = 0, want = 0;
  function pose() {
    const half = (W / 2) * u, r = 0.055 * (1 - 0.55 * u) + 0.018;
    [L, Rr].forEach((g, i) => { const s = i ? 1 : -1; g.position.set(s * (half + r * 0.6), 0.3, 0); g.children[0].scale.set(r, 1, r); });
    sheet.scale.x = Math.max(0.001, u); tex.repeat.set(Math.max(0.001, u), 1); tex.offset.set((1 - u) / 2, 0);
    sheet.visible = u > 0.01;
  }
  pose();
  return {
    root, target: 0.3, fit: 1.9,
    actions: [{ id: "roll", label: "Unroll", alt: "Roll up" }],
    act() { want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 3.2)); if (Math.abs(u - want) < 0.002) u = want; pose(); return true; } return false; }
  };
}

function codexModel(M) {
  const root = new THREE.Group(), Wd = 0.5, D = 0.68, T = 0.12;
  const pageTex = [1, 2, 3, 4, 5, 6].map((k) => writing(900, 1200, { cols: k % 3 === 0 ? 1 : 2, lh: 20, seed: 20 + k, initial: k % 2 === 1, edge: true, bg: "#efe2bf", bg2: "#e0cc9c" }));
  const back = mesh(new THREE.BoxGeometry(Wd, 0.02, D), M.leather, Wd / 2, 0.01, 0); root.add(back);
  const block = mesh(new THREE.BoxGeometry(Wd - 0.03, T - 0.035, D - 0.03), M.parch, Wd / 2, T / 2, 0); root.add(block);
  const spine = mesh(new THREE.BoxGeometry(0.03, T, D), M.leather, 0, T / 2, 0); root.add(spine);
  const coverPivot = new THREE.Group(); coverPivot.position.set(0, T, 0); root.add(coverPivot);
  const cover = mesh(new THREE.BoxGeometry(Wd, 0.02, D), M.leather, Wd / 2, 0.01, 0); coverPivot.add(cover);
  const boss = (x, z) => coverPivot.add(mesh(new THREE.SphereGeometry(0.022, 12, 8), M.gold, x, 0.024, z));
  boss(Wd / 2, 0); boss(0.08, -D / 2 + 0.06); boss(Wd - 0.06, -D / 2 + 0.06); boss(0.08, D / 2 - 0.06); boss(Wd - 0.06, D / 2 - 0.06);
  coverPivot.add(mesh(new THREE.BoxGeometry(Wd * 0.7, 0.004, D * 0.72), M.goldDark, Wd / 2, 0.021, 0));
  // the open spread: left page lies on the inside of the cover, right page on the block
  const pageL = mesh(new THREE.PlaneGeometry(Wd - 0.04, D - 0.04), new THREE.MeshStandardMaterial({ map: pageTex[0], roughness: 0.9 }), Wd / 2, -0.001, 0);
  pageL.rotation.x = Math.PI / 2; coverPivot.add(pageL);
  const pageR = mesh(new THREE.PlaneGeometry(Wd - 0.04, D - 0.04), new THREE.MeshStandardMaterial({ map: pageTex[1], roughness: 0.9 }), Wd / 2, T - 0.017, 0);
  pageR.rotation.x = -Math.PI / 2; root.add(pageR);
  // a turning leaf
  const leafPivot = new THREE.Group(); leafPivot.position.set(0, T - 0.012, 0); root.add(leafPivot);
  const leafMat = new THREE.MeshStandardMaterial({ map: pageTex[2], roughness: 0.9, side: THREE.DoubleSide });
  const leaf = mesh(new THREE.PlaneGeometry(Wd - 0.04, D - 0.04), leafMat, Wd / 2, 0, 0); leaf.rotation.x = -Math.PI / 2; leafPivot.add(leaf); leafPivot.visible = false;
  root.position.x = -Wd / 2;
  let open = 0, want = 0, turn = -1, spread = 0;
  function pose() { coverPivot.rotation.z = open * Math.PI * 0.985; coverPivot.position.y = T - (T - 0.022) * open; pageR.visible = open > 0.3; }   // the open cover lies on the table
  pose();
  return {
    root, target: 0.05, fit: 1.5,
    actions: [{ id: "open", label: "Open the book", alt: "Close the book" }, { id: "page", label: "Turn a page", needs: "open" }],
    act(id) {
      if (id === "open") { want = want ? 0 : 1; if (!want) { turn = -1; leafPivot.visible = false; } return want; }
      if (id === "page" && want && turn < 0) { turn = 0; leafMat.map = pageTex[(spread * 2 + 1) % pageTex.length]; leafMat.needsUpdate = true; leafPivot.visible = true; }
      return null;
    },
    isOpen: () => want === 1,
    update(dt) {
      let moving = false;
      if (Math.abs(open - want) > 0.001) { open = ease(open, want, Math.min(1, dt * 3)); if (Math.abs(open - want) < 0.002) open = want; pose(); moving = true; }
      if (turn >= 0) {
        turn = Math.min(1, turn + dt * 1.4); const k = turn < 0.5 ? 2 * turn * turn : 1 - Math.pow(-2 * turn + 2, 2) / 2;
        leafPivot.rotation.z = k * Math.PI * 0.985; leaf.position.y = Math.sin(k * Math.PI) * 0.02;
        if (turn >= 1) { spread++; pageL.material.map = pageTex[(spread * 2) % pageTex.length]; pageR.material.map = pageTex[(spread * 2 + 1) % pageTex.length]; pageL.material.needsUpdate = pageR.material.needsUpdate = true; leafPivot.visible = false; leafPivot.rotation.z = 0; turn = -1; }
        moving = true;
      }
      return moving;
    }
  };
}

function casketModel(M, chest) {
  const root = new THREE.Group(), W = chest ? 0.62 : 0.5, D = chest ? 0.4 : 0.32, H = chest ? 0.3 : 0.24;
  const body = chest ? M.gold : M.wood;
  root.add(mesh(new THREE.BoxGeometry(W, 0.02, D), M.goldDark, 0, 0.01, 0));
  [[0, H / 2, D / 2 - 0.01, W, H, 0.02], [0, H / 2, -D / 2 + 0.01, W, H, 0.02], [W / 2 - 0.01, H / 2, 0, 0.02, H, D], [-W / 2 + 0.01, H / 2, 0, 0.02, H, D]].forEach(([x, y, z, w, h, d]) => root.add(mesh(new THREE.BoxGeometry(w, h, d), body, x, y, z)));
  root.add(mesh(new THREE.BoxGeometry(W - 0.04, 0.012, D - 0.04), M.velvet, 0, 0.03, 0));
  // metal bands and corner fittings
  [-W / 2 + 0.06, W / 2 - 0.06].forEach((x) => root.add(mesh(new THREE.BoxGeometry(0.03, H + 0.004, D + 0.006), M.gold, x, H / 2, 0)));
  if (!chest) root.add(mesh(new THREE.BoxGeometry(W + 0.006, 0.025, D + 0.006), M.gold, 0, H - 0.02, 0));
  // inside: a wrapped bundle (a stand-in for "a relic", not any particular one)
  const bundle = mesh(new THREE.SphereGeometry(0.1, 20, 14), M.linen, 0, 0.09, 0); bundle.scale.set(1.5, 0.55, 0.9); root.add(bundle);
  put(root, mesh(new THREE.TorusGeometry(0.075, 0.008, 8, 24), M.velvet, 0, 0.1, 0)).rotation.x = Math.PI / 2;
  // the lid hinges at the back edge
  const lidPivot = new THREE.Group(); lidPivot.position.set(0, H, -D / 2); root.add(lidPivot);
  if (chest) {
    lidPivot.add(mesh(new THREE.BoxGeometry(W + 0.02, 0.03, D + 0.02), M.gold, 0, 0.015, D / 2));
    [[-1, 1], [1, 1]].forEach(([s]) => { const w = mesh(new THREE.BoxGeometry(0.02, 0.14, 0.26), M.goldDark, s * (W / 2 - 0.08), 0.1, D / 2); w.rotation.x = -0.2; lidPivot.add(w); });
  } else {
    const roof = mesh(new THREE.CylinderGeometry(D / 2 + 0.01, D / 2 + 0.01, W + 0.01, 24, 1, false, 0, Math.PI), M.wood, 0, 0, D / 2); roof.rotation.z = Math.PI / 2; roof.rotation.y = 0; lidPivot.add(roof);
    lidPivot.add(mesh(new THREE.BoxGeometry(W + 0.02, 0.02, 0.03), M.gold, 0, D / 2 + 0.005, D / 2));
    for (let i = -2; i <= 2; i++) lidPivot.add(mesh(new THREE.SphereGeometry(0.018, 10, 8), M.gold, i * W / 5.5, D / 2 + 0.02, D / 2));
  }
  let open = 0, want = 0;
  function pose() { lidPivot.rotation.x = -open * 1.9; }
  return {
    root, target: H * 0.6, fit: 1.4,
    actions: [{ id: "lid", label: "Open the lid", alt: "Close the lid" }],
    act() { want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(open - want) > 0.001) { open = ease(open, want, Math.min(1, dt * 3)); if (Math.abs(open - want) < 0.002) open = want; pose(); return true; } return false; }
  };
}

// a flat object with a face: tablet, slab, bone, disc: "Turn over" spins it half a turn
function flatModel(M, kind) {
  const root = new THREE.Group(), spin = new THREE.Group(); root.add(spin);
  let target = 0.2, fit = 1.3;
  if (kind === "tablet") {
    const tex = incised(512, 360, { bg: "#a9794b", wedge: true, lh: 34, seed: 5 });
    const mats = [M.clay, M.clay, M.clay, M.clay, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }), new THREE.MeshStandardMaterial({ map: incised(512, 360, { bg: "#a0724a", wedge: true, lh: 34, seed: 9 }), roughness: 0.95 })];
    const g = new THREE.BoxGeometry(0.42, 0.29, 0.07, 1, 1, 1); const m = new THREE.Mesh(g, mats); m.position.y = 0.2; spin.add(m);
  } else if (kind === "slab" || kind === "pillar") {
    const tex = incised(512, 700, { bg: "#8f8069", lh: 26, seed: 8 });
    const mats = [M.stone, M.stone, M.stone, M.stone, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }), M.stone];
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.1), mats); m.position.y = 0.35; spin.add(m); target = 0.35; fit = 1.6;
    if (kind === "pillar") { m.scale.set(0.6, 1.2, 1.4); spin.add(mesh(new THREE.BoxGeometry(0.46, 0.12, 0.2), M.stone, 0.05, 0.78, 0)); target = 0.45; fit = 1.9; }
  } else if (kind === "bone") {
    const tex = canvasTex(512, 512, (g, w, h) => { const R = rng(4); g.fillStyle = "#dccfb0"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(60,40,20,.8)"; g.lineWidth = 2.5; for (let i = 0; i < 9; i++) { const x = 60 + R() * 380, y = 80 + R() * 330; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 30); g.lineTo(x + 18 * (R() < 0.5 ? -1 : 1), y - 42); g.stroke(); } g.fillStyle = "rgba(60,40,20,.7)"; for (let i = 0; i < 40; i++) g.fillRect(60 + R() * 380, 60 + R() * 380, 6, 2); });
    const m = mesh(new THREE.SphereGeometry(0.22, 32, 18), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), 0, 0.12); m.scale.set(1.25, 0.16, 0.85); spin.add(m); target = 0.12;
  } else if (kind === "disc") {
    const tex = canvasTex(512, 512, (g, w) => { g.fillStyle = "#3f7060"; g.fillRect(0, 0, w, w); const R = rng(6); for (let i = 0; i < 1800; i++) { g.fillStyle = R() < 0.5 ? "rgba(20,50,40,.3)" : "rgba(120,170,150,.2)"; g.fillRect(R() * w, R() * w, 3, 3); } g.fillStyle = "#d9b25a"; g.beginPath(); g.arc(w * 0.36, w * 0.4, 58, 0, TAU); g.fill(); g.lineWidth = 16; g.strokeStyle = "#d9b25a"; g.beginPath(); g.arc(w * 0.6, w * 0.52, 90, -0.9, 1.1); g.stroke(); for (let i = 0; i < 26; i++) { g.beginPath(); g.arc(80 + R() * 350, 80 + R() * 350, 8, 0, TAU); g.fill(); } });
    const faceM = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.45 });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 64), [M.verdigris, faceM, M.verdigris]); m.rotation.x = Math.PI / 2; m.position.y = 0.32; spin.add(m); target = 0.32; fit = 1.4;
  }
  let a = 0, want = 0;
  return {
    root, target, fit,
    actions: [{ id: "flip", label: "Turn it over", alt: "Turn it back" }],
    act() { want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(a - want) > 0.001) { a = ease(a, want, Math.min(1, dt * 3.4)); if (Math.abs(a - want) < 0.002) a = want; spin.rotation.y = a * Math.PI; return true; } return false; }
  };
}

function bowlModel(M) {
  const root = new THREE.Group(), pts = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20, a = t * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * 0.26 + 0.004, 0.02 + (1 - Math.cos(a)) * 0.16)); }
  const inTex = canvasTex(1024, 1024, (g, w) => {
    g.fillStyle = "#b58a5c"; g.fillRect(0, 0, w, w); const R = rng(12);
    for (let i = 0; i < 2600; i++) { g.fillStyle = R() < 0.5 ? "rgba(80,50,20,.08)" : "rgba(255,240,210,.08)"; g.fillRect(R() * w, R() * w, 4, 4); }
    g.fillStyle = "rgba(40,20,8,.85)"; let a = 0, r = 460;                    // a spiral of illustrative writing, the way incantation bowls are written
    while (r > 80) { const x = w / 2 + Math.cos(a) * r, y = w / 2 + Math.sin(a) * r; g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2); g.fillRect(0, 0, 6 + R() * 10, 3); if (R() < 0.3) g.fillRect(3, -6, 2, 7); g.restore(); a += 14 / r; r -= 0.9; }
    g.strokeStyle = "rgba(40,20,8,.9)"; g.lineWidth = 3; g.beginPath(); g.arc(w / 2, w / 2, 70, 0, TAU); g.stroke();
    g.beginPath(); g.moveTo(w / 2 - 30, w / 2 - 40); g.lineTo(w / 2, w / 2 + 40); g.lineTo(w / 2 + 30, w / 2 - 40); g.stroke();
  });
  const shell = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), M.clay); root.add(shell);
  const inner = mesh(new THREE.CircleGeometry(0.255, 64), new THREE.MeshStandardMaterial({ map: inTex, roughness: 0.95 }), 0, 0.03, 0); inner.rotation.x = -Math.PI / 2; root.add(inner);
  const innerWall = new THREE.Mesh(new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p.x - 0.008, p.y + 0.004)), 64), new THREE.MeshStandardMaterial({ color: "#b58a5c", roughness: 0.95, side: THREE.BackSide })); root.add(innerWall);
  return { root, target: 0.1, fit: 1.2, actions: [{ id: "look", label: "Look inside", camera: { pitch: 1.2 } }], act() { return null; }, update() { return false; } };
}

function clothModel(M) {
  const root = new THREE.Group();
  const tex = canvasTex(512, 512, (g, w) => { g.fillStyle = "#ddd3bb"; g.fillRect(0, 0, w, w); g.strokeStyle = "rgba(120,100,70,.14)"; for (let i = 0; i < w; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, w); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } });
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 1, side: THREE.DoubleSide });
  const layers = [];
  for (let i = 0; i < 4; i++) { const p = mesh(new THREE.PlaneGeometry(0.4, 0.3), mat, 0, 0.02 + i * 0.022, 0); p.rotation.x = -Math.PI / 2; root.add(p); layers.push(p); }
  let u = 0, want = 0;
  function pose() { layers.forEach((p, i) => { const sx = 1 + u * (i + 1) * 0.6, sz = 1 + u * (i % 2 ? 1.2 : 0.6); p.scale.set(sx, sz, 1); p.position.y = 0.02 + i * 0.022 * (1 - u) + u * 0.004 * i; p.position.x = u * (i - 1.5) * 0.02; }); }
  return {
    root, target: 0.05, fit: 1.4,
    actions: [{ id: "unfold", label: "Unfold it", alt: "Fold it" }],
    act() { want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.6)); if (Math.abs(u - want) < 0.002) u = want; pose(); return true; } return false; }
  };
}

function cordsModel(M) {
  const root = new THREE.Group(), main = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.9, 10), M.cordDark, 0, 0.6); main.rotation.z = Math.PI / 2; root.add(main);
  const pend = [];
  for (let i = 0; i < 16; i++) {
    const p = new THREE.Group(); p.position.set(-0.4 + i * 0.053, 0.6, 0); root.add(p);
    const c = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.5, 6), i % 3 === 0 ? M.cordDark : M.cord, 0, -0.25); p.add(c);
    const R = rng(30 + i); for (let k = 0; k < 3; k++) if (R() < 0.8) p.add(mesh(new THREE.SphereGeometry(0.011, 8, 6), M.cordDark, 0, -0.08 - k * 0.12 - R() * 0.05));   // knots
    pend.push(p);
  }
  let u = 0, want = 0;
  return {
    root, target: 0.4, fit: 1.7,
    actions: [{ id: "fan", label: "Spread the cords", alt: "Let them hang" }],
    act() { want = want ? 0 : 1; return want; },
    update(dt) { if (Math.abs(u - want) > 0.001) { u = ease(u, want, Math.min(1, dt * 2.8)); if (Math.abs(u - want) < 0.002) u = want; pend.forEach((p, i) => { p.rotation.x = u * (0.9 + (i % 4) * 0.12); }); return true; } return false; }
  };
}

function simpleModel(M, kind) {
  const root = new THREE.Group(); let target = 0.2, fit = 1.3;
  if (kind === "spear") {
    put(root, mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.9, 12), M.wood, 0, 0.3)).rotation.z = Math.PI / 2;
    const tip = mesh(new THREE.ConeGeometry(0.05, 0.3, 4), M.bronze, 0.6, 0.3); tip.rotation.z = -Math.PI / 2; tip.scale.set(1, 1, 0.3); root.add(tip);
    put(root, mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12), M.gold, 0.43, 0.3)).rotation.z = Math.PI / 2;
    put(root, mesh(new THREE.TorusGeometry(0.03, 0.006, 8, 20), M.gold, 0.32, 0.3)).rotation.y = Math.PI / 2;
    target = 0.3; fit = 1.7;
  } else if (kind === "ring") {
    const g = new THREE.Group(); g.position.y = 0.2; root.add(g);
    for (let i = 0; i < 3; i++) { const t = mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 60), i === 1 ? M.goldDark : M.gold); t.rotation.x = Math.PI / 2 + (i - 1) * 0.18; t.rotation.y = i * 0.6; g.add(t); }
  } else {                                                                        // figurine
    const pts = [[0, 0], [0.07, 0.01], [0.09, 0.06], [0.07, 0.12], [0.1, 0.18], [0.11, 0.24], [0.07, 0.3], [0.045, 0.34], [0.055, 0.38], [0.05, 0.43], [0, 0.46]].map((p) => new THREE.Vector2(p[0], p[1]));
    root.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), M.clay)); target = 0.23;
  }
  return { root, target, fit, actions: [], act() { return null; }, update() { return false; } };
}

// V88: the reliquary of Saint-Maximin (1860), a rendition after published descriptions and a photograph
// (reliquary.js). In the inspector it stands in a niche of its own, under a light that casts shadows,
// on a polished floor that reflects it.
function magdaleneModel(M) {
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;   // phones and tablets get the lighter build
  const R = buildReliquary(M.gold.envMap, coarse ? 1 : 2);
  return {
    root: R.root, target: 0.62, fit: 2.3, stage: true,
    actions: [
      { id: "face", label: "Look at the face", camera: { yaw: 0, pitch: 0.08, dist: 0.6, target: R.headY } },
      { id: "shrine", label: "See the little shrine", camera: { yaw: 0.3, pitch: 0.12, dist: 0.8, target: R.shrineY } },
      { id: "plinth", label: "The plinth", camera: { yaw: 0, pitch: 0.12, dist: 1.4, target: 0.16 } }
    ],
    act() { return null; }, update() { return false; }
  };
}

export function buildModel(kind, M) {
  switch (kind) {
    case "scroll": return scrollModel(M);
    case "codex": return codexModel(M);
    case "chest": return casketModel(M, true);
    case "casket": return casketModel(M, false);
    case "tablet": case "slab": case "pillar": case "bone": case "disc": return flatModel(M, kind);
    case "bowl": return bowlModel(M);
    case "cloth": return clothModel(M);
    case "cords": return cordsModel(M);
    case "magdalene": return magdaleneModel(M);
    default: return simpleModel(M, kind);
  }
}

// ---------------------------------------------------------------- the inspector
// the reflection is a copy of the object: after the object moves (a book opens, a lid lifts) copy its parts' poses
function syncMirror(a, b) { for (let i = 0; i < a.children.length && i < b.children.length; i++) { const x = a.children[i], y = b.children[i]; y.position.copy(x.position); y.quaternion.copy(x.quaternion); y.scale.copy(x.scale); y.visible = x.visible; if (x.material) y.material = x.material; syncMirror(x, y); } }
export function createInspector(opt) {
  const renderer = opt.renderer, reduce = opt.reduce || (() => false);
  const env = makeEnv(renderer), M = materials(env);
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#0c0805"); scene.environment = null;
  const cam = new THREE.PerspectiveCamera(38, 1, 0.02, 40);
  const hemi = new THREE.HemisphereLight("#ffe8c8", "#2a1a0c", 0.9); scene.add(hemi);
  const key = new THREE.DirectionalLight("#ffe2b8", 2.4); key.position.set(2, 3.5, 2.5); scene.add(key);
  const rim = new THREE.DirectionalLight("#9ab4ff", 1.1); rim.position.set(-3, 2, -2.5); scene.add(rim);
  const fill = new THREE.PointLight("#ffcf94", 1.4, 6, 1.5); fill.position.set(-1.2, 0.8, 1.6); scene.add(fill);
  const plain = [hemi, key, rim, fill];
  // some models (the reliquary) bring a setting of their own: walls, a reflecting floor, lights that cast shadows
  let stage = null, reflection = null;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // a dark plinth top with a soft pool of light
  const pool = canvasTex(256, 256, (g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); r.addColorStop(0, "rgba(255,220,170,.55)"); r.addColorStop(1, "rgba(255,220,170,0)"); g.fillStyle = r; g.fillRect(0, 0, w, w); });
  const plinth = mesh(new THREE.CylinderGeometry(1.1, 1.15, 0.08, 64), M.pedestal, 0, -0.04); scene.add(plinth);
  const glow = mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: pool, transparent: true, depthWrite: false })); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.002; scene.add(glow);

  const st = { active: false, model: null, yaw: 0.6, pitch: 0.35, dist: 1.5, want: null, spin: true, idle: 0, panel: 0, panelDir: "right" };
  const el = document.createElement("div"); el.className = "mu-insp"; el.hidden = true;
  el.innerHTML =
    '<div class="mu-insp-view" aria-hidden="true"></div>' +
    '<div class="mu-insp-bar" role="toolbar" aria-label="Examine the object"><span class="mu-insp-acts"></span>' +
      '<button type="button" data-i="scan" hidden aria-pressed="false">View the real scan</button><button type="button" data-i="en" hidden>Read it in English</button><button type="button" data-i="reset">Reset view</button><button type="button" class="mu-insp-close" data-i="close">Back to the museum</button></div>' +
    '<p class="mu-insp-hint">Drag to turn it · scroll or pinch to zoom</p>' +
    '<div class="mu-scan" hidden><div class="mu-scan-frame"></div><p class="mu-scan-cap"></p></div>' +
    '<aside class="mu-insp-panel" role="dialog" aria-modal="true" aria-labelledby="mu-card-h" tabindex="-1"><div class="mu-insp-body"></div>' +
      '<p class="mu-insp-note"></p></aside>';
  document.body.appendChild(el);
  const view = el.querySelector(".mu-insp-view"), acts = el.querySelector(".mu-insp-acts"), body = el.querySelector(".mu-insp-body"), note = el.querySelector(".mu-insp-note");

  function frame() {
    const m = st.model; if (!m) return;
    st.yaw = 0.6; st.pitch = 0.35; st.dist = m.fit; st.want = null; st.ty = m.target;
  }
  function paintActs() {
    const m = st.model; if (!m) return;
    acts.innerHTML = m.actions.map((a) => `<button type="button" data-act="${a.id}" aria-pressed="${a.on ? "true" : "false"}"${a.needs && !(m.isOpen && m.isOpen()) ? " disabled" : ""}>${a.on && a.alt ? a.alt : a.label}</button>`).join("");
  }
  // free what the last object made (its own geometry, materials and textures; not the shared ones)
  function drop(m) {
    if (!m) return; scene.remove(m.root); if (!m.own) return;
    m.root.traverse((o) => { if (o.geometry) o.geometry.dispose(); [].concat(o.material || []).forEach((mt) => { if (!mt || (mt.userData && mt.userData.shared) || Object.values(M).includes(mt)) return; ["map", "normalMap", "roughnessMap"].forEach((k) => { if (mt[k] && mt[k].isTexture && !(mt[k].userData && mt[k].userData.shared)) mt[k].dispose(); }); mt.dispose(); }); });
  }
  let pending = 0;
  function open(kind, html, noteText, id) {
    drop(st.model); st.model = null;
    unstage();
    body.innerHTML = html + (id ? englishHTML(id) : ""); note.textContent = noteText; acts.innerHTML = "";
    el.querySelector('[data-i="en"]').hidden = !(id && hasEnglish(id));
    hideScan(); st.scanId = id && scanEmbed(id) ? id : null; el.querySelector('[data-i="scan"]').hidden = !st.scanId;
    st.active = true; st.spin = !reduce(); st.idle = 0;
    el.hidden = false; document.body.classList.add("mu-inspecting");
    resize();
    el.querySelector(".mu-insp-panel").focus({ preventScroll: true });
    // the object is made a moment later, so the label appears at once even on a slow device
    const ticket = ++pending;
    el.classList.add("mu-insp-busy");
    setTimeout(() => {
      if (ticket !== pending || !st.active) return;
      const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      const relic = id && hasRelic(id) ? buildRelic(id, env, coarse ? 1 : 2, [0.9, 0.9, 0.9]) : null;
      if (relic) { relic.own = true; relic.stage = true; if (relic.note) note.textContent = noteText + " " + relic.note; }
      st.model = relic || buildModel(kind, M); st.model.actions.forEach((a) => { a.on = false; });
      scene.add(st.model.root);
      if (st.model.stage) {
        stage = reliquaryStage(env); reflection = stage.mirror(st.model.root);
        scene.add(stage.group, reflection);
        plain.concat(plinth, glow).forEach((o) => { o.visible = false; });
        scene.background = new THREE.Color("#070504");
      }
      frame(); paintActs(); el.classList.remove("mu-insp-busy");
    }, 40);
  }

  function close() {
    if (!st.active) return;
    st.active = false; el.hidden = true; document.body.classList.remove("mu-inspecting"); hideScan();
    cam.clearViewOffset();
    unstage(); drop(st.model); st.model = null;
    if (opt.onClose) opt.onClose();
  }
  function unstage() {
    if (!stage) return;
    scene.remove(stage.group, reflection);
    stage.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); if (o.material.normalMap) o.material.normalMap.dispose(); o.material.dispose(); } if (o.shadow && o.shadow.map) o.shadow.map.dispose(); });
    stage = null; reflection = null;
    plain.concat(plinth, glow).forEach((o) => { o.visible = true; });
    scene.background = new THREE.Color("#0c0805");
  }
  function resize() {
    const W = window.innerWidth, H = window.innerHeight, narrow = W < 760;
    cam.aspect = W / H; st.panelDir = narrow ? "bottom" : "right";
    const panel = el.querySelector(".mu-insp-panel"), r = panel.getBoundingClientRect();
    // keep the object centred in the part of the screen the label does not cover
    if (narrow) cam.setViewOffset(W, H, 0, Math.min(H * 0.3, r.height / 2), W, H);
    else cam.setViewOffset(W, H, Math.min(W * 0.3, r.width / 2), 0, W, H);
    cam.updateProjectionMatrix();
  }
  window.addEventListener("resize", () => { if (st.active) resize(); });

  // input: drag to turn, wheel / pinch to zoom
  const ptrs = new Map(); let pinch0 = 0, dist0 = 0;
  view.addEventListener("pointerdown", (e) => { view.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); st.spin = false; st.want = null; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = st.dist; } });
  view.addEventListener("pointermove", (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (ptrs.size === 1) { st.yaw -= (e.clientX - p.x) * 0.008; st.pitch = Math.max(-0.2, Math.min(1.45, st.pitch + (e.clientY - p.y) * 0.006)); }
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch0) st.dist = Math.max(0.35, Math.min(4, dist0 * pinch0 / d)); }
  });
  const up = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = 0; };
  view.addEventListener("pointerup", up); view.addEventListener("pointercancel", up);
  view.addEventListener("wheel", (e) => { e.preventDefault(); st.dist = Math.max(0.35, Math.min(4, st.dist * Math.exp(e.deltaY * 0.0012))); st.want = null; }, { passive: false });
  el.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.i === "close") { close(); return; }
    if (b.dataset.i === "reset") { hideScan(); frame(); return; }
    if (b.dataset.i === "scan") { if (st.scanOn) hideScan(); else showScan(); return; }
    if (b.dataset.i === "en") { const d = body.querySelector(".mu-en"); if (d) { d.open = true; d.scrollIntoView({ block: "start", behavior: reduce() ? "auto" : "smooth" }); d.querySelector("summary").focus({ preventScroll: true }); } return; }
    if (b.dataset.act && st.model) {
      const a = st.model.actions.find((x) => x.id === b.dataset.act);
      const r = st.model.act(a.id);
      if (r != null) a.on = !!r;
      if (a.camera) st.want = Object.assign({ yaw: st.yaw, pitch: st.pitch, dist: st.dist }, a.camera);
      st.spin = false; paintActs();
    }
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "ArrowLeft") st.yaw += 0.15; else if (e.key === "ArrowRight") st.yaw -= 0.15;
    else if (e.key === "ArrowUp") st.pitch = Math.min(1.45, st.pitch + 0.1); else if (e.key === "ArrowDown") st.pitch = Math.max(-0.2, st.pitch - 0.1);
    else if (e.key === "+" || e.key === "=") st.dist = Math.max(0.35, st.dist * 0.88); else if (e.key === "-") st.dist = Math.min(4, st.dist * 1.12);
    else return;
    st.spin = false;
  });

  // a real scan, in the publisher's own viewer, fetched only when asked for
  function showScan() {
    const e = st.scanId && scanEmbed(st.scanId); if (!e) return;
    const box = el.querySelector(".mu-scan"), f = document.createElement("iframe");
    f.src = e.src; f.title = "3D scan of the object"; f.allow = "autoplay; fullscreen; xr-spatial-tracking"; f.setAttribute("allowfullscreen", ""); f.loading = "eager";
    box.querySelector(".mu-scan-frame").replaceChildren(f);
    const who = e.s.kind === "museum" ? "Published by " + e.s.by : "Scanned by " + e.s.by;
    box.querySelector(".mu-scan-cap").innerHTML = "A real 3D scan of the object" + (e.s.what ? " (" + e.s.what + ")" : "") + ". " + who + ", shown in Sketchfab's viewer. <a target=\"_blank\" rel=\"noopener\" href=\"" + e.page + "\">Open it on Sketchfab</a>, where its licence is given.";
    box.hidden = false; st.scanOn = true; el.classList.add("mu-scanning");
    const bar = el.querySelector(".mu-insp-bar").getBoundingClientRect(); box.style.top = Math.round(bar.bottom + 8) + "px";
    const b = el.querySelector('[data-i="scan"]'); b.textContent = "Back to the rendition"; b.setAttribute("aria-pressed", "true");
  }
  function hideScan() {
    const box = el.querySelector(".mu-scan"); if (!box) return;
    box.hidden = true; box.querySelector(".mu-scan-frame").replaceChildren(); st.scanOn = false; el.classList.remove("mu-scanning");
    const b = el.querySelector('[data-i="scan"]'); if (b) { b.textContent = "View the real scan"; b.setAttribute("aria-pressed", "false"); }
  }

  function render(dt) {
    if (st.scanOn) return;
    const m = st.model;
    if (st.spin && !reduce()) st.yaw += dt * 0.25;
    if (st.want) { const k = Math.min(1, dt * 3); st.yaw = ease(st.yaw, st.want.yaw, k); st.pitch = ease(st.pitch, st.want.pitch, k); st.dist = ease(st.dist, st.want.dist, k); if (st.want.target != null) st.ty = ease(st.ty, st.want.target, k); }
    if (m && m.update(dt) && reflection) syncMirror(m.root, reflection);
    if (stage) stage.update(dt, reduce());
    if (st.ty == null) st.ty = m ? m.target : 0.2;
    const t = new THREE.Vector3(0, st.ty, 0);
    cam.position.set(t.x + Math.sin(st.yaw) * Math.cos(st.pitch) * st.dist, t.y + Math.sin(st.pitch) * st.dist, t.z + Math.cos(st.yaw) * Math.cos(st.pitch) * st.dist);
    cam.lookAt(t);
    renderer.render(scene, cam);
  }
  return { open, close, render, resize, get active() { return st.active; }, el, materials: M, state: st };
}
