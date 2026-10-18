import { z } from 'zod';

export const MinecraftUsernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

export const CheckoutRequestSchema = z.object({
  minecraft_username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(16, 'Username must not exceed 16 characters')
    .regex(MinecraftUsernameRegex, 'Invalid Minecraft username format (letters, numbers, underscore only)'),
  customer_email: z.string().trim().email('Invalid email address format'),
  payment_method: z.enum(['ABA_PAYWAY', 'KHQR']),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Invalid product ID'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity maximum is 99'),
      })
    )
    .min(1, 'Shopping cart cannot be empty'),
  coupon_code: z.string().trim().max(30).optional().nullable(),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Refund Policy',
  }),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export const CouponValidateSchema = z.object({
  code: z.string().trim().min(1, 'Coupon code cannot be empty'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Invalid product ID'),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'Cart items required'),
});

export type CouponValidateRequest = z.infer<typeof CouponValidateSchema>;

export const AdminLoginSchema = z.object({
  usernameOrEmail: z.string().trim().min(3, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AdminLoginRequest = z.infer<typeof AdminLoginSchema>;

export const ProductCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  slug: z.string().trim().min(2, 'Slug is required'),
  description: z.string().trim().min(5, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  price_usd: z.number().positive('Price must be positive'),
  sale_price_usd: z.number().positive('Sale price must be positive').optional().nullable(),
  image_url: z.string().url('Image must be a valid URL'),
  perks: z.array(z.string()).default([]),
  delivery_commands: z.array(z.string()).default([]),
  rank_duration: z.string().trim().optional().nullable(),
  stock: z.number().int().nonnegative().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;

export const ProductUpdateSchema = ProductCreateSchema.partial();
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;

export const CouponCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Code must be at least 3 characters')
    .toUpperCase(),
  description: z.string().trim().optional().nullable(),
  discount_type: z.enum(['PERCENTAGE', 'FIXED']),
  discount_value: z.number().positive('Discount value must be positive'),
  min_order_amount_usd: z.number().nonnegative().default(0),
  max_discount_usd: z.number().positive().optional().nullable(),
  usage_limit: z.number().int().positive().optional().nullable(),
  starts_at: z.string().datetime().optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type CouponCreateInput = z.infer<typeof CouponCreateSchema>;

export const SupportTicketSchema = z.object({
  minecraft_username: z
    .string()
    .trim()
    .min(3)
    .max(16)
    .regex(MinecraftUsernameRegex, 'Invalid Minecraft username format'),
  customer_email: z.string().trim().email(),
  order_number: z.string().trim().optional().nullable(),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export type SupportTicketInput = z.infer<typeof SupportTicketSchema>;

export const StoreSettingsUpdateSchema = z.object({
  store_name: z.string().trim().min(2).optional(),
  store_logo_url: z.string().url().optional(),
  announcement_text: z.string().optional(),
  announcement_active: z.boolean().optional(),
  server_ip: z.string().trim().optional(),
  server_port: z.number().int().optional(),
  default_currency: z.enum(['USD', 'KHR']).optional(),
  exchange_rate_usd_to_khr: z.number().positive().optional(),
  maintenance_mode: z.boolean().optional(),
  aba_payway_enabled: z.boolean().optional(),
  khqr_enabled: z.boolean().optional(),
  payment_sandbox_mode: z.boolean().optional(),
  contact_email: z.string().email().optional(),
  discord_url: z.string().url().optional().or(z.literal('')),
  telegram_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  terms_content: z.string().optional(),
  refund_policy_content: z.string().optional(),
  privacy_policy_content: z.string().optional(),
  rcon_host: z.string().optional(),
  rcon_port: z.number().int().optional(),
  rcon_timeout_ms: z.number().int().optional(),
});

export type StoreSettingsUpdateInput = z.infer<typeof StoreSettingsUpdateSchema>;
