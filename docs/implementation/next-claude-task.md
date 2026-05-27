# Next Claude Task

## Objective

Turn the scaffold into a runnable foundation with strict config and database infrastructure.

## Required Work

1. Ensure local runtime is Node.js 20+ before installing dependencies.
2. Install workspace dependencies and create the lockfile.
3. Add Prisma to `packages/db`.
4. Create initial Prisma schema using PostgreSQL.
5. Add config validation in `packages/config`.
6. Wire `apps/api` to use validated config.
7. Add Nest global validation pipe and a basic exception filter.
8. Keep `apps/web` runnable on port `3001`.
9. Verify:
   - `npm run build`
   - `npm run test`
   - `npm run dev:api`
   - `npm run dev:web`

## Suggested Initial Prisma Models

Start minimal:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  phone     String?  @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Brand {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id        String   @id @default(cuid())
  name      String
  article   String
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([article])
}
```

These models are intentionally small. Expand only when implementing a real workflow.

## Constraints

- Do not modify `../testparts`.
- Do not copy secrets from legacy config.
- Keep changes inside `this project directory`.
- Prefer boring, explicit code over magic.
- Document any setup requirement in `README.md`.

## Deliverable

A runnable foundation where API, web, database package, and config package build cleanly.

