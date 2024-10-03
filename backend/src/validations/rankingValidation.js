import { body } from 'express-validator';

export const rankingValidator = [
  // Validación para recipe_id
  body('recipe_id')
    .notEmpty().withMessage('Recipe ID is required')
    .isInt().withMessage('Recipe ID must be an integer'),
  
  // Validación para score (ahora usamos 'rating' en lugar de 'score' para consistencia)
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5')
];
