# Implementation Phases

Build in thin vertical slices. Each phase should leave the system runnable.

## Phase 0: Foundation

Goal: make the monorepo installable, runnable, and ready for domain work.

Tasks:

- Upgrade local runtime to Node.js 20+.
- Install dependencies and commit lockfile.
- Add Prisma to `packages/db`.
- Add shared config validation to `packages/config`.
- Wire Nest API to config package.
- Add base logger, request ID, global validation pipe, and exception filter.
- Confirm API health endpoint and web app run locally.

## Phase 1: Catalog Foundation

Goal: searchable product and article base without full ecommerce flow.

Tasks:

- Create catalog schema: brand, article, product, category, product image.
- Add seed data based on a few legacy sample products.
- Add API endpoints for article search and product detail.
- Add basic storefront search UI wired to API.
- Add admin read-only product list.

## Phase 2: Inventory and Pricing

Goal: represent stock by storage and compute customer-visible price.

Tasks:

- Create office, storage, stock item, currency, markup rule models.
- Implement price calculation service.
- Add tests for markup and currency conversion.
- Display availability and price in storefront search results.

## Phase 3: Cart and Checkout

Goal: customer can reserve available stock and create an order.

Tasks:

- Create cart, cart item, stock reservation models.
- Implement add-to-cart with transaction-safe reservation.
- Implement checkout with order and order item creation.
- Add tests for stock reservation, release, and checkout race conditions.

## Phase 4: Admin Operations

Goal: manager can operate the core business.

Tasks:

- Admin auth and roles.
- Product/category management.
- Storage and stock management.
- Order list/detail/status updates.
- User/customer management.

## Phase 5: Price Imports

Goal: replace the legacy Python price import flow.

Tasks:

- Upload import file to storage.
- Define column mapping.
- Parse CSV/TXT/XLS/XLSX in worker.
- Validate rows and report row-level errors.
- Apply stock/price updates transactionally in batches.
- Keep import history and logs.

## Phase 6: Supplier Integrations

Goal: integrate only active suppliers first.

Tasks:

- Inventory current supplier usage from legacy and business input.
- Define supplier adapter interface.
- Implement one supplier end-to-end.
- Add retry, timeout, and observability.
- Add supplier search result normalization.

## Phase 7: External Systems

Goal: add necessary production integrations.

Candidate integrations:

- 1C
- Ucats/UCatalog
- SMS
- Email notifications
- Payments
- Delivery
- KKT/fiscal checks

Only build integrations that are confirmed necessary for launch.

