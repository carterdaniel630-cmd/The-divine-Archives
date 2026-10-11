/* ==========================================================================
   The archive framework — ritual walkthrough player (Phase 2)

   Shows a ritual file (data/rituals/<slug>.json, published to
   docs/assets/framework/rituals/ by tools/build-framework.js) one step at a time,
   driven by the neutral sequence engine. It is opt-in, guided and explanatory:
   nothing is scored, timed against the visitor, won or lost, and the visitor can
   leave at any moment. It records only "started" and "completed" in the ledger.

   Use: RitualPlayer.open(container, ritual, { chapterBase: "chapters/", onClose })
   Needs window.SequenceEngine (docs/assets/framework/sequence-engine.js).
   ========================================================================== */

(function (root) {
  "use strict";

  var CSS = ".rp{display:flex;flex-direction:column;gap:.7rem}" +
    ".rp-step{font-size:1.02rem;line-height:1.55;min-height:4.5em}" +
    ".rp-count{font-size:.8rem;opacity:.75;letter-spacing:.04em;text-transform:uppercase}" +
    ".rp-bar{height:4px;border-radius:2px;background:rgba(127,127,127,.25);overflow:hidden}" +
    ".rp-bar>i{display:block;height:100%;width:0;background:currentColor;opacity:.6}" +
    ".rp-bar.run>i{transition-property:width;transition-timing-function:linear}" +
    ".rp-src{font-size:.8rem;opacity:.85;margin:0}" +
    ".rp-src a{color:inherit;text-decoration:underline;text-underline-offset:2px}" +
    ".rp-hold{touch-action:none;user-select:none;-webkit-user-select:none}" +
    ".rp-hold[aria-pressed=true]{outline:2px solid currentColor;outline-offset:2px}" +
    ".rp-note{font-size:.85rem;opacity:.85;margin:0}";

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function emit(entity, verb) {
    var d = { entity: entity, verb: verb };
    if (root.__archiveTrack) root.__archiveTrack.record(d);
    else (root.__archiveQ = root.__archiveQ || []).push(d);
  }
  function reduced() { try { return root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }

  function open(container, ritual, opts) {
    opts = opts || {};
    if (!root.SequenceEngine) throw new Error("RitualPlayer needs SequenceEngine");
    if (!document.getElementById("rp-css")) { var st = document.createElement("style"); st.id = "rp-css"; st.textContent = CSS; document.head.appendChild(st); }
    var chapterBase = opts.chapterBase || "chapters/";
    var byOrder = {};
    ritual.steps.forEach(function (s) { byOrder[s.sequence_order] = s; });
    var srcById = {};
    ritual.sources.forEach(function (s) { srcById[s.id] = s; });
    var pending = !ritual.review || ritual.review.status !== "cleared";
    var engine = null, closed = false, uiTimer = null;

    function anchorHref(a) { var m = /^section:(ch\d+)\/([a-z0-9-]+)$/.exec(a || ""); return m ? chapterBase + m[1] + ".html#" + m[2] : null; }
    function head() {
      return '<p class="mu-cat">A guided walkthrough · opt-in</p><h2 id="mu-card-h">' + esc(ritual.title) + "</h2>" +
        (pending ? '<span class="mu-flag soft">Recently added · pending full review</span>' : "");
    }
    function sourcesLine(ids) {
      return '<p class="rp-src">Source: ' + ids.map(function (id) { var s = srcById[id]; return s ? '<a href="' + esc(s.url) + '" rel="noopener" target="_blank">' + esc(s.cite) + "</a>" : ""; }).join("; ") + "</p>";
    }

    function intro() {
      container.innerHTML = '<div class="rp">' + head() +
        "<p>" + esc(ritual.intro) + "</p>" +
        '<p class="rp-note">' + esc(ritual.tradition) + ". This explains a practice; it is not an act of worship made for you, and nothing is scored. You can leave at any point.</p>" +
        '<div class="mu-actions"><button type="button" data-rp="start">Begin the walkthrough</button><button type="button" class="ghost" data-rp="leave">Not now</button></div></div>';
      bind();
      var b = container.querySelector('[data-rp="start"]'); if (b) b.focus();
    }

    function bind() {
      Array.prototype.forEach.call(container.querySelectorAll("[data-rp]"), function (el) {
        var a = el.getAttribute("data-rp");
        if (a === "start") el.addEventListener("click", start);
        else if (a === "leave") el.addEventListener("click", leave);
        else if (a === "tap") el.addEventListener("click", function () { if (engine) engine.tap(); });
        else if (a === "hold") bindHold(el);
      });
    }

    function bindHold(el) {
      var down = function (e) { if (e.type === "keydown" && e.key !== " " && e.key !== "Enter") return; if (e.repeat) return; e.preventDefault(); if (engine && engine.holdStart()) { el.setAttribute("aria-pressed", "true"); fill(engine.state().step.pacing_duration_ms); } };
      var up = function (e) { if (e.type === "keyup" && e.key !== " " && e.key !== "Enter") return; el.setAttribute("aria-pressed", "false"); if (engine) engine.holdEnd(); };
      el.addEventListener("pointerdown", down); el.addEventListener("keydown", down);
      el.addEventListener("pointerup", up); el.addEventListener("pointerleave", up); el.addEventListener("pointercancel", up); el.addEventListener("keyup", up);
    }

    function fill(ms) {
      var bar = container.querySelector(".rp-bar"); if (!bar) return;
      var i = bar.firstChild;
      if (reduced()) { i.style.width = "100%"; return; }
      bar.classList.remove("run"); i.style.width = "0"; void i.offsetWidth;
      bar.classList.add("run"); i.style.transitionDuration = ms + "ms"; i.style.width = "100%";
    }
    function unfill() { var bar = container.querySelector(".rp-bar"); if (bar) { bar.classList.remove("run"); bar.firstChild.style.width = "0"; } }

    function showStep(index, s) {
      var data = byOrder[s.sequence_order];
      var href = anchorHref(s.historical_text_anchor_id);
      var control = "";
      var secs = Math.round(s.pacing_duration_ms / 1000);
      if (s.input_trigger_type === "tap") control = '<button type="button" data-rp="tap" disabled>Continue</button>';
      else if (s.input_trigger_type === "hold") control = '<button type="button" class="rp-hold" data-rp="hold" aria-pressed="false">Press and hold to continue (' + secs + " s)</button>";
      else control = '<span class="rp-note">Moves on by itself' + (reduced() ? " in about " + secs + " seconds" : "") + ".</span>";
      container.innerHTML = '<div class="rp">' + head() +
        '<p class="rp-count">Step ' + (index + 1) + " of " + ritual.steps.length + "</p>" +
        '<p class="rp-step" aria-live="polite">' + esc(data.text) + "</p>" +
        '<div class="rp-bar" aria-hidden="true"><i></i></div>' +
        sourcesLine(s.source_ids) +
        (href ? '<p class="rp-src"><a href="' + esc(href) + '">Read the chapter section this step draws on</a></p>' : '<p class="rp-src">No chapter covers this step yet.</p>') +
        '<div class="mu-actions">' + control + '<button type="button" class="ghost" data-rp="leave">Leave</button></div></div>';
      bind();
      if (s.input_trigger_type === "auto") { fill(s.pacing_duration_ms); var lv = container.querySelector('[data-rp="leave"]'); if (lv) lv.focus({ preventScroll: true }); }
      else if (s.input_trigger_type === "tap") {
        fill(s.pacing_duration_ms);
        clearTimeout(uiTimer);
        uiTimer = setTimeout(function () { var b = container.querySelector('[data-rp="tap"]'); if (b) { b.disabled = false; b.focus(); } }, s.pacing_duration_ms);
      } else { var h = container.querySelector('[data-rp="hold"]'); if (h) h.focus(); }
    }

    function end() {
      emit(ritual.id, "completed");
      var ch = ritual.chapter ? ritual.chapter.replace(/^chapter:/, "") : null;
      container.innerHTML = '<div class="rp">' + head() +
        "<p>That is the end of the walkthrough.</p>" +
        '<p class="rp-note">It followed the text step by step; the timings are a display choice, not part of the practice.</p>' +
        '<div class="mu-actions">' + (ch ? '<a href="' + esc(chapterBase + ch + ".html") + '">Read the chapter</a>' : "") + '<button type="button" class="ghost" data-rp="leave">Close</button></div></div>';
      bind();
    }

    function start() {
      emit(ritual.id, "started");
      engine = root.SequenceEngine.create({
        steps: ritual.steps,
        on: function (e) {
          if (closed) return;
          if (e.type === "step") showStep(e.index, e.step);
          else if (e.type === "hold") { unfill(); var h = container.querySelector('[data-rp="hold"]'); if (h) h.setAttribute("aria-pressed", "false"); }
          else if (e.type === "end") end();
        }
      });
      engine.start();
    }

    function onVis() { if (!engine) return; if (document.hidden) engine.pause(); else engine.resume(); }
    document.addEventListener("visibilitychange", onVis);

    function leave() { close(); if (opts.onClose) opts.onClose(); }
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(uiTimer);
      if (engine) engine.stop();
      document.removeEventListener("visibilitychange", onVis);
    }

    intro();
    return { close: close };
  }

  root.RitualPlayer = { open: open };
})(typeof self !== "undefined" ? self : this);
