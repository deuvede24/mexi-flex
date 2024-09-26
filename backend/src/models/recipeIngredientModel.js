// src/models/recipeIngredientModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import RecipeVersion from './recipeVersionModel.js'; // Referencia a la versión de receta

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id_recipe_ingredients: {
    type: DataTypes.INTEGER(11).UNSIGNED,  // Usamos UNSIGNED para los IDs de ingredientes
    primaryKey: true,
    autoIncrement: true
  },
  version_id: {
    type: DataTypes.INTEGER(11).UNSIGNED,  // Referencia a la versión de la receta
    allowNull: false,
    references: {
      model: RecipeVersion,
      key: 'id_version'
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
  tableName: 'recipe_ingredients',
  timestamps: false  // No es necesario guardar timestamps para los ingredientes
});

RecipeVersion.hasMany(RecipeIngredient, { foreignKey: 'version_id' });
RecipeIngredient.belongsTo(RecipeVersion, { foreignKey: 'version_id' });

export default RecipeIngredient;

