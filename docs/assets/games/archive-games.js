/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games Layer (shared framework)

   Static, no backend, no login. Everything client-side; progress in localStorage.
   Provides the ONE interaction model for the whole layer:

     - registerSymbol(el, opts): turn any symbol artwork into an accessible,
       keyboard- + screen-reader-friendly activator (dormant → hover shimmer →
       activated), which expands IN PLACE into a themed game overlay.
     - register(gameId, def): game modules (Phases 2–6) register a mount fn.
     - a first-visit, dismissible hint.
     - randomized easter-egg seeding.
     - shared localStorage + high-score helpers used by every game.

   No facts live here — games load their own sourced fact/clue banks.
   ========================================================================== */
(function () {
  "use strict";

  var NS = "da.games.";               // localStorage namespace
  var games = {};                     // gameId -> def
  var lastFocus = null;               // element to restore focus to on close
  var openState = null;               // { overlay, trigger, cleanup }

  /* ---------------- safe localStorage ---------------- */
  function lsGet(key, def) {
    try { var v = localStorage.getItem(NS + key); return v == null ? def : JSON.parse(v); }
    catch (e) { return def; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(NS + key, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }

  /* ---------------- high scores (per game, local only) ---------------- */
  function getHighScores(gameId) { var a = lsGet("score." + gameId, []); return Array.isArray(a) ? a : []; }
  function addHighScore(gameId, entry) {
    var a = getHighScores(gameId);
    a.push(Object.assign({ at: Date.now() }, entry));
    a.sort(function (x, y) { return (y.score || 0) - (x.score || 0); });
    a = a.slice(0, 10);
    lsSet("score." + gameId, a);
    return a;
  }
  function bestScore(gameId) { var a = getHighScores(gameId); return a.length ? (a[0].score || 0) : 0; }

  /* ---------------- game registry ---------------- */
  // def: { title, subtitle?, mount(container, ctx) -> cleanupFn|void, symbolSVG?, sourceHref?, sourceLabel? }
  function register(gameId, def) { games[gameId] = def || {}; }
  function isRegistered(gameId) { return !!games[gameId] && typeof games[gameId].mount === "function"; }

  /* ---------------- accessible symbol trigger ---------------- */
  // opts: { gameId, symbolName, symbolSVG?, sourceHref?, sourceLabel? }
  function registerSymbol(el, opts) {
    if (!el || el.__daGame) return el;
    opts = opts || {};
    el.__daGame = opts;
    el.classList.add("symbol-trigger");
    if (!el.hasAttribute("role") && el.tagName !== "BUTTON") el.setAttribute("role", "button");
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    el.setAttribute("aria-haspopup", "dialog");
    el.setAttribute("aria-expanded", "false");
    var title = (games[opts.gameId] && games[opts.gameId].title) || opts.title || "a game";
    el.setAttribute("aria-label",
      "Play " + title + " — a game hidden in the " + (opts.symbolName || "symbol") + ". Activate to open.");
    // a subtle spark marker so the live symbol reads as interactive
    if (!el.querySelector(".sigil-spark")) {
      var spark = document.createElement("span");
      spark.className = "sigil-spark"; spark.setAttribute("aria-hidden", "true");
      el.appendChild(spark);
    }
    el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); activate(el); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); e.stopPropagation(); activate(el); }
    });
    return el;
  }

  /* ---------------- open / close overlay ---------------- */
  function activate(trigger) {
    var opts = trigger.__daGame || {};
    open(opts.gameId, { trigger: trigger, opts: opts });
  }

  function open(gameId, ctx) {
    close(); // only one at a time
    ctx = ctx || {};
    var def = games[gameId] || {};
    lastFocus = ctx.trigger || document.activeElement;

    var overlay = document.createElement("div");
    overlay.className = "game-overlay";
    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });

    var dialog = document.createElement("div");
    dialog.className = "game-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    var titleId = "gdlg-title-" + Math.random().toString(36).slice(2, 8);
    dialog.setAttribute("aria-labelledby", titleId);

    var closeBtn = document.createElement("button");
    closeBtn.className = "game-close"; closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close game and return to the symbol");
    closeBtn.innerHTML = "✕";
    closeBtn.addEventListener("click", close);
    dialog.appendChild(closeBtn);

    // full screen: the browser's own full screen where it exists (it hides the address bar), and on
    // phones the wide action games also turn to landscape; otherwise (iPhone) the dialog fills the window
    var fsBtn = document.createElement("button");
    fsBtn.className = "game-fs"; fsBtn.type = "button";
    fsBtn.setAttribute("aria-pressed", "false");
    fsBtn.innerHTML = '<span aria-hidden="true">⛶</span> <span class="game-fs-l">Full screen</span>';
    fsBtn.addEventListener("click", function () { toggleFull(); });
    dialog.appendChild(fsBtn);

    var body = document.createElement("div");
    body.setAttribute("data-game-body", "");
    dialog.appendChild(body);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";
    if (ctx.trigger) ctx.trigger.setAttribute("aria-expanded", "true");

    // mount the game (or a themed placeholder if not yet built)
    var cleanup;
    var mountCtx = {
      dialog: dialog, close: close, titleId: titleId,
      opts: ctx.opts || {}, lsGet: lsGet, lsSet: lsSet,
      getHighScores: getHighScores, addHighScore: addHighScore, bestScore: bestScore,
      sourceLink: sourceLink
    };
    try {
      if (isRegistered(gameId)) cleanup = def.mount(body, mountCtx);
      else placeholder(body, mountCtx, gameId, def);
    } catch (err) {
      body.innerHTML = '<p class="game-placeholder">This game could not open. Please reload.</p>';
      if (window.console) console.error(err);
    }

    // physical game controllers for the keyboard-only arcade games (the action games read them directly)
    var PADKEYS = {
      ouroboros: { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", start: "p" },
      pacman: { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" },
      ziggurat: { left: "ArrowLeft", right: "ArrowRight", down: "ArrowDown", up: "ArrowUp", a: " ", b: "x", x: "z", y: "c", l: "c", r: "c", start: "p" },
      pong: { up: "w", down: "s" },
      pinball: { left: "ArrowLeft", right: "ArrowRight", l: "ArrowLeft", r: "ArrowRight", a: " ", b: " " }
    };
    var stopBridge = (window.ArchivePad && PADKEYS[gameId]) ? window.ArchivePad.bridge(PADKEYS[gameId]) : null;
    openState = { overlay: overlay, dialog: dialog, fsBtn: fsBtn, gameId: gameId, trigger: ctx.trigger || null, cleanup: cleanup, stopBridge: stopBridge };

    // focus management + trap + Esc
    (dialog.querySelector("[autofocus]") || closeBtn).focus();
    overlay.addEventListener("keydown", onKeydown);
    return openState;
  }

  var LANDSCAPE = { treasure: 1, fighter: 1, pong: 1 };
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function setFullClass(on) {
    if (!openState) return;
    openState.overlay.classList.toggle("is-full", on); openState.dialog.classList.toggle("is-full", on);
    openState.fsBtn.setAttribute("aria-pressed", String(on));
    openState.fsBtn.querySelector(".game-fs-l").textContent = on ? "Exit full screen" : "Full screen";
    // size the main picture to the room left over, then let the game re-measure its canvases
    var settle = function () { fitMain(on); try { window.dispatchEvent(new Event("archive:fit")); } catch (e) { /* old browser */ } };
    setTimeout(settle, 60); setTimeout(settle, 450);
  }
  // the largest canvas in the dialog grows to the biggest size that fits beside or above everything
  // else (a canvas never grows past its drawing size by CSS alone, so this is done here)
  function fitMain(on) {
    if (!openState) return;
    var d = openState.dialog, best = null, ba = 0;
    Array.prototype.forEach.call(d.querySelectorAll("canvas"), function (c) { var r = c.getBoundingClientRect(), a = r.width * r.height; if (a > ba) { ba = a; best = c; } });
    if (!best) return;
    ["width", "max-width", "max-height", "height"].forEach(function (k) { best.style.removeProperty(k); });
    if (!on || !openState.overlay.classList.contains("is-full")) return;
    // binary-search the widest size at which the whole dialog still fits the screen without scrolling
    var r0 = best.getBoundingClientRect().width, pw = d.clientWidth - 24;
    var set = function (w) { best.style.setProperty("width", w + "px", "important"); best.style.setProperty("height", "auto", "important"); best.style.setProperty("max-width", "100%", "important"); best.style.setProperty("max-height", "none", "important"); };
    var fits = function () { return d.scrollHeight <= d.clientHeight + 1 && d.scrollWidth <= d.clientWidth + 1; };
    var lo = Math.floor(r0), hi = Math.max(lo, Math.floor(Math.max(pw, window.innerWidth)));
    set(lo);
    var tallEnough = function () { return best.getBoundingClientRect().height >= window.innerHeight * 0.6; };
    if (!fits()) {
      // not everything fits even at the current size (a phone on its side): make the picture as tall as
      // the screen and let the text below it scroll
      var ratio = best.width / best.height, w = Math.floor(Math.min(pw, (window.innerHeight - 16) * ratio));
      set(Math.max(lo, w)); best.scrollIntoView({ block: "center" });
      return;
    }
    while (hi - lo > 4) { var mid = (lo + hi) >> 1; set(mid); if (fits() && best.getBoundingClientRect().width >= mid - 1) lo = mid; else hi = mid; }
    set(lo);
    if (!tallEnough()) {                     // fitting everything would leave the picture too small: scroll instead
      var ratio2 = best.width / best.height; set(Math.floor(Math.min(pw, (window.innerHeight - 16) * ratio2))); best.scrollIntoView({ block: "center" });
    }
  }
  function toggleFull(force) {
    if (!openState) return;
    var on = force != null ? force : !openState.overlay.classList.contains("is-full");
    var ov = openState.overlay;
    if (on) {
      setFullClass(true);
      var req = ov.requestFullscreen || ov.webkitRequestFullscreen;
      if (req) {
        try {
          var pr = req.call(ov, { navigationUI: "hide" });
          var lock = function () { if (LANDSCAPE[openState && openState.gameId] && screen.orientation && screen.orientation.lock && window.matchMedia("(pointer: coarse)").matches) screen.orientation.lock("landscape").catch(function () {}); };
          if (pr && pr.then) pr.then(lock).catch(function () {}); else lock();
        } catch (e) { /* stay in the window-filling fallback */ }
      }
    } else {
      if (fsElement()) { var ex = document.exitFullscreen || document.webkitExitFullscreen; if (ex) try { ex.call(document); } catch (e) { /* ignore */ } }
      if (screen.orientation && screen.orientation.unlock) try { screen.orientation.unlock(); } catch (e) { /* ignore */ }
      setFullClass(false);
    }
  }
  // leaving the browser's full screen (Esc, the back gesture) also leaves the full-screen layout
  function onFsChange() { if (openState && !fsElement() && openState.overlay.classList.contains("is-full") && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) setFullClass(false); }
  document.addEventListener("fullscreenchange", onFsChange); document.addEventListener("webkitfullscreenchange", onFsChange);

  function onKeydown(e) {
    if (!openState) return;
    if (e.key === "Escape") { e.preventDefault(); if (openState.overlay.classList.contains("is-full") && !fsElement()) { toggleFull(false); return; } close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(openState.overlay);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function focusables(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }

  function close() {
    if (!openState) return;
    if (openState.overlay.classList.contains("is-full")) toggleFull(false);
    try { if (typeof openState.cleanup === "function") openState.cleanup(); } catch (e) {}
    if (openState.stopBridge) openState.stopBridge();
    openState.overlay.removeEventListener("keydown", onKeydown);
    if (openState.overlay.parentNode) openState.overlay.parentNode.removeChild(openState.overlay);
    if (openState.trigger) openState.trigger.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    var restore = openState.trigger || lastFocus;
    openState = null;
    if (restore && typeof restore.focus === "function") restore.focus();
  }

  /* ---------------- shared UI helpers for game modules ---------------- */
  function sourceLink(href, label) {
    if (!href) return "";
    return '<a class="game-source" href="' + href + '">› ' + (label || "Read the source chapter") + '</a>';
  }

  // themed placeholder used until a game module is registered (Phase 1 demo)
  function placeholder(body, ctx, gameId, def) {
    var o = ctx.opts || {};
    var svg = o.symbolSVG || def.symbolSVG || "";
    var name = o.symbolName || def.title || "This symbol";
    var phase = def.phaseNote || "This game is part of the mini-games layer and arrives in a later phase.";
    body.innerHTML =
      (svg ? '<div class="game-symbol-large" aria-hidden="true">' + svg + "</div>" : "") +
      '<div class="game-head">' +
        '<p class="eyebrow">The Divine Archives · Games</p>' +
        '<h2 id="' + ctx.titleId + '">' + (def.title || name) + "</h2>" +
        (def.subtitle ? "<p>" + def.subtitle + "</p>" : "") +
      "</div>" +
      '<div class="game-placeholder"><p class="phase">In preparation</p><p>' + phase + "</p></div>" +
      ((o.sourceHref || def.sourceHref)
        ? '<p style="text-align:center;margin-top:1rem">' + sourceLink(o.sourceHref || def.sourceHref, o.sourceLabel || def.sourceLabel) + "</p>"
        : "");
  }

  /* ---------------- first-visit hint ---------------- */
  function maybeShowHint() {
    if (lsGet("hintDismissed", false)) return;
    var wrap = document.createElement("div");
    wrap.className = "games-hint"; wrap.setAttribute("role", "status");
    wrap.innerHTML =
      '<span class="sigil" aria-hidden="true">✵</span>' +
      "<div>Some of the <strong>sacred symbols</strong> on this site respond to a touch. " +
      "Look for a glow, then click or press Enter to open the game hidden inside.</div>";
    var btn = document.createElement("button");
    btn.type = "button"; btn.textContent = "Got it";
    btn.addEventListener("click", function () { lsSet("hintDismissed", true); if (wrap.parentNode) wrap.parentNode.removeChild(wrap); });
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  /* ---------------- randomized easter eggs ----------------
     Given a list of candidate {el, gameId, symbolName,...}, quietly make a
     RANDOM 1–2 of them live on this visit (varies visit to visit). Purely
     client-side; nothing marks them beyond the shared hover shimmer. */
  function seedEasterEggs(candidates, opts) {
    if (!candidates || !candidates.length) return [];
    opts = opts || {};
    var howMany = opts.count || (1 + (Math.random() < 0.4 ? 1 : 0));
    var pool = candidates.slice();
    var chosen = [];
    while (pool.length && chosen.length < howMany) {
      chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    chosen.forEach(function (c) { if (c.el) registerSymbol(c.el, c); });
    return chosen;
  }

  // a game's canvases re-measure when the dialog enters or leaves full screen (or the window
  // resizes), so the bigger picture stays sharp; the listener drops itself once the canvas is gone
  function onFit(canvas, fn) {
    var t = null;
    function h() { if (!canvas.isConnected) { window.removeEventListener("archive:fit", h); window.removeEventListener("resize", h2); return; } try { fn(); } catch (e) { if (window.console) console.error(e); } }
    function h2() { clearTimeout(t); t = setTimeout(h, 180); }
    window.addEventListener("archive:fit", h); window.addEventListener("resize", h2);
  }
  function scaleFor(canvas, logicalW, cap) {
    var w = canvas.getBoundingClientRect().width || logicalW;
    return Math.min(cap || 3, Math.min(window.devicePixelRatio || 1, 2) * Math.max(1, w / logicalW));
  }

  window.ArchiveGames = {
    onFit: onFit, scaleFor: scaleFor,
    register: register, registerSymbol: registerSymbol, isRegistered: isRegistered,
    open: open, close: close,
    lsGet: lsGet, lsSet: lsSet,
    getHighScores: getHighScores, addHighScore: addHighScore, bestScore: bestScore,
    sourceLink: sourceLink, seedEasterEggs: seedEasterEggs, maybeShowHint: maybeShowHint
  };

  if (document.readyState !== "loading") maybeShowHint();
  else document.addEventListener("DOMContentLoaded", maybeShowHint);
})();
