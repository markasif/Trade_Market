-- B2B ART SUPPLY MARKETPLACE SCHEMA

-- 1. EXTENSIONS
-- Enable the UUID extension to use UUIDs as primary keys.
create extension if not exists "uuid-ossp" with schema extensions;

-- 2. CREATE ENUM TYPES for controlled vocabularies.
-- This improves data integrity by ensuring that status and type fields
-- can only contain predefined values.

create type "user_role" as enum ('buyer', 'supplier', 'admin');
create type "account_status" as enum ('pending', 'active', 'inactive', 'rejected');
create type "order_status" as enum ('awaiting-payment', 'pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- 3. CREATE TABLES

-- USERS Table
-- Stores basic information for all authenticated users, linking to Supabase's auth.users.
create table "public"."users" (
    "id" uuid not null references auth.users(id) on delete cascade,
    "user_type" user_role not null,
    "email" text not null,
    "first_name" text,
    "last_name" text,
    "creation_date" timestamp with time zone not null default now(),
    primary key (id)
);
-- RLS Policy for users table: Users can see and manage their own data.
alter table public.users enable row level security;
create policy "Users can view and manage their own data" on public.users
for all using (auth.uid() = id);

-- BUYERS Table
-- Stores specific details for users with the 'buyer' role.
create table "public"."buyers" (
    "id" uuid not null references public.users(id) on delete cascade,
    "user_id" uuid not null references public.users(id) on delete cascade,
    "business_name" text not null,
    "phone" text,
    "shipping_address" text not null,
    "gst_number" text not null,
    "account_status" account_status not null default 'pending',
    "gst_certificate_url" text,
    "business_registration_url" text,
    primary key (id)
);
-- RLS Policy for buyers table: Buyers can manage their own profile. Admins have full access.
alter table public.buyers enable row level security;
create policy "Buyers can manage their own profile" on public.buyers
for all using (auth.uid() = user_id);
create policy "Admins can manage buyer profiles" on public.buyers
for all using ( (select user_type from public.users where id = auth.uid()) = 'admin' );

-- SUPPLIERS Table
-- Stores specific details for users with the 'supplier' role.
create table "public"."suppliers" (
    "id" uuid not null references public.users(id) on delete cascade,
    "user_id" uuid not null references public.users(id) on delete cascade,
    "company_name" text not null,
    "business_email" text not null,
    "contact_number" text not null,
    "business_address" text not null,
    "gst_number" text not null,
    "business_license_url" text not null,
    "tax_id_document_url" text not null,
    "bank_account_proof_url" text not null,
    "account_status" account_status not null default 'pending',
    primary key (id)
);
-- RLS Policy for suppliers table: Suppliers can manage their own profile. Admins have full access.
alter table public.suppliers enable row level security;
create policy "Suppliers can manage their own profile" on public.suppliers
for all using (auth.uid() = user_id);
create policy "Admins can manage supplier profiles" on public.suppliers
for all using ( (select user_type from public.users where id = auth.uid()) = 'admin' );


-- ADMINS Table
-- Used to grant admin privileges. Existence of a record means the user is an admin.
create table "public"."admins" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null references public.users(id) on delete cascade,
    primary key (id),
    unique(user_id)
);
-- RLS Policy for admins table: Only admins can view the admin list.
alter table public.admins enable row level security;
create policy "Admins can view admin list" on public.admins
for select using ( (select user_type from public.users where id = auth.uid()) = 'admin' );


-- CATEGORIES Table
-- Stores product categories.
create table "public"."categories" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    primary key (id)
);
-- RLS Policy for categories: Publicly readable, but only admins can modify.
alter table public.categories enable row level security;
create policy "Categories are publicly viewable" on public.categories
for select using (true);
create policy "Admins can manage categories" on public.categories
for all using ( (select user_type from public.users where id = auth.uid()) = 'admin' );


-- PRODUCTS Table
-- Stores product listings created by suppliers.
create table "public"."products" (
    "id" uuid not null default uuid_generate_v4(),
    "supplier_id" uuid not null references public.suppliers(id) on delete cascade,
    "name" text not null,
    "description" text not null,
    "category_id" uuid references public.categories(id),
    "image_urls" text[],
    "pricing_tiers" jsonb not null,
    "moq" integer not null,
    "available_stock" integer not null default 0,
    primary key (id)
);
-- RLS Policy for products: Publicly viewable. Only owner suppliers and admins can modify.
alter table public.products enable row level security;
create policy "Products are publicly viewable" on public.products
for select using (true);
create policy "Suppliers can manage their own products" on public.products
for all using (auth.uid() = supplier_id);
create policy "Admins can manage all products" on public.products
for all using ( (select user_type from public.users where id = auth.uid()) = 'admin' );


-- ORDERS Table
-- Stores orders placed by buyers.
create table "public"."orders" (
    "id" uuid not null default uuid_generate_v4(),
    "buyer_id" uuid not null references public.buyers(id) on delete cascade,
    "order_date" timestamp with time zone not null default now(),
    "total_amount" numeric not null,
    "status" order_status not null,
    "tracking_number" text,
    "payment_proof_url" text,
    primary key (id)
);
-- RLS Policy for orders: Buyers can manage their own orders. Admins and relevant suppliers can view.
alter table public.orders enable row level security;
create policy "Buyers can manage their own orders" on public.orders
for all using (auth.uid() = buyer_id);
create policy "Admins can manage all orders" on public.orders
for all using ( (select user_type from public.users where id = auth.uid()) = 'admin' );
create policy "Suppliers can view orders containing their products" on public.orders
for select using ( exists (
    select 1 from public.order_items
    join public.products on order_items.product_id = products.id
    where order_items.order_id = orders.id and products.supplier_id = auth.uid()
));


-- ORDER_ITEMS Table
-- A junction table linking products and quantities to an order.
create table "public"."order_items" (
    "id" uuid not null default uuid_generate_v4(),
    "order_id" uuid not null references public.orders(id) on delete cascade,
    "product_id" uuid not null references public.products(id),
    "quantity" integer not null,
    "unit_price" numeric not null,
    primary key (id)
);
-- RLS Policy for order_items: Access is inherited from the parent order.
alter table public.order_items enable row level security;
create policy "Users can manage items of orders they have access to" on public.order_items
for all using ( exists (
    select 1 from public.orders where id = order_items.order_id
));


-- 4. SETUP STORAGE BUCKETS

-- Create a bucket for KYC documents with restrictive access.
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

create policy "KYC Documents access for owners and admins"
on storage.objects for all
using ( bucket_id = 'kyc-documents' and (storage.owner(id) = auth.uid() or (select user_type from public.users where id = auth.uid()) = 'admin') );


-- Create a public bucket for product images.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Suppliers and admins can upload product images"
on storage.objects for insert
with check ( bucket_id = 'product-images' and ((select user_type from public.users where id = auth.uid()) = 'admin' or (select user_type from public.users where id = auth.uid()) = 'supplier') );

create policy "Suppliers and admins can update product images"
on storage.objects for update
with check ( bucket_id = 'product-images' and ((select user_type from public.users where id = auth.uid()) = 'admin' or (select user_type from public.users where id = auth.uid()) = 'supplier') );
