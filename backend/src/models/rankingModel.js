import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './userModel.js';
import Recipe from './recipeModel.js';

const Ranking = sequelize.define('Ranking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user',
    },
    onDelete: 'CASCADE',
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id_recipe',
    },
    onDelete: 'CASCADE',
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  tableName: 'rankings',
  timestamps: true,
});

// Relaciones
User.hasMany(Ranking, { foreignKey: 'user_id' });
Ranking.belongsTo(User, { foreignKey: 'user_id' });

Recipe.hasMany(Ranking, { foreignKey: 'recipe_id' });
Ranking.belongsTo(Recipe, { foreignKey: 'recipe_id' });

export default Ranking;
