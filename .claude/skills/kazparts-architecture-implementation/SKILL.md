# Auto Parts Architecture Implementation

Use this skill when adding or restructuring backend, worker, package, or shared infrastructure code.

## Triggers

- Adding a NestJS module.
- Adding Prisma/database infrastructure.
- Adding queue/worker infrastructure.
- Adding config, logging, error handling, validation, or shared contracts.
- Moving code between `apps/*` and `packages/*`.

## Required Context

Read first:

- `docs/architecture/overview.md`
- `docs/architecture/backend-structure.md`
- `docs/implementation/phases.md`

## Architecture Rules

- Keep the system as a modular monolith until there is a proven need to split services.
- Keep HTTP controllers thin.
- Put workflow orchestration in services.
- Put persistence behind repositories or explicit Prisma services.
- Put reusable infrastructure under `apps/api/src/infra` or `packages/*`.
- Put background processing in `apps/worker`.
- Use `packages/contracts` for shared DTOs/types/schemas.
- Use `packages/config` for environment validation.
- Use `packages/db` for Prisma schema, migrations, seeds, and database client helpers.

## NestJS Module Pattern

Prefer this shape for real modules:

```txt
modules/<domain>/
  <domain>.module.ts
  <domain>.controller.ts
  <domain>.service.ts
  <domain>.repository.ts
  dto/
  tests/
```

Do not create empty folders unless the implementation needs them now.

## Verification

After architecture changes, run the narrowest relevant checks:

- JSON/config parse if dependencies are not installed.
- `npm run build` when dependencies are installed.
- `npm run test` when tests exist.

If Node is still below version 20, document that full verification is blocked.

