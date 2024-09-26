// src/models/recipeVersionModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import Recipe from './recipeModel.js'; // Importar Recipe para la relación

const RecipeVersion = sequelize.define('RecipeVersion', {
  id_version: {
    type: DataTypes.INTEGER(11).UNSIGNED,  // Usamos UNSIGNED para los IDs de versión
    primaryKey: true,
    autoIncrement: true
  },
  recipe_id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id_recipe'
    }
  },
  version_name: {
    type: DataTypes.ENUM('tradicional', 'flexi'),
    allowNull: false
  },
  steps: {
    type: DataTypes.JSON,  // Guardamos los pasos de cada versión en formato JSON
    allowNull: false
  }
}, {
  tableName: 'recipe_versions',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// Relación con Recipe
Recipe.hasMany(RecipeVersion, { foreignKey: 'recipe_id' });
RecipeVersion.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default RecipeVersion;

