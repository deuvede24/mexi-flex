import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Ingredient = sequelize.define('Ingredient', {
  id_ingredient: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    //unique: true
  }
}, {
  tableName: 'Ingredients',
  indexes: [{ unique: true, fields: ["name"] }],
  timestamps: false // No necesitamos created_at ni updated_at para este modelo
});

export default Ingredient;
