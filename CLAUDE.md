# Claude Code Instructions

This is the new KazParts rebuild workspace.

## Start Here

Before implementation work, read:

1. `docs/handoffs/claude-context.md`
2. `docs/architecture/overview.md`
3. `docs/implementation/next-claude-task.md`

## Available Local Skills

Use these repo-local skills when the task matches their trigger:

- `.claude/skills/kazparts-legacy-analysis/SKILL.md` - understanding old PHP/MySQL behavior
- `.claude/skills/kazparts-architecture-implementation/SKILL.md` - backend, worker, package, and infrastructure implementation
- `.claude/skills/kazparts-data-modeling/SKILL.md` - Prisma schema, migrations, seed data, and legacy mapping
- `.claude/skills/kazparts-price-imports/SKILL.md` - CSV/TXT/XLS/XLSX import pipeline
- `.claude/skills/kazparts-supplier-integrations/SKILL.md` - supplier API adapters and automation
- `.claude/skills/kazparts-frontend-ui/SKILL.md` - storefront and admin frontend work

## Orientation

The old system lives outside this folder:

- Legacy PHP app: `../testparts`
- Legacy SQL dump: `../testpart_admins_2024-12-23_14-34-29.sql`

Use those files to understand features, workflows, database meaning, and migration needs. Do not build new functionality inside the legacy app unless explicitly requested.

Several legacy PHP entry/core files are ionCube-protected, so the old system should be treated as a reference implementation, not as a maintainable base.

## Target Approach

Default to a clean modern rebuild:

- TypeScript-first codebase
- Next.js storefront and admin frontend
- NestJS backend/API layer
- PostgreSQL or MySQL database
- Prisma or Drizzle for schema and migrations
- Background workers for imports, supplier sync, emails/SMS, and long-running jobs
- Environment variables for all secrets

If the repository later establishes a more specific stack, follow the repository over this default.

## Domain Summary

KazParts is an auto-parts ecommerce platform with a large manager/admin surface.

Core workflows:

- Search auto parts by article/brand
- Display prices, availability, delivery timing, supplier/storage data, and analogs/crosses
- Maintain product catalog, categories, properties, images, and special searches
- Upload and process supplier price lists from CSV/TXT/XLS/XLSX files
- Manage carts, checkout, orders, order item statuses, payments, returns, and messages
- Manage users, roles, offices, storages, markups, finance, and settings
- Support VIN requests and customer garage/notepad flows
- Integrate with suppliers, 1C, Ucats/UCatalog, SMS, payments, delivery, and fiscal/KKT systems where required

## Development Rules

- Keep all new application code in this directory.
- Treat `../testparts` and the SQL dump as read-only references unless the user gives explicit permission.
- Never copy credentials or production secrets from legacy config files.
- Prefer simple, testable modules and explicit domain services.
- Keep UI practical and operational. This is a storefront/admin tool, not a marketing landing page.
- Build in phases and keep each phase runnable.
- Document setup steps and required environment variables as the project takes shape.
- Use `apps/web` for Next.js UI, `apps/api` for NestJS APIs, `apps/worker` for background jobs, and `packages/*` for shared code.

## Suggested Build Phases

1. Foundation: app scaffold, database, auth, roles, layout, seed data.
2. Catalog/search: brands, articles, products, categories, stock, basic price search.
3. Commerce: cart, checkout, orders, customer account.
4. Admin: product, storage, office, user, order, and settings management.
5. Imports: supplier price-list upload, column mapping, validation, import jobs.
6. Integrations: active suppliers first, then 1C, Ucats, payments, SMS, delivery, KKT as needed.
7. Migration: scripts to import selected legacy data safely.

## Quality Bar

- Validate inputs at API boundaries.
- Avoid ad hoc string parsing when structured parsers exist.
- Use transactions for cart, reservation, checkout, and import writes.
- Add tests around pricing, reservation, order state transitions, and import parsing.
- Keep generated or imported files out of git unless they are intentional fixtures.
