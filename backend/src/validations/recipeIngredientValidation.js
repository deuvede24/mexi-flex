import { body } from 'express-validator';

export const recipeIngredientValidator = [
  body('recipe_id')
    .notEmpty().withMessage('Recipe ID is required')
    .isInt().withMessage('Recipe ID must be an integer'),
  body('ingredient_id')
    .notEmpty().withMessage('Ingredient ID is required')
    .isInt().withMessage('Ingredient ID must be an integer'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isString().withMessage('Quantity must be a string'),
];
