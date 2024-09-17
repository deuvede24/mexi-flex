import { Router } from 'express';
import { getComments, getCommentById, addComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { commentValidator } from '../validations/commentValidation.js'; // Añade esta línea

const router = Router();

router.get('/', authenticateToken(['user', 'admin']), getComments);
router.get('/:id', authenticateToken(['user', 'admin']), getCommentById);
router.post('/', authenticateToken(['user', 'admin']), commentValidator, addComment); // Añade commentValidator aquí
router.put('/:id', authenticateToken(['user', 'admin']), commentValidator, updateComment); // Añade commentValidator aquí
router.delete('/:id', authenticateToken(['admin']), deleteComment);

export default router;
