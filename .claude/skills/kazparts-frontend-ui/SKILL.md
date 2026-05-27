# Auto Parts Frontend UI

Use this skill when building storefront or admin UI in `apps/web`.

## Triggers

- Work touches `apps/web`.
- Work adds customer storefront screens.
- Work adds admin/manager screens.
- Work introduces shared UI components.

## Required Context

Read first:

- `docs/architecture/overview.md`
- `docs/implementation/phases.md`

## UI Direction

This product is an operational auto-parts ecommerce/admin system. The UI should be practical, dense enough for repeated work, and easy to scan.

Storefront priorities:

- Fast article search.
- Clear brand/manufacturer disambiguation.
- Price, stock, delivery time, and supplier/storage clarity.
- Cart and checkout confidence.

Admin priorities:

- Efficient tables and filters.
- Clear order/item statuses.
- Safe bulk operations.
- Import progress and row-level error review.
- Fast navigation between related records.

## Rules

- Do not build marketing landing pages unless explicitly requested.
- Keep page components focused and move reusable UI into `packages/ui` when reuse is real.
- Keep API response types aligned with `packages/contracts`.
- Handle loading, empty, and error states.
- Avoid oversized hero layouts for admin screens.
- Use stable table/list layouts for operational data.
- Keep text readable on mobile and desktop.

## Verification

When dependencies are installed:

- Run `npm run dev:web`.
- Check the affected route in browser.
- Confirm mobile and desktop layout do not overlap or overflow.

