-- ==============================================================================
-- AnajakSMP.xyz - Complete Supabase Cloud Database Update & Seed Script
-- Instructions: Copy and paste this entire script into your Supabase SQL Editor and click "Run"
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ensure Additional Tables Exist
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_group VARCHAR(50) NOT NULL,
  ign VARCHAR(50) NOT NULL,
  skin_username VARCHAR(50) NOT NULL,
  discord_tag VARCHAR(100) NOT NULL,
  has_chat BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_pages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_soon BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Disable Row Level Security (RLS) on all tables to allow full Admin Add/Edit/Delete access
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS store_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fulfillment_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS support_ticket_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_pages DISABLE ROW LEVEL SECURITY;

-- 4. Grant Full Permissions to anon, authenticated, and service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Seed / Update Categories (Only Ranks and Crate Keys active)
INSERT INTO product_categories (id, slug, name, description, icon_name, display_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'ranks', 'Ranks', 'Permanent and prestigious server rank upgrades with exclusive abilities', 'Crown', 1, true),
('c0000000-0000-0000-0000-000000000002', 'crate-keys', 'Crate Keys', 'Unlock mythic rewards, spawner drops, and enchanted equipment at spawn crates', 'Key', 2, true),
('c0000000-0000-0000-0000-000000000003', 'coins-currency', 'Coins & Currency', 'Server currency packs', 'Coins', 3, false),
('c0000000-0000-0000-0000-000000000004', 'cosmetics', 'Cosmetics', 'Particle halos and vanity items', 'Sparkles', 4, false),
('c0000000-0000-0000-0000-000000000005', 'pets-companions', 'Pets & Companions', 'Companions', 'Heart', 5, false),
('c0000000-0000-0000-0000-000000000006', 'bundles', 'Bundles', 'Combo packs', 'Package', 6, false),
('c0000000-0000-0000-0000-000000000007', 'special-offers', 'Special Offers', 'Seasonal items', 'Flame', 7, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

UPDATE product_categories SET is_active = false WHERE slug NOT IN ('ranks', 'crate-keys');

-- 6. Seed / Update Products (Ranks & Crate Keys)
-- (We omit the 'id' column so PostgreSQL automatically uses uuid_generate_v4() for new items
--  and updates existing items matched by slug, completely preventing duplicate id errors!)

-- 6.1 Ranks
INSERT INTO products (
  slug, name, description, category_id, price_usd, sale_price_usd, image_url, perks, delivery_commands, rank_duration, is_featured, is_active, display_order
) VALUES
(
  'vip-rank',
  'VIP Rank',
  'The premier entry rank for every AnajakSMP survivalist. Includes chat perks, claim fly, extra homes, and diamond kits.',
  (SELECT id FROM product_categories WHERE slug = 'ranks' LIMIT 1),
  4.99,
  null,
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
  '["[VIP] Chat Tag & Prefix", "Fly ability in claims (/fly)", "3 Extra Home Teleports (/sethome)", "VIP Weekly Diamond Kit", "Access to /hat and /workbench", "Priority server queue slot"]'::jsonb,
  '["lp user {username} parent add vip", "broadcast &6[Store] &fPlayer &e{username} &fhas purchased &6VIP Rank!"]'::jsonb,
  'Permanent Lifetime',
  false,
  true,
  1
),
(
  'mvp-rank',
  'MVP Rank',
  'Advanced rank upgrade with quality of life automation, extra land claims, and superior kits.',
  (SELECT id FROM product_categories WHERE slug = 'ranks' LIMIT 1),
  12.99,
  9.99,
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
  '["All VIP perks included", "[MVP] Cyan Diamond Prefix", "6 Extra Home Teleports", "Access to /feed and /condense", "MVP Weekly Kit with Netherite", "Keep Inventory in Wilderness", "Double claim accrual rate"]'::jsonb,
  '["lp user {username} parent add mvp", "broadcast &b[Store] &fPlayer &e{username} &fhas ascended to &bMVP Rank!"]'::jsonb,
  'Permanent Lifetime',
  true,
  true,
  2
),
(
  'mvp-plus-rank',
  'MVP+ Rank',
  'Elite prestige rank with full survival utility, auto-sorting, and monthly key crates.',
  (SELECT id FROM product_categories WHERE slug = 'ranks' LIMIT 1),
  24.99,
  19.99,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
  '["All VIP & MVP perks included", "[MVP+] Emerald Prefix", "10 Extra Home Teleports", "/heal command (30m cooldown)", "/craft and /enderchest anywhere", "Automatic chest sorting", "1x Free Mythic Spawner Key monthly"]'::jsonb,
  '["lp user {username} parent add mvpplus", "broadcast &a[Store] &fPlayer &e{username} &fhas unlocked &aMVP+ Rank!"]'::jsonb,
  'Permanent Lifetime',
  true,
  true,
  3
),
(
  'anajak-titan-rank',
  'Anajak Titan Rank',
  'The supreme apex rank of AnajakSMP. Ultimate dominance, exclusive Titan armor, and prestige.',
  (SELECT id FROM product_categories WHERE slug = 'ranks' LIMIT 1),
  49.99,
  39.99,
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80',
  '["All VIP, MVP & MVP+ perks included", "[TITAN] Chat Prefix & Glow", "20 Extra Home Teleports", "/repair hand without XP cost", "Custom particle trail", "1.5x Economy Multiplier", "Exclusive Titan Discord role"]'::jsonb,
  '["lp user {username} parent add titan", "broadcast &d&l[Store] &fPlayer &e{username} &d&lunlocked &d&lTITAN RANK!"]'::jsonb,
  'Permanent Lifetime',
  true,
  true,
  4
),
(
  'custom-rank',
  'Custom Rank',
  'Design your own server identity! Choose your custom in-game prefix, chat color, custom join broadcast, and receive all top-tier perks.',
  (SELECT id FROM product_categories WHERE slug = 'ranks' LIMIT 1),
  49.99,
  null,
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
  '["⭐ Choose your custom prefix (up to 12 chars)", "⭐ Choose your chat & prefix color", "⭐ Custom join broadcast announcement", "ALL server commands unlocked", "Unlimited Home Teleports", "Direct contact with Owner", "Permanent Lifetime Status"]'::jsonb,
  '["lp user {username} parent add custom", "broadcast &e[Store] &6Player &e{username} &6unlocked Custom Rank!"]'::jsonb,
  'Permanent Lifetime',
  true,
  true,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  sale_price_usd = EXCLUDED.sale_price_usd,
  image_url = EXCLUDED.image_url,
  perks = EXCLUDED.perks,
  delivery_commands = EXCLUDED.delivery_commands,
  rank_duration = EXCLUDED.rank_duration,
  is_featured = EXCLUDED.is_featured,
  is_active = true,
  display_order = EXCLUDED.display_order;

-- 6.2 Crate Keys
INSERT INTO products (
  slug, name, description, category_id, price_usd, sale_price_usd, image_url, perks, delivery_commands, rank_duration, is_featured, is_active, display_order
) VALUES
(
  'common-key',
  'Common Key',
  'Open the Common Crate at spawn crates. Win iron gear, building materials, and food supplies.',
  (SELECT id FROM product_categories WHERE slug = 'crate-keys' LIMIT 1),
  1.00,
  null,
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
  '["Common rewards", "Basic survival items", "Great value for starters"]'::jsonb,
  '["crate key give {username} common 1", "msg {username} &7You received 1x Common Crate Key!"]'::jsonb,
  null,
  false,
  true,
  6
),
(
  'rare-key',
  'Rare Key',
  'Open the Rare Crate for diamond tools, enchanted books, and economy coin pouches.',
  (SELECT id FROM product_categories WHERE slug = 'crate-keys' LIMIT 1),
  2.50,
  null,
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  '["Rare rewards", "Better enchanted items", "Higher win chance"]'::jsonb,
  '["crate key give {username} rare 1", "msg {username} &bYou received 1x Rare Crate Key!"]'::jsonb,
  null,
  false,
  true,
  7
),
(
  'epic-key',
  'Epic Key',
  'Unlock high-tier Netherite gear, custom enchants, and rare spawner vouchers.',
  (SELECT id FROM product_categories WHERE slug = 'crate-keys' LIMIT 1),
  5.00,
  null,
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  '["Epic rewards", "Unique enchanted items", "Much better chance"]'::jsonb,
  '["crate key give {username} epic 1", "msg {username} &dYou received 1x Epic Key!"]'::jsonb,
  null,
  true,
  true,
  8
),
(
  'legendary-key',
  'Legendary Key',
  'The supreme crate key. Win spawners, Elytras, God tools, and rare particle cosmetics.',
  (SELECT id FROM product_categories WHERE slug = 'crate-keys' LIMIT 1),
  10.00,
  null,
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
  '["Legendary rewards", "Rare cosmetics & Elytras", "Best chance in the game"]'::jsonb,
  '["crate key give {username} legendary 1", "msg {username} &6&lYou received 1x Legendary Crate Key!"]'::jsonb,
  null,
  true,
  true,
  9
),
(
  'spawner-crate-key-5x',
  '5x Spawner Crate Keys',
  'Open the legendary Spawner Crate at /warp crates. Win Blaze, Iron Golem, Creeper, or Skeleton spawners!',
  (SELECT id FROM product_categories WHERE slug = 'crate-keys' LIMIT 1),
  3.99,
  null,
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
  '["5x Spawner Crate Keys bundle", "Chance to win Iron Golem spawners", "Blaze & Creeper spawners", "Instant automated delivery"]'::jsonb,
  '["crate key give {username} spawner 5", "broadcast &e{username} &6unlocked &a5x Spawner Crate Keys&6!"]'::jsonb,
  null,
  false,
  true,
  10
),
(
  'mythic-dragon-key-3x',
  '3x Mythic Dragon Keys',
  'Contains ancient Netherite enchanted tools, God apples, Elytra wings, and Custom Enchantment tomes.',
  (SELECT id FROM product_categories WHERE slug = 'crate-keys' LIMIT 1),
  7.99,
  null,
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  '["3x Mythic Dragon Crate Keys", "God apples & Netherite gear", "Elytra wings & rare cosmetics", "Instant delivery"]'::jsonb,
  '["crate key give {username} mythic 3", "broadcast &d{username} &6claimed &d3x Mythic Dragon Keys&6!"]'::jsonb,
  null,
  true,
  true,
  11
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  sale_price_usd = EXCLUDED.sale_price_usd,
  image_url = EXCLUDED.image_url,
  perks = EXCLUDED.perks,
  delivery_commands = EXCLUDED.delivery_commands,
  rank_duration = EXCLUDED.rank_duration,
  is_featured = EXCLUDED.is_featured,
  is_active = true,
  display_order = EXCLUDED.display_order;

-- Deactivate any other item types (Coins, Cosmetics, Pets, Bundles) so only Ranks and Keys show
UPDATE products
SET is_active = false
WHERE slug NOT IN (
  'vip-rank', 'mvp-rank', 'mvp-plus-rank', 'anajak-titan-rank', 'custom-rank',
  'common-key', 'rare-key', 'epic-key', 'legendary-key', 'spawner-crate-key-5x', 'mythic-dragon-key-3x'
);

-- 7. Seed Staff Team Members
DELETE FROM team_members;
INSERT INTO team_members (role_group, ign, skin_username, discord_tag, has_chat, display_order) VALUES
('OWNER', '_T_Z', '_T_Z', '_T_Z', false, 1),
('BUILDER', 'Nx4YGzz', 'Nx4YGzz', 'Nx4YGzz', true, 2),
('DEVELOPER', 'Nx4YGzz', 'Nx4YGzz', 'Nx4YGzz', true, 3),
('MODERATOR', '_T_Z', '_T_Z', '_T_Z', true, 4);

-- 8. Seed Site Pages (SOON mode state)
INSERT INTO site_pages (id, name, is_soon) VALUES
('keys', 'Crate Keys', true),
('vote', 'Vote Page', false),
('help', 'Help / Support', false)
ON CONFLICT (id) DO UPDATE SET is_soon = EXCLUDED.is_soon;

-- 9. Seed Store Settings
INSERT INTO store_settings (
  id,
  store_name,
  store_logo_url,
  announcement_text,
  announcement_active,
  server_ip,
  server_port,
  default_currency,
  exchange_rate_usd_to_khr,
  maintenance_mode,
  aba_payway_enabled,
  khqr_enabled,
  payment_sandbox_mode,
  contact_email,
  discord_url,
  telegram_url,
  facebook_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'AnajakSMP Store',
  'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=200&auto=format&fit=crop&q=80',
  '⚔️ Welcome to AnajakSMP! Use code ANAJAK10 at checkout for 10% OFF all Ranks & Keys!',
  true,
  'play.anajaksmp.xyz',
  25565,
  'USD',
  4100.00,
  false,
  true,
  true,
  true,
  'support@anajaksmp.xyz',
  'https://discord.gg/anajaksmp',
  'https://t.me/anajaksmp',
  'https://facebook.com/anajaksmp'
) ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  announcement_text = EXCLUDED.announcement_text,
  server_ip = EXCLUDED.server_ip;

-- 10. Seed Admin User (admin@anajaksmp.xyz / AdminAnajak2026!)
INSERT INTO admin_users (
  email,
  username,
  password_hash,
  role,
  is_active
) VALUES (
  'admin@anajaksmp.xyz',
  'admin',
  '$2a$10$xayraNJgrk8FFYIVWQaXQOF4T19mtztnHMb7rMtTjJaQ2dvjEM4zW',
  'OWNER',
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = true;

-- 11. Seed Promotional Coupons
INSERT INTO coupons (
  code, description, discount_type, discount_value, min_order_amount_usd, max_discount_usd, usage_limit, times_used, is_active
) VALUES
('ANAJAK10', '10% OFF any order to celebrate AnajakSMP launch', 'PERCENTAGE', 10.00, 5.00, 20.00, 500, 0, true),
('WELCOME5', '$5 OFF orders of $25 or more', 'FIXED', 5.00, 25.00, null, 200, 0, true)
ON CONFLICT (code) DO NOTHING;
