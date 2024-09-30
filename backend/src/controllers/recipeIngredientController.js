// src/controllers/recipeIngredientController.js
/*import RecipeIngredient from '../models/recipeIngredientModel.js';
import { validationResult } from 'express-validator';

// Obtener todos los ingredientes de una versión específica de receta
export const getIngredientsByVersion = async (req, res) => {
  try {
    const ingredients = await RecipeIngredient.findAll({
      where: { version_id: req.params.versionId }
    });
    console.log(`Ingredientes encontrados: ${JSON.stringify(ingredients)}`);
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los ingredientes' });
  }
};

// Añadir un ingrediente a una versión de receta
export const addIngredientToVersion = async (req, res) => {
  const { ingredient_name, imperial_quantity, metric_quantity } = req.body;
  const userRole = req.user.roles; // Verificar el rol

  if (userRole === 'guest') {
    return res.status(403).json({ error: 'Los invitados no pueden añadir ingredientes' });
  }

  try {
    const newIngredient = await RecipeIngredient.create({
      version_id: req.params.versionId,
      ingredient_name,
      imperial_quantity,
      metric_quantity
    });
    res.json(newIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir el ingrediente' });
  }
};

// src/controllers/recipeIngredientController.js

// Obtener todos los ingredientes sin importar la versión
export const getAllIngredients = async (req, res) => {
  try {
    console.log("Obteniendo todos los ingredientes...");
    const allIngredients = await RecipeIngredient.findAll();
    console.log(`Total de ingredientes: ${allIngredients.length}`);
    res.json(allIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener todos los ingredientes" });
  }
};


// Actualizar un ingrediente de una versión de receta
export const updateIngredient = async (req, res) => {
  const { ingredient_name, imperial_quantity, metric_quantity } = req.body;
  const userRole = req.user.roles;

  if (userRole === 'guest') {
    return res.status(403).json({ error: 'Los invitados no pueden actualizar ingredientes' });
  }

  try {
    const updatedIngredient = await RecipeIngredient.update(
      { ingredient_name, imperial_quantity, metric_quantity },
      { where: { id_recipe_ingredients: req.params.ingredientId } }
    );
    res.json(updatedIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el ingrediente' });
  }
};

// Eliminar un ingrediente de una versión de receta
export const deleteIngredient = async (req, res) => {
  const userRole = req.user.roles;

  if (userRole === 'guest') {
    return res.status(403).json({ error: 'Los invitados no pueden eliminar ingredientes' });
  }

  try {
    await RecipeIngredient.destroy({
      where: { id_recipe_ingredients: req.params.ingredientId }
    });
    res.json({ message: 'Ingrediente eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el ingrediente' });
  }
};*/


import RecipeIngredient from '../models/recipeIngredientModel.js';
import { validationResult } from 'express-validator';

// Obtener todos los ingredientes de una receta específica
export const getIngredientsByRecipeId = async (req, res) => {
  try {
    const ingredients = await RecipeIngredient.findAll({
      where: { recipe_id: req.params.recipeId }
    });
    console.log(`Ingredientes encontrados: ${JSON.stringify(ingredients)}`);
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los ingredientes' });
  }
};

// Añadir un ingrediente a una receta (solo admin)
export const addIngredient = async (req, res) => {
  const { ingredient_name, quantity } = req.body;
  const userRole = req.user.roles; // Verificar el rol

  if (userRole === 'guest' || userRole === 'user') {
    return res.status(403).json({ error: 'Solo los administradores pueden añadir ingredientes' });
  }

  try {
    const newIngredient = await RecipeIngredient.create({
      recipe_id: req.params.recipeId,
      ingredient_name,
      quantity
    });
    res.json(newIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir el ingrediente' });
  }
};

// Obtener todos los ingredientes sin importar la receta
export const getAllIngredients = async (req, res) => {
  try {
    console.log("Obteniendo todos los ingredientes...");
    const allIngredients = await RecipeIngredient.findAll();
    console.log(`Total de ingredientes: ${allIngredients.length}`);
    res.json(allIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener todos los ingredientes" });
  }
};

// Actualizar un ingrediente de una receta (solo admin)
export const updateIngredient = async (req, res) => {
  const { ingredient_name, quantity } = req.body;
  const userRole = req.user.roles;

  if (userRole === 'guest' || userRole === 'user') {
    return res.status(403).json({ error: 'Solo los administradores pueden actualizar ingredientes' });
  }

  try {
    const updatedIngredient = await RecipeIngredient.update(
      { ingredient_name, quantity },
      { where: { id_recipe_ingredients: req.params.ingredientId } }
    );
    res.json(updatedIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el ingrediente' });
  }
};

// Eliminar un ingrediente de una receta (solo admin)
export const deleteIngredient = async (req, res) => {
  const userRole = req.user.roles;

  if (userRole === 'guest' || userRole === 'user') {
    return res.status(403).json({ error: 'Solo los administradores pueden eliminar ingredientes' });
  }

  try {
    await RecipeIngredient.destroy({
      where: { id_recipe_ingredients: req.params.ingredientId }
    });
    res.json({ message: 'Ingrediente eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el ingrediente' });
  }
};
