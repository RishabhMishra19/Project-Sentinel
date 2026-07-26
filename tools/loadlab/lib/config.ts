import path from "node:path";

export const ROOT_DIR = process.cwd();
export const CATALOG_PATH = path.join(ROOT_DIR, "catalog.json");
export const DATA_DIR = path.join(ROOT_DIR, ".data");
export const RUN_STATE_PATH = path.join(DATA_DIR, "last-run.json");
export const K6_SCRIPT_PATH = path.join(ROOT_DIR, "k6", "events.js");

export const DEFAULTS = {
  controlUrl: "http://localhost:8080",
  ingestUrl: "http://localhost:8081",
  email: "rishabhpndt19@gmail.com",
  password: "Admin@123",
  tenants: 3,
  products: 2,
  services: 3,
  rps: 100,
  totalRequests: 10_000,
  errorPct: 5,
  p50Ms: 40,
  p95Ms: 200,
  pathCardinality: 20,
} as const;
