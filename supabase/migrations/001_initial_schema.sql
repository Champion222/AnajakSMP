-- ==============================================================================
-- AnajakSMP.xyz - Supabase Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE order_status_type AS ENUM (
  'AWAITING_PAYMENT',
  'PAYMENT_PENDING',
  'PAID',
  'PROCESSING',
  'DELIVERED',
  'FAILED',
  'REFUNDED',
  'CANCELLED'
);

CREATE TYPE payment_status_type AS ENUM (
  'PENDING',
  'COMPLETED',
  'FAILED',
  'EXPIRED',
  'CANCELLED',
  'REFUNDED'
);

CREATE TYPE payment_method_type AS ENUM (
  'ABA_PAYWAY',
  'KHQR'
);

CREATE TYPE admin_role_type AS ENUM (
  'OWNER',
  'ADMIN',
  'SUPPORT'
);

CREATE TYPE discount_type_enum AS ENUM (
  'PERCENTAGE',
  'FIXED'
);

CREATE TYPE fulfillment_status_type AS ENUM (
  'QUEUED',
  'IN_PROGRESS',
  'DELIVERED',
  'FAILED'
);

CREATE TYPE ticket_status_type AS ENUM (
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED'
);

-- Function to automatically update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name VARCHAR(100) NOT NULL DEFAULT 'AnajakSMP Store',
  store_logo_url TEXT NOT NULL DEFAULT '',
  announcement_text TEXT DEFAULT '🔥 Welcome to AnajakSMP Season 3! Use code ANAJAK10 for 10% off your first purchase!',
  announcement_active BOOLEAN NOT NULL DEFAULT true,
  server_ip VARCHAR(100) NOT NULL DEFAULT 'play.anajaksmp.xyz',
  server_port INTEGER NOT NULL DEFAULT 25565,
  default_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  exchange_rate_usd_to_khr NUMERIC(10, 2) NOT NULL DEFAULT 4100.00,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  aba_payway_enabled BOOLEAN NOT NULL DEFAULT true,
  khqr_enabled BOOLEAN NOT NULL DEFAULT true,
  payment_sandbox_mode BOOLEAN NOT NULL DEFAULT true,
  contact_email VARCHAR(255) NOT NULL DEFAULT 'support@anajaksmp.xyz',
  discord_url TEXT DEFAULT 'https://discord.gg/anajaksmp',
  telegram_url TEXT DEFAULT 'https://t.me/anajaksmp',
  facebook_url TEXT DEFAULT 'https://facebook.com/anajaksmp',
  terms_content TEXT NOT NULL DEFAULT 'All purchases on AnajakSMP are digital goods for the in-game Minecraft server. Chargebacks will result in a permanent ban.',
  refund_policy_content TEXT NOT NULL DEFAULT 'Due to the nature of digital goods, all sales are final unless an item is unfulfilled due to server malfunction.',
  privacy_policy_content TEXT NOT NULL DEFAULT 'We only store your Minecraft username and contact email to process payments and fulfill orders. We do not store sensitive payment credentials.',
  rcon_host VARCHAR(100) DEFAULT '127.0.0.1',
  rcon_port INTEGER DEFAULT 25575,
  rcon_password TEXT DEFAULT '',
  rcon_timeout_ms INTEGER DEFAULT 5000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_store_settings_updated_at
BEFORE UPDATE ON store_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Admin Roles and Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role admin_role_type NOT NULL DEFAULT 'ADMIN',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_admin_users_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin Audit Logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_username VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_logs_action ON admin_audit_logs(action);

-- 3. Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50) NOT NULL DEFAULT 'Sparkles',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_categories_slug ON product_categories(slug);
CREATE INDEX idx_product_categories_display_order ON product_categories(display_order);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  price_usd NUMERIC(10, 2) NOT NULL CHECK (price_usd >= 0),
  sale_price_usd NUMERIC(10, 2) CHECK (sale_price_usd IS NULL OR (sale_price_usd >= 0 AND sale_price_usd < price_usd)),
  image_url TEXT NOT NULL,
  perks JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivery_commands JSONB NOT NULL DEFAULT '[]'::jsonb,
  rank_duration VARCHAR(50),
  stock INTEGER CHECK (stock IS NULL OR stock >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type discount_type_enum NOT NULL DEFAULT 'PERCENTAGE',
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount_usd NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_amount_usd >= 0),
  max_discount_usd NUMERIC(10, 2) CHECK (max_discount_usd IS NULL OR max_discount_usd > 0),
  usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
  times_used INTEGER NOT NULL DEFAULT 0 CHECK (times_used >= 0),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(UPPER(code));

CREATE TRIGGER trg_coupons_updated_at
BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  access_token VARCHAR(64) UNIQUE NOT NULL,
  minecraft_username VARCHAR(16) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  subtotal_usd NUMERIC(10, 2) NOT NULL CHECK (subtotal_usd >= 0),
  discount_usd NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_usd >= 0),
  total_usd NUMERIC(10, 2) NOT NULL CHECK (total_usd >= 0),
  total_khr NUMERIC(12, 2) NOT NULL CHECK (total_khr >= 0),
  status order_status_type NOT NULL DEFAULT 'AWAITING_PAYMENT',
  payment_method payment_method_type NOT NULL,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  coupon_code VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_access_token ON orders(access_token);
CREATE INDEX idx_orders_minecraft_username ON orders(minecraft_username);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Coupon Redemptions
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  minecraft_username VARCHAR(16) NOT NULL,
  discount_applied_usd NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_redemptions_coupon_id ON coupon_redemptions(coupon_id);
CREATE INDEX idx_coupon_redemptions_order_id ON coupon_redemptions(order_id);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(150) NOT NULL,
  product_slug VARCHAR(100) NOT NULL,
  unit_price_usd NUMERIC(10, 2) NOT NULL CHECK (unit_price_usd >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total_usd NUMERIC(10, 2) NOT NULL CHECK (line_total_usd >= 0),
  perks_snapshot JSONB DEFAULT '[]'::jsonb,
  commands_snapshot JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 8. Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider payment_method_type NOT NULL,
  provider_tx_id VARCHAR(100),
  provider_ref VARCHAR(100),
  amount_usd NUMERIC(10, 2) NOT NULL,
  amount_khr NUMERIC(12, 2) NOT NULL,
  status payment_status_type NOT NULL DEFAULT 'PENDING',
  qr_payload TEXT,
  payment_url TEXT,
  expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_provider_tx ON payments(provider_tx_id);
CREATE INDEX idx_payments_provider_ref ON payments(provider_ref);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Payment Events / Webhook Logs (for auditing and idempotency)
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  provider payment_method_type NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  idempotency_key VARCHAR(150) UNIQUE,
  payload JSONB NOT NULL,
  is_processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_events_idempotency_key ON payment_events(idempotency_key);
CREATE INDEX idx_payment_events_created_at ON payment_events(created_at DESC);

-- 9. Fulfillment Jobs
CREATE TABLE IF NOT EXISTS fulfillment_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  minecraft_username VARCHAR(16) NOT NULL,
  status fulfillment_status_type NOT NULL DEFAULT 'QUEUED',
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  commands JSONB NOT NULL DEFAULT '[]'::jsonb,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fulfillment_jobs_order_id ON fulfillment_jobs(order_id);
CREATE INDEX idx_fulfillment_jobs_status ON fulfillment_jobs(status);
CREATE INDEX idx_fulfillment_jobs_username ON fulfillment_jobs(minecraft_username);

CREATE TRIGGER trg_fulfillment_jobs_updated_at
BEFORE UPDATE ON fulfillment_jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fulfillment Attempts (History)
CREATE TABLE IF NOT EXISTS fulfillment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES fulfillment_jobs(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  command_executed TEXT NOT NULL,
  response_text TEXT,
  is_success BOOLEAN NOT NULL,
  error_detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fulfillment_attempts_job_id ON fulfillment_attempts(job_id);

-- 10. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  order_number VARCHAR(50),
  minecraft_username VARCHAR(16) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ticket_status_type NOT NULL DEFAULT 'OPEN',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX idx_support_tickets_email ON support_tickets(customer_email);
CREATE INDEX idx_support_tickets_order ON support_tickets(order_number);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
