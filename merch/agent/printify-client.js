"use strict";
/* ==========================================================================
   THE DIVINE ARCHIVES — Printify API client (dry-run aware)
   Thin wrapper over the Printify REST API (https://api.printify.com/v1).
   HARD RULE: when dryRun is true (the default), no request that would
   CREATE, PUBLISH, or otherwise mutate a Printify resource is ever sent.
   Read-only catalog/shop GETs are allowed only when a token is present so
   the dry run can *verify* config; they are skipped (not faked) otherwise.
   ========================================================================== */

const BASE = "https://api.printify.com/v1";

class PrintifyClient {
  constructor(opts = {}) {
    this.token = opts.token || process.env.PRINTIFY_API_TOKEN || null;
    this.dryRun = opts.dryRun !== false; // dry run unless explicitly disabled
  }

  get hasToken() {
    return typeof this.token === "string" && this.token.length > 0;
  }

  async _get(path) {
    if (!this.hasToken) {
      const err = new Error("no-token");
      err.code = "NO_TOKEN";
      throw err;
    }
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" }
    });
    if (!res.ok) {
      const err = new Error(`printify GET ${path} -> ${res.status}`);
      err.code = "HTTP_" + res.status;
      throw err;
    }
    return res.json();
  }

  // --- Read-only helpers (used to VERIFY config during a dry run) ----------

  async listShops() {
    return this._get("/shops.json");
  }

  async getBlueprint(blueprintId) {
    return this._get(`/catalog/blueprints/${blueprintId}.json`);
  }

  async getVariants(blueprintId, printProviderId) {
    return this._get(
      `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`
    );
  }

  // --- Mutating operations (BLOCKED in dry run) ----------------------------

  async uploadImage() {
    if (this.dryRun) {
      const err = new Error("uploadImage blocked in dry-run mode");
      err.code = "DRYRUN_BLOCKED";
      throw err;
    }
    throw new Error("live uploadImage not implemented — draft/dry-run scope only");
  }

  async createProduct() {
    if (this.dryRun) {
      const err = new Error("createProduct blocked in dry-run mode");
      err.code = "DRYRUN_BLOCKED";
      throw err;
    }
    throw new Error("live createProduct not implemented — draft/dry-run scope only");
  }

  async publishProduct() {
    // There is intentionally no publish path in this agent.
    throw new Error("publishProduct is disabled by design — this agent never publishes");
  }
}

module.exports = { PrintifyClient, BASE };
