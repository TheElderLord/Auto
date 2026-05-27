# Auto Parts Supplier Integrations

Use this skill when implementing supplier search, availability sync, supplier order automation, or adapter interfaces.

## Triggers

- Work touches supplier APIs.
- Work touches article search across external providers.
- Work touches supplier-side cart/order/status automation.
- Work references `supplier_handlers` in the legacy app.

## Required Context

Read first:

- `docs/architecture/overview.md`
- `docs/legacy-analysis/project-summary.md`

Reference legacy path:

- `../testparts/content/shop/docpart/suppliers_handlers`

## Adapter Design

Each supplier should sit behind an adapter interface. Do not let supplier-specific request/response shapes leak into catalog, cart, or order modules.

Suggested capabilities:

- `searchByArticle`
- `getManufacturers`
- `createSupplierOrder`
- `cancelSupplierOrder`
- `syncSupplierOrderStatus`

Only implement capabilities the supplier actually supports.

## Rules

- Use timeouts for all supplier HTTP calls.
- Normalize all supplier responses into internal DTOs.
- Persist raw request/response payloads only where useful for debugging/audit.
- Add retry/backoff for transient failures.
- Never hardcode supplier credentials.
- Keep per-supplier configuration in the database or validated env, depending on business needs.
- Implement one supplier end-to-end before adding many partial integrations.

## Verification

- Add adapter unit tests with fixture responses.
- Add integration tests only when credentials/sandboxes are available.
- Include failure cases: timeout, malformed response, unavailable item, price changed.

