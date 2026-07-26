# Sentinel

API metadata catalog and request observability for your services. Other apps keep their own auth; they report API metadata and runtime request data to Sentinel, which stores it and presents it in the UI (service, product, and overall views).

The repo today is a resume/demo stack: Spring Boot API (`server`), React + TypeScript UI (`client`), PostgreSQL, Redis, and Kafka — started together with Docker Compose. Auth in this stack is for signing into the **Sentinel dashboard**, not for authenticating third-party product users.

## Product vision

### What Sentinel is

- Collects **API metadata** (routes, schemas, service info) from apps in any framework
- Optionally stores **runtime request data** per service for observability
- Shows a clear catalog in the **Sentinel UI**, sliced by service, by product, or combined for the whole company

### How client apps plug in

Each deployable API surface registers as a **service** and pushes data via a thin agent/middleware (or OpenAPI pull later):

- Microservice → one Sentinel service
- Monolith → one Sentinel service (the whole app)

Services authenticate to ingest with a **service API key**. Humans use dashboard login. Do not mix those.

### Hosting

| Mode | Who runs it | Tenants |
|------|-------------|---------|
| **SaaS (you host)** | Sentinel operator | Many companies |
| **Self-host** | Customer | One company |

Same product and data model either way — only the number of tenants changes.

### Hierarchy

```
Tenant (company)
  └── Product
        └── Service          ← registration & ingest happen here
              └── Endpoints / metadata
              └── Runtime requests (optional)
```

- **Tenant** — company/account
- **Product** — business grouping (e.g. Checkout)
- **Service** — one deployable API (microservice or monolith)
- **Registration** is at the **service** level (each API gets its own key)

UI lenses over the same tree: **service-wise**, **product-wise**, or **overall** (whole tenant).

### Dashboard access (people)

| Who | Scope |
|-----|--------|
| **Platform admin** | All tenants (SaaS); manage companies |
| **Tenant users** | One company only |

**Roles (no separate teams):** a role is a named group of users with shared access.

- **v1:** fixed tenant-wide roles — admin / editor / viewer
- **v2:** custom roles per tenant with scope (whole tenant / product / service) and permission (`view` / `edit` / `admin`)

Platform admin manages tenants; tenant admins manage users and roles.

### Target backend architecture

With full runtime request capture, plan on **three backend deployables** plus the UI:

```
Client apps ──► Ingest ──► Kafka ──► Workers ──► DB / storage
                              │
People ──► UI ──► Control API ┘
```

| Deployable | Responsibility |
|------------|----------------|
| **Ingest** | Hot path: service-key auth, register/heartbeat instances (sync DB), accept batched request events, publish to Kafka, return fast |
| **Worker(s)** | Consume Kafka: derive path templates, upsert endpoints, persist `request_logs` (scale with lag) |
| **Control API** | Dashboard backend: tenants, users, roles, products, services, catalog reads |
| **UI** | React app for humans |

Agents should call ingest (`POST /v1/instances`, `/v1/instances/{id}/heartbeat`, `/v1/events`), not the human control/UI APIs. Early demos may run Control + Ingest in one process; keep the logical split so extracting ingest later is easy.

Agents should **batch** runtime events (interval or N requests) rather than one HTTP call per request when possible. Events carry raw request `path`; the worker derives `path_template` and upserts endpoints.

---

## Current demo stack

| Service   | URL / port              | How it runs |
|-----------|-------------------------|-------------|
| Client    | http://localhost:3000   | Docker Compose |
| Server    | http://localhost:8080   | Docker Compose (or local Maven) |
| Ingest    | http://localhost:8081   | Local Maven only (for now) |
| Worker    | http://localhost:8082   | Local Maven only (for now) |
| Postgres  | localhost:5432          | Docker Compose |
| Redis     | localhost:6379          | Docker Compose |
| Kafka     | localhost:9092          | Docker Compose |
| Kafka UI  | http://localhost:8090   | Docker Compose |

- **server**: Spring Boot (Amazon Corretto 21), Maven, Postgres + Redis + Kafka, JWT auth (dashboard); owns schema via Liquibase
- **ingest** (`sentinel-ingest`): Spring Boot — shared Postgres + Kafka; no Liquibase; service-key auth + instance/event APIs (see `docs/plans/ingest.md`); run locally
- **worker** (`sentinel-worker`): Spring Boot skeleton — shared Postgres + Kafka; no Liquibase; run locally
- **client**: React + TypeScript (Vite), Redux, React Query, Tailwind, Axios
- Postgres data is stored in the Docker volume `postgres_data`
- Docker packaging for ingest/worker is deferred; they are not in `docker-compose.yml` yet

## Start

With Docker Desktop running:

```bash
docker compose up --build
```

Health check:

```bash
curl http://localhost:8080/actuator/health
```

### Run ingest / worker locally

With Compose infra up (at least Postgres + Kafka), from separate terminals:

```bash
cd ingest && ./mvnw spring-boot:run
cd worker && ./mvnw spring-boot:run
```

```bash
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
```

Defaults: Postgres `localhost:5432/sentinel`, Kafka `localhost:9092`. Schema changes still go through **server** Liquibase only.

### Seed login

- Email: `rishabhpndt19@gmail.com`
- Password: `Admin@123`
- UI: http://localhost:3000/login

Auth APIs: `POST /api/auth/login`, `POST /api/auth/refresh-token`, `POST /api/auth/logout`, `GET /api/auth/profile`  
Postman: [`postman/Auth.postman_collection.json`](postman/Auth.postman_collection.json)

Stop (keep DB volume):

```bash
docker compose down
```

Wipe DB volume as well:

```bash
docker compose down -v
```

## Local defaults

- DB name / user / password: `sentinel` / `sentinel` / `sentinel`
- Server config: `server/src/main/resources/application.yml` (env overrides in Compose)
- Ingest / worker configs: `ingest/src/main/resources/application.yml`, `worker/src/main/resources/application.yml`

## Notes

- Server Docker image uses **Amazon Corretto 21**.
- Spring Boot **4.1.0**; schema via **server Liquibase** only (ingest/worker use `ddl-auto: validate`, no migrations).
- Access token (15m) in Redux memory; refresh (2h) in HttpOnly cookie + DB.
- Ingest / worker apps exist as local skeletons; request-event produce/consume logic comes later.
