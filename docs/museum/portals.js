// Portal culling for the museum in a VR headset (handoff/vr-performance-budget.md §5): which parts of the building
// can be seen from where the visitor stands, worked out from the plan's own doors instead of from distance alone.
//
// The building is a tree of convex cells (the entrance hall, the passage, the Rotunda, the Spine, each wing's corridor
// and each room) joined by door openings ("portals"). Every wall runs from floor to ceiling and every ceiling is closed
// (a skylight is a sky drawn in the ceiling's hole), so what can be seen is decided in plan: a cell is seen only along
// a straight line through every door between it and the eye. From the eye, each door of the cell it stands in opens a
// wedge of directions; through the next cell, each further door narrows that wedge; a cell is listed as soon as a wedge
// reaches it. The wedge test treats doors as full-height openings (their lintels are ignored), so it can only list too
// much, never too little.
//
// Headset margin: the head moves between checks and the eyes sit either side of it, so the set is the union of the
// sets seen from the head and from points on a small circle round it (MARGIN). tools/xr-portal-check.js sweeps rays
// through the real walls and fails if any cell a ray reaches is missing from the set.
//
// Plain JS, no imports: the check tool loads this file in Node as well.

export const MARGIN = 0.35;          // metres round the head that count as "here"
const PAD = 0.002;                   // radians added to each side of a wedge (rounding only)
const RING = 8;                      // points on the margin circle

export function createPortals() {
  const cells = new Map();           // id -> { id, zone, kind: "rect"|"round", x0, x1, z0, z1 | cx, cz, r, doors: [] }
  const order = [];
  function rect(id, zone, x0, x1, z0, z1) {
    const c = { id, zone, kind: "rect", x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), doors: [] };
    cells.set(id, c); order.push(c); return c;
  }
  function round(id, zone, cx, cz, r) { const c = { id, zone, kind: "round", cx, cz, r, doors: [] }; cells.set(id, c); order.push(c); return c; }
  // a door between two cells: the opening's two ends in plan
  function door(a, b, ax, az, bx, bz) {
    const A = cells.get(a), B = cells.get(b);
    if (!A || !B) throw new Error("portals: unknown cell " + (A ? b : a));
    const d = { ax, az, bx, bz, a, b };
    A.doors.push(d); B.doors.push(d);
  }
  const inside = (c, x, z) => c.kind === "round" ? Math.hypot(x - c.cx, z - c.cz) < c.r : x > c.x0 && x < c.x1 && z > c.z0 && z < c.z1;
  // the cell a point is in (rooms are checked before the larger areas they open off); null outside the building
  function cellAt(x, z) { for (const c of order) if (inside(c, x, z)) return c; return null; }

  const rel = (a, ref) => { let d = a - ref; while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI; return d; };
  // walk on from cell `c` (entered through door `via`) inside the wedge [lo, hi] (angles relative to `ref`)
  function spread(x, z, c, via, lo, hi, ref, out, depth) {
    out.add(c.id);
    if (depth > 24) return;
    for (const d of c.doors) {
      if (d === via) continue;
      let a = rel(Math.atan2(d.az - z, d.ax - x), ref), b = rel(Math.atan2(d.bz - z, d.bx - x), ref);
      if (a > b) [a, b] = [b, a];
      if (b - a > Math.PI) { a = -Math.PI; b = Math.PI; }        // a door round the back of the eye: keep the whole wedge
      const l = Math.max(lo, a - PAD), h = Math.min(hi, b + PAD);
      if (l < h) spread(x, z, cells.get(d.a === c.id ? d.b : d.a), d, l, h, ref, out, depth + 1);
    }
  }
  // the cells seen from one point; null when the point is outside every cell (then nothing is culled)
  function fromPoint(x, z, out) {
    const c = cellAt(x, z); if (!c) return null;
    out.add(c.id);
    for (const d of c.doors) {
      const ref = Math.atan2((d.az + d.bz) / 2 - z, (d.ax + d.bx) / 2 - x);
      let a = rel(Math.atan2(d.az - z, d.ax - x), ref), b = rel(Math.atan2(d.bz - z, d.bx - x), ref);
      if (a > b) [a, b] = [b, a];
      if (b - a > Math.PI) { a = -Math.PI; b = Math.PI; }        // standing in the doorway
      spread(x, z, cells.get(d.a === c.id ? d.b : d.a), d, a - PAD, b + PAD, ref, out, 1);
    }
    return out;
  }
  // the cells seen from the head at (x, z) and from the margin round it. null: the head is not in any cell, so cull nothing
  function visible(x, z, margin) {
    const m = margin == null ? MARGIN : margin, out = new Set();
    if (!fromPoint(x, z, out)) return null;
    if (m > 0) for (let i = 0; i < RING; i++) { const t = i / RING * Math.PI * 2; fromPoint(x + Math.cos(t) * m, z + Math.sin(t) * m, out); }
    return out;
  }
  const zoneOf = (id) => { const c = cells.get(id); return c ? c.zone : null; };
  return { rect, round, door, cellAt, visible, zoneOf, cells, list: () => order.map((c) => Object.assign({}, c, { doors: c.doors.map((d) => [d.ax, d.az, d.bx, d.bz, d.a, d.b]) })) };
}
