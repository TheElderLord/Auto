# Architecture Overview

Auto Parts Platform is a clean replacement for the legacy PHP auto-parts ecommerce/admin platform.

The target architecture is a modular monolith with clear internal boundaries. This keeps development fast while preserving a path to split workers, integrations, or search services later if scale requires it.

## Target Stack

- Frontend: Next.js, TypeScript
- Backend API: NestJS, TypeScript
- Worker runtime: TypeScript workers
- Database: PostgreSQL
- ORM/migrations: Prisma, unless a later decision changes this
- Queue: BullMQ with Redis
- Search: PostgreSQL full-text/trigram search first, Meilisearch only after proven need
- Storage: S3-compatible object storage for product images, import files, return images, and documents
- Contracts: shared DTOs/schemas in `packages/contracts`

## Repository Layout

```txt
apps/
  web/        # Next.js storefront and admin UI
  api/        # NestJS HTTP API and domain application services
  worker/     # Background processors for imports, supplier sync, notifications
packages/
  db/         # Prisma schema, migrations, seed scripts, db utilities
  contracts/  # Shared DTOs, API response types, validation schemas
  config/     # Shared env/config validation
  ui/         # Shared UI components once the frontend design system exists
docs/
  architecture/
  legacy-analysis/
  implementation/
  handoffs/
```

## Architectural Rules

- Keep business rules out of controllers and React components.
- API controllers should parse/authorize requests and delegate to application services.
- Application services should coordinate transactions, domain logic, queues, and integrations.
- Database access should go through repositories or Prisma services scoped by module.
- Workers must be idempotent where possible and safe to retry.
- Use transactions for cart, inventory reservation, checkout, order status transitions, and imports.
- External integrations belong behind explicit adapter interfaces.
- Do not put credentials in source code. Use env vars validated at startup.

## Module Boundaries

Initial backend modules:

```txt
auth
users
catalog
inventory
pricing
cart
orders
returns
imports
suppliers
notifications
offices
settings
```

Do not create cross-module imports casually. If one module needs another module's behavior, expose a service method or event/job boundary.

## Data Ownership

- `catalog` owns products, categories, brands, article metadata, product images, and properties.
- `inventory` owns storages, stock records, reservations, and availability.
- `pricing` owns markups, currencies, customer-visible prices, supplier purchase prices, and price calculation rules.
- `cart` owns temporary customer purchase intent and reserved stock before checkout.
- `orders` owns confirmed order records, order item statuses, order logs, messages, and payment state.
- `imports` owns price-list files, column mappings, import jobs, validation results, and import history.
- `suppliers` owns supplier credentials, adapters, supplier search results, and supplier-order automation.

## Scaling Path

Start as one API app, one worker app, one PostgreSQL database, and Redis. Scale in this order:

1. Add indexes and query tuning.
2. Move expensive reads/search to dedicated projections.
3. Increase worker concurrency by queue type.
4. Add Meilisearch for customer/catalog search if PostgreSQL search is not enough.
5. Split high-risk integrations into separate services only after module boundaries are stable.

