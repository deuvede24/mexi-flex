import { body } from 'express-validator';

export const favoriteValidator = [
  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be an integer'),
  body('recipe_id')
    .notEmpty().withMessage('Recipe ID is required')
    .isInt().withMessage('Recipe ID must be an integer'),
];
