// src/routes/recipeRoutes.js
/*import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  patchRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import {
  addIngredientToRecipe, // Añadir ingrediente
  updateIngredientInRecipe, // Actualizar ingrediente
  deleteIngredientFromRecipe, // Eliminar ingrediente
  getIngredientsByRecipeId,
  getAllIngredients,
} from "../controllers/recipeIngredientController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  recipeValidator,
  recipeValidatorPatch,
} from "../validations/recipeValidation.js";
import { idValidator } from "../validations/genericValidation.js";
import { recipeIngredientValidator } from "../validations/recipeIngredientValidator.js";

const router = Router();

// Rutas de recetas
router.get("/", getRecipes);
router.get("/:id", idValidator, getRecipeById);
router.post("/", authenticateToken(["admin"]), recipeValidator, addRecipe);
router.put(
  "/:id",
  authenticateToken(["admin"]),
  idValidator,
  recipeValidator,
  updateRecipe
);
router.patch(
  "/:id",
  authenticateToken(["admin"]),
  idValidator,
  recipeValidatorPatch,
  patchRecipe
);
router.delete("/:id", authenticateToken(["admin"]), idValidator, deleteRecipe);

// **Rutas para manejar ingredientes dentro de una receta**
router.post(
  "/:recipeId/ingredient",
  authenticateToken(["admin"]),
  recipeIngredientValidator,
  addIngredientToRecipe
);
router.put(
  "/:recipeId/ingredient/:ingredientId",
  authenticateToken(["admin"]),
  idValidator,
  recipeIngredientValidator,
  updateIngredientInRecipe
);
router.delete(
  "/:recipeId/ingredient/:ingredientId",
  authenticateToken(["admin"]),
  idValidator,
  deleteIngredientFromRecipe
);
router.get("/:recipeId/ingredients", idValidator, getIngredientsByRecipeId); // Obtener todos los ingredientes de una receta específica
// **Rutas globales de ingredientes**
router.get("/ingredients", getAllIngredients); // Obtener todos los ingredientes globales (accesible para todos)

export default router;*/
// src/routes/recipeRoutes.js
import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  patchRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import {
  addIngredientToRecipe, 
  updateIngredientInRecipe, 
  deleteIngredientFromRecipe, 
  getIngredientsByRecipeId,
  getAllIngredients,
} from "../controllers/recipeIngredientController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  recipeValidator,
  recipeValidatorPatch,
} from "../validations/recipeValidation.js";
import { idValidator } from "../validations/genericValidation.js";
import { recipeIngredientValidator } from "../validations/recipeIngredientValidator.js";

const router = Router();

// **Rutas globales de ingredientes** - Estas rutas deben ir primero para evitar conflictos
router.get("/ingredients", getAllIngredients); // Obtener todos los ingredientes globales

// Rutas de recetas
router.get("/", getRecipes);
router.get("/:id", idValidator, getRecipeById);
router.post("/", authenticateToken(["admin"]), recipeValidator, addRecipe);
router.put(
  "/:id",
  authenticateToken(["admin"]),
  idValidator,
  recipeValidator,
  updateRecipe
);
router.patch(
  "/:id",
  authenticateToken(["admin"]),
  idValidator,
  recipeValidatorPatch,
  patchRecipe
);
router.delete("/:id", authenticateToken(["admin"]), idValidator, deleteRecipe);

// **Rutas para manejar ingredientes dentro de una receta**
router.post(
  "/:recipeId/ingredient",
  authenticateToken(["admin"]),
  recipeIngredientValidator,
  addIngredientToRecipe
);
router.put(
  "/:recipeId/ingredient/:ingredientId",
  authenticateToken(["admin"]),
  idValidator,
  recipeIngredientValidator,
  updateIngredientInRecipe
);
router.delete(
  "/:recipeId/ingredient/:ingredientId",
  authenticateToken(["admin"]),
  idValidator,
  deleteIngredientFromRecipe
);
router.get("/:recipeId/ingredients", idValidator, getIngredientsByRecipeId); // Obtener todos los ingredientes de una receta específica

export default router;

