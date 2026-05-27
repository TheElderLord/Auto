---
name: project-kazparts-rebuild
description: KazParts rebuild project — legacy PHP → TypeScript monorepo context, current phase, stack, role split
metadata:
  type: project
---

KazParts is an auto-parts ecommerce platform for Kazakhstan being rebuilt from a legacy PHP/ionCube/MySQL system into a modern TypeScript monorepo.

**Legacy (read-only reference):** `../testparts` — PHP CMS, ~5000 files, ionCube-encrypted core, MySQL (testpart_admins), ~1800 PHP files across admin, api, content, templates, modules, plugins. Python pyprices service for price imports.

**New project:** `/Users/arsen/Desktop/Kazparts/kazparts-rebuild` — TypeScript monorepo scaffold provided by Codex.

**Stack:**
- `apps/api` — NestJS 11, TypeScript 5.7, port 3000
- `apps/web` — Next.js 15, React 19, port 3001
- `apps/worker` — BullMQ + ioredis background processor
- `packages/db` — Prisma (not yet added)
- `packages/config` — env validation (stub)
- `packages/contracts` — shared DTOs
- `packages/ui` — shared UI components (stub)
- PostgreSQL 16 + Redis 7 via Docker

**Current state (as of 2026-05-27):**
- Scaffold exists, NO dependencies installed (node_modules missing)
- Node.js v23.7.0 available (satisfies >=20.0.0)
- No Prisma schema yet
- Phase 0 is the next milestone

**Role split:**
- Codex = senior analyst/architect (provided the scaffold, docs, skills)
- Claude Code = senior implementation developer

**Phase roadmap:**
- Phase 0: Foundation (deps, Prisma, config, wiring, health)
- Phase 1: Catalog (brands, articles, products, search UI)
- Phase 2: Inventory & pricing
- Phase 3: Cart & checkout
- Phase 4: Admin operations
- Phase 5: Price imports
- Phase 6: Supplier integrations
- Phase 7: External systems (1C, Ucats, SMS, payments, KKT)

**Key docs:**
- `CLAUDE.md`, `AGENTS.md`
- `docs/handoffs/claude-context.md`
- `docs/architecture/overview.md`
- `docs/architecture/backend-structure.md`
- `docs/architecture/data-model-notes.md`
- `docs/implementation/phases.md`
- `docs/implementation/next-claude-task.md`

**Local skills available:**
- kazparts-legacy-analysis
- kazparts-architecture-implementation
- kazparts-data-modeling
- kazparts-price-imports
- kazparts-supplier-integrations
- kazparts-frontend-ui

**Why:** Clean rebuild required because legacy core files are ionCube-encrypted and unmaintainable.
**How to apply:** Always start from docs/architecture and follow the phase plan. Use local skills for domain-specific tasks. Never touch ../testparts.
