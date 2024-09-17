// backend/routes/mapLocationRoutes.js

/*import { Router } from 'express';

const router = Router();

// Datos fijos de ubicaciones
const locations = [
  { name: 'Restaurante 1', description: 'Aquí sirven nuestra receta especial', latitude: 41.3851, longitude: 2.1734 },
  { name: 'Tienda de Ingredientes 2', description: 'Aquí puedes encontrar todos los ingredientes frescos', latitude: 41.3751, longitude: 2.1834 },
  // Agrega más ubicaciones según necesites
];

// Ruta para obtener todas las ubicaciones
router.get('/', (req, res) => {
  res.json(locations);
});

export default router;*/

/*import { Router } from 'express';
import { getMapLocations, createMapLocation, updateMapLocation, deleteMapLocation } from '../controllers/mapController.js';

const router = Router();

router.get('/', getMapLocations);
router.post('/', createMapLocation);
router.put('/:id', updateMapLocation);
router.delete('/:id', deleteMapLocation);

export default router;*/

import { Router } from "express";
import {
  getMapLocations,
  createMapLocation,
  updateMapLocation,
  deleteMapLocation,
  getLocationById,
} from "../controllers/mapController.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Ruta para obtener el token de Mapbox
router.get("/token", (req, res) => {
  res.json({ mapboxToken: process.env.MAPBOX_TOKEN });
});

// Ruta para obtener todas las ubicaciones
router.get("/locations", getMapLocations);
router.get("/locations/:id", getLocationById);

// Ruta para crear una nueva ubicación
router.post("/locations", createMapLocation);

// Ruta para actualizar una ubicación existente
router.put("/locations/:id", updateMapLocation)

// Ruta para eliminar una ubicación
router.delete("/locations/:id", deleteMapLocation);

export default router;
