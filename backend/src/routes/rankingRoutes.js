import { Router } from 'express';
import { getRankings, getRankingById, addOrUpdateRanking, deleteRanking } from '../controllers/rankingController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { rankingValidator } from '../validations/rankingValidation.js';

const router = Router();

// Obtener todos los rankings del usuario
router.get('/', authenticateToken(), getRankings); // Solo usuarios autenticados pueden obtener sus rankings

// Obtener un ranking por ID
router.get('/:id', authenticateToken(), getRankingById); // Solo usuarios autenticados pueden ver un ranking específico

// Añadir o actualizar un ranking con validación
router.post('/', authenticateToken(), rankingValidator, addOrUpdateRanking); // Solo usuarios autenticados pueden añadir o actualizar rankings

// Eliminar un ranking por ID
router.delete('/:id', authenticateToken(), deleteRanking); // Solo usuarios autenticados pueden eliminar sus rankings

export default router;
