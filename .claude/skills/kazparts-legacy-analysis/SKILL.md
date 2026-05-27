# KazParts Legacy Analysis

Use this skill when implementation requires understanding behavior from the legacy PHP/MySQL project.

## Triggers

- The task asks how the old system worked.
- The task requires mapping old data to the new schema.
- The task touches catalog, cart, orders, storages, suppliers, imports, users, returns, VIN requests, or integrations.
- A business rule is unclear and may exist in the legacy code or SQL dump.

## Required Context

Read first:

- `docs/legacy-analysis/project-summary.md`
- `docs/architecture/data-model-notes.md`

Reference paths:

- Legacy app: `../testparts`
- SQL dump: `../testpart_admins_2024-12-23_14-34-29.sql`
- Customer shop code: `../testparts/content/shop`
- Admin shop code: `../testparts/admin/content/shop`
- Supplier handlers: `../testparts/content/shop/docpart/suppliers_handlers`
- Price importer: `../testparts/pyprices`

## Rules

- Treat legacy files as read-only unless the user explicitly says otherwise.
- Do not copy secrets from `../testparts/config.php`.
- Do not copy large legacy implementation blocks into the new project.
- Extract product behavior and data semantics, not legacy architecture.
- If a core file is ionCube-protected, document the limitation and infer from routes, database tables, and readable surrounding code.

## Output Expectations

When reporting legacy findings:

- Name the relevant legacy paths.
- State what behavior is confirmed versus inferred.
- Explain what should be implemented in the new system.
- Note migration implications if data is involved.

