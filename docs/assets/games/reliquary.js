/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Reliquary" (trivia)

   Registers with the shared ArchiveGames framework and mounts into the
   expand-in-place overlay. All questions come from docs/assets/games/data/
   reliquary.json — every one grounded in real chapter text (see
   tools/verify-reliquary.js). No facts live in this file.

   Features: era + category filters, Quick (curated) vs Full sets, scoring
   with streaks + local high scores, an optional AI opponent ("the
   Archivist"), each answer links to its source chapter, keyboard (1-4 +
   Enter) and touch friendly.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;

  // resolve the data file relative to THIS script, so it works from any page
  var DATA_URL = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/[^/]*$/, "") + "data/reliquary.json";
    return "assets/games/data/reliquary.json";
  })();

  var bank = null, loadingPromise = null;
  function loadBank() {
    if (bank) return Promise.resolve(bank);
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch(DATA_URL).then(function (r) {
      if (!r.ok) throw new Error("bank " + r.status);
      return r.json();
    }).then(function (j) { bank = (j && j.questions) || []; return bank; });
    return loadingPromise;
  }

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function chapterTitle(id) { var a = (window.ARCHIVE || {}).chapters || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].title; return id; }

  AG.register("reliquary", {
    title: "The Reliquary",
    subtitle: "Trivia drawn entirely from the archive's own chapters.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch22) || "",
    sourceHref: "chapters/ch22.html", sourceLabel: "Read “Patristic Christianity”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var eras = (window.ARCHIVE || {}).eras || [];
    var st = {
      screen: "start", mode: "solo", curatedOnly: true, era: "", cat: "",
      order: [], i: 0, score: 0, botScore: 0, streak: 0, correct: 0,
      count: 10, chosen: null, current: null, best: AG.bestScore("reliquary")
    };
    var keyHandler = null;

    function pool() {
      return (bank || []).filter(function (q) {
        if (st.curatedOnly && !q.curated) return false;
        if (st.era && q.era !== st.era) return false;
        if (st.cat && q.cat !== st.cat) return false;
        return true;
      });
    }
    function cats() {
      var seen = {}, out = [];
      (bank || []).forEach(function (q) { if ((!st.era || q.era === st.era) && !seen[q.cat]) { seen[q.cat] = 1; out.push(q.cat); } });
      return out.sort();
    }

    function setKeys(fn) {
      if (keyHandler) document.removeEventListener("keydown", keyHandler);
      keyHandler = fn; if (fn) document.addEventListener("keydown", fn);
    }

    function render(html) { root.innerHTML = html; }

    /* ---------------- start screen ---------------- */
    function startScreen() {
      setKeys(null);
      var eraOpts = '<option value="">All eras</option>' +
        eras.map(function (e) { return '<option value="' + e.slug + '"' + (st.era === e.slug ? " selected" : "") + '>Era ' + e.num + " · " + esc(e.name) + "</option>"; }).join("") +
        '<option value="theme"' + (st.era === "theme" ? " selected" : "") + ">Comparative themes</option>";
      var catOpts = '<option value="">All traditions &amp; themes</option>' +
        cats().map(function (c) { return '<option value="' + esc(c) + '"' + (st.cat === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("");
      var avail = pool().length;
      render(
        '<div class="game-head"><p class="eyebrow">The Divine Archives · Games</p>' +
          '<h2 id="' + ctx.titleId + '">The Reliquary</h2>' +
          "<p>Questions drawn only from the chapters of this archive. Every answer opens its source.</p></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="rq-form">' +
          '<label>Set <select data-f="set"><option value="quick"' + (st.curatedOnly ? " selected" : "") + '>Quick (curated)</option><option value="full"' + (!st.curatedOnly ? " selected" : "") + ">Full bank</option></select></label>" +
          "<label>Era <select data-f=\"era\">" + eraOpts + "</select></label>" +
          "<label>Topic <select data-f=\"cat\">" + catOpts + "</select></label>" +
          '<label>Opponent <select data-f="mode"><option value="solo"' + (st.mode === "solo" ? " selected" : "") + '>Solo</option><option value="bot"' + (st.mode === "bot" ? " selected" : "") + ">Vs. the Archivist (AI)</option></select></label>" +
        "</div>" +
        '<p class="rq-avail">' + avail + " question" + (avail === 1 ? "" : "s") + " available" + (st.best ? " · your best: " + st.best : "") + "</p>" +
        '<div class="rq-actions"><button class="rq-btn rq-primary" data-a="start"' + (avail ? "" : " disabled") + " autofocus>Begin</button></div>" +
        (avail ? "" : '<p class="rq-note">No questions match this filter yet — widen it, or switch to the Full bank.</p>')
      );
      root.querySelectorAll("select[data-f]").forEach(function (sel) {
        sel.addEventListener("change", function () {
          var f = sel.getAttribute("data-f"), v = sel.value;
          if (f === "set") st.curatedOnly = (v === "quick");
          else if (f === "era") { st.era = v; st.cat = ""; }
          else if (f === "cat") st.cat = v;
          else if (f === "mode") st.mode = v;
          startScreen();
        });
      });
      var b = root.querySelector('[data-a="start"]');
      if (b) b.addEventListener("click", begin);
    }

    /* ---------------- play ---------------- */
    function begin() {
      var p = shuffle(pool());
      st.order = p.slice(0, Math.min(st.count, p.length));
      st.i = 0; st.score = 0; st.botScore = 0; st.streak = 0; st.correct = 0;
      question();
    }

    function question() {
      st.chosen = null;
      var q = st.order[st.i];
      st.current = q;
      var choices = q.choices.map(function (t, idx) { return { t: t, correct: idx === q.answer }; });
      st.shuffled = shuffle(choices);
      var progress = "Question " + (st.i + 1) + " of " + st.order.length;
      var scoreBar = '<div class="game-scorebar">' +
        '<div class="stat"><b>' + st.score + '</b><span>You</span></div>' +
        (st.mode === "bot" ? '<div class="stat"><b>' + st.botScore + '</b><span>Archivist</span></div>' : "") +
        '<div class="stat"><b>' + st.streak + '</b><span>Streak</span></div></div>';
      render(
        '<div class="game-head" style="margin-bottom:.5rem"><p class="eyebrow">The Reliquary · ' + esc(progress) + "</p>" +
          (q.cat ? '<div class="rq-seals"><span class="game-seal">' + esc(q.cat) + "</span></div>" : "") +
          '<h2 id="' + ctx.titleId + '" style="font-size:1.18rem;line-height:1.4">' + esc(q.q) + "</h2></div>" +
        '<div class="game-rule" role="presentation"></div>' +
        scoreBar +
        '<div class="rq-choices" role="group" aria-label="Answer choices">' +
          st.shuffled.map(function (c, n) {
            return '<button class="rq-choice" data-n="' + n + '"><span class="rq-key">' + (n + 1) + "</span><span>" + esc(c.t) + "</span></button>";
          }).join("") +
        "</div>" +
        '<p class="rq-feedback" aria-live="polite"></p>' +
        '<div class="rq-actions"><span class="rq-eyebrow">' + (st.mode === "bot" ? "You vs. the Archivist" : "Pick an answer — or press 1–4") + "</span></div>"
      );
      root.querySelectorAll(".rq-choice").forEach(function (btn) {
        btn.addEventListener("click", function () { choose(parseInt(btn.getAttribute("data-n"), 10)); });
      });
      setKeys(function (e) {
        if (st.chosen != null) { if (e.key === "Enter") { e.preventDefault(); next(); } return; }
        if (e.key >= "1" && e.key <= "4") { e.preventDefault(); var n = parseInt(e.key, 10) - 1; if (n < st.shuffled.length) choose(n); }
      });
      var first = root.querySelector(".rq-choice"); if (first) first.focus();
    }

    function choose(n) {
      if (st.chosen != null) return;
      st.chosen = n;
      var picked = st.shuffled[n];
      var right = picked.correct;
      // bot answers (tuned accuracy)
      var botRight = null;
      if (st.mode === "bot") { botRight = Math.random() < 0.68; if (botRight) st.botScore += 100; }
      if (right) { st.streak += 1; st.correct += 1; st.score += 100 + Math.min(st.streak, 6) * 20; }
      else { st.streak = 0; }
      var q = st.current;
      var btns = root.querySelectorAll(".rq-choice");
      btns.forEach(function (b, idx) {
        b.disabled = true;
        if (st.shuffled[idx].correct) b.classList.add("is-correct");
        else if (idx === n) b.classList.add("is-wrong");
      });
      var fb = root.querySelector(".rq-feedback");
      var srcHref = "chapters/" + q.chapter + ".html";
      fb.innerHTML =
        (right ? '<span class="rq-verdict ok">✓ Correct</span>' : '<span class="rq-verdict no">✗ Not quite</span>') +
        (st.mode === "bot" ? ' <span class="rq-bot">The Archivist ' + (botRight ? "also got it" : "missed it") + ".</span>" : "") +
        ' <a class="game-source" href="' + srcHref + '">› Read “' + esc(chapterTitle(q.chapter)) + "”</a>";
      var act = root.querySelector(".rq-actions");
      act.innerHTML = '<button class="rq-btn rq-primary" data-a="next" autofocus>' + (st.i + 1 < st.order.length ? "Next →" : "See results") + "</button>";
      act.querySelector('[data-a="next"]').addEventListener("click", next);
      act.querySelector('[data-a="next"]').focus();
    }

    function next() {
      st.i += 1;
      if (st.i < st.order.length) question();
      else results();
    }

    /* ---------------- results ---------------- */
    function results() {
      setKeys(null);
      var newBest = false;
      if (st.score > st.best) { st.best = st.score; newBest = true; }
      AG.addHighScore("reliquary", { score: st.score, correct: st.correct, total: st.order.length, mode: st.mode });
      var wonLine = "";
      if (st.mode === "bot") {
        wonLine = st.score > st.botScore ? "You beat the Archivist." : (st.score < st.botScore ? "The Archivist won this round." : "A dead heat with the Archivist.");
      }
      render(
        '<div class="game-head"><p class="eyebrow">The Reliquary · Results</p>' +
          '<h2 id="' + ctx.titleId + '">' + st.correct + " / " + st.order.length + " correct</h2>" +
          (wonLine ? "<p>" + esc(wonLine) + "</p>" : "") + "</div>" +
        '<div class="game-scorebar">' +
          '<div class="stat"><b>' + st.score + '</b><span>Score</span></div>' +
          (st.mode === "bot" ? '<div class="stat"><b>' + st.botScore + '</b><span>Archivist</span></div>' : "") +
          '<div class="stat"><b>' + st.best + '</b><span>Your best</span></div></div>' +
        (newBest ? '<p class="rq-note" style="color:var(--gold-bright);text-align:center">✵ A new personal best.</p>' : "") +
        '<div class="rq-actions" style="gap:.6rem">' +
          '<button class="rq-btn rq-primary" data-a="again" autofocus>Play again</button>' +
          '<button class="rq-btn" data-a="menu">Change filters</button>' +
        "</div>" +
        '<p class="rq-note" style="text-align:center">Every question here is drawn from a real chapter of the archive.</p>'
      );
      root.querySelector('[data-a="again"]').addEventListener("click", begin);
      root.querySelector('[data-a="menu"]').addEventListener("click", startScreen);
    }

    /* ---------------- boot ---------------- */
    render('<div class="rq-loading">Opening the reliquary…</div>');
    loadBank().then(function () { startScreen(); }).catch(function () {
      render('<p class="game-placeholder">The question bank could not be loaded. Please reload the page.</p>');
    });

    // cleanup when the overlay closes
    return function () { setKeys(null); };
  }
})();
