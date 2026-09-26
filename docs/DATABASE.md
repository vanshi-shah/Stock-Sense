# Database Schema (Supabase PostgreSQL)

## Core Tables

- `users` (id, email, role, created_at)
- `warehouses` (id, name, location)
- `locations` (id, warehouse_id, name, type (e.g., rack, shelf))
- `categories` (id, name, description)
- `products` (id, name, sku, category_id, unit_of_measure, reorder_rule, created_at)
- `stock_quantities` (id, product_id, location_id, quantity)
- `operations` (id, type (receipt, delivery, transfer, adjustment), status (draft, waiting, ready, done, canceled), reference_document, created_by, created_at)
- `stock_moves` (id, operation_id, product_id, from_location_id, to_location_id, quantity, timestamp)
- `suppliers` (id, name, contact_info)
