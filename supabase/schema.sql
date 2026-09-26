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

-- CATEGORIES TABLE
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  sku text not null unique,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category_id uuid references public.categories,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STOCK TABLE (To track quantity per product per warehouse)
create table public.stock (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products not null,
  warehouse_id uuid references public.warehouses not null,
  quantity integer not null default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, warehouse_id)
);

-- RLS (Row Level Security) Setup
alter table public.users enable row level security;
alter table public.warehouses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.stock enable row level security;

-- Create policies (Example basic policies, can be restricted later based on role)
create policy "Allow read access to all authenticated users for users table" on public.users for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for warehouses" on public.warehouses for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for categories" on public.categories for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for products" on public.products for select using (auth.role() = 'authenticated');
create policy "Allow read access to all authenticated users for stock" on public.stock for select using (auth.role() = 'authenticated');

-- Create triggers to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on public.products
for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_warehouse
before update on public.warehouses
for each row execute procedure public.handle_updated_at();
