# AnajakSMP.xyz — Supabase Database Setup & Migrations Guide

This guide details how to configure Supabase PostgreSQL, execute schema migrations, configure Row Level Security (RLS), and seed the initial catalog.

---

## 1. Creating a Supabase Project

1. Log in to [Supabase.com](https://supabase.com).
2. Click **New Project**.
3. Select your organization and choose a region close to Cambodia / Southeast Asia (e.g. `Singapore - ap-southeast-1`).
4. Set a strong database password and copy it down.

---

## 2. Running Database Migrations

You can run the migrations either via the **Supabase Dashboard SQL Editor** or via the **Supabase CLI**.

### Option A: Via Supabase SQL Editor (Fastest & Recommended)

1. In your Supabase project dashboard, navigate to **SQL Editor** on the left menu.
2. Click **New query**.
3. Open and paste the contents of:
   - `supabase/migrations/001_initial_schema.sql` (Tables, ENUMs, triggers, and foreign keys)
   - Click **Run**.
4. Open and paste:
   - `supabase/migrations/002_row_level_security.sql` (Row Level Security policies)
   - Click **Run**.
5. Open and paste:
   - `supabase/migrations/003_seed_data.sql` (Initial products, categories, coupons, and owner admin)
   - Click **Run**.

Alternatively, you can run all three files sequentially by pasting the unified `supabase/seed.sql` script into the SQL Editor.

---

## 3. Database Tables Reference

| Table Name | Description | RLS Policy |
| :--- | :--- | :--- |
| `store_settings` | Global store settings, server IP, exchange rate | Public read, Service Role write |
| `admin_users` | Staff credentials with bcrypt password hashes | Strictly Service Role |
| `admin_audit_logs` | Audit trail of admin actions | Strictly Service Role |
| `product_categories` | Ranks, Crate Keys, Coins, Bundles, etc. | Public read active items |
| `products` | Ranks & server item catalog with perks & commands | Public read active items |
| `coupons` | Promo discount codes and redemption limits | Evaluated via server API |
| `orders` | Guest orders, pricing, totals in USD & KHR | Mediated by Secret Access Token |
| `order_items` | Snapshot of purchased perks & delivery commands | Strictly Service Role / Token check |
| `payments` | Transaction references, KHQR payloads, status | Strictly Service Role |
| `payment_events` | Webhook log for duplicate prevention | Strictly Service Role |
| `fulfillment_jobs` | In-game command queue and execution status | Strictly Service Role |
| `support_tickets` | Customer inquiries and order issues | Public insert, Service Role review |

---

## 4. Connecting Backend to Supabase

1. In Supabase, go to **Project Settings** -> **API**.
2. Find the following credentials:
   - **Project URL**: copy to `SUPABASE_URL` in `apps/api/.env`
   - **anon public**: copy to `SUPABASE_ANON_KEY` in `apps/api/.env`
   - **service_role secret**: copy to `SUPABASE_SERVICE_ROLE_KEY` in `apps/api/.env`

> [!CAUTION]
> The `service_role` key bypasses all Row Level Security policies. It MUST ONLY be configured in `apps/api/.env` on the server and must NEVER be exposed in frontend React code.

3. Restart the API server. You will see:
   ```
   ✅ [Database] Connected to Supabase at: https://your-project.supabase.co
   ```
