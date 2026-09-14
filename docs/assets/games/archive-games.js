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

    openState = { overlay: overlay, trigger: ctx.trigger || null, cleanup: cleanup };

    // focus management + trap + Esc
    (dialog.querySelector("[autofocus]") || closeBtn).focus();
    overlay.addEventListener("keydown", onKeydown);
    return openState;
  }

  function onKeydown(e) {
    if (!openState) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
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
    try { if (typeof openState.cleanup === "function") openState.cleanup(); } catch (e) {}
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

  window.ArchiveGames = {
    register: register, registerSymbol: registerSymbol, isRegistered: isRegistered,
    open: open, close: close,
    lsGet: lsGet, lsSet: lsSet,
    getHighScores: getHighScores, addHighScore: addHighScore, bestScore: bestScore,
    sourceLink: sourceLink, seedEasterEggs: seedEasterEggs, maybeShowHint: maybeShowHint
  };

  if (document.readyState !== "loading") maybeShowHint();
  else document.addEventListener("DOMContentLoaded", maybeShowHint);
})();
