import Recipe from "../models/recipeModel.js";
import RecipeIngredient from '../models/recipeIngredientModel.js';
import { validationResult } from "express-validator";
import { Sequelize } from "sequelize";

// Obtener todas las recetas (manejando guest para ver solo 5 recetas)
export const getRecipes = async (req, res) => {
  try {
    const userRole = req.user ? req.user.roles : 'guest';
    let recipes;

    if (userRole === 'guest') {
      recipes = await Recipe.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],  // Las más recientes
      });
    } else {
      recipes = await Recipe.findAll();
    }

    res.status(200).json({
      code: 1,
      message: "Recipes List",
      data: recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error fetching recipes",
    });
  }
};

// Obtener receta por ID
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: RecipeIngredient // Incluir los ingredientes
    });

    if (!recipe) {
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Recipe retrieved successfully",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error retrieving recipe",
    });
  }
};

// Añadir una nueva receta con ingredientes
export const addRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Desestructuración de los campos del cuerpo de la solicitud
    const { title, description, steps, category, is_premium, ingredients, serving_size = 1, preparation_time = 0, image } = req.body;

    // Verificación de campos obligatorios
    if (!title || !description || !steps || !category || is_premium === undefined || !ingredients) {
      return res.status(400).json({
        code: -2,
        message:
          "Fields: title, description, steps, category, is_premium, and ingredients must be provided",
      });
    }

    // Creación de la receta
    const newRecipe = await Recipe.create({
      title,
      description,
      steps,
      category,
      is_premium,
      serving_size, // Asignamos el valor, por defecto 1 si no viene
      preparation_time, // Asignamos el valor, por defecto 0 si no viene
      image,
    });

    // Crear los ingredientes asociados
    if (ingredients && ingredients.length > 0) {
      const ingredientsToAdd = ingredients.map(ingredient => ({
        recipe_id: newRecipe.id_recipe,
        ingredient_name: ingredient.ingredient_name,
        imperial_quantity: ingredient.imperial_quantity,
        metric_quantity: ingredient.metric_quantity
      }));
      await RecipeIngredient.bulkCreate(ingredientsToAdd);
    }

    res.status(200).json({
      code: 1,
      message: "Recipe added successfully",
      data: newRecipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error adding recipe",
    });
  }
};

// Actualizar una receta existente
export const updateRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    const { title, description, steps, category, is_premium, ingredients, serving_size = 1, preparation_time = 0, image } = req.body;

    // Actualización de la receta
    await recipe.update({
      title,
      description,
      steps,
      category,
      is_premium,
      serving_size, 
      preparation_time, 
      image
    });

    // Actualizar ingredientes
    if (ingredients && ingredients.length > 0) {
      // Eliminar los ingredientes antiguos
      await RecipeIngredient.destroy({ where: { recipe_id: id } });

      // Crear los nuevos ingredientes
      const ingredientsToAdd = ingredients.map(ingredient => ({
        recipe_id: id,
        ingredient_name: ingredient.ingredient_name,
        imperial_quantity: ingredient.imperial_quantity,
        metric_quantity: ingredient.metric_quantity
      }));

      await RecipeIngredient.bulkCreate(ingredientsToAdd);
    }

    res.status(200).json({
      code: 1,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error updating recipe",
    });
  }
};

// Eliminar una receta
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.destroy({ where: { id_recipe: id } });

    if (!deletedRecipe) {
      return res.status(404).json({
        code: -100,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      code: 1,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error deleting recipe",
    });
  }
};

// Obtener el conteo de recetas por categoría
export const getRecipeCategoryCount = async (req, res) => {
  try {
    const categoryCounts = await Recipe.findAll({
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('category')), 'count']
      ],
      group: ['category']
    });

    res.status(200).json({
      code: 1,
      message: "Recipe category count",
      data: categoryCounts,
    });
  } catch (error) {
    console.error('Error in getRecipeCategoryCount:', error);
    res.status(500).json({
      code: -100,
      message: "Error fetching category count",
    });
  }
};
