import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';

const router = Router();

router.get('/status/:orderNumber', PaymentController.getPaymentStatus);
router.post('/webhook/aba', PaymentController.handleAbaWebhook);
router.post('/simulate-sandbox', PaymentController.simulateSandboxPayment);

export default router;
