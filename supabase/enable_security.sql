-- ==============================================================================
-- AnajakSMP.xyz - Enable Production Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable RLS on all existing tables (Safe with IF EXISTS)
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fulfillment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fulfillment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_pages ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any existing policies
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Public can view active categories" ON product_categories;
DROP POLICY IF EXISTS "Public can view store settings" ON store_settings;
DROP POLICY IF EXISTS "Public can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Public can view team members" ON team_members;
DROP POLICY IF EXISTS "Public can view site pages" ON site_pages;

-- 3. Create Public Read Policies (Allow users on the website to view catalog)
CREATE POLICY "Public can view active products" ON products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view active categories" ON product_categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view store settings" ON store_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public can view team members" ON team_members
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view site pages" ON site_pages
  FOR SELECT TO anon, authenticated USING (true);
