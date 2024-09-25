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

import { Router } from "express";
import {
  getIngredientsByRecipe,
  addIngredientToRecipe,
  updateIngredient,
  deleteIngredient,
} from "../controllers/recipeIngredientController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { recipeIngredientValidator } from "../validations/recipeIngredientValidation.js";

const router = Router();

// Obtener todos los ingredientes de una receta específica
router.get(
  "/:recipeId",
  authenticateToken(["user", "admin"]),
  getIngredientsByRecipe
);

// Añadir un ingrediente a una receta
router.post(
  "/:recipeId",
  authenticateToken(["admin"]),
  recipeIngredientValidator,
  addIngredientToRecipe
);

// Actualizar un ingrediente de una receta
router.put(
  "/:ingredientId",
  authenticateToken(["admin"]),
  recipeIngredientValidator,
  updateIngredient
);

// Eliminar un ingrediente de una receta
router.delete("/:ingredientId", authenticateToken(["admin"]), deleteIngredient);

export default router;
