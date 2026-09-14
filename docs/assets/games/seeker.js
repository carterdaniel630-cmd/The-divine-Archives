/* ==========================================================================
   THE DIVINE ARCHIVES — Mini-Games: "The Seeker's Path" (riddle chain)

   A gatekeeper sets a chain of riddles; each answer is a word or name found by
   actually reading the chapter it points to. Solve one to unlock the next.
   Answers and their source chapters live in docs/assets/games/data/seeker.json
   — every answer is verified to appear in its chapter (tools/verify-seeker.js).
   Progress is remembered in localStorage. Hidden inside the ch40 sigil.
   ========================================================================== */
(function () {
  "use strict";
  var AG = window.ArchiveGames;
  if (!AG) return;
  var DATA_URL = (function () { var s = document.currentScript; return (s && s.src ? s.src.replace(/[^/]*$/, "") : "assets/games/") + "data/seeker.json"; })();
  var DATA = null, loadingP = null;
  function loadData() { if (DATA) return Promise.resolve(DATA); if (loadingP) return loadingP; loadingP = fetch(DATA_URL).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { DATA = j; return j; }); return loadingP; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function chapterTitle(id) { var a = (window.ARCHIVE || {}).chapters || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].title; return id; }
  var KEY = "da.games.seeker";
  function load() { try { return parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch (e) { return 0; } }
  function save(n) { try { localStorage.setItem(KEY, String(n)); } catch (e) { } }

  AG.register("seeker", {
    title: "The Seeker's Path",
    subtitle: "The gatekeeper opens the way — follow the clues into the chapters.",
    symbolSVG: (window.PLATE_ART && window.PLATE_ART.ch40) || "",
    sourceHref: "chapters/ch40.html", sourceLabel: "Read “Modern Movements”",
    mount: mountGame
  });

  function mountGame(root, ctx) {
    var clues, cur, attempts = 0;

    function path() {
      var dots = clues.map(function (cl, i) {
        var cls = i < cur ? "done" : i === cur ? "here" : "";
        return '<span class="sk-dot ' + cls + '" title="Clue ' + (i + 1) + '"></span>';
      }).join('<span class="sk-link"></span>');
      return '<div class="sk-path" role="img" aria-label="Progress: ' + cur + ' of ' + clues.length + ' clues solved">' + dots + "</div>";
    }

    function intro() {
      cur = Math.min(load(), clues.length);
      root.innerHTML =
        head("The Seeker's Path") +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="game-symbol-large" aria-hidden="true">' + ((window.PLATE_ART && window.PLATE_ART.ch40) || "") + "</div>" +
        '<p class="sk-intro game-versal">Ten riddles bar the way, and no riddle answers itself. Each names a thing hidden in the archive; to pass, you must go and read. The chapter is always given — the answer waits inside it.</p>' +
        (cur > 0 && cur < clues.length ? '<p class="rq-note">You have opened ' + cur + ' of ' + clues.length + " gates.</p>" : "") +
        '<div class="rq-actions" style="gap:.5rem">' +
          '<button class="rq-btn rq-primary" data-a="go" autofocus>' + (cur >= clues.length ? "Walk it again" : cur > 0 ? "Resume the path" : "Begin the path") + "</button>" +
          (cur > 0 ? '<button class="rq-btn" data-a="reset">Start over</button>' : "") +
        "</div>";
      root.querySelector('[data-a="go"]').addEventListener("click", function () { if (cur >= clues.length) { cur = 0; save(0); } stage(); });
      var rs = root.querySelector('[data-a="reset"]'); if (rs) rs.addEventListener("click", function () { cur = 0; save(0); intro(); });
    }

    function stage() {
      if (cur >= clues.length) return finish();
      attempts = 0;
      var cl = clues[cur];
      root.innerHTML =
        head("The Seeker's Path") +
        path() +
        '<p class="sk-count">Gate ' + (cur + 1) + " of " + clues.length + "</p>" +
        '<div class="sk-clue"><p class="sk-riddle game-versal">' + esc(cl.prompt) + "</p>" +
          '<p class="sk-where">The answer lies in <a class="game-source" href="chapters/' + cl.chapter + '.html" target="_blank" rel="noopener">› Read “' + esc(chapterTitle(cl.chapter)) + "”</a></p></div>" +
        '<form class="sk-form" autocomplete="off"><label class="sr-only" for="sk-input">Your answer</label>' +
          '<input id="sk-input" class="sk-input" type="text" placeholder="Name it…" aria-describedby="sk-feedback" />' +
          '<button class="rq-btn rq-primary" type="submit">Answer</button></form>' +
        '<p class="sk-feedback" id="sk-feedback" aria-live="polite"></p>' +
        '<div class="rq-actions"><button class="rq-btn" data-a="hint">Reveal a hint</button>' +
          '<button class="rq-btn" data-a="back">Leave the path</button></div>';
      var form = root.querySelector(".sk-form"), input = root.querySelector(".sk-input"), fb = root.querySelector(".sk-feedback");
      input.focus();
      form.addEventListener("submit", function (e) { e.preventDefault(); check(cl, input, fb); });
      root.querySelector('[data-a="hint"]').addEventListener("click", function () { fb.className = "sk-feedback"; fb.innerHTML = '<span class="sk-hint">Hint — ' + esc(cl.hint) + "</span>"; });
      root.querySelector('[data-a="back"]').addEventListener("click", intro);
    }

    function check(cl, input, fb) {
      var g = norm(input.value);
      if (!g) return;
      var hit = cl.answers.some(function (a) { a = norm(a); return g === a || g.indexOf(a) >= 0; });
      if (hit) {
        cur += 1; save(cur);
        fb.className = "sk-feedback ok"; fb.textContent = "The gate opens.";
        var stage2 = root.querySelector(".sk-clue"); if (stage2) stage2.classList.add("sk-open");
        setTimeout(function () { if (cur >= clues.length) finish(); else stage(); }, 750);
      } else {
        attempts += 1;
        fb.className = "sk-feedback no"; fb.textContent = attempts >= 2 ? "Not yet — read the chapter closely; the word is there." : "Not the word the gate wants. Seek it in the chapter.";
        var el = root.querySelector(".sk-clue"); if (el) { el.classList.remove("sk-shake"); void el.offsetWidth; el.classList.add("sk-shake"); }
        input.select();
      }
    }

    function finish() {
      save(clues.length);
      root.innerHTML =
        head("The Path is Walked") +
        '<div class="game-rule" role="presentation"></div>' +
        '<div class="game-symbol-large" aria-hidden="true">' + ((window.PLATE_ART && window.PLATE_ART.ch37) || (window.PLATE_ART && window.PLATE_ART.ch40) || "") + "</div>" +
        '<p class="sk-intro game-versal">Every gate is open. You have read your way across the archive — from Osiris in the Bronze Age to the ouroboros that closes the circle — and each answer was earned in the pages themselves.</p>' +
        '<div class="rq-actions" style="gap:.5rem"><button class="rq-btn rq-primary" data-a="again" autofocus>Walk it again</button>' +
          '<a class="rq-btn" href="methodology.html">The methodology</a>' +
          '<a class="game-source" href="traditions.html">› Browse every tradition</a></div>';
      root.querySelector('[data-a="again"]').addEventListener("click", function () { cur = 0; save(0); stage(); });
    }

    function head(title) {
      return '<div class="game-head" style="margin-bottom:.35rem"><p class="eyebrow">The Divine Archives · Games</p>' +
        '<h2 id="' + ctx.titleId + '" style="font-size:1.3rem">' + esc(title) + "</h2>" +
        "<p>Riddles that can only be answered by reading the chapters they point to.</p></div>";
    }

    root.innerHTML = '<div class="rq-loading">The gatekeeper stirs…</div>';
    loadData().then(function (j) { clues = j.clues || []; intro(); }).catch(function () { root.innerHTML = '<p class="game-placeholder">The path could not be loaded. Please reload.</p>'; });

    return function cleanup() { };
  }
})();
