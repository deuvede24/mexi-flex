import Recipe from "../models/recipeModel.js";
import { validationResult } from "express-validator";
import { Sequelize } from "sequelize";

// Obtener todas las recetas
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
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
    const recipe = await Recipe.findByPk(id);

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

// Añadir una nueva receta
export const addRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, steps, category, is_premium, ingredients } =
      req.body;

    if (
      !title ||
      !description ||
      !steps ||
      !category ||
      is_premium === undefined ||
      !ingredients
    ) {
      return res.status(400).json({
        code: -2,
        message:
          "All fields (title, description, steps, category, is_premium, ingredients) must be provided",
      });
    }

    const newRecipe = await Recipe.create({
      title,
      description,
      steps,
      category,
      is_premium,
      ingredients,
    });

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
/*export const updateRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, steps, category, is_premium, ingredients } =
      req.body;

    if (
      !title ||
      !description ||
      !steps ||
      !category ||
      is_premium === undefined ||
      !ingredients
    ) {
      return res.status(400).json({
        code: -2,
        message:
          "All fields (title, description, steps, category, is_premium, ingredients) must be provided",
      });
    }

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

    recipe.title = title;
    recipe.description = description;
    recipe.steps = steps;
    recipe.category = category;
    recipe.is_premium = is_premium;
    recipe.ingredients = ingredients;
    await recipe.save();

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
};*/
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

    // Aquí permitimos actualizaciones parciales usando el operador spread
    const {
      title = recipe.title, // Si no se envía un campo, se conserva el valor actual
      description = recipe.description,
      steps = recipe.steps,
      category = recipe.category,
      is_premium = recipe.is_premium,
      ingredients = recipe.ingredients,
    } = req.body;

    // Actualizar los campos de la receta
    recipe.title = title;
    recipe.description = description;
    recipe.steps = steps;
    recipe.category = category;
    recipe.is_premium = is_premium;
    recipe.ingredients = ingredients;

    await recipe.save();

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
    console.log('getRecipeCategoryCount endpoint hit');
    
    const categoryCounts = await Recipe.findAll({
      attributes: [
        'category', 
        [Sequelize.fn('COUNT', Sequelize.col('category')), 'count']
      ],
      group: ['category']
    });

    console.log('Categories found:', categoryCounts);

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