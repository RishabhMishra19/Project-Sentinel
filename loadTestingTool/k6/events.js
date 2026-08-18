import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import {
  buildPath,
  pickDurationMs,
  pickMethod,
  pickStatus,
  randomIp,
  uuid,
} from "./helpers.js";

const catalogPath = __ENV.CATALOG_PATH || "catalog.json";

const services = new SharedArray("services", () => {
  const catalog = JSON.parse(open(catalogPath));
  if (!catalog.services || catalog.services.length === 0) {
    throw new Error("catalog.json has no services — run seed first");
  }
  return catalog.services.map((s) => ({
    apiKey: s.apiKey,
    instanceId: s.instanceId,
    ingestBaseUrl: catalog.ingestBaseUrl,
  }));
});

const RPS = Math.min(10000, Math.max(1, Number(__ENV.RPS || 100)));
const TOTAL_REQUESTS = Math.min(
  10_000_000,
  Math.max(1, Number(__ENV.TOTAL_REQUESTS || 10000)),
);
const ERROR_PCT = Number(__ENV.ERROR_PCT || 5);
const P50_MS = Number(__ENV.P50_MS || 40);
const P95_MS = Number(__ENV.P95_MS || 200);
const PATH_CARDINALITY = Number(__ENV.PATH_CARDINALITY || 20);
const DURATION_SEC = Math.max(1, Math.ceil(TOTAL_REQUESTS / RPS));

export const options = {
  scenarios: {
    events: {
      executor: "constant-arrival-rate",
      rate: RPS,
      timeUnit: "1s",
      duration: `${DURATION_SEC}s`,
      preAllocatedVUs: Math.min(1000, Math.max(20, Math.ceil(RPS / 10))),
      maxVUs: Math.min(2000, Math.max(50, Math.ceil(RPS / 2))),
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  const svc = services[Math.floor(Math.random() * services.length)];
  const events = [
    {
      method: pickMethod(),
      path: buildPath(PATH_CARDINALITY),
      occurredAt: new Date().toISOString(),
      statusCode: pickStatus(ERROR_PCT),
      durationMs: pickDurationMs(P50_MS, P95_MS),
      endUserIp: randomIp(),
      requestSizeBytes: Math.floor(Math.random() * 2048),
      responseSizeBytes: Math.floor(Math.random() * 8192),
      requestId: uuid(),
      userId: `user-${Math.floor(Math.random() * 10_000)}`,
    },
  ];

  const res = http.post(`${svc.ingestBaseUrl}/v1/events`, JSON.stringify({ events }), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${svc.apiKey}`,
    },
    tags: { name: "ingest_events" },
  });

  check(res, {
    "status is 202": (r) => r.status === 202,
  });
}
