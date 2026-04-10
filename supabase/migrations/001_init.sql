create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  service text not null,
  item_number integer not null,
  name text not null,
  description text,
  price_cents integer not null,
  collection_name text not null,
  collection_slug text not null,
  pdf_filename text not null,
  pdf_storage_path text not null,
  stripe_product_id text,
  stripe_price_id text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  customer_email text not null,
  amount_cents integer not null,
  currency text default 'usd',
  download_url text,
  download_expires_at timestamptz,
  download_count integer default 0,
  max_downloads integer default 3,
  status text default 'completed',
  created_at timestamptz default now()
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  service text unique not null,
  sort_order integer default 0
);
