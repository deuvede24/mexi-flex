// src/routes/testRoutes.js
// src/routes/testRoutes.js
import { Router } from 'express';
import { allAccess, userBoard, guestBoard, adminBoard } from '../controllers/testController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

router.get('/all', allAccess);
router.get('/user', authenticateToken(['user', 'admin']), userBoard);
router.get('/guest', authenticateToken(['guest', 'user', 'admin']), guestBoard);
router.get('/admin', authenticateToken(['admin']), adminBoard);
//aun no se si se elimina o no guest aquí
export default router;


