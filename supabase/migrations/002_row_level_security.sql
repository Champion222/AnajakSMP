-- ==============================================================================
-- AnajakSMP.xyz - Supabase Row Level Security (RLS) Policies
-- Migration: 002_row_level_security.sql
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- 1. Store Settings RLS
-- Anyone can view store settings
CREATE POLICY "Public can view store settings"
ON store_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Only service role can modify store settings
CREATE POLICY "Service role can modify store settings"
ON store_settings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. Product Categories RLS
-- Public can view active categories
CREATE POLICY "Public can view active product categories"
ON product_categories FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Service role full access
CREATE POLICY "Service role has full access to categories"
ON product_categories FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Products RLS
-- Public can view active products
CREATE POLICY "Public can view active products"
ON products FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Service role full access
CREATE POLICY "Service role has full access to products"
ON products FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Coupons RLS
-- Public cannot view all coupons directly (checked via backend API to prevent scraping)
CREATE POLICY "Service role has full access to coupons"
ON coupons FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Orders and Order Items RLS
-- Public cannot query arbitrary orders. Order lookup is mediated via secure backend API with access token
CREATE POLICY "Service role has full access to orders"
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to order items"
ON order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to coupon redemptions"
ON coupon_redemptions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 6. Payments and Events RLS
-- Strictly restricted to backend service role
CREATE POLICY "Service role has full access to payments"
ON payments FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to payment events"
ON payment_events FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Fulfillment RLS
CREATE POLICY "Service role has full access to fulfillment jobs"
ON fulfillment_jobs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to fulfillment attempts"
ON fulfillment_attempts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 8. Support Tickets RLS
-- Public can insert support tickets
CREATE POLICY "Public can submit support tickets"
ON support_tickets FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Public cannot view or update all support tickets directly
CREATE POLICY "Service role has full access to support tickets"
ON support_tickets FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 9. Admin Users & Audit Logs RLS
-- Strictly service role access
CREATE POLICY "Service role has full access to admin users"
ON admin_users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to audit logs"
ON admin_audit_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
