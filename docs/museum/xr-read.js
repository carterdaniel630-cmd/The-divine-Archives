// Pointing at a relic in the VR headset and reading its label (VR loop piece "controllers + select → plaques").
// It answers item 5 of Carter's first headset walk (handoff/field-report-2026-11-16-vr-walk.md: "relics not
// clickable"). Spec: handoff/vr-interaction-spec.md §1 row 4 (a trigger TAP on the ray's target opens the reading;
// a press held past 200 ms is the teleport arc instead and never selects) and row 9 (B closes), §3 (the ray, shown only
// while a hand is raised above the waist), §4.2 (the reading carries the object's dated / held / category lines and
// every honesty flag); handoff/vr-comfort-brief.md §c.10–§c.14 (body ≥ 1.3°, titles ≥ 1.8°, reading distance
// 0.8–2.5 m, plaque height and tilt), §d.15 (seated: heights re-anchor; also handoff/vr-pilot-spec.md §15), §e.22
// (nothing within 0.8 m of the eyes). Scope: the three pilot rooms only (the Rotunda, ch02 Egypt, ch03 Mesopotamia);
// elsewhere the ray stays plain and a tap does nothing.
//
// The reading plaque is the flat card's own text (app.js cardHTML, one source for both), set on a dark slab with cream
// lettering that stands in the world beside the line to the relic, about 1.4 m from the visitor, facing them, never
// head-locked. It pages rather than cutting text: pointing at it and tapping turns to the next page, and on the last
// page closes it. Tapping at nothing, pressing B, or walking more than 3.5 m away also closes it.
//
// Pending review (Carter's OQ-4, decisions-2026-11-01-vr-questions.md: pending material is curtained in VR until its
// walkthrough; ch02 Egypt is open by his 2026-11-16 ruling): a pending element's reading names it and says it is
// pending, and holds its text back. app.js decides which elements those are; this module only draws what it is given.
//
// Left for later pieces (spec §3, not built here): the warm "shaft of light" beam with motes (artistry pass), near-field
// poke and magnification, grabbing a facsimile, gaze + dwell, the settings stele's dominant-hand choice.
import * as THREE from "three";

export const READ = {
  DIST: 1.4, NEAR: [1.1, 0.9],   // m from the head (Comfort §c.12: 0.8–2.5 m); never farther than DIST, where sizes are set
  SIDE: [0.42, -0.42, 0.8, -0.8, 0, 1.2, -1.2],   // rad off the line to the relic, tried in order (beside it, not over it)
  W: 1.1, H: 0.9, PX: 768,       // panel, m; canvas pixels per metre
  TILT: 8 * Math.PI / 180,       // tilted back when below eye level (§c.14: 5–10°)
  REACH: 8,                      // m: how far the ray reaches for a relic
  RAY: 3,                        // m: the ray's length when it meets nothing
  WAIST: 0.7,                    // m below the eyes: a hand lower than this hides its ray (§3)
  AWAY: 3.5,                     // m: the plaque closes when the visitor is farther than this from it
  B: 5                           // xr-standard button index of B (right hand) / Y (left hand)
};

// the angle a cap height subtends at a distance, in degrees
export function capAngle(capMetres, dist) { return 2 * Math.atan(capMetres / 2 / dist) * 180 / Math.PI; }

// The flat card's HTML as plain blocks to set on the plaque: { k: "cat"|"title"|"flag"|"meta"|"body"|"contested"|"item", t }.
// Links, buttons, drawings and the walkthrough slot are left out (they are the flat page's), and `links` says whether
// the card had any, so the plaque can say where the sources are.
export function blocksFromHTML(html) {
  const box = document.createElement("div");
  box.innerHTML = html;
  let links = false;
  box.querySelectorAll(".mu-actions, a, button, [data-rituals-for]").forEach((el) => { if (el.matches(".mu-actions, a")) links = true; el.remove(); });
  box.querySelectorAll(".mu-art, svg, img, script, style").forEach((el) => el.remove());
  box.querySelectorAll("br").forEach((el) => el.replaceWith("\n"));
  const out = [];
  const text = (el) => el.textContent.split("\n").map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
  const push = (k, el) => { for (const t of text(el)) out.push({ k, t: t.replace(/\s*·\s*$/, "") }); };
  const walk = (parent) => {
    for (const el of Array.from(parent.children)) {
      const c = el.classList;
      if (c.contains("mu-cat")) push("cat", el);
      else if (/^H[1-4]$/.test(el.tagName)) push("title", el);
      else if (c.contains("mu-flag")) push("flag", el);
      else if (c.contains("mu-contested")) push("contested", el);
      else if (c.contains("mu-meta")) push("meta", el);
      else if (el.tagName === "UL" || el.tagName === "OL") for (const li of el.children) push("item", li);
      else if (el.tagName === "P") push("body", el);
      else if (el.children.length) walk(el);
      else push("body", el);
    }
  };
  walk(box);
  return { blocks: out, links };
}

// Lay blocks out into pages of lines that fit the panel. measure(font, text) → px; fonts and line heights from sizes.
// Pure apart from measure, so the checks can read it without a headset.
export function layout(blocks, { measure, width, height, body, title, footer }) {
  const style = {
    cat: { font: `600 ${body}px Georgia, serif`, lh: body * 1.3, col: "#c9a464" },
    title: { font: `600 ${title}px Cinzel, Georgia, serif`, lh: title * 1.25, col: "#f3e6c8" },
    flag: { font: `italic 600 ${body}px Georgia, serif`, lh: body * 1.3, col: "#f0c98a" },
    meta: { font: `400 ${body}px Georgia, serif`, lh: body * 1.3, col: "#d9c9a6" },
    contested: { font: `italic 400 ${body}px Georgia, serif`, lh: body * 1.3, col: "#f3e6c8" },
    body: { font: `400 ${body}px Georgia, serif`, lh: body * 1.3, col: "#f3e6c8" },
    item: { font: `400 ${body}px Georgia, serif`, lh: body * 1.3, col: "#f3e6c8" },
    note: { font: `italic 400 ${body}px Georgia, serif`, lh: body * 1.3, col: "#d9c9a6" }
  };
  const lines = [];
  for (const b of blocks) {
    const s = style[b.k] || style.body, words = (b.k === "item" ? "• " + b.t : b.k === "flag" ? "◆ " + b.t : b.t).split(" ");
    if (lines.length && (b.k === "body" || b.k === "contested" || b.k === "note" || b.k === "title")) lines.push({ gap: s.lh * 0.35 });
    let cur = "";
    for (const w of words) {
      const next = cur ? cur + " " + w : w;
      if (cur && measure(s.font, next) > width) { lines.push({ k: b.k, t: cur, font: s.font, lh: s.lh, col: s.col }); cur = b.k === "item" ? "  " + w : w; }
      else cur = next;
    }
    if (cur) lines.push({ k: b.k, t: cur, font: s.font, lh: s.lh, col: s.col });
  }
  // pages: fill to the height left above the footer line; a page never starts with a gap
  const room = height - footer, pages = [];
  let page = [], used = 0;
  for (const l of lines) {
    const h = l.gap || l.lh;
    if (l.gap && !page.length) continue;
    if (page.length && used + h > room) { pages.push(page); page = []; used = 0; if (l.gap) continue; }
    page.push(l); used += h;
  }
  if (page.length) pages.push(page);
  let over = null;
  for (const l of lines) if (!l.gap && measure(l.font, l.t) > width + 0.5) over = l.t;   // a single word wider than the panel
  return { pages: pages.length ? pages : [[]], overflow: over };
}

export function footerText(page, pages) { return pages > 1 && page < pages - 1 ? `Point here and tap: next page (${page + 1} of ${pages})` : pages > 1 ? `Point here and tap: close (${page + 1} of ${pages})` : "Point here and tap: close"; }

// camera, rig, scene: the museum's own and xr.js's rig; floorY: museum floor; pick(origin, dir, far): the pilot-room
// exhibit a ray meets first, not through a wall ({ ex, dist } or null); reading(ex): { blocks, links, held } for it
// (null: nothing to read); clear(ax, az, bx, bz): is the line between two floor points free of walls?
// posture(): "standing" | "seated"; eye(): eye height above the museum floor (null if not yet measured).
export function createXRRead({ camera, rig, scene, floorY = 0, pick, reading, clear, posture, eye }) {
  const dbg = { open: false, id: null, type: null, held: false, page: 0, pages: 0, lines: null, footer: null, title: null, placed: null, dist: null, y: null, posture: null, hover: null, hoverPanel: false, opens: 0, closes: 0, taps: 0, rays: 0, overflow: null, bodyDeg: null, titleDeg: null, minDist: null, reanchors: 0 };
  const W = Math.round(READ.W * READ.PX), Hh = Math.round(READ.H * READ.PX), pad = 44;
  const capPx = (deg) => 2 * READ.DIST * Math.tan(deg / 2 * Math.PI / 180) * READ.PX;
  const bodyPx = Math.ceil(capPx(1.4) / 0.69), titlePx = Math.ceil(capPx(1.9) / 0.7);
  dbg.bodyDeg = +capAngle(bodyPx * 0.69 / READ.PX, READ.DIST).toFixed(2);
  dbg.titleDeg = +capAngle(titlePx * 0.7 / READ.PX, READ.DIST).toFixed(2);

  const panel = new THREE.Group(); panel.name = "xr-read"; panel.visible = false; scene.add(panel);
  let canvas = null, tex = null, face = null, rays = [], live = false, cur = null, pagesNow = null, page = 0, placedPosture = null;
  const head = new THREE.Vector3(), o = new THREE.Vector3(), q = new THREE.Quaternion(), d = new THREE.Vector3(), r = new THREE.Raycaster();

  // built on the first entry into VR only, so a phone or a computer without a headset never pays for it
  function build(ctrls) {
    if (!canvas) {
      canvas = document.createElement("canvas"); canvas.width = W; canvas.height = Hh;
      tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const back = new THREE.Mesh(new THREE.BoxGeometry(READ.W + 0.06, READ.H + 0.06, 0.04), new THREE.MeshBasicMaterial({ color: "#8a6a3a", fog: false, toneMapped: false }));
      back.position.z = -0.025;
      face = new THREE.Mesh(new THREE.PlaneGeometry(READ.W, READ.H), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false }));
      panel.add(back, face);
    }
    // a plain gold ray from each hand along its pointing direction, and a bead where it meets something readable
    if (!rays.length) {
      const dotGeo = new THREE.SphereGeometry(0.014, 10, 6);
      rays = ctrls.map((c) => {
        const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 0, -READ.RAY]), 3));
        const m = new THREE.LineBasicMaterial({ color: "#e0b252", transparent: true, opacity: 0.45, fog: false, toneMapped: false });
        const line = new THREE.Line(g, m); line.frustumCulled = false; line.visible = false; line.name = "xr-ray";
        const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: "#f3d68a", fog: false, toneMapped: false }));
        dot.visible = false; line.add(dot);
        c.add(line);
        return { c, line, dot, hit: null };
      });
    }
  }

  const measure = (font, t) => { const g = canvas.getContext("2d"); g.font = font; return g.measureText(t).width; };

  function draw() {
    if (!canvas || !pagesNow) return;
    const g = canvas.getContext("2d");
    g.fillStyle = "#140c07"; g.fillRect(0, 0, W, Hh);
    g.strokeStyle = dbg.hoverPanel ? "#e0b252" : "#6b5230"; g.lineWidth = dbg.hoverPanel ? 10 : 6; g.strokeRect(8, 8, W - 16, Hh - 16);
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    let y = pad;
    const lines = pagesNow.pages[page] || [];
    for (const l of lines) {
      if (l.gap) { y += l.gap; continue; }
      y += l.lh; g.font = l.font; g.fillStyle = l.col; g.fillText(l.t, pad, y - l.lh * 0.25);
    }
    const ft = footerText(page, pagesNow.pages.length);
    g.font = `italic 400 ${bodyPx}px Georgia, serif`; g.fillStyle = "#c9a464";
    g.fillText(ft, pad, Hh - pad + bodyPx * 0.2);
    if (measure(g.font, ft) > W - pad * 2) dbg.overflow = ft;
    tex.needsUpdate = true;
    dbg.lines = lines.filter((l) => !l.gap).map((l) => l.t); dbg.footer = ft; dbg.page = page; dbg.pages = pagesNow.pages.length;
  }

  // the panel's centre height: a little below the eyes, inside the standing (1.35–1.55 m) or seated (0.9–1.1 m) band of
  // Comfort §c.14, re-anchored whenever the posture changes
  function setY() {
    const p = posture ? posture() : "standing", e = eye ? eye() : null;
    const lo = p === "seated" ? 0.9 : 1.35, hi = p === "seated" ? 1.1 : 1.55, eh = e == null || !isFinite(e) ? (p === "seated" ? 1.2 : 1.62) : e;
    panel.position.y = floorY + Math.min(hi, Math.max(lo, eh - 0.2));
    placedPosture = p; dbg.posture = p; dbg.y = +panel.position.y.toFixed(3);
  }

  // beside the line from the head to the relic, on lines no wall crosses (centre and both edges)
  function place(target) {
    camera.getWorldPosition(head);
    const yaw0 = Math.atan2(target.x - head.x, target.z - head.z);
    let pickd = null;
    for (const dd of [READ.DIST].concat(READ.NEAR)) {
      for (const a of READ.SIDE) {
        const yaw = yaw0 + a, x = head.x + Math.sin(yaw) * dd, z = head.z + Math.cos(yaw) * dd;
        const ex = Math.cos(yaw) * READ.W / 2, ez = -Math.sin(yaw) * READ.W / 2;
        if (!clear || (clear(head.x, head.z, x, z) && clear(head.x, head.z, x + ex, z + ez) && clear(head.x, head.z, x - ex, z - ez))) { pickd = [dd, a]; break; }
      }
      if (pickd) break;
    }
    if (!pickd) pickd = [READ.NEAR[READ.NEAR.length - 1], 0];
    const yaw = yaw0 + pickd[1];
    panel.position.set(head.x + Math.sin(yaw) * pickd[0], 0, head.z + Math.cos(yaw) * pickd[0]);
    setY();
    panel.rotation.set(0, 0, 0, "YXZ");
    panel.rotation.y = Math.atan2(head.x - panel.position.x, head.z - panel.position.z);
    panel.rotation.x = panel.position.y < head.y ? -READ.TILT : 0;
    dbg.dist = +pickd[0].toFixed(2); dbg.placed = [+panel.position.x.toFixed(2), +panel.position.z.toFixed(2)];
    // the nearest point of the panel to the eyes (Comfort §e.22: nothing within 0.8 m)
    panel.updateMatrixWorld(true);
    let m = Infinity; for (const [u, v] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0], [-1, 0], [1, 0]]) { const p = new THREE.Vector3(u * READ.W / 2, v * READ.H / 2, 0); panel.localToWorld(p); m = Math.min(m, p.distanceTo(head)); }
    dbg.minDist = +m.toFixed(2);
  }

  function open(ex, at) {
    const rd = reading ? reading(ex) : null;
    if (!rd || !rd.blocks || !rd.blocks.length) return false;
    const blocks = rd.blocks.slice();
    if (rd.note) blocks.push({ k: "note", t: rd.note });
    if (rd.links && !rd.held) blocks.push({ k: "note", t: "Its sources and evidence are on its page in the archive." });
    pagesNow = layout(blocks, { measure, width: W - pad * 2, height: Hh - pad * 2, body: bodyPx, title: titlePx, footer: bodyPx * 1.6 });
    dbg.overflow = pagesNow.overflow;
    cur = ex; page = 0; dbg.hoverPanel = false;
    place(at || ex.center);
    panel.visible = true;
    const tb = blocks.find((b) => b.k === "title");
    dbg.open = true; dbg.id = ex.data.id || null; dbg.type = ex.data.type; dbg.held = !!rd.held; dbg.title = tb ? tb.t : null; dbg.opens++;
    draw();
    return true;
  }
  function close() {
    if (!cur) return false;
    cur = null; pagesNow = null; panel.visible = false; dbg.open = false; dbg.hoverPanel = false; dbg.closes++;
    return true;
  }

  function rayOf(c) { c.getWorldPosition(o); c.getWorldQuaternion(q); d.set(0, 0, -1).applyQuaternion(q); return { o, d }; }
  function panelHit(c) {
    if (!panel.visible || !face) return null;
    const { o: oo, d: dd } = rayOf(c); r.set(oo, dd); r.far = 6;
    const h = r.intersectObject(face, false)[0]; return h ? h.distance : null;
  }

  // a short trigger press: the panel first (next page / close), then a relic (open its reading), then nothing (close)
  function tap(c) {
    if (!live) return false;
    dbg.taps++;
    if (panelHit(c) != null) { if (pagesNow && page < pagesNow.pages.length - 1) { page++; draw(); } else close(); return true; }
    const { o: oo, d: dd } = rayOf(c), h = pick ? pick(oo.clone(), dd.clone(), READ.REACH) : null;
    if (h && h.ex) { if (cur === h.ex) return true; return open(h.ex) || !!close(); }
    return close();
  }

  function attach(ctrls) { build(ctrls); live = true; close(); dbg.closes = 0; prevB = new Map(); }
  function detach() { if (!live) return; close(); live = false; rays.forEach((x) => { x.line.visible = false; x.dot.visible = false; }); }

  let prevB = new Map();
  // inputs: [{ ctrl, source }] for the connected hands
  function update(dt, inputs) {
    if (!live) return;
    camera.getWorldPosition(head);
    let hovPanel = false, hover = null, shown = 0;
    for (const x of rays) {
      const inp = inputs && inputs.find((i) => i.ctrl === x.c);
      if (!inp) { x.line.visible = false; continue; }
      x.c.getWorldPosition(o);
      const raised = o.y > head.y - READ.WAIST;
      if (!raised) { x.line.visible = false; x.dot.visible = false; continue; }
      shown++;
      let len = READ.RAY, hit = false;
      const ph = panelHit(x.c);
      if (ph != null) { len = ph; hit = true; hovPanel = true; }
      else {
        const { o: oo, d: dd } = rayOf(x.c), h = pick ? pick(oo.clone(), dd.clone(), READ.REACH) : null;
        if (h && h.ex) { len = h.dist; hit = true; hover = h.ex.data.id || h.ex.data.type; }
      }
      const a = x.line.geometry.attributes.position; a.setZ(1, -len); a.needsUpdate = true; x.line.geometry.computeBoundingSphere();
      x.line.material.opacity = hit ? 0.9 : 0.45; x.line.visible = true;
      x.dot.position.set(0, 0, -len); x.dot.visible = hit;
    }
    // B on the right hand closes the reading (spec §1 row 9), raised or not; Y on the left is kept for the return to
    // the Rotunda (row 10), so it does nothing here
    for (const inp of inputs || []) {
      const gp = inp.source && inp.source.gamepad, bb = !!(gp && gp.buttons && gp.buttons[READ.B] && gp.buttons[READ.B].pressed);
      if (inp.source && inp.source.handedness === "right" && bb && !prevB.get(inp.ctrl)) close();
      prevB.set(inp.ctrl, bb);
    }
    dbg.rays = shown; dbg.hover = hover;
    if (cur) {
      if (posture && posture() !== placedPosture) { setY(); panel.updateMatrixWorld(true); dbg.reanchors++; }   // seated ↔ standing (§d.15)
      if (Math.hypot(head.x - panel.position.x, head.z - panel.position.z) > READ.AWAY) close();
    }
    if (hovPanel !== dbg.hoverPanel) { dbg.hoverPanel = hovPanel; draw(); }
  }

  return { attach, detach, update, tap, open, close, panel, debug: dbg, get rays() { return rays; }, image: () => (canvas ? canvas.toDataURL("image/png") : null) };
}
