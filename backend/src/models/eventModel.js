/*import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

// Definición del modelo Event
const Event = sequelize.define('Event', {
  // Título del evento
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Descripción del evento
  description: {
    type: DataTypes.TEXT, // Usamos TEXT para permitir descripciones más largas
    allowNull: true, // La descripción puede ser opcional
  },
  // Tipo de evento (receta o restaurante)
  type: {
    type: DataTypes.ENUM('receta', 'restaurante'), // Tipo de evento
    allowNull: false,
  },
  // Fecha del evento
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  // Añade timestamps (createdAt, updatedAt)
  timestamps: true,
  // Nombre de la tabla en la base de datos
  tableName: 'events',
  indexes: [
    {
      unique: true, // Para evitar eventos duplicados
      fields: ['title', 'date'], // Título y fecha combinados deben ser únicos
    },
  ],
});

// Exportamos el modelo
export default Event;*/

import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";


const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('receta', 'restaurante'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'events',
  indexes: [
    {
      unique: true,
      fields: ['title', 'date'],
    },
  ],
});

export default Event;
