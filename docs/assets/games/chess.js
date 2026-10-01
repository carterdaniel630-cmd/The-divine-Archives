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
    if (depth === 0) return quiesce(b, color, cast, ep, alpha, beta, 4);
    moves.sort(function (a, z) { return (b[z.to] ? VAL[b[z.to].t] : 0) - (b[a.to] ? VAL[b[a.to].t] : 0); });
    var best = -1e9;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i], p = b[m.from], nb = apply(b, m).board;
      var sc = -negamax(nb, opp(color), nextCastle(cast, m, p), epAfter(m, p), depth - 1, -beta, -alpha);
      if (sc > best) best = sc; if (best > alpha) alpha = best; if (alpha >= beta) break;
    }
    return best;
  }
  // quiescence: at the horizon, keep resolving captures (best victim, cheapest attacker
  // first) until the position is quiet, so the AI doesn't grab a piece that is
  // simply recaptured one move past its search depth
  function quiesce(b, color, cast, ep, alpha, beta, qd) {
    var stand = (color === "w" ? 1 : -1) * staticEval(b);
    if (stand >= beta || qd <= 0) return stand;
    if (stand > alpha) alpha = stand;
    var caps = legalMoves(b, color, cast, ep).filter(function (m) { return b[m.to] || m.promo; });
    caps.sort(function (a, z) { return ((b[z.to] ? VAL[b[z.to].t] : 0) - VAL[b[z.from].t] / 10) - ((b[a.to] ? VAL[b[a.to].t] : 0) - VAL[b[a.from].t] / 10); });
    for (var i = 0; i < caps.length; i++) {
      var m = caps[i], p = b[m.from];
      var sc = -quiesce(apply(b, m).board, opp(color), nextCastle(cast, m, p), epAfter(m, p), -beta, -alpha, qd - 1);
      if (sc >= beta) return sc;
      if (sc > alpha) alpha = sc;
    }
    return alpha;
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

  /* ===================== the game instance ===================== */
  function mountGame(root, ctx) {
    var css = getComputedStyle(document.documentElement);
    function v(n, fb) { return (css.getPropertyValue(n) || fb).trim(); }
    var C = { panel: v("--panel", "#1e150d"), ground: v("--ground", "#140d07"), gold: v("--gold", "#c79a54"), goldB: v("--gold-bright", "#e7c680"), ember: v("--ember", "#b26a34"), ink: v("--ink", "#cdbb96"), line: v("--line", "#3a2c1a"), good: v("--good", "#7e9e5c"), parch: v("--parchment", "#e6dabf") };
    var SELCOL = "rgba(199,154,84,.5)", MOVECOL = "rgba(126,158,92,.5)", CHKCOL = "rgba(178,60,52,.6)";

    var canvas, cx, factEl, statusEl, trayW, trayB, raf = null, DPR = 1, N = 8, SZ = 44, BW = N * SZ, M = 32, TOT = BW + 2 * M;
    var ART = window.ChessArt;
    var st, cfg = { you: "greek", foe: "egyptian", twoP: false }, keyfn = null;

    function newState(youPan, foePan, twoP) {
      return { board: initBoard(), turn: "w", cast: { wk: true, wq: true, bk: true, bq: true }, ep: null,
        sel: null, legal: [], last: null, over: false, result: "", captures: [], anim: null,
        wPan: youPan, bPan: foePan, twoP: twoP, thinking: false };
    }

    /* ---- rendering: the framed board (chess-art.js), statuette pieces, a sliding move ---- */
    var boardBg = null;
    function sq(i) { return { x: M + (i & 7) * SZ, y: M + (i >> 3) * SZ }; }
    function drawPiece(p, x, y, lift) {
      var pan = p.c === "w" ? st.wPan : st.bPan, img = ART.sprite(pan, p.t, p.c, SZ * 0.98 * DPR);
      // contact shadow on the stone
      cx.fillStyle = "rgba(0,0,0," + (lift ? 0.25 : 0.45) + ")"; cx.beginPath(); cx.ellipse(x + SZ / 2, y + SZ * 0.9, SZ * 0.3, SZ * 0.075, 0, 0, 7); cx.fill();
      cx.drawImage(img, x + SZ * 0.01, y - (lift || 0), SZ * 0.98, SZ * 0.98);
    }
    function draw() {
      cx.clearRect(0, 0, TOT, TOT);
      var kInChk = null;
      if (inCheck(st.board, st.turn)) kInChk = findKing(st.board, st.turn);
      if (!boardBg || boardBg.dpr !== DPR) { boardBg = ART.board(BW, DPR, M); boardBg.dpr = DPR; }
      cx.drawImage(boardBg, 0, 0, TOT, TOT);
      // last move, check
      for (var i = 0; i < 64; i++) {
        var q = sq(i);
        if (st.last && (st.last.from === i || st.last.to === i)) { cx.fillStyle = "rgba(231,198,128,.2)"; cx.fillRect(q.x, q.y, SZ, SZ); }
        if (i === kInChk) { var kg = cx.createRadialGradient(q.x + SZ / 2, q.y + SZ / 2, 2, q.x + SZ / 2, q.y + SZ / 2, SZ * 0.72); kg.addColorStop(0, "rgba(240,90,60,.85)"); kg.addColorStop(1, "rgba(178,60,52,0)"); cx.fillStyle = kg; cx.fillRect(q.x, q.y, SZ, SZ); }
      }
      // selection: a gold ring; legal targets: jewels, capture brackets
      if (st.sel != null) {
        var s0 = sq(st.sel); cx.strokeStyle = "rgba(247,214,140,.95)"; cx.lineWidth = 2.2; cx.strokeRect(s0.x + 2, s0.y + 2, SZ - 4, SZ - 4);
        cx.fillStyle = "rgba(247,214,140,.18)"; cx.fillRect(s0.x, s0.y, SZ, SZ);
        st.legal.forEach(function (m) {
          if (m.from !== st.sel) return; var t = sq(m.to), mx = t.x + SZ / 2, my = t.y + SZ / 2;
          if (st.board[m.to] || m.ep) {
            cx.strokeStyle = "rgba(126,190,110,.95)"; cx.lineWidth = 2.4; var k = SZ * 0.26;
            [[t.x + 3, t.y + 3, 1, 1], [t.x + SZ - 3, t.y + 3, -1, 1], [t.x + 3, t.y + SZ - 3, 1, -1], [t.x + SZ - 3, t.y + SZ - 3, -1, -1]].forEach(function (c) { cx.beginPath(); cx.moveTo(c[0], c[1] + c[3] * k); cx.lineTo(c[0], c[1]); cx.lineTo(c[0] + c[2] * k, c[1]); cx.stroke(); });
          } else {
            var jg = cx.createRadialGradient(mx - 2, my - 2, 0, mx, my, SZ * 0.14); jg.addColorStop(0, "#e8ffe0"); jg.addColorStop(0.5, "rgba(126,190,110,.9)"); jg.addColorStop(1, "rgba(60,110,50,.6)");
            cx.fillStyle = jg; cx.beginPath(); cx.arc(mx, my, SZ * 0.12, 0, 7); cx.fill();
          }
        });
      }
      // pieces (the one in flight is drawn last, lifted)
      var a = st.anim, now = performance.now(), k2 = a ? Math.min(1, (now - a.t0) / a.dur) : 1;
      for (i = 0; i < 64; i++) { var p = st.board[i]; if (!p || (a && i === a.to && k2 < 1)) continue; var q2 = sq(i); drawPiece(p, q2.x, q2.y); }
      if (a && k2 < 1) {
        var e = k2 < 0.5 ? 2 * k2 * k2 : 1 - Math.pow(-2 * k2 + 2, 2) / 2, f = sq(a.from), t2 = sq(a.to);
        if (a.cap) { cx.globalAlpha = 1 - k2; drawPiece(a.cap, t2.x, t2.y); cx.globalAlpha = 1; }
        drawPiece(a.p, f.x + (t2.x - f.x) * e, f.y + (t2.y - f.y) * e, Math.sin(k2 * Math.PI) * SZ * 0.18);
        raf = requestAnimationFrame(draw);
      } else if (a) { st.anim = null; }
    }
    function drawTrays() {
      function tray(el, color) {
        if (!el) return; el.innerHTML = "";
        st.captures.filter(function (p) { return p.c === color; }).sort(function (x, y) { return VAL[y.t] - VAL[x.t]; }).forEach(function (p) {
          var c = document.createElement("canvas"), px = 28 * Math.min(window.devicePixelRatio || 1, 2); c.width = c.height = px; c.className = "ch-cap";
          c.getContext("2d").drawImage(ART.sprite(p.c === "w" ? st.wPan : st.bPan, p.t, p.c, px), 0, 0);
          el.appendChild(c);
        });
      }
      tray(trayB, "b"); tray(trayW, "w");
    }
    function inCheck(b, color) { return attacked(b, findKing(b, color), opp(color)); }

    function setStatus() {
      var t = "";
      if (st.over) t = st.result;
      else { var side = st.turn === "w" ? DATA.pantheons[st.wPan].name : DATA.pantheons[st.bPan].name; var who = st.turn === "w" ? "White" : "Black"; t = who + " to move — " + side + (inCheck(st.board, st.turn) ? " · in check" : ""); if (st.thinking) t = "The opponent contemplates…"; }
      statusEl.textContent = t;
    }

    /* ---- interaction ---- */
    function tileFromXY(px, py) {
      var rect = canvas.getBoundingClientRect(), k = TOT / rect.width;
      var c = Math.floor(((px - rect.left) * k - M) / SZ), r = Math.floor(((py - rect.top) * k - M) / SZ);
      if (!inB(r, c)) return -1; return idx(r, c);
    }
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
      st.anim = { p: piece.t === "P" && m.promo ? { t: "Q", c: piece.c } : piece, from: m.from, to: m.to, cap: st.board[m.to], t0: performance.now(), dur: 230 };
      st.board = res.board; st.cast = nextCastle(st.cast, m, piece); st.ep = epAfter(m, piece); st.last = { from: m.from, to: m.to };
      st.sel = null; st.legal = [];
      if (res.captured) { showCapture(res.captured, piece.c); drawTrays(); }
      st.turn = opp(st.turn);
      // end conditions
      var lm = legalMoves(st.board, st.turn, st.cast, st.ep);
      if (!lm.length) { st.over = true; if (inCheck(st.board, st.turn)) { var winPan = st.turn === "w" ? st.bPan : st.wPan; st.result = "Checkmate — " + DATA.pantheons[winPan].name + " triumph."; } else st.result = "Stalemate — the board is still."; }
      draw(); setStatus();
      if (!st.over && st.turn === "b" && !st.twoP) { st.thinking = true; setStatus(); setTimeout(aiMove, 320); }
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
            '<canvas class="ch-card-art" data-pan="' + k + '" width="112" height="64" aria-hidden="true"></canvas><span class="ch-card-name">' + panLabel(k) + '</span>' +
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
        // each card shows the pantheon's king and queen as statuettes
        root.querySelectorAll(".ch-card-art").forEach(function (cv) {
          var pan = cv.getAttribute("data-pan"), c = cv.getContext("2d"), side = cv.closest('[data-role="foe"]') ? "b" : "w";
          c.drawImage(ART.sprite(pan, "Q", side, 128), -2, -2, 68, 68); c.drawImage(ART.sprite(pan, "K", side, 128), 46, -2, 68, 68);
        });
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
        '<div class="ch-tray ch-tray-b" aria-label="Gods taken from Black"></div>' +
        '<div class="ch-boardwrap"><canvas class="ch-board" width="' + TOT + '" height="' + TOT + '" role="img" aria-label="Chess board"></canvas></div>' +
        '<div class="ch-tray ch-tray-w" aria-label="Gods taken from White"></div>' +
        '<p class="ouro-toast ch-fact" aria-live="polite"></p>' +
        '<div class="rq-actions" style="gap:.5rem;margin-top:.3rem"><button class="rq-btn" data-a="new">New match</button>' +
          '<button class="rq-btn" data-a="resign">Resign</button>' +
          '<a class="game-source" href="chapters/ch02.html">› The pantheons</a></div>';
      canvas = root.querySelector(".ch-board"); cx = canvas.getContext("2d");
      DPR = Math.min(window.devicePixelRatio || 1, 2) * Math.max(0.25, (canvas.getBoundingClientRect().width || TOT) / TOT); canvas.width = Math.round(TOT * DPR); canvas.height = Math.round(TOT * DPR); cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      AG.onFit(canvas, function () { DPR = AG.scaleFor(canvas, TOT); canvas.width = Math.round(TOT * DPR); canvas.height = Math.round(TOT * DPR); cx.setTransform(DPR, 0, 0, DPR, 0, 0); draw(); });
      statusEl = root.querySelector(".ch-status"); factEl = root.querySelector(".ch-fact"); trayW = root.querySelector(".ch-tray-w"); trayB = root.querySelector(".ch-tray-b");
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
