-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  user_type TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  creation_date TIMESTAMPTZ DEFAULT NOW()
);

-- Buyers Table
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT,
  shipping_address TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  account_status TEXT NOT NULL,
  gst_certificate_url TEXT,
  business_registration_url TEXT
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_email TEXT UNIQUE NOT NULL,
  contact_number TEXT NOT NULL,
  business_address TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  business_license_url TEXT NOT NULL,
  tax_id_document_url TEXT NOT NULL,
  bank_account_proof_url TEXT NOT NULL,
  account_status TEXT NOT NULL
);

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

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);

-- Enable RLS for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policies

-- Users: Can see and manage their own data. Admins can do anything.
DROP POLICY IF EXISTS "Users can see and manage their own data" ON public.users;
CREATE POLICY "Users can see and manage their own data" ON public.users
  FOR ALL USING (auth.uid() = id OR is_admin());

-- Buyers: Can insert their own record. Can only view/update their own record. Admins can do anything.
DROP POLICY IF EXISTS "Buyers can manage their own profile" ON public.buyers;
CREATE POLICY "Buyers can manage their own profile" ON public.buyers
  FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Suppliers: Can insert their own record. Can only view/update their own record. Admins can do anything.
DROP POLICY IF EXISTS "Suppliers can manage their own profile" ON public.suppliers;
CREATE POLICY "Suppliers can manage their own profile" ON public.suppliers
  FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Admins: Only other admins can view admin records.
DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
CREATE POLICY "Admins can view admin records" ON public.admins
  FOR SELECT USING (is_admin());

-- Categories: Publicly viewable. Only admins can create/edit.
DROP POLICY IF EXISTS "Categories are publicly viewable" ON public.categories;
CREATE POLICY "Categories are publicly viewable" ON public.categories
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (is_admin());

-- Products: Publicly viewable. Only owner suppliers or admins can manage.
DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;
CREATE POLICY "Products are publicly viewable" ON public.products
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Suppliers can manage their own products" ON public.products;
CREATE POLICY "Suppliers can manage their own products" ON public.products
  FOR ALL USING (auth.uid() = supplier_id OR is_admin());

-- Orders: Buyers can manage their own orders. Suppliers can view orders containing their products. Admins can do anything.
DROP POLICY IF EXISTS "Buyers can manage their own orders" ON public.orders;
CREATE POLICY "Buyers can manage their own orders" ON public.orders
  FOR ALL USING (auth.uid() = buyer_id OR is_admin());
DROP POLICY IF EXISTS "Suppliers can view their orders" ON public.orders;
CREATE POLICY "Suppliers can view their orders" ON public.orders
  FOR SELECT USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM public.order_items oi
      JOIN public.products p ON oi.product_id = p.id
      WHERE oi.order_id = public.orders.id AND p.supplier_id = auth.uid()
    )
  );

-- Order Items: Users can manage items belonging to their own orders. Suppliers can see items for their products.
DROP POLICY IF EXISTS "Users can manage their own order_items" ON public.order_items;
CREATE POLICY "Users can manage their own order_items" ON public.order_items
  FOR ALL USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "Suppliers can view their order_items" ON public.order_items;
CREATE POLICY "Suppliers can view their order_items" ON public.order_items
  FOR SELECT USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.supplier_id = auth.uid()
    )
  );