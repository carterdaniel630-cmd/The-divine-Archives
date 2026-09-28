/* ==========================================================================
   THE DIVINE ARCHIVES — the Virtual Museum: a small ephemeris for the planetarium

   Where the Sun, Moon and planets are on a given date, and how the sky is turned
   for a given place and time. Dependency-free, so tools/verify-sky.js can check
   it against a reference ephemeris.

   - Planets: the Keplerian elements of JPL's "Approximate Positions of the
     Planets" (E. M. Standish, valid 1800–2050), as shipped in d3-celestial's
     planets.json; accurate to well under a degree for the naked-eye planets.
   - Moon: the low-precision formulae of the Astronomical Almanac (about 0.3°),
     precessed to J2000 and corrected for parallax where the sky is drawn.
   - Sidereal time: the IAU 1982 expression for Greenwich mean sidereal time.
   All positions are J2000 right ascension / declination in degrees.
   ========================================================================== */
const D2R = Math.PI / 180, OBL = 23.43928 * D2R;
const norm = (a) => ((a % 360) + 360) % 360;

export function julian(date) { return date.getTime() / 86400000 + 2440587.5; }
// Greenwich mean sidereal time, degrees
export function gmst(jd) { const d = jd - 2451545.0, T = d / 36525; return norm(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T); }

// heliocentric ecliptic J2000 position (AU) from one element set
function helio(el, T) {
  const a = el.a + el.da * T, e = el.e + el.de * T, I = (el.i + el.di * T) * D2R, L = el.L + el.dL * T, W = el.W + el.dW * T, N = el.N + el.dN * T;
  const w = (W - N) * D2R, M = norm(L - W) * D2R, O = N * D2R;
  let E = M + e * Math.sin(M);
  for (let k = 0; k < 8; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I), sI = Math.sin(I);
  return [(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp, (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp, (sw * sI) * xp + (cw * sI) * yp];
}
function eclToEq(x, y, z) {
  const ye = y * Math.cos(OBL) - z * Math.sin(OBL), ze = y * Math.sin(OBL) + z * Math.cos(OBL);
  return { ra: norm(Math.atan2(ye, x) / D2R), dec: Math.atan2(ze, Math.hypot(x, ye)) / D2R, dist: Math.hypot(x, ye, ze) };
}

// planets: { id: {elements:[{a,e,i,L,W,N,da,...}]} } including "ter" (the Earth–Moon barycentre)
export function planetsAt(P, jd) {
  const T = (jd - 2451545.0) / 36525, earth = helio(P.ter.elements[0], T), out = {};
  for (const id of ["mer", "ven", "mar", "jup", "sat"]) {
    const h = helio(P[id].elements[0], T), g = eclToEq(h[0] - earth[0], h[1] - earth[1], h[2] - earth[2]);
    out[id] = Object.assign(g, { r: Math.hypot(h[0], h[1], h[2]) });
  }
  out.sol = eclToEq(-earth[0], -earth[1], -earth[2]);
  out.lun = moonAt(jd);
  return out;
}

// the Moon, geocentric J2000 (Astronomical Almanac low-precision series)
export function moonAt(jd) {
  const T = (jd - 2451545.0) / 36525, s = (a, b) => Math.sin((a + b * T) * D2R);
  const lam = 218.32 + 481267.881 * T + 6.29 * s(135.0, 477198.87) - 1.27 * s(259.3, -413335.36) + 0.66 * s(235.7, 890534.22)
    + 0.21 * s(269.9, 954397.74) - 0.19 * s(357.5, 35999.05) - 0.11 * s(186.5, 966404.03);
  const bet = 5.13 * s(93.3, 483202.02) + 0.28 * s(228.2, 960400.89) - 0.28 * s(318.3, 6003.15) - 0.17 * s(217.6, -407332.21);
  const par = 0.9508 + 0.0518 * Math.cos((134.9 + 477198.85 * T) * D2R) + 0.0095 * Math.cos((259.2 - 413335.38 * T) * D2R)
    + 0.0078 * Math.cos((235.7 + 890534.23 * T) * D2R) + 0.0028 * Math.cos((269.9 + 954397.70 * T) * D2R);
  const l = (lam - 1.3970 * T) * D2R, b = bet * D2R;             // ecliptic of date → J2000 (general precession in longitude)
  const g = eclToEq(Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b));
  return Object.assign(g, { parallax: par });
}

// the fraction of the Moon's disc lit, and whether it is waxing
export function moonPhase(sun, moon) {
  const a = sun.ra * D2R, d = sun.dec * D2R, a2 = moon.ra * D2R, d2 = moon.dec * D2R;
  const elong = Math.acos(Math.max(-1, Math.min(1, Math.sin(d) * Math.sin(d2) + Math.cos(d) * Math.cos(d2) * Math.cos(a - a2))));
  const waxing = norm(moon.ra - sun.ra) < 180;
  return { lit: (1 - Math.cos(elong)) / 2, waxing, elong: elong / D2R };
}

// altitude/azimuth (degrees; azimuth from north through east) of a J2000 position
export function horizontal(ra, dec, lat, lst) {
  const H = (lst - ra) * D2R, d = dec * D2R, p = lat * D2R;
  const alt = Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H));
  const az = Math.atan2(-Math.cos(d) * Math.sin(H), Math.sin(d) * Math.cos(p) - Math.cos(d) * Math.cos(H) * Math.sin(p));
  return { alt: alt / D2R, az: norm(az / D2R) };
}

/* The matrix that turns an equatorial unit vector (x toward RA 0, z toward the pole) into
   the museum's world axes (x east, y up, z south), for latitude `lat` and local sidereal
   time `lst`, both degrees. Row-major 3×3. */
export function skyMatrix(lat, lst) {
  const p = lat * D2R, t = lst * D2R, cp = Math.cos(p), sp = Math.sin(p), ct = Math.cos(t), st = Math.sin(t);
  // rotate by -lst about the pole: v1 = (x ct + y st, -x st + y ct, z); x1 toward the meridian, y1 toward the east
  // east = y1, north = -sp x1 + cp z, up = cp x1 + sp z; world = (east, up, -north)
  return [
    -st, ct, 0,
    cp * ct, cp * st, sp,
    sp * ct, sp * st, -cp
  ];
}
