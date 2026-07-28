# Sentinel

API endpoint discovery and request observability for your services.

Other apps keep their own auth. They report API metadata and runtime request data to Sentinel, which stores it and presents it in the dashboard — sliced by service, product, or the whole company.

This repo is a full demo stack: **Control API** (`server`), **Ingest**, **Worker**, **React UI** (`client`), PostgreSQL, Redis, and Kafka — started together with Docker Compose. Dashboard auth is for signing into Sentinel; it is separate from service API keys used by agents.

---

## Table of contents

1. [What Sentinel does](#what-sentinel-does)
2. [Domain model](#domain-model)
3. [Architecture](#architecture)
4. [Repository layout](#repository-layout)
5. [Components in detail](#components-in-detail)
6. [Quick start](#quick-start)
7. [How to use](#how-to-use)
8. [Local development](#local-development)
9. [Configuration & defaults](#configuration--defaults)
10. [Monitoring & load testing](#monitoring--load-testing)
11. [Tech stack](#tech-stack)
12. [Future work (TODOs)](#future-work-todos)

---

## What Sentinel does

| Capability | Description |
| ---------- | ----------- |
| **Endpoint discovery** | Learns routes from live traffic (method + path template), not from a manual catalog |
| **Request observability** | Stores per-request outcome data (status, latency, sizes, identity) without bodies/headers |
| **Analytics** | Aggregates volume, latency, and errors at tenant / product / service / endpoint levels |
| **Multi-tenant catalog** | Companies (tenants) → products → services, managed in the UI or Control API |
| **RBAC** | Platform admins across all tenants; tenant roles with scopes (tenant / product / service) |

### How client apps plug in

Each deployable API surface registers as a **service** and pushes data via an agent/middleware:

- Microservice → one Sentinel service  
- Monolith → one Sentinel service (the whole app)

Services authenticate to **ingest** with a **service API key**. Humans use **dashboard login**. Do not mix those.

Agents should call ingest only:

- `POST /v1/instances` — register an instance  
- `POST /v1/instances/{id}/heartbeat` — keep it alive  
- `POST /v1/events` — batched runtime request events  

Prefer batching events (interval or N requests) rather than one HTTP call per request. Events carry the raw request `path`; the **worker** derives `path_template` and upserts endpoints.

### Hosting modes

| Mode | Who runs it | Tenants |
| ---- | ----------- | ------- |
| **SaaS** | Sentinel operator | Many companies |
| **Self-host** | Customer | One company |

Same product and data model — only the number of tenants changes.

---

## Domain model

```
Tenant (company)
  └── Product
        └── Service          ← registration & ingest happen here
              ├── API key(s)
              ├── Instances (agent runtimes)
              ├── Endpoints (learned from traffic)
              └── Request logs / analytics
```

| Concept | Meaning |
| ------- | ------- |
| **Tenant** | Company / account |
| **Product** | Business grouping (e.g. Checkout) |
| **Service** | One deployable API (microservice or monolith) |
| **API key** | Auth for agents talking to ingest (one active key per service in v1) |
| **Instance** | A running agent process for a service |
| **Endpoint** | Learned `(method, path_template)` for a service |
| **Request log** | One stored call outcome linked to an endpoint |
| **Analytics** | Rollups (minute / hour / day) plus status breakdowns |

**UI lenses** over the same tree: service-wise, product-wise, or overall (whole tenant).

### People & access

| Who | Scope |
| --- | ----- |
| **Platform admin** (`is_sentinel_admin`) | All tenants; manage companies |
| **Tenant users** | One company (`users.tenant_id`) |

Roles are named groups of users with shared access. Effective access is the **union** of a user’s roles’ permissions and scopes (`READ` / `READ_AND_WRITE` / `ALL` at tenant, product, or service scope).

---

## Architecture

```
Client apps (agents)
        │  service API key
        ▼
   ┌─────────┐     Kafka      ┌─────────┐
   │  Ingest │ ─────────────► │ Worker  │ ──► Postgres
   └─────────┘  request-events└─────────┘     (endpoints, logs, analytics)
        │                          │
        └──── analytics-deltas ────┘

People ──► UI (React) ──► Control API (server) ──► Postgres / Redis
```

| Deployable | Port | Responsibility |
| ---------- | ---- | -------------- |
| **Ingest** | 8081 | Hot path: API-key auth, instance register/heartbeat, accept batched events, publish to Kafka, return fast |
| **Worker** | 8082 | Consume Kafka: derive path templates, upsert endpoints, write `request_logs`, upsert analytics |
| **Control API** (`server`) | 8080 | Dashboard backend: tenants, users, roles, products, services, keys, endpoint/log/analytics reads; owns schema via Liquibase |
| **UI** (`client`) | 3000 | React dashboard for humans |

Schema migrations run on **server only**. Ingest and worker use `ddl-auto: validate` against the same Postgres database.

---

## Repository layout

```
Sentinel/
├── common/          Shared jar: entities, repos, Kafka DTOs, path/crypto utils
├── server/          Control API (Spring Boot) + Liquibase migrations
├── ingest/          Ingest service (Spring Boot)
├── worker/          Worker service (Spring Boot)
├── client/          React + TypeScript dashboard (Vite)
├── tools/loadlab/   Seed catalog + k6 load UI against ingest
├── monitoring/      Prometheus scrape config + Grafana provisioning
├── docker-compose.yml
└── pom.xml          Maven multi-module reactor
```

Maven modules: `common`, `server`, `ingest`, `worker`. Docker images for the Java apps build from the **repo root** context so `common` is on the classpath.

---

## Components in detail

### `common`

Shared library (not a deployable). Used by server, ingest, and worker.

- JPA entities & repositories for API keys, instances, endpoints, request logs, analytics
- Kafka message types (`RequestEventMessage`, analytics delta messages)
- `PathTemplateDeriver` — turns raw paths into templates (UUID/numeric segments → `{id}`)
- `Sha256Hasher` — API key hashing for lookup

### `server` (Control API)

Dashboard backend for humans (JWT). Owns the database schema.

**Auth**

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/refresh-token` | Refresh access token (HttpOnly cookie) |
| `POST` | `/api/auth/logout` | End session |
| `GET` | `/api/auth/profile` | Current user |
| `POST` | `/api/auth/change-password` | Change password |

Access token (~15m) lives in client memory (Redux). Refresh token (~2h) is an HttpOnly cookie, also stored in the DB.

**Catalog & access**

| Area | Base path |
| ---- | --------- |
| Tenants | `/api/tenants` |
| Users | `/api/users` |
| Roles (+ scopes) | `/api/roles` |
| Products | `/api/products` |
| Services | `/api/products/{productId}/services`, `/api/services/search` |
| Service API keys | `/api/products/{productId}/services/{serviceId}/api-keys` |

**Observability reads**

| Area | Base path |
| ---- | --------- |
| Endpoints | `/api/services/{serviceId}/endpoints` |
| Request logs | `/api/logs/requests` |
| Analytics | `/api/analytics` (summary, timeseries, rankings, status/exception breakdowns) |

Liquibase changelogs live under `server/src/main/resources/db/changelog/`.

### `ingest`

Agent-facing hot path. Authenticates with `Authorization: Bearer <raw-api-key>` (SHA-256 lookup of active keys). Caches key/service/instance checks (Caffeine, ~60s TTL).

| Method | Path | Result |
| ------ | ---- | ------ |
| `POST` | `/v1/instances` | Register instance → `201` with `{ id }` |
| `POST` | `/v1/instances/{instanceId}/heartbeat` | Touch `last_seen_at` → `204` |
| `POST` | `/v1/events` | Batch of 1–500 events → `202`; publish to Kafka |

**Event fields (required):** `serviceInstanceId`, `method`, `path`, `occurredAt`, `statusCode`, `durationMs`, `endUserIp`, `requestSizeBytes`, `responseSizeBytes`  
**Optional:** `requestId`, `userId`

Kafka topics (created/configured by ingest):

- `sentinel.request-events` (partition key: `serviceId`)
- `sentinel.analytics-deltas` (batched analytics flush)

Does **not** write endpoints or request logs synchronously.

### `worker`

Consumes Kafka and persists observability data.

1. Read `sentinel.request-events`
2. Derive `path_template` from raw `path`
3. Upsert endpoint on `(service_id, method, path_template)`
4. Insert `request_logs`
5. Upsert analytics (minute / hour / day stats; status metrics)

Consumer group: `sentinel-worker`. Batch listener; concurrency configurable (default 6).

### `client` (UI)

React 19 + TypeScript + Vite dashboard.

| Area | Who | What |
| ---- | --- | ---- |
| Login / profile | Everyone | Auth and account |
| Tenants | Platform admin | Create/manage companies |
| Products & services | Tenant users / admin | Catalog |
| API keys | Tenant users / admin | Issue/revoke service keys |
| Users & roles | Tenant users / admin | Membership and RBAC |
| Analytics | Tenant users / admin | Charts: volume, latency, errors |
| Logs | Tenant users / admin | Search individual requests |
| Settings | Authenticated | App/settings surface |

Stack highlights: Redux Toolkit, TanStack Query, React Router, Tailwind CSS, Axios, Recharts, Zod + React Hook Form.

### Infrastructure (Compose)

| Service | Host URL | Notes |
| ------- | -------- | ----- |
| Client | http://localhost:3000 | Nginx-served production build in Compose |
| Loadlab | http://localhost:3100 | Catalog seed + k6 load UI |
| Server | http://localhost:8080 | Control API |
| Ingest | http://localhost:8081 | Agent API |
| Worker | http://localhost:8082 | Kafka consumer |
| Postgres | localhost:5432 | DB `sentinel` / user `sentinel` / password `sentinel` |
| Redis | localhost:6379 | Used by server (sessions / support) |
| Kafka | localhost:9092 (in-network); host often `localhost:29092` for local Maven apps | Single-node KRaft |

Postgres data persists in the Docker volume `postgres_data`.

---

## Quick start

**Prerequisites:** Docker Desktop (or compatible Compose engine).

```bash
docker compose up --build
```

Wait until health checks pass, then:

```bash
curl http://localhost:8080/actuator/health   # Control API
curl http://localhost:8081/actuator/health   # Ingest
curl http://localhost:8082/actuator/health   # Worker
```

Open the UI: [http://localhost:3000/login](http://localhost:3000/login)

### Seed login (platform admin)

| Field | Value |
| ----- | ----- |
| Email | `rishabhpndt19@gmail.com` |
| Password | `Admin@123` |

Stop (keep DB volume):

```bash
docker compose down
```

Wipe DB as well:

```bash
docker compose down -v
```

---

## How to use

### 1. Sign in to the dashboard

1. Go to http://localhost:3000/login  
2. Use the seed admin credentials above  
3. As platform admin, create a **tenant**, then (as a tenant-scoped user or while operating in that context) create **products** and **services**

### 2. Create a service API key

In the UI: open a service → **API keys** → create a key.  
The **raw key is shown once** — copy it for your agent. Only a hash is stored.

Via Control API (authenticated as a dashboard user):

`POST /api/products/{productId}/services/{serviceId}/api-keys`

### 3. Register an agent instance

```bash
curl -s -X POST http://localhost:8081/v1/instances \
  -H "Authorization: Bearer <RAW_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response includes `id` — that is your `serviceInstanceId`. Heartbeat periodically:

```bash
curl -s -X POST "http://localhost:8081/v1/instances/<INSTANCE_ID>/heartbeat" \
  -H "Authorization: Bearer <RAW_API_KEY>"
```

### 4. Send request events

```bash
curl -s -X POST http://localhost:8081/v1/events \
  -H "Authorization: Bearer <RAW_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "serviceInstanceId": "<INSTANCE_ID>",
        "method": "GET",
        "path": "/api/orders/550e8400-e29b-41d4-a716-446655440000",
        "occurredAt": "2026-07-27T10:00:00Z",
        "statusCode": 200,
        "durationMs": 42,
        "endUserIp": "203.0.113.10",
        "requestSizeBytes": 128,
        "responseSizeBytes": 2048,
        "requestId": "req-1"
      }
    ]
  }'
```

Expect `202 Accepted`. The worker will:

- Derive path template e.g. `/api/orders/{id}`
- Upsert the endpoint
- Insert a request log
- Update analytics rollups

### 5. Explore in the UI

- **Analytics** — volume, latency, error rates  
- **Logs** — search individual requests  
- Open a **service** to see discovered **endpoints**

### Typical happy path (checklist)

1. `docker compose up --build`  
2. Log in as seed admin  
3. Create tenant → product → service → API key  
4. Register instance + send events (or use Loadlab)  
5. Confirm endpoints / logs / analytics in the UI  

---

## Local development

### Java apps with Maven (infra in Docker)

Start at least Postgres, Kafka, and Redis (and prefer a full `docker compose up` of infra, or run only those services):

```bash
# From repo root — package all apps
./mvnw -pl server,ingest,worker -am package

# Or run individually (separate terminals)
./mvnw -pl server -am spring-boot:run
./mvnw -pl ingest -am spring-boot:run
./mvnw -pl worker -am spring-boot:run
```

Defaults assume Postgres `localhost:5432/sentinel` and Kafka reachable as configured in each module’s `application.yml`. Schema changes still go through **server Liquibase only** — start server before ingest/worker against an empty DB.

### UI locally

```bash
cd client
npm install
npm run dev
```

Point the client at `http://localhost:8080` (see client env / Vite config for API base URL).

### Loadlab locally

See [`tools/loadlab/README.md`](tools/loadlab/README.md). Requires the stack up, Node 18+, and k6 on `PATH` or at `tools/loadlab/.bin/k6`.

```bash
cd tools/loadlab
npm install
npm run dev
```

Open http://localhost:3100 — seed catalog, then start a k6 load against `POST /v1/events`.

---

## Configuration & defaults

| Item | Default |
| ---- | ------- |
| DB name / user / password | `sentinel` / `sentinel` / `sentinel` |
| Server config | `server/src/main/resources/application.yml` |
| Ingest config | `ingest/src/main/resources/application.yml` |
| Worker config | `worker/src/main/resources/application.yml` |
| JWT access / refresh TTL | 15m / 2h |
| Ingest port | 8081 |
| Worker port | 8082 |
| Worker Kafka concurrency | `SENTINEL_WORKER_CONCURRENCY` (default 6) |

Compose overrides datasource/Redis/Kafka hosts via environment variables so containers talk on the Docker network.

Java runtime for Docker images: **Amazon Corretto 21**. Spring Boot **4.1.0**.

---

## Monitoring & load testing

### Prometheus metrics

Ingest and worker expose `/actuator/prometheus`. Scrape config lives in `monitoring/prometheus/prometheus.yml`. Grafana provisioning is under `monitoring/grafana/`.

### Loadlab

[`tools/loadlab`](tools/loadlab) is a Next.js control UI that:

1. Seeds tenants → products → services → API keys → ingest instances  
2. Runs `k6` against ingest events with configurable RPS, error %, and path cardinality  
3. Shows pipeline metrics scraped from ingest/worker actuators  

Also available via Compose on port **3100**.

---

## Tech stack

| Layer | Choices |
| ----- | ------- |
| Backend | Java 21, Spring Boot 4.1, Spring Data JPA, Liquibase, Spring Security (JWT), Spring Kafka, Caffeine |
| Shared DB | PostgreSQL 16 |
| Cache / support | Redis 7 (server) |
| Messaging | Apache Kafka 3.9 (KRaft) |
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, TanStack Query, Tailwind 4, Recharts |
| Packaging | Maven multi-module + Docker Compose |
| Load testing | k6 + Next.js Loadlab |

---

## Future work (TODOs)

Deferred work to finish later for this project:

1. **Admin live dashboard** — Add a Dashboard tab in the Sentinel admin view. Admin login and end-session should navigate there by default. Show how many requests the ingest service is processing, with filters for a particular tenant, product, service, and endpoint. Data should update live over time. Same idea for the consumer/worker: live graphs on the dashboard, filterable by those resources.

2. **Loadlab optional seeding** — On the Loadlab page, seeding data should not always be mandatory. Landing on the page should allow starting load directly without requiring a seed step first.

3. **Frontend authorization by scopes** — Implement proper frontend authorization based on scopes (UI currently does not enforce this well).

4. **Backend scope enforcement** — Ensure all resource-level scopes and normal scopes are used correctly. List, get, and other APIs should only allow fetching or changing resources the caller has scopes for.

5. **Settings page** — Improve the frontend settings page and add more functionality.

6. **Forgot password + email service** — Support forgot password on the frontend, integrated with an email service. Backend needs tables and APIs for reset flow; the email link opens a UI URL for reset. Ship a complete email service: send on user account creation and other important events (email work is send-only; auth/reset logic stays in APIs + UI).

7. **Hide Tenants tab in tenant session** — When a Sentinel admin is operating inside a selected tenant session, the Tenants tab should not be visible (tenants management is platform-admin only outside a tenant context).

---

## Notes

- Agents talk to **ingest**; humans talk to **server** / **UI**.  
- Endpoints are **traffic-learned** — no OpenAPI import in v1.  
- Events store outcomes and sizes, **not** request/response bodies or headers.  
- Prefer soft-disable (`INACTIVE`) over hard-delete when history exists.  
- Design notes and deeper plans (when present locally) live under `docs/plans/`.
