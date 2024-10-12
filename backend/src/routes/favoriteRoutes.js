import { Router } from 'express';
import { getFavorites, getFavoriteById, addFavorite, deleteFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { favoriteValidator } from '../validations/favoriteValidation.js';

const router = Router();

// Obtener todos los favoritos del usuario
router.get('/', authenticateToken(), getFavorites); // Solo usuarios autenticados pueden ver sus favoritos

// Obtener un favorito por ID
router.get('/:id', authenticateToken(), getFavoriteById); // Solo usuarios autenticados pueden ver un favorito específico

// Añadir un nuevo favorito
router.post('/', authenticateToken(), favoriteValidator, addFavorite); // Solo usuarios autenticados pueden añadir favoritos

// Eliminar un favorito por ID
router.delete('/:id', authenticateToken(), deleteFavorite); // Solo usuarios autenticados pueden eliminar sus favoritos

export default router;


