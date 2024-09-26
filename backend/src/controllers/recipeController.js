import Recipe from "../models/recipeModel.js";
import RecipeVersion from "../models/recipeVersionModel.js"; // Importamos la tabla de versiones
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

// Obtener receta por ID con versiones e ingredientes
export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: {
        model: RecipeVersion,  // Incluimos las versiones
        include: RecipeIngredient // Incluimos los ingredientes en cada versión
      }
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

// Añadir una nueva receta con versiones e ingredientes
export const addRecipe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, versions, is_premium, serving_size = 1, preparation_time = 0, image } = req.body;

    if (!title || !description || !versions || is_premium === undefined) {
      return res.status(400).json({
        code: -2,
        message: "Missing required fields: title, description, versions, is_premium",
      });
    }

    // Creamos la receta
    const newRecipe = await Recipe.create({
      title,
      description,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });

    // Crear las versiones y los ingredientes
    for (const version of versions) {
      const newVersion = await RecipeVersion.create({
        recipe_id: newRecipe.id_recipe,
        version_name: version.version_name,
        steps: version.steps
      });

      if (version.ingredients && version.ingredients.length > 0) {
        const ingredientsToAdd = version.ingredients.map(ingredient => ({
          version_id: newVersion.id_version,
          ingredient_name: ingredient.ingredient_name,
          imperial_quantity: ingredient.imperial_quantity,
          metric_quantity: ingredient.metric_quantity
        }));
        await RecipeIngredient.bulkCreate(ingredientsToAdd);
      }
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

// Actualizar una receta existente con versiones e ingredientes
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

    const { title, description, versions, is_premium, serving_size = 1, preparation_time = 0, image } = req.body;

    // Actualizamos los datos principales de la receta
    await recipe.update({
      title,
      description,
      is_premium,
      serving_size, 
      preparation_time, 
      image
    });

    // Actualizamos las versiones y sus ingredientes
    if (versions && versions.length > 0) {
      // Eliminamos las versiones anteriores
      await RecipeVersion.destroy({ where: { recipe_id: id } });

      // Creamos las nuevas versiones con ingredientes
      for (const version of versions) {
        const updatedVersion = await RecipeVersion.create({
          recipe_id: id,
          version_name: version.version_name,
          steps: version.steps
        });

        if (version.ingredients && version.ingredients.length > 0) {
          const ingredientsToAdd = version.ingredients.map(ingredient => ({
            version_id: updatedVersion.id_version,
            ingredient_name: ingredient.ingredient_name,
            imperial_quantity: ingredient.imperial_quantity,
            metric_quantity: ingredient.metric_quantity
          }));
          await RecipeIngredient.bulkCreate(ingredientsToAdd);
        }
      }
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

// Eliminar una receta junto con sus versiones e ingredientes
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminamos las versiones de la receta y sus ingredientes
    await RecipeVersion.destroy({ where: { recipe_id: id } });

    // Luego eliminamos la receta
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

