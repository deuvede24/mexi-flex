// src/routes/recipeVersionRoutes.js
import express from 'express';
import {
  getVersionsByRecipeId,
  createVersion,
  updateVersion,
  deleteVersion
} from '../controllers/recipeVersionController.js';

const router = express.Router();

// Ruta para obtener todas las versiones de una receta
router.get('/recipes/:recipeId/versions', getVersionsByRecipeId);

// Ruta para crear una nueva versión de receta
router.post('/recipes/:recipeId/versions', createVersion);

// Ruta para actualizar una versión de receta
router.put('/versions/:versionId', updateVersion);

// Ruta para eliminar una versión de receta
router.delete('/versions/:versionId', deleteVersion);

export default router;
