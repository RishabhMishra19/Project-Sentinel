# Sentinel Loadlab

Minimal Next.js control UI + k6 runner for seeding catalog data and load-testing ingest request events.

## Prerequisites

1. Sentinel stack running locally (Control `:8080`, Ingest `:8081`, Kafka)
2. Node.js 18+
3. k6 available either on your `PATH` (`brew install k6`) **or** as `tools/loadlab/.bin/k6` (gitignored local binary)

```bash
# optional system install
brew install k6

# or drop a binary at tools/loadlab/.bin/k6
```

## Run

```bash
cd tools/loadlab
npm install
npm run dev
```

Open [http://localhost:3100](http://localhost:3100).

1. **Seed catalog** — creates tenants → products → services → API keys → ingest instances (uses Control + Ingest APIs; defaults to seed admin `rishabhpndt19@gmail.com` / `Admin@123`)
2. **Start load** — spawns `k6 run k6/events.js` against `POST /v1/events`
3. Watch the log panel + Kafka UI topic `sentinel.request-events` (`http://localhost:8090`)

## Knobs

| Field | Meaning |
|-------|---------|
| Tenants / products / services | Seed matrix — load randomly spreads across all resulting services |
| Total requests | Count of HTTP `POST /v1/events` calls (1 event each) |
| RPS | Arrival rate (1–10000/sec). Duration ≈ `totalRequests / RPS` |
| Error % | Fraction of events with 5xx `statusCode` |
| Path cardinality | How many distinct fake endpoint paths to mix |

## Notes

- Raw API keys are stored in local `catalog.json` (gitignored). The UI never displays them.
- Worker may not consume yet — expect Kafka messages even if dashboard logs/analytics stay empty.
- One load run at a time. Use **Stop** to SIGTERM k6.
