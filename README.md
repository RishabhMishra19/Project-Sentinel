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

- **server**: Spring Boot (Amazon Corretto 21), Maven, Postgres + Redis + Kafka, JWT auth
- **client**: React + TypeScript (Vite), Redux, React Query, Tailwind, Axios
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

### Seed login

- Email: `rishabhpndt19@gmail.com`
- Password: `Admin@123`
- UI: http://localhost:3000/login

Auth APIs: `POST /api/auth/login`, `POST /api/auth/refresh-token`, `POST /api/auth/logout`, `GET /api/auth/me`  
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

## Notes

- Server Docker image uses **Amazon Corretto 21**.
- Spring Boot **4.1.0**; schema via **Liquibase**.
- Access token (15m) in Redux memory; refresh (2h) in HttpOnly cookie + DB.
