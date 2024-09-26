// src/controllers/recipeVersionController.js
import RecipeVersion from '../models/recipeVersionModel.js';
import Recipe from '../models/recipeModel.js';

// Obtener todas las versiones de una receta
export const getVersionsByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const versions = await RecipeVersion.findAll({ where: { recipe_id: recipeId } });
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva versión de receta
export const createVersion = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { version_name, steps } = req.body;
    const newVersion = await RecipeVersion.create({
      recipe_id: recipeId,
      version_name,
      steps
    });
    res.status(201).json(newVersion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una versión de receta
export const updateVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const { version_name, steps } = req.body;
    const version = await RecipeVersion.findByPk(versionId);
    if (!version) {
      return res.status(404).json({ message: 'Versión no encontrada' });
    }
    version.version_name = version_name;
    version.steps = steps;
    await version.save();
    res.json(version);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una versión de receta
export const deleteVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const version = await RecipeVersion.findByPk(versionId);
    if (!version) {
      return res.status(404).json({ message: 'Versión no encontrada' });
    }
    await version.destroy();
    res.json({ message: 'Versión eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
