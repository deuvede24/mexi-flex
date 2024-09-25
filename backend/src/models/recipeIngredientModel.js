import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import Recipe from './recipeModel.js'; // Asegúrate de que existe y está correcto

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id_recipe_ingredients: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  recipe_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id_recipe'
    }
  },
  ingredient_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  imperial_quantity: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  metric_quantity: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'recipe_ingredients', // Aseguramos que el nombre de la tabla sea el correcto
  timestamps: false // No necesitamos timestamps en esta tabla
});

Recipe.hasMany(RecipeIngredient, { foreignKey: 'recipe_id' });
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default RecipeIngredient;
