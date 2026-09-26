# UI Screens & Wireframes

Based on the low-fidelity wireframes, the following screens and their specific components are required for the application:

## 1. Authentication Screen
- **Components:** Login/Signup forms.
- **Fields:** Email, Password, Login/Register buttons.

## 2. Main Dashboard
- **Role:** Central navigation hub.
- **Components:** 
  - Summary Widgets/Cards for quick access (e.g., "Receipts", "Delivery", "Transfers").
  - Top navigation or sidebar for accessing settings and history.

## 3. Setup Screens
- **Warehouse Setup:**
  - Form Fields: Name, Short Code, Address.
- **Location Setup:**
  - Form Fields: Name, Short Code, Parent Location (Dropdown/Reference to Warehouse).

## 4. Stock / Inventory View
- **Role:** Overview of all product quantities.
- **Components:** Data table.
- **Columns:** Product Name, Available Quantity, On Hand, Forecasted.

## 5. Operations: Receipts (Inbound)
- **List View:** Table showing all receipts.
  - Columns: Reference, Vendor, Scheduled Date, Status (Draft, Ready, Done).
- **Detail View:** Single receipt management.
  - Header: Vendor selection, Scheduled Date.
  - Body: Line items for products (Product, Demand, Done).
  - Actions: "Validate" button to confirm receipt.

## 6. Operations: Delivery (Outbound)
- **List View:** Table showing all deliveries.
  - Columns: Reference, Customer, Scheduled Date, Status.
- **Detail View:** Single delivery management.
  - Header: Customer selection, Scheduled Date.
  - Body: Line items for products to pick/ship.
  - Actions: "Validate" button to confirm dispatch.

## 7. Move History (Ledger)
- **Role:** Audit trail of all stock movements.
- **Components:** Read-only data table.
- **Columns:** Date, Reference (Receipt/Delivery ID), Product, From Location, To Location, Quantity.
