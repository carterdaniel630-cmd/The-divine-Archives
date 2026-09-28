/* ==========================================================================
   THE DIVINE ARCHIVES — Archive Chess: the pieces and the board (art only)

   Every piece is a small statuette of the god it stands for, drawn on a canvas:
   ivory and gold leaf for White, obsidian and bronze for Black, each keeping the
   silhouette of its chess role (the king tallest, the rook a tower, the knight
   an animal head, the pawn small) and carrying its god's traditional attribute:

     Olympians  K Zeus (laurel, thunderbolt)   Q Athena (crested helmet, aegis)
                R Poseidon (trident, waves)     B Apollo (lyre, sun rays)
                N Ares (crested war-horse)      P Initiate of Eleusis (torch)
     Ennead     K Osiris (atef crown, crook and flail)  Q Ma'at (ostrich feather)
                R Ra (pylon, sun disk)          B Thoth (ibis head, moon)
                N Anubis (jackal head)          P Eye of Horus (wedjat stele)
     Aesir      K Odin (winged helm, spear)     Q Freyja (necklace, falcon cloak)
                R Yggdrasil (the world-tree)    B Baldr (radiant halo)
                N Thor (goat head, hammer)      P Einherjar (shield warrior)

   These are interpretive emblems built from traditional attributes, not copies
   of any ancient image. window.ChessArt.sprite(pantheon, role, side, px) returns a
   cached canvas; window.ChessArt.board(px, dpr) returns the framed board.
   ========================================================================== */
(function () {
  "use strict";

  var MAT = {
    w: { body: ["#6b4c24", "#f8ebc6", "#e6cf97", "#b08a52", "#5e4320"], trim: ["#fff0b8", "#e3b85a", "#8c6322"], line: "rgba(52,34,12,.78)", shade: "rgba(90,62,24,.35)", eye: "#3a2610" },
    b: { body: ["#08070d", "#6d6690", "#36304c", "#1a1628", "#050409"], trim: ["#f0cf8a", "#b0823f", "#5a3b16"], line: "rgba(0,0,0,.85)", shade: "rgba(0,0,0,.35)", eye: "#e7c680" }
  };
  var GEM = { greek: "#9fd8ff", egyptian: "#3fd2c4", norse: "#b79cff" };

  function bodyGrad(c, m, x0, x1) {
    var g = c.createLinearGradient(x0, 0, x1, 0), s = m.body;
    g.addColorStop(0, s[0]); g.addColorStop(0.28, s[1]); g.addColorStop(0.5, s[2]); g.addColorStop(0.8, s[3]); g.addColorStop(1, s[4]);
    return g;
  }
  function trimGrad(c, m, y0, y1) { var g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, m.trim[0]); g.addColorStop(0.5, m.trim[1]); g.addColorStop(1, m.trim[2]); return g; }

  // draw one piece in unit space (centre 0,0; the piece spans about -0.46..0.44 in y)
  function paint(c, pan, role, side) {
    var m = MAT[side], gem = GEM[pan] || "#fff";
    c.lineJoin = "round"; c.lineCap = "round";
    function P() { c.beginPath(); }
    function fillBody(x0, x1) { c.fillStyle = bodyGrad(c, m, x0, x1); c.fill(); c.strokeStyle = m.line; c.lineWidth = 0.018; c.stroke(); }
    function fillTrim(y0, y1) { c.fillStyle = trimGrad(c, m, y0, y1); c.fill(); c.strokeStyle = m.line; c.lineWidth = 0.014; c.stroke(); }
    function ell(x, y, rx, ry) { c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); }
    function glint(x, y, r) { var g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.35, gem); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; P(); c.arc(x, y, r, 0, 7); c.fill(); }
    function gemAt(x, y, r) { P(); c.arc(x, y, r, 0, 7); c.fillStyle = gem; c.fill(); c.strokeStyle = m.line; c.lineWidth = 0.01; c.stroke(); P(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.35, 0, 7); c.fillStyle = "rgba(255,255,255,.8)"; c.fill(); }

    // ---- turned plinth, common to all pieces ----
    function plinth(w) {
      w = w || 0.3;
      P(); ell(0, 0.415, w, 0.055); fillBody(-w, w);
      P(); c.moveTo(-w, 0.415); c.lineTo(-w, 0.37); c.lineTo(w, 0.37); c.lineTo(w, 0.415); c.closePath(); fillBody(-w, w);
      P(); ell(0, 0.37, w, 0.05); fillTrim(0.32, 0.42);
      P(); ell(0, 0.335, w * 0.78, 0.04); fillBody(-w * 0.8, w * 0.8);
    }
    // a column-like body tapering to a waist, with fluting
    function column(top, wTop, wBot, flutes) {
      P(); c.moveTo(-wBot, 0.33); c.bezierCurveTo(-wBot * 0.9, 0.18, -wTop * 1.05, top + 0.12, -wTop, top); c.lineTo(wTop, top);
      c.bezierCurveTo(wTop * 1.05, top + 0.12, wBot * 0.9, 0.18, wBot, 0.33); c.closePath(); fillBody(-wBot, wBot);
      if (flutes) { c.strokeStyle = m.shade; c.lineWidth = 0.008; for (var i = -2; i <= 2; i++) { P(); c.moveTo(i * wBot * 0.32, 0.31); c.lineTo(i * wTop * 0.36, top + 0.03); c.stroke(); } }
      P(); ell(0, top, wTop * 1.25, 0.03); fillTrim(top - 0.03, top + 0.03);
    }
    function head(y, r) { P(); c.arc(0, y, r, 0, 7); fillBody(-r, r); }
    function face(y, r, beard) {
      head(y, r);
      // brow and closed, carved eyes: a statue's calm, not a cartoon's
      c.strokeStyle = m.line; c.lineWidth = r * 0.12; c.globalAlpha = 0.55;
      P(); c.moveTo(-r * 0.5, y - r * 0.08); c.quadraticCurveTo(-r * 0.3, y - r * 0.18, -r * 0.12, y - r * 0.08); c.moveTo(r * 0.12, y - r * 0.08); c.quadraticCurveTo(r * 0.3, y - r * 0.18, r * 0.5, y - r * 0.08); c.stroke();
      c.globalAlpha = 1;
      P(); c.moveTo(0, y - r * 0.05); c.lineTo(-r * 0.08, y + r * 0.28); c.lineTo(r * 0.06, y + r * 0.3); c.strokeStyle = m.shade; c.lineWidth = r * 0.08; c.stroke(); // nose
      if (beard) {
        P(); c.moveTo(-r * 0.8, y + r * 0.05); c.quadraticCurveTo(-r * 0.85, y + r * 1.0, -r * 0.25, y + r * 1.6); c.lineTo(0, y + r * 1.75); c.lineTo(r * 0.25, y + r * 1.6);
        c.quadraticCurveTo(r * 0.85, y + r * 1.0, r * 0.8, y + r * 0.05); c.quadraticCurveTo(r * 0.4, y + r * 0.55, 0, y + r * 0.5); c.quadraticCurveTo(-r * 0.4, y + r * 0.55, -r * 0.8, y + r * 0.05); c.closePath();
        c.fillStyle = bodyGrad(c, m, -r, r); c.fill(); c.fillStyle = m.shade; c.fill(); c.strokeStyle = m.line; c.lineWidth = 0.012; c.stroke();
        c.strokeStyle = m.shade; c.lineWidth = r * 0.07; for (var bl = -2; bl <= 2; bl++) { P(); c.moveTo(bl * r * 0.25, y + r * 0.6); c.quadraticCurveTo(bl * r * 0.3 + r * 0.08, y + r * 1.05, bl * r * 0.15, y + r * 1.5); c.stroke(); }
      }
    }
    function laurel(y, r) {
      c.fillStyle = trimGrad(c, m, y - r, y + r); c.strokeStyle = m.line; c.lineWidth = 0.008;
      for (var i = 0; i < 7; i++) { var a = Math.PI * (1.05 + i * 0.15), x = Math.cos(a) * r * 1.05, yy = y + Math.sin(a) * r * 0.9; P(); c.ellipse(x, yy, 0.035, 0.016, a + Math.PI / 2, 0, 7); c.fill(); c.stroke(); }
    }
    function crenel(top, w) { P(); for (var i = -2; i <= 2; i++) c.rect(i * w * 0.42 - w * 0.13, top - 0.08, w * 0.26, 0.09); fillTrim(top - 0.09, top); }

    plinth(role === "P" ? 0.24 : 0.3);

    if (pan === "greek") {
      if (role === "K") { // Zeus
        column(-0.08, 0.15, 0.24, true);
        face(-0.18, 0.1, true); laurel(-0.2, 0.11);
        P(); c.moveTo(0.02, -0.46); c.lineTo(-0.05, -0.36); c.lineTo(0.02, -0.36); c.lineTo(-0.04, -0.27); c.lineTo(0.08, -0.39); c.lineTo(0.02, -0.39); c.lineTo(0.08, -0.46); c.closePath(); fillTrim(-0.46, -0.27);
        glint(0.03, -0.44, 0.05);
      } else if (role === "Q") { // Athena
        column(-0.06, 0.13, 0.24, false);
        c.strokeStyle = m.shade; c.lineWidth = 0.008; for (var s1 = 0; s1 < 4; s1++) for (var s2 = -2; s2 <= 2; s2++) { P(); c.arc(s2 * 0.045 + (s1 % 2) * 0.022, 0.05 + s1 * 0.045, 0.02, 0, Math.PI); c.stroke(); } // aegis scales
        head(-0.15, 0.1);
        P(); c.moveTo(-0.11, -0.12); c.quadraticCurveTo(-0.13, -0.3, 0, -0.29); c.quadraticCurveTo(0.13, -0.3, 0.11, -0.12); c.lineTo(0.06, -0.13); c.lineTo(0.05, -0.19); c.lineTo(-0.05, -0.19); c.lineTo(-0.06, -0.13); c.closePath(); fillTrim(-0.3, -0.12);
        P(); c.moveTo(-0.14, -0.3); c.quadraticCurveTo(0, -0.52, 0.16, -0.26); c.quadraticCurveTo(0.02, -0.4, -0.14, -0.3); fillBody(-0.14, 0.16); // crest
        gemAt(0, -0.24, 0.025);
      } else if (role === "R") { // Poseidon
        P(); c.moveTo(-0.22, 0.33); c.lineTo(-0.19, -0.14); c.lineTo(0.19, -0.14); c.lineTo(0.22, 0.33); c.closePath(); fillBody(-0.22, 0.22);
        c.strokeStyle = m.trim[1]; c.lineWidth = 0.014; for (var wv = 0; wv < 2; wv++) { P(); for (var x = -0.19; x <= 0.19; x += 0.02) { var yy = 0.1 + wv * 0.08 + Math.sin(x * 50) * 0.012; if (x === -0.19) c.moveTo(x, yy); else c.lineTo(x, yy); } c.stroke(); }
        crenel(-0.14, 0.2);
        P(); c.rect(-0.012, -0.44, 0.024, 0.24); fillTrim(-0.44, -0.2);
        P(); c.moveTo(-0.1, -0.36); c.quadraticCurveTo(-0.1, -0.28, 0, -0.28); c.quadraticCurveTo(0.1, -0.28, 0.1, -0.36); c.lineTo(0.08, -0.36); c.quadraticCurveTo(0.07, -0.305, 0, -0.305); c.quadraticCurveTo(-0.07, -0.305, -0.08, -0.36); c.closePath(); fillTrim(-0.37, -0.28);
        [-0.09, 0, 0.09].forEach(function (x) { P(); c.moveTo(x - 0.018, -0.36); c.lineTo(x, -0.44); c.lineTo(x + 0.018, -0.36); c.closePath(); fillTrim(-0.44, -0.36); });
        gemAt(0, 0.0, 0.028);
      } else if (role === "B") { // Apollo
        c.strokeStyle = trimGrad(c, m, -0.5, -0.1); c.lineWidth = 0.014;
        for (var ry = 0; ry < 12; ry++) { var ra = Math.PI + ry * Math.PI / 11; P(); c.moveTo(Math.cos(ra) * 0.12, -0.3 + Math.sin(ra) * 0.12); c.lineTo(Math.cos(ra) * 0.19, -0.3 + Math.sin(ra) * 0.19); c.stroke(); }
        column(-0.12, 0.1, 0.2, true);
        face(-0.27, 0.085, false); laurel(-0.29, 0.09);
        P(); c.moveTo(-0.08, 0.2); c.quadraticCurveTo(-0.12, 0.02, -0.06, -0.02); c.lineTo(-0.05, 0.0); c.quadraticCurveTo(-0.08, 0.08, -0.05, 0.16); c.lineTo(0.05, 0.16); c.quadraticCurveTo(0.08, 0.08, 0.05, 0.0); c.lineTo(0.06, -0.02); c.quadraticCurveTo(0.12, 0.02, 0.08, 0.2); c.closePath(); fillTrim(-0.02, 0.2); // lyre
        c.strokeStyle = m.line; c.lineWidth = 0.005; for (var st = -1; st <= 1; st++) { P(); c.moveTo(st * 0.02, 0.02); c.lineTo(st * 0.02, 0.16); c.stroke(); }
      } else if (role === "N") { // Ares: crested war-horse
        P(); c.moveTo(-0.2, 0.33); c.lineTo(-0.16, 0.02); c.quadraticCurveTo(-0.22, -0.24, 0.0, -0.34); c.quadraticCurveTo(0.2, -0.36, 0.24, -0.12); c.lineTo(0.2, -0.06); c.lineTo(0.08, -0.08); c.quadraticCurveTo(0.14, 0.08, 0.2, 0.33); c.closePath(); fillBody(-0.2, 0.24);
        c.fillStyle = m.eye; P(); c.arc(0.08, -0.2, 0.022, 0, 7); c.fill();
        P(); c.moveTo(-0.14, -0.2); c.quadraticCurveTo(-0.02, -0.5, 0.16, -0.36); c.quadraticCurveTo(0.02, -0.4, -0.08, -0.16); c.closePath(); fillTrim(-0.46, -0.16); // helmet crest
        c.strokeStyle = m.shade; c.lineWidth = 0.01; for (var mn = 0; mn < 5; mn++) { P(); c.moveTo(-0.14 + mn * 0.012, -0.08 + mn * 0.06); c.lineTo(-0.08 + mn * 0.012, -0.1 + mn * 0.06); c.stroke(); }
        gemAt(0.02, -0.3, 0.02);
      } else { // Initiate of Eleusis
        P(); c.moveTo(-0.14, 0.33); c.quadraticCurveTo(-0.16, 0.0, -0.09, -0.08); c.lineTo(0.09, -0.08); c.quadraticCurveTo(0.16, 0.0, 0.14, 0.33); c.closePath(); fillBody(-0.14, 0.14);
        P(); c.moveTo(-0.1, -0.06); c.quadraticCurveTo(-0.12, -0.26, 0, -0.26); c.quadraticCurveTo(0.12, -0.26, 0.1, -0.06); c.closePath(); fillBody(-0.12, 0.12); // hood
        P(); c.arc(0, -0.13, 0.055, 0, 7); c.fillStyle = m.shade; c.fill();
        P(); c.rect(0.12, -0.2, 0.022, 0.3); fillTrim(-0.2, 0.1);
        var fl = c.createRadialGradient(0.13, -0.24, 0, 0.13, -0.24, 0.08); fl.addColorStop(0, "#fff6d0"); fl.addColorStop(0.5, "#ffb347"); fl.addColorStop(1, "rgba(255,120,40,0)"); c.fillStyle = fl; P(); c.arc(0.13, -0.24, 0.08, 0, 7); c.fill();
      }
    } else if (pan === "egyptian") {
      if (role === "K") { // Osiris
        P(); c.moveTo(-0.19, 0.33); c.quadraticCurveTo(-0.2, 0.0, -0.13, -0.12); c.lineTo(0.13, -0.12); c.quadraticCurveTo(0.2, 0.0, 0.19, 0.33); c.closePath(); fillBody(-0.2, 0.2);
        c.strokeStyle = m.shade; c.lineWidth = 0.008; for (var bd = 0; bd < 7; bd++) { P(); c.moveTo(-0.18, 0.3 - bd * 0.06); c.lineTo(0.18, 0.28 - bd * 0.06); c.stroke(); } // wrappings
        face(-0.18, 0.08, false);
        P(); c.moveTo(-0.05, -0.24); c.quadraticCurveTo(-0.06, -0.43, 0, -0.46); c.quadraticCurveTo(0.06, -0.43, 0.05, -0.24); c.closePath(); fillBody(-0.06, 0.06); // white crown
        [-1, 1].forEach(function (d) { P(); c.moveTo(d * 0.05, -0.24); c.quadraticCurveTo(d * 0.12, -0.36, d * 0.08, -0.44); c.quadraticCurveTo(d * 0.07, -0.34, d * 0.04, -0.28); c.closePath(); fillTrim(-0.44, -0.24); });
        P(); c.moveTo(-0.13, 0.08); c.lineTo(0.11, -0.12); c.strokeStyle = m.trim[1]; c.lineWidth = 0.025; c.stroke(); // flail
        P(); c.moveTo(0.13, 0.08); c.lineTo(-0.08, -0.1); c.quadraticCurveTo(-0.14, -0.16, -0.09, -0.2); c.stroke(); // crook
        glint(0, -0.44, 0.04);
      } else if (role === "Q") { // Ma'at
        column(-0.08, 0.12, 0.22, false);
        c.strokeStyle = m.trim[1]; c.lineWidth = 0.012; for (var col2 = 0; col2 < 3; col2++) { P(); c.arc(0, -0.05, 0.1 + col2 * 0.025, 0.2, Math.PI - 0.2); c.stroke(); } // broad collar
        face(-0.17, 0.085, false);
        P(); c.moveTo(-0.1, -0.2); c.lineTo(-0.1, -0.1); c.lineTo(0.1, -0.1); c.lineTo(0.1, -0.2); c.quadraticCurveTo(0, -0.28, -0.1, -0.2); fillBody(-0.1, 0.1); // headdress
        P(); c.moveTo(0.0, -0.25); c.quadraticCurveTo(0.08, -0.36, 0.03, -0.49); c.quadraticCurveTo(-0.04, -0.4, -0.02, -0.25); c.closePath(); fillTrim(-0.49, -0.25); // ostrich feather
        c.strokeStyle = m.line; c.lineWidth = 0.004; for (var fv = 0; fv < 6; fv++) { P(); c.moveTo(0.005, -0.28 - fv * 0.035); c.lineTo(0.04, -0.3 - fv * 0.035); c.stroke(); }
        gemAt(0, -0.13, 0.022);
      } else if (role === "R") { // Ra: pylon with sun disk
        P(); c.moveTo(-0.23, 0.33); c.lineTo(-0.17, -0.12); c.lineTo(0.17, -0.12); c.lineTo(0.23, 0.33); c.closePath(); fillBody(-0.23, 0.23);
        P(); c.moveTo(-0.2, -0.12); c.lineTo(-0.22, -0.19); c.lineTo(0.22, -0.19); c.lineTo(0.2, -0.12); c.closePath(); fillTrim(-0.19, -0.12); // cavetto cornice
        P(); c.rect(-0.045, 0.14, 0.09, 0.19); c.fillStyle = m.shade; c.fill(); // doorway
        c.strokeStyle = m.shade; c.lineWidth = 0.007; for (var hl = 0; hl < 3; hl++) { P(); c.moveTo(-0.15 + hl * 0.02, -0.05 + hl * 0.06); c.lineTo(-0.08, -0.05 + hl * 0.06); c.moveTo(0.08, -0.05 + hl * 0.06); c.lineTo(0.15 - hl * 0.02, -0.05 + hl * 0.06); c.stroke(); }
        var sun = c.createRadialGradient(-0.02, -0.33, 0.01, 0, -0.3, 0.1); sun.addColorStop(0, "#fff4c0"); sun.addColorStop(0.6, "#e8a63a"); sun.addColorStop(1, "#8a4a14"); c.fillStyle = sun; P(); c.arc(0, -0.3, 0.1, 0, 7); c.fill(); c.strokeStyle = m.line; c.lineWidth = 0.012; c.stroke();
        P(); c.moveTo(-0.02, -0.2); c.quadraticCurveTo(0.06, -0.22, 0.02, -0.28); c.strokeStyle = gem; c.lineWidth = 0.014; c.stroke(); // uraeus
      } else if (role === "B") { // Thoth
        column(-0.1, 0.1, 0.2, false);
        head(-0.2, 0.08);
        P(); c.moveTo(0.05, -0.22); c.quadraticCurveTo(0.2, -0.2, 0.25, -0.05); c.quadraticCurveTo(0.17, -0.16, 0.05, -0.18); c.closePath(); fillTrim(-0.22, -0.05); // ibis beak
        c.fillStyle = m.eye; P(); c.arc(0.03, -0.22, 0.015, 0, 7); c.fill();
        P(); c.moveTo(-0.08, -0.22); c.quadraticCurveTo(-0.1, -0.1, -0.12, -0.08); c.lineTo(-0.02, -0.13); fillBody(-0.12, 0); // wig
        P(); c.arc(0, -0.37, 0.07, 0, 7); fillTrim(-0.44, -0.3); P(); c.arc(-0.02, -0.37, 0.055, -1.2, 1.2); c.fillStyle = m.shade; c.fill(); // moon disk + crescent
        P(); c.rect(-0.13, 0.02, 0.09, 0.12); fillTrim(0.02, 0.14); // palette
      } else if (role === "N") { // Anubis
        P(); c.moveTo(-0.2, 0.33); c.lineTo(-0.15, 0.02); c.quadraticCurveTo(-0.18, -0.2, -0.04, -0.24); c.lineTo(0.22, -0.14); c.lineTo(0.2, -0.08); c.lineTo(0.04, -0.06); c.quadraticCurveTo(0.14, 0.1, 0.2, 0.33); c.closePath(); fillBody(-0.2, 0.22);
        [[-0.09, 0], [0.0, 0.02]].forEach(function (e) { P(); c.moveTo(e[0] - 0.04, -0.22 + e[1]); c.lineTo(e[0] - 0.01, -0.46 + e[1]); c.lineTo(e[0] + 0.04, -0.22 + e[1]); c.closePath(); fillBody(e[0] - 0.04, e[0] + 0.04); }); // tall ears
        c.fillStyle = gem; P(); c.ellipse(0.06, -0.17, 0.026, 0.012, -0.3, 0, 7); c.fill();
        c.strokeStyle = m.trim[1]; c.lineWidth = 0.014; P(); c.moveTo(-0.16, 0.04); c.quadraticCurveTo(0.0, 0.1, 0.12, 0.02); c.stroke(); P(); c.moveTo(-0.15, 0.1); c.quadraticCurveTo(0.02, 0.16, 0.14, 0.08); c.stroke(); // collar
      } else { // Eye of Horus on a stele
        P(); c.moveTo(-0.14, 0.33); c.lineTo(-0.14, -0.08); c.quadraticCurveTo(0, -0.24, 0.14, -0.08); c.lineTo(0.14, 0.33); c.closePath(); fillBody(-0.14, 0.14);
        c.strokeStyle = m.eye === "#3a2610" ? "#2a4a6a" : gem; c.lineWidth = 0.016;
        P(); c.moveTo(-0.09, -0.02); c.quadraticCurveTo(0, -0.1, 0.09, -0.02); c.quadraticCurveTo(0, 0.04, -0.09, -0.02); c.stroke();
        c.fillStyle = c.strokeStyle; P(); c.arc(0, -0.025, 0.025, 0, 7); c.fill();
        P(); c.moveTo(-0.02, 0.02); c.lineTo(-0.04, 0.1); c.quadraticCurveTo(-0.07, 0.12, -0.08, 0.08); c.moveTo(0.02, 0.02); c.quadraticCurveTo(0.08, 0.06, 0.06, 0.13); c.stroke();
        P(); c.moveTo(-0.08, -0.08); c.quadraticCurveTo(0, -0.12, 0.1, -0.07); c.stroke();
      }
    } else { // norse
      if (role === "K") { // Odin
        P(); c.rect(0.19, -0.42, 0.018, 0.72); fillTrim(-0.42, 0.3); P(); c.moveTo(0.175, -0.42); c.lineTo(0.2, -0.5); c.lineTo(0.225, -0.42); c.closePath(); fillTrim(-0.5, -0.42); // Gungnir
        P(); c.moveTo(-0.22, 0.33); c.quadraticCurveTo(-0.24, 0.0, -0.12, -0.1); c.lineTo(0.12, -0.1); c.quadraticCurveTo(0.24, 0.0, 0.2, 0.33); c.closePath(); fillBody(-0.24, 0.24); // cloak
        c.strokeStyle = m.shade; c.lineWidth = 0.008; for (var fo = -2; fo <= 2; fo++) { P(); c.moveTo(fo * 0.06, -0.06); c.quadraticCurveTo(fo * 0.08, 0.15, fo * 0.075, 0.32); c.stroke(); }
        face(-0.17, 0.085, true);
        c.fillStyle = m.line; P(); c.rect(-0.07, -0.19, 0.06, 0.03); c.fill(); // eye patch
        P(); c.moveTo(-0.09, -0.2); c.quadraticCurveTo(0, -0.33, 0.09, -0.2); c.closePath(); fillTrim(-0.33, -0.2); // helm
        [-1, 1].forEach(function (d) { P(); c.moveTo(d * 0.08, -0.25); c.quadraticCurveTo(d * 0.2, -0.3, d * 0.2, -0.42); c.quadraticCurveTo(d * 0.14, -0.33, d * 0.07, -0.29); c.closePath(); fillBody(-0.2, 0.2); }); // wings
        gemAt(0, -0.27, 0.022);
      } else if (role === "Q") { // Freyja
        P(); c.moveTo(-0.24, 0.33); c.quadraticCurveTo(-0.2, 0.02, -0.12, -0.08); c.lineTo(0.12, -0.08); c.quadraticCurveTo(0.2, 0.02, 0.24, 0.33); c.closePath(); fillBody(-0.24, 0.24); // falcon cloak
        c.strokeStyle = m.shade; c.lineWidth = 0.008; for (var fr = 0; fr < 4; fr++) for (var fc = -3; fc <= 3; fc++) { P(); c.moveTo(fc * 0.055, 0.02 + fr * 0.075); c.quadraticCurveTo(fc * 0.055 + 0.02, 0.05 + fr * 0.075, fc * 0.055, 0.08 + fr * 0.075); c.stroke(); }
        for (var nb = 0; nb < 7; nb++) { var na = 0.35 + nb * 0.4; P(); c.arc(Math.cos(na) * 0.09, -0.06 + Math.sin(na) * 0.05, 0.016, 0, 7); c.fillStyle = nb === 3 ? gem : m.trim[1]; c.fill(); } // Brisingamen
        face(-0.17, 0.085, false);
        P(); c.moveTo(-0.09, -0.22); for (var cp = 0; cp < 5; cp++) { c.lineTo(-0.09 + cp * 0.045, cp % 2 ? -0.26 : -0.34); } c.lineTo(0.09, -0.22); c.closePath(); fillTrim(-0.34, -0.22); // crown
        gemAt(0, -0.3, 0.02);
      } else if (role === "R") { // Yggdrasil
        P(); c.moveTo(-0.2, 0.33); c.quadraticCurveTo(-0.1, 0.2, -0.07, 0.0); c.lineTo(-0.07, -0.1); c.lineTo(0.07, -0.1); c.lineTo(0.07, 0.0); c.quadraticCurveTo(0.1, 0.2, 0.2, 0.33); c.closePath(); fillBody(-0.2, 0.2); // trunk + roots
        c.strokeStyle = m.shade; c.lineWidth = 0.01; [-0.04, 0, 0.04].forEach(function (x) { P(); c.moveTo(x, -0.1); c.quadraticCurveTo(x * 2, 0.15, x * 4, 0.32); c.stroke(); });
        [[-0.12, -0.2, 0.1], [0.12, -0.2, 0.1], [0, -0.3, 0.13], [-0.08, -0.34, 0.08], [0.09, -0.35, 0.08]].forEach(function (b) { P(); c.arc(b[0], b[1], b[2], 0, 7); fillBody(b[0] - b[2], b[0] + b[2]); });
        c.strokeStyle = m.trim[1]; c.lineWidth = 0.008; for (var lf = 0; lf < 14; lf++) { var la = lf * 0.9, lr = 0.06 + (lf % 3) * 0.04; P(); c.arc(Math.cos(la) * lr, -0.28 + Math.sin(la) * lr * 0.7, 0.012, 0, 7); c.stroke(); }
        gemAt(0, -0.28, 0.024);
      } else if (role === "B") { // Baldr
        var halo = c.createRadialGradient(0, -0.3, 0.02, 0, -0.3, 0.2); halo.addColorStop(0, "rgba(255,245,200,.9)"); halo.addColorStop(0.5, "rgba(255,210,120,.45)"); halo.addColorStop(1, "rgba(255,200,100,0)"); c.fillStyle = halo; P(); c.arc(0, -0.3, 0.2, 0, 7); c.fill();
        c.strokeStyle = trimGrad(c, m, -0.5, -0.1); c.lineWidth = 0.012; for (var br = 0; br < 16; br++) { var ba = br * Math.PI / 8; P(); c.moveTo(Math.cos(ba) * 0.1, -0.3 + Math.sin(ba) * 0.1); c.lineTo(Math.cos(ba) * (br % 2 ? 0.15 : 0.18), -0.3 + Math.sin(ba) * (br % 2 ? 0.15 : 0.18)); c.stroke(); }
        column(-0.14, 0.09, 0.19, true);
        face(-0.27, 0.085, false);
        P(); c.moveTo(-0.07, -0.31); c.quadraticCurveTo(0, -0.39, 0.07, -0.31); c.quadraticCurveTo(0, -0.34, -0.07, -0.31); fillTrim(-0.38, -0.3); // hair band
      } else if (role === "N") { // Thor: goat head, Mjolnir
        P(); c.moveTo(-0.2, 0.33); c.lineTo(-0.15, 0.02); c.quadraticCurveTo(-0.18, -0.2, -0.02, -0.26); c.quadraticCurveTo(0.14, -0.26, 0.22, -0.1); c.lineTo(0.18, -0.04); c.lineTo(0.06, -0.06); c.quadraticCurveTo(0.14, 0.1, 0.2, 0.33); c.closePath(); fillBody(-0.2, 0.22);
        P(); c.moveTo(0.12, -0.04); c.lineTo(0.14, 0.06); c.lineTo(0.16, -0.04); fillBody(0.12, 0.16); // beard
        P(); c.moveTo(-0.04, -0.24); c.quadraticCurveTo(-0.28, -0.3, -0.2, -0.46); c.quadraticCurveTo(-0.16, -0.36, -0.02, -0.3); c.closePath(); fillTrim(-0.46, -0.24); // curled horn
        c.fillStyle = m.eye; P(); c.arc(0.06, -0.18, 0.02, 0, 7); c.fill();
        P(); c.rect(-0.05, 0.02, 0.1, 0.06); fillTrim(0.02, 0.08); P(); c.rect(-0.012, 0.08, 0.024, 0.1); fillTrim(0.08, 0.18); // Mjolnir
        glint(0, 0.05, 0.03);
      } else { // Einherjar
        P(); c.moveTo(-0.13, 0.33); c.quadraticCurveTo(-0.15, 0.02, -0.08, -0.06); c.lineTo(0.08, -0.06); c.quadraticCurveTo(0.15, 0.02, 0.13, 0.33); c.closePath(); fillBody(-0.14, 0.14);
        face(-0.13, 0.075, false);
        P(); c.moveTo(-0.08, -0.14); c.quadraticCurveTo(0, -0.27, 0.08, -0.14); c.closePath(); fillTrim(-0.27, -0.14); P(); c.rect(-0.008, -0.14, 0.016, 0.06); fillTrim(-0.14, -0.08); // spangenhelm + nasal
        P(); c.arc(-0.06, 0.12, 0.13, 0, 7); fillBody(-0.19, 0.07); P(); c.arc(-0.06, 0.12, 0.035, 0, 7); fillTrim(0.08, 0.16); // round shield + boss
        c.strokeStyle = m.shade; c.lineWidth = 0.008; for (var sp2 = 0; sp2 < 4; sp2++) { var sa = sp2 * Math.PI / 4; P(); c.moveTo(-0.06 + Math.cos(sa) * 0.04, 0.12 + Math.sin(sa) * 0.04); c.lineTo(-0.06 + Math.cos(sa) * 0.125, 0.12 + Math.sin(sa) * 0.125); c.moveTo(-0.06 - Math.cos(sa) * 0.04, 0.12 - Math.sin(sa) * 0.04); c.lineTo(-0.06 - Math.cos(sa) * 0.125, 0.12 - Math.sin(sa) * 0.125); c.stroke(); }
      }
    }
    // a soft specular sweep down the left of every figure
    var sh = c.createLinearGradient(-0.3, 0, 0.3, 0); sh.addColorStop(0.18, "rgba(255,255,255,0)"); sh.addColorStop(0.26, side === "w" ? "rgba(255,255,240,.18)" : "rgba(200,190,255,.14)"); sh.addColorStop(0.34, "rgba(255,255,255,0)");
    c.globalCompositeOperation = "source-atop"; c.fillStyle = sh; c.fillRect(-0.5, -0.55, 1, 1.05); c.globalCompositeOperation = "source-over";
  }

  var cache = {};
  function sprite(pan, role, side, px) {
    px = Math.max(16, Math.round(px));
    var key = pan + role + side + px;
    if (cache[key]) return cache[key];
    var cv = document.createElement("canvas"); cv.width = cv.height = px;
    var c = cv.getContext("2d");
    c.translate(px / 2, px / 2 + px * 0.02); c.scale(px, px);
    paint(c, pan, role, side);
    cache[key] = cv;
    return cv;
  }

  /* ---------------- the board: carved frame, travertine and lapis squares ---------------- */
  function board(boardPx, dpr, margin) {
    var M = margin, T = boardPx + 2 * M, SZ = boardPx / 8;
    var cv = document.createElement("canvas"); cv.width = Math.round(T * dpr); cv.height = Math.round(T * dpr);
    var b = cv.getContext("2d"); b.setTransform(dpr, 0, 0, dpr, 0, 0);
    var seed = 20240917; function R() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    // the frame: dark wood with a bronze fillet and an engraved meander
    var fg = b.createLinearGradient(0, 0, T, T); fg.addColorStop(0, "#3b2614"); fg.addColorStop(0.5, "#24160b"); fg.addColorStop(1, "#150c05");
    b.fillStyle = fg; b.fillRect(0, 0, T, T);
    for (var g = 0; g < 260; g++) { b.strokeStyle = "rgba(" + (R() < 0.5 ? "80,50,24" : "10,6,2") + "," + (0.15 + R() * 0.2) + ")"; b.lineWidth = 0.5; var gy = R() * T; b.beginPath(); b.moveTo(0, gy); b.bezierCurveTo(T * 0.3, gy + (R() - 0.5) * 8, T * 0.6, gy + (R() - 0.5) * 8, T, gy + (R() - 0.5) * 6); b.stroke(); }
    function bronzeRect(x, y, w, h, lw) { var bg = b.createLinearGradient(x, y, x + w, y + h); bg.addColorStop(0, "#f2d28c"); bg.addColorStop(0.5, "#a77a3a"); bg.addColorStop(1, "#5a3c16"); b.strokeStyle = bg; b.lineWidth = lw; b.strokeRect(x, y, w, h); }
    bronzeRect(3, 3, T - 6, T - 6, 2);
    bronzeRect(M - 4, M - 4, boardPx + 8, boardPx + 8, 3);
    // meander band between the fillets
    b.save(); b.strokeStyle = "rgba(214,172,98,.55)"; b.lineWidth = 1;
    var band = M * 0.3, bo = 6, step = band;
    function meander(len, cb) { for (var x = 0; x + step <= len; x += step) cb(x); }
    [[bo, "h", 0], [T - bo - band, "h", 0], [bo, "v", 0], [T - bo - band, "v", 0]].forEach(function (s) {
      meander(T - 2 * (bo + band) - step * 0.2, function (x) {
        var u = step, p = [[0, 1], [0, 0], [1, 0], [1, 0.75], [0.25, 0.75], [0.25, 0.25], [0.75, 0.25], [0.75, 0.5], [0.5, 0.5]];
        b.beginPath();
        p.forEach(function (q, i) { var px = bo + band + x + q[0] * u * 0.9, py = s[0] + q[1] * band; var X = s[1] === "h" ? px : s[0] + q[1] * band, Y = s[1] === "h" ? py : bo + band + x + q[0] * u * 0.9; if (i) b.lineTo(X, Y); else b.moveTo(X, Y); });
        b.stroke();
      });
    });
    b.restore();
    // corner medallions: the archive star
    var mc = bo + band / 2 + 1;
    [[mc, mc], [T - mc, mc], [mc, T - mc], [T - mc, T - mc]].forEach(function (p) {
      var rg = b.createRadialGradient(p[0] - 2, p[1] - 2, 1, p[0], p[1], M * 0.36); rg.addColorStop(0, "#f7dc9a"); rg.addColorStop(0.6, "#a57839"); rg.addColorStop(1, "#4a3012");
      b.fillStyle = rg; b.beginPath(); b.arc(p[0], p[1], M * 0.32, 0, 7); b.fill(); b.strokeStyle = "rgba(30,18,6,.8)"; b.lineWidth = 1; b.stroke();
      b.fillStyle = "#2a1a08"; b.beginPath(); for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4 - Math.PI / 2, r = k % 2 ? M * 0.09 : M * 0.22; b.lineTo(p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r); } b.closePath(); b.fill();
    });
    // squares
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
      var x = M + c * SZ, y = M + r * SZ, dk = (r + c) % 2 === 1;
      var sg = b.createLinearGradient(x, y, x + SZ, y + SZ);
      if (dk) { sg.addColorStop(0, "#23407a"); sg.addColorStop(0.55, "#172c5c"); sg.addColorStop(1, "#0e1c40"); }       // lapis lazuli
      else { sg.addColorStop(0, "#e9dcc0"); sg.addColorStop(0.6, "#d4c29c"); sg.addColorStop(1, "#bca77c"); }         // travertine
      b.fillStyle = sg; b.fillRect(x, y, SZ, SZ);
      b.save(); b.beginPath(); b.rect(x, y, SZ, SZ); b.clip();
      if (dk) {
        for (var cl = 0; cl < 5; cl++) { b.fillStyle = "rgba(90,130,210," + (0.08 + R() * 0.12) + ")"; b.beginPath(); b.ellipse(x + R() * SZ, y + R() * SZ, 2 + R() * SZ * 0.3, 1 + R() * SZ * 0.12, R() * 3, 0, 7); b.fill(); }
        for (var fl = 0; fl < 9; fl++) { b.fillStyle = "rgba(240,200,110," + (0.5 + R() * 0.5) + ")"; b.fillRect(x + R() * SZ, y + R() * SZ, 0.6 + R() * 1.1, 0.6 + R() * 1.1); } // pyrite flecks
        b.strokeStyle = "rgba(200,215,240,.14)"; b.lineWidth = 0.6; b.beginPath(); var vx = x + R() * SZ; b.moveTo(vx, y); b.bezierCurveTo(vx + (R() - 0.5) * SZ, y + SZ * 0.3, vx + (R() - 0.5) * SZ, y + SZ * 0.7, vx + (R() - 0.5) * SZ * 0.6, y + SZ); b.stroke();
      } else {
        for (var ln = 0; ln < 4; ln++) { b.strokeStyle = "rgba(150,120,80," + (0.12 + R() * 0.16) + ")"; b.lineWidth = 0.5 + R() * 0.9; var ly = y + R() * SZ; b.beginPath(); b.moveTo(x, ly); b.bezierCurveTo(x + SZ * 0.3, ly + (R() - 0.5) * 6, x + SZ * 0.7, ly + (R() - 0.5) * 6, x + SZ, ly + (R() - 0.5) * 4); b.stroke(); }
        for (var pit = 0; pit < 7; pit++) { b.fillStyle = "rgba(120,95,60,.28)"; b.beginPath(); b.ellipse(x + R() * SZ, y + R() * SZ, 0.6 + R() * 1.4, 0.4 + R() * 0.6, 0, 0, 7); b.fill(); }
      }
      b.restore();
      b.fillStyle = "rgba(255,250,235," + (dk ? 0.07 : 0.2) + ")"; b.fillRect(x, y, SZ, 1); b.fillRect(x, y, 1, SZ);
      b.fillStyle = "rgba(0,0,0,.25)"; b.fillRect(x, y + SZ - 1, SZ, 1); b.fillRect(x + SZ - 1, y, 1, SZ);
    }
    // gold inlay between the squares
    b.strokeStyle = "rgba(214,176,96,.55)"; b.lineWidth = 0.7;
    for (var i = 1; i < 8; i++) { b.beginPath(); b.moveTo(M + i * SZ, M); b.lineTo(M + i * SZ, M + boardPx); b.moveTo(M, M + i * SZ); b.lineTo(M + boardPx, M + i * SZ); b.stroke(); }
    // polish: a broad diagonal sheen and a vignette
    var pol = b.createLinearGradient(M, M, M + boardPx, M + boardPx); pol.addColorStop(0, "rgba(255,245,220,.10)"); pol.addColorStop(0.35, "rgba(255,245,220,0)"); pol.addColorStop(0.6, "rgba(255,245,220,.05)"); pol.addColorStop(1, "rgba(0,0,0,.18)");
    b.fillStyle = pol; b.fillRect(M, M, boardPx, boardPx);
    var vg = b.createRadialGradient(M + boardPx / 2, M + boardPx / 2, boardPx * 0.35, M + boardPx / 2, M + boardPx / 2, boardPx * 0.8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.28)");
    b.fillStyle = vg; b.fillRect(M, M, boardPx, boardPx);
    // coordinates engraved in the frame
    var lab = bo + band + (M - 4 - bo - band) / 2;   // centre of the plain band between the meander and the board
    b.font = "600 " + Math.round(M * 0.3) + "px Cinzel, Georgia, serif"; b.textAlign = "center"; b.textBaseline = "middle";
    for (var f = 0; f < 8; f++) {
      b.fillStyle = "rgba(0,0,0,.6)"; b.fillText("abcdefgh"[f], M + f * SZ + SZ / 2, T - lab + 1); b.fillText(String(8 - f), lab, M + f * SZ + SZ / 2 + 1);
      b.fillStyle = "#e3c27c"; b.fillText("abcdefgh"[f], M + f * SZ + SZ / 2, T - lab); b.fillText(String(8 - f), lab, M + f * SZ + SZ / 2);
    }
    return cv;
  }

  window.ChessArt = { sprite: sprite, board: board };
})();
