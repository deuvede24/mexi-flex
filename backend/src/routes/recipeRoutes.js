// src/routes/recipeRoutes.js
import { Router } from 'express';
import {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { recipeValidator, recipeValidatorPatch } from '../validations/recipeValidation.js';
import { idValidator } from '../validations/genericValidation.js';

const router = Router();

// Obtener receta por ID con ingredientes
router.get('/:id', getRecipeById);

// Crear receta con ingredientes (solo admin)
router.post('/', authenticateToken(['admin']), recipeValidator, addRecipe);

// Actualizar receta (solo admin) - Si decides usar solo PUT, elimina PATCH
router.put('/:id', authenticateToken(['admin']), idValidator, recipeValidator, updateRecipe);

// O bien, si necesitas PATCH para actualizaciones parciales:
router.patch('/:id', authenticateToken(['admin']), idValidator, recipeValidatorPatch, updateRecipe);

// Eliminar receta (solo admin)
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteRecipe);

// Obtener todas las recetas (controla los invitados)
router.get('/', getRecipes);

export default router;




