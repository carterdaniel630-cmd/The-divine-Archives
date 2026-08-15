/* ==========================================================================
   THE DIVINE ARCHIVES — shared rendering & navigation
   Vanilla JS. Core navigation is hard-coded in each page's HTML so it works
   without scripts; this file renders the data-driven lists and the reader.
   ========================================================================== */
(function () {
  "use strict";

  var A = window.ARCHIVE || { eras: [], chapters: [], themes: [] };

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function qs(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  var STATUS = {
    published: { label: "In the archive", cls: "is-published" },
    review:    { label: "Awaiting review", cls: "is-review" },
    draft:     { label: "In draft", cls: "is-review" },
    planned:   { label: "In preparation", cls: "is-planned" }
  };
  function badge(status, pending) {
    if (pending) return '<span class="badge is-pending">Recently added &middot; pending review</span>';
    var s = STATUS[status] || STATUS.planned;
    return '<span class="badge ' + s.cls + '">' + s.label + "</span>";
  }

  function chapterFor(traditionName) {
    for (var i = 0; i < A.chapters.length; i++) {
      if (A.chapters[i].title.toLowerCase() === traditionName.toLowerCase()) return A.chapters[i];
    }
    return null;
  }
  function eraBySlug(slug) {
    for (var i = 0; i < A.eras.length; i++) if (A.eras[i].slug === slug) return A.eras[i];
    return null;
  }
  function chapterById(id) {
    for (var i = 0; i < A.chapters.length; i++) if (A.chapters[i].id === id) return A.chapters[i];
    return null;
  }

  /* ---------------- ERA DETAIL PAGE ---------------- */
  function renderEra(mount) {
    var era = eraBySlug(qs("era"));
    if (!era) {
      mount.appendChild(el('<p class="notice">That age could not be found in the archive. <a href="eras.html">Return to the ages</a>.</p>'));
      return;
    }
    document.title = era.name + " — The Divine Archives";

    var head = el(
      '<div class="page-head">' +
        '<p class="crumb" style="justify-content:center">' +
          '<a href="index.html">Archive</a><span class="sep">/</span>' +
          '<a href="eras.html">The Nine Ages</a><span class="sep">/</span>' +
          '<span>' + esc(era.name) + '</span>' +
        '</p>' +
        (((window.EMBLEMS || {})[era.slug]) || '') +
        '<p class="eyebrow">Era ' + esc(era.num) + " &middot; " + esc(era.dates) + '</p>' +
        "<h1>" + esc(era.name) + "</h1>" +
        '<p class="lede">' + esc(era.blurb) + "</p>" +
      "</div>"
    );
    mount.appendChild(head);

    var section = el('<section class="wrap" style="max-width:52rem;padding-block:2rem 1rem"></section>');
    section.appendChild(el('<div class="ornament" style="margin-bottom:2rem"><span>&#10022;</span></div>'));
    section.appendChild(el('<p class="eyebrow center" style="margin-bottom:1.4rem">Traditions of this age</p>'));

    var list = el('<div class="tiles"></div>');
    era.traditions.forEach(function (name) {
      var ch = chapterFor(name);
      var status = ch ? ch.status : "planned";
      var head =
        '<span class="tile-art">' + artFor(ch, era) + "</span>" +
        '<span class="tile-name">' + esc(name) + "</span>" +
        badge(status, ch && ch.pending);
      if (ch) {
        var a = el('<a class="tile" href="chapter.html?id=' + encodeURIComponent(ch.id) + '"></a>');
        a.innerHTML = head + '<p class="tile-sum">' + esc(ch.summary) + "</p>";
        list.appendChild(a);
      } else {
        var d = el('<div class="tile is-planned"></div>');
        d.innerHTML = head + '<p class="tile-sum" style="font-style:italic">A chapter for this tradition is planned but not yet written.</p>';
        list.appendChild(d);
      }
    });
    section.appendChild(list);

    // comparative themes touching this era
    var themeChapters = A.chapters.filter(function (c) { return c.kind === "theme"; });
    if (themeChapters.length) {
      section.appendChild(el('<p class="eyebrow center" style="margin:2.6rem 0 1.4rem">Comparative themes across this age</p>'));
      var tlist = el('<div class="tiles"></div>');
      themeChapters.forEach(function (ch) {
        var a = el('<a class="tile" href="chapter.html?id=' + encodeURIComponent(ch.id) + '"></a>');
        a.innerHTML =
          '<span class="tile-art">' + artFor(ch, null) + "</span>" +
          '<span class="tile-name">' + esc(ch.title) + "</span>" +
          badge(ch.status, ch.pending) +
          '<p class="tile-sum">' + esc(ch.summary) + "</p>";
        tlist.appendChild(a);
      });
      section.appendChild(tlist);
    }

    mount.appendChild(section);
  }

  // pick a thumbnail for a tradition tile: the chapter's plate art, else the era emblem
  function artFor(ch, era) {
    if (ch && window.PLATE_ART && window.PLATE_ART[ch.id]) return window.PLATE_ART[ch.id];
    if (era && window.EMBLEMS && window.EMBLEMS[era.slug]) return window.EMBLEMS[era.slug];
    return "";
  }

  /* ---------------- TRADITIONS INDEX ---------------- */
  function renderTraditions(mount) {
    // compile a unique, sorted list of traditions with the era each belongs to
    var rows = [];
    A.eras.forEach(function (era) {
      era.traditions.forEach(function (name) {
        var ch = chapterFor(name);
        rows.push({ name: name, era: era, status: ch ? ch.status : "planned", chapter: ch });
      });
    });
    rows.sort(function (a, b) { return a.name.localeCompare(b.name); });

    var box = el('<section class="wrap" style="max-width:52rem"></section>');
    var input = el('<div class="search center" style="margin:0 auto 2.4rem"><form onsubmit="return false" role="search">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '<input id="trad-filter" type="search" placeholder="Filter traditions&hellip;" aria-label="Filter traditions" /></form></div>');
    box.appendChild(input);

    var listWrap = el('<div id="trad-list" class="tiles"></div>');
    box.appendChild(listWrap);
    mount.appendChild(box);

    function draw(filter) {
      listWrap.innerHTML = "";
      var f = (filter || "").toLowerCase();
      var shown = 0;
      rows.forEach(function (r) {
        if (f && r.name.toLowerCase().indexOf(f) === -1 && r.era.name.toLowerCase().indexOf(f) === -1) return;
        shown++;
        var href = r.chapter ? "chapter.html?id=" + encodeURIComponent(r.chapter.id) : "era.html?era=" + encodeURIComponent(r.era.slug);
        var a = el('<a class="tile" href="' + href + '"></a>');
        a.innerHTML =
          '<span class="tile-art">' + artFor(r.chapter, r.era) + "</span>" +
          '<span class="tile-name">' + esc(r.name) + "</span>" +
          '<span class="tile-era">Era ' + esc(r.era.num) + " &middot; " + esc(r.era.name) + "</span>" +
          badge(r.status, r.chapter && r.chapter.pending);
        listWrap.appendChild(a);
      });
      if (!shown) listWrap.appendChild(el('<p class="notice">No tradition matches &ldquo;' + esc(filter) + '&rdquo;.</p>'));
    }

    var pre = qs("q");
    draw(pre);
    var field = document.getElementById("trad-filter");
    if (field) {
      if (pre) field.value = pre;
      field.addEventListener("input", function () { draw(field.value); });
      field.focus();
    }
  }

  /* ---------------- CHAPTER READER ---------------- */
  function renderChapter(mount) {
    var ch = chapterById(qs("id"));
    if (!ch) {
      mount.appendChild(el('<p class="notice">That chapter could not be found. <a href="eras.html">Browse the ages</a>.</p>'));
      return;
    }
    document.title = ch.title + " — The Divine Archives";

    mount.appendChild(el(
      '<div class="page-head">' +
        '<p class="crumb" style="justify-content:center">' +
          '<a href="index.html">Archive</a><span class="sep">/</span>' +
          (ch.era ? '<a href="era.html?era=' + encodeURIComponent(ch.era) + '">' + esc((eraBySlug(ch.era) || {}).name || "Era") + "</a>" : '<a href="eras.html">Themes</a>') +
          '<span class="sep">/</span><span>' + esc(ch.title) + "</span>" +
        "</p>" +
        (((window.PLATES || {})[ch.id]) || '') +   // framed frontispiece plate, above the title
        '<p class="eyebrow">' + esc(ch.eraLabel) + "</p>" +
        "<h1>" + esc(ch.title) + "</h1>" +
        '<p style="margin-top:0.6rem">' + badge(ch.status, ch.pending) + "</p>" +
      "</div>"
    ));

    var rendered = (window.CHAPTERS && window.CHAPTERS[ch.id]) ? window.CHAPTERS[ch.id].html : null;
    var body = el('<section class="wrap article"></section>');
    if (ch.status === "published" && rendered) {
      if (ch.pending) {
        body.appendChild(el(
          '<div class="pending-banner">' +
            '<strong>Recently added &middot; pending full review.</strong> ' +
            'This chapter is live but has not yet completed the keeper&rsquo;s review pass. ' +
            'It is sourced to the project&rsquo;s standard, but wording and detail may still change. ' +
            'The tag is removed once the chapter is cleared.' +
          "</div>"
        ));
      }
      body.insertAdjacentHTML("beforeend", rendered); // published chapters render here
      var nav = el('<div class="chapter-nav"></div>');
      nav.innerHTML = (ch.era ? '<a href="era.html?era=' + encodeURIComponent(ch.era) + '">&larr; ' + esc((eraBySlug(ch.era) || {}).name || "Back") + "</a>" : '<a href="themes.html">&larr; All themes</a>') +
        '<a href="eras.html">Browse the ages &rarr;</a>';
      body.appendChild(nav);
    } else {
      body.appendChild(el('<p class="lede center" style="margin-bottom:2rem">' + esc(ch.summary) + "</p>"));
      body.appendChild(el(
        '<div class="notice center" style="text-align:center">' +
          "This chapter has been drafted and is <strong>awaiting the keeper&rsquo;s review</strong>. " +
          "In keeping with the archive&rsquo;s standard, no chapter is published until it has been checked " +
          "for accuracy, sourcing, and honesty about what the record does and does not support. " +
          "It will appear here once approved." +
        "</div>"
      ));
    }
    mount.appendChild(body);
  }

  /* ---------------- SEARCH WIRING ---------------- */
  function wireSearch() {
    document.querySelectorAll('form[data-search]').forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input");
        var q = input ? input.value.trim() : "";
        window.location.href = "traditions.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    });
  }

  /* ---------------- BOOT ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    wireSearch();
    var mount;
    if ((mount = document.getElementById("era-mount"))) renderEra(mount);
    if ((mount = document.getElementById("traditions-mount"))) renderTraditions(mount);
    if ((mount = document.getElementById("chapter-mount"))) renderChapter(mount);
  });
})();
