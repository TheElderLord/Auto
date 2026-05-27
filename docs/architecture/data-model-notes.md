# Data Model Notes

These notes translate the legacy database into a cleaner future model. They are not a final schema.

## Legacy Reference

Inspect:

- `../testpart_admins_2024-12-23_14-34-29.sql`
- `../testparts/admin/content/shop`
- `../testparts/content/shop`
- `../testparts/pyprices`

Important legacy table groups:

- `shop_catalogue_*`
- `shop_products_*`
- `shop_storages*`
- `shop_offices*`
- `shop_carts*`
- `shop_orders*`
- `shop_docpart_*`
- `users*`
- `groups`

## Suggested Core Entities

### Identity

- `User`
- `Role`
- `UserProfile`
- `CustomerGroup`
- `Session` or token/session table, depending on auth design

### Catalog

- `Product`
- `Brand`
- `Article`
- `Category`
- `ProductCategory`
- `ProductImage`
- `ProductProperty`
- `CrossReference`

### Inventory and Pricing

- `Office`
- `Storage`
- `OfficeStorageRule`
- `StockItem`
- `StockReservation`
- `Currency`
- `MarkupRule`
- `PriceSnapshot`

### Commerce

- `Cart`
- `CartItem`
- `Order`
- `OrderItem`
- `OrderStatus`
- `OrderItemStatus`
- `OrderLog`
- `OrderMessage`
- `Payment`
- `Return`
- `ReturnItem`

### Imports and Suppliers

- `Supplier`
- `SupplierCredential`
- `SupplierIntegration`
- `PriceImportFile`
- `PriceImportMapping`
- `PriceImportJob`
- `PriceImportRowError`
- `SupplierSearchResult`

### Requests and Customer Tools

- `VinRequest`
- `VinRequestMessage`
- `GarageVehicle`
- `GarageOrderLink`
- `CustomerNotepadItem`

## Modeling Guidelines

- Keep `Product`, `Article`, and `Brand` explicit. Auto-parts search depends heavily on article normalization and manufacturer/brand matching.
- Do not store only one mutable price on a product. Stock/price are per storage/supplier/source and may need snapshots.
- Use reservations to protect stock during cart/checkout flows.
- Store raw supplier/import payloads as JSON for traceability, but do not rely on JSON as the only queryable model.
- Keep order item status separate from order status.
- Keep import jobs append-only where possible for auditability.

## Migration Approach

Do not mirror legacy tables one-to-one. Instead:

1. Build clean schema for new workflows.
2. Write mapping scripts for selected legacy tables.
3. Import reference data first: users, categories, products, storages, offices, currencies.
4. Import transactional data only after order/cart semantics are finalized.
5. Keep legacy IDs in optional `legacyId` fields during migration.

