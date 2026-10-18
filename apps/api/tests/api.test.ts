import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.js';
import { CouponService } from '../src/services/coupon.service.js';
import { OrderService } from '../src/services/order.service.js';

const app = createServer();

describe('AnajakSMP Store API Tests', () => {
  describe('Public Store Endpoints', () => {
    it('GET /health returns 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /api/store/categories returns product categories', async () => {
      const res = await request(app).get('/api/store/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.categories)).toBe(true);
      expect(res.body.categories.length).toBeGreaterThan(0);
    });

    it('GET /api/store/products returns active products', async () => {
      const res = await request(app).get('/api/store/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
    });

    it('GET /api/store/products?category=ranks filters products by category', async () => {
      const res = await request(app).get('/api/store/products?category=ranks');
      expect(res.status).toBe(200);
      for (const prod of res.body.products) {
        expect(prod.category.slug).toBe('ranks');
      }
    });
  });

  describe('Coupon Validation & Calculation', () => {
    it('Validates 10% coupon ANAJAK10 correctly on $50 subtotal', async () => {
      const result = await CouponService.validateCoupon('ANAJAK10', 50.0);
      expect(result.isValid).toBe(true);
      expect(result.discountAmountUsd).toBe(5.0); // 10% of 50 = $5.00
    });

    it('Rejects coupon when subtotal does not meet minimum order requirement', async () => {
      const result = await CouponService.validateCoupon('WELCOME5', 10.0); // min is $25
      expect(result.isValid).toBe(false);
      expect(result.discountAmountUsd).toBe(0);
    });

    it('Rejects unknown/invalid coupon code', async () => {
      const result = await CouponService.validateCoupon('FAKE_COUPON_123', 100.0);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Guest Checkout & Price Tampering Prevention', () => {
    it('Rejects invalid Minecraft username with illegal characters or too short', async () => {
      const invalidPayload = {
        minecraft_username: 'a!', // invalid
        customer_email: 'buyer@test.com',
        payment_method: 'KHQR',
        items: [{ productId: 'b0000000-0000-0000-0000-000000000001', quantity: 1 }],
        agree_terms: true,
      };

      const res = await request(app).post('/api/checkout').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('Calculates price strictly on server and generates secure order reference and token', async () => {
      const validPayload = {
        minecraft_username: 'Notch',
        customer_email: 'notch@minecraft.net',
        payment_method: 'KHQR',
        items: [{ productId: 'b0000000-0000-0000-0000-000000000001', quantity: 1 }], // VIP rank: $4.99
        coupon_code: null,
        agree_terms: true,
      };

      const res = await request(app).post('/api/checkout').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.orderNumber).toMatch(/^ASMP-\d{4}-[A-Z0-9]+$/);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.totalUsd).toBe(4.99); // VIP rank official price
      expect(res.body.qrPayload).toBeDefined(); // KHQR string generated
    });
  });

  describe('Order Privacy & Security', () => {
    it('Forbids viewing order status without valid matching access token', async () => {
      // Create an order first
      const order = await OrderService.createOrder({
        minecraft_username: 'Alex_Survival',
        customer_email: 'alex@test.com',
        payment_method: 'KHQR',
        items: [{ productId: 'b0000000-0000-0000-0000-000000000001', quantity: 1 }],
        agree_terms: true,
      });

      // Attempt access with wrong token
      const res = await request(app)
        .get(`/api/orders/status/${order.order.order_number}`)
        .query({ token: 'wrong_invalid_access_token_123456789' });

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('Order not found or the provided access token is invalid');

      // Access with correct token
      const successRes = await request(app)
        .get(`/api/orders/status/${order.order.order_number}`)
        .query({ token: order.order.access_token });

      expect(successRes.status).toBe(200);
      expect(successRes.body.minecraftUsername).toBe('Alex_Survival');
    });
  });

  describe('Admin Security & RBAC', () => {
    it('Denies access to admin dashboard without Bearer token', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });

    it('Rejects invalid admin login credentials', async () => {
      const res = await request(app).post('/api/admin/auth/login').send({
        usernameOrEmail: 'admin@anajaksmp.xyz',
        password: 'wrong_password_123!',
      });
      expect(res.status).toBe(401);
    });
  });
});
