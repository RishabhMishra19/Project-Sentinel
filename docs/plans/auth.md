# Auth feature — schema & contract

## Requirements summary

JWT auth with users, roles, permissions. APIs only: `login`, `refresh-token`, `logout`, `me`.

- Access token: 15 minutes (frontend memory / Redux)
- Refresh token: 2 hours (HttpOnly cookie + hashed row in DB, statuses `ACTIVE` | `REVOKED` | `EXPIRED`)
- Seed user: `rishabhpndt19@gmail.com` / `Admin@123` / display name `Sentinel`
- Seed role `SENTINEL_USER` + permission `ALL` (`created_by` / `updated_by` = seed user)
- Liquibase: single formatted SQL changelog (`db.changelog-master.sql`), UUIDs via `gen_random_uuid()`

## Schema

### users
| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | UUID | NO | PK |
| email | VARCHAR(255) | NO | unique |
| password_hash | VARCHAR(255) | NO | BCrypt |
| display_name | VARCHAR(255) | NO | |
| status | VARCHAR(32) | NO | ACTIVE, INACTIVE (DB only; not in API DTOs) |
| created_at | TIMESTAMPTZ | NO | |
| updated_at | TIMESTAMPTZ | NO | |

### roles
| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | UUID | NO | PK |
| name | VARCHAR(255) | NO | unique (no code column) |
| status | VARCHAR(32) | NO | ACTIVE, INACTIVE (DB only) |
| created_by | UUID | NO | FK users |
| updated_by | UUID | NO | FK users |
| created_at | TIMESTAMPTZ | NO | |
| updated_at | TIMESTAMPTZ | NO | |

### permissions
Same shape as roles (name + status + audit FKs).

### user_roles / role_permissions
Composite PK junction tables.

### refresh_tokens
| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | UUID | NO | PK |
| user_id | UUID | NO | FK users |
| token_hash | VARCHAR(255) | NO | unique SHA-256 of opaque token |
| status | VARCHAR(32) | NO | ACTIVE, REVOKED, EXPIRED |
| expires_at | TIMESTAMPTZ | NO | |
| created_at | TIMESTAMPTZ | NO | |
| revoked_at | TIMESTAMPTZ | YES | |

### Seed
User → permission `ALL` → role `SENTINEL_USER` → links; IDs from `gen_random_uuid()`, FKs by email/name.

## API contract

| Method | Path | Auth | Response |
|--------|------|------|----------|
| POST | `/api/auth/login` | public | `LoginResponse` + Set-Cookie refresh |
| POST | `/api/auth/refresh-token` | refresh cookie | `TokenResponse` + rotated Set-Cookie |
| POST | `/api/auth/logout` | cookie | 204, revoke + clear cookie |
| GET | `/api/auth/me` | Bearer access | `MeResponse` |

### Response DTO shapes (no `status` fields)
- `UserSummaryResponse`: id, email, displayName
- `RoleSummaryResponse`: id, name, permissions[]
- `PermissionSummaryResponse`: id, name
- `LoginResponse`: accessToken, expiresIn, user
- `TokenResponse`: accessToken, expiresIn
- `MeResponse`: user, roles

### Internal DTOs (`auth/dto`, not nested in interfaces)
- `AuthLoginResult` — login body + raw refresh for cookie
- `AuthRefreshResult` — token body + raw refresh for cookie
- `RefreshTokenIssue` — raw refresh + persisted `RefreshToken` entity (hash only in DB)

## Server packages

```text
com.sentinel.server
  auth/          # controller, dto, mapper, refresh entity, facade, jwt/refresh core services
  user|role|permission/  # entity, repository, core service
  security/      # SecurityConfig, JwtAuthenticationFilter, UserPrincipal, cookies, JwtProperties
  common/        # exceptions, ApiResponses
```

## Frontend (client)

- Redux: `accessToken`, `user`, `roles`, `meStatus`
- On any new access token → `useLoadCurrentUser` calls `GET /me` and stores user+roles in Redux (not tied to HomePage)
- `ApiManager` wraps HTTP (`get`/`post`/`put`/`patch`/`delete`) over Axios
- Routes: `ProtectedRoute` (auth required), `UnprotectedRoute` (guest only, e.g. login)
- Vite/nginx proxy `/api` → server for same-origin HttpOnly cookies

## Postman

[`postman/Auth.postman_collection.json`](../../postman/Auth.postman_collection.json)

Flows:
1. Success: login → me → refresh-token → me → logout
2. Invalid credentials
3. Validation error
4. Unauthorized me
5. Refresh-token without cookie
