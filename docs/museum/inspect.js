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
  panel("#fff0d2", 0, 7, 0, 9, 9); panel("#ffc27a", 7, 2, 4, 5, 7); panel("#5c7cc0", -7, 2, -4, 5, 7); panel("#3a2612", 0, -7, 0, 12, 12); panel("#ffe3b0", -3, 3, 7, 4, 3);
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

// V88: the reliquary of Saint-Maximin, modelled from published descriptions (not a replica):
// a gilded head of flowing hair carried by four angels, the darkened skull behind glass in its face
function skullGeometry() {
  const g = new THREE.SphereGeometry(0.1, 72, 54), P = g.attributes.position, col = [], R = rng(17), v = new THREE.Vector3();
  const bump = (x, y, cx, cy, w) => Math.exp(-(((x - cx) * (x - cx) + (y - cy) * (y - cy)) / (w * w)));
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).normalize();
    const front = Math.max(0, -v.z), low = Math.max(0, -v.y);
    let r = 1, dark = 0;
    r *= 1 + 0.1 * Math.max(0, v.z);                                                  // the long back of the cranium
    r *= 1 - 0.3 * low * low * (0.4 + 0.6 * front);                                    // the face narrows below the cheekbones
    r *= 1 + 0.05 * front * bump(v.x, v.y, 0, 0.2, 0.18) + 0.04 * front * (bump(v.x, v.y, 0.42, -0.12, 0.12) + bump(v.x, v.y, -0.42, -0.12, 0.12));   // brow, cheekbones
    if (front > 0.35) {
      const eyes = bump(v.x, v.y, 0.3, 0.02, 0.15) + bump(v.x, v.y, -0.3, 0.02, 0.15), nose = bump(v.x * 1.7, v.y, 0, -0.25, 0.1);
      r *= 1 - 0.3 * eyes - 0.2 * nose; dark = Math.min(1, eyes * 1.3 + nose * 1.2);
    }
    P.setXYZ(i, v.x * 0.84 * r * 0.1, v.y * 0.98 * r * 0.1, v.z * 1.08 * r * 0.1);
    const n = 0.8 + R() * 0.25, k = 1 - dark * 0.85;                                   // a darkened, mottled patina
    col.push(0.2 * n * k, 0.14 * n * k, 0.09 * n * k);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return g;
}
// the plinth's frieze: engraved rosettes in a gilded band (a texture, tinted by the gold material)
function friezeTex() {
  return canvasTex(2048, 256, (g, w, h) => {
    g.fillStyle = "#f2d690"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(90,60,20,.75)"; g.lineWidth = 3;
    g.strokeRect(8, 8, w - 16, h - 16); g.strokeRect(20, 20, w - 40, h - 40);
    for (let x = 90; x < w - 60; x += 118) {
      if (Math.abs(x - w / 2) < 150) continue;                                       // the central niche
      g.beginPath(); g.arc(x, h / 2, 44, 0, TAU); g.stroke(); g.beginPath(); g.arc(x, h / 2, 12, 0, TAU); g.stroke();
      for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; g.beginPath(); g.ellipse(x + Math.cos(a) * 26, h / 2 + Math.sin(a) * 26, 12, 5, a, 0, TAU); g.stroke(); }
    }
    g.fillStyle = "rgba(90,60,20,.25)"; for (let x = 30; x < w; x += 22) { g.fillRect(x, 26, 10, 4); g.fillRect(x, h - 30, 10, 4); }
  });
}
function shield(M, colours) {
  const sh = new THREE.Shape(); sh.moveTo(-0.045, 0.05); sh.lineTo(0.045, 0.05); sh.lineTo(0.045, -0.005); sh.quadraticCurveTo(0.045, -0.045, 0, -0.06); sh.quadraticCurveTo(-0.045, -0.045, -0.045, -0.005); sh.closePath();
  const tex = canvasTex(128, 160, (g, w, h) => {
    if (colours === "stripes") { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#c8a040" : "#b8262a"; g.fillRect(i * w / 8, 0, w / 8, h * 0.55); } g.fillStyle = "#2a4fa8"; g.fillRect(0, h * 0.55, w, h); g.fillStyle = "#e8c860"; for (let i = 0; i < 4; i++) g.fillRect(12 + i * 30, h * 0.7, 10, 10); }
    else { g.fillStyle = "#2a4fa8"; g.fillRect(0, 0, w, h); g.fillStyle = "#e8c860"; [[30, 70], [64, 70], [98, 70], [47, 104], [81, 104], [64, 134]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + 6, y); g.lineTo(x, y + 8); g.lineTo(x - 6, y); g.fill(); }); g.fillStyle = "#c83030"; g.fillRect(14, 22, 100, 10); for (let i = 0; i < 3; i++) g.fillRect(28 + i * 32, 22, 10, 26); }
  });
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.1 }));
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(sh), M.gold); rim.scale.set(1.12, 1.1, 1); rim.position.z = -0.002;
  const g = new THREE.Group(); g.add(rim, m); return g;
}
// a standing angel: a pleated gilded robe, bare feet, curly head, tall narrow wings, arms raised forward
function angel(M, side) {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.1, 0], [0.105, 0.03], [0.085, 0.16], [0.07, 0.3], [0.06, 0.4], [0.07, 0.45], [0.06, 0.5], [0.03, 0.53], [0, 0.535]];
  const lg = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p[0], p[1])), 72), P = lg.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const ang = Math.atan2(v.z, v.x), low = 1 - Math.min(1, v.y / 0.45); const k = 1 + 0.07 * low * Math.sin(ang * 22) + 0.02 * Math.sin(ang * 7); P.setXYZ(i, v.x * k, v.y, v.z * k * 0.8); }   // deep pleats, a flattened body
  lg.computeVertexNormals(); g.add(new THREE.Mesh(lg, M.gold));
  put(g, mesh(new THREE.SphereGeometry(0.018, 10, 8), M.gold, 0.03, 0.01, 0.075)).scale.set(1, 0.5, 1.8);             // a bare foot
  const head = new THREE.Group(); head.position.y = 0.585; g.add(head);
  head.add(mesh(new THREE.SphereGeometry(0.04, 22, 16), M.gold));
  const R = rng(side > 0 ? 5 : 9); for (let i = 0; i < 16; i++) { const a = R() * TAU, b2 = R() * 1.2; head.add(mesh(new THREE.SphereGeometry(0.013, 8, 6), M.goldDark, Math.cos(a) * Math.cos(b2) * 0.04, Math.sin(b2) * 0.035 + 0.005, Math.sin(a) * Math.cos(b2) * 0.04 - 0.008)); }   // curls
  // the wings: tall, narrow, feathered, rising behind the shoulders and falling to the knees
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(0.07, 0.1, 0.09, 0.3, 0.05, 0.46); sh.bezierCurveTo(0.03, 0.3, 0.02, 0.05, -0.01, -0.28); sh.bezierCurveTo(-0.01, -0.12, -0.01, -0.05, 0, 0);
  const wg = new THREE.ShapeGeometry(sh, 20), wm = new THREE.MeshStandardMaterial({ color: "#d8ad55", metalness: 1, roughness: 0.32, side: THREE.DoubleSide, envMap: M.gold.envMap });
  for (let k = 0; k < 2; k++) {
    // the wing lies in the angel's side plane and spreads backward, which on the reliquary means outward, facing the viewer
    const w = new THREE.Mesh(wg, wm); w.position.set(0.012 * (k ? -1 : 1), 0.44, -0.05 - k * 0.015); w.rotation.y = Math.PI / 2 + (k ? 0.25 : 0.1); w.scale.set(1.9, 1.35, 1); g.add(w);
  }
  // the arms, reaching up and inward toward the bust they hold (the angel faces +x for side -1, -x for side +1)
  const arm = (dz) => { const a = new THREE.Group(); a.position.set(0, 0.5, dz); const upper = mesh(new THREE.CylinderGeometry(0.016, 0.013, 0.2, 10), M.gold, 0, 0.1, 0); a.add(upper); a.add(mesh(new THREE.SphereGeometry(0.014, 10, 8), M.gold, 0, 0.2, 0)); a.rotation.z = side * 0.85; a.rotation.x = -dz * 3; g.add(a); };
  arm(0.035); arm(-0.035);
  // sleeves falling from the arms
  const sleeve = mesh(new THREE.ConeGeometry(0.035, 0.14, 12, 1, true), M.gold, -side * 0.02, 0.44, 0); sleeve.rotation.z = side * 0.5; g.add(sleeve);
  return g;
}
// V88: the reliquary of Saint-Maximin (1860), modelled after published descriptions and a photograph
// (not a replica): a gilded plinth with a rosette frieze and two enamelled shields; four angels lifting
// a gilded bust whose hood frames the skull behind a glass window; between them, a small shrine
// holding the glass vial of the "noli me tangere". The model faces +z.
function magdaleneModel(M) {
  const root = new THREE.Group();
  const gildTex = friezeTex(); gildTex.wrapS = THREE.RepeatWrapping;
  const frieze = new THREE.MeshStandardMaterial({ color: "#ffe4a8", map: gildTex, metalness: 0.75, roughness: 0.38, envMap: M.gold.envMap, envMapIntensity: 1.3 });
  // the plinth, on four scrolled feet
  const PW = 1.1, PD = 0.46, PH = 0.16, FY = 0.07;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => { const f = mesh(new THREE.SphereGeometry(0.05, 16, 12), M.gold, sx * (PW / 2 - 0.06), FY / 2 + 0.01, sz * (PD / 2 - 0.05)); f.scale.set(1.3, 0.8, 1); root.add(f); put(root, mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 16, Math.PI), M.goldDark, sx * (PW / 2 - 0.02), FY, sz * (PD / 2 - 0.05))).rotation.y = Math.PI / 2; });
  root.add(mesh(new THREE.BoxGeometry(PW, 0.03, PD), M.goldDark, 0, FY + 0.015, 0));
  const band = new THREE.Mesh(new THREE.BoxGeometry(PW - 0.02, PH - 0.05, PD - 0.02), [M.gold, M.gold, M.gold, M.gold, frieze, frieze]); band.position.y = FY + 0.03 + (PH - 0.05) / 2; root.add(band);
  root.add(mesh(new THREE.BoxGeometry(PW + 0.02, 0.025, PD + 0.02), M.gold, 0, FY + PH, 0));
  root.add(mesh(new THREE.BoxGeometry(PW - 0.06, 0.01, PD - 0.06), M.stone, 0, FY + PH + 0.017, 0));      // the pale stone top the figures stand on
  const TOP = FY + PH + 0.022;
  // the central niche in the frieze, with a small standing figure
  const niche = new THREE.Group(); niche.position.set(0, FY + 0.03, PD / 2); root.add(niche);
  niche.add(mesh(new THREE.BoxGeometry(0.13, PH - 0.02, 0.02), M.goldDark, 0, (PH - 0.05) / 2, 0.005));
  put(niche, mesh(new THREE.ConeGeometry(0.075, 0.06, 4), M.gold, 0, PH - 0.02, 0.01)).rotation.y = Math.PI / 4;
  niche.add(mesh(new THREE.CapsuleGeometry(0.014, 0.05, 4, 10), M.gold, 0, 0.055, 0.02));
  // two enamelled shields on the frieze
  [[-0.38, "stripes"], [0.38, "lilies"]].forEach(([x, c]) => { const s2 = shield(M, c); s2.position.set(x, FY + 0.03 + (PH - 0.05) / 2, PD / 2 + 0.002); root.add(s2); });
  // the small shrine in the middle: a round base, four columns, a ribbed dome, and the glass vial inside
  const shrine = new THREE.Group(); shrine.position.y = TOP; root.add(shrine);
  shrine.add(mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.025, 32), M.gold, 0, 0.0125));
  shrine.add(mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.02, 32), M.goldDark, 0, 0.035));
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + Math.PI / 4; shrine.add(mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.26, 10), M.gold, Math.cos(a) * 0.075, 0.175, Math.sin(a) * 0.075)); shrine.add(mesh(new THREE.BoxGeometry(0.024, 0.02, 0.024), M.gold, Math.cos(a) * 0.075, 0.31, Math.sin(a) * 0.075)); }
  shrine.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.035, 32), M.gold, 0, 0.335));
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; put(shrine, mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 14, Math.PI), M.goldDark, Math.cos(a) * 0.095, 0.335, Math.sin(a) * 0.095)).rotation.y = -a + Math.PI / 2; }   // arcade
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.095, 32, 16, 0, TAU, 0, Math.PI / 2), M.gold); dome.position.y = 0.35; dome.scale.y = 0.7; shrine.add(dome);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, rib = mesh(new THREE.TorusGeometry(0.095, 0.004, 6, 24, Math.PI / 2), M.goldDark, 0, 0.35, 0); rib.rotation.y = a; rib.scale.y = 0.7; shrine.add(rib); }
  shrine.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 16), M.glass, 0, 0.16));                     // the vial of the "noli me tangere"
  shrine.add(mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.03, 16), M.gold, 0, 0.07)); shrine.add(mesh(new THREE.CylinderGeometry(0.024, 0.02, 0.025, 16), M.gold, 0, 0.25));
  shrine.add(mesh(new THREE.ConeGeometry(0.024, 0.04, 8), M.gold, 0, 0.285));
  shrine.add(mesh(new THREE.SphereGeometry(0.006, 8, 6), new THREE.MeshStandardMaterial({ color: "#6a3a2a", roughness: 0.8 }), 0, 0.16));
  // four angels, two on each side, lifting the bust
  [[-0.27, 0.07, -1], [-0.22, -0.12, -1], [0.27, 0.07, 1], [0.22, -0.12, 1]].forEach(([x, z, side]) => { const g = angel(M, side); g.position.set(x, TOP, z); g.rotation.y = side < 0 ? Math.PI / 2 - 0.25 : -Math.PI / 2 + 0.25; root.add(g); });
  // the bust: gilded shoulders with a collar and a clasp, the neck, the hooded head
  const bust = new THREE.Group(); bust.position.y = TOP + 0.43; root.add(bust);
  const bl = new THREE.LatheGeometry([[0, 0], [0.2, 0], [0.21, 0.02], [0.19, 0.06], [0.13, 0.1], [0.075, 0.12], [0.06, 0.14], [0.058, 0.24], [0, 0.245]].map((p) => new THREE.Vector2(p[0], p[1])), 48);
  const bm = new THREE.Mesh(bl, M.gold); bm.scale.z = 0.62; bust.add(bm);
  const collar = mesh(new THREE.TorusGeometry(0.13, 0.012, 8, 40), M.goldDark, 0, 0.085, 0); collar.rotation.x = Math.PI / 2; collar.scale.y = 0.62; bust.add(collar);
  put(bust, mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.01, 20), M.goldDark, 0, 0.09, 0.083)).rotation.x = Math.PI / 2;    // the clasp at the breast
  // the head: a hood of gold framing a glass window over the face; the skull inside faces +z
  const head = new THREE.Group(); head.position.y = 0.38; bust.add(head);
  const skull = new THREE.Mesh(skullGeometry(), new THREE.MeshStandardMaterial({ vertexColors: true, color: "#6e5e50", roughness: 0.9, metalness: 0 })); skull.rotation.y = Math.PI; skull.scale.setScalar(1.05); head.add(skull);
  for (let t = 0; t < 10; t++) { const a = -0.55 + t * 0.122; head.add(mesh(new THREE.BoxGeometry(0.009, 0.013, 0.006), M.bone, Math.sin(a) * 0.054, -0.09, 0.012 + Math.cos(a) * 0.054)); }
  head.add(mesh(new THREE.SphereGeometry(0.02, 12, 8), new THREE.MeshStandardMaterial({ color: "#8a1a1a", roughness: 0.4 }), 0.1, 0.1, 0.07));   // a red wax seal on the frame
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.13, 48, 32, Math.PI / 2 + 0.72, TAU - 1.44, 0, Math.PI * 0.86), M.gold); hood.scale.set(1, 1.28, 1); head.add(hood);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.128, 32, 24, Math.PI / 2 - 0.72, 1.44, 0.12, Math.PI * 0.72), M.glass); glass.scale.set(1, 1.28, 1); head.add(glass);
  const rimPts = []; for (let i = 0; i <= 48; i++) { const t = i / 48 * TAU, th = 0.12 + (Math.PI * 0.72) * (0.5 - 0.5 * Math.cos(t)), ph = Math.PI / 2 + Math.sin(t) * 0.72; rimPts.push(new THREE.Vector3(-Math.cos(ph) * Math.sin(th) * 0.131, Math.cos(th) * 0.131 * 1.28, Math.sin(ph) * Math.sin(th) * 0.131)); }
  head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPts, true), 96, 0.007, 8, true), M.goldDark));   // the window's frame
  // the hair: long wavy locks from under the hood down over the shoulders and back
  const R = rng(88), pt = (ang, rad, y) => new THREE.Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad * 0.8);
  for (let i = 0; i < 90; i++) {
    const ang = Math.PI / 2 + 0.95 + (i / 90) * (TAU - 1.9) + (R() - 0.5) * 0.06;          // everywhere but the face
    const r0 = 0.12, fall = 0.3 + R() * 0.14, pts = [];
    for (let k = 0; k <= 7; k++) { const t = k / 7, wave = Math.sin(t * 9 + i) * 0.014; pts.push(pt(ang + wave * 2, r0 + t * t * 0.17 + wave, -0.02 - t * fall)); }   // waves spreading out over the shoulders
    head.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, 0.008 + R() * 0.005, 6), R() < 0.3 ? M.goldDark : M.gold));
  }
  return {
    root, target: 0.6, fit: 2.4,
    actions: [
      { id: "face", label: "Look at the face", camera: { yaw: 0, pitch: 0.12, dist: 0.62, target: TOP + 0.81 } },
      { id: "shrine", label: "See the little shrine", camera: { yaw: 0.25, pitch: 0.05, dist: 0.8, target: TOP + 0.2 } },
      { id: "plinth", label: "The plinth", camera: { yaw: 0, pitch: 0.1, dist: 1.3, target: 0.15 } }
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
export function createInspector(opt) {
  const renderer = opt.renderer, reduce = opt.reduce || (() => false);
  const env = makeEnv(renderer), M = materials(env);
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#0c0805"); scene.environment = null;
  const cam = new THREE.PerspectiveCamera(38, 1, 0.02, 40);
  scene.add(new THREE.HemisphereLight("#ffe8c8", "#2a1a0c", 0.9));
  const key = new THREE.DirectionalLight("#ffe2b8", 2.4); key.position.set(2, 3.5, 2.5); scene.add(key);
  const rim = new THREE.DirectionalLight("#9ab4ff", 1.1); rim.position.set(-3, 2, -2.5); scene.add(rim);
  const fill = new THREE.PointLight("#ffcf94", 1.4, 6, 1.5); fill.position.set(-1.2, 0.8, 1.6); scene.add(fill);
  // a dark plinth top with a soft pool of light
  const pool = canvasTex(256, 256, (g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); r.addColorStop(0, "rgba(255,220,170,.55)"); r.addColorStop(1, "rgba(255,220,170,0)"); g.fillStyle = r; g.fillRect(0, 0, w, w); });
  const plinth = mesh(new THREE.CylinderGeometry(1.1, 1.15, 0.08, 64), M.pedestal, 0, -0.04); scene.add(plinth);
  const glow = mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: pool, transparent: true, depthWrite: false })); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.002; scene.add(glow);

  const st = { active: false, model: null, yaw: 0.6, pitch: 0.35, dist: 1.5, want: null, spin: true, idle: 0, panel: 0, panelDir: "right" };
  const el = document.createElement("div"); el.className = "mu-insp"; el.hidden = true;
  el.innerHTML =
    '<div class="mu-insp-view" aria-hidden="true"></div>' +
    '<div class="mu-insp-bar" role="toolbar" aria-label="Examine the object"><span class="mu-insp-acts"></span>' +
      '<button type="button" data-i="reset">Reset view</button><button type="button" class="mu-insp-close" data-i="close">Back to the museum</button></div>' +
    '<p class="mu-insp-hint">Drag to turn it · scroll or pinch to zoom</p>' +
    '<aside class="mu-insp-panel" role="dialog" aria-modal="true" aria-labelledby="mu-card-h" tabindex="-1"><div class="mu-insp-body"></div>' +
      '<p class="mu-insp-note"></p></aside>';
  document.body.appendChild(el);
  const view = el.querySelector(".mu-insp-view"), acts = el.querySelector(".mu-insp-acts"), body = el.querySelector(".mu-insp-body"), note = el.querySelector(".mu-insp-note");

  function frame() {
    const m = st.model; if (!m) return;
    st.yaw = 0.6; st.pitch = 0.35; st.dist = m.fit; st.want = null; st.ty = m.target;
  }
  function paintActs() {
    const m = st.model;
    acts.innerHTML = m.actions.map((a) => `<button type="button" data-act="${a.id}" aria-pressed="${a.on ? "true" : "false"}"${a.needs && !(m.isOpen && m.isOpen()) ? " disabled" : ""}>${a.on && a.alt ? a.alt : a.label}</button>`).join("");
  }
  function open(kind, html, noteText) {
    if (st.model) scene.remove(st.model.root);
    st.model = buildModel(kind, M); st.model.actions.forEach((a) => { a.on = false; });
    scene.add(st.model.root);
    body.innerHTML = html; note.textContent = noteText;
    frame(); paintActs();
    st.active = true; st.spin = !reduce(); st.idle = 0;
    el.hidden = false; document.body.classList.add("mu-inspecting");
    resize();
    el.querySelector(".mu-insp-panel").focus({ preventScroll: true });
  }
  function close() {
    if (!st.active) return;
    st.active = false; el.hidden = true; document.body.classList.remove("mu-inspecting");
    cam.clearViewOffset();
    if (opt.onClose) opt.onClose();
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
    if (b.dataset.i === "reset") { frame(); return; }
    if (b.dataset.act) {
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

  function render(dt) {
    const m = st.model;
    if (st.spin && !reduce()) st.yaw += dt * 0.25;
    if (st.want) { const k = Math.min(1, dt * 3); st.yaw = ease(st.yaw, st.want.yaw, k); st.pitch = ease(st.pitch, st.want.pitch, k); st.dist = ease(st.dist, st.want.dist, k); if (st.want.target != null) st.ty = ease(st.ty, st.want.target, k); }
    if (m) m.update(dt);
    if (st.ty == null) st.ty = m ? m.target : 0.2;
    const t = new THREE.Vector3(0, st.ty, 0);
    cam.position.set(t.x + Math.sin(st.yaw) * Math.cos(st.pitch) * st.dist, t.y + Math.sin(st.pitch) * st.dist, t.z + Math.cos(st.yaw) * Math.cos(st.pitch) * st.dist);
    cam.lookAt(t);
    renderer.render(scene, cam);
  }
  return { open, close, render, resize, get active() { return st.active; }, el, materials: M, state: st };
}
