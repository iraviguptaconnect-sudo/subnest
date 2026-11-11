-- ============================================================
-- NEXORA SUPABASE DATABASE SCHEMA
-- Run this query in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ============================================================

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL,
    plan_duration TEXT DEFAULT '',
    amount NUMERIC NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    utr_number TEXT NOT NULL,
    payment_method TEXT DEFAULT 'paytm',
    status TEXT NOT NULL DEFAULT 'pending_verification',
    credentials_note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create index on order_id and customer_phone for instant search
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_utr ON public.orders(utr_number);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow anyone (public anon) to insert a new order
CREATE POLICY "Public users can insert orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to search their own order by order_id or phone
CREATE POLICY "Public users can view orders"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updates (e.g. status change)
CREATE POLICY "Allow update orders"
ON public.orders
FOR UPDATE
TO anon, authenticated
USING (true);

-- 5. Optional Site Settings Table (for dynamic UPI ID / Announcement banner)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    upi_id TEXT DEFAULT '9347610989@pthdfc',
    merchant_name TEXT DEFAULT 'NAMAN JAIN',
    whatsapp_number TEXT DEFAULT '919347610989',
    announcement_active BOOLEAN DEFAULT true,
    announcement_text TEXT DEFAULT '⚡ Instant Delivery on WhatsApp within 5-10 Minutes!',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site_settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.site_settings (id, upi_id, merchant_name, whatsapp_number)
VALUES ('singleton', '9347610989@pthdfc', 'NAMAN JAIN', '919347610989')
ON CONFLICT (id) DO NOTHING;

