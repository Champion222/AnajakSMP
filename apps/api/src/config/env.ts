import dotenv from 'dotenv';
import path from 'path';
// Load from apps/api/.env, root .env, or current working directory
const cwd = process.cwd();
dotenv.config({ path: path.resolve(cwd, '.env') });
dotenv.config({ path: path.resolve(cwd, '../../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://ujjbczndunyyyteyuvtw.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'sb_publishable_xFeky9z8EE89wHcuAkDC0w_uLWTP3Bk',
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqamJjem5kdW55eXl0ZXl1dnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjIyMTYwMywiZXhwIjoyMTA3Nzk3NjAzfQ.gILqX8iGj4blscEwA8cV-b5aoaSx7PrMuP2QpppkStU',
  
  // Auth
  JWT_SECRET: process.env.JWT_SECRET || 'anajaksmp_super_secure_jwt_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_PANEL_PATH: process.env.ADMIN_PANEL_PATH || '/anajak-admin_dasboard',
  
  // ABA PayWay
  ABA_PAYWAY_MERCHANT_ID: process.env.ABA_PAYWAY_MERCHANT_ID || '',
  ABA_PAYWAY_API_KEY: process.env.ABA_PAYWAY_API_KEY || '',
  ABA_PAYWAY_API_URL: process.env.ABA_PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase',
  ABA_PAYWAY_SANDBOX: process.env.ABA_PAYWAY_SANDBOX !== 'false',
  
  // KHQR
  KHQR_MERCHANT_ID: process.env.KHQR_MERCHANT_ID || '',
  KHQR_BAKONG_ACCOUNT: process.env.KHQR_BAKONG_ACCOUNT || '',
  KHQR_MERCHANT_NAME: process.env.KHQR_MERCHANT_NAME || 'AnajakSMP Store',
  KHQR_MERCHANT_CITY: process.env.KHQR_MERCHANT_CITY || 'Phnom Penh',
  
  // Minecraft RCON
  MINECRAFT_RCON_HOST: process.env.MINECRAFT_RCON_HOST || '127.0.0.1',
  MINECRAFT_RCON_PORT: parseInt(process.env.MINECRAFT_RCON_PORT || '25575', 10),
  MINECRAFT_RCON_PASSWORD: process.env.MINECRAFT_RCON_PASSWORD || '',
  MINECRAFT_RCON_TIMEOUT: parseInt(process.env.MINECRAFT_RCON_TIMEOUT || '5000', 10),
  MINECRAFT_SERVER_STATUS_HOST: process.env.MINECRAFT_SERVER_STATUS_HOST || 'play.anajaksmp.xyz',
};
