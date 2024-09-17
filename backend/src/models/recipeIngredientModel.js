import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import Recipe from './recipeModel.js';
import Ingredient from './ingredientModel.js';

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id_RecipeIngredients: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
  },
  recipe_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    references: {
      model: Recipe,
      key: 'id_recipe'
    },
    primaryKey: false,
  },
  ingredient_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    references: {
      model: Ingredient,
      key: 'id_ingredient'
    },
    primaryKey:false,
  },
  quantity: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  timestamps: false ,// No necesitamos created_at ni updated_at para este modelo
  tableName: 'RecipeIngredients'  // Asegúrate de que coincida con el nombre exacto de la tabla en la base de datos
});

Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, foreignKey: 'recipe_id' });
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'ingredient_id' });

export default RecipeIngredient;
