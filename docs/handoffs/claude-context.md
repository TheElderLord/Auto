# Claude Context Handoff

Use this file as the main starting point when Claude Code begins implementation work.

## Current State

The repository is a new monorepo scaffold for rebuilding Auto Parts.

Created apps:

- `apps/api`: NestJS API scaffold with `/api/health`
- `apps/web`: Next.js App Router frontend scaffold with storefront and admin placeholder pages
- `apps/worker`: TypeScript worker placeholder

Created packages:

- `packages/contracts`
- `packages/db`
- `packages/config`
- `packages/ui`

Runtime expectation:

- Node.js 20+
- PostgreSQL via Docker
- Redis via Docker

Local machine currently reported Node.js `16.20.1` during initial scaffolding, so dependency install/build may fail until Node is upgraded.

## Role Split

- Codex is being used as senior analyst/architect.
- Claude Code is expected to act as senior implementation developer.
- Claude should follow architecture docs and ask only when a product/business decision is missing.

## Must-Read Docs

Read in this order:

1. `CLAUDE.md`
2. `docs/architecture/overview.md`
3. `docs/architecture/backend-structure.md`
4. `docs/architecture/data-model-notes.md`
5. `docs/implementation/phases.md`
6. `docs/implementation/next-claude-task.md`
7. `docs/legacy-analysis/project-summary.md`

## Local Skills

Claude should use repo-local skills from `.claude/skills` when a task matches their trigger:

- `legacy-analysis`
- `architecture-implementation`
- `data-modeling`
- `price-imports`
- `supplier-integrations`
- `frontend-ui`

## Immediate Implementation Direction

Do Phase 0 first:

- Make dependencies install.
- Add Prisma and validated config.
- Wire API cleanly.
- Keep web app runnable.
- Do not begin large domain features until foundation is stable.

## Non-Negotiables

- Do not modify legacy app files in `../testparts`.
- Do not copy legacy secrets.
- Keep new code inside `this project directory`.
- Keep module boundaries clean.
- Use transactions for future inventory/cart/order workflows.
- Prefer explicit, testable code.
