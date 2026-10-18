import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';

const router = Router();

router.get('/status', OrderController.getOrderStatus);
router.get('/status/:orderNumber', OrderController.getOrderStatus);

export default router;
