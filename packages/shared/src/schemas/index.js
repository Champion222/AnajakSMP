"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreSettingsUpdateSchema = exports.SupportTicketSchema = exports.CouponCreateSchema = exports.ProductUpdateSchema = exports.ProductCreateSchema = exports.AdminLoginSchema = exports.CouponValidateSchema = exports.CheckoutRequestSchema = exports.MinecraftUsernameRegex = void 0;
const zod_1 = require("zod");
exports.MinecraftUsernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
exports.CheckoutRequestSchema = zod_1.z.object({
    minecraft_username: zod_1.z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(16, 'Username must not exceed 16 characters')
        .regex(exports.MinecraftUsernameRegex, 'Invalid Minecraft username format (letters, numbers, underscore only)'),
    customer_email: zod_1.z.string().trim().email('Invalid email address format'),
    payment_method: zod_1.z.enum(['ABA_PAYWAY', 'KHQR']),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1, 'Invalid product ID'),
        quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity maximum is 99'),
    }))
        .min(1, 'Shopping cart cannot be empty'),
    coupon_code: zod_1.z.string().trim().max(30).optional().nullable(),
    agree_terms: zod_1.z.boolean().refine((val) => val === true, {
        message: 'You must agree to the Terms of Service and Refund Policy',
    }),
});
exports.CouponValidateSchema = zod_1.z.object({
    code: zod_1.z.string().trim().min(1, 'Coupon code cannot be empty'),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1, 'Invalid product ID'),
        quantity: zod_1.z.number().int().min(1),
    }))
        .min(1, 'Cart items required'),
});
exports.AdminLoginSchema = zod_1.z.object({
    usernameOrEmail: zod_1.z.string().trim().min(3, 'Username or email is required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.ProductCreateSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name is required'),
    slug: zod_1.z.string().trim().min(2, 'Slug is required'),
    description: zod_1.z.string().trim().min(5, 'Description is required'),
    category_id: zod_1.z.string().min(1, 'Category is required'),
    price_usd: zod_1.z.number().positive('Price must be positive'),
    sale_price_usd: zod_1.z.number().positive('Sale price must be positive').optional().nullable(),
    image_url: zod_1.z.string().url('Image must be a valid URL'),
    perks: zod_1.z.array(zod_1.z.string()).default([]),
    delivery_commands: zod_1.z.array(zod_1.z.string()).default([]),
    rank_duration: zod_1.z.string().trim().optional().nullable(),
    stock: zod_1.z.number().int().nonnegative().optional().nullable(),
    is_featured: zod_1.z.boolean().default(false),
    is_active: zod_1.z.boolean().default(true),
    display_order: zod_1.z.number().int().default(0),
});
exports.ProductUpdateSchema = exports.ProductCreateSchema.partial();
exports.CouponCreateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .trim()
        .min(3, 'Code must be at least 3 characters')
        .toUpperCase(),
    description: zod_1.z.string().trim().optional().nullable(),
    discount_type: zod_1.z.enum(['PERCENTAGE', 'FIXED']),
    discount_value: zod_1.z.number().positive('Discount value must be positive'),
    min_order_amount_usd: zod_1.z.number().nonnegative().default(0),
    max_discount_usd: zod_1.z.number().positive().optional().nullable(),
    usage_limit: zod_1.z.number().int().positive().optional().nullable(),
    starts_at: zod_1.z.string().datetime().optional().nullable(),
    expires_at: zod_1.z.string().datetime().optional().nullable(),
    is_active: zod_1.z.boolean().default(true),
});
exports.SupportTicketSchema = zod_1.z.object({
    minecraft_username: zod_1.z
        .string()
        .trim()
        .min(3)
        .max(16)
        .regex(exports.MinecraftUsernameRegex, 'Invalid Minecraft username format'),
    customer_email: zod_1.z.string().trim().email(),
    order_number: zod_1.z.string().trim().optional().nullable(),
    subject: zod_1.z.string().trim().min(5, 'Subject must be at least 5 characters'),
    message: zod_1.z.string().trim().min(10, 'Message must be at least 10 characters'),
});
exports.StoreSettingsUpdateSchema = zod_1.z.object({
    store_name: zod_1.z.string().trim().min(2).optional(),
    store_logo_url: zod_1.z.string().url().optional(),
    announcement_text: zod_1.z.string().optional(),
    announcement_active: zod_1.z.boolean().optional(),
    server_ip: zod_1.z.string().trim().optional(),
    server_port: zod_1.z.number().int().optional(),
    default_currency: zod_1.z.enum(['USD', 'KHR']).optional(),
    exchange_rate_usd_to_khr: zod_1.z.number().positive().optional(),
    maintenance_mode: zod_1.z.boolean().optional(),
    aba_payway_enabled: zod_1.z.boolean().optional(),
    khqr_enabled: zod_1.z.boolean().optional(),
    payment_sandbox_mode: zod_1.z.boolean().optional(),
    contact_email: zod_1.z.string().email().optional(),
    discord_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    telegram_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    facebook_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    terms_content: zod_1.z.string().optional(),
    refund_policy_content: zod_1.z.string().optional(),
    privacy_policy_content: zod_1.z.string().optional(),
    rcon_host: zod_1.z.string().optional(),
    rcon_port: zod_1.z.number().int().optional(),
    rcon_timeout_ms: zod_1.z.number().int().optional(),
});
