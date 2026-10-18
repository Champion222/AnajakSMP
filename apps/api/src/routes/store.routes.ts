import { Router } from 'express';
import { StoreController } from '../controllers/store.controller.js';

const router = Router();

router.get('/categories', StoreController.getCategories);
router.get('/products', StoreController.getProducts);
router.get('/products/:slug', StoreController.getProductBySlug);
router.get('/settings', StoreController.getStoreSettings);
router.get('/server-status', StoreController.getServerStatus);

export default router;
