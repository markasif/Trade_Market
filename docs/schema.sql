-- --------------------------------------------------------------------------------
-- 1. Drop existing objects for a clean slate
-- --------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP FUNCTION IF EXISTS is_admin;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP TABLE IF EXISTS public.order_items, public.orders, public.products, public.categories, public.admins, public.buyers, public.suppliers, public.users CASCADE;

-- --------------------------------------------------------------------------------
-- 2. Core Profile Tables
-- Link directly to auth.users and remove the redundant public.users table.
-- --------------------------------------------------------------------------------

-- Buyers Table
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT,
  shipping_address TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  account_status TEXT NOT NULL DEFAULT 'pending',
  gst_certificate_url TEXT,
  business_registration_url TEXT
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_email TEXT UNIQUE NOT NULL,
  contact_number TEXT NOT NULL,
  business_address TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  business_license_url TEXT,
  tax_id_document_url TEXT,
  bank_account_proof_url TEXT,
  account_status TEXT NOT NULL DEFAULT 'pending'
);

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------------------
-- 3. Product and Order Tables
-- --------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  image_urls TEXT[],
  pricing_tiers JSONB NOT NULL,
  moq INTEGER NOT NULL CHECK (moq >= 0),
  available_stock INTEGER NOT NULL CHECK (available_stock >= 0)
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


-- --------------------------------------------------------------------------------
-- 4. Database Trigger for New User Profile Creation
-- This is the key fix. This function runs *after* a user signs up.
-- It reads the metadata from the new auth user and creates a profile in the
-- correct public table (buyers or suppliers).
-- --------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check user_type from metadata and insert into the corresponding table
  IF NEW.raw_user_meta_data->>'user_type' = 'buyer' THEN
    INSERT INTO public.buyers (id, business_name, phone, shipping_address, gst_number, account_status)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'business_name',
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'shipping_address',
      NEW.raw_user_meta_data->>'gst_number',
      'pending'
    );
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'supplier' THEN
    INSERT INTO public.suppliers (id, company_name, business_email, contact_number, business_address, gst_number, account_status)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'company_name',
      NEW.email,
      NEW.raw_user_meta_data->>'contact_number',
      NEW.raw_user_meta_data->>'business_address',
      NEW.raw_user_meta_data->>'gst_number',
      NEW.raw_user_meta_data->>'account_status'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- --------------------------------------------------------------------------------
-- 5. Row-Level Security (RLS) Policies
-- --------------------------------------------------------------------------------

-- Enable RLS for all tables
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check for admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies for Buyers
DROP POLICY IF EXISTS "Buyers can manage their own profile" ON public.buyers;
CREATE POLICY "Buyers can manage their own profile" ON public.buyers
  FOR ALL USING (auth.uid() = id OR is_admin());

-- Policies for Suppliers
DROP POLICY IF EXISTS "Suppliers can manage their own profile" ON public.suppliers;
CREATE POLICY "Suppliers can manage their own profile" ON public.suppliers
  FOR ALL USING (auth.uid() = id OR is_admin());

-- Policies for Admins
DROP POLICY IF EXISTS "Admins can access the admins table" ON public.admins;
CREATE POLICY "Admins can access the admins table" ON public.admins
  FOR ALL USING (is_admin());

-- Policies for Categories (Public read, admin write)
DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.categories;
CREATE POLICY "Categories are publicly viewable" ON public.categories
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (is_admin());

-- Policies for Products (Public read, owner/admin write)
DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;
CREATE POLICY "Products are publicly viewable" ON public.products
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Suppliers can manage their own products" ON public.products;
CREATE POLICY "Suppliers can manage their own products" ON public.products
  FOR ALL USING (auth.uid() = supplier_id OR is_admin());

-- Policies for Orders (Buyer manages own, admin manages all)
DROP POLICY IF EXISTS "Buyers can manage their own orders" ON public.orders;
CREATE POLICY "Buyers can manage their own orders" ON public.orders
  FOR ALL USING (auth.uid() = buyer_id OR is_admin());

-- Policies for Order Items (Inherits from Order)
DROP POLICY IF EXISTS "Users can manage order items based on order ownership" ON public.order_items;
CREATE POLICY "Users can manage order items based on order ownership" ON public.order_items
  FOR ALL USING (
    is_admin() OR
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid())
  );
