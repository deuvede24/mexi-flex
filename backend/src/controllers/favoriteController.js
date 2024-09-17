import Favorite from '../models/favoriteModel.js';
import { validationResult } from 'express-validator';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll();
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavoriteById = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.findByPk(id);
    if (favorite) {
      res.status(200).json({ favorite });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { user_id, recipe_id } = req.body;
    const newFavorite = await Favorite.create({ user_id, recipe_id });
    res.status(201).json({ newFavorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Favorite.destroy({ where: { id_favorite: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

