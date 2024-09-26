/*import { Router } from 'express';
import { getRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { recipeValidator } from '../validations/recipeValidation.js';
import { idValidator } from '../validations/genericValidation.js';

const router = Router();

router.get('/:id', getRecipeById);
router.post('/', authenticateToken(['user', 'admin']), recipeValidator, addRecipe);

// Aquí añadimos ambas rutas para actualizar recetas: PUT y PATCH
router.put('/:id', authenticateToken(['user', 'admin']), idValidator, recipeValidator, updateRecipe);
router.patch('/:id', authenticateToken(['user', 'admin']), idValidator, recipeValidator, updateRecipe);

router.delete('/:id', authenticateToken(['user','admin']), idValidator, deleteRecipe);

// Ruta accesible para todos para obtener las recetas
router.get('/', getRecipes); 

export default router;*/

//NEW
// src/routes/recipeRoutes.js
import { Router } from 'express';
import {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeCategoryCount
} from '../controllers/recipeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { recipeValidator } from '../validations/recipeValidation.js';
import { idValidator } from '../validations/genericValidation.js';

const router = Router();

router.get('/category-count', getRecipeCategoryCount);

// Obtener receta por ID con versiones e ingredientes
router.get('/:id', getRecipeById);

// Crear receta con versiones e ingredientes (solo admin)
router.post('/', authenticateToken(['admin']), recipeValidator, addRecipe);

// Actualizar receta (solo admin)
router.put('/:id', authenticateToken(['admin']), idValidator, recipeValidator, updateRecipe);

// Eliminar receta (solo admin)
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteRecipe);

// Obtener todas las recetas (controla los invitados)
router.get('/', getRecipes);

export default router;



