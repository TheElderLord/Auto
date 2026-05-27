# Auto Parts Platform — Rebuild

A clean TypeScript rebuild of the legacy PHP auto-parts ecommerce and admin platform.

The legacy PHP project remains in `../testparts` and should be used as a feature and data reference, not as the foundation for new code.

## Apps & Packages

- `apps/api` — NestJS API
- `apps/web` — Next.js storefront and admin frontend
- `apps/worker` — background worker for imports, sync, and notifications
- `packages/contracts` — shared API/domain response types
- `packages/db` — Prisma schema, migrations, and database helpers
- `packages/ui` — shared UI components
- `packages/config` — shared config/env validation
- `docker-compose.yml` — local PostgreSQL and Redis
- `.env.example` — local environment template

## Architecture Docs

- `docs/handoffs/claude-context.md` — implementation handoff
- `docs/architecture/overview.md` — target architecture and boundaries
- `docs/architecture/backend-structure.md` — NestJS structure rules
- `docs/architecture/data-model-notes.md` — data model notes
- `docs/implementation/phases.md` — phased delivery plan
- `docs/legacy-analysis/project-summary.md` — legacy system summary

## Requirements

- Node.js 20+
- npm
- Docker (for local PostgreSQL and Redis)

## Local Setup

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev:api
npm run dev:web
```

API: `http://localhost:3000` — health check: `curl http://localhost:3000/api/health`

Web: `http://localhost:3001`
