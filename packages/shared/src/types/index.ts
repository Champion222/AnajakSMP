export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'DELIVERED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'ABA_PAYWAY' | 'KHQR';

export type AdminRole = 'OWNER' | 'ADMIN' | 'SUPPORT';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string;
  category?: ProductCategory;
  price_usd: number;
  sale_price_usd: number | null;
  image_url: string;
  perks: string[];
  delivery_commands: string[];
  rank_duration: string | null;
  stock: number | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount_usd: number;
  max_discount_usd: number | null;
  usage_limit: number | null;
  times_used: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  unit_price_usd: number;
  quantity: number;
  line_total_usd: number;
  perks_snapshot?: string[];
  commands_snapshot?: string[];
}

export interface Payment {
  id: string;
  order_id: string;
  provider: PaymentMethod;
  provider_tx_id?: string | null;
  provider_ref?: string | null;
  amount_usd: number;
  amount_khr: number;
  status: PaymentStatus;
  qr_payload?: string | null;
  payment_url?: string | null;
  expires_at?: string | null;
  paid_at?: string | null;
  raw_payload?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface FulfillmentJob {
  id: string;
  order_id: string;
  minecraft_username: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'DELIVERED' | 'FAILED';
  error_message?: string | null;
  attempts: number;
  max_attempts: number;
  commands: string[];
  executed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  access_token: string;
  minecraft_username: string;
  customer_email: string;
  subtotal_usd: number;
  discount_usd: number;
  total_usd: number;
  total_khr: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  coupon_id?: string | null;
  coupon_code?: string | null;
  items: OrderItem[];
  payment?: Payment;
  fulfillment_jobs?: FulfillmentJob[];
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  store_logo_url: string;
  announcement_text: string;
  announcement_active: boolean;
  server_ip: string;
  server_port: number;
  default_currency: 'USD' | 'KHR';
  exchange_rate_usd_to_khr: number;
  maintenance_mode: boolean;
  aba_payway_enabled: boolean;
  khqr_enabled: boolean;
  payment_sandbox_mode: boolean;
  contact_email: string;
  discord_url: string;
  telegram_url: string;
  facebook_url: string;
  terms_content: string;
  refund_policy_content: string;
  privacy_policy_content: string;
  rcon_host?: string;
  rcon_port?: number;
  rcon_timeout_ms?: number;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  order_number?: string | null;
  minecraft_username: string;
  customer_email: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_username: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
}
