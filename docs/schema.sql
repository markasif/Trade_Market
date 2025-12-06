-- =================================================================================
-- 0. Cleanup and Setup
-- =================================================================================

-- Drop existing policies and tables for a clean slate
-- NOTE: This is destructive. Only run in a development environment.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;
DROP TABLE IF EXISTS public.order_items, public.orders, public.products, public.categories, public.admins, public.buyers, public.suppliers, public.users CASCADE;
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.handle_new_user();


-- =================================================================================
-- 1. Core Profile and Product Tables
-- =================================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  creation_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT,
  shipping_address TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  account_status TEXT NOT NULL,
  gst_certificate_url TEXT,
  business_registration_url TEXT
);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_email TEXT UNIQUE NOT NULL,
  contact_number TEXT NOT NULL,
  business_address TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  business_license_url TEXT,
  tax_id_document_url TEXT,
  bank_account_proof_url TEXT,
  account_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  image_urls TEXT[],
  pricing_tiers JSONB NOT NULL,
  moq INTEGER NOT NULL,
  available_stock INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id),
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL,
  tracking_number TEXT,
  payment_proof_url TEXT
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

-- =================================================================================
-- 2. Database Functions and Triggers
-- =================================================================================

-- Function to create user profiles automatically on new user signup.
-- This function is the core of the fix for the signup issue.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into the public.users table
  INSERT INTO public.users (id, user_type, email, first_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'user_type',
    new.email,
    new.raw_user_meta_data ->> 'first_name'
  );

  -- Conditionally insert into buyers or suppliers table
  IF (new.raw_user_meta_data ->> 'user_type') = 'buyer' THEN
    INSERT INTO public.buyers (id, business_name, phone, shipping_address, gst_number, account_status)
    VALUES (
      new.id,
      new.raw_user_meta_data ->> 'business_name',
      new.raw_user_meta_data ->> 'phone',
      new.raw_user_meta_data ->> 'shipping_address',
      new.raw_user_meta_data ->> 'gst_number',
      new.raw_user_meta_data ->> 'account_status'
    );
  ELSIF (new.raw_user_meta_data ->> 'user_type') = 'supplier' THEN
    INSERT INTO public.suppliers (id, company_name, business_email, contact_number, business_address, gst_number, account_status)
    VALUES (
      new.id,
      new.raw_user_meta_data ->> 'company_name',
      new.email,
      new.raw_user_meta_data ->> 'contact_number',
      new.raw_user_meta_data ->> 'business_address',
      new.raw_user_meta_data ->> 'gst_number',
      new.raw_user_meta_data ->> 'account_status'
    );
  END IF;
  
  RETURN new;
END;
$$;

-- Trigger to execute the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function to check for admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- =================================================================================
-- 3. Row-Level Security (RLS) Policies
-- =================================================================================

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Clear old policies before creating new ones
DROP POLICY IF EXISTS "Allow all access for admins" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow all access for admins" ON public.buyers;
DROP POLICY IF EXISTS "Buyers can manage their own profile" ON public.buyers;
DROP POLICY IF EXISTS "Allow all access for admins" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers can manage their own profile" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can access all admin records" ON public.admins;
DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;
DROP POLICY IF EXISTS "Suppliers can manage their own products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Buyers can manage their own orders" ON public.orders;
DROP POLICY IF EXISTS "Suppliers can view orders containing their products" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Buyers can manage items in their own orders" ON public.order_items;
DROP POLICY IF EXISTS "Suppliers can view items from their products" ON public.order_items;

-- Users Table Policies
CREATE POLICY "Allow all access for admins" ON public.users FOR ALL USING (is_admin());
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- Buyers Table Policies
CREATE POLICY "Allow all access for admins" ON public.buyers FOR ALL USING (is_admin());
CREATE POLICY "Buyers can manage their own profile" ON public.buyers FOR ALL USING (auth.uid() = id);

-- Suppliers Table Policies
CREATE POLICY "Allow all access for admins" ON public.suppliers FOR ALL USING (is_admin());
CREATE POLICY "Suppliers can manage their own profile" ON public.suppliers FOR ALL USING (auth.uid() = id);

-- Admins Table Policies
CREATE POLICY "Admins can access all admin records" ON public.admins FOR ALL USING (is_admin());

-- Categories Table Policies
CREATE POLICY "Categories are publicly viewable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (is_admin());

-- Products Table Policies
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage their own products" ON public.products FOR ALL USING (auth.uid() = supplier_id OR is_admin());

-- Orders Table Policies
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (is_admin());
CREATE POLICY "Buyers can manage their own orders" ON public.orders FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Suppliers can view orders containing their products" ON public.orders FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.order_items oi
  JOIN public.products p ON oi.product_id = p.id
  WHERE oi.order_id = public.orders.id AND p.supplier_id = auth.uid()
));

-- Order Items Table Policies
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (is_admin());
CREATE POLICY "Buyers can manage items in their own orders" ON public.order_items FOR ALL USING (EXISTS (
  SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()
));
CREATE POLICY "Suppliers can view items from their products" ON public.order_items FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.products p WHERE p.id = product_id AND p.supplier_id = auth.uid()
));

-- NOTE: The policies for 'users', 'buyers', and 'suppliers' do NOT need an explicit INSERT policy
-- for the public, because the `handle_new_user` trigger runs with `SECURITY DEFINER` privileges,
-- bypassing RLS to securely create the profiles. This is the correct and intended pattern.
