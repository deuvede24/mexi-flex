import { Router } from 'express';
import { getEvents, getEventById, addEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js'; // Autenticación
import { eventValidator } from '../validations/eventValidation.js'; // Validación

const router = Router();

// **Rutas para todos los usuarios autenticados** - Los usuarios logueados solo podrán ver los eventos
router.get('/', authenticateToken(), getEvents); // Obtener todos los eventos
router.get('/:id', authenticateToken(), getEventById); // Obtener un evento por ID

// **Rutas para el administrador (que gestionará eventos desde el backend)** - Solo el admin puede agregar, actualizar o eliminar eventos
// Estas rutas NO estarán accesibles desde el frontend, el admin gestionará esto directamente en el backend
router.post('/', eventValidator, addEvent); // Añadir un evento
router.put('/:id', eventValidator, updateEvent); // Actualizar un evento
router.delete('/:id', deleteEvent); // Eliminar un evento

export default router;
