import Recipe from "../models/recipeModel.js";
import RecipeIngredient from "../models/recipeIngredientModel.js";
import { validationResult } from "express-validator";

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
      recipes = await Recipe.findAll({
        include: RecipeIngredient  // Incluimos los ingredientes
      });
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

// Obtener receta por ID con ingredientes
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: RecipeIngredient,  // Incluimos los ingredientes relacionados
    });

    console.log('Recipe retrieved from DB:', recipe);

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

    const { title, description, version_name, steps, is_premium, serving_size = 1, preparation_time = 0, image, ingredients } = req.body;

    if (!title || !description || !version_name || !steps || is_premium === undefined || !ingredients) {
      return res.status(400).json({
        code: -2,
        message: "Missing required fields",
      });
    }

    // Creamos la receta
    const newRecipe = await Recipe.create({
      title,
      description,
      version_name,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });

    // Crear los ingredientes relacionados
    const ingredientsToAdd = ingredients.map(ingredient => ({
      recipe_id: newRecipe.id_recipe,
      ingredient_name: ingredient.ingredient_name,
      quantity: ingredient.quantity,
    }));
    await RecipeIngredient.bulkCreate(ingredientsToAdd);

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

// Actualizar una receta existente con ingredientes
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

    const { title, description, version_name, steps, is_premium, serving_size = 1, preparation_time = 0, image, ingredients } = req.body;

    // Actualizamos los datos principales de la receta
    await recipe.update({
      title,
      description,
      version_name,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });

    // Actualizar los ingredientes relacionados
    await RecipeIngredient.destroy({ where: { recipe_id: id } });

    const ingredientsToAdd = ingredients.map(ingredient => ({
      recipe_id: id,
      ingredient_name: ingredient.ingredient_name,
      quantity: ingredient.quantity,
    }));
    await RecipeIngredient.bulkCreate(ingredientsToAdd);

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

// Eliminar una receta junto con sus ingredientes
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    await RecipeIngredient.destroy({ where: { recipe_id: id } });
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
