// src/models/favoriteModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Recipe from './recipeModel.js';

const Favorite = sequelize.define('Favorite', {
  id_favorite: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    references: {
      model: User,
      key: 'id_user',
    },
  },
  recipe_id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    references: {
      model: Recipe,
      key: 'id_recipe',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

User.hasMany(Favorite, { foreignKey: 'user_id' });
Recipe.hasMany(Favorite, { foreignKey: 'recipe_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default Favorite;


