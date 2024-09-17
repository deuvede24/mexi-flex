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

import { Router } from 'express';
import { getRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe, getRecipeCategoryCount } from '../controllers/recipeController.js'; // Asegúrate de importar getRecipeCategoryCount
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { recipeValidator, recipeValidatorPatch } from '../validations/recipeValidation.js';
import { idValidator } from '../validations/genericValidation.js';

const router = Router();

router.get('/category-count', getRecipeCategoryCount); // Asegúrate de que esta ruta esté aquí

router.get('/:id', getRecipeById);
router.post('/', authenticateToken(['user', 'admin']), recipeValidator, addRecipe);

// Aquí añadimos ambas rutas para actualizar recetas: PUT y PATCH
router.put('/:id', authenticateToken(['user', 'admin']), idValidator, recipeValidator, updateRecipe);
router.patch('/:id', authenticateToken(['user', 'admin']), idValidator, recipeValidatorPatch, updateRecipe);

router.delete('/:id', authenticateToken(['user','admin']), idValidator, deleteRecipe);

// Ruta accesible para todos para obtener las recetas
router.get('/', getRecipes);


export default router;


