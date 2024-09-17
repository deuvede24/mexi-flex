import { Router } from 'express';
import { getIngredients, getIngredientById, addIngredient, updateIngredient, deleteIngredient } from '../controllers/ingredientController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { ingredientValidator } from '../validations/ingredientValidation.js';

const router = Router();

router.get('/', authenticateToken(['user', 'admin']), getIngredients);
router.get('/:id', authenticateToken(['user', 'admin']), getIngredientById);
router.post('/', authenticateToken(['user', 'admin']), ingredientValidator, addIngredient);
router.put('/:id', authenticateToken(['user', 'admin']), ingredientValidator, updateIngredient);
router.delete('/:id', authenticateToken(['admin']), deleteIngredient);

export default router;

