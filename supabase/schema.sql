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

-- RLS (Row Level Security) Setup
alter table public.users enable row level security;
alter table public.warehouses enable row level security;
alter table public.locations enable row level security;
alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.stock_quantities enable row level security;
alter table public.operations enable row level security;
alter table public.stock_moves enable row level security;

-- Basic Policies (Can be refined later)
create policy "Allow read access to all authenticated users for users table" on public.users for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for warehouses" on public.warehouses for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for locations" on public.locations for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for categories" on public.categories for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for suppliers" on public.suppliers for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for products" on public.products for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for stock_quantities" on public.stock_quantities for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for operations" on public.operations for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for stock_moves" on public.stock_moves for select using (auth.role() = 'authenticated');

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
