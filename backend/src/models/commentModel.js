// src/models/commentModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Recipe from './recipeModel.js';

const Comment = sequelize.define('Comment', {
  id_comment: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
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

User.hasMany(Comment, { foreignKey: 'user_id' });
Recipe.hasMany(Comment, { foreignKey: 'recipe_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default Comment;
