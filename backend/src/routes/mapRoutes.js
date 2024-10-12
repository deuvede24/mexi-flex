import { Router } from "express";
import {
  getMapLocations,
  getLocationById,
} from "../controllers/mapController.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// **Ruta para obtener el token de Mapbox**
router.get("/token", (req, res) => {
  res.json({ mapboxToken: process.env.MAPBOX_TOKEN });
});

// **Rutas para obtener ubicaciones** - Los usuarios autenticados pueden ver las ubicaciones
router.get("/locations", getMapLocations); // Obtener todas las ubicaciones
router.get("/locations/:id", getLocationById); // Obtener una ubicación por ID

// **Rutas de administración (para el backend, no accesibles para los usuarios)**
// Las siguientes rutas no son accesibles desde el frontend y están destinadas a la gestión desde el backend.
// Estas rutas no deben ser expuestas a los usuarios.

export default router;
