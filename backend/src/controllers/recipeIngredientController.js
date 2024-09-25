import RecipeIngredient from '../models/recipeIngredientModel.js';
import { validationResult } from 'express-validator';

// Obtener todos los ingredientes de una receta específica
export const getIngredientsByRecipe = async (req, res) => {
  try {
    const ingredients = await RecipeIngredient.findAll({
      where: { recipe_id: req.params.recipeId }
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los ingredientes' });
  }
};
// Añadir un ingrediente a una receta
export const addIngredientToRecipe = async (req, res) => {
  const { ingredient_name, imperial_quantity, metric_quantity } = req.body;
  const userRole = req.user.role; // Verificar el rol

  // Si es guest, no permitimos añadir ingredientes
  if (userRole === 'guest') {
    return res.status(403).json({ error: 'Los invitados no pueden añadir ingredientes' });
  }

  try {
    const newIngredient = await RecipeIngredient.create({
      recipe_id: req.params.recipeId,
      ingredient_name,
      imperial_quantity,
      metric_quantity
    });
    res.json(newIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir el ingrediente' });
  }
};

// Actualizar un ingrediente de una receta
export const updateIngredient = async (req, res) => {
  const { ingredient_name, imperial_quantity, metric_quantity } = req.body;
  const userRole = req.user.role; // Verificar el rol

  // Si es guest, no permitimos actualizar ingredientes
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

// Eliminar un ingrediente de una receta
export const deleteIngredient = async (req, res) => {
  const userRole = req.user.role; // Verificar el rol

  // Si es guest, no permitimos eliminar ingredientes
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
};
