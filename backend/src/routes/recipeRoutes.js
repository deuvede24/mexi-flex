import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  generateRecipeWithAI,
} from "../controllers/recipeController.js"; // Agregamos la nueva función para la generación de recetas
import {
  getIngredientsByRecipeId,
  getAllIngredients,
} from "../controllers/recipeIngredientController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { idValidator } from "../validations/genericValidation.js";

const router = Router();

// **Rutas globales de ingredientes** - Estas rutas deben ir primero para evitar conflictos
router.get("/ingredients", getAllIngredients); // Obtener todos los ingredientes globales

// **Rutas de recetas (solo lectura)**
router.get("/", authenticateToken(), getRecipes); // Usuarios autenticados pueden ver las recetas
router.get("/:id", authenticateToken(), idValidator, getRecipeById); // Usuarios autenticados pueden ver una receta por ID

// **Ruta para generar recetas con la API de OpenAI**
router.post("/generate", authenticateToken(), generateRecipeWithAI); // Usuarios autenticados pueden generar recetas con la API de OpenAI

// **Rutas para ver ingredientes dentro de una receta**
router.get("/:recipeId/ingredients", authenticateToken(), idValidator, getIngredientsByRecipeId); // Obtener todos los ingredientes de una receta específica solo para usuarios autenticados

export default router;

