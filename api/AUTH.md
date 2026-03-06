# MIRA API — Authentication Architecture

## Overview

MIRA uses a **self-contained custom auth** system built in Go. There is **no dependency on Supabase Auth (GoTrue)**. Authentication is handled entirely by the API:

```
POST /login
  └─ Query public.users by email (GORM)
  └─ Verify password with bcrypt
  └─ Return a self-signed HS256 JWT (24h expiry)

Protected Routes
  └─ AuthMiddleware validates the JWT using JWT_SECRET
  └─ Injects user_id into request context
```

---

## Why Not Supabase Auth?

| | Supabase Auth | Custom Go Auth |
|---|---|---|
| Users stored in | `auth.users` (managed) | `public.users` (your table) |
| Local dev requires | Full Supabase stack (~13 containers) | Just Postgres |
| Cloud (production) | Supabase GoTrue service | Same Go code, any Postgres |
| Password hashing | GoTrue internal | `bcrypt` (cost 12) |
| Token format | Supabase JWT | Custom HS256 JWT |

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | HS256 signing secret — **must be the same on all instances** |
| `SUPABASE_URL` | Still used for storage features (not auth) |

### Local (`.env.local`)
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
JWT_SECRET="mira-local-dev-secret-at-least-32-chars!"
```

### Production (`.env.production`)
```env
DATABASE_URL="postgresql://postgres.<ref>:<password>@<host>/postgres"
JWT_SECRET="REPLACE_WITH_STRONG_RANDOM_SECRET_IN_PRODUCTION"
```

> ⚠️ **Never commit a real `JWT_SECRET` to git.** All `*.env.*` files (except `.env.local`) are in `.gitignore`.

---

## Creating Users Locally

### Option A — Seed SQL (recommended)

Run `supabase/seed.sql` in Supabase Studio SQL Editor (`http://127.0.0.1:54323`):
- Creates `Admin` and `Staff` roles
- Creates `admin@mira.com` with password `password123`

### Option B — Hash a custom password

Use Go to generate a bcrypt hash, then insert manually:

```go
// Quick one-liner to generate a hash (run as a Go script or test)
hash, _ := bcrypt.GenerateFromPassword([]byte("yourpassword"), 12)
fmt.Println(string(hash))
```

Then insert into `public.users`:
```sql
INSERT INTO users ("id","email","fullName","password","department","roleId","phoneNumber","status","createdAt")
VALUES (gen_random_uuid(), 'you@example.com', 'Your Name', '<hash>', 'IT', '1', '09000000000', 'active', now());
```

---

## Daily Development Workflow

```powershell
# Terminal 1 — Start local database
supabase start         # First time or after reboot
                       # (Or just: docker start mira-db if using plain Docker Postgres)

# Terminal 2 — Start Go API
cd api
air

# Terminal 3 — Start web frontend
cd web
bun dev-turbo
```

## Switching Between Local and Cloud

| Target | Action |
|---|---|
| Local | `api/.env.local` — uses `127.0.0.1:54322` |
| Cloud | Copy `api/.env.production` contents into `api/.env.local` |

---

## Token Lifecycle

- **Issued:** On successful `POST /login` — valid for **24 hours**
- **Validated:** On every protected route by `AuthMiddleware`
- **Revoked:** Client discards the token on logout (`POST /logout` is stateless)
- **Future enhancement:** Add a Redis-backed denylist for server-side revocation if needed
