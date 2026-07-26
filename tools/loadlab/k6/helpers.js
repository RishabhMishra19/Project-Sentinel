const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const PATH_TEMPLATES = [
  "/health",
  "/users",
  "/users/{id}",
  "/users/{id}/profile",
  "/orders",
  "/orders/{id}",
  "/orders/{id}/items",
  "/products",
  "/products/{id}",
  "/products/{id}/reviews",
  "/cart",
  "/cart/items/{id}",
  "/payments",
  "/payments/{id}",
  "/search",
  "/notifications",
  "/settings",
  "/settings/billing",
  "/webhooks/{id}",
  "/reports/{id}/export",
];

export function pickMethod() {
  return METHODS[Math.floor(Math.random() * METHODS.length)];
}

export function buildPath(pathCardinality) {
  const n = Math.max(1, Math.min(PATH_TEMPLATES.length, pathCardinality || PATH_TEMPLATES.length));
  const template = PATH_TEMPLATES[Math.floor(Math.random() * n)];
  return template.replace(/\{id\}/g, uuid());
}

export function pickStatus(errorPct) {
  if (Math.random() * 100 < errorPct) {
    return Math.random() < 0.5 ? 500 : 503;
  }
  const roll = Math.random();
  if (roll < 0.85) return 200;
  if (roll < 0.93) return 201;
  if (roll < 0.97) return 204;
  return 400;
}

export function pickDurationMs(p50Ms, p95Ms) {
  const p50 = Math.max(0, p50Ms || 40);
  const p95 = Math.max(p50, p95Ms || 200);
  if (Math.random() < 0.5) {
    return Math.max(0, Math.round(p50 + (Math.random() - 0.5) * p50 * 0.4));
  }
  if (Math.random() < 0.9) {
    return Math.round(p50 + Math.random() * (p95 - p50));
  }
  return Math.round(p95 + Math.random() * p95);
}

export function randomIp() {
  return `203.0.113.${Math.floor(Math.random() * 250) + 1}`;
}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
