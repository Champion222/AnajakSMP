import { Router } from 'express';
import storeRoutes from './store.routes.js';
import checkoutRoutes from './checkout.routes.js';
import paymentRoutes from './payment.routes.js';
import orderRoutes from './order.routes.js';
import supportRoutes from './support.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/store', storeRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/payments', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);

export default router;
