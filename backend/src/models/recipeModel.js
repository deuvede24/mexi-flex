import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Recipe = sequelize.define('Recipe', {
  id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {  // Anteriormente version_name, ahora es la categoría de la receta (tradicional, flexi, etc.)
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  steps: {  // Guardamos los pasos en formato texto o cadena.
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  serving_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  preparation_time: {
    type: DataTypes.INTEGER,  // Tiempo en minutos
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Las recetas pueden o no tener imagen
  },
}, {
  tableName: 'recipes',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
});

export default Recipe;
