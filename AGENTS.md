# Agent Instructions

This directory is the clean rebuild workspace for the auto-parts ecommerce and admin platform.

## Project Context

- Legacy reference app: `../testparts`
- Legacy database dump: `../testpart_admins_2024-12-23_14-34-29.sql`
- New code belongs in this directory only.
- The legacy PHP app contains ionCube-protected files. Treat it as a product/data reference, not as code to extend.
- Do not copy hardcoded credentials, tokens, SMTP passwords, API keys, or production secrets from the legacy app.

## Preferred Rebuild Direction

Unless the project later defines a different stack, assume this target stack:

- TypeScript
- Next.js for storefront and admin frontend
- NestJS for backend APIs
- PostgreSQL or MySQL for persistence
- Prisma or Drizzle for schema/migrations
- Redis-backed jobs for imports, supplier sync, and background processing
- Separate worker logic for CSV/XLS/XLSX price-list imports

Choose boring, maintainable tools over clever custom infrastructure.

## Product Scope

The system being rebuilt includes:

- Customer storefront for auto-part search, catalog browsing, cart, checkout, and order history
- Admin panel for products, categories, storages, offices, users, orders, returns, finance, and settings
- Price-list upload/import pipeline for CSV, TXT, XLS, and XLSX files
- Supplier availability and price integrations
- VIN request flow
- Notifications through email/SMS integrations
- Optional integrations for 1C, Ucats/UCatalog, payments, delivery, and fiscal/KKT systems

Build incrementally. Do not attempt to reproduce the entire legacy system in one pass.

## Working Rules

- Read existing files before editing.
- Keep changes small and directly tied to the current task.
- Preserve user work and do not revert unrelated changes.
- Do not modify `../testparts` unless the user explicitly asks.
- Use environment variables for secrets and create `.env.example` when needed.
- Add migrations, tests, seed data, and documentation when they are necessary for the change to be usable.
- Prefer domain names from the legacy schema where they clarify migration, but use a cleaner schema when the old one is awkward.
- Before choosing an implementation, check whether an existing local convention has already been established in this new project.
- Keep customer-facing frontend in `apps/web`.
- Keep backend HTTP/domain logic in `apps/api`.
- Keep background job processing in `apps/worker`.
- Keep reusable types, config, UI, and database code in `packages/*`.

## Migration Notes

When designing data models, inspect the legacy SQL dump for field meanings and relationships. Important table groups include:

- `shop_catalogue_*` for products, categories, properties, images, and catalog structure
- `shop_storages*` and `shop_offices*` for stock, storage, office, and markup rules
- `shop_orders*` and `shop_carts*` for cart/order workflows
- `users`, `users_profiles`, `groups`, and `users_groups_bind` for accounts and roles
- `shop_docpart_*` for article search, suppliers, manufacturers, prices, garage, and Ucats-related data

Do not blindly mirror the old schema. Use it to understand behavior, migration requirements, and naming.

## Verification

For code changes:

- Run the narrowest relevant checks first.
- If adding frontend work, run the app and verify the affected screen.
- If adding database logic, run migrations and at least one realistic seed or integration path.
- If checks cannot run, document why in the final response.
