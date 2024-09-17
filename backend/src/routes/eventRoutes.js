import { Router } from 'express';
import { getEvents, getEventById, addEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js'; // Autenticación
import { eventValidator } from '../validations/eventValidation.js'; // Validación

const router = Router();

// Rutas protegidas por autenticación
router.get('/', authenticateToken(['user', 'admin']), getEvents);
router.get('/:id', authenticateToken(['user', 'admin']), getEventById);
router.post('/', authenticateToken(['user', 'admin']), eventValidator, addEvent);
router.put('/:id', authenticateToken(['user', 'admin']), eventValidator, updateEvent);
router.delete('/:id', authenticateToken(['user', 'admin']), deleteEvent);

export default router;
