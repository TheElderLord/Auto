# Auto Parts Data Modeling

Use this skill when designing Prisma models, migrations, seed data, or migration scripts from the legacy database.

## Triggers

- Adding or changing `packages/db/prisma/schema.prisma`.
- Creating catalog, inventory, pricing, cart, order, import, supplier, user, or office models.
- Writing migrations or seed data.
- Mapping legacy SQL tables to new entities.

## Required Context

Read first:

- `docs/architecture/data-model-notes.md`
- `docs/legacy-analysis/project-summary.md`

Reference:

- `../testpart_admins_2024-12-23_14-34-29.sql`

## Modeling Rules

- Design for new workflows first; do not mirror legacy tables one-to-one.
- Preserve legacy IDs with optional `legacyId` fields where migration needs traceability.
- Keep product identity, brand/manufacturer identity, and article normalization explicit.
- Separate product/catalog data from storage-specific stock and supplier-specific price.
- Use reservation records for cart and checkout workflows.
- Keep order status and order item status separate.
- Keep import jobs auditable and append-only where possible.
- Use JSON fields for raw supplier/import payloads only as supporting audit data, not as the primary query model.

## High-Risk Areas

Be especially careful with:

- Stock reservation and release.
- Markup and currency conversion.
- Supplier purchase price versus customer-visible price.
- Order item statuses.
- Price import updates that touch many stock rows.
- User identity by phone/email.

## Verification

For schema work:

- Run Prisma format/generate/migrate when dependencies and database are available.
- Add seed data for realistic domain examples.
- Add tests for calculations or state transitions when logic is introduced.

