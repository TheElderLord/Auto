# Backend Structure

The NestJS API should be organized by business capability, not by technical layer alone.

## Desired API Layout

```txt
apps/api/src/
  main.ts
  app.module.ts
  common/
    decorators/
    errors/
    filters/
    guards/
    interceptors/
    pagination/
    validation/
  infra/
    db/
    logger/
    queue/
    storage/
    http-client/
  modules/
    auth/
    users/
    catalog/
    inventory/
    pricing/
    cart/
    orders/
    returns/
    imports/
    suppliers/
    notifications/
    offices/
    settings/
```

## Module Layout

Each non-trivial module should follow this shape:

```txt
modules/catalog/
  catalog.module.ts
  catalog.controller.ts
  catalog.service.ts
  catalog.repository.ts
  dto/
  entities/        # optional, only if useful
  mappers/         # optional
  tests/
```

Use simpler layouts for small modules. Do not create empty folders just to satisfy a template.

## Controller Rules

Controllers should:

- Define routes.
- Validate request DTOs.
- Read auth context.
- Call services.
- Return response DTOs.

Controllers should not:

- Build SQL.
- Perform price calculations.
- Mutate inventory directly.
- Call supplier APIs directly.
- Contain transaction orchestration.

## Service Rules

Services should:

- Implement application workflows.
- Use repositories for persistence.
- Use transactions for multi-write flows.
- Emit jobs/events where needed.
- Return typed DTOs or domain objects.

Services should avoid importing implementation details from unrelated modules.

## Infrastructure

Infrastructure code should be isolated under `infra/` or `packages/*`.

Examples:

- Prisma client service
- BullMQ queue registry
- S3 client
- HTTP client wrappers
- Logger setup
- Config access

