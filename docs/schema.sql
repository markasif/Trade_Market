-- Drop all tables, functions, and policies to ensure a clean slate.
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- Drop policies from all tables before dropping the tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY;';
        EXECUTE 'DROP POLICY IF EXISTS "Enable ALL for admins" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Enable read access for all users" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own profile" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own data" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Buyers can manage their own profile" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Suppliers can manage their own profile" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Admins access only" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Admins can manage categories" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Products are publicly viewable" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Suppliers can manage their own products" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Buyers can manage their own orders" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Suppliers can view their orders" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own order_items" ON public.' || quote_ident(r.tablename);
        EXECUTE 'DROP POLICY IF EXISTS "Suppliers can view their order_items" ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;


-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.admins;
DROP TABLE IF EXISTS public.suppliers;
DROP TABLE IF EXISTS public.buyers;
DROP TABLE IF EXISTS public.users;

-- --------------------------------------------------------------------------------
-- 1. Core Profile Tables
-- --------------------------------------------------------------------------------

-- Buyers Table (Links directly to auth.users)
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  phone TEXT,
  shipping_address TEXT,
  gst_number TEXT,
  account_status TEXT,
  gst_certificate_url TEXT,
  business_registration_url TEXT
);

-- Suppliers Table (Links directly to auth.users)
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  business_email TEXT UNIQUE,
  contact_number TEXT,
  business_address TEXT,
  gst_number TEXT,
  business_license_url TEXT,
  tax_id_document_url TEXT,
  bank_account_proof_url TEXT,
  account_status TEXT
);

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);


-- --------------------------------------------------------------------------------
-- 2. Product and Order Tables
-- --------------------------------------------------------------------------------

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT
);

-- Products Table
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

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id),
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL,
  tracking_number TEXT,
  payment_proof_url TEXT
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

-- --------------------------------------------------------------------------------
-- 3. Auth Trigger Function (Handles profile creation)
-- --------------------------------------------------------------------------------

-- This function will be called by a trigger when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
BEGIN
  -- Extract user type from the new user's metadata
  user_type := NEW.raw_user_meta_data->>'user_type';

  -- Create a profile in the corresponding table
  IF user_type = 'buyer' THEN
    INSERT INTO public.buyers (id, business_name, phone, shipping_address, gst_number, account_status)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'business_name',
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'shipping_address',
      NEW.raw_user_meta_data->>'gst_number',
      'pending' -- All new buyers start as pending
    );
  ELSIF user_type = 'supplier' THEN
     INSERT INTO public.suppliers (id, company_name, contact_number, business_address, gst_number, account_status, business_email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'contact_number',
        NEW.raw_user_meta_data->>'business_address',
        NEW.raw_user_meta_data->>'gst_number',
        NEW.raw_user_meta_data->>'account_status',
        NEW.email
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- --------------------------------------------------------------------------------
-- 4. Row-Level Security (RLS) and Policies
-- --------------------------------------------------------------------------------

-- Enable RLS for all tables
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- Buyers Table Policies
CREATE POLICY "Buyers can view and manage their own profile" ON public.buyers
  FOR ALL USING (auth.uid() = id OR is_admin());

-- Suppliers Table Policies
CREATE POLICY "Suppliers can view and manage their own profile" ON public.suppliers
  FOR ALL USING (auth.uid() = id OR is_admin());

-- Admins Table Policies
CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT USING (is_admin());

-- Categories (Public Read, Admin Write)
CREATE POLICY "Categories are publicly viewable" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Products (Public Read, Owner/Admin Write)
CREATE POLICY "Products are publicly viewable" ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Suppliers can manage their own products" ON public.products
  FOR ALL USING (auth.uid() = supplier_id OR is_admin()) WITH CHECK (auth.uid() = supplier_id OR is_admin());

-- Orders (Buyer can manage their own, Admin can manage all)
CREATE POLICY "Buyers can manage their own orders" ON public.orders
  FOR ALL USING (auth.uid() = buyer_id OR is_admin()) WITH CHECK (auth.uid() = buyer_id OR is_admin());

-- Order Items (Access granted if user owns the parent order)
CREATE POLICY "Users can manage items in their own orders" ON public.order_items
  FOR ALL USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  ) WITH CHECK (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

-- Allow suppliers to view orders containing their products
CREATE POLICY "Suppliers can view orders with their items" ON public.orders
  FOR SELECT USING (
    is_admin() OR
    EXISTS (
      SELECT 1
      FROM public.order_items oi
      JOIN public.products p ON oi.product_id = p.id
      WHERE oi.order_id = public.orders.id AND p.supplier_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can view items from their products" ON public.order_items
  FOR SELECT USING (
    is_admin() OR
    EXISTS (
      SELECT 1
      FROM public.products p
      WHERE p.id = public.order_items.product_id AND p.supplier_id = auth.uid()
    )
  );
