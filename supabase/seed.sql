-- ==============================================================================
-- AnajakSMP.xyz - Complete Supabase Setup (Run this in Supabase SQL Editor)
-- Includes: Schema, Row Level Security (RLS), and Initial Seed Data
-- ==============================================================================

-- 1. Run Migrations:
-- Step 1: Initial Schema
-- Step 2: Row Level Security Policies
-- Step 3: Seed Categories, Products, Settings, and Default Coupons

\i supabase/migrations/001_initial_schema.sql
\i supabase/migrations/002_row_level_security.sql
\i supabase/migrations/003_seed_data.sql
