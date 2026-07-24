# Profile — schema & contract

**Status:** frozen  
**Parent:** extends existing [auth](auth.md) feature (no new tables)

## Requirements summary

Authenticated user can load a richer profile payload for the profile page (separate from thin session `/me`).

- Endpoint only when logged in (Bearer access token), same auth model as `GET /api/auth/me`
- Returns identity fields plus status, timestamps, and active roles/permissions
- Read-only for now — no update endpoint
- Keep `GET /api/auth/me` unchanged for session bootstrap

## Schema

No Liquibase / DDL changes. Uses existing `users` + role/permission joins.

### users (relevant columns)
| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | UUID | NO | PK — from JWT principal |
| email | VARCHAR | NO | |
| display_name | VARCHAR | NO | |
| status | VARCHAR | NO | `ACTIVE` / `INACTIVE` |
| created_at | TIMESTAMPTZ | NO | |
| updated_at | TIMESTAMPTZ | NO | |

## API contract

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| GET | `/api/auth/profile` | Bearer access | — | `200` `ProfileResponse` |

### Response DTO

`ProfileResponse` (`auth/dto`):
- `user` — `UserProfileResponse`: `id`, `email`, `displayName`, `status`, `createdAt`, `updatedAt`
- `roles` — `List<RoleSummaryResponse>` (reuse; active roles + active permissions only)

### Errors
| Case | Status | Notes |
|------|--------|-------|
| Missing / invalid access token | 401 | security filter / `UnauthorizedException` |
| User missing / inactive (edge) | 401 | same as `/me` |

## Controller

- Extend existing `AuthController`
- `@GetMapping("/profile")`
- `@AuthenticationPrincipal UserPrincipal principal`
- Call `authFacade.profile(principal.getId())` → `ApiResponses.ok(...)`

**SecurityConfig:** no change — covered by authenticated requests (same as `/me`)

## Facade / mapper

- `AuthFacade.profile(UUID userId)` — `userService.findByIdWithAuthorities` → `AuthMapper.toProfileResponse`
- Reuse role filtering already used by `toMeResponse`

## Decisions (frozen)

| # | Topic | Decision |
|---|-------|----------|
| 1 | New vs extend `/me` | New `GET /api/auth/profile` so profile can grow independently |
| 2 | Profile UI | Read-only (name, email, status, dates, roles) + change-password modal |
| 3 | Change password confirm | Client-only; API unchanged |
| 4 | Success feedback | **sonner** via shared `toast.promise` (loading → success/error); client validation stays inline; color scheme for success/error/loading/action/cancel |

## Out of scope

- Edit display name / email
- Expanding `/me` payload
- Forgot / reset password
