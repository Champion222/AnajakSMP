import { Router } from 'express';
import { StoreController } from '../controllers/store.controller.js';

const router = Router();

router.get('/categories', StoreController.getCategories);
router.get('/products', StoreController.getProducts);
router.get('/products/:slug', StoreController.getProductBySlug);
router.get('/team', StoreController.getTeam);
router.get('/settings', StoreController.getStoreSettings);
router.get('/server-status', StoreController.getServerStatus);
router.get('/page-controls', StoreController.getPageControls);

export default router;
