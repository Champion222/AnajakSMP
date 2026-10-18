import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { checkoutRateLimiter } from '../middleware/rate-limiter.middleware.js';
import { CheckoutRequestSchema, CouponValidateSchema } from '@anajaksmp/shared';

const router = Router();

router.post(
  '/validate-coupon',
  validateBody(CouponValidateSchema),
  CheckoutController.validateCoupon
);

router.post(
  '/',
  checkoutRateLimiter,
  validateBody(CheckoutRequestSchema),
  CheckoutController.createCheckoutOrder
);

export default router;
