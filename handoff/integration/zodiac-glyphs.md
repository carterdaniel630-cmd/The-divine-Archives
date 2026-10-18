# Zodiac Glyph Registry — recovered to disk 2026-10-12

**Provenance:** Emitted in chat by atlas on 2026-10-12 (Hard Batch Engine run).
Recovered verbatim from conversation history and saved here so the dataset
no longer exists only in chat.

**Caveats (read before using):**
- Untested against the production codebase; chat output only.
- The SVG paths were emitted as "true glyph paths" but were NEVER verified
  against primary texts or the archaeological record. Do NOT treat them as
  historically audited. The Artistry Standard (clause 2) requires provenance
  verification before any glyph ships.
- Target path per the emission: `/assets/zodiac/glyphs.js`

---

```js
// TARGET FILE: /assets/zodiac/glyphs.js
// ASSET REGISTRY (12): aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces
// SCHEMA: ZodiacGlyph { id, index, name, unicode, dates, element, modality, ruler, viewBox, svg, mount(host), dispose() }
// RULERS: traditional (pre-modern) rulerships, per the classical frame of the archive.
// USAGE: ZODIAC_GLYPHS.find(g => g.id === "leo").mount(document.getElementById("slot"));
// TEARDOWN: glyph.dispose() or ZODIAC_GLYPHS.disposeAll()

function mountGlyph(host) {
  if (host && this.svg) { host.innerHTML = this.svg; this._host = host; }
  return this;
}

function disposeGlyph() {
  if (this._host) { try { this._host.innerHTML = ""; } catch (e) {} this._host = null; }
  this.svg = null;
  return null;
}

const ZODIAC_GLYPHS = [
  {
    id: "aries", index: 0, name: "Aries", unicode: "♈",
    dates: "Mar 21 – Apr 19", element: "fire", modality: "cardinal", ruler: "Mars",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Aries glyph"><path d="M50 88C44 66 36 52 26 46C16 40 15 26 24 20C31 15 39 20 38 29"/><path d="M50 88C56 66 64 52 74 46C84 40 85 26 76 20C69 15 61 20 62 29"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "taurus", index: 1, name: "Taurus", unicode: "♉",
    dates: "Apr 20 – May 20", element: "earth", modality: "fixed", ruler: "Venus",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Taurus glyph"><circle cx="50" cy="63" r="21"/><path d="M29 52C29 30 37 16 50 16C63 16 71 30 71 52"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "gemini", index: 2, name: "Gemini", unicode: "♊",
    dates: "May 21 – Jun 20", element: "air", modality: "mutable", ruler: "Mercury",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Gemini glyph"><path d="M35 28L35 72M65 28L65 72"/><path d="M35 28C43 18 57 18 65 28"/><path d="M35 72C43 82 57 82 65 72"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "cancer", index: 3, name: "Cancer", unicode: "♋",
    dates: "Jun 21 – Jul 22", element: "water", modality: "cardinal", ruler: "Moon",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Cancer glyph"><path d="M62 28C48 24 36 30 36 42C36 52 46 56 53 51"/><path d="M38 72C52 76 64 70 64 58C64 48 54 44 47 49"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "leo", index: 4, name: "Leo", unicode: "♌",
    dates: "Jul 23 – Aug 22", element: "fire", modality: "fixed", ruler: "Sun",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Leo glyph"><circle cx="40" cy="36" r="14"/><path d="M52 42C66 48 76 60 74 74C72 86 60 90 53 83C48 78 50 70 56 70"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "virgo", index: 5, name: "Virgo", unicode: "♍",
    dates: "Aug 23 – Sep 22", element: "earth", modality: "mutable", ruler: "Mercury",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Virgo glyph"><path d="M22 74L22 46C22 36 32 36 32 46L32 58C32 66 42 66 42 58L42 46C42 36 52 36 52 46L52 74"/><path d="M52 74C64 74 74 68 76 56C77 48 71 42 65 45C60 47 60 54 65 56"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "libra", index: 6, name: "Libra", unicode: "♎",
    dates: "Sep 23 – Oct 22", element: "air", modality: "cardinal", ruler: "Venus",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Libra glyph"><path d="M18 68L82 68"/><path d="M34 68C34 48 42 36 50 36C58 36 66 48 66 68"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "scorpio", index: 7, name: "Scorpio", unicode: "♏",
    dates: "Oct 23 – Nov 21", element: "water", modality: "fixed", ruler: "Mars",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Scorpio glyph"><path d="M22 72L22 46C22 36 32 36 32 46L32 58C32 66 42 66 42 58L42 46C42 36 52 36 52 46L52 70"/><path d="M52 70C60 70 68 64 72 54"/><path d="M64 54L73 52L71 62"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "sagittarius", index: 8, name: "Sagittarius", unicode: "♐",
    dates: "Nov 22 – Dec 21", element: "fire", modality: "mutable", ruler: "Jupiter",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Sagittarius glyph"><path d="M28 72L72 28"/><path d="M56 28L72 28L72 44"/><path d="M42 58L58 42"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "capricorn", index: 9, name: "Capricorn", unicode: "♑",
    dates: "Dec 22 – Jan 19", element: "earth", modality: "cardinal", ruler: "Saturn",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Capricorn glyph"><path d="M62 24C52 24 46 31 48 39C50 46 58 48 63 44L63 72C63 82 53 86 46 80C41 76 42 68 48 67"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "aquarius", index: 10, name: "Aquarius", unicode: "♒",
    dates: "Jan 20 – Feb 18", element: "air", modality: "fixed", ruler: "Saturn",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Aquarius glyph"><path d="M18 38L30 30L42 38L54 30L66 38L78 30"/><path d="M18 62L30 54L42 62L54 54L66 62L78 54"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  },
  {
    id: "pisces", index: 11, name: "Pisces", unicode: "♓",
    dates: "Feb 19 – Mar 20", element: "water", modality: "mutable", ruler: "Jupiter",
    viewBox: "0 0 100 100", _host: null,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Pisces glyph"><path d="M40 24C30 34 30 66 40 76"/><path d="M60 24C70 34 70 66 60 76"/><path d="M24 50L76 50"/></svg>',
    mount: mountGlyph, dispose: disposeGlyph
  }
];

ZODIAC_GLYPHS.disposeAll = function () {
  for (var i = 0; i < ZODIAC_GLYPHS.length; i++) { ZODIAC_GLYPHS[i].dispose(); }
  return null;
};

if (typeof module !== "undefined" && module.exports) { module.exports = ZODIAC_GLYPHS; }
```
