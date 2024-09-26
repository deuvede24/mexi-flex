/*import { Router } from 'express';
import { getRecipeIngredients, getRecipeIngredientById, addRecipeIngredient, updateRecipeIngredient, deleteRecipeIngredient } from '../controllers/recipeIngredientController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { recipeIngredientValidator } from '../validations/recipeIngredientValidation.js';

const router = Router();

router.get('/', authenticateToken(['user', 'admin']), getRecipeIngredients);
router.get('/:recipe_id/:ingredient_id', authenticateToken(['user', 'admin']), getRecipeIngredientById);
router.post('/', authenticateToken(['user', 'admin']), recipeIngredientValidator, addRecipeIngredient);
router.put('/:recipe_id/:ingredient_id', authenticateToken(['user', 'admin']), recipeIngredientValidator, updateRecipeIngredient);
router.patch('/:recipe_id/:ingredient_id', authenticateToken(['user', 'admin']), updateRecipeIngredient); // Nueva ruta PATCH
router.delete('/:recipe_id/:ingredient_id', authenticateToken(['admin']), deleteRecipeIngredient);

export default router;*/
// src/routes/recipeIngredientRoutes.js
import { Router } from "express";
import {
  getIngredientsByVersion,
  addIngredientToVersion,
  updateIngredient,
  deleteIngredient
} from "../controllers/recipeIngredientController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { recipeIngredientValidator } from "../validations/recipeIngredientValidation.js";

const router = Router();

// Obtener todos los ingredientes de una versión específica de receta
router.get(
  "/versions/:versionId/ingredients",
  authenticateToken(["user", "admin"]),
  getIngredientsByVersion
);

// Añadir un ingrediente a una versión de receta (solo admin)
router.post(
  "/versions/:versionId/ingredients",
  authenticateToken(["admin"]),
  recipeIngredientValidator,
  addIngredientToVersion
);

// Actualizar un ingrediente (solo admin)
router.put(
  "/ingredients/:ingredientId",
  authenticateToken(["admin"]),
  recipeIngredientValidator,
  updateIngredient
);

// Eliminar un ingrediente (solo admin)
router.delete("/ingredients/:ingredientId", authenticateToken(["admin"]), deleteIngredient);

export default router;
