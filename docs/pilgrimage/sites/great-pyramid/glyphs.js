/* The Great Pyramid: hieroglyphs drawn in our own hand.

   Only one group of signs is drawn as the real signs: Khufu's name, Ḫwfw, in its
   cartouche, read top to bottom:
     Aa1 (a round sign crossed by lines, read ḫ), G43 (the quail chick, w),
     I9 (the horned viper, f), G43 again (w).
   The sign values are the standard ones of Gardiner's sign list; the shapes are
   our own drawing, not traced from any inscription. Everything else on the site
   that looks like writing (the Lepsius slab, the builders' gang marks other than
   the cartouche) is labelled on site as illustrative marks.

   Each sign is a path in a 100 × 100 cell, usable both in an SVG (info cards)
   and on a canvas (boards and painted marks in the 3D scene) through Path2D. */

// [path, fill?] per sign, facing left (a sign faces the start of its line)
const SIGNS = {
  Aa1: { h: 0.82, d: "M16 50 A34 34 0 1 0 84 50 A34 34 0 1 0 16 50 Z M22 34 H78 M16 50 H84 M22 66 H78", fill: false },
  G43: { h: 1.0, d: "M26 30 C28 20 42 18 46 28 C58 26 72 32 80 44 L88 40 L84 52 C84 66 72 74 58 74 L46 74 C34 74 28 64 30 52 C31 44 34 40 38 38 L22 36 Z M48 74 L46 90 L38 92 M62 74 L64 90 L56 92", fill: true, legs: "M48 74 L46 90 L38 92 M62 74 L64 90 L56 92" },
  I9: { h: 0.62, d: "M12 62 C12 52 24 48 34 54 C48 62 62 64 74 58 C82 54 86 46 86 36", fill: false, horns: "M22 52 L19 40 M30 53 L30 41", w: 9 }
};
export const KHUFU = ["Aa1", "G43", "I9", "G43"];

// an SVG of the cartouche, for the info cards; labels name each sign
export function cartoucheSVG(o) {
  o = o || {};
  const col = o.color || "#e7c680", ink = o.ink || "#e7c680", W = 120, cell = 78, pad = 16;
  let y = pad + 8, parts = "";
  const rows = [];
  for (const s of KHUFU) {
    const S = SIGNS[s], h = cell * S.h, k = cell / 100, x = (W - cell) / 2;
    rows.push({ s, y: y + h / 2 });
    const tf = `translate(${x} ${y - (cell - h) / 2}) scale(${k})`;
    if (s === "G43") parts += `<g transform="${tf}"><path d="${S.d.split(" M48")[0]}" fill="${ink}" stroke="${ink}" stroke-width="2"/><path d="${S.legs}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    else if (s === "I9") parts += `<g transform="${tf}"><path d="${S.d}" fill="none" stroke="${ink}" stroke-width="${S.w}" stroke-linecap="round"/><path d="${S.horns}" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/></g>`;
    else parts += `<g transform="${tf}"><path d="${S.d}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/></g>`;
    y += h + 6;
  }
  const H = y + pad;
  const label = (r) => `<text x="${W + 14}" y="${r.y + 5}" font-size="15" fill="#cdbb96" font-family="Georgia,serif">${{ Aa1: "Aa1 · ḫ (kh)", G43: "G43 · w", I9: "I9 · f" }[r.s]}</text>`;
  return `<svg viewBox="0 0 ${W + 150} ${H + 34}" width="100%" style="max-width:300px" role="img" aria-label="Khufu's name in hieroglyphs, in its cartouche: four signs read kh, w, f, w. Our own drawing.">` +
    `<rect x="8" y="6" width="${W - 16}" height="${H - 12}" rx="${(W - 16) / 2.4}" fill="none" stroke="${col}" stroke-width="3"/>` +
    `<line x1="22" y1="${H + 2}" x2="${W - 22}" y2="${H + 2}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>` +
    parts + rows.map(label).join("") +
    `<text x="0" y="${H + 30}" font-size="14" fill="#cdbb96" font-style="italic" font-family="Georgia,serif">Ḫwfw, &ldquo;Khufu&rdquo;. Our drawing; read top to bottom.</text></svg>`;
}

// draw the cartouche on a canvas, centred on (cx, top), cell size in px; style: "ink" (board) or "ochre" (builders' paint)
export function drawCartouche(g, cx, top, cell, style) {
  const ochre = style === "ochre", ink = ochre ? "rgba(168,52,30,.86)" : "#e7c680";
  const W = cell * 1.2;
  let y = top + cell * 0.14;
  const heights = KHUFU.map((s) => cell * SIGNS[s].h);
  const H = heights.reduce((a, b) => a + b, 0) + cell * 0.06 * KHUFU.length + cell * 0.28;
  g.save();
  g.lineCap = "round"; g.lineJoin = "round";
  if (ochre) { g.shadowColor = "rgba(120,30,15,.35)"; g.shadowBlur = cell * 0.04; }
  g.strokeStyle = ink; g.lineWidth = cell * 0.035;
  roundRect(g, cx - W / 2, top, W, H, W / 2.4); g.stroke();
  g.lineWidth = cell * 0.06; g.beginPath(); g.moveTo(cx - W / 2 + cell * 0.12, top + H + cell * 0.07); g.lineTo(cx + W / 2 - cell * 0.12, top + H + cell * 0.07); g.stroke();
  KHUFU.forEach((s, i) => {
    const S = SIGNS[s], h = heights[i], k = cell / 100;
    g.save(); g.translate(cx - cell / 2, y - (cell - h) / 2); g.scale(k, k);
    g.strokeStyle = ink; g.fillStyle = ink;
    if (s === "G43") { g.lineWidth = 2; const body = new Path2D(S.d.split(" M48")[0]); g.fill(body); g.stroke(body); g.lineWidth = 5; g.stroke(new Path2D(S.legs)); }
    else if (s === "I9") { g.lineWidth = S.w; g.stroke(new Path2D(S.d)); g.lineWidth = 4; g.stroke(new Path2D(S.horns)); }
    else { g.lineWidth = 5; g.stroke(new Path2D(S.d)); }
    g.restore();
    y += h + cell * 0.06;
  });
  g.restore();
  return { w: W, h: H + cell * 0.1 };
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
}

// illustrative marks in columns (not a text): used for the Lepsius slab, labelled so on site
export function drawColumns(g, x, y, w, h, cols, seed, ink) {
  let s = seed || 3; const R = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const cw = w / cols; g.save(); g.strokeStyle = ink; g.fillStyle = ink; g.lineCap = "round"; g.lineWidth = cw * 0.07;
  for (let c = 0; c < cols; c++) {
    const x0 = x + c * cw;
    g.globalAlpha = 0.35; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0, y + h); g.stroke(); g.globalAlpha = 1;
    let yy = y + cw * 0.3;
    while (yy < y + h - cw * 0.5) {
      const t = R(), sz = cw * (0.32 + R() * 0.3), cx = x0 + cw / 2;
      g.beginPath();
      if (t < 0.25) { g.arc(cx, yy + sz / 2, sz / 2.2, 0, Math.PI * 2); g.stroke(); }
      else if (t < 0.45) { g.moveTo(cx - sz / 2, yy + sz / 2); g.lineTo(cx + sz / 2, yy + sz / 2); g.stroke(); }
      else if (t < 0.6) { g.moveTo(cx - sz / 3, yy); g.lineTo(cx - sz / 3, yy + sz); g.moveTo(cx + sz / 3, yy); g.lineTo(cx + sz / 3, yy + sz); g.stroke(); }
      else if (t < 0.75) { g.moveTo(cx - sz / 2, yy + sz); g.quadraticCurveTo(cx, yy - sz * 0.3, cx + sz / 2, yy + sz); g.stroke(); }
      else if (t < 0.88) { g.fillRect(cx - sz / 2, yy + sz * 0.3, sz, sz * 0.35); }
      else { g.moveTo(cx - sz / 2, yy + sz); g.lineTo(cx, yy); g.lineTo(cx + sz / 2, yy + sz); g.stroke(); }
      yy += sz + cw * 0.18;
    }
  }
  g.restore();
}
