-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- USERS TABLE (extends auth.users from Supabase)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'manager', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WAREHOUSES TABLE
create table public.warehouses (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LOCATIONS TABLE
create table public.locations (
  id uuid default uuid_generate_v4() primary key,
  warehouse_id uuid references public.warehouses not null,
  name text not null,
  type text not null check (type in ('rack', 'shelf', 'zone', 'loading_dock', 'storage')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES TABLE
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUPPLIERS TABLE
create table public.suppliers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  contact_info text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  sku text not null unique,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category_id uuid references public.categories,
  unit_of_measure text not null default 'pcs',
  reorder_rule integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STOCK_QUANTITIES TABLE
create table public.stock_quantities (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products not null,
  location_id uuid references public.locations not null,
  quantity integer not null default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, location_id)
);

-- OPERATIONS TABLE
create table public.operations (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('receipt', 'delivery', 'transfer', 'adjustment')),
  status text not null check (status in ('draft', 'waiting', 'ready', 'done', 'canceled')),
  reference_document text,
  created_by uuid references public.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STOCK_MOVES TABLE (Immutable Ledger)
create table public.stock_moves (
  id uuid default uuid_generate_v4() primary key,
  operation_id uuid references public.operations,
  product_id uuid references public.products not null,
  from_location_id uuid references public.locations,
  to_location_id uuid references public.locations,
  quantity integer not null check (quantity > 0),
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create triggers to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_warehouses before update on public.warehouses for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_locations before update on public.locations for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_products before update on public.products for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_suppliers before update on public.suppliers for each row execute procedure public.handle_updated_at();
create trigger set_updated_at_operations before update on public.operations for each row execute procedure public.handle_updated_at();

-- ============================================================
-- RLS (Row Level Security) — Enable on all tables
-- ============================================================
alter table public.users enable row level security;
alter table public.warehouses enable row level security;
alter table public.locations enable row level security;
alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.stock_quantities enable row level security;
alter table public.operations enable row level security;
alter table public.stock_moves enable row level security;
alter table public.stocks enable row level security;

-- ============================================================
-- Helper: get the role of the currently authenticated user
-- SECURITY DEFINER bypasses RLS on the users table itself
-- ============================================================
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- ============================================================
-- Roles used:
--   admin    — full access to everything
--   manager  — read all, write most (no hard deletes)
--   operator — read all, create/update own operations
--   viewer   — read-only across all tables
-- ============================================================

-- USERS TABLE
-- Each user can read/update their own row; admin can manage all
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_select_admin" on public.users for select using (public.get_my_role() = 'admin');
create policy "users_update_own" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users_update_admin" on public.users for update using (public.get_my_role() = 'admin');
create policy "users_delete_admin" on public.users for delete using (public.get_my_role() = 'admin');

-- WAREHOUSES
create policy "warehouses_select_authenticated" on public.warehouses for select using (auth.role() = 'authenticated');
create policy "warehouses_insert_admin_manager" on public.warehouses for insert with check (public.get_my_role() in ('admin', 'manager'));
create policy "warehouses_update_admin_manager" on public.warehouses for update using (public.get_my_role() in ('admin', 'manager'));
create policy "warehouses_delete_admin" on public.warehouses for delete using (public.get_my_role() = 'admin');

-- LOCATIONS
create policy "locations_select_authenticated" on public.locations for select using (auth.role() = 'authenticated');
create policy "locations_insert_admin_manager" on public.locations for insert with check (public.get_my_role() in ('admin', 'manager'));
create policy "locations_update_admin_manager" on public.locations for update using (public.get_my_role() in ('admin', 'manager'));
create policy "locations_delete_admin" on public.locations for delete using (public.get_my_role() = 'admin');

-- CATEGORIES
create policy "categories_select_authenticated" on public.categories for select using (auth.role() = 'authenticated');
create policy "categories_insert_admin_manager" on public.categories for insert with check (public.get_my_role() in ('admin', 'manager'));
create policy "categories_update_admin_manager" on public.categories for update using (public.get_my_role() in ('admin', 'manager'));
create policy "categories_delete_admin" on public.categories for delete using (public.get_my_role() = 'admin');

-- SUPPLIERS
create policy "suppliers_select_authenticated" on public.suppliers for select using (auth.role() = 'authenticated');
create policy "suppliers_insert_admin_manager" on public.suppliers for insert with check (public.get_my_role() in ('admin', 'manager'));
create policy "suppliers_update_admin_manager" on public.suppliers for update using (public.get_my_role() in ('admin', 'manager'));
create policy "suppliers_delete_admin" on public.suppliers for delete using (public.get_my_role() = 'admin');

-- PRODUCTS
create policy "products_select_authenticated" on public.products for select using (auth.role() = 'authenticated');
create policy "products_insert_admin_manager_operator" on public.products for insert with check (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "products_update_admin_manager_operator" on public.products for update using (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "products_delete_admin" on public.products for delete using (public.get_my_role() = 'admin');

-- STOCK_QUANTITIES
create policy "stock_quantities_select_authenticated" on public.stock_quantities for select using (auth.role() = 'authenticated');
create policy "stock_quantities_insert_admin_manager_operator" on public.stock_quantities for insert with check (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "stock_quantities_update_admin_manager_operator" on public.stock_quantities for update using (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "stock_quantities_delete_admin" on public.stock_quantities for delete using (public.get_my_role() = 'admin');

-- STOCKS (legacy summary table)
create policy "stocks_select_authenticated" on public.stocks for select using (auth.role() = 'authenticated');
create policy "stocks_insert_admin_manager_operator" on public.stocks for insert with check (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "stocks_update_admin_manager_operator" on public.stocks for update using (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "stocks_delete_admin" on public.stocks for delete using (public.get_my_role() = 'admin');

-- OPERATIONS
create policy "operations_select_authenticated" on public.operations for select using (auth.role() = 'authenticated');
create policy "operations_insert_admin_manager_operator" on public.operations for insert with check (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "operations_update_admin_manager" on public.operations for update using (public.get_my_role() in ('admin', 'manager'));
-- Operators can only update operations they created
create policy "operations_update_own_operator" on public.operations for update using (public.get_my_role() = 'operator' and created_by = auth.uid());
create policy "operations_delete_admin" on public.operations for delete using (public.get_my_role() = 'admin');

-- STOCK_MOVES (immutable ledger — operators append, only admin can correct)
create policy "stock_moves_select_authenticated" on public.stock_moves for select using (auth.role() = 'authenticated');
create policy "stock_moves_insert_admin_manager_operator" on public.stock_moves for insert with check (public.get_my_role() in ('admin', 'manager', 'operator'));
create policy "stock_moves_update_admin" on public.stock_moves for update using (public.get_my_role() = 'admin');
create policy "stock_moves_delete_admin" on public.stock_moves for delete using (public.get_my_role() = 'admin');

-- Trigger function to update stock_quantities when a stock_move occurs
create or replace function public.update_stock_quantities_on_move()
returns trigger as $$
begin
  -- If there's a source location (from_location_id), deduct stock
  if new.from_location_id is not null then
    insert into public.stock_quantities (product_id, location_id, quantity, last_updated)
    values (new.product_id, new.from_location_id, -new.quantity, now())
    on conflict (product_id, location_id)
    do update set quantity = public.stock_quantities.quantity - new.quantity, last_updated = now();
  end if;

  -- If there's a destination location (to_location_id), add stock
  if new.to_location_id is not null then
    insert into public.stock_quantities (product_id, location_id, quantity, last_updated)
    values (new.product_id, new.to_location_id, new.quantity, now())
    on conflict (product_id, location_id)
    do update set quantity = public.stock_quantities.quantity + new.quantity, last_updated = now();
  end if;

  return new;
end;
$$ language plpgsql;

create trigger after_stock_move_insert
after insert on public.stock_moves
for each row execute procedure public.update_stock_quantities_on_move();
