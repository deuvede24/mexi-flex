import RecipeIngredient from '../models/recipeIngredientModel.js';
import { validationResult } from 'express-validator';

export const getRecipeIngredients = async (req, res) => {
  try {
    const recipeIngredients = await RecipeIngredient.findAll();
    res.status(200).json({ recipeIngredients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipeIngredientById = async (req, res) => {
  try {
    const { recipe_id, ingredient_id } = req.params;
    const recipeIngredient = await RecipeIngredient.findOne({
      where: {
        recipe_id,
        ingredient_id,
      },
    });
    if (recipeIngredient) {
      res.status(200).json({ recipeIngredient });
    } else {
      res.status(404).json({ error: 'Recipe Ingredient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addRecipeIngredient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { recipe_id, ingredient_id, quantity } = req.body;
    const newRecipeIngredient = await RecipeIngredient.create({ recipe_id, ingredient_id, quantity });
    res.status(201).json({ newRecipeIngredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRecipeIngredient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { recipe_id, ingredient_id } = req.params;
    const { quantity } = req.body;
    const recipeIngredient = await RecipeIngredient.findOne({
      where: {
        recipe_id,
        ingredient_id,
      },
    });
    if (recipeIngredient) {
      recipeIngredient.quantity = quantity;
      await recipeIngredient.save();
      res.status(200).json({ recipeIngredient });
    } else {
      res.status(404).json({ error: 'Recipe Ingredient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRecipeIngredient = async (req, res) => {
  try {
    const { recipe_id, ingredient_id } = req.params;
    const deleted = await RecipeIngredient.destroy({
      where: {
        recipe_id,
        ingredient_id,
      },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Recipe Ingredient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

