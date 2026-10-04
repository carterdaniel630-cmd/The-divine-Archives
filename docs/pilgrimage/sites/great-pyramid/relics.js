/* The Great Pyramid: relics, modelled in code from published descriptions.

   Each builder returns { root, actions } in real metres, the form the museum's object
   inspector takes (docs/museum/relics.js, CAT); the engine registers them there when a
   visitor opens one, and the section modules put small copies in their glass cases.
   None is a replica: each is a rendition after the descriptions logged in
   sources/pilgrimage-great-pyramid.md, and any size the sources did not give is
   marked as estimated on the object's card. */
import * as THREE from "three";

function rng(seed) { let s = seed || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function tex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function speckle(base, dots, seed, n) {
  return tex(256, 256, (g, w, h) => {
    const R = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < (n || 2400); i++) { g.fillStyle = dots[Math.floor(R() * dots.length)]; const s = 1 + R() * 3; g.fillRect(R() * w, R() * h, s, s); }
  });
}
const std = (o) => new THREE.MeshStandardMaterial(o);
const done = (root) => ({ root, actions: [], act() { return null; }, update() { return false; } });   // the inspector's model interface (still: nothing opens)

// ---- the Dixon relics (found 1872 in the Queen's Chamber's northern shaft)
// the ball: dolerite (grey-green, fine-grained); about 7 cm across, our estimate from Piazzi Smyth's recorded weight
export function ball() {
  const root = new THREE.Group();
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 48, 32), std({ map: speckle("#4c5148", ["#2c302a", "#6b7066", "#3a4a3c", "#80847a"], 11, 5000), roughness: 0.55, metalness: 0.02 }));
  m.position.y = 0.035; m.scale.set(1, 0.97, 1.01); root.add(m);
  return done(root);
}
// the hook: copper or bronze, two prongs bent back from a shank with a loop (size estimated)
export function hook() {
  const root = new THREE.Group(), cu = std({ color: "#5d6b4c", roughness: 0.62, metalness: 0.55, map: speckle("#5d6b4c", ["#3f4a35", "#7d8a5e", "#8a6a3e", "#4a5a46"], 5, 1800) });
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0026, 0.05, 10), cu); shank.position.y = 0.025; root.add(shank);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0018, 8, 20), cu); loop.position.y = 0.055; root.add(loop);
  for (const s of [-1, 1]) {
    const prong = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0021, 8, 16, Math.PI * 0.9), cu);
    prong.rotation.z = s < 0 ? Math.PI * 1.05 : -Math.PI * 0.05; prong.position.set(s * 0.009, 0.004, 0); root.add(prong);
  }
  root.rotation.z = 0.12; const holder = new THREE.Group(); holder.add(root); root.position.y = 0.006;
  return done(holder);
}
// the cedar: a splintered piece about 13 cm (five inches) long
export function cedar() {
  const root = new THREE.Group(), R = rng(17);
  const grain = tex(256, 64, (g, w, h) => { g.fillStyle = "#6e4a2c"; g.fillRect(0, 0, w, h); for (let i = 0; i < 46; i++) { g.strokeStyle = R() < 0.5 ? "rgba(40,24,12,.55)" : "rgba(150,110,70,.35)"; g.lineWidth = 1 + R() * 2; g.beginPath(); const y = R() * h; g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + (R() - 0.5) * 8, w * 0.7, y + (R() - 0.5) * 8, w, y + (R() - 0.5) * 6); g.stroke(); } });
  const geo = new THREE.BoxGeometry(0.127, 0.014, 0.022, 14, 2, 3), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), t = Math.abs(x) / 0.0635; p.setY(i, p.getY(i) * (1 - 0.45 * t) + (R() - 0.5) * 0.002); p.setZ(i, p.getZ(i) * (1 - 0.5 * t * t) + (R() - 0.5) * 0.002); if (x > 0.055) p.setX(i, x - R() * 0.012); }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, std({ map: grain, roughness: 0.9 })); m.position.y = 0.008; m.rotation.y = 0.3; root.add(m);
  return done(root);
}
// the three together, for the case
export function dixonSet() {
  const g = new THREE.Group();
  const b = ball().root; b.position.set(-0.11, 0, 0.04); g.add(b);
  const h = hook().root; h.position.set(0.0, 0, -0.04); h.rotation.x = -Math.PI / 2 + 0.2; h.position.y = 0.006; g.add(h);
  const c = cedar().root; c.position.set(0.08, 0, 0.05); g.add(c);
  return done(g);
}

// ---- Khufu's ivory statuette (Abydos; Egyptian Museum, Cairo, JE 36143): 7.5 cm high, seated, the Red Crown, a pleated kilt
export function statuette() {
  const root = new THREE.Group();
  const ivory = std({ map: speckle("#d9c7a2", ["#c9b48c", "#e6d8b8", "#b39a72", "#d0bd96"], 23, 3000), roughness: 0.48 });
  const crownM = std({ color: "#c9b48c", roughness: 0.5 });
  const H = 0.075;
  // a block throne with a low back; the king seated upright, hands resting on his thighs
  const throne = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.026, 0.029), ivory); throne.position.set(0, 0.013, -0.0005); root.add(throne);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.008, 0.004), ivory); back.position.set(0, 0.03, -0.0125); root.add(back);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.021, 0.004, 0.037), ivory); base.position.set(0, 0.002, 0.003); root.add(base);
  for (const s of [-1, 1]) {
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0019, 0.022, 10), ivory); shin.position.set(s * 0.0032, 0.015, 0.0165); root.add(shin);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.0018, 0.0065), ivory); foot.position.set(s * 0.0032, 0.0049, 0.0185); root.add(foot);
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.0027, 0.0024, 0.02, 10), ivory); thigh.rotation.x = Math.PI / 2; thigh.position.set(s * 0.0032, 0.0285, 0.0075); root.add(thigh);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0014, 0.011, 8), ivory); upper.position.set(s * 0.0066, 0.0395, -0.003); upper.rotation.x = 0.15; root.add(upper);
    const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.0014, 0.0013, 0.011, 8), ivory); fore.rotation.x = Math.PI / 2 - 0.2; fore.position.set(s * 0.0062, 0.0338, 0.0035); root.add(fore);
  }
  // the pleated kilt across the lap, and the torso
  const kilt = new THREE.Mesh(new THREE.BoxGeometry(0.0128, 0.0052, 0.011), std({ map: pleats(), roughness: 0.5 })); kilt.position.set(0, 0.0305, 0.0); root.add(kilt);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.0058, 0.0045, 0.015, 14), ivory); torso.position.set(0, 0.0405, -0.0035); torso.scale.set(1.25, 1, 0.72); root.add(torso);
  const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.0017, 0.0105, 4, 8), ivory); shoulders.rotation.z = Math.PI / 2; shoulders.position.set(0, 0.0468, -0.0035); root.add(shoulders);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.0017, 0.0019, 0.004, 10), ivory); neck.position.set(0, 0.0505, -0.0035); root.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.0038, 16, 12), ivory); head.position.set(0, 0.0555, -0.0032); head.scale.set(0.9, 1.1, 1); root.add(head);
  // the Red Crown: a flat-topped cap with a tall back piece (the coil is not modelled)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.0043, 0.0046, 0.0055, 16), crownM); cap.position.set(0, 0.0605, -0.0034); root.add(cap);
  const tall = new THREE.Mesh(new THREE.BoxGeometry(0.0036, 0.0105, 0.0022), crownM); tall.position.set(0, 0.0655, -0.0068); root.add(tall);
  // a faint line where Petrie's men re-found the head after it broke off in the dig
  const seam = new THREE.Mesh(new THREE.TorusGeometry(0.0034, 0.0003, 6, 18), std({ color: "#8a7656", roughness: 0.8 })); seam.position.set(0, 0.0522, -0.0034); seam.scale.setScalar(0.62); seam.rotation.x = Math.PI / 2; root.add(seam);
  void H;
  return done(root);
}

function pleats() { return tex(64, 32, (g, w, h) => { g.fillStyle = "#d4c19a"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(120,95,60,.55)"; g.lineWidth = 1; for (let x = 2; x < w; x += 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 2, h); g.stroke(); } }); }

// ---- Khufu's ship (found 1954 in a pit by the pyramid's south side): 43.4 m long, 5.9 m wide, Lebanese cedar; here at 1:60
export function ship(scale) {
  const k = scale || 1 / 60, L = 43.4 * k, B = 5.9 * k, D = 1.78 * k, root = new THREE.Group();
  const R = rng(9);
  const plank = tex(512, 64, (g, w, h) => { g.fillStyle = "#8a6440"; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 8) { g.fillStyle = `rgba(50,30,15,${0.25 + R() * 0.2})`; g.fillRect(0, y, w, 1.2); } for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(160,120,80,.2)"; g.fillRect(R() * w, R() * h, 8 + R() * 30, 1); } });
  const wood = std({ map: plank, roughness: 0.8, side: THREE.DoubleSide });
  // hull: rings along the length, the sheer rising to tall papyrus-bundle posts at bow and stern
  const N = 48, M = 12, pos = [], uv = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N * 2 - 1, half = Math.max(0.02, Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(t), 2.6)))), w = B / 2 * half;
    const sheer = D * (0.9 + 3.6 * Math.pow(Math.abs(t), 6)), keel = D * 0.15 * Math.pow(Math.abs(t), 2) + D * 2.4 * Math.pow(Math.max(0, Math.abs(t) - 0.82) / 0.18, 2.2) * 0.4;
    for (let j = 0; j <= M; j++) {
      const a = Math.PI * (j / M);
      pos.push(t * L / 2, sheer - (sheer - keel) * Math.sin(a), -Math.cos(a) * w); uv.push(i / N * 6, j / M);
    }
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const hg = new THREE.BufferGeometry(); hg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); hg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); hg.setIndex(idx); hg.computeVertexNormals();
  root.add(new THREE.Mesh(hg, wood));
  // deck, the deckhouse aft of amidships and the small canopy forward
  const deck = new THREE.Mesh(new THREE.BoxGeometry(L * 0.78, D * 0.06, B * 0.86), wood); deck.position.set(0, D * 0.82, 0); root.add(deck);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(9 * k, 2.2 * k, 3.6 * k), std({ color: "#9a7650", roughness: 0.8 })); cabin.position.set(-L * 0.12, D * 0.82 + 1.1 * k, 0); root.add(cabin);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(9.6 * k, 0.25 * k, 4.2 * k), wood); roof.position.set(-L * 0.12, D * 0.82 + 2.3 * k, 0); root.add(roof);
  const can = new THREE.Mesh(new THREE.BoxGeometry(2.6 * k, 0.15 * k, 2.4 * k), wood); can.position.set(L * 0.3, D * 0.82 + 1.9 * k, 0); root.add(can);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * k, 0.06 * k, 1.9 * k, 6), wood); pole.position.set(L * 0.3 + sx * 1.2 * k, D * 0.82 + 0.95 * k, sz * 1.1 * k); root.add(pole); }
  // ten oars, five a side, and two steering oars at the stern
  const oarM = std({ color: "#7a5636", roughness: 0.8 });
  for (const sz of [-1, 1]) {
    for (let i = 0; i < 5; i++) { const o = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * k, 0.07 * k, 8 * k, 6), oarM); o.position.set(L * (0.26 - i * 0.065), D * 0.7, sz * (B / 2 + 2.2 * k)); o.rotation.x = sz * 1.1; root.add(o); }
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * k, 0.09 * k, 6.8 * k, 6), oarM); st.position.set(-L * 0.4, D * 1.2, sz * (B / 2 + 0.6 * k)); st.rotation.z = 0.9; st.rotation.x = sz * 0.3; root.add(st);
  }
  // a low stand, as the ship is shown in a museum
  const stand = new THREE.Mesh(new THREE.BoxGeometry(L * 0.6, D * 0.25, B * 0.3), std({ color: "#1e150d", roughness: 0.6 })); stand.position.y = -D * 0.05; root.add(stand);
  root.position.y = D * 0.1;
  const holder = new THREE.Group(); holder.add(root);
  return done(holder);
}

// ---- a casing stone (National Museum of Scotland): fine Tura limestone with the sloping outer face; 25 inches long
export function casing() {
  const root = new THREE.Group(), L = 0.635, Hh = 0.42, Wd = 0.5, ang = 51.84 * Math.PI / 180;   // height and depth estimated; face at the pyramid's slope
  const sh = new THREE.Shape(); const run = Hh / Math.tan(ang);
  sh.moveTo(0, 0); sh.lineTo(Wd, 0); sh.lineTo(Wd - run, Hh); sh.lineTo(0, Hh); sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: L, bevelEnabled: false }); geo.translate(-Wd / 2, 0, -L / 2); geo.rotateY(Math.PI / 2);
  const lime = std({ map: speckle("#ddd0b4", ["#cbbd9c", "#e8dec8", "#b8a888", "#d6c8a8"], 31, 4000), roughness: 0.75 });
  root.add(new THREE.Mesh(geo, lime));
  return done(root);
}
