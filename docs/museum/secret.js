/* ==========================================================================
   THE DIVINE ARCHIVES — the secret in the Bronze Age wall

   Now and then one falling sign on the Bronze Age hallway's symbol wall glows
   gold instead of white. Tapping a gold sign before it fades adds the next
   word of a message to a line along the wall. A miss costs nothing: the next
   gold sign carries on. Tapping a white sign starts the line again. After the
   last word the wall holds still and reads out the whole message in English,
   then a golden archway opens in it: the way into the hidden arcade
   (pilgrimage/arcade.html). Once found, this browser remembers the archway.

   The message is written in English capitals, never in an ancient script (the
   archive never composes text in a sacred or ancient script). The gold sign is
   one of the wall's own signs, drawn in gold; nothing here adds a sign that
   the wall itself does not show. Plan: plans/hidden-arcade-and-easter-eggs.md.

   createSecret({ scene, camera, style, portal, store, go }) →
     { update(dt, pos) → redraw?, tap(cx, cy) → consumed?, key() → consumed?, debug }
   ========================================================================== */
import * as THREE from "three";

export const MESSAGE = "THE ARCHIVE REMEMBERS EVERYTHING";   // Carter's to choose (plan §1); one word per gold sign
const WALL = "bronze", HREF = "pilgrimage/arcade.html", KEY = "mu-arcade";
const NEAR = 11, FALL = 0.32, FIRST = [6, 9], NEXT = [12, 20];   // metres; metres per second; seconds before a gold sign
const rnd = (a, b) => a + Math.random() * (b - a);

function textCanvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function canvasTex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

export function createSecret({ scene, camera, style, portal, store, go }) {
  const words = MESSAGE.split(/\s+/);
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), fwd = new THREE.Vector3(), tmp = new THREE.Vector3();
  const st = { got: 0, wait: rnd(...FIRST), gold: null, line: null, reveal: null, arch: null, near: false, wall: null };

  // ---- the gold sign: one of the wall's own signs, gold, with its halo, flipping like the rest
  const goldU = { uAtlas: { value: null }, uGrid: { value: new THREE.Vector2(1, 1) }, uCell: { value: 0 }, uFlip: { value: 1 }, uA: { value: 0 } };
  const goldMat = new THREE.ShaderMaterial({
    uniforms: goldU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `uniform sampler2D uAtlas; uniform vec2 uGrid; uniform float uCell, uFlip, uA; varying vec2 vUv;
void main(){
  vec2 lc = (vUv - .5) * 2.5 + .5; lc.y = (lc.y - .5) / max(uFlip, .04) + .5;     // the sign fills the middle; folded while it turns
  vec2 cl = clamp(lc, 0., 1.), cxy = vec2(mod(uCell, uGrid.x), floor(uCell / uGrid.x));
  vec2 auv = (cxy + cl * .96 + .02) / uGrid; auv.y = 1. - auv.y;
  float inside = step(0., lc.x) * step(lc.x, 1.) * step(0., lc.y) * step(lc.y, 1.);
  float a = texture2D(uAtlas, auv).a * inside;
  float d = length(vUv - .5), halo = exp(-d * 6.) * .7 + exp(-d * 16.) * .8;
  vec3 c = vec3(1., .76, .32) * (a * 2.4 + halo * (.6 + .4 * uFlip));
  gl_FragColor = vec4(c * uA, 1.);
}`
  });
  const goldMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), goldMat); goldMesh.visible = false; goldMesh.renderOrder = 4;
  const goldHit = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ visible: false })); goldMesh.add(goldHit);
  scene.add(goldMesh);

  // ---- the line of words along the wall, and the read-out
  function plate(w, h, pxPerM) {
    const c = textCanvas(Math.round(w * pxPerM), Math.round(h * pxPerM)), tex = canvasTex(c);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    m.renderOrder = 5; scene.add(m); return { m, c, tex, w, h };
  }
  function draw(P, lines, size, colour, n) {
    const g = P.c.getContext("2d"), W = P.c.width, H = P.c.height; g.clearRect(0, 0, W, H);
    g.textAlign = "center"; g.textBaseline = "middle"; g.font = `600 ${size}px Georgia, "Times New Roman", serif`;
    // shrink to fit the widest line (a phone held upright sees only a few metres of wall)
    const widest = Math.max(...lines.map((ln) => g.measureText(ln).width)); if (widest > W * 0.94) { size = Math.floor(size * W * 0.94 / widest); g.font = `600 ${size}px Georgia, "Times New Roman", serif`; }
    g.shadowColor = colour; g.shadowBlur = size * 0.45; g.fillStyle = colour;
    let left = n == null ? Infinity : n;
    lines.forEach((ln, i) => {
      const shown = ln.slice(0, Math.max(0, Math.min(ln.length, left))); left -= ln.length;
      if (shown) g.fillText(shown, W / 2 + (g.measureText(shown).width - g.measureText(ln).width) / 2, H * (i + 0.5) / lines.length);
    });
    P.tex.needsUpdate = true;
  }
  function onWall(obj, p, x, y, out) {   // stand a plate against a panel, facing into the hallway
    obj.position.set(x, y, p.z + p.nz * out); obj.rotation.set(0, p.nz > 0 ? 0 : Math.PI, 0);
  }

  // ---- the archway (built when found; remembered by this browser)
  function openArch(at, fresh) {
    if (st.arch) return;
    const fx = portal({ w: 1.3, h: 2.15, label: "The Archive Arcade" });
    fx.group.position.set(at.x, 0, at.z + at.nz * 0.06); fx.group.rotation.y = at.nz > 0 ? 0 : Math.PI;
    scene.add(fx.group);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.9, 0.4), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 1.45; fx.group.add(hit);
    st.arch = { fx, hit, at, grow: fresh ? 0 : 1, fired: false };
    fx.group.scale.setScalar(fresh ? 0.001 : 1);
    try { store.set(KEY, JSON.stringify({ x: +at.x.toFixed(2), z: +at.z.toFixed(2), nz: at.nz })); } catch (e) { /* storage blocked */ }
  }
  try { const saved = JSON.parse(store.get(KEY) || "null"); if (saved && isFinite(saved.x)) openArch(saved, false); } catch (e) { /* ignore */ }

  const visible = (o) => { for (let q = o; q; q = q.parent) if (q.visible === false) return false; return true; };
  function theWall() { return st.wall || (st.wall = (style.walls || []).find((w) => w.name === WALL) || null); }

  function spawn(pos) {
    const W = theWall(), A = style.symbols(WALL); if (!W || !A.tex || !A.data) return false;
    camera.getWorldDirection(fwd);
    // a panel near the visitor and in front of them, with room for a column clear of its edges
    const cand = W.panels.filter((p) => p.x1 - p.x0 > 1.2 && Math.abs(p.z - pos.z) < 6).map((p) => {
      const x = THREE.MathUtils.clamp(pos.x + fwd.x * 3, p.x0 + 0.5, p.x1 - 0.5);
      tmp.set(x - pos.x, 0, p.z - pos.z); const d = tmp.length(), facing = tmp.normalize().dot(fwd);
      return { p, x, d, facing };
    }).filter((c) => c.d < NEAR && c.facing > 0.15).sort((a, b) => (a.d - a.facing * 4) - (b.d - b.facing * 4));
    if (!cand.length) return false;
    const c = cand[0], x = c.x + rnd(-1.6, 1.6), px = THREE.MathUtils.clamp(x, c.p.x0 + 0.45, c.p.x1 - 0.45);
    // keep clear of a remembered archway
    if (st.arch && Math.abs(px - st.arch.at.x) < 1.2 && st.arch.at.nz === c.p.nz) return false;
    const d = A.data, sets = d.sets.slice(0, 4), set = sets[Math.floor(Math.random() * sets.length)];
    goldU.uAtlas.value = A.tex; goldU.uGrid.value.set(d.cols, d.rows);
    st.gold = { p: c.p, x: px, y: c.p.y1 - 0.35, set, cell: set.start + Math.floor(Math.random() * set.len), t: 0, flipT: rnd(1.2, 2.2), life: 0 };
    goldU.uCell.value = st.gold.cell;
    goldMesh.visible = true; return true;
  }

  function addWord(p, x) {
    st.got++;
    if (!st.line) st.line = plate(1.9, 0.26, 260);
    const at = { p, x: THREE.MathUtils.clamp(x, p.x0 + 1, p.x1 - 1) };
    if (!st.line.at || st.line.at.p !== p) { st.line.at = at; onWall(st.line.m, p, at.x, 1.22, 0.03); }
    draw(st.line, [words.slice(0, st.got).join(" ")], 52, "#ffd27a");
    st.line.m.material.opacity = 1; st.line.fadeOut = 0;
    if (st.got >= words.length) startReveal(p, st.line.at.x);
  }
  function reset() {
    if (!st.got) return false;
    st.got = 0; if (st.line) st.line.fadeOut = 1;
    return true;
  }
  function startReveal(p, x) {
    const W = theWall(); if (W) { W.U.held = true; W.U.uStrength.value = 0.85; }
    const w = Math.min(1.9, p.x1 - p.x0 - 0.4), cx = THREE.MathUtils.clamp(x, p.x0 + w / 2 + 0.2, p.x1 - w / 2 - 0.2);
    const big = plate(w, 1.6, 240);
    // the message in two or three lines
    const lines = [], max = 11; let cur = "";
    for (const wd of words) { if ((cur + " " + wd).trim().length > max && cur) { lines.push(cur); cur = wd; } else cur = (cur + " " + wd).trim(); }
    if (cur) lines.push(cur);
    onWall(big.m, p, cx, 2.75, 0.04);
    st.reveal = { big, lines, total: lines.join("").length, t: 0, p, x: cx };
  }

  function update(dt, pos) {
    let redraw = false;
    const W = theWall();
    const here = W && visible(W.mesh) && W.panels.some((p) => pos.x >= p.x0 - 4 && pos.x <= p.x1 + 4 && Math.abs(p.z - pos.z) < 6);
    // the archway: grows in when first opened, glows while near, and takes the visitor through
    if (st.arch) {
      const A = st.arch, d = Math.hypot(pos.x - A.at.x, pos.z - A.at.z);
      if (A.grow < 1) { A.grow = Math.min(1, A.grow + dt / 1.6); A.fx.group.scale.setScalar(Math.max(0.001, 1 - Math.pow(1 - A.grow, 3))); redraw = true; }
      if (d < 22 && visible(A.fx.group.parent || A.fx.group)) { if (A.fx.update(dt)) redraw = true; }
      if (!A.fired && A.grow >= 1 && Math.abs(pos.x - A.at.x) < 0.7 && (pos.z - A.at.z) * A.at.nz < 0.85) { A.fired = true; go(HREF); }
      if (A.fired && d > 1.6) A.fired = false;
    }
    // the read-out: the wall holds still, the message writes itself out, then the archway opens
    if (st.reveal) {
      const R = st.reveal; R.t += dt; redraw = true;
      const n = Math.floor(R.t * 9);
      draw(R.big, R.lines, 96, "#f2f6ff", n); R.big.m.material.opacity = Math.min(1, R.t * 2);
      if (R.t > R.total / 9 + 2.6) {
        const k = Math.max(0, 1 - (R.t - R.total / 9 - 2.6) / 1.2); R.big.m.material.opacity = k;
        if (st.line) st.line.m.material.opacity = k;
        if (!st.arch) openArch({ x: R.x, z: R.p.z, nz: R.p.nz }, true);
        if (k <= 0) {
          scene.remove(R.big.m); R.big.tex.dispose(); st.reveal = null; st.got = 0;
          if (W) W.U.held = false;
        }
      }
      return redraw;
    }
    if (st.line && st.line.fadeOut > 0) {
      st.line.fadeOut = Math.max(0, st.line.fadeOut - dt * 1.5); st.line.m.material.opacity = st.line.fadeOut; redraw = true;
    }
    // the gold signs
    const G = st.gold;
    if (G) {
      G.t += dt; G.y -= FALL * dt; redraw = true;
      // a Rolodex turn now and then, to another sign of the same script
      const ph = (G.t % G.flipT) / G.flipT; goldU.uFlip.value = Math.max(0.04, Math.min(1, ph / 0.1, (1 - ph) / 0.1));
      if (ph < 0.5 && G.last >= 0.5) { G.cell = G.set.start + Math.floor(Math.random() * G.set.len); goldU.uCell.value = G.cell; }
      G.last = ph;
      const fadeIn = Math.min(1, G.t / 0.8), fadeOut = THREE.MathUtils.clamp((G.y - G.p.y0 - 0.25) / 0.6, 0, 1);
      goldU.uA.value = fadeIn * fadeOut;
      onWall(goldMesh, G.p, G.x, G.y, 0.035);
      if (fadeOut <= 0 || !here) { st.gold = null; goldMesh.visible = false; st.wait = rnd(...NEXT); }
    } else if (here) {
      st.wait -= dt;
      if (st.wait <= 0 && !spawn(pos)) st.wait = 1.5;
    }
    return redraw;
  }

  function hitGold() {
    if (!st.gold || goldU.uA.value < 0.2) return false;
    goldMesh.updateMatrixWorld(true);
    return ray.intersectObject(goldHit, false).length > 0;
  }
  function tap(cx, cy) {
    ndc.set(cx, cy); ray.setFromCamera(ndc, camera); ray.far = 12;
    if (st.arch && st.arch.grow >= 1 && visible(st.arch.fx.group)) {
      st.arch.fx.group.updateMatrixWorld(true);
      if (ray.intersectObject(st.arch.hit, false).length) { st.arch.fired = true; go(HREF); return true; }
    }
    if (st.reveal) return false;
    if (hitGold()) { const G = st.gold; st.gold = null; goldMesh.visible = false; st.wait = rnd(...NEXT) * 0.6; addWord(G.p, G.x); return true; }
    // a white sign: the line starts again
    const W = theWall();
    if (st.got && W && visible(W.mesh) && ray.intersectObject(W.mesh, false).length) return reset();
    return false;
  }
  // the keyboard: Enter takes a gold sign that is in view and near
  function key() {
    if (!st.gold) return false;
    tmp.set(st.gold.x, st.gold.y, st.gold.p.z).project(camera);
    if (Math.abs(tmp.x) > 0.9 || Math.abs(tmp.y) > 0.9 || tmp.z > 1) return false;
    return tap(tmp.x, tmp.y);
  }
  // test hooks: show a gold sign now, take every word, forget the archway
  const debug = {
    spawn: (pos) => { st.wait = 0; return spawn(pos); },
    solve: (pos) => { const W = theWall(); if (!W) return false; const p = W.panels.filter((q) => q.x1 - q.x0 > 5).sort((a, b) => Math.hypot((a.x0 + a.x1) / 2 - pos.x, a.z - pos.z) - Math.hypot((b.x0 + b.x1) / 2 - pos.x, b.z - pos.z))[0]; while (st.got < words.length) addWord(p, THREE.MathUtils.clamp(pos.x, p.x0, p.x1)); return { x: pos.x, z: p.z, nz: p.nz }; },
    forget: () => { try { store.set(KEY, ""); } catch (e) { /* ignore */ } },
    get state() { return { got: st.got, words: words.length, gold: !!st.gold, reveal: !!st.reveal, arch: !!st.arch, grown: st.arch ? +st.arch.grow.toFixed(2) : 0 }; },
    get gold() { return st.gold ? { x: st.gold.x, y: st.gold.y, z: st.gold.p.z } : null; }
  };
  return { update, tap, key, debug };
}
