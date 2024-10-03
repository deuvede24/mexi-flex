// RecipeIngredientController.js

import RecipeIngredient from "../models/recipeIngredientModel.js";

/*export const getAllIngredients = async (req, res) => {
    try {
      const ingredients = await RecipeIngredient.findAll(); // Ejemplo de consulta a la base de datos
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los ingredientes." });
    }
  };*/
  export const getAllIngredients = async (req, res) => {
    try {
      const ingredients = await RecipeIngredient.findAll();
      if (!ingredients.length) {
        return res.status(404).json({ message: 'No se encontraron ingredientes.' });
      }
      res.json(ingredients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los ingredientes.' });
    }
  };
  
  

// Obtener todos los ingredientes de una receta específica
export const getIngredientsByRecipeId = async (req, res) => {
  const { recipeId } = req.params;

  try {
    // Consulta a la base de datos para obtener los ingredientes de la receta
    const ingredients = await RecipeIngredient.findAll({
      where: {
        recipe_id: recipeId,
      },
    });

    // Verificar si se encontraron ingredientes
    if (!ingredients.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron ingredientes para esta receta." });
    }

    // Enviar los ingredientes en la respuesta
    res.json(ingredients);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ message: "Error al obtener los ingredientes." });
  }
};

// Añadir ingrediente a una receta específica
export const addIngredientToRecipe = async (req, res) => {
  const { ingredient_name, quantity } = req.body;
  const { recipeId } = req.params;

  try {
    const newIngredient = await RecipeIngredient.create({
      recipe_id: recipeId,
      ingredient_name,
      quantity,
    });

    res
      .status(200)
      .json({ message: "Ingrediente añadido con éxito", newIngredient });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al añadir el ingrediente a la receta" });
  }
};

// Actualizar ingrediente dentro de una receta
export const updateIngredientInRecipe = async (req, res) => {
  const { ingredientId } = req.params;
  const { ingredient_name, quantity } = req.body;

  try {
    const ingredient = await RecipeIngredient.findByPk(ingredientId);

    if (!ingredient) {
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }

    await ingredient.update({ ingredient_name, quantity });

    res
      .status(200)
      .json({ message: "Ingrediente actualizado con éxito", ingredient });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al actualizar el ingrediente de la receta" });
  }
};

// Eliminar ingrediente específico de una receta
export const deleteIngredientFromRecipe = async (req, res) => {
  const { recipeId, ingredientId } = req.params;

  try {
    const ingredient = await RecipeIngredient.findOne({
      where: { id_recipe_ingredients: ingredientId, recipe_id: recipeId },
    });

    if (!ingredient) {
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }

    await ingredient.destroy();
    res.status(200).json({ message: "Ingrediente eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el ingrediente" });
  }
};
