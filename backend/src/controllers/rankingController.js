import Ranking from "../models/rankingModel.js";
import { validationResult } from "express-validator";

// Obtener todos los rankings de un usuario
export const getRankings = async (req, res) => {
  try {
    const { user_id } = req.user; // Se asume que el ID de usuario viene del token
    const rankings = await Ranking.findAll({ where: { user_id } });
    return res.status(200).json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return res.status(500).json({ message: "Error fetching rankings." });
  }
};

// Obtener un ranking por ID
export const getRankingById = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.findByPk(id);
    if (!ranking) {
      return res.status(404).json({ message: "Ranking not found." });
    }
    return res.status(200).json(ranking);
  } catch (error) {
    console.error("Error fetching ranking by ID:", error);
    return res.status(500).json({ message: "Error fetching ranking by ID." });
  }
};

// Añadir o actualizar una valoración (ranking)
export const addOrUpdateRanking = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { recipe_id, rating } = req.body;
    
     // Verificar que todos los campos necesarios están presentes
     if (!recipe_id || !rating) {
      return res.status(400).json({ message: "Missing recipe_id or rating." });
    }

    // Buscar si ya existe una valoración para esta receta y usuario
    const existingRanking = await Ranking.findOne({
      where: { user_id, recipe_id },
    });

    if (existingRanking) {
      // Si ya existe, actualizar el ranking
      existingRanking.rating = rating;
      await existingRanking.save();
      return res.status(200).json(existingRanking);
    } else {
      // Si no existe, crear una nueva valoración
      const newRanking = await Ranking.create({ user_id, recipe_id, rating });
      return res.status(201).json(newRanking);
    }
  } catch (error) {
    console.error("Error adding or updating ranking:", error);
    return res
      .status(500)
      .json({ message: "Error adding or updating ranking." });
  }
};

// Eliminar una valoración (ranking)
export const deleteRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.destroy({ where: { id } });

    if (!ranking) {
      return res.status(404).json({ message: "Ranking not found." });
    }

    return res.status(200).json({ message: "Ranking removed successfully." });
  } catch (error) {
    console.error("Error deleting ranking:", error);
    return res.status(500).json({ message: "Error deleting ranking." });
  }
};
