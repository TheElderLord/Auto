# Legacy Project Summary

This is a short context brief for implementation agents.

## What the Legacy App Is

The legacy project is a PHP/MySQL auto-parts ecommerce and admin platform.

It includes:

- Customer storefront
- Auto-part article search
- Catalog/category/product pages
- Cart and checkout
- Customer order history
- VIN requests
- Admin panel
- Product/catalog management
- Office/storage/stock management
- Supplier price-list import
- Order processing
- Returns
- Finance/payments
- SMS/email notifications
- Supplier integrations
- 1C and Ucats/UCatalog integrations

## Important Local Paths

- Legacy app: `../testparts`
- Legacy config: `../testparts/config.php`
- Legacy SQL dump: `../testpart_admins_2024-12-23_14-34-29.sql`
- Admin shop code: `../testparts/admin/content/shop`
- Customer shop code: `../testparts/content/shop`
- Supplier handlers: `../testparts/content/shop/docpart/suppliers_handlers`
- Legacy Python import flow: `../testparts/pyprices`

## Important Findings

- Core entry files are ionCube-protected, so the app cannot be fully understood or safely refactored from source.
- The legacy project contains hardcoded credentials and tokens. Do not copy them.
- The database dump is useful for table names, sample data, and workflow inference.
- The legacy structure mixes page rendering, SQL, business logic, and frontend JavaScript.
- Rebuild should preserve business capability, not legacy implementation style.

## High-Value Legacy Concepts

- Article/manufacturer search
- Cross/analog part lookup
- Storage-specific stock and price
- Office-storage markup rules
- Customer group pricing
- Reservation behavior during cart/checkout
- Order and order-item statuses
- Supplier automation states/actions
- Price-list column mappings and import history

## Legacy Table Groups

- `shop_catalogue_*`: catalog categories/products/properties
- `shop_products_*`: product images/text/stickers/evaluations
- `shop_storages*`: storages and stock data
- `shop_offices*`: offices, cash, office-storage links, commissions
- `shop_carts*`: cart and reserved detail rows
- `shop_orders*`: orders, items, statuses, logs, messages, returns
- `shop_docpart_*`: article search, manufacturers, prices, garage, supplier-related data
- `users*`, `groups`: identity and access

