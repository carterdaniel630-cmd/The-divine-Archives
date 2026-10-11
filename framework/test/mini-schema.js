/* A small JSON Schema checker covering only the keywords framework/schema/ uses
   (type, required, properties, additionalProperties, enum, const, pattern,
   minimum, maximum, minLength, minItems, maxItems, items, uniqueItems, allOf, if/then).
   The repo has no package.json, so the tests carry their own. */
"use strict";
function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}
function validate(schema, v, at, errs) {
  at = at || "$"; errs = errs || [];
  if (schema.type) {
    const types = [].concat(schema.type), t = typeOf(v);
    if (!types.some((x) => x === t || (x === "number" && t === "integer"))) { errs.push(at + ": expected " + types.join("|") + ", got " + t); return errs; }
  }
  if ("const" in schema && JSON.stringify(v) !== JSON.stringify(schema.const)) errs.push(at + ": must equal " + JSON.stringify(schema.const));
  if (schema.enum && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(v))) errs.push(at + ": not one of " + JSON.stringify(schema.enum));
  if (typeof v === "string") {
    if (schema.pattern && !new RegExp(schema.pattern).test(v)) errs.push(at + ": does not match " + schema.pattern);
    if (schema.minLength && v.length < schema.minLength) errs.push(at + ": too short");
  }
  if (typeof v === "number") {
    if ("minimum" in schema && v < schema.minimum) errs.push(at + ": below " + schema.minimum);
    if ("maximum" in schema && v > schema.maximum) errs.push(at + ": above " + schema.maximum);
  }
  if (Array.isArray(v)) {
    if (schema.minItems && v.length < schema.minItems) errs.push(at + ": needs at least " + schema.minItems + " items");
    if (schema.maxItems && v.length > schema.maxItems) errs.push(at + ": too many items");
    if (schema.uniqueItems && new Set(v.map((x) => JSON.stringify(x))).size !== v.length) errs.push(at + ": items not unique");
    if (schema.items) v.forEach((x, i) => validate(schema.items, x, at + "[" + i + "]", errs));
  }
  if (typeOf(v) === "object") {
    for (const r of schema.required || []) if (!(r in v)) errs.push(at + ": missing " + r);
    const props = schema.properties || {};
    for (const k of Object.keys(v)) {
      if (props[k]) validate(props[k], v[k], at + "." + k, errs);
      else if (schema.additionalProperties === false) errs.push(at + ": unexpected property " + k);
    }
  }
  for (const s of schema.allOf || []) {
    if (s.if) { if (!validate(s.if, v, at, []).length && s.then) validate(s.then, v, at, errs); }
    else validate(s, v, at, errs);
  }
  return errs;
}
module.exports = { validate };
