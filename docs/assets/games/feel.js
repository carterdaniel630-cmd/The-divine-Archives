/* ==========================================================================
   THE DIVINE ARCHIVES — game feel ("hit-feel") for the arcade games

   One small shared kit so a hit in any game reads the same way: a short
   freeze on the moment of impact (hit-stop), a screen shake, a soft flash,
   a synthesized sound and, on phones that allow it, a short buzz. Carter's
   ruling (Item 31 #5): hit-feel on the other games now.

   Respecting the phone (Item 31 #6, "do NOT override reduced motion"): when
   the visitor's device asks for reduced motion, there is no shake, no
   pop/bounce and only a faint flash. Sound follows the games' existing sound
   setting (localStorage "da.games.sfx" = "off" silences it, the same key The
   Unfinished Journal uses). Flashes are capped well below full brightness and
   never repeat faster than the hits themselves.

     var feel = ArchiveFeel.create();
     feel.hit("bumper", { pitch: 1.2 });   // on an impact
     if (feel.tick(dt)) { ...frozen: skip the physics step, still draw... }
     feel.begin(cx); ...draw the moving scene...; feel.end(cx, W, H);
     feel.reduced                         // true when reduced motion is asked
     feel.active                          // true while a shake/flash/freeze is showing
   ========================================================================== */
(function () {
  "use strict";

  var mq = null;
  try { mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null; } catch (e) { mq = null; }
  function reduced() { return !!(mq && mq.matches); }

  /* ---------------- sound: synthesized in WebAudio, no files ---------------- */
  var ac = null, master = null, nbuf = null, unlocked = false;
  function soundOn() { try { return localStorage.getItem("da.games.sfx") !== "off"; } catch (e) { return true; } }
  function ensure() {
    if (!soundOn()) return false;
    try {
      if (!ac) {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        ac = new AC(); master = ac.createGain(); master.gain.value = 0.28; master.connect(ac.destination);
        nbuf = ac.createBuffer(1, ac.sampleRate >> 2, ac.sampleRate);
        var d = nbuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === "suspended") ac.resume();
    } catch (e) { return false; }
    return true;
  }
  // phones only start audio inside a tap: open (or resume) it on every tap, so turning
  // sound back on mid-visit works without a reload (iPhones also suspend it when idle)
  function unlock() {
    unlocked = true;
    if (!ac || ac.state === "suspended") ensure();
  }
  ["pointerdown", "touchstart", "keydown"].forEach(function (t) { document.addEventListener(t, unlock, true); });

  function env(g, t0, a, peak, dur) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); }
  function tone(f, dur, type, vol, f2, delay) {
    var t0 = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    env(g, t0, 0.004, vol, dur); o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise(dur, vol, f, q, delay) {
    var t0 = ac.currentTime + (delay || 0), n = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain();
    n.buffer = nbuf; fl.type = "bandpass"; fl.frequency.value = f; fl.Q.value = q || 1;
    env(g, t0, 0.002, vol, dur); n.connect(fl); fl.connect(g); g.connect(master); n.start(t0); n.stop(t0 + dur + 0.05);
  }
  var VOICES = {
    // a struck bell: the bumpers of the Firmament
    bumper: function (p) { tone(620 * p, 0.32, "sine", 0.22); tone(1550 * p, 0.16, "triangle", 0.06); noise(0.03, 0.12, 3200, 2); },
    // a hard snap: slingshots
    sling: function (p) { noise(0.05, 0.22, 1800 * p, 1.4); tone(240 * p, 0.07, "square", 0.05, 120 * p); },
    // a wooden thunk: flippers and paddles
    thunk: function (p) { tone(150 * p, 0.09, "sine", 0.3, 70 * p); noise(0.025, 0.16, 900 * p, 1.2); },
    paddle: function (p) { tone(330 * p, 0.12, "triangle", 0.2, 220 * p); noise(0.03, 0.14, 2400 * p, 1.5); },
    // a soft tick: glancing off a wall
    tick: function (p) { noise(0.02, 0.08, 2600 * p, 2); },
    // two rising notes: a light lit, a point won
    chime: function (p) { tone(660 * p, 0.22, "sine", 0.16); tone(990 * p, 0.32, "sine", 0.14, null, 0.09); },
    // a soft swallow: the serpent takes a symbol
    gulp: function (p) { tone(260 * p, 0.14, "sine", 0.2, 520 * p); noise(0.03, 0.06, 1400 * p, 1.4); },
    // a tiny clink: an offering gathered (quiet: it fires on almost every step)
    coin: function (p) { tone(1320 * p, 0.05, "triangle", 0.035); },
    // clay settling: a block lands
    thud: function (p) { tone(110 * p, 0.1, "sine", 0.24, 60 * p); noise(0.04, 0.1, 500 * p, 1); },
    // a course laid: a low knock under a rising note
    course: function (p) { noise(0.12, 0.14, 700 * p, 0.9); tone(392 * p, 0.2, "triangle", 0.12, null, 0.03); tone(587 * p, 0.3, "sine", 0.12, null, 0.11); },
    // a piece set down on wood: a chess move, an army placed
    place: function (p) { tone(210 * p, 0.06, "sine", 0.16, 150 * p); noise(0.018, 0.1, 1700 * p, 1.6); },
    // stone on stone, then a low ring: a chess piece taken
    capture: function (p) { noise(0.05, 0.2, 1100 * p, 1.1); tone(180 * p, 0.12, "sine", 0.24, 90 * p); tone(523 * p, 0.38, "sine", 0.1, null, 0.04); },
    // two low notes, a warning: check
    check: function (p) { tone(440 * p, 0.14, "triangle", 0.12); tone(415 * p, 0.24, "triangle", 0.12, null, 0.12); },
    // dice and bronze: a battle fought
    clash: function (p) { noise(0.04, 0.16, 2200 * p, 1.3); noise(0.03, 0.12, 3400 * p, 2, 0.05); tone(880 * p, 0.12, "square", 0.025, 620 * p); },
    // a horn-like rise: a land taken
    conquer: function (p) { tone(294 * p, 0.2, "sawtooth", 0.05); tone(440 * p, 0.34, "triangle", 0.13, null, 0.08); noise(0.08, 0.1, 600 * p, 0.9); },
    // a short low drop: one of your lands lost
    fall: function (p) { tone(220 * p, 0.26, "triangle", 0.12, 110 * p); noise(0.06, 0.08, 500, 0.9); },
    // a falling tone: the ball lost
    lose: function (p) { tone(300 * p, 0.45, "sawtooth", 0.07, 70 * p); noise(0.2, 0.08, 400, 0.8); }
  };
  function play(name, pitch) {
    if (!VOICES[name] || !ensure()) return;
    try { VOICES[name](pitch || 1); } catch (e) { /* audio refused */ }
  }

  /* ---------------- the impact table ---------------- */
  // stop: freeze in seconds · shake: pixels · flash: peak alpha · buzz: ms (phones that allow it)
  var KINDS = {
    tick:   { stop: 0,     shake: 0,   flash: 0,    sound: "tick",   gap: 0.06 },
    thunk:  { stop: 0,     shake: 1.2, flash: 0,    sound: "thunk",  gap: 0.08 },
    sling:  { stop: 0.03,  shake: 2.5, flash: 0.06, sound: "sling",  gap: 0.08 },
    bumper: { stop: 0.045, shake: 3.5, flash: 0.1,  sound: "bumper", gap: 0.05 },
    paddle: { stop: 0.04,  shake: 3,   flash: 0.08, sound: "paddle", gap: 0.08 },
    coin:   { stop: 0,     shake: 0,   flash: 0,    sound: "coin",   gap: 0.05 },
    eat:    { stop: 0,     shake: 1.8, flash: 0.07, sound: "gulp",   gap: 0.05 },
    land:   { stop: 0,     shake: 1.5, flash: 0,    sound: "thud",   gap: 0.05 },
    course: { stop: 0.06,  shake: 3.5, flash: 0.12, sound: "course", gap: 0.1 },
    place:  { stop: 0,     shake: 0,   flash: 0,    sound: "place",  gap: 0.05 },
    capture:{ stop: 0,     shake: 3,   flash: 0.1,  sound: "capture", gap: 0.1 },
    check:  { stop: 0,     shake: 1,   flash: 0.06, sound: "check",  gap: 0.2 },
    clash:  { stop: 0,     shake: 2,   flash: 0,    sound: "clash",  gap: 0.08 },
    conquer:{ stop: 0,     shake: 3,   flash: 0.12, sound: "conquer", gap: 0.12 },
    fall:   { stop: 0,     shake: 2.5, flash: 0.1,  sound: "fall",   gap: 0.25 },
    big:    { stop: 0.09,  shake: 6,   flash: 0.22, sound: "chime",  gap: 0.2, buzz: 18 },
    lose:   { stop: 0.14,  shake: 8,   flash: 0.26, sound: "lose",   gap: 0.3, buzz: 40 }
  };

  function create() {
    var shake = 0, stop = 0, flash = 0, flashCol = "255,236,196", lastAt = {}, clock = 0, lastStop = -1, dx = 0, dy = 0;
    var api = {
      get reduced() { return reduced(); },
      // true while a shake or flash is still showing (games that redraw only on change keep drawing)
      get active() { return shake > 0 || flash > 0.005 || stop > 0; },
      // an impact. opts: { pitch, scale (0..2, how hard), color: "r,g,b" for the flash }
      hit: function (kind, opts) {
        var k = KINDS[kind]; if (!k) return; opts = opts || {};
        if (lastAt[kind] != null && clock - lastAt[kind] < k.gap) return;  // no machine-gun repeats
        lastAt[kind] = clock;
        var s = opts.scale == null ? 1 : Math.max(0, Math.min(2, opts.scale)), rm = reduced();
        // freezes never chain: after one, the game runs at least 0.15 s before the next
        if (k.stop && clock - lastStop > 0.15) { stop = Math.max(stop, k.stop * Math.min(1.5, s)); lastStop = clock + stop; }
        if (!rm) shake = Math.max(shake, k.shake * s);
        var fl = k.flash * Math.min(1.5, s); if (rm) fl = Math.min(fl, 0.06);
        if (fl > flash) { flash = Math.min(0.3, fl); flashCol = opts.color || "255,236,196"; }
        play(k.sound, opts.pitch);
        if (k.buzz && unlocked && navigator.vibrate && soundOn()) { try { navigator.vibrate(k.buzz); } catch (e) { /* not allowed */ } }
      },
      // advance the effects by dt seconds; true while the hit-stop freeze holds
      tick: function (dt) {
        clock += dt;
        flash = Math.max(0, flash - dt * 1.8);
        shake = shake > 0.2 ? shake * Math.pow(0.0025, dt) : 0;   // ~-60 dB per second
        dx = shake ? (Math.random() * 2 - 1) * shake : 0; dy = shake ? (Math.random() * 2 - 1) * shake * 0.7 : 0;
        if (stop > 0) { stop -= dt; return true; }
        return false;
      },
      begin: function (cx) { cx.save(); if (dx || dy) cx.translate(dx, dy); },
      end: function (cx, w, h) {
        cx.restore();
        if (flash > 0.005) { cx.save(); cx.fillStyle = "rgba(" + flashCol + "," + flash.toFixed(3) + ")"; cx.fillRect(0, 0, w, h); cx.restore(); }
      },
      sound: play,
      reset: function () { shake = 0; stop = 0; flash = 0; dx = 0; dy = 0; lastStop = -1; lastAt = {}; clock = 0; }
    };
    return api;
  }

  window.ArchiveFeel = { create: create, reduced: reduced, KINDS: KINDS };
})();
