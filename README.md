# KazParts Rebuild

New project workspace for rebuilding the KazParts auto-parts ecommerce and admin platform.

The legacy PHP project remains in `../testparts` and should be used as a feature and data reference, not as the foundation for new code.

## Current Scaffold

- `apps/api` - NestJS API application
- `apps/web` - Next.js storefront and admin frontend
- `apps/worker` - background worker entrypoint for imports, sync, and notifications
- `packages/contracts` - shared API/domain response types
- `packages/db` - future Prisma schema, migrations, and database helpers
- `packages/ui` - future shared UI components
- `packages/config` - future shared config/env validation
- `docker-compose.yml` - local PostgreSQL and Redis services
- `.env.example` - local environment template

## Architecture Docs

- `docs/handoffs/claude-context.md` - implementation handoff for Claude Code
- `docs/architecture/overview.md` - target architecture and boundaries
- `docs/architecture/backend-structure.md` - NestJS structure rules
- `docs/architecture/data-model-notes.md` - legacy-to-new data model notes
- `docs/implementation/phases.md` - phased delivery plan
- `docs/implementation/next-claude-task.md` - next implementation task
- `docs/legacy-analysis/project-summary.md` - legacy system summary

## Claude Skills

Repo-local Claude skills live in `.claude/skills`. They describe how Claude should approach legacy analysis, architecture work, data modeling, price imports, supplier integrations, and frontend UI implementation.

## Requirements

- Node.js 20+
- npm
- Docker, for local PostgreSQL and Redis

## Local Setup

```bash
cp .env.example .env
npm install
docker compose up -d
npm run dev:api
npm run dev:web
```

The API listens on `http://localhost:3000` by default. Health check:

```bash
curl http://localhost:3000/api/health
```

The web app listens on `http://localhost:3001` by default.
