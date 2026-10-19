-- ==============================================================================
-- OREOS DELICACIES - Complete Supabase Database Schema
-- Brand: "OREOS DELICACIES" (Oreofe Abisola)
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_settings',
    business_name TEXT NOT NULL DEFAULT 'OREOS DELICACIES',
    tagline TEXT NOT NULL DEFAULT 'Exceptional Cake and Pastries',
    owner_name TEXT NOT NULL DEFAULT 'Oreofe Abisola',
    phone TEXT NOT NULL DEFAULT '09154667248',
    whatsapp TEXT NOT NULL DEFAULT '2347033396558',
    whatsapp_display TEXT NOT NULL DEFAULT '07033396558',
    tiktok_handle TEXT NOT NULL DEFAULT '@oreosdelicacies',
    tiktok_url TEXT NOT NULL DEFAULT 'https://www.tiktok.com/@oreosdelicacies',
    address TEXT NOT NULL DEFAULT 'Isolu, near Cornerstone Gym Center and Isolu Car Wash, FUNAAB, Abeokuta, Ogun State',
    google_maps_embed TEXT,
    hours_weekday TEXT NOT NULL DEFAULT 'Monday - Saturday: 8:00 AM – 8:00 PM',
    hours_sunday TEXT NOT NULL DEFAULT 'Sunday: 10:00 AM – 6:00 PM',
    weekday_open_hour INT DEFAULT 8,
    weekday_close_hour INT DEFAULT 20,
    sunday_open_hour INT DEFAULT 10,
    sunday_close_hour INT DEFAULT 18,
    announcement_banner TEXT,
    announcement_active BOOLEAN DEFAULT true,
    about_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Delivery Areas Table
CREATE TABLE IF NOT EXISTS public.delivery_areas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    time_estimate TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_signature BOOLEAN DEFAULT false,
    is_sold_out BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    variants JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { name: text, price: numeric }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Orders Table (Captured from WhatsApp checkout & Admin)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_area TEXT NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, delivered, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Event Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT,
    guest_count TEXT,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, contacted, booked, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT,
    caption TEXT,
    image TEXT NOT NULL,
    category TEXT DEFAULT 'Pastries',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    location TEXT,
    rating INT DEFAULT 5,
    comment TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- Public can read active items, admin has full access
-- ==============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all catalog tables
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view delivery areas" ON public.delivery_areas FOR SELECT USING (true);
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public can view active reviews" ON public.reviews FOR SELECT USING (is_active = true);

-- Allow public to insert orders and event enquiries
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Allow full access to authenticated users (Admin)
CREATE POLICY "Admins full access settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access categories" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access delivery areas" ON public.delivery_areas FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access menu items" ON public.menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access enquiries" ON public.enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access gallery" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access reviews" ON public.reviews FOR ALL TO authenticated USING (true);
