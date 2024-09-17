import Recipe from "../models/recipeModel.js";
import { Sequelize } from "sequelize";

// Obtener el conteo de recetas por categoría
export const getRecipeCategoryCount = async (req, res) => {
  try {
    const categoryCounts = await Recipe.findAll({
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('category')), 'count'],
      ],
      group: ['category'],
    });

    console.log("Resultado del conteo de recetas por categoría:", categoryCounts);
    res.status(200).json({
      code: 1,
      message: "Recipe category count",
      data: categoryCounts,
    });
  } catch (error) {
    console.error("Error al obtener el conteo de recetas por categoría:", error);
    res.status(500).json({
      message: "Error al obtener el conteo de recetas por categoría",
      error: error,
    });
  }
};

  
/*export const getMostUsedIngredients = async (req, res) => {
    try {
      const mostUsedIngredients = await Ingredient.findAll({
        include: {
          model: Recipe,
          through: {
            model: RecipeIngredient,
            as: 'RecipeIngredients',  // Asegúrate de que coincide con el nombre de la tabla
          },
          attributes: [],
        },
        attributes: [
          'name',
          [sequelize.fn('COUNT', sequelize.col('RecipeIngredients.ingredient_id')), 'count'],  // Usa el nombre exacto de la tabla y columna
        ],
        group: ['Ingredient.id_ingredient'],
        order: [[sequelize.literal('count'), 'DESC']],
        limit: 5,  // Ajusta según lo necesario
      });
  
      res.status(200).json(mostUsedIngredients);
    } catch (error) {
      console.error('Error al obtener los ingredientes más utilizados:', error);
      res.status(500).json({
        message: 'Error al obtener los ingredientes más utilizados',
        error: error,
      });
    }
  };*/
  
