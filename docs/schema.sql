-- Drop the trigger and function in the correct order to avoid dependency errors.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop all tables for a clean recreation. Use CASCADE to remove dependent objects.
DROP TABLE IF EXISTS public.order_items, public.orders, public.products, public.categories, public.admins, public.buyers, public.suppliers CASCADE;

-- --------------------------------------------------------------------------------
-- 1. Core Profile Tables (Linked directly to auth.users)
-- --------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  phone TEXT,
  shipping_address TEXT,
  gst_number TEXT,
  account_status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  contact_number TEXT,
  business_address TEXT,
  gst_number TEXT,
  business_license_url TEXT,
  tax_id_document_url TEXT,
  bank_account_proof_url TEXT,
  account_status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------------------
-- 2. Product and Order Tables
-- --------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  available_stock INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id),
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL,
  tracking_number TEXT,
  payment_proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------------------
-- 3. Automatic Profile Creation (Triggers and Functions)
-- --------------------------------------------------------------------------------

-- This function will be triggered after a new user signs up.
-- IMPORTANT: Changed to SECURITY INVOKER to run as the user who triggered it (the new user).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
BEGIN
  -- Get user_type from metadata, default to 'buyer' if not present
  user_type := NEW.raw_user_meta_data ->> 'user_type';

  -- Create a corresponding profile in the appropriate table
  IF user_type = 'supplier' THEN
    INSERT INTO public.suppliers (id, company_name, gst_number, account_status)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'company_name', NEW.raw_user_meta_data ->> 'gst_number', NEW.raw_user_meta_data ->> 'account_status');
  ELSE -- Default to creating a buyer profile
    INSERT INTO public.buyers (id, business_name, gst_number, account_status)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'business_name', NEW.raw_user_meta_data ->> 'gst_number', 'pending');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER; -- This is the crucial change

-- Create the trigger that fires after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------------------
-- 4. Row-Level Security (RLS) Policies
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
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;

-- POLICIES

-- Buyers policies: Allow insert for any authenticated user (for the trigger) and then restrict management to owner/admin.
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.buyers;
CREATE POLICY "Allow insert for authenticated users" ON public.buyers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Buyers can manage their own profile" ON public.buyers;
CREATE POLICY "Buyers can manage their own profile" ON public.buyers FOR ALL USING (auth.uid() = id OR is_admin());


-- Suppliers policies: Allow insert for any authenticated user (for the trigger) and then restrict management to owner/admin.
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.suppliers;
CREATE POLICY "Allow insert for authenticated users" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Suppliers can manage their own profile" ON public.suppliers;
CREATE POLICY "Suppliers can manage their own profile" ON public.suppliers FOR ALL USING (auth.uid() = id OR is_admin());

-- Admins policy: Only other admins can manage the admins table.
DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;
CREATE POLICY "Admins can manage admins" ON public.admins FOR ALL USING (is_admin());

-- Categories policies: Public read, admin write.
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin write access" ON public.categories;
CREATE POLICY "Allow admin write access" ON public.categories FOR ALL USING (is_admin());

-- Products policies: Public read, owner/admin write.
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow suppliers to manage their products" ON public.products;
CREATE POLICY "Allow suppliers to manage their products" ON public.products FOR ALL USING (auth.uid() = supplier_id OR is_admin());

-- Orders policies: Owner/admin can manage, supplier can view.
DROP POLICY IF EXISTS "Users can manage their own orders" ON public.orders;
CREATE POLICY "Users can manage their own orders" ON public.orders FOR ALL USING (auth.uid() = buyer_id OR is_admin());
DROP POLICY IF EXISTS "Suppliers can view their orders" ON public.orders;
CREATE POLICY "Suppliers can view their orders" ON public.orders FOR SELECT USING (is_admin() OR EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE oi.order_id = public.orders.id AND p.supplier_id = auth.uid()
));

-- Order Items policies: Owner/admin can manage, supplier can view.
DROP POLICY IF EXISTS "Users can manage their own order_items" ON public.order_items;
CREATE POLICY "Users can manage their own order_items" ON public.order_items FOR ALL USING (is_admin() OR EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()
));
DROP POLICY IF EXISTS "Suppliers can view their order_items" ON public.order_items;
CREATE POLICY "Suppliers can view their order_items" ON public.order_items FOR SELECT USING (is_admin() OR EXISTS (
    SELECT 1 FROM public.products p WHERE p.id = product_id AND p.supplier_id = auth.uid()
));
