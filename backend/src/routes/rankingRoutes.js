import { Router } from 'express';
import { getRankings, getRankingById, addOrUpdateRanking, deleteRanking } from '../controllers/rankingController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { rankingValidator } from '../validations/rankingValidation.js';

const router = Router();

// Obtener todos los rankings del usuario
router.get('/', authenticateToken(['user', 'admin']), getRankings);

// Obtener un ranking por ID
router.get('/:id', authenticateToken(['user', 'admin']), getRankingById);

// Añadir o actualizar un ranking con validación
router.post('/', authenticateToken(['user', 'admin']), rankingValidator, addOrUpdateRanking);

// Eliminar un ranking por ID
router.delete('/:id', authenticateToken(['admin']), deleteRanking);

export default router;
