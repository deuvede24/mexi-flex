import MapLocation from "../models/mapModel.js";

// Obtener todas las ubicaciones
export const getMapLocations = async (req, res) => {
  try {
    const locations = await MapLocation.findAll();
    res.json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener las ubicaciones del mapa." });
  }
};

// Crear una nueva ubicación
export const createMapLocation = async (req, res) => {
  const { name, description, latitude, longitude, category } = req.body;

  try {
    const newLocation = await MapLocation.create({
      name,
      description,
      latitude,
      longitude,
      category,
    });
    console.log("Ubicación creada:", newLocation);
    //res.status(201).json({ message: 'Ubicación creada correctamente.', newLocation });
    res.status(201).json({
      message: "Ubicación creada correctamente.",
      newLocation: {
        id: newLocation.id,
        name: newLocation.name,
        description: newLocation.description,
        latitude: Number(newLocation.latitude), // Convertimos explícitamente a número
        longitude: Number(newLocation.longitude), // Convertimos explícitamente a número
        category: newLocation.category, // Incluimos la categoría en la respuesta
      },
    });
  } catch (error) {
    console.error("Error al crear la ubicación del mapa:", error);
    res.status(500).json({ error: "Error al crear la ubicación del mapa." });
  }
};

// Actualizar una ubicación existente
export const updateMapLocation = async (req, res) => {
  const { id } = req.params;
  const { name, description, latitude, longitude, category } = req.body;

  try {
    const location = await MapLocation.findByPk(id);
    if (!location) {
      return res.status(404).json({ error: "Ubicación no encontrada." });
    }

    location.name = name || location.name;
    location.description = description || location.description;
    location.latitude = latitude || location.latitude;
    location.longitude = longitude || location.longitude;
    location.category = category || location.category; // Actualizamos la categoría si se proporcionó

    await location.save();

    res.json({ message: "Ubicación actualizada correctamente.", location });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar la ubicación del mapa." });
  }
};

// Eliminar una ubicación
export const deleteMapLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await MapLocation.findByPk(id);
    if (!location) {
      return res.status(404).json({ error: "Ubicación no encontrada." });
    }

    await location.destroy();
    res.json({ message: "Ubicación eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la ubicación del mapa." });
  }
};

// Obtener una ubicación por su ID
export const getLocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await MapLocation.findByPk(id); // Utiliza findByPk para buscar por ID
    if (!location) {
      return res.status(404).json({ error: "Ubicación no encontrada." });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la ubicación." });
  }
};
