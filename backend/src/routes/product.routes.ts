import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

//GET /api/products/search/:name
router.get('/search', ProductController.searchByName);

// GET /api/products/search/:barcode
router.get('/search/:barcode', ProductController.searchByBarcode);

// POST /api/products/calculate
router.post('/calculate', ProductController.calculateNutriments);

export default router;