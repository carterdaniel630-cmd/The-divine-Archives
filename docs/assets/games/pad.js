/* ==========================================================================
   THE DIVINE ARCHIVES — ArchivePad: a console-style controller for the games

   One module gives the action games three ways to play:
     1. an on-screen controller for touch (and mouse), laid out like a real
        console pad: an 8-way D-pad you can roll your thumb around, face
        buttons you can slide between, shoulder buttons, Select and Start;
     2. a physical game controller through the browser's Gamepad API
        (standard mapping: A/B/X/Y, bumpers, triggers, D-pad, left stick);
     3. the keyboard, which each game still reads itself; on a computer the
        pad shows a one-line key legend and lights up as keys are pressed.

   Layouts:
     "two"  — D-pad, two face buttons (B left, A right), Select, Start:
              the classic two-button console layout, for platformers.
     "four" — D-pad, four face buttons in a diamond (Y top, X left, B right,
              A bottom), two shoulder buttons, Start: the modern fighting pad.

   ArchivePad.create(opts) -> pad
     opts.layout      "two" | "four"
     opts.buttons     { id: { cap: "Jump", key: "Space" } } for a b x y l r select start
     opts.dpadKeys    key hint shown on the D-pad ("WASD / arrows")
     opts.onDown(id), opts.onUp(id)   edge callbacks (ids: up down left right a b x y l r select start)
     opts.gamepadIndex which connected controller drives this pad (default 0)
     opts.ui          false: no on-screen controller (a second player's gamepad only)
   pad.el, pad.held, pad.poll() (call once per frame), pad.lit(id, on), pad.rumble(ms, strength), pad.destroy()
   ========================================================================== */
(function () {
  "use strict";

  var IDS = ["up", "down", "left", "right", "a", "b", "x", "y", "l", "r", "select", "start"];
  // standard-mapping button index for each id (Gamepad API)
  var GP = { a: [0], b: [1], x: [2], y: [3], l: [4, 6], r: [5, 7], select: [8], start: [9], up: [12], down: [13], left: [14], right: [15] };
  var GLYPH = { a: "A", b: "B", x: "X", y: "Y", l: "L", r: "R", select: "SELECT", start: "START" };

  function create(opts) {
    opts = opts || {};
    var layout = opts.layout === "four" ? "four" : "two";
    var btns = opts.buttons || {};
    var held = {}, touchHeld = {}, gpHeld = {}, keyLit = {};
    IDS.forEach(function (id) { held[id] = false; touchHeld[id] = false; gpHeld[id] = false; keyLit[id] = false; });
    var gpIndex = opts.gamepadIndex || 0, gpSeen = false, dead = false;
    var el = null, faceEls = {}, dpadEl = null, armEls = {};

    function emit(id, on) {
      if (held[id] === on) return;
      held[id] = on;
      if (on && opts.onDown) opts.onDown(id);
      if (!on && opts.onUp) opts.onUp(id);
      paint(id);
    }
    function sync(id) { emit(id, !!(touchHeld[id] || gpHeld[id])); }
    function paint(id) {
      if (!el) return;
      var on = held[id] || keyLit[id];
      if (armEls[id]) armEls[id].classList.toggle("on", on);
      if (faceEls[id]) faceEls[id].classList.toggle("on", on);
    }

    /* ---------------- on-screen controller ---------------- */
    function faceBtn(id) {
      var b = btns[id]; if (!b) return "";
      return '<span class="ap-btn ap-' + id + '" data-b="' + id + '" role="button" aria-label="' + (b.cap || GLYPH[id]) + '">' +
        '<span class="ap-g">' + GLYPH[id] + "</span>" +
        (b.cap ? '<span class="ap-cap">' + b.cap + "</span>" : "") + "</span>";
    }
    // the keyboard equivalents, as one legend line (shown only where there is a keyboard and mouse)
    function legend() {
      var parts = [];
      if (opts.dpadKeys) parts.push("<b>Move</b> " + opts.dpadKeys);
      ["a", "b", "x", "y", "l", "r", "select", "start"].forEach(function (id) { var b = btns[id]; if (b && b.key) parts.push("<b>" + (b.cap || GLYPH[id]) + "</b> " + b.key); });
      return parts.length ? '<p class="ap-legend">' + parts.join('<span aria-hidden="true"> · </span>') + "</p>" : "";
    }
    function build() {
      el = document.createElement("div");
      el.className = "ap-pad ap-" + layout;
      el.setAttribute("role", "group");
      el.setAttribute("aria-label", "On-screen controller");
      el.innerHTML =
        (layout === "four" && (btns.l || btns.r) ? '<div class="ap-shoulders">' + faceBtn("l") + faceBtn("r") + "</div>" : "") +
        '<div class="ap-body">' +
          '<div class="ap-dwell"><div class="ap-dpad" aria-label="Direction pad">' +
            '<span class="ap-arm ap-up" data-d="up"></span><span class="ap-arm ap-left" data-d="left"></span>' +
            '<span class="ap-arm ap-right" data-d="right"></span><span class="ap-arm ap-down" data-d="down"></span>' +
            '<span class="ap-hub"></span></div></div>' +
          '<div class="ap-mid">' + faceBtn("select") + faceBtn("start") + "</div>" +
          '<div class="ap-face">' + (layout === "four" ? faceBtn("y") + faceBtn("x") + faceBtn("b") + faceBtn("a") : faceBtn("b") + faceBtn("a")) + "</div>" +
        "</div>" + legend() +
        '<p class="ap-status" aria-live="polite"></p>';
      dpadEl = el.querySelector(".ap-dpad");
      el.querySelectorAll(".ap-arm").forEach(function (a) { armEls[a.getAttribute("data-d")] = a; });
      el.querySelectorAll(".ap-btn").forEach(function (b) { faceEls[b.getAttribute("data-b")] = b; });
      bindDpad(); bindFace(el.querySelector(".ap-face")); bindSingles();
      el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    }
    function buzz() { if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) { /* not allowed */ } } }

    // D-pad: the direction comes from the angle of the thumb from the hub, so a
    // rolling thumb reaches the diagonals the way a real cross-pad does
    function bindDpad() {
      var ptr = null;
      function dirs(e) {
        var r = dpadEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), out = { up: false, down: false, left: false, right: false };
        if (d < r.width * 0.12) return out;
        var a = Math.atan2(dy, dx) * 180 / Math.PI;           // 0 = right, 90 = down
        out.right = Math.abs(a) < 67.5; out.left = Math.abs(a) > 112.5;
        out.down = a > 22.5 && a < 157.5; out.up = a < -22.5 && a > -157.5;
        return out;
      }
      function apply(o) { ["up", "down", "left", "right"].forEach(function (k) { if (touchHeld[k] !== o[k]) { touchHeld[k] = o[k]; sync(k); } }); }
      dpadEl.addEventListener("pointerdown", function (e) { e.preventDefault(); ptr = e.pointerId; try { dpadEl.setPointerCapture(ptr); } catch (x) { /* ok */ } buzz(); apply(dirs(e)); });
      dpadEl.addEventListener("pointermove", function (e) { if (e.pointerId === ptr) apply(dirs(e)); });
      var end = function (e) { if (e.pointerId !== ptr) return; ptr = null; apply({ up: false, down: false, left: false, right: false }); };
      dpadEl.addEventListener("pointerup", end); dpadEl.addEventListener("pointercancel", end); dpadEl.addEventListener("lostpointercapture", end);
    }
    // face buttons: each finger is on whichever button is nearest, so a thumb can
    // slide from one button to the next without lifting (and two fingers can chord)
    function bindFace(zone) {
      var fingers = {};
      function nearest(e) {
        var best = null, bd = 1e9;
        zone.querySelectorAll(".ap-btn").forEach(function (b) {
          var r = b.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          if (d < bd && d < r.width * 1.05) { bd = d; best = b.getAttribute("data-b"); }
        });
        return best;
      }
      function recount() {
        var on = {}; Object.keys(fingers).forEach(function (p) { if (fingers[p]) on[fingers[p]] = true; });
        ["a", "b", "x", "y"].forEach(function (id) { var v = !!on[id]; if (touchHeld[id] !== v) { touchHeld[id] = v; sync(id); } });
      }
      zone.addEventListener("pointerdown", function (e) { e.preventDefault(); try { zone.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } fingers[e.pointerId] = nearest(e); buzz(); recount(); });
      zone.addEventListener("pointermove", function (e) { if (!(e.pointerId in fingers)) return; var n = nearest(e); if (n !== fingers[e.pointerId]) { fingers[e.pointerId] = n; if (n) buzz(); recount(); } });
      var end = function (e) { if (!(e.pointerId in fingers)) return; delete fingers[e.pointerId]; recount(); };
      zone.addEventListener("pointerup", end); zone.addEventListener("pointercancel", end); zone.addEventListener("lostpointercapture", end);
    }
    function bindSingles() {
      ["l", "r", "select", "start"].forEach(function (id) {
        var b = faceEls[id]; if (!b) return;
        var ptr = null;
        b.addEventListener("pointerdown", function (e) { e.preventDefault(); ptr = e.pointerId; try { b.setPointerCapture(ptr); } catch (x) { /* ok */ } buzz(); touchHeld[id] = true; sync(id); });
        var end = function (e) { if (e.pointerId !== ptr) return; ptr = null; touchHeld[id] = false; sync(id); };
        b.addEventListener("pointerup", end); b.addEventListener("pointercancel", end); b.addEventListener("lostpointercapture", end);
      });
    }

    /* ---------------- physical controller ---------------- */
    function pads() { try { return navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { return []; } }
    function poll() {
      if (dead) return held;
      var list = pads(), g = null, n = -1;
      for (var i = 0; i < list.length; i++) { if (list[i] && list[i].connected) { n++; if (n === gpIndex) { g = list[i]; break; } } }
      if (!g) {
        if (gpSeen) { gpSeen = false; status(""); IDS.forEach(function (id) { if (gpHeld[id]) { gpHeld[id] = false; sync(id); } }); }
        return held;
      }
      if (!gpSeen) { gpSeen = true; status("Controller connected"); if (el) el.classList.add("ap-has-gp"); }
      var ax = g.axes[0] || 0, ay = g.axes[1] || 0, DZ = 0.45;
      IDS.forEach(function (id) {
        var v = GP[id].some(function (k) { var b = g.buttons[k]; return b && (b.pressed || b.value > 0.5); });
        if (id === "left") v = v || ax < -DZ; if (id === "right") v = v || ax > DZ;
        if (id === "up") v = v || ay < -DZ; if (id === "down") v = v || ay > DZ;
        if (gpHeld[id] !== v) { gpHeld[id] = v; sync(id); }
      });
      return held;
    }
    var statusT = null;
    function status(msg) {
      if (!el) return; var s = el.querySelector(".ap-status"); if (!s) return;
      s.textContent = msg; if (statusT) clearTimeout(statusT);
      if (msg) statusT = setTimeout(function () { s.textContent = ""; }, 2600);
    }
    function onConnect() { poll(); }

    function rumble(ms, strength) {
      var list = pads(), n = -1;
      for (var i = 0; i < list.length; i++) {
        var g = list[i]; if (!g || !g.connected) continue; n++;
        if (n !== gpIndex) continue;
        var act = g.vibrationActuator;
        if (act && act.playEffect) { try { act.playEffect("dual-rumble", { duration: ms, strongMagnitude: strength || 0.6, weakMagnitude: (strength || 0.6) * 0.6 }); } catch (e) { /* unsupported */ } }
        return;
      }
      if (!gpSeen && navigator.vibrate && strength > 0.5) { try { navigator.vibrate(Math.min(60, ms)); } catch (e) { /* not allowed */ } }
    }

    if (opts.ui !== false) build();
    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onConnect);

    return {
      el: el,
      held: held,
      poll: poll,
      // light a button while its keyboard key is down (the pad doubles as the key map)
      lit: function (id, on) { if (keyLit[id] === on) return; keyLit[id] = on; paint(id); },
      rumble: rumble,
      release: function () { IDS.forEach(function (id) { touchHeld[id] = false; gpHeld[id] = false; keyLit[id] = false; sync(id); paint(id); }); },
      destroy: function () {
        dead = true;
        window.removeEventListener("gamepadconnected", onConnect);
        window.removeEventListener("gamepaddisconnected", onConnect);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
    };
  }

  // For games that read the keyboard only: a physical controller "types" the game's own
  // keys. map: { up: "ArrowUp", a: " ", start: "p", ... } -> returns stop()
  function bridge(map) {
    var raf = 0, stopped = false;
    function send(type, key) {
      if (!key) return;
      var ev; try { ev = new KeyboardEvent(type, { key: key, bubbles: true, cancelable: true }); } catch (e) { return; }
      (document.activeElement || document).dispatchEvent(ev);
    }
    var pad = create({ ui: false, onDown: function (id) { send("keydown", map[id]); }, onUp: function (id) { send("keyup", map[id]); } });
    (function loop() { if (stopped) return; pad.poll(); raf = requestAnimationFrame(loop); })();
    return function stop() { stopped = true; cancelAnimationFrame(raf); pad.release(); pad.destroy(); };
  }

  window.ArchivePad = { create: create, bridge: bridge };
})();
