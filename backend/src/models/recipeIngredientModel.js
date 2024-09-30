// src/models/recipeIngredientModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import Recipe from './recipeModel.js';  // Referencia a la receta directamente

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id_recipe_ingredients: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  recipe_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id_recipe'
    }
  },
  ingredient_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.STRING(50),
    allowNull: false,  // Solo un sistema de medidas
  },
}, {
  tableName: 'recipe_ingredients',
  timestamps: false,
});

Recipe.hasMany(RecipeIngredient, { foreignKey: 'recipe_id' });
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default RecipeIngredient;
