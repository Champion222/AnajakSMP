import { Router } from 'express';
import { SupportController } from '../controllers/support.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { supportRateLimiter } from '../middleware/rate-limiter.middleware.js';
import { SupportTicketSchema } from '@anajaksmp/shared';

const router = Router();

router.post(
  '/tickets',
  supportRateLimiter,
  validateBody(SupportTicketSchema),
  SupportController.submitTicket
);

export default router;
