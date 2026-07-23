# Sentinel

Resume/demo stack: Spring Boot API (`server`), React + TypeScript UI (`client`), PostgreSQL, Redis, and Kafka — started together with Docker Compose.

## Stack

| Service   | URL / port              |
|-----------|-------------------------|
| Client    | http://localhost:3000   |
| Server    | http://localhost:8080   |
| Postgres  | localhost:5432          |
| Redis     | localhost:6379          |
| Kafka     | localhost:9092          |

- **server**: Spring Boot (Amazon Corretto 21), Maven, Postgres + Redis + Kafka deps
- **client**: React + TypeScript (Vite)
- Postgres data is stored in the Docker volume `postgres_data`

## Start

With Docker Desktop running:

```bash
docker compose up --build
```

Health check:

```bash
curl http://localhost:8080/actuator/health
```

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

## Notes

- Server Docker image uses **Amazon Corretto 21**.
- Spring Initializr generates **Spring Boot 4.1.0**.
- Client does not call the API yet — feature work comes next.
