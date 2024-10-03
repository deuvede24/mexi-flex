import Favorite from '../models/favoriteModel.js';

// Obtener todos los favoritos de un usuario
export const getFavorites = async (req, res) => {
  try {
    const { user_id } = req.user;  // Se asume que el ID de usuario viene del token
    const favorites = await Favorite.findAll({ where: { user_id } });
    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ message: 'Error fetching favorites.' });
  }
};

// Obtener un favorito por ID
export const getFavoriteById = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.findByPk(id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }
    return res.status(200).json(favorite);
  } catch (error) {
    console.error("Error fetching favorite by ID:", error);
    return res.status(500).json({ message: 'Error fetching favorite by ID.' });
  }
};

// Añadir una receta a favoritos
export const addFavorite = async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;
    const existingFavorite = await Favorite.findOne({ where: { user_id, recipe_id } });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Recipe is already in favorites.' });
    }

    const favorite = await Favorite.create({ user_id, recipe_id });
    return res.status(201).json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ message: 'Error adding favorite.' });
  }
};

// Eliminar un favorito
export const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.destroy({ where: { id } });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    return res.status(200).json({ message: 'Favorite removed successfully.' });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return res.status(500).json({ message: 'Error deleting favorite.' });
  }
};
