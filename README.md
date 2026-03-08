# E-Commerce Project

Monorepo structure:

- `ecommerce-backend` - Spring Boot API (`http://localhost:8080`)
- `ecommerce-frontend` - React app (`http://localhost:3000`)

## Run

Prerequisite:
- PostgreSQL server/service must be running locally (no Docker required).

### Backend

```powershell
cd ecommerce-backend
.\mvnw.cmd spring-boot:run
```

### Frontend

```powershell
cd ecommerce-frontend
npm.cmd install
npm.cmd start
```

## Current API Security

- Public: `GET /api/products/**`, `POST /api/auth/register`, `POST /api/auth/login`
- Admin only: `POST/PUT/DELETE /api/products/**`
- Protected: other `/api/**` endpoints
- Dev admin credentials: `admin / admin123`

## Development Plan

Detailed MVP scope and execution order:

- `docs/MVP_PLAN.md`
