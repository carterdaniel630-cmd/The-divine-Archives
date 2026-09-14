/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "Archive Chess" (pantheon chess)

   Chess reskinned to the gods: pick a pantheon (Olympian / Egyptian / Aesir)
   for each side; each role is a god, and capturing a piece reveals a real fact
   about that god (docs/assets/games/data/chess.json, grounded in the pantheon's
   chapter, checked by tools/verify-chess.js). Full legal chess (castling,
   promotion, en passant, check / checkmate / stalemate), an alpha-beta AI, and
   local two-player. Hidden inside the ch02 sigil.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;
  var DATA_URL = (function () { var s = document.currentScript; return (s && s.src ? s.src.replace(/[^/]*$/, "") : "assets/games/") + "data/chess.json"; })();
  var DATA = null, loadingP = null;
  function loadData() { if (DATA) return Promise.resolve(DATA); if (loadingP) return loadingP; loadingP = fetch(DATA_URL).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { DATA = j; return j; }); return loadingP; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  AG.register("chess", {
    title: "Archive Chess",
    subtitle: "A board of gods — Olympian, Egyptian, or Aesir. Facts fall with every capture.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch02) || "",
    sourceHref: "chapters/ch02.html", sourceLabel: "Read “Egypt”",
    mount: mountGame
  });

  /* ===================== engine (module-level, pure) ===================== */
  var ROOK = [[-1, 0], [1, 0], [0, -1], [0, 1]], BISH = [[-1, -1], [-1, 1], [1, -1], [1, 1]], QUEEN = ROOK.concat(BISH);
  var KN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  var BACK = ["R", "N", "B", "Q", "K", "B", "N", "R"];
  var VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
  function inB(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
  function idx(r, c) { return r * 8 + c; }
  function opp(c) { return c === "w" ? "b" : "w"; }

  function initBoard() {
    var b = new Array(64).fill(null);
    for (var c = 0; c < 8; c++) { b[idx(0, c)] = { t: BACK[c], c: "b" }; b[idx(1, c)] = { t: "P", c: "b" }; b[idx(6, c)] = { t: "P", c: "w" }; b[idx(7, c)] = { t: BACK[c], c: "w" }; }
    return b;
  }
  function cloneBoard(b) { return b.slice(); }
  function findKing(b, color) { for (var i = 0; i < 64; i++) { var p = b[i]; if (p && p.t === "K" && p.c === color) return i; } return -1; }

  function attacked(b, t, by) {
    var r = t >> 3, c = t & 7, i, rr, cc, p;
    // pawns of `by`
    var pr = by === "w" ? r + 1 : r - 1;
    for (var dc = -1; dc <= 1; dc += 2) { if (inB(pr, c + dc)) { p = b[idx(pr, c + dc)]; if (p && p.c === by && p.t === "P") return true; } }
    // knights
    for (i = 0; i < KN.length; i++) { rr = r + KN[i][0]; cc = c + KN[i][1]; if (inB(rr, cc)) { p = b[idx(rr, cc)]; if (p && p.c === by && p.t === "N") return true; } }
    // king
    for (var dr = -1; dr <= 1; dr++) for (dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; rr = r + dr; cc = c + dc; if (inB(rr, cc)) { p = b[idx(rr, cc)]; if (p && p.c === by && p.t === "K") return true; } }
    // sliders
    function ray(dirs, types) { for (var d = 0; d < dirs.length; d++) { rr = r + dirs[d][0]; cc = c + dirs[d][1]; while (inB(rr, cc)) { p = b[idx(rr, cc)]; if (p) { if (p.c === by && types.indexOf(p.t) >= 0) return true; break; } rr += dirs[d][0]; cc += dirs[d][1]; } } return false; }
    if (ray(ROOK, ["R", "Q"])) return true;
    if (ray(BISH, ["B", "Q"])) return true;
    return false;
  }

  function pseudo(b, color, ep) {
    var mv = [], i, p, r, c;
    for (i = 0; i < 64; i++) {
      p = b[i]; if (!p || p.c !== color) continue; r = i >> 3; c = i & 7;
      if (p.t === "P") {
        var dir = color === "w" ? -1 : 1, start = color === "w" ? 6 : 1, promo = color === "w" ? 0 : 7, f1 = r + dir;
        if (inB(f1, c) && !b[idx(f1, c)]) { pushPawn(mv, i, idx(f1, c), f1 === promo); if (r === start && !b[idx(r + 2 * dir, c)]) mv.push({ from: i, to: idx(r + 2 * dir, c), dbl: true }); }
        for (var dc = -1; dc <= 1; dc += 2) { if (!inB(f1, c + dc)) continue; var t = idx(f1, c + dc), tp = b[t]; if (tp && tp.c !== color) pushPawn(mv, i, t, f1 === promo); else if (ep === t) mv.push({ from: i, to: t, ep: true }); }
      } else if (p.t === "N") { for (var k = 0; k < KN.length; k++) { var rr = r + KN[k][0], cc = c + KN[k][1]; if (inB(rr, cc)) { var q = b[idx(rr, cc)]; if (!q || q.c !== color) mv.push({ from: i, to: idx(rr, cc) }); } } }
      else if (p.t === "K") { for (var a = -1; a <= 1; a++) for (var z = -1; z <= 1; z++) { if (!a && !z) continue; var kr = r + a, kc = c + z; if (inB(kr, kc)) { var kq = b[idx(kr, kc)]; if (!kq || kq.c !== color) mv.push({ from: i, to: idx(kr, kc) }); } } }
      else { var dirs = p.t === "R" ? ROOK : p.t === "B" ? BISH : QUEEN; for (var d = 0; d < dirs.length; d++) { var sr = r + dirs[d][0], sc = c + dirs[d][1]; while (inB(sr, sc)) { var si = idx(sr, sc), sp = b[si]; if (!sp) mv.push({ from: i, to: si }); else { if (sp.c !== color) mv.push({ from: i, to: si }); break; } sr += dirs[d][0]; sc += dirs[d][1]; } } }
    }
    return mv;
  }
  function pushPawn(mv, from, to, isP) { if (isP) mv.push({ from: from, to: to, promo: "Q" }); else mv.push({ from: from, to: to }); }

  // apply a move to a board copy; returns {board, captured}
  function apply(b, m) {
    var nb = cloneBoard(b), p = nb[m.from], cap = nb[m.to];
    nb[m.to] = p; nb[m.from] = null;
    if (m.ep) { var capIdx = idx((m.to >> 3) + (p.c === "w" ? 1 : -1), m.to & 7); cap = nb[capIdx]; nb[capIdx] = null; }
    if (m.promo) nb[m.to] = { t: m.promo, c: p.c };
    if (m.castle) { var row = m.from >> 3; if (m.castle === "K") { nb[idx(row, 5)] = nb[idx(row, 7)]; nb[idx(row, 7)] = null; } else { nb[idx(row, 3)] = nb[idx(row, 0)]; nb[idx(row, 0)] = null; } }
    return { board: nb, captured: cap };
  }
  // castling rights after a move (from prior rights object)
  function nextCastle(cast, m, piece) {
    var n = { wk: cast.wk, wq: cast.wq, bk: cast.bk, bq: cast.bq };
    if (piece.t === "K") { if (piece.c === "w") { n.wk = n.wq = false; } else { n.bk = n.bq = false; } }
    function drop(sq) { if (sq === idx(7, 7)) n.wk = false; else if (sq === idx(7, 0)) n.wq = false; else if (sq === idx(0, 7)) n.bk = false; else if (sq === idx(0, 0)) n.bq = false; }
    drop(m.from); drop(m.to);
    return n;
  }
  function epAfter(m, piece) { if (m.dbl) return idx((m.from >> 3) + (piece.c === "w" ? -1 : 1), m.from & 7); return null; }

  function legalMoves(b, color, cast, ep) {
    var pm = pseudo(b, color, ep), out = [], i;
    for (i = 0; i < pm.length; i++) { var nb = apply(b, pm[i]).board; if (!attacked(nb, findKing(nb, color), opp(color))) out.push(pm[i]); }
    // castling
    var row = color === "w" ? 7 : 0, kIdx = idx(row, 4);
    if (b[kIdx] && b[kIdx].t === "K" && !attacked(b, kIdx, opp(color))) {
      var ks = color === "w" ? cast.wk : cast.bk, qs = color === "w" ? cast.wq : cast.bq;
      if (ks && !b[idx(row, 5)] && !b[idx(row, 6)] && b[idx(row, 7)] && b[idx(row, 7)].t === "R" && !attacked(b, idx(row, 5), opp(color)) && !attacked(b, idx(row, 6), opp(color))) out.push({ from: kIdx, to: idx(row, 6), castle: "K" });
      if (qs && !b[idx(row, 3)] && !b[idx(row, 2)] && !b[idx(row, 1)] && b[idx(row, 0)] && b[idx(row, 0)].t === "R" && !attacked(b, idx(row, 3), opp(color)) && !attacked(b, idx(row, 2), opp(color))) out.push({ from: kIdx, to: idx(row, 2), castle: "Q" });
    }
    return out;
  }

  /* ---- AI: alpha-beta negamax ---- */
  function staticEval(b) {
    var s = 0; for (var i = 0; i < 64; i++) { var p = b[i]; if (!p) continue; var v = VAL[p.t]; var r = i >> 3, c = i & 7; var centre = (3.5 - Math.abs(3.5 - c)) + (3.5 - Math.abs(3.5 - r)); v += centre * 4; s += p.c === "w" ? v : -v; } return s;
  }
  function negamax(b, color, cast, ep, depth, alpha, beta) {
    var moves = legalMoves(b, color, cast, ep);
    if (!moves.length) { if (attacked(b, findKing(b, color), opp(color))) return -99000 - depth; return 0; }
    if (depth === 0) return (color === "w" ? 1 : -1) * staticEval(b);
    moves.sort(function (a, z) { return (b[z.to] ? VAL[b[z.to].t] : 0) - (b[a.to] ? VAL[b[a.to].t] : 0); });
    var best = -1e9;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i], p = b[m.from], nb = apply(b, m).board;
      var sc = -negamax(nb, opp(color), nextCastle(cast, m, p), epAfter(m, p), depth - 1, -beta, -alpha);
      if (sc > best) best = sc; if (best > alpha) alpha = best; if (alpha >= beta) break;
    }
    return best;
  }
  function bestMove(b, color, cast, ep, depth) {
    var moves = legalMoves(b, color, cast, ep); if (!moves.length) return null;
    moves.sort(function (a, z) { return (b[z.to] ? VAL[b[z.to].t] : 0) - (b[a.to] ? VAL[b[a.to].t] : 0); });
    var best = -1e9, pick = moves[0], ties = [];
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i], p = b[m.from], nb = apply(b, m).board;
      var sc = -negamax(nb, opp(color), nextCastle(cast, m, p), epAfter(m, p), depth - 1, -1e9, 1e9);
      if (sc > best + 6) { best = sc; pick = m; ties = [m]; } else if (Math.abs(sc - best) <= 6) ties.push(m);
    }
    return ties[Math.floor(Math.random() * ties.length)] || pick;
  }

  /* ===================== piece sigils (engraved, per role) ===================== */
  function pieceArt(c, x, y, sz, role, side, accent) {
    // side: "w" bright gold, "b" dark bronze; accent tints the gem per pantheon
    var lit = side === "w" ? "#f0d38a" : "#6a5a86", dark = side === "w" ? "#9a7433" : "#2a2440", out = side === "w" ? "#3a2c1a" : "#0e0a1a", rim = side === "w" ? "#ffe9b0" : "#9a86c8";
    c.save(); c.translate(x, y); var s = sz;
    c.lineWidth = Math.max(1.5, s * 0.045); c.strokeStyle = out; c.lineJoin = "round"; c.lineCap = "round";
    function grad(h) { var g = c.createLinearGradient(0, -h, 0, h); g.addColorStop(0, lit); g.addColorStop(1, dark); return g; }
    // base plinth
    c.fillStyle = grad(s * 0.5); c.beginPath(); c.moveTo(-s * 0.30, s * 0.40); c.lineTo(s * 0.30, s * 0.40); c.lineTo(s * 0.22, s * 0.30); c.lineTo(-s * 0.22, s * 0.30); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = grad(s * 0.5);
    if (role === "P") { c.beginPath(); c.moveTo(-s * 0.13, s * 0.30); c.lineTo(s * 0.13, s * 0.30); c.lineTo(s * 0.08, -s * 0.02); c.lineTo(-s * 0.08, -s * 0.02); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.arc(0, -s * 0.12, s * 0.13, 0, 7); c.fill(); c.stroke(); }
    else if (role === "R") { c.beginPath(); c.moveTo(-s * 0.20, s * 0.30); c.lineTo(-s * 0.20, -s * 0.18); c.lineTo(s * 0.20, -s * 0.18); c.lineTo(s * 0.20, s * 0.30); c.closePath(); c.fill(); c.stroke(); c.beginPath(); for (var b = -2; b <= 2; b++) { var bx = b * s * 0.1; c.rect(bx - s * 0.035, -s * 0.32, s * 0.07, s * 0.14); } c.fill(); c.stroke(); }
    else if (role === "B") { c.beginPath(); c.moveTo(0, -s * 0.42); c.quadraticCurveTo(s * 0.20, -s * 0.12, s * 0.12, s * 0.30); c.lineTo(-s * 0.12, s * 0.30); c.quadraticCurveTo(-s * 0.20, -s * 0.12, 0, -s * 0.42); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-s * 0.06, -s * 0.16); c.lineTo(s * 0.06, -s * 0.06); c.stroke(); }
    else if (role === "N") { c.beginPath(); c.moveTo(-s * 0.16, s * 0.30); c.lineTo(-s * 0.14, -s * 0.06); c.quadraticCurveTo(-s * 0.18, -s * 0.28, s * 0.02, -s * 0.40); c.quadraticCurveTo(s * 0.22, -s * 0.44, s * 0.20, -s * 0.16); c.lineTo(s * 0.06, -s * 0.10); c.quadraticCurveTo(s * 0.14, s * 0.02, s * 0.16, s * 0.30); c.closePath(); c.fill(); c.stroke(); c.fillStyle = out; c.beginPath(); c.arc(s * 0.08, -s * 0.28, s * 0.03, 0, 7); c.fill(); c.fillStyle = grad(s * 0.5); c.beginPath(); c.moveTo(s * 0.16, -s * 0.36); c.lineTo(s * 0.26, -s * 0.40); c.lineTo(s * 0.18, -s * 0.30); c.closePath(); c.fill(); }
    else { // K / Q crowns
      c.beginPath(); c.moveTo(-s * 0.18, s * 0.30); c.lineTo(-s * 0.18, -s * 0.04); c.lineTo(s * 0.18, -s * 0.04); c.lineTo(s * 0.18, s * 0.30); c.closePath(); c.fill(); c.stroke();
      c.beginPath();
      if (role === "K") { c.moveTo(-s * 0.22, -s * 0.04); c.lineTo(-s * 0.22, -s * 0.24); c.lineTo(-s * 0.08, -s * 0.14); c.lineTo(0, -s * 0.30); c.lineTo(s * 0.08, -s * 0.14); c.lineTo(s * 0.22, -s * 0.24); c.lineTo(s * 0.22, -s * 0.04); }
      else { c.moveTo(-s * 0.24, -s * 0.04); c.lineTo(-s * 0.20, -s * 0.30); c.lineTo(-s * 0.08, -s * 0.14); c.lineTo(0, -s * 0.36); c.lineTo(s * 0.08, -s * 0.14); c.lineTo(s * 0.20, -s * 0.30); c.lineTo(s * 0.24, -s * 0.04); }
      c.closePath(); c.fill(); c.stroke();
      // gem (pantheon accent)
      c.fillStyle = accent || rim; c.beginPath(); c.arc(0, role === "K" ? -s * 0.30 : -s * 0.30, s * 0.05, 0, 7); c.fill();
      if (role === "K") { c.strokeStyle = accent || rim; c.lineWidth = s * 0.04; c.beginPath(); c.moveTo(0, -s * 0.40); c.lineTo(0, -s * 0.24); c.moveTo(-s * 0.06, -s * 0.32); c.lineTo(s * 0.06, -s * 0.32); c.stroke(); }
    }
    c.restore();
  }

  /* ===================== the game instance ===================== */
  function mountGame(root, ctx) {
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var C = { panel: v("--panel", "#1e150d"), ground: v("--ground", "#140d07"), gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"), ink: v("--ink", "#cdbb96"), line: v("--line", "#3a2c1a"), good: v("--good", "#7e9e5c"), parch: v("--parchment", "#e6dabf") };
    var LIGHT = "#2e2114", DARK = "#1a120a", SELCOL = "rgba(199,154,84,.5)", MOVECOL = "rgba(126,158,92,.5)", CHKCOL = "rgba(178,60,52,.6)";
    var ACCENT = { greek: "#bfe3ff", egyptian: "#57c6c6", norse: "#9a86c8" };

    var canvas, cx, boardEl, factEl, statusEl, raf = null, DPR = 1, N = 8, SZ = 44, BW = N * SZ;
    var st, cfg = { you: "greek", foe: "egyptian", twoP: false }, keyfn = null;

    function newState(youPan, foePan, twoP) {
      return { board: initBoard(), turn: "w", cast: { wk: true, wq: true, bk: true, bq: true }, ep: null,
        sel: null, legal: [], last: null, over: false, result: "", captures: [],
        wPan: youPan, bPan: foePan, twoP: twoP, thinking: false };
    }

    /* ---- rendering ---- */
    function draw() {
      cx.clearRect(0, 0, BW, BW);
      var kInChk = null;
      if (inCheck(st.board, st.turn)) kInChk = findKing(st.board, st.turn);
      for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
        var i = idx(r, c), x = c * SZ, y = r * SZ;
        cx.fillStyle = (r + c) % 2 ? DARK : LIGHT; cx.fillRect(x, y, SZ, SZ);
        if (st.last && (st.last.from === i || st.last.to === i)) { cx.fillStyle = "rgba(199,154,84,.16)"; cx.fillRect(x, y, SZ, SZ); }
        if (i === kInChk) { cx.fillStyle = CHKCOL; cx.fillRect(x, y, SZ, SZ); }
      }
      // selection + legal targets
      if (st.sel != null) { var sr = st.sel >> 3, sc2 = st.sel & 7; cx.fillStyle = SELCOL; cx.fillRect(sc2 * SZ, sr * SZ, SZ, SZ);
        st.legal.forEach(function (m) { if (m.from !== st.sel) return; var tr = m.to >> 3, tc = m.to & 7, cxp = tc * SZ + SZ / 2, cyp = tr * SZ + SZ / 2; cx.fillStyle = MOVECOL;
          if (st.board[m.to] || m.ep) { cx.lineWidth = 3; cx.strokeStyle = MOVECOL; cx.beginPath(); cx.arc(cxp, cyp, SZ * 0.42, 0, 7); cx.stroke(); } else { cx.beginPath(); cx.arc(cxp, cyp, SZ * 0.16, 0, 7); cx.fill(); } });
      }
      // pieces
      for (r = 0; r < 8; r++) for (c = 0; c < 8; c++) { var p = st.board[idx(r, c)]; if (!p) continue; var pan = p.c === "w" ? st.wPan : st.bPan; pieceArt(cx, c * SZ + SZ / 2, r * SZ + SZ / 2 + SZ * 0.03, SZ * 0.86, p.t, p.c, ACCENT[pan]); }
      // edge frame
      cx.strokeStyle = C.line; cx.lineWidth = 2; cx.strokeRect(1, 1, BW - 2, BW - 2);
    }
    function inCheck(b, color) { return attacked(b, findKing(b, color), opp(color)); }

    function setStatus() {
      var t = "";
      if (st.over) t = st.result;
      else { var side = st.turn === "w" ? DATA.pantheons[st.wPan].name : DATA.pantheons[st.bPan].name; var who = st.turn === "w" ? "White" : "Black"; t = who + " to move — " + side + (inCheck(st.board, st.turn) ? " · in check" : ""); if (st.thinking) t = "The opponent contemplates…"; }
      statusEl.textContent = t;
    }

    /* ---- interaction ---- */
    function tileFromXY(px, py) { var rect = canvas.getBoundingClientRect(); var c = Math.floor((px - rect.left) / (rect.width / 8)), r = Math.floor((py - rect.top) / (rect.height / 8)); if (!inB(r, c)) return -1; return idx(r, c); }
    function humanTurn() { return !st.over && !st.thinking && (st.turn === "w" || st.twoP); }
    function onClick(ev) {
      if (!humanTurn()) return;
      var i = tileFromXY(ev.clientX, ev.clientY); if (i < 0) return;
      var p = st.board[i];
      if (st.sel == null) { if (p && p.c === st.turn) { st.sel = i; st.legal = legalMoves(st.board, st.turn, st.cast, st.ep); draw(); } return; }
      // clicking a legal target?
      var mv = null; for (var k = 0; k < st.legal.length; k++) if (st.legal[k].from === st.sel && st.legal[k].to === i) { mv = st.legal[k]; break; }
      if (mv) { doMove(mv); }
      else if (p && p.c === st.turn) { st.sel = i; draw(); }
      else { st.sel = null; draw(); }
    }

    function doMove(m) {
      var piece = st.board[m.from], res = apply(st.board, m);
      st.board = res.board; st.cast = nextCastle(st.cast, m, piece); st.ep = epAfter(m, piece); st.last = { from: m.from, to: m.to };
      st.sel = null; st.legal = [];
      if (res.captured) showCapture(res.captured, piece.c);
      st.turn = opp(st.turn);
      // end conditions
      var lm = legalMoves(st.board, st.turn, st.cast, st.ep);
      if (!lm.length) { st.over = true; if (inCheck(st.board, st.turn)) { var winPan = st.turn === "w" ? st.bPan : st.wPan; st.result = "Checkmate — " + DATA.pantheons[winPan].name + " triumph."; } else st.result = "Stalemate — the board is still."; }
      draw(); setStatus();
      if (!st.over && st.turn === "b" && !st.twoP) { st.thinking = true; setStatus(); setTimeout(aiMove, 220); }
    }
    function aiMove() {
      var depth = 3, m = bestMove(st.board, "b", st.cast, st.ep, depth);
      st.thinking = false;
      if (m) doMove(m); else { st.over = true; setStatus(); }
    }
    function showCapture(piece, byColor) {
      var pan = piece.c === "w" ? st.wPan : st.bPan, info = DATA.pantheons[pan].roles[piece.t], ch = DATA.pantheons[pan].chapter;
      st.captures.push(piece);
      factEl.innerHTML = '<span class="ch-sym">✦</span> <strong>' + esc(info.god) + " taken.</strong> " + esc(info.fact) +
        ' <a class="game-source" href="chapters/' + ch + '.html">› Read “' + esc(chapterTitle(ch)) + "”</a>";
    }
    function chapterTitle(id) { var a = (window.ARCHIVE || {}).chapters || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].title; return id; }

    /* ---- select + shell + flow ---- */
    var PANS = ["greek", "egyptian", "norse"];
    function panLabel(k) { return { greek: "Olympian", egyptian: "Egyptian", norse: "Aesir" }[k]; }
    function selectScreen() {
      if (raf) cancelAnimationFrame(raf);
      var sel = { you: cfg.you, foe: cfg.foe, twoP: cfg.twoP };
      function pantheonRow(role, cur) {
        return '<div class="ch-cards">' + PANS.map(function (k) {
          var pan = DATA.pantheons[k];
          return '<button class="ch-card' + (cur === k ? " is-sel" : "") + '" data-role="' + role + '" data-pan="' + k + '">' +
            '<span class="ch-card-emblem" style="color:' + ACCENT[k] + '">✶</span><span class="ch-card-name">' + panLabel(k) + '</span>' +
            '<span class="ch-card-ep">' + esc(pan.name) + '</span></button>';
        }).join("") + "</div>";
      }
      function render() {
        root.innerHTML =
          '<div class="game-head" style="margin-bottom:.3rem"><p class="eyebrow">The Divine Archives · Games</p>' +
            '<h2 id="' + ctx.titleId + '" style="font-size:1.3rem">Archive Chess</h2>' +
            "<p>Choose a pantheon for each side. Every piece is a god; every capture opens a fact.</p></div>" +
          '<div class="game-rule" role="presentation"></div>' +
          '<p class="fg-sel-row-label">Your pantheon (White)</p>' + pantheonRow("you", sel.you) +
          '<div class="fg-sel-mode"><button class="rq-btn" data-a="mode">Opponent: ' + (sel.twoP ? "Player 2 (human)" : "the AI") + "</button></div>" +
          '<p class="fg-sel-row-label">' + (sel.twoP ? "Player 2 (Black)" : "Opponent (Black)") + '</p>' + pantheonRow("foe", sel.foe) +
          '<div class="rq-actions"><button class="rq-btn rq-primary" data-a="play" autofocus>Set the board ♟</button></div>' +
          '<p class="rq-note">Tap a god, then tap where it moves. Full chess — castling, promotion, en passant. Capture a god to reveal its lore.</p>';
        root.querySelectorAll(".ch-card").forEach(function (b) { b.addEventListener("click", function () { sel[b.getAttribute("data-role")] = b.getAttribute("data-pan"); render(); }); });
        root.querySelector('[data-a="mode"]').addEventListener("click", function () { sel.twoP = !sel.twoP; render(); });
        root.querySelector('[data-a="play"]').addEventListener("click", function () { cfg = { you: sel.you, foe: sel.foe, twoP: sel.twoP }; startGame(); });
      }
      render();
    }
    function shell() {
      root.innerHTML =
        '<div class="game-head" style="margin-bottom:.3rem"><p class="eyebrow">Archive Chess</p>' +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.15rem">' + esc(DATA.pantheons[cfg.you].name) + ' vs ' + esc(DATA.pantheons[cfg.foe].name) + '</h2></div>' +
        '<p class="ch-status" aria-live="polite"></p>' +
        '<div class="ch-boardwrap"><canvas class="ch-board" width="' + BW + '" height="' + BW + '" role="img" aria-label="Chess board"></canvas></div>' +
        '<p class="ouro-toast ch-fact" aria-live="polite"></p>' +
        '<div class="rq-actions" style="gap:.5rem;margin-top:.3rem"><button class="rq-btn" data-a="new">New match</button>' +
          '<button class="rq-btn" data-a="resign">Resign</button>' +
          '<a class="game-source" href="chapters/ch02.html">› The pantheons</a></div>';
      canvas = root.querySelector(".ch-board"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2); canvas.width = BW * DPR; canvas.height = BW * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      statusEl = root.querySelector(".ch-status"); factEl = root.querySelector(".ch-fact");
      canvas.addEventListener("click", onClick);
      root.querySelector('[data-a="new"]').addEventListener("click", selectScreen);
      root.querySelector('[data-a="resign"]').addEventListener("click", function () { if (st.over) return; st.over = true; st.result = "Resigned — " + DATA.pantheons[st.turn === "w" ? st.bPan : st.wPan].name + " take the field."; setStatus(); });
    }
    function startGame() { shell(); st = newState(cfg.you, cfg.foe, cfg.twoP); draw(); setStatus(); }

    root.innerHTML = '<div class="rq-loading">Setting the board…</div>';
    loadData().then(selectScreen).catch(function () { root.innerHTML = '<p class="game-placeholder">The board could not be loaded. Please reload.</p>'; });

    return function cleanup() { if (raf) cancelAnimationFrame(raf); if (keyfn) document.removeEventListener("keydown", keyfn); };
  }

  // node-only export for engine tests (tools/verify not needed; harness perft)
  if (typeof module !== "undefined" && module.exports) module.exports = { initBoard: initBoard, legalMoves: legalMoves, apply: apply, nextCastle: nextCastle, epAfter: epAfter, attacked: attacked, findKing: findKing, opp: opp };
})();
