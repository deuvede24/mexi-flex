// src/validations/recipeValidation.js
import { body, param } from 'express-validator';

/*export const recipeValidator = [
  body('title').exists().withMessage('Title is required').isString().withMessage('Title should be a string').isLength({ min: 5 }).withMessage('Title should be at least 5 characters'),
  body('ingredients').exists().withMessage('Ingredients are required').isString().withMessage('Ingredients should be a string'),
  body('instructions').exists().withMessage('Instructions are required').isString().withMessage('Instructions should be a string'),
];*/


export const recipeValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('steps').notEmpty().withMessage('Steps are required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('is_premium').isBoolean().withMessage('Is premium should be a boolean'),
  body('ingredients').notEmpty().withMessage('Ingredients are required')  // Añadimos ingredientes también
];
// Validador para PATCH (permitir actualizaciones parciales)
export const recipeValidatorPatch = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty if provided'),
  body('steps').optional().notEmpty().withMessage('Steps cannot be empty if provided'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty if provided'),
  body('is_premium').optional().isBoolean().withMessage('Is premium should be a boolean'),
  body('ingredients').optional().notEmpty().withMessage('Ingredients cannot be empty if provided')
];

export const idValidator = [
  param('id').isInt().withMessage('Invalid ID'),
];
