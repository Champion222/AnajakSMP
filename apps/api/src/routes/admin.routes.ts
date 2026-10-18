import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAdminAuth, requireRole } from '../middleware/admin-auth.middleware.js';
import { adminLoginRateLimiter } from '../middleware/rate-limiter.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  AdminLoginSchema,
  ProductCreateSchema,
  ProductUpdateSchema,
  CouponCreateSchema,
  StoreSettingsUpdateSchema,
} from '@anajaksmp/shared';

const router = Router();

// 1. Admin Authentication
router.post(
  '/auth/login',
  adminLoginRateLimiter,
  validateBody(AdminLoginSchema),
  AdminController.login
);

// 2. Protected Admin Endpoints
router.use(requireAdminAuth);

// Dashboard
router.get('/dashboard', AdminController.getDashboard);

// Orders
router.get('/orders', AdminController.getOrders);
router.get('/orders/:id', AdminController.getOrderDetails);
router.post(
  '/orders/:id/retry-fulfillment',
  requireRole(['OWNER', 'ADMIN']),
  AdminController.retryFulfillment
);
router.post(
  '/orders/:id/manual-verify',
  requireRole(['OWNER', 'ADMIN']),
  AdminController.manualVerifyPayment
);

// Products
router.get('/products', AdminController.getProducts);
router.post(
  '/products',
  requireRole(['OWNER', 'ADMIN']),
  validateBody(ProductCreateSchema),
  AdminController.createProduct
);
router.patch(
  '/products/:id',
  requireRole(['OWNER', 'ADMIN']),
  validateBody(ProductUpdateSchema),
  AdminController.updateProduct
);
router.delete(
  '/products/:id',
  requireRole(['OWNER', 'ADMIN']),
  AdminController.deleteProduct
);

// Coupons
router.get('/coupons', AdminController.getCoupons);
router.post(
  '/coupons',
  requireRole(['OWNER', 'ADMIN']),
  validateBody(CouponCreateSchema),
  AdminController.createCoupon
);
router.patch(
  '/coupons/:id',
  requireRole(['OWNER', 'ADMIN']),
  AdminController.updateCoupon
);

// Settings (Owner only)
router.get('/settings', AdminController.getSettings);
router.patch(
  '/settings',
  requireRole(['OWNER']),
  validateBody(StoreSettingsUpdateSchema),
  AdminController.updateSettings
);

// Audit Logs (Owner and Admin)
router.get('/audit-logs', requireRole(['OWNER', 'ADMIN']), AdminController.getAuditLogs);

// Support Tickets
router.get('/tickets', AdminController.getSupportTickets);
router.patch('/tickets/:id', AdminController.updateSupportTicket);

// Staff Team Management
router.get('/team', AdminController.getTeam);
router.post('/team', requireRole(['OWNER', 'ADMIN']), AdminController.saveTeam);

export default router;
