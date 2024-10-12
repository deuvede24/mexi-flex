import { Router } from 'express';
import { getRecipeCategoryCount, getPopularRecipes, getTopRankedRecipes } from '../controllers/chartController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js'; // Asegurarse de que solo usuarios autenticados puedan ver los gráficos

const router = Router();

// **Rutas para obtener estadísticas y gráficos**
router.get('/category-count', authenticateToken(), getRecipeCategoryCount); // Obtener el conteo de recetas por categoría
router.get('/popular-recipes', authenticateToken(), getPopularRecipes); // Obtener las recetas más populares
router.get('/top-ranked-recipes', authenticateToken(), getTopRankedRecipes); // Obtener las recetas con mejor ranking

export default router;
