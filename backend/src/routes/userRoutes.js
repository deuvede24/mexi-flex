// src/routes/userRoutes.js
import { Router } from 'express';
import { getUser, getUsers, getUserById, createUser, updateUser, deleteUser, updateAvatar } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';

const router = Router();

// Ruta para obtener el perfil del usuario autenticado
router.get('/me', authenticateToken(), getUser);

// Ruta para actualizar el avatar del usuario autenticado
router.put('/avatar', authenticateToken(), updateAvatar);

// Ruta para subir la foto del usuario autenticado
//router.post('/upload-photo', authenticateToken(['user', 'admin']), uploadFileMiddleware, uploadPhoto);

// Rutas CRUD para administradores
router.get('/', authenticateToken(), getUsers); // Solo los administradores pueden obtener la lista de todos los usuarios
router.get('/:id', authenticateToken(), getUserById); // Solo los administradores pueden obtener un usuario por ID
router.post('/', authenticateToken(), createUser); // Solo los administradores pueden crear usuarios
router.put('/:id', authenticateToken(), updateUser); // Solo los administradores pueden actualizar usuarios
router.delete('/:id', authenticateToken(), deleteUser); // Solo los administradores pueden eliminar usuarios

export default router;
