/*import Recipe from "../models/recipeModel.js";
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

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image, ingredients } = req.body;

    if (!title || !description || !category || !steps || is_premium === undefined || !ingredients) {
      return res.status(400).json({
        code: -2,
        message: "Missing required fields",
      });
    }

    // Creamos la receta
    const newRecipe = await Recipe.create({
      title,
      description,
      category,  // Cambiado de version_name a category
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

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image, ingredients } = req.body;

    // Actualizamos los datos principales de la receta
    await recipe.update({
      title,
      description,
      category,  // Cambiado de version_name a category
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });

    // Obtener los ingredientes actuales
    const currentIngredients = await RecipeIngredient.findAll({
      where: { recipe_id: id }
    });

    // Convertir los ingredientes actuales en un mapa por nombre para facilitar la comparación
    const currentIngredientMap = currentIngredients.reduce((map, ingredient) => {
      map[ingredient.ingredient_name] = ingredient;
      return map;
    }, {});

    // Comparar los ingredientes enviados con los actuales y determinar si se deben actualizar o crear nuevos
    for (const ingredient of ingredients) {
      if (currentIngredientMap[ingredient.ingredient_name]) {
        // Si el ingrediente ya existe, actualizar solo si la cantidad ha cambiado
        const existingIngredient = currentIngredientMap[ingredient.ingredient_name];
        if (existingIngredient.quantity !== ingredient.quantity) {
          await existingIngredient.update({ quantity: ingredient.quantity });
        }
        // Eliminar del mapa para que sepamos qué ingredientes no están en la nueva lista
        delete currentIngredientMap[ingredient.ingredient_name];
      } else {
        // Si el ingrediente no existe, crearlo
        await RecipeIngredient.create({
          recipe_id: id,
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
        });
      }
    }

    // Eliminar los ingredientes que ya no están en la nueva lista
    const ingredientsToRemove = Object.values(currentIngredientMap);
    for (const ingredient of ingredientsToRemove) {
      await ingredient.destroy();
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
};*/


/*import Recipe from "../models/recipeModel.js";
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

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image } = req.body;

    if (!title || !description || !category || !steps || is_premium === undefined) {
      return res.status(400).json({
        code: -2,
        message: "Missing required fields",
      });
    }

    const newRecipe = await Recipe.create({
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
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

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image } = req.body;

    await recipe.update({
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });

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
};*/

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

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image, ingredients } = req.body;

    if (!title || !description || !category || !steps || is_premium === undefined || !ingredients) {
      return res.status(400).json({
        code: -2,
        message: "Missing required fields",
      });
    }

    // Creamos la receta
    const newRecipe = await Recipe.create({
      title,
      description,
      category,
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
      console.log('Errores de validación:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      console.log(`Receta no encontrada con ID: ${id}`);
      return res.status(404).json({
        code: -3,
        message: "Recipe not found",
      });
    }

      // Mostrar los datos recibidos en el body
      console.log('Datos recibidos en el body:', req.body);

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image, ingredients } = req.body;


    // Mostrar los datos antes de actualizar la receta
    console.log('Datos antes de actualizar la receta:', {
      title, description, category, steps, is_premium, serving_size, preparation_time, image, ingredients
    });
    // Actualizamos los datos principales de la receta
    await recipe.update({
      title,
      description,
      category,
      steps,
      is_premium,
      serving_size,
      preparation_time,
      image,
    });
//////////////////////////

    // Actualizar ingredientes
    const currentIngredients = await RecipeIngredient.findAll({
      where: { recipe_id: id }
    });

    const currentIngredientMap = currentIngredients.reduce((map, ingredient) => {
      map[ingredient.ingredient_name] = ingredient;
      return map;
    }, {});

    for (const ingredient of ingredients) {
      if (currentIngredientMap[ingredient.ingredient_name]) {
        const existingIngredient = currentIngredientMap[ingredient.ingredient_name];
        if (existingIngredient.quantity !== ingredient.quantity) {
          console.log(`Actualizando ingrediente: ${ingredient.ingredient_name} con cantidad: ${ingredient.quantity}`);
          await existingIngredient.update({ quantity: ingredient.quantity });
        }
        delete currentIngredientMap[ingredient.ingredient_name];
      } else {
        // Si el ingrediente no existe, crear uno nuevo
        console.log(`Creando nuevo ingrediente: ${ingredient.ingredient_name} con cantidad: ${ingredient.quantity}`);
        await RecipeIngredient.create({
          recipe_id: id,
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
        });
      }
    }

    const ingredientsToRemove = Object.values(currentIngredientMap);
    for (const ingredient of ingredientsToRemove) {
      console.log(`Eliminando ingrediente: ${ingredient.ingredient_name}`);
      await ingredient.destroy();
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

// Actualizar parcialmente una receta
export const patchRecipe = async (req, res) => {
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

    const { title, description, category, steps, is_premium, serving_size = 1, preparation_time = 0, image } = req.body;

    // Actualizar solo los campos proporcionados
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (steps !== undefined) updateData.steps = steps;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (serving_size !== undefined) updateData.serving_size = serving_size;
    if (preparation_time !== undefined) updateData.preparation_time = preparation_time;
    if (image !== undefined) updateData.image = image;

    await recipe.update(updateData);

    res.status(200).json({
      code: 1,
      message: "Recipe updated partially",
      data: recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: "Error partially updating recipe",
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

