import { body, param } from 'express-validator';

// Validador para ingredientes
export const recipeIngredientValidator = [
  body('ingredient_name')
    .notEmpty()
    .withMessage('Ingredient name is required')
    .isString()
    .withMessage('Ingredient name should be a string'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isString()
    .withMessage('Quantity should be a string')
];

// Validador para ID de ingredientes
export const idValidator = [
  param('id').isInt().withMessage('Invalid ID'),
];
