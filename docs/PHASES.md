# Development Phases - StockSense

## Phase 1: Setup & Foundations ✅
- [x] Initialize React + Vite project with Tailwind and shadcn/ui.
- [x] Setup Supabase project (Database, Auth).
- [x] Define PostgreSQL schema in Supabase (Users, Products, Warehouses).
- [x] Implement Authentication UI (Login, Signup, OTP reset).
  - Login → Supabase `signInWithPassword`
  - Signup → Supabase `signUp` (email OTP confirmation)
  - Forgot Password → `resetPasswordForEmail` → `/verify-otp` (6-digit OTP) → `/update-password`
  - `AuthContext` + `ProtectedRoute` guarding `/dashboard`

## Phase 2: Core Inventory Management
- Implement Product Management (CRUD for products, categories, SKU).
- Implement Warehouse & Location management.
- Initial dashboard setup (Static layout).

## Phase 3: Operations & Movements
- **Receipts Flow:** UI and logic to receive goods from vendors.
- **Delivery Orders:** UI and logic to dispatch goods to customers.
- **Internal Transfers:** UI and logic to move stock between warehouses/racks.
- **Stock Adjustments:** UI and logic for physical count corrections.
- Ensure all operations write to the immutable `stock_moves` ledger in Supabase.

## Phase 4: Dashboard & Analytics
- Implement dynamic KPIs on the dashboard based on real-time data from Supabase.
- Build dynamic filters for operations and stock levels.
- Add low stock alerts and notification system.

## Phase 5: Polish & Final Integration
- Multi-warehouse support refinement.
- SKU search & smart filter optimizations.
- Final testing of the end-to-end flow.
- UI/UX polishing and responsiveness checks.
