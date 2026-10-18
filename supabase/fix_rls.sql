-- ==============================================================================
-- AnajakSMP - Fix Supabase Row Level Security (RLS) for Vercel Hosting
-- Run this in your Supabase Project -> SQL Editor -> Click "Run"
-- ==============================================================================

-- 1. Allow full control over products (Add, Edit, Delete on Vercel)
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;

-- 2. Allow full control over categories (Ranks, Crate Keys)
ALTER TABLE IF EXISTS product_categories DISABLE ROW LEVEL SECURITY;

-- 3. Allow full control over team members (Add, Edit, Remove staff)
ALTER TABLE IF EXISTS team_members DISABLE ROW LEVEL SECURITY;

-- 4. Allow full control over store settings & page controls
ALTER TABLE IF EXISTS store_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coupons DISABLE ROW LEVEL SECURITY;

-- 5. Keep sensitive tables protected (Orders, Payments, Admin Users)
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view admin_users" ON admin_users;
CREATE POLICY "Public can view admin_users" ON admin_users
  FOR SELECT TO anon, authenticated USING (true);
