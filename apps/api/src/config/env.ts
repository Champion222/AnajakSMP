import dotenv from 'dotenv';
import path from 'path';

// Load from apps/api/.env or current working directory
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  // Auth
  JWT_SECRET: process.env.JWT_SECRET || 'anajaksmp_super_secure_jwt_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_PANEL_PATH: process.env.ADMIN_PANEL_PATH || '/control-panel',
  
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
