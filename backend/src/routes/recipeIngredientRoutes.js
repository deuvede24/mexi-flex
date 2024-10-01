import { Router } from 'express';
import {
  getIngredientsByRecipeId,
  addIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
} from '../controllers/recipeIngredientController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { idValidator } from '../validations/genericValidation.js';
import { recipeIngredientValidator } from '../validations/recipeIngredientValidator.js'; // Importamos el nuevo validador

const router = Router();

// Obtener todos los ingredientes de una receta específica
router.get('/recipe/:recipeId', getIngredientsByRecipeId);

// Obtener todos los ingredientes (accesible para todos)
router.get('/', getAllIngredients);

// Añadir un ingrediente a una receta (solo admin)
router.post('/recipe/:recipeId', authenticateToken(['admin']), recipeIngredientValidator, addIngredient);

// Actualizar un ingrediente de una receta (solo admin)
router.put('/:ingredientId', authenticateToken(['admin']), idValidator, recipeIngredientValidator, updateIngredient);

// Eliminar un ingrediente de una receta (solo admin)
router.delete('/:ingredientId', authenticateToken(['admin']), idValidator, deleteIngredient);

export default router;
