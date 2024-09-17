import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

// Definición del modelo MapLocation
const MapLocation = sequelize.define('MapLocation', {
  // Nombre del lugar
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Descripción del lugar
  description: {
    type: DataTypes.TEXT, // Cambiado a TEXT para permitir descripciones más largas
    allowNull: true, // Descripción opcional
  },
  // Coordenada de latitud
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Coordenada de longitud
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // Nueva columna para la categoría
    allowNull: false,
  },
}, {
  // Añade timestamps (createdAt, updatedAt)
  timestamps: true,
  // Nombre de la tabla en la base de datos
  tableName: 'map_locations',
  indexes: [
    {
      unique: true,
      fields: ['name', 'latitude', 'longitude'], // Estos tres campos combinados deben ser únicos
    },
  ],
});

// Exportamos el modelo
export default MapLocation;

