// src/models/recipeModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';

const Recipe = sequelize.define('Recipe', {
  id_recipe: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
 /* user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED
  },*/
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  steps: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('traditional', 'vegan', 'vegetarian'),
    allowNull: false
  },
  is_premium: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  ingredients: {
    type: DataTypes.TEXT, // Añadimos la columna para almacenar los ingredientes directamente
    allowNull: false,
  }
}, {
  
  indexes: [{ unique: true, fields: ['title'] }],
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

//User.hasMany(Recipe, { foreignKey: 'user_id' });
//Recipe.belongsTo(User, { foreignKey: 'user_id' });

export default Recipe;
