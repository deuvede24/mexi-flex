import { body } from 'express-validator';

export const commentValidator = [
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 5 }).withMessage('Content must be at least 5 characters long'),
  body('user_id')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be an integer'),
  body('recipe_id')
    .notEmpty().withMessage('Recipe ID is required')
    .isInt().withMessage('Recipe ID must be an integer'),
];

