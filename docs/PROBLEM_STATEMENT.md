# Problem Statement - StockSense

Build a modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. The goal is to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use app.

## Target Users
- **Inventory Managers** – manage incoming & outgoing stock.
- **Warehouse Staff** – perform transfers, picking, shelving, and counting.

## Core Features
1. **Authentication:** Sign up/log in, OTP-based password reset, redirection to Dashboard.
2. **Dashboard View:** Landing page with KPIs (Total products, Low stock, Pending receipts, Pending deliveries, Internal transfers scheduled). Dynamic Filters (By document type, status, warehouse, category).
3. **Product Management:** Create/update products (Name, SKU, Category, UoM, Initial stock).
4. **Operations:**
   - **Receipts (Incoming):** Create receipt, add supplier/products, input quantities, validate (increases stock).
   - **Delivery Orders (Outgoing):** Pick, pack, validate (decreases stock).
   - **Internal Transfers:** Move stock inside company (Warehouse to Floor, Rack to Rack).
   - **Stock Adjustments:** Fix mismatches between recorded and physical count.
5. **Move History & Ledgers:** Every movement logged in the Stock Ledger.

## Additional Features
- Alerts for low stock.
- Multi-warehouse support.
- SKU search & smart filters.
