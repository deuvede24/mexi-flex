import { Router } from 'express';
import { getRecipeCategoryCount } from '../controllers/chartController.js';

const router = Router();

// Ruta para obtener el conteo de recetas por categoría
router.get('/category-count', getRecipeCategoryCount);

export default router;
